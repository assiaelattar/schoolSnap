import React from 'react';
import { ViewState } from '../types';
import { Hexagon, Layout, Settings } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setView('landing')}
      >
        <div className="bg-brand-dark text-white p-2 rounded-xl">
          <Hexagon size={24} fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">SchoolSnap</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <button className="hover:text-brand-purple transition-colors">How it works</button>
        <button className="hover:text-brand-purple transition-colors">Features</button>
        <button className="hover:text-brand-purple transition-colors">Pricing</button>
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'landing' ? (
           <button 
             onClick={() => setView('onboarding')}
             className="px-6 py-2.5 bg-white border-2 border-brand-dark text-brand-dark rounded-full font-bold hover:bg-gray-50 transition-all text-sm"
           >
             Log in
           </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setView('command-center')}
              className={`p-2 rounded-full transition-colors ${currentView === 'command-center' || currentView === 'studio' ? 'bg-brand-purple/10 text-brand-purple' : 'text-gray-400 hover:text-gray-600'}`}
              title="Dashboard"
            >
              <Layout size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        )}
        
        {currentView === 'landing' && (
          <button 
            onClick={() => setView('onboarding')}
            className="px-6 py-2.5 bg-brand-lime text-brand-dark rounded-full font-bold shadow-[0_4px_14px_0_rgba(204,255,0,0.5)] hover:shadow-[0_6px_20px_rgba(204,255,0,0.6)] hover:-translate-y-0.5 transition-all text-sm"
          >
            Get Started →
          </button>
        )}
      </div>
    </nav>
  );
};
