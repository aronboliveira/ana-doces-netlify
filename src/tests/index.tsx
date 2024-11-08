import { createRoot } from "react-dom/client";
import { act } from "react";
import { htmlElementNotFound } from "src/handlersErrors";
import AppProvider from "src/routing/AppProvider";
import Header from "src/interactives/Header";
import ProductsProvider from "src/productsMain/ProductsProvider";
import { Product } from "src/declarations/classes";
describe("Main Module", () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null!;
  });
  test("should render AppProvider into main element", () => {
    document.body.innerHTML = "<main></main>";
    const mainEl = document.querySelector("main")!;
    act(() => createRoot(mainEl).render(<AppProvider />));
    expect(mainEl.innerHTML).not.toBe("");
  });
  test("should handle missing main element gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    document.body.innerHTML = "";
    // @ts-ignore
    const mainEl = document.querySelector("main");
    try {
      if (!(mainEl instanceof HTMLElement)) {
        throw htmlElementNotFound(mainEl, "validation of <main>", [
          "HTMLElement",
        ]);
      }
    } catch (e) {
      expect((e as Error).message).toContain("HTMLELEMENT ERROR:");
    }
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
  test("should render Header into header element", () => {
    document.body.innerHTML = "<header></header>";
    const headerEl = document.querySelector("header")!;
    act(() => createRoot(headerEl).render(<Header />));
    expect(headerEl.innerHTML).not.toBe("");
  });
  test("should render ProductsProvider with products", () => {
    const products = [
      new Product(
        "Brownie Simples",
        "8,00",
        "../public/img/simples_brownie_generic.jpeg",
        "Massa cremosa e macia...",
        [],
        "01"
      ),
    ];
    const productRoot = document.createElement("div");
    container.appendChild(productRoot);
    const root = createRoot(productRoot);
    act(() =>
      root.render(<ProductsProvider root={root} products={products} />)
    );
    expect(productRoot.innerHTML).not.toBe("");
  });
});
