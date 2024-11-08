import { render, fireEvent } from "@testing-library/react";
import DirectCaller from "src/callers/DirectCaller";
import * as handlersCmn from "../../../handlersCmn";
jest.mock("../handlersCmn");
jest.mock("../handlersErrors");
describe("DirectCaller Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div id="total">R$ 100,00</div>
      <span id="copyAlert"></span>
    `;
    Object.assign(window, { open: jest.fn() });
  });
  test("renders without crashing", () => {
    const { getByText } = render(
      <DirectCaller
        innerTextL="Chame no Whatsapp!"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        ComponentCase="whatsapp"
      />
    );
    expect(getByText("Chame no Whatsapp!")).toBeInTheDocument();
  });
  test("handles button click and copies message", () => {
    const concatProductsMock = handlersCmn.concatProducts;
    const switchAlertOpMock = handlersCmn.switchAlertOp;
    (concatProductsMock as any).mockReturnValue("Mocked WhatsApp Message");
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    const { getByRole } = render(
      <DirectCaller
        innerTextL="Chame no Whatsapp!"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        ComponentCase="whatsapp"
      />
    );
    const button = getByRole("button");
    fireEvent.click(button);
    expect(concatProductsMock).toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith("Mocked WhatsApp Message");
    expect(switchAlertOpMock).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalled();
  });
  test("handles anchor click and copies message", () => {
    const concatProductsMock = handlersCmn.concatProducts;
    const switchAlertOpMock = handlersCmn.switchAlertOp;
    (concatProductsMock as any).mockReturnValue("Mocked WhatsApp Message");
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    const { getByText } = render(
      <DirectCaller
        innerTextL="Chame no Whatsapp!"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        ComponentCase="whatsapp"
      />
    );
    fireEvent.click(getByText("Chame no Whatsapp!"));
    expect(concatProductsMock).toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith("Mocked WhatsApp Message");
    expect(switchAlertOpMock).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalled();
  });
  test("handles missing total element gracefully", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    document.getElementById("total")?.remove();
    const { getByRole } = render(
      <DirectCaller
        innerTextL="Chame no Whatsapp!"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        ComponentCase="whatsapp"
      />
    );
    fireEvent.click(getByRole("button"));
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
