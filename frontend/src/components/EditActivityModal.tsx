import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Activity, UpdateActivityRequest } from '../types';
import { activityApi } from '../services/activityApi';
import toast from 'react-hot-toast';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onActivityUpdated: () => void;
  onActivityDeleted: () => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  onActivityUpdated,
  onActivityDeleted
}) => {
  const [formData, setFormData] = useState<UpdateActivityRequest>({
    name: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
    isRecurring: false,
    recurrencePattern: 'weekly',
    daysOfWeek: []
  });
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Lunes', short: 'Lun' },
    { value: 2, label: 'Martes', short: 'Mar' },
    { value: 3, label: 'Miércoles', short: 'Mié' },
    { value: 4, label: 'Jueves', short: 'Jue' },
    { value: 5, label: 'Viernes', short: 'Vie' },
    { value: 6, label: 'Sábado', short: 'Sáb' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'text-green-600' },
    { value: 'medium', label: 'Media', color: 'text-yellow-600' },
    { value: 'high', label: 'Alta', color: 'text-red-600' }
  ];

  const recurrencePatterns = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' }
  ];

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description || '',
        startTime: activity.startTime,
        endTime: activity.endTime,
        priority: activity.priority,
        isRecurring: activity.isRecurring,
        recurrencePattern: activity.recurrencePattern || 'weekly',
        daysOfWeek: activity.daysOfWeek
      });
    }
  }, [activity]);

  const handleDayToggle = (dayValue: number) => {
    setFormData(prev => {
      const currentDays = prev.daysOfWeek || [];
      const newDays = currentDays.includes(dayValue)
        ? currentDays.filter(day => day !== dayValue)
        : [...currentDays, dayValue];
      
      return {
        ...prev,
        daysOfWeek: newDays
      };
    });
  };

  const handleSelectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: daysOfWeek.map(day => day.value)
    }));
  };

  const handleClearAllDays = () => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity) return;
    
    if (!formData.name?.trim()) {
      toast.error('El nombre de la actividad es requerido');
      return;
    }

    if (!formData.daysOfWeek || formData.daysOfWeek.length === 0) {
      toast.error('Debes seleccionar al menos un día');
      return;
    }

    if (!formData.startTime || !formData.endTime || formData.startTime >= formData.endTime) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    try {
      setLoading(true);
      const response = await activityApi.updateActivity(activity.id, formData);
      
      if (response.success) {
        toast.success('Actividad actualizada exitosamente');
        onActivityUpdated();
        onClose();
      } else {
        toast.error(response.message || 'Error al actualizar la actividad');
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await activityApi.deleteActivity(activity.id);
      
      if (response.success) {
        toast.success('Actividad eliminada exitosamente');
        onActivityDeleted();
        onClose();
      } else {
        toast.error(response.message || 'Error al eliminar la actividad');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Actividad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Actividad
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input w-full"
              placeholder="Ej: Reunión de equipo"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input w-full h-20 resize-none"
              placeholder="Descripción de la actividad..."
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Fin
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.priority === priority.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Días de la Semana
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAllDays}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Seleccionar Todos
                </button>
                <button
                  type="button"
                  onClick={handleClearAllDays}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                    (formData.daysOfWeek || []).includes(day.value)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring Options */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Actividad Recurrente</span>
            </label>
            
            {formData.isRecurring && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patrón de Recurrencia
                </label>
                <select
                  value={formData.recurrencePattern}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrencePattern: e.target.value as any }))}
                  className="input w-full"
                >
                  {recurrencePatterns.map(pattern => (
                    <option key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 btn-danger flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal; 