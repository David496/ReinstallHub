import { BrowserWindow } from 'electron';
import { LogEntry, LogLevel } from '../../src/types/log';

export class LoggerService {
  private static instance: LoggerService;
  private entries: LogEntry[] = [];
  private maxEntries = 2000;
  private window: BrowserWindow | null = null;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public setWindow(window: BrowserWindow | null) {
    this.window = window;
  }

  private formatTime(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  public log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: this.formatTime(),
      level,
      message,
      data,
    };

    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    // Print to Node stdout for development debugging
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
    if (level === 'error') {
      console.error(prefix, message, data || '');
    } else {
      console.log(prefix, message, data || '');
    }

    // Push to renderer in real-time
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('log:entry', entry);
    }
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public success(message: string, data?: any) {
    this.log('success', message, data);
  }

  public warning(message: string, data?: any) {
    this.log('warning', message, data);
  }

  public error(message: string, data?: any) {
    this.log('error', message, data);
  }

  public command(message: string, data?: any) {
    this.log('command', message, data);
  }

  public getAll(): LogEntry[] {
    return [...this.entries];
  }

  public clear(): void {
    this.entries = [];
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('log:cleared');
    }
  }

  public formatForExport(): string {
    return this.entries
      .map((e) => `[${e.timestamp}] [${e.level.toUpperCase()}] ${e.message}`)
      .join('\r\n');
  }
}
