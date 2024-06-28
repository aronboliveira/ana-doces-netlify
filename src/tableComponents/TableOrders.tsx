import { useEffect, useRef } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import { createRoot } from "react-dom/client";
import { TbodyProps } from "../declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import { nullishTab } from "../declarations/types";
import OrderRow from "./OrderRow";

export const tbodyProps: TbodyProps = {
  root: undefined,
  currentRef: undefined,
};

export function TableOrders(): JSX.Element {
  const tabRef = useRef<nullishTab>(null);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  useEffect(() => {
    try {
      if (!(tbodyRef.current instanceof HTMLTableSectionElement))
        throw htmlElementNotFound(
          tbodyRef.current,
          `Reference of Table body for orders`,
          ["HTMLTableSectionElement"]
        );
      tbodyProps.root = createRoot(tbodyRef.current);
      tbodyProps.currentRef = tbodyRef.current;
      tbodyProps.root.render(
        <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
      );
    } catch (e) {
      console.error(
        `Error executing useEffect for TableOrders: ${(e as Error).message}`
      );
    }
  }, [tbodyRef]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent
          message={"Erro carregando tabela de produtos!"}
          altRoot={tabRef.current!.parentElement!}
          altJsx={<TableOrders />}
        />
      )}
    >
      <table className="table table-bordered table-hover">
        <caption>
          <h3 className="bolded" id="ordersCaption">
            Pedido
          </h3>
        </caption>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="tabOrdersCel tabOrdersTh">
              <span className="tabCelSpan">Produtos</span>
            </th>
            <th scope="col" className="tabOrdersCel tabOrdersTh">
              <span className="tabCelSpan">Quantidades</span>
            </th>
          </tr>
        </thead>
        <tbody ref={tbodyRef} id="tbodyOrders"></tbody>
      </table>
    </ErrorBoundary>
  );
}
