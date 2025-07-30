import { db } from '../utils/database';
import { WeeklySchedule } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class WeeklyScheduleModel {
  static async create(scheduleData: Omit<WeeklySchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklySchedule> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const schedule: WeeklySchedule = {
        id,
        ...scheduleData,
        createdAt: now,
        updatedAt: now
      };

      db.run(
        `INSERT INTO weekly_schedules (id, name, description, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [schedule.id, schedule.name, schedule.description, schedule.isActive ? 1 : 0, schedule.createdAt, schedule.updatedAt],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(schedule);
          }
        }
      );
    });
  }

  static async findAll(): Promise<WeeklySchedule[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM weekly_schedules ORDER BY createdAt DESC`,
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

  static async findById(id: string): Promise<WeeklySchedule | null> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM weekly_schedules WHERE id = ?`,
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

  static async update(id: string, updates: Partial<Omit<WeeklySchedule, 'id' | 'createdAt'>>): Promise<WeeklySchedule | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        values.push(updates.description);
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
        `UPDATE weekly_schedules SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(err: any) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            // Fetch the updated record
            db.get(
              `SELECT * FROM weekly_schedules WHERE id = ?`,
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
        `DELETE FROM weekly_schedules WHERE id = ?`,
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

  static async findActive(): Promise<WeeklySchedule[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM weekly_schedules WHERE isActive = 1 ORDER BY createdAt DESC`,
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