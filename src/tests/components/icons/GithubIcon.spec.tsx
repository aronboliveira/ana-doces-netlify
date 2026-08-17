import { render } from "@testing-library/react";
import GithubIcon from "src/icons/GitHubIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("GithubIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the GitHub icon without errors", () => {
    const { container } = render(<GithubIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<GithubIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("degrades gracefully (logs, keeps rendering) when the ref check fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    const { container } = render(<GithubIcon />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(container.querySelector("svg")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
