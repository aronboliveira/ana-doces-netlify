import { render } from "@testing-library/react";
import ErrorMessageComponent from "src/errors/ErrorMessageComponent";
describe("ErrorMessageComponent", () => {
  test("renders with default message", () => {
    const { getByText } = render(<ErrorMessageComponent message="Error" />);
    expect(getByText("Erro indefinido")).toBeInTheDocument();
  });
  test("renders with custom message", () => {
    const customMessage = "Custom error message";
    const { getByText } = render(
      <ErrorMessageComponent message={customMessage} />
    );
    expect(getByText(customMessage)).toBeInTheDocument();
  });
});
