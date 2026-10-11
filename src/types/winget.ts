export interface WingetInfo {
  isAvailable: boolean;
  version: string | null;
  architecture: string | null;
  platform: string;
  error?: string;
}

export interface WingetPackageInfo {
  id: string;
  name: string;
  version: string;
  publisher?: string;
  description?: string;
  homepage?: string;
  license?: string;
  installerType?: string;
}

export interface InstalledApplication {
  id: string;
  name: string;
  version: string;
  availableVersion?: string;
  source?: string;
}

export interface PackageUpgrade {
  id: string;
  name: string;
  currentVersion: string;
  availableVersion: string;
  source: string;
}

export interface WingetSearchResult {
  id: string;
  name: string;
  version: string;
  source: string;
}

export interface WingetInstallProgress {
  step: 'downloading_deps' | 'downloading_bundle' | 'installing' | 'verifying' | 'completed' | 'failed';
  percent: number;
  message: string;
  error?: string;
}

