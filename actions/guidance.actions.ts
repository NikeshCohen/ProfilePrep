"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { UserType } from "@prisma/client";

import { GuidancePreferences } from "@/lib/guidance/content/types";

// ==================== QUERY FUNCTIONS (READ) ====================

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

// Get personalised recommendations based on user data and progress
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

    // Prioritise topics in progress
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

// ==================== MUTATION FUNCTIONS (WRITE) ====================

export interface GuidanceProgressData {
  topicId: string;
  progress: number;
  completed: boolean;
  sectionsCompleted: string[];
  timeSpent: number;
  bookmarked?: boolean;
}

export interface GuidanceAnalyticsData {
  totalTopicsStarted: number;
  totalTopicsCompleted: number;
  totalTimeSpent: number;
  averageProgress: number;
  streakDays: number;
  lastActiveDate: Date;
  preferredTopics: string[];
}

// Update or create guidance progress for a specific topic
export async function updateGuidanceProgress(data: GuidanceProgressData) {
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

    // Update or create progress record
    const progressRecord = await prisma.guidanceProgress.upsert({
      where: {
        userId_topicId_userType: {
          userId: user.id,
          topicId: data.topicId,
          userType: user.userType,
        },
      },
      update: {
        progress: data.progress,
        completed: data.completed,
        sectionsCompleted: data.sectionsCompleted,
        timeSpent: data.timeSpent,
        bookmarked: data.bookmarked ?? false,
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        topicId: data.topicId,
        userType: user.userType,
        progress: data.progress,
        completed: data.completed,
        sectionsCompleted: data.sectionsCompleted,
        timeSpent: data.timeSpent,
        bookmarked: data.bookmarked ?? false,
        lastAccessed: new Date(),
      },
    });

    // Update analytics
    await updateGuidanceAnalytics(user.id);

    // Update user's last guidance access
    await prisma.user.update({
      where: { id: user.id },
      data: { lastGuidanceAccess: new Date() },
    });

    revalidatePath("/portal/guidance");
    revalidatePath("/recruiter/guidance");

    return { success: true, data: progressRecord };
  } catch (error) {
    console.error("Error updating guidance progress:", error);
    return { success: false, error: "Failed to update guidance progress" };
  }
}

// Toggle bookmark status for a topic
export async function toggleGuidanceBookmark(
  topicId: string,
  bookmarked: boolean,
) {
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

    const progressRecord = await prisma.guidanceProgress.upsert({
      where: {
        userId_topicId_userType: {
          userId: user.id,
          topicId,
          userType: user.userType,
        },
      },
      update: {
        bookmarked,
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        topicId,
        userType: user.userType,
        progress: 0,
        completed: false,
        sectionsCompleted: [],
        timeSpent: 0,
        bookmarked,
        lastAccessed: new Date(),
      },
    });

    revalidatePath("/portal/guidance");
    revalidatePath("/recruiter/guidance");

    return { success: true, data: progressRecord };
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
}

// Internal function to update guidance analytics
async function updateGuidanceAnalytics(userId: string) {
  try {
    // Get all progress records for the user
    const progressRecords = await prisma.guidanceProgress.findMany({
      where: { userId },
    });

    const totalTopicsStarted = progressRecords.filter(
      (p) => p.progress > 0,
    ).length;
    const totalTopicsCompleted = progressRecords.filter(
      (p) => p.completed,
    ).length;
    const totalTimeSpent = progressRecords.reduce(
      (sum, p) => sum + p.timeSpent,
      0,
    );
    const averageProgress =
      progressRecords.length > 0
        ? progressRecords.reduce((sum, p) => sum + p.progress, 0) /
          progressRecords.length
        : 0;

    // Calculate streak days (simplified - count consecutive days with activity)
    const sortedRecords = progressRecords.sort(
      (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime(),
    );

    let streakDays = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const record of sortedRecords) {
      const recordDate = new Date(record.lastAccessed);
      recordDate.setHours(0, 0, 0, 0);

      const daysDiff =
        Math.abs(currentDate.getTime() - recordDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysDiff <= 1) {
        streakDays++;
        currentDate = recordDate;
      } else {
        break;
      }
    }

    // Calculate preferred topics based on engagement (time spent + completion rate)
    const topicEngagement = progressRecords.map((p) => ({
      topicId: p.topicId,
      engagement: p.timeSpent * (p.completed ? 2 : 1) + p.progress,
    }));

    const preferredTopics = topicEngagement
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
      .map((t) => t.topicId);

    // Update or create analytics record
    await prisma.guidanceAnalytics.upsert({
      where: { userId },
      update: {
        totalTopicsStarted,
        totalTopicsCompleted,
        totalTimeSpent,
        averageProgress,
        streakDays,
        lastActiveDate: new Date(),
        preferredTopics,
      },
      create: {
        userId,
        totalTopicsStarted,
        totalTopicsCompleted,
        totalTimeSpent,
        averageProgress,
        streakDays,
        lastActiveDate: new Date(),
        preferredTopics,
      },
    });
  } catch (error) {
    console.error("Error updating guidance analytics:", error);
  }
}

// Clear all progress (for testing/reset purposes)
export async function clearGuidanceProgress() {
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

    await prisma.guidanceProgress.deleteMany({
      where: { userId: user.id },
    });

    await prisma.guidanceAnalytics
      .delete({
        where: { userId: user.id },
      })
      .catch(() => {
        // Ignore if analytics record doesn't exist
      });

    revalidatePath("/portal/guidance");
    revalidatePath("/recruiter/guidance");

    return { success: true };
  } catch (error) {
    console.error("Error clearing guidance progress:", error);
    return { success: false, error: "Failed to clear guidance progress" };
  }
}
