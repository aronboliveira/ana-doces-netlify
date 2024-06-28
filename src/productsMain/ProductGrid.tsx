import { ProductGridProps } from "../declarations/interfaces";
import { useState, useRef, useEffect } from "react";
import {
  elementNotFound,
  stringError,
  htmlElementNotFound,
} from "../handlersErrors";
import { nullishLi, nullishSpan } from "../declarations/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import ProductOptionsDlg from "../productOptions/ProductOptionsDlg";
import { syncAriaStates } from "../handlersCmn";

export default function ProductGrid(props: ProductGridProps): JSX.Element {
  const [shouldShowOptions, setOptions] = useState(false);
  const handleClick = (id: string) => {
    if (refLi.current && new RegExp(id, "g").test(refLi.current.id))
      setOptions(!shouldShowOptions);
  };
  const refLi = useRef<nullishLi>(null);
  const priceRef = useRef<nullishSpan>(null);
  useEffect(() => {
    setTimeout(() => {
      priceRef.current instanceof HTMLElement
        ? (priceRef.current.style.marginBottom = `2vh`)
        : console.error(
            `Error while trying to get Price Element id ${
              priceRef?.current ?? "UNIDENTIFIED"
            }`
          );
    }, 300);
    setTimeout(() => {
      try {
        if (!(refLi.current instanceof Element))
          throw elementNotFound(
            refLi.current,
            `Reference <li> for ${props.id || "unidentified"}`,
            ["Element"]
          );
        if (
          priceRef.current?.innerText !== "" &&
          (/invalidado/gi.test(priceRef.current!.innerText) ||
            /não/gi.test(priceRef.current!.innerText))
        ) {
          refLi.current.hidden = true;
        } else {
          if (
            priceRef.current?.innerText &&
            !/[0-9]/g.test(priceRef.current!.innerText)
          ) {
            console.warn(
              `Error reading price for element with invalid pricing: element id ${
                props.id || "unidentified"
              }`
            );
            if (priceRef.current?.innerText)
              throw stringError(priceRef.current.innerText, "/[0-9]/g");
            else
              throw htmlElementNotFound(
                priceRef.current,
                `Price element for product id ${props.id || "unidentified"}`,
                ["HTMLElement"]
              );
          } else {
            refLi.current.hidden = false;
          }
        }
      } catch (eH) {
        console.error(
          `Error hiding invalid priced element ${
            props.id || "Unidentified"
          }:\n${(eH as Error).message}`
        );
      }
    }, 200);
    syncAriaStates(refLi.current);
  }, [priceRef, props.id]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent
          message={`Erro carregando item para ${props.name ?? "indefinido"}`}
        />
      )}
    >
      <li
        ref={refLi}
        id={`div-${props.name
          .replaceAll(/\s/g, "-")
          .replaceAll(/[êéèë]/g, "e")}__${props.id}`}
        className="divProduct"
        onClick={(event) => {
          event.stopPropagation();
          handleClick(
            `div-${props.name
              .replaceAll(/\s/g, "-")
              .replaceAll(/[êéèë]/g, "e")}__${props.id}`
          );
        }}
        title={`Clique aqui para abrir o menu de opções para ${props.name}`}
      >
        <div className="divProductInfo">
          <h3 className="divProductName">
            <strong>{`${props.name.slice(0, 1).toLocaleUpperCase()}${props.name
              .slice(1)
              .toLocaleLowerCase()}`}</strong>
          </h3>
          <div className="divProductDetails">
            <small>{`${props.detail}`}</small>
          </div>
          <span
            className="divProductPrice"
            ref={priceRef}
          >{`R$ ${props.price}`}</span>
        </div>
        <div className="divProductImg">
          <img
            id={`img_${props.name.replaceAll(" ", "-").toLowerCase()}__${
              props.id
            }`}
            src={`${props.imgSrc}`}
            alt={`imagem_${props.name}`}
            decoding="async"
            loading="lazy"
          ></img>
        </div>
      </li>
      {shouldShowOptions && (
        <ProductOptionsDlg
          setOptions={setOptions}
          shouldShowOptions={shouldShowOptions}
          root={props.options?.at(0)?.root ?? undefined}
          options={props.options}
          subOptions={props.subOptions}
        />
      )}
    </ErrorBoundary>
  );
}
