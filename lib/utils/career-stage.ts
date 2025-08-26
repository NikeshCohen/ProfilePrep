// Career stage mapping utility
export function formatCareerStage(
  systemValue: string | undefined | null,
): string {
  if (!systemValue) return "your career stage";

  const careerStageMap: Record<string, string> = {
    EARLY_CAREER: "early career",
    earlyCareer: "early career",
    MID_LEVEL: "mid-level",
    midCareer: "mid-level",
    SENIOR_LEVEL: "senior level",
    seniorCareer: "senior level",
    EXECUTIVE: "executive level",
    executive: "executive level",
    CAREER_CHANGER: "career transition",
    careerChanger: "career transition",
    // Legacy support
    entry: "early career",
    mid: "mid-level",
    senior: "senior level",
    changing: "career transition",
  };

  return (
    careerStageMap[systemValue] || systemValue.toLowerCase().replace(/_/g, " ")
  );
}

export function formatField(field: string | undefined | null): string {
  if (!field) return "your industry";

  // Capitalize first letter and handle common field names
  return field.charAt(0).toUpperCase() + field.slice(1);
}
