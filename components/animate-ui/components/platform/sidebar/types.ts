import { LucideIcon } from "lucide-react";

export type SidebarTeam = {
  name: string;
  isActive: boolean;
  avatar?: React.ReactNode;
};

export interface SidebarNavItemData {
  title: string;
  url?: string;
  icon?: LucideIcon | React.ReactNode;
  onClick?: () => void;
  menuButtons?: {
    title: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    hasSeparator?: boolean;
  }[];
}

export interface SidebarNavGroupData {
  title: string;
  url: string;
  isActive: boolean;
  items: SidebarNavItemData[];
  icon?: LucideIcon | React.ReactNode;
}

export interface SidebarSectionData {
  title: string;
  icon?: LucideIcon | React.ReactNode;
}

export interface SidebarHeaderData {
  title?: string;
  titleClassName?: string;
  titleIcon?: LucideIcon | React.ReactNode;
  teams?: SidebarTeam[];
}

export interface SidebarFooterData {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
  menuButtons?: {
    title: string;
    icon?: LucideIcon | React.ReactNode;
    onClick?: () => void;
    hasSeparatorUpper?: boolean;
    hasSeparatorLower?: boolean;
  }[];
}

export interface SidebarData {
  header: SidebarHeaderData;
  footer: SidebarFooterData;
  content: (SidebarSectionData | SidebarNavGroupData | SidebarNavItemData)[];
}

export function validateSidebarType(
  item: any,
  type: "section" | "group" | "item"
): boolean {
  if (!item || typeof item !== "object") {
    return false;
  }

  switch (type) {
    case "section":
      // Check for properties of SidebarSectionData
      // A section must have a 'title' and must not have 'url' or 'items'.
      return (
        typeof item.title === "string" &&
        typeof item.url === "undefined" &&
        typeof item.items === "undefined"
      );

    case "group":
      // Check for properties of SidebarNavGroupData
      // A group must have 'title', 'url', 'isActive', and an 'items' array.
      return (
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        typeof item.isActive === "boolean" &&
        Array.isArray(item.items)
      );

    case "item":
      // Check for properties of SidebarNavItemData
      // An item must have 'title' and 'url', but not 'isActive' or 'items'.
      return (
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        typeof item.isActive === "undefined" &&
        typeof item.items === "undefined"
      );

    default:
      return false;
  }
}