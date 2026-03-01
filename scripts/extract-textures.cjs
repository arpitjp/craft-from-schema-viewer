#!/usr/bin/env node
/**
 * Extract block textures from minecraft-assets into a JSON map.
 * Reads 16x16 PNGs and outputs base64 data URIs keyed by block name.
 *
 * Run: node scripts/extract-textures.js
 * Output: src/generated/block-textures.json
 */

const fs = require("fs");
const path = require("path");

const MC_VERSION = "1.20.2";
const blocksDir = path.join(
  __dirname,
  "../node_modules/minecraft-assets/minecraft-assets/data",
  MC_VERSION,
  "blocks",
);
const outDir = path.join(__dirname, "../src/generated");
const outFile = path.join(outDir, "block-textures.json");

// Skip non-block textures (particles, overlays, stages, debug)
const SKIP_PATTERNS = [
  /^(comparator|repeater|redstone_torch|redstone_wall)/,
  /^(piston|sticky_piston|moving_piston)/,
  /^(command_block|structure_block|jigsaw)/,
  /_(stage|growth|age)\d/,
  /^debug/,
  /destroy_stage/,
  /^(fire|soul_fire|campfire|soul_campfire)_\d/,
  /^respawn_anchor_top_off/,
];

function shouldSkip(name) {
  return SKIP_PATTERNS.some((p) => p.test(name));
}

if (!fs.existsSync(blocksDir)) {
  console.error("minecraft-assets not found. Run: npm install");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(blocksDir).filter((f) => f.endsWith(".png"));
const textures = {};
let skipped = 0;

for (const file of files) {
  const name = file.replace(".png", "");
  if (shouldSkip(name)) {
    skipped++;
    continue;
  }
  const data = fs.readFileSync(path.join(blocksDir, file));
  textures[name] = "data:image/png;base64," + data.toString("base64");
}

fs.writeFileSync(outFile, JSON.stringify(textures));

const sizeKB = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(
  `Extracted ${Object.keys(textures).length} textures (skipped ${skipped})`,
);
console.log(`Output: ${outFile} (${sizeKB} KB)`);
