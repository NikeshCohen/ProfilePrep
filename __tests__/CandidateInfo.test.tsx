import { CandidateInfo } from "@/app/app/_components/CandidateInfo";
import { CandidateData } from "@/types";
import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

export const mockCandidateData: CandidateData = {
  documentTitle: "Mr",
  name: "John Doe",
  location: "London, UK",
  rightToWork: "Yes",
  salaryExpectation: "£50,000",
  notes: "Strong background in full-stack development",
};

describe("CandidateInfo Component", () => {
  it("should render inputs and labels correctly", () => {
    render(
      <CandidateInfo
        candidateData={mockCandidateData}
        onInputChange={jest.fn()}
        showNotes={false}
      />,
    );

    expect(screen.getByLabelText(/document title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/candidate name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/right to work/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary expectation/i)).toBeInTheDocument();
  });

  it("should update charCount on notes change", () => {
    const onInputChange = jest.fn();
    render(
      <CandidateInfo
        candidateData={mockCandidateData}
        onInputChange={onInputChange}
        showNotes={true}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      /add any additional notes here/i,
    );

    // based on component output, text between 400-800 chars for "Good" rating
    const longText = "A".repeat(500);

    fireEvent.change(textarea, { target: { value: longText } });

    // check for the current rating based on the component's actual behavior
    expect(screen.getByText(/good/i)).toBeInTheDocument();
    expect(screen.getByText(`${longText.length}/200`)).toBeInTheDocument();
  });

  it("should handle input changes correctly", () => {
    const onInputChange = jest.fn();
    render(
      <CandidateInfo
        candidateData={mockCandidateData}
        onInputChange={onInputChange}
        showNotes={false}
      />,
    );

    const nameInput = screen.getByLabelText(/candidate name/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    expect(onInputChange).toHaveBeenCalled();
  });
});
