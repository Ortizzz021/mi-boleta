import type { TicketStatus } from '../../types/ticket.types';
import type { PaginationMeta } from '../../types/api.types';
import './Shared.css';

interface BadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  const classMap: Record<TicketStatus, string> = {
    Pendiente: 'badge-pendiente',
    Ganado: 'badge-ganado',
    Perdido: 'badge-perdido',
  };

  const iconMap: Record<TicketStatus, string> = {
    Pendiente: '⏳',
    Ganado: '🏆',
    Perdido: '❌',
  };

  return (
    <span className={`badge ${classMap[status]}`}>
      {iconMap[status]} {status}
    </span>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="spinner-container">
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{message}</p>
      {action && <div style={{ marginTop: 'var(--space-lg)' }}>{action}</div>}
    </div>
  );
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = meta;

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {start > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="pagination-info">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`pagination-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination-info">…</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
      >
        ›
      </button>

      <span className="pagination-info">{total} resultados</span>
    </div>
  );
}
