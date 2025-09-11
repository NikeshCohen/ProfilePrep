"use client";

import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import Footer from "@/components/global/Footer";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingPageContent from "@/components/landing/LandingPageContent";

export default function LandingPageWithToggle() {
  const { data: session } = useSession();
  const [isRecruiterView, setIsRecruiterView] = useState(false);
  const [hasSetUserBasedView, setHasSetUserBasedView] = useState(false);

  // set view based on user type when session changes (only once)
  useEffect(() => {
    if (session?.user && !hasSetUserBasedView) {
      const userBasedView = session.user.userType === "RECRUITER";
      setIsRecruiterView(userBasedView);
      setHasSetUserBasedView(true);
    } else if (!session?.user) {
      // reset when user logs out
      setHasSetUserBasedView(false);
    }
  }, [session, hasSetUserBasedView]);

  const handleViewToggle = (value: boolean) => {
    console.log("View toggle called:", value);
    setIsRecruiterView(value);
  };

  return (
    <>
      <LandingHeader
        isRecruiterView={isRecruiterView}
        onViewToggle={handleViewToggle}
      />
      <LandingPageContent
        isRecruiterView={isRecruiterView}
        onViewToggle={handleViewToggle}
      />
      <Footer />
    </>
  );
}
