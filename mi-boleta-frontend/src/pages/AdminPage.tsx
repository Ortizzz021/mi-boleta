import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsService } from '../api/tickets.service';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge, Spinner, EmptyState, Pagination } from '../components/ui/Shared';
import { formatDateShort, formatCurrency } from '../utils/formatters';
import { getGameTypeIcon } from '../utils/constants';
import type { AdminTicket, TicketStatus, GameType } from '../types/ticket.types';
import type { PaginationMeta } from '../types/api.types';
import { GAME_TYPES, TICKET_STATUSES } from '../types/ticket.types';
import './Tickets.css';
import './Admin.css';

export function AdminPage() {
  const navigate = useNavigate();

  // State
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 10, totalPages: 1, total: 0 });
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
  const [ticketToDelete, setTicketToDelete] = useState<AdminTicket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle search query debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1); // Reset to first page when query changes
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  // Fetch tickets
  useEffect(() => {
    loadTickets();
  }, [debouncedQ, status, gameType, page]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketsService.getAdminTickets({
        q: debouncedQ || undefined,
        status: status || undefined,
        gameType: gameType || undefined,
        page,
        pageSize: 10,
      });
      setTickets(response.data);
      setMeta(response.meta);
    } catch {
      setError('Error al cargar la base de datos de boletas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (ticket: AdminTicket) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      setDeleteLoading(true);
      await ticketsService.deleteTicket(ticketToDelete.id);
      setTicketToDelete(null);
      // Reload tickets
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🛡️ Panel de Administración</h1>
        <p className="page-subtitle">Visualiza y gestiona todas las boletas de los usuarios en el sistema</p>
      </div>

      <div className="tickets-toolbar animate-fade-in-up">
        <div className="tickets-search">
          <span className="tickets-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por usuario, correo, título, número..."
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
          icon="🛡️"
          title="No se encontraron registros"
          message="No hay ninguna boleta que coincida con los criterios de búsqueda seleccionados."
        />
      ) : (
        <div className="admin-container animate-fade-in-up">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <div className="owner-info">
                        <span className="owner-name">{ticket.owner.name}</span>
                        <span className="owner-email">{ticket.owner.email}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${ticket.id}`)}>
                        {ticket.title}
                      </strong>
                    </td>
                    <td>
                      <span style={{ marginRight: '6px' }}>{getGameTypeIcon(ticket.gameType)}</span>
                      {ticket.gameType}
                    </td>
                    <td>{ticket.gameNumber ? `#${ticket.gameNumber}` : '—'}</td>
                    <td>{formatDateShort(ticket.gameDate)}</td>
                    <td>{formatCurrency(ticket.amount)}</td>
                    <td>
                      <div className="admin-badge-container">
                        <StatusBadge status={ticket.status} />
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="ticket-action-btn"
                          title="Detalles"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="ticket-action-btn"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ticket)}
                          className="ticket-action-btn delete"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={ticketToDelete !== null}
        onClose={() => setTicketToDelete(null)}
        title="Confirmar eliminación (Admin)"
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
        <p>
          ¿Estás seguro de que deseas eliminar la boleta <strong>"{ticketToDelete?.title}"</strong> de{' '}
          <strong>{ticketToDelete?.owner.name}</strong>?
        </p>
        <p style={{ marginTop: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Esta acción eliminará el registro permanentemente del sistema de este usuario.
        </p>
      </Modal>
    </div>
  );
}
