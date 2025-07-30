import { db } from '../utils/database';
import { RecurringTask } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class RecurringTaskModel {
  static async create(taskData: Omit<RecurringTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecurringTask> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const task: RecurringTask = {
        id,
        ...taskData,
        createdAt: now,
        updatedAt: now
      };

      db.run(
        `INSERT INTO recurring_tasks (id, title, description, scheduleSlotId, recurrencePattern, nextOccurrence, lastGenerated, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id, 
          task.title, 
          task.description, 
          task.scheduleSlotId, 
          task.recurrencePattern, 
          task.nextOccurrence, 
          task.lastGenerated, 
          task.isActive ? 1 : 0, 
          task.createdAt, 
          task.updatedAt
        ],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(task);
          }
        }
      );
    });
  }

  static async findAll(): Promise<RecurringTask[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM recurring_tasks ORDER BY nextOccurrence`,
        [],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isActive: Boolean(row.isActive)
            })));
          }
        }
      );
    });
  }

  static async findById(id: string): Promise<RecurringTask | null> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM recurring_tasks WHERE id = ?`,
        [id],
        (err: any, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(null);
          } else {
            resolve({
              ...row,
              isActive: Boolean(row.isActive)
            });
          }
        }
      );
    });
  }

  static async findByScheduleSlotId(scheduleSlotId: string): Promise<RecurringTask[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM recurring_tasks WHERE scheduleSlotId = ? ORDER BY nextOccurrence`,
        [scheduleSlotId],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isActive: Boolean(row.isActive)
            })));
          }
        }
      );
    });
  }

  static async findDueForGeneration(): Promise<RecurringTask[]> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.all(
        `SELECT * FROM recurring_tasks WHERE nextOccurrence <= ? AND isActive = 1 ORDER BY nextOccurrence`,
        [now],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isActive: Boolean(row.isActive)
            })));
          }
        }
      );
    });
  }

  static async update(id: string, updates: Partial<Omit<RecurringTask, 'id' | 'createdAt'>>): Promise<RecurringTask | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) {
        updateFields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.scheduleSlotId !== undefined) {
        updateFields.push('scheduleSlotId = ?');
        values.push(updates.scheduleSlotId);
      }
      if (updates.recurrencePattern !== undefined) {
        updateFields.push('recurrencePattern = ?');
        values.push(updates.recurrencePattern);
      }
      if (updates.nextOccurrence !== undefined) {
        updateFields.push('nextOccurrence = ?');
        values.push(updates.nextOccurrence);
      }
      if (updates.lastGenerated !== undefined) {
        updateFields.push('lastGenerated = ?');
        values.push(updates.lastGenerated);
      }
      if (updates.isActive !== undefined) {
        updateFields.push('isActive = ?');
        values.push(updates.isActive ? 1 : 0);
      }
      updateFields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      if (updateFields.length === 1) { // Only updatedAt
        resolve(null);
        return;
      }

      db.run(
        `UPDATE recurring_tasks SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(err: any) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            // Fetch the updated record
            db.get(
              `SELECT * FROM recurring_tasks WHERE id = ?`,
              [id],
              (err: any, row: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    ...row,
                    isActive: Boolean(row.isActive)
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  static async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM recurring_tasks WHERE id = ?`,
        [id],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  static async deleteByScheduleSlotId(scheduleSlotId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM recurring_tasks WHERE scheduleSlotId = ?`,
        [scheduleSlotId],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  static async findActive(): Promise<RecurringTask[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM recurring_tasks WHERE isActive = 1 ORDER BY nextOccurrence`,
        [],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isActive: Boolean(row.isActive)
            })));
          }
        }
      );
    });
  }
} 