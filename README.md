# ProfilePrep

## Introduction

ProfilePrep is an AI-powered platform designed to help recruiters transform standard CVs into compelling professional profiles. Our platform streamlines the profile optimisation process, allowing recruiters to focus on making connections rather than formatting documents.

<!-- TOC -->

- [ProfilePrep](#profileprep)

  - [Introduction](#introduction)
    - [Why ProfilePrep?](#why-profileprep)
  - [Getting Started](#getting-started)
    - [System Requirements](#system-requirements)
    - [Installation](#installation)
    - [Database Configuration](#database-configuration)
    - [Running the Application](#running-the-application)
  - [Core Features](#core-features)
    - [CV Generation](#cv-generation)
      - [How It Works](#how-it-works)
      - [Key Benefits](#key-benefits)
    - [CV Management](#cv-management)
    - [Template System](#template-system)
    - [User Management](#user-management)
    - [Company Administration](#company-administration)
  - [User Roles \& Permissions](#user-roles--permissions)
    - [USER](#user)
    - [ADMIN](#admin)
    - [SUPERADMIN](#superadmin)
  - [Troubleshooting](#troubleshooting--faqs)
    - [Common Issues](#common-issues)
      - [The CV generation takes too long or times out](#the-cv-generation-takes-too-long-or-times-out)
      - [The generated CV is missing information from the original](#the-generated-cv-is-missing-information-from-the-original)
      - [Template changes aren't reflected in generated CVs](#template-changes-arent-reflected-in-generated-cvs)
  - [Future Enhancements](#future-enhancements)
    - [1. Candidate Portal](#1-candidate-portal)
      - [Features for Candidates](#features-for-candidates)
      - [Integration with Recruiter Workflow](#integration-with-recruiter-workflow)
        - [Implementation Timeline #1](#implementation-timeline-1)
    - [2. Job Matching](#2-job-matching)
      - [Initial Job Matching Features](#initial-job-matching-features)
        - [Implementation Timeline #2](#implementation-timeline-2)
    - [3. Advanced Matching Algorithm](#3-advanced-matching-algorithm)
      - [Advanced Matching Features](#advanced-matching-features)
      - [Technical Implementation](#technical-implementation)
        - [Implementation Timeline #3](#implementation-timeline-3)
  - [Contributing](#contributing)
  - [License - Pending Decision](#license---pending-decision)

---

### Why ProfilePrep?

At ProfilePrep, we believe your candidate's profile should stand out in a competitive job market. Our application:

- **Saves Time**: Eliminates hours spent on manual CV formatting
- **Improves Consistency**: Ensures all candidate profiles follow company standards
- **Enhances Presentation**: Transforms ordinary CVs into polished, professional documents
- **Accelerates Placements**: Helps recruiters present candidates faster and more effectively

The world doesn't need more generic CVs; it needs profiles that tell a story, showcase value, and make an impact.

---

## Getting Started

### System Requirements

- Node.js 18.x or later
- npm

### Installation

1. Clone the repository:

   ```zsh
   git clone https://github.com/NikeshCohen/ProfilePrep.git
   cd ProfilePrep
   ```

2. Install dependencies:

   ```zsh
   npm install
   ```

3. Set up environment variables:

   - Duplicate `.env.local.example` to create a `.env.local` file and insert your credentials.

### Database Configuration

Initialise the database with Prisma:

```zsh
npx prisma generate
npx prisma db push
```

### Running the Application

For development:

```zsh
npm run dev
```

For production:

```zsh
npm run build
npm start
```

---

## Core Features

### CV Generation

ProfilePrep's core functionality allows recruiters to upload candidate CVs and transform them into polished, professional documents.

#### How It Works

1. **Upload**: Upload a candidate's CV via PDF
2. **Extract**: Our system extracts the content
3. **Enhance**: AI enhances the formatting and presentation
4. **Review & Edit**: Review the generated CV and make adjustments if needed
5. **Export**: Download the polished CV or share it directly

#### Key Benefits

- Maintains original information while improving presentation
- Ensures gender-neutral language throughout
- Fixes formatting errors without altering the CV's meaning
- Creates a consistent format across all candidate profiles

### CV Management

The CV management system allows users to:

- View all generated CVs
- Filter and search through your CV library
- Make notes on individual CVs
- View, download, or share generated profiles

### Template System

For companies with established CV formats, our template system allows:

- Creation of company-specific CV templates
- Template management for different roles or departments
- Consistent branding across all candidate profiles
- Customisation options for special requirements

### User Management

Admin users can:

- Create and manage user accounts
- Assign appropriate permissions (User, Admin)
- Monitor user activity
- Configure user-specific settings

### Company Administration

For multi-user organisations, the company management features offer:

- Company profile management
- User allocation and permissions within the company
- Template sharing across the organisation
- Usage reporting and analytics

---

## User Roles & Permissions

ProfilePrep implements a role-based access control system with three primary roles:

### USER

- Generate and manage their own CVs
- Use company templates (if part of a company)
- View their document history

### ADMIN

- All USER permissions
- Create and manage users within their company
- View all company CVs and templates
- Create and edit company templates

### SUPERADMIN

- All ADMIN permissions
- Manage companies
- Access system-wide settings
- View analytics across all companies

---

## Troubleshooting

### Common Issues

#### The CV generation takes too long or times out

**Solution:** Large or complex PDFs may take longer to process. Try breaking down the CV into smaller sections or uploading a simpler format.

#### The generated CV is missing information from the original

**Solution:** Our AI prioritises the most relevant information. If specific content is missing, add a note in the candidate information section highlighting what should be included.

#### Template changes aren't reflected in generated CVs

**Solution:** New templates only apply to newly generated CVs. Regenerate the CV to apply the new template.

---

## Future Enhancements

ProfilePrep is continuously evolving to meet the needs of both recruiters and candidates. The following enhancements are proposed for development and scheduled for upcoming releases, pending confirmation.

### 1. Candidate Portal

The Candidate Portal is designed to empower job seekers with the same AI-powered profile optimisation tools available to recruiters.

#### Features for Candidates

- **Comprehensive CV Management**: Candidates can upload and maintain a "master CV" containing their complete professional history
- **AI-Powered Tailoring**: Automatically customise CVs for specific job applications by analysing job descriptions
- **ATS Optimisation**: Ensure applications pass Applicant Tracking Systems by incorporating relevant keywords and formatting
- **Application Tracking**: Monitor the status of job applications within a centralised dashboard
- **Multi-Version Management**: Maintain different versions of CVs tailored to different positions or industries

#### Integration with Recruiter Workflow

- Companies can invite candidates to join their organisational portal
- Recruiters can review and provide feedback on candidate profiles
- Seamless application process for company job listings
- Customisable permission levels for candidate access and interactions

##### Implementation Timeline #1

The Candidate Portal is scheduled for release in Q1 2025 and will be available as both:

- A standalone subscription for individual job seekers
- An add-on feature for companies to extend to their candidates

### 2. Job Matching

Our upcoming job matching system will streamline the recruitment process by connecting the right candidates with the right opportunities.

#### Initial Job Matching Features

- **Job Listings Management**: Create, publish, and manage job postings directly within ProfilePrep
- **Application Processing**: Track and manage candidate applications through customisable status workflows
- **Basic Matching Algorithm**: Match candidates to jobs based on keyword analysis of CVs and job descriptions
- **Application Analytics**: Gain insights into application metrics and candidate sources
- **Custom Application Statuses**: Configure application tracking statuses to align with company recruitment processes

##### Implementation Timeline #2

The basic Job Matching functionality is planned for release, following the Candidate Portal, in Q2 2025.

### 3. Advanced Matching Algorithm

Following the initial job matching release, we will launch an advanced AI-powered matching system that goes beyond keyword matching to deliver truly intelligent recommendations.

#### Advanced Matching Features

- **Skills-Based Matching**: Granular matching based on explicit skills taxonomy and categorisation
- **Weighted Criteria Matching**: Sophisticated algorithm that considers multiple factors including:
  - Skills alignment (technical, soft skills, certifications)
  - Experience level matching (years of experience, seniority)
  - Education compatibility (degree requirements, specialised training)
  - Location preferences (remote, hybrid, on-site with geographic considerations)
- **Match Quality Scoring**: Percentage-based scoring system with detailed breakdown of match components
- **Two-Way Recommendations**:
  - For recruiters: Find best-fit candidates for specific job openings
  - For candidates: Discover most suitable job opportunities based on profile
- **Candidate Ranking**: Intelligent ranking of candidates for specific positions
- **Gap Analysis**: Identify skill or experience gaps between candidates and job requirements

#### Technical Implementation

The advanced matching system will utilise:

- Comprehensive skills taxonomy database
- Machine learning algorithms to improve match quality over time
- Natural language processing for deep context understanding
- Customisable weighting system for different industries and roles

##### Implementation Timeline #3

The Advanced Matching Algorithm is scheduled for release in Q2 2025, following the successful deployment and adoption of the basic job matching functionality.

## Contributing

We welcome contributions to ProfilePrep! Here's how you can help:

1. **Fork the repository**: Start by forking the repository to your GitHub account
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**: Implement your feature or fix
4. **Test thoroughly**: Ensure that the application builds and your changes work as expected
5. **Submit a pull request**: Push to your fork and submit a pull request thoroughly explaining the changes you've made

Please follow our coding standards and include appropriate tests with your contributions.

---

## License - Pending Decision

ProfilePrep will be released under an open-source license. The exact license is still being decided, but it will allow for contributions and use while ensuring protection against misuse or unauthorised redistribution.

---
