import React, { useState } from 'react';
import { X, Calendar, Save } from 'lucide-react';
import { scheduleApi } from '../services/scheduleApi';
import { CreateScheduleRequest } from '../types';
import toast from 'react-hot-toast';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: () => void;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onScheduleCreated
}) => {
  const [formData, setFormData] = useState<CreateScheduleRequest>({
    name: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre del horario es requerido');
      return;
    }

    try {
      setLoading(true);
      const response = await scheduleApi.createSchedule(formData);
      
      if (response.success) {
        toast.success('Horario creado exitosamente');
        setFormData({ name: '', description: '', isActive: true });
        onScheduleCreated();
        onClose();
      } else {
        toast.error(response.message || 'Error al crear el horario');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Error al crear el horario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateScheduleRequest, value: string | boolean) => {
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
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Horario</h3>
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
                  Nombre del Horario *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Horario de Trabajo"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input w-full"
                  rows={3}
                  placeholder="Describe el propósito de este horario..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Horario activo
                </label>
              </div>
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
                  Crear Horario
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

export default CreateScheduleModal; 