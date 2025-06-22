import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = Router();

// GET /api/notifications - Get all notifications
router.get('/', NotificationController.getAllNotifications);

// GET /api/notifications/count - Get notification count
router.get('/count', NotificationController.getNotificationCount);

// GET /api/notifications/unread - Get unread notifications
router.get('/unread', NotificationController.getUnreadNotifications);

// GET /api/notifications/task/:taskId - Get notifications by task ID
router.get('/task/:taskId', NotificationController.getNotificationsByTaskId);

// GET /api/notifications/:id - Get notification by ID
router.get('/:id', NotificationController.getNotificationById);

// POST /api/notifications - Create notification
router.post('/', NotificationController.createNotification);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', NotificationController.markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', NotificationController.markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', NotificationController.deleteNotification);

export default router; 