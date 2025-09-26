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
//TODO
export default function GeleiaHC(): JSX.Element {
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
          id="div-Geleia-Artesanal__10-Frutas_Vermelhas-Maracujá-Morango-Pêssego"
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
                id="heading-Frutas_Vermelhas-Maracujá-Morango-Pêssego"
                aria-hidden="false"
              >
                <span className="menuOpHOptChunk" aria-hidden="false">
                  Opções —{" "}
                </span>
                <span
                  className="menuOpHNameChunk"
                  id="Geleia-Artesanal"
                  aria-hidden="false"
                >
                  Geleia Artesanal
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
                className="opLi opLi-Frutas-Vermelhas__10-001"
                id="li-Frutas-Vermelhas__10-001"
                data-title="Geleia artesanal frutas vermelhas"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Frutas-Vermelhas"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Frutas-Vermelhas"
                    id="Frutas-Vermelhas-title"
                    aria-hidden="false"
                  >
                    Frutas Vermelhas
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Frutas-Vermelhas"
                    id="Frutas-Vermelhas-desc"
                    aria-hidden="false"
                  >
                    Um clássico conquistador! A combinação de frutas vermelhas é
                    garantia de doçura equilibrada e paladar requintado.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Frutas-Vermelhas"
                    id="Frutas-Vermelhas-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;30,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Frutas-Vermelhas"
                  id="Frutas-Vermelhas-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__10-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Frutas-Vermelhas opBtnAdd-Frutas-Vermelhas"
                    id="btnAdd__10-001"
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
                    id="minusAlert__10-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Frutas-Vermelhas opBtnRemove-Frutas-Vermelhas"
                    id="btnSubt__10-001"
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
                className="opLi opLi-Maracujá__10-002"
                id="li-Maracujá__10-002"
                data-title="Geleia artesanal maracujá"
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
                    O sabor intenso e suavemente ácido do Maracujá em uma geleia
                    perfeita para acompanhar massas doces e pães.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Maracujá"
                    id="Maracujá-price"
                    aria-hidden="false"
                  >
                    R$ 25,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maracujá"
                  id="Maracujá-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__10-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Maracujá opBtnAdd-Maracujá"
                    id="btnAdd__10-002"
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
                    id="minusAlert__10-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Maracujá opBtnRemove-Maracujá"
                    id="btnSubt__10-002"
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
                className="opLi opLi-Morango__10-003"
                id="li-Morango__10-003"
                data-title="Geleia artesanal morango"
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
                    Feita com frutos frescos e doces, a geleia de morango é um
                    clássico e garantia de satisfação!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Morango"
                    id="Morango-price"
                    aria-hidden="false"
                  >
                    R$ 25,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango"
                  id="Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__10-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Morango opBtnAdd-Morango"
                    id="btnAdd__10-003"
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
                    id="minusAlert__10-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Morango opBtnRemove-Morango"
                    id="btnSubt__10-003"
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
                className="opLi opLi-Pêssego__10-004"
                id="li-Pessego__10-004"
                data-title="Geleia artesanal pêssego"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pêssego"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Pêssego"
                    id="Pessego-title"
                    aria-hidden="false"
                  >
                    Pêssego
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Pêssego"
                    id="Pessego-desc"
                    aria-hidden="false"
                  >
                    Delicado e ao mesmo tempo intenso com acento equilibrado, a
                    geleia de pêssego é perfeita para todas as sobremesas!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Pêssego"
                    id="Pessego-price"
                    aria-hidden="false"
                  >
                    R$ 25,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pêssego"
                  id="Pessego-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__10-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Pêssego opBtnAdd-Pêssego"
                    id="btnAdd__10-004"
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
                    id="minusAlert__10-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Pêssego opBtnRemove-Pêssego"
                    id="btnSubt__10-004"
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
