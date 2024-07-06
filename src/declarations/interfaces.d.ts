import { Root, Dispatch, SetStateAction } from "react";
import { Product } from "../controller";
import { ReactText, looseNum, nullishEl, voidishEl } from "./types";
import { ProductOption } from "./classes";
import { NavigateFunction, SetURLSearchParams } from "react-router-dom";

export interface AppContextProps {
  rootsState: Map<string, Root>;
  setRoot: (id: string, root: Root) => Promise<void>;
}

export interface DlgProps {
  dispatch: Dispatch<SetStateAction<boolean>>;
  state: boolean;
}

export interface SearchBarProps {
  navigate?: NavigateFunction;
  searchParams?: URLSearchParams;
  setSearchParams?: SetURLSearchParams;
}

export interface ProductsProviderProps extends SearchBarProps {
  products: Array<Product>;
  root?: Root | nullishEl;
}

export interface ProductOptionsProps {
  opName: string;
  price: string;
  desc: string;
  _id: string | number;
  __id?: string | number;
  root?: Root | nullishEl;
}

export interface ProductGridProps {
  name: string;
  id: string | number;
  price: string | number;
  imgSrc: string;
  options: Array<ProductOptions>;
  detail?: string;
  subOptions: Array<string[]>;
}

export interface ProductOptionsDlgProps
  extends Pick<ProductGridProps, Partial<ProductGridProps, "subOptions">> {
  options?: Array<ProductOptions | undefined>;
  shouldShowOptions?: boolean;
  setOptions?: (value: A) => void;
  root?: Root | nullishEl;
}

export interface ErrorMessageProps {
  message: string;
}

export interface ErrorComponentProps extends ErrorMessageProps {
  altRoot?: Root | nullishEl;
  altJsx?: JSX.Element;
}

export interface TbodyProps extends Record<string, Root> {
  currentRef: voidishEl;
  root?: Root;
  primaryRowRoot?: Root;
  roots: { [k: string]: Root | undefined };
}

export interface Order {
  title: string;
  quantity: looseNum;
}

export interface OrderProps extends Partial<Order> {
  id?: string;
}

export interface OrderTitleProps
  extends Omit<Required<OrderProps>, "quantity"> {}

export interface OrderQuant extends Omit<Required<OrderProps>, "title"> {}

export interface SuboptionsContProps
  extends Pick<ProductGridProps, "subOptions"> {
  inpType: string;
}

export interface SubotpionsSubDivProps
  extends Pick<SuboptionsContProps, "inpType"> {
  subOptionsList: string[];
  idx?: looseNum;
}

export interface SuboptionProp
  extends Pick<SuboptionsContProps, "inpType">,
    Pick<SubotpionsSubDivProps, "idx"> {
  option: string;
  parentId?: string;
}

export interface LinkProps {
  innerTextL: string;
  href: string;
  target: "_self" | "_blank" | "_parent" | "_top";
  hreflang?: string;
  download?: boolean;
  referrerPolicy?: string;
  rel?: string;
  color?: string;
}

export interface DirectCallerProps extends LinkProps {
  ComponentCase: string;
}

export interface QRCodeCallerProps extends LinkProps {
  src: string;
}

export interface SpinnerComponentProps {
  spinnerClass: spinnerAnimationClasses;
  spinnerColor: spinnerColorClasses;
  message: string;
}

export interface AccordItemProps {
  baseId: string;
  parentId: string;
  headerText: ReactText;
  innerText: ReactText;
  defShow: boolean;
  lastItem?: boolean;
}

export interface AuthorProps {
  authorName: string;
  authorDetails: string;
  links?: string[];
}

export interface AuthorCardProps extends AuthorProps {
  imgSrc: string;
}

export interface AuthorTextProps extends AuthorProps {
  authorTitle: string;
}

export interface DeliveryOptsProps {
  summaryText: ReactText;
  detailsText: ReactText;
  detailTitle: string;
  listNum?: looseNum;
}
