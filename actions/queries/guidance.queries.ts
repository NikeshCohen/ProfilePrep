"use client";

import {
  getBookmarkedTopics,
  getGuidanceAnalytics,
  getPersonalizedRecommendations,
  getTopicProgress,
  getUserGuidancePreferences,
  getUserGuidanceProgress,
  getUserProfileForContent,
  toggleGuidanceBookmark,
  updateGuidanceProgress,
} from "@/actions/guidance.actions";
import type { UserType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query hook for user's guidance progress
export const useGuidanceProgressQuery = (userType?: UserType) => {
  return useQuery({
    queryKey: ["guidance-progress", userType],
    queryFn: () => getUserGuidanceProgress(userType),
    staleTime: 1000 * 60 * 10, // 10 minutes (shorter)
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// Query hook for guidance analytics
export const useGuidanceAnalyticsQuery = () => {
  return useQuery({
    queryKey: ["guidance-analytics"],
    queryFn: getGuidanceAnalytics,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

// Query hook for user guidance preferences
export const useGuidancePreferencesQuery = () => {
  return useQuery({
    queryKey: ["guidance-preferences"],
    queryFn: getUserGuidancePreferences,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

// Query hook for personalized recommendations
export const usePersonalizedRecommendationsQuery = () => {
  return useQuery({
    queryKey: ["guidance-recommendations"],
    queryFn: getPersonalizedRecommendations,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

// Query hook for user profile for content
export const useUserProfileForContentQuery = (userType?: UserType) => {
  return useQuery({
    queryKey: ["user-profile-content", userType],
    queryFn: () => getUserProfileForContent(userType),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
  });
};

// Query hook for specific topic progress
export const useTopicProgressQuery = (
  topicId: string,
  userType?: UserType,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["topic-progress", topicId, userType],
    queryFn: () => getTopicProgress(topicId, userType),
    staleTime: 1000 * 60 * 5, // 5 minutes (more aggressive)
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled,
  });
};

// Query hook for bookmarked topics
export const useBookmarkedTopicsQuery = (userType?: UserType) => {
  return useQuery({
    queryKey: ["bookmarked-topics", userType],
    queryFn: () => getBookmarkedTopics(userType),
    staleTime: 1000 * 60 * 5, // 5 minutes (more aggressive)
    gcTime: 1000 * 60 * 30, // 30 minutes (shorter garbage collection)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
  });
};

// Mutation hook for updating guidance progress
export const useUpdateGuidanceProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGuidanceProgress,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["guidance-progress"] });
        queryClient.invalidateQueries({ queryKey: ["guidance-analytics"] });
        queryClient.invalidateQueries({
          queryKey: ["guidance-recommendations"],
        });
        queryClient.invalidateQueries({ queryKey: ["topic-progress"] });
      }
    },
  });
};

// Mutation hook for toggling bookmark
export const useToggleBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      bookmarked,
    }: {
      topicId: string;
      bookmarked: boolean;
    }) => toggleGuidanceBookmark(topicId, bookmarked),
    onMutate: async ({ topicId, bookmarked }) => {
      // Optimistic update for better UX
      await queryClient.cancelQueries({ queryKey: ["bookmarked-topics"] });
      await queryClient.cancelQueries({ queryKey: ["guidance-progress"] });

      // Store previous data for rollback
      const previousBookmarkedData = queryClient.getQueryData([
        "bookmarked-topics",
      ]);
      const previousProgressData = queryClient.getQueryData([
        "guidance-progress",
      ]);

      // Optimistically update bookmarked data
      queryClient.setQueryData(["bookmarked-topics"], (old: unknown) => {
        const oldData = old as
          | {
              success?: boolean;
              data?: Array<{ topicId: string; bookmarked: boolean }>;
            }
          | undefined;
        if (oldData?.success && oldData?.data) {
          if (bookmarked) {
            // Add to bookmarks if not already there
            const exists = oldData.data.some(
              (item) => item.topicId === topicId,
            );
            if (!exists) {
              return {
                ...oldData,
                data: [...oldData.data, { topicId, bookmarked: true }],
              };
            }
          } else {
            // Remove from bookmarks
            return {
              ...oldData,
              data: oldData.data.filter((item) => item.topicId !== topicId),
            };
          }
        }
        return old;
      });

      return { previousBookmarkedData, previousProgressData };
    },
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate queries to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["guidance-progress"] });
        queryClient.invalidateQueries({ queryKey: ["bookmarked-topics"] });
      }
    },
    onError: (_, __, context) => {
      // Rollback optimistic updates on error
      if (context?.previousBookmarkedData) {
        queryClient.setQueryData(
          ["bookmarked-topics"],
          context.previousBookmarkedData,
        );
      }
      if (context?.previousProgressData) {
        queryClient.setQueryData(
          ["guidance-progress"],
          context.previousProgressData,
        );
      }
    },
    onSettled: () => {
      // Ensure data is fresh after mutation
      queryClient.invalidateQueries({ queryKey: ["bookmarked-topics"] });
      queryClient.invalidateQueries({ queryKey: ["guidance-progress"] });
    },
  });
};
