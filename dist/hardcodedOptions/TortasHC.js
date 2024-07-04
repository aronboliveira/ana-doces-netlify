import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { applySubOptParam, clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, normalizeSpacing, recalculateByOption, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function TortasHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Torta-Gelada__14-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morango", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Torta Gelada" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_Pequena-M\u00E9dia,Grande", "aria-hidden": "false", children: _jsxs("div", { className: "opSubGroup form-check", id: "contmainMenu_Pequena-M\u00E9dia,Grande", "aria-hidden": "false", children: [_jsxs("label", { className: "subopLab form-check-label subopLab0", htmlFor: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Lab", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Lab", "aria-hidden": "false", children: [_jsx("input", { className: "subopInp form-check-input subopInp0", type: "radio", value: "pequena", name: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Inp", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Inp", "aria-hidden": "false", "aria-checked": "true", "aria-disabled": "false", onClick: (ev) => {
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
                                            } }), _jsx("span", { className: "subopText", "aria-hidden": "false", children: "Pequena" })] }), _jsxs("label", { className: "subopLab form-check-label subopLab0", htmlFor: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-M\u00E9dia1Lab", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-M\u00E9dia1Lab", "aria-hidden": "false", children: [_jsx("input", { ref: defOptRef, className: "subopInp form-check-input subopInp0", type: "radio", value: "m\u00E9dia", name: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Inp", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-M\u00E9dia1Inp", "aria-hidden": "false", "aria-checked": "false", "aria-disabled": "false", onClick: (ev) => {
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
                                            } }), _jsx("span", { className: "subopText", "aria-hidden": "false", children: "M\u00E9dia" })] }), _jsxs("label", { className: "subopLab form-check-label subopLab0", htmlFor: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Grande2Lab", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Grande2Lab", "aria-hidden": "false", children: [_jsx("input", { className: "subopInp form-check-input subopInp0", type: "radio", value: "grande", name: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Pequena0Inp", id: "contmainMenu_Pequena-M\u00E9dia,Grande-Chocolate_com_Maracuj\u00E1-Lim\u00E3o-Maracuj\u00E1-Morang-Grande2Inp", "aria-hidden": "false", "aria-checked": "false", "aria-disabled": "false", onClick: (ev) => {
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
                                            } }), _jsx("span", { className: "subopText", "aria-hidden": "false", children: "Grande" })] })] }) }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Chocolate-com-Maracuj\u00E1__14-001", id: "li-Chocolate-com-Maracuj\u00E1__14-001", "data-title": "Torta gelada chocolate com maracuj\u00E1", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Maracuj\u00E1", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Chocolate-com-Maracuj\u00E1", id: "Chocolate-com-Maracuj\u00E1-title", "aria-hidden": "false", children: "Chocolate com Maracuj\u00E1" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Chocolate-com-Maracuj\u00E1", id: "Chocolate-com-Maracuj\u00E1-desc", "aria-hidden": "false", children: "Combina\u00E7\u00E3o provocante de chocolate e maracuj\u00E1, enaltecendo a intensidade dos dois sabores!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Chocolate-com-Maracuj\u00E1", id: "Chocolate-com-Maracuj\u00E1-price", "aria-hidden": "false", children: "R$ 45,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Maracuj\u00E1", id: "Chocolate-com-Maracuj\u00E1-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__14-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Chocolate-com-Maracuj\u00E1 opBtnAdd-Chocolate-com-Maracuj\u00E1", id: "btnAdd__14-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__14-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Chocolate-com-Maracuj\u00E1 opBtnRemove-Chocolate-com-Maracuj\u00E1", id: "btnSubt__14-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Lim\u00E3o__14-002", id: "li-Lim\u00E3o__14-002", "data-title": "Torta gelada lim\u00E3o", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Lim\u00E3o", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Lim\u00E3o", id: "Lim\u00E3o-title", "aria-hidden": "false", children: "Lim\u00E3o" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Lim\u00E3o", id: "Lim\u00E3o-desc", "aria-hidden": "false", children: "Refrescante e cremosa, uma das favoritas, \u00E9 a sobremesa perfeita para um paladar equilibrado prezando pelo c\u00EDtrico." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Lim\u00E3o", id: "Lim\u00E3o-price", "aria-hidden": "false", children: "R$ 45,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Lim\u00E3o", id: "Lim\u00E3o-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__14-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Lim\u00E3o opBtnAdd-Lim\u00E3o", id: "btnAdd__14-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__14-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Lim\u00E3o opBtnRemove-Lim\u00E3o", id: "btnSubt__14-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Maracuj\u00E1__14-003", id: "li-Maracuj\u00E1__14-003", "data-title": "Torta gelada maracuj\u00E1", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Maracuj\u00E1", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-title", "aria-hidden": "false", children: "Maracuj\u00E1" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-desc", "aria-hidden": "false", children: "O leve amargor com a intensa do\u00E7ura do maracuj\u00E1 encontra a suavidade do creme nesse doce vibrante!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Maracuj\u00E1", id: "Maracuj\u00E1-price", "aria-hidden": "false", children: "R$ 45,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Maracuj\u00E1", id: "Maracuj\u00E1-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__14-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Maracuj\u00E1 opBtnAdd-Maracuj\u00E1", id: "btnAdd__14-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__14-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Maracuj\u00E1 opBtnRemove-Maracuj\u00E1", id: "btnSubt__14-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Morango__14-004", id: "li-Morango__14-004", "data-title": "Torta gelada morango", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Morango", id: "Morango-title", "aria-hidden": "false", children: "Morango" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Morango", id: "Morango-desc", "aria-hidden": "false", children: "Combina\u00E7\u00E3o de sabor e frescor, ideal para finalizar qualquer refei\u00E7\u00E3o com leveza!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Morango", id: "Morango-price", "aria-hidden": "false", children: "R$ 45,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango", id: "Morango-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__14-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Morango opBtnAdd-Morango", id: "btnAdd__14-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__14-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Morango opBtnRemove-Morango", id: "btnSubt__14-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
