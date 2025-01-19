"use client";

import { useState, useEffect } from "react";
import { CreatePost } from "./components/create-post";
import { PostCard } from "./components/post-card";
import { useUser } from "@/hooks/user";
import { fetchStoriesForUser } from "../../utils/db/action";

// Dummy initial posts
const initialPosts = [
  {
    id: "1",
    author: {
      name: "Satish Singh",
      role: "Web Development",
      avatar: "/placeholder.svg",
    },
    content:
      "I just got one of the best investment decks ever. It's not a deck, it's a Notion doc with 12 pages. Each page is a succinct customer story and quote about the real-world impact the product is having.",
    hashtags: ["technology"],
    pod: "technology",
    createdAt: "2025-02-14T00:00:00.000Z", // Use ISO string format
    isTimeCapsule: true,
    freezeTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  // Add more dummy posts as needed
];

export default function Home() {
  const { user, loading, error } = useUser();
  const [posts, setPosts] = useState(initialPosts);
  const [stories, setStories] = useState([]);

  // Fetch stories for the current user
  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return; // Check if user is null or undefined

      try {
        const fetchedStories = await fetchStoriesForUser(user.user_id);
        setStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [user]); // Add user as a dependency

  const handleCreatePost = (newPost) => {
    const post = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        role: "Member",
        avatar: "/placeholder.svg",
      },
      content: newPost.content,
      hashtags: newPost.hashtags,
      pod: newPost.pod,
      createdAt: new Date().toISOString(), // Use ISO string format
      isTimeCapsule: newPost.isTimeCapsule,
      freezeTime: newPost.isTimeCapsule ? 24 * 60 * 60 * 1000 : undefined,
    };

    setPosts([post, ...posts]);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <CreatePost onCreatePost={handleCreatePost} />
      <div className="mt-4 flex h-auto w-full flex-col gap-2">
        {stories.map((story) => (
          <PostCard key={story.story_id} story={story} />
        ))}
      </div>
    </div>
  );
}
