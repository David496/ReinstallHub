import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, CheckCircle2, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { electronApi } from '../../services/electronApi';
import { useWinget } from '../../hooks/useWinget';
import { useAppStore } from '../../store/applicationStore';

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { isWingetAvailable, wingetVersion } = useWinget();
  const { t, isElevated, relaunchElevated } = useAppStore();

  useEffect(() => {
    electronApi.app.isMaximized().then(setIsMaximized);
  }, []);

  const handleMinimize = () => electronApi.app.minimize();
  const handleMaximize = async () => {
    const state = await electronApi.app.maximize();
    setIsMaximized(state);
  };
  const handleClose = () => electronApi.app.close();

  return (
    <header className="h-10 bg-win-bg border-b border-win-border flex items-center justify-between px-3 select-none app-region-drag z-40 flex-shrink-0">
      {/* App Branding & Icon */}
      <div className="flex items-center gap-2.5">
        <img src="/icons/logo.png" alt="ReInstall Hub" className="w-5 h-5 rounded-full object-cover shadow-sm ring-1 ring-sky-500/30" />
        <span className="text-xs font-semibold text-win-text tracking-wide">
          ReInstall Hub <span className="text-win-muted font-normal">{t.titleBar.subtitle}</span>
        </span>
      </div>

      {/* Center: WinGet Status & Elevation Pill */}
      <div className="hidden sm:flex items-center gap-2 app-region-no-drag">
        {/* WinGet Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-win-panel/80">
          {isWingetAvailable ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">
                {t.titleBar.wingetAvailable} {wingetVersion ? `v${wingetVersion}` : ''}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">{t.titleBar.wingetNotFound}</span>
            </>
          )}
        </div>

        {/* Admin Elevation Status */}
        {isElevated ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500" title="Ejecutando con permisos elevados de Administrador">
            <ShieldCheck className="w-3 h-3" />
            <span>{t.titleBar.adminBadge}</span>
          </div>
        ) : (
          <button
            onClick={relaunchElevated}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 transition-colors cursor-pointer"
            title="Haz clic para reiniciar como Administrador y evitar pausas de UAC"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>{t.titleBar.relaunchAdmin}</span>
          </button>
        )}
      </div>

      {/* Windows 11 Caption Controls */}
      <div className="flex items-center app-region-no-drag -mr-3">
        <button
          onClick={handleMinimize}
          className="w-11 h-10 flex items-center justify-center text-win-muted hover:text-win-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title={t.titleBar.minimize}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-11 h-10 flex items-center justify-center text-win-muted hover:text-win-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title={isMaximized ? t.titleBar.restore : t.titleBar.maximize}
        >
          {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
        </button>
        <button
          onClick={handleClose}
          className="w-11 h-10 flex items-center justify-center text-win-muted hover:text-white hover:bg-red-600 transition-colors"
          title={t.titleBar.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
