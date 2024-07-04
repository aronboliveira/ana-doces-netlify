import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearURLAfterModal, fixModalOpening, handleOrderAdd, handleOrderSubtract, isClickOutside, } from "../handlersCmn";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { htmlElementNotFound } from "../handlersErrors";
import SearchBar from "../interactives/SearchBar";
export default function BoloPoteHC() {
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
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", id: "div-Bolo-de-Pote__03-Brigadeiro-Brigadeiro_com_Cenoura-Brownie-Doce_de_Leite_com_Nozes-Morango_com_Caramelo-Morango_com_Chocolate-Prest\u00EDgio\u00AE-Red_Velvet", ref: optionsRef, onClick: (click) => {
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
            }, children: _jsxs("nav", { className: "menuOpNav fade-in", "aria-hidden": "false", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", "aria-hidden": "false", children: [_jsxs("h2", { className: "menuOpH", "aria-hidden": "false", children: [_jsx("span", { "aria-hidden": "false", children: "Op\u00E7\u00F5es \u2014 " }), _jsx("span", { "aria-hidden": "false", children: "Bolo de Pote" })] }), _jsx("button", { className: "fade-in-mid btn btn-close", "aria-hidden": "false", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    if (optionsRef.current) {
                                        shouldShowOptions
                                            ? optionsRef.current?.showModal()
                                            : optionsRef.current?.close();
                                        optionsRef.current.closest(".contDlg")?.remove() ||
                                            optionsRef.current.remove();
                                    }
                                } })] }), _jsx("div", { className: "opGroup", id: "contmainMenu_", "aria-hidden": "false" }), _jsxs("menu", { className: "menuOpMenu", "aria-hidden": "false", children: [_jsx(SearchBar, {}), _jsxs("li", { className: "opLi opLi-Brigadeiro__03-001", id: "li-Brigadeiro__03-001", "data-title": "Bolo de pote brigadeiro", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Brigadeiro", id: "Brigadeiro-title", "aria-hidden": "false", children: "Brigadeiro" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Brigadeiro", id: "Brigadeiro-desc", "aria-hidden": "false", children: "Camadas de bolo de chocolate intercaladas com brigadeiro cremoso, um cl\u00E1ssico irresist\u00EDvel!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Brigadeiro", id: "Brigadeiro-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro", id: "Brigadeiro-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-001", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Brigadeiro opBtnAdd-Brigadeiro", id: "btnAdd__03-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-001", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Brigadeiro opBtnRemove-Brigadeiro", id: "btnSubt__03-001", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Brigadeiro-com-Cenoura__03-002", id: "li-Brigadeiro-com-Cenoura__03-002", "data-title": "Bolo de pote brigadeiro com cenoura", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brigadeiro-com-Cenoura", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Brigadeiro-com-Cenoura", id: "Brigadeiro-com-Cenoura-title", "aria-hidden": "false", children: "Brigadeiro com Cenoura" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Brigadeiro-com-Cenoura", id: "Brigadeiro-com-Cenoura-desc", "aria-hidden": "false", children: "Perfeita combina\u00E7\u00E3o de maciez com cobertura saborosa e generosa de brigadeiro!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Brigadeiro-com-Cenoura", id: "Brigadeiro-com-Cenoura-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brigadeiro-com-Cenoura", id: "Brigadeiro-com-Cenoura-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-002", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Brigadeiro-com-Cenoura opBtnAdd-Brigadeiro-com-Cenoura", id: "btnAdd__03-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-002", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Brigadeiro-com-Cenoura opBtnRemove-Brigadeiro-com-Cenoura", id: "btnSubt__03-002", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Brownie__03-003", id: "li-Brownie__03-003", "data-title": "Bolo de pote brownie", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Brownie", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Brownie", id: "Brownie-title", "aria-hidden": "false", children: "Brownie" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Brownie", id: "Brownie-desc", "aria-hidden": "false", children: "Combina\u00E7\u00E3o de camadas de creme suave com a granulosidade de peda\u00E7os dos nossos brownies especiais." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Brownie", id: "Brownie-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Brownie", id: "Brownie-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-003", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Brownie opBtnAdd-Brownie", id: "btnAdd__03-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-003", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Brownie opBtnRemove-Brownie", id: "btnSubt__03-003", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Doce-de-Leite-com-Nozes__03-004", id: "li-Doce-de-Leite-com-Nozes__03-004", "data-title": "Bolo de pote doce de leite com nozes", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Doce-de-Leite-com-Nozes", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Doce-de-Leite-com-Nozes", id: "Doce-de-Leite-com-Nozes-title", "aria-hidden": "false", children: "Doce de Leite com Nozes" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Doce-de-Leite-com-Nozes", id: "Doce-de-Leite-com-Nozes-desc", "aria-hidden": "false", children: "A intensidade do doce de leite com peda\u00E7os crocantes de nozes suaves." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Doce-de-Leite-com-Nozes", id: "Doce-de-Leite-com-Nozes-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Doce-de-Leite-com-Nozes", id: "Doce-de-Leite-com-Nozes-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-004", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Doce-de-Leite-com-Nozes opBtnAdd-Doce-de-Leite-com-Nozes", id: "btnAdd__03-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-004", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Doce-de-Leite-com-Nozes opBtnRemove-Doce-de-Leite-com-Nozes", id: "btnSubt__03-004", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Morango-com-Caramelo__03-005", id: "li-Morango-com-Caramelo__03-005", "data-title": "Bolo de pote morango com caramelo", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango-com-Caramelo", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Morango-com-Caramelo", id: "Morango-com-Caramelo-title", "aria-hidden": "false", children: "Morango com Caramelo" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Morango-com-Caramelo", id: "Morango-com-Caramelo-desc", "aria-hidden": "false", children: "O equil\u00EDbrio entre o frescor e do\u00E7ura do morango combinado com a intensidade do caramelo em um s\u00F3 bolo!" }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Morango-com-Caramelo", id: "Morango-com-Caramelo-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango-com-Caramelo", id: "Morango-com-Caramelo-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-005", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Morango-com-Caramelo opBtnAdd-Morango-com-Caramelo", id: "btnAdd__03-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-005", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Morango-com-Caramelo opBtnRemove-Morango-com-Caramelo", id: "btnSubt__03-005", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Morango-com-Chocolate__03-006", id: "li-Morango-com-Chocolate__03-006", "data-title": "Bolo de pote morango com chocolate", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Morango-com-Chocolate", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Morango-com-Chocolate", id: "Morango-com-Chocolate-title", "aria-hidden": "false", children: "Morango com Chocolate" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Morango-com-Chocolate", id: "Morango-com-Chocolate-desc", "aria-hidden": "false", children: "Um dos cl\u00E1ssicos, o suave e levemente azedo sabor do morango se acentuam com a intensidade do brigadeiro." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Morango-com-Chocolate", id: "Morango-com-Chocolate-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Morango-com-Chocolate", id: "Morango-com-Chocolate-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-006", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Morango-com-Chocolate opBtnAdd-Morango-com-Chocolate", id: "btnAdd__03-006", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-006", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Morango-com-Chocolate opBtnRemove-Morango-com-Chocolate", id: "btnSubt__03-006", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Prest\u00EDgio\u00AE__03-007", id: "li-Prest\u00EDgio\u00AE__03-007", "data-title": "Bolo de pote prest\u00EDgio\u00AE", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Prest\u00EDgio\u00AE", "aria-hidden": "false", children: [_jsxs("strong", { className: "opSpan opSpanName opSpan-Prest\u00EDgio\u00AE", id: "Prest\u00EDgio\u00AE-title", "aria-hidden": "false", style: { position: "relative" }, children: ["Prest\u00EDgio", _jsx("span", { className: "brandSpan", style: { fontSize: "16px", left: "103%" }, "aria-hidden": "false", children: "\u00AE" })] }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Prest\u00EDgio\u00AE", id: "Prest\u00EDgio\u00AE-desc", "aria-hidden": "false", children: "Para os amantes do tom tropical, o sabor leve e consistente do coco em combina\u00E7\u00E3o com consist\u00EAncia cremosa e massa suave." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Prest\u00EDgio\u00AE", id: "Prest\u00EDgio\u00AE-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Prest\u00EDgio\u00AE", id: "Prest\u00EDgio\u00AE-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-007", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Prest\u00EDgio\u00AE opBtnAdd-Prest\u00EDgio\u00AE", id: "btnAdd__03-007", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-007", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Prest\u00EDgio\u00AE opBtnRemove-Prest\u00EDgio\u00AE", id: "btnSubt__03-007", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] }), _jsxs("li", { className: "opLi opLi-Red-Velvet__03-008", id: "li-Red-Velvet__03-008", "data-title": "Bolo de pote red velvet", "aria-hidden": "false", children: [_jsxs("div", { className: "fade-in-mid opLiDiv opInfoDiv opInfoDiv-Red-Velvet", "aria-hidden": "false", children: [_jsx("strong", { className: "opSpan opSpanName opSpan-Red-Velvet", id: "Red-Velvet-title", "aria-hidden": "false", children: "Red Velvet" }), _jsx("span", { className: "opSpan opSpanDesc opSpan-Red-Velvet", id: "Red-Velvet-desc", "aria-hidden": "false", children: "Uma conquista nos olhares e no paladar, combina uma massa de sabor suave, cuidadosamente recheada com um mousse especial de Cream Cheese e muito macia." }), _jsx("span", { className: "opSpan opSpanPrice opSpan-Red-Velvet", id: "Red-Velvet-price", "aria-hidden": "false", children: "R$ 15,00" })] }), _jsxs("div", { className: "fade-in-late opLiDiv opBtnsDiv opBtnsDiv-Red-Velvet", id: "Red-Velvet-btnsDiv", "aria-hidden": "false", children: [_jsx("span", { className: "addAlert", id: "addAlert__03-008", "aria-hidden": "false", children: "Item adicionado!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnAdd opBtn-Red-Velvet opBtnAdd-Red-Velvet", id: "btnAdd__03-008", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-plus-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "\n              M2 0\n              a 2 2 0 0 0-2 2\n              v12\n              a 2 2 0 0 0 2 2\n              h12\n              a 2 2 0 0 0 2-2\n              V2\n              a 2 2 0 0 0-2-2\n              zm6.5 4.5\n              v3\n              h3\n              a .5 .5 0 0 1 0 1\n              h-3\n              v3\n              a .5 .5 0 0 1-1 0\n              v-3\n              h-3\n              a .5 .5 0 0 1 0-1\n              h3\n              v-3\n              a .5 .5 0 0 1 1 0" }) }) }), _jsx("span", { className: "minusAlert", id: "minusAlert__03-008", "aria-hidden": "false", children: "Item removido!" }), _jsx("button", { type: "button", className: "biBtn opBtn opBtnRemove opBtn-Red-Velvet opBtnRemove-Red-Velvet", id: "btnSubt__03-008", "aria-hidden": "false", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-dash-square-fill", viewBox: "0 0 16 16", children: _jsx("path", { d: "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" }) }) }), _jsx("span", { className: "errorAlert", "aria-hidden": "false" })] })] })] })] }) })) }));
}
