"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useUser } from "@/hooks/user";
import {
  followUser,
  unfollowUser,
  getSuggestedPods,
  getSuggestedUsers,
  followPod,
  unfollowPod,
  getAllHashtags,
} from "../../../utils/db/action";

const RightSidebar = () => {
  const { user, loading, error } = useUser();
  const [hashtags, setHashtags] = useState([]);
  const [loadingHashtags, setLoadingHashtags] = useState(true);
  const [errorHashtags, setErrorHashtags] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [pods, setPods] = useState([]);
  const [loadingPods, setLoadingPods] = useState(true);
  const [errorPods, setErrorPods] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [followedPods, setFollowedPods] = useState(new Set());
  const [randomHashtags, setRandomHashtags] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const [randomPods, setRandomPods] = useState([]);

  // Dummy data for tags
  const tags = [
    { id: 1, name: "Tech" },
    { id: 2, name: "Music" },
    { id: 3, name: "Games" },
    { id: 4, name: "Drama" },
  ];

  // Variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch hashtags
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setLoadingHashtags(true);
        const fetchedHashtags = await getAllHashtags();
        setHashtags(fetchedHashtags);
      } catch (err) {
        setErrorHashtags(err.message);
      } finally {
        setLoadingHashtags(false);
      }
    };
    fetchHashtags();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        if (!user) return;
        const fetchedUsers = await getSuggestedUsers(user.user_id);
        setUsers(fetchedUsers);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch pods
  useEffect(() => {
    const fetchPods = async () => {
      try {
        setLoadingPods(true);
        if (!user) return;
        const fetchedPods = await getSuggestedPods(user.user_id);
        setPods(fetchedPods);
      } catch (err) {
        setErrorPods(err.message);
      } finally {
        setLoadingPods(false);
      }
    };
    fetchPods();
  }, [user]);

  // Set random data on initial load
  useEffect(() => {
    setRandomHashtags(hashtags.sort(() => Math.random() - 0.5).slice(0, 4));
    setRandomUsers(users.sort(() => Math.random() - 0.5).slice(0, 4));
    setRandomPods(pods.sort(() => Math.random() - 0.5).slice(0, 4));
  }, [hashtags, users, pods]);

  // Toggle follow/unfollow user
  const toggleFollowUser = async (userId) => {
    try {
      if (followedUsers.has(userId)) {
        await unfollowUser(user.user_id, userId);
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await followUser(user.user_id, userId);
        setFollowedUsers((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  // Toggle follow/unfollow pod
  const toggleFollowPod = async (podId) => {
    try {
      if (followedPods.has(podId)) {
        await unfollowPod(user.user_id, podId);
        setFollowedPods((prev) => {
          const newSet = new Set(prev);
          newSet.delete(podId);
          return newSet;
        });
      } else {
        await followPod(user.user_id, podId);
        setFollowedPods((prev) => new Set(prev).add(podId));
      }
    } catch (error) {
      console.error("Error following/unfollowing pod:", error);
    }
  };

  return (
    <div className="h-full w-full space-y-6 p-4">
      {/* Fixed Tags Section */}
      <div className="sticky top-0 z-10 p-4 shadow-md">
        <motion.div
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.h3 className="mb-3 text-lg font-semibold">
            Trending Tags
          </motion.h3>
          <motion.div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                className="flex cursor-pointer items-center justify-center gap-1 truncate rounded-full bg-secondary/50 p-2 text-foreground transition-colors hover:bg-secondary/70"
                variants={itemVariants}
              >
                <span className="text-foreground/50">#</span>
                {tag.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Suggested Users Section */}
      <motion.div
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h3 className="mb-3 text-lg font-semibold">
          Suggested Users
        </motion.h3>
        <motion.div className="space-y-3">
          {randomUsers.map((user) => (
            <motion.div
              key={user.user_id}
              variants={itemVariants}
              className="flex items-center justify-between rounded-lg bg-secondary/20 p-3 transition-colors hover:bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profile}
                  alt={user.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-foreground/60">
                    @user_{user.user_id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleFollowUser(user.user_id)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                  followedUsers.has(user.user_id)
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {followedUsers.has(user.user_id) ? "Following" : "Follow"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Popular Pods Section */}
      {/* Popular Pods Section */}
      <motion.div
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h3 className="mb-3 text-lg font-semibold">
          Popular Pods
        </motion.h3>
        {randomPods.map((pod, index) => (
          <motion.div
            // Fallback to a combination of index and title if id is not available
            key={pod.id || `pod-${pod.title}-${index}`}
            variants={itemVariants}
            className="flex items-center justify-between rounded-lg bg-secondary/20 p-3 transition-colors hover:bg-secondary/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{pod.title}</span>
                {pod.description && (
                  <span className="text-xs text-foreground/60">
                    {pod.description}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleFollowPod(pod.id)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                followedPods.has(pod.id)
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {followedPods.has(pod.id) ? "Following" : "Follow"}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RightSidebar;
