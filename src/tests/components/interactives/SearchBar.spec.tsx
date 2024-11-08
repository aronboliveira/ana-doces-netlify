import { render, fireEvent } from "@testing-library/react";
import SearchBar from "src/interactives/SearchBar";
import * as handlersCmn from "../../../handlersCmn";
import * as handlersErrors from "../../../handlersErrors";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../icons/SearchIcon", () =>
  jest.fn(() => <span>SearchIcon</span>)
);

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    searchParams: new URLSearchParams(),
    setSearchParams: jest.fn(),
    navigate: jest.fn(),
  };

  test("renders without crashing", () => {
    const { getByRole } = render(
      <Router>
        <SearchBar {...defaultProps} />
      </Router>
    );
    const input = getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  test("calls handleSearchFilter on input change", () => {
    const handleSearchFilterMock = handlersCmn.handleSearchFilter as jest.Mock;

    const { getByRole } = render(
      <Router>
        <SearchBar {...defaultProps} />
      </Router>
    );
    const input = getByRole("searchbox");

    fireEvent.change(input, { target: { value: "test" } });

    expect(handleSearchFilterMock).toHaveBeenCalled();
  });

  test("updates URL search params on input change", () => {
    const { getByRole } = render(
      <Router>
        <SearchBar {...defaultProps} />
      </Router>
    );
    const input = getByRole("searchbox");

    fireEvent.change(input, { target: { value: "test" } });

    expect(defaultProps.setSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams)
    );
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(
      <Router>
        <SearchBar {...defaultProps} />
      </Router>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
