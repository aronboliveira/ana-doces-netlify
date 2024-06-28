import { ErrorBoundary } from "react-error-boundary";
import { useLayoutEffect, useRef } from "react";
import { htmlElementNotFound } from "../handlersErrors";
import { syncAriaStates } from "../handlersCmn";
import { nullishSpan } from "../declarations/types";

export default function ErrorIcon({ fill = false }: { fill: boolean }) {
  const svgRef = useRef<nullishSpan>(null);
  useLayoutEffect(() => {
    try {
      if (!(svgRef.current instanceof HTMLElement))
        htmlElementNotFound(
          svgRef.current,
          `validation of SVG span in ${ErrorIcon.prototype.constructor.name}`,
          ["HTMLElement"]
        );
      if (fill) {
        svgRef.current!.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
  				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
				</svg>
				`;
      }
      syncAriaStates(svgRef.current);
    } catch (e) {
      console.error(
        `Error executing useLayoutEffect for ${
          ErrorIcon.prototype.constructor.name
        }:${(e as Error).message}`
      );
    }
  }, [svgRef, fill]);
  return (
    <ErrorBoundary FallbackComponent={() => <></>}>
      <span ref={svgRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-exclamation-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
      </span>
    </ErrorBoundary>
  );
}
