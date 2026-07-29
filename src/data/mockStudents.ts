import { Student, SessionAttendance } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    name: 'Aina Rasoanaivo',
    kanjiName: 'アイナ',
    classGroup: 'Classe N5 - Lundi',
    presenceRate: 95,
    assiduiteScore: 90,
    jlptTarget: 'N5',
    notes: 'Excellente participation aux exercices de grammaire orale.',
    lastStatus: 'P'
  },
  {
    id: 's-2',
    name: 'Kenji Tanaka',
    kanjiName: '田中 健二',
    classGroup: 'Classe N5 - Lundi',
    presenceRate: 88,
    assiduiteScore: 85,
    jlptTarget: 'N5',
    notes: 'Très fort en Kanji, retards occasionnels.',
    lastStatus: 'R'
  },
  {
    id: 's-3',
    name: 'Sophie Martin',
    kanjiName: 'ソフィー',
    classGroup: 'Classe N5 - Lundi',
    presenceRate: 100,
    assiduiteScore: 98,
    jlptTarget: 'N5',
    notes: 'Devoirs toujours rendus à temps. Très assidue.',
    lastStatus: 'P'
  },
  {
    id: 's-4',
    name: 'Lucas Dubois',
    kanjiName: 'リュカ',
    classGroup: 'Classe N5 - Lundi',
    presenceRate: 75,
    assiduiteScore: 70,
    jlptTarget: 'N5',
    notes: 'Besoin de soutien sur la conjugaison de la forme en -te.',
    lastStatus: 'A'
  },
  {
    id: 's-5',
    name: 'Miora Andria',
    kanjiName: 'ミオラ',
    classGroup: 'Classe N5 - Lundi',
    presenceRate: 92,
    assiduiteScore: 95,
    jlptTarget: 'N5',
    notes: 'Bonne prononciation et excellente dynamique de groupe.',
    lastStatus: 'P'
  },
  {
    id: 's-6',
    name: 'Yuto Suzuki',
    kanjiName: '鈴木 雄大',
    classGroup: 'Classe N4 - Mercredi',
    presenceRate: 96,
    assiduiteScore: 92,
    jlptTarget: 'N4',
    notes: 'Prépare activement le JLPT N4.',
    lastStatus: 'P'
  }
];

export const INITIAL_ATTENDANCE: Record<string, SessionAttendance> = {
  's-1': { studentId: 's-1', status: 'P', assiduite: 'good', participationStars: 5, notes: 'Actif en rôleplay' },
  's-2': { studentId: 's-2', status: 'R', assiduite: 'average', participationStars: 3, notes: 'Arrivé avec 10m de retard' },
  's-3': { studentId: 's-3', status: 'P', assiduite: 'good', participationStars: 5, notes: 'Excellente lecture' },
  's-4': { studentId: 's-4', status: 'A', assiduite: 'needs_work', participationStars: 1, notes: 'Absence non justifiée' },
  's-5': { studentId: 's-5', status: 'P', assiduite: 'good', participationStars: 4, notes: 'Bonne réactivité' },
  's-6': { studentId: 's-6', status: 'P', assiduite: 'good', participationStars: 5, notes: 'Entraînement N4 réussi' }
};
