import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, Clock, MapPin, Zap } from 'lucide-react';
import IntervalsService from '../services/IntervalsService';
import { intervalsConfig } from '../config/intervals.config';
import { IntervalsWorkout, IntervalsAthlete } from '../types/intervals';

interface WorkoutCreatorProps {
  athleteId?: number;
  onClose?: () => void;
  onSave?: (workout: IntervalsWorkout) => void;
  initialDate?: string;
}

const WorkoutCreator: React.FC<WorkoutCreatorProps> = ({
  athleteId,
  onClose,
  onSave,
  initialDate
}) => {
  const [athletes, setAthletes] = useState<IntervalsAthlete[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(athleteId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Run',
    date: initialDate || new Date().toISOString().split('T')[0],
    duration: 3600, // in secondi (1 ora default)
    distance: 10, // km
    intensity: 'Moderate',
    status: 'PLANNED' as const,
  });

  const intervalsService = new IntervalsService(intervalsConfig);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      const data = await intervalsService.getAthletes();
      setAthletes(data);
      if (data.length > 0 && !selectedAthleteId) {
        setSelectedAthleteId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading athletes:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'distance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAthleteId) {
      setError('Seleziona un atleta');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const workout: Omit<IntervalsWorkout, 'id'> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        date: formData.date,
        duration: formData.duration,
        distance: formData.distance,
        intensity: formData.intensity,
        status: formData.status,
      };

      const createdWorkout = await intervalsService.createWorkout(selectedAthleteId, workout);

      if (onSave) {
        onSave(createdWorkout);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'Run',
        date: new Date().toISOString().split('T')[0],
        duration: 3600,
        distance: 10,
        intensity: 'Moderate',
        status: 'PLANNED',
      });

      alert('Allenamento creato con successo!');

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella creazione dell\'allenamento');
    } finally {
      setLoading(false);
    }
  };

  const workoutTypes = [
    'Run', 'Long Run', 'Easy Run', 'Tempo Run', 'Interval', 'Fartlek',
    'Recovery', 'Race', 'Cross Training', 'Strength', 'Rest'
  ];

  const intensityLevels = [
    'Recovery', 'Easy', 'Moderate', 'Tempo', 'Threshold', 'VO2Max', 'Race'
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-2xl font-bold text-white">Crea Nuovo Allenamento</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Athlete Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Atleta
          </label>
          <select
            value={selectedAthleteId || ''}
            onChange={(e) => setSelectedAthleteId(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleziona atleta...</option>
            {athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.name}
              </option>
            ))}
          </select>
        </div>

        {/* Workout Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Allenamento *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="es. Fartlek 10km"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Allenamento *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {workoutTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration and Distance Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Durata (minuti) *
            </label>
            <input
              type="number"
              name="duration"
              value={Math.floor(formData.duration / 60)}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) * 60 }))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formatDuration(formData.duration)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Distanza (km)
            </label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="w-4 h-4 inline mr-1" />
            Intensità
          </label>
          <select
            name="intensity"
            value={formData.intensity}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {intensityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione / Note
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Inserisci dettagli sull'allenamento, obiettivi, note tecniche..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stato
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="PLANNED">Pianificato</option>
            <option value="COMPLETED">Completato</option>
            <option value="CANCELLED">Annullato</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creazione...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salva Allenamento
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutCreator;
