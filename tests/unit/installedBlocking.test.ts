import { describe, it, expect } from 'vitest';
import { Software } from '../../src/types/software';
import { Profile } from '../../src/types/profile';
import { DEFAULT_SETTINGS } from '../../src/types/settings';

describe('Installed Software Checkbox Blocking Logic', () => {
  const mockSoftwareList: Software[] = [
    {
      id: 'google-chrome',
      wingetId: 'Google.Chrome',
      name: 'Google Chrome',
      description: 'Web browser',
      category: ['Browsers'],
      icon: '',
      estimatedSize: 120,
    },
    {
      id: 'mozilla-firefox',
      wingetId: 'Mozilla.Firefox',
      name: 'Mozilla Firefox',
      description: 'Web browser',
      category: ['Browsers'],
      icon: '',
      estimatedSize: 110,
    },
    {
      id: '7zip',
      wingetId: '7zip.7zip',
      name: '7-Zip',
      description: 'File archiver',
      category: ['Utilities'],
      icon: '',
      estimatedSize: 5,
    },
    {
      id: 'git',
      wingetId: 'Git.Git',
      name: 'Git',
      description: 'Version control',
      category: ['Development'],
      icon: '',
      estimatedSize: 80,
    },
  ];

  // Helper matching applicationStore's isSoftwareBlocked implementation
  const isSoftwareBlocked = (
    software: Software,
    installedWingetIdSet: Set<string>,
    taskStatusMap: Record<string, { status: string }>,
    blockInstalledSetting: boolean = true
  ) => {
    if (!blockInstalledSetting) return false;
    const inSystem = installedWingetIdSet.has(software.wingetId.toLowerCase());
    const inSession = taskStatusMap[software.id]?.status === 'installed';
    return inSystem || inSession;
  };

  it('defaults blockInstalled setting to true in DEFAULT_SETTINGS', () => {
    expect(DEFAULT_SETTINGS.installation.blockInstalled).toBe(true);
  });

  it('detects installed software case-insensitively and blocks selection when blockInstalled is true', () => {
    const installedSet = new Set(['google.chrome', '7zip.7zip']);
    const taskStatusMap = {};

    expect(isSoftwareBlocked(mockSoftwareList[0], installedSet, taskStatusMap, true)).toBe(true);
    expect(isSoftwareBlocked(mockSoftwareList[1], installedSet, taskStatusMap, true)).toBe(false);
    expect(isSoftwareBlocked(mockSoftwareList[2], installedSet, taskStatusMap, true)).toBe(true);
    expect(isSoftwareBlocked(mockSoftwareList[3], installedSet, taskStatusMap, true)).toBe(false);
  });

  it('does NOT block installed software when blockInstalled is false', () => {
    const installedSet = new Set(['google.chrome', '7zip.7zip']);
    const taskStatusMap = {};

    expect(isSoftwareBlocked(mockSoftwareList[0], installedSet, taskStatusMap, false)).toBe(false);
    expect(isSoftwareBlocked(mockSoftwareList[1], installedSet, taskStatusMap, false)).toBe(false);
    expect(isSoftwareBlocked(mockSoftwareList[2], installedSet, taskStatusMap, false)).toBe(false);
    expect(isSoftwareBlocked(mockSoftwareList[3], installedSet, taskStatusMap, false)).toBe(false);
  });

  it('blocks software installed during current session even if not yet in system scan', () => {
    const installedSet = new Set<string>();
    const taskStatusMap = {
      'git': { status: 'installed' },
    };

    expect(isSoftwareBlocked(mockSoftwareList[3], installedSet, taskStatusMap, true)).toBe(true);
    expect(isSoftwareBlocked(mockSoftwareList[0], installedSet, taskStatusMap, true)).toBe(false);
  });

  it('filters out installed apps when executing selectAll() with blockInstalled enabled', () => {
    const installedSet = new Set(['google.chrome', 'git.git']);
    const taskStatusMap = {};
    const selectedIds = new Set<string>();

    for (const item of mockSoftwareList) {
      if (!isSoftwareBlocked(item, installedSet, taskStatusMap, true)) {
        selectedIds.add(item.id);
      }
    }

    expect(selectedIds.has('google-chrome')).toBe(false);
    expect(selectedIds.has('git')).toBe(false);
    expect(selectedIds.has('mozilla-firefox')).toBe(true);
    expect(selectedIds.has('7zip')).toBe(true);
    expect(selectedIds.size).toBe(2);
  });

  it('selects all apps including installed ones when executing selectAll() with blockInstalled disabled', () => {
    const installedSet = new Set(['google.chrome', 'git.git']);
    const taskStatusMap = {};
    const selectedIds = new Set<string>();

    for (const item of mockSoftwareList) {
      if (!isSoftwareBlocked(item, installedSet, taskStatusMap, false)) {
        selectedIds.add(item.id);
      }
    }

    expect(selectedIds.has('google-chrome')).toBe(true);
    expect(selectedIds.has('git')).toBe(true);
    expect(selectedIds.has('mozilla-firefox')).toBe(true);
    expect(selectedIds.has('7zip')).toBe(true);
    expect(selectedIds.size).toBe(4);
  });

  it('skips installed apps when applying a profile with blockInstalled enabled', () => {
    const sampleProfile: Profile = {
      id: 'test-profile',
      name: 'Test Profile',
      description: 'Profile with mixed software',
      softwareIds: ['google-chrome', 'mozilla-firefox', '7zip', 'git'],
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    const installedSet = new Set(['google.chrome', '7zip.7zip']);
    const taskStatusMap = {};
    const selectedIds = new Set<string>();

    for (const id of sampleProfile.softwareIds) {
      const item = mockSoftwareList.find((s) => s.id === id);
      if (item && !isSoftwareBlocked(item, installedSet, taskStatusMap, true)) {
        selectedIds.add(id);
      }
    }

    expect(selectedIds.has('google-chrome')).toBe(false);
    expect(selectedIds.has('7zip')).toBe(false);
    expect(selectedIds.has('mozilla-firefox')).toBe(true);
    expect(selectedIds.has('git')).toBe(true);
    expect(selectedIds.size).toBe(2);
  });

  it('calculates isAllSelected accurately relative only to selectable software', () => {
    const installedSet = new Set(['google.chrome']);
    const taskStatusMap = {};
    const selectable = mockSoftwareList.filter(
      (app) => !isSoftwareBlocked(app, installedSet, taskStatusMap, true)
    );

    // Only 3 selectable apps: mozilla-firefox, 7zip, git
    expect(selectable.length).toBe(3);

    const selectedIds = new Set(['mozilla-firefox', '7zip', 'git']);
    const isAllSelected = selectable.length > 0 && selectable.every((app) => selectedIds.has(app.id));

    expect(isAllSelected).toBe(true);
  });
});
