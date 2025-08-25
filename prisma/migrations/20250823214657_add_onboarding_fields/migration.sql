-- AlterTable
ALTER TABLE "users" ADD COLUMN     "careerStage" TEXT,
ADD COLUMN     "field" TEXT,
ADD COLUMN     "guidancePreferences" JSONB,
ADD COLUMN     "lastGuidanceAccess" TIMESTAMP(3),
ADD COLUMN     "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[];
