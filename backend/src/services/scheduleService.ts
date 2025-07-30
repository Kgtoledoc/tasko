import { WeeklyScheduleModel } from '../models/WeeklySchedule';
import { ScheduleSlotModel } from '../models/ScheduleSlot';
import { RecurringTaskModel } from '../models/RecurringTask';
import { TaskModel } from '../models/Task';
import { WeeklySchedule, ScheduleSlot, RecurringTask, Task } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

class ScheduleService {
  // Weekly Schedule methods
  async createSchedule(scheduleData: Omit<WeeklySchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklySchedule> {
    return await WeeklyScheduleModel.create(scheduleData);
  }

  async getAllSchedules(): Promise<WeeklySchedule[]> {
    return await WeeklyScheduleModel.findAll();
  }

  async getScheduleById(id: string): Promise<WeeklySchedule | null> {
    return await WeeklyScheduleModel.findById(id);
  }

  async updateSchedule(id: string, updates: Partial<Omit<WeeklySchedule, 'id' | 'createdAt'>>): Promise<WeeklySchedule | null> {
    return await WeeklyScheduleModel.update(id, updates);
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return await WeeklyScheduleModel.delete(id);
  }

  async getActiveSchedules(): Promise<WeeklySchedule[]> {
    return await WeeklyScheduleModel.findActive();
  }

  // Schedule Slot methods
  async createSlot(slotData: Omit<ScheduleSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleSlot> {
    return await ScheduleSlotModel.create(slotData);
  }

  async getSlotsByScheduleId(scheduleId: string): Promise<ScheduleSlot[]> {
    return await ScheduleSlotModel.findByScheduleId(scheduleId);
  }

  async updateSlot(id: string, updates: Partial<Omit<ScheduleSlot, 'id' | 'createdAt'>>): Promise<ScheduleSlot | null> {
    return await ScheduleSlotModel.update(id, updates);
  }

  async deleteSlot(id: string): Promise<boolean> {
    return await ScheduleSlotModel.delete(id);
  }

  async getRecurringSlots(): Promise<ScheduleSlot[]> {
    return await ScheduleSlotModel.findRecurring();
  }

  // Recurring Task methods
  async createRecurringTask(taskData: Omit<RecurringTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecurringTask> {
    return await RecurringTaskModel.create(taskData);
  }

  async getAllRecurringTasks(): Promise<RecurringTask[]> {
    return await RecurringTaskModel.findAll();
  }

  async getRecurringTaskById(id: string): Promise<RecurringTask | null> {
    return await RecurringTaskModel.findById(id);
  }

  async updateRecurringTask(id: string, updates: Partial<Omit<RecurringTask, 'id' | 'createdAt'>>): Promise<RecurringTask | null> {
    return await RecurringTaskModel.update(id, updates);
  }

  async deleteRecurringTask(id: string): Promise<boolean> {
    return await RecurringTaskModel.delete(id);
  }

  async getActiveRecurringTasks(): Promise<RecurringTask[]> {
    return await RecurringTaskModel.findActive();
  }

  // Advanced methods for schedule management
  async generateTasksFromSchedule(scheduleId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    const schedule = await this.getScheduleById(scheduleId);
    if (!schedule || !schedule.isActive) {
      return [];
    }

    const slots = await this.getSlotsByScheduleId(scheduleId);
    const generatedTasks: Task[] = [];

    for (const slot of slots) {
      if (slot.isRecurring) {
        const tasks = await this.generateRecurringTasks(slot, startDate, endDate);
        generatedTasks.push(...tasks);
      }
    }

    return generatedTasks;
  }

  private async generateRecurringTasks(slot: ScheduleSlot, startDate: Date, endDate: Date): Promise<Task[]> {
    const tasks: Task[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() === slot.dayOfWeek) {
        const taskDate = new Date(currentDate);
        const [hours, minutes] = slot.startTime.split(':').map(Number);
        taskDate.setHours(hours, minutes, 0, 0);

        // Check if we should generate this task based on recurrence pattern
        if (this.shouldGenerateTask(slot, taskDate)) {
          const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
            title: slot.activityName,
            description: slot.activityDescription,
            dueDate: taskDate.toISOString(),
            priority: slot.priority,
            status: 'pending',
            category: 'scheduled',
            reminderTime: slot.startTime
          };

          const createdTask = await TaskModel.create(task);
          tasks.push(createdTask);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return tasks;
  }

  private shouldGenerateTask(slot: ScheduleSlot, taskDate: Date): boolean {
    if (!slot.recurrencePattern) return true;

    const now = new Date();
    const weekDiff = Math.floor((taskDate.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000));

    switch (slot.recurrencePattern) {
      case 'weekly':
        return true;
      case 'biweekly':
        return weekDiff % 2 === 0;
      case 'monthly':
        return weekDiff % 4 === 0;
      default:
        return true;
    }
  }

  // Get current activity based on time
  async getCurrentActivity(): Promise<ScheduleSlot | null> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const activeSchedules = await this.getActiveSchedules();
    
    for (const schedule of activeSchedules) {
      const slots = await this.getSlotsByScheduleId(schedule.id);
      
      for (const slot of slots) {
        if (slot.dayOfWeek === dayOfWeek && 
            slot.startTime <= currentTime && 
            slot.endTime > currentTime) {
          return slot;
        }
      }
    }

    return null;
  }

  // Get next activity
  async getNextActivity(): Promise<ScheduleSlot | null> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const activeSchedules = await this.getActiveSchedules();
    let nextSlot: ScheduleSlot | null = null;
    let nextTime: Date | null = null;

    for (const schedule of activeSchedules) {
      const slots = await this.getSlotsByScheduleId(schedule.id);
      
      for (const slot of slots) {
        const slotTime = new Date();
        slotTime.setDate(slotTime.getDate() + (slot.dayOfWeek - dayOfWeek + 7) % 7);
        const [hours, minutes] = slot.startTime.split(':').map(Number);
        slotTime.setHours(hours, minutes, 0, 0);

        if (slotTime > now && (!nextTime || slotTime < nextTime)) {
          nextTime = slotTime;
          nextSlot = slot;
        }
      }
    }

    return nextSlot;
  }

  // Get weekly schedule view
  async getWeeklySchedule(weekStart: Date): Promise<ScheduleSlot[]> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const activeSchedules = await this.getActiveSchedules();
    const allSlots: ScheduleSlot[] = [];

    for (const schedule of activeSchedules) {
      const slots = await this.getSlotsByScheduleId(schedule.id);
      allSlots.push(...slots);
    }

    return allSlots.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }
}

export default new ScheduleService(); 