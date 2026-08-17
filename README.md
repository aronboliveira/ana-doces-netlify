# Ana Doces — Cardápio Digital Interativo

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)

**Live:** [anadocesapp.netlify.app](https://anadocesapp.netlify.app/)

---

## Sobre

Cardápio digital interativo da **Ana Doces: Confeitaria Criativa**, localizada na Ilha do Governador, Rio de Janeiro.

O aplicativo permite navegar pelo cardápio completo, visualizar detalhes e preços de cada produto, e fazer pedidos diretamente pelo WhatsApp.

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Routing | react-router-dom 7 |
| Testes | Jest 30 + Testing Library |
| Lint | ESLint 9 (flat config) |
| Deploy | Netlify |
| Estilo | SCSS (em migração) |

---

## Estrutura do Projeto

```
src/
├── routing/          # Shell da aplicação e rotas
├── productsMain/     # Grade de produtos (Compound Pattern)
├── productOptions/   # Modal de opções do produto
├── modals/           # Modais reutilizáveis
├── interactives/     # Header, SearchBar, barra de manutenção
├── callers/          # Lógica de links WhatsApp
├── declarations/     # Tipos, interfaces, classes
├── styles/           # SCSS (tema, utilitários, abstracts)
└── tests/            # Testes Jest
```

---

## Acessibilidade

- Fontes grandes e legíveis (mínimo 16px)
- Áreas de toque generosas (mínimo 44×44px)
- Alto contraste: texto creme `#e8d5b5` sobre fundo chocolate `#1a0e0a` (~12:1)
- Animações respeitam `prefers-reduced-motion`
- Foco visível sempre visível (anel dourado)
- Padrões ARIA: accordion, modal, landmarks de navegação

---

## SEO

- Meta tags completas (título, descrição, Open Graph, Twitter Card)
- JSON-LD: schema `Bakery` para dados estruturados
- HTML semântico: `header`, `main`, `nav`
- Lighthouse target: **90+**

---

## Desenvolvimento

```bash
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento (localhost:5173)
npm run build        # Type-check + build de produção
npm test             # Executar testes Jest
npm run lint         # Verificar lint
```

---

## Licença

Copyright © [Aron Barbosa de Oliveira](https://github.com/aronboliveira)
Licenciado sob a licença **GNU/GPL v3**.
