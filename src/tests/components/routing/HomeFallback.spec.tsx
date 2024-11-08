import React from "react";
import { render, screen } from "@testing-library/react";
import HomeFallback from "src/routing/HomeFallback";

jest.mock("../callers/Spinner", () => jest.fn(() => <div>Spinner</div>));
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("HomeFallback Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<HomeFallback />);
    expect(screen.getAllByText("Spinner").length).toBe(4);
    expect(screen.getByAltText("Logo Ana Doces")).toBeInTheDocument();
  });
});
