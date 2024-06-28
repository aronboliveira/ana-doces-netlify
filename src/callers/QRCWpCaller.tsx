import { useState, useEffect, useRef } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  capitalizeFirstLetter,
  syncAriaStates,
  testSource,
} from "../handlersCmn";
import { QRCodeCallerProps } from "../declarations/interfaces";
import { nullishAnchor } from "../declarations/types";
import Spinner from "./Spinner";
import { Root, createRoot } from "react-dom/client";

export default function QRCWpCaller({
  innerTextL,
  href,
  target,
  rel,
  color: _color,
  src,
}: QRCodeCallerProps) {
  const aRef = useRef<nullishAnchor>(null);
  const renderQRCodeImg = async (root: Root, src: string) => {
    if (await testSource(src))
      root.render(<img className="qrcode-img" loading="lazy" src={src} />);
    else console.warn(`Failed to load QRCode img`);
  };
  useEffect(() => {
    try {
      if (!(aRef.current instanceof HTMLAnchorElement))
        throw htmlElementNotFound(
          aRef.current,
          `validation of Anchor reference`,
          ["HTMLAnchorElement"]
        );
      const aRoot = createRoot(aRef.current);
      if (_color) aRef.current.style.color = _color;
      const imgInterv = setInterval(interv => {
        if (!aRef.current?.querySelector(".qrcode-img")) {
          aRef.current instanceof HTMLElement
            ? renderQRCodeImg(aRoot, src)
            : clearInterval(interv);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(imgInterv);
        if (
          aRef.current instanceof HTMLElement &&
          !aRef.current.querySelector(".qrcode-img")
        )
          console.error(`Failed to load QRCode Image`);
      }, 10000);
    } catch (e) {
      console.error(
        `Error executing useEffect for aRef in ${
          QRCWpCaller.prototype.constructor.name
        } for case ${innerTextL}:${(e as Error).message}`
      );
    }
    setTimeout(() => {
      syncAriaStates(aRef.current);
    }, 1100);
  }, [aRef]);
  const [
    ,
    // state
    dispatch,
  ] = useState<boolean>(false);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message={`Error loading Link`} />
      )}
    >
      <a
        ref={aRef}
        id={`anchor${capitalizeFirstLetter(innerTextL)}`}
        className="caller highlight"
        href={`${href}`}
        target={`${target}`}
        rel={`${rel}`}
        title={`Clique aqui para chamar`}
        onClick={ev => {
          ev.preventDefault();
          dispatch(!dispatch);
          // router.push("/author");
        }}
      >
        <Spinner
          spinnerClass={`spinner-grow`}
          spinnerColor={`text-info`}
          message="Loading QRCode..."
        />
      </a>
    </ErrorBoundary>
  );
}
