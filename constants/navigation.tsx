import { NavigationItem } from "@/types";
import {
  BarChart3,
  BookDashed,
  Briefcase,
  FileText,
  Files,
  LayoutDashboard,
  Settings,
  Target,
  TrendingUp,
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
    href: "/recruiter/documents",
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
    href: "/recruiter",
    icon: <LayoutDashboard className="h-5 w-5" />,
    recruiterOnly: true,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    adminOnly: true,
    recruiterOnly: true,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
    recruiterOnly: true,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: <Briefcase className="h-5 w-5" />,
    superAdminOnly: true,
    recruiterOnly: true,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: <BookDashed className="h-5 w-5" />,
    adminOnly: true,
    recruiterOnly: true,
  },
  {
    title: "My CVs",
    href: "/recruiter/documents",
    icon: <FileText className="h-5 w-5" />,
    recruiterOnly: true,
  },
  {
    title: "All CVs",
    href: "/dashboard/cvs/all",
    icon: <Files className="h-5 w-5" />,
    superAdminOnly: true,
    recruiterOnly: true,
  },
  {
    title: "Settings",
    href: "/recruiter/settings",
    icon: <Settings className="h-5 w-5" />,
    recruiterOnly: true,
  },
];

export const candidateSidebarItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/portal",
    icon: <LayoutDashboard className="h-5 w-5" />,
    candidateOnly: true,
  },
  /* 
  {
    title: "Upload CV",
    href: "/app",
    icon: <Upload className="h-5 w-5" />,
    candidateOnly: true,
  },
  */
  {
    title: "My Analyses",
    href: "/portal/analyses",
    icon: <Target className="h-5 w-5" />,
    candidateOnly: true,
  },
  {
    title: "Progress",
    href: "/portal/progress",
    icon: <TrendingUp className="h-5 w-5" />,
    candidateOnly: true,
  },
  {
    title: "Organization",
    href: "/portal/organization/members",
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
    candidateOnly: true,
  },
  {
    title: "Analytics",
    href: "/portal/organization/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    adminOnly: true,
    candidateOnly: true,
  },
  {
    title: "All CV Analyses",
    href: "/portal/organization/analyses",
    icon: <Files className="h-5 w-5" />,
    adminOnly: true,
    candidateOnly: true,
  },
  {
    title: "Settings",
    href: "/portal/settings",
    icon: <Settings className="h-5 w-5" />,
    candidateOnly: true,
  },
];
