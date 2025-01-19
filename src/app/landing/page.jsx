import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Users,
  Newspaper,
  Share2,
  BookMarked,
  Mountain,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Mountain className="h-6 w-6" />
          <span className="ml-2 text-xl font-bold">Open Secret</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Share Your Story, Connect with Hearts
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  One stop for real stories, true bonds, and shared experiences.
                  Join our community where authenticity meets connection.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="px-8">Get Started</Button>
                <Button variant="outline" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <BookOpen className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Stories That Matter</CardTitle>
                  <CardDescription>
                    Share your personal journey, experiences, and moments that
                    shaped your life.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Newspaper className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Engaging Articles</CardTitle>
                  <CardDescription>
                    Write and discover thought-provoking articles from diverse
                    perspectives.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Vibrant Community</CardTitle>
                  <CardDescription>
                    Connect with like-minded individuals who share your
                    interests and passions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Where Every Story Finds Its Home
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Join thousands of storytellers and readers creating meaningful
                  connections through shared experiences.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span className="font-medium">Authentic Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Engaging Discussions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Easy Sharing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-primary" />
                    <span className="font-medium">Save Favorites</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 lg:space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        alt="User avatar"
                        className="rounded-full"
                        height="40"
                        src="/placeholder.svg?height=40&width=40"
                        style={{
                          aspectRatio: "40/40",
                          objectFit: "cover",
                        }}
                        width="40"
                      />
                      <div className="grid gap-1">
                        <h3 className="font-semibold">Sarah Mitchell</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          "This platform helped me share my journey and connect
                          with others who understood exactly what I was going
                          through."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        alt="User avatar"
                        className="rounded-full"
                        height="40"
                        src="/placeholder.svg?height=40&width=40"
                        style={{
                          aspectRatio: "40/40",
                          objectFit: "cover",
                        }}
                        width="40"
                      />
                      <div className="grid gap-1">
                        <h3 className="font-semibold">David Chen</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          "I've found an incredible community here. The stories
                          I read daily inspire me to share my own experiences."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Start Sharing Your Story Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join our growing community and be part of something
                  meaningful.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Join Now</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 StoryShare. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </footer>
    </div>
  );
}
