import { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { categoryRepository } from '../repositories/categoryRepository';
import { Category } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { slugify } from '../utils/slug';

const emptyForm = { name: '', description: '', icon: '', color: '#2563eb', order: 1 };

export function CategoriesPage() {
  const { appUser, isAdmin } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() { setItems(await categoryRepository.activeList()); }
  useEffect(() => { load(); }, []);

  function startEdit(item?: Category) {
    setEditing(item || null);
    setForm(item ? { name: item.name, description: item.description || '', icon: item.icon || '', color: item.color || '#2563eb', order: item.order } : emptyForm);
    setOpen(true);
  }
  async function save() {
    if (!appUser || !form.name.trim()) return;
    const data = { ...form, slug: slugify(form.name), active: true, updatedBy: appUser.uid };
    if (editing) await categoryRepository.update(editing.categoryId, data);
    else await categoryRepository.createAuto({ ...data, createdBy: appUser.uid, deletedAt: null, deletedBy: null } as any);
    setOpen(false); await load();
  }
  async function remove(item: Category) {
    if (!appUser || !confirm('Xóa mềm category này?')) return;
    await categoryRepository.softDelete(item.categoryId, appUser.uid); await load();
  }

  return <div className="page-stack">
    <div className="toolbar"><div><h2>Categories</h2><p>Nhóm kỹ năng lớn: CapCut, Excel, Flutter...</p></div>{isAdmin && <button className="primary-btn" onClick={() => startEdit()}>Thêm category</button>}</div>
    {items.length === 0 ? <EmptyState title="Chưa có category"/> : <div className="card-grid">{items.map(item => <div className="data-card" key={item.categoryId}>
      <div className="color-dot" style={{ background: item.color || '#111827' }} />
      <h3>{item.name}</h3><p>{item.description}</p><small>slug: {item.slug} · order: {item.order}</small>
      {isAdmin && <div className="row-actions"><button className="ghost-btn" onClick={() => startEdit(item)}>Sửa</button><button className="danger-btn" onClick={() => remove(item)}>Xóa</button></div>}
    </div>)}</div>}
    <Modal title={editing ? 'Sửa category' : 'Thêm category'} open={open} onClose={() => setOpen(false)}>
      <div className="form-grid">
        <label>Tên<input value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></label>
        <label>Mô tả<textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})}/></label>
        <label>Icon/URL<input value={form.icon} onChange={e => setForm({...form, icon:e.target.value})}/></label>
        <label>Màu<input type="color" value={form.color} onChange={e => setForm({...form, color:e.target.value})}/></label>
        <label>Thứ tự<input type="number" value={form.order} onChange={e => setForm({...form, order:Number(e.target.value)})}/></label>
      </div><div className="modal-actions"><button className="primary-btn" onClick={save}>Lưu</button></div>
    </Modal>
  </div>;
}
