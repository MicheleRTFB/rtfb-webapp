import React from 'react';
import { Calendar, Trophy, Users, TrendingUp } from 'lucide-react';
import RaceDatabaseWidget from '../components/RaceDatabaseWidget';

const StatsCard = ({ icon: Icon, title, value, description }: { 
  icon: any, 
  title: string, 
  value: string, 
  description: string 
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-50">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const RaceDatabasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con statistiche */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Scegli la tua prossima sfida
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Trova la gara perfetta per il tuo obiettivo
            </p>
          </div>

          {/* Statistiche */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <StatsCard
              icon={Calendar}
              title="Gare Totali"
              value="156"
              description="In programma nei prossimi 12 mesi"
            />
            <StatsCard
              icon={Trophy}
              title="Gare in Evidenza"
              value="12"
              description="Selezionate per te questa settimana"
            />
            <StatsCard
              icon={Users}
              title="Partecipanti"
              value="2.5k+"
              description="Atleti nella community"
            />
            <StatsCard
              icon={TrendingUp}
              title="Prossime Gare"
              value="23"
              description="Nei prossimi 30 giorni"
            />
          </div>
        </div>
      </div>

      {/* Contenuto principale */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quick Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Obiettivi Popolari</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Prima Maratona', color: 'blue' },
              { label: 'Personal Best 10K', color: 'green' },
              { label: 'Trail Running', color: 'orange' },
              { label: 'Ultra Distance', color: 'purple' },
              { label: 'Gare Cittadine', color: 'pink' }
            ].map(({ label, color }) => (
              <button
                key={label}
                className={`px-4 py-2 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800 hover:bg-${color}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Widget Database Gare */}
        <RaceDatabaseWidget />
      </div>
    </div>
  );
};

export default RaceDatabasePage; 