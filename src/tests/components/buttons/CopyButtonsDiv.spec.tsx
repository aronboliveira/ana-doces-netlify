import { render, screen, fireEvent } from "@testing-library/react";
import * as handlersCmn from "../../../handlersCmn";
import CopyButtonsDiv from "src/buttons/CopyButtonsDiv";
jest.mock("../../handlersCmn");
jest.mock("../../handlersErrors");
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
    expect(switchAlertOpMock).toHaveBeenCalled();
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
    expect(switchAlertOpMock).toHaveBeenCalled();
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
