import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  Calendar,
  Bell
} from 'lucide-react';
import { taskApi, notificationApi } from '../services/api';
import { Task, Notification } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, notificationsData] = await Promise.all([
          taskApi.getAll(),
          notificationApi.getUnread()
        ]);
        setTasks(tasksData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length,
    unreadNotifications: notifications.length
  };

  const recentTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => 
      task.dueDate && 
      new Date(task.dueDate) > new Date() && 
      task.status !== 'completed'
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tus tareas y actividades</p>
        </div>
        <Link to="/tasks" className="btn-primary">
          <Plus size={16} className="mr-2" />
          Nueva Tarea
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tareas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vencidas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Tareas Recientes</h3>
          </div>
          <div className="card-body">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay tareas recientes</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-500">
                        Creada el {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'gray'}`}>
                        {task.priority}
                      </span>
                      <span className={`badge-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'gray'}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todas las tareas →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Próximas Tareas</h3>
          </div>
          <div className="card-body">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay tareas próximas</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-500">
                        Vence el {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className={`badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'gray'}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todas las tareas →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
              <Bell className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/notifications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todas las notificaciones →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 