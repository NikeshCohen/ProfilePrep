import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TruncatedText({ text, limit = 30 }: { text: string; limit?: number }) {
  const shouldTruncate = text.length > limit;
  const truncatedText = shouldTruncate
    ? `${text.substring(0, limit)}...`
    : text;

  if (!shouldTruncate) {
    return <span>{text}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{truncatedText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TruncatedText;
