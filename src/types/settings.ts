import { InstallationOptions } from './installation';
import { Language } from '../i18n/translations';
import { Profile } from './profile';

export interface AppSettings {
  language: Language;
  installation: InstallationOptions;
  appearance: {
    theme: 'dark' | 'light' | 'system';
  };
  logging: {
    detailedLogging: boolean;
    autoScroll: boolean;
    maxEntries: number;
  };
  lastSession?: {
    date: string;
    totalInstalled: number;
    totalFailed: number;
  };
  customProfiles?: Profile[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'es', // Default to Spanish as requested
  installation: {
    silent: true,
    acceptPackageAgreements: true,
    acceptSourceAgreements: true,
    stopOnError: false,
    versionChannel: 'stable',
    blockInstalled: true,
  },
  appearance: {
    theme: 'dark',
  },
  logging: {
    detailedLogging: true,
    autoScroll: true,
    maxEntries: 1000,
  },
};
