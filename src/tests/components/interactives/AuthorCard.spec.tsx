import { render } from "@testing-library/react";
import AuthorCard from "src/interactives/AuthorCard";
import * as handlersCmn from "../../../handlersCmn";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

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
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<AuthorCard {...defaultProps} />);

    // The component logs a single concatenated string, not (message, Error).
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error executing useEffect for AuthorCard")
    );

    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
