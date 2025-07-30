import api from './api';
import { 
  WeeklySchedule, 
  ScheduleSlot, 
  RecurringTask, 
  CreateScheduleRequest, 
  CreateScheduleSlotRequest,
  ApiResponse,
  ScheduleStats
} from '../types';

// Weekly Schedule API
export const scheduleApi = {
  // Get all schedules
  getAllSchedules: async (): Promise<ApiResponse<WeeklySchedule[]>> => {
    const response = await api.get('/schedules');
    return response.data;
  },

  // Get schedule by ID
  getScheduleById: async (id: string): Promise<ApiResponse<WeeklySchedule>> => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  // Create new schedule
  createSchedule: async (scheduleData: CreateScheduleRequest): Promise<ApiResponse<WeeklySchedule>> => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  // Update schedule
  updateSchedule: async (id: string, updates: Partial<CreateScheduleRequest>): Promise<ApiResponse<WeeklySchedule>> => {
    const response = await api.put(`/schedules/${id}`, updates);
    return response.data;
  },

  // Delete schedule
  deleteSchedule: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },

  // Get slots by schedule ID
  getSlotsByScheduleId: async (scheduleId: string): Promise<ApiResponse<ScheduleSlot[]>> => {
    const response = await api.get(`/schedules/${scheduleId}/slots`);
    return response.data;
  },

  // Create new slot
  createSlot: async (slotData: CreateScheduleSlotRequest): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await api.post(`/schedules/${slotData.scheduleId}/slots`, slotData);
    return response.data;
  },

  // Update slot
  updateSlot: async (id: string, updates: Partial<CreateScheduleSlotRequest>): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await api.put(`/schedules/slots/${id}`, updates);
    return response.data;
  },

  // Delete slot
  deleteSlot: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/schedules/slots/${id}`);
    return response.data;
  },

  // Get current activity
  getCurrentActivity: async (): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await api.get('/schedules/current/activity');
    return response.data;
  },

  // Get next activity
  getNextActivity: async (): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await api.get('/schedules/next/activity');
    return response.data;
  },

  // Get weekly schedule view
  getWeeklySchedule: async (weekStart?: string): Promise<ApiResponse<ScheduleSlot[]>> => {
    const params = weekStart ? { weekStart } : {};
    const response = await api.get('/schedules/weekly/view', { params });
    return response.data;
  },

  // Generate tasks from schedule
  generateTasksFromSchedule: async (scheduleId: string, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/schedules/${scheduleId}/generate-tasks`, {
      startDate,
      endDate
    });
    return response.data;
  },

  // Get schedule statistics
  getScheduleStats: async (): Promise<ApiResponse<ScheduleStats>> => {
    try {
      const [schedulesResponse, currentActivityResponse, nextActivityResponse] = await Promise.all([
        api.get('/schedules'),
        api.get('/schedules/current/activity'),
        api.get('/schedules/next/activity')
      ]);

      const schedules = schedulesResponse.data.data || [];
      const activeSchedules = schedules.filter((s: WeeklySchedule) => s.isActive);
      
      let totalSlots = 0;
      for (const schedule of activeSchedules) {
        const slotsResponse = await api.get(`/schedules/${schedule.id}/slots`);
        totalSlots += slotsResponse.data.data?.length || 0;
      }

      return {
        success: true,
        data: {
          totalSchedules: schedules.length,
          activeSchedules: activeSchedules.length,
          totalSlots,
          currentActivity: currentActivityResponse.data.data,
          nextActivity: nextActivityResponse.data.data
        }
      };
    } catch (error) {
      console.error('Error fetching schedule stats:', error);
      return {
        success: false,
        error: 'Failed to fetch schedule statistics'
      };
    }
  }
}; 