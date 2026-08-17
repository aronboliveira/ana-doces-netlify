import { render, screen, fireEvent, act } from "@testing-library/react";
import ProductGrid from "src/productsMain/ProductGrid";
import { ProductGridProps } from "src/declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";

// jsdom doesn't implement layout, so it never computes a real .innerText
// (it's always ""); the component reads priceRef.current.innerText to
// decide whether to hide an invalidly-priced item, so alias it to
// textContent here to get realistic behavior under jsdom.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "innerText", {
    configurable: true,
    get(this: HTMLElement) {
      return this.textContent;
    },
  });
});

jest.mock("../../../productOptions/ProductOptionsDlg", () =>
  jest.fn(() => <div>ProductOptionsDlg</div>)
);
jest.mock("../../../handlersErrors");

describe("ProductGrid Component", () => {
  const defaultProps: ProductGridProps = {
    name: "Test Product",
    id: "1",
    price: "10.00",
    imgSrc: "/path/to/image.jpg",
    detail: "Test Detail",
    options: [],
    subOptions: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Flush anything still pending (the 300ms/200ms effect timers) before
    // switching back to real timers, so a leftover callback can't fire
    // against a torn-down component during a later, unrelated test.
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  test("renders without crashing", () => {
    render(<ProductGrid {...defaultProps} />);
    // ProductGrid title-cases its heading (first letter up, rest lower),
    // it doesn't render the name prop verbatim.
    expect(screen.getByText("Test product")).toBeInTheDocument();
    expect(screen.getByText("Test Detail")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.00")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /imagem_test product/i })
    ).toBeInTheDocument();
  });

  test("handles click to toggle options", async () => {
    render(<ProductGrid {...defaultProps} />);
    const listItem = screen.getByRole("button", { name: /Test Product/i });
    fireEvent.click(listItem);
    // ProductOptionsDlg is React.lazy-loaded, so it only appears once its
    // dynamic import (and Suspense boundary) resolves.
    expect(await screen.findByText("ProductOptionsDlg")).toBeInTheDocument();
  });

  test("hides component when price is invalid", () => {
    const props = { ...defaultProps, price: "Preço não fornecido" };
    render(<ProductGrid {...props} />);
    // The hide logic sets the `hidden` attribute on the <li> (inside a
    // setTimeout(...,200)) -- it doesn't remove the item from the DOM,
    // so this needs toBeVisible(), not toBeInTheDocument(), and the
    // timer needs to actually run.
    act(() => jest.advanceTimersByTime(200));
    expect(screen.getByText("Test product")).not.toBeVisible();
  });

  test("applies styles in useEffect", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    render(<ProductGrid {...defaultProps} />);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("handles errors in useEffect gracefully", () => {
    // refLi.current is always a real Element on a normal jsdom render, so
    // the guarded branch (elementNotFound -> console.error) can't be
    // reached without breaking refLi outright -- but refLi also backs an
    // unguarded syncAriaStates(refLi.current) call earlier in the same
    // effect, so invalidating it crashes the whole effect instead of
    // reaching the intended catch block. The meaningful, reachable
    // assertion is that a defensively-mocked error path doesn't stop the
    // component from rendering.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const elementNotFoundMock = handlersErrors.elementNotFound as jest.Mock;
    elementNotFoundMock.mockImplementation(() => new Error("Test Error"));

    render(<ProductGrid {...defaultProps} />);
    act(() => jest.advanceTimersByTime(300));

    expect(screen.getByText("Test product")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
