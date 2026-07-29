import { Teacher } from '../types';

export const TEACHERS: Teacher[] = [
  {
    id: 'fidele',
    name: 'Fidèle',
    kanjiName: 'フィデル先生',
    email: 'mananafidelerakotoarisoa@gmail.com',
    role: 'Enseignant • Responsable CJ_MIX & AFO25',
    classes: ['CJ_MIX', 'AFO25', 'Classe N5 - Lundi'],
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
    classes: ['AFI', 'Classe N4 - Mercredi'],
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
    classes: ['CJ_05', 'AFO26', 'Classe N3 - Vendredi'],
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
