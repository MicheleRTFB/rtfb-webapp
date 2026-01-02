# Sistema di Gestione Atleti - Run To Feel Better

Documentazione completa per il sistema di gestione atleti runner con integrazione intervals.icu e n8n.

## 📋 Indice

- [Panoramica](#panoramica)
- [Funzionalità Implementate](#funzionalità-implementate)
- [Architettura](#architettura)
- [Configurazione](#configurazione)
- [Guida all'Uso](#guida-alluso)
- [Integrazione intervals.icu](#integrazione-intervalsicu)
- [Integrazione n8n](#integrazione-n8n)
- [Sviluppo](#sviluppo)

## 🎯 Panoramica

Questo sistema permette ai coach di gestire i propri atleti runner attraverso un'interfaccia web moderna e intuitiva, con integrazione diretta con intervals.icu per:

- ✅ Visualizzare lista atleti
- ✅ Monitorare statistiche e performance
- ✅ Creare e gestire allenamenti
- ✅ Analizzare dati di allenamento e wellness
- ✅ Automatizzare flussi di lavoro tramite n8n

## 🚀 Funzionalità Implementate

### 1. Gestione Atleti (`/athletes`)

**Pagina:** `src/pages/AthletesPage.tsx`

Funzionalità:
- Lista completa degli atleti gestiti
- Visualizzazione profili con avatar e informazioni
- Metriche biometriche (peso, FC max/riposo, soglia)
- Statistiche fitness in tempo reale (CTL, ATL, TSB)
- Azioni rapide per ogni atleta

### 2. Dashboard Statistiche (`/athletes/:athleteId/stats`)

**Pagina:** `src/pages/AthleteStatsPage.tsx`

Funzionalità:
- Range temporale selezionabile (7/30/90 giorni)
- Metriche aggregate:
  - Distanza totale
  - Tempo di allenamento
  - Numero allenamenti
  - Dislivello totale
  - Passo medio
- Grafici interattivi:
  - Distanza e durata per sessione
  - Frequenza cardiaca media
  - Carico di allenamento
  - Dati wellness (peso, HRV, sonno, fatica)
- Tabella attività recenti

### 3. Creazione Allenamenti

**Componente:** `src/components/WorkoutCreator.tsx`

Funzionalità:
- Form completo per creare allenamenti
- Selezione atleta
- Campi:
  - Nome allenamento
  - Data
  - Tipo (Run, Long Run, Tempo, Interval, ecc.)
  - Durata (con preview formattata)
  - Distanza
  - Intensità (Recovery, Easy, Moderate, Tempo, ecc.)
  - Descrizione/Note
  - Stato (Pianificato/Completato/Annullato)
- Validazione form
- Gestione errori
- Modal integrata nella pagina atleti

### 4. Servizi API Estesi

**File:** `src/services/IntervalsService.ts`

Metodi implementati:

#### Athlete Methods
- `getCurrentAthlete()` - Profilo utente autenticato
- `getAthlete(athleteId)` - Profilo atleta specifico
- `getAthletes()` - Lista atleti gestiti

#### Workout Methods
- `getWorkouts(athleteId, startDate, endDate)` - Lista workouts
- `createWorkout(athleteId, workout)` - Crea workout
- `updateWorkout(athleteId, workoutId, workout)` - Aggiorna workout
- `deleteWorkout(athleteId, workoutId)` - Elimina workout
- `getWorkoutHistory(athleteId, limit)` - Storico workouts

#### Activity Methods
- `getActivities(athleteId, startDate, endDate)` - Attività completate

#### Wellness Methods
- `getWellness(athleteId, startDate, endDate)` - Dati benessere

#### Stats Methods
- `getStats(athleteId)` - Statistiche fitness (CTL, ATL, TSB)

### 5. Integrazione n8n

**File:** `src/services/N8nWebhookService.ts`

Eventi supportati:
- `workout.created` - Allenamento creato
- `workout.completed` - Allenamento completato
- `stats.updated` - Statistiche aggiornate
- `athlete.registered` - Nuovo atleta registrato

Funzionalità:
- Invio dati a n8n tramite webhook
- Ricezione dati da n8n
- Configurazione URL webhook tramite env
- Gestione errori e logging

## 🏗️ Architettura

```
src/
├── pages/
│   ├── AthletesPage.tsx           # Gestione atleti
│   └── AthleteStatsPage.tsx       # Dashboard statistiche
├── components/
│   ├── WorkoutCreator.tsx         # Form creazione allenamenti
│   ├── Sidebar.tsx                # Navigazione (aggiornata)
│   └── ...
├── services/
│   ├── IntervalsService.ts        # API intervals.icu (esteso)
│   └── N8nWebhookService.ts       # Integrazione n8n
├── types/
│   └── intervals.ts               # TypeScript interfaces
└── config/
    └── intervals.config.ts        # Configurazione API
```

## ⚙️ Configurazione

### 1. Variabili d'Ambiente

Copia `.env.example` in `.env` e configura:

```bash
# API Key intervals.icu (OBBLIGATORIO)
VITE_INTERVALS_API_KEY=your_api_key_here

# Webhook n8n (OPZIONALI)
VITE_N8N_WEBHOOK_WORKOUT_CREATED=https://your-n8n.com/webhook/workout-created
VITE_N8N_WEBHOOK_WORKOUT_COMPLETED=https://your-n8n.com/webhook/workout-completed
VITE_N8N_WEBHOOK_STATS_UPDATED=https://your-n8n.com/webhook/stats-updated
VITE_N8N_WEBHOOK_ATHLETE_REGISTERED=https://your-n8n.com/webhook/athlete-registered
```

### 2. Ottenere API Key intervals.icu

1. Accedi a [intervals.icu](https://intervals.icu)
2. Vai in **Settings** > **Developer** > **API Access**
3. Genera una nuova API key
4. Copia la key in `.env`

### 3. Setup Account Coach

Per gestire più atleti, il tuo account intervals.icu deve avere:
- Piano Coach/Premium
- Atleti collegati che ti hanno dato accesso

## 📖 Guida all'Uso

### Visualizzare Atleti

1. Accedi alla sezione **"I Miei Atleti"** dalla sidebar
2. Visualizzi la lista completa degli atleti
3. Clicca su un atleta per vedere dettagli e statistiche

### Creare un Allenamento

1. Seleziona un atleta dalla lista
2. Clicca **"Crea Allenamento"** nelle azioni rapide
3. Compila il form:
   - Nome (es. "Fartlek 10km")
   - Data
   - Tipo di allenamento
   - Durata in minuti
   - Distanza (opzionale)
   - Intensità
   - Descrizione/Note
4. Clicca **"Salva Allenamento"**
5. L'allenamento viene creato su intervals.icu

### Visualizzare Statistiche Atleta

1. Seleziona un atleta
2. Clicca **"Vedi Statistiche"**
3. Scegli il range temporale (7/30/90 giorni)
4. Analizza:
   - Metriche aggregate
   - Fitness/Fatica/Forma (CTL/ATL/TSB)
   - Grafici performance
   - Dati wellness
   - Attività recenti

## 🔗 Integrazione intervals.icu

### Autenticazione

Il sistema usa **Basic Authentication** con API key:

```typescript
Authorization: Basic base64(API_KEY:)
```

### Endpoint Utilizzati

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/athlete` | GET | Profilo autenticato |
| `/athlete/{id}` | GET | Profilo atleta |
| `/athlete/athletes` | GET | Lista atleti coach |
| `/athlete/{id}/workouts` | GET | Lista workouts |
| `/athlete/{id}/workouts` | POST | Crea workout |
| `/athlete/{id}/workouts/{id}` | PUT | Aggiorna workout |
| `/athlete/{id}/workouts/{id}` | DELETE | Elimina workout |
| `/athlete/{id}/activities` | GET | Lista attività |
| `/athlete/{id}/wellness` | GET | Dati wellness |
| `/athlete/{id}/fitness` | GET | Statistiche fitness |

### Rate Limiting

intervals.icu ha limiti di rate:
- **100 richieste/ora** per account free
- **1000 richieste/ora** per account premium

Il servizio implementa gestione errori per rate limit.

## 🔄 Integrazione n8n

### Cosa è n8n?

[n8n](https://n8n.io) è una piattaforma di automazione workflow che permette di:
- Connettere diverse app e servizi
- Automatizzare processi ripetitivi
- Creare integrazioni senza codice

### Casi d'Uso

#### 1. Notifica Allenamento Creato

**Flusso n8n:**
```
Webhook Trigger (workout.created)
  ↓
Gmail Node → Invia email all'atleta
  ↓
Google Calendar → Aggiunge evento
  ↓
Slack → Notifica il coach
```

**Payload ricevuto:**
```json
{
  "event": "workout.created",
  "timestamp": "2025-01-02T10:30:00Z",
  "data": {
    "athlete": {
      "id": 123,
      "name": "Mario Rossi",
      "email": "mario@example.com"
    },
    "workout": {
      "id": "456",
      "name": "Fartlek 10km",
      "date": "2025-01-05",
      "type": "Fartlek",
      "duration": 3600,
      "distance": 10
    }
  }
}
```

#### 2. Report Settimanale

**Flusso n8n:**
```
Schedule Trigger (ogni lunedì)
  ↓
HTTP Request → Ottieni stats atleti
  ↓
Function → Calcola metriche settimanali
  ↓
Gmail → Invia report coach
  ↓
Google Sheets → Aggiorna statistiche
```

#### 3. Alert Fitness

**Flusso n8n:**
```
Webhook Trigger (stats.updated)
  ↓
IF Node → Fitness < soglia?
  ↓ (SI)
Telegram → Notifica coach
  ↓
Trello → Crea task "Ridurre carico"
```

### Configurare Webhook n8n

1. **Crea un workflow n8n**
2. **Aggiungi Webhook Trigger node**
3. **Configura URL webhook** (es. `https://your-n8n.com/webhook/workout-created`)
4. **Aggiungi URL in `.env`:**
   ```
   VITE_N8N_WEBHOOK_WORKOUT_CREATED=https://your-n8n.com/webhook/workout-created
   ```
5. **Utilizza nel codice:**
   ```typescript
   import N8nWebhookService from './services/N8nWebhookService';

   const n8nService = new N8nWebhookService();
   await n8nService.notifyWorkoutCreated(athlete, workout);
   ```

### Template n8n Inclusi

Nella cartella `n8n-templates/` (da creare) puoi trovare:
- `workout-notification.json` - Notifiche allenamento
- `weekly-report.json` - Report settimanali
- `fitness-alerts.json` - Alert fitness/forma
- `calendar-sync.json` - Sincronizzazione calendario

## 💻 Sviluppo

### Installazione

```bash
# Clona il repository
git clone [repository-url]

# Installa dipendenze
npm install

# Configura .env
cp .env.example .env
# Modifica .env con le tue credenziali

# Avvia dev server
npm run dev
```

### Build

```bash
# Compila TypeScript e build produzione
npm run build

# Preview build
npm run preview
```

### Tecnologie Utilizzate

- **React 18.2** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 5.1** - Build tool
- **Tailwind CSS 3.4** - Styling
- **React Router 6.30** - Routing
- **Recharts 2.15** - Grafici
- **Lucide React** - Icone

### Struttura Dati

#### IntervalsAthlete
```typescript
interface IntervalsAthlete {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  sport?: string;
  weight?: number;
  maxHR?: number;
  restingHR?: number;
  ftpWatts?: number;
  thresholdPace?: number;
  created?: string;
  premium?: boolean;
  canViewFitness?: boolean;
}
```

#### IntervalsWorkout
```typescript
interface IntervalsWorkout {
  id: string;
  name: string;
  description?: string;
  type: string;
  date: string;
  duration: number; // secondi
  distance?: number; // km
  intensity?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  metrics?: {
    tss?: number;
    intensity?: number;
    distance?: number;
    elevation?: number;
  };
}
```

#### IntervalsStats
```typescript
interface IntervalsStats {
  athleteId: number;
  fitness?: number;      // CTL (Chronic Training Load)
  fatigue?: number;      // ATL (Acute Training Load)
  form?: number;         // TSB (Training Stress Balance)
  rampRate?: number;
  ctlLoad?: number;
  atlLoad?: number;
  loadRating?: string;
  trainingLoad7d?: number;
  trainingLoad30d?: number;
}
```

## 🔐 Sicurezza

- ✅ API key stored in environment variables (non committata)
- ✅ HTTPS per tutte le chiamate API
- ✅ Basic Auth per intervals.icu
- ✅ CORS configurato correttamente
- ✅ Validazione input form
- ✅ Error handling completo

## 📝 TODO Future

- [ ] Implementare autenticazione utenti (login/logout reale)
- [ ] Aggiungere persistenza locale atleti (cache)
- [ ] Sistema notifiche in-app
- [ ] Export dati (PDF, Excel)
- [ ] Pianificazione allenamenti multipli (calendario drag&drop)
- [ ] Grafici avanzati con comparazioni
- [ ] Mobile app (React Native)
- [ ] Messaggistica coach-atleta

## 🆘 Supporto

Per problemi o domande:

1. Controlla la configurazione `.env`
2. Verifica le API key intervals.icu
3. Controlla i logs browser console
4. Verifica connettività con intervals.icu
5. Consulta [documentazione intervals.icu](https://intervals.icu/api/)

## 📄 Licenza

[Inserisci la tua licenza]

---

**Creato con ❤️ per Run To Feel Better**

*Gestisci i tuoi atleti runner in modo professionale ed efficiente*
