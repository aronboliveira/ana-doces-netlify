// htmlElementNotFound.test.ts
import {
  argsError,
  elementNotFound,
  htmlElementNotFound,
  numberError,
  parseFinite,
  stringError,
  typeError,
} from "src/handlersErrors";
import { voidishEl, voidishStr } from "src/declarations/types";
describe("htmlElementNotFound", () => {
  test("should return an Error with correct message when element is null", () => {
    const error = htmlElementNotFound(null, "testing");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("HTMLELEMENT ERROR:");
    expect(error.message).toContain(
      "The page experienced an error while validating an HTMLElement for testing."
    );
    expect(error.message).toContain("Obtained element id null;");
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    htmlElementNotFound(null, "testing");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("HTMLELEMENT ERROR:");
    consoleSpy.mockRestore();
  });
  test("should handle element with id and tagName", () => {
    const error = htmlElementNotFound(
      {
        id: "testId",
        tagName: "DIV",
      } as voidishEl,
      "testing"
    );
    expect(error.message).toContain("Obtained element id testId;");
    expect(error.message).toContain("Obtained element tag DIV;");
  });
});
describe("elementNotFound", () => {
  test("should return an Error with correct message when element is undefined", () => {
    const error = elementNotFound(undefined, "testing", ["Element"]);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("ELEMENT ERROR:");
    expect(error.message).toContain(
      "The page experienced an error while validating an Element for testing."
    );
    expect(error.message).toContain("Obtained element id null;");
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    elementNotFound(undefined, "testing", ["Element"]);
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("ELEMENT ERROR:");
    consoleSpy.mockRestore();
  });
  test("should handle element with id and tagName", () => {
    const error = elementNotFound(
      {
        id: "elementId",
        tagName: "SPAN",
      } as voidishEl,
      "testing",
      ["Element"]
    );
    expect(error.message).toContain("Obtained element id elementId;");
    expect(error.message).toContain("Obtained element tag SPAN;");
  });
});
describe("typeError", () => {
  test("should return an Error with correct message for invalid type", () => {
    const error = typeError(123, "input validation", ["string, number"]);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("TYPE ERROR:");
    expect(error.message).toContain(
      "The page experienced an error while validating the type of a variable or constant for input validation."
    );
    expect(error.message).toContain("Obtained value: 123;");
    expect(error.message).toContain('Accepted Types: "string","number"}');
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    typeError("test", "input validation", ["number"]);
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("TYPE ERROR:");
    consoleSpy.mockRestore();
  });
});
describe("numberError", () => {
  test("should return an Error with correct message for invalid number", () => {
    const error = numberError("NaN", "calculations");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("NUMBER ERROR:");
    expect(error.message).toContain(
      "The page experienced an error while validating a variable or constant number for calculations."
    );
    expect(error.message).toContain("Obtained value: NaN");
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    numberError(null, "testing");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("NUMBER ERROR:");
    consoleSpy.mockRestore();
  });
});
describe("argsError", () => {
  test("should return an Error with correct message for invalid arguments", () => {
    const error = argsError(["string", "number"], ...[true, null]);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("ARGUMENTS ERROR:");
    expect(error.message).toContain(
      "The webpage experienced an error while trying to argument for a function"
    );
    expect(error.message).toContain('Accepted Types: "string","number"');
    expect(error.message).toContain(
      "Obtained Value and Instance: true, Boolean"
    );
    expect(error.message).toContain(
      "Obtained Value and Instance: null, Object"
    );
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    argsError(["number"], "test");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("ARGUMENTS ERROR:");
    consoleSpy.mockRestore();
  });
});
describe("stringError", () => {
  test("should return an Error with correct message for invalid string", () => {
    const fetchedStr: voidishStr = "invalid";
    const error = stringError(fetchedStr, "/[0-9]/g");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("STRING ERROR:");
    expect(error.message).toContain("Obtained value invalid;");
    expect(error.message).toContain("Expected pattern of value: /[0-9]/g");
  });
  test("should log the error message to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    stringError("test", "expected pattern");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("STRING ERROR:");
    consoleSpy.mockRestore();
  });
});
describe("parseFinite", () => {
  test("should parse valid float string", () =>
    expect(parseFinite("123.45", "float")).toBe(123.45));
  test("should parse valid integer string", () =>
    expect(parseFinite("123", "int")).toBe(123));
  test("should return default value for invalid float string", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    expect(parseFinite("abc", "float", 0)).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error processing parseFloat. Value defaulted"
    );
    consoleSpy.mockRestore();
  });
  test("should return default value for invalid integer string", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    expect(parseFinite("abc", "int", 0)).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error processing parseInt. Value defaulted"
    );
    consoleSpy.mockRestore();
  });
  test("should handle browsers without Number.isFinite", () => {
    const originalIsFinite = Number.isFinite;
    // @ts-ignore
    Number.isFinite = undefined;
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    expect(parseFinite("123.45", "float")).toBe(123.45);
    expect(consoleSpy).toHaveBeenCalledWith(
      "The current browser does not support ES6. Please update your current active browser. That might result in misleading numbers."
    );
    Number.isFinite = originalIsFinite;
    consoleSpy.mockRestore();
  });
  test("should return -1 and log error when an exception occurs", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    const result = parseFinite(123, "float");
    expect(result).toBe(-1);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
