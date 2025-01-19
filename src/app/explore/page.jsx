'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PopularPods = () => {
  const pods = [
    {
      pod_id: 1,
      admin_id: 1,
      is_public: true,
      subtag: "tech",
      domain: "other",
      description: "hello this si desc",
      created_at: "2025-01-18T22:06:03.703Z",
      total_stories: 0,
      followers_count: -1,
      popularity_score: "0"
    },
    {
      pod_id: 3,
      admin_id: 3,
      is_public: true,
      subtag: "Sad",
      domain: "Anime",
      description: "kdkbcjbsj",
      created_at: "2025-01-18T23:16:50.254Z",
      total_stories: 0,
      followers_count: 0,
      popularity_score: "0"
    },
    {
      pod_id: 4,
      admin_id: 3,
      is_public: true,
      subtag: "Happy",
      domain: "Tech",
      description: "hello world",
      created_at: "2025-01-18T23:17:47.060Z",
      total_stories: 0,
      followers_count: 0,
      popularity_score: "0"
    }
  ];

  // Sort pods by popularity score and followers
  const sortedPods = [...pods].sort((a, b) => {
    if (b.popularity_score === a.popularity_score) {
      return b.followers_count - a.followers_count;
    }
    return Number(b.popularity_score) - Number(a.popularity_score);
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Popular Pods</h1>
      
      {sortedPods.map(pod => (
        <Card key={pod.pod_id} className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Pod #{pod.pod_id}</span>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {pod.followers_count} followers
                </Badge>
                <Badge variant="outline">
                  Score: {pod.popularity_score}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{pod.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="capitalize bg-blue-500 text-white">
                {pod.domain}
              </Badge>
              <Badge className="capitalize bg-green-500 text-white">
                {pod.subtag}
              </Badge>
              {pod.is_public ? (
                <Badge className="bg-gray-500">Public</Badge>
              ) : (
                <Badge className="bg-yellow-500">Private</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Created on {formatDate(pod.created_at)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PopularPods;