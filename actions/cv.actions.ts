"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { logTokenUsage } from "@/lib/utils";

const selectedModel = google("gemini-2.0-flash-001");

interface CVFeedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
  toneAndStyle: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  content: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  structure: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  skills: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  grammarAndFormatting: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  keywordDensity: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
}

const AIResponseFormat = `
interface Feedback {
  overallScore: number; // average of all sections, max 100

  ATS: {
    score: number; // rate based on ATS suitability - evaluate keyword match, relevance to job, and system readability
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Keyword-rich bullet points" - provide 3-4 tips
      explanation?: string; // explain in detail here, e.g. "Used role-specific terms like 'Node.js', 'REST API'"
    }[]; // exactly 3-4 tips required
  };

  toneAndStyle: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Professional tone maintained"
      explanation: string; // explain in detail here, e.g. "Consistent use of action verbs and confident language throughout the CV"
    }[]; // exactly 3-4 tips required
  };

  content: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Quantified impact statements"
      explanation: string; // explain in detail here, e.g. "Used measurable results like 'increased conversion rate by 23%' to demonstrate impact"
    }[]; // exactly 3-4 tips required
  };

  structure: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Clear section hierarchy"
      explanation: string; // explain in detail here, e.g. "Experience, Skills, and Education are organised in a logical and expected order"
    }[]; // exactly 3-4 tips required
  };

  skills: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Relevant tech stack highlighted"
      explanation: string; // explain in detail here, e.g. "Frontend skills like React and Tailwind match the job requirements"
    }[]; // exactly 3-4 tips required
  };

  grammarAndFormatting: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Consistent punctuation"
      explanation: string; // explain in detail here, e.g. "Used full stops consistently in all bullet points"
    }[]; // exactly 3-4 tips required
  };

  keywordDensity: {
    score: number; // max 100
    tips: {
      type: "good" | "improve";
      tip: string; // short "title" - e.g. "Role-specific keywords present"
      explanation: string; // explain in detail here, e.g. "Included frequent mentions of 'Agile', 'JavaScript', and 'API development'"
    }[]; // exactly 3-4 tips required
  };
}`;

const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) => `
You are an expert in CV analysis and ATS (Applicant Tracking System) evaluation.

Please analyse the candidate's CV and rate it across each category. Use the job title and job description (if available) to assess alignment.

Use the following guidance when assigning scores:

- 90-100: Excellent. Fully aligned with best practices. No major improvements needed.
- 70-89: Strong. Some minor issues but generally solid.
- 50-69: Average. Noticeable room for improvement.
- 30-49: Weak. Several important issues.
- 0-29: Poor. Major improvements required throughout.

Do not hesitate to give low scores if the CV has significant flaws. This feedback is meant to help the candidate improve.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Return your response using the following strict JSON format:
${AIResponseFormat}

For every category, provide 3-4 tips only.  
Each tip must be a short "title" summarising the point.  
Each tip must have an explanation where you explain in detail.

Do not include backticks or markdown syntax.  
Do not return any additional text, explanation, or commentary outside the JSON.
`;

export async function createCVAnalysis(
  fileName: string,
  fileContent: string,
  jobTitle: string,
  companyName: string = "",
  jobDescription: string = "",
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user session found");
  }

  const instructions = prepareInstructions({
    jobTitle,
    jobDescription,
  });

  const prompt = `${instructions}

CV CONTENT:
${fileContent}

Please analyze this CV and provide feedback in the specified JSON format.`;

  try {
    const response = await generateText({
      model: selectedModel,
      prompt,
      temperature: 0.2,
    });

    let cleanedText = response.text;

    // Remove any markdown code blocks if present
    if (cleanedText.includes("```")) {
      cleanedText = cleanedText.replace(/```json\n?|```\n?/g, "");
    }

    // Clean up common JSON issues - remove control characters
    cleanedText = cleanedText
      .trim()
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, " "); // Replace control characters with space

    let feedback: CVFeedback;
    try {
      feedback = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", cleanedText.substring(0, 500));
      throw new Error(
        "Failed to parse CV analysis response. Please try again.",
      );
    }

    logTokenUsage(response.usage, "CV Analysis");

    // Save to database
    const cvAnalysis = await prisma.cVAnalysis.create({
      data: {
        userId: session.user.id,
        fileName,
        fileContent,
        companyName,
        jobTitle,
        jobDescription,
        overallScore: feedback.overallScore,
        atsScore: feedback.ATS.score,
        atsFeedback: feedback.ATS,
        toneScore: feedback.toneAndStyle.score,
        toneFeedback: feedback.toneAndStyle,
        contentScore: feedback.content.score,
        contentFeedback: feedback.content,
        structureScore: feedback.structure.score,
        structureFeedback: feedback.structure,
        skillsScore: feedback.skills.score,
        skillsFeedback: feedback.skills,
        grammarScore: feedback.grammarAndFormatting.score,
        grammarFeedback: feedback.grammarAndFormatting,
        keywordScore: feedback.keywordDensity.score,
        keywordFeedback: feedback.keywordDensity,
      },
    });

    return {
      success: true,
      analysis: cvAnalysis,
      feedback,
    };
  } catch (error) {
    console.error("CV Analysis failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Analysis failed",
    };
  }
}

export async function getCVAnalysis(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user session found");
  }

  try {
    const analysis = await prisma.cVAnalysis.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!analysis) {
      return {
        success: false,
        error: "Analysis not found",
      };
    }

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Failed to fetch CV analysis:", error);
    return {
      success: false,
      error: "Failed to fetch analysis",
    };
  }
}

export async function getUserCVAnalyses() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user session found");
  }

  try {
    const analyses = await prisma.cVAnalysis.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        jobTitle: true,
        companyName: true,
        overallScore: true,
        atsScore: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      analyses,
    };
  } catch (error) {
    console.error("Failed to fetch user CV analyses:", error);
    return {
      success: false,
      error: "Failed to fetch analyses",
    };
  }
}
