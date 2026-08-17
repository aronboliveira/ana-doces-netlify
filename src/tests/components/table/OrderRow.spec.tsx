import { render, screen } from "@testing-library/react";
import OrderRow from "../../../tableComponents/OrderRow";
import OrderTitle from "../../../tableComponents/OrderTitle";
import { OrderProps } from "../../../declarations/interfaces";

jest.mock("../../../tableComponents/OrderTitle", () =>
  jest.fn(() => <td>OrderTitle</td>)
);
jest.mock("../../../tableComponents/OrderQuantity", () =>
  jest.fn(() => <td>OrderQuantity</td>)
);
jest.mock("../../../tableComponents/OrderRemove", () =>
  jest.fn(() => <td>OrderRemove</td>)
);
// GenericErrorComponent is deliberately NOT mocked here -- the second
// test needs its real rendering (which shows the `message` prop) to
// verify OrderRow's own ErrorBoundary fallback text.

describe("OrderRow Component", () => {
  const defaultProps: OrderProps = {
    id: "1",
    title: "Test Product",
    quantity: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<OrderRow {...defaultProps} />);
    expect(screen.getByText("OrderTitle")).toBeInTheDocument();
    expect(screen.getByText("OrderQuantity")).toBeInTheDocument();
    expect(screen.getByText("OrderRemove")).toBeInTheDocument();
  });

  test("renders error fallback when error occurs", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // Force a real render-time throw from one of OrderRow's children so
    // its own ErrorBoundary actually trips (an effect-scoped throw,
    // caught internally by the child, never would).
    (OrderTitle as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    render(<OrderRow {...defaultProps} />);

    expect(
      screen.getByText(/Erro criando linha para Test Product/)
    ).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
