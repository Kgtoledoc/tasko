import { TaskModel } from '../models/Task';
import { Task } from '../utils/database';

class TaskService {
  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return await TaskModel.create(taskData);
  }

  async getAll(): Promise<Task[]> {
    return await TaskModel.findAll();
  }

  async getById(id: string): Promise<Task | null> {
    return await TaskModel.findById(id);
  }

  async update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    return await TaskModel.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return await TaskModel.delete(id);
  }

  async getByStatus(status: Task['status']): Promise<Task[]> {
    return await TaskModel.findByStatus(status);
  }

  async getOverdue(): Promise<Task[]> {
    return await TaskModel.findOverdue();
  }

  async getWithReminders(): Promise<Task[]> {
    return await TaskModel.findWithReminders();
  }
}

export default new TaskService(); 