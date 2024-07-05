import { Root, createRoot } from "react-dom/client";
import { tbodyProps } from "./tableComponents/TableOrders";
import OrderQuantity from "./tableComponents/OrderQuantity";
import OrderRow from "./tableComponents/OrderRow";
import OrderTitle from "./tableComponents/OrderTitle";
import {
  elementNotFound,
  htmlElementNotFound,
  numberError,
  parseFinite,
  stringError,
  typeError,
} from "./handlersErrors";
import { OrderProps } from "./declarations/interfaces";
import {
  nodeScope,
  nullishBtn,
  nullishEl,
  nullishHTMLEl,
  voidishEl,
  voidishHTMLEl,
} from "./declarations/types";
import { ErrorBoundary } from "react-error-boundary";

export const orderedProducts: Record<string, OrderProps> = {};
export const formatPrice = (priceEl: nullishHTMLEl) => {
  return (
    priceEl?.innerText
      ?.replace("R$", "")
      .replace(" ", "")
      .replace(",", ".")
      .trim() || "R$ 0,00"
  );
};

export function isClickOutside(
  event: MouseEvent | React.MouseEvent,
  dlgInBtn: Element
): boolean[] {
  const rect = dlgInBtn.getBoundingClientRect();
  const { clientX, clientY } = event;
  return [
    clientX < rect.left,
    clientX > rect.right,
    clientY < rect.top,
    clientY > rect.bottom,
  ];
}

export function handleOrderAdd(addBtn: nullishBtn, totalEl: nullishEl) {
  try {
    if (!(addBtn instanceof HTMLButtonElement))
      throw elementNotFound(
        addBtn,
        `Button for Adding order id: ${(addBtn as any)?.id ?? "nullish"}`,
        ["<button>"]
      );
    const relLi =
      addBtn.closest("li") ||
      addBtn
        .closest("menu")
        ?.querySelector(`li[id*="${addBtn.name.replace("btn_", "")}"]`);
    if (!(relLi instanceof HTMLElement))
      throw elementNotFound(
        relLi,
        `Menu item related to ${addBtn?.id || "falsish"}`,
        ["<li>"]
      );
    const updatesValidation: number[] = [0, 0];
    //atualização de preço
    try {
      if (!(totalEl instanceof HTMLOutputElement))
        throw elementNotFound(
          totalEl,
          `Input for fetching updated order sum id ${
            (totalEl as any)?.id ?? "nullish"
          }`,
          ["<output>"]
        );
      const prevPrice = formatPrice(totalEl);
      if (!prevPrice || prevPrice === "")
        throw stringError(prevPrice, "Price pattern string");
      let relPrice =
        addBtn.closest("li")!.querySelector(`.opSpanPrice`) ||
        document
          .querySelector(
            `li[id$="${addBtn.id.slice(addBtn.id.indexOf("__") + 3)}"]`
          )
          ?.querySelector(".divProductPrice");
      if (!(relPrice instanceof HTMLElement)) {
        console.warn(
          `Element for Related price not found in the option container. Defaulting to main product price.`
        );
        relPrice =
          relLi
            .closest("dialog")!
            .previousElementSibling!.querySelector(`.divProductPrice`) ||
          document
            .querySelector(
              `li[id$="${addBtn.id.slice(
                addBtn.id.indexOf("__") + 3,
                addBtn.id.indexOf("__") + 6
              )}"]`
            )
            ?.querySelector(".divProductPrice");
      }
      if (!(relPrice instanceof HTMLElement))
        throw elementNotFound(
          relPrice,
          `Menu price Element of item id ${
            relLi.id || "falsish"
          }\n Search made: 
          li[id$="${addBtn.id.slice(
            addBtn.id.indexOf("__") + 3,
            addBtn.id.indexOf("__") + 6
          )}"] .divProductPrice`,
          ["HTMLElement"]
        );
      const price = formatPrice(relPrice);
      if (!price) throw stringError(price, "/[0-9]*/");
      totalEl.innerText =
        ` ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(parseFinite(prevPrice) + parseFinite(price))}` ||
        totalEl.innerText;
      updatesValidation[0] = 1;
    } catch (e2) {
      console.error(`Error updating price after addition event call:
      ${(e2 as Error).message};
      totalEl: ${totalEl?.tagName ?? "nullish"};
      prevPrice: ${
        (totalEl instanceof HTMLElement && formatPrice(totalEl)) || "falsish"
      };
      relPrice: ${
        relLi
          ?.closest("dialog")!
          .previousElementSibling!.querySelector(
            `[id$="${addBtn.id.slice(
              addBtn.id.indexOf("__") + 3,
              addBtn.id.indexOf("__") + 6
            )}"]`
          ) ||
        document
          .querySelector(
            `[id$="${addBtn.id.slice(
              addBtn.id.indexOf("__") + 3,
              addBtn.id.indexOf("__") + 6
            )}"]`
          )
          ?.querySelector(".divProductPrice") ||
        "falsish"
      };
        price: ${(
          (relLi
            ?.closest("dialog")!
            .previousElementSibling!.querySelector(
              `[id$="${addBtn.id.slice(
                addBtn.id.indexOf("__") + 3,
                addBtn.id.indexOf("__") + 6
              )}"]`
            ) ||
            document
              .querySelector(
                `[id$="${addBtn.id.slice(
                  addBtn.id.indexOf("__") + 3,
                  addBtn.id.indexOf("__") + 6
                )}"]`
              )
              ?.querySelector(".divProductPrice")) as HTMLElement
        )?.innerText
          .replace("R$", "")
          .replace(" ", "")
          .replace(",", ".")
          .trim()}
        `);
      try {
        const errorAlert = addBtn.parentElement!.querySelector(".errorAlert");
        if (!(errorAlert instanceof HTMLElement))
          throw htmlElementNotFound(
            errorAlert,
            `Error alert related to ${addBtn.id}`,
            ["HTMLElement"]
          );
        if (/indefinido/gi.test(errorAlert.innerText))
          errorAlert.innerText.replace(/indefinido/gi, "");
        errorAlert.innerText += `\n Erro atualizando pedido `;
        setTimeout(() => {
          errorAlert.innerText = `Erro: indefinido`;
        }, 2000);
      } catch (eA) {
        console.error(`Error capturing erroralert:
        ${(eA as Error).message}`);
      }
    }
    //atualização de título
    try {
      handleMultipleOrder(relLi);
      updatesValidation[1] = 1;
    } catch (e3) {
      console.error(`Error updating complete order text after addition event call:
      ${(e3 as Error).message}`);
      try {
        const errorAlert = addBtn.parentElement!.querySelector(".errorAlert");
        if (!(errorAlert instanceof HTMLElement))
          throw htmlElementNotFound(
            errorAlert,
            `Error alert related to ${addBtn.id}`,
            ["HTMLElement"]
          );
        if (/indefinido/gi.test(errorAlert.innerText))
          errorAlert.innerText.replace(/indefinido/gi, "");
        errorAlert.innerText += `\n Erro escrevendo texto de pedido `;
        setTimeout(() => {
          errorAlert.innerText = `Erro: indefinido`;
        }, 2000);
      } catch (eA) {
        console.error(`Error capturing erroralert:
        ${(eA as Error).message}`);
      }
    }
    //atualização de alerta
    try {
      const addAlert =
        addBtn.parentElement!.querySelector(".addAlert") ||
        addBtn.parentElement!.parentElement!.querySelector(".addAlert");
      if (!(addAlert instanceof HTMLElement))
        throw htmlElementNotFound(
          addAlert,
          `Element for displaying alert for add button id ${addBtn.id}`,
          ["HTMLElement"]
        );
      if (!updatesValidation.every(num => num === 0)) {
        if (
          updatesValidation[0] === 0 &&
          !/Erro calculando total/gi.test(addAlert.innerText)
        ) {
          addAlert.innerText += ` Erro calculando total`;
          addAlert.style.color = `#cf6d12`;
          setTimeout(() => {
            addAlert.innerText = `Item adicionado`;
            addAlert.style.color = `#1ab315`;
          }, 4000);
        }
        if (
          updatesValidation[1] === 0 &&
          !/Erro montando mensagem/gi.test(addAlert.innerText)
        ) {
          addAlert.innerText += ` Erro montando mensagem`;
          addAlert.style.color = `#cf6d12`;
          setTimeout(() => {
            addAlert.innerText = `Item adicionado`;
            addAlert.style.color = `#1ab315`;
          }, 4000);
        }
      }
      if (
        updatesValidation.every(num => num === 0) &&
        !/Erro adicionando pedido/gi.test(addAlert.innerText)
      ) {
        addAlert.innerText = `Erro adicionando pedido`;
        addAlert.style.color = `#c21414`;
        setTimeout(() => {
          addAlert.innerText = `Item adicionado`;
          addAlert.style.color = `#1ab315`;
        }, 2000);
      }
      switchAlertOp(addAlert, "adding order", undefined);
    } catch (e4) {
      console.error(`Error displaying add alert: ${(e4 as Error).message}`);
      try {
        const errorAlert = addBtn.parentElement!.querySelector(".errorAlert");
        if (!(errorAlert instanceof HTMLElement))
          throw htmlElementNotFound(
            errorAlert,
            `Error alert related to ${addBtn.id}`,
            ["HTMLElement"]
          );
        if (/indefinido/gi.test(errorAlert.innerText))
          errorAlert.innerText.replace(/indefinido/gi, "");
        errorAlert.innerText += `\n Erro localizando alerta de adição `;
        setTimeout(() => {
          errorAlert.innerText = `Erro: indefinido`;
        }, 2000);
      } catch (eA) {
        console.error(`Error capturing erroralert:
        ${(eA as Error).message}`);
      }
    }
  } catch (err) {
    console.error(`Error executing Handling of Order Additon:
		${(err as Error).message}`);
  }
}

export function handleOrderSubtract(subtBtn: nullishBtn, totalEl: nullishEl) {
  try {
    if (!(subtBtn instanceof HTMLButtonElement))
      throw elementNotFound(
        subtBtn,
        `Button for Subtracting order id: ${(subtBtn as any)?.id ?? "nullish"}`,
        ["<button>"]
      );
    const relLi =
      subtBtn.closest("li") ||
      subtBtn
        .closest("menu")
        ?.querySelector(`li[id*="${subtBtn.name.replace("btn_", "")}"]`);
    if (!(relLi instanceof HTMLElement))
      throw elementNotFound(
        relLi,
        `Menu item related to ${subtBtn?.id || "falsish"}`,
        ["<li>"]
      );
    const updatesValidation: number[] = [0, 0];
    try {
      if (!(totalEl instanceof HTMLOutputElement))
        throw elementNotFound(
          totalEl,
          `Input for fetching updated order sum id ${
            (totalEl as any)?.id ?? "nullish"
          }`,
          ["<output>"]
        );
      const prevPrice = formatPrice(totalEl);
      if (!prevPrice || prevPrice === "")
        throw stringError(prevPrice, "Price pattern string");
      let relPrice =
        subtBtn.closest("li")!.querySelector(`.opSpanPrice`) ||
        document
          .querySelector(
            `li[id$="${subtBtn.id.slice(subtBtn.id.indexOf("__") + 3)}"]`
          )
          ?.querySelector(".divProductPrice");
      if (!(relPrice instanceof HTMLElement)) {
        console.warn(
          `Element for Related price not found in the option container. Defaulting to main product price.`
        );
        relPrice =
          relLi
            .closest("dialog")!
            .previousElementSibling!.querySelector(`.divProductPrice`) ||
          document
            .querySelector(
              `li[id$="${subtBtn.id.slice(
                subtBtn.id.indexOf("__") + 3,
                subtBtn.id.indexOf("__") + 6
              )}"]`
            )
            ?.querySelector(".divProductPrice");
      }
      if (!(relPrice instanceof HTMLElement))
        throw elementNotFound(
          relPrice,
          `Menu price Element of item id ${
            relLi.id || "falsish"
          }\n Search made: 
          li[id$="${subtBtn.id.slice(
            subtBtn.id.indexOf("__") + 3,
            subtBtn.id.indexOf("__") + 6
          )}"] .divProductPrice`,
          ["HTMLElement"]
        );
      const price = formatPrice(relPrice);
      if (!price) throw stringError(price, "/[0-9]*/");
      const relTr = tbodyProps.currentRef?.querySelector(
        `tr[id*=${subtBtn.id.slice(subtBtn.id.indexOf("__"))}]`
      );
      if (relTr) {
        totalEl.innerText =
          ` ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(parseFinite(prevPrice) - parseFinite(price))}` ||
          totalEl.innerText;
        updatesValidation[0] = 1;
      } else
        console.warn(
          `No related <tr> found:\nSearch made:${subtBtn.id.slice(
            subtBtn.id.indexOf("__")
          )} `
        );
      if (/-/g.test(totalEl.innerText)) totalEl.innerText = `R$ 0,00`;
    } catch (e2) {
      console.error(`Error updating price after addition event call:
      ${(e2 as Error).message}`);
    }
    try {
      handleMultipleOrder(relLi, "subtract");
      updatesValidation[1] = 1;
    } catch (e3) {
      console.error(`Error updating complete order text after addition event call:
      ${(e3 as Error).message}`);
    }
    try {
      const minusAlert =
        subtBtn.parentElement!.querySelector(".minusAlert") ||
        subtBtn.parentElement!.parentElement!.querySelector(".minusAlert");
      if (!(minusAlert instanceof HTMLElement))
        throw htmlElementNotFound(
          minusAlert,
          `Element for displaying alert for add button id ${subtBtn.id}`,
          ["HTMLElement"]
        );
      if (!updatesValidation.every(num => num === 0)) {
        if (updatesValidation[0] === 0) {
          minusAlert.innerText += ` Erro calculando total`;
          minusAlert.style.color = `#cf6d12`;
          setTimeout(() => {
            minusAlert.innerText = `Item removido`;
            minusAlert.style.color = `#c21414`;
          }, 2000);
        }
        if (updatesValidation[1] === 0) {
          minusAlert.innerText += ` Erro montando mensagem`;
          minusAlert.style.color = `#cf6d12`;
          setTimeout(() => {
            minusAlert.innerText = `Item removido`;
            minusAlert.style.color = `#c21414`;
          }, 2000);
        }
      }
      if (updatesValidation.every(num => num === 0)) {
        minusAlert.innerText = `Erro removendo pedido!`;
        minusAlert.style.color = `#cf6d12`;
        setTimeout(() => {
          minusAlert.innerText = `Item removido`;
          minusAlert.style.color = `#c21414`;
        }, 2000);
      }
      switchAlertOp(minusAlert, "removing order");
    } catch (e4) {
      console.error(`Error displaying remove alert:${(e4 as Error).message}`);
    }
  } catch (err) {
    console.error(`Error executing Handling of Order Additon:
		${(err as Error).message}`);
  }
}

export function handleMultipleOrder(
  relLi: HTMLElement,
  context: string = "add"
) {
  //atualização de células em tabela
  try {
    if (!tbodyProps.currentRef || !("id" in tbodyProps.currentRef))
      throw htmlElementNotFound(
        tbodyProps.currentRef,
        `Error fetching HTMLElement for tbody rows.\nObtained value: ${
          tbodyProps.currentRef
        }\nid check: ${tbodyProps.currentRef && "id" in tbodyProps.currentRef}`,
        ["HTMLElement"]
      );
    if (!tbodyProps.root || !("_internalRoot" in tbodyProps.root))
      throw new Error(
        `Error fetching Root for tbody rows.\nObtained value: ${
          tbodyProps.root
        }\ninternalRoot check:${
          tbodyProps.root && "_internalRoot" in tbodyProps.root
        }`
      );
    const unfillableId = `${relLi.id || "unfilled"}`;
    let unfillableTitle = `${
      relLi.dataset.title
        ?.replace("gelada", "gelada de")
        .replace("festa", "festa de")
        .replace("caseiro", "caseiro de")
        .replace("pote", "pote de")
        .replace("recheado", "recheado de")
        .replace("recheada", "recheada de")
        .replace("conjunto", "conjunto:")
        .replaceAll("®", "")
        .replaceAll("ferrero", "Ferrero")
        .replaceAll("rocher", "Rocher")
        .replaceAll("nutella", "Nutella")
        .replaceAll("kinder", "Kinder")
        .replaceAll("bueno", "Bueno")
        .replaceAll("ninho", "Ninho")
        .replaceAll("nutella", "Nutella")
        .replaceAll("oreo", "Oreo")
        .replaceAll("prestígio", "Prestígio")
        .replaceAll(/sonho de valsa/gi, "Sonho de Valsa")
        .replaceAll(/kit kat/gi, "Kit Kat")
        .replaceAll(/ouro branco/gi, "Ouro Branco") || "Título invalidado"
    }`;
    //inclusão de subopção
    try {
      const relDlg = relLi.closest("dialog") || relLi.closest(".modal-content");
      if (!(relDlg instanceof HTMLElement))
        throw htmlElementNotFound(
          relDlg,
          `validation of Related Active Dialog for ${unfillableId}`,
          ["HTMLElement"]
        );
      let opGroups = Array.from(relDlg.querySelectorAll(".opGroup"));
      if (opGroups.length === 0)
        opGroups = [
          ...relDlg.querySelectorAll("div"),
          ...relDlg.children,
        ].filter(
          div =>
            div.querySelector('input[type="radio"]') ||
            div.querySelector('input[type="checkbox"]') ||
            div.querySelector('input[type="range"]')
        );
      if (opGroups.length === 0)
        console.warn(`No Option Group detected. Be sure this is intended.`);
      else {
        for (const opGroup of opGroups) {
          let chosenOptionText = "";
          if (opGroup.querySelector('input[type="radio"]')) {
            const chosenOption = Array.from(
              opGroup.querySelectorAll("input")
            ).filter(inp => inp.checked === true)[0];
            if (!chosenOption) throw new Error(`No available radio chosen`);
            const closestLabel = chosenOption.closest("label");
            if (!(closestLabel instanceof HTMLElement))
              throw htmlElementNotFound(
                closestLabel,
                `validation of Closest Label for ${
                  chosenOption.id ||
                  chosenOption.value ||
                  chosenOption.classList.toString() ||
                  chosenOption.tagName
                }`
              );
            const relSpan = closestLabel.querySelector("span");
            if (relSpan instanceof HTMLElement)
              chosenOptionText = `(${relSpan.innerText})`;
            else {
              console.warn(
                `No span found for label ${
                  closestLabel.id ||
                  closestLabel.htmlFor ||
                  closestLabel.classList.toString() ||
                  closestLabel.tagName
                }`
              );
              chosenOptionText = `(${closestLabel.innerText})`;
            }
          } else if (opGroup.querySelector('input[type="checkbox"]')) {
            const chosenOptions = Array.from(
              opGroup.querySelectorAll("input")
            ).filter(inp => inp.checked === true);
            if (chosenOptions.length === 0)
              throw new Error(`No available checkboxes checked`);
            chosenOptions.forEach(chosenOption => {
              const closestLabel = chosenOption.closest("label");
              if (!(closestLabel instanceof HTMLElement))
                throw htmlElementNotFound(
                  closestLabel,
                  `validation of Closest Label for ${
                    chosenOption.id ||
                    chosenOption.value ||
                    chosenOption.classList.toString() ||
                    chosenOption.tagName
                  }`
                );
              const relSpan = closestLabel.querySelector("span");
              if (relSpan instanceof HTMLElement)
                chosenOptionText = `(${relSpan.innerText})`;
              else {
                console.warn(
                  `No span found for label ${
                    closestLabel.id ||
                    closestLabel.htmlFor ||
                    closestLabel.classList.toString() ||
                    closestLabel.tagName
                  }`
                );
                chosenOptionText = `(${closestLabel.innerText})`;
              }
            });
          } else if (opGroup.querySelector('input[type="range"]')) {
            const chosenOption = opGroup.querySelector("input");
            if (!chosenOption)
              throw new Error(`No available range input chosen`);
            const closestLabel = chosenOption.closest("label");
            if (!(closestLabel instanceof HTMLElement))
              throw htmlElementNotFound(
                closestLabel,
                `validation of Closest Label for ${
                  chosenOption.id ||
                  chosenOption.value ||
                  chosenOption.classList.toString() ||
                  chosenOption.tagName
                }`
              );
            const relSpan = closestLabel.querySelector(".activeSpan");
            if (relSpan instanceof HTMLElement)
              chosenOptionText = `(${relSpan.innerText})`;
            else {
              console.warn(
                `No span found for label ${
                  closestLabel.id ||
                  closestLabel.htmlFor ||
                  closestLabel.classList.toString() ||
                  closestLabel.tagName
                }`
              );
              chosenOptionText = `(${closestLabel.innerText})`;
            }
          }
          unfillableTitle += ` ${chosenOptionText}`;
        }
      }
    } catch (e) {
      console.error(
        `Error executing routine for including suboption:\n${
          (e as Error).message
        }`
      );
    }
    if (tbodyProps.currentRef.querySelector("#tr_order_ph")) {
      tbodyProps.root.render(
        <OrderRow title={unfillableTitle} id={unfillableId} quantity={"1"} />
      );
    } else {
      const relTr = tbodyProps.currentRef.querySelector(`#tr_${unfillableId}`);
      if (!relTr) {
        if (context === "add") {
          const newTr = Object.assign(document.createElement("tr"), {
            id: `tr_${unfillableId}`,
          });
          if (!tbodyProps[`${newTr.id}`])
            tbodyProps[`${newTr.id}`] = createRoot(newTr);
          tbodyProps.currentRef.appendChild(newTr);
          tbodyProps[`${newTr.id}`].render(
            <ErrorBoundary
              FallbackComponent={() => (
                <OrderRow
                  title={unfillableTitle}
                  id={unfillableId}
                  quantity={"1"}
                ></OrderRow>
              )}
            >
              <OrderTitle title={unfillableTitle} id={unfillableId} />
              <OrderQuantity quantity={"1"} id={`${unfillableId}`} />
            </ErrorBoundary>
          );
        }
      } else {
        try {
          const outpQuant = relTr.querySelector(".outp_orderQuant");
          if (!(outpQuant instanceof HTMLElement))
            throw new Error(`No outpQuant matched`);
          let outpQuantCount = outpQuant.innerText;
          if (!Number.isFinite(parseInt(outpQuantCount))) {
            console.warn(
              `innerText of Output Element for order id ${unfillableId}} not parseable. Value defaulted`
            );
            outpQuant.innerText = "1";
          } else {
            switch (context) {
              case "add":
                outpQuant.innerText = `${
                  parseFinite(outpQuantCount, "int", 1) + 1
                }`;
                break;
              case "subtract":
                const outptQuantNum = parseFinite(outpQuant.innerText) - 1;
                if (outptQuantNum > 0) outpQuant.innerText = `${outptQuantNum}`;
                else {
                  relTr instanceof HTMLElement && (relTr.hidden = true);
                  if (!tbodyProps[`${relTr.id}`])
                    tbodyProps[`${relTr.id}`] = createRoot(relTr);
                  tbodyProps[`${relTr.id}`].unmount();
                  if (
                    !tbodyProps.currentRef.querySelector("tr") ||
                    Array.from(
                      tbodyProps.currentRef.querySelectorAll("tr")
                    ).filter(
                      tr =>
                        tr.hidden === false &&
                        parseFinite(
                          getComputedStyle(tr).height.replace("px", "")
                        ) > 0
                    ).length === 1 ||
                    Array.from(
                      tbodyProps.currentRef.querySelectorAll("tr")
                    ).every(
                      tr =>
                        tr instanceof HTMLElement &&
                        (getComputedStyle(tr).height === "0" ||
                          tr.hidden === true)
                    )
                  ) {
                    tbodyProps.root.render(
                      <OrderRow
                        key={"order_ph"}
                        id={"order_ph"}
                        quantity={"0"}
                      />
                    );
                    const totalEl = document.getElementById("total");
                    try {
                      if (!totalEl)
                        throw htmlElementNotFound(
                          totalEl,
                          `Element for total order value in procedure for defaulting table`,
                          ["HTMLElement"]
                        );
                      totalEl.innerText =
                        ` ${new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(0)}` || totalEl.innerText;
                    } catch (eP) {
                      console.error(
                        `Error defaulting total order value: \n${
                          (eP as Error).message
                        }`
                      );
                    }
                  }
                }
                break;
              default:
                console.warn(
                  `Error getting operation context for ${unfillableId}`
                );
                parseFinite(outpQuantCount, "int", 1) < 1 && relTr.remove();
            }
          }
        } catch (eTr) {
          if (!tbodyProps.root) {
            console.warn(
              `no root validated in tbody props. initiating replacement.`
            );
            try {
              tbodyProps.currentRef = document.getElementById("tbodyOrders");
              if (!tbodyProps.currentRef)
                throw htmlElementNotFound(
                  tbodyProps.currentRef,
                  `Reference for Orders Table Body`,
                  ["HTMLElement"]
                );
              tbodyProps.root.render(
                <OrderRow
                  title={unfillableTitle}
                  id={unfillableId}
                  quantity={"1"}
                />
              );
              const totalEl = document.getElementById("total");
              try {
                if (!totalEl)
                  throw htmlElementNotFound(
                    totalEl,
                    `Element for total order value in procedure for defaulting table`,
                    ["HTMLElement"]
                  );
                totalEl.innerText =
                  ` ${new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(0)}` || totalEl.innerText;
              } catch (eP) {
                console.error(
                  `Error defaulting total order value: \n${
                    (eP as Error).message
                  }`
                );
              }
            } catch (eR) {
              console.error(`Error replacing tbodyProps data.
              Obtained props:
              ${tbodyProps.currentRef ?? "nullish"}
              ${tbodyProps.root ?? "nullish"}`);
            }
          } else {
            tbodyProps.root.render(
              <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
            );
            const totalEl = document.getElementById("total");
            try {
              if (!totalEl)
                throw htmlElementNotFound(
                  totalEl,
                  `Element for total order value in procedure for defaulting table`,
                  ["HTMLElement"]
                );
              totalEl.innerText =
                ` ${new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(0)}` || totalEl.innerText;
            } catch (eP) {
              console.error(
                `Error defaulting total order value: \n${(eP as Error).message}`
              );
            }
          }
        }
      }
    }
  } catch (eT) {
    console.error(
      `Error generating Table Row for Order: \n${(eT as Error).message}`
    );
  }
}

export function addListenerCopyMessage() {
  try {
    if (!(tbodyProps.currentRef instanceof HTMLElement))
      throw htmlElementNotFound(
        tbodyProps.currentRef,
        `Current Reference for Orders Table Body`,
        ["HTMLElement"]
      );
    const totalEl = document.getElementById("total");
    if (!(totalEl instanceof HTMLElement))
      throw htmlElementNotFound(
        totalEl,
        `HTMLElement for copying total price of message to clipboard`,
        ["HTMLElement"]
      );
    const copyAlert = document.getElementById("copyAlert");
    const concatProducts = (orderMsg: string): string => {
      try {
        if (!(tbodyProps.currentRef instanceof HTMLElement))
          throw htmlElementNotFound(
            tbodyProps.currentRef,
            `Reference for Orders in Table Body`,
            ["HTMLElement"]
          );
        Array.from(tbodyProps.currentRef.querySelectorAll("tr")).forEach(tr => {
          try {
            const titleEl = tr.querySelector(".outp_orderTitle");
            if (!(titleEl instanceof HTMLElement))
              throw htmlElementNotFound(
                titleEl,
                `Title Element for Table Row id ${tr.id || "Unidentified"}`,
                ["HTMLElement"]
              );
            if (
              !/\w/g.test(titleEl.innerText) ||
              /undefined/gi.test(titleEl.innerText) ||
              /unfilled/gi.test(titleEl.innerText) ||
              /null/gi.test(titleEl.innerText)
            )
              throw stringError(
                titleEl.innerText,
                "letters, not containing undefined, unfilled or null"
              );
            const title = titleEl.innerText;
            const quantEl = tr.querySelector(".outp_orderQuant");
            if (!(quantEl instanceof HTMLElement))
              throw htmlElementNotFound(
                quantEl,
                `quantity Element for Table Row id ${tr.id || "Unidentified"}`,
                ["HTMLElement"]
              );
            const quant = quantEl.innerText;
            if (!Number.isFinite(parseInt(quant)))
              console.warn(
                `Quantity of product ??? not finite. Process aborted.`
              );
            orderMsg += `\n\t${title} (${quant})`;
          } catch (eC) {
            console.error(
              `Error concatening product for clipboard message:${
                (eC as Error).message
              }`
            );
          }
        });
      } catch (eM) {
        console.error(`Error generating clipboard message:
      ${(eM as Error).message}`);
      }
      return orderMsg;
    };
    try {
      const copyBtnWp = document.getElementById("copyBtnWp");
      if (!(copyBtnWp instanceof HTMLButtonElement))
        throw htmlElementNotFound(
          copyBtnWp,
          `Button for copying message to clipboard`,
          ["<button>"]
        );
      copyBtnWp.addEventListener("click", () => {
        const orderMsg = concatProducts(
          `_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Preço total 💲*:\n\t${
            totalEl.innerText || "Não calculado"
          }.\n*Produtos do pedido 🍰*:`
        );
        navigator.clipboard
          .writeText(orderMsg)
          .then(() => {
            switchAlertOp(copyAlert, orderMsg, "copying message for WhatsApp");
          })
          .catch(err => console.error(`Error copying message: ${err.message}`));
      });
    } catch (e2) {
      console.error(`Error adding listener to copyBtnWp:
      ${(e2 as Error).message}`);
    }
    try {
      const copyBtnInst = document.getElementById("copyBtnInst");
      if (!(copyBtnInst instanceof HTMLButtonElement))
        throw htmlElementNotFound(
          copyBtnInst,
          `Button for copying message to clipboard`,
          ["<button>"]
        );
      copyBtnInst.addEventListener("click", () => {
        const orderMsg = concatProducts(
          `Olá, Ana! 🖐 Gostaria de fazer um pedido:\nPreço total 💲:\n\t${
            totalEl.innerText || "Não calculado"
          }.\nProdutos do pedido 🍰:`
        );
        navigator.clipboard
          .writeText(orderMsg)
          .then(() => {
            switchAlertOp(
              copyAlert,
              orderMsg,
              "copying message for Default Pattern"
            );
          })
          .catch(err => console.error(`Error copying message: ${err.message}`));
      });
    } catch (e3) {
      console.error(`Error adding listener to copyBtnWp:
      ${(e3 as Error).message}`);
    }
  } catch (e) {
    console.error(`Error executing addListenerCopyMessage:
    ${(e as Error).message}`);
  }
}

export function switchAlertOp(
  alertEl: nullishHTMLEl,
  message?: string,
  context?: string
) {
  //@ts-ignore
  !Number.isFinite &&
    console.warn(
      `The current browser does not support ES6. That might result in wrongly conducted effects. Please update your navigator version.`
    );
  try {
    if (!(alertEl instanceof Element))
      throw elementNotFound(
        alertEl,
        `Element for displaying alert for ${context}`,
        ["Element"]
      );
    if (message && context) {
      const pattern = `Produtos do pedido 🍰:`;
      const products = message.slice(
        message.indexOf(pattern) + pattern.length,
        message.length
      );
      if (products.length < 2) {
        alertEl.innerText = `Mensagem copiada com algum erro...`;
        alertEl.style.color = `#d87111ec`;
        setTimeout(() => {
          alertEl.innerText = `Texto copiado`;
          alertEl.style.color = `#57a7bc`;
        }, 5000);
      }
    }
    if (
      parseFinite(getComputedStyle(alertEl!).opacity) >= 0.99 ||
      parseFinite(getComputedStyle(alertEl!).opacity) <= 0.1
    ) {
      const addOpacity = setInterval(() => {
        if (alertEl?.id && document.querySelector(`#${alertEl.id}`)) {
          if (parseFinite(getComputedStyle(alertEl).opacity) >= 1)
            clearInterval(addOpacity);
          alertEl.style.opacity = `${
            parseFinite(getComputedStyle(alertEl).opacity) + 0.05
          }`;
        } else {
          console.warn(`No alert element found. Clearing addOpacity.
          Used id: ${alertEl?.id || "No Element"}`);
          clearInterval(addOpacity);
        }
      }, 10);
      const removeOpacity = setInterval(() => {
        if (alertEl?.id && document.querySelector(`#${alertEl.id}`)) {
          if (parseFinite(getComputedStyle(alertEl).opacity) <= 0)
            clearInterval(removeOpacity);
          alertEl.style.opacity = `${
            parseFinite(getComputedStyle(alertEl).opacity) - 0.02
          }`;
        } else {
          console.warn(`No alert element found. Clearing removeOpacity.
          Used id: ${alertEl?.id || "No Element"}`);
          clearInterval(removeOpacity);
        }
      }, 30);
      setTimeout(() => {
        clearInterval(addOpacity);
        clearInterval(removeOpacity);
        alertEl!.style.opacity = `0`;
      }, 6000);
    }
    if (
      parseFinite(getComputedStyle(alertEl!).opacity) < 0 ||
      !parseFinite(getComputedStyle(alertEl!).opacity)
    )
      alertEl!.style.opacity = `0`;
  } catch (eA) {
    console.error(`Error emitting alert ${
      alertEl?.id ?? "UNIDENTIFIED"
    } for ${context}:
      ${(eA as Error).message}`);
  }
}

export function handleDoubleClick(inps: (nullishHTMLEl | undefined)[]): void {
  try {
    if (
      !(
        Array.isArray(inps) && inps.some(inp => inp instanceof HTMLInputElement)
      )
    )
      throw typeError(
        inps,
        `validation of inps argument in handleDoubleClick`,
        ["Array<void | HTMLInputElement>"]
      );
    inps = inps.filter(
      inp =>
        inp instanceof HTMLInputElement &&
        (inp.type === "radio" || inp.type === "checkbox")
    );
    if (inps.length === 0)
      throw new Error(
        `Error validating length of inps arguments in handleDoubleClick`
      );
    inps.forEach((inp, i) => {
      try {
        if (
          !(
            inp instanceof HTMLInputElement &&
            (inp.type === "radio" || inp.type === "checkbox")
          )
        )
          throw htmlElementNotFound(inp, `validation of Input`, [
            '<input type="radio"> || <input type="checkbox">',
          ]);
        inp.addEventListener("doubleclick", ev => {
          try {
            if (
              !(
                ev.currentTarget instanceof HTMLInputElement &&
                (ev.currentTarget.type === "radio" ||
                  ev.currentTarget.type === "checkbox")
              )
            )
              throw new Error(`Error validating current target of ${ev.type}`);
            if (ev.currentTarget.checked) ev.currentTarget.checked = false;
          } catch (eC) {
            console.error(
              `Error executing callback for ${ev.type} during ${
                ev.timeStamp
              }:\n${(eC as Error).message}`
            );
          }
        });
      } catch (eI) {
        console.error(
          `Error executing iteration ${i} in handleDoubleClick loop:\n${
            (eI as Error).message
          }`
        );
      }
    });
  } catch (e) {
    console.error(
      `Error executing handleDoubleClick:\n${(e as Error).message}`
    );
  }
}

export function handleSearchFilter(
  inp: voidishHTMLEl,
  scope: nodeScope,
  filter: string,
  ...targSelectors: string[]
): void {
  try {
    if (!(inp instanceof HTMLInputElement))
      throw htmlElementNotFound(
        inp,
        `validation of inp argument in handleSearchFilter`,
        ["HTMLInputElement"]
      );
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(`Invalid scope passed to handleSearchFilter`);
    if (!(scope instanceof HTMLElement))
      console.warn(
        `Scope passed to handleSearchFilter not an HTMLElement. Be sure this is intended.`
      );
    if (typeof filter !== "string")
      throw typeError(
        filter,
        `validation of filter argument in handleSearchFilter`,
        ["string"]
      );
    const normalizeSpacingHifen = (value: string) => {
      return value.replaceAll(" ", "-");
    };
    const filterNormalized = normalizeSpacingHifen(filter).toLowerCase();
    targSelectors = targSelectors.filter(
      selector => typeof selector === "string"
    );
    if (
      !(
        Array.isArray(targSelectors) &&
        targSelectors.every(targSelector => typeof targSelector === "string")
      )
    )
      throw typeError(
        targSelectors,
        `validation of targSelectors in handleSearchFilter`,
        ["string[]"]
      );
    if (!targSelectors.some(selector => scope.querySelector(selector)))
      throw new Error(
        `No correspondence of selector in the passed scope for handleSearchFilter`
      );
    for (const selector of targSelectors) {
      scope.querySelectorAll(selector).forEach((selected, i) => {
        try {
          if (!(selected instanceof HTMLElement))
            throw htmlElementNotFound(
              selected,
              `validation of Selected Element instance`
            );
          if (filter === "") {
            scope.querySelectorAll("li").forEach(item => {
              if (
                item instanceof HTMLElement &&
                item.querySelector(".divProductPrice") &&
                /[0-9]/g.test(
                  item.querySelector(".divProductPrice")!.textContent || ""
                )
              )
                item.hidden = false;
            });
          } else {
            const testExp = new RegExp(filter, "gis");
            const testExpNormalized = new RegExp(filterNormalized, "gis");
            const innerSpans = Array.from(selected.querySelectorAll("span"));
            if (
              testExp.test(selected.id) ||
              testExpNormalized.test(
                normalizeSpacingHifen(selected.id.toLowerCase())
              ) ||
              testExp.test(selected.classList.toString()) ||
              testExpNormalized.test(
                normalizeSpacingHifen(
                  selected.classList.toString().toLowerCase()
                )
              ) ||
              (selected.dataset.title &&
                (testExp.test(selected.dataset.title) ||
                  testExpNormalized.test(
                    normalizeSpacingHifen(
                      selected.dataset.title.toLocaleLowerCase()
                    )
                  ))) ||
              innerSpans.some(span => testExp.test(span.innerText)) ||
              innerSpans.some(span =>
                testExpNormalized.test(
                  normalizeSpacingHifen(span.innerText.toLowerCase())
                )
              )
            ) {
              selected.hidden = false;
            } else selected.hidden = true;
          }
        } catch (e) {
          console.error(
            `Error executing iteration ${i} for ${selector} in handleSearchFilter query:\n${
              (e as Error).message
            }`
          );
        }
      });
    }
  } catch (e) {
    console.error(
      `Error executing handleSearchFilter:\n${(e as Error).message}`
    );
  }
}

export const baseMappedValues: Map<string, Map<string, number>> = new Map([
  [
    "cookie recheado",
    new Map([
      ["chocolatudo", 10.0],
      ["duochoco", 10.0],
      ["ferrero rocher®", 12.0],
      ["nutella®", 10.0],
      ["pistache", 10.0],
      ["red velvet com chocolate branco", 10.0],
    ]),
  ],
]);
export const baseValues: Map<string, number> = new Map([
  ["bolo caseiro".toLowerCase(), 45.0],
  ["bolo de festa".toLowerCase(), 60.0],
  ["bolo de pote".toLowerCase(), 15.0],
  ["brownie recheado".toLowerCase(), 10.0],
  ["mini brownie recheado".toLowerCase(), 4.0],
  ["brownie simples", 8.0],
  // ["cookie recheado".toLowerCase(), -1],
  ["copo da felicidade", 20.0],
  ["mini cookie".toLowerCase(), 15.0],
  ["geleia artesanal", -1],
  ["palha italiana".toLowerCase(), 8.0],
  ["pave de pote", 15.0],
  ["torta".toLowerCase(), 45.0],
  ["taça recheada", -1],
  ["travessa recheada", -1],
]);
export const factorMaps = new Map([
  ["pequeno".toLowerCase(), 1],
  ["médio".toLowerCase(), 1.5556],
  ["grande".toLowerCase(), 1.7778],
  ["75g".toLowerCase(), 1],
  ["150g".toLowerCase(), 1.875],
  ["saco".toLowerCase(), 1],
  ["lata personalizada".toLowerCase(), 1.66667],
]);
export const baseFestValues: Map<string, number> = new Map([
  ["branco com chantili e morango".toLowerCase(), 90.0],
  ["branco com mousse de chocolate branco e framboesa".toLowerCase(), 100.0],
  ["brigadeiro com morango".toLowerCase(), 80.0],
  ["brigadeiro confeitado e morango".toLowerCase(), 90.0],
  ["brigadeiro granulado", 80.0],
  ["chocolate com brigadeiro e kit kat®".toLowerCase(), 100.0],
  [
    "chocolate com doce de leite, kit kat® e kinder bueno®".toLowerCase(),
    120.0,
  ],
  ["chocolate com mousse de ninho®, nutella® e morango".toLowerCase(), 95.0],
  ["mousse de chocolate com frutas vermelhas".toLowerCase(), 90.0],
  ["ouro branco®".toLowerCase(), 85.0],
  ["red velvet com mousse de cream cheese e morango".toLowerCase(), 75.0],
]);
export const factorFestValues: Map<string, Map<string, number>> = new Map([
  [
    "pequeno",
    new Map([
      ["branco com chantili e morango".toLowerCase(), 1],
      ["branco com mousse de chocolate branco e framboesa".toLowerCase(), 1],
      ["brigadeiro com morango".toLowerCase(), 1],
      ["brigadeiro confeitado e morango".toLowerCase(), 1],
      ["brigadeiro granulado", 1],
      ["chocolate com brigadeiro e kit kat®".toLowerCase(), 1],
      [
        "chocolate com doce de leite, kit kat® e kinder bueno®".toLowerCase(),
        1,
      ],
      ["chocolate com mousse de ninho®, nutella® e morango".toLowerCase(), 1],
      ["mousse de chocolate com frutas vermelhas".toLowerCase(), 1],
      ["ouro branco®".toLowerCase(), 1],
      ["red velvet com mousse de cream cheese e morango".toLowerCase(), 1],
    ]),
  ],
  [
    "médio",
    new Map([
      ["branco com chantili e morango".toLowerCase(), 1.445],
      ["branco com mousse de chocolate branco e framboesa".toLowerCase(), 1.5],
      ["brigadeiro com morango".toLowerCase(), 1.625],
      ["brigadeiro confeitado e morango".toLowerCase(), 1.5555],
      ["brigadeiro granulado", 1.5],
      ["chocolate com brigadeiro e kit kat®".toLowerCase(), 1.4],
      [
        "chocolate com doce de leite, kit kat® e kinder bueno®".toLowerCase(),
        1.3333,
      ],
      [
        "chocolate com mousse de ninho®, nutella® e morango".toLowerCase(),
        1.4737,
      ],
      ["mousse de chocolate com frutas vermelhas".toLowerCase(), 1.5],
      ["ouro branco®".toLowerCase(), 1.412],
      ["red velvet com mousse de cream cheese e morango".toLowerCase(), 1.3335],
    ]),
  ],
  [
    "grande",
    new Map([
      ["branco com chantili e morango".toLowerCase(), 2],
      ["branco com mousse de chocolate branco e framboesa".toLowerCase(), 2],
      ["brigadeiro com morango".toLowerCase(), 2.1875],
      ["brigadeiro confeitado e morango".toLowerCase(), 2.05556],
      ["brigadeiro granulado", 2],
      ["chocolate com brigadeiro e kit kat®".toLowerCase(), 1.7],
      [
        "chocolate com doce de leite, kit kat® e kinder bueno®".toLowerCase(),
        1.5,
      ],
      [
        "chocolate com mousse de ninho®, nutella® e morango".toLowerCase(),
        1.9474,
      ],
      ["mousse de chocolate com frutas vermelhas".toLowerCase(), 1.77778],
      ["ouro branco®".toLowerCase(), 1.82353],
      ["red velvet com mousse de cream cheese e morango".toLowerCase(), 1.7334],
    ]),
  ],
]);
export const averageFestPricesMap: Map<string, number> = new Map([
  [
    "pequeno",
    (Array.from(baseFestValues.values() ?? [85.0])
      .filter(num => Number.isFinite(num))
      .map(num => Math.abs(num))
      .reduce((acc, num) => (acc += num), 0) || 85.0) /
      Array.from(baseFestValues.values() ?? [85.0]).filter(num =>
        Number.isFinite(num)
      ).length,
  ],
  [
    "médio",
    ((Array.from(baseFestValues.values() ?? [85.0])
      .filter(num => Number.isFinite(num))
      .map(num => Math.abs(num))
      .reduce((acc, num) => (acc += num), 0) || 85.0) *
      ((Array.from(factorFestValues.get("médio")?.values() ?? [1.5])
        .filter(num => Number.isFinite(num))
        .map(num => Math.abs(num))
        .reduce((acc, num) => (acc += num), 0) || 1.5) /
        Array.from(baseFestValues.values() ?? [85.0]).filter(num =>
          Number.isFinite(num)
        ).length)) /
      Array.from(baseFestValues.values() ?? [85.0]).filter(num =>
        Number.isFinite(num)
      ).length,
  ],
  [
    "grande",
    ((Array.from(baseFestValues.values() ?? [85.0])
      .filter(num => Number.isFinite(num))
      .map(num => Math.abs(num))
      .reduce((acc, num) => (acc += num), 0) || 85.0) *
      ((Array.from(factorFestValues.get("grande")?.values() ?? [2.0])
        .filter(num => Number.isFinite(num))
        .map(num => Math.abs(num))
        .reduce((acc, num) => (acc += num), 0) || 2.0) /
        Array.from(baseFestValues.values() ?? [85.0]).filter(num =>
          Number.isFinite(num)
        ).length)) /
      Array.from(baseFestValues.values() ?? [85.0]).filter(num =>
        Number.isFinite(num)
      ).length,
  ],
]);

export function recalculateByOption(
  refClass: string,
  scope: nodeScope,
  factor: string
): void {
  try {
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(
        `Error validating scope for recalculateByOption. Expected instances: HTMLElement | Document | DocumentFragment`
      );
    if (typeof refClass !== "string")
      throw typeError(
        refClass,
        `validation of refClass argument in recalculateByOption`,
        ["string"]
      );
    if (typeof factor !== "string")
      throw typeError(
        factor,
        `validation of factor argument in recalculateByOption`,
        ["string"]
      );
    if (!refClass.startsWith(".")) refClass = `.${refClass}`;
    refClass = refClass.trim();
    factor = factor.toLowerCase().trim().replaceAll(" ", "");
    if (factor === "pequena") factor = "pequeno";
    if (factor === "média") factor = "médio";
    if (/lata/gis.test(factor)) factor = factor.replace("lata", "lata ");
    let targProduct = "",
      correctionFactor = 1,
      relationPrices: Array<string[]> = [];
    if (scope instanceof HTMLElement) {
      const relDlg = scope.closest("dialog") || scope.closest(".modal-content");
      try {
        if (!(relDlg instanceof HTMLElement))
          throw htmlElementNotFound(
            relDlg,
            `validation of Related dialog window`,
            ["HTMLElement"]
          );
        if (/bolo/gis.test(relDlg.id)) {
          if (/caseiro/gis.test(relDlg.id)) {
            targProduct = "bolo caseiro";
            switch (factor) {
              case "grande":
                correctionFactor = 0.75;
                break;
              default:
                correctionFactor = 1;
            }
          } else if (/festa/gis.test(relDlg.id)) {
            targProduct = "bolo de festa";
            try {
              relationPrices = fetchRelationBdfCases(relDlg).filter(
                relationPrice =>
                  typeof relationPrice[0] === "string" &&
                  typeof relationPrice[1] === "string" &&
                  typeof relationPrice[2] === "string"
              );
              if (!relationPrices || relationPrices.length === 0)
                throw new Error(
                  `Failed to fetch Relation of Bolos de Festa and their prices.`
                );
            } catch (e) {
              console.error(
                `Error executing routine for Bolos de Festa:${
                  (e as Error).message
                }`
              );
            }
          } else
            throw stringError(
              relDlg.id,
              "/bolo/gi && (/caseiro/gi || /festa/gi)"
            );
        } else if (/torta/gis.test(relDlg.id)) targProduct = "torta";
        else if (/palha/gis.test(relDlg.id)) targProduct = "palha italiana";
        else if (/cookie/gis.test(relDlg.id)) targProduct = "mini cookie";
        else
          throw stringError(
            relDlg.id,
            "/bolo/gi || /torta/gi || /palha/gi || /cookie/gi"
          );
        if (/bolo/gis.test(relDlg.id) && /festa/gis.test(relDlg.id)) {
          relationPrices.forEach((relationPrice, i) => {
            applyRelationBdfCases(relationPrice, factor, scope, i);
          });
        } else {
          let appliedFactor = factorMaps.get(factor);
          if (!appliedFactor) {
            console.warn(`Error mapping appliedFactor. Defaulted to 1.`);
            appliedFactor = 1;
          }
          const targBaseValue = baseValues.get(targProduct);
          if (!targBaseValue)
            throw new Error(
              `Error mapping Target Base Value. Aborting update of price.`
            );
          applyFactorProductCase(
            appliedFactor,
            targBaseValue as number,
            correctionFactor,
            refClass,
            scope
          );
        }
      } catch (eD) {
        console.error(
          `Error fetching related <dialog> for filling fallback factors:\n${
            (eD as Error).message
          }`
        );
      }
    } else
      console.warn(
        `scope for filling fallbackFactorMaps not validated as instance of HTMLElement. Be sure this is intended.\nObtained instance: ${scope.constructor.name}\n Obtained nodeType: ${scope.nodeType}`
      );
  } catch (e) {
    console.error(
      `Error executing recalculateByOption:${(e as Error).message}`
    );
  }
}

export function applyVelvetCase(name: string, element: voidishHTMLEl) {
  try {
    if (typeof name !== "string")
      throw typeError(name, `validation of name argument in applyVelvetCase`, [
        "string",
      ]);
    if (!(element instanceof HTMLElement))
      throw htmlElementNotFound(
        element,
        `validation of element argument in applyVelvetCase`
      );
    const relDlg = element.closest("dialog");
    if (!(relDlg instanceof HTMLElement))
      throw htmlElementNotFound(relDlg, `validation of Related Dialog`);
    if (
      /velvet/gi.test(name) &&
      /bolo/gi.test(relDlg.id) &&
      /caseiro/gi.test(relDlg.id)
    ) {
      const prevPrice = element.innerText;
      element.innerText = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }).format(
        parseFloat(
          element.innerText.replace(",", ".").replace("R$", "").trim()
        ) * 1.33333
      );
      if (
        /NaN/g.test(element.innerText) ||
        /infinity/gi.test(element.innerText) ||
        !/[0-9]/g.test(element.innerText)
      ) {
        console.warn(
          `Error defining price for Velvet case. Returning to default price.`
        );
        element.innerText = prevPrice;
      }
    }
  } catch (e) {
    console.error(`Error executing applyVelvetCase:\n${(e as Error).message}`);
  }
}

export function fetchRelationBdfCases(scope: nodeScope): Array<string[]> {
  try {
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(`Invalid scope passed to fetchRelationBdfCases`);
    if (!(scope instanceof HTMLElement))
      console.warn(
        `Scope argumented to handleBoloDeFestCases not an HTMLElement. Be sure this is intended.`
      );
    let bdfItems = scope.querySelectorAll(".opLi");
    if (bdfItems.length === 0)
      scope.querySelector(".menuOpMenu")?.querySelectorAll("li");
    if (!bdfItems || bdfItems.length === 0)
      throw new Error(
        `Error validating Bdf Items query: ${bdfItems?.length || "undefined"}`
      );
    return Array.from(bdfItems)
      .map((bdf, i) => {
        try {
          if (!(bdf instanceof HTMLElement))
            throw htmlElementNotFound(bdf, `validation of Bolo de Festa item`);
          const bdfPrice =
            bdf.querySelector(".opSpanPrice") ?? bdf.lastElementChild;
          if (!(bdfPrice instanceof HTMLElement))
            throw htmlElementNotFound(
              bdfPrice,
              `validation of Price Element for Bolo de Festa item`
            );
          if (!/[0-9]/g.test(bdfPrice.innerText))
            throw stringError(bdfPrice.innerText, `/[0-9]/g`);
          let bdfTitle = (bdf.dataset.title ?? "")
            .toLowerCase()
            .replace("bolo de festa ", "");
          const bdfTitleEl =
            bdf.querySelector(".opSpanName") ??
            bdf.querySelector(".opInfoDiv")?.querySelector("strong") ??
            bdf.querySelector(".opInfoDiv")?.firstElementChild;
          if (!(bdfTitleEl instanceof HTMLElement))
            console.warn(
              `Error validating of Title Element for Bolo de Festa item`
            );
          else bdfTitle = bdfTitleEl.innerText.toLowerCase();
          if (!baseFestValues.has(bdfTitle))
            baseFestValues.set(bdfTitle, parseFinite(bdfPrice.innerText));
          return [bdfPrice.id, bdfTitle, bdfPrice.innerText];
        } catch (e) {
          console.error(
            `Error executing iteration ${i} for fetchRelationBdfCases:\n${
              (e as Error).message
            }`
          );
          return [];
        }
      })
      .filter(price => price && typeof price[1] === "string");
  } catch (e) {
    console.error(
      `Error executing fetchRelationBdfCases:\n${(e as Error).message}`
    );
    return [[]];
  }
}

export function applyRelationBdfCases(
  relationPrice: string[],
  factor: string,
  scope: nodeScope,
  cicle: number = NaN
) {
  try {
    if (!Array.isArray(relationPrice))
      throw typeError(
        relationPrice,
        `validation of relationPrice argument for applyRelationBdfCases`,
        ["Array"]
      );
    if (typeof factor !== "string")
      throw typeError(
        factor,
        `validation of factor argument for applyRelationBdfCases`,
        ["string"]
      );
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw typeError(
        scope,
        `validation of scope argument for applyRelationBdfCases`,
        ["HTMLElement", "Document", "DocumentFragment"]
      );
    if (typeof cicle !== "number") {
      console.warn(
        `Invalid type for cicle argument in applyRelationBdfCases. Defaulting to NaN`
      );
      cicle = NaN;
    }
    let correctionFactor = 1;
    if (relationPrice.filter(info => typeof info === "string").length < 3)
      throw numberError(relationPrice, `validation of relationPrice length`);
    let [idf, title] = relationPrice,
      appliedFactor = factorMaps.get(factor);
    if (!appliedFactor) {
      console.warn(`Error mapping appliedFactor. Defaulted to 1.`);
      appliedFactor = 1;
    }
    let relationBaseValue = baseFestValues.get(title);
    if (!relationBaseValue) {
      console.warn(
        `Error getting relationBaseValue. Trying recovering...` + title
      );
      if (
        (title.match(/®/g)?.length || /®/g.test(title.trim().slice(0, -1))) &&
        /®\S/g.test(title)
      )
        title = title.replaceAll(/®/g, `® `).trim().replaceAll(/® ,/g, `®,`);
      relationBaseValue = baseFestValues.get(title);
    }
    if (!relationBaseValue) {
      console.error(`Error recovering relationBaseValue. Defaulting Value.`);
      switch (factor) {
        case "grande":
          relationBaseValue = averageFestPricesMap.get("grande") || 170.0;
          if (relationBaseValue > 200.0) relationBaseValue = 200.0;
          break;
        case "médio":
          relationBaseValue = averageFestPricesMap.get("médio") || 130.0;
          if (relationBaseValue > 150.0) relationBaseValue = 150.0;
          break;
        default:
          relationBaseValue = averageFestPricesMap.get("pequeno") || 85.0;
          if (relationBaseValue > 100.0) relationBaseValue = 100.0;
      }
      applyFactorProductCase(1, relationBaseValue, 1, `#${idf}`, scope);
      return;
    }
    const relatedMap = factorFestValues.get(factor);
    if (!(relatedMap instanceof Map))
      throw typeError(
        relatedMap,
        `validation of Related Map for Bolo de Festas factor`,
        ["Map"]
      );
    let relFactor = relatedMap.get(title) ?? relatedMap.get(idf);
    if (typeof relFactor !== "number" || !Number.isFinite(relFactor)) {
      console.warn(
        `Failed to fetch Related Factor by title. Getting average factor value.`
      );
      relFactor = averageFestPricesMap.get(factor);
    }
    if (typeof relFactor !== "number" || !Number.isFinite(relFactor)) {
      console.warn(
        `Error getting Related Factor for Bolo de Festas case ${
          title || idf || "undefined"
        }. Defaulted to Factor Switch.`
      );
      switch (factor) {
        case "grande":
          relFactor = 2;
          break;
        case "médio":
          relFactor = 1.5;
          break;
        default:
          relFactor = 1;
      }
    }
    correctionFactor = relFactor;
    applyFactorProductCase(
      1,
      relationBaseValue,
      correctionFactor,
      `#${idf}`,
      scope
    );
  } catch (eP) {
    console.error(
      `Error executing iteration ${cicle} for relationPrices for Bolos de Festa:\n${
        (eP as Error).message
      }`
    );
  }
}

export function applyFactorProductCase(
  appliedFactor: number,
  targBaseValue: number,
  correctionFactor: number,
  refClass: string,
  scope: nodeScope
) {
  try {
    if (typeof appliedFactor !== "number")
      throw stringError(
        appliedFactor,
        "grande || pequeno || 75g || 150g || saco || lata personalizada"
      );
    if (typeof targBaseValue !== "number")
      throw stringError(
        targBaseValue,
        `bolo caseiro || bolo de festa || torta || palha italiana`
      );
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(`Error validating scope in applyFactorPoductCase`);
    if (typeof refClass !== "string")
      throw typeError(refClass, `validation of refClass argument`, ["string"]);
    if (refClass === "")
      throw stringError(refClass || "nullish", "not an empty string");
    scope.querySelectorAll(refClass).forEach((priceEl, i) => {
      let fitFactor = 1;
      try {
        if (!(scope instanceof HTMLElement))
          throw new Error(
            `Scope not an HTMLElement. Aborting check for Bolo Caseiro cases.`
          );
        const relDlg =
          scope.closest("dialog") || scope.closest(".modal-content");
        if (!(relDlg instanceof HTMLElement))
          throw htmlElementNotFound(relDlg, `validation of closest Modal`);
        if (/bolo/gis.test(relDlg.id) && /caseiro/gis.test(relDlg.id)) {
          if (
            /fit/gis.test(priceEl.classList.toString()) ||
            (priceEl.closest("li") && /fit/gis.test(priceEl.closest("li")!.id))
          )
            fitFactor = 1.1;
        }
      } catch (eB) {
        console.error(
          `Error executing procedure for checking Bolo Caseiro cases:${
            (eB as Error).message
          }`
        );
      }
      try {
        if (!(priceEl instanceof HTMLElement))
          throw htmlElementNotFound(priceEl, `validation of Price Element`, [
            "HTMLElement",
          ]);
        const checkVelvetPrices = () => {
          try {
            if (!(scope instanceof HTMLElement))
              throw typeError(scope, `validation of scope`, ["HTMLElement"]);
            const relDlg =
              scope.closest("dialog") || scope.closest(".modal-content");
            if (!(relDlg instanceof HTMLElement))
              throw htmlElementNotFound(relDlg, `validation of relDlg`);
            if (/bolo/gis.test(relDlg.id) && /caseiro/gis.test(relDlg.id)) {
              const velvetPrices = [
                ...relDlg.querySelectorAll('[id*="Velvet"]'),
                ...relDlg.querySelectorAll('[id*="velvet"]'),
              ].filter(
                el =>
                  el.classList.contains("opSpanPrice") &&
                  el instanceof HTMLElement
              );
              if (velvetPrices.length === 0)
                throw numberError(velvetPrices, `no Velvet price found`);
              velvetPrices.forEach((velvetPrice, v) => {
                try {
                  if (!(velvetPrice instanceof HTMLElement))
                    throw htmlElementNotFound(
                      velvetPrice,
                      `validation of velvetPrice instance`
                    );
                  applyVelvetCase(velvetPrice.id, velvetPrice);
                } catch (e) {
                  console.error(
                    `Error executing iteration ${v} for velvetPrices:\n${
                      (e as Error).message
                    }`
                  );
                }
              });
            }
          } catch (e) {
            console.error(
              `Error executing procedure for fixing Velvet pricing:\n${
                (e as Error).message
              }`
            );
          }
        };
        if (
          priceEl instanceof HTMLInputElement ||
          priceEl instanceof HTMLTextAreaElement
        ) {
          if (!/[0-9]/g.test(priceEl.value))
            throw stringError(priceEl.value, "/[0-9]/g");
          const prevPrice = priceEl.value;
          priceEl.value = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 2,
          }).format(
            parseFinite(
              roundToTenth(
                targBaseValue * appliedFactor * correctionFactor * fitFactor
              )
            )
          );
          checkVelvetPrices();
          if (
            /NaN/gs.test(priceEl.value) ||
            /Infinity/gis.test(priceEl.value)
          ) {
            console.warn(`Applied price string invalidated. Value defaulted.`);
            priceEl.value = prevPrice;
          }
        } else {
          if (!/[0-9]/g.test(priceEl.innerText))
            throw stringError(priceEl.innerText, "/[0-9]/g");
          const prevPrice = priceEl.innerText;
          priceEl.innerText = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 2,
          }).format(
            Math.round(
              parseFinite(
                roundToTenth(
                  targBaseValue * appliedFactor * correctionFactor * fitFactor
                )
              )
            )
          );
          checkVelvetPrices();
          if (
            /NaN/gs.test(priceEl.innerText) ||
            /Infinity/gis.test(priceEl.innerText)
          ) {
            console.warn(`Applied price string invalidated. Value defaulted.`);
            priceEl.innerText = prevPrice;
          }
        }
      } catch (eN) {
        console.error(
          `Error executing iteration ${i} for loop in recalculateByOption:${
            (eN as Error).message
          }`
        );
      }
    });
  } catch (eP) {
    console.error(
      `Error executing routine for applying price factor change based on option event:\n${
        (eP as Error).message
      }`
    );
  }
}

export function applySubOptParam(optRef: voidishHTMLEl): void {
  try {
    if (!(optRef instanceof HTMLElement))
      throw htmlElementNotFound(
        optRef,
        `validation of optRef in applySubOptParam`
      );
    const relSubGroup = optRef.closest(".opSubGroup");
    if (!(relSubGroup instanceof HTMLElement))
      throw htmlElementNotFound(
        relSubGroup,
        `validation of Related Group of Suboptions`
      );
    Array.from(relSubGroup.querySelectorAll('input[type="radio"]')).forEach(
      (radio, i, arr) => {
        try {
          if (!(radio instanceof HTMLInputElement && radio.type === "radio"))
            throw htmlElementNotFound(
              radio,
              `validation of Radio instance and type`,
              ['<input type="radio">']
            );
          if (/&Op-/g.test(location.href)) {
            const subOpParam = location.href
              .slice(location.href.indexOf("&Op-"))
              .replace("&Op-", "")
              .replace("Op-", "")
              .replaceAll("_", "");
            if (new RegExp(subOpParam, "gi").test(radio.value)) {
              for (const otherRadio of arr)
                if (
                  otherRadio instanceof HTMLInputElement &&
                  otherRadio.type === "radio"
                )
                  radio.checked = false;
              radio.checked = true;
              const relMenu = radio.closest("dialog")?.querySelector("menu");
              radio.checked &&
                relMenu &&
                recalculateByOption(".opSpanPrice", relMenu, radio.value);
            }
          }
        } catch (e) {
          console.error(
            `Error executing iteration ${i} for applying url param for suboption:\n${
              (e as Error).message
            }`
          );
        }
      }
    );
  } catch (eP) {
    console.error(
      `Error executing procedure for matching url param for suboption:\n${
        (eP as Error).message
      }`
    );
  }
}

export function roundToTenth(
  num: number,
  multiplier: number = 1,
  fixeds: number = 2,
  up: boolean = false
): string {
  try {
    if (typeof num !== "number")
      throw typeError(num, `validation of num argument for roundToTenth`, [
        "number",
      ]);
    if (typeof multiplier !== "number")
      throw typeError(
        multiplier,
        `validation of multipler argument for roundToTenth`,
        ["number"]
      );
    if (typeof fixeds !== "number")
      throw typeError(
        fixeds,
        `validation of fixeds argument for roundToTenth`,
        ["number"]
      );
    if (typeof up !== "boolean")
      throw typeError(up, `validation of up argument for roundToTenth`, [
        "boolean",
      ]);
    const multiplied = 10 ** multiplier;
    return up
      ? (Math.ceil(num * multiplied) / multiplied).toFixed(fixeds)
      : (Math.floor(num * multiplied) / multiplied).toFixed(fixeds);
  } catch (e) {
    console.error(`Error executing roundToTenth:\n${(e as Error).message}`);
    return num.toFixed(2);
  }
}

export function capitalizeFirstLetter(text: string): string {
  try {
    if (!(typeof text === "string"))
      throw typeError(text, `type of argument for capitalizeFirstLetter`, [
        "string",
      ]);
    text = `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
    return text;
  } catch (e) {
    console.error(
      `Error executing capitalizeFirstLetter:\n${(e as Error).message}`
    );
    return text.toString();
  }
}

export function textTransformPascal(text: string): string {
  try {
    if (!(typeof text === "string"))
      throw typeError(text, `type of argument for capitalizeFirstLetter`, [
        "string",
      ]);
    text = `${text.slice(0, 1).toUpperCase()}${text.slice(1).toLowerCase()}`;
    return text;
  } catch (e) {
    console.error(
      `Error executing capitalizeFirstLetter:\n${(e as Error).message}`
    );
    return text.toString();
  }
}

export function normalizeSpacing(value: string): string {
  try {
    if (typeof value !== "string")
      throw typeError(
        normalizeSpacing,
        `validation of value argument for normalizeSpacing`,
        ["string"]
      );
    return value.replaceAll(",", "_").replaceAll(" ", "_");
  } catch (e) {
    console.error(`Error executing normalizeSpacing:\n${(e as Error).message}`);
    return value;
  }
}

export function attemptRender(
  root: Root,
  parent: voidishHTMLEl,
  ...children: JSX.Element[]
): boolean {
  try {
    if (!(root instanceof Object && "_internalRoot" in root))
      throw typeError(root, `validation of root in attemptRender`, ["Root"]);
    if (!(parent instanceof HTMLElement))
      throw htmlElementNotFound(
        parent,
        `validation of parent argument for attemptRender`,
        ["HTMLElement"]
      );
    if (
      !(
        Array.isArray(children) &&
        children.every(child => "type" in child && "props" in child)
      )
    )
      throw typeError(
        children,
        `validation of children argument for attemptRender`,
        ["JSX.Element[]"]
      );
    if (parent.querySelector(".spinner") || !parent.querySelector("*")) {
      root.render(children);
      return true;
    } else return false;
  } catch (e) {
    console.error(`Error executing attemptRender:\n${(e as Error).message}`);
    return false;
  }
}

export async function testSource(source: string): Promise<boolean> {
  try {
    if (typeof source !== "string")
      throw typeError(source, `validation of source argument in testSource`, [
        "string",
      ]);
    const res = await fetch(source);
    if (!res.ok)
      throw new Error(
        `Error validating source. Used string: ${source}. Status: ${res.status}`
      );
    return true;
  } catch (e) {
    console.error(`Error executing testSource:\n${(e as Error).message}`);
    return false;
  }
}

export function clearURLAfterModal(idf: string): void {
  if (typeof idf !== "string") {
    console.warn(
      `No valid idf argument given to clearURLAfterModal. Aborting process`
    );
    return;
  }
  setTimeout(() => {
    const activeQuery = /\?q=/g.test(location.href)
      ? `${location.href.slice(
          location.href.indexOf("?q="),
          location.href.indexOf("?&")
        )}`
      : "";
    let index = location.href.slice(
      /\?&/g.exec(location.href)?.index || 0
    ).length;
    const prevhRef = location.href;
    if (/\?&/g.test(location.href)) {
      history.pushState({}, "", `${location.href.slice(0, -index)}`);
      if (/\?q=/g.test(prevhRef) && !/\?q=/.test(location.href))
        history.pushState(
          {},
          "",
          `${location.href.slice(0, -index)}${activeQuery}`
        );
    }
  }, 500);
}

export function adjustIdentifiers(scope: nodeScope = document): void {
  try {
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(`Invalid scope passed to adjustIdentifiers`);
    if (scope instanceof HTMLElement)
      [scope, ...scope.querySelectorAll("*")].forEach(el => {
        if (el.id !== "") {
          if (/\s/g.test(el.id)) el.id = normalizeSpacing(el.id);
          if (
            /^[0-9]/g.test(el.id) ||
            el.id.startsWith("+") ||
            el.id.startsWith("~") ||
            el.id.startsWith("-")
          )
            el.id = `_${el.id}`;
          if (/[êéèë]/g.test(el.id)) el.id = el.id.replaceAll(/[êéèë]/g, "e");
          if (/[ÊÉÈË]/g.test(el.id)) el.id = el.id.replaceAll(/[ÊÉÈË]/g, "E");
        }
        if (
          (el instanceof HTMLInputElement ||
            el instanceof HTMLButtonElement ||
            el instanceof HTMLFormElement) &&
          el.name !== ""
        ) {
          if (/\s/g.test(el.name)) el.name = normalizeSpacing(el.name);
          if (/[êéèë]/g.test(el.name))
            el.name = el.name.replaceAll(/[êéèë]/g, "e");
          if (/[ÊÉÈË]/g.test(el.name))
            el.name = el.name.replaceAll(/[ÊÉÈË]/g, "E");
          if (
            /^[0-9]/g.test(el.name) ||
            el.name.startsWith("+") ||
            el.name.startsWith("~") ||
            el.name.startsWith("-")
          )
            el.name = `_${el.name}`;
          el.classList.forEach(classListed => {
            if (/[êéèë]/g.test(classListed)) {
              const fixedClassListed = classListed.replaceAll(/[êéèë]/g, "e");
              el.classList.remove(classListed);
              el.classList.add(fixedClassListed);
            }
            if (/[ÊÉÈË]/g.test(classListed)) {
              const fixedClassListed = classListed.replaceAll(/[ÊÉÈË]/g, "E");
              el.classList.remove(classListed);
              el.classList.add(fixedClassListed);
            }
            if (/\s/g.test(classListed)) {
              const fixedClass = normalizeSpacing(classListed);
              el.classList.remove(fixedClass);
              el.classList.add(fixedClass);
            }
            if (
              /^[0-9]/g.test(classListed) ||
              classListed.startsWith("+") ||
              classListed.startsWith("~") ||
              classListed.startsWith("-")
            ) {
              const fixedClass = `_${classListed}`;
              el.classList.remove(classListed);
              el.classList.add(fixedClass);
            }
          });
        }
      });
    else
      scope.querySelectorAll("*").forEach(el => {
        if (el.id !== "") {
          if (/\s/g.test(el.id)) el.id = normalizeSpacing(el.id);
          if (
            /^[0-9]/g.test(el.id) ||
            el.id.startsWith("+") ||
            el.id.startsWith("~") ||
            el.id.startsWith("-")
          )
            el.id = `_${el.id}`;
        }
        if (
          (el instanceof HTMLInputElement ||
            el instanceof HTMLButtonElement ||
            el instanceof HTMLFormElement) &&
          el.name !== ""
        ) {
          if (/\s/g.test(el.name)) el.name = normalizeSpacing(el.name);
          if (
            /^[0-9]/g.test(el.name) ||
            el.name.startsWith("+") ||
            el.name.startsWith("~") ||
            el.name.startsWith("-")
          )
            el.name = `_${el.name}`;
          el.classList.forEach(classListed => {
            if (/\s/g.test(classListed)) {
              const fixedClass = normalizeSpacing(classListed);
              el.classList.remove(fixedClass);
              el.classList.add(fixedClass);
            }
            if (
              /^[0-9]/g.test(classListed) ||
              classListed.startsWith("+") ||
              classListed.startsWith("~") ||
              classListed.startsWith("-")
            ) {
              const fixedClass = `_${classListed}`;
              el.classList.remove(classListed);
              el.classList.add(fixedClass);
            }
          });
        }
      });
  } catch (e) {
    console.error(
      `Error executing adjustIdentifiers:\n${(e as Error).message}`
    );
  }
}

export function adjustHeadings(refEl: voidishHTMLEl): void {
  try {
    if (!(refEl instanceof HTMLHeadingElement))
      throw htmlElementNotFound(
        refEl,
        `Reference for Heading Element in adjustHeadings`,
        ["HTMLHeadingElement"]
      );
    const attributes: { [k: string]: string } = {};
    for (const attr of refEl.attributes)
      if (attr.name !== "class") attributes[attr.name] = attr.value;
    const headingProps = Object.assign(
      {},
      {
        ...attributes,
        tagName: "",
      }
    );
    let currElement = refEl.parentElement;
    const parentElements: HTMLElement[] = [];
    let safeAcc = 0;
    while (!(currElement instanceof HTMLHtmlElement)) {
      safeAcc = ++safeAcc;
      if (safeAcc > 999) break;
      if (currElement instanceof HTMLElement) {
        parentElements.push(currElement);
        currElement = currElement.parentElement;
      } else break;
    }
    const lowestPrioHeadingNum = parentElements.find(parentEl => {
      switch (parentEl.tagName) {
        case "H5":
          return "H5";
        case "H4":
          return "H4";
        case "H3":
          return "H3";
        case "H2":
          return "H2";
        case "H1":
          return "H1";
        default:
          return undefined;
      }
    });
    if (lowestPrioHeadingNum) {
      switch (lowestPrioHeadingNum.tagName) {
        case "H5":
          const newHeadingh6 = document.createElement("h6");
          newHeadingh6.classList.add(refEl.className);
          refEl.parentElement!.replaceChild(
            refEl,
            Object.assign(newHeadingh6, headingProps)
          );
          break;
        case "H4":
          const newHeadingh5 = document.createElement("h5");
          newHeadingh5.classList.add(refEl.className);
          refEl.parentElement!.replaceChild(
            refEl,
            Object.assign(newHeadingh5, headingProps)
          );
          break;
        case "H3":
          const newHeadingh4 = document.createElement("h4");
          newHeadingh4.classList.add(refEl.className);
          refEl.parentElement!.replaceChild(
            refEl,
            Object.assign(newHeadingh4, headingProps)
          );
          break;
        case "H2":
          const newHeadingh3 = document.createElement("h3");
          newHeadingh3.classList.add(refEl.className);
          refEl.parentElement!.replaceChild(
            refEl,
            Object.assign(newHeadingh3, headingProps)
          );
          break;
        case "H1":
          const newHeadingh2 = document.createElement("h2");
          newHeadingh2.classList.add(refEl.className);
          refEl.parentElement!.replaceChild(
            refEl,
            Object.assign(newHeadingh2, headingProps)
          );
          break;
        default:
          console.warn(`No headings found in the DOM.`);
      }
    }
  } catch (e) {
    console.error(`Error executing adjustHeadings:\n${(e as Error).message}`);
  }
}

export function watchLabels(): void {
  setInterval(() => {
    try {
      for (const label of document.getElementsByTagName("label")) {
        label.dataset[`watched`] = "true";
        let relInp: voidishEl =
          label.querySelector("input") ?? label.querySelector("textarea");
        if (
          !(
            relInp instanceof HTMLInputElement ||
            relInp instanceof HTMLTextAreaElement
          )
        )
          relInp = label.nextElementSibling;
        if (
          !(
            relInp instanceof HTMLInputElement ||
            relInp instanceof HTMLTextAreaElement
          )
        )
          relInp = label.previousElementSibling;
        if (!label.parentElement) return;
        if (
          !(
            relInp instanceof HTMLInputElement ||
            relInp instanceof HTMLTextAreaElement
          )
        )
          relInp =
            label.parentElement.querySelector("input") ??
            label.parentElement.querySelector("textarea");
        if (!relInp) return;
        if (relInp.id === "" && label.htmlFor === "") {
          const labelNum = document.querySelectorAll("label").length;
          relInp.id = `filledInput${labelNum}`;
        }
        if (label.htmlFor !== relInp.id) label.htmlFor = relInp.id;
      }
    } catch (e) {
      console.error(
        `Error executing interval for watchLabels:\n${(e as Error).message}`
      );
    }
  }, 3000);
}

export function syncAriaStates(scope: nodeScope = document): void {
  try {
    if (
      !(
        scope instanceof HTMLElement ||
        scope instanceof Document ||
        scope instanceof DocumentFragment
      )
    )
      throw new Error(`Error validating scope for syncAriaStates`);
    if (scope instanceof Document)
      console.warn(
        `scope passed to syncAriaStates was the documentElement itself. Be sure this is intended.`
      );
    const els = scope.querySelectorAll("*");
    if (
      (Array.isArray(els) || els instanceof NodeList) &&
      els.length > 0 &&
      Array.from(els).every(el => el instanceof Element)
    ) {
      els.forEach(el => {
        if (el instanceof HTMLElement) {
          el.hidden && !el.focus
            ? (el.ariaHidden = "true")
            : (el.ariaHidden = "false");
          el.addEventListener("click", () => {
            el.hidden && !el.focus
              ? (el.ariaHidden = "true")
              : (el.ariaHidden = "false");
          });
          if (el.classList.contains("poCaller")) {
            el.ariaHasPopup = "menu";
          }
          if (
            el instanceof HTMLSelectElement ||
            el instanceof HTMLInputElement ||
            el instanceof HTMLTextAreaElement
          ) {
            if (el instanceof HTMLSelectElement) {
              if (el.querySelectorAll("option").length > 0) {
                el.querySelectorAll("option").forEach(option => {
                  option.selected
                    ? (option.ariaSelected = "true")
                    : (option.ariaSelected = "false");
                });
                el.addEventListener("change", () => {
                  el.querySelectorAll("option").forEach(option => {
                    option.selected
                      ? (option.ariaSelected = "true")
                      : (option.ariaSelected = "false");
                  });
                });
              }
              el.addEventListener("click", () => {
                if (el.ariaExpanded === "false") el.ariaExpanded = "true";
                if (el.ariaExpanded === "true") el.ariaExpanded = "false";
              });
            }
            if (
              el instanceof HTMLInputElement ||
              el instanceof HTMLTextAreaElement
            ) {
              if (el.placeholder && el.placeholder !== "")
                el.ariaPlaceholder = el.placeholder;
              if (el.type !== "radio") {
                el.required
                  ? (el.ariaRequired = "true")
                  : (el.ariaRequired = "false");
                !el.checkValidity()
                  ? (el.ariaInvalid = "true")
                  : (el.ariaInvalid = "false");
              }
              el.closest("form")?.addEventListener("submit", () => {
                if (!el.checkValidity()) {
                  el.ariaInvalid = "true";
                } else {
                  el.ariaInvalid = "false";
                }
              });
              if (
                el instanceof HTMLTextAreaElement ||
                (el instanceof HTMLInputElement &&
                  (el.type === "text" ||
                    el.type === "tel" ||
                    el.type === "email" ||
                    el.type === "number" ||
                    el.type === "date" ||
                    el.type === "time" ||
                    el.type === "password" ||
                    el.type === "search" ||
                    el.type === "month" ||
                    el.type === "week"))
              ) {
                if (
                  el instanceof HTMLInputElement &&
                  el.list &&
                  el.list.id !== ""
                )
                  el.ariaAutoComplete = "list";
                if (
                  el instanceof HTMLInputElement &&
                  (el.type === "number" ||
                    el.type === "date" ||
                    el.type === "time")
                ) {
                  el.ariaValueMax = (el as HTMLInputElement).max;
                  el.ariaValueMin = (el as HTMLInputElement).min;
                }
                if (el instanceof HTMLInputElement && el.type === "range") {
                  el.addEventListener("change", () => {
                    el.ariaValueNow = el.value;
                    el.ariaValueText = el.value;
                  });
                }
              } else if (
                el instanceof HTMLInputElement &&
                (el.type === "radio" || el.type === "checkbox")
              ) {
                el.checked
                  ? (el.ariaChecked = "true")
                  : (el.ariaChecked = "false");
                el.disabled
                  ? (el.ariaDisabled = "true")
                  : (el.ariaDisabled = "false");
                el.addEventListener("change", () => {
                  el.checked
                    ? (el.ariaChecked = "true")
                    : (el.ariaChecked = "false");
                  el.disabled
                    ? (el.ariaDisabled = "true")
                    : (el.ariaDisabled = "false");
                });
              } else if (
                el instanceof HTMLInputElement &&
                (el.type === "button" ||
                  el.type === "submit" ||
                  el.type === "reset")
              ) {
                el.addEventListener("mousedown", click => {
                  if (click.button === 0) el.ariaPressed = "true";
                });
                el.addEventListener("mouseup", release => {
                  if (release.button === 0) el.ariaPressed = "false";
                });
              }
            }
          }
          if (el instanceof HTMLLabelElement) {
            if (el.hasChildNodes() && el.firstChild instanceof Text) {
              el.ariaLabel = el.firstChild.nodeValue;
            }
          }
          if (el instanceof HTMLButtonElement) {
            el.addEventListener("mousedown", click => {
              if (click.button === 0) el.ariaPressed = "true";
            });
            el.addEventListener("mouseup", release => {
              if (release.button === 0) el.ariaPressed = "false";
            });
            if (el.textContent?.match(/consultar/gi)) {
              el.ariaHasPopup = "dialog";
            }
          }
          if (el instanceof HTMLDialogElement) el.ariaModal = "true";
        }
      });
    } else console.warn(`Error executing syncAriaStates`);
  } catch (e) {
    console.error(`Error:${(e as Error).message}`);
  }
}

export function fixModalOpening(idf: string): void {
  try {
    if (typeof idf !== "string")
      throw typeError(idf, `validation of idf argument in fixModalOpening`, [
        "string",
      ]);
    const dialog = document.getElementById(idf);
    if (!(dialog instanceof HTMLDialogElement))
      throw htmlElementNotFound(
        dialog,
        `validation of dialog instance using identificator ${
          idf || "unidentified"
        }`,
        ["HTMLDialogElement"]
      );
    dialog.show();
    dialog.close();
    dialog.style.animation = `dropIn 0.3s ease-out forwards, fadeIn 0.6s ease-in-out forwards`;
    dialog.showModal();
  } catch (e) {
    console.error(`Error executing fixModalOpening:\n${(e as Error).message}`);
  }
}
