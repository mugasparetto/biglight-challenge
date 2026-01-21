# Biglight Challenge Introduction

## Deployed Storybook

[Access the deployed Storybook](https://biglight-challenge.vercel.app/)

## Setup and installation instructions

### Clone the project

```bash
$ git clone https://github.com/mugasparetto/biglight-challenge && cd biglight-challenge
```

### Run these commands

```bash
# Install the dependencies
$ npm install

# Run the web client
$ npm run dev
```

### Run Storybook locally

```bash
$ npm run storybook
```

## Theme switching

### Application

As the application itself was not a priority for this challenge, I kept the theme hard-coded in `src/app.tsx` inside an `useEffect` hook:

```
  useEffect(() => {
    applyTheme("brandA");
  }, []);
```

The `applyTheme` function lives in `src/theme/applyTheme.ts`.

### Storybook

The storybook has a decorator that changes between the Brand A and Brand B themes.

## Approximate time spent

I spent approximately 12 hours on this challenge.

## AI usage note

I initially considered a script to orchestrate the pipeline from JSON to CSS variables, but wanted to compare my idea with three different LLMs: ChatGPT, Claude, and Gemini. The three of them shared the same process I had in mind, which made me feel more confident about the next steps.

The build script itself was the piece of code I relied on AI the most. It needed to be highly customisable to successfully translate the JSON properties into valid CSS variables and classes, given the `figma-tokens.json` file structure. All those transformations and adaptations should be forwarded to the style-dictionary library, which was not trivial and the most time-consuming and effort-consuming task of the challenge.

For the components and their stories, I only asked for an initial boilerplate and wrote the rest myself. AI primarily helped me use ARIA attributes and accessibility features effectively.

Finally, some AI was used to write this document, primarily the token pipeline approach outlined below.

---

# Design → CSS → Components Approach

## Design Tokens, Theme Switching, and Build Pipeline

This document explains how the design system flows from **Figma → JSON → CSS → working UI components**, and the architectural decisions behind it.

---

## 1. How did I get from Figma / JSON to working components?

### High-level flow

```
Figma
  ↓ (Tokens export)
figma-tokens.json
  ↓ (Style Dictionary build)
CSS variables (runtime + Tailwind theme map)
  ↓
Tailwind + Components (Vite / Storybook)
```

### Step-by-step

1. **Design tokens are authored in Figma**
   - Colours, typography, spacing, radii, etc.
   - Tokens are organised into semantic groups (Surface, Text, Border, Font, Responsive, Brand).
   - Tokens are exported as a structured JSON file (`figma-tokens.json`).

2. **Style Dictionary processes the JSON**
   - A custom build script (`build.js`) orchestrates the pipeline.
   - Multiple _synthetic token sources_ are generated at build time:
     - Base (primitives + responsive)
     - Brand overrides
     - Tailwind theme-map superset

3. **Tokens are transformed into CSS variables**
   - Naming rules normalize inconsistent Figma paths.
   - Values are normalized (px units, font-weight numbers, quoted font families).
   - Output is browser-valid CSS, not JS.

4. **CSS variables are consumed in two ways**
   - **Runtime CSS** (`tokens.runtime.css`)
     Used directly by the browser and components.
   - **Tailwind theme-map** (`@theme { --token: var(--rt-token) }`)
     Allows Tailwind utilities to reference runtime CSS variables.

5. **Components never import tokens directly**
   - Components rely on Tailwind classes or CSS variables.
   - This keeps components design-system-agnostic.

---

## 2. Token management: structure and consumption

### Token structure (conceptual)

- **Primitives/Default**
  Raw values (colors, spacing, base typography)

- **Responsive/**
  - `Mobile`
  - `Desktop`

- **Font**
  - Shared font roles
  - Brand-specific font families and weights

- **Mapped/<Brand>**
  Brand semantic mappings (e.g., `primary`, `accent`)

- **Alias colours/<Brand>**
  Brand color aliases

### Key principles

- **Semantic over raw values**
  Components use `--color-text-primary`, not `#000000`.

- **Single source of truth**
  Figma JSON is the only editable source.
  Generated CSS is never manually edited.

- **Runtime-first**
  All tokens exist as CSS variables at runtime.
  Tailwind only _references_ them.

---

## 3. Theme switching: handling multiple brands

### Runtime approach (CSS + small JS helper)

Theme switching uses CSS variables and a runtime loader to load the correct CSS for each brand. This does not use Tailwind configuration or logic in individual components. Instead, the runtime loader handles which theme is active and loads the necessary styles accordingly.

- Each brand generates its own `tokens.runtime.css`
- Theme switching is handled by CSS selectors:

```css
:root {
  /* BrandA defaults */
}

html[data-theme="brandB"] {
  /* BrandB overrides */
}
```

### The theme switcher (`applyTheme.ts`)

A small TypeScript utility is responsible for loading and swapping the correct CSS at runtime:

```ts
export type ThemeName = "brandA" | "brandB";

const BASE_CSS = "/build/web/base/tokens.runtime.css";
const THEME_CSS: Record<ThemeName, string> = {
  brandA: "/build/web/BrandA/tokens.runtime.css",
  brandB: "/build/web/BrandB/tokens.runtime.css",
};

export function applyTheme(theme: ThemeName) {
  // always load base runtime vars
  ensureLink("data-base-rt", BASE_CSS);

  // swap brand vars
  ensureLink("data-theme-rt", THEME_CSS[theme]);

  document.documentElement.setAttribute("data-theme", theme);
  document.body?.setAttribute("data-theme", theme);
}
```

Key characteristics:

- **CSS is loaded via `<link>` tags**, not bundled JS
- The base token file is always present
- Brand-specific tokens are swapped independently - loading only one CSS file per brand
- The active theme is reflected via `data-theme` attributes

### Relationship with Tailwind

Tailwind does **not** own the theme state.

Instead:

- Tailwind utilities reference CSS variables generated in the `@theme` map
- Runtime CSS variables (`--rt-*`) provide the actual values
- Switching themes updates variable values, not Tailwind classes

This decouples:

- **Design tokens** (CSS variables)
- **Utility generation** (Tailwind)
- **Theme state** (runtime loader)

### Scaling to more brands

Adding a new brand requires:

1. New brand tokens in Figma
2. One additional runtime CSS output
3. One new entry in the `THEME_CSS` map

No component changes are required.

---

**In summary:**
Theme switching is handled through **runtime CSS loading**, not component logic or Tailwind configuration, enabling clean separation of concerns and predictable, scalable multi-brand theming.

## 4. What happens when tokens change?

### Example: Designer updates the primary colour in Figma

1. Designer updates the token in Figma
2. Tokens are re-exported to `figma-tokens.json`
3. Developer runs:

   ```bash
   npm run dev
   # or
   npm run build
   ```

4. `build.js` runs automatically:
   - Regenerates runtime CSS
   - Regenerates Tailwind theme-map

5. Vite / Storybook reloads
6. Components update automatically

### No manual steps required

- No component changes
- No Tailwind config changes
- No search/replace in code

---

## 5. What would be done differently in production?

With more time or in a larger-scale environment:

### Tooling improvements

- Add CI checks to ensure:
  - Token builds succeed
  - No breaking token removals

### Architecture improvements

- Publish tokens as a **versioned package**
- Split outputs per platform (web, native, email)
- Introduce **token deprecation strategy**

---

## 6. Trade-offs and limitations

- **Style Dictionary config complexity**
  - Powerful but verbose
  - Requires discipline to maintain

- **No token validation layer**
  - Invalid or inconsistent Figma exports could break builds

- **Design governance**
  - This assumes designers respect semantic intent
  - No enforcement at the Figma level yet

### Conscious trade-offs

- Chose **CSS variables over JS theming**
  - Less flexibility
  - Much better performance and simplicity

- Chose **build-time generation**
  - No runtime token mutation
  - Predictable output

---

## Summary

This system prioritizes:

- ✅ Single source of truth (Figma → JSON)
- ✅ CSS-first theming
- ✅ Clear separation between design tokens and components
- ✅ Scalable multi-brand support

---

Made with 💜 &nbsp;by Murilo Gasparetto 👋 &nbsp;[Get in touch](https://www.linkedin.com/in/mugasparetto/)
