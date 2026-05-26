import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { categoryRepository } from '../repositories/categoryRepository';
import { topicRepository } from '../repositories/topicRepository';
import { noteRepository } from '../repositories/noteRepository';
import { Category, MediaLink, Note, Topic, Visibility } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { buildSearchKeywords, parseTags } from '../utils/slug';

const emptyMedia: MediaLink = { type: 'link', source: 'other', url: '', title: '', thumbnail: '', description: '', order: 1 };
const emptyForm = { categoryId: '', topicId: '', title: '', description: '', content: '', visibility: 'private' as Visibility, tagsText: '', mediaLinks: [] as MediaLink[] };

export function NotesPage({ publicMode = false }: { publicMode?: boolean }) {
  const { appUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [items, setItems] = useState<Note[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const [cats, allTopics, notes] = await Promise.all([
      categoryRepository.activeList(),
      topicRepository.list(),
      publicMode ? noteRepository.publicNotes() : appUser ? noteRepository.myNotes(appUser.uid) : Promise.resolve([]),
    ]);
    setCategories(cats); setTopics(allTopics.filter(x => !x.deletedAt)); setItems(notes);
  }
  useEffect(() => { load(); }, [appUser, publicMode]);

  const filtered = useMemo(() => {
    const k = query.trim().toLowerCase();
    if (!k) return items;
    return items.filter(n => [n.title, n.description, n.content, n.tags.join(' ')].join(' ').toLowerCase().includes(k));
  }, [items, query]);
  function catName(id: string) { return categories.find(c => c.categoryId === id)?.name || id; }
  function topicName(id?: string | null) { return topics.find(t => t.topicId === id)?.title || ''; }
  function startEdit(item?: Note) {
    setEditing(item || null);
    setForm(item ? {
      categoryId: item.categoryId,
      topicId: item.topicId || '',
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      visibility: item.visibility,
      tagsText: item.tags.join(', '),
      mediaLinks: item.mediaLinks || [],
    } : { ...emptyForm, categoryId: categories[0]?.categoryId || '' });
    setOpen(true);
  }
  function updateMedia(index: number, value: Partial<MediaLink>) {
    setForm(f => ({ ...f, mediaLinks: f.mediaLinks.map((m, i) => i === index ? { ...m, ...value } : m) }));
  }
  async function save() {
    if (!appUser || !form.title.trim() || !form.categoryId) return;
    const tags = parseTags(form.tagsText);
    const data = {
      userId: appUser.uid,
      categoryId: form.categoryId,
      topicId: form.topicId || null,
      title: form.title,
      description: form.description,
      content: form.content,
      mediaLinks: form.mediaLinks.filter(m => m.url.trim()),
      visibility: form.visibility,
      tags,
      searchKeywords: buildSearchKeywords(`${form.title} ${form.description} ${form.content}`, tags),
      updatedBy: appUser.uid,
      deletedAt: null,
      deletedBy: null,
      deleteReason: null,
    };
    if (editing) await noteRepository.update(editing.noteId, data as any);
    else await noteRepository.createAuto({ ...data, createdBy: appUser.uid } as any);
    setOpen(false); await load();
  }
  async function remove(item: Note) {
    if (!appUser || !confirm('Xóa mềm note này?')) return;
    await noteRepository.softDelete(item.noteId, appUser.uid); await load();
  }

  return <div className="page-stack">
    <div className="toolbar"><div><h2>{publicMode ? 'Public Notes' : 'My Notes'}</h2><p>{publicMode ? 'Kho note public của mọi người.' : 'Ghi chú cá nhân theo skill.'}</p></div>{!publicMode && <button className="primary-btn" onClick={() => startEdit()}>Thêm note</button>}</div>
    <input className="search-input" placeholder="Tìm theo tiêu đề, nội dung, tag..." value={query} onChange={e => setQuery(e.target.value)}/>
    {filtered.length === 0 ? <EmptyState title="Không có note"/> : <div className="note-grid">{filtered.map(item => <article className="note-card" key={item.noteId}>
      <div className="note-head"><span>{catName(item.categoryId)}</span>{item.visibility === 'public' && <small>public</small>}</div>
      <h3>{item.title}</h3><p>{item.description}</p>
      <small>{topicName(item.topicId)} {item.tags.map(t => `#${t}`).join(' ')}</small>
      <div className="media-list">{(item.mediaLinks || []).slice(0,3).map((m, i) => <a href={m.url} target="_blank" key={i}>{m.title || m.type}</a>)}</div>
      {!publicMode && <div className="row-actions"><button className="ghost-btn" onClick={() => startEdit(item)}>Sửa</button><button className="danger-btn" onClick={() => remove(item)}>Xóa</button></div>}
    </article>)}</div>}
    <Modal title={editing ? 'Sửa note' : 'Thêm note'} open={open} onClose={() => setOpen(false)}>
      <div className="form-grid wide">
        <label>Category<select value={form.categoryId} onChange={e => setForm({...form, categoryId:e.target.value, topicId:''})}>{categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}</select></label>
        <label>Topic<select value={form.topicId} onChange={e => setForm({...form, topicId:e.target.value})}><option value="">Không chọn</option>{topics.filter(t => t.categoryId === form.categoryId).map(t => <option key={t.topicId} value={t.topicId}>{t.title}</option>)}</select></label>
        <label>Tiêu đề<input value={form.title} onChange={e => setForm({...form, title:e.target.value})}/></label>
        <label>Mô tả<textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})}/></label>
        <label>Nội dung<textarea rows={6} value={form.content} onChange={e => setForm({...form, content:e.target.value})}/></label>
        <label>Visibility<select value={form.visibility} onChange={e => setForm({...form, visibility:e.target.value as Visibility})}><option value="private">private</option><option value="public">public</option><option value="shared">shared</option></select></label>
        <label>Tags, cách nhau bằng dấu phẩy<input value={form.tagsText} onChange={e => setForm({...form, tagsText:e.target.value})}/></label>
        <div className="media-editor"><div className="toolbar small"><b>Media Links</b><button className="ghost-btn" onClick={() => setForm({...form, mediaLinks:[...form.mediaLinks, {...emptyMedia, order: form.mediaLinks.length + 1}]})}>Thêm media</button></div>
          {form.mediaLinks.map((m, i) => <div className="media-row" key={i}>
            <select value={m.type} onChange={e => updateMedia(i, { type:e.target.value as any })}><option value="image">image</option><option value="video">video</option><option value="file">file</option><option value="link">link</option></select>
            <select value={m.source} onChange={e => updateMedia(i, { source:e.target.value as any })}><option value="google_drive">google_drive</option><option value="facebook">facebook</option><option value="youtube">youtube</option><option value="local">local</option><option value="other">other</option></select>
            <input placeholder="Title" value={m.title || ''} onChange={e => updateMedia(i, { title:e.target.value })}/>
            <input placeholder="URL" value={m.url} onChange={e => updateMedia(i, { url:e.target.value })}/>
            <button className="danger-btn" onClick={() => setForm(f => ({...f, mediaLinks:f.mediaLinks.filter((_, idx) => idx !== i)}))}>X</button>
          </div>)}
        </div>
      </div><div className="modal-actions"><button className="primary-btn" onClick={save}>Lưu</button></div>
    </Modal>
  </div>;
}
