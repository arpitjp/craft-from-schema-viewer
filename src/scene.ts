import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { SchematicData, BlockHoverInfo } from "./types";
import { DEFAULT_BACKGROUND, DEFAULT_FOV, DEFAULT_MAX_PIXEL_RATIO, MOVE_SPEED, ROTATE_SPEED } from "./constants";
import { getBlockTexture } from "./textures";

export interface SceneConfig {
  container: HTMLElement;
  background?: string;
  fov?: number;
  maxPixelRatio?: number;
  onBlockHover?: (info: BlockHoverInfo | null, clientX: number, clientY: number) => void;
}

interface LoadedGroup {
  group: THREE.Group;
  lookup: Map<string, { bid: string; x: number; y: number; z: number }>;
  palette: Record<string, [number, number, number]>;
  schematicId: string;
  schematicName: string;
}

/** Low-level Three.js scene manager. One per viewer instance. */
export class SceneManager {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;

  private animId = 0;
  private groups = new Map<string, LoadedGroup>();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private keys: Record<string, boolean> = {};
  private initPos?: THREE.Vector3;
  private initTarget?: THREE.Vector3;
  private grid?: THREE.GridHelper;
  private container: HTMLElement;
  private onBlockHover?: SceneConfig["onBlockHover"];
  private resizeObserver: ResizeObserver;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor(config: SceneConfig) {
    this.container = config.container;
    this.onBlockHover = config.onBlockHover;

    const bg = config.background ?? DEFAULT_BACKGROUND;
    const fov = config.fov ?? DEFAULT_FOV;
    const pr = config.maxPixelRatio ?? DEFAULT_MAX_PIXEL_RATIO;

    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bg);

    this.camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 5000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, pr));
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.8;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 5000;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 0.9);
    dl.position.set(1, 2, 1.5);
    this.scene.add(dl);
    const bl = new THREE.DirectionalLight(0xffffff, 0.2);
    bl.position.set(-1, 0.5, -1);
    this.scene.add(bl);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    this.boundKeyDown = (e) => this.handleKeyDown(e);
    this.boundKeyUp = (e) => this.handleKeyUp(e);
    window.addEventListener("keydown", this.boundKeyDown);
    window.addEventListener("keyup", this.boundKeyUp);
    window.addEventListener("blur", () => { this.keys = {}; });

    if (this.onBlockHover) {
      this.renderer.domElement.addEventListener("mousemove", (e) => this.handleMouseMove(e));
      this.renderer.domElement.addEventListener("mouseleave", () => this.onBlockHover?.(null, 0, 0));
    }

    this.startLoop();
  }

  addSchematic(id: string, name: string, data: SchematicData): void {
    this.removeSchematic(id);

    const { group, lookup } = this.buildMesh(data);
    group.userData.sid = id;
    this.scene.add(group);

    this.groups.set(id, {
      group,
      lookup,
      palette: data.palette,
      schematicId: id,
      schematicName: name,
    });

    this.fitCamera();
  }

  removeSchematic(id: string): void {
    const entry = this.groups.get(id);
    if (!entry) return;
    this.scene.remove(entry.group);
    entry.group.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      if ((obj as THREE.Mesh).material) {
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
    this.groups.delete(id);
    this.fitCamera();
  }

  setSchematicVisible(id: string, visible: boolean): void {
    const entry = this.groups.get(id);
    if (entry) entry.group.visible = visible;
  }

  getVisibleIds(): string[] {
    return [...this.groups.entries()].filter(([, e]) => e.group.visible).map(([id]) => id);
  }

  hasAny(): boolean {
    return this.groups.size > 0;
  }

  fitCamera(): void {
    const visibleGroups = [...this.groups.values()].filter((e) => e.group.visible);
    if (visibleGroups.length === 0) return;

    const box = new THREE.Box3();
    for (const g of visibleGroups) box.expandByObject(g.group);

    const center = box.getCenter(new THREE.Vector3());
    const sz = box.getSize(new THREE.Vector3());
    const maxD = Math.max(sz.x, sz.y, sz.z);

    this.controls.target.copy(center);
    this.camera.position.set(center.x + maxD * 0.8, center.y + maxD * 0.5, center.z + maxD * 1.2);
    this.camera.lookAt(center);
    this.controls.update();
    this.initPos = this.camera.position.clone();
    this.initTarget = this.controls.target.clone();

    if (this.grid) this.scene.remove(this.grid);
    this.grid = new THREE.GridHelper(maxD * 2, Math.floor(maxD * 2), 0x222222, 0x181818);
    this.grid.position.set(center.x, box.min.y - 0.5, center.z);
    this.scene.add(this.grid);
  }

  destroy(): void {
    cancelAnimationFrame(this.animId);
    this.resizeObserver.disconnect();
    window.removeEventListener("keydown", this.boundKeyDown);
    window.removeEventListener("keyup", this.boundKeyUp);

    for (const [id] of this.groups) this.removeSchematic(id);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private buildMesh(data: SchematicData) {
    const cg: Record<string, number[]> = {};
    for (const [x, y, z, bid] of data.blocks) {
      if (!cg[bid]) cg[bid] = [];
      cg[bid].push(x, y, z);
    }

    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const lookup = new Map<string, { bid: string; x: number; y: number; z: number }>();

    for (const [bid, coords] of Object.entries(cg)) {
      const rgb = data.palette[bid] ?? [128, 128, 128] as [number, number, number];
      const tex = getBlockTexture(bid, rgb as [number, number, number]);
      const mat = new THREE.MeshLambertMaterial({ map: tex });
      const cnt = coords.length / 3;
      const mesh = new THREE.InstancedMesh(geo, mat, cnt);
      const d = new THREE.Object3D();

      for (let i = 0; i < cnt; i++) {
        const bx = coords[i * 3], by = coords[i * 3 + 1], bz = coords[i * 3 + 2];
        d.position.set(bx, by, bz);
        d.updateMatrix();
        mesh.setMatrixAt(i, d.matrix);
        lookup.set(`${mesh.uuid}_${i}`, { bid, x: bx, y: by, z: bz });
      }
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }
    return { group, lookup };
  }

  private handleResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);

    for (const hit of hits) {
      if ((hit.object as THREE.InstancedMesh).isInstancedMesh && hit.instanceId != null) {
        const parentGroup = hit.object.parent;
        const sid = parentGroup?.userData?.sid;
        const entry = sid ? this.groups.get(sid) : undefined;
        if (!entry) continue;

        const key = `${hit.object.uuid}_${hit.instanceId}`;
        const info = entry.lookup.get(key);
        if (info) {
          const rgb = entry.palette[info.bid] ?? [128, 128, 128];
          this.onBlockHover?.(
            {
              blockId: info.bid,
              position: [info.x, info.y, info.z],
              color: rgb as [number, number, number],
              schematicName: entry.schematicName,
              schematicId: entry.schematicId,
            },
            e.clientX,
            e.clientY,
          );
          return;
        }
      }
    }
    this.onBlockHover?.(null, 0, 0);
  }

  private isTyping(): boolean {
    const t = document.activeElement?.tagName;
    return t === "INPUT" || t === "TEXTAREA" || (document.activeElement as HTMLElement)?.isContentEditable === true;
  }

  private static VIEWER_KEYS = new Set([
    "w", "a", "s", "d", "q", "e", "r", "f",
    "arrowup", "arrowdown", "arrowleft", "arrowright",
    "0", "1", "2", "3", "4", "5", "6", " ",
  ]);

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.isTyping()) return;
    const k = e.key.toLowerCase();
    if (!SceneManager.VIEWER_KEYS.has(k)) return;
    this.keys[k] = true;
    if (k === " ") e.preventDefault();
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keys[e.key.toLowerCase()] = false;
  }

  private processKeys(dt: number): void {
    const sp = MOVE_SPEED * dt;
    const rot = ROTATE_SPEED * dt;

    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    const worldUp = new THREE.Vector3(0, 1, 0);
    const camRight = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0).normalize();

    let hFwd = camDir.clone();
    hFwd.y = 0;
    if (hFwd.lengthSq() < 0.001) {
      hFwd.set(-this.camera.matrixWorld.elements[8], 0, -this.camera.matrixWorld.elements[10]).normalize();
      if (hFwd.lengthSq() < 0.001) hFwd.set(0, 0, -1);
    }
    hFwd.normalize();
    const hRight = new THREE.Vector3().crossVectors(hFwd, worldUp).normalize();

    const k = this.keys;
    if (k["w"])          { this.controls.target.addScaledVector(hFwd, sp);     this.camera.position.addScaledVector(hFwd, sp); }
    if (k["s"])          { this.controls.target.addScaledVector(hFwd, -sp);    this.camera.position.addScaledVector(hFwd, -sp); }
    if (k["a"])          { this.controls.target.addScaledVector(hRight, -sp);  this.camera.position.addScaledVector(hRight, -sp); }
    if (k["d"])          { this.controls.target.addScaledVector(hRight, sp);   this.camera.position.addScaledVector(hRight, sp); }
    if (k["arrowup"])    { this.controls.target.addScaledVector(camDir, sp);   this.camera.position.addScaledVector(camDir, sp); }
    if (k["arrowdown"])  { this.controls.target.addScaledVector(camDir, -sp);  this.camera.position.addScaledVector(camDir, -sp); }
    if (k["arrowleft"])  { this.controls.target.addScaledVector(camRight, -sp);this.camera.position.addScaledVector(camRight, -sp); }
    if (k["arrowright"]) { this.controls.target.addScaledVector(camRight, sp); this.camera.position.addScaledVector(camRight, sp); }
    if (k[" "])          { this.camera.position.y += sp; this.controls.target.y += sp; }

    if (k["q"]) this.controls.autoRotateSpeed = -30;
    else if (k["e"]) this.controls.autoRotateSpeed = 30;
    else this.controls.autoRotateSpeed = 0;
    this.controls.autoRotate = k["q"] || k["e"] || false;

    if (k["r"]) { const o = this.camera.position.clone().sub(this.controls.target); o.applyAxisAngle(camRight, -rot); this.camera.position.copy(this.controls.target).add(o); }
    if (k["f"]) { const o = this.camera.position.clone().sub(this.controls.target); o.applyAxisAngle(camRight, rot);  this.camera.position.copy(this.controls.target).add(o); }

    const dist = this.camera.position.distanceTo(this.controls.target);
    const snapViews: Record<string, () => THREE.Vector3> = {
      "1": () => camDir.clone().negate(),
      "2": () => camDir.clone(),
      "3": () => camRight.clone().negate(),
      "4": () => camRight.clone(),
      "5": () => new THREE.Vector3(0, 1, 0),
      "6": () => new THREE.Vector3(0, -1, 0),
    };
    for (const [key, dirFn] of Object.entries(snapViews)) {
      if (k[key]) {
        const c = this.controls.target.clone();
        const d = dirFn().normalize();
        this.camera.position.copy(c).addScaledVector(d, dist);
        this.camera.lookAt(c);
        this.controls.update();
        k[key] = false;
      }
    }
    if (k["0"] && this.initPos && this.initTarget) {
      this.camera.position.copy(this.initPos);
      this.controls.target.copy(this.initTarget);
      this.controls.update();
      k["0"] = false;
    }
  }

  private startLoop(): void {
    let last = performance.now();
    const animate = (now: number) => {
      this.animId = requestAnimationFrame(animate);
      this.processKeys((now - last) / 1000);
      last = now;
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    this.animId = requestAnimationFrame(animate);
  }
}
