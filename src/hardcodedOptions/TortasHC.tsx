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

export default function TortasHC(): JSX.Element {
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
          if (ref.id !== "") allDialogs.push(`#${ref.id}`);
          else if (ref instanceof HTMLDialogElement) allDialogs.push("dialog");
          ref instanceof HTMLDialogElement && ref.close();
          setOptions && setOptions(false);
        });
      }, 300);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          if (currentRef instanceof HTMLDialogElement) {
            currentRef.close();
            currentRef.open = false;
            setOptions && setOptions(false);
          }
        }
      }, 600);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          currentRef instanceof HTMLDialogElement &&
            createRoot(currentRef).unmount();
        }
      }, 900);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          currentRef instanceof HTMLElement && currentRef.remove();
        }
      }, 1200);
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
          id="div-Torta-Gelada__14-Chocolate_com_Maracujá-Limão-Maracujá-Morango"
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
                <span aria-hidden="false">Torta Gelada</span>
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
              id="contmainMenu_Pequena-Média,Grande"
              aria-hidden="false"
            >
              <div
                className="opSubGroup form-check"
                id="contmainMenu_Pequena-Média,Grande"
                aria-hidden="false"
              >
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Lab"
                  id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Lab"
                  aria-hidden="false"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="pequena"
                    name="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Inp"
                    id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Inp"
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
                    Pequena
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Média1Lab"
                  id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Média1Lab"
                  aria-hidden="false"
                >
                  <input
                    ref={defOptRef}
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="média"
                    name="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Inp"
                    id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Média1Inp"
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
                    Média
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Grande2Lab"
                  id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Grande2Lab"
                  aria-hidden="false"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="grande"
                    name="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Pequena0Inp"
                    id="contmainMenu_Pequena-Média,Grande-Chocolate_com_Maracujá-Limão-Maracujá-Morang-Grande2Inp"
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
                className="opLi opLi-Chocolate-com-Maracujá__14-001"
                id="li-Chocolate-com-Maracujá__14-001"
                data-title="Torta gelada chocolate com maracujá"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Maracujá"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Maracujá"
                    id="Chocolate-com-Maracujá-title"
                    aria-hidden="false"
                  >
                    Chocolate com Maracujá
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Maracujá"
                    id="Chocolate-com-Maracujá-desc"
                    aria-hidden="false"
                  >
                    Combinação provocante de chocolate e maracujá, enaltecendo a
                    intensidade dos dois sabores!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Maracujá"
                    id="Chocolate-com-Maracujá-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Maracujá"
                  id="Chocolate-com-Maracujá-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__14-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Maracujá opBtnAdd-Chocolate-com-Maracujá"
                    id="btnAdd__14-001"
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
                    id="minusAlert__14-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Maracujá opBtnRemove-Chocolate-com-Maracujá"
                    id="btnSubt__14-001"
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
                className="opLi opLi-Limão__14-002"
                id="li-Limão__14-002"
                data-title="Torta gelada limão"
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
                    Refrescante e cremosa, uma das favoritas, é a sobremesa
                    perfeita para um paladar equilibrado prezando pelo cítrico.
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
                    id="addAlert__14-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Limão opBtnAdd-Limão"
                    id="btnAdd__14-002"
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
                    id="minusAlert__14-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Limão opBtnRemove-Limão"
                    id="btnSubt__14-002"
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
                className="opLi opLi-Maracujá__14-003"
                id="li-Maracujá__14-003"
                data-title="Torta gelada maracujá"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Maracujá"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Maracujá"
                    id="Maracujá-title"
                    aria-hidden="false"
                  >
                    Maracujá
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Maracujá"
                    id="Maracujá-desc"
                    aria-hidden="false"
                  >
                    O leve amargor com a intensa doçura do maracujá encontra a
                    suavidade do creme nesse doce vibrante!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Maracujá"
                    id="Maracujá-price"
                    aria-hidden="false"
                  >
                    R$ 45,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maracujá"
                  id="Maracujá-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__14-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Maracujá opBtnAdd-Maracujá"
                    id="btnAdd__14-003"
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
                    id="minusAlert__14-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Maracujá opBtnRemove-Maracujá"
                    id="btnSubt__14-003"
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
                className="opLi opLi-Morango__14-004"
                id="li-Morango__14-004"
                data-title="Torta gelada morango"
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
                    Combinação de sabor e frescor, ideal para finalizar qualquer
                    refeição com leveza!
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
                    id="addAlert__14-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Morango opBtnAdd-Morango"
                    id="btnAdd__14-004"
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
                    id="minusAlert__14-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Morango opBtnRemove-Morango"
                    id="btnSubt__14-004"
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
