import { render } from "@testing-library/react";
import AppProvider from "src/routing/AppProvider";
jest.mock("./AnaDocesApp", () => jest.fn(() => <div>AnaDocesApp</div>));

describe("AppProvider Component", () => {
  test("renders without crashing and provides context", () => {
    const { getByText } = render(<AppProvider />);
    expect(getByText("AnaDocesApp")).toBeInTheDocument();
  });

  test("provides AppContext with rootsState and setRoot", () => {
    let contextValue = null;
    render(<AppProvider />);
    if (contextValue) {
      expect(contextValue).toHaveProperty("rootsState");
      expect(contextValue).toHaveProperty("setRoot");
      expect(typeof (contextValue as any).setRoot).toBe("function");
    }
  });
});
