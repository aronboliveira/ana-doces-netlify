import { render, fireEvent, waitFor } from "@testing-library/react";
import AuthorDetails from "src/interactives/AuthorDetails";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../interactives/AuthorText", () => jest.fn(() => <div>AuthorText Component</div>));

describe("AuthorDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    history.pushState({}, "", "/");
  });

  const defaultProps = {
    authorTitle: "Author Title",
    authorName: "John Doe",
    authorDetails: "Details about John Doe",
    links: ["https://example.com"],
  };

  test("renders without crashing", () => {
    const { getByText } = render(<AuthorDetails {...defaultProps} />);
    expect(getByText("Author Title")).toBeInTheDocument();
    expect(getByText("AuthorText Component")).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<AuthorDetails {...defaultProps} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("opens details if URL contains the id", async () => {
    // jsdom's window.location is a non-configurable accessor, so it can
    // never be replaced via Object.defineProperty; drive it through the
    // real navigation API instead, same as the component's own handler.
    history.pushState({}, "", "/?Author%20Title");

    const { container } = render(<AuthorDetails {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    // detailRef.current.open is set from a setTimeout(..., 300) in the effect.
    await waitFor(() => expect(detailsElement).toHaveAttribute("open"));
  });

  test("handles toggle event", () => {
    const { container } = render(<AuthorDetails {...defaultProps} />);
    const detailsElement = container.querySelector("details");
    fireEvent(detailsElement!, new Event("toggle", { bubbles: true }));
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<AuthorDetails {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
