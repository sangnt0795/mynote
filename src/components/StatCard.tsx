import { ReactNode } from 'react';
export function StatCard({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><b>{value}</b></div>;
}
