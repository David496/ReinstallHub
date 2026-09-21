import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  ChevronDown,
  Briefcase,
  Gamepad2,
  Code,
  Wrench,
  Palette,
  Sparkles,
  Plus,
  Upload,
  Download,
  Trash2,
  Check,
  HardDrive,
} from 'lucide-react';
import { Profile } from '../../types/profile';
import { useAppStore } from '../../store/applicationStore';

export const ProfileSelector: React.FC = () => {
  const {
    profiles,
    customProfiles,
    activeProfileId,
    applyProfile,
    deleteCustomProfile,
    exportProfile,
    importProfile,
    setIsSaveProfileModalOpen,
    selectedSoftwareIds,
    storageInfo,
    language,
    t,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getProfileIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-blue-500" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />;
      case 'Code':
        return <Code className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Wrench':
        return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
      case 'Palette':
        return <Palette className="w-3.5 h-3.5 text-pink-500" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-500" />;
      default:
        return <Bookmark className="w-3.5 h-3.5 text-win-primary" />;
    }
  };

  const handleSelectProfile = (profile: Profile) => {
    applyProfile(profile);
    setIsOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importProfile(text);
      if (result.success) {
        setIsOpen(false);
      } else {
        alert(t.profiles.invalidFile);
      }
    } catch {
      alert(t.profiles.invalidFile);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const defaultProfiles = profiles.filter((p) => p.isDefault);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Hidden File Input for JSON Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t.profiles.buttonTooltip}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all select-none ${
          activeProfileId
            ? 'bg-win-primary/15 text-win-primary border-win-primary/40 font-semibold shadow-xs'
            : 'bg-win-card border-win-border text-win-text hover:bg-win-border/40 hover:text-win-text'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5 text-win-primary" />
        <span>
          {activeProfile
            ? language === 'es' && activeProfile.nameEs
              ? activeProfile.nameEs
              : activeProfile.name
            : t.profiles.button}
        </span>
        <ChevronDown className={`w-3 h-3 text-win-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-72 rounded-xl bg-win-panel border border-win-border shadow-2xl z-50 overflow-hidden text-xs py-1 animate-fade-in divide-y divide-win-border/50">
          {/* Header */}
          <div className="px-3 py-1.5 bg-win-card/50 flex items-center justify-between">
            <span className="font-semibold text-win-text">{t.profiles.title}</span>
            <span className="text-[10px] text-win-muted font-mono">
              {profiles.length} total
            </span>
          </div>

          {/* Section: Default Factory Presets */}
          <div className="p-1 space-y-0.5">
            <div className="px-2 py-0.5 text-[10px] font-bold text-win-muted uppercase tracking-wider">
              {t.profiles.defaultPresets}
            </div>
            {defaultProfiles.map((profile) => {
              const isActive = activeProfileId === profile.id;
              const displayName = language === 'es' && profile.nameEs ? profile.nameEs : profile.name;
              const displayDesc = language === 'es' && profile.descriptionEs ? profile.descriptionEs : profile.description;

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                    isActive
                      ? 'bg-win-primary text-white font-medium shadow-xs'
                      : 'hover:bg-win-card text-win-text'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <div className="flex-shrink-0">
                      {getProfileIcon(profile.icon)}
                    </div>
                    <div className="truncate">
                      <div className="truncate font-medium leading-tight">
                        {displayName}
                      </div>
                      <div
                        className={`text-[10px] truncate max-w-[170px] ${
                          isActive ? 'text-white/80' : 'text-win-muted'
                        }`}
                      >
                        {displayDesc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-win-border/60 text-win-muted'
                      }`}
                    >
                      {profile.softwareIds.length}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section: Custom Profiles */}
          <div className="p-1 space-y-0.5">
            <div className="px-2 py-0.5 text-[10px] font-bold text-win-muted uppercase tracking-wider">
              {t.profiles.customProfiles}
            </div>

            {customProfiles.length === 0 ? (
              <div className="px-2 py-1.5 text-[11px] text-win-muted/70 italic text-center">
                {t.profiles.noCustomProfiles}
              </div>
            ) : (
              customProfiles.map((profile) => {
                const isActive = activeProfileId === profile.id;

                return (
                  <div
                    key={profile.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-win-primary text-white font-medium shadow-xs'
                        : 'hover:bg-win-card text-win-text'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectProfile(profile)}
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer pr-1"
                    >
                      <div className="flex-shrink-0">
                        {getProfileIcon(profile.icon)}
                      </div>
                      <div className="truncate">
                        <div className="truncate font-medium leading-tight">
                          {profile.name}
                        </div>
                        {profile.description && (
                          <div
                            className={`text-[10px] truncate max-w-[140px] ${
                              isActive ? 'text-white/80' : 'text-win-muted'
                            }`}
                          >
                            {profile.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-win-border/60 text-win-muted'
                        }`}
                      >
                        {profile.softwareIds.length}
                      </span>
                      {/* Export Profile Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportProfile(profile);
                        }}
                        title={t.profiles.exportProfile}
                        className={`p-1 rounded transition-colors ${
                          isActive
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-win-border text-win-muted hover:text-win-text'
                        }`}
                      >
                        <Download className="w-3 h-3" />
                      </button>

                      {/* Delete Profile Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(t.profiles.confirmDelete)) {
                            deleteCustomProfile(profile.id);
                          }
                        }}
                        title={t.profiles.deleteProfile}
                        className={`p-1 rounded transition-colors ${
                          isActive
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-red-500/20 text-win-muted hover:text-red-500'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Section: Profile Actions (Save Current & Import) */}
          <div className="p-1 space-y-0.5 bg-win-bg/30">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSaveProfileModalOpen(true);
              }}
              disabled={selectedSoftwareIds.size === 0}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
                selectedSoftwareIds.size === 0
                  ? 'opacity-50 cursor-not-allowed text-win-muted'
                  : 'hover:bg-win-primary/10 text-win-primary font-medium'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {t.profiles.saveCurrentSelection} ({selectedSoftwareIds.size})
              </span>
            </button>

            <button
              onClick={handleImportClick}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-win-card text-win-text transition-colors text-left"
            >
              <Upload className="w-3.5 h-3.5 text-win-muted" />
              <span>{t.profiles.importProfile}</span>
            </button>
          </div>

          {/* Footer: Storage / Portable Mode Status */}
          <div className="px-3 py-1.5 bg-win-card/70 flex items-center justify-between text-[10px] text-win-muted select-none">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <HardDrive className="w-3 h-3 text-win-primary flex-shrink-0" />
              <span className="truncate">
                {storageInfo?.isPortable
                  ? language === 'es'
                    ? 'Modo Portable (USB / Carpeta)'
                    : 'Portable Mode (USB / Folder)'
                  : language === 'es'
                  ? 'Almacenamiento Local'
                  : 'Local Storage'}
              </span>
            </div>
            <span className="font-mono text-[9px] text-emerald-500 font-semibold flex-shrink-0">
              {storageInfo?.isPortable
                ? language === 'es'
                  ? 'Auto-Guardado USB'
                  : 'Auto-Saved USB'
                : 'AppData'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
