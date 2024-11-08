import { render, fireEvent } from "@testing-library/react";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import Header from "src/interactives/Header";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../icons/InstIcon", () =>
  jest.fn(() => <span>InstIcon</span>)
);
jest.mock("../../../modals/InfosModal", () =>
  jest.fn(() => <div>InfosModal</div>)
);
jest.mock("../../../icons/ErrorIcon", () =>
  jest.fn(() => <span>ErrorIcon</span>)
);

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders InstIcon and link", () => {
    const { getByText } = render(<Header />);
    expect(getByText("InstIcon")).toBeInTheDocument();
    expect(getByText("acessar nosso Instagram")).toBeInTheDocument();
  });

  test("toggles InfosModal when button is clicked", () => {
    const { getByText, queryByText } = render(<Header />);
    const button = getByText("Sobre & Autores");

    fireEvent.click(button);

    expect(queryByText("InfosModal")).toBeInTheDocument();

    fireEvent.click(button);

    expect(queryByText("InfosModal")).not.toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<Header />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(<Header />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
