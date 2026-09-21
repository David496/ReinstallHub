import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Package,
  HardDrive,
  Clock,
  ArrowRight,
  RefreshCw,
  Download,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { useWinget } from '../hooks/useWinget';
import { useAppStore } from '../store/applicationStore';

export const Dashboard: React.FC = () => {
  const { wingetInfo, isLoadingWinget, refreshWinget, installedCount, refreshInstalledApps } =
    useWinget();
  const {
    softwareList,
    selectedSoftwareIds,
    setActiveTab,
    setIsConfirmModalOpen,
    settings,
    t,
  } = useAppStore();

  const isAvailable = wingetInfo?.isAvailable;
  const lastSession = settings.lastSession;

  const handleInstallSelected = () => {
    if (selectedSoftwareIds.size > 0) {
      setIsConfirmModalOpen(true);
    } else {
      setActiveTab('catalog');
    }
  };

  return (
    <div className="space-y-3.5 pb-4">
      <Header
        title={t.dashboard.title}
        description={t.dashboard.description}
        actions={
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              refreshWinget();
              refreshInstalledApps();
            }}
            isLoading={isLoadingWinget}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            {t.dashboard.refreshStatus}
          </Button>
        }
      />

      {/* Main Status Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* WinGet Status Card */}
        <div className="p-3 rounded-lg bg-win-panel border border-win-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-win-muted uppercase tracking-wider">
                {t.dashboard.wingetEngine}
              </span>
              {isAvailable ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAvailable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              )}
              <h3 className="text-lg font-bold text-win-text">
                {isAvailable ? t.dashboard.wingetAvailable : t.dashboard.wingetNotFound}
              </h3>
            </div>
            <p className="text-xs text-win-muted mt-1">
              {isAvailable
                ? `v${wingetInfo?.version || '1.0'} (${wingetInfo?.architecture || 'x64'})`
                : wingetInfo?.error || t.dashboard.wingetNotFound}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-win-border/50 text-[10px] text-win-muted">
            Platform: {wingetInfo?.platform || 'win32'}
          </div>
        </div>

        {/* Installed Applications Card */}
        <div className="p-3 rounded-lg bg-win-panel border border-win-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-win-muted uppercase tracking-wider">
                {t.dashboard.systemPackages}
              </span>
              <HardDrive className="w-3.5 h-3.5 text-win-accent" />
            </div>
            <h3 className="text-xl font-bold text-win-text">{installedCount}</h3>
            <p className="text-[11px] text-win-muted mt-0.5">
              {t.dashboard.systemPackagesDesc}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-win-border/50 text-[10px] text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            <span>{t.dashboard.syncedWithWinget}</span>
          </div>
        </div>

        {/* Available Catalog Card */}
        <div className="p-3 rounded-lg bg-win-panel border border-win-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-win-muted uppercase tracking-wider">
                {t.dashboard.curatedCatalog}
              </span>
              <Package className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-win-text">{softwareList.length}</h3>
            <p className="text-[11px] text-win-muted mt-0.5">
              {t.dashboard.curatedCatalogDesc}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-win-border/50 text-[10px] text-win-accent">
            {selectedSoftwareIds.size} {t.dashboard.currentlySelected}
          </div>
        </div>

        {/* Last Installation Card */}
        <div className="p-3 rounded-lg bg-win-panel border border-win-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-win-muted uppercase tracking-wider">
                {t.dashboard.lastInstallation}
              </span>
              <Clock className="w-3.5 h-3.5 text-win-muted" />
            </div>
            <h3 className="text-base font-bold text-win-text">
              {lastSession ? `${lastSession.totalInstalled} ${t.modals.installed}` : t.dashboard.noSessionYet}
            </h3>
            <p className="text-[11px] text-win-muted mt-0.5">
              {lastSession
                ? `${new Date(lastSession.date).toLocaleDateString()} (${lastSession.totalFailed} ${t.modals.failed.toLowerCase()})`
                : t.dashboard.runFirstQueue}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-win-border/50 text-[10px] text-win-muted">
            {lastSession ? t.dashboard.savedToHistory : t.dashboard.readyToStart}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-win-panel via-win-card to-win-panel border border-win-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-win-text">{t.dashboard.quickActions}</h2>
            <p className="text-[11px] text-win-muted mt-0.5">
              {t.dashboard.quickActionsDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refreshWinget()}
              icon={<Terminal className="w-3.5 h-3.5" />}
            >
              {t.dashboard.checkWinget}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveTab('catalog')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {t.dashboard.browseSoftware}
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={handleInstallSelected}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              {selectedSoftwareIds.size > 0
                ? `${t.dashboard.installSelected} (${selectedSoftwareIds.size})`
                : t.dashboard.selectSoftwareToInstall}
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended Essential Packages Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xs font-bold text-win-text uppercase tracking-wider">
              {t.dashboard.essentialPackages}
            </h2>
            <p className="text-[11px] text-win-muted">
              {t.dashboard.essentialPackagesDesc}
            </p>
          </div>
          <Button size="xs" variant="ghost" onClick={() => setActiveTab('catalog')}>
            {t.dashboard.viewAll} ({softwareList.length}) →
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {softwareList.filter((s) => s.recommended).slice(0, 4).map((app) => (
            <div
              key={app.id}
              onClick={() => setActiveTab('catalog')}
              className="p-2.5 rounded-lg bg-win-panel border border-win-border hover:border-win-primary/40 hover:bg-win-card transition-all cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-black/25 p-1 flex items-center justify-center border border-win-border/50 flex-shrink-0">
                <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-win-text truncate">{app.name}</h4>
                <p className="text-[10px] text-win-muted truncate">{app.publisher}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
