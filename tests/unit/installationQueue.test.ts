import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstallationQueue } from '../../electron/services/InstallationQueue';
import { WingetService } from '../../electron/services/WingetService';
import { Software } from '../../src/types/software';

vi.mock('../../electron/services/SettingsService', () => ({
  SettingsService: {
    getInstance: () => ({
      getSettings: () => ({
        installation: {
          silent: true,
          acceptPackageAgreements: true,
          acceptSourceAgreements: true,
          stopOnError: false,
        },
      }),
      saveSettings: vi.fn(),
    }),
  },
}));

describe('InstallationQueue - Queue Lifecycle & Error Policies', () => {
  const dummyApp1: Software = {
    id: 'test-app-1',
    name: 'Test App 1',
    description: 'First test app',
    category: ['Utilities'],
    icon: '/icons/icon.svg',
    wingetId: 'Test.App1',
  };

  const dummyApp2: Software = {
    id: 'test-app-2',
    name: 'Test App 2',
    description: 'Second test app',
    category: ['Utilities'],
    icon: '/icons/icon.svg',
    wingetId: 'Test.App2',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects starting a queue with empty software list', async () => {
    const queue = InstallationQueue.getInstance();
    await expect(queue.startQueue([])).rejects.toThrow(/No software items provided/);
  });

  it('completes queue successfully when WingetService succeeds', async () => {
    const queue = InstallationQueue.getInstance();
    const wingetService = WingetService.getInstance();

    vi.spyOn(wingetService, 'install').mockResolvedValue({
      success: true,
      exitCode: 0,
      message: 'Installed successfully.',
      wasCancelled: false,
    });

    const summary = await queue.startQueue([dummyApp1, dummyApp2]);

    expect(summary.total).toBe(2);
    expect(summary.installed).toBe(2);
    expect(summary.failed).toBe(0);
    expect(queue.getState().isActive).toBe(false);
  });

  it('continues queue when first application fails and stopOnError is false', async () => {
    const queue = InstallationQueue.getInstance();
    const wingetService = WingetService.getInstance();

    vi.spyOn(wingetService, 'install')
      .mockResolvedValueOnce({
        success: false,
        exitCode: 1603,
        message: 'Fatal error.',
        wasCancelled: false,
      })
      .mockResolvedValueOnce({
        success: true,
        exitCode: 0,
        message: 'Installed successfully.',
        wasCancelled: false,
      });

    const summary = await queue.startQueue([dummyApp1, dummyApp2], { stopOnError: false });

    expect(summary.total).toBe(2);
    expect(summary.installed).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.skipped).toBe(0);
  });

  it('skips remaining applications when stopOnError is true', async () => {
    const queue = InstallationQueue.getInstance();
    const wingetService = WingetService.getInstance();

    vi.spyOn(wingetService, 'install').mockResolvedValueOnce({
      success: false,
      exitCode: 1603,
      message: 'Fatal error.',
      wasCancelled: false,
    });

    const summary = await queue.startQueue([dummyApp1, dummyApp2], { stopOnError: true });

    expect(summary.total).toBe(2);
    expect(summary.installed).toBe(0);
    expect(summary.failed).toBe(1);
    expect(summary.skipped).toBe(1);
  });
});
