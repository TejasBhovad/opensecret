"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import SignIn from "./auth/sign-in-button";
import SignOut from "./auth/sign-out-button";
import { ModeToggle } from "./mode-toggle";
import { useUser } from "@/hooks/user";
import { Package, BookHeart, TimerReset } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create Pod",
    url: "/create",
    icon: Plus,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Inbox,
  },
  {
    title: "Personal Pods",
    url: "/journal",
    icon: BookHeart,
  },
  {
    title: "Time Capsule",
    url: "/capsule",
    icon: TimerReset,
  },
  {
    title: "Archived",
    url: "/archived",
    icon: Package,
  },
];

export function AppSidebar() {
  const { user, loading, error } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback UI while theme is undefined
  if (!mounted) {
    return (
      <Sidebar className="min-h-screen bg-gray-900 text-white">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className="rounded-lg hover:bg-gray-700"
                  >
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex w-full items-center gap-3 p-2"
                      >
                        <item.icon className="h-5 w-5 text-white" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="px-2 py-2">
          <ModeToggle />
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-foreground"
      } min-h-screen`}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`rounded-lg transition-all duration-200 ${
                    theme === "dark"
                      ? "hover:bg-gray-700"
                      : "text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex w-full items-center gap-3 p-2"
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="flex flex-col gap-2 px-2 py-2">
        <ModeToggle />
        <div className="flex items-center gap-2">
          {user ? <SignOut /> : <SignIn />}
        </div>
      </div>
    </Sidebar>
  );
}
