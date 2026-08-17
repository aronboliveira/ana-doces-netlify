import { render, screen } from "@testing-library/react";
import OrderQuantity from "../../../tableComponents/OrderQuantity";
import { OrderQuant } from "../../../declarations/interfaces";

jest.mock("../../../handlersErrors");
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

// jsdom doesn't implement layout, so it never computes a real .innerText
// (both the getter and setter are effectively no-ops there); the
// component reads/writes quantRef.current.innerText to validate and
// normalize the quantity, so alias it to textContent for this suite.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "innerText", {
    configurable: true,
    get(this: HTMLElement) {
      return this.textContent;
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value;
    },
  });
});

describe("OrderQuantity Component", () => {
  const defaultProps: OrderQuant = {
    id: "1",
    quantity: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<OrderQuantity {...defaultProps} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("validates quantity in useEffect", () => {
    render(<OrderQuantity {...defaultProps} />);
    const output = screen.getByText("2");
    expect(output).toBeInTheDocument();
  });

  test("sets quantity to 0 if invalid", () => {
    const props = { ...defaultProps, quantity: -1 };
    render(<OrderQuantity {...props} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // quantRef.current is always a real HTMLElement on a normal jsdom
    // render, so the ref-guard branch is unreachable via mocking alone.
    // quantRef is the *second* useRef call (quantCelRef is the first),
    // so only that call needs to be broken -- forcing it to throw on the
    // .current read exercises the catch branch.
    const originalUseRef = ReactModule.useRef;
    let callCount = 0;
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockImplementation((...args: unknown[]) => {
        callCount++;
        return callCount === 2 ? undefined : originalUseRef(...args);
      });

    render(<OrderQuantity {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
