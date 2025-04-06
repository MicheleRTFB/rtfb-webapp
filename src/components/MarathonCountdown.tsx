import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const MarathonCountdown = () => {
  // Array di gare disponibili
  const races = [
    { name: "NYC Marathon", date: "2025-11-03", type: "A" },
    { name: "Milano Marathon", date: "2025-04-06", type: "B" },
    { name: "Roma Run", date: "2025-09-15", type: "C" },
    { name: "Firenze Half", date: "2025-05-21", type: "B" }
  ];

  const [daysLeft, setDaysLeft] = useState(0);
  
  useEffect(() => {
    // Calcola giorni rimanenti per la prossima gara (prima gara nell'array)
    const calculateDaysLeft = () => {
      const today = new Date();
      const raceDate = new Date(races[0].date);
      
      // Giorni rimanenti
      const timeDiff = raceDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff);
    };
    
    calculateDaysLeft();
    
    // Aggiorna ogni giorno
    const timer = setInterval(calculateDaysLeft, 86400000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="h-6 w-6 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Gara</h2>
      </div>
      
      <div className="mt-2">
        <div className="text-4xl font-bold text-green-500">-{daysLeft}gg</div>
        <div className="text-gray-600 mt-1">{races[0].name}</div>
        <div className="text-gray-500 text-sm">{races[0].date}</div>
      </div>
    </div>
  );
};

export default MarathonCountdown; 