import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketsService } from '../api/tickets.service';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge, Spinner } from '../components/ui/Shared';
import { formatDate, formatCurrency, formatDateTime } from '../utils/formatters';
import { getGameTypeIcon } from '../utils/constants';
import type { Ticket } from '../types/ticket.types';
import './Tickets.css';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketsService.getTicketById(id!);
      setTicket(response.data);
    } catch {
      setError('No se pudo encontrar la boleta solicitada.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!ticket) return;
    try {
      setDeleteLoading(true);
      await ticketsService.deleteTicket(ticket.id);
      navigate('/tickets');
    } catch {
      alert('Error al eliminar la boleta. Intenta de nuevo.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <Spinner />;

  if (error || !ticket) {
    return (
      <div className="page-container">
        <div className="auth-error" style={{ margin: 'var(--space-xl) 0' }}>
          <span>⚠️</span> {error || 'Boleta no encontrada'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => navigate('/tickets')}>Volver a Mis Boletas</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in-up">
      <div className="ticket-detail">
        <div className="ticket-detail-card">
          <div className="ticket-detail-banner">
            <h1>{ticket.title}</h1>
            <div className="ticket-detail-banner-meta">
              <span>{getGameTypeIcon(ticket.gameType)} {ticket.gameType}</span>
              <span>•</span>
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          <div className="ticket-detail-body">
            <div className="ticket-detail-grid">
              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Fecha del Sorteo</span>
                <span className="ticket-detail-value">{formatDate(ticket.gameDate)}</span>
              </div>

              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Número de Juego / Serie</span>
                <span className="ticket-detail-value">
                  {ticket.gameNumber ? `#${ticket.gameNumber}` : '—'}
                </span>
              </div>

              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Valor Pagado</span>
                <span className="ticket-detail-value">{formatCurrency(ticket.amount)}</span>
              </div>

              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Lugar de Compra</span>
                <span className="ticket-detail-value">{ticket.place || '—'}</span>
              </div>

              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Fecha de Registro</span>
                <span className="ticket-detail-value">{formatDateTime(ticket.createdAt)}</span>
              </div>

              <div className="ticket-detail-field">
                <span className="ticket-detail-label">Última Actualización</span>
                <span className="ticket-detail-value">{formatDateTime(ticket.updatedAt)}</span>
              </div>

              {ticket.notes && (
                <div className="ticket-detail-notes">
                  <strong>Notas adicionales:</strong>
                  <p style={{ marginTop: '4px' }}>{ticket.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="ticket-detail-actions">
            <Button variant="ghost" onClick={() => navigate('/tickets')}>
              Volver
            </Button>
            <Link to={`/tickets/${ticket.id}/edit`}>
              <Button variant="primary">✏️ Editar</Button>
            </Link>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              🗑️ Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar eliminación"
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleteLoading}>
              Eliminar
            </Button>
          </>
        }
      >
        <p>¿Estás seguro de que deseas eliminar la boleta <strong>"{ticket.title}"</strong>?</p>
        <p style={{ marginTop: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
