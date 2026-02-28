/**
 * Block data format: [x, y, z, blockId] tuples.
 * This is the standard interchange format used by CraftFrom pipeline,
 * litemapy exports, and other Minecraft schematic tools.
 */
export type BlockTuple = [number, number, number, string];

/**
 * Palette maps block IDs (e.g. "minecraft:stone") to RGB color arrays.
 */
export type Palette = Record<string, [number, number, number]>;

/**
 * Raw schematic data — the universal format the viewer consumes.
 * Compatible with blocks.json from litemapy, Amulet, or CraftFrom pipeline.
 */
export interface SchematicData {
  blocks: BlockTuple[];
  palette: Palette;
}

/** Metadata for a loaded schematic in the gallery. */
export interface SchematicEntry {
  id: string;
  name: string;
  data: SchematicData;
  visible: boolean;
  color: string;
  blockCount: number;
  typeCount: number;
}

/** Configuration for the viewer instance. */
export interface ViewerConfig {
  /** DOM element to mount the viewer into. */
  container: HTMLElement;

  /** Background color (CSS hex). Default: "#090b0c" */
  background?: string;

  /** Show the gallery sidebar. Default: true */
  gallery?: boolean;

  /** Show keyboard controls HUD. Default: true */
  controls?: boolean;

  /** Show block hover tooltip. Default: true */
  tooltip?: boolean;

  /** Show info bar with stats. Default: true */
  infoBar?: boolean;

  /** Allow drag-and-drop file loading. Default: true */
  dragDrop?: boolean;

  /** Camera field of view. Default: 60 */
  fov?: number;

  /** Pixel ratio cap. Default: 2 */
  maxPixelRatio?: number;
}

/** Events emitted by the viewer. */
export type ViewerEvents = {
  [key: string]: (...args: any[]) => void;
  "schematic:add": (entry: SchematicEntry) => void;
  "schematic:remove": (id: string) => void;
  "schematic:toggle": (id: string, visible: boolean) => void;
  "block:hover": (info: BlockHoverInfo | null) => void;
  "ready": () => void;
};

export interface BlockHoverInfo {
  blockId: string;
  position: [number, number, number];
  color: [number, number, number];
  schematicName: string;
  schematicId: string;
}
