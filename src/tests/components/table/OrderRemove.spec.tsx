import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderRemove, {
  handleRemoveOrder,
} from "src/tableComponents/OrderRemove";
import { OrderProps } from "src/declarations/interfaces";
import * as handlersErrors from "src/handlersErrors";

jest.mock("src/handlersErrors");
jest.mock("src/handlersCmn", () => ({
  baseFestValues: new Map(),
  baseMappedValues: new Map(),
  // "brownie simples" (the one recognized productMainPart the fixture
  // title below matches) needs a real value, or the price-diff branch
  // throws "Failed to fetch product value in map" before ever reaching
  // the total-update logic under test.
  baseValues: new Map([["brownie simples", 10]]),
  factorFestValues: new Map(),
  factorMaps: new Map(),
  roundToTenth: jest.fn(),
}));
jest.mock("../../../tableComponents/OrderRow", () => jest.fn(() => <div>OrderRow</div>));
// react-dom/client is deliberately NOT mocked: @testing-library/react's
// own render() uses the same createRoot under the hood (React 19 has no
// legacy ReactDOM.render), so a wholesale mock silently turns RTL's own
// render into a no-op -- every test in this file rendered an empty
// container with no error at all until this was found.

// jsdom doesn't implement layout, so it never computes a real .innerText
// (both the getter and setter are effectively no-ops there); this
// component leans on .innerText throughout to read/write cell content,
// so alias it to textContent for this whole suite.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "innerText", {
    configurable: true,
    get(this: HTMLElement) {
      return this.textContent;
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value;
    },
  });
});

describe("OrderRemove Component", () => {
  const defaultProps: OrderProps = {
    id: "1",
    title: "Test Product",
    quantity: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<OrderRemove {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("calls handleRemoveOrder on button click", () => {
    // handleRemoveOrder is called directly (by local reference) from
    // OrderRemove's own onClick, not through the module's exports
    // object, so spying on the exported binding can't observe that call
    // regardless of require path. In this isolated render there's no
    // #total element, so the reachable, real signal that the handler
    // actually ran is its own graceful-failure console.error.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    render(<OrderRemove {...defaultProps} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error executing callback for")
    );
    consoleErrorSpy.mockRestore();
  });
});

describe("handleRemoveOrder Function", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table>
        <tbody id="tbodyOrders">
          <tr id="orderRow1">
            <td class="celQuant"><output class="outp_orderQuant">1</output></td>
            <td class="celName"><output class="outp_orderTitle">Brownie Simples</output></td>
            <td class="celRemove"><button id="removeButton1"></button></td>
          </tr>
        </tbody>
      </table>
      <div id="total">R$ 10,00</div>
    `;
  });

  test("updates total price and removes order row", () => {
    const ref = document.getElementById("removeButton1") as HTMLElement;
    // handleRemoveOrder calls createRoot(...).render(...) directly,
    // outside of RTL's own event wrappers, so the resulting React
    // update needs an explicit act() to flush synchronously before the
    // DOM assertions below run.
    act(() => handleRemoveOrder(ref));

    const total = document.getElementById("total");
    // Intl.NumberFormat("pt-BR", ...) inserts a non-breaking space
    // (U+00A0) between "R$" and the amount, not a regular space.
    expect(total?.textContent).toMatch(/^R\$\s*0,00$/);

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
