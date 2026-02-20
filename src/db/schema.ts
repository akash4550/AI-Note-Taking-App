import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const notes = pgTable("notes", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export const notesRelations = relations(notes, () => ({}));
