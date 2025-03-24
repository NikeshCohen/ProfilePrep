import { NavigationItem } from "@/types";
import {
  BarChart3,
  BookDashed,
  Briefcase,
  FileText,
  Files,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export const dashboardNavItems: NavigationItem[] = [
  {
    title: "App",
    href: "/app",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    adminOnly: true,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    adminOnly: true,
    superAdminOnly: true,
  },
  {
    title: "My CVs",
    href: "/dashboard/cvs",
  },
  {
    title: "All CVs",
    href: "/dashboard/cvs/all",
    superAdminOnly: true,
  },
];

export const sidebarItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: <Briefcase className="h-5 w-5" />,
    superAdminOnly: true,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: <BookDashed className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "My CVs",
    href: "/dashboard/cvs",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "All CVs",
    href: "/dashboard/cvs/all",
    icon: <Files className="h-5 w-5" />,
    superAdminOnly: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];
