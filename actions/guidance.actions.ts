"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { UserType } from "@prisma/client";

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
