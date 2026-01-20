import path from "node:path";
import { INPUT_FILE } from "./paths.mjs";
import { ensureDir, readJson, writeJson } from "./io.mjs";
import { deepMerge } from "./merge.mjs";

/**
 * Create a reference universe to resolve all {...} references.
 * We merge all token sets except tokenSetOrder into a single object.
 */
export function writeReferenceUniverse(tmpDir) {
  ensureDir(tmpDir);

  const allSets = readJson(INPUT_FILE);
  let merged = {};

  for (const [key, value] of Object.entries(allSets)) {
    if (key === "tokenSetOrder") continue;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      merged = deepMerge(merged, value);
    }
  }

  const outFile = path.join(tmpDir, "__refs.universe.json");
  writeJson(outFile, merged);
  return outFile;
}

/**
 * Base runtime vars input:
 * - Primitives/Default
 * - Responsive/Mobile
 * - Responsive/Desktop
 *
 * Split into base+mobile and desktop-only.
 */
export function writeBaseSources(tmpDir) {
  ensureDir(tmpDir);

  const allTokens = readJson(INPUT_FILE);

  const primitivesRaw = allTokens["Primitives/Default"] ?? {};
  const responsiveMobile = allTokens["Responsive/Mobile"] ?? {};
  const responsiveDesktop = allTokens["Responsive/Desktop"] ?? {};

  // clone and remove Font.Brand from primitives (base is brand-agnostic)
  const primitives = JSON.parse(JSON.stringify(primitivesRaw));
  if (primitives.Font?.Brand) delete primitives.Font.Brand;

  // base-mobile = primitives + responsiveMobile merged at ROOT
  const baseMobile = deepMerge(primitives, responsiveMobile);

  // desktop-only = responsiveDesktop merged at ROOT
  const desktopOnly = deepMerge(
    { Scale: primitives.Scale ?? {} },
    responsiveDesktop,
  );

  const baseMobileFile = path.join(tmpDir, "base.base-mobile.json");
  const desktopFile = path.join(tmpDir, "base.desktop.json");

  writeJson(baseMobileFile, baseMobile);
  writeJson(desktopFile, desktopOnly);

  return { baseMobileFile, desktopFile };
}

/**
 * Brand override source:
 * - Alias colours/<brand>
 * - Mapped/<brand>
 * - plus primitives for reference support
 * - (Responsive removed; base handles it)
 * - only keep Font.Brand.<brand>
 */
export function writeBrandOverrideSource(tmpDir, brand) {
  ensureDir(tmpDir);

  const allTokens = readJson(INPUT_FILE);

  const primitives = allTokens["Primitives/Default"] ?? {};
  const aliases = allTokens[`Alias colours/${brand}`] ?? {};
  const mapped = allTokens[`Mapped/${brand}`] ?? {};

  let merged = deepMerge(deepMerge(primitives, aliases), mapped);

  // Remove Responsive from brand overrides (base handles it)
  if (merged.Responsive) delete merged.Responsive;

  // Keep only this brand in Font.Brand
  if (merged.Font?.Brand) {
    merged.Font.Brand = { [brand]: merged.Font.Brand[brand] };
  }

  const outFile = path.join(tmpDir, `${brand}.overrides.json`);
  writeJson(outFile, merged);
  return outFile;
}

/**
 * Theme-map superset (Tailwind-facing):
 * - Primitives/Default
 * - Responsive/Mobile + Responsive/Desktop under Responsive wrapper
 * - Mapped/BrandA + Mapped/BrandB
 *
 * References are resolved via include(universe).
 */
export function writeThemeMapSupersetSource(tmpDir) {
  ensureDir(tmpDir);

  const allTokens = readJson(INPUT_FILE);

  const primitives = allTokens["Primitives/Default"] ?? {};
  const responsiveMobile = allTokens["Responsive/Mobile"] ?? {};
  const responsiveDesktop = allTokens["Responsive/Desktop"] ?? {};
  const mappedA = allTokens["Mapped/BrandA"] ?? {};
  const mappedB = allTokens["Mapped/BrandB"] ?? {};

  let superset = deepMerge(primitives, {
    Responsive: {
      Mobile: responsiveMobile,
      Desktop: responsiveDesktop,
    },
  });

  superset = deepMerge(superset, mappedA);
  superset = deepMerge(superset, mappedB);

  const outFile = path.join(tmpDir, "theme-map.superset.json");
  writeJson(outFile, superset);
  return outFile;
}
