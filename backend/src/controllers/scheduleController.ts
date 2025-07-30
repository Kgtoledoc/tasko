import { Request, Response } from 'express';
import scheduleService from '../services/scheduleService';
import { WeeklySchedule, ScheduleSlot } from '../utils/database';

export class ScheduleController {
  // Weekly Schedule endpoints
  static async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, isActive = true } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Schedule name is required'
        });
        return;
      }

      const scheduleData: Omit<WeeklySchedule, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        description: description?.trim(),
        isActive
      };

      const newSchedule = await scheduleService.createSchedule(scheduleData);
      
      res.status(201).json({
        success: true,
        data: newSchedule,
        message: 'Schedule created successfully'
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create schedule'
      });
    }
  }

  static async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await scheduleService.getAllSchedules();
      res.json({
        success: true,
        data: schedules,
        count: schedules.length
      });
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedules'
      });
    }
  }

  static async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const schedule = await scheduleService.getScheduleById(id);
      
      if (!schedule) {
        res.status(404).json({
          success: false,
          error: 'Schedule not found'
        });
        return;
      }

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedule'
      });
    }
  }

  static async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedSchedule = await scheduleService.updateSchedule(id, updates);
      
      if (!updatedSchedule) {
        res.status(404).json({
          success: false,
          error: 'Schedule not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedSchedule,
        message: 'Schedule updated successfully'
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update schedule'
      });
    }
  }

  static async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await scheduleService.deleteSchedule(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Schedule not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete schedule'
      });
    }
  }

  // Schedule Slot endpoints
  static async createSlot(req: Request, res: Response): Promise<void> {
    try {
      const { 
        scheduleId, 
        dayOfWeek, 
        startTime, 
        endTime, 
        activityName, 
        activityDescription, 
        priority = 'medium',
        color,
        isRecurring = false,
        recurrencePattern
      } = req.body;

      // Validation
      if (!scheduleId || !dayOfWeek || !startTime || !endTime || !activityName) {
        res.status(400).json({
          success: false,
          error: 'scheduleId, dayOfWeek, startTime, endTime, and activityName are required'
        });
        return;
      }

      if (dayOfWeek < 0 || dayOfWeek > 6) {
        res.status(400).json({
          success: false,
          error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)'
        });
        return;
      }

      if (priority && !['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({
          success: false,
          error: 'Priority must be low, medium, or high'
        });
        return;
      }

      if (isRecurring && !recurrencePattern) {
        res.status(400).json({
          success: false,
          error: 'Recurrence pattern is required when isRecurring is true'
        });
        return;
      }

      if (recurrencePattern && !['weekly', 'biweekly', 'monthly'].includes(recurrencePattern)) {
        res.status(400).json({
          success: false,
          error: 'Recurrence pattern must be weekly, biweekly, or monthly'
        });
        return;
      }

      const slotData: Omit<ScheduleSlot, 'id' | 'createdAt' | 'updatedAt'> = {
        scheduleId,
        dayOfWeek,
        startTime,
        endTime,
        activityName: activityName.trim(),
        activityDescription: activityDescription?.trim(),
        priority,
        color,
        isRecurring,
        recurrencePattern
      };

      const newSlot = await scheduleService.createSlot(slotData);
      
      res.status(201).json({
        success: true,
        data: newSlot,
        message: 'Schedule slot created successfully'
      });
    } catch (error) {
      console.error('Error creating schedule slot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create schedule slot'
      });
    }
  }

  static async getSlotsByScheduleId(req: Request, res: Response): Promise<void> {
    try {
      const { scheduleId } = req.params;
      const slots = await scheduleService.getSlotsByScheduleId(scheduleId);
      
      res.json({
        success: true,
        data: slots,
        count: slots.length
      });
    } catch (error) {
      console.error('Error fetching schedule slots:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedule slots'
      });
    }
  }

  static async updateSlot(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedSlot = await scheduleService.updateSlot(id, updates);
      
      if (!updatedSlot) {
        res.status(404).json({
          success: false,
          error: 'Schedule slot not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedSlot,
        message: 'Schedule slot updated successfully'
      });
    } catch (error) {
      console.error('Error updating schedule slot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update schedule slot'
      });
    }
  }

  static async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await scheduleService.deleteSlot(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Schedule slot not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Schedule slot deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting schedule slot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete schedule slot'
      });
    }
  }

  // Advanced schedule endpoints
  static async getCurrentActivity(req: Request, res: Response): Promise<void> {
    try {
      const currentActivity = await scheduleService.getCurrentActivity();
      
      res.json({
        success: true,
        data: currentActivity
      });
    } catch (error) {
      console.error('Error fetching current activity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch current activity'
      });
    }
  }

  static async getNextActivity(req: Request, res: Response): Promise<void> {
    try {
      const nextActivity = await scheduleService.getNextActivity();
      
      res.json({
        success: true,
        data: nextActivity
      });
    } catch (error) {
      console.error('Error fetching next activity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch next activity'
      });
    }
  }

  static async getWeeklySchedule(req: Request, res: Response): Promise<void> {
    try {
      const { weekStart } = req.query;
      const startDate = weekStart ? new Date(weekStart as string) : new Date();
      
      const weeklySchedule = await scheduleService.getWeeklySchedule(startDate);
      
      res.json({
        success: true,
        data: weeklySchedule,
        count: weeklySchedule.length
      });
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weekly schedule'
      });
    }
  }

  static async generateTasksFromSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { scheduleId } = req.params;
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required'
        });
        return;
      }

      const generatedTasks = await scheduleService.generateTasksFromSchedule(
        scheduleId,
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json({
        success: true,
        data: generatedTasks,
        count: generatedTasks.length,
        message: `${generatedTasks.length} tasks generated from schedule`
      });
    } catch (error) {
      console.error('Error generating tasks from schedule:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate tasks from schedule'
      });
    }
  }
} 