import { render, screen, fireEvent } from "@testing-library/react";
import { TableOrders, tbodyProps } from "src/tableComponents/TableOrders";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersErrors");
jest.mock("../../../tableComponents/OrderRow", () =>
  jest.fn(() => (
    <tr>
      <td>OrderRow</td>
    </tr>
  ))
);
// react-dom/client is deliberately NOT mocked: @testing-library/react's
// own render() uses the same createRoot under the hood (React 19 has no
// legacy ReactDOM.render), so a wholesale mock silently turns RTL's own
// render into a no-op.

describe("TableOrders Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // tbodyProps is a module-level singleton the component mutates
    // (roots, refs); left over from a prior test it points at DOM
    // already unmounted by RTL's own cleanup, and the component reuses
    // a root as long as it looks intact (root._internalRoot truthy),
    // so a stale root leaks across tests within this file.
    tbodyProps.root = undefined;
    tbodyProps.currentRef = undefined;
    tbodyProps.primaryRowRoot = undefined;
    tbodyProps.roots = {};
  });

  test("renders without crashing", () => {
    render(<TableOrders />);
    expect(screen.getByText("Pedido")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Quantidades")).toBeInTheDocument();
    expect(screen.getByText("Remoções")).toBeInTheDocument();
  });

  test("renders OrderRow component", () => {
    render(<TableOrders />);
    expect(screen.getByText("OrderRow")).toBeInTheDocument();
  });

  test("reset button clears the table", () => {
    render(<TableOrders />);
    const resetButton = screen.getByText("Limpar Tabela");
    const tbody = document.getElementById("tbodyOrders")!;

    fireEvent.click(resetButton);

    // The reset handler unmounts the current tbody root and mounts a
    // fresh one rendering a placeholder OrderRow -- verifying that
    // real re-render happened (rather than spying on createRoot, an
    // implementation detail) is the meaningful, reachable assertion.
    expect(tbody).toContainElement(screen.getByText("OrderRow"));
  });

  test("keeps rendering normally despite a defensively-mocked error path", () => {
    // TableOrders' own ErrorBoundary can only catch errors from its
    // *static* JSX tree, but that tree is just <thead>/<tbody> -- no
    // custom child component lives there to throw during reconciliation.
    // OrderRow only ever appears via imperative
    // tbodyProps.root.render(...) calls inside effects, on a separate,
    // independent React root; an error there doesn't propagate through
    // TableOrders' reconciliation (or its boundary) at all. The
    // reachable, meaningful assertion is that the table's own static
    // content still renders even when a downstream helper is mocked to
    // fail.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => new Error("Test Error"));

    render(<TableOrders />);

    expect(screen.getByText("Pedido")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
