// SuboptionInp.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SuboptionInp from "src/suboptions/SuboptionInp";
import { SuboptionProp } from "src/declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";
import * as handlersCmn from "../../../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";

jest.mock("../../../handlersErrors");
jest.mock("../../../handlersCmn", () => ({
  syncAriaStates: jest.fn(),
  recalculateByOption: jest.fn(),
  normalizeSpacing: jest.fn((str: string) => str),
  textTransformPascal: jest.fn((str: string) => str),
}));
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("SuboptionInp Component", () => {
  const defaultProps: SuboptionProp = {
    option: "Option A",
    inpType: "radio",
    idx: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<SuboptionInp {...defaultProps} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  test("sets input and label attributes in useEffect", () => {
    render(<SuboptionInp {...defaultProps} />);
    const input = screen.getByRole("radio");
    const label = screen.getByText("Option A").closest("label");

    expect(input).toHaveAttribute("id");
    expect(input).toHaveAttribute("name");
    expect(label).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  test("calls recalculateByOption on input click", () => {
    const recalculateByOptionMock =
      handlersCmn.recalculateByOption as jest.Mock;
    render(<SuboptionInp {...defaultProps} />);
    const input = screen.getByRole("radio");

    fireEvent.click(input);

    expect(recalculateByOptionMock).toHaveBeenCalledWith(
      ".opSpanPrice",
      expect.anything(),
      "Option A"
    );
  });

  test("updates URL parameter on radio input click", () => {
    delete (window as any).location;
    (window as any).location = new URL("http://localhost/");
    render(<SuboptionInp {...defaultProps} />);
    const input = screen.getByRole("radio") as HTMLInputElement;

    fireEvent.click(input);

    expect(window.history.pushState).toHaveBeenCalled();
    expect(window.location.href).toContain("&Op-Option A");
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<SuboptionInp {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("renders error message in ErrorBoundary on error", () => {
    const errorMessage = "Error rendering Option";
    jest.spyOn(console, "error").mockImplementation(() => {});

    const ThrowErrorComponent = () => {
      throw new Error("Test Error");
    };

    render(
      <ErrorBoundary FallbackComponent={() => <div>{errorMessage}</div>}>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
