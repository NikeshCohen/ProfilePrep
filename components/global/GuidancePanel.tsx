"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HelpCircle, ChevronRight, Sparkles, Target, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import candidateGuidance from "@/data/guidance/candidate-guidance.json";
import recruiterGuidance from "@/data/guidance/recruiter-guidance.json";

interface UserPreferences {
  userType: "CANDIDATE" | "RECRUITER";
  field?: string;
  specializations?: string[];
  careerStage?: string;
}

interface User {
  userType: "CANDIDATE" | "RECRUITER";
  field?: string;
  specializations?: string[];
  careerStage?: string;
}

interface FieldData {
  label: string;
  description?: string;
  specializations: Record<string, {
    label: string;
    tips?: string[];
    keywords?: string[];
    sourcing?: string[];
    screening?: string[];
    interviewTips?: string[];
    redFlags?: string[];
  }>;
}

interface CareerStageData {
  label: string;
  description?: string;
  strategies?: string[];
}

export function GuidancePanel({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (user) {
      setPreferences({
        userType: user.userType,
        field: user.field,
        specializations: user.specializations || [],
        careerStage: user.careerStage,
      });
    }
  }, [user]);

  if (!preferences || !preferences.field) {
    return null;
  }

  const guidance = preferences.userType === "CANDIDATE" ? candidateGuidance : recruiterGuidance;
  const fieldData = (guidance.fields as Record<string, FieldData>)[preferences.field];
  
  const selectedSpecs = preferences.specializations?.map(
    (specKey) => ({
      key: specKey,
      data: fieldData?.specializations[specKey],
    })
  ).filter(spec => spec.data) || [];

  const careerStageData = preferences.userType === "CANDIDATE" && preferences.careerStage
    ? (candidateGuidance.careerStages as Record<string, CareerStageData>)[preferences.careerStage]
    : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 17,
            delay: 0.5
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 transition-colors duration-200"
            title="Career Guidance"
          >
            <motion.div
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <HelpCircle className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Personalized Guidance</SheetTitle>
          <SheetDescription>
            Tailored advice for {fieldData?.label} professionals
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{fieldData?.label}</Badge>
            {selectedSpecs.map((spec) => (
              <Badge key={spec.key} variant="outline">
                {spec.data.label}
              </Badge>
            ))}
            {careerStageData && (
              <Badge variant="outline">{careerStageData.label}</Badge>
            )}
          </div>

          <Tabs defaultValue="quick-tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick-tips">Quick Tips</TabsTrigger>
              <TabsTrigger value="specialized">Specialized</TabsTrigger>
              <TabsTrigger value="tools">
                {preferences.userType === "CANDIDATE" ? "AI Tools" : "Resources"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick-tips" className="space-y-4 mt-4">
              {preferences.userType === "CANDIDATE" ? (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">CV Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {candidateGuidance.generalTips.cvOptimization.slice(0, 5).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">ATS Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {candidateGuidance.generalTips.atsOptimization.slice(0, 5).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {careerStageData && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {careerStageData.label} Strategies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {careerStageData.strategies?.slice(0, 5).map((strategy: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Sourcing Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {recruiterGuidance.generalGuidance.sourcing.bestPractices.slice(0, 5).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Screening Red Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {recruiterGuidance.generalGuidance.screening.redFlags.slice(0, 5).map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="specialized" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {selectedSpecs.map((spec) => (
                  <AccordionItem key={spec.key} value={spec.key}>
                    <AccordionTrigger>{spec.data.label}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {preferences.userType === "CANDIDATE" ? (
                        <>
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Top Tips</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {spec.data.tips?.slice(0, 3).map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Key Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {spec.data.keywords?.slice(0, 10).map((keyword: string) => (
                                <Badge key={keyword} variant="secondary">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Interview Tips</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {spec.data.interviewTips?.slice(0, 3).map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Sourcing Channels</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {spec.data.sourcing?.slice(0, 3).map((channel: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span>{channel}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Screening Tips</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {spec.data.screening?.slice(0, 3).map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Red Flags</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {spec.data.redFlags?.slice(0, 3).map((flag: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                                  <span>{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 mt-4">
              {preferences.userType === "CANDIDATE" ? (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CV & Cover Letter Analyzer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {candidateGuidance.aiToolsInfo.cvAnalyzer.description}
                      </p>
                      <ul className="space-y-1 text-sm">
                        {candidateGuidance.aiToolsInfo.cvAnalyzer.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Badge variant="secondary" className="text-xs">
                        Pay-per-use pricing for affordability
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Interview Preparation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {candidateGuidance.aiToolsInfo.interviewPrep.description}
                      </p>
                      <ul className="space-y-1 text-sm">
                        {candidateGuidance.aiToolsInfo.interviewPrep.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Stay Connected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Join our newsletter for weekly insights, job opportunities, and
                        success stories from our community.
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Sourcing Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {recruiterGuidance.generalGuidance.sourcing.tools.slice(0, 6).map((tool, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{tool}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Key Metrics to Track</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {recruiterGuidance.generalGuidance.metrics.recruiting.slice(0, 6).map((metric, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Diversity Strategies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {recruiterGuidance.generalGuidance.diversity.strategies.slice(0, 5).map((strategy, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}