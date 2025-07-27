import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
  class: integer().notNull(),
  password: varchar({ length: 255 }).notNull(),
});

export const subjectsTable = pgTable("subjects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subjectName: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  teacherId: integer()
    .notNull()
    .references(() => usersTable.id),
});

export const subjectsMemberTable = pgTable("subject_members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subjectId: integer()
    .notNull()
    .references(() => subjectsTable.id),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
});
