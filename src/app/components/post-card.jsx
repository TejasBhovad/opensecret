"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, Clock } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ClientDateDisplay } from "./client-date-display";

export function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.content.length > 280;

  const getFreezeTime = () => {
    try {
      const date = parseISO(post.createdAt);
      const freezeDate = new Date(date.getTime() + post.freezeTime);
      return formatDistanceToNow(freezeDate);
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="space-y-4 border-b border-border p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">{post.author.name}</h2>
              <p className="text-sm text-muted-foreground">
                {post.author.role}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {post.hashtags.map((tag) => (
                <Badge key={tag} className="bg-secondary text-foreground">
                  #{tag}
                </Badge>
              ))}
              <span className="text-sm text-background">
                Posted on <ClientDateDisplay date={post.createdAt} />
              </span>
            </div>
          </div>

          <div className="mt-2">
            {shouldTruncate && !isExpanded ? (
              <>
                <p>{post.content.slice(0, 280)}...</p>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="mt-1 text-sm text-primary"
                >
                  Read more...
                </button>
              </>
            ) : (
              <p>{post.content}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="mr-1 h-4 w-4" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Sparkles className="mr-1 h-4 w-4" />
            Summarise
          </Button>
        </div>

        {post.isTimeCapsule && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Replies will freeze in {getFreezeTime()}
          </div>
        )}
      </div>
    </div>
  );
}
