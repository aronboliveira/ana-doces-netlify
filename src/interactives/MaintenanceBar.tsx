import styles from "./MaintenanceBar.module.scss";

interface MaintenanceBarProps {
  onShowModal: () => void;
  onDismiss: () => void;
}

export default function MaintenanceBar({
  onShowModal,
  onDismiss,
}: MaintenanceBarProps): JSX.Element {
  return (
    <div
      className={styles["maintenance-bar"]}
      role="status"
      aria-label="Sistema em manutenção"
    >
      <span className={styles["maintenance-bar__text"]}>
        Cardápio em manutenção — preços e itens sujeitos a alteração
      </span>
      <button
        className={styles["maintenance-bar__btn"]}
        onClick={onShowModal}
        aria-label="Ver detalhes da manutenção"
      >
        Saiba mais
      </button>
      <button
        className={styles["maintenance-bar__close"]}
        onClick={onDismiss}
        aria-label="Fechar barra de manutenção"
      >
        ×
      </button>
    </div>
  );
}
