import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScheduleItem {
  day: string;
  date: string;
  activity: string;
  status: "rest" | "workout";
  intensity?: "easy" | "medium" | "hard";
  completed?: boolean;
}

interface WeeklyScheduleProps {
  onWorkoutSelect?: (workout: {
    title: string;
    type: "rest" | "base" | "fartlek" | "long";
    date: string;
    completed: boolean;
  }) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ onWorkoutSelect }) => {
  const navigate = useNavigate();
  // Stato iniziale basato sull'immagine fornita
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { day: "Lunedì", date: "31 Marzo", activity: "Riposo", status: "rest", completed: true },
    { day: "Martedì", date: "01 Aprile", activity: "Corsa Di Base", status: "workout", intensity: "easy", completed: true },
    { day: "Mercoledì", date: "02 Aprile", activity: "Riposo", status: "rest", completed: true },
    { day: "Giovedì", date: "03 Aprile", activity: "Fartlek", status: "workout", intensity: "medium", completed: false },
    { day: "Venerdì", date: "04 Aprile", activity: "Riposo", status: "rest", completed: true },
    { day: "Sabato", date: "05 Aprile", activity: "Lungo 30 km", status: "workout", intensity: "hard", completed: false },
    { day: "Domenica", date: "06 Aprile", activity: "Corsa Di Base", status: "workout", intensity: "easy", completed: false }
  ]);

  // Indice del giorno che stiamo trascinando
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingMove, setPendingMove] = useState<{dropIndex: number} | null>(null);
  
  // Gestisce l'inizio del drag
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const isIntensiveWorkout = (intensity?: string) => {
    return intensity === "medium" || intensity === "hard";
  };

  const checkConsecutiveIntensiveWorkouts = (dropIndex: number) => {
    if (draggedIndex === null) return false;
    const newSchedule = [...schedule];
    const draggedWorkout = newSchedule[draggedIndex];

    // Se l'allenamento trascinato non è intensivo, non serve controllare
    if (!isIntensiveWorkout(draggedWorkout.intensity)) return false;

    // Controlla il giorno precedente
    if (dropIndex > 0) {
      const prevWorkout = schedule[dropIndex - 1];
      if (isIntensiveWorkout(prevWorkout.intensity)) return true;
    }

    // Controlla il giorno successivo
    if (dropIndex < schedule.length - 1) {
      const nextWorkout = schedule[dropIndex + 1];
      if (isIntensiveWorkout(nextWorkout.intensity)) return true;
    }

    return false;
  };
  
  // Funzione per gestire l'operazione di drop
  const handleDrop = (dropIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      if (checkConsecutiveIntensiveWorkouts(dropIndex)) {
        setShowWarning(true);
        setPendingMove({ dropIndex });
        return;
      }
      
      executeMove(dropIndex);
    }
    setDraggedIndex(null);
  };

  const executeMove = (dropIndex: number) => {
    if (draggedIndex === null) return;
    
    const newSchedule = [...schedule];
    const draggedActivity = newSchedule[draggedIndex].activity;
    const draggedStatus = newSchedule[draggedIndex].status;
    const draggedIntensity = newSchedule[draggedIndex].intensity;
    
    const dropActivity = newSchedule[dropIndex].activity;
    const dropStatus = newSchedule[dropIndex].status;
    const dropIntensity = newSchedule[dropIndex].intensity;
    
    newSchedule[draggedIndex].activity = dropActivity;
    newSchedule[draggedIndex].status = dropStatus;
    newSchedule[draggedIndex].intensity = dropIntensity;
    
    newSchedule[dropIndex].activity = draggedActivity;
    newSchedule[dropIndex].status = draggedStatus;
    newSchedule[dropIndex].intensity = draggedIntensity;
    
    setSchedule(newSchedule);
    setShowWarning(false);
    setPendingMove(null);
    setDraggedIndex(null);
  };

  const handleConfirmMove = () => {
    if (pendingMove) {
      executeMove(pendingMove.dropIndex);
    }
  };

  const handleCancelMove = () => {
    setShowWarning(false);
    setPendingMove(null);
    setDraggedIndex(null);
  };
  
  // Gestisce l'evento dragOver
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWorkoutClick = (item: ScheduleItem) => {
    if (onWorkoutSelect) {
      onWorkoutSelect({
        title: item.activity,
        type: item.status === "rest" ? "rest" : 
              item.intensity === "easy" ? "base" :
              item.intensity === "medium" ? "fartlek" : "long",
        date: `${item.day}, ${item.date}`,
        completed: item.completed || false
      });
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Programma Settimanale</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Trascina e rilascia per modificare gli allenamenti</p>
      </div>
      
      <div className="p-4 sm:p-5">
        {schedule.map((item, index) => (
          <div 
            key={index}
            className={`flex flex-wrap sm:flex-nowrap items-center py-3 sm:py-4 border-b border-gray-100 cursor-move ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <div className="w-full sm:w-32 font-medium text-gray-800 mb-2 sm:mb-0">
              <div className="flex sm:block items-center justify-between">
                <div>{item.day}</div>
                <div className="text-xs sm:text-sm text-gray-500">{item.date}</div>
              </div>
            </div>
            
            <div className="flex-1">
              {item.status === "rest" ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">{item.activity}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 ${
                    item.completed 
                      ? "bg-teal-100" 
                      : item.intensity === "easy" 
                        ? "bg-green-100" 
                        : item.intensity === "medium" 
                          ? "bg-yellow-100" 
                          : "bg-red-100"
                  }`}>
                    {item.completed ? (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                        item.intensity === "easy" 
                          ? "bg-green-500" 
                          : item.intensity === "medium" 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      }`}></div>
                    )}
                  </div>
                  <span className="text-sm sm:text-base text-gray-800">{item.activity}</span>
                </div>
              )}
            </div>
            
            <div className="ml-auto">
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={() => navigate('/workout', {
                  state: {
                    workout: {
                      title: item.activity,
                      type: item.status === "rest" ? "rest" : 
                            item.intensity === "easy" ? "base" :
                            item.intensity === "medium" ? "fartlek" : "long",
                      date: `${item.day}, ${item.date}`,
                      completed: item.completed || false,
                      duration: "50m",
                      stress: 48,
                      maxZ: "Z2",
                      rpe: 3,
                      structure: [
                        {
                          phase: "Warm-up",
                          duration: "5m",
                          intensity: "72-81% LTHR (115-130bpm)",
                          zone: "Z1"
                        },
                        {
                          phase: "Active",
                          duration: "45m",
                          intensity: "81-89% LTHR (130-143bpm)",
                          zone: "Z2"
                        },
                        {
                          phase: "Recupero",
                          duration: "10m",
                          intensity: "Z1 HR (104-131bpm)",
                          zone: "Z1"
                        }
                      ]
                    }
                  }
                })}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center sm:justify-between gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Facile</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Medio</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Duro</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">Riposo</span>
          </div>
        </div>
      </div>

      {/* Dialog di avviso per allenamenti intensivi consecutivi */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-red-600 mb-4">Attenzione!</h3>
            <p className="text-gray-700 mb-6">
              Stai cercando di posizionare due allenamenti intensivi in giorni consecutivi. 
              Questo potrebbe aumentare il rischio di infortuni e compromettere il recupero.
              Vuoi procedere comunque?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelMove}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Procedi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule; 