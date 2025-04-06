import { IntervalsCredentials, IntervalsWorkout } from '../types/intervals';

class IntervalsService {
  private baseUrl = 'https://intervals.icu/api/v1';
  private credentials: IntervalsCredentials;

  constructor(credentials: IntervalsCredentials) {
    this.credentials = credentials;
  }

  private getHeaders(): Headers {
    // Basic Auth con API key come username e stringa vuota come password
    const authString = `${this.credentials.apiKey}:`;
    const base64Auth = btoa(authString);
    
    return new Headers({
      'Authorization': `Basic ${base64Auth}`,
      'Content-Type': 'application/json'
    });
  }

  async getWorkouts(startDate?: string, endDate?: string): Promise<IntervalsWorkout[]> {
    const headers = this.getHeaders();
    let url = `${this.baseUrl}/athlete/0/workouts`;
    
    if (startDate && endDate) {
      url += `?oldest=${startDate}&newest=${endDate}`;
    }

    const response = await fetch(url, { 
      headers,
      credentials: 'omit' // Importante per CORS
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  }

  async createWorkout(workout: Omit<IntervalsWorkout, 'id'>): Promise<IntervalsWorkout> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/0/workouts`, {
      method: 'POST',
      headers,
      credentials: 'omit',
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  }

  async updateWorkout(id: string, workout: Partial<IntervalsWorkout>): Promise<IntervalsWorkout> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/0/workouts/${id}`, {
      method: 'PUT',
      headers,
      credentials: 'omit',
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  }

  async getWorkoutHistory(limit: number = 10): Promise<IntervalsWorkout[]> {
    const headers = this.getHeaders();
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const oldest = thirtyDaysAgo.toISOString().split('T')[0];
    const newest = today.toISOString().split('T')[0];
    
    const response = await fetch(
      `${this.baseUrl}/athlete/0/workouts?oldest=${oldest}&newest=${newest}`, 
      { 
        headers,
        credentials: 'omit'
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  }
}

export default IntervalsService; 