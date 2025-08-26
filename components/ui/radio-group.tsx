"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div className={cn("grid gap-2", className)} ref={ref} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, disabled, ...props }, ref) => {
    const { value: groupValue, onValueChange } =
      React.useContext(RadioGroupContext);
    const isChecked = groupValue === value;

    return (
      <input
        type="radio"
        ref={ref}
        id={id}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={() => onValueChange?.(value)}
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
