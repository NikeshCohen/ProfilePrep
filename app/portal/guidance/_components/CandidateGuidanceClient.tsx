"use client";

import { useEffect, useState } from "react";

import candidateGuidance from "@/data/guidance/candidate-guidance.json";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  FileText,
  Lightbulb,
  MessageSquare,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  field?: string;
  specializations?: string[];
  careerStage?: string;
}

interface SpecializationData {
  label: string;
  tips?: string[];
  keywords?: string[];
  interviewTips?: string[];
}

export function CandidateGuidanceClient() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          if (userData.user.specializations?.[0]) {
            setSelectedSpecialization(userData.user.specializations[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  const getFieldData = () => {
    if (!user?.field) return null;
    return candidateGuidance.fields[
      user.field as keyof typeof candidateGuidance.fields
    ];
  };

  const getCareerStageData = () => {
    if (!user?.careerStage) return null;
    return candidateGuidance.careerStages[
      user.careerStage as keyof typeof candidateGuidance.careerStages
    ];
  };

  const getSpecializationData = () => {
    const fieldData = getFieldData();
    if (!fieldData || !selectedSpecialization) return null;
    const spec =
      fieldData.specializations[
        selectedSpecialization as keyof typeof fieldData.specializations
      ];
    return spec || null;
  };

  const fieldData = getFieldData();
  const careerStageData = getCareerStageData();
  const specializationData = getSpecializationData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
          Your Career Guidance
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Personalized insights and strategies to accelerate your career growth
          in {fieldData?.label}
        </p>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mx-auto grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="specialization"
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Your Field
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Career Stage
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            AI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* CV Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <FileText className="h-5 w-5" />
                    CV Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidateGuidance.generalTips.cvOptimization
                      .slice(0, 4)
                      .map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                          <span>{tip}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interview Preparation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <MessageSquare className="h-5 w-5" />
                    Interview Prep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidateGuidance.generalTips.interviewPreparation
                      .slice(0, 4)
                      .map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                          <span>{tip}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Job Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Target className="h-5 w-5" />
                    Job Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidateGuidance.generalTips.jobSearch
                      .slice(0, 4)
                      .map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                          <span>{tip}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="specialization" className="space-y-6">
          {fieldData && (
            <>
              {/* Field Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {fieldData.label}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {fieldData.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Specializations */}
              {user?.specializations && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.entries(fieldData.specializations).map(
                    ([key, spec]) => (
                      <Badge
                        key={key}
                        variant={
                          selectedSpecialization === key
                            ? "default"
                            : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedSpecialization(key)}
                      >
                        {spec.label}
                      </Badge>
                    ),
                  )}
                </div>
              )}

              {/* Specialization Details */}
              {specializationData && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {specializationData &&
                    "tips" in specializationData &&
                    (specializationData as SpecializationData).tips && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <Lightbulb className="h-5 w-5" />
                              CV Tips
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(
                                specializationData as SpecializationData
                              ).tips!.map((tip: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                  <span className="text-sm">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                  {specializationData &&
                    "interviewTips" in specializationData &&
                    (specializationData as SpecializationData)
                      .interviewTips && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                              <MessageSquare className="h-5 w-5" />
                              Interview Tips
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(
                                specializationData as SpecializationData
                              ).interviewTips!.map(
                                (tip: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                    <span className="text-sm">{tip}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                  {specializationData &&
                    "keywords" in specializationData &&
                    (specializationData as SpecializationData).keywords && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2"
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              Key Skills & Keywords
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {(
                                specializationData as SpecializationData
                              ).keywords!.map(
                                (keyword: string, index: number) => (
                                  <Badge key={index} variant="outline">
                                    {keyword}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          {careerStageData && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {careerStageData.label}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-red-700 dark:text-red-300">
                        Common Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {careerStageData.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                            <span className="text-sm">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-green-700 dark:text-green-300">
                        Success Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {careerStageData.strategies.map((strategy, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                            <span className="text-sm">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(candidateGuidance.aiToolsInfo).map(
              ([key, tool], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <div className="space-y-2">
                          {tool.features.slice(0, 3).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
