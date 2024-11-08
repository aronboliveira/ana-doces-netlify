import { render } from "@testing-library/react";
import LinkedinIcon from "src/icons/LinkedinIcon";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("LinkedinIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the LinkedIn icon without errors", () => {
    const { container } = render(<LinkedinIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<LinkedinIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("renders ErrorIcon if there is an error", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    const { getByTestId } = render(<LinkedinIcon />);
    const errorIcon = getByTestId("error-icon");

    expect(errorIcon).toBeInTheDocument();
  });
});
