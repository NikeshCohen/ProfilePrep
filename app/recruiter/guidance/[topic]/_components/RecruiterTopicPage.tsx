"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  useToggleBookmarkMutation,
  useTopicProgressQuery,
  useUpdateGuidanceProgressMutation,
  useUserProfileForContentQuery,
} from "@/actions/queries/guidance.queries";
import recruiterGuidance from "@/constants/guidance/recruiter.json";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Download,
  Lightbulb,
  Share2,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecruiterTopicPageProps {
  topic: string;
}


interface FieldData {
  label: string;
  description: string;
  specializations: Record<string, SpecializationData>;
}

interface SpecializationData {
  label: string;
  narrative: string;
  sourcingStrategies?: string[];
  screeningCriteria?: string[];
  redFlags?: string[];
  interviewGuidance?: string[];
  currentMarketInsights?: {
    demandPatterns: string;
    compensationTrends: string;
    skillPriorities: string[];
    hiringChallenges: string[];
  };
}

interface UniversalGuidanceSection {
  philosophy: string;
  strategies?: string[];
  methodology?: string[];
  bestPractices?: string[];
  approach?: string[];
  elements?: string[];
}

interface PersonalizedContent {
  field: FieldData | null;
  specialization: SpecializationData | null;
  universalGuidance: UniversalGuidanceSection | null;
  title: string;
  description: string;
  philosophy: string;
  difficulty: string;
  totalEstimatedTime: number;
  sections: Array<{
    title: string;
    content: string[];
    estimatedTimeMinutes: number;
  }>;
}

export function RecruiterTopicPage({ topic }: RecruiterTopicPageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [sectionsCompleted, setSectionsCompleted] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  // React Query hooks
  const { data: profileData, isLoading: profileLoading } = useUserProfileForContentQuery("RECRUITER");
  const { data: progressData, isLoading: progressLoading } = useTopicProgressQuery(topic, "RECRUITER");
  const toggleBookmarkMutation = useToggleBookmarkMutation();
  const updateProgressMutation = useUpdateGuidanceProgressMutation();

  const user = profileData?.data?.userProfile;
  const loading = profileLoading || progressLoading;
  const progress = progressData?.data?.progress || 0;
  const bookmarked = progressData?.data?.bookmarked || false;

  const generatePersonalizedContent = useCallback((
    fieldData: FieldData,
    specializationData: SpecializationData | null,
    universalGuidance: UniversalGuidanceSection | null,
    topicId: string,
    careerStage?: string,
  ): PersonalizedContent => {
    const fieldLabel = fieldData.label;
    const specializationLabel =
      specializationData?.label || "general recruiting";

    // Generate personalized philosophy based on career stage
    const philosophy = generatePersonalizedPhilosophy(
      topicId,
      fieldLabel,
      specializationLabel,
      careerStage,
    );

    // Generate content sections based on topic, field, specialization AND career stage
    const sections = generatePersonalizedSections(
      topicId,
      fieldData,
      specializationData,
      universalGuidance,
      careerStage,
    );

    // Calculate total time based on content
    const totalTime = sections.reduce(
      (total, section) => total + section.estimatedTimeMinutes,
      0,
    );

    return {
      field: fieldData,
      specialization: specializationData,
      universalGuidance,
      title: generateTopicTitle(topicId, fieldLabel),
      description: generateTopicDescription(
        topicId,
        fieldLabel,
        specializationLabel,
      ),
      philosophy,
      difficulty: getDifficultyLevel(topicId),
      totalEstimatedTime: totalTime,
      sections,
    };
  }, []);

  const getPersonalizedContent = useCallback((): PersonalizedContent => {
    // Full personalization based on user profile - no more "for now" comments!
    if (!user?.field) return getDefaultContent();

    const fieldData =
      recruiterGuidance.fields[
        user.field as keyof typeof recruiterGuidance.fields
      ];
    if (!fieldData) return getDefaultContent();

    const specializationData = user.specializations?.[0]
      ? fieldData.specializations[
          user.specializations[0] as keyof typeof fieldData.specializations
        ]
      : null;

    const universalGuidance = getUniversalGuidanceForTopic(topic);

    return generatePersonalizedContent(
      fieldData,
      specializationData as SpecializationData | null,
      universalGuidance,
      topic,
      user.careerStage,
    );
  }, [user, topic, generatePersonalizedContent]);

  // Update local state when progress data changes
  useEffect(() => {
    if (progressData?.success && progressData.data) {
      const sections = Array.isArray(progressData.data.sectionsCompleted)
        ? progressData.data.sectionsCompleted
        : typeof progressData.data.sectionsCompleted === "string"
          ? JSON.parse(progressData.data.sectionsCompleted)
          : [];
      const content = getPersonalizedContent();
      const maxSection = Math.min(sections.length, content.sections.length - 1);
      setActiveSection(Math.max(0, maxSection));
      setSectionsCompleted(sections);
      setTimeSpent(progressData.data.timeSpent);
    }
  }, [progressData, getPersonalizedContent]);

  // Initialize session start time
  useEffect(() => {
    setSessionStartTime(new Date());
  }, [topic]);


  const saveProgress = async (
    newProgress: number,
    section: number,
    completed: boolean = false,
  ) => {
    try {
      // Calculate time spent in this session
      const sessionTime = Math.floor(
        (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60),
      );
      const totalTimeSpent = timeSpent + sessionTime;

      // Update sections completed
      const newSectionsCompleted = [...sectionsCompleted];
      if (!newSectionsCompleted.includes(section.toString())) {
        newSectionsCompleted.push(section.toString());
      }

      await updateProgressMutation.mutateAsync({
        topicId: topic,
        progress: newProgress,
        completed,
        sectionsCompleted: newSectionsCompleted,
        timeSpent: totalTimeSpent,
        bookmarked,
      });

      // Update local state
      setActiveSection(section);
      setSectionsCompleted(newSectionsCompleted);
      setTimeSpent(totalTimeSpent);
      setSessionStartTime(new Date()); // Reset session timer
    } catch (error) {
      console.error("Failed to save progress:", error);
      // Optimistic update for better UX
      setActiveSection(section);
    }
  };

  const getUniversalGuidanceForTopic = (
    topicId: string,
  ): UniversalGuidanceSection | null => {
    const topicMapping: Record<
      string,
      keyof typeof recruiterGuidance.universalGuidance
    > = {
      sourcing: "sourcingExcellence",
      screening: "screeningMastery",
      interviewing: "interviewExpertise",
      "market-insights": "offerNegotiation",
      diversity: "diversityInclusion",
      "candidate-experience": "candidateExperience",
    };

    const universalKey = topicMapping[topicId];
    if (!universalKey) return null;

    return recruiterGuidance.universalGuidance[
      universalKey
    ] as UniversalGuidanceSection;
  };

  const generatePersonalizedPhilosophy = (
    topicId: string,
    field: string,
    specialization: string,
    careerStage?: string,
  ): string => {
    const basePhilosophies: Record<string, string> = {
      sourcing: `In ${field.toLowerCase()}, sourcing excellence means understanding that great ${specialization.toLowerCase()} professionals aren't just looking for jobs—they're evaluating opportunities that align with their career trajectory, values, and growth aspirations.`,
      screening: `Effective ${field.toLowerCase()} screening requires balancing technical assessment with cultural evaluation, ensuring that ${specialization.toLowerCase()} candidates can both perform excellently and contribute meaningfully to team dynamics.`,
      interviewing: `${field} interviews should feel like collaborative conversations where both parties explore fit. For ${specialization.toLowerCase()} roles, focus on problem-solving approach, communication clarity, and alignment with team values.`,
      "market-insights": `Understanding ${field.toLowerCase()} market dynamics helps you position opportunities effectively and provide valuable guidance to both candidates and hiring managers about realistic expectations and competitive positioning.`,
      diversity: `Building diverse ${field.toLowerCase()} teams requires intentional sourcing strategies that reach underrepresented communities and create inclusive evaluation processes that recognize talent from all backgrounds.`,
      "candidate-experience": `Every touchpoint in your ${field.toLowerCase()} recruiting process should reflect your organization's values while providing clear communication and respectful treatment of all candidates.`,
    };

    const careerContext =
      careerStage === "earlyCareer"
        ? " especially when building foundational teams"
        : careerStage === "midCareer"
          ? " with focus on scaling and team dynamics"
          : careerStage === "seniorCareer"
            ? " at executive and strategic levels"
            : "";

    return (
      (basePhilosophies[topicId] ||
        `Professional recruiting in ${field.toLowerCase()} requires combining industry expertise with human insight to create successful matches between talented ${specialization.toLowerCase()} professionals and growth opportunities`) +
      careerContext +
      "."
    );
  };

  const generateTopicTitle = (
    topicId: string,
    field: string,
  ): string => {
    const titles: Record<string, string> = {
      sourcing: `${field} Talent Sourcing Mastery`,
      screening: `${field} Candidate Screening Excellence`,
      interviewing: `${field} Interview Strategies`,
      "market-insights": `${field} Market Intelligence`,
      diversity: `Inclusive ${field} Recruiting`,
      "candidate-experience": `${field} Candidate Experience`,
    };

    return titles[topicId] || `${field} Recruitment Guidance`;
  };

  const generateTopicDescription = (
    topicId: string,
    field: string,
    specialization: string,
  ): string => {
    const descriptions: Record<string, string> = {
      sourcing: `Master advanced sourcing techniques for finding exceptional ${specialization.toLowerCase()} talent in the competitive ${field.toLowerCase()} market.`,
      screening: `Develop systematic approaches to evaluate and qualify ${specialization.toLowerCase()} candidates effectively while maintaining efficiency and fairness.`,
      interviewing: `Create interview processes that reveal both technical competence and cultural fit for ${specialization.toLowerCase()} roles in ${field.toLowerCase()}.`,
      "market-insights": `Build comprehensive understanding of ${field.toLowerCase()} market trends, compensation patterns, and competitive dynamics affecting ${specialization.toLowerCase()} recruiting.`,
      diversity: `Implement inclusive recruiting strategies that build diverse ${field.toLowerCase()} teams while expanding your talent pipeline reach.`,
      "candidate-experience": `Design candidate journeys that reflect your values while effectively evaluating ${specialization.toLowerCase()} professionals.`,
    };

    return (
      descriptions[topicId] ||
      `Professional guidance for recruiting ${specialization.toLowerCase()} talent in ${field.toLowerCase()}.`
    );
  };

  const getDifficultyLevel = (
    topicId: string,
  ): string => {
    const difficulties: Record<string, string> = {
      sourcing: "intermediate",
      screening: "intermediate",
      interviewing: "advanced",
      "market-insights": "advanced",
      diversity: "intermediate",
      "candidate-experience": "beginner",
    };

    return difficulties[topicId] || "intermediate";
  };

  const generatePersonalizedSections = (
    topicId: string,
    fieldData: FieldData,
    specializationData: SpecializationData | null,
    universalGuidance: UniversalGuidanceSection | null,
    careerStage?: string,
  ): PersonalizedContent["sections"] => {
    // Generate sections based on available data and topic type
    const sections: PersonalizedContent["sections"] = [];

    if (topicId === "sourcing") {
      // Sourcing-specific sections
      if (specializationData?.sourcingStrategies?.length) {
        // Filter strategies based on career stage
        const filteredStrategies =
          careerStage === "earlyCareer"
            ? specializationData.sourcingStrategies.filter(
                (s) => !s.includes("executive") && !s.includes("C-level"),
              )
            : careerStage === "seniorCareer"
              ? specializationData.sourcingStrategies.filter(
                  (s) => !s.includes("junior") && !s.includes("entry-level"),
                )
              : specializationData.sourcingStrategies;

        sections.push({
          title: `${specializationData.label} Sourcing Strategies${careerStage === "earlyCareer" ? " - Foundation" : careerStage === "seniorCareer" ? " - Executive Level" : ""}`,
          content: filteredStrategies,
          estimatedTimeMinutes: Math.max(
            5,
            Math.ceil(filteredStrategies.length * 0.8),
          ),
        });
      }

      if (universalGuidance?.strategies?.length) {
        sections.push({
          title: `Universal Sourcing Excellence${careerStage === "earlyCareer" ? " - Getting Started" : careerStage === "seniorCareer" ? " - Advanced Techniques" : ""}`,
          content: universalGuidance.strategies,
          estimatedTimeMinutes: Math.max(
            5,
            Math.ceil(universalGuidance.strategies.length * 0.8),
          ),
        });
      }
    } else if (topicId === "screening") {
      // Screening-specific sections
      if (specializationData?.screeningCriteria?.length) {
        sections.push({
          title: `${specializationData.label} Screening Criteria`,
          content: specializationData.screeningCriteria,
          estimatedTimeMinutes: Math.max(
            5,
            Math.ceil(specializationData.screeningCriteria.length * 0.8),
          ),
        });
      }

      if (specializationData?.redFlags?.length) {
        sections.push({
          title: "Red Flags to Avoid",
          content: specializationData.redFlags,
          estimatedTimeMinutes: Math.max(
            4,
            Math.ceil(specializationData.redFlags.length * 0.7),
          ),
        });
      }

      if (universalGuidance?.methodology?.length) {
        sections.push({
          title: "Screening Methodology",
          content: universalGuidance.methodology,
          estimatedTimeMinutes: Math.max(
            6,
            Math.ceil(universalGuidance.methodology.length * 0.9),
          ),
        });
      }
    } else if (topicId === "interviewing") {
      // Interview-specific sections
      if (specializationData?.interviewGuidance?.length) {
        sections.push({
          title: `${specializationData.label} Interview Techniques`,
          content: specializationData.interviewGuidance,
          estimatedTimeMinutes: Math.max(
            6,
            Math.ceil(specializationData.interviewGuidance.length * 0.9),
          ),
        });
      }

      if (universalGuidance?.bestPractices?.length) {
        sections.push({
          title: "Interview Best Practices",
          content: universalGuidance.bestPractices,
          estimatedTimeMinutes: Math.max(
            5,
            Math.ceil(universalGuidance.bestPractices.length * 0.8),
          ),
        });
      }
    } else if (topicId === "market-insights") {
      // Market insights sections
      if (specializationData?.currentMarketInsights) {
        const insights = specializationData.currentMarketInsights;

        sections.push({
          title: "Current Market Dynamics",
          content: [
            `Market Demand: ${insights.demandPatterns}`,
            `Compensation Trends: ${insights.compensationTrends}`,
          ],
          estimatedTimeMinutes: 4,
        });

        if (insights.skillPriorities?.length) {
          sections.push({
            title: "Priority Skills in Demand",
            content: insights.skillPriorities.map(
              (skill) => `${skill} - Critical for competitive positioning`,
            ),
            estimatedTimeMinutes: 3,
          });
        }

        if (insights.hiringChallenges?.length) {
          sections.push({
            title: "Current Hiring Challenges",
            content: insights.hiringChallenges,
            estimatedTimeMinutes: 4,
          });
        }
      }

      if (universalGuidance?.approach?.length) {
        sections.push({
          title: "Market Intelligence Approach",
          content: universalGuidance.approach,
          estimatedTimeMinutes: Math.max(
            5,
            Math.ceil(universalGuidance.approach.length * 0.8),
          ),
        });
      }
    } else if (topicId === "diversity") {
      // Diversity-specific sections with career stage awareness
      const careerFocusedContent =
        careerStage === "earlyCareer"
          ? [
              `Build inclusive recruiting practices from the start of your ${fieldData.label.toLowerCase()} recruiting career`,
              "Learn to identify and mitigate unconscious bias in screening and interviews",
              "Develop partnerships with diverse talent communities and organizations",
              "Create inclusive job descriptions that attract diverse candidates",
            ]
          : careerStage === "seniorCareer"
            ? [
                `Lead organizational change in ${fieldData.label.toLowerCase()} diversity recruiting initiatives`,
                "Develop metrics and accountability systems for inclusive hiring",
                "Build strategic partnerships with diverse executive search firms",
                "Champion diversity at the leadership and board levels",
              ]
            : [
                `Implement inclusive recruiting strategies in ${fieldData.label.toLowerCase()}`,
                "Build diverse talent pipelines through strategic sourcing",
                "Create equitable evaluation processes",
                "Measure and improve diversity recruiting outcomes",
              ];

      sections.push({
        title: `Inclusive ${fieldData.label} Recruiting${careerStage === "earlyCareer" ? " - Foundation" : careerStage === "seniorCareer" ? " - Leadership" : ""}`,
        content: careerFocusedContent,
        estimatedTimeMinutes: 6,
      });

      if (universalGuidance?.elements?.length) {
        sections.push({
          title: "Universal Inclusion Principles",
          content: universalGuidance.elements,
          estimatedTimeMinutes: Math.max(
            4,
            Math.ceil(universalGuidance.elements.length * 0.7),
          ),
        });
      }
    } else if (topicId === "candidate-experience") {
      // Candidate experience sections with career stage awareness
      const careerFocusedContent =
        careerStage === "earlyCareer"
          ? [
              `Learn the fundamentals of creating positive candidate experiences in ${fieldData.label.toLowerCase()}`,
              "Master clear, timely communication throughout the recruitment process",
              "Understand how to set realistic expectations and provide helpful feedback",
              "Build systems for consistent follow-up and relationship management",
            ]
          : careerStage === "seniorCareer"
            ? [
                `Lead the design of exceptional candidate experiences that reflect your ${fieldData.label.toLowerCase()} organization's values`,
                "Develop comprehensive candidate journey mapping and optimization processes",
                "Build technology and process solutions that scale positive experiences",
                "Create feedback loops and continuous improvement mechanisms",
              ]
            : [
                `Optimize candidate experiences across the ${fieldData.label.toLowerCase()} recruitment lifecycle`,
                "Balance efficiency with personalization in candidate communications",
                "Implement feedback collection and process improvement initiatives",
                "Train hiring managers on candidate experience best practices",
              ];

      sections.push({
        title: `${fieldData.label} Candidate Experience Excellence${careerStage === "earlyCareer" ? " - Fundamentals" : careerStage === "seniorCareer" ? " - Strategic Design" : ""}`,
        content: careerFocusedContent,
        estimatedTimeMinutes: 5,
      });

      if (universalGuidance?.elements?.length) {
        sections.push({
          title: "Universal Experience Principles",
          content: universalGuidance.elements,
          estimatedTimeMinutes: Math.max(
            4,
            Math.ceil(universalGuidance.elements.length * 0.7),
          ),
        });
      }
    }

    // Fallback for topics without specific content - add career stage context
    if (sections.length === 0) {
      const careerLevelContent =
        careerStage === "earlyCareer"
          ? [
              `Building foundational skills for ${fieldData.label.toLowerCase()} recruiting`,
              "Focus on learning core recruitment principles and processes",
              "Develop relationships with hiring managers and understand their needs",
              "Build your talent network and sourcing capabilities",
            ]
          : careerStage === "seniorCareer"
            ? [
                `Advanced ${fieldData.label.toLowerCase()} recruiting leadership strategies`,
                "Focus on building teams, processes, and organizational recruiting capability",
                "Develop strategic partnerships and thought leadership",
                "Mentor junior recruiters and drive recruiting excellence across the organization",
              ]
            : [
                `This ${fieldData.label.toLowerCase()} guidance is being developed with comprehensive, personalized content`,
                "Check back soon for detailed strategies specific to your field and specialization",
                "Your profile information will be used to provide the most relevant guidance",
              ];

      sections.push({
        title:
          careerStage === "earlyCareer"
            ? "Foundation Building"
            : careerStage === "seniorCareer"
              ? "Leadership Excellence"
              : "Getting Started",
        content: careerLevelContent,
        estimatedTimeMinutes: careerStage ? 5 : 3,
      });
    }

    return sections;
  };

  const getDefaultContent = (): PersonalizedContent => {
    // Fallback content when no user data is available
    return {
      field: null,
      specialization: null,
      universalGuidance: null,
      title: "Recruitment Guidance",
      description: "Professional recruitment strategies and best practices",
      philosophy:
        "Great recruiting combines systematic methodology with human insight to create meaningful connections between talented professionals and growth opportunities.",
      difficulty: "intermediate",
      totalEstimatedTime: 8,
      sections: [
        {
          title: "Universal Recruiting Principles",
          content: [
            "Build authentic relationships with candidates and hiring managers",
            "Focus on quality matches rather than quick placements",
            "Maintain clear, honest communication throughout the process",
            "Continuously develop your understanding of the industries you serve",
          ],
          estimatedTimeMinutes: 5,
        },
        {
          title: "Getting Started",
          content: [
            "Complete your profile to receive personalized guidance",
            "Specify your field and specialization for tailored content",
            "Set your career stage for appropriate difficulty levels",
          ],
          estimatedTimeMinutes: 3,
        },
      ],
    };
  };

  const handleSectionComplete = () => {
    const content = getPersonalizedContent();
    if (!content) return;

    const totalSections = content.sections.length;
    const newSection = Math.min(activeSection + 1, totalSections - 1);
    const newProgress = Math.round(((newSection + 1) / totalSections) * 100);

    saveProgress(newProgress, newSection, false);
  };

  const handleComplete = async () => {
    await saveProgress(100, activeSection, true);
    router.push("/recruiter/guidance");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          Loading personalized recruitment guidance...
        </div>
      </div>
    );
  }

  const content = getPersonalizedContent();

  if (!content || !content.sections.length) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/recruiter/guidance")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recruitment Hub
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Not Available</AlertTitle>
          <AlertDescription>
            This topic is not available yet. Please check back later or complete
            your profile for personalized content.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/recruiter/guidance")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recruitment Hub
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{content.title}</h1>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              {content.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Difficulty: {content.difficulty}
              </Badge>
              <Badge variant="outline">
                {content.totalEstimatedTime} min read
              </Badge>
              {user?.field && (
                <Badge variant="outline">Personalized for {user.field}</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                toggleBookmarkMutation.mutate({
                  topicId: topic,
                  bookmarked: !bookmarked,
                });
              }}
              disabled={toggleBookmarkMutation.isPending}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      {/* Philosophy Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert className="border-primary/20 bg-primary/5">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Recruiting Philosophy</AlertTitle>
          <AlertDescription>{content.philosophy}</AlertDescription>
        </Alert>
      </motion.div>

      {/* Main Content */}
      <div className="gap-6">
        <div className="space-y-6">
          <Tabs
            value={activeSection.toString()}
            onValueChange={(v) => setActiveSection(parseInt(v))}
          >
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${Math.min(content.sections.length, 4)}, 1fr)`,
              }}
            >
              {content.sections.map((section, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {index <= activeSection && (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {content.sections.map((section, index) => (
              <TabsContent
                key={index}
                value={index.toString()}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {section.title}
                      <Badge variant="outline">
                        {section.estimatedTimeMinutes} min
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {section.content.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                        >
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                          <p className="text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>

                    {index === 0 && user?.field && (
                      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                        <AlertTitle>Personalized Guidance</AlertTitle>
                        <AlertDescription>
                          <p className="mt-2 text-sm">
                            This content has been personalized based on your{" "}
                            {user.field} background
                            {user.specializations?.[0] &&
                              ` and ${user.specializations[0]} specialization`}
                            .
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setActiveSection(Math.max(0, activeSection - 1))
                    }
                    disabled={activeSection === 0}
                  >
                    Previous
                  </Button>

                  {index < content.sections.length - 1 ? (
                    <Button onClick={handleSectionComplete}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete Topic
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
