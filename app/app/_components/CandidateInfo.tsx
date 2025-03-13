"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useTemplatesQuery } from "@/actions/queries/user.queries";
import type { CandidateData } from "@/types";
import { motion } from "framer-motion";
import { User } from "next-auth";

import { LoaderIcon } from "@/components/global/LoaderButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { containerVariants, itemVariants } from "@/lib/animations";

interface CandidateInfoProps {
  sessionUser: User;
  candidateData: CandidateData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  showNotes: boolean;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
}

interface TemplateSelectProps {
  value: string;
  onValueChange: (value: string, content?: string) => void;
  sessionUser: User;
}

export function CandidateInfo({
  sessionUser,
  candidateData,
  onInputChange,
  showNotes,
  selectedTemplate,
  onTemplateChange,
}: CandidateInfoProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(candidateData.notes.length);
  }, [candidateData.notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    setCharCount(e.target.value.length);
  };

  return (
    <motion.div
      className="space-y-4 w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="mb-4 font-bold text-primary text-3xl"
        variants={itemVariants}
      >
        Candidate Information
      </motion.h1>

      {!showNotes && (
        <>
          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="documentTitle">Document Title</Label>
            <Input
              id="documentTitle"
              placeholder="Enter the title of the document"
              value={candidateData.documentTitle}
              onChange={onInputChange}
            />
            <p
              className="mt-2 text-muted-foreground text-xs"
              role="region"
              aria-live="polite"
            >
              This will appear at the top of the document and be the name of the
              file
            </p>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="name">Candidate Name</Label>
            <Input
              id="name"
              placeholder="Enter the candidate's full name"
              value={candidateData.name}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter the candidate's location"
              value={candidateData.location}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="rightToWork">Right to Work</Label>
            <Input
              id="rightToWork"
              placeholder="Specify the right to work status"
              value={candidateData.rightToWork}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="salaryExpectation">Salary Expectation</Label>
            <Input
              id="salaryExpectation"
              placeholder="State salary expectations"
              value={candidateData.salaryExpectation}
              onChange={onInputChange}
            />
          </motion.div>
        </>
      )}

      {showNotes && (
        <>
          <motion.div variants={itemVariants}>
            <Label htmlFor="template" className="block mb-2">
              Template
            </Label>
            <TemplateSelect
              value={selectedTemplate}
              onValueChange={onTemplateChange}
              sessionUser={sessionUser}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label
              htmlFor="notes"
              className="sr-only text-primary underline underline-offset-4"
            >
              Notes
            </Label>
            <div className="space-y-2">
              <Textarea
                id="notes"
                placeholder="Provide additional notes or comments here..."
                className="min-h-[200px] resize-none"
                value={candidateData.notes}
                onChange={handleNotesChange}
                minLength={200}
              />
              <div className="flex justify-between items-center text-xs">
                <p className="text-muted-foreground">
                  Add additional information. Aim for 800 characters for best
                  results. Minimum 200 characters
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      charCount < 200
                        ? "bg-red-100 text-red-700"
                        : charCount < 400
                          ? "bg-orange-100 text-orange-700"
                          : charCount < 800
                            ? "bg-yellow-100 text-yellow-700"
                            : charCount > 2000
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                    }`}
                  >
                    {charCount < 200
                      ? "Poor"
                      : charCount < 400
                        ? "Limited"
                        : charCount < 800
                          ? "Good"
                          : charCount > 2000
                            ? "Limit"
                            : "Excellent"}
                  </span>
                  <span
                    className={`font-medium ${
                      charCount < 200
                        ? "text-red-600"
                        : charCount < 400
                          ? "text-orange-600"
                          : charCount < 800
                            ? "text-yellow-600"
                            : charCount > 2000
                              ? "text-red-600"
                              : "text-green-600"
                    }`}
                  >
                    {charCount}/2000
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function TemplateSelect({
  value,
  onValueChange,
  sessionUser,
}: TemplateSelectProps) {
  const { data: templates, isLoading } = useTemplatesQuery(sessionUser);

  useEffect(() => {
    // Auto-select ProfilePrep template if user doesn't have a company
    if (!sessionUser.company && !value) {
      onValueChange("pp", undefined);
    }
  }, [sessionUser.company, value, onValueChange]);

  const handleTemplateChange = (selectedId: string) => {
    const selectedTemplate = templates?.templates?.find(
      (template) => template.id === selectedId,
    );
    onValueChange(selectedId, selectedTemplate?.templateContent);
  };

  const hasCustomTemplates =
    sessionUser.company &&
    templates?.success &&
    templates.templates &&
    templates.templates.length > 0;

  return (
    <motion.div className="space-y-2" variants={itemVariants}>
      <Select
        value={value || undefined}
        onValueChange={handleTemplateChange}
        disabled={isLoading || !sessionUser.company}
      >
        <SelectTrigger className="bg-background/20">
          <SelectValue placeholder="Choose a template style" />
          {isLoading && <LoaderIcon className="ml-2 w-4 h-4 animate-spin" />}
        </SelectTrigger>
        <SelectContent>
          {isLoading && sessionUser.company ? (
            <div className="flex justify-center items-center py-2">
              <p className="text-muted-foreground text-sm">
                Loading templates...
              </p>
            </div>
          ) : (
            <>
              <SelectItem value="pp">ProfilePrep Default</SelectItem>
              {hasCustomTemplates &&
                templates.templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
            </>
          )}
        </SelectContent>
      </Select>
      {!sessionUser.company && (
        <Link
          href="https://cal.com/profileprep/quick-chat"
          target="_blank"
          className="flex mt-2 text-primary hover:text-primary text-xs underline transition-colors"
        >
          <span>Upgrade to use your own custom templates!</span>
        </Link>
      )}
    </motion.div>
  );
}
