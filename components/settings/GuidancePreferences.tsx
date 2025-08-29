"use client";

import { useEffect, useState } from "react";

import { BookOpen, Save } from "lucide-react";
import { toast } from "react-hot-toast";

import { Spinner } from "@/components/global/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface GuidancePreferences {
  experienceLevel?: string;
  learningStyle?: string;
  pacePreference?: string;
  timeCommitment?: string;
  priorityTopics?: string[];
  currentChallenges?: string[];
  primaryGoals?: string[];
  preferredContentType?: string[];
}

interface GuidancePreferencesProps {
  userType: "CANDIDATE" | "RECRUITER";
  currentPreferences?: GuidancePreferences;
  onSave?: (preferences: GuidancePreferences) => Promise<void>;
}

export function GuidancePreferences({
  userType,
  currentPreferences = {},
  onSave,
}: GuidancePreferencesProps) {
  const [preferences, setPreferences] =
    useState<GuidancePreferences>(currentPreferences);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreferences(currentPreferences);
  }, [currentPreferences]);

  const handleSave = async () => {
    if (!onSave) return;

    setLoading(true);
    try {
      await onSave(preferences);
      toast.success("Preferences saved successfully!");
    } catch {
      toast.error("Error saving preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof GuidancePreferences, value: unknown) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayItem = (key: keyof GuidancePreferences, item: string) => {
    setPreferences((prev) => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];

      return {
        ...prev,
        [key]: newArray,
      };
    });
  };

  const candidateTopics = [
    { id: "cv_optimization", label: "CV/Resume Optimization" },
    { id: "interview_prep", label: "Interview Preparation" },
    { id: "linkedin_presence", label: "LinkedIn & Professional Presence" },
    { id: "networking", label: "Networking & Outreach" },
    { id: "salary_negotiation", label: "Salary Negotiation" },
    { id: "career_growth", label: "Career Growth & Branding" },
    { id: "market_insights", label: "Market Insights" },
  ];

  const recruiterTopics = [
    { id: "sourcing", label: "Strategic Sourcing" },
    { id: "screening", label: "Candidate Assessment" },
    { id: "market_insights", label: "Market Intelligence" },
    { id: "employer_branding", label: "Employer Branding" },
    { id: "interview_skills", label: "Interview Techniques" },
    { id: "negotiation", label: "Offer Negotiation" },
  ];

  const candidateChallenges = [
    { id: "ats_optimization", label: "ATS Optimization" },
    { id: "interview_confidence", label: "Interview Confidence" },
    { id: "career_transition", label: "Career Transition" },
    { id: "skill_assessment", label: "Skills Assessment" },
    { id: "industry_knowledge", label: "Industry Knowledge" },
    { id: "networking_skills", label: "Networking Skills" },
  ];

  const recruiterChallenges = [
    { id: "candidate_assessment", label: "Candidate Assessment" },
    { id: "sourcing_quality", label: "Sourcing Quality Candidates" },
    { id: "client_management", label: "Client Management" },
    { id: "market_knowledge", label: "Market Knowledge" },
    { id: "time_management", label: "Time Management" },
    { id: "skill_assessment", label: "Technical Skills Assessment" },
  ];

  const candidateGoals = [
    { id: "job_search", label: "Active Job Search" },
    { id: "career_advancement", label: "Career Advancement" },
    { id: "skill_development", label: "Skill Development" },
    { id: "industry_switch", label: "Industry Switch" },
    { id: "salary_increase", label: "Salary Increase" },
    { id: "leadership_role", label: "Leadership Role" },
  ];

  const recruiterGoals = [
    { id: "placement_success", label: "Improve Placement Success" },
    { id: "client_satisfaction", label: "Client Satisfaction" },
    { id: "market_analysis", label: "Market Analysis Skills" },
    { id: "team_leadership", label: "Team Leadership" },
    { id: "business_development", label: "Business Development" },
    { id: "specialization", label: "Industry Specialization" },
  ];

  const topics = userType === "CANDIDATE" ? candidateTopics : recruiterTopics;
  const challenges =
    userType === "CANDIDATE" ? candidateChallenges : recruiterChallenges;
  const goals = userType === "CANDIDATE" ? candidateGoals : recruiterGoals;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle>Guidance Preferences</CardTitle>
        </div>
        <CardDescription>
          Personalise your guidance experience to match your learning style and
          goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={preferences.experienceLevel || ""}
            onValueChange={(value) =>
              updatePreference("experienceLevel", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
              <SelectItem value="intermediate">
                Intermediate (3-7 years)
              </SelectItem>
              <SelectItem value="advanced">Advanced (8+ years)</SelectItem>
              <SelectItem value="expert">
                Expert/Leadership (15+ years)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Learning Style */}
        <div className="space-y-2">
          <Label>Learning Style</Label>
          <Select
            value={preferences.learningStyle || ""}
            onValueChange={(value) => updatePreference("learningStyle", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How do you prefer to learn?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">
                Visual (examples, templates, diagrams)
              </SelectItem>
              <SelectItem value="interactive">
                Interactive (step-by-step guidance)
              </SelectItem>
              <SelectItem value="comprehensive">
                Comprehensive (detailed explanations)
              </SelectItem>
              <SelectItem value="practical">
                Practical (actionable tips only)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pace Preference */}
        <div className="space-y-2">
          <Label>Pace Preference</Label>
          <Select
            value={preferences.pacePreference || ""}
            onValueChange={(value) => updatePreference("pacePreference", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="What's your preferred learning pace?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quick">
                Quick Overview (key points only)
              </SelectItem>
              <SelectItem value="moderate">
                Moderate (balanced detail)
              </SelectItem>
              <SelectItem value="thorough">
                Thorough (comprehensive coverage)
              </SelectItem>
              <SelectItem value="structured">
                Structured (step-by-step process)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Commitment */}
        <div className="space-y-2">
          <Label>Time Commitment</Label>
          <Select
            value={preferences.timeCommitment || ""}
            onValueChange={(value) => updatePreference("timeCommitment", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How much time can you dedicate?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal (5-10 minutes)</SelectItem>
              <SelectItem value="moderate">Moderate (15-30 minutes)</SelectItem>
              <SelectItem value="substantial">
                Substantial (45-60 minutes)
              </SelectItem>
              <SelectItem value="intensive">Intensive (90+ minutes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Priority Topics */}
        <div className="space-y-3">
          <Label>Priority Topics (select up to 3)</Label>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-2">
                <Checkbox
                  id={topic.id}
                  checked={(preferences.priorityTopics || []).includes(
                    topic.id,
                  )}
                  onCheckedChange={() =>
                    toggleArrayItem("priorityTopics", topic.id)
                  }
                  disabled={
                    (preferences.priorityTopics || []).length >= 3 &&
                    !(preferences.priorityTopics || []).includes(topic.id)
                  }
                />
                <Label htmlFor={topic.id} className="text-sm">
                  {topic.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Current Challenges */}
        <div className="space-y-3">
          <Label>Current Challenges (select any that apply)</Label>
          <div className="grid grid-cols-2 gap-2">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge.id}
                  checked={(preferences.currentChallenges || []).includes(
                    challenge.id,
                  )}
                  onCheckedChange={() =>
                    toggleArrayItem("currentChallenges", challenge.id)
                  }
                />
                <Label htmlFor={challenge.id} className="text-sm">
                  {challenge.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Primary Goals */}
        <div className="space-y-3">
          <Label>Primary Goals (select up to 3)</Label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.id}
                  checked={(preferences.primaryGoals || []).includes(goal.id)}
                  onCheckedChange={() =>
                    toggleArrayItem("primaryGoals", goal.id)
                  }
                  disabled={
                    (preferences.primaryGoals || []).length >= 3 &&
                    !(preferences.primaryGoals || []).includes(goal.id)
                  }
                />
                <Label htmlFor={goal.id} className="text-sm">
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading && (
              <div className="mr-2 h-4 w-4">
                <Spinner />
              </div>
            )}
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
