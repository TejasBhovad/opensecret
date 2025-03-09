"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, Share2 } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

export function PostCard({ story }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes_count || 0);
  const shouldTruncate = story.content.length > 280;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Load liked state from localStorage on mount
  useEffect(() => {
    const liked = localStorage.getItem(`story-${story.story_id}-liked`);
    if (liked === "true") {
      setIsLiked(true);
    }
  }, [story.story_id]);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    // Save to localStorage
    localStorage.setItem(
      `story-${story.story_id}-liked`,
      newLikedState.toString(),
    );
  };

  // Format the date to be more readable
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      // For recent content (< 24h), use relative time
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });

      // For older content, show the actual date
      const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;
      return isRecent ? relativeTime : date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Format counts
  const formatCount = (count) => {
    if (!count) return "0";
    if (count < 1000) return count.toString();
    return `${(count / 1000).toFixed(1)}K`;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (story.author_name) {
      return story.author_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-border/50 ring-2 ring-background">
          <AvatarImage
            src={`/api/avatar/${story.user_id}`}
            onLoad={() => setIsImageLoaded(true)}
            className={isImageLoaded ? "opacity-100" : "opacity-0"}
          />
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">{story.title}</h2>
              {story.is_featured && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This story is featured by editors</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground/80 transition-colors hover:text-muted-foreground">
                    {formatDate(story.created_at)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(story.created_at).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mt-3">
            <AnimatePresence mode="wait">
              {shouldTruncate && !isExpanded ? (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="truncated"
                >
                  <p className="text-sm leading-relaxed text-card-foreground">
                    {story.content.slice(0, 280)}...
                  </p>
                  <Button
                    onClick={() => setIsExpanded(true)}
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-auto p-0 text-sm font-normal text-primary/90 hover:bg-transparent hover:text-primary hover:underline"
                  >
                    Read more
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="full"
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
                    {story.content}
                  </p>
                  {isExpanded && shouldTruncate && (
                    <Button
                      onClick={() => setIsExpanded(false)}
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto p-0 text-sm font-normal text-primary/90 hover:bg-transparent hover:text-primary hover:underline"
                    >
                      Show less
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {story.hashtags && story.hashtags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {story.hashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-6 cursor-pointer bg-secondary/50 px-2 py-0 text-xs transition-colors hover:bg-secondary"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
        <div className="flex items-center gap-1">
          <Button
            variant={isLiked ? "secondary" : "ghost"}
            size="sm"
            onClick={handleLike}
            className={`rounded-full transition-all duration-200 ${isLiked ? "hover:bg-red-100 dark:hover:bg-red-900/30" : ""}`}
          >
            <Heart
              className={`mr-1 h-4 w-4 transition-all ${
                isLiked ? "scale-110 fill-red-500 text-red-500" : ""
              }`}
            />
            {formatCount(likeCount)}
          </Button>

          <Button variant="ghost" size="sm" className="rounded-full">
            <MessageCircle className="mr-1 h-4 w-4" />
            {formatCount(story.comments_count || 0)}
          </Button>

          <Button variant="ghost" size="sm" className="rounded-full">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="h-6 cursor-pointer px-2 py-0 text-xs transition-all hover:bg-muted/50"
            >
              Pod #{story.pod_id}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>View all stories in this pod</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
