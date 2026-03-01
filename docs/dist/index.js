import * as _ from "three";
import { Controls as ut, Vector3 as D, MOUSE as C, TOUCH as O, Quaternion as et, Spherical as it, Vector2 as S, Ray as _t, Plane as bt, MathUtils as gt } from "three";
class yt {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    return this.listeners.has(t) || this.listeners.set(t, /* @__PURE__ */ new Set()), this.listeners.get(t).add(e), () => this.off(t, e);
  }
  off(t, e) {
    var o;
    (o = this.listeners.get(t)) == null || o.delete(e);
  }
  emit(t, ...e) {
    var o;
    (o = this.listeners.get(t)) == null || o.forEach((i) => i(...e));
  }
  removeAllListeners() {
    this.listeners.clear();
  }
}
const ot = { type: "change" }, G = { type: "start" }, lt = { type: "end" }, F = new _t(), st = new bt(), wt = Math.cos(70 * gt.DEG2RAD), w = new D(), v = 2 * Math.PI, b = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, W = 1e-6;
class kt extends ut {
  constructor(t, e = null) {
    super(t, e), this.state = b.NONE, this.enabled = !0, this.target = new D(), this.cursor = new D(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: C.ROTATE, MIDDLE: C.DOLLY, RIGHT: C.PAN }, this.touches = { ONE: O.ROTATE, TWO: O.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new D(), this._lastQuaternion = new et(), this._lastTargetPosition = new D(), this._quat = new et().setFromUnitVectors(t.up, new D(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new it(), this._sphericalDelta = new it(), this._scale = 1, this._panOffset = new D(), this._rotateStart = new S(), this._rotateEnd = new S(), this._rotateDelta = new S(), this._panStart = new S(), this._panEnd = new S(), this._panDelta = new S(), this._dollyStart = new S(), this._dollyEnd = new S(), this._dollyDelta = new S(), this._dollyDirection = new D(), this._mouse = new S(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = xt.bind(this), this._onPointerDown = vt.bind(this), this._onPointerUp = Et.bind(this), this._onContextMenu = Ot.bind(this), this._onMouseWheel = Dt.bind(this), this._onKeyDown = Pt.bind(this), this._onTouchStart = Tt.bind(this), this._onTouchMove = Lt.bind(this), this._onMouseDown = St.bind(this), this._onMouseMove = Mt.bind(this), this._interceptControlDown = Ct.bind(this), this._interceptControlUp = At.bind(this), this.domElement !== null && this.connect(), this.update();
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
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(ot), this.update(), this.state = b.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    w.copy(e).sub(this.target), w.applyQuaternion(this._quat), this._spherical.setFromVector3(w), this.autoRotate && this.state === b.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let o = this.minAzimuthAngle, i = this.maxAzimuthAngle;
    isFinite(o) && isFinite(i) && (o < -Math.PI ? o += v : o > Math.PI && (o -= v), i < -Math.PI ? i += v : i > Math.PI && (i -= v), o <= i ? this._spherical.theta = Math.max(o, Math.min(i, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (o + i) / 2 ? Math.max(o, this._spherical.theta) : Math.min(i, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let n = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const a = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), n = a != this._spherical.radius;
    }
    if (w.setFromSpherical(this._spherical), w.applyQuaternion(this._quatInverse), e.copy(this.target).add(w), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let a = null;
      if (this.object.isPerspectiveCamera) {
        const r = w.length();
        a = this._clampDistance(r * this._scale);
        const l = r - a;
        this.object.position.addScaledVector(this._dollyDirection, l), this.object.updateMatrixWorld(), n = !!l;
      } else if (this.object.isOrthographicCamera) {
        const r = new D(this._mouse.x, this._mouse.y, 0);
        r.unproject(this.object);
        const l = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), n = l !== this.object.zoom;
        const c = new D(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(r), this.object.updateMatrixWorld(), a = w.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      a !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position) : (F.origin.copy(this.object.position), F.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(F.direction)) < wt ? this.object.lookAt(this.target) : (st.setFromNormalAndCoplanarPoint(this.object.up, this.target), F.intersectPlane(st, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const a = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), a !== this.object.zoom && (this.object.updateProjectionMatrix(), n = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, n || this._lastPosition.distanceToSquared(this.object.position) > W || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > W || this._lastTargetPosition.distanceToSquared(this.target) > W ? (this.dispatchEvent(ot), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
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
    w.setFromMatrixColumn(e, 0), w.multiplyScalar(-t), this._panOffset.add(w);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? w.setFromMatrixColumn(e, 1) : (w.setFromMatrixColumn(e, 0), w.crossVectors(this.object.up, w)), w.multiplyScalar(t), this._panOffset.add(w);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const o = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const i = this.object.position;
      w.copy(i).sub(this.target);
      let n = w.length();
      n *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * n / o.clientHeight, this.object.matrix), this._panUp(2 * e * n / o.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / o.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / o.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
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
    const o = this.domElement.getBoundingClientRect(), i = t - o.left, n = e - o.top, a = o.width, r = o.height;
    this._mouse.x = i / a * 2 - 1, this._mouse.y = -(n / r) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
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
      const e = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(o, i);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._panStart.set(o, i);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), o = t.pageX - e.x, i = t.pageY - e.y, n = Math.sqrt(o * o + i * i);
    this._dollyStart.set(0, n);
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
      const o = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + o.x), n = 0.5 * (t.pageY + o.y);
      this._rotateEnd.set(i, n);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(v * this._rotateDelta.x / e.clientHeight), this._rotateUp(v * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + e.x), i = 0.5 * (t.pageY + e.y);
      this._panEnd.set(o, i);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), o = t.pageX - e.x, i = t.pageY - e.y, n = Math.sqrt(o * o + i * i);
    this._dollyEnd.set(0, n), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const a = (t.pageX + e.x) * 0.5, r = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(a, r);
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
    e === void 0 && (e = new S(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, o = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        o.deltaY *= 16;
        break;
      case 2:
        o.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (o.deltaY *= 10), o;
  }
}
function vt(s) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(s.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(s) && (this._addPointer(s), s.pointerType === "touch" ? this._onTouchStart(s) : this._onMouseDown(s)));
}
function xt(s) {
  this.enabled !== !1 && (s.pointerType === "touch" ? this._onTouchMove(s) : this._onMouseMove(s));
}
function Et(s) {
  switch (this._removePointer(s), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(s.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(lt), this.state = b.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function St(s) {
  let t;
  switch (s.button) {
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
    case C.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(s), this.state = b.DOLLY;
      break;
    case C.ROTATE:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = b.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = b.ROTATE;
      }
      break;
    case C.PAN:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = b.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = b.PAN;
      }
      break;
    default:
      this.state = b.NONE;
  }
  this.state !== b.NONE && this.dispatchEvent(G);
}
function Mt(s) {
  switch (this.state) {
    case b.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(s);
      break;
    case b.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(s);
      break;
    case b.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(s);
      break;
  }
}
function Dt(s) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== b.NONE || (s.preventDefault(), this.dispatchEvent(G), this._handleMouseWheel(this._customWheelEvent(s)), this.dispatchEvent(lt));
}
function Pt(s) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(s);
}
function Tt(s) {
  switch (this._trackPointer(s), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case O.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(s), this.state = b.TOUCH_ROTATE;
          break;
        case O.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(s), this.state = b.TOUCH_PAN;
          break;
        default:
          this.state = b.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case O.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(s), this.state = b.TOUCH_DOLLY_PAN;
          break;
        case O.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(s), this.state = b.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = b.NONE;
      }
      break;
    default:
      this.state = b.NONE;
  }
  this.state !== b.NONE && this.dispatchEvent(G);
}
function Lt(s) {
  switch (this._trackPointer(s), this.state) {
    case b.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(s), this.update();
      break;
    case b.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(s), this.update();
      break;
    case b.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(s), this.update();
      break;
    case b.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(s), this.update();
      break;
    default:
      this.state = b.NONE;
  }
}
function Ot(s) {
  this.enabled !== !1 && s.preventDefault();
}
function Ct(s) {
  s.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function At(s) {
  s.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
const nt = [
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
], Rt = "#090b0c", jt = 60, zt = 2, It = 40, Nt = 1.5, h = 16;
function f(s) {
  return Math.max(0, Math.min(255, Math.round(s)));
}
function k(s, t, e) {
  const o = (e() - 0.5) * 2 * t;
  return [f(s[0] + o), f(s[1] + o), f(s[2] + o)];
}
function V(s, t, e) {
  return [
    f(s[0] + (e() - 0.5) * 2 * t),
    f(s[1] + (e() - 0.5) * 2 * t),
    f(s[2] + (e() - 0.5) * 2 * t)
  ];
}
function x(s, t) {
  return [f(s[0] * t), f(s[1] * t), f(s[2] * t)];
}
function T(s, t) {
  return [
    f(s[0] + (255 - s[0]) * t),
    f(s[1] + (255 - s[1]) * t),
    f(s[2] + (255 - s[2]) * t)
  ];
}
function ht(s) {
  let t = s;
  return () => (t = t * 1664525 + 1013904223 & 4294967295, (t >>> 0) / 4294967295);
}
function m(s, t, e, o) {
  const i = (e * h + t) * 4;
  s[i] = o[0], s[i + 1] = o[1], s[i + 2] = o[2], s[i + 3] = 255;
}
function E(s, t, e, o) {
  for (let i = 0; i < h; i++)
    for (let n = 0; n < h; n++)
      m(s, n, i, k(t, e, o));
}
const Bt = (s, t, e) => {
  E(s, t, 12, e);
  for (let o = 0; o < 20; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, x(t, 0.8 + e() * 0.15));
  }
}, Ut = (s, t, e) => {
  for (let i = 0; i < h; i++) {
    const n = Math.floor(i / 4), a = k(t, 8, ht(n * 137)), r = i % 4 === 0;
    for (let l = 0; l < h; l++)
      r ? m(s, l, i, x(a, 0.7)) : m(s, l, i, V(a, 6, e));
  }
}, Ft = (s, t, e) => {
  const o = x(t, 0.75);
  for (let i = 0; i < h; i++)
    for (let n = 0; n < h; n++) {
      const r = i % 4 === 0 || i % 4 === 1 ? k(o, 6, e) : k(t, 8, e);
      m(s, n, i, r);
    }
}, Yt = (s, t, e) => {
  const o = [150, 140, 135];
  for (let i = 0; i < h; i++) {
    const n = Math.floor(i / 4), a = i % 4 === 0, r = n % 2 === 0 ? 0 : 8;
    for (let l = 0; l < h; l++) {
      const c = (l + r) % 8 === 0;
      a || c ? m(s, l, i, k(o, 5, e)) : m(s, l, i, V(t, 8, e));
    }
  }
}, at = (s, t, e) => {
  const o = x(t, 0.65);
  for (let i = 0; i < h; i++) {
    const n = Math.floor(i / 4), a = i % 4 === 0, r = n % 2 === 0 ? 0 : 8;
    for (let l = 0; l < h; l++) {
      const c = (l + r) % 8 === 0;
      a || c ? m(s, l, i, k(o, 4, e)) : m(s, l, i, k(t, 8, e));
    }
  }
}, Vt = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const n = (i + o) % 2 === 0 ? 4 : -4, a = [
        f(t[0] + n + (e() - 0.5) * 6),
        f(t[1] + n + (e() - 0.5) * 6),
        f(t[2] + n + (e() - 0.5) * 6)
      ];
      m(s, i, o, a);
    }
}, Ht = (s, t, e) => {
  E(s, t, 3, e);
}, Kt = (s, t, e) => {
  E(s, t, 6, e);
  for (let o = 0; o < 8; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, T(t, 0.1));
  }
}, $t = (s, t, e) => {
  const o = x(t, 0.7);
  for (let i = 0; i < h; i++)
    for (let n = 0; n < h; n++)
      n === 0 || i === 0 || n === 15 || i === 15 ? m(s, n, i, o) : n === 1 || i === 1 ? m(s, n, i, T(t, 0.3)) : m(s, n, i, k(t, 3, e));
}, Zt = (s, t, e) => {
  E(s, [125, 125, 125], 10, e);
  const i = t;
  for (let n = 0; n < 6; n++) {
    const a = 3 + Math.floor(e() * 10), r = 3 + Math.floor(e() * 10);
    for (let l = -1; l <= 1; l++)
      for (let c = -1; c <= 1; c++)
        if (e() > 0.4) {
          const d = (a + c + h) % h, p = (r + l + h) % h;
          m(s, d, p, k(i, 10, e));
        }
  }
}, Wt = (s, t, e) => {
  E(s, t, 14, e);
  for (let o = 0; o < 12; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, x(t, 0.8));
  }
}, Xt = (s, t, e) => {
  for (let o = 0; o < h; o++) {
    const i = o / h, n = [134, 96, 67], a = [
      f(t[0] * (1 - i * 0.6) + n[0] * i * 0.6),
      f(t[1] * (1 - i * 0.6) + n[1] * i * 0.6),
      f(t[2] * (1 - i * 0.6) + n[2] * i * 0.6)
    ];
    for (let r = 0; r < h; r++)
      m(s, r, o, V(a, 10, e));
  }
}, rt = (s, t, e) => {
  E(s, t, 8, e);
  for (let o = 0; o < 10; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, x(t, 0.9));
  }
}, qt = (s, t, e) => {
  for (let o = 0; o < h; o++) {
    const i = o < 4 ? T(t, 0.08) : o < 12 ? t : x(t, 0.9);
    for (let n = 0; n < h; n++)
      m(s, n, o, k(i, 5, e));
  }
}, Gt = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++)
      e() < 0.25 ? m(s, i, o, x(t, 0.6 + e() * 0.2)) : m(s, i, o, V(t, 14, e));
}, Qt = (s, t, e) => {
  for (let o = 0; o < h; o++) {
    const i = o % 4 < 2 ? T(t, 0.06) : x(t, 0.95);
    for (let n = 0; n < h; n++)
      m(s, n, o, k(i, 4, e));
  }
}, Jt = (s, t, e) => {
  E(s, t, 4, e);
}, te = (s, t, e) => {
  E(s, t, 6, e);
  for (let o = 0; o < 10; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, [f(t[0] + 20 + e() * 20), f(t[1] + 5), f(t[2] + 30 + e() * 15)]);
  }
}, ee = (s, t, e) => {
  E(s, t, 10, e);
  for (let o = 0; o < 15; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, T(t, 0.15 + e() * 0.1));
  }
}, ie = (s, t, e) => {
  const o = t, i = [
    [160, 50, 40],
    [50, 80, 50],
    [40, 50, 120],
    [130, 100, 30],
    [100, 40, 100],
    [60, 100, 100],
    [150, 80, 50],
    [80, 60, 110]
  ];
  for (let n = 0; n < h; n++) {
    const a = n === 0 || n === 5 || n === 10 || n === 15;
    for (let r = 0; r < h; r++)
      if (a)
        m(s, r, n, k(o, 6, e));
      else {
        const l = Math.floor(n / 5), c = (r * 3 + l) % i.length;
        m(s, r, n, k(i[c], 10, e));
      }
  }
}, oe = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const n = e() < 0.3 ? [0, 15, 10] : e() < 0.5 ? [0, -10, -5] : [0, 0, 0], a = [
        f(t[0] + n[0] + (e() - 0.5) * 10),
        f(t[1] + n[1] + (e() - 0.5) * 10),
        f(t[2] + n[2] + (e() - 0.5) * 10)
      ];
      m(s, i, o, a);
    }
}, se = (s, t, e) => {
  E(s, t, 8, e);
  for (let o = 0; o < 5; o++) {
    const i = 2 + Math.floor(e() * 12), n = 2 + Math.floor(e() * 12), a = 1 + Math.floor(e() * 2), r = e() > 0.5 ? x(t, 0.82) : T(t, 0.08);
    for (let l = -a; l <= a; l++)
      for (let c = -a; c <= a; c++)
        if (c * c + l * l <= a * a + 1) {
          const d = (i + c + h) % h, p = (n + l + h) % h;
          m(s, d, p, k(r, 4, e));
        }
  }
}, ne = (s, t, e) => {
  E(s, t, 3, e);
  for (let o = 0; o < 6; o++) {
    const i = Math.floor(e() * h), n = Math.floor(e() * h);
    m(s, i, n, x(t, 0.92));
  }
}, ae = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const a = (i + o * 2) % 6 < 2 ? x(t, 0.88) : k(t, 6, e);
      m(s, i, o, a);
    }
}, re = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const n = Math.sin((i + o * 0.5) * 0.8) * 12, a = [
        f(t[0] + n + (e() - 0.5) * 8),
        f(t[1] + n + (e() - 0.5) * 8),
        f(t[2] + n * 0.5 + (e() - 0.5) * 6)
      ];
      m(s, i, o, a);
    }
}, ce = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const n = Math.sin(i * 0.6) * Math.cos(o * 0.4) * 25, a = [
        f(t[0] + n + (e() - 0.5) * 15),
        f(t[1] + n * 0.6 + (e() - 0.5) * 15),
        f(t[2] + (e() - 0.5) * 8)
      ];
      m(s, i, o, a);
    }
}, le = (s, t, e) => {
  for (let o = 0; o < h; o++)
    for (let i = 0; i < h; i++) {
      const a = e() < 0.2 ? T(t, 0.3 + e() * 0.2) : k(t, 12, e);
      m(s, i, o, a);
    }
}, he = (s, t, e) => {
  E(s, t, 8, e);
};
function de(s) {
  const t = s.replace("minecraft:", "");
  return t.includes("planks") ? Ut : t.includes("_log") || t.includes("_wood") ? Ft : t.includes("stone_brick") || t.includes("deepslate_brick") || t.includes("deepslate_tile") || t.includes("nether_brick") || t.includes("end_stone_brick") || t.includes("mud_brick") ? at : t === "bricks" || t.includes("brick") ? Yt : t.includes("cobblestone") || t === "gravel" ? se : t.includes("wool") ? Vt : t.includes("concrete_powder") ? rt : t.includes("concrete") ? Ht : t.includes("terracotta") ? Kt : t.includes("glass") ? $t : t.includes("ore") ? Zt : t.includes("leaves") ? Gt : t.includes("sandstone") ? qt : t === "minecraft:sand" || t === "sand" ? rt : t.includes("dirt") || t === "clay" || t.includes("mud") || t.includes("packed_mud") ? Wt : t.includes("grass_block") ? Xt : t.includes("snow") ? Jt : t === "obsidian" || t.includes("obsidian") ? te : t.includes("nether") || t.includes("soul") ? ee : t.includes("iron") || t.includes("gold") || t.includes("copper") || t.includes("diamond") || t.includes("emerald") || t.includes("lapis") ? Qt : t.includes("quartz") || t.includes("calcite") || t.includes("bone") ? ne : t.includes("deepslate") || t.includes("blackstone") ? ae : t.includes("prismarine") ? oe : t === "bookshelf" ? ie : t === "water" ? re : t === "lava" ? ce : t.includes("glowstone") || t.includes("sea_lantern") || t.includes("shroomlight") ? le : t.includes("purpur") ? at : t.includes("stone") || t.includes("andesite") || t.includes("diorite") || t.includes("granite") || t.includes("tuff") || t.includes("bedrock") ? Bt : he;
}
const ct = /* @__PURE__ */ new Map();
function me(s, t) {
  const e = `${s}_${t[0]}_${t[1]}_${t[2]}`, o = ct.get(e);
  if (o) return o;
  const i = document.createElement("canvas");
  i.width = h, i.height = h;
  const n = i.getContext("2d"), a = n.createImageData(h, h);
  let r = 0;
  for (let p = 0; p < s.length; p++)
    r = (r << 5) - r + s.charCodeAt(p) | 0;
  const l = ht(Math.abs(r));
  de(s)(a.data, t, l), n.putImageData(a, 0, 0);
  const d = new _.CanvasTexture(i);
  return d.magFilter = _.NearestFilter, d.minFilter = _.NearestFilter, d.colorSpace = _.SRGBColorSpace, ct.set(e, d), d;
}
const Y = class Y {
  constructor(t) {
    this.animId = 0, this.groups = /* @__PURE__ */ new Map(), this.raycaster = new _.Raycaster(), this.mouse = new _.Vector2(), this.keys = {}, this.container = t.container, this.onBlockHover = t.onBlockHover;
    const e = t.background ?? Rt, o = t.fov ?? jt, i = t.maxPixelRatio ?? zt, n = this.container.clientWidth, a = this.container.clientHeight;
    this.scene = new _.Scene(), this.scene.background = new _.Color(e), this.camera = new _.PerspectiveCamera(o, n / a, 0.1, 5e3), this.renderer = new _.WebGLRenderer({ antialias: !0 }), this.renderer.setSize(n, a), this.renderer.setPixelRatio(Math.min(devicePixelRatio, i)), this.container.appendChild(this.renderer.domElement), this.controls = new kt(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.08, this.controls.rotateSpeed = 0.8, this.controls.minDistance = 1, this.controls.maxDistance = 5e3, this.scene.add(new _.AmbientLight(16777215, 0.5));
    const r = new _.DirectionalLight(16777215, 0.9);
    r.position.set(1, 2, 1.5), this.scene.add(r);
    const l = new _.DirectionalLight(16777215, 0.2);
    l.position.set(-1, 0.5, -1), this.scene.add(l), this.resizeObserver = new ResizeObserver(() => this.handleResize()), this.resizeObserver.observe(this.container), this.boundKeyDown = (c) => this.handleKeyDown(c), this.boundKeyUp = (c) => this.handleKeyUp(c), window.addEventListener("keydown", this.boundKeyDown), window.addEventListener("keyup", this.boundKeyUp), window.addEventListener("blur", () => {
      this.keys = {};
    }), this.onBlockHover && (this.renderer.domElement.addEventListener("mousemove", (c) => this.handleMouseMove(c)), this.renderer.domElement.addEventListener("mouseleave", () => {
      var c;
      return (c = this.onBlockHover) == null ? void 0 : c.call(this, null, 0, 0);
    })), this.startLoop();
  }
  addSchematic(t, e, o) {
    this.removeSchematic(t);
    const { group: i, lookup: n } = this.buildMesh(o);
    i.userData.sid = t, this.scene.add(i), this.groups.set(t, {
      group: i,
      lookup: n,
      palette: o.palette,
      schematicId: t,
      schematicName: e
    }), this.fitCamera();
  }
  removeSchematic(t) {
    const e = this.groups.get(t);
    e && (this.scene.remove(e.group), e.group.traverse((o) => {
      if (o.geometry && o.geometry.dispose(), o.material) {
        const i = o.material;
        Array.isArray(i) ? i.forEach((n) => n.dispose()) : i.dispose();
      }
    }), this.groups.delete(t), this.fitCamera());
  }
  setSchematicVisible(t, e) {
    const o = this.groups.get(t);
    o && (o.group.visible = e);
  }
  getVisibleIds() {
    return [...this.groups.entries()].filter(([, t]) => t.group.visible).map(([t]) => t);
  }
  hasAny() {
    return this.groups.size > 0;
  }
  fitCamera() {
    const t = [...this.groups.values()].filter((a) => a.group.visible);
    if (t.length === 0) return;
    const e = new _.Box3();
    for (const a of t) e.expandByObject(a.group);
    const o = e.getCenter(new _.Vector3()), i = e.getSize(new _.Vector3()), n = Math.max(i.x, i.y, i.z);
    this.controls.target.copy(o), this.camera.position.set(o.x + n * 0.8, o.y + n * 0.5, o.z + n * 1.2), this.camera.lookAt(o), this.controls.update(), this.initPos = this.camera.position.clone(), this.initTarget = this.controls.target.clone(), this.grid && this.scene.remove(this.grid), this.grid = new _.GridHelper(n * 2, Math.floor(n * 2), 2236962, 1579032), this.grid.position.set(o.x, e.min.y - 0.5, o.z), this.scene.add(this.grid);
  }
  destroy() {
    cancelAnimationFrame(this.animId), this.resizeObserver.disconnect(), window.removeEventListener("keydown", this.boundKeyDown), window.removeEventListener("keyup", this.boundKeyUp);
    for (const [t] of this.groups) this.removeSchematic(t);
    this.renderer.dispose(), this.renderer.domElement.remove();
  }
  buildMesh(t) {
    const e = {};
    for (const [a, r, l, c] of t.blocks)
      e[c] || (e[c] = []), e[c].push(a, r, l);
    const o = new _.Group(), i = new _.BoxGeometry(1, 1, 1), n = /* @__PURE__ */ new Map();
    for (const [a, r] of Object.entries(e)) {
      const l = t.palette[a] ?? [128, 128, 128], c = me(a, l), d = new _.MeshLambertMaterial({ map: c }), p = r.length / 3, u = new _.InstancedMesh(i, d, p), g = new _.Object3D();
      for (let y = 0; y < p; y++) {
        const M = r[y * 3], P = r[y * 3 + 1], L = r[y * 3 + 2];
        g.position.set(M, P, L), g.updateMatrix(), u.setMatrixAt(y, g.matrix), n.set(`${u.uuid}_${y}`, { bid: a, x: M, y: P, z: L });
      }
      u.instanceMatrix.needsUpdate = !0, o.add(u);
    }
    return { group: o, lookup: n };
  }
  handleResize() {
    const t = this.container.clientWidth, e = this.container.clientHeight;
    !t || !e || (this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.renderer.setSize(t, e));
  }
  handleMouseMove(t) {
    var i, n, a;
    const e = this.container.getBoundingClientRect();
    this.mouse.x = (t.clientX - e.left) / e.width * 2 - 1, this.mouse.y = -((t.clientY - e.top) / e.height) * 2 + 1, this.raycaster.setFromCamera(this.mouse, this.camera);
    const o = this.raycaster.intersectObjects(this.scene.children, !0);
    for (const r of o)
      if (r.object.isInstancedMesh && r.instanceId != null) {
        const l = r.object.parent, c = (i = l == null ? void 0 : l.userData) == null ? void 0 : i.sid, d = c ? this.groups.get(c) : void 0;
        if (!d) continue;
        const p = `${r.object.uuid}_${r.instanceId}`, u = d.lookup.get(p);
        if (u) {
          const g = d.palette[u.bid] ?? [128, 128, 128];
          (n = this.onBlockHover) == null || n.call(
            this,
            {
              blockId: u.bid,
              position: [u.x, u.y, u.z],
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
    (a = this.onBlockHover) == null || a.call(this, null, 0, 0);
  }
  isTyping() {
    var e, o;
    const t = (e = document.activeElement) == null ? void 0 : e.tagName;
    return t === "INPUT" || t === "TEXTAREA" || ((o = document.activeElement) == null ? void 0 : o.isContentEditable) === !0;
  }
  handleKeyDown(t) {
    if (this.isTyping()) return;
    const e = t.key.toLowerCase();
    Y.VIEWER_KEYS.has(e) && (this.keys[e] = !0, e === " " && t.preventDefault());
  }
  handleKeyUp(t) {
    this.keys[t.key.toLowerCase()] = !1;
  }
  processKeys(t) {
    const e = It * t, o = Nt * t, i = new _.Vector3();
    this.camera.getWorldDirection(i);
    const n = new _.Vector3(0, 1, 0), a = new _.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0).normalize();
    let r = i.clone();
    r.y = 0, r.lengthSq() < 1e-3 && (r.set(-this.camera.matrixWorld.elements[8], 0, -this.camera.matrixWorld.elements[10]).normalize(), r.lengthSq() < 1e-3 && r.set(0, 0, -1)), r.normalize();
    const l = new _.Vector3().crossVectors(r, n).normalize(), c = this.keys;
    if (c.w && (this.controls.target.addScaledVector(r, e), this.camera.position.addScaledVector(r, e)), c.s && (this.controls.target.addScaledVector(r, -e), this.camera.position.addScaledVector(r, -e)), c.a && (this.controls.target.addScaledVector(l, -e), this.camera.position.addScaledVector(l, -e)), c.d && (this.controls.target.addScaledVector(l, e), this.camera.position.addScaledVector(l, e)), c.arrowup && (this.controls.target.addScaledVector(i, e), this.camera.position.addScaledVector(i, e)), c.arrowdown && (this.controls.target.addScaledVector(i, -e), this.camera.position.addScaledVector(i, -e)), c.arrowleft && (this.controls.target.addScaledVector(a, -e), this.camera.position.addScaledVector(a, -e)), c.arrowright && (this.controls.target.addScaledVector(a, e), this.camera.position.addScaledVector(a, e)), c[" "] && (this.camera.position.y += e, this.controls.target.y += e), c.q ? this.controls.autoRotateSpeed = -30 : c.e ? this.controls.autoRotateSpeed = 30 : this.controls.autoRotateSpeed = 0, this.controls.autoRotate = c.q || c.e || !1, c.r) {
      const u = this.camera.position.clone().sub(this.controls.target);
      u.applyAxisAngle(a, -o), this.camera.position.copy(this.controls.target).add(u);
    }
    if (c.f) {
      const u = this.camera.position.clone().sub(this.controls.target);
      u.applyAxisAngle(a, o), this.camera.position.copy(this.controls.target).add(u);
    }
    const d = this.camera.position.distanceTo(this.controls.target), p = {
      1: () => i.clone().negate(),
      2: () => i.clone(),
      3: () => a.clone().negate(),
      4: () => a.clone(),
      5: () => new _.Vector3(0, 1, 0),
      6: () => new _.Vector3(0, -1, 0)
    };
    for (const [u, g] of Object.entries(p))
      if (c[u]) {
        const y = this.controls.target.clone(), M = g().normalize();
        this.camera.position.copy(y).addScaledVector(M, d), this.camera.lookAt(y), this.controls.update(), c[u] = !1;
      }
    c[0] && this.initPos && this.initTarget && (this.camera.position.copy(this.initPos), this.controls.target.copy(this.initTarget), this.controls.update(), c[0] = !1);
  }
  startLoop() {
    let t = performance.now();
    const e = (o) => {
      this.animId = requestAnimationFrame(e), this.processKeys((o - t) / 1e3), t = o, this.controls.update(), this.renderer.render(this.scene, this.camera);
    };
    this.animId = requestAnimationFrame(e);
  }
};
Y.VIEWER_KEYS = /* @__PURE__ */ new Set([
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
let q = Y;
const pe = {
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
}, fe = [128, 128, 128];
function ue(s) {
  return pe[s] ?? fe;
}
function Q(s) {
  const t = {};
  for (const e of s)
    t[e] = ue(e);
  return t;
}
let X = null;
async function _e() {
  if (!X) {
    const s = await import("./nbt-C0tfxqsY.js").then((t) => t.n);
    X = s.default ?? s;
  }
  return X;
}
async function be(s) {
  const t = await _e(), { parsed: e } = await t.parse(new Uint8Array(s));
  return t.simplify(e);
}
const ge = {
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
function ye(s) {
  const t = s.Width ?? 0, e = s.Height ?? 0, o = s.Length ?? 0, i = s.Blocks ?? [], n = [];
  let a = 0;
  for (let l = 0; l < e; l++)
    for (let c = 0; c < o; c++)
      for (let d = 0; d < t && !(a >= i.length); d++) {
        const p = i[a++];
        if (p === 0) continue;
        const u = ge[p] ?? `minecraft:unknown_${p}`;
        n.push([d, l, c, u]);
      }
  const r = new Set(n.map((l) => l[3]));
  return { blocks: n, palette: Q(r) };
}
function we(s, t) {
  let e = 0, o = 0, i = t;
  for (; i < s.length; ) {
    const n = s[i];
    if (e |= (n & 127) << o, i++, (n & 128) === 0) break;
    o += 7;
  }
  return [e, i - t];
}
function ke(s) {
  var p, u;
  let t = s;
  t.Schematic && (t = t.Schematic);
  const e = t.Width ?? 0, o = t.Height ?? 0, i = t.Length ?? 0;
  let n, a;
  (p = t.Blocks) != null && p.Palette && ((u = t.Blocks) != null && u.Data) ? (n = t.Blocks.Palette, a = t.Blocks.Data) : (n = t.Palette ?? {}, a = t.BlockData ?? []);
  const r = /* @__PURE__ */ new Map();
  for (const [g, y] of Object.entries(n)) {
    const P = (g.startsWith("minecraft:") ? g : `minecraft:${g}`).split("[")[0];
    r.set(Number(y), P);
  }
  const l = [];
  let c = 0;
  for (let g = 0; g < o; g++)
    for (let y = 0; y < i; y++)
      for (let M = 0; M < e && !(c >= a.length); M++) {
        const [P, L] = we(a, c);
        c += L;
        const z = r.get(P) ?? `minecraft:unknown_${P}`;
        z !== "minecraft:air" && l.push([M, g, y, z]);
      }
  const d = new Set(l.map((g) => g[3]));
  return { blocks: l, palette: Q(d) };
}
function ve(s) {
  var i, n, a, r, l, c;
  const t = s.Regions ?? {}, e = [];
  for (const d of Object.values(t)) {
    const p = d.BlockStatePalette ?? [];
    if (p.length === 0) continue;
    const u = Math.abs(((i = d.Size) == null ? void 0 : i.x) ?? 0), g = Math.abs(((n = d.Size) == null ? void 0 : n.y) ?? 0), y = Math.abs(((a = d.Size) == null ? void 0 : a.z) ?? 0);
    if (u * g * y === 0) continue;
    const P = ((r = d.Position) == null ? void 0 : r.x) ?? 0, L = ((l = d.Position) == null ? void 0 : l.y) ?? 0, z = ((c = d.Position) == null ? void 0 : c.z) ?? 0, I = Math.max(2, Math.ceil(Math.log2(p.length))), mt = (1 << I) - 1, J = d.BlockStates ?? [];
    if (J.length === 0) continue;
    const A = J.map((R) => BigInt(R));
    let H = 0;
    for (let R = 0; R < g; R++)
      for (let K = 0; K < y; K++)
        for (let $ = 0; $ < u; $++) {
          const j = Math.floor(H / 64), N = H % 64;
          if (H += I, j >= A.length) continue;
          let B;
          if (N + I <= 64)
            B = Number(A[j] >> BigInt(N) & BigInt(mt));
          else {
            const Z = 64 - N, pt = Number(A[j] >> BigInt(N) & BigInt((1 << Z) - 1)), ft = j + 1 < A.length ? Number(A[j + 1] & BigInt((1 << I - Z) - 1)) : 0;
            B = pt | ft << Z;
          }
          if (B >= p.length) continue;
          const U = p[B], tt = (U == null ? void 0 : U.Name) ?? U ?? "minecraft:air";
          tt !== "minecraft:air" && e.push([$ + P, R + L, K + z, tt]);
        }
  }
  const o = new Set(e.map((d) => d[3]));
  return { blocks: e, palette: Q(o) };
}
function xe(s) {
  var e;
  if (s.Regions)
    return ve(s);
  let t = s;
  if (t.Schematic && (t = t.Schematic), (e = t.Blocks) != null && e.Palette || t.Palette)
    return ke(s);
  if (t.Blocks && typeof t.Width == "number")
    return ye(s);
  throw new Error("Unrecognized NBT schematic format");
}
const dt = [".schematic", ".schem", ".litematic", ".json"];
async function Ee(s) {
  var e;
  const t = "." + (((e = s.name.split(".").pop()) == null ? void 0 : e.toLowerCase()) ?? "");
  if (t === ".json") {
    const o = await s.text(), i = JSON.parse(o);
    if (i.blocks && i.palette) return i;
    throw new Error("JSON file must contain 'blocks' and 'palette' keys");
  }
  if (t === ".schematic" || t === ".schem" || t === ".litematic") {
    const o = await s.arrayBuffer(), i = await be(o);
    return xe(i);
  }
  throw new Error(`Unsupported file format: ${t}. Supported: ${dt.join(", ")}`);
}
const Se = `
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
function Me() {
  if (document.getElementById("csv-styles")) return;
  const s = document.createElement("style");
  s.id = "csv-styles", s.textContent = Se, document.head.appendChild(s);
}
function De(s, t) {
  s.innerHTML = "";
  const e = document.createElement("div");
  e.className = "csv-root";
  const o = document.createElement("div");
  o.className = "csv-canvas-wrap", e.appendChild(o);
  let i = null;
  t.gallery && (i = document.createElement("div"), i.className = "csv-gallery", e.appendChild(i));
  let n = null;
  t.infoBar && (n = document.createElement("div"), n.className = "csv-info", e.appendChild(n));
  const a = document.createElement("div");
  a.className = "csv-tooltip", document.body.appendChild(a);
  let r = null;
  t.dragDrop && (r = document.createElement("div"), r.className = "csv-drop-overlay", r.innerHTML = "<span>Drop to add schematics</span>", e.appendChild(r));
  const l = document.createElement("div");
  l.className = "csv-add-bar";
  const c = document.createElement("label");
  c.className = "csv-add-btn", c.textContent = "+ Add";
  const d = document.createElement("input");
  d.type = "file", d.multiple = !0, d.accept = ".litematic,.schematic,.schem,.json", d.className = "csv-add-input", c.appendChild(d), l.appendChild(c);
  const p = document.createElement("button");
  return p.className = "csv-add-btn", p.textContent = "Clear", l.appendChild(p), e.appendChild(l), s.appendChild(e), { root: e, canvasWrap: o, galleryEl: i, infoEl: n, tooltip: a, dropOverlay: r, addInput: d, clearBtn: p };
}
function Pe(s, t, e, o) {
  s.innerHTML = "";
  for (const i of t) {
    const n = document.createElement("div");
    n.className = "csv-gallery-item" + (i.visible ? "" : " hidden-item"), n.innerHTML = `
      <div class="csv-gi-color" style="background:${i.color}"></div>
      <div class="csv-gi-info">
        <div class="csv-gi-name" title="${i.name}">${i.name}</div>
        <div class="csv-gi-meta">${i.blockCount.toLocaleString()} blocks · ${i.typeCount} types</div>
      </div>
      <div class="csv-gi-actions">
        <button class="csv-gi-btn vis ${i.visible ? "" : "off"}" data-id="${i.id}" title="Toggle visibility">${i.visible ? "●" : "○"}</button>
        <button class="csv-gi-btn del" data-id="${i.id}" title="Remove">×</button>
      </div>
    `, s.appendChild(n);
  }
  s.querySelectorAll(".vis").forEach((i) => {
    i.addEventListener("click", () => e(i.dataset.id));
  }), s.querySelectorAll(".del").forEach((i) => {
    i.addEventListener("click", () => o(i.dataset.id));
  });
}
function Te(s, t) {
  const e = t.filter((n) => n.visible), o = e.reduce((n, a) => n + a.blockCount, 0), i = new Set(e.flatMap((n) => Object.keys(n.data.palette)));
  if (t.length === 0) {
    s.classList.remove("visible");
    return;
  }
  s.textContent = `${t.length} schematic${t.length > 1 ? "s" : ""} · ${o.toLocaleString()} blocks · ${i.size} types`, s.classList.add("visible");
}
function Le(s, t, e, o) {
  const i = t.blockId.replace("minecraft:", "");
  s.innerHTML = `
    <div class="bt-name">${i}</div>
    <div class="bt-row">
      <div class="bt-swatch" style="background:rgb(${t.color.join(",")})"></div>
      <span class="bt-pos">${t.position.join(", ")}</span>
    </div>
    <div class="bt-schem">${t.schematicName}</div>
  `, s.style.left = e + "px", s.style.top = o + "px", s.classList.add("visible");
}
function Oe(s) {
  s.classList.remove("visible");
}
class Ae extends yt {
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
    }, Me(), this.dom = De(this.config.container, {
      gallery: this.config.gallery,
      controls: this.config.controls,
      infoBar: this.config.infoBar,
      dragDrop: this.config.dragDrop
    }), this.scene = new q({
      container: this.dom.canvasWrap,
      background: this.config.background,
      fov: this.config.fov,
      maxPixelRatio: this.config.maxPixelRatio,
      onBlockHover: this.config.tooltip ? (e, o, i) => {
        e ? (Le(this.dom.tooltip, e, o, i), this.emit("block:hover", e)) : (Oe(this.dom.tooltip), this.emit("block:hover", null));
      } : void 0
    }), this.setupDragDrop(), this.setupAddButton(), this.emit("ready");
  }
  /** Load a schematic into the viewer. */
  addSchematic(t, e, o) {
    const i = o ?? crypto.randomUUID().slice(0, 8), n = nt[this.colorIdx % nt.length];
    this.colorIdx++;
    const a = {
      id: i,
      name: t,
      data: e,
      visible: !0,
      color: n,
      blockCount: e.blocks.length,
      typeCount: Object.keys(e.palette).length
    };
    return this.entries.set(i, a), this.scene.addSchematic(i, t, e), this.refresh(), this.emit("schematic:add", a), a;
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
    const o = this.entries.get(t);
    !o || o.visible === e || (o.visible = e, this.scene.setSchematicVisible(t, e), this.refresh(), this.emit("schematic:toggle", t, e));
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
    var a;
    const o = await fetch(e);
    if (!o.ok) throw new Error(`Failed to fetch ${e}: ${o.status}`);
    const i = (a = e.split(/[?#]/)[0].split(".").pop()) == null ? void 0 : a.toLowerCase();
    if (i && i !== "json" && dt.includes(`.${i}`)) {
      const r = await o.blob(), l = new File([r], `${t}.${i}`);
      return this.loadFromFile(l);
    }
    const n = await o.json();
    return this.addSchematic(t, n);
  }
  /**
   * Load a schematic from a File object.
   * Supports .schematic, .schem, .litematic (parsed client-side via NBT)
   * and .json (blocks.json format).
   */
  async loadFromFile(t) {
    const e = await Ee(t), o = t.name.replace(/\.[^.]+$/, "");
    return this.addSchematic(o, e);
  }
  refresh() {
    const t = this.getSchematics();
    this.dom.galleryEl && Pe(
      this.dom.galleryEl,
      t,
      (e) => this.toggleSchematic(e),
      (e) => this.removeSchematic(e)
    ), this.dom.infoEl && Te(this.dom.infoEl, t);
  }
  setupDragDrop() {
    if (!this.config.dragDrop || !this.dom.dropOverlay) return;
    const t = this.dom.dropOverlay;
    let e = 0;
    this.dom.root.addEventListener("dragenter", (o) => {
      o.preventDefault(), e++, t.classList.add("visible");
    }), this.dom.root.addEventListener("dragleave", () => {
      e--, e <= 0 && (e = 0, t.classList.remove("visible"));
    }), this.dom.root.addEventListener("dragover", (o) => o.preventDefault()), this.dom.root.addEventListener("drop", async (o) => {
      var n;
      o.preventDefault(), e = 0, t.classList.remove("visible");
      const i = (n = o.dataTransfer) == null ? void 0 : n.files;
      if (i)
        for (const a of Array.from(i))
          try {
            await this.loadFromFile(a);
          } catch (r) {
            console.error(`Failed to load ${a.name}:`, r);
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
          } catch (o) {
            console.error(`Failed to load ${e.name}:`, o);
          }
      this.dom.addInput.value = "";
    }), this.dom.clearBtn.addEventListener("click", () => this.clear());
  }
}
export {
  dt as SUPPORTED_EXTENSIONS,
  Ae as SchemaViewer,
  Ee as parseFile
};
