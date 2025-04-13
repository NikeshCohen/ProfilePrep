// NEEDS TO BE IMPORTED FIRST, it will auto move to top on save based on .prettierrc
import { ReactScan } from "@/components/global/ReactScan";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/app/_styles/globals.css";
import { QueryProviders } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";

import Background from "@/components/global/Background";
import Toaster from "@/components/global/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ProfilePrep - Streamlined CV Formatting for Recruiters",
    absolute: "ProfilePrep - Streamlined CV Formatting for Recruiters",
  },
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://profileprep.xyz",
    siteName: "ProfilePrep",
    title: "ProfilePrep - Streamlined CV Formatting for Recruiters",
    description:
      "ProfilePrep helps recruiters refine and format candidate CVs before sending them to clients. Streamline the process, tailor resumes for specific roles, and present candidates professionally.",
    images: [
      {
        url: "/og_image.png",
        alt: "ProfilePrep - Streamlined CV Formatting for Recruiters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startacus – The Ultimate Full-Stack Starter Kit",
    description:
      "ProfilePrep helps recruiters refine and format candidate CVs before sending them to clients. Streamline the process, tailor resumes for specific roles, and present candidates professionally.",
    creator: "@nikeshcohen",
    images: ["/og_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ReactScan />
      <body
        className={`${geistSans.variable} ${geistMono.variable} theme-transition antialiased`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Background />
            <Toaster />
            <Analytics />
            <QueryProviders>{children}</QueryProviders>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
