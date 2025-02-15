import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

import Background from "@/components/global/Background";
import Footer from "@/components/global/Footer";
import Toaster from "@/components/global/Toaster";

import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProfilePrep - Streamlined CV Formatting for Recruiters",
  description:
    "ProfilePrep helps recruiters refine and format candidate CVs before sending them to clients. Streamline the process, tailor resumes for specific roles, and present candidates professionally.",
  keywords: [
    "CV Formatting",
    "Resume Builder",
    "Recruiter Tool",
    "Candidate Profiles",
    "Profile Prep",
    "Job Applications",
    "Talent Acquisition",
  ],
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} theme-transition antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Background />
          <Toaster />
          <Analytics />
          {children}

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
