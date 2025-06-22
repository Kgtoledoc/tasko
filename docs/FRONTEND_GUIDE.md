# 🎨 Guía del Frontend - Tasko

## 📋 Información General

El frontend de Tasko está construido con **React 18** y **TypeScript**, utilizando las mejores prácticas modernas de desarrollo web.

## 🏗️ Arquitectura

### Estructura de Carpetas
```
frontend/src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   ├── forms/          # Componentes de formularios
│   └── layout/         # Componentes de layout
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
├── styles/             # Estilos globales
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## 🧩 Componentes

### Componentes de UI Básicos

#### Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick
}) => {
  // Implementación
};
```

#### Card
```tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  // Implementación
};
```

### Componentes de Formularios

#### TaskForm
```tsx
interface TaskFormProps {
  task?: Task;
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  // Implementación con validación
};
```

#### FilterBar
```tsx
interface FilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  // Implementación de filtros
};
```

## 📄 Páginas

### Dashboard
```tsx
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);

  useEffect(() => {
    // Cargar estadísticas y actividad reciente
  }, []);

  return (
    <div className="dashboard">
      <StatsCards stats={stats} />
      <RecentActivityList activity={recentActivity} />
    </div>
  );
};
```

### Tasks
```tsx
const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [loading, setLoading] = useState(true);

  // Implementación de gestión de tareas
};
```

### Notifications
```tsx
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Implementación de gestión de notificaciones
};
```

## 🎣 Custom Hooks

### useTasks
```tsx
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};
```

### useNotifications
```tsx
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response);
      setUnreadCount(response.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? updated : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
```

## 🔧 Servicios

### TaskService
```tsx
class TaskService {
  private baseURL = '/api/tasks';

  async getAll(): Promise<Task[]> {
    const response = await axios.get(this.baseURL);
    return response.data;
  }

  async getById(id: string): Promise<Task> {
    const response = await axios.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async create(taskData: CreateTaskData): Promise<Task> {
    const response = await axios.post(this.baseURL, taskData);
    return response.data;
  }

  async update(id: string, updates: UpdateTaskData): Promise<Task> {
    const response = await axios.put(`${this.baseURL}/${id}`, updates);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`);
  }

  async getByStatus(status: TaskStatus): Promise<Task[]> {
    const response = await axios.get(`${this.baseURL}/status/${status}`);
    return response.data;
  }

  async getOverdue(): Promise<Task[]> {
    const response = await axios.get(`${this.baseURL}/overdue`);
    return response.data;
  }
}

export const taskService = new TaskService();
```

### NotificationService
```tsx
class NotificationService {
  private baseURL = '/api/notifications';

  async getAll(): Promise<Notification[]> {
    const response = await axios.get(this.baseURL);
    return response.data;
  }

  async getUnread(): Promise<Notification[]> {
    const response = await axios.get(`${this.baseURL}/unread`);
    return response.data;
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await axios.put(`${this.baseURL}/${id}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await axios.put(`${this.baseURL}/read-all`);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`);
  }
}

export const notificationService = new NotificationService();
```

## 🎨 Estilos y UI

### Tailwind CSS
El proyecto utiliza Tailwind CSS para estilos. Configuración en `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
};
```

### Componentes de UI
```tsx
// Ejemplo de componente con Tailwind
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Vence: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
        </span>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800">
            Editar
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 🔄 Estado y Gestión de Datos

### Context API
```tsx
interface AppContextType {
  tasks: Task[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, notificationsData] = await Promise.all([
        taskService.getAll(),
        notificationService.getAll()
      ]);
      setTasks(tasksData);
      setNotifications(notificationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppContext.Provider value={{
      tasks,
      notifications,
      loading,
      error,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

## 🚀 Optimizaciones

### React.memo
```tsx
const TaskList = React.memo<TaskListProps>(({ tasks, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
```

### useMemo y useCallback
```tsx
const Dashboard: React.FC = () => {
  const { tasks, notifications } = useApp();

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };
  }, [tasks]);

  const handleTaskUpdate = useCallback((id: string, updates: UpdateTaskData) => {
    // Lógica de actualización
  }, []);

  return (
    <div>
      <StatsCards stats={stats} />
      <TaskList tasks={tasks} onUpdate={handleTaskUpdate} />
    </div>
  );
};
```

## 🧪 Testing

### Configuración de Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
};
```

### Ejemplo de Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
  it('should submit form with correct data', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Nueva tarea' }
    });

    fireEvent.click(screen.getByText(/guardar/i));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nueva tarea'
      })
    );
  });
});
```

## 📱 Responsive Design

### Breakpoints
```tsx
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};
```

### Componente Responsive
```tsx
const TaskGrid: React.FC<TaskGridProps> = ({ tasks }) => {
  const breakpoint = useBreakpoint();

  const gridCols = {
    sm: 'grid-cols-1',
    md: 'grid-cols-2',
    lg: 'grid-cols-3',
    xl: 'grid-cols-4'
  };

  return (
    <div className={`grid gap-4 ${gridCols[breakpoint]}`}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
```

## 🔧 Configuración de Desarrollo

### ESLint
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

### Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

📖 **Para más información, consulta la [documentación de la API](API_DOCUMENTATION.md)** 