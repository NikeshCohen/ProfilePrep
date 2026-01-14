import React from "react";
import { Metadata } from "next";
import LandingPageWithToggle from "@/components/landing/LandingPageWithToggle";

export const metadata: Metadata = {
  title: "ProfilePrep - AI-Powered CV Optimization & Recruitment Solutions",
  description: "Transform your CV with AI-powered optimization for candidates or streamline recruitment with instant CV formatting for agencies. Get past ATS filters and land more interviews.",
  keywords: "CV optimization, ATS optimization, recruitment software, CV formatting, AI resume builder, job search, recruitment agency tools",
  openGraph: {
    title: "ProfilePrep - AI-Powered CV Optimization & Recruitment Solutions",
    description: "Transform your CV with AI-powered optimization or streamline recruitment with instant CV formatting.",
    type: "website",
    url: "https://profileprep.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProfilePrep - CV Optimization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProfilePrep - AI-Powered CV Optimization",
    description: "Transform your CV with AI-powered optimization or streamline recruitment with instant CV formatting.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function LandingPage() {
  return <LandingPageWithToggle />;
}