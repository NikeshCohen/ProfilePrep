"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  FileText,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Stepper } from "@/components/global/Stepper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { containerVariants, itemVariants } from "@/lib/animations";

interface InfoPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function InfoPanel({ isOpen, setIsOpen }: InfoPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // reset step when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCurrentStep(1), 300);
    }
  }, [isOpen]);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">
                Welcome to Profile<span className="text-primary">Prep</span>
              </h3>
            </motion.div>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              ProfilePrep uses AI to help recruiters refine and format candidate
              CVs before sending them to clients.
            </motion.p>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              This guide will help you understand how to get the best results
              from our AI-powered tool.
            </motion.p>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Upload Quality Matters</h3>
            </motion.div>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              The quality of your PDF upload directly impacts the AI&apos;s
              ability to extract and process information correctly.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="bg-muted/50 p-3 border rounded-md"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-start gap-2 cursor-help">
                      <AlertCircle className="mt-0.5 w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-sm">
                        <span className="font-medium">Pro Tip:</span> Use
                        text-based PDFs rather than scanned documents for best
                        results.
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>
                      Scanned PDFs may result in text extraction errors, leading
                      to less accurate AI processing.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">
                Detailed Notes Improve Results
              </h3>
            </motion.div>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              The AI uses your notes to understand context and generate more
              relevant content.
            </motion.p>
            <motion.div variants={itemVariants} className="space-y-2">
              <p className="font-medium text-sm">Note Quality Indicators:</p>
              <div className="gap-2 grid grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500 rounded-full w-3 h-3"></span>
                  <span className="text-xs">Poor (&lt;200 chars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 rounded-full w-3 h-3"></span>
                  <span className="text-xs">Limited (&lt;400 chars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 rounded-full w-3 h-3"></span>
                  <span className="text-xs">Good (&lt;800 chars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 rounded-full w-3 h-3"></span>
                  <span className="text-xs">Excellent (800+ chars)</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-muted/50 p-3 border rounded-md"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-start gap-2 cursor-help">
                      <AlertCircle className="mt-0.5 w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-sm">
                        <span className="font-medium">Pro Tip:</span> Include
                        specific skills, achievements, and context that may not
                        be obvious from the CV.
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>
                      The more context you provide, the better the AI can
                      highlight relevant experience and skills in the refined
                      CV.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Important Disclaimer</h3>
            </motion.div>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              While our AI is powerful, it&apos;s important to remember:
            </motion.p>
            <motion.ul
              variants={itemVariants}
              className="space-y-2 text-muted-foreground text-sm"
            >
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1.5 rounded-full w-1.5 h-1.5"></span>
                <span>
                  Always review AI-generated content for accuracy before sharing
                  with clients.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1.5 rounded-full w-1.5 h-1.5"></span>
                <span>
                  The quality of the output is directly related to the quality
                  of your input.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1.5 rounded-full w-1.5 h-1.5"></span>
                <span>
                  AI may occasionally misinterpret information or generate
                  content that needs adjustment.
                </span>
              </li>
            </motion.ul>
            <motion.div
              variants={itemVariants}
              className="bg-primary/10 p-3 border rounded-md"
            >
              <p className="font-medium text-sm">
                By using Profile<span className="text-primary">Prep</span>, you
                acknowledge that you will verify all AI-generated content before
                professional use.
              </p>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md"
        hideCloseButton={true}
        aria-describedby="AI Interaction Guidance"
      >
        <DialogHeader>
          <DialogTitle>AI Interaction Guidance</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="top-4 right-4 absolute"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <DialogDescription className="sr-only">
          AI Interaction Guidance
        </DialogDescription>

        <div className="py-4">
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />

          <div className="mt-6 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter
          className={`flex ${currentStep === 1 ? "justify-end sm:justify-end md:justify-end lg:justify-end" : "justify-between sm:justify-between"}`}
        >
          {currentStep !== 1 && (
            <BackButton
              onClick={handlePrevious}
              className="bg-background/20 px-6"
            />
          )}

          {currentStep < totalSteps ? (
            <NextButton onClick={handleNext} className="px-6" />
          ) : (
            <Button onClick={() => setIsOpen(false)}>Got it</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
