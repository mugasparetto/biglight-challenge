import StyleDictionary from "style-dictionary";
import { tokenToCssVar, needsPx } from "./naming.mjs";

export function registerTransforms() {
  // Tailwind-facing names: color-..., radius-..., etc.
  StyleDictionary.registerTransform({
    name: "name/css-vars",
    type: "name",
    transform: (token) => {
      const p = token.path ?? [];
      const type = token.type;

      if (p[0] === "Responsive" && (p[1] === "Desktop" || p[1] === "Mobile")) {
        return tokenToCssVar(p.slice(2).join("."), type);
      }
      return tokenToCssVar(p.join("."), type);
    },
  });

  // Runtime names: rt-color-..., rt-radius-..., etc.
  StyleDictionary.registerTransform({
    name: "name/css-vars-rt",
    type: "name",
    transform: (token) => {
      const p = token.path ?? [];
      const type = token.type;

      const baseName =
        p[0] === "Responsive" && (p[1] === "Desktop" || p[1] === "Mobile")
          ? tokenToCssVar(p.slice(2).join("."), type)
          : tokenToCssVar(p.join("."), type);

      return `rt-${baseName}`;
    },
  });

  StyleDictionary.registerTransform({
    name: "value/quote-font-families",
    type: "value",
    transform: (token) => {
      const name = token.name || "";
      if (!name.includes("font-family-")) return token.value;

      const v = token.value;
      if (typeof v !== "string") return v;

      const s = v.trim();
      if (s.includes(",") || s.startsWith('"') || s.startsWith("'")) return s;
      if (/\s/.test(s)) return `"${s}"`;
      return s;
    },
  });

  StyleDictionary.registerTransform({
    name: "value/font-weight-to-number",
    type: "value",
    transform: (token) => {
      const name = String(token.name || "");
      const pathStr = (token.path || []).join(".");

      const isFontWeight =
        name.includes("font-weight-") ||
        name.includes("rt-font-weight-") ||
        pathStr.includes(".Font weight.") ||
        pathStr.includes(".FontWeight.") ||
        pathStr.includes(".Font-weight.");

      if (!isFontWeight) return token.value;

      const v = token.value;

      if (typeof v === "number") return v;
      if (typeof v === "string" && /^\s*\d+\s*$/.test(v)) return v.trim();
      if (typeof v !== "string") return v;

      const key = v
        .trim()
        .toLowerCase()
        .replace(/[_]/g, "-")
        .replace(/\s+/g, "-");

      const map = {
        thin: 100,
        hairline: 100,
        "extra-light": 200,
        extralight: 200,
        "ultra-light": 200,
        ultralight: 200,
        light: 300,
        regular: 400,
        normal: 400,
        book: 400,
        medium: 500,
        "semi-bold": 600,
        semibold: 600,
        "demi-bold": 600,
        demibold: 600,
        bold: 700,
        "extra-bold": 800,
        extrabold: 800,
        "ultra-bold": 800,
        ultrabold: 800,
        black: 900,
        heavy: 900,
        "extra-black": 950,
        extrablack: 950,
        "ultra-black": 950,
        ultrablack: 950,
      };

      return map[key] ?? v;
    },
  });

  StyleDictionary.registerTransform({
    name: "value/add-px-where-needed",
    type: "value",
    transform: (token) => {
      if (token.type !== "number") return token.value;

      const name = token.name || "";
      const v = token.value;

      if (typeof v === "string") {
        const s = v.trim();
        if (/[a-z%]$/i.test(s)) return s;
        return needsPx(name) ? `${s}px` : s;
      }

      if (typeof v === "number") {
        return needsPx(name) ? `${v}px` : v;
      }

      return v;
    },
  });
}
