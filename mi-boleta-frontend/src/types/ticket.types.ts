export type GameType = 'Lotería' | 'Rifa' | 'Sorteo' | 'Boleta' | 'Juego ocasional';
export type TicketStatus = 'Pendiente' | 'Ganado' | 'Perdido';

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  gameType: GameType;
  gameNumber: string | null;
  gameDate: string;
  amount: number | null;
  place: string | null;
  status: TicketStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketOwner {
  id: string;
  name: string;
  email: string;
}

export interface AdminTicket extends Ticket {
  owner: TicketOwner;
}

export interface CreateTicketRequest {
  title: string;
  gameType: GameType;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: TicketStatus;
  notes?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  gameType?: GameType;
  gameNumber?: string;
  gameDate?: string;
  amount?: number;
  place?: string;
  status?: TicketStatus;
  notes?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  gameType?: GameType;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminTicketFilters extends TicketFilters {
  userId?: string;
}

export const GAME_TYPES: GameType[] = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];
export const TICKET_STATUSES: TicketStatus[] = ['Pendiente', 'Ganado', 'Perdido'];
