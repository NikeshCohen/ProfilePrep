import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const preferences = await request.json();

    // Validate the preferences structure
    const validPreferences = {
      experienceLevel: preferences.experienceLevel || null,
      learningStyle: preferences.learningStyle || null,
      pacePreference: preferences.pacePreference || null,
      timeCommitment: preferences.timeCommitment || null,
      priorityTopics: Array.isArray(preferences.priorityTopics)
        ? preferences.priorityTopics
        : [],
      currentChallenges: Array.isArray(preferences.currentChallenges)
        ? preferences.currentChallenges
        : [],
      primaryGoals: Array.isArray(preferences.primaryGoals)
        ? preferences.primaryGoals
        : [],
      preferredContentType: Array.isArray(preferences.preferredContentType)
        ? preferences.preferredContentType
        : [],
    };

    // Update user's guidance preferences
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        guidancePreferences: validPreferences,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Guidance preferences updated successfully",
      preferences: validPreferences,
    });
  } catch (error) {
    console.error("Error updating guidance preferences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        guidancePreferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: user?.guidancePreferences || {},
    });
  } catch (error) {
    console.error("Error fetching guidance preferences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch preferences" },
      { status: 500 },
    );
  }
}
