import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductOptionGrid from "src/productOptions/ProductOptionGrid";
import { ProductOptionsProps } from "src/declarations/interfaces";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ProductOptionGrid Component", () => {
  const defaultProps: ProductOptionsProps = {
    opName: "Test Option",
    price: "R$10,00",
    desc: "Test Description",
    _id: "1",
    __id: "1-001",
    root: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<ProductOptionGrid {...defaultProps} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("R$10,00")).toBeInTheDocument();
  });

  test("calls adjustIdentifiers in useEffect", () => {
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;
    render(<ProductOptionGrid {...defaultProps} />);
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles add button click", () => {
    const handleOrderAddMock = handlersCmn.handleOrderAdd as jest.Mock;
    render(<ProductOptionGrid {...defaultProps} />);
    const addButton = screen.getByRole("button", { name: /plus-square-fill/i });
    fireEvent.click(addButton);
    expect(handleOrderAddMock).toHaveBeenCalled();
  });

  test("handles subtract button click", () => {
    const handleOrderSubtractMock =
      handlersCmn.handleOrderSubtract as jest.Mock;
    render(<ProductOptionGrid {...defaultProps} />);
    const subtractButton = screen.getByRole("button", {
      name: /dash-square-fill/i,
    });
    fireEvent.click(subtractButton);
    expect(handleOrderSubtractMock).toHaveBeenCalled();
  });

  test("displays default messages when opName, desc, or price are missing", () => {
    const props = { ...defaultProps, opName: "", desc: "", price: "" };
    render(<ProductOptionGrid {...props} />);
    expect(screen.getByText("Nome indefinido")).toBeInTheDocument();
    expect(screen.getByText("Descrição não fornecida")).toBeInTheDocument();
    expect(screen.getByText("Preço não fornecido")).toBeInTheDocument();
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<ProductOptionGrid {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("applies velvet case to price", () => {
    const applyVelvetCaseMock = handlersCmn.applyVelvetCase as jest.Mock;
    render(<ProductOptionGrid {...defaultProps} />);
    expect(applyVelvetCaseMock).toHaveBeenCalledWith(
      "Test Option",
      expect.anything()
    );
  });

  test("displays error message in ErrorBoundary on error", () => {
    const GenericErrorComponentMock = jest.fn(() => (
      <div>GenericErrorComponent</div>
    ));
    jest.mock(
      "../errors/GenericErrorComponent",
      () => GenericErrorComponentMock
    );

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const typeErrorMock = handlersErrors.typeError as jest.Mock;
    typeErrorMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<ProductOptionGrid {...defaultProps} />);

    expect(GenericErrorComponentMock).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
