import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { isCandidate } from "@/lib/roleUtils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow test accounts to switch roles
    if (!session.user.isTestAccount) {
      return NextResponse.json(
        { error: "Role switching is only available for test accounts" },
        { status: 403 },
      );
    }

    const { userType } = await request.json();

    if (!userType || !["RECRUITER", "CANDIDATE"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Get the appropriate demo account based on requested user type
    const demoAccountEmails = {
      RECRUITER: "demo@profileprep.com",
      CANDIDATE: "candidate.demo@profileprep.com",
    };

    const targetEmail =
      demoAccountEmails[userType as keyof typeof demoAccountEmails];

    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        company: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target demo account not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      userType,
      targetEmail,
      redirectUrl: isCandidate({ userType }) ? "/portal" : "/recruiter",
      message: `Ready to switch to ${userType.toLowerCase()} mode`,
    });
  } catch (error) {
    console.error("Role switch API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
