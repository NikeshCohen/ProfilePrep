"use client";

import { useEffect, useState } from "react";

import recruiterGuidance from "@/data/guidance/recruiter-guidance.json";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  Eye,
  Filter,
  MessageSquare,
  Search,
  Target,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  field?: string;
  specializations?: string[];
}

interface SpecializationData {
  label: string;
  screening?: string[];
  sourcing?: string[];
  redFlags?: string[];
  interviewTips?: string[];
}

export function RecruiterGuidanceClient() {
  const [, setUser] = useState<User | null>(null);
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          // Set defaults to first available options
          const fields = Object.keys(recruiterGuidance.fields);
          if (fields.length > 0) {
            setSelectedField(fields[0]);
            const firstField =
              recruiterGuidance.fields[
                fields[0] as keyof typeof recruiterGuidance.fields
              ];
            const specs = Object.keys(firstField.specializations);
            if (specs.length > 0) {
              setSelectedSpecialization(specs[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  const getFieldData = () => {
    if (!selectedField) return null;
    return recruiterGuidance.fields[
      selectedField as keyof typeof recruiterGuidance.fields
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
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
          Recruiter Guidance Hub
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Expert insights and strategies to optimize your talent acquisition
          process across industries
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
            By Industry
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Best Practices
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sourcing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Search className="h-5 w-5" />
                    Sourcing Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.sourcing.bestPractices
                      .slice(0, 4)
                      .map((practice, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                          <span>{practice}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Screening */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Filter className="h-5 w-5" />
                    Smart Screening
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.screening.process
                      .slice(0, 4)
                      .map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                          <span>{step}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Candidate Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Users className="h-5 w-5" />
                    Candidate Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.candidateExperience.communication
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
          {/* Field Selection */}
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(recruiterGuidance.fields).map(([key, field]) => (
              <Badge
                key={key}
                variant={selectedField === key ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedField(key)}
              >
                {field.label}
              </Badge>
            ))}
          </div>

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
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.entries(fieldData.specializations).map(
                  ([key, spec]) => (
                    <Badge
                      key={key}
                      variant={
                        selectedSpecialization === key ? "default" : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedSpecialization(key)}
                    >
                      {spec.label}
                    </Badge>
                  ),
                )}
              </div>

              {/* Specialization Details */}
              {specializationData && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {specializationData &&
                    "sourcing" in specializationData &&
                    (specializationData as SpecializationData).sourcing && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <Search className="h-5 w-5" />
                              Sourcing Strategies
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(
                                specializationData as SpecializationData
                              ).sourcing!.map(
                                (strategy: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                    <span className="text-sm">{strategy}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                  {specializationData &&
                    "screening" in specializationData &&
                    (specializationData as SpecializationData).screening && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                              <Filter className="h-5 w-5" />
                              Screening Focus
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(
                                specializationData as SpecializationData
                              ).screening!.map(
                                (point: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                    <span className="text-sm">{point}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                  {specializationData &&
                    "redFlags" in specializationData &&
                    (specializationData as SpecializationData).redFlags && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                              <Eye className="h-5 w-5" />
                              Red Flags
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(
                                specializationData as SpecializationData
                              ).redFlags!.map((flag: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                                  <span className="text-sm">{flag}</span>
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
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
                                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                                    <span className="text-sm">{tip}</span>
                                  </div>
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

        <TabsContent value="process" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Diversity & Inclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    Diversity & Inclusion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.diversity.strategies.map(
                      (strategy, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                          <span>{strategy}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interview Best Practices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <MessageSquare className="h-5 w-5" />
                    Interview Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.interviewing.bestPractices.map(
                      (practice, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                          <span>{practice}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Technology Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Zap className="h-5 w-5" />
                    Technology & Automation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.technology.automation.map(
                      (tool, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                          <span>{tool}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Retention Strategies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <Target className="h-5 w-5" />
                    Retention Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recruiterGuidance.generalGuidance.retention.strategies.map(
                      (strategy, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                          <span>{strategy}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recruiting Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Target className="h-5 w-5" />
                    Recruiting KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {recruiterGuidance.generalGuidance.metrics.recruiting.map(
                      (metric, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20"
                        >
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">{metric}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Zap className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {recruiterGuidance.generalGuidance.metrics.performance.map(
                      (metric, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950/20"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium">{metric}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
