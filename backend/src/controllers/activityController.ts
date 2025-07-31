import { Request, Response } from 'express';
import { ActivityModel } from '../models/Activity';
import { Activity } from '../utils/database';

export class ActivityController {
  // Create a new activity
  static async createActivity(req: Request, res: Response) {
    try {
      const { scheduleId, name, description, startTime, endTime, priority, color, isRecurring, recurrencePattern, daysOfWeek } = req.body;

      // Validate required fields
      if (!scheduleId || !name || !startTime || !endTime || !daysOfWeek) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: scheduleId, name, startTime, endTime, daysOfWeek'
        });
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM format'
        });
      }

      // Validate that start time is before end time
      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: 'Start time must be before end time'
        });
      }

      // Validate days of week
      if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'daysOfWeek must be a non-empty array'
        });
      }

      // Validate each day is between 0-6
      for (const day of daysOfWeek) {
        if (typeof day !== 'number' || day < 0 || day > 6) {
          return res.status(400).json({
            success: false,
            message: 'Each day must be a number between 0-6'
          });
        }
      }

      const activityData = {
        scheduleId,
        name,
        description,
        startTime,
        endTime,
        priority: priority || 'medium',
        color,
        isRecurring: isRecurring || false,
        recurrencePattern: isRecurring ? (recurrencePattern || 'weekly') : undefined,
        daysOfWeek: JSON.stringify(daysOfWeek)
      };

      const activity = await ActivityModel.create(activityData);

      res.status(201).json({
        success: true,
        data: activity,
        message: 'Activity created successfully'
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all activities for a schedule
  static async getActivitiesBySchedule(req: Request, res: Response) {
    try {
      const { scheduleId } = req.params;

      if (!scheduleId) {
        return res.status(400).json({
          success: false,
          message: 'Schedule ID is required'
        });
      }

      const activities = await ActivityModel.findByScheduleId(scheduleId);

      res.json({
        success: true,
        data: activities.map(activity => ({
          ...activity,
          daysOfWeek: JSON.parse(activity.daysOfWeek)
        }))
      });
    } catch (error) {
      console.error('Error getting activities by schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get activity by ID
  static async getActivityById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Activity ID is required'
        });
      }

      const activity = await ActivityModel.findById(id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...activity,
          daysOfWeek: JSON.parse(activity.daysOfWeek)
        }
      });
    } catch (error) {
      console.error('Error getting activity by id:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update activity
  static async updateActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Activity ID is required'
        });
      }

      // Validate time format if provided
      if (updates.startTime || updates.endTime) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const startTime = updates.startTime || (await ActivityModel.findById(id))?.startTime;
        const endTime = updates.endTime || (await ActivityModel.findById(id))?.endTime;

        if (startTime && endTime && startTime >= endTime) {
          return res.status(400).json({
            success: false,
            message: 'Start time must be before end time'
          });
        }
      }

      // Convert daysOfWeek to JSON string if provided
      if (updates.daysOfWeek) {
        if (!Array.isArray(updates.daysOfWeek) || updates.daysOfWeek.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'daysOfWeek must be a non-empty array'
          });
        }

        // Validate each day is between 0-6
        for (const day of updates.daysOfWeek) {
          if (typeof day !== 'number' || day < 0 || day > 6) {
            return res.status(400).json({
              success: false,
              message: 'Each day must be a number between 0-6'
            });
          }
        }

        updates.daysOfWeek = JSON.stringify(updates.daysOfWeek);
      }

      const updatedActivity = await ActivityModel.update(id, updates);

      if (!updatedActivity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...updatedActivity,
          daysOfWeek: JSON.parse(updatedActivity.daysOfWeek)
        },
        message: 'Activity updated successfully'
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete activity
  static async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Activity ID is required'
        });
      }

      const deleted = await ActivityModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      res.json({
        success: true,
        message: 'Activity deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current activity for a schedule
  static async getCurrentActivity(req: Request, res: Response) {
    try {
      const { scheduleId } = req.params;

      if (!scheduleId) {
        return res.status(400).json({
          success: false,
          message: 'Schedule ID is required'
        });
      }

      const activity = await ActivityModel.getCurrentActivity(scheduleId);

      if (!activity) {
        return res.json({
          success: true,
          data: null,
          message: 'No current activity'
        });
      }

      res.json({
        success: true,
        data: {
          ...activity,
          daysOfWeek: JSON.parse(activity.daysOfWeek)
        }
      });
    } catch (error) {
      console.error('Error getting current activity:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get activities for a specific day and time
  static async getActivitiesForDayAndTime(req: Request, res: Response) {
    try {
      const { scheduleId, dayOfWeek, time } = req.params;

      if (!scheduleId || dayOfWeek === undefined || !time) {
        return res.status(400).json({
          success: false,
          message: 'Schedule ID, day of week, and time are required'
        });
      }

      const day = parseInt(dayOfWeek);
      if (isNaN(day) || day < 0 || day > 6) {
        return res.status(400).json({
          success: false,
          message: 'Day of week must be a number between 0-6'
        });
      }

      const activities = await ActivityModel.findForDayAndTime(scheduleId, day, time);

      res.json({
        success: true,
        data: activities.map(activity => ({
          ...activity,
          daysOfWeek: JSON.parse(activity.daysOfWeek)
        }))
      });
    } catch (error) {
      console.error('Error getting activities for day and time:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 