export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Business' | 'Casual';

export type ActiveTab = 'accueil' | 'seance' | 'fiches' | 'seances_list' | 'eleves' | 'analyse';

export interface ManualRef {
  id: string;
  book: string;
  support: 'physique' | 'numérique';
  lesson: string;
  cando: string;
}

export interface Objective {
  id: string;
  text: string;
}

export interface EvaluationQuestion {
  id: string;
  text: string;
  responseType: 'comment' | '5stars' | 'multiple_choice';
  options?: string[]; // for multiple choice
}

export interface Homework {
  id: string;
  description: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size?: number;
}

export interface PCPPPhase {
  id: string;
  attachments?: Attachment[];
  type: 'presentation' | 'comprehension' | 'practice' | 'production';
  title: string;
  titleJa: string;
  durationMinutes: number;
  
  // Base fields
  objective: string;
  teacherAction: string;
  studentAction: string;
  materialsNeeded: string[];
  boardPlanNote?: string;
  
  // Presentation
  oralIntroScript?: string;
  conceptCheckQuestions?: string[];
  selfRelevanceNotes?: string;
  formHighlighting?: string;
  interactionPlan?: string;

  // Comprehension
  globalSearchActivities?: string;
  listeningActivities?: string;
  anticipatedErrors?: string;

  // Practice
  structuralExercises?: string;
  oralReading?: string;
  customWriting?: string;
  correctionStrategy?: string;

  // Production
  communicativeTaskType?: 'débat' | 'jeu de rôle' | 'récit' | 'autre';
  communicativeTaskDesc?: string;
  successCriteria?: string;
  activeLearningActivity?: string;
  spiralReusePlan?: string;
}

export interface BoardPlan {
  title: string;
  grammarPattern: string;
  exampleSentenceJa: string;
  exampleSentenceRomaji?: string;
  exampleSentenceEn: string;
  notes: string[];
}

export interface LessonPlan {
  id: string;
  
  // General Info
  classId: string;
  date: string;
  teacherId: string;
  sessionType: string;
  title: string;
  targetLevel: JLPTLevel;
  totalDurationMinutes: number;
  targetedSkills: string[];
  materials: string[];
  manuals: ManualRef[];
  textbookRef?: string;

  // Objectives and Prerequisites
  objectives: Objective[];
  prerequisites: string;
  prerequisitesChecked: boolean;

  grammarPoint: string;
  grammarPointMeaning: string;
  targetVocab: string[];
  targetKanji?: string[];
  
  phases: PCPPPhase[];
  boardPlan: BoardPlan;
  
  homeworks: Homework[];
  evaluations: EvaluationQuestion[];
  attachments: Attachment[];
  hiddenSections: string[];

  teacherNotes: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  syncId?: string;
}


export interface Student {
  id: string;
  name: string; // Nom & Prénom
  kanjiName?: string; // 漢字名
  classGroup: string; // ex. "Classe N5 - Lundi"
  presenceRate: number; // 0 - 100%
  assiduiteScore: number; // 0 - 100%
  jlptTarget: JLPTLevel;
  notes: string;
  lastStatus: 'P' | 'R' | 'A' | 'AJ'; // Present, Retard, Absent, Absent Justifie
}

export interface StudentError {
  id: string;
  studentId: string;
  category: 'Particules' | 'Kanji' | 'Vocabulaire' | 'Conjugaison' | 'Prononciation' | 'Autre';
  description: string;
  status: 'corrigée' | 'non corrigée' | 'reportée';
  timestamp: string;
}

export interface StudentExerciseScore {
  studentId: string;
  score: number | null; // null if not graded yet
  maxScore: number;
  notes: string;
}

export interface SessionReport {
  notes: string;
  unfinishedTasks: string;
  nextSessionFocus: string;
  bilanFormat?: 'comment' | '5stars' | 'multiple_choice';
  bilanContent?: string;
}

export interface SessionData {
  id: string;
  planId: string;
  date: string;
  attendance: Record<string, SessionAttendance>;
  errors: StudentError[];
  exerciseScores: Record<string, StudentExerciseScore>;
  report: SessionReport;
}

export interface SessionAttendance {
  studentId: string;
  status: 'P' | 'R' | 'A' | 'AJ';
  assiduite: 'good' | 'average' | 'needs_work';
  participationStars: number; // 1-5
  notes?: string;
}

export interface PresetTopic {
  id: string;
  title: string;
  level: JLPTLevel;
  textbook: string;
  grammarPoint: string;
  meaning: string;
  description: string;
  defaultPlan: Partial<LessonPlan>;
}

export interface AccessibilityAuditResult {
  score: number;
  contrastPass: boolean;
  contrastDetails: { element: string; ratio: number; pass: boolean }[];
  keyboardNavPass: boolean;
  ariaPass: boolean;
  fontLegibilityPass: boolean;
  cognitiveLoadScore: number; // 0-100
  issues: {
    type: 'error' | 'warning' | 'info';
    category: 'Contrast' | 'Keyboard' | 'ScreenReader' | 'Typography' | 'CognitiveLoad';
    message: string;
    suggestion: string;
  }[];
}

export type VisionFilter = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'highContrast';

export interface Teacher {
  id: 'fidele' | 'haja' | 'rova';
  name: string;
  kanjiName: string;
  email: string;
  role: string;
  classes: string[];
  avatarLetter: string;
  color: string;
  badgeBg: string;
}


export type AppTheme = 'dark' | 'light' | 'monochrome';
export type BackgroundId = 'bg-1' | 'bg-2' | 'bg-3' | 'bg-4' | 'bg-5' | 'bg-6' | 'bg-7' | 'bg-8';
