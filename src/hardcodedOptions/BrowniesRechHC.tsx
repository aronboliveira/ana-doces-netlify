import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { nullishDlg } from "../declarations/types";
import {
  clearURLAfterModal,
  fixModalOpening,
  handleOrderAdd,
  handleOrderSubtract,
  isClickOutside,
} from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";

export default function BrowniesRechHC(): JSX.Element {
  const optionsRef = useRef<nullishDlg>(null);
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
          id="div-Brownie-Recheado__04-Brigadeiro-Brigadeiro_de_Pistache-Doce_de_Leite-Kinder_Bueno®-Limão-Maracujá-Ninho®-Ninho®_com_Nutella®-Nutella®-Nutella®_com_Morango-Oreo®-Prestígio®"
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
                id="heading-Brigadeiro-Brigadeiro_de_Pistache-Doce_de_Leite-Kinder_Bueno®-Limão-Maracujá-Ninho®-Ninho®_com_Nutella®-Nutella®-Nutella®_com_Morango-Oreo®-Prestígio®"
                aria-hidden="false"
              >
                <span className="menuOpHOptChunk" aria-hidden="false">
                  Opções —{" "}
                </span>
                <span
                  className="menuOpHNameChunk"
                  id="Brownie-Recheado"
                  aria-hidden="false"
                >
                  Brownie Recheado
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
              id="contmainMenu_"
              aria-hidden="false"
            ></div>
            <menu className="menuOpMenu" aria-hidden="false">
              <SearchBar />
              <li
                className="opLi opLi-Brigadeiro__04-001"
                id="li-Brigadeiro__04-001"
                data-title="Brownie recheado brigadeiro"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro"
                    id="Brigadeiro-title"
                    aria-hidden="false"
                  >
                    Brigadeiro
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro"
                    id="Brigadeiro-desc"
                    aria-hidden="false"
                  >
                    Com brigadeiro irresistível, cremoso e repleto de chocolate,
                    perfeito para qualquer ocasião!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro"
                    id="Brigadeiro-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro"
                  id="Brigadeiro-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro opBtnAdd-Brigadeiro"
                    id="btnAdd__04-001"
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
                    id="minusAlert__04-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro opBtnRemove-Brigadeiro"
                    id="btnSubt__04-001"
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
                className="opLi opLi-Brigadeiro-de-Pistache__04-002"
                id="li-Brigadeiro-de-Pistache__04-002"
                data-title="Brownie recheado brigadeiro de pistache"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-de-Pistache"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro-de-Pistache"
                    id="Brigadeiro-de-Pistache-title"
                    aria-hidden="false"
                  >
                    Brigadeiro de Pistache
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro-de-Pistache"
                    id="Brigadeiro-de-Pistache-desc"
                    aria-hidden="false"
                  >
                    Acentuado sabor do pistache em um recheio cremoso único.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro-de-Pistache"
                    id="Brigadeiro-de-Pistache-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-de-Pistache"
                  id="Brigadeiro-de-Pistache-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro-de-Pistache opBtnAdd-Brigadeiro-de-Pistache"
                    id="btnAdd__04-002"
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
                    id="minusAlert__04-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro-de-Pistache opBtnRemove-Brigadeiro-de-Pistache"
                    id="btnSubt__04-002"
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
                className="opLi opLi-Doce-de-Leite__04-003"
                id="li-Doce-de-Leite__04-003"
                data-title="Brownie recheado doce de leite"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Doce-de-Leite"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Doce-de-Leite"
                    id="Doce-de-Leite-title"
                    aria-hidden="false"
                  >
                    Doce de Leite
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Doce-de-Leite"
                    id="Doce-de-Leite-desc"
                    aria-hidden="false"
                  >
                    Camadas generosas de doce de leite, um mimo deliciosamente
                    indulgente.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Doce-de-Leite"
                    id="Doce-de-Leite-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Doce-de-Leite"
                  id="Doce-de-Leite-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Doce-de-Leite opBtnAdd-Doce-de-Leite"
                    id="btnAdd__04-003"
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
                    id="minusAlert__04-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Doce-de-Leite opBtnRemove-Doce-de-Leite"
                    id="btnSubt__04-003"
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
                className="opLi opLi-Kinder-Bueno®__04-004"
                id="li-Kinder-Bueno®__04-004"
                data-title="Brownie recheado kinder bueno®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Kinder-Bueno®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Kinder-Bueno®"
                    id="Kinder-Bueno®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Kinder Bueno
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Kinder-Bueno®"
                    id="Kinder-Bueno®-desc"
                    aria-hidden="false"
                  >
                    Com pedaços do inconfundível Kinder Bueno, criando um sabor
                    único.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Kinder-Bueno®"
                    id="Kinder-Bueno®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Kinder-Bueno®"
                  id="Kinder-Bueno®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Kinder-Bueno® opBtnAdd-Kinder-Bueno®"
                    id="btnAdd__04-004"
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
                    id="minusAlert__04-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Kinder-Bueno® opBtnRemove-Kinder-Bueno®"
                    id="btnSubt__04-004"
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
                className="opLi opLi-Limão__04-005"
                id="li-Limão__04-005"
                data-title="Brownie recheado limão"
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
                    Refrescante twist, com toques cítricos para uma doçura
                    equilibrada.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Limão"
                    id="Limão-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Limão"
                  id="Limão-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Limão opBtnAdd-Limão"
                    id="btnAdd__04-005"
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
                    id="minusAlert__04-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Limão opBtnRemove-Limão"
                    id="btnSubt__04-005"
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
                className="opLi opLi-Maracujá__04-006"
                id="li-Maracujá__04-006"
                data-title="Brownie recheado maracujá"
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
                    Notas tropicais, ideal para quem busca equilíbrio entre
                    acidez e doçura
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Maracujá"
                    id="Maracujá-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maracujá"
                  id="Maracujá-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-006"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Maracujá opBtnAdd-Maracujá"
                    id="btnAdd__04-006"
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
                    id="minusAlert__04-006"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Maracujá opBtnRemove-Maracujá"
                    id="btnSubt__04-006"
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
                className="opLi opLi-Ninho®__04-007"
                id="li-Ninho®__04-007"
                data-title="Brownie recheado ninho®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ninho®"
                    id="Ninho®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Ninho
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ninho®"
                    id="Ninho®-desc"
                    aria-hidden="false"
                  >
                    Enriquecido com leite em pó Ninho®, uma nostalgia em cada
                    mordida!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ninho®"
                    id="Ninho®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho®"
                  id="Ninho®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-007"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ninho® opBtnAdd-Ninho®"
                    id="btnAdd__04-007"
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
                    id="minusAlert__04-007"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ninho® opBtnRemove-Ninho®"
                    id="btnSubt__04-007"
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
                className="opLi opLi-Ninho®-com-Nutella®__04-008"
                id="li-Ninho®-com-Nutella®__04-008"
                data-title="Brownie recheado ninho® com nutella®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho®-com-Nutella®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ninho®-com-Nutella®"
                    id="Ninho®-com-Nutella®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    <span
                      id="NinhoSliceNinho®-com-Nutella®-title"
                      className="brandedNameSpan NinhoSlice"
                      aria-hidden="false"
                    >
                      Ninho
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="com_NutellaSliceNinho®-com-Nutella®-title"
                      className="brandedNameSpan com_NutellaSlice"
                      aria-hidden="false"
                    >
                      com Nutella
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="SliceNinho®-com-Nutella®-title"
                      className="brandedNameSpan Slice"
                      aria-hidden="false"
                    ></span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ninho®-com-Nutella®"
                    id="Ninho®-com-Nutella®-desc"
                    aria-hidden="false"
                  >
                    A doçura do leite em pó combinada com a cremosidade do creme
                    de avelã em um brownie extraordinariamente saboroso!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ninho®-com-Nutella®"
                    id="Ninho®-com-Nutella®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho®-com-Nutella®"
                  id="Ninho®-com-Nutella®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-008"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ninho®-com-Nutella® opBtnAdd-Ninho®-com-Nutella®"
                    id="btnAdd__04-008"
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
                    id="minusAlert__04-008"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ninho®-com-Nutella® opBtnRemove-Ninho®-com-Nutella®"
                    id="btnSubt__04-008"
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
                className="opLi opLi-Nutella®__04-009"
                id="li-Nutella®__04-009"
                data-title="Brownie recheado nutella®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Nutella®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Nutella®"
                    id="Nutella®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Nutella
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "101%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Nutella®"
                    id="Nutella®-desc"
                    aria-hidden="false"
                  >
                    Ultrachocolateado, com uma camada generosa de creme de
                    avelã.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Nutella®"
                    id="Nutella®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Nutella®"
                  id="Nutella®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-009"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Nutella® opBtnAdd-Nutella®"
                    id="btnAdd__04-009"
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
                    id="minusAlert__04-009"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Nutella® opBtnRemove-Nutella®"
                    id="btnSubt__04-009"
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
                className="opLi opLi-Nutella®-com-Morango__04-010"
                id="li-Nutella®-com-Morango__04-010"
                data-title="Brownie recheado nutella® com morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Nutella®-com-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Nutella®-com-Morango"
                    id="Nutella®-com-Morango-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    {" "}
                    <span
                      id="NutellaSliceNutella®-com-Morango-title"
                      className="brandedNameSpan NutellaSlice"
                      aria-hidden="false"
                    >
                      Nutella
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="_com_MorangoSliceNutella®-com-Morango-title"
                      className="brandedNameSpan _com_MorangoSlice"
                      aria-hidden="false"
                    >
                      com Morango
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Nutella®-com-Morango"
                    id="Nutella®-com-Morango-desc"
                    aria-hidden="false"
                  >
                    Perfeita combinação de cremosidade e frescor em um brownie
                    de sabor balanceado e intenso.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Nutella®-com-Morango"
                    id="Nutella®-com-Morango-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Nutella®-com-Morango"
                  id="Nutella®-com-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-010"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Nutella®-com-Morango opBtnAdd-Nutella®-com-Morango"
                    id="btnAdd__04-010"
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
                    id="minusAlert__04-010"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Nutella®-com-Morango opBtnRemove-Nutella®-com-Morango"
                    id="btnSubt__04-010"
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
                className="opLi opLi-Oreo®__04-011"
                id="li-Oreo®__04-011"
                data-title="Brownie recheado oreo®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Oreo®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Oreo®"
                    id="Oreo®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Oreo
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Oreo®"
                    id="Oreo®-desc"
                    aria-hidden="false"
                  >
                    Com pedaços de biscoito de chocolate em uma fusão deliciosa
                    de cremosidade e crocância.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Oreo®"
                    id="Oreo®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Oreo®"
                  id="Oreo®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-011"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Oreo® opBtnAdd-Oreo®"
                    id="btnAdd__04-011"
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
                    id="minusAlert__04-011"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Oreo® opBtnRemove-Oreo®"
                    id="btnSubt__04-011"
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
                className="opLi opLi-Prestígio®__04-012"
                id="li-Prestígio®__04-012"
                data-title="Brownie recheado prestígio®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Prestígio®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Prestígio®"
                    id="Prestígio®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Prestígio
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Prestígio®"
                    id="Prestígio®-desc"
                    aria-hidden="false"
                  >
                    Recheio cremoso de coco envolto em chocolate, inspirado no
                    clássico Prestígio®.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Prestígio®"
                    id="Prestígio®-price"
                    aria-hidden="false"
                  >
                    R$ 10,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Prestígio®"
                  id="Prestígio®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__04-012"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Prestígio® opBtnAdd-Prestígio®"
                    id="btnAdd__04-012"
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
                    id="minusAlert__04-012"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Prestígio® opBtnRemove-Prestígio®"
                    id="btnSubt__04-012"
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
