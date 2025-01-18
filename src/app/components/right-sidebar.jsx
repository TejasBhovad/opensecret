"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const RightSidebar = () => {
  const hashtags = [
    "nature",
    "photography",
    "travel",
    "art",
    "love",
    "photooftheday",
    "instagood",
    "beautiful",
    "fashion",
    "picoftheday",
    "happy",
    "cute",
    "summer",
    "me",
    "friends",
    "selfie",
  ];

  const users = [
    {
      username: "johndoe",
      name: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/lego/0.jpg",
    },
    {
      username: "janedoe",
      name: "Jane Doe",
      profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
    },
    {
      username: "johndoe2",
      name: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/lego/2.jpg",
    },
    {
      username: "janedoe2",
      name: "Jane Doe",
      profilePic: "https://randomuser.me/api/portraits/lego/3.jpg",
    },
  ];

  const pods = [
    {
      name: "Pod 1",
      followers: 3,
      image: "https://randomuser.me/api/portraits/lego/4.jpg",
    },
    {
      name: "Pod 2",
      followers: 5,
      image: "https://randomuser.me/api/portraits/lego/5.jpg",
    },
    {
      name: "Pod 3",
      followers: 4,
      image: "https://randomuser.me/api/portraits/lego/6.jpg",
    },
    {
      name: "Pod 4",
      followers: 2,
      image: "https://randomuser.me/api/portraits/lego/7.jpg",
    },
  ];

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
        <motion.div className="space-y-3">
          {randomUsers.map((user) => (
            <motion.div
              key={user.username}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-secondary/10"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-foreground/50">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFollowUser(user.username)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                  followedUsers.has(user.username)
                    ? "bg-primary/20 text-background"
                    : "bg-primary text-background hover:bg-primary/90"
                }`}
              >
                {followedUsers.has(user.username) ? "Following" : "Follow"}
              </button>
            </motion.div>
          ))}
        </motion.div>
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
        <motion.div className="space-y-3">
          {randomPods.map((pod) => (
            <motion.div
              key={pod.name}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-secondary/10"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <img
                  src={pod.image}
                  alt={pod.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{pod.name}</p>
                  <p className="text-sm text-foreground/50">
                    {pod.followers} followers
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleFollowPod(pod.name)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                  followedPods.has(pod.name)
                    ? "bg-primary/20 text-background"
                    : "bg-primary text-background hover:bg-primary/90"
                }`}
              >
                {followedPods.has(pod.name) ? "Following" : "Follow"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RightSidebar;
