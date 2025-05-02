"use client";

import {
  getActiveUsers,
  getTemplateUsage,
  getTopCompanies,
} from "@/actions/analytics.actions";
import { useQuery } from "@tanstack/react-query";
import type { User } from "next-auth";

export const useTopCompaniesQuery = (user: User) => {
  return useQuery({
    queryKey: ["topCompanies", user.id, user.role],
    queryFn: () => getTopCompanies(user),
    // 10 minutes
    staleTime: 1000 * 60 * 10,
    select: (data) =>
      data ??
      // default empty array
      [],
  });
};

export const useActiveUsersQuery = (user: User) => {
  return useQuery({
    queryKey: ["activeUsers", user.id, user.role],
    queryFn: () => getActiveUsers(user),
    staleTime: 1000 * 60 * 10,
    select: (data) => data ?? [],
  });
};

export const useTemplateUsageQuery = (user: User) => {
  return useQuery({
    queryKey: ["templateUsage", user.id, user.role],
    queryFn: () => getTemplateUsage(user),
    staleTime: 1000 * 60 * 10,
    select: (data) => data ?? [],
  });
};
