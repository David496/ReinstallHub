import React, { useState } from 'react';
import { Bookmark, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { useAppStore } from '../../store/applicationStore';

export const SaveProfileModal: React.FC = () => {
  const {
    isSaveProfileModalOpen,
    setIsSaveProfileModalOpen,
    selectedSoftwareList,
    saveCustomProfile,
    t,
  } = useAppStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isSaveProfileModalOpen) return null;

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    setIsSaveProfileModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.profiles.nameRequired);
      return;
    }
    if (selectedSoftwareList.length === 0) {
      setError(t.profiles.noAppsSelectedWarning);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await saveCustomProfile(name.trim(), description.trim());
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-win-panel border border-win-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-win-border bg-win-card/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-win-primary/10 text-win-primary">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-win-text">
                {t.profiles.saveModalTitle}
              </h2>
              <p className="text-[11px] text-win-muted">
                {t.profiles.saveModalDesc}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-win-muted hover:text-win-text p-1 rounded-md hover:bg-win-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5 overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Name Field */}
          <div>
            <label className="block text-xs font-medium text-win-text mb-1">
              {t.profiles.profileName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.profiles.profileNamePlaceholder}
              className="w-full px-3 py-1.5 text-xs bg-win-bg border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary focus:ring-1 focus:ring-win-primary transition-all"
            />
          </div>

          {/* Profile Description Field */}
          <div>
            <label className="block text-xs font-medium text-win-text mb-1">
              {t.profiles.profileDesc}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.profiles.profileDescPlaceholder}
              className="w-full px-3 py-1.5 text-xs bg-win-bg border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary focus:ring-1 focus:ring-win-primary transition-all"
            />
          </div>

          {/* Included Apps Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-win-text">
                {t.profiles.selectedAppsCount}
              </span>
              <span className="text-[11px] font-bold text-win-primary bg-win-primary/10 px-1.5 py-0.5 rounded">
                {selectedSoftwareList.length} apps
              </span>
            </div>

            <div className="p-2 bg-win-bg/70 border border-win-border/70 rounded-md max-h-36 overflow-y-auto space-y-1 select-none">
              {selectedSoftwareList.length === 0 ? (
                <p className="text-xs text-win-muted italic text-center py-2">
                  {t.profiles.noAppsSelectedWarning}
                </p>
              ) : (
                selectedSoftwareList.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between text-xs py-0.5 px-1 rounded hover:bg-win-card/50"
                  >
                    <span className="font-medium text-win-text truncate max-w-[260px]">
                      {app.name}
                    </span>
                    <span className="text-[10px] text-win-muted font-mono">
                      ~{app.estimatedSize || 0} MB
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-win-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              {t.profiles.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving || !name.trim() || selectedSoftwareList.length === 0}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              {t.profiles.saveButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
