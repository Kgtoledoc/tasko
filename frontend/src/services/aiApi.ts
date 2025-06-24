import { Task } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface AIResponse {
  action: 'create_task' | 'update_task' | 'list_tasks' | 'complete_task' | 'help' | 'unknown';
  data?: any;
  message: string;
  confidence: number;
}

export interface AICommandResponse {
  success: boolean;
  response: AIResponse;
  result?: any;
}

export interface TaskDataResponse {
  success: boolean;
  taskData: Partial<Task>;
}

class AIApi {
  async processCommand(command: string): Promise<AICommandResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing AI command:', error);
      throw error;
    }
  }

  async extractTaskData(text: string): Promise<TaskDataResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/extract-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error extracting task data:', error);
      throw error;
    }
  }
}

export default new AIApi(); 