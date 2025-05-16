import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  // store the basic folder/files structure

  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),

  // store information

  fileUrl: text("file_url").notNull(),
  thumbnail: text("thumbnail_url"),

  // ownership

  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), // if parent folder otherwise Null for root items

  // file/folders flags

  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  // TimeStamps

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

/* 

parent -> Each file/folder can have only one parent 

child -> Each child should have many child files/folder

*/

export const fileRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),

  children: many(files),
}));

export const File = typeof files.$inferSelect;
export const newFile = typeof files.$inferInsert;
