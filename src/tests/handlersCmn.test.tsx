import {
  formatPrice,
  isClickOutside,
  handleOrderAdd,
  handleOrderSubtract,
  concatProducts,
  switchAlertOp,
  handleDoubleClick,
  handleSearchFilter,
  roundToTenth,
  capitalizeFirstLetter,
  textTransformPascal,
  normalizeSpacing,
  recalculateByOption,
  applyVelvetCase,
  fetchRelationBdfCases,
  applyRelationBdfCases,
  applyFactorProductCase,
  applySubOptParam,
  attemptRender,
  testSource,
  clearURLAfterModal,
  adjustIdentifiers,
  adjustHeadings,
  fixModalOpening,
} from "src/handlersCmn";
import { createRoot } from "react-dom/client";
import { act } from "react";
describe("formatPrice", () => {
  test("should format price correctly from element innerText", () => {
    const priceEl = document.createElement("span");
    priceEl.innerText = "R$ 1.234,56";
    expect(formatPrice(priceEl)).toBe("1.234.56");
  });
  test("should return default price when element is null", () => {
    expect(formatPrice(null)).toBe("R$ 0,00");
  });
  test("should handle missing innerText", () => {
    expect(formatPrice(document.createElement("span"))).toBe("R$ 0,00");
  });
});
describe("isClickOutside", () => {
  test("should return true when click is outside the element", () => {
    const dlgInBtn = document.createElement("button");
    dlgInBtn.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      right: 200,
      bottom: 200,
      left: 100,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }));
    expect(
      isClickOutside(
        new MouseEvent("click", {
          clientX: 50,
          clientY: 50,
        }),
        dlgInBtn
      )
    ).toEqual([true, false, true, false]);
  });
  test("should return false when click is inside the element", () => {
    const dlgInBtn = document.createElement("button");
    dlgInBtn.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      right: 200,
      bottom: 200,
      left: 100,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }));
    expect(
      isClickOutside(
        new MouseEvent("click", {
          clientX: 150,
          clientY: 150,
        }),
        dlgInBtn
      )
    ).toEqual([false, false, false, false]);
  });
});
describe("handleOrderAdd", () => {
  let addBtn: HTMLButtonElement;
  let totalEl: HTMLOutputElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <li id="product1" data-title="Product 1">
        <button id="addBtn1" name="btn_product1">Add</button>
        <span class="opSpanPrice">R$ 10,00</span>
      </li>
      <output id="total">R$ 0,00</output>
    `;
    addBtn = document.getElementById("addBtn1") as HTMLButtonElement;
    totalEl = document.getElementById("total") as HTMLOutputElement;
  });
  test("should add product price to total", () => {
    handleOrderAdd(addBtn, totalEl);
    expect(totalEl.innerText).toContain("R$ 10,00");
  });
  test("should handle missing add button gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    handleOrderAdd(null, totalEl);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("handleOrderSubtract", () => {
  let subtBtn: HTMLButtonElement;
  let totalEl: HTMLOutputElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <li id="product1" data-title="Product 1">
        <button id="subtBtn1" name="btn_product1">Subtract</button>
        <span class="opSpanPrice">R$ 10,00</span>
      </li>
      <output id="total">R$ 20,00</output>
    `;
    subtBtn = document.getElementById("subtBtn1") as HTMLButtonElement;
    totalEl = document.getElementById("total") as HTMLOutputElement;
  });
  test("should subtract product price from total", () => {
    handleOrderSubtract(subtBtn, totalEl);
    expect(totalEl.innerText).toContain("R$ 10,00");
  });
  test("should handle negative totals correctly", () => {
    totalEl.innerText = "R$ 5,00";
    handleOrderSubtract(subtBtn, totalEl);
    expect(totalEl.innerText).toBe("R$ 0,00");
  });
  test("should handle missing subtract button gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    handleOrderSubtract(null, totalEl);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("concatProducts", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <tbody id="tbodyOrders">
        <tr>
          <td class="outp_orderTitle">Product 1</td>
          <td class="outp_orderQuant">2</td>
        </tr>
        <tr>
          <td class="outp_orderTitle">Product 2</td>
          <td class="outp_orderQuant">1</td>
        </tr>
      </tbody>
    `;
  });
  test("should concatenate products into a message", () => {
    const initialMessage = "Order Details:";
    const result = concatProducts(initialMessage);
    expect(result).toContain("Product 1 (2)");
    expect(result).toContain("Product 2 (1)");
  });
  test("should handle empty order list", () => {
    if (!document.getElementById("tbodyOrders")) return;
    document.getElementById("tbodyOrders")!.innerHTML = "";
    expect(concatProducts("Order Details:")).toBe("Order Details:");
  });
});
describe("switchAlertOp", () => {
  let alertEl: HTMLElement;
  beforeEach(() => {
    alertEl = document.createElement("div");
    alertEl.style.opacity = "0";
    document.body.appendChild(alertEl);
  });
  afterEach(() => {
    document.body.removeChild(alertEl);
  });
  test("should increase opacity of alert element", () => {
    jest.useFakeTimers();
    switchAlertOp(alertEl);
    jest.advanceTimersByTime(100);
    expect(parseFloat(alertEl.style.opacity)).toBeGreaterThan(0);
    jest.useRealTimers();
  });
  test("should handle null alert element gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    switchAlertOp(null);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("handleDoubleClick", () => {
  let checkbox: HTMLInputElement, radio: HTMLInputElement;
  beforeEach(() => {
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    radio = document.createElement("input");
    radio.type = "radio";
    radio.checked = true;
  });
  test("should uncheck input on doubleclick", () => {
    handleDoubleClick([checkbox, radio]);
    const event = new Event("doubleclick");
    checkbox.dispatchEvent(event);
    radio.dispatchEvent(event);
    expect(checkbox.checked).toBe(false);
    expect(radio.checked).toBe(false);
  });
  test("should handle invalid inputs gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    handleDoubleClick([null, undefined]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("handleSearchFilter", () => {
  let input: HTMLInputElement, scope: HTMLElement;
  beforeEach(() => {
    input = document.createElement("input");
    scope = document.createElement("div");
    scope.innerHTML = `
      <li class="item" data-title="Apple Pie">Apple Pie</li>
      <li class="item" data-title="Banana Bread">Banana Bread</li>
      <li class="item" data-title="Cherry Tart">Cherry Tart</li>
    `;
    document.body.appendChild(scope);
  });
  afterEach(() => document.body.removeChild(scope));
  test("should show items matching filter", () => {
    input.value = "Banana";
    handleSearchFilter(input, scope, input.value, ".item");
    const items = scope.querySelectorAll(".item");
    expect(items[0].hasAttribute("hidden")).toBe(true);
    expect(items[1].hasAttribute("hidden")).toBe(false);
    expect(items[2].hasAttribute("hidden")).toBe(true);
  });
  test("should show all items when filter is empty", () => {
    input.value = "";
    handleSearchFilter(input, scope, input.value, ".item");
    const items = scope.querySelectorAll(".item");
    items.forEach(item => expect(item.hasAttribute("hidden")).toBe(false));
  });
  test("should handle invalid input gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    handleSearchFilter(null, scope, "test", ".item");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("roundToTenth", () => {
  test("should round down to two decimal places by default", () => {
    expect(roundToTenth(3.456)).toBe("3.45");
    expect(roundToTenth(2.999)).toBe("2.99");
  });
  test("should round up when up parameter is true", () => {
    expect(roundToTenth(3.456, 1, 2, true)).toBe("3.46");
    expect(roundToTenth(2.991, 1, 2, true)).toBe("2.99");
  });
  test("should use multiplier correctly", () => {
    expect(roundToTenth(3.456, 2, 2)).toBe("3.45");
    expect(roundToTenth(3.456, 0, 2)).toBe("3.00");
  });
  test("should handle fixed decimal places", () => {
    expect(roundToTenth(3.456, 1, 1)).toBe("3.4");
    expect(roundToTenth(3.456, 1, 3)).toBe("3.456");
  });
  test("should return original number formatted if an error occurs", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    expect(roundToTenth("invalid")).toBe("NaN");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("capitalizeFirstLetter", () => {
  test("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("world")).toBe("World");
  });
  test("should handle empty strings", () =>
    expect(capitalizeFirstLetter("")).toBe(""));
  test("should handle single character strings", () =>
    expect(capitalizeFirstLetter("a")).toBe("A"));
  test("should handle non-string inputs gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    expect(capitalizeFirstLetter(null)).toBe("null");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("textTransformPascal", () => {
  test("should transform text to PascalCase", () => {
    expect(textTransformPascal("hello")).toBe("Hello");
    expect(textTransformPascal("HELLO")).toBe("Hello");
    expect(textTransformPascal("hELLo")).toBe("Hello");
  });
  test("should handle empty strings", () =>
    expect(textTransformPascal("")).toBe(""));
  test("should handle non-string inputs gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    expect(textTransformPascal(undefined)).toBe("undefined");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("normalizeSpacing", () => {
  test("should replace spaces and commas with underscores", () => {
    expect(normalizeSpacing("hello world")).toBe("hello_world");
    expect(normalizeSpacing("a, b, c")).toBe("a__b__c");
  });
  test("should handle strings without spaces or commas", () =>
    expect(normalizeSpacing("hello")).toBe("hello"));
  test("should handle empty strings", () =>
    expect(normalizeSpacing("")).toBe(""));
  test("should handle non-string inputs gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    expect(normalizeSpacing(123)).toBe(123);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("recalculateByOption", () => {
  let scope: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <dialog id="bolo-caseiro">
        <div class="opSpanPrice">R$ 45,00</div>
      </dialog>
    `;
    scope = document.getElementById("bolo-caseiro") as HTMLElement;
  });
  test('should adjust price for "grande" size', () => {
    recalculateByOption(".opSpanPrice", scope, "grande");
    expect(
      (scope.querySelector(".opSpanPrice") as HTMLElement).textContent
    ).toContain("R$ 33,75");
  });
  test("should adjust price for unknown factor with default appliedFactor", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    recalculateByOption(".opSpanPrice", scope, "unknown-factor");
    expect(
      (scope.querySelector(".opSpanPrice") as HTMLElement).textContent
    ).toContain("R$ 45,00");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
  test("should handle invalid scope gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    recalculateByOption(".opSpanPrice", null, "grande");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("applyVelvetCase", () => {
  test("should increase price by 33.33% for red velvet cake", () => {
    const priceEl = document.createElement("div");
    priceEl.innerText = "R$ 45,00";
    const relParent = document.createElement("dialog");
    relParent.id = "bolo-caseiro";
    relParent.appendChild(priceEl);
    document.body.appendChild(relParent);
    applyVelvetCase("red velvet", priceEl);
    expect(priceEl.innerText).toContain("R$ 60,00");
    document.body.removeChild(relParent);
  });
  test("should decrease price by 25% for red velvet cake in specific context", () => {
    const priceEl = document.createElement("div");
    priceEl.innerText = "R$ 60,00";
    const relParent = document.createElement("dialog");
    relParent.id = "bolo-caseiro";
    relParent.appendChild(priceEl);
    document.body.appendChild(relParent);
    applyVelvetCase("red velvet", priceEl, relParent);
    expect(priceEl.innerText).toContain("R$ 45,00");
    document.body.removeChild(relParent);
  });
  test("should handle non-red velvet cases without changing price", () => {
    const priceEl = document.createElement("div");
    priceEl.innerText = "R$ 45,00";
    const relParent = document.createElement("dialog");
    relParent.id = "bolo-chocolate";
    relParent.appendChild(priceEl);
    document.body.appendChild(relParent);
    applyVelvetCase("chocolate", priceEl);
    expect(priceEl.innerText).toBe("R$ 45,00");
    document.body.removeChild(relParent);
  });
});
describe("fetchRelationBdfCases", () => {
  let scope: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="scope">
        <li class="opLi" data-title="Bolo de Festa Chocolate">
          <span class="opSpanPrice">R$ 80,00</span>
          <span class="opSpanName">Chocolate</span>
        </li>
        <li class="opLi" data-title="Bolo de Festa Morango">
          <span class="opSpanPrice">R$ 90,00</span>
          <span class="opSpanName">Morango</span>
        </li>
      </div>
    `;
    scope = document.getElementById("scope") as HTMLElement;
  });
  test("should fetch relation price data", () => {
    expect(fetchRelationBdfCases(scope)).toEqual([
      ["undefined", "chocolate", "R$ 80,00"],
      ["undefined", "morango", "R$ 90,00"],
    ]);
  });
  test("should handle empty scope gracefully", () => {
    scope.innerHTML = "";
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    expect(fetchRelationBdfCases(scope)).toEqual([[]]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("applyRelationBdfCases", () => {
  test("should apply relation and update price", () => {
    const scope = document.createElement("div");
    const priceEl = document.createElement("div");
    priceEl.id = "priceId";
    priceEl.innerText = "R$ 80,00";
    scope.appendChild(priceEl);
    applyRelationBdfCases(
      ["priceId", "chocolate", "R$ 80,00"],
      "grande",
      scope
    );
    expect(priceEl.innerText).not.toBe("R$ 80,00");
  });
  test("should handle missing price element gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    applyRelationBdfCases(
      ["nonExistentId", "chocolate", "R$ 80,00"],
      "grande",
      document.createElement("div")
    );
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("applyFactorProductCase", () => {
  test("should apply factors and update price elements", () => {
    const scope = document.createElement("div");
    const priceEl = document.createElement("div");
    priceEl.classList.add("price");
    priceEl.innerText = "R$ 50,00";
    scope.appendChild(priceEl);
    applyFactorProductCase(1.5, 50, 1, ".price", scope);
    expect(priceEl.innerText).toContain("R$ 75,00");
  });
  test("should handle invalid price elements gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    applyFactorProductCase(1.5, 50, 1, ".price", document.createElement("div"));
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("applySubOptParam", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "http://example.com/?Op-chocolate" },
    });
  });
  test("should check radio input based on URL parameter", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.value = "chocolate";
    const relSubGroup = document.createElement("div");
    relSubGroup.classList.add("opSubGroup");
    relSubGroup.appendChild(radio);
    document.body.appendChild(relSubGroup);
    applySubOptParam(relSubGroup);
    expect(radio.checked).toBe(true);
    document.body.removeChild(relSubGroup);
  });
  test("should handle no matching option gracefully", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.value = "vanilla";
    const relSubGroup = document.createElement("div");
    relSubGroup.classList.add("opSubGroup");
    relSubGroup.appendChild(radio);
    document.body.appendChild(relSubGroup);
    applySubOptParam(relSubGroup);
    expect(radio.checked).toBe(false);
    document.body.removeChild(relSubGroup);
  });
});
describe("attemptRender", () => {
  let container: HTMLElement, root: ReturnType<typeof createRoot>;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(container);
  });
  test("should render when parent is ready", () => {
    container.innerHTML = '<div class="spinner"></div>';
    expect(attemptRender(root, container, <div>Content</div>)).toBe(true);
    expect(container.textContent).toBe("Content");
  });
  test("should not render when parent already has content", () => {
    container.innerHTML = "<div>Existing Content</div>";
    expect(attemptRender(root, container, <div>New Content</div>)).toBe(false);
    expect(container.textContent).toBe("Existing Content");
  });
});
global.fetch = jest.fn();
describe("testSource", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  test("should return true for valid source", async () => {
    // @ts-ignore
    fetch.mockResolvedValue({ ok: true });
    expect(await testSource("http://valid.com")).toBe(true);
    expect(fetch).toHaveBeenCalledWith("http://valid.com");
  });
  test("should return false for invalid source", async () => {
    // @ts-ignore
    fetch.mockResolvedValue({ ok: false, status: 404 });
    expect(await testSource("http://invalid.com")).toBe(false);
  });
  test("should handle fetch errors gracefully", async () => {
    // @ts-ignore
    fetch.mockRejectedValue(new Error("Network error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    expect(await testSource("http://error.com")).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("clearURLAfterModal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "http://example.com/?&modalId" },
    });
    jest.spyOn(history, "pushState").mockImplementation();
  });
  afterEach(() => {
    jest.useRealTimers();
    (history.pushState as jest.Mock).mockRestore();
  });
  test("should modify URL after timeout", () => {
    clearURLAfterModal("modalId");
    jest.advanceTimersByTime(500);
    expect(history.pushState).toHaveBeenCalled();
  });
  test("should handle invalid idf gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    // @ts-ignore
    clearURLAfterModal(null);
    expect(consoleSpy).toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(history.pushState).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("adjustIdentifiers", () => {
  test("should normalize IDs and class names", () => {
    document.body.innerHTML = `
      <div id="123 invalid id" class="class 1"></div>
      <input name="invalid name" class="invalid class"></input>
    `;
    adjustIdentifiers();
    const div = document.querySelector("div")!;
    expect(div.id).toBe("_123_invalid_id");
    expect(div.classList.contains("class_1")).toBe(true);
    const input = document.querySelector("input")!;
    expect(input.name).toBe("invalid_name");
    expect(input.classList.contains("invalid_class")).toBe(true);
  });
  test("should handle elements with special characters", () => {
    document.body.innerHTML = `
      <div id="áéíóú" class="çñ"></div>
    `;
    adjustIdentifiers();
    const div = document.querySelector("div")!;
    expect(div.id).toBe("áéíóú");
    expect(div.classList.contains("çñ")).toBe(true);
  });
  test("should handle invalid scope gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    adjustIdentifiers(null);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("adjustHeadings", () => {
  test("should adjust heading levels based on parent headings", () => {
    document.body.innerHTML = `
      <div>
        <h2>Parent Heading</h2>
        <div>
          <h3>Child Heading</h3>
          <div>
            <h4 id="targetHeading">Target Heading</h4>
          </div>
        </div>
      </div>
    `;
    adjustHeadings(
      document.getElementById("targetHeading") as HTMLHeadingElement
    );
    if (!document.getElementById("targetHeading")) return;
    expect(document.getElementById("targetHeading")!.tagName).toBe("H5");
  });
  test("should handle cases with no parent headings", () => {
    document.body.innerHTML = `
      <div>
        <div>
          <h1 id="targetHeading">Target Heading</h1>
        </div>
      </div>
    `;
    adjustHeadings(
      document.getElementById("targetHeading") as HTMLHeadingElement
    );
    if (!document.getElementById("targetHeading")) return;
    expect(document.getElementById("targetHeading")!.tagName).toBe("H1");
  });
  test("should handle invalid refEl gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    adjustHeadings(null);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
describe("fixModalOpening", () => {
  test("should open and close the dialog with animations", () => {
    document.body.innerHTML = `
      <dialog id="testDialog"></dialog>
    `;
    const dialog = document.getElementById("testDialog") as HTMLDialogElement;
    dialog.show = jest.fn();
    dialog.close = jest.fn();
    dialog.showModal = jest.fn();
    fixModalOpening("testDialog");
    expect(dialog.show).toHaveBeenCalled();
    expect(dialog.close).toHaveBeenCalled();
    expect(dialog.showModal).toHaveBeenCalled();
    expect(dialog.style.animation).toContain("dropIn");
  });
  test("should handle invalid idf gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    // @ts-ignore
    fixModalOpening(null);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
