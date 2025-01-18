"use client";

import { useState } from "react";
import { CreatePost } from "./components/create-post";
import { PostCard } from "./components/post-card";

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
  const [posts, setPosts] = useState(initialPosts);

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
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
