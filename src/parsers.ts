/**
 * Client-side parsers for Minecraft schematic binary formats.
 * Uses prismarine-nbt for NBT deserialization.
 *
 * Supported formats:
 *   .schematic  — MCEdit legacy format (numeric block IDs)
 *   .schem      — Sponge schematic v2/v3 (string palette + varint block data)
 *   .litematic  — Litematica format (bit-packed palette indices in long arrays)
 */

import type { SchematicData, BlockTuple, Palette } from "./types";
import { buildPalette } from "./palette";

type SimplifiedNBT = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _nbt: any = null;

async function getNbt(): Promise<{ parse: Function; simplify: Function }> {
  if (!_nbt) {
    const mod = await import("prismarine-nbt");
    _nbt = (mod as any).default ?? mod;
  }
  return _nbt;
}

async function parseNBT(buffer: ArrayBuffer): Promise<SimplifiedNBT> {
  const nbt = await getNbt();
  const { parsed } = await nbt.parse(new Uint8Array(buffer) as any);
  return nbt.simplify(parsed) as SimplifiedNBT;
}

const LEGACY_BLOCK_MAP: Record<number, string> = {
  1: "minecraft:stone",
  2: "minecraft:grass_block",
  3: "minecraft:dirt",
  4: "minecraft:cobblestone",
  5: "minecraft:oak_planks",
  6: "minecraft:oak_sapling",
  7: "minecraft:bedrock",
  9: "minecraft:water",
  11: "minecraft:lava",
  12: "minecraft:sand",
  13: "minecraft:gravel",
  14: "minecraft:gold_ore",
  15: "minecraft:iron_ore",
  16: "minecraft:coal_ore",
  17: "minecraft:oak_log",
  18: "minecraft:oak_leaves",
  19: "minecraft:sponge",
  20: "minecraft:glass",
  21: "minecraft:lapis_ore",
  22: "minecraft:lapis_block",
  24: "minecraft:sandstone",
  35: "minecraft:white_wool",
  41: "minecraft:gold_block",
  42: "minecraft:iron_block",
  43: "minecraft:stone_slab",
  44: "minecraft:stone_slab",
  45: "minecraft:bricks",
  47: "minecraft:bookshelf",
  48: "minecraft:mossy_cobblestone",
  49: "minecraft:obsidian",
  50: "minecraft:torch",
  53: "minecraft:oak_stairs",
  54: "minecraft:chest",
  56: "minecraft:diamond_ore",
  57: "minecraft:diamond_block",
  58: "minecraft:crafting_table",
  61: "minecraft:furnace",
  65: "minecraft:ladder",
  67: "minecraft:cobblestone_stairs",
  79: "minecraft:ice",
  80: "minecraft:snow_block",
  82: "minecraft:clay",
  85: "minecraft:oak_fence",
  86: "minecraft:pumpkin",
  87: "minecraft:netherrack",
  88: "minecraft:soul_sand",
  89: "minecraft:glowstone",
  91: "minecraft:jack_o_lantern",
  98: "minecraft:stone_bricks",
  102: "minecraft:glass_pane",
  112: "minecraft:nether_bricks",
  121: "minecraft:end_stone",
  125: "minecraft:oak_slab",
  126: "minecraft:oak_slab",
  128: "minecraft:sandstone_stairs",
  133: "minecraft:emerald_block",
  134: "minecraft:spruce_stairs",
  135: "minecraft:birch_stairs",
  136: "minecraft:jungle_stairs",
  155: "minecraft:quartz_block",
  156: "minecraft:quartz_stairs",
  159: "minecraft:white_terracotta",
  160: "minecraft:white_stained_glass_pane",
  162: "minecraft:acacia_log",
  170: "minecraft:hay_block",
  172: "minecraft:terracotta",
  173: "minecraft:coal_block",
  174: "minecraft:packed_ice",
  179: "minecraft:red_sandstone",
  201: "minecraft:purpur_block",
  206: "minecraft:end_stone_bricks",
};

/**
 * Parse .schematic (MCEdit legacy) format.
 * Block IDs are numeric bytes mapped to modern string IDs.
 */
function parseSchematicLegacy(data: SimplifiedNBT): SchematicData {
  const width = data.Width ?? 0;
  const height = data.Height ?? 0;
  const length = data.Length ?? 0;
  const rawBlocks: number[] = data.Blocks ?? [];
  const blocks: BlockTuple[] = [];

  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let z = 0; z < length; z++) {
      for (let x = 0; x < width; x++) {
        if (i >= rawBlocks.length) break;
        const numId = rawBlocks[i++];
        if (numId === 0) continue;
        const bid = LEGACY_BLOCK_MAP[numId] ?? `minecraft:unknown_${numId}`;
        blocks.push([x, y, z, bid]);
      }
    }
  }

  const usedIds = new Set(blocks.map((b) => b[3]));
  return { blocks, palette: buildPalette(usedIds) };
}

/**
 * Read a varint from a byte array at the given offset.
 * Returns [value, bytesRead].
 */
function readVarint(bytes: number[] | Uint8Array, offset: number): [number, number] {
  let value = 0;
  let shift = 0;
  let pos = offset;
  while (pos < bytes.length) {
    const b = bytes[pos];
    value |= (b & 0x7f) << shift;
    pos++;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return [value, pos - offset];
}

/**
 * Parse .schem (Sponge v2/v3) format.
 * Uses a string palette + varint-encoded block data.
 */
function parseSponge(data: SimplifiedNBT): SchematicData {
  let root = data;
  if (root.Schematic) root = root.Schematic;

  const width: number = root.Width ?? 0;
  const height: number = root.Height ?? 0;
  const length: number = root.Length ?? 0;

  let paletteRaw: Record<string, number>;
  let blockBytes: number[] | Uint8Array;

  if (root.Blocks?.Palette && root.Blocks?.Data) {
    paletteRaw = root.Blocks.Palette;
    blockBytes = root.Blocks.Data;
  } else {
    paletteRaw = root.Palette ?? {};
    blockBytes = root.BlockData ?? [];
  }

  const idMap = new Map<number, string>();
  for (const [name, idx] of Object.entries(paletteRaw)) {
    const bid = name.startsWith("minecraft:") ? name : `minecraft:${name}`;
    const cleanBid = bid.split("[")[0];
    idMap.set(Number(idx), cleanBid);
  }

  const blocks: BlockTuple[] = [];
  let byteIdx = 0;
  for (let y = 0; y < height; y++) {
    for (let z = 0; z < length; z++) {
      for (let x = 0; x < width; x++) {
        if (byteIdx >= blockBytes.length) break;
        const [val, read] = readVarint(blockBytes, byteIdx);
        byteIdx += read;
        const bid = idMap.get(val) ?? `minecraft:unknown_${val}`;
        if (bid === "minecraft:air") continue;
        blocks.push([x, y, z, bid]);
      }
    }
  }

  const usedIds = new Set(blocks.map((b) => b[3]));
  return { blocks, palette: buildPalette(usedIds) };
}

/**
 * Parse .litematic format.
 * Each region has a BlockStatePalette and BlockStates (bit-packed long array).
 */
function parseLitematic(data: SimplifiedNBT): SchematicData {
  const regions: Record<string, any> = data.Regions ?? {};
  const allBlocks: BlockTuple[] = [];

  for (const region of Object.values(regions)) {
    const palette: any[] = region.BlockStatePalette ?? [];
    if (palette.length === 0) continue;

    const sx = Math.abs(region.Size?.x ?? 0);
    const sy = Math.abs(region.Size?.y ?? 0);
    const sz = Math.abs(region.Size?.z ?? 0);
    const volume = sx * sy * sz;
    if (volume === 0) continue;

    const ox = region.Position?.x ?? 0;
    const oy = region.Position?.y ?? 0;
    const oz = region.Position?.z ?? 0;

    const bitsPerEntry = Math.max(2, Math.ceil(Math.log2(palette.length)));
    const mask = (1 << bitsPerEntry) - 1;

    const rawStates: bigint[] | number[] = region.BlockStates ?? [];
    if (rawStates.length === 0) continue;

    const longs = rawStates.map((v: any) => BigInt(v));

    let bitIndex = 0;
    for (let y = 0; y < sy; y++) {
      for (let z = 0; z < sz; z++) {
        for (let x = 0; x < sx; x++) {
          const longIdx = Math.floor(bitIndex / 64);
          const bitOffset = bitIndex % 64;
          bitIndex += bitsPerEntry;

          if (longIdx >= longs.length) continue;

          let paletteIdx: number;
          if (bitOffset + bitsPerEntry <= 64) {
            paletteIdx = Number((longs[longIdx] >> BigInt(bitOffset)) & BigInt(mask));
          } else {
            const bitsFromFirst = 64 - bitOffset;
            const low = Number((longs[longIdx] >> BigInt(bitOffset)) & BigInt((1 << bitsFromFirst) - 1));
            const high = longIdx + 1 < longs.length
              ? Number(longs[longIdx + 1] & BigInt((1 << (bitsPerEntry - bitsFromFirst)) - 1))
              : 0;
            paletteIdx = low | (high << bitsFromFirst);
          }

          if (paletteIdx >= palette.length) continue;

          const entry = palette[paletteIdx];
          const blockName: string = entry?.Name ?? entry ?? "minecraft:air";
          if (blockName === "minecraft:air") continue;

          allBlocks.push([x + ox, y + oy, z + oz, blockName]);
        }
      }
    }
  }

  const usedIds = new Set(allBlocks.map((b) => b[3]));
  return { blocks: allBlocks, palette: buildPalette(usedIds) };
}

/**
 * Detect format from simplified NBT root and dispatch to the right parser.
 */
function parseFromNBT(data: SimplifiedNBT): SchematicData {
  if (data.Regions) {
    return parseLitematic(data);
  }

  let root = data;
  if (root.Schematic) root = root.Schematic;

  if (root.Blocks?.Palette || root.Palette) {
    return parseSponge(data);
  }

  if (root.Blocks && typeof root.Width === "number") {
    return parseSchematicLegacy(data);
  }

  throw new Error("Unrecognized NBT schematic format");
}

export type FileExtension = ".schematic" | ".schem" | ".litematic" | ".json";

export const SUPPORTED_EXTENSIONS: FileExtension[] = [".schematic", ".schem", ".litematic", ".json"];

/**
 * Parse a dropped/selected file into SchematicData.
 * Handles .schematic, .schem, .litematic (binary NBT) and .json.
 */
export async function parseFile(file: File): Promise<SchematicData> {
  const ext = ("." + (file.name.split(".").pop()?.toLowerCase() ?? "")) as string;

  if (ext === ".json") {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.blocks && data.palette) return data as SchematicData;
    throw new Error("JSON file must contain 'blocks' and 'palette' keys");
  }

  if (ext === ".schematic" || ext === ".schem" || ext === ".litematic") {
    const buffer = await file.arrayBuffer();
    const nbtData = await parseNBT(buffer);
    return parseFromNBT(nbtData);
  }

  throw new Error(`Unsupported file format: ${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`);
}
