import { render } from "@testing-library/react";
import AuthorText from "src/interactives/AuthorText";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../icons/BehanceIcon", () =>
  jest.fn(() => <span>BehanceIcon</span>)
);
jest.mock("../../../icons/GitHubIcon", () =>
  jest.fn(() => <span>GithubIcon</span>)
);
jest.mock("../../../icons/LinkedinIcon", () =>
  jest.fn(() => <span>LinkedinIcon</span>)
);

describe("AuthorText Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    authorTitle: "Author Title",
    authorName: "John Doe",
    authorDetails: "Details about John Doe",
    links: [
      "https://www.behance.net/johndoe",
      "https://github.com/johndoe",
      "https://www.linkedin.com/in/johndoe/",
    ],
  };

  test("renders without crashing", () => {
    const { getByText } = render(<AuthorText {...defaultProps} />);
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Details about John Doe")).toBeInTheDocument();
  });

  test("renders social media icons based on links", () => {
    const { getByText } = render(<AuthorText {...defaultProps} />);
    expect(getByText("BehanceIcon")).toBeInTheDocument();
    expect(getByText("GithubIcon")).toBeInTheDocument();
    expect(getByText("LinkedinIcon")).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<AuthorText {...defaultProps} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<AuthorText {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
