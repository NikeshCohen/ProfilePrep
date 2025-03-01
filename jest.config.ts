import nextJest from "next/jest.js";

import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/actions/(.*)$": "<rootDir>/actions/$1",
    "^@/providers/(.*)$": "<rootDir>/providers/$1",
    "^@/types/(.*)$": "<rootDir>/types/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(lucide-react|framer-motion|react-confetti|html-to-pdfmake|pdfmake|markdown-it)/)",
  ],
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  testMatch: [
    "<rootDir>/__tests__/**/*.test.ts",
    "<rootDir>/__tests__/**/*.test.tsx",
  ],
};

export default createJestConfig(customConfig);
