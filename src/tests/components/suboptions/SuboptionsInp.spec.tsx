// SuboptionInp.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import SuboptionInp from "src/suboptions/SuboptionInp";
import { SuboptionProp } from "src/declarations/interfaces";
import * as handlersCmn from "../../../handlersCmn";

jest.mock("../../../handlersErrors");
jest.mock("../../../handlersCmn", () => ({
  syncAriaStates: jest.fn(),
  recalculateByOption: jest.fn(),
  normalizeSpacing: jest.fn((str: string) => str),
  textTransformPascal: jest.fn((str: string) => str),
}));
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

// SuboptionInp only fills in id/name/htmlFor (and only looks for a <nav>
// to recalculate price against) when rendered inside its real Compound
// Pattern context (a .modal-content dialog); render a matching wrapper
// instead of standalone so those effects/handlers have something to find.
function withModalContext(children: React.ReactNode) {
  return (
    <div className="modal-content" id="div-Test__1">
      <nav>{children}</nav>
    </div>
  );
}

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
    render(withModalContext(<SuboptionInp {...defaultProps} />));
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
    render(withModalContext(<SuboptionInp {...defaultProps} />));
    const input = screen.getByRole("radio");

    fireEvent.click(input);

    expect(recalculateByOptionMock).toHaveBeenCalledWith(
      ".opSpanPrice",
      expect.anything(),
      "Option A"
    );
  });

  test("updates URL parameter on radio input click", () => {
    // jsdom's window.location is a non-configurable accessor and can't
    // be replaced wholesale (attempting to trips jsdom's own
    // "navigation not implemented" error); drive it through the real
    // navigation API instead, and actually spy on pushState so the
    // assertion below has something to check.
    history.pushState({}, "", "/");
    const pushStateSpy = jest.spyOn(history, "pushState");
    render(<SuboptionInp {...defaultProps} />);
    const input = screen.getByRole("radio") as HTMLInputElement;

    fireEvent.click(input);

    expect(pushStateSpy).toHaveBeenCalled();
    // The real navigation API URL-encodes the space.
    expect(window.location.href).toContain("&Op-option%20a");
    pushStateSpy.mockRestore();
    history.pushState({}, "", "/");
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // labRef.current is always a real HTMLLabelElement on a normal
    // jsdom render, so the ref-guard branch is unreachable via mocking
    // alone; forcing useRef to return undefined for labRef (the first
    // call) makes the .current read itself throw, exercising the catch
    // branch.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<SuboptionInp {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });

  test("propagates a construction error to an ancestor ErrorBoundary", () => {
    // option.toLowerCase() on a non-string value throws while
    // SuboptionInp itself is being constructed, evaluating the value
    // prop for its own <input> -- that happens before React ever gets
    // to mount SuboptionInp's *internal* ErrorBoundary (which can only
    // catch errors from its own descendants, not from the parent
    // component that renders it), so only an ancestor boundary, as used
    // by the real callers of this component (e.g. SuboptionsCont), can
    // actually catch it. react-error-boundary is NOT mocked in this
    // file, so this is the real ErrorBoundary implementation.
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={() => <div>Error rendering Option</div>}>
        <SuboptionInp {...({ ...defaultProps, option: null } as any)} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Error rendering Option")).toBeInTheDocument();
  });
});
