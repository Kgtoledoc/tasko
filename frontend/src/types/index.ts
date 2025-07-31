// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  reminderTime?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  taskId: string;
  message: string;
  type: 'reminder' | 'overdue' | 'due_soon' | 'activity_change';
  isRead: boolean;
  createdAt: string;
}

// Schedule types
export interface WeeklySchedule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// New Activity interface (replaces ScheduleSlot for the new system)
export interface Activity {
  id: string;
  scheduleId: string;
  name: string;
  description?: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  priority: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek: number[]; // Array of day numbers [0,1,2,3,4,5,6]
  createdAt: string;
  updatedAt: string;
}

// Keep ScheduleSlot for backward compatibility
export interface ScheduleSlot {
  id: string;
  scheduleId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  activityName: string;
  activityDescription?: string;
  priority: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  scheduleSlotId: string;
  recurrencePattern: 'weekly' | 'biweekly' | 'monthly';
  nextOccurrence: string;
  lastGenerated: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  reminderTime?: string;
  category?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  reminderTime?: string;
  category?: string;
}

export interface CreateScheduleRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateActivityRequest {
  scheduleId: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek: number[];
}

export interface UpdateActivityRequest {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek?: number[];
}

export interface CreateScheduleSlotRequest {
  scheduleId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  activityName: string;
  activityDescription?: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface NotificationCount {
  total: number;
  unread: number;
}

export interface TaskFilters {
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface ScheduleStats {
  totalSchedules: number;
  activeSchedules: number;
  totalSlots: number;
  currentActivity?: Activity;
  nextActivity?: Activity;
} 