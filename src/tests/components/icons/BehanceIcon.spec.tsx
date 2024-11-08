import { render } from "@testing-library/react";
import BehanceIcon from "src/icons/BehanceIcon";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../handlersCmn");
jest.mock("../handlersErrors");

describe("BehanceIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Behance icon without errors", () => {
    const { container } = render(<BehanceIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<BehanceIcon />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("renders ErrorIcon if there is an error", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    const { getByTestId } = render(<BehanceIcon />);
    const errorIcon = getByTestId("error-icon");

    expect(errorIcon).toBeInTheDocument();
  });
});
