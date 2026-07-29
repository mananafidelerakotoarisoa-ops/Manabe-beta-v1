import React from 'react';
import { Sparkles, Accessibility, Cloud, FileDown, Plus, LogOut, HardDrive } from 'lucide-react';
import { Teacher } from '../types';

interface HeaderProps {
  accessibilityScore: number;
  cognitiveLoadScore: number;
  visionFilter: string;
  currentTeacher?: Teacher | null;
  onLogout?: () => void;
  setVisionFilter: (filter: any) => void;
  onOpenAiGenerator: () => void;
  onOpenAccessibilityInspector: () => void;
  onOpenCloudSync: () => void;
  onExportPdf: () => void;
  onImportJson?: (file: File) => void;
  onExportDrive?: () => void;
  onNewPlan: () => void;
  onToggleDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accessibilityScore,
  currentTeacher,
  onLogout,
  onOpenAiGenerator,
  onOpenAccessibilityInspector,
  onOpenCloudSync,
  onExportPdf,
  onExportDrive,
  onImportJson,
  onNewPlan,
  onToggleDrawer
}) => {
  return (
    <header className="top print:hidden">
      <div className="brand">
        <div className="crest-logo">学</div>
        <div className="brand-text">
          <span className="brand-wordmark">MPANABE</span>
          <p className="brand-tagline">学べ · ENSEIGNER · APPRENDRE · CONNECTER</p>
        </div>
      </div>

      <div className="topright">
        {currentTeacher && (
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 border border-white/10 rounded-xl px-2.5 py-1">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentTeacher.color} flex items-center justify-center font-black text-white text-[10px]`}>
              {currentTeacher.avatarLetter}
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-white block">Sensei {currentTeacher.name}</span>
              <span className="text-[9px] text-sky-300 font-japanese block">{currentTeacher.kanjiName}</span>
            </div>
          </div>
        )}

        <div className="net hidden sm:flex">
          <span className="dot" />
          <span className="hidden sm:inline">Synchro Cloud</span>
        </div>

        <button onClick={onNewPlan} className="linkbtn dark hidden sm:inline-flex items-center gap-1">
          <Plus className="w-3.5 h-3.5 text-sky-400" />
          <span>Nouvelle Fiche</span>
        </button>

        <button onClick={onOpenAiGenerator} className="linkbtn dark flex items-center gap-1.5 border-sky-400/40 text-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
          <span className="hidden sm:inline">Génération IA</span>
        </button>

        <button onClick={onOpenAccessibilityInspector} className="linkbtn dark hidden sm:inline-flex items-center gap-1">
          <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-emerald-300 font-bold hidden sm:inline">{accessibilityScore}%</span>
        </button>

        <button onClick={onOpenCloudSync} className="linkbtn dark p-2 hidden sm:inline-flex" title="Synchronisation Cloud">
          <Cloud className="w-4 h-4 text-sky-400" />
        </button>

        
        
        <label className="linkbtn dark p-2 hidden sm:inline-flex cursor-pointer" title="Importer un modèle JSON">
          <input type="file" accept=".json" className="hidden" onChange={(e) => {
            if (e.target.files && e.target.files.length > 0 && onImportJson) {
              onImportJson(e.target.files[0]);
            }
          }} />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </label>

        {onExportDrive && (
          <button onClick={onExportDrive} className="linkbtn dark p-2 hidden sm:inline-flex" title="Sauvegarder sur Google Drive">
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </button>
        )}
        <button onClick={onExportPdf} className="linkbtn dark p-2 hidden sm:inline-flex" title="Exporter en PDF">
          <FileDown className="w-4 h-4 text-sky-300" />
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="linkbtn dark p-2 text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 hidden sm:inline-flex"
            title="Déconnexion (ログアウト)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

        {/* Menu Hamburger Button in the Upper Right */}
        <button
          onClick={onToggleDrawer}
          className="iconbtn text-sky-200 hover:text-white hidden sm:flex"
          title="Menu Latéral (サイドメニュー)"
          aria-label="Ouvrir le menu latéral"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </header>
  );
};

