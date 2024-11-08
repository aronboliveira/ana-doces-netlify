import React from "react";
import { render, screen } from "@testing-library/react";
import SuboptionsCont from "src/suboptions/SuboptionsCont";
import { SuboptionsContProps } from "src/declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";
import * as handlersCmn from "../../../handlersCmn";

jest.mock("../../../handlersErrors");
jest.mock("../../../handlersCmn", () => ({
  syncAriaStates: jest.fn(),
}));
jest.mock("../../../suboptions/SuboptionSubdiv", () =>
  jest.fn(() => <div>SuboptionsSubDiv</div>)
);
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("SuboptionsCont Component", () => {
  const defaultProps: SuboptionsContProps = {
    subOptions: [
      ["Option A1", "Option A2"],
      ["Option B1", "Option B2"],
    ],
    inpType: "radio",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<SuboptionsCont {...defaultProps} />);
    expect(screen.getAllByText("SuboptionsSubDiv").length).toBe(2);
  });

  test("sets mainRef id in useEffect", () => {
    render(<SuboptionsCont {...defaultProps} />);
    const container = screen.getByRole("group");
    expect(container).toHaveAttribute("id");
  });

  test("calls syncAriaStates in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    render(<SuboptionsCont {...defaultProps} />);
    expect(syncAriaStatesMock).toHaveBeenCalled();
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<SuboptionsCont {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
