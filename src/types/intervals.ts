export interface IntervalsCredentials {
  apiKey: string;
}

export interface IntervalsAthlete {
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

export interface IntervalsWorkout {
  id: string;
  name: string;
  description?: string;
  type: string;
  date: string;
  duration: number;
  distance?: number;
  intensity?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  metrics?: {
    tss?: number;
    intensity?: number;
    distance?: number;
    elevation?: number;
  };
}

export interface IntervalsActivity {
  id: string;
  start_date_local: string;
  type: string;
  name: string;
  description?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  average_hr?: number;
  max_hr?: number;
  average_speed?: number;
  max_speed?: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  training_load?: number;
  icu_training_load?: number;
}

export interface IntervalsWellness {
  id: string;
  date: string;
  weight?: number;
  restingHR?: number;
  hrv?: number;
  sleepSecs?: number;
  sleepQuality?: number;
  fatigue?: number;
  soreness?: number;
  stress?: number;
  mood?: number;
  motivation?: number;
  injury?: number;
  spO2?: number;
  systolic?: number;
  diastolic?: number;
  hydration?: number;
  kcalConsumed?: number;
  menstruation?: boolean;
}

export interface IntervalsStats {
  athleteId: number;
  fitness?: number;
  fatigue?: number;
  form?: number;
  rampRate?: number;
  ctlLoad?: number;
  atlLoad?: number;
  loadRating?: string;
  trainingLoad7d?: number;
  trainingLoad30d?: number;
}

export interface IntervalsApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 