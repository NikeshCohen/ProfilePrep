"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useGuidanceProgressQuery,
  usePersonalizedRecommendationsQuery,
  useUserProfileForContentQuery,
} from "@/actions/queries/guidance.queries";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Heart,
  Lock,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
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

const recruiterTopics = [
  {
    id: "sourcing",
    label: "Strategic Sourcing",
    icon: Search,
    description:
      "Master the art of finding exceptional talent before your competitors do",
    color: "blue",
    estimatedTime: "20-30 min",
    prerequisites: [],
    topics: [
      "Boolean search mastery",
      "Platform-specific techniques",
      "Passive candidate engagement",
      "Employer brand development",
    ],
  },
  {
    id: "screening",
    label: "Candidate Screening Excellence",
    icon: UserCheck,
    description:
      "Develop systematic approaches to evaluate and qualify candidates effectively",
    color: "green",
    estimatedTime: "25-35 min",
    prerequisites: [],
    topics: [
      "Structured screening processes",
      "Technical assessment design",
      "Cultural fit evaluation",
      "Reference check strategies",
    ],
  },
  {
    id: "interviewing",
    label: "Interview Mastery",
    icon: Users,
    description:
      "Create interview processes that reveal both competence and cultural fit",
    color: "purple",
    estimatedTime: "30-40 min",
    prerequisites: ["screening"],
    topics: [
      "Behavioral interviewing techniques",
      "Panel interview orchestration",
      "Technical evaluation methods",
      "Bias reduction strategies",
    ],
  },
  {
    id: "market-insights",
    label: "Market Intelligence",
    icon: TrendingUp,
    description:
      "Build comprehensive understanding of market trends and competitive dynamics",
    color: "orange",
    estimatedTime: "15-25 min",
    prerequisites: [],
    topics: [
      "Compensation benchmarking",
      "Industry trend analysis",
      "Talent supply dynamics",
      "Competitive positioning",
    ],
  },
  {
    id: "diversity",
    label: "Inclusive Recruiting",
    icon: Heart,
    description:
      "Implement strategies that build diverse teams while expanding talent reach",
    color: "pink",
    estimatedTime: "20-30 min",
    prerequisites: [],
    topics: [
      "Inclusive sourcing channels",
      "Bias-free evaluation processes",
      "Diverse interview panels",
      "Inclusive employer branding",
    ],
  },
  {
    id: "candidate-experience",
    label: "Candidate Experience Design",
    icon: Eye,
    description:
      "Design candidate journeys that reflect your values while effectively evaluating professionals",
    color: "teal",
    estimatedTime: "15-25 min",
    prerequisites: [],
    topics: [
      "Communication standards",
      "Timeline management",
      "Feedback provision",
      "Onboarding integration",
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

export function RecruiterGuidanceHubClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "recommended" | "in-progress" | "completed"
  >("all");

  // Use React Query hooks for data fetching with proper caching
  const { data: profileData, isLoading: profileLoading } =
    useUserProfileForContentQuery("RECRUITER");
  const { data: progressData, isLoading: progressLoading } =
    useGuidanceProgressQuery("RECRUITER");
  const { data: recommendationsData } = usePersonalizedRecommendationsQuery();

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
      return recruiterTopics.filter((topic) =>
        recommendationsData.data?.recommendations.includes(topic.id),
      );
    }

    // Fallback recommendations if no data
    if (!user) return [];

    const recommendations: string[] = [];

    // Field-specific recommendations
    if (user.field === "technology") {
      recommendations.push("sourcing", "screening", "interviewing");
    } else if (user.field === "healthcare") {
      recommendations.push(
        "candidate-experience",
        "diversity",
        "market-insights",
      );
    } else if (user.field === "finance") {
      recommendations.push("screening", "market-insights", "interviewing");
    } else if (user.field === "marketing") {
      recommendations.push("sourcing", "diversity", "candidate-experience");
    }

    // Career stage considerations
    if (user.careerStage === "earlyCareer") {
      if (!recommendations.includes("sourcing"))
        recommendations.unshift("sourcing");
      if (!recommendations.includes("screening"))
        recommendations.push("screening");
      if (!recommendations.includes("candidate-experience"))
        recommendations.push("candidate-experience");
    } else if (user.careerStage === "midCareer") {
      if (!recommendations.includes("interviewing"))
        recommendations.push("interviewing");
      if (!recommendations.includes("market-insights"))
        recommendations.push("market-insights");
      if (!recommendations.includes("diversity"))
        recommendations.push("diversity");
    } else if (user.careerStage === "seniorCareer") {
      if (!recommendations.includes("market-insights"))
        recommendations.unshift("market-insights");
      if (!recommendations.includes("diversity"))
        recommendations.push("diversity");
      if (!recommendations.includes("interviewing"))
        recommendations.push("interviewing");
    }

    // Fallback recommendations if none matched
    if (recommendations.length === 0) {
      recommendations.push("sourcing", "screening", "candidate-experience");
    }

    // Return unique recommendations, limited to top 3-4
    const uniqueRecommendations = [...new Set(recommendations)].slice(0, 4);
    return recruiterTopics.filter((topic) =>
      uniqueRecommendations.includes(topic.id),
    );
  };

  const getFilteredTopics = () => {
    switch (selectedCategory) {
      case "recommended":
        return getRecommendedTopics();
      case "in-progress":
        return recruiterTopics.filter(
          (topic) =>
            topicProgress[topic.id]?.progress > 0 &&
            !topicProgress[topic.id]?.completed,
        );
      case "completed":
        return recruiterTopics.filter(
          (topic) => topicProgress[topic.id]?.completed,
        );
      default:
        return recruiterTopics;
    }
  };

  const getCompletionStats = () => {
    const completed = recruiterTopics.filter(
      (topic) => topicProgress[topic.id]?.completed,
    ).length;
    const inProgress = recruiterTopics.filter(
      (topic) =>
        topicProgress[topic.id]?.progress > 0 &&
        !topicProgress[topic.id]?.completed,
    ).length;
    const overall = completed + inProgress;
    const percentage = Math.round((completed / recruiterTopics.length) * 100);

    return {
      completed,
      inProgress,
      overall,
      percentage,
      total: recruiterTopics.length,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = getCompletionStats();
  const filteredTopics = getFilteredTopics();
  const recommendedTopics = getRecommendedTopics();

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Recruitment Excellence Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            Personalized guidance for recruiting success
            {user?.field && ` in ${formatField(user.field)}`}
          </p>
        </div>

        {user && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Personalized for you:</strong> Content tailored to your{" "}
              {formatField(user.field || "recruiting")} background
              {user.specializations?.[0] &&
                ` and ${user.specializations[0]} specialization`}
              {user.careerStage &&
                `, optimized for ${formatCareerStage(user.careerStage)} professionals`}
              .
            </AlertDescription>
          </Alert>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
            <div className="text-xs text-muted-foreground">
              {stats.overall} of {stats.total} topics engaged
            </div>
            <Progress value={stats.percentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-xs text-muted-foreground">Topics mastered</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <div className="text-xs text-muted-foreground">Active topics</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {recommendedTopics.length}
            </div>
            <div className="text-xs text-muted-foreground">
              For your profile
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs
          value={selectedCategory}
          onValueChange={(value) =>
            setSelectedCategory(
              value as "all" | "recommended" | "in-progress" | "completed",
            )
          }
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-4">
              <TabsTrigger value="all">
                All Topics ({recruiterTopics.length})
              </TabsTrigger>
              <TabsTrigger value="recommended">
                Recommended ({recommendedTopics.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({stats.inProgress})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({stats.completed})
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            <TopicGrid topics={filteredTopics} progress={topicProgress} />
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            {recommendedTopics.length > 0 ? (
              <>
                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    Personalized Recommendations
                  </h3>
                  <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                    Based on your {formatField(user?.field || "recruiting")}{" "}
                    background
                    {user?.careerStage &&
                      ` and ${formatCareerStage(user.careerStage)} experience level`}
                    .
                  </p>
                </div>
                <TopicGrid
                  topics={recommendedTopics}
                  progress={topicProgress}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Complete Your Profile
                </h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Add your field and specialization to get personalized
                  recommendations.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/recruiter/settings")}
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            {filteredTopics.length > 0 ? (
              <TopicGrid topics={filteredTopics} progress={topicProgress} />
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

          <TabsContent value="completed" className="space-y-6">
            {filteredTopics.length > 0 ? (
              <TopicGrid topics={filteredTopics} progress={topicProgress} />
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
        </Tabs>
      </motion.div>
    </div>
  );
}

interface TopicGridProps {
  topics: typeof recruiterTopics;
  progress: TopicProgress;
}

function TopicGrid({ topics, progress }: TopicGridProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      green:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300",
      purple:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      orange:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      pink: "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      teal: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-300",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => {
        const topicProgress = progress[topic.id];
        const isCompleted = topicProgress?.completed || false;
        const progressValue = topicProgress?.progress || 0;
        const hasStarted = progressValue > 0;

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg p-2 ${getColorClasses(topic.color)}`}
                  >
                    <topic.icon className="h-6 w-6" />
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <CardTitle className="text-lg">{topic.label}</CardTitle>
                <CardDescription className="text-sm">
                  {topic.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{topic.estimatedTime}</span>
                  {hasStarted && (
                    <span className="font-medium">
                      {progressValue}% complete
                    </span>
                  )}
                </div>

                {hasStarted && (
                  <Progress value={progressValue} className="h-2" />
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">You&apos;ll learn:</p>
                  <ul className="space-y-1">
                    {topic.topics.slice(0, 3).map((subtopic, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        {subtopic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {topic.prerequisites.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Prerequisites required
                    </div>
                  )}
                  <Link href={`/recruiter/guidance/${topic.id}`}>
                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "default"}
                      className="ml-auto"
                    >
                      {isCompleted
                        ? "Review"
                        : hasStarted
                          ? "Continue"
                          : "Start"}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
