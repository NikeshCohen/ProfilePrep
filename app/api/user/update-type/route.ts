import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userType } = await request.json();

    if (!userType || !["RECRUITER", "CANDIDATE", "TESTER"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Update user type in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { userType },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user type error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
