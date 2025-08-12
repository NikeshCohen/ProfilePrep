"use client";

import { getCVAnalysis, getUserCVAnalyses } from "@/actions/cv.actions";
import { useQuery } from "@tanstack/react-query";

export const useCVAnalysisQuery = (id: string) => {
  return useQuery({
    queryKey: ["cvAnalysis", id],
    queryFn: () => getCVAnalysis(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUserCVAnalysesQuery = () => {
  return useQuery({
    queryKey: ["userCVAnalyses"],
    queryFn: getUserCVAnalyses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
