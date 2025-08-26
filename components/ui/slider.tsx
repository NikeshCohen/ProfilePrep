"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      onValueChange([newValue]);
    };

    return (
      <div
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
      >
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0] || min}
          onChange={handleChange}
          disabled={disabled}
          className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          {...props}
        />
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
