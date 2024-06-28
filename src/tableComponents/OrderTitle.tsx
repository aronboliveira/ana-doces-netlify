import { useRef } from "react";
import { OrderTitleProps } from "../declarations/interfaces";
import { nullishCel } from "../declarations/types";

export default function OrderTitle(props: OrderTitleProps): JSX.Element {
  const titleCelRef = useRef<nullishCel>(null);
  return (
    <td ref={titleCelRef} id={`titleCel_${props.id || "unfilled"}`}>
      <output
        id={`titleOutp_${props.id || "unfilled"}`}
        className={`outp_orderTitle`}
      >
        {props.title}
      </output>
    </td>
  );
}
