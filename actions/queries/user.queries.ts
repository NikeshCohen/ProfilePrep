"use client";

import { fetchAllTemplates } from "@/actions/admin.actions";
import {
  getDocContent,
  getRecruiterDocuments,
  getUserDocs,
} from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

import { hasCompanyAccess } from "@/lib/roleUtils";

export const useUserDocsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userDocs", userId],
    queryFn: () => getUserDocs(userId),
    enabled: !!userId,
  });
};

export const useDocContentQuery = (docId: string, enabled = false) => {
  return useQuery({
    queryKey: ["docContent", docId],
    queryFn: () => getDocContent(docId),
    enabled: enabled && !!docId,
    staleTime: Infinity,
  });
};

export const useTemplatesQuery = (user: User) => {
  return useQuery({
    // keep for cache key
    queryKey: ["templates", user.company?.id],
    queryFn: () => fetchAllTemplates(user),
    enabled: hasCompanyAccess(user),
  });
};

export const useRecruiterDocumentsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["recruiterDocuments", userId],
    queryFn: () => getRecruiterDocuments(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
