"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Template {
  id: string;
  name: string;
  templateContent: string;
  company: {
    id: string;
    name: string;
  };
}

interface ViewTemplateProps {
  template: Template;
}

export default function ViewTemplate({ template }: ViewTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(template.templateContent);
      setIsCopied(true);
      toast.success("Template content copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy template content");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          View
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="mb-4 max-h-[800px] max-w-[375px] py-2 md:max-w-[900px]">
        <DialogHeader className="py-4">
          <DialogTitle className="text-left">
            {template.name} - {template.company.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="mb-4 h-[600px] w-full px-4">
          <div className="markdown text-left">
            <Markdown remarkPlugins={[remarkGfm]}>
              {template.templateContent}
            </Markdown>
          </div>
        </ScrollArea>

        <DialogFooter className="flex w-full justify-end">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
