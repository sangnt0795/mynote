import { useEffect, useState } from 'react';
import { userRepository } from '../repositories/userRepository';
import { AppUser, UserRole, UserStatus } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';

export function UsersPage() {
  const { appUser, isRoot } = useAuth();
  const [items, setItems] = useState<AppUser[]>([]);
  async function load() { setItems((await userRepository.list()).sort((a,b) => a.email.localeCompare(b.email))); }
  useEffect(() => { load(); }, []);
  async function updateUser(u: AppUser, data: Partial<AppUser>) {
    if (!appUser) return;
    await userRepository.update(u.uid, { ...data, approvedBy: data.status === 'approved' ? appUser.uid : u.approvedBy } as any);
    await load();
  }
  return <div className="page-stack">
    <div className="toolbar"><div><h2>Users</h2><p>Duyệt tài khoản, khóa user, phân quyền.</p></div></div>
    {items.length === 0 ? <EmptyState title="Chưa có user"/> : <div className="table-card"><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(u => <tr key={u.uid}>
      <td><b>{u.displayName || u.email}</b><br/><small>{u.email}</small></td>
      <td><select disabled={!isRoot || u.uid === appUser?.uid} value={u.role} onChange={e => updateUser(u, { role:e.target.value as UserRole })}><option value="user">user</option><option value="admin">admin</option><option value="root">root</option></select></td>
      <td><select value={u.status} disabled={u.uid === appUser?.uid} onChange={e => updateUser(u, { status:e.target.value as UserStatus })}><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option><option value="locked">locked</option></select></td>
      <td><div className="row-actions"><button className="ghost-btn" disabled={u.uid === appUser?.uid} onClick={() => updateUser(u, { status:'approved' })}>Duyệt</button><button className="danger-btn" disabled={u.uid === appUser?.uid} onClick={() => updateUser(u, { status:'locked' })}>Khóa</button></div></td>
    </tr>)}</tbody></table></div>}
  </div>;
}
