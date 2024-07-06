import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
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

export default function PalhaHC(): JSX.Element {
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
    addEventListener("keydown", press => handleKeyPress(press));
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
      optionsRef.current.querySelectorAll(".opBtnAdd").forEach(addBtn => {
        addBtn.addEventListener("click", function (this: HTMLButtonElement, c) {
          handleOrderAdd(
            this || c.currentTarget,
            document.getElementById("total")
          );
        });
      });
      optionsRef.current.querySelectorAll(".opBtnRemove").forEach(addBtn => {
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
    const idRef = optionsRef.current?.id;
    const modalInterv = setInterval(interv => {
      if (optionsRef.current?.open === false) {
        optionsRef.current.close();
        setOptions && setOptions(false);
        clearInterval(interv);
      }
    }, 100);
    const clearAddInterv = setInterval(() => {
      if (idRef && !document.getElementById(idRef)) clearInterval(modalInterv);
    }, 60000);
    setTimeout(() => {
      if (idRef && !document.getElementById(idRef)) clearInterval(modalInterv);
      clearInterval(clearAddInterv);
    }, 300000);
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
        document.querySelectorAll(idRef).forEach(ref => {
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
        document.querySelectorAll(".contDlg").forEach(contDlg => {
          createRoot(contDlg).unmount();
        });
        document.querySelectorAll(".contDlg").forEach(contDlg => {
          contDlg.remove();
        });
      }, 200);
    };
    addEventListener("popstate", handlePopState);
    return () => {
      removeEventListener("popstate", handlePopState);
      clearInterval(modalInterv);
    };
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
          id="div-Palha-Gourmet-—-conjunto__11-Com_Castanha-Com_Castanha_e_Nozes-Com_Nozes"
          ref={optionsRef}
          onClick={click => {
            if (
              isClickOutside(click, optionsRef.current!).some(
                coord => coord === true
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
              <h2
                className="menuOpH"
                id="heading-Com_Castanha-Com_Castanha_e_Nozes-Com_Nozes"
                aria-hidden="false"
              >
                <span className="menuOpHOptChunk" aria-hidden="false">
                  Opções —{" "}
                </span>
                <span
                  className="menuOpHNameChunk"
                  id="Palha-Gourmet-—-conjunto"
                  aria-hidden="false"
                >
                  Palha Gourmet — conjunto
                </span>
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
              id="contmainMenu_75g-150g"
              aria-hidden="false"
            >
              <div
                className="opSubGroup form-check"
                id="contmainMenu_75g-150g"
                aria-hidden="false"
              >
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Lab"
                  id="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Lab"
                  aria-hidden="false"
                >
                  <input
                    ref={defOptRef}
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="75g"
                    name="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp"
                    id="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp"
                    aria-hidden="false"
                    aria-checked="true"
                    aria-disabled="false"
                    onClick={ev => {
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
                    75g
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Lab"
                  id="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Lab"
                  aria-hidden="false"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="150g"
                    name="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp"
                    id="contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Inp"
                    aria-hidden="false"
                    aria-checked="false"
                    aria-disabled="false"
                    onClick={ev => {
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
                    150g
                  </span>
                </label>
              </div>
            </div>
            <menu className="menuOpMenu" aria-hidden="false">
              <SearchBar />
              <li
                className="opLi opLi-Com-Castanha__11-001"
                id="li-Com-Castanha__11-001"
                data-title="Palha gourmet — conjunto com castanha"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Castanha"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Com-Castanha"
                    id="Com-Castanha-title"
                    aria-hidden="false"
                  >
                    Com Castanha
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Com-Castanha"
                    id="Com-Castanha-desc"
                    aria-hidden="false"
                  >
                    Crocante e levemente acentuado, o sabor único da
                    castanha-de-caju incorporado no marcante sabor da Palha
                    Italiana Gourmet
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Com-Castanha"
                    id="Com-Castanha-price"
                    aria-hidden="false"
                  >
                    R$ 8,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Castanha"
                  id="Com-Castanha-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__11-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Com-Castanha opBtnAdd-Com-Castanha"
                    id="btnAdd__11-001"
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
                    id="minusAlert__11-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Com-Castanha opBtnRemove-Com-Castanha"
                    id="btnSubt__11-001"
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
                className="opLi opLi-Com-Castanha-e-Nozes__11-002"
                id="li-Com-Castanha-e-Nozes__11-002"
                data-title="Palha gourmet — conjunto com castanha e nozes"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Castanha-e-Nozes"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Com-Castanha-e-Nozes"
                    id="Com-Castanha-e-Nozes-title"
                    aria-hidden="false"
                  >
                    Com Castanha e Nozes
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Com-Castanha-e-Nozes"
                    id="Com-Castanha-e-Nozes-desc"
                    aria-hidden="false"
                  >
                    Crocância máxima! Para os que amam a textura consistente dos
                    cereais em combinação com a maciez da Palha Italiana Gourmet
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Com-Castanha-e-Nozes"
                    id="Com-Castanha-e-Nozes-price"
                    aria-hidden="false"
                  >
                    R$ 8,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Castanha-e-Nozes"
                  id="Com-Castanha-e-Nozes-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__11-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Com-Castanha-e-Nozes opBtnAdd-Com-Castanha-e-Nozes"
                    id="btnAdd__11-002"
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
                    id="minusAlert__11-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Com-Castanha-e-Nozes opBtnRemove-Com-Castanha-e-Nozes"
                    id="btnSubt__11-002"
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
                className="opLi opLi-Com-Nozes__11-003"
                id="li-Com-Nozes__11-003"
                data-title="Palha gourmet — conjunto com nozes"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Nozes"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Com-Nozes"
                    id="Com-Nozes-title"
                    aria-hidden="false"
                  >
                    Com Nozes
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Com-Nozes"
                    id="Com-Nozes-desc"
                    aria-hidden="false"
                  >
                    Para os amantes do sabor granulado das nozes de nogueira.
                    Crocância extra!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Com-Nozes"
                    id="Com-Nozes-price"
                    aria-hidden="false"
                  >
                    R$ 8,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Nozes"
                  id="Com-Nozes-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__11-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Com-Nozes opBtnAdd-Com-Nozes"
                    id="btnAdd__11-003"
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
                    id="minusAlert__11-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Com-Nozes opBtnRemove-Com-Nozes"
                    id="btnSubt__11-003"
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
