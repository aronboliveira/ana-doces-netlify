// SuboptionsSubDiv.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import SuboptionsSubDiv from "../../../suboptions/SuboptionSubdiv";
import { SubotpionsSubDivProps } from "../../../declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";
import * as handlersCmn from "../../../handlersCmn";

jest.mock("../../../handlersErrors");
jest.mock("../../../handlersCmn", () => ({
  syncAriaStates: jest.fn(),
  handleDoubleClick: jest.fn(),
}));
jest.mock("../../../../suboptions/SuboptionInp", () =>
  jest.fn(() => <div>SuboptionInp</div>)
);
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("SuboptionsSubDiv Component", () => {
  const defaultProps: SubotpionsSubDivProps = {
    subOptionsList: ["Option A1", "Option A2"],
    inpType: "radio",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<SuboptionsSubDiv {...defaultProps} />);
    expect(screen.getAllByText("SuboptionInp").length).toBe(2);
  });

  test("sets mainRef id in useEffect", () => {
    render(<SuboptionsSubDiv {...defaultProps} />);
    const container = screen.getByRole("group");
    expect(container).toHaveAttribute("id");
  });

  test("calls handleDoubleClick in useLayoutEffect", () => {
    const handleDoubleClickMock = handlersCmn.handleDoubleClick as jest.Mock;
    render(<SuboptionsSubDiv {...defaultProps} />);
    expect(handleDoubleClickMock).toHaveBeenCalled();
  });

  test("handles errors in useEffect and useLayoutEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<SuboptionsSubDiv {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
