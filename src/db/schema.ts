import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users (Teachers using the app)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('teacher'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Students
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  kanjiName: text('kanji_name'),
  classGroup: text('class_group').notNull(),
  presenceRate: integer('presence_rate').default(100),
  assiduiteScore: integer('assiduite_score').default(100),
  jlptTarget: text('jlpt_target').notNull(),
  notes: text('notes'),
  lastStatus: text('last_status').default('P'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Lesson Plans
export const lessonPlans = pgTable('lesson_plans', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id')
    .references(() => users.id)
    .notNull(),
  classId: text('class_id'),
  date: text('date'),
  title: text('title').notNull(),
  targetLevel: text('target_level'),
  totalDurationMinutes: integer('total_duration_minutes'),
  targetedSkills: jsonb('targeted_skills'),
  materials: jsonb('materials'),
  grammarPoint: text('grammar_point'),
  grammarPointMeaning: text('grammar_point_meaning'),
  data: jsonb('data').notNull(), // Full JSON of the plan for flexibility
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Google Drive Files synced
export const driveFiles = pgTable('drive_files', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id')
    .references(() => users.id)
    .notNull(),
  fileId: text('file_id').notNull(),
  fileName: text('file_name'),
  mimeType: text('mime_type'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
  lessonPlans: many(lessonPlans),
  driveFiles: many(driveFiles),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  teacher: one(users, {
    fields: [students.teacherId],
    references: [users.id],
  }),
}));

export const lessonPlansRelations = relations(lessonPlans, ({ one }) => ({
  teacher: one(users, {
    fields: [lessonPlans.teacherId],
    references: [users.id],
  }),
}));

export const driveFilesRelations = relations(driveFiles, ({ one }) => ({
  teacher: one(users, {
    fields: [driveFiles.teacherId],
    references: [users.id],
  }),
}));
