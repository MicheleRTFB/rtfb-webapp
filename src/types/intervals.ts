export interface IntervalsCredentials {
  apiKey: string;
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

export interface IntervalsApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 