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

// Generate philosophical foundation for each topic
function generatePhilosophy(
  topic: string,
  field: string,
  careerStage: string,
  preferences?: GuidancePreferences,
): string {
  const basePhilosophies = {
    cvOptimisation: () => {
      let philosophy = `Your CV isn't just a document—it's your professional story, told with intention and precision. Every line matters because someone, somewhere, is making decisions about your future based on what you've written. And here's what I've learned: the best CVs aren't the ones that follow every rule to the letter, they're the ones that capture who you are whilst speaking directly to what the reader needs to hear.

Think about it—when you're scanning through dozens of applications, what makes you pause? It's not the perfect formatting or the buzzword-heavy descriptions. It's the moment when you can actually see the person behind the paper, when their achievements feel real and relevant to what you're trying to accomplish.`;

      if (preferences?.experienceLevel === "changing") {
        philosophy += ` Career changes require a different kind of storytelling altogether. You're not just presenting your history—you're building bridges between where you've been and where you're going. Every skill you've developed, every challenge you've navigated, becomes part of a larger narrative about adaptability and growth.`;
      }

      if (preferences?.currentChallenges?.includes("employment_gaps")) {
        philosophy += ` Employment gaps aren't failures to hide—they're chapters in your story that deserve thoughtful explanation. Sometimes the most interesting people are the ones who've taken unconventional paths.`;
      }

      return philosophy;
    },

    coverLetters: () => {
      return `Cover letters have become this strange, almost extinct art form that everyone says they don't read, yet somehow they still matter. The truth is, a brilliant cover letter won't get you the job, but it might get you the conversation. And sometimes, that conversation is everything.

I've seen people treat cover letters like afterthoughts—generic templates with company names swapped out like some kind of professional mad libs. But when done properly, a cover letter is where you get to be human. It's where you can explain the why behind your what, where you can address the obvious questions before they're even asked.

The best cover letters I've encountered don't just repeat what's on the CV—they provide context, they show personality, they demonstrate that the person has actually thought about this specific opportunity rather than just clicking apply on everything that moves. They feel like the beginning of a real conversation, not the end of a tedious application process.`;
    },

    interviewPrep: () => {
      let philosophy = `Interviews are peculiar things, aren't they? These artificial conversations where everyone's trying to be the best version of themselves whilst simultaneously trying to figure out if this could actually work. The pressure to be perfect is overwhelming, but here's what I've discovered: the best interviews happen when both sides drop the performance and start having a real conversation about possibilities.`;

      if (preferences?.currentChallenges?.includes("interview_anxiety")) {
        philosophy += ` Interview anxiety isn't something to overcome—it's something to work with. That nervous energy? It means you care. The key isn't to eliminate it but to channel it into preparation that feels genuine rather than rehearsed.`;
      }

      philosophy += ` The most successful people I know approach interviews like investigations. They're not just answering questions—they're gathering information, testing compatibility, figuring out whether this is somewhere they actually want to spend their days. That shift in perspective changes everything.`;

      return philosophy;
    },

    careerGrowth: () => {
      return `Career growth isn't a ladder you climb—it's more like a garden you tend. Some seasons are about planting new skills, others about pruning what's no longer serving you. Some years bring rapid growth, others are about deepening your roots and building resilience for what's coming next.

The conventional wisdom tells you to have a five-year plan, to know exactly where you're headed. But the most interesting careers I've witnessed have been built through a combination of intentional choices and unexpected opportunities. You can't plan for everything, but you can stay curious, keep learning, and remain open to possibilities you hadn't considered.

What matters isn't having all the answers—it's asking better questions. What kind of work energises you? What problems do you find yourself naturally gravitating towards? What would you regret not attempting? These aren't questions you answer once and file away. They're questions you keep returning to as you grow and change.`;
    },

    salaryNegotiation: () => {
      let philosophy = `Money conversations are awkward for most of us. We've been conditioned to think that asking for what we're worth is somehow unseemly, that we should be grateful for whatever's offered. But here's what I've learned: organisations that are uncomfortable discussing compensation fairly probably aren't places you want to work anyway.`;

      if (preferences?.currentChallenges?.includes("salary_negotiation")) {
        philosophy += ` Salary negotiation isn't about being aggressive or demanding—it's about having honest conversations about value. When you've done your research, when you understand your worth in the market, when you can articulate the specific value you bring, these conversations become less about confrontation and more about finding mutual understanding.`;
      }

      philosophy += ` The best negotiations happen when both sides want to find a solution that works. It's not about winning or losing—it's about establishing a foundation for a productive working relationship where everyone feels respected and fairly compensated.`;

      return philosophy;
    },
  };

  return (
    basePhilosophies[topic as keyof typeof basePhilosophies]?.() ||
    `Professional guidance tailored for ${field} professionals at ${careerStage} level.`
  );
}

export function generateCVContent(
  field: string,
  specialization: string,
  careerStage: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const baseStrategies = [
    "Lead with achievements that demonstrate impact, not just responsibilities",
    "Use specific metrics wherever possible—numbers tell stories that words alone cannot",
    "Tailor your language to match the industry whilst keeping your authentic voice",
    "Structure your experience to highlight progression and growth over time",
  ];

  const enhancedStrategies = preferences?.primaryGoals?.includes(
    "career_change",
  )
    ? [
        ...baseStrategies,
        "Emphasise transferable skills that bridge your previous experience with your target role",
        "Include relevant projects, volunteering, or self-directed learning that demonstrates commitment to your new direction",
        "Frame your career change as evolution rather than departure—show the connecting threads",
      ]
    : baseStrategies;

  const atsOptimisation = [
    "Use standard section headings that software can recognise and parse correctly",
    "Include relevant keywords naturally within your descriptions—forced keyword stuffing is obvious and counterproductive",
    "Save your CV as both a Word document and PDF, but submit the format they've requested",
    "Use consistent formatting throughout—if you bold one job title, bold them all",
  ];

  const examples = preferences?.priorityTopics?.includes("cv-optimization")
    ? [
        `Strong achievement example: "Redesigned the customer onboarding process, reducing completion time by 40% and increasing user satisfaction scores from 6.2 to 8.7"`,
        `Weak alternative: "Responsible for improving customer onboarding"`,
        `Context matters: "Led a cross-functional team of 8 through a complex system migration during peak trading season, maintaining 99.9% uptime"`,
        `Show progression: "Promoted twice within 18 months based on consistently exceeding sales targets and developing junior team members"`,
      ]
    : [];

  const sections = [
    {
      title: "Core Strategy",
      content: enhancedStrategies,
      estimatedTimeMinutes: estimateReadingTime(enhancedStrategies),
    },
    {
      title: "ATS Optimisation",
      content: atsOptimisation,
      estimatedTimeMinutes: estimateReadingTime(atsOptimisation),
    },
  ];

  if (examples.length > 0) {
    sections.push({
      title: "Practical Examples",
      content: examples,
      estimatedTimeMinutes: estimateReadingTime(examples),
    });
  }

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "cv-optimization",
    title: "CV Optimisation",
    description:
      "Transform your CV into a compelling professional narrative that opens doors",
    philosophy: generatePhilosophy(
      "cvOptimisation",
      field,
      careerStage,
      preferences,
    ),
    sections,
    totalEstimatedTime: totalTime,
    difficulty:
      preferences?.experienceLevel === "entry" ? "beginner" : "intermediate",
  };
}

export function generateCoverLetterContent(
  field: string,
  specialization: string,
  careerStage: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const structure = [
    "Open with something that demonstrates you've actually researched this specific opportunity",
    "Connect your experience to their specific challenges—show you understand their world",
    "Share a brief story that illustrates your approach to work, not just what you've done",
    "Close with genuine enthusiasm and a clear next step",
  ];

  const personalisation = [
    "Reference recent company news, achievements, or initiatives that genuinely interested you",
    "Mention specific aspects of the role that align with your career goals—be honest about what excites you",
    "Use language that mirrors their company culture whilst remaining authentically you",
    "Address any obvious questions your application might raise—gaps, career changes, location moves",
  ];

  const sections = [
    {
      title: "Essential Structure",
      content: structure,
      estimatedTimeMinutes: estimateReadingTime(structure),
    },
    {
      title: "Personalisation Strategy",
      content: personalisation,
      estimatedTimeMinutes: estimateReadingTime(personalisation),
    },
  ];

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "cover-letters",
    title: "Cover Letter Excellence",
    description:
      "Master the art of the cover letter—when everyone else is phoning it in",
    philosophy: generatePhilosophy(
      "coverLetters",
      field,
      careerStage,
      preferences,
    ),
    sections,
    totalEstimatedTime: totalTime,
    difficulty: "intermediate",
  };
}

export function generateInterviewContent(
  field: string,
  specialization: string,
  careerStage: string,
  preferences?: GuidancePreferences,
): TopicContent {
  const preparation = [
    "Research the company beyond their website—look at recent projects, leadership changes, industry challenges they're facing",
    "Prepare specific examples using the STAR method, but don't sound robotic when you deliver them",
    "Develop thoughtful questions that demonstrate you're evaluating them as much as they're evaluating you",
    "Practice your responses, but leave room for genuine conversation and unexpected directions",
  ];

  const starMethod = [
    "Situation: Set the scene briefly—what was happening and why it mattered",
    "Task: Explain your specific role and what you were trying to achieve",
    "Action: Describe what you actually did—be specific about your contributions",
    "Result: Share the outcome and what you learned from the experience",
  ];

  let commonQuestions = [
    "Tell me about yourself—this isn't your life story, it's your professional narrative",
    "Why are you interested in this role?—connect your career goals to their opportunity",
    "What are your greatest strengths?—choose strengths that are relevant and backed by examples",
    "Describe a challenging situation—focus on your problem-solving process and resilience",
  ];

  if (preferences?.currentChallenges?.includes("behavioral_questions")) {
    commonQuestions = [
      ...commonQuestions,
      "Tell me about a time you disagreed with a colleague—focus on resolution and learning",
      "Describe a failure and what you learned from it—choose something that led to growth",
      "How do you handle stress or pressure?—give specific strategies and examples",
    ];
  }

  const tips = preferences?.currentChallenges?.includes("interview_anxiety")
    ? [
        "Arrive early and spend a few minutes in your car or nearby café to centre yourself",
        "Bring a notepad and pen—taking notes shows engagement and gives your hands something to do",
        "Remember that some nervousness is normal and even positive—it shows you care",
        "Focus on having a conversation rather than delivering a performance",
      ]
    : [];

  const sections = [
    {
      title: "Strategic Preparation",
      content: preparation,
      estimatedTimeMinutes: estimateReadingTime(preparation),
    },
    {
      title: "The STAR Method",
      content: starMethod,
      estimatedTimeMinutes: estimateReadingTime(starMethod),
    },
    {
      title: "Common Questions",
      content: commonQuestions,
      estimatedTimeMinutes: estimateReadingTime(commonQuestions),
    },
  ];

  if (tips.length > 0) {
    sections.push({
      title: "Managing Anxiety",
      content: tips,
      estimatedTimeMinutes: estimateReadingTime(tips),
    });
  }

  const totalTime = sections.reduce(
    (total, section) => total + section.estimatedTimeMinutes,
    0,
  );

  return {
    id: "interview-prep",
    title: "Interview Mastery",
    description:
      "Transform interviews from interrogations into meaningful conversations",
    philosophy: generatePhilosophy(
      "interviewPrep",
      field,
      careerStage,
      preferences,
    ),
    sections,
    totalEstimatedTime: totalTime,
    difficulty:
      preferences?.experienceLevel === "entry" ? "beginner" : "intermediate",
  };
}
