import React, { useEffect, useState } from 'react';
import IntervalsService from '../services/IntervalsService';
import { IntervalsWorkout } from '../types/intervals';
import { intervalsConfig } from '../config/intervals.config';

const WorkoutHistory: React.FC = () => {
  const [workouts, setWorkouts] = useState<IntervalsWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const intervalsService = new IntervalsService(intervalsConfig);
        const history = await intervalsService.getWorkoutHistory(20);
        setWorkouts(history);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel caricamento degli allenamenti');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Storico Allenamenti</h2>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{workout.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(workout.date).toLocaleDateString('it-IT')}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded ${
                workout.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : workout.status === 'PLANNED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {workout.status === 'COMPLETED'
                ? 'Completato'
                : workout.status === 'PLANNED'
                ? 'Pianificato'
                : 'Cancellato'}
            </span>
          </div>
          
          {workout.description && (
            <p className="mt-2 text-sm text-gray-600">{workout.description}</p>
          )}
          
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Durata:</span>
              <span className="ml-1">{Math.round(workout.duration / 60)} min</span>
            </div>
            {workout.distance && (
              <div>
                <span className="text-gray-500">Distanza:</span>
                <span className="ml-1">{(workout.distance / 1000).toFixed(1)} km</span>
              </div>
            )}
            {workout.metrics?.tss && (
              <div>
                <span className="text-gray-500">TSS:</span>
                <span className="ml-1">{workout.metrics.tss}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutHistory; 