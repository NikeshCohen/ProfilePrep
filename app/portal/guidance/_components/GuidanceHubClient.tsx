"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useBookmarkedTopicsQuery,
  useGuidanceProgressQuery,
  usePersonalizedRecommendationsQuery,
  useUserProfileForContentQuery,
} from "@/actions/queries/guidance.queries";
import { motion } from "framer-motion";
import {
  BarChart,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Heart,
  LinkedinIcon,
  Lock,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Spinner } from "@/components/global/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatCareerStage, formatField } from "@/lib/utils/career-stage";

const guidanceTopics = [
  {
    id: "cv-optimization",
    label: "CV/Resume Optimization",
    icon: FileText,
    description: "Craft compelling CVs that pass ATS and impress recruiters",
    color: "blue",
    estimatedTime: "30 min",
    prerequisites: [],
    topics: [
      "ATS optimization strategies",
      "Industry-specific keywords",
      "Achievement quantification",
      "Format and structure",
    ],
  },
  {
    id: "cover-letters",
    label: "Cover Letters",
    icon: Mail,
    description: "Write personalized cover letters that open doors",
    color: "purple",
    estimatedTime: "25 min",
    prerequisites: [],
    topics: [
      "Personalization techniques",
      "Structure and flow",
      "Industry customization",
      "Common mistakes to avoid",
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn & Professional Presence",
    icon: LinkedinIcon,
    description: "Build a powerful professional brand online",
    color: "cyan",
    estimatedTime: "45 min",
    prerequisites: ["cv-optimization"],
    topics: [
      "Profile optimization",
      "Network building strategies",
      "Content creation",
      "Engagement best practices",
    ],
  },
  {
    id: "networking",
    label: "Networking & Outreach",
    icon: Users,
    description: "Build authentic professional relationships",
    color: "green",
    estimatedTime: "35 min",
    prerequisites: ["linkedin"],
    topics: [
      "Industry events",
      "Informational interviews",
      "Follow-up strategies",
      "Building your network",
    ],
  },
  {
    id: "interview-prep",
    label: "Interview Preparation",
    icon: MessageSquare,
    description: "Master behavioral and technical interviews",
    color: "orange",
    estimatedTime: "60 min",
    prerequisites: ["cv-optimization"],
    topics: [
      "STAR method",
      "Technical assessments",
      "Behavioral questions",
      "Industry-specific prep",
    ],
  },
  {
    id: "career-growth",
    label: "Career Growth & Branding",
    icon: TrendingUp,
    description: "Strategic planning for long-term success",
    color: "pink",
    estimatedTime: "40 min",
    prerequisites: ["networking", "linkedin"],
    topics: [
      "Personal branding",
      "Skill development",
      "Career transitions",
      "Leadership development",
    ],
  },
  {
    id: "salary-negotiation",
    label: "Salary Negotiation",
    icon: DollarSign,
    description: "Negotiate fair compensation confidently",
    color: "emerald",
    estimatedTime: "30 min",
    prerequisites: ["interview-prep"],
    topics: [
      "Market research",
      "Negotiation tactics",
      "Total compensation",
      "Timing strategies",
    ],
  },
  {
    id: "market-insights",
    label: "Market Insights",
    icon: BarChart,
    description: "Understand your industry landscape",
    color: "indigo",
    estimatedTime: "20 min",
    prerequisites: [],
    topics: [
      "Industry trends",
      "Salary benchmarks",
      "In-demand skills",
      "Future outlook",
    ],
  },
];

interface TopicProgress {
  [topicId: string]: {
    completed: boolean;
    progress: number;
    lastAccessed?: Date;
  };
}

export function GuidanceHubClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "recommended" | "in-progress" | "completed" | "bookmarked"
  >("all");

  // Use React Query hooks for data fetching with proper caching
  const { data: profileData, isLoading: profileLoading } =
    useUserProfileForContentQuery("CANDIDATE");
  const { data: progressData, isLoading: progressLoading } =
    useGuidanceProgressQuery("CANDIDATE");
  const { data: recommendationsData } = usePersonalizedRecommendationsQuery();
  const { data: bookmarkedData } = useBookmarkedTopicsQuery("CANDIDATE");

  // Update last guidance access (fire and forget)
  useState(() => {
    fetch("/api/user/guidance/access", { method: "POST" }).catch(console.error);
  });

  const loading = profileLoading || progressLoading;
  const user = profileData?.data?.userProfile;

  // Transform progress data into map
  const topicProgress: TopicProgress = {};
  if (progressData?.success && progressData.data) {
    progressData.data.forEach((entry) => {
      topicProgress[entry.topicId] = {
        completed: entry.completed,
        progress: entry.progress,
        lastAccessed: entry.lastAccessed,
      };
    });
  }

  const getRecommendedTopics = () => {
    if (
      recommendationsData?.success &&
      recommendationsData.data?.recommendations?.length &&
      recommendationsData.data.recommendations.length > 0
    ) {
      return guidanceTopics.filter((topic) =>
        recommendationsData.data?.recommendations.includes(topic.id),
      );
    }

    // Fallback recommendations if no data
    if (!user) return guidanceTopics.slice(0, 3);

    const recommendations: string[] = [];
    if (user.careerStage === "earlyCareer") {
      recommendations.push("cv-optimization", "interview-prep", "linkedin");
    } else if (user.careerStage === "midCareer") {
      recommendations.push("career-growth", "salary-negotiation", "networking");
    } else if (user.careerStage === "seniorCareer") {
      recommendations.push("career-growth", "market-insights", "linkedin");
    } else if (user.careerStage === "careerChanger") {
      recommendations.push("cv-optimization", "cover-letters", "networking");
    }

    return guidanceTopics.filter((topic) => recommendations.includes(topic.id));
  };

  const getFilteredTopics = () => {
    switch (selectedCategory) {
      case "recommended":
        return getRecommendedTopics();
      case "in-progress":
        return guidanceTopics.filter(
          (topic) =>
            topicProgress[topic.id]?.progress > 0 &&
            !topicProgress[topic.id]?.completed,
        );
      case "completed":
        return guidanceTopics.filter(
          (topic) => topicProgress[topic.id]?.completed,
        );
      case "bookmarked":
        if (bookmarkedData?.success && bookmarkedData.data) {
          const bookmarkedTopicIds = bookmarkedData.data.map(
            (item) => item.topicId,
          );
          return guidanceTopics.filter((topic) =>
            bookmarkedTopicIds.includes(topic.id),
          );
        }
        return [];
      default:
        return guidanceTopics;
    }
  };

  const getOverallProgress = () => {
    const completedTopics = guidanceTopics.filter(
      (topic) => topicProgress[topic.id]?.completed,
    ).length;
    return (completedTopics / guidanceTopics.length) * 100;
  };

  const isTopicLocked = (topicId: string) => {
    const topic = guidanceTopics.find((t) => t.id === topicId);
    if (!topic || topic.prerequisites.length === 0) return false;

    return !topic.prerequisites.every(
      (prereq) => topicProgress[prereq]?.completed,
    );
  };

  const handleTopicClick = (topicId: string) => {
    if (!isTopicLocked(topicId)) {
      router.push(`/portal/guidance/${topicId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner />
          <p className="text-muted-foreground">
            Loading your personalised guidance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
          Your Career Guidance Hub
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Personalized guidance tailored to your{" "}
          {user?.field ? `${user.field} career` : "professional journey"}
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
            <CardDescription>
              Track your journey through career guidance topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getOverallProgress())}%
              </span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {
                    guidanceTopics.filter((t) => topicProgress[t.id]?.completed)
                      .length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">
                  {
                    guidanceTopics.filter(
                      (t) =>
                        topicProgress[t.id]?.progress > 0 &&
                        !topicProgress[t.id]?.completed,
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-400">
                  {
                    guidanceTopics.filter((t) => !topicProgress[t.id]?.progress)
                      .length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Smart Recommendations */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert className="border-primary/20 bg-primary/5">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Personalised for you:</strong> Based on your{" "}
              {formatCareerStage(user.careerStage)} stage in{" "}
              {formatField(user.field)}, we recommend starting with{" "}
              {getRecommendedTopics()[0]?.label}.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Topic Categories */}
      <Tabs
        value={selectedCategory}
        onValueChange={(value) =>
          setSelectedCategory(
            value as
              | "all"
              | "recommended"
              | "in-progress"
              | "completed"
              | "bookmarked",
          )
        }
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        {/* All Topics Tab */}
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredTopics().map((topic, index) => {
              const Icon = topic.icon;
              const progress = topicProgress[topic.id];
              const locked = isTopicLocked(topic.id);

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all duration-200 ${locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"} ${progress?.completed ? "border-green-500/50" : ""} `}
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-lg p-2 bg-${topic.color}-100 dark:bg-${topic.color}-900/20`}
                        >
                          <Icon
                            className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`}
                          />
                        </div>
                        {locked && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {progress?.completed && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <CardTitle className="mt-4">{topic.label}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{topic.estimatedTime}</span>
                      </div>

                      {progress?.progress > 0 && !progress.completed && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress.progress}%</span>
                          </div>
                          <Progress
                            value={progress.progress}
                            className="h-1.5"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {topic.topics.slice(0, 3).map((subtopic, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                            <span className="text-muted-foreground">
                              {subtopic}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!locked && (
                        <Button
                          className="w-full"
                          variant={progress?.completed ? "outline" : "default"}
                        >
                          {progress?.completed
                            ? "Review"
                            : progress?.progress > 0
                              ? "Continue"
                              : "Start"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {locked && topic.prerequisites.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Complete{" "}
                          {topic.prerequisites
                            .map(
                              (p) =>
                                guidanceTopics.find((t) => t.id === p)?.label,
                            )
                            .join(", ")}{" "}
                          first
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Recommended Tab */}
        <TabsContent value="recommended" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredTopics().map((topic, index) => {
              const Icon = topic.icon;
              const progress = topicProgress[topic.id];
              const locked = isTopicLocked(topic.id);

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all duration-200 ${locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"} ${progress?.completed ? "border-green-500/50" : ""} `}
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-lg p-2 bg-${topic.color}-100 dark:bg-${topic.color}-900/20`}
                        >
                          <Icon
                            className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`}
                          />
                        </div>
                        {locked && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {progress?.completed && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <CardTitle className="mt-4">{topic.label}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{topic.estimatedTime}</span>
                      </div>

                      {progress?.progress > 0 && !progress.completed && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress.progress}%</span>
                          </div>
                          <Progress
                            value={progress.progress}
                            className="h-1.5"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {topic.topics.slice(0, 3).map((subtopic, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                            <span className="text-muted-foreground">
                              {subtopic}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!locked && (
                        <Button
                          className="w-full"
                          variant={progress?.completed ? "outline" : "default"}
                        >
                          {progress?.completed
                            ? "Review"
                            : progress?.progress > 0
                              ? "Continue"
                              : "Start"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {locked && topic.prerequisites.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Complete{" "}
                          {topic.prerequisites
                            .map(
                              (p) =>
                                guidanceTopics.find((t) => t.id === p)?.label,
                            )
                            .join(", ")}{" "}
                          first
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="in-progress" className="mt-6">
          {getFilteredTopics().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredTopics().map((topic, index) => {
                const Icon = topic.icon;
                const progress = topicProgress[topic.id];
                const locked = isTopicLocked(topic.id);

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`h-full cursor-pointer transition-all duration-200 ${locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"} ${progress?.completed ? "border-green-500/50" : ""} `}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`rounded-lg p-2 bg-${topic.color}-100 dark:bg-${topic.color}-900/20`}
                          >
                            <Icon
                              className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`}
                            />
                          </div>
                          {locked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {progress?.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardTitle className="mt-4">{topic.label}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{topic.estimatedTime}</span>
                        </div>

                        {progress?.progress > 0 && !progress.completed && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress
                              value={progress.progress}
                              className="h-1.5"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          {topic.topics.slice(0, 3).map((subtopic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                              <span className="text-muted-foreground">
                                {subtopic}
                              </span>
                            </div>
                          ))}
                        </div>

                        {!locked && (
                          <Button
                            className="w-full"
                            variant={
                              progress?.completed ? "outline" : "default"
                            }
                          >
                            {progress?.completed
                              ? "Review"
                              : progress?.progress > 0
                                ? "Continue"
                                : "Start"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {locked && topic.prerequisites.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Complete{" "}
                            {topic.prerequisites
                              .map(
                                (p) =>
                                  guidanceTopics.find((t) => t.id === p)?.label,
                              )
                              .join(", ")}{" "}
                            first
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No Topics In Progress
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Start a topic to see your progress here.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="mt-6">
          {getFilteredTopics().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredTopics().map((topic, index) => {
                const Icon = topic.icon;
                const progress = topicProgress[topic.id];
                const locked = isTopicLocked(topic.id);

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`h-full cursor-pointer transition-all duration-200 ${locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"} ${progress?.completed ? "border-green-500/50" : ""} `}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`rounded-lg p-2 bg-${topic.color}-100 dark:bg-${topic.color}-900/20`}
                          >
                            <Icon
                              className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`}
                            />
                          </div>
                          {locked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {progress?.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardTitle className="mt-4">{topic.label}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{topic.estimatedTime}</span>
                        </div>

                        {progress?.progress > 0 && !progress.completed && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress
                              value={progress.progress}
                              className="h-1.5"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          {topic.topics.slice(0, 3).map((subtopic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                              <span className="text-muted-foreground">
                                {subtopic}
                              </span>
                            </div>
                          ))}
                        </div>

                        {!locked && (
                          <Button
                            className="w-full"
                            variant={
                              progress?.completed ? "outline" : "default"
                            }
                          >
                            {progress?.completed
                              ? "Review"
                              : progress?.progress > 0
                                ? "Continue"
                                : "Start"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {locked && topic.prerequisites.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Complete{" "}
                            {topic.prerequisites
                              .map(
                                (p) =>
                                  guidanceTopics.find((t) => t.id === p)?.label,
                              )
                              .join(", ")}{" "}
                            first
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No Completed Topics Yet
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Complete your first topic to see achievements here.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Bookmarked Tab */}
        <TabsContent value="bookmarked" className="mt-6">
          {getFilteredTopics().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredTopics().map((topic, index) => {
                const Icon = topic.icon;
                const progress = topicProgress[topic.id];
                const locked = isTopicLocked(topic.id);

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`h-full cursor-pointer transition-all duration-200 ${locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"} ${progress?.completed ? "border-green-500/50" : ""} `}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`rounded-lg p-2 bg-${topic.color}-100 dark:bg-${topic.color}-900/20`}
                          >
                            <Icon
                              className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`}
                            />
                          </div>
                          {locked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {progress?.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardTitle className="mt-4">{topic.label}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{topic.estimatedTime}</span>
                        </div>

                        {progress?.progress > 0 && !progress.completed && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress
                              value={progress.progress}
                              className="h-1.5"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          {topic.topics.slice(0, 3).map((subtopic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                              <span className="text-muted-foreground">
                                {subtopic}
                              </span>
                            </div>
                          ))}
                        </div>

                        {!locked && (
                          <Button
                            className="w-full"
                            variant={
                              progress?.completed ? "outline" : "default"
                            }
                          >
                            {progress?.completed
                              ? "Review"
                              : progress?.progress > 0
                                ? "Continue"
                                : "Start"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {locked && topic.prerequisites.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Complete{" "}
                            {topic.prerequisites
                              .map(
                                (p) =>
                                  guidanceTopics.find((t) => t.id === p)?.label,
                              )
                              .join(", ")}{" "}
                            first
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No Bookmarked Topics Yet
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Bookmark topics you want to revisit later.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI CV Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Get instant feedback on your CV
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/app">Review CV</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Practice Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Prepare with AI mock interviews
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/app">Start Practice</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Update Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Refine your career preferences
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/app/settings">Update</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
