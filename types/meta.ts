// content typing
export interface ContentItem {
  hero: {
    badge: string;
    title: React.ReactNode;
    description: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      description: string;
    }>;
  };
  comparison: {
    title: string;
    pitfallsTitle: string;
    advantagesTitle: string;
    pitfalls: string[];
    advantages: string[];
  };
  pricing: {
    title: string;
    tiers: Array<{
      title: string;
      originalPrice?: string;
      price: string;
      hasRandSign?: boolean;
      timeline: string;
      features: string[];
      label?: string;
      cta: string;
      link: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
  };
  institutional?: {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
    roi: string;
    cta: string;
    templateOffer: string;
    templatePrompt?: string;
  };
  enterprise?: {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
    roi: string;
    comparison?: string;
    cta: string;
    templateOffer: string;
    templatePrompt?: string;
  };
}
