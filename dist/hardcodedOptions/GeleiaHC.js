import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function GeleiaHC() {
    const optionsRef = useRef(null);
    const [shouldShowOptions, setOptions] = useState(true);
    useEffect(() => {
        const handleKeyPress = (press) => {
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
                throw htmlElementNotFound(optionsRef.current, `validation of Options Reference Modal`);
            shouldShowOptions && optionsRef.current.showModal();
            optionsRef.current.querySelectorAll(".opBtnAdd").forEach((addBtn) => {
                addBtn.addEventListener("click", function (c) {
                    handleOrderAdd(this || c.currentTarget, document.getElementById("total"));
                });
            });
            optionsRef.current.querySelectorAll(".opBtnRemove").forEach((addBtn) => {
                addBtn.addEventListener("click", function (c) {
                    handleOrderSubtract(this || c.currentTarget, document.getElementById("total"));
                });
            });
        }
        catch (e) {
            console.error(`Error executing useEffect for optionsRef:\n${e.message}`);
            setTimeout(() => {
                try {
                    if (!(optionsRef.current instanceof HTMLDialogElement))
                        throw htmlElementNotFound(optionsRef.current, `validation of Active Options Dialog`, ["HTMLDialogElement"]);
                    fixModalOpening(optionsRef.current.id);
                }
                catch (e) {
                    console.error(`Error executing call for fixModalOpening:\n${e.message}`);
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
        const modalInterv = setInterval((interv) => {
            if (optionsRef.current?.open === false) {
                optionsRef.current.close();
                setOptions && setOptions(false);
                clearInterval(interv);
            }
        }, 100);
        const clearAddInterv = setInterval(() => {
            if (idRef && !document.getElementById(idRef))
                clearInterval(modalInterv);
        }, 60000);
        setTimeout(() => {
            if (idRef && !document.getElementById(idRef))
                clearInterval(modalInterv);
            clearInterval(clearAddInterv);
        }, 300000);
        const handlePopState = () => {
            const idRef = optionsRef.current?.id || "dialog";
            optionsRef.current?.close();
            setOptions && setOptions(false);
            history.pushState({}, "", location.href
                .slice(0, /\?&/g.test(location.href)
                ? location.href.indexOf("?&")
                : location.href.length)
                .replace("/h?", "/html?"));
            const allDialogs = [];
            setTimeout(() => {
                document.querySelectorAll(idRef).forEach((ref) => {
                    if (ref.id !== "")
                        allDialogs.push(`#${ref.id}`);
                    else if (ref instanceof HTMLDialogElement)
                        allDialogs.push("dialog");
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
                        dispatchEvent(new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            clientX: innerWidth * 0.9,
                            clientY: innerHeight * 0.5,
                        }));
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
        return () => {
            removeEventListener("popstate", handlePopState);
            clearInterval(modalInterv);
        };
    }, [shouldShowOptions]);
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Geleia-Artesanal__10-Frutas_Vermelhas-Maracuj\u00E1-Morango-P\u00EAssego", ref: optionsRef, onClick: (click) => {
                if (isClickOutside(click, optionsRef.current).some((coord) => coord === true)) {
                    setOptions && setOptions(!shouldShowOptions);
                    if (optionsRef.current) {
                        shouldShowOptions
                            ? optionsRef.current.showModal()
                            : optionsRef.current.close();
                        optionsRef.current.closest(".contDlg")?.remove() ||
                            optionsRef.current.remove();
                    }
                }
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Geleia Artesanal" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Frutas-Vermelhas__10-001", id: "li-Frutas-Vermelhas__10-001", "data-title": "Geleia artesanal frutas vermelhas", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Frutas-Vermelhas", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Frutas-Vermelhas", id: "Frutas-Vermelhas-title", "aria-hidden": "false", children: "Frutas Vermelhas" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Frutas-Vermelhas", id: "Frutas-Vermelhas-desc", "aria-hidden": "false", children: "Um cl\u00E1ssico conquistador! A combina\u00E7\u00E3o de frutas vermelhas \u00E9 garantia de do\u00E7ura equilibrada e paladar requintado." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Frutas-Vermelhas", id: "Frutas-Vermelhas-price", "aria-hidden": "false", children: "R$\u00A025,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Frutas-Vermelhas", id: "Frutas-Vermelhas-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__10-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Frutas-Vermelhas opBtnAdd-Frutas-Vermelhas", id: "btnAdd__10-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__10-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Frutas-Vermelhas opBtnRemove-Frutas-Vermelhas", id: "btnSubt__10-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Maracuj\u00E1__10-002", id: "li-Maracuj\u00E1__10-002", "data-title": "Geleia artesanal maracuj\u00E1", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Maracuj\u00E1", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-title", "aria-hidden": "false", children: "Maracuj\u00E1" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-desc", "aria-hidden": "false", children: "O sabor intenso e suavemente \u00E1cido do Maracuj\u00E1 em uma geleia perfeita para acompanhar massas doces e p\u00E3es." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-price", "aria-hidden": "false", children: "R$ 20,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maracuj\u00E1", id: "Maracuj\u00E1-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__10-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Maracuj\u00E1 opBtnAdd-Maracuj\u00E1", id: "btnAdd__10-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__10-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Maracuj\u00E1 opBtnRemove-Maracuj\u00E1", id: "btnSubt__10-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Morango__10-003", id: "li-Morango__10-003", "data-title": "Geleia artesanal morango", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Morango", id: "Morango-title", "aria-hidden": "false", children: "Morango" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Morango", id: "Morango-desc", "aria-hidden": "false", children: "Feita com frutos frescos e doces, a geleia de morango \u00E9 um cl\u00E1ssico e garantia de satisfa\u00E7\u00E3o!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Morango", id: "Morango-price", "aria-hidden": "false", children: "R$ 20,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango", id: "Morango-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__10-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Morango opBtnAdd-Morango", id: "btnAdd__10-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__10-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Morango opBtnRemove-Morango", id: "btnSubt__10-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-P\u00EAssego__10-004", id: "li-Pessego__10-004", "data-title": "Geleia artesanal p\u00EAssego", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-P\u00EAssego", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-P\u00EAssego", id: "Pessego-title", "aria-hidden": "false", children: "P\u00EAssego" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-P\u00EAssego", id: "Pessego-desc", "aria-hidden": "false", children: "Delicado e ao mesmo tempo intenso com acento equilibrado, a geleia de p\u00EAssego \u00E9 perfeita para todas as sobremesas!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-P\u00EAssego", id: "Pessego-price", "aria-hidden": "false", children: "R$ 20,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-P\u00EAssego", id: "Pessego-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__10-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-P\u00EAssego opBtnAdd-P\u00EAssego", id: "btnAdd__10-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__10-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-P\u00EAssego opBtnRemove-P\u00EAssego", id: "btnSubt__10-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
