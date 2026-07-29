import React from 'react';
import { BarChart3, Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyseViewProps {
  students: Student[];
}

export const AnalyseView: React.FC<AnalyseViewProps> = ({ students }) => {
  const totalStudents = students.length;
  
  // Compute global presence rate
  const globalPresenceRate = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.presenceRate, 0) / students.length)
    : 0;

  // Mock data for sessions
  const totalSessions = 124;

  // Mock data for error distribution
  const errorData = [
    { name: 'Particules', value: 45 },
    { name: 'Kanji', value: 30 },
    { name: 'Vocabulaire', value: 15 },
    { name: 'Conjugaison', value: 20 },
    { name: 'Prononciation', value: 10 },
  ];

  const mostFrequentError = errorData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name;

  // Compute presence rate per class
  const classesMap = new Map<string, { total: number, count: number }>();
  students.forEach(s => {
    const existing = classesMap.get(s.classGroup) || { total: 0, count: 0 };
    classesMap.set(s.classGroup, {
      total: existing.total + s.presenceRate,
      count: existing.count + 1
    });
  });

  const classPresenceData = Array.from(classesMap.entries()).map(([name, data]) => ({
    name,
    taux: Math.round(data.total / data.count)
  }));

  const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card-sec bg-slate-900/90 border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Analyse & Statistiques (分析)</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Statistiques globales de l'école : présences, élèves inscrits et répartition des erreurs.
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-sec border-l-4 border-l-sky-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Séances</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{totalSessions}</div>
        </div>

        <div className="card-sec border-l-4 border-l-emerald-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Taux de Présence</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{globalPresenceRate}%</div>
        </div>

        <div className="card-sec border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Élèves Inscrits</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{totalStudents}</div>
        </div>

        <div className="card-sec border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Erreur Fréquente</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-lg font-extrabold text-white mt-2 pt-1 truncate">{mostFrequentError}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Distribution Chart */}
        <div className="card-sec">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Répartition des Erreurs (エラー分布)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {errorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {errorData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Attendance by Class Chart */}
        <div className="card-sec">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Taux de Présence par Classe (クラス別出席率)
          </h3>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPresenceData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="taux" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20}>
                  {classPresenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.taux >= 90 ? '#34d399' : entry.taux >= 75 ? '#38bdf8' : '#fbbf24'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
