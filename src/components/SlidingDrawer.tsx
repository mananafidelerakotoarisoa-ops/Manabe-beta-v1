import React, { useState } from 'react';
import { X, User, Users, Settings, LogOut, Search, Palette, Image as ImageIcon, ShieldCheck, Mail, GraduationCap, Check, Calendar } from 'lucide-react';
import { Teacher, AppTheme, BackgroundId, Student, ActiveTab } from '../types';

export type AccentColor = 'sky' | 'emerald' | 'indigo' | 'amber' | 'rose';

export const ACCENT_COLORS: { id: AccentColor; name: string; hex: string; bgClass: string; borderClass: string; ringClass: string }[] = [
  { id: 'sky', name: 'Bleu Ciel', hex: '#0ea5e9', bgClass: 'bg-sky-500', borderClass: 'border-sky-400', ringClass: 'ring-sky-400/50' },
  { id: 'emerald', name: 'Émeraude', hex: '#10b981', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-400', ringClass: 'ring-emerald-400/50' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', bgClass: 'bg-indigo-500', borderClass: 'border-indigo-400', ringClass: 'ring-indigo-400/50' },
  { id: 'amber', name: 'Ambre', hex: '#f59e0b', bgClass: 'bg-amber-500', borderClass: 'border-amber-400', ringClass: 'ring-amber-400/50' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', bgClass: 'bg-rose-500', borderClass: 'border-rose-400', ringClass: 'ring-rose-400/50' },
];

interface SlidingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeacher?: Teacher | null;
  onLogout?: () => void;
  
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  background: BackgroundId;
  setBackground: (bg: BackgroundId) => void;

  accentColor?: AccentColor;
  setAccentColor?: (color: AccentColor) => void;

  students?: Student[];
  onNavigateTab?: (tab: ActiveTab) => void;

  // Optional backward compatibility props
  plan?: any;
  onSwitchTeacher?: (teacher: Teacher) => void;
  onSelectPreset?: (presetPlan: any) => void;
  visionFilter?: any;
  setVisionFilter?: (filter: any) => void;
  onUpdatePlan?: (updates: any) => void;
}

export const SlidingDrawer: React.FC<SlidingDrawerProps> = ({
  isOpen,
  onClose,
  currentTeacher,
  onLogout,
  theme,
  setTheme,
  background,
  setBackground,
  accentColor = 'sky',
  setAccentColor,
  students = [],
  onNavigateTab,
}) => {
  const [studentQuery, setStudentQuery] = useState('');
  const [localAccent, setLocalAccent] = useState<AccentColor>(accentColor);

  const activeAccent = ACCENT_COLORS.find((c) => c.id === (accentColor || localAccent)) || ACCENT_COLORS[0];

  const handleAccentChange = (color: AccentColor) => {
    setLocalAccent(color);
    if (setAccentColor) {
      setAccentColor(color);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
    (s.kanjiName && s.kanjiName.includes(studentQuery)) ||
    s.classGroup.toLowerCase().includes(studentQuery.toLowerCase())
  );

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
        className={`${isOpen ? 'sm-open' : ''} space-y-6 overflow-y-auto no-scrollbar`}
        aria-hidden={!isOpen}
      >
        {/* Header Close Button */}
        <button
          className="sm-close hover:rotate-90 transition-transform duration-200"
          onClick={onClose}
          title="Fermer le menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header: Photo & Teacher Name */}
        <div className="text-center pt-2 pb-3 border-b border-white/10 space-y-3">
          <div className="relative inline-block">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${currentTeacher?.color || 'from-sky-500 to-indigo-600'} flex items-center justify-center font-black text-white text-2xl shadow-xl border-2 border-white/20 ring-4 ring-sky-500/20`}>
              {currentTeacher?.avatarLetter || '学'}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow" title="Compte Actif" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>{currentTeacher ? `Sensei ${currentTeacher.name}` : 'Enseignant MPANABE'}</span>
            </h2>
            <span className="text-xs text-sky-300 font-japanese block mt-0.5 font-medium">
              {currentTeacher?.kanjiName || '日本語講師'}
            </span>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {currentTeacher?.role || 'Professeur de Japonais'}
            </span>
          </div>
        </div>

        {/* 1. Section Profil */}
        <div className="sm-section space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <User className="w-4 h-4 text-sky-400" />
            <span>Profil Enseignant (プロフィール)</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Statut Compte</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Habilité</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Adresse Email</span>
              <div className="flex items-center gap-2 text-slate-200 font-mono text-[11px] truncate bg-slate-950/60 p-2 rounded-xl border border-white/5">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{currentTeacher?.email || 'enseignant@mpanabe.mg'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Classes Attribuées</span>
              <div className="flex flex-wrap gap-1.5">
                {currentTeacher?.classes.map((c, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {c}
                  </span>
                )) || <span className="text-slate-500 italic">Aucune classe</span>}
              </div>
            </div>

            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter (ログアウト)</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Section Liste des Élèves */}
        <div className="sm-section space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Liste des Élèves (生徒一覧)</span>
            </div>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/20">
              {students.length} élèves
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              placeholder="Rechercher un élève..."
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Scrollable Student List */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-xs italic">
                Aucun élève trouvé
              </div>
            ) : (
              filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/15 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-bold text-sky-300 text-xs shrink-0">
                      {st.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-200 truncate flex items-center gap-1">
                        <span>{st.name}</span>
                        {st.kanjiName && (
                          <span className="text-[10px] text-slate-400 font-japanese font-normal">
                            ({st.kanjiName})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {st.classGroup}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      st.lastStatus === 'P'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : st.lastStatus === 'R'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {st.lastStatus === 'P' ? 'Présent' : st.lastStatus === 'R' ? 'Retard' : 'Absent'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      {st.jlptTarget}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {onNavigateTab && (
            <button
              onClick={() => {
                onNavigateTab('eleves');
                onClose();
              }}
              className="w-full py-2 text-center text-xs text-sky-400 hover:text-sky-300 font-bold hover:underline flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Gérer tous les élèves →</span>
            </button>
          )}
        </div>

        {/* 3. Section Emploi du Temps */}
        <div className="sm-section space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Emploi du Temps (スケジュール)</span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            {currentTeacher?.scheduleEntries?.length ? (
              currentTeacher.scheduleEntries.map((entry, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-white/10 rounded-xl p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sky-300">{entry.day}</span>
                    <span className="text-[10px] font-mono text-slate-400 border border-white/10 bg-white/5 px-1.5 py-0.5 rounded">
                      {entry.classId}
                    </span>
                  </div>
                  {entry.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {entry.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">Libre / Autre activité</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-slate-500 text-xs italic">
                Aucun emploi du temps assigné
              </div>
            )}
          </div>
        </div>

        {/* 4. Section Paramètres */}
        <div className="sm-section space-y-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-sky-400" />
            <span>Paramètres (設定)</span>
          </div>

          {/* Sub-paramètre A: Thèmes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-sky-400" />
              <span>Thème Apparence</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dark', 'light', 'monochrome'] as AppTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold capitalize text-center border transition ${
                    theme === t
                      ? 'bg-sky-500/30 text-white border-sky-400 ring-2 ring-sky-400/40'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                  }`}
                >
                  {t === 'dark' ? 'Sombre' : t === 'light' ? 'Clair' : 'N&B'}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-paramètre B: Photos Background */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3 text-sky-400" />
              <span>Arrière-Plan (Images)</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6', 'bg-7', 'bg-8'] as BackgroundId[]).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBackground(bg)}
                  className={`h-11 rounded-xl border transition bg-cover bg-center relative overflow-hidden ${bg}-preview ${
                    background === bg
                      ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  title={`Fond ${bg.replace('bg-', '')}`}
                >
                  {background === bg && (
                    <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-paramètre C: Couleur de Thème */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span>Couleur d'Accentuation du Thème</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {ACCENT_COLORS.map((c) => {
                const isSelected = activeAccent.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAccentChange(c.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? `${c.borderClass} ${c.ringClass} ring-2 bg-white/10`
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                    title={c.name}
                  >
                    <span className={`w-4 h-4 rounded-full ${c.bgClass} shadow-md`} />
                    <span className="text-[9px] font-bold text-slate-300 truncate w-full text-center">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
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


