import React, { useState } from 'react';
import { Search, Calendar, MapPin, Star, Edit, Trash2, Plus, Filter, X, Users } from 'lucide-react';

// Interfacce per i tipi di dati
interface RaceParticipant {
  id: number;
  name: string;
  avatar: string;
}

interface Race {
  id: number;
  title: string;
  location: string;
  date: string;
  distance: string;
  type: string;
  elevation: string;
  category: string;
  personalBest: string;
  time: string;
  pace: string;
  review: string;
  rating: number;
  favorite: boolean;
  participants: RaceParticipant[];
}

const PersonalRaceDatabase: React.FC = () => {
  // Database delle gare personali
  const initialRaces: Race[] = [
    {
      id: 1,
      title: "La Gaz'Run",
      location: "Gazeran - FR",
      date: "30/03/2024",
      distance: "12km",
      type: "trail",
      elevation: "250m",
      category: "B",
      personalBest: "1:02:15",
      time: "1:05:30",
      pace: "5:27 /km",
      review: "Bellissima gara trail con un percorso vario e panoramico. Organizzazione eccellente e ottimo ristoro finale.",
      rating: 4,
      favorite: true,
      participants: [
        {id: 1, name: "Marco B.", avatar: "/api/placeholder/32/32"},
        {id: 2, name: "Giulia T.", avatar: "/api/placeholder/32/32"}
      ]
    },
    {
      id: 2,
      title: "20° Trofeo del Diamante",
      location: "Bolzaneto - Genova (Ge) - IT",
      date: "04/04/2024",
      distance: "10km",
      type: "strada",
      elevation: "100m",
      category: "B",
      personalBest: "42:15",
      time: "42:15",
      pace: "4:13 /km",
      review: "Percorso impegnativo ma ben organizzato. Ottima occasione per battere il mio PB sui 10km.",
      rating: 5,
      favorite: true,
      participants: [
        {id: 3, name: "Alessandro M.", avatar: "/api/placeholder/32/32"},
        {id: 4, name: "Chiara F.", avatar: "/api/placeholder/32/32"},
        {id: 5, name: "Giovanni R.", avatar: "/api/placeholder/32/32"}
      ]
    },
    {
      id: 3,
      title: "Camminata Urbana Coop Alleanza 3.0",
      location: "Sassuolo (Mo) - IT",
      date: "05/04/2024",
      distance: "5km",
      type: "camminata",
      elevation: "50m",
      category: "C",
      personalBest: "28:45",
      time: "30:15",
      pace: "6:03 /km",
      review: "Gara rilassante e divertente, perfetta per un allenamento leggero. Molti partecipanti e atmosfera festosa.",
      rating: 3,
      favorite: false,
      participants: []
    },
    {
      id: 4,
      title: "Terme parkrun",
      location: "Montecatini Terme (Pt) - IT",
      date: "05/04/2024",
      distance: "5km",
      type: "parkrun",
      elevation: "0m",
      category: "C",
      personalBest: "22:30",
      time: "23:45",
      pace: "4:45 /km",
      review: "Ottimo parkrun in un parco bellissimo. Percorso piatto e veloce, ideale per allenamenti di velocità.",
      rating: 4,
      favorite: true,
      participants: [
        {id: 6, name: "Laura B.", avatar: "/api/placeholder/32/32"}
      ]
    },
    {
      id: 5,
      title: "5° Run4Hope",
      location: "Roma (Rm) - IT",
      date: "05/04/2024",
      distance: "10km",
      type: "beneficenza",
      elevation: "100m",
      category: "B",
      personalBest: "45:20",
      time: "46:10",
      pace: "4:37 /km",
      review: "Gara con un nobile scopo. Percorso interessante attraverso il centro di Roma. Organizzazione discreta.",
      rating: 3,
      favorite: false,
      participants: [
        {id: 7, name: "Paolo V.", avatar: "/api/placeholder/32/32"},
        {id: 8, name: "Sofia M.", avatar: "/api/placeholder/32/32"}
      ]
    }
  ];

  // Stato per le gare e ricerca
  const [races, setRaces] = useState<Race[]>(initialRaces);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRaces, setFilteredRaces] = useState<Race[]>(initialRaces);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    type: "",
    distanceMin: "",
    distanceMax: "",
    period: "", // "last-month", "last-3-months", "last-year", "all"
    location: ""
  });
  const [newRace, setNewRace] = useState<Race>({
    id: 0,
    title: "",
    location: "",
    date: "",
    distance: "",
    type: "",
    elevation: "0m",
    category: "B",
    personalBest: "",
    time: "",
    pace: "",
    review: "",
    rating: 0,
    favorite: false,
    participants: []
  });
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  
  // Funzione per gestire la ricerca con filtri
  const applyFilters = () => {
    let filtered = races;
    
    // Applica filtro di ricerca testuale
    if (searchTerm) {
      filtered = filtered.filter(race => 
        race.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Applica filtro preferiti
    if (showOnlyFavorites) {
      filtered = filtered.filter(race => race.favorite);
    }
    
    // Applica filtro per tipo
    if (filters.type) {
      filtered = filtered.filter(race => race.type.toLowerCase() === filters.type.toLowerCase());
    }
    
    // Applica filtro per distanza minima
    if (filters.distanceMin) {
      filtered = filtered.filter(race => {
        const distanceNum = parseFloat(race.distance.replace(/[^0-9.]/g, ''));
        return distanceNum >= parseFloat(filters.distanceMin);
      });
    }
    
    // Applica filtro per distanza massima
    if (filters.distanceMax) {
      filtered = filtered.filter(race => {
        const distanceNum = parseFloat(race.distance.replace(/[^0-9.]/g, ''));
        return distanceNum <= parseFloat(filters.distanceMax);
      });
    }
    
    // Applica filtro per periodo
    if (filters.period) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(race => {
        const [day, month, year] = race.date.split('/');
        const raceDate = new Date(`${year}-${month}-${day}`);
        
        switch(filters.period) {
          case "last-month": {
            const lastMonth = new Date(today);
            lastMonth.setMonth(today.getMonth() - 1);
            return raceDate >= lastMonth && raceDate <= today;
          }
          case "last-3-months": {
            const last3Months = new Date(today);
            last3Months.setMonth(today.getMonth() - 3);
            return raceDate >= last3Months && raceDate <= today;
          }
          case "last-year": {
            const lastYear = new Date(today);
            lastYear.setFullYear(today.getFullYear() - 1);
            return raceDate >= lastYear && raceDate <= today;
          }
          case "all":
            return true;
          default:
            return true;
        }
      });
    }
    
    // Applica filtro per luogo
    if (filters.location) {
      filtered = filtered.filter(race => 
        race.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    setFilteredRaces(filtered);
  };
  
  // Funzione per gestire la ricerca di base
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters();
  };
  
  // Funzione per gestire il toggle dei preferiti
  const handleFavoriteToggle = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
    setTimeout(applyFilters, 0);
  };
  
  // Funzione per resettare i filtri
  const resetFilters = () => {
    setFilters({
      type: "",
      distanceMin: "",
      distanceMax: "",
      period: "",
      location: ""
    });
    setTimeout(applyFilters, 0);
  };
  
  // Funzione per gestire i cambiamenti nei filtri
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Applica i filtri quando vengono modificati
  React.useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, showOnlyFavorites, races]);
  
  // Funzione per aggiungere una gara ai preferiti
  const toggleFavorite = (id: number) => {
    const updatedRaces = races.map(race => 
      race.id === id ? {...race, favorite: !race.favorite} : race
    );
    
    setRaces(updatedRaces);
    setFilteredRaces(
      showOnlyFavorites 
        ? updatedRaces.filter(race => race.favorite)
        : updatedRaces.filter(race => 
            race.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            race.location.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  };
  
  // Formatta una data per la visualizzazione
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return new Intl.DateTimeFormat('it-IT', options).format(date);
  };
  
  // Calcola lo stato della gara in base alla data
  const getRaceStatus = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const raceDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    
    // Imposta le ore a 0 per confrontare solo le date
    today.setHours(0, 0, 0, 0);
    
    const diffTime = raceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "completata";
    if (diffDays === 0) return "oggi";
    if (diffDays <= 30) return "prossima";
    return "futura";
  };
  
  // Funzione per ottenere il colore in base allo stato della gara
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completata": return "bg-gray-200 text-gray-700";
      case "oggi": return "bg-green-500 text-white";
      case "prossima": return "bg-blue-500 text-white";
      case "futura": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };
  
  // Gestione del form di aggiunta
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRace(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Funzione per aggiungere una nuova gara
  const handleAddRace = () => {
    // Validazione minima
    if (!newRace.title || !newRace.location || !newRace.date || !newRace.type || !newRace.distance) {
      alert("Per favore compila tutti i campi obbligatori");
      return;
    }
    
    const newRaceWithId = {
      ...newRace,
      id: races.length > 0 ? Math.max(...races.map(race => race.id)) + 1 : 1,
    };
    
    const updatedRaces = [...races, newRaceWithId];
    setRaces(updatedRaces);
    setFilteredRaces(showOnlyFavorites ? updatedRaces.filter(race => race.favorite) : updatedRaces);
    
    // Reset del form
    setNewRace({
      id: 0,
      title: "",
      location: "",
      date: "",
      distance: "",
      type: "",
      elevation: "0m",
      category: "B",
      personalBest: "",
      time: "",
      pace: "",
      review: "",
      rating: 0,
      favorite: false,
      participants: []
    });
    
    setShowAddForm(false);
  };
  
  // Funzione per eliminare una gara
  const handleDeleteRace = (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questa gara?")) {
      const updatedRaces = races.filter(race => race.id !== id);
      setRaces(updatedRaces);
      setFilteredRaces(showOnlyFavorites ? updatedRaces.filter(race => race.favorite) : updatedRaces);
    }
  };
  
  // Funzione per iniziare la modifica di una gara
  const handleEditRace = (race: Race) => {
    setEditingRace(race);
    setNewRace(race);
    setShowAddForm(true);
  };
  
  // Funzione per salvare le modifiche a una gara
  const handleSaveEdit = () => {
    if (!newRace.title || !newRace.location || !newRace.date || !newRace.type || !newRace.distance) {
      alert("Per favore compila tutti i campi obbligatori");
      return;
    }
    
    const updatedRaces = races.map(race => 
      race.id === newRace.id ? newRace : race
    );
    
    setRaces(updatedRaces);
    setFilteredRaces(showOnlyFavorites ? updatedRaces.filter(race => race.favorite) : updatedRaces);
    
    // Reset del form
    setNewRace({
      id: 0,
      title: "",
      location: "",
      date: "",
      distance: "",
      type: "",
      elevation: "0m",
      category: "B",
      personalBest: "",
      time: "",
      pace: "",
      review: "",
      rating: 0,
      favorite: false,
      participants: []
    });
    
    setEditingRace(null);
    setShowAddForm(false);
  };
  
  // Funzione per annullare la modifica
  const handleCancelEdit = () => {
    setNewRace({
      id: 0,
      title: "",
      location: "",
      date: "",
      distance: "",
      type: "",
      elevation: "0m",
      category: "B",
      personalBest: "",
      time: "",
      pace: "",
      review: "",
      rating: 0,
      favorite: false,
      participants: []
    });
    
    setEditingRace(null);
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header e ricerca */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white">Le Mie Gare</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 rounded-lg bg-white text-blue-600 font-medium flex items-center text-sm"
          >
            {showAddForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
            {showAddForm ? 'Annulla' : 'Aggiungi Gara'}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cerca per nome o località"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          <button 
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-lg ${showOnlyFavorites ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={showOnlyFavorites ? "currentColor" : "none"}
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
      
      {/* Filtri avanzati */}
      {showFilters && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-blue-800">Filtri Avanzati</h3>
            <button 
              onClick={resetFilters}
              className="text-blue-600 text-sm hover:underline"
            >
              Reimposta filtri
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo di gara</label>
              <select 
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti i tipi</option>
                <option value="strada">Strada</option>
                <option value="trail">Trail</option>
                <option value="maratona">Maratona</option>
                <option value="mezza maratona">Mezza Maratona</option>
                <option value="parkrun">Parkrun</option>
                <option value="camminata">Camminata</option>
                <option value="beneficenza">Beneficenza</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distanza minima (km)</label>
              <input 
                type="number"
                name="distanceMin"
                value={filters.distanceMin}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distanza massima (km)</label>
              <input 
                type="number"
                name="distanceMax"
                value={filters.distanceMax}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 42"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
              <select 
                name="period"
                value={filters.period}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutte le date</option>
                <option value="last-month">Ultimo mese</option>
                <option value="last-3-months">Ultimi 3 mesi</option>
                <option value="last-year">Ultimo anno</option>
                <option value="all">Tutte le gare</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Località</label>
              <input 
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Città o regione"
              />
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center h-10">
                <span className="text-sm text-blue-700 font-medium">
                  {filteredRaces.length} risultati trovati
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Form per aggiungere una nuova gara */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {editingRace ? 'Modifica Gara' : 'Aggiungi Nuova Gara'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titolo*</label>
              <input 
                type="text" 
                name="title"
                value={newRace.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titolo della gara"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Luogo*</label>
              <input 
                type="text" 
                name="location"
                value={newRace.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. Milano (Mi) - IT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data*</label>
              <input 
                type="text" 
                name="date"
                value={newRace.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
              <select 
                name="type"
                value={newRace.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleziona tipo</option>
                <option value="strada">Strada</option>
                <option value="trail">Trail</option>
                <option value="maratona">Maratona</option>
                <option value="mezza maratona">Mezza Maratona</option>
                <option value="parkrun">Parkrun</option>
                <option value="camminata">Camminata</option>
                <option value="beneficenza">Beneficenza</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distanza*</label>
              <input 
                type="text" 
                name="distance"
                value={newRace.distance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 10km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dislivello</label>
              <input 
                type="text" 
                name="elevation"
                value={newRace.elevation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 100m"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo</label>
              <input 
                type="text" 
                name="time"
                value={newRace.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 45:30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ritmo</label>
              <input 
                type="text" 
                name="pace"
                value={newRace.pace}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 4:33 /km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal Best</label>
              <input 
                type="text" 
                name="personalBest"
                value={newRace.personalBest}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. 44:15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valutazione</label>
              <select 
                name="rating"
                value={newRace.rating}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Nessuna valutazione</option>
                <option value="1">1 stella</option>
                <option value="2">2 stelle</option>
                <option value="3">3 stelle</option>
                <option value="4">4 stelle</option>
                <option value="5">5 stelle</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recensione</label>
              <textarea 
                name="review"
                value={newRace.review}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scrivi la tua recensione della gara..."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              onClick={editingRace ? handleCancelEdit : () => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annulla
            </button>
            <button 
              onClick={editingRace ? handleSaveEdit : handleAddRace}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingRace ? 'Salva Modifiche' : 'Salva Gara'}
            </button>
          </div>
        </div>
      )}
      
      {/* Lista gare */}
      <div className="max-h-96 overflow-y-auto">
        {filteredRaces.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nessuna gara trovata
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRaces.map(race => {
              const status = getRaceStatus(race.date);
              
              return (
                <li key={race.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="text-base font-medium text-gray-900">{race.title}</h3>
                        {race.favorite && (
                          <span className="ml-2 text-yellow-500">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="currentColor" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{race.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {race.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {race.distance}
                        </span>
                        {race.elevation !== "0m" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            D+ {race.elevation}
                          </span>
                        )}
                      </div>
                      
                      {/* Tempo e ritmo */}
                      {race.time && (
                        <div className="mt-2 text-sm">
                          <div className="flex items-center">
                            <span className="font-medium">Tempo:</span>
                            <span className="ml-2">{race.time}</span>
                            {race.pace && (
                              <span className="ml-2 text-gray-500">({race.pace})</span>
                            )}
                          </div>
                          {race.personalBest && (
                            <div className="flex items-center mt-1">
                              <span className="font-medium">PB:</span>
                              <span className="ml-2">{race.personalBest}</span>
                              {race.time === race.personalBest && (
                                <span className="ml-2 text-green-500 font-medium">Nuovo PB!</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Recensione */}
                      {race.review && (
                        <div className="mt-2 text-sm">
                          <div className="flex items-center mb-1">
                            <span className="font-medium">Recensione:</span>
                            {race.rating > 0 && (
                              <div className="ml-2 flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < race.rating ? "text-yellow-500 fill-current" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 italic">"{race.review}"</p>
                        </div>
                      )}
                      
                      {/* Partecipanti */}
                      {race.participants && race.participants.length > 0 && (
                        <div className="flex items-center mt-2">
                          <Users size={14} className="mr-1 text-gray-500" />
                          <div className="flex -space-x-2 overflow-hidden">
                            {race.participants.slice(0, 3).map(participant => (
                              <img 
                                key={participant.id}
                                src={participant.avatar} 
                                alt={participant.name}
                                className="h-6 w-6 rounded-full border border-white"
                                title={participant.name}
                              />
                            ))}
                            {race.participants.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border border-white">
                                +{race.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-1">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">{formatDate(race.date)}</span>
                      </div>
                      
                      <span className={`text-xs px-2 py-0.5 rounded-full mb-2 ${getStatusColor(status)}`}>
                        {status === "completata" ? "Completata" : 
                         status === "oggi" ? "Oggi" : 
                         status === "prossima" ? "Prossima" : "Futura"}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleFavorite(race.id)}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill={race.favorite ? "currentColor" : "none"}
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={race.favorite ? "text-yellow-500" : "text-gray-400"}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleEditRace(race)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteRace(race.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Footer con statistiche */}
      <div className="p-3 bg-gray-50 text-xs text-gray-500 border-t">
        <div className="flex items-center">
          <div>
            Visualizzazione {filteredRaces.length} elementi su {races.length} totali
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalRaceDatabase; 