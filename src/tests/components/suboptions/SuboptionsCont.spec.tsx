import { render, screen, waitFor } from "@testing-library/react";
import SuboptionsCont from "src/suboptions/SuboptionsCont";
import { SuboptionsContProps } from "src/declarations/interfaces";
import * as handlersCmn from "../../../handlersCmn";

jest.mock("../../../handlersErrors");
jest.mock("../../../handlersCmn", () => ({
  syncAriaStates: jest.fn(),
}));
jest.mock("../../../suboptions/SuboptionSubdiv", () =>
  jest.fn(() => <div>SuboptionsSubDiv</div>)
);
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

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

  test("calls syncAriaStates in useEffect", async () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    render(<SuboptionsCont {...defaultProps} />);
    // syncAriaStates fires from a setTimeout(..., 300) in the effect.
    await waitFor(() => expect(syncAriaStatesMock).toHaveBeenCalled());
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // mainRef.current is always a real HTMLElement on a normal jsdom
    // render, so the ref-guard branch is unreachable via mocking alone;
    // forcing useRef to return undefined makes the .current read itself
    // throw, exercising the catch branch.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<SuboptionsCont {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
