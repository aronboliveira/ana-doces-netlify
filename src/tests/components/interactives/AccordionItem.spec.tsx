import { render, fireEvent } from "@testing-library/react";
import AccordionItem from "src/interactives/AccordionItem";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import ErrorMessageComponent from "src/errors/ErrorMessageComponent";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../errors/ErrorMessageComponent", () =>
  jest.fn(() => <div>Error</div>)
);
// AccordionItem imports basePath from "../index" (src/index.tsx), which is
// an executable entry-point script with real side effects (renders <Header
// /> into a real <header>, etc.) at module scope -- mock it to a plain
// stub so importing AccordionItem doesn't run the whole app bootstrap.
jest.mock("../../../index", () => ({ basePath: "/" }));

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

  test("handles button click by pushing an info URL", () => {
    // The "show" class toggle on .accordion-collapse is Bootstrap's own
    // collapse.js reacting to data-bs-toggle, not something this
    // component's onClick drives -- Bootstrap isn't loaded in jsdom, so
    // the actual, verifiable click behavior here is the pushState call.
    const pushStateSpy = jest.spyOn(history, "pushState");
    const { getByText } = render(<AccordionItem {...defaultProps} />);
    const button = getByText("Header Text");

    fireEvent.click(button);

    expect(pushStateSpy).toHaveBeenCalled();
    pushStateSpy.mockRestore();
  });

  test('adds "last-accordion-item" class if lastItem is true', () => {
    const props = { ...defaultProps, lastItem: true };
    const { container } = render(<AccordionItem {...props} />);
    expect(container.querySelector(".accordion-item")).toHaveClass(
      "last-accordion-item"
    );
  });

  test("handles errors in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<AccordionItem {...defaultProps} />);

    // The component logs a single concatenated string, not (message, Error).
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Error executing useEffect for mainRef in Accordion"
      )
    );

    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });

  test("keeps rendering normally instead of tripping the ErrorBoundary", () => {
    // mainRef's guard is caught internally and never rethrown, so
    // react-error-boundary's fallback (ErrorMessageComponent) can never
    // actually engage from this path -- confirm that stays true rather
    // than asserting an unreachable fallback render.
    const ErrorMessageComponentMock = ErrorMessageComponent as jest.Mock;
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    const { getByText } = render(<AccordionItem {...defaultProps} />);

    expect(getByText("Header Text")).toBeInTheDocument();
    expect(ErrorMessageComponentMock).not.toHaveBeenCalled();
  });
});
