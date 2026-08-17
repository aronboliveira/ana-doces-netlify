import { render } from "@testing-library/react";
import LinkedinIcon from "src/icons/LinkedinIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("LinkedinIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the LinkedIn icon without errors", () => {
    const { container } = render(<LinkedinIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<LinkedinIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("degrades gracefully (logs, keeps rendering) when the ref check fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    const { container } = render(<LinkedinIcon />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(container.querySelector("svg")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
