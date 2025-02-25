import ProductsProvider from "../productsMain/ProductsProvider";
import { createRoot } from "react-dom/client";
import { Product, ProductOption } from "../declarations/classes";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import { ErrorBoundary } from "react-error-boundary";
import { htmlElementNotFound, numberError } from "../handlersErrors";
import { TableOrders } from "../tableComponents/TableOrders";
import CopyButtonsDiv from "../buttons/CopyButtonsDiv";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import Home from "./Home";
import { useContext, useEffect, useState } from "react";
import Spinner from "../callers/Spinner";
import { AppContext } from "./AppProvider";
import { voidishAppContext } from "../declarations/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adjustIdentifiers } from "../handlersCmn";
import { basePath } from "../index";

export default function AnaDocesApp(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooted, setRooted] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<number>(0);
  const [finished, setFinish] = useState<boolean>(false);
  const context = useContext<voidishAppContext>(AppContext);
  if (!context) throw new Error(`No valid context found.`);
  const { rootsState, setRoot } = context;
  useEffect(() => {
    const mainEl =
      document.getElementById("mainRoot") ??
      document.querySelector(".mainRoot");
    try {
      if (!(mainEl instanceof HTMLElement))
        throw htmlElementNotFound(mainEl, `validation of <main>`, [
          "HTMLElement",
        ]);
      if (!rootsState || !rootsState.has(`${mainEl.id}`)) {
        const mainRoot = createRoot(mainEl);
        setRoot(`${mainEl.id}`, mainRoot).then(() => {
          !rooted && setRooted(true);
        });
      }
    } catch (e) {
      console.error(
        `Error executing attempt to create Main Root:\n${(e as Error).message}`
      );
    }
  }, [rootsState, setRoot]);
  useEffect(() => {
    try {
      if (!rooted)
        throw new Error(`Component wasn't rooted. Aborting process.`);
      const prodTry = async () => {
        try {
          const mainEl = document.getElementById("mainRoot");
          if (!(mainEl instanceof HTMLElement))
            throw htmlElementNotFound(mainEl, `validation of mainEl`, [
              "HTMLElement",
            ]);
          if (!rootsState.get(`${mainEl.id}`)) {
            console.warn("!REDUCER: reducing failed");
            throw new Error("INIT: failed to root <main>");
          }
          rootsState.get(`${mainEl.id}`).render(<Home />);
          setTimeout(() => {
            document.getElementById("productsRoot") &&
              !loaded &&
              setLoaded(true);
          }, 200);
          setTimeout(() => {
            document.getElementById("productsRoot") &&
              !loaded &&
              setLoaded(true);
          }, 400);
        } catch (e) {
          console.error(`Error executing prodTry:\n${(e as Error).message}`);
        }
      };
      prodTry().then(() => {
        prodTry().then(() => {
          if (!document.getElementById("productsRoot")) {
            const prodInterv = setInterval(interv => {
              if (document.getElementById("productsRoot")) {
                !loaded && setLoaded(true);
                clearInterval(interv);
              }
              const mainEl = document.getElementById("mainRoot");
              if (!(mainEl instanceof HTMLElement))
                throw htmlElementNotFound(mainEl, `validation of mainEl`, [
                  "HTMLElement",
                ]);
              if (!rootsState.get(`${mainEl.id}`)) {
                console.warn("!REDUCER: reducing failed");
                throw new Error("INIT: failed to root <main>");
              }
              rootsState.get(`${mainEl.id}`).render(<Home />);
            }, 200);
            setTimeout(() => {
              clearInterval(prodInterv);
            }, 2000);
          }
        });
      });
      const prodInterv = setInterval(interv => {
        if (document.getElementById("productsRoot")) {
          setLoaded(true);
          clearInterval(interv);
        }
        const mainEl = document.getElementById("mainRoot");
        if (mainEl instanceof HTMLElement) {
          if (rootsState.get(`${mainEl.id}`)) {
            rootsState.get(`${mainEl.id}`).render(<Home />);
          } else {
            console.warn("INIT: failed to root <main>");
            console.warn("!REDUCER: reducing failed");
          }
        }
      }, 100);
      setTimeout(() => {
        clearInterval(prodInterv);
      }, 2000);
    } catch (e) {
      setTimeout(() => {
        !document.querySelector("li") &&
          console.error(
            `Error executing useEffect for rooted:\n${(e as Error).message}`
          );
      }, 5000);
    }
  }, [rooted]);
  useEffect(() => {
    try {
      if (!rootsState)
        throw new Error(
          `No state for roots available. Aborting build attempts.`
        );
      if (!loaded)
        throw new Error(`Home wasn't loaded. Aborting build attempts.`);
      const buildAttempt = setInterval(interv => {
        if (
          mounted === 3 ||
          (document.querySelectorAll(".divProduct").length > 2 &&
            document.querySelector("table") &&
            document.getElementById("anchorChame_no_Whatsapp"))
        ) {
          clearInterval(interv);
          return;
        }
        const productRoot = document.getElementById("productsRoot");
        try {
          if (!(productRoot instanceof HTMLElement))
            throw htmlElementNotFound(productRoot, `validating productRoot`, [
              "HTMLElement",
            ]);
          if (!rootsState.get(`${productRoot.id}`)) {
            setRoot(`${productRoot.id}`, createRoot(productRoot));
            setMounted(1);
          } else setMounted(1);
        } catch (err) {
          console.error(
            `Error fetching root for products: ${(err as Error).message}`
          );
        }
        try {
          const rootTab = document.getElementById("rootTab");
          if (!(rootTab instanceof HTMLElement))
            throw htmlElementNotFound(
              rootTab,
              `Root Element for Table of orders`,
              ["HTMLElement"]
            );
          if (!rootsState.get(`${rootTab.id}`)) {
            setRoot(`${rootTab.id}`, createRoot(rootTab));
            setMounted(2);
          } else setMounted(2);
        } catch (e) {
          console.error(
            `Error fetching root for Table of orders: ${(e as Error).message}`
          );
        }
        try {
          const divBtns = document.getElementById("divBtns");
          if (!(divBtns instanceof HTMLElement))
            throw htmlElementNotFound(
              divBtns,
              `Root Element for Copying Buttons`,
              ["HTMLElement"]
            );
          if (!rootsState.get(`${divBtns.id}`)) {
            setRoot(`${divBtns.id}`, createRoot(divBtns));
            setMounted(3);
          } else setMounted(3);
        } catch (e) {
          console.error(
            `Error rendering CopyButtonsDiv:\n${(e as Error).message}`
          );
        }
      }, 100);
      setTimeout(() => {
        clearInterval(buildAttempt);
      }, 5000);
    } catch (eL) {
      setTimeout(() => {
        !document.querySelector("li") &&
          console.error(
            `Error executing routine for loaded block:\n${
              (eL as Error).message
            }`
          );
      }, 5000);
    }
  }, [loaded]);
  useEffect(() => {
    try {
      setTimeout(() => {
        if (mounted < 3 && !document.querySelector("li")) {
          throw numberError(mounted, `validation of mounted value`);
        }
      }, 5000);
      if (mounted >= 3) {
        const renderTry = async (): Promise<void> => {
          const productRoot = document.getElementById("productsRoot");
          if (!(productRoot instanceof HTMLElement))
            throw htmlElementNotFound(
              productRoot,
              `validation of productRoot`,
              ["HTMLElement"]
            );
          if (!rootsState.has(`${productRoot.id}`))
            throw new Error(`Error validating productRoot`);
          const ProductsProviderCall = (
            <ProductsProvider
              root={rootsState.get(`${productRoot.id}`)}
              navigate={navigate}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              products={[
                [
                  "Brownie Simples",
                  "8,00",
                  "/img/simples_brownie_generic.jpeg",
                  `Massa cremosa e macia, feita com o mais puro chocolate nobre meio-amargo e com opção de nozes de nogueira.`,
                  Product.fabricOption([
                    [
                      "Sem Nozes",
                      "8,00",
                      "O clássico! Ainda mais maciez e cremosidade.",
                    ],
                    [
                      "Com Nozes",
                      "9,00",
                      "Adição de nozes de nogueira em excelente harmonização!",
                    ],
                  ]),
                ],
                [
                  "Brownie Recheado",
                  "12,00",
                  "/img/brownie_generic.jpeg",
                  `Massa cremosa e macia, feita com o mais puro chocolate nobre, com diversos sabores de recheios especiais disponíveis. Duas fatias de brownies unidas por uma camada saborosa de recheio.`,
                  Product.fabricOption([
                    [
                      "Brigadeiro",
                      "",
                      "Com brigadeiro irresistível, cremoso e repleto de chocolate, perfeito para qualquer ocasião!",
                    ],
                    [
                      "Brigadeiro de Pistache",
                      "",
                      "Acentuado sabor do pistache em um recheio cremoso único.",
                    ],
                    [
                      "Doce de Leite",
                      "",
                      "Camadas generosas de doce de leite, um mimo deliciosamente indulgente.",
                    ],
                    [
                      "Kinder Bueno®",
                      "",
                      "Com pedaços do inconfundível Kinder Bueno, criando um sabor único.",
                    ],
                    [
                      "Limão",
                      "",
                      "Refrescante twist, com toques cítricos para uma doçura equilibrada.",
                    ],
                    [
                      "Maracujá",
                      "",
                      "Notas tropicais, ideal para quem busca equilíbrio entre acidez e doçura",
                    ],
                    [
                      "Ninho®",
                      "",
                      "Enriquecido com leite em pó Ninho®, uma nostalgia em cada mordida!",
                    ],
                    [
                      "Ninho® com Nutella®",
                      "",
                      "A doçura do leite em pó combinada com a cremosidade do creme de avelã em um brownie extraordinariamente saboroso!",
                    ],
                    [
                      "Nutella®",
                      "",
                      "Ultrachocolateado, com uma camada generosa de creme de avelã.",
                    ],
                    [
                      "Nutella® com Morango",
                      "",
                      "Perfeita combinação de cremosidade e frescor em um brownie de sabor balanceado e intenso.",
                    ],
                    [
                      "Oreo®",
                      "",
                      "Com pedaços de biscoito de chocolate em uma fusão deliciosa de cremosidade e crocância.",
                    ],
                    [
                      "Prestígio®",
                      "",
                      "Recheio cremoso de coco envolto em chocolate, inspirado no clássico Prestígio®.",
                    ],
                  ]),
                ],
                [
                  "Mini Brownie Recheado",
                  "4,00",
                  "/img/mini_brownie_generic.jpeg",
                  "Versão compactada do saboroso Brownie Recheado, com diversos sabores de recheios especiais disponíveis.",
                  Product.fabricOption([
                    [
                      "Brigadeiro",
                      "",
                      "Com brigadeiro irresistível, cremoso e repleto de chocolate, perfeito para qualquer ocasião!",
                    ],
                    [
                      "Brigadeiro de Pistache",
                      "",
                      "Acentuado sabor do pistache em um recheio cremoso único.",
                    ],
                    [
                      "Doce de Leite",
                      "",
                      "Camadas generosas de doce de leite, um mimo deliciosamente indulgente.",
                    ],
                    [
                      "Kinder Bueno®",
                      "",
                      "Com pedaços do inconfundível Kinder Bueno, criando um sabor único.",
                    ],
                    [
                      "Kit Kat®",
                      "",
                      "Cremoso mousse de chocolate ao leite com pedaços crocantes de Kit Kat®",
                    ],
                    [
                      "Limão",
                      "",
                      "Refrescante twist, com toques cítricos para uma doçura equilibrada.",
                    ],
                    [
                      "Maracujá",
                      "",
                      "Notas tropicais, ideal para quem busca equilíbrio entre acidez e doçura",
                    ],
                    [
                      "Ninho®",
                      "",
                      "Enriquecido com leite em pó Ninho®, uma nostalgia em cada mordida!",
                    ],
                    [
                      "Ninho® com Nutella®",
                      "",
                      "A doçura do leite em pó combinada com a cremosidade do creme de avelã em um brownie extraordinariamente saboroso!",
                    ],
                    [
                      "Nutella®",
                      "",
                      "Ultrachocolateado, com uma camada generosa de creme de avelã.",
                    ],
                    [
                      "Nutella® com Morango",
                      "",
                      "Perfeita combinação de cremosidade e frescor em um brownie de sabor balanceado e intenso.",
                    ],
                    [
                      "Oreo®",
                      "",
                      "Com pedaços de biscoito de chocolate em uma fusão deliciosa de cremosidade e crocância.",
                    ],
                    [
                      "Prestígio®",
                      "",
                      "Recheio cremoso de coco envolto em chocolate, inspirado no clássico Prestígio®.",
                    ],
                  ]),
                ],
                [
                  "Cookie Recheado",
                  "12,00",
                  "/img/cookie_generic.jpeg",
                  "Feito com Brown Butter, gotas de chocolate e uma camada generosa de recheio à sua escolha.",
                  Product.fabricOption([
                    [
                      "Chocolate com Maracujá",
                      "",
                      "Deliciosa massa de chocolate preto meio-amargo combinado com o frescor do recheio de brigadeiro de maracujá!",
                    ],
                    [
                      "Chocolatudo",
                      "",
                      "Dose dupla de chocolate preto meio-amargo, na massa e no recheio, para os amantes do sabor intenso do cacau!",
                    ],
                    [
                      "Duochoco",
                      "",
                      "Massa de chocolate preto meio-amargo, com equilibrado recheio de chocolate branco.",
                    ],
                    [
                      "Ferrero Rocher®",
                      "12,00",
                      "Massa de chocolate com o sabor convidativo, único e levemente granulado do bombom de Ferrero Rocher®",
                    ],
                    [
                      "Nutella®",
                      "",
                      "Massa de baunilha com recheio caprichado de gotas de Nutella.",
                    ],
                    [
                      "Pistache",
                      "",
                      "Massa de baunilha com gotas recheadas de chocolate branco combinadas com pistache em mistura com um delicioso brigadeiro!",
                    ],
                    [
                      "Red Velvet com Chocolate branco",
                      "",
                      "Massa de Red Velvet com recheio de chocolate branco, proporcionando suavidade e doçura.",
                    ],
                  ]),
                ],
                [
                  "Mini Cookie — conjunto",
                  "15,00 – 25,00",
                  "/img/mini-cookie.jpeg",
                  "Conjunto de versões mini dos Cookies, incluindo saquinho ou latinha personalizada!",
                  Product.fabricOption([
                    [
                      "Baunilha com gotas de chocolate",
                      "",
                      "O aroma doce e convidativo da baunilha combinado com o acento marcante de gotas de chocolate ao leite em um doce inconfundível!",
                    ],
                    [
                      "Chocolatudo",
                      "",
                      "Dose dupla de chocolate preto meio-amargo, na massa e no recheio, para os amantes da intensidade!",
                    ],
                    [
                      "Red Velvet com gotas de chocolate branco",
                      "",
                      "O sabor marcante do Red Velvet em combinação com o acento de intensidade do chocolate branco, para um sabor equilibrado e doçura na medida.",
                    ],
                  ]),
                ],
                [
                  "Geleia Artesanal",
                  "25,00 – 30,00",
                  "/img/geleia-de-morango.jpeg",
                  "Geleias caseiras feitas com frutas frescas, selecionadas cuidadosamente para complementar massas e outros doces!",
                  Product.fabricOption([
                    [
                      "Frutas Vermelhas",
                      "25,00",
                      "Um clássico conquistador! A combinação de frutas vermelhas é garantia de doçura equilibrada e paladar requintado.",
                    ],
                    [
                      "Maracujá",
                      "",
                      "O sabor intenso e suavemente ácido do Maracujá em uma geleia perfeita para acompanhar massas doces e pães.",
                    ],
                    [
                      "Morango",
                      "",
                      "Feita com frutos frescos e doces, a geleia de morango é um clássico e garantia de satisfação!",
                    ],
                    [
                      "Pêssego",
                      "",
                      "Delicado e ao mesmo tempo intenso com acento equilibrado, a geleia de pêssego é perfeita para todas as sobremesas!",
                    ],
                  ]),
                ],
                [
                  "Palha Gourmet — conjunto",
                  "12,00",
                  "/img/palha-gourmet-2.jpeg",
                  "Massa de chocolate nobre meio-amargo com leite condensado. Leve toque especial de sementes de pistache e cereja, equilibrando maciez e crocância!",
                  Product.fabricOption([
                    [
                      "Com Castanha",
                      "",
                      "Crocante e levemente acentuador, o sabor único da castanha-de-caju incorporado no marcante sabor da Palha Italiana Gourmet",
                    ],
                    [
                      "Com Nozes",
                      "",
                      "Para os amantes do sabor granulado das nozes de nogueira. Crocância extra!",
                    ],
                    [
                      "Com Castanha e Nozes",
                      "",
                      "Crocância máxima! Para os que amam a textura consistente dos cereais em combinação com a maciez da Palha Italiana Gourmet",
                    ],
                  ]),
                ],
                [
                  "Copo da Felicidade",
                  "20,00",
                  "/img/copo-da-felicidade.jpg",
                  "Deliciosas taças com cremosidade e maciez encantadora, acompanhadas de sabores que propociam crocância, acento e granulosidade",
                  Product.fabricOption([
                    [
                      "Ferrero Rocher®",
                      "",
                      "Farofinha de avelã e camadas generosas de mousse de avelã, chocolate com pedaços triturados de avelã, mousse de chocolate meio-amargo e finalizados com um bombom de Ferrero Roche®",
                    ],
                    [
                      "Kinder Bueno®",
                      "",
                      "Camadas intercalas de creme de chocolate ao leite com avelãs, Nutella®, mousse de chocolate branco, com finalização de bombom de Kinder Bueno®",
                    ],
                    [
                      "Kit Kat®",
                      "",
                      "Generosas camadas de mousse de Kit Kat® intercaladas com creme de chocolate meio-amargo, chantili e pedacinhos de Kit Kat®",
                    ],
                    [
                      "Morango com Chantininho",
                      "",
                      "Camadas generosas de Mousse de Ninho® intercalados com morangos e finalizadas com um saboroso chantili",
                    ],
                    [
                      "Oreo®",
                      "",
                      "Camadas de Massa de biscoito Oreo® com camadas de mousse de chocolate ao leite, creme do recheio Oreo® salpicada com grânulos do biscoito, finalizado com creme de puro chocolate meio-amargo!",
                    ],
                  ]),
                ],
                [
                  "Pavê de Pote",
                  "18,00",
                  "/img/pave-no-pote.jpeg",
                  "Camadas de biscoitos macios, creme suave e recheios à escolha. Servidos em um pote conveniente e prático.",
                  Product.fabricOption([
                    [
                      "Doce de leite",
                      "",
                      "Camadas de creme de doce de leite intercaladas com biscoitos suaves no conforto de um pote.",
                    ],
                    [
                      "Kinder Bueno®",
                      "",
                      "Camadas do marcante Kinder Bueno® alternado com creme suave.",
                    ],
                    [
                      "Sonho de Valsa®",
                      "",
                      "A consistência cremosa e crocância do bombom de Sonho de Valsa® em um pavê especial e intenso.",
                    ],
                  ]),
                ],
                [
                  "Bolo de Pote",
                  "15,00",
                  "/img/bolo-de-pote.jpeg",
                  "Camadas alternas de massa de bolo umidecido com recheio caprichado servidos em um pote compacto e prático.",
                  Product.fabricOption([
                    [
                      "Brigadeiro",
                      "",
                      "Camadas de bolo de chocolate intercaladas com brigadeiro cremoso, um clássico irresistível!",
                    ],
                    [
                      "Brigadeiro com Cenoura",
                      "",
                      "Perfeita combinação de maciez com cobertura saborosa e generosa de brigadeiro!",
                    ],
                    [
                      "Brownie",
                      "",
                      "Combinação de camadas de creme suave com a granulosidade de pedaços dos nossos brownies especiais.",
                    ],
                    [
                      "Doce de Leite com Nozes",
                      "",
                      "A intensidade do doce de leite com pedaços crocantes de nozes suaves.",
                    ],
                    [
                      "Morango com Caramelo",
                      "",
                      "O equilíbrio entre o frescor e doçura do morango combinado com a intensidade do caramelo em um só bolo!",
                    ],
                    [
                      "Morango com Chocolate",
                      "",
                      "Um dos clássicos, o suave e levemente azedo sabor do morango se acentuam com a intensidade do brigadeiro.",
                    ],
                    [
                      "Prestígio®",
                      "",
                      "Para os amantes do tom tropical, o sabor leve e consistente do coco em combinação com consistência cremosa e massa suave.",
                    ],
                    [
                      "Red Velvet",
                      "",
                      "Uma conquista nos olhares e no paladar, combina uma massa de sabor suave, cuidadosamente recheada com um mousse especial de Cream Cheese e muito macia.",
                    ],
                  ]),
                ],
                [
                  "Bolo Caseiro",
                  "35,00 – 80,00",
                  "/img/bolo-red-velvet.jpg",
                  "Diversos sabores com um toque especial de doce caseiro. Autênticos e convidativos para todas as horas.",
                  Product.fabricOption([
                    [
                      "Banana",
                      "",
                      "Úmido e perfumado, perfeito para acompanhar um café da tarde! Feita com massa integral.",
                    ],
                    [
                      "Banana Fit",
                      "40,00",
                      "Versão com uso de Adoçantes e Farelo de Aveia. Ideal para sobremesas mais balanceadas!",
                    ],
                    [
                      "Café",
                      "",
                      "Intenso e aconchegante, ideal para acompanhar qualquer lanche.",
                    ],
                    [
                      "Cenoura",
                      "40,00",
                      "Clássico, macio e saboroso, com a sensação de receita de família!",
                    ],
                    [
                      "Cenoura Fit",
                      "",
                      "Versão substituindo o Açúcar por Adoçantes e Manteiga por Óleos vegetais.",
                    ],
                    [
                      "Chocolate",
                      "35,00",
                      "Rico, indulgente e sempre certeiro! Uma verdadeira tentação para qualquer hora.",
                    ],
                    [
                      "Chocolate Fit",
                      "45",
                      "Intenso sabor preservando o equilíbrio nutricional! Feito com Cacau em pó e substituindo a Manteiga por Óleos vegetais.",
                    ],
                    [
                      "Coco",
                      "40",
                      "Leve, fofo e com toques de fibra vegetal, é a dose perfeita de doçura tropical.",
                    ],
                    [
                      "Formigueiro",
                      "40",
                      "Equilibrando suavidade com toques de intensidade do chocolate meio-amargo, sempre uma boa opção!",
                    ],
                    [
                      "Laranja",
                      "40",
                      "Fresco e cítrico, uma fatia cheia de sabor e frescor com intensidade certeira.",
                    ],
                    [
                      "Limão",
                      "40",
                      "Ácido e doce na medida certa, um deleite provocante!",
                    ],
                    [
                      "Limão Fit",
                      "45",
                      "Versão utilizando Adoçantes no lugar de Açúcar, para refeições mais equilibradas.",
                    ],
                    [
                      "Maçã Fit",
                      "",
                      "Versão com Farelo de Aveia e substituindo Adoçantes no lugar de Açúcar",
                    ],
                    [
                      "Milho",
                      "40",
                      "Cremoso e reconfortante, um clássico com sabor de casa.",
                    ],
                    [
                      "Morango",
                      "",
                      "Suculento e doce, uma celebração de frescor e suavidade.",
                    ],
                    [
                      "Red Velvet",
                      "",
                      "Festivo, chamativo e saboroso, perfeito para momentos especiais!",
                    ],
                  ]),
                ],
                [
                  "Bolo de Festa",
                  "75,00 – 200,00",
                  "/img/bolo-de-festa.jpeg",
                  "Caprichados com estilo e muitos detalhes especiais, são perfeitos para celebrações!",
                  Product.fabricOption([
                    [
                      "Branco com Chantili e Morango",
                      "90,00",
                      "Suave e cremoso! Uma sobremesa elegante, refrescante e saborosa.",
                    ],
                    [
                      "Branco com Mousse de Chocolate Branco e Framboesa",
                      "100,00",
                      "Suave e cremoso com um leve toque de intensidade! Uma sobremesa elegante e conquistadora.",
                    ],
                    [
                      "Brigadeiro com Morango",
                      "80,00",
                      "Delicioso brigadeiro combinado com morangos frescos. Um equilíbrio perfeito de doçura e frescor. Sempre ideal!",
                    ],
                    [
                      "Brigadeiro Confeitado e Morango",
                      "90,00",
                      "Colorido, saboroso e refrescante. Perfeito para festas e celebrações!",
                    ],
                    [
                      "Brigadeiro Granulado",
                      "80,00",
                      "Brigadeiro tradicional com cobertura crocante de granulados de chocolate. Uma escolha clássica e deliciosa!",
                    ],
                    [
                      "Chocolate com Brigadeiro e Kit Kat®",
                      "100,00",
                      "Combinação irresistível de cremosidade e crocância. Satisfação garantida para os amantes do chocolate!",
                    ],
                    [
                      "Chocolate com Doce de Leite, Kit Kat® e Kinder Bueno®",
                      "120,00",
                      "Explosão de sabores acentuados combinando a dose certa de recheio cremoso e crocância!",
                    ],
                    [
                      "Chocolate com Mousse de Ninho®, Nutella® e Morango",
                      "95,00",
                      "Um festival de sabores em harmonia. Conquistador, equilibrado e muito cremoso!",
                    ],
                    [
                      "Mousse de Chocolate com Frutas Vermelhas",
                      "90,00",
                      "Para os que apreciam uma sobremesa com textura leve e um toque de chocolate na medida certa.",
                    ],
                    [
                      "Ouro Branco®",
                      "85,00",
                      "Uma mistura conquistadora de crocância com a harmonia perfeita entre os chocolates branco e ao leite",
                    ],
                    [
                      "Red Velvet com Mousse de Cream Cheese e Morango",
                      "75,00",
                      "Elegante, charmoso e sutil. Ideal para quem busca uma sobremesa com sabor equilibrado e marcante!",
                    ],
                  ]),
                ],
                [
                  "Taça Recheada",
                  "80,00 – 95,00",
                  "/img/taca-recheada.jpeg",
                  "Deliciosas taças grandes e cremosas, combinando mousses, cremes e frutas diversas!",
                  Product.fabricOption([
                    [
                      "Banoffee",
                      "85,00",
                      "Deliciosa combinação da doçura da banana e da intensidade do doce de leite em uma taça perfeita para qualquer sobremesa!",
                    ],
                    [
                      "Chocolate com Frutas Vermelhas",
                      "",
                      "Irresistível mousse de chocolate meio-amargo com generoso acréscimo de frutas vermelhas frescas.",
                    ],
                    [
                      "Chocolate com Morango",
                      "90,00",
                      "A cremosidade e intensidade dos mousses de chocolates branco e meio-amargo combinados com o frescor e leve acidez do morango com um toque final de brigadeiro em uma sobremesa conquistadora!",
                    ],
                    [
                      "Ninho® com Morango",
                      "95,00",
                      "Creme de Ninho® com morangos frescos. Para os amantes de um sabor suave, refrescante e levemente granuloso!",
                    ],
                    [
                      "Ninho® com Nutella® e Brownie",
                      "85,00",
                      "Creme de Ninho® com Nutella® e pedaços de Brownie. Equilibrando intensidade, granulosidade e suavidade na medida certa, é uma certeza de sucesso!",
                    ],
                  ]),
                ],
                [
                  "Torta Gelada",
                  "45,00 – 80,00",
                  "/img/torta-limao.jpeg",
                  "Perfeitas para refrescar o dia com recheios especialmente cremosos, equilibrando suavidade e consistência!",
                  Product.fabricOption([
                    [
                      "Chocolate com Maracujá",
                      "",
                      "Combinação provocante de chocolate e maracujá, enaltecendo a intensidade dos dois sabores!",
                    ],
                    [
                      "Limão",
                      "",
                      "Refrescante e cremosa, uma das favoritas, é a sobremesa perfeita para um paladar equilibrado prezando pelo cítrico.",
                    ],
                    [
                      "Maracujá",
                      "",
                      "O leve amargor com a intensa doçura do maracujá encontra a suavidade do creme nesse doce vibrante!",
                    ],
                    [
                      "Morango",
                      "",
                      "Combinação de sabor e frescor, ideal para finalizar qualquer refeição com leveza!",
                    ],
                  ]),
                ],
                [
                  "Travessa Recheada",
                  "80,00 – 90,00",
                  "/img/travessa-recheada.jpeg",
                  "Travessas generosas cobertas com generosos cremes, biscoitos, frutas e mousses diversos!",
                  Product.fabricOption([
                    [
                      "Banoffee",
                      "",
                      "Massa de farofinha de biscoito recheada com uma deliciosa combinação de camadas de bananas doces e intenso doce de leite em uma travessa finalizada com camada generosa de chantili. Perfeita para qualquer sobremesa!",
                    ],
                    [
                      "Ninho® trufado com Mousse de Nutella®",
                      "85,00",
                      "Delicioso creme de Ninho® trufado no chocolate branco, envolvido com camadas suculentas de mousse de Nutella®!",
                    ],
                    [
                      "Pavê de Morango com Ninho®",
                      "85,00",
                      "Mousse cremoso de Ninho® acompanhado de pedaços de morango frescos e finalizado com uma cobertura de chantili.",
                    ],
                    [
                      "Pavê de Sonho de Valsa®",
                      "90,00",
                      "Saboroso creme combinando chocolate branco e ao leite intercalado com camadas crocantes de Sonho de Valsa® em uma travessa finalizada com uma camada de chantili!",
                    ],
                    [
                      "Torta de Limão",
                      "",
                      "Deliciosas camadas de massa de biscoito coberto com um cremoso mousse de limão, finalizadas com generosa camada de chantili.",
                    ],
                  ]),
                ],
              ]
                .sort((a, b) => {
                  try {
                    if (typeof a[0] !== "string" || typeof b[0] !== "string")
                      throw new Error(`Error validating types`);
                    const textA = (a[0] as string)
                      .trim()
                      .replace(/^mini /i, "")
                      .trim();
                    const textB = (b[0] as string)
                      .trim()
                      .replace(/^mini /i, "")
                      .trim();
                    return textA.localeCompare(textB);
                  } catch (e) {
                    console.error(
                      `Error executing sorting: ${(e as Error).message}`
                    );
                    return 1;
                  }
                })
                .map(product => {
                  return product.map(element => {
                    if (typeof element === "string") {
                      const brandTest =
                        /kinder|kit kat|ninho|nutella|prestígio|sonho de valsa/gis;
                      const matches = element.match(brandTest);
                      if (
                        brandTest.test(element) &&
                        !/®/g.test(element) &&
                        matches &&
                        matches.length > 0
                      ) {
                        for (const match of matches) {
                          brandTest.lastIndex = 0;
                          const brandExec = brandTest.exec(element);
                          if (brandExec)
                            element = `${element.slice(
                              0,
                              brandExec.index + match.length
                            )}®${element.slice(
                              brandExec.index + match.length
                            )}`;
                        }
                      }
                    }
                    return element;
                  });
                })
                .map((product, i) => {
                  return new Product(
                    product[0] as string,
                    product[1] as string,
                    product[2] as string,
                    product[3] as string,
                    product[4] as ProductOption[],
                    `${(i + 1).toString().padStart(2, "0")}`
                  );
                })}
            />
          );
          rootsState
            .get(`${productRoot.id}`)
            .render(
              <ErrorBoundary
                FallbackComponent={() => (
                  <GenericErrorComponent
                    message={"Erro carregando menu!"}
                    altRoot={rootsState.get(`${productRoot.id}`)}
                    altJsx={ProductsProviderCall}
                  />
                )}
              >
                {ProductsProviderCall}
              </ErrorBoundary>
            );
          try {
            const rootTab = document.getElementById("rootTab");
            if (!(rootTab instanceof HTMLElement))
              throw htmlElementNotFound(rootTab, `validation of rootTab`, [
                "HTMLElement",
              ]);
            if (!rootsState.has(`${rootTab.id}`))
              throw new Error(`Error validating root for rootTab`);
            rootsState.get(`${rootTab.id}`).render(<TableOrders />);
          } catch (e) {
            console.error(
              `Error executing rendering for rootTab:\n${(e as Error).message}`
            );
          }
          try {
            const divBtns = document.getElementById("divBtns");
            if (!(divBtns instanceof HTMLElement))
              throw htmlElementNotFound(
                divBtns,
                `validation of divBtns root element`,
                ["HTMLElement"]
              );
            if (!rootsState.has(`${divBtns.id}`))
              throw new Error(`Error validating root for rootTab`);
            rootsState.get(`${divBtns.id}`).render(<CopyButtonsDiv />);
          } catch (e) {
            console.error(
              `Error executing rendering for divBtns:\n${(e as Error).message}`
            );
          }
        };
        renderTry().then(() => {
          setTimeout(() => {
            if (
              !document.getElementById("logoHeader") ||
              !document.getElementById("copyBtnWp") ||
              !document.getElementById("tbodyOrders") ||
              !document.querySelector(".caller") ||
              document.querySelector(".spinner")
            ) {
              const renderAttempt = setInterval(interv => {
                if (
                  document.getElementById("logoHeader") &&
                  document.getElementById("copyBtnWp") &&
                  document.getElementById("tbodyOrders") &&
                  document.querySelector(".caller") &&
                  !document.querySelector(".spinner")
                )
                  clearInterval(interv);
                renderTry();
              });
              setTimeout(() => {
                clearInterval(renderAttempt);
              }, 5000);
            }
          }, 1000);
        });
      } else {
        setTimeout(() => {
          !document.querySelector("li") &&
            console.warn(`!ROOT: mounted number not enough: ${mounted}.`);
        }, 5000);
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for mounted:\n${(e as Error).message}`
      );
    }
    setFinish(true);
  }, [mounted]);
  useEffect(() => {
    if (!finished) return;
    adjustIdentifiers();
  }, [finished]);
  useEffect(() => {
    const clearLocalRoots = (): void => {
      if (rootsState.has("productsRoot")) {
        rootsState.get("productsRoot").unmount();
        rootsState.delete("productRoot");
      }
      if (rootsState.has(`rootTab`)) {
        rootsState.get(`rootTab`).unmount();
        rootsState.delete("rootTab");
      }
      if (rootsState.has(`divBtns`)) {
        rootsState.get(`divBtns`).unmount();
        rootsState.delete("divBtns");
      }
      if (rootsState.has("divCallers")) {
        rootsState.get(`divCallers`).unmount();
        rootsState.delete("divCallers");
      }
    };
    setInterval(() => {
      if (
        !document.querySelector("dialog") ||
        (document.querySelector(".searchBarInp") instanceof HTMLInputElement &&
          (document.querySelector(".searchBarInp") as HTMLInputElement)
            .value === "" &&
          !/\?&/gi.test(location.href))
      )
        if (!/\?q=/g.test(location.href)) history.pushState({}, "", basePath);
        else {
          if (/\?&/.test(location.href))
            history.pushState(
              {},
              "",
              location.href.slice(0, location.href.indexOf("?&"))
            );
        }
    }, 2000);
    setTimeout(() => {
      if (!document.querySelector("dialog"))
        history.pushState({}, "", basePath);
    }, 3000);
    return clearLocalRoots();
  }, []);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message="Error loading page" />
      )}
    >
      <div id="mainRoot" className="mainRoot">
        <Spinner
          spinnerClass="spinner-grow"
          spinnerColor="text-light"
          message="Loading App..."
        />
      </div>
    </ErrorBoundary>
  );
}
