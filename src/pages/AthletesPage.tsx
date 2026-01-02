import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Activity, TrendingUp, Calendar, PlusCircle, BarChart3, CalendarDays, History } from 'lucide-react';
import IntervalsService from '../services/IntervalsService';
import { intervalsConfig } from '../config/intervals.config';
import { IntervalsAthlete, IntervalsStats } from '../types/intervals';
import WorkoutCreator from '../components/WorkoutCreator';

const AthletesPage: React.FC = () => {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<IntervalsAthlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<IntervalsAthlete | null>(null);
  const [athleteStats, setAthleteStats] = useState<IntervalsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWorkoutCreator, setShowWorkoutCreator] = useState(false);

  const intervalsService = new IntervalsService(intervalsConfig);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await intervalsService.getAthletes();
      setAthletes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento atleti');
      console.error('Error loading athletes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAthleteStats = async (athleteId: number) => {
    try {
      const stats = await intervalsService.getStats(athleteId);
      setAthleteStats(stats);
    } catch (err) {
      console.error('Error loading athlete stats:', err);
    }
  };

  const handleAthleteClick = async (athlete: IntervalsAthlete) => {
    setSelectedAthlete(athlete);
    await loadAthleteStats(athlete.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento atleti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Errore</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadAthletes}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">I Miei Atleti</h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="w-5 h-5" />
              Aggiungi Atleta
            </button>
          </div>
          <p className="mt-2 text-gray-600">Gestisci e monitora i tuoi runner</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Athletes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h2 className="text-lg font-semibold">Lista Atleti ({athletes.length})</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {athletes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nessun atleta trovato</p>
                    <p className="text-sm mt-1">Aggiungi il tuo primo atleta per iniziare</p>
                  </div>
                ) : (
                  athletes.map((athlete) => (
                    <button
                      key={athlete.id}
                      onClick={() => handleAthleteClick(athlete)}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
                        selectedAthlete?.id === athlete.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {athlete.avatar ? (
                          <img
                            src={athlete.avatar}
                            alt={athlete.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {athlete.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{athlete.name}</p>
                          {athlete.email && (
                            <p className="text-sm text-gray-500 truncate">{athlete.email}</p>
                          )}
                          {athlete.sport && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {athlete.sport}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Athlete Details */}
          <div className="lg:col-span-2">
            {selectedAthlete ? (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="px-6 pb-6">
                    <div className="flex items-end gap-4 -mt-16">
                      {selectedAthlete.avatar ? (
                        <img
                          src={selectedAthlete.avatar}
                          alt={selectedAthlete.name}
                          className="w-32 h-32 rounded-full border-4 border-white object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-4xl">
                            {selectedAthlete.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 pb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedAthlete.name}</h2>
                        {selectedAthlete.email && (
                          <p className="text-gray-600">{selectedAthlete.email}</p>
                        )}
                      </div>
                      {selectedAthlete.premium && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-2">
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Bio Metrics */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedAthlete.weight && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Peso</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAthlete.weight} kg</p>
                        </div>
                      )}
                      {selectedAthlete.maxHR && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">FC Max</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAthlete.maxHR} bpm</p>
                        </div>
                      )}
                      {selectedAthlete.restingHR && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">FC Riposo</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAthlete.restingHR} bpm</p>
                        </div>
                      )}
                      {selectedAthlete.thresholdPace && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Soglia (pace)</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAthlete.thresholdPace}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                {athleteStats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-700">Fitness</h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {athleteStats.fitness?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">CTL (Chronic Training Load)</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-700">Fatica</h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {athleteStats.fatigue?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">ATL (Acute Training Load)</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-700">Forma</h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {athleteStats.form?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">TSB (Training Stress Balance)</p>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setShowWorkoutCreator(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Crea Allenamento
                    </button>
                    <button
                      onClick={() => navigate(`/athletes/${selectedAthlete.id}/stats`)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Vedi Statistiche
                    </button>
                    <button
                      onClick={() => navigate('/calendar')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <CalendarDays className="w-4 h-4" />
                      Calendario
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <History className="w-4 h-4" />
                      Storico
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Seleziona un atleta
                </h3>
                <p className="text-gray-600">
                  Clicca su un atleta dalla lista per visualizzare i dettagli
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Creator Modal */}
      {showWorkoutCreator && selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <WorkoutCreator
              athleteId={selectedAthlete.id}
              onClose={() => setShowWorkoutCreator(false)}
              onSave={() => {
                setShowWorkoutCreator(false);
                // Opzionalmente ricarica i dati
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AthletesPage;
