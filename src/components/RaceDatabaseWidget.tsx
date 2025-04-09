import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, MapPin, ExternalLink, Plus, Users, X, 
  Target, Clock, TrendingUp, Star, ChevronRight, Lightbulb, ArrowUpRight,
  Timer, Medal
} from 'lucide-react';

interface Race {
  id: number;
  titolo: string;
  luogo: string;
  dataInizio: string;
  dataFine: string;
  sitoWeb: string;
  tipo: string;
  distanza: string;
  dislivello: string;
  tipologia: string;
  favorita: boolean;
  nazione: string;
  partecipanti: Array<{
    id: number;
    nome: string;
    avatar: string;
  }>;
}

// Aggiungi l'interfaccia per il modale
interface CalendarModalProps {
  race: Race;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (raceId: number, tipologia: string) => void;
}

const CountryFlag = ({ countryCode }: { countryCode: string }) => (
  <img
    src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
    alt={`Bandiera ${countryCode}`}
    className="w-6 h-4 rounded-sm"
  />
);

const PopularityIndicator = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-4 rounded-full ${
            i < value ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

// Aggiungi le interfacce per gli eventi e i parametri
interface SearchEvent extends React.ChangeEvent<HTMLInputElement> {}
interface FilterEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

const RaceDatabaseWidget = () => {
  // Database delle gare
  const initialRaces = [
    {
      id: 1,
      titolo: "La Gaz'Run",
      luogo: "Gazeran - FR",
      dataInizio: "30/03/2025",
      dataFine: "27/04/2025",
      sitoWeb: "",
      tipo: "trail",
      distanza: "12km",
      dislivello: "250m",
      tipologia: "B",
      favorita: false,
      nazione: "FR",
      partecipanti: []
    },
    {
      id: 2,
      titolo: "20° Trofeo del Diamante",
      luogo: "Bolzaneto - Genova (Ge) - IT",
      dataInizio: "04/04/2025",
      dataFine: "04/04/2025",
      sitoWeb: "http://www.gruppocittadigenova.it",
      tipo: "strada",
      distanza: "10km",
      dislivello: "100m",
      tipologia: "B",
      favorita: true,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 3,
      titolo: "Camminata Urbana Coop Alleanza 3.0",
      luogo: "Sassuolo (Mo) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.nuovaprolocoprignano.it",
      tipo: "camminata",
      distanza: "5km",
      dislivello: "50m",
      tipologia: "C",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 4,
      titolo: "Terme parkrun",
      luogo: "Montecatini Terme (Pt) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.parkrun.it/terme",
      tipo: "parkrun",
      distanza: "5km",
      dislivello: "0m",
      tipologia: "C",
      favorita: true,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 5,
      titolo: "5° Run4Hope",
      luogo: "Roma (Rm) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.run4hope.it",
      tipo: "beneficenza",
      distanza: "10km",
      dislivello: "100m",
      tipologia: "B",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 6,
      titolo: "22° La Corsa di Brot",
      luogo: "San Pietro in Campiano - Ravenna (Ra) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "",
      tipo: "strada",
      distanza: "10km",
      dislivello: "0m",
      tipologia: "B",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 7,
      titolo: "Corri in Giallo",
      luogo: "Cerea (Vr) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.veronainrosa.com/corri-in-giallo",
      tipo: "strada",
      distanza: "7km",
      dislivello: "0m",
      tipologia: "C",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 8,
      titolo: "35° Una Corsa per la Vita",
      luogo: "Arenzano (Ge) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.uisp.it/genova",
      tipo: "beneficenza",
      distanza: "7km",
      dislivello: "150m",
      tipologia: "C",
      favorita: true,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 9,
      titolo: "Mura di Lucca parkrun",
      luogo: "Lucca (Lu) - IT",
      dataInizio: "05/04/2025",
      dataFine: "05/04/2025",
      sitoWeb: "http://www.parkrun.it/muradilucca",
      tipo: "parkrun",
      distanza: "5km",
      dislivello: "0m",
      tipologia: "C",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 10,
      titolo: "Maratona di Roma",
      luogo: "Roma (Rm) - IT",
      dataInizio: "06/04/2025",
      dataFine: "06/04/2025",
      sitoWeb: "http://www.maratonadiroma.it",
      tipo: "maratona",
      distanza: "42.195km",
      dislivello: "150m",
      tipologia: "A",
      favorita: true,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 11,
      titolo: "Mezza Maratona di Milano",
      luogo: "Milano (Mi) - IT",
      dataInizio: "13/04/2025",
      dataFine: "13/04/2025",
      sitoWeb: "http://www.mezzadimilano.it",
      tipo: "mezza maratona",
      distanza: "21.097km",
      dislivello: "50m",
      tipologia: "A",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 12,
      titolo: "Eco Trail Portovenere",
      luogo: "Portovenere (Sp) - IT",
      dataInizio: "20/04/2025",
      dataFine: "20/04/2025",
      sitoWeb: "http://www.ecotrailportovenere.it",
      tipo: "trail",
      distanza: "25km",
      dislivello: "1200m",
      tipologia: "A",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    },
    {
      id: 13,
      titolo: "Maratona di New York",
      luogo: "New York - USA",
      dataInizio: "03/11/2025",
      dataFine: "03/11/2025",
      sitoWeb: "http://www.nycmarathon.org",
      tipo: "maratona",
      distanza: "42.195km",
      dislivello: "373m",
      tipologia: "A",
      favorita: true,
      nazione: "USA",
      partecipanti: []
    }
  ];

  // Stato per le gare e ricerca
  const [races, setRaces] = useState<Race[]>(initialRaces);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>(initialRaces);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tipo: "",
    distanzaMin: "",
    distanzaMax: "",
    periodo: "",
    luogo: "",
    dislivello: "",
    tipologia: ""
  });
  const [newRace, setNewRace] = useState<Race>({
    id: 0,
    titolo: "",
    luogo: "",
    dataInizio: "",
    dataFine: "",
    sitoWeb: "",
    tipo: "",
    distanza: "",
    dislivello: "",
    tipologia: "",
    favorita: false,
    nazione: "IT",
    partecipanti: []
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [recommendedRaces, setRecommendedRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [addedRaces, setAddedRaces] = useState<Race[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Funzione per gestire la ricerca con filtri
  const applyFilters = () => {
    let filtered = races;
    
    // Applica filtro di ricerca testuale
    if (searchTerm) {
      filtered = filtered.filter(race => 
        race.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.luogo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Applica filtro preferiti
    if (showOnlyFavorites) {
      filtered = filtered.filter(race => race.favorita);
    }
    
    // Applica filtro per tipo
    if (filters.tipo) {
      filtered = filtered.filter(race => race.tipo.toLowerCase() === filters.tipo.toLowerCase());
    }
    
    // Applica filtro per distanza minima
    if (filters.distanzaMin) {
      filtered = filtered.filter(race => {
        const distanzaNum = parseFloat(race.distanza.replace(/[^0-9.]/g, ''));
        return distanzaNum >= parseFloat(filters.distanzaMin);
      });
    }
    
    // Applica filtro per distanza massima
    if (filters.distanzaMax) {
      filtered = filtered.filter(race => {
        const distanzaNum = parseFloat(race.distanza.replace(/[^0-9.]/g, ''));
        return distanzaNum <= parseFloat(filters.distanzaMax);
      });
    }
    
    // Applica filtro per periodo
    if (filters.periodo) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(race => {
        const [day, month, year] = race.dataInizio.split('/');
        const raceDate = new Date(`${year}-${month}-${day}`);
        
        switch(filters.periodo) {
          case "oggi":
            return raceDate.getTime() === today.getTime();
          case "prossima-settimana": {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return raceDate >= today && raceDate <= nextWeek;
          }
          case "prossimo-mese": {
            const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);
            return raceDate >= today && raceDate <= nextMonth;
          }
          case "passate":
            return raceDate < today;
          default:
            return true;
        }
      });
    }
    
    // Applica filtro per luogo
    if (filters.luogo) {
      filtered = filtered.filter(race => 
        race.luogo.toLowerCase().includes(filters.luogo.toLowerCase())
      );
    }

    // Applica filtro per dislivello
    if (filters.dislivello) {
      filtered = filtered.filter(race => {
        const dislivelloNum = parseFloat(race.dislivello.replace(/[^0-9.]/g, ''));
        switch(filters.dislivello) {
          case "piano":
            return dislivelloNum <= 100;
          case "collinare":
            return dislivelloNum > 100 && dislivelloNum <= 500;
          case "montagna":
            return dislivelloNum > 500;
          default:
            return true;
        }
      });
    }

    // Applica filtro per tipologia
    if (filters.tipologia) {
      filtered = filtered.filter(race => race.tipologia === filters.tipologia);
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
      tipo: "",
      distanzaMin: "",
      distanzaMax: "",
      periodo: "",
      luogo: "",
      dislivello: "",
      tipologia: ""
    });
    setTimeout(applyFilters, 0);
  };
  
  // Funzione per gestire i cambiamenti nei filtri
  const handleFilterChange = (e: FilterEvent) => {
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
      race.id === id ? {...race, favorita: !race.favorita} : race
    );
    
    setRaces(updatedRaces);
    setFilteredRaces(
      showOnlyFavorites 
        ? updatedRaces.filter(race => race.favorita)
        : updatedRaces.filter(race => 
            race.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            race.luogo.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  };
  
  // Funzione per aggiungere al calendario
  const addToCalendar = (raceId: number) => {
    const race = races.find(r => r.id === raceId);
    if (race) {
      setSelectedRace(race);
      setIsCalendarModalOpen(true);
    }
  };
  
  // Funzione per confermare l'aggiunta al calendario
  const handleCalendarConfirm = (raceId: number, tipologia: string) => {
    const race = races.find(r => r.id === raceId);
    if (race) {
      setAddedRaces(prev => [...prev, { ...race, tipologia }]);
      setShowCountdown(true);
    }
    setIsCalendarModalOpen(false);
  };
  
  // Formatta una data per la visualizzazione
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    
    return new Intl.DateTimeFormat('it-IT', { 
      day: 'numeric' as const, 
      month: 'short' as const 
    }).format(date);
  };
  
  // Calcola lo stato della gara in base alla data
  const getRaceStatus = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const raceDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRace(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Funzione per aggiungere una nuova gara
  const handleAddRace = () => {
    // Validazione minima
    if (!newRace.titolo || !newRace.luogo || !newRace.dataInizio || !newRace.tipo || !newRace.distanza) {
      alert("Per favore compila tutti i campi obbligatori");
      return;
    }
    
    const newRaceWithId = {
      ...newRace,
      id: races.length > 0 ? Math.max(...races.map(race => race.id)) + 1 : 1,
      dataFine: newRace.dataFine || newRace.dataInizio,
    };
    
    const updatedRaces = [...races, newRaceWithId];
    setRaces(updatedRaces);
    setFilteredRaces(showOnlyFavorites ? updatedRaces.filter(race => race.favorita) : updatedRaces);
    
    // Reset del form
    setNewRace({
      id: 0,
      titolo: "",
      luogo: "",
      dataInizio: "",
      dataFine: "",
      sitoWeb: "",
      tipo: "",
      distanza: "",
      dislivello: "",
      tipologia: "",
      favorita: false,
      nazione: "IT",
      partecipanti: []
    });
    
    setShowAddForm(false);
  };

  // Funzione per impostare una gara come obiettivo
  const setRaceAsGoal = (raceId: number) => {
    // Implementare la logica per impostare la gara come obiettivo
    console.log('Impostata gara come obiettivo:', raceId);
  };

  // Componente per la card della gara
  const RaceCard = ({ race }: { race: Race }) => {
    const countryCode = race.nazione || 'it'; // Default a IT se non specificato

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{race.titolo}</h3>
                <CountryFlag countryCode={countryCode} />
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{race.luogo}</span>
              </div>
            </div>
            <button 
              onClick={() => toggleFavorite(race.id)}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star className={`h-5 w-5 ${race.favorita ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>

          {/* Info principali */}
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span>{race.dataInizio}</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {race.tipo}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {race.distanza}
              </span>
              {race.dislivello !== "0m" && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  D+ {race.dislivello}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {race.partecipanti?.length || 0} partecipanti
                </span>
              </div>
              <button
                onClick={() => addToCalendar(race.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Aggiungi al Calendario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente Modale per l'aggiunta al calendario
  const CalendarModal = ({ race, isOpen, onClose, onConfirm }: CalendarModalProps) => {
    const [selectedType, setSelectedType] = useState("");

    if (!isOpen) return null;

    const typeDescriptions = {
      A: "Gara principale della stagione. Obiettivo di prestazione massima con preparazione dedicata.",
      B: "Gara importante ma non principale. Obiettivo di buona prestazione con preparazione parzialmente adattata.",
      C: "Gara di allenamento o test. Nessuna preparazione specifica, utilizzata come allenamento."
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Aggiungi al calendario: {race.titolo}
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Seleziona la tipologia di gara per la tua pianificazione. In caso di dubbi, consulta il tuo coach per scegliere la tipologia più adatta ai tuoi obiettivi.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    Non sai come scegliere le tue gare obiettivo?
                  </p>
                  <a 
                    href="/academy/race-planning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mt-1"
                  >
                    Scopri di più nella nostra Academy
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(typeDescriptions).map(([type, description]) => (
              <div
                key={type}
                className={`p-3 rounded-lg border cursor-pointer transition-colors
                  ${selectedType === type 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-200'}`}
                onClick={() => setSelectedType(type)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${selectedType === type ? 'border-blue-500' : 'border-gray-400'}`}>
                    {selectedType === type && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-medium">Tipo {type}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 ml-6">
                  {description}
                </p>
              </div>
            ))}

            {/* Opzione Seleziona in seguito */}
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-colors
                ${selectedType === 'later' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}`}
              onClick={() => setSelectedType('later')}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                  ${selectedType === 'later' ? 'border-blue-500' : 'border-gray-400'}`}>
                  {selectedType === 'later' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className="font-medium">Seleziona in seguito</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 ml-6">
                Aggiungi la gara al calendario e decidi più tardi la tipologia di preparazione.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Annulla
            </button>
            <button
              onClick={() => {
                if (selectedType) {
                  onConfirm(race.id, selectedType);
                  onClose();
                }
              }}
              disabled={!selectedType}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md
                ${selectedType 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-300 cursor-not-allowed'}`}
            >
              Conferma
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Funzione per calcolare i giorni rimanenti
  const calculateDaysRemaining = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const raceDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    const diffTime = raceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Componente Countdown
  const RaceCountdown = ({ races }: { races: Race[] }) => {
    if (races.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Timer className="h-5 w-5 text-blue-600 mr-2" />
          Le tue prossime gare
        </h3>
        <div className="space-y-4">
          {races.map(race => {
            const daysRemaining = calculateDaysRemaining(race.dataInizio);
            const isUpcoming = daysRemaining > 0;

            return (
              <div key={race.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    isUpcoming ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isUpcoming ? <Timer className="h-5 w-5" /> : <Medal className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{race.titolo}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {race.luogo}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isUpcoming ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {isUpcoming ? `${daysRemaining} giorni` : 'Completata'}
                  </div>
                  <div className="text-sm text-gray-500">{race.dataInizio}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mostra il countdown se ci sono gare aggiunte */}
      {showCountdown && <RaceCountdown races={addedRaces} />}

      {/* Header e Statistiche */}
      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Scegli la tua prossima sfida</h2>
          <p className="text-base text-gray-500 mt-1">Trova la gara perfetta per il tuo obiettivo</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold">156</div>
            <div className="text-sm text-gray-500">Gare Totali</div>
            <div className="text-xs text-gray-400 mt-1">In programma nei prossimi 12 mesi</div>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold">12</div>
            <div className="text-sm text-gray-500">Gare in Evidenza</div>
            <div className="text-xs text-gray-400 mt-1">Selezionate per te questa settimana</div>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold">2.5k+</div>
            <div className="text-sm text-gray-500">Partecipanti</div>
            <div className="text-xs text-gray-400 mt-1">Atleti nella community</div>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold">23</div>
            <div className="text-sm text-gray-500">Prossime Gare</div>
            <div className="text-xs text-gray-400 mt-1">Nei prossimi 30 giorni</div>
          </div>
        </div>
      </div>
      
      {/* Obiettivi Popolari */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Obiettivi Popolari</h3>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: 'Prima Maratona', color: 'blue', icon: Target },
            { label: 'Personal Best 10K', color: 'green', icon: Clock },
            { label: 'Trail Running', color: 'orange', icon: TrendingUp },
            { label: 'Ultra Distance', color: 'purple', icon: Target },
            { label: 'Gare Cittadine', color: 'pink', icon: MapPin }
          ].map(({ label, color, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  tipo: label.toLowerCase()
                }));
              }}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                bg-${color}-50 text-${color}-700 hover:bg-${color}-100 
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color}-500
                border border-${color}-200`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gare Consigliate */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <h3 className="text-lg font-bold">Vuoi correre alla grande la prossima gara?</h3>
              <p className="text-sm text-blue-100 mt-1">
                Affidati ai nostri allenatori professionisti
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-200" />
                <span className="text-sm">Piano personalizzato</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-200" />
                <span className="text-sm">Monitoraggio progressi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-200" />
                <span className="text-sm">Supporto dedicato</span>
              </div>
            </div>
          </div>
          <button className="whitespace-nowrap px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors duration-200 inline-flex items-center group">
            Completa profilo
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Cerca per nome, luogo o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`inline-flex items-center px-4 py-2 border ${
              showOnlyFavorites 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-gray-300 text-gray-700'
            } rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Star className={`h-4 w-4 mr-2 ${showOnlyFavorites ? 'fill-yellow-500' : ''}`} />
            Preferiti
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Filtri Avanzati
          </button>
        </div>
      </div>

      {/* Filtri Avanzati */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tipo di Gara */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo di Gara
              </label>
              <select
                id="tipo"
                name="tipo"
                value={filters.tipo}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tutti i tipi</option>
                <option value="maratona">Maratona</option>
                <option value="mezza maratona">Mezza Maratona</option>
                <option value="trail">Trail Running</option>
                <option value="strada">Strada</option>
                <option value="parkrun">Parkrun</option>
                <option value="ultra">Ultra Trail</option>
                <option value="beneficenza">Beneficenza</option>
                <option value="camminata">Camminata</option>
              </select>
            </div>

            {/* Distanza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distanza (km)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="distanzaMin"
                    value={filters.distanzaMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="distanzaMax"
                    value={filters.distanzaMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Periodo */}
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-2">
                Periodo
              </label>
              <select
                id="periodo"
                name="periodo"
                value={filters.periodo}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Qualsiasi periodo</option>
                <option value="oggi">Oggi</option>
                <option value="prossima-settimana">Prossima settimana</option>
                <option value="prossimo-mese">Prossimo mese</option>
                <option value="passate">Gare passate</option>
              </select>
            </div>

            {/* Luogo */}
            <div>
              <label htmlFor="luogo" className="block text-sm font-medium text-gray-700 mb-2">
                Luogo
              </label>
              <input
                type="text"
                name="luogo"
                id="luogo"
                value={filters.luogo}
                onChange={handleFilterChange}
                placeholder="Città o regione"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Dislivello */}
            <div>
              <label htmlFor="dislivello" className="block text-sm font-medium text-gray-700 mb-2">
                Dislivello
              </label>
              <select
                id="dislivello"
                name="dislivello"
                value={filters.dislivello}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Qualsiasi dislivello</option>
                <option value="piano">Pianeggiante (0-100m)</option>
                <option value="collinare">Collinare (100-500m)</option>
                <option value="montagna">Montagna (500m+)</option>
              </select>
            </div>

            {/* Tipologia */}
            <div>
              <label htmlFor="tipologia" className="block text-sm font-medium text-gray-700 mb-2">
                Tipologia
              </label>
              <select
                id="tipologia"
                name="tipologia"
                value={filters.tipologia}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tutte le tipologie</option>
                <option value="A">Tipo A (Eventi Maggiori)</option>
                <option value="B">Tipo B (Eventi Intermedi)</option>
                <option value="C">Tipo C (Eventi Locali)</option>
              </select>
            </div>
          </div>

          {/* Pulsanti di azione */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Resetta Filtri
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Applica Filtri
            </button>
          </div>
        </div>
      )}

      {/* Lista Gare */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRaces.length > 0 ? (
          filteredRaces.map(race => (
            <RaceCard key={race.id} race={race} />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="bg-blue-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Non abbiamo trovato gare corrispondenti alla tua ricerca
                </h3>
                <p className="text-sm text-gray-600">
                  Aiutaci a migliorare il database suggerendo una nuova gara. 
                  La tua segnalazione verrà validata dal nostro team.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Suggerisci una gara
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale Aggiungi Gara */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Suggerisci una nuova gara
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titolo" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome della gara *
                </label>
                <input
                  type="text"
                  id="titolo"
                  name="titolo"
                  value={newRace.titolo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="luogo" className="block text-sm font-medium text-gray-700 mb-1">
                  Luogo *
                </label>
                <input
                  type="text"
                  id="luogo"
                  name="luogo"
                  value={newRace.luogo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="dataInizio" className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  id="dataInizio"
                  name="dataInizio"
                  value={newRace.dataInizio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo di gara *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={newRace.tipo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleziona tipo</option>
                  <option value="maratona">Maratona</option>
                  <option value="mezza maratona">Mezza Maratona</option>
                  <option value="trail">Trail Running</option>
                  <option value="strada">Strada</option>
                  <option value="parkrun">Parkrun</option>
                  <option value="ultra">Ultra Trail</option>
                  <option value="beneficenza">Beneficenza</option>
                  <option value="camminata">Camminata</option>
                </select>
              </div>

              <div>
                <label htmlFor="distanza" className="block text-sm font-medium text-gray-700 mb-1">
                  Distanza (km) *
                </label>
                <input
                  type="text"
                  id="distanza"
                  name="distanza"
                  value={newRace.distanza}
                  onChange={handleInputChange}
                  placeholder="es. 42.195"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="dislivello" className="block text-sm font-medium text-gray-700 mb-1">
                  Dislivello (m)
                </label>
                <input
                  type="text"
                  id="dislivello"
                  name="dislivello"
                  value={newRace.dislivello}
                  onChange={handleInputChange}
                  placeholder="es. 500"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="sitoWeb" className="block text-sm font-medium text-gray-700 mb-1">
                  Sito web
                </label>
                <input
                  type="url"
                  id="sitoWeb"
                  name="sitoWeb"
                  value={newRace.sitoWeb}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="col-span-full">
                <p className="text-sm text-gray-500 mt-4">
                  * Campi obbligatori. La gara verrà aggiunta al database dopo la validazione da parte del nostro team.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annulla
              </button>
              <button
                onClick={handleAddRace}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Invia suggerimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Calendario */}
      {selectedRace && (
        <CalendarModal
          race={selectedRace}
          isOpen={isCalendarModalOpen}
          onClose={() => {
            setIsCalendarModalOpen(false);
            setSelectedRace(null);
          }}
          onConfirm={handleCalendarConfirm}
        />
      )}
    </div>
  );
};

export default RaceDatabaseWidget; 