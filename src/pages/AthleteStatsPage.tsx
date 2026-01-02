import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, TrendingUp, Calendar, Heart, Zap, MapPin, Clock, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import IntervalsService from '../services/IntervalsService';
import { intervalsConfig } from '../config/intervals.config';
import { IntervalsAthlete, IntervalsStats, IntervalsActivity, IntervalsWellness } from '../types/intervals';

const AthleteStatsPage: React.FC = () => {
  const { athleteId } = useParams<{ athleteId: string }>();
  const [athlete, setAthlete] = useState<IntervalsAthlete | null>(null);
  const [stats, setStats] = useState<IntervalsStats | null>(null);
  const [activities, setActivities] = useState<IntervalsActivity[]>([]);
  const [wellness, setWellness] = useState<IntervalsWellness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const intervalsService = new IntervalsService(intervalsConfig);

  useEffect(() => {
    if (athleteId) {
      loadAthleteData(parseInt(athleteId));
    }
  }, [athleteId, timeRange]);

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    switch (timeRange) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const loadAthleteData = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getDateRange();

      const [athleteData, statsData, activitiesData, wellnessData] = await Promise.all([
        intervalsService.getAthlete(id),
        intervalsService.getStats(id),
        intervalsService.getActivities(id, start, end),
        intervalsService.getWellness(id, start, end)
      ]);

      setAthlete(athleteData);
      setStats(statsData);
      setActivities(activitiesData);
      setWellness(wellnessData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
      console.error('Error loading athlete data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalDistance = activities.reduce((sum, act) => sum + (act.distance || 0), 0) / 1000; // metri -> km
    const totalTime = activities.reduce((sum, act) => sum + (act.moving_time || 0), 0);
    const totalElevation = activities.reduce((sum, act) => sum + (act.total_elevation_gain || 0), 0);
    const avgPace = totalDistance > 0 ? totalTime / totalDistance : 0;

    return {
      distance: totalDistance.toFixed(1),
      time: Math.floor(totalTime / 3600),
      elevation: totalElevation.toFixed(0),
      pace: formatPace(avgPace),
      workouts: activities.length
    };
  };

  const formatPace = (secondsPerKm: number) => {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.floor(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getChartData = () => {
    return activities.map(activity => ({
      date: new Date(activity.start_date_local).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      distance: ((activity.distance || 0) / 1000).toFixed(1),
      duration: Math.floor((activity.moving_time || 0) / 60),
      hr: activity.average_hr,
      load: activity.icu_training_load || activity.training_load
    })).reverse();
  };

  const getWellnessChartData = () => {
    return wellness.map(w => ({
      date: new Date(w.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      weight: w.weight,
      hrv: w.hrv,
      sleep: w.sleepSecs ? Math.floor(w.sleepSecs / 3600) : null,
      fatigue: w.fatigue,
      soreness: w.soreness
    })).reverse();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento statistiche...</p>
        </div>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Errore</h3>
          <p className="text-red-600">{error || 'Atleta non trovato'}</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {athlete.avatar ? (
              <img
                src={athlete.avatar}
                alt={athlete.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {athlete.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{athlete.name}</h1>
              <p className="text-gray-600">Statistiche e Performance</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              7 Giorni
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              30 Giorni
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '90d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              90 Giorni
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Distanza</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.distance}</p>
            <p className="text-sm text-gray-500">km totali</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-700">Tempo</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.time}</p>
            <p className="text-sm text-gray-500">ore totali</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-700">Allenamenti</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.workouts}</p>
            <p className="text-sm text-gray-500">completati</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Dislivello</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.elevation}</p>
            <p className="text-sm text-gray-500">metri D+</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-700">Passo Medio</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totals.pace}</p>
            <p className="text-sm text-gray-500">velocità media</p>
          </div>
        </div>

        {/* Fitness Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Fitness (CTL)</h3>
              </div>
              <p className="text-4xl font-bold">{stats.fitness?.toFixed(1) || 'N/A'}</p>
              <p className="text-sm opacity-90 mt-1">Chronic Training Load</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Fatica (ATL)</h3>
              </div>
              <p className="text-4xl font-bold">{stats.fatigue?.toFixed(1) || 'N/A'}</p>
              <p className="text-sm opacity-90 mt-1">Acute Training Load</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Forma (TSB)</h3>
              </div>
              <p className="text-4xl font-bold">{stats.form?.toFixed(1) || 'N/A'}</p>
              <p className="text-sm opacity-90 mt-1">Training Stress Balance</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distance & Duration Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distanza e Durata</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="distance" fill="#3b82f6" name="Distanza (km)" />
                <Bar yAxisId="right" dataKey="duration" fill="#10b981" name="Durata (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Heart Rate & Load Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">FC Media e Carico</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="hr" stroke="#ef4444" name="FC Media (bpm)" />
                <Line yAxisId="right" type="monotone" dataKey="load" stroke="#8b5cf6" name="Carico" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wellness Chart */}
        {wellness.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wellness e Recupero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWellnessChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getWellnessChartData().some(d => d.weight) && (
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Peso (kg)" />
                )}
                {getWellnessChartData().some(d => d.hrv) && (
                  <Line type="monotone" dataKey="hrv" stroke="#10b981" name="HRV" />
                )}
                {getWellnessChartData().some(d => d.fatigue) && (
                  <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" name="Fatica" />
                )}
                {getWellnessChartData().some(d => d.soreness) && (
                  <Line type="monotone" dataKey="soreness" stroke="#ef4444" name="Dolore" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attività Recenti</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distanza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FC Media</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nessuna attività nel periodo selezionato
                    </td>
                  </tr>
                ) : (
                  activities.slice(0, 10).map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.start_date_local).toLocaleDateString('it-IT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((activity.distance || 0) / 1000).toFixed(2)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(activity.moving_time || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.average_hr ? `${activity.average_hr} bpm` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteStatsPage;
