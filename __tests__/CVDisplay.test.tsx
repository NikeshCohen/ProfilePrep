import React from "react";

import { CVDisplay, CVDisplayProps } from "@/app/app/_components/CvDisplay";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

const mockMarkdownData: CVDisplayProps = {
  markdown: `
  # John Doe
  ## Full Stack Developer
  **Location:** London, UK
  **Right to Work:** Yes
  **Salary Expectation:** £50,000
  **Notes:** Strong background in full-stack development, JavaScript, React, Node.js, and database management.
  `,
  docName: "JohnDoe_CV",
  handleReset: jest.fn(),
};

jest.mock("react-error-boundary", () => ({
  useErrorBoundary: () => ({
    showBoundary: jest.fn(),
  }),
}));

describe("CVDisplay Component", () => {
  it("should render the CV content and buttons", () => {
    render(
      <CVDisplay
        markdown={mockMarkdownData.markdown}
        docName={mockMarkdownData.docName}
        handleReset={mockMarkdownData.handleReset}
      />,
    );

    expect(
      screen.getByText(/we've generated your candidate's cv content/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/download cv/i)).toBeInTheDocument();
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
  });

  it("should trigger the handleReset when reset button is clicked", () => {
    render(
      <CVDisplay
        markdown={mockMarkdownData.markdown}
        docName={mockMarkdownData.docName}
        handleReset={mockMarkdownData.handleReset}
      />,
    );

    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(resetButton);

    expect(mockMarkdownData.handleReset).toHaveBeenCalledTimes(1);
  });
});
