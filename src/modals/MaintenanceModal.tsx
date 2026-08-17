import { useEffect, useRef } from "react";
import { nullishDlg } from "../declarations/types";
import { isClickOutside } from "../handlersCmn";
import styles from "./MaintenanceModal.module.scss";

interface MaintenanceModalProps {
  onDismiss: () => void;
}

export default function MaintenanceModal({
  onDismiss,
}: MaintenanceModalProps): JSX.Element {
  const dialogRef = useRef<nullishDlg>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement;
    dialog.showModal?.();
    dialog.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
        return;
      }
      if (e.key !== "Tab") return;
      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onDismiss]);

  return (
    <dialog
      className={styles["maintenance-modal__dialog"]}
      ref={dialogRef}
      aria-labelledby="maintenance-modal-title"
      aria-modal="true"
      onClick={(click) => {
        if (
          dialogRef.current &&
          isClickOutside(click, dialogRef.current).some(
            (coord) => coord === true
          )
        ) {
          onDismiss();
        }
      }}
    >
      <article className={styles["maintenance-modal__content"]}>
        <button
          className={styles["maintenance-modal__x-btn"]}
          onClick={onDismiss}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2
          id="maintenance-modal-title"
          className={styles["maintenance-modal__heading"]}
        >
          Cardápio em manutenção
        </h2>
        <p className={styles["maintenance-modal__body"]}>
          Estamos atualizando nosso cardápio digital: os preços estão sendo
          revisados e alguns itens sairão de linha em breve.
        </p>
        <p className={styles["maintenance-modal__body"]}>
          Para encomendas ou dúvidas, fale direto com a gente pelo WhatsApp ou
          pelo Instagram:
        </p>
        <nav className={styles["maintenance-modal__links"]}>
          <a
            href="https://whatsa.me/5521983022926/?t=Ol%C3%A1,+Ana!+Vi+que+o+card%C3%A1pio+est%C3%A1+em+manuten%C3%A7%C3%A3o+e+gostaria+de+mais+informa%C3%A7%C3%B5es+%E2%9C%89%F0%9F%8D%B0"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles["maintenance-modal__link"]} ${styles["maintenance-modal__link--whatsapp"]}`}
            aria-label="Contato via WhatsApp"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/anadoces_rj/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles["maintenance-modal__link"]} ${styles["maintenance-modal__link--instagram"]}`}
            aria-label="Contato via Instagram"
          >
            Instagram
          </a>
        </nav>
      </article>
    </dialog>
  );
}
