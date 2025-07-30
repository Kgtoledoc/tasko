import React, { useState } from 'react';
import { X, Clock, Save } from 'lucide-react';
import { scheduleApi } from '../services/scheduleApi';
import { CreateScheduleSlotRequest } from '../types';
import toast from 'react-hot-toast';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  onSlotCreated: () => void;
}

const CreateSlotModal: React.FC<CreateSlotModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
  onSlotCreated
}) => {
  const [formData, setFormData] = useState<CreateScheduleSlotRequest>({
    scheduleId,
    activityName: '',
    activityDescription: '',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
    isRecurring: false,
    recurrencePattern: 'weekly'
  });
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activityName.trim()) {
      toast.error('El nombre de la actividad es requerido');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    try {
      setLoading(true);
      const response = await scheduleApi.createSlot(formData);
      
      if (response.success) {
        toast.success('Actividad creada exitosamente');
        setFormData({
          scheduleId,
          activityName: '',
          activityDescription: '',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:00',
          priority: 'medium',
          isRecurring: false,
          recurrencePattern: 'weekly'
        });
        onSlotCreated();
        onClose();
      } else {
        toast.error(response.message || 'Error al crear la actividad');
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      toast.error('Error al crear la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateScheduleSlotRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Agregar Actividad</h3>
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
                <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  id="activityName"
                  value={formData.activityName}
                  onChange={(e) => handleInputChange('activityName', e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Reunión de equipo"
                  required
                />
              </div>

              <div>
                <label htmlFor="activityDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="activityDescription"
                  value={formData.activityDescription}
                  onChange={(e) => handleInputChange('activityDescription', e.target.value)}
                  className="input w-full"
                  rows={2}
                  placeholder="Describe la actividad..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                    Día de la Semana
                  </label>
                  <select
                    id="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={(e) => handleInputChange('dayOfWeek', parseInt(e.target.value))}
                    className="input w-full"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
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
                    value={formData.recurrencePattern}
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
                  Crear Actividad
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

export default CreateSlotModal; 