import { useEffect, useRef } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  capitalizeFirstLetter,
  normalizeSpacing,
  syncAriaStates,
} from "../handlersCmn";
import { DirectCallerProps } from "../declarations/interfaces";
import { nullishAnchor, nullishBtn } from "../declarations/types";
import WpIcon from "../icons/WpIcon";
import ErrorIcon from "../icons/ErrorIcon";

export default function DirectCaller({
  innerTextL,
  href,
  target,
  rel,
  color: _color,
  ComponentCase,
}: DirectCallerProps) {
  const btnRef = useRef<nullishBtn>(null);
  const aRef = useRef<nullishAnchor>(null);
  useEffect(() => {
    try {
      if (!(btnRef.current instanceof HTMLButtonElement))
        throw htmlElementNotFound(
          btnRef.current,
          `validation of Button Reference`,
          ["HTMLButtonElement"]
        );
      syncAriaStates(btnRef.current);
    } catch (e) {
      console.error(
        `Error executing routine for DirectCaller:\n${(e as Error).message}`
      );
    }
  }, [btnRef]);
  useEffect(() => {
    try {
      if (!(aRef.current instanceof HTMLAnchorElement))
        throw htmlElementNotFound(
          aRef.current,
          `validation of Anchor reference`,
          ["HTMLAnchorElement"]
        );
      if (_color) aRef.current.style.color = _color;
    } catch (e) {
      console.error(
        `Error executing useEffect for aRef in ${
          DirectCaller.prototype.constructor.name
        } for case ${innerTextL}:${(e as Error).message}`
      );
    }
  }, [aRef, _color, innerTextL]);
  const readCase = () => {
    ComponentCase = ComponentCase.toLowerCase().trim();
    switch (ComponentCase) {
      case "whatsapp":
        return <WpIcon large={true} />;
      default:
        return <ErrorIcon fill={false} />;
    }
  };
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message={`Error loading Link`} />
      )}
    >
      <button
        type="button"
        ref={btnRef}
        id={normalizeSpacing(`btn${capitalizeFirstLetter(innerTextL)}`).replace(
          "!",
          ""
        )}
      >
        {readCase()}
        <a
          ref={aRef}
          id={`anchor${normalizeSpacing(
            capitalizeFirstLetter(innerTextL)
          ).replace("!", "")}`}
          className="caller highlight"
          href={`${href}`}
          target={`${target}`}
          rel={`${rel}`}
          title={`Clique aqui para ${innerTextL
            .toLowerCase()
            .replace("chame", "chamar")}`}
          style={{ zIndex: 10, width: "fit-content" }}
        >{`${innerTextL}`}</a>
      </button>
    </ErrorBoundary>
  );
}
