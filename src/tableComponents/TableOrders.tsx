import { useEffect, useRef } from "react";
import {
  elementNotFound,
  htmlElementNotFound,
  parseFinite,
} from "../handlersErrors";
import { createRoot } from "react-dom/client";
import { TbodyProps } from "../declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import { nullishTab } from "../declarations/types";
import OrderRow from "./OrderRow";
import { handleRemoveOrder } from "./OrderRemove";

export const tbodyProps: TbodyProps = {
  root: undefined,
  currentRef: undefined,
  primaryRowRoot: undefined,
  roots: {},
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
      if (!tbodyProps.root || !tbodyProps.root._internalRoot)
        tbodyProps.root = createRoot(tbodyRef.current);
      tbodyProps.currentRef = tbodyRef.current;
      tbodyProps.root.render(
        <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
      );
      const tbodyInterv = setInterval(interv => {
        try {
          const tab =
            document.getElementById("productsTab") ??
            document.querySelector('table[id*="products"]') ??
            Array.from(document.querySelectorAll("table")).at(-1);
          if (!(tab instanceof HTMLTableElement))
            throw htmlElementNotFound(tab, `Validation of Table fetched`, [
              "HTMLTableElement",
            ]);
          const tbody =
            tab.querySelector("tbody") ??
            Array.from(document.querySelectorAll("tbody")).at(-1);
          if (!(tbody instanceof HTMLTableSectionElement))
            throw htmlElementNotFound(
              tbody,
              `Validation of Table Body fetched`,
              ["HTMLTableSectionElement"]
            );
          if (
            tbody.rows.length === 0 ||
            (tbody &&
              Array.from(tbody.rows).every(
                row =>
                  !row.querySelector("td") ||
                  parseFinite(
                    getComputedStyle(row).height.replace("px", "").trim()
                  ) <= 0
              ))
          ) {
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(tbody);
            tbodyProps.root.render(<OrderRow id="order_ph" title="" />);
            setTimeout(() => {
              if (
                tbody.rows.length === 0 ||
                (tbody &&
                  Array.from(tbody.rows).every(
                    row =>
                      !row.querySelector("td") ||
                      parseFinite(
                        getComputedStyle(row).height.replace("px", "").trim()
                      ) <= 0
                  ))
              ) {
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(tbody);
                if (
                  tbodyProps.root &&
                  document.getElementById("tbodyOrders") &&
                  document.getElementById("tbodyOrders")!.querySelectorAll("tr")
                    .length > 0
                )
                  tbodyProps.root.unmount();
                if (!tab) {
                  clearInterval(interv);
                  return;
                }
                if (document.getElementById("tbodyOrders")) return;
                tbodyProps.root = undefined;
                const replaceTbody = document.createElement("tbody");
                replaceTbody.id = `tbodyOrders`;
                tab.append(replaceTbody);
                tbodyProps.ref = replaceTbody;
                tbodyProps.currentRef = replaceTbody;
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(replaceTbody);
                tbodyProps.root.render(<OrderRow id="order_ph" title="" />);
                setTimeout(() => {
                  if (!document.getElementById("tr_order_ph")) {
                    console.log("Failed first attempt. Retrying...");
                    const tab =
                      document.getElementById("productsTab") ??
                      document.querySelector('table[id*="products"]') ??
                      Array.from(document.querySelectorAll("table")).at(-1);
                    if (!(tab instanceof HTMLTableElement))
                      throw htmlElementNotFound(
                        tab,
                        `Validation of Table fetched`,
                        ["HTMLTableElement"]
                      );
                    tbodyProps.root = undefined;
                    const replaceTbody = document.createElement("tbody");
                    replaceTbody.id = `tbodyOrders`;
                    tab.append(replaceTbody);
                    tbodyProps.ref = replaceTbody;
                    tbodyProps.currentRef = replaceTbody;
                    if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                      tbodyProps.root = createRoot(replaceTbody);
                    tbodyProps.root.render(<OrderRow id="order_ph" title="" />);
                  }
                }, 500);
              }
            }, 200);
            if (
              tbody.rows.length === 0 ||
              (tbody &&
                Array.from(tbody.rows).every(
                  row =>
                    !row.querySelector("td") ||
                    parseFinite(
                      getComputedStyle(row).height.replace("px", "").trim()
                    ) <= 0
                ))
            )
              return;
            if (document.getElementById("total"))
              document.getElementById("total")!.innerText = " R$ 0,00";
          }
          if (
            document
              .getElementById("tbodyOrders")
              ?.querySelector("#tr_order_ph") ||
            (Array.from(
              document
                .getElementById("tbodyOrders")
                ?.querySelectorAll(".celName") ?? []
            ).every(
              cel => cel instanceof HTMLElement && cel.innerText === ""
            ) &&
              Array.from(
                document
                  .getElementById("tbodyOrders")
                  ?.querySelectorAll(".celQuant") ?? []
              ).every(
                cel => cel instanceof HTMLElement && cel.innerText === "0"
              ) &&
              document.getElementById("total"))
          )
            document.getElementById("total")!.innerText = " R$ 0,00";
        } catch (e) {
          console.error(
            `Error executing interval in ${new Date().getTime()} for Products table:\n${
              (e as Error).message
            }`
          );
          clearInterval(interv);
          interv && setTimeout(() => clearInterval(interv), 1000);
        }
      }, 200);
      const rowInterv = setInterval(interv => {
        try {
          const tab =
            document.getElementById("productsTab") ??
            document.querySelector('table[id*="products"]') ??
            Array.from(document.querySelectorAll("table")).at(-1);
          if (!(tab instanceof HTMLTableElement))
            throw htmlElementNotFound(tab, `Validation of Table fetched`, [
              "HTMLTableElement",
            ]);
          const tbody =
            tab.querySelector("tbody") ??
            Array.from(document.querySelectorAll("tbody")).at(-1);
          if (!(tbody instanceof HTMLTableSectionElement))
            throw htmlElementNotFound(
              tbody,
              `Validation of Table Body fetched`,
              ["HTMLTableSectionElement"]
            );
          Array.from(tbody.querySelectorAll("tr")).forEach((row, r) => {
            try {
              if (!(row instanceof HTMLTableRowElement))
                throw htmlElementNotFound(row, `Validation of row`, [
                  "HTMLTableRowElement",
                ]);
              if (
                row.innerHTML === "" ||
                parseFinite(
                  getComputedStyle(row).height.replace("px", "").trim()
                ) <= 0
              ) {
                const celQuant = row.querySelector(".celQuant");
                const tabRemove = row.querySelector(".tabRemove");
                if (
                  celQuant instanceof HTMLElement &&
                  celQuant.innerText !== "0"
                )
                  tabRemove instanceof HTMLElement
                    ? handleRemoveOrder(tabRemove)
                    : handleRemoveOrder(celQuant);
                if (
                  !tbodyProps.roots[`${row.id}`] ||
                  !tbodyProps.roots[`${row.id}`]._internalRoot
                )
                  tbodyProps.roots[`${row.id}`] = createRoot(row);
                const rowId = row.id;
                tbodyProps.roots[`${row.id}`].unmount();
                setTimeout(() => {
                  if (
                    document.getElementById(`${rowId}`)?.innerHTML === "" ||
                    parseFinite(
                      getComputedStyle(row).height.replace("px", "").trim()
                    ) <= 0
                  ) {
                    console.log(
                      `No innerHTML in row ${row.id}. Attempting last recover...`
                    );
                    console.log(
                      document.getElementById(`${rowId}`) || "ROW NOT FOUND"
                    );
                    const retryRow = document.getElementById(`${rowId}`) ?? row;
                    tbodyProps.roots[`${rowId || retryRow.id}`] =
                      createRoot(retryRow);
                    console.log(tbodyProps.roots[`${rowId || retryRow.id}`]);
                    tbodyProps.roots[`${rowId || retryRow.id}`].unmount();
                    document.getElementById(`${row.id}`)?.remove();
                  }
                }, 200);
              }
            } catch (e) {
              console.error(
                `Error executing iteration ${r} for checking tbody rows:\n${
                  (e as Error).message
                }`
              );
            }
          });
        } catch (e) {
          console.error(
            `Error executing interval for rows:\n${(e as Error).message}`
          );
          clearInterval(interv);
          interv && setTimeout(() => clearInterval(interv), 1000);
        }
      }, 2000);
      return () => {
        clearInterval(tbodyInterv);
        clearInterval(rowInterv);
      };
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
                  tbodyProps.root && tbodyProps.root.unmount();
                  tbodyProps.root = undefined;
                  for (const innerRoot of Object.keys(tbodyProps.roots)) {
                    tbodyProps.roots[innerRoot] &&
                      tbodyProps.roots[innerRoot].unmount();
                    tbodyProps.roots[innerRoot] = undefined;
                  }
                  if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                    tbodyProps.root = createRoot(tBody);
                  tbodyProps.root.render(
                    <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
                  );
                  setTimeout(() => {
                    if (!document.getElementById("tr_order_ph")) {
                      console.log("Failed first attempt. Retrying...");
                      const tab =
                        document.getElementById("productsTab") ??
                        document.querySelector('table[id*="products"]') ??
                        Array.from(document.querySelectorAll("table")).at(-1);
                      if (!(tab instanceof HTMLTableElement))
                        throw htmlElementNotFound(
                          tab,
                          `Validation of Table fetched`,
                          ["HTMLTableElement"]
                        );
                      tbodyProps.root = undefined;
                      const replaceTbody = document.createElement("tbody");
                      replaceTbody.id = `tbodyOrders`;
                      tab.append(replaceTbody);
                      tbodyProps.ref = replaceTbody;
                      tbodyProps.currentRef = replaceTbody;
                      if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                        tbodyProps.root = createRoot(replaceTbody);
                      tbodyProps.root.render(
                        <OrderRow id="order_ph" title="" />
                      );
                    }
                  }, 500);
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
