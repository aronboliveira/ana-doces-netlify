import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function BrowniesHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Brownie-Simples__06-Com_Nozes-Sem_Nozes", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Brownie Simples" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Com-Nozes__06-001", id: "li-Com-Nozes__06-001", "data-title": "Brownie simples com nozes", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Nozes", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Com-Nozes", id: "Com-Nozes-title", "aria-hidden": "false", children: "Com Nozes" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Com-Nozes", id: "Com-Nozes-desc", "aria-hidden": "false", children: "Adi\u00E7\u00E3o de nozes de nogueira em excelente harmoniza\u00E7\u00E3o!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Com-Nozes", id: "Com-Nozes-price", "aria-hidden": "false", children: "R$\u00A09,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Nozes", id: "Com-Nozes-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__06-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Com-Nozes opBtnAdd-Com-Nozes", id: "btnAdd__06-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__06-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Com-Nozes opBtnRemove-Com-Nozes", id: "btnSubt__06-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Sem-Nozes__06-002", id: "li-Sem-Nozes__06-002", "data-title": "Brownie simples sem nozes", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Sem-Nozes", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Sem-Nozes", id: "Sem-Nozes-title", "aria-hidden": "false", children: "Sem Nozes" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Sem-Nozes", id: "Sem-Nozes-desc", "aria-hidden": "false", children: "O cl\u00E1ssico! Ainda mais maciez e cremosidade." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Sem-Nozes", id: "Sem-Nozes-price", "aria-hidden": "false", children: "R$\u00A08,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Sem-Nozes", id: "Sem-Nozes-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__06-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Sem-Nozes opBtnAdd-Sem-Nozes", id: "btnAdd__06-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__06-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Sem-Nozes opBtnRemove-Sem-Nozes", id: "btnSubt__06-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
