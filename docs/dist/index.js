import * as y from "three";
import { Controls as pt, Vector3 as D, MOUSE as L, TOUCH as T, Quaternion as Q, Spherical as J, Vector2 as E, Ray as ft, Plane as ut, MathUtils as _t } from "three";
class bt {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    return this.listeners.has(t) || this.listeners.set(t, /* @__PURE__ */ new Set()), this.listeners.get(t).add(e), () => this.off(t, e);
  }
  off(t, e) {
    var n;
    (n = this.listeners.get(t)) == null || n.delete(e);
  }
  emit(t, ...e) {
    var n;
    (n = this.listeners.get(t)) == null || n.forEach((i) => i(...e));
  }
  removeAllListeners() {
    this.listeners.clear();
  }
}
const tt = { type: "change" }, W = { type: "start" }, ct = { type: "end" }, B = new ft(), et = new ut(), gt = Math.cos(70 * _t.DEG2RAD), k = new D(), v = 2 * Math.PI, w = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, K = 1e-6;
class yt extends pt {
  constructor(t, e = null) {
    super(t, e), this.state = w.NONE, this.enabled = !0, this.target = new D(), this.cursor = new D(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: L.ROTATE, MIDDLE: L.DOLLY, RIGHT: L.PAN }, this.touches = { ONE: T.ROTATE, TWO: T.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new D(), this._lastQuaternion = new Q(), this._lastTargetPosition = new D(), this._quat = new Q().setFromUnitVectors(t.up, new D(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new J(), this._sphericalDelta = new J(), this._scale = 1, this._panOffset = new D(), this._rotateStart = new E(), this._rotateEnd = new E(), this._rotateDelta = new E(), this._panStart = new E(), this._panEnd = new E(), this._panDelta = new E(), this._dollyStart = new E(), this._dollyEnd = new E(), this._dollyDelta = new E(), this._dollyDirection = new D(), this._mouse = new E(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = xt.bind(this), this._onPointerDown = wt.bind(this), this._onPointerUp = kt.bind(this), this._onContextMenu = Tt.bind(this), this._onMouseWheel = St.bind(this), this._onKeyDown = Dt.bind(this), this._onTouchStart = Pt.bind(this), this._onTouchMove = Mt.bind(this), this._onMouseDown = vt.bind(this), this._onMouseMove = Et.bind(this), this._interceptControlDown = Lt.bind(this), this._interceptControlUp = Ot.bind(this), this.domElement !== null && this.connect(), this.update();
  }
  connect() {
    this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(tt), this.update(), this.state = w.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    k.copy(e).sub(this.target), k.applyQuaternion(this._quat), this._spherical.setFromVector3(k), this.autoRotate && this.state === w.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, i = this.maxAzimuthAngle;
    isFinite(n) && isFinite(i) && (n < -Math.PI ? n += v : n > Math.PI && (n -= v), i < -Math.PI ? i += v : i > Math.PI && (i -= v), n <= i ? this._spherical.theta = Math.max(n, Math.min(i, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + i) / 2 ? Math.max(n, this._spherical.theta) : Math.min(i, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let o = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const s = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), o = s != this._spherical.radius;
    }
    if (k.setFromSpherical(this._spherical), k.applyQuaternion(this._quatInverse), e.copy(this.target).add(k), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let s = null;
      if (this.object.isPerspectiveCamera) {
        const r = k.length();
        s = this._clampDistance(r * this._scale);
        const l = r - s;
        this.object.position.addScaledVector(this._dollyDirection, l), this.object.updateMatrixWorld(), o = !!l;
      } else if (this.object.isOrthographicCamera) {
        const r = new D(this._mouse.x, this._mouse.y, 0);
        r.unproject(this.object);
        const l = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), o = l !== this.object.zoom;
        const c = new D(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(r), this.object.updateMatrixWorld(), s = k.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      s !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position) : (B.origin.copy(this.object.position), B.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(B.direction)) < gt ? this.object.lookAt(this.target) : (et.setFromNormalAndCoplanarPoint(this.object.up, this.target), B.intersectPlane(et, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const s = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), s !== this.object.zoom && (this.object.updateProjectionMatrix(), o = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, o || this._lastPosition.distanceToSquared(this.object.position) > K || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > K || this._lastTargetPosition.distanceToSquared(this.target) > K ? (this.dispatchEvent(tt), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? v / 60 * this.autoRotateSpeed * t : v / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    k.setFromMatrixColumn(e, 0), k.multiplyScalar(-t), this._panOffset.add(k);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? k.setFromMatrixColumn(e, 1) : (k.setFromMatrixColumn(e, 0), k.crossVectors(this.object.up, k)), k.multiplyScalar(t), this._panOffset.add(k);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const i = this.object.position;
      k.copy(i).sub(this.target);
      let o = k.length();
      o *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * o / n.clientHeight, this.object.matrix), this._panUp(2 * e * o / n.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const n = this.domElement.getBoundingClientRect(), i = t - n.left, o = e - n.top, s = n.width, r = n.height;
    this._mouse.x = i / s * 2 - 1, this._mouse.y = -(o / r) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(v * this._rotateDelta.x / e.clientHeight), this._rotateUp(v * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = !1;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(v * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(-v * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(v * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(-v * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), e = !0;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1)
      this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(n, i);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._panStart.set(n, i);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, i = t.pageY - e.y, o = Math.sqrt(n * n + i * i);
    this._dollyStart.set(0, o);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const n = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + n.x), o = 0.5 * (t.pageY + n.y);
      this._rotateEnd.set(i, o);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(v * this._rotateDelta.x / e.clientHeight), this._rotateUp(v * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._panEnd.set(n, i);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, i = t.pageY - e.y, o = Math.sqrt(n * n + i * i);
    this._dollyEnd.set(0, o), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const s = (t.pageX + e.x) * 0.5, r = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(s, r);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  // pointers
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) {
        this._pointers.splice(e, 1);
        return;
      }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) return !0;
    return !1;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new E(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, n = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
  }
}
function wt(a) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(a.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(a) && (this._addPointer(a), a.pointerType === "touch" ? this._onTouchStart(a) : this._onMouseDown(a)));
}
function xt(a) {
  this.enabled !== !1 && (a.pointerType === "touch" ? this._onTouchMove(a) : this._onMouseMove(a));
}
function kt(a) {
  switch (this._removePointer(a), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(a.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(ct), this.state = w.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function vt(a) {
  let t;
  switch (a.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case L.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(a), this.state = w.DOLLY;
      break;
    case L.ROTATE:
      if (a.ctrlKey || a.metaKey || a.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(a), this.state = w.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(a), this.state = w.ROTATE;
      }
      break;
    case L.PAN:
      if (a.ctrlKey || a.metaKey || a.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(a), this.state = w.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(a), this.state = w.PAN;
      }
      break;
    default:
      this.state = w.NONE;
  }
  this.state !== w.NONE && this.dispatchEvent(W);
}
function Et(a) {
  switch (this.state) {
    case w.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(a);
      break;
    case w.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(a);
      break;
    case w.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(a);
      break;
  }
}
function St(a) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== w.NONE || (a.preventDefault(), this.dispatchEvent(W), this._handleMouseWheel(this._customWheelEvent(a)), this.dispatchEvent(ct));
}
function Dt(a) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(a);
}
function Pt(a) {
  switch (this._trackPointer(a), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case T.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(a), this.state = w.TOUCH_ROTATE;
          break;
        case T.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(a), this.state = w.TOUCH_PAN;
          break;
        default:
          this.state = w.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case T.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(a), this.state = w.TOUCH_DOLLY_PAN;
          break;
        case T.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(a), this.state = w.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = w.NONE;
      }
      break;
    default:
      this.state = w.NONE;
  }
  this.state !== w.NONE && this.dispatchEvent(W);
}
function Mt(a) {
  switch (this._trackPointer(a), this.state) {
    case w.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(a), this.update();
      break;
    case w.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(a), this.update();
      break;
    case w.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(a), this.update();
      break;
    case w.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(a), this.update();
      break;
    default:
      this.state = w.NONE;
  }
}
function Tt(a) {
  this.enabled !== !1 && a.preventDefault();
}
function Lt(a) {
  a.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Ot(a) {
  a.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
const it = [
  "#4ade80",
  "#60a5fa",
  "#f472b6",
  "#facc15",
  "#a78bfa",
  "#fb923c",
  "#34d399",
  "#f87171",
  "#38bdf8",
  "#c084fc"
], Ct = "#090b0c", At = 60, Rt = 2, jt = 40, zt = 1.5, h = 16;
function u(a) {
  return Math.max(0, Math.min(255, Math.round(a)));
}
function _(a) {
  let t = a & 4294967295;
  return [t, () => (t = t * 1664525 + 1013904223 & 4294967295, (t >>> 0) / 4294967295)];
}
function f(a, t, e, n, i, o) {
  const s = (e * h + t) * 4;
  a[s] = u(n), a[s + 1] = u(i), a[s + 2] = u(o), a[s + 3] = 255;
}
function It(a) {
  let t = 0;
  for (let e = 0; e < a.length; e++) t = (t << 5) - t + a.charCodeAt(e) | 0;
  return Math.abs(t);
}
function Nt(a, t, e, n = 96) {
  for (let i = 0; i < h; i++)
    for (let o = 0; o < h; o++) {
      const s = (255 - (e() * n | 0)) / 255, r = (t >> 16 & 255) * s, l = (t >> 8 & 255) * s, c = (t & 255) * s;
      f(a, o, i, r, l, c);
    }
}
function b(a) {
  return a[0] << 16 | a[1] << 8 | a[2];
}
const Bt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = 255 - (n() * 96 | 0);
      (n() * 3 | 0) === 0 && (r = 255 - (n() * 96 | 0));
      const l = r / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * l,
        (i >> 8 & 255) * l,
        (i & 255) * l
      );
    }
}, st = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 96 | 0)) / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, Ut = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = 9858122;
  for (let s = 0; s < h; s++)
    for (let r = 0; r < h; r++) {
      const l = (255 - (n() * 96 | 0)) / 255, c = (r * r * 3 + r * 81 >> 2 & 3) + 2;
      let d, p = l;
      s < c ? d = i : s < c + 1 ? (d = i, p = l * 0.67) : d = o, f(
        a,
        r,
        s,
        (d >> 16 & 255) * p,
        (d >> 8 & 255) * p,
        (d & 255) * p
      );
    }
}, Ft = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 48 | 0)) / 255;
      o % 4 === 0 && (r *= 0.72);
      const c = (o / 4 | 0) % 2 === 0 ? 0 : 8;
      (s + c) % 8 === 0 && (r *= 0.75), o % 4 !== 0 && n() < 0.15 && (r *= 0.88), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, Ht = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 64 | 0)) / 255;
      s % 3 === 0 && (r *= 0.8), o % 5 === 0 && n() < 0.3 && (r *= 0.75), n() < 0.08 && (r *= (150 - (s & 1) * 100) / 100), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, ot = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = 12365733;
  for (let s = 0; s < h; s++)
    for (let r = 0; r < h; r++) {
      const l = (255 - (n() * 64 | 0)) / 255, c = s >> 2, d = s % 4 === 0, p = c % 2 === 0 ? 0 : 4, m = (r + p) % 8 === 0, g = d || m ? o : i;
      f(
        a,
        r,
        s,
        (g >> 16 & 255) * l,
        (g >> 8 & 255) * l,
        (g & 255) * l
      );
    }
}, nt = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = u(t[0] * 0.7) << 16 | u(t[1] * 0.7) << 8 | u(t[2] * 0.7);
  for (let s = 0; s < h; s++) {
    const r = s >> 2, l = s % 4 === 0, c = r % 2 === 0 ? 0 : 8;
    for (let d = 0; d < h; d++) {
      const p = (255 - (n() * 48 | 0)) / 255, m = (d + c) % 8 === 0, g = l || m ? o : i;
      f(
        a,
        d,
        s,
        (g >> 16 & 255) * p,
        (g >> 8 & 255) * p,
        (g & 255) * p
      );
    }
  }
}, rt = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = new Float32Array(4);
  for (let s = 0; s < 4; s++) o[s] = 0.75 + n() * 0.35;
  for (let s = 0; s < h; s++)
    for (let r = 0; r < h; r++) {
      let l = (255 - (n() * 96 | 0)) / 255;
      const c = r >> 2 & 1, d = s >> 2 & 1;
      l *= o[c + d * 2], (r % 4 === 0 || s % 4 === 0) && (l *= 0.8), f(
        a,
        r,
        s,
        (i >> 16 & 255) * l,
        (i >> 8 & 255) * l,
        (i & 255) * l
      );
    }
}, Yt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 40 | 0)) / 255;
      (s + o) % 2 === 0 && (r *= 0.95), o % 4 === 0 && n() < 0.3 && (r *= 0.9), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, Vt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 16 | 0)) / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, Kt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 48 | 0)) / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, $t = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 48 | 0)) / 255;
      o % 3 === 0 && (r *= 0.92), n() < 0.06 && (r *= 1.08), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, Zt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r;
      s === 0 || o === 0 || s === 15 || o === 15 ? r = 0.55 + n() * 0.1 : s === 1 || o === 1 ? r = 1 + n() * 0.05 : r = 0.85 + n() * 0.15, f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, Wt = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = 8355711, s = new Uint8Array(h * h), r = 5 + (n() * 4 | 0);
  for (let l = 0; l < r; l++) {
    const c = 2 + (n() * 12 | 0), d = 2 + (n() * 12 | 0);
    for (let p = -1; p <= 1; p++)
      for (let m = -1; m <= 1; m++)
        n() > 0.35 && (s[(d + p + h) % h * h + (c + m + h) % h] = 1);
  }
  for (let l = 0; l < h; l++)
    for (let c = 0; c < h; c++) {
      const d = (255 - (n() * 64 | 0)) / 255, m = s[l * h + c] === 1 ? i : o;
      f(
        a,
        c,
        l,
        (m >> 16 & 255) * d,
        (m >> 8 & 255) * d,
        (m & 255) * d
      );
    }
}, Xt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 48 | 0)) / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, qt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 40 | 0)) / 255;
      o < 4 && (r *= 1.05), o >= 12 && (r *= 0.88), o >= 4 && o < 12 && o % 3 === 0 && (r *= 0.93), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, Gt = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++)
      if ((n() * 2 | 0) === 0) {
        const r = n() * 0.35 + 0.15;
        f(
          a,
          s,
          o,
          (i >> 16 & 255) * r,
          (i >> 8 & 255) * r,
          (i & 255) * r
        );
      } else {
        const r = (255 - (n() * 64 | 0)) / 255;
        f(
          a,
          s,
          o,
          (i >> 16 & 255) * r,
          (i >> 8 & 255) * r,
          (i & 255) * r
        );
      }
}, Qt = (a, t, e) => {
  const [, n] = _(e);
  for (let i = 0; i < h; i++)
    for (let o = 0; o < h; o++) {
      const s = Math.sin((o + i * 0.7) * 0.8) * 0.1, r = 0.6 + n() * 0.3 + s;
      f(
        a,
        o,
        i,
        t[0] * r,
        t[1] * r,
        t[2] * r
      );
    }
}, Jt = (a, t, e) => {
  const [, n] = _(e);
  for (let i = 0; i < h; i++)
    for (let o = 0; o < h; o++) {
      const s = Math.sin(o * 0.5) * Math.cos(i * 0.4) * 0.15, r = 0.65 + n() * 0.35 + s;
      f(
        a,
        o,
        i,
        u(t[0] * r + n() * 20),
        u(t[1] * r * 0.7),
        u(t[2] * r * 0.3)
      );
    }
}, te = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 32 | 0)) / 255;
      o % 4 === 0 && (r *= 0.82), o % 4 === 1 && s % 4 === 0 && (r *= 0.88), (s === 0 || s === 15) && (r *= 0.85), (o === 0 || o === 15) && (r *= 0.85), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, ee = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 20 | 0)) / 255;
      f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, ie = (a, t, e) => {
  const [, n] = _(e);
  for (let i = 0; i < h; i++)
    for (let o = 0; o < h; o++) {
      const s = 0.5 + n() * 0.35;
      n() < 0.08 ? f(
        a,
        o,
        i,
        t[0] * s + 25 + n() * 20,
        t[1] * s,
        t[2] * s + 35 + n() * 20
      ) : f(a, o, i, t[0] * s, t[1] * s, t[2] * s);
    }
}, se = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 80 | 0)) / 255;
      n() < 0.12 && (r *= 1.15), (s + o) % 7 === 0 && (r *= 0.85), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, oe = (a, t, e) => {
  const [, n] = _(e), i = b(t), o = [
    10498600,
    3297330,
    2634360,
    8545312,
    6563940,
    3957860,
    9848370,
    5258350
  ];
  for (let s = 0; s < h; s++) {
    const r = s === 0 || s === 5 || s === 10 || s === 15;
    for (let l = 0; l < h; l++) {
      const c = (255 - (n() * 48 | 0)) / 255;
      if (r)
        f(
          a,
          l,
          s,
          (i >> 16 & 255) * c,
          (i >> 8 & 255) * c,
          (i & 255) * c
        );
      else {
        const d = s / 5 | 0, p = (l * 3 + d * 7) % o.length, m = o[p];
        l % 3 === 0 ? f(
          a,
          l,
          s,
          (m >> 16 & 255) * c * 0.7,
          (m >> 8 & 255) * c * 0.7,
          (m & 255) * c * 0.7
        ) : f(
          a,
          l,
          s,
          (m >> 16 & 255) * c,
          (m >> 8 & 255) * c,
          (m & 255) * c
        );
      }
    }
  }
}, ne = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (200 - (n() * 60 | 0)) / 255;
      n() < 0.15 && (r = (230 + n() * 25) / 255), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, re = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 64 | 0)) / 255;
      (s + o * 3) % 7 === 0 && (r *= 0.7);
      const l = n() < 0.25 ? 0.08 : 0;
      f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r + l * 30),
        u((i & 255) * r + l * 15)
      );
    }
}, ae = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 18 | 0)) / 255;
      n() < 0.05 && (r *= 0.88), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, ce = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 48 | 0)) / 255;
      (s + o * 2) % 5 < 2 && (r *= 0.82), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, le = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (255 - (n() * 36 | 0)) / 255;
      (s % 4 === 0 || o % 4 === 0) && (r *= 0.78), f(
        a,
        s,
        o,
        (i >> 16 & 255) * r,
        (i >> 8 & 255) * r,
        (i & 255) * r
      );
    }
}, he = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (220 - (n() * 40 | 0)) / 255;
      (s + o) % 5 === 0 && (r *= 1.12), (s * 3 + o * 2) % 11 === 0 && (r *= 0.82), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, de = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      let r = (240 - (n() * 50 | 0)) / 255;
      (s * 2 + o) % 6 < 2 && (r *= 1.1), n() < 0.08 && (r *= 1.2), f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r),
        u((i >> 8 & 255) * r),
        u((i & 255) * r)
      );
    }
}, me = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  for (let o = 0; o < h; o++)
    for (let s = 0; s < h; s++) {
      const r = (255 - (n() * 48 | 0)) / 255, l = s - 8, c = o - 8, p = l * l + c * c < 16 || (s - 3) * (s - 3) + (o - 4) * (o - 4) < 6 ? 1.12 : 1;
      f(
        a,
        s,
        o,
        u((i >> 16 & 255) * r * p),
        u((i >> 8 & 255) * r * p),
        u((i & 255) * r * p)
      );
    }
}, pe = (a, t, e) => {
  const [, n] = _(e), i = b(t);
  Nt(a, i, n, 64);
};
function fe(a) {
  const t = a.replace("minecraft:", "");
  return t === "bookshelf" || t === "chiseled_bookshelf" ? oe : t === "water" || t === "water_cauldron" ? Qt : t === "lava" || t === "lava_cauldron" ? Jt : t === "grass_block" || t === "mycelium" || t === "podzol" ? Ut : t === "bricks" ? ot : t === "obsidian" || t === "crying_obsidian" ? ie : t === "sand" || t === "red_sand" ? Xt : t === "gravel" ? rt : t === "clay" ? st : t === "snow_block" || t === "snow" || t === "powder_snow" ? ee : t.includes("_planks") || t === "stripped_bamboo_block" ? Ft : t.includes("_log") || t.includes("_wood") || t.includes("_stem") || t.includes("_hyphae") ? Ht : t.includes("stone_brick") || t.includes("deepslate_brick") || t.includes("deepslate_tile") || t.includes("nether_brick") || t.includes("end_stone_brick") || t.includes("polished_blackstone_brick") || t.includes("mud_brick") ? nt : t.includes("brick") ? ot : t.includes("cobblestone") || t.includes("mossy_cobblestone") ? rt : t.includes("wool") ? Yt : t.includes("concrete_powder") ? Kt : t.includes("concrete") ? Vt : t.includes("terracotta") ? $t : t.includes("glass") ? Zt : t.includes("_ore") ? Wt : t.includes("leaves") || t.includes("azalea") || t.includes("mangrove_roots") ? Gt : t.includes("sandstone") ? qt : t.includes("dirt") || t.includes("farmland") || t.includes("mud") || t === "packed_mud" || t.includes("rooted") ? st : t.includes("mushroom_block") || t.includes("mushroom_stem") ? me : t.includes("purpur") ? le : t.includes("ice") ? he : t.includes("amethyst") ? de : t.includes("netherrack") || t.includes("nether") || t.includes("soul") || t.includes("warped") || t.includes("crimson") ? se : t.includes("iron_block") || t.includes("gold_block") || t.includes("copper") || t.includes("diamond_block") || t.includes("emerald_block") || t.includes("lapis_block") || t.includes("netherite") ? te : t.includes("quartz") || t.includes("calcite") || t.includes("bone_block") || t.includes("dripstone") ? ae : t.includes("deepslate") || t.includes("blackstone") || t.includes("basalt") ? ce : t.includes("prismarine") ? re : t.includes("glowstone") || t.includes("sea_lantern") || t.includes("shroomlight") || t.includes("froglight") ? ne : t.includes("stone") || t.includes("andesite") || t.includes("diorite") || t.includes("granite") || t.includes("tuff") || t.includes("bedrock") || t.includes("end_stone") ? Bt : pe;
}
const at = /* @__PURE__ */ new Map();
function ue(a, t) {
  const e = `${a}_${t[0]}_${t[1]}_${t[2]}`, n = at.get(e);
  if (n) return n;
  const i = document.createElement("canvas");
  i.width = h, i.height = h;
  const o = i.getContext("2d"), s = o.createImageData(h, h), r = It(a);
  fe(a)(s.data, t, r), o.putImageData(s, 0, 0);
  const c = new y.CanvasTexture(i);
  return c.magFilter = y.NearestFilter, c.minFilter = y.NearestFilter, c.colorSpace = y.SRGBColorSpace, at.set(e, c), c;
}
const U = class U {
  constructor(t) {
    this.animId = 0, this.groups = /* @__PURE__ */ new Map(), this.raycaster = new y.Raycaster(), this.mouse = new y.Vector2(), this.keys = {}, this.container = t.container, this.onBlockHover = t.onBlockHover;
    const e = t.background ?? Ct, n = t.fov ?? At, i = t.maxPixelRatio ?? Rt, o = this.container.clientWidth, s = this.container.clientHeight;
    this.scene = new y.Scene(), this.scene.background = new y.Color(e), this.camera = new y.PerspectiveCamera(n, o / s, 0.1, 5e3), this.renderer = new y.WebGLRenderer({ antialias: !0 }), this.renderer.setSize(o, s), this.renderer.setPixelRatio(Math.min(devicePixelRatio, i)), this.container.appendChild(this.renderer.domElement), this.controls = new yt(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.08, this.controls.rotateSpeed = 0.8, this.controls.minDistance = 1, this.controls.maxDistance = 5e3, this.scene.add(new y.AmbientLight(16777215, 0.5));
    const r = new y.DirectionalLight(16777215, 0.9);
    r.position.set(1, 2, 1.5), this.scene.add(r);
    const l = new y.DirectionalLight(16777215, 0.2);
    l.position.set(-1, 0.5, -1), this.scene.add(l), this.resizeObserver = new ResizeObserver(() => this.handleResize()), this.resizeObserver.observe(this.container), this.boundKeyDown = (c) => this.handleKeyDown(c), this.boundKeyUp = (c) => this.handleKeyUp(c), window.addEventListener("keydown", this.boundKeyDown), window.addEventListener("keyup", this.boundKeyUp), window.addEventListener("blur", () => {
      this.keys = {};
    }), this.onBlockHover && (this.renderer.domElement.addEventListener("mousemove", (c) => this.handleMouseMove(c)), this.renderer.domElement.addEventListener("mouseleave", () => {
      var c;
      return (c = this.onBlockHover) == null ? void 0 : c.call(this, null, 0, 0);
    })), this.startLoop();
  }
  addSchematic(t, e, n) {
    this.removeSchematic(t);
    const { group: i, lookup: o } = this.buildMesh(n);
    i.userData.sid = t, this.scene.add(i), this.groups.set(t, {
      group: i,
      lookup: o,
      palette: n.palette,
      schematicId: t,
      schematicName: e
    }), this.fitCamera();
  }
  removeSchematic(t) {
    const e = this.groups.get(t);
    e && (this.scene.remove(e.group), e.group.traverse((n) => {
      if (n.geometry && n.geometry.dispose(), n.material) {
        const i = n.material;
        Array.isArray(i) ? i.forEach((o) => o.dispose()) : i.dispose();
      }
    }), this.groups.delete(t), this.fitCamera());
  }
  setSchematicVisible(t, e) {
    const n = this.groups.get(t);
    n && (n.group.visible = e);
  }
  getVisibleIds() {
    return [...this.groups.entries()].filter(([, t]) => t.group.visible).map(([t]) => t);
  }
  hasAny() {
    return this.groups.size > 0;
  }
  fitCamera() {
    const t = [...this.groups.values()].filter((s) => s.group.visible);
    if (t.length === 0) return;
    const e = new y.Box3();
    for (const s of t) e.expandByObject(s.group);
    const n = e.getCenter(new y.Vector3()), i = e.getSize(new y.Vector3()), o = Math.max(i.x, i.y, i.z);
    this.controls.target.copy(n), this.camera.position.set(n.x + o * 0.8, n.y + o * 0.5, n.z + o * 1.2), this.camera.lookAt(n), this.controls.update(), this.initPos = this.camera.position.clone(), this.initTarget = this.controls.target.clone(), this.grid && this.scene.remove(this.grid), this.grid = new y.GridHelper(o * 2, Math.floor(o * 2), 2236962, 1579032), this.grid.position.set(n.x, e.min.y - 0.5, n.z), this.scene.add(this.grid);
  }
  destroy() {
    cancelAnimationFrame(this.animId), this.resizeObserver.disconnect(), window.removeEventListener("keydown", this.boundKeyDown), window.removeEventListener("keyup", this.boundKeyUp);
    for (const [t] of this.groups) this.removeSchematic(t);
    this.renderer.dispose(), this.renderer.domElement.remove();
  }
  buildMesh(t) {
    const e = {};
    for (const [s, r, l, c] of t.blocks)
      e[c] || (e[c] = []), e[c].push(s, r, l);
    const n = new y.Group(), i = new y.BoxGeometry(1, 1, 1), o = /* @__PURE__ */ new Map();
    for (const [s, r] of Object.entries(e)) {
      const l = t.palette[s] ?? [128, 128, 128], c = ue(s, l), d = new y.MeshLambertMaterial({ map: c }), p = r.length / 3, m = new y.InstancedMesh(i, d, p), g = new y.Object3D();
      for (let x = 0; x < p; x++) {
        const S = r[x * 3], P = r[x * 3 + 1], M = r[x * 3 + 2];
        g.position.set(S, P, M), g.updateMatrix(), m.setMatrixAt(x, g.matrix), o.set(`${m.uuid}_${x}`, { bid: s, x: S, y: P, z: M });
      }
      m.instanceMatrix.needsUpdate = !0, n.add(m);
    }
    return { group: n, lookup: o };
  }
  handleResize() {
    const t = this.container.clientWidth, e = this.container.clientHeight;
    !t || !e || (this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.renderer.setSize(t, e));
  }
  handleMouseMove(t) {
    var i, o, s;
    const e = this.container.getBoundingClientRect();
    this.mouse.x = (t.clientX - e.left) / e.width * 2 - 1, this.mouse.y = -((t.clientY - e.top) / e.height) * 2 + 1, this.raycaster.setFromCamera(this.mouse, this.camera);
    const n = this.raycaster.intersectObjects(this.scene.children, !0);
    for (const r of n)
      if (r.object.isInstancedMesh && r.instanceId != null) {
        const l = r.object.parent, c = (i = l == null ? void 0 : l.userData) == null ? void 0 : i.sid, d = c ? this.groups.get(c) : void 0;
        if (!d) continue;
        const p = `${r.object.uuid}_${r.instanceId}`, m = d.lookup.get(p);
        if (m) {
          const g = d.palette[m.bid] ?? [128, 128, 128];
          (o = this.onBlockHover) == null || o.call(
            this,
            {
              blockId: m.bid,
              position: [m.x, m.y, m.z],
              color: g,
              schematicName: d.schematicName,
              schematicId: d.schematicId
            },
            t.clientX,
            t.clientY
          );
          return;
        }
      }
    (s = this.onBlockHover) == null || s.call(this, null, 0, 0);
  }
  isTyping() {
    var e, n;
    const t = (e = document.activeElement) == null ? void 0 : e.tagName;
    return t === "INPUT" || t === "TEXTAREA" || ((n = document.activeElement) == null ? void 0 : n.isContentEditable) === !0;
  }
  handleKeyDown(t) {
    if (this.isTyping()) return;
    const e = t.key.toLowerCase();
    U.VIEWER_KEYS.has(e) && (this.keys[e] = !0, e === " " && t.preventDefault());
  }
  handleKeyUp(t) {
    this.keys[t.key.toLowerCase()] = !1;
  }
  processKeys(t) {
    const e = jt * t, n = zt * t, i = new y.Vector3();
    this.camera.getWorldDirection(i);
    const o = new y.Vector3(0, 1, 0), s = new y.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0).normalize();
    let r = i.clone();
    r.y = 0, r.lengthSq() < 1e-3 && (r.set(-this.camera.matrixWorld.elements[8], 0, -this.camera.matrixWorld.elements[10]).normalize(), r.lengthSq() < 1e-3 && r.set(0, 0, -1)), r.normalize();
    const l = new y.Vector3().crossVectors(r, o).normalize(), c = this.keys;
    if (c.w && (this.controls.target.addScaledVector(r, e), this.camera.position.addScaledVector(r, e)), c.s && (this.controls.target.addScaledVector(r, -e), this.camera.position.addScaledVector(r, -e)), c.a && (this.controls.target.addScaledVector(l, -e), this.camera.position.addScaledVector(l, -e)), c.d && (this.controls.target.addScaledVector(l, e), this.camera.position.addScaledVector(l, e)), c.arrowup && (this.controls.target.addScaledVector(i, e), this.camera.position.addScaledVector(i, e)), c.arrowdown && (this.controls.target.addScaledVector(i, -e), this.camera.position.addScaledVector(i, -e)), c.arrowleft && (this.controls.target.addScaledVector(s, -e), this.camera.position.addScaledVector(s, -e)), c.arrowright && (this.controls.target.addScaledVector(s, e), this.camera.position.addScaledVector(s, e)), c[" "] && (this.camera.position.y += e, this.controls.target.y += e), c.q ? this.controls.autoRotateSpeed = -30 : c.e ? this.controls.autoRotateSpeed = 30 : this.controls.autoRotateSpeed = 0, this.controls.autoRotate = c.q || c.e || !1, c.r) {
      const m = this.camera.position.clone().sub(this.controls.target);
      m.applyAxisAngle(s, -n), this.camera.position.copy(this.controls.target).add(m);
    }
    if (c.f) {
      const m = this.camera.position.clone().sub(this.controls.target);
      m.applyAxisAngle(s, n), this.camera.position.copy(this.controls.target).add(m);
    }
    const d = this.camera.position.distanceTo(this.controls.target), p = {
      1: () => i.clone().negate(),
      2: () => i.clone(),
      3: () => s.clone().negate(),
      4: () => s.clone(),
      5: () => new y.Vector3(0, 1, 0),
      6: () => new y.Vector3(0, -1, 0)
    };
    for (const [m, g] of Object.entries(p))
      if (c[m]) {
        const x = this.controls.target.clone(), S = g().normalize();
        this.camera.position.copy(x).addScaledVector(S, d), this.camera.lookAt(x), this.controls.update(), c[m] = !1;
      }
    c[0] && this.initPos && this.initTarget && (this.camera.position.copy(this.initPos), this.controls.target.copy(this.initTarget), this.controls.update(), c[0] = !1);
  }
  startLoop() {
    let t = performance.now();
    const e = (n) => {
      this.animId = requestAnimationFrame(e), this.processKeys((n - t) / 1e3), t = n, this.controls.update(), this.renderer.render(this.scene, this.camera);
    };
    this.animId = requestAnimationFrame(e);
  }
};
U.VIEWER_KEYS = /* @__PURE__ */ new Set([
  "w",
  "a",
  "s",
  "d",
  "q",
  "e",
  "r",
  "f",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  " "
]);
let Z = U;
const _e = {
  "minecraft:stone": [125, 125, 125],
  "minecraft:granite": [153, 114, 99],
  "minecraft:diorite": [188, 182, 179],
  "minecraft:andesite": [136, 136, 136],
  "minecraft:deepslate": [80, 80, 82],
  "minecraft:cobblestone": [127, 127, 127],
  "minecraft:stone_bricks": [122, 121, 122],
  "minecraft:blackstone": [42, 36, 41],
  "minecraft:oak_planks": [162, 130, 78],
  "minecraft:spruce_planks": [115, 85, 49],
  "minecraft:birch_planks": [196, 179, 123],
  "minecraft:dark_oak_planks": [66, 43, 20],
  "minecraft:oak_log": [109, 85, 50],
  "minecraft:spruce_log": [58, 37, 16],
  "minecraft:white_wool": [234, 236, 236],
  "minecraft:light_gray_wool": [142, 142, 135],
  "minecraft:gray_wool": [63, 68, 72],
  "minecraft:black_wool": [21, 21, 26],
  "minecraft:brown_wool": [114, 72, 41],
  "minecraft:red_wool": [161, 39, 35],
  "minecraft:orange_wool": [241, 118, 20],
  "minecraft:yellow_wool": [249, 198, 40],
  "minecraft:green_wool": [84, 109, 28],
  "minecraft:blue_wool": [53, 57, 157],
  "minecraft:cyan_wool": [21, 138, 145],
  "minecraft:purple_wool": [122, 42, 173],
  "minecraft:white_terracotta": [210, 178, 161],
  "minecraft:blue_terracotta": [74, 60, 91],
  "minecraft:cyan_terracotta": [86, 91, 91],
  "minecraft:brown_terracotta": [77, 51, 36],
  "minecraft:red_terracotta": [143, 61, 47],
  "minecraft:glass": [175, 213, 219],
  "minecraft:white_stained_glass": [255, 255, 255],
  "minecraft:blue_stained_glass": [51, 76, 178],
  "minecraft:iron_block": [220, 220, 220],
  "minecraft:gold_block": [249, 236, 79],
  "minecraft:copper_block": [192, 107, 79],
  "minecraft:quartz_block": [236, 230, 223],
  "minecraft:prismarine": [99, 156, 131],
  "minecraft:sandstone": [216, 203, 155],
  "minecraft:red_sandstone": [186, 99, 29],
  "minecraft:bricks": [150, 97, 83],
  "minecraft:bookshelf": [162, 130, 78],
  "minecraft:dirt": [134, 96, 67],
  "minecraft:grass_block": [95, 159, 53],
  "minecraft:sand": [219, 207, 163],
  "minecraft:snow_block": [250, 253, 253],
  "minecraft:obsidian": [15, 11, 25],
  "minecraft:glowstone": [171, 131, 84],
  "minecraft:sea_lantern": [172, 199, 190],
  "minecraft:purpur_block": [170, 126, 170],
  "minecraft:purpur_pillar": [172, 131, 172],
  "minecraft:purple_terracotta": [118, 70, 86],
  "minecraft:magenta_terracotta": [149, 88, 109],
  "minecraft:purple_concrete": [100, 32, 156],
  "minecraft:purple_concrete_powder": [131, 55, 177],
  "minecraft:magenta_wool": [189, 68, 179],
  "minecraft:magenta_concrete": [169, 48, 159],
  "minecraft:amethyst_block": [133, 97, 191],
  "minecraft:pink_terracotta": [162, 78, 79],
  "minecraft:pink_concrete": [214, 101, 143],
  "minecraft:light_blue_wool": [58, 175, 217],
  "minecraft:light_blue_terracotta": [113, 109, 138],
  "minecraft:light_blue_concrete": [36, 137, 199],
  "minecraft:blue_concrete": [45, 47, 143],
  "minecraft:blue_ice": [116, 167, 253],
  "minecraft:smooth_sandstone": [223, 214, 170],
  "minecraft:end_stone": [219, 223, 158],
  "minecraft:end_stone_bricks": [219, 222, 159],
  "minecraft:bone_block": [229, 225, 207],
  "minecraft:white_concrete": [207, 213, 214],
  "minecraft:white_concrete_powder": [226, 227, 228],
  "minecraft:smooth_quartz": [235, 229, 222],
  "minecraft:calcite": [224, 224, 220],
  "minecraft:birch_log": [216, 215, 210],
  "minecraft:light_gray_concrete": [125, 125, 115],
  "minecraft:gray_concrete": [55, 58, 62],
  "minecraft:cyan_concrete": [21, 119, 136],
  "minecraft:clay": [160, 166, 179],
  "minecraft:lapis_block": [38, 67, 138],
  "minecraft:warped_planks": [43, 105, 99],
  "minecraft:stripped_oak_log": [177, 144, 86],
  "minecraft:stripped_birch_log": [196, 176, 118],
  "minecraft:stripped_spruce_log": [115, 89, 52],
  "minecraft:mushroom_stem": [203, 196, 185],
  "minecraft:brown_mushroom_block": [149, 112, 81],
  "minecraft:red_mushroom_block": [200, 47, 45],
  "minecraft:packed_mud": [142, 106, 79],
  "minecraft:mud_bricks": [137, 104, 75],
  "minecraft:bedrock": [85, 85, 85],
  "minecraft:water": [63, 118, 228],
  "minecraft:lava": [207, 92, 15],
  "minecraft:gravel": [131, 127, 126],
  "minecraft:gold_ore": [143, 140, 125],
  "minecraft:iron_ore": [136, 130, 127],
  "minecraft:coal_ore": [105, 105, 105],
  "minecraft:oak_leaves": [59, 122, 20],
  "minecraft:mossy_cobblestone": [110, 118, 94],
  "minecraft:netherrack": [97, 38, 38],
  "minecraft:nether_bricks": [44, 22, 26],
  "minecraft:red_nether_bricks": [69, 7, 9],
  "minecraft:crimson_planks": [101, 48, 70],
  "minecraft:acacia_planks": [168, 90, 50],
  "minecraft:jungle_planks": [160, 115, 80],
  "minecraft:mangrove_planks": [118, 54, 48],
  "minecraft:cherry_planks": [226, 178, 172],
  "minecraft:bamboo_planks": [194, 175, 85],
  "minecraft:tuff": [108, 109, 102],
  "minecraft:polished_deepslate": [72, 72, 73],
  "minecraft:deepslate_bricks": [70, 70, 71],
  "minecraft:deepslate_tiles": [54, 54, 55],
  "minecraft:mossy_stone_bricks": [115, 121, 105],
  "minecraft:cracked_stone_bricks": [118, 117, 118],
  "minecraft:polished_granite": [154, 107, 89],
  "minecraft:polished_diorite": [192, 193, 194],
  "minecraft:polished_andesite": [132, 135, 133],
  "minecraft:terracotta": [152, 94, 68],
  "minecraft:red_concrete": [142, 33, 33],
  "minecraft:orange_concrete": [224, 97, 1],
  "minecraft:yellow_concrete": [241, 175, 21],
  "minecraft:lime_concrete": [94, 169, 25],
  "minecraft:green_concrete": [73, 91, 36],
  "minecraft:black_concrete": [8, 10, 15],
  "minecraft:brown_concrete": [96, 60, 32],
  "minecraft:lime_wool": [112, 185, 26],
  "minecraft:pink_wool": [238, 141, 172],
  "minecraft:light_gray_terracotta": [135, 107, 98],
  "minecraft:gray_terracotta": [57, 42, 36],
  "minecraft:orange_terracotta": [162, 84, 38],
  "minecraft:yellow_terracotta": [186, 133, 35],
  "minecraft:lime_terracotta": [104, 118, 53],
  "minecraft:green_terracotta": [76, 83, 42],
  "minecraft:black_terracotta": [37, 23, 16]
}, be = [128, 128, 128];
function ge(a) {
  return _e[a] ?? be;
}
function X(a) {
  const t = {};
  for (const e of a)
    t[e] = ge(e);
  return t;
}
let $ = null;
async function ye() {
  if (!$) {
    const a = await import("./nbt-C0tfxqsY.js").then((t) => t.n);
    $ = a.default ?? a;
  }
  return $;
}
async function we(a) {
  const t = await ye(), { parsed: e } = await t.parse(new Uint8Array(a));
  return t.simplify(e);
}
const xe = {
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
  206: "minecraft:end_stone_bricks"
};
function ke(a) {
  const t = a.Width ?? 0, e = a.Height ?? 0, n = a.Length ?? 0, i = a.Blocks ?? [], o = [];
  let s = 0;
  for (let l = 0; l < e; l++)
    for (let c = 0; c < n; c++)
      for (let d = 0; d < t && !(s >= i.length); d++) {
        const p = i[s++];
        if (p === 0) continue;
        const m = xe[p] ?? `minecraft:unknown_${p}`;
        o.push([d, l, c, m]);
      }
  const r = new Set(o.map((l) => l[3]));
  return { blocks: o, palette: X(r) };
}
function ve(a, t) {
  let e = 0, n = 0, i = t;
  for (; i < a.length; ) {
    const o = a[i];
    if (e |= (o & 127) << n, i++, (o & 128) === 0) break;
    n += 7;
  }
  return [e, i - t];
}
function Ee(a) {
  var p, m;
  let t = a;
  t.Schematic && (t = t.Schematic);
  const e = t.Width ?? 0, n = t.Height ?? 0, i = t.Length ?? 0;
  let o, s;
  (p = t.Blocks) != null && p.Palette && ((m = t.Blocks) != null && m.Data) ? (o = t.Blocks.Palette, s = t.Blocks.Data) : (o = t.Palette ?? {}, s = t.BlockData ?? []);
  const r = /* @__PURE__ */ new Map();
  for (const [g, x] of Object.entries(o)) {
    const P = (g.startsWith("minecraft:") ? g : `minecraft:${g}`).split("[")[0];
    r.set(Number(x), P);
  }
  const l = [];
  let c = 0;
  for (let g = 0; g < n; g++)
    for (let x = 0; x < i; x++)
      for (let S = 0; S < e && !(c >= s.length); S++) {
        const [P, M] = ve(s, c);
        c += M;
        const R = r.get(P) ?? `minecraft:unknown_${P}`;
        R !== "minecraft:air" && l.push([S, g, x, R]);
      }
  const d = new Set(l.map((g) => g[3]));
  return { blocks: l, palette: X(d) };
}
function Se(a) {
  var i, o, s, r, l, c;
  const t = a.Regions ?? {}, e = [];
  for (const d of Object.values(t)) {
    const p = d.BlockStatePalette ?? [];
    if (p.length === 0) continue;
    const m = Math.abs(((i = d.Size) == null ? void 0 : i.x) ?? 0), g = Math.abs(((o = d.Size) == null ? void 0 : o.y) ?? 0), x = Math.abs(((s = d.Size) == null ? void 0 : s.z) ?? 0);
    if (m * g * x === 0) continue;
    const P = ((r = d.Position) == null ? void 0 : r.x) ?? 0, M = ((l = d.Position) == null ? void 0 : l.y) ?? 0, R = ((c = d.Position) == null ? void 0 : c.z) ?? 0, j = Math.max(2, Math.ceil(Math.log2(p.length))), ht = (1 << j) - 1, q = d.BlockStates ?? [];
    if (q.length === 0) continue;
    const O = q.map((C) => BigInt(C));
    let F = 0;
    for (let C = 0; C < g; C++)
      for (let H = 0; H < x; H++)
        for (let Y = 0; Y < m; Y++) {
          const A = Math.floor(F / 64), z = F % 64;
          if (F += j, A >= O.length) continue;
          let I;
          if (z + j <= 64)
            I = Number(O[A] >> BigInt(z) & BigInt(ht));
          else {
            const V = 64 - z, dt = Number(O[A] >> BigInt(z) & BigInt((1 << V) - 1)), mt = A + 1 < O.length ? Number(O[A + 1] & BigInt((1 << j - V) - 1)) : 0;
            I = dt | mt << V;
          }
          if (I >= p.length) continue;
          const N = p[I], G = (N == null ? void 0 : N.Name) ?? N ?? "minecraft:air";
          G !== "minecraft:air" && e.push([Y + P, C + M, H + R, G]);
        }
  }
  const n = new Set(e.map((d) => d[3]));
  return { blocks: e, palette: X(n) };
}
function De(a) {
  var e;
  if (a.Regions)
    return Se(a);
  let t = a;
  if (t.Schematic && (t = t.Schematic), (e = t.Blocks) != null && e.Palette || t.Palette)
    return Ee(a);
  if (t.Blocks && typeof t.Width == "number")
    return ke(a);
  throw new Error("Unrecognized NBT schematic format");
}
const lt = [".schematic", ".schem", ".litematic", ".json"];
async function Pe(a) {
  var e;
  const t = "." + (((e = a.name.split(".").pop()) == null ? void 0 : e.toLowerCase()) ?? "");
  if (t === ".json") {
    const n = await a.text(), i = JSON.parse(n);
    if (i.blocks && i.palette) return i;
    throw new Error("JSON file must contain 'blocks' and 'palette' keys");
  }
  if (t === ".schematic" || t === ".schem" || t === ".litematic") {
    const n = await a.arrayBuffer(), i = await we(n);
    return De(i);
  }
  throw new Error(`Unsupported file format: ${t}. Supported: ${lt.join(", ")}`);
}
const Me = `
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
function Te() {
  if (document.getElementById("csv-styles")) return;
  const a = document.createElement("style");
  a.id = "csv-styles", a.textContent = Me, document.head.appendChild(a);
}
function Le(a, t) {
  a.innerHTML = "";
  const e = document.createElement("div");
  e.className = "csv-root";
  const n = document.createElement("div");
  n.className = "csv-canvas-wrap", e.appendChild(n);
  let i = null;
  t.gallery && (i = document.createElement("div"), i.className = "csv-gallery", e.appendChild(i));
  let o = null;
  t.infoBar && (o = document.createElement("div"), o.className = "csv-info", e.appendChild(o));
  const s = document.createElement("div");
  s.className = "csv-tooltip", document.body.appendChild(s);
  let r = null;
  t.dragDrop && (r = document.createElement("div"), r.className = "csv-drop-overlay", r.innerHTML = "<span>Drop to add schematics</span>", e.appendChild(r));
  const l = document.createElement("div");
  l.className = "csv-add-bar";
  const c = document.createElement("label");
  c.className = "csv-add-btn", c.textContent = "+ Add";
  const d = document.createElement("input");
  d.type = "file", d.multiple = !0, d.accept = ".litematic,.schematic,.schem,.json", d.className = "csv-add-input", c.appendChild(d), l.appendChild(c);
  const p = document.createElement("button");
  return p.className = "csv-add-btn", p.textContent = "Clear", l.appendChild(p), e.appendChild(l), a.appendChild(e), { root: e, canvasWrap: n, galleryEl: i, infoEl: o, tooltip: s, dropOverlay: r, addInput: d, clearBtn: p };
}
function Oe(a, t, e, n) {
  a.innerHTML = "";
  for (const i of t) {
    const o = document.createElement("div");
    o.className = "csv-gallery-item" + (i.visible ? "" : " hidden-item"), o.innerHTML = `
      <div class="csv-gi-color" style="background:${i.color}"></div>
      <div class="csv-gi-info">
        <div class="csv-gi-name" title="${i.name}">${i.name}</div>
        <div class="csv-gi-meta">${i.blockCount.toLocaleString()} blocks · ${i.typeCount} types</div>
      </div>
      <div class="csv-gi-actions">
        <button class="csv-gi-btn vis ${i.visible ? "" : "off"}" data-id="${i.id}" title="Toggle visibility">${i.visible ? "●" : "○"}</button>
        <button class="csv-gi-btn del" data-id="${i.id}" title="Remove">×</button>
      </div>
    `, a.appendChild(o);
  }
  a.querySelectorAll(".vis").forEach((i) => {
    i.addEventListener("click", () => e(i.dataset.id));
  }), a.querySelectorAll(".del").forEach((i) => {
    i.addEventListener("click", () => n(i.dataset.id));
  });
}
function Ce(a, t) {
  const e = t.filter((o) => o.visible), n = e.reduce((o, s) => o + s.blockCount, 0), i = new Set(e.flatMap((o) => Object.keys(o.data.palette)));
  if (t.length === 0) {
    a.classList.remove("visible");
    return;
  }
  a.textContent = `${t.length} schematic${t.length > 1 ? "s" : ""} · ${n.toLocaleString()} blocks · ${i.size} types`, a.classList.add("visible");
}
function Ae(a, t, e, n) {
  const i = t.blockId.replace("minecraft:", "");
  a.innerHTML = `
    <div class="bt-name">${i}</div>
    <div class="bt-row">
      <div class="bt-swatch" style="background:rgb(${t.color.join(",")})"></div>
      <span class="bt-pos">${t.position.join(", ")}</span>
    </div>
    <div class="bt-schem">${t.schematicName}</div>
  `, a.style.left = e + "px", a.style.top = n + "px", a.classList.add("visible");
}
function Re(a) {
  a.classList.remove("visible");
}
class ze extends bt {
  constructor(t) {
    super(), this.entries = /* @__PURE__ */ new Map(), this.colorIdx = 0, this.config = {
      container: t.container,
      background: t.background ?? "#090b0c",
      gallery: t.gallery ?? !0,
      controls: t.controls ?? !0,
      tooltip: t.tooltip ?? !0,
      infoBar: t.infoBar ?? !0,
      dragDrop: t.dragDrop ?? !0,
      fov: t.fov ?? 60,
      maxPixelRatio: t.maxPixelRatio ?? 2
    }, Te(), this.dom = Le(this.config.container, {
      gallery: this.config.gallery,
      controls: this.config.controls,
      infoBar: this.config.infoBar,
      dragDrop: this.config.dragDrop
    }), this.scene = new Z({
      container: this.dom.canvasWrap,
      background: this.config.background,
      fov: this.config.fov,
      maxPixelRatio: this.config.maxPixelRatio,
      onBlockHover: this.config.tooltip ? (e, n, i) => {
        e ? (Ae(this.dom.tooltip, e, n, i), this.emit("block:hover", e)) : (Re(this.dom.tooltip), this.emit("block:hover", null));
      } : void 0
    }), this.setupDragDrop(), this.setupAddButton(), this.emit("ready");
  }
  /** Load a schematic into the viewer. */
  addSchematic(t, e, n) {
    const i = n ?? crypto.randomUUID().slice(0, 8), o = it[this.colorIdx % it.length];
    this.colorIdx++;
    const s = {
      id: i,
      name: t,
      data: e,
      visible: !0,
      color: o,
      blockCount: e.blocks.length,
      typeCount: Object.keys(e.palette).length
    };
    return this.entries.set(i, s), this.scene.addSchematic(i, t, e), this.refresh(), this.emit("schematic:add", s), s;
  }
  /** Remove a schematic from the viewer. */
  removeSchematic(t) {
    this.entries.has(t) && (this.entries.delete(t), this.scene.removeSchematic(t), this.refresh(), this.emit("schematic:remove", t));
  }
  /** Toggle visibility of a schematic. */
  toggleSchematic(t) {
    const e = this.entries.get(t);
    e && (e.visible = !e.visible, this.scene.setSchematicVisible(t, e.visible), this.refresh(), this.emit("schematic:toggle", t, e.visible));
  }
  /** Set visibility of a specific schematic. */
  setSchematicVisible(t, e) {
    const n = this.entries.get(t);
    !n || n.visible === e || (n.visible = e, this.scene.setSchematicVisible(t, e), this.refresh(), this.emit("schematic:toggle", t, e));
  }
  /** Remove all loaded schematics. */
  clear() {
    for (const t of [...this.entries.keys()])
      this.removeSchematic(t);
    this.colorIdx = 0;
  }
  /** Get all loaded schematic entries. */
  getSchematics() {
    return [...this.entries.values()];
  }
  /** Get a schematic entry by ID. */
  getSchematic(t) {
    return this.entries.get(t);
  }
  /** Focus camera to fit all visible schematics. */
  fitCamera() {
    this.scene.fitCamera();
  }
  /** Destroy the viewer and clean up all resources. */
  destroy() {
    this.scene.destroy(), this.dom.tooltip.remove(), this.config.container.innerHTML = "", this.removeAllListeners(), this.entries.clear();
  }
  /**
   * Load schematic data from a URL.
   * Supports .json (blocks.json format) and binary formats
   * (.schematic, .schem, .litematic) by inspecting the URL extension.
   */
  async loadFromURL(t, e) {
    var s;
    const n = await fetch(e);
    if (!n.ok) throw new Error(`Failed to fetch ${e}: ${n.status}`);
    const i = (s = e.split(/[?#]/)[0].split(".").pop()) == null ? void 0 : s.toLowerCase();
    if (i && i !== "json" && lt.includes(`.${i}`)) {
      const r = await n.blob(), l = new File([r], `${t}.${i}`);
      return this.loadFromFile(l);
    }
    const o = await n.json();
    return this.addSchematic(t, o);
  }
  /**
   * Load a schematic from a File object.
   * Supports .schematic, .schem, .litematic (parsed client-side via NBT)
   * and .json (blocks.json format).
   */
  async loadFromFile(t) {
    const e = await Pe(t), n = t.name.replace(/\.[^.]+$/, "");
    return this.addSchematic(n, e);
  }
  refresh() {
    const t = this.getSchematics();
    this.dom.galleryEl && Oe(
      this.dom.galleryEl,
      t,
      (e) => this.toggleSchematic(e),
      (e) => this.removeSchematic(e)
    ), this.dom.infoEl && Ce(this.dom.infoEl, t);
  }
  setupDragDrop() {
    if (!this.config.dragDrop || !this.dom.dropOverlay) return;
    const t = this.dom.dropOverlay;
    let e = 0;
    this.dom.root.addEventListener("dragenter", (n) => {
      n.preventDefault(), e++, t.classList.add("visible");
    }), this.dom.root.addEventListener("dragleave", () => {
      e--, e <= 0 && (e = 0, t.classList.remove("visible"));
    }), this.dom.root.addEventListener("dragover", (n) => n.preventDefault()), this.dom.root.addEventListener("drop", async (n) => {
      var o;
      n.preventDefault(), e = 0, t.classList.remove("visible");
      const i = (o = n.dataTransfer) == null ? void 0 : o.files;
      if (i)
        for (const s of Array.from(i))
          try {
            await this.loadFromFile(s);
          } catch (r) {
            console.error(`Failed to load ${s.name}:`, r);
          }
    });
  }
  setupAddButton() {
    this.dom.addInput.addEventListener("change", async () => {
      const t = this.dom.addInput.files;
      if (t)
        for (const e of Array.from(t))
          try {
            await this.loadFromFile(e);
          } catch (n) {
            console.error(`Failed to load ${e.name}:`, n);
          }
      this.dom.addInput.value = "";
    }), this.dom.clearBtn.addEventListener("click", () => this.clear());
  }
}
export {
  lt as SUPPORTED_EXTENSIONS,
  ze as SchemaViewer,
  Pe as parseFile
};
