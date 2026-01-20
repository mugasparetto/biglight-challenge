import fs from "node:fs";

function stripRootWrapper(css) {
  const trimmed = css.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return trimmed;
  return trimmed.slice(start + 1, end).trim();
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((l) => (l.trim().length ? pad + l.trim() : ""))
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");
}

/**
 * Wrap declarations in runtime selectors (valid browser CSS).
 * Outputs:
 * :root { ...mobile... }
 * @media (min-width: 768px) { :root { ...desktop... } }
 */
export function stitchRuntimeVars({
  outPath,
  baseCssPath,
  desktopCssPath,
  selector = ":root",
}) {
  const baseCss = fs.readFileSync(baseCssPath, "utf8");
  const desktopCss = fs.readFileSync(desktopCssPath, "utf8");

  const baseInner = stripRootWrapper(baseCss);
  const desktopInner = stripRootWrapper(desktopCss);

  let final = "";
  final += `${selector} {\n`;
  if (baseInner) final += indent(baseInner, 2) + "\n";
  final += "}\n";

  if (desktopInner) {
    final += `\n@media (min-width: 768px) {\n`;
    final += `${selector} {\n`;
    final += indent(desktopInner, 4) + "\n";
    final += "}\n";
    final += "}\n";
  }

  fs.writeFileSync(outPath, final);
}
