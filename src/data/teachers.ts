import { Teacher } from '../types';

export const TEACHERS: Teacher[] = [
  {
    id: 'fidele',
    name: 'Fidèle',
    kanjiName: 'フィデル先生',
    email: 'mananafidelerakotoarisoa@gmail.com',
    role: 'Enseignant • Responsable CJ_MIX & AFO25',
    classes: ['CJ_MIX', 'CJ_05', 'AFI', 'AFO25'],
    scheduleEntries: [
      { day: 'Mardi', classId: 'CJ_MIX', skills: ['Kanji', 'Writing'] },
      { day: 'Mardi', classId: 'AFI', skills: ['Kanji', 'Vocabulary'] },
      { day: 'Mardi', classId: 'AFO25', skills: [] },
      { day: 'Vendredi', classId: 'CJ_05', skills: ['Writing', 'Review'] },
      { day: 'Vendredi', classId: 'AFO25', skills: [] },
      { day: 'Samedi', classId: 'CJ_MIX', skills: [] },
      { day: 'Samedi', classId: 'AFO25', skills: [] }
    ],
    avatarLetter: 'F',
    color: 'from-sky-500 to-indigo-600',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
  },
  {
    id: 'haja',
    name: 'Haja',
    kanjiName: 'ハジャ先生',
    email: 'haja@makoto.mg',
    role: 'Enseignant • Responsable AFI',
    classes: ['CJ_MIX', 'CJ_05', 'AFI', 'AFO26'],
    scheduleEntries: [
      { day: 'Lundi', classId: 'CJ_MIX', skills: ['Speaking', 'Reading'] },
      { day: 'Lundi', classId: 'AFI', skills: ['Reading', 'Grammar'] },
      { day: 'Mardi', classId: 'CJ_05', skills: ['Grammar', 'Vocabulary'] },
      { day: 'Mardi', classId: 'AFO26', skills: [] },
      { day: 'Jeudi', classId: 'CJ_MIX', skills: ['Grammar', 'Vocabulary'] },
      { day: 'Vendredi', classId: 'AFI', skills: ['Listening'] },
      { day: 'Vendredi', classId: 'AFO26', skills: [] },
      { day: 'Samedi', classId: 'CJ_05', skills: [] }
    ],
    avatarLetter: 'H',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  },
  {
    id: 'rova',
    name: 'Rova',
    kanjiName: 'ロヴァ先生',
    email: 'rova@makoto.mg',
    role: 'Enseignant • Responsable CJ_05 & AFO26',
    classes: ['CJ_MIX', 'CJ_05', 'AFI', 'AFO26'],
    scheduleEntries: [
      { day: 'Lundi', classId: 'CJ_05', skills: ['Speaking', 'Reading'] },
      { day: 'Lundi', classId: 'AFO26', skills: [] },
      { day: 'Jeudi', classId: 'CJ_05', skills: ['Listening', 'Vocabulary'] },
      { day: 'Jeudi', classId: 'AFI', skills: ['Speaking'] },
      { day: 'Jeudi', classId: 'AFO26', skills: [] },
      { day: 'Vendredi', classId: 'CJ_MIX', skills: ['Speaking', 'Listening'] },
      { day: 'Samedi', classId: 'AFI', skills: [] },
      { day: 'Samedi', classId: 'AFO26', skills: [] }
    ],
    avatarLetter: 'R',
    color: 'from-amber-500 to-rose-600',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  },
];

export const AUTH_STORAGE_KEY = 'mpanabe_active_teacher_id';

export function getInitialTeacher(): Teacher | null {
  try {
    const savedId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedId) {
      const match = TEACHERS.find((t) => t.id === savedId);
      if (match) return match;
    }
  } catch (e) {
    // localStorage unavailable
  }
  return null;
}
