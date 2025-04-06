import React, { useState } from 'react';
import { Scale, Check, Plus, AlertCircle, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightData {
  initial: number | null;
  current: number | null;
  target: number | null;
  history: WeightHistoryEntry[];
  lastChange: number | null;
}

interface WeightHistoryEntry {
  date: string;
  weight: number;
  day: number;
}

const WeightTrackerWidget = () => {
  // Stati per tenere traccia dello step e dei dati dell'utente
  const [step, setStep] = useState('empty'); // 'empty', 'input', 'display', 'update', 'history'
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [weightData, setWeightData] = useState<WeightData>({
    initial: null,
    current: null,
    target: null,
    history: [],
    lastChange: null
  });
  const [daysElapsed, setDaysElapsed] = useState(0);

  // Gestisce il click per iniziare l'inserimento dei dati
  const handleStartInput = () => {
    setStep('input');
  };

  // Gestisce la conferma dei dati inseriti inizialmente
  const handleConfirmData = () => {
    if (currentWeight && targetWeight) {
      const current = parseFloat(currentWeight);
      const target = parseFloat(targetWeight);
      const today = new Date();
      
      setWeightData({
        initial: current,
        current: current,
        target: target,
        history: [{
          date: today.toISOString().split('T')[0],
          weight: current,
          day: 0
        }],
        lastChange: 0 // Prima pesata, nessuna variazione
      });
      
      setStep('display');
    }
  };

  // Simula il passaggio di 7 giorni e richiede aggiornamento
  const simulateWeekLater = () => {
    setDaysElapsed(7);
    setStep('update');
  };

  // Gestisce la conferma del nuovo peso
  const handleConfirmNewWeight = () => {
    if (newWeight && weightData.current !== null) {
      const updated = parseFloat(newWeight);
      const previousWeight = weightData.current;
      const today = new Date();
      // Simula una data 7 giorni nel futuro
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + 7);
      
      const updatedHistory = [
        ...weightData.history,
        {
          date: nextDate.toISOString().split('T')[0],
          weight: updated,
          day: 7
        }
      ];
      
      setWeightData({
        ...weightData,
        current: updated,
        history: updatedHistory,
        lastChange: updated - previousWeight
      });
      
      setStep('history');
    }
  };

  // Calcola la progressione verso l'obiettivo
  const calculateProgress = () => {
    if (!weightData.initial || !weightData.current || !weightData.target) return 0;
    
    const startWeight = weightData.initial;
    const currentWeight = weightData.current;
    const targetWeight = weightData.target;
    
    if (startWeight === targetWeight) return 100; // Già all'obiettivo
    
    // Se l'obiettivo è perdere peso
    if (startWeight > targetWeight) {
      const totalToLose = startWeight - targetWeight;
      const lostSoFar = startWeight - currentWeight;
      return Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
    } 
    // Se l'obiettivo è aumentare peso
    else {
      const totalToGain = targetWeight - startWeight;
      const gainedSoFar = currentWeight - startWeight;
      return Math.min(100, Math.max(0, (gainedSoFar / totalToGain) * 100));
    }
  };
  
  const progress = calculateProgress();
  
  // Calcola quanto manca all'obiettivo
  const remainingToGoal = weightData.current && weightData.target 
    ? Math.abs(weightData.current - weightData.target).toFixed(1) 
    : 0;
  
  // Calcola colore dell'indicatore basato sul progresso
  const getProgressColor = () => {
    if (progress > 75) return "#4CAF50"; // Verde: buon progresso
    if (progress > 25) return "#FFC107"; // Giallo: progresso medio
    return "#FF5722"; // Rosso: poco progresso
  };

  // Ricomincia la simulazione
  const restartDemo = () => {
    setCurrentWeight('');
    setTargetWeight('');
    setNewWeight('');
    setWeightData({
      initial: null,
      current: null,
      target: null,
      history: [],
      lastChange: null
    });
    setDaysElapsed(0);
    setStep('empty');
  };

  // Widget vuoto (primo accesso)
  if (step === 'empty') {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Peso Attuale</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center h-40">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <Scale className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Aggiungi il tuo peso attuale per iniziare a monitorare i tuoi progressi
          </p>
          <button 
            onClick={handleStartInput}
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Aggiungi peso</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Form di input per peso attuale e obiettivo
  if (step === 'input') {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Inserisci i dati</h2>
        </div>
        
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-600 mb-1">Peso attuale (kg)</label>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 75.5"
            step="0.1"
          />
        </div>
        
        <div className="flex flex-col mb-5">
          <label className="text-sm text-gray-600 mb-1">Peso obiettivo (kg)</label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 70.0"
            step="0.1"
          />
        </div>
        
        <button 
          onClick={handleConfirmData}
          disabled={!currentWeight || !targetWeight}
          className={`flex items-center justify-center w-full py-2 rounded-lg ${
            currentWeight && targetWeight 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check className="h-4 w-4 mr-1" />
          <span>Conferma</span>
        </button>
      </div>
    );
  }
  
  // Visualizzazione del peso (dopo l'inserimento dei dati)
  if (step === 'display' && weightData.current !== null && weightData.target !== null) {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">Peso Attuale</h2>
          </div>
        </div>
        
        {/* Peso attuale */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center mb-1">
            <Scale className="h-5 w-5 text-green-600 mr-2" />
          </div>
          <h2 className="text-5xl font-bold text-gray-800">
            {weightData.current.toFixed(1)} kg
          </h2>
          <div className="flex flex-col items-center justify-center mt-2">
            <div className="flex items-center text-gray-500">
              <span className="text-sm">
                Prima pesata
              </span>
            </div>
            
            <div className="flex items-center mt-1 text-gray-600">
              <span className="text-xs">
                Nessuna variazione dall'inizio
              </span>
            </div>
          </div>
        </div>
        
        {/* Barra di avanzamento verso l'obiettivo */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso verso {weightData.target.toFixed(1)} kg:</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor()
              }}
            ></div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs font-medium text-gray-600">
              {remainingToGoal} kg {weightData.current > weightData.target ? 'da perdere' : weightData.current < weightData.target ? 'da aumentare' : 'obiettivo raggiunto!'}
            </span>
          </div>
        </div>
        
        {/* Pulsante per simulare passaggio di 7 giorni */}
        <div className="mt-4 flex justify-center">
          <button 
            onClick={simulateWeekLater}
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <span>Simula 7 giorni dopo</span>
          </button>
        </div>
        
        {/* Pulsante per ricominciare */}
        <div className="mt-2 flex justify-center">
          <button 
            onClick={restartDemo}
            className="text-sm text-gray-500 hover:text-green-600 flex items-center"
          >
            Ricomincia dimostrazione
          </button>
        </div>
      </div>
    );
  }
  
  // Richiesta di aggiornamento del peso (7 giorni dopo)
  if (step === 'update' && weightData.current !== null) {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Aggiorna peso</h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Sono passati 7 giorni dalla tua ultima pesata. Aggiorna il tuo peso attuale per continuare a monitorare i tuoi progressi.
          </p>
        </div>
        
        <div className="flex flex-col mb-5">
          <label className="text-sm text-gray-600 mb-1">Nuovo peso (kg)</label>
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`Es. ${(weightData.current - 0.7).toFixed(1)}`} // Suggerisce un leggero calo come esempio
            step="0.1"
          />
          <p className="text-xs text-gray-500 mt-1">Ultimo peso registrato: {weightData.current.toFixed(1)} kg</p>
        </div>
        
        <button 
          onClick={handleConfirmNewWeight}
          disabled={!newWeight}
          className={`flex items-center justify-center w-full py-2 rounded-lg ${
            newWeight 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check className="h-4 w-4 mr-1" />
          <span>Conferma</span>
        </button>
        
        {/* Pulsante per ricominciare */}
        <div className="mt-3 flex justify-center">
          <button 
            onClick={restartDemo}
            className="text-sm text-gray-500 hover:text-green-600 flex items-center"
          >
            Ricomincia dimostrazione
          </button>
        </div>
      </div>
    );
  }
  
  // Visualizzazione storico con grafico (dopo il secondo inserimento)
  if (step === 'history' && weightData.current !== null && weightData.target !== null && weightData.initial !== null && weightData.lastChange !== null) {
    // Formatta i dati per il grafico
    const chartData = weightData.history.map(entry => ({
      giorno: entry.day,
      peso: entry.weight
    }));
    
    // Calcola se c'è stato un miglioramento
    const isImprovement = weightData.target < weightData.initial 
      ? weightData.lastChange < 0  // Per perdere peso, il cambiamento deve essere negativo
      : weightData.lastChange > 0; // Per aumentare peso, il cambiamento deve essere positivo
    
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">Peso Attuale</h2>
          </div>
        </div>
        
        {/* Peso attuale */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center mb-1">
            <Scale className="h-5 w-5 text-green-600 mr-2" />
          </div>
          <h2 className="text-5xl font-bold text-gray-800">
            {weightData.current.toFixed(1)} kg
          </h2>
          
          {/* Variazione */}
          <div className="flex flex-col items-center justify-center mt-2">
            <div 
              className={`flex items-center ${
                weightData.lastChange === 0 
                  ? 'text-gray-500' 
                  : isImprovement 
                    ? 'text-green-500' 
                    : 'text-red-500'
              }`}
            >
              {weightData.lastChange !== 0 && (
                <TrendingDown 
                  className={`h-4 w-4 mr-1 ${weightData.lastChange > 0 ? 'transform rotate-180' : ''}`} 
                />
              )}
              <span className="text-sm">
                {Math.abs(weightData.lastChange).toFixed(1)} kg {weightData.lastChange < 0 ? 'persi' : 'aumentati'} dall'ultima misurazione
              </span>
            </div>
            
            {/* Variazione totale */}
            <div className="flex items-center mt-1 text-gray-600">
              <span className="text-xs">
                {weightData.current < weightData.initial 
                  ? `${(weightData.initial - weightData.current).toFixed(1)} kg persi dall'inizio` 
                  : weightData.current > weightData.initial
                    ? `${(weightData.current - weightData.initial).toFixed(1)} kg aumentati dall'inizio`
                    : "Nessuna variazione dall'inizio"
                }
              </span>
            </div>
          </div>
        </div>
        
        {/* Barra di avanzamento verso l'obiettivo */}
        <div className="bg-gray-50 rounded-lg p-3 mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso verso {weightData.target.toFixed(1)} kg:</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor()
              }}
            ></div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs font-medium text-gray-600">
              {remainingToGoal} kg {weightData.current > weightData.target ? 'da perdere' : weightData.current < weightData.target ? 'da aumentare' : 'obiettivo raggiunto!'}
            </span>
          </div>
        </div>
        
        {/* Pulsante per ricominciare */}
        <div className="mt-3 flex justify-center">
          <button 
            onClick={restartDemo}
            className="text-sm text-gray-500 hover:text-green-600 flex items-center"
          >
            Ricomincia dimostrazione
          </button>
        </div>
      </div>
    );
  }
};

export default WeightTrackerWidget; 