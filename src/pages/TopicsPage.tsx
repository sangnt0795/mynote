import { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { categoryRepository } from '../repositories/categoryRepository';
import { topicRepository } from '../repositories/topicRepository';
import { Category, Topic, TopicType } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { slugify } from '../utils/slug';

const emptyForm = { categoryId: '', title: '', description: '', type: 'skill' as TopicType, order: 1 };

export function TopicsPage() {
  const { appUser, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Topic[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const cats = await categoryRepository.activeList();
    setCategories(cats);
    const topics = await topicRepository.list();
    setItems(topics.filter(x => !x.deletedAt).sort((a,b) => a.order - b.order));
    if (!form.categoryId && cats[0]) setForm(f => ({ ...f, categoryId: cats[0].categoryId }));
  }
  useEffect(() => { load(); }, []);
  function catName(id: string) { return categories.find(c => c.categoryId === id)?.name || id; }
  function startEdit(item?: Topic) {
    setEditing(item || null);
    setForm(item ? { categoryId: item.categoryId, title: item.title, description: item.description || '', type: item.type, order: item.order } : { ...emptyForm, categoryId: categories[0]?.categoryId || '' });
    setOpen(true);
  }
  async function save() {
    if (!appUser || !form.title.trim() || !form.categoryId) return;
    const data = { ...form, slug: slugify(form.title), active: true, updatedBy: appUser.uid };
    if (editing) await topicRepository.update(editing.topicId, data);
    else await topicRepository.createAuto({ ...data, createdBy: appUser.uid, deletedAt: null, deletedBy: null } as any);
    setOpen(false); await load();
  }
  async function remove(item: Topic) {
    if (!appUser || !confirm('Xóa mềm topic này?')) return;
    await topicRepository.softDelete(item.topicId, appUser.uid); await load();
  }

  return <div className="page-stack">
    <div className="toolbar"><div><h2>Topics</h2><p>Chủ đề nhỏ thuộc category.</p></div>{isAdmin && <button className="primary-btn" onClick={() => startEdit()}>Thêm topic</button>}</div>
    {items.length === 0 ? <EmptyState title="Chưa có topic"/> : <div className="table-card"><table><thead><tr><th>Topic</th><th>Category</th><th>Type</th><th>Order</th><th></th></tr></thead><tbody>{items.map(item => <tr key={item.topicId}>
      <td><b>{item.title}</b><br/><small>{item.description}</small></td><td>{catName(item.categoryId)}</td><td>{item.type}</td><td>{item.order}</td>
      <td>{isAdmin && <div className="row-actions"><button className="ghost-btn" onClick={() => startEdit(item)}>Sửa</button><button className="danger-btn" onClick={() => remove(item)}>Xóa</button></div>}</td>
    </tr>)}</tbody></table></div>}
    <Modal title={editing ? 'Sửa topic' : 'Thêm topic'} open={open} onClose={() => setOpen(false)}>
      <div className="form-grid">
        <label>Category<select value={form.categoryId} onChange={e => setForm({...form, categoryId:e.target.value})}>{categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}</select></label>
        <label>Tiêu đề<input value={form.title} onChange={e => setForm({...form, title:e.target.value})}/></label>
        <label>Mô tả<textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})}/></label>
        <label>Type<select value={form.type} onChange={e => setForm({...form, type:e.target.value as TopicType})}><option value="skill">skill</option><option value="lesson">lesson</option><option value="tool">tool</option><option value="other">other</option></select></label>
        <label>Thứ tự<input type="number" value={form.order} onChange={e => setForm({...form, order:Number(e.target.value)})}/></label>
      </div><div className="modal-actions"><button className="primary-btn" onClick={save}>Lưu</button></div>
    </Modal>
  </div>;
}
