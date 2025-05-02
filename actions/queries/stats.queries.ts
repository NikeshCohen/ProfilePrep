"use client";

import {
  getAvgDocsPerUser,
  getDocsWithTrend,
  getRecentActivity,
  getSystemStats,
  getTotalCompanies,
  getTotalDocs,
  getTotalUsers,
  getUserStats,
} from "@/actions/stats.actions";
import { useQuery } from "@tanstack/react-query";
import type { User } from "next-auth";

export const useTotalUsersQuery = (user: User) => {
  return useQuery({
    queryKey: ["totalUsers", user.id, user.role],
    queryFn: () => getTotalUsers(user),
    // 5 minutes
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      data ??
      // default value
      0,
  });
};

export const useTotalDocsQuery = (user: User) => {
  return useQuery({
    queryKey: ["totalDocs", user.id, user.role],
    queryFn: () => getTotalDocs(user),
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? 0,
  });
};

export const useDocsWithTrendQuery = (user: User, userId?: string) => {
  return useQuery({
    queryKey: ["docsWithTrend", user.id, user.role, userId],
    queryFn: () => getDocsWithTrend(user, userId),
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? { totalDocs: 0, recentDocs: 0, docsTrend: 0 },
  });
};

export const useAvgDocsPerUserQuery = (user: User) => {
  return useQuery({
    queryKey: ["avgDocsPerUser", user.id, user.role],
    queryFn: () => getAvgDocsPerUser(user),
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? 0,
  });
};

export const useTotalCompaniesQuery = (user: User) => {
  return useQuery({
    queryKey: ["totalCompanies", user.id, user.role],
    queryFn: () => getTotalCompanies(user),
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? 0,
  });
};

export const useRecentActivityQuery = (user: User, userId?: string) => {
  return useQuery({
    queryKey: ["recentActivity", user.id, user.role, userId],
    queryFn: () => getRecentActivity(user, userId),
    // 2 minutes
    staleTime: 1000 * 60 * 2,
    select: (data) => data ?? [],
  });
};

export const useSystemStatsQuery = (user: User) => {
  return useQuery({
    queryKey: ["systemStats", user.id, user.role],
    queryFn: () => getSystemStats(user),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      data ?? {
        totalDocs: 0,
        totalTemplates: 0,
        totalAllowedDocs: 1,
        totalAllowedTemplates: 1,
      },
  });
};

export const useUserStatsQuery = (userId?: string) => {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => getUserStats(userId),
    staleTime: 1000 * 60 * 5,
    // only run if user id is provided
    enabled: !!userId,
    select: (data) => data ?? { recentDocs: 0 },
  });
};
