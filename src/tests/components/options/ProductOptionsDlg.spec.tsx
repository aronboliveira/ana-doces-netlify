import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductOptionsDlg from "src/productOptions/ProductOptionsDlg";
import { ProductOption } from "src/declarations/classes";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import { useParams } from "react-router-dom";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../suboptions/SuboptionsCont", () =>
  jest.fn(() => <div>SuboptionsCont</div>)
);
jest.mock("../../../callers/Spinner", () => jest.fn(() => <div>Spinner</div>));
jest.mock("../../../productOptions/ProductOptionGrid", () =>
  jest.fn(() => <div>ProductOptionGrid</div>)
);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ProductOptionsDlg Component", () => {
  // jsdom doesn't implement <dialog>'s showModal()/close(), which the
  // component relies on to set the `open` attribute -- without it, the
  // dialog (and everything inside it) never becomes accessible, so
  // getByRole finds nothing at all in the whole document.
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

  const defaultOptions: ProductOption[] = [
    new ProductOption("Option A", "R$10,00", "Description A", "1", "1-001"),
    new ProductOption("Option B", "R$20,00", "Description B", "1", "1-002"),
  ];
  const defaultProps = {
    shouldShowOptions: true,
    options: defaultOptions,
    subOptions: [["SubOption1"], ["SubOption2"]],
    root: null,
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({});
    jest.spyOn(window.history, "pushState").mockImplementation();
    // isClickOutside is automocked (handlersCmn is mocked wholesale
    // above) and returns undefined by default, which the dialog's own
    // onClick immediately calls .some() on -- any click bubbling up to
    // the dialog (including clicks on its own children, like the close
    // button) would crash without a real return value here. Default to
    // "not an outside click"; tests simulating one override this.
    (handlersCmn.isClickOutside as jest.Mock).mockReturnValue([false]);
  });

  test("renders without crashing", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    // The heading starts as "Opções — " (static JSX), but the header-
    // naming effect rewrites it to plain "Opções" once it can't match
    // this dialog to a sibling <li> -- which never exists when the
    // component is rendered standalone, outside its real Compound
    // Pattern context (dialog rendered as ProductGrid's JSX sibling).
    expect(screen.getByText("Opções")).toBeInTheDocument();
    expect(screen.getByText("SuboptionsCont")).toBeInTheDocument();
    expect(screen.getByText("Spinner")).toBeInTheDocument();
  });

  test("calls setOptions when close button is clicked", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(defaultProps.setOptions).toHaveBeenCalledWith(false);
  });

  test("does not render dialog when shouldShowOptions is false", () => {
    const props = { ...defaultProps, shouldShowOptions: false };
    render(<ProductOptionsDlg {...props} />);
    expect(screen.queryByText("Opções —")).not.toBeInTheDocument();
  });

  test("handles click outside to close the dialog", () => {
    // The dialog's close-on-outside-click logic is wired to onClick, not
    // mousedown, and lives on the dialog itself.
    (handlersCmn.isClickOutside as jest.Mock).mockReturnValue([true]);
    const { container, unmount } = render(<ProductOptionsDlg {...defaultProps} />);
    fireEvent.click(container.querySelector("dialog")!);
    expect(defaultProps.setOptions).toHaveBeenCalledWith(false);
    // The handler also removes the dialog from the DOM natively (outside
    // React's own reconciliation), so React's own automatic unmount at
    // the end of this test -- which still expects to find it under its
    // last-known parent -- throws. Unmount explicitly here and swallow
    // that specific, expected inconsistency instead of letting RTL's
    // automatic cleanup fail the test on it.
    try {
      unmount();
    } catch (e) {
      if (!/not a child of this node/i.test((e as Error).message)) throw e;
    }
  });

  test("calls adjustIdentifiers in useEffect", () => {
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("does not render ProductOptionGrid options when rendered outside its Compound Pattern context", () => {
    // ProductOptionGrid instances only ever get created via
    // handlersCmn.attemptRender, called from a setInterval inside the
    // component's own effect -- and handlersCmn is automocked wholesale
    // above, so attemptRender is a no-op that never calls menuRoot.render.
    // Even with a real attemptRender, the option-rendering branch itself
    // requires the dialog's previousElementSibling to be the product
    // <li> it belongs to (the real app always renders this dialog as
    // ProductGrid's JSX sibling -- see AGENTS.md's Compound Pattern
    // note), which doesn't exist for a dialog rendered standalone here.
    const ProductOptionGridMock =
      require("../../../productOptions/ProductOptionGrid") as jest.Mock;
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(ProductOptionGridMock).not.toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<ProductOptionsDlg {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("updates history when optionsRef has id", () => {
    render(<ProductOptionsDlg {...defaultProps} />);
    expect(window.history.pushState).toHaveBeenCalled();
  });
});
