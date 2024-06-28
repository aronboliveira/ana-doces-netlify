import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState } from "react";
import { nullishDiv } from "../declarations/types";
import ErrorIcon from "../icons/ErrorIcon";
import InstIcon from "../icons/InstIcon";
import { htmlElementNotFound } from "../handlersErrors";
import { adjustIdentifiers, syncAriaStates } from "../handlersCmn";
import InfosModal from "../modals/InfosModal";

export default function Header(): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  const [shouldShowAuthors, setShowAuthors] = useState(false);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Header Reference`
        );
      syncAriaStates(mainRef.current);
      adjustIdentifiers(mainRef.current);
      /\?&info/gi.test(location.href) && setShowAuthors(true);
    } catch (e) {
      console.error(
        `Error executing useEffect for ${Header.prototype.constructor.name}:\n${
          (e as Error).message
        }`
      );
    }
  }, [mainRef]);
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorIcon fill={true} />}>
      <span className="instDiv" style={{ display: "flex" }}>
        <InstIcon />
        <div className="tips" style={{ color: "#ffff" }} ref={mainRef}>
          <span className="tip tipT">
            <span>Clique</span>
            <a
              className="anchorUndecor"
              id="anchorInstText"
              href="https://www.instagram.com/anadoces_rj/"
              target="_blank"
              rel="noreferrer"
            >
              <strong style={{ fontWeight: "900", color: "#ffff" }}>
                &nbsp;aqui&nbsp;
              </strong>
            </a>
            <span>para acessar nosso Instagram</span>
          </span>
        </div>
      </span>
      <span>
        <button
          className="biBtn"
          style={{
            color: "#dfddddbe",
            paddingRight: "1rem",
            fontWeight: "700",
          }}
          onClick={() => {
            setShowAuthors(!shouldShowAuthors);
          }}
        >
          <span>Sobre & Autores</span>
        </button>
        {shouldShowAuthors && (
          <InfosModal dispatch={setShowAuthors} state={shouldShowAuthors} />
        )}
      </span>
    </ErrorBoundary>
  );
}
