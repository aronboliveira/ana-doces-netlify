import { Product, ProductOption } from "../../../declarations/classes";

describe("Product Class", () => {
  test("should create a Product instance with default values", () => {
    const product = new Product("Test Product");
    expect(product._name).toBe("Test Product");
    expect(product.price).toBe("Preço Indefinido");
    expect(product.imgSrc).toBe("../public/img/x-octagon.svg");
    expect(product.detail).toBe("Detalhes Indefinidos");
    expect(product.options).toEqual([]);
    expect(product._id).toBe("noGivenId");
  });

  test("should capitalize the first letter of _name and detail", () => {
    const product = new Product(
      "test product",
      undefined,
      undefined,
      "product details"
    );
    expect(product._name).toBe("Test product");
    expect(product.detail).toBe("Product details");
  });

  test("should handle numeric price and id", () => {
    const product = new Product(
      "Test Product",
      100,
      undefined,
      undefined,
      [],
      1
    );
    expect(product.price).toBe("100");
    expect(product._id).toBe("1");
  });

  test("should handle non-finite numeric price and id", () => {
    const product = new Product(
      "Test Product",
      Infinity,
      undefined,
      undefined,
      [],
      NaN
    );
    expect(product.price).toBe("0");
    expect(product._id).toBe("0");
  });

  test("should sort options by opName", () => {
    const options = [
      new ProductOption("Option B", "10", "Desc B"),
      new ProductOption("Option A", "20", "Desc A"),
    ];
    const product = new Product(
      "Test Product",
      undefined,
      undefined,
      undefined,
      options,
      "1"
    );
    expect(product.options[0].opName).toBe("Option A");
    expect(product.options[1].opName).toBe("Option B");
  });

  test("should assign composite ids to options", () => {
    const options = [
      new ProductOption("Option A", "10", "Desc A"),
      new ProductOption("Option B", "20", "Desc B"),
    ];
    const product = new Product(
      "Test Product",
      undefined,
      undefined,
      undefined,
      options,
      "1"
    );
    expect(product.options[0].__id).toBe("__1-001");
    expect(product.options[1].__id).toBe("__1-002");
  });

  test("fabricOption should create and sort ProductOption instances", () => {
    const optionsArray = [
      ["Option C", "30", "Desc C"],
      ["Option B", "20", "Desc B"],
      ["Option A", "10", "Desc A"],
    ];
    const options = Product.fabricOption(optionsArray);
    expect(options[0].opName).toBe("Option A");
    expect(options[1].opName).toBe("Option B");
    expect(options[2].opName).toBe("Option C");
    expect(options[0].pid).toBe("001");
    expect(options[1].pid).toBe("002");
    expect(options[2].pid).toBe("003");
  });
});

describe("ProductOption Class", () => {
  test("should create a ProductOption instance with default values", () => {
    const option = new ProductOption();
    expect(option.opName).toBe("Opção não fornecida");
    expect(option.price).toBe("Preço não fornecido");
    expect(option.desc).toBe("Descrição não fornecida");
    expect(option.id).toBe("invalidId");
    expect(option.pid).toBe("noGivenId");
  });

  test("should capitalize opName and desc", () => {
    const option = new ProductOption("option name", "50", "option description");
    expect(option.opName).toBe("Option name");
    expect(option.desc).toBe("Option description");
  });

  test("should format price correctly", () => {
    const option = new ProductOption("Option", "100", "Desc");
    expect(option.price).toBe("R$ 100,00");
  });

  test("should handle invalid price", () => {
    const option = new ProductOption("Option", "invalid", "Desc");
    expect(option.price).toBe("invalid");
  });

  test("should handle NaN and Infinity in price formatting", () => {
    const optionNaN = new ProductOption("Option", "NaN", "Desc");
    expect(optionNaN.price).toBe("NaN");

    const optionInfinity = new ProductOption("Option", "Infinity", "Desc");
    expect(optionInfinity.price).toBe("Infinity");
  });

  test("should assign ids correctly", () => {
    const option = new ProductOption("Option", "100", "Desc", "1", "001");
    expect(option.id).toBe("1");
    expect(option.pid).toBe("001");
  });
});
