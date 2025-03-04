"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function Stepper({ currentStep, totalSteps, className }: StepperProps) {
  // animation variants for the progress bars
  const progressVariants = {
    initial: {
      scaleX: 0,
      originX: 0,
    },
    animate: (i: number) => ({
      scaleX: i < currentStep ? 1 : 0,
      originX: 0,
      transition: {
        duration: 0.6,
        // custom easing curve
        ease: [0.65, 0, 0.35, 1],
        // stagger the animations
        delay: i * 0.1,
      },
    }),
  };

  // background bar variants
  const barVariants = {
    initial: {
      opacity: 0.5,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        className="mb-2 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Step {currentStep} of {totalSteps}
      </motion.div>
      <div className="flex w-full gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="relative h-1 flex-1">
            {/* background bar */}
            <motion.div
              className="absolute inset-0 h-full w-full rounded-sm bg-muted"
              variants={barVariants}
              initial="initial"
              animate="animate"
              custom={index}
            />

            {/* animated progress overlay */}
            <motion.div
              className="absolute inset-0 h-full w-full rounded-sm bg-primary"
              custom={index}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
