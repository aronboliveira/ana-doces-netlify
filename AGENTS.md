# Agent Reference — Ana Doces Digital Menu

> Canonical design spec: [`design-spec.xml`](./design-spec.xml)
> Handoff (2026-08-16): [`.tmp/claude/handoff-20260816.md`](./.tmp/claude/handoff-20260816.md)
> Mechanics (YAML): [`.tmp/claude/mechanics.yaml`](./.tmp/claude/mechanics.yaml)
> Previous session: [`.tmp/claude/menu-refactor-agent/20260815/context.txt`](./.tmp/claude/menu-refactor-agent/20260815/context.txt)

## Quick Facts

| Field | Value |
|---|---|
| Project | Ana Doces — Interactive Digital Menu |
| Stack | React 19, TypeScript 5.9, Vite 8, react-router-dom 7 |
| Test | Jest 30, @testing-library/react 16, @testing-library/user-event 14 |
| Lint | ESLint 9 (flat config), typescript-eslint 8 |
| Deploy | Netlify (`dist/` output) |
| License | GNU/GPL v3 |
| Author | Aron Barbosa de Oliveira |

## Commands

```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # tsc --noEmit && vite build
npm test         # Jest (no watch by default)
npm run lint     # ESLint flat config
```

## Architecture

Single-page React app — no backend, no monorepo, no layers.

### Folder Structure

```
src/
├── routing/          # AppProvider (router) → AnaDocesApp → Home
├── productsMain/     # ProductsProvider + ProductGrid (Compound Pattern)
├── productOptions/   # ProductOptionsDlg (general-purpose options modal)
├── modals/           # InfosModal, MaintenanceModal
├── interactives/     # Header, SearchBar, MaintenanceBar
├── callers/          # DirectCaller (WhatsApp link logic)
├── declarations/     # types.d.ts, interfaces.d.ts, classes.tsx
├── hooks/            # useMaintenanceMode (custom hooks)
├── handlersCmn.tsx   # Shared handlers (~3k lines, caution: automock-unfriendly)
├── styles/
│   ├── abstracts/    # _variables, _mixins, _functions, _placeholders
│   ├── style.scss    # App-specific theme
│   ├── gStyle.scss   # Global utilities
│   ├── fonts.scss    # Font utilities
│   └── styleFix.scss # Responsive fixes
├── tests/            # Jest specs, mirrors src/ structure
└── index.tsx         # Entry point, global SCSS imports
```

### Key Patterns

#### Compound Pattern (`ProductGrid` + `ProductOptionsDlg`)

`ProductGrid` (`src/productsMain/ProductGrid.tsx`) renders exactly one `<li ref={refLi}>`
per product, and — only while its local `shouldShowOptions` state is true — a lazy-loaded
`ProductOptionsDlg` **as a JSX sibling of that `<li>`**, inside the same `<ErrorBoundary>`,
never nested inside it:

```jsx
<ErrorBoundary ...>
  <li ref={refLi} id={productId} onClick={...} onKeyDown={...}>...</li>
  {shouldShowOptions && (
    <Suspense fallback={null}>
      <ProductOptionsDlg ... />
    </Suspense>
  )}
</ErrorBoundary>
```

This sibling placement is **load-bearing**, not stylistic: `ProductOptionGrid`
(`src/productOptions/ProductOptionGrid.tsx:55`) — rendered inside `ProductOptionsDlg`'s
dialog — has to relate each option row back to its *product*, and it does so purely by
DOM adjacency, not by prop-drilling an id:

```ts
let productLi = mainRef.current.closest("dialog")?.previousElementSibling;
if (!(productLi instanceof HTMLLIElement))
  productLi = document.querySelector(`[id*="${...}"]`); // id-substring fallback
```

If `ProductOptionsDlg` were ever rendered *inside* the `<li>` instead of next to it,
`closest("dialog")?.previousElementSibling` would resolve to the wrong element (or
`null`), silently breaking option-price/name derivation that reads the product's price
and name off `productLi`. The id-substring `querySelector` fallback exists for exactly
this fragility — but it's a fallback, not a replacement; keep the sibling structure.

#### Query-param modal dispatch

`ProductsProvider` (`src/productsMain/ProductsProvider.tsx`) never renders modal content
from the URL directly. Instead, once the menu has mounted, it finds the real `<li>` that
matches the URL and **calls `.click()` on it**, reusing `ProductGrid`'s own `onClick`
handler (and therefore the Compound Pattern above) instead of duplicating render logic
for a "deep-linked" product:

- URL format: `?&<slug>` selects a product (e.g. `?&brownie-simples__01`); an optional
  `&Op-<suboption>` suffix is carved out of the match window so sub-option deep links
  don't get swallowed into the product-slug regex.
- The `<li>` id (`div-<name>__<id>`) is normalized (strip `div-`/`®`/`-—-conjunto`,
  lowercase) and compared against the URL slice via `RegExp.test`.
- When a match is found: `matchedItem.scrollIntoView()`, then `matchedItem.click()` —
  this is the *only* code path that opens a query-param-driven modal; there's no
  separate "render this product's dialog because the URL says so" branch anywhere else.
- No match (and the URL isn't just `/`): logs a warning and resets the URL to `basePath`
  via `history.pushState`, so a stale/invalid slug doesn't leave the page stuck on a dead
  link.

#### Mount detection

Because `renderProducts` is async-ish from the DOM's perspective (React renders, then the
browser paints, then refs settle), `ProductsProvider`'s query-param dispatch effect can't
just run on mount — the `<menu>`'s `<li>`s may not exist yet. It uses two guards:

1. `mainItems.listMainItems` (from `src/index.tsx`) is populated by querying
   `document.querySelector("menu")` and mapping every `<li>` to a normalized id — this is
   also the id→index map `SearchBar` and other consumers rely on, so it doubles as the
   "menu is populated" signal.
2. A flat `setTimeout(..., 1000)` settle delay before attempting the click-dispatch match,
   giving the product list time to finish mounting after the initial render pass.

This is intentionally an informal, timing-based mechanism (not a `MutationObserver` or a
ref-count), so if deep-linking flakes intermittently, check this timeout first before
assuming the matching regex logic is at fault.

#### Modals

`<dialog>` element, `showModal()`, Escape-key handling, `adjustIdentifiers`/`syncAriaStates`
from `handlersCmn`.

## CSS Migration Plan

**Status: COMPLETE — SCSS files + 8 BEM CSS Modules in place.**

### SCSS Structure

```
src/styles/
├── abstracts/
│   ├── _variables.scss    # Color palette, typography, spacing, breakpoints
│   ├── _mixins.scss       # Flex, grid, scrollbar, accordion, modal, responsive
│   ├── _functions.scss    # Color manipulation, spacing generators
│   └── _placeholders.scss # Reusable selectors for toggle/isolate patterns
├── style.scss             # App-specific theme (replaces style.css)
├── gStyle.scss            # Global utilities (replaces gStyle.css)
├── fonts.scss             # Font utilities (replaces fonts.css)
└── styleFix.scss          # Responsive fixes (replaces styleFix.css)
```

### CSS Modules (component-scoped)

For components that are mounted/unmounted frequently:

| Component | Module File |
|---|---|
| `Header.tsx` | `Header.module.scss` |
| `ProductOptionsDlg.tsx` | `ProductOptionsDlg.module.scss` |
| `InfosModal.tsx` | `InfosModal.module.scss` |
| `SearchBar.tsx` | `SearchBar.module.scss` |
| `ProductGrid.tsx` | `ProductGrid.module.scss` |
| `ProductOptionGrid.tsx` | `ProductOptionGrid.module.scss` |
| `OrderRow.tsx` | `OrderRow.module.scss` |
| `SuboptionsCont.tsx` | `SuboptionsCont.module.scss` |

### Breakpoint Tokens

Consolidated from all CSS files — use these in `_variables.scss`:

| Token | Value | Usage |
|---|---|---|
| `$bp-mobile-sm` | `460px` | Small mobile |
| `$bp-mobile` | `600px` | Mobile |
| `$bp-tablet` | `750px` | Tablet |
| `$bp-desktop-sm` | `900px` | Small desktop |
| `$bp-desktop` | `1020px` | Desktop |
| `$bp-desktop-lg` | `1250px` | Large desktop |
| `$bp-wide` | `1420px` | Wide screens |

### Pointer Query

```scss
@mixin coarse-pointer {
  @media (pointer: coarse) {
    @content;
  }
}
```

Use for touch-target sizing adjustments for elderly users on mobile.

## Accessibility

- **Audience**: Large elderly user base — generous tap areas, large fonts, high contrast.
- **Font minimum**: 1rem (16px) body text.
- **Touch target**: Minimum 44x44px.
- **Focus**: Always-visible gold focus ring (`2px outline`).
- **Contrast**: WCAG AA 4.5:1 on dark backgrounds (cream `#e8d5b5` on chocolate `#1a0e0a` = ~12:1).
- **Reduced motion**: Respect `prefers-reduced-motion`.
- **ARIA patterns**: accordion (`aria-expanded`, `aria-controls`), modal (`role=dialog`, `aria-modal=true`), nav landmarks.

## SEO

- Lighthouse target: **90+**
- JSON-LD: `Bakery` schema in `index.html`
- Meta: title, description, OG tags, twitter card, canonical URL, `robots: index, follow`, `theme-color: #1a0e0a`
- Semantic HTML: `header[role=banner]`, `main[role=main]`

## Current Work

- **CSS → SCSS migration**: COMPLETE — global files + 8 BEM CSS Modules.
- **React 19 optimizations**: COMPLETE — useDeferredValue, memo, React.lazy.
- **Accessibility audit**: COMPLETE — critical + important fixes applied.
- **SEO**: COMPLETE — meta tags, JSON-LD, semantic HTML.
- **Task B (Maintenance)**: COMPLETE — useMaintenanceMode hook, MaintenanceModal, MaintenanceBar.
- **Test suites**: ALL 40 suites passing (232/232 tests) after Claude agent's fixes.
- **CI/CD**: GitHub Actions workflow + push rule added. Ready for pipeline test.

## CI/CD

- **GitHub Actions**: `.github/workflows/ci.yml` — runs lint, test, build on push to `main` and PRs. Node 22.
- **Netlify**: Auto-deploys on push to `main` via Netlify's own integration (`netlify.toml` configured).
- **Pipeline gates**: All three jobs (lint, test, build) must pass before merge.

## Rules

- **NEVER push unless the user explicitly tells you to.** This is a hard rule. Commit locally all you want, but do not run `git push` without explicit user instruction.
- After a push, monitor GitHub Actions (`gh run watch`) and Netlify deploy until both are green. Iterate corrections on any failures.

## Conventions

- **TDD**: Testing Trophy — mostly integration tests over heavy-mock unit tests.
- **DRY/YAGNI**: Apply without hurting clarity.
- **Commits**: Granular, one logical change per commit. Never commit broken/unverified state.
- **Scratch areas**: `.tmp/` and `utils/.llms/` are gitignored — local dev artifacts only.
- **No secrets**: Never print or commit secrets. None exist in this repo currently.
- **ESLint**: Flat config at `eslint.config.js`. Rules: `no-restricted-globals: off`, `react-hooks/exhaustive-deps: off`, `react/react-in-jsx-scope: off`, `react/prop-types: off`.

## Gotchas

- `handlersCmn.tsx` is ~3k lines — bare `jest.mock()` on it can behave unexpectedly (automock chokes on many `Map`-typed/generic exports). Prefer manual partial mocks.
- `interfaces.d.ts` and `types.d.ts` are `.d.ts` files — Jest 30 resolver needs `moduleNameMapper` for them (configured in `jest.config.cjs`).
- React 19 removed global `JSX` namespace — restored via `src/jsx.d.ts`.
- `textEncoder`/`TextDecoder` polyfill needed in Jest setup for `react-router-dom` v7 in jsdom (configured in `jest.config.cjs`).
