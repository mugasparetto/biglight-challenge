// scripts/tokens/sd.mjs
import fs from "node:fs";
import path from "node:path";
import StyleDictionary from "style-dictionary";
import { ensureDir } from "./io.mjs";
import { CWD } from "./paths.mjs";

function toPosix(p) {
  return p.replace(/\\/g, "/");
}

function makeConfigCssVariables({
  sourceFile,
  includeFiles = [],
  buildPathRel,
  destination,
  selector = ":root",
  filterFn,
  useRuntimeNames = false,
}) {
  const sourceRelPosix = toPosix(path.relative(CWD, sourceFile));
  const includeRel = includeFiles.map((f) => toPosix(path.relative(CWD, f)));

  return {
    log: { verbosity: "verbose" },
    include: includeRel,
    source: [sourceRelPosix],
    platforms: {
      web: {
        transformGroup: "web",
        transforms: [
          "attribute/cti",
          useRuntimeNames ? "name/css-vars-rt" : "name/css-vars",
          "value/quote-font-families",
          "value/font-weight-to-number",
          "value/add-px-where-needed",
          "time/seconds",
          "color/css",
        ],
        buildPath: buildPathRel,
        files: [
          {
            destination,
            format: "css/variables",
            options: { selector },
            ...(filterFn ? { filter: filterFn } : {}),
          },
        ],
      },
    },
  };
}

export async function sdBuildCssVariables({
  sourceFile,
  includeFiles,
  outDirAbs,
  outDirRel,
  destination,
  selector,
  filterFn,
  useRuntimeNames,
}) {
  ensureDir(outDirAbs);

  const config = makeConfigCssVariables({
    sourceFile,
    includeFiles,
    buildPathRel: outDirRel,
    destination,
    selector,
    filterFn,
    useRuntimeNames,
  });

  const sd = new StyleDictionary(config);
  await sd.buildPlatform("web");

  const expectedAbs = path.join(outDirAbs, destination);
  if (!fs.existsSync(expectedAbs)) {
    throw new Error(`Expected file not found after SD build: ${expectedAbs}`);
  }
  return expectedAbs;
}

export async function sdBuildThemeMap({
  sourceFile,
  includeFiles = [],
  outFileAbs,
}) {
  ensureDir(path.dirname(outFileAbs));

  const sourceRelPosix = toPosix(path.relative(CWD, sourceFile));
  const includeRel = includeFiles.map((f) => toPosix(path.relative(CWD, f)));

  const outDirAbs = path.dirname(outFileAbs);
  const outDirRel = toPosix(path.relative(CWD, outDirAbs)) + "/";
  const outName = path.basename(outFileAbs);

  const sd = new StyleDictionary({
    log: { verbosity: "verbose" },
    include: includeRel,
    source: [sourceRelPosix],
    platforms: {
      web: {
        transformGroup: "web",
        transforms: [
          "attribute/cti",
          "name/css-vars",
          "value/add-px-where-needed",
          "time/seconds",
          "color/css",
        ],
        buildPath: outDirRel,
        files: [
          {
            destination: outName,
            format: "tailwind/theme-map",
            filter: (token) => {
              const p = (token.path ?? []).join(".");

              // Remove Responsive wrappers (you keep these in runtime CSS only)
              if (
                p.startsWith("Responsive.Mobile.") ||
                p.startsWith("Responsive.Desktop.")
              )
                return false;

              // Drop brand font branches from Tailwind theme-map
              if (p.startsWith("Font.Brand.")) return false;

              return true;
            },
          },
        ],
      },
    },
  });

  await sd.buildPlatform("web");

  if (!fs.existsSync(outFileAbs)) {
    throw new Error(
      `Expected theme-map not found after SD build: ${outFileAbs}`,
    );
  }
  return outFileAbs;
}
