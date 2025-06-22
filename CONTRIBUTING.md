# 🤝 Guía de Contribución - Tasko

¡Gracias por tu interés en contribuir a Tasko! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Cómo Contribuir](#-cómo-contribuir)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Estándares de Código](#-estándares-de-código)
- [Proceso de Pull Request](#-proceso-de-pull-request)
- [Reportar Bugs](#-reportar-bugs)
- [Solicitar Features](#-solicitar-features)
- [Preguntas Frecuentes](#-preguntas-frecuentes)

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

Aceptamos los siguientes tipos de contribuciones:

- 🐛 **Bug fixes** - Corrección de errores
- ✨ **New features** - Nuevas funcionalidades
- 📚 **Documentation** - Mejoras en la documentación
- 🎨 **UI/UX improvements** - Mejoras en la interfaz
- ⚡ **Performance** - Optimizaciones de rendimiento
- 🧪 **Tests** - Agregar o mejorar tests
- 🔧 **Refactoring** - Mejoras en el código

### Antes de Contribuir

1. **Revisa los issues existentes** para evitar duplicados
2. **Discute cambios grandes** en un issue antes de implementar
3. **Asegúrate de que tu código** sigue los estándares del proyecto
4. **Escribe tests** para nuevas funcionalidades

## ⚙️ Configuración del Entorno

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git

### Configuración Local

1. **Fork el repositorio**
   ```bash
   # Ve a GitHub y haz fork del repositorio
   # Luego clona tu fork
   git clone https://github.com/tu-usuario/tasko.git
   cd tasko
   ```

2. **Configurar upstream**
   ```bash
   git remote add upstream https://github.com/original-owner/tasko.git
   ```

3. **Instalar dependencias**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

5. **Ejecutar en desarrollo**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## 📝 Estándares de Código

### TypeScript

#### Configuración
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Convenciones de Nomenclatura

```typescript
// Interfaces y tipos
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

type TaskStatus = 'pending' | 'in-progress' | 'completed';

// Funciones
const createTask = (taskData: CreateTaskData): Promise<Task> => {
  // implementación
};

// Constantes
const API_BASE_URL = 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 5000;

// Clases
class TaskService {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  public async getAll(): Promise<Task[]> {
    // implementación
  }
}
```

### React/TypeScript

#### Estructura de Componentes
```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  const handleStatusChange = useCallback((id: string, status: Task['status']) => {
    onTaskUpdate(id, { status });
  }, [onTaskUpdate]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <div className="task-list">
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
          onDelete={onTaskDelete}
        />
      ))}
    </div>
  );
};
```

#### Hooks Personalizados
```tsx
import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/Task';
import { taskService } from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
};
```

### Backend/Express

#### Estructura de Controladores
```typescript
import { Request, Response } from 'express';
import { TaskModel } from '../models/Task';
import { validateTask } from '../utils/validation';

export class TaskController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskModel.findAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const validation = validateTask(req.body);
      if (!validation.isValid) {
        res.status(400).json({ 
          error: 'Datos inválidos',
          details: validation.errors 
        });
        return;
      }

      const task = await TaskModel.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al crear tarea',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
```

#### Middleware de Validación
```typescript
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateCreateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  
  body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601'),
  
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('La prioridad debe ser low, medium o high'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Datos de entrada inválidos',
        details: errors.array() 
      });
    }
    next();
  }
];
```

### Estilos CSS/Tailwind

#### Clases de Tailwind
```tsx
// Usar clases utilitarias de Tailwind
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### CSS Personalizado
```css
/* Solo cuando sea necesario */
@layer components {
  .task-card {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow;
  }
  
  .priority-badge {
    @apply px-2 py-1 rounded-full text-xs font-medium;
  }
  
  .priority-low {
    @apply bg-green-100 text-green-800;
  }
  
  .priority-medium {
    @apply bg-yellow-100 text-yellow-800;
  }
  
  .priority-high {
    @apply bg-red-100 text-red-800;
  }
}
```

## 🔄 Proceso de Pull Request

### 1. Crear una Rama

```bash
# Asegúrate de estar en main y actualizado
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nombre-de-la-feature
# o
git checkout -b fix/nombre-del-bug
```

### 2. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código del proyecto
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 3. Commits

```bash
# Hacer commits frecuentes y descriptivos
git add .
git commit -m "feat: agregar filtro por prioridad en lista de tareas

- Agregar componente FilterBar
- Implementar lógica de filtrado
- Agregar tests para el componente
- Actualizar documentación"

# Tipos de commits:
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: cambios en documentación
# style: cambios de formato
# refactor: refactorización de código
# test: agregar o modificar tests
# chore: cambios en build o herramientas
```

### 4. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-de-la-feature

# Crear Pull Request en GitHub
```

### 5. Template de Pull Request

```markdown
## 📝 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] Bug fix (corrección de error)
- [ ] New feature (nueva funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Documentation update (actualización de documentación)

## 🔧 Cambios Realizados

- Lista de cambios específicos
- Archivos modificados
- Nuevas funcionalidades

## 🧪 Tests

- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración agregados/actualizados
- [ ] Todos los tests pasan localmente

## 📸 Capturas de Pantalla

Si aplica, agregar capturas de pantalla de los cambios visuales.

## ✅ Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado mi código donde sea necesario
- [ ] He hecho los cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi nueva funcionalidad
- [ ] Todos los tests nuevos y existentes pasan

## 🔗 Issues Relacionados

Closes #123
Relates to #456
```

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug

Descripción clara y concisa del bug.

## 🔄 Pasos para Reproducir

1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hacia abajo hasta '...'
4. Ve el error

## ✅ Comportamiento Esperado

Descripción clara de lo que debería suceder.

## 📸 Capturas de Pantalla

Si aplica, agregar capturas de pantalla para explicar el problema.

## 💻 Información del Sistema

- **OS**: [ej. macOS 12.0]
- **Browser**: [ej. Chrome 96.0.4664.110]
- **Node.js**: [ej. 18.0.0]
- **Versión de Tasko**: [ej. 1.0.0]

## 📋 Información Adicional

Cualquier otra información o contexto sobre el problema.
```

## ✨ Solicitar Features

### Template de Feature Request

```markdown
## 🎯 Descripción de la Feature

Descripción clara y concisa de la funcionalidad que te gustaría ver.

## 💡 Propuesta de Solución

Si tienes una idea de cómo implementarla, descríbela aquí.

## 🔄 Alternativas Consideradas

Describe cualquier solución alternativa que hayas considerado.

## 📋 Información Adicional

Cualquier otra información o capturas de pantalla sobre la feature request.
```

## 🧪 Testing

### Tests Unitarios

```typescript
// __tests__/TaskService.test.ts
import { TaskService } from '../services/TaskService';
import { Task } from '../types/Task';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-01-15T10:00:00.000Z',
        priority: 'medium' as const,
        status: 'pending' as const,
        category: 'work'
      };

      const result = await taskService.create(taskData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe(taskData.description);
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        title: '', // título vacío
        description: 'Test',
        dueDate: 'invalid-date',
        priority: 'invalid' as any,
        status: 'pending' as const,
        category: 'work'
      };

      await expect(taskService.create(invalidData)).rejects.toThrow();
    });
  });
});
```

### Tests de Componentes

```tsx
// __tests__/TaskCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types/Task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: '2024-01-15T10:00:00.000Z',
  priority: 'medium',
  status: 'pending',
  category: 'work',
  createdAt: '2024-01-10T08:00:00.000Z',
  updatedAt: '2024-01-10T08:00:00.000Z'
};

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });
});
```

## 📚 Documentación

### Comentarios de Código

```typescript
/**
 * Crea una nueva tarea en el sistema
 * @param taskData - Datos de la tarea a crear
 * @returns Promise<Task> - La tarea creada
 * @throws {Error} Si los datos son inválidos o hay un error de base de datos
 */
async create(taskData: CreateTaskData): Promise<Task> {
  // Validar datos de entrada
  const validation = this.validateTaskData(taskData);
  if (!validation.isValid) {
    throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
  }

  // Crear tarea en la base de datos
  const task = await TaskModel.create(taskData);
  
  // Generar notificación si hay recordatorio
  if (taskData.reminderTime) {
    await this.createReminderNotification(task);
  }

  return task;
}
```

### README de Componentes

```markdown
# TaskCard Component

Componente para mostrar una tarea individual en formato de tarjeta.

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| task | Task | Sí | Datos de la tarea |
| onEdit | (task: Task) => void | Sí | Callback para editar |
| onDelete | (id: string) => void | Sí | Callback para eliminar |

## Uso

```tsx
import { TaskCard } from './TaskCard';

<TaskCard 
  task={taskData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Estilos

El componente utiliza Tailwind CSS y es completamente responsive.
```

## ❓ Preguntas Frecuentes

### ¿Cómo puedo empezar a contribuir?

1. Revisa los issues etiquetados con "good first issue" o "help wanted"
2. Lee esta guía de contribución
3. Configura tu entorno de desarrollo
4. Crea un issue para discutir tu propuesta
5. Implementa tu solución

### ¿Qué hago si encuentro un bug?

1. Busca en los issues existentes para ver si ya fue reportado
2. Si no existe, crea un nuevo issue usando el template de bug report
3. Proporciona toda la información posible para reproducir el bug

### ¿Cómo puedo solicitar una nueva funcionalidad?

1. Busca en los issues existentes para ver si ya fue solicitada
2. Si no existe, crea un nuevo issue usando el template de feature request
3. Describe claramente la funcionalidad y su caso de uso

### ¿Cuánto tiempo tarda en revisarse mi PR?

- **Pequeños cambios**: 1-3 días
- **Cambios medianos**: 3-7 días
- **Cambios grandes**: 1-2 semanas

### ¿Qué hago si mi PR no es aceptado?

1. Revisa los comentarios de los maintainers
2. Haz los cambios solicitados
3. Si tienes dudas, pregunta en el PR
4. Si no estás de acuerdo, puedes discutir respetuosamente

---

## 📞 Contacto

Si tienes preguntas sobre contribuir:

- **Issues**: Usa los issues de GitHub
- **Discussions**: Usa las GitHub Discussions
- **Email**: [tu-email@ejemplo.com]

---

**¡Gracias por contribuir a Tasko! 🚀** 