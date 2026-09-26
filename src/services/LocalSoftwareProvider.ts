import { Software, SoftwareProvider } from '../types/software';
import { electronApi, isElectron } from './electronApi';
import localSoftwareData from '../../data/software.json';

export class LocalSoftwareProvider implements SoftwareProvider {
  private cachedSoftware: Software[] | null = null;

  public async getAll(): Promise<Software[]> {
    if (this.cachedSoftware) {
      return this.cachedSoftware;
    }

    try {
      if (isElectron) {
        const software = await electronApi.software.getAll();
        if (software && software.length > 0) {
          this.cachedSoftware = software;
          return software;
        }
      }
    } catch {
      // Fall back to bundled JSON
    }

    this.cachedSoftware = localSoftwareData as Software[];
    return this.cachedSoftware;
  }

  public async search(query: string, category?: string): Promise<Software[]> {
    const all = await this.getAll();
    const cleanQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const cleanCategory = category && category !== 'All' ? category.toLowerCase() : null;

    return all.filter((app) => {
      // Filter by category if specified
      if (cleanCategory) {
        const hasCategory = app.category.some((cat) => cat.toLowerCase() === cleanCategory);
        if (!hasCategory) {
          return false;
        }
      }

      // If no query string, matches category check
      if (!cleanQuery) {
        return true;
      }

      const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      // Search by:
      // 1. Name
      // 2. Winget ID (e.g. "Microsoft.VisualStudioCode")
      // 3. Publisher
      // 4. Description (EN & ES)
      // 5. Tags
      // 6. Category names
      const nameMatch = norm(app.name).includes(cleanQuery);
      const idMatch = norm(app.wingetId).includes(cleanQuery) || norm(app.id).includes(cleanQuery);
      const publisherMatch = app.publisher ? norm(app.publisher).includes(cleanQuery) : false;
      const descMatch =
        norm(app.description).includes(cleanQuery) ||
        (app.descriptionEs ? norm(app.descriptionEs).includes(cleanQuery) : false);
      const tagMatch = app.tags ? app.tags.some((t) => norm(t).includes(cleanQuery)) : false;
      const categoryMatch = app.category.some((c) => norm(c).includes(cleanQuery));

      return nameMatch || idMatch || publisherMatch || descMatch || tagMatch || categoryMatch;
    });
  }

  public async getById(id: string): Promise<Software | null> {
    const all = await this.getAll();
    return all.find((app) => app.id === id || app.wingetId === id) || null;
  }
}

export const softwareProvider = new LocalSoftwareProvider();
