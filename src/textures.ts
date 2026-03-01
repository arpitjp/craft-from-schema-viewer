/**
 * Procedural Minecraft-style block texture generator.
 *
 * Generates 16×16 pixel textures on a canvas at runtime, mimicking
 * the visual patterns of real Minecraft block faces. Each block type
 * defines a pattern function that paints pixels with slight color
 * variations to create the iconic pixelated look.
 */

import * as THREE from "three";

const TEX_SIZE = 16;

type RGB = [number, number, number];

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function vary(base: RGB, amount: number, rng: () => number): RGB {
  const d = (rng() - 0.5) * 2 * amount;
  return [clamp(base[0] + d), clamp(base[1] + d), clamp(base[2] + d)];
}

function varyChannel(base: RGB, amount: number, rng: () => number): RGB {
  return [
    clamp(base[0] + (rng() - 0.5) * 2 * amount),
    clamp(base[1] + (rng() - 0.5) * 2 * amount),
    clamp(base[2] + (rng() - 0.5) * 2 * amount),
  ];
}

function darken(base: RGB, factor: number): RGB {
  return [clamp(base[0] * factor), clamp(base[1] * factor), clamp(base[2] * factor)];
}

function lighten(base: RGB, factor: number): RGB {
  return [
    clamp(base[0] + (255 - base[0]) * factor),
    clamp(base[1] + (255 - base[1]) * factor),
    clamp(base[2] + (255 - base[2]) * factor),
  ];
}

function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

type PatternFn = (
  pixels: Uint8ClampedArray,
  base: RGB,
  rng: () => number,
) => void;

function setPixel(pixels: Uint8ClampedArray, x: number, y: number, c: RGB): void {
  const i = (y * TEX_SIZE + x) * 4;
  pixels[i] = c[0];
  pixels[i + 1] = c[1];
  pixels[i + 2] = c[2];
  pixels[i + 3] = 255;
}

function fillAll(pixels: Uint8ClampedArray, base: RGB, noise: number, rng: () => number): void {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      setPixel(pixels, x, y, vary(base, noise, rng));
    }
  }
}

const patternStone: PatternFn = (px, base, rng) => {
  fillAll(px, base, 12, rng);
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, darken(base, 0.8 + rng() * 0.15));
  }
};

const patternPlanks: PatternFn = (px, base, rng) => {
  const plankH = 4;
  for (let y = 0; y < TEX_SIZE; y++) {
    const plankIdx = Math.floor(y / plankH);
    const plankBase = vary(base, 8, seededRng(plankIdx * 137));
    const isSeam = y % plankH === 0;
    for (let x = 0; x < TEX_SIZE; x++) {
      if (isSeam) {
        setPixel(px, x, y, darken(plankBase, 0.7));
      } else {
        setPixel(px, x, y, varyChannel(plankBase, 6, rng));
      }
    }
  }
};

const patternLog: PatternFn = (px, base, rng) => {
  const bark = darken(base, 0.75);
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const isStripe = y % 4 === 0 || y % 4 === 1;
      const c = isStripe ? vary(bark, 6, rng) : vary(base, 8, rng);
      setPixel(px, x, y, c);
    }
  }
};

const patternBricks: PatternFn = (px, base, rng) => {
  const mortar: RGB = [150, 140, 135];
  for (let y = 0; y < TEX_SIZE; y++) {
    const row = Math.floor(y / 4);
    const isMortarY = y % 4 === 0;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let x = 0; x < TEX_SIZE; x++) {
      const isMortarX = (x + offset) % 8 === 0;
      if (isMortarY || isMortarX) {
        setPixel(px, x, y, vary(mortar, 5, rng));
      } else {
        setPixel(px, x, y, varyChannel(base, 8, rng));
      }
    }
  }
};

const patternStoneBricks: PatternFn = (px, base, rng) => {
  const mortar = darken(base, 0.65);
  for (let y = 0; y < TEX_SIZE; y++) {
    const row = Math.floor(y / 4);
    const isMortarY = y % 4 === 0;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let x = 0; x < TEX_SIZE; x++) {
      const isMortarX = (x + offset) % 8 === 0;
      if (isMortarY || isMortarX) {
        setPixel(px, x, y, vary(mortar, 4, rng));
      } else {
        setPixel(px, x, y, vary(base, 8, rng));
      }
    }
  }
};

const patternWool: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const fiber = (x + y) % 2 === 0 ? 4 : -4;
      const c: RGB = [
        clamp(base[0] + fiber + (rng() - 0.5) * 6),
        clamp(base[1] + fiber + (rng() - 0.5) * 6),
        clamp(base[2] + fiber + (rng() - 0.5) * 6),
      ];
      setPixel(px, x, y, c);
    }
  }
};

const patternConcrete: PatternFn = (px, base, rng) => {
  fillAll(px, base, 3, rng);
};

const patternTerracotta: PatternFn = (px, base, rng) => {
  fillAll(px, base, 6, rng);
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, lighten(base, 0.1));
  }
};

const patternGlass: PatternFn = (px, base, rng) => {
  const border = darken(base, 0.7);
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      if (x === 0 || y === 0 || x === 15 || y === 15) {
        setPixel(px, x, y, border);
      } else if (x === 1 || y === 1) {
        setPixel(px, x, y, lighten(base, 0.3));
      } else {
        setPixel(px, x, y, vary(base, 3, rng));
      }
    }
  }
};

const patternOre: PatternFn = (px, base, rng) => {
  const stoneBase: RGB = [125, 125, 125];
  fillAll(px, stoneBase, 10, rng);
  const oreColor = base;
  for (let i = 0; i < 6; i++) {
    const cx = 3 + Math.floor(rng() * 10);
    const cy = 3 + Math.floor(rng() * 10);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (rng() > 0.4) {
          const nx = (cx + dx + TEX_SIZE) % TEX_SIZE;
          const ny = (cy + dy + TEX_SIZE) % TEX_SIZE;
          setPixel(px, nx, ny, vary(oreColor, 10, rng));
        }
      }
    }
  }
};

const patternDirt: PatternFn = (px, base, rng) => {
  fillAll(px, base, 14, rng);
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, darken(base, 0.8));
  }
};

const patternGrass: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    const t = y / TEX_SIZE;
    const dirtBase: RGB = [134, 96, 67];
    const blended: RGB = [
      clamp(base[0] * (1 - t * 0.6) + dirtBase[0] * t * 0.6),
      clamp(base[1] * (1 - t * 0.6) + dirtBase[1] * t * 0.6),
      clamp(base[2] * (1 - t * 0.6) + dirtBase[2] * t * 0.6),
    ];
    for (let x = 0; x < TEX_SIZE; x++) {
      setPixel(px, x, y, varyChannel(blended, 10, rng));
    }
  }
};

const patternSand: PatternFn = (px, base, rng) => {
  fillAll(px, base, 8, rng);
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, darken(base, 0.9));
  }
};

const patternSandstone: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    const stripe = y < 4 ? lighten(base, 0.08) : y < 12 ? base : darken(base, 0.9);
    for (let x = 0; x < TEX_SIZE; x++) {
      setPixel(px, x, y, vary(stripe, 5, rng));
    }
  }
};

const patternLeaves: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      if (rng() < 0.25) {
        setPixel(px, x, y, darken(base, 0.6 + rng() * 0.2));
      } else {
        setPixel(px, x, y, varyChannel(base, 14, rng));
      }
    }
  }
};

const patternMetal: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    const stripe = y % 4 < 2 ? lighten(base, 0.06) : darken(base, 0.95);
    for (let x = 0; x < TEX_SIZE; x++) {
      setPixel(px, x, y, vary(stripe, 4, rng));
    }
  }
};

const patternSnow: PatternFn = (px, base, rng) => {
  fillAll(px, base, 4, rng);
};

const patternObsidian: PatternFn = (px, base, rng) => {
  fillAll(px, base, 6, rng);
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, [clamp(base[0] + 20 + rng() * 20), clamp(base[1] + 5), clamp(base[2] + 30 + rng() * 15)]);
  }
};

const patternNether: PatternFn = (px, base, rng) => {
  fillAll(px, base, 10, rng);
  for (let i = 0; i < 15; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, lighten(base, 0.15 + rng() * 0.1));
  }
};

const patternBookshelf: PatternFn = (px, base, rng) => {
  const woodBase = base;
  const bookColors: RGB[] = [
    [160, 50, 40], [50, 80, 50], [40, 50, 120], [130, 100, 30],
    [100, 40, 100], [60, 100, 100], [150, 80, 50], [80, 60, 110],
  ];
  for (let y = 0; y < TEX_SIZE; y++) {
    const isShelf = y === 0 || y === 5 || y === 10 || y === 15;
    for (let x = 0; x < TEX_SIZE; x++) {
      if (isShelf) {
        setPixel(px, x, y, vary(woodBase, 6, rng));
      } else {
        const section = Math.floor(y / 5);
        const bookIdx = (x * 3 + section) % bookColors.length;
        setPixel(px, x, y, vary(bookColors[bookIdx], 10, rng));
      }
    }
  }
};

const patternPrismarine: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const shift = rng() < 0.3 ? [0, 15, 10] : rng() < 0.5 ? [0, -10, -5] : [0, 0, 0];
      const c: RGB = [
        clamp(base[0] + shift[0] + (rng() - 0.5) * 10),
        clamp(base[1] + shift[1] + (rng() - 0.5) * 10),
        clamp(base[2] + shift[2] + (rng() - 0.5) * 10),
      ];
      setPixel(px, x, y, c);
    }
  }
};

const patternCobblestone: PatternFn = (px, base, rng) => {
  fillAll(px, base, 8, rng);
  for (let i = 0; i < 5; i++) {
    const cx = 2 + Math.floor(rng() * 12);
    const cy = 2 + Math.floor(rng() * 12);
    const r = 1 + Math.floor(rng() * 2);
    const shade = rng() > 0.5 ? darken(base, 0.82) : lighten(base, 0.08);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r + 1) {
          const nx = (cx + dx + TEX_SIZE) % TEX_SIZE;
          const ny = (cy + dy + TEX_SIZE) % TEX_SIZE;
          setPixel(px, nx, ny, vary(shade, 4, rng));
        }
      }
    }
  }
};

const patternQuartz: PatternFn = (px, base, rng) => {
  fillAll(px, base, 3, rng);
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(rng() * TEX_SIZE);
    const y = Math.floor(rng() * TEX_SIZE);
    setPixel(px, x, y, darken(base, 0.92));
  }
};

const patternDeepslate: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const stripe = (x + y * 2) % 6 < 2;
      const c = stripe ? darken(base, 0.88) : vary(base, 6, rng);
      setPixel(px, x, y, c);
    }
  }
};

const patternWater: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const wave = Math.sin((x + y * 0.5) * 0.8) * 12;
      const c: RGB = [
        clamp(base[0] + wave + (rng() - 0.5) * 8),
        clamp(base[1] + wave + (rng() - 0.5) * 8),
        clamp(base[2] + wave * 0.5 + (rng() - 0.5) * 6),
      ];
      setPixel(px, x, y, c);
    }
  }
};

const patternLava: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const heat = Math.sin(x * 0.6) * Math.cos(y * 0.4) * 25;
      const c: RGB = [
        clamp(base[0] + heat + (rng() - 0.5) * 15),
        clamp(base[1] + heat * 0.6 + (rng() - 0.5) * 15),
        clamp(base[2] + (rng() - 0.5) * 8),
      ];
      setPixel(px, x, y, c);
    }
  }
};

const patternGlowstone: PatternFn = (px, base, rng) => {
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const bright = rng() < 0.2;
      const c = bright ? lighten(base, 0.3 + rng() * 0.2) : vary(base, 12, rng);
      setPixel(px, x, y, c);
    }
  }
};

const patternDefault: PatternFn = (px, base, rng) => {
  fillAll(px, base, 8, rng);
};

function matchPattern(blockId: string): PatternFn {
  const id = blockId.replace("minecraft:", "");

  if (id.includes("planks")) return patternPlanks;
  if (id.includes("_log") || id.includes("_wood")) return patternLog;
  if (id.includes("stone_brick") || id.includes("deepslate_brick") || id.includes("deepslate_tile") || id.includes("nether_brick") || id.includes("end_stone_brick") || id.includes("mud_brick")) return patternStoneBricks;
  if (id === "bricks" || id.includes("brick")) return patternBricks;
  if (id.includes("cobblestone") || id === "gravel") return patternCobblestone;
  if (id.includes("wool")) return patternWool;
  if (id.includes("concrete_powder")) return patternSand;
  if (id.includes("concrete")) return patternConcrete;
  if (id.includes("terracotta")) return patternTerracotta;
  if (id.includes("glass")) return patternGlass;
  if (id.includes("ore")) return patternOre;
  if (id.includes("leaves")) return patternLeaves;
  if (id.includes("sandstone")) return patternSandstone;
  if (id === "minecraft:sand" || id === "sand") return patternSand;
  if (id.includes("dirt") || id === "clay" || id.includes("mud") || id.includes("packed_mud")) return patternDirt;
  if (id.includes("grass_block")) return patternGrass;
  if (id.includes("snow")) return patternSnow;
  if (id === "obsidian" || id.includes("obsidian")) return patternObsidian;
  if (id.includes("nether") || id.includes("soul")) return patternNether;
  if (id.includes("iron") || id.includes("gold") || id.includes("copper") || id.includes("diamond") || id.includes("emerald") || id.includes("lapis")) return patternMetal;
  if (id.includes("quartz") || id.includes("calcite") || id.includes("bone")) return patternQuartz;
  if (id.includes("deepslate") || id.includes("blackstone")) return patternDeepslate;
  if (id.includes("prismarine")) return patternPrismarine;
  if (id === "bookshelf") return patternBookshelf;
  if (id === "water") return patternWater;
  if (id === "lava") return patternLava;
  if (id.includes("glowstone") || id.includes("sea_lantern") || id.includes("shroomlight")) return patternGlowstone;
  if (id.includes("purpur")) return patternStoneBricks;
  if (id.includes("stone") || id.includes("andesite") || id.includes("diorite") || id.includes("granite") || id.includes("tuff") || id.includes("bedrock")) return patternStone;

  return patternDefault;
}

const textureCache = new Map<string, THREE.Texture>();

/**
 * Get a Three.js texture for a block, generating it procedurally.
 * Textures are cached per (blockId, rgb) pair.
 */
export function getBlockTexture(blockId: string, rgb: RGB): THREE.Texture {
  const key = `${blockId}_${rgb[0]}_${rgb[1]}_${rgb[2]}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(TEX_SIZE, TEX_SIZE);

  let hash = 0;
  for (let i = 0; i < blockId.length; i++) {
    hash = ((hash << 5) - hash + blockId.charCodeAt(i)) | 0;
  }
  const rng = seededRng(Math.abs(hash));

  const pattern = matchPattern(blockId);
  pattern(imageData.data, rgb, rng);
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;

  textureCache.set(key, tex);
  return tex;
}

export function clearTextureCache(): void {
  for (const tex of textureCache.values()) tex.dispose();
  textureCache.clear();
}
