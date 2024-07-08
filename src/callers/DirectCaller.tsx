import { useEffect, useRef } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  capitalizeFirstLetter,
  concatProducts,
  normalizeSpacing,
  switchAlertOp,
  syncAriaStates,
} from "../handlersCmn";
import { DirectCallerProps } from "../declarations/interfaces";
import { nullishAnchor, nullishBtn } from "../declarations/types";
import WpIcon from "../icons/WpIcon";
import ErrorIcon from "../icons/ErrorIcon";

export default function DirectCaller({
  innerTextL,
  href,
  target,
  rel,
  color: _color,
  ComponentCase,
}: DirectCallerProps) {
  const btnRef = useRef<nullishBtn>(null);
  const aRef = useRef<nullishAnchor>(null);
  useEffect(() => {
    try {
      if (!(btnRef.current instanceof HTMLButtonElement))
        throw htmlElementNotFound(
          btnRef.current,
          `validation of Button Reference`,
          ["HTMLButtonElement"]
        );
      syncAriaStates(btnRef.current);
    } catch (e) {
      console.error(
        `Error executing routine for DirectCaller:\n${(e as Error).message}`
      );
    }
  }, [btnRef]);
  useEffect(() => {
    try {
      if (!(aRef.current instanceof HTMLAnchorElement))
        throw htmlElementNotFound(
          aRef.current,
          `validation of Anchor reference`,
          ["HTMLAnchorElement"]
        );
      if (_color) aRef.current.style.color = _color;
    } catch (e) {
      console.error(
        `Error executing useEffect for aRef in ${
          DirectCaller.prototype.constructor.name
        } for case ${innerTextL}:${(e as Error).message}`
      );
    }
  }, [aRef, _color, innerTextL]);
  const readCase = () => {
    ComponentCase = ComponentCase.toLowerCase().trim();
    switch (ComponentCase) {
      case "whatsapp":
        return <WpIcon large={true} />;
      default:
        return <ErrorIcon fill={false} />;
    }
  };
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message={`Error loading Link`} />
      )}
    >
      <button
        type="button"
        ref={btnRef}
        id={normalizeSpacing(`btn${capitalizeFirstLetter(innerTextL)}`).replace(
          "!",
          ""
        )}
        title={`Clique aqui para ${innerTextL
          .toLowerCase()
          .replace("chame", "chamar")}`}
        onClick={ev => {
          ev.preventDefault();
          const anchor = ev.currentTarget.querySelector("a");
          try {
            if (!(anchor instanceof HTMLAnchorElement))
              throw htmlElementNotFound(anchor, `Validation of call instance`, [
                "HTMLAnchorElement",
              ]);
            const totalEl = document.getElementById("total");
            if (!(totalEl instanceof HTMLElement))
              throw htmlElementNotFound(
                totalEl,
                `HTMLElement for copying total price of message to clipboard`,
                ["HTMLElement"]
              );
            const copyAlert = document.getElementById("copyAlert");
            const orderMsg = concatProducts(
              `_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Preço total 💲*:\n\t${
                totalEl.innerText || "Não calculado"
              }.\n*Produtos do pedido 🍰*:`
            );
            navigator.clipboard
              .writeText(orderMsg)
              .then(() => {
                switchAlertOp(
                  copyAlert,
                  orderMsg,
                  "copying message for WhatsApp"
                );
              })
              .catch(err =>
                console.error(`Error copying message: ${err.message}`)
              );
            orderMsg !==
            "_Olá, Ana_! 🖐 Gostaria de fazer um pedido:*Preço total 💲*: R$ 0,00.*Produtos do pedido 🍰*: "
              ? (anchor.href = `https://whatsa.me/5521983022926/?t=${orderMsg
                  .replaceAll(" ", "+")
                  .replace("pedido:", "pedido:+")
                  .replace("*Produtos", "+*Produtos")
                  .replace("🍰*:", "🍰*:+")}`)
              : (anchor.href = `https://whatsa.me/5521983022926/?t=_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Produtos do pedido 🍰*:\n`);
            open(anchor.href, "_blank");
          } catch (e) {
            console.error(
              `Error executing callback for ${
                ev.currentTarget.id ||
                ev.currentTarget.className ||
                ev.currentTarget.tagName
              }:\n${(e as Error).message}`
            );
          }
        }}
      >
        {readCase()}
        <a
          ref={aRef}
          id={`anchor${normalizeSpacing(
            capitalizeFirstLetter(innerTextL)
          ).replace("!", "")}`}
          className="caller highlight"
          href={`${href}`}
          target={`${target}`}
          rel={`${rel}`}
          title={`Clique aqui para ${innerTextL
            .toLowerCase()
            .replace("chame", "chamar")}`}
          style={{ zIndex: 10, width: "fit-content" }}
          onClick={ev => {
            ev.preventDefault();
            try {
              const totalEl = document.getElementById("total");
              if (!(totalEl instanceof HTMLElement))
                throw htmlElementNotFound(
                  totalEl,
                  `HTMLElement for copying total price of message to clipboard`,
                  ["HTMLElement"]
                );
              const copyAlert = document.getElementById("copyAlert");
              const orderMsg = concatProducts(
                `_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Preço total 💲*:\n\t${
                  totalEl.innerText || "Não calculado"
                }.\n*Produtos do pedido 🍰*:`
              );
              navigator.clipboard
                .writeText(orderMsg)
                .then(() => {
                  switchAlertOp(
                    copyAlert,
                    orderMsg,
                    "copying message for WhatsApp"
                  );
                })
                .catch(err =>
                  console.error(`Error copying message: ${err.message}`)
                );
              orderMsg !==
              "_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Preço total 💲*:\n\tR$ 0,00.*Produtos do pedido 🍰*:"
                ? (ev.currentTarget.href = `https://whatsa.me/5521983022926/?t=${orderMsg
                    .replaceAll(" ", "+")
                    .replace("pedido:", "pedido:+")
                    .replace("*Produtos", "+*Produtos")
                    .replace("🍰*:", "🍰*:+")}`)
                : (ev.currentTarget.href = `https://whatsa.me/5521983022926/?t=_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Produtos do pedido 🍰*:\n`);
              open(ev.currentTarget.href, "_blank");
            } catch (e) {
              console.error(
                `Error executing callback for ${
                  ev.currentTarget.id ||
                  ev.currentTarget.className ||
                  ev.currentTarget.tagName
                }:\n${(e as Error).message}`
              );
            }
          }}
        >{`${innerTextL}`}</a>
      </button>
    </ErrorBoundary>
  );
}
