import { BrowserWindow } from 'electron';
import { Software } from '../../src/types/software';
import {
  InstallationOptions,
  InstallationStatus,
  InstallationSummaryData,
  InstallationTask,
  QueueState,
} from '../../src/types/installation';
import { WingetService } from './WingetService';
import { LoggerService } from './LoggerService';
import { SettingsService } from './SettingsService';

export class InstallationQueue {
  private static instance: InstallationQueue;
  private wingetService = WingetService.getInstance();
  private logger = LoggerService.getInstance();
  private settingsService = SettingsService.getInstance();
  private window: BrowserWindow | null = null;

  private state: QueueState = {
    isActive: false,
    isPaused: false,
    currentTaskIndex: -1,
    tasks: [],
    options: {
      silent: true,
      acceptPackageAgreements: true,
      acceptSourceAgreements: true,
      stopOnError: false,
    },
  };

  private cancelRequested = false;

  private constructor() {}

  public static getInstance(): InstallationQueue {
    if (!InstallationQueue.instance) {
      InstallationQueue.instance = new InstallationQueue();
    }
    return InstallationQueue.instance;
  }

  public setWindow(window: BrowserWindow | null) {
    this.window = window;
  }

  public getState(): QueueState {
    return { ...this.state, tasks: this.state.tasks.map((t) => ({ ...t })) };
  }

  private emitState(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('installation:state', this.getState());
    }
  }

  private emitTaskStatus(task: InstallationTask): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('installation:task-status', { ...task });
    }
  }

  /**
   * Starts sequential queue for the selected list of applications.
   */
  public async startQueue(
    softwareList: Software[],
    options?: Partial<InstallationOptions>
  ): Promise<InstallationSummaryData> {
    if (this.state.isActive) {
      throw new Error('An installation queue is already running.');
    }

    if (softwareList.length === 0) {
      throw new Error('No software items provided for installation.');
    }

    const currentOptions = {
      ...this.settingsService.getSettings().installation,
      ...(options || {}),
    };

    const tasks: InstallationTask[] = softwareList.map((software) => ({
      software,
      status: 'pending' as InstallationStatus,
    }));

    const startTime = Date.now();
    this.cancelRequested = false;
    this.state = {
      isActive: true,
      isPaused: false,
      currentTaskIndex: 0,
      tasks,
      options: currentOptions,
      startedAt: new Date().toISOString(),
    };

    this.logger.info(`=== Starting installation queue: ${softwareList.length} applications queued ===`);
    this.emitState();

    let installedCount = 0;
    let failedCount = 0;
    let cancelledCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < tasks.length; i++) {
      if (this.cancelRequested) {
        for (let j = i; j < tasks.length; j++) {
          tasks[j].status = 'cancelled';
          tasks[j].error = 'Installation cancelled by user.';
          cancelledCount++;
          this.emitTaskStatus(tasks[j]);
        }
        break;
      }

      this.state.currentTaskIndex = i;
      const currentTask = tasks[i];
      currentTask.status = 'installing';
      currentTask.startedAt = new Date().toISOString();
      this.emitState();
      this.emitTaskStatus(currentTask);

      this.logger.info(`[Queue ${i + 1}/${tasks.length}] Installing ${currentTask.software.name}...`);

      const result = await this.wingetService.install(
        currentTask.software,
        currentOptions,
        (stream, line) => {
          if (this.window && !this.window.isDestroyed()) {
            this.window.webContents.send('installation:stream', {
              softwareId: currentTask.software.id,
              stream,
              line,
            });
          }
        }
      );

      currentTask.completedAt = new Date().toISOString();
      currentTask.exitCode = result.exitCode;
      currentTask.details = result.message;

      if (result.wasCancelled || this.cancelRequested) {
        currentTask.status = 'cancelled';
        currentTask.error = 'Cancelled by user.';
        cancelledCount++;
        this.emitTaskStatus(currentTask);

        // Cancel all remaining tasks
        for (let j = i + 1; j < tasks.length; j++) {
          tasks[j].status = 'cancelled';
          tasks[j].error = 'Queue cancelled by user.';
          cancelledCount++;
          this.emitTaskStatus(tasks[j]);
        }
        break;
      } else if (result.success) {
        currentTask.status = 'installed';
        installedCount++;
      } else {
        currentTask.status = 'failed';
        currentTask.error = result.message;
        failedCount++;

        // Check stop-on-error policy
        if (currentOptions.stopOnError) {
          this.logger.error(`Stopping queue because an error occurred and stopOnError is enabled.`);
          for (let j = i + 1; j < tasks.length; j++) {
            tasks[j].status = 'skipped';
            tasks[j].error = 'Skipped because previous installation failed.';
            skippedCount++;
            this.emitTaskStatus(tasks[j]);
          }
          this.emitTaskStatus(currentTask);
          break;
        }
      }

      this.emitTaskStatus(currentTask);
      this.emitState();
    }

    const durationMs = Date.now() - startTime;
    this.state.isActive = false;
    this.state.completedAt = new Date().toISOString();
    this.emitState();

    const summary: InstallationSummaryData = {
      total: tasks.length,
      installed: installedCount,
      failed: failedCount,
      cancelled: cancelledCount,
      skipped: skippedCount,
      durationMs,
      tasks,
    };

    this.logger.info(
      `=== Installation Queue Finished in ${(durationMs / 1000).toFixed(1)}s: ` +
        `${installedCount} installed, ${failedCount} failed, ${cancelledCount} cancelled, ${skippedCount} skipped ===`
    );

    // Persist last session in settings
    this.settingsService.saveSettings({
      lastSession: {
        date: new Date().toISOString(),
        totalInstalled: installedCount,
        totalFailed: failedCount,
      },
    });

    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('installation:complete', summary);
    }

    return summary;
  }

  /**
   * Installs a single application using the unified queue manager.
   */
  public async installSingle(
    software: Software,
    options?: Partial<InstallationOptions>
  ): Promise<InstallationSummaryData> {
    return this.startQueue([software], options);
  }

  /**
   * Cancels the currently running installation and the entire queue.
   */
  public async cancel(): Promise<void> {
    if (!this.state.isActive) {
      return;
    }

    this.logger.warning('User requested queue cancellation.');
    this.cancelRequested = true;
    await this.wingetService.cancelCurrent();
    this.emitState();
  }
}
