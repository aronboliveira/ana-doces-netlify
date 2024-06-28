import { htmlElementNotFound } from "../handlersErrors";
import { useEffect, useRef } from "react";
import { DeliveryOptsProps } from "../declarations/interfaces";
import { nullishDetail, nullishLi } from "../declarations/types";
import {
  adjustIdentifiers,
  capitalizeFirstLetter,
  normalizeSpacing,
  syncAriaStates,
} from "../handlersCmn";

export default function DeliveryOption(props: DeliveryOptsProps): JSX.Element {
  const mainRef = useRef<nullishLi>(null);
  const detailRef = useRef<nullishDetail>(null);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLLIElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Reference for List item in DeliveryOptions`,
          ["HTMLLIElement"]
        );
      syncAriaStates(mainRef.current);
      adjustIdentifiers(mainRef.current);
      if (mainRef.current.id === "") {
        try {
          const relList =
            mainRef.current.closest("ol") ||
            mainRef.current.closest("ul") ||
            mainRef.current.closest("dl");
          if (!(relList instanceof HTMLElement))
            throw htmlElementNotFound(
              relList,
              `validation of Related Listed for List Item in Delivery Options`
            );
          relList.id = `listItem${capitalizeFirstLetter(
            relList.id || normalizeSpacing(relList.classList.toString())
          )}${relList.querySelectorAll("li").length}`;
        } catch (e) {
          console.error(
            `Error executing useEffect for DeliveryOption:\n${
              (e as Error).message
            }`
          );
        }
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for Main Reference in Delivery Option for ${
          props.detailTitle || "untitled"
        }:${(e as Error).message}`
      );
    }
  }, [mainRef, props.detailTitle]);
  useEffect(() => {
    try {
      if (!(detailRef.current instanceof HTMLDetailsElement))
        throw htmlElementNotFound(
          detailRef.current,
          `validation of Details Reference instance`,
          ["HTMLDetailsElement"]
        );
      setTimeout(() => {
        if (!detailRef.current) return;
        if (new RegExp(detailRef.current.id, "gi").test(location.href))
          detailRef.current.open = true;
      }, 300);
    } catch (e) {
      console.error(
        `Error executing useEffect for detailsRef:\n${(e as Error).message}`
      );
    }
  }, [detailRef]);
  return (
    <li className="optDelivery" ref={mainRef}>
      <details
        className="detailsOptDelivery"
        ref={detailRef}
        id={props.detailTitle}
        onToggle={(ev) => {
          const prevHistory = location.href;
          try {
            if (ev.currentTarget.id !== "" && ev.currentTarget.open) {
              !new RegExp(ev.currentTarget.id, "gi").test(location.href) &&
                history.pushState(
                  {},
                  "",
                  `${location.href}&${ev.currentTarget.id}`
                );
            } else
              history.pushState(
                {},
                "",
                `${location.href.replace(`&${ev.currentTarget.id}`, "")}`
              );
          } catch (e) {
            console.error(
              `Error executing callback for ${ev.type} in ${
                ev.currentTarget.id || ev.currentTarget.tagName
              }:${(e as Error).message}`
            );
            history.pushState({}, "", prevHistory);
          }
        }}
      >
        <summary
          className="summaryOptDelivery"
          id={`summary-${props.detailTitle}`}
        >
          {props.summaryText}
        </summary>
        {props.detailsText}
      </details>
    </li>
  );
}
