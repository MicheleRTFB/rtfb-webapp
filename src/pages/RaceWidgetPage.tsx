import React, { useState } from 'react';
import RaceWidget from '../components/RaceWidget';
import { Flag, Plus, Target, Quote, Heart, Edit3, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MotivationalQuote {
  id: number;
  text: string;
  category: string;
}

const RaceWidgetPage: React.FC = () => {
  const [hasSelectedRace, setHasSelectedRace] = useState(false);
  const [showMotivationalModal, setShowMotivationalModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const [customQuote, setCustomQuote] = useState('');

  const motivationalQuotes: MotivationalQuote[] = [
    { id: 1, text: "Corro per sentirmi vivo", category: "Libertà" },
    { id: 2, text: "Ogni chilometro è una vittoria", category: "Determinazione" },
    { id: 3, text: "Il mio unico avversario è il me stesso di ieri", category: "Sfida" },
    { id: 4, text: "Corro per trovare la mia pace", category: "Benessere" },
    { id: 5, text: "Un passo alla volta verso i miei sogni", category: "Obiettivi" },
    { id: 6, text: "La fatica non è mai sprecata", category: "Determinazione" },
    { id: 7, text: "Oltre i limiti, verso l'infinito", category: "Sfida" },
    { id: 8, text: "Nel dolore trovo la mia forza", category: "Resilienza" },
    { id: 9, text: "Corro per essere la migliore versione di me", category: "Crescita" },
    { id: 10, text: "Ogni corsa è una nuova avventura", category: "Esplorazione" }
  ];

  // Componente Modale per le frasi motivazionali
  const MotivationalModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    const categories = Array.from(new Set(motivationalQuotes.map(q => q.category)));

    const handleQuoteSelection = (quote: string) => {
      setSelectedQuote(quote);
      onClose();
    };

    const handleCustomQuoteSubmit = () => {
      if (customQuote.trim()) {
        setSelectedQuote(customQuote);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Quote className="h-5 w-5 text-blue-600 mr-2" />
              Scegli il tuo mantra
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {categories.map(category => (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {motivationalQuotes
                    .filter(q => q.category === category)
                    .map(quote => (
                      <button
                        key={quote.id}
                        onClick={() => handleQuoteSelection(quote.text)}
                        className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <p className="text-gray-900">{quote.text}</p>
                      </button>
                    ))}
                </div>
              </div>
            ))}

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Crea il tuo mantra personale</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  placeholder="Scrivi il tuo mantra personale..."
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleCustomQuoteSubmit}
                  disabled={!customQuote.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scegli il tuo obiettivo</h1>
          <p className="mt-2 text-gray-600">
            Seleziona una gara dal database o imposta un obiettivo personale
          </p>
        </div>

        {!hasSelectedRace ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <Target className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Nessun obiettivo impostato
            </h2>
            <p className="text-gray-600 mb-6">
              Scegli una gara dal database ufficiale o crea un obiettivo personalizzato per iniziare il tuo percorso
            </p>

            {/* Pulsante Mantra */}
            <div className="mb-6">
              <button
                onClick={() => setShowMotivationalModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors group mb-4"
              >
                {selectedQuote ? (
                  <>
                    <Quote className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">{selectedQuote}</span>
                    <Edit3 className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Imposta Obiettivo Personale</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <Link 
                to="/races"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Aggiungi Gara
              </Link>
            </div>
          </div>
        ) : (
          <RaceWidget />
        )}
      </div>

      {/* Modale Motivazionale */}
      <MotivationalModal 
        isOpen={showMotivationalModal}
        onClose={() => setShowMotivationalModal(false)}
      />
    </div>
  );
};

export default RaceWidgetPage; 