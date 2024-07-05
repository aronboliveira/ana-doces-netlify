import { useEffect, useRef } from "react";
import { elementNotFound, htmlElementNotFound } from "../handlersErrors";
import { createRoot } from "react-dom/client";
import { TbodyProps } from "../declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import { nullishTab } from "../declarations/types";
import OrderRow from "./OrderRow";

export const tbodyProps: TbodyProps = {
  root: undefined,
  currentRef: undefined,
  primaryRowRoot: undefined,
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
      if (!tbodyProps.root) tbodyProps.root = createRoot(tbodyRef.current);
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
      <table className="table table-bordered table-hover" id="productsTab">
        <caption id="productsTabCapt">
          <div id="productsTabTitle">
            <h3 className="bolded" id="ordersCaption">
              Pedido
            </h3>
            <button
              id="resetTabBtn"
              className="btn btn-secondary btn-rounded"
              onClick={ev => {
                try {
                  const tBody =
                    document.getElementById("tbodyOrder") ??
                    ev.currentTarget.closest("table")?.querySelector("tbody");
                  if (!(tBody instanceof HTMLTableSectionElement))
                    throw elementNotFound(
                      tBody,
                      `Validation of Table Body for Products`,
                      ["HTMLTableSectionElement"]
                    );
                  if (!tbodyProps.root) tbodyProps.root = createRoot(tBody);
                  tbodyProps.root.render(
                    <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
                  );
                  const total = document.getElementById("total");
                  if (!(total instanceof HTMLElement))
                    throw elementNotFound(
                      total,
                      `validation of Total element`,
                      ["HTMLElement"]
                    );
                  total.innerText = ` R$ 0,00`;
                } catch (e) {
                  console.error(
                    `Error executing callback for ${ev.currentTarget.id}:\n${
                      (e as Error).message
                    }`
                  );
                }
              }}
            >
              Limpar Tabela
            </button>
          </div>
        </caption>
        <colgroup>
          <col />
          <col style={{ minWidth: "1ch" }} />
          <col style={{ minWidth: "1ch" }} />
        </colgroup>
        <thead id="productsThead">
          <tr>
            <th
              scope="col"
              className="tabOrdersCel tabOrdersTh"
              id="productsCell"
            >
              <span className="tabCelSpan">Produtos</span>
            </th>
            <th
              scope="col"
              className="tabOrdersCel tabOrdersTh"
              id="quantityCell"
            >
              <span className="tabCelSpan">Quantidades</span>
            </th>
            <th
              scope="col"
              className="tabOrdersCel tabOrdersTh"
              id="removeCell"
            >
              <span className="tabCelSpan">Remoções</span>
            </th>
          </tr>
        </thead>
        <tbody ref={tbodyRef} id="tbodyOrders"></tbody>
      </table>
    </ErrorBoundary>
  );
}
