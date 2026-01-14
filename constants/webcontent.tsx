import {
  Award,
  BarChart3,
  Brain,
  Search,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const candidateContent = {
  hero: {
    badge: "AI-POWERED CV OPTIMIZATION",
    title: (
      <>
        Land Your <span className="text-primary">Dream Job</span>
        <span className="block">With AI-Optimized CVs</span>
      </>
    ),
    description:
      "Get past ATS filters, impress recruiters, and land more interviews. Our AI analyzes and optimizes your CV for maximum impact.",
    cta: "Start Free Analysis",
  },
  features: {
    title: "Everything You Need to Stand Out",
    items: [
      {
        icon: Search,
        title: "ATS Score Analysis",
        description:
          "Get detailed ATS compatibility scores and see exactly how to improve your CV's visibility.",
      },
      {
        icon: Brain,
        title: "AI-Powered Feedback",
        description:
          "Receive personalized suggestions to enhance your CV's content, structure, and keywords.",
      },
      {
        icon: TrendingUp,
        title: "Progress Tracking",
        description:
          "Monitor your CV improvements over time with detailed analytics and performance metrics.",
      },
      {
        icon: Award,
        title: "Industry Best Practices",
        description:
          "Templates and guidance based on successful placements across various industries.",
      },
    ],
  },
  comparison: {
    title: "Why AI-Optimized CVs Win",
    pitfallsTitle: "Traditional CV Approach",
    advantagesTitle: "ProfilePrep Advantage",
    pitfalls: [
      "Generic CVs that don't stand out",
      "Missing crucial ATS keywords",
      "Poor formatting that confuses systems",
      "No feedback on what's not working",
      "Bulk licensing challenges for institutions",
      "Limited progress tracking capabilities",
    ],
    advantages: [
      "Tailored CVs for each application",
      "Optimized for ATS algorithms",
      "Professional formatting guaranteed",
      "Real-time improvement suggestions",
      "Special education rates for bulk licensing",
      "Career center dashboard with progress tracking",
    ],
  },
  pricing: {
    title: "Choose Your Career Investment",
    tiers: [
      {
        title: "Essential",
        originalPrice: "299",
        price: "149",
        hasRandSign: true,
        timeline: "per month",
        features: [
          "5 CV analyses per month",
          "ATS compatibility analysis",
          "Basic CV optimization",
          "Email support",
          "Analysis history",
        ],
        label: "Entry Level",
        cta: "Start 7-Day Trial",
        link: "/login",
      },
      {
        title: "Professional",
        originalPrice: "799",
        price: "399",
        hasRandSign: true,
        timeline: "per month",
        features: [
          "25 CV analyses per month",
          "Advanced ATS optimization",
          "Career guidance hub",
          "Progress tracking",
          "Detailed analytics",
          "Priority email support",
        ],
        label: "Most Popular",
        cta: "Start 7-Day Trial",
        link: "/login",
      },
      {
        title: "Career Accelerator",
        originalPrice: "1199",
        price: "699",
        hasRandSign: true,
        timeline: "per month",
        features: [
          "100 CV analyses per month",
          "Full career guidance access",
          "Advanced analytics dashboard",
          "Document management",
          "Progress insights",
          "Priority support",
        ],
        label: "Best Value",
        cta: "Get Started",
        link: "/login",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How does the ATS optimization work?",
        answer:
          "Our AI analyzes your CV against known ATS algorithms, checking for keyword density, formatting issues, and structure. We provide specific recommendations to improve your score and visibility to recruiters.",
      },
      {
        question: "Can I use ProfilePrep for different industries?",
        answer:
          "Absolutely! Our AI is trained on successful CVs across all major industries. It adapts recommendations based on your target role and industry requirements.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Most users report a 40% increase in interview callbacks within the first month. Our real-time optimization means your CV improves immediately after implementing our suggestions.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we take data security seriously using industry-standard encryption and secure authentication. We never share your personal information with third parties, and your CV data is used solely to provide you with optimization insights.",
      },
    ],
  },
  finalCta: {
    title: "Ready to Get More Interviews?",
    subtitle:
      "Join thousands of successful candidates who've optimized their way to their dream jobs.",
    cta: "Start Your Free Analysis",
  },
  institutional: {
    title: "Perfect for Universities & Career Centers",
    subtitle:
      "Help your students and graduates stand out in a competitive job market",
    description:
      "With South Africa's youth unemployment at 46,1%, every advantage counts. ProfilePrep gives your students the edge they need to secure interviews and launch successful careers.",
    benefits: [
      "Special education rates for bulk student licensing",
      "Progress tracking dashboard for career centers",
      "Training materials for counselors",
      "White-label integration options",
    ],
    roi: "With South Africa's youth unemployment at 46,1%, every advantage counts. Universities using ProfilePrep report 40% higher placement rates within 6 months of graduation.",
    cta: "Get Education Pricing",
    templateOffer: "We'll help you present ProfilePrep to your career center.",
    templatePrompt: "Presenting to your university?",
  },
};

export const recruiterContent = {
  hero: {
    badge: "ENTERPRISE RECRUITMENT SOLUTION",
    title: (
      <>
        Transform <span className="text-primary">Raw CVs</span>
        <span className="block">
          Into <span className="text-primary">Client-Ready</span> Documents
        </span>
      </>
    ),
    description:
      "Save hours on CV formatting. Our AI instantly transforms candidate CVs into professional, branded documents that win clients.",
    cta: "Start Free Trial",
  },
  features: {
    title: "Built for Modern Recruitment Teams",
    items: [
      {
        icon: Zap,
        title: "Instant Formatting",
        description:
          "Transform any CV into your company template in under 10 seconds. No manual editing required.",
      },
      {
        icon: Shield,
        title: "Brand Consistency",
        description:
          "Ensure every CV matches your company's professional standards and visual identity.",
      },
      {
        icon: Users,
        title: "Team Collaboration",
        description:
          "Multiple team members can process CVs simultaneously with role-based permissions.",
      },
      {
        icon: BarChart3,
        title: "Performance Analytics",
        description:
          "Track placement rates, processing times, and ROI with comprehensive dashboards.",
      },
    ],
  },
  comparison: {
    title: "The Competitive Edge You Need",
    pitfallsTitle: "Manual CV Processing",
    advantagesTitle: "ProfilePrep Automation",
    pitfalls: [
      "2-3 hours per CV formatting",
      "Inconsistent quality across team",
      "Delayed client submissions",
      "High operational costs",
      "Bottlenecked placements",
    ],
    advantages: [
      "10 seconds per CV processing",
      "100% brand consistency maintained",
      "Instant client presentations",
      "80% cost reduction",
      "40% faster time-to-placement",
    ],
  },
  pricing: {
    title: "Affordable Pricing for SA Recruitment Teams",
    tiers: [
      {
        title: "Individual Recruiter",
        originalPrice: "799",
        price: "399",
        hasRandSign: true,
        timeline: "per person/month",
        features: [
          "25 CV optimizations/month",
          "Template management",
          "Basic analytics",
          "Email support",
          "Document storage",
          "User management",
        ],
        label: "Solo",
        cta: "Start 14-Day Trial",
        link: "https://cal.com/profileprep/quick-chat",
      },
      {
        title: "Team Member",
        originalPrice: "1299",
        price: "699",
        hasRandSign: true,
        timeline: "per person/month",
        features: [
          "75 CV optimizations/month",
          "Advanced template tools",
          "Team member management",
          "Advanced analytics",
          "Document management",
          "Priority email support",
          "Multi-user access",
        ],
        label: "Most Popular",
        cta: "Book Demo",
        link: "https://cal.com/profileprep/quick-chat",
      },
      {
        title: "Enterprise",
        originalPrice: "1999",
        price: "1199",
        hasRandSign: true,
        timeline: "per person/month",
        features: [
          "150 CV optimizations/month",
          "Full template access",
          "Enterprise analytics",
          "Advanced user management",
          "Priority support",
          "Custom document workflows",
          "Enhanced collaboration",
          "Dedicated account support",
        ],
        label: "Best Value",
        cta: "Contact Sales",
        link: "https://cal.com/profileprep/quick-chat",
      },
    ],
  },
  faq: {
    title: "Questions from Recruitment Leaders",
    items: [
      {
        question: "How does ProfilePrep integrate with our existing ATS?",
        answer:
          "ProfilePrep currently focuses on CV optimization and formatting. While we don't offer direct ATS integrations at this time, we provide our own candidate portal with comprehensive ATS analysis support, demonstrating that ATS compatibility is a core priority for us. Our optimized CVs are compatible with all major ATS platforms and can be easily uploaded to your existing systems.",
      },
      {
        question: "Can we use our existing CV templates?",
        answer:
          "Yes! You can create and customize multiple templates through our template management system for different clients or industries. Our platform provides template creation tools to match your branding requirements.",
      },
      {
        question: "What's the ROI for recruitment agencies?",
        answer:
          "Our platform streamlines CV processing and formatting workflows, allowing consultants to focus on higher-value activities like client relationships and candidate sourcing. The time savings and improved presentation quality can contribute to better placement rates.",
      },
      {
        question: "How secure is candidate data?",
        answer:
          "We implement robust security measures including secure authentication, data encryption, and privacy-focused data handling. All candidate data is processed with strict confidentiality and stored securely with appropriate access controls.",
      },
    ],
  },
  finalCta: {
    title: "Ready to 10x Your Recruitment Efficiency?",
    subtitle:
      "Join leading agencies who've automated their CV processing and won more clients.",
    cta: "Schedule Your Demo",
  },
  enterprise: {
    title: "Calculate Your Savings",
    subtitle: "Scale your operations without scaling your headcount",
    description:
      "One recruiter with ProfilePrep can handle the CV workload of 2-3 traditional recruiters. That's R18,000-37,000 saved monthly on salaries while increasing placement rates.",
    benefits: [
      "Streamline CV processing workflows",
      "Instant optimization and formatting",
      "Consistent brand presentation",
      "Performance analytics and insights",
    ],
    roi: "One recruiter with ProfilePrep can handle the CV workload of 2-3 traditional recruiters. Save R18,000-37,000 monthly on salaries while increasing placement rates.",
    cta: "Calculate Your Savings",
    templateOffer: "We'll help you build the business case for your agency.",
    templatePrompt: "Pitching to leadership?",
  },
};

export const siteConfig = {
  supportEmail: "info.profileprep@gmail.com",
};

export const content = candidateContent;
