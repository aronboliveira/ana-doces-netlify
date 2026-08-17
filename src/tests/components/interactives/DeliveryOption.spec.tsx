import { render, fireEvent, waitFor } from "@testing-library/react";
import DeliveryOption from "src/interactives/DeliveryOption";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("DeliveryOption Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    history.pushState({}, "", "/");
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

  test("opens details if URL contains the id", async () => {
    // jsdom's window.location is a non-configurable accessor, so it can
    // never be replaced via Object.defineProperty; drive it through the
    // real navigation API instead, same as the component's own handler.
    history.pushState({}, "", "/?Option1");

    const { container } = render(<DeliveryOption {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    // detailRef.current.open is set from a setTimeout(..., 300) in the effect.
    await waitFor(() => expect(detailsElement).toHaveAttribute("open"));
  });

  test("handles toggle event", () => {
    const { container } = render(<DeliveryOption {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    fireEvent(detailsElement!, new Event("toggle", { bubbles: true }));
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<DeliveryOption {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
