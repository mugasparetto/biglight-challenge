import StyleDictionary from "style-dictionary";

/**
 * Produces:
 * @theme {
 *   --token: var(--rt-token);
 * }
 */
export function registerFormats() {
  StyleDictionary.registerFormat({
    name: "tailwind/theme-map",
    format: ({ dictionary }) => {
      const tokens =
        dictionary?.allTokens ??
        dictionary?.allProperties ??
        dictionary?.allPropertiesWithValues ??
        [];

      if (!Array.isArray(tokens)) {
        throw new Error(
          `[tailwind/theme-map] Unexpected dictionary shape: ${Object.keys(dictionary ?? {}).join(", ")}`,
        );
      }

      const lines = tokens.map((t) => `  --${t.name}: var(--rt-${t.name});`);
      return `@theme {\n${lines.join("\n")}\n}\n`;
    },
  });
}
