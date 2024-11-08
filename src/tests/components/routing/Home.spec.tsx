import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "src/routing/Home";

jest.mock("../callers/Spinner", () => jest.fn(() => <div>Spinner</div>));
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<Home />);
    expect(screen.getAllByText("Spinner").length).toBe(3);
    expect(screen.getByAltText("Logo Ana Doces")).toBeInTheDocument();
    expect(
      screen.getByText(/Dica: Clique nos produtos para acessar as opções/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Clique nos botões de Copiar/i)
    ).toBeInTheDocument();
  });
});
