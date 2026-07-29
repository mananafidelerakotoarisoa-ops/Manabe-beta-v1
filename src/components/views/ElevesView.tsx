
import React, { useState } from 'react';
import { Users, Search, Plus, UserCheck, Trash2, X, Activity, BookOpen, AlertCircle, TrendingUp, BarChart3, ChevronLeft, Star } from 'lucide-react';
import { Student, JLPTLevel, SessionData } from '../../types';

interface ElevesViewProps {
  students: Student[];
  sessions: SessionData[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const ElevesView: React.FC<ElevesViewProps> = ({ students, sessions = [], onAddStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newKanji, setNewKanji] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newJlpt, setNewJlpt] = useState<JLPTLevel>('N5');
  const [newNotes, setNewNotes] = useState('');

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.kanjiName && s.kanjiName.includes(searchTerm));
    const matchesLevel = selectedLevel === 'all' || s.jlptTarget === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
      name: newName,
      kanjiName: newKanji,
      classGroup: newGroup,
      jlptTarget: newJlpt,
      presenceRate: 100, // Default for new
      lastStatus: 'P',
      notes: newNotes,
    });
    setIsAddModalOpen(false);
    setNewName('');
    setNewKanji('');
    setNewGroup('');
    setNewNotes('');
  };

  const renderStudentDetails = (student: Student) => {
    // Collect stats from sessions
    const studentSessions = sessions.filter(s => s.attendance[student.id]);
    const studentErrors = sessions.flatMap(s => s.errors || []).filter(e => e.studentId === student.id);
    const avgParticipation = studentSessions.length > 0 
      ? studentSessions.reduce((acc, s) => acc + (s.attendance[student.id].participationStars || 0), 0) / studentSessions.length 
      : 0;
      
    // Error Categories Data
    const errorCats = studentErrors.reduce((acc, err) => {
      acc[err.category] = (acc[err.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedStudent(null)} className="btn dark tiny flex items-center gap-1.5 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </button>

        <div className="card-sec border-l-4 border-l-indigo-400 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <UserCheck className="w-32 h-32" />
          </div>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-sky-500/40 border border-indigo-400/50 flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{student.name}</span>
                {student.kanjiName && (
                  <span className="text-lg text-sky-300 font-japanese font-normal">({student.kanjiName})</span>
                )}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">{student.classGroup}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold">Objectif {student.jlptTarget}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">{student.notes}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-sec bg-gradient-to-br from-slate-900 to-emerald-950/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Activity className="w-4 h-4" />
              <h3 className="text-sm font-bold">Assiduité</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{student.presenceRate}%</div>
            <p className="text-xs text-slate-400 mt-1">{studentSessions.length} séances participées</p>
          </div>
          
          <div className="card-sec bg-gradient-to-br from-slate-900 to-amber-950/20">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Star className="w-4 h-4" />
              <h3 className="text-sm font-bold">Participation</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{avgParticipation.toFixed(1)} <span className="text-lg">/ 5</span></div>
            <p className="text-xs text-slate-400 mt-1">Moyenne globale</p>
          </div>

          <div className="card-sec bg-gradient-to-br from-slate-900 to-rose-950/20">
            <div className="flex items-center gap-2 mb-2 text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <h3 className="text-sm font-bold">Erreurs notées</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{studentErrors.length}</div>
            <p className="text-xs text-slate-400 mt-1">À retravailler</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-sec">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Répartition des erreurs</span>
            </h3>
            {Object.keys(errorCats).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(errorCats).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(Number(count) / studentErrors.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">Aucune erreur enregistrée.</div>
            )}
          </div>
          
          <div className="card-sec">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Historique Récent</span>
            </h3>
            <div className="space-y-2">
              {studentSessions.slice(-5).reverse().map(session => (
                <div key={session.id} className="p-2 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white font-bold">{session.date}</div>
                    <div className="text-[10px] text-slate-400">Séance</div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      session.attendance[student.id].status === 'P' ? 'bg-emerald-500/20 text-emerald-400' :
                      session.attendance[student.id].status === 'R' ? 'bg-amber-500/20 text-amber-400' :
                      session.attendance[student.id].status === 'A' ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      {session.attendance[student.id].status}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-slate-300 flex items-center gap-0.5">
                      {session.attendance[student.id].participationStars}<Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
                    </span>
                  </div>
                </div>
              ))}
              {studentSessions.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">Aucune séance enregistrée.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedStudent) {
    return renderStudentDetails(selectedStudent);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            Gestion des Élèves <span className="text-sky-400 font-light">/ 生徒管理</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Répertoire de tous les élèves. Cliquez sur une carte pour voir l'historique détaillé.
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn primary flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Inscrire un Élève (生徒追加)</span>
        </button>
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
            placeholder="Rechercher par nom ou kanji..."
            className="w-full bg-slate-900/90 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>

        {/* JLPT Level Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl as JLPTLevel | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border shrink-0 ${
                selectedLevel === lvl
                  ? 'bg-sky-500/30 text-sky-200 border-sky-400'
                  : 'bg-slate-900/60 text-slate-400 border-white/10 hover:bg-slate-800'
              }`}
            >
              {lvl === 'all' ? 'Tous les niveaux' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Students List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedStudent(student)}
            className="card-sec border border-white/10 hover:border-indigo-400/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-sky-500/40 border border-indigo-400/50 flex items-center justify-center font-extrabold text-white text-base shadow-lg group-hover:scale-105 transition-transform">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{student.name}</span>
                      {student.kanjiName && (
                        <span className="text-[10px] text-sky-300 font-japanese font-normal">({student.kanjiName})</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{student.classGroup}</span>
                  </div>
                </div>
              </div>

              {/* Attendance & Assiduité Progress */}
              <div className="mt-4 space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Taux de Présence:</span>
                  <span className={`${student.presenceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{student.presenceRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${student.presenceRate >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${student.presenceRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-auto">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Objectif {student.jlptTarget}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteStudent(student.id); }}
                className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/20 text-xs flex items-center gap-1 transition"
                title="Supprimer l'élève"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-white/5 border-dashed">
            Aucun élève trouvé.
          </div>
        )}
      </div>

      {/* Modal: Add New Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-sec max-w-md w-full border border-sky-400/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Inscrire un nouvel élève (生徒追加)</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="fld">
                <span>Nom & Prénom (氏名) *</span>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex. Aina Rasoanaivo"
                />
              </div>
              <div className="fld">
                <span>Nom en Kanji / Kana (漢字名)</span>
                <input
                  type="text"
                  value={newKanji}
                  onChange={(e) => setNewKanji(e.target.value)}
                  placeholder="ex. アイナ"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="fld">
                  <span>Classe / Groupe</span>
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                  />
                </div>
                <div className="fld">
                  <span>Niveau JLPT</span>
                  <select
                    value={newJlpt}
                    onChange={(e) => setNewJlpt(e.target.value as JLPTLevel)}
                  >
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                </div>
              </div>
              <div className="fld">
                <span>Notes pédagogiques initiales</span>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ex. Débutant motivé, bon niveau en conversation."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn dark tiny">
                  Annuler
                </button>
                <button type="submit" className="btn primary tiny">
                  Valider l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
