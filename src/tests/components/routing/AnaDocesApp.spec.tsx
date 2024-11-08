import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AnaDocesApp from "src/routing/AnaDocesApp";
import { AppContext } from "src/routing/AppProvider";
import { MemoryRouter, useNavigate, useSearchParams } from "react-router-dom";
import { Root } from "react-dom/client";
import * as ReactDOMClient from "react-dom/client";
import * as handlersErrors from "../../../handlersErrors";
import * as handlersCmn from "../../../handlersCmn";

jest.mock("react-dom/client");
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
jest.mock("../../../callers/Spinner", () => jest.fn(() => <div>Spinner</div>));
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
    (ReactDOMClient.createRoot as jest.Mock).mockImplementation(() => ({
      render: jest.fn(),
      unmount: jest.fn(),
    }));
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(),
      jest.fn(),
    ]);
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
    const useStateMock = jest.spyOn(React, "useState");
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [false, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [0, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [false, jest.fn()]);

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

    useStateMock.mockRestore();
  });

  test("renders ProductsProvider when mounted >= 3", async () => {
    let mountedValue = 3;
    const useStateMock = jest.spyOn(React, "useState");
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [mountedValue, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [false, jest.fn()]);

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AnaDocesApp />
        </MemoryRouter>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("ProductsProvider")).toBeInTheDocument();
    });

    useStateMock.mockRestore();
  });

  test("calls adjustIdentifiers when finished", async () => {
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;
    const useStateMock = jest.spyOn(React, "useState");
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [3, jest.fn()]);
    useStateMock.mockImplementationOnce(() => [true, jest.fn()]);

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

    useStateMock.mockRestore();
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
