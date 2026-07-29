import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { LessonPlan, VisionFilter, ActiveTab, Student, SessionAttendance, Teacher, AppTheme, BackgroundId } from './types';
import { PRESET_TOPICS } from './data/presets';
import { INITIAL_SESSIONS } from './data/mockSessions';
import { INITIAL_STUDENTS, INITIAL_ATTENDANCE } from './data/mockStudents';
import { getInitialTeacher, AUTH_STORAGE_KEY } from './data/teachers';
import { auditLessonPlanAccessibility } from './utils/accessibilityChecker';

import { Header } from './components/Header';
import { BottomBar } from './components/BottomBar';
import { initAuth, googleSignIn, logout, getAccessToken } from './lib/firebase';
import { savePlan, loadPlans, saveStudent, loadStudents, saveSession, loadSessions } from './lib/db';
import { SlidingDrawer } from './components/SlidingDrawer';
import { LoginView } from './components/LoginView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { AccessibilityInspectorModal } from './components/AccessibilityInspectorModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { PrintView } from './components/PrintView';

// View Components for the 5 Tabs
import { AccueilView } from './components/views/AccueilView';
import { SeancesListView } from './components/views/SeancesListView';
import { SeanceView } from './components/views/SeanceView';
import { FichesView } from './components/views/FichesView';
import { ElevesView } from './components/views/ElevesView';
import { AnalyseView } from './components/views/AnalyseView';

export function App() {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(getInitialTeacher);
  const [plan, setPlan] = useState<LessonPlan>(PRESET_TOPICS[0].defaultPlan as LessonPlan);
  const [activeTab, setActiveTab] = useState<ActiveTab>('accueil');
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const [background, setBackground] = useState<BackgroundId>('bg-1');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [attendance, setAttendance] = useState<Record<string, SessionAttendance>>(INITIAL_ATTENDANCE);

  const [visionFilter, setVisionFilter] = useState<VisionFilter>('none');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDbLoading, setIsDbLoading] = useState(false);

  useEffect(() => {
    if (currentTeacher) {
      setIsDbLoading(true);
      Promise.all([
        loadPlans(currentTeacher.id),
        loadStudents(currentTeacher.id),
        loadSessions(currentTeacher.id)
      ]).then(([loadedPlans, loadedStudents, loadedSessions]) => {
        if (loadedPlans && loadedPlans.length > 0) {
          setPlan(loadedPlans[0]);
        }
        if (loadedStudents && loadedStudents.length > 0) {
          setStudents(loadedStudents);
        }
        if (loadedSessions && loadedSessions.length > 0) {
          setSessions(loadedSessions);
        }
        setIsDbLoading(false);
      }).catch(err => {
        console.error("Failed to load from DB", err);
        setIsDbLoading(false);
      });
    }
  }, [currentTeacher?.id]);

  // Save to DB when state changes
  useEffect(() => {
    if (currentTeacher && plan && !isDbLoading) {
      savePlan(currentTeacher.id, plan);
    }
  }, [plan, currentTeacher, isDbLoading]);

  useEffect(() => {
    if (currentTeacher && students && students.length > 0 && !isDbLoading) {
      students.forEach(s => saveStudent(currentTeacher.id, s));
    }
  }, [students, currentTeacher, isDbLoading]);

  useEffect(() => {
    if (currentTeacher && sessions && sessions.length > 0 && !isDbLoading) {
      sessions.forEach(s => saveSession(currentTeacher.id, s));
    }
  }, [sessions, currentTeacher, isDbLoading]);

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const auditResult = auditLessonPlanAccessibility(plan);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoginSuccess = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    showToast(`Bienvenue, Sensei ${teacher.name} !`);
  };

  const handleLogout = async () => {
    await logout();
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setCurrentTeacher(null);
  };

  const handleSwitchTeacher = (teacher: Teacher) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, teacher.id);
    } catch (e) {
      // ignore
    }
    setCurrentTeacher(teacher);
    showToast(`Changement de compte : Sensei ${teacher.name}`);
  };

  // If user is not logged in as one of the 3 teachers, show Login Screen
  if (!currentTeacher) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  
  
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedPlan = JSON.parse(content);
        if (parsedPlan && parsedPlan.id) {
          setPlan({ ...plan, ...parsedPlan, id: 'imported-' + Date.now() });
          showToast('Modèle importé avec succès !');
          setActiveTab('fiches');
        } else {
          showToast('Fichier JSON invalide.');
        }
      } catch (err) {
        showToast('Erreur lors de la lecture du fichier.');
      }
    };
    reader.readAsText(file);
  };


  const handleExportDrive = async () => {
    let currentUser = user;
    let currentToken = googleToken;

    if (!currentUser || !currentToken) {
      showToast('Connexion à Google Drive...');
      try {
        const authResult = await googleSignIn();
        if (authResult) {
          currentUser = authResult.user;
          currentToken = authResult.accessToken;
          setUser(currentUser);
          setGoogleToken(currentToken);
        } else {
          showToast('Erreur: Connexion annulée.');
          return;
        }
      } catch (err: any) {
        showToast('Erreur de connexion Google: ' + err.message);
        return;
      }
    }
    
    showToast('Sauvegarde dans Google Drive...');
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch('/api/drive/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
          'x-goog-token': currentToken
        },
        body: JSON.stringify({
          fileName: `Fiche_PCPP_${plan.title.replace(/\s+/g, '_')}_${Date.now()}.json`,
          content: plan
        })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('✅ Fiche sauvegardée dans Google Drive !');
      } else {
        showToast('Erreur lors de la sauvegarde : ' + data.error);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Erreur lors de la sauvegarde.');
    }
  };

  const handleExportPdf = () => {
    window.print();
  };


  const handleNewPlan = () => {
    setPlan({
      id: 'plan-' + Date.now(),
      title: 'Nouveau cours de japonais (新規授業計画)',
      targetLevel: 'N5',
      grammarPoint: 'V-て形 + ください',
      grammarPointMeaning: 'Demande polie (S\'il vous plaît...)',
      totalDurationMinutes: 50,
      targetVocab: ['写真（しゃしん）を撮（と）る', '携帯（けいたい）を使（つか）う'],
      targetKanji: ['写', '真', '入'],
      phases: [
        {
          id: 'p-1',
          type: 'presentation',
          title: 'Présentation (導入)',
          titleJa: '導入',
          durationMinutes: 10,
          objective: 'Présenter le motif grammatical dans un contexte visuel naturel.',
          teacherAction: 'T montre une image de bibliothèque et modélise 「静かにしてください」.',
          studentAction: 'S écoute et remarque la structure V-te + kudasai.',
          materialsNeeded: ['Cartes imagées', 'Tableau blanc']
        },
        {
          id: 'p-2',
          type: 'comprehension',
          title: 'Vérification de compréhension (理解確認)',
          titleJa: '理解確認',
          durationMinutes: 10,
          objective: 'Vérifier la compréhension de la forme et du sens.',
          teacherAction: 'T pose des questions de vérification de concept (CCQs).',
          studentAction: 'S répond par Vrai/Faux ou choisit le contexte approprié.',
          materialsNeeded: ['Cartes CCQ']
        },
        {
          id: 'p-3',
          type: 'practice',
          title: 'Pratique dirigée (練習)',
          titleJa: '練習',
          durationMinutes: 15,
          objective: 'Entraînement à la transformation verbale.',
          teacherAction: 'T propose des verbes à la forme neutre, S transforme en V-te + kudasai.',
          studentAction: 'S répète en chœur puis individuellement.',
          materialsNeeded: ['Tableau de transformation verbale']
        },
        {
          id: 'p-4',
          type: 'production',
          title: 'Production communicative (応用)',
          titleJa: '応用',
          durationMinutes: 15,
          objective: 'Tâche communicative appliquant le nouveau motif.',
          teacherAction: 'T met en place un jeu de rôle (demander de l\'aide en classe).',
          studentAction: 'S travaille en binômes pour exprimer des requêtes polies.',
          materialsNeeded: ['Cartes de scenario']
        }
      ],
      boardPlan: {
        title: 'V-て形 + ください (Demande polie)',
        grammarPattern: 'V-て形 + ください',
        exampleSentenceJa: 'ここに なまえを かいて ください。',
        exampleSentenceRomaji: 'Koko ni namae o kaite kudasai.',
        exampleSentenceEn: 'S\'il vous plaît, écrivez votre nom ici.',
        notes: ['Forme en -te + kudasai']
      },
      teacherNotes: 'Maintenir la présentation concise pour maximiser la prise de parole des élèves.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    showToast('Nouvelle fiche de cours créée avec succès !');
  };

  const handleOptimizeLightness = () => {
    const optimizedPhases = plan.phases.map(phase => ({
      ...phase,
      teacherAction: phase.teacherAction
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`)
        .slice(0, 3)
        .join('\n'),
      studentAction: phase.studentAction
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`)
        .slice(0, 3)
        .join('\n')
    }));

    setPlan({
      ...plan,
      phases: optimizedPhases
    });
    showToast('Légèreté de préparation optimisée ! Instructions condensées.');
  };

  const handlePhaseChange = (index: number, updatedPhase: any) => {
    const newPhases = [...plan.phases];
    newPhases[index] = updatedPhase;
    setPlan({ ...plan, phases: newPhases });
  };

  const handleMovePhase = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= plan.phases.length) return;
    const newPhases = [...plan.phases];
    const [moved] = newPhases.splice(fromIdx, 1);
    newPhases.splice(toIdx, 0, moved);
    setPlan({ ...plan, phases: newPhases });
  };

  const handleDeletePhase = (index: number) => {
    const newPhases = [...plan.phases];
    newPhases.splice(index, 1);
    setPlan({ ...plan, phases: newPhases });
  };

  const handleAddPhase = () => {
    const newPhase = {
      id: 'p-' + Date.now(),
      type: 'practice' as const,
      title: 'Pratique supplémentaire (追加練習)',
      titleJa: '練習',
      durationMinutes: 10,
      objective: 'Renforcer le motif grammatical avec une activité secondaire.',
      teacherAction: 'T introduit une carte d\'exercice secondaire.',
      studentAction: 'S travaille en binôme pour accomplir la tâche.',
      materialsNeeded: ['Fiche d\'exercice']
    };
    setPlan({ ...plan, phases: [...plan.phases, newPhase] });
  };

  // Attendance Handlers
  const handleUpdateAttendance = (studentId: string, updates: Partial<SessionAttendance>) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], ...updates }
    }));
    showToast('Mise à jour de la présence enregistrée.');
  };

  const handleBulkPresence = () => {
    const updated: Record<string, SessionAttendance> = {};
    students.forEach((s) => {
      updated[s.id] = {
        studentId: s.id,
        status: 'P',
        assiduite: 'good',
        participationStars: 5,
        notes: 'Présent(e) à l\'appel général'
      };
    });
    setAttendance(updated);
    showToast('Tous les élèves ont été marqués Présents !');
  };

  const handleResetAttendance = () => {
    setAttendance(INITIAL_ATTENDANCE);
    showToast('Grille de présence réinitialisée.');
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Élève ${newStudent.name} inscrit(e) avec succès !`);
  };

  const handleUpdateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Fiche élève mise à jour.');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('Élève supprimé de la liste.');
  };

  const getVisionFilterStyle = () => {
    switch (visionFilter) {
      case 'protanopia':
        return { filter: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'protanopia\'><feColorMatrix type=\'matrix\' values=\'0.56667, 0.43333, 0, 0, 0, 0.55833, 0.44167, 0, 0, 0, 0, 0.24167, 0.75833, 0, 0, 0, 0, 0, 1, 0\'/></filter></svg>#protanopia")' };
      case 'deuteranopia':
        return { filter: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'deuteranopia\'><feColorMatrix type=\'matrix\' values=\'0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0\'/></filter></svg>#deuteranopia")' };
      case 'tritanopia':
        return { filter: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'tritanopia\'><feColorMatrix type=\'matrix\' values=\'0.95, 0.05, 0, 0, 0, 0, 0.43333, 0.56667, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0\'/></filter></svg>#tritanopia")' };
      case 'highContrast':
        return { filter: 'contrast(150%) saturate(120%)' };
      default:
        return {};
    }
  };

  return (
    <div className={`min-h-screen font-sans relative pb-28 theme-${theme} ${background}`} style={getVisionFilterStyle()}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show" role="status">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Header (.top) with Menu Button in Upper Right */}
      <Header
        accessibilityScore={auditResult.score}
        cognitiveLoadScore={auditResult.cognitiveLoadScore}
        visionFilter={visionFilter}
        currentTeacher={currentTeacher}
        onLogout={handleLogout}
        setVisionFilter={setVisionFilter}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenAccessibilityInspector={() => setIsAccessibilityModalOpen(true)}
        onOpenCloudSync={() => setIsCloudSyncModalOpen(true)}
        onExportPdf={handleExportPdf}
        onImportJson={handleImportJson}
        onExportDrive={handleExportDrive}
        onNewPlan={handleNewPlan}
        onToggleDrawer={() => setIsDrawerOpen(prev => !prev)}
      />

      {/* Main Dynamic View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">
        
        {/* Tab 1: Accueil */}
        {activeTab === 'accueil' && (
          <AccueilView
            plan={plan}
            students={students}
            onSelectPreset={(preset) => {
              setPlan(preset);
              showToast(`Fiche de cours "${preset.title}" sélectionnée !`);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
            onNewPlan={handleNewPlan}
          />
        )}

        {/* Tab 2: Séance */}
        {activeTab === 'seance' && (
          <SeanceView
            plan={plan}
            students={students}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
            onBulkPresence={handleBulkPresence}
            onResetAttendance={handleResetAttendance}
          />
        )}

        {/* Tab 3: Fiches */}
        {activeTab === 'fiches' && (
          <FichesView
            plan={plan}
            setPlan={setPlan}
            onSelectPreset={(preset) => setPlan(preset)}
            onAddPhase={handleAddPhase}
            onPhaseChange={handlePhaseChange}
            onMovePhase={handleMovePhase}
            onDeletePhase={handleDeletePhase}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
            showToast={showToast}
          />
        )}

        
        {/* Tab 4: Séances / Fiches (List) */}
        {activeTab === 'seances_list' && (
          <SeancesListView
            sessions={sessions}
            plans={[plan, ...PRESET_TOPICS.map(p => p.defaultPlan as any)]}
          />
        )}

        {/* Tab 4: Élèves */}
        {activeTab === 'eleves' && (
          <ElevesView
            students={students}
            sessions={sessions}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {/* Tab 5: Analyse */}
        {activeTab === 'analyse' && (
          <AnalyseView
            students={students}
          />
        )}

      </main>

      {/* Floating Bottom Navigation Capsule (#nav) with 5 Tabs */}

      {/* Sticky Primary CTA for Mobile */}
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[9998] sm:hidden">
        <button 
          onClick={() => {
            const newPlan = { ...plan, id: 'new-' + Date.now(), title: 'Nouvelle Leçon' };
            setPlan(newPlan);
            setActiveTab('fiches');
          }}
          className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-sky-500/30 flex items-center gap-2 border border-sky-300/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span className="text-sm tracking-wide">Nouvelle Fiche</span>
        </button>
      </div>

      <BottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accessibilityScore={auditResult.score}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Sliding Control Bar Drawer (#sidemenu) */}
      <SlidingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        plan={plan}
        currentTeacher={currentTeacher}
        onLogout={handleLogout}
        onSwitchTeacher={handleSwitchTeacher}
        onSelectPreset={(p) => setPlan(p)}
        visionFilter={visionFilter}
        setVisionFilter={setVisionFilter}
        theme={theme}
        setTheme={setTheme}
        background={background}
        setBackground={setBackground}
        onUpdatePlan={(updates) => setPlan({ ...plan, ...updates })}
        onNavigateTab={setActiveTab}
      />

      {/* Printable View */}
      <div className="hidden print:block border-t border-slate-200 mt-8 pt-8">
        <PrintView plan={plan} />
      </div>

      {/* Modals */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onPlanGenerated={(newPlan) => {
          setPlan(newPlan);
          showToast('Fiche de cours générée avec l\'IA Gemini !');
        }}
      />

      <AccessibilityInspectorModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        auditResult={auditResult}
        plan={plan}
        visionFilter={visionFilter}
        setVisionFilter={setVisionFilter}
        onOptimizeLightness={handleOptimizeLightness}
      />

      <CloudSyncModal
        isOpen={isCloudSyncModalOpen}
        onClose={() => setIsCloudSyncModalOpen(false)}
        plan={plan}
        onPlanLoaded={(loadedPlan) => {
          setPlan(loadedPlan);
          setIsCloudSyncModalOpen(false);
          showToast(`Fiche "${loadedPlan.title}" chargée depuis le Cloud !`);
        }}
      />

    </div>
  );
}

export default App;
