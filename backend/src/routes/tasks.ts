import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', TaskController.getAllTasks);

// GET /api/tasks/status/:status - Get tasks by status
router.get('/status/:status', TaskController.getTasksByStatus);

// GET /api/tasks/overdue - Get overdue tasks
router.get('/overdue', TaskController.getOverdueTasks);

// GET /api/tasks/reminders - Get tasks with reminders
router.get('/reminders', TaskController.getTasksWithReminders);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', TaskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', TaskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', TaskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', TaskController.deleteTask);

export default router; 