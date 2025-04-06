import React from 'react';
import CalendarioMensile from '../components/CalendarioMensile';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendario Eventi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestisci le tue gare e gli appuntamenti
          </p>
        </div>
        
        <div className="flex justify-center">
          <CalendarioMensile />
        </div>
      </div>
    </div>
  );
};

export default Calendar; 