import { render } from "@testing-library/react";
import BehanceIcon from "src/icons/BehanceIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("BehanceIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Behance icon without errors", () => {
    const { container } = render(<BehanceIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<BehanceIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("degrades gracefully (logs, keeps rendering) when the ref check fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // svgRef.current is always a real HTMLElement on a normal jsdom render
    // (React assigns it at commit, before this effect runs), so the only
    // way to exercise the catch branch is to make useRef itself return
    // undefined for this render, which throws on the ref.current read.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    const { container } = render(<BehanceIcon />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(container.querySelector("svg")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
