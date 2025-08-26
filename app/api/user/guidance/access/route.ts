import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the user's lastGuidanceAccess timestamp
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        lastGuidanceAccess: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      lastGuidanceAccess: updatedUser.lastGuidanceAccess,
    });
  } catch (error) {
    console.error("Error updating guidance access:", error);
    return NextResponse.json(
      { error: "Failed to update guidance access" },
      { status: 500 },
    );
  }
}
