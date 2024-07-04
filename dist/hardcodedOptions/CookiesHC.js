import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function CookiesHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Cookie-Recheado__08-Chocolatudo-Duochoco-Ferrero_Rocher\u00AE-Nutella\u00AE-Pistache-Red_Velvet_com_Chocolate_branco", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Cookie Recheado" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Chocolatudo__08-001", id: "li-Chocolatudo__08-001", "data-title": "Cookie recheado chocolatudo", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolatudo", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Chocolatudo", id: "Chocolatudo-title", "aria-hidden": "false", children: "Chocolatudo" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Chocolatudo", id: "Chocolatudo-desc", "aria-hidden": "false", children: "Dose dupla de chocolate preto meio-amargo, na massa e no recheio, para os amantes do sabor intenso do cacau!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Chocolatudo", id: "Chocolatudo-price", "aria-hidden": "false", children: "R$ 10,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolatudo", id: "Chocolatudo-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Chocolatudo opBtnAdd-Chocolatudo", id: "btnAdd__08-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Chocolatudo opBtnRemove-Chocolatudo", id: "btnSubt__08-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Duochoco__08-002", id: "li-Duochoco__08-002", "data-title": "Cookie recheado duochoco", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Duochoco", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Duochoco", id: "Duochoco-title", "aria-hidden": "false", children: "Duochoco" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Duochoco", id: "Duochoco-desc", "aria-hidden": "false", children: "Massa de chocolate preto meio-amargo, com equilibrado recheio de chocolate branco." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Duochoco", id: "Duochoco-price", "aria-hidden": "false", children: "R$ 10,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Duochoco", id: "Duochoco-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Duochoco opBtnAdd-Duochoco", id: "btnAdd__08-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Duochoco opBtnRemove-Duochoco", id: "btnSubt__08-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Ferrero-Rocher\u00AE__08-003", id: "li-Ferrero-Rocher\u00AE__08-003", "data-title": "Cookie recheado ferrero rocher\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ferrero-Rocher\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Ferrero-Rocher\u00AE", id: "Ferrero-Rocher\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: ["Ferrero Rocher", _jsx("span", { className: "brandSpan", style: { fontSize: "16px", left: "100%" }, "aria-hidden": "false", children: "\u00AE" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Ferrero-Rocher\u00AE", id: "Ferrero-Rocher\u00AE-desc", "aria-hidden": "false", children: "Massa de chocolate com o sabor convidativo, \u00FAnico e levemente granulado do bombom de Ferrero Rocher\u00AE" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Ferrero-Rocher\u00AE", id: "Ferrero-Rocher\u00AE-price", "aria-hidden": "false", children: "R$\u00A012,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ferrero-Rocher\u00AE", id: "Ferrero-Rocher\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Ferrero-Rocher\u00AE opBtnAdd-Ferrero-Rocher\u00AE", id: "btnAdd__08-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Ferrero-Rocher\u00AE opBtnRemove-Ferrero-Rocher\u00AE", id: "btnSubt__08-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Nutella\u00AE__08-004", id: "li-Nutella\u00AE__08-004", "data-title": "Cookie recheado nutella\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Nutella\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Nutella\u00AE", id: "Nutella\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: ["Nutella", _jsx("span", { className: "brandSpan", style: { fontSize: "16px", left: "101%" }, "aria-hidden": "false", children: "\u00AE" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Nutella\u00AE", id: "Nutella\u00AE-desc", "aria-hidden": "false", children: "Massa de baunilha com recheio caprichado de gotas de Nutella." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Nutella\u00AE", id: "Nutella\u00AE-price", "aria-hidden": "false", children: "R$ 10,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Nutella\u00AE", id: "Nutella\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Nutella\u00AE opBtnAdd-Nutella\u00AE", id: "btnAdd__08-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Nutella\u00AE opBtnRemove-Nutella\u00AE", id: "btnSubt__08-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Pistache__08-005", id: "li-Pistache__08-005", "data-title": "Cookie recheado pistache", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pistache", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Pistache", id: "Pistache-title", "aria-hidden": "false", children: "Pistache" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Pistache", id: "Pistache-desc", "aria-hidden": "false", children: "Massa de baunilha com gotas recheadas de chocolate branco combinadas com pistache em mistura com um delicioso brigadeiro!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Pistache", id: "Pistache-price", "aria-hidden": "false", children: "R$ 10,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pistache", id: "Pistache-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-005", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Pistache opBtnAdd-Pistache", id: "btnAdd__08-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-005", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Pistache opBtnRemove-Pistache", id: "btnSubt__08-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Red-Velvet-com-Chocolate-branco__08-006", id: "li-Red-Velvet-com-Chocolate-branco__08-006", "data-title": "Cookie recheado red velvet com chocolate branco", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Red-Velvet-com-Chocolate-branco", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Red-Velvet-com-Chocolate-branco", id: "Red-Velvet-com-Chocolate-branco-title", "aria-hidden": "false", children: "Red Velvet com Chocolate branco" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Red-Velvet-com-Chocolate-branco", id: "Red-Velvet-com-Chocolate-branco-desc", "aria-hidden": "false", children: "Massa de Red Velvet com recheio de chocolate branco, proporcionando suavidade e do\u00E7ura." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Red-Velvet-com-Chocolate-branco", id: "Red-Velvet-com-Chocolate-branco-price", "aria-hidden": "false", children: "R$ 10,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet-com-Chocolate-branco", id: "Red-Velvet-com-Chocolate-branco-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__08-006", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Red-Velvet-com-Chocolate-branco opBtnAdd-Red-Velvet-com-Chocolate-branco", id: "btnAdd__08-006", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__08-006", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Red-Velvet-com-Chocolate-branco opBtnRemove-Red-Velvet-com-Chocolate-branco", id: "btnSubt__08-006", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
