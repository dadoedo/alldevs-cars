import fs from 'fs';
import path from 'path';

export function logSync(message: string, type: 'info' | 'error' | 'success' = 'info') {
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, `sync-${new Date().toISOString().split('T')[0]}.log`);
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

export function logError(message: string, error?: unknown) {
  logSync(`ERROR: ${message}${error ? ` - ${error instanceof Error ? error.message : String(error)}` : ''}`, 'error');
}

export function logSuccess(message: string) {
  logSync(`SUCCESS: ${message}`, 'success');
}

export function logInfo(message: string) {
  logSync(`INFO: ${message}`, 'info');
}
