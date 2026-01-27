import React from 'react';
import { Icons } from '@/constants';

interface NavigationProps {
  activeTab: 'events' | 'create' | 'dashboard';
  onTabChange: (tab: 'events' | 'create' | 'dashboard') => void;
  onBuyRun?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onBuyRun }) => {
  const tabs = [
    { id: 'events', label: 'Explore Events', icon: <Icons.Flag /> },
    { id: 'create', label: 'Create Event', icon: <Icons.Zap /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Target /> }
  ];

  return (
    <div className="hidden md:flex h-8 bg-slate-950/60 rounded-lg p-1 border border-white/5 items-center">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as 'events' | 'create' | 'dashboard')}
          className={`px-4 h-full rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          {tab.label}
        </button>
      ))}
      {onBuyRun && (
        <>
          <div className="w-px h-3 bg-slate-800 mx-1"></div>
          <button
            onClick={onBuyRun}
            className="px-4 h-full rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
          >
            Buy RUN
          </button>
        </>
      )}
    </div>
  );
};