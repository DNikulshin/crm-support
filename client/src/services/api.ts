import axios from 'axios';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  authorId: string;
  assigneeId?: string;
  author: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  ticketId: string;
  author: User;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  ticketId: string;
}

export interface TicketStatistics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<{ data: AuthResponse }> => 
    api.post('/auth/login', { email, password }),
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ data: AuthResponse }> => api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
  getAll: (): Promise<{ data: User[] }> => api.get('/users'),
  getById: (id: string): Promise<{ data: User }> => api.get(`/users/${id}`),
  create: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'ADMIN' | 'USER';
  }): Promise<{ data: User }> => api.post('/users', userData),
  update: (id: string, userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'USER';
    isActive?: boolean;
  }): Promise<{ data: User }> => api.patch(`/users/${id}`, userData),
  deactivate: (id: string): Promise<{ data: { message: string } }> => api.delete(`/users/${id}`),
};

// Tickets API
export const ticketsAPI = {
  getAll: (page = 1, limit = 10): Promise<{ data: { tickets: Ticket[]; total: number; page: number; limit: number; totalPages: number } }> => 
    api.get(`/tickets?page=${page}&limit=${limit}`),
  getById: (id: string): Promise<{ data: Ticket }> => api.get(`/tickets/${id}`),
  create: (ticketData: {
    title: string;
    description: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }): Promise<{ data: Ticket }> => api.post('/tickets', ticketData),
  update: (id: string, ticketData: {
    title?: string;
    description?: string;
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    assigneeId?: string;
  }): Promise<{ data: Ticket }> => api.patch(`/tickets/${id}`, ticketData),
  addComment: (id: string, comment: {
    content: string;
    isInternal?: boolean;
  }): Promise<{ data: Comment }> => 
    api.post(`/tickets/${id}/comments`, comment),
  updateComment: (commentId: string, comment: {
    content: string;
    isInternal?: boolean;
  }): Promise<{ data: Comment }> => 
    api.patch(`/tickets/comments/${commentId}`, comment),
  deleteComment: (commentId: string): Promise<{ data: { message: string } }> => 
    api.delete(`/tickets/comments/${commentId}`),
  uploadAttachment: (id: string, file: File): Promise<{ data: Attachment }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/tickets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAttachment: (attachmentId: string): Promise<{ data: { message: string } }> => 
    api.delete(`/tickets/attachments/${attachmentId}`),
  getStatistics: (): Promise<{ data: TicketStatistics }> => api.get('/tickets/statistics'),
};