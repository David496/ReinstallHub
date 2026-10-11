import { exec } from 'child_process';
import { InstallationOptions } from '../../src/types/installation';

/**
 * Builds a sanitized, secure array of command arguments for WinGet.
 * Prevents command injection by avoiding shell concatenation.
 */
export function buildWingetInstallArgs(wingetId: string, options: InstallationOptions): string[] {
  // Strict alphanumeric & dot/dash validation for wingetId
  const sanitizedId = wingetId.trim();
  if (!/^[a-zA-Z0-9.\-_+]+$/.test(sanitizedId)) {
    throw new Error(`Invalid WinGet package ID format: "${wingetId}"`);
  }

  const args: string[] = ['install', '--id', sanitizedId, '--exact'];

  if (options.silent) {
    args.push('--silent');
  }

  if (options.acceptPackageAgreements) {
    args.push('--accept-package-agreements');
  }

  if (options.acceptSourceAgreements) {
    args.push('--accept-source-agreements');
  }

  return args;
}

/**
 * Safely terminates a process and its entire descendant child tree on Windows.
 * Uses taskkill /T /F to prevent orphaned installer processes.
 */
export function killProcessTree(pid: number): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      exec(`taskkill /pid ${pid} /T /F`, () => {
        // Exit code 0 or 128 (process not found/already exited) is normal
        resolve();
      });
    } else {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // Already dead
      }
      resolve();
    }
  });
}

/**
 * Builds arguments for WinGet upgrade.
 */
export function buildWingetUpgradeArgs(wingetId?: string, options?: Partial<InstallationOptions>): string[] {
  const args: string[] = ['upgrade'];

  if (wingetId) {
    const sanitizedId = wingetId.trim();
    if (!/^[a-zA-Z0-9.\-_+]+$/.test(sanitizedId)) {
      throw new Error(`Invalid WinGet package ID format: "${wingetId}"`);
    }
    args.push('--id', sanitizedId, '--exact');
  } else {
    args.push('--all');
  }

  if (options?.silent ?? true) {
    args.push('--silent');
  }
  if (options?.acceptPackageAgreements ?? true) {
    args.push('--accept-package-agreements');
  }
  if (options?.acceptSourceAgreements ?? true) {
    args.push('--accept-source-agreements');
  }

  return args;
}

/**
 * Builds arguments for WinGet package uninstallation.
 */
export function buildWingetUninstallArgs(wingetId: string): string[] {
  const sanitizedId = wingetId.trim();
  if (!/^[a-zA-Z0-9.\-_+]+$/.test(sanitizedId)) {
    throw new Error(`Invalid WinGet package ID format: "${wingetId}"`);
  }
  return ['uninstall', '--id', sanitizedId, '--exact', '--accept-source-agreements'];
}

/**
 * Parses stdout table from `winget upgrade`.
 */
export function parseWingetUpgrades(output: string): import('../../src/types/winget').PackageUpgrade[] {
  const lines = output.split(/\r?\n/);
  const upgrades: import('../../src/types/winget').PackageUpgrade[] = [];
  let headerPassed = false;

  for (const line of lines) {
    if (!headerPassed) {
      if (line.includes('---')) {
        headerPassed = true;
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\d+\s+(actualizaciones|upgrades|actualización|upgrade)/i.test(trimmed)) continue;

    const parts = trimmed.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 5) {
      upgrades.push({
        name: parts[0],
        id: parts[1],
        currentVersion: parts[2],
        availableVersion: parts[3],
        source: parts[4],
      });
    } else if (parts.length === 4) {
      // Check if parts[2] contains two versions separated by single space (e.g. "1.0.0 1.1.0")
      const versionSplit = parts[2].split(/\s+/);
      if (versionSplit.length === 2) {
        upgrades.push({
          name: parts[0],
          id: parts[1],
          currentVersion: versionSplit[0],
          availableVersion: versionSplit[1],
          source: parts[3],
        });
      } else {
        upgrades.push({
          name: parts[0],
          id: parts[1],
          currentVersion: parts[2],
          availableVersion: parts[3],
          source: 'winget',
        });
      }
    } else if (parts.length === 3) {
      const subParts = parts[2].split(/\s+/);
      if (subParts.length >= 2) {
        upgrades.push({
          name: parts[0],
          id: parts[1],
          currentVersion: subParts[0],
          availableVersion: subParts[1],
          source: subParts[2] || 'winget',
        });
      }
    }
  }

  return upgrades;
}

/**
 * Parses stdout table from `winget search`.
 */
export function parseWingetSearchResults(output: string): import('../../src/types/winget').WingetSearchResult[] {
  const lines = output.split(/\r?\n/);
  const results: import('../../src/types/winget').WingetSearchResult[] = [];
  let headerPassed = false;

  for (const line of lines) {
    if (!headerPassed) {
      if (line.includes('---')) {
        headerPassed = true;
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 4) {
      results.push({
        name: parts[0],
        id: parts[1],
        version: parts[2],
        source: parts[3],
      });
    } else if (parts.length === 3) {
      // Check if parts[2] contains "version source" separated by space (e.g. "1.2.3 winget")
      const lastSplit = parts[2].split(/\s+/);
      if (lastSplit.length === 2) {
        results.push({
          name: parts[0],
          id: parts[1],
          version: lastSplit[0],
          source: lastSplit[1],
        });
      } else {
        results.push({
          name: parts[0],
          id: parts[1],
          version: parts[2],
          source: 'winget',
        });
      }
    } else if (parts.length === 2) {
      results.push({
        name: parts[0],
        id: parts[1],
        version: 'Latest',
        source: 'winget',
      });
    }
  }

  return results;
}

