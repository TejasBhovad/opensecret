import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  email: varchar("gmail", { length: 100 }).unique(),
  name: varchar("name", { length: 50 }),
  pod_follow: integer("pod_follow").default(0),
  user_following: integer("user_following").default(0),
  followers: integer("followers").default(0),
  onboarded: boolean("onboarded").default(false),
  profile: varchar("profile_picture", { length: 255 }),
  joined_at: timestamp("joined_at").defaultNow(),
});

// add relation to allow for user to follow other users
export const userFollows = pgTable(
  "user_follows",
  {
    id: serial("id").primaryKey(), // Added serial primary key
    follower_id: integer("follower_id").references(() => users.user_id),
    user_id: integer("user_id").references(() => users.user_id),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("user_follows_unique_idx").on(
      table.follower_id,
      table.user_id,
    ),
  }),
);

// Pods Table
export const pods = pgTable("pods", {
  title: varchar("title", { length: 100 }),
  pod_id: serial("pod_id").primaryKey(),
  admin_id: integer("admin_id").references(() => users.user_id),
  is_public: boolean("is_public").default(true),
  subtag: varchar("subtag", { length: 50 }),
  domain: varchar("domain", { length: 100 }),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  total_stories: integer("total_stories").default(0),
  followers_count: integer("followers_count").default(0),
  popularity_score: decimal("popularity_score").default(0),
});

// // Blocked Relationships Table
// export const blockedRelationships = pgTable(
//   "blocked_relationships",
//   {
//     id: serial("id").primaryKey(), // Added serial primary key
//     user_id: integer("user_id").references(() => users.user_id),
//     pod_id: integer("pod_id").references(() => pods.pod_id),
//   },
//   (table) => ({
//     uniqueIdx: uniqueIndex("blocked_relationships_unique_idx").on(
//       table.user_id,
//       table.pod_id,
//     ),
//   }),
// );

// Archived Pods Table
export const archivedPods = pgTable(
  "archived_pods",
  {
    id: serial("id").primaryKey(), // Added serial primary key
    user_id: integer("user_id").references(() => users.user_id),
    pod_id: integer("pod_id").references(() => pods.pod_id),
    archived_at: timestamp("archived_at").defaultNow(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("archived_pods_unique_idx").on(
      table.user_id,
      table.pod_id,
    ),
  }),
);

// Bookmarks Table
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(), // Added serial primary key
    user_id: integer("user_id").references(() => users.user_id),
    pod_id: integer("pod_id").references(() => pods.pod_id),
    bookmarked_at: timestamp("bookmarked_at").defaultNow(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("bookmarks_unique_idx").on(
      table.user_id,
      table.pod_id,
    ),
  }),
);

export const podCreators = pgTable(
  "pod_creators",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.user_id),
    pod_id: integer("pod_id").references(() => pods.pod_id),
    joined_at: timestamp("joined_at").defaultNow(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("pod_creators_unique_idx").on(
      table.user_id,
      table.pod_id,
    ),
  }),
);

// Time Capsules Table
export const timeCapsules = pgTable(
  "time_capsules",
  {
    id: serial("id").primaryKey(), // Added serial primary key
    user_id: integer("user_id").references(() => users.user_id),
    pod_id: integer("pod_id").references(() => pods.pod_id),
    content: text("content"),
    reveal_date: date("reveal_date"),
    created_at: timestamp("created_at").defaultNow(),
    is_revealed: boolean("is_revealed").default(false),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("time_capsules_unique_idx").on(
      table.user_id,
      table.pod_id,
    ),
  }),
);

// Stories Table
export const stories = pgTable("stories", {
  story_id: serial("story_id").primaryKey(),
  pod_id: integer("pod_id").references(() => pods.pod_id),
  user_id: integer("user_id").references(() => users.user_id),
  content: text("content"),
  reactions: jsonb("reactions"),
  hashtags: text("hashtags").array(),
  created_at: timestamp("created_at").defaultNow(),

  // Additional story metadata
  likes_count: integer("likes_count").default(0),
  comments_count: integer("comments_count").default(0),
  is_featured: boolean("is_featured").default(false),
});

// Story Threads Table
export const storyThreads = pgTable("story_threads", {
  thread_id: serial("thread_id").primaryKey(),
  story_id: integer("story_id").references(() => stories.story_id),
  user_id: integer("user_id").references(() => users.user_id),
  timestamp: timestamp("timestamp").defaultNow(),
  content: text("content"),

  // Additional thread metadata
  likes_count: integer("likes_count").default(0),
  parent_thread_id: integer("parent_thread_id"),
});

// Hashtags Table
export const hashtags = pgTable("hashtags", {
  hashtag_id: serial("hashtag_id").primaryKey(),
  name: varchar("name", { length: 50 }).unique(),
  usage_count: integer("usage_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

// Reports Table
export const reports = pgTable("reports", {
  report_id: serial("report_id").primaryKey(),
  pod_id: integer("pod_id").references(() => pods.pod_id),
  total_visits: integer("total_visits").default(0),
  total_stories: integer("total_stories").default(0),
  total_threads: integer("total_threads").default(0),
  report_date: date("report_date").defaultNow(),
});

// Relationships
export const userRelations = relations(users, ({ many }) => ({
  pods: many(pods),
  stories: many(stories),
  bookmarks: many(bookmarks),
  timeCapsules: many(timeCapsules),
}));

export const podRelations = relations(pods, ({ one, many }) => ({
  admin: one(users, {
    fields: [pods.admin_id],
    references: [users.user_id],
  }),
  stories: many(stories),
  creators: many(podCreators),
}));

export const storyRelations = relations(stories, ({ one, many }) => ({
  pod: one(pods, {
    fields: [stories.pod_id],
    references: [pods.pod_id],
  }),
  user: one(users, {
    fields: [stories.user_id],
    references: [users.user_id],
  }),
  threads: many(storyThreads),
}));
