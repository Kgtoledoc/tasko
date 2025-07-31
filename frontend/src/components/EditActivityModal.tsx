import React, { useState, useEffect } from 'react';
import { X, Clock, Save, Trash2 } from 'lucide-react';
import { activityApi } from '../services/activityApi';
import { Activity } from '../types';
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
  const [formData, setFormData] = useState<Partial<Activity>>({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Initialize form data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description,
        startTime: activity.startTime,
        endTime: activity.endTime,
        priority: activity.priority,
        isRecurring: activity.isRecurring,
        recurrencePattern: activity.recurrencePattern,
        daysOfWeek: activity.daysOfWeek
      });
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('El nombre de la actividad es requerido');
      return;
    }

    if (!formData.startTime || !formData.endTime || formData.startTime >= formData.endTime) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    if (!activity) return;

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

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad? Se eliminará de todos los días.')) {
      return;
    }

    try {
      setDeleteLoading(true);
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
      setDeleteLoading(false);
    }
  };

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

  const handleInputChange = (field: keyof Activity, value: string | number | boolean | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Editar Actividad</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Reunión de equipo"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input w-full"
                  rows={2}
                  placeholder="Describe la actividad..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de la Semana *
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      onClick={handleSelectAllDays}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Seleccionar Todos
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllDays}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Limpiar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map(day => (
                      <label
                        key={day.value}
                        className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${
                          (formData.daysOfWeek || []).includes(day.value)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(formData.daysOfWeek || []).includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm font-medium">
                          {day.short}
                        </span>
                      </label>
                    ))}
                  </div>
                  {(formData.daysOfWeek || []).length > 0 && (
                    <p className="text-xs text-gray-500">
                      Seleccionados: {(formData.daysOfWeek || []).length} día{(formData.daysOfWeek || []).length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="input w-full"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={formData.startTime || ''}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={formData.endTime || ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring || false}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                  Actividad recurrente
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 mb-1">
                    Patrón de Recurrencia
                  </label>
                  <select
                    id="recurrencePattern"
                    value={formData.recurrencePattern || 'weekly'}
                    onChange={(e) => handleInputChange('recurrencePattern', e.target.value)}
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
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full sm:w-auto sm:ml-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="btn-danger w-full sm:w-auto mt-3 sm:mt-0"
            >
              {deleteLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Eliminar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal; 