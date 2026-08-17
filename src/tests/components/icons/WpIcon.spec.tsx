import { render, waitFor } from "@testing-library/react";
import WpIcon from "src/icons/WpIcon";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("WpIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the WhatsApp icon (small size) by default", () => {
    const { container } = render(<WpIcon large={false} />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.getAttribute("viewBox")).toBe("0 0 16 16");
  });

  test("renders the large WhatsApp icon when large=true", () => {
    const { container } = render(<WpIcon large={true} />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.getAttribute("viewBox")).toBe("0 0 32 24");
  });

  test("calls syncAriaStates in useEffect", async () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;

    render(<WpIcon large={false} />);

    // syncAriaStates fires from a setTimeout(..., 100) inside the effect.
    await waitFor(() => expect(syncAriaStatesMock).toHaveBeenCalled());
  });

  test("adds classes to the closest button", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const { container } = render(
      <button>
        <WpIcon large={false} />
      </button>
    );
    const buttonElement = container.querySelector("button");
    expect(buttonElement).toHaveClass("btn", "btn-success", "btn-rounded");
    consoleErrorSpy.mockRestore();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<WpIcon large={false} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
