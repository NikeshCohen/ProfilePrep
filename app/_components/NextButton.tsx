import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
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
      className={`${className}`}
      effect="expandIcon"
      icon={ArrowRightIcon}
      iconPlacement="right"
    >
      Next
    </Button>
  );
}
