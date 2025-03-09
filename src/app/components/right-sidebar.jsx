"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/user";
import {
  followUser,
  unfollowUser,
  getSuggestedPods,
  getSuggestedUsers,
  followPod,
  unfollowPod,
  getAllHashtags,
  OnboardedUser,
} from "../../../utils/db/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const RightSidebar = () => {
  const { user } = useUser();
  const [hashtags, setHashtags] = useState([]);
  const [loadingHashtags, setLoadingHashtags] = useState(true);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [pods, setPods] = useState([]);
  const [loadingPods, setLoadingPods] = useState(true);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [followedPods, setFollowedPods] = useState(new Set());

  // Variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  // Fetch hashtags with optimized loading state
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setLoadingHashtags(true);
        const fetchedHashtags = await getAllHashtags();
        setHashtags(fetchedHashtags);
      } catch (err) {
        toast({
          title: "Error fetching trends",
          description: "Could not load trending hashtags",
          variant: "destructive",
        });
      } finally {
        setLoadingHashtags(false);
      }
    };

    fetchHashtags();
  }, [toast]);

  // Fetch users and pods in parallel with optimized loading states
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        setLoadingUsers(true);
        setLoadingPods(true);

        // Parallel requests for better performance
        const [fetchedUsers, fetchedPods] = await Promise.all([
          getSuggestedUsers(user.user_id),
          getSuggestedPods(user.user_id),
        ]);

        setUsers(fetchedUsers);
        setPods(fetchedPods);
      } catch (err) {
        toast({
          title: "Error loading suggestions",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
        setLoadingPods(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  // Memoize the random selection to prevent unnecessary recalculations
  const randomHashtags = useMemo(() => {
    return [...hashtags].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hashtags]);

  // Toggle follow/unfollow user with optimistic UI updates
  const toggleFollowUser = async (userId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
      });
      return;
    }

    try {
      // Optimistic update
      setFollowedUsers((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
        }
        return newSet;
      });

      // Actual API call
      if (followedUsers.has(userId)) {
        await unfollowUser(user.user_id, userId);
      } else {
        await followUser(user.user_id, userId);
      }
    } catch (error) {
      // Revert on error
      setFollowedUsers((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
        }
        return newSet;
      });

      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  // Toggle follow/unfollow pod with optimistic UI updates
  const toggleFollowPod = async (podId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow pods",
      });
      return;
    }

    try {
      // Optimistic update
      setFollowedPods((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(podId)) {
          newSet.delete(podId);
        } else {
          newSet.add(podId);
        }
        return newSet;
      });

      // Actual API call
      if (followedPods.has(podId)) {
        await unfollowPod(user.user_id, podId);
      } else {
        await followPod(user.user_id, podId);
      }
    } catch (error) {
      // Revert on error
      setFollowedPods((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(podId)) {
          newSet.delete(podId);
        } else {
          newSet.add(podId);
        }
        return newSet;
      });

      toast({
        title: "Error",
        description: "Failed to update pod follow status",
        variant: "destructive",
      });
    }
  };

  // Format timestamp for the updated date display
  const getFormattedDate = () => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header with date */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm">
        <div className="px-4 py-3 text-sm text-muted-foreground">
          {getFormattedDate()}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto px-3 pb-6 pt-2">
        {/* Trending Tags Section */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              Trending Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="grid grid-cols-2 gap-2"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {loadingHashtags
                ? [...Array(4)].map((_, i) => (
                    <Skeleton
                      key={`hashtag-skeleton-${i}`}
                      className="h-8 w-full rounded-full"
                    />
                  ))
                : randomHashtags.map((tag) => (
                    <motion.div
                      key={tag.id || `hashtag-${tag.name || i}`}
                      variants={itemVariants}
                    >
                      <Badge
                        variant="secondary"
                        className="flex h-8 w-full cursor-pointer items-center justify-center gap-1 truncate px-3 py-1.5 text-sm transition-all hover:bg-secondary/80"
                      >
                        <span className="text-muted-foreground">#</span>
                        {tag.name}
                      </Badge>
                    </motion.div>
                  ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* Suggested Users Section */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Suggested Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {loadingUsers ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={`user-skeleton-${i}`}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                ))
              ) : users.length === 0 ? (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  No suggestions available
                </div>
              ) : (
                users.map((user) => (
                  <motion.div
                    key={user.user_id}
                    variants={itemVariants}
                    className="flex items-center justify-between rounded-lg py-1.5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile} alt={user.name} />
                        <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          @{user.name?.toLowerCase().replace(/\s+/g, "_")}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={
                        followedUsers.has(user.user_id)
                          ? "outline"
                          : "secondary"
                      }
                      onClick={() => toggleFollowUser(user.user_id)}
                      className={`h-8 rounded-full px-3 text-xs transition-all duration-200 ${followedUsers.has(user.user_id) ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                    >
                      {followedUsers.has(user.user_id) ? "Following" : "Follow"}
                    </Button>
                  </motion.div>
                ))
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Popular Pods Section */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Popular Pods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {loadingPods ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={`pod-skeleton-${i}`}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                ))
              ) : pods.length === 0 ? (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  No pods available
                </div>
              ) : (
                pods.map((pod, index) => (
                  <motion.div
                    key={pod.id || pod.pod_id || `pod-${index}`}
                    variants={itemVariants}
                    className="flex items-center justify-between rounded-lg py-1.5 transition-colors"
                  >
                    <div className="flex max-w-[70%] flex-col">
                      <span className="truncate text-sm font-medium">
                        {pod.title || pod.name}
                      </span>
                      {(pod.description || pod.subtag) && (
                        <span className="truncate text-xs text-muted-foreground">
                          {pod.description || `#${pod.subtag}`}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={
                        followedPods.has(pod.id || pod.pod_id)
                          ? "outline"
                          : "secondary"
                      }
                      onClick={() => toggleFollowPod(pod.id || pod.pod_id)}
                      className={`h-8 rounded-full px-3 text-xs transition-all duration-200 ${followedPods.has(pod.id || pod.pod_id) ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                    >
                      {followedPods.has(pod.id || pod.pod_id)
                        ? "Following"
                        : "Follow"}
                    </Button>
                  </motion.div>
                ))
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer with credits - optional */}
        <div className="px-1 pt-2 text-xs text-muted-foreground/70">
          <p>© 2025 Pod Social</p>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(RightSidebar);
