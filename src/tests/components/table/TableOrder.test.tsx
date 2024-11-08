import { render, screen, fireEvent } from "@testing-library/react";
import { TableOrders } from "src/tableComponents/TableOrders";
import * as ReactErrorBoundary from "react-error-boundary";
import * as ReactDOMClient from "react-dom/client";
import GenericErrorComponent from "src/errors/GenericErrorComponent";

jest.mock("react-dom/client");
jest.mock("../../../handlersErrors");
jest.mock("../../../tableComponents/OrderRow", () =>
  jest.fn(() => (
    <tr>
      <td>OrderRow</td>
    </tr>
  ))
);
jest.mock("../../../errors/GenericErrorComponent", () =>
  jest.fn(() => <div>Error</div>)
);

describe("TableOrders Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ReactDOMClient.createRoot as jest.Mock).mockImplementation(() => ({
      render: jest.fn(),
      unmount: jest.fn(),
    }));
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

  test("renders error fallback when error occurs", () => {
    render(
      <ReactErrorBoundary.ErrorBoundary
        FallbackComponent={() => <GenericErrorComponent message="Error" />}
      >
        <GenericErrorComponent message="Error" />
      </ReactErrorBoundary.ErrorBoundary>
    );

    expect(
      screen.getByText("Erro carregando tabela de produtos!")
    ).toBeInTheDocument();
  });

  test("reset button clears the table", () => {
    render(<TableOrders />);
    const resetButton = screen.getByText("Limpar Tabela");
    fireEvent.click(resetButton);

    expect(ReactDOMClient.createRoot).toHaveBeenCalled();
  });
});
