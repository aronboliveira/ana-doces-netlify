import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
import { createRoot } from "react-dom/client";
export default function TravessaHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Travessa-Recheada__15-Banoffee-Ninho\u00AE_trufado_com_Mousse_de_Nutella\u00AE-Pav\u00EA_de_Morango_com_Ninho\u00AE-Pav\u00EA_de_Sonho_de_Valsa\u00AE-Torta_de_Lim\u00E3o", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Travessa Recheada" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Banoffee__15-001", id: "li-Banoffee__15-001", "data-title": "Travessa recheada banoffee", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Banoffee", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Banoffee", id: "Banoffee-title", "aria-hidden": "false", children: "Banoffee" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Banoffee", id: "Banoffee-desc", "aria-hidden": "false", children: "Massa de farofinha de biscoito recheada com uma deliciosa combina\u00E7\u00E3o de camadas de bananas doces e intenso doce de leite em uma travessa finalizada com camada generosa de chantili. Perfeita para qualquer sobremesa!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Banoffee", id: "Banoffee-price", "aria-hidden": "false", children: "R$ 80,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banoffee", id: "Banoffee-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__15-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Banoffee opBtnAdd-Banoffee", id: "btnAdd__15-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__15-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Banoffee opBtnRemove-Banoffee", id: "btnSubt__15-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE__15-002", id: "li-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE__15-002", "data-title": "Travessa recheada ninho\u00AE trufado com mousse de nutella\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: [_jsx("span", { id: "NinhoSliceNinho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-title", className: "brandedNameSpan NinhoSlice", "aria-hidden": "false", children: "Ninho" }), _jsx("span", { className: "brandSpan", style: { fontSize: "16px" }, "aria-hidden": "false", children: "\u00AE" }), _jsx("span", { id: "trufado_com_Mousse_de_NutellaSliceNinho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-title", className: "brandedNameSpan trufado_com_Mousse_de_NutellaSlice", "aria-hidden": "false", children: "trufado com Mousse de Nutella" }), _jsx("span", { className: "brandSpan", style: { fontSize: "16px" }, "aria-hidden": "false", children: "\u00AE" }), _jsx("span", { id: "SliceNinho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-title", className: "brandedNameSpan Slice", "aria-hidden": "false" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-desc", "aria-hidden": "false", children: "Delicioso creme de Ninho\u00AE trufado no chocolate branco, envolvido com camadas suculentas de mousse de Nutella\u00AE!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-price", "aria-hidden": "false", children: "R$\u00A085,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__15-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE opBtnAdd-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "btnAdd__15-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__15-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE opBtnRemove-Ninho\u00AE-trufado-com-Mousse-de-Nutella\u00AE", id: "btnSubt__15-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Pav\u00EA-de-Morango-com-Ninho\u00AE__15-003", id: "li-Pave-de-Morango-com-Ninho\u00AE__15-003", "data-title": "Travessa recheada pav\u00EA de morango com ninho\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pav\u00EA-de-Morango-com-Ninho\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "Pave-de-Morango-com-Ninho\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: ["Pav\u00EA de Morango com Ninho", _jsx("span", { className: "brandSpan", style: { fontSize: "16px", left: "103%" }, "aria-hidden": "false", children: "\u00AE" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "Pave-de-Morango-com-Ninho\u00AE-desc", "aria-hidden": "false", children: "Mousse cremoso de Ninho\u00AE acompanhado de peda\u00E7os de morango frescos e finalizado com uma cobertura de chantili." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "Pave-de-Morango-com-Ninho\u00AE-price", "aria-hidden": "false", children: "R$\u00A085,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "Pave-de-Morango-com-Ninho\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__15-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Pav\u00EA-de-Morango-com-Ninho\u00AE opBtnAdd-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "btnAdd__15-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__15-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Pav\u00EA-de-Morango-com-Ninho\u00AE opBtnRemove-Pav\u00EA-de-Morango-com-Ninho\u00AE", id: "btnSubt__15-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Pav\u00EA-de-Sonho-de-Valsa\u00AE__15-004", id: "li-Pave-de-Sonho-de-Valsa\u00AE__15-004", "data-title": "Travessa recheada pav\u00EA de sonho de valsa\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Pav\u00EA-de-Sonho-de-Valsa\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "Pave-de-Sonho-de-Valsa\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: ["Pav\u00EA de Sonho de Valsa", _jsx("span", { className: "brandSpan", style: { fontSize: "16px", left: "101%" }, "aria-hidden": "false", children: "\u00AE" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "Pave-de-Sonho-de-Valsa\u00AE-desc", "aria-hidden": "false", children: "Saboroso creme combinando chocolate branco e ao leite intercalado com camadas crocantes de Sonho de Valsa\u00AE em uma travessa finalizada com uma camada de chantili!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "Pave-de-Sonho-de-Valsa\u00AE-price", "aria-hidden": "false", children: "R$\u00A090,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "Pave-de-Sonho-de-Valsa\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__15-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Pav\u00EA-de-Sonho-de-Valsa\u00AE opBtnAdd-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "btnAdd__15-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__15-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Pav\u00EA-de-Sonho-de-Valsa\u00AE opBtnRemove-Pav\u00EA-de-Sonho-de-Valsa\u00AE", id: "btnSubt__15-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Torta-de-Lim\u00E3o__15-005", id: "li-Torta-de-Lim\u00E3o__15-005", "data-title": "Travessa recheada torta de lim\u00E3o", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Torta-de-Lim\u00E3o", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Torta-de-Lim\u00E3o", id: "Torta-de-Lim\u00E3o-title", "aria-hidden": "false", children: "Torta de Lim\u00E3o" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Torta-de-Lim\u00E3o", id: "Torta-de-Lim\u00E3o-desc", "aria-hidden": "false", children: "Deliciosas camadas de massa de biscoito coberto com um cremoso mousse de lim\u00E3o, finalizadas com generosa camada de chantili." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Torta-de-Lim\u00E3o", id: "Torta-de-Lim\u00E3o-price", "aria-hidden": "false", children: "R$ 80,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Torta-de-Lim\u00E3o", id: "Torta-de-Lim\u00E3o-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__15-005", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Torta-de-Lim\u00E3o opBtnAdd-Torta-de-Lim\u00E3o", id: "btnAdd__15-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__15-005", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Torta-de-Lim\u00E3o opBtnRemove-Torta-de-Lim\u00E3o", id: "btnSubt__15-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
