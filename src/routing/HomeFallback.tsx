import { ErrorBoundary } from "react-error-boundary";
import Spinner from "../callers/Spinner";
import { useRef } from "react";
import { nullishDiv, nullishNav } from "src/declarations/types";

export default function HomeFallback(): JSX.Element {
  const productsRef = useRef<nullishNav>(null);
  const tabRef = useRef<nullishDiv>(null);
  const copyBtnsRef = useRef<nullishDiv>(null);
  const callBtnsRef = useRef<nullishDiv>(null);
  return (
    <ErrorBoundary FallbackComponent={() => <></>}>
      <div className="flNoWC" id="mainFirstDiv">
        <section className="sectMain" id="sectCardapio">
          <h1>
            <img
              id="logoHeader"
              src="/img/AnaDoces_colorido.png"
              alt="Logo Ana Doces"
            />
          </h1>
          <hr className="incrHr" />
          <nav id="productsRoot" ref={productsRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading main content..."
            />
          </nav>
          <hr className="incrHr" />
        </section>
        <section className="sectMain" id="sectTexto">
          <div className="form-control" id="divTotal">
            <strong className="spanMain" id="totalSpan">
              <span>Total: </span>
            </strong>
            <output id="total">&nbsp;R$ 0,00</output>
          </div>
          <div id="rootTab" ref={tabRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading table..."
            />
          </div>
          <div id="divBtns" ref={copyBtnsRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading copy buttons..."
            />
          </div>
          <div id="divCallers" ref={callBtnsRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading calling buttons..."
            />
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}
