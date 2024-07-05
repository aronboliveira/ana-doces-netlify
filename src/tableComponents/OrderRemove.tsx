import { OrderProps } from "src/declarations/interfaces";
import {
  baseFestValues,
  baseMappedValues,
  baseValues,
  factorMaps,
  roundToTenth,
} from "src/handlersCmn";
import { elementNotFound, parseFinite } from "src/handlersErrors";
import { createRoot } from "react-dom/client";
import { tbodyProps } from "./TableOrders";
import OrderRow from "./OrderRow";

export default function OrderRemove(props: OrderProps): JSX.Element {
  return (
    <td className="celRemove" style={{ paddingRight: "3.2rem" }}>
      <button
        type="button"
        className="biBtn opBtn opBtnRemove tabRemove"
        id={`btnTabSubt__${document.querySelectorAll(".tabRemove").length}-${
          props.id
        }`}
        aria-hidden="false"
        onClick={ev => {
          try {
            const total = document.getElementById("total");
            if (!(total instanceof HTMLElement))
              throw elementNotFound(
                total,
                `validation of Total Price Element`,
                ["HTMLElement"]
              );
            const iniPrice = total.innerText;
            const relTbody = ev.currentTarget.closest("tbody");
            if (!(relTbody instanceof HTMLTableSectionElement))
              throw elementNotFound(
                relTbody,
                `Validation of Related Table Body`,
                ["HTMLTableSectionElement"]
              );
            const relTr = ev.currentTarget.closest("tr");
            if (!(relTr instanceof HTMLTableRowElement))
              throw elementNotFound(relTr, `Validation of Related Table Row`, [
                "HTMLTableRowElement",
              ]);
            const relQuant = relTr.querySelector(".outp_orderQuant");
            if (!(relQuant instanceof HTMLElement))
              throw elementNotFound(
                relQuant,
                `Validation of related Quantity Output Element`,
                ["HTMLElement"]
              );
            const relOutp = relTr.querySelector(".outp_orderTitle");
            if (!(relOutp instanceof HTMLElement))
              throw elementNotFound(
                relOutp,
                `Validation of Related Title Output Element`,
                ["HTMLElement"]
              );
            if (relOutp.innerText === "") {
              console.warn(
                `No product name in output. Aborting procedure for callback in ${
                  ev.currentTarget.id || ev.currentTarget.name
                }`
              );
              return;
            }
            const normText = relOutp.innerText.trim().toLowerCase();
            let subopt = "",
              product = "",
              productMainPart = "",
              opt = "",
              productValue: number | undefined = 0,
              diffPrice = 0,
              factor: number | undefined = 1;
            if (/\(/g.test(normText) && /\)/g.test(normText)) {
              subopt = normText.slice(
                normText.indexOf("(") + 1,
                normText.indexOf(")")
              );
              if (subopt === "média") subopt = "médio";
              if (subopt === "pequena") subopt = "pequeno";
              product = normText.slice(0, normText.indexOf("(")).trim();
            } else product = normText;
            if (/bolo caseiro/gi.test(product))
              productMainPart = "bolo caseiro";
            else if (/bolo de festa/gi.test(product))
              productMainPart = "bolo de festa";
            else if (/bolo de pote/gi.test(product))
              productMainPart = "bolo de pote";
            else if (/brownie recheado/gi.test(product)) {
              if (/mini/gi.test(product))
                productMainPart = "mini brownie recheado";
              else productMainPart = "brownie recheado";
            } else if (/brownie simples/gi.test(product))
              productMainPart = "brownie simples";
            else if (/cookie recheado/gi.test(product))
              productMainPart = "cookie recheado";
            else if (/copo da felicidade/gi.test(product))
              productMainPart = "copo da felicidade";
            else if (/mini cookie/gi.test(product))
              productMainPart = "mini cookie";
            else if (/geleia artesanal/gi.test(product))
              productMainPart = "geleia artesanal";
            else if (/palha/gi.test(product))
              productMainPart = "palha italiana";
            else if (/pav[eê] de pote/gi.test(product))
              productMainPart = "pave de pote";
            else if (/torta gelada/gi.test(product)) productMainPart = "torta";
            else if (/taça recheada/gi.test(product))
              productMainPart = "taça recheada";
            else if (/travessa recheada/gi.test(product))
              productMainPart = "travessa recheada";
            opt = product
              .replace(productMainPart.replace("pave", "pavê"), "")
              .trim();
            console.log("MAIN PART");
            console.log(productMainPart);
            console.log("OPTION");
            console.log(opt);
            console.log("SUBOPTION");
            console.log(subopt);
            if (productMainPart === "bolo de festa") {
              productValue = baseFestValues.get(opt);
              if (!productValue && /ê/gi.test(opt))
                productValue = baseFestValues.get(opt.replaceAll("ê", "e"));
              if (!productValue)
                throw new Error(`Failed to fetch product value in map`);
              if (/ fit|fit /gi.test(opt)) productValue *= 1.1;
              factor = factorMaps.get(subopt);
              if (!factor)
                throw new Error(
                  `Failed to get factor for product with options`
                );
              diffPrice =
                parseFinite(
                  `${total.innerText
                    .replace("R$", "")
                    .replaceAll(" ", "")
                    .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(
                    ",",
                    ""
                  )
                ) -
                productValue * factor;
              console.log(diffPrice);
              if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
                console.warn(
                  `Failed to calculate Price after difference. Defaulting value.`
                );
                diffPrice = 0;
              }
              total.innerText = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 2,
              }).format(parseFinite(roundToTenth(diffPrice)));
            } else {
              productValue = baseValues.get(productMainPart);
              if (!productValue && /ê/gi.test(productMainPart))
                productValue = baseValues.get(
                  productMainPart.replaceAll("ê", "e")
                );
              if (!productValue)
                throw new Error(`Failed to fetch product value in map`);
              if (productValue > 0) {
                if (subopt) {
                  factor = factorMaps.get(subopt);
                  if (!factor)
                    throw new Error(
                      `Failed to get factor for product with options`
                    );
                }
                if (/ fit|fit /gi.test(opt)) productValue *= 1.1;
                diffPrice =
                  parseFinite(
                    `${total.innerText
                      .replace("R$", "")
                      .replaceAll(" ", "")
                      .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(
                      ",",
                      ""
                    )
                  ) -
                  productValue * factor;
                console.log(diffPrice);
                if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
                  console.warn(
                    `Failed to calculate Price after difference. Defaulting value.`
                  );
                  diffPrice = 0;
                }
                total.innerText = Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 2,
                }).format(parseFinite(roundToTenth(diffPrice)));
              } else if (productValue <= 0) {
                if (subopt) {
                  factor = factorMaps.get(subopt);
                  if (!factor)
                    throw new Error(
                      `Failed to get factor for product with options`
                    );
                }
                let mappedProductValue = baseMappedValues.get(productMainPart);
                if (!mappedProductValue && /ê/gi.test(productMainPart))
                  mappedProductValue = baseMappedValues.get(
                    productMainPart.replaceAll("ê", "e")
                  );
                if (!mappedProductValue)
                  throw new Error(`Failed to fetch Mapped Product value`);
                if (opt === "")
                  throw new Error(
                    `Failed to assign option string for ${productMainPart}. Mapped products need to have an option value for mapping.`
                  );
                let optValue = mappedProductValue.get(opt);
                if (!optValue) throw new Error(`Failed to fetch Option value.`);
                if (/ fit|fit /gi.test(opt)) optValue *= 1.1;
                diffPrice =
                  parseFinite(
                    `${total.innerText
                      .replace("R$", "")
                      .replaceAll(" ", "")
                      .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(
                      ",",
                      ""
                    )
                  ) -
                  optValue * factor;
                if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
                  console.warn(
                    `Failed to calculate Price after difference. Defaulting value.`
                  );
                  diffPrice = 0;
                }
                total.innerText = Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 2,
                }).format(parseFinite(roundToTenth(diffPrice)));
              }
            }
            console.log(
              "Comparing: " +
                `${total.innerText
                  .replace("R$", "")
                  .trim()
                  .slice(0, -3)}.${total.innerText.slice(-2).trim()}` +
                " with " +
                `${iniPrice.replace("R$", "").trim().slice(0, -3)}.${iniPrice
                  .slice(-2)
                  .trim()}`
            );
            if (
              /NaN/gi.test(total.innerText) ||
              /infinity/gi.test(total.innerText) ||
              /-/g.test(total.innerText) ||
              parseFinite(
                `${total.innerText
                  .replace("R$", "")
                  .trim()
                  .slice(0, -3)}.${total.innerText.slice(-2).trim()}`
              ) >=
                parseFinite(
                  `${iniPrice.replace("R$", "").trim().slice(0, -3)}.${iniPrice
                    .slice(-2)
                    .trim()}`
                )
            ) {
              console.warn(
                `Invalid value given to Total Price Element inner text. Returning to previous value and aborting process.`
              );
              total.innerText = iniPrice;
              return;
            }
            const quant = parseFinite(
              relQuant.innerText.replaceAll(/[^0-9]/g, ""),
              "int"
            );
            if (!Number.isFinite(quant)) {
              total.innerText = iniPrice;
              throw new Error(
                `Quantity number not finite. Reverting and aborting process.`
              );
            }
            if (quant <= 1) {
              relQuant.innerText = `0`;
              if (relTr === relTbody.rows[0] && relTbody.rows.length === 1) {
                if (!tbodyProps.root) tbodyProps.root = createRoot(relTbody);
                tbodyProps.root.render(<OrderRow id="order_ph" />);
              } else {
                createRoot(relTr).unmount();
                relTr.id !== "" &&
                  document.getElementById(relTr.id) &&
                  relTr.remove();
              }
            } else relQuant.innerText = `${quant - 1}`;
            for (const row of relTbody.rows) {
              try {
                const celQuant = row.querySelector(".celQuant");
                const celName = row.querySelector(".celName");
                if (!(celQuant instanceof HTMLElement))
                  throw elementNotFound(
                    celQuant,
                    `validation of Relative Cell for Quantity`,
                    ["HTMLElement"]
                  );
                if (!(celName instanceof HTMLElement))
                  throw elementNotFound(
                    celName,
                    `Validation of Relative Cell for Name`,
                    ["HTMLElement"]
                  );
                if (celQuant.innerText === "0") celName.innerText = "";
              } catch (e) {
                console.error(
                  `Error executing 0 check for ${
                    row.id || row.classList.toString() || row.tagName
                  }:${(e as Error).message}`
                );
              }
            }
          } catch (e) {
            console.error(
              `Error executing callback for ${
                ev.currentTarget.id || ev.currentTarget.tagName
              }:${(e as Error).message}`
            );
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-dash-square-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"></path>
        </svg>
      </button>
    </td>
  );
}
