import { describe, it, expect } from 'vitest';
import {
  buildWingetInstallArgs,
  buildWingetUpgradeArgs,
  buildWingetUninstallArgs,
  parseWingetUpgrades,
  parseWingetSearchResults,
} from '../../electron/utils/commandUtils';
import { InstallationOptions } from '../../src/types/installation';

describe('commandUtils - buildWingetInstallArgs', () => {
  const defaultOptions: InstallationOptions = {
    silent: true,
    acceptPackageAgreements: true,
    acceptSourceAgreements: true,
    stopOnError: false,
  };

  it('builds secure array arguments for valid package ID', () => {
    const args = buildWingetInstallArgs('Google.Chrome', defaultOptions);
    expect(args).toEqual([
      'install',
      '--id',
      'Google.Chrome',
      '--exact',
      '--silent',
      '--accept-package-agreements',
      '--accept-source-agreements',
    ]);
  });

  it('omits --silent when silent is false', () => {
    const args = buildWingetInstallArgs('Mozilla.Firefox', {
      ...defaultOptions,
      silent: false,
    });
    expect(args).not.toContain('--silent');
    expect(args).toContain('--accept-package-agreements');
  });

  it('omits agreement flags when disabled', () => {
    const args = buildWingetInstallArgs('7zip.7zip', {
      ...defaultOptions,
      acceptPackageAgreements: false,
      acceptSourceAgreements: false,
    });
    expect(args).not.toContain('--accept-package-agreements');
    expect(args).not.toContain('--accept-source-agreements');
  });

  it('rejects malicious injection attempts in wingetId', () => {
    expect(() => buildWingetInstallArgs('Google.Chrome; calc.exe', defaultOptions)).toThrow(
      /Invalid WinGet package ID format/
    );
    expect(() => buildWingetInstallArgs('Google.Chrome && whoami', defaultOptions)).toThrow(
      /Invalid WinGet package ID format/
    );
    expect(() => buildWingetInstallArgs('Google.Chrome | powershell', defaultOptions)).toThrow(
      /Invalid WinGet package ID format/
    );
    expect(() => buildWingetInstallArgs('Google.Chrome `dir`', defaultOptions)).toThrow(
      /Invalid WinGet package ID format/
    );
  });
});

describe('commandUtils - buildWingetUpgradeArgs & buildWingetUninstallArgs', () => {
  const defaultOptions: InstallationOptions = {
    silent: true,
    acceptPackageAgreements: true,
    acceptSourceAgreements: true,
    stopOnError: false,
  };

  it('builds upgrade args for a single specific package ID', () => {
    const args = buildWingetUpgradeArgs('Google.Chrome', defaultOptions);
    expect(args).toEqual([
      'upgrade',
      '--id',
      'Google.Chrome',
      '--exact',
      '--silent',
      '--accept-package-agreements',
      '--accept-source-agreements',
    ]);
  });

  it('builds upgrade args for all packages when wingetId is undefined', () => {
    const args = buildWingetUpgradeArgs(undefined, defaultOptions);
    expect(args).toEqual([
      'upgrade',
      '--all',
      '--silent',
      '--accept-package-agreements',
      '--accept-source-agreements',
    ]);
  });

  it('builds uninstall args with --exact and --accept-source-agreements', () => {
    const args = buildWingetUninstallArgs('Spotify.Spotify');
    expect(args).toEqual(['uninstall', '--id', 'Spotify.Spotify', '--exact', '--accept-source-agreements']);
  });

  it('rejects malicious injection attempts in upgrade & uninstall IDs', () => {
    expect(() => buildWingetUpgradeArgs('Malicious.Id; rm -rf', defaultOptions)).toThrow(
      /Invalid WinGet package ID format/
    );
    expect(() => buildWingetUninstallArgs('Malicious.Id && calc')).toThrow(
      /Invalid WinGet package ID format/
    );
  });
});

describe('commandUtils - parseWingetUpgrades & parseWingetSearchResults', () => {
  it('parses tabular winget upgrade output correctly', () => {
    const sampleOutput = `
Nombre                       Id                     Versión      Disponible  Origen
-----------------------------------------------------------------------------------
Google Chrome                Google.Chrome          120.0.6099.71 121.0.6167.85 winget
Discord                      Discord.Discord        1.0.9018     1.0.9020    winget
2 actualizaciones disponibles.
`;

    const result = parseWingetUpgrades(sampleOutput);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Google Chrome',
      id: 'Google.Chrome',
      currentVersion: '120.0.6099.71',
      availableVersion: '121.0.6167.85',
      source: 'winget',
    });
    expect(result[1]).toEqual({
      name: 'Discord',
      id: 'Discord.Discord',
      currentVersion: '1.0.9018',
      availableVersion: '1.0.9020',
      source: 'winget',
    });
  });

  it('returns empty array when no upgrades exist or output is empty', () => {
    expect(parseWingetUpgrades('')).toEqual([]);
    expect(parseWingetUpgrades('No se encontraron actualizaciones disponibles.')).toEqual([]);
  });

  it('parses tabular winget search output correctly', () => {
    const sampleSearchOutput = `
Nombre          Id                     Versión    Origen
--------------------------------------------------------
Spotify         Spotify.Spotify        1.2.31.120 winget
Spotify Studio  Spotify.Studio         2.0.1      msstore
`;

    const result = parseWingetSearchResults(sampleSearchOutput);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Spotify',
      id: 'Spotify.Spotify',
      version: '1.2.31.120',
      source: 'winget',
    });
    expect(result[1]).toEqual({
      name: 'Spotify Studio',
      id: 'Spotify.Studio',
      version: '2.0.1',
      source: 'msstore',
    });
  });

  it('returns empty array when search yields no results', () => {
    expect(parseWingetSearchResults('')).toEqual([]);
    expect(parseWingetSearchResults('No package found matching input criteria.')).toEqual([]);
  });
});
