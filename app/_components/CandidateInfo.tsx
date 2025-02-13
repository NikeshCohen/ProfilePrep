"use client";

import type React from "react";
import { useId } from "react";

import type { CandidateData } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <h1 className="mb-4 font-bold text-primary text-3xl">
        Candidate Information
      </h1>

      {!showNotes && (
        <>
          <div className="space-y-2">
            <Label htmlFor={documentTitleId}>Document Title</Label>
            <Input
              id="documentTitle"
              placeholder="Enter document title"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor={nameId}>Candidate Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={candidateData.name}
              onChange={onInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={locationId}>Location</Label>
            <Input
              id="location"
              placeholder="Cape Town, SA"
              value={candidateData.location}
              onChange={onInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={rightToWorkId}>Right to Work</Label>
            <Input
              id="rightToWork"
              placeholder="SA Citizen, no sponsorship required"
              value={candidateData.rightToWork}
              onChange={onInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={salaryExpectationId}>Salary Expectation</Label>
            <Input
              id="salaryExpectation"
              placeholder="Open to discussion"
              value={candidateData.salaryExpectation}
              onChange={onInputChange}
            />
          </div>
        </>
      )}

      {showNotes && (
        <div className="space-y-2">
          <Label htmlFor={notesId}>Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes here"
            className="min-h-[200px] resize-none"
            value={candidateData.notes}
            onChange={onInputChange}
          />
          <p
            className="mt-2 text-muted-foreground text-xs"
            role="region"
            aria-live="polite"
          >
            Add additional information. The more descriptive you are, the better
            for the AI.
          </p>
        </div>
      )}
    </div>
  );
}
