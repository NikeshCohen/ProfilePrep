"use client";

import {
  generateCVContent,
  generateCoverLetterContent,
  generateInterviewContent,
} from "@/lib/guidance/content/candidate-content";
import {
  generateMarketInsightsContent,
  generateScreeningContent,
  generateSourcingContent,
} from "@/lib/guidance/content/recruiter-content";
import {
  GuidancePreferences,
  TopicContent,
} from "@/lib/guidance/content/types";
import { isCandidate } from "@/lib/roleUtils";

// Topic mapping for cleaner API
const CANDIDATE_TOPICS = {
  "cv-optimization": generateCVContent,
  "cover-letters": generateCoverLetterContent,
  "interview-prep": generateInterviewContent,
} as const;

const RECRUITER_TOPICS = {
  sourcing: generateSourcingContent,
  screening: generateScreeningContent,
  "market-insights": generateMarketInsightsContent,
} as const;

export function getTopicContent(
  topicId: string,
  field: string,
  specialization: string,
  careerStage: string,
  userType: "CANDIDATE" | "RECRUITER",
  preferences?: GuidancePreferences,
): TopicContent | null {
  try {
    if (isCandidate({ userType })) {
      const generator =
        CANDIDATE_TOPICS[topicId as keyof typeof CANDIDATE_TOPICS];
      return generator
        ? generator(field, specialization, careerStage, preferences)
        : null;
    } else {
      const generator =
        RECRUITER_TOPICS[topicId as keyof typeof RECRUITER_TOPICS];
      return generator ? generator(field, specialization, preferences) : null;
    }
  } catch (error) {
    console.error(`Error generating topic content for ${topicId}:`, error);
    return null;
  }
}

// Helper function to get all available topics for a user type
export function getAvailableTopics(
  userType: "CANDIDATE" | "RECRUITER",
): string[] {
  return isCandidate({ userType })
    ? Object.keys(CANDIDATE_TOPICS)
    : Object.keys(RECRUITER_TOPICS);
}

// Helper function to estimate total completion time for multiple topics
export function estimateTotalTime(topics: TopicContent[]): number {
  return topics.reduce((total, topic) => total + topic.totalEstimatedTime, 0);
}

// Re-export types for convenience
export type {
  GuidancePreferences,
  TopicContent,
  ContentSection,
} from "@/lib/guidance/content/types";
