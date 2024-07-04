import { OrderProps } from "src/declarations/interfaces";

export default function OrderRemove(props: OrderProps): JSX.Element {
  return (
    <td className="celRemove">
      <button
        type="button"
        className="biBtn opBtn opBtnRemove tabRemove"
        id={`btnTabSubt__${document.querySelectorAll(".tabRemove").length}-${
          props.id
        }`}
        aria-hidden="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-dash-square-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"></path>
        </svg>
      </button>
    </td>
  );
}
