"use client";

import type React from "react";
import { useEffect, useId, useState } from "react";

import type { CandidateData } from "@/types";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { containerVariants, itemVariants } from "@/lib/animations";

interface CandidateInfoProps {
  candidateData: CandidateData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  showNotes: boolean;
}

export function CandidateInfo({
  candidateData,
  onInputChange,
  showNotes,
}: CandidateInfoProps) {
  const documentTitleId = useId();
  const nameId = useId();
  const locationId = useId();
  const rightToWorkId = useId();
  const salaryExpectationId = useId();
  const notesId = useId();

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
      className="w-full max-w-sm space-y-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="mb-4 text-3xl font-bold text-primary"
        variants={itemVariants}
      >
        Candidate Information
      </motion.h1>

      {!showNotes && (
        <>
          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor={documentTitleId}>Document Title</Label>
            <Input
              id="documentTitle"
              placeholder="Enter document title"
              value={candidateData.documentTitle}
              onChange={onInputChange}
            />
            <p
              className="mt-2 text-xs text-muted-foreground"
              role="region"
              aria-live="polite"
            >
              This will appear at the top of the document and be the name of the
              file
            </p>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor={nameId}>Candidate Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={candidateData.name}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor={locationId}>Location</Label>
            <Input
              id="location"
              placeholder="Cape Town, SA"
              value={candidateData.location}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor={rightToWorkId}>Right to Work</Label>
            <Input
              id="rightToWork"
              placeholder="SA Citizen, no sponsorship required"
              value={candidateData.rightToWork}
              onChange={onInputChange}
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor={salaryExpectationId}>Salary Expectation</Label>
            <Input
              id="salaryExpectation"
              placeholder="Open to discussion"
              value={candidateData.salaryExpectation}
              onChange={onInputChange}
            />
          </motion.div>
        </>
      )}

      {showNotes && (
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label
            htmlFor={notesId}
            className="sr-only text-primary underline underline-offset-4"
          >
            Notes
          </Label>
          <div className="space-y-2">
            <Textarea
              id="notes"
              placeholder="Add any additional notes here..."
              className="min-h-[200px] resize-none"
              value={candidateData.notes}
              onChange={handleNotesChange}
              minLength={200}
            />
            <div className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground">
                Add additional information. Aim for 800 characters for best
                results.
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
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {charCount < 200
                    ? "Poor"
                    : charCount < 400
                      ? "Limited"
                      : charCount < 800
                        ? "Good"
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
                          : "text-green-600"
                  }`}
                >
                  {charCount}/800
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
