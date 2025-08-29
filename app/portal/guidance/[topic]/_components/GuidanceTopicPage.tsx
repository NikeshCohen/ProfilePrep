"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  toggleGuidanceBookmark,
  updateGuidanceProgress,
} from "@/actions/guidance.actions";
import { getTopicProgress } from "@/actions/guidance.actions";
import candidateGuidance from "@/constants/guidance/candidate.json";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Download,
  Lightbulb,
  Share2,
  Star,
} from "lucide-react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatCareerStage, formatField } from "@/lib/utils/career-stage";

interface GuidanceTopicPageProps {
  topic: string;
}

interface User {
  field?: string;
  specializations?: string[];
  careerStage?: string;
  guidancePreferences?: Record<string, unknown>;
}

interface SpecializationData {
  label?: string;
  narrative?: string;
  tips?: string[];
  keywords?: string[];
  interviewTips?: string[];
  currentMarket?: {
    outlook?: string;
    salaryRange?: string;
    hotSkills?: string[];
    trends?: string[];
  };
}

interface CareerStageData {
  label?: string;
  strategies?: string[];
  challenges?: string[];
  narrative?: string;
}

interface PersonalizedContent {
  field: Record<string, unknown> | null;
  specialization: SpecializationData | null;
  careerStage: CareerStageData | null;
}

interface GuidanceSection {
  title: string;
  content: Record<string, unknown>;
  personalizedTips?: string[];
  keywords?: string[];
  examples?: string[];
  tips?: string[];
  structure?: string[];
  preparation?: string[];
  strategies?: string[];
  insights?: Record<string, unknown>;
  industryFocus?: string;
  structuralTips?: string[];
  starExamples?: string[];
  questions?: string[];
  mindsetTips?: string[];
}

export function GuidanceTopicPage({ topic }: GuidanceTopicPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [sectionsCompleted, setSectionsCompleted] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  const loadProgress = useCallback(async () => {
    try {
      const result = await getTopicProgress(topic, "CANDIDATE");
      if (result.success && result.data) {
        setProgress(result.data.progress);
        const sections = Array.isArray(result.data.sectionsCompleted)
          ? result.data.sectionsCompleted
          : typeof result.data.sectionsCompleted === "string"
            ? JSON.parse(result.data.sectionsCompleted)
            : [];
        setActiveSection(Math.max(0, sections.length));
        setSectionsCompleted(sections);
        setTimeSpent(result.data.timeSpent);
        setBookmarked(result.data.bookmarked || false);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }, [topic]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserData();
      await loadProgress();
    };

    initializeData();
    setSessionStartTime(new Date());
  }, [topic, loadProgress]);

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

      const result = await updateGuidanceProgress({
        topicId: topic,
        progress: newProgress,
        completed,
        sectionsCompleted: newSectionsCompleted,
        timeSpent: totalTimeSpent,
        bookmarked,
      });

      if (result.success) {
        setProgress(newProgress);
        setActiveSection(section);
        setSectionsCompleted(newSectionsCompleted);
        setTimeSpent(totalTimeSpent);
        setSessionStartTime(new Date()); // Reset session timer
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
      // Fallback to optimistic update
      setProgress(newProgress);
      setActiveSection(section);
    }
  };

  const getPersonalizedContent = (): PersonalizedContent => {
    // This would fetch personalized content based on user's field, specialization, and career stage
    // For now, we'll use the existing guidance data structure

    if (!user?.field) return getDefaultContent();

    const fieldData =
      candidateGuidance.fields[
        user.field as keyof typeof candidateGuidance.fields
      ];
    if (!fieldData) return getDefaultContent();

    const specializationData = user.specializations?.[0]
      ? fieldData.specializations[
          user.specializations[0] as keyof typeof fieldData.specializations
        ]
      : null;

    return {
      field: fieldData,
      specialization: specializationData as SpecializationData | null,
      careerStage: user.careerStage
        ? (candidateGuidance.careerStages[
            user.careerStage as keyof typeof candidateGuidance.careerStages
          ] as CareerStageData)
        : null,
    };
  };

  const getDefaultContent = (): PersonalizedContent => {
    // Default content when no user preferences are available
    return {
      field: null,
      specialization: null,
      careerStage: null,
    };
  };

  const getCareerStageFilteredAdvice = (
    personalizedContent: PersonalizedContent,
  ): string[] => {
    // Filter advice based on career stage appropriateness
    const allTips = personalizedContent.specialization?.tips || [];
    const careerStage = user?.careerStage || "";

    return allTips.filter((tip: string) => {
      // Remove university/student advice for senior professionals
      if (careerStage === "seniorCareer" || careerStage === "midCareer") {
        return (
          !tip.toLowerCase().includes("university") &&
          !tip.toLowerCase().includes("student") &&
          !tip.toLowerCase().includes("degree") &&
          !tip.toLowerCase().includes("club") &&
          !tip.toLowerCase().includes("graduate")
        );
      }

      // For early career, include all advice
      return true;
    });
  };

  const getCareerStageAchievementPhilosophy = (
    personalizedContent: PersonalizedContent,
  ): string => {
    const careerStage = personalizedContent.careerStage?.label || "";
    const fieldLabel = personalizedContent.field?.label || "your field";

    if (careerStage.includes("Early")) {
      return `Early career professionals in ${fieldLabel} should focus on demonstrating learning agility, project contributions, and technical competence. Every achievement should show growth and potential.`;
    } else if (careerStage.includes("Mid")) {
      return `Mid-career ${fieldLabel} professionals must showcase leadership impact, strategic thinking, and measurable business results. Your achievements should reflect increased responsibility and influence.`;
    } else if (careerStage.includes("Senior")) {
      return `Senior ${fieldLabel} leaders should emphasize organizational impact, team development, and strategic vision. Focus on achievements that show how you've shaped culture, direction, and outcomes.`;
    }

    return "Focus on quantifiable achievements that demonstrate your unique value and growth trajectory in your field.";
  };

  const getCareerStageInterviewAdvice = (
    personalizedContent: PersonalizedContent,
  ): string[] => {
    const careerStage = personalizedContent.careerStage?.label || "";
    const fieldLabel = personalizedContent.field?.label || "your field";

    if (careerStage.includes("Early")) {
      return [
        `Show enthusiasm for learning and growth in ${fieldLabel}`,
        "Demonstrate problem-solving process, not just final solutions",
        "Ask thoughtful questions about mentorship and development opportunities",
      ];
    } else if (careerStage.includes("Mid")) {
      return [
        `Discuss how you've evolved technically and strategically in ${fieldLabel}`,
        "Share examples of mentoring others and driving cross-team initiatives",
        "Focus on business impact and stakeholder management",
      ];
    } else if (careerStage.includes("Senior")) {
      return [
        `Emphasize your strategic vision and leadership philosophy in ${fieldLabel}`,
        "Discuss how you've shaped organizational direction and culture",
        "Focus on long-term impact and legacy building",
      ];
    }

    return [
      "Prepare examples that demonstrate your unique value in this field",
    ];
  };

  const getCareerStageNetworkingAdvice = (
    personalizedContent: PersonalizedContent,
  ): string[] => {
    const careerStage = personalizedContent.careerStage?.label || "";
    const fieldLabel = personalizedContent.field?.label || "your field";

    if (careerStage.includes("Early")) {
      return [
        `Seek mentorship from experienced ${fieldLabel} professionals`,
        "Join junior professional groups and emerging leader networks",
        "Attend learning-focused events and workshops",
        "Build relationships with peers at your level for mutual support",
      ];
    } else if (careerStage.includes("Mid")) {
      return [
        `Balance learning from seniors with mentoring juniors in ${fieldLabel}`,
        "Build strategic relationships with cross-functional partners",
        "Participate in industry committees or working groups",
        "Develop relationships with clients, vendors, and external stakeholders",
      ];
    } else if (careerStage.includes("Senior")) {
      return [
        `Focus on thought leadership and industry influence in ${fieldLabel}`,
        "Mentor emerging leaders and shape industry direction",
        "Build relationships with other executives and board members",
        "Engage with academic institutions and industry research",
      ];
    }

    return [
      "Build authentic relationships with people who share your professional interests",
    ];
  };

  const getCareerStageSalaryAdvice = (
    personalizedContent: PersonalizedContent,
  ): string[] => {
    const careerStage = personalizedContent.careerStage?.label || "";
    const fieldLabel = personalizedContent.field?.label || "your field";

    if (careerStage.includes("Early")) {
      return [
        `Focus on skill development and experience over maximum salary in early ${fieldLabel} roles`,
        "Negotiate for learning opportunities, mentorship, and growth potential",
        "Research entry-level ranges thoroughly and aim within market standards",
        "Consider total package including training, benefits, and advancement paths",
      ];
    } else if (careerStage.includes("Mid")) {
      return [
        `Leverage your proven track record and leadership experience in ${fieldLabel}`,
        "Negotiate based on business impact, team leadership, and specialized expertise",
        "Consider equity, promotion timelines, and expanded responsibility",
        "Use market data from multiple sources to support your position",
      ];
    } else if (careerStage.includes("Senior")) {
      return [
        `Emphasize strategic vision, organizational impact, and ${fieldLabel} thought leadership`,
        "Negotiate total compensation packages including equity, benefits, and perks",
        "Consider board positions, advisory roles, and industry influence opportunities",
        "Focus on long-term value creation and succession planning",
      ];
    }

    return [
      "Research your market thoroughly and negotiate based on demonstrated value",
    ];
  };

  const getCareerStageJobSearchAdvice = (
    personalizedContent: PersonalizedContent,
  ): string[] => {
    const careerStage = personalizedContent.careerStage?.label || "";
    const fieldLabel = personalizedContent.field?.label || "your field";

    if (careerStage.includes("Early")) {
      return [
        `Apply broadly to build experience in ${fieldLabel} - volume matters at this stage`,
        "Focus on companies known for good training and mentorship programs",
        "Consider contract or project work to gain diverse experience",
        "Network with recent graduates and early-career professionals for job leads",
      ];
    } else if (careerStage.includes("Mid")) {
      return [
        `Be more selective - target roles that advance your ${fieldLabel} career trajectory`,
        "Leverage your professional network for referrals and insider information",
        "Consider industry transitions or geographic moves for advancement",
        "Focus on roles that offer leadership opportunities and expanded scope",
      ];
    } else if (careerStage.includes("Senior")) {
      return [
        `Most ${fieldLabel} senior roles come through executive search and networking`,
        "Build relationships with executive recruiters in your industry",
        "Consider board positions, advisory roles, and consulting opportunities",
        "Focus on cultural fit and strategic alignment over compensation alone",
      ];
    }

    return [
      "Tailor your approach to your career stage and industry expectations",
    ];
  };

  const getTopicContent = (): {
    title: string;
    icon: string;
    sections: unknown[];
  } => {
    const personalizedContent = getPersonalizedContent();
    const universalGuidance = candidateGuidance.universalGuidance;

    // Map topic to content sections based on JSON structure
    const topicMapping: {
      [key: string]: { title: string; icon: string; sections: unknown[] };
    } = {
      "cv-optimization": {
        title: "CV/Resume Optimization",
        icon: "📄",
        sections: [
          {
            title: `${personalizedContent.specialization?.label || "Professional"} CV Strategy`,
            content: {
              philosophy:
                personalizedContent.specialization?.narrative ||
                universalGuidance?.cvOptimisation?.philosophy ||
                "Your CV is your professional story, tailored to your unique field and expertise.",
              strategies:
                personalizedContent.specialization?.tips ||
                universalGuidance?.cvOptimisation?.strategies ||
                [],
            },
            fieldContext: personalizedContent.field?.description || "",
          },
          {
            title: `Essential ${personalizedContent.field?.label || "Industry"} Keywords`,
            keywords: personalizedContent.specialization?.keywords || [],
            industryFocus: personalizedContent.field?.label || "your industry",
            content: {
              philosophy: `In ${personalizedContent.field?.label || "your field"}, specific technical terms and industry language demonstrate genuine expertise. ${personalizedContent.specialization?.narrative ? "Remember: " + personalizedContent.specialization.narrative.slice(0, 200) + "..." : ""}`,
              strategies: personalizedContent.specialization?.keywords?.length
                ? [
                    `Master these critical ${personalizedContent.specialization?.label || "technical"} terms: ${personalizedContent.specialization.keywords.slice(0, 8).join(", ")}`,
                    `Weave these naturally into your achievements, not just in a skills list`,
                    `Match the exact terminology used in job postings for ATS optimization`,
                  ]
                : [
                    "Research job descriptions in your target roles to identify recurring themes and terminology",
                  ],
            },
          },
          {
            title: `${personalizedContent.careerStage?.label || "Career Stage"} Achievement Focus`,
            content: {
              philosophy:
                getCareerStageAchievementPhilosophy(personalizedContent),
              strategies: getCareerStageFilteredAdvice(
                personalizedContent,
              ).slice(0, 5),
            },
            careerContext: personalizedContent.careerStage?.narrative || "",
          },
        ],
      },
      "cover-letters": {
        title: "Cover Letter Excellence",
        icon: "✉️",
        sections: [
          {
            title: `${personalizedContent.field?.label || "Industry"}-Specific Cover Letter Strategy`,
            content: {
              philosophy:
                personalizedContent.specialization?.narrative ||
                universalGuidance?.coverLetterExcellence?.philosophy ||
                "Your cover letter should demonstrate deep understanding of your field's unique challenges and opportunities.",
              strategies: [
                ...(personalizedContent.specialization?.tips || []).slice(0, 3),
                ...(
                  universalGuidance?.coverLetterExcellence?.structure || []
                ).slice(0, 2),
              ],
            },
            fieldContext: personalizedContent.field?.description || "",
          },
          {
            title: `${personalizedContent.specialization?.label || "Professional"} Storytelling Approach`,
            content: {
              philosophy: `${personalizedContent.field?.label || "Your field"} professionals must demonstrate both technical competence and strategic thinking. Your cover letter should weave these together compellingly.`,
              strategies: [
                `Reference specific ${personalizedContent.field?.label || "industry"} challenges and how your experience addresses them`,
                `Use ${personalizedContent.specialization?.label || "field-specific"} terminology naturally: ${personalizedContent.specialization?.keywords?.slice(0, 5).join(", ") || "relevant technical terms"}`,
                `Demonstrate understanding of current ${personalizedContent.field?.label || "industry"} trends: ${personalizedContent.specialization?.currentMarket?.trends?.[0] || "industry evolution"}`,
                ...(
                  universalGuidance?.coverLetterExcellence?.structure || []
                ).slice(0, 2),
              ],
            },
            interviewInsights:
              personalizedContent.specialization?.interviewTips || [],
          },
        ],
      },
      "interview-prep": {
        title: "Interview Mastery",
        icon: "🎤",
        sections: [
          {
            title: `${personalizedContent.specialization?.label || "Professional"} Interview Mastery`,
            content: {
              philosophy:
                personalizedContent.specialization?.narrative ||
                `Master the art of ${personalizedContent.field?.label || "professional"} interviews by demonstrating both technical expertise and strategic thinking.`,
              strategies:
                personalizedContent.specialization?.interviewTips ||
                universalGuidance?.interviewMastery?.preparation ||
                [],
            },
            fieldContext: personalizedContent.field?.description || "",
            marketContext:
              personalizedContent.specialization?.currentMarket?.outlook || "",
          },
          {
            title: `${personalizedContent.field?.label || "Industry"}-Specific Technical Assessment`,
            content: {
              philosophy: `${personalizedContent.field?.label || "Your field"} interviews focus on specific competencies. ${personalizedContent.specialization?.narrative ? "Remember: " + personalizedContent.specialization.narrative.slice(-150) : ""}`,
              strategies: [
                `Master these core ${personalizedContent.specialization?.label || "technical"} concepts: ${personalizedContent.specialization?.keywords?.slice(0, 6).join(", ") || "relevant technologies"}`,
                ...(personalizedContent.specialization?.interviewTips || []),
                `Stay current with ${personalizedContent.field?.label || "industry"} trends like: ${personalizedContent.specialization?.currentMarket?.hotSkills?.slice(0, 3).join(", ") || "emerging technologies"}`,
              ],
            },
            careerStageAdvice:
              getCareerStageInterviewAdvice(personalizedContent),
          },
        ],
      },
      linkedin: {
        title: "LinkedIn & Professional Presence",
        icon: "💼",
        sections: [
          {
            title: `${personalizedContent.specialization?.label || "Professional"} LinkedIn Optimization`,
            content: {
              philosophy: `Your LinkedIn presence should immediately signal expertise in ${personalizedContent.field?.label || "your field"}. ${personalizedContent.specialization?.narrative ? personalizedContent.specialization.narrative.slice(0, 200) + "..." : ""}`,
              strategies: [
                `Headline: Beyond "${personalizedContent.specialization?.label || "your role"}" - show the value you bring: "${personalizedContent.specialization?.label || "Professional"} driving ${personalizedContent.field?.label || "industry"} innovation"`,
                `Keywords: Weave these naturally throughout: ${personalizedContent.specialization?.keywords?.slice(0, 8).join(", ") || "relevant terms"}`,
                ...(personalizedContent.specialization?.tips?.slice(0, 3) ||
                  []),
                ...(
                  universalGuidance?.linkedinPresence?.strategies || []
                ).slice(0, 3),
              ],
            },
            marketInsights:
              personalizedContent.specialization?.currentMarket || {},
          },
          {
            title: `${personalizedContent.field?.label || "Industry"} Thought Leadership`,
            content: {
              philosophy: `Position yourself as a forward-thinking ${personalizedContent.specialization?.label || "professional"} by sharing insights about ${personalizedContent.field?.label || "your industry"}'s evolution.`,
              strategies: [
                `Share perspectives on ${personalizedContent.field?.label || "industry"} trends: ${personalizedContent.specialization?.currentMarket?.trends?.[0] || "emerging developments"}`,
                `Discuss ${personalizedContent.specialization?.currentMarket?.hotSkills?.slice(0, 3).join(", ") || "key technologies"} and their impact`,
                `Comment intelligently on ${personalizedContent.field?.label || "industry"} challenges and opportunities`,
                ...(
                  universalGuidance?.linkedinPresence?.contentStrategy || []
                ).slice(0, 2),
              ],
            },
          },
        ],
      },
      networking: {
        title: "Networking Naturally",
        icon: "🤝",
        sections: [
          {
            title: `Strategic ${personalizedContent.field?.label || "Professional"} Networking`,
            content: {
              philosophy: `Networking in ${personalizedContent.field?.label || "your field"} requires understanding the unique culture, challenges, and opportunities. ${personalizedContent.specialization?.narrative ? "Your approach: " + personalizedContent.specialization.narrative.slice(-200) : ""}`,
              strategies: [
                `Target ${personalizedContent.field?.label || "industry"}-specific events, meetups, and conferences`,
                `Connect with ${personalizedContent.specialization?.label || "specialized"} professionals who share your interests: ${personalizedContent.specialization?.keywords?.slice(0, 4).join(", ") || "relevant areas"}`,
                `Stay current with ${personalizedContent.field?.label || "industry"} challenges: ${personalizedContent.specialization?.currentMarket?.trends?.[0] || "emerging trends"}`,
                ...(
                  universalGuidance?.networkingNaturally?.strategies || []
                ).slice(0, 3),
              ],
            },
            careerStageGuidance:
              getCareerStageNetworkingAdvice(personalizedContent),
          },
          {
            title: `${personalizedContent.field?.label || "Industry"} Event Strategy`,
            content: {
              philosophy: `${personalizedContent.field?.label || "Professional"} events offer unique opportunities to connect with peers facing similar challenges and exploring similar innovations.`,
              strategies: [
                `Research attendees beforehand—look for ${personalizedContent.specialization?.label || "specialized"} professionals and thought leaders`,
                `Prepare talking points about ${personalizedContent.specialization?.currentMarket?.hotSkills?.slice(0, 3).join(", ") || "current innovations"}`,
                `Ask about their experiences with ${personalizedContent.field?.label || "industry"} challenges and emerging solutions`,
                ...(
                  universalGuidance?.networkingNaturally?.eventNetworking || []
                ).slice(0, 3),
              ],
            },
          },
          {
            title: "Long-term Relationship Building",
            content: {
              philosophy: `Maintain your ${personalizedContent.field?.label || "professional"} network by sharing relevant insights, opportunities, and support.`,
              strategies: [
                `Share ${personalizedContent.field?.label || "industry"}-relevant articles and opportunities`,
                `Celebrate colleagues' achievements in ${personalizedContent.specialization?.label || "your field"}`,
                `Offer expertise in ${personalizedContent.specialization?.keywords?.slice(0, 3).join(", ") || "your areas"} when others face challenges`,
                ...(
                  universalGuidance?.networkingNaturally?.maintenance || []
                ).slice(0, 2),
              ],
            },
          },
        ],
      },
      "career-growth": {
        title: "Career Growth & Branding",
        icon: "📈",
        sections: [
          {
            title: "Strategic Career Planning",
            content: {
              philosophy:
                personalizedContent.careerStage?.narrative ||
                "Strategic career development requires intentional planning and consistent action—understanding where you are, where you want to go, and building the bridges to get there.",
              strategies: personalizedContent.careerStage?.strategies || [
                "Define your unique value proposition and what you want to be known for professionally",
                "Build strategic relationships both within your organisation and across your industry",
                "Invest in skills that align with future market needs, not just current role requirements",
                "Document your achievements and impact regularly to support advancement discussions",
              ],
            },
            careerStage:
              personalizedContent.careerStage?.label || "your current stage",
            challenges: personalizedContent.careerStage?.challenges || [],
          },
          {
            title: "Field-Specific Growth Strategies",
            content: {
              philosophy:
                personalizedContent.field?.description ||
                "Career advancement looks different in every field—understanding your industry's unique pathways is crucial for strategic progression.",
              fieldName: personalizedContent.field?.label || "your field",
              marketOutlook:
                personalizedContent.specialization?.currentMarket?.outlook ||
                "Stay current with industry trends and emerging opportunities in your field.",
              salaryRange:
                personalizedContent.specialization?.currentMarket
                  ?.salaryRange || "Market competitive",
              hotSkills:
                personalizedContent.specialization?.currentMarket?.hotSkills ||
                [],
              trends:
                personalizedContent.specialization?.currentMarket?.trends || [],
            },
          },
          {
            title: "Specialization Development",
            content: {
              philosophy:
                personalizedContent.specialization?.narrative ||
                "Deep specialization combined with strategic breadth creates the most compelling career trajectories.",
              specializationName:
                personalizedContent.specialization?.label ||
                "your specialization",
              developmentTips: personalizedContent.specialization?.tips || [],
              keywords:
                personalizedContent.specialization?.keywords?.slice(0, 10) ||
                [],
            },
            personalizedAdvice:
              getCareerStageFilteredAdvice(personalizedContent),
          },
        ],
      },
      "salary-negotiation": {
        title: "Salary Negotiation Mastery",
        icon: "💰",
        sections: [
          {
            title: `${personalizedContent.field?.label || "Industry"} Compensation Strategy`,
            content: {
              philosophy: `${personalizedContent.field?.label || "Your field"} compensation varies significantly by specialization, location, and company stage. ${personalizedContent.specialization?.narrative ? "Your unique position: " + personalizedContent.specialization.narrative.slice(0, 150) + "..." : ""}`,
              strategies: [
                `Current ${personalizedContent.specialization?.label || "role"} market range: ${personalizedContent.specialization?.currentMarket?.salaryRange || "Research specific salary data"}`,
                `Emphasize high-demand skills: ${personalizedContent.specialization?.currentMarket?.hotSkills?.slice(0, 4).join(", ") || "emerging competencies"}`,
                `Reference ${personalizedContent.field?.label || "industry"} growth trends: ${personalizedContent.specialization?.currentMarket?.trends?.[0] || "market dynamics"}`,
                ...(
                  universalGuidance?.salaryNegotiation?.preparation || []
                ).slice(0, 3),
              ],
            },
            marketData: personalizedContent.specialization?.currentMarket || {},
          },
          {
            title: `${personalizedContent.specialization?.label || "Professional"} Value Articulation`,
            content: {
              philosophy: `Demonstrate your worth by connecting your ${personalizedContent.specialization?.label || "specialized"} expertise to business outcomes and organizational success.`,
              strategies: [
                `Quantify impact using ${personalizedContent.field?.label || "industry"}-relevant metrics`,
                `Highlight expertise in ${personalizedContent.specialization?.keywords?.slice(0, 5).join(", ") || "key areas"}`,
                `Reference ${personalizedContent.specialization?.label || "role"} market scarcity and demand`,
                ...(
                  universalGuidance?.salaryNegotiation?.strategies || []
                ).slice(0, 3),
              ],
            },
            careerStageStrategy:
              getCareerStageSalaryAdvice(personalizedContent),
          },
        ],
      },
      "market-insights": {
        title: "Market Intelligence",
        icon: "📊",
        sections: [
          {
            title: "Industry Analysis",
            content: {
              philosophy: `Understanding your market is crucial for career success in ${personalizedContent.field?.label || "your industry"}.`,
              strategies: [
                "Monitor industry trends and adapt your skills accordingly",
                "Network with industry leaders and thought leaders",
                "Stay informed about technological disruptions affecting your field",
              ],
            },
            insights: personalizedContent.specialization?.currentMarket || {},
          },
        ],
      },
      "job-search-strategy": {
        title: "Job Search Strategy",
        icon: "🔍",
        sections: [
          {
            title: `Strategic ${personalizedContent.field?.label || "Professional"} Job Search`,
            content: {
              philosophy: `Job searching in ${personalizedContent.field?.label || "your field"} requires understanding industry-specific channels, timing, and expectations. ${personalizedContent.specialization?.narrative ? personalizedContent.specialization.narrative.slice(0, 180) + "..." : ""}`,
              strategies: [
                `Target ${personalizedContent.field?.label || "industry"}-specific job boards and platforms`,
                `Leverage ${personalizedContent.specialization?.label || "specialized"} recruiting firms and headhunters`,
                `Highlight expertise in ${personalizedContent.specialization?.currentMarket?.hotSkills?.slice(0, 4).join(", ") || "key technologies"}`,
                `Time applications for ${personalizedContent.field?.label || "industry"} hiring cycles`,
                ...(universalGuidance?.jobSearchStrategy?.tactics || []).slice(
                  0,
                  3,
                ),
              ],
            },
            marketTiming:
              personalizedContent.specialization?.currentMarket || {},
          },
          {
            title: `${personalizedContent.specialization?.label || "Field-Specific"} Application Excellence`,
            content: {
              philosophy: `${personalizedContent.field?.label || "Your industry"} applications must demonstrate both technical competence and cultural fit. Each application should reflect deep understanding of the role and company needs.`,
              strategies: [
                `Customize applications using ${personalizedContent.specialization?.keywords?.slice(0, 6).join(", ") || "relevant terminology"}`,
                `Reference ${personalizedContent.field?.label || "industry"} challenges: ${personalizedContent.specialization?.currentMarket?.trends?.[0] || "current market dynamics"}`,
                `Demonstrate salary awareness: ${personalizedContent.specialization?.currentMarket?.salaryRange || "research market rates"}`,
                "Apply within 48 hours when possible for maximum visibility",
                "Track all applications systematically with contact details and follow-up dates",
                "Send one professional follow-up after 1-2 weeks showing continued interest",
              ],
            },
            careerStageStrategy:
              getCareerStageJobSearchAdvice(personalizedContent),
          },
        ],
      },
    };

    return (
      topicMapping[topic] || {
        title: "Guidance",
        icon: "📚",
        sections: [
          {
            title: "Content Coming Soon",
            content: {
              philosophy: "This guidance topic is being prepared for you.",
              strategies: [
                "Check back soon for comprehensive guidance on this topic",
              ],
            },
          },
        ],
      }
    );
  };

  const handleSectionComplete = () => {
    const content = getTopicContent();
    const totalSections = content.sections.length;
    const newSection = Math.min(activeSection + 1, totalSections - 1);
    const newProgress = Math.round(((newSection + 1) / totalSections) * 100);

    saveProgress(newProgress, newSection, false);
  };

  const handleComplete = async () => {
    await saveProgress(100, activeSection, true);
    router.push("/portal/guidance");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner text="Loading personalised content..." />
      </div>
    );
  }

  const content = getTopicContent();
  const personalizedContent = getPersonalizedContent();

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
          onClick={() => router.push("/portal/guidance")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guidance Hub
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{content.icon}</span>
              <h1 className="text-3xl font-bold">{content.title}</h1>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.field}</Badge>
                {user.specializations?.map((spec) => (
                  <Badge key={spec} variant="outline">
                    {spec}
                  </Badge>
                ))}
                <Badge variant="outline">{user.careerStage}</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const newBookmarked = !bookmarked;
                setBookmarked(newBookmarked);
                try {
                  await toggleGuidanceBookmark(topic, newBookmarked);
                } catch (error) {
                  console.error("Failed to update bookmark:", error);
                  // Revert on error
                  setBookmarked(!newBookmarked);
                }
              }}
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

      {/* Personalized Alert */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="border-primary/20 bg-primary/5">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Personalized for You</AlertTitle>
            <AlertDescription>
              This content has been tailored to your{" "}
              {formatCareerStage(user.careerStage)} career stage in{" "}
              {formatField(user.field)}.
              {personalizedContent.specialization &&
                ` Special focus on ${personalizedContent.specialization.label}.`}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

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
              {content.sections.map((section, index: number) => {
                const typedSection = section as { title: string };
                return (
                  <TabsTrigger key={index} value={index.toString()}>
                    {index <= activeSection && (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    <span className="text-xs">{typedSection.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {content.sections.map((section, index: number) => {
              const typedSection = section as GuidanceSection;
              return (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {typedSection.title}
                          <Badge variant="outline">
                            Section {index + 1} of {content.sections.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {/* Display the actual philosophy content from JSON */}
                          {typedSection.content &&
                            typeof typedSection.content === "object" &&
                            "philosophy" in typedSection.content && (
                              <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                                <h4 className="mb-2 font-semibold text-primary">
                                  Philosophy
                                </h4>
                                <p className="text-sm leading-relaxed">
                                  {String(typedSection.content.philosophy)}
                                </p>
                              </div>
                            )}

                          {/* Display strategies/structure/preparation content */}
                          {typedSection.content &&
                            typeof typedSection.content === "object" && (
                              <div className="space-y-3">
                                {"strategies" in typedSection.content &&
                                  Array.isArray(
                                    typedSection.content.strategies,
                                  ) && (
                                    <div>
                                      <h4 className="mb-3 font-semibold">
                                        Strategic Approaches
                                      </h4>
                                      <div className="space-y-2">
                                        {typedSection.content.strategies.map(
                                          (strategy: unknown, idx: number) => (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                                            >
                                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                                              <p className="text-sm leading-relaxed">
                                                {String(strategy)}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {"structure" in typedSection.content &&
                                  Array.isArray(
                                    typedSection.content.structure,
                                  ) && (
                                    <div>
                                      <h4 className="mb-3 font-semibold">
                                        Structure Guidelines
                                      </h4>
                                      <div className="space-y-2">
                                        {typedSection.content.structure.map(
                                          (item: unknown, idx: number) => (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                                            >
                                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                                              <p className="text-sm leading-relaxed">
                                                {String(item)}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {"preparation" in typedSection.content &&
                                  Array.isArray(
                                    typedSection.content.preparation,
                                  ) && (
                                    <div>
                                      <h4 className="mb-3 font-semibold">
                                        Preparation Steps
                                      </h4>
                                      <div className="space-y-2">
                                        {typedSection.content.preparation.map(
                                          (item: unknown, idx: number) => (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                                            >
                                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                                              <p className="text-sm leading-relaxed">
                                                {String(item)}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* Enhanced rendering for additional content types */}

                          {/* STAR Examples for interview prep */}
                          {"starExamples" in typedSection &&
                            Array.isArray(typedSection.starExamples) &&
                            typedSection.starExamples.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.25 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-amber-600">
                                  STAR Method Examples
                                </h4>
                                <div className="space-y-3">
                                  {typedSection.starExamples.map(
                                    (example: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.1,
                                        }}
                                        className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-opacity-10"
                                      >
                                        <p className="text-sm italic leading-relaxed text-amber-600">
                                          &ldquo;{example}&rdquo;
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {/* Interview questions section */}
                          {"questions" in typedSection &&
                            Array.isArray(typedSection.questions) &&
                            typedSection.questions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-indigo-600">
                                  Common Questions & Approaches
                                </h4>
                                <div className="space-y-2">
                                  {typedSection.questions.map(
                                    (question: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.08,
                                        }}
                                        className="rounded-lg border border-indigo-200 bg-indigo-50 p-3"
                                      >
                                        <p className="text-sm font-medium text-indigo-900">
                                          {question}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {/* Mindset tips section */}
                          {"mindsetTips" in typedSection &&
                            Array.isArray(typedSection.mindsetTips) &&
                            typedSection.mindsetTips.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.35 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-teal-600">
                                  Mindset & Confidence Building
                                </h4>
                                <div className="space-y-2">
                                  {typedSection.mindsetTips.map(
                                    (tip: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.1,
                                        }}
                                        className="flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-opacity-10"
                                      >
                                        <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                                        <p className="text-sm leading-relaxed text-teal-600">
                                          {tip}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {"keywords" in typedSection &&
                            Array.isArray(typedSection.keywords) &&
                            typedSection.keywords.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-primary">
                                  Industry Keywords for{" "}
                                  {typedSection.industryFocus || "your field"}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                  {typedSection.keywords.map(
                                    (keyword: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.05,
                                        }}
                                      >
                                        <Badge
                                          variant="secondary"
                                          className="w-full text-center"
                                        >
                                          {keyword}
                                        </Badge>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {/* Examples section for achievement quantification */}
                          {"examples" in typedSection &&
                            Array.isArray(typedSection.examples) &&
                            typedSection.examples.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-green-600">
                                  Before & After Examples
                                </h4>
                                <div className="space-y-3">
                                  {typedSection.examples.map(
                                    (example: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.1,
                                        }}
                                        className="rounded-r-lg border-l-4 border-green-400 bg-green-50 p-4 dark:bg-opacity-10"
                                      >
                                        <p className="font-mono text-sm leading-relaxed text-green-600">
                                          {example}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {/* Structural tips for formatting */}
                          {"structuralTips" in typedSection &&
                            Array.isArray(typedSection.structuralTips) &&
                            typedSection.structuralTips.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-blue-600">
                                  Structural Excellence
                                </h4>
                                <div className="space-y-3">
                                  {typedSection.structuralTips.map(
                                    (tip: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.08,
                                        }}
                                        className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-opacity-10"
                                      >
                                        <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                        <p className="text-sm leading-relaxed text-blue-600">
                                          {tip}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}

                          {/* Show personalized tips if available */}
                          {"personalizedTips" in typedSection &&
                            Array.isArray(typedSection.personalizedTips) &&
                            typedSection.personalizedTips.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                className="space-y-3"
                              >
                                <h4 className="font-semibold text-purple-600">
                                  Personalised for Your Specialisation
                                </h4>
                                <div className="space-y-2">
                                  {typedSection.personalizedTips.map(
                                    (tip: string, idx: number) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: idx * 0.1,
                                        }}
                                        className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-opacity-10"
                                      >
                                        <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                                        <p className="text-sm leading-relaxed text-purple-600">
                                          {tip}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}
                        </div>

                        {/* Career Stage Specific Content */}
                        {personalizedContent.careerStage && index === 0 && (
                          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertTitle>
                              For {personalizedContent.careerStage.label}
                            </AlertTitle>
                            <AlertDescription>
                              <p className="mt-2 text-sm">
                                This guidance is tailored for professionals in
                                the{" "}
                                {formatCareerStage(
                                  personalizedContent.careerStage?.label,
                                )}{" "}
                                stage.
                              </p>
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex justify-between"
                  >
                    {/* TODO: switch over to dedicated previous and next buttons */}
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
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* TODO: add related resource tools
        <div className="space-y-6">
          Quick Stats
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Sections Completed
                </span>
                <span className="font-semibold">
                  {activeSection} / {content.sections.length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Time Investment
                </span>
                <span className="font-semibold">~30 min</span>
              </div>
            </CardContent>
          </Card>

          Related Resources
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Target className="mr-2 h-4 w-4" />
                Practice Exercises
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Industry Examples
              </Button>
            </CardContent>
          </Card>

          Market Insights
          {personalizedContent.specialization?.currentMarket && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Salary Range
                  </p>
                  <p className="text-sm">
                    {
                      personalizedContent.specialization?.currentMarket
                        ?.salaryRange
                    }
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Hot Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {personalizedContent.specialization?.currentMarket?.hotSkills?.map(
                      (skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        */}
      </div>
    </div>
  );
}
