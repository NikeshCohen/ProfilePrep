"use client";

import {
  GuidancePreferences,
  TopicContent,
} from "@/lib/guidance/content/types";

// Time estimation based on content complexity and length
function estimateReadingTime(contentItems: string[]): number {
  const averageWordsPerMinute = 200;
  const totalWords = contentItems.join(" ").split(" ").length;
  return Math.max(2, Math.ceil(totalWords / averageWordsPerMinute));
}

// Generate philosophical foundation for recruiter topics
function generateRecruiterPhilosophy(
  topic: string,
  field: string,
  preferences?: GuidancePreferences,
): string {
  const basePhilosophies = {
    sourcing: () => {
      return `Sourcing isn't about casting the widest possible net—it's about understanding exactly what you're looking for and then finding creative ways to connect with those people. The best recruiters I know don't just post jobs and wait; they actively seek out talent, often before those people are even considering a move.

Think about it from the candidate's perspective. They're not just looking for any job—they're looking for the right opportunity at the right time in their career. Your role is to become someone they trust to present opportunities that are genuinely worth their consideration. That means understanding not just their skills, but their motivations, their career aspirations, their working style preferences.

The relationship between recruiter and candidate should be consultative, not transactional. When you take the time to understand what drives someone, what challenges them, what they're trying to build in their career, you become a valuable connection rather than just another person trying to fill a slot.`;
    },

    screening: () => {
      let philosophy = `Screening candidates is part art, part science, and entirely about understanding people. Anyone can check boxes on a skills list, but identifying someone who will thrive in a specific role, within a particular team culture, solving certain types of problems—that requires genuine insight into human motivation and capability.`;

      if (preferences?.currentChallenges?.includes("candidate_assessment")) {
        philosophy += ` The challenge isn't just identifying who can do the job—it's identifying who will do the job well, who will grow within the role, who will contribute positively to the team dynamic. These assessments require looking beyond the CV to understand drive, adaptability, and cultural fit.`;
      }

      philosophy += ` The best screening conversations feel like consultations rather than interrogations. You're not trying to catch candidates out—you're trying to understand whether this opportunity aligns with their career goals and working style as much as whether their skills align with the role requirements.`;

      return philosophy;
    },

    marketInsights: () => {
      return `Market intelligence isn't just about salary benchmarks and skill shortages—though those matter enormously. It's about understanding the forces shaping how people work, what they value, how industries are evolving, and what that means for both clients and candidates.

The recruitment landscape shifts constantly. Remote work has changed everything about geographic boundaries. Generational differences in work values affect retention and motivation. Economic uncertainty impacts people's willingness to take risks. Understanding these broader trends helps you provide genuine strategic value rather than just filling immediate needs.

When you can speak knowledgeably about market conditions, salary trends, skill developments, and industry challenges, you become a trusted advisor rather than just a vendor. Clients come to you not just when they need to hire, but when they need to think strategically about talent planning.`;
    },
  };

  return (
    basePhilosophies[topic as keyof typeof basePhilosophies]?.() ||
    `Professional guidance for ${field} recruitment specialists.`
  );
}

export function generateSourcingContent(
  field: string,
  _specialization: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const platforms = [
    "LinkedIn remains the foundation, but don't limit yourself to basic searches—use Sales Navigator features and Boolean search techniques",
    "Industry-specific job boards often have more engaged, relevant candidates than generalist sites",
    "Professional associations and community groups where your ideal candidates actually spend time",
    "Employee referral programs—your best employees often know other excellent people",
  ];

  if (preferences?.priorityTopics?.includes("sourcing")) {
    platforms.push(
      `GitHub and Stack Overflow for technical roles—look at actual code and contributions`,
      `Twitter and professional blogs for thought leaders and subject matter experts`,
      `University career services for graduate recruitment and early career talent`,
    );
  }

  const strategies = [
    "Develop compelling job descriptions that speak to career aspirations, not just skill requirements",
    "Build talent pipelines before you need them—maintain relationships with interesting people who aren't currently looking",
    "Use social selling techniques to engage with potential candidates through valuable content and insights",
    "Focus on quality conversations rather than quantity of applications—better to have five genuinely interested candidates than fifty who are just clicking apply",
  ];

  const outreach =
    preferences?.learningStyle === "interactive"
      ? [
          "Personalise every connection request—show you've actually looked at their profile and work",
          "Lead with value, not need—share insights about the market, interesting opportunities, industry trends",
          "Follow up consistently but respectfully—most people don't respond to the first message",
          "Build relationships even when you don't have an immediate opportunity—the best placements often come from long-term connections",
        ]
      : [];

  const sections = [
    {
      title: "Platform Strategy",
      content: platforms,
      estimatedTimeMinutes: estimateReadingTime(platforms),
    },
    {
      title: "Sourcing Techniques",
      content: strategies,
      estimatedTimeMinutes: estimateReadingTime(strategies),
    },
  ];

  if (outreach.length > 0) {
    sections.push({
      title: "Outreach Mastery",
      content: outreach,
      estimatedTimeMinutes: estimateReadingTime(outreach),
    });
  }

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "sourcing",
    title: "Strategic Sourcing",
    description:
      "Master the art of finding exceptional talent before your competitors do",
    philosophy: generateRecruiterPhilosophy("sourcing", field, preferences),
    sections,
    totalEstimatedTime: totalTime,
    difficulty: "intermediate",
  };
}

export function generateScreeningContent(
  field: string,
  _specialization: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const criteria = [
    "Technical skills and qualifications—the baseline requirements for success in the role",
    "Cultural alignment—how well they'll integrate with existing team dynamics and company values",
    "Growth potential—their capacity and desire to develop within the role and organisation",
    "Communication skills—both technical communication and interpersonal effectiveness",
  ];

  if (preferences?.priorityTopics?.includes("screening")) {
    criteria.push(
      `Problem-solving approach—how they think through challenges and make decisions`,
      `Adaptability and resilience—particularly important in fast-changing environments`,
      `Leadership potential—even for individual contributor roles, future leadership capacity matters`,
    );
  }

  const redFlags = preferences?.currentChallenges?.includes(
    "candidate_assessment",
  )
    ? [
        "Inconsistencies in timeline or responsibilities that they can't explain clearly",
        "Inability to provide specific examples when asked about achievements or challenges",
        "Poor preparation for the conversation—shows lack of genuine interest",
        "Unrealistic salary expectations without understanding of market conditions",
        "Negative comments about previous employers or colleagues—red flag for culture fit",
      ]
    : [];

  const questions = [
    "What attracts you to this particular role and our organisation?—tests genuine interest and research",
    "Tell me about a challenging project you've worked on recently—assesses problem-solving and communication",
    "How do you approach learning new skills or technologies?—reveals growth mindset and adaptability",
    "What questions do you have about the role or our team?—shows level of engagement and strategic thinking",
  ];

  if (preferences?.pacePreference === "structured") {
    questions.push(
      "Walk me through your decision-making process for a significant career move",
      "How do you prioritise competing demands when everything seems urgent?",
      "Describe your ideal work environment and management style preferences",
    );
  }

  const sections = [
    {
      title: "Assessment Criteria",
      content: criteria,
      estimatedTimeMinutes: estimateReadingTime(criteria),
    },
    {
      title: "Effective Questions",
      content: questions,
      estimatedTimeMinutes: estimateReadingTime(questions),
    },
  ];

  if (redFlags.length > 0) {
    sections.push({
      title: "Warning Signs",
      content: redFlags,
      estimatedTimeMinutes: estimateReadingTime(redFlags),
    });
  }

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "screening",
    title: "Candidate Assessment",
    description:
      "Develop the skills to identify exceptional talent and cultural fit",
    philosophy: generateRecruiterPhilosophy("screening", field, preferences),
    sections,
    totalEstimatedTime: totalTime,
    difficulty: "advanced",
  };
}

export function generateMarketInsightsContent(
  field: string,
  _specialization: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const trends = preferences?.priorityTopics?.includes("market-insights")
    ? [
        `${field} industry growth projections and emerging opportunities`,
        "Remote work impact on hiring practices and salary expectations",
        "Skills shortages and surplus areas within your specialisation",
        "Generational differences in work values and career priorities",
      ]
    : [];

  const salaryData = preferences?.primaryGoals?.includes("market_analysis")
    ? [
        `${field} salary benchmarks across experience levels and geographic regions`,
        "Total compensation trends including equity, benefits, and flexible arrangements",
        "Contract versus permanent rate comparisons and market drivers",
        "Salary negotiation patterns and successful strategies by role level",
      ]
    : [];

  const skills = preferences?.currentChallenges?.includes("skill_assessment")
    ? [
        `Most in-demand ${field} skills and certifications currently driving premium salaries`,
        "Emerging technology requirements and their impact on career trajectories",
        "Soft skills importance rankings based on successful placements and retention data",
        "Skills gap analysis—where supply doesn't meet demand in your market",
      ]
    : [];

  const sections = [];

  if (trends.length > 0) {
    sections.push({
      title: "Industry Trends",
      content: trends,
      estimatedTimeMinutes: estimateReadingTime(trends),
    });
  }

  if (salaryData.length > 0) {
    sections.push({
      title: "Compensation Intelligence",
      content: salaryData,
      estimatedTimeMinutes: estimateReadingTime(salaryData),
    });
  }

  if (skills.length > 0) {
    sections.push({
      title: "Skills Analysis",
      content: skills,
      estimatedTimeMinutes: estimateReadingTime(skills),
    });
  }

  // Default content if no preferences specified
  if (sections.length === 0) {
    const defaultContent = [
      "Monitor industry publications, reports, and thought leadership content regularly",
      "Build relationships with other recruiters and industry professionals for market intelligence sharing",
      "Track placement success rates and candidate feedback to understand market dynamics",
      "Maintain databases of salary offers, acceptance rates, and retention data for benchmarking",
    ];

    sections.push({
      title: "Market Intelligence Strategy",
      content: defaultContent,
      estimatedTimeMinutes: estimateReadingTime(defaultContent),
    });
  }

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "market-insights",
    title: "Market Intelligence",
    description:
      "Become the trusted advisor who understands market dynamics and trends",
    philosophy: generateRecruiterPhilosophy(
      "marketInsights",
      field,
      preferences,
    ),
    sections,
    totalEstimatedTime: totalTime,
    difficulty: "advanced",
  };
}
