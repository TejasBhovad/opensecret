import React from "react";
import { memo } from "react";
import { Input } from "@/components/ui/input";
import RightSidebar from "./right-sidebar";

const SidebarSquare = () => {
  return (
    <div className="hidden h-full w-1/4 min-w-72 flex-col gap-4 bg-background px-4 pt-4 lg:flex">
      <Input placeholder="Search..." className="w-full rounded-full" />
      <div className="h-full w-full flex-grow px-0 pb-4 pt-2">
        <div className="h-full w-full overflow-hidden rounded-lg border border-secondary bg-background">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

// Main content wrapper component
export const SidebarSquareWrapper = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-grow overflow-auto">{children}</div>
      <SidebarSquare />
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(SidebarSquare);
