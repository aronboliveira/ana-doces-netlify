import { useRef } from "react";
import { OrderTitleProps } from "../declarations/interfaces";
import styles from "../tableComponents/OrderRow.module.scss";
import { nullishCel } from "../declarations/types";

export default function OrderTitle(props: OrderTitleProps): JSX.Element {
  const titleCelRef = useRef<nullishCel>(null);
  return (
    <td
      ref={titleCelRef}
      id={`titleCel_${props.id || "unfilled"}`}
      className={`celName ${styles['order-row__title']}`}
    >
      <output
        id={`titleOutp_${props.id || "unfilled"}`}
        className={`outp_orderTitle ${styles['order-row__output-title']}`}
      >
        {props.title}
      </output>
    </td>
  );
}
