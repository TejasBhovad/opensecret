"use client";

import {
  getUserPods,
  createStory,
  getUserStories,
} from "../../../utils/db/action";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/user";
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
import { PostCard } from "./post-card";

export function CreatePost() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingStories, setLoadingStories] = useState(true);

  // Fetch user stories
  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return; // Exit if user is not available

      try {
        setLoadingStories(true);
        const fetchedStories = await getUserStories(user.user_id);
        setStories(fetchedStories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStories(false);
      }
    };

    fetchStories();
  }, [user]); // Dependency on user

  // Fetch user pods
  useEffect(() => {
    const fetchPods = async () => {
      if (!user) return; // Exit if user is not available

      try {
        const userPods = await getUserPods(user.user_id);
        setPods(userPods);
      } catch (error) {
        console.error("Error fetching pods:", error);
      }
    };
    fetchPods();
  }, [user]);

  // Handle story submission
  const handleSubmit = async () => {
    if (!content.trim() || !selectedPod || !user || !title.trim()) return;

    try {
      setLoading(true);
      console.log(
        "Creating story...",
        user.user_id,
        selectedPod,
        title.trim(),
        content.trim(),
        hashtags,
      );
      await createStory({
        pod_id: selectedPod,
        author_id: user.user_id,
        title: title.trim(),
        content: content.trim(),
        tags: hashtags,
        is_draft: false,
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error creating story:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setContent("");
    setHashtags([]);
    setSelectedPod("");
    setNewHashtag("");
  };

  // Handle hashtag input
  const handleHashtagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHashtag();
    }
  };

  // Add a new hashtag
  const addHashtag = () => {
    const cleanTag = newHashtag
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
      .replace(/[^a-z0-9]/g, "");

    if (cleanTag && !hashtags.includes(cleanTag)) {
      setHashtags([...hashtags, cleanTag]);
      setNewHashtag("");
    }
  };

  // Remove a hashtag
  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4 rounded-lg bg-background p-4">
      <input
        type="text"
        placeholder="Story Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-background p-2 text-xl font-bold outline-none"
      />

      <Textarea
        placeholder="Write your story..."
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
            onClick={addHashtag}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Tag
          </Button>
          <input
            id="hashtag-input"
            type="text"
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            placeholder="Enter hashtag"
            className="bg-transparent text-sm outline-none"
          />
        </div>

        <Select value={selectedPod} onValueChange={setSelectedPod}>
          <SelectTrigger className="w-[140px]">
            <Box className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Pod" />
          </SelectTrigger>
          <SelectContent>
            {pods.map((pod) => (
              <SelectItem key={pod.pod_id} value={pod.pod_id}>
                {pod.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={loading || !content.trim() || !selectedPod || !title.trim()}
        >
          {loading ? "Posting..." : "Post Story"}
        </Button>
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeHashtag(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
