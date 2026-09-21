import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { SettingsService } from '../../electron/services/SettingsService';
import { DEFAULT_SETTINGS } from '../../src/types/settings';

describe('SettingsService - Configuration Options & Persistence', () => {
  let tempFilePath: string;
  let tempProfilesDir: string;
  let service: SettingsService;

  beforeEach(() => {
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `reinstall-hub-test-settings-${Date.now()}-${Math.random().toString(36).substring(7)}.json`);
    tempProfilesDir = path.join(tempDir, `reinstall-hub-test-profiles-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    service = (SettingsService as any).getInstance();
    (service as any).settingsPath = tempFilePath;
    (service as any).profilesDir = tempProfilesDir;
    (service as any).currentSettings = { ...DEFAULT_SETTINGS, customProfiles: [] };
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch {
        // ignore cleanup errors
      }
    }
    if (fs.existsSync(tempProfilesDir)) {
      try {
        fs.rmSync(tempProfilesDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    }
  });

  it('loads default settings with Spanish as initial language', () => {
    const settings = service.getSettings();
    expect(settings.language).toBe('es');
    expect(settings.installation.silent).toBe(true);
    expect(settings.installation.acceptPackageAgreements).toBe(true);
    expect(settings.installation.acceptSourceAgreements).toBe(true);
    expect(settings.installation.stopOnError).toBe(false);
    expect(settings.appearance.theme).toBe('dark');
  });

  it('updates and persists language option (Spanish / English)', () => {
    const updated = service.saveSettings({ language: 'en' });
    expect(updated.language).toBe('en');

    // Verify file written to disk
    expect(fs.existsSync(tempFilePath)).toBe(true);
    const diskContent = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    expect(diskContent.language).toBe('en');

    // Switch back to Spanish
    const reverted = service.saveSettings({ language: 'es' });
    expect(reverted.language).toBe('es');
    const diskContentReverted = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    expect(diskContentReverted.language).toBe('es');
  });

  it('updates installation preferences without overwriting other flags', () => {
    // Modify stopOnError only
    const updated = service.saveSettings({
      installation: {
        ...service.getSettings().installation,
        stopOnError: true,
      },
    });

    expect(updated.installation.stopOnError).toBe(true);
    expect(updated.installation.silent).toBe(true); // Should remain untouched
    expect(updated.installation.acceptPackageAgreements).toBe(true);

    const diskContent = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    expect(diskContent.installation.stopOnError).toBe(true);
    expect(diskContent.installation.silent).toBe(true);
  });

  it('updates appearance theme options (dark / light / system)', () => {
    service.saveSettings({ appearance: { theme: 'light' } });
    expect(service.getSettings().appearance.theme).toBe('light');

    service.saveSettings({ appearance: { theme: 'system' } });
    expect(service.getSettings().appearance.theme).toBe('system');

    service.saveSettings({ appearance: { theme: 'dark' } });
    expect(service.getSettings().appearance.theme).toBe('dark');
  });

  it('updates logging preferences', () => {
    service.saveSettings({
      logging: {
        detailedLogging: false,
        autoScroll: false,
        maxEntries: 500,
      },
    });

    const settings = service.getSettings();
    expect(settings.logging.detailedLogging).toBe(false);
    expect(settings.logging.autoScroll).toBe(false);
    expect(settings.logging.maxEntries).toBe(500);
  });

  it('persists last session installation metrics', () => {
    const now = new Date().toISOString();
    service.saveSettings({
      lastSession: {
        date: now,
        totalInstalled: 5,
        totalFailed: 1,
      },
    });

    const diskContent = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    expect(diskContent.lastSession.totalInstalled).toBe(5);
    expect(diskContent.lastSession.totalFailed).toBe(1);
    expect(diskContent.lastSession.date).toBe(now);
  });

  it('persists customProfiles to settings file and syncs individual profile json files', () => {
    const testProfile = {
      id: 'test-custom-1',
      name: 'Portable Office',
      description: 'Quick setup for portable drives',
      softwareIds: ['google-chrome', '7zip', 'vlc'],
      isDefault: false,
    };

    service.saveSettings({
      customProfiles: [testProfile],
    });

    // Verify main settings file has customProfiles
    const diskContent = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    expect(diskContent.customProfiles).toHaveLength(1);
    expect(diskContent.customProfiles[0].id).toBe('test-custom-1');

    // Verify profile file was generated in profilesDir
    const profileFilePath = path.join(tempProfilesDir, 'test-custom-1.json');
    expect(fs.existsSync(profileFilePath)).toBe(true);
    const profileFileContent = JSON.parse(fs.readFileSync(profileFilePath, 'utf8'));
    expect(profileFileContent.name).toBe('Portable Office');
    expect(profileFileContent.softwareIds).toEqual(['google-chrome', '7zip', 'vlc']);
  });

  it('scans and merges individual profile files from profiles directory on load', () => {
    // Manually create a profile file in tempProfilesDir
    if (!fs.existsSync(tempProfilesDir)) {
      fs.mkdirSync(tempProfilesDir, { recursive: true });
    }
    const externalProfile = {
      id: 'usb-imported-profile',
      name: 'USB Work Profile',
      description: 'Copied directly to USB folder',
      softwareIds: ['vscode', 'git'],
      isDefault: false,
    };
    fs.writeFileSync(
      path.join(tempProfilesDir, 'usb-imported-profile.json'),
      JSON.stringify(externalProfile, null, 2),
      'utf8'
    );

    // Call load and verify it discovers the external profile
    const loaded = (service as any).load();
    const found = loaded.customProfiles?.find((p: any) => p.id === 'usb-imported-profile');
    expect(found).toBeDefined();
    expect(found?.name).toBe('USB Work Profile');
    expect(found?.softwareIds).toEqual(['vscode', 'git']);
  });
});
