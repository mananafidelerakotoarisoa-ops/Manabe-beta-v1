
import React from 'react';
import { BookOpen, Users, Award, Layers, Play, Clock, Sparkles, Plus, ArrowRight, CheckCircle2, AlertTriangle, Calendar, PenTool } from 'lucide-react';
import { LessonPlan, Student, ActiveTab, SessionData } from '../../types';
import { PRESET_TOPICS } from '../../data/presets';
import { INITIAL_SESSIONS } from '../../data/mockSessions';

interface AccueilViewProps {
  plan: LessonPlan;
  students: Student[];
  onSelectPreset: (presetPlan: LessonPlan) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAiGenerator: () => void;
  onNewPlan: () => void;
}

export const AccueilView: React.FC<AccueilViewProps> = ({
  plan,
  students,
  onSelectPreset,
  onNavigateTab,
  onOpenAiGenerator,
  onNewPlan,
}) => {
  const attendancePercentage = students.length > 0
    ? Math.round((students.filter(s => s.presenceRate >= 80).length / students.length) * 100)
    : 0;

  // Mock classes of the day
  const classesDuJour = [
    { id: 'c-1', name: 'Groupe A - N5', time: '10:00 - 11:30', level: 'N5', students: 12, planPrepared: true, sessionStarted: false },
    { id: 'c-2', name: 'Groupe B - N4', time: '14:00 - 15:30', level: 'N4', students: 8, planPrepared: false, sessionStarted: false }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Context */}
      <div className="card-sec border-l-4 border-l-indigo-500 bg-gradient-to-br from-slate-900 to-indigo-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span>Bonjour, Sensei</span>
              <span className="text-lg sm:text-xl font-normal text-indigo-400 font-japanese">先生、おはようございます</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Préparez et animez vos cours de japonais selon la méthode PCPP.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <button onClick={onOpenAiGenerator} className="btn dark flex items-center justify-center gap-2 border-indigo-400/40 text-indigo-200 w-full sm:w-auto">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Assistant IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classes du Jour */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <span>Classes du jour (本日の授業)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classesDuJour.map(cls => (
            <div key={cls.id} className="card-sec border border-white/10 hover:border-sky-500/30 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-white">{cls.name}</h3>
                  <span className="text-xs font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">{cls.time}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls.students} élèves</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Objectif {cls.level}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button 
                  onClick={() => onNavigateTab('fiches')} 
                  className={`btn tiny flex justify-center items-center gap-1.5 ${cls.planPrepared ? 'dark border-emerald-500/30 text-emerald-300' : 'dark border-amber-500/30 text-amber-300'}`}
                >
                  {cls.planPrepared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <PenTool className="w-3.5 h-3.5" />}
                  <span>{cls.planPrepared ? 'Fiche prête' : 'Préparer fiche'}</span>
                </button>
                <button 
                  onClick={() => onNavigateTab('seance')} 
                  className="btn primary tiny flex justify-center items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Prendre l'appel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Séances Récentes (Recent Sessions Table) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Séances Récentes (最近の授業)</span>
          </h2>
          <button onClick={() => onNavigateTab('seances_list')} className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1">
            <span>Tout voir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="card-sec overflow-x-auto p-0">
          <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[600px]">
            <thead className="bg-slate-900/80 uppercase text-[10px] font-bold text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3 w-1/3">Fiche</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Présents</th>
                <th className="p-3 text-center">Erreurs</th>
                <th className="p-3 text-right">Compte Rendu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {INITIAL_SESSIONS.slice(0, 5).map(session => {
                const sessionPlan = PRESET_TOPICS.find(p => p.defaultPlan.id === session.planId)?.defaultPlan || PRESET_TOPICS[0].defaultPlan;
                const presentCount = Object.values(session.attendance).filter(a => a.status === 'P').length;
                const totalStudents = Object.values(session.attendance).length;
                const errorsCount = session.errors?.length || 0;
                const reportDone = !!session.report?.notes;

                return (
                  <tr key={session.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="font-bold text-white truncate max-w-[200px]">{sessionPlan.title}</div>
                      <div className="text-[10px] text-slate-500">{sessionPlan.grammarPoint}</div>
                    </td>
                    <td className="p-3">{session.date}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {presentCount} / {totalStudents}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {errorsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-bold">
                          <AlertTriangle className="w-3 h-3" /> {errorsCount}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {reportDone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terminé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" /> En attente
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
