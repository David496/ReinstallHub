import { exec } from 'child_process';

export function isWindows(): boolean {
  return process.platform === 'win32';
}

/**
 * Checks if the current process is running with Administrator / Elevated privileges.
 * On Windows, queries fltmc (Filter Manager Control), which returns exit code 0 if elevated.
 */
export function isProcessElevated(): Promise<boolean> {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') {
      resolve(process.getuid ? process.getuid() === 0 : false);
      return;
    }

    exec('fltmc', (error) => {
      resolve(!error);
    });
  });
}

export function translateWingetExitCode(code: number | null | undefined): { message: string; isSuccess: boolean; needsReboot?: boolean } {
  if (code === 0) {
    return { message: 'Installed successfully.', isSuccess: true };
  }
  if (code === 3010) {
    return { message: 'Installed successfully. A system restart is required to complete setup.', isSuccess: true, needsReboot: true };
  }
  if (code === 1641) {
    return { message: 'Installed successfully. System reboot initiated.', isSuccess: true, needsReboot: true };
  }

  // Common MSI & WinGet Exit Codes
  switch (code) {
    case -1073741510:
    case 1:
      return { message: 'Installation process was cancelled or interrupted.', isSuccess: false };
    case 5:
    case 0x80070005:
      return { message: 'Access denied. Administrator privileges (UAC) are required.', isSuccess: false };
    case 1602:
      return { message: 'Installation cancelled by user.', isSuccess: false };
    case 1603:
      return { message: 'A fatal error occurred during package installation.', isSuccess: false };
    case 1618:
      return { message: 'Another installation is currently in progress. Please wait for it to finish.', isSuccess: false };
    case 1619:
      return { message: 'The installation package could not be opened.', isSuccess: false };
    case -1978335215: // 0x8A150011
      return { message: 'Package not found in configured WinGet sources.', isSuccess: false };
    case -1978335189: // 0x8A15002B
      return { message: 'Source agreements must be accepted before installing.', isSuccess: false };
    case -1978335188: // 0x8A15002C
      return { message: 'Package agreements must be accepted before installing.', isSuccess: false };
    case -1978335212: // 0x8A150014
      return { message: 'Failed to download installer package. Check network connection.', isSuccess: false };
    case -1978335150: // 0x8A150052
      return { message: 'Installer hash verification failed (corrupted download).', isSuccess: false };
    case -1978335156: // 0x8A15004C
      return { message: 'The exact package version is already installed on this machine.', isSuccess: true };
    case -1978335231: // 0x8A150001
      return { message: 'Internal WinGet package manager error.', isSuccess: false };
    default:
      return { message: `Installation failed with exit code ${code}.`, isSuccess: false };
  }
}
