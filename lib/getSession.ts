import { cache } from "react";

import { auth } from "@/auth";

// Cache storage
const sessionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Store logout state
let isLoggedOut = false;
let logoutTimestamp = 0;
const LOGOUT_COOLDOWN = 3000; // 3 seconds cooldown

// Add a version key to invalidate cache after login attempts
let cacheVersion = 1;

const getSession = async (forceCheck = false) => {
  const now = Date.now();

  // Reset logout state after cooldown or when forced
  if (isLoggedOut && (forceCheck || now - logoutTimestamp > LOGOUT_COOLDOWN)) {
    console.log("Allowing new auth check after logout cooldown or force check");
    isLoggedOut = false;
    // Increment cache version to invalidate existing cache
    cacheVersion++;
    // Clear any existing session data
    sessionCache.clear();
  }

  if (isLoggedOut) {
    console.log("User is logged out, skipping session fetch.");
    return null;
  }

  const cacheKey = `session-v${cacheVersion}`;
  const cachedData = sessionCache.get(cacheKey);

  // Check if we have valid cached data
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    if (cachedData.data?.user?.email) {
      console.log("📦 Using cached session for:", cachedData.data.user.email);
    } else {
      console.log("📦 Using cached session (no user)");
    }
    return cachedData.data;
  }

  // If no cache or expired, fetch new session
  console.log("🔐 Fetching session from database...");
  try {
    const session = await auth();

    if (session?.user?.email) {
      console.log("✅ Session found:", session.user.email);
      // Validate session before caching (ensure it has expected structure)
      if (session && typeof session === "object") {
        // Update cache with verified session
        sessionCache.set(cacheKey, {
          data: session,
          timestamp: now,
        });
      }
    } else {
      console.log("❌ No session found or invalid session");
      // Cache the null result but with a shorter duration
      sessionCache.set(cacheKey, {
        data: null,
        timestamp: now,
      });
    }

    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

const clearSessionCache = () => {
  console.log("🧹 Clearing session cache");
  isLoggedOut = true;
  logoutTimestamp = Date.now();
  cacheVersion++; // Increment version to invalidate cache
  sessionCache.clear();
};

// Function to explicitly force a session check (for login pages)
const forceSessionCheck = async () => {
  console.log("🔄 Forcing session check");
  // Increment cache version to ensure fresh data
  cacheVersion++;
  sessionCache.clear();
  return getSession(true);
};

export { clearSessionCache, forceSessionCheck };
export default cache(getSession);
