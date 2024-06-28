import { useEffect, useRef } from "react";
import { SuboptionsContProps } from "../declarations/interfaces";
import { nullishDiv } from "../declarations/types";
import { htmlElementNotFound } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import SuboptionsSubDiv from "./SuboptionSubdiv";
import { syncAriaStates } from "../handlersCmn";

export default function SuboptionsCont({
  subOptions,
  inpType,
}: SuboptionsContProps): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Reference`,
          ["HTMLElement"]
        );
      if (mainRef.current.id === "")
        mainRef.current.id = `cont${
          mainRef.current.closest("menu")!.id
        }_${subOptions
          .toString()
          .replace("[", "")
          .replace("]", "")
          .replace(",", "-")
          .replace(" ", "_")}`;
    } catch (e) {
      console.error(
        `Error executing useEffect for mainRef in ${
          SuboptionsCont.prototype.constructor.name
        }:\n${(e as Error).message}`
      );
    }
    setTimeout(() => {
      syncAriaStates(mainRef.current);
    }, 300);
  }, [mainRef, subOptions]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Error rendering Options Container" />
      )}
    >
      <div className="opGroup" ref={mainRef}>
        {subOptions.some((opt) => opt.length > 0) &&
          subOptions.map((opt, i) => (
            <SuboptionsSubDiv
              subOptionsList={opt}
              inpType={inpType}
              idx={i}
              key={`opGroupOp${i}`}
            />
          ))}
      </div>
    </ErrorBoundary>
  );
}
