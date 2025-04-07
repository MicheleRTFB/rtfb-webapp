import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarWidget = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Database delle gare (versione ridotta)
  const gareDatabase = [
    { 
      id: "maratona-milano", 
      nome: "Maratona di Milano", 
      data: "02/04/2025",
      dataObj: new Date(2025, 3, 2),
    },
    { 
      id: "maratona-roma", 
      nome: "Maratona di Roma", 
      data: "16/03/2025",
      dataObj: new Date(2025, 2, 16),
    }
  ];

  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const daysOfWeek = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  // Navigazione mesi
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generazione giorni del mese
  const getMonthData = () => {
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
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - firstDayOfWeek + i + 1)
      });
    }
    
    // Giorni del mese corrente
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
        isToday: new Date(year, month, i).toDateString() === new Date().toDateString(),
        hasEvent: gareDatabase.some(gara => {
          const garaDate = gara.dataObj;
          return garaDate.getDate() === i && 
                 garaDate.getMonth() === month && 
                 garaDate.getFullYear() === year;
        })
      });
    }
    
    // Giorni del mese successivo
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const days = getMonthData();

  return (
    <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <h2 className="text-lg font-bold text-gray-800">Calendario</h2>
        </div>
      </div>

      {/* Mese e controlli */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Griglia del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {/* Giorni della settimana */}
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
        
        {/* Giorni del mese */}
        {days.map((day, index) => (
          <div 
            key={index}
            className={`
              text-center py-1 relative aspect-square flex flex-col items-center justify-center text-xs
              ${day.currentMonth ? 'text-gray-800' : 'text-gray-400'}
              ${day.isToday ? 'font-bold' : ''}
              cursor-pointer hover:bg-gray-100 hover:rounded-md
            `}
          >
            <div 
              className={`
                flex items-center justify-center w-6 h-6
                ${day.isToday ? 'bg-blue-500 text-white rounded-full' : ''}
                ${day.hasEvent ? 'bg-green-500 text-white rounded-full' : ''}
              `}
            >
              {day.day}
            </div>
          </div>
        ))}
      </div>

      {/* Prossimi eventi */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Prossimi eventi</h3>
          <button 
            onClick={() => navigate('/calendar')}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Vedi tutti
          </button>
        </div>
        <div className="space-y-2">
          {gareDatabase.slice(0, 2).map(gara => (
            <div key={gara.id} className="flex items-start py-1 border-l-2 border-green-500 pl-2">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-2">
                <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-xs">
                <p className="text-gray-500">{gara.data}</p>
                <p className="font-medium">{gara.nome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget; 