import { useEffect, useRef, useState } from "react";
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
import { createRoot } from "react-dom/client";

export default function TravessaHC(): JSX.Element {
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
          currentRef instanceof HTMLDialogElement &&
            createRoot(currentRef).unmount();
        }
      }, 1000);
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
          id="div-Travessa-Recheada__15-Banoffee-Ninho®_trufado_com_Mousse_de_Nutella®-Pavê_de_Morango_com_Ninho®-Pavê_de_Sonho_de_Valsa®-Torta_de_Limão"
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
                <span aria-hidden="false">Travessa Recheada</span>
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
                className="opLi opLi-Banoffee__15-001"
                id="li-Banoffee__15-001"
                data-title="Travessa recheada banoffee"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Banoffee"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Banoffee"
                    id="Banoffee-title"
                    aria-hidden="false"
                  >
                    Banoffee
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Banoffee"
                    id="Banoffee-desc"
                    aria-hidden="false"
                  >
                    Massa de farofinha de biscoito recheada com uma deliciosa
                    combinação de camadas de bananas doces e intenso doce de
                    leite em uma travessa finalizada com camada generosa de
                    chantili. Perfeita para qualquer sobremesa!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Banoffee"
                    id="Banoffee-price"
                    aria-hidden="false"
                  >
                    R$ 80,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banoffee"
                  id="Banoffee-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__15-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Banoffee opBtnAdd-Banoffee"
                    id="btnAdd__15-001"
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
                    id="minusAlert__15-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Banoffee opBtnRemove-Banoffee"
                    id="btnSubt__15-001"
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
                className="opLi opLi-Ninho®-trufado-com-Mousse-de-Nutella®__15-002"
                id="li-Ninho®-trufado-com-Mousse-de-Nutella®__15-002"
                data-title="Travessa recheada ninho® trufado com mousse de nutella®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho®-trufado-com-Mousse-de-Nutella®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ninho®-trufado-com-Mousse-de-Nutella®"
                    id="Ninho®-trufado-com-Mousse-de-Nutella®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    <span
                      id="NinhoSliceNinho®-trufado-com-Mousse-de-Nutella®-title"
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
                      id="trufado_com_Mousse_de_NutellaSliceNinho®-trufado-com-Mousse-de-Nutella®-title"
                      className="brandedNameSpan trufado_com_Mousse_de_NutellaSlice"
                      aria-hidden="false"
                    >
                      trufado com Mousse de Nutella
                    </span>
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                    <span
                      id="SliceNinho®-trufado-com-Mousse-de-Nutella®-title"
                      className="brandedNameSpan Slice"
                      aria-hidden="false"
                    ></span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ninho®-trufado-com-Mousse-de-Nutella®"
                    id="Ninho®-trufado-com-Mousse-de-Nutella®-desc"
                    aria-hidden="false"
                  >
                    Delicioso creme de Ninho® trufado no chocolate branco,
                    envolvido com camadas suculentas de mousse de Nutella®!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ninho®-trufado-com-Mousse-de-Nutella®"
                    id="Ninho®-trufado-com-Mousse-de-Nutella®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;85,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho®-trufado-com-Mousse-de-Nutella®"
                  id="Ninho®-trufado-com-Mousse-de-Nutella®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__15-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ninho®-trufado-com-Mousse-de-Nutella® opBtnAdd-Ninho®-trufado-com-Mousse-de-Nutella®"
                    id="btnAdd__15-002"
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
                    id="minusAlert__15-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ninho®-trufado-com-Mousse-de-Nutella® opBtnRemove-Ninho®-trufado-com-Mousse-de-Nutella®"
                    id="btnSubt__15-002"
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
                className="opLi opLi-Pavê-de-Morango-com-Ninho®__15-003"
                id="li-Pave-de-Morango-com-Ninho®__15-003"
                data-title="Travessa recheada pavê de morango com ninho®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pavê-de-Morango-com-Ninho®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Pavê-de-Morango-com-Ninho®"
                    id="Pave-de-Morango-com-Ninho®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Pavê de Morango com Ninho
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "103%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Pavê-de-Morango-com-Ninho®"
                    id="Pave-de-Morango-com-Ninho®-desc"
                    aria-hidden="false"
                  >
                    Mousse cremoso de Ninho® acompanhado de pedaços de morango
                    frescos e finalizado com uma cobertura de chantili.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Pavê-de-Morango-com-Ninho®"
                    id="Pave-de-Morango-com-Ninho®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;85,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pavê-de-Morango-com-Ninho®"
                  id="Pave-de-Morango-com-Ninho®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__15-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Pavê-de-Morango-com-Ninho® opBtnAdd-Pavê-de-Morango-com-Ninho®"
                    id="btnAdd__15-003"
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
                    id="minusAlert__15-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Pavê-de-Morango-com-Ninho® opBtnRemove-Pavê-de-Morango-com-Ninho®"
                    id="btnSubt__15-003"
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
                className="opLi opLi-Pavê-de-Sonho-de-Valsa®__15-004"
                id="li-Pave-de-Sonho-de-Valsa®__15-004"
                data-title="Travessa recheada pavê de sonho de valsa®"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pavê-de-Sonho-de-Valsa®"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Pavê-de-Sonho-de-Valsa®"
                    id="Pave-de-Sonho-de-Valsa®-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    Pavê de Sonho de Valsa
                    <span
                      className="brandSpan"
                      style={{ fontSize: "16px", left: "101%" }}
                      aria-hidden="false"
                    >
                      ®
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Pavê-de-Sonho-de-Valsa®"
                    id="Pave-de-Sonho-de-Valsa®-desc"
                    aria-hidden="false"
                  >
                    Saboroso creme combinando chocolate branco e ao leite
                    intercalado com camadas crocantes de Sonho de Valsa® em uma
                    travessa finalizada com uma camada de chantili!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Pavê-de-Sonho-de-Valsa®"
                    id="Pave-de-Sonho-de-Valsa®-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;90,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pavê-de-Sonho-de-Valsa®"
                  id="Pave-de-Sonho-de-Valsa®-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__15-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Pavê-de-Sonho-de-Valsa® opBtnAdd-Pavê-de-Sonho-de-Valsa®"
                    id="btnAdd__15-004"
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
                    id="minusAlert__15-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Pavê-de-Sonho-de-Valsa® opBtnRemove-Pavê-de-Sonho-de-Valsa®"
                    id="btnSubt__15-004"
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
                className="opLi opLi-Torta-de-Limão__15-005"
                id="li-Torta-de-Limão__15-005"
                data-title="Travessa recheada torta de limão"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Torta-de-Limão"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Torta-de-Limão"
                    id="Torta-de-Limão-title"
                    aria-hidden="false"
                  >
                    Torta de Limão
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Torta-de-Limão"
                    id="Torta-de-Limão-desc"
                    aria-hidden="false"
                  >
                    Deliciosas camadas de massa de biscoito coberto com um
                    cremoso mousse de limão, finalizadas com generosa camada de
                    chantili.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Torta-de-Limão"
                    id="Torta-de-Limão-price"
                    aria-hidden="false"
                  >
                    R$ 80,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Torta-de-Limão"
                  id="Torta-de-Limão-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__15-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Torta-de-Limão opBtnAdd-Torta-de-Limão"
                    id="btnAdd__15-005"
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
                    id="minusAlert__15-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Torta-de-Limão opBtnRemove-Torta-de-Limão"
                    id="btnSubt__15-005"
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
