import { render } from "@testing-library/react";
import InstIcon from "src/icons/InstIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("InstIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Instagram icon link", () => {
    const { getByRole } = render(<InstIcon />);
    const linkElement = getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(
      "href",
      "https://www.instagram.com/anadoces_rj/"
    );
  });

  test("calls syncAriaStates in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;

    render(<InstIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<InstIcon />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
