import { ErrorMessageProps } from "../declarations/interfaces";

export default function ErrorMessageComponent({
  message = "Erro indefinido",
}: ErrorMessageProps): JSX.Element {
  return (
    <div className="errorWarnDiv">
      <h2>Oops...! Parece que algo deu errado 😨</h2>
      <p>{`${message}`}</p>
      <p>
        Tente <strong>recarregar</strong> a página ou a janela aberta!
      </p>
    </div>
  );
}
