export function isBrandOverrideToken(token) {
  const p = token.path ?? [];
  const pathStr = p.join(".");
  const top = String(p[0] ?? "").toLowerCase();

  const isColorish =
    token.type === "color" ||
    top === "colour" ||
    top === "color" ||
    top === "surface" ||
    top === "text" ||
    top === "border" ||
    top === "icon colour" ||
    top === "icon";

  const isFontish =
    pathStr.startsWith("Font.Brand.") ||
    pathStr.includes(".Font family.") ||
    pathStr.includes(".FontFamily.") ||
    pathStr.includes(".Font-family.") ||
    pathStr.includes(".Font weight.") ||
    pathStr.includes(".FontWeight.") ||
    pathStr.includes(".Font-weight.");

  return isColorish || isFontish;
}

export function isNotBrandFontToken(token) {
  const pathStr = (token.path ?? []).join(".");
  return !pathStr.startsWith("Font.Brand.");
}

export function makeBrandOverrideFilter(brand) {
  return (token) => {
    const p = (token.path ?? []).join(".");

    // Only keep Font.Brand.<brand>.* (drop other brands)
    if (p.startsWith("Font.Brand.")) {
      return p.startsWith(`Font.Brand.${brand}.`);
    }

    // Otherwise keep whatever your existing brand override logic keeps
    return isBrandOverrideToken(token);
  };
}
