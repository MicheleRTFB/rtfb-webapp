import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Award } from 'lucide-react';

const WeeklyWorkoutWidget = () => {
  // Stato iniziale preimpostato con 3 allenamenti completati su 4
  const [workoutData, setWorkoutData] = useState({
    goal: 4,
    completed: 3,
    currentDay: 5, // Venerdì
    lastWorkout: new Date().toISOString(),
    hasReachedGoal: false // Flag per tenere traccia se l'obiettivo è stato raggiunto almeno una volta
  });
  
  // Stato per l'animazione di congratulazioni
  const [showCongrats, setShowCongrats] = useState(false);
  // Stato per il premio fisso che rimane dopo l'animazione
  const [showFixedPrize, setShowFixedPrize] = useState(false);
  // Stato per tracciare il livello di simulazione
  const [simulationLevel, setSimulationLevel] = useState(3); // Inizia con 3/4

  // Funzione per forzare la visualizzazione dell'animazione
  const forceShowAnimation = () => {
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
      setShowFixedPrize(true);
    }, 3000);
  };

  // Effetto per mostrare l'animazione quando si raggiunge l'obiettivo per la prima volta
  useEffect(() => {
    if (workoutData.completed >= workoutData.goal && !workoutData.hasReachedGoal) {
      setShowCongrats(true);
      setWorkoutData(prev => ({...prev, hasReachedGoal: true}));
      
      const timer = setTimeout(() => {
        setShowCongrats(false);
        setShowFixedPrize(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [workoutData.completed, workoutData.goal, workoutData.hasReachedGoal]);

  // Frasi motivazionali basate sulla percentuale di completamento
  const getMotivationalPhrase = () => {
    const { goal, completed } = workoutData;
    const progress = (completed / goal) * 100;
    
    if (completed === 0) {
      return "Inizia la tua settimana di allenamenti!";
    } else if (completed === 1) {
      return "Il primo passo è fatto! Continua con questo ritmo.";
    } else if (completed === 2) {
      return "Metà strada percorsa! La costanza è la tua forza.";
    } else if (completed === 3) {
      return "Sei sulla strada giusta, il traguardo è vicino!";
    } else {
      return "Fantastico! Hai completato tutti i tuoi allenamenti!";
    }
  };
  
  // Nome del giorno della settimana
  const getDayName = (day: number) => {
    const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    return days[day - 1];
  };
  
  // Cambia il livello di simulazione
  const changeSimulation = (level: number) => {
    let newLevel = level;
    
    // Se abbiamo raggiunto l'obiettivo, manteniamo il flag hasReachedGoal a true
    const wasGoalReached = workoutData.hasReachedGoal || (workoutData.completed >= workoutData.goal);
    
    setSimulationLevel(newLevel);
    setWorkoutData({
      ...workoutData,
      completed: newLevel,
      hasReachedGoal: wasGoalReached || newLevel >= workoutData.goal
    });
  };
  
  // Calcola la percentuale di completamento
  const calculateProgress = () => {
    const { goal, completed } = workoutData;
    return Math.min(100, (completed / goal) * 100);
  };
  
  const progress = calculateProgress();
  
  // Recupera la frase motivazionale appropriata
  const motivationalPhrase = getMotivationalPhrase();
  
  return (
    <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans relative overflow-hidden">
      {/* Animazione di congratulazioni */}
      {showCongrats && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-10 animate-pulse">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center transform animate-bounce">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-green-600 font-bold text-lg">Obiettivo Raggiunto!</p>
            <div className="mt-2">
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Premio fisso che rimane dopo l'animazione */}
      {showFixedPrize && !showCongrats && (
        <div className="absolute top-0 right-0 m-2">
          <div className="bg-yellow-50 p-2 rounded-full shadow-md">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center w-full">
          <h2 className="text-lg font-bold text-gray-800">Allenamenti Settimanali</h2>
        </div>
      </div>
      
      {/* Giorno attuale */}
      <div className="flex items-center justify-center mb-3">
        <Calendar className="h-4 w-4 text-green-600 mr-1" />
        <p className="text-sm text-gray-600">{getDayName(workoutData.currentDay)}</p>
      </div>
      
      {/* Progresso allenamenti */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-end">
          <span className="text-5xl font-bold text-gray-800">{workoutData.completed}</span>
          <span className="text-xl text-gray-500 mb-1">/{workoutData.goal}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">allenamenti completati</p>
      </div>
      
      {/* Barre di avanzamento */}
      <div className="space-y-4">
        {/* Progresso allenamenti */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso allenamenti:</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Frase motivazionale */}
      <div className="mt-4 bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-700 text-center">
          {motivationalPhrase}
        </p>
      </div>
      
      {/* Status icon - permanente una volta raggiunto l'obiettivo */}
      {workoutData.hasReachedGoal && (
        <div className="mt-4 flex items-center justify-center text-green-600">
          <Award className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Obiettivo completato!</span>
        </div>
      )}
      
      {/* Pulsante per mostrare l'animazione */}
      <div className="mt-3 flex justify-center">
        <button 
          onClick={forceShowAnimation}
          className="bg-purple-500 text-white px-4 py-1 rounded-lg text-sm"
        >
          Mostra animazione
        </button>
      </div>
      
      {/* Pulsanti per simulazione */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button 
          onClick={() => {
            changeSimulation(simulationLevel > 0 ? simulationLevel - 1 : 0);
            if (simulationLevel <= 1) {
              setShowFixedPrize(false);
            }
          }}
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
          disabled={simulationLevel === 0}
        >
          <span>Diminuisci</span>
        </button>
        
        <button 
          onClick={() => changeSimulation(simulationLevel < 4 ? simulationLevel + 1 : 4)}
          className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
          disabled={simulationLevel === 4}
        >
          <span>Aumenta</span>
        </button>
      </div>
      
      {/* Selezione rapida stati */}
      <div className="mt-3 grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map(num => (
          <button 
            key={num}
            onClick={() => changeSimulation(num)}
            className={`py-1 rounded ${
              simulationLevel === num 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {num}/4
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkoutWidget; 