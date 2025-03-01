import { HTMLProps, ReactNode } from "react";

import "@testing-library/jest-dom";

// confetti
jest.mock("react-confetti", () => {
  return function MockConfetti() {
    return <div data-testid="confetti" />;
  };
});

// framer-motion
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");

  return {
    ...actual,
    motion: {
      div: ({
        children,
        ...props
      }: { children: ReactNode } & HTMLProps<HTMLDivElement>) => (
        <div {...props}>{children}</div>
      ),
      h1: ({
        children,
        ...props
      }: { children: ReactNode } & HTMLProps<HTMLHeadingElement>) => (
        <h1 {...props}>{children}</h1>
      ),
      p: ({
        children,
        ...props
      }: { children: ReactNode } & HTMLProps<HTMLParagraphElement>) => (
        <p {...props}>{children}</p>
      ),
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

// html to
jest.mock("html-to-pdfmake", () => {
  return jest.fn().mockReturnValue(["Mocked PDF content"]);
});

// pdf
jest.mock("pdfmake/build/pdfmake", () => ({
  createPdf: jest.fn().mockReturnValue({
    download: jest.fn(),
  }),
  vfs: {},
}));

// fonts
jest.mock("pdfmake/build/vfs_fonts", () => ({
  vfs: {},
}));

// markdown
jest.mock("markdown-it", () => {
  return jest.fn().mockImplementation(() => ({
    render: jest.fn().mockReturnValue("<p>Mocked HTML content</p>"),
  }));
});

Object.defineProperty(window, "innerWidth", { value: 1024 });
Object.defineProperty(window, "innerHeight", { value: 768 });

global.TransformStream = jest.fn().mockImplementation(() => ({
  writable: {},
  readable: {},
}));

// fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;
