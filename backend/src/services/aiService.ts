import axios from 'axios';

interface AIResponse {
  action: 'create_task' | 'update_task' | 'list_tasks' | 'complete_task' | 'help' | 'unknown';
  data?: any;
  message: string;
  confidence: number;
}

interface TaskCommand {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  category?: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async processCommand(userInput: string): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        return this.fallbackProcessing(userInput);
      }

      const prompt = this.buildPrompt(userInput);
      const response = await this.callOpenAI(prompt);
      
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error processing AI command:', error);
      return this.fallbackProcessing(userInput);
    }
  }

  private buildPrompt(userInput: string): string {
    return `Eres un asistente de gestión de tareas. Analiza el siguiente comando del usuario y responde en formato JSON con la siguiente estructura:

{
  "action": "create_task|update_task|list_tasks|complete_task|help|unknown",
  "data": {
    "title": "título de la tarea",
    "description": "descripción opcional",
    "dueDate": "YYYY-MM-DD HH:mm",
    "priority": "low|medium|high",
    "status": "pending|in_progress|completed",
    "category": "categoría opcional"
  },
  "message": "respuesta amigable al usuario",
  "confidence": 0.0-1.0
}

Comando del usuario: "${userInput}"

Responde solo con el JSON válido:`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await axios.post<OpenAIResponse>(
      this.baseUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente de gestión de tareas. Responde siempre en formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  private parseAIResponse(aiResponse: string): AIResponse {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        action: parsed.action || 'unknown',
        data: parsed.data || {},
        message: parsed.message || 'No pude procesar tu comando',
        confidence: parsed.confidence || 0.5
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.fallbackProcessing(aiResponse);
    }
  }

  private fallbackProcessing(userInput: string): AIResponse {
    const input = userInput.toLowerCase();
    
    if (input.includes('crea') || input.includes('nueva') || input.includes('agregar')) {
      return {
        action: 'create_task',
        data: { title: userInput.replace(/crea|nueva|agregar/gi, '').trim() },
        message: 'Entendí que quieres crear una tarea. Por favor, completa los detalles en el formulario.',
        confidence: 0.7
      };
    }
    
    if (input.includes('completada') || input.includes('terminada') || input.includes('hecho')) {
      return {
        action: 'complete_task',
        data: {},
        message: 'Entendí que quieres marcar una tarea como completada. Selecciona la tarea de la lista.',
        confidence: 0.6
      };
    }
    
    if (input.includes('ayuda') || input.includes('help')) {
      return {
        action: 'help',
        data: {},
        message: 'Puedes decirme cosas como: "Crea una tarea para revisar emails mañana", "Marca la tarea X como completada", o "¿Qué tareas tengo pendientes?"',
        confidence: 1.0
      };
    }

    return {
      action: 'unknown',
      data: {},
      message: 'No pude entender tu comando. Prueba diciendo "ayuda" para ver ejemplos.',
      confidence: 0.0
    };
  }

  async extractTaskData(userInput: string): Promise<TaskCommand> {
    const response = await this.processCommand(userInput);
    return response.data || { title: userInput };
  }
}

export default new AIService(); 