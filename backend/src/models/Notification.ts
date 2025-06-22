import { db, Notification } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class NotificationModel {
  static async create(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const notification: Notification = {
      id,
      ...notificationData,
      createdAt: now
    };

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO notifications (id, taskId, type, message, isRead, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [notification.id, notification.taskId, notification.type, notification.message, notification.isRead, notification.createdAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(notification);
          }
        }
      );
    });
  }

  static async findAll(): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notifications ORDER BY createdAt DESC', (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Notification[]);
        }
      });
    });
  }

  static async findById(id: string): Promise<Notification | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM notifications WHERE id = ?', [id], (err: any, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Notification || null);
        }
      });
    });
  }

  static async findByTaskId(taskId: string): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notifications WHERE taskId = ? ORDER BY createdAt DESC', [taskId], (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Notification[]);
        }
      });
    });
  }

  static async findUnread(): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notifications WHERE isRead = 0 ORDER BY createdAt DESC', (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Notification[]);
        }
      });
    });
  }

  static async markAsRead(id: string): Promise<Notification | null> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE notifications SET isRead = 1 WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            this.get('SELECT * FROM notifications WHERE id = ?', [id], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as Notification);
              }
            });
          }
        }
      );
    });
  }

  static async markAllAsRead(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run('UPDATE notifications SET isRead = 1 WHERE isRead = 0', function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  static async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM notifications WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  static async deleteByTaskId(taskId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM notifications WHERE taskId = ?', [taskId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  static async getCount(): Promise<{ total: number; unread: number }> {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM notifications', (err: any, totalRow: any) => {
        if (err) {
          reject(err);
        } else {
          db.get('SELECT COUNT(*) as unread FROM notifications WHERE isRead = 0', (err: any, unreadRow: any) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                total: (totalRow as any).total,
                unread: (unreadRow as any).unread
              });
            }
          });
        }
      });
    });
  }
} 