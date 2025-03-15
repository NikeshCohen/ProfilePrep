import { NextResponse } from "next/server";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

export async function GET() {
  try {
    const { user } = await requireAuth();

    // Fetch candidate profile
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id! },
    });

    return NextResponse.json({ profile });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch candidate profile",
      },
      { status: 500 },
    );
  }
}
