"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Calendar,
  Lock,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const PopularPods = () => {
  const [sortBy, setSortBy] = useState("popularity");
  const [hoveredPod, setHoveredPod] = useState(null);

  const pods = [
    {
      pod_id: 1,
      admin_id: 1,
      is_public: true,
      name: "Tech Discussions",
      subtag: "tech",
      domain: "other",
      description:
        "A place to discuss the latest in technology, programming, and digital innovation.",
      created_at: "2025-01-18T22:06:03.703Z",
      total_stories: 15,
      followers_count: 42,
      popularity_score: "8.5",
    },
    {
      pod_id: 3,
      admin_id: 3,
      is_public: true,
      name: "Anime Feels",
      subtag: "Sad",
      domain: "Anime",
      description:
        "Share your thoughts and feelings about emotional anime moments and storylines.",
      created_at: "2025-01-18T23:16:50.254Z",
      total_stories: 8,
      followers_count: 27,
      popularity_score: "7.2",
    },
    {
      pod_id: 4,
      admin_id: 3,
      is_public: true,
      name: "Tech Happiness",
      subtag: "Happy",
      domain: "Tech",
      description:
        "Celebrating positive tech stories and breakthroughs that make our lives better.",
      created_at: "2025-01-18T23:17:47.060Z",
      total_stories: 12,
      followers_count: 31,
      popularity_score: "7.8",
    },
  ];

  // Sort pods based on selected criteria
  const sortedPods = useMemo(() => {
    return [...pods].sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return Number(b.popularity_score) - Number(a.popularity_score);
        case "followers":
          return b.followers_count - a.followers_count;
        case "recent":
          return new Date(b.created_at) - new Date(a.created_at);
        case "stories":
          return b.total_stories - a.total_stories;
        default:
          return Number(b.popularity_score) - Number(a.popularity_score);
      }
    });
  }, [pods, sortBy]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate domain and subtag colors consistently
  const getDomainColor = (domain) => {
    const domains = {
      Tech: "bg-blue-500/90 hover:bg-blue-600/90",
      Anime: "bg-purple-500/90 hover:bg-purple-600/90",
      Gaming: "bg-emerald-500/90 hover:bg-emerald-600/90",
      Art: "bg-amber-500/90 hover:bg-amber-600/90",
      other: "bg-gray-500/90 hover:bg-gray-600/90",
    };

    return domains[domain] || domains.other;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Popular Pods</h1>
        <Tabs
          defaultValue="popularity"
          value={sortBy}
          onValueChange={setSortBy}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="popularity" className="text-xs sm:text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Popularity</span>
            </TabsTrigger>
            <TabsTrigger value="followers" className="text-xs sm:text-sm">
              <Users className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Followers</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs sm:text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:gap-6">
        {sortedPods.map((pod) => (
          <motion.div
            key={pod.pod_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Card
              className="overflow-hidden border-border/60 transition-all duration-300 hover:border-border hover:shadow-md"
              onMouseEnter={() => setHoveredPod(pod.pod_id)}
              onMouseLeave={() => setHoveredPod(null)}
            >
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {pod.name || `Pod #${pod.pod_id}`}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {pod.description}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      {pod.followers_count}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-medium ${
                        Number(pod.popularity_score) > 8
                          ? "border-green-500/30 bg-green-500/10 text-green-600"
                          : Number(pod.popularity_score) > 5
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                            : "border-orange-500/30 bg-orange-500/10 text-orange-600"
                      }`}
                    >
                      Score: {pod.popularity_score}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge
                    className={`capitalize text-white ${getDomainColor(pod.domain)}`}
                  >
                    {pod.domain}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    #{pod.subtag}
                  </Badge>
                  {pod.is_public ? (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-background/50"
                    >
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"
                    >
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                    Created {formatDate(pod.created_at)}
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1.5 opacity-70"
                    >
                      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                      <path d="M12 7c1.5 0 2.7.3 3.77 1" />
                    </svg>
                    {pod.total_stories} stories
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-sm text-primary"
                >
                  View pod
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {sortedPods.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-muted p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m8 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className="mb-1 text-xl font-medium">No pods found</h3>
          <p className="text-muted-foreground">
            Try adjusting your sorting criteria or create a new pod.
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button variant="outline" className="text-sm">
          Explore more pods
        </Button>
      </div>
    </div>
  );
};

export default PopularPods;
