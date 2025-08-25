import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userType,
      field,
      specializations,
      careerStage,
      newsletterSubscribed,
      onboardingCompleted,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        userType,
        field,
        specializations,
        careerStage,
        newsletterSubscribed,
        onboardingCompleted,
        guidancePreferences: {
          field,
          specializations,
          careerStage,
          lastUpdated: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        userType: updatedUser.userType,
        field: updatedUser.field,
        onboardingCompleted: updatedUser.onboardingCompleted,
      }
    });
  } catch (error) {
    console.error("Error updating user onboarding:", error);
    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}