import { useEffect } from "react";
import { addListenerCopyMessage, syncAriaStates } from "../handlersCmn";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { ErrorBoundary } from "react-error-boundary";
import DirectCaller from "../callers/DirectCaller";

export default function CopyButtonsDiv(): JSX.Element {
  useEffect(() => {
    addListenerCopyMessage();
    syncAriaStates(document.getElementById("divBtns"));
  }, []);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Erro carregando botões para cópia" />
      )}
    >
      <div className="divMain" id="confirmDiv">
        <button
          type="button"
          className="selectItemBtn btn btn-rounded btn-magenta"
          id="copyBtnInst"
        >
          Copiar Texto Padrão
        </button>
      </div>
      <span id="copyAlert">Texto copiado</span>
      <button className="copyBtn btn btn-success btn-rounded" id="copyBtnWp">
        Copiar Texto para o WhatsApp
      </button>
      <DirectCaller
        innerTextL="Chame no Whatsapp!"
        target="_blank"
        rel="noopener noreferrer nofollow contact"
        color="#ffff"
        href="https://whatsa.me/5521983022926/?t=Ol%C3%A1,+Ana!+Gostaria+de+fazer+um+pedido+%E2%9C%89%F0%9F%8D%B0"
        hreflang="pt-BR"
        ComponentCase="whatsapp"
      />
    </ErrorBoundary>
  );
}
