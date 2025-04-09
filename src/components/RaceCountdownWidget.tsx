import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Timer } from 'lucide-react';

interface Race {
  id: number;
  title: string;
  location: string;
  date: string;
  distance: string;
  type: string;
}

const RaceCountdownWidget: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([
    {
      id: 1,
      title: "La Gaz'Run",
      location: "Gazeran - FR",
      date: "2024-03-30T09:00:00",
      distance: "12km",
      type: "trail"
    },
    {
      id: 2,
      title: "20° Trofeo del Diamante",
      location: "Bolzaneto - Genova (Ge) - IT",
      date: "2024-04-04T10:00:00",
      distance: "10km",
      type: "strada"
    },
    {
      id: 3,
      title: "Camminata Urbana Coop Alleanza 3.0",
      location: "Sassuolo (Mo) - IT",
      date: "2024-04-05T09:30:00",
      distance: "5km",
      type: "camminata"
    }
  ]);

  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const newTimeLeft: { [key: number]: string } = {};

      races.forEach(race => {
        const raceDate = new Date(race.date);
        const difference = raceDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            newTimeLeft[race.id] = `${days}g ${hours}h`;
          } else if (hours > 0) {
            newTimeLeft[race.id] = `${hours}h ${minutes}m`;
          } else {
            newTimeLeft[race.id] = `${minutes}m`;
          }
        } else {
          newTimeLeft[race.id] = "In corso";
        }
      });

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Aggiorna ogni minuto

    return () => clearInterval(timer);
  }, [races]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Prossime Gare</h2>
      <div className="space-y-4">
        {races.map(race => (
          <div key={race.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{race.title}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {race.distance}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(race.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{race.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 capitalize">{race.type}</span>
              <div className="flex items-center text-blue-600">
                <Timer className="w-4 h-4 mr-2" />
                <span className="font-medium">{timeLeft[race.id]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceCountdownWidget; 