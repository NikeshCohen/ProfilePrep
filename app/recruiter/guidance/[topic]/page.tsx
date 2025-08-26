import { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecruiterTopicPage } from "@/app/recruiter/guidance/[topic]/_components/RecruiterTopicPage";

const validTopics = [
  "sourcing",
  "screening",
  "interviewing",
  "market-insights",
  "diversity",
  "candidate-experience",
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
    sourcing: "Strategic Sourcing",
    screening: "Candidate Screening Excellence",
    interviewing: "Interview Mastery",
    "market-insights": "Market Intelligence",
    diversity: "Inclusive Recruiting",
    "candidate-experience": "Candidate Experience Design",
  };

  const label = topicLabels[topic] || "Guidance";

  return {
    title: `${label} | Recruitment Excellence | ProfilePrep`,
    description: `Master ${label.toLowerCase()} with personalized recruiting guidance`,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { topic } = await params;

  if (!validTopics.includes(topic)) {
    notFound();
  }

  return <RecruiterTopicPage topic={topic} />;
}
