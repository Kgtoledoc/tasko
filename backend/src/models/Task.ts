import { db, Task } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class TaskModel {
  static async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id,
      ...taskData,
      createdAt: now,
      updatedAt: now
    };

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO tasks (id, title, description, dueDate, priority, status, createdAt, updatedAt, reminderTime, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [task.id, task.title, task.description, task.dueDate, task.priority, task.status, task.createdAt, task.updatedAt, task.reminderTime, task.category],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(task);
          }
        }
      );
    });
  }

  static async findAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY createdAt DESC', (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Task[]);
        }
      });
    });
  }

  static async findById(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err: any, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Task || null);
        }
      });
    });
  }

  static async update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const now = new Date().toISOString();
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt') {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    updateFields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            db.get('SELECT * FROM tasks WHERE id = ?', [id], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as Task);
              }
            });
          }
        }
      );
    });
  }

  static async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  static async findByStatus(status: Task['status']): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE status = ? ORDER BY createdAt DESC', [status], (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Task[]);
        }
      });
    });
  }

  static async findOverdue(): Promise<Task[]> {
    const now = new Date().toISOString();
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM tasks WHERE dueDate < ? AND status != "completed" ORDER BY dueDate ASC',
        [now],
        (err: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as Task[]);
          }
        }
      );
    });
  }

  static async findWithReminders(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM tasks WHERE reminderTime IS NOT NULL AND status != "completed" ORDER BY reminderTime ASC',
        (err: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as Task[]);
          }
        }
      );
    });
  }
} 