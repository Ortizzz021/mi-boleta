import type { GameType, TicketStatus } from '../types/ticket.types';

export const GAME_TYPE_OPTIONS: { value: GameType; label: string; icon: string }[] = [
  { value: 'Lotería', label: 'Lotería', icon: '🎰' },
  { value: 'Rifa', label: 'Rifa', icon: '🎫' },
  { value: 'Sorteo', label: 'Sorteo', icon: '🎯' },
  { value: 'Boleta', label: 'Boleta', icon: '🎟️' },
  { value: 'Juego ocasional', label: 'Juego ocasional', icon: '🎲' },
];

export const STATUS_OPTIONS: { value: TicketStatus; label: string; color: string }[] = [
  { value: 'Pendiente', label: 'Pendiente', color: 'var(--color-warning)' },
  { value: 'Ganado', label: 'Ganado', color: 'var(--color-success)' },
  { value: 'Perdido', label: 'Perdido', color: 'var(--color-danger)' },
];

export const getGameTypeIcon = (type: GameType): string => {
  return GAME_TYPE_OPTIONS.find(o => o.value === type)?.icon || '🎟️';
};

export const getStatusColor = (status: TicketStatus): string => {
  return STATUS_OPTIONS.find(o => o.value === status)?.color || 'var(--color-text-secondary)';
};
