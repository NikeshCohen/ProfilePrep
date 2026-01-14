"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { type GuidancePreferences } from "@/app/app/onboarding/_components/GuidancePreferencesStep";
import candidateGuidance from "@/data/guidance/candidate-guidance.json";
import recruiterGuidance from "@/data/guidance/recruiter-guidance.json";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  HelpCircle,
  Mail,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import {
  AnimatePresence,
  Variants,
  motion,
  useReducedMotion,
} from "motion/react";
import { toast } from "react-hot-toast";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Spinner } from "@/components/global/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type UserType = "RECRUITER" | "CANDIDATE" | "TESTER";

interface OnboardingData {
  userType: UserType | null;
  field: string | null;
  specializations: string[];
  careerStage?: string | null;
  newsletterSubscribed: boolean;
  guidancePreferences?: Partial<GuidancePreferences>;
  referralSource?: string | null;
}

const STEPS = {
  FIELD_SELECTION: 0,
  SPECIALIZATION: 1,
  GOALS_EXPERIENCE: 2,
  LEARNING_PREFERENCES: 3,
  TOPIC_PRIORITIES: 4,
  PERSONALIZATION: 5,
  GUIDANCE_PREVIEW: 6,
  FEATURES: 7,
  REFERRAL_SOURCE: 8,
  NEWSLETTER: 9,
};

// Guidance preference options
const candidateGoals = [
  { id: "find_job", label: "Find a new job", icon: Target },
  { id: "improve_cv", label: "Improve my CV/Resume", icon: FileText },
  { id: "interview_prep", label: "Prepare for interviews", icon: User },
  {
    id: "salary_negotiation",
    label: "Learn salary negotiation",
    icon: Sparkles,
  },
  { id: "career_change", label: "Change career paths", icon: Briefcase },
  { id: "skill_development", label: "Develop new skills", icon: CheckCircle2 },
];

const recruiterGoals = [
  { id: "improve_sourcing", label: "Improve candidate sourcing", icon: Target },
  { id: "better_screening", label: "Enhance screening process", icon: User },
  { id: "interview_techniques", label: "Master interviewing", icon: FileText },
  { id: "employer_branding", label: "Build employer brand", icon: Sparkles },
  {
    id: "diversity_hiring",
    label: "Improve diversity hiring",
    icon: CheckCircle2,
  },
  {
    id: "market_insights",
    label: "Stay current with market trends",
    icon: Briefcase,
  },
];

const candidateChallenges = [
  "Getting past ATS systems",
  "Standing out from other candidates",
  "Lack of interview opportunities",
  "Salary negotiation confidence",
  "Career direction clarity",
  "Building professional network",
  "Keeping skills up to date",
  "Work-life balance",
];

const recruiterChallenges = [
  "Finding quality candidates",
  "Candidate engagement and response rates",
  "Hiring manager alignment",
  "Time-to-hire optimization",
  "Diversity and inclusion",
  "Competitive talent market",
  "Employer branding",
  "Interview scheduling and coordination",
];

const candidateTopics = [
  {
    id: "cv-optimization",
    label: "CV/Resume Optimization",
    priority: "high" as const,
  },
  { id: "cover-letters", label: "Cover Letters", priority: "medium" as const },
  {
    id: "interview-prep",
    label: "Interview Preparation",
    priority: "high" as const,
  },
  {
    id: "linkedin",
    label: "LinkedIn Optimization",
    priority: "medium" as const,
  },
  {
    id: "networking",
    label: "Professional Networking",
    priority: "medium" as const,
  },
  {
    id: "salary-negotiation",
    label: "Salary Negotiation",
    priority: "high" as const,
  },
  {
    id: "career-growth",
    label: "Career Development",
    priority: "low" as const,
  },
  {
    id: "market-insights",
    label: "Industry Insights",
    priority: "low" as const,
  },
];

const recruiterTopics = [
  { id: "sourcing", label: "Candidate Sourcing", priority: "high" as const },
  { id: "screening", label: "Candidate Screening", priority: "high" as const },
  {
    id: "interviewing",
    label: "Interview Techniques",
    priority: "medium" as const,
  },
  {
    id: "employer-branding",
    label: "Employer Branding",
    priority: "medium" as const,
  },
  { id: "diversity", label: "Diversity Hiring", priority: "medium" as const },
  {
    id: "market-insights",
    label: "Market Intelligence",
    priority: "low" as const,
  },
];

// Animation variants for smooth transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export default function EnhancedOnboarding({
  initialUserType = null,
}: {
  initialUserType?: UserType | null;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.FIELD_SELECTION);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: initialUserType || null,
    field: null,
    specializations: [],
    careerStage: null,
    newsletterSubscribed: false,
    guidancePreferences: {},
    referralSource: null,
  });

  // Fetch user type from database if not provided
  useEffect(() => {
    const fetchUserType = async () => {
      if (!initialUserType) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.user?.userType) {
              setOnboardingData((prev) => ({
                ...prev,
                userType: data.user.userType,
              }));
            }
          }
        } catch {
          console.error("Failed to fetch user type:");
        }
      }
      setIsLoading(false);
    };

    fetchUserType();
  }, [initialUserType]);

  const guidance =
    onboardingData.userType === "CANDIDATE"
      ? candidateGuidance
      : recruiterGuidance;
  const fields = guidance?.fields || {};
  const selectedField = onboardingData.field
    ? (
        fields as Record<
          string,
          {
            label: string;
            description: string;
            specializations: Record<string, unknown>;
          }
        >
      )[onboardingData.field]
    : null;

  const userTypeOptions = [
    {
      type: "RECRUITER" as UserType,
      title: "I'm a Recruiter",
      description: "Transform CVs into professional client-ready documents",
      features: [
        "Generate client-ready CVs",
        "Company templates",
        "Bulk processing",
        "Analytics dashboard",
      ],
      icon: Briefcase,
      route: "/app",
    },
    {
      type: "CANDIDATE" as UserType,
      title: "I'm a Job Seeker",
      description: "Get your foot in the door with AI-powered career guidance",
      features: [
        "CV analysis & scoring",
        "Career guidance & tips",
        "Interview preparation",
        "Cover letter optimization",
      ],
      icon: User,
      route: "/portal",
    },
  ];

  const handleNext = () => {
    if (currentStep === STEPS.FIELD_SELECTION && !onboardingData.field) {
      toast.error("Please select your field");
      return;
    }
    if (
      currentStep === STEPS.SPECIALIZATION &&
      onboardingData.specializations.length === 0
    ) {
      toast.error("Please select at least one specialization");
      return;
    }
    if (
      currentStep === STEPS.GOALS_EXPERIENCE &&
      (!onboardingData.guidancePreferences?.experienceLevel ||
        !onboardingData.guidancePreferences?.primaryGoals?.length)
    ) {
      toast.error("Please complete your goals and experience");
      return;
    }
    if (
      currentStep === STEPS.LEARNING_PREFERENCES &&
      (!onboardingData.guidancePreferences?.learningStyle ||
        !onboardingData.guidancePreferences?.timeCommitment)
    ) {
      toast.error("Please set your learning preferences");
      return;
    }
    if (
      currentStep === STEPS.TOPIC_PRIORITIES &&
      !onboardingData.guidancePreferences?.priorityTopics?.length
    ) {
      toast.error("Please select your priority topics");
      return;
    }
    if (
      currentStep === STEPS.REFERRAL_SOURCE &&
      !onboardingData.referralSource
    ) {
      toast.error("Please let us know how you heard about us");
      return;
    }

    if (currentStep < STEPS.NEWSLETTER) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.FIELD_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...onboardingData,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      const userTypeOption = userTypeOptions.find(
        (opt) => opt.type === onboardingData.userType,
      );

      toast.success(
        "Welcome to ProfilePrep! Your preferences have been saved.",
      );

      setTimeout(() => {
        router.push(userTypeOption?.route || "/app");
      }, 1000);
    } catch {
      toast.error("Failed to save your preferences. Please try again.");
      setIsUpdating(false);
    }
  };

  const toggleSpecialization = (spec: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const updateGuidancePreference = (
    key: keyof GuidancePreferences,
    value: string | number | boolean | string[],
  ) => {
    setOnboardingData((prev) => ({
      ...prev,
      guidancePreferences: {
        ...prev.guidancePreferences,
        [key]: value,
      },
    }));
  };

  const toggleGuidanceArrayItem = (
    key: keyof GuidancePreferences,
    item: string,
  ) => {
    const currentArray =
      (onboardingData.guidancePreferences?.[key] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateGuidancePreference(key, newArray);
  };

  // Get animation props based on user's motion preference
  const getAnimationProps = (
    variants: Variants,
    transition?: Record<string, unknown>,
  ) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };
    }
    return {
      variants,
      initial: "hidden",
      animate: "visible",
      exit: "hidden",
      transition: transition || {},
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.FIELD_SELECTION:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Select Your Field
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                {onboardingData.userType === "CANDIDATE"
                  ? "Which field are you looking for opportunities in?"
                  : "Which field do you recruit for?"}
              </motion.p>
            </motion.div>

            <motion.div
              className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
              {...getAnimationProps(containerVariants)}
            >
              {Object.entries(fields).map(([key, field], index) => {
                const isSelected = onboardingData.field === key;

                return (
                  <motion.div
                    key={key}
                    {...getAnimationProps(cardVariants)}
                    whileHover={shouldReduceMotion ? {} : "hover"}
                    whileTap={shouldReduceMotion ? {} : "tap"}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`cursor-pointer transition-colors duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "hover:bg-primary/2 hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setOnboardingData({
                          ...onboardingData,
                          field: key,
                          specializations: [],
                        })
                      }
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base">
                          {field.label}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25,
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {field.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        );

      case STEPS.SPECIALIZATION:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Select Specializations
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                {onboardingData.userType === "CANDIDATE"
                  ? "Choose the areas you're interested in (select all that apply)"
                  : "Select all the specializations you recruit for"}
              </motion.p>
            </motion.div>

            <AnimatePresence>
              {selectedField && (
                <motion.div
                  className="grid gap-3 md:grid-cols-2"
                  {...getAnimationProps(containerVariants)}
                >
                  {Object.entries(selectedField.specializations).map(
                    ([key, spec], index) => {
                      const isSelected =
                        onboardingData.specializations.includes(key);
                      const specData = spec as {
                        label: string;
                        tips?: string[];
                        sourcing?: string[];
                      };

                      return (
                        <motion.div
                          key={key}
                          {...getAnimationProps(cardVariants)}
                          whileHover={shouldReduceMotion ? {} : "hover"}
                          whileTap={shouldReduceMotion ? {} : "tap"}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            className={`cursor-pointer transition-colors duration-200 ${
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "hover:bg-primary/2 hover:border-primary/50"
                            }`}
                            onClick={() => toggleSpecialization(key)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                  {specData.label}
                                </CardTitle>
                                <motion.div
                                  animate={
                                    isSelected ? { scale: 1.2 } : { scale: 1 }
                                  }
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={() => {}} // Controlled by card click
                                    className="pointer-events-none"
                                  />
                                </motion.div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="line-clamp-2 text-sm text-muted-foreground">
                                {onboardingData.userType === "CANDIDATE"
                                  ? specData.tips?.[0]
                                  : specData.sourcing?.[0]}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    },
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case STEPS.GUIDANCE_PREVIEW:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Your Personalized Guidance
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Here&apos;s a preview of the guidance we&apos;ll provide based
                on your selections
              </motion.p>
            </motion.div>

            <Tabs defaultValue="tips" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tips">Quick Tips</TabsTrigger>
                <TabsTrigger value="keywords">
                  {onboardingData.userType === "CANDIDATE"
                    ? "Keywords"
                    : "Sourcing"}
                </TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
              </TabsList>

              {onboardingData.specializations.map((specKey) => {
                const spec = selectedField?.specializations[specKey] as {
                  label: string;
                  tips?: string[];
                  sourcing?: string[];
                  screening?: string[];
                  interviewTips?: string[];
                  keywords?: string[];
                };
                if (!spec) return null;

                return (
                  <div key={specKey}>
                    <div className="mb-2 mt-4">
                      <Badge variant="outline">{spec.label}</Badge>
                    </div>

                    <TabsContent value="tips" className="space-y-2">
                      {(onboardingData.userType === "CANDIDATE"
                        ? spec.tips
                        : spec.screening
                      )
                        ?.slice(0, 3)
                        .map((tip: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="keywords" className="space-y-2">
                      {onboardingData.userType === "CANDIDATE" ? (
                        <div className="flex flex-wrap gap-2">
                          {spec.keywords?.slice(0, 8).map((keyword: string) => (
                            <Badge key={keyword} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        spec.sourcing
                          ?.slice(0, 3)
                          .map((tip: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <p className="text-sm">{tip}</p>
                            </div>
                          ))
                      )}
                    </TabsContent>

                    <TabsContent value="interview" className="space-y-2">
                      {spec.interviewTips
                        ?.slice(0, 3)
                        .map((tip: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                    </TabsContent>
                  </div>
                );
              })}
            </Tabs>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="h-4 w-4" />
                  Access Your Guidance Anytime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your personalized guidance will always be available through
                  the help icon in your dashboard. We&apos;ll remember your
                  preferences and provide relevant tips throughout your journey.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.GOALS_EXPERIENCE:
        const goals =
          onboardingData.userType === "CANDIDATE"
            ? candidateGoals
            : recruiterGoals;

        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Your Goals & Experience
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                {onboardingData.userType === "CANDIDATE"
                  ? "Help us understand your career journey and what you're looking to achieve"
                  : "Tell us about your recruiting experience and what you want to accomplish"}
              </motion.p>
            </motion.div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Experience Level */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What&apos;s your experience level?
                  </Label>
                  <RadioGroup
                    value={onboardingData.guidancePreferences?.experienceLevel}
                    onValueChange={(value) => {
                      updateGuidancePreference("experienceLevel", value);
                      // Map to career stage for candidates
                      if (onboardingData.userType === "CANDIDATE") {
                        const stageMap: Record<string, string> = {
                          entry: "entry_level",
                          mid: "mid_level",
                          senior: "senior_level",
                          executive: "executive",
                          changing: "career_change",
                        };
                        setOnboardingData((prev) => ({
                          ...prev,
                          careerStage: stageMap[value] || prev.careerStage,
                        }));
                      }
                    }}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entry" id="entry" />
                      <Label htmlFor="entry">Entry Level (0-2 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid" id="mid" />
                      <Label htmlFor="mid">Mid Level (3-7 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior">Senior Level (8+ years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executive" id="executive" />
                      <Label htmlFor="executive">Executive Level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="changing" id="changing" />
                      <Label htmlFor="changing">Changing careers</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Primary Goals */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What are your main goals? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {goals.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = (
                        onboardingData.guidancePreferences?.primaryGoals || []
                      ).includes(goal.id);
                      return (
                        <Card
                          key={goal.id}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() =>
                            toggleGuidanceArrayItem("primaryGoals", goal.id)
                          }
                        >
                          <CardContent className="flex items-center gap-3 p-3">
                            <Icon
                              className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span className="text-sm">{goal.label}</span>
                            {isSelected && (
                              <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Job Search Status for Candidates */}
                {onboardingData.userType === "CANDIDATE" && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Current job search status
                    </Label>
                    <RadioGroup
                      value={
                        onboardingData.guidancePreferences?.jobSearchStatus
                      }
                      onValueChange={(value) =>
                        updateGuidancePreference("jobSearchStatus", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active">Actively looking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="starting_soon"
                          id="starting_soon"
                        />
                        <Label htmlFor="starting_soon">
                          Planning to start soon
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passive" id="passive" />
                        <Label htmlFor="passive">Open to opportunities</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not_looking" id="not_looking" />
                        <Label htmlFor="not_looking">
                          Just improving skills
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.LEARNING_PREFERENCES:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Learning Preferences
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Let&apos;s customize how you like to learn and engage with
                content
              </motion.p>
            </motion.div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Learning Style */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    How do you prefer to learn?
                  </Label>
                  <RadioGroup
                    value={onboardingData.guidancePreferences?.learningStyle}
                    onValueChange={(value) =>
                      updateGuidancePreference("learningStyle", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reading" id="reading" />
                      <Label htmlFor="reading">
                        Reading articles and guides
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interactive" id="interactive" />
                      <Label htmlFor="interactive">Interactive exercises</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video">Video content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="visual" id="visual" />
                      <Label htmlFor="visual">
                        Visual content (infographics, charts)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed">Mix of all formats</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Time Commitment */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    How much time can you dedicate per week? (
                    {onboardingData.guidancePreferences?.timeCommitment || 30}{" "}
                    minutes)
                  </Label>
                  <Slider
                    value={[
                      onboardingData.guidancePreferences?.timeCommitment || 30,
                    ]}
                    onValueChange={([value]) =>
                      updateGuidancePreference("timeCommitment", value)
                    }
                    max={180}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>15 min</span>
                    <span>3 hours</span>
                  </div>
                </div>

                {/* Pace Preference */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Learning pace preference
                  </Label>
                  <RadioGroup
                    value={onboardingData.guidancePreferences?.pacePreference}
                    onValueChange={(value) =>
                      updateGuidancePreference("pacePreference", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self_paced" id="self_paced" />
                      <Label htmlFor="self_paced">
                        Self-paced (learn at my own speed)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="structured" id="structured" />
                      <Label htmlFor="structured">
                        Structured (recommended schedule)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accelerated" id="accelerated" />
                      <Label htmlFor="accelerated">
                        Accelerated (intensive learning)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.TOPIC_PRIORITIES:
        const challenges =
          onboardingData.userType === "CANDIDATE"
            ? candidateChallenges
            : recruiterChallenges;
        const topics =
          onboardingData.userType === "CANDIDATE"
            ? candidateTopics
            : recruiterTopics;

        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Topic Priorities & Challenges
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Help us understand what you&apos;d like to focus on first
              </motion.p>
            </motion.div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Current Challenges */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What challenges are you currently facing? (Select all that
                    apply)
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {challenges.map((challenge, index) => {
                      const isSelected = (
                        onboardingData.guidancePreferences?.currentChallenges ||
                        []
                      ).includes(challenge);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`challenge-${index}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              toggleGuidanceArrayItem(
                                "currentChallenges",
                                challenge,
                              )
                            }
                          />
                          <Label
                            htmlFor={`challenge-${index}`}
                            className="text-sm"
                          >
                            {challenge}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Topics */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Which topics are most important to you right now?
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {topics.map((topic) => {
                      const isSelected = (
                        onboardingData.guidancePreferences?.priorityTopics || []
                      ).includes(topic.id);
                      const isUrgent = (
                        onboardingData.guidancePreferences?.urgentNeeds || []
                      ).includes(topic.id);
                      return (
                        <div key={topic.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`topic-${topic.id}`}
                                checked={isSelected}
                                onCheckedChange={() =>
                                  toggleGuidanceArrayItem(
                                    "priorityTopics",
                                    topic.id,
                                  )
                                }
                              />
                              <Label
                                htmlFor={`topic-${topic.id}`}
                                className="text-sm"
                              >
                                {topic.label}
                              </Label>
                              <Badge
                                variant={
                                  topic.priority === "high"
                                    ? "destructive"
                                    : topic.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {topic.priority}
                              </Badge>
                            </div>
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`urgent-${topic.id}`}
                                  checked={isUrgent}
                                  onCheckedChange={() =>
                                    toggleGuidanceArrayItem(
                                      "urgentNeeds",
                                      topic.id,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`urgent-${topic.id}`}
                                  className="text-xs text-muted-foreground"
                                >
                                  Urgent
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.PERSONALIZATION:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Personalization & Preferences
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Final touches to customize your experience just the way you like
                it
              </motion.p>
            </motion.div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reminders"
                      checked={
                        onboardingData.guidancePreferences?.reminders || false
                      }
                      onCheckedChange={(checked) =>
                        updateGuidancePreference("reminders", checked)
                      }
                    />
                    <Label htmlFor="reminders" className="text-sm">
                      Send me gentle reminders to continue learning
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="progress-sharing"
                      checked={
                        onboardingData.guidancePreferences?.progressSharing ||
                        false
                      }
                      onCheckedChange={(checked) =>
                        updateGuidancePreference("progressSharing", checked)
                      }
                    />
                    <Label htmlFor="progress-sharing" className="text-sm">
                      Share my progress achievements (anonymously) to inspire
                      others
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentorship"
                      checked={
                        onboardingData.guidancePreferences
                          ?.mentorshipInterest || false
                      }
                      onCheckedChange={(checked) =>
                        updateGuidancePreference("mentorshipInterest", checked)
                      }
                    />
                    <Label htmlFor="mentorship" className="text-sm">
                      I&apos;m interested in mentorship opportunities (when
                      available)
                    </Label>
                  </div>
                </div>

                {/* Additional Context */}
                <div className="space-y-3">
                  <Label
                    htmlFor="specific-challenges"
                    className="text-base font-medium"
                  >
                    Any specific challenges or goals we should know about?
                    (Optional)
                  </Label>
                  <Textarea
                    id="specific-challenges"
                    placeholder="e.g., I'm targeting roles at tech startups, struggling with technical interviews, looking to switch to remote work..."
                    value={
                      onboardingData.guidancePreferences?.specificChallenges ||
                      ""
                    }
                    onChange={(e) =>
                      updateGuidancePreference(
                        "specificChallenges",
                        e.target.value,
                      )
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      Your preferences matter!
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We&apos;ll use this information to personalize your
                      guidance experience. You can always update these
                      preferences in your settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.FEATURES:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                {onboardingData.userType === "CANDIDATE"
                  ? "AI-Powered Career Tools"
                  : "Advanced Recruiting Features"}
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                {onboardingData.userType === "CANDIDATE"
                  ? "Get your foot in the door with our comprehensive toolkit"
                  : "Streamline your recruiting process with AI assistance"}
              </motion.p>
            </motion.div>

            {onboardingData.userType === "CANDIDATE" ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      CV & Cover Letter Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Our AI-powered analyzer helps you optimize your
                      application materials for any job posting.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        ATS compatibility scoring
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Keyword optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Personalized improvement tips
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Interview Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Prepare for interviews with personalized tips based on
                      your profile and the roles you&apos;re targeting.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Role-specific question banks
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        STAR method coaching
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Mock interview practice
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/*
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <CardHeader>
                    <CardTitle className="text-base">Affordable AI Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We use a pay-per-use model to keep our AI tools as affordable as
                      possible for job seekers. You only pay for what you use, making
                      professional career tools accessible to everyone.
                    </p>
                  </CardContent>
                </Card>
                */}
              </div>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      CV Generation & Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Transform candidate information into professional,
                      client-ready CVs using your company templates.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Custom company templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Bulk CV processing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Consistent formatting
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Sourcing & Screening Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Get field-specific guidance on sourcing, screening, and
                      interviewing candidates effectively.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Best sourcing channels by role
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Red flags to watch for
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Interview question banks
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        );

      case STEPS.REFERRAL_SOURCE:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                How did you hear about us?
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Help us understand which channels are most effective
              </motion.p>
            </motion.div>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <RadioGroup
                  value={onboardingData.referralSource || ""}
                  onValueChange={(value) =>
                    setOnboardingData({
                      ...onboardingData,
                      referralSource: value,
                    })
                  }
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="google" id="google" />
                      <Label htmlFor="google" className="cursor-pointer">
                        Google/Search Engine
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="linkedin" id="linkedin" />
                      <Label htmlFor="linkedin" className="cursor-pointer">
                        LinkedIn
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="twitter" id="twitter" />
                      <Label htmlFor="twitter" className="cursor-pointer">
                        Twitter/X
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="facebook" id="facebook" />
                      <Label htmlFor="facebook" className="cursor-pointer">
                        Facebook
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="friend" id="friend" />
                      <Label htmlFor="friend" className="cursor-pointer">
                        Friend/Colleague Referral
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="hyperiondev" id="hyperiondev" />
                      <Label htmlFor="hyperiondev" className="cursor-pointer">
                        HyperionDev
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="producthunt" id="producthunt" />
                      <Label htmlFor="producthunt" className="cursor-pointer">
                        Product Hunt
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="newsletter" id="newsletter-ref" />
                      <Label
                        htmlFor="newsletter-ref"
                        className="cursor-pointer"
                      >
                        Newsletter/Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="blog" id="blog" />
                      <Label htmlFor="blog" className="cursor-pointer">
                        Blog/Article
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Why we ask this</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This helps us understand which channels are most effective
                      at reaching people who could benefit from our platform.
                      Your response helps us focus our efforts on the right
                      places.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case STEPS.NEWSLETTER:
        return (
          <motion.div
            className="space-y-6"
            {...getAnimationProps(containerVariants)}
          >
            <motion.div
              className="text-center"
              {...getAnimationProps(itemVariants)}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold"
                {...getAnimationProps(itemVariants)}
              >
                Stay Connected
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                {...getAnimationProps(itemVariants)}
              >
                Let us follow your journey and celebrate your successes
              </motion.p>
            </motion.div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Weekly Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;re genuinely excited to see everyone succeed and would
                  be elated if our platform could have a helping hand in driving
                  that forward.
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    What you&apos;ll receive:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {onboardingData.userType === "CANDIDATE"
                          ? "Job market insights and opportunities in your field"
                          : "Recruiting trends and best practices for your specializations"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Success stories from our community</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>New features and platform updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Exclusive tips and resources</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={onboardingData.newsletterSubscribed}
                    onCheckedChange={(checked) =>
                      setOnboardingData({
                        ...onboardingData,
                        newsletterSubscribed: checked as boolean,
                      })
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="newsletter" className="cursor-pointer">
                      Yes, I&apos;d like to receive the weekly newsletter
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <p className="text-center text-sm">
                  We&apos;re curious about your journey and genuinely want to
                  check in on how things are going. Your success is what drives
                  us forward!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-4xl flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-8">
            <Spinner />
          </div>
          <p className="text-lg text-muted-foreground">
            Loading your profile...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!onboardingData.userType) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-4xl flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 p-3">
            <HelpCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold">Setup Required</h2>
          <p className="max-w-md text-muted-foreground">
            Please complete the initial setup to access the enhanced onboarding
            flow.
          </p>
          <Button
            onClick={() => router.push("/app/onboarding")}
            className="mt-4"
          >
            Complete Setup
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fixed Progress Indicator - positioned below header */}
      <motion.div
        className="fixed left-0 right-0 top-16 z-40 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center space-x-2">
            {Object.values(STEPS).map((step, index) => (
              <motion.div
                key={step}
                className={`h-2 w-16 rounded-full ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Container with padding for fixed header and progress bar */}
      <div className="mx-auto max-w-4xl px-4 pb-8 pt-32">
        {/* Main Content with Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          className="mt-8 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <BackButton
            onClick={handleBack}
            disabled={currentStep === STEPS.FIELD_SELECTION}
          />

          {currentStep === STEPS.NEWSLETTER ? (
            <NextButton
              onClick={handleComplete}
              disabled={isUpdating}
              label={isUpdating ? "Setting up..." : "Get Started"}
            />
          ) : (
            <NextButton onClick={handleNext} label="Next" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
