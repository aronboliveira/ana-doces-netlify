import { render } from "@testing-library/react";
import * as handlersCmn from "../../../handlersCmn";
import ErrorIcon from "src/icons/ErrorIcon";

jest.mock("../../handlersCmn");
jest.mock("../../handlersErrors");

describe("ErrorIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ErrorIcon with fill=false by default", () => {
    const { container } = render(<ErrorIcon fill={false} />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.classList.contains("bi-exclamation-circle")).toBe(true);
  });

  test("renders filled ErrorIcon when fill=true", () => {
    const { container } = render(<ErrorIcon fill={true} />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.innerHTML).toContain("bi-exclamation-circle-fill");
  });

  test("calls syncAriaStates in useLayoutEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;

    render(<ErrorIcon fill={false} />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
  });
});
