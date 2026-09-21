import React from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { ActivityLog } from '../logs/ActivityLog';
import { InstallConfirmModal } from '../installation/InstallConfirmModal';
import { InstallationProgressModal } from '../installation/InstallationProgressModal';
import { InstallationResultModal } from '../installation/InstallationResultModal';
import { useAppStore } from '../../store/applicationStore';
import { Dashboard } from '../../pages/Dashboard';
import { SoftwareCatalogPage } from '../../pages/SoftwareCatalogPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { AboutPage } from '../../pages/AboutPage';

export const MainLayout: React.FC = () => {
  const { activeTab } = useAppStore();

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'catalog':
        return <SoftwareCatalogPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <SoftwareCatalogPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-win-bg text-win-text overflow-hidden select-none">
      {/* Windows 11 TitleBar */}
      <TitleBar />

      {/* Middle: Sidebar + Page View */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-3.5 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-b from-win-bg to-win-panel/30">
          <div className="max-w-[1750px] mx-auto h-full flex flex-col">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Expandable Activity Log Panel */}
      <ActivityLog />

      {/* Global Modals */}
      <InstallConfirmModal />
      <InstallationProgressModal />
      <InstallationResultModal />
    </div>
  );
};
