import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { SubotpionsSubDivProps } from "../declarations/interfaces";
import { nullishDiv } from "../declarations/types";
import { htmlElementNotFound } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import SuboptionInp from "./SuboptionInp";
import { handleDoubleClick, syncAriaStates } from "../handlersCmn";

export default function SuboptionsSubDiv({
  subOptionsList,
  inpType,
}: SubotpionsSubDivProps): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Reference`,
          ["HTMLElement"]
        );
      if (mainRef.current.id === "")
        mainRef.current.id = `cont${
          mainRef.current.closest("menu")!.id
        }_${subOptionsList
          .toString()
          .replace("[", "")
          .replace("]", "")
          .replace(",", "-")
          .replace(" ", "_")}`;
    } catch (e) {
      console.error(
        `Error executing useEffect for mainRef in ${
          SuboptionsSubDiv.prototype.constructor.name
        }:\n${(e as Error).message}`
      );
    }
    setTimeout(() => {
      syncAriaStates(mainRef.current);
    }, 300);
  }, [mainRef, subOptionsList]);
  useEffect(() => {
    setLoaded(true);
  }, []);
  useLayoutEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of SubDiv reference`,
          ["HTMLElement"]
        );
      handleDoubleClick(
        [
          ...mainRef.current.querySelectorAll('input[type="radio"]'),
          ...mainRef.current.querySelectorAll('input[type="checkbox"]'),
        ].filter(
          inp =>
            inp instanceof HTMLInputElement &&
            (inp.type === "radio" || inp.type === "checkbox")
        ) as HTMLInputElement[]
      );
      const namingInterval = setInterval(interv => {
        if (!document.querySelector("dialog")) clearInterval(interv);
        try {
          if (!(mainRef.current instanceof HTMLElement))
            throw htmlElementNotFound(
              mainRef.current,
              `Main Reference in timeout for filling ids`,
              ["HTMLElement"]
            );
          if (
            Array.from(mainRef.current.querySelectorAll("*")).every(
              el => !/unfilled/gis.test(el.id)
            ) &&
            Array.from(mainRef.current.querySelectorAll('input[type="radio"]'))
              .filter(
                el => el instanceof HTMLInputElement && el.type === "radio"
              )
              .every(
                (radio, _, arr) =>
                  radio instanceof HTMLInputElement &&
                  arr.every(
                    otherRadio =>
                      otherRadio instanceof HTMLInputElement &&
                      radio.name === otherRadio.name
                  )
              )
          )
            clearInterval(interv);
          mainRef.current.querySelectorAll("*").forEach(el => {
            if (/unfilled/gi.test(el.id))
              el.id = el.id.replace(/unfilled/gi, mainRef.current!.id);
            if (
              (el instanceof HTMLInputElement ||
                el instanceof HTMLButtonElement) &&
              /unfilled/gi.test(el.name)
            )
              el.name = el.id.replace(/unfilled/gi, mainRef.current!.id);
            if (el instanceof HTMLLabelElement && /unfilled/gi.test(el.htmlFor))
              el.htmlFor = el.id.replace(/unfilled/gi, mainRef.current!.id);
          });
          const firstRadio = mainRef.current?.querySelector(
            'input[type="radio"]'
          );
          if (
            firstRadio instanceof HTMLInputElement &&
            firstRadio.type === "radio"
          ) {
            const firstRadioName = firstRadio.name;
            mainRef.current
              .querySelectorAll('input[type="radio"]')
              .forEach(radio => {
                if (radio instanceof HTMLInputElement && radio.type === "radio")
                  radio.name = firstRadioName;
              });
          } else if (document.querySelector("dialog"))
            console.warn(
              `No radios found for ${
                mainRef.current.id || "unidentified refenrece"
              }. Be sure this is intended.`
            );
        } catch (e) {
          console.error(
            `Error executing callback in timeout:${(e as Error).message}`
          );
        }
      }, 1000);
      const clearInterv = setInterval(() => {
        if (!document.querySelector("dialog")) clearInterval(namingInterval);
      });
      setTimeout(() => {
        clearInterval(namingInterval);
      }, 10000);
      setTimeout(() => {
        clearInterval(clearInterv);
      }, 10000);
    } catch (e) {
      console.error(
        `Error executing useLayoutEffect for inputs in ${
          mainRef.current?.id || "unidentified reference"
        }:${(e as Error).message}`
      );
    }
  }, [isLoaded]);
  useLayoutEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Reference`,
          ["HTMLElement"]
        );
      const checkInterv = setTimeout(interv => {
        const firstRadio = mainRef.current?.querySelector(
          'input[type="radio"]'
        );
        if (
          firstRadio instanceof HTMLInputElement &&
          firstRadio.type === "radio"
        ) {
          if (firstRadio.checked) return;
          firstRadio.checked = true;
          clearInterval(interv);
        } else
          console.warn(
            `No radio found for ${
              mainRef.current?.id || "unidentified refenrece"
            }. Be sure this is intended behavior`
          );
      }, 200);
      setTimeout(() => clearInterval(checkInterv), 2000);
    } catch (e) {
      console.error(
        `Error executing useLayoutEffect for checking first radio:\n${
          (e as Error).message
        }`
      );
    }
  }, [isLoaded]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Error rendering Options Container" />
      )}
    >
      <div className="opSubGroup form-check" ref={mainRef}>
        {subOptionsList.map((opt, i) => (
          <SuboptionInp
            option={opt}
            inpType={inpType}
            idx={i}
            key={`opGroupOp${i}`}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}
