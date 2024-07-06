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

export default function BoloFestaHC(): JSX.Element {
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
          id="div-Bolo-de-Festa__02-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morango"
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
                id="heading-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morango"
                aria-hidden="false"
              >
                <span className="menuOpHOptChunk" aria-hidden="false">
                  Opções —{" "}
                </span>
                <span
                  className="menuOpHNameChunk"
                  id="Bolo-de-Festa"
                  aria-hidden="false"
                >
                  Bolo de Festa
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
              id="contmainMenu_Pequeno-Médio,Grande"
              aria-hidden="false"
            >
              <div
                className="opSubGroup form-check"
                id="contmainMenu_Pequeno-Médio,Grande"
                aria-hidden="false"
              >
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Inp"
                  id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Lab"
                  aria-hidden="false"
                  data-watched="true"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="pequeno"
                    name="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Inp"
                    id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Inp"
                    aria-hidden="false"
                    aria-checked="true"
                    aria-disabled="false"
                    ref={defOptRef}
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
                    Pequeno
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Médio1Inp"
                  id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Médio1Lab"
                  aria-hidden="false"
                  data-watched="true"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="médio"
                    name="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Inp"
                    id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Médio1Inp"
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
                    Médio
                  </span>
                </label>
                <label
                  className="subopLab form-check-label subopLab0"
                  htmlFor="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Grande2Inp"
                  id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Grande2Lab"
                  aria-hidden="false"
                  data-watched="true"
                >
                  <input
                    className="subopInp form-check-input subopInp0"
                    type="radio"
                    value="grande"
                    name="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Pequeno0Inp"
                    id="contmainMenu_Pequeno-Médio,Grande-Branco_com_Chantili_e_Morango-Branco_com_Mousse_de_Chocolate_Branco_e_Framboesa-Brigadeiro_com_Morango-Brigadeiro_Confeitado_e_Morango-Brigadeiro_Granulado-Chocolate_com_Brigadeiro_e_Kit_Kat®-Chocolate_com_Doce_de_Leite-_Kit_Kat®_e_Kinder_Bueno®-Chocolate_com_Mousse_de_Ninho®-_Nutella®_e_Morango-Mousse_de_Chocolate_com_Frutas_Vermelhas-Ouro_Branco®-Red_Velvet_com_Mousse_de_Cream_Cheese_e_Morang-Grande2Inp"
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
                    Grande
                  </span>
                </label>
              </div>
            </div>
            <menu className="menuOpMenu" aria-hidden="false">
              <SearchBar />
              <li
                className="opLi opLi-Branco-com-Chantili-e-Morango__02-001"
                id="li-Branco-com-Chantili-e-Morango__02-001"
                data-title="Bolo de festa branco com chantili e morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Branco-com-Chantili-e-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Branco-com-Chantili-e-Morango"
                    id="Branco-com-Chantili-e-Morango-title"
                    aria-hidden="false"
                  >
                    Branco com Chantili e Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Branco-com-Chantili-e-Morango"
                    id="Branco-com-Chantili-e-Morango-desc"
                    aria-hidden="false"
                  >
                    Suave e cremoso! Uma sobremesa elegante, refrescante e
                    saborosa.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Branco-com-Chantili-e-Morango"
                    id="Branco-com-Chantili-e-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;90,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Branco-com-Chantili-e-Morango"
                  id="Branco-com-Chantili-e-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Branco-com-Chantili-e-Morango opBtnAdd-Branco-com-Chantili-e-Morango"
                    id="btnAdd__02-001"
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
                    id="minusAlert__02-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Branco-com-Chantili-e-Morango opBtnRemove-Branco-com-Chantili-e-Morango"
                    id="btnSubt__02-001"
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
                className="opLi opLi-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa__02-002"
                id="li-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa__02-002"
                data-title="Bolo de festa branco com mousse de chocolate branco e framboesa"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                    id="Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa-title"
                    aria-hidden="false"
                  >
                    Branco com Mousse de Chocolate Branco e Framboesa
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                    id="Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa-desc"
                    aria-hidden="false"
                  >
                    Suave e cremoso com um leve toque de intensidade! Uma
                    sobremesa elegante e conquistadora.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                    id="Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;100,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                  id="Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa opBtnAdd-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                    id="btnAdd__02-002"
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
                    id="minusAlert__02-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa opBtnRemove-Branco-com-Mousse-de-Chocolate-Branco-e-Framboesa"
                    id="btnSubt__02-002"
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
                className="opLi opLi-Brigadeiro-com-Morango__02-003"
                id="li-Brigadeiro-com-Morango__02-003"
                data-title="Bolo de festa brigadeiro com morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-com-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro-com-Morango"
                    id="Brigadeiro-com-Morango-title"
                    aria-hidden="false"
                  >
                    Brigadeiro com Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro-com-Morango"
                    id="Brigadeiro-com-Morango-desc"
                    aria-hidden="false"
                  >
                    Delicioso brigadeiro combinado com morangos frescos. Um
                    equilíbrio perfeito de doçura e frescor. Sempre ideal!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro-com-Morango"
                    id="Brigadeiro-com-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;80,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-com-Morango"
                  id="Brigadeiro-com-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro-com-Morango opBtnAdd-Brigadeiro-com-Morango"
                    id="btnAdd__02-003"
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
                    id="minusAlert__02-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro-com-Morango opBtnRemove-Brigadeiro-com-Morango"
                    id="btnSubt__02-003"
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
                className="opLi opLi-Brigadeiro-Confeitado-e-Morango__02-004"
                id="li-Brigadeiro-Confeitado-e-Morango__02-004"
                data-title="Bolo de festa brigadeiro confeitado e morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-Confeitado-e-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro-Confeitado-e-Morango"
                    id="Brigadeiro-Confeitado-e-Morango-title"
                    aria-hidden="false"
                  >
                    Brigadeiro Confeitado e Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro-Confeitado-e-Morango"
                    id="Brigadeiro-Confeitado-e-Morango-desc"
                    aria-hidden="false"
                  >
                    Colorido, saboroso e refrescante. Perfeito para festas e
                    celebrações!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro-Confeitado-e-Morango"
                    id="Brigadeiro-Confeitado-e-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;90,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-Confeitado-e-Morango"
                  id="Brigadeiro-Confeitado-e-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro-Confeitado-e-Morango opBtnAdd-Brigadeiro-Confeitado-e-Morango"
                    id="btnAdd__02-004"
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
                    id="minusAlert__02-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro-Confeitado-e-Morango opBtnRemove-Brigadeiro-Confeitado-e-Morango"
                    id="btnSubt__02-004"
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
                className="opLi opLi-Brigadeiro-Granulado__02-005"
                id="li-Brigadeiro-Granulado__02-005"
                data-title="Bolo de festa brigadeiro granulado"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-Granulado"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro-Granulado"
                    id="Brigadeiro-Granulado-title"
                    aria-hidden="false"
                  >
                    Brigadeiro Granulado
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro-Granulado"
                    id="Brigadeiro-Granulado-desc"
                    aria-hidden="false"
                  >
                    Brigadeiro tradicional com cobertura crocante de granulados
                    de chocolate. Uma escolha clássica e deliciosa!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro-Granulado"
                    id="Brigadeiro-Granulado-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;80,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-Granulado"
                  id="Brigadeiro-Granulado-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro-Granulado opBtnAdd-Brigadeiro-Granulado"
                    id="btnAdd__02-005"
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
                    id="minusAlert__02-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro-Granulado opBtnRemove-Brigadeiro-Granulado"
                    id="btnSubt__02-005"
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
                className="opLi opLi-Chocolate-com-Brigadeiro-e-Kit-Kat®__02-006"
                id="li-Chocolate-com-Brigadeiro-e-Kit-Kat®__02-006"
                data-title="Bolo de festa chocolate com brigadeiro e kit kat®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                    id="Chocolate-com-Brigadeiro-e-Kit-Kat®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Chocolate com Brigadeiro e Kit Kat
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "100%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                    id="Chocolate-com-Brigadeiro-e-Kit-Kat®-desc"
                    aria-hidden="false"
                  >
                    Combinação irresistível de cremosidade e crocância.
                    Satisfação garantida para os amantes do chocolate!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                    id="Chocolate-com-Brigadeiro-e-Kit-Kat®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;100,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                  id="Chocolate-com-Brigadeiro-e-Kit-Kat®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-006"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Brigadeiro-e-Kit-Kat® opBtnAdd-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                    id="btnAdd__02-006"
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
                    id="minusAlert__02-006"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Brigadeiro-e-Kit-Kat® opBtnRemove-Chocolate-com-Brigadeiro-e-Kit-Kat®"
                    id="btnSubt__02-006"
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
                className="opLi opLi-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®__02-007"
                id="li-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®__02-007"
                data-title="Bolo de festa chocolate com doce de leite, kit kat® e kinder bueno®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                    id="Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    <span
                      id="Chocolate_com_Doce_de_Leite__Kit_KatSliceChocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-title"
                      className="brandedNameSpan Chocolate_com_Doce_de_Leite__Kit_KatSlice"
                      aria-hidden="false"
                    >
                      Chocolate com Doce de Leite, Kit Kat
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="e_Kinder_BuenoSliceChocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-title"
                      className="brandedNameSpan e_Kinder_BuenoSlice"
                      aria-hidden="false"
                    >
                      e Kinder Bueno
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="SliceChocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-title"
                      className="brandedNameSpan Slice"
                      aria-hidden="false"
                    ></span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                    id="Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-desc"
                    aria-hidden="false"
                  >
                    Explosão de sabores acentuados combinando a dose certa de
                    recheio cremoso e crocância!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                    id="Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;120,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                  id="Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-007"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno® opBtnAdd-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                    id="btnAdd__02-007"
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
                    id="minusAlert__02-007"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno® opBtnRemove-Chocolate-com-Doce-de-Leite--Kit-Kat®-e-Kinder-Bueno®"
                    id="btnSubt__02-007"
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
                className="opLi opLi-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango__02-008"
                id="li-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango__02-008"
                data-title="Bolo de festa chocolate com mousse de ninho®, nutella® e morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                    id="Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    <span
                      id="Chocolate_com_Mousse_de_NinhoSliceChocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-title"
                      className="brandedNameSpan Chocolate_com_Mousse_de_NinhoSlice"
                      aria-hidden="false"
                    >
                      Chocolate com Mousse de Ninho
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="__NutellaSliceChocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-title"
                      className="brandedNameSpan __NutellaSlice"
                      aria-hidden="false"
                    >
                      , Nutella
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="e_MorangoSliceChocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-title"
                      className="brandedNameSpan e_MorangoSlice"
                      aria-hidden="false"
                    >
                      e Morango
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                    id="Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-desc"
                    aria-hidden="false"
                  >
                    Um festival de sabores em harmonia. Conquistador,
                    equilibrado e muito cremoso!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                    id="Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;95,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                  id="Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-008"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango opBtnAdd-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                    id="btnAdd__02-008"
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
                    id="minusAlert__02-008"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango opBtnRemove-Chocolate-com-Mousse-de-Ninho®--Nutella®-e-Morango"
                    id="btnSubt__02-008"
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
                className="opLi opLi-Mousse-de-Chocolate-com-Frutas-Vermelhas__02-009"
                id="li-Mousse-de-Chocolate-com-Frutas-Vermelhas__02-009"
                data-title="Bolo de festa mousse de chocolate com frutas vermelhas"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                    id="Mousse-de-Chocolate-com-Frutas-Vermelhas-title"
                    aria-hidden="false"
                  >
                    Mousse de Chocolate com Frutas Vermelhas
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                    id="Mousse-de-Chocolate-com-Frutas-Vermelhas-desc"
                    aria-hidden="false"
                  >
                    Para os que apreciam uma sobremesa com textura leve e um
                    toque de chocolate na medida certa.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                    id="Mousse-de-Chocolate-com-Frutas-Vermelhas-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;90,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                  id="Mousse-de-Chocolate-com-Frutas-Vermelhas-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-009"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Mousse-de-Chocolate-com-Frutas-Vermelhas opBtnAdd-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                    id="btnAdd__02-009"
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
                    id="minusAlert__02-009"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Mousse-de-Chocolate-com-Frutas-Vermelhas opBtnRemove-Mousse-de-Chocolate-com-Frutas-Vermelhas"
                    id="btnSubt__02-009"
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
                className="opLi opLi-Ouro-Branco®__02-010"
                id="li-Ouro-Branco®__02-010"
                data-title="Bolo de festa ouro branco®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ouro-Branco®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ouro-Branco®"
                    id="Ouro-Branco®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Ouro Branco
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ouro-Branco®"
                    id="Ouro-Branco®-desc"
                    aria-hidden="false"
                  >
                    Uma mistura conquistadora de crocância com a harmonia
                    perfeita entre os chocolates branco e ao leite
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ouro-Branco®"
                    id="Ouro-Branco®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;85,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ouro-Branco®"
                  id="Ouro-Branco®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-010"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ouro-Branco® opBtnAdd-Ouro-Branco®"
                    id="btnAdd__02-010"
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
                    id="minusAlert__02-010"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ouro-Branco® opBtnRemove-Ouro-Branco®"
                    id="btnSubt__02-010"
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
                className="opLi opLi-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango__02-011"
                id="li-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango__02-011"
                data-title="Bolo de festa red velvet com mousse de cream cheese e morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                    id="Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango-title"
                    aria-hidden="false"
                  >
                    Red Velvet com Mousse de Cream Cheese e Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                    id="Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango-desc"
                    aria-hidden="false"
                  >
                    Elegante, charmoso e sutil. Ideal para quem busca uma
                    sobremesa com sabor equilibrado e marcante!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                    id="Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;75,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                  id="Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__02-011"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango opBtnAdd-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                    id="btnAdd__02-011"
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
                    id="minusAlert__02-011"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango opBtnRemove-Red-Velvet-com-Mousse-de-Cream-Cheese-e-Morango"
                    id="btnSubt__02-011"
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
