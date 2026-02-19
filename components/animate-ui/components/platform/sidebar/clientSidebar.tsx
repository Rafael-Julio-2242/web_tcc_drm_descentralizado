"use client";

import { Bell, Bot, Coins, Home, KeyRound, Sparkles, User } from "lucide-react";
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
    content: [
      {
        title: "Home",
        url: "/",
        icon: <Home />,
      },
      {
        title: "Tokens",
      },
      {
        title: "Meus Tokens",
        url: "/tokens",
        icon: <Coins />,
      },
      {
        title: "Criar Token",
        url: "/tokens/criar",
        icon: <Sparkles />,
      },
    ],
  };

  return (
    <AppSidebar sidebarData={sidebarData} className={className}>
      {children}
    </AppSidebar>
  );
}