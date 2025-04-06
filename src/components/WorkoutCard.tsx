import React, { useState } from 'react';

interface WorkoutCardProps {
  workout: {
    title: string;
    type: "rest" | "base" | "fartlek" | "long";
    date: string;
    completed: boolean;
    duration: string;
    stress: number;
    maxZ: string;
    rpe: number;
    structure: {
      phase: string;
      duration: string;
      intensity: string;
      zone: string;
    }[];
  };
  onClose: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClose }) => {
  const [openInfo, setOpenInfo] = useState({
    stress: false,
    maxZ: false,
    rpe: false
  });

  const toggleInfo = (key: 'stress' | 'maxZ' | 'rpe') => {
    setOpenInfo(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!workout) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-gray-600">Nessun allenamento selezionato</p>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Torna al calendario
        </button>
      </div>
    );
  }

  const getIntensityColor = (type: string) => {
    switch (type) {
      case 'base':
        return 'bg-green-500';
      case 'fartlek':
        return 'bg-yellow-500';
      case 'long':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIntensityLabel = (type: string) => {
    switch (type) {
      case 'base':
        return 'Facile';
      case 'fartlek':
        return 'Medio';
      case 'long':
        return 'Duro';
      default:
        return 'Riposo';
    }
  };

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-800">Il tuo allenamento:</h1>
              <h2 className="text-xl font-medium text-gray-700">{workout.title}</h2>
            </div>
            <span className={`mt-2 px-4 py-1 ${getIntensityColor(workout.type)} text-white rounded-full text-sm font-medium w-fit`}>
              {getIntensityLabel(workout.type)}
            </span>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900">
        <video 
          className="w-full h-full object-cover"
          poster="/running-form.mp4"
          controls
        >
          <source src="/running-form.mp4" type="video/mp4" />
          Il tuo browser non supporta il tag video.
        </video>
      </div>

      {/* Workout Info */}
      <div className="p-5">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg shadow relative">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 mb-1">Durata</p>
            </div>
            <p className="font-bold text-xl text-gray-800">{workout.duration}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow relative">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 mb-1">Stress</p>
              <button 
                className="text-gray-400 hover:text-blue-600" 
                title="Visualizza informazioni sullo Stress Score"
                onClick={() => toggleInfo('stress')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
            <p className="font-bold text-xl text-gray-800">{workout.stress}</p>
            {openInfo.stress && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>Stress Score:</strong> Misura l'impatto dell'allenamento sul corpo. Un valore di {workout.stress} indica un carico moderato, ideale per allenamenti di base.
                </p>
                <div className="mt-2 flex justify-end">
                  <a href="#" className="text-blue-600 text-sm font-medium flex items-center">
                    Approfondisci in Academy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-3 rounded-lg shadow relative">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 mb-1">Max Z</p>
              <button 
                className="text-gray-400 hover:text-blue-600" 
                title="Visualizza informazioni sulla Zona Massima"
                onClick={() => toggleInfo('maxZ')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
            <p className="font-bold text-xl text-gray-800">{workout.maxZ}</p>
            {openInfo.maxZ && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>Zona Massima:</strong> La zona di allenamento più alta raggiunta durante la sessione. {workout.maxZ} indica un'intensità aerobica moderata, ottimale per allenamenti di base.
                </p>
                <div className="mt-2 flex justify-end">
                  <a href="#" className="text-blue-600 text-sm font-medium flex items-center">
                    Approfondisci in Academy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-3 rounded-lg shadow relative">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 mb-1">RPE</p>
              <button 
                className="text-gray-400 hover:text-blue-600" 
                title="Visualizza informazioni sul Rating of Perceived Exertion"
                onClick={() => toggleInfo('rpe')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
            <p className="font-bold text-xl text-gray-800">{workout.rpe}</p>
            {openInfo.rpe && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>RPE (Rating of Perceived Exertion):</strong> Scala di percezione dello sforzo da 1 a 10. Un valore di {workout.rpe} indica uno sforzo "leggero", dove puoi mantenere una conversazione mentre ti alleni.
                </p>
                <div className="mt-2 flex justify-end">
                  <a href="#" className="text-blue-600 text-sm font-medium flex items-center">
                    Approfondisci in Academy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-4 relative mt-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 mb-1">Struttura Allenamento</p>
            <button className="text-gray-400 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
          <div className="mt-2">
            <ul className="space-y-2">
              {workout.structure.map((phase, index) => (
                <li key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${phase.zone === 'Z1' ? 'bg-teal-500' : 'bg-green-500'} mr-2`}></div>
                  <span className="font-medium">{phase.phase} {phase.duration} {phase.intensity}</span>
                  <span className="ml-auto text-sm text-gray-500">{phase.zone}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow col-span-4 relative mt-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 mb-1">Descrizione</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Questo allenamento è stato progettato per migliorare la tua resistenza aerobica e la capacità di mantenere un ritmo costante.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard; 