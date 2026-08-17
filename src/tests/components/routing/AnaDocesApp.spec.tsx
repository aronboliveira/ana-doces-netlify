import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AnaDocesApp from "src/routing/AnaDocesApp";
import { AppContext } from "src/routing/AppProvider";
import { MemoryRouter, useNavigate, useSearchParams } from "react-router-dom";
import { Root } from "react-dom/client";
import * as handlersErrors from "../../../handlersErrors";
import * as handlersCmn from "../../../handlersCmn";

// react-dom/client is deliberately NOT mocked: @testing-library/react's
// own render() uses the same createRoot under the hood (React 19 has no
// legacy ReactDOM.render), so a wholesale mock silently turns RTL's own
// render into a no-op.
jest.mock("../../../handlersErrors");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock("../../../productsMain/ProductsProvider", () =>
  jest.fn(() => <div>ProductsProvider</div>)
);
jest.mock("../../../tableComponents/TableOrders", () => ({
  TableOrders: jest.fn(() => <div>TableOrders</div>),
}));
jest.mock("../../../buttons/CopyButtonsDiv", () =>
  jest.fn(() => <div>CopyButtonsDiv</div>)
);
jest.mock("../../../routing/Home", () => jest.fn(() => <div>Home</div>));
// Spinner is NOT mocked: several tests assert on its `message` prop
// text ("Loading App..."), which a bare jest.fn(() => <div>Spinner</div>)
// mock would never render.
jest.mock("../../../handlersCmn", () => ({
  ...jest.requireActual("../../../handlersCmn"),
  adjustIdentifiers: jest.fn(),
}));

describe("AnaDocesApp Component", () => {
  const setRootMock = jest.fn();
  const contextValue = {
    rootsState: new Map<string, Root>(),
    setRoot: setRootMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // clearAllMocks() only resets call history, not a mock's
    // implementation, so a test-specific setRoot implementation (and
    // whatever it stored) would otherwise leak into later tests.
    contextValue.rootsState.clear();
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(),
      jest.fn(),
    ]);
  });

  afterEach(() => {
    // A couple of tests inject fixture elements directly onto
    // document.body (outside RTL's own render container, which its
    // automatic cleanup doesn't touch).
    document
      .querySelectorAll("#productsRoot, #rootTab, #divBtns")
      .forEach(el => el.remove());
  });

  test("renders without crashing", () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );
    expect(screen.getByText("Loading App...")).toBeInTheDocument();
  });

  test("initializes roots and calls setRoot", async () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(setRootMock).toHaveBeenCalled();
    });
  });

  test("handles errors in useEffect gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const htmlElementNotFoundMock =
      handlersErrors.htmlElementNotFound as jest.Mock;
    htmlElementNotFoundMock.mockImplementation(() => {
      throw new Error("Test Error");
    });

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test("renders Home component when rooted is true", async () => {
    // AnaDocesApp's own JSX only ever renders a Spinner into #mainRoot;
    // Home is mounted *imperatively*, via context.setRoot("mainRoot",
    // createRoot(...)) whose returned promise's .then() flips `rooted`
    // to true, which a later effect reads to call
    // rootsState.get("mainRoot").render(<Home/>). setRoot is a bare
    // jest.fn() by default (returns undefined, so .then() on it throws
    // before rooted is ever set) and never actually stores anything in
    // rootsState either -- give it a real implementation that does both.
    (contextValue.setRoot as jest.Mock).mockImplementation((id, root) => {
      contextValue.rootsState.set(id, root);
      return Promise.resolve();
    });

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  test("renders ProductsProvider when mounted >= 3", async () => {
    // Reaching ProductsProvider needs the full, real bootstrap chain:
    // rooted (via setRoot's promise) -> Home mounted, polls for
    // #productsRoot to set loaded -> loaded polls for #productsRoot/
    // #rootTab/#divBtns, registering a root for each via setRoot and
    // advancing mounted to 3 -> the mounted effect renders
    // ProductsProvider into the registered #productsRoot root. Home
    // is mocked away, so the three elements it would normally create
    // are provided directly.
    (contextValue.setRoot as jest.Mock).mockImplementation((id, root) => {
      contextValue.rootsState.set(id, root);
      return Promise.resolve();
    });
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="productsRoot"></div><div id="rootTab"></div><div id="divBtns"></div>`
    );

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText("ProductsProvider")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("calls adjustIdentifiers when finished", async () => {
    // The [mounted]-dependent effect unconditionally calls setFinish(true)
    // at its very end regardless of what mounted actually is (including
    // its initial value on mount), so `finished` -- and adjustIdentifiers,
    // from the effect depending on it -- fire on a completely plain
    // render, no useState mocking needed.
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(adjustIdentifiersMock).toHaveBeenCalled();
    });
  });

  test("renders Spinner when loading", () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );
    expect(screen.getByText("Loading App...")).toBeInTheDocument();
  });
});
