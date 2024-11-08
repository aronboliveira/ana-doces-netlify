import { render, fireEvent } from "@testing-library/react";
import DeliveryOption from "src/interactives/DeliveryOption";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("DeliveryOption Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    detailTitle: "Option1",
    summaryText: "Delivery Option 1",
    detailsText: "Details about delivery option 1",
  };

  test("renders without crashing", () => {
    const { getByText } = render(<DeliveryOption {...defaultProps} />);
    expect(getByText("Delivery Option 1")).toBeInTheDocument();
    expect(getByText("Details about delivery option 1")).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<DeliveryOption {...defaultProps} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("opens details if URL contains the id", () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/?Option1",
      },
    });

    const { container } = render(<DeliveryOption {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    expect(detailsElement).toHaveAttribute("open");
  });

  test("handles toggle event", () => {
    const { container } = render(<DeliveryOption {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    (fireEvent as any).toggle(detailsElement!);
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<DeliveryOption {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
