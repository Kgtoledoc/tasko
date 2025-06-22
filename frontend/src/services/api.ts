import axios from 'axios';
import { Task, Notification, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Task API
export const taskApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data || [];
  },

  // Get task by ID
  getById: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },

  // Create new task
  create: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', task);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to create task');
    }
    return response.data.data;
  },

  // Update task
  update: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to update task');
    }
    return response.data.data;
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/tasks/${id}`);
  },

  // Get tasks by status
  getByStatus: async (status: Task['status']): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>(`/tasks/status/${status}`);
    return response.data.data || [];
  },

  // Get overdue tasks
  getOverdue: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/overdue');
    return response.data.data || [];
  },

  // Get tasks with reminders
  getWithReminders: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/reminders');
    return response.data.data || [];
  },
};

// Notification API
export const notificationApi = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data || [];
  },

  // Get notification by ID
  getById: async (id: string): Promise<Notification> => {
    const response = await api.get<ApiResponse<Notification>>(`/notifications/${id}`);
    if (!response.data.data) {
      throw new Error('Notification not found');
    }
    return response.data.data;
  },

  // Get unread notifications
  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications/unread');
    return response.data.data || [];
  },

  // Get notifications by task ID
  getByTaskId: async (taskId: string): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>(`/notifications/task/${taskId}`);
    return response.data.data || [];
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    if (!response.data.data) {
      throw new Error('Failed to mark notification as read');
    }
    return response.data.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<number> => {
    const response = await api.put<ApiResponse<{ count: number }>>('/notifications/read-all');
    return response.data.count || 0;
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/notifications/${id}`);
  },

  // Get notification count
  getCount: async (): Promise<{ total: number; unread: number }> => {
    const response = await api.get<ApiResponse<{ total: number; unread: number }>>('/notifications/count');
    return response.data.data || { total: 0, unread: 0 };
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; message: string; timestamp: string }> => {
    const response = await api.get<{ status: string; message: string; timestamp: string }>('/health');
    return response.data;
  },
};

export default api; 