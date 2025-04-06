import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarioMensilePreview = () => {
  const daysOfWeek = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  
  const currentDate = new Date();
  
  // Genera i giorni del mese
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    const days = [];
    
    // Giorni del mese precedente
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: prevMonthLastDay - firstDayOfWeek + i + 1,
        currentMonth: false
      });
    }
    
    // Giorni del mese corrente
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        isToday: new Date(year, month, i).toDateString() === new Date().toDateString()
      });
    }
    
    // Giorni del mese successivo
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false
      });
    }
    
    return days;
  };

  const days = generateMonthDays();

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-4">
      {/* Header del calendario */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Mese precedente"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Mese successivo"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Griglia del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {/* Header con i giorni della settimana */}
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
        
        {/* Giorni del calendario */}
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`
              text-center py-1 relative aspect-square flex flex-col items-center justify-center text-sm
              ${day.currentMonth ? 'text-gray-800' : 'text-gray-400'} 
              ${day.isToday ? 'font-bold' : ''}
              cursor-pointer hover:bg-gray-100 hover:rounded-md
            `}
          >
            <div className={day.isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}>
              {day.day}
            </div>
          </div>
        ))}
      </div>
      
      {/* Prossimi appuntamenti */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">Prossimi appuntamenti</h3>
        <div className="space-y-2">
          <div className="flex items-start py-1 border-l-2 border-blue-500 pl-2">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-1 mr-2">
              <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
            </div>
            <div className="text-xs">
              <p className="text-gray-500">Domenica 23 marzo</p>
              <p className="font-medium">Stramiano 21km-10km-5km</p>
            </div>
          </div>
          <div className="flex items-start py-1 border-l-2 border-yellow-500 pl-2">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1 mr-2">
              <span className="block w-2 h-2 bg-yellow-500 rounded-full"></span>
            </div>
            <div className="text-xs">
              <p className="text-gray-500">Lunedì 3 marzo ore 21:00</p>
              <p className="font-medium">Live: la gestione del gel in gara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioMensilePreview; 