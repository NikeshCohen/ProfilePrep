import { cache } from "react";

import { auth } from "@/auth";
import { Session } from "next-auth";

// Cache storage
const sessionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const getSession = async (): Promise<Session | null> => {
  const now = Date.now();
  const session = await auth();

  // Get user-specific cache key
  const cacheKey = session?.user?.id || "anonymous";
  const cachedData = sessionCache.get(cacheKey);

  // Check if we have valid cached data for this specific user
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log("📦 Using cached session for:", cachedData.data?.user?.email);
    // console.log(`Cached Data: ${JSON.stringify(cachedData.data.user)}`);
    return cachedData.data;
  }

  // If no cache or expired, fetch new session
  console.log("🔐 Fetching session from database...");

  if (session) {
    console.log("✅ Session found:", session.user?.email);
    // Update cache with user-specific key
    sessionCache.set(cacheKey, {
      data: session,
      timestamp: now,
    });
  } else {
    console.log("❌ No session found");
  }

  // console.log(`Session Data: ${JSON.stringify(session?.user)}`);
  return session;
};

export default cache(getSession);
