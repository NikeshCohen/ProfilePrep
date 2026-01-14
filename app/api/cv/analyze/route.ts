import { NextRequest, NextResponse } from "next/server";

import { createCVAnalysis } from "@/actions/cv.actions";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fileName = formData.get("fileName") as string;
    const fileContent = formData.get("fileContent") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const companyName = (formData.get("companyName") as string) || "";
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!fileName || !fileContent || !jobTitle) {
      return NextResponse.json(
        {
          error: "Missing required fields: fileName, fileContent, and jobTitle",
        },
        { status: 400 },
      );
    }

    // Validate that we have actual content
    if (fileContent.trim().length < 100) {
      return NextResponse.json(
        { error: "CV content appears to be too short or empty" },
        { status: 400 },
      );
    }

    // Create CV analysis
    const result = await createCVAnalysis(
      fileName,
      fileContent,
      jobTitle,
      companyName,
      jobDescription,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to analyze CV" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: result.analysis?.id,
      feedback: result.feedback,
    });
  } catch (error) {
    console.error("CV analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
