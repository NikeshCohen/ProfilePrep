import { ArrowLeft, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function NextButton({
  onClick,
  disabled = false,
  className = "",
}: NextButtonProps) {
  return (
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
  );
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={className}
      effect="expandIcon"
      icon={ArrowLeft}
      iconPlacement="left"
    >
      <span>Back</span>
    </Button>
  );
}
