import { render } from "@testing-library/react";
import Spinner from "src/callers/Spinner";
describe("Spinner Component", () => {
  test("renders with default props", () => {
    const { container } = render(
      <Spinner
        spinnerClass={"spinner-grow"}
        spinnerColor={"btn-info"}
        message="loading"
      />
    );
    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
    expect(container.querySelector(".visually-hidden")).toHaveTextContent(
      "Loading..."
    );
  });
  test("renders with custom props", () => {
    const { container } = render(
      <Spinner
        spinnerClass="custom-spinner"
        spinnerColor="text-primary"
        message="Please wait..."
      />
    );
    expect(container.querySelector(".custom-spinner")).toBeInTheDocument();
    expect(container.querySelector(".text-primary")).toBeInTheDocument();
    expect(container.querySelector(".visually-hidden")).toHaveTextContent(
      "Please wait..."
    );
  });
});
