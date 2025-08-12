"use client";

import {
  fetchAllCompanies,
  fetchAllUsers,
  getAllUserDocs,
  getOrganizationAnalyses,
  getOrganizationAnalytics,
  getOrganizationMembers,
} from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

export const useUsersQuery = (sessionUser: User) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchAllUsers(sessionUser),
  });
};

export const useCompaniesQuery = (sessionUser: User, options = {}) => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchAllCompanies(sessionUser),
    ...options,
  });
};

export const useAdminDocsQuery = (user: User) => {
  return useQuery({
    queryKey: ["allUserDocs", user.id],
    queryFn: () => getAllUserDocs(user),
  });
};

// Candidate organization queries
export const useOrganizationMembersQuery = (user: User) => {
  return useQuery({
    queryKey: ["organizationMembers", user.company?.id],
    queryFn: () => getOrganizationMembers(user),
    enabled: !!(
      user.company?.id &&
      user.userType === "CANDIDATE" &&
      (user.role === "ADMIN" || user.role === "SUPERADMIN")
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrganizationAnalysesQuery = (user: User) => {
  return useQuery({
    queryKey: ["organizationAnalyses", user.company?.id],
    queryFn: () => getOrganizationAnalyses(user),
    enabled: !!(
      user.company?.id &&
      user.userType === "CANDIDATE" &&
      (user.role === "ADMIN" || user.role === "SUPERADMIN")
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrganizationAnalyticsQuery = (user: User) => {
  return useQuery({
    queryKey: ["organizationAnalytics", user.company?.id],
    queryFn: () => getOrganizationAnalytics(user),
    enabled: !!(
      user.company?.id &&
      user.userType === "CANDIDATE" &&
      (user.role === "ADMIN" || user.role === "SUPERADMIN")
    ),
    staleTime: 1000 * 60 * 2, // 2 minutes for analytics
  });
};
