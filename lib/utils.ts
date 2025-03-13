import { redirect } from "next/navigation";

import { type ClassValue, clsx } from "clsx";
import htmlToPdfmake from "html-to-pdfmake";
import MarkdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { twMerge } from "tailwind-merge";

import { getQueryClient } from "@/lib/getQueryClient";
import getSession from "@/lib/getSession";

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Requires authentication for a route, redirecting to login if no session exists
 * @param redirectUrl - URL to redirect to after login (defaults to '/')
 */
export async function requireAuth(redirectUrl: string = "/") {
  const session = await getSession();

  if (!session) {
    redirect(`/login?redirectUrl=${redirectUrl}`);
  }

  return session;
}

/**
 * Refreshes the specified query by invalidating it in the query client.
 * @param queryKey - The key of the query to refresh, can be a string or an array of strings.
 */
export const refreshQuery = (queryKey: string | string[]) => {
  const queryClient = getQueryClient();

  queryClient.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
  });
};

/**
 * Extracts text content from a PDF file
 * @param pdfFile - The PDF file to extract text from
 * @param setIsExtracting - Function to update the extraction status
 * @param setExtractedText - Function to set the extracted text
 * @param setError - Function to set any error messages
 */
export const extractTextFromPdf = async (
  pdfFile: File,
  setIsExtracting: (value: boolean) => void,
  setExtractedText: (text: string) => void,
  setError: (error: string | null) => void,
) => {
  setIsExtracting(true);
  try {
    const text = await pdfToText(pdfFile);
    setExtractedText(text);
    toast.success("Text extracted successfully");
  } catch (err) {
    console.error("Error extracting text from PDF:", err);
    const errorMessage = "Failed to extract text from PDF";
    toast.error(errorMessage);
    setError(errorMessage);
  } finally {
    setIsExtracting(false);
  }
};

/**
 * Converts Markdown content to a PDF file and triggers a download
 * @param content - The markdown content to be converted to PDF
 * @param fileName - The name of the file (without extension) to be downloaded
 * @returns Promise<void>
 */
export const MdToPdf = async (
  content: string,
  fileName: string,
): Promise<void> => {
  pdfMake.vfs = pdfFonts.vfs;

  const markdownParser = new MarkdownIt();
  const htmlContent = markdownParser.render(content);
  const pdfContent = htmlToPdfmake(htmlContent);
  const docDefinition = { content: pdfContent };
  pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
};

/**
 * Logs token usage information for AI operations with an optional prefix
 * @param usage - Token usage information containing prompt, completion, and total tokens
 * @param prefix - Optional prefix to identify different types of AI operations
 */
export const logTokenUsage = (usage: TokenUsage, prefix: string = ""): void => {
  const title = prefix ? `${prefix} Token Usage:` : "Token Usage:";
  console.log(title);
  console.table({
    "Input Tokens": usage.promptTokens,
    "Output Tokens": usage.completionTokens,
    "Total Tokens": usage.totalTokens,
  });
};
