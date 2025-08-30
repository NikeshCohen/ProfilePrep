"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { isCandidate, isRecruiter, isTester } from "@/lib/roleUtils";

export function AuthRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const { userType } = session.user;
      const currentPath = window.location.pathname;

      // Don't redirect if we're already in the correct section
      if (isCandidate({ userType }) && currentPath.startsWith("/portal")) {
        return;
      }
      if (isRecruiter({ userType }) && currentPath.startsWith("/recruiter")) {
        return;
      }
      if (isTester({ userType })) {
        // Testers can access both, so don't auto-redirect
        return;
      }

      // Only redirect from root paths
      if (
        currentPath === "/" ||
        currentPath === "/app" ||
        currentPath === "/dashboard" ||
        currentPath === "/portal"
      ) {
        if (isCandidate({ userType })) {
          router.replace("/portal");
        } else if (isRecruiter({ userType })) {
          router.replace("/recruiter");
        }
      }
    }
  }, [session, router]);

  return null;
}
