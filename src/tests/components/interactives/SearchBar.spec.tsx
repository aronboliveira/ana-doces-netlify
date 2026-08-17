import { render, fireEvent } from "@testing-library/react";
import SearchBar from "src/interactives/SearchBar";
import * as handlersCmn from "../../../handlersCmn";
import { BrowserRouter as Router } from "react-router-dom";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../icons/SearchIcon", () =>
  jest.fn(() => <span>SearchIcon</span>)
);

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // The component reads/writes location via history.pushState on
    // input change; without resetting it, a URL left over from a prior
    // test (e.g. "?q=test") pre-fills the input on the next test's
    // mount, which makes an identical fireEvent.change a same-value
    // no-op that React's change tracker silently drops.
    history.pushState({}, "", "/");
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
    // searchRef.current is always a real HTMLElement on a normal jsdom
    // render, so the ref-guard branch is unreachable via mocking alone;
    // forcing useRef to return undefined for searchRef (the first call)
    // makes the .current read itself throw, exercising the catch branch.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(
      <Router>
        <SearchBar {...defaultProps} />
      </Router>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
