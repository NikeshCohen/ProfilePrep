"use client";

import { useState } from "react";

import dynamic from "next/dynamic";

import { ArrowRight, Briefcase, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ClientConfetti = dynamic(() => import("./OnboardingConfetti"), {
  ssr: false,
});
const EnhancedOnboarding = dynamic(() => import("./EnhancedOnboarding"), {
  ssr: false,
});

type UserType = "RECRUITER" | "CANDIDATE";

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    type: "RECRUITER",
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
    type: "CANDIDATE",
    title: "I'm a Job Seeker",
    description: "Get your foot in the door with AI-powered career guidance",
    features: [
      "CV analysis & scoring",
      "Career guidance & tips",
      "Interview preparation",
      "ATS & Cover letter optimisation",
    ],
    icon: User,
    route: "/portal",
  },
];

export function OnboardingBackground() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEnhancedOnboarding, setShowEnhancedOnboarding] = useState(false);

  const handleContinue = async () => {
    if (!selectedType) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/update-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: selectedType }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user type");
      }

      // Move to enhanced onboarding instead of redirecting
      setShowEnhancedOnboarding(true);
      setIsUpdating(false);
    } catch {
      setIsUpdating(false);
    }
  };

  // Show enhanced onboarding after user type selection
  if (showEnhancedOnboarding && selectedType) {
    return <EnhancedOnboarding initialUserType={selectedType} />;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
      <ClientConfetti />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to Profile<span className="font-bold text-primary">Prep</span>
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Let&apos;s customize your experience. What brings you here?
        </p>
      </div>

      <div className="mb-8 grid w-full max-w-3xl gap-6 md:grid-cols-2">
        {userTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.type;

          return (
            <Card
              key={option.type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedType(option.type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex">
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    {isSelected && (
                      <span>
                        <Badge variant="secondary">Selected</Badge>
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedType || isUpdating}
        size="lg"
        className="px-8"
      >
        {isUpdating ? (
          "Setting up your account..."
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
