import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { AppSettings, DEFAULT_SETTINGS } from '../../src/types/settings';
import { Profile } from '../../src/types/profile';
import { LoggerService } from './LoggerService';

export class SettingsService {
  private static instance: SettingsService;
  private settingsPath: string;
  private profilesDir: string;
  private isPortable: boolean;
  private currentSettings: AppSettings;
  private logger = LoggerService.getInstance();

  private constructor(customPath?: string) {
    const storage = this.detectStoragePaths(customPath);
    this.settingsPath = storage.settingsPath;
    this.profilesDir = storage.profilesDir;
    this.isPortable = storage.isPortable;
    this.currentSettings = this.load();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private detectStoragePaths(customPath?: string): { settingsPath: string; profilesDir: string; isPortable: boolean } {
    if (customPath) {
      const baseDir = path.dirname(customPath);
      return {
        settingsPath: customPath,
        profilesDir: path.join(baseDir, 'profiles'),
        isPortable: false,
      };
    }

    // Determine application execution directory (respecting electron-builder portable environment)
    const appDir = process.env.PORTABLE_EXECUTABLE_DIR || (app?.isPackaged ? path.dirname(process.execPath) : process.cwd());
    const isProgramFiles = appDir.toLowerCase().includes('program files');

    let canWriteToAppDir = false;
    const portableProfilesDir = path.join(appDir, 'profiles');
    const portableSettingsPath = path.join(appDir, 'reinstall-hub-settings.json');

    // If not in restricted Program Files, check if we can write to appDir
    if (!isProgramFiles) {
      try {
        if (!fs.existsSync(portableProfilesDir)) {
          fs.mkdirSync(portableProfilesDir, { recursive: true });
        }
        const testFile = path.join(portableProfilesDir, '.write-test');
        fs.writeFileSync(testFile, 'ok', 'utf8');
        fs.unlinkSync(testFile);
        canWriteToAppDir = true;
      } catch {
        canWriteToAppDir = false;
      }
    }

    if (canWriteToAppDir) {
      return {
        settingsPath: portableSettingsPath,
        profilesDir: portableProfilesDir,
        isPortable: true,
      };
    }

    // Fallback to standard AppData directory
    const userDataDir = app?.getPath ? app.getPath('userData') : (process.env.APPDATA || process.cwd());
    const userDataProfilesDir = path.join(userDataDir, 'profiles');
    try {
      if (!fs.existsSync(userDataProfilesDir)) {
        fs.mkdirSync(userDataProfilesDir, { recursive: true });
      }
    } catch {
      // ignore
    }

    return {
      settingsPath: path.join(userDataDir, 'reinstall-hub-settings.json'),
      profilesDir: userDataProfilesDir,
      isPortable: false,
    };
  }

  public getStorageInfo(): { isPortable: boolean; storagePath: string; profilesPath: string } {
    return {
      isPortable: this.isPortable,
      storagePath: this.settingsPath,
      profilesPath: this.profilesDir,
    };
  }

  private load(): AppSettings {
    let settings: AppSettings = { ...DEFAULT_SETTINGS };

    // 1. Load from main settings file
    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, 'utf8');
        const parsed = JSON.parse(data);
        settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          installation: {
            ...DEFAULT_SETTINGS.installation,
            ...(parsed.installation || {}),
          },
          appearance: {
            ...DEFAULT_SETTINGS.appearance,
            ...(parsed.appearance || {}),
          },
          logging: {
            ...DEFAULT_SETTINGS.logging,
            ...(parsed.logging || {}),
          },
          customProfiles: parsed.customProfiles || [],
        };
      }
    } catch (err: any) {
      this.logger.error(`Failed to load settings file: ${err.message}`);
    }

    // 2. Scan and merge any individual profile JSON files in profilesDir
    try {
      if (this.profilesDir && fs.existsSync(this.profilesDir)) {
        const profileFiles = fs.readdirSync(this.profilesDir).filter((f) => f.endsWith('.json'));
        const existingMap = new Map<string, Profile>();
        (settings.customProfiles || []).forEach((p) => existingMap.set(p.id, p));

        for (const file of profileFiles) {
          try {
            const filePath = path.join(this.profilesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            const profile: Profile = parsed.profile || parsed;
            if (profile && profile.id && profile.name && Array.isArray(profile.softwareIds)) {
              existingMap.set(profile.id, profile);
            }
          } catch {
            // Ignore corrupted individual profile files
          }
        }

        settings.customProfiles = Array.from(existingMap.values());
      }
    } catch (err: any) {
      this.logger.error(`Failed to scan portable profiles directory: ${err.message}`);
    }

    return settings;
  }

  public getSettings(): AppSettings {
    return this.currentSettings;
  }

  public saveSettings(newSettings: Partial<AppSettings>): AppSettings {
    try {
      this.currentSettings = {
        ...this.currentSettings,
        ...newSettings,
        installation: {
          ...this.currentSettings.installation,
          ...(newSettings.installation || {}),
        },
        appearance: {
          ...this.currentSettings.appearance,
          ...(newSettings.appearance || {}),
        },
        logging: {
          ...this.currentSettings.logging,
          ...(newSettings.logging || {}),
        },
        customProfiles: newSettings.customProfiles !== undefined
          ? newSettings.customProfiles
          : this.currentSettings.customProfiles,
      };

      // Ensure directory exists
      const targetDir = path.dirname(this.settingsPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.writeFileSync(this.settingsPath, JSON.stringify(this.currentSettings, null, 2), 'utf8');

      // Sync custom profiles to individual JSON files in profilesDir
      if (newSettings.customProfiles !== undefined && this.profilesDir) {
        try {
          if (!fs.existsSync(this.profilesDir)) {
            fs.mkdirSync(this.profilesDir, { recursive: true });
          }

          const currentIds = new Set<string>();
          for (const profile of newSettings.customProfiles) {
            currentIds.add(profile.id);
            const profileFileName = `${profile.id}.json`;
            const profileFilePath = path.join(this.profilesDir, profileFileName);
            fs.writeFileSync(profileFilePath, JSON.stringify(profile, null, 2), 'utf8');
          }

          // Clean up deleted profiles from profilesDir
          const existingFiles = fs.readdirSync(this.profilesDir).filter((f) => f.endsWith('.json'));
          for (const file of existingFiles) {
            const baseId = file.replace(/\.json$/, '');
            if (!currentIds.has(baseId)) {
              try {
                fs.unlinkSync(path.join(this.profilesDir, file));
              } catch {
                // ignore unlink errors
              }
            }
          }
        } catch (syncErr: any) {
          this.logger.error(`Failed to sync portable profiles files: ${syncErr.message}`);
        }
      }

      this.logger.info(`Settings saved successfully (portable: ${this.isPortable}).`);
    } catch (err: any) {
      this.logger.error(`Failed to save settings: ${err.message}`);
    }
    return this.currentSettings;
  }
}
