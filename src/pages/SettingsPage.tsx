import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Checkbox } from '../components/common/Checkbox';
import { useAppStore } from '../store/applicationStore';
import { Check, Sliders, Moon, FileText, Trash2, Globe, RotateCcw } from 'lucide-react';
import { Language } from '../i18n/translations';
import { DEFAULT_SETTINGS } from '../types/settings';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, clearLogs, t, setLanguage } = useAppStore();
  const [savedToast, setSavedToast] = useState(false);

  const showSaveSuccess = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleResetDefaults = () => {
    updateSettings(DEFAULT_SETTINGS);
    showSaveSuccess();
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showSaveSuccess();
  };

  const handleInstallationChange = (key: string, value: any) => {
    updateSettings({
      installation: {
        ...settings.installation,
        [key]: value,
      },
    });
    showSaveSuccess();
  };

  const handleLoggingChange = (key: string, value: any) => {
    updateSettings({
      logging: {
        ...settings.logging,
        [key]: value,
      },
    });
    showSaveSuccess();
  };

  const handleAppearanceChange = (theme: 'dark' | 'light' | 'system') => {
    updateSettings({
      appearance: {
        theme,
      },
    });
    showSaveSuccess();
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <Header
        title={t.settings.title}
        description={t.settings.description}
        actions={
          savedToast && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> {t.settings.preferencesSaved}
            </span>
          )
        }
      />

      {/* Language Selection */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-win-border">
          <Globe className="w-4 h-4 text-win-primary" />
          <div>
            <h2 className="text-sm font-bold text-win-text">{t.settings.language}</h2>
            <p className="text-[11px] text-win-muted mt-0.5">{t.settings.languageDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => handleLanguageChange('es')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              settings.language === 'es'
                ? 'bg-win-primary text-white border-win-primary shadow-sm font-bold'
                : 'bg-win-card text-win-muted border-win-border hover:text-win-text hover:bg-win-cardHover'
            }`}
          >
            <span className="text-base">🇪🇸</span>
            <span>{t.settings.spanish} (Español)</span>
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              settings.language === 'en'
                ? 'bg-win-primary text-white border-win-primary shadow-sm font-bold'
                : 'bg-win-card text-win-muted border-win-border hover:text-win-text hover:bg-win-cardHover'
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span>{t.settings.english} (English)</span>
          </button>
        </div>
      </section>

      {/* Installation Settings */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-win-border">
          <Sliders className="w-4 h-4 text-win-primary" />
          <h2 className="text-sm font-bold text-win-text">{t.settings.installationPrefs}</h2>
        </div>

        <div className="space-y-3">
          <div>
            <Checkbox
              checked={settings.installation.silent}
              onChange={(val) => handleInstallationChange('silent', val)}
              label={
                <div>
                  <span className="text-xs font-semibold text-win-text">{t.settings.installSilentlyTitle}</span>
                  <p className="text-[11px] text-win-muted mt-0.5">
                    {t.settings.installSilentlyDesc}
                  </p>
                </div>
              }
            />
          </div>

          <div>
            <Checkbox
              checked={settings.installation.acceptPackageAgreements}
              onChange={(val) => handleInstallationChange('acceptPackageAgreements', val)}
              label={
                <div>
                  <span className="text-xs font-semibold text-win-text">{t.settings.acceptPackageAgreementsTitle}</span>
                  <p className="text-[11px] text-win-muted mt-0.5">
                    {t.settings.acceptPackageAgreementsDesc}
                  </p>
                </div>
              }
            />
          </div>

          <div>
            <Checkbox
              checked={settings.installation.acceptSourceAgreements}
              onChange={(val) => handleInstallationChange('acceptSourceAgreements', val)}
              label={
                <div>
                  <span className="text-xs font-semibold text-win-text">{t.settings.acceptSourceAgreementsTitle}</span>
                  <p className="text-[11px] text-win-muted mt-0.5">
                    {t.settings.acceptSourceAgreementsDesc}
                  </p>
                </div>
              }
            />
          </div>

          <div className="pt-2 border-t border-win-border/50">
            <Checkbox
              checked={settings.installation.stopOnError}
              onChange={(val) => handleInstallationChange('stopOnError', val)}
              label={
                <div>
                  <span className="text-xs font-semibold text-win-text">{t.settings.stopOnErrorTitle}</span>
                  <p className="text-[11px] text-win-muted mt-0.5">
                    {t.settings.stopOnErrorDesc}
                  </p>
                </div>
              }
            />
          </div>

          <div className="pt-2 border-t border-win-border/50">
            <Checkbox
              checked={settings.installation.blockInstalled ?? true}
              onChange={(val) => handleInstallationChange('blockInstalled', val)}
              label={
                <div>
                  <span className="text-xs font-semibold text-win-text">{t.settings.blockInstalledTitle}</span>
                  <p className="text-[11px] text-win-muted mt-0.5">
                    {t.settings.blockInstalledDesc}
                  </p>
                </div>
              }
            />
          </div>

          {/* Version Channel */}
          <div className="pt-2 border-t border-win-border/50">
            <label className="text-xs font-semibold text-win-text block mb-1">
              {t.settings.packageChannelTitle}
            </label>
            <p className="text-[11px] text-win-muted mb-2">
              {t.settings.packageChannelDesc}
            </p>
            <div className="flex items-center gap-2">
              {(['stable', 'beta', 'dev'] as const).map((channel) => (
                <button
                  key={channel}
                  onClick={() => handleInstallationChange('versionChannel', channel)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                    settings.installation.versionChannel === channel
                      ? 'bg-win-primary text-white border-win-primary shadow-sm font-semibold'
                      : 'bg-win-card text-win-muted border-win-border hover:text-win-text'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appearance Settings */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-win-border">
          <Moon className="w-4 h-4 text-win-accent" />
          <h2 className="text-sm font-bold text-win-text">{t.settings.appearance}</h2>
        </div>

        <div>
          <label className="text-xs font-semibold text-win-text block mb-1">{t.settings.theme}</label>
          <div className="flex items-center gap-2 mt-2">
            {(['dark', 'light', 'system'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleAppearanceChange(theme)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                  settings.appearance.theme === theme
                    ? 'bg-win-primary text-white border-win-primary shadow-sm font-semibold'
                    : 'bg-win-card text-win-muted border-win-border hover:text-win-text'
                }`}
              >
                {t.settings[theme as keyof typeof t.settings] || theme}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Logging Settings */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-win-border">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-win-text">{t.settings.loggingDiag}</h2>
        </div>

        <div className="space-y-3">
          <Checkbox
            checked={settings.logging.detailedLogging}
            onChange={(val) => handleLoggingChange('detailedLogging', val)}
            label={
              <div>
                <span className="text-xs font-semibold text-win-text">{t.settings.detailedLoggingTitle}</span>
                <p className="text-[11px] text-win-muted mt-0.5">
                  {t.settings.detailedLoggingDesc}
                </p>
              </div>
            }
          />

          <div className="pt-2 flex items-center justify-between border-t border-win-border/50">
            <div>
              <span className="text-xs font-semibold text-win-text">{t.settings.clearHistoryTitle}</span>
              <p className="text-[11px] text-win-muted mt-0.5">
                {t.settings.clearHistoryDesc}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={clearLogs}
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            >
              {t.settings.clearLogsBtn}
            </Button>
          </div>
        </div>
      </section>

      {/* Reset Defaults */}
      <section className="p-4 rounded-lg bg-win-panel border border-win-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-win-text flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-win-muted" />
            {t.settings.resetDefaultsTitle}
          </h2>
          <p className="text-[11px] text-win-muted mt-0.5">
            {t.settings.resetDefaultsDesc}
          </p>
        </div>

        <Button
          size="xs"
          variant="outline"
          onClick={handleResetDefaults}
          icon={<RotateCcw className="w-3 h-3" />}
          className="hover:border-rose-500/50 hover:text-rose-400"
        >
          {t.settings.resetDefaultsBtn}
        </Button>
      </section>
    </div>
  );
};
