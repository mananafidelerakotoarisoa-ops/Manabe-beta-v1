const fs = require('fs');
let code = fs.readFileSync('src/components/PcppPhaseCard.tsx', 'utf8');

const additionalFields = `
        {/* Type-Specific Fields */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          {phase.type === 'presentation' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Script d'introduction orale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.oralIntroScript || ''} onChange={e => onChange({ ...phase, oralIntroScript: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.oralIntroScript || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Notes d'auto-pertinence</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.selfRelevanceNotes || ''} onChange={e => onChange({ ...phase, selfRelevanceNotes: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.selfRelevanceNotes || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Mise en évidence de la forme</span>
                {isEditing ? (
                  <input type="text" value={phase.formHighlighting || ''} onChange={e => onChange({ ...phase, formHighlighting: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.formHighlighting || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Plan d'interaction orale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.interactionPlan || ''} onChange={e => onChange({ ...phase, interactionPlan: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.interactionPlan || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'comprehension' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Recherche d'information / Lecture</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.globalSearchActivities || ''} onChange={e => onChange({ ...phase, globalSearchActivities: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.globalSearchActivities || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Activités d'écoute (dicto-composition)</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.listeningActivities || ''} onChange={e => onChange({ ...phase, listeningActivities: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.listeningActivities || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Journal des erreurs anticipées</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.anticipatedErrors || ''} onChange={e => onChange({ ...phase, anticipatedErrors: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.anticipatedErrors || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'practice' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Exercices structuraux</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.structuralExercises || ''} onChange={e => onChange({ ...phase, structuralExercises: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.structuralExercises || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Lecture orale (read-and-look-up)</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.oralReading || ''} onChange={e => onChange({ ...phase, oralReading: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.oralReading || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Écriture personnalisée</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.customWriting || ''} onChange={e => onChange({ ...phase, customWriting: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.customWriting || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Stratégie de correction</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.correctionStrategy || ''} onChange={e => onChange({ ...phase, correctionStrategy: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.correctionStrategy || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}

          {phase.type === 'production' && (
            <>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Tâche communicative</span>
                {isEditing ? (
                  <div className="flex gap-2">
                    <select 
                      value={phase.communicativeTaskType || 'débat'} 
                      onChange={e => onChange({ ...phase, communicativeTaskType: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="débat">Débat</option>
                      <option value="jeu de rôle">Jeu de rôle</option>
                      <option value="récit">Récit</option>
                      <option value="autre">Autre</option>
                    </select>
                    <input type="text" placeholder="Description" value={phase.communicativeTaskDesc || ''} onChange={e => onChange({ ...phase, communicativeTaskDesc: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                  </div>
                ) : (
                  <p className="text-slate-300 text-xs capitalize">{phase.communicativeTaskType} : {phase.communicativeTaskDesc || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Critères de réussite</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.successCriteria || ''} onChange={e => onChange({ ...phase, successCriteria: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.successCriteria || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Activité d'apprentissage actif</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.activeLearningActivity || ''} onChange={e => onChange({ ...phase, activeLearningActivity: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.activeLearningActivity || 'Non spécifié'}</p>
                )}
              </div>
              <div className="fld">
                <span className="font-bold text-slate-300 text-xs">Plan de réutilisation en spirale</span>
                {isEditing ? (
                  <textarea rows={2} value={phase.spiralReusePlan || ''} onChange={e => onChange({ ...phase, spiralReusePlan: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                ) : (
                  <p className="text-slate-300 text-xs">{phase.spiralReusePlan || 'Non spécifié'}</p>
                )}
              </div>
            </>
          )}
        </div>
`;

code = code.replace(/\{(\/\* Teaching Materials \*\/)/, additionalFields + "\n        {$1");

fs.writeFileSync('src/components/PcppPhaseCard.tsx', code);
