import { BookOpen, Folder, Home, LogOut, Menu, Shield, Tags, Users, X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export type PageKey = 'dashboard' | 'notes' | 'public' | 'categories' | 'topics' | 'users' | 'settings';

const baseItems = [
  { key: 'dashboard' as PageKey, label: 'Dashboard', icon: Home },
  { key: 'notes' as PageKey, label: 'My Notes', icon: BookOpen },
  { key: 'public' as PageKey, label: 'Public Notes', icon: Tags },
  { key: 'categories' as PageKey, label: 'Categories', icon: Folder },
  { key: 'topics' as PageKey, label: 'Topics', icon: Tags },
];
const adminItems = [
  { key: 'users' as PageKey, label: 'Users', icon: Users },
  { key: 'settings' as PageKey, label: 'Settings', icon: Shield },
];

export function Layout({ page, setPage, children }: { page: PageKey; setPage: (p: PageKey) => void; children: ReactNode }) {
  const { appUser, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const items = isAdmin ? [...baseItems, ...adminItems] : baseItems;

  function go(p: PageKey) { setPage(p); setOpen(false); }

  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">MN</div>
        <div><b>MyNote Atelier</b><span>Skill knowledge studio</span></div>
      </div>
      <nav className="nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          return <button key={item.key} className={`nav-item ${page === item.key ? 'active' : ''}`} onClick={() => go(item.key)}>
            <Icon size={18}/><span>{item.label}</span>
          </button>;
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card">
          <b>{appUser?.displayName || appUser?.email}</b>
          <span>{appUser?.role} · {appUser?.status}</span>
        </div>
        <button className="ghost-btn full" onClick={logout}><LogOut size={16}/> Đăng xuất</button>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu size={22}/></button>
        <div>
          <h1>{items.find(x => x.key === page)?.label || 'MyNote'}</h1>
          <p>Ghi chú skill, media mẫu và tri thức cá nhân theo phong cách editorial.</p>
        </div>
      </header>
      <section className="content">{children}</section>
    </main>
    {open && <div className="backdrop" onClick={() => setOpen(false)}><button className="close"><X/></button></div>}
  </div>;
}
