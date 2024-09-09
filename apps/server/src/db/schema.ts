import {InferSelectModel, relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({autoIncrement: true}),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  name: text('name').unique().notNull(),
  readKey: text('readKey').notNull(),
  writeKey: text('writeKey').notNull(),
  privateKey: text('privateKey').notNull(),
  publicKey: text('publicKey').notNull(),
});

export const chunks = sqliteTable('chunks', {
  id: integer('id').primaryKey({autoIncrement: true}),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  name: text('name').notNull(),
  data: text('data').notNull(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, {onDelete: 'cascade'}),
});

export const projectReleations = relations(projects, ({many}) => ({
  chunks: many(chunks),
}));

export const chunkRelations = relations(chunks, ({one}) => ({
  project: one(projects, {
    fields: [chunks.projectId],
    references: [projects.id],
  }),
}));

export type Chunk = InferSelectModel<typeof chunks>;

export type Project = InferSelectModel<typeof projects>;
