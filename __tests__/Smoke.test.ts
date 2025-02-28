import { describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({}),
  }),
) as unknown as jest.MockedFunction<typeof fetch>;

describe("Smoke test", () => {
  it("should build and run the app without errors", async () => {
    const response = await fetch("http://localhost:3000");
    // ensure app loads successfully
    expect(response.status).toBe(200);
  });
});
