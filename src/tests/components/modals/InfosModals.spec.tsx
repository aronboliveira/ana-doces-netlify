import { render, fireEvent } from "@testing-library/react";
import InfosModal from "src/modals/InfosModal";
import * as handlersErrors from "../../../handlersErrors";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../index", () => ({ basePath: "/" }));
jest.mock("../../../interactives/AuthorCard", () =>
  jest.fn(() => <div>AuthorCard</div>)
);
jest.mock("../interactives/AccordionItem", () =>
  jest.fn(() => <div>AccordionItem</div>)
);
jest.mock("../interactives/DeliveryOption", () =>
  jest.fn(() => <div>DeliveryOption</div>)
);
jest.mock("../icons/WpIcon", () => jest.fn(() => <div>WpIcon</div>));
jest.mock("../icons/InstIcon", () => jest.fn(() => <div>InstIcon</div>));
jest.mock("../interactives/AuthorDetails", () =>
  jest.fn(() => <div>AuthorDetails</div>)
);
jest.mock("../errors/ErrorMessageComponent", () =>
  jest.fn(() => <div>ErrorMessageComponent</div>)
);

describe("InfosModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.history.pushState = jest.fn();
    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
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
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    fireEvent(document, event);
    expect(defaultProps.dispatch).toHaveBeenCalledWith(false);
  });

  test("calls dispatch and closes dialog on outside click", () => {
    const { container } = render(<InfosModal {...defaultProps} />);
    const dialog = container.querySelector("dialog")!;
    fireEvent.click(dialog.parentElement!);
    expect(defaultProps.dispatch).toHaveBeenCalledWith(false);
  });

  test("handles errors in useEffect gracefully", () => {
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(<InfosModal {...defaultProps} />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("renders error boundary on error", () => {
    const ErrorMessageComponentMock =
      require("../errors/ErrorMessageComponent") as jest.Mock;
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;

    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<InfosModal {...defaultProps} />);

    expect(ErrorMessageComponentMock).toHaveBeenCalledWith(
      { message: "Erro carregando modal de informações!" },
      {}
    );
  });
});
