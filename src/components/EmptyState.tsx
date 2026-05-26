export function EmptyState({ title, description }: { title: string; description?: string }) {
  return <div className="empty-state"><b>{title}</b>{description && <p>{description}</p>}</div>;
}
