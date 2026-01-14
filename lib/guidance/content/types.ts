// Enhanced guidance preferences from onboarding
export interface GuidancePreferences {
  experienceLevel?: "entry" | "mid" | "senior" | "executive" | "changing";
  primaryGoals?: string[];
  currentChallenges?: string[];
  jobSearchStatus?: "active" | "passive" | "not_looking" | "starting_soon";
  learningStyle?: "visual" | "reading" | "interactive" | "video" | "mixed";
  timeCommitment?: number;
  pacePreference?: "self_paced" | "structured" | "accelerated";
  priorityTopics?: string[];
  urgentNeeds?: string[];
  reminders?: boolean;
  progressSharing?: boolean;
  mentorshipInterest?: boolean;
  specificChallenges?: string;
  lastUpdated?: string;
}

// Type definitions for guidance content structure
export interface GuidanceContent {
  field: string;
  specialization: string;
  careerStage: string;
  content: {
    cvOptimisation: {
      philosophy: string;
      strategies: string[];
      examples: string[];
      keywords: string[];
      atsOptimization: string[];
    };
    coverLetters: {
      philosophy: string;
      structure: string[];
      personalization: string[];
      examples: string[];
    };
    interviewPrep: {
      philosophy: string;
      preparation: string[];
      techniques: string[];
      questions: string[];
      tips: string[];
    };
    careerGrowth: {
      philosophy: string;
      shortTermGoals: string[];
      longTermGoals: string[];
      skills: string[];
      networking: string[];
    };
    salaryNegotiation: {
      philosophy: string;
      research: string[];
      strategies: string[];
      timing: string[];
    };
    // Recruiter-specific content
    sourcing?: {
      philosophy: string;
      platforms: string[];
      strategies: string[];
      outreach: string[];
    };
    screening?: {
      philosophy: string;
      criteria: string[];
      redFlags: string[];
      questions: string[];
    };
    marketInsights?: {
      philosophy: string;
      trends: string[];
      salaryData: string[];
      skills: string[];
    };
  };
}

export interface ContentSection {
  title: string;
  content: string[];
  estimatedTimeMinutes: number;
}

export interface TopicContent {
  id: string;
  title: string;
  description: string;
  philosophy: string;
  sections: ContentSection[];
  totalEstimatedTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites?: string[];
}
