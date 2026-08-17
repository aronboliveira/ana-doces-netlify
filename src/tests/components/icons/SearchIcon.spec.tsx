import { render } from "@testing-library/react";
import SearchIcon from "src/icons/SearchIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("SearchIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Search icon", () => {
    const { container } = render(<SearchIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;

    render(<SearchIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<SearchIcon />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
