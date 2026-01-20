import path from "node:path";

export const CWD = process.cwd();

export const INPUT_FILE = path.join(CWD, "tokens", "figma-tokens.json");

// Runtime outputs (browser-consumed)
export const OUT_BASE_ABS = path.join(CWD, "build", "web", "base");
export const OUT_BASE_REL = "build/web/base/";

export const OUT_BRAND_ABS = (brand) => path.join(CWD, "build", "web", brand);
export const OUT_BRAND_REL = (brand) => `build/web/${brand}/`;

// Tailwind theme-map output (Tailwind-consumed)
export const OUT_THEME_MAP_ABS = path.join(
  CWD,
  "src",
  "styles",
  "generated",
  "tailwind-theme-map.css",
);

export const BRANDS = [
  { name: "BrandA", selector: ":root" },
  { name: "BrandB", selector: 'html[data-theme="brandB"]' },
];
