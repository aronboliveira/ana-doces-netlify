import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { applySubOptParam, clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, normalizeSpacing, recalculateByOption, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function PalhaHC() {
    const optionsRef = useRef(null);
    const defOptRef = useRef(null);
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
        try {
            if (!(defOptRef.current instanceof HTMLInputElement &&
                (defOptRef.current.type === "radio" ||
                    defOptRef.current.type === "checkbox")))
                throw htmlElementNotFound(defOptRef.current, `Validation of Default Option`, ['<input type="radio"> || <input type="checkbox">']);
            defOptRef.current.checked = true;
            applySubOptParam(defOptRef.current);
        }
        catch (e) {
            console.error(`Error:${e.message}`);
        }
    }, [defOptRef]);
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Palha-Gourmet-\u2014-conjunto__11-Com_Castanha-Com_Castanha_e_Nozes-Com_Nozes", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Palha Gourmet \u2014 conjunto" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_75g-150g", "aria-hidden": "false", children: _jsxs("div", { className: "opSubGroup form-check", id: "contmainMenu_75g-150g", "aria-hidden": "false", children: [_jsxs("label", { className: "subopLab form-check-label subopLab0", htmlFor: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Lab", id: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Lab", "aria-hidden": "false", children: [_jsx("input", { ref: defOptRef, className: "subopInp form-check-input subopInp0", type: "radio", value: "75g", name: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp", id: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp", "aria-hidden": "false", "aria-checked": "true", "aria-disabled": "false", onClick: (ev) => {
                                                if (ev.currentTarget.checked) {
                                                    try {
                                                        if (!(ev.currentTarget instanceof HTMLInputElement))
                                                            throw new Error(`Error validating instance for Event Target. Obtained instance: ${ev.currentTarget.constructor.name}`);
                                                        const relMenu = ev.currentTarget.closest("nav");
                                                        if (!(relMenu instanceof HTMLElement))
                                                            throw htmlElementNotFound(relMenu, `validation of relMenu for ${ev.currentTarget.id ||
                                                                `${ev.currentTarget.tagName} type "${ev.currentTarget.type}"`}`, ["HTMLMenuElement"]);
                                                        recalculateByOption(".opSpanPrice", relMenu, ev.currentTarget.value);
                                                    }
                                                    catch (e) {
                                                        console.error(`Error executing callback for ${ev.type} during ${ev.timeStamp}:${e.message}`);
                                                    }
                                                    try {
                                                        if (ev.currentTarget.type === "radio") {
                                                            const normalizedValue = normalizeSpacing(ev.currentTarget.value);
                                                            const activeOp = /&Op-/g.test(location.href)
                                                                ? location.href.slice(location.href.indexOf("&Op-"))
                                                                : "";
                                                            history.pushState({}, "", location.href.replaceAll(activeOp, ""));
                                                            ev.currentTarget.checked
                                                                ? history.pushState({}, "", `${location.href}&Op-${normalizedValue}`)
                                                                : history.pushState({}, "", `${location.href}`.replaceAll(`&Op-${normalizedValue}`, ""));
                                                        }
                                                    }
                                                    catch (e2) {
                                                        console.error(`Error executing procedure for adding url param about suboption:\n${e2.message}`);
                                                    }
                                                }
                                            } }), _jsx("span", { className: "subopText", "aria-hidden": "false", children: "75g" })] }), _jsxs("label", { className: "subopLab form-check-label subopLab0", htmlFor: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Lab", id: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Lab", "aria-hidden": "false", children: [_jsx("input", { className: "subopInp form-check-input subopInp0", type: "radio", value: "150g", name: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-75g0Inp", id: "contmainMenu_75g-150g-Com_Castanha-Com_Castanha_e_Nozes-Com_Noze-150g1Inp", "aria-hidden": "false", "aria-checked": "false", "aria-disabled": "false", onClick: (ev) => {
                                                if (ev.currentTarget.checked) {
                                                    try {
                                                        if (!(ev.currentTarget instanceof HTMLInputElement))
                                                            throw new Error(`Error validating instance for Event Target. Obtained instance: ${ev.currentTarget.constructor.name}`);
                                                        const relMenu = ev.currentTarget.closest("nav");
                                                        if (!(relMenu instanceof HTMLElement))
                                                            throw htmlElementNotFound(relMenu, `validation of relMenu for ${ev.currentTarget.id ||
                                                                `${ev.currentTarget.tagName} type "${ev.currentTarget.type}"`}`, ["HTMLMenuElement"]);
                                                        recalculateByOption(".opSpanPrice", relMenu, ev.currentTarget.value);
                                                    }
                                                    catch (e) {
                                                        console.error(`Error executing callback for ${ev.type} during ${ev.timeStamp}:${e.message}`);
                                                    }
                                                    try {
                                                        if (ev.currentTarget.type === "radio") {
                                                            const normalizedValue = normalizeSpacing(ev.currentTarget.value);
                                                            const activeOp = /&Op-/g.test(location.href)
                                                                ? location.href.slice(location.href.indexOf("&Op-"))
                                                                : "";
                                                            history.pushState({}, "", location.href.replaceAll(activeOp, ""));
                                                            ev.currentTarget.checked
                                                                ? history.pushState({}, "", `${location.href}&Op-${normalizedValue}`)
                                                                : history.pushState({}, "", `${location.href}`.replaceAll(`&Op-${normalizedValue}`, ""));
                                                        }
                                                    }
                                                    catch (e2) {
                                                        console.error(`Error executing procedure for adding url param about suboption:\n${e2.message}`);
                                                    }
                                                }
                                            } }), _jsx("span", { className: "subopText", "aria-hidden": "false", children: "150g" })] })] }) }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Com-Castanha__11-001", id: "li-Com-Castanha__11-001", "data-title": "Palha gourmet \u2014 conjunto com castanha", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Castanha", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Com-Castanha", id: "Com-Castanha-title", "aria-hidden": "false", children: "Com Castanha" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Com-Castanha", id: "Com-Castanha-desc", "aria-hidden": "false", children: "Crocante e levemente acentuado, o sabor \u00FAnico da castanha-de-caju incorporado no marcante sabor da Palha Italiana Gourmet" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Com-Castanha", id: "Com-Castanha-price", "aria-hidden": "false", children: "R$ 8,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Castanha", id: "Com-Castanha-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__11-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Com-Castanha opBtnAdd-Com-Castanha", id: "btnAdd__11-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__11-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Com-Castanha opBtnRemove-Com-Castanha", id: "btnSubt__11-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Com-Castanha-e-Nozes__11-002", id: "li-Com-Castanha-e-Nozes__11-002", "data-title": "Palha gourmet \u2014 conjunto com castanha e nozes", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Castanha-e-Nozes", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Com-Castanha-e-Nozes", id: "Com-Castanha-e-Nozes-title", "aria-hidden": "false", children: "Com Castanha e Nozes" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Com-Castanha-e-Nozes", id: "Com-Castanha-e-Nozes-desc", "aria-hidden": "false", children: "Croc\u00E2ncia m\u00E1xima! Para os que amam a textura consistente dos cereais em combina\u00E7\u00E3o com a maciez da Palha Italiana Gourmet" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Com-Castanha-e-Nozes", id: "Com-Castanha-e-Nozes-price", "aria-hidden": "false", children: "R$ 8,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Castanha-e-Nozes", id: "Com-Castanha-e-Nozes-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__11-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Com-Castanha-e-Nozes opBtnAdd-Com-Castanha-e-Nozes", id: "btnAdd__11-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__11-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Com-Castanha-e-Nozes opBtnRemove-Com-Castanha-e-Nozes", id: "btnSubt__11-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Com-Nozes__11-003", id: "li-Com-Nozes__11-003", "data-title": "Palha gourmet \u2014 conjunto com nozes", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Com-Nozes", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Com-Nozes", id: "Com-Nozes-title", "aria-hidden": "false", children: "Com Nozes" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Com-Nozes", id: "Com-Nozes-desc", "aria-hidden": "false", children: "Para os amantes do sabor granulado das nozes de nogueira. Croc\u00E2ncia extra!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Com-Nozes", id: "Com-Nozes-price", "aria-hidden": "false", children: "R$ 8,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Com-Nozes", id: "Com-Nozes-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__11-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Com-Nozes opBtnAdd-Com-Nozes", id: "btnAdd__11-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__11-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Com-Nozes opBtnRemove-Com-Nozes", id: "btnSubt__11-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
