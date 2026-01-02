import { IntervalsWorkout, IntervalsAthlete, IntervalsActivity } from '../types/intervals';

/**
 * Servizio per gestire webhook da/verso n8n
 * Questo servizio può essere utilizzato per:
 * 1. Inviare dati a n8n quando succedono eventi (nuovo workout, completamento, ecc.)
 * 2. Ricevere dati da n8n per automazioni
 */

export interface N8nWebhookPayload {
  event: string;
  timestamp: string;
  data: any;
}

export interface N8nWorkoutCreatedPayload extends N8nWebhookPayload {
  event: 'workout.created';
  data: {
    athlete: IntervalsAthlete;
    workout: IntervalsWorkout;
  };
}

export interface N8nWorkoutCompletedPayload extends N8nWebhookPayload {
  event: 'workout.completed';
  data: {
    athlete: IntervalsAthlete;
    workout: IntervalsWorkout;
    activity: IntervalsActivity;
  };
}

export interface N8nAthleteStatsPayload extends N8nWebhookPayload {
  event: 'stats.updated';
  data: {
    athlete: IntervalsAthlete;
    stats: {
      fitness: number;
      fatigue: number;
      form: number;
      weeklyDistance: number;
      weeklyDuration: number;
    };
  };
}

class N8nWebhookService {
  private webhookUrls: Map<string, string>;

  constructor() {
    // Configurazione URL webhook n8n
    // Questi possono essere configurati tramite variabili d'ambiente
    this.webhookUrls = new Map([
      ['workout.created', import.meta.env.VITE_N8N_WEBHOOK_WORKOUT_CREATED || ''],
      ['workout.completed', import.meta.env.VITE_N8N_WEBHOOK_WORKOUT_COMPLETED || ''],
      ['stats.updated', import.meta.env.VITE_N8N_WEBHOOK_STATS_UPDATED || ''],
      ['athlete.registered', import.meta.env.VITE_N8N_WEBHOOK_ATHLETE_REGISTERED || ''],
    ]);
  }

  /**
   * Configura un URL webhook per un evento specifico
   */
  setWebhookUrl(event: string, url: string): void {
    this.webhookUrls.set(event, url);
  }

  /**
   * Invia un payload a n8n
   */
  private async sendToN8n(event: string, data: any): Promise<boolean> {
    const webhookUrl = this.webhookUrls.get(event);

    if (!webhookUrl) {
      console.warn(`No webhook URL configured for event: ${event}`);
      return false;
    }

    try {
      const payload: N8nWebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`N8n webhook failed: ${response.status}`);
      }

      console.log(`Successfully sent ${event} to n8n`);
      return true;
    } catch (error) {
      console.error(`Error sending to n8n:`, error);
      return false;
    }
  }

  /**
   * Notifica n8n della creazione di un nuovo workout
   */
  async notifyWorkoutCreated(athlete: IntervalsAthlete, workout: IntervalsWorkout): Promise<boolean> {
    return this.sendToN8n('workout.created', {
      athlete,
      workout
    });
  }

  /**
   * Notifica n8n del completamento di un workout
   */
  async notifyWorkoutCompleted(
    athlete: IntervalsAthlete,
    workout: IntervalsWorkout,
    activity: IntervalsActivity
  ): Promise<boolean> {
    return this.sendToN8n('workout.completed', {
      athlete,
      workout,
      activity
    });
  }

  /**
   * Notifica n8n dell'aggiornamento delle statistiche
   */
  async notifyStatsUpdated(athlete: IntervalsAthlete, stats: any): Promise<boolean> {
    return this.sendToN8n('stats.updated', {
      athlete,
      stats
    });
  }

  /**
   * Notifica n8n della registrazione di un nuovo atleta
   */
  async notifyAthleteRegistered(athlete: IntervalsAthlete): Promise<boolean> {
    return this.sendToN8n('athlete.registered', {
      athlete
    });
  }

  /**
   * Riceve dati da un webhook n8n
   * Questo metodo può essere chiamato quando n8n invia dati alla tua app
   */
  async handleIncomingWebhook(payload: N8nWebhookPayload): Promise<void> {
    console.log('Received webhook from n8n:', payload.event);

    switch (payload.event) {
      case 'external.workout.import':
        // Gestisci l'import di workout esterni
        await this.handleExternalWorkoutImport(payload.data);
        break;

      case 'external.stats.sync':
        // Gestisci la sincronizzazione di statistiche esterne
        await this.handleExternalStatsSync(payload.data);
        break;

      case 'notification.send':
        // Gestisci l'invio di notifiche
        await this.handleNotificationSend(payload.data);
        break;

      default:
        console.warn(`Unknown webhook event: ${payload.event}`);
    }
  }

  private async handleExternalWorkoutImport(data: any): Promise<void> {
    // Implementa la logica per importare workout da fonti esterne
    console.log('Importing external workout:', data);
  }

  private async handleExternalStatsSync(data: any): Promise<void> {
    // Implementa la logica per sincronizzare statistiche
    console.log('Syncing external stats:', data);
  }

  private async handleNotificationSend(data: any): Promise<void> {
    // Implementa la logica per inviare notifiche
    console.log('Sending notification:', data);
  }

  /**
   * Crea un endpoint Express/API per ricevere webhook
   * Esempio di utilizzo in un backend Express:
   *
   * app.post('/api/webhooks/n8n', async (req, res) => {
   *   try {
   *     await n8nService.handleIncomingWebhook(req.body);
   *     res.json({ success: true });
   *   } catch (error) {
   *     res.status(500).json({ error: error.message });
   *   }
   * });
   */
}

export default N8nWebhookService;

/**
 * Esempi di configurazione n8n:
 *
 * 1. WORKOUT CREATED WEBHOOK:
 *    - URL: https://your-n8n-instance.com/webhook/workout-created
 *    - Può triggare flussi come:
 *      * Inviare email di conferma all'atleta
 *      * Aggiungere evento a Google Calendar
 *      * Notificare su Slack/Teams
 *
 * 2. WORKOUT COMPLETED WEBHOOK:
 *    - URL: https://your-n8n-instance.com/webhook/workout-completed
 *    - Può triggare flussi come:
 *      * Aggiornare statistiche in Google Sheets
 *      * Inviare congratulazioni all'atleta
 *      * Analizzare performance e suggerire next steps
 *
 * 3. STATS UPDATED WEBHOOK:
 *    - URL: https://your-n8n-instance.com/webhook/stats-updated
 *    - Può triggare flussi come:
 *      * Generare report settimanali/mensili
 *      * Aggiornare dashboard Notion/Airtable
 *      * Alert se fitness/forma scendono sotto soglia
 *
 * 4. INCOMING WEBHOOKS (da n8n alla tua app):
 *    - Puoi creare un endpoint /api/webhooks/n8n
 *    - n8n può inviare dati per:
 *      * Importare workout da altre piattaforme
 *      * Sincronizzare dati di terze parti
 *      * Triggare azioni nella tua app
 */

/**
 * Esempio di flusso n8n per workout creato:
 *
 * 1. Webhook Trigger (riceve workout.created)
 * 2. Split Into Items (separa i dati)
 * 3. Gmail Node (invia email all'atleta)
 * 4. Google Calendar Node (aggiunge evento)
 * 5. Slack Node (notifica il coach)
 * 6. Airtable Node (salva in database)
 */
