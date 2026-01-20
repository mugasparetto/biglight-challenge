import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  BRANDS,
  OUT_BASE_ABS,
  OUT_BASE_REL,
  OUT_BRAND_ABS,
  OUT_BRAND_REL,
  OUT_THEME_MAP_ABS,
} from "./scripts/tokens/paths.mjs";
import { ensureDir } from "./scripts/tokens/io.mjs";
import { registerTransforms } from "./scripts/tokens/transforms.mjs";
import { registerFormats } from "./scripts/tokens/formats.mjs";
import {
  writeReferenceUniverse,
  writeBaseSources,
  writeBrandOverrideSource,
  writeThemeMapSupersetSource,
} from "./scripts/tokens/sources.mjs";
import { sdBuildCssVariables, sdBuildThemeMap } from "./scripts/tokens/sd.mjs";
import { stitchRuntimeVars } from "./scripts/tokens/stitch.mjs";
import {
  isNotBrandFontToken,
  makeBrandOverrideFilter,
} from "./scripts/tokens/filters.mjs";

function makeRunTmpDir() {
  // OS temp dir per run, so nothing is left in your repo.
  const prefix = path.join(os.tmpdir(), "biglight-style-dictionary-");
  return fs.mkdtempSync(prefix);
}

async function main() {
  console.log("Build started...");

  // Register SD extensions once
  registerTransforms();
  registerFormats();

  // Outputs
  ensureDir(OUT_BASE_ABS);
  for (const b of BRANDS) ensureDir(OUT_BRAND_ABS(b.name));
  ensureDir(path.dirname(OUT_THEME_MAP_ABS));

  const tmpDir = makeRunTmpDir();
  const keepTmp = process.env.KEEP_SD_TMP === "1";

  try {
    // Create a reference universe to resolve all refs
    const refsUniverse = writeReferenceUniverse(tmpDir);

    // 0) Tailwind theme-map (superset)
    console.log("\n==============================================");
    console.log("Processing: [tailwind] theme-map (superset)");
    const themeMapSource = writeThemeMapSupersetSource(tmpDir);

    await sdBuildThemeMap({
      sourceFile: themeMapSource,
      includeFiles: [refsUniverse],
      outFileAbs: OUT_THEME_MAP_ABS,
    });

    console.log(`✅ Wrote: ${OUT_THEME_MAP_ABS}`);

    // 1) Shared base runtime vars
    console.log("\n==============================================");
    console.log("Processing: [web] [base] runtime vars");

    const { baseMobileFile, desktopFile } = writeBaseSources(tmpDir);

    const baseMobileCss = await sdBuildCssVariables({
      sourceFile: baseMobileFile,
      includeFiles: [refsUniverse],
      outDirAbs: OUT_BASE_ABS,
      outDirRel: OUT_BASE_REL,
      destination: "_tokens.base-mobile.css",
      selector: ":root",
      useRuntimeNames: true,
      filterFn: isNotBrandFontToken,
    });

    const desktopCss = await sdBuildCssVariables({
      sourceFile: desktopFile,
      includeFiles: [refsUniverse],
      outDirAbs: OUT_BASE_ABS,
      outDirRel: OUT_BASE_REL,
      destination: "_tokens.desktop.css",
      selector: ":root",
      useRuntimeNames: true,
      filterFn: isNotBrandFontToken,
    });

    const baseRuntimePath = path.join(OUT_BASE_ABS, "tokens.runtime.css");

    stitchRuntimeVars({
      outPath: baseRuntimePath,
      baseCssPath: baseMobileCss,
      desktopCssPath: desktopCss,
      selector: ":root",
    });

    fs.unlinkSync(baseMobileCss);
    fs.unlinkSync(desktopCss);

    console.log(`✅ Wrote: ${baseRuntimePath}`);

    // 2) Brand runtime overrides
    for (const brand of BRANDS) {
      console.log("\n==============================================");
      console.log(
        `Processing: [web] [${brand.name}] runtime overrides (colors)`,
      );

      const brandSource = writeBrandOverrideSource(tmpDir, brand.name);

      const brandTempCss = await sdBuildCssVariables({
        sourceFile: brandSource,
        includeFiles: [refsUniverse],
        outDirAbs: OUT_BRAND_ABS(brand.name),
        outDirRel: OUT_BRAND_REL(brand.name),
        destination: "_tokens.overrides.css",
        selector: brand.selector,
        filterFn: makeBrandOverrideFilter(brand.name),
        useRuntimeNames: true,
      });

      const finalBrandPath = path.join(
        OUT_BRAND_ABS(brand.name),
        "tokens.runtime.css",
      );
      fs.writeFileSync(finalBrandPath, fs.readFileSync(brandTempCss, "utf8"));
      fs.unlinkSync(brandTempCss);

      console.log(`✅ Wrote: ${finalBrandPath}`);
    }

    console.log("\n==============================================");
    console.log("Build completed!");
  } finally {
    if (!keepTmp) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } else {
      console.log(`(KEEP_SD_TMP=1) Temp files kept at: ${tmpDir}`);
    }
  }
}

await main();
