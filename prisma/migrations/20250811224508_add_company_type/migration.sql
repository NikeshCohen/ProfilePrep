-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('RECRUITER', 'CANDIDATE_ORG');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('RECRUITER', 'CANDIDATE', 'TESTER');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "allowedDocsPerUsers" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "allowedTemplates" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "companyType" "CompanyType" NOT NULL DEFAULT 'RECRUITER',
ADD COLUMN     "createdTemplates" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTestAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'RECRUITER';

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateContent" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_docs" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rightToWork" TEXT NOT NULL,
    "salaryExpectation" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "generated_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileContent" TEXT NOT NULL,
    "companyName" TEXT,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "atsScore" INTEGER NOT NULL,
    "atsFeedback" JSONB NOT NULL,
    "toneScore" INTEGER NOT NULL,
    "toneFeedback" JSONB NOT NULL,
    "contentScore" INTEGER NOT NULL,
    "contentFeedback" JSONB NOT NULL,
    "structureScore" INTEGER NOT NULL,
    "structureFeedback" JSONB NOT NULL,
    "skillsScore" INTEGER NOT NULL,
    "skillsFeedback" JSONB NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "grammarFeedback" JSONB NOT NULL,
    "keywordScore" INTEGER NOT NULL,
    "keywordFeedback" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_analyses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_docs" ADD CONSTRAINT "generated_docs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_docs" ADD CONSTRAINT "generated_docs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_analyses" ADD CONSTRAINT "cv_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
