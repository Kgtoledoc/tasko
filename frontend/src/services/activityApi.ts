import api from './api';
import { 
  Activity, 
  CreateActivityRequest, 
  UpdateActivityRequest,
  ApiResponse
} from '../types';

export const activityApi = {
  // Create new activity
  createActivity: async (activityData: CreateActivityRequest): Promise<ApiResponse<Activity>> => {
    console.log('🚀 Creating activity with data:', activityData);
    try {
      const response = await api.post('/activities', activityData);
      console.log('✅ Activity created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating activity:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Get all activities for a schedule
  getActivitiesBySchedule: async (scheduleId: string): Promise<ApiResponse<Activity[]>> => {
    const response = await api.get(`/activities/schedule/${scheduleId}`);
    return response.data;
  },

  // Get activity by ID
  getActivityById: async (id: string): Promise<ApiResponse<Activity>> => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  // Update activity
  updateActivity: async (id: string, updates: UpdateActivityRequest): Promise<ApiResponse<Activity>> => {
    console.log('Updating activity:', id, updates);
    try {
      const response = await api.put(`/activities/${id}`, updates);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  // Delete activity
  deleteActivity: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },

  // Get current activity for a schedule
  getCurrentActivity: async (scheduleId: string): Promise<ApiResponse<Activity>> => {
    const response = await api.get(`/activities/schedule/${scheduleId}/current`);
    return response.data;
  },

  // Get activities for a specific day and time
  getActivitiesForDayAndTime: async (scheduleId: string, dayOfWeek: number, time: string): Promise<ApiResponse<Activity[]>> => {
    const response = await api.get(`/activities/schedule/${scheduleId}/day/${dayOfWeek}/time/${time}`);
    return response.data;
  }
}; 