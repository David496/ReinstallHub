import React from 'react';
import { ApplicationStoreProvider } from './store/applicationStore';
import { MainLayout } from './components/layout/MainLayout';

export const App: React.FC = () => {
  return (
    <ApplicationStoreProvider>
      <MainLayout />
    </ApplicationStoreProvider>
  );
};

export default App;
