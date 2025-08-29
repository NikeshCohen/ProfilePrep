"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export interface GuidancePreferences {
  // Experience and Goals
  experienceLevel: "entry" | "mid" | "senior" | "executive" | "changing";
  primaryGoals: string[];
  currentChallenges: string[];
  jobSearchStatus?: "active" | "passive" | "not_looking" | "starting_soon";

  // Learning Preferences
  learningStyle: "visual" | "reading" | "interactive" | "video" | "mixed";
  timeCommitment: number; // minutes per week
  pacePreference: "self_paced" | "structured" | "accelerated";

  // Topic Priorities
  priorityTopics: string[];
  urgentNeeds: string[];

  // Preferences
  reminders: boolean;
  progressSharing: boolean;
  mentorshipInterest: boolean;

  // Additional Context
  specificChallenges?: string;
  additionalInfo?: string;
}

interface GuidancePreferencesStepProps {
  userType: "CANDIDATE" | "RECRUITER";
  field: string;
  preferences: Partial<GuidancePreferences>;
  onPreferencesChange: (preferences: Partial<GuidancePreferences>) => void;
  onNext: () => void;
  onBack: () => void;
}

const candidateGoals = [
  { id: "find_job", label: "Find a new job", icon: Target },
  { id: "improve_cv", label: "Improve my CV/Resume", icon: BookOpen },
  { id: "interview_prep", label: "Prepare for interviews", icon: Users },
  {
    id: "salary_negotiation",
    label: "Learn salary negotiation",
    icon: TrendingUp,
  },
  { id: "career_change", label: "Change career paths", icon: Briefcase },
  { id: "skill_development", label: "Develop new skills", icon: CheckCircle2 },
];

const recruiterGoals = [
  { id: "improve_sourcing", label: "Improve candidate sourcing", icon: Target },
  { id: "better_screening", label: "Enhance screening process", icon: Users },
  { id: "interview_techniques", label: "Master interviewing", icon: BookOpen },
  { id: "employer_branding", label: "Build employer brand", icon: TrendingUp },
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
  { id: "cv-optimization", label: "CV/Resume Optimization", priority: "high" },
  { id: "cover-letters", label: "Cover Letters", priority: "medium" },
  { id: "interview-prep", label: "Interview Preparation", priority: "high" },
  { id: "linkedin", label: "LinkedIn Optimization", priority: "medium" },
  { id: "networking", label: "Professional Networking", priority: "medium" },
  { id: "salary-negotiation", label: "Salary Negotiation", priority: "high" },
  { id: "career-growth", label: "Career Development", priority: "low" },
  { id: "market-insights", label: "Industry Insights", priority: "low" },
];

const recruiterTopics = [
  { id: "sourcing", label: "Candidate Sourcing", priority: "high" },
  { id: "screening", label: "Candidate Screening", priority: "high" },
  { id: "interviewing", label: "Interview Techniques", priority: "medium" },
  { id: "employer-branding", label: "Employer Branding", priority: "medium" },
  { id: "diversity", label: "Diversity Hiring", priority: "medium" },
  { id: "market-insights", label: "Market Intelligence", priority: "low" },
];

export function GuidancePreferencesStep({
  userType,
  preferences,
  onPreferencesChange,
  onNext,
  onBack,
}: GuidancePreferencesStepProps) {
  const goals = userType === "CANDIDATE" ? candidateGoals : recruiterGoals;
  const challenges =
    userType === "CANDIDATE" ? candidateChallenges : recruiterChallenges;
  const topics = userType === "CANDIDATE" ? candidateTopics : recruiterTopics;

  const updatePreference = (
    key: keyof GuidancePreferences,
    value: string | number | boolean | string[],
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  const toggleArrayItem = (key: keyof GuidancePreferences, item: string) => {
    const currentArray = (preferences[key] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updatePreference(key, newArray);
  };

  const sections = [
    {
      title: "Your Goals & Experience",
      description: "Help us understand what you're looking to achieve",
      content: (
        <div className="space-y-6">
          {/* Experience Level */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              What&apos;s your experience level?
            </Label>
            <RadioGroup
              value={preferences.experienceLevel}
              onValueChange={(value) =>
                updatePreference("experienceLevel", value)
              }
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
                const isSelected = (preferences.primaryGoals || []).includes(
                  goal.id,
                );
                return (
                  <Card
                    key={goal.id}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleArrayItem("primaryGoals", goal.id)}
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

          {userType === "CANDIDATE" && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Current job search status
              </Label>
              <RadioGroup
                value={preferences.jobSearchStatus}
                onValueChange={(value) =>
                  updatePreference("jobSearchStatus", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Actively looking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="starting_soon" id="starting_soon" />
                  <Label htmlFor="starting_soon">Planning to start soon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passive" id="passive" />
                  <Label htmlFor="passive">Open to opportunities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_looking" id="not_looking" />
                  <Label htmlFor="not_looking">Just improving skills</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Learning Preferences",
      description: "How do you like to learn and engage with content?",
      content: (
        <div className="space-y-6">
          {/* Learning Style */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How do you prefer to learn?
            </Label>
            <RadioGroup
              value={preferences.learningStyle}
              onValueChange={(value) =>
                updatePreference("learningStyle", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reading" id="reading" />
                <Label htmlFor="reading">Reading articles and guides</Label>
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
              {preferences.timeCommitment || 30} minutes)
            </Label>
            <Slider
              value={[preferences.timeCommitment || 30]}
              onValueChange={([value]) =>
                updatePreference("timeCommitment", value)
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
              value={preferences.pacePreference}
              onValueChange={(value) =>
                updatePreference("pacePreference", value)
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
        </div>
      ),
    },
    {
      title: "Topic Priorities & Challenges",
      description: "What would you like to focus on first?",
      content: (
        <div className="space-y-6">
          {/* Current Challenges */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              What challenges are you currently facing? (Select all that apply)
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {challenges.map((challenge, index) => {
                const isSelected = (
                  preferences.currentChallenges || []
                ).includes(challenge);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`challenge-${index}`}
                      checked={isSelected}
                      onCheckedChange={() =>
                        toggleArrayItem("currentChallenges", challenge)
                      }
                    />
                    <Label htmlFor={`challenge-${index}`} className="text-sm">
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
                const isSelected = (preferences.priorityTopics || []).includes(
                  topic.id,
                );
                const isUrgent = (preferences.urgentNeeds || []).includes(
                  topic.id,
                );
                return (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`topic-${topic.id}`}
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleArrayItem("priorityTopics", topic.id)
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
                              toggleArrayItem("urgentNeeds", topic.id)
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
        </div>
      ),
    },
    {
      title: "Personalization & Preferences",
      description: "Final touches to customize your experience",
      content: (
        <div className="space-y-6">
          {/* Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminders"
                checked={preferences.reminders || false}
                onCheckedChange={(checked) =>
                  updatePreference("reminders", checked)
                }
              />
              <Label htmlFor="reminders" className="text-sm">
                Send me gentle reminders to continue learning
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="progress-sharing"
                checked={preferences.progressSharing || false}
                onCheckedChange={(checked) =>
                  updatePreference("progressSharing", checked)
                }
              />
              <Label htmlFor="progress-sharing" className="text-sm">
                Share my progress achievements (anonymously) to inspire others
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mentorship"
                checked={preferences.mentorshipInterest || false}
                onCheckedChange={(checked) =>
                  updatePreference("mentorshipInterest", checked)
                }
              />
              <Label htmlFor="mentorship" className="text-sm">
                I&apos;m interested in mentorship opportunities (when available)
              </Label>
            </div>
          </div>

          {/* Additional Context */}
          <div className="space-y-3">
            <Label
              htmlFor="specific-challenges"
              className="text-base font-medium"
            >
              Any specific challenges or goals we should know about? (Optional)
            </Label>
            <Textarea
              id="specific-challenges"
              placeholder="e.g., I'm targeting roles at tech startups, struggling with technical interviews, looking to switch to remote work..."
              value={preferences.specificChallenges || ""}
              onChange={(e) =>
                updatePreference("specificChallenges", e.target.value)
              }
              rows={3}
            />
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Your preferences matter!
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We&apos;ll use this information to personalize your guidance
                    experience. You can always update these preferences in your
                    settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  // Validate all sections at once
  const isComplete = () => {
    return (
      // Section 1 validation
      preferences.experienceLevel &&
      (preferences.primaryGoals?.length || 0) > 0 &&
      // Section 2 validation
      preferences.learningStyle &&
      preferences.timeCommitment &&
      // Section 3 validation
      (preferences.priorityTopics?.length || 0) > 0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold">Guidance Preferences</h2>
        <p className="text-muted-foreground">
          Let&apos;s personalize your experience with a few quick questions
        </p>
      </div>

      {/* All sections as a single scrollable form */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isComplete()}>
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
