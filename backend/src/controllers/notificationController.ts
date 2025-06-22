import { Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';
import { Notification } from '../utils/database';

export class NotificationController {
  // Get all notifications
  static async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await NotificationModel.findAll();
      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications'
      });
    }
  }

  // Get notification by ID
  static async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await NotificationModel.findById(id);
      
      if (!notification) {
        res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Error fetching notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification'
      });
    }
  }

  // Get notifications by task ID
  static async getNotificationsByTaskId(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const notifications = await NotificationModel.findByTaskId(taskId);
      
      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Error fetching notifications by task ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications by task ID'
      });
    }
  }

  // Get unread notifications
  static async getUnreadNotifications(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await NotificationModel.findUnread();
      
      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch unread notifications'
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await NotificationModel.markAsRead(id);
      
      if (!notification) {
        res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        data: notification,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read'
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const count = await NotificationModel.markAllAsRead();
      
      res.json({
        success: true,
        message: `${count} notifications marked as read`,
        count
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read'
      });
    }
  }

  // Delete notification
  static async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await NotificationModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification'
      });
    }
  }

  // Get notification count
  static async getNotificationCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await NotificationModel.getCount();
      
      res.json({
        success: true,
        data: count
      });
    } catch (error) {
      console.error('Error fetching notification count:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification count'
      });
    }
  }

  // Create notification (for internal use)
  static async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const { taskId, type, message } = req.body;

      // Validation
      if (!taskId || !type || !message) {
        res.status(400).json({
          success: false,
          error: 'taskId, type, and message are required'
        });
        return;
      }

      if (!['reminder', 'due_date', 'overdue'].includes(type)) {
        res.status(400).json({
          success: false,
          error: 'Type must be reminder, due_date, or overdue'
        });
        return;
      }

      const notificationData: Omit<Notification, 'id' | 'createdAt'> = {
        taskId,
        type: type as Notification['type'],
        message: message.trim(),
        isRead: false
      };

      const newNotification = await NotificationModel.create(notificationData);
      
      res.status(201).json({
        success: true,
        data: newNotification,
        message: 'Notification created successfully'
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create notification'
      });
    }
  }
} 