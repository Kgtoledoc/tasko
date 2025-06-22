import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar
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

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

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
        <Link to="/tasks/new" className="btn-primary">
          <Plus size={16} className="mr-2" />
          Nueva Tarea
        </Link>
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
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Tareas ({filteredTasks.length})
          </h3>
        </div>
        <div className="card-body">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {tasks.length === 0 ? 'Comienza creando tu primera tarea.' : 'No se encontraron tareas con los filtros aplicados.'}
              </p>
              {tasks.length === 0 && (
                <div className="mt-6">
                  <Link to="/tasks/new" className="btn-primary">
                    <Plus size={16} className="mr-2" />
                    Crear Tarea
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    isOverdue(task) 
                      ? 'border-danger-200 bg-danger-50' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <h4 className={`text-sm font-medium ${
                          isOverdue(task) ? 'text-danger-900' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                      </div>
                      
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span className={isOverdue(task) ? 'text-danger-600 font-medium' : ''}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {task.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completada</option>
                      </select>

                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </Link>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-danger-600"
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
    </div>
  );
};

export default Tasks; 