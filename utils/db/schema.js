// import {varchar, boolean, pgTable, serial, text, timestamp, integer} from 'drizzle-orm/pg-core';
// import {relations} from 'drizzle-orm';

// export const users = pgTable({
//     id: serial('id').primaryKey(),
//     email: varchar('email', { length: 255 }).notNull().unique(),
//     name: varchar('name', { length: 255 }).notNull(),
//     bookmarks: relations.manyToMany('bookmarks', 'users', 'bookmarks', 'user_id', 'bookmark_id'),
import {
    boolean,
    integer,
    jsonb,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    varchar
} from 'drizzle-orm/pg-core';
  
  export const users = pgTable('users', {
    user_id: serial('user_id').primaryKey(),
    number: varchar('number', { length: 20 }).unique(),
    gmail: varchar('gmail', { length: 100 }).unique(),
    passwordHash: varchar('password_hash', { length: 255 }),
    
    pod_follow: integer('pod_follow').default(0),
    user_following: integer('user_following').default(0),
    followers: integer('followers').default(0)
  });
  
  export const pods = pgTable('pods', {
    pod_id: serial('pod_id').primaryKey(),
    admin_id: integer('admin_id').references(() => users.user_id),
    is_public: boolean('is_public').default(true),
    subtag: varchar('subtag', { length: 50 }),
    domain: varchar('domain', { length: 100 })
  });
  
  export const blockedRelationships = pgTable('blocked_relationships', {
    user_id: integer('user_id').references(() => users.user_id),
    pod_id: integer('pod_id').references(() => pods.pod_id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.pod_id] })
  }));
  
  export const archivedPods = pgTable('archived_pods', {
    user_id: integer('user_id').references(() => users.user_id),
    pod_id: integer('pod_id').references(() => pods.pod_id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.pod_id] })
  }));
  
  export const bookmarks = pgTable('bookmarks', {
    user_id: integer('user_id').references(() => users.user_id),
    pod_id: integer('pod_id').references(() => pods.pod_id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.pod_id] })
  }));
  
  export const podCreators = pgTable('pod_creators', {
    user_id: integer('user_id').references(() => users.user_id),
    pod_id: integer('pod_id').references(() => pods.pod_id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.pod_id] })
  }));
  
  export const timeCapsules = pgTable('time_capsules', {
    user_id: integer('user_id').references(() => users.user_id),
    pod_id: integer('pod_id').references(() => pods.pod_id),
  }, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.pod_id] })
  }));
  
  export const stories = pgTable('stories', {
    story_id: serial('story_id').primaryKey(),
    pod_id: integer('pod_id').references(() => pods.pod_id),
    reactions: jsonb('reactions'),
    hashtags: text('hashtags').array()
  });
  
  export const storyThreads = pgTable('story_threads', {
    thread_id: serial('thread_id').primaryKey(),
    story_id: integer('story_id').references(() => stories.story_id),
    user_id: integer('user_id').references(() => users.user_id),
    timestamp: timestamp('timestamp').defaultNow(),
    data: text('data')
  });