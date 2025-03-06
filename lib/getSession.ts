import { cache } from "react";

import { auth } from "@/auth";

// Cache storage
const sessionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const getSession = async () => {
  const now = Date.now();
  const cachedData = sessionCache.get("session");

  // Check if we have valid cached data
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log("📦 Using cached session for:", cachedData.data?.user?.email);
    return cachedData.data;
  }

  // If no cache or expired, fetch new session
  console.log("🔐 Fetching session from database...");
  const session = await auth();

  if (session) {
    console.log("✅ Session found:", session.user?.email);
    // Update cache
    sessionCache.set("session", {
      data: session,
      timestamp: now,
    });
  } else {
    console.log("❌ No session found");
  }

  return session;
};

export default cache(getSession);
