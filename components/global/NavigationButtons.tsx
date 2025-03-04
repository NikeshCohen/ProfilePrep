"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { fadeUpAnimation } from "@/lib/animations";

type NextButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

type BackButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export function NextButton({
  onClick,
  disabled = false,
  className = "",
}: NextButtonProps) {
  return (
    <motion.div {...fadeUpAnimation}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={className}
        effect="expandIcon"
        icon={ArrowRightIcon}
        iconPlacement="right"
      >
        Next
      </Button>
    </motion.div>
  );
}

export function BackButton({
  onClick,
  disabled = false,
  className = "",
}: BackButtonProps) {
  return (
    <motion.div {...fadeUpAnimation}>
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={className}
        effect="expandIcon"
        icon={ArrowLeft}
        iconPlacement="left"
      >
        <span>Back</span>
      </Button>
    </motion.div>
  );
}
