import { apiClient } from './client';
import type { ApiResponse, PaginationMeta } from '../types/api.types';
import type {
  Ticket,
  AdminTicket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketFilters,
  AdminTicketFilters,
} from '../types/ticket.types';

export const ticketsService = {
  async getTickets(filters?: TicketFilters): Promise<ApiResponse<Ticket[]> & { meta: PaginationMeta }> {
    const params: Record<string, string | number | undefined> = {};
    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.gameType) params.gameType = filters.gameType;
      if (filters.q) params.q = filters.q;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
    }
    return apiClient.get<ApiResponse<Ticket[]> & { meta: PaginationMeta }>('/tickets', params);
  },

  async getTicketById(id: string): Promise<ApiResponse<Ticket>> {
    return apiClient.get<ApiResponse<Ticket>>(`/tickets/${id}`);
  },

  async createTicket(data: CreateTicketRequest): Promise<ApiResponse<Ticket>> {
    return apiClient.post<ApiResponse<Ticket>>('/tickets', data);
  },

  async updateTicket(id: string, data: UpdateTicketRequest): Promise<ApiResponse<Ticket>> {
    return apiClient.put<ApiResponse<Ticket>>(`/tickets/${id}`, data);
  },

  async deleteTicket(id: string): Promise<void> {
    return apiClient.delete<void>(`/tickets/${id}`);
  },

  async getAdminTickets(filters?: AdminTicketFilters): Promise<ApiResponse<AdminTicket[]> & { meta: PaginationMeta }> {
    const params: Record<string, string | number | undefined> = {};
    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.gameType) params.gameType = filters.gameType;
      if (filters.q) params.q = filters.q;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      if (filters.userId) params.userId = filters.userId;
    }
    return apiClient.get<ApiResponse<AdminTicket[]> & { meta: PaginationMeta }>('/admin/tickets', params);
  },
};
