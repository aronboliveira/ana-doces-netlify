import { render, screen } from "@testing-library/react";
import OrderQuantity from "../../../tableComponents/OrderQuantity";
import { OrderQuant } from "../../../declarations/interfaces";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersErrors");

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
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<OrderQuantity {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
