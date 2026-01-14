"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { candidateContent, recruiterContent } from "@/constants/webcontent";
import { ContentItem } from "@/types/meta";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  Briefcase,
  Check,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpotlightCard from "@/components/ui/spot-light-card";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

// animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

interface SectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, children, className }: SectionProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn("w-full py-10 md:py-20", className)}
    >
      <div className="container mx-auto px-6 sm:px-6 md:px-8 lg:px-10">
        <motion.h2
          variants={fadeInUp}
          className="mb-8 text-center text-3xl font-bold"
        >
          {title}
        </motion.h2>
        {children}
      </div>
    </motion.section>
  );
}

interface LandingPageContentProps {
  isRecruiterView?: boolean;
  onViewToggle?: (value: boolean) => void;
}

export default function LandingPageContent({
  isRecruiterView = false,
  onViewToggle,
}: LandingPageContentProps = {}) {
  const [localIsRecruiterView, setLocalIsRecruiterView] =
    useState(isRecruiterView);

  // sync local state with prop changes
  useEffect(() => {
    setLocalIsRecruiterView(isRecruiterView);
  }, [isRecruiterView]);

  const handleToggle = (value: boolean) => {
    setLocalIsRecruiterView(value);
    onViewToggle?.(value);
  };

  const content = localIsRecruiterView ? recruiterContent : candidateContent;

  // candidate view: personal, warm, approachable B2C feel
  // recruiter view: Professional, structured, partnership B2B feel
  const backgroundStyles = localIsRecruiterView
    ? "bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 dark:from-blue-950/30 dark:via-gray-900 dark:to-indigo-950/20";

  return (
    <motion.div
      className={cn(
        "min-h-screen transition-all duration-700 ease-in-out",
        backgroundStyles,
      )}
    >
      <section className="layout">
        {!onViewToggle && (
          <ViewToggle
            isRecruiterView={localIsRecruiterView}
            onToggle={handleToggle}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={localIsRecruiterView ? "recruiter" : "candidate"}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Hero content={content} />
            <Features content={content} />
            <Comparison content={content} />
            <Pricing content={content} />
            <InstitutionalSection content={content} />
            <Cta content={content} />
            <Faq content={content} />
          </motion.div>
        </AnimatePresence>
      </section>
    </motion.div>
  );
}

function ViewToggle({
  isRecruiterView,
  onToggle,
}: {
  isRecruiterView: boolean;
  onToggle: (value: boolean) => void;
}) {
  const toggleStyles = isRecruiterView
    ? "bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 shadow-slate-200/50 dark:shadow-slate-800/50"
    : "bg-white/90 dark:bg-blue-900/90 border-blue-100 dark:border-blue-800 shadow-blue-200/30 dark:shadow-blue-900/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        "fixed left-1/2 top-20 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-700",
        toggleStyles,
      )}
    >
      <motion.div
        className="flex items-center gap-1.5"
        animate={{ opacity: !isRecruiterView ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <Users
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        />
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        >
          Candidates
        </span>
      </motion.div>
      <Switch
        checked={isRecruiterView}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      <motion.div
        className="flex items-center gap-1.5"
        animate={{ opacity: isRecruiterView ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <Briefcase
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            isRecruiterView ? "text-primary" : "text-gray-400",
          )}
        />
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            isRecruiterView ? "text-primary" : "text-gray-400",
          )}
        >
          Recruiters
        </span>
      </motion.div>
    </motion.div>
  );
}

function Hero({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <motion.section
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-24 md:py-48"
    >
      {/* distinct decorative elements for each view */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {isRecruiter ? (
          // recruiter: professional, geometric patterns
          <>
            <div className="absolute right-1/4 top-20 h-64 w-64 rotate-12 rounded-lg bg-gradient-to-br from-slate-200/30 to-blue-200/30 blur-2xl dark:from-slate-700/20 dark:to-blue-800/20" />
            <div className="absolute bottom-20 left-1/4 h-48 w-48 -rotate-12 rounded-lg bg-gradient-to-tr from-blue-200/30 to-slate-200/30 blur-xl dark:from-blue-800/20 dark:to-slate-700/20" />
            <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded bg-gradient-to-br from-primary/10 to-slate-300/20 blur-lg dark:from-primary/5 dark:to-slate-600/10" />
          </>
        ) : (
          // candidate: warm, flowing shapes
          <>
            <div className="absolute right-1/3 top-32 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 blur-3xl dark:from-blue-900/20 dark:to-indigo-900/20" />
            <div
              className="absolute bottom-40 left-1/3 h-56 w-56 animate-pulse rounded-full bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-2xl dark:from-indigo-900/15 dark:to-purple-900/15"
              style={{ animationDelay: "2s" }}
            />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-100/20 via-transparent to-indigo-100/20 blur-3xl dark:from-blue-950/10 dark:via-transparent dark:to-indigo-950/10" />
          </>
        )}
      </div>

      <div className="relative z-10 mt-16 px-4 md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          {/* personalised icons/graphics 
          <motion.div 
            variants={scaleIn} 
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {isRecruiter ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Briefcase className="h-8 w-8 animate-pulse" />
                <Users className="h-10 w-10" />
                <Briefcase className="h-8 w-8 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-primary">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <Users className="h-12 w-12" />
                <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.6s' }} />
              </div>
            )}
          </motion.div>
          */}

          <motion.div
            variants={scaleIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/login">
              <Badge
                className={cn(
                  "mb-8 animate-shimmer border px-4 py-2 font-bold transition-all duration-700",
                  isRecruiter
                    ? "border-slate-300 bg-[linear-gradient(110deg,#1e293b,45%,#486185,55%,#1e293b)] bg-[length:200%_100%] text-white dark:border-slate-600 dark:bg-[linear-gradient(110deg,hsl(217,91%,60%),45%,hsl(217,91%,75%),55%,hsl(217,91%,60%))] dark:text-white"
                    : "border-primary/20 bg-[linear-gradient(110deg,#1e40af,45%,#486185,55%,#1e40af)] bg-[length:200%_100%] text-white dark:bg-[linear-gradient(110deg,hsl(217,91%,60%),45%,hsl(217,91%,75%),55%,hsl(217,91%,60%))] dark:text-white",
                )}
              >
                {content.hero.badge}
              </Badge>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2"
          >
            <h1
              className={cn(
                "mb-6 space-y-1 text-3xl font-bold tracking-tighter transition-all duration-700 sm:text-4xl md:text-5xl lg:text-6xl",
                isRecruiter
                  ? "bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-slate-900 text-transparent dark:from-slate-100 dark:to-blue-300 dark:text-slate-100"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-gray-900 text-transparent dark:from-blue-400 dark:to-indigo-400 dark:text-gray-100",
              )}
            >
              {content.hero.title}
            </h1>
            <p
              className={cn(
                "text-md mx-auto mb-4 max-w-[700px] pb-2.5 transition-all duration-700",
                isRecruiter
                  ? "font-medium text-slate-600 dark:text-slate-400"
                  : "text-gray-600 dark:text-gray-400",
              )}
            >
              {content.hero.description}
            </p>
          </motion.div>

          {/* additional trust indicators */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            {isRecruiter ? (
              <>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Check className="h-4 w-4 text-green-500" />
                  Trusted by 500+ agencies
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Check className="h-4 w-4 text-green-500" />
                  Process 100+ CVs/hour
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Check className="h-4 w-4 text-green-500" />
                  White-label ready
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-500" />
                  10,000+ interviews secured
                </span>
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-500" />
                  95% ATS pass rate
                </span>
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-500" />
                  AI-powered optimization
                </span>
              </>
            )}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
              className={cn(
                "px-8 py-6 text-lg font-semibold",
                isRecruiter
                  ? "bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90"
                  : "",
              )}
              size="lg"
              asChild
            >
              <Link href="/login">{content.hero.cta}</Link>
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg"
              size="lg"
              asChild
            >
              <Link href={isRecruiter ? "/demo" : "/examples"}>
                {isRecruiter ? "Book a Demo" : "View Examples"}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Features({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <Section
      title={content.features.title}
      className={cn(
        "transition-all duration-700",
        isRecruiter
          ? "bg-slate-50/30 dark:bg-slate-900/20"
          : "bg-blue-50/30 dark:bg-blue-950/10",
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {content.features.items.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SpotlightCard
              className={cn(
                "h-full transition-all duration-300",
                isRecruiter
                  ? "border-slate-200/60 bg-white/60 hover:border-primary/30 dark:border-slate-700/60 dark:bg-slate-800/60"
                  : "border-blue-100/60 bg-white/70 hover:border-primary/40 dark:border-blue-800/60 dark:bg-blue-900/40",
              )}
            >
              <feature.icon
                className={cn(
                  "mb-4 h-10 w-10 transition-colors duration-300",
                  isRecruiter ? "text-primary" : "text-primary",
                )}
              />
              <h3
                className={cn(
                  "mb-2 font-semibold transition-colors duration-300",
                  isRecruiter
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-gray-900 dark:text-gray-100",
                )}
              >
                {feature.title}
              </h3>
              <p
                className={cn(
                  "transition-colors duration-300",
                  isRecruiter
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-gray-600 dark:text-gray-400",
                )}
              >
                {feature.description}
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function Comparison({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <Section
      title={content.comparison.title}
      className={cn(
        "transition-all duration-700",
        isRecruiter
          ? "bg-gradient-to-r from-slate-50/40 to-gray-50/40 dark:from-slate-900/30 dark:to-gray-900/30"
          : "bg-gradient-to-r from-blue-50/40 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20",
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-2"
      >
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
          <Card
            className={cn(
              "h-full transition-all duration-300",
              isRecruiter
                ? "border-slate-200/50 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-800/50"
                : "border-blue-100/50 bg-blue-50/40 dark:border-blue-800/40 dark:bg-blue-900/30",
            )}
          >
            <CardHeader>
              <CardTitle>{content.comparison.pitfallsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {content.comparison.pitfalls.map((pitfall, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isRecruiter
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {pitfall}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className={cn(
              "h-full border-primary transition-all duration-300",
              isRecruiter
                ? "bg-white/60 dark:bg-slate-800/60"
                : "bg-white/70 dark:bg-blue-900/40",
            )}
          >
            <CardHeader>
              <CardTitle className="text-primary">
                {content.comparison.advantagesTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {content.comparison.advantages.map((advantage, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Check className="h-5 w-5 text-primary" />
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isRecruiter
                          ? "text-slate-900 dark:text-slate-100"
                          : "text-gray-900 dark:text-gray-100",
                      )}
                    >
                      {advantage}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function Pricing({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <Section
      title={content.pricing.title}
      className={cn(
        "transition-all duration-700",
        isRecruiter
          ? "bg-slate-50/20 dark:bg-slate-900/20"
          : "bg-blue-50/20 dark:bg-blue-950/10",
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-3"
      >
        {content.pricing.tiers.map((tier, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -5 }}
          >
            <Card
              className={cn(
                "relative h-full transition-all duration-300",
                index === 1
                  ? "border-primary bg-primary/80 text-primary-foreground dark:bg-primary/20"
                  : isRecruiter
                    ? "border-slate-200/60 bg-white/60 dark:border-slate-700/60 dark:bg-slate-800/60"
                    : "border-blue-100/60 bg-white/70 dark:border-blue-800/60 dark:bg-blue-900/40",
              )}
            >
              {tier.label && (
                <Badge
                  className={cn(
                    "absolute right-4 top-4 py-1",
                    index === 1
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {tier.label}
                </Badge>
              )}

              <CardHeader className="mt-12">
                <CardTitle className="text-center">{tier.title}</CardTitle>
                <div className="mt-4 text-center">
                  <div className={tier.hasRandSign ? "-ml-12" : ""}>
                    {tier.originalPrice && (
                      <span
                        className={cn(
                          "text-lg line-through",
                          index === 1
                            ? "text-primary-foreground/70"
                            : "text-gray-400",
                        )}
                      >
                        {tier.hasRandSign
                          ? `R${tier.originalPrice}`
                          : tier.originalPrice}{" "}
                      </span>
                    )}
                    <span
                      className={cn(
                        "ml-2 text-4xl font-bold",
                        index === 1
                          ? "text-primary-foreground"
                          : "text-primary",
                      )}
                    >
                      {tier.hasRandSign ? `R${tier.price}` : tier.price}{" "}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "ml-1 text-sm",
                      index === 1
                        ? "text-primary-foreground/70"
                        : "text-gray-500",
                    )}
                  >
                    {tier.timeline}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className={cn(
                    "mb-8 mt-3 w-full transition-all duration-300",
                    index === 1
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                  asChild
                >
                  <Link href={tier.link}>{tier.cta}</Link>
                </Button>

                <ul className="space-y-1.5">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <Check
                        className={cn(
                          "h-5 w-5",
                          index === 1
                            ? "text-primary-foreground"
                            : "text-primary",
                        )}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* volume discount note for recruiters */}
      {isRecruiter && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 text-center"
        >
          <p className="text-sm font-medium italic text-slate-700 dark:text-slate-300">
            Volume discounts available. A 5-person team pays under R3,500/month
            total.
          </p>
        </motion.div>
      )}

      {/* custom pricing note */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p
          className={cn(
            "text-sm transition-colors duration-300",
            isRecruiter
              ? "text-slate-600 dark:text-slate-400"
              : "text-gray-600 dark:text-gray-400",
          )}
        >
          Need a custom plan?
          <Link
            href="https://cal.com/profileprep/quick-chat"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Let&apos;s chat about pricing that works for you
          </Link>
        </p>
        <p
          className={cn(
            "mt-2 text-xs transition-colors duration-300",
            isRecruiter
              ? "text-slate-500 dark:text-slate-500"
              : "text-gray-500 dark:text-gray-500",
          )}
        >
          All prices in South African Rands (ZAR) • Monthly billing • Cancel
          anytime
        </p>
      </motion.div>
    </Section>
  );
}

function Cta({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-10 md:py-20"
    >
      <motion.section
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex justify-center rounded-lg py-10 transition-all duration-700 md:py-20",
          isRecruiter
            ? "bg-gradient-to-r from-slate-600 to-blue-600 dark:from-slate-700 dark:to-blue-700"
            : "bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800",
        )}
      >
        <div className="container px-4 text-center md:px-6">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mb-2 text-3xl font-bold text-white"
          >
            {content.finalCta.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className={cn(
              "mb-8 transition-colors duration-700",
              isRecruiter
                ? "text-slate-100 dark:text-slate-200"
                : "text-blue-100 dark:text-blue-200",
            )}
          >
            {content.finalCta.subtitle}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              variant="secondary"
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
              size="lg"
              className="bg-white text-primary transition-all duration-300 hover:bg-white"
              asChild
            >
              <Link href="/login">{content.finalCta.cta}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.section>
  );
}

function InstitutionalSection({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;
  const sectionData = isRecruiter ? content.enterprise : content.institutional;

  // Only render if the section data exists
  if (!sectionData) return null;

  return (
    <Section
      title={sectionData.title}
      className={cn(
        "transition-all duration-700",
        isRecruiter
          ? "bg-gradient-to-r from-slate-50/40 to-gray-50/40 dark:from-slate-900/30 dark:to-gray-900/30"
          : "bg-gradient-to-r from-blue-50/40 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20",
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mx-auto max-w-4xl"
      >
        {/* ROI Section */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center"
        >
          <TrendingUp
            className={cn(
              "mx-auto mb-2 h-6 w-6",
              isRecruiter ? "text-primary" : "text-primary",
            )}
          />
          <p
            className={cn(
              "mx-auto mb-3 max-w-2xl font-medium",
              isRecruiter
                ? "text-slate-700 dark:text-slate-300"
                : "text-gray-700 dark:text-gray-300",
            )}
          >
            {sectionData.roi}
          </p>
          {isRecruiter && content.enterprise?.comparison && (
            <p
              className={cn(
                "mx-auto max-w-xl text-sm",
                isRecruiter
                  ? "text-slate-500 dark:text-slate-500"
                  : "text-gray-500 dark:text-gray-500",
              )}
            >
              {content.enterprise.comparison}
            </p>
          )}
        </motion.div>

        {/* Template Offer */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p
            className={cn(
              "text-sm transition-colors duration-300",
              isRecruiter
                ? "text-slate-600 dark:text-slate-400"
                : "text-gray-600 dark:text-gray-400",
            )}
          >
{sectionData.templatePrompt}
            <Link
              href="/contact"
              className="ml-1 font-medium text-primary hover:underline"
            >
              {sectionData.templateOffer}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function Faq({ content }: { content: ContentItem }) {
  const isRecruiter = content === recruiterContent;

  return (
    <Section
      title={content.faq.title}
      className={cn(
        "transition-all duration-700",
        isRecruiter
          ? "bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/20"
          : "bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/10",
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl"
      >
        <Accordion type="single" collapsible>
          {content.faq.items.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="transition-all duration-300"
              >
                <AccordionTrigger className="transition-colors duration-300">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </Section>
  );
}
