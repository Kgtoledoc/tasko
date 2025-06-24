import { Request, Response } from 'express';
import aiService from '../services/aiService';
import { TaskModel } from '../models/Task';
import { Task } from '../utils/database';

class AIController {
  async processCommand(req: Request, res: Response) {
    try {
      const { command } = req.body;

      if (!command || typeof command !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El comando es requerido y debe ser una cadena de texto'
        });
      }

      const aiResponse = await aiService.processCommand(command);

      // Ejecutar la acción correspondiente
      let result = null;
      
      switch (aiResponse.action) {
        case 'create_task':
          if (aiResponse.data && aiResponse.data.title) {
            const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
              title: aiResponse.data.title,
              description: aiResponse.data.description,
              dueDate: aiResponse.data.dueDate,
              priority: aiResponse.data.priority || 'medium',
              status: aiResponse.data.status || 'pending',
              category: aiResponse.data.category
            };
            result = await TaskModel.create(taskData);
            aiResponse.message = `Tarea "${aiResponse.data.title}" creada exitosamente`;
          }
          break;
          
        case 'list_tasks':
          const tasks = await TaskModel.findAll();
          const pendingTasks = tasks.filter((task: Task) => task.status !== 'completed');
          result = pendingTasks;
          aiResponse.message = `Tienes ${pendingTasks.length} tareas pendientes`;
          break;
          
        case 'complete_task':
          // Para completar tareas necesitamos más contexto
          aiResponse.message = 'Por favor, especifica qué tarea quieres marcar como completada';
          break;
          
        case 'help':
          aiResponse.message = `¡Hola! Soy tu asistente de tareas. Puedes decirme cosas como:
          
• "Crea una tarea para revisar emails mañana a las 2pm"
• "Agenda una reunión con el equipo el viernes"
• "¿Qué tareas tengo pendientes?"
• "Marca la tarea 'revisar presupuesto' como completada"

¡Intenta con alguno de estos comandos!`;
          break;
          
        default:
          aiResponse.message = 'No pude entender tu comando. Prueba diciendo "ayuda" para ver ejemplos.';
      }

      res.json({
        success: true,
        response: aiResponse,
        result
      });

    } catch (error) {
      console.error('Error in AI controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  async extractTaskData(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El texto es requerido y debe ser una cadena de texto'
        });
      }

      const taskData = await aiService.extractTaskData(text);

      res.json({
        success: true,
        taskData
      });

    } catch (error) {
      console.error('Error extracting task data:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default new AIController(); 