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
    // aria-label="Adicionar" (added for a11y) is the button's accessible
    // name now, not the SVG's bootstrap-icon class name.
    const addButton = screen.getByRole("button", { name: "Adicionar" });
    fireEvent.click(addButton);
    expect(handleOrderAddMock).toHaveBeenCalled();
  });

  test("handles subtract button click", () => {
    const handleOrderSubtractMock =
      handlersCmn.handleOrderSubtract as jest.Mock;
    render(<ProductOptionGrid {...defaultProps} />);
    const subtractButton = screen.getByRole("button", { name: "Remover" });
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

  test("keeps rendering normally instead of tripping the ErrorBoundary", () => {
    // react-error-boundary is mocked (above) to render children directly,
    // ignoring FallbackComponent entirely, so GenericErrorComponent can
    // never actually render in this file's setup regardless of what
    // throws -- and typeError is only ever called from inside effects
    // that already catch their own errors, so it wouldn't reach a real
    // ErrorBoundary either way. `jest.mock()` also can't be called
    // conditionally inside a single test (it's hoisted file-wide), which
    // is what the original version of this test tried to do.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const typeErrorMock = handlersErrors.typeError as jest.Mock;
    typeErrorMock.mockImplementation(() => new Error("Test Error"));

    render(<ProductOptionGrid {...defaultProps} />);

    expect(screen.getByText("Test Option")).toBeInTheDocument();
    expect(screen.queryByText(/Erro carregando/)).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
