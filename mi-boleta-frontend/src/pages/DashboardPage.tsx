import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsService } from '../api/tickets.service';
import { StatCard } from '../components/ui/Card';
import { Spinner, StatusBadge, EmptyState } from '../components/ui/Shared';
import { formatDateShort, getRelativeTime, isUpcoming } from '../utils/formatters';
import { getGameTypeIcon } from '../utils/constants';
import type { Ticket } from '../types/ticket.types';
import './Dashboard.css';

export function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketsService.getTickets({ pageSize: 100 });
      setTickets(response.data);
    } catch {
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const totalGames = tickets.length;
  const pendingGames = tickets.filter(t => t.status === 'Pendiente').length;
  const wonGames = tickets.filter(t => t.status === 'Ganado').length;
  const upcomingGames = tickets
    .filter(t => isUpcoming(t.gameDate) && t.status === 'Pendiente')
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="welcome-banner animate-fade-in-up">
        <h2>¡Hola, {user?.name ? user.name.split(' ')[0] : 'Usuario'}! 👋</h2>
        <p>¿Y si sí te lo ganaste? Revisa tus boletas y no te pierdas ningún sorteo.</p>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="dashboard-stats stagger-children">
        <StatCard
          icon="🎟️"
          label="Total Registrados"
          value={totalGames}
          bgColor="var(--color-info-bg)"
        />
        <StatCard
          icon="⏳"
          label="Pendientes"
          value={pendingGames}
          bgColor="var(--color-warning-bg)"
        />
        <StatCard
          icon="📅"
          label="Próximos Sorteos"
          value={upcomingGames.length}
          bgColor="var(--color-primary-100)"
        />
        <StatCard
          icon="🏆"
          label="Ganados"
          value={wonGames}
          bgColor="var(--color-success-bg)"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section animate-fade-in-up">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">
              📅 Próximos Sorteos
            </h3>
            <Link to="/tickets" className="see-all-link">Ver todos →</Link>
          </div>

          {upcomingGames.length === 0 ? (
            <EmptyState
              icon="📅"
              title="Sin sorteos próximos"
              message="Agrega una boleta para ver tus próximos sorteos aquí."
            />
          ) : (
            <div className="upcoming-list">
              {upcomingGames.slice(0, 5).map(ticket => {
                const date = new Date(ticket.gameDate);
                const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

                return (
                  <Link to={`/tickets/${ticket.id}`} className="upcoming-item" key={ticket.id}>
                    <div className="upcoming-date">
                      <span className="upcoming-date-day">{date.getDate()}</span>
                      <span className="upcoming-date-month">{months[date.getMonth()]}</span>
                    </div>
                    <div className="upcoming-info">
                      <div className="upcoming-title">
                        {getGameTypeIcon(ticket.gameType)} {ticket.title}
                      </div>
                      <div className="upcoming-meta">
                        <span>{getRelativeTime(ticket.gameDate)}</span>
                        {ticket.gameNumber && <span>• #{ticket.gameNumber}</span>}
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-section animate-fade-in-up">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">
              🕐 Historial Reciente
            </h3>
            <Link to="/tickets" className="see-all-link">Ver todos →</Link>
          </div>

          {recentTickets.length === 0 ? (
            <EmptyState
              icon="🎟️"
              title="Sin registros"
              message="Empieza registrando tu primera boleta."
            />
          ) : (
            <div className="recent-list">
              {recentTickets.map(ticket => (
                <Link to={`/tickets/${ticket.id}`} className="recent-item" key={ticket.id}>
                  <div className="recent-item-info">
                    <span>{getGameTypeIcon(ticket.gameType)}</span>
                    <span className="recent-item-title">{ticket.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {formatDateShort(ticket.gameDate)}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
