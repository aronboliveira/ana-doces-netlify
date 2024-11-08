import { render, fireEvent } from "@testing-library/react";
import AuthorDetails from "src/interactives/AuthorDetails";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("./AuthorText", () => jest.fn(() => <div>AuthorText Component</div>));

describe("AuthorDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test("opens details if URL contains the id", () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/?Author%20Title",
      },
    });

    const { container } = render(<AuthorDetails {...defaultProps} />);
    const detailsElement = container.querySelector("details");

    expect(detailsElement).toHaveAttribute("open");
  });

  test("handles toggle event", () => {
    const { container } = render(<AuthorDetails {...defaultProps} />);
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

    render(<AuthorDetails {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
