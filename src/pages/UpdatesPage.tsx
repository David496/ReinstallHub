import React, { useState, useMemo } from 'react';
import {
  ArrowUpCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
  AlertTriangle,
  Layers,
  HardDrive,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { useAppStore } from '../store/applicationStore';
import { PackageUpgrade, InstalledApplication } from '../types/winget';

export const UpdatesPage: React.FC = () => {
  const {
    t,
    upgrades,
    isLoadingUpgrades,
    refreshUpgrades,
    upgradePackage,
    upgradeAll,
    isUpgrading,
    installedApps,
    refreshInstalledApps,
    uninstallPackage,
    isUninstalling,
    wingetInfo,
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'upgrades' | 'installed'>('upgrades');
  const [installedSearch, setInstalledSearch] = useState<string>('');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Confirmation state for uninstallation
  const [appToUninstall, setAppToUninstall] = useState<InstalledApplication | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setStatusNotification({ type, message });
    setTimeout(() => {
      setStatusNotification(null);
    }, 4500);
  };

  const handleUpgradeSingle = async (pkg: PackageUpgrade) => {
    setActiveActionId(pkg.id);
    try {
      const res = await upgradePackage(pkg.id);
      if (res.success) {
        showNotification('success', `${pkg.name}: ${t.updates.upgradeSuccess}`);
      } else {
        showNotification('error', `${pkg.name}: ${res.message || t.updates.upgradeFailed}`);
      }
    } catch (err: any) {
      showNotification('error', `${pkg.name}: ${err.message}`);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleUpgradeAll = async () => {
    try {
      const res = await upgradeAll();
      if (res.success) {
        showNotification('success', t.updates.upgradeSuccess);
      } else {
        showNotification('error', res.message || t.updates.upgradeFailed);
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleConfirmUninstall = async () => {
    if (!appToUninstall) return;
    const target = appToUninstall;
    setActiveActionId(target.id);
    setAppToUninstall(null);

    try {
      const res = await uninstallPackage(target.id);
      if (res.success) {
        showNotification('success', `${target.name}: ${t.updates.uninstallSuccess}`);
      } else {
        showNotification('error', `${target.name}: ${res.message || t.updates.uninstallFailed}`);
      }
    } catch (err: any) {
      showNotification('error', `${target.name}: ${err.message}`);
    } finally {
      setActiveActionId(null);
    }
  };

  // Filtered installed apps
  const filteredInstalledApps = useMemo(() => {
    const q = installedSearch.trim().toLowerCase();
    if (!q) return installedApps;
    return installedApps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        (app.source && app.source.toLowerCase().includes(q))
    );
  }, [installedApps, installedSearch]);

  const isWingetReady = wingetInfo?.isAvailable;

  return (
    <div className="space-y-4 pb-6 flex flex-col h-full">
      {/* Header with quick actions */}
      <Header
        title={t.updates.title}
        description={t.updates.description}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                refreshUpgrades();
                refreshInstalledApps();
              }}
              isLoading={isLoadingUpgrades}
              disabled={!isWingetReady || isUpgrading || isUninstalling}
              icon={<RefreshCw className="w-3 h-3" />}
            >
              {isLoadingUpgrades ? t.updates.refreshing : t.updates.refresh}
            </Button>

            {activeSubTab === 'upgrades' && upgrades.length > 0 && (
              <Button
                size="xs"
                variant="primary"
                onClick={handleUpgradeAll}
                isLoading={isUpgrading}
                disabled={!isWingetReady || upgrades.length === 0}
                icon={<Sparkles className="w-3 h-3" />}
              >
                {isUpgrading ? t.updates.upgradingAll : `${t.updates.upgradeAll} (${upgrades.length})`}
              </Button>
            )}
          </div>
        }
      />

      {/* Inline Notification Banner */}
      {statusNotification && (
        <div
          className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
            statusNotification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Sub Tabs Selection */}
      <div className="flex items-center justify-between gap-3 border-b border-win-border pb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('upgrades')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'upgrades'
                ? 'bg-win-primary text-white shadow-sm font-semibold'
                : 'text-win-muted hover:text-win-text hover:bg-win-card'
            }`}
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span>{t.updates.tabUpgrades}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                activeSubTab === 'upgrades' ? 'bg-white/20 text-white' : 'bg-win-card text-win-muted'
              }`}
            >
              {upgrades.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('installed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'installed'
                ? 'bg-win-primary text-white shadow-sm font-semibold'
                : 'text-win-muted hover:text-win-text hover:bg-win-card'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{t.updates.tabInstalled}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                activeSubTab === 'installed' ? 'bg-white/20 text-white' : 'bg-win-card text-win-muted'
              }`}
            >
              {installedApps.length}
            </span>
          </button>
        </div>

        {/* Search for Installed Apps Tab */}
        {activeSubTab === 'installed' && (
          <div className="relative w-64 max-w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-win-muted" />
            <input
              type="text"
              value={installedSearch}
              onChange={(e) => setInstalledSearch(e.target.value)}
              placeholder={t.updates.searchInstalledPlaceholder}
              className="w-full pl-8 pr-7 py-1 text-xs bg-win-panel border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary"
            />
            {installedSearch && (
              <button
                onClick={() => setInstalledSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-win-muted hover:text-win-text"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab 1: Available Upgrades */}
        {activeSubTab === 'upgrades' && (
          <div className="space-y-2.5">
            {isLoadingUpgrades ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-win-muted">
                <RefreshCw className="w-8 h-8 animate-spin text-win-primary mb-3" />
                <p className="text-xs font-medium">{t.updates.refreshing}</p>
              </div>
            ) : upgrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-win-panel border border-win-border">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-win-text">{t.updates.noUpgrades}</h3>
                <p className="text-xs text-win-muted mt-1 max-w-sm">{t.updates.noUpgradesDesc}</p>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={refreshUpgrades}
                  className="mt-4"
                  icon={<RefreshCw className="w-3 h-3" />}
                >
                  {t.updates.refresh}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {upgrades.map((pkg) => {
                  const isCurrentAction = activeActionId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className="p-3 rounded-lg bg-win-panel border border-win-border hover:border-win-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-win-text truncate">{pkg.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-win-card border border-win-border text-win-muted">
                            {pkg.id}
                          </span>
                          {pkg.source && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              {pkg.source}
                            </span>
                          )}
                        </div>

                        {/* Version Delta Badges */}
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <div className="flex items-center gap-1 text-win-muted">
                            <span className="text-[10px]">{t.updates.currentVersion}:</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-black/30">
                              {pkg.currentVersion}
                            </span>
                          </div>

                          <ArrowRight className="w-3 h-3 text-win-muted" />

                          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <span className="text-[10px] text-win-muted">{t.updates.newVersion}:</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30">
                              {pkg.availableVersion}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade Action Button */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => handleUpgradeSingle(pkg)}
                          isLoading={isCurrentAction}
                          disabled={!isWingetReady || isUpgrading || (activeActionId !== null && !isCurrentAction)}
                          icon={<ArrowUpCircle className="w-3 h-3" />}
                        >
                          {isCurrentAction ? t.updates.upgrading : t.updates.upgrade}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Installed Software & Clean Uninstaller */}
        {activeSubTab === 'installed' && (
          <div className="space-y-2">
            {filteredInstalledApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-win-panel border border-win-border">
                <Layers className="w-8 h-8 text-win-muted mb-2" />
                <p className="text-xs text-win-muted">{t.updates.noInstalledDesc}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-win-border bg-win-panel overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-win-card border-b border-win-border text-win-muted text-[11px]">
                    <tr>
                      <th className="px-3.5 py-2 font-semibold">Programa / Nombre</th>
                      <th className="px-3.5 py-2 font-semibold">WinGet ID</th>
                      <th className="px-3.5 py-2 font-semibold">Versión</th>
                      <th className="px-3.5 py-2 font-semibold">Origen</th>
                      <th className="px-3.5 py-2 font-semibold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-win-border/50">
                    {filteredInstalledApps.map((app) => {
                      const isTargetBusy = activeActionId === app.id;
                      return (
                        <tr key={app.id} className="hover:bg-win-card/50 transition-colors">
                          <td className="px-3.5 py-2 font-medium text-win-text max-w-xs truncate">
                            {app.name}
                          </td>
                          <td className="px-3.5 py-2 font-mono text-[11px] text-win-muted truncate">
                            {app.id}
                          </td>
                          <td className="px-3.5 py-2 font-mono text-[11px] text-win-muted">
                            {app.version || '-'}
                          </td>
                          <td className="px-3.5 py-2 text-[10px] text-win-muted">
                            {app.source ? (
                              <span className="px-1.5 py-0.2 rounded bg-win-card border border-win-border">
                                {app.source}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-3.5 py-2 text-right">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => setAppToUninstall(app)}
                              isLoading={isTargetBusy}
                              disabled={!isWingetReady || isUninstalling || isUpgrading}
                              icon={<Trash2 className="w-3 h-3 text-red-400" />}
                              className="hover:bg-red-500/10 hover:text-red-400 text-win-muted"
                            >
                              {t.updates.uninstall}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Uninstallation */}
      {appToUninstall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-win-panel border border-win-border rounded-xl shadow-2xl max-w-md w-full p-4.5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-win-text">{t.updates.confirmUninstallTitle}</h3>
                <p className="text-xs text-win-muted mt-0.5">
                  {t.updates.confirmUninstallDesc
                    .replace('{name}', appToUninstall.name)
                    .replace('{id}', appToUninstall.id)}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-win-card border border-win-border text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-win-muted">ID:</span>
                <span className="text-win-text font-bold">{appToUninstall.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-win-muted">{t.updates.currentVersion}:</span>
                <span className="text-win-text">{appToUninstall.version}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="xs" variant="ghost" onClick={() => setAppToUninstall(null)}>
                {t.updates.cancel}
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={handleConfirmUninstall}
                icon={<Trash2 className="w-3 h-3" />}
              >
                {t.updates.confirm}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
