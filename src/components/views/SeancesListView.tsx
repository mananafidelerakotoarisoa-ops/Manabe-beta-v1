import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Calendar, CheckCircle2, AlertTriangle, PenTool } from 'lucide-react';
import { LessonPlan, Student, SessionData } from '../../types';

interface SeancesListViewProps {
  sessions: SessionData[];
  plans: LessonPlan[];
}

export const SeancesListView: React.FC<SeancesListViewProps> = ({ sessions = [], plans = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const filteredSessions = sessions.filter(session => {
    const plan = plans.find(p => p.id === session.planId);
    if (!plan) return false;
    
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || plan.classId === filterClass;
    
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = Array.from(new Set(plans.map(p => p.classId).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            Séances et Fiches <span className="text-sky-400 font-light">/ 履歴</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tableau complet de toutes les séances réalisées et fiches enregistrées.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une séance..."
            className="w-full bg-slate-900/90 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterClass} 
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-300 focus:ring-2 focus:ring-sky-400 outline-none w-full"
          >
            <option value="all">Toutes les classes</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-sec overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[600px]">
          <thead className="bg-slate-900/50 uppercase text-[10px] font-bold text-slate-400 border-b border-white/10">
            <tr>
              <th className="p-3 w-1/4">Titre (Fiche)</th>
              <th className="p-3 w-32">Classe</th>
              <th className="p-3 w-32">Date</th>
              <th className="p-3 text-center">Présents</th>
              <th className="p-3 text-center">Erreurs</th>
              <th className="p-3 text-right">Rapport</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => {
                const plan = plans.find(p => p.id === session.planId);
                const presentCount = Object.values(session.attendance).filter(a => (a as any).status === 'P').length;
                const totalStudents = Object.values(session.attendance).length;
                const errorsCount = session.errors?.length || 0;
                const reportDone = !!session.report?.notes;

                return (
                  <tr key={session.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        {plan?.title || 'Fiche Inconnue'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{plan?.grammarPoint}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{plan?.classId || '-'}</span>
                    </td>
                    <td className="p-3 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {session.date}
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {presentCount} / {totalStudents}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {errorsCount > 0 ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          {errorsCount}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {reportDone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Rédigé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Aucune séance trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
