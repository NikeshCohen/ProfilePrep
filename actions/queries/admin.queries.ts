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

import { isCandidateAdmin, hasCompanyAccess } from "@/lib/roleUtils";

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
    enabled: !!(hasCompanyAccess(user) && isCandidateAdmin(user)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrganizationAnalysesQuery = (user: User) => {
  return useQuery({
    queryKey: ["organizationAnalyses", user.company?.id],
    queryFn: () => getOrganizationAnalyses(user),
    enabled: !!(hasCompanyAccess(user) && isCandidateAdmin(user)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrganizationAnalyticsQuery = (user: User) => {
  return useQuery({
    queryKey: ["organizationAnalytics", user.company?.id],
    queryFn: () => getOrganizationAnalytics(user),
    enabled: !!(hasCompanyAccess(user) && isCandidateAdmin(user)),
    staleTime: 1000 * 60 * 2, // 2 minutes for analytics
  });
};
