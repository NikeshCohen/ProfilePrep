import { redirect } from "next/navigation";

import { type ClassValue, clsx } from "clsx";
import htmlToPdfmake from "html-to-pdfmake";
import MarkdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { twMerge } from "tailwind-merge";

import { getQueryClient } from "@/lib/getQueryClient";
import getSession from "@/lib/getSession";

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
