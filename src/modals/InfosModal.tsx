import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DlgProps } from "../declarations/interfaces";
import { nullishDlg } from "../declarations/types";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  adjustIdentifiers,
  capitalizeFirstLetter,
  isClickOutside,
  normalizeSpacing,
  syncAriaStates,
} from "../handlersCmn";
import { htmlElementNotFound } from "../handlersErrors";
import { basePath } from "../index";
import AuthorCard from "../interactives/AuthorCard";
import AccordionItem from "../interactives/AccordionItem";
import DeliveryOption from "../interactives/DeliveryOption";
import WpIcon from "../icons/WpIcon";
import InstIcon from "../icons/InstIcon";
import AuthorDetails from "../interactives/AuthorDetails";

export default function InfosModal({ dispatch, state }: DlgProps): JSX.Element {
  const accordionId = "accordionSobre";
  const dlgRef = useRef<nullishDlg>(null);
  useEffect(() => {
    const handleKeyPress = (press: KeyboardEvent) => {
      if (press.key === "Escape") {
        dispatch && dispatch(!state);
        if (dlgRef.current)
          state ? dlgRef.current.showModal() : dlgRef.current.close();
      }
    };
    try {
      if (!(dlgRef.current instanceof HTMLDialogElement))
        throw htmlElementNotFound(
          dlgRef.current,
          `validation of ${InfosModal.prototype.constructor.name} Main Reference`,
          ["HTMLDialogElement"]
        );
      dlgRef.current.showModal();
      adjustIdentifiers(dlgRef.current);
      syncAriaStates(dlgRef.current);
      addEventListener("keydown", (press) => handleKeyPress(press));
      try {
        const authorsList = document.getElementById("authorsCoprList");
        if (
          !(
            authorsList instanceof HTMLUListElement ||
            authorsList instanceof HTMLOListElement
          )
        )
          throw htmlElementNotFound(
            authorsList,
            `validation of List of Authors`,
            ["HTMLUListElement", "HTMLOListElement"]
          );
        authorsList.querySelectorAll("li").forEach((listItem, i) => {
          try {
            listItem.classList.add(`listItemAuthorCopr`);
            const listItemAuthor = Array.from(
              listItem.querySelectorAll("*")
            ).filter((listItem) => listItem instanceof HTMLHeadingElement)[0];
            let authorName = "";
            if (listItemAuthor instanceof HTMLHeadingElement)
              authorName = normalizeSpacing(listItemAuthor.innerText);
            if (listItem.id === "")
              listItem.id = `${authorsList.id}Item${i}${capitalizeFirstLetter(
                authorName
              )}`;
          } catch (e) {
            console.error(
              `Error executing iteration ${i} of list item attributions:\n${
                (e as Error).message
              }`
            );
          }
        });
      } catch (e) {
        console.error(
          `Error executing procedure for attributing Authors List properties:\n${
            (e as Error).message
          }`
        );
      }
      return () => removeEventListener("keydown", handleKeyPress);
    } catch (e) {
      console.error(
        `Error executing useEffect for ${
          InfosModal.prototype.constructor.name
        }:${(e as Error).message}`
      );
    }
  }, [dlgRef, dispatch, state]);
  useEffect(() => {
    const activeQuery = /\?q=/g.test(location.href)
      ? `${location.href.slice(location.href.indexOf("?q="))}`
      : "";
    if (!location.href.endsWith("info")) {
      if (/infolocality/gi.test(location.href))
        history.pushState(
          {},
          "",
          `${basePath}${activeQuery}?&info&InfoLocality`
        );
      else if (/infohistory/gi.test(location.href))
        history.pushState(
          {},
          "",
          `${basePath}${activeQuery}?&info&InfoHistory`
        );
      else if (/infopayment/gi.test(location.href))
        history.pushState(
          {},
          "",
          `${basePath}${activeQuery}?&info&InfoPayment`
        );
      else if (/infodelivery/gi.test(location.href)) {
        let detailsState = "?&info&InfoDelivery";
        if (/lessthan30/gi.test(location.href)) detailsState += "&lessThan30";
        if (/equalormorethan30jg/gi.test(location.href))
          detailsState += "&equalOrMoreThan30jg";
        if (/btwn30and50notJg/gi.test(location.href))
          detailsState += "&btwn30and50notJg";
        if (/equalOrMoreThan50notJg/gi.test(location.href))
          detailsState += "&equalOrMoreThan50notJg";
        if (/notIg/gi.test(location.href)) detailsState += "&notIg";
        if (
          location.href.match(/lessthan30/gi) &&
          location.href.match(/lessthan30/gi)!.length > 1
        ) {
          const matchesNum = location.href.match(/lessthan30/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState({}, "", location.href.replace("&lessThan30", ""));
        }
        if (
          location.href.match(/equalormorethan30jg/gi) &&
          location.href.match(/equalormorethan30jg/gi)!.length > 1
        ) {
          const matchesNum =
            location.href.match(/equalormorethan30jg/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState(
              {},
              "",
              location.href.replace("&equalOrMoreThan30jg", "")
            );
        }
        if (
          location.href.match(/btwn30and50notjg/gi) &&
          location.href.match(/btwn30and50notjg/gi)!.length > 1
        ) {
          const matchesNum =
            location.href.match(/btwn30and50notJg/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState(
              {},
              "",
              location.href.replace("&btwn30and50notJg", "")
            );
        }
        if (
          location.href.match(/equalOrMoreThan50notJg/gi) &&
          location.href.match(/equalOrMoreThan50notJg/gi)!.length > 1
        ) {
          const matchesNum =
            location.href.match(/equalOrMoreThan50notJg/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState(
              {},
              "",
              location.href.replace("&equalOrMoreThan50notJg", "")
            );
        }
        if (
          location.href.match(/notig/gi) &&
          location.href.match(/notIg/gi)!.length > 1
        ) {
          const matchesNum = location.href.match(/notIg/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState({}, "", location.href.replace("notIg", ""));
        } else
          history.pushState({}, "", `${basePath}${activeQuery}${detailsState}`);
        setTimeout(() => {
          if (
            !Array.from(
              document
                .getElementById("InfoDelivery")
                ?.querySelectorAll("details") ?? []
            ).some((el) => el instanceof HTMLDetailsElement && el.open)
          ) {
            if (document.getElementById("infoModalDlg")) {
              if (
                document
                  .getElementById("InfoDelivery")
                  ?.classList.contains("show")
              )
                history.pushState(
                  {},
                  "",
                  `${basePath}${activeQuery}?&info&InfoDelivery`
                );
              else history.pushState({}, "", `${basePath}${activeQuery}?&info`);
            } else history.pushState({}, "", `${basePath}${activeQuery}`);
          }
        }, 1000);
      } else if (/infocontact/gi.test(location.href))
        history.pushState(
          {},
          "",
          `${basePath}${activeQuery}?&info&InfoContact`
        );
      else if (/infoowner/gi.test(location.href))
        history.pushState({}, "", `${basePath}${activeQuery}?&info&InfoOwner`);
      else if (/infoauthors/gi.test(location.href)) {
        let detailsState = `?&info&InfoAuthors`;
        if (/Desenvolvimento/gi.test(location.href))
          detailsState += "&Desenvolvimento";
        if (/Identidade_Visual/gi.test(location.href))
          detailsState += "&Identidade_Visual";
        history.pushState({}, "", `${basePath}${activeQuery}${detailsState}`);
        if (
          location.href.match(/Desenvolvimento/gi) &&
          location.href.match(/Desenvolvimento/gi)!.length > 1
        ) {
          const matchesNum =
            location.href.match(/Desenvolvimento/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState(
              {},
              "",
              location.href.replace("&Desenvolvimento", "")
            );
        }
        if (
          location.href.match(/Identidade_Visual/gi) &&
          location.href.match(/Identidade_Visual/gi)!.length > 1
        ) {
          const matchesNum =
            location.href.match(/Identidade_Visual/gi)!.length - 1;
          for (let i = 0; i < matchesNum; i++)
            history.pushState(
              {},
              "",
              location.href.replace("&Identidade_Visual", "")
            );
        }
        setTimeout(() => {
          if (
            !Array.from(
              document
                .getElementById("InfoAuthors")
                ?.querySelectorAll("details") ?? []
            ).some((el) => el instanceof HTMLDetailsElement && el.open)
          ) {
            if (document.getElementById("infoModalDlg")) {
              if (
                document
                  .getElementById("InfoAuthors")
                  ?.classList.contains("show")
              )
                history.pushState(
                  {},
                  "",
                  `${basePath}${activeQuery}?&info&InfoAuthors`
                );
              else history.pushState({}, "", `${basePath}${activeQuery}?&info`);
            } else history.pushState({}, "", `${basePath}${activeQuery}`);
          }
        }, 1000);
      } else history.pushState({}, "", `${basePath}${activeQuery}?&info`);
      const collapsesInterv = setInterval((interv) => {
        try {
          if (!dlgRef.current) return;
          if (!document.getElementById("accordionSobre")) {
            history.pushState({}, "", `${basePath}${activeQuery}`);
            clearInterval(interv);
            return;
          }
          if (
            !Array.from(
              dlgRef.current.querySelectorAll(".accordion-collapse")
            ).some((collapse) => collapse.classList.contains("show"))
          )
            history.pushState({}, "", `${basePath}${activeQuery}?&info`);
        } catch (e) {
          console.error(`Error executing interval:\n${(e as Error).message}`);
        }
      }, 3000);
      setTimeout(() => {
        if (!document.getElementById("accordionSobre")) {
          history.pushState({}, "", `${basePath}${activeQuery}`);
          clearInterval(collapsesInterv);
        } else history.pushState({}, "", `${basePath}${activeQuery}?&info`);
      }, 600000);
    }
    try {
      const localityBtn =
        document.getElementById(`btnInfoLocality`) ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infolocality/gi.test(btn.id) ? btn : undefined;
        })[0];
      const localityCollapse =
        document.getElementById("InfoLocality") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infolocality/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const historyBtn =
        document.getElementById("btnInfoHistory") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infohistory/gi.test(btn.id) ? btn : undefined;
        })[0];
      const historyCollapse =
        document.getElementById("InfoHistory") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infohistory/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const paymentBtn =
        document.getElementById("btnInfoPayment") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infopayment/gi.test(btn.id) ? btn : undefined;
        })[0];
      const paymentCollapse =
        document.getElementById("InfoPayment") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infopayment/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const deliveryBtn =
        document.getElementById("btnInfoDelivery") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infodelivery/gi.test(btn.id) ? btn : undefined;
        })[0];
      const deliveryCollapse =
        document.getElementById("InfoDelivery") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infodelivery/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const contactBtn =
        document.getElementById("btnInfoContact") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infodelivery/gi.test(btn.id) ? btn : undefined;
        })[0];
      const contactCollapse =
        document.getElementById("InfoContact") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infodelivery/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const ownerBtn =
        document.getElementById("btnInfoOwner") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infoowner/gi.test(btn.id) ? btn : undefined;
        })[0];
      const ownerCollapse =
        document.getElementById("InfoOwner") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infoowner/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      const authorsBtn =
        document.getElementById("btnInfoAuthors") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll("button") ?? []
        ).filter((btn) => {
          return /infoauthors/gi.test(btn.id) ? btn : undefined;
        })[0];
      const authorsCollapse =
        document.getElementById("InfoAuthors") ||
        Array.from(
          dlgRef.current
            ?.querySelector(".carousel")
            ?.querySelectorAll(".accordion-collapse") ?? []
        ).filter((collapse) => {
          return /infoauthors/gi.test(collapse.id) ? collapse : undefined;
        })[0];
      if (/&InfoLocality/gi.test(location.href)) {
        /InfoLocality/gi.test(localityBtn.id) &&
          localityBtn.classList.contains("collapsed") &&
          localityBtn.classList.remove("collapsed");
        /InfoLocality/gi.test(localityCollapse.id) &&
          !localityCollapse.classList.contains("show") &&
          localityCollapse.classList.add("show");
      } else if (/&InfoHistory/gi.test(location.href)) {
        /InfoHistory/gi.test(historyBtn.id) &&
          historyBtn.classList.contains("collapsed") &&
          historyBtn.classList.remove("collapsed");
        /InfoHistory/gi.test(historyCollapse.id) &&
          !historyCollapse.classList.contains("show") &&
          historyCollapse.classList.add("show");
      } else if (/&InfoPayment/gi.test(location.href)) {
        /InfoPayment/gi.test(paymentBtn.id) &&
          paymentBtn.classList.contains("collapsed") &&
          paymentBtn.classList.remove("collapsed");
        /InfoPayment/gi.test(paymentCollapse.id) &&
          !paymentCollapse.classList.contains("show") &&
          paymentCollapse.classList.add("show");
      } else if (/&InfoDelivery/gi.test(location.href)) {
        /InfoDelivery/gi.test(deliveryBtn.id) &&
          deliveryBtn.classList.contains("collapsed") &&
          deliveryBtn.classList.remove("collapsed");
        /InfoDelivery/gi.test(deliveryCollapse.id) &&
          !deliveryCollapse.classList.contains("show") &&
          deliveryCollapse.classList.add("show");
      } else if (/&InfoContact/gi.test(location.href)) {
        /InfoContact/gi.test(contactBtn.id) &&
          contactBtn.classList.contains("collapsed") &&
          contactBtn.classList.remove("collapsed");
        /InfoContact/gi.test(contactCollapse.id) &&
          !contactCollapse.classList.contains("show") &&
          contactCollapse.classList.add("show");
      } else if (/&InfoOwner/gi.test(location.href)) {
        /InfoOwner/gi.test(ownerBtn.id) &&
          ownerBtn.classList.contains("collapsed") &&
          ownerBtn.classList.remove("collapsed");
        /InfoOwner/gi.test(ownerCollapse.id) &&
          !ownerCollapse.classList.contains("show") &&
          ownerCollapse.classList.add("show");
      } else if (/&InfoAuthors/gi.test(location.href)) {
        /InfoAuthors/gi.test(authorsBtn.id) &&
          authorsBtn.classList.contains("collapsed") &&
          authorsBtn.classList.remove("collapsed");
        /InfoAuthors/gi.test(authorsCollapse.id) &&
          !authorsCollapse.classList.contains("show") &&
          authorsCollapse.classList.add("show");
      }
    } catch (e) {
      console.error(
        `Error executing procudure for ajusting route for collapse parameter:\n${
          (e as Error).message
        }`
      );
    }
    return () => history.pushState({}, "", `${basePath}${activeQuery}`);
  }, []);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Erro carregando modal de informações!" />
      )}
    >
      {state && (
        <dialog
          className="modal-content"
          id="infoModalDlg"
          ref={dlgRef}
          onClick={(click) => {
            if (
              isClickOutside(click, dlgRef.current!).some(
                (coord) => coord === true
              )
            ) {
              dispatch && dispatch(!state);
              if (dlgRef.current)
                state ? dlgRef.current.showModal() : dlgRef.current.close();
            }
          }}
        >
          <section className="flNoW" aria-hidden="false" id="infoHeader">
            <h2
              className="infoHeading"
              aria-hidden="false"
              id="infoHeadingMain"
            >
              <span aria-hidden="false">Informações</span>
            </h2>
            <button
              className="fade-in-mid btn btn-close"
              aria-hidden="false"
              onClick={() => {
                dispatch && dispatch(!state);
                if (dlgRef.current)
                  state ? dlgRef.current.showModal() : dlgRef.current.close();
              }}
            ></button>
          </section>
          <article id="infoBody" style={{ fontSize: "1.2rem" }}>
            <div className="accordion" id={accordionId}>
              <AccordionItem
                baseId="InfoLocality"
                parentId={accordionId}
                headerText="Localização"
                innerText={
                  <p>
                    <span>Nossa confeitaria fica situada na&nbsp;</span>
                    <strong>Ilha do Governador, Jardim Guanabara</strong>
                    <span>!</span>
                  </p>
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoHistory"
                parentId={accordionId}
                headerText="História"
                innerText={
                  <div id="textHistory">
                    <p className="divHistory">
                      <span className="segmentHistory">
                        Iniciamos nossas atividades em julho de 2021, tendo mais
                        de{" "}
                      </span>
                      <em className="segmentHistory">
                        3 anos de estrada&nbsp;
                      </em>
                      <span className="segmentHistory">até o momento.</span>
                    </p>
                    <div className="divHistory">
                      <span className="segmentHistory">
                        Prezamos pela cozinha&nbsp;
                      </span>
                      <em className="segmentHistory">
                        <strong className="segmentHistory">
                          familiar e artesanal
                        </strong>
                      </em>
                      <span className="segmentHistory">
                        , com escolha de ingredientes&nbsp;
                      </span>
                      <em className="segmentHistory">
                        frescos e de alta qualidade
                      </em>
                      <span className="segmentHistory">!</span>
                    </div>
                  </div>
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoPayment"
                parentId={accordionId}
                headerText="Pagamento"
                innerText={
                  <div id="textPayment">
                    <p className="segmentPayment">
                      Aceitamos pagamento em:&nbsp;
                    </p>
                    <ul className="segmentPayment" id="listPaymentMethods">
                      <li className="itemPaymentMethod">
                        <b className="textPaymentMethod">Pix</b>
                      </li>
                      <li className="itemPaymentMethod">
                        <b className="textPaymentMethod">Dinheiro</b>
                      </li>
                      <li className="itemPaymentMethod">
                        <b className="textPaymentMethod">Débito</b>
                      </li>
                      <li className="itemPaymentMethod">
                        <b className="textPaymentMethod">Crédito</b>
                      </li>
                    </ul>
                  </div>
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoDelivery"
                parentId={accordionId}
                headerText="Delivery"
                innerText={
                  <div id="textDelivery">
                    <div className="divDelivery">
                      <em className="segmentDelivery">As&nbsp;</em>
                      <strong className="segmentDelivery">
                        entregas&nbsp;
                      </strong>
                      <em className="segmentDelivery">
                        são coordenadas de acordo com o tipo de pedido:
                      </em>
                      <ul className="listOptsDelivery">
                        <DeliveryOption
                          summaryText={
                            <strong className="segmentDelivery segmentOptDelivery">
                              Para pedidos menores que&nbsp;
                              <mark className="subSegmentDelivery subSegmentOptDelivery">
                                R$30,00
                              </mark>
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                :
                              </span>
                            </strong>
                          }
                          detailsText={
                            <span className="segmentDelivery segmentOptDelivery">
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                A entrega é&nbsp;
                              </span>
                              <em className="subSegmentDelivery subSegmentOptDelivery">
                                <mark className="subSegmentDelivery subSegmentOptDelivery">
                                  manejado pelo cliente
                                </mark>
                              </em>
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                &nbsp;, podendo contar com a colaboração da loja
                                para chamada de aplicativos terceirazados de
                                entrega.
                              </span>
                            </span>
                          }
                          detailTitle="lessThan30"
                        />
                        <DeliveryOption
                          summaryText={
                            <strong className="segmentDelivery segmentOptDelivery">
                              Para pedidos a partir de&nbsp;
                              <mark className="subSegmentDelivery subSegmentOptDelivery">
                                R$30,00 e no mesmo bairro
                              </mark>
                              &nbsp;&#40;Jardim Guanabara&#41;:&nbsp;
                            </strong>
                          }
                          detailsText={
                            <span className="segmentDelivery segmentOptDelivery">
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                A entrega é&nbsp;
                              </span>
                              <em className="subSegmentDelivery subSegmentOptDelivery">
                                <mark className="subSegmentDelivery subSegmentOptDelivery">
                                  Gratuita!
                                </mark>
                              </em>
                            </span>
                          }
                          detailTitle="equalOrMoreThan30jg"
                        />
                        <DeliveryOption
                          summaryText={
                            <strong className="segmentDelivery segmentOptDelivery">
                              Para pedidos a partir de&nbsp;
                              <mark className="subSegmentDelivery subSegmentOptDelivery">
                                R$30,00, menores que R$50,00 e em outros bairros
                                da Ilha do Governador
                              </mark>
                              &nbsp;&#40;Fora do Jardim Guanabara&#41;:&nbsp;
                            </strong>
                          }
                          detailsText={
                            <span className="segmentDelivery segmentOptDelivery">
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                A taxa de entrega é de&nbsp;
                              </span>
                              <em className="subSegmentDelivery subSegmentOptDelivery">
                                <mark className="subSegmentDelivery subSegmentOptDelivery">
                                  R$10,00
                                </mark>
                              </em>
                            </span>
                          }
                          detailTitle="btwn30and50notJg"
                        />
                        <DeliveryOption
                          summaryText={
                            <strong className="segmentDelivery segmentOptDelivery">
                              Para pedidos a partir de&nbsp;
                              <mark className="subSegmentDelivery subSegmentOptDelivery">
                                R$50,00 e em outros bairros da Ilha do
                                Governador
                              </mark>
                              &nbsp;&#40;Fora do Jardim Guanabara&#41;:
                            </strong>
                          }
                          detailsText={
                            <span className="segmentDelivery segmentOptDelivery">
                              <span className="subSegmentDelivery subSegmentOptDelivery">
                                A taxa de entrega é de&nbsp;
                              </span>
                              <em className="subSegmentDelivery subSegmentOptDelivery">
                                <mark className="subSegmentDelivery subSegmentOptDelivery">
                                  R$6,00
                                </mark>
                              </em>
                            </span>
                          }
                          detailTitle="equalOrMoreThan50notJg"
                        />
                        <DeliveryOption
                          summaryText={
                            <strong className="segmentDelivery segmentOptDelivery">
                              Para pedidos&nbsp;
                              <mark className="subSegmentDelivery subSegmentOptDelivery">
                                Fora da Ilha do Governador
                              </mark>
                            </strong>
                          }
                          detailsText={
                            <span className="segmentDelivery segmentOptDelivery">
                              <em className="subSegmentDelivery subSegmentOptDelivery">
                                Contatar a loja através dos meios de comunicação
                                disponibilizados na página.
                              </em>
                            </span>
                          }
                          detailTitle="notIg"
                        />
                      </ul>
                    </div>
                  </div>
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoContact"
                parentId={accordionId}
                headerText="Contato"
                innerText={
                  <>
                    <div className="divInfoContact" id="wpDivInfoContact">
                      <span className="titleInfoContact" id="wpInfoContact">
                        <span>Clique no Ícone para contatar nosso&nbsp;</span>
                        <strong>WhatsApp:&nbsp;</strong>
                      </span>
                      <a
                        id="anchorWhatsappContact"
                        className="caller highlight"
                        href="https://whatsa.me/5521983022926/?t=Ol%C3%A1,+Ana!+Gostaria+de+fazer+um+pedido+%E2%9C%89%F0%9F%8D%B0"
                        target="_blank"
                        rel="noopener noreferrer nofollow contact"
                        title="Clique aqui para chamar no whatsapp!"
                        aria-hidden="false"
                        style={{
                          zIndex: 10,
                          width: "fit-content",
                          color: "rgb(255, 255, 255)",
                        }}
                      >
                        <WpIcon large={false} />
                      </a>
                    </div>
                    <div className="divInfoContact" id="instDivInfoContact">
                      <span className="titleInfoContact" id="instInfoContact">
                        <span>Clique no Ícone para acessar nosso&nbsp;</span>
                        <strong>Instagram:&nbsp;</strong>
                      </span>
                      <InstIcon />
                    </div>
                  </>
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoOwner"
                parentId={accordionId}
                headerText="A Confeiteira"
                innerText={
                  <AuthorCard
                    authorName="Ana Cristina Barbosa de Oliveira"
                    authorDetails="Confeiteira e Gestora comercial com experiência em Representação comercial"
                    imgSrc="/img/ana_cristina.jpeg"
                  />
                }
                defShow={false}
              />
              <AccordionItem
                baseId="InfoAuthors"
                parentId={accordionId}
                headerText="Autoria & Copyright"
                innerText={
                  <ul id="authorsCoprList">
                    <li>
                      <AuthorDetails
                        authorTitle="Desenvolvimento"
                        authorName="Aron Barbosa de Oliveira"
                        authorDetails="Desenvolvedor de Software Frontend com especialização em JavaScript com foco em React e Next.js."
                        links={[
                          "https://github.com/aronboliveira",
                          "https://www.linkedin.com/in/aron-b-oliveira/",
                        ]}
                      />
                    </li>
                    <li>
                      <AuthorDetails
                        authorTitle="Identidade Visual"
                        authorName="Tuanne Costa Guedes"
                        authorDetails="Designer Gráfica e Ilustradora Digital com experiência em design de UI, Direção de Arte, Marketing e Branding."
                        links={[
                          "https://www.behance.net/tuannecosta",
                          "https://www.linkedin.com/in/tuannecosta/",
                        ]}
                      />
                    </li>
                  </ul>
                }
                defShow={false}
                lastItem={true}
              />
            </div>
          </article>
        </dialog>
      )}
    </ErrorBoundary>
  );
}
