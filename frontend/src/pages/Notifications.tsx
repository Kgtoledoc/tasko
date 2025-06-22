import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { notificationApi } from '../services/api';
import { Notification } from '../types';
import toast from 'react-hot-toast';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const notificationsData = filter === 'unread' 
        ? await notificationApi.getUnread()
        : await notificationApi.getAll();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      toast.success('Notificación marcada como leída');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar la notificación como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const count = await notificationApi.markAllAsRead();
      toast.success(`${count} notificaciones marcadas como leídas`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar las notificaciones como leídas');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      try {
        await notificationApi.delete(notificationId);
        toast.success('Notificación eliminada');
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Error al eliminar la notificación');
      }
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5 text-warning-600" />;
      case 'due_date':
        return <AlertTriangle className="h-5 w-5 text-danger-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-danger-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'border-warning-200 bg-warning-50';
      case 'due_date':
        return 'border-danger-200 bg-danger-50';
      case 'overdue':
        return 'border-danger-200 bg-danger-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'Recordatorio';
      case 'due_date':
        return 'Fecha límite';
      case 'overdue':
        return 'Vencida';
      default:
        return 'Notificación';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600">Gestiona tus notificaciones y recordatorios</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="input w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
          >
            <option value="all">Todas</option>
            <option value="unread">No leídas</option>
          </select>
          {filter === 'all' && notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary"
            >
              <CheckCheck size={16} className="mr-2" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Notificaciones ({notifications.length})
          </h3>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'unread' ? 'No tienes notificaciones sin leer.' : 'No tienes notificaciones.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.isRead 
                      ? 'border-gray-200 bg-white' 
                      : getNotificationColor(notification.type)
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${
                            notification.type === 'reminder' 
                              ? 'badge-warning' 
                              : notification.type === 'overdue' || notification.type === 'due_date'
                              ? 'badge-danger'
                              : 'badge-gray'
                          }`}>
                            {getTypeLabel(notification.type)}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-gray-400 hover:text-success-600"
                              title="Marcar como leída"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-gray-400 hover:text-danger-600"
                            title="Eliminar notificación"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`mt-2 text-sm ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-primary-600">
                {notifications.filter(n => !n.isRead).length}
              </div>
              <div className="text-sm text-gray-500">No leídas</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-danger-600">
                {notifications.filter(n => n.type === 'overdue').length}
              </div>
              <div className="text-sm text-gray-500">Vencidas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 