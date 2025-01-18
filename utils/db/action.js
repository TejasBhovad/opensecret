import { and, eq, like, or, sql } from "drizzle-orm";
import { db } from "./dbconfig";
import { bookmarks, podCreators, pods, users } from "./schema";

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
