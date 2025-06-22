import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  X
} from 'lucide-react';
import { taskApi } from '../services/api';
import { Task, TaskFilters } from '../types';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    category: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  useEffect(() => {
    const handleOpenModal = () => {
      setShowNewTaskModal(true);
    };

    window.addEventListener('openNewTaskModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openNewTaskModal', handleOpenModal);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await taskApi.getAll();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter(task => 
        task.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await taskApi.update(taskId, { status: newStatus });
      toast.success('Estado de tarea actualizado');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await taskApi.delete(taskId);
        toast.success('Tarea eliminada');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    try {
      await taskApi.create({
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate || undefined,
        priority: newTask.priority,
        status: newTask.status,
        category: newTask.category || undefined
      });
      
      toast.success('Tarea creada exitosamente');
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        category: ''
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100';
      case 'in_progress':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
          <p className="text-gray-600">Gestiona tus tareas y proyectos</p>
        </div>
        <button 
          onClick={() => setShowNewTaskModal(true)} 
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  className="input pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              <Filter size={16} className="mr-2" />
              Filtros
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                className="input"
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as Task['status'] || undefined })}
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
              </select>

              <select
                className="input"
                value={filters.priority || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as Task['priority'] || undefined })}
              >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>

              <input
                type="text"
                placeholder="Categoría..."
                className="input"
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="card-body">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
              <p className="text-gray-600 mb-4">
                {tasks.length === 0 
                  ? 'Comienza creando tu primera tarea'
                  : 'No hay tareas que coincidan con los filtros aplicados'
                }
              </p>
              {tasks.length === 0 && (
                <button 
                  onClick={() => setShowNewTaskModal(true)}
                  className="btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Crear primera tarea
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${
                    isOverdue(task) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {isOverdue(task) && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Vencida
                          </span>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm mb-3 ${
                          task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' && 'Pendiente'}
                          {task.status === 'in_progress' && 'En progreso'}
                          {task.status === 'completed' && 'Completada'}
                        </span>
                        
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' && 'Alta'}
                          {task.priority === 'medium' && 'Media'}
                          {task.priority === 'low' && 'Baja'}
                        </span>

                        {task.category && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                            {task.category}
                          </span>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Vence: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <select
                        className="text-sm border rounded px-2 py-1"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completada</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar tarea"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nueva Tarea</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Título de la tarea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="input w-full"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Descripción de la tarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="datetime-local"
                    className="input w-full"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    className="input w-full"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  placeholder="Ej: Trabajo, Personal, Salud"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 