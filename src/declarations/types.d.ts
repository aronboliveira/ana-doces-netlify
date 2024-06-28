import { Root } from "react-dom/client";
import { AppContextProps } from "./interfaces";

export type voidish = null | undefined;
export type voidishStr = string | null | undefined;
export type looseNum = string | number;
export type voidishLooseNum = looseNum | voidish;
export type nullishEl = Element | null;
export type voidishEl = nullishEl | undefined;
export type nullishHTMLEl = HTMLElement | null;
export type voidishHTMLEl = HTMLElement | voidish;
export type nullishSpan = HTMLSpanElement | null;
export type nullishDlg = HTMLDialogElement | null;
export type nullishMenu = HTMLMenuElement | null;
export type nullishLi = HTMLLIElement | null;
export type nullishBtn = HTMLButtonElement | null;
export type nullishTa = HTMLTextAreaElement | null;
export type nullishInp = HTMLInputElement | null;
export type nullishLooseInp = nullishInp | HTMLTextAreaElement;
export type nullishOutp = HTMLOutputElement | null;
export type nullishTab = HTMLTableElement | null;
export type nullishCel = HTMLTableCellElement | null;
export type nullishDiv = HTMLDivElement | null;
export type nullishLab = HTMLLabelElement | null;
export type nullishAnchor = HTMLAnchorElement | null;
export type nullishNav = HTMLElement & {
  tagName: "NAV";
};
export type HTMLStrong = HTMLElement & {
  tagName: "STRONG";
};
export type nullishStrong = HTMLStrong | null;
export type nullishHeading = HTMLHeadingElement | null;
export type nullishDetail = HTMLDetailsElement | null;
export type nodeScope = voidishHTMLEl | Document | DocumentFragment;
export type voidishRoot = Root | voidish;
export type voidishAppContext = AppContextProps | voidish;
export type RootAction = { type: "SET_ROOT"; id: string; root: Root };
export type ReactText = string | React.Element | JSX.Element | JSX.Element[];
export type spinnerAnimationClasses = "spinner-border" | "spinner-grow";
export type spinnerColorClasses =
  | "text-danger"
  | "text-primary"
  | "text-secondary"
  | "text-success"
  | "text-warning"
  | "text-info"
  | "text-light"
  | "text-dark"
  | "";
