import type { SchematicEntry, BlockHoverInfo } from "./types";

const CSS = `
.csv-root { position:relative; width:100%; height:100%; overflow:hidden; font-family:'JetBrains Mono',monospace; color:#e0e0e0; }
.csv-root *{box-sizing:border-box;}

.csv-canvas-wrap { position:absolute; inset:0; }
.csv-canvas-wrap canvas { display:block; width:100%!important; height:100%!important; }

/* Gallery sidebar */
.csv-gallery { position:absolute; top:12px; right:12px; width:220px; max-height:calc(100% - 24px); overflow-y:auto; z-index:5; display:flex; flex-direction:column; gap:4px; }
.csv-gallery::-webkit-scrollbar{width:3px;}
.csv-gallery::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}

.csv-gallery-item { display:flex; align-items:center; gap:7px; padding:7px 9px; background:rgba(0,0,0,0.7); border:1px solid #1e2022; border-radius:6px; cursor:default; transition:border-color .15s; }
.csv-gallery-item:hover { border-color:#444; }
.csv-gallery-item.hidden-item { opacity:.4; }

.csv-gi-color { width:9px; height:9px; border-radius:2px; border:1px solid rgba(255,255,255,.1); flex-shrink:0; }
.csv-gi-info { flex:1; min-width:0; }
.csv-gi-name { font-size:10px; color:#e0e0e0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500; }
.csv-gi-meta { font-size:8px; color:#555; margin-top:1px; }
.csv-gi-actions { display:flex; gap:3px; flex-shrink:0; }
.csv-gi-btn { width:28px; height:28px; border-radius:4px; background:none; border:1px solid transparent; color:#666; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .12s; }
.csv-gi-btn:hover { border-color:#333; color:#999; }
.csv-gi-btn.del:hover { border-color:#7f1d1d; color:#f87171; }
.csv-gi-btn.vis.off { opacity:.4; }

/* Info bar */
.csv-info { position:absolute; bottom:12px; left:12px; font-size:9px; color:#555; background:rgba(0,0,0,.7); padding:5px 8px; border:1px solid #1e2022; z-index:3; opacity:0; transition:opacity .3s; }
.csv-info.visible { opacity:1; }

/* Tooltip */
.csv-tooltip { position:fixed; pointer-events:none; z-index:30; background:rgba(0,0,0,.88); border:1px solid #1e2022; padding:7px 10px; border-radius:5px; font-size:9px; color:#e0e0e0; opacity:0; transition:opacity .1s; white-space:nowrap; transform:translate(12px,-50%); }
.csv-tooltip.visible { opacity:1; }
.csv-tooltip .bt-name { font-weight:600; font-size:10px; margin-bottom:3px; }
.csv-tooltip .bt-row { display:flex; align-items:center; gap:6px; }
.csv-tooltip .bt-swatch { width:10px; height:10px; border-radius:2px; border:1px solid rgba(255,255,255,.1); }
.csv-tooltip .bt-pos { color:#777; }
.csv-tooltip .bt-schem { color:#555; font-size:8px; margin-top:2px; }

/* Drop overlay */
.csv-drop-overlay { position:absolute; inset:0; background:rgba(9,11,12,.85); display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity .2s; z-index:15; }
.csv-drop-overlay.visible { opacity:1; pointer-events:auto; }
.csv-drop-overlay span { font-size:13px; color:#4ade80; text-transform:uppercase; letter-spacing:3px; }

/* Add button */
.csv-add-bar { position:absolute; top:12px; left:12px; z-index:5; display:flex; gap:6px; }
.csv-add-btn { font-size:9px; padding:4px 10px; border-radius:4px; background:rgba(0,0,0,.7); border:1px solid #1e2022; color:#777; cursor:pointer; text-transform:uppercase; letter-spacing:1px; transition:all .15s; }
.csv-add-btn:hover { border-color:#4ade80; color:#4ade80; }
.csv-add-input { display:none; }
`;

export function injectStyles(): void {
  if (document.getElementById("csv-styles")) return;
  const style = document.createElement("style");
  style.id = "csv-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

export function createViewerDOM(container: HTMLElement, opts: {
  gallery: boolean;
  controls: boolean;
  infoBar: boolean;
  dragDrop: boolean;
}) {
  container.innerHTML = "";

  const root = document.createElement("div");
  root.className = "csv-root";

  const canvasWrap = document.createElement("div");
  canvasWrap.className = "csv-canvas-wrap";
  root.appendChild(canvasWrap);

  let galleryEl: HTMLElement | null = null;
  if (opts.gallery) {
    galleryEl = document.createElement("div");
    galleryEl.className = "csv-gallery";
    root.appendChild(galleryEl);
  }

  let infoEl: HTMLElement | null = null;
  if (opts.infoBar) {
    infoEl = document.createElement("div");
    infoEl.className = "csv-info";
    root.appendChild(infoEl);
  }

  const tooltip = document.createElement("div");
  tooltip.className = "csv-tooltip";
  document.body.appendChild(tooltip);

  let dropOverlay: HTMLElement | null = null;
  if (opts.dragDrop) {
    dropOverlay = document.createElement("div");
    dropOverlay.className = "csv-drop-overlay";
    dropOverlay.innerHTML = "<span>Drop to add schematics</span>";
    root.appendChild(dropOverlay);
  }

  let addInput: HTMLInputElement;
  let clearBtn: HTMLButtonElement;

  if (opts.controls) {
    const addBar = document.createElement("div");
    addBar.className = "csv-add-bar";
    const addBtn = document.createElement("label");
    addBtn.className = "csv-add-btn";
    addBtn.textContent = "+ Add";
    addInput = document.createElement("input");
    addInput.type = "file";
    addInput.multiple = true;
    addInput.accept = ".litematic,.schematic,.schem,.json";
    addInput.className = "csv-add-input";
    addBtn.appendChild(addInput);
    addBar.appendChild(addBtn);

    clearBtn = document.createElement("button");
    clearBtn.className = "csv-add-btn";
    clearBtn.textContent = "Clear";
    addBar.appendChild(clearBtn);

    root.appendChild(addBar);
  } else {
    addInput = document.createElement("input");
    addInput.type = "file";
    addInput.style.display = "none";
    clearBtn = document.createElement("button");
    clearBtn.style.display = "none";
  }

  container.appendChild(root);

  return { root, canvasWrap, galleryEl, infoEl, tooltip, dropOverlay, addInput, clearBtn };
}

export function renderGallery(
  galleryEl: HTMLElement,
  entries: SchematicEntry[],
  onToggle: (id: string) => void,
  onRemove: (id: string) => void,
): void {
  galleryEl.innerHTML = "";
  for (const entry of entries) {
    const el = document.createElement("div");
    el.className = "csv-gallery-item" + (entry.visible ? "" : " hidden-item");
    el.innerHTML = `
      <div class="csv-gi-color" style="background:${entry.color}"></div>
      <div class="csv-gi-info">
        <div class="csv-gi-name" title="${entry.name}">${entry.name}</div>
        <div class="csv-gi-meta">${entry.blockCount.toLocaleString()} blocks · ${entry.typeCount} types</div>
      </div>
      <div class="csv-gi-actions">
        <button class="csv-gi-btn vis ${entry.visible ? "" : "off"}" data-id="${entry.id}" title="Toggle visibility">${entry.visible ? "●" : "○"}</button>
        <button class="csv-gi-btn del" data-id="${entry.id}" title="Remove">×</button>
      </div>
    `;
    galleryEl.appendChild(el);
  }

  galleryEl.querySelectorAll<HTMLButtonElement>(".vis").forEach((btn) => {
    btn.addEventListener("click", () => onToggle(btn.dataset.id!));
  });
  galleryEl.querySelectorAll<HTMLButtonElement>(".del").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(btn.dataset.id!));
  });
}

export function updateInfoBar(infoEl: HTMLElement, entries: SchematicEntry[]): void {
  const vis = entries.filter((e) => e.visible);
  const totalBlocks = vis.reduce((s, e) => s + e.blockCount, 0);
  const allTypes = new Set(vis.flatMap((e) => Object.keys(e.data.palette)));

  if (entries.length === 0) {
    infoEl.classList.remove("visible");
    return;
  }

  infoEl.textContent = `${entries.length} schematic${entries.length > 1 ? "s" : ""} · ${totalBlocks.toLocaleString()} blocks · ${allTypes.size} types`;
  infoEl.classList.add("visible");
}

export function showTooltip(tooltip: HTMLElement, info: BlockHoverInfo, x: number, y: number): void {
  const name = info.blockId.replace("minecraft:", "");
  tooltip.innerHTML = `
    <div class="bt-name">${name}</div>
    <div class="bt-row">
      <div class="bt-swatch" style="background:rgb(${info.color.join(",")})"></div>
      <span class="bt-pos">${info.position.join(", ")}</span>
    </div>
    <div class="bt-schem">${info.schematicName}</div>
  `;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
  tooltip.classList.add("visible");
}

export function hideTooltip(tooltip: HTMLElement): void {
  tooltip.classList.remove("visible");
}
