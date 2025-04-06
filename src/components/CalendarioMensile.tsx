import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Flag, FileText } from 'lucide-react';

const CalendarioMensile = () => {
  // Database delle gare
  const gareDatabase = [
    { 
      id: "maratona-milano", 
      nome: "Maratona di Milano", 
      distanza: "42.195 km", 
      data: "02/04/2025",
      dataObj: new Date(2025, 3, 2),
      luogo: "Milano",
      sito: "https://www.milanomarathon.it" 
    },
    { 
      id: "maratona-roma", 
      nome: "Maratona di Roma", 
      distanza: "42.195 km", 
      data: "16/03/2025",
      dataObj: new Date(2025, 2, 16),
      luogo: "Roma",
      sito: "https://www.maratonadiroma.it" 
    },
    { 
      id: "mezza-verona", 
      nome: "Mezza Maratona di Verona", 
      distanza: "21.097 km", 
      data: "22/11/2025",
      dataObj: new Date(2025, 10, 22),
      luogo: "Verona",
      sito: "https://www.veronamarathon.it" 
    },
    { 
      id: "trail-monte-bianco", 
      nome: "Trail del Monte Bianco", 
      distanza: "100 km", 
      data: "22/06/2025",
      dataObj: new Date(2025, 5, 22),
      luogo: "Courmayeur",
      sito: "https://www.ultratrailmb.com" 
    }
  ];

  // Stati principali
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([
    { 
      id: 1, 
      date: new Date(2025, 2, 16), 
      type: 'gara', 
      title: 'Maratona di Roma',
      garaInfo: gareDatabase.find(g => g.id === "maratona-roma"),
      nota: "Obiettivo: finire sotto le 4 ore",
      condividiConCoach: true
    },
    { 
      id: 2, 
      date: new Date(2025, 2, 25), 
      type: 'nota', 
      title: 'Allenamento lungo',
      condividiConCoach: false
    }
  ]);
  
  // Stati per il form di aggiunta eventi
  const [newEventType, setNewEventType] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [gareCorrispondenti, setGareCorrispondenti] = useState([]);
  const [dropdownAperto, setDropdownAperto] = useState(false);
  const [garaTrovata, setGaraTrovata] = useState(null);
  const [notaGara, setNotaGara] = useState('');
  const [condividiConCoach, setCondividiConCoach] = useState(false);

  // Utility per il calendario
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
    
    // Primo giorno del mese
    const firstDay = new Date(year, month, 1);
    // Ultimo giorno del mese
    const lastDay = new Date(year, month + 1, 0);
    
    // Giorno della settimana del primo giorno (0 = domenica, 1 = lunedì, ecc.)
    let firstDayOfWeek = firstDay.getDay();
    // Adatta per iniziare da lunedì (0 = lunedì)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    
    // Costruisci la griglia del calendario
    const days = [];
    
    // Aggiungi i giorni del mese precedente
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: prevMonthLastDay - firstDayOfWeek + i + 1,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - firstDayOfWeek + i + 1)
      });
    }
    
    // Aggiungi i giorni del mese corrente
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
        isToday: new Date(year, month, i).toDateString() === new Date().toDateString()
      });
    }
    
    // Calcola quanti giorni aggiungere del mese successivo
    const remainingDays = 42 - days.length; // 6 righe x 7 giorni = 42
    
    // Aggiungi i giorni del mese successivo
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  // Gestione eventi
  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const handleDayClick = (day) => {
    setSelectedDay(day.date);
    setModalOpen(true);
    setNewEventType('');
    setNewEventTitle('');
    setGareCorrispondenti([]);
    setDropdownAperto(false);
    setGaraTrovata(null);
    setNotaGara('');
    setCondividiConCoach(false);
  };
  
  // Gestione ricerca gare
  const handleGaraInput = (e) => {
    const input = e.target.value;
    setNewEventTitle(input);
    
    if (input.trim().length > 1) { // Cerca solo se l'input è di almeno 2 caratteri
      const garaInput = input.trim().toLowerCase();
      
      // Cerca gare che contengono la stringa di input
      const corrispondenze = gareDatabase.filter(gara => 
        gara.nome.toLowerCase().includes(garaInput)
      );
      
      setGareCorrispondenti(corrispondenze);
      setDropdownAperto(corrispondenze.length > 0);
      setGaraTrovata(null);
    } else {
      setGareCorrispondenti([]);
      setDropdownAperto(false);
      setGaraTrovata(null);
    }
  };
  
  // Selezione gara dal dropdown
  const selezionaGara = (gara) => {
    setNewEventTitle(gara.nome);
    setGaraTrovata(gara);
    setGareCorrispondenti([]);
    setDropdownAperto(false);
    
    // Se la gara ha una data specifica, aggiorniamo il giorno selezionato
    if (gara.dataObj) {
      setSelectedDay(gara.dataObj);
    }
  };
  
  const handleAddEvent = () => {
    if (newEventType && newEventTitle.trim()) {
      let newEvent = {
        id: Date.now(),
        date: selectedDay,
        type: newEventType,
        title: newEventTitle.trim(),
      };
      
      if (newEventType === 'nota') {
        newEvent.condividiConCoach = condividiConCoach;
      } else if (newEventType === 'gara' && garaTrovata) {
        newEvent.garaInfo = garaTrovata;
        newEvent.nota = notaGara;
        newEvent.condividiConCoach = condividiConCoach;
        
        // Imposta la data dell'evento alla data della gara se disponibile
        if (garaTrovata.dataObj) {
          newEvent.date = garaTrovata.dataObj;
        }
      }
      
      setEvents([...events, newEvent]);
      setModalOpen(false);
    }
  };
  
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };
  
  const getEventColor = (type) => {
    return type === 'gara' ? 'bg-blue-500' : 'bg-green-500';
  };
  
  const formatDate = (date) => {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Rendering
  const days = getMonthData();
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-4">
      {/* Header del calendario */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth} 
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Mese precedente"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextMonth} 
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
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const hasGara = dayEvents.some(e => e.type === 'gara');
          const hasNota = dayEvents.some(e => e.type === 'nota');
          
          return (
            <div 
              key={index} 
              className={`
                text-center py-1 relative aspect-square flex flex-col items-center justify-center text-sm
                ${day.currentMonth ? 'text-gray-800' : 'text-gray-400'} 
                ${day.isToday ? 'font-bold' : ''}
                cursor-pointer hover:bg-gray-100 hover:rounded-md
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className={`
                ${hasGara && hasNota ? 'bg-gradient-to-r from-blue-500 to-green-500' : 
                  hasGara ? 'bg-blue-500' : 
                  hasNota ? 'bg-green-500' : ''}
                ${(hasGara || hasNota) ? 'text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
              `}>
                {day.day}
              </div>
              
              {dayEvents.length > 0 && dayEvents.length <= 2 && (
                <div className="flex mt-1 space-x-1">
                  {dayEvents.slice(0, 2).map((event, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full ${getEventColor(event.type)}`}></div>
                  ))}
                </div>
              )}
              
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500 mt-1">+{dayEvents.length}</div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Prossimi appuntamenti */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">Prossimi appuntamenti RTFB</h3>
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
      
      {/* Modal per aggiungere/visualizzare eventi */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedDay ? formatDate(selectedDay) : ''}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Eventi esistenti */}
            {selectedDay && getEventsForDate(selectedDay).length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Eventi programmati:</h4>
                <div className="space-y-2">
                  {getEventsForDate(selectedDay).map(event => (
                    <div key={event.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center flex-grow">
                        <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)} mr-2 shrink-0`}></div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate">{event.title}</span>
                          
                          {event.condividiConCoach && (
                            <span className="text-xs text-blue-600">Condiviso con coach</span>
                          )}
                          
                          {event.type === 'gara' && event.garaInfo && (
                            <div className="text-xs text-gray-600">
                              <div>Distanza: {event.garaInfo.distanza}</div>
                              <div>Data: {event.garaInfo.data}</div>
                              {event.nota && <div className="italic">{event.nota}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-gray-500 hover:text-red-500 shrink-0 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Form per aggiungere eventi */}
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setNewEventType('gara')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded ${
                    newEventType === 'gara' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Flag size={16} />
                  <span>Gara</span>
                </button>
                
                <button
                  onClick={() => setNewEventType('nota')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded ${
                    newEventType === 'nota' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText size={16} />
                  <span>Nota</span>
                </button>
              </div>
              
              {newEventType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newEventType === 'gara' ? 'Nome della gara' : 'Titolo della nota'}
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={newEventType === 'gara' ? handleGaraInput : (e) => setNewEventTitle(e.target.value)}
                      onFocus={() => newEventType === 'gara' && newEventTitle.trim().length > 1 && setDropdownAperto(gareCorrispondenti.length > 0)}
                      onBlur={() => setTimeout(() => setDropdownAperto(false), 200)}
                      placeholder={newEventType === 'gara' ? 'Inizia a digitare il nome della gara...' : 'es. Allenamento lungo'}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${dropdownAperto ? 'rounded-b-none' : ''}`}
                    />
                    
                    {/* Dropdown ricerca gare */}
                    {newEventType === 'gara' && dropdownAperto && (
                      <div className="absolute z-10 w-full bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg max-h-48 overflow-y-auto">
                        {gareCorrispondenti.map((gara) => (
                          <div 
                            key={gara.id}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer truncate"
                            onClick={() => selezionaGara(gara)}
                          >
                            {gara.nome}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Dettagli gara selezionata */}
                  {newEventType === 'gara' && garaTrovata && (
                    <div className="bg-blue-50 p-3 rounded-md mt-2 border border-blue-200">
                      <div className="mb-2">
                        <h4 className="font-medium text-blue-700">{garaTrovata.nome}</h4>
                        <div className="text-xs bg-blue-100 px-2 py-1 rounded inline-block text-blue-700 mt-1">
                          Data: {garaTrovata.data}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Distanza:</span> {garaTrovata.distanza}
                        </div>
                        <div>
                          <span className="font-medium">Luogo:</span> {garaTrovata.luogo}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Sito:</span>{' '}
                          <a 
                            href={garaTrovata.sito} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {garaTrovata.sito}
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-3 border-t border-blue-200 pt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Note personali sulla gara
                        </label>
                        <textarea
                          value={notaGara}
                          onChange={(e) => setNotaGara(e.target.value)}
                          placeholder="Aggiungi note personali sulla gara..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Opzione per condividere con il coach */}
                  <div className="mt-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={condividiConCoach}
                        onChange={() => setCondividiConCoach(!condividiConCoach)}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">Condividi con il coach</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </button>
              
              <button
                onClick={handleAddEvent}
                disabled={!newEventType || !newEventTitle.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  newEventType && newEventTitle.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Aggiungi evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioMensile; 