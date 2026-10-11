import { spawn, ChildProcess } from 'child_process';
import { Software } from '../../src/types/software';
import { InstallationOptions } from '../../src/types/installation';
import { InstalledApplication, PackageUpgrade, WingetSearchResult } from '../../src/types/winget';
import {
  buildWingetInstallArgs,
  buildWingetUpgradeArgs,
  buildWingetUninstallArgs,
  killProcessTree,
  parseWingetUpgrades,
  parseWingetSearchResults,
} from '../utils/commandUtils';
import { translateWingetExitCode } from '../utils/platformUtils';
import { LoggerService } from './LoggerService';

export class WingetService {
  private static instance: WingetService;
  private activeProcess: ChildProcess | null = null;
  private activeSoftware: Software | null = null;
  private isCancelled = false;
  private logger = LoggerService.getInstance();

  private constructor() {}

  public static getInstance(): WingetService {
    if (!WingetService.instance) {
      WingetService.instance = new WingetService();
    }
    return WingetService.instance;
  }

  public hasActiveProcess(): boolean {
    return this.activeProcess !== null;
  }

  public getActiveSoftware(): Software | null {
    return this.activeSoftware;
  }

  /**
   * Installs an application using WinGet and streams real-time stdout/stderr.
   */
  public async install(
    software: Software,
    options: InstallationOptions,
    onProgress?: (stream: 'stdout' | 'stderr', line: string) => void
  ): Promise<{ success: boolean; exitCode: number; message: string; wasCancelled: boolean }> {
    if (this.activeProcess) {
      throw new Error('Another installation is already in progress.');
    }

    this.isCancelled = false;
    this.activeSoftware = software;

    const args = buildWingetInstallArgs(software.wingetId, options);
    const commandStr = `winget ${args.join(' ')}`;
    this.logger.command(`Executing: ${commandStr}`);
    this.logger.info(`Starting installation of ${software.name} [${software.wingetId}]...`);

    return new Promise((resolve) => {
      let fullStdout = '';
      let fullStderr = '';

      try {
        const child = spawn('winget', args, {
          shell: false,
          windowsHide: false,
        });

        this.activeProcess = child;

        // Inactivity Watchdog to warn if an installer is stuck waiting for UAC/user input
        let lastOutputTime = Date.now();
        const STALL_TIMEOUT_MS = 2.5 * 60 * 1000; // 2.5 minutes
        const watchdogInterval = setInterval(() => {
          if (Date.now() - lastOutputTime >= STALL_TIMEOUT_MS && this.activeProcess) {
            this.logger.warning(
              `[${software.name}] Sin actividad reciente: El instalador podría estar solicitando permisos de Administrador (UAC) o confirmación interactiva en pantalla.`
            );
            if (onProgress) {
              onProgress('stderr', `⚠️ Esperando posible confirmación de permisos o instalador...`);
            }
          }
        }, 45 * 1000);

        const processOutput = (data: Buffer, stream: 'stdout' | 'stderr') => {
          lastOutputTime = Date.now();
          const text = data.toString();
          if (stream === 'stdout') {
            fullStdout += text;
          } else {
            fullStderr += text;
          }

          // Split into lines for streaming
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          for (const line of lines) {
            const cleanLine = line.trim();
            // Filter out carriage-return progress spam if any
            if (cleanLine) {
              if (stream === 'stdout') {
                this.logger.info(`[${software.name}] ${cleanLine}`);
              } else {
                this.logger.warning(`[${software.name}] ${cleanLine}`);
              }
              if (onProgress) {
                onProgress(stream, cleanLine);
              }
            }
          }
        };

        child.stdout?.on('data', (data) => processOutput(data, 'stdout'));
        child.stderr?.on('data', (data) => processOutput(data, 'stderr'));

        child.on('error', (err) => {
          clearInterval(watchdogInterval);
          this.activeProcess = null;
          this.activeSoftware = null;
          this.logger.error(`Process error for ${software.name}: ${err.message}`);
          resolve({
            success: false,
            exitCode: -1,
            message: `Process launch failed: ${err.message}`,
            wasCancelled: this.isCancelled,
          });
        });

        child.on('close', (code) => {
          clearInterval(watchdogInterval);
          this.activeProcess = null;
          this.activeSoftware = null;

          if (this.isCancelled) {
            this.logger.warning(`Installation of ${software.name} was cancelled.`);
            resolve({
              success: false,
              exitCode: code ?? -1,
              message: 'Installation was cancelled by user.',
              wasCancelled: true,
            });
            return;
          }

          const translation = translateWingetExitCode(code);
          if (translation.isSuccess) {
            this.logger.success(`${software.name} installed successfully!`);
          } else {
            this.logger.error(`Failed to install ${software.name}. ${translation.message} (Exit code: ${code})`);
          }

          resolve({
            success: translation.isSuccess,
            exitCode: code ?? 0,
            message: translation.message,
            wasCancelled: false,
          });
        });
      } catch (err: any) {
        this.activeProcess = null;
        this.activeSoftware = null;
        this.logger.error(`Exception during installation of ${software.name}: ${err.message}`);
        resolve({
          success: false,
          exitCode: -1,
          message: err.message,
          wasCancelled: false,
        });
      }
    });
  }

  /**
   * Terminates active winget process and its entire child process tree.
   */
  public async cancelCurrent(): Promise<void> {
    if (!this.activeProcess) {
      return;
    }

    this.isCancelled = true;
    const pid = this.activeProcess.pid;
    this.logger.warning(`Cancelling active installation (PID: ${pid})...`);

    if (pid) {
      await killProcessTree(pid);
    }
  }

  /**
   * Queries list of installed packages on the system using `winget list`.
   */
  public async getInstalledApps(): Promise<InstalledApplication[]> {
    return new Promise((resolve) => {
      try {
        const child = spawn('winget', ['list', '--accept-source-agreements', '--disable-interactivity'], {
          shell: true,
          windowsHide: true,
        });

        let output = '';

        child.stdout?.on('data', (data) => {
          output += data.toString();
        });

        child.on('close', (code) => {
          if (code !== 0) {
            resolve([]);
            return;
          }

          const lines = output.split(/\r?\n/);
          const apps: InstalledApplication[] = [];

          // Find header separator line (e.g. "-------------------")
          let headerPassed = false;

          for (const line of lines) {
            if (!headerPassed) {
              if (line.includes('---')) {
                headerPassed = true;
              }
              continue;
            }

            if (!line.trim()) continue;

            // Line format: Name ... Id ... Version ... Available ... Source
            // Match fields with multiple spaces
            const parts = line.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
              const name = parts[0];
              const id = parts[1];
              const version = parts[2] || '';
              const availableVersion = parts[3];
              const source = parts[4];

              apps.push({
                id,
                name,
                version,
                availableVersion,
                source,
              });
            }
          }

          resolve(apps);
        });

        child.on('error', () => {
          resolve([]);
        });
      } catch {
        resolve([]);
      }
    });
  }

  /**
   * Queries list of packages that have upgrades available using `winget upgrade`.
   */
  public async getUpgrades(): Promise<PackageUpgrade[]> {
    return new Promise((resolve) => {
      try {
        const child = spawn('winget', ['upgrade', '--accept-source-agreements', '--disable-interactivity'], {
          shell: true,
          windowsHide: true,
        });

        let output = '';

        child.stdout?.on('data', (data) => {
          output += data.toString();
        });

        child.on('close', () => {
          const upgrades = parseWingetUpgrades(output);
          resolve(upgrades);
        });

        child.on('error', (err) => {
          this.logger.error(`Error querying upgrades: ${err.message}`);
          resolve([]);
        });
      } catch (err: any) {
        this.logger.error(`Exception querying upgrades: ${err.message}`);
        resolve([]);
      }
    });
  }

  /**
   * Upgrades a single package by WinGet package ID.
   */
  public async upgradePackage(
    wingetId: string,
    options?: Partial<InstallationOptions>
  ): Promise<{ success: boolean; exitCode: number; message: string }> {
    const args = buildWingetUpgradeArgs(wingetId, options);
    this.logger.command(`Executing: winget ${args.join(' ')}`);
    this.logger.info(`Starting upgrade of ${wingetId}...`);

    return new Promise((resolve) => {
      try {
        const child = spawn('winget', args, {
          shell: false,
          windowsHide: false,
        });

        child.stdout?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.info(`[Upgrade ${wingetId}] ${line.trim()}`);
          }
        });

        child.stderr?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.warning(`[Upgrade ${wingetId}] ${line.trim()}`);
          }
        });

        child.on('close', (code) => {
          const translation = translateWingetExitCode(code);
          if (translation.isSuccess) {
            this.logger.success(`Package ${wingetId} upgraded successfully!`);
          } else {
            this.logger.error(`Failed to upgrade ${wingetId}. (Exit code: ${code})`);
          }
          resolve({
            success: translation.isSuccess,
            exitCode: code ?? 0,
            message: translation.message,
          });
        });

        child.on('error', (err) => {
          this.logger.error(`Process error upgrading ${wingetId}: ${err.message}`);
          resolve({
            success: false,
            exitCode: -1,
            message: err.message,
          });
        });
      } catch (err: any) {
        this.logger.error(`Exception upgrading ${wingetId}: ${err.message}`);
        resolve({
          success: false,
          exitCode: -1,
          message: err.message,
        });
      }
    });
  }

  /**
   * Upgrades all available packages on the system (`winget upgrade --all`).
   */
  public async upgradeAll(
    options?: Partial<InstallationOptions>
  ): Promise<{ success: boolean; exitCode: number; message: string }> {
    const args = buildWingetUpgradeArgs(undefined, options);
    this.logger.command(`Executing: winget ${args.join(' ')}`);
    this.logger.info(`Starting upgrade for all eligible packages...`);

    return new Promise((resolve) => {
      try {
        const child = spawn('winget', args, {
          shell: false,
          windowsHide: false,
        });

        child.stdout?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.info(`[Upgrade All] ${line.trim()}`);
          }
        });

        child.stderr?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.warning(`[Upgrade All] ${line.trim()}`);
          }
        });

        child.on('close', (code) => {
          const isSuccess = code === 0 || code === 3010;
          if (isSuccess) {
            this.logger.success(`All eligible packages upgraded successfully!`);
          } else {
            this.logger.warning(`Upgrade all process completed with code ${code}.`);
          }
          resolve({
            success: isSuccess,
            exitCode: code ?? 0,
            message: isSuccess ? 'All packages upgraded successfully.' : `Completed with exit code ${code}`,
          });
        });

        child.on('error', (err) => {
          this.logger.error(`Error in upgrade all: ${err.message}`);
          resolve({
            success: false,
            exitCode: -1,
            message: err.message,
          });
        });
      } catch (err: any) {
        this.logger.error(`Exception in upgrade all: ${err.message}`);
        resolve({
          success: false,
          exitCode: -1,
          message: err.message,
        });
      }
    });
  }

  /**
   * Uninstalls a package by WinGet ID.
   */
  public async uninstallPackage(
    wingetId: string
  ): Promise<{ success: boolean; exitCode: number; message: string }> {
    const args = buildWingetUninstallArgs(wingetId);
    this.logger.command(`Executing: winget ${args.join(' ')}`);
    this.logger.info(`Uninstalling package ${wingetId}...`);

    return new Promise((resolve) => {
      try {
        const child = spawn('winget', args, {
          shell: false,
          windowsHide: false,
        });

        child.stdout?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.info(`[Uninstall ${wingetId}] ${line.trim()}`);
          }
        });

        child.stderr?.on('data', (data) => {
          const lines = data.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            this.logger.warning(`[Uninstall ${wingetId}] ${line.trim()}`);
          }
        });

        child.on('close', (code) => {
          const isSuccess = code === 0 || code === 3010;
          if (isSuccess) {
            this.logger.success(`Package ${wingetId} uninstalled successfully.`);
          } else {
            this.logger.error(`Failed to uninstall ${wingetId}. (Exit code: ${code})`);
          }
          resolve({
            success: isSuccess,
            exitCode: code ?? 0,
            message: isSuccess ? 'Uninstalled successfully.' : `Uninstallation failed with exit code ${code}.`,
          });
        });

        child.on('error', (err) => {
          this.logger.error(`Process error uninstalling ${wingetId}: ${err.message}`);
          resolve({
            success: false,
            exitCode: -1,
            message: err.message,
          });
        });
      } catch (err: any) {
        this.logger.error(`Exception uninstalling ${wingetId}: ${err.message}`);
        resolve({
          success: false,
          exitCode: -1,
          message: err.message,
        });
      }
    });
  }

  /**
   * Searches live in the online WinGet community repository (`winget search <query>`).
   */
  public async searchOnline(query: string): Promise<WingetSearchResult[]> {
    const cleanQuery = query.trim().replace(/["`$;|&<>]/g, '');
    if (!cleanQuery || cleanQuery.length < 2) {
      return [];
    }

    this.logger.info(`Searching online in WinGet repository for: "${cleanQuery}"...`);

    return new Promise((resolve) => {
      try {
        const child = spawn('winget', ['search', cleanQuery, '--accept-source-agreements', '--disable-interactivity'], {
          shell: true,
          windowsHide: true,
        });

        let output = '';

        child.stdout?.on('data', (data) => {
          output += data.toString();
        });

        child.on('close', () => {
          const results = parseWingetSearchResults(output);
          this.logger.info(`Found ${results.length} results online for "${cleanQuery}".`);
          resolve(results);
        });

        child.on('error', (err) => {
          this.logger.error(`Error searching online for ${cleanQuery}: ${err.message}`);
          resolve([]);
        });
      } catch (err: any) {
        this.logger.error(`Exception searching online for ${cleanQuery}: ${err.message}`);
        resolve([]);
      }
    });
  }
}
