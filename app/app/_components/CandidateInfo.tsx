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
          <div className="relative">
            <Textarea
              id="notes"
              placeholder="Add any additional notes here..."
              className="min-h-[200px] resize-none pr-16"
              value={candidateData.notes}
              onChange={handleNotesChange}
              minLength={200}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${charCount >= 400 ? "text-green-500" : "text-red-500"}`}
            >
              {charCount}/400
            </div>
          </div>
          <p
            className="mt-2 text-xs text-muted-foreground"
            role="region"
            aria-live="polite"
          >
            Add additional information. The more descriptive you are, the better
            for the AI.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
