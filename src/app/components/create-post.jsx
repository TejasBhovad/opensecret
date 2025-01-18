"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Box } from "lucide-react";

export function CreatePost({ onCreatePost }) {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [isTimeCapsule, setIsTimeCapsule] = useState(false);

  const handleSubmit = () => {
    if (!content.trim() || !selectedPod) return;

    onCreatePost({
      content,
      hashtags,
      pod: selectedPod,
      isTimeCapsule,
    });

    // Reset form
    setContent("");
    setHashtags([]);
    setSelectedPod("");
    setIsTimeCapsule(false);
  };

  const handleHashtagKeyDown = (e) => {
    if (e.key === "Enter" && newHashtag.trim()) {
      e.preventDefault();
      setHashtags([...hashtags, newHashtag.trim()]);
      setNewHashtag("");
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-background p-4">
      <Textarea
        placeholder="Post Story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] bg-background"
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => document.getElementById("hashtag-input")?.focus()}
          >
            <Plus className="mr-1 h-4 w-4" />
            Hashtag
          </Button>
          <input
            id="hashtag-input"
            type="text"
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            placeholder="Press enter to add"
            className="bg-transparent text-sm outline-none"
          />
        </div>

        <Select value={selectedPod} onValueChange={setSelectedPod}>
          <SelectTrigger className="w-[140px]">
            <Box className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Pod" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit}>Post</Button>
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
