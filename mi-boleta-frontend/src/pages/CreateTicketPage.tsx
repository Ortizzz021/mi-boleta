import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsService } from '../api/tickets.service';
import { ApiError } from '../api/client';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  validateRequired,
  validateDate,
  validatePositiveNumber,
  parseApiErrors,
} from '../utils/validators';
import { GAME_TYPE_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import type { GameType, TicketStatus } from '../types/ticket.types';
import './Tickets.css';

export function CreateTicketPage() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState<GameType>('Lotería');
  const [gameNumber, setGameNumber] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [amount, setAmount] = useState('');
  const [place, setPlace] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Pendiente');
  const [notes, setNotes] = useState('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleErr = validateRequired(title, 'El título');
    const dateErr = validateDate(gameDate, 'La fecha y hora del sorteo');
    const amountErr = validatePositiveNumber(amount, 'El valor pagado');

    if (titleErr) newErrors.title = titleErr;
    if (dateErr) newErrors.gameDate = dateErr;
    if (amountErr) newErrors.amount = amountErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await ticketsService.createTicket({
        title,
        gameType,
        gameNumber: gameNumber || undefined,
        gameDate: new Date(gameDate).toISOString(),
        amount: amount ? parseFloat(amount) : undefined,
        place: place || undefined,
        status,
        notes: notes || undefined,
      });
      navigate('/tickets');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.message) {
          const fieldErrors = parseApiErrors(err.message);
          setErrors(fieldErrors);
          if (fieldErrors._general) {
            setApiError(fieldErrors._general);
          } else {
            setApiError('Por favor corrige los errores del formulario.');
          }
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const gameTypeSelectOptions = GAME_TYPE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: `${opt.icon} ${opt.label}`,
  }));

  const statusSelectOptions = STATUS_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className="page-container animate-fade-in-up">
      <div className="ticket-form-container">
        <div className="page-header">
          <h1 className="page-title">🎟️ Registrar Nueva Boleta</h1>
          <p className="page-subtitle">Ingresa la información de tu juego para hacerle seguimiento</p>
        </div>

        <div className="auth-card" style={{ padding: 'var(--space-xl)' }}>
          {apiError && (
            <div className="auth-error" style={{ marginBottom: 'var(--space-md)' }}>
              <span className="auth-error-icon">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form className="ticket-form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Título del juego / Boleta *"
              type="text"
              name="title"
              placeholder="Ej. Baloto del Sábado, Rifa Pro-Fondos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              autoFocus
            />

            <div className="ticket-form-row">
              <Select
                label="Tipo de Juego *"
                name="gameType"
                options={gameTypeSelectOptions}
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
                error={errors.gameType}
              />

              <Input
                label="Número de Juego / Serie"
                type="text"
                name="gameNumber"
                placeholder="Ej. 1234, 098 - Serie 4"
                value={gameNumber}
                onChange={(e) => setGameNumber(e.target.value)}
                error={errors.gameNumber}
              />
            </div>

            <div className="ticket-form-row">
              <Input
                label="Fecha y Hora del Sorteo *"
                type="datetime-local"
                name="gameDate"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                error={errors.gameDate}
              />

              <Input
                label="Valor Pagado (COP)"
                type="number"
                name="amount"
                placeholder="Ej. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={errors.amount}
              />
            </div>

            <div className="ticket-form-row">
              <Input
                label="Lugar de Compra"
                type="text"
                name="place"
                placeholder="Ej. Éxito Calle 80, App Baloto"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                error={errors.place}
              />

              <Select
                label="Estado Inicial *"
                name="status"
                options={statusSelectOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                error={errors.status}
              />
            </div>

            <Textarea
              label="Notas / Comentarios"
              name="notes"
              placeholder="Cualquier detalle extra que quieras recordar"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              error={errors.notes}
            />

            <div className="ticket-form-actions">
              <Button type="button" variant="ghost" onClick={() => navigate('/tickets')}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Registrar Boleta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
