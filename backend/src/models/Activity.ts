import { db } from '../utils/database';
import { Activity } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export class ActivityModel {
  static async create(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const activity: Activity = {
        id,
        ...activityData,
        createdAt: now,
        updatedAt: now
      };

      db.run(`
        INSERT INTO activities (
          id, scheduleId, name, description, startTime, endTime, 
          priority, color, isRecurring, recurrencePattern, daysOfWeek, 
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        activity.id,
        activity.scheduleId,
        activity.name,
        activity.description,
        activity.startTime,
        activity.endTime,
        activity.priority,
        activity.color,
        activity.isRecurring ? 1 : 0,
        activity.recurrencePattern,
        activity.daysOfWeek,
        activity.createdAt,
        activity.updatedAt
      ], function(err: any) {
        if (err) {
          console.error('Error creating activity:', err);
          reject(err);
          return;
        }
        resolve(activity);
      });
    });
  }

  static async findAll(): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM activities ORDER BY createdAt DESC', (err: any, rows: any[]) => {
        if (err) {
          console.error('Error finding all activities:', err);
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          isRecurring: Boolean(row.isRecurring),
          daysOfWeek: row.daysOfWeek // Keep as JSON string, parse when needed
        })));
      });
    });
  }

  static async findById(id: string): Promise<Activity | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM activities WHERE id = ?', [id], (err: any, row: any) => {
        if (err) {
          console.error('Error finding activity by id:', err);
          reject(err);
          return;
        }
        if (!row) {
          resolve(null);
          return;
        }
        resolve({
          ...row,
          isRecurring: Boolean(row.isRecurring)
        });
      });
    });
  }

  static async findByScheduleId(scheduleId: string): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM activities WHERE scheduleId = ? ORDER BY startTime ASC', [scheduleId], (err: any, rows: any[]) => {
        if (err) {
          console.error('Error finding activities by schedule id:', err);
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          isRecurring: Boolean(row.isRecurring)
        })));
      });
    });
  }

  static async update(id: string, updates: Partial<Activity>): Promise<Activity | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const values: any[] = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          if (key === 'isRecurring') {
            updateFields.push(`${key} = ?`);
            values.push(value ? 1 : 0);
          } else {
            updateFields.push(`${key} = ?`);
            values.push(value);
          }
        }
      });

      updateFields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      const query = `UPDATE activities SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err: any) {
        if (err) {
          console.error('Error updating activity:', err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          resolve(null);
          return;
        }
        // Return the updated activity
        this.get('SELECT * FROM activities WHERE id = ?', [id], (err: any, row: any) => {
          if (err || !row) {
            resolve(null);
            return;
          }
          resolve({
            ...row,
            isRecurring: Boolean(row.isRecurring)
          });
        });
      });
    });
  }

  static async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM activities WHERE id = ?', [id], function(err: any) {
        if (err) {
          console.error('Error deleting activity:', err);
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  static async deleteByScheduleId(scheduleId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM activities WHERE scheduleId = ?', [scheduleId], function(err: any) {
        if (err) {
          console.error('Error deleting activities by schedule id:', err);
          reject(err);
          return;
        }
        resolve(this.changes);
      });
    });
  }

  // Helper method to get activities for a specific day and time
  static async findForDayAndTime(scheduleId: string, dayOfWeek: number, time: string): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM activities 
        WHERE scheduleId = ? 
        AND json_extract(daysOfWeek, '$') LIKE ?
        AND startTime <= ? 
        AND endTime > ?
        ORDER BY startTime ASC
      `, [scheduleId, `%${dayOfWeek}%`, time, time], (err: any, rows: any[]) => {
        if (err) {
          console.error('Error finding activities for day and time:', err);
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          isRecurring: Boolean(row.isRecurring)
        })));
      });
    });
  }

  // Helper method to get current activity
  static async getCurrentActivity(scheduleId: string): Promise<Activity | null> {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      db.get(`
        SELECT * FROM activities 
        WHERE scheduleId = ? 
        AND json_extract(daysOfWeek, '$') LIKE ?
        AND startTime <= ? 
        AND endTime > ?
        ORDER BY startTime ASC
        LIMIT 1
      `, [scheduleId, `%${currentDay}%`, currentTime, currentTime], (err: any, row: any) => {
        if (err) {
          console.error('Error getting current activity:', err);
          reject(err);
          return;
        }
        if (!row) {
          resolve(null);
          return;
        }
        resolve({
          ...row,
          isRecurring: Boolean(row.isRecurring)
        });
      });
    });
  }
} 