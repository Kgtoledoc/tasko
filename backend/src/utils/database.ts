import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  reminderTime?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  taskId: string;
  message: string;
  type: 'reminder' | 'overdue' | 'due_soon' | 'activity_change';
  isRead: boolean;
  createdAt: string;
}

// Nuevas interfaces para horarios y tareas recurrentes
export interface WeeklySchedule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  scheduleId: string;
  name: string;
  description?: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  priority: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek: string; // JSON array of day numbers [0,1,2,3,4,5,6]
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSlot {
  id: string;
  scheduleId: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  activityName: string;
  activityDescription?: string;
  priority: 'low' | 'medium' | 'high';
  color?: string;
  isRecurring: boolean;
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  scheduleSlotId: string;
  recurrencePattern: 'weekly' | 'biweekly' | 'monthly';
  nextOccurrence: string;
  lastGenerated: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          dueDate TEXT,
          priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
          reminderTime TEXT,
          category TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating tasks table:', err);
          reject(err);
          return;
        }
        console.log('✅ Tasks table created/verified');
      });

      // Create notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          taskId TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'reminder' CHECK(type IN ('reminder', 'overdue', 'due_soon', 'activity_change')),
          isRead INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating notifications table:', err);
          reject(err);
          return;
        }
        console.log('✅ Notifications table created/verified');
      });

      // Create weekly schedules table
      db.run(`
        CREATE TABLE IF NOT EXISTS weekly_schedules (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          isActive INTEGER DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating weekly_schedules table:', err);
          reject(err);
          return;
        }
        console.log('✅ Weekly schedules table created/verified');
      });

      // Create activities table (new structure)
      db.run(`
        CREATE TABLE IF NOT EXISTS activities (
          id TEXT PRIMARY KEY,
          scheduleId TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
          color TEXT,
          isRecurring INTEGER DEFAULT 0,
          recurrencePattern TEXT CHECK(recurrencePattern IN ('weekly', 'biweekly', 'monthly')),
          daysOfWeek TEXT NOT NULL, -- JSON array of day numbers
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (scheduleId) REFERENCES weekly_schedules (id) ON DELETE CASCADE
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating activities table:', err);
          reject(err);
          return;
        }
        console.log('✅ Activities table created/verified');
      });

      // Create schedule slots table (keep for backward compatibility)
      db.run(`
        CREATE TABLE IF NOT EXISTS schedule_slots (
          id TEXT PRIMARY KEY,
          scheduleId TEXT NOT NULL,
          dayOfWeek INTEGER NOT NULL CHECK(dayOfWeek >= 0 AND dayOfWeek <= 6),
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          activityName TEXT NOT NULL,
          activityDescription TEXT,
          priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
          color TEXT,
          isRecurring INTEGER DEFAULT 0,
          recurrencePattern TEXT CHECK(recurrencePattern IN ('weekly', 'biweekly', 'monthly')),
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (scheduleId) REFERENCES weekly_schedules (id) ON DELETE CASCADE
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating schedule_slots table:', err);
          reject(err);
          return;
        }
        console.log('✅ Schedule slots table created/verified');
      });

      // Create recurring tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS recurring_tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          scheduleSlotId TEXT NOT NULL,
          recurrencePattern TEXT NOT NULL CHECK(recurrencePattern IN ('weekly', 'biweekly', 'monthly')),
          nextOccurrence TEXT NOT NULL,
          lastGenerated TEXT NOT NULL,
          isActive INTEGER DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (scheduleSlotId) REFERENCES schedule_slots (id) ON DELETE CASCADE
        )
      `, (err: any) => {
        if (err) {
          console.error('Error creating recurring_tasks table:', err);
          reject(err);
          return;
        }
        console.log('✅ Recurring tasks table created/verified');
      });

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`, (err: any) => {
        if (err) console.error('Error creating tasks status index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(dueDate)`, (err: any) => {
        if (err) console.error('Error creating tasks due date index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON notifications(taskId)`, (err: any) => {
        if (err) console.error('Error creating notifications task_id index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(isRead)`, (err: any) => {
        if (err) console.error('Error creating notifications is_read index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_schedule_slots_schedule_id ON schedule_slots(scheduleId)`, (err: any) => {
        if (err) console.error('Error creating schedule_slots schedule_id index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_schedule_slots_day_time ON schedule_slots(dayOfWeek, startTime)`, (err: any) => {
        if (err) console.error('Error creating schedule_slots day_time index:', err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_recurring_tasks_next_occurrence ON recurring_tasks(nextOccurrence)`, (err: any) => {
        if (err) console.error('Error creating recurring_tasks next_occurrence index:', err);
      });

      resolve();
    });
  });
}

export { db }; 