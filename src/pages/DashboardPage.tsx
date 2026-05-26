import { useEffect, useState } from 'react';
import { BookOpen, Folder, Tags, Users } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { categoryRepository } from '../repositories/categoryRepository';
import { topicRepository } from '../repositories/topicRepository';
import { noteRepository } from '../repositories/noteRepository';
import { userRepository } from '../repositories/userRepository';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { appUser, isAdmin } = useAuth();
  const [stats, setStats] = useState({ categories: 0, topics: 0, notes: 0, users: 0 });
  useEffect(() => {
    async function load() {
      const [categories, topics, notes, users] = await Promise.all([
        categoryRepository.activeList(),
        topicRepository.list(),
        appUser ? noteRepository.myNotes(appUser.uid) : Promise.resolve([]),
        isAdmin ? userRepository.list() : Promise.resolve([]),
      ]);
      setStats({ categories: categories.length, topics: topics.length, notes: notes.length, users: users.length });
    }
    load();
  }, [appUser, isAdmin]);

  return <div className="page-stack">
    <div className="hero-card">
      <small className="hero-kicker">Curated Knowledge Desk</small>
      <div><h2>Xin chào, {appUser?.displayName || appUser?.email}</h2><p>Quản lý kiến thức theo Category → Topic → Note → Media Links.</p></div>
    </div>
    <div className="stat-grid">
      <StatCard label="Category" value={stats.categories} icon={<Folder/>}/>
      <StatCard label="Topic" value={stats.topics} icon={<Tags/>}/>
      <StatCard label="My Notes" value={stats.notes} icon={<BookOpen/>}/>
      {isAdmin && <StatCard label="Users" value={stats.users} icon={<Users/>}/>}
    </div>
  </div>;
}
