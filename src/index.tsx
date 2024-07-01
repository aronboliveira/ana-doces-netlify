import ProductsProvider from "./productsMain/ProductsProvider";
import { createRoot } from "react-dom/client";
import { Product, ProductOption } from "./declarations/classes";
import GenericErrorComponent from "./errors/GenericErrorComponent";
import { ErrorBoundary } from "react-error-boundary";
import { htmlElementNotFound } from "./handlersErrors";
import { TableOrders } from "./tableComponents/TableOrders";
import CopyButtonsDiv from "./buttons/CopyButtonsDiv";
import { looseNum, voidishRoot } from "./declarations/types";
import HomeFallback from "./routing/HomeFallback";
import AppProvider from "./routing/AppProvider";
import Header from "./interactives/Header";
import { watchLabels } from "./handlersCmn";
import "./gStyle.css";
import "./style.css";
import "./fonts.css";
import "./styleFix.css";

export const mainItems: { listMainItems: Array<looseNum[]> } = {
  listMainItems: [],
};
export const basePath = location.pathname;
let productsRooted: voidishRoot = undefined;
let mainRoot: voidishRoot = undefined;

(async () => {
  const mainEl = document.querySelector("main");
  try {
    if (!(mainEl instanceof HTMLElement))
      throw htmlElementNotFound(mainEl, `validation of <main>`, [
        "HTMLElement",
      ]);
    if (!mainRoot) mainRoot = createRoot(mainEl);
    mainRoot.render(<AppProvider />);
  } catch (e) {
    console.error(
      `Error executing attempt to create Main Root:\n${(e as Error).message}`
    );
  }
})()
  .then(() => {
    setTimeout((timeout) => {
      if (!document.querySelector(".caller")) {
        console.log(
          "!INIT: failed to load App with React context. Rendering default layout."
        );
        (async () => {
          const mainEl = document.querySelector("main");
          try {
            if (!(mainEl instanceof HTMLElement))
              throw htmlElementNotFound(mainEl, `validation of <main>`, [
                "HTMLElement",
              ]);
            if (!mainRoot) mainRoot = createRoot(mainEl);
            console.log("!INIT: rendering Home");
            mainRoot.render(<HomeFallback />);
          } catch (e) {
            console.error(
              `Error executing attempt to create Main Root:\n${
                (e as Error).message
              }`
            );
          }
        })().then(() => {
          const buildAttempt = setInterval((interv) => {
            if (
              document.getElementById("logoHeader") ||
              (!document.querySelector(".spinner") &&
                document.querySelector("td"))
            )
              clearInterval(interv);
            console.log("!INIT: Rendering Fallback Home");
            const productRoot = document.querySelector("#productsRoot");
            try {
              if (productRoot instanceof HTMLElement) {
                if (!productsRooted) productsRooted = createRoot(productRoot);
                if (productRoot.querySelector(".spinner")) {
                  const ProductsProviderCall = (
                    <ProductsProvider
                      root={productsRooted}
                      products={[
                        [
                          "Brownie Simples",
                          "8,00",
                          "../public/img/simples_brownie_generic.jpeg",
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
                          "10,00",
                          "../public/img/brownie_generic.jpeg",
                          `Massa cremosa e macia, feita com o mais puro chocolate nobre, com diversos sabores de recheios especiais disponíveis. Duas fatias de brownies unidas por uma camada saborosa de recheio.`,
                          Product.fabricOption([
                            [
                              "Brigadeiro",
                              "",
                              "Com brigadeiro irresistível, cremoso e repleto de chocolate, perfeito para qualquer ocasião!",
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
                          "../public/img/mini_brownie_generic.jpeg",
                          "Versão compactada do saboroso Brownie Recheado, com diversos sabores de recheios especiais disponíveis.",
                          Product.fabricOption([
                            [
                              "Brigadeiro",
                              "",
                              "Com brigadeiro irresistível, cremoso e repleto de chocolate, perfeito para qualquer ocasião!",
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
                          "Cookie Recheado",
                          "10,00 – 12,00",
                          "../public/img/cookie_generic.jpeg",
                          "Feito com Brown Butter, gotas de chocolate e uma camada generosa de recheio à sua escolha.",
                          Product.fabricOption([
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
                              "Ferrero Rocher",
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
                            [
                              "Red Velvet com Chocolate meio-amargo",
                              "",
                              "Massa de Red Velvet com toques de pingos de chocolate meio-amargo para sabor intenso e cremoso.",
                            ],
                          ]),
                        ],
                        [
                          "Mini Cookie — conjunto",
                          "15,00 – 25,00",
                          "../public/img/mini-cookie.jpeg",
                          "Conjunto de versões mini dos Cookie Recheados, incluindo uma caixa personalizada!",
                          Product.fabricOption([
                            [
                              "Baunilha com gotas de chocolate",
                              "",
                              "O aroma doce e convidativo da baunilha combinado com o acento marcante de gotas de chocolate meio-amargo em um doce inconfundível!",
                            ],
                            [
                              "Chocolatudo",
                              "",
                              "Dose dupla de chocolate preto meio-amargo, na massa e no recheio, para os amantes da intensidade!",
                            ],
                            [
                              "Red Velvet com gotas de chocolate branco",
                              "",
                              "O sabor marcante do Red Velvet em combinação com o acento de intensidade do chocolate meio-amargo, para um sabor equilibrado e doçura na medida.",
                            ],
                          ]),
                        ],
                        [
                          "Geleia Artesanal",
                          "20,00 – 25,00",
                          "../public/img/geleia-de-morango.jpeg",
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
                          "8,00",
                          "../public/img/palha-gourmet-2.jpeg",
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
                          "../public/img/copo-da-felicidade.jpg",
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
                          "15,00",
                          "../public/img/pave-no-pote.jpeg",
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
                          "../public/img/bolo-de-pote.jpeg",
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
                              "Uma conquista nos olhares e no paladar, combina uma massa de sabor suave, cuidadosamente recheada e muito macia.",
                            ],
                          ]),
                        ],
                        [
                          "Bolo Caseiro",
                          "45,00 – 66,00",
                          "../public/img/bolo-red-velvet.jpg",
                          "Diversos sabores com um toque especial de doce caseiro. Autênticos e convidativos para todas as horas.",
                          Product.fabricOption([
                            [
                              "Banana",
                              "",
                              "Úmido e perfumado, perfeito para acompanhar um café da tarde! Feita com massa integral.",
                            ],
                            [
                              "Banana Fit",
                              "",
                              "Versão com uso de Adoçantes e Farelo de Aveia. Ideal para sobremesas mais balanceadas!",
                            ],
                            [
                              "Café",
                              "",
                              "Intenso e aconchegante, ideal para acompanhar qualquer lanche.",
                            ],
                            [
                              "Cenoura",
                              "",
                              "Clássico, macio e saboroso, com a sensação de receita de família!",
                            ],
                            [
                              "Cenoura Fit",
                              "",
                              "Versão substituindo o Açúcar por Adoçantes e Manteiga por Óleos vegetais.",
                            ],
                            [
                              "Chocolate",
                              "",
                              "Rico, indulgente e sempre certeiro! Uma verdadeira tentação para qualquer hora.",
                            ],
                            [
                              "Chocolate Fit",
                              "",
                              "Intenso sabor preservando o equilíbrio nutricional! Feito com Cacau em pó e substituindo a Manteiga por Óleos vegetais.",
                            ],
                            [
                              "Coco",
                              "",
                              "Leve, fofo e com toques de fibra vegetal, é a dose perfeita de doçura tropical.",
                            ],
                            [
                              "Formigueiro",
                              "",
                              "Equilibrando suavidade com toques de intensidade do chocolate meio-amargo, sempre uma boa opção!",
                            ],
                            [
                              "Laranja",
                              "",
                              "Fresco e cítrico, uma fatia cheia de sabor e frescor com intensidade certeira.",
                            ],
                            [
                              "Limão",
                              "",
                              "Ácido e doce na medida certa, um deleite provocante!",
                            ],
                            [
                              "Limão Fit",
                              "",
                              "Versão utilizando Adoçantes no lugar de Açúcar, para refeições mais equilibradas.",
                            ],
                            [
                              "Maçã Fit",
                              "",
                              "Versão com Farelo de Aveia e substituindo Adoçantes no lugar de Açúcar",
                            ],
                            [
                              "Milho",
                              "",
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
                          "../public/img/bolo-de-festa.jpeg",
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
                          "Torta Gelada",
                          "45,00 – 80,00",
                          "../public/img/torta-limao.jpeg",
                          "Perfeitas para refrescar o dia com recheios especialmente cremosos e uma bola equilibrando suavidade e consistência",
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
                      ].map((product, i) => {
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
                  productsRooted.render(
                    <ErrorBoundary
                      FallbackComponent={() => (
                        <GenericErrorComponent
                          message={"Erro carregando menu!"}
                          altRoot={productsRooted}
                          altJsx={ProductsProviderCall}
                        />
                      )}
                    >
                      {ProductsProviderCall}
                    </ErrorBoundary>
                  );
                } else clearInterval(interv);
              } else
                throw htmlElementNotFound(
                  productRoot,
                  `validating productRoot`,
                  ["HTMLElement"]
                );
            } catch (err) {
              productRoot instanceof Element && console.dir(productRoot);
              createRoot(
                document.querySelector("div") ??
                  document.querySelector("main") ??
                  document.body
              ).render(
                <GenericErrorComponent
                  message={"Erro carregando página!"}
                  altRoot={document.body}
                  altJsx={undefined}
                />
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
              createRoot(rootTab).render(<TableOrders />);
            } catch (e) {
              console.error(
                `Error fetching root for Table of orders: ${
                  (e as Error).message
                }`
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
              createRoot(divBtns).render(<CopyButtonsDiv />);
            } catch (e) {
              console.error(
                `Error rendering CopyButtonsDiv:\n${(e as Error).message}`
              );
            }
          }, 100);
          setTimeout(() => {
            clearInterval(buildAttempt);
          }, 10000);
        });
      } else clearTimeout(timeout);
    }, 5000);
  })
  .then(() => {
    const footerNoteAttempt = () => {
      try {
        if (!document.querySelector("menu")?.querySelector("li"))
          throw new Error(`No List items found for main menu`);
        const noteSpan = Object.assign(document.createElement("span"), {
          id: `imagesNote`,
          innerText: `*imagens meramente ilustrativas`,
        });
        noteSpan.classList.add(`tip`);
        noteSpan.style.marginBottom = `3vh`;
        const targHr = Array.from(
          document.getElementById("sectCardapio")?.querySelectorAll("hr") ?? []
        ).at(-1);
        if (!(targHr instanceof HTMLHRElement)) {
          console.warn(`Error on validation of Target HR`);
          document.getElementById("productsRoot")?.append(noteSpan);
          setTimeout(() => {
            try {
              const lastHr = Array.from(
                document
                  .getElementById("sectCardapio")
                  ?.querySelectorAll("hr") ?? []
              ).at(-1);
              if (!lastHr) {
                console.warn(`Failed to replace image notes`);
                return;
              }
              if (
                !(lastHr.nextElementSibling?.id === "imagesNote") &&
                lastHr.previousElementSibling?.id === "imagesNote"
              ) {
                const replaceNote = lastHr.previousElementSibling!.cloneNode();
                lastHr.remove();
                replaceNote instanceof Element &&
                  lastHr.insertAdjacentElement("afterend", replaceNote);
              }
            } catch (e) {
              console.error(`Error:${(e as Error).message}`);
            }
          }, 1000);
        } else {
          targHr.style.marginBottom = `calc(3vh + 0.35rem)`;
          targHr.insertAdjacentElement("afterend", noteSpan);
          if (noteSpan.previousElementSibling instanceof HTMLHRElement)
            noteSpan.style.marginLeft = `6%`;
        }
      } catch (e) {
        setTimeout(() => {
          !document.getElementById("imagesNote") &&
            console.error(
              `Error executing footerNoteAttempt:\n${(e as Error).message}`
            );
        }, 5000);
      }
    };
    footerNoteAttempt();
    setTimeout(() => {
      !document.getElementById("imagesNote") && footerNoteAttempt();
    }, 1000);
  })
  .catch((err) => console.warn(err));

try {
  const header = document.querySelector("header");
  if (!(header instanceof HTMLElement))
    throw htmlElementNotFound(header, `validation of <header>`);
  createRoot(header).render(<Header />);
} catch (e) {
  console.error(
    `Error rendering elements for Header:\n${(e as Error).message}`
  );
}
setTimeout(() => {
  document.getElementById("logoHeader") &&
    document.querySelector(".divProduct") &&
    document.getElementById("divBtns")?.querySelector("button") &&
    document.querySelector(".outp_orderTitle") &&
    console.log(`finished`);
}, 10000);
watchLabels();
