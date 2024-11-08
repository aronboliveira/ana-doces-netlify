import { render, waitFor } from "@testing-library/react";
import QRCWpCaller from "src/callers/QRCWpCaller";
import * as handlersCmn from "../../../handlersCmn";
jest.mock("../../handlersCmn");
jest.mock("../../handlersErrors");
describe("QRCWpCaller Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });
  test("renders and loads QR code image", async () => {
    const testSrc = "https://example.com/qrcode.png";
    (handlersCmn.testSource as any).mockResolvedValue(true);
    const { getByRole } = render(
      <QRCWpCaller
        innerTextL="QR Code"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        src={testSrc}
      />
    );
    await waitFor(() => {
      expect(getByRole("img")).toHaveAttribute("src", testSrc);
    });
  });
  test("handles image load failure", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(),
      testSrc = "https://example.com/qrcode.png";
    (handlersCmn.testSource as any).mockResolvedValue(false);
    render(
      <QRCWpCaller
        innerTextL="QR Code"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        color="#fff"
        src={testSrc}
      />
    );
    await waitFor(() =>
      expect(consoleWarnSpy).toHaveBeenCalledWith("Failed to load QRCode img")
    );
    consoleWarnSpy.mockRestore();
  });
});
