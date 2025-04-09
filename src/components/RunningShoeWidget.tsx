import React, { useState } from 'react';
import { Calendar, AlertCircle, Plus, Check, Archive, ListChecks, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Shoe {
  id: number;
  name: string;
  brand: string;
  model: string;
  color: string;
  purchaseDate: string;
  maxKm: number;
  currentKm: number;
  isActive: boolean;
  cost: number;
  archivedDate?: string;
  rating: number;
}

interface NewShoeData {
  name: string;
  brand: string;
  model: string;
  color: string;
  maxKm: number;
  currentKm: number;
  isActive: boolean;
  purchaseDate: string;
  cost: string;
  rating: number;
}

const RunningShoeWidget = () => {
  // Stato per controllare quale schermata mostrare
  const [activeScreen, setActiveScreen] = useState('main'); // 'main', 'addShoe', 'archive'
  
  // Stato per le scarpe
  const [shoes, setShoes] = useState<Shoe[]>([
    {
      id: 1,
      name: "Nike Pegasus 39",
      brand: "Nike",
      model: "Pegasus 39",
      color: "Blue/White",
      purchaseDate: "2024-12-15",
      maxKm: 700,
      currentKm: 356,
      isActive: true,
      cost: 120,
      rating: 4
    },
    {
      id: 2,
      name: "Hoka Clifton 8",
      brand: "Hoka",
      model: "Clifton 8",
      color: "Red/Black",
      purchaseDate: "2024-08-03",
      maxKm: 700,
      currentKm: 682,
      isActive: true,
      cost: 140,
      rating: 5
    },
    {
      id: 3,
      name: "Adidas SolarBoost",
      brand: "Adidas",
      model: "SolarBoost",
      color: "Black/Red",
      purchaseDate: "2024-02-10",
      maxKm: 700,
      currentKm: 700,
      isActive: false,
      cost: 130,
      archivedDate: "2024-11-30",
      rating: 3
    }
  ]);
  
  // Stato per la scarpa selezionata
  const [selectedShoeId, setSelectedShoeId] = useState(1);
  
  // Stati per l'aggiunta di una nuova scarpa
  const [newShoeData, setNewShoeData] = useState<NewShoeData>({
    name: "",
    brand: "",
    model: "",
    color: "",
    maxKm: 700,
    currentKm: 0,
    isActive: true,
    purchaseDate: new Date().toISOString().split('T')[0],
    cost: "",
    rating: 0
  });
  
  // Filtra solo le scarpe attive
  const activeShoes = shoes.filter(shoe => shoe.isActive);
  
  // Filtra solo le scarpe archiviate
  const archivedShoes = shoes.filter(shoe => !shoe.isActive);
  
  // Scarpa selezionata
  const selectedShoe = shoes.find(shoe => shoe.id === selectedShoeId) || (activeShoes.length > 0 ? activeShoes[0] : null);
  
  // Calcola la percentuale di usura
  const calculateWearPercentage = (shoe: Shoe): number => {
    return Math.min(100, (shoe.currentKm / shoe.maxKm) * 100);
  };
  
  // Ottieni il colore in base alla percentuale di usura
  const getWearColor = (percentage: number): string => {
    if (percentage < 60) return "#4CAF50"; // Verde
    if (percentage < 85) return "#FFC107"; // Giallo
    return "#FF5722"; // Rosso
  };
  
  // Aggiungi km a una scarpa
  const addKmToShoe = (shoeId: number, km: number): void => {
    setShoes(shoes.map(shoe => 
      shoe.id === shoeId 
        ? {...shoe, currentKm: shoe.currentKm + km} 
        : shoe
    ));
  };
  
  // Archivia una scarpa
  const archiveShoe = (shoeId: number): void => {
    // Trova l'indice della scarpa corrente
    const currentIndex = activeShoes.findIndex(shoe => shoe.id === shoeId);
    
    // Imposta la scarpa come inattiva e aggiungi la data di archiviazione
    setShoes(shoes.map(shoe => 
      shoe.id === shoeId 
        ? {
            ...shoe, 
            isActive: false, 
            archivedDate: new Date().toISOString().split('T')[0]
          } 
        : shoe
    ));
    
    // Se ci sono altre scarpe attive, seleziona la prossima o la precedente
    if (activeShoes.length > 1) {
      // Se è l'ultima dell'array, seleziona la precedente, altrimenti la successiva
      const nextIndex = currentIndex === activeShoes.length - 1 ? currentIndex - 1 : currentIndex + 1;
      setSelectedShoeId(activeShoes[nextIndex].id);
    }
  };
  
  // Aggiorna il voto di una scarpa
  const updateShoeRating = (shoeId: number, rating: number): void => {
    setShoes(shoes.map(shoe => 
      shoe.id === shoeId 
        ? {...shoe, rating} 
        : shoe
    ));
  };
  
  // Converti una data in formato leggibile
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  
  // Aggiungi una nuova scarpa
  const handleAddShoe = () => {
    if (!newShoeData.name || !newShoeData.brand || !newShoeData.model) return;
    
    const newShoe: Shoe = {
      ...newShoeData,
      id: shoes.length > 0 ? Math.max(...shoes.map(s => s.id)) + 1 : 1,
      isActive: true,
      cost: parseFloat(newShoeData.cost) || 0,
      rating: newShoeData.rating || 0
    };
    
    setShoes([...shoes, newShoe]);
    setSelectedShoeId(newShoe.id);
    setActiveScreen('main');
    
    // Reset form
    setNewShoeData({
      name: "",
      brand: "",
      model: "",
      color: "",
      maxKm: 700,
      currentKm: 0,
      isActive: true,
      purchaseDate: new Date().toISOString().split('T')[0],
      cost: "",
      rating: 0
    });
  };
  
  // Riattiva una scarpa archiviata
  const reactivateShoe = (shoeId: number) => {
    setShoes(shoes.map(shoe => 
      shoe.id === shoeId 
        ? {...shoe, isActive: true, archivedDate: undefined} 
        : shoe
    ));
    setSelectedShoeId(shoeId);
    setActiveScreen('main');
  };
  
  // Gestisci il cambio della scarpa selezionata
  const handleShoeChange = (direction: string) => {
    const activeShoeIds = activeShoes.map(shoe => shoe.id);
    const currentIndex = activeShoeIds.indexOf(selectedShoeId);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % activeShoeIds.length;
    } else {
      newIndex = (currentIndex - 1 + activeShoes.length) % activeShoes.length;
    }
    
    setSelectedShoeId(activeShoeIds[newIndex]);
  };
  
  // Renderizza le stelle per il voto
  const renderStars = (rating: number, shoeId: number, isInteractive: boolean = false) => {
    return (
      <div className="flex justify-center my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={isInteractive ? () => updateShoeRating(shoeId, star) : undefined}
            className={`p-0.5 ${isInteractive ? 'cursor-pointer' : ''}`}
            disabled={!isInteractive}
          >
            <Star 
              size={16} 
              className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
            />
          </button>
        ))}
      </div>
    );
  };
  
  // Renderizza la schermata principale
  if (activeScreen === 'main') {
    // Se non ci sono scarpe attive, mostra un messaggio
    if (activeShoes.length === 0) {
      return (
        <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
          <div className="flex items-center justify-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Le Mie Scarpe</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-center flex-col h-32">
            <p className="text-sm text-gray-500 text-center">
              Non hai scarpe attive al momento
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveScreen('addShoe')}
              className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Aggiungi Scarpe</span>
            </button>
            
            {archivedShoes.length > 0 && (
              <button 
                onClick={() => setActiveScreen('archive')}
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                <ListChecks className="h-4 w-4 mr-1" />
                <span>Visualizza Archivio</span>
              </button>
            )}
          </div>
        </div>
      );
    }
    
    if (!selectedShoe) return null; // Controllo di sicurezza
    
    const wearPercentage = calculateWearPercentage(selectedShoe);
    const wearColor = getWearColor(wearPercentage);
    const remainingKm = Math.max(0, selectedShoe.maxKm - selectedShoe.currentKm);
    
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          {activeShoes.length > 1 ? (
            <button 
              onClick={() => handleShoeChange('prev')} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
          ) : (
            <div className="w-7"></div>
          )}
          
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">Le Mie Scarpe</h2>
          </div>
          
          {activeShoes.length > 1 ? (
            <button 
              onClick={() => handleShoeChange('next')} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          ) : (
            <div className="w-7"></div>
          )}
        </div>
        
        {/* Nome scarpa */}
        <div className="text-center mb-1">
          <h3 className="text-xl font-bold text-gray-700">{selectedShoe.name}</h3>
          <p className="text-sm text-gray-500">{selectedShoe.color}</p>
        </div>
        
        {/* Sistema di voto */}
        {renderStars(selectedShoe.rating, selectedShoe.id, true)}
        
        {/* Chilometri percorsi */}
        <div className="text-center mb-5">
          <div className="flex justify-center items-end">
            <span className="text-5xl font-bold text-gray-800">{selectedShoe.currentKm}</span>
            <span className="text-xl text-gray-500 mb-1">/{selectedShoe.maxKm} km</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">chilometri percorsi</p>
        </div>
        
        {/* Barra di usura */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Usura:</span>
            <span className="font-medium">{Math.round(wearPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${wearPercentage}%`,
                backgroundColor: wearColor
              }}
            ></div>
          </div>
        </div>
        
        {/* Dettagli aggiuntivi */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Km rimanenti</p>
            <p className="text-lg font-bold text-gray-800">{remainingKm}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Acquistate il</p>
            <p className="text-sm font-medium text-gray-800">{formatDate(selectedShoe.purchaseDate).split(' ').slice(0, 2).join(' ')}</p>
          </div>
        </div>
        
        {/* Costo e costo per km */}
        {selectedShoe.cost && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600">Costo</p>
              <p className="text-sm font-medium text-gray-800">{selectedShoe.cost} €</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600">€/km</p>
              <p className="text-sm font-medium text-gray-800">
                {selectedShoe.currentKm > 0 
                  ? (selectedShoe.cost / selectedShoe.currentKm).toFixed(2) 
                  : "0.00"} €
              </p>
            </div>
          </div>
        )}
        
        {/* Avviso se la scarpa è quasi da sostituire */}
        {wearPercentage >= 85 && (
          <div className="bg-orange-50 rounded-lg p-3 mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700">
              Queste scarpe sono quasi al limite! Considera di acquistarne un nuovo paio presto.
            </p>
          </div>
        )}
        
        {/* Simulazione incremento km */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button 
            onClick={() => addKmToShoe(selectedShoeId, 5)}
            className="py-1 px-2 bg-blue-100 text-blue-700 rounded text-sm"
          >
            +5 km
          </button>
          <button 
            onClick={() => addKmToShoe(selectedShoeId, 10)}
            className="py-1 px-2 bg-blue-100 text-blue-700 rounded text-sm"
          >
            +10 km
          </button>
          <button 
            onClick={() => addKmToShoe(selectedShoeId, 20)}
            className="py-1 px-2 bg-blue-100 text-blue-700 rounded text-sm"
          >
            +20 km
          </button>
        </div>
        
        {/* Pulsanti azione */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            onClick={() => setActiveScreen('addShoe')}
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Aggiungi</span>
          </button>
          
          <button 
            onClick={() => archiveShoe(selectedShoeId)}
            className="flex items-center justify-center bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            <Archive className="h-4 w-4 mr-1" />
            <span>Archivia</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Renderizza la schermata di aggiunta scarpe
  if (activeScreen === 'addShoe') {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Aggiungi Scarpe</h2>
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Nome visualizzato</label>
          <input
            type="text"
            value={newShoeData.name}
            onChange={(e) => setNewShoeData({...newShoeData, name: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. Nike Pegasus 39"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Marca</label>
          <input
            type="text"
            value={newShoeData.brand}
            onChange={(e) => setNewShoeData({...newShoeData, brand: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. Nike"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Modello</label>
          <input
            type="text"
            value={newShoeData.model}
            onChange={(e) => setNewShoeData({...newShoeData, model: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. Pegasus 39"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Colore</label>
          <input
            type="text"
            value={newShoeData.color}
            onChange={(e) => setNewShoeData({...newShoeData, color: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. Blue/White"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Data di acquisto</label>
          <input
            type="date"
            value={newShoeData.purchaseDate}
            onChange={(e) => setNewShoeData({...newShoeData, purchaseDate: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Costo (€)</label>
          <input
            type="number"
            value={newShoeData.cost}
            onChange={(e) => setNewShoeData({...newShoeData, cost: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 120"
            step="0.01"
          />
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Km massimi consigliati</label>
          <input
            type="number"
            value={newShoeData.maxKm}
            onChange={(e) => setNewShoeData({...newShoeData, maxKm: parseInt(e.target.value) || 0})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 700"
          />
          <p className="text-xs text-gray-500 mt-1">Tipicamente tra 600-800 km</p>
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Km già percorsi</label>
          <input
            type="number"
            value={newShoeData.currentKm}
            onChange={(e) => setNewShoeData({...newShoeData, currentKm: parseInt(e.target.value) || 0})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Es. 0"
          />
          <p className="text-xs text-gray-500 mt-1">Inserisci solo se le scarpe non sono nuove</p>
        </div>
        
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-600 mb-1">Valutazione</label>
          <div className="flex justify-center my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setNewShoeData({...newShoeData, rating: star})}
                className="p-0.5 cursor-pointer"
              >
                <Star 
                  size={20} 
                  className={star <= newShoeData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={() => setActiveScreen('main')}
            className="flex items-center justify-center bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            <span>Annulla</span>
          </button>
          
          <button 
            onClick={handleAddShoe}
            disabled={!newShoeData.name || !newShoeData.brand || !newShoeData.model}
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              newShoeData.name && newShoeData.brand && newShoeData.model
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="h-4 w-4 mr-1" />
            <span>Conferma</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Renderizza la schermata dell'archivio
  if (activeScreen === 'archive') {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 font-sans">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => setActiveScreen('main')}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">Archivio Scarpe</h2>
          <div className="w-5"></div>
        </div>
        
        {archivedShoes.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-center flex-col h-32">
            <p className="text-sm text-gray-500 text-center">
              Non hai scarpe archiviate
            </p>
          </div>
        ) : (
          <div className="space-y-3 mt-2 max-h-96 overflow-y-auto">
            {archivedShoes.map(shoe => {
              const wearPercentage = calculateWearPercentage(shoe);
              const totalMonths = shoe.archivedDate ? 
                Math.round((new Date(shoe.archivedDate).getTime() - new Date(shoe.purchaseDate).getTime()) / (30 * 24 * 60 * 60 * 1000)) : 0;
              
              return (
                <div key={shoe.id} className="bg-gray-50 rounded-lg p-3 relative">
                  <div className="flex justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-700">{shoe.name}</h3>
                    <button 
                      onClick={() => reactivateShoe(shoe.id)}
                      className="text-green-500 hover:text-green-700"
                      title="Riattiva queste scarpe"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500">{shoe.color}</p>
                  
                  {/* Valutazione */}
                  {renderStars(shoe.rating, shoe.id, false)}
                  
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Km totali:</span>
                    <span className="font-medium">{shoe.currentKm}/{shoe.maxKm}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${wearPercentage}%`,
                        backgroundColor: getWearColor(wearPercentage)
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs">
                    <div>
                      <p className="text-gray-600">Durata:</p>
                      <p className="font-medium">{totalMonths} mesi</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Costo/km:</p>
                      <p className="font-medium">
                        {shoe.cost && shoe.currentKm ? 
                          `${(shoe.cost / shoe.currentKm).toFixed(2)} €` : 
                          "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {shoe.archivedDate && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Archiviate il {formatDate(shoe.archivedDate).split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4">
          <button 
            onClick={() => setActiveScreen('main')}
            className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <span>Torna alle Scarpe Attive</span>
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default RunningShoeWidget; 