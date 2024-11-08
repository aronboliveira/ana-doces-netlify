import { render, screen } from "@testing-library/react";
import OrderTitle from "src/tableComponents/OrderTitle";
import { OrderTitleProps } from "src/declarations/interfaces";

describe("OrderTitle Component", () => {
  const defaultProps: OrderTitleProps = {
    id: "1",
    title: "Test Product",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<OrderTitle {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  test("sets correct IDs and classes", () => {
    render(<OrderTitle {...defaultProps} />);
    const td = screen.getByText("Test Product").closest("td");
    expect(td).toHaveAttribute("id", "titleCel_1");
    expect(td).toHaveClass("celName");

    const output = screen.getByText("Test Product");
    expect(output).toHaveAttribute("id", "titleOutp_1");
    expect(output).toHaveClass("outp_orderTitle");
  });

  test("handles missing id prop", () => {
    render(<OrderTitle id="1" title="No ID" />);
    const td = screen.getByText("No ID").closest("td");
    expect(td).toHaveAttribute("id", "titleCel_unfilled");
  });

  test("handles missing title prop", () => {
    render(<OrderTitle id="2" title="id" />);
    expect(screen.getByText("")).toBeInTheDocument();
  });
});
