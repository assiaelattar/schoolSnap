import React, { useState } from 'react';
import { ViewState, BrandProfile, ModuleId } from './types';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { CommandCenter } from './pages/CommandCenter';
import { Studio } from './pages/Studio';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleId>('social');

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing setView={setCurrentView} />;
      case 'onboarding':
        return <Onboarding setView={setCurrentView} setBrand={setBrand} />;
      case 'command-center':
        return <CommandCenter setView={setCurrentView} brand={brand} setModule={setSelectedModule} />;
      case 'studio':
        return <Studio setView={setCurrentView} brand={brand} activeModuleId={selectedModule} />;
      default:
        return <Landing setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-lime selection:text-brand-dark">
      {currentView !== 'studio' && <Navbar currentView={currentView} setView={setCurrentView} />}
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;