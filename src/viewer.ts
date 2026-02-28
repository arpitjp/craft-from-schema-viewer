import type { ViewerConfig, ViewerEvents, SchematicData, SchematicEntry, BlockHoverInfo } from "./types";
import { EventEmitter } from "./events";
import { SceneManager } from "./scene";
import { GALLERY_COLORS } from "./constants";
import {
  injectStyles,
  createViewerDOM,
  renderGallery,
  updateInfoBar,
  showTooltip,
  hideTooltip,
} from "./ui";

/**
 * CraftFrom Schema Viewer.
 *
 * Load multiple Minecraft schematics, display them in 3D,
 * and navigate between them via a gallery sidebar.
 *
 * @example
 * ```ts
 * import { SchemaViewer } from "@craftfrom/schema-viewer";
 *
 * const viewer = new SchemaViewer({ container: document.getElementById("viewer")! });
 * viewer.addSchematic("castle", castleData);
 * viewer.addSchematic("bridge", bridgeData);
 * ```
 */
export class SchemaViewer extends EventEmitter<ViewerEvents> {
  private config: Required<ViewerConfig>;
  private scene: SceneManager;
  private entries = new Map<string, SchematicEntry>();
  private colorIdx = 0;
  private dom: ReturnType<typeof createViewerDOM>;

  constructor(config: ViewerConfig) {
    super();

    this.config = {
      container: config.container,
      background: config.background ?? "#090b0c",
      gallery: config.gallery ?? true,
      controls: config.controls ?? true,
      tooltip: config.tooltip ?? true,
      infoBar: config.infoBar ?? true,
      dragDrop: config.dragDrop ?? true,
      fov: config.fov ?? 60,
      maxPixelRatio: config.maxPixelRatio ?? 2,
    };

    injectStyles();

    this.dom = createViewerDOM(this.config.container, {
      gallery: this.config.gallery,
      controls: this.config.controls,
      infoBar: this.config.infoBar,
      dragDrop: this.config.dragDrop,
    });

    this.scene = new SceneManager({
      container: this.dom.canvasWrap,
      background: this.config.background,
      fov: this.config.fov,
      maxPixelRatio: this.config.maxPixelRatio,
      onBlockHover: this.config.tooltip
        ? (info, x, y) => {
            if (info) {
              showTooltip(this.dom.tooltip, info, x, y);
              this.emit("block:hover", info);
            } else {
              hideTooltip(this.dom.tooltip);
              this.emit("block:hover", null);
            }
          }
        : undefined,
    });

    this.setupDragDrop();
    this.setupAddButton();
    this.emit("ready");
  }

  /** Load a schematic into the viewer. */
  addSchematic(name: string, data: SchematicData, id?: string): SchematicEntry {
    const sid = id ?? crypto.randomUUID().slice(0, 8);
    const color = GALLERY_COLORS[this.colorIdx % GALLERY_COLORS.length];
    this.colorIdx++;

    const entry: SchematicEntry = {
      id: sid,
      name,
      data,
      visible: true,
      color,
      blockCount: data.blocks.length,
      typeCount: Object.keys(data.palette).length,
    };

    this.entries.set(sid, entry);
    this.scene.addSchematic(sid, name, data);
    this.refresh();
    this.emit("schematic:add", entry);
    return entry;
  }

  /** Remove a schematic from the viewer. */
  removeSchematic(id: string): void {
    if (!this.entries.has(id)) return;
    this.entries.delete(id);
    this.scene.removeSchematic(id);
    this.refresh();
    this.emit("schematic:remove", id);
  }

  /** Toggle visibility of a schematic. */
  toggleSchematic(id: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.visible = !entry.visible;
    this.scene.setSchematicVisible(id, entry.visible);
    this.refresh();
    this.emit("schematic:toggle", id, entry.visible);
  }

  /** Set visibility of a specific schematic. */
  setSchematicVisible(id: string, visible: boolean): void {
    const entry = this.entries.get(id);
    if (!entry || entry.visible === visible) return;
    entry.visible = visible;
    this.scene.setSchematicVisible(id, visible);
    this.refresh();
    this.emit("schematic:toggle", id, visible);
  }

  /** Remove all loaded schematics. */
  clear(): void {
    for (const id of [...this.entries.keys()]) {
      this.removeSchematic(id);
    }
    this.colorIdx = 0;
  }

  /** Get all loaded schematic entries. */
  getSchematics(): SchematicEntry[] {
    return [...this.entries.values()];
  }

  /** Get a schematic entry by ID. */
  getSchematic(id: string): SchematicEntry | undefined {
    return this.entries.get(id);
  }

  /** Focus camera to fit all visible schematics. */
  fitCamera(): void {
    this.scene.fitCamera();
  }

  /** Destroy the viewer and clean up all resources. */
  destroy(): void {
    this.scene.destroy();
    this.dom.tooltip.remove();
    this.config.container.innerHTML = "";
    this.removeAllListeners();
    this.entries.clear();
  }

  /**
   * Load schematic data from a JSON file (blocks.json format).
   * Convenience method for fetching from a URL.
   */
  async loadFromURL(name: string, url: string): Promise<SchematicEntry> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    const data: SchematicData = await resp.json();
    return this.addSchematic(name, data);
  }

  /**
   * Load schematic data from a File object (JSON format only on client side).
   * For .litematic/.schem, pass through a server-side parser.
   */
  async loadFromFile(file: File): Promise<SchematicEntry | null> {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "json") {
      const text = await file.text();
      const data: SchematicData = JSON.parse(text);
      if (data.blocks && data.palette) {
        const name = file.name.replace(/\.json$/, "");
        return this.addSchematic(name, data);
      }
    }
    return null;
  }

  private refresh(): void {
    const entries = this.getSchematics();
    if (this.dom.galleryEl) {
      renderGallery(
        this.dom.galleryEl,
        entries,
        (id) => this.toggleSchematic(id),
        (id) => this.removeSchematic(id),
      );
    }
    if (this.dom.infoEl) {
      updateInfoBar(this.dom.infoEl, entries);
    }
  }

  private setupDragDrop(): void {
    if (!this.config.dragDrop || !this.dom.dropOverlay) return;

    const overlay = this.dom.dropOverlay;
    let counter = 0;

    this.dom.root.addEventListener("dragenter", (e) => {
      e.preventDefault();
      counter++;
      overlay.classList.add("visible");
    });

    this.dom.root.addEventListener("dragleave", () => {
      counter--;
      if (counter <= 0) { counter = 0; overlay.classList.remove("visible"); }
    });

    this.dom.root.addEventListener("dragover", (e) => e.preventDefault());

    this.dom.root.addEventListener("drop", async (e) => {
      e.preventDefault();
      counter = 0;
      overlay.classList.remove("visible");
      const files = e.dataTransfer?.files;
      if (files) {
        for (const file of Array.from(files)) {
          await this.loadFromFile(file);
        }
      }
    });
  }

  private setupAddButton(): void {
    this.dom.addInput.addEventListener("change", async () => {
      const files = this.dom.addInput.files;
      if (files) {
        for (const file of Array.from(files)) {
          await this.loadFromFile(file);
        }
      }
      this.dom.addInput.value = "";
    });

    this.dom.clearBtn.addEventListener("click", () => this.clear());
  }
}
