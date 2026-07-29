import React, { useState } from 'react';
import { Layers, Plus, BookOpen, SlidersHorizontal, Presentation, Sparkles } from 'lucide-react';
import { LessonPlan, PCPPPhase } from '../../types';
import { AttachmentsList } from '../AttachmentsList';
import { PRESET_TOPICS } from '../../data/presets';
import { PcppPhaseCard } from '../PcppPhaseCard';
import { BoardPlanSection } from '../BoardPlanSection';

interface FichesViewProps {
  plan: LessonPlan;
  setPlan: (plan: LessonPlan) => void;
  onSelectPreset: (preset: LessonPlan) => void;
  onAddPhase: () => void;
  onPhaseChange: (index: number, phase: PCPPPhase) => void;
  onMovePhase: (from: number, to: number) => void;
  onDeletePhase: (index: number) => void;
  onOpenAiGenerator: () => void;
  showToast: (msg: string) => void;
}

export const FichesView: React.FC<FichesViewProps> = ({
  plan,
  setPlan,
  onSelectPreset,
  onAddPhase,
  onPhaseChange,
  onMovePhase,
  onDeletePhase,
  onOpenAiGenerator,
  showToast,
}) => {
  const [fichesTab, setFichesTab] = useState<'sequence' | 'board'>('sequence');

  const handleExportPDF = () => {
    window.print();
  };

  const handleSaveJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `fiche_${plan.theme?.replace(/\s+/g, '_') || 'sans_nom'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSaveTemplate = () => {
    showToast("Fiche enregistrée comme modèle.");
  };

  const handleClearPlan = () => {
    if (confirm("Voulez-vous vraiment supprimer tout le contenu de cette fiche ?")) {
      setPlan({
        ...plan,
        theme: "",
        canDo: "",
        prerequisites: "",
        grammarPoints: [],
        materials: [],
        reviewTasks: "",
        funActivity: "",
        selfEvaluation: "",
        methodologyNotes: "",
        coherenceAnalysis: "",
        acquisitionRate: "",
        engagementMeasure: "",
        phases: [],
        attachments: [],
        boardPlan: {
          grammarPattern: '',
          exampleSentences: '',
          meaning: '',
          vocabulary: '',
          timelineOrDiagram: '',
          ccqOrConjugation: '',
          drillCues: ''
        }
      });
      showToast("La fiche a été réinitialisée.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation bar between PCPP Sequence and Board Plan */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          {['general', 'objectives', 'homework'].map(section => {
            const isHidden = plan.hiddenSections?.includes(section);
            return (
              <button key={section} onClick={() => {
                const newHidden = isHidden 
                  ? plan.hiddenSections.filter(s => s !== section)
                  : [...(plan.hiddenSections || []), section];
                setPlan({ ...plan, hiddenSections: newHidden });
              }} className={`text-[10px] px-2 py-1 rounded border ${isHidden ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30'}`}>
                {isHidden ? '+ Afficher' : '× Masquer'} {section === 'general' ? 'Info' : section === 'objectives' ? 'Objectifs' : 'Devoirs'}
              </button>
            )
          })}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFichesTab('sequence')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              fichesTab === 'sequence'
                ? 'bg-sky-500/30 text-sky-200 border border-sky-400'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Séquence PCPP (授業展開)</span>
          </button>

          <button
            onClick={() => setFichesTab('board')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              fichesTab === 'board'
                ? 'bg-teal-500/30 text-teal-200 border border-teal-400'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Plan de Tableau (黒板)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={onOpenAiGenerator} className="btn dark tiny flex items-center gap-1 text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Générer avec IA</span>
          </button>
        </div>
      </div>

      {/* Preset Topics Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider shrink-0 flex items-center gap-1 px-1">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Modèles:</span>
        </span>

        {PRESET_TOPICS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onSelectPreset(preset.defaultPlan as LessonPlan);
              showToast(`Chargé: ${preset.title}`);
            }}
            className="linkbtn dark shrink-0 flex items-center gap-1.5"
          >
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-200">
              {preset.level}
            </span>
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content View */}
      {fichesTab === 'sequence' ? (
        <div className="editwrap">
          {/* Left Spine Navigation Sidebar */}
          <aside className="spine">
            <div className="spine-in">
              <div className="sp-lab">Vue d'ensemble</div>
              <a href="#sec-general" className="sp-item sp-cur">
                <i>1</i>
                <span>Infos Générales <em>基本情報</em></span>
              </a>

              <div className="sp-lab">Phases PCPP</div>
              {plan.phases.map((p, idx) => (
                <a key={p.id || idx} href={`#sec-phase-${idx}`} className="sp-item">
                  <i>{idx + 2}</i>
                  <span>{p.title} <em>{p.type}</em></span>
                </a>
              ))}

              <div className="sp-lab">Actions</div>
              <button
                onClick={onAddPhase}
                className="sp-item text-sky-300 hover:text-white"
              >
                <i>+</i>
                <span>Ajouter Étape <em>追加</em></span>
              </button>
            </div>
          </aside>

          {/* Main Content Sheet */}
          <div className="sheet">
            
            {/* 1. Informations Générales */}
            {!plan.hiddenSections?.includes("general") && (<div id="sec-general" className="card-sec">
              <div className="sec-h">
                <div className="num">1</div>
                <span>Informations Générales (基本情報)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fld">
                  <span>Classe</span>
                  <input
                    type="text"
                    value={plan.classId}
                    onChange={(e) => setPlan({ ...plan, classId: e.target.value })}
                    placeholder="ex. N4 Soir"
                  />
                </div>
                <div className="fld">
                  <span>Date</span>
                  <input
                    type="date"
                    value={plan.date}
                    onChange={(e) => setPlan({ ...plan, date: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <span>Type de séance</span>
                  <input
                    type="text"
                    value={plan.sessionType}
                    onChange={(e) => setPlan({ ...plan, sessionType: e.target.value })}
                    placeholder="ex. Présentiel, En ligne"
                  />
                </div>
                <div className="fld">
                  <span>Durée (min)</span>
                  <input
                    type="number"
                    value={plan.totalDurationMinutes}
                    onChange={(e) => setPlan({ ...plan, totalDurationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="fld md:col-span-2">
                  <span>Titre de la leçon (授業タイトル)</span>
                  <input
                    type="text"
                    value={plan.title}
                    onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                    placeholder="ex. Demander la permission (～てもいいです)"
                  />
                </div>
                <div className="fld">
                  <span>Compétences visées 1</span>
                  <input
                    type="text"
                    value={plan.targetedSkills?.[0] || ''}
                    onChange={(e) => {
                      const newSkills = [...(plan.targetedSkills || [])];
                      newSkills[0] = e.target.value;
                      setPlan({ ...plan, targetedSkills: newSkills });
                    }}
                    placeholder="Compétence 1"
                  />
                </div>
                <div className="fld">
                  <span>Compétences visées 2</span>
                  <input
                    type="text"
                    value={plan.targetedSkills?.[1] || ''}
                    onChange={(e) => {
                      const newSkills = [...(plan.targetedSkills || [])];
                      newSkills[1] = e.target.value;
                      setPlan({ ...plan, targetedSkills: newSkills });
                    }}
                    placeholder="Compétence 2"
                  />
                </div>
                <div className="fld md:col-span-2">
                  <span>Matériel utilisé</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Projecteur', 'Impression', 'Carte', 'Tableau blanc', 'Manuel'].map(mat => {
                      const isActive = plan.materials?.includes(mat);
                      return (
                        <button key={mat} type="button" onClick={() => {
                          const newMats = isActive 
                            ? plan.materials.filter(m => m !== mat)
                            : [...(plan.materials || []), mat];
                          setPlan({ ...plan, materials: newMats });
                        }} className={`px-2 py-1 text-xs rounded border transition ${isActive ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                          {mat}
                        </button>
                      )
                    })}
                  </div>
                  <input
                    type="text"
                    value={(plan.materials || []).filter(m => !['Projecteur', 'Impression', 'Carte', 'Tableau blanc', 'Manuel'].includes(m)).join(', ')}
                    onChange={(e) => {
                      const standardMats = (plan.materials || []).filter(m => ['Projecteur', 'Impression', 'Carte', 'Tableau blanc', 'Manuel'].includes(m));
                      const customMats = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setPlan({ ...plan, materials: [...standardMats, ...customMats] });
                    }}
                    placeholder="Autre matériel (séparé par des virgules)"
                  />
                </div>
                
                {/* Manuels (Simplified array string for now, could be its own component) */}
                <div className="fld md:col-span-2">
                  <span>Manuel (livre → support → leçon → Can-Do)</span>
                  <input
                    type="text"
                    value={plan.textbookRef || ''}
                    onChange={(e) => setPlan({ ...plan, textbookRef: e.target.value })}
                    placeholder="ex. Minna no Nihongo L15"
                  />
                </div>
              </div>
            </div>

            )}
            {/* 2. Objectifs et prérequis */}
            {!plan.hiddenSections?.includes("objectives") && (<div id="sec-objectives" className="card-sec mt-4">
              <div className="sec-h">
                <div className="num">2</div>
                <span>Objectifs et prérequis (目標と前提知識)</span>
              </div>
              <div className="space-y-4">
                <div className="fld">
                  <div className="flex items-center justify-between">
                    <span>Liste de Can-Do</span>
                    <button 
                      onClick={() => {
                        const newObjs = [...(plan.objectives || []), { id: Date.now().toString(), text: '' }];
                        setPlan({ ...plan, objectives: newObjs });
                      }}
                      className="text-[10px] bg-slate-800 px-2 py-1 rounded text-white"
                    >+ Ajouter</button>
                  </div>
                  {(plan.objectives || []).map((obj, i) => (
                    <div key={obj.id} className="flex gap-2 mt-2">
                      <span className="text-slate-400 text-xs py-1 shrink-0">Can-Do {i+1} :</span>
                      <input 
                        type="text" 
                        value={obj.text}
                        onChange={(e) => {
                          const newObjs = [...plan.objectives];
                          newObjs[i].text = e.target.value;
                          setPlan({ ...plan, objectives: newObjs });
                        }}
                      />
                      <button 
                        onClick={() => {
                          const newObjs = plan.objectives.filter((_, idx) => idx !== i);
                          setPlan({ ...plan, objectives: newObjs });
                        }}
                        className="text-rose-400 px-2"
                      >×</button>
                    </div>
                  ))}
                </div>
                <div className="fld">
                  <span>Prérequis</span>
                  <textarea 
                    rows={2} 
                    value={plan.prerequisites || ''}
                    onChange={(e) => setPlan({ ...plan, prerequisites: e.target.value })}
                    placeholder="Prérequis pour cette leçon"
                  ></textarea>
                  <label className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={plan.prerequisitesChecked || false}
                      onChange={(e) => setPlan({ ...plan, prerequisitesChecked: e.target.checked })}
                    />
                    Vérification des prérequis effectuée
                  </label>
                </div>
              </div>
            </div>

            )}
            {/* PCPP Phase Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between my-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Séquence Pédagogique PCPP (授業展開)</span>
                </h3>

                <button onClick={onAddPhase} className="btn primary tiny">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une étape</span>
                </button>
              </div>

              {plan.phases.map((phase, idx) => (
                <div id={`sec-phase-${idx}`} key={phase.id || idx}>
                  <PcppPhaseCard
                    phase={phase}
                    index={idx}
                    totalPhases={plan.phases.length}
                    onChange={(updated) => onPhaseChange(idx, updated)}
                    onMoveUp={() => onMovePhase(idx, idx - 1)}
                    onMoveDown={() => onMovePhase(idx, idx + 1)}
                    onDelete={() => onDeletePhase(idx)}
                  />
                </div>
              ))}
            </div>

            {/* 5. Devoirs / Consolidation / Bilans */}
            {!plan.hiddenSections?.includes("homework") && (<div id="sec-homework" className="card-sec mt-4">
              <div className="sec-h">
                <div className="num">5</div>
                <span>Devoirs & Bilans (宿題・振り返り)</span>
              </div>
              <div className="space-y-4">
                <div className="fld">
                  <div className="flex items-center justify-between">
                    <span>Devoirs donnés</span>
                    <button 
                      onClick={() => {
                        const newHW = [...(plan.homeworks || []), { id: Date.now().toString(), description: '' }];
                        setPlan({ ...plan, homeworks: newHW });
                      }}
                      className="text-[10px] bg-slate-800 px-2 py-1 rounded text-white"
                    >+ Ajouter</button>
                  </div>
                  {(plan.homeworks || []).map((hw, i) => (
                    <div key={hw.id} className="flex gap-2 mt-2">
                      <input 
                        type="text" 
                        value={hw.description}
                        onChange={(e) => {
                          const newHW = [...plan.homeworks];
                          newHW[i].description = e.target.value;
                          setPlan({ ...plan, homeworks: newHW });
                        }}
                        placeholder="Description du devoir"
                      />
                      <button 
                        onClick={() => {
                          const newHW = plan.homeworks.filter((_, idx) => idx !== i);
                          setPlan({ ...plan, homeworks: newHW });
                        }}
                        className="text-rose-400 px-2"
                      >×</button>
                    </div>
                  ))}
                </div>
                
                <div className="fld">
                  <div className="flex items-center justify-between">
                    <span>Questions de bilan</span>
                    <button 
                      onClick={() => {
                        const newEvals = [...(plan.evaluations || []), { id: Date.now().toString(), text: '', responseType: 'comment' as const }];
                        setPlan({ ...plan, evaluations: newEvals });
                      }}
                      className="text-[10px] bg-slate-800 px-2 py-1 rounded text-white"
                    >+ Ajouter</button>
                  </div>
                  {(plan.evaluations || []).map((ev, i) => (
                    <div key={ev.id} className="flex gap-2 mt-2 items-center">
                      <input 
                        type="text" 
                        value={ev.text}
                        onChange={(e) => {
                          const newEvals = [...plan.evaluations];
                          newEvals[i].text = e.target.value;
                          setPlan({ ...plan, evaluations: newEvals });
                        }}
                        placeholder="Question de bilan"
                        className="flex-1"
                      />
                      <select 
                        value={ev.responseType}
                        onChange={(e) => {
                          const newEvals = [...plan.evaluations];
                          newEvals[i].responseType = e.target.value as 'comment' | '5stars' | 'multiple_choice';
                          setPlan({ ...plan, evaluations: newEvals });
                        }}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                      >
                        <option value="comment">Commentaire</option>
                        <option value="5stars">5 Étoiles</option>
                        <option value="multiple_choice">Choix multiple</option>
                      </select>
                      <button 
                        onClick={() => {
                          const newEvals = plan.evaluations.filter((_, idx) => idx !== i);
                          setPlan({ ...plan, evaluations: newEvals });
                        }}
                        className="text-rose-400 px-2"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            )}
            {/* 6. Fiches à imprimer & Export */}
            <div id="sec-export" className="card-sec mt-4">
              <div className="sec-h">
                <div className="num">6</div>
                <span>Fiches à imprimer & Export (印刷・エクスポート)</span>
              </div>
              <div className="space-y-4">
                <div className="fld">
                  <span>Fichiers joints (rassemblés automatiquement)</span>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 border-dashed">
                    <p className="text-xs text-slate-400 text-center">Aucun fichier joint détecté dans la fiche.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={handleExportPDF} className="btn primary flex items-center gap-2">
                    <span className="font-bold">Export PDF</span>
                  </button>
                  <button onClick={handleSaveJSON} className="btn dark flex items-center gap-2">
                    <span className="font-bold">Sauvegarde JSON</span>
                  </button>
                  <button onClick={handleSaveTemplate} className="btn dark flex items-center gap-2">
                    <span className="font-bold text-sky-400">Enregistrer comme modèle</span>
                  </button>
                  <button onClick={handleClearPlan} className="btn dark flex items-center gap-2">
                    <span className="font-bold text-rose-400">Supprimer la fiche</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Assistants intelligents */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-sky-900/40 to-indigo-900/40 border border-sky-500/30 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-sky-300 mb-1">Assistants Intelligents (AIサポート)</h4>
                <p className="text-xs text-slate-300 mb-2">
                  <strong>Suggestion:</strong> Le programme JLPT sur 12 semaines suggère que la prochaine leçon devrait se concentrer sur la compréhension orale (Listening). Voulez-vous générer des activités d'écoute adaptées ?
                </p>
                <div className="text-xs text-slate-400">
                  <em>Note:</em> Les éléments signalés « à reprendre » dans la fiche précédente ont été automatiquement intégrés dans les objectifs.
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <BoardPlanSection
          boardPlan={plan.boardPlan}
          onChange={(updatedBoard) => setPlan({ ...plan, boardPlan: updatedBoard })}
        />
      )}

    </div>
  );
};
