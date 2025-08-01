import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Plus, Edit, Settings } from 'lucide-react';
import { activityApi } from '../services/activityApi';
import { scheduleApi } from '../services/scheduleApi';
import { WeeklySchedule, Activity, ScheduleStats } from '../types';
import CreateScheduleModal from '../components/CreateScheduleModal';
import CreateActivityModal from '../components/CreateActivityModal';
import EditActivityModal from '../components/EditActivityModal';
import toast from 'react-hot-toast';

const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<WeeklySchedule | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [schedulesResponse, statsResponse] = await Promise.all([
        scheduleApi.getAllSchedules(),
        scheduleApi.getScheduleStats()
      ]);

      if (schedulesResponse.success) {
        setSchedules(schedulesResponse.data || []);
        if (schedulesResponse.data && schedulesResponse.data.length > 0) {
          setSelectedSchedule(schedulesResponse.data[0]);
          await loadActivities(schedulesResponse.data[0].id);
        }
      }

      if (statsResponse.success) {
        setStats(statsResponse.data || null);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Error al cargar los horarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadActivities = async (scheduleId: string) => {
    try {
      const response = await activityApi.getActivitiesBySchedule(scheduleId);
      if (response.success) {
        setActivities(response.data || []);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Error al cargar las actividades');
    }
  };

  const handleScheduleChange = async (schedule: WeeklySchedule) => {
    setSelectedSchedule(schedule);
    await loadActivities(schedule.id);
  };

  const handleScheduleCreated = () => {
    loadData();
  };

  const handleActivityCreated = () => {
    if (selectedSchedule) {
      loadActivities(selectedSchedule.id);
    }
  };

  const handleActivityUpdated = () => {
    if (selectedSchedule) {
      loadActivities(selectedSchedule.id);
    }
  };

  const handleActivityDeleted = () => {
    if (selectedSchedule) {
      loadActivities(selectedSchedule.id);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowEditModal(true);
  };

  const getActivitiesForDayAndTime = (dayOfWeek: number, time: string) => {
    return activities.filter(activity => 
      activity.daysOfWeek.includes(dayOfWeek) && 
      activity.startTime <= time && 
      activity.endTime > time
    );
  };

  const getCurrentActivity = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return activities.find(activity => 
      activity.daysOfWeek.includes(currentDay) && 
      activity.startTime <= currentTime && 
      activity.endTime > currentTime
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  // Helper function to calculate position and height for activities
  const calculateActivityPosition = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Convert to total minutes from start of day
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // Calculate position as percentage of day (24 hours = 1440 minutes)
    const top = (startTotalMinutes / 1440) * 100;
    const height = ((endTotalMinutes - startTotalMinutes) / 1440) * 100;
    
    return { top, height };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horarios Semanales</h1>
          <p className="text-gray-600">Gestiona tus actividades recurrentes y horarios</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Horario
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Horarios Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSchedules}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Horarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSchedules}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actividades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
              </div>
            </div>
          </div>

          {stats.currentActivity && (
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Actividad Actual</p>
                  <p className="text-lg font-semibold text-blue-900">{stats.currentActivity.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Selector */}
      {schedules.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Seleccionar Horario</h2>
            <div className="flex space-x-2">
              {schedules.map(schedule => (
                <button
                  key={schedule.id}
                  onClick={() => handleScheduleChange(schedule)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSchedule?.id === schedule.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {schedule.name}
                  {!schedule.isActive && (
                    <span className="ml-2 text-xs opacity-75">(Inactivo)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Calendar */}
      {selectedSchedule && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Horario: {selectedSchedule.name}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowActivityModal(true)}
                className="btn-secondary"
              >
                <Plus size={16} className="mr-2" />
                Agregar Actividad
              </button>
              <button
                onClick={() => {/* TODO: Edit schedule */}}
                className="btn-secondary"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="h-12"></div>
                {daysOfWeek.map(day => (
                  <div key={day} className="h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="h-16 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {formatTime(time)}
                  </div>
                  {daysOfWeek.map((_, dayIndex) => {
                    const dayActivities = getActivitiesForDayAndTime(dayIndex, time);
                    const currentActivity = getCurrentActivity();
                    
                    return (
                      <div
                        key={`${dayIndex}-${time}`}
                        className="h-16 border border-gray-200 rounded-lg p-1 relative"
                      >
                        {dayActivities.map(activity => {
                          const { top, height } = calculateActivityPosition(activity.startTime, activity.endTime);
                          
                          return (
                            <div
                              key={activity.id}
                              className={`absolute rounded text-xs p-1 border cursor-pointer transition-all hover:shadow-md ${
                                getPriorityColor(activity.priority)
                              } ${
                                currentActivity?.id === activity.id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              style={{
                                top: `${top}%`,
                                height: `${height}%`,
                                left: '2px',
                                right: '2px'
                              }}
                              onClick={() => handleEditActivity(activity)}
                              title={`${activity.name} - ${activity.startTime} a ${activity.endTime}`}
                            >
                              <div className="font-medium truncate">{activity.name}</div>
                              {activity.isRecurring && (
                                <div className="text-xs opacity-75">🔄 {activity.recurrencePattern}</div>
                              )}
                              <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity">
                                <Edit size={10} className="text-gray-600" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {schedules.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay horarios creados</h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer horario semanal para comenzar a organizar tus actividades
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus size={16} className="mr-2" />
            Crear Primer Horario
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onScheduleCreated={handleScheduleCreated}
      />

      {selectedSchedule && (
        <CreateActivityModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          scheduleId={selectedSchedule.id}
          onActivityCreated={handleActivityCreated}
        />
      )}

      <EditActivityModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onActivityUpdated={handleActivityUpdated}
        onActivityDeleted={handleActivityDeleted}
      />
    </div>
  );
};

export default Schedules; 