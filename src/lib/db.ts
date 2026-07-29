import { db } from './firebase';
import { collection, doc, setDoc, getDocs, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { LessonPlan, Student, SessionData } from '../types';

export const savePlan = async (userId: string, plan: LessonPlan) => {
  if (!userId) return;
  try { await setDoc(doc(db, `users/${userId}/plans`, plan.id), plan); } catch (e) { console.error('DB Save error', e); }
};

export const loadPlans = async (userId: string): Promise<LessonPlan[]> => {
  if (!userId) return [];
  const q = collection(db, `users/${userId}/plans`);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as LessonPlan);
};

export const saveStudent = async (userId: string, student: Student) => {
  if (!userId) return;
  try { await setDoc(doc(db, `users/${userId}/students`, student.id), student); } catch (e) { console.error('DB Save error', e); }
};

export const loadStudents = async (userId: string): Promise<Student[]> => {
  if (!userId) return [];
  const q = collection(db, `users/${userId}/students`);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as Student);
};

export const saveSession = async (userId: string, session: SessionData) => {
  if (!userId) return;
  try { await setDoc(doc(db, `users/${userId}/sessions`, session.id), session); } catch (e) { console.error('DB Save error', e); }
};

export const loadSessions = async (userId: string): Promise<SessionData[]> => {
  if (!userId) return [];
  const q = collection(db, `users/${userId}/sessions`);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as SessionData);
};
