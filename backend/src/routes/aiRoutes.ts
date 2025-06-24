import express from 'express';
import aiController from '../controllers/aiController';

const router = express.Router();

// Procesar comando de AI
router.post('/process', aiController.processCommand);

// Extraer datos de tarea del texto
router.post('/extract-task', aiController.extractTaskData);

export default router; 