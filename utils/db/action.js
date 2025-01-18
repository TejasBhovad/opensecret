import bcrypt from 'bcrypt';
import { and, eq, like, or } from 'drizzle-orm';
import { db } from './dbconfig';
import {
  bookmarks,
  podCreators,
  pods,
  users
} from './schema';

// User Registration
export async function registerUser(gmail, number, password, additionalData = {}) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(gmail);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db.insert(users).values({
      gmail,
      number,
      passwordHash: hashedPassword,
      pod_follow: 0,
      user_following: 0,
      followers: 0,
      ...additionalData
    }).returning();

    return newUser[0];
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// User Login
export async function loginUser(gmail, password) {
  try {
    const user = await getUserByEmail(gmail);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Update last active timestamp
    await updateUserProfile(user.user_id, { 
      last_active: new Date() 
    });

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Login error:", error);
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
export async function createPod(admin_id, podData) {
  try {
    // Validate admin exists
    const admin = await getUserById(admin_id);
    if (!admin) {
      throw new Error('Invalid admin user');
    }

    const newPod = await db.insert(pods).values({
      admin_id,
      is_public: podData.is_public ?? true,
      subtag: podData.subtag,
      domain: podData.domain,
      description: podData.description || '',
      created_at: new Date(),
      total_stories: 0,
      followers_count: 0,
      popularity_score: 0
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
    // Check if user and pod exist
    const user = await getUserById(user_id);
    const pod = await db.select().from(pods).where(eq(pods.pod_id, pod_id)).limit(1);

    if (!user || !pod[0]) {
      throw new Error('User or Pod not found');
    }

    // Check if already following
    const existingFollow = await db.select().from(podCreators)
      .where(
        and(
          eq(podCreators.user_id, user_id),
          eq(podCreators.pod_id, pod_id)
        )
      ).limit(1);

    if (existingFollow[0]) {
      throw new Error('Already following this pod');
    }

    // Insert pod creator relationship
    await db.insert(podCreators).values({
      user_id,
      pod_id,
      joined_at: new Date()
    });

    // Increment pod_follow count for user
    await db.update(users)
      .set({ pod_follow: db.expr('pod_follow + 1') })
      .where(eq(users.user_id, user_id));

    // Increment followers count for pod
    await db.update(pods)
      .set({ followers_count: db.expr('followers_count + 1') })
      .where(eq(pods.pod_id, pod_id));

    return true;
  } catch (error) {
    console.error("Follow pod error:", error);
    throw error;
  }
}

// Unfollow a Pod
export async function unfollowPod(user_id, pod_id) {
  try {
    // Remove from pod creators
    const deleteResult = await db.delete(podCreators)
      .where(
        and(
          eq(podCreators.user_id, user_id),
          eq(podCreators.pod_id, pod_id)
        )
      );

    // Decrement pod_follow count for user
    await db.update(users)
      .set({ pod_follow: db.expr('pod_follow - 1') })
      .where(eq(users.user_id, user_id));

    // Decrement followers count for pod
    await db.update(pods)
      .set({ followers_count: db.expr('followers_count - 1') })
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
    const { 
      limit = 20, 
      isPublic = true 
    } = options;

    const results = await db.select().from(pods)
      .where(
        and(
          or(
            like(pods.subtag, `%${searchTerm}%`),
            like(pods.domain, `%${searchTerm}%`)
          ),
          eq(pods.is_public, isPublic)
        )
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
    const existingBookmark = await db.select().from(bookmarks)
      .where(
        and(
          eq(bookmarks.user_id, user_id),
          eq(bookmarks.pod_id, pod_id)
        )
      ).limit(1);
    
    if (existingBookmark[0]) {
      throw new Error('Pod already bookmarked');
    }

    await db.insert(bookmarks).values({
      user_id,
      pod_id,
      bookmarked_at: new Date()
    });

    return true;
  } catch (error) {
    console.error("Bookmark pod error:", error);
    throw error;
  }
}