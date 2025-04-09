import React from 'react';
import RaceDatabaseWidget from '../components/RaceDatabaseWidget';

const RaceDatabasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Gare Running</h1>
          <p className="mt-2 text-gray-600">
            Esplora, cerca e gestisci le tue gare preferite
          </p>
        </div>
        
        <RaceDatabaseWidget />
      </div>
    </div>
  );
};

export default RaceDatabasePage; 