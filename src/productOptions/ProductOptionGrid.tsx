import { ProductOptionsProps } from "../declarations/interfaces";
import { useRef, useEffect } from "react";
import {
  nullishBtn,
  nullishLi,
  nullishHTMLEl,
  nullishStrong,
} from "../declarations/types";
import {
  htmlElementNotFound,
  elementNotFound,
  typeError,
  stringError,
  parseFinite,
} from "../handlersErrors";
import {
  adjustIdentifiers,
  applyVelvetCase,
  capitalizeFirstLetter,
  handleOrderAdd,
  handleOrderSubtract,
  normalizeSpacing,
  roundToTenth,
  syncAriaStates,
} from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";

export default function ProductOptionGrid({
  opName,
  price,
  desc,
  _id,
  __id,
  root,
}: ProductOptionsProps): JSX.Element {
  const opNameHifen = opName.replaceAll(" ", "-").replaceAll(",", "-");
  const mainRef = useRef<nullishLi>(null);
  const addRef = useRef<nullishBtn>(null);
  const minusRef = useRef<nullishBtn>(null);
  const descRef = useRef<nullishHTMLEl>(null);
  const priceRef = useRef<nullishHTMLEl>(null);
  const opNameRef = useRef<nullishStrong>(null);
  const idRef = useRef<string | number | undefined>(__id);
  useEffect(() => {
    idRef.current = __id;
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `Main LI Element for product ${_id}${__id}`,
          ["<li>"]
        );
      let productLi = mainRef.current.closest("dialog")?.previousElementSibling;
      if (!(productLi instanceof HTMLLIElement))
        productLi = document.querySelector(
          `[id*="${mainRef.current.id.slice(
            mainRef.current.id.indexOf("__"),
            mainRef.current.id.indexOf("__") + 4
          )}"]`
        );
      if (!(productLi instanceof HTMLLIElement))
        throw htmlElementNotFound(productLi, `Product li Element for type`, [
          "<li>",
        ]);
      if (!mainRef.current.dataset.title)
        throw new Error(
          `Error fetching data-title from li id ${mainRef.current.id}`
        );
      mainRef.current.dataset.title = mainRef.current.dataset.title.replace(
        "unfilled",
        `${
          (productLi.getElementsByClassName("divProductName")[0] as HTMLElement)
            .innerText || "Indefinido"
        } ${opName.toLowerCase()}`
      );
      syncAriaStates(mainRef.current);
    } catch (e) {
      console.error(
        `Error calling useEffect for Main Refect for id ${__id}: ${
          (e as Error).message
        }`
      );
    }
  }, [mainRef, __id, _id, opName]);
  useEffect(() => {
    try {
      if (!(addRef.current instanceof HTMLButtonElement))
        throw elementNotFound(
          addRef.current,
          `current Ref for Adding button for li id ${
            mainRef.current || "UNIDENTIFIED"
          }`,
          ["<button>"]
        );
      if (typeof __id === "number") __id = __id.toString();
      if (typeof __id !== "string")
        throw typeError(
          __id,
          `validating type of __id in ${mainRef.current?.id || "falsish"}`,
          ["string"]
        );
      addRef.current.id = addRef.current.id.replace("unfilled", __id);
      addRef.current.addEventListener(
        "click",
        function (this: HTMLButtonElement, c) {
          handleOrderAdd(
            this || c.currentTarget,
            document.getElementById("total")
          );
        }
      );
    } catch (err) {
      console.error(
        `Error reading addRef in useEffect() for ProductOptionGrid id ${
          mainRef.current?.id || "UNIDENTIFIED"
        }`
      );
    }
  }, [addRef]);
  useEffect(() => {
    try {
      if (!(minusRef.current instanceof HTMLButtonElement))
        throw elementNotFound(
          minusRef.current,
          `current Ref for Removing button for li id ${
            mainRef.current || "UNIDENTIFIED"
          }`,
          ["<button>"]
        );
      if (typeof __id === "number") __id = __id.toString();
      if (typeof __id !== "string")
        throw typeError(
          __id,
          `validating type of __id in ${mainRef.current?.id || "falsish"}`,
          ["string"]
        );
      minusRef.current.id = minusRef.current.id.replace("unfilled", __id);
      minusRef.current.addEventListener(
        "click",
        function (this: HTMLButtonElement, c) {
          handleOrderSubtract(
            this || c.currentTarget,
            document.getElementById("total")
          );
        }
      );
    } catch (err) {
      console.error(
        `Error reading minusRef in useEffect() for ProductOptionGrid id ${
          mainRef.current?.id || "UNIDENTIFIED"
        }`
      );
    }
  }, [minusRef]);
  useEffect(() => {
    try {
      if (!(descRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          descRef.current,
          `Description Element for option id ${_id}`,
          ["HTMLElement"]
        );
      if (/descrição/gi.test(descRef.current.innerText)) {
        console.warn(
          `No description formulated for option id ${_id}. Defaulting message.`
        );
        descRef.current.innerText = `Sem descrição`;
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for descRef:${(e as Error).message}`
      );
    }
  }, [descRef, _id]);
  useEffect(() => {
    try {
      if (!__id) throw stringError(__id?.toString(), "[0-9]{3,}");
      if (!(priceRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          priceRef.current,
          `Price element reference for ${opName || "Unnamed"}`,
          ["HTMLElement"]
        );
      if (
        priceRef.current.innerText === "" ||
        /invalidado/gi.test(priceRef.current.innerText) ||
        /não fornecido/gi.test(priceRef.current.innerText)
      ) {
        //ajuste de preço com base em principal
        const relMainProduct = document.querySelector(
          `li[id$="${__id.toString().slice(0, __id.toString().indexOf("-"))}"]`
        );
        try {
          if (!(relMainProduct instanceof HTMLElement))
            throw htmlElementNotFound(
              relMainProduct,
              `Related main product element`,
              ["HTMLElement"]
            );
          const relMainPrice =
            relMainProduct.querySelector(".divProductPrice") ||
            Array.from(relMainProduct.querySelectorAll("*")).filter(
              element =>
                element instanceof HTMLElement && /R\$/g.test(element.innerText)
            )[0];
          if (!(relMainPrice instanceof HTMLElement))
            throw htmlElementNotFound(
              relMainPrice,
              `Related main product price element`,
              ["HTMLElement"]
            );
          const noIntervalText = relMainPrice.innerText.slice(
            0,
            relMainPrice.innerText.indexOf(" – ")
          );
          const indCashSign = relMainPrice.innerText.slice(
            relMainPrice.innerText.indexOf("$"),
            /[0-9],/g.exec(relMainPrice.innerText)?.index || -1
          );
          priceRef.current.innerText = noIntervalText.padEnd(
            noIntervalText.length + 1 - (indCashSign.length - 2),
            "0"
          );
          if (
            priceRef.current.innerText.slice(
              priceRef.current.innerText.indexOf(",")
            ).length === 2
          ) {
            priceRef.current.innerText += "0";
          }
          if (/preço/gi.test(priceRef.current.innerText)) {
            console.warn(`Price invalidated for option id ${_id}`);
            priceRef.current.innerText = "Indefinido";
          }
          const dlg = priceRef.current.closest("dialog");
          if (dlg && /caseiro/gis.test(dlg.id ?? "")) {
            if (
              /banana/gis.test(priceRef.current.classList.toString()) ||
              (priceRef.current.closest("li") &&
                /banana/gis.test(priceRef.current.closest("li")!.id))
            ) {
              console.log();
            }
          }
          if (
            /fit/gis.test(priceRef.current.classList.toString()) ||
            (priceRef.current.closest("li") &&
              /fit/gis.test(priceRef.current.closest("li")!.id))
          ) {
            priceRef.current.innerText = Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 2,
            }).format(
              Math.round(
                parseFinite(
                  roundToTenth(
                    parseFinite(
                      priceRef.current.innerText.replace("R$", "").trim()
                    ) * 1.1
                  )
                )
              )
            );
          }
        } catch (eP) {
          console.error(
            `Error searching for Related Main Product id ${
              relMainProduct?.id || "Unidentified"
            } in useEffect for ${opName}:\n ${(eP as Error).message}`
          );
        }
      }
      applyVelvetCase(opName, priceRef.current);
    } catch (e) {
      console.error(
        `Error linking option price to main product price:${
          (e as Error).message
        }`
      );
    }
  }, [priceRef, __id, _id, opName]);
  useEffect(() => {
    try {
      if (!(opNameRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          opNameRef.current,
          `validation of Option Name Reference`
        );
      const fontSizeCalc =
        parseFinite(
          getComputedStyle(opNameRef.current).fontSize.replace("px", "").trim()
        ) || 16;
      if (/®/g.test(opNameRef.current.innerText)) {
        if (opNameRef.current.innerText.endsWith("®")) {
          opNameRef.current.innerText = opNameRef.current.innerText.slice(
            0,
            -1
          );
          const brandSpan = Object.assign(document.createElement("span"), {
            innerText: `®`,
          });
          opNameRef.current.style.position = `relative`;
          brandSpan.style.fontSize = `${fontSizeCalc / 1.5}px`;
          if (opNameRef.current.innerText.endsWith("o"))
            brandSpan.style.left = `103%`;
          else if (opNameRef.current.innerText.endsWith("a"))
            brandSpan.style.left = `101%`;
          else brandSpan.style.left = `100%`;
          brandSpan.classList.add(`brandSpan`);
          opNameRef.current.append(brandSpan);
        }
      }
      if (
        opNameRef.current.innerText.slice(0, -1).match("®") &&
        opNameRef.current.innerText.slice(0, -1).match("®")!.length > 0
      ) {
        opNameRef.current.innerText.replace("\n®", "®");
        let iniText = opNameRef.current.innerText;
        const matches = iniText.match(/®/g)!;
        matches.forEach((_, i) => {
          try {
            if (!(opNameRef.current instanceof HTMLElement))
              throw htmlElementNotFound(
                opNameRef.current,
                `validation of Option Name Reference`
              );
            const idx = /®/g.exec(iniText)!.index;
            if (matches.length === 1) {
              const firstSpan = Object.assign(document.createElement("span"), {
                innerText: iniText.slice(0, idx).trim(),
                id: `${normalizeSpacing(iniText.slice(0, idx))}Slice${
                  capitalizeFirstLetter(opNameRef.current.id) ||
                  normalizeSpacing(
                    capitalizeFirstLetter(
                      opNameRef.current.classList.toString()
                    )
                  ) ||
                  capitalizeFirstLetter(opNameRef.current.tagName)
                }`,
              });
              firstSpan.classList.add(
                `brandedNameSpan`,
                `${normalizeSpacing(iniText.slice(0, idx))}Slice`
                  .replaceAll(" ", "_")
                  .replaceAll("\n", "")
              );
              const secondSpan = Object.assign(document.createElement("span"), {
                innerText: iniText.slice(idx + 1).trim(),
                id: `${normalizeSpacing(iniText.slice(idx + 1))}Slice${
                  capitalizeFirstLetter(opNameRef.current.id) ||
                  normalizeSpacing(
                    capitalizeFirstLetter(
                      opNameRef.current.classList.toString()
                    )
                  ) ||
                  capitalizeFirstLetter(opNameRef.current.tagName)
                }`,
              });
              secondSpan.classList.add(
                `brandedNameSpan`,
                `${normalizeSpacing(iniText.slice(idx + 1))}Slice`
                  .replaceAll(" ", "_")
                  .replaceAll("\n", "")
              );
              const brandSpan = Object.assign(document.createElement("span"), {
                innerText: `®`,
              });
              opNameRef.current.style.position = `relative`;
              brandSpan.style.fontSize = `${fontSizeCalc / 1.5}px`;
              brandSpan.classList.add(`brandSpan`);
              iniText = `${iniText
                .replace(firstSpan.innerText, "")
                .replace("®", "")
                .replace(secondSpan.innerText, "")}`;
              opNameRef.current.innerText = `${opNameRef.current.innerText
                .replace(firstSpan.innerText, "")
                .replace("®", "")
                .replace(secondSpan.innerText, "")}`;
              opNameRef.current.append(firstSpan, brandSpan, secondSpan);
            } else if (i === 0) {
              const usedStrings: string[] = [];
              let currString = "",
                startIdx = 0,
                lastIdx = idx;
              for (let j = 0; j < matches.length; j++) {
                const exect = /®/g.exec(
                  opNameRef.current.innerText.slice(startIdx)
                );
                if (exect && j > 0) {
                  let usedIndex = exect.index;
                  lastIdx = usedIndex + lastIdx;
                }
                currString = opNameRef.current.innerText
                  .slice(startIdx, lastIdx + 1)
                  .replace("®", "")
                  .trim();
                if (currString !== "")
                  usedStrings.push(currString.replace("\n", ""));
                startIdx = lastIdx + 1;
              }
              const remainingText = opNameRef.current.innerText
                .slice(lastIdx + 2)
                .trim();
              opNameRef.current.style.position = `relative`;
              opNameRef.current.innerText = ``;
              usedStrings
                .map(usedString => {
                  const currentSpan = Object.assign(
                    document.createElement("span"),
                    {
                      innerText: usedString.trim(),
                      id: `${normalizeSpacing(usedString)}Slice${
                        capitalizeFirstLetter(opNameRef.current!.id) ||
                        normalizeSpacing(
                          capitalizeFirstLetter(
                            opNameRef.current!.classList.toString()
                          )
                        ) ||
                        capitalizeFirstLetter(opNameRef.current!.tagName)
                      }`,
                    }
                  );
                  currentSpan.classList.add(
                    `brandedNameSpan`,
                    `${normalizeSpacing(usedString)}Slice`
                      .replaceAll(" ", "_")
                      .replaceAll("\n", "")
                  );
                  return currentSpan;
                })
                .forEach((usedSpan, k) => {
                  try {
                    if (!(opNameRef.current instanceof HTMLElement))
                      throw htmlElementNotFound(
                        opNameRef.current,
                        `validation of Option Name Reference instance`
                      );
                    const brandSpan = Object.assign(
                      document.createElement("span"),
                      {
                        innerText: `®`,
                      }
                    );
                    brandSpan.style.fontSize = `${fontSizeCalc / 1.5}px`;
                    brandSpan.classList.add(`brandSpan`);
                    if (opNameRef.current?.children.length > 0) {
                      if (
                        opNameRef.current.lastElementChild instanceof
                          HTMLElement &&
                        opNameRef.current.lastElementChild.innerText === "®" &&
                        usedSpan.innerText === "®"
                      )
                        return;
                      opNameRef.current.append(usedSpan, brandSpan);
                    } else opNameRef.current.append(usedSpan, brandSpan);
                  } catch (e) {
                    console.error(
                      `Error executing iteration ${k} for appending usedSpans:\n${
                        (e as Error).message
                      }`
                    );
                  }
                });
              const remainingSpan = Object.assign(
                document.createElement("span"),
                {
                  innerText: remainingText,
                  id: `${normalizeSpacing(remainingText)}Slice${
                    capitalizeFirstLetter(opNameRef.current!.id) ||
                    normalizeSpacing(
                      capitalizeFirstLetter(
                        opNameRef.current!.classList.toString()
                      )
                    ) ||
                    capitalizeFirstLetter(opNameRef.current!.tagName)
                  }`,
                }
              );
              remainingSpan.classList.add(
                `brandedNameSpan`,
                `${normalizeSpacing(remainingText)}Slice`
                  .replaceAll(" ", "_")
                  .replaceAll("\n", "")
              );
              opNameRef.current.append(remainingSpan);
              Array.from(opNameRef.current.childNodes)
                .filter(child => child instanceof Text)
                .forEach(child => {
                  child.textContent === "®" && child.remove();
                });
              Array.from(opNameRef.current.children)
                .filter(
                  child =>
                    child instanceof HTMLElement &&
                    !child.classList.contains(".brandSpan")
                )
                .forEach(child => {
                  if (child.textContent && /®/g.test(child.textContent))
                    child.textContent.replaceAll("®", "");
                });
            }
          } catch (e) {
            console.error(
              `Error executing iteration ${i} for cicle of matches during brand span creation:\n${
                (e as Error).message
              }`
            );
          }
        });
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for opNameRef:\n${(e as Error).message}`
      );
    }
  }, [opNameRef]);
  useEffect(() => {
    adjustIdentifiers(mainRef.current);
  }, []);
  return (
    <li
      key={`#${opNameHifen}`}
      className={`opLi opLi-${opNameHifen}${__id}`}
      id={`li-${opNameHifen}${__id}`}
      ref={mainRef}
      data-title={`unfilled`}
    >
      <ErrorBoundary
        FallbackComponent={() => (
          <GenericErrorComponent
            message={`Erro carregando informações sobre ${
              opNameHifen || `Nome indefinido`
            }`}
            altJsx={
              <ProductOptionGrid
                opName={opName}
                desc={desc}
                price={price}
                root={root}
                _id={_id}
              />
            }
            altRoot={root}
          />
        )}
      >
        <div
          className={`fade-in-mid opLiDiv opInfoDiv opInfoDiv-${opNameHifen}`}
        >
          <strong
            className={`opSpan opSpanName opSpan-${opNameHifen}`}
            id={`${opNameHifen}-title`}
            ref={opNameRef}
          >
            {opName || `Nome indefinido`}
          </strong>
          <span
            className={`opSpan opSpanDesc opSpan-${opNameHifen}`}
            ref={descRef}
            id={`${opNameHifen}-desc`}
          >
            {desc || `Descrição não fornecida`}
          </span>
          <span
            className={`opSpan opSpanPrice opSpan-${opNameHifen}`}
            ref={priceRef}
            id={`${opNameHifen}-price`}
          >
            {price || `Preço não fornecido`}
          </span>
        </div>
        <div
          className={`fade-in-late opLiDiv opBtnsDiv opBtnsDiv-${opNameHifen}`}
          id={`${opNameHifen}-btnsDiv`}
        >
          <span className="addAlert" id={`addAlert${__id}`}>
            Item adicionado!
          </span>
          <button
            type="button"
            className={`biBtn opBtn opBtnAdd opBtn-${opNameHifen} opBtnAdd-${opNameHifen}`}
            id="btnAddunfilled"
            ref={addRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-square-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="
              M2 0
              a 2 2 0 0 0-2 2
              v12
              a 2 2 0 0 0 2 2
              h12
              a 2 2 0 0 0 2-2
              V2
              a 2 2 0 0 0-2-2
              zm6.5 4.5
              v3
              h3
              a .5 .5 0 0 1 0 1
              h-3
              v3
              a .5 .5 0 0 1-1 0
              v-3
              h-3
              a .5 .5 0 0 1 0-1
              h3
              v-3
              a .5 .5 0 0 1 1 0"
              />
              {/* 
              M = Ponto-inicial x y
              a = Arco raio_x raio_y rotacao tamanho_flag varredura_flag final_y final_x
              v = Vertical-relativa y
              h = Horizontal-relativa x
              V = Vertical-absoluta y
              zm = Movimento-continuo x y
              */}
            </svg>
          </button>
          <span className="minusAlert" id={`minusAlert${__id}`}>
            Item removido!
          </span>
          <button
            type="button"
            className={`biBtn opBtn opBtnRemove opBtn-${opNameHifen} opBtnRemove-${opNameHifen}`}
            id="btnSubtunfilled"
            ref={minusRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-dash-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" />
            </svg>
          </button>
          <span className="errorAlert"></span>
        </div>
      </ErrorBoundary>
    </li>
  );
}
