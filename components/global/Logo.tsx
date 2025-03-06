import Link from "next/link";

import { clsx } from "clsx";

interface LogoProps {
  className?: string;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  circleSize?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 52
    | 56
    | 60
    | 64
    | 72
    | 80
    | 96;
}

function Logo({ className, size = "lg", circleSize = 10 }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx("relative flex items-center justify-center", className)}
    >
      <div
        className={clsx(
          `absolute rounded-full bg-primary/20`,
          `h-${circleSize} w-${circleSize}`,
        )}
      ></div>
      <h1 className={clsx("relative font-bold tracking-wide", `text-${size}`)}>
        <span>Profile</span>
        <span className="text-primary">Prep</span>
      </h1>
    </Link>
  );
}

export default Logo;
