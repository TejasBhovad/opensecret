import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from './dbconfig';
import { pods, users } from './schema';

// User Registration
export async function registerUser(gmail, number, password) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db.insert(users).values({
      gmail,
      number,
      passwordHash: hashedPassword,
      // Initialize default values for follow metrics
      pod_follow: 0,
      user_following: 0,
      followers: 0
    }).returning();

    return newUser[0];
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Get User by Email
export async function getUserByEmail(gmail) {
  try {
    const user = await db.select().from(users)
      .where(eq(users.gmail, gmail))
      .limit(1);
    
    return user[0] || null;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
}

// Create Pod
export async function createPod(admin_id, is_public, subtag, domain) {
  try {
    const newPod = await db.insert(pods).values({
      admin_id,
      is_public,
      subtag,
      domain
    }).returning();

    return newPod[0];
  } catch (error) {
    console.error("Pod creation error:", error);
    throw error;
  }
}

// Get User by ID
export async function getUserById(user_id) {
  try {
    const user = await db.select().from(users)
      .where(eq(users.user_id, user_id))
      .limit(1);
    
    return user[0] || null;
  } catch (error) {
    console.error("Fetch user by ID error:", error);
    throw error;
  }
}

// Update User Profile
export async function updateUserProfile(user_id, updateData) {
  try {
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.user_id, user_id))
      .returning();

    return updatedUser[0];
  } catch (error) {
    console.error("Update user profile error:", error);
    throw error;
  }
}

// Follow a Pod
export async function followPod(user_id, pod_id) {
  try {
    // You might want to create a pod_follows table for this
    await db.insert(podCreators).values({
      user_id,
      pod_id
    });

    // Increment pod_follow count
    await db.update(users)
      .set({ pod_follow: db.expr('pod_follow + 1') })
      .where(eq(users.user_id, user_id));

    return true;
  } catch (error) {
    console.error("Follow pod error:", error);
    throw error;
  }
}

// Unfollow a Pod
export async function unfollowPod(user_id, pod_id) {
  try {
    // Remove from pod_creators (or your follow table)
    await db.delete(podCreators)
      .where(
        and(
          eq(podCreators.user_id, user_id),
          eq(podCreators.pod_id, pod_id)
        )
      );

    // Decrement pod_follow count
    await db.update(users)
      .set({ pod_follow: db.expr('pod_follow - 1') })
      .where(eq(users.user_id, user_id));

    return true;
  } catch (error) {
    console.error("Unfollow pod error:", error);
    throw error;
  }
}

// Search Pods
export async function searchPods(searchTerm) {
  try {
    const results = await db.select().from(pods)
      .where(
        or(
          like(pods.subtag, `%${searchTerm}%`),
          like(pods.domain, `%${searchTerm}%`)
        )
      );

    return results;
  } catch (error) {
    console.error("Search pods error:", error);
    throw error;
  }
}