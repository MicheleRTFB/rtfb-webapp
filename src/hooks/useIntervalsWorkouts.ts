import { useState, useEffect } from 'react';
import IntervalsService from '../services/IntervalsService';
import { intervalsConfig } from '../config/intervals.config';
import { IntervalsWorkout } from '../types/intervals';

export const useIntervalsWorkouts = () => {
  const [workouts, setWorkouts] = useState<IntervalsWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const service = new IntervalsService(intervalsConfig);
        
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];
        
        console.log('Fetching workouts dal', startDate, 'al', endDate);
        const data = await service.getWorkouts(startDate, endDate);
        console.log('Workouts ricevuti nel hook:', data);
        
        setWorkouts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Errore nel hook:', err);
        setError(err instanceof Error ? err.message : 'Errore nel caricamento degli allenamenti');
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return { workouts, loading, error };
}; 