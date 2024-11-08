import { render, screen } from "@testing-library/react";
import OrderRow from "../../../tableComponents/OrderRow";
import { OrderProps } from "../../../declarations/interfaces";
import * as ReactErrorBoundary from "react-error-boundary";
import GenericErrorComponent from "src/errors/GenericErrorComponent";

jest.mock("../../../tableComponents/OrderTitle", () =>
  jest.fn(() => <td>OrderTitle</td>)
);
jest.mock("../../../tableComponents/OrderQuantity", () =>
  jest.fn(() => <td>OrderQuantity</td>)
);
jest.mock("../../../tableComponents/OrderRemove", () =>
  jest.fn(() => <td>OrderRemove</td>)
);
jest.mock("src/errors/GenericErrorComponent", () =>
  jest.fn(() => <div>Error</div>)
);

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
    render(
      <ReactErrorBoundary.ErrorBoundary
        FallbackComponent={() => <GenericErrorComponent message="Error" />}
      >
        <GenericErrorComponent message="Error" />
      </ReactErrorBoundary.ErrorBoundary>
    );

    expect(screen.getByText(/Erro criando linha para/)).toBeInTheDocument();
  });
});
