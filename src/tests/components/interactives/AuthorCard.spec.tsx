import { render } from "@testing-library/react";
import AuthorCard from "src/interactives/AuthorCard";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");

describe("AuthorCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    authorName: "John Doe",
    authorDetails: "Developer and Writer",
    imgSrc: "path/to/image.jpg",
  };

  test("renders without crashing", () => {
    const { getByText, getByAltText } = render(
      <AuthorCard {...defaultProps} />
    );
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Developer and Writer")).toBeInTheDocument();
    expect(getByAltText("Imagem de Autor")).toHaveAttribute(
      "src",
      "path/to/image.jpg"
    );
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<AuthorCard {...defaultProps} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles missing mainRef gracefully", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(<AuthorCard {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error executing useEffect for AuthorCard"),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
