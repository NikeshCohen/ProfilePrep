import { notFound } from "next/navigation";

import { getCVAnalysis } from "@/actions/cv.actions";
import {
  CalendarIcon,
  CheckCircleIcon,
  FileTextIcon,
  XCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 30) return "text-orange-600";
  return "text-red-600";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Needs Work";
  return "Poor";
}

function ScoreCard({
  title,
  score,
  feedback,
}: {
  title: string;
  score: number;
  feedback: {
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-muted-foreground">
              {getScoreLabel(score)}
            </div>
          </div>
        </div>
        <Progress value={score} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        {feedback.tips && feedback.tips.length > 0 ? (
          feedback.tips.map((tip, index) => (
            <div key={index} className="flex gap-3 rounded-lg bg-muted/50 p-3">
              {tip.type === "good" ? (
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              ) : (
                <XCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium">{tip.tip}</div>
                {tip.explanation && (
                  <div className="text-xs text-muted-foreground">
                    {tip.explanation}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            No detailed feedback available for this category.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function CVAnalysisPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getCVAnalysis(id);

  if (!result.success || !result.analysis) {
    notFound();
  }

  const { analysis } = result;

  return (
    <div className="min-h-screen space-y-8 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileTextIcon className="h-4 w-4" />
          <span>{analysis.fileName}</span>
          <span>•</span>
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">CV Analysis Results</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Job Title:</span>
              <Badge variant="secondary">{analysis.jobTitle}</Badge>
            </div>
            {analysis.companyName && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Company:</span>
                <Badge variant="outline">{analysis.companyName}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Overall Score</CardTitle>
                <CardDescription>
                  Your CV&apos;s overall performance across all categories
                </CardDescription>
              </div>
              <div className="text-right">
                <div
                  className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}
                >
                  {analysis.overallScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getScoreLabel(analysis.overallScore)}
                </div>
              </div>
            </div>
            <Progress value={analysis.overallScore} className="h-3 w-full" />
          </CardHeader>
        </Card>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScoreCard
          title="ATS Compatibility"
          score={analysis.atsScore}
          feedback={
            analysis.atsFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Tone & Style"
          score={analysis.toneScore}
          feedback={
            analysis.toneFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Content Quality"
          score={analysis.contentScore}
          feedback={
            analysis.contentFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Structure"
          score={analysis.structureScore}
          feedback={
            analysis.structureFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Skills"
          score={analysis.skillsScore}
          feedback={
            analysis.skillsFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Grammar & Formatting"
          score={analysis.grammarScore}
          feedback={
            analysis.grammarFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
        <ScoreCard
          title="Keyword Density"
          score={analysis.keywordScore}
          feedback={
            analysis.keywordFeedback as {
              tips: Array<{
                type: "good" | "improve";
                tip: string;
                explanation?: string;
              }>;
            }
          }
        />
      </div>

      {/* Action Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Key Action Items</CardTitle>
          <CardDescription>
            Priority improvements to boost your CV&apos;s effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-red-600">
                High Priority (Score &lt; 50)
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[
                  { score: analysis.atsScore, name: "ATS Compatibility" },
                  { score: analysis.toneScore, name: "Tone & Style" },
                  { score: analysis.contentScore, name: "Content Quality" },
                  { score: analysis.structureScore, name: "Structure" },
                  { score: analysis.skillsScore, name: "Skills" },
                  {
                    score: analysis.grammarScore,
                    name: "Grammar & Formatting",
                  },
                  { score: analysis.keywordScore, name: "Keyword Density" },
                ]
                  .filter((item) => item.score < 50)
                  .map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <XCircleIcon className="h-4 w-4 text-red-600" />
                      <span>
                        Improve {item.name} (Current: {item.score})
                      </span>
                    </li>
                  ))}
                {[
                  { score: analysis.atsScore, name: "ATS Compatibility" },
                  { score: analysis.toneScore, name: "Tone & Style" },
                  { score: analysis.contentScore, name: "Content Quality" },
                  { score: analysis.structureScore, name: "Structure" },
                  { score: analysis.skillsScore, name: "Skills" },
                  {
                    score: analysis.grammarScore,
                    name: "Grammar & Formatting",
                  },
                  { score: analysis.keywordScore, name: "Keyword Density" },
                ].filter((item) => item.score < 50).length === 0 && (
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <span>No high-priority items - great job!</span>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-yellow-600">
                Medium Priority (Score 50-69)
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[
                  { score: analysis.atsScore, name: "ATS Compatibility" },
                  { score: analysis.toneScore, name: "Tone & Style" },
                  { score: analysis.contentScore, name: "Content Quality" },
                  { score: analysis.structureScore, name: "Structure" },
                  { score: analysis.skillsScore, name: "Skills" },
                  {
                    score: analysis.grammarScore,
                    name: "Grammar & Formatting",
                  },
                  { score: analysis.keywordScore, name: "Keyword Density" },
                ]
                  .filter((item) => item.score >= 50 && item.score < 70)
                  .map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <XCircleIcon className="h-4 w-4 text-yellow-600" />
                      <span>
                        Enhance {item.name} (Current: {item.score})
                      </span>
                    </li>
                  ))}
                {[
                  { score: analysis.atsScore, name: "ATS Compatibility" },
                  { score: analysis.toneScore, name: "Tone & Style" },
                  { score: analysis.contentScore, name: "Content Quality" },
                  { score: analysis.structureScore, name: "Structure" },
                  { score: analysis.skillsScore, name: "Skills" },
                  {
                    score: analysis.grammarScore,
                    name: "Grammar & Formatting",
                  },
                  { score: analysis.keywordScore, name: "Keyword Density" },
                ].filter((item) => item.score >= 50 && item.score < 70)
                  .length === 0 && (
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <span>No medium-priority items</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
