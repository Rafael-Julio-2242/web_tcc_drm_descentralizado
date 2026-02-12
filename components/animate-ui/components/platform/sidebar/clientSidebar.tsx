"use client";

import { Bell, Bot, KeyRound, Sparkles, User } from "lucide-react";
import {
  SidebarData,
  SidebarFooterData,
  SidebarHeaderData,
  SidebarNavGroupData,
  SidebarSectionData,
} from "./types";
import AppSidebar from "./sidebar";

interface ClientSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ClientSidebar({
  children,
  className,
}: ClientSidebarProps) {
  const sidebarHeaderData: SidebarHeaderData = {
    teams: [],
  };

  const sidebarFooterData: SidebarFooterData = {
    menuButtons: [
      {
        title: "Account",
        icon: <User />,
        onClick: () => {
          alert("Account clicked");
        },
      },
      {
        title: "Notifications",
        icon: <Bell />,
        onClick: () => {
          alert("Notifications clicked");
        },
      },
      {
        title: "Logout",
        onClick: () => {
          alert("Logout clicked");
        },
        hasSeparatorUpper: true,
      },
    ],
  };

  const agentSection: SidebarSectionData = {
   title: "Agents",
  };

  const sidebarData: SidebarData = {
    header: sidebarHeaderData,
    footer: sidebarFooterData,
    content: [],
  };

  return (
    <AppSidebar sidebarData={sidebarData} className={className}>
      {children}
    </AppSidebar>
  );
}