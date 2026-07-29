import React from 'react';
import { LessonPlan } from '../types';

interface PrintViewProps {
  plan: LessonPlan;
}

export const PrintView: React.FC<PrintViewProps> = ({ plan }) => {
  return (
    <div id="printable-lesson-plan" className="p-8 bg-white text-slate-900 font-sans max-w-[210mm] mx-auto text-xs space-y-6">
      
      {/* Header Banner */}
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
            Japanese Class Lesson Preparation Plan (PCPP Method)
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1 font-japanese">
            {plan.title}
          </h1>
          <div className="text-xs text-slate-700 font-medium mt-1">
            Grammar Point: <strong className="text-slate-900 font-bold">{plan.grammarPoint}</strong> ({plan.grammarPointMeaning})
          </div>
        </div>

        <div className="text-right font-mono text-[11px] space-y-0.5 border-l-2 border-slate-200 pl-4">
          <div>Level: <strong className="text-slate-900 font-bold">{plan.targetLevel}</strong></div>
          <div>Textbook: <strong className="text-slate-900 font-bold">{plan.textbookRef || 'N/A'}</strong></div>
          <div>Duration: <strong className="text-slate-900 font-bold">{plan.totalDurationMinutes} mins</strong></div>
          <div className="text-[10px] text-slate-400 mt-1">{plan.updatedAt}</div>
        </div>
      </div>

      {/* Target Vocabulary & Kanji */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <span className="font-bold text-slate-900 block text-[11px] mb-1">Target Vocabulary (語彙):</span>
          <div className="flex flex-wrap gap-1 font-japanese text-[11px]">
            {plan.targetVocab.map((v, i) => (
              <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>

        {plan.targetKanji && plan.targetKanji.length > 0 && (
          <div>
            <span className="font-bold text-slate-900 block text-[11px] mb-1">Kanji Focus (漢字):</span>
            <div className="flex flex-wrap gap-1 font-japanese text-[11px]">
              {plan.targetKanji.map((k, i) => (
                <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-900">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PCPP Structured Sequences */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
          PCPP Structured Sequences (授業展開)
        </h2>

        <div className="space-y-4">
          {plan.phases.map((phase, idx) => (
            <div key={idx} className="border border-slate-300 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center bg-slate-100 p-2 rounded font-bold text-slate-900 text-xs">
                <span>{idx + 1}. {phase.title} ({phase.titleJa})</span>
                <span className="font-mono text-slate-700">{phase.durationMinutes} mins</span>
              </div>

              <div className="text-[11px] text-slate-800">
                <strong>Goal:</strong> {phase.objective}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <strong className="text-emerald-800 block mb-0.5">Teacher Action (T):</strong>
                  <p className="whitespace-pre-wrap leading-snug font-japanese">{phase.teacherAction}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <strong className="text-indigo-800 block mb-0.5">Student Action (S):</strong>
                  <p className="whitespace-pre-wrap leading-snug font-japanese">{phase.studentAction}</p>
                </div>
              </div>

              {phase.conceptCheckQuestions && phase.conceptCheckQuestions.length > 0 && (
                <div className="bg-sky-50 p-2 rounded border border-sky-200 text-[11px] text-sky-950">
                  <strong className="block mb-0.5 font-bold">Concept Check Questions (CCQs):</strong>
                  <ul className="list-disc list-inside space-y-0.5 font-japanese">
                    {phase.conceptCheckQuestions.map((ccq, cIdx) => (
                      <li key={cIdx}>{ccq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Board Plan Section */}
      <div className="border border-slate-900 rounded-lg p-4 bg-slate-900 text-white space-y-2">
        <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-700 pb-1">
          黒板レイアウト (Board Plan)
        </h2>
        <div className="text-sm font-bold text-emerald-200 font-japanese">
          {plan.boardPlan.grammarPattern}
        </div>
        <div className="text-xs text-white font-japanese">
          例文: {plan.boardPlan.exampleSentenceJa}
        </div>
        <div className="text-xs text-slate-300 italic">
          Meaning: {plan.boardPlan.exampleSentenceEn}
        </div>
        {plan.boardPlan.notes.length > 0 && (
          <div className="text-[11px] text-emerald-300 pt-1">
            Notes: {plan.boardPlan.notes.join(' | ')}
          </div>
        )}
      </div>

      {/* Teacher Notes Footer */}
      {plan.teacherNotes && (
        <div className="text-[11px] text-slate-600 italic border-t border-slate-200 pt-2">
          Note: {plan.teacherNotes}
        </div>
      )}

    </div>
  );
};
