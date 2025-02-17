# ProfilePrep

ProfilePrep is an AI-powered micro-tool designed to help recruiters refine and format candidate CVs before sending them to clients. It ensures consistency, clarity and professional presentation, streamlining the CV review process.

## Table of Contents

- [ProfilePrep](#profileprep)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Run Project](#run-project)
  - [Usage](#usage)
  - [API Documentation](#api-documentation)
    - [`generate(cvContent, candidateInfo)`](#generatecvcontent-candidateinfo)
  - [Troubleshooting](#troubleshooting)
  - [FAQs](#faqs)
    - [Why is the refined CV not displaying correctly?](#why-is-the-refined-cv-not-displaying-correctly)
  - [Examples \& Use Cases](#examples--use-cases)
  - [Contributing](#contributing)

## Features

- AI-driven CV refinement for enhanced clarity and presentation.
- Customisable prompts to tailor CV outputs.
- Support for various candidate details, including location, salary expectation and right to work status.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- Access to the Google AI SDK.

### Installation

```zsh
# clone the repository
git clone https://github.com/NikeshCohen/ProfilePrep.git
cd ProfilePrep

# install dependencies
npm install
```

### Configuration

Ensure you have the required API keys and environment variables set up. Create a `.env` file with:

```.env
GOOGLE_AI_API_KEY=your_api_key_here
```

### Run Project

To run this AI-powered micro-tool on your local machine:

```zsh
# start the development server
npm run dev
```

Navigate to the [default localhost](http://localhost:3000) in your browser.

## Usage

You can use ProfilePrep as follows:

```ts
import { generate } from "@/actions/generate";

const refinedCV = await generate(cvContent, candidateInfo);
console.log(refinedCV);
```

## API Documentation

### `generate(cvContent, candidateInfo)`

- **Description**: Refines the candidate's CV using AI.
- **Parameters**:
  - `cvContent` (string): Raw CV content of the candidate.
  - `candidateInfo` (object): Contains details like name, location, right to work status, salary expectation and additional notes.
- **Returns**: Refined CV as a string.

## Troubleshooting

- **Issue**: API request failing.
  - **Solution**: Check your API key and ensure it's correctly configured in your `.env` file.

## FAQs

### Why is the refined CV not displaying correctly?

Check if the CV content has any unsupported formatting. Ensure that markdown syntax is properly handled.

## Examples & Use Cases

- Refining candidate CVs for consistency before submission.
- Formatting CVs to meet client-specific requirements.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
