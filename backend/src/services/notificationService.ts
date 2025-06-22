import cron from 'node-cron';
import { TaskModel } from '../models/Task';
import { NotificationModel } from '../models/Notification';

export class NotificationService {
  private static instance: NotificationService;
  private isRunning = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  start(): void {
    if (this.isRunning) {
      console.log('Notification service is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting notification service...');

    // Check for overdue tasks every minute
    cron.schedule('* * * * *', async () => {
      await this.checkOverdueTasks();
    });

    // Check for reminders every minute
    cron.schedule('* * * * *', async () => {
      await this.checkReminders();
    });

    // Daily cleanup of old notifications (at 2 AM)
    cron.schedule('0 2 * * *', async () => {
      await this.cleanupOldNotifications();
    });

    console.log('Notification service started successfully');
  }

  stop(): void {
    this.isRunning = false;
    console.log('Notification service stopped');
  }

  private async checkOverdueTasks(): Promise<void> {
    try {
      const overdueTasks = await TaskModel.findOverdue();
      
      for (const task of overdueTasks) {
        // Check if we already have an overdue notification for this task
        const existingNotifications = await NotificationModel.findByTaskId(task.id);
        const hasOverdueNotification = existingNotifications.some(
          notification => notification.type === 'overdue'
        );

        if (!hasOverdueNotification) {
          await NotificationModel.create({
            taskId: task.id,
            type: 'overdue',
            message: `La tarea "${task.title}" está vencida desde ${new Date(task.dueDate!).toLocaleDateString()}`,
            isRead: false
          });

          console.log(`Created overdue notification for task: ${task.title}`);
        }
      }
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  }

  private async checkReminders(): Promise<void> {
    try {
      const tasksWithReminders = await TaskModel.findWithReminders();
      const now = new Date();
      
      for (const task of tasksWithReminders) {
        if (task.reminderTime) {
          const reminderTime = new Date(task.reminderTime);
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          // If reminder time is within the next minute and we haven't sent a reminder yet
          if (timeDiff >= 0 && timeDiff <= 60000) {
            const existingNotifications = await NotificationModel.findByTaskId(task.id);
            const hasReminderNotification = existingNotifications.some(
              notification => notification.type === 'reminder' && 
              new Date(notification.createdAt).getTime() > now.getTime() - 60000
            );

            if (!hasReminderNotification) {
              await NotificationModel.create({
                taskId: task.id,
                type: 'reminder',
                message: `Recordatorio: La tarea "${task.title}" vence el ${new Date(task.dueDate!).toLocaleDateString()}`,
                isRead: false
              });

              console.log(`Created reminder notification for task: ${task.title}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  private async cleanupOldNotifications(): Promise<void> {
    try {
      // Delete notifications older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // This would require adding a cleanup method to the NotificationModel
      // For now, we'll just log that cleanup would happen
      console.log('Cleanup: Would delete notifications older than 30 days');
    } catch (error) {
      console.error('Error during notification cleanup:', error);
    }
  }

  // Manual method to create a notification for a specific task
  async createTaskNotification(taskId: string, type: 'reminder' | 'due_date' | 'overdue', message: string): Promise<void> {
    try {
      await NotificationModel.create({
        taskId,
        type,
        message,
        isRead: false
      });
      console.log(`Created ${type} notification for task ${taskId}`);
    } catch (error) {
      console.error('Error creating task notification:', error);
    }
  }

  // Method to get notification statistics
  async getNotificationStats(): Promise<{ total: number; unread: number; overdue: number; reminders: number }> {
    try {
      const count = await NotificationModel.getCount();
      const unreadNotifications = await NotificationModel.findUnread();
      
      const overdueCount = unreadNotifications.filter(n => n.type === 'overdue').length;
      const reminderCount = unreadNotifications.filter(n => n.type === 'reminder').length;

      return {
        total: count.total,
        unread: count.unread,
        overdue: overdueCount,
        reminders: reminderCount
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, unread: 0, overdue: 0, reminders: 0 };
    }
  }
}

// Export a function to start the notification service
export function startNotificationService(): void {
  const service = NotificationService.getInstance();
  service.start();
} 