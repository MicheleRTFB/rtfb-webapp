import React, { useState, useEffect } from 'react';
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react';

const RaceWidget = () => {
  // Array di gare disponibili
  const races = [
    { name: "NYC Marathon", date: "2025-11-03", type: "A" },
    { name: "Milano Marathon", date: "2025-04-06", type: "B" },
    { name: "Roma Run", date: "2025-09-15", type: "C" },
    { name: "Firenze Half", date: "2025-05-21", type: "B" }
  ];

  const [activeRaceIndex, setActiveRaceIndex] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [completion, setCompletion] = useState(0);
  
  const activeRace = races[activeRaceIndex];

  // Funzione per passare alla gara successiva
  const nextRace = () => {
    setActiveRaceIndex((prevIndex) => (prevIndex + 1) % races.length);
  };

  // Funzione per passare alla gara precedente
  const prevRace = () => {
    setActiveRaceIndex((prevIndex) => (prevIndex - 1 + races.length) % races.length);
  };

  useEffect(() => {
    // Calcola giorni rimanenti e avanzamento per la gara attiva
    const calculateProgress = () => {
      const today = new Date();
      const raceDate = new Date(activeRace.date);
      
      // Giorni rimanenti
      const timeDiff = raceDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff);
      
      // Simulazione dell'avanzamento basato sulla data
      // Assumiamo che l'allenamento inizi 180 giorni prima della gara
      const totalTrainingDays = 180;
      
      if (daysDiff >= totalTrainingDays) {
        // L'allenamento non è ancora iniziato
        setCompletion(0);
      } else if (daysDiff <= 0) {
        // La gara è già passata o è oggi
        setCompletion(100);
      } else {
        // Siamo nel periodo di allenamento
        const daysCompleted = totalTrainingDays - daysDiff;
        const completionPercentage = (daysCompleted / totalTrainingDays) * 100;
        setCompletion(Math.min(100, Math.max(0, completionPercentage)));
      }
    };
    
    calculateProgress();
    
    // Aggiorna ogni giorno
    const timer = setInterval(calculateProgress, 86400000);
    return () => clearInterval(timer);
  }, [activeRace]);

  // Calcola colore dell'indicatore basato sui giorni rimanenti
  const getColor = () => {
    if (daysLeft > 90) return "#4CAF50"; // Verde: molto tempo
    if (daysLeft > 30) return "#FFC107"; // Giallo: tempo medio
    return "#FF5722"; // Rosso: poco tempo
  };

  // Formatta la data in italiano
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const months = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    
    return `${day} ${months[month-1]} ${year}`;
  };

  return (
    <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
      {/* Header con controlli di navigazione */}
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={prevRace}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">{activeRace.name}</h2>
        </div>
        <button 
          onClick={nextRace}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      {/* Data della gara */}
      <div className="flex items-center justify-center mb-3">
        <Timer className="h-4 w-4 text-green-600 mr-1" />
        <p className="text-sm text-gray-600">{formatDate(activeRace.date)}</p>
      </div>
      
      {/* Conto alla rovescia */}
      <div className="text-center mb-4">
        <h2 className="text-5xl font-bold text-gray-800">
          {daysLeft > 0 
            ? `-${daysLeft}gg` 
            : daysLeft === 0 
              ? "Oggi!" 
              : "Completata"
          }
        </h2>
      </div>
      
      {/* Tipo di gara */}
      <div className="flex flex-col items-center mb-4">
        <p className="text-sm text-gray-600 mb-2">Tipo di gara</p>
        <div className="flex space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeRace.type === 'A' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>A</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeRace.type === 'B' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>B</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeRace.type === 'C' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>C</div>
        </div>
      </div>
      
      {/* Barra di avanzamento allenamento */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Avanzamento:</span>
          <span className="font-medium">{Math.round(completion)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full"
            style={{ 
              width: `${completion}%`,
              backgroundColor: getColor()
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RaceWidget; 