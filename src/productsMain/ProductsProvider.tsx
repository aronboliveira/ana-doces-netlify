import { ProductsProviderProps } from "../declarations/interfaces";
import { Product } from "../declarations/classes";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import ProductGrid from "./ProductGrid";
import {
  adjustIdentifiers,
  capitalizeFirstLetter,
  normalizeSpacing,
  syncAriaStates,
} from "../handlersCmn";
import {
  htmlElementNotFound,
  numberError,
  stringError,
} from "../handlersErrors";
import { useEffect, useRef } from "react";
import { nullishMenu } from "../declarations/types";
import SearchBar from "../interactives/SearchBar";
import { createRoot } from "react-dom/client";
import BrowniesHC from "../hardcodedOptions/BrowniesHC";
import TortasHC from "../hardcodedOptions/TortasHC";
import { basePath, mainItems } from "../index";
import BrowniesRechHC from "../hardcodedOptions/BrowniesRechHC";
import BrowniesMiniHC from "../hardcodedOptions/BrowniesMiniHC";
import CookiesHC from "../hardcodedOptions/CookiesHC";
import CookiesMiniHC from "../hardcodedOptions/CookiesMiniHC";
import GeleiaHC from "../hardcodedOptions/GeleiaHC";
import PalhaHC from "../hardcodedOptions/PalhaHC";
import CopoHC from "../hardcodedOptions/CopoHC";
import PaveHC from "../hardcodedOptions/PaveHC";
import BoloPoteHC from "../hardcodedOptions/BoloPoteHC";
import BoloCaseiroHC from "../hardcodedOptions/BoloCaseiroHC";
import BoloFestaHC from "../hardcodedOptions/BoloFestaHC";
import TravessaHC from "../hardcodedOptions/TravessaHC";

export default function ProductsProvider({
  root,
  products,
  navigate,
  searchParams,
  setSearchParams,
}: ProductsProviderProps): JSX.Element {
  const menuRef = useRef<nullishMenu>(null);
  const renderProducts = (products: Array<Product>) => {
    const subOptionsGroup: Array<{ name: string; opts: Array<string[]> }> =
      products
        .filter(
          product =>
            /caseiro/gis.test(product._name) ||
            /festa/gis.test(product._name) ||
            /conjunto/gis.test(product._name) ||
            /torta/gis.test(product._name)
        )
        .map(product => {
          try {
            if (/bolo/gis.test(product._name)) {
              if (/caseiro/gis.test(product._name)) {
                return {
                  name: product._name,
                  opts: [
                    ["pequeno", "grande"].map(subopt =>
                      capitalizeFirstLetter(subopt)
                    ),
                  ],
                };
              } else if (/festa/gis.test(product._name)) {
                return {
                  name: product._name,
                  opts: [
                    ["pequeno", "médio", "grande"].map(subopt =>
                      capitalizeFirstLetter(subopt)
                    ),
                  ],
                };
              } else
                throw stringError(
                  product._name,
                  `/bolo/gis && (/caseiro/gis || /festa/gis)`
                );
            } else if (/conjunto/gis.test(product._name)) {
              if (/cookie/gis.test(product._name)) {
                return {
                  name: product._name,
                  opts: [
                    ["saco", "lata personalizada"].map(subopt =>
                      capitalizeFirstLetter(subopt)
                    ),
                  ],
                };
              } else if (/palha/gis.test(product._name)) {
                return {
                  name: product._name,
                  opts: [
                    ["75g", "150g"].map(subopt =>
                      capitalizeFirstLetter(subopt)
                    ),
                  ],
                };
              } else
                throw stringError(
                  product._name,
                  `/conjunto/gis && (/cookie/gis || /palha/gis)`
                );
            } else if (/torta/gis.test(product._name)) {
              return {
                name: product._name,
                opts: [
                  ["pequena", "média", "grande"].map(subopt =>
                    capitalizeFirstLetter(subopt)
                  ),
                ],
              };
            } else
              throw stringError(product._name, "/bolo/gis || /conjunto/gis");
          } catch (e) {
            console.error(
              `Error executing mapping for product ${product._name}:\n${
                (e as Error).message
              }`
            );
            return { name: product._name, opts: [[]] };
          }
        });
    return products.map((product, i) => {
      return (
        <ErrorBoundary
          key={`errorBoundary_${product}_${i}_#${product?.id || `brk${i}`}`}
          FallbackComponent={() => (
            <GenericErrorComponent
              message={`Erro carregando informações sobre ${
                product._name || "Produto indefinido"
              }`}
              altRoot={root}
              altJsx={<ProductsProvider root={root} products={products} />}
            />
          )}
        >
          <ProductGrid
            key={`${product}_${i}_#${product?.id || `brk${i}`}`}
            name={product._name}
            id={product.id.toString().replaceAll(/\s/g, "-") ?? "noId"}
            price={product.price}
            imgSrc={product.imgSrc ?? "/img/x-octagon.svg"}
            detail={product.detail}
            options={product.options}
            subOptions={
              subOptionsGroup.find(
                possibleProd => possibleProd.name === product._name
              )?.opts || [[]]
            }
          />
        </ErrorBoundary>
      );
    });
  };
  useEffect(() => {
    setTimeout(() => {
      try {
        if (!(menuRef.current instanceof HTMLElement))
          throw htmlElementNotFound(
            menuRef.current,
            `validation of Menu Reference`,
            ["HTMLElement"]
          );
        syncAriaStates(menuRef.current);
      } catch (e) {
        console.error(
          `Error executing scheduled useEffect for Menu Reference for ${
            ProductsProvider.prototype.constructor.name
          }:${(e as Error).message}`
        );
      }
    }, 500);
  }, [menuRef]);
  useEffect(() => {
    try {
      const mainMenu = document.querySelector("menu");
      if (!(mainMenu instanceof HTMLMenuElement))
        throw htmlElementNotFound(mainMenu, `validation of Main Menu Query`, [
          "HTMLMenuElement",
        ]);
      adjustIdentifiers(mainMenu);
      mainItems.listMainItems = Array.from(mainMenu.querySelectorAll("li"))
        .map((item, j) => {
          try {
            if (!(item instanceof HTMLLIElement))
              throw htmlElementNotFound(item, `validation of List Item`, [
                "HTMLLIElement",
              ]);
            return [
              normalizeSpacing(
                item.id
                  .slice(0, item.id.indexOf("__"))
                  .replaceAll("®", "")
                  .replace("div-", "")
                  .replace("-—-conjunto", "")
                  .toLowerCase()
              ),
              j + 1,
            ];
          } catch (e) {
            console.error(
              `Error executing iteration ${j} for item list in main menu:${
                (e as Error).message
              }`
            );
            return ["invalid", -1];
          }
        })
        .filter(
          itemInfo =>
            itemInfo[0] !== "invalid" &&
            typeof itemInfo[1] === "number" &&
            itemInfo[1] >= 0
        );
    } catch (e) {
      setTimeout(() => {
        !document.querySelector("menu") &&
          console.error(
            `Error executing procedure for listing main menu items:\n${
              (e as Error).message
            }`
          );
      }, 5000);
    }
    setTimeout(() => {
      const availableProductRefs = mainItems.listMainItems.map(
        item => item[0] as string
      );
      if (
        availableProductRefs.some(item =>
          new RegExp(item, "gi").test(location.href)
        )
      ) {
        try {
          const mainMenu = document.querySelector("menu");
          if (!(mainMenu instanceof HTMLMenuElement))
            throw htmlElementNotFound(
              mainMenu,
              `validation of Main Menu Query during path read`,
              ["HTMLMenuElement"]
            );
          const items = mainMenu.querySelectorAll("li");
          if (items.length === 0)
            throw numberError(
              items.length,
              `validation of List Items length in Main Menu`
            );
          const matchedItem = Array.from(items).find(item => {
            const locRefRegex = !/&Op-/g.test(location.href)
              ? new RegExp(location.href.slice(location.href.indexOf("?&") + 2))
              : new RegExp(
                  location.href.slice(
                    location.href.indexOf("?&") + 2,
                    location.href.indexOf("&Op-")
                  )
                );
            const normalizedItemId = `${item.id
              .slice(0, item.id.indexOf("__"))
              .replaceAll("®", "")
              .replace("div-", "")
              .replace("-—-conjunto", "")
              .toLowerCase()}`;
            return locRefRegex.test(normalizedItemId) ? item : undefined;
          });
          if (!(matchedItem instanceof HTMLLIElement)) {
            !location.href.endsWith("/") &&
              console.warn(`No matched item for pathname`);
            history.pushState({}, "", basePath);
            return;
          }
          const newDiv = document.createElement("div");
          newDiv.classList.add("contDlg");
          newDiv.style.display = "hidden";
          newDiv.style.position = "relative";
          newDiv.id = `divDlg${matchedItem.id}`;
          matchedItem.insertAdjacentElement("afterend", newDiv);
          matchedItem.scrollIntoView();
          const normalizedMatchItemId = `${matchedItem.id
            .slice(0, matchedItem.id.indexOf("__"))
            .replaceAll("®", "")
            .replace("div-", "")
            .replace("-—-conjunto", "")
            .toLowerCase()}`;
          if (new RegExp(normalizedMatchItemId, "g").test(location.href)) {
            switch (normalizedMatchItemId.replace("?&", "")) {
              case "brownie-simples":
                createRoot(newDiv).render(<BrowniesHC />);
                break;
              case "brownie-recheado":
                createRoot(newDiv).render(<BrowniesRechHC />);
                break;
              case "mini-brownie-recheado":
                createRoot(newDiv).render(<BrowniesMiniHC />);
                break;
              case "cookie-recheado":
                createRoot(newDiv).render(<CookiesHC />);
                break;
              case "mini-cookie":
                createRoot(newDiv).render(<CookiesMiniHC />);
                break;
              case "geleia-artesanal":
                createRoot(newDiv).render(<GeleiaHC />);
                break;
              case "palha-gourmet":
                createRoot(newDiv).render(<PalhaHC />);
                break;
              case "copo-da-felicidade":
                createRoot(newDiv).render(<CopoHC />);
                break;
              case "pave-de-pote":
                createRoot(newDiv).render(<PaveHC />);
                break;
              case "bolo-de-pote":
                createRoot(newDiv).render(<BoloPoteHC />);
                break;
              case "bolo-caseiro":
                createRoot(newDiv).render(<BoloCaseiroHC />);
                break;
              case "bolo-de-festa":
                createRoot(newDiv).render(<BoloFestaHC />);
                break;
              case "taça-recheada":
                createRoot(newDiv).render(<TortasHC />);
                break;
              case "torta-gelada":
                createRoot(newDiv).render(<TortasHC />);
                break;
              case "travessa-recheada":
                createRoot(newDiv).render(<TravessaHC />);
                break;
              default:
                !location.href.endsWith("/") &&
                  console.warn(`No matched item found in switch for pathname`);
                history.pushState({}, "", basePath);
                break;
            }
          }
        } catch (e) {
          console.error(
            `Error executing procedure for modal pathing:\n${
              (e as Error).message
            }`
          );
        }
      }
    }, 1000);
  }, []);
  return (
    <menu id="mainMenu" ref={menuRef}>
      <SearchBar
        navigate={navigate}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      {renderProducts(products)}
    </menu>
  );
}
