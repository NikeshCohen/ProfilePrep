import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.cVAnalysis.deleteMany();
    await prisma.generatedDocs.deleteMany();
    await prisma.template.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // Create recruiter companies
    console.log("🏢 Creating recruiter companies...");

    const demoCompany = await prisma.company.create({
      data: {
        id: "demo-company-id",
        name: "Demo Recruitment Ltd",
        allowedDocsPerUsers: 1000,
        allowedTemplates: 10,
        createdTemplates: 0,
        companyType: "RECRUITER",
      },
    });

    void (await prisma.company.create({
      data: {
        id: "tech-recruiters-id",
        name: "TechTalent Recruiters",
        allowedDocsPerUsers: 20,
        allowedTemplates: 5,
        createdTemplates: 0,
        companyType: "RECRUITER",
      },
    }));

    void (await prisma.company.create({
      data: {
        id: "global-consulting-id",
        name: "Global Consulting Group",
        allowedDocsPerUsers: 30,
        allowedTemplates: 8,
        createdTemplates: 0,
        companyType: "RECRUITER",
      },
    }));

    console.log("✅ Recruiter companies created");

    // Create candidate organizations
    console.log("🏢 Creating candidate organizations...");

    const techBootcamp = await prisma.company.create({
      data: {
        id: "tech-bootcamp-id",
        name: "TechCareer Bootcamp",
        allowedDocsPerUsers: 5,
        allowedTemplates: 0,
        createdTemplates: 0,
        companyType: "CANDIDATE_ORG",
      },
    });

    const universityCareerCenter = await prisma.company.create({
      data: {
        id: "uni-career-center-id",
        name: "University Career Center",
        allowedDocsPerUsers: 10,
        allowedTemplates: 0,
        createdTemplates: 0,
        companyType: "CANDIDATE_ORG",
      },
    });

    void (await prisma.company.create({
      data: {
        id: "placement-agency-id",
        name: "NextStep Career Services",
        allowedDocsPerUsers: 15,
        allowedTemplates: 0,
        createdTemplates: 0,
        companyType: "CANDIDATE_ORG",
      },
    }));

    console.log("✅ Candidate organizations created");

    // Create templates for recruiter companies
    console.log("📄 Creating templates...");

    await prisma.template.create({
      data: {
        id: "demo-template-1",
        name: "Standard CV Template",
        templateContent: `# {{candidateName}}

## Contact Information
- **Location:** {{location}}
- **Right to Work:** {{rightToWork}}
- **Salary Expectation:** {{salaryExpectation}}

## Professional Summary
{{summary}}

## Key Skills
{{skills}}

## Professional Experience
{{experience}}

## Education
{{education}}

## Additional Notes
{{notes}}

---
*Document prepared by {{company}} - {{date}}*`,
        companyId: demoCompany.id,
      },
    });

    await prisma.template.create({
      data: {
        id: "demo-template-2",
        name: "Executive Summary Template",
        templateContent: `# Executive Profile: {{candidateName}}

## Executive Summary
{{summary}}

## Core Competencies
{{skills}}

## Career Highlights
{{experience}}

## Educational Background
{{education}}

## Candidate Details
- **Current Location:** {{location}}
- **Work Authorization:** {{rightToWork}}
- **Compensation Requirements:** {{salaryExpectation}}

## Additional Information
{{notes}}

---
*Confidential - Prepared by {{company}}*`,
        companyId: demoCompany.id,
      },
    });

    // Update created templates count
    await prisma.company.update({
      where: { id: demoCompany.id },
      data: { createdTemplates: 2 },
    });

    console.log("✅ Templates created");

    // Create recruiter users
    console.log("👥 Creating recruiter users...");

    const demoRecruiter = await prisma.user.create({
      data: {
        email: "demo@profileprep.com",
        name: "Demo Recruiter",
        isTestAccount: true,
        role: "USER",
        userType: "RECRUITER",
        allowedDocs: 1000,
        createdDocs: 0,
        companyId: demoCompany.id,
        onboardingCompleted: true,
        field: "Technology",
        specializations: ["Software Engineering", "Cloud Computing"],
        careerStage: "EXPERIENCED",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Technology",
          specializations: ["Software Engineering", "Cloud Computing"],
          careerStage: "EXPERIENCED",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    });

    const adminRecruiter = await prisma.user.create({
      data: {
        email: "admin.demo@profileprep.com",
        name: "Admin Recruiter",
        isTestAccount: true,
        role: "ADMIN",
        userType: "RECRUITER",
        allowedDocs: 1000,
        createdDocs: 0,
        companyId: demoCompany.id,
        onboardingCompleted: true,
        field: "Finance",
        specializations: ["Investment Banking", "Risk Management"],
        careerStage: "SENIOR",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Finance",
          specializations: ["Investment Banking", "Risk Management"],
          careerStage: "SENIOR",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    });

    void (await prisma.user.create({
      data: {
        email: "superadmin.demo@profileprep.com",
        name: "Super Admin",
        isTestAccount: true,
        role: "SUPERADMIN",
        userType: "RECRUITER",
        allowedDocs: 9999,
        createdDocs: 0,
        companyId: demoCompany.id,
        onboardingCompleted: true,
        field: "Healthcare",
        specializations: ["Medical Devices", "Pharmaceutical"],
        careerStage: "EXECUTIVE",
        newsletterSubscribed: false,
        guidancePreferences: {
          field: "Healthcare",
          specializations: ["Medical Devices", "Pharmaceutical"],
          careerStage: "EXECUTIVE",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    }));

    console.log("✅ Recruiter users created");

    // Create candidate users
    console.log("👥 Creating candidate users...");

    const demoCandidate = await prisma.user.create({
      data: {
        email: "candidate.demo@profileprep.com",
        name: "Demo Candidate",
        isTestAccount: true,
        role: "USER",
        userType: "CANDIDATE",
        allowedDocs: 10,
        createdDocs: 0,
        onboardingCompleted: true,
        field: "Technology",
        specializations: ["Software Engineering", "Data Science"],
        careerStage: "MID_LEVEL",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Technology",
          specializations: ["Software Engineering", "Data Science"],
          careerStage: "MID_LEVEL",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    });

    const candidateWithOrg = await prisma.user.create({
      data: {
        email: "student@profileprep.com",
        name: "Student User",
        isTestAccount: true,
        role: "USER",
        userType: "CANDIDATE",
        allowedDocs: 10,
        createdDocs: 0,
        companyId: universityCareerCenter.id,
        onboardingCompleted: true,
        field: "Marketing",
        specializations: ["Digital Marketing", "Content Marketing"],
        careerStage: "ENTRY_LEVEL",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Marketing",
          specializations: ["Digital Marketing", "Content Marketing"],
          careerStage: "ENTRY_LEVEL",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    });

    void (await prisma.user.create({
      data: {
        email: "career.admin@profileprep.com",
        name: "Career Center Admin",
        isTestAccount: true,
        role: "ADMIN",
        userType: "CANDIDATE",
        allowedDocs: 100,
        createdDocs: 0,
        companyId: universityCareerCenter.id,
        onboardingCompleted: true,
        field: "Education",
        specializations: ["Career Counseling", "Student Services"],
        careerStage: "EXPERIENCED",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Education",
          specializations: ["Career Counseling", "Student Services"],
          careerStage: "EXPERIENCED",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    }));

    void (await prisma.user.create({
      data: {
        email: "admin.candidate.demo@profileprep.com",
        name: "Admin Candidate Demo",
        isTestAccount: true,
        role: "ADMIN",
        userType: "CANDIDATE",
        allowedDocs: 1000,
        createdDocs: 0,
        companyId: techBootcamp.id,
        onboardingCompleted: true,
        field: "Technology",
        specializations: ["Full Stack Development", "DevOps"],
        careerStage: "SENIOR",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Technology",
          specializations: ["Full Stack Development", "DevOps"],
          careerStage: "SENIOR",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    }));

    const bootcampStudent1 = await prisma.user.create({
      data: {
        email: "bootcamp1@profileprep.com",
        name: "Bootcamp Student 1",
        isTestAccount: true,
        role: "USER",
        userType: "CANDIDATE",
        allowedDocs: 5,
        createdDocs: 0,
        companyId: techBootcamp.id,
        onboardingCompleted: false,
        field: null,
        specializations: [],
        careerStage: null,
        newsletterSubscribed: false,
        guidancePreferences: null,
        lastGuidanceAccess: null,
      },
    });

    const bootcampStudent2 = await prisma.user.create({
      data: {
        email: "bootcamp2@profileprep.com",
        name: "Bootcamp Student 2",
        isTestAccount: true,
        role: "USER",
        userType: "CANDIDATE",
        allowedDocs: 5,
        createdDocs: 0,
        companyId: techBootcamp.id,
        onboardingCompleted: true,
        field: "Technology",
        specializations: ["Frontend Development", "UX/UI Design"],
        careerStage: "ENTRY_LEVEL",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Technology",
          specializations: ["Frontend Development", "UX/UI Design"],
          careerStage: "ENTRY_LEVEL",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    });

    void (await prisma.user.create({
      data: {
        email: "bootcamp.admin@profileprep.com",
        name: "Bootcamp Instructor",
        isTestAccount: true,
        role: "ADMIN",
        userType: "CANDIDATE",
        allowedDocs: 50,
        createdDocs: 0,
        companyId: techBootcamp.id,
        onboardingCompleted: true,
        field: "Technology",
        specializations: ["Software Engineering", "Teaching"],
        careerStage: "EXPERIENCED",
        newsletterSubscribed: true,
        guidancePreferences: {
          field: "Technology",
          specializations: ["Software Engineering", "Teaching"],
          careerStage: "EXPERIENCED",
          lastUpdated: new Date().toISOString(),
        },
        lastGuidanceAccess: new Date(),
      },
    }));

    console.log("✅ Candidate users created");

    // Create sample generated documents for recruiters
    console.log("📋 Creating sample documents...");

    const sampleDocs = [
      {
        id: "demo-doc-1",
        candidateName: "John Smith",
        documentTitle: "Senior Software Engineer - TechCorp",
        location: "London, UK",
        rightToWork: "UK Citizen",
        salaryExpectation: "£80,000 - £95,000",
        notes:
          "Position at TechCorp - Strong background in cloud architecture and DevOps",
        content: `# John Smith

## Contact Information
- **Location:** London, UK
- **Right to Work:** UK Citizen
- **Salary Expectation:** £80,000 - £95,000

## Professional Summary
Experienced Senior Software Engineer with 8+ years in cloud-native application development and DevOps practices.

## Key Skills
- Cloud Architecture (AWS, Azure)
- Kubernetes & Docker
- Python, Java, Go
- CI/CD Pipeline Design

## Professional Experience
**Senior Software Engineer** - CurrentTech Ltd (2020-Present)
- Led migration of monolithic application to microservices architecture
- Reduced deployment time by 70% through CI/CD improvements

## Education
BSc Computer Science - University of London (2012-2016)

---
*Document prepared by Demo Recruitment Ltd*`,
        createdBy: demoRecruiter.id,
        companyId: demoCompany.id,
      },
      {
        id: "demo-doc-2",
        candidateName: "Sarah Johnson",
        documentTitle: "Product Manager - FinTech Solutions",
        location: "Manchester, UK",
        rightToWork: "UK Settled Status",
        salaryExpectation: "£70,000 - £85,000",
        notes:
          "Position at FinTech Solutions - Excellent track record in B2B SaaS products",
        content: `# Sarah Johnson

## Contact Information
- **Location:** Manchester, UK
- **Right to Work:** UK Settled Status
- **Salary Expectation:** £70,000 - £85,000

## Professional Summary
Results-driven Product Manager with 6+ years experience in FinTech and B2B SaaS.

## Key Skills
- Product Strategy & Roadmapping
- User Research & Analytics
- Agile/Scrum Management
- Data Analysis (SQL, Tableau)

## Professional Experience
**Senior Product Manager** - FinanceFlow (2021-Present)
- Launched 3 major features increasing user engagement by 45%
- Managed product roadmap for £2M ARR product line

## Education
MBA - Manchester Business School (2016-2018)

---
*Document prepared by Demo Recruitment Ltd*`,
        createdBy: adminRecruiter.id,
        companyId: demoCompany.id,
      },
      {
        id: "demo-doc-3",
        candidateName: "Michael Chen - AI Innovations",
        documentTitle: "Data Scientist",
        location: "Birmingham, UK",
        rightToWork: "UK Citizen",
        salaryExpectation: "£65,000 - £75,000",
        notes: "Position at AI Innovations - Strong ML/AI background",
        content: `# Michael Chen

## Contact Information
- **Location:** Birmingham, UK
- **Right to Work:** UK Citizen
- **Salary Expectation:** £65,000 - £75,000

## Professional Summary
Data Scientist with 5+ years experience in machine learning and AI applications.

## Key Skills
- Machine Learning (TensorFlow, PyTorch)
- Data Analysis (Python, R, SQL)
- Statistical Modeling
- Big Data (Spark, Hadoop)

## Professional Experience
**Data Scientist** - DataTech Solutions (2019-Present)
- Developed predictive models improving customer retention by 35%
- Built and deployed ML pipelines for real-time analytics

## Education
MSc Data Science - University of Birmingham (2017-2019)

---
*Document prepared by Demo Recruitment Ltd*`,
        createdBy: demoRecruiter.id,
        companyId: demoCompany.id,
      },
    ];

    for (const doc of sampleDocs) {
      await prisma.generatedDocs.create({
        data: doc,
      });
    }

    // Update created docs count
    await prisma.user.update({
      where: { id: demoRecruiter.id },
      data: { createdDocs: 2 },
    });

    await prisma.user.update({
      where: { id: adminRecruiter.id },
      data: { createdDocs: 1 },
    });

    console.log("✅ Sample documents created");

    // Create sample CV analyses for candidates
    console.log("📊 Creating sample CV analyses...");

    const analyses = [
      {
        id: "demo-analysis-1",
        fileName: "john_smith_cv.pdf",
        fileContent: "Senior Software Engineer with 8+ years experience...",
        jobTitle: "Senior Software Engineer",
        jobDescription:
          "We are looking for a Senior Software Engineer to join our team...",
        overallScore: 85,
        atsScore: 90,
        atsFeedback: {
          score: 90,
          feedback: "Excellent keyword match",
          improvements: ["Add more specific technologies"],
          tips: [
            {
              type: "good" as const,
              tip: "Excellent keyword match",
              explanation:
                "Your CV contains the right keywords for ATS systems",
            },
            {
              type: "improve" as const,
              tip: "Add more specific technologies",
              explanation:
                "Include specific programming languages and frameworks you've used",
            },
          ],
        },
        toneScore: 80,
        toneFeedback: {
          score: 80,
          feedback: "Professional tone maintained throughout",
          tips: [
            {
              type: "good" as const,
              tip: "Professional tone maintained throughout",
              explanation: "Your language is appropriate and professional",
            },
          ],
        },
        contentScore: 85,
        contentFeedback: {
          score: 85,
          feedback: "Strong relevant experience highlighted",
          tips: [
            {
              type: "good" as const,
              tip: "Strong relevant experience highlighted",
              explanation:
                "Your work history aligns well with the job requirements",
            },
          ],
        },
        structureScore: 88,
        structureFeedback: {
          score: 88,
          feedback: "Well-organized with clear sections",
          tips: [
            {
              type: "good" as const,
              tip: "Well-organized with clear sections",
              explanation:
                "Your CV structure makes it easy for recruiters to find information",
            },
          ],
        },
        skillsScore: 92,
        skillsFeedback: {
          score: 92,
          feedback: "Technical skills align well with requirements",
          tips: [
            {
              type: "good" as const,
              tip: "Technical skills align well with requirements",
              explanation:
                "Your skill set matches what employers are looking for",
            },
          ],
        },
        grammarScore: 95,
        grammarFeedback: {
          score: 95,
          feedback: "Excellent grammar and spelling",
          tips: [
            {
              type: "good" as const,
              tip: "Excellent grammar and spelling",
              explanation: "Your writing is clear and error-free",
            },
          ],
        },
        keywordScore: 87,
        keywordFeedback: {
          score: 87,
          feedback: "Good keyword density and placement",
          tips: [
            {
              type: "good" as const,
              tip: "Good keyword density and placement",
              explanation:
                "You've used relevant keywords effectively throughout your CV",
            },
          ],
        },
        companyName: "TechCorp Solutions",
        userId: demoCandidate.id,
      },
      {
        id: "demo-analysis-2",
        fileName: "sarah_johnson_cv.pdf",
        fileContent: "Product Manager with expertise in FinTech...",
        jobTitle: "Senior Product Manager",
        jobDescription:
          "Seeking experienced Product Manager for our FinTech division...",
        overallScore: 92,
        atsScore: 95,
        atsFeedback: {
          score: 95,
          feedback: "Outstanding keyword optimization",
          improvements: [],
        },
        toneScore: 90,
        toneFeedback: {
          score: 90,
          feedback: "Excellent professional tone",
        },
        contentScore: 93,
        contentFeedback: {
          score: 93,
          feedback: "Highly relevant experience and achievements",
        },
        structureScore: 91,
        structureFeedback: {
          score: 91,
          feedback: "Perfect structure and formatting",
        },
        skillsScore: 94,
        skillsFeedback: {
          score: 94,
          feedback: "Skills perfectly match job requirements",
        },
        grammarScore: 98,
        grammarFeedback: {
          score: 98,
          feedback: "Flawless grammar and spelling",
        },
        keywordScore: 92,
        keywordFeedback: {
          score: 92,
          feedback: "Excellent keyword placement and density",
        },
        companyName: "FinTech Innovations",
        userId: candidateWithOrg.id,
      },
      {
        id: "demo-analysis-3",
        fileName: "bootcamp_grad_cv.pdf",
        fileContent: "Recent bootcamp graduate seeking first developer role...",
        jobTitle: "Junior Developer",
        jobDescription:
          "Entry-level developer position for recent graduates...",
        overallScore: 72,
        atsScore: 75,
        atsFeedback: {
          score: 75,
          feedback: "Good for entry level",
          improvements: [
            "Add personal projects",
            "Include bootcamp technologies",
          ],
        },
        toneScore: 78,
        toneFeedback: {
          score: 78,
          feedback: "Enthusiastic but professional",
        },
        contentScore: 68,
        contentFeedback: {
          score: 68,
          feedback: "Limited experience but shows potential",
        },
        structureScore: 82,
        structureFeedback: {
          score: 82,
          feedback: "Good structure for entry-level CV",
        },
        skillsScore: 70,
        skillsFeedback: {
          score: 70,
          feedback: "Basic skills covered, add more technologies",
        },
        grammarScore: 88,
        grammarFeedback: {
          score: 88,
          feedback: "Good grammar with minor improvements needed",
        },
        keywordScore: 73,
        keywordFeedback: {
          score: 73,
          feedback: "Include more technical keywords",
        },
        companyName: "StartupXYZ",
        userId: bootcampStudent1.id,
      },
      {
        id: "demo-analysis-4",
        fileName: "career_change_cv.pdf",
        fileContent: "Transitioning from teaching to data science...",
        jobTitle: "Data Analyst",
        jobDescription:
          "Data Analyst role for candidates with analytical skills...",
        overallScore: 78,
        atsScore: 76,
        atsFeedback: {
          score: 76,
          feedback: "Good transferable skills highlighted",
          improvements: [
            "Emphasize data projects",
            "Add technical certifications",
          ],
        },
        toneScore: 85,
        toneFeedback: {
          score: 85,
          feedback: "Professional and compelling narrative",
        },
        contentScore: 75,
        contentFeedback: {
          score: 75,
          feedback:
            "Strong transferable skills, needs more technical experience",
        },
        structureScore: 83,
        structureFeedback: {
          score: 83,
          feedback: "Well-structured for career change",
        },
        skillsScore: 72,
        skillsFeedback: {
          score: 72,
          feedback: "Good analytical skills, add more technical tools",
        },
        grammarScore: 92,
        grammarFeedback: {
          score: 92,
          feedback: "Excellent writing quality",
        },
        keywordScore: 74,
        keywordFeedback: {
          score: 74,
          feedback: "Add more data science keywords",
        },
        companyName: "DataCorp Analytics",
        userId: bootcampStudent2.id,
      },
    ];

    for (const analysis of analyses) {
      await prisma.cVAnalysis.create({
        data: analysis,
      });
    }

    // Update created docs count for candidates
    await prisma.user.update({
      where: { id: demoCandidate.id },
      data: { createdDocs: 1 },
    });

    await prisma.user.update({
      where: { id: candidateWithOrg.id },
      data: { createdDocs: 1 },
    });

    await prisma.user.update({
      where: { id: bootcampStudent1.id },
      data: { createdDocs: 1 },
    });

    await prisma.user.update({
      where: { id: bootcampStudent2.id },
      data: { createdDocs: 1 },
    });

    console.log("✅ Sample CV analyses created");

    // Display summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Seed completed successfully!");
    console.log("=".repeat(60));

    console.log("\n📋 Demo Accounts Created:");
    console.log("\n🏢 RECRUITER ACCOUNTS:");
    console.log("  👤 Regular: demo@profileprep.com / Demo2024!");
    console.log("  🔧 Admin: admin.demo@profileprep.com / Admin2024!");
    console.log(
      "  👑 SuperAdmin: superadmin.demo@profileprep.com / SuperAdmin2024!",
    );

    console.log("\n🎓 CANDIDATE ACCOUNTS:");
    console.log(
      "  👤 Individual: candidate.demo@profileprep.com / Candidate2024!",
    );
    console.log(
      "  🔧 Admin: admin.candidate.demo@profileprep.com / AdminCandidate2024!",
    );
    console.log("  📚 Student: student@profileprep.com / Student2024!");
    console.log(
      "  🏫 Career Admin: career.admin@profileprep.com / CareerAdmin2024!",
    );
    console.log(
      "  💻 Bootcamp Student 1: bootcamp1@profileprep.com / Bootcamp2024!",
    );
    console.log(
      "  💻 Bootcamp Student 2: bootcamp2@profileprep.com / Bootcamp2024!",
    );
    console.log(
      "  👨‍🏫 Bootcamp Admin: bootcamp.admin@profileprep.com / BootcampAdmin2024!",
    );

    console.log("\n🏢 Organizations Created:");
    console.log("  Recruiter Companies: 3");
    console.log("  Candidate Organizations: 3");
    console.log("  Total Users: 12");
    console.log("  Sample Documents: 2");
    console.log("  Sample CV Analyses: 4");
    console.log("  Templates: 2");

    console.log("\n🚀 All test accounts have password authentication enabled!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
