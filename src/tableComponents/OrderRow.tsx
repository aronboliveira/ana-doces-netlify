import { OrderProps } from "../declarations/interfaces";
import OrderTitle from "./OrderTitle";
import OrderQuantity from "./OrderQuantity";

export default function OrderRow(props: OrderProps): JSX.Element {
  return (
    <tr id={`tr_${props.id || "unfilled"}`}>
      <OrderTitle title={props.title ?? ""} id={props.id || "unfilled"} />
      <OrderQuantity
        quantity={props.quantity ?? "0"}
        id={props.id || "unfilled"}
      />
    </tr>
  );
}
