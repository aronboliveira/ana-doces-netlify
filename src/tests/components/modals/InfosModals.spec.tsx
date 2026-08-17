import { render, fireEvent } from "@testing-library/react";
import InfosModal from "src/modals/InfosModal";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../index", () => ({ basePath: "/" }));
jest.mock("../../../interactives/AuthorCard", () =>
  jest.fn(() => <div>AuthorCard</div>)
);
jest.mock("../../../interactives/AccordionItem", () =>
  jest.fn(() => <div>AccordionItem</div>)
);
jest.mock("../../../interactives/DeliveryOption", () =>
  jest.fn(() => <div>DeliveryOption</div>)
);
jest.mock("../../../icons/WpIcon", () => jest.fn(() => <div>WpIcon</div>));
jest.mock("../../../icons/InstIcon", () => jest.fn(() => <div>InstIcon</div>));
jest.mock("../../../interactives/AuthorDetails", () =>
  jest.fn(() => <div>AuthorDetails</div>)
);
jest.mock("../../../errors/ErrorMessageComponent", () =>
  jest.fn(() => <div>ErrorMessageComponent</div>)
);

describe("InfosModal Component", () => {
  // jsdom doesn't implement <dialog>'s showModal()/close() -- the
  // component calls both unconditionally on mount/toggle, and an
  // unimplemented method throws (rather than no-op), which was
  // silently short-circuiting several effects (including the one that
  // registers the Escape-key listener) before this suite even got mocks
  // involved.
  beforeAll(() => {
    if (!HTMLDialogElement.prototype.showModal)
      HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      };
    if (!HTMLDialogElement.prototype.close)
      HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        this.removeAttribute("open");
      };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.history.pushState = jest.fn();
  });

  const defaultProps = {
    dispatch: jest.fn(),
    state: true,
  };

  test("renders without crashing", () => {
    const { getByText } = render(<InfosModal {...defaultProps} />);
    expect(getByText("Informações")).toBeInTheDocument();
  });

  test("calls dispatch and closes dialog on Escape key press", () => {
    render(<InfosModal {...defaultProps} />);
    // The component wires its Escape handler via the bare (window-level)
    // addEventListener, not a listener on the dialog/document itself.
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    fireEvent(window, event);
    expect(defaultProps.dispatch).toHaveBeenCalledWith(false);
  });

  test("calls dispatch and closes dialog on outside click", () => {
    // isClickOutside is automocked (handlersCmn is mocked wholesale above)
    // and returns undefined by default, which the component immediately
    // calls .some() on -- give it a real return value so the click
    // handler's own logic can run.
    (handlersCmn.isClickOutside as jest.Mock).mockReturnValue([true]);

    const { container } = render(<InfosModal {...defaultProps} />);
    const dialog = container.querySelector("dialog")!;
    fireEvent.click(dialog);
    expect(defaultProps.dispatch).toHaveBeenCalledWith(false);
  });

  test("handles errors in useEffect gracefully", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // dlgRef.current is always a real HTMLDialogElement when state=true
    // on a normal jsdom render (unreachable ref-guard branch), and the
    // component's own first effect reads dlgRef.current unguarded, so
    // forcing useRef to fail crashes earlier than the branch under test.
    // Rendering with state=false leaves the <dialog> (and the ref) out
    // of the tree entirely, which reaches the same catch block cleanly.
    render(<InfosModal {...defaultProps} state={false} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("keeps rendering normally instead of tripping the ErrorBoundary", () => {
    // Same unreachable-ErrorBoundary situation as elsewhere in this
    // suite: the ref-guard's error is caught and logged internally, so
    // it never trips react-error-boundary's fallback.
    const ErrorMessageComponentMock =
      require("../../../errors/ErrorMessageComponent") as jest.Mock;
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<InfosModal {...defaultProps} state={false} />);

    expect(ErrorMessageComponentMock).not.toHaveBeenCalled();
  });
});
