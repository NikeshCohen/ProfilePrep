"use client";

import React from "react";

import { content } from "@/constants/webcontent";
import { ArrowRightIcon, Check, X } from "lucide-react";

import Section from "@/components/global/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="layout">
      <Hero />
      <Features />
      <Comparison />
      <Pricing />
      <Cta />
      <Faq />
    </div>
  );
}

function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center py-24 md:py-48">
      <div className="mt-16 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <Badge className="mb-8 animate-shimmer border border-primary/20 bg-[linear-gradient(110deg,#000103,45%,#486185,55%,#000103)] bg-[length:200%_100%] py-2 font-bold text-white dark:bg-[linear-gradient(110deg,hsl(217,91%,60%),45%,hsl(217,91%,75%),55%,hsl(217,91%,60%))] dark:bg-[length:200%_100%] dark:text-accent-foreground">
            {content.hero.badge}
          </Badge>

          <div className="mt-2">
            <h1 className="mb-6 space-y-1 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              From Raw to{" "}
              <span className="font-bold text-primary">Client Ready</span>
              <span className="block">
                {" "}
                in <span className="font-bold text-primary">Seconds</span>
              </span>
            </h1>
            <p className="mx-auto mb-4 max-w-[700px] pb-2.5 text-muted-foreground">
              {content.hero.description}
            </p>
          </div>

          <Button
            effect="expandIcon"
            icon={ArrowRightIcon}
            iconPlacement="right"
            className="mt-1 px-6"
          >
            {content.hero.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <Section
      title={
        <>
          {content.features.title}{" "}
          <span className="block text-primary lg:inline">
            {content.features.titleHighlight}
          </span>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {content.features.items.map((feature, index) => (
          <Card key={index} className="bg-background/40">
            <CardContent className="pt-6">
              <feature.icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Comparison() {
  return (
    <Section title={content.comparison.title}>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/40">
          <CardHeader>
            <CardTitle>{content.comparison.pitfallsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {content.comparison.pitfalls.map((pitfall, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{pitfall}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">
              {content.comparison.advantagesTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {content.comparison.advantages.map((advantage, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section title={content.pricing.title}>
      <div className="grid gap-6 md:grid-cols-3">
        {content.pricing.tiers.map((tier, index) => (
          <Card
            key={index}
            className={`relative ${index === 1 ? "bg-primary text-primary-foreground" : ""}`}
          >
            {tier.isEarlyBird && (
              <Badge
                className={`absolute right-4 top-4 ${index === 1 ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}
              >
                {content.pricing.earlyBirdLabel}
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{tier.title}</CardTitle>
              <div className="mt-4">
                {tier.originalPrice && (
                  <span
                    className={`text-lg ${index === 1 ? "text-primary-foreground/70" : "text-gray-400"} line-through`}
                  >
                    ${tier.originalPrice}
                  </span>
                )}
                <span
                  className={`ml-2 text-4xl font-bold ${index === 1 ? "text-primary-foreground" : "text-primary"}`}
                >
                  ${tier.price}
                </span>
                <span
                  className={`ml-1 text-sm ${index === 1 ? "text-primary-foreground/70" : "text-gray-500"}`}
                >
                  per user / month
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-2"
                  >
                    <Check
                      className={`h-5 w-5 ${index === 1 ? "text-primary-foreground" : "text-primary"}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-6 w-full ${index === 1 ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
              >
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Cta() {
  return (
    <section className="py-10 md:py-20">
      <section className="place-items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 py-10 md:py-20">
        <div className="container px-4 text-center md:px-6">
          <h2 className="mb-2 text-3xl font-bold text-white">
            {content.finalCta.title}
          </h2>
          <p className="mb-8 text-blue-100">{content.finalCta.subtitle}</p>
          <Button variant="secondary" size="lg" effect="shineHover">
            {content.finalCta.cta}
          </Button>
        </div>
      </section>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = React.useState<string>("");
  return (
    <Section title={content.faq.title}>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible value={openIndex}>
          {content.faq.items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger
                // toggle open on hover
                onMouseEnter={() => setOpenIndex(`item-${index}`)}
                onMouseLeave={() => setOpenIndex("")}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
