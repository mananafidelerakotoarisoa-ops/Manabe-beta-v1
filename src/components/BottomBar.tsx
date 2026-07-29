import React from 'react';
import { Home, Clock, Layers, Users, Accessibility } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  accessibilityScore: number;
  onOpenDrawer?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeTab,
  setActiveTab,
  accessibilityScore,
  onOpenDrawer,
}) => {
  return (
    <nav id="nav" className="print:hidden">


      {/* 2. Séance */}
      <button
        onClick={() => setActiveTab('seance')}
        className={`nav-tab ${activeTab === 'seance' ? 'nav-active' : ''}`}
        title="Séance de cours (授業)"
      >
        <div className="nav-icon">
          <Clock className="w-5 h-5 text-emerald-400" />
        </div>
        <span className="nav-label">Séance</span>
      </button>

      {/* 3. Fiches */}
      <button
        onClick={() => setActiveTab('fiches')}
        className={`nav-tab ${activeTab === 'fiches' ? 'nav-active' : ''}`}
        title="Fiches de cours PCPP (授業案)"
      >
        <div className="nav-icon">
          <Layers className="w-5 h-5 text-amber-300" />
        </div>
        <span className="nav-label">Fiches</span>
      </button>

      {/* 1. Accueil (Blended but highlighted) */}
      <button
        onClick={() => setActiveTab('accueil')}
        className={`nav-tab ${activeTab === 'accueil' ? 'nav-active' : ''}`}
        title="Accueil (ホーム)"
      >
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-sky-500 shadow-lg text-white mb-0.5 transition-transform hover:scale-105 active:scale-95">
          <Home className="w-6 h-6" />
        </div>
        <span className="nav-label">Accueil</span>
      </button>

      


      {/* 4. Élèves */}
      <button
        onClick={() => setActiveTab('eleves')}
        className={`nav-tab ${activeTab === 'eleves' ? 'nav-active' : ''}`}
        title="Gestion des élèves (生徒一覧)"
      >
        <div className="nav-icon">
          <Users className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="nav-label">Élèves</span>
      </button>

      {/* 5. Analyse */}
      <button
        onClick={() => setActiveTab('analyse')}
        className={`nav-tab hidden sm:flex ${activeTab === 'analyse' ? 'nav-active' : ''}`}
        title="Analyse WCAG & Ergonomie (分析)"
      >
        <div className="nav-icon">
          <Accessibility className="w-5 h-5 text-teal-300" />
        </div>
        <span className="nav-label">Analyse ({accessibilityScore}%)</span>
      </button>
          </nav>
  );
};
