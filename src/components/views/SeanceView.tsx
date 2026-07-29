
import React, { useState } from 'react';
import { UserCheck, Star, Play, Pause, CheckCircle2, AlertTriangle, FileEdit, ClipboardList, PenTool, Check, Trash2, Save } from 'lucide-react';
import { LessonPlan, Student, SessionAttendance, StudentError, SessionReport } from '../../types';

interface SeanceViewProps {
  plan: LessonPlan;
  students: Student[];
  attendance: Record<string, SessionAttendance>;
  onUpdateAttendance: (studentId: string, updates: Partial<SessionAttendance>) => void;
  onBulkPresence: () => void;
  onResetAttendance: () => void;
}

type SeanceStep = 'grille' | 'corriger' | 'exercices' | 'rapport';

export const SeanceView: React.FC<SeanceViewProps> = ({
  plan,
  students,
  attendance,
  onUpdateAttendance,
  onBulkPresence,
  onResetAttendance
}) => {
  const [currentStep, setCurrentStep] = useState<SeanceStep>('grille');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Mocks for new steps state
  const [errors, setErrors] = useState<StudentError[]>([]);
  const [report, setReport] = useState<SessionReport>({ notes: '', unfinishedTasks: '', nextSessionFocus: '' });
  const [exerciseMax, setExerciseMax] = useState(20);
  const [exerciseScores, setExerciseScores] = useState<Record<string, number>>({});

  const totalMinutes = plan.totalDurationMinutes || 0;
  const progressPercent = totalMinutes > 0 ? Math.min(100, Math.round((elapsedMinutes / totalMinutes) * 100)) : 0;

  const presentCount = Object.values(attendance).filter((a: any) => a.status === 'P').length;
  const absentCount = Object.values(attendance).filter((a: any) => a.status === 'A').length;
  const lateCount = Object.values(attendance).filter((a: any) => a.status === 'R').length;
  const excusedCount = Object.values(attendance).filter((a: any) => a.status === 'AJ').length;

  const handleAddError = (studentId: string, category: StudentError['category'], description: string) => {
    setErrors([...errors, {
      id: Date.now().toString(),
      studentId,
      category,
      description,
      status: 'non corrigée',
      timestamp: new Date().toISOString()
    }]);
  };

  const handleUpdateError = (id: string, status: StudentError['status']) => {
    setErrors(errors.map(e => e.id === id ? { ...e, status } : e));
  };

  return (
    <div className="space-y-6">
      {/* Tracker PCPP & Session Header */}
      <div className="card-sec border border-sky-500/30 bg-gradient-to-r from-slate-900 to-sky-950/20">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white">{plan.title}</h2>
            <div className="text-xs text-sky-300 font-bold mt-1">
              Classe : {plan.classId || 'Non spécifiée'} | Temps total: {totalMinutes}m
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-slate-900/60 p-2 rounded-xl border border-white/10 shrink-0">
            <div className="text-2xl font-mono font-bold text-white tracking-wider w-20 text-center">
              {String(Math.floor(elapsedMinutes / 60)).padStart(2, '0')}:{String(elapsedMinutes % 60).padStart(2, '0')}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                isTimerRunning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              }`}
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-sky-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'grille', label: 'Grille', icon: UserCheck },
          { id: 'corriger', label: 'À corriger', icon: PenTool },
          { id: 'exercices', label: 'Exercices', icon: FileEdit },
          { id: 'rapport', label: 'Rapport', icon: ClipboardList }
        ].map(step => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id as SeanceStep)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              currentStep === step.id
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                : 'bg-slate-900 border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <step.icon className="w-4 h-4" />
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: GRILLE */}
      {currentStep === 'grille' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
              <span className="text-xs font-bold text-emerald-300 block">Présents (出席)</span>
              <span className="text-xl font-extrabold text-white">{presentCount} / {students.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
              <span className="text-xs font-bold text-amber-300 block">Retards (遅刻)</span>
              <span className="text-xl font-extrabold text-white">{lateCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
              <span className="text-xs font-bold text-rose-300 block">Absents (欠席)</span>
              <span className="text-xl font-extrabold text-white">{absentCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-center">
              <span className="text-xs font-bold text-sky-300 block">Excusés (公欠)</span>
              <span className="text-xl font-extrabold text-white">{excusedCount}</span>
            </div>
          </div>

          <div className="card-sec space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Grille de Présence (出席)</span>
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={onBulkPresence} className="btn primary tiny">Tous Présents</button>
                <button onClick={onResetAttendance} className="btn dark tiny">Réinitialiser</button>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const att = attendance[student.id] || { studentId: student.id, status: 'P', assiduite: 'good', participationStars: 5 };
                return (
                  <div key={student.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-sky-500/40 transition">
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-400/40 flex items-center justify-center font-extrabold text-sky-200 text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{student.name}</span>
                          {student.kanjiName && <span className="text-[11px] text-sky-300 font-japanese font-normal">({student.kanjiName})</span>}
                        </h3>
                        <span className="text-[10px] text-slate-400 block">{student.classGroup}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button onClick={() => onUpdateAttendance(student.id, { status: 'P' })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${att.status === 'P' ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-slate-950 text-slate-400 border-white/10 hover:bg-slate-800'}`}>🟢 Présent</button>
                      <button onClick={() => onUpdateAttendance(student.id, { status: 'R' })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${att.status === 'R' ? 'bg-amber-500/30 text-amber-200 border-amber-400' : 'bg-slate-950 text-slate-400 border-white/10 hover:bg-slate-800'}`}>🟡 Retard</button>
                      <button onClick={() => onUpdateAttendance(student.id, { status: 'A' })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${att.status === 'A' ? 'bg-rose-500/30 text-rose-200 border-rose-400' : 'bg-slate-950 text-slate-400 border-white/10 hover:bg-slate-800'}`}>🔴 Absent</button>
                      <button onClick={() => onUpdateAttendance(student.id, { status: 'AJ' })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${att.status === 'AJ' ? 'bg-sky-500/30 text-sky-200 border-sky-400' : 'bg-slate-950 text-slate-400 border-white/10 hover:bg-slate-800'}`}>🔵 Excusé</button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select value={att.assiduite} onChange={(e) => onUpdateAttendance(student.id, { assiduite: e.target.value as any })} className="bg-slate-950 border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-sky-400 outline-none">
                        <option value="good">⭐ Bonne assiduité</option>
                        <option value="average">⚡ Moyenne</option>
                        <option value="needs_work">⚠️ À améliorer</option>
                      </select>
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => onUpdateAttendance(student.id, { participationStars: star })} className="p-0.5 hover:scale-110 transition">
                            <Star className={`w-3.5 h-3.5 ${star <= (att.participationStars || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: À CORRIGER */}
      {currentStep === 'corriger' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-sky-900/30 border border-sky-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-sky-300">Points à retravailler (reportés)</h3>
              <p className="text-xs text-sky-100/80 mt-1">Aucune erreur n'a été reportée depuis la dernière séance pour cette classe.</p>
            </div>
          </div>

          <div className="card-sec">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-rose-400" />
              <span>Consigner une erreur (エラー記録)</span>
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const sid = fd.get('studentId') as string;
              const cat = fd.get('category') as any;
              const desc = fd.get('description') as string;
              if(sid && cat && desc) {
                handleAddError(sid, cat, desc);
                (e.target as HTMLFormElement).reset();
              }
            }} className="flex flex-col md:flex-row gap-3">
              <select name="studentId" required className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                <option value="">Sélectionner un élève...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select name="category" required className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                <option value="">Catégorie...</option>
                <option value="Particules">Particules</option>
                <option value="Kanji">Kanji</option>
                <option value="Vocabulaire">Vocabulaire</option>
                <option value="Conjugaison">Conjugaison</option>
                <option value="Prononciation">Prononciation</option>
                <option value="Autre">Autre</option>
              </select>
              <input name="description" required placeholder="Description de l'erreur observée..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
              <button type="submit" className="btn primary">Ajouter</button>
            </form>

            <div className="mt-6 space-y-2">
              {errors.map(err => {
                const s = students.find(s => s.id === err.studentId);
                return (
                  <div key={err.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{s?.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{err.category}</span>
                      </div>
                      <p className="text-xs text-slate-300">{err.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => handleUpdateError(err.id, 'corrigée')} className={`p-1.5 rounded-lg border text-[10px] font-bold transition ${err.status === 'corrigée' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'}`}>
                        Corrigée
                      </button>
                      <button onClick={() => handleUpdateError(err.id, 'non corrigée')} className={`p-1.5 rounded-lg border text-[10px] font-bold transition ${err.status === 'non corrigée' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'}`}>
                        Non corrigée
                      </button>
                      <button onClick={() => handleUpdateError(err.id, 'reportée')} className={`p-1.5 rounded-lg border text-[10px] font-bold transition ${err.status === 'reportée' ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'}`}>
                        Reportée
                      </button>
                    </div>
                  </div>
                );
              })}
              {errors.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">Aucune erreur consignée pour le moment.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EXERCICES */}
      {currentStep === 'exercices' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="card-sec">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-indigo-400" />
                <span>Notation des Exercices (演習・テスト)</span>
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Note max :</span>
                <input type="number" value={exerciseMax} onChange={(e) => setExerciseMax(Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="-"
                      value={exerciseScores[s.id] !== undefined ? exerciseScores[s.id] : ''} 
                      onChange={(e) => setExerciseScores({...exerciseScores, [s.id]: Number(e.target.value)})} 
                      className="w-14 bg-slate-950 border border-slate-700 rounded p-1 text-center text-xs text-white" 
                    />
                    <span className="text-xs text-slate-500">/ {exerciseMax}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: RAPPORT */}
      {currentStep === 'rapport' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="card-sec space-y-4">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2 border-b border-white/10 pb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-sky-400" />
              <span>Rapport de fin de séance (授業レポート)</span>
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Notes générales</label>
                <textarea rows={3} value={report.notes} onChange={e => setReport({...report, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white" placeholder="Déroulement de la séance, remarques globales..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ce qui n'a pas été terminé (à reprendre)</label>
                <textarea rows={2} value={report.unfinishedTasks} onChange={e => setReport({...report, unfinishedTasks: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white" placeholder="Ex: L'exercice 4 n'a pas pu être fait par manque de temps..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Focus pour la prochaine séance</label>
                <textarea rows={2} value={report.nextSessionFocus} onChange={e => setReport({...report, nextSessionFocus: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white" placeholder="Ex: Insister sur la conjugaison du groupe 1..." />
              </div>
            </div>

            
              <div className="pt-4 border-t border-white/10 mt-2 mb-4">
                <label className="text-xs font-bold text-slate-300 block mb-2">Bilan de la séance (Format d'évaluation)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    onClick={() => setReport({...report, bilanFormat: 'comment'})} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${report.bilanFormat === 'comment' || !report.bilanFormat ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Commentaire
                  </button>
                  <button 
                    onClick={() => setReport({...report, bilanFormat: '5stars'})} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${report.bilanFormat === '5stars' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Évaluation 5 Étoiles
                  </button>
                  <button 
                    onClick={() => setReport({...report, bilanFormat: 'multiple_choice'})} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${report.bilanFormat === 'multiple_choice' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Choix Multiple
                  </button>
                </div>

                {(!report.bilanFormat || report.bilanFormat === 'comment') && (
                  <textarea rows={3} value={report.bilanContent || ''} onChange={e => setReport({...report, bilanContent: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white" placeholder="Rédigez votre bilan..." />
                )}
                {report.bilanFormat === '5stars' && (
                  <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReport({...report, bilanContent: star.toString()})} className="p-1 hover:scale-110 transition">
                        <svg className={`w-8 h-8 ${Number(report.bilanContent) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </button>
                    ))}
                    <span className="ml-3 text-xs font-bold text-slate-300">
                      {report.bilanContent ? `${report.bilanContent} / 5 étoiles` : 'Sélectionnez une note'}
                    </span>
                  </div>
                )}
                {report.bilanFormat === 'multiple_choice' && (
                  <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    {['Excellente séance', 'Séance moyenne, quelques difficultés', 'Difficile, à revoir en profondeur', 'Objectifs non atteints'].map(choice => (
                      <label key={choice} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-2 hover:bg-slate-800 rounded">
                        <input type="radio" name="bilanMCQ" value={choice} checked={report.bilanContent === choice} onChange={(e) => setReport({...report, bilanContent: e.target.value})} className="text-sky-500" />
                        {choice}
                      </label>
                    ))}
                  </div>
                )}
              </div>
<div className="flex justify-end pt-4 border-t border-white/10 mt-4">
              <button className="btn primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Terminer et enregistrer la séance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
