export interface Profile {
  id: string;
  name: string;
  nameEs?: string;
  description: string;
  descriptionEs?: string;
  icon?: string;
  softwareIds: string[];
  isDefault?: boolean;
  createdAt?: string;
}

export interface ProfileExportData {
  version: string;
  generator: string;
  exportedAt: string;
  profile: Profile;
}
