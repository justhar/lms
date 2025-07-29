import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// USERS

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
  classId: integer().references(() => classesTable.id),
  password: varchar({ length: 255 }).notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  class: one(classesTable, {
    fields: [usersTable.classId],
    references: [classesTable.id],
  }),
}));

// CLASSES

export const classesTable = pgTable("classes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  className: varchar({ length: 255 }).notNull(),
});

export const classesRelation = relations(classesTable, ({ many }) => ({
  students: many(usersTable),
}));

// SUBJECTS

export const subjectsTable = pgTable("subjects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subjectName: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  teacherId: integer()
    .notNull()
    .references(() => usersTable.id),
  classId: integer()
    .notNull()
    .references(() => classesTable.id),
});

export const subjectsRelation = relations(subjectsTable, ({ one }) => ({
  teacher: one(usersTable, {
    fields: [subjectsTable.teacherId],
    references: [usersTable.id],
  }),
  class: one(classesTable, {
    fields: [subjectsTable.classId],
    references: [classesTable.id],
  }),
}));

// POSTS

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 1000 }).notNull(),
  type: varchar({ length: 50 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  deadline: timestamp(),
  subjectId: integer()
    .notNull()
    .references(() => subjectsTable.id),
});

export const postsRelation = relations(postsTable, ({ one, many }) => ({
  subject: one(subjectsTable, {
    fields: [postsTable.subjectId],
    references: [subjectsTable.id],
  }),
  submissions: many(submissionsTable),
}));

// SUBMISSIONS

export const submissionsTable = pgTable("submissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  assignmentId: integer()
    .notNull()
    .references(() => postsTable.id),
  status: varchar({ length: 50 }).notNull(),
  content: varchar({ length: 1000 }),
  fileUrl: varchar({ length: 1000 }).array(),
  submittedAt: timestamp().notNull().defaultNow(),
  grade: integer(),
  feedback: varchar({ length: 1000 }),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
});
