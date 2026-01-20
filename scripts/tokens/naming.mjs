export function toKebab(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[%]/g, "pct")
    .replace(/[&]/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^\w\s.-]/g, "")
    .replace(/[.\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tokenToCssVar(tokenPath, tokenType) {
  const p = String(tokenPath);
  const pathNorm = p.replace(/\.Colour\./g, ".Color.");

  // COLORS
  if (tokenType === "color") {
    if (pathNorm.startsWith("Surface.Color."))
      return `color-surface-${toKebab(pathNorm.replace("Surface.Color.", ""))}`;

    if (pathNorm.startsWith("Text.Color."))
      return `color-text-${toKebab(pathNorm.replace("Text.Color.", ""))}`;

    if (pathNorm.startsWith("Border.Color."))
      return `color-border-${toKebab(pathNorm.replace("Border.Color.", ""))}`;

    if (
      pathNorm.startsWith("Icon.Color.") ||
      pathNorm.startsWith("Icon colour.") ||
      pathNorm.startsWith("Icon.Colour.")
    ) {
      return `color-icon-color-${toKebab(
        pathNorm
          .replace(/^Icon\.Color\./, "")
          .replace(/^Icon colour\./, "")
          .replace(/^Icon\.Colour\./, ""),
      )}`;
    }

    return `color-${toKebab(pathNorm)}`;
  }

  // FONT FAMILY (many spellings)
  if (
    tokenType === "text" &&
    (pathNorm.startsWith("Typography.FontFamily.") ||
      pathNorm.startsWith("Typography.Font-family.") ||
      pathNorm.startsWith("Typography.Font family.") ||
      pathNorm.startsWith("Font.FontFamily.") ||
      pathNorm.startsWith("Font.Font-family.") ||
      pathNorm.startsWith("Font.Font family.") ||
      pathNorm.startsWith("FontFamily.") ||
      pathNorm.startsWith("Font-family.") ||
      pathNorm.startsWith("Font family."))
  ) {
    const key = pathNorm
      .replace(/^Typography\.FontFamily\./, "")
      .replace(/^Typography\.Font-family\./, "")
      .replace(/^Typography\.Font family\./, "")
      .replace(/^Font\.FontFamily\./, "")
      .replace(/^Font\.Font-family\./, "")
      .replace(/^Font\.Font family\./, "")
      .replace(/^FontFamily\./, "")
      .replace(/^Font-family\./, "")
      .replace(/^Font family\./, "");
    return `font-family-${toKebab(key)}`;
  }

  // BRAND FONT FAMILY (normalize)
  if (
    tokenType === "text" &&
    /^Font\.Brand\.[^.]+\.Font family\./.test(pathNorm)
  ) {
    const key = pathNorm.replace(/^Font\.Brand\.[^.]+\.Font family\./, "");
    return `font-family-${toKebab(key)}`;
  }

  // BRAND FONT WEIGHT (normalize)
  if (
    tokenType === "text" &&
    /^Font\.Brand\.[^.]+\.Font weight\./.test(pathNorm)
  ) {
    const key = pathNorm.replace(/^Font\.Brand\.[^.]+\.Font weight\./, "");
    return `font-weight-${toKebab(key)}`;
  }

  // RADII
  if (tokenType === "number" && pathNorm.startsWith("Border.Radius.")) {
    return `radius-${toKebab(pathNorm.replace("Border.Radius.", ""))}`;
  }

  // BORDER WIDTHS
  if (tokenType === "number" && pathNorm.startsWith("Border.Width.")) {
    return `border-width-${toKebab(pathNorm.replace("Border.Width.", ""))}`;
  }

  // SPACING
  if (
    tokenType === "number" &&
    (pathNorm.startsWith("Spacing.") || pathNorm.startsWith("Space."))
  ) {
    const key = pathNorm.replace(/^Spacing\./, "").replace(/^Space\./, "");
    return `spacing-${toKebab(key)}`;
  }

  // RESPONSIVE TYPOGRAPHY / SIZES
  if (
    tokenType === "number" &&
    (pathNorm.startsWith("Font-size.") ||
      pathNorm.startsWith("FontSize.") ||
      pathNorm.startsWith("Typography.FontSize."))
  ) {
    const key = pathNorm
      .replace(/^Font-size\./, "")
      .replace(/^FontSize\./, "")
      .replace(/^Typography\.FontSize\./, "");
    return `text-${toKebab(key)}`;
  }

  if (
    tokenType === "number" &&
    (pathNorm.startsWith("Line-height.") ||
      pathNorm.startsWith("LineHeight.") ||
      pathNorm.startsWith("Typography.LineHeight."))
  ) {
    const key = pathNorm
      .replace(/^Line-height\./, "")
      .replace(/^LineHeight\./, "")
      .replace(/^Typography\.LineHeight\./, "");
    return `leading-${toKebab(key)}`;
  }

  // FALLBACKS
  if (tokenType === "number") return `number-${toKebab(pathNorm)}`;
  if (tokenType === "text") return `text-${toKebab(pathNorm)}`;
  return `token-${toKebab(pathNorm)}`;
}

export function needsPx(varName) {
  return (
    varName.startsWith("radius-") ||
    varName.startsWith("border-width-") ||
    varName.startsWith("spacing-") ||
    varName.startsWith("text-") ||
    varName.startsWith("leading-") ||
    varName.startsWith("number-") ||
    varName.startsWith("rt-radius-") ||
    varName.startsWith("rt-border-width-") ||
    varName.startsWith("rt-spacing-") ||
    varName.startsWith("rt-text-") ||
    varName.startsWith("rt-leading-") ||
    varName.startsWith("rt-number-")
  );
}
