import { describe, it, expect } from 'vitest';
import { LocalSoftwareProvider } from '../../src/services/LocalSoftwareProvider';

describe('LocalSoftwareProvider - Catalog Search & Filtering', () => {
  const provider = new LocalSoftwareProvider();

  it('loads all catalog items', async () => {
    const all = await provider.getAll();
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it('searches accurately by software name', async () => {
    const results = await provider.search('Chrome');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((s) => s.name === 'Google Chrome')).toBe(true);
  });

  it('searches accurately by WinGet ID', async () => {
    const results = await provider.search('Microsoft.VisualStudioCode');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Visual Studio Code');
  });

  it('filters accurately by category', async () => {
    const devApps = await provider.search('', 'Development');
    expect(devApps.length).toBeGreaterThan(0);
    expect(devApps.every((a) => a.category.includes('Development'))).toBe(true);
  });

  it('searches by tag keyword', async () => {
    const archiveApps = await provider.search('zip');
    expect(archiveApps.some((s) => s.id === '7zip')).toBe(true);
  });

  it('searches by Spanish description or keywords', async () => {
    const officeApps = await provider.search('ofimatica');
    expect(officeApps.length).toBeGreaterThan(0);
    expect(officeApps.some((s) => s.id === 'onlyoffice' || s.id === 'libreoffice')).toBe(true);
  });

  it('finds requested Office and PDF Reader tools', async () => {
    const onlyOffice = await provider.getById('onlyoffice');
    const adobeReader = await provider.getById('adobe-reader');
    const pdfCreator = await provider.getById('pdfcreator');
    expect(onlyOffice).not.toBeNull();
    expect(adobeReader).not.toBeNull();
    expect(pdfCreator).not.toBeNull();
    expect(adobeReader?.wingetId).toBe('Adobe.Acrobat.Reader.64-bit');
  });

  it('returns empty array when no software matches', async () => {
    const emptyResults = await provider.search('xyz999nonexistentapp');
    expect(emptyResults).toEqual([]);
  });
});
