"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

export function PostCard({ story }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes_count || 0);
  const shouldTruncate = story.content.length > 280;

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
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
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

  return (
    <div className="space-y-4 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={`/api/avatar/${story.user_id}`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">{story.title}</h2>
            <span className="text-sm text-muted-foreground">
              {formatDate(story.created_at)}
            </span>
          </div>

          <div className="mt-2">
            {shouldTruncate && !isExpanded ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {story.content.slice(0, 280)}...
                </p>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="mt-1 text-sm text-primary hover:underline"
                >
                  Read more
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{story.content}</p>
            )}
          </div>

          {story.hashtags && story.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {story.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            onClick={handleLike}
            className="transition-colors"
          >
            <Heart
              className={`mr-1 h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`}
            />
            {formatCount(likeCount)}
          </Button>

          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-1 h-4 w-4" />
            {formatCount(story.comments_count)}
          </Button>

          {story.is_featured && (
            <Button variant="ghost" size="sm">
              <Sparkles className="mr-1 h-4 w-4" />
              Featured
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">Pod #{story.pod_id}</div>
      </div>
    </div>
  );
}
