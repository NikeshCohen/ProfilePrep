import { redirect } from "next/navigation";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { getQueryClient } from "./getQueryClient";
import getSession from "./getSession";

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
