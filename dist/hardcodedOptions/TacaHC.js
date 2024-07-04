import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function TacaHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Ta\u00E7a-Recheada__13-Banoffee-Chocolate_com_Frutas_Vermelhas-Chocolate_com_Morango-Ninho\u00AE_com_Morango-Ninho\u00AE_com_Nutella\u00AE_e_Brownie", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Ta\u00E7a Recheada" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Banoffee__13-001", id: "li-Banoffee__13-001", "data-title": "Ta\u00E7a recheada banoffee", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Banoffee", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Banoffee", id: "Banoffee-title", "aria-hidden": "false", children: "Banoffee" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Banoffee", id: "Banoffee-desc", "aria-hidden": "false", children: "Deliciosa combina\u00E7\u00E3o da do\u00E7ura da banana e da intensidade do doce de leite em uma ta\u00E7a perfeita para qualquer sobremesa!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Banoffee", id: "Banoffee-price", "aria-hidden": "false", children: "R$\u00A085,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Banoffee", id: "Banoffee-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__13-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Banoffee opBtnAdd-Banoffee", id: "btnAdd__13-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__13-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Banoffee opBtnRemove-Banoffee", id: "btnSubt__13-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Chocolate-com-Frutas-Vermelhas__13-002", id: "li-Chocolate-com-Frutas-Vermelhas__13-002", "data-title": "Ta\u00E7a recheada chocolate com frutas vermelhas", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Frutas-Vermelhas", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Chocolate-com-Frutas-Vermelhas", id: "Chocolate-com-Frutas-Vermelhas-title", "aria-hidden": "false", children: "Chocolate com Frutas Vermelhas" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Chocolate-com-Frutas-Vermelhas", id: "Chocolate-com-Frutas-Vermelhas-desc", "aria-hidden": "false", children: "Irresist\u00EDvel mousse de chocolate meio-amargo com generoso acr\u00E9scimo de frutas vermelhas frescas." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Chocolate-com-Frutas-Vermelhas", id: "Chocolate-com-Frutas-Vermelhas-price", "aria-hidden": "false", children: "R$ 80,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Frutas-Vermelhas", id: "Chocolate-com-Frutas-Vermelhas-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__13-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Chocolate-com-Frutas-Vermelhas opBtnAdd-Chocolate-com-Frutas-Vermelhas", id: "btnAdd__13-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__13-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Chocolate-com-Frutas-Vermelhas opBtnRemove-Chocolate-com-Frutas-Vermelhas", id: "btnSubt__13-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Chocolate-com-Morango__13-003", id: "li-Chocolate-com-Morango__13-003", "data-title": "Ta\u00E7a recheada chocolate com morango", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Chocolate-com-Morango", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Chocolate-com-Morango", id: "Chocolate-com-Morango-title", "aria-hidden": "false", children: "Chocolate com Morango" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Chocolate-com-Morango", id: "Chocolate-com-Morango-desc", "aria-hidden": "false", children: "A cremosidade e intensidade dos mousses de chocolates branco e meio-amargo combinados com o frescor e leve acidez do morango com um toque final de brigadeiro em uma sobremesa conquistadora!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Chocolate-com-Morango", id: "Chocolate-com-Morango-price", "aria-hidden": "false", children: "R$\u00A090,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Chocolate-com-Morango", id: "Chocolate-com-Morango-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__13-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Chocolate-com-Morango opBtnAdd-Chocolate-com-Morango", id: "btnAdd__13-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__13-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Chocolate-com-Morango opBtnRemove-Chocolate-com-Morango", id: "btnSubt__13-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Ninho\u00AE-com-Morango__13-004", id: "li-Ninho\u00AE-com-Morango__13-004", "data-title": "Ta\u00E7a recheada ninho\u00AE com morango", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho\u00AE-com-Morango", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Ninho\u00AE-com-Morango", id: "Ninho\u00AE-com-Morango-title", "aria-hidden": "false", style: { position: "relative" }, children: [" ", _jsx("span", { id: "NinhoSliceNinho\u00AE-com-Morango-title", className: "brandedNameSpan NinhoSlice", "aria-hidden": "false", children: "Ninho" }), _jsx("span", { className: "brandSpan", style: { fontSize: "16px" }, "aria-hidden": "false", children: "\u00AE" }), _jsx("span", { id: "_com_MorangoSliceNinho\u00AE-com-Morango-title", className: "brandedNameSpan _com_MorangoSlice", "aria-hidden": "false", children: "com Morango" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Ninho\u00AE-com-Morango", id: "Ninho\u00AE-com-Morango-desc", "aria-hidden": "false", children: "Creme de Ninho\u00AE com morangos frescos. Para os amantes de um sabor suave, refrescante e levemente granuloso!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Ninho\u00AE-com-Morango", id: "Ninho\u00AE-com-Morango-price", "aria-hidden": "false", children: "R$\u00A095,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho\u00AE-com-Morango", id: "Ninho\u00AE-com-Morango-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__13-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Ninho\u00AE-com-Morango opBtnAdd-Ninho\u00AE-com-Morango", id: "btnAdd__13-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__13-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Ninho\u00AE-com-Morango opBtnRemove-Ninho\u00AE-com-Morango", id: "btnSubt__13-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Ninho\u00AE-com-Nutella\u00AE-e-Brownie__13-005", id: "li-Ninho\u00AE-com-Nutella\u00AE-e-Brownie__13-005", "data-title": "Ta\u00E7a recheada ninho\u00AE com nutella\u00AE e brownie", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "Ninho\u00AE-com-Nutella\u00AE-e-Brownie-title", "aria-hidden": "false", style: { position: "relative" }, children: [_jsx("span", { id: "NinhoSliceNinho\u00AE-com-Nutella\u00AE-e-Brownie-title", className: "brandedNameSpan NinhoSlice", "aria-hidden": "false", children: "Ninho" }), _jsx("span", { className: "brandSpan", style: { fontSize: "16px" }, "aria-hidden": "false", children: "\u00AE" }), _jsx("span", { id: "com_NutellaSliceNinho\u00AE-com-Nutella\u00AE-e-Brownie-title", className: "brandedNameSpan com_NutellaSlice", "aria-hidden": "false", children: "com Nutella" }), _jsx("span", { className: "brandSpan", style: { fontSize: "16px" }, "aria-hidden": "false", children: "\u00AE" }), _jsx("span", { id: "e_BrownieSliceNinho\u00AE-com-Nutella\u00AE-e-Brownie-title", className: "brandedNameSpan e_BrownieSlice", "aria-hidden": "false", children: "e Brownie" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "Ninho\u00AE-com-Nutella\u00AE-e-Brownie-desc", "aria-hidden": "false", children: "Creme de Ninho\u00AE com Nutella\u00AE e peda\u00E7os de Brownie. Equilibrando intensidade, granulosidade e suavidade na medida certa, \u00E9 uma certeza de sucesso!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "Ninho\u00AE-com-Nutella\u00AE-e-Brownie-price", "aria-hidden": "false", children: "R$\u00A085,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "Ninho\u00AE-com-Nutella\u00AE-e-Brownie-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__13-005", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Ninho\u00AE-com-Nutella\u00AE-e-Brownie opBtnAdd-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "btnAdd__13-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n            M2 0\n            a 2 2 0 0 0-2 2\n            v12\n            a 2 2 0 0 0 2 2\n            h12\n            a 2 2 0 0 0 2-2\n            V2\n            a 2 2 0 0 0-2-2\n            zm6.5 4.5\n            v3\n            h3\n            a .5 .5 0 0 1 0 1\n            h-3\n            v3\n            a .5 .5 0 0 1-1 0\n            v-3\n            h-3\n            a .5 .5 0 0 1 0-1\n            h3\n            v-3\n            a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__13-005", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Ninho\u00AE-com-Nutella\u00AE-e-Brownie opBtnRemove-Ninho\u00AE-com-Nutella\u00AE-e-Brownie", id: "btnSubt__13-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
