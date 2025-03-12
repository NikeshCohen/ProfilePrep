"use client";

import { fetchAllTemplates } from "@/actions/admin.actions";
import { getDocContent, getUserDocs } from "@/actions/user.actions";
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
    queryKey: ["templates"],
    queryFn: () => fetchAllTemplates(user),
  });
};
