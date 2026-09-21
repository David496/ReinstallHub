import React from 'react';
import { LayoutDashboard, Package, Settings, Info, Terminal } from 'lucide-react';
import { useAppStore, NavTab } from '../../store/applicationStore';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSoftwareIds,
    toggleLogPanel,
    isLogPanelOpen,
    logs,
    t,
  } = useAppStore();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.sidebar.dashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'catalog',
      label: t.sidebar.catalog,
      icon: <Package className="w-4 h-4" />,
      badge: selectedSoftwareIds.size > 0 ? selectedSoftwareIds.size : undefined,
    },
    {
      id: 'settings',
      label: t.sidebar.settings,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: t.sidebar.about,
      icon: <Info className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-44 bg-win-panel border-r border-win-border flex flex-col justify-between select-none flex-shrink-0">
      {/* Navigation Links */}
      <div className="p-2">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-win-primary text-white shadow-sm font-semibold'
                    : 'text-win-muted hover:text-win-text hover:bg-win-card/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isActive ? 'text-white' : 'text-win-muted'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-win-primary' : 'bg-win-primary/20 text-win-accent'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Log Toggle */}
      <div className="p-2 border-t border-win-border/50">
        <button
          onClick={toggleLogPanel}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            isLogPanelOpen
              ? 'bg-win-card border-win-primary/40 text-win-accent'
              : 'bg-transparent border-transparent text-win-muted hover:text-win-text hover:bg-win-card/50'
          }`}
          title={t.sidebar.activityLog}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.sidebar.activityLog}</span>
          </div>
          {logs.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-black/40 text-win-muted font-mono">
              {logs.length}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
