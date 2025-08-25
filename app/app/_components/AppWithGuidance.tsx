"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { GuidancePanel } from "@/components/global/GuidancePanel";

interface User {
  userType: string;
  field?: string;
  specializations?: string[];
  careerStage?: string;
  onboardingCompleted?: boolean;
}

export function AppWithGuidance({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUser();
  }, [session]);

  return (
    <>
      {children}
      {user && user.onboardingCompleted && user.field && (
        <GuidancePanel user={user} />
      )}
    </>
  );
}
