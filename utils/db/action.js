"use server";
import { and, eq, like, or, sql, desc, inArray, not } from "drizzle-orm";
import { db } from "./dbconfig";
import {
  bookmarks,
  podCreators,
  pods,
  users,
  archivedPods,
  hashtags,
  reports,
  stories,
  storyRelations,
  storyThreads,
  userFollows,
  podShares,
} from "./schema";

export async function registerUser({ email, profile, name }) {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await db
      .insert(users)
      .values({
        email,
        profile,
        name,
      })
      .returning();

    return newUser[0];
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
}

export async function createPod({
  admin_id,
  is_public,
  subtag,
  domain,
  name,
  description,
}) {
  try {
    const admin = await getUserById(admin_id);
    if (!admin) {
      throw new Error("Invalid admin user");
    }
    const newPod = await db
      .insert(pods)
      .values({
        admin_id: admin_id,
        is_public: is_public ?? true,
        subtag: subtag,
        name: name,
        domain: domain,
        description: description || "",
        created_at: new Date(),
        total_stories: 0,
        followers_count: 0,
        popularity_score: 0,
      })
      .returning();

    return newPod[0];
  } catch (error) {
    console.error("Pod creation error:", error);
    throw error;
  }
}

// Get User by ID
export async function getUserById(user_id) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_id, user_id))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error("Fetch user by ID error:", error);
    throw error;
  }
}

// Follow a Pod
export async function followPod(user_id, pod_id) {
  try {
    const user = await getUserById(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    const pod = await db
      .select()
      .from(pods)
      .where(eq(pods.pod_id, pod_id))
      .limit(1);

    if (!pod[0]) {
      throw new Error("Pod not found");
    }

    const existingFollow = await db
      .select()
      .from(podCreators)
      .where(
        and(eq(podCreators.user_id, user_id), eq(podCreators.pod_id, pod_id)),
      )
      .limit(1);

    if (existingFollow[0]) {
      throw new Error("Already following this pod");
    }

    // Insert pod creator relationship
    await db.insert(podCreators).values({
      user_id,
      pod_id,
      joined_at: new Date(),
    });

    await db
      .update(users)
      .set({
        pod_follow: sql`${users.pod_follow} + 1`,
      })
      .where(eq(users.user_id, user_id));

    await db
      .update(pods)
      .set({
        followers_count: sql`${pods.followers_count} + 1`,
      })
      .where(eq(pods.pod_id, pod_id));

    return true;
  } catch (error) {
    console.error("Follow pod error:", error);
    throw error;
  }
}

export async function unfollowPod(user_id, pod_id) {
  try {
    // Delete from pod creators and store the result
    const deleteResult = await db
      .delete(podCreators)
      .where(
        and(eq(podCreators.user_id, user_id), eq(podCreators.pod_id, pod_id)),
      );

    // Decrement pod_follow count for user
    await db
      .update(users)
      .set({
        pod_follow: sql`${users.pod_follow} - 1`,
      })
      .where(eq(users.user_id, user_id));

    // Decrement followers count for pod
    await db
      .update(pods)
      .set({
        followers_count: sql`${pods.followers_count} - 1`,
      })
      .where(eq(pods.pod_id, pod_id));

    return deleteResult.rowCount > 0;
  } catch (error) {
    console.error("Unfollow pod error:", error);
    throw error;
  }
}

// Search Pods
export async function searchPods(searchTerm, options = {}) {
  try {
    const { limit = 20, isPublic = true } = options;

    const results = await db
      .select()
      .from(pods)
      .where(
        and(
          or(
            like(pods.subtag, `%${searchTerm}%`),
            like(pods.domain, `%${searchTerm}%`),
          ),
          eq(pods.is_public, isPublic),
        ),
      )
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Search pods error:", error);
    throw error;
  }
}

// Bookmark a Pod
export async function bookmarkPod(user_id, pod_id) {
  try {
    // Check if already bookmarked
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.user_id, user_id), eq(bookmarks.pod_id, pod_id)))
      .limit(1);

    if (existingBookmark[0]) {
      throw new Error("Pod already bookmarked");
    }

    await db.insert(bookmarks).values({
      user_id,
      pod_id,
      bookmarked_at: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Bookmark pod error:", error);
    throw error;
  }
}

export async function unbookmarkPod(user_id, pod_id) {
  try {
    const deleteResult = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.user_id, user_id), eq(bookmarks.pod_id, pod_id)));

    return deleteResult.rowCount > 0;
  } catch (error) {
    console.error("Unbookmark pod error:", error);
    throw error;
  }
}

// Get Bookmarked Pods
export async function getBookmarkedPods(user_id) {
  try {
    const results = await db
      .select()
      .from(bookmarks)
      .join(pods)
      .on(eq(bookmarks.pod_id, pods.pod_id))
      .where(eq(bookmarks.user_id, user_id));

    return results;
  } catch (error) {
    console.error("Get bookmarked pods error:", error);
    throw error;
  }
}

// Get Followed Pods
export async function getFollowedPods(user_id) {
  try {
    const results = await db
      .select()
      .from(podCreators)
      .join(pods)
      .on(eq(podCreators.pod_id, pods.pod_id))
      .where(eq(podCreators.user_id, user_id));

    return results;
  } catch (error) {
    console.error("Get followed pods error:", error);
    throw error;
  }
}

// Get Pod Followers
export async function getPodFollowers(pod_id) {
  try {
    const results = await db
      .select()
      .from(podCreators)
      .join(users)
      .on(eq(podCreators.user_id, users.user_id))
      .where(eq(podCreators.pod_id, pod_id));

    return results;
  } catch (error) {
    console.error("Get pod followers error:", error);
    throw error;
  }
}

// Archive a Pod
export async function archivePod(user_id, pod_id) {
  try {
    const existingArchive = await db
      .select()
      .from(archivedPods)
      .where(
        and(eq(archivedPods.user_id, user_id), eq(archivedPods.pod_id, pod_id)),
      )
      .limit(1);

    if (existingArchive[0]) {
      throw new Error("Pod already archived");
    }

    await db.insert(archivedPods).values({
      user_id,
      pod_id,
    });

    return true;
  } catch (error) {
    console.error("Archive pod error:", error);
    throw error;
  }
}

// Get Archived Pods
export async function getArchivedPods(user_id) {
  try {
    const results = await db
      .select()
      .from(archivedPods)
      .join(pods)
      .on(eq(archivedPods.pod_id, pods.pod_id))
      .where(eq(archivedPods.user_id, user_id));

    return results;
  } catch (error) {
    console.error("Get archived pods error:", error);
    throw error;
  }
}

// follow users
// // add relation to allow for user to follow other users
// export const userFollows = pgTable(
//   "user_follows",
//   {
//     id: serial("id").primaryKey(), // Added serial primary key
//     follower_id: integer("follower_id").references(() => users.user_id),
//     user_id: integer("user_id").references(() => users.user_id),
//   },
//   (table) => ({
//     uniqueIdx: uniqueIndex("user_follows_unique_idx").on(
//       table.follower_id,
//       table.user_id,
//     ),
//   }),
// );

// Follow a User
export async function followUser(follower_id, user_id) {
  try {
    const user = await getUserById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    const existingFollow = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.follower_id, follower_id),
          eq(userFollows.user_id, user_id),
        ),
      )
      .limit(1);

    if (existingFollow[0]) {
      throw new Error("Already following this user");
    }

    // Insert user follow relationship
    await db.insert(userFollows).values({
      follower_id,
      user_id,
    });

    return true;
  } catch (error) {
    console.error("Follow user error:", error);
    throw error;
  }
}

// Unfollow a User
export async function unfollowUser(follower_id, user_id) {
  try {
    // Delete from user follows and store the result
    const deleteResult = await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.follower_id, follower_id),
          eq(userFollows.user_id, user_id),
        ),
      );

    return deleteResult.rowCount > 0;
  } catch (error) {
    console.error("Unfollow user error:", error);
    throw error;
  }
}

// Get User Followers
export async function getUserFollowers(user_id) {
  try {
    const results = await db
      .select()
      .from(userFollows)
      .join(users)
      .on(eq(userFollows.follower_id, users.user_id))
      .where(eq(userFollows.user_id, user_id));

    return results;
  } catch (error) {
    console.error("Get user followers error:", error);
    throw error;
  }
}

// Get User Following
export async function getUserFollowing(user_id) {
  try {
    const results = await db
      .select()
      .from(userFollows)
      .join(users)
      .on(eq(userFollows.user_id, users.user_id))
      .where(eq(userFollows.follower_id, user_id));

    return results;
  } catch (error) {
    console.error("Get user following error:", error);
    throw error;
  }
}

// Get User Bookmarks
export async function getUserBookmarks(user_id) {
  try {
    const results = await db
      .select()
      .from(bookmarks)
      .join(pods)
      .on(eq(bookmarks.pod_id, pods.pod_id))
      .where(eq(bookmarks.user_id, user_id));

    return results;
  } catch (error) {
    console.error("Get user bookmarks error:", error);
    throw error;
  }
}

// Get User Pods
export async function getUserPods(user_id) {
  try {
    const results = await db
      .select()
      .from(pods)
      .where(eq(pods.admin_id, user_id));

    return results;
  } catch (error) {
    console.error("Get user pods error:", error);
    throw error;
  }
}

// Get User Created Stories
export async function getUserStories(user_id) {
  try {
    const results = await db
      .select()
      .from(stories)
      .where(eq(stories.author_id, user_id));

    return results;
  } catch (error) {
    console.error("Get user stories error:", error);
    throw error;
  }
}

// get all hashtags
export async function getAllHashtags() {
  try {
    const results = await db.select().from(hashtags).limit(4);

    return results;
  } catch (error) {
    console.error("Get hashtags error:", error);
    throw error;
  }
}

export async function getPods() {
  try {
    const results = await db
      .select()
      .from(pods)
      .where(eq(pods.is_public, true));
    return results;
  } catch (error) {
    console.error("Get pods error:", error);
    throw error;
  }
}

// Get Pod Stories
export async function getPodStories(pod_id) {
  try {
    const results = await db
      .select()
      .from(stories)
      .where(eq(stories.pod_id, pod_id));

    return results;
  } catch (error) {
    console.error("Get pod stories error:", error);
    throw error;
  }
}

// Get Story Reactions
export async function getStoryReactions(story_id) {
  try {
    const story = await db
      .select()
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (!story[0]) {
      throw new Error("Story not found");
    }

    return story[0].reactions || {};
  } catch (error) {
    console.error("Get story reactions error:", error);
    throw error;
  }
}

// Add Story Reaction
export async function addStoryReaction(story_id, reaction) {
  try {
    const story = await db
      .select()
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (!story[0]) {
      throw new Error("Story not found");
    }

    const reactions = story[0].reactions || {};
    reactions[reaction] = (reactions[reaction] || 0) + 1;

    await db
      .update(stories)
      .set({
        reactions: reactions,
      })
      .where(eq(stories.story_id, story_id));

    return reactions;
  } catch (error) {
    console.error("Add story reaction error:", error);
    throw error;
  }
}

// Remove Story Reaction
export async function removeStoryReaction(story_id, reaction) {
  try {
    const story = await db
      .select()
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (!story[0]) {
      throw new Error("Story not found");
    }

    const reactions = story[0].reactions || {};
    if (reactions[reaction] > 0) {
      reactions[reaction] -= 1;
    }

    await db
      .update(stories)
      .set({
        reactions: reactions,
      })
      .where(eq(stories.story_id, story_id));

    return reactions;
  } catch (error) {
    console.error("Remove story reaction error:", error);
    throw error;
  }
}

// get suggested pods
export async function getSuggestedPods(user_id) {
  try {
    const user = await getUserById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    const userPods = await getUserPods(user_id);
    const userPodIds = userPods.map((pod) => pod.pod_id);

    const results = await db
      .select()
      .from(pods)
      .where(
        and(
          eq(pods.is_public, true),
          or(
            eq(pods.admin_id, user_id),
            sql`${pods.pod_id} NOT IN (${userPodIds})`,
          ),
        ),
      )
      .limit(4);
    return results;
  } catch (error) {
    console.error("Get suggested pods error:", error);
    throw error;
  }
}

export async function getSuggestedUsers(user_id) {
  try {
    const userFollowing = await db
      .select()
      .from(userFollows)
      .innerJoin(users, eq(userFollows.user_id, users.user_id))
      .where(eq(userFollows.follower_id, user_id));

    const userFollowingIds = userFollowing.map((follow) => follow.user_id);

    const results = await db
      .select({
        user_id: users.user_id,
        name: users.name,
        profile: users.profile,
      })
      .from(users)
      .where(
        and(
          not(eq(users.user_id, user_id)),
          not(inArray(users.user_id, userFollowingIds)),
        ),
      )
      .limit(5);

    return results;
  } catch (error) {
    console.error("Get suggested users error:", error);
    throw error;
  }
}

export async function getPopularStories() {
  try {
    const results = await db
      .select()
      .from(stories)
      .orderBy(stories.likes_count, desc)
      .limit(5);
    if (!results) {
      throw new Error("No popular stories found");
    }
    return results;
  } catch (error) {
    console.error("Get popular stories error:");
    throw error;
  }
}
export async function getSharedPods(email) {
  try {
    const results = await db
      .select()
      .from(podShares)
      .innerJoin(pods, eq(podShares.pod_id, pods.pod_id))
      .where(eq(podShares.shared_email, email));

    return results;
  } catch (error) {
    console.error("Get shared pods error:", error);
    throw error;
  }
}
export async function sharePod({ pod_id, email }) {
  try {
    await db.insert(podShares).values({
      pod_id,
      shared_email: email,
      shared_at: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Share pod error:", error);
    throw error;
  }
}
