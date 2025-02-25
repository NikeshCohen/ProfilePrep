import { Clock, FileCheck, Target, Users } from "lucide-react";

export const content = {
  hero: {
    badge: "FREE TRIAL - FIRST 5 CVS ON US!",
    title: "From Raw CV to Client-Ready in",
    subtitle: "Seconds",
    description: (
      <>
        <b>Stop wasting hours</b> on manual formatting!
        <br />
        Our tool transforms messy candidate CVs into polished documents
        <b> instantly</b>.
      </>
    ),
    cta: "Get Started",
  },
  features: {
    title: "Format CVs at Lightning Speed",
    titleHighlight: "Save Hours Each Day",
    items: [
      {
        icon: Clock,
        title: "Instant Formatting",
        description:
          "Transform any CV into your company template in seconds, not hours.",
      },
      {
        icon: FileCheck,
        title: "Consistent Branding",
        description:
          "Every CV follows your exact formatting guidelines and company style.",
      },
      {
        icon: Users,
        title: "Bulk Processing",
        description:
          "Format multiple CVs simultaneously - perfect for high-volume recruiting.",
      },
      {
        icon: Target,
        title: "Client-Ready Output",
        description:
          "Professional, clean documents ready to send to your clients immediately.",
      },
    ],
  },
  comparison: {
    title: "Why Choose Our CV Formatter",
    pitfallsTitle: "Manual CV Formatting",
    advantagesTitle: "AI-Powered Formatting",
    pitfalls: [
      "Hours spent on manual formatting",
      "Inconsistent styling across team",
      "Human errors and oversights",
      "Delayed submissions to clients",
    ],
    advantages: [
      "Instant formatting in seconds",
      "Consistent company branding",
      "Perfect accuracy every time",
      "Immediate client submissions",
    ],
  },

  pricing: {
    title: "Pricing",
    tiers: [
      {
        title: "Startup",
        originalPrice: "15",
        price: "10",
        hasDollarSign: true,
        timeline: "monthly",
        features: ["Up to 30 CVs per month"],
        isEarlyBird: true,
        cta: "Try Now",
        link: "https://cal.com/profileprep/quick-chat",
      },
      {
        title: "Growth",
        hasDollarSign: true,
        originalPrice: "35",
        price: "25",
        timeline: "monthly",
        features: ["Up to 150 CVs per month"],
        isEarlyBird: true,
        cta: "Try Now",
        link: "https://cal.com/profileprep/quick-chat",
      },
      {
        title: "Enterprise",
        price: "Custom",
        timeline: "monthly",
        features: ["Unlimited CVs"],
        cta: "Contact Sales",
        hasDollarSign: false,
        label: "Scale with Us",
        link: "https://cal.com/profileprep/quick-chat",
      },
    ],
    earlyBirdLabel: "Launch Offer",
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How quickly can I format a CV?",
        answer:
          "Our AI processes most CVs in under 10 seconds. Even complex documents with multiple pages and custom formatting are completed in under 30 seconds.",
      },
      {
        question: "Can I use my existing company template?",
        answer:
          "Yes! We'll set up your exact company template during onboarding. Your CVs will maintain consistent branding across your entire team.",
      },
      {
        question: "What file formats do you support?",
        answer:
          "We support all common CV formats including Word, PDF, Google Docs, and plain text files. The output will be in your preferred format.",
      },
      {
        question: "Is there a limit to CV length or complexity?",
        answer:
          "No limits! Our system handles CVs of any length or complexity while maintaining perfect formatting throughout the document.",
      },
    ],
  },
  finalCta: {
    title: "Ready to Stop Manually Formatting CVs?",
    subtitle:
      "Try it for FREE with your first 5 CVs and see how much time you save!",
    cta: "Try Now",
  },
};
