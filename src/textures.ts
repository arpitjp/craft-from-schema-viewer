/**
 * Block texture provider.
 *
 * Uses real Minecraft textures extracted from minecraft-assets (MIT).
 * Falls back to a tinted procedural pattern for unknown blocks.
 */

import * as THREE from "three";
import blockTextureData from "./generated/block-textures.json";

const S = 16;
type RGB = [number, number, number];

const texMap = blockTextureData as Record<string, string>;

/**
 * Given a block ID like "minecraft:oak_planks", return the best
 * texture key in our extracted map.
 */
function resolveTextureKey(blockId: string): string | null {
  const id = blockId.replace("minecraft:", "");

  // Direct match is most common
  if (texMap[id]) return id;

  // Logs: prefer side texture (plain name) over _top
  if (id.endsWith("_log") || id.endsWith("_wood")) {
    if (texMap[id]) return id;
    const stripped = id.replace("_wood", "_log");
    if (texMap[stripped]) return stripped;
  }

  // Grass block → side is the most recognizable
  if (id === "grass_block") {
    if (texMap["grass_block_side"]) return "grass_block_side";
    if (texMap["grass_block_top"]) return "grass_block_top";
  }

  // Blocks with _side variant
  if (texMap[id + "_side"]) return id + "_side";
  if (texMap[id + "_front"]) return id + "_front";
  if (texMap[id + "_top"]) return id + "_top";

  // Stems/hyphae → try the log equivalent
  if (id.includes("_stem")) {
    const asLog = id.replace("_stem", "_log");
    if (texMap[asLog]) return asLog;
  }
  if (id.includes("_hyphae")) {
    const asLog = id.replace("_hyphae", "_stem");
    if (texMap[asLog]) return asLog;
  }

  // Stairs/slabs/walls → base block
  const base = id
    .replace(/_stairs$/, "")
    .replace(/_slab$/, "")
    .replace(/_wall$/, "")
    .replace(/_fence$/, "")
    .replace(/_fence_gate$/, "")
    .replace(/_pressure_plate$/, "")
    .replace(/_button$/, "");
  if (base !== id && texMap[base]) return base;

  // Smooth variants
  if (id.startsWith("smooth_") && texMap[id.replace("smooth_", "") + "_top"]) {
    return id.replace("smooth_", "") + "_top";
  }
  if (texMap["smooth_" + id]) return "smooth_" + id;

  // Polished variants
  if (id.startsWith("polished_")) {
    const unpol = id.replace("polished_", "");
    if (texMap["polished_" + unpol]) return "polished_" + unpol;
    if (texMap[unpol]) return unpol;
  }

  // Chiseled variants
  if (id.startsWith("chiseled_")) {
    const unchis = id.replace("chiseled_", "");
    if (texMap["chiseled_" + unchis]) return "chiseled_" + unchis;
    if (texMap[unchis]) return unchis;
  }

  // Cut variants
  if (id.startsWith("cut_")) {
    if (texMap[id]) return id;
    const uncut = id.replace("cut_", "");
    if (texMap[uncut]) return uncut;
  }

  // Waxed copper → unwaxed
  if (id.startsWith("waxed_")) {
    const unwaxed = id.replace("waxed_", "");
    if (texMap[unwaxed]) return unwaxed;
  }

  // Stripped logs/wood
  if (id.startsWith("stripped_")) {
    if (texMap[id]) return id;
  }

  return null;
}

// ── Fallback: simple procedural tinted texture ──

function makeFallbackTexture(rgb: RGB): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(S, S);
  let seed = (rgb[0] * 7 + rgb[1] * 13 + rgb[2] * 19) | 0;
  for (let i = 0; i < S * S; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const br = (255 - ((seed >>> 0) / 0xffffffff * 64 | 0)) / 255;
    const off = i * 4;
    img.data[off] = Math.round(rgb[0] * br);
    img.data[off + 1] = Math.round(rgb[1] * br);
    img.data[off + 2] = Math.round(rgb[2] * br);
    img.data[off + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Load a data-URI PNG into a Three.js texture ──

function loadDataURITexture(dataURI: string): THREE.Texture {
  const img = new Image();
  img.src = dataURI;
  const tex = new THREE.Texture(img);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  img.onload = () => {
    tex.needsUpdate = true;
  };
  // If already loaded (cached by browser), force update
  if (img.complete) tex.needsUpdate = true;
  return tex;
}

// ── Cache & public API ──

const textureCache = new Map<string, THREE.Texture>();

export function getBlockTexture(blockId: string, rgb: RGB): THREE.Texture {
  const key = `${blockId}_${rgb[0]}_${rgb[1]}_${rgb[2]}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const texKey = resolveTextureKey(blockId);
  let tex: THREE.Texture;

  if (texKey && texMap[texKey]) {
    tex = loadDataURITexture(texMap[texKey]);
  } else {
    tex = makeFallbackTexture(rgb);
  }

  textureCache.set(key, tex);
  return tex;
}

export function clearTextureCache(): void {
  for (const tex of textureCache.values()) tex.dispose();
  textureCache.clear();
}
