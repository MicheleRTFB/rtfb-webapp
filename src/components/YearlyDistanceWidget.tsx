import React, { useState, useEffect } from 'react';
import { Route, Award, Calendar, Target } from 'lucide-react';

const YearlyDistanceWidget = () => {
  // Stato per tracciare se è la prima volta che l'utente apre il widget
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true);
  
  // Configurazione iniziale del widget
  const [distanceData, setDistanceData] = useState({
    goal: 0, // Obiettivo annuale in km
    completed: 0, // Km già percorsi
    lastUpdate: new Date().toISOString().split('T')[0],
    recentActivity: 0 // Ultima corsa in km
  });
  
  // Stati per input nella schermata iniziale
  const [goalInput, setGoalInput] = useState('');
  const [completedInput, setCompletedInput] = useState('');
  
  // Stato per visualizzare l'animazione e l'icona fissa
  const [showCongrats, setShowCongrats] = useState(false);
  const [showFixedAward, setShowFixedAward] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  
  // Stato per la simulazione
  const [simulationValue, setSimulationValue] = useState(0);
  
  // Calcola la percentuale di completamento
  const calculateProgress = () => {
    if (distanceData.goal === 0) return 0;
    return Math.min(100, (distanceData.completed / distanceData.goal) * 100);
  };
  
  const progress = calculateProgress();
  
  // Completa la configurazione iniziale
  const completeSetup = () => {
    if (!goalInput || parseInt(goalInput) <= 0) return;
    
    const goal = parseInt(goalInput);
    const completed = parseInt(completedInput) || 0;
    
    setDistanceData({
      ...distanceData,
      goal: goal,
      completed: completed
    });
    
    setSimulationValue(completed);
    setIsFirstTimeSetup(false);
    
    // Controlla se l'obiettivo è già stato raggiunto
    if (completed >= goal) {
      setGoalReached(true);
      setShowFixedAward(true);
    }
  };
  
  // Aggiorna i km completati e controlla se l'obiettivo è stato raggiunto
  const updateCompletedDistance = (newValue: string) => {
    const numValue = parseInt(newValue, 10) || 0;
    setSimulationValue(numValue);
    
    const updatedData = {
      ...distanceData,
      completed: numValue,
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    
    setDistanceData(updatedData);
    
    // Controlla se abbiamo appena raggiunto l'obiettivo
    if (numValue >= distanceData.goal && !goalReached) {
      setGoalReached(true);
      showCongratsAnimation();
    }
  };
  
  // Mostra l'animazione di congratulazioni e imposta il premio fisso
  const showCongratsAnimation = () => {
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
      setShowFixedAward(true);
    }, 3000);
  };
  
  // Funzione per ottenere una frase motivazionale basata sul progresso
  const getMotivationalPhrase = () => {
    if (distanceData.goal === 0) return "Imposta il tuo obiettivo per iniziare il percorso!";
    
    const percent = (distanceData.completed / distanceData.goal) * 100;
    
    if (percent === 0) {
      return "Inizia il tuo viaggio, ogni passo conta!";
    } else if (percent < 25) {
      return "Ottimo inizio! Mantieni il ritmo per raggiungere il tuo obiettivo annuale.";
    } else if (percent < 50) {
      return "Stai facendo progressi costanti. Continua così!";
    } else if (percent < 75) {
      return "Sei a buon punto! Più della metà dell'obiettivo è stata raggiunta.";
    } else if (percent < 100) {
      return "Ci sei quasi! Puoi vedere il traguardo all'orizzonte.";
    } else {
      return "Complimenti! Hai raggiunto il tuo obiettivo annuale!";
    }
  };
  
  // Calcola quanti chilometri mancano all'obiettivo
  const remainingKm = Math.max(0, distanceData.goal - distanceData.completed);
  
  // Calcola il progresso rispetto all'anno (mesi trascorsi)
  const calculateYearProgress = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    
    const totalDays: number = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed: number = (currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    
    return (daysPassed / totalDays) * 100;
  };
  
  const yearProgress = calculateYearProgress();
  
  // Determina se si è in "ritardo" rispetto all'anno
  const isBehindSchedule = progress < yearProgress && distanceData.goal > 0;
  
  // Calcola la media settimanale necessaria per raggiungere l'obiettivo
  const calculateRequiredWeeklyAverage = () => {
    const currentDate = new Date();
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    
    const daysLeft: number = (endOfYear.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    const weeksLeft = daysLeft / 7;
    
    if (weeksLeft <= 0 || remainingKm <= 0 || distanceData.goal === 0) return 0;
    
    return (remainingKm / weeksLeft).toFixed(1);
  };
  
  // Calcola la media settimanale attuale basata sui km fatti finora
  const calculateCurrentWeeklyAverage = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    
    const daysPassed: number = (currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const weeksPassed = daysPassed / 7;
    
    if (weeksPassed <= 0 || distanceData.completed === 0) return 0;
    
    return (distanceData.completed / weeksPassed).toFixed(1);
  };
  
  // Se è la prima volta, mostra la schermata di setup
  if (isFirstTimeSetup) {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Configura Obiettivo Annuale</h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700 text-center">
            Imposta il tuo obiettivo di chilometraggio per {new Date().getFullYear()}
          </p>
        </div>
        
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-600 mb-1">Obiettivo annuale (km)</label>
          <input
            type="number"
            min="1"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 1000"
          />
        </div>
        
        <div className="flex flex-col mb-5">
          <label className="text-sm text-gray-600 mb-1">Chilometri già percorsi (opzionale)</label>
          <input
            type="number"
            min="0"
            value={completedInput}
            onChange={(e) => setCompletedInput(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 250"
          />
          <p className="text-xs text-gray-500 mt-1">Inserisci solo se hai già percorso chilometri quest'anno</p>
        </div>
        
        <button 
          onClick={completeSetup}
          disabled={!goalInput || parseInt(goalInput) <= 0}
          className={`flex items-center justify-center w-full py-2 rounded-lg ${
            goalInput && parseInt(goalInput) > 0
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Conferma</span>
        </button>
      </div>
    );
  }
  
  // Widget principale dopo la configurazione
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
      {showFixedAward && !showCongrats && (
        <div className="absolute top-0 right-0 m-2">
          <div className="bg-yellow-50 p-2 rounded-full shadow-md">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center w-full">
          <h2 className="text-lg font-bold text-gray-800">Obiettivo Km Annuali</h2>
        </div>
      </div>
      
      {/* Anno corrente */}
      <div className="flex items-center justify-center mb-3">
        <Calendar className="h-4 w-4 text-green-600 mr-1" />
        <p className="text-sm text-gray-600">{new Date().getFullYear()}</p>
      </div>
      
      {/* Chilometri percorsi / obiettivo */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-end">
          <span className="text-5xl font-bold text-gray-800">{distanceData.completed}</span>
          <span className="text-xl text-gray-500 mb-1">/{distanceData.goal} km</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">chilometri percorsi</p>
      </div>
      
      {/* Barra di avanzamento */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso chilometri:</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Marker per il progresso annuale */}
          <div className="w-full h-3 relative mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="h-1 rounded-full bg-blue-400"
                style={{ width: `${yearProgress}%` }}
              ></div>
            </div>
            <div 
              className="absolute top-0 transform -translate-y-1/2" 
              style={{ left: `${yearProgress}%` }}
            >
              <div className="h-3 w-1 bg-blue-500"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Gen</span>
              <span className="text-blue-500">Oggi</span>
              <span>Dic</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistiche aggiuntive */}
      <div className="grid grid-cols-2 gap-2 mb-3 mt-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600">Mancanti</p>
          <p className="text-lg font-bold text-gray-800">{remainingKm} km</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600">Media settimanale</p>
          <p className="text-lg font-bold text-gray-800">{calculateRequiredWeeklyAverage()} km</p>
        </div>
      </div>
      
      {/* Media settimanale attuale */}
      <div className="bg-gray-50 rounded-lg p-2 text-center mb-3">
        <p className="text-xs text-gray-600">Media attuale km/settimana</p>
        <p className="text-lg font-bold text-gray-800">{calculateCurrentWeeklyAverage()} km</p>
      </div>
      
      {/* Frase motivazionale */}
      <div className="mt-2 bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-700 text-center">
          {getMotivationalPhrase()}
        </p>
      </div>
      
      {/* Status message */}
      {isBehindSchedule && progress < 100 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-orange-500">
            Sei {Math.round(yearProgress - progress)}% indietro rispetto al calendario
          </p>
        </div>
      )}
      
      {/* Simulazione */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max={distanceData.goal * 1.5}
            value={simulationValue}
            onChange={(e) => updateCompletedDistance(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{distanceData.goal}</span>
          <span>{distanceData.goal * 1.5}</span>
        </div>
        <div className="text-center mt-2">
          <button
            onClick={() => setIsFirstTimeSetup(true)}
            className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm mr-2"
          >
            Reimposta
          </button>
          <button
            onClick={showCongratsAnimation}
            className="bg-purple-500 text-white px-4 py-1 rounded-lg text-sm"
          >
            Animazione
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearlyDistanceWidget; 