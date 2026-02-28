# @craftfrom/schema-viewer

Minecraft schematic viewer — load, display, and compare `.litematic` / `.schematic` files in 3D.

Works standalone or embedded in any web page. Built on Three.js.

## Install

```bash
npm install @craftfrom/schema-viewer three
```

## Usage

### Embed in a page

```ts
import { SchemaViewer } from "@craftfrom/schema-viewer";

const viewer = new SchemaViewer({
  container: document.getElementById("viewer")!,
});

// Load from a URL (blocks.json format)
await viewer.loadFromURL("castle", "/api/blocks/castle.json");

// Load from raw data
viewer.addSchematic("bridge", {
  blocks: [[0, 0, 0, "minecraft:stone"], [1, 0, 0, "minecraft:oak_planks"]],
  palette: {
    "minecraft:stone": [128, 128, 128],
    "minecraft:oak_planks": [162, 130, 78],
  },
});
```

### Data format

The viewer consumes `SchematicData`:

```ts
interface SchematicData {
  blocks: [x: number, y: number, z: number, blockId: string][];
  palette: Record<string, [r: number, g: number, b: number]>;
}
```

This is the same format produced by the CraftFrom pipeline (`blocks.json`), and can be generated from `.litematic` files using `litemapy`.

### Gallery

Multiple schematics are displayed in a gallery sidebar. Toggle visibility, remove, or add more via drag-and-drop.

```ts
viewer.addSchematic("castle", castleData);
viewer.addSchematic("bridge", bridgeData);
viewer.addSchematic("tower", towerData);

viewer.toggleSchematic("bridge");  // hide
viewer.removeSchematic("tower");   // remove
viewer.clear();                    // remove all
```

### Events

```ts
viewer.on("schematic:add", (entry) => console.log("Added:", entry.name));
viewer.on("schematic:remove", (id) => console.log("Removed:", id));
viewer.on("block:hover", (info) => {
  if (info) console.log(`Hovering: ${info.blockId} at ${info.position}`);
});
```

### Configuration

```ts
const viewer = new SchemaViewer({
  container: el,
  background: "#1a1a2e",  // scene background
  gallery: true,           // show sidebar gallery
  controls: true,          // show keyboard controls
  tooltip: true,           // show block hover tooltip
  infoBar: true,           // show bottom stats bar
  dragDrop: true,          // allow drag-and-drop JSON files
  fov: 60,                 // camera field of view
  maxPixelRatio: 2,        // cap pixel ratio
});
```

### Keyboard controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Arrow keys | Camera-relative move |
| QE | Yaw |
| RF | Pitch |
| Space | Move up |
| 1-6 | Snap views (front/back/left/right/top/bottom) |
| 0 | Reset camera |

## Development

```bash
npm install
npm run dev     # start dev server with demo page
npm run build   # build library
```

## License

MIT
