import { render } from "@testing-library/react";
import GenericErrorComponent from "src/errors/GenericErrorComponent";
import { act } from "react";
jest.mock("../../../handlersErrors");
describe("GenericErrorComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    // The component only seeds this key once, at module-import time, so
    // clearing sessionStorage here needs to put it back the same way.
    sessionStorage.setItem("retryAcc", "0");
    document.body.innerHTML = "<main></main>";
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());
  test("renders with default message", () => {
    const { getByText } = render(<GenericErrorComponent />);
    expect(getByText("Erro indefinido")).toBeInTheDocument();
  });
  test("renders with custom message", () => {
    const customMessage = "Custom error message";
    const { getByText } = render(
      <GenericErrorComponent message={customMessage} />
    );
    expect(getByText(customMessage)).toBeInTheDocument();
  });
  test("attempts to recover after timeout", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    render(<GenericErrorComponent message="Error" />);
    // Recovery only reaches its console.error calls 3000ms (outer) +
    // 5000ms (nested) after mount.
    act(() => jest.advanceTimersByTime(8000));
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
  test("retries page reload after multiple attempts", () => {
    // window.location.reload is non-configurable/non-writable in jsdom
    // (can't be spied or replaced); jsdom's own implementation just logs
    // "not implemented" for navigation rather than throwing, so the
    // reachable, assertable outcome is the retry counter incrementing.
    render(<GenericErrorComponent message="Erro" />);
    act(() => jest.advanceTimersByTime(8000));
    expect(sessionStorage.getItem("retryAcc")).toBe("1");
  });
});
