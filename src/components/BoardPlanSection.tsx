import React, { useState } from 'react';
import { BoardPlan } from '../types';
import { Layout, Edit2, Check, Plus, Trash2 } from 'lucide-react';

interface BoardPlanSectionProps {
  boardPlan: BoardPlan;
  onChange: (updatedBoardPlan: BoardPlan) => void;
}

export const BoardPlanSection: React.FC<BoardPlanSectionProps> = ({ boardPlan, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onChange({
      ...boardPlan,
      notes: [...boardPlan.notes, newNote.trim()]
    });
    setNewNote('');
  };

  const handleRemoveNote = (index: number) => {
    const updated = [...boardPlan.notes];
    updated.splice(index, 1);
    onChange({ ...boardPlan, notes: updated });
  };

  return (
    <section className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
            板
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>黒板レイアウト (Board Plan Layout)</span>
            </h2>
            <p className="text-[11px] text-slate-400">Classroom whiteboard structure for clear student visual reference</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5 text-teal-400" />}
          <span>{isEditing ? 'Done Editing Board' : 'Edit Board Plan'}</span>
        </button>
      </div>

      {/* Board Layout Canvas Box (Simulating a Japanese Blackboard) */}
      <div className="bg-emerald-950/80 border-2 border-emerald-800/80 rounded-xl p-5 font-sans space-y-4 shadow-inner relative overflow-hidden">
        
        {/* Subtle grid line background for blackboard effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Board Title & Pattern */}
        <div>
          <span className="text-[10px] uppercase font-mono font-semibold text-emerald-400 tracking-wider block mb-1">
            Grammar Pattern (文型)
          </span>
          {isEditing ? (
            <input
              type="text"
              value={boardPlan.grammarPattern}
              onChange={(e) => onChange({ ...boardPlan, grammarPattern: e.target.value })}
              className="w-full bg-slate-900 border border-emerald-600 rounded-lg px-3 py-1.5 text-emerald-200 font-bold text-sm focus:outline-none"
            />
          ) : (
            <div className="text-emerald-200 font-bold text-base sm:text-lg tracking-wide border-b border-emerald-800/60 pb-2">
              {boardPlan.grammarPattern || 'V-て形 + もいいです'}
            </div>
          )}
        </div>

        {/* Example Sentences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          <div className="bg-slate-900/60 border border-emerald-800/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
              例文 (Japanese Example)
            </span>
            {isEditing ? (
              <textarea
                value={boardPlan.exampleSentenceJa}
                onChange={(e) => onChange({ ...boardPlan, exampleSentenceJa: e.target.value })}
                className="w-full bg-slate-950 border border-emerald-700 rounded p-2 text-white text-xs font-japanese"
                rows={2}
              />
            ) : (
              <div className="text-sm font-semibold text-white tracking-wide leading-relaxed font-japanese">
                {boardPlan.exampleSentenceJa}
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 border border-emerald-800/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
              意味 (Meaning & English Translation)
            </span>
            {isEditing ? (
              <input
                type="text"
                value={boardPlan.exampleSentenceEn}
                onChange={(e) => onChange({ ...boardPlan, exampleSentenceEn: e.target.value })}
                className="w-full bg-slate-950 border border-emerald-700 rounded p-1.5 text-slate-200 text-xs"
              />
            ) : (
              <div className="text-xs text-slate-300 italic">
                "{boardPlan.exampleSentenceEn}"
              </div>
            )}
          </div>

        </div>

        {/* Notes & Nuances */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold block mb-1">
            板書メモ (Teaching & Board Notes)
          </span>
          <div className="space-y-1.5">
            {boardPlan.notes.map((note, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-emerald-100/90 bg-emerald-900/30 px-3 py-1.5 rounded border border-emerald-800/40">
                <span>• {note}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveNote(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add board note..."
                className="flex-1 bg-slate-900 border border-emerald-700 rounded px-2.5 py-1 text-xs text-white"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Note</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
