// import {varchar, boolean, pgTable, serial, text, timestamp, integer} from 'drizzle-orm/pg-core';
// import {relations} from 'drizzle-orm';

// export const users = pgTable({
//     id: serial('id').primaryKey(),
//     email: varchar('email', { length: 255 }).notNull().unique(),
//     name: varchar('name', { length: 255 }).notNull(),
//     bookmarks: relations.manyToMany('bookmarks', 'users', 'bookmarks', 'user_id', 'bookmark_id'),
