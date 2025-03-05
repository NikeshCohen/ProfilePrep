"use server";

import { prompt as mainPrompt } from "@/constants/prompt";
import type { CandidateData } from "@/types";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { User } from "next-auth";

import { createGeneratedDoc, incrementUserGenerations } from "./user.actions";

const selectedModel = google("gemini-2.0-flash-001");

export const generate = async (
  cvContent: string,
  candidateInfo: CandidateData,
  user: User,
) => {
  const prompt = `${mainPrompt}, Candidate CV DATA: ${cvContent} Document Title: ${candidateInfo.documentTitle}, Candidate Name: ${candidateInfo.name}, Candidate Location: ${candidateInfo.location}, Candidate Right to work: ${candidateInfo.rightToWork}, Salary Expectation: ${candidateInfo.salaryExpectation}, Additional Notes to use: ${candidateInfo.notes} `;

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

  // Log token usage
  console.log("Token Usage:");
  console.log("Input Tokens:", response.usage.promptTokens);
  console.log("Output Tokens:", response.usage.completionTokens);
  console.log("Total Tokens:", response.usage.totalTokens);

  console.log(cleanedText);

  incrementUserGenerations(user.id!);
  createGeneratedDoc({
    documentContent: candidateInfo,
    rawContent: cleanedText,
    userId: user.id!,
    companyId: user.company?.id || " ",
  });

  return cleanedText;
};
