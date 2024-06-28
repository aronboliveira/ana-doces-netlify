import { useEffect, useRef, useState } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import {
  normalizeSpacing,
  recalculateByOption,
  syncAriaStates,
  textTransformPascal,
} from "../handlersCmn";
import { nullishInp, nullishLab } from "../declarations/types";
import { SuboptionProp } from "../declarations/interfaces";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { ErrorBoundary } from "react-error-boundary";

export default function SuboptionInp({
  option,
  inpType,
  idx,
}: SuboptionProp): JSX.Element {
  const labRef = useRef<nullishLab>(null);
  const inpRef = useRef<nullishInp>(null);
  const [isDefined, setDefine] = useState<boolean>(false);
  useEffect(() => {
    try {
      if (!(labRef.current instanceof HTMLLabelElement))
        throw htmlElementNotFound(
          labRef.current,
          `validation of Label Reference`,
          ["HTMLLabelElement"]
        );
      const modalAncestral =
        labRef.current.closest(".modal-content") ||
        labRef.current.closest("dialog")!;
      if (modalAncestral) {
        if (labRef.current.htmlFor === "")
          labRef.current.htmlFor = `${modalAncestral.id
            .replace(/^div-/, "")
            .slice(0, modalAncestral.id.indexOf("__"))}-${textTransformPascal(
            option
          )}${idx}Inp`;
        if (labRef.current.id === "")
          labRef.current.id = `${modalAncestral.id
            .replace(/^div-/, "")
            .slice(0, modalAncestral.id.indexOf("__"))}-${textTransformPascal(
            option
          )}${idx}Lab`;
        labRef.current.classList.add(
          `subopLab${Array.from(
            modalAncestral.querySelectorAll(".opGroup")
          ).findIndex(
            (group) => group === inpRef.current!.closest(".opGroup")
          )}`
        );
        setDefine(true);
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for labRef in ${
          SuboptionInp.prototype.constructor.name
        } option ${option}:\n${(e as Error).message}`
      );
    }
    setTimeout(() => {
      syncAriaStates(labRef.current);
    }, 300);
  }, [labRef, idx, option]);
  useEffect(() => {
    try {
      if (
        !(
          inpRef.current instanceof HTMLInputElement &&
          inpRef.current.type === `${inpType}`
        )
      )
        throw htmlElementNotFound(
          inpRef.current,
          `validation of Input Reference`,
          [`<input type="${inpType}"`]
        );
      const modalAncestral =
        inpRef.current.closest(".modal-content") ||
        inpRef.current.closest("dialog")!;
      if (modalAncestral) {
        if (inpRef.current.name === "")
          inpRef.current.name = `${modalAncestral.id
            .replace(/^div-/, "")
            .slice(0, modalAncestral.id.indexOf("__"))}OpGroup${Array.from(
            modalAncestral.querySelectorAll(".opGroup")
          ).findIndex(
            (group) => group === inpRef.current!.closest(".opGroup")
          )}`;
        if (inpRef.current.id === "")
          inpRef.current.id = `${modalAncestral.id
            .replace(/^div-/, "")
            .slice(0, modalAncestral.id.indexOf("__"))}-${textTransformPascal(
            option
          )}${idx}Inp`;
        inpRef.current.classList.add(
          `subopInp${Array.from(
            modalAncestral.querySelectorAll(".opGroup")
          ).findIndex(
            (group) => group === inpRef.current!.closest(".opGroup")
          )}`
        );
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for inpRef in ${
          SuboptionInp.prototype.constructor.name
        } option ${option}:\n${(e as Error).message}`
      );
    }
  }, [isDefined, inpRef, idx, inpType, option]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Error rendering Option" />
      )}
    >
      <label className="subopLab form-check-label" ref={labRef}>
        <input
          className="subopInp form-check-input"
          type={inpType}
          ref={inpRef}
          value={option.toLowerCase()}
          onClick={(ev) => {
            if (ev.currentTarget.checked) {
              try {
                if (!(ev.currentTarget instanceof HTMLInputElement))
                  throw new Error(
                    `Error validating instance for Event Target. Obtained instance: ${
                      (ev.currentTarget as any).constructor.name
                    }`
                  );
                const relMenu = ev.currentTarget.closest("nav");
                if (!(relMenu instanceof HTMLElement))
                  throw htmlElementNotFound(
                    relMenu,
                    `validation of relMenu for ${
                      ev.currentTarget.id ||
                      `${ev.currentTarget.tagName} type "${ev.currentTarget.type}"`
                    }`,
                    ["HTMLMenuElement"]
                  );
                recalculateByOption(".opSpanPrice", relMenu, option);
              } catch (e) {
                console.error(
                  `Error executing callback for ${ev.type} during ${
                    ev.timeStamp
                  }:${(e as Error).message}`
                );
              }
              try {
                if (ev.currentTarget.type === "radio") {
                  const normalizedValue = normalizeSpacing(
                    ev.currentTarget.value
                  );
                  const activeOp = /&Op-/g.test(location.href)
                    ? location.href.slice(location.href.indexOf("&Op-"))
                    : "";
                  history.pushState(
                    {},
                    "",
                    location.href.replaceAll(activeOp, "")
                  );
                  ev.currentTarget.checked
                    ? history.pushState(
                        {},
                        "",
                        `${location.href}&Op-${normalizedValue}`
                      )
                    : history.pushState(
                        {},
                        "",
                        `${location.href}`.replaceAll(
                          `&Op-${normalizedValue}`,
                          ""
                        )
                      );
                }
              } catch (e2) {
                console.error(
                  `Error executing procedure for adding url param about suboption:\n${
                    (e2 as Error).message
                  }`
                );
              }
            }
          }}
        />
        <span className="subopText">{textTransformPascal(option)}</span>
      </label>
    </ErrorBoundary>
  );
}
