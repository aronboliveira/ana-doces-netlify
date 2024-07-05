import { OrderProps } from "src/declarations/interfaces";
import { baseValues, roundToTenth } from "src/handlersCmn";
import { elementNotFound, parseFinite } from "src/handlersErrors";

export default function OrderRemove(props: OrderProps): JSX.Element {
  return (
    <td className="celRemove">
      <button
        type="button"
        className="biBtn opBtn opBtnRemove tabRemove"
        id={`btnTabSubt__${document.querySelectorAll(".tabRemove").length}-${
          props.id
        }`}
        aria-hidden="false"
        onClick={ev => {
          try {
            const relTr = ev.currentTarget.closest("tr");
            if (!(relTr instanceof HTMLTableRowElement))
              throw elementNotFound(relTr, `Validation of Related Table Row`, [
                "HTMLTableRowElement",
              ]);
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
            let opt = "",
              product = "";
            if (/\(/g.test(normText) && /\)/g.test(normText)) {
              opt = normText.slice(
                normText.indexOf("(") + 1,
                normText.indexOf(")")
              );
              console.log(opt);
              product = normText.slice(0, normText.indexOf("(")).trim();
              console.log(product);
            } else {
              product = normText;
              console.log(product);
            }
            const productValue = baseValues.get(product);
            if (!productValue)
              throw new Error(`Failed to fetch product value in map`);
            const total = document.getElementById("total");
            if (!(total instanceof HTMLElement))
              throw elementNotFound(
                total,
                `validation of Total Price Element`,
                ["HTMLElement"]
              );
            if (productValue > 0) {
              let diffPrice =
                parseFinite(
                  `${total.innerText
                    .replace("R$", "")
                    .replaceAll(" ", "")
                    .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(
                    ",",
                    ""
                  )
                ) - productValue;
              console.log(diffPrice);
              if (diffPrice >= 0) diffPrice = 0;
              total.innerText = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 2,
              }).format(parseFinite(roundToTenth(diffPrice)));
            } else if (productValue <= 0) {
              //fetch next level
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
