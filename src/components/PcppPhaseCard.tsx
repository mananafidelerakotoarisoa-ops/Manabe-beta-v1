import React, { useState } from 'react';
import { PCPPPhase } from '../types';
import { AttachmentsList } from './AttachmentsList';
import { Clock, Edit2, Check, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, Package } from 'lucide-react';

interface PcppPhaseCardProps {
  phase: PCPPPhase;
  index: number;
  totalPhases: number;
  onChange: (updatedPhase: PCPPPhase) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const PHASE_THEMES = {
  presentation: {
    badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
    headerBg: 'bg-purple-950/50 border-purple-500/20',
    accentText: 'text-purple-300',
    iconBg: 'bg-purple-600 text-white',
    label: 'P - Presentation (導入)'
  },
  comprehension: {
    badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    headerBg: 'bg-sky-950/50 border-sky-500/20',
    accentText: 'text-sky-300',
    iconBg: 'bg-sky-600 text-white',
    label: 'C - Comprehension Check (理解確認)'
  },
  practice: {
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    headerBg: 'bg-emerald-950/50 border-emerald-500/20',
    accentText: 'text-emerald-300',
    iconBg: 'bg-emerald-600 text-white',
    label: 'P - Practice (練習)'
  },
  production: {
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    headerBg: 'bg-amber-950/50 border-amber-500/20',
    accentText: 'text-amber-300',
    iconBg: 'bg-amber-600 text-white',
    label: 'P - Production (運用)'
  }
};

export const PcppPhaseCard: React.FC<PcppPhaseCardProps> = ({
  phase,
  index,
  totalPhases,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCcq, setNewCcq] = useState('');

  const theme = PHASE_THEMES[phase.type] || PHASE_THEMES.presentation;

  const handleAddMaterial = () => {
    if (!newMaterial.trim()) return;
    onChange({ ...phase, materialsNeeded: [...phase.materialsNeeded, newMaterial.trim()] });
    setNewMaterial('');
  };

  const handleRemoveMaterial = (mIdx: number) => {
    const updated = [...phase.materialsNeeded];
    updated.splice(mIdx, 1);
    onChange({ ...phase, materialsNeeded: updated });
  };

  const handleAddCcq = () => {
    if (!newCcq.trim()) return;
    onChange({
      ...phase,
      conceptCheckQuestions: [...(phase.conceptCheckQuestions || []), newCcq.trim()]
    });
    setNewCcq('');
  };

  const handleRemoveCcq = (cIdx: number) => {
    const updated = [...(phase.conceptCheckQuestions || [])];
    updated.splice(cIdx, 1);
    onChange({ ...phase, conceptCheckQuestions: updated });
  };

  return (
    <article className="card-sec overflow-hidden border border-white/15 shadow-xl transition-all duration-200 hover:border-sky-400/50">
      
      {/* Header */}
      <div className={`-mx-5 -mt-5 px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${theme.headerBg} backdrop-blur-md mb-4`}>
        
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-md ${theme.iconBg}`}>
            {index + 1}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
              {theme.label}
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
              {phase.title}
            </h3>
          </div>
        </div>

        {/* Time Allocation & Ergonomic Touch Controls */}
        <div className="flex items-center space-x-2">
          
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-white/15 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{phase.durationMinutes}m</span>
          </div>

          <div className="flex items-center space-x-1">
            {index > 0 && (
              <button
                onClick={onMoveUp}
                className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
                title="Move step up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
            {index < totalPhases - 1 && (
              <button
                onClick={onMoveDown}
                className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
                title="Move step down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-8 h-8 rounded-lg text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              title="Edit step"
            >
              {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4" />}
            </button>
            {totalPhases > 1 && (
              <button
                onClick={onDelete}
                className="w-8 h-8 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 flex items-center justify-center transition"
                title="Delete step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Card Body */}
      <div className="space-y-4 text-xs">
        
        {/* Objective */}
        <div>
          <span className="font-bold text-slate-200 block mb-1">Objective (学習目標):</span>
          {isEditing ? (
            <input
              type="text"
              value={phase.objective}
              onChange={(e) => onChange({ ...phase, objective: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-sky-400 outline-none"
            />
          ) : (
            <p className="text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-white/10 leading-relaxed font-medium">
              {phase.objective}
            </p>
          )}
        </div>

        {/* Teacher vs Student Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Teacher Action (T) */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
            <div className="font-bold text-emerald-300 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">T</span>
                <span>Teacher Action (教師の指示・発話)</span>
              </span>
            </div>
            {isEditing ? (
              <textarea
                value={phase.teacherAction}
                onChange={(e) => onChange({ ...phase, teacherAction: e.target.value })}
                rows={3}
                className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-slate-100 leading-relaxed whitespace-pre-wrap font-japanese text-xs pt-1">
                {phase.teacherAction}
              </p>
            )}
          </div>

          {/* Student Action (S) */}
          <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1.5">
            <div className="font-bold text-indigo-300 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-extrabold">S</span>
                <span>Student Action (学習者の活動)</span>
              </span>
            </div>
            {isEditing ? (
              <textarea
                value={phase.studentAction}
                onChange={(e) => onChange({ ...phase, studentAction: e.target.value })}
                rows={3}
                className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            ) : (
              <p className="text-slate-100 leading-relaxed whitespace-pre-wrap font-japanese text-xs pt-1">
                {phase.studentAction}
              </p>
            )}
          </div>

        </div>

        {/* Concept Check Questions (CCQs) for Comprehension Phase */}
        {(phase.type === 'comprehension' || (phase.conceptCheckQuestions && phase.conceptCheckQuestions.length > 0)) && (
          <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-xl space-y-2">
            <div className="font-bold text-sky-200 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Concept Check Questions (CCQs / 理解チェック質問)</span>
            </div>

            <div className="space-y-1.5">
              {(phase.conceptCheckQuestions || []).map((ccq, cIdx) => (
                <div key={cIdx} className="flex items-center justify-between bg-slate-900/80 px-3 py-1.5 rounded-lg border border-sky-500/20 text-slate-100 font-medium">
                  <span className="font-japanese">• {ccq}</span>
                  {isEditing && (
                    <button onClick={() => handleRemoveCcq(cIdx)} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newCcq}
                  onChange={(e) => setNewCcq(e.target.value)}
                  placeholder="e.g. Q: 病院で煙草を吸ってもいいですか -> 吸ってはいけません"
                  className="flex-1 bg-slate-900 border border-sky-500/40 rounded-lg px-2.5 py-1 text-xs text-white"
                />
                <button
                  onClick={handleAddCcq}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs"
                >
                  Add CCQ
                </button>
              </div>
            )}
          </div>
        )}

        
        {/* Type-Specific Fields */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          {phase.type === 'presentation' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Script d'introduction orale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.oralIntroScript || ''} onChange={e => onChange({ ...phase, oralIntroScript: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.oralIntroScript || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Notes d'auto-pertinence</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.selfRelevanceNotes || ''} onChange={e => onChange({ ...phase, selfRelevanceNotes: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.selfRelevanceNotes || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Mise en évidence de la forme</span>
                {isEditing ? (
                  <input type="text" value={phase.formHighlighting || ''} onChange={e => onChange({ ...phase, formHighlighting: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.formHighlighting || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Plan d'interaction orale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.interactionPlan || ''} onChange={e => onChange({ ...phase, interactionPlan: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.interactionPlan || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'comprehension' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Recherche d'information / Lecture</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.globalSearchActivities || ''} onChange={e => onChange({ ...phase, globalSearchActivities: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.globalSearchActivities || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Activités d'écoute (dicto-composition)</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.listeningActivities || ''} onChange={e => onChange({ ...phase, listeningActivities: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.listeningActivities || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Journal des erreurs anticipées</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.anticipatedErrors || ''} onChange={e => onChange({ ...phase, anticipatedErrors: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.anticipatedErrors || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'practice' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Exercices structuraux</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.structuralExercises || ''} onChange={e => onChange({ ...phase, structuralExercises: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.structuralExercises || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Lecture orale (read-and-look-up)</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.oralReading || ''} onChange={e => onChange({ ...phase, oralReading: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.oralReading || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Écriture personnalisée</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.customWriting || ''} onChange={e => onChange({ ...phase, customWriting: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.customWriting || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Stratégie de correction</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.correctionStrategy || ''} onChange={e => onChange({ ...phase, correctionStrategy: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.correctionStrategy || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'production' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Tâche communicative</span>
                {isEditing ? (
                  <div className="flex gap-2">
                    <select 
                      value={phase.communicativeTaskType || 'débat'} 
                      onChange={e => onChange({ ...phase, communicativeTaskType: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="débat">Débat</option>
                      <option value="jeu de rôle">Jeu de rôle</option>
                      <option value="récit">Récit</option>
                      <option value="autre">Autre</option>
                    </select>
                    <input type="text" placeholder="Description" value={phase.communicativeTaskDesc || ''} onChange={e => onChange({ ...phase, communicativeTaskDesc: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                  </div>
                ) : (
                  <p className="text-slate-300 text-xs capitalize">{phase.communicativeTaskType} : {phase.communicativeTaskDesc || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Critères de réussite</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.successCriteria || ''} onChange={e => onChange({ ...phase, successCriteria: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.successCriteria || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Activité d'apprentissage actif</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.activeLearningActivity || ''} onChange={e => onChange({ ...phase, activeLearningActivity: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.activeLearningActivity || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Plan de réutilisation en spirale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.spiralReusePlan || ''} onChange={e => onChange({ ...phase, spiralReusePlan: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.spiralReusePlan || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Teaching Materials */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="font-bold text-slate-400 text-[11px] flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <span>Materials (教材):</span>
          </span>
          {phase.materialsNeeded.map((mat, mIdx) => (
            <span key={mIdx} className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/15 text-slate-200 font-medium text-[11px] flex items-center gap-1.5">
              <span>{mat}</span>
              {isEditing && (
                <button onClick={() => handleRemoveMaterial(mIdx)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}

          {isEditing && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="New material..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <button
                onClick={handleAddMaterial}
                className="px-2.5 py-1 bg-slate-700 text-white font-bold rounded-lg text-xs hover:bg-slate-600"
              >
                +
              </button>
            </div>
          )}
        </div>

      </div>

    </article>
  );
};
