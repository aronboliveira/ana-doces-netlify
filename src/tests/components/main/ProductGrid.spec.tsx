import { render, screen, fireEvent } from "@testing-library/react";
import ProductGrid from "src/productsMain/ProductGrid";
import { ProductGridProps } from "src/declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";

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
  });

  test("renders without crashing", () => {
    render(<ProductGrid {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Detail")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.00")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /imagem_test product/i })
    ).toBeInTheDocument();
  });

  test("handles click to toggle options", () => {
    render(<ProductGrid {...defaultProps} />);
    const listItem = screen.getByRole("listitem");
    fireEvent.click(listItem);
    expect(screen.getByText("ProductOptionsDlg")).toBeInTheDocument();
  });

  test("hides component when price is invalid", () => {
    const props = { ...defaultProps, price: "Preço não fornecido" };
    render(<ProductGrid {...props} />);
    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
  });

  test("applies styles in useEffect", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    render(<ProductGrid {...defaultProps} />);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const elementNotFoundMock = handlersErrors.elementNotFound as jest.Mock;
    elementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    render(<ProductGrid {...defaultProps} />);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
