import React from 'react';
import { Sparkles, Cloud } from 'lucide-react';
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
  onOpenAiGenerator,
  onOpenCloudSync,
  onToggleDrawer
}) => {
  return (
    <header className="top print:hidden flex items-center justify-between px-3 sm:px-5">
      <div className="brand flex-shrink-0 mr-2">
        <div className="crest-logo">学</div>
        <div className="brand-text">
          <span className="brand-wordmark">MPANABE</span>
          <p className="brand-tagline hidden sm:block">学べ · ENSEIGNER · APPRENDRE · CONNECTER</p>
        </div>
      </div>

      <div className="topright flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenCloudSync}
          className="linkbtn dark flex items-center justify-center gap-1.5 !px-2.5 sm:!px-3.5"
          title="Synchronisation Cloud"
        >
          <Cloud className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Synchro Cloud</span>
        </button>

        <button
          onClick={onOpenAiGenerator}
          className="linkbtn dark flex items-center justify-center gap-1.5 border-sky-400/40 text-sky-200 !px-2.5 sm:!px-3.5"
          title="Génération IA"
        >
          <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-sky-400 fill-sky-400" />
          <span className="hidden sm:inline">IA</span>
        </button>

        {/* Menu Hamburger Button */}
        <button
          onClick={onToggleDrawer}
          className="iconbtn text-sky-200 hover:text-white flex shrink-0 ml-1"
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

