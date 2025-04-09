import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WidgetsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('WidgetsPage rendered');
  }, []);

  const widgets = [
    {
      name: 'Calendario Gare',
      description: 'Gestisci e visualizza le tue gare in un calendario interattivo',
      path: '/calendar',
      icon: '📅'
    },
    {
      name: 'Database Gare',
      description: 'Esplora e gestisci il database delle gare disponibili',
      path: '/races',
      icon: '🏃'
    },
    {
      name: 'Scarpe da Corsa',
      description: 'Gestisci e monitora le tue scarpe da corsa',
      path: '/shoes',
      icon: '👟'
    },
    {
      name: 'Widget Gara',
      description: 'Visualizza e gestisci i dettagli della tua prossima gara',
      path: '/race-widget',
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            I Nostri Widget
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Esplora tutti i widget disponibili per migliorare la tua esperienza di corsa
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mb-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Torna al Login
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <Link
              key={widget.path}
              to={widget.path}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{widget.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {widget.name}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {widget.description}
                </p>
                <div className="flex items-center text-blue-600">
                  <span>Accedi al widget</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetsPage; 