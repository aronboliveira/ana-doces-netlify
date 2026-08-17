import { render, screen, act } from "@testing-library/react";
import ProductsProvider from "src/productsMain/ProductsProvider";
import { ProductsProviderProps } from "src/declarations/interfaces";
import { Product } from "src/declarations/classes";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

// Mock factories return a plain function (not jest.fn()) as the default export —
// nothing here needs call-tracking, and it stays correct even if `mockReset`/`clearMocks`
// config ever changes, since resetting mock state can't strip a plain function's body.
jest.mock("../../../interactives/SearchBar", () => ({
  __esModule: true,
  default: () => <div>SearchBar</div>,
}));
jest.mock("../../../productsMain/ProductGrid", () => ({
  __esModule: true,
  default: () => <div>ProductGrid</div>,
}));
jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../index", () => ({
  basePath: "/",
  mainItems: { listMainItems: [] },
}));

describe("ProductsProvider Component", () => {
  const products: Product[] = [
    new Product(
      "Test Product 1",
      "10.00",
      "/img/test1.jpg",
      "Test Detail 1",
      [],
      "1"
    ),
    new Product(
      "Test Product 2",
      "20.00",
      "/img/test2.jpg",
      "Test Detail 2",
      [],
      "2"
    ),
  ];
  const defaultProps: ProductsProviderProps = {
    root: null,
    products: products,
    navigate: jest.fn(),
    searchParams: new URLSearchParams(),
    setSearchParams: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Flush anything still pending (the 500ms/1000ms effect timers) before
    // switching back to real timers, so a leftover callback can't fire
    // against a torn-down component during a later, unrelated test.
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  test("renders without crashing", () => {
    render(<ProductsProvider {...defaultProps} />);
    expect(screen.getByText("SearchBar")).toBeInTheDocument();
    expect(screen.getAllByText("ProductGrid").length).toBe(products.length);
  });

  test("calls adjustIdentifiers and syncAriaStates in useEffect", () => {
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    render(<ProductsProvider {...defaultProps} />);
    expect(adjustIdentifiersMock).toHaveBeenCalled();
    // syncAriaStates fires from a setTimeout(..., 500) in a separate effect.
    act(() => jest.advanceTimersByTime(500));
    expect(syncAriaStatesMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // menuRef.current is always a real HTMLElement on a normal jsdom
    // render (React assigns it at commit, before this effect runs), so
    // the only way to exercise the catch branch is to make useRef itself
    // return undefined for this render, which throws on the .current read.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<ProductsProvider {...defaultProps} />);

    // The check (and its catch) run inside a setTimeout(..., 500).
    act(() => jest.advanceTimersByTime(500));
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
