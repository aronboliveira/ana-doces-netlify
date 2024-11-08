import { render, screen, fireEvent } from "@testing-library/react";
import OrderRemove, {
  handleRemoveOrder,
} from "src/tableComponents/OrderRemove";
import { OrderProps } from "src/declarations/interfaces";
import * as ReactDOMClient from "react-dom/client";
import * as handlersErrors from "src/handlersErrors";

jest.mock("react-dom/client");
jest.mock("src/handlersErrors");
jest.mock("src/handlersCmn", () => ({
  baseFestValues: new Map(),
  baseMappedValues: new Map(),
  baseValues: new Map(),
  factorFestValues: new Map(),
  factorMaps: new Map(),
  roundToTenth: jest.fn(),
}));
jest.mock("./OrderRow", () => jest.fn(() => <div>OrderRow</div>));

describe("OrderRemove Component", () => {
  const defaultProps: OrderProps = {
    id: "1",
    title: "Test Product",
    quantity: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactDOMClient.createRoot as jest.Mock).mockImplementation(() => ({
      render: jest.fn(),
      unmount: jest.fn(),
    }));
  });

  test("renders without crashing", () => {
    render(<OrderRemove {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("calls handleRemoveOrder on button click", () => {
    const handleRemoveOrderMock = jest.spyOn(
      require("./OrderRemove"),
      "handleRemoveOrder"
    );
    render(<OrderRemove {...defaultProps} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(handleRemoveOrderMock).toHaveBeenCalled();
  });
});

describe("handleRemoveOrder Function", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table>
        <tbody id="tbodyOrders">
          <tr id="orderRow1">
            <td class="celQuant"><output class="outp_orderQuant">1</output></td>
            <td class="celName"><output class="outp_orderTitle">Test Product</output></td>
            <td class="celRemove"><button id="removeButton1"></button></td>
          </tr>
        </tbody>
      </table>
      <div id="total">R$ 10,00</div>
    `;
    (ReactDOMClient.createRoot as jest.Mock).mockImplementation(() => ({
      render: jest.fn(),
      unmount: jest.fn(),
    }));
  });

  test("updates total price and removes order row", () => {
    const ref = document.getElementById("removeButton1") as HTMLElement;
    handleRemoveOrder(ref);

    const total = document.getElementById("total");
    expect(total?.textContent).toBe("R$ 0,00");

    const orderRow = document.getElementById("orderRow1");
    expect(orderRow).toBeNull();
  });

  test("handles errors gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const elementNotFoundMock = handlersErrors.elementNotFound as jest.Mock;
    elementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    const ref = document.getElementById("removeButton1") as HTMLElement;
    handleRemoveOrder(ref);

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
