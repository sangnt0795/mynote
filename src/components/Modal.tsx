import { ReactNode } from 'react';

export function Modal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return <div className="modal-layer" onMouseDown={onClose}>
    <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}>×</button></div>
      {children}
    </div>
  </div>;
}
