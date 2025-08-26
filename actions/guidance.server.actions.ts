"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { UserType } from "@prisma/client";

import { GuidancePreferences } from "@/lib/guidance/content/types";

// Get user's guidance progress for all topics
export async function getUserGuidanceProgress(userType?: UserType) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const progress = await prisma.guidanceProgress.findMany({
      where: {
        userId: user.id,
        userType: userType || user.userType,
      },
      orderBy: { lastAccessed: "desc" },
    });

    return { success: true, data: progress };
  } catch (error) {
    console.error("Error fetching guidance progress:", error);
    return { success: false, error: "Failed to fetch guidance progress" };
  }
}

// Get guidance analytics for a user
export async function getGuidanceAnalytics() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const analytics = await prisma.guidanceAnalytics.findUnique({
      where: { userId: user.id },
    });

    if (!analytics) {
      // Create initial analytics record
      const newAnalytics = await prisma.guidanceAnalytics.create({
        data: {
          userId: user.id,
          totalTopicsStarted: 0,
          totalTopicsCompleted: 0,
          totalTimeSpent: 0,
          averageProgress: 0,
          streakDays: 0,
          lastActiveDate: new Date(),
          preferredTopics: [],
        },
      });
      return { success: true, data: newAnalytics };
    }

    return { success: true, data: analytics };
  } catch (error) {
    console.error("Error fetching guidance analytics:", error);
    return { success: false, error: "Failed to fetch guidance analytics" };
  }
}

// Get user's guidance preferences for personalization
export async function getUserGuidancePreferences() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        guidancePreferences: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: user.guidancePreferences as GuidancePreferences | null,
    };
  } catch (error) {
    console.error("Error fetching guidance preferences:", error);
    return { success: false, error: "Failed to fetch guidance preferences" };
  }
}

// Get personalized recommendations based on user data and progress
export async function getPersonalizedRecommendations() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        userType: true,
        field: true,
        specializations: true,
        careerStage: true,
        guidancePreferences: true,
        GuidanceProgress: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get completed topic IDs
    const completedTopics = user.GuidanceProgress.filter(
      (p) => p.completed,
    ).map((p) => p.topicId);

    // Get topics in progress
    const inProgressTopics = user.GuidanceProgress.filter(
      (p) => !p.completed && p.progress > 0,
    ).map((p) => p.topicId);

    // Define topic dependencies/prerequisites
    const topicPrerequisites: { [key: string]: string[] } = {
      linkedin: ["cv-optimization"],
      networking: ["linkedin"],
      "career-growth": ["networking", "linkedin"],
      "salary-negotiation": ["interview-prep"],
      interviewing: ["sourcing"],
      retention: ["candidate-experience"],
    };

    // Generate recommendations based on user profile, progress, and preferences
    const preferences = user.guidancePreferences as GuidancePreferences | null;
    let recommendations: string[] = [];

    // Start with preference-based recommendations if available
    if (preferences?.priorityTopics?.length) {
      recommendations = [...preferences.priorityTopics];
    } else if (preferences?.urgentNeeds?.length) {
      recommendations = [...preferences.urgentNeeds];
    }

    // Supplement with profile-based recommendations if needed
    if (recommendations.length < 3) {
      let profileRecommendations: string[] = [];

      if (user.userType === "CANDIDATE") {
        // Enhanced candidate recommendations based on preferences
        if (preferences?.jobSearchStatus === "active") {
          profileRecommendations = [
            "cv-optimization",
            "interview-prep",
            "cover-letters",
          ];
        } else if (preferences?.primaryGoals?.includes("career_change")) {
          profileRecommendations = [
            "cv-optimization",
            "networking",
            "skill-development",
          ];
        } else if (preferences?.primaryGoals?.includes("promotion")) {
          profileRecommendations = [
            "career-growth",
            "networking",
            "salary-negotiation",
          ];
        } else if (user.careerStage === "earlyCareer") {
          profileRecommendations = [
            "cv-optimization",
            "interview-prep",
            "linkedin",
          ];
        } else if (user.careerStage === "midCareer") {
          profileRecommendations = [
            "career-growth",
            "salary-negotiation",
            "networking",
          ];
        } else if (user.careerStage === "seniorCareer") {
          profileRecommendations = [
            "career-growth",
            "market-insights",
            "linkedin",
          ];
        } else if (user.careerStage === "careerChanger") {
          profileRecommendations = [
            "cv-optimization",
            "cover-letters",
            "networking",
          ];
        } else {
          profileRecommendations = [
            "cv-optimization",
            "interview-prep",
            "linkedin",
          ];
        }
      } else {
        // RECRUITER recommendations enhanced with preferences
        if (preferences?.primaryGoals?.includes("sourcing_improvement")) {
          profileRecommendations = ["sourcing", "screening", "interviewing"];
        } else if (
          preferences?.currentChallenges?.includes("candidate_assessment")
        ) {
          profileRecommendations = [
            "screening",
            "interviewing",
            "market-insights",
          ];
        } else if (user.field === "technology") {
          profileRecommendations = ["sourcing", "screening", "interviewing"];
        } else if (user.field === "healthcare") {
          profileRecommendations = [
            "compliance",
            "candidate-experience",
            "retention",
          ];
        } else if (user.field === "finance") {
          profileRecommendations = [
            "employer-branding",
            "market-insights",
            "interviewing",
          ];
        } else {
          profileRecommendations = [
            "sourcing",
            "job-descriptions",
            "diversity",
          ];
        }
      }

      // Add profile recommendations that aren't already included
      profileRecommendations.forEach((rec) => {
        if (!recommendations.includes(rec)) {
          recommendations.push(rec);
        }
      });
    }

    // Filter out completed topics and ensure prerequisites are met
    const eligibleRecommendations = recommendations.filter((topicId) => {
      if (completedTopics.includes(topicId)) return false;

      const prerequisites = topicPrerequisites[topicId] || [];
      const prerequisitesMet = prerequisites.every((prereq) =>
        completedTopics.includes(prereq),
      );

      return prerequisitesMet;
    });

    // Prioritize topics in progress
    const prioritizedRecommendations = [
      ...inProgressTopics.filter((id) => eligibleRecommendations.includes(id)),
      ...eligibleRecommendations.filter((id) => !inProgressTopics.includes(id)),
    ].slice(0, 3);

    return {
      success: true,
      data: {
        recommendations: prioritizedRecommendations,
        preferences: preferences,
        reasoningContext: {
          hasPreferences: !!preferences,
          jobSearchStatus: preferences?.jobSearchStatus,
          primaryGoals: preferences?.primaryGoals,
          urgentNeeds: preferences?.urgentNeeds,
        },
      },
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return { success: false, error: "Failed to generate recommendations" };
  }
}

// Get guidance progress for a specific topic
export async function getTopicProgress(topicId: string, userType?: UserType) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const progress = await prisma.guidanceProgress.findUnique({
      where: {
        userId_topicId_userType: {
          userId: user.id,
          topicId,
          userType: userType || user.userType,
        },
      },
    });

    return { success: true, data: progress };
  } catch (error) {
    console.error("Error fetching topic progress:", error);
    return { success: false, error: "Failed to fetch topic progress" };
  }
}

// Get user's bookmarked topics
export async function getBookmarkedTopics(userType?: UserType) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const bookmarkedProgress = await prisma.guidanceProgress.findMany({
      where: {
        userId: user.id,
        userType: userType || user.userType,
        bookmarked: true,
      },
      orderBy: { lastAccessed: "desc" },
    });

    return { success: true, data: bookmarkedProgress };
  } catch (error) {
    console.error("Error fetching bookmarked topics:", error);
    return { success: false, error: "Failed to fetch bookmarked topics" };
  }
}

// Get guidance statistics for admin dashboard
export async function getGuidanceStats() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin (you might want to add this check based on your auth system)
    const totalUsers = await prisma.user.count();
    const usersWithProgress = await prisma.user.count({
      where: {
        GuidanceProgress: {
          some: {},
        },
      },
    });

    const totalProgress = await prisma.guidanceProgress.count();
    const completedTopics = await prisma.guidanceProgress.count({
      where: { completed: true },
    });

    const averageTimeSpent = await prisma.guidanceProgress.aggregate({
      _avg: {
        timeSpent: true,
      },
    });

    const topTopics = await prisma.guidanceProgress.groupBy({
      by: ["topicId"],
      _count: {
        topicId: true,
      },
      orderBy: {
        _count: {
          topicId: "desc",
        },
      },
      take: 5,
    });

    return {
      success: true,
      data: {
        totalUsers,
        usersWithProgress,
        engagementRate:
          totalUsers > 0 ? (usersWithProgress / totalUsers) * 100 : 0,
        totalProgress,
        completedTopics,
        completionRate:
          totalProgress > 0 ? (completedTopics / totalProgress) * 100 : 0,
        averageTimeSpent: averageTimeSpent._avg.timeSpent || 0,
        topTopics: topTopics.map((topic) => ({
          topicId: topic.topicId,
          count: topic._count.topicId,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching guidance stats:", error);
    return { success: false, error: "Failed to fetch guidance stats" };
  }
}

// Get user profile data for content generation (server-side data only)
export async function getUserProfileForContent(userType?: UserType) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        userType: true,
        field: true,
        specializations: true,
        careerStage: true,
        guidancePreferences: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const effectiveUserType = userType || user.userType;
    const preferences = user.guidancePreferences as GuidancePreferences | null;

    return {
      success: true,
      data: {
        preferences,
        userProfile: {
          field: user.field || "general",
          specializations: user.specializations || [],
          careerStage: user.careerStage || "general",
          userType:
            effectiveUserType === "TESTER" ? "CANDIDATE" : effectiveUserType,
        },
      },
    };
  } catch (error) {
    console.error(`Error getting user profile for content generation:`, error);
    return { success: false, error: "Failed to get user profile for content" };
  }
}
