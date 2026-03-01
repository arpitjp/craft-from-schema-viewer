/**
 * Minecraft-style block texture generator.
 *
 * Uses Notch's original Minecraft 4k texture algorithm as a base,
 * adapted and extended for all block types in the palette.
 * Each texture is 16×16 pixels generated on a canvas at runtime.
 */

import * as THREE from "three";

const S = 16; // texture size

type RGB = [number, number, number];
type PatternFn = (px: Uint8ClampedArray, base: RGB, seed: number) => void;

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function rng(seed: number): [number, () => number] {
  let s = seed & 0xffffffff;
  const next = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  return [s, next];
}

function set(px: Uint8ClampedArray, x: number, y: number, r: number, g: number, b: number): void {
  const i = (y * S + x) * 4;
  px[i] = clamp(r);
  px[i + 1] = clamp(g);
  px[i + 2] = clamp(b);
  px[i + 3] = 255;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── Notch-style base: each pixel gets base color × random brightness ──

function notchFill(px: Uint8ClampedArray, color: number, rand: () => number, brRange = 96): void {
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * brRange | 0)) / 255;
      const r = ((color >> 16) & 0xff) * br;
      const g = ((color >> 8) & 0xff) * br;
      const b = (color & 0xff) * br;
      set(px, x, y, r, g, b);
    }
  }
}

function rgbToHex(c: RGB): number {
  return (c[0] << 16) | (c[1] << 8) | c[2];
}

// ── Pattern functions ──

const patternStone: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Notch's stone: gray with occasional brightness resets
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = 255 - (rand() * 96 | 0);
      if ((rand() * 3 | 0) === 0) br = 255 - (rand() * 96 | 0);
      const f = br / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * f,
        ((hex >> 8) & 0xff) * f,
        (hex & 0xff) * f,
      );
    }
  }
};

const patternDirt: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 96 | 0)) / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternGrass: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const grassHex = rgbToHex(base);
  const dirtHex = 0x966C4A;
  for (let y = 0; y < S; y++) {
    const threshold = ((0 * 0 * 3 + 0 * 81) >> 2 & 3) + 2;
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 96 | 0)) / 255;
      const edgeY = ((x * x * 3 + x * 81) >> 2 & 3) + 2;
      let hex: number;
      let brf = br;
      if (y < edgeY) {
        hex = grassHex;
      } else if (y < edgeY + 1) {
        hex = grassHex;
        brf = br * 0.67;
      } else {
        hex = dirtHex;
      }
      set(px, x, y,
        ((hex >> 16) & 0xff) * brf,
        ((hex >> 8) & 0xff) * brf,
        (hex & 0xff) * brf,
      );
    }
  }
};

const patternPlanks: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 48 | 0)) / 255;
      // Horizontal plank seams every 4 rows
      if (y % 4 === 0) br *= 0.72;
      // Vertical stagger: offset alternates
      const row = (y / 4) | 0;
      const vOff = row % 2 === 0 ? 0 : 8;
      if ((x + vOff) % 8 === 0) br *= 0.75;
      // Subtle wood grain: slight horizontal streaks
      if (y % 4 !== 0 && (rand() < 0.15)) br *= 0.88;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternLog: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const barkHex = rgbToHex(base);
  const innerHex = 0xBC9862;
  // Side of log: bark texture with vertical streaks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 64 | 0)) / 255;
      // Vertical bark lines
      if (x % 3 === 0) br *= 0.8;
      // Occasional horizontal knot lines
      if (y % 5 === 0 && rand() < 0.3) br *= 0.75;
      if (rand() < 0.08) br *= (150 - (x & 1) * 100) / 100;
      set(px, x, y,
        ((barkHex >> 16) & 0xff) * br,
        ((barkHex >> 8) & 0xff) * br,
        (barkHex & 0xff) * br,
      );
    }
  }
};

const patternLogTop: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const barkHex = rgbToHex(base);
  const ringHex = 0xBC9862;
  // Top of log: concentric rings
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (196 - (rand() * 32 | 0));
      const xd = Math.abs(x - 7);
      const yd = Math.abs(y - 7);
      const dist = Math.max(xd, yd);
      // Concentric ring pattern
      br = br + (dist % 3) * 32;
      br = Math.min(255, br) / 255;
      const isEdge = x === 0 || x === 15 || y === 0 || y === 15;
      const hex = isEdge ? barkHex : ringHex;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternBricks: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const brickHex = rgbToHex(base);
  const mortarHex = 0xBCAFA5;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 64 | 0)) / 255;
      const row = y >> 2;
      const isMortarRow = y % 4 === 0;
      const offset = row % 2 === 0 ? 0 : 4;
      const isMortarCol = (x + offset) % 8 === 0;
      const hex = (isMortarRow || isMortarCol) ? mortarHex : brickHex;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternStoneBricks: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  const mortarHex = (clamp(base[0] * 0.7) << 16) | (clamp(base[1] * 0.7) << 8) | clamp(base[2] * 0.7);
  for (let y = 0; y < S; y++) {
    const row = y >> 2;
    const isMortarY = y % 4 === 0;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 48 | 0)) / 255;
      const isMortarX = (x + offset) % 8 === 0;
      const h = (isMortarY || isMortarX) ? mortarHex : hex;
      set(px, x, y,
        ((h >> 16) & 0xff) * br,
        ((h >> 8) & 0xff) * br,
        (h & 0xff) * br,
      );
    }
  }
};

const patternCobblestone: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Irregular stone pattern — patches of lighter/darker
  const patchBr = new Float32Array(4);
  for (let i = 0; i < 4; i++) patchBr[i] = 0.75 + rand() * 0.35;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 96 | 0)) / 255;
      const patchX = (x >> 2) & 1;
      const patchY = (y >> 2) & 1;
      br *= patchBr[patchX + patchY * 2];
      // Mortar-like gaps between patches
      if (x % 4 === 0 || y % 4 === 0) br *= 0.8;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternWool: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 40 | 0)) / 255;
      // Cross-hatch fiber pattern
      if ((x + y) % 2 === 0) br *= 0.95;
      if (y % 4 === 0 && rand() < 0.3) br *= 0.9;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternConcrete: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Very smooth, minimal noise
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 16 | 0)) / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternConcretePowder: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Sandy texture, more noise than concrete
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 48 | 0)) / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternTerracotta: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Slightly streaky, clay-like
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 48 | 0)) / 255;
      // Subtle horizontal striations
      if (y % 3 === 0) br *= 0.92;
      if (rand() < 0.06) br *= 1.08;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternGlass: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Glass: dark border, light highlight on edge, transparent middle
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br: number;
      if (x === 0 || y === 0 || x === 15 || y === 15) {
        br = 0.55 + rand() * 0.1;
      } else if (x === 1 || y === 1) {
        br = 1.0 + rand() * 0.05;
      } else {
        br = 0.85 + rand() * 0.15;
      }
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternOre: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const oreHex = rgbToHex(base);
  const stoneHex = 0x7F7F7F;
  // Stone base with ore specks
  const oreMap = new Uint8Array(S * S);
  // Place 5-8 ore clusters
  const numClusters = 5 + (rand() * 4 | 0);
  for (let c = 0; c < numClusters; c++) {
    const cx = 2 + (rand() * 12 | 0);
    const cy = 2 + (rand() * 12 | 0);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (rand() > 0.35) {
          oreMap[((cy + dy + S) % S) * S + ((cx + dx + S) % S)] = 1;
        }
      }
    }
  }
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 64 | 0)) / 255;
      const isOre = oreMap[y * S + x] === 1;
      const hex = isOre ? oreHex : stoneHex;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternSand: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 48 | 0)) / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternSandstone: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Sandstone: horizontal bands with some noise
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 40 | 0)) / 255;
      // Top carved band
      if (y < 4) br *= 1.05;
      // Bottom solid band
      if (y >= 12) br *= 0.88;
      // Middle body
      if (y >= 4 && y < 12 && y % 3 === 0) br *= 0.93;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternLeaves: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Notch-style: 50% chance of dark hole, rest is leaf color
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if ((rand() * 2 | 0) === 0) {
        // Dark gap / transparency-ish
        const br = (rand() * 0.35 + 0.15);
        set(px, x, y,
          ((hex >> 16) & 0xff) * br,
          ((hex >> 8) & 0xff) * br,
          (hex & 0xff) * br,
        );
      } else {
        const br = (255 - (rand() * 64 | 0)) / 255;
        set(px, x, y,
          ((hex >> 16) & 0xff) * br,
          ((hex >> 8) & 0xff) * br,
          (hex & 0xff) * br,
        );
      }
    }
  }
};

const patternWater: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  // Notch's water: blue with wave-like brightness
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const wave = Math.sin((x + y * 0.7) * 0.8) * 0.1;
      const br = (0.6 + rand() * 0.3 + wave);
      set(px, x, y,
        base[0] * br,
        base[1] * br,
        base[2] * br,
      );
    }
  }
};

const patternLava: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const heat = Math.sin(x * 0.5) * Math.cos(y * 0.4) * 0.15;
      const br = (0.65 + rand() * 0.35 + heat);
      set(px, x, y,
        clamp(base[0] * br + rand() * 20),
        clamp(base[1] * br * 0.7),
        clamp(base[2] * br * 0.3),
      );
    }
  }
};

const patternMetal: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Metal block: horizontal bands with slight variation
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 32 | 0)) / 255;
      // Horizontal rivet lines
      if (y % 4 === 0) br *= 0.82;
      if (y % 4 === 1 && x % 4 === 0) br *= 0.88;
      // Edge bevel
      if (x === 0 || x === 15) br *= 0.85;
      if (y === 0 || y === 15) br *= 0.85;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternSnow: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 20 | 0)) / 255;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternObsidian: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  // Dark base with purple/blue sheen spots
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (0.5 + rand() * 0.35);
      if (rand() < 0.08) {
        // Purple sheen
        set(px, x, y,
          base[0] * br + 25 + rand() * 20,
          base[1] * br,
          base[2] * br + 35 + rand() * 20,
        );
      } else {
        set(px, x, y, base[0] * br, base[1] * br, base[2] * br);
      }
    }
  }
};

const patternNether: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Netherrack-like: warty, uneven
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 80 | 0)) / 255;
      if (rand() < 0.12) br *= 1.15;
      if ((x + y) % 7 === 0) br *= 0.85;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternBookshelf: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const woodHex = rgbToHex(base);
  const bookColors = [
    0xA03228, 0x325032, 0x283278, 0x826420,
    0x642864, 0x3C6464, 0x964632, 0x503C6E,
  ];
  for (let y = 0; y < S; y++) {
    const isShelf = y === 0 || y === 5 || y === 10 || y === 15;
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 48 | 0)) / 255;
      if (isShelf) {
        set(px, x, y,
          ((woodHex >> 16) & 0xff) * br,
          ((woodHex >> 8) & 0xff) * br,
          (woodHex & 0xff) * br,
        );
      } else {
        const section = (y / 5) | 0;
        const bIdx = (x * 3 + section * 7) % bookColors.length;
        const bk = bookColors[bIdx];
        // Spine line between books
        if (x % 3 === 0) {
          const d = 0.7;
          set(px, x, y,
            ((bk >> 16) & 0xff) * br * d,
            ((bk >> 8) & 0xff) * br * d,
            (bk & 0xff) * br * d,
          );
        } else {
          set(px, x, y,
            ((bk >> 16) & 0xff) * br,
            ((bk >> 8) & 0xff) * br,
            (bk & 0xff) * br,
          );
        }
      }
    }
  }
};

const patternGlowstone: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Glowy with bright specks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (200 - (rand() * 60 | 0)) / 255;
      if (rand() < 0.15) br = (230 + rand() * 25) / 255;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternPrismarine: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Cracked aqua pattern
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 64 | 0)) / 255;
      // Cracks
      if ((x + y * 3) % 7 === 0) br *= 0.7;
      // Color shift per pixel
      const shift = rand() < 0.25 ? 0.08 : 0;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br + shift * 30),
        clamp((hex & 0xff) * br + shift * 15),
      );
    }
  }
};

const patternQuartz: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Smooth with subtle specks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 18 | 0)) / 255;
      if (rand() < 0.05) br *= 0.88;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternDeepslate: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Layered diagonal streaks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 48 | 0)) / 255;
      if ((x + y * 2) % 5 < 2) br *= 0.82;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternPurpur: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Grid of small squares like purpur blocks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 36 | 0)) / 255;
      if (x % 4 === 0 || y % 4 === 0) br *= 0.78;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternMud: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (255 - (rand() * 72 | 0)) / 255;
      if (rand() < 0.1) br *= 0.8;
      set(px, x, y,
        ((hex >> 16) & 0xff) * br,
        ((hex >> 8) & 0xff) * br,
        (hex & 0xff) * br,
      );
    }
  }
};

const patternIce: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Ice: translucent streaks
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (220 - (rand() * 40 | 0)) / 255;
      // Diagonal frost lines
      if ((x + y) % 5 === 0) br *= 1.12;
      if ((x * 3 + y * 2) % 11 === 0) br *= 0.82;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternAmethyst: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Crystal facets
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let br = (240 - (rand() * 50 | 0)) / 255;
      // Diagonal crystal lines
      if ((x * 2 + y) % 6 < 2) br *= 1.1;
      if (rand() < 0.08) br *= 1.2;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br),
        clamp(((hex >> 8) & 0xff) * br),
        clamp((hex & 0xff) * br),
      );
    }
  }
};

const patternMushroom: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  // Mushroom cap: spots
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const br = (255 - (rand() * 48 | 0)) / 255;
      // Lighter spots
      const dx = (x - 8), dy = (y - 8);
      const inSpot = (dx * dx + dy * dy < 16) || ((x - 3) * (x - 3) + (y - 4) * (y - 4) < 6);
      const spotBr = inSpot ? 1.12 : 1.0;
      set(px, x, y,
        clamp(((hex >> 16) & 0xff) * br * spotBr),
        clamp(((hex >> 8) & 0xff) * br * spotBr),
        clamp((hex & 0xff) * br * spotBr),
      );
    }
  }
};

const patternDefault: PatternFn = (px, base, seed) => {
  const [, rand] = rng(seed);
  const hex = rgbToHex(base);
  notchFill(px, hex, rand, 64);
};

// ── Block ID → Pattern matcher ──

function matchPattern(blockId: string): PatternFn {
  const id = blockId.replace("minecraft:", "");

  // Specific blocks first
  if (id === "bookshelf" || id === "chiseled_bookshelf") return patternBookshelf;
  if (id === "water" || id === "water_cauldron") return patternWater;
  if (id === "lava" || id === "lava_cauldron") return patternLava;
  if (id === "grass_block" || id === "mycelium" || id === "podzol") return patternGrass;
  if (id === "bricks") return patternBricks;
  if (id === "obsidian" || id === "crying_obsidian") return patternObsidian;
  if (id === "sand" || id === "red_sand") return patternSand;
  if (id === "gravel") return patternCobblestone;
  if (id === "clay") return patternDirt;
  if (id === "snow_block" || id === "snow" || id === "powder_snow") return patternSnow;

  // Wood family
  if (id.includes("_planks") || id === "stripped_bamboo_block") return patternPlanks;
  if (id.includes("_log") || id.includes("_wood") || id.includes("_stem") || id.includes("_hyphae")) return patternLog;

  // Stone brick variants
  if (id.includes("stone_brick") || id.includes("deepslate_brick") || id.includes("deepslate_tile") ||
      id.includes("nether_brick") || id.includes("end_stone_brick") || id.includes("polished_blackstone_brick")) return patternStoneBricks;

  // Mud bricks
  if (id.includes("mud_brick")) return patternStoneBricks;

  // Regular bricks
  if (id.includes("brick")) return patternBricks;

  // Cobblestone / gravel
  if (id.includes("cobblestone") || id.includes("mossy_cobblestone")) return patternCobblestone;

  // Wool
  if (id.includes("wool")) return patternWool;

  // Concrete powder before concrete
  if (id.includes("concrete_powder")) return patternConcretePowder;
  if (id.includes("concrete")) return patternConcrete;

  // Terracotta
  if (id.includes("terracotta")) return patternTerracotta;

  // Glass
  if (id.includes("glass")) return patternGlass;

  // Ores
  if (id.includes("_ore")) return patternOre;

  // Leaves
  if (id.includes("leaves") || id.includes("azalea") || id.includes("mangrove_roots")) return patternLeaves;

  // Sandstone
  if (id.includes("sandstone")) return patternSandstone;

  // Dirt family
  if (id.includes("dirt") || id.includes("farmland") || id.includes("mud") || id === "packed_mud" || id.includes("rooted")) return patternDirt;

  // Mushroom blocks
  if (id.includes("mushroom_block") || id.includes("mushroom_stem")) return patternMushroom;

  // Purpur
  if (id.includes("purpur")) return patternPurpur;

  // Ice
  if (id.includes("ice")) return patternIce;

  // Amethyst
  if (id.includes("amethyst")) return patternAmethyst;

  // Nether blocks
  if (id.includes("netherrack") || id.includes("nether") || id.includes("soul") || id.includes("warped") || id.includes("crimson")) return patternNether;

  // Metal blocks
  if (id.includes("iron_block") || id.includes("gold_block") || id.includes("copper") || id.includes("diamond_block") ||
      id.includes("emerald_block") || id.includes("lapis_block") || id.includes("netherite")) return patternMetal;

  // Quartz / calcite / bone
  if (id.includes("quartz") || id.includes("calcite") || id.includes("bone_block") || id.includes("dripstone")) return patternQuartz;

  // Deepslate / blackstone
  if (id.includes("deepslate") || id.includes("blackstone") || id.includes("basalt")) return patternDeepslate;

  // Prismarine
  if (id.includes("prismarine")) return patternPrismarine;

  // Glowstone / light sources
  if (id.includes("glowstone") || id.includes("sea_lantern") || id.includes("shroomlight") || id.includes("froglight")) return patternGlowstone;

  // Stone family (catchall for stone-ish blocks)
  if (id.includes("stone") || id.includes("andesite") || id.includes("diorite") || id.includes("granite") ||
      id.includes("tuff") || id.includes("bedrock") || id.includes("end_stone")) return patternStone;

  return patternDefault;
}

// ── Cache & export ──

const textureCache = new Map<string, THREE.Texture>();

export function getBlockTexture(blockId: string, rgb: RGB): THREE.Texture {
  const key = `${blockId}_${rgb[0]}_${rgb[1]}_${rgb[2]}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(S, S);

  const seed = hashStr(blockId);
  const pattern = matchPattern(blockId);
  pattern(imageData.data, rgb, seed);
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
