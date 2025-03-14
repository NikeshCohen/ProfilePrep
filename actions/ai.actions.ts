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
