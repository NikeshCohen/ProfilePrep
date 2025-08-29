# ProfilePrep - AI-Powered CV Processing Platform

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Core Architecture](#core-architecture)
- [User Systems & Permissions](#user-systems--permissions)
- [Feature Documentation](#feature-documentation)
- [Onboarding Data Mapping](#onboarding-data-mapping)
- [Database & Data Models](#database--data-models)
- [AI Integration](#ai-integration)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Introduction

ProfilePrep is a dual-platform AI-powered application that serves two distinct user bases:

**For Recruiters**: Transform standard CVs into compelling professional profiles with AI-powered document generation, template management, and client-ready outputs.

**For Candidates**: Analyze CVs against job descriptions to receive detailed feedback, ATS compatibility scores, and actionable improvement recommendations.

### Key Features

- **Dual User Experience**: Complete parallel systems for recruiters and candidates
- **AI-Powered Processing**: Google Gemini integration for CV generation and analysis
- **Role-Based Access Control**: Comprehensive permissions system with company/organization scoping
- **Real-Time Analytics**: Live dashboards with performance metrics
- **Template System**: Customizable CV templates for consistent branding
- **Document Management**: Full lifecycle management of generated CVs and analyses

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Google Gemini API key

### Quick Installation

1. **Clone and Install**:

   ```bash
   git clone <repository-url>
   cd ProfilePrep
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
   DIRECT_URL="postgresql://user:password@host:port/database"

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

   # Authentication
   AUTH_SECRET=your_auth_secret # Generate with: openssl rand -base64 32

   # OAuth (Optional - for production)
   AUTH_GOOGLE_ID=your_google_oauth_id
   AUTH_GOOGLE_SECRET=your_google_oauth_secret
   AUTH_LINKEDIN_ID=your_linkedin_oauth_id
   AUTH_LINKEDIN_SECRET=your_linkedin_oauth_secret
   ```

3. **Database Setup**:

   ```bash
   npm run db:migrate
   npm run db:seed  # Includes demo data for development
   ```

4. **Start Development**:

   ```bash
   npm run dev
   ```

5. **Access Demo Accounts** (Development Only):
   - Visit `http://localhost:3000/login`
   - Use demo accounts provided below

### Demo Account System

**⚠️ IMPORTANT: Demo accounts are ONLY available in development mode (`NODE_ENV=development`)**

#### Available Demo Accounts

**Recruiter Accounts:**

- **`demo@profileprep.com`** / `Demo2024!` - Basic recruiter (USER + RECRUITER)
- **`admin.demo@profileprep.com`** / `Admin2024!` - Admin recruiter (ADMIN + RECRUITER)

**Candidate Accounts:**

- **`candidate.demo@profileprep.com`** / `Candidate2024!` - Basic candidate (USER + CANDIDATE)
- **`admin.candidate.demo@profileprep.com`** / `AdminCandidate2024!` - Admin candidate (ADMIN + CANDIDATE)

**System Admin:**

- **`superadmin.demo@profileprep.com`** / `SuperAdmin2024!` - System-wide access

#### Role Switching System

- **Availability**: Only for test accounts (`isTestAccount: true`) in development mode
- **Functionality**: Complete session switching between demo accounts
- **Security**: Completely disabled in production builds

---

## Core Architecture

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js App Router, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (OAuth + Credentials)
- **AI**: Google Gemini API (2.0-flash-001 model)
- **State Management**: TanStack Query for client-side data
- **File Processing**: PDF parsing and text extraction
- **Deployment**: Vercel (recommended)

### Project Structure

```zsh
ProfilePrep/
├── app/                           # Next.js App Router
│   ├── api/                       # API routes
│   │   ├── auth/[...nextauth]/    # NextAuth.js endpoint
│   │   ├── cv/analyze/            # CV analysis API
│   │   └── user/                  # User management APIs
│   ├── app/                       # Main CV processing interface
│   ├── portal/                    # Candidate dashboard & features
│   ├── recruiter/                 # Recruiter dashboard & features
│   ├── dashboard/                 # Admin dashboard (recruiters)
│   └── login/                     # Authentication pages
├── actions/                       # Server actions by domain
│   ├── cv.actions.ts             # CV analysis & generation
│   ├── user.actions.ts           # User management
│   ├── admin.actions.ts          # Admin operations
│   └── queries/                   # TanStack Query hooks
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── shared/                   # Custom reusable components
│   └── global/                   # App-wide components
├── prisma/                       # Database schema & migrations
│   ├── schema/                   # Modular schema files
│   └── migrations/               # Database migrations
├── lib/                          # Utilities & configuration
│   ├── utils.ts                  # General utilities
│   ├── roleUtils.ts              # Role-based access helpers
│   └── redirectUtils.ts          # Navigation utilities
└── types/                        # TypeScript type definitions
```

### Code Organization Patterns

1. **Server Actions**: Domain-specific actions in `actions/[domain].actions.ts`
2. **Client Queries**: TanStack Query hooks in `actions/queries/[domain].queries.ts`
3. **Page Components**: Server components in `app/[route]/page.tsx`
4. **Sub-components**: Client components in `app/[route]/_components/`
5. **Modular Database Schema**: Separate schema files in `prisma/schema/`

---

## User Systems & Permissions

ProfilePrep implements a comprehensive dual-user system with parallel organizational structures.

### User Types

- **RECRUITER**: Users who generate professional CV documents for clients
- **CANDIDATE**: Job seekers who analyze and optimize their CVs
- **TESTER**: Demo/testing accounts with role switching capabilities

### Role Hierarchy

- **USER**: Basic permissions within their user type and organization
- **ADMIN**: Organization-level administrative permissions
- **SUPERADMIN**: System-wide access across all organizations

### Company Types

- **RECRUITER**: Recruitment agencies and recruiting companies
- **CANDIDATE_ORG**: Candidate organizations (universities, career centers, etc.)

### Permission Matrix

| Feature              | Regular User | Admin             | Super Admin    |
| -------------------- | ------------ | ----------------- | -------------- |
| **Recruiters**       |              |                   |                |
| Generate CVs         | ✅ (5/month) | ✅ (Unlimited)    | ✅ (Unlimited) |
| View own documents   | ✅           | ✅                | ✅             |
| Manage company users | ❌           | ✅ (Company)      | ✅ (All)       |
| Create templates     | ❌           | ✅ (Company)      | ✅ (All)       |
| View analytics       | ❌           | ✅ (Company)      | ✅ (System)    |
| **Candidates**       |              |                   |                |
| Analyze CVs          | ✅ (5/month) | ✅ (Unlimited)    | ✅ (Unlimited) |
| View own analyses    | ✅           | ✅                | ✅             |
| Manage org members   | ❌           | ✅ (Organization) | ✅ (All)       |
| View org analytics   | ❌           | ✅ (Organization) | ✅ (System)    |

### Page Access Control

**Recruiter Pages:**

- `/recruiter` - Recruiter dashboard (All recruiter roles)
- `/recruiter/documents` - Document management (All recruiter roles)
- `/recruiter/settings` - Profile settings (All recruiter roles)
- `/dashboard/*` - Admin features (ADMIN+ recruiters only)

**Candidate Pages:**

- `/portal` - Candidate dashboard (All candidate roles)
- `/portal/documents` - Document management (All candidate roles)
- `/portal/analyses` - CV analysis history (All candidate roles)
- `/portal/progress` - Career tracking (All candidate roles)
- `/portal/settings` - Profile settings (All candidate roles)
- `/portal/organization/*` - Admin features (ADMIN+ candidates only)

**Shared Pages:**

- `/app` - CV processing interface (All authenticated users)

---

## Feature Documentation

### For Recruiters

#### CV Document Generation

**Location**: `/app` (recruiter mode)

**Process Flow**:

1. **Upload**: Upload candidate CVs (PDF or text format)
2. **Extract**: AI automatically parses CV content
3. **Enhance**: Add candidate details (name, location, salary, right to work)
4. **Generate**: AI creates professional client-ready document
5. **Customize**: Apply company templates if available
6. **Export**: Download as PDF or copy formatted content

**Key Components**:

- `FileUpload.tsx` - Drag & drop CV upload with PDF parsing
- `CandidateInfo.tsx` - Candidate details form
- `GenerateContent.tsx` - AI-powered document generation
- `CvDisplay.tsx` - Preview and download interface

#### Document Management

**Location**: `/recruiter/documents`

**Features**:

- Real-time document list with database queries
- Document statistics and usage tracking
- Search and filter capabilities
- Download and sharing options
- Company-scoped access (admin can see all company docs)

#### Template System

**Location**: `/dashboard/templates` (Admin only)

**Capabilities**:

- Create custom CV templates for company branding
- Template preview and testing functionality
- Version control and template management
- Company-wide template sharing
- Rich text editing with markdown support

### For Candidates

#### CV Analysis & Optimization

**Location**: `/app` (candidate mode)

**Analysis Process**:

1. **Upload CV**: Submit current CV in PDF or text format
2. **Job Context**: Enter job title and job description for targeted analysis
3. **AI Analysis**: Receive comprehensive multi-dimensional scoring
4. **Detailed Feedback**: Get actionable tips and recommendations
5. **Progress Tracking**: Monitor improvements over time

**Scoring Dimensions**:

- **Overall Score** (0-100): Average across all categories
- **ATS Compatibility**: Keyword matching and system readability
- **Tone & Style**: Professional language and consistency
- **Content Quality**: Impact statements and quantified achievements
- **Structure & Format**: Organization and readability
- **Skills Matching**: Technical skills alignment with job requirements
- **Grammar & Formatting**: Language quality and consistency
- **Keyword Density**: Industry-specific term optimization

**Analysis Components**:

- `AnalyzeContent.tsx` - CV upload and job description input
- `CvDisplay.tsx` - Analysis results and scoring display
- Detailed feedback system with actionable improvement tips

#### Analysis History & Progress

**Location**: `/portal/analyses`

**Features**:

- Complete analysis history with scoring trends
- Comparison between different CV versions
- Progress tracking over time
- Export capabilities for career counseling

#### Organization Management (Admin Candidates)

**Location**: `/portal/organization/*`

**Admin Capabilities**:

- **Member Management**: Add, edit, remove organization members
- **Usage Analytics**: Track member CV analysis performance
- **Organization Analytics**: Aggregate statistics and reporting
- **Member Oversight**: View all member analyses and progress

### Admin Features

#### User Management

**Location**: `/dashboard/users` (Recruiters) / `/portal/organization/members` (Candidates)

**Functionality**:

- Add new organization members with role assignment
- Configure document limits per user
- Monitor user activity and usage
- Role management (USER/ADMIN permissions)
- Real-time member statistics

#### Analytics & Reporting

**Location**: `/dashboard/analytics` / `/portal/organization/analytics`

**Metrics Provided**:

- **Usage Statistics**: Documents generated/analyzed per period
- **Performance Metrics**: Average scores and success rates
- **User Engagement**: Active users and retention metrics
- **System Health**: API usage and performance monitoring
- **Trend Analysis**: Historical data and growth patterns

#### Company/Organization Management

**Location**: `/dashboard/companies` (SUPERADMIN only)

**System Administration**:

- Create and configure new companies/organizations
- Set company-wide limits and permissions
- Cross-organization analytics and reporting
- System health monitoring and maintenance

---

## Onboarding Data Mapping

### User Onboarding Flow

ProfilePrep implements a comprehensive 10-step onboarding process that collects user preferences and stores them in the database. Each step maps to specific database fields:

### Step 1: User Type Selection (OnboardingBackground component)

- **Question**: "I'm a Recruiter" vs "I'm a Job Seeker"
- **Saved to**: `userType` (UserType enum: RECRUITER | CANDIDATE | TESTER)

### Step 2: Field Selection (EnhancedOnboarding - FIELD_SELECTION)

- **Question**: "Select Your Field" (Tech, Healthcare, Finance, etc.)
- **Saved to**: `field` (String)

### Step 3: Specialization Selection (EnhancedOnboarding - SPECIALIZATION)

- **Question**: "Select Specializations" (multiple checkboxes)
- **Saved to**: `specializations` (String[])

### Step 4: Goals & Experience (EnhancedOnboarding - GOALS_EXPERIENCE)

All saved to `guidancePreferences` (Json object) containing:

- **Experience Level**: `guidancePreferences.experienceLevel` (entry|mid|senior|executive|changing)
  - Also mapped to: `careerStage` (entry_level|mid_level|senior_level|executive|career_change)
- **Primary Goals**: `guidancePreferences.primaryGoals` (String[])
- **Job Search Status** (Candidates only): `guidancePreferences.jobSearchStatus` (active|passive|not_looking|starting_soon)

### Step 5: Learning Preferences (EnhancedOnboarding - LEARNING_PREFERENCES)

- **Learning Style**: `guidancePreferences.learningStyle` (visual|reading|interactive|video|mixed)
- **Time Commitment**: `guidancePreferences.timeCommitment` (Number - minutes per week)
- **Pace Preference**: `guidancePreferences.pacePreference` (self_paced|structured|accelerated)

### Step 6: Topic Priorities & Challenges (EnhancedOnboarding - TOPIC_PRIORITIES)

- **Current Challenges**: `guidancePreferences.currentChallenges` (String[])
- **Priority Topics**: `guidancePreferences.priorityTopics` (String[])
- **Urgent Needs**: `guidancePreferences.urgentNeeds` (String[])

### Step 7: Personalization & Preferences (EnhancedOnboarding - PERSONALIZATION)

- **Reminders**: `guidancePreferences.reminders` (Boolean)
- **Progress Sharing**: `guidancePreferences.progressSharing` (Boolean)
- **Mentorship Interest**: `guidancePreferences.mentorshipInterest` (Boolean)
- **Specific Challenges**: `guidancePreferences.specificChallenges` (String - optional)
- **Additional Info**: `guidancePreferences.additionalInfo` (String - optional)

### Step 8: Guidance Preview (EnhancedOnboarding - GUIDANCE_PREVIEW)

- **No data collection** - This step shows a preview of personalized guidance based on previous selections

### Step 9: Features Overview (EnhancedOnboarding - FEATURES)

- **No data collection** - This step showcases platform features relevant to user type

### Step 10: Newsletter (EnhancedOnboarding - NEWSLETTER)

- **Question**: Newsletter subscription checkbox with detailed benefits
- **Saved to**: `newsletterSubscribed` (Boolean)

### Onboarding Data Storage

All onboarding data is processed by the `/api/user/onboarding` endpoint and stored as:

```typescript
{
  userType,              // Set in step 1
  field,                 // From step 2
  specializations,       // From step 3
  careerStage,          // Derived from step 4 experience level
  newsletterSubscribed,  // From step 10
  onboardingCompleted,  // Set to true on completion
  guidancePreferences: {
    field,
    specializations,
    careerStage,
    lastUpdated: new Date().toISOString(),
    // All preferences from steps 4-7
    experienceLevel,
    primaryGoals,
    jobSearchStatus,
    learningStyle,
    timeCommitment,
    pacePreference,
    currentChallenges,
    priorityTopics,
    urgentNeeds,
    reminders,
    progressSharing,
    mentorshipInterest,
    specificChallenges,
    additionalInfo
  }
}
```

### Metadata Fields

- **Onboarding Completion Status**: `onboardingCompleted` (Boolean)
- **Last Guidance Access**: `lastGuidanceAccess` (DateTime)

---

## Database & Data Models

### Core Models

#### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  companyId     String?
  createdDocs   Int       @default(0)
  allowedDocs   Int       @default(5)
  role          UserRole  @default(USER)      // USER, ADMIN, SUPERADMIN
  userType      UserType  @default(RECRUITER) // RECRUITER, CANDIDATE, TESTER
  isTestAccount Boolean   @default(false)     // Demo account flag
  // Relations
  company       Company?  @relation(fields: [companyId], references: [id])
  GeneratedDocs GeneratedDocs[]
  CVAnalyses    CVAnalysis[]
}
```

#### Company Model

```prisma
model Company {
  id                  String      @id @default(cuid())
  name                String
  companyType         CompanyType @default(RECRUITER) // RECRUITER, CANDIDATE_ORG
  allowedDocsPerUsers Int         @default(5)
  allowedTemplates    Int         @default(2)
  // Relations
  users               User[]
  GeneratedDocs       GeneratedDocs[]
  templates           Template[]
}
```

#### Generated Documents (Recruiters)

```prisma
model GeneratedDocs {
  id                String   @id @default(cuid())
  content           String   @db.Text
  candidateName     String
  location          String
  rightToWork       String
  salaryExpectation String
  notes             String   @db.Text
  createdAt         DateTime @default(now())
  // Relations
  user              User     @relation(fields: [createdBy], references: [id])
  company           Company? @relation(fields: [companyId], references: [id])
}
```

#### CV Analysis (Candidates)

```prisma
model CVAnalysis {
  id                String   @id @default(cuid())
  fileName          String
  fileContent       String   @db.Text
  jobTitle          String
  jobDescription    String   @db.Text
  companyName       String?
  // Scoring fields
  overallScore      Int
  atsScore          Int
  toneScore         Int
  contentScore      Int
  structureScore    Int
  skillsScore       Int
  grammarScore      Int
  keywordScore      Int
  // Feedback (JSON)
  atsFeedback       Json
  toneFeedback      Json
  contentFeedback   Json
  structureFeedback Json
  skillsFeedback    Json
  grammarFeedback   Json
  keywordFeedback   Json
  // Relations
  user              User     @relation(fields: [userId], references: [id])
}
```

### Database Operations

#### Company-Scoped Queries

All data access is automatically scoped to the user's company/organization:

```typescript
// Example: Get company documents
const documents = await prisma.generatedDocs.findMany({
  where: {
    companyId: user.companyId,
    // Additional filters based on user role
    ...(user.role === "USER" && { createdBy: user.id }),
  },
});
```

#### Role-Based Access

```typescript
// Example: Admin can see all company data, users see only their own
const canViewAllCompanyData =
  user.role === "ADMIN" || user.role === "SUPERADMIN";
const baseWhere = canViewAllCompanyData
  ? { companyId: user.companyId }
  : { companyId: user.companyId, userId: user.id };
```

---

## AI Integration

### Google Gemini Implementation

#### Model Configuration

```typescript
const selectedModel = google("gemini-2.0-flash-001");
```

#### CV Analysis Flow

1. **Input Processing**: CV text and job description are sanitized and prepared
2. **Prompt Engineering**: Structured prompts with specific formatting requirements
3. **AI Analysis**: Multi-dimensional scoring across 7 categories
4. **Response Parsing**: JSON response validation and error handling
5. **Database Storage**: Structured storage of scores and feedback

#### Analysis Prompt Structure

```typescript
const prepareInstructions = ({ jobTitle, jobDescription }) => `
You are an expert in CV analysis and ATS evaluation.
Analyze the CV across these categories with scores 0-100:

- ATS Compatibility: keyword matching and system readability
- Tone & Style: professional language consistency
- Content Quality: impact statements and achievements
- Structure: organization and hierarchy
- Skills: technical alignment with job requirements  
- Grammar: language quality and formatting
- Keywords: industry-specific term optimization

Return strict JSON format with 3-4 tips per category.
`;
```

#### Response Format

Each analysis returns structured feedback:

```typescript
interface CVFeedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  // ... additional categories
}
```

#### Token Usage Tracking

```typescript
logTokenUsage(response.usage, "CV Analysis");
```

### Document Generation (Recruiters)

#### Template System Integration

- Custom company templates stored in database
- AI applies templates during generation
- Consistent branding across all outputs
- Fallback to default template structure

#### Content Enhancement Process

1. **CV Parsing**: Extract key information from uploaded CV
2. **Information Enrichment**: Add candidate details and company context
3. **Professional Formatting**: Apply consistent formatting and structure
4. **Content Optimization**: Enhance language for client presentation
5. **Template Application**: Apply company-specific branding if available

---

## Development Guide

### Adding New Features

#### 1. Database Changes

```bash
# Update Prisma schema
npm run db:format
npm run db:migrate-cr  # Create migration
npm run db:migrate     # Apply migration
```

#### 2. Server Actions

Create domain-specific actions in `actions/[domain].actions.ts`:

```typescript
"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function newFeatureAction() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Implement feature logic with proper company scoping
  const result = await prisma.model.create({
    data: {
      userId: session.user.id,
      companyId: session.user.companyId,
      // ... other fields
    },
  });

  return { success: true, data: result };
}
```

#### 3. Client Queries

Create TanStack Query hooks in `actions/queries/[domain].queries.ts`:

```typescript
"use client";

import { newFeatureAction } from "@/actions/domain.actions";
import { useQuery } from "@tanstack/react-query";

export function useNewFeature() {
  return useQuery({
    queryKey: ["newFeature"],
    queryFn: () => newFeatureAction(),
  });
}
```

#### 4. Components

Follow the established patterns:

- Server components for data fetching
- Client components for interactivity
- Proper error handling and loading states
- Company-scoped data access

#### 5. Access Control

Ensure proper role and userType checking:

```typescript
export default async function NewFeaturePage() {
  const { user } = await requireAuth("/feature");

  // Role-based feature access
  const canAccessFeature = user.role === 'ADMIN' || user.role === 'SUPERADMIN';

  if (!canAccessFeature) {
    return <AccessDeniedCard />;
  }

  // Component logic...
}
```

### Code Quality Standards

#### TypeScript

- Use strict typing throughout
- Leverage `User` type from NextAuth
- Define proper interfaces for all API responses
- Avoid `any` types - create specific interfaces

#### Component Architecture

```typescript
// Server component for data fetching
export default async function ServerPage() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// Client component for interactivity
"use client";
export function ClientComponent({ data }) {
  // Interactive logic here
}
```

#### Error Handling

```typescript
// Consistent error handling pattern
try {
  const result = await action();
  if (!result.success) {
    return <ErrorCard message={result.error} />;
  }
  return <SuccessComponent data={result.data} />;
} catch (error) {
  return <ErrorCard message="Something went wrong" />;
}
```

### Testing Approach

#### Using Demo Accounts

1. **Role Testing**: Use role switcher to test different permission levels
2. **User Type Testing**: Switch between recruiter and candidate modes
3. **Permission Verification**: Ensure access controls work correctly
4. **Cross-Organization Testing**: Verify data isolation between companies

#### Test Scenarios

- Create test data with demo accounts
- Verify role-based access restrictions
- Test document limits and usage tracking
- Validate AI integration with sample CVs
- Check analytics and reporting accuracy

---

## API Documentation

### Authentication Endpoints

#### NextAuth.js Integration

```json
POST /api/auth/[...nextauth]
```

Handles all authentication flows including OAuth and demo account access.

### CV Processing APIs

#### CV Analysis Endpoint

```json
POST /api/cv/analyze
Content-Type: multipart/form-data

Body:
- fileName: string (required)
- fileContent: string (required)
- jobTitle: string (required)
- companyName: string (optional)
- jobDescription: string (optional)

Response:
{
  "success": true,
  "id": "analysis_id",
  "feedback": {
    "overallScore": 85,
    "ATS": { "score": 90, "tips": [...] },
    // ... other categories
  }
}
```

#### User Role Management

```json
POST /api/user/switch-role
Content-Type: application/json

Body:
{
  "userType": "RECRUITER" | "CANDIDATE"
}

Response:
{
  "success": true,
  "targetEmail": "demo@profileprep.com",
  "redirectUrl": "/recruiter"
}
```

### Server Actions

#### CV Actions (`actions/cv.actions.ts`)

- `createCVAnalysis()` - Process CV analysis
- `getCVAnalysis(id)` - Retrieve specific analysis
- `getUserCVAnalyses()` - Get user's analysis history

#### User Actions (`actions/user.actions.ts`)

- `getRecruiterDocuments()` - Fetch user documents
- `updateUserLimits()` - Modify document limits
- `switchUserRole()` - Handle role switching

#### Admin Actions (`actions/admin.actions.ts`)

- `getCompanyUsers()` - Manage company members
- `createCompanyUser()` - Add new organization members
- `updateUserPermissions()` - Modify user roles and limits

### Query Hooks (`actions/queries/`)

#### Usage Pattern

```typescript
"use client";
import { useCompanyUsers } from "@/actions/queries/admin.queries";

export function UserManagement() {
  const { data: users, isLoading, error } = useCompanyUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorCard />;

  return <UserList users={users} />;
}
```

---

## Deployment

### Vercel Deployment (Recommended)

#### Setup Steps

1. **Repository Connection**:

   - Connect GitHub repository to Vercel
   - Configure automatic deployments

2. **Environment Variables**:

   ```env
   # Production environment variables
   DATABASE_URL=your_production_database_url
   DIRECT_URL=your_direct_database_url
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
   AUTH_SECRET=your_auth_secret_32_chars
   AUTH_GOOGLE_ID=your_google_oauth_id
   AUTH_GOOGLE_SECRET=your_google_oauth_secret
   AUTH_LINKEDIN_ID=your_linkedin_oauth_id
   AUTH_LINKEDIN_SECRET=your_linkedin_oauth_secret
   NODE_ENV=production
   ```

3. **Database Configuration**:

   ```bash
   # Run migrations in production
   npm run db:migrate-pr
   ```

4. **Domain Configuration**:
   - Configure custom domain in Vercel dashboard
   - Update OAuth redirect URLs for production domain

#### Production Considerations

- **Demo Account Security**: Demo accounts automatically disabled in production
- **Database Connection Pooling**: Use connection pooler for PostgreSQL
- **API Rate Limiting**: Implement rate limiting for AI API calls
- **Error Monitoring**: Set up error tracking (Sentry recommended)
- **Performance Monitoring**: Enable Vercel Analytics

### Manual Deployment

```bash
# Build application
npm run build

# Set production environment
export NODE_ENV=production

# Run database migrations
npm run db:migrate-pr

# Start production server
npm run start
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Testing

### Available Scripts

```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# Run specific test
npm run test -- UserManagement.test.ts
```

### Test Structure

```zsh
__tests__/
├── components/           # Component tests
├── pages/               # Page integration tests
├── api/                 # API endpoint tests
└── utils/               # Utility function tests
```

### Testing Patterns

#### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { UserList } from '@/components/admin/UserList';

describe('UserList', () => {
  it('displays user information correctly', () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com' }
    ];

    render(<UserList users={mockUsers} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

#### API Testing

```typescript
import { NextRequest } from "next/server";

import { POST } from "@/app/api/cv/analyze/route";

describe("/api/cv/analyze", () => {
  it("should analyze CV and return feedback", async () => {
    const formData = new FormData();
    formData.append("fileName", "test-cv.pdf");
    formData.append("fileContent", "CV content here...");
    formData.append("jobTitle", "Software Engineer");

    const request = new NextRequest("http://localhost:3000/api/cv/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.feedback).toBeDefined();
  });
});
```

### Demo Account Testing

#### Functional Checks

1. **Role Switching**: Verify role switcher works correctly
2. **Permission Testing**: Test all access control restrictions
3. **Data Isolation**: Ensure company data separation
4. **Feature Completeness**: Verify all features work for each user type
5. **Analytics Accuracy**: Validate dashboard statistics

#### Testing Workflow

```bash
# Start development environment
npm run dev

# Use demo accounts to test:
# 1. Basic recruiter functionality
# 2. Admin recruiter features
# 3. Candidate analysis flow
# 4. Organization management
# 5. System admin capabilities
```

---

## Troubleshooting

### Common Issues

#### Database Connection Errors

**Symptoms**: `PrismaClientKnownRequestError: Can't reach database server`

**Solutions**:

1. Verify `DATABASE_URL` and `DIRECT_URL` in `.env`
2. Check PostgreSQL service is running
3. For Supabase: Verify connection pooler settings
4. Run migrations: `npm run db:migrate`
5. Check firewall/network connectivity

#### Authentication Issues

**Symptoms**: `[next-auth][error][SIGNIN_OAUTH_ERROR]`

**Solutions**:

1. Verify `AUTH_SECRET` is set and 32+ characters
2. Check OAuth provider credentials
3. Ensure redirect URLs match in OAuth app settings
4. Clear browser cookies and cache
5. Verify NextAuth.js configuration in `auth.ts`

#### AI Generation Failures

**Symptoms**: `Failed to parse CV analysis response`

**Solutions**:

1. Verify `GOOGLE_GENERATIVE_AI_API_KEY` is correct
2. Check Google AI API quota and billing
3. Review API rate limits
4. Examine raw AI response in logs
5. Validate CV content length and format

#### Role/Permission Issues

**Symptoms**: Access denied or features not visible

**Solutions**:

1. Check user role and userType in database
2. Verify company association
3. Clear NextAuth.js session cache
4. Ensure proper access control in page components
5. Check demo account configuration

#### File Upload Problems

**Symptoms**: PDF parsing fails or empty content

**Solutions**:

1. Verify PDF is not password protected
2. Check file size limits (recommended max 10MB)
3. Test with plain text files first
4. Validate PDF parsing library configuration
5. Review file upload component error handling

### Development Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run type checking
npm run typecheck
```

#### Database Schema Issues

```bash
# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Format schema files
npm run db:format
```

#### Environment Configuration

```bash
# Verify all required environment variables
node -e "
const required = ['DATABASE_URL', 'GOOGLE_GENERATIVE_AI_API_KEY', 'AUTH_SECRET'];
required.forEach(key => {
  if (!process.env[key]) console.log('Missing:', key);
});
"
```

### Production Issues

#### Performance Problems

1. **Database Connection Pooling**: Ensure proper connection pooling configuration
2. **API Rate Limiting**: Implement request throttling for AI APIs
3. **Query Optimization**: Review slow database queries
4. **Caching**: Implement appropriate caching strategies
5. **Bundle Analysis**: Use `@next/bundle-analyzer` to optimize bundle size

#### Security Concerns

1. **Demo Account Leakage**: Ensure demo accounts are disabled in production
2. **Data Isolation**: Verify company-scoped queries in all operations
3. **Input Validation**: Validate all user inputs and file uploads
4. **API Security**: Implement proper authentication for all API routes
5. **Environment Security**: Secure environment variables and secrets

#### Monitoring & Logging

```bash
# Enable detailed logging in production
export NEXTAUTH_DEBUG=true
export NODE_ENV=production

# Monitor API responses and errors
# Implement error tracking (Sentry, LogRocket, etc.)
```

### Getting Help

#### Internal Resources

1. Check existing code patterns in similar components
2. Review database schema and relationships
3. Examine server actions for proper implementation
4. Look at TanStack Query usage patterns
5. Study role-based access control implementation

#### External Resources

1. **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
2. **NextAuth.js**: [https://authjs.dev/](https://authjs.dev/)
3. **Prisma**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
4. **TanStack Query**: [https://tanstack.com/query/](https://tanstack.com/query/)
5. **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

#### Community Support

1. Next.js Discord community
2. NextAuth.js GitHub discussions
3. Prisma community forums
4. Stack Overflow with relevant tags

---

## Development Scripts Reference

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Database Operations
npm run db:migrate       # Run database migrations
npm run db:migrate-cr    # Create new migration
npm run db:migrate-pr    # Deploy migrations to production
npm run db:seed          # Seed database with demo data
npm run db:format        # Format Prisma schema files

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changes

# Testing
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode

# Utilities
npm run postinstall      # Generate Prisma client (automatic after npm install)
```

---

## License

This project is proprietary software. All rights reserved.

---

Last updated: 12 August 2025
