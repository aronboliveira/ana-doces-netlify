import { useEffect, useRef, useState } from "react";
import { nullishDlg, nullishInp } from "../declarations/types";
import {
  applySubOptParam,
  clearURLAfterModal,
  fixModalOpening,
  handleOrderAdd,
  handleOrderSubtract,
  isClickOutside,
  normalizeSpacing,
  recalculateByOption,
} from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";

export default function CookiesMiniHC(): JSX.Element {
  const optionsRef = useRef<nullishDlg>(null);
  const defOptRef = useRef<nullishInp>(null);
  const [shouldShowOptions, setOptions] = useState(true);
  useEffect(() => {
    const handleKeyPress = (press: KeyboardEvent) => {
      if (press.key === "Escape") {
        setOptions && setOptions(!shouldShowOptions);
        if (optionsRef.current) {
          shouldShowOptions
            ? optionsRef.current?.showModal()
            : optionsRef.current?.close();
          optionsRef.current.closest(".contDlg")?.remove() ||
            optionsRef.current.remove();
        }
      }
    };
    addEventListener("keydown", (press) => handleKeyPress(press));
    return () => removeEventListener("keydown", handleKeyPress);
  }, [shouldShowOptions]);
  useEffect(() => {
    try {
      if (!(optionsRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          optionsRef.current,
          `validation of Options Reference Modal`
        );
      shouldShowOptions && optionsRef.current.showModal();
      optionsRef.current.querySelectorAll(".opBtnAdd").forEach((addBtn) => {
        addBtn.addEventListener("click", function (this: HTMLButtonElement, c) {
          handleOrderAdd(
            this || c.currentTarget,
            document.getElementById("total")
          );
        });
      });
      optionsRef.current.querySelectorAll(".opBtnRemove").forEach((addBtn) => {
        addBtn.addEventListener("click", function (this: HTMLButtonElement, c) {
          handleOrderSubtract(
            this || c.currentTarget,
            document.getElementById("total")
          );
        });
      });
    } catch (e) {
      console.error(
        `Error executing useEffect for optionsRef:\n${(e as Error).message}`
      );
      setTimeout(() => {
        try {
          if (!(optionsRef.current instanceof HTMLDialogElement))
            throw htmlElementNotFound(
              optionsRef.current,
              `validation of Active Options Dialog`,
              ["HTMLDialogElement"]
            );
          fixModalOpening(optionsRef.current.id);
        } catch (e) {
          console.error(
            `Error executing call for fixModalOpening:\n${(e as Error).message}`
          );
        }
      }, 300);
    }
  }, [optionsRef, shouldShowOptions]);
  useEffect(() => {
    const optionsId = optionsRef.current?.id || "unidentified";
    return () => clearURLAfterModal(optionsId);
  }, []);
  useEffect(() => {
    try {
      if (
        !(
          defOptRef.current instanceof HTMLInputElement &&
          (defOptRef.current.type === "radio" ||
            defOptRef.current.type === "checkbox")
        )
      )
        throw htmlElementNotFound(
          defOptRef.current,
          `Validation of Default Option`,
          ['<input type="radio"> || <input type="checkbox">']
        );
      defOptRef.current.checked = true;
      applySubOptParam(defOptRef.current);
    } catch (e) {
      console.error(`Error:${(e as Error).message}`);
    }
  }, [defOptRef]);
  useEffect(() => {
    const handlePopState = (): void => {
      const idRef = optionsRef.current?.id || "dialog";
      optionsRef.current?.close();
      setOptions && setOptions(false);
      history.pushState(
        {},
        "",
        location.href
          .slice(
            0,
            /\?&/g.test(location.href)
              ? location.href.indexOf("?&")
              : location.href.length
          )
          .replace("/h?", "/html?")
      );
      const allDialogs: string[] = [];
      setTimeout(() => {
        document.querySelectorAll(idRef).forEach((ref) => {
          if (ref.id !== "") allDialogs.push(ref.id);
          else if (ref instanceof HTMLDialogElement) allDialogs.push("dialog");
          ref instanceof HTMLDialogElement && ref.close();
          setOptions && setOptions(false);
        });
      }, 300);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          currentRef instanceof HTMLElement && currentRef.remove();
        }
      }, 500);
    };
    addEventListener("popstate", handlePopState);
    return () => removeEventListener("popstate", handlePopState);
  }, [shouldShowOptions]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message={"Erro carregando janela modal!"} />
      )}
    >
      {shouldShowOptions && (
        <dialog
          className="modal-content"
          id="div-Mini-Cookie-—-conjunto__07-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branco"
          ref={optionsRef}
          onClick={(click) => {
            if (
              isClickOutside(click, optionsRef.current!).some(
                (coord) => coord === true
              )
            ) {
              setOptions && setOptions(!shouldShowOptions);
              if (optionsRef.current) {
                shouldShowOptions
                  ? optionsRef.current.showModal()
                  : optionsRef.current.close();
                optionsRef.current.closest(".contDlg")?.remove() ||
                  optionsRef.current.remove();
              }
            }
          }}
        >
          <nav className="menuOpNav fade-in" aria-hidden="false">
            <div className="flNoW menuOpMainDiv" aria-hidden="false">
              <h2 className="menuOpH" aria-hidden="false">
                <span aria-hidden="false">Opções — </span>
                <span aria-hidden="false">Mini Cookie — conjunto</span>
              </h2>
              <button
                className="fade-in-mid btn btn-close"
                aria-hidden="false"
                onClick={() => {
                  setOptions && setOptions(!shouldShowOptions);
                  if (optionsRef.current) {
                    shouldShowOptions
                      ? optionsRef.current?.showModal()
                      : optionsRef.current?.close();
                    optionsRef.current.closest(".contDlg")?.remove() ||
                      optionsRef.current.remove();
                  }
                }}
              ></button>
            </div>
            <div
              className="opGroup"
              id="contmainMenu_Saco-Lata_personalizada"
              aria-hidden="false"
            >
              <div
                className="opSubGroup form-check"
                id="contmainMenu_Saco-Lata_personalizada"
                aria-hidden="false"
              >
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Saco0Lab"
                  id="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Saco0Lab"
                  aria-hidden="false"
                >
                  <input
                    ref={defOptRef}
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="saco"
                    name="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Saco0Inp"
                    id="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Saco0Inp"
                    aria-hidden="false"
                    aria-checked="true"
                    aria-disabled="false"
                    onClick={(ev) => {
                      if (ev.currentTarget.checked) {
                        try {
                          if (!(ev.currentTarget instanceof HTMLInputElement))
                            throw new Error(
                              `Error validating instance for Event Target. Obtained instance: ${
                                (ev.currentTarget as any).constructor.name
                              }`
                            );
                          const relMenu = ev.currentTarget.closest("nav");
                          if (!(relMenu instanceof HTMLElement))
                            throw htmlElementNotFound(
                              relMenu,
                              `validation of relMenu for ${
                                ev.currentTarget.id ||
                                `${ev.currentTarget.tagName} type "${ev.currentTarget.type}"`
                              }`,
                              ["HTMLMenuElement"]
                            );
                          recalculateByOption(
                            ".opSpanPrice",
                            relMenu,
                            ev.currentTarget.value
                          );
                        } catch (e) {
                          console.error(
                            `Error executing callback for ${ev.type} during ${
                              ev.timeStamp
                            }:${(e as Error).message}`
                          );
                        }
                        try {
                          if (ev.currentTarget.type === "radio") {
                            const normalizedValue = normalizeSpacing(
                              ev.currentTarget.value
                            );
                            const activeOp = /&Op-/g.test(location.href)
                              ? location.href.slice(
                                  location.href.indexOf("&Op-")
                                )
                              : "";
                            history.pushState(
                              {},
                              "",
                              location.href.replaceAll(activeOp, "")
                            );
                            ev.currentTarget.checked
                              ? history.pushState(
                                  {},
                                  "",
                                  `${location.href}&Op-${normalizedValue}`
                                )
                              : history.pushState(
                                  {},
                                  "",
                                  `${location.href}`.replaceAll(
                                    `&Op-${normalizedValue}`,
                                    ""
                                  )
                                );
                          }
                        } catch (e2) {
                          console.error(
                            `Error executing procedure for adding url param about suboption:\n${
                              (e2 as Error).message
                            }`
                          );
                        }
                      }
                    }}
                  />
                  <span className="subopText" aria-hidden="false">
                    Saco
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Lata personalizada1Lab"
                  id="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Lata personalizada1Lab"
                  aria-hidden="false"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="lata personalizada"
                    name="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Saco0Inp"
                    id="contmainMenu_Saco-Lata_personalizada-Baunilha_com_gotas_de_chocolate-Chocolatudo-Red_Velvet_com_gotas_de_chocolate_branc-Lata personalizada1Inp"
                    aria-hidden="false"
                    aria-checked="false"
                    aria-disabled="false"
                    onClick={(ev) => {
                      if (ev.currentTarget.checked) {
                        try {
                          if (!(ev.currentTarget instanceof HTMLInputElement))
                            throw new Error(
                              `Error validating instance for Event Target. Obtained instance: ${
                                (ev.currentTarget as any).constructor.name
                              }`
                            );
                          const relMenu = ev.currentTarget.closest("nav");
                          if (!(relMenu instanceof HTMLElement))
                            throw htmlElementNotFound(
                              relMenu,
                              `validation of relMenu for ${
                                ev.currentTarget.id ||
                                `${ev.currentTarget.tagName} type "${ev.currentTarget.type}"`
                              }`,
                              ["HTMLMenuElement"]
                            );
                          recalculateByOption(
                            ".opSpanPrice",
                            relMenu,
                            ev.currentTarget.value
                          );
                        } catch (e) {
                          console.error(
                            `Error executing callback for ${ev.type} during ${
                              ev.timeStamp
                            }:${(e as Error).message}`
                          );
                        }
                        try {
                          if (ev.currentTarget.type === "radio") {
                            const normalizedValue = normalizeSpacing(
                              ev.currentTarget.value
                            );
                            const activeOp = /&Op-/g.test(location.href)
                              ? location.href.slice(
                                  location.href.indexOf("&Op-")
                                )
                              : "";
                            history.pushState(
                              {},
                              "",
                              location.href.replaceAll(activeOp, "")
                            );
                            ev.currentTarget.checked
                              ? history.pushState(
                                  {},
                                  "",
                                  `${location.href}&Op-${normalizedValue}`
                                )
                              : history.pushState(
                                  {},
                                  "",
                                  `${location.href}`.replaceAll(
                                    `&Op-${normalizedValue}`,
                                    ""
                                  )
                                );
                          }
                        } catch (e2) {
                          console.error(
                            `Error executing procedure for adding url param about suboption:\n${
                              (e2 as Error).message
                            }`
                          );
                        }
                      }
                    }}
                  />
                  <span className="subopText" aria-hidden="false">
                    Lata personalizada
                  </span>
                </label>
              </div>
            </div>
            <menu className="menuOpMenu" aria-hidden="false">
              <SearchBar />
              <li
                className="opLi opLi-Baunilha-com-gotas-de-chocolate__07-001"
                id="li-Baunilha-com-gotas-de-chocolate__07-001"
                data-title="Mini cookie — conjunto baunilha com gotas de chocolate"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Baunilha-com-gotas-de-chocolate"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Baunilha-com-gotas-de-chocolate"
                    id="Baunilha-com-gotas-de-chocolate-title"
                    aria-hidden="false"
                  >
                    Baunilha com gotas de chocolate
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Baunilha-com-gotas-de-chocolate"
                    id="Baunilha-com-gotas-de-chocolate-desc"
                    aria-hidden="false"
                  >
                    O aroma doce e convidativo da baunilha combinado com o
                    acento marcante de gotas de chocolate ao leite em um doce
                    inconfundível!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Baunilha-com-gotas-de-chocolate"
                    id="Baunilha-com-gotas-de-chocolate-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Baunilha-com-gotas-de-chocolate"
                  id="Baunilha-com-gotas-de-chocolate-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__07-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Baunilha-com-gotas-de-chocolate opBtnAdd-Baunilha-com-gotas-de-chocolate"
                    id="btnAdd__07-001"
                    aria-hidden="false"
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
                      ></path>
                    </svg>
                  </button>
                  <span
                    className="minusAlert"
                    id="minusAlert__07-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Baunilha-com-gotas-de-chocolate opBtnRemove-Baunilha-com-gotas-de-chocolate"
                    id="btnSubt__07-001"
                    aria-hidden="false"
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
                  <span className="errorAlert" aria-hidden="false"></span>
                </div>
              </li>
              <li
                className="opLi opLi-Chocolatudo__07-002"
                id="li-Chocolatudo__07-002"
                data-title="Mini cookie — conjunto chocolatudo"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolatudo"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolatudo"
                    id="Chocolatudo-title"
                    aria-hidden="false"
                  >
                    Chocolatudo
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolatudo"
                    id="Chocolatudo-desc"
                    aria-hidden="false"
                  >
                    Dose dupla de chocolate preto meio-amargo, na massa e no
                    recheio, para os amantes da intensidade!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolatudo"
                    id="Chocolatudo-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolatudo"
                  id="Chocolatudo-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__07-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolatudo opBtnAdd-Chocolatudo"
                    id="btnAdd__07-002"
                    aria-hidden="false"
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
                      ></path>
                    </svg>
                  </button>
                  <span
                    className="minusAlert"
                    id="minusAlert__07-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolatudo opBtnRemove-Chocolatudo"
                    id="btnSubt__07-002"
                    aria-hidden="false"
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
                  <span className="errorAlert" aria-hidden="false"></span>
                </div>
              </li>
              <li
                className="opLi opLi-Red-Velvet-com-gotas-de-chocolate-branco__07-003"
                id="li-Red-Velvet-com-gotas-de-chocolate-branco__07-003"
                data-title="Mini cookie — conjunto red velvet com gotas de chocolate branco"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Red-Velvet-com-gotas-de-chocolate-branco"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Red-Velvet-com-gotas-de-chocolate-branco"
                    id="Red-Velvet-com-gotas-de-chocolate-branco-title"
                    aria-hidden="false"
                  >
                    Red Velvet com gotas de chocolate branco
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Red-Velvet-com-gotas-de-chocolate-branco"
                    id="Red-Velvet-com-gotas-de-chocolate-branco-desc"
                    aria-hidden="false"
                  >
                    O sabor marcante do Red Velvet em combinação com o acento de
                    intensidade do chocolate branco, para um sabor equilibrado e
                    doçura na medida.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Red-Velvet-com-gotas-de-chocolate-branco"
                    id="Red-Velvet-com-gotas-de-chocolate-branco-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet-com-gotas-de-chocolate-branco"
                  id="Red-Velvet-com-gotas-de-chocolate-branco-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__07-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Red-Velvet-com-gotas-de-chocolate-branco opBtnAdd-Red-Velvet-com-gotas-de-chocolate-branco"
                    id="btnAdd__07-003"
                    aria-hidden="false"
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
                      ></path>
                    </svg>
                  </button>
                  <span
                    className="minusAlert"
                    id="minusAlert__07-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Red-Velvet-com-gotas-de-chocolate-branco opBtnRemove-Red-Velvet-com-gotas-de-chocolate-branco"
                    id="btnSubt__07-003"
                    aria-hidden="false"
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
                  <span className="errorAlert" aria-hidden="false"></span>
                </div>
              </li>
            </menu>
          </nav>
        </dialog>
      )}
    </ErrorBoundary>
  );
}
