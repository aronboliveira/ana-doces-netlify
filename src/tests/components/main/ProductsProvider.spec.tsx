import { render, screen } from "@testing-library/react";
import ProductsProvider from "src/productsMain/ProductsProvider";
import { ProductsProviderProps } from "src/declarations/interfaces";
import { Product } from "src/declarations/classes";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../interactives/SearchBar", () =>
  jest.fn(() => <div>SearchBar</div>)
);
jest.mock("./ProductGrid", () => jest.fn(() => <div>ProductGrid</div>));
jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../index", () => ({ basePath: "/" }));
jest.mock("../../../hardcodedOptions/BrowniesHC", () =>
  jest.fn(() => <div>BrowniesHC</div>)
);
jest.mock("../../../hardcodedOptions/TortasHC", () =>
  jest.fn(() => <div>TortasHC</div>)
);
jest.mock("../../../hardcodedOptions/BrowniesRechHC", () =>
  jest.fn(() => <div>BrowniesRechHC</div>)
);
jest.mock("../../../hardcodedOptions/BrowniesMiniHC", () =>
  jest.fn(() => <div>BrowniesMiniHC</div>)
);
jest.mock("../../../hardcodedOptions/CookiesHC", () =>
  jest.fn(() => <div>CookiesHC</div>)
);
jest.mock("../../../hardcodedOptions/CookiesMiniHC", () =>
  jest.fn(() => <div>CookiesMiniHC</div>)
);
jest.mock("../../../hardcodedOptions/GeleiaHC", () =>
  jest.fn(() => <div>GeleiaHC</div>)
);
jest.mock("../../../hardcodedOptions/PalhaHC", () =>
  jest.fn(() => <div>PalhaHC</div>)
);
jest.mock("../../../hardcodedOptions/CopoHC", () =>
  jest.fn(() => <div>CopoHC</div>)
);
jest.mock("../../../hardcodedOptions/PaveHC", () =>
  jest.fn(() => <div>PaveHC</div>)
);
jest.mock("../../../hardcodedOptions/BoloPoteHC", () =>
  jest.fn(() => <div>BoloPoteHC</div>)
);
jest.mock("../../../hardcodedOptions/BoloCaseiroHC", () =>
  jest.fn(() => <div>BoloCaseiroHC</div>)
);
jest.mock("../../../hardcodedOptions/BoloFestaHC", () =>
  jest.fn(() => <div>BoloFestaHC</div>)
);
jest.mock("../../../hardcodedOptions/TravessaHC", () =>
  jest.fn(() => <div>TravessaHC</div>)
);

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
