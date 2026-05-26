import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, rootEmail } from '../firebase/firebase';

export function SettingsPage() {
  const [form, setForm] = useState({ rootEmail, allowUserRegister: true, requireRootApproval: true, defaultUserRole: 'user' });
  const [saved, setSaved] = useState(false);
  useEffect(() => { (async () => {
    const snap = await getDoc(doc(db, 'app_settings', 'root'));
    if (snap.exists()) setForm({ ...form, ...(snap.data() as any) });
  })(); }, []);
  async function save() {
    await setDoc(doc(db, 'app_settings', 'root'), { ...form, updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true });
    setSaved(true);
  }
  return <div className="page-stack">
    <div className="toolbar"><div><h2>App Settings</h2><p>Cấu hình hệ thống cho MyNote.</p></div></div>
    <div className="form-card">
      <label>Root email<input value={form.rootEmail} onChange={e => setForm({...form, rootEmail:e.target.value})}/></label>
      <label className="inline-check"><input type="checkbox" checked={form.allowUserRegister} onChange={e => setForm({...form, allowUserRegister:e.target.checked})}/> Cho phép đăng ký</label>
      <label className="inline-check"><input type="checkbox" checked={form.requireRootApproval} onChange={e => setForm({...form, requireRootApproval:e.target.checked})}/> User mới cần duyệt</label>
      <label>Role mặc định<select value={form.defaultUserRole} onChange={e => setForm({...form, defaultUserRole:e.target.value})}><option value="user">user</option><option value="admin">admin</option></select></label>
      <button className="primary-btn" onClick={save}>Lưu cấu hình</button>{saved && <small>Đã lưu.</small>}
    </div>
  </div>;
}
