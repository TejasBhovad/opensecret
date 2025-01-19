"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useUser } from "@/hooks/user";
import {
  getSuggestedPods,
  getSuggestedUsers,
  getAllHashtags,
} from "../../../utils/db/action";
const RightSidebar = () => {
  const { user, loading, error } = useUser();
  const [hashtags, setHashtags] = useState([]);
  const [loadingHashtags, setLoadingHashtags] = useState(true);
  const [errorHashtags, setErrorHashtags] = useState(null);
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

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        console.log(user);
        const fetchedUsers = await getSuggestedUsers(user.user_id);
        console.log(fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user]);

  const [pods, setPods] = useState([]);
  const [loadingPods, setLoadingPods] = useState(true);
  const [errorPods, setErrorPods] = useState(null);
  useEffect(() => {
    const fetchPods = async () => {
      try {
        setLoadingPods(true);
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

  // State to track followed users and pods
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [followedPods, setFollowedPods] = useState(new Set());

  // State to store the randomized data
  const [randomHashtags, setRandomHashtags] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const [randomPods, setRandomPods] = useState([]);

  useEffect(() => {
    // Randomize the data only on initial load
    setRandomHashtags(hashtags.sort(() => Math.random() - 0.5).slice(0, 4));
    setRandomUsers(users.sort(() => Math.random() - 0.5).slice(0, 4));
    setRandomPods(pods.sort(() => Math.random() - 0.5).slice(0, 4));
  }, []);

  const toggleFollowUser = (username) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const toggleFollowPod = (podName) => {
    setFollowedPods((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(podName)) {
        newSet.delete(podName);
      } else {
        newSet.add(podName);
      }
      return newSet;
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full w-full space-y-6 p-4">
      {/* Trending Tags Section */}
      {JSON.stringify(user)}
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
        <motion.div className="grid grid-cols-2 grid-rows-2 gap-2">
          {randomHashtags.map((tag) => (
            <motion.div
              key={tag}
              className="flex cursor-pointer items-center justify-center gap-1 truncate rounded-full bg-secondary/50 p-2 text-foreground transition-colors hover:bg-secondary/70"
              variants={itemVariants}
            >
              <span className="text-foreground/50">#</span>
              {tag}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

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
        <motion.div className="space-y-3">{JSON.stringify(users)}</motion.div>
      </motion.div>

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
        <motion.div className="space-y-3">{JSON.stringify(pods)}</motion.div>
      </motion.div>
    </div>
  );
};

export default RightSidebar;
