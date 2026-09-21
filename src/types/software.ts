export type CategoryType =
  | 'All'
  | 'Recommended'
  | 'Essential'
  | 'Office'
  | 'Browsers'
  | 'Utilities'
  | 'Media'
  | 'Graphics'
  | 'Development'
  | 'Communication'
  | 'Gaming'
  | 'Security';

export interface Software {
  id: string;
  name: string;
  description: string;
  descriptionEs?: string;
  publisher?: string;
  version?: string;
  category: string[];
  icon: string;
  wingetId: string;
  estimatedSize?: number; // Size in MB
  tags?: string[];
  recommended?: boolean;
}

export interface SoftwareProvider {
  getAll(): Promise<Software[]>;
  search(query: string, category?: string): Promise<Software[]>;
  getById(id: string): Promise<Software | null>;
}
