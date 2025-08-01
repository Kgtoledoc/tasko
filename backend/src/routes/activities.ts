import express from 'express';
import { ActivityController } from '../controllers/activityController';

const router = express.Router();

// Activity routes
router.post('/', ActivityController.createActivity);
router.get('/schedule/:scheduleId', ActivityController.getActivitiesBySchedule);
router.get('/:id', ActivityController.getActivityById);
router.put('/:id', ActivityController.updateActivity);
router.delete('/:id', ActivityController.deleteActivity);

// Debug routes
router.get('/debug/all', ActivityController.getAllActivities);

// Special routes
router.get('/schedule/:scheduleId/current', ActivityController.getCurrentActivity);
router.get('/schedule/:scheduleId/day/:dayOfWeek/time/:time', ActivityController.getActivitiesForDayAndTime);

export default router; 