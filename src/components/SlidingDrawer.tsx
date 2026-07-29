import React from 'react';
import { X, BookOpen, Layers, Eye, Sparkles, Check, GraduationCap, ShieldCheck, LogOut, UserCheck } from 'lucide-react';
import { PRESET_TOPICS } from '../data/presets';
import { TEACHERS } from '../data/teachers';
import { LessonPlan, VisionFilter, JLPTLevel, Teacher, AppTheme, BackgroundId, ActiveTab } from '../types';

interface SlidingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
  currentTeacher?: Teacher | null;
  onLogout?: () => void;
  onSwitchTeacher?: (teacher: Teacher) => void;
  onSelectPreset: (presetPlan: LessonPlan) => void;
  
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  background: BackgroundId;
  setBackground: (bg: BackgroundId) => void;

  visionFilter: VisionFilter;
  setVisionFilter: (filter: VisionFilter) => void;
  onUpdatePlan: (updates: Partial<LessonPlan>) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const SlidingDrawer: React.FC<SlidingDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  currentTeacher,
  onLogout,
  onSwitchTeacher,
  onSelectPreset,
  
  theme,
  setTheme,
  background,
  setBackground,

  visionFilter,
  setVisionFilter,
  onUpdatePlan,
  onNavigateTab,
}) => {
  return (
    <div className="print:hidden">
      {/* Overlay */}
      <div
        id="sidemenu-overlay"
        className={isOpen ? 'sm-open' : ''}
        onClick={onClose}
      />

      {/* Side Menu Drawer Panel */}
      <aside
        id="sidemenu"
        className={isOpen ? 'sm-open' : ''}
        aria-hidden={!isOpen}
      >
        <button className="sm-close" onClick={onClose} title="Fermer le menu (閉じる)">
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="sm-profile flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="sm-photo-wrap">
              <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${currentTeacher?.color || 'from-sky-500 to-indigo-600'} flex items-center justify-center font-extrabold text-white text-base`}>
                {currentTeacher?.avatarLetter || '学'}
              </div>
            </div>
            <div className="sm-profile-text">
              <span className="sm-profile-name">
                {currentTeacher ? `Sensei ${currentTeacher.name}` : '日本語教師 (Sensei)'}
              </span>
              <span className="sm-profile-role">
                {currentTeacher ? currentTeacher.role : 'MPANABE PCPP Planner'}
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-xs flex items-center gap-1 border border-rose-500/30"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Teacher Switcher Section */}
        <div className="sm-section">
          <span className="sm-section-title">Comptes Enseignants Habilités (講師一覧)</span>
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {TEACHERS.map((t) => {
              const isCurrent = currentTeacher?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (onSwitchTeacher) {
                      onSwitchTeacher(t);
                      onClose();
                    }
                  }}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    isCurrent
                      ? 'bg-sky-500/25 border-sky-400 text-white font-bold ring-1 ring-sky-400/50'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[10px] font-black`}>
                    {t.avatarLetter}
                  </div>
                  <span className="text-[11px] truncate w-full">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets Section */}
        <div className="sm-section">
          <span className="sm-section-title">Modèles de cours (既定トピック)</span>
          <div className="space-y-2 mt-2">
            {PRESET_TOPICS.map((preset) => {
              const isSelected = plan.grammarPoint === preset.defaultPlan.grammarPoint;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset.defaultPlan as LessonPlan);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/25 border-sky-400 text-white font-bold'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-400/30 text-sky-200 mr-1.5">
                      {preset.level}
                    </span>
                    <span>{preset.title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level & Duration Section */}
        <div className="sm-section">
          <span className="sm-section-title">Niveau JLPT & Durée (レベル・時間)</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="fld">
              <span>Niveau JLPT</span>
              <select
                value={plan.targetLevel}
                onChange={(e) => onUpdatePlan({ targetLevel: e.target.value as JLPTLevel })}
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
                <option value="Casual">Casual</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="fld">
              <span>Durée (Min)</span>
              <input
                type="number"
                value={plan.totalDurationMinutes}
                onChange={(e) => onUpdatePlan({ totalDurationMinutes: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        
        
        {/* Navigation Mobile (Additional Tabs) */}
        <div className="sm-section sm:hidden">
          <span className="sm-section-title">Navigation (ナビゲーション)</span>
          <div className="space-y-2 mt-2">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('analyse');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-white/10 text-xs transition flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200"
            >
              <div className="w-4 h-4 text-teal-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>
              </div>
              <span>Analyse WCAG & Ergonomie (分析)</span>
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="sm-section">
          <span className="sm-section-title">Paramètres (Settings)</span>
          
          <div className="mt-2 text-xs font-bold text-slate-400 mb-1">Thème</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['dark', 'light', 'monochrome'] as AppTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-1.5 rounded-lg text-[10px] font-semibold capitalize text-center border transition ${
                  theme === t
                    ? 'bg-sky-500/30 text-sky-200 border-sky-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                }`}
              >
                {t === 'dark' ? 'Sombre' : t === 'light' ? 'Clair' : 'N&B'}
              </button>
            ))}
          </div>

          <div className="mt-3 text-xs font-bold text-slate-400 mb-1">Arrière-plan</div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6', 'bg-7', 'bg-8'] as BackgroundId[]).map((bg) => (
              <button
                key={bg}
                onClick={() => setBackground(bg)}
                className={`h-10 rounded-lg border transition bg-cover bg-center ${bg}-preview ${
                  background === bg
                    ? 'border-sky-400 ring-2 ring-sky-400/50'
                    : 'border-white/10 hover:border-white/30'
                }`}
                title={`Fond ${bg.replace('bg-', '')}`}
              >
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Shader */}
        <div className="sm-section">
          <span className="sm-section-title">Simulateur Visuel (視覚モード)</span>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'highContrast'] as VisionFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => setVisionFilter(v)}
                className={`p-2 rounded-lg text-[11px] font-semibold capitalize text-left border transition ${
                  visionFilter === v
                    ? 'bg-sky-500/30 text-sky-200 border-sky-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                }`}
              >
                {v === 'none' ? 'Standard' : v}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] text-slate-400 font-bold block tracking-wider uppercase">
            MPANABE — 学べ
          </span>
          <span className="text-[10px] text-slate-500 font-japanese block mt-0.5">
            Enseigner · Apprendre · Connecter
          </span>
        </div>
      </aside>
    </div>
  );
};

