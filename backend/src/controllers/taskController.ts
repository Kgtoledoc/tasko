import { Request, Response } from 'express';
import { TaskModel } from '../models/Task';
import { Task } from '../utils/database';

export class TaskController {
  // Get all tasks
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskModel.findAll();
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  // Get task by ID
  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await TaskModel.findById(id);
      
      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task'
      });
    }
  }

  // Create new task
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, dueDate, priority, status, reminderTime, category } = req.body;

      // Validation
      if (!title || title.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Title is required'
        });
        return;
      }

      if (priority && !['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({
          success: false,
          error: 'Priority must be low, medium, or high'
        });
        return;
      }

      if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Status must be pending, in_progress, or completed'
        });
        return;
      }

      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        description: description?.trim(),
        dueDate: dueDate || undefined,
        priority: priority || 'medium',
        status: status || 'pending',
        reminderTime: reminderTime || undefined,
        category: category?.trim()
      };

      const newTask = await TaskModel.create(taskData);
      
      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }

  // Update task
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validation
      if (updates.priority && !['low', 'medium', 'high'].includes(updates.priority)) {
        res.status(400).json({
          success: false,
          error: 'Priority must be low, medium, or high'
        });
        return;
      }

      if (updates.status && !['pending', 'in_progress', 'completed'].includes(updates.status)) {
        res.status(400).json({
          success: false,
          error: 'Status must be pending, in_progress, or completed'
        });
        return;
      }

      const updatedTask = await TaskModel.update(id, updates);
      
      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task'
      });
    }
  }

  // Delete task
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await TaskModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }

  // Get tasks by status
  static async getTasksByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      
      if (!['pending', 'in_progress', 'completed'].includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status. Must be pending, in_progress, or completed'
        });
        return;
      }

      const tasks = await TaskModel.findByStatus(status as Task['status']);
      
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks by status'
      });
    }
  }

  // Get overdue tasks
  static async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskModel.findOverdue();
      
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch overdue tasks'
      });
    }
  }

  // Get tasks with reminders
  static async getTasksWithReminders(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskModel.findWithReminders();
      
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching tasks with reminders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks with reminders'
      });
    }
  }
} 