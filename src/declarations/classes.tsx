import { capitalizeFirstLetter } from "../handlersCmn";
import { ProductOptionsProps } from "./interfaces";
import { looseNum } from "./types";

export class Product {
  readonly #id: looseNum;
  constructor(
    public _name: string,
    public price: looseNum = "Preço Indefinido",
    public imgSrc: string = "../public/img/x-octagon.svg",
    public detail: string = "Detalhes Indefinidos",
    public options: ProductOption[] = [],
    public id: looseNum = "noGivenId"
  ) {
    [price, id].forEach((prop) => {
      if (typeof prop === "number") {
        if (!Number.isFinite(prop)) prop = 0;
        prop = prop.toString();
      }
    });
    this._name = capitalizeFirstLetter(_name) || "Nome Invalidado";
    this.price = price || "Preço Invalidado";
    this.imgSrc = imgSrc || "/img/x-octagon.svg";
    this.detail = capitalizeFirstLetter(detail) || "Detalhes Invalidados";
    this.#id = id || "invalidId";
    this.options = options
      .map((option, i) => {
        option.__id = `__${this.#id}-${(i + 1).toString().padStart(3, "0")}`;
        return option;
      })
      .sort((a, b) => a.opName.localeCompare(b.opName));
  }
  get _id(): looseNum {
    return this.#id;
  }
  static fabricOption(options: Array<string[]>): ProductOption[] {
    return options
      .map((opcao, i) => {
        // console.log("Fabric " + opcao[0]);
        // console.log(opcao[1]);
        return new ProductOption(
          opcao[0],
          opcao[1],
          opcao[2],
          opcao[3],
          `${(i + 1).toString().padStart(3, "0")}`
        );
      })
      .sort((a, b) => a.opName.localeCompare(b.opName));
  }
}

export class ProductOption
  implements Readonly<Omit<ProductOptionsProps, "root">>
{
  readonly #id: looseNum;
  readonly #_id: looseNum;
  constructor(
    public opName: string = "Opção não fornecida",
    public price: string = "Preço não fornecido",
    public desc: string = "Descrição não fornecida",
    public _id: looseNum = "noGivenId",
    public __id: looseNum = "noGivenCompositeId"
  ) {
    this.opName = capitalizeFirstLetter(opName) || "Nome invalidado";
    this.price =
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }).format(parseFloat(price.replace(",", "."))) || "Preço invalidado";
    if (/NaN/g.test(this.price) || /Infinity/gi.test(this.price))
      this.price = price || "Preço invalidado";
    this.desc =
      capitalizeFirstLetter(desc) ||
      capitalizeFirstLetter(this.opName) ||
      "Descrição invalidada";
    if (typeof _id === "number") _id = _id.toString();
    this.#id = _id || "invalidId";
    this.#_id = __id || "noGivenId";
    // console.log(`Id for ${opName}: ${_id}`);
  }
  get id() {
    return this.#id;
  }
  get pid() {
    return this.#_id;
  }
}
