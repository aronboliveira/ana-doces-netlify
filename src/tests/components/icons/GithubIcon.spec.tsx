import { render } from "@testing-library/react";
import GithubIcon from "src/icons/GitHubIcon";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../handlersCmn");
jest.mock("../handlersErrors");

describe("GithubIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the GitHub icon without errors", () => {
    const { container } = render(<GithubIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<GithubIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("renders ErrorIcon if there is an error", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    const { getByTestId } = render(<GithubIcon />);
    const errorIcon = getByTestId("error-icon");

    expect(errorIcon).toBeInTheDocument();
  });
});
