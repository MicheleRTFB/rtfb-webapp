import React from 'react';
import PersonalRaceDatabase from '../components/PersonalRaceDatabase';

const PersonalRaceDatabasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Le Mie Gare</h1>
          <p className="mt-2 text-gray-600">
            Tieni traccia delle tue gare, dei tuoi personal best e delle tue recensioni
          </p>
        </div>
        
        <PersonalRaceDatabase />
      </div>
    </div>
  );
};

export default PersonalRaceDatabasePage; 