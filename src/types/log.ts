export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'command';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}
