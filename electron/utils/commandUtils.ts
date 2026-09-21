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
      exec(`taskkill /pid ${pid} /T /F`, (err) => {
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
