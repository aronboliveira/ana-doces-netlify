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

export default function TacaHC(): JSX.Element {
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
          id="div-Taça-Recheada__13-Banoffee-Chocolate_com_Frutas_Vermelhas-Chocolate_com_Morango-Ninho®_com_Morango-Ninho®_com_Nutella®_e_Brownie"
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
                <span aria-hidden="false">Taça Recheada</span>
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
                className="opLi opLi-Banoffee__13-001"
                id="li-Banoffee__13-001"
                data-title="Taça recheada banoffee"
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
                    Deliciosa combinação da doçura da banana e da intensidade do
                    doce de leite em uma taça perfeita para qualquer sobremesa!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Banoffee"
                    id="Banoffee-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;85,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banoffee"
                  id="Banoffee-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__13-001"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Banoffee opBtnAdd-Banoffee"
                    id="btnAdd__13-001"
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
                    id="minusAlert__13-001"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Banoffee opBtnRemove-Banoffee"
                    id="btnSubt__13-001"
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
                className="opLi opLi-Chocolate-com-Frutas-Vermelhas__13-002"
                id="li-Chocolate-com-Frutas-Vermelhas__13-002"
                data-title="Taça recheada chocolate com frutas vermelhas"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Frutas-Vermelhas"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Frutas-Vermelhas"
                    id="Chocolate-com-Frutas-Vermelhas-title"
                    aria-hidden="false"
                  >
                    Chocolate com Frutas Vermelhas
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Frutas-Vermelhas"
                    id="Chocolate-com-Frutas-Vermelhas-desc"
                    aria-hidden="false"
                  >
                    Irresistível mousse de chocolate meio-amargo com generoso
                    acréscimo de frutas vermelhas frescas.
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Frutas-Vermelhas"
                    id="Chocolate-com-Frutas-Vermelhas-price"
                    aria-hidden="false"
                  >
                    R$ 80,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Frutas-Vermelhas"
                  id="Chocolate-com-Frutas-Vermelhas-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__13-002"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Frutas-Vermelhas opBtnAdd-Chocolate-com-Frutas-Vermelhas"
                    id="btnAdd__13-002"
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
                    id="minusAlert__13-002"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Frutas-Vermelhas opBtnRemove-Chocolate-com-Frutas-Vermelhas"
                    id="btnSubt__13-002"
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
                className="opLi opLi-Chocolate-com-Morango__13-003"
                id="li-Chocolate-com-Morango__13-003"
                data-title="Taça recheada chocolate com morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Chocolate-com-Morango"
                    id="Chocolate-com-Morango-title"
                    aria-hidden="false"
                  >
                    Chocolate com Morango
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Chocolate-com-Morango"
                    id="Chocolate-com-Morango-desc"
                    aria-hidden="false"
                  >
                    A cremosidade e intensidade dos mousses de chocolates branco
                    e meio-amargo combinados com o frescor e leve acidez do
                    morango com um toque final de brigadeiro em uma sobremesa
                    conquistadora!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Chocolate-com-Morango"
                    id="Chocolate-com-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;90,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Morango"
                  id="Chocolate-com-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__13-003"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Chocolate-com-Morango opBtnAdd-Chocolate-com-Morango"
                    id="btnAdd__13-003"
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
                    id="minusAlert__13-003"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Chocolate-com-Morango opBtnRemove-Chocolate-com-Morango"
                    id="btnSubt__13-003"
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
                className="opLi opLi-Ninho®-com-Morango__13-004"
                id="li-Ninho®-com-Morango__13-004"
                data-title="Taça recheada ninho® com morango"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho®-com-Morango"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ninho®-com-Morango"
                    id="Ninho®-com-Morango-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    {" "}
                    <span
                      id="NinhoSliceNinho®-com-Morango-title"
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
                      id="_com_MorangoSliceNinho®-com-Morango-title"
                      className="brandedNameSpan _com_MorangoSlice"
                      aria-hidden="false"
                    >
                      com Morango
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ninho®-com-Morango"
                    id="Ninho®-com-Morango-desc"
                    aria-hidden="false"
                  >
                    Creme de Ninho® com morangos frescos. Para os amantes de um
                    sabor suave, refrescante e levemente granuloso!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ninho®-com-Morango"
                    id="Ninho®-com-Morango-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;95,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho®-com-Morango"
                  id="Ninho®-com-Morango-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__13-004"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ninho®-com-Morango opBtnAdd-Ninho®-com-Morango"
                    id="btnAdd__13-004"
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
                    id="minusAlert__13-004"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ninho®-com-Morango opBtnRemove-Ninho®-com-Morango"
                    id="btnSubt__13-004"
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
                className="opLi opLi-Ninho®-com-Nutella®-e-Brownie__13-005"
                id="li-Ninho®-com-Nutella®-e-Brownie__13-005"
                data-title="Taça recheada ninho® com nutella® e brownie"
                aria-hidden="false"
              >
                <div
                  className="fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho®-com-Nutella®-e-Brownie"
                  aria-hidden="false"
                >
                  <strong
                    className="opSpan opSpanName opSpan-Ninho®-com-Nutella®-e-Brownie"
                    id="Ninho®-com-Nutella®-e-Brownie-title"
                    aria-hidden="false"
                    style={{ position: "relative" }}
                  >
                    <span
                      id="NinhoSliceNinho®-com-Nutella®-e-Brownie-title"
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
                      id="com_NutellaSliceNinho®-com-Nutella®-e-Brownie-title"
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
                      id="e_BrownieSliceNinho®-com-Nutella®-e-Brownie-title"
                      className="brandedNameSpan e_BrownieSlice"
                      aria-hidden="false"
                    >
                      e Brownie
                    </span>
                  </strong>
                  <span
                    className="opSpan opSpanDesc opSpan-Ninho®-com-Nutella®-e-Brownie"
                    id="Ninho®-com-Nutella®-e-Brownie-desc"
                    aria-hidden="false"
                  >
                    Creme de Ninho® com Nutella® e pedaços de Brownie.
                    Equilibrando intensidade, granulosidade e suavidade na
                    medida certa, é uma certeza de sucesso!
                  </span>
                  <span
                    className="opSpan opSpanPrice opSpan-Ninho®-com-Nutella®-e-Brownie"
                    id="Ninho®-com-Nutella®-e-Brownie-price"
                    aria-hidden="false"
                  >
                    R$&nbsp;85,00
                  </span>
                </div>
                <div
                  className="fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho®-com-Nutella®-e-Brownie"
                  id="Ninho®-com-Nutella®-e-Brownie-btnsDiv"
                  aria-hidden="false"
                >
                  <span
                    className="addAlert"
                    id="addAlert__13-005"
                    aria-hidden="false"
                  >
                    Item adicionado!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnAdd opBtn-Ninho®-com-Nutella®-e-Brownie opBtnAdd-Ninho®-com-Nutella®-e-Brownie"
                    id="btnAdd__13-005"
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
                    id="minusAlert__13-005"
                    aria-hidden="false"
                  >
                    Item removido!
                  </span>
                  <button
                    type="button"
                    className="biBtn opBtn opBtnRemove opBtn-Ninho®-com-Nutella®-e-Brownie opBtnRemove-Ninho®-com-Nutella®-e-Brownie"
                    id="btnSubt__13-005"
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
