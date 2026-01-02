import { IntervalsCredentials, IntervalsWorkout, IntervalsAthlete, IntervalsActivity, IntervalsWellness, IntervalsStats } from '../types/intervals';

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

  // ==================== ATHLETE METHODS ====================

  /**
   * Ottiene il profilo dell'atleta autenticato
   */
  async getCurrentAthlete(): Promise<IntervalsAthlete> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete`, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Ottiene il profilo di un atleta specifico (se hai accesso come coach)
   */
  async getAthlete(athleteId: string | number): Promise<IntervalsAthlete> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}`, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Ottiene la lista degli atleti che il coach può gestire
   */
  async getAthletes(): Promise<IntervalsAthlete[]> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/athletes`, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ==================== WORKOUT METHODS ====================

  /**
   * Ottiene i workout per un atleta (default: atleta autenticato)
   */
  async getWorkouts(athleteId: string | number = 'i', startDate?: string, endDate?: string): Promise<IntervalsWorkout[]> {
    const headers = this.getHeaders();
    let url = `${this.baseUrl}/athlete/${athleteId}/workouts`;

    if (startDate && endDate) {
      url += `?oldest=${startDate}&newest=${endDate}`;
    }

    const response = await fetch(url, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Crea un nuovo workout per un atleta
   */
  async createWorkout(athleteId: string | number, workout: Omit<IntervalsWorkout, 'id'>): Promise<IntervalsWorkout> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}/workouts`, {
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

  /**
   * Aggiorna un workout esistente
   */
  async updateWorkout(athleteId: string | number, workoutId: string, workout: Partial<IntervalsWorkout>): Promise<IntervalsWorkout> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}/workouts/${workoutId}`, {
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

  /**
   * Elimina un workout
   */
  async deleteWorkout(athleteId: string | number, workoutId: string): Promise<void> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}/workouts/${workoutId}`, {
      method: 'DELETE',
      headers,
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Ottiene lo storico workout degli ultimi 30 giorni
   */
  async getWorkoutHistory(athleteId: string | number = 'i', limit: number = 10): Promise<IntervalsWorkout[]> {
    const headers = this.getHeaders();
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const oldest = thirtyDaysAgo.toISOString().split('T')[0];
    const newest = today.toISOString().split('T')[0];

    const response = await fetch(
      `${this.baseUrl}/athlete/${athleteId}/workouts?oldest=${oldest}&newest=${newest}`,
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

  // ==================== ACTIVITY METHODS ====================

  /**
   * Ottiene le attività completate per un atleta
   */
  async getActivities(athleteId: string | number, startDate?: string, endDate?: string): Promise<IntervalsActivity[]> {
    const headers = this.getHeaders();
    let url = `${this.baseUrl}/athlete/${athleteId}/activities`;

    if (startDate && endDate) {
      url += `?oldest=${startDate}&newest=${endDate}`;
    }

    const response = await fetch(url, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ==================== WELLNESS METHODS ====================

  /**
   * Ottiene i dati wellness per un atleta
   */
  async getWellness(athleteId: string | number, startDate?: string, endDate?: string): Promise<IntervalsWellness[]> {
    const headers = this.getHeaders();
    let url = `${this.baseUrl}/athlete/${athleteId}/wellness`;

    if (startDate && endDate) {
      url += `?oldest=${startDate}&newest=${endDate}`;
    }

    const response = await fetch(url, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ==================== STATS METHODS ====================

  /**
   * Ottiene le statistiche fitness per un atleta
   */
  async getStats(athleteId: string | number): Promise<IntervalsStats> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.baseUrl}/athlete/${athleteId}/fitness`, {
      headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      athleteId: typeof athleteId === 'string' ? 0 : athleteId,
      ...data
    };
  }
}

export default IntervalsService; 