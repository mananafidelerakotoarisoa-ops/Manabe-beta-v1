import React, { useState } from 'react';
import { Sparkles, X, Loader2, BookOpen, Clock, Layers } from 'lucide-react';
import { JLPTLevel, LessonPlan } from '../types';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: LessonPlan) => void;
}

const QUICK_SUGGESTIONS = [
  { level: 'N5', grammar: 'V-て形 + ください', name: 'Please do...' },
  { level: 'N5', grammar: 'V-て形 + から、〜', name: 'After doing V...' },
  { level: 'N4', grammar: 'V-た形 + ことがあります', name: 'Have experienced V' },
  { level: 'N4', grammar: '普通形 + んです', name: 'Providing explanation (~ndesu)' },
  { level: 'N3', grammar: 'V-辞書形 + ようにする', name: 'Try/make an effort to...' },
  { level: 'N3', grammar: '〜ば〜ほど', name: 'The more... the more...' }
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated
}) => {
  const [grammarPoint, setGrammarPoint] = useState('');
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>('N5');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [textbookRef, setTextbookRef] = useState('Minna no Nihongo');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grammarPoint.trim()) {
      setErrorMessage('Please enter a target Japanese grammar point.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grammarPoint: grammarPoint.trim(),
          targetLevel,
          durationMinutes: Number(durationMinutes),
          textbookRef: textbookRef.trim(),
          additionalNotes: additionalNotes.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate plan.');
      }

      // Add timestamp and client IDs
      const fullPlan: LessonPlan = {
        ...data.plan,
        id: 'ai-' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      onPlanGenerated(fullPlan);
      onClose();
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setErrorMessage(err.message || 'An error occurred while calling the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Lesson Plan Generator</h2>
              <p className="text-xs text-slate-400">Generates complete 4-step PCPP Japanese class sequence in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close generator modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5 text-xs text-slate-700">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Quick Suggestions */}
          <div>
            <label className="block text-slate-500 font-medium mb-1.5">
              Quick Grammar Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGrammarPoint(item.grammar);
                    setTargetLevel(item.level as JLPTLevel);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition"
                >
                  <span className="text-emerald-700 font-bold mr-1">{item.level}</span>
                  {item.grammar}
                </button>
              ))}
            </div>
          </div>

          {/* Grammar Point Input */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Target Japanese Grammar Point (文型) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={grammarPoint}
              onChange={(e) => setGrammarPoint(e.target.value)}
              placeholder="e.g. 〜てもいいです, 〜なければなりません, 〜そうです"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition"
            />
          </div>

          {/* Grid: Level & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                JLPT / Target Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as JLPTLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                <option value="N5">N5 (Beginner)</option>
                <option value="N4">N4 (Elementary)</option>
                <option value="N3">N3 (Intermediate)</option>
                <option value="N2">N2 (Upper Inter.)</option>
                <option value="N1">N1 (Advanced)</option>
                <option value="Casual">Casual / Conversation</option>
                <option value="Business">Business Japanese</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Class Duration (Mins)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                <option value={45}>45 mins</option>
                <option value={50}>50 mins (Standard)</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins (Double Block)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Textbook Reference
              </label>
              <input
                type="text"
                value={textbookRef}
                onChange={(e) => setTextbookRef(e.target.value)}
                placeholder="Minna / Genki / Marugoto"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Focus / Context / Special Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Focus on hospital/doctor roleplay context. Include flashcards for body parts."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PCPP Sequence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate Complete Lesson Plan</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
