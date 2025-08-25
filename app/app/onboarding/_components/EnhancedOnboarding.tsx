"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import candidateGuidance from "@/data/guidance/candidate-guidance.json";
import recruiterGuidance from "@/data/guidance/recruiter-guidance.json";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  HelpCircle,
  Loader2,
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserType = "RECRUITER" | "CANDIDATE" | "TESTER";

interface OnboardingData {
  userType: UserType | null;
  field: string | null;
  specializations: string[];
  careerStage?: string | null;
  newsletterSubscribed: boolean;
}

const STEPS = {
  FIELD_SELECTION: 0,
  SPECIALIZATION: 1,
  GUIDANCE_PREVIEW: 2,
  FEATURES: 3,
  NEWSLETTER: 4,
};

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

            <AnimatePresence>
              {onboardingData.userType === "CANDIDATE" && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Label htmlFor="career-stage">Career Stage (Optional)</Label>
                  <Select
                    value={onboardingData.careerStage || ""}
                    onValueChange={(value) =>
                      setOnboardingData({
                        ...onboardingData,
                        careerStage: value,
                      })
                    }
                  >
                    <SelectTrigger id="career-stage" className="mt-2">
                      <SelectValue placeholder="Select your career stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(candidateGuidance.careerStages).map(
                        ([key, stage]) => (
                          <SelectItem key={key} value={key}>
                            {stage.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Progress Indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>

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
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === STEPS.FIELD_SELECTION}
            className="transition-all duration-200"
          >
            <motion.div
              className="flex items-center"
              initial={false}
              animate={
                currentStep === STEPS.FIELD_SELECTION
                  ? { opacity: 0.5 }
                  : { opacity: 1 }
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        >
          {currentStep === STEPS.NEWSLETTER ? (
            <Button
              onClick={handleComplete}
              disabled={isUpdating}
              className="transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {isUpdating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="transition-all duration-200"
            >
              <div className="flex items-center">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
