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
import { createRoot } from "react-dom/client";

export default function BoloCaseiroHC(): JSX.Element {
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
        console.log("attempting recover...");
        try {
          if (!(optionsRef.current instanceof HTMLDialogElement))
            throw htmlElementNotFound(
              optionsRef.current,
              `validation of Active Options Dialog`,
              ["HTMLDialogElement"]
            );
          console.log("calling fix...");
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
          if (ref.id !== "") allDialogs.push(`#${ref.id}`);
          else if (ref instanceof HTMLDialogElement) allDialogs.push("dialog");
          ref instanceof HTMLDialogElement && ref.close();
          setOptions && setOptions(false);
        });
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          if (currentRef instanceof HTMLDialogElement) {
            currentRef.close();
            currentRef.open = false;
            setOptions && setOptions(false);
          }
        }
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          if (currentRef instanceof HTMLDialogElement) {
            dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: innerWidth * 0.9,
                clientY: innerHeight * 0.5,
              })
            );
          }
        }
        document.querySelectorAll(".contDlg").forEach((contDlg) => {
          createRoot(contDlg).unmount();
        });
        document.querySelectorAll(".contDlg").forEach((contDlg) => {
          contDlg.remove();
        });
      }, 200);
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
          id="div-Bolo-Caseiro__01-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velvet"
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
                <span aria-hidden="false">Bolo Caseiro</span>
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
              id="contmainMenu_Pequeno-Grande"
              aria-hidden="false"
            >
              <div
                className="opSubGroup form-check"
                id="contmainMenu_Pequeno-Grande"
                aria-hidden="false"
              >
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Pequeno0Inp"
                  id="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Pequeno0Lab"
                  aria-hidden="false"
                  data-watched="true"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="pequeno"
                    name="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Pequeno0Inp"
                    id="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Pequeno0Inp"
                    aria-hidden="false"
                    aria-checked="true"
                    aria-disabled="false"
                    ref={defOptRef}
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
                    Pequeno
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Grande1Inp"
                  id="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Grande1Lab"
                  aria-hidden="false"
                  data-watched="true"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="grande"
                    name="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Pequeno0Inp"
                    id="contmainMenu_Pequeno-Grande-Banana-Banana_Fit-Café-Cenoura-Cenoura_Fit-Chocolate-Chocolate_Fit-Coco-Formigueiro-Laranja-Limão-Limão_Fit-Maçã_Fit-Milho-Morango-Red_Velve-Grande1Inp"
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
                    Grande
                  </span>
                </label>
              </div>
            </div>
            <menu className="menuOpMenu" aria-hidden="false">
              <SearchBar />
              <li
                className="opLi opLi-Banana__01-001"
                id="li-Banana__01-001"
                data-title="Bolo caseiro banana"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Banana"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Banana"
                    id="Banana-title"
                    aria-hidden="false"
                  >
                    Banana
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Banana"
                    id="Banana-desc"
                    aria-hidden="false"
                  >
                    Úmido e perfumado, perfeito para acompanhar um café da
                    tarde! Feita com massa integral.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Banana"
                    id="Banana-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banana"
                  id="Banana-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Banana opBtnAdd-Banana"
                    id="btnAdd__01-001"
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
                    id="minusAlert__01-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Banana opBtnRemove-Banana"
                    id="btnSubt__01-001"
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
                className="opLi opLi-Banana-Fit__01-002"
                id="li-Banana-Fit__01-002"
                data-title="Bolo caseiro banana fit"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Banana-Fit"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Banana-Fit"
                    id="Banana-Fit-title"
                    aria-hidden="false"
                  >
                    Banana Fit
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Banana-Fit"
                    id="Banana-Fit-desc"
                    aria-hidden="false"
                  >
                    Versão com uso de Adoçantes e Farelo de Aveia. Ideal para
                    sobremesas mais balanceadas!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Banana-Fit"
                    id="Banana-Fit-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;50,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banana-Fit"
                  id="Banana-Fit-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Banana-Fit opBtnAdd-Banana-Fit"
                    id="btnAdd__01-002"
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
                    id="minusAlert__01-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Banana-Fit opBtnRemove-Banana-Fit"
                    id="btnSubt__01-002"
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
                className="opLi opLi-Café__01-003"
                id="li-Cafe__01-003"
                data-title="Bolo caseiro café"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Café"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Café"
                    id="Cafe-title"
                    aria-hidden="false"
                  >
                    Café
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Café"
                    id="Cafe-desc"
                    aria-hidden="false"
                  >
                    Intenso e aconchegante, ideal para acompanhar qualquer
                    lanche.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Café"
                    id="Cafe-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Café"
                  id="Cafe-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Café opBtnAdd-Café"
                    id="btnAdd__01-003"
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
                    id="minusAlert__01-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Café opBtnRemove-Café"
                    id="btnSubt__01-003"
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
                className="opLi opLi-Cenoura__01-004"
                id="li-Cenoura__01-004"
                data-title="Bolo caseiro cenoura"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Cenoura"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Cenoura"
                    id="Cenoura-title"
                    aria-hidden="false"
                  >
                    Cenoura
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Cenoura"
                    id="Cenoura-desc"
                    aria-hidden="false"
                  >
                    Clássico, macio e saboroso, com a sensação de receita de
                    família!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Cenoura"
                    id="Cenoura-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Cenoura"
                  id="Cenoura-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Cenoura opBtnAdd-Cenoura"
                    id="btnAdd__01-004"
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
                    id="minusAlert__01-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Cenoura opBtnRemove-Cenoura"
                    id="btnSubt__01-004"
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
                className="opLi opLi-Cenoura-Fit__01-005"
                id="li-Cenoura-Fit__01-005"
                data-title="Bolo caseiro cenoura fit"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Cenoura-Fit"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Cenoura-Fit"
                    id="Cenoura-Fit-title"
                    aria-hidden="false"
                  >
                    Cenoura Fit
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Cenoura-Fit"
                    id="Cenoura-Fit-desc"
                    aria-hidden="false"
                  >
                    Versão substituindo o Açúcar por Adoçantes e Manteiga por
                    Óleos vegetais.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Cenoura-Fit"
                    id="Cenoura-Fit-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;50,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Cenoura-Fit"
                  id="Cenoura-Fit-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Cenoura-Fit opBtnAdd-Cenoura-Fit"
                    id="btnAdd__01-005"
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
                    id="minusAlert__01-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Cenoura-Fit opBtnRemove-Cenoura-Fit"
                    id="btnSubt__01-005"
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
                className="opLi opLi-Chocolate__01-006"
                id="li-Chocolate__01-006"
                data-title="Bolo caseiro chocolate"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate"
                    id="Chocolate-title"
                    aria-hidden="false"
                  >
                    Chocolate
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate"
                    id="Chocolate-desc"
                    aria-hidden="false"
                  >
                    Rico, indulgente e sempre certeiro! Uma verdadeira tentação
                    para qualquer hora.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate"
                    id="Chocolate-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate"
                  id="Chocolate-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-006"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate opBtnAdd-Chocolate"
                    id="btnAdd__01-006"
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
                    id="minusAlert__01-006"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate opBtnRemove-Chocolate"
                    id="btnSubt__01-006"
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
                className="opLi opLi-Chocolate-Fit__01-007"
                id="li-Chocolate-Fit__01-007"
                data-title="Bolo caseiro chocolate fit"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-Fit"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-Fit"
                    id="Chocolate-Fit-title"
                    aria-hidden="false"
                  >
                    Chocolate Fit
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-Fit"
                    id="Chocolate-Fit-desc"
                    aria-hidden="false"
                  >
                    Intenso sabor preservando o equilíbrio nutricional! Feito
                    com Cacau em pó e substituindo a Manteiga por Óleos
                    vegetais.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-Fit"
                    id="Chocolate-Fit-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;50,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-Fit"
                  id="Chocolate-Fit-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-007"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-Fit opBtnAdd-Chocolate-Fit"
                    id="btnAdd__01-007"
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
                    id="minusAlert__01-007"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-Fit opBtnRemove-Chocolate-Fit"
                    id="btnSubt__01-007"
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
                className="opLi opLi-Coco__01-008"
                id="li-Coco__01-008"
                data-title="Bolo caseiro coco"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Coco"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Coco"
                    id="Coco-title"
                    aria-hidden="false"
                  >
                    Coco
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Coco"
                    id="Coco-desc"
                    aria-hidden="false"
                  >
                    Leve, fofo e com toques de fibra vegetal, é a dose perfeita
                    de doçura tropical.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Coco"
                    id="Coco-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Coco"
                  id="Coco-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-008"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Coco opBtnAdd-Coco"
                    id="btnAdd__01-008"
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
                    id="minusAlert__01-008"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Coco opBtnRemove-Coco"
                    id="btnSubt__01-008"
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
                className="opLi opLi-Formigueiro__01-009"
                id="li-Formigueiro__01-009"
                data-title="Bolo caseiro formigueiro"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Formigueiro"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Formigueiro"
                    id="Formigueiro-title"
                    aria-hidden="false"
                  >
                    Formigueiro
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Formigueiro"
                    id="Formigueiro-desc"
                    aria-hidden="false"
                  >
                    Equilibrando suavidade com toques de intensidade do
                    chocolate meio-amargo, sempre uma boa opção!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Formigueiro"
                    id="Formigueiro-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Formigueiro"
                  id="Formigueiro-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-009"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Formigueiro opBtnAdd-Formigueiro"
                    id="btnAdd__01-009"
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
                    id="minusAlert__01-009"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Formigueiro opBtnRemove-Formigueiro"
                    id="btnSubt__01-009"
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
                className="opLi opLi-Laranja__01-010"
                id="li-Laranja__01-010"
                data-title="Bolo caseiro laranja"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Laranja"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Laranja"
                    id="Laranja-title"
                    aria-hidden="false"
                  >
                    Laranja
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Laranja"
                    id="Laranja-desc"
                    aria-hidden="false"
                  >
                    Fresco e cítrico, uma fatia cheia de sabor e frescor com
                    intensidade certeira.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Laranja"
                    id="Laranja-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Laranja"
                  id="Laranja-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-010"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Laranja opBtnAdd-Laranja"
                    id="btnAdd__01-010"
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
                    id="minusAlert__01-010"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Laranja opBtnRemove-Laranja"
                    id="btnSubt__01-010"
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
                className="opLi opLi-Limão__01-011"
                id="li-Limão__01-011"
                data-title="Bolo caseiro limão"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Limão"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Limão"
                    id="Limão-title"
                    aria-hidden="false"
                  >
                    Limão
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Limão"
                    id="Limão-desc"
                    aria-hidden="false"
                  >
                    Ácido e doce na medida certa, um deleite provocante!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Limão"
                    id="Limão-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Limão"
                  id="Limão-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-011"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Limão opBtnAdd-Limão"
                    id="btnAdd__01-011"
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
                    id="minusAlert__01-011"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Limão opBtnRemove-Limão"
                    id="btnSubt__01-011"
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
                className="opLi opLi-Limão-Fit__01-012"
                id="li-Limão-Fit__01-012"
                data-title="Bolo caseiro limão fit"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Limão-Fit"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Limão-Fit"
                    id="Limão-Fit-title"
                    aria-hidden="false"
                  >
                    Limão Fit
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Limão-Fit"
                    id="Limão-Fit-desc"
                    aria-hidden="false"
                  >
                    Versão utilizando Adoçantes no lugar de Açúcar, para
                    refeições mais equilibradas.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Limão-Fit"
                    id="Limão-Fit-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;50,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Limão-Fit"
                  id="Limão-Fit-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-012"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Limão-Fit opBtnAdd-Limão-Fit"
                    id="btnAdd__01-012"
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
                    id="minusAlert__01-012"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Limão-Fit opBtnRemove-Limão-Fit"
                    id="btnSubt__01-012"
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
                className="opLi opLi-Maçã-Fit__01-013"
                id="li-Maçã-Fit__01-013"
                data-title="Bolo caseiro maçã fit"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Maçã-Fit"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Maçã-Fit"
                    id="Maçã-Fit-title"
                    aria-hidden="false"
                  >
                    Maçã Fit
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Maçã-Fit"
                    id="Maçã-Fit-desc"
                    aria-hidden="false"
                  >
                    Versão com Farelo de Aveia e substituindo Adoçantes no lugar
                    de Açúcar
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Maçã-Fit"
                    id="Maçã-Fit-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;50,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maçã-Fit"
                  id="Maçã-Fit-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-013"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Maçã-Fit opBtnAdd-Maçã-Fit"
                    id="btnAdd__01-013"
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
                    id="minusAlert__01-013"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Maçã-Fit opBtnRemove-Maçã-Fit"
                    id="btnSubt__01-013"
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
                className="opLi opLi-Milho__01-014"
                id="li-Milho__01-014"
                data-title="Bolo caseiro milho"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Milho"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Milho"
                    id="Milho-title"
                    aria-hidden="false"
                  >
                    Milho
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Milho"
                    id="Milho-desc"
                    aria-hidden="false"
                  >
                    Cremoso e reconfortante, um clássico com sabor de casa.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Milho"
                    id="Milho-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Milho"
                  id="Milho-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-014"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Milho opBtnAdd-Milho"
                    id="btnAdd__01-014"
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
                    id="minusAlert__01-014"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Milho opBtnRemove-Milho"
                    id="btnSubt__01-014"
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
                className="opLi opLi-Morango__01-015"
                id="li-Morango__01-015"
                data-title="Bolo caseiro morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Morango"
                    id="Morango-title"
                    aria-hidden="false"
                  >
                    Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Morango"
                    id="Morango-desc"
                    aria-hidden="false"
                  >
                    Suculento e doce, uma celebração de frescor e suavidade.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Morango"
                    id="Morango-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango"
                  id="Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-015"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Morango opBtnAdd-Morango"
                    id="btnAdd__01-015"
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
                    id="minusAlert__01-015"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Morango opBtnRemove-Morango"
                    id="btnSubt__01-015"
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
                className="opLi opLi-Red-Velvet__01-016"
                id="li-Red-Velvet__01-016"
                data-title="Bolo caseiro red velvet"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Red-Velvet"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Red-Velvet"
                    id="Red-Velvet-title"
                    aria-hidden="false"
                  >
                    Red Velvet
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Red-Velvet"
                    id="Red-Velvet-desc"
                    aria-hidden="false"
                  >
                    Festivo, chamativo e saboroso, perfeito para momentos
                    especiais!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Red-Velvet"
                    id="Red-Velvet-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;60,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet"
                  id="Red-Velvet-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__01-016"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Red-Velvet opBtnAdd-Red-Velvet"
                    id="btnAdd__01-016"
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
                    id="minusAlert__01-016"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Red-Velvet opBtnRemove-Red-Velvet"
                    id="btnSubt__01-016"
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
