import { render, screen } from "@testing-library/react";
import ProductsProvider from "src/productsMain/ProductsProvider";
import { ProductsProviderProps } from "src/declarations/interfaces";
import { Product } from "src/declarations/classes";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

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
jest.mock("../../../index", () => ({ basePath: "/" }));

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
    expect(syncAriaStatesMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    render(<ProductsProvider {...defaultProps} />);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
