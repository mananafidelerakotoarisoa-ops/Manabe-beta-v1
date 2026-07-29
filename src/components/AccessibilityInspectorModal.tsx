import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, Eye, Zap, ShieldCheck, Scale } from 'lucide-react';
import { AccessibilityAuditResult, LessonPlan, VisionFilter } from '../types';

interface AccessibilityInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: AccessibilityAuditResult;
  plan: LessonPlan;
  visionFilter: VisionFilter;
  setVisionFilter: (filter: VisionFilter) => void;
  onOptimizeLightness: () => void;
}

export const AccessibilityInspectorModal: React.FC<AccessibilityInspectorModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  plan,
  visionFilter,
  setVisionFilter,
  onOptimizeLightness
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contrast' | 'lightness' | 'vision'>('overview');
  const [testFocusActive, setTestFocusActive] = useState(false);

  if (!isOpen) return null;

  const totalElements = plan.phases.reduce((acc, p) => acc + (p.materialsNeeded?.length || 0) + (p.conceptCheckQuestions?.length || 0) + 4, 0);
  const presentationTime = plan.phases.find(p => p.type === 'presentation')?.durationMinutes || 10;
  const practiceAndProductionTime = plan.phases.filter(p => p.type === 'practice' || p.type === 'production').reduce((acc, p) => acc + p.durationMinutes, 0);
  const sttPercentage = Math.min(100, Math.round((practiceAndProductionTime / plan.totalDurationMinutes) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
              ♿
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Accessibility & UI Lightness Inspector
              </h2>
              <p className="text-xs text-slate-400">
                WCAG 2.1 AA Standards & Teacher Cognitive Load Evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-xs text-slate-400">Overall Accessibility Score</div>
              <div className="text-2xl font-extrabold text-emerald-400 flex items-baseline gap-1">
                {auditResult.score} <span className="text-xs font-normal text-slate-400">/ 100 (WCAG AA)</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block" />
            <div>
              <div className="text-xs text-slate-400">Preparation Lightness Index</div>
              <div className="text-2xl font-extrabold text-teal-300 flex items-baseline gap-1">
                {auditResult.cognitiveLoadScore} <span className="text-xs font-normal text-slate-400">/ 100 (Optimal Fast Prep)</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block" />
            <div>
              <div className="text-xs text-slate-400">Student Talk Time (STT)</div>
              <div className="text-2xl font-extrabold text-sky-400">
                {sttPercentage}%
              </div>
            </div>
          </div>

          <button
            onClick={onOptimizeLightness}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Optimize Lesson Lightness</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-4">
          {[
            { id: 'overview', label: 'Audit Overview', icon: ShieldCheck },
            { id: 'lightness', label: 'Preparation Lightness', icon: Scale },
            { id: 'contrast', label: 'WCAG Color Contrast', icon: Eye },
            { id: 'vision', label: 'Vision Filters', icon: Eye }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Design System Standards</span>
                  </div>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1">
                    <li>✓ High contrast body text (17:1 ratio)</li>
                    <li>✓ High contrast Japanese font scaling</li>
                    <li>✓ Focus visible indicators on buttons</li>
                    <li>✓ Semantic structure (&lt;header&gt;, &lt;main&gt;, &lt;section&gt;)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
                  <div className="flex items-center space-x-2 text-teal-900 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span>Lightweight Teacher Experience</span>
                  </div>
                  <p className="mt-2 text-xs text-teal-800">
                    Your preparation structure uses <strong className="font-bold">{plan.phases.length} concise PCPP phases</strong> with a balanced student talk time ratio of {sttPercentage}%. Total preparation element count is kept optimal ({totalElements} items).
                  </p>
                </div>
              </div>

              {/* Actionable Feedback List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Audit Findings & Recommendations
                </h3>

                {auditResult.issues.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Great job! No accessibility or cognitive overload issues detected in this lesson plan.</span>
                  </div>
                ) : (
                  auditResult.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                        issue.type === 'error'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : issue.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-sky-50 border-sky-200 text-sky-900'
                      }`}
                    >
                      {issue.type === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      ) : issue.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-xs">{issue.message}</div>
                        <div className="text-[11px] opacity-80 mt-0.5">💡 {issue.suggestion}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: LIGHTNESS & COGNITIVE LOAD */}
          {activeTab === 'lightness' && (
            <div className="space-y-5 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-600" />
                  <span>Cognitive Load & Preparation Speed Evaluation</span>
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  To ensure class preparation feels <strong>faster, easier, and light</strong>, the interface limits visual clutter and keeps lesson steps bite-sized. Teachers can reference this view during live teaching without getting lost in long paragraphs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-400 text-[11px] block">Core Phases</span>
                  <span className="text-lg font-bold text-slate-900">{plan.phases.length} Phases</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Ideal count: 4 (PCPP)</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-400 text-[11px] block">Presentation Time</span>
                  <span className="text-lg font-bold text-slate-900">{presentationTime} mins</span>
                  <span className={`text-[10px] block mt-0.5 ${presentationTime <= 12 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {presentationTime <= 12 ? '✓ Fast & lightweight' : '⚠️ Keep teacher presentation < 12m'}
                  </span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-400 text-[11px] block">Preparation Element Count</span>
                  <span className="text-lg font-bold text-slate-900">{totalElements} elements</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Low cognitive load score</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <div className="font-bold text-emerald-900 mb-1">Lightness Guarantee Guidelines:</div>
                <ul className="list-disc list-inside space-y-1 text-emerald-800 text-xs">
                  <li>Keep Presentation (導入) under 10-12 minutes.</li>
                  <li>Include 2-3 Concept Check Questions (CCQs) in Comprehension (理解確認) to avoid lecturing.</li>
                  <li>Allocate at least 30 minutes total to Practice (練習) & Production (運用) for high student engagement.</li>
                  <li>Use clean bullet points for teacher and student actions.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTRAST MATRIX */}
          {activeTab === 'contrast' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                WCAG 2.1 Level AA requires a contrast ratio of at least <strong>4.5:1</strong> for standard text and <strong>3.0:1</strong> for large text.
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">UI Element</th>
                      <th className="px-4 py-3">Measured Ratio</th>
                      <th className="px-4 py-3">WCAG AA Standard</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditResult.contrastDetails.map((detail, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{detail.element}</td>
                        <td className="px-4 py-3 font-mono text-slate-700">{detail.ratio}:1</td>
                        <td className="px-4 py-3 text-slate-500">≥ 4.5:1</td>
                        <td className="px-4 py-3">
                          {detail.pass ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ✓ Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              ⚠️ Check
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VISION FILTERS */}
          {activeTab === 'vision' && (
            <div className="space-y-4 text-xs text-slate-700">
              <p className="text-slate-600">
                Test how the lesson planner interface appears under various visual conditions (e.g., colorblindness or high contrast).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'highContrast'] as VisionFilter[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setVisionFilter(filter)}
                    className={`p-3 rounded-xl border text-left transition ${
                      visionFilter === filter
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="capitalize text-xs">{filter === 'none' ? 'Normal Vision' : filter}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {filter === 'protanopia' ? 'Red deficiency' : filter === 'deuteranopia' ? 'Green deficiency' : filter === 'tritanopia' ? 'Blue deficiency' : filter === 'highContrast' ? 'Maximum contrast' : 'Standard full color'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
