import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketsService } from '../api/tickets.service';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge, Spinner, EmptyState, Pagination } from '../components/ui/Shared';
import { formatDateShort, formatCurrency } from '../utils/formatters';
import { getGameTypeIcon } from '../utils/constants';
import type { Ticket, TicketStatus, GameType } from '../types/ticket.types';
import type { PaginationMeta } from '../types/api.types';
import { GAME_TYPES, TICKET_STATUSES } from '../types/ticket.types';
import './Tickets.css';

export function TicketsPage() {
  const navigate = useNavigate();

  // State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 6, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [gameType, setGameType] = useState<GameType | ''>('');
  const [page, setPage] = useState(1);

  // Debounced search query
  const [debouncedQ, setDebouncedQ] = useState('');

  // Delete modal state
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle search query debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1); // Reset to first page when query changes
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  // Fetch tickets on filter or page change
  useEffect(() => {
    loadTickets();
  }, [debouncedQ, status, gameType, page]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketsService.getTickets({
        q: debouncedQ || undefined,
        status: status || undefined,
        gameType: gameType || undefined,
        page,
        pageSize: 6,
      });
      setTickets(response.data);
      setMeta(response.meta);
    } catch {
      setError('Error al cargar las boletas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation(); // Prevent card click
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      setDeleteLoading(true);
      await ticketsService.deleteTicket(ticketToDelete.id);
      setTicketToDelete(null);
      // Reload tickets (if current page becomes empty, we should go back a page)
      const isLastItemOnPage = tickets.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      setPage(newPage);
      loadTickets();
    } catch {
      alert('Error al eliminar la boleta. Intenta de nuevo.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1 className="page-title">Mis Boletas</h1>
            <p className="page-subtitle">Gestiona y revisa tus boletas registradas</p>
          </div>
          <Link to="/tickets/new">
            <Button variant="primary">➕ Nueva Boleta</Button>
          </Link>
        </div>
      </div>

      <div className="tickets-toolbar animate-fade-in-up">
        <div className="tickets-search">
          <span className="tickets-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título, lugar, número..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="tickets-filters">
          <select
            className="filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as TicketStatus | '');
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            {TICKET_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={gameType}
            onChange={(e) => {
              setGameType(e.target.value as GameType | '');
              setPage(1);
            }}
          >
            <option value="">Todos los tipos</option>
            {GAME_TYPES.map((gt) => (
              <option key={gt} value={gt}>
                {gt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon="🎟️"
          title="No se encontraron boletas"
          message={
            debouncedQ || status || gameType
              ? 'Intenta cambiar los filtros o el término de búsqueda.'
              : 'Empieza registrando tu primera boleta.'
          }
          action={
            !(debouncedQ || status || gameType) ? (
              <Link to="/tickets/new">
                <Button variant="primary">Registrar Boleta</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="tickets-grid stagger-children">
            {tickets.map((ticket) => (
              <div
                className="ticket-card animate-fade-in-up"
                key={ticket.id}
                onClick={() => handleCardClick(ticket.id)}
              >
                <div className="ticket-card-header">
                  <div className="ticket-card-type">
                    <span>{getGameTypeIcon(ticket.gameType)}</span>
                    <span>{ticket.gameType}</span>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>

                <h3 className="ticket-card-title">{ticket.title}</h3>

                <div className="ticket-card-details">
                  <div className="ticket-card-detail">
                    <span>📅</span>
                    <span>{formatDateShort(ticket.gameDate)}</span>
                  </div>
                  {ticket.gameNumber && (
                    <div className="ticket-card-detail">
                      <span>🔢</span>
                      <span>#{ticket.gameNumber}</span>
                    </div>
                  )}
                  {ticket.amount !== null && (
                    <div className="ticket-card-detail">
                      <span>💵</span>
                      <span>{formatCurrency(ticket.amount)}</span>
                    </div>
                  )}
                  {ticket.place && (
                    <div className="ticket-card-detail">
                      <span>📍</span>
                      <span>{ticket.place}</span>
                    </div>
                  )}
                </div>

                <div className="ticket-card-footer">
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Ver detalles
                  </span>
                  <div className="ticket-card-actions">
                    <Link
                      to={`/tickets/${ticket.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="ticket-action-btn"
                      title="Editar"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={(e) => handleDeleteClick(e, ticket)}
                      className="ticket-action-btn delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={ticketToDelete !== null}
        onClose={() => setTicketToDelete(null)}
        title="Confirmar eliminación"
        actions={
          <>
            <Button variant="ghost" onClick={() => setTicketToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleteLoading}>
              Eliminar
            </Button>
          </>
        }
      >
        <p>¿Estás seguro de que deseas eliminar la boleta <strong>"{ticketToDelete?.title}"</strong>?</p>
        <p style={{ marginTop: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
