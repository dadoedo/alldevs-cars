import cron from 'node-cron';
import { logSync } from './logger';

// Schedule sync every day at 7:00 AM
const SYNC_CRON_SCHEDULE = '0 7 * * *'; // Every day at 7:00 AM

export function startCronJobs() {
  // Sync cars from feed
  cron.schedule(SYNC_CRON_SCHEDULE, async () => {
    logSync('Starting scheduled sync...');
    
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sync-cars?key=${process.env.SYNC_SECRET_KEY}&type=cron`);
      
      if (response.ok) {
        const result = await response.json();
        logSync(`Scheduled sync completed: ${result.added} added, ${result.updated} updated, ${result.deleted} deleted, ${result.errors} errors`);
      } else {
        logSync('Scheduled sync failed', 'error');
      }
    } catch (error) {
      logSync(`Scheduled sync error: ${error}`, 'error');
    }
  }, {
    timezone: "Europe/Bratislava"
  });
  
  logSync('Cron jobs started');
}

export function stopCronJobs() {
  cron.getTasks().forEach(task => {
    task.stop();
  });
  logSync('Cron jobs stopped');
}
