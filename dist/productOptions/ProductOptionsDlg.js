import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { argsError, typeError, numberError, elementNotFound, htmlElementNotFound, stringError, } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import ProductOptionGrid from "./ProductOptionGrid";
import { adjustIdentifiers, attemptRender, clearURLAfterModal, isClickOutside, syncAriaStates, } from "../handlersCmn";
import SuboptionsCont from "../suboptions/SuboptionsCont";
import Spinner from "../callers/Spinner";
import { useParams } from "react-router-dom";
import SearchBar from "../interactives/SearchBar";
export default function ProductOptionsDlg({ shouldShowOptions = true, options = [], subOptions = [[""]], root = null, setOptions = undefined, }) {
    const [finished] = useState(false);
    const params = useParams();
    if (params.options && params.subOptions) {
        options = JSON.parse(decodeURIComponent(params.options));
        subOptions = JSON.parse(decodeURIComponent(params.subOptions));
    }
    const optionsRef = useRef(null);
    const menuRef = useRef(null);
    useEffect(() => {
        const renderOptions = (options, op, menuRoot) => {
            let relLiId = op
                ?.closest("li")
                ?.id.replaceAll(/[^0-9]*/g, "");
            try {
                if (!Array.isArray(options) ||
                    !options.every((option) => option instanceof Object && "opName" in option) ||
                    !(op instanceof EventTarget) ||
                    !(menuRoot instanceof Object && "_internalRoot" in menuRoot))
                    throw argsError([
                        "Array<ProductOption>",
                        "EventTarget",
                        "React.Root",
                    ]);
                const context = `Closest or sibiling <li> of the menu id, related to ${op?.id || `UNIDENTIFIED ${op?.tagName ?? "UNTAGGED"} REFERENCE`}`;
                try {
                    !relLiId &&
                        op?.previousElementSibling instanceof HTMLLIElement &&
                        (relLiId = op.previousElementSibling.id);
                    if (relLiId) {
                        relLiId = relLiId.slice(relLiId.indexOf("__") + 1);
                    }
                    else
                        throw typeError(relLiId, context, ["string"]);
                }
                catch (err) {
                    console.error(`Error validating relLiId:
          ${err.message}`);
                }
                if (!op?.closest("li") &&
                    op?.previousElementSibling instanceof HTMLLIElement) {
                    if (relLiId) {
                        while (relLiId.slice(0, 1) === "0" || relLiId.slice(0, 1) === "_")
                            relLiId = relLiId.slice(1);
                        if (Number.isFinite(parseInt(relLiId))) {
                            relLiId = parseInt(relLiId);
                            //rendering of options
                            const optionsJsx = options.map((option, i) => {
                                return i === 0 ? (_jsxs(ErrorBoundary, { FallbackComponent: () => (_jsx(GenericErrorComponent, { message: `Erro carregando informações sobre ${options[relLiId]?.opName ||
                                            "Nome indefinido"}`, altRoot: root, altJsx: _jsx(ProductOptionGrid, { opName: option.opName, desc: option.desc, price: option.price, _id: option.id, root: _jsx(ProductOptionsDlg, { setOptions: setOptions, shouldShowOptions: shouldShowOptions, options: options, root: root, subOptions: subOptions }) }) })), children: [_jsx(SearchBar, {}), _jsx(ProductOptionGrid, { opName: option.opName, price: option.price, desc: option.desc, _id: option.id, __id: option.__id, root: _jsx(ProductOptionsDlg, { setOptions: setOptions, shouldShowOptions: shouldShowOptions, options: options, root: root, subOptions: subOptions }) }, `grid_${option.__id}`)] }, `errorBoundary_${option.__id ?? `brk${i + 1}`}`)) : (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(GenericErrorComponent, { message: `Erro carregando informações sobre ${options[relLiId]?.opName ||
                                            "Nome indefinido"}`, altRoot: root, altJsx: _jsx(ProductOptionGrid, { opName: option.opName, desc: option.desc, price: option.price, _id: option.id, root: _jsx(ProductOptionsDlg, { setOptions: setOptions, shouldShowOptions: shouldShowOptions, options: options, root: root, subOptions: subOptions }) }) })), children: _jsx(ProductOptionGrid, { opName: option.opName, price: option.price, desc: option.desc, _id: option.id, __id: option.__id, root: _jsx(ProductOptionsDlg, { setOptions: setOptions, shouldShowOptions: shouldShowOptions, options: options, root: root, subOptions: subOptions }) }, `grid_${option.__id}`) }, `errorBoundary_${option.__id ?? `brk${i + 1}`}`));
                            });
                            const menuInterv = setInterval((interv) => {
                                if (attemptRender(menuRoot, menuRef.current, ...optionsJsx) ||
                                    !menuRef.current ||
                                    !document.querySelector("dialog"))
                                    clearInterval(interv);
                            }, 200);
                            const clearInterv = setInterval(() => {
                                if (!document.querySelector("dialog"))
                                    clearInterval(menuInterv);
                            }, 100);
                            setTimeout(() => {
                                if (menuRef.current?.querySelector("spinner"))
                                    menuRoot.render(_jsx(ErrorMessageComponent, { message: "Error loading menu" }));
                                clearInterval(menuInterv);
                            }, 5000);
                            setTimeout(() => {
                                clearInterval(clearInterv);
                            }, 6000);
                        }
                        else
                            throw numberError(parseInt(relLiId), context);
                    }
                    else
                        throw typeError(relLiId, context, ["string"]);
                }
                else
                    throw elementNotFound(op?.closest("li") ?? op?.previousElementSibling, context, ["Element"]);
            }
            catch (err) {
                console.error(`Error validating arguments for Options: 
        ${err.message}
        Checks:
        1. Ref: ${optionsRef ?? "ERROR"};
        2. Current: ${optionsRef?.current ?? "ERROR"};
        3. Closest <li>: ${op?.closest("li") ?? op?.previousElementSibling ?? "ERROR"};
        4. Closest <li> id: ${op?.closest("li")?.id ?? op?.previousElementSibling?.id ?? "ERROR"};
        5. Replaced closest <li> id: ${op?.closest("li")?.id.replaceAll(/[^0-9]*/g, "") ??
                    op?.previousElementSibling?.id.replaceAll(/[^0-9]*/g, "") ??
                    "ERROR"}
        6. previousElementSibling : ${op?.previousElementSibling.id}`);
            }
        };
        if (menuRef.current instanceof HTMLElement) {
            const menuRoot = createRoot(menuRef.current);
            renderOptions(options, optionsRef.current, menuRoot);
        }
        else
            elementNotFound(menuRef.current, `Reference for Options Menu related to ${optionsRef.current.id}`, ["HTMLElement"]);
    }, [menuRef, options, root, setOptions, shouldShowOptions, subOptions]);
    useEffect(() => {
        const handleKeyPress = (press) => {
            if (press.key === "Escape") {
                setOptions && setOptions(!shouldShowOptions);
                if (optionsRef.current) {
                    shouldShowOptions
                        ? optionsRef.current.showModal()
                        : optionsRef.current.close();
                }
            }
        };
        try {
            if (!(optionsRef.current instanceof HTMLDialogElement))
                throw htmlElementNotFound(optionsRef.current, `validation of current Options Dialog Reference`, ["HTMLDialogElement"]);
            try {
                if (!(optionsRef.current.parentElement instanceof Element))
                    throw elementNotFound(optionsRef.current.parentElement, `validation of Parent Element for current Options Dialog Reference`, ["Element"]);
                let sufixOptionsId = optionsRef.current.previousElementSibling?.id;
                if (!sufixOptionsId ||
                    sufixOptionsId === "" ||
                    !(optionsRef.current.previousElementSibling instanceof HTMLLIElement)) {
                    const liSet = optionsRef.current.parentElement.querySelectorAll("li");
                    const dialogMatch = Array.from(optionsRef.current.parentElement.querySelectorAll("dialog")).findIndex((dialog) => dialog === optionsRef.current);
                    dialogMatch
                        ? (sufixOptionsId = liSet[dialogMatch].id)
                        : console.warn(`Error matching <li> with <dialog> when filling id by index`);
                }
                optionsRef.current.id = optionsRef.current.id.replace("unfilled", `${sufixOptionsId || ""}`);
                try {
                    const optionHeader = optionsRef.current.querySelector(".menuOpH") ||
                        optionsRef.current.querySelector("h2") ||
                        Array.from(optionsRef.current.querySelectorAll("*")).filter((el) => el instanceof HTMLHeadingElement)[0];
                    if (!(optionHeader instanceof HTMLElement))
                        throw htmlElementNotFound(optionHeader, `validation of Header instance for Options Dialog`);
                    if (!/opções/gis.test(optionHeader.innerText))
                        optionHeader.textContent = "Opções";
                    if (!sufixOptionsId)
                        throw stringError(sufixOptionsId, `any string for a product name`);
                    const underLineIndex = optionHeader.innerText.indexOf("__") - 3;
                    optionHeader.appendChild(Object.assign(document.createElement("span"), {
                        innerText: `${sufixOptionsId
                            .replace("div-", "")
                            .replaceAll("-", " ")
                            .slice(0, underLineIndex)
                            .replace("Pave", "Pavê")
                            .replace("pave", "pavê")}`,
                    }));
                }
                catch (eH) {
                    console.error(`Error executing Routine for naming Option Header:\n${eH.message}`);
                }
            }
            catch (e) {
                console.error(`Error executing routine for filling Options Dialog Reference id:\n${e.message}`);
            }
            shouldShowOptions && optionsRef.current.showModal();
            optionsRef.current.addEventListener("click", (click) => {
                if (isClickOutside(click, optionsRef.current).some((coord) => coord === true)) {
                    setOptions && setOptions(!shouldShowOptions);
                    shouldShowOptions
                        ? optionsRef.current?.showModal()
                        : optionsRef.current?.close();
                }
            });
            addEventListener("keydown", (press) => handleKeyPress(press));
            if (optionsRef.current instanceof HTMLElement) {
                setTimeout(() => {
                    syncAriaStates(optionsRef.current);
                }, 300);
            }
        }
        catch (e) {
            console.error(`Error executing useEffect for Options Dialog Reference:\n${e.message}`);
        }
        return () => removeEventListener("keydown", handleKeyPress);
    }, [optionsRef, setOptions, shouldShowOptions]);
    useEffect(() => {
        try {
            if (!(optionsRef.current instanceof HTMLElement))
                throw htmlElementNotFound(optionsRef.current, `validation of Options Reference`);
            //definition of pushed history state
            if (optionsRef.current.id !== "") {
                let optionTextRef = "brownie-simples";
                if (/bolo/gi.test(optionsRef.current.id)) {
                    if (/caseiro/gi.test(optionsRef.current.id))
                        optionTextRef = "bolo-caseiro";
                    else if (/festa/gi.test(optionsRef.current.id))
                        optionTextRef = "bolo-de-festa";
                    else if (/pote/gi.test(optionsRef.current.id))
                        optionTextRef = "bolo-de-pote";
                }
                else if (/brownie/gi.test(optionsRef.current.id)) {
                    if (/recheado/gi.test(optionsRef.current.id))
                        optionTextRef = "brownie-recheado";
                    if (/mini/gi.test(optionsRef.current.id))
                        optionTextRef = "mini-brownie-recheado";
                }
                else if (/cookie/gi.test(optionsRef.current.id)) {
                    if (/recheado/gi.test(optionsRef.current.id))
                        optionTextRef = "cookie-recheado";
                    if (/mini/gi.test(optionsRef.current.id))
                        optionTextRef = "mini-cookie";
                }
                else if (/geleia/gi.test(optionsRef.current.id))
                    optionTextRef = "geleia-artesanal";
                else if (/palha/gi.test(optionsRef.current.id))
                    optionTextRef = "palha-gourmet";
                else if (/copo/gi.test(optionsRef.current.id))
                    optionTextRef = "copo-da-felicidade";
                else if (/pave/gi.test(optionsRef.current.id) &&
                    /pote/gi.test(optionsRef.current.id))
                    optionTextRef = "pave-de-pote";
                if (/taça/gi.test(optionsRef.current.id) ||
                    /taca/gi.test(optionsRef.current.id))
                    optionTextRef = "taça-recheada";
                if (/torta/gi.test(optionsRef.current.id))
                    optionTextRef = "torta-gelada";
                if (/travessa/gi.test(optionsRef.current.id))
                    optionTextRef = "travessa-recheada";
                const activeQuery = /\?q=/g.test(location.href)
                    ? `${location.href.slice(location.href.indexOf("?q="))}`
                    : "";
                history.pushState({}, "", `${activeQuery}?&${optionTextRef}`);
            }
        }
        catch (e) {
            console.error(`Error executing useEffect for optionsRef url adjustment:\n${e.message}`);
        }
    }, [optionsRef]);
    useEffect(() => {
        const optionsId = optionsRef.current?.id || "unidentified";
        return () => clearURLAfterModal(optionsId);
    }, []);
    useEffect(() => {
        if (!finished || !optionsRef.current)
            return;
        adjustIdentifiers(optionsRef.current);
    }, [finished]);
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
    }, [setOptions, shouldShowOptions]);
    return (_jsx(ErrorBoundary, { FallbackComponent: () => (_jsx(ErrorMessageComponent, { message: "Erro carregando janela modal!" })), children: shouldShowOptions && (_jsx("dialog", { className: "modal-content", ref: optionsRef, onClick: (click) => {
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
            }, id: `unfilled-${options
                .map((option) => option.opName)
                .toString()
                .replace("[", "")
                .replace("]", "")
                .replaceAll(",", "-")
                .replaceAll(" ", "_")}`, children: _jsxs("nav", { className: "menuOpNav fade-in", children: [_jsxs("div", { className: "flNoW menuOpMainDiv", children: [_jsx("h2", { className: "menuOpH", children: _jsx("span", { children: "Op\u00E7\u00F5es \u2014 " }) }), _jsx("button", { className: "fade-in-mid btn btn-close", onClick: () => {
                                    setOptions && setOptions(!shouldShowOptions);
                                    shouldShowOptions
                                        ? optionsRef.current?.showModal()
                                        : optionsRef.current?.close();
                                } })] }), _jsx(SuboptionsCont, { subOptions: subOptions, inpType: "radio" }), _jsx("menu", { ref: menuRef, className: "menuOpMenu", children: _jsx(Spinner, { spinnerClass: `spinner-grow`, spinnerColor: `text-info`, message: "Loading Menu..." }) })] }) })) }));
}
