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

export default function PaveHC(): JSX.Element {
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
      }, 500);
      setTimeout(() => {
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
      }, 800);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          const contDlg = currentRef?.closest(".contDlg");
          currentRef instanceof HTMLDialogElement &&
            contDlg &&
            createRoot(contDlg).unmount();
        }
      }, 1000);
      setTimeout(() => {
        for (const ref of allDialogs) {
          const currentRef = document.querySelector(ref);
          const contDlg = currentRef?.closest(".contDlg");
          currentRef instanceof HTMLElement && contDlg && contDlg.remove();
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
          id="div-Pave-de-Pote__12-Doce_de_leite-Kinder_Bueno®-Sonho_de_Valsa®"
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
                <span aria-hidden="false">Pavê de Pote</span>
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
                className="opLi opLi-Doce-de-leite__12-001"
                id="li-Doce-de-leite__12-001"
                data-title="Pavê de pote doce de leite"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Doce-de-leite"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Doce-de-leite"
                    id="Doce-de-leite-title"
                    aria-hidden="false"
                  >
                    Doce de leite
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Doce-de-leite"
                    id="Doce-de-leite-desc"
                    aria-hidden="false"
                  >
                    Camadas de creme de doce de leite intercaladas com biscoitos
                    suaves no conforto de um pote.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Doce-de-leite"
                    id="Doce-de-leite-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Doce-de-leite"
                  id="Doce-de-leite-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__12-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Doce-de-leite opBtnAdd-Doce-de-leite"
                    id="btnAdd__12-001"
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
                    id="minusAlert__12-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Doce-de-leite opBtnRemove-Doce-de-leite"
                    id="btnSubt__12-001"
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
                className="opLi opLi-Kinder-Bueno®__12-002"
                id="li-Kinder-Bueno®__12-002"
                data-title="Pavê de pote kinder bueno®"
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
                    Camadas do marcante Kinder Bueno® alternado com creme suave.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Kinder-Bueno®"
                    id="Kinder-Bueno®-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Kinder-Bueno®"
                  id="Kinder-Bueno®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__12-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Kinder-Bueno® opBtnAdd-Kinder-Bueno®"
                    id="btnAdd__12-002"
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
                    id="minusAlert__12-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Kinder-Bueno® opBtnRemove-Kinder-Bueno®"
                    id="btnSubt__12-002"
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
                className="opLi opLi-Sonho-de-Valsa®__12-003"
                id="li-Sonho-de-Valsa®__12-003"
                data-title="Pavê de pote sonho de valsa®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Sonho-de-Valsa®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Sonho-de-Valsa®"
                    id="Sonho-de-Valsa®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Sonho de Valsa
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "101%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Sonho-de-Valsa®"
                    id="Sonho-de-Valsa®-desc"
                    aria-hidden="false"
                  >
                    A consistência cremosa e crocância do bombom de Sonho de
                    Valsa® em um pavê especial e intenso.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Sonho-de-Valsa®"
                    id="Sonho-de-Valsa®-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Sonho-de-Valsa®"
                  id="Sonho-de-Valsa®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__12-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Sonho-de-Valsa® opBtnAdd-Sonho-de-Valsa®"
                    id="btnAdd__12-003"
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
                    id="minusAlert__12-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Sonho-de-Valsa® opBtnRemove-Sonho-de-Valsa®"
                    id="btnSubt__12-003"
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
