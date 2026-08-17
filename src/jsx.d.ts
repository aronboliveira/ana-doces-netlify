import type { JSX as ReactJSX } from "react";
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
  }
}
