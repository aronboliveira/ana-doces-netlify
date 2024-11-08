import { render, fireEvent } from "@testing-library/react";
import AccordionItem from "src/interactives/AccordionItem";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import ErrorMessageComponent from "src/errors/ErrorMessageComponent";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../errors/ErrorMessageComponent", () =>
  jest.fn(() => <div>Error</div>)
);

describe("AccordionItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    parentId: "accordionParent",
    baseId: "item1",
    headerText: "Header Text",
    innerText: "Inner Content",
    defShow: false,
    lastItem: false,
  };

  test("renders without crashing", () => {
    const { getByText } = render(<AccordionItem {...defaultProps} />);
    expect(getByText("Header Text")).toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<AccordionItem {...defaultProps} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles button click to toggle collapse", () => {
    const { getByText, container } = render(
      <AccordionItem {...defaultProps} />
    );
    const button = getByText("Header Text");

    expect(container.querySelector(".collapse.show")).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(container.querySelector(".collapse.show")).toBeInTheDocument();
  });

  test('adds "last-accordion-item" class if lastItem is true', () => {
    const props = { ...defaultProps, lastItem: true };
    const { container } = render(<AccordionItem {...props} />);
    expect(container.querySelector(".accordion-item")).toHaveClass(
      "last-accordion-item"
    );
  });

  test("handles errors in useEffect gracefully", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(<AccordionItem {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Error executing useEffect for mainRef in Accordion"
      ),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test("renders error boundary on error", () => {
    const ErrorMessageComponentMock = ErrorMessageComponent as jest.Mock;
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;

    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<AccordionItem {...defaultProps} />);

    expect(ErrorMessageComponentMock).toHaveBeenCalledWith(
      { message: "Erro carregando item do acordeão" },
      {}
    );
  });
});
