"use server";

import {
  createGeneratedDoc,
  incrementUserGenerations,
} from "@/actions/user.actions";
import {
  baseTemplate,
  prompt as mainPrompt,
  templateCreationPrompt,
} from "@/constants/prompt";
import type { CandidateData } from "@/types";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { User } from "next-auth";

import { logTokenUsage } from "@/lib/utils";

const selectedModel = google("gemini-2.0-flash-001");

export const generateDocument = async (
  cvContent: string,
  candidateInfo: CandidateData,
  user: User,
) => {
  let templateStructure;

  if (candidateInfo.templateId === "pp") {
    templateStructure = baseTemplate;
  } else {
    templateStructure = candidateInfo.templateContent;
  }

  const prompt = `${mainPrompt}

        TEMPLATE STRUCTURE:
        ${templateStructure}

        CANDIDATE INFORMATION:
        - Document Title: ${candidateInfo.documentTitle}
        - Name: ${candidateInfo.name}
        - Location: ${candidateInfo.location}
        - Right to Work: ${candidateInfo.rightToWork}
        - Salary Expectation: ${candidateInfo.salaryExpectation}

        ADDITIONAL CONTEXT:
        ${candidateInfo.notes}

        SOURCE CV CONTENT:
        ${cvContent}

        INSTRUCTIONS:
        1. Use the provided template structure as a base
        2. Incorporate the candidate information in appropriate sections
        3. Restructure the source CV content to match the template
        4. Ensure all formatting is in clean Markdown
        5. Maintain professional language and tone throughout
        6. Remove any redundant or irrelevant information

        Please generate a well-structured, professional CV in Markdown format.`
    .trim()
    .replace(/\n\s+/g, "\n");

  if (user.allowedDocs === user.createdDocs) return;

  const response = await generateText({
    model: selectedModel,
    prompt,
    temperature: 0.2,
  });

  let cleanedText = response.text;

  if (cleanedText.includes("```") || cleanedText.startsWith("markdown")) {
    cleanedText = cleanedText.replace(/```/g, "").replace(/^markdown/g, "");
  }

  logTokenUsage(response.usage, "Document Generation");

  incrementUserGenerations(user.id!);
  await createGeneratedDoc({
    documentContent: candidateInfo,
    rawContent: cleanedText,
    userId: user.id!,
    companyId: user.company?.id || " ",
  });

  return cleanedText;
};

export const generateTemplate = async (textContent: string) => {
  const prompt = `${templateCreationPrompt}

        SOURCE DOCUMENT CONTENT:
        ${textContent}

        Please analyze this document and create a generalized template following the instructions above.`
    .trim()
    .replace(/\n\s+/g, "\n");

  const response = await generateText({
    model: selectedModel,
    prompt,
    temperature: 0.2,
  });

  let cleanedText = response.text;

  // Remove markdown code blocks and language specifiers if present
  if (cleanedText.includes("```") || cleanedText.startsWith("markdown")) {
    cleanedText = cleanedText.replace(/```markdown\n?|```\n?|markdown\n?/g, "");
  }

  logTokenUsage(response.usage, "Template Generation");

  return cleanedText;
};

export async function generateTailoredCV(
  candidateData: CandidateData,
): Promise<string> {
  try {
    const masterCV = candidateData.notes;
    const jobDescription = candidateData.jobDescription;

    // Ensure required data is present
    if (!masterCV || !jobDescription) {
      throw new Error("Both master CV and job description are required");
    }

    // Create prompt for tailored CV generation
    const prompt = `
You are an AI that creates tailored CVs based on a master CV and job description.

### MASTER CV:
${masterCV}

### JOB DESCRIPTION:
${jobDescription}

### INSTRUCTIONS:
1. Analyze the job description to identify key requirements, skills, and qualifications.
2. Extract relevant experience, skills, and achievements from the master CV that align with the job description.
3. Create a tailored CV that highlights the candidate's most relevant qualifications for this specific role.
4. Format the CV in a clean, professional Markdown format.
5. Prioritize the most relevant information based on the job requirements.
6. IMPORTANT: Do NOT invent or add any information that is not present in the master CV.
7. Optimize the content for ATS (Applicant Tracking Systems) by incorporating relevant keywords from the job description.
8. Keep the CV concise and focused, ideally 1-2 pages in length.
9. Use bullet points for clarity and readability.
10. Ensure the tailored CV contains ONLY factual information from the master CV.

Please provide the tailored CV in clean Markdown format.
`;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: unknown) {
    console.error("Error generating tailored CV:", error);
    throw new Error(
      `Failed to generate tailored CV: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
