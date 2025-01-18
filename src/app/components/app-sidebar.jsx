"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import SignIn from "./auth/sign-in-button";
import SignOut from "./auth/sign-out-button";
import { ModeToggle } from "./mode-toggle";
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

import { useSession } from "next-auth/react";
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
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
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
        {session ? <SignOut /> : <SignIn />}
      </div>
    </Sidebar>
  );
}
