import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductOptionsDlg from "src/productOptions/ProductOptionsDlg";
import { ProductOption } from "src/declarations/classes";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import { useParams } from "react-router-dom";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../suboptions/SuboptionsCont", () =>
  jest.fn(() => <div>SuboptionsCont</div>)
);
jest.mock("../../../callers/Spinner", () => jest.fn(() => <div>Spinner</div>));
jest.mock("../../../interactives/ProductOptionGrid", () =>
  jest.fn(() => <div>ProductOptionGrid</div>)
);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ProductOptionsDlg Component", () => {
  const defaultOptions: ProductOption[] = [
    new ProductOption("Option A", "R$10,00", "Description A", "1", "1-001"),
    new ProductOption("Option B", "R$20,00", "Description B", "1", "1-002"),
  ];
  const defaultProps = {
    shouldShowOptions: true,
    options: defaultOptions,
    subOptions: [["SubOption1"], ["SubOption2"]],
    root: null,
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({});
    jest.spyOn(window.history, "pushState").mockImplementation();
  });

  test("renders without crashing", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(screen.getByText("Opções —")).toBeInTheDocument();
    expect(screen.getByText("SuboptionsCont")).toBeInTheDocument();
    expect(screen.getByText("Spinner")).toBeInTheDocument();
  });

  test("calls setOptions when close button is clicked", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(defaultProps.setOptions).toHaveBeenCalledWith(false);
  });

  test("does not render dialog when shouldShowOptions is false", () => {
    const props = { ...defaultProps, shouldShowOptions: false };
    render(<ProductOptionsDlg {...props} />);
    expect(screen.queryByText("Opções —")).not.toBeInTheDocument();
  });

  test("handles click outside to close the dialog", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    fireEvent.mouseDown(document);
    expect(defaultProps.setOptions).toHaveBeenCalledWith(false);
  });

  test("calls adjustIdentifiers in useEffect", () => {
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("renders ProductOptionGrid components", () => {
    const ProductOptionGridMock =
      require("../interactives/ProductOptionGrid") as jest.Mock;
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(ProductOptionGridMock).toHaveBeenCalledTimes(defaultOptions.length);
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<ProductOptionsDlg {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("updates history when optionsRef has id", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(window.history.pushState).toHaveBeenCalled();
  });
});
