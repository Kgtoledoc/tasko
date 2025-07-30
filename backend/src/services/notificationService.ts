import cron from 'node-cron';
import { NotificationModel } from '../models/Notification';
import { TaskModel } from '../models/Task';
import scheduleService from './scheduleService';
import { v4 as uuidv4 } from 'uuid';

let currentActivity: any = null;

export function startNotificationService() {
  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔍 Checking for overdue tasks...');
      const overdueTasks = await TaskModel.findOverdue();
      
      for (const task of overdueTasks) {
        const notification = await NotificationModel.create({
          taskId: task.id,
          message: `La tarea "${task.title}" está vencida`,
          type: 'overdue',
          isRead: false
        });
        console.log(`📢 Created overdue notification for task: ${task.title}`);
      }
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  });

  // Check for tasks due soon (within 1 hour) every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('🔍 Checking for tasks due soon...');
      const tasksWithReminders = await TaskModel.findWithReminders();
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      
      for (const task of tasksWithReminders) {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          if (dueDate <= oneHourFromNow && dueDate > now) {
            const notification = await NotificationModel.create({
              taskId: task.id,
              message: `La tarea "${task.title}" vence en menos de 1 hora`,
              type: 'due_soon',
              isRead: false
            });
            console.log(`📢 Created due soon notification for task: ${task.title}`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking tasks due soon:', error);
    }
  });

  // Check for activity changes every minute
  cron.schedule('* * * * *', async () => {
    try {
      const newCurrentActivity = await scheduleService.getCurrentActivity();
      
      // If activity changed, create notification
      if (newCurrentActivity && (!currentActivity || currentActivity.id !== newCurrentActivity.id)) {
        if (currentActivity) {
          // Create notification for activity change
          const notification = await NotificationModel.create({
            taskId: 'system', // Use a system task ID for schedule notifications
            message: `Cambio de actividad: Ahora es tiempo de "${newCurrentActivity.activityName}"`,
            type: 'activity_change',
            isRead: false
          });
          console.log(`📢 Activity changed to: ${newCurrentActivity.activityName}`);
        }
        
        currentActivity = newCurrentActivity;
      } else if (!newCurrentActivity && currentActivity) {
        // No current activity, but there was one before
        const notification = await NotificationModel.create({
          taskId: 'system',
          message: `Actividad completada: "${currentActivity.activityName}"`,
          type: 'activity_change',
          isRead: false
        });
        console.log(`📢 Activity completed: ${currentActivity.activityName}`);
        currentActivity = null;
      }
    } catch (error) {
      console.error('Error checking activity changes:', error);
    }
  });

  // Generate recurring tasks from schedules every day at 6 AM
  cron.schedule('0 6 * * *', async () => {
    try {
      console.log('🔍 Generating recurring tasks from schedules...');
      const activeSchedules = await scheduleService.getActiveSchedules();
      
      for (const schedule of activeSchedules) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Generate for next week
        
        const generatedTasks = await scheduleService.generateTasksFromSchedule(
          schedule.id,
          startDate,
          endDate
        );
        
        if (generatedTasks.length > 0) {
          console.log(`📅 Generated ${generatedTasks.length} tasks from schedule: ${schedule.name}`);
        }
      }
    } catch (error) {
      console.error('Error generating recurring tasks:', error);
    }
  });

  console.log('🔔 Notification service started with schedule monitoring');
} 