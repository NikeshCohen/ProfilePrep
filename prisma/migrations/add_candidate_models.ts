import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add CANDIDATE to UserRole enum
  // This is schema modification which might require manual migration

  // Create the JobListing model
  await prisma.$executeRaw`
    CREATE TABLE "job_listings" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "salaryRange" TEXT NOT NULL,
      "skills" TEXT[] NOT NULL,
      "status" TEXT NOT NULL,
      "companyId" TEXT,
      "createdBy" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id")
    );
  `;

  // Create the CandidateProfile model
  await prisma.$executeRaw`
    CREATE TABLE "candidate_profiles" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "masterCVUploaded" BOOLEAN NOT NULL DEFAULT false,
      "masterCVContent" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "candidate_profiles_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "candidate_profiles_userId_key" UNIQUE ("userId")
    );
  `;

  // Create the JobApplication model
  await prisma.$executeRaw`
    CREATE TABLE "job_applications" (
      "id" TEXT NOT NULL,
      "jobListingId" TEXT NOT NULL,
      "candidateId" TEXT NOT NULL,
      "tailoredCVId" TEXT,
      "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
    );
  `;

  // Add foreign key constraints
  await prisma.$executeRaw`
    ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_companyId_fkey" 
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_createdBy_fkey" 
    FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobListingId_fkey" 
    FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_candidateId_fkey" 
    FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_tailoredCVId_fkey" 
    FOREIGN KEY ("tailoredCVId") REFERENCES "generated_docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `;

  // Add new fields to existing GeneratedDocs model
  await prisma.$executeRaw`
    ALTER TABLE "generated_docs" ADD COLUMN "isTailoredForJob" BOOLEAN NOT NULL DEFAULT false;
  `;

  await prisma.$executeRaw`
    ALTER TABLE "generated_docs" ADD COLUMN "jobDescription" TEXT;
  `;

  console.log('Migration completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 