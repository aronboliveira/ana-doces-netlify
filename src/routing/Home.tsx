import { ErrorBoundary } from "react-error-boundary";
import Spinner from "../callers/Spinner";
import { useRef } from "react";
import { nullishDiv, nullishNav } from "src/declarations/types";

export default function Home(): JSX.Element {
  const productsRef = useRef<nullishNav>(null);
  const tabRef = useRef<nullishDiv>(null);
  const copyBtnsRef = useRef<nullishDiv>(null);
  return (
    <ErrorBoundary FallbackComponent={() => <></>}>
      <div className="flNoWC" id="mainFirstDiv">
        <section className="sectMain" id="sectCardapio">
          <h1 id="headerLogo">
            <a
              href="https://www.instagram.com/anadoces_rj/"
              rel="external noopener noreferrer"
              target="_blank"
              title="Clique para acessar nosso Instagram!"
            >
              <img
                id="logoHeader"
                src="/img/AnaDoces_colorido.png"
                alt="Logo Ana Doces"
              />
            </a>
            <div className="tips">
              <span className="tip tipB">
                Dica: Clique nos produtos para acessar as opções
              </span>
            </div>
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
          <div id="rootTab" ref={tabRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading table..."
            />
          </div>
          <div className="form-control" id="divTotal">
            <strong className="spanMain" id="totalSpan">
              <span>Total: </span>
            </strong>
            <output id="total">&nbsp;R$ 0,00</output>
          </div>
          <div id="divBtns" ref={copyBtnsRef}>
            <Spinner
              spinnerClass={"spinner-grow"}
              spinnerColor={"text-info"}
              message="Loading copy buttons..."
            />
          </div>
          <span id="btnsTip">
            *Clique nos botões de Copiar para poder colar a mensagem (formato
            padrão ou para o WhatsApp) e então entre em contato clicando no
            botão de Chame!
          </span>
        </section>
      </div>
    </ErrorBoundary>
  );
}
