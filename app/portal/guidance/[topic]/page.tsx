import { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuidanceTopicPage } from "@/app/portal/guidance/[topic]/_components/GuidanceTopicPage";

const validTopics = [
  "cv-optimization",
  "cover-letters",
  "linkedin",
  "networking",
  "interview-prep",
  "career-growth",
  "salary-negotiation",
  "market-insights",
];

interface PageProps {
  params: Promise<{
    topic: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;

  const topicLabels: { [key: string]: string } = {
    "cv-optimization": "CV/Resume Optimization",
    "cover-letters": "Cover Letters",
    linkedin: "LinkedIn & Professional Presence",
    networking: "Networking & Outreach",
    "interview-prep": "Interview Preparation",
    "career-growth": "Career Growth & Branding",
    "salary-negotiation": "Salary Negotiation",
    "market-insights": "Market Insights",
  };

  const label = topicLabels[topic] || "Guidance";

  return {
    title: `${label} | Career Guidance | ProfilePrep`,
    description: `Personalized ${label.toLowerCase()} guidance tailored to your career`,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { topic } = await params;

  if (!validTopics.includes(topic)) {
    notFound();
  }

  return <GuidanceTopicPage topic={topic} />;
}
