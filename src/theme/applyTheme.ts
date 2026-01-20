export type ThemeName = "brandA" | "brandB";

const BASE_CSS = "/build/web/base/tokens.runtime.css";
const THEME_CSS: Record<ThemeName, string> = {
  brandA: "/build/web/BrandA/tokens.runtime.css",
  brandB: "/build/web/BrandB/tokens.runtime.css",
};

function ensureLink(attr: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[${attr}="true"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute(attr, "true");
  }

  const abs = new URL(href, document.baseURI).href;
  if (link.href !== abs) link.href = abs;

  // keep it last so it wins
  document.head.appendChild(link);
}

export function applyTheme(theme: ThemeName) {
  // always load base runtime vars
  ensureLink("data-base-rt", BASE_CSS);
  // swap brand vars
  ensureLink("data-theme-rt", THEME_CSS[theme]);

  document.documentElement.setAttribute("data-theme", theme);
  document.body?.setAttribute("data-theme", theme);
}
