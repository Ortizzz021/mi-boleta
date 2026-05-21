const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private buildHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private buildQueryString(params?: Record<string, string | number | undefined>): string {
    if (!params) return '';
    const filtered = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    return filtered.length ? `?${filtered.join('&')}` : '';
  }

  async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: unknown,
    includeAuth: boolean = true,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(queryParams)}`;

    const options: RequestOptions = {
      method,
      headers: this.buildHeaders(includeAuth),
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      const errorMessage = data.error || `Error ${response.status}`;
      throw new ApiError(errorMessage, response.status);
    }

    return data;
  }

  get<T>(endpoint: string, queryParams?: Record<string, string | number | undefined>, includeAuth = true): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, includeAuth, queryParams);
  }

  post<T>(endpoint: string, body: unknown, includeAuth = true): Promise<T> {
    return this.request<T>(endpoint, 'POST', body, includeAuth);
  }

  put<T>(endpoint: string, body: unknown, includeAuth = true): Promise<T> {
    return this.request<T>(endpoint, 'PUT', body, includeAuth);
  }

  delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, includeAuth);
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = new ApiClient(API_URL);
