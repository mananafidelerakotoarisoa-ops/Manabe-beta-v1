import { SessionData } from '../types';

export const INITIAL_SESSIONS: SessionData[] = [
  {
    id: 's-1',
    planId: 'plan-default', // We'll assume the current plan is the default one
    date: '2023-10-24',
    attendance: {
      's-1': { studentId: 's-1', status: 'P', assiduite: 'good', participationStars: 4 },
      's-2': { studentId: 's-2', status: 'R', assiduite: 'average', participationStars: 3 },
      's-3': { studentId: 's-3', status: 'P', assiduite: 'good', participationStars: 5 },
    },
    errors: [
      { id: 'err-1', studentId: 's-1', category: 'Particules', description: 'Oubli de に pour la direction', status: 'corrigée', timestamp: '2023-10-24T10:00:00Z' },
      { id: 'err-2', studentId: 's-2', category: 'Conjugaison', description: 'て-forme incorrecte pour groupe 1', status: 'reportée', timestamp: '2023-10-24T10:15:00Z' },
    ],
    exerciseScores: {
      's-1': { studentId: 's-1', score: 18, maxScore: 20, notes: '' },
      's-2': { studentId: 's-2', score: 14, maxScore: 20, notes: '' },
      's-3': { studentId: 's-3', score: 20, maxScore: 20, notes: '' },
    },
    report: {
      notes: 'Très bonne dynamique, les élèves ont bien compris le concept de base.',
      unfinishedTasks: "L'exercice de shadowing n'a pas pu être terminé.",
      nextSessionFocus: 'Reprendre la conjugaison de la forme て pour le groupe 1.'
    }
  },
  {
    id: 's-2',
    planId: 'plan-preset-2', 
    date: '2023-10-21',
    attendance: {
      's-1': { studentId: 's-1', status: 'P', assiduite: 'good', participationStars: 5 },
      's-4': { studentId: 's-4', status: 'A', assiduite: 'needs_work', participationStars: 0 },
    },
    errors: [],
    exerciseScores: {},
    report: {
      notes: '',
      unfinishedTasks: '',
      nextSessionFocus: ''
    }
  }
];
