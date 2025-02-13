"use server";

import { prompt as mainPrompt } from "@/constants";
import { CandidateData } from "@/types";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const selectedModel = google("gemini-2.0-flash-001");

export const generate = async (
  cvContent: string,
  candidateInfo: CandidateData,
) => {
  const prompt = `${mainPrompt}, Candidate CV DATA: ${cvContent} Document Title: ${candidateInfo.documentTitle}, Candidate Name: ${candidateInfo.name}, Candidate Location: ${candidateInfo.location}, Candidate Right to work: ${candidateInfo.rightToWork}, Salary Expectation: ${candidateInfo.salaryExpectation}, Additional Notes to use: ${candidateInfo.notes} `;

  const response = await generateText({
    model: selectedModel,
    prompt,
    temperature: 0.2,
  });

  let cleanedText = response.text;

  if (cleanedText.includes("```") || cleanedText.startsWith("markdown")) {
    cleanedText = cleanedText.replace(/```/g, "").replace(/^markdown/g, "");
  }

  console.log(cleanedText);

  return cleanedText;
};
