import { db } from '../utils/database';
import { ScheduleSlot } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class ScheduleSlotModel {
  static async create(slotData: Omit<ScheduleSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleSlot> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const slot: ScheduleSlot = {
        id,
        ...slotData,
        createdAt: now,
        updatedAt: now
      };

      db.run(
        `INSERT INTO schedule_slots (id, scheduleId, dayOfWeek, startTime, endTime, activityName, activityDescription, priority, color, isRecurring, recurrencePattern, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slot.id, 
          slot.scheduleId, 
          slot.dayOfWeek, 
          slot.startTime, 
          slot.endTime, 
          slot.activityName, 
          slot.activityDescription, 
          slot.priority, 
          slot.color, 
          slot.isRecurring ? 1 : 0, 
          slot.recurrencePattern, 
          slot.createdAt, 
          slot.updatedAt
        ],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            resolve(slot);
          }
        }
      );
    });
  }

  static async findAll(): Promise<ScheduleSlot[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM schedule_slots ORDER BY dayOfWeek, startTime`,
        [],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isRecurring: Boolean(row.isRecurring)
            })));
          }
        }
      );
    });
  }

  static async findById(id: string): Promise<ScheduleSlot | null> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM schedule_slots WHERE id = ?`,
        [id],
        (err: any, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(null);
          } else {
            resolve({
              ...row,
              isRecurring: Boolean(row.isRecurring)
            });
          }
        }
      );
    });
  }

  static async findByScheduleId(scheduleId: string): Promise<ScheduleSlot[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM schedule_slots WHERE scheduleId = ? ORDER BY dayOfWeek, startTime`,
        [scheduleId],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isRecurring: Boolean(row.isRecurring)
            })));
          }
        }
      );
    });
  }

  static async findByDayAndTime(dayOfWeek: number, startTime: string, endTime: string): Promise<ScheduleSlot[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM schedule_slots WHERE dayOfWeek = ? AND startTime = ? AND endTime = ?`,
        [dayOfWeek, startTime, endTime],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isRecurring: Boolean(row.isRecurring)
            })));
          }
        }
      );
    });
  }

  static async update(id: string, updates: Partial<Omit<ScheduleSlot, 'id' | 'createdAt'>>): Promise<ScheduleSlot | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.scheduleId !== undefined) {
        updateFields.push('scheduleId = ?');
        values.push(updates.scheduleId);
      }
      if (updates.dayOfWeek !== undefined) {
        updateFields.push('dayOfWeek = ?');
        values.push(updates.dayOfWeek);
      }
      if (updates.startTime !== undefined) {
        updateFields.push('startTime = ?');
        values.push(updates.startTime);
      }
      if (updates.endTime !== undefined) {
        updateFields.push('endTime = ?');
        values.push(updates.endTime);
      }
      if (updates.activityName !== undefined) {
        updateFields.push('activityName = ?');
        values.push(updates.activityName);
      }
      if (updates.activityDescription !== undefined) {
        updateFields.push('activityDescription = ?');
        values.push(updates.activityDescription);
      }
      if (updates.priority !== undefined) {
        updateFields.push('priority = ?');
        values.push(updates.priority);
      }
      if (updates.color !== undefined) {
        updateFields.push('color = ?');
        values.push(updates.color);
      }
      if (updates.isRecurring !== undefined) {
        updateFields.push('isRecurring = ?');
        values.push(updates.isRecurring ? 1 : 0);
      }
      if (updates.recurrencePattern !== undefined) {
        updateFields.push('recurrencePattern = ?');
        values.push(updates.recurrencePattern);
      }
      updateFields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      if (updateFields.length === 1) { // Only updatedAt
        resolve(null);
        return;
      }

      db.run(
        `UPDATE schedule_slots SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(err: any) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            // Fetch the updated record
            db.get(
              `SELECT * FROM schedule_slots WHERE id = ?`,
              [id],
              (err: any, row: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    ...row,
                    isRecurring: Boolean(row.isRecurring)
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
        `DELETE FROM schedule_slots WHERE id = ?`,
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

  static async deleteByScheduleId(scheduleId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM schedule_slots WHERE scheduleId = ?`,
        [scheduleId],
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

  static async findRecurring(): Promise<ScheduleSlot[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM schedule_slots WHERE isRecurring = 1 ORDER BY dayOfWeek, startTime`,
        [],
        (err: any, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              isRecurring: Boolean(row.isRecurring)
            })));
          }
        }
      );
    });
  }
} 