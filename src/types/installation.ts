import { Software } from './software';

export type InstallationStatus =
  | 'pending'
  | 'installing'
  | 'installed'
  | 'failed'
  | 'cancelled'
  | 'skipped';

export interface InstallationOptions {
  silent: boolean;
  acceptPackageAgreements: boolean;
  acceptSourceAgreements: boolean;
  stopOnError: boolean;
  versionChannel?: 'stable' | 'beta' | 'dev';
  blockInstalled?: boolean;
}

export interface InstallationTask {
  software: Software;
  status: InstallationStatus;
  exitCode?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  details?: string;
}

export interface QueueState {
  isActive: boolean;
  isPaused: boolean;
  currentTaskIndex: number;
  tasks: InstallationTask[];
  options: InstallationOptions;
  startedAt?: string;
  completedAt?: string;
}

export interface InstallationSummaryData {
  total: number;
  installed: number;
  failed: number;
  cancelled: number;
  skipped: number;
  durationMs: number;
  tasks: InstallationTask[];
}

export interface InstallationProfile {
  id: string;
  name: string;
  description?: string;
  softwareIds: string[];
}
