import { ErrorBoundary } from "react-error-boundary";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { nullishDiv } from "../declarations/types";
import ErrorIcon from "../icons/ErrorIcon";
import InstIcon from "../icons/InstIcon";
import { htmlElementNotFound } from "../handlersErrors";
import { adjustIdentifiers, syncAriaStates } from "../handlersCmn";
import useMaintenanceMode from "../hooks/useMaintenanceMode";
const InfosModal = lazy(() => import("../modals/InfosModal"));
const MaintenanceModal = lazy(() => import("../modals/MaintenanceModal"));
import MaintenanceBar from "./MaintenanceBar";
import styles from "./Header.module.scss";

export default function Header(): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  const [shouldShowAuthors, setShowAuthors] = useState(false);
  const { isModalOpen, isBarVisible, dismissModal, reopenModal, hideBar } =
    useMaintenanceMode();
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
      <a href="#mainEl" className="skip-to-content">
        Pular para o conteúdo principal
      </a>
      {isBarVisible && (
        <MaintenanceBar onShowModal={reopenModal} onDismiss={hideBar} />
      )}
      {isModalOpen && (
        <Suspense fallback={null}>
          <MaintenanceModal onDismiss={dismissModal} />
        </Suspense>
      )}
      <span className={styles.header__instagram} style={{ display: "flex" }}>
        <InstIcon />
        <div className={styles.header__tips} style={{ color: "#ffff" }} ref={mainRef}>
          <span className={`tip ${styles['header__tip-title']}`}>
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
          className={`biBtn ${styles['header__author-btn']}`}
          onClick={() => {
            setShowAuthors(!shouldShowAuthors);
          }}
        >
          <span>Sobre & Autores</span>
        </button>
        {shouldShowAuthors && (
          <Suspense fallback={null}>
            <InfosModal dispatch={setShowAuthors} state={shouldShowAuthors} />
          </Suspense>
        )}
      </span>
    </ErrorBoundary>
  );
}
