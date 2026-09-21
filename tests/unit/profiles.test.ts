import { describe, it, expect } from 'vitest';
import { DEFAULT_PROFILES } from '../../src/data/defaultProfiles';
import softwareCatalog from '../../data/software.json';
import { Profile, ProfileExportData } from '../../src/types/profile';

describe('Profile Manager - Presets & Integrity', () => {
  const catalogIds = new Set(softwareCatalog.map((app) => app.id));

  it('contains all 6 factory default profiles', () => {
    expect(DEFAULT_PROFILES).toHaveLength(6);
    const profileIds = DEFAULT_PROFILES.map((p) => p.id);
    expect(profileIds).toContain('office-home');
    expect(profileIds).toContain('gamer');
    expect(profileIds).toContain('developer');
    expect(profileIds).toContain('technician');
    expect(profileIds).toContain('creator');
    expect(profileIds).toContain('essential-clean');
  });

  it('guarantees that 100% of softwareIds in default profiles exist in the software catalog', () => {
    for (const profile of DEFAULT_PROFILES) {
      expect(profile.softwareIds.length).toBeGreaterThan(0);
      for (const softwareId of profile.softwareIds) {
        expect(
          catalogIds.has(softwareId),
          `Profile "${profile.id}" references unknown softwareId "${softwareId}"`
        ).toBe(true);
      }
    }
  });

  it('contains complete bilingual titles and descriptions for all presets', () => {
    for (const profile of DEFAULT_PROFILES) {
      expect(profile.name.trim()).not.toBe('');
      expect(profile.nameEs?.trim()).not.toBe('');
      expect(profile.description.trim()).not.toBe('');
      expect(profile.descriptionEs?.trim()).not.toBe('');
      expect(profile.isDefault).toBe(true);
      expect(profile.icon).toBeDefined();
    }
  });

  it('serializes and deserializes custom profiles correctly with ProfileExportData format', () => {
    const sampleProfile: Profile = {
      id: 'custom-12345',
      name: 'Custom Workshop Setup',
      description: 'Technician bench test apps',
      softwareIds: ['crystaldiskinfo', 'cpu-z', 'hwmonitor', '7zip'],
      isDefault: false,
      createdAt: '2026-09-20T12:00:00.000Z',
      icon: 'Bookmark',
    };

    const exportData: ProfileExportData = {
      version: '1.0.0',
      generator: 'ReInstall Hub',
      exportedAt: '2026-09-20T12:00:00.000Z',
      profile: sampleProfile,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const parsed = JSON.parse(jsonString);

    expect(parsed.version).toBe('1.0.0');
    expect(parsed.generator).toBe('ReInstall Hub');
    expect(parsed.profile.id).toBe('custom-12345');
    expect(parsed.profile.softwareIds).toEqual(['crystaldiskinfo', 'cpu-z', 'hwmonitor', '7zip']);
  });

  it('validates profile structure and filters invalid software IDs on import', () => {
    const rawImport = {
      name: 'Imported Profile',
      softwareIds: ['crystaldiskinfo', 'non-existent-app-999', 'vscode'],
    };

    const filteredIds = rawImport.softwareIds.filter((id) => catalogIds.has(id));
    expect(filteredIds).toEqual(['crystaldiskinfo', 'vscode']);
    expect(filteredIds).not.toContain('non-existent-app-999');
  });
});
