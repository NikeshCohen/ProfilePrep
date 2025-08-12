"use client";

import { fetchAllTemplates } from "@/actions/admin.actions";
import {
  getDocContent,
  getRecruiterDocuments,
  getUserDocs,
} from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

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
    queryKey: ["templates", user.company?.id],
    queryFn: () => fetchAllTemplates(user),
    enabled: !!user.company,
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
