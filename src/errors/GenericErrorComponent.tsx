import { ErrorComponentProps } from "../declarations/interfaces";
import { useEffect } from "react";
import { Root, createRoot } from "react-dom/client";
import { elementNotFound, numberError } from "../handlersErrors";

if (!sessionStorage.getItem("retryAcc"))
  sessionStorage.setItem("retryAcc", "0");
export default function GenericErrorComponent({
  message = "Erro indefinido",
  altRoot,
  altJsx,
}: ErrorComponentProps): JSX.Element {
  altRoot ??= document.querySelector("main");
  useEffect(() => {
    //setTimeout invoca um Node.timer para executar uma rotina (callback, primeiro argumento) com um delay definido em microssegundos (segundo argumento)
    setTimeout(() => {
      try {
        if (altRoot instanceof Element) {
          let altRooted: Root | undefined;
          if (!("_internalRoot" in altRoot)) createRoot(altRoot);
          if (altJsx instanceof Object && "props" in altJsx) {
            (altRooted as Root).render(altJsx);
          } else
            throw elementNotFound(altJsx, "validating altJsx", ["JSX.Element"]);
          setTimeout(() => {
            altRooted = undefined;
          }, 2000);
        } else
          throw elementNotFound(altRoot, "validating altRoot", ["Element"]);
      } catch (err) {
        setTimeout(() => {
          document.getElementById("productsRoot")!.innerHTML = `
          <div>A página não conseguiu se recuperar automaticamente! 😭 
            <p><strong>Recarregando em 5 segundos</strong>.</p>
          </div>
        `;
        }, 3000);
        setTimeout(() => {
          try {
            const counter = sessionStorage.getItem("retryAcc");
            if (!counter) throw new Error(`Failed to get retryAcc`);
            let numCounter = parseInt(counter);
            if (!Number.isFinite(numCounter))
              throw numberError(
                numCounter,
                `validation of numCounter as finite`
              );
            sessionStorage.setItem("retryAcc", `${++numCounter}`);
          } catch (e) {
            console.error(
              `Error executing update for counter for message ${message}:\n${
                (e as Error).message
              }`
            );
          }
          try {
            const counter = sessionStorage.getItem("retryAcc");
            if (!counter) throw new Error(`Failed to get retryAcc`);
            let numCounter = parseInt(counter);
            if (!Number.isFinite(numCounter))
              throw numberError(
                numCounter,
                `validation of numCounter as finite`
              );
            if (numCounter < 3) location.reload();
            else
              addEventListener("beforeunload", () => {
                sessionStorage.setItem("retryAcc", "0");
              });
          } catch (e) {
            console.error(`Error executing reload:\n${(e as Error).message}`);
          }
        }, 5000);
      }
    }, 3000);
  }, [altJsx, altRoot, message]);
  return (
    <div className="errorWarnDiv">
      <h2>Oops...! Parece que algo deu errado 😨</h2>
      <p>{`${message}`}</p>
      <p>
        Tente <strong>recarregar</strong> a página, ou aguarde alguns segundos!
      </p>
    </div>
  );
}
