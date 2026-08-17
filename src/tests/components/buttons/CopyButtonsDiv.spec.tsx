import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as handlersCmn from "../../../handlersCmn";
import CopyButtonsDiv from "src/buttons/CopyButtonsDiv";
jest.mock("../../../handlersCmn");
jest.mock("../../../handlersErrors");
// DirectCaller isn't what this file tests, and handlersCmn is
// automocked wholesale above -- DirectCaller calls capitalizeFirstLetter/
// normalizeSpacing directly while constructing its own JSX (not inside
// an effect), so their automocked `undefined` return crashes it during
// render, tripping CopyButtonsDiv's own ancestor ErrorBoundary before
// any of these tests get a chance to run.
jest.mock("../../../callers/DirectCaller", () =>
  jest.fn(() => <div>DirectCaller</div>)
);
describe("CopyButtonsDiv Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div id="divBtns"></div>
      <div id="total">R$ 100,00</div>
      <span id="copyAlert"></span>
    `;
  });
  test("renders without crashing", () => {
    render(<CopyButtonsDiv />);
    expect(screen.getByText("Copiar Texto Padrão")).toBeInTheDocument();
    expect(
      screen.getByText("Copiar Texto para o WhatsApp")
    ).toBeInTheDocument();
  });
  test('copies default message when "Copiar Texto Padrão" is clicked', async () => {
    const concatProductsMock = handlersCmn.concatProducts;
    const switchAlertOpMock = handlersCmn.switchAlertOp;
    (concatProductsMock as any).mockReturnValue("Mocked Message");
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<CopyButtonsDiv />);
    const button = screen.getByText("Copiar Texto Padrão");
    fireEvent.click(button);
    expect(concatProductsMock).toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith("Mocked Message");
    // switchAlertOp fires from the writeText promise's .then(), a
    // microtask that hasn't resolved yet right after fireEvent.click.
    await waitFor(() => expect(switchAlertOpMock).toHaveBeenCalled());
  });
  test('copies WhatsApp formatted message when "Copiar Texto para o WhatsApp" is clicked', async () => {
    const concatProductsMock = handlersCmn.concatProducts;
    const switchAlertOpMock = handlersCmn.switchAlertOp;
    (concatProductsMock as any).mockReturnValue("Mocked WhatsApp Message");
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<CopyButtonsDiv />);
    const button = screen.getByText("Copiar Texto para o WhatsApp");
    fireEvent.click(button);
    expect(concatProductsMock).toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith("Mocked WhatsApp Message");
    await waitFor(() => expect(switchAlertOpMock).toHaveBeenCalled());
  });

  test("handles errors gracefully when total element is missing", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    document.getElementById("total")?.remove();
    render(<CopyButtonsDiv />);
    const button = screen.getByText("Copiar Texto Padrão");
    fireEvent.click(button);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
