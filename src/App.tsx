import { useState } from 'react';
import { Layout, PageKey } from './components/Layout';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { PendingPage } from './pages/PendingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TopicsPage } from './pages/TopicsPage';
import { NotesPage } from './pages/NotesPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const { firebaseUser, loading, isApproved, isAdmin } = useAuth();
  const [page, setPage] = useState<PageKey>('dashboard');
  if (loading) return <div className="center-screen">Đang tải...</div>;
  if (!firebaseUser) return <LoginPage />;
  if (!isApproved) return <PendingPage />;
  const safePage = (!isAdmin && ['users', 'settings'].includes(page)) ? 'dashboard' : page;
  return <Layout page={safePage} setPage={setPage}>
    {safePage === 'dashboard' && <DashboardPage />}
    {safePage === 'notes' && <NotesPage />}
    {safePage === 'public' && <NotesPage publicMode />}
    {safePage === 'categories' && <CategoriesPage />}
    {safePage === 'topics' && <TopicsPage />}
    {safePage === 'users' && isAdmin && <UsersPage />}
    {safePage === 'settings' && isAdmin && <SettingsPage />}
  </Layout>;
}
