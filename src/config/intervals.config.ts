import { IntervalsCredentials } from '../types/intervals';

export const intervalsConfig: IntervalsCredentials = {
  apiKey: import.meta.env.VITE_INTERVALS_API_KEY || '',
}; 