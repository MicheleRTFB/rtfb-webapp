import React, { useState } from 'react';
import IntervalsService from '../services/IntervalsService';
import { intervalsConfig } from '../config/intervals.config';

const ApiTestPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const intervalsService = new IntervalsService(intervalsConfig);

  const addResult = (testName: string, success: boolean, data: any) => {
    setResults(prev => [...prev, {
      testName,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      setLoading(true);
      const data = await testFn();
      addResult(testName, true, data);
    } catch (error: any) {
      addResult(testName, false, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test API intervals.icu
        </h1>

        {/* API Key Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">📌 Configurazione</h2>
          <p className="text-sm text-blue-800">
            <strong>API Key configurata:</strong>{' '}
            {intervalsConfig.apiKey ?
              `${intervalsConfig.apiKey.substring(0, 8)}...${intervalsConfig.apiKey.substring(intervalsConfig.apiKey.length - 4)}` :
              '❌ MANCANTE'}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Se l'API key è mancante, controlla il file .env
          </p>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Disponibili
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => runTest('GET /athlete/i (Profilo Corrente)', () =>
                intervalsService.getCurrentAthlete()
              )}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">1. Profilo Corrente</div>
              <div className="text-xs opacity-90">GET /athlete/i</div>
            </button>

            <button
              onClick={() => runTest('GET /athlete/athletes (Lista Atleti)', () =>
                intervalsService.getAthletes()
              )}
              disabled={loading}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">2. Lista Atleti (Coach)</div>
              <div className="text-xs opacity-90">GET /athlete/athletes</div>
            </button>

            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);

                return runTest('GET /athlete/i/workouts (Ultimi 7 giorni)', () =>
                  intervalsService.getWorkouts('i', weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0])
                );
              }}
              disabled={loading}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">3. Workout (7 giorni)</div>
              <div className="text-xs opacity-90">GET /athlete/i/workouts</div>
            </button>

            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);

                return runTest('GET /athlete/i/activities (Ultimi 7 giorni)', () =>
                  intervalsService.getActivities('i', weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0])
                );
              }}
              disabled={loading}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">4. Attività (7 giorni)</div>
              <div className="text-xs opacity-90">GET /athlete/i/activities</div>
            </button>

            <button
              onClick={() => runTest('GET /athlete/i/wellness (Ultimi 7 giorni)', () => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);

                return intervalsService.getWellness('i', weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
              })}
              disabled={loading}
              className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">5. Wellness (7 giorni)</div>
              <div className="text-xs opacity-90">GET /athlete/i/wellness</div>
            </button>

            <button
              onClick={() => runTest('GET /athlete/i/fitness (Statistiche)', () =>
                intervalsService.getStats('i')
              )}
              disabled={loading}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="font-medium">6. Fitness Stats</div>
              <div className="text-xs opacity-90">GET /athlete/i/fitness</div>
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              🗑️ Pulisci Risultati
            </button>

            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Test in corso...</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Risultati Test ({results.length})
            </h2>

            <div className="space-y-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {result.success ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {result.testName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-2">
              📝 Come usare questa pagina
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
              <li><strong>Clicca sui pulsanti sopra</strong> per testare gli endpoint API</li>
              <li><strong>Test 1</strong> dovrebbe sempre funzionare (profilo corrente)</li>
              <li><strong>Test 2</strong> funziona solo per account Coach</li>
              <li><strong>Test 3-6</strong> mostrano dati allenamenti e statistiche</li>
              <li>Se vedi <strong>✅</strong> = API funziona!</li>
              <li>Se vedi <strong>❌</strong> = Controlla errore e API key</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;
