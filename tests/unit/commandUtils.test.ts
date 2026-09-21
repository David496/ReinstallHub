import { describe, it, expect } from 'vitest';
import { buildWingetInstallArgs } from '../../electron/utils/commandUtils';
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
