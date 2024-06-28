import { SpinnerComponentProps } from "../declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";

export default function Spinner({
  spinnerClass = "spinner-border",
  spinnerColor = "",
  message = "Loading...",
}: SpinnerComponentProps): JSX.Element {
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Error loading Spinner" />
      )}
    >
      <div className={`${spinnerClass} ${spinnerColor} spinner`} role="status">
        <span className="visually-hidden">{`${message}`}</span>
      </div>
    </ErrorBoundary>
  );
}
