import express from 'express';
import { ScheduleController } from '../controllers/scheduleController';

const router = express.Router();

// Weekly Schedule routes
router.post('/', ScheduleController.createSchedule);
router.get('/', ScheduleController.getAllSchedules);
router.get('/:id', ScheduleController.getScheduleById);
router.put('/:id', ScheduleController.updateSchedule);
router.delete('/:id', ScheduleController.deleteSchedule);

// Schedule Slot routes
router.post('/:scheduleId/slots', ScheduleController.createSlot);
router.get('/:scheduleId/slots', ScheduleController.getSlotsByScheduleId);
router.put('/slots/:id', ScheduleController.updateSlot);
router.delete('/slots/:id', ScheduleController.deleteSlot);

// Advanced schedule routes
router.get('/current/activity', ScheduleController.getCurrentActivity);
router.get('/next/activity', ScheduleController.getNextActivity);
router.get('/weekly/view', ScheduleController.getWeeklySchedule);
router.post('/:scheduleId/generate-tasks', ScheduleController.generateTasksFromSchedule);

export default router; 