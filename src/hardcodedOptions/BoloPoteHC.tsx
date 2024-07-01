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

export default function BoloPoteHC(): JSX.Element {
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
          id="div-Bolo-de-Pote__03-Brigadeiro-Brigadeiro_com_Cenoura-Brownie-Doce_de_Leite_com_Nozes-Morango_com_Caramelo-Morango_com_Chocolate-Prestígio®-Red_Velvet"
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
                <span aria-hidden="false">Bolo de Pote</span>
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
                className="opLi opLi-Brigadeiro__03-001"
                id="li-Brigadeiro__03-001"
                data-title="Bolo de pote brigadeiro"
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
                    Camadas de bolo de chocolate intercaladas com brigadeiro
                    cremoso, um clássico irresistível!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro"
                    id="Brigadeiro-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro"
                  id="Brigadeiro-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro opBtnAdd-Brigadeiro"
                    id="btnAdd__03-001"
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
                    id="minusAlert__03-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro opBtnRemove-Brigadeiro"
                    id="btnSubt__03-001"
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
                className="opLi opLi-Brigadeiro-com-Cenoura__03-002"
                id="li-Brigadeiro-com-Cenoura__03-002"
                data-title="Bolo de pote brigadeiro com cenoura"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-com-Cenoura"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brigadeiro-com-Cenoura"
                    id="Brigadeiro-com-Cenoura-title"
                    aria-hidden="false"
                  >
                    Brigadeiro com Cenoura
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brigadeiro-com-Cenoura"
                    id="Brigadeiro-com-Cenoura-desc"
                    aria-hidden="false"
                  >
                    Perfeita combinação de maciez com cobertura saborosa e
                    generosa de brigadeiro!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brigadeiro-com-Cenoura"
                    id="Brigadeiro-com-Cenoura-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-com-Cenoura"
                  id="Brigadeiro-com-Cenoura-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brigadeiro-com-Cenoura opBtnAdd-Brigadeiro-com-Cenoura"
                    id="btnAdd__03-002"
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
                    id="minusAlert__03-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brigadeiro-com-Cenoura opBtnRemove-Brigadeiro-com-Cenoura"
                    id="btnSubt__03-002"
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
                className="opLi opLi-Brownie__03-003"
                id="li-Brownie__03-003"
                data-title="Bolo de pote brownie"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brownie"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Brownie"
                    id="Brownie-title"
                    aria-hidden="false"
                  >
                    Brownie
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Brownie"
                    id="Brownie-desc"
                    aria-hidden="false"
                  >
                    Combinação de camadas de creme suave com a granulosidade de
                    pedaços dos nossos brownies especiais.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Brownie"
                    id="Brownie-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brownie"
                  id="Brownie-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Brownie opBtnAdd-Brownie"
                    id="btnAdd__03-003"
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
                    id="minusAlert__03-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Brownie opBtnRemove-Brownie"
                    id="btnSubt__03-003"
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
                className="opLi opLi-Doce-de-Leite-com-Nozes__03-004"
                id="li-Doce-de-Leite-com-Nozes__03-004"
                data-title="Bolo de pote doce de leite com nozes"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Doce-de-Leite-com-Nozes"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Doce-de-Leite-com-Nozes"
                    id="Doce-de-Leite-com-Nozes-title"
                    aria-hidden="false"
                  >
                    Doce de Leite com Nozes
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Doce-de-Leite-com-Nozes"
                    id="Doce-de-Leite-com-Nozes-desc"
                    aria-hidden="false"
                  >
                    A intensidade do doce de leite com pedaços crocantes de
                    nozes suaves.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Doce-de-Leite-com-Nozes"
                    id="Doce-de-Leite-com-Nozes-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Doce-de-Leite-com-Nozes"
                  id="Doce-de-Leite-com-Nozes-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Doce-de-Leite-com-Nozes opBtnAdd-Doce-de-Leite-com-Nozes"
                    id="btnAdd__03-004"
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
                    id="minusAlert__03-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Doce-de-Leite-com-Nozes opBtnRemove-Doce-de-Leite-com-Nozes"
                    id="btnSubt__03-004"
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
                className="opLi opLi-Morango-com-Caramelo__03-005"
                id="li-Morango-com-Caramelo__03-005"
                data-title="Bolo de pote morango com caramelo"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango-com-Caramelo"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Morango-com-Caramelo"
                    id="Morango-com-Caramelo-title"
                    aria-hidden="false"
                  >
                    Morango com Caramelo
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Morango-com-Caramelo"
                    id="Morango-com-Caramelo-desc"
                    aria-hidden="false"
                  >
                    O equilíbrio entre o frescor e doçura do morango combinado
                    com a intensidade do caramelo em um só bolo!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Morango-com-Caramelo"
                    id="Morango-com-Caramelo-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango-com-Caramelo"
                  id="Morango-com-Caramelo-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Morango-com-Caramelo opBtnAdd-Morango-com-Caramelo"
                    id="btnAdd__03-005"
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
                    id="minusAlert__03-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Morango-com-Caramelo opBtnRemove-Morango-com-Caramelo"
                    id="btnSubt__03-005"
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
                className="opLi opLi-Morango-com-Chocolate__03-006"
                id="li-Morango-com-Chocolate__03-006"
                data-title="Bolo de pote morango com chocolate"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango-com-Chocolate"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Morango-com-Chocolate"
                    id="Morango-com-Chocolate-title"
                    aria-hidden="false"
                  >
                    Morango com Chocolate
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Morango-com-Chocolate"
                    id="Morango-com-Chocolate-desc"
                    aria-hidden="false"
                  >
                    Um dos clássicos, o suave e levemente azedo sabor do morango
                    se acentuam com a intensidade do brigadeiro.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Morango-com-Chocolate"
                    id="Morango-com-Chocolate-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango-com-Chocolate"
                  id="Morango-com-Chocolate-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-006"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Morango-com-Chocolate opBtnAdd-Morango-com-Chocolate"
                    id="btnAdd__03-006"
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
                    id="minusAlert__03-006"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Morango-com-Chocolate opBtnRemove-Morango-com-Chocolate"
                    id="btnSubt__03-006"
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
                className="opLi opLi-Prestígio®__03-007"
                id="li-Prestígio®__03-007"
                data-title="Bolo de pote prestígio®"
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
                    Para os amantes do tom tropical, o sabor leve e consistente
                    do coco em combinação com consistência cremosa e massa
                    suave.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Prestígio®"
                    id="Prestígio®-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Prestígio®"
                  id="Prestígio®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-007"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Prestígio® opBtnAdd-Prestígio®"
                    id="btnAdd__03-007"
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
                    id="minusAlert__03-007"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Prestígio® opBtnRemove-Prestígio®"
                    id="btnSubt__03-007"
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
                className="opLi opLi-Red-Velvet__03-008"
                id="li-Red-Velvet__03-008"
                data-title="Bolo de pote red velvet"
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
                    Uma conquista nos olhares e no paladar, combina uma massa de
                    sabor suave, cuidadosamente recheada com um mousse especial
                    de Cream Cheese e muito macia.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Red-Velvet"
                    id="Red-Velvet-price"
                    aria-hidden="false"
                  >
                    R$ 15,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet"
                  id="Red-Velvet-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__03-008"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Red-Velvet opBtnAdd-Red-Velvet"
                    id="btnAdd__03-008"
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
                    id="minusAlert__03-008"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Red-Velvet opBtnRemove-Red-Velvet"
                    id="btnSubt__03-008"
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
