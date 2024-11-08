import { render } from "@testing-library/react";
import GenericErrorComponent from "src/errors/GenericErrorComponent";
import { act } from "react";
jest.mock("../handlersErrors");
describe("GenericErrorComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    document.body.innerHTML = "<main></main>";
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());
  test("renders with default message", () => {
    const { getByText } = render(<GenericErrorComponent message="Error" />);
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
    act(() => jest.advanceTimersByTime(3000));
    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });
  test("retries page reload after multiple attempts", () => {
    Object.defineProperty(window, "location", {
      value: { reload: jest.fn() },
      writable: true,
    });
    render(<GenericErrorComponent message="Erro" />);
    act(() => jest.advanceTimersByTime(8000));
    expect(sessionStorage.getItem("retryAcc")).toBe("1");
    expect(window.location.reload).toHaveBeenCalled();
    (window.location.reload as any).mockRestore();
  });
});
