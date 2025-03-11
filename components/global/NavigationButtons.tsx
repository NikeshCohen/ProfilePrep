"use client";

import { motion } from "framer-motion";

import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
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
        icon={ArrowLeftIcon}
        iconPlacement="left"
      >
        <span>Back</span>
      </Button>
    </motion.div>
  );
}
