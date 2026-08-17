import { render, fireEvent } from "@testing-library/react";
import * as handlersCmn from "../../../handlersCmn";
import Header from "src/interactives/Header";
// Plain require, not `import * as React` -- Babel's namespace-import
// interop returns a copy of the module namespace, so spying on it
// wouldn't affect the `useRef` the component's own named import reads.
const ReactModule = require("react");

jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
jest.mock("../../../icons/InstIcon", () =>
  jest.fn(() => <span>InstIcon</span>)
);
jest.mock("../../../modals/InfosModal", () =>
  jest.fn(() => <div>InfosModal</div>)
);
jest.mock("../../../icons/ErrorIcon", () =>
  jest.fn(() => <span>ErrorIcon</span>)
);
// Task B additions -- irrelevant to Header's own behavior under test, so
// keep them out of the picture the same way InstIcon/InfosModal are mocked.
jest.mock("../../../modals/MaintenanceModal", () =>
  jest.fn(() => <div>MaintenanceModal</div>)
);
jest.mock("../../../interactives/MaintenanceBar", () =>
  jest.fn(() => <div>MaintenanceBar</div>)
);
jest.mock("../../../hooks/useMaintenanceMode", () =>
  jest.fn(() => ({
    isModalOpen: false,
    isBarVisible: false,
    dismissModal: jest.fn(),
    reopenModal: jest.fn(),
    hideBar: jest.fn(),
  }))
);

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders InstIcon and link", () => {
    const { getByText } = render(<Header />);
    expect(getByText("InstIcon")).toBeInTheDocument();
    expect(getByText(/acessar nosso Instagram/)).toBeInTheDocument();
  });

  test("toggles InfosModal when button is clicked", async () => {
    const { getByText, findByText, queryByText } = render(<Header />);
    const button = getByText("Sobre & Autores");

    fireEvent.click(button);

    // InfosModal is React.lazy-loaded, so it only appears once its
    // dynamic import (and Suspense boundary) resolves.
    expect(await findByText("InfosModal")).toBeInTheDocument();

    fireEvent.click(button);

    expect(queryByText("InfosModal")).not.toBeInTheDocument();
  });

  test("calls syncAriaStates and adjustIdentifiers in useEffect", () => {
    const syncAriaStatesMock = handlersCmn.syncAriaStates as jest.Mock;
    const adjustIdentifiersMock = handlersCmn.adjustIdentifiers as jest.Mock;

    render(<Header />);

    expect(syncAriaStatesMock).toHaveBeenCalled();
    expect(adjustIdentifiersMock).toHaveBeenCalled();
  });

  test("handles error in useEffect gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    // mainRef.current is always a real HTMLElement on a normal jsdom
    // render, so the ref-guard branch is unreachable via mocking alone;
    // forcing useRef to return undefined for mainRef (the only ref in
    // this component) makes the .current read itself throw, exercising
    // the catch branch.
    const useRefSpy = jest
      .spyOn(ReactModule, "useRef")
      .mockReturnValueOnce(undefined);

    render(<Header />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    useRefSpy.mockRestore();
  });
});
