"use client";

import { useQuery } from "@tanstack/react-query";

import { getDocContent, getUserDocs } from "../user.actions";

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
