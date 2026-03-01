import * as THREE from "three";
import { Controls, Vector3, MOUSE, TOUCH, Quaternion, Spherical, Vector2, Ray, Plane, MathUtils } from "three";
class EventEmitter {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  on(e, n) {
    return this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set()), this.listeners.get(e).add(n), () => this.off(e, n);
  }
  off(e, n) {
    var s;
    (s = this.listeners.get(e)) == null || s.delete(n);
  }
  emit(e, ...n) {
    var s;
    (s = this.listeners.get(e)) == null || s.forEach((r) => r(...n));
  }
  removeAllListeners() {
    this.listeners.clear();
  }
}
const _changeEvent = { type: "change" }, _startEvent = { type: "start" }, _endEvent = { type: "end" }, _ray = new Ray(), _plane = new Plane(), _TILT_LIMIT = Math.cos(70 * MathUtils.DEG2RAD), _v = new Vector3(), _twoPI = 2 * Math.PI, _STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, _EPS = 1e-6;
class OrbitControls extends Controls {
  constructor(e, n = null) {
    super(e, n), this.state = _STATE.NONE, this.enabled = !0, this.target = new Vector3(), this.cursor = new Vector3(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }, this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new Vector3(), this._lastQuaternion = new Quaternion(), this._lastTargetPosition = new Vector3(), this._quat = new Quaternion().setFromUnitVectors(e.up, new Vector3(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Spherical(), this._sphericalDelta = new Spherical(), this._scale = 1, this._panOffset = new Vector3(), this._rotateStart = new Vector2(), this._rotateEnd = new Vector2(), this._rotateDelta = new Vector2(), this._panStart = new Vector2(), this._panEnd = new Vector2(), this._panDelta = new Vector2(), this._dollyStart = new Vector2(), this._dollyEnd = new Vector2(), this._dollyDelta = new Vector2(), this._dollyDirection = new Vector3(), this._mouse = new Vector2(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = onPointerMove.bind(this), this._onPointerDown = onPointerDown.bind(this), this._onPointerUp = onPointerUp.bind(this), this._onContextMenu = onContextMenu.bind(this), this._onMouseWheel = onMouseWheel.bind(this), this._onKeyDown = onKeyDown.bind(this), this._onTouchStart = onTouchStart.bind(this), this._onTouchMove = onTouchMove.bind(this), this._onMouseDown = onMouseDown.bind(this), this._onMouseMove = onMouseMove.bind(this), this._interceptControlDown = interceptControlDown.bind(this), this._interceptControlUp = interceptControlUp.bind(this), this.domElement !== null && this.connect(), this.update();
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
  listenToKeyEvents(e) {
    e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(_changeEvent), this.update(), this.state = _STATE.NONE;
  }
  update(e = null) {
    const n = this.object.position;
    _v.copy(n).sub(this.target), _v.applyQuaternion(this._quat), this._spherical.setFromVector3(_v), this.autoRotate && this.state === _STATE.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let s = this.minAzimuthAngle, r = this.maxAzimuthAngle;
    isFinite(s) && isFinite(r) && (s < -Math.PI ? s += _twoPI : s > Math.PI && (s -= _twoPI), r < -Math.PI ? r += _twoPI : r > Math.PI && (r -= _twoPI), s <= r ? this._spherical.theta = Math.max(s, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (s + r) / 2 ? Math.max(s, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let a = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const f = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), a = f != this._spherical.radius;
    }
    if (_v.setFromSpherical(this._spherical), _v.applyQuaternion(this._quatInverse), n.copy(this.target).add(_v), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let f = null;
      if (this.object.isPerspectiveCamera) {
        const u = _v.length();
        f = this._clampDistance(u * this._scale);
        const h = u - f;
        this.object.position.addScaledVector(this._dollyDirection, h), this.object.updateMatrixWorld(), a = !!h;
      } else if (this.object.isOrthographicCamera) {
        const u = new Vector3(this._mouse.x, this._mouse.y, 0);
        u.unproject(this.object);
        const h = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), a = h !== this.object.zoom;
        const g = new Vector3(this._mouse.x, this._mouse.y, 0);
        g.unproject(this.object), this.object.position.sub(g).add(u), this.object.updateMatrixWorld(), f = _v.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      f !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(f).add(this.object.position) : (_ray.origin.copy(this.object.position), _ray.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(_ray.direction)) < _TILT_LIMIT ? this.object.lookAt(this.target) : (_plane.setFromNormalAndCoplanarPoint(this.object.up, this.target), _ray.intersectPlane(_plane, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const f = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), f !== this.object.zoom && (this.object.updateProjectionMatrix(), a = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, a || this._lastPosition.distanceToSquared(this.object.position) > _EPS || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > _EPS || this._lastTargetPosition.distanceToSquared(this.target) > _EPS ? (this.dispatchEvent(_changeEvent), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(e) {
    return e !== null ? _twoPI / 60 * this.autoRotateSpeed * e : _twoPI / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const n = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * n);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, n) {
    _v.setFromMatrixColumn(n, 0), _v.multiplyScalar(-e), this._panOffset.add(_v);
  }
  _panUp(e, n) {
    this.screenSpacePanning === !0 ? _v.setFromMatrixColumn(n, 1) : (_v.setFromMatrixColumn(n, 0), _v.crossVectors(this.object.up, _v)), _v.multiplyScalar(e), this._panOffset.add(_v);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(e, n) {
    const s = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const r = this.object.position;
      _v.copy(r).sub(this.target);
      let a = _v.length();
      a *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * a / s.clientHeight, this.object.matrix), this._panUp(2 * n * a / s.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / s.clientWidth, this.object.matrix), this._panUp(n * (this.object.top - this.object.bottom) / this.object.zoom / s.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(e, n) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const s = this.domElement.getBoundingClientRect(), r = e - s.left, a = n - s.top, f = s.width, u = s.height;
    this._mouse.x = r / f * 2 - 1, this._mouse.y = -(a / u) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const n = this.domElement;
    this._rotateLeft(_twoPI * this._rotateDelta.x / n.clientHeight), this._rotateUp(_twoPI * this._rotateDelta.y / n.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(e) {
    this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(e) {
    this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(e) {
    this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
  }
  _handleKeyDown(e) {
    let n = !1;
    switch (e.code) {
      case this.keys.UP:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(_twoPI * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), n = !0;
        break;
      case this.keys.BOTTOM:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(-_twoPI * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), n = !0;
        break;
      case this.keys.LEFT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(_twoPI * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), n = !0;
        break;
      case this.keys.RIGHT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(-_twoPI * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), n = !0;
        break;
    }
    n && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1)
      this._rotateStart.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._rotateStart.set(s, r);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1)
      this._panStart.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panStart.set(s, r);
    }
  }
  _handleTouchStartDolly(e) {
    const n = this._getSecondPointerPosition(e), s = e.pageX - n.x, r = e.pageY - n.y, a = Math.sqrt(s * s + r * r);
    this._dollyStart.set(0, a);
  }
  _handleTouchStartDollyPan(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
  }
  _handleTouchStartDollyRotate(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const s = this._getSecondPointerPosition(e), r = 0.5 * (e.pageX + s.x), a = 0.5 * (e.pageY + s.y);
      this._rotateEnd.set(r, a);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const n = this.domElement;
    this._rotateLeft(_twoPI * this._rotateDelta.x / n.clientHeight), this._rotateUp(_twoPI * this._rotateDelta.y / n.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1)
      this._panEnd.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panEnd.set(s, r);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const n = this._getSecondPointerPosition(e), s = e.pageX - n.x, r = e.pageY - n.y, a = Math.sqrt(s * s + r * r);
    this._dollyEnd.set(0, a), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const f = (e.pageX + n.x) * 0.5, u = (e.pageY + n.y) * 0.5;
    this._updateZoomParameters(f, u);
  }
  _handleTouchMoveDollyPan(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
  }
  _handleTouchMoveDollyRotate(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
  }
  // pointers
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let n = 0; n < this._pointers.length; n++)
      if (this._pointers[n] == e.pointerId) {
        this._pointers.splice(n, 1);
        return;
      }
  }
  _isTrackingPointer(e) {
    for (let n = 0; n < this._pointers.length; n++)
      if (this._pointers[n] == e.pointerId) return !0;
    return !1;
  }
  _trackPointer(e) {
    let n = this._pointerPositions[e.pointerId];
    n === void 0 && (n = new Vector2(), this._pointerPositions[e.pointerId] = n), n.set(e.pageX, e.pageY);
  }
  _getSecondPointerPosition(e) {
    const n = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[n];
  }
  //
  _customWheelEvent(e) {
    const n = e.deltaMode, s = {
      clientX: e.clientX,
      clientY: e.clientY,
      deltaY: e.deltaY
    };
    switch (n) {
      case 1:
        s.deltaY *= 16;
        break;
      case 2:
        s.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (s.deltaY *= 10), s;
  }
}
function onPointerDown(t) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(t.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(t) && (this._addPointer(t), t.pointerType === "touch" ? this._onTouchStart(t) : this._onMouseDown(t)));
}
function onPointerMove(t) {
  this.enabled !== !1 && (t.pointerType === "touch" ? this._onTouchMove(t) : this._onMouseMove(t));
}
function onPointerUp(t) {
  switch (this._removePointer(t), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(t.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(_endEvent), this.state = _STATE.NONE;
      break;
    case 1:
      const e = this._pointers[0], n = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: n.x, pageY: n.y });
      break;
  }
}
function onMouseDown(t) {
  let e;
  switch (t.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case MOUSE.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(t), this.state = _STATE.DOLLY;
      break;
    case MOUSE.ROTATE:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(t), this.state = _STATE.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(t), this.state = _STATE.ROTATE;
      }
      break;
    case MOUSE.PAN:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(t), this.state = _STATE.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(t), this.state = _STATE.PAN;
      }
      break;
    default:
      this.state = _STATE.NONE;
  }
  this.state !== _STATE.NONE && this.dispatchEvent(_startEvent);
}
function onMouseMove(t) {
  switch (this.state) {
    case _STATE.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(t);
      break;
    case _STATE.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(t);
      break;
    case _STATE.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(t);
      break;
  }
}
function onMouseWheel(t) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== _STATE.NONE || (t.preventDefault(), this.dispatchEvent(_startEvent), this._handleMouseWheel(this._customWheelEvent(t)), this.dispatchEvent(_endEvent));
}
function onKeyDown(t) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(t);
}
function onTouchStart(t) {
  switch (this._trackPointer(t), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case TOUCH.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(t), this.state = _STATE.TOUCH_ROTATE;
          break;
        case TOUCH.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(t), this.state = _STATE.TOUCH_PAN;
          break;
        default:
          this.state = _STATE.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case TOUCH.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(t), this.state = _STATE.TOUCH_DOLLY_PAN;
          break;
        case TOUCH.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(t), this.state = _STATE.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = _STATE.NONE;
      }
      break;
    default:
      this.state = _STATE.NONE;
  }
  this.state !== _STATE.NONE && this.dispatchEvent(_startEvent);
}
function onTouchMove(t) {
  switch (this._trackPointer(t), this.state) {
    case _STATE.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(t), this.update();
      break;
    case _STATE.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(t), this.update();
      break;
    case _STATE.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(t), this.update();
      break;
    case _STATE.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(t), this.update();
      break;
    default:
      this.state = _STATE.NONE;
  }
}
function onContextMenu(t) {
  this.enabled !== !1 && t.preventDefault();
}
function interceptControlDown(t) {
  t.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function interceptControlUp(t) {
  t.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
const GALLERY_COLORS = [
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
], DEFAULT_BACKGROUND = "#090b0c", DEFAULT_FOV = 60, DEFAULT_MAX_PIXEL_RATIO = 2, MOVE_SPEED = 40, ROTATE_SPEED = 1.5, Zr = class Zr {
  constructor(e) {
    this.animId = 0, this.groups = /* @__PURE__ */ new Map(), this.raycaster = new THREE.Raycaster(), this.mouse = new THREE.Vector2(), this.keys = {}, this.container = e.container, this.onBlockHover = e.onBlockHover;
    const n = e.background ?? DEFAULT_BACKGROUND, s = e.fov ?? DEFAULT_FOV, r = e.maxPixelRatio ?? DEFAULT_MAX_PIXEL_RATIO, a = this.container.clientWidth, f = this.container.clientHeight;
    this.scene = new THREE.Scene(), this.scene.background = new THREE.Color(n), this.camera = new THREE.PerspectiveCamera(s, a / f, 0.1, 5e3), this.renderer = new THREE.WebGLRenderer({ antialias: !0 }), this.renderer.setSize(a, f), this.renderer.setPixelRatio(Math.min(devicePixelRatio, r)), this.container.appendChild(this.renderer.domElement), this.controls = new OrbitControls(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.08, this.controls.rotateSpeed = 0.8, this.controls.minDistance = 1, this.controls.maxDistance = 5e3, this.scene.add(new THREE.AmbientLight(16777215, 0.5));
    const u = new THREE.DirectionalLight(16777215, 0.9);
    u.position.set(1, 2, 1.5), this.scene.add(u);
    const h = new THREE.DirectionalLight(16777215, 0.2);
    h.position.set(-1, 0.5, -1), this.scene.add(h), this.resizeObserver = new ResizeObserver(() => this.handleResize()), this.resizeObserver.observe(this.container), this.boundKeyDown = (g) => this.handleKeyDown(g), this.boundKeyUp = (g) => this.handleKeyUp(g), window.addEventListener("keydown", this.boundKeyDown), window.addEventListener("keyup", this.boundKeyUp), window.addEventListener("blur", () => {
      this.keys = {};
    }), this.onBlockHover && (this.renderer.domElement.addEventListener("mousemove", (g) => this.handleMouseMove(g)), this.renderer.domElement.addEventListener("mouseleave", () => {
      var g;
      return (g = this.onBlockHover) == null ? void 0 : g.call(this, null, 0, 0);
    })), this.startLoop();
  }
  addSchematic(e, n, s) {
    this.removeSchematic(e);
    const { group: r, lookup: a } = this.buildMesh(s);
    r.userData.sid = e, this.scene.add(r), this.groups.set(e, {
      group: r,
      lookup: a,
      palette: s.palette,
      schematicId: e,
      schematicName: n
    }), this.fitCamera();
  }
  removeSchematic(e) {
    const n = this.groups.get(e);
    n && (this.scene.remove(n.group), n.group.traverse((s) => {
      if (s.geometry && s.geometry.dispose(), s.material) {
        const r = s.material;
        Array.isArray(r) ? r.forEach((a) => a.dispose()) : r.dispose();
      }
    }), this.groups.delete(e), this.fitCamera());
  }
  setSchematicVisible(e, n) {
    const s = this.groups.get(e);
    s && (s.group.visible = n);
  }
  getVisibleIds() {
    return [...this.groups.entries()].filter(([, e]) => e.group.visible).map(([e]) => e);
  }
  hasAny() {
    return this.groups.size > 0;
  }
  fitCamera() {
    const e = [...this.groups.values()].filter((f) => f.group.visible);
    if (e.length === 0) return;
    const n = new THREE.Box3();
    for (const f of e) n.expandByObject(f.group);
    const s = n.getCenter(new THREE.Vector3()), r = n.getSize(new THREE.Vector3()), a = Math.max(r.x, r.y, r.z);
    this.controls.target.copy(s), this.camera.position.set(s.x + a * 0.8, s.y + a * 0.5, s.z + a * 1.2), this.camera.lookAt(s), this.controls.update(), this.initPos = this.camera.position.clone(), this.initTarget = this.controls.target.clone(), this.grid && this.scene.remove(this.grid), this.grid = new THREE.GridHelper(a * 2, Math.floor(a * 2), 2236962, 1579032), this.grid.position.set(s.x, n.min.y - 0.5, s.z), this.scene.add(this.grid);
  }
  destroy() {
    cancelAnimationFrame(this.animId), this.resizeObserver.disconnect(), window.removeEventListener("keydown", this.boundKeyDown), window.removeEventListener("keyup", this.boundKeyUp);
    for (const [e] of this.groups) this.removeSchematic(e);
    this.renderer.dispose(), this.renderer.domElement.remove();
  }
  buildMesh(e) {
    const n = {};
    for (const [f, u, h, g] of e.blocks)
      n[g] || (n[g] = []), n[g].push(f, u, h);
    const s = new THREE.Group(), r = new THREE.BoxGeometry(1, 1, 1), a = /* @__PURE__ */ new Map();
    for (const [f, u] of Object.entries(n)) {
      const h = e.palette[f] ?? [128, 128, 128], g = new THREE.MeshLambertMaterial({
        color: new THREE.Color(h[0] / 255, h[1] / 255, h[2] / 255)
      }), l = u.length / 3, m = new THREE.InstancedMesh(r, g, l), w = new THREE.Object3D();
      for (let R = 0; R < l; R++) {
        const p = u[R * 3], q = u[R * 3 + 1], c = u[R * 3 + 2];
        w.position.set(p, q, c), w.updateMatrix(), m.setMatrixAt(R, w.matrix), a.set(`${m.uuid}_${R}`, { bid: f, x: p, y: q, z: c });
      }
      m.instanceMatrix.needsUpdate = !0, s.add(m);
    }
    return { group: s, lookup: a };
  }
  handleResize() {
    const e = this.container.clientWidth, n = this.container.clientHeight;
    !e || !n || (this.camera.aspect = e / n, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, n));
  }
  handleMouseMove(e) {
    var r, a, f;
    const n = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - n.left) / n.width * 2 - 1, this.mouse.y = -((e.clientY - n.top) / n.height) * 2 + 1, this.raycaster.setFromCamera(this.mouse, this.camera);
    const s = this.raycaster.intersectObjects(this.scene.children, !0);
    for (const u of s)
      if (u.object.isInstancedMesh && u.instanceId != null) {
        const h = u.object.parent, g = (r = h == null ? void 0 : h.userData) == null ? void 0 : r.sid, l = g ? this.groups.get(g) : void 0;
        if (!l) continue;
        const m = `${u.object.uuid}_${u.instanceId}`, w = l.lookup.get(m);
        if (w) {
          const R = l.palette[w.bid] ?? [128, 128, 128];
          (a = this.onBlockHover) == null || a.call(
            this,
            {
              blockId: w.bid,
              position: [w.x, w.y, w.z],
              color: R,
              schematicName: l.schematicName,
              schematicId: l.schematicId
            },
            e.clientX,
            e.clientY
          );
          return;
        }
      }
    (f = this.onBlockHover) == null || f.call(this, null, 0, 0);
  }
  isTyping() {
    var n, s;
    const e = (n = document.activeElement) == null ? void 0 : n.tagName;
    return e === "INPUT" || e === "TEXTAREA" || ((s = document.activeElement) == null ? void 0 : s.isContentEditable) === !0;
  }
  handleKeyDown(e) {
    if (this.isTyping()) return;
    const n = e.key.toLowerCase();
    Zr.VIEWER_KEYS.has(n) && (this.keys[n] = !0, n === " " && e.preventDefault());
  }
  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = !1;
  }
  processKeys(e) {
    const n = MOVE_SPEED * e, s = ROTATE_SPEED * e, r = new THREE.Vector3();
    this.camera.getWorldDirection(r);
    const a = new THREE.Vector3(0, 1, 0), f = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0).normalize();
    let u = r.clone();
    u.y = 0, u.lengthSq() < 1e-3 && (u.set(-this.camera.matrixWorld.elements[8], 0, -this.camera.matrixWorld.elements[10]).normalize(), u.lengthSq() < 1e-3 && u.set(0, 0, -1)), u.normalize();
    const h = new THREE.Vector3().crossVectors(u, a).normalize(), g = this.keys;
    if (g.w && (this.controls.target.addScaledVector(u, n), this.camera.position.addScaledVector(u, n)), g.s && (this.controls.target.addScaledVector(u, -n), this.camera.position.addScaledVector(u, -n)), g.a && (this.controls.target.addScaledVector(h, -n), this.camera.position.addScaledVector(h, -n)), g.d && (this.controls.target.addScaledVector(h, n), this.camera.position.addScaledVector(h, n)), g.arrowup && (this.controls.target.addScaledVector(r, n), this.camera.position.addScaledVector(r, n)), g.arrowdown && (this.controls.target.addScaledVector(r, -n), this.camera.position.addScaledVector(r, -n)), g.arrowleft && (this.controls.target.addScaledVector(f, -n), this.camera.position.addScaledVector(f, -n)), g.arrowright && (this.controls.target.addScaledVector(f, n), this.camera.position.addScaledVector(f, n)), g[" "] && (this.camera.position.y += n, this.controls.target.y += n), g.q ? this.controls.autoRotateSpeed = -30 : g.e ? this.controls.autoRotateSpeed = 30 : this.controls.autoRotateSpeed = 0, this.controls.autoRotate = g.q || g.e || !1, g.r) {
      const w = this.camera.position.clone().sub(this.controls.target);
      w.applyAxisAngle(f, -s), this.camera.position.copy(this.controls.target).add(w);
    }
    if (g.f) {
      const w = this.camera.position.clone().sub(this.controls.target);
      w.applyAxisAngle(f, s), this.camera.position.copy(this.controls.target).add(w);
    }
    const l = this.camera.position.distanceTo(this.controls.target), m = {
      1: () => r.clone().negate(),
      2: () => r.clone(),
      3: () => f.clone().negate(),
      4: () => f.clone(),
      5: () => new THREE.Vector3(0, 1, 0),
      6: () => new THREE.Vector3(0, -1, 0)
    };
    for (const [w, R] of Object.entries(m))
      if (g[w]) {
        const p = this.controls.target.clone(), q = R().normalize();
        this.camera.position.copy(p).addScaledVector(q, l), this.camera.lookAt(p), this.controls.update(), g[w] = !1;
      }
    g[0] && this.initPos && this.initTarget && (this.camera.position.copy(this.initPos), this.controls.target.copy(this.initTarget), this.controls.update(), g[0] = !1);
  }
  startLoop() {
    let e = performance.now();
    const n = (s) => {
      this.animId = requestAnimationFrame(n), this.processKeys((s - e) / 1e3), e = s, this.controls.update(), this.renderer.render(this.scene, this.camera);
    };
    this.animId = requestAnimationFrame(n);
  }
};
Zr.VIEWER_KEYS = /* @__PURE__ */ new Set([
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
let SceneManager = Zr;
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function getDefaultExportFromCjs$1(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var buffer$2 = {}, base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [], revLookup = [], Arr = typeof Uint8Array < "u" ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i)
  lookup[i] = code[i], revLookup[code.charCodeAt(i)] = i;
revLookup[45] = 62;
revLookup[95] = 63;
function getLens(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var s = n === e ? 0 : 4 - n % 4;
  return [n, s];
}
function byteLength(t) {
  var e = getLens(t), n = e[0], s = e[1];
  return (n + s) * 3 / 4 - s;
}
function _byteLength(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function toByteArray(t) {
  var e, n = getLens(t), s = n[0], r = n[1], a = new Arr(_byteLength(t, s, r)), f = 0, u = r > 0 ? s - 4 : s, h;
  for (h = 0; h < u; h += 4)
    e = revLookup[t.charCodeAt(h)] << 18 | revLookup[t.charCodeAt(h + 1)] << 12 | revLookup[t.charCodeAt(h + 2)] << 6 | revLookup[t.charCodeAt(h + 3)], a[f++] = e >> 16 & 255, a[f++] = e >> 8 & 255, a[f++] = e & 255;
  return r === 2 && (e = revLookup[t.charCodeAt(h)] << 2 | revLookup[t.charCodeAt(h + 1)] >> 4, a[f++] = e & 255), r === 1 && (e = revLookup[t.charCodeAt(h)] << 10 | revLookup[t.charCodeAt(h + 1)] << 4 | revLookup[t.charCodeAt(h + 2)] >> 2, a[f++] = e >> 8 & 255, a[f++] = e & 255), a;
}
function tripletToBase64(t) {
  return lookup[t >> 18 & 63] + lookup[t >> 12 & 63] + lookup[t >> 6 & 63] + lookup[t & 63];
}
function encodeChunk(t, e, n) {
  for (var s, r = [], a = e; a < n; a += 3)
    s = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (t[a + 2] & 255), r.push(tripletToBase64(s));
  return r.join("");
}
function fromByteArray(t) {
  for (var e, n = t.length, s = n % 3, r = [], a = 16383, f = 0, u = n - s; f < u; f += a)
    r.push(encodeChunk(t, f, f + a > u ? u : f + a));
  return s === 1 ? (e = t[n - 1], r.push(
    lookup[e >> 2] + lookup[e << 4 & 63] + "=="
  )) : s === 2 && (e = (t[n - 2] << 8) + t[n - 1], r.push(
    lookup[e >> 10] + lookup[e >> 4 & 63] + lookup[e << 2 & 63] + "="
  )), r.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(t, e, n, s, r) {
  var a, f, u = r * 8 - s - 1, h = (1 << u) - 1, g = h >> 1, l = -7, m = n ? r - 1 : 0, w = n ? -1 : 1, R = t[e + m];
  for (m += w, a = R & (1 << -l) - 1, R >>= -l, l += u; l > 0; a = a * 256 + t[e + m], m += w, l -= 8)
    ;
  for (f = a & (1 << -l) - 1, a >>= -l, l += s; l > 0; f = f * 256 + t[e + m], m += w, l -= 8)
    ;
  if (a === 0)
    a = 1 - g;
  else {
    if (a === h)
      return f ? NaN : (R ? -1 : 1) * (1 / 0);
    f = f + Math.pow(2, s), a = a - g;
  }
  return (R ? -1 : 1) * f * Math.pow(2, a - s);
};
ieee754.write = function(t, e, n, s, r, a) {
  var f, u, h, g = a * 8 - r - 1, l = (1 << g) - 1, m = l >> 1, w = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, R = s ? 0 : a - 1, p = s ? 1 : -1, q = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, f = l) : (f = Math.floor(Math.log(e) / Math.LN2), e * (h = Math.pow(2, -f)) < 1 && (f--, h *= 2), f + m >= 1 ? e += w / h : e += w * Math.pow(2, 1 - m), e * h >= 2 && (f++, h /= 2), f + m >= l ? (u = 0, f = l) : f + m >= 1 ? (u = (e * h - 1) * Math.pow(2, r), f = f + m) : (u = e * Math.pow(2, m - 1) * Math.pow(2, r), f = 0)); r >= 8; t[n + R] = u & 255, R += p, u /= 256, r -= 8)
    ;
  for (f = f << r | u, g += r; g > 0; t[n + R] = f & 255, R += p, f /= 256, g -= 8)
    ;
  t[n + R - p] |= q * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = base64Js, n = ieee754, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = l, t.SlowBuffer = A, t.INSPECT_MAX_BYTES = 50;
  const r = 2147483647;
  t.kMaxLength = r;
  const { Uint8Array: a, ArrayBuffer: f, SharedArrayBuffer: u } = globalThis;
  l.TYPED_ARRAY_SUPPORT = h(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function h() {
    try {
      const U = new a(1), o = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(o, a.prototype), Object.setPrototypeOf(U, o), U.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(l.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(l.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.byteOffset;
    }
  });
  function g(U) {
    if (U > r)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
    const o = new a(U);
    return Object.setPrototypeOf(o, l.prototype), o;
  }
  function l(U, o, _) {
    if (typeof U == "number") {
      if (typeof o == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return p(U);
    }
    return m(U, o, _);
  }
  l.poolSize = 8192;
  function m(U, o, _) {
    if (typeof U == "string")
      return q(U, o);
    if (f.isView(U))
      return v(U);
    if (U == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
      );
    if (Se(U, f) || U && Se(U.buffer, f) || typeof u < "u" && (Se(U, u) || U && Se(U.buffer, u)))
      return P(U, o, _);
    if (typeof U == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const W = U.valueOf && U.valueOf();
    if (W != null && W !== U)
      return l.from(W, o, _);
    const ue = E(U);
    if (ue) return ue;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof U[Symbol.toPrimitive] == "function")
      return l.from(U[Symbol.toPrimitive]("string"), o, _);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
    );
  }
  l.from = function(U, o, _) {
    return m(U, o, _);
  }, Object.setPrototypeOf(l.prototype, a.prototype), Object.setPrototypeOf(l, a);
  function w(U) {
    if (typeof U != "number")
      throw new TypeError('"size" argument must be of type number');
    if (U < 0)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
  }
  function R(U, o, _) {
    return w(U), U <= 0 ? g(U) : o !== void 0 ? typeof _ == "string" ? g(U).fill(o, _) : g(U).fill(o) : g(U);
  }
  l.alloc = function(U, o, _) {
    return R(U, o, _);
  };
  function p(U) {
    return w(U), g(U < 0 ? 0 : I(U) | 0);
  }
  l.allocUnsafe = function(U) {
    return p(U);
  }, l.allocUnsafeSlow = function(U) {
    return p(U);
  };
  function q(U, o) {
    if ((typeof o != "string" || o === "") && (o = "utf8"), !l.isEncoding(o))
      throw new TypeError("Unknown encoding: " + o);
    const _ = $(U, o) | 0;
    let W = g(_);
    const ue = W.write(U, o);
    return ue !== _ && (W = W.slice(0, ue)), W;
  }
  function c(U) {
    const o = U.length < 0 ? 0 : I(U.length) | 0, _ = g(o);
    for (let W = 0; W < o; W += 1)
      _[W] = U[W] & 255;
    return _;
  }
  function v(U) {
    if (Se(U, a)) {
      const o = new a(U);
      return P(o.buffer, o.byteOffset, o.byteLength);
    }
    return c(U);
  }
  function P(U, o, _) {
    if (o < 0 || U.byteLength < o)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (U.byteLength < o + (_ || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let W;
    return o === void 0 && _ === void 0 ? W = new a(U) : _ === void 0 ? W = new a(U, o) : W = new a(U, o, _), Object.setPrototypeOf(W, l.prototype), W;
  }
  function E(U) {
    if (l.isBuffer(U)) {
      const o = I(U.length) | 0, _ = g(o);
      return _.length === 0 || U.copy(_, 0, 0, o), _;
    }
    if (U.length !== void 0)
      return typeof U.length != "number" || Le(U.length) ? g(0) : c(U);
    if (U.type === "Buffer" && Array.isArray(U.data))
      return c(U.data);
  }
  function I(U) {
    if (U >= r)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
    return U | 0;
  }
  function A(U) {
    return +U != U && (U = 0), l.alloc(+U);
  }
  l.isBuffer = function(o) {
    return o != null && o._isBuffer === !0 && o !== l.prototype;
  }, l.compare = function(o, _) {
    if (Se(o, a) && (o = l.from(o, o.offset, o.byteLength)), Se(_, a) && (_ = l.from(_, _.offset, _.byteLength)), !l.isBuffer(o) || !l.isBuffer(_))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (o === _) return 0;
    let W = o.length, ue = _.length;
    for (let J = 0, he = Math.min(W, ue); J < he; ++J)
      if (o[J] !== _[J]) {
        W = o[J], ue = _[J];
        break;
      }
    return W < ue ? -1 : ue < W ? 1 : 0;
  }, l.isEncoding = function(o) {
    switch (String(o).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, l.concat = function(o, _) {
    if (!Array.isArray(o))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (o.length === 0)
      return l.alloc(0);
    let W;
    if (_ === void 0)
      for (_ = 0, W = 0; W < o.length; ++W)
        _ += o[W].length;
    const ue = l.allocUnsafe(_);
    let J = 0;
    for (W = 0; W < o.length; ++W) {
      let he = o[W];
      if (Se(he, a))
        J + he.length > ue.length ? (l.isBuffer(he) || (he = l.from(he)), he.copy(ue, J)) : a.prototype.set.call(
          ue,
          he,
          J
        );
      else if (l.isBuffer(he))
        he.copy(ue, J);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      J += he.length;
    }
    return ue;
  };
  function $(U, o) {
    if (l.isBuffer(U))
      return U.length;
    if (f.isView(U) || Se(U, f))
      return U.byteLength;
    if (typeof U != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof U
      );
    const _ = U.length, W = arguments.length > 2 && arguments[2] === !0;
    if (!W && _ === 0) return 0;
    let ue = !1;
    for (; ; )
      switch (o) {
        case "ascii":
        case "latin1":
        case "binary":
          return _;
        case "utf8":
        case "utf-8":
          return $e(U).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return _ * 2;
        case "hex":
          return _ >>> 1;
        case "base64":
          return Ue(U).length;
        default:
          if (ue)
            return W ? -1 : $e(U).length;
          o = ("" + o).toLowerCase(), ue = !0;
      }
  }
  l.byteLength = $;
  function x(U, o, _) {
    let W = !1;
    if ((o === void 0 || o < 0) && (o = 0), o > this.length || ((_ === void 0 || _ > this.length) && (_ = this.length), _ <= 0) || (_ >>>= 0, o >>>= 0, _ <= o))
      return "";
    for (U || (U = "utf8"); ; )
      switch (U) {
        case "hex":
          return ee(this, o, _);
        case "utf8":
        case "utf-8":
          return be(this, o, _);
        case "ascii":
          return j(this, o, _);
        case "latin1":
        case "binary":
          return pe(this, o, _);
        case "base64":
          return we(this, o, _);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return X(this, o, _);
        default:
          if (W) throw new TypeError("Unknown encoding: " + U);
          U = (U + "").toLowerCase(), W = !0;
      }
  }
  l.prototype._isBuffer = !0;
  function M(U, o, _) {
    const W = U[o];
    U[o] = U[_], U[_] = W;
  }
  l.prototype.swap16 = function() {
    const o = this.length;
    if (o % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let _ = 0; _ < o; _ += 2)
      M(this, _, _ + 1);
    return this;
  }, l.prototype.swap32 = function() {
    const o = this.length;
    if (o % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let _ = 0; _ < o; _ += 4)
      M(this, _, _ + 3), M(this, _ + 1, _ + 2);
    return this;
  }, l.prototype.swap64 = function() {
    const o = this.length;
    if (o % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let _ = 0; _ < o; _ += 8)
      M(this, _, _ + 7), M(this, _ + 1, _ + 6), M(this, _ + 2, _ + 5), M(this, _ + 3, _ + 4);
    return this;
  }, l.prototype.toString = function() {
    const o = this.length;
    return o === 0 ? "" : arguments.length === 0 ? be(this, 0, o) : x.apply(this, arguments);
  }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(o) {
    if (!l.isBuffer(o)) throw new TypeError("Argument must be a Buffer");
    return this === o ? !0 : l.compare(this, o) === 0;
  }, l.prototype.inspect = function() {
    let o = "";
    const _ = t.INSPECT_MAX_BYTES;
    return o = this.toString("hex", 0, _).replace(/(.{2})/g, "$1 ").trim(), this.length > _ && (o += " ... "), "<Buffer " + o + ">";
  }, s && (l.prototype[s] = l.prototype.inspect), l.prototype.compare = function(o, _, W, ue, J) {
    if (Se(o, a) && (o = l.from(o, o.offset, o.byteLength)), !l.isBuffer(o))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof o
      );
    if (_ === void 0 && (_ = 0), W === void 0 && (W = o ? o.length : 0), ue === void 0 && (ue = 0), J === void 0 && (J = this.length), _ < 0 || W > o.length || ue < 0 || J > this.length)
      throw new RangeError("out of range index");
    if (ue >= J && _ >= W)
      return 0;
    if (ue >= J)
      return -1;
    if (_ >= W)
      return 1;
    if (_ >>>= 0, W >>>= 0, ue >>>= 0, J >>>= 0, this === o) return 0;
    let he = J - ue, k = W - _;
    const Be = Math.min(he, k), We = this.slice(ue, J), S = o.slice(_, W);
    for (let Ie = 0; Ie < Be; ++Ie)
      if (We[Ie] !== S[Ie]) {
        he = We[Ie], k = S[Ie];
        break;
      }
    return he < k ? -1 : k < he ? 1 : 0;
  };
  function V(U, o, _, W, ue) {
    if (U.length === 0) return -1;
    if (typeof _ == "string" ? (W = _, _ = 0) : _ > 2147483647 ? _ = 2147483647 : _ < -2147483648 && (_ = -2147483648), _ = +_, Le(_) && (_ = ue ? 0 : U.length - 1), _ < 0 && (_ = U.length + _), _ >= U.length) {
      if (ue) return -1;
      _ = U.length - 1;
    } else if (_ < 0)
      if (ue) _ = 0;
      else return -1;
    if (typeof o == "string" && (o = l.from(o, W)), l.isBuffer(o))
      return o.length === 0 ? -1 : C(U, o, _, W, ue);
    if (typeof o == "number")
      return o = o & 255, typeof a.prototype.indexOf == "function" ? ue ? a.prototype.indexOf.call(U, o, _) : a.prototype.lastIndexOf.call(U, o, _) : C(U, [o], _, W, ue);
    throw new TypeError("val must be string, number or Buffer");
  }
  function C(U, o, _, W, ue) {
    let J = 1, he = U.length, k = o.length;
    if (W !== void 0 && (W = String(W).toLowerCase(), W === "ucs2" || W === "ucs-2" || W === "utf16le" || W === "utf-16le")) {
      if (U.length < 2 || o.length < 2)
        return -1;
      J = 2, he /= 2, k /= 2, _ /= 2;
    }
    function Be(S, Ie) {
      return J === 1 ? S[Ie] : S.readUInt16BE(Ie * J);
    }
    let We;
    if (ue) {
      let S = -1;
      for (We = _; We < he; We++)
        if (Be(U, We) === Be(o, S === -1 ? 0 : We - S)) {
          if (S === -1 && (S = We), We - S + 1 === k) return S * J;
        } else
          S !== -1 && (We -= We - S), S = -1;
    } else
      for (_ + k > he && (_ = he - k), We = _; We >= 0; We--) {
        let S = !0;
        for (let Ie = 0; Ie < k; Ie++)
          if (Be(U, We + Ie) !== Be(o, Ie)) {
            S = !1;
            break;
          }
        if (S) return We;
      }
    return -1;
  }
  l.prototype.includes = function(o, _, W) {
    return this.indexOf(o, _, W) !== -1;
  }, l.prototype.indexOf = function(o, _, W) {
    return V(this, o, _, W, !0);
  }, l.prototype.lastIndexOf = function(o, _, W) {
    return V(this, o, _, W, !1);
  };
  function z(U, o, _, W) {
    _ = Number(_) || 0;
    const ue = U.length - _;
    W ? (W = Number(W), W > ue && (W = ue)) : W = ue;
    const J = o.length;
    W > J / 2 && (W = J / 2);
    let he;
    for (he = 0; he < W; ++he) {
      const k = parseInt(o.substr(he * 2, 2), 16);
      if (Le(k)) return he;
      U[_ + he] = k;
    }
    return he;
  }
  function y(U, o, _, W) {
    return ge($e(o, U.length - _), U, _, W);
  }
  function D(U, o, _, W) {
    return ge(Ce(o), U, _, W);
  }
  function ie(U, o, _, W) {
    return ge(Ue(o), U, _, W);
  }
  function de(U, o, _, W) {
    return ge(Te(o, U.length - _), U, _, W);
  }
  l.prototype.write = function(o, _, W, ue) {
    if (_ === void 0)
      ue = "utf8", W = this.length, _ = 0;
    else if (W === void 0 && typeof _ == "string")
      ue = _, W = this.length, _ = 0;
    else if (isFinite(_))
      _ = _ >>> 0, isFinite(W) ? (W = W >>> 0, ue === void 0 && (ue = "utf8")) : (ue = W, W = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const J = this.length - _;
    if ((W === void 0 || W > J) && (W = J), o.length > 0 && (W < 0 || _ < 0) || _ > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    ue || (ue = "utf8");
    let he = !1;
    for (; ; )
      switch (ue) {
        case "hex":
          return z(this, o, _, W);
        case "utf8":
        case "utf-8":
          return y(this, o, _, W);
        case "ascii":
        case "latin1":
        case "binary":
          return D(this, o, _, W);
        case "base64":
          return ie(this, o, _, W);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return de(this, o, _, W);
        default:
          if (he) throw new TypeError("Unknown encoding: " + ue);
          ue = ("" + ue).toLowerCase(), he = !0;
      }
  }, l.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function we(U, o, _) {
    return o === 0 && _ === U.length ? e.fromByteArray(U) : e.fromByteArray(U.slice(o, _));
  }
  function be(U, o, _) {
    _ = Math.min(U.length, _);
    const W = [];
    let ue = o;
    for (; ue < _; ) {
      const J = U[ue];
      let he = null, k = J > 239 ? 4 : J > 223 ? 3 : J > 191 ? 2 : 1;
      if (ue + k <= _) {
        let Be, We, S, Ie;
        switch (k) {
          case 1:
            J < 128 && (he = J);
            break;
          case 2:
            Be = U[ue + 1], (Be & 192) === 128 && (Ie = (J & 31) << 6 | Be & 63, Ie > 127 && (he = Ie));
            break;
          case 3:
            Be = U[ue + 1], We = U[ue + 2], (Be & 192) === 128 && (We & 192) === 128 && (Ie = (J & 15) << 12 | (Be & 63) << 6 | We & 63, Ie > 2047 && (Ie < 55296 || Ie > 57343) && (he = Ie));
            break;
          case 4:
            Be = U[ue + 1], We = U[ue + 2], S = U[ue + 3], (Be & 192) === 128 && (We & 192) === 128 && (S & 192) === 128 && (Ie = (J & 15) << 18 | (Be & 63) << 12 | (We & 63) << 6 | S & 63, Ie > 65535 && Ie < 1114112 && (he = Ie));
        }
      }
      he === null ? (he = 65533, k = 1) : he > 65535 && (he -= 65536, W.push(he >>> 10 & 1023 | 55296), he = 56320 | he & 1023), W.push(he), ue += k;
    }
    return fe(W);
  }
  const ce = 4096;
  function fe(U) {
    const o = U.length;
    if (o <= ce)
      return String.fromCharCode.apply(String, U);
    let _ = "", W = 0;
    for (; W < o; )
      _ += String.fromCharCode.apply(
        String,
        U.slice(W, W += ce)
      );
    return _;
  }
  function j(U, o, _) {
    let W = "";
    _ = Math.min(U.length, _);
    for (let ue = o; ue < _; ++ue)
      W += String.fromCharCode(U[ue] & 127);
    return W;
  }
  function pe(U, o, _) {
    let W = "";
    _ = Math.min(U.length, _);
    for (let ue = o; ue < _; ++ue)
      W += String.fromCharCode(U[ue]);
    return W;
  }
  function ee(U, o, _) {
    const W = U.length;
    (!o || o < 0) && (o = 0), (!_ || _ < 0 || _ > W) && (_ = W);
    let ue = "";
    for (let J = o; J < _; ++J)
      ue += Me[U[J]];
    return ue;
  }
  function X(U, o, _) {
    const W = U.slice(o, _);
    let ue = "";
    for (let J = 0; J < W.length - 1; J += 2)
      ue += String.fromCharCode(W[J] + W[J + 1] * 256);
    return ue;
  }
  l.prototype.slice = function(o, _) {
    const W = this.length;
    o = ~~o, _ = _ === void 0 ? W : ~~_, o < 0 ? (o += W, o < 0 && (o = 0)) : o > W && (o = W), _ < 0 ? (_ += W, _ < 0 && (_ = 0)) : _ > W && (_ = W), _ < o && (_ = o);
    const ue = this.subarray(o, _);
    return Object.setPrototypeOf(ue, l.prototype), ue;
  };
  function G(U, o, _) {
    if (U % 1 !== 0 || U < 0) throw new RangeError("offset is not uint");
    if (U + o > _) throw new RangeError("Trying to access beyond buffer length");
  }
  l.prototype.readUintLE = l.prototype.readUIntLE = function(o, _, W) {
    o = o >>> 0, _ = _ >>> 0, W || G(o, _, this.length);
    let ue = this[o], J = 1, he = 0;
    for (; ++he < _ && (J *= 256); )
      ue += this[o + he] * J;
    return ue;
  }, l.prototype.readUintBE = l.prototype.readUIntBE = function(o, _, W) {
    o = o >>> 0, _ = _ >>> 0, W || G(o, _, this.length);
    let ue = this[o + --_], J = 1;
    for (; _ > 0 && (J *= 256); )
      ue += this[o + --_] * J;
    return ue;
  }, l.prototype.readUint8 = l.prototype.readUInt8 = function(o, _) {
    return o = o >>> 0, _ || G(o, 1, this.length), this[o];
  }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(o, _) {
    return o = o >>> 0, _ || G(o, 2, this.length), this[o] | this[o + 1] << 8;
  }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(o, _) {
    return o = o >>> 0, _ || G(o, 2, this.length), this[o] << 8 | this[o + 1];
  }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), (this[o] | this[o + 1] << 8 | this[o + 2] << 16) + this[o + 3] * 16777216;
  }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), this[o] * 16777216 + (this[o + 1] << 16 | this[o + 2] << 8 | this[o + 3]);
  }, l.prototype.readBigUInt64LE = ke(function(o) {
    o = o >>> 0, Re(o, "offset");
    const _ = this[o], W = this[o + 7];
    (_ === void 0 || W === void 0) && Pe(o, this.length - 8);
    const ue = _ + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + this[++o] * 2 ** 24, J = this[++o] + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + W * 2 ** 24;
    return BigInt(ue) + (BigInt(J) << BigInt(32));
  }), l.prototype.readBigUInt64BE = ke(function(o) {
    o = o >>> 0, Re(o, "offset");
    const _ = this[o], W = this[o + 7];
    (_ === void 0 || W === void 0) && Pe(o, this.length - 8);
    const ue = _ * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + this[++o], J = this[++o] * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + W;
    return (BigInt(ue) << BigInt(32)) + BigInt(J);
  }), l.prototype.readIntLE = function(o, _, W) {
    o = o >>> 0, _ = _ >>> 0, W || G(o, _, this.length);
    let ue = this[o], J = 1, he = 0;
    for (; ++he < _ && (J *= 256); )
      ue += this[o + he] * J;
    return J *= 128, ue >= J && (ue -= Math.pow(2, 8 * _)), ue;
  }, l.prototype.readIntBE = function(o, _, W) {
    o = o >>> 0, _ = _ >>> 0, W || G(o, _, this.length);
    let ue = _, J = 1, he = this[o + --ue];
    for (; ue > 0 && (J *= 256); )
      he += this[o + --ue] * J;
    return J *= 128, he >= J && (he -= Math.pow(2, 8 * _)), he;
  }, l.prototype.readInt8 = function(o, _) {
    return o = o >>> 0, _ || G(o, 1, this.length), this[o] & 128 ? (255 - this[o] + 1) * -1 : this[o];
  }, l.prototype.readInt16LE = function(o, _) {
    o = o >>> 0, _ || G(o, 2, this.length);
    const W = this[o] | this[o + 1] << 8;
    return W & 32768 ? W | 4294901760 : W;
  }, l.prototype.readInt16BE = function(o, _) {
    o = o >>> 0, _ || G(o, 2, this.length);
    const W = this[o + 1] | this[o] << 8;
    return W & 32768 ? W | 4294901760 : W;
  }, l.prototype.readInt32LE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), this[o] | this[o + 1] << 8 | this[o + 2] << 16 | this[o + 3] << 24;
  }, l.prototype.readInt32BE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), this[o] << 24 | this[o + 1] << 16 | this[o + 2] << 8 | this[o + 3];
  }, l.prototype.readBigInt64LE = ke(function(o) {
    o = o >>> 0, Re(o, "offset");
    const _ = this[o], W = this[o + 7];
    (_ === void 0 || W === void 0) && Pe(o, this.length - 8);
    const ue = this[o + 4] + this[o + 5] * 2 ** 8 + this[o + 6] * 2 ** 16 + (W << 24);
    return (BigInt(ue) << BigInt(32)) + BigInt(_ + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + this[++o] * 2 ** 24);
  }), l.prototype.readBigInt64BE = ke(function(o) {
    o = o >>> 0, Re(o, "offset");
    const _ = this[o], W = this[o + 7];
    (_ === void 0 || W === void 0) && Pe(o, this.length - 8);
    const ue = (_ << 24) + // Overflow
    this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + this[++o];
    return (BigInt(ue) << BigInt(32)) + BigInt(this[++o] * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + W);
  }), l.prototype.readFloatLE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), n.read(this, o, !0, 23, 4);
  }, l.prototype.readFloatBE = function(o, _) {
    return o = o >>> 0, _ || G(o, 4, this.length), n.read(this, o, !1, 23, 4);
  }, l.prototype.readDoubleLE = function(o, _) {
    return o = o >>> 0, _ || G(o, 8, this.length), n.read(this, o, !0, 52, 8);
  }, l.prototype.readDoubleBE = function(o, _) {
    return o = o >>> 0, _ || G(o, 8, this.length), n.read(this, o, !1, 52, 8);
  };
  function le(U, o, _, W, ue, J) {
    if (!l.isBuffer(U)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (o > ue || o < J) throw new RangeError('"value" argument is out of bounds');
    if (_ + W > U.length) throw new RangeError("Index out of range");
  }
  l.prototype.writeUintLE = l.prototype.writeUIntLE = function(o, _, W, ue) {
    if (o = +o, _ = _ >>> 0, W = W >>> 0, !ue) {
      const k = Math.pow(2, 8 * W) - 1;
      le(this, o, _, W, k, 0);
    }
    let J = 1, he = 0;
    for (this[_] = o & 255; ++he < W && (J *= 256); )
      this[_ + he] = o / J & 255;
    return _ + W;
  }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(o, _, W, ue) {
    if (o = +o, _ = _ >>> 0, W = W >>> 0, !ue) {
      const k = Math.pow(2, 8 * W) - 1;
      le(this, o, _, W, k, 0);
    }
    let J = W - 1, he = 1;
    for (this[_ + J] = o & 255; --J >= 0 && (he *= 256); )
      this[_ + J] = o / he & 255;
    return _ + W;
  }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 1, 255, 0), this[_] = o & 255, _ + 1;
  }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 2, 65535, 0), this[_] = o & 255, this[_ + 1] = o >>> 8, _ + 2;
  }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 2, 65535, 0), this[_] = o >>> 8, this[_ + 1] = o & 255, _ + 2;
  }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 4, 4294967295, 0), this[_ + 3] = o >>> 24, this[_ + 2] = o >>> 16, this[_ + 1] = o >>> 8, this[_] = o & 255, _ + 4;
  }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 4, 4294967295, 0), this[_] = o >>> 24, this[_ + 1] = o >>> 16, this[_ + 2] = o >>> 8, this[_ + 3] = o & 255, _ + 4;
  };
  function O(U, o, _, W, ue) {
    Ee(o, W, ue, U, _, 7);
    let J = Number(o & BigInt(4294967295));
    U[_++] = J, J = J >> 8, U[_++] = J, J = J >> 8, U[_++] = J, J = J >> 8, U[_++] = J;
    let he = Number(o >> BigInt(32) & BigInt(4294967295));
    return U[_++] = he, he = he >> 8, U[_++] = he, he = he >> 8, U[_++] = he, he = he >> 8, U[_++] = he, _;
  }
  function B(U, o, _, W, ue) {
    Ee(o, W, ue, U, _, 7);
    let J = Number(o & BigInt(4294967295));
    U[_ + 7] = J, J = J >> 8, U[_ + 6] = J, J = J >> 8, U[_ + 5] = J, J = J >> 8, U[_ + 4] = J;
    let he = Number(o >> BigInt(32) & BigInt(4294967295));
    return U[_ + 3] = he, he = he >> 8, U[_ + 2] = he, he = he >> 8, U[_ + 1] = he, he = he >> 8, U[_] = he, _ + 8;
  }
  l.prototype.writeBigUInt64LE = ke(function(o, _ = 0) {
    return O(this, o, _, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeBigUInt64BE = ke(function(o, _ = 0) {
    return B(this, o, _, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeIntLE = function(o, _, W, ue) {
    if (o = +o, _ = _ >>> 0, !ue) {
      const Be = Math.pow(2, 8 * W - 1);
      le(this, o, _, W, Be - 1, -Be);
    }
    let J = 0, he = 1, k = 0;
    for (this[_] = o & 255; ++J < W && (he *= 256); )
      o < 0 && k === 0 && this[_ + J - 1] !== 0 && (k = 1), this[_ + J] = (o / he >> 0) - k & 255;
    return _ + W;
  }, l.prototype.writeIntBE = function(o, _, W, ue) {
    if (o = +o, _ = _ >>> 0, !ue) {
      const Be = Math.pow(2, 8 * W - 1);
      le(this, o, _, W, Be - 1, -Be);
    }
    let J = W - 1, he = 1, k = 0;
    for (this[_ + J] = o & 255; --J >= 0 && (he *= 256); )
      o < 0 && k === 0 && this[_ + J + 1] !== 0 && (k = 1), this[_ + J] = (o / he >> 0) - k & 255;
    return _ + W;
  }, l.prototype.writeInt8 = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 1, 127, -128), o < 0 && (o = 255 + o + 1), this[_] = o & 255, _ + 1;
  }, l.prototype.writeInt16LE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 2, 32767, -32768), this[_] = o & 255, this[_ + 1] = o >>> 8, _ + 2;
  }, l.prototype.writeInt16BE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 2, 32767, -32768), this[_] = o >>> 8, this[_ + 1] = o & 255, _ + 2;
  }, l.prototype.writeInt32LE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 4, 2147483647, -2147483648), this[_] = o & 255, this[_ + 1] = o >>> 8, this[_ + 2] = o >>> 16, this[_ + 3] = o >>> 24, _ + 4;
  }, l.prototype.writeInt32BE = function(o, _, W) {
    return o = +o, _ = _ >>> 0, W || le(this, o, _, 4, 2147483647, -2147483648), o < 0 && (o = 4294967295 + o + 1), this[_] = o >>> 24, this[_ + 1] = o >>> 16, this[_ + 2] = o >>> 8, this[_ + 3] = o & 255, _ + 4;
  }, l.prototype.writeBigInt64LE = ke(function(o, _ = 0) {
    return O(this, o, _, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), l.prototype.writeBigInt64BE = ke(function(o, _ = 0) {
    return B(this, o, _, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function N(U, o, _, W, ue, J) {
    if (_ + W > U.length) throw new RangeError("Index out of range");
    if (_ < 0) throw new RangeError("Index out of range");
  }
  function re(U, o, _, W, ue) {
    return o = +o, _ = _ >>> 0, ue || N(U, o, _, 4), n.write(U, o, _, W, 23, 4), _ + 4;
  }
  l.prototype.writeFloatLE = function(o, _, W) {
    return re(this, o, _, !0, W);
  }, l.prototype.writeFloatBE = function(o, _, W) {
    return re(this, o, _, !1, W);
  };
  function ne(U, o, _, W, ue) {
    return o = +o, _ = _ >>> 0, ue || N(U, o, _, 8), n.write(U, o, _, W, 52, 8), _ + 8;
  }
  l.prototype.writeDoubleLE = function(o, _, W) {
    return ne(this, o, _, !0, W);
  }, l.prototype.writeDoubleBE = function(o, _, W) {
    return ne(this, o, _, !1, W);
  }, l.prototype.copy = function(o, _, W, ue) {
    if (!l.isBuffer(o)) throw new TypeError("argument should be a Buffer");
    if (W || (W = 0), !ue && ue !== 0 && (ue = this.length), _ >= o.length && (_ = o.length), _ || (_ = 0), ue > 0 && ue < W && (ue = W), ue === W || o.length === 0 || this.length === 0) return 0;
    if (_ < 0)
      throw new RangeError("targetStart out of bounds");
    if (W < 0 || W >= this.length) throw new RangeError("Index out of range");
    if (ue < 0) throw new RangeError("sourceEnd out of bounds");
    ue > this.length && (ue = this.length), o.length - _ < ue - W && (ue = o.length - _ + W);
    const J = ue - W;
    return this === o && typeof a.prototype.copyWithin == "function" ? this.copyWithin(_, W, ue) : a.prototype.set.call(
      o,
      this.subarray(W, ue),
      _
    ), J;
  }, l.prototype.fill = function(o, _, W, ue) {
    if (typeof o == "string") {
      if (typeof _ == "string" ? (ue = _, _ = 0, W = this.length) : typeof W == "string" && (ue = W, W = this.length), ue !== void 0 && typeof ue != "string")
        throw new TypeError("encoding must be a string");
      if (typeof ue == "string" && !l.isEncoding(ue))
        throw new TypeError("Unknown encoding: " + ue);
      if (o.length === 1) {
        const he = o.charCodeAt(0);
        (ue === "utf8" && he < 128 || ue === "latin1") && (o = he);
      }
    } else typeof o == "number" ? o = o & 255 : typeof o == "boolean" && (o = Number(o));
    if (_ < 0 || this.length < _ || this.length < W)
      throw new RangeError("Out of range index");
    if (W <= _)
      return this;
    _ = _ >>> 0, W = W === void 0 ? this.length : W >>> 0, o || (o = 0);
    let J;
    if (typeof o == "number")
      for (J = _; J < W; ++J)
        this[J] = o;
    else {
      const he = l.isBuffer(o) ? o : l.from(o, ue), k = he.length;
      if (k === 0)
        throw new TypeError('The value "' + o + '" is invalid for argument "value"');
      for (J = 0; J < W - _; ++J)
        this[J + _] = he[J % k];
    }
    return this;
  };
  const F = {};
  function L(U, o, _) {
    F[U] = class extends _ {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: o.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${U}]`, this.stack, delete this.name;
      }
      get code() {
        return U;
      }
      set code(ue) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: ue,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${U}]: ${this.message}`;
      }
    };
  }
  L(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(U) {
      return U ? `${U} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), L(
    "ERR_INVALID_ARG_TYPE",
    function(U, o) {
      return `The "${U}" argument must be of type number. Received type ${typeof o}`;
    },
    TypeError
  ), L(
    "ERR_OUT_OF_RANGE",
    function(U, o, _) {
      let W = `The value of "${U}" is out of range.`, ue = _;
      return Number.isInteger(_) && Math.abs(_) > 2 ** 32 ? ue = H(String(_)) : typeof _ == "bigint" && (ue = String(_), (_ > BigInt(2) ** BigInt(32) || _ < -(BigInt(2) ** BigInt(32))) && (ue = H(ue)), ue += "n"), W += ` It must be ${o}. Received ${ue}`, W;
    },
    RangeError
  );
  function H(U) {
    let o = "", _ = U.length;
    const W = U[0] === "-" ? 1 : 0;
    for (; _ >= W + 4; _ -= 3)
      o = `_${U.slice(_ - 3, _)}${o}`;
    return `${U.slice(0, _)}${o}`;
  }
  function se(U, o, _) {
    Re(o, "offset"), (U[o] === void 0 || U[o + _] === void 0) && Pe(o, U.length - (_ + 1));
  }
  function Ee(U, o, _, W, ue, J) {
    if (U > _ || U < o) {
      const he = typeof o == "bigint" ? "n" : "";
      let k;
      throw o === 0 || o === BigInt(0) ? k = `>= 0${he} and < 2${he} ** ${(J + 1) * 8}${he}` : k = `>= -(2${he} ** ${(J + 1) * 8 - 1}${he}) and < 2 ** ${(J + 1) * 8 - 1}${he}`, new F.ERR_OUT_OF_RANGE("value", k, U);
    }
    se(W, ue, J);
  }
  function Re(U, o) {
    if (typeof U != "number")
      throw new F.ERR_INVALID_ARG_TYPE(o, "number", U);
  }
  function Pe(U, o, _) {
    throw Math.floor(U) !== U ? (Re(U, _), new F.ERR_OUT_OF_RANGE("offset", "an integer", U)) : o < 0 ? new F.ERR_BUFFER_OUT_OF_BOUNDS() : new F.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${o}`,
      U
    );
  }
  const Oe = /[^+/0-9A-Za-z-_]/g;
  function te(U) {
    if (U = U.split("=")[0], U = U.trim().replace(Oe, ""), U.length < 2) return "";
    for (; U.length % 4 !== 0; )
      U = U + "=";
    return U;
  }
  function $e(U, o) {
    o = o || 1 / 0;
    let _;
    const W = U.length;
    let ue = null;
    const J = [];
    for (let he = 0; he < W; ++he) {
      if (_ = U.charCodeAt(he), _ > 55295 && _ < 57344) {
        if (!ue) {
          if (_ > 56319) {
            (o -= 3) > -1 && J.push(239, 191, 189);
            continue;
          } else if (he + 1 === W) {
            (o -= 3) > -1 && J.push(239, 191, 189);
            continue;
          }
          ue = _;
          continue;
        }
        if (_ < 56320) {
          (o -= 3) > -1 && J.push(239, 191, 189), ue = _;
          continue;
        }
        _ = (ue - 55296 << 10 | _ - 56320) + 65536;
      } else ue && (o -= 3) > -1 && J.push(239, 191, 189);
      if (ue = null, _ < 128) {
        if ((o -= 1) < 0) break;
        J.push(_);
      } else if (_ < 2048) {
        if ((o -= 2) < 0) break;
        J.push(
          _ >> 6 | 192,
          _ & 63 | 128
        );
      } else if (_ < 65536) {
        if ((o -= 3) < 0) break;
        J.push(
          _ >> 12 | 224,
          _ >> 6 & 63 | 128,
          _ & 63 | 128
        );
      } else if (_ < 1114112) {
        if ((o -= 4) < 0) break;
        J.push(
          _ >> 18 | 240,
          _ >> 12 & 63 | 128,
          _ >> 6 & 63 | 128,
          _ & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return J;
  }
  function Ce(U) {
    const o = [];
    for (let _ = 0; _ < U.length; ++_)
      o.push(U.charCodeAt(_) & 255);
    return o;
  }
  function Te(U, o) {
    let _, W, ue;
    const J = [];
    for (let he = 0; he < U.length && !((o -= 2) < 0); ++he)
      _ = U.charCodeAt(he), W = _ >> 8, ue = _ % 256, J.push(ue), J.push(W);
    return J;
  }
  function Ue(U) {
    return e.toByteArray(te(U));
  }
  function ge(U, o, _, W) {
    let ue;
    for (ue = 0; ue < W && !(ue + _ >= o.length || ue >= U.length); ++ue)
      o[ue + _] = U[ue];
    return ue;
  }
  function Se(U, o) {
    return U instanceof o || U != null && U.constructor != null && U.constructor.name != null && U.constructor.name === o.name;
  }
  function Le(U) {
    return U !== U;
  }
  const Me = (function() {
    const U = "0123456789abcdef", o = new Array(256);
    for (let _ = 0; _ < 16; ++_) {
      const W = _ * 16;
      for (let ue = 0; ue < 16; ++ue)
        o[W + ue] = U[_] + U[ue];
    }
    return o;
  })();
  function ke(U) {
    return typeof BigInt > "u" ? He : U;
  }
  function He() {
    throw new Error("BigInt not supported");
  }
})(buffer$2);
const Buffer = buffer$2.Buffer;
function getDefaultExportFromCjs(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var browser$4 = { exports: {} }, process = browser$4.exports = {}, cachedSetTimeout, cachedClearTimeout;
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? cachedSetTimeout = setTimeout : cachedSetTimeout = defaultSetTimout;
  } catch {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    typeof clearTimeout == "function" ? cachedClearTimeout = clearTimeout : cachedClearTimeout = defaultClearTimeout;
  } catch {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(t) {
  if (cachedSetTimeout === setTimeout)
    return setTimeout(t, 0);
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout)
    return cachedSetTimeout = setTimeout, setTimeout(t, 0);
  try {
    return cachedSetTimeout(t, 0);
  } catch {
    try {
      return cachedSetTimeout.call(null, t, 0);
    } catch {
      return cachedSetTimeout.call(this, t, 0);
    }
  }
}
function runClearTimeout(t) {
  if (cachedClearTimeout === clearTimeout)
    return clearTimeout(t);
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout)
    return cachedClearTimeout = clearTimeout, clearTimeout(t);
  try {
    return cachedClearTimeout(t);
  } catch {
    try {
      return cachedClearTimeout.call(null, t);
    } catch {
      return cachedClearTimeout.call(this, t);
    }
  }
}
var queue = [], draining = !1, currentQueue, queueIndex = -1;
function cleanUpNextTick() {
  !draining || !currentQueue || (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
}
function drainQueue() {
  if (!draining) {
    var t = runTimeout(cleanUpNextTick);
    draining = !0;
    for (var e = queue.length; e; ) {
      for (currentQueue = queue, queue = []; ++queueIndex < e; )
        currentQueue && currentQueue[queueIndex].run();
      queueIndex = -1, e = queue.length;
    }
    currentQueue = null, draining = !1, runClearTimeout(t);
  }
}
process.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var n = 1; n < arguments.length; n++)
      e[n - 1] = arguments[n];
  queue.push(new Item(t, e)), queue.length === 1 && !draining && runTimeout(drainQueue);
};
function Item(t, e) {
  this.fun = t, this.array = e;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = !0;
process.env = {};
process.argv = [];
process.version = "";
process.versions = {};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(t) {
  return [];
};
process.binding = function(t) {
  throw new Error("process.binding is not supported");
};
process.cwd = function() {
  return "/";
};
process.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
process.umask = function() {
  return 0;
};
var browserExports = browser$4.exports;
const process$1 = /* @__PURE__ */ getDefaultExportFromCjs(browserExports);
var lib = {}, dist = {}, hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, (function(t) {
    Object.defineProperties(t, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
    var e = {}, n = {};
    n.byteLength = l, n.toByteArray = w, n.fromByteArray = q;
    for (var s = [], r = [], a = typeof Uint8Array < "u" ? Uint8Array : Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", u = 0, h = f.length; u < h; ++u)
      s[u] = f[u], r[f.charCodeAt(u)] = u;
    r[45] = 62, r[95] = 63;
    function g(P) {
      var E = P.length;
      if (E % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var I = P.indexOf("=");
      I === -1 && (I = E);
      var A = I === E ? 0 : 4 - I % 4;
      return [I, A];
    }
    function l(P) {
      var E = g(P), I = E[0], A = E[1];
      return (I + A) * 3 / 4 - A;
    }
    function m(P, E, I) {
      return (E + I) * 3 / 4 - I;
    }
    function w(P) {
      var E, I = g(P), A = I[0], $ = I[1], x = new a(m(P, A, $)), M = 0, V = $ > 0 ? A - 4 : A, C;
      for (C = 0; C < V; C += 4)
        E = r[P.charCodeAt(C)] << 18 | r[P.charCodeAt(C + 1)] << 12 | r[P.charCodeAt(C + 2)] << 6 | r[P.charCodeAt(C + 3)], x[M++] = E >> 16 & 255, x[M++] = E >> 8 & 255, x[M++] = E & 255;
      return $ === 2 && (E = r[P.charCodeAt(C)] << 2 | r[P.charCodeAt(C + 1)] >> 4, x[M++] = E & 255), $ === 1 && (E = r[P.charCodeAt(C)] << 10 | r[P.charCodeAt(C + 1)] << 4 | r[P.charCodeAt(C + 2)] >> 2, x[M++] = E >> 8 & 255, x[M++] = E & 255), x;
    }
    function R(P) {
      return s[P >> 18 & 63] + s[P >> 12 & 63] + s[P >> 6 & 63] + s[P & 63];
    }
    function p(P, E, I) {
      for (var A, $ = [], x = E; x < I; x += 3)
        A = (P[x] << 16 & 16711680) + (P[x + 1] << 8 & 65280) + (P[x + 2] & 255), $.push(R(A));
      return $.join("");
    }
    function q(P) {
      for (var E, I = P.length, A = I % 3, $ = [], x = 16383, M = 0, V = I - A; M < V; M += x)
        $.push(p(P, M, M + x > V ? V : M + x));
      return A === 1 ? (E = P[I - 1], $.push(
        s[E >> 2] + s[E << 4 & 63] + "=="
      )) : A === 2 && (E = (P[I - 2] << 8) + P[I - 1], $.push(
        s[E >> 10] + s[E >> 4 & 63] + s[E << 2 & 63] + "="
      )), $.join("");
    }
    var c = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    c.read = function(P, E, I, A, $) {
      var x, M, V = $ * 8 - A - 1, C = (1 << V) - 1, z = C >> 1, y = -7, D = I ? $ - 1 : 0, ie = I ? -1 : 1, de = P[E + D];
      for (D += ie, x = de & (1 << -y) - 1, de >>= -y, y += V; y > 0; x = x * 256 + P[E + D], D += ie, y -= 8)
        ;
      for (M = x & (1 << -y) - 1, x >>= -y, y += A; y > 0; M = M * 256 + P[E + D], D += ie, y -= 8)
        ;
      if (x === 0)
        x = 1 - z;
      else {
        if (x === C)
          return M ? NaN : (de ? -1 : 1) * (1 / 0);
        M = M + Math.pow(2, A), x = x - z;
      }
      return (de ? -1 : 1) * M * Math.pow(2, x - A);
    }, c.write = function(P, E, I, A, $, x) {
      var M, V, C, z = x * 8 - $ - 1, y = (1 << z) - 1, D = y >> 1, ie = $ === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, de = A ? 0 : x - 1, we = A ? 1 : -1, be = E < 0 || E === 0 && 1 / E < 0 ? 1 : 0;
      for (E = Math.abs(E), isNaN(E) || E === 1 / 0 ? (V = isNaN(E) ? 1 : 0, M = y) : (M = Math.floor(Math.log(E) / Math.LN2), E * (C = Math.pow(2, -M)) < 1 && (M--, C *= 2), M + D >= 1 ? E += ie / C : E += ie * Math.pow(2, 1 - D), E * C >= 2 && (M++, C /= 2), M + D >= y ? (V = 0, M = y) : M + D >= 1 ? (V = (E * C - 1) * Math.pow(2, $), M = M + D) : (V = E * Math.pow(2, D - 1) * Math.pow(2, $), M = 0)); $ >= 8; P[I + de] = V & 255, de += we, V /= 256, $ -= 8)
        ;
      for (M = M << $ | V, z += $; z > 0; P[I + de] = M & 255, de += we, M /= 256, z -= 8)
        ;
      P[I + de - we] |= be * 128;
    };
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    (function(P) {
      const E = n, I = c, A = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      P.Buffer = y, P.SlowBuffer = X, P.INSPECT_MAX_BYTES = 50;
      const $ = 2147483647;
      P.kMaxLength = $;
      const { Uint8Array: x, ArrayBuffer: M, SharedArrayBuffer: V } = globalThis;
      y.TYPED_ARRAY_SUPPORT = C(), !y.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function C() {
        try {
          const b = new x(1), d = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(d, x.prototype), Object.setPrototypeOf(b, d), b.foo() === 42;
        } catch {
          return !1;
        }
      }
      Object.defineProperty(y.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (y.isBuffer(this))
            return this.buffer;
        }
      }), Object.defineProperty(y.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (y.isBuffer(this))
            return this.byteOffset;
        }
      });
      function z(b) {
        if (b > $)
          throw new RangeError('The value "' + b + '" is invalid for option "size"');
        const d = new x(b);
        return Object.setPrototypeOf(d, y.prototype), d;
      }
      function y(b, d, T) {
        if (typeof b == "number") {
          if (typeof d == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return we(b);
        }
        return D(b, d, T);
      }
      y.poolSize = 8192;
      function D(b, d, T) {
        if (typeof b == "string")
          return be(b, d);
        if (M.isView(b))
          return fe(b);
        if (b == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b
          );
        if (Z(b, M) || b && Z(b.buffer, M) || typeof V < "u" && (Z(b, V) || b && Z(b.buffer, V)))
          return j(b, d, T);
        if (typeof b == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const Q = b.valueOf && b.valueOf();
        if (Q != null && Q !== b)
          return y.from(Q, d, T);
        const ye = pe(b);
        if (ye) return ye;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof b[Symbol.toPrimitive] == "function")
          return y.from(b[Symbol.toPrimitive]("string"), d, T);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b
        );
      }
      y.from = function(b, d, T) {
        return D(b, d, T);
      }, Object.setPrototypeOf(y.prototype, x.prototype), Object.setPrototypeOf(y, x);
      function ie(b) {
        if (typeof b != "number")
          throw new TypeError('"size" argument must be of type number');
        if (b < 0)
          throw new RangeError('The value "' + b + '" is invalid for option "size"');
      }
      function de(b, d, T) {
        return ie(b), b <= 0 ? z(b) : d !== void 0 ? typeof T == "string" ? z(b).fill(d, T) : z(b).fill(d) : z(b);
      }
      y.alloc = function(b, d, T) {
        return de(b, d, T);
      };
      function we(b) {
        return ie(b), z(b < 0 ? 0 : ee(b) | 0);
      }
      y.allocUnsafe = function(b) {
        return we(b);
      }, y.allocUnsafeSlow = function(b) {
        return we(b);
      };
      function be(b, d) {
        if ((typeof d != "string" || d === "") && (d = "utf8"), !y.isEncoding(d))
          throw new TypeError("Unknown encoding: " + d);
        const T = G(b, d) | 0;
        let Q = z(T);
        const ye = Q.write(b, d);
        return ye !== T && (Q = Q.slice(0, ye)), Q;
      }
      function ce(b) {
        const d = b.length < 0 ? 0 : ee(b.length) | 0, T = z(d);
        for (let Q = 0; Q < d; Q += 1)
          T[Q] = b[Q] & 255;
        return T;
      }
      function fe(b) {
        if (Z(b, x)) {
          const d = new x(b);
          return j(d.buffer, d.byteOffset, d.byteLength);
        }
        return ce(b);
      }
      function j(b, d, T) {
        if (d < 0 || b.byteLength < d)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (b.byteLength < d + (T || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let Q;
        return d === void 0 && T === void 0 ? Q = new x(b) : T === void 0 ? Q = new x(b, d) : Q = new x(b, d, T), Object.setPrototypeOf(Q, y.prototype), Q;
      }
      function pe(b) {
        if (y.isBuffer(b)) {
          const d = ee(b.length) | 0, T = z(d);
          return T.length === 0 || b.copy(T, 0, 0, d), T;
        }
        if (b.length !== void 0)
          return typeof b.length != "number" || _e(b.length) ? z(0) : ce(b);
        if (b.type === "Buffer" && Array.isArray(b.data))
          return ce(b.data);
      }
      function ee(b) {
        if (b >= $)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + $.toString(16) + " bytes");
        return b | 0;
      }
      function X(b) {
        return +b != b && (b = 0), y.alloc(+b);
      }
      y.isBuffer = function(d) {
        return d != null && d._isBuffer === !0 && d !== y.prototype;
      }, y.compare = function(d, T) {
        if (Z(d, x) && (d = y.from(d, d.offset, d.byteLength)), Z(T, x) && (T = y.from(T, T.offset, T.byteLength)), !y.isBuffer(d) || !y.isBuffer(T))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (d === T) return 0;
        let Q = d.length, ye = T.length;
        for (let qe = 0, ae = Math.min(Q, ye); qe < ae; ++qe)
          if (d[qe] !== T[qe]) {
            Q = d[qe], ye = T[qe];
            break;
          }
        return Q < ye ? -1 : ye < Q ? 1 : 0;
      }, y.isEncoding = function(d) {
        switch (String(d).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return !0;
          default:
            return !1;
        }
      }, y.concat = function(d, T) {
        if (!Array.isArray(d))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (d.length === 0)
          return y.alloc(0);
        let Q;
        if (T === void 0)
          for (T = 0, Q = 0; Q < d.length; ++Q)
            T += d[Q].length;
        const ye = y.allocUnsafe(T);
        let qe = 0;
        for (Q = 0; Q < d.length; ++Q) {
          let ae = d[Q];
          if (Z(ae, x))
            qe + ae.length > ye.length ? (y.isBuffer(ae) || (ae = y.from(ae)), ae.copy(ye, qe)) : x.prototype.set.call(
              ye,
              ae,
              qe
            );
          else if (y.isBuffer(ae))
            ae.copy(ye, qe);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          qe += ae.length;
        }
        return ye;
      };
      function G(b, d) {
        if (y.isBuffer(b))
          return b.length;
        if (M.isView(b) || Z(b, M))
          return b.byteLength;
        if (typeof b != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof b
          );
        const T = b.length, Q = arguments.length > 2 && arguments[2] === !0;
        if (!Q && T === 0) return 0;
        let ye = !1;
        for (; ; )
          switch (d) {
            case "ascii":
            case "latin1":
            case "binary":
              return T;
            case "utf8":
            case "utf-8":
              return Be(b).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return T * 2;
            case "hex":
              return T >>> 1;
            case "base64":
              return Ie(b).length;
            default:
              if (ye)
                return Q ? -1 : Be(b).length;
              d = ("" + d).toLowerCase(), ye = !0;
          }
      }
      y.byteLength = G;
      function le(b, d, T) {
        let Q = !1;
        if ((d === void 0 || d < 0) && (d = 0), d > this.length || ((T === void 0 || T > this.length) && (T = this.length), T <= 0) || (T >>>= 0, d >>>= 0, T <= d))
          return "";
        for (b || (b = "utf8"); ; )
          switch (b) {
            case "hex":
              return $e(this, d, T);
            case "utf8":
            case "utf-8":
              return Ee(this, d, T);
            case "ascii":
              return Oe(this, d, T);
            case "latin1":
            case "binary":
              return te(this, d, T);
            case "base64":
              return se(this, d, T);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Ce(this, d, T);
            default:
              if (Q) throw new TypeError("Unknown encoding: " + b);
              b = (b + "").toLowerCase(), Q = !0;
          }
      }
      y.prototype._isBuffer = !0;
      function O(b, d, T) {
        const Q = b[d];
        b[d] = b[T], b[T] = Q;
      }
      y.prototype.swap16 = function() {
        const d = this.length;
        if (d % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let T = 0; T < d; T += 2)
          O(this, T, T + 1);
        return this;
      }, y.prototype.swap32 = function() {
        const d = this.length;
        if (d % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let T = 0; T < d; T += 4)
          O(this, T, T + 3), O(this, T + 1, T + 2);
        return this;
      }, y.prototype.swap64 = function() {
        const d = this.length;
        if (d % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let T = 0; T < d; T += 8)
          O(this, T, T + 7), O(this, T + 1, T + 6), O(this, T + 2, T + 5), O(this, T + 3, T + 4);
        return this;
      }, y.prototype.toString = function() {
        const d = this.length;
        return d === 0 ? "" : arguments.length === 0 ? Ee(this, 0, d) : le.apply(this, arguments);
      }, y.prototype.toLocaleString = y.prototype.toString, y.prototype.equals = function(d) {
        if (!y.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
        return this === d ? !0 : y.compare(this, d) === 0;
      }, y.prototype.inspect = function() {
        let d = "";
        const T = P.INSPECT_MAX_BYTES;
        return d = this.toString("hex", 0, T).replace(/(.{2})/g, "$1 ").trim(), this.length > T && (d += " ... "), "<Buffer " + d + ">";
      }, A && (y.prototype[A] = y.prototype.inspect), y.prototype.compare = function(d, T, Q, ye, qe) {
        if (Z(d, x) && (d = y.from(d, d.offset, d.byteLength)), !y.isBuffer(d))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
          );
        if (T === void 0 && (T = 0), Q === void 0 && (Q = d ? d.length : 0), ye === void 0 && (ye = 0), qe === void 0 && (qe = this.length), T < 0 || Q > d.length || ye < 0 || qe > this.length)
          throw new RangeError("out of range index");
        if (ye >= qe && T >= Q)
          return 0;
        if (ye >= qe)
          return -1;
        if (T >= Q)
          return 1;
        if (T >>>= 0, Q >>>= 0, ye >>>= 0, qe >>>= 0, this === d) return 0;
        let ae = qe - ye, oe = Q - T;
        const me = Math.min(ae, oe), xe = this.slice(ye, qe), Ae = d.slice(T, Q);
        for (let je = 0; je < me; ++je)
          if (xe[je] !== Ae[je]) {
            ae = xe[je], oe = Ae[je];
            break;
          }
        return ae < oe ? -1 : oe < ae ? 1 : 0;
      };
      function B(b, d, T, Q, ye) {
        if (b.length === 0) return -1;
        if (typeof T == "string" ? (Q = T, T = 0) : T > 2147483647 ? T = 2147483647 : T < -2147483648 && (T = -2147483648), T = +T, _e(T) && (T = ye ? 0 : b.length - 1), T < 0 && (T = b.length + T), T >= b.length) {
          if (ye) return -1;
          T = b.length - 1;
        } else if (T < 0)
          if (ye) T = 0;
          else return -1;
        if (typeof d == "string" && (d = y.from(d, Q)), y.isBuffer(d))
          return d.length === 0 ? -1 : N(b, d, T, Q, ye);
        if (typeof d == "number")
          return d = d & 255, typeof x.prototype.indexOf == "function" ? ye ? x.prototype.indexOf.call(b, d, T) : x.prototype.lastIndexOf.call(b, d, T) : N(b, [d], T, Q, ye);
        throw new TypeError("val must be string, number or Buffer");
      }
      function N(b, d, T, Q, ye) {
        let qe = 1, ae = b.length, oe = d.length;
        if (Q !== void 0 && (Q = String(Q).toLowerCase(), Q === "ucs2" || Q === "ucs-2" || Q === "utf16le" || Q === "utf-16le")) {
          if (b.length < 2 || d.length < 2)
            return -1;
          qe = 2, ae /= 2, oe /= 2, T /= 2;
        }
        function me(Ae, je) {
          return qe === 1 ? Ae[je] : Ae.readUInt16BE(je * qe);
        }
        let xe;
        if (ye) {
          let Ae = -1;
          for (xe = T; xe < ae; xe++)
            if (me(b, xe) === me(d, Ae === -1 ? 0 : xe - Ae)) {
              if (Ae === -1 && (Ae = xe), xe - Ae + 1 === oe) return Ae * qe;
            } else
              Ae !== -1 && (xe -= xe - Ae), Ae = -1;
        } else
          for (T + oe > ae && (T = ae - oe), xe = T; xe >= 0; xe--) {
            let Ae = !0;
            for (let je = 0; je < oe; je++)
              if (me(b, xe + je) !== me(d, je)) {
                Ae = !1;
                break;
              }
            if (Ae) return xe;
          }
        return -1;
      }
      y.prototype.includes = function(d, T, Q) {
        return this.indexOf(d, T, Q) !== -1;
      }, y.prototype.indexOf = function(d, T, Q) {
        return B(this, d, T, Q, !0);
      }, y.prototype.lastIndexOf = function(d, T, Q) {
        return B(this, d, T, Q, !1);
      };
      function re(b, d, T, Q) {
        T = Number(T) || 0;
        const ye = b.length - T;
        Q ? (Q = Number(Q), Q > ye && (Q = ye)) : Q = ye;
        const qe = d.length;
        Q > qe / 2 && (Q = qe / 2);
        let ae;
        for (ae = 0; ae < Q; ++ae) {
          const oe = parseInt(d.substr(ae * 2, 2), 16);
          if (_e(oe)) return ae;
          b[T + ae] = oe;
        }
        return ae;
      }
      function ne(b, d, T, Q) {
        return Fe(Be(d, b.length - T), b, T, Q);
      }
      function F(b, d, T, Q) {
        return Fe(We(d), b, T, Q);
      }
      function L(b, d, T, Q) {
        return Fe(Ie(d), b, T, Q);
      }
      function H(b, d, T, Q) {
        return Fe(S(d, b.length - T), b, T, Q);
      }
      y.prototype.write = function(d, T, Q, ye) {
        if (T === void 0)
          ye = "utf8", Q = this.length, T = 0;
        else if (Q === void 0 && typeof T == "string")
          ye = T, Q = this.length, T = 0;
        else if (isFinite(T))
          T = T >>> 0, isFinite(Q) ? (Q = Q >>> 0, ye === void 0 && (ye = "utf8")) : (ye = Q, Q = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const qe = this.length - T;
        if ((Q === void 0 || Q > qe) && (Q = qe), d.length > 0 && (Q < 0 || T < 0) || T > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        ye || (ye = "utf8");
        let ae = !1;
        for (; ; )
          switch (ye) {
            case "hex":
              return re(this, d, T, Q);
            case "utf8":
            case "utf-8":
              return ne(this, d, T, Q);
            case "ascii":
            case "latin1":
            case "binary":
              return F(this, d, T, Q);
            case "base64":
              return L(this, d, T, Q);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return H(this, d, T, Q);
            default:
              if (ae) throw new TypeError("Unknown encoding: " + ye);
              ye = ("" + ye).toLowerCase(), ae = !0;
          }
      }, y.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function se(b, d, T) {
        return d === 0 && T === b.length ? E.fromByteArray(b) : E.fromByteArray(b.slice(d, T));
      }
      function Ee(b, d, T) {
        T = Math.min(b.length, T);
        const Q = [];
        let ye = d;
        for (; ye < T; ) {
          const qe = b[ye];
          let ae = null, oe = qe > 239 ? 4 : qe > 223 ? 3 : qe > 191 ? 2 : 1;
          if (ye + oe <= T) {
            let me, xe, Ae, je;
            switch (oe) {
              case 1:
                qe < 128 && (ae = qe);
                break;
              case 2:
                me = b[ye + 1], (me & 192) === 128 && (je = (qe & 31) << 6 | me & 63, je > 127 && (ae = je));
                break;
              case 3:
                me = b[ye + 1], xe = b[ye + 2], (me & 192) === 128 && (xe & 192) === 128 && (je = (qe & 15) << 12 | (me & 63) << 6 | xe & 63, je > 2047 && (je < 55296 || je > 57343) && (ae = je));
                break;
              case 4:
                me = b[ye + 1], xe = b[ye + 2], Ae = b[ye + 3], (me & 192) === 128 && (xe & 192) === 128 && (Ae & 192) === 128 && (je = (qe & 15) << 18 | (me & 63) << 12 | (xe & 63) << 6 | Ae & 63, je > 65535 && je < 1114112 && (ae = je));
            }
          }
          ae === null ? (ae = 65533, oe = 1) : ae > 65535 && (ae -= 65536, Q.push(ae >>> 10 & 1023 | 55296), ae = 56320 | ae & 1023), Q.push(ae), ye += oe;
        }
        return Pe(Q);
      }
      const Re = 4096;
      function Pe(b) {
        const d = b.length;
        if (d <= Re)
          return String.fromCharCode.apply(String, b);
        let T = "", Q = 0;
        for (; Q < d; )
          T += String.fromCharCode.apply(
            String,
            b.slice(Q, Q += Re)
          );
        return T;
      }
      function Oe(b, d, T) {
        let Q = "";
        T = Math.min(b.length, T);
        for (let ye = d; ye < T; ++ye)
          Q += String.fromCharCode(b[ye] & 127);
        return Q;
      }
      function te(b, d, T) {
        let Q = "";
        T = Math.min(b.length, T);
        for (let ye = d; ye < T; ++ye)
          Q += String.fromCharCode(b[ye]);
        return Q;
      }
      function $e(b, d, T) {
        const Q = b.length;
        (!d || d < 0) && (d = 0), (!T || T < 0 || T > Q) && (T = Q);
        let ye = "";
        for (let qe = d; qe < T; ++qe)
          ye += De[b[qe]];
        return ye;
      }
      function Ce(b, d, T) {
        const Q = b.slice(d, T);
        let ye = "";
        for (let qe = 0; qe < Q.length - 1; qe += 2)
          ye += String.fromCharCode(Q[qe] + Q[qe + 1] * 256);
        return ye;
      }
      y.prototype.slice = function(d, T) {
        const Q = this.length;
        d = ~~d, T = T === void 0 ? Q : ~~T, d < 0 ? (d += Q, d < 0 && (d = 0)) : d > Q && (d = Q), T < 0 ? (T += Q, T < 0 && (T = 0)) : T > Q && (T = Q), T < d && (T = d);
        const ye = this.subarray(d, T);
        return Object.setPrototypeOf(ye, y.prototype), ye;
      };
      function Te(b, d, T) {
        if (b % 1 !== 0 || b < 0) throw new RangeError("offset is not uint");
        if (b + d > T) throw new RangeError("Trying to access beyond buffer length");
      }
      y.prototype.readUintLE = y.prototype.readUIntLE = function(d, T, Q) {
        d = d >>> 0, T = T >>> 0, Q || Te(d, T, this.length);
        let ye = this[d], qe = 1, ae = 0;
        for (; ++ae < T && (qe *= 256); )
          ye += this[d + ae] * qe;
        return ye;
      }, y.prototype.readUintBE = y.prototype.readUIntBE = function(d, T, Q) {
        d = d >>> 0, T = T >>> 0, Q || Te(d, T, this.length);
        let ye = this[d + --T], qe = 1;
        for (; T > 0 && (qe *= 256); )
          ye += this[d + --T] * qe;
        return ye;
      }, y.prototype.readUint8 = y.prototype.readUInt8 = function(d, T) {
        return d = d >>> 0, T || Te(d, 1, this.length), this[d];
      }, y.prototype.readUint16LE = y.prototype.readUInt16LE = function(d, T) {
        return d = d >>> 0, T || Te(d, 2, this.length), this[d] | this[d + 1] << 8;
      }, y.prototype.readUint16BE = y.prototype.readUInt16BE = function(d, T) {
        return d = d >>> 0, T || Te(d, 2, this.length), this[d] << 8 | this[d + 1];
      }, y.prototype.readUint32LE = y.prototype.readUInt32LE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), (this[d] | this[d + 1] << 8 | this[d + 2] << 16) + this[d + 3] * 16777216;
      }, y.prototype.readUint32BE = y.prototype.readUInt32BE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), this[d] * 16777216 + (this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3]);
      }, y.prototype.readBigUInt64LE = Ge(function(d) {
        d = d >>> 0, ue(d, "offset");
        const T = this[d], Q = this[d + 7];
        (T === void 0 || Q === void 0) && J(d, this.length - 8);
        const ye = T + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, qe = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + Q * 2 ** 24;
        return BigInt(ye) + (BigInt(qe) << BigInt(32));
      }), y.prototype.readBigUInt64BE = Ge(function(d) {
        d = d >>> 0, ue(d, "offset");
        const T = this[d], Q = this[d + 7];
        (T === void 0 || Q === void 0) && J(d, this.length - 8);
        const ye = T * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], qe = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + Q;
        return (BigInt(ye) << BigInt(32)) + BigInt(qe);
      }), y.prototype.readIntLE = function(d, T, Q) {
        d = d >>> 0, T = T >>> 0, Q || Te(d, T, this.length);
        let ye = this[d], qe = 1, ae = 0;
        for (; ++ae < T && (qe *= 256); )
          ye += this[d + ae] * qe;
        return qe *= 128, ye >= qe && (ye -= Math.pow(2, 8 * T)), ye;
      }, y.prototype.readIntBE = function(d, T, Q) {
        d = d >>> 0, T = T >>> 0, Q || Te(d, T, this.length);
        let ye = T, qe = 1, ae = this[d + --ye];
        for (; ye > 0 && (qe *= 256); )
          ae += this[d + --ye] * qe;
        return qe *= 128, ae >= qe && (ae -= Math.pow(2, 8 * T)), ae;
      }, y.prototype.readInt8 = function(d, T) {
        return d = d >>> 0, T || Te(d, 1, this.length), this[d] & 128 ? (255 - this[d] + 1) * -1 : this[d];
      }, y.prototype.readInt16LE = function(d, T) {
        d = d >>> 0, T || Te(d, 2, this.length);
        const Q = this[d] | this[d + 1] << 8;
        return Q & 32768 ? Q | 4294901760 : Q;
      }, y.prototype.readInt16BE = function(d, T) {
        d = d >>> 0, T || Te(d, 2, this.length);
        const Q = this[d + 1] | this[d] << 8;
        return Q & 32768 ? Q | 4294901760 : Q;
      }, y.prototype.readInt32LE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), this[d] | this[d + 1] << 8 | this[d + 2] << 16 | this[d + 3] << 24;
      }, y.prototype.readInt32BE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), this[d] << 24 | this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3];
      }, y.prototype.readBigInt64LE = Ge(function(d) {
        d = d >>> 0, ue(d, "offset");
        const T = this[d], Q = this[d + 7];
        (T === void 0 || Q === void 0) && J(d, this.length - 8);
        const ye = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (Q << 24);
        return (BigInt(ye) << BigInt(32)) + BigInt(T + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
      }), y.prototype.readBigInt64BE = Ge(function(d) {
        d = d >>> 0, ue(d, "offset");
        const T = this[d], Q = this[d + 7];
        (T === void 0 || Q === void 0) && J(d, this.length - 8);
        const ye = (T << 24) + // Overflow
        this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
        return (BigInt(ye) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + Q);
      }), y.prototype.readFloatLE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), I.read(this, d, !0, 23, 4);
      }, y.prototype.readFloatBE = function(d, T) {
        return d = d >>> 0, T || Te(d, 4, this.length), I.read(this, d, !1, 23, 4);
      }, y.prototype.readDoubleLE = function(d, T) {
        return d = d >>> 0, T || Te(d, 8, this.length), I.read(this, d, !0, 52, 8);
      }, y.prototype.readDoubleBE = function(d, T) {
        return d = d >>> 0, T || Te(d, 8, this.length), I.read(this, d, !1, 52, 8);
      };
      function Ue(b, d, T, Q, ye, qe) {
        if (!y.isBuffer(b)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (d > ye || d < qe) throw new RangeError('"value" argument is out of bounds');
        if (T + Q > b.length) throw new RangeError("Index out of range");
      }
      y.prototype.writeUintLE = y.prototype.writeUIntLE = function(d, T, Q, ye) {
        if (d = +d, T = T >>> 0, Q = Q >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Q) - 1;
          Ue(this, d, T, Q, oe, 0);
        }
        let qe = 1, ae = 0;
        for (this[T] = d & 255; ++ae < Q && (qe *= 256); )
          this[T + ae] = d / qe & 255;
        return T + Q;
      }, y.prototype.writeUintBE = y.prototype.writeUIntBE = function(d, T, Q, ye) {
        if (d = +d, T = T >>> 0, Q = Q >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Q) - 1;
          Ue(this, d, T, Q, oe, 0);
        }
        let qe = Q - 1, ae = 1;
        for (this[T + qe] = d & 255; --qe >= 0 && (ae *= 256); )
          this[T + qe] = d / ae & 255;
        return T + Q;
      }, y.prototype.writeUint8 = y.prototype.writeUInt8 = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 1, 255, 0), this[T] = d & 255, T + 1;
      }, y.prototype.writeUint16LE = y.prototype.writeUInt16LE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 2, 65535, 0), this[T] = d & 255, this[T + 1] = d >>> 8, T + 2;
      }, y.prototype.writeUint16BE = y.prototype.writeUInt16BE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 2, 65535, 0), this[T] = d >>> 8, this[T + 1] = d & 255, T + 2;
      }, y.prototype.writeUint32LE = y.prototype.writeUInt32LE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 4, 4294967295, 0), this[T + 3] = d >>> 24, this[T + 2] = d >>> 16, this[T + 1] = d >>> 8, this[T] = d & 255, T + 4;
      }, y.prototype.writeUint32BE = y.prototype.writeUInt32BE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 4, 4294967295, 0), this[T] = d >>> 24, this[T + 1] = d >>> 16, this[T + 2] = d >>> 8, this[T + 3] = d & 255, T + 4;
      };
      function ge(b, d, T, Q, ye) {
        W(d, Q, ye, b, T, 7);
        let qe = Number(d & BigInt(4294967295));
        b[T++] = qe, qe = qe >> 8, b[T++] = qe, qe = qe >> 8, b[T++] = qe, qe = qe >> 8, b[T++] = qe;
        let ae = Number(d >> BigInt(32) & BigInt(4294967295));
        return b[T++] = ae, ae = ae >> 8, b[T++] = ae, ae = ae >> 8, b[T++] = ae, ae = ae >> 8, b[T++] = ae, T;
      }
      function Se(b, d, T, Q, ye) {
        W(d, Q, ye, b, T, 7);
        let qe = Number(d & BigInt(4294967295));
        b[T + 7] = qe, qe = qe >> 8, b[T + 6] = qe, qe = qe >> 8, b[T + 5] = qe, qe = qe >> 8, b[T + 4] = qe;
        let ae = Number(d >> BigInt(32) & BigInt(4294967295));
        return b[T + 3] = ae, ae = ae >> 8, b[T + 2] = ae, ae = ae >> 8, b[T + 1] = ae, ae = ae >> 8, b[T] = ae, T + 8;
      }
      y.prototype.writeBigUInt64LE = Ge(function(d, T = 0) {
        return ge(this, d, T, BigInt(0), BigInt("0xffffffffffffffff"));
      }), y.prototype.writeBigUInt64BE = Ge(function(d, T = 0) {
        return Se(this, d, T, BigInt(0), BigInt("0xffffffffffffffff"));
      }), y.prototype.writeIntLE = function(d, T, Q, ye) {
        if (d = +d, T = T >>> 0, !ye) {
          const me = Math.pow(2, 8 * Q - 1);
          Ue(this, d, T, Q, me - 1, -me);
        }
        let qe = 0, ae = 1, oe = 0;
        for (this[T] = d & 255; ++qe < Q && (ae *= 256); )
          d < 0 && oe === 0 && this[T + qe - 1] !== 0 && (oe = 1), this[T + qe] = (d / ae >> 0) - oe & 255;
        return T + Q;
      }, y.prototype.writeIntBE = function(d, T, Q, ye) {
        if (d = +d, T = T >>> 0, !ye) {
          const me = Math.pow(2, 8 * Q - 1);
          Ue(this, d, T, Q, me - 1, -me);
        }
        let qe = Q - 1, ae = 1, oe = 0;
        for (this[T + qe] = d & 255; --qe >= 0 && (ae *= 256); )
          d < 0 && oe === 0 && this[T + qe + 1] !== 0 && (oe = 1), this[T + qe] = (d / ae >> 0) - oe & 255;
        return T + Q;
      }, y.prototype.writeInt8 = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 1, 127, -128), d < 0 && (d = 255 + d + 1), this[T] = d & 255, T + 1;
      }, y.prototype.writeInt16LE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 2, 32767, -32768), this[T] = d & 255, this[T + 1] = d >>> 8, T + 2;
      }, y.prototype.writeInt16BE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 2, 32767, -32768), this[T] = d >>> 8, this[T + 1] = d & 255, T + 2;
      }, y.prototype.writeInt32LE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 4, 2147483647, -2147483648), this[T] = d & 255, this[T + 1] = d >>> 8, this[T + 2] = d >>> 16, this[T + 3] = d >>> 24, T + 4;
      }, y.prototype.writeInt32BE = function(d, T, Q) {
        return d = +d, T = T >>> 0, Q || Ue(this, d, T, 4, 2147483647, -2147483648), d < 0 && (d = 4294967295 + d + 1), this[T] = d >>> 24, this[T + 1] = d >>> 16, this[T + 2] = d >>> 8, this[T + 3] = d & 255, T + 4;
      }, y.prototype.writeBigInt64LE = Ge(function(d, T = 0) {
        return ge(this, d, T, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), y.prototype.writeBigInt64BE = Ge(function(d, T = 0) {
        return Se(this, d, T, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function Le(b, d, T, Q, ye, qe) {
        if (T + Q > b.length) throw new RangeError("Index out of range");
        if (T < 0) throw new RangeError("Index out of range");
      }
      function Me(b, d, T, Q, ye) {
        return d = +d, T = T >>> 0, ye || Le(b, d, T, 4), I.write(b, d, T, Q, 23, 4), T + 4;
      }
      y.prototype.writeFloatLE = function(d, T, Q) {
        return Me(this, d, T, !0, Q);
      }, y.prototype.writeFloatBE = function(d, T, Q) {
        return Me(this, d, T, !1, Q);
      };
      function ke(b, d, T, Q, ye) {
        return d = +d, T = T >>> 0, ye || Le(b, d, T, 8), I.write(b, d, T, Q, 52, 8), T + 8;
      }
      y.prototype.writeDoubleLE = function(d, T, Q) {
        return ke(this, d, T, !0, Q);
      }, y.prototype.writeDoubleBE = function(d, T, Q) {
        return ke(this, d, T, !1, Q);
      }, y.prototype.copy = function(d, T, Q, ye) {
        if (!y.isBuffer(d)) throw new TypeError("argument should be a Buffer");
        if (Q || (Q = 0), !ye && ye !== 0 && (ye = this.length), T >= d.length && (T = d.length), T || (T = 0), ye > 0 && ye < Q && (ye = Q), ye === Q || d.length === 0 || this.length === 0) return 0;
        if (T < 0)
          throw new RangeError("targetStart out of bounds");
        if (Q < 0 || Q >= this.length) throw new RangeError("Index out of range");
        if (ye < 0) throw new RangeError("sourceEnd out of bounds");
        ye > this.length && (ye = this.length), d.length - T < ye - Q && (ye = d.length - T + Q);
        const qe = ye - Q;
        return this === d && typeof x.prototype.copyWithin == "function" ? this.copyWithin(T, Q, ye) : x.prototype.set.call(
          d,
          this.subarray(Q, ye),
          T
        ), qe;
      }, y.prototype.fill = function(d, T, Q, ye) {
        if (typeof d == "string") {
          if (typeof T == "string" ? (ye = T, T = 0, Q = this.length) : typeof Q == "string" && (ye = Q, Q = this.length), ye !== void 0 && typeof ye != "string")
            throw new TypeError("encoding must be a string");
          if (typeof ye == "string" && !y.isEncoding(ye))
            throw new TypeError("Unknown encoding: " + ye);
          if (d.length === 1) {
            const ae = d.charCodeAt(0);
            (ye === "utf8" && ae < 128 || ye === "latin1") && (d = ae);
          }
        } else typeof d == "number" ? d = d & 255 : typeof d == "boolean" && (d = Number(d));
        if (T < 0 || this.length < T || this.length < Q)
          throw new RangeError("Out of range index");
        if (Q <= T)
          return this;
        T = T >>> 0, Q = Q === void 0 ? this.length : Q >>> 0, d || (d = 0);
        let qe;
        if (typeof d == "number")
          for (qe = T; qe < Q; ++qe)
            this[qe] = d;
        else {
          const ae = y.isBuffer(d) ? d : y.from(d, ye), oe = ae.length;
          if (oe === 0)
            throw new TypeError('The value "' + d + '" is invalid for argument "value"');
          for (qe = 0; qe < Q - T; ++qe)
            this[qe + T] = ae[qe % oe];
        }
        return this;
      };
      const He = {};
      function U(b, d, T) {
        He[b] = class extends T {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: d.apply(this, arguments),
              writable: !0,
              configurable: !0
            }), this.name = `${this.name} [${b}]`, this.stack, delete this.name;
          }
          get code() {
            return b;
          }
          set code(ye) {
            Object.defineProperty(this, "code", {
              configurable: !0,
              enumerable: !0,
              value: ye,
              writable: !0
            });
          }
          toString() {
            return `${this.name} [${b}]: ${this.message}`;
          }
        };
      }
      U(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(b) {
          return b ? `${b} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        },
        RangeError
      ), U(
        "ERR_INVALID_ARG_TYPE",
        function(b, d) {
          return `The "${b}" argument must be of type number. Received type ${typeof d}`;
        },
        TypeError
      ), U(
        "ERR_OUT_OF_RANGE",
        function(b, d, T) {
          let Q = `The value of "${b}" is out of range.`, ye = T;
          return Number.isInteger(T) && Math.abs(T) > 2 ** 32 ? ye = o(String(T)) : typeof T == "bigint" && (ye = String(T), (T > BigInt(2) ** BigInt(32) || T < -(BigInt(2) ** BigInt(32))) && (ye = o(ye)), ye += "n"), Q += ` It must be ${d}. Received ${ye}`, Q;
        },
        RangeError
      );
      function o(b) {
        let d = "", T = b.length;
        const Q = b[0] === "-" ? 1 : 0;
        for (; T >= Q + 4; T -= 3)
          d = `_${b.slice(T - 3, T)}${d}`;
        return `${b.slice(0, T)}${d}`;
      }
      function _(b, d, T) {
        ue(d, "offset"), (b[d] === void 0 || b[d + T] === void 0) && J(d, b.length - (T + 1));
      }
      function W(b, d, T, Q, ye, qe) {
        if (b > T || b < d) {
          const ae = typeof d == "bigint" ? "n" : "";
          let oe;
          throw d === 0 || d === BigInt(0) ? oe = `>= 0${ae} and < 2${ae} ** ${(qe + 1) * 8}${ae}` : oe = `>= -(2${ae} ** ${(qe + 1) * 8 - 1}${ae}) and < 2 ** ${(qe + 1) * 8 - 1}${ae}`, new He.ERR_OUT_OF_RANGE("value", oe, b);
        }
        _(Q, ye, qe);
      }
      function ue(b, d) {
        if (typeof b != "number")
          throw new He.ERR_INVALID_ARG_TYPE(d, "number", b);
      }
      function J(b, d, T) {
        throw Math.floor(b) !== b ? (ue(b, T), new He.ERR_OUT_OF_RANGE("offset", "an integer", b)) : d < 0 ? new He.ERR_BUFFER_OUT_OF_BOUNDS() : new He.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${d}`,
          b
        );
      }
      const he = /[^+/0-9A-Za-z-_]/g;
      function k(b) {
        if (b = b.split("=")[0], b = b.trim().replace(he, ""), b.length < 2) return "";
        for (; b.length % 4 !== 0; )
          b = b + "=";
        return b;
      }
      function Be(b, d) {
        d = d || 1 / 0;
        let T;
        const Q = b.length;
        let ye = null;
        const qe = [];
        for (let ae = 0; ae < Q; ++ae) {
          if (T = b.charCodeAt(ae), T > 55295 && T < 57344) {
            if (!ye) {
              if (T > 56319) {
                (d -= 3) > -1 && qe.push(239, 191, 189);
                continue;
              } else if (ae + 1 === Q) {
                (d -= 3) > -1 && qe.push(239, 191, 189);
                continue;
              }
              ye = T;
              continue;
            }
            if (T < 56320) {
              (d -= 3) > -1 && qe.push(239, 191, 189), ye = T;
              continue;
            }
            T = (ye - 55296 << 10 | T - 56320) + 65536;
          } else ye && (d -= 3) > -1 && qe.push(239, 191, 189);
          if (ye = null, T < 128) {
            if ((d -= 1) < 0) break;
            qe.push(T);
          } else if (T < 2048) {
            if ((d -= 2) < 0) break;
            qe.push(
              T >> 6 | 192,
              T & 63 | 128
            );
          } else if (T < 65536) {
            if ((d -= 3) < 0) break;
            qe.push(
              T >> 12 | 224,
              T >> 6 & 63 | 128,
              T & 63 | 128
            );
          } else if (T < 1114112) {
            if ((d -= 4) < 0) break;
            qe.push(
              T >> 18 | 240,
              T >> 12 & 63 | 128,
              T >> 6 & 63 | 128,
              T & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return qe;
      }
      function We(b) {
        const d = [];
        for (let T = 0; T < b.length; ++T)
          d.push(b.charCodeAt(T) & 255);
        return d;
      }
      function S(b, d) {
        let T, Q, ye;
        const qe = [];
        for (let ae = 0; ae < b.length && !((d -= 2) < 0); ++ae)
          T = b.charCodeAt(ae), Q = T >> 8, ye = T % 256, qe.push(ye), qe.push(Q);
        return qe;
      }
      function Ie(b) {
        return E.toByteArray(k(b));
      }
      function Fe(b, d, T, Q) {
        let ye;
        for (ye = 0; ye < Q && !(ye + T >= d.length || ye >= b.length); ++ye)
          d[ye + T] = b[ye];
        return ye;
      }
      function Z(b, d) {
        return b instanceof d || b != null && b.constructor != null && b.constructor.name != null && b.constructor.name === d.name;
      }
      function _e(b) {
        return b !== b;
      }
      const De = (function() {
        const b = "0123456789abcdef", d = new Array(256);
        for (let T = 0; T < 16; ++T) {
          const Q = T * 16;
          for (let ye = 0; ye < 16; ++ye)
            d[Q + ye] = b[T] + b[ye];
        }
        return d;
      })();
      function Ge(b) {
        return typeof BigInt > "u" ? K : b;
      }
      function K() {
        throw new Error("BigInt not supported");
      }
    })(e);
    const v = e.Buffer;
    t.Blob = e.Blob, t.BlobOptions = e.BlobOptions, t.Buffer = e.Buffer, t.File = e.File, t.FileOptions = e.FileOptions, t.INSPECT_MAX_BYTES = e.INSPECT_MAX_BYTES, t.SlowBuffer = e.SlowBuffer, t.TranscodeEncoding = e.TranscodeEncoding, t.atob = e.atob, t.btoa = e.btoa, t.constants = e.constants, t.default = v, t.isAscii = e.isAscii, t.isUtf8 = e.isUtf8, t.kMaxLength = e.kMaxLength, t.kStringMaxLength = e.kStringMaxLength, t.resolveObjectURL = e.resolveObjectURL, t.transcode = e.transcode;
  })(dist)), dist;
}
var events = { exports: {} }, hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var t = typeof Reflect == "object" ? Reflect : null, e = t && typeof t.apply == "function" ? t.apply : function(A, $, x) {
    return Function.prototype.apply.call(A, $, x);
  }, n;
  t && typeof t.ownKeys == "function" ? n = t.ownKeys : Object.getOwnPropertySymbols ? n = function(A) {
    return Object.getOwnPropertyNames(A).concat(Object.getOwnPropertySymbols(A));
  } : n = function(A) {
    return Object.getOwnPropertyNames(A);
  };
  function s(I) {
    console && console.warn && console.warn(I);
  }
  var r = Number.isNaN || function(A) {
    return A !== A;
  };
  function a() {
    a.init.call(this);
  }
  events.exports = a, events.exports.once = v, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._eventsCount = 0, a.prototype._maxListeners = void 0;
  var f = 10;
  function u(I) {
    if (typeof I != "function")
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof I);
  }
  Object.defineProperty(a, "defaultMaxListeners", {
    enumerable: !0,
    get: function() {
      return f;
    },
    set: function(I) {
      if (typeof I != "number" || I < 0 || r(I))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + I + ".");
      f = I;
    }
  }), a.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, a.prototype.setMaxListeners = function(A) {
    if (typeof A != "number" || A < 0 || r(A))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + A + ".");
    return this._maxListeners = A, this;
  };
  function h(I) {
    return I._maxListeners === void 0 ? a.defaultMaxListeners : I._maxListeners;
  }
  a.prototype.getMaxListeners = function() {
    return h(this);
  }, a.prototype.emit = function(A) {
    for (var $ = [], x = 1; x < arguments.length; x++) $.push(arguments[x]);
    var M = A === "error", V = this._events;
    if (V !== void 0)
      M = M && V.error === void 0;
    else if (!M)
      return !1;
    if (M) {
      var C;
      if ($.length > 0 && (C = $[0]), C instanceof Error)
        throw C;
      var z = new Error("Unhandled error." + (C ? " (" + C.message + ")" : ""));
      throw z.context = C, z;
    }
    var y = V[A];
    if (y === void 0)
      return !1;
    if (typeof y == "function")
      e(y, this, $);
    else
      for (var D = y.length, ie = p(y, D), x = 0; x < D; ++x)
        e(ie[x], this, $);
    return !0;
  };
  function g(I, A, $, x) {
    var M, V, C;
    if (u($), V = I._events, V === void 0 ? (V = I._events = /* @__PURE__ */ Object.create(null), I._eventsCount = 0) : (V.newListener !== void 0 && (I.emit(
      "newListener",
      A,
      $.listener ? $.listener : $
    ), V = I._events), C = V[A]), C === void 0)
      C = V[A] = $, ++I._eventsCount;
    else if (typeof C == "function" ? C = V[A] = x ? [$, C] : [C, $] : x ? C.unshift($) : C.push($), M = h(I), M > 0 && C.length > M && !C.warned) {
      C.warned = !0;
      var z = new Error("Possible EventEmitter memory leak detected. " + C.length + " " + String(A) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      z.name = "MaxListenersExceededWarning", z.emitter = I, z.type = A, z.count = C.length, s(z);
    }
    return I;
  }
  a.prototype.addListener = function(A, $) {
    return g(this, A, $, !1);
  }, a.prototype.on = a.prototype.addListener, a.prototype.prependListener = function(A, $) {
    return g(this, A, $, !0);
  };
  function l() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function m(I, A, $) {
    var x = { fired: !1, wrapFn: void 0, target: I, type: A, listener: $ }, M = l.bind(x);
    return M.listener = $, x.wrapFn = M, M;
  }
  a.prototype.once = function(A, $) {
    return u($), this.on(A, m(this, A, $)), this;
  }, a.prototype.prependOnceListener = function(A, $) {
    return u($), this.prependListener(A, m(this, A, $)), this;
  }, a.prototype.removeListener = function(A, $) {
    var x, M, V, C, z;
    if (u($), M = this._events, M === void 0)
      return this;
    if (x = M[A], x === void 0)
      return this;
    if (x === $ || x.listener === $)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete M[A], M.removeListener && this.emit("removeListener", A, x.listener || $));
    else if (typeof x != "function") {
      for (V = -1, C = x.length - 1; C >= 0; C--)
        if (x[C] === $ || x[C].listener === $) {
          z = x[C].listener, V = C;
          break;
        }
      if (V < 0)
        return this;
      V === 0 ? x.shift() : q(x, V), x.length === 1 && (M[A] = x[0]), M.removeListener !== void 0 && this.emit("removeListener", A, z || $);
    }
    return this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.removeAllListeners = function(A) {
    var $, x, M;
    if (x = this._events, x === void 0)
      return this;
    if (x.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : x[A] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete x[A]), this;
    if (arguments.length === 0) {
      var V = Object.keys(x), C;
      for (M = 0; M < V.length; ++M)
        C = V[M], C !== "removeListener" && this.removeAllListeners(C);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if ($ = x[A], typeof $ == "function")
      this.removeListener(A, $);
    else if ($ !== void 0)
      for (M = $.length - 1; M >= 0; M--)
        this.removeListener(A, $[M]);
    return this;
  };
  function w(I, A, $) {
    var x = I._events;
    if (x === void 0)
      return [];
    var M = x[A];
    return M === void 0 ? [] : typeof M == "function" ? $ ? [M.listener || M] : [M] : $ ? c(M) : p(M, M.length);
  }
  a.prototype.listeners = function(A) {
    return w(this, A, !0);
  }, a.prototype.rawListeners = function(A) {
    return w(this, A, !1);
  }, a.listenerCount = function(I, A) {
    return typeof I.listenerCount == "function" ? I.listenerCount(A) : R.call(I, A);
  }, a.prototype.listenerCount = R;
  function R(I) {
    var A = this._events;
    if (A !== void 0) {
      var $ = A[I];
      if (typeof $ == "function")
        return 1;
      if ($ !== void 0)
        return $.length;
    }
    return 0;
  }
  a.prototype.eventNames = function() {
    return this._eventsCount > 0 ? n(this._events) : [];
  };
  function p(I, A) {
    for (var $ = new Array(A), x = 0; x < A; ++x)
      $[x] = I[x];
    return $;
  }
  function q(I, A) {
    for (; A + 1 < I.length; A++)
      I[A] = I[A + 1];
    I.pop();
  }
  function c(I) {
    for (var A = new Array(I.length), $ = 0; $ < A.length; ++$)
      A[$] = I[$].listener || I[$];
    return A;
  }
  function v(I, A) {
    return new Promise(function($, x) {
      function M(C) {
        I.removeListener(A, V), x(C);
      }
      function V() {
        typeof I.removeListener == "function" && I.removeListener("error", M), $([].slice.call(arguments));
      }
      E(I, A, V, { once: !0 }), A !== "error" && P(I, M, { once: !0 });
    });
  }
  function P(I, A, $) {
    typeof I.on == "function" && E(I, "error", A, $);
  }
  function E(I, A, $, x) {
    if (typeof I.on == "function")
      x.once ? I.once(A, $) : I.on(A, $);
    else if (typeof I.addEventListener == "function")
      I.addEventListener(A, function M(V) {
        x.once && I.removeEventListener(A, M), $(V);
      });
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof I);
  }
  return events.exports;
}
var inherits_browser = { exports: {} }, hasRequiredInherits_browser;
function requireInherits_browser() {
  return hasRequiredInherits_browser || (hasRequiredInherits_browser = 1, typeof Object.create == "function" ? inherits_browser.exports = function(e, n) {
    n && (e.super_ = n, e.prototype = Object.create(n.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : inherits_browser.exports = function(e, n) {
    if (n) {
      e.super_ = n;
      var s = function() {
      };
      s.prototype = n.prototype, e.prototype = new s(), e.prototype.constructor = e;
    }
  }), inherits_browser.exports;
}
var streamBrowser, hasRequiredStreamBrowser;
function requireStreamBrowser() {
  return hasRequiredStreamBrowser || (hasRequiredStreamBrowser = 1, streamBrowser = requireEvents().EventEmitter), streamBrowser;
}
var util$2 = {}, types = {}, shams$1, hasRequiredShams$1;
function requireShams$1() {
  return hasRequiredShams$1 || (hasRequiredShams$1 = 1, shams$1 = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, n = Symbol("test"), s = Object(n);
    if (typeof n == "string" || Object.prototype.toString.call(n) !== "[object Symbol]" || Object.prototype.toString.call(s) !== "[object Symbol]")
      return !1;
    var r = 42;
    e[n] = r;
    for (var a in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var f = Object.getOwnPropertySymbols(e);
    if (f.length !== 1 || f[0] !== n || !Object.prototype.propertyIsEnumerable.call(e, n))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var u = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, n)
      );
      if (u.value !== r || u.enumerable !== !0)
        return !1;
    }
    return !0;
  }), shams$1;
}
var shams, hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  var t = requireShams$1();
  return shams = function() {
    return t() && !!Symbol.toStringTag;
  }, shams;
}
var esObjectAtoms, hasRequiredEsObjectAtoms;
function requireEsObjectAtoms() {
  return hasRequiredEsObjectAtoms || (hasRequiredEsObjectAtoms = 1, esObjectAtoms = Object), esObjectAtoms;
}
var esErrors, hasRequiredEsErrors;
function requireEsErrors() {
  return hasRequiredEsErrors || (hasRequiredEsErrors = 1, esErrors = Error), esErrors;
}
var _eval, hasRequired_eval;
function require_eval() {
  return hasRequired_eval || (hasRequired_eval = 1, _eval = EvalError), _eval;
}
var range, hasRequiredRange;
function requireRange() {
  return hasRequiredRange || (hasRequiredRange = 1, range = RangeError), range;
}
var ref$1, hasRequiredRef$1;
function requireRef$1() {
  return hasRequiredRef$1 || (hasRequiredRef$1 = 1, ref$1 = ReferenceError), ref$1;
}
var syntax, hasRequiredSyntax;
function requireSyntax() {
  return hasRequiredSyntax || (hasRequiredSyntax = 1, syntax = SyntaxError), syntax;
}
var type$4, hasRequiredType;
function requireType() {
  return hasRequiredType || (hasRequiredType = 1, type$4 = TypeError), type$4;
}
var uri, hasRequiredUri;
function requireUri() {
  return hasRequiredUri || (hasRequiredUri = 1, uri = URIError), uri;
}
var abs, hasRequiredAbs;
function requireAbs() {
  return hasRequiredAbs || (hasRequiredAbs = 1, abs = Math.abs), abs;
}
var floor, hasRequiredFloor;
function requireFloor() {
  return hasRequiredFloor || (hasRequiredFloor = 1, floor = Math.floor), floor;
}
var max, hasRequiredMax;
function requireMax() {
  return hasRequiredMax || (hasRequiredMax = 1, max = Math.max), max;
}
var min, hasRequiredMin;
function requireMin() {
  return hasRequiredMin || (hasRequiredMin = 1, min = Math.min), min;
}
var pow, hasRequiredPow;
function requirePow() {
  return hasRequiredPow || (hasRequiredPow = 1, pow = Math.pow), pow;
}
var round, hasRequiredRound;
function requireRound() {
  return hasRequiredRound || (hasRequiredRound = 1, round = Math.round), round;
}
var _isNaN, hasRequired_isNaN;
function require_isNaN() {
  return hasRequired_isNaN || (hasRequired_isNaN = 1, _isNaN = Number.isNaN || function(e) {
    return e !== e;
  }), _isNaN;
}
var sign, hasRequiredSign;
function requireSign() {
  if (hasRequiredSign) return sign;
  hasRequiredSign = 1;
  var t = /* @__PURE__ */ require_isNaN();
  return sign = function(n) {
    return t(n) || n === 0 ? n : n < 0 ? -1 : 1;
  }, sign;
}
var gOPD, hasRequiredGOPD;
function requireGOPD() {
  return hasRequiredGOPD || (hasRequiredGOPD = 1, gOPD = Object.getOwnPropertyDescriptor), gOPD;
}
var gopd, hasRequiredGopd;
function requireGopd() {
  if (hasRequiredGopd) return gopd;
  hasRequiredGopd = 1;
  var t = /* @__PURE__ */ requireGOPD();
  if (t)
    try {
      t([], "length");
    } catch {
      t = null;
    }
  return gopd = t, gopd;
}
var esDefineProperty, hasRequiredEsDefineProperty;
function requireEsDefineProperty() {
  if (hasRequiredEsDefineProperty) return esDefineProperty;
  hasRequiredEsDefineProperty = 1;
  var t = Object.defineProperty || !1;
  if (t)
    try {
      t({}, "a", { value: 1 });
    } catch {
      t = !1;
    }
  return esDefineProperty = t, esDefineProperty;
}
var hasSymbols, hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols;
  hasRequiredHasSymbols = 1;
  var t = typeof Symbol < "u" && Symbol, e = requireShams$1();
  return hasSymbols = function() {
    return typeof t != "function" || typeof Symbol != "function" || typeof t("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, hasSymbols;
}
var Reflect_getPrototypeOf, hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  return hasRequiredReflect_getPrototypeOf || (hasRequiredReflect_getPrototypeOf = 1, Reflect_getPrototypeOf = typeof Reflect < "u" && Reflect.getPrototypeOf || null), Reflect_getPrototypeOf;
}
var Object_getPrototypeOf, hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var t = /* @__PURE__ */ requireEsObjectAtoms();
  return Object_getPrototypeOf = t.getPrototypeOf || null, Object_getPrototypeOf;
}
var implementation$4, hasRequiredImplementation$4;
function requireImplementation$4() {
  if (hasRequiredImplementation$4) return implementation$4;
  hasRequiredImplementation$4 = 1;
  var t = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, n = Math.max, s = "[object Function]", r = function(h, g) {
    for (var l = [], m = 0; m < h.length; m += 1)
      l[m] = h[m];
    for (var w = 0; w < g.length; w += 1)
      l[w + h.length] = g[w];
    return l;
  }, a = function(h, g) {
    for (var l = [], m = g, w = 0; m < h.length; m += 1, w += 1)
      l[w] = h[m];
    return l;
  }, f = function(u, h) {
    for (var g = "", l = 0; l < u.length; l += 1)
      g += u[l], l + 1 < u.length && (g += h);
    return g;
  };
  return implementation$4 = function(h) {
    var g = this;
    if (typeof g != "function" || e.apply(g) !== s)
      throw new TypeError(t + g);
    for (var l = a(arguments, 1), m, w = function() {
      if (this instanceof m) {
        var v = g.apply(
          this,
          r(l, arguments)
        );
        return Object(v) === v ? v : this;
      }
      return g.apply(
        h,
        r(l, arguments)
      );
    }, R = n(0, g.length - l.length), p = [], q = 0; q < R; q++)
      p[q] = "$" + q;
    if (m = Function("binder", "return function (" + f(p, ",") + "){ return binder.apply(this,arguments); }")(w), g.prototype) {
      var c = function() {
      };
      c.prototype = g.prototype, m.prototype = new c(), c.prototype = null;
    }
    return m;
  }, implementation$4;
}
var functionBind, hasRequiredFunctionBind;
function requireFunctionBind() {
  if (hasRequiredFunctionBind) return functionBind;
  hasRequiredFunctionBind = 1;
  var t = requireImplementation$4();
  return functionBind = Function.prototype.bind || t, functionBind;
}
var functionCall, hasRequiredFunctionCall;
function requireFunctionCall() {
  return hasRequiredFunctionCall || (hasRequiredFunctionCall = 1, functionCall = Function.prototype.call), functionCall;
}
var functionApply, hasRequiredFunctionApply;
function requireFunctionApply() {
  return hasRequiredFunctionApply || (hasRequiredFunctionApply = 1, functionApply = Function.prototype.apply), functionApply;
}
var reflectApply, hasRequiredReflectApply;
function requireReflectApply() {
  return hasRequiredReflectApply || (hasRequiredReflectApply = 1, reflectApply = typeof Reflect < "u" && Reflect && Reflect.apply), reflectApply;
}
var actualApply, hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var t = requireFunctionBind(), e = requireFunctionApply(), n = requireFunctionCall(), s = requireReflectApply();
  return actualApply = s || t.call(n, e), actualApply;
}
var callBindApplyHelpers, hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var t = requireFunctionBind(), e = /* @__PURE__ */ requireType(), n = requireFunctionCall(), s = requireActualApply();
  return callBindApplyHelpers = function(a) {
    if (a.length < 1 || typeof a[0] != "function")
      throw new e("a function is required");
    return s(t, n, a);
  }, callBindApplyHelpers;
}
var get, hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var t = requireCallBindApplyHelpers(), e = /* @__PURE__ */ requireGopd(), n;
  try {
    n = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (f) {
    if (!f || typeof f != "object" || !("code" in f) || f.code !== "ERR_PROTO_ACCESS")
      throw f;
  }
  var s = !!n && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), r = Object, a = r.getPrototypeOf;
  return get = s && typeof s.get == "function" ? t([s.get]) : typeof a == "function" ? (
    /** @type {import('./get')} */
    function(u) {
      return a(u == null ? u : r(u));
    }
  ) : !1, get;
}
var getProto, hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto;
  hasRequiredGetProto = 1;
  var t = requireReflect_getPrototypeOf(), e = requireObject_getPrototypeOf(), n = /* @__PURE__ */ requireGet();
  return getProto = t ? function(r) {
    return t(r);
  } : e ? function(r) {
    if (!r || typeof r != "object" && typeof r != "function")
      throw new TypeError("getProto: not an object");
    return e(r);
  } : n ? function(r) {
    return n(r);
  } : null, getProto;
}
var hasown, hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var t = Function.prototype.call, e = Object.prototype.hasOwnProperty, n = requireFunctionBind();
  return hasown = n.call(t, e), hasown;
}
var getIntrinsic, hasRequiredGetIntrinsic;
function requireGetIntrinsic() {
  if (hasRequiredGetIntrinsic) return getIntrinsic;
  hasRequiredGetIntrinsic = 1;
  var t, e = /* @__PURE__ */ requireEsObjectAtoms(), n = /* @__PURE__ */ requireEsErrors(), s = /* @__PURE__ */ require_eval(), r = /* @__PURE__ */ requireRange(), a = /* @__PURE__ */ requireRef$1(), f = /* @__PURE__ */ requireSyntax(), u = /* @__PURE__ */ requireType(), h = /* @__PURE__ */ requireUri(), g = /* @__PURE__ */ requireAbs(), l = /* @__PURE__ */ requireFloor(), m = /* @__PURE__ */ requireMax(), w = /* @__PURE__ */ requireMin(), R = /* @__PURE__ */ requirePow(), p = /* @__PURE__ */ requireRound(), q = /* @__PURE__ */ requireSign(), c = Function, v = function(re) {
    try {
      return c('"use strict"; return (' + re + ").constructor;")();
    } catch {
    }
  }, P = /* @__PURE__ */ requireGopd(), E = /* @__PURE__ */ requireEsDefineProperty(), I = function() {
    throw new u();
  }, A = P ? (function() {
    try {
      return arguments.callee, I;
    } catch {
      try {
        return P(arguments, "callee").get;
      } catch {
        return I;
      }
    }
  })() : I, $ = requireHasSymbols()(), x = requireGetProto(), M = requireObject_getPrototypeOf(), V = requireReflect_getPrototypeOf(), C = requireFunctionApply(), z = requireFunctionCall(), y = {}, D = typeof Uint8Array > "u" || !x ? t : x(Uint8Array), ie = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
    "%ArrayIteratorPrototype%": $ && x ? x([][Symbol.iterator]()) : t,
    "%AsyncFromSyncIteratorPrototype%": t,
    "%AsyncFunction%": y,
    "%AsyncGenerator%": y,
    "%AsyncGeneratorFunction%": y,
    "%AsyncIteratorPrototype%": y,
    "%Atomics%": typeof Atomics > "u" ? t : Atomics,
    "%BigInt%": typeof BigInt > "u" ? t : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? t : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? t : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? t : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": n,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": s,
    "%Float16Array%": typeof Float16Array > "u" ? t : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
    "%Function%": c,
    "%GeneratorFunction%": y,
    "%Int8Array%": typeof Int8Array > "u" ? t : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? t : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? t : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": $ && x ? x(x([][Symbol.iterator]())) : t,
    "%JSON%": typeof JSON == "object" ? JSON : t,
    "%Map%": typeof Map > "u" ? t : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !$ || !x ? t : x((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": P,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? t : Promise,
    "%Proxy%": typeof Proxy > "u" ? t : Proxy,
    "%RangeError%": r,
    "%ReferenceError%": a,
    "%Reflect%": typeof Reflect > "u" ? t : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? t : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !$ || !x ? t : x((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? t : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": $ && x ? x(""[Symbol.iterator]()) : t,
    "%Symbol%": $ ? Symbol : t,
    "%SyntaxError%": f,
    "%ThrowTypeError%": A,
    "%TypedArray%": D,
    "%TypeError%": u,
    "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
    "%URIError%": h,
    "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet,
    "%Function.prototype.call%": z,
    "%Function.prototype.apply%": C,
    "%Object.defineProperty%": E,
    "%Object.getPrototypeOf%": M,
    "%Math.abs%": g,
    "%Math.floor%": l,
    "%Math.max%": m,
    "%Math.min%": w,
    "%Math.pow%": R,
    "%Math.round%": p,
    "%Math.sign%": q,
    "%Reflect.getPrototypeOf%": V
  };
  if (x)
    try {
      null.error;
    } catch (re) {
      var de = x(x(re));
      ie["%Error.prototype%"] = de;
    }
  var we = function re(ne) {
    var F;
    if (ne === "%AsyncFunction%")
      F = v("async function () {}");
    else if (ne === "%GeneratorFunction%")
      F = v("function* () {}");
    else if (ne === "%AsyncGeneratorFunction%")
      F = v("async function* () {}");
    else if (ne === "%AsyncGenerator%") {
      var L = re("%AsyncGeneratorFunction%");
      L && (F = L.prototype);
    } else if (ne === "%AsyncIteratorPrototype%") {
      var H = re("%AsyncGenerator%");
      H && x && (F = x(H.prototype));
    }
    return ie[ne] = F, F;
  }, be = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, ce = requireFunctionBind(), fe = /* @__PURE__ */ requireHasown(), j = ce.call(z, Array.prototype.concat), pe = ce.call(C, Array.prototype.splice), ee = ce.call(z, String.prototype.replace), X = ce.call(z, String.prototype.slice), G = ce.call(z, RegExp.prototype.exec), le = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, O = /\\(\\)?/g, B = function(ne) {
    var F = X(ne, 0, 1), L = X(ne, -1);
    if (F === "%" && L !== "%")
      throw new f("invalid intrinsic syntax, expected closing `%`");
    if (L === "%" && F !== "%")
      throw new f("invalid intrinsic syntax, expected opening `%`");
    var H = [];
    return ee(ne, le, function(se, Ee, Re, Pe) {
      H[H.length] = Re ? ee(Pe, O, "$1") : Ee || se;
    }), H;
  }, N = function(ne, F) {
    var L = ne, H;
    if (fe(be, L) && (H = be[L], L = "%" + H[0] + "%"), fe(ie, L)) {
      var se = ie[L];
      if (se === y && (se = we(L)), typeof se > "u" && !F)
        throw new u("intrinsic " + ne + " exists, but is not available. Please file an issue!");
      return {
        alias: H,
        name: L,
        value: se
      };
    }
    throw new f("intrinsic " + ne + " does not exist!");
  };
  return getIntrinsic = function(ne, F) {
    if (typeof ne != "string" || ne.length === 0)
      throw new u("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof F != "boolean")
      throw new u('"allowMissing" argument must be a boolean');
    if (G(/^%?[^%]*%?$/, ne) === null)
      throw new f("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var L = B(ne), H = L.length > 0 ? L[0] : "", se = N("%" + H + "%", F), Ee = se.name, Re = se.value, Pe = !1, Oe = se.alias;
    Oe && (H = Oe[0], pe(L, j([0, 1], Oe)));
    for (var te = 1, $e = !0; te < L.length; te += 1) {
      var Ce = L[te], Te = X(Ce, 0, 1), Ue = X(Ce, -1);
      if ((Te === '"' || Te === "'" || Te === "`" || Ue === '"' || Ue === "'" || Ue === "`") && Te !== Ue)
        throw new f("property names with quotes must have matching quotes");
      if ((Ce === "constructor" || !$e) && (Pe = !0), H += "." + Ce, Ee = "%" + H + "%", fe(ie, Ee))
        Re = ie[Ee];
      else if (Re != null) {
        if (!(Ce in Re)) {
          if (!F)
            throw new u("base intrinsic for " + ne + " exists, but the property is not available.");
          return;
        }
        if (P && te + 1 >= L.length) {
          var ge = P(Re, Ce);
          $e = !!ge, $e && "get" in ge && !("originalValue" in ge.get) ? Re = ge.get : Re = Re[Ce];
        } else
          $e = fe(Re, Ce), Re = Re[Ce];
        $e && !Pe && (ie[Ee] = Re);
      }
    }
    return Re;
  }, getIntrinsic;
}
var callBound$1, hasRequiredCallBound$1;
function requireCallBound$1() {
  if (hasRequiredCallBound$1) return callBound$1;
  hasRequiredCallBound$1 = 1;
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = requireCallBindApplyHelpers(), n = e([t("%String.prototype.indexOf%")]);
  return callBound$1 = function(r, a) {
    var f = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      t(r, !!a)
    );
    return typeof f == "function" && n(r, ".prototype.") > -1 ? e(
      /** @type {const} */
      [f]
    ) : f;
  }, callBound$1;
}
var isArguments$1, hasRequiredIsArguments$1;
function requireIsArguments$1() {
  if (hasRequiredIsArguments$1) return isArguments$1;
  hasRequiredIsArguments$1 = 1;
  var t = requireShams()(), e = /* @__PURE__ */ requireCallBound$1(), n = e("Object.prototype.toString"), s = function(u) {
    return t && u && typeof u == "object" && Symbol.toStringTag in u ? !1 : n(u) === "[object Arguments]";
  }, r = function(u) {
    return s(u) ? !0 : u !== null && typeof u == "object" && "length" in u && typeof u.length == "number" && u.length >= 0 && n(u) !== "[object Array]" && "callee" in u && n(u.callee) === "[object Function]";
  }, a = (function() {
    return s(arguments);
  })();
  return s.isLegacyArguments = r, isArguments$1 = a ? s : r, isArguments$1;
}
var isRegex, hasRequiredIsRegex;
function requireIsRegex() {
  if (hasRequiredIsRegex) return isRegex;
  hasRequiredIsRegex = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireShams()(), n = /* @__PURE__ */ requireHasown(), s = /* @__PURE__ */ requireGopd(), r;
  if (e) {
    var a = t("RegExp.prototype.exec"), f = {}, u = function() {
      throw f;
    }, h = {
      toString: u,
      valueOf: u
    };
    typeof Symbol.toPrimitive == "symbol" && (h[Symbol.toPrimitive] = u), r = function(w) {
      if (!w || typeof w != "object")
        return !1;
      var R = (
        /** @type {NonNullable<typeof gOPD>} */
        s(
          /** @type {{ lastIndex?: unknown }} */
          w,
          "lastIndex"
        )
      ), p = R && n(R, "value");
      if (!p)
        return !1;
      try {
        a(
          w,
          /** @type {string} */
          /** @type {unknown} */
          h
        );
      } catch (q) {
        return q === f;
      }
    };
  } else {
    var g = t("Object.prototype.toString"), l = "[object RegExp]";
    r = function(w) {
      return !w || typeof w != "object" && typeof w != "function" ? !1 : g(w) === l;
    };
  }
  return isRegex = r, isRegex;
}
var safeRegexTest, hasRequiredSafeRegexTest;
function requireSafeRegexTest() {
  if (hasRequiredSafeRegexTest) return safeRegexTest;
  hasRequiredSafeRegexTest = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireIsRegex(), n = t("RegExp.prototype.exec"), s = /* @__PURE__ */ requireType();
  return safeRegexTest = function(a) {
    if (!e(a))
      throw new s("`regex` must be a RegExp");
    return function(u) {
      return n(a, u) !== null;
    };
  }, safeRegexTest;
}
var generatorFunction, hasRequiredGeneratorFunction;
function requireGeneratorFunction() {
  if (hasRequiredGeneratorFunction) return generatorFunction;
  hasRequiredGeneratorFunction = 1;
  const t = (
    /** @type {GeneratorFunctionConstructor} */
    (function* () {
    }).constructor
  );
  return generatorFunction = () => t, generatorFunction;
}
var isGeneratorFunction, hasRequiredIsGeneratorFunction;
function requireIsGeneratorFunction() {
  if (hasRequiredIsGeneratorFunction) return isGeneratorFunction;
  hasRequiredIsGeneratorFunction = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = /* @__PURE__ */ requireSafeRegexTest(), n = e(/^\s*(?:function)?\*/), s = requireShams()(), r = requireGetProto(), a = t("Object.prototype.toString"), f = t("Function.prototype.toString"), u = /* @__PURE__ */ requireGeneratorFunction();
  return isGeneratorFunction = function(g) {
    if (typeof g != "function")
      return !1;
    if (n(f(g)))
      return !0;
    if (!s) {
      var l = a(g);
      return l === "[object GeneratorFunction]";
    }
    if (!r)
      return !1;
    var m = u();
    return m && r(g) === m.prototype;
  }, isGeneratorFunction;
}
var isCallable, hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var t = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, n, s;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      n = Object.defineProperty({}, "length", {
        get: function() {
          throw s;
        }
      }), s = {}, e(function() {
        throw 42;
      }, null, n);
    } catch (P) {
      P !== s && (e = null);
    }
  else
    e = null;
  var r = /^\s*class\b/, a = function(E) {
    try {
      var I = t.call(E);
      return r.test(I);
    } catch {
      return !1;
    }
  }, f = function(E) {
    try {
      return a(E) ? !1 : (t.call(E), !0);
    } catch {
      return !1;
    }
  }, u = Object.prototype.toString, h = "[object Object]", g = "[object Function]", l = "[object GeneratorFunction]", m = "[object HTMLAllCollection]", w = "[object HTML document.all class]", R = "[object HTMLCollection]", p = typeof Symbol == "function" && !!Symbol.toStringTag, q = !(0 in [,]), c = function() {
    return !1;
  };
  if (typeof document == "object") {
    var v = document.all;
    u.call(v) === u.call(document.all) && (c = function(E) {
      if ((q || !E) && (typeof E > "u" || typeof E == "object"))
        try {
          var I = u.call(E);
          return (I === m || I === w || I === R || I === h) && E("") == null;
        } catch {
        }
      return !1;
    });
  }
  return isCallable = e ? function(E) {
    if (c(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    try {
      e(E, null, n);
    } catch (I) {
      if (I !== s)
        return !1;
    }
    return !a(E) && f(E);
  } : function(E) {
    if (c(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    if (p)
      return f(E);
    if (a(E))
      return !1;
    var I = u.call(E);
    return I !== g && I !== l && !/^\[object HTML/.test(I) ? !1 : f(E);
  }, isCallable;
}
var forEach, hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach;
  hasRequiredForEach = 1;
  var t = requireIsCallable(), e = Object.prototype.toString, n = Object.prototype.hasOwnProperty, s = function(h, g, l) {
    for (var m = 0, w = h.length; m < w; m++)
      n.call(h, m) && (l == null ? g(h[m], m, h) : g.call(l, h[m], m, h));
  }, r = function(h, g, l) {
    for (var m = 0, w = h.length; m < w; m++)
      l == null ? g(h.charAt(m), m, h) : g.call(l, h.charAt(m), m, h);
  }, a = function(h, g, l) {
    for (var m in h)
      n.call(h, m) && (l == null ? g(h[m], m, h) : g.call(l, h[m], m, h));
  };
  function f(u) {
    return e.call(u) === "[object Array]";
  }
  return forEach = function(h, g, l) {
    if (!t(g))
      throw new TypeError("iterator must be a function");
    var m;
    arguments.length >= 3 && (m = l), f(h) ? s(h, g, m) : typeof h == "string" ? r(h, g, m) : a(h, g, m);
  }, forEach;
}
var possibleTypedArrayNames, hasRequiredPossibleTypedArrayNames;
function requirePossibleTypedArrayNames() {
  return hasRequiredPossibleTypedArrayNames || (hasRequiredPossibleTypedArrayNames = 1, possibleTypedArrayNames = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ]), possibleTypedArrayNames;
}
var availableTypedArrays, hasRequiredAvailableTypedArrays;
function requireAvailableTypedArrays() {
  if (hasRequiredAvailableTypedArrays) return availableTypedArrays;
  hasRequiredAvailableTypedArrays = 1;
  var t = /* @__PURE__ */ requirePossibleTypedArrayNames(), e = typeof globalThis > "u" ? commonjsGlobal : globalThis;
  return availableTypedArrays = function() {
    for (var s = [], r = 0; r < t.length; r++)
      typeof e[t[r]] == "function" && (s[s.length] = t[r]);
    return s;
  }, availableTypedArrays;
}
var callBind = { exports: {} }, defineDataProperty, hasRequiredDefineDataProperty;
function requireDefineDataProperty() {
  if (hasRequiredDefineDataProperty) return defineDataProperty;
  hasRequiredDefineDataProperty = 1;
  var t = /* @__PURE__ */ requireEsDefineProperty(), e = /* @__PURE__ */ requireSyntax(), n = /* @__PURE__ */ requireType(), s = /* @__PURE__ */ requireGopd();
  return defineDataProperty = function(a, f, u) {
    if (!a || typeof a != "object" && typeof a != "function")
      throw new n("`obj` must be an object or a function`");
    if (typeof f != "string" && typeof f != "symbol")
      throw new n("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new n("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new n("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new n("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new n("`loose`, if provided, must be a boolean");
    var h = arguments.length > 3 ? arguments[3] : null, g = arguments.length > 4 ? arguments[4] : null, l = arguments.length > 5 ? arguments[5] : null, m = arguments.length > 6 ? arguments[6] : !1, w = !!s && s(a, f);
    if (t)
      t(a, f, {
        configurable: l === null && w ? w.configurable : !l,
        enumerable: h === null && w ? w.enumerable : !h,
        value: u,
        writable: g === null && w ? w.writable : !g
      });
    else if (m || !h && !g && !l)
      a[f] = u;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, defineDataProperty;
}
var hasPropertyDescriptors_1, hasRequiredHasPropertyDescriptors;
function requireHasPropertyDescriptors() {
  if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
  hasRequiredHasPropertyDescriptors = 1;
  var t = /* @__PURE__ */ requireEsDefineProperty(), e = function() {
    return !!t;
  };
  return e.hasArrayLengthDefineBug = function() {
    if (!t)
      return null;
    try {
      return t([], "length", { value: 1 }).length !== 1;
    } catch {
      return !0;
    }
  }, hasPropertyDescriptors_1 = e, hasPropertyDescriptors_1;
}
var setFunctionLength, hasRequiredSetFunctionLength;
function requireSetFunctionLength() {
  if (hasRequiredSetFunctionLength) return setFunctionLength;
  hasRequiredSetFunctionLength = 1;
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = /* @__PURE__ */ requireDefineDataProperty(), n = /* @__PURE__ */ requireHasPropertyDescriptors()(), s = /* @__PURE__ */ requireGopd(), r = /* @__PURE__ */ requireType(), a = t("%Math.floor%");
  return setFunctionLength = function(u, h) {
    if (typeof u != "function")
      throw new r("`fn` is not a function");
    if (typeof h != "number" || h < 0 || h > 4294967295 || a(h) !== h)
      throw new r("`length` must be a positive 32-bit integer");
    var g = arguments.length > 2 && !!arguments[2], l = !0, m = !0;
    if ("length" in u && s) {
      var w = s(u, "length");
      w && !w.configurable && (l = !1), w && !w.writable && (m = !1);
    }
    return (l || m || !g) && (n ? e(
      /** @type {Parameters<define>[0]} */
      u,
      "length",
      h,
      !0,
      !0
    ) : e(
      /** @type {Parameters<define>[0]} */
      u,
      "length",
      h
    )), u;
  }, setFunctionLength;
}
var applyBind, hasRequiredApplyBind;
function requireApplyBind() {
  if (hasRequiredApplyBind) return applyBind;
  hasRequiredApplyBind = 1;
  var t = requireFunctionBind(), e = requireFunctionApply(), n = requireActualApply();
  return applyBind = function() {
    return n(t, e, arguments);
  }, applyBind;
}
var hasRequiredCallBind;
function requireCallBind() {
  return hasRequiredCallBind || (hasRequiredCallBind = 1, (function(t) {
    var e = /* @__PURE__ */ requireSetFunctionLength(), n = /* @__PURE__ */ requireEsDefineProperty(), s = requireCallBindApplyHelpers(), r = requireApplyBind();
    t.exports = function(f) {
      var u = s(arguments), h = f.length - (arguments.length - 1);
      return e(
        u,
        1 + (h > 0 ? h : 0),
        !0
      );
    }, n ? n(t.exports, "apply", { value: r }) : t.exports.apply = r;
  })(callBind)), callBind.exports;
}
var whichTypedArray, hasRequiredWhichTypedArray;
function requireWhichTypedArray() {
  if (hasRequiredWhichTypedArray) return whichTypedArray;
  hasRequiredWhichTypedArray = 1;
  var t = requireForEach(), e = /* @__PURE__ */ requireAvailableTypedArrays(), n = requireCallBind(), s = /* @__PURE__ */ requireCallBound$1(), r = /* @__PURE__ */ requireGopd(), a = requireGetProto(), f = s("Object.prototype.toString"), u = requireShams()(), h = typeof globalThis > "u" ? commonjsGlobal : globalThis, g = e(), l = s("String.prototype.slice"), m = s("Array.prototype.indexOf", !0) || function(c, v) {
    for (var P = 0; P < c.length; P += 1)
      if (c[P] === v)
        return P;
    return -1;
  }, w = { __proto__: null };
  u && r && a ? t(g, function(q) {
    var c = new h[q]();
    if (Symbol.toStringTag in c && a) {
      var v = a(c), P = r(v, Symbol.toStringTag);
      if (!P && v) {
        var E = a(v);
        P = r(E, Symbol.toStringTag);
      }
      if (P && P.get) {
        var I = n(P.get);
        w[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + q
        ] = I;
      }
    }
  }) : t(g, function(q) {
    var c = new h[q](), v = c.slice || c.set;
    if (v) {
      var P = (
        /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        n(v)
      );
      w[
        /** @type {`$${import('.').TypedArrayName}`} */
        "$" + q
      ] = P;
    }
  });
  var R = function(c) {
    var v = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      w,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(P, E) {
        if (!v)
          try {
            "$" + P(c) === E && (v = /** @type {import('.').TypedArrayName} */
            l(E, 1));
          } catch {
          }
      }
    ), v;
  }, p = function(c) {
    var v = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      w,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(P, E) {
        if (!v)
          try {
            P(c), v = /** @type {import('.').TypedArrayName} */
            l(E, 1);
          } catch {
          }
      }
    ), v;
  };
  return whichTypedArray = function(c) {
    if (!c || typeof c != "object")
      return !1;
    if (!u) {
      var v = l(f(c), 8, -1);
      return m(g, v) > -1 ? v : v !== "Object" ? !1 : p(c);
    }
    return r ? R(c) : null;
  }, whichTypedArray;
}
var isTypedArray, hasRequiredIsTypedArray;
function requireIsTypedArray() {
  if (hasRequiredIsTypedArray) return isTypedArray;
  hasRequiredIsTypedArray = 1;
  var t = /* @__PURE__ */ requireWhichTypedArray();
  return isTypedArray = function(n) {
    return !!t(n);
  }, isTypedArray;
}
var hasRequiredTypes;
function requireTypes() {
  return hasRequiredTypes || (hasRequiredTypes = 1, (function(t) {
    var e = /* @__PURE__ */ requireIsArguments$1(), n = requireIsGeneratorFunction(), s = /* @__PURE__ */ requireWhichTypedArray(), r = /* @__PURE__ */ requireIsTypedArray();
    function a(te) {
      return te.call.bind(te);
    }
    var f = typeof BigInt < "u", u = typeof Symbol < "u", h = a(Object.prototype.toString), g = a(Number.prototype.valueOf), l = a(String.prototype.valueOf), m = a(Boolean.prototype.valueOf);
    if (f)
      var w = a(BigInt.prototype.valueOf);
    if (u)
      var R = a(Symbol.prototype.valueOf);
    function p(te, $e) {
      if (typeof te != "object")
        return !1;
      try {
        return $e(te), !0;
      } catch {
        return !1;
      }
    }
    t.isArgumentsObject = e, t.isGeneratorFunction = n, t.isTypedArray = r;
    function q(te) {
      return typeof Promise < "u" && te instanceof Promise || te !== null && typeof te == "object" && typeof te.then == "function" && typeof te.catch == "function";
    }
    t.isPromise = q;
    function c(te) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(te) : r(te) || X(te);
    }
    t.isArrayBufferView = c;
    function v(te) {
      return s(te) === "Uint8Array";
    }
    t.isUint8Array = v;
    function P(te) {
      return s(te) === "Uint8ClampedArray";
    }
    t.isUint8ClampedArray = P;
    function E(te) {
      return s(te) === "Uint16Array";
    }
    t.isUint16Array = E;
    function I(te) {
      return s(te) === "Uint32Array";
    }
    t.isUint32Array = I;
    function A(te) {
      return s(te) === "Int8Array";
    }
    t.isInt8Array = A;
    function $(te) {
      return s(te) === "Int16Array";
    }
    t.isInt16Array = $;
    function x(te) {
      return s(te) === "Int32Array";
    }
    t.isInt32Array = x;
    function M(te) {
      return s(te) === "Float32Array";
    }
    t.isFloat32Array = M;
    function V(te) {
      return s(te) === "Float64Array";
    }
    t.isFloat64Array = V;
    function C(te) {
      return s(te) === "BigInt64Array";
    }
    t.isBigInt64Array = C;
    function z(te) {
      return s(te) === "BigUint64Array";
    }
    t.isBigUint64Array = z;
    function y(te) {
      return h(te) === "[object Map]";
    }
    y.working = typeof Map < "u" && y(/* @__PURE__ */ new Map());
    function D(te) {
      return typeof Map > "u" ? !1 : y.working ? y(te) : te instanceof Map;
    }
    t.isMap = D;
    function ie(te) {
      return h(te) === "[object Set]";
    }
    ie.working = typeof Set < "u" && ie(/* @__PURE__ */ new Set());
    function de(te) {
      return typeof Set > "u" ? !1 : ie.working ? ie(te) : te instanceof Set;
    }
    t.isSet = de;
    function we(te) {
      return h(te) === "[object WeakMap]";
    }
    we.working = typeof WeakMap < "u" && we(/* @__PURE__ */ new WeakMap());
    function be(te) {
      return typeof WeakMap > "u" ? !1 : we.working ? we(te) : te instanceof WeakMap;
    }
    t.isWeakMap = be;
    function ce(te) {
      return h(te) === "[object WeakSet]";
    }
    ce.working = typeof WeakSet < "u" && ce(/* @__PURE__ */ new WeakSet());
    function fe(te) {
      return ce(te);
    }
    t.isWeakSet = fe;
    function j(te) {
      return h(te) === "[object ArrayBuffer]";
    }
    j.working = typeof ArrayBuffer < "u" && j(new ArrayBuffer());
    function pe(te) {
      return typeof ArrayBuffer > "u" ? !1 : j.working ? j(te) : te instanceof ArrayBuffer;
    }
    t.isArrayBuffer = pe;
    function ee(te) {
      return h(te) === "[object DataView]";
    }
    ee.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && ee(new DataView(new ArrayBuffer(1), 0, 1));
    function X(te) {
      return typeof DataView > "u" ? !1 : ee.working ? ee(te) : te instanceof DataView;
    }
    t.isDataView = X;
    var G = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function le(te) {
      return h(te) === "[object SharedArrayBuffer]";
    }
    function O(te) {
      return typeof G > "u" ? !1 : (typeof le.working > "u" && (le.working = le(new G())), le.working ? le(te) : te instanceof G);
    }
    t.isSharedArrayBuffer = O;
    function B(te) {
      return h(te) === "[object AsyncFunction]";
    }
    t.isAsyncFunction = B;
    function N(te) {
      return h(te) === "[object Map Iterator]";
    }
    t.isMapIterator = N;
    function re(te) {
      return h(te) === "[object Set Iterator]";
    }
    t.isSetIterator = re;
    function ne(te) {
      return h(te) === "[object Generator]";
    }
    t.isGeneratorObject = ne;
    function F(te) {
      return h(te) === "[object WebAssembly.Module]";
    }
    t.isWebAssemblyCompiledModule = F;
    function L(te) {
      return p(te, g);
    }
    t.isNumberObject = L;
    function H(te) {
      return p(te, l);
    }
    t.isStringObject = H;
    function se(te) {
      return p(te, m);
    }
    t.isBooleanObject = se;
    function Ee(te) {
      return f && p(te, w);
    }
    t.isBigIntObject = Ee;
    function Re(te) {
      return u && p(te, R);
    }
    t.isSymbolObject = Re;
    function Pe(te) {
      return L(te) || H(te) || se(te) || Ee(te) || Re(te);
    }
    t.isBoxedPrimitive = Pe;
    function Oe(te) {
      return typeof Uint8Array < "u" && (pe(te) || O(te));
    }
    t.isAnyArrayBuffer = Oe, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(te) {
      Object.defineProperty(t, te, {
        enumerable: !1,
        value: function() {
          throw new Error(te + " is not supported in userland");
        }
      });
    });
  })(types)), types;
}
var isBufferBrowser, hasRequiredIsBufferBrowser;
function requireIsBufferBrowser() {
  return hasRequiredIsBufferBrowser || (hasRequiredIsBufferBrowser = 1, isBufferBrowser = function(e) {
    return e && typeof e == "object" && typeof e.copy == "function" && typeof e.fill == "function" && typeof e.readUInt8 == "function";
  }), isBufferBrowser;
}
var hasRequiredUtil$2;
function requireUtil$2() {
  return hasRequiredUtil$2 || (hasRequiredUtil$2 = 1, (function(t) {
    var e = Object.getOwnPropertyDescriptors || function(X) {
      for (var G = Object.keys(X), le = {}, O = 0; O < G.length; O++)
        le[G[O]] = Object.getOwnPropertyDescriptor(X, G[O]);
      return le;
    }, n = /%[sdj%]/g;
    t.format = function(ee) {
      if (!A(ee)) {
        for (var X = [], G = 0; G < arguments.length; G++)
          X.push(f(arguments[G]));
        return X.join(" ");
      }
      for (var G = 1, le = arguments, O = le.length, B = String(ee).replace(n, function(re) {
        if (re === "%%") return "%";
        if (G >= O) return re;
        switch (re) {
          case "%s":
            return String(le[G++]);
          case "%d":
            return Number(le[G++]);
          case "%j":
            try {
              return JSON.stringify(le[G++]);
            } catch {
              return "[Circular]";
            }
          default:
            return re;
        }
      }), N = le[G]; G < O; N = le[++G])
        P(N) || !V(N) ? B += " " + N : B += " " + f(N);
      return B;
    }, t.deprecate = function(ee, X) {
      if (typeof process$1 < "u" && process$1.noDeprecation === !0)
        return ee;
      if (typeof process$1 > "u")
        return function() {
          return t.deprecate(ee, X).apply(this, arguments);
        };
      var G = !1;
      function le() {
        if (!G) {
          if (process$1.throwDeprecation)
            throw new Error(X);
          process$1.traceDeprecation ? console.trace(X) : console.error(X), G = !0;
        }
        return ee.apply(this, arguments);
      }
      return le;
    };
    var s = {}, r = /^$/;
    if (process$1.env.NODE_DEBUG) {
      var a = process$1.env.NODE_DEBUG;
      a = a.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), r = new RegExp("^" + a + "$", "i");
    }
    t.debuglog = function(ee) {
      if (ee = ee.toUpperCase(), !s[ee])
        if (r.test(ee)) {
          var X = process$1.pid;
          s[ee] = function() {
            var G = t.format.apply(t, arguments);
            console.error("%s %d: %s", ee, X, G);
          };
        } else
          s[ee] = function() {
          };
      return s[ee];
    };
    function f(ee, X) {
      var G = {
        seen: [],
        stylize: h
      };
      return arguments.length >= 3 && (G.depth = arguments[2]), arguments.length >= 4 && (G.colors = arguments[3]), v(X) ? G.showHidden = X : X && t._extend(G, X), x(G.showHidden) && (G.showHidden = !1), x(G.depth) && (G.depth = 2), x(G.colors) && (G.colors = !1), x(G.customInspect) && (G.customInspect = !0), G.colors && (G.stylize = u), l(G, ee, G.depth);
    }
    t.inspect = f, f.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, f.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function u(ee, X) {
      var G = f.styles[X];
      return G ? "\x1B[" + f.colors[G][0] + "m" + ee + "\x1B[" + f.colors[G][1] + "m" : ee;
    }
    function h(ee, X) {
      return ee;
    }
    function g(ee) {
      var X = {};
      return ee.forEach(function(G, le) {
        X[G] = !0;
      }), X;
    }
    function l(ee, X, G) {
      if (ee.customInspect && X && y(X.inspect) && // Filter out the util module, it's inspect function is special
      X.inspect !== t.inspect && // Also filter out any prototype objects using the circular check.
      !(X.constructor && X.constructor.prototype === X)) {
        var le = X.inspect(G, ee);
        return A(le) || (le = l(ee, le, G)), le;
      }
      var O = m(ee, X);
      if (O)
        return O;
      var B = Object.keys(X), N = g(B);
      if (ee.showHidden && (B = Object.getOwnPropertyNames(X)), z(X) && (B.indexOf("message") >= 0 || B.indexOf("description") >= 0))
        return w(X);
      if (B.length === 0) {
        if (y(X)) {
          var re = X.name ? ": " + X.name : "";
          return ee.stylize("[Function" + re + "]", "special");
        }
        if (M(X))
          return ee.stylize(RegExp.prototype.toString.call(X), "regexp");
        if (C(X))
          return ee.stylize(Date.prototype.toString.call(X), "date");
        if (z(X))
          return w(X);
      }
      var ne = "", F = !1, L = ["{", "}"];
      if (c(X) && (F = !0, L = ["[", "]"]), y(X)) {
        var H = X.name ? ": " + X.name : "";
        ne = " [Function" + H + "]";
      }
      if (M(X) && (ne = " " + RegExp.prototype.toString.call(X)), C(X) && (ne = " " + Date.prototype.toUTCString.call(X)), z(X) && (ne = " " + w(X)), B.length === 0 && (!F || X.length == 0))
        return L[0] + ne + L[1];
      if (G < 0)
        return M(X) ? ee.stylize(RegExp.prototype.toString.call(X), "regexp") : ee.stylize("[Object]", "special");
      ee.seen.push(X);
      var se;
      return F ? se = R(ee, X, G, N, B) : se = B.map(function(Ee) {
        return p(ee, X, G, N, Ee, F);
      }), ee.seen.pop(), q(se, ne, L);
    }
    function m(ee, X) {
      if (x(X))
        return ee.stylize("undefined", "undefined");
      if (A(X)) {
        var G = "'" + JSON.stringify(X).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ee.stylize(G, "string");
      }
      if (I(X))
        return ee.stylize("" + X, "number");
      if (v(X))
        return ee.stylize("" + X, "boolean");
      if (P(X))
        return ee.stylize("null", "null");
    }
    function w(ee) {
      return "[" + Error.prototype.toString.call(ee) + "]";
    }
    function R(ee, X, G, le, O) {
      for (var B = [], N = 0, re = X.length; N < re; ++N)
        ce(X, String(N)) ? B.push(p(
          ee,
          X,
          G,
          le,
          String(N),
          !0
        )) : B.push("");
      return O.forEach(function(ne) {
        ne.match(/^\d+$/) || B.push(p(
          ee,
          X,
          G,
          le,
          ne,
          !0
        ));
      }), B;
    }
    function p(ee, X, G, le, O, B) {
      var N, re, ne;
      if (ne = Object.getOwnPropertyDescriptor(X, O) || { value: X[O] }, ne.get ? ne.set ? re = ee.stylize("[Getter/Setter]", "special") : re = ee.stylize("[Getter]", "special") : ne.set && (re = ee.stylize("[Setter]", "special")), ce(le, O) || (N = "[" + O + "]"), re || (ee.seen.indexOf(ne.value) < 0 ? (P(G) ? re = l(ee, ne.value, null) : re = l(ee, ne.value, G - 1), re.indexOf(`
`) > -1 && (B ? re = re.split(`
`).map(function(F) {
        return "  " + F;
      }).join(`
`).slice(2) : re = `
` + re.split(`
`).map(function(F) {
        return "   " + F;
      }).join(`
`))) : re = ee.stylize("[Circular]", "special")), x(N)) {
        if (B && O.match(/^\d+$/))
          return re;
        N = JSON.stringify("" + O), N.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (N = N.slice(1, -1), N = ee.stylize(N, "name")) : (N = N.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), N = ee.stylize(N, "string"));
      }
      return N + ": " + re;
    }
    function q(ee, X, G) {
      var le = ee.reduce(function(O, B) {
        return B.indexOf(`
`) >= 0, O + B.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return le > 60 ? G[0] + (X === "" ? "" : X + `
 `) + " " + ee.join(`,
  `) + " " + G[1] : G[0] + X + " " + ee.join(", ") + " " + G[1];
    }
    t.types = requireTypes();
    function c(ee) {
      return Array.isArray(ee);
    }
    t.isArray = c;
    function v(ee) {
      return typeof ee == "boolean";
    }
    t.isBoolean = v;
    function P(ee) {
      return ee === null;
    }
    t.isNull = P;
    function E(ee) {
      return ee == null;
    }
    t.isNullOrUndefined = E;
    function I(ee) {
      return typeof ee == "number";
    }
    t.isNumber = I;
    function A(ee) {
      return typeof ee == "string";
    }
    t.isString = A;
    function $(ee) {
      return typeof ee == "symbol";
    }
    t.isSymbol = $;
    function x(ee) {
      return ee === void 0;
    }
    t.isUndefined = x;
    function M(ee) {
      return V(ee) && ie(ee) === "[object RegExp]";
    }
    t.isRegExp = M, t.types.isRegExp = M;
    function V(ee) {
      return typeof ee == "object" && ee !== null;
    }
    t.isObject = V;
    function C(ee) {
      return V(ee) && ie(ee) === "[object Date]";
    }
    t.isDate = C, t.types.isDate = C;
    function z(ee) {
      return V(ee) && (ie(ee) === "[object Error]" || ee instanceof Error);
    }
    t.isError = z, t.types.isNativeError = z;
    function y(ee) {
      return typeof ee == "function";
    }
    t.isFunction = y;
    function D(ee) {
      return ee === null || typeof ee == "boolean" || typeof ee == "number" || typeof ee == "string" || typeof ee == "symbol" || // ES6 symbol
      typeof ee > "u";
    }
    t.isPrimitive = D, t.isBuffer = requireIsBufferBrowser();
    function ie(ee) {
      return Object.prototype.toString.call(ee);
    }
    function de(ee) {
      return ee < 10 ? "0" + ee.toString(10) : ee.toString(10);
    }
    var we = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function be() {
      var ee = /* @__PURE__ */ new Date(), X = [
        de(ee.getHours()),
        de(ee.getMinutes()),
        de(ee.getSeconds())
      ].join(":");
      return [ee.getDate(), we[ee.getMonth()], X].join(" ");
    }
    t.log = function() {
      console.log("%s - %s", be(), t.format.apply(t, arguments));
    }, t.inherits = requireInherits_browser(), t._extend = function(ee, X) {
      if (!X || !V(X)) return ee;
      for (var G = Object.keys(X), le = G.length; le--; )
        ee[G[le]] = X[G[le]];
      return ee;
    };
    function ce(ee, X) {
      return Object.prototype.hasOwnProperty.call(ee, X);
    }
    var fe = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    t.promisify = function(X) {
      if (typeof X != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (fe && X[fe]) {
        var G = X[fe];
        if (typeof G != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(G, fe, {
          value: G,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), G;
      }
      function G() {
        for (var le, O, B = new Promise(function(ne, F) {
          le = ne, O = F;
        }), N = [], re = 0; re < arguments.length; re++)
          N.push(arguments[re]);
        N.push(function(ne, F) {
          ne ? O(ne) : le(F);
        });
        try {
          X.apply(this, N);
        } catch (ne) {
          O(ne);
        }
        return B;
      }
      return Object.setPrototypeOf(G, Object.getPrototypeOf(X)), fe && Object.defineProperty(G, fe, {
        value: G,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        G,
        e(X)
      );
    }, t.promisify.custom = fe;
    function j(ee, X) {
      if (!ee) {
        var G = new Error("Promise was rejected with a falsy value");
        G.reason = ee, ee = G;
      }
      return X(ee);
    }
    function pe(ee) {
      if (typeof ee != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function X() {
        for (var G = [], le = 0; le < arguments.length; le++)
          G.push(arguments[le]);
        var O = G.pop();
        if (typeof O != "function")
          throw new TypeError("The last argument must be of type Function");
        var B = this, N = function() {
          return O.apply(B, arguments);
        };
        ee.apply(this, G).then(
          function(re) {
            process$1.nextTick(N.bind(null, null, re));
          },
          function(re) {
            process$1.nextTick(j.bind(null, re, N));
          }
        );
      }
      return Object.setPrototypeOf(X, Object.getPrototypeOf(ee)), Object.defineProperties(
        X,
        e(ee)
      ), X;
    }
    t.callbackify = pe;
  })(util$2)), util$2;
}
var buffer_list$1, hasRequiredBuffer_list$1;
function requireBuffer_list$1() {
  if (hasRequiredBuffer_list$1) return buffer_list$1;
  hasRequiredBuffer_list$1 = 1;
  function t(p, q) {
    var c = Object.keys(p);
    if (Object.getOwnPropertySymbols) {
      var v = Object.getOwnPropertySymbols(p);
      q && (v = v.filter(function(P) {
        return Object.getOwnPropertyDescriptor(p, P).enumerable;
      })), c.push.apply(c, v);
    }
    return c;
  }
  function e(p) {
    for (var q = 1; q < arguments.length; q++) {
      var c = arguments[q] != null ? arguments[q] : {};
      q % 2 ? t(Object(c), !0).forEach(function(v) {
        n(p, v, c[v]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(p, Object.getOwnPropertyDescriptors(c)) : t(Object(c)).forEach(function(v) {
        Object.defineProperty(p, v, Object.getOwnPropertyDescriptor(c, v));
      });
    }
    return p;
  }
  function n(p, q, c) {
    return q = f(q), q in p ? Object.defineProperty(p, q, { value: c, enumerable: !0, configurable: !0, writable: !0 }) : p[q] = c, p;
  }
  function s(p, q) {
    if (!(p instanceof q))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(p, q) {
    for (var c = 0; c < q.length; c++) {
      var v = q[c];
      v.enumerable = v.enumerable || !1, v.configurable = !0, "value" in v && (v.writable = !0), Object.defineProperty(p, f(v.key), v);
    }
  }
  function a(p, q, c) {
    return q && r(p.prototype, q), Object.defineProperty(p, "prototype", { writable: !1 }), p;
  }
  function f(p) {
    var q = u(p, "string");
    return typeof q == "symbol" ? q : String(q);
  }
  function u(p, q) {
    if (typeof p != "object" || p === null) return p;
    var c = p[Symbol.toPrimitive];
    if (c !== void 0) {
      var v = c.call(p, q);
      if (typeof v != "object") return v;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(p);
  }
  var h = requireDist(), g = h.Buffer, l = requireUtil$2(), m = l.inspect, w = m && m.custom || "inspect";
  function R(p, q, c) {
    g.prototype.copy.call(p, q, c);
  }
  return buffer_list$1 = /* @__PURE__ */ (function() {
    function p() {
      s(this, p), this.head = null, this.tail = null, this.length = 0;
    }
    return a(p, [{
      key: "push",
      value: function(c) {
        var v = {
          data: c,
          next: null
        };
        this.length > 0 ? this.tail.next = v : this.head = v, this.tail = v, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(c) {
        var v = {
          data: c,
          next: this.head
        };
        this.length === 0 && (this.tail = v), this.head = v, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var c = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, c;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(c) {
        if (this.length === 0) return "";
        for (var v = this.head, P = "" + v.data; v = v.next; ) P += c + v.data;
        return P;
      }
    }, {
      key: "concat",
      value: function(c) {
        if (this.length === 0) return g.alloc(0);
        for (var v = g.allocUnsafe(c >>> 0), P = this.head, E = 0; P; )
          R(P.data, v, E), E += P.data.length, P = P.next;
        return v;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(c, v) {
        var P;
        return c < this.head.data.length ? (P = this.head.data.slice(0, c), this.head.data = this.head.data.slice(c)) : c === this.head.data.length ? P = this.shift() : P = v ? this._getString(c) : this._getBuffer(c), P;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(c) {
        var v = this.head, P = 1, E = v.data;
        for (c -= E.length; v = v.next; ) {
          var I = v.data, A = c > I.length ? I.length : c;
          if (A === I.length ? E += I : E += I.slice(0, c), c -= A, c === 0) {
            A === I.length ? (++P, v.next ? this.head = v.next : this.head = this.tail = null) : (this.head = v, v.data = I.slice(A));
            break;
          }
          ++P;
        }
        return this.length -= P, E;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(c) {
        var v = g.allocUnsafe(c), P = this.head, E = 1;
        for (P.data.copy(v), c -= P.data.length; P = P.next; ) {
          var I = P.data, A = c > I.length ? I.length : c;
          if (I.copy(v, v.length - c, 0, A), c -= A, c === 0) {
            A === I.length ? (++E, P.next ? this.head = P.next : this.head = this.tail = null) : (this.head = P, P.data = I.slice(A));
            break;
          }
          ++E;
        }
        return this.length -= E, v;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: w,
      value: function(c, v) {
        return m(this, e(e({}, v), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), p;
  })(), buffer_list$1;
}
var destroy_1$1, hasRequiredDestroy$1;
function requireDestroy$1() {
  if (hasRequiredDestroy$1) return destroy_1$1;
  hasRequiredDestroy$1 = 1;
  function t(f, u) {
    var h = this, g = this._readableState && this._readableState.destroyed, l = this._writableState && this._writableState.destroyed;
    return g || l ? (u ? u(f) : f && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process$1.nextTick(r, this, f)) : process$1.nextTick(r, this, f)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(f || null, function(m) {
      !u && m ? h._writableState ? h._writableState.errorEmitted ? process$1.nextTick(n, h) : (h._writableState.errorEmitted = !0, process$1.nextTick(e, h, m)) : process$1.nextTick(e, h, m) : u ? (process$1.nextTick(n, h), u(m)) : process$1.nextTick(n, h);
    }), this);
  }
  function e(f, u) {
    r(f, u), n(f);
  }
  function n(f) {
    f._writableState && !f._writableState.emitClose || f._readableState && !f._readableState.emitClose || f.emit("close");
  }
  function s() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function r(f, u) {
    f.emit("error", u);
  }
  function a(f, u) {
    var h = f._readableState, g = f._writableState;
    h && h.autoDestroy || g && g.autoDestroy ? f.destroy(u) : f.emit("error", u);
  }
  return destroy_1$1 = {
    destroy: t,
    undestroy: s,
    errorOrDestroy: a
  }, destroy_1$1;
}
var errorsBrowser = {}, hasRequiredErrorsBrowser;
function requireErrorsBrowser() {
  if (hasRequiredErrorsBrowser) return errorsBrowser;
  hasRequiredErrorsBrowser = 1;
  function t(u, h) {
    u.prototype = Object.create(h.prototype), u.prototype.constructor = u, u.__proto__ = h;
  }
  var e = {};
  function n(u, h, g) {
    g || (g = Error);
    function l(w, R, p) {
      return typeof h == "string" ? h : h(w, R, p);
    }
    var m = /* @__PURE__ */ (function(w) {
      t(R, w);
      function R(p, q, c) {
        return w.call(this, l(p, q, c)) || this;
      }
      return R;
    })(g);
    m.prototype.name = g.name, m.prototype.code = u, e[u] = m;
  }
  function s(u, h) {
    if (Array.isArray(u)) {
      var g = u.length;
      return u = u.map(function(l) {
        return String(l);
      }), g > 2 ? "one of ".concat(h, " ").concat(u.slice(0, g - 1).join(", "), ", or ") + u[g - 1] : g === 2 ? "one of ".concat(h, " ").concat(u[0], " or ").concat(u[1]) : "of ".concat(h, " ").concat(u[0]);
    } else
      return "of ".concat(h, " ").concat(String(u));
  }
  function r(u, h, g) {
    return u.substr(0, h.length) === h;
  }
  function a(u, h, g) {
    return (g === void 0 || g > u.length) && (g = u.length), u.substring(g - h.length, g) === h;
  }
  function f(u, h, g) {
    return typeof g != "number" && (g = 0), g + h.length > u.length ? !1 : u.indexOf(h, g) !== -1;
  }
  return n("ERR_INVALID_OPT_VALUE", function(u, h) {
    return 'The value "' + h + '" is invalid for option "' + u + '"';
  }, TypeError), n("ERR_INVALID_ARG_TYPE", function(u, h, g) {
    var l;
    typeof h == "string" && r(h, "not ") ? (l = "must not be", h = h.replace(/^not /, "")) : l = "must be";
    var m;
    if (a(u, " argument"))
      m = "The ".concat(u, " ").concat(l, " ").concat(s(h, "type"));
    else {
      var w = f(u, ".") ? "property" : "argument";
      m = 'The "'.concat(u, '" ').concat(w, " ").concat(l, " ").concat(s(h, "type"));
    }
    return m += ". Received type ".concat(typeof g), m;
  }, TypeError), n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), n("ERR_METHOD_NOT_IMPLEMENTED", function(u) {
    return "The " + u + " method is not implemented";
  }), n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), n("ERR_STREAM_DESTROYED", function(u) {
    return "Cannot call " + u + " after a stream was destroyed";
  }), n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), n("ERR_STREAM_WRITE_AFTER_END", "write after end"), n("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), n("ERR_UNKNOWN_ENCODING", function(u) {
    return "Unknown encoding: " + u;
  }, TypeError), n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), errorsBrowser.codes = e, errorsBrowser;
}
var state$1, hasRequiredState$1;
function requireState$1() {
  if (hasRequiredState$1) return state$1;
  hasRequiredState$1 = 1;
  var t = requireErrorsBrowser().codes.ERR_INVALID_OPT_VALUE;
  function e(s, r, a) {
    return s.highWaterMark != null ? s.highWaterMark : r ? s[a] : null;
  }
  function n(s, r, a, f) {
    var u = e(r, f, a);
    if (u != null) {
      if (!(isFinite(u) && Math.floor(u) === u) || u < 0) {
        var h = f ? a : "highWaterMark";
        throw new t(h, u);
      }
      return Math.floor(u);
    }
    return s.objectMode ? 16 : 16 * 1024;
  }
  return state$1 = {
    getHighWaterMark: n
  }, state$1;
}
var browser$3, hasRequiredBrowser$3;
function requireBrowser$3() {
  if (hasRequiredBrowser$3) return browser$3;
  hasRequiredBrowser$3 = 1, browser$3 = t;
  function t(n, s) {
    if (e("noDeprecation"))
      return n;
    var r = !1;
    function a() {
      if (!r) {
        if (e("throwDeprecation"))
          throw new Error(s);
        e("traceDeprecation") ? console.trace(s) : console.warn(s), r = !0;
      }
      return n.apply(this, arguments);
    }
    return a;
  }
  function e(n) {
    try {
      if (!commonjsGlobal.localStorage) return !1;
    } catch {
      return !1;
    }
    var s = commonjsGlobal.localStorage[n];
    return s == null ? !1 : String(s).toLowerCase() === "true";
  }
  return browser$3;
}
var _stream_writable, hasRequired_stream_writable;
function require_stream_writable() {
  if (hasRequired_stream_writable) return _stream_writable;
  hasRequired_stream_writable = 1, _stream_writable = M;
  function t(O) {
    var B = this;
    this.next = null, this.entry = null, this.finish = function() {
      le(B, O);
    };
  }
  var e;
  M.WritableState = $;
  var n = {
    deprecate: requireBrowser$3()
  }, s = requireStreamBrowser(), r = requireDist().Buffer, a = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function f(O) {
    return r.from(O);
  }
  function u(O) {
    return r.isBuffer(O) || O instanceof a;
  }
  var h = requireDestroy$1(), g = requireState$1(), l = g.getHighWaterMark, m = requireErrorsBrowser().codes, w = m.ERR_INVALID_ARG_TYPE, R = m.ERR_METHOD_NOT_IMPLEMENTED, p = m.ERR_MULTIPLE_CALLBACK, q = m.ERR_STREAM_CANNOT_PIPE, c = m.ERR_STREAM_DESTROYED, v = m.ERR_STREAM_NULL_VALUES, P = m.ERR_STREAM_WRITE_AFTER_END, E = m.ERR_UNKNOWN_ENCODING, I = h.errorOrDestroy;
  requireInherits_browser()(M, s);
  function A() {
  }
  function $(O, B, N) {
    e = e || require_stream_duplex(), O = O || {}, typeof N != "boolean" && (N = B instanceof e), this.objectMode = !!O.objectMode, N && (this.objectMode = this.objectMode || !!O.writableObjectMode), this.highWaterMark = l(this, O, "writableHighWaterMark", N), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var re = O.decodeStrings === !1;
    this.decodeStrings = !re, this.defaultEncoding = O.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(ne) {
      we(B, ne);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = O.emitClose !== !1, this.autoDestroy = !!O.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  $.prototype.getBuffer = function() {
    for (var B = this.bufferedRequest, N = []; B; )
      N.push(B), B = B.next;
    return N;
  }, (function() {
    try {
      Object.defineProperty($.prototype, "buffer", {
        get: n.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var x;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (x = Function.prototype[Symbol.hasInstance], Object.defineProperty(M, Symbol.hasInstance, {
    value: function(B) {
      return x.call(this, B) ? !0 : this !== M ? !1 : B && B._writableState instanceof $;
    }
  })) : x = function(B) {
    return B instanceof this;
  };
  function M(O) {
    e = e || require_stream_duplex();
    var B = this instanceof e;
    if (!B && !x.call(M, this)) return new M(O);
    this._writableState = new $(O, this, B), this.writable = !0, O && (typeof O.write == "function" && (this._write = O.write), typeof O.writev == "function" && (this._writev = O.writev), typeof O.destroy == "function" && (this._destroy = O.destroy), typeof O.final == "function" && (this._final = O.final)), s.call(this);
  }
  M.prototype.pipe = function() {
    I(this, new q());
  };
  function V(O, B) {
    var N = new P();
    I(O, N), process$1.nextTick(B, N);
  }
  function C(O, B, N, re) {
    var ne;
    return N === null ? ne = new v() : typeof N != "string" && !B.objectMode && (ne = new w("chunk", ["string", "Buffer"], N)), ne ? (I(O, ne), process$1.nextTick(re, ne), !1) : !0;
  }
  M.prototype.write = function(O, B, N) {
    var re = this._writableState, ne = !1, F = !re.objectMode && u(O);
    return F && !r.isBuffer(O) && (O = f(O)), typeof B == "function" && (N = B, B = null), F ? B = "buffer" : B || (B = re.defaultEncoding), typeof N != "function" && (N = A), re.ending ? V(this, N) : (F || C(this, re, O, N)) && (re.pendingcb++, ne = y(this, re, F, O, B, N)), ne;
  }, M.prototype.cork = function() {
    this._writableState.corked++;
  }, M.prototype.uncork = function() {
    var O = this._writableState;
    O.corked && (O.corked--, !O.writing && !O.corked && !O.bufferProcessing && O.bufferedRequest && fe(this, O));
  }, M.prototype.setDefaultEncoding = function(B) {
    if (typeof B == "string" && (B = B.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((B + "").toLowerCase()) > -1)) throw new E(B);
    return this._writableState.defaultEncoding = B, this;
  }, Object.defineProperty(M.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function z(O, B, N) {
    return !O.objectMode && O.decodeStrings !== !1 && typeof B == "string" && (B = r.from(B, N)), B;
  }
  Object.defineProperty(M.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function y(O, B, N, re, ne, F) {
    if (!N) {
      var L = z(B, re, ne);
      re !== L && (N = !0, ne = "buffer", re = L);
    }
    var H = B.objectMode ? 1 : re.length;
    B.length += H;
    var se = B.length < B.highWaterMark;
    if (se || (B.needDrain = !0), B.writing || B.corked) {
      var Ee = B.lastBufferedRequest;
      B.lastBufferedRequest = {
        chunk: re,
        encoding: ne,
        isBuf: N,
        callback: F,
        next: null
      }, Ee ? Ee.next = B.lastBufferedRequest : B.bufferedRequest = B.lastBufferedRequest, B.bufferedRequestCount += 1;
    } else
      D(O, B, !1, H, re, ne, F);
    return se;
  }
  function D(O, B, N, re, ne, F, L) {
    B.writelen = re, B.writecb = L, B.writing = !0, B.sync = !0, B.destroyed ? B.onwrite(new c("write")) : N ? O._writev(ne, B.onwrite) : O._write(ne, F, B.onwrite), B.sync = !1;
  }
  function ie(O, B, N, re, ne) {
    --B.pendingcb, N ? (process$1.nextTick(ne, re), process$1.nextTick(X, O, B), O._writableState.errorEmitted = !0, I(O, re)) : (ne(re), O._writableState.errorEmitted = !0, I(O, re), X(O, B));
  }
  function de(O) {
    O.writing = !1, O.writecb = null, O.length -= O.writelen, O.writelen = 0;
  }
  function we(O, B) {
    var N = O._writableState, re = N.sync, ne = N.writecb;
    if (typeof ne != "function") throw new p();
    if (de(N), B) ie(O, N, re, B, ne);
    else {
      var F = j(N) || O.destroyed;
      !F && !N.corked && !N.bufferProcessing && N.bufferedRequest && fe(O, N), re ? process$1.nextTick(be, O, N, F, ne) : be(O, N, F, ne);
    }
  }
  function be(O, B, N, re) {
    N || ce(O, B), B.pendingcb--, re(), X(O, B);
  }
  function ce(O, B) {
    B.length === 0 && B.needDrain && (B.needDrain = !1, O.emit("drain"));
  }
  function fe(O, B) {
    B.bufferProcessing = !0;
    var N = B.bufferedRequest;
    if (O._writev && N && N.next) {
      var re = B.bufferedRequestCount, ne = new Array(re), F = B.corkedRequestsFree;
      F.entry = N;
      for (var L = 0, H = !0; N; )
        ne[L] = N, N.isBuf || (H = !1), N = N.next, L += 1;
      ne.allBuffers = H, D(O, B, !0, B.length, ne, "", F.finish), B.pendingcb++, B.lastBufferedRequest = null, F.next ? (B.corkedRequestsFree = F.next, F.next = null) : B.corkedRequestsFree = new t(B), B.bufferedRequestCount = 0;
    } else {
      for (; N; ) {
        var se = N.chunk, Ee = N.encoding, Re = N.callback, Pe = B.objectMode ? 1 : se.length;
        if (D(O, B, !1, Pe, se, Ee, Re), N = N.next, B.bufferedRequestCount--, B.writing)
          break;
      }
      N === null && (B.lastBufferedRequest = null);
    }
    B.bufferedRequest = N, B.bufferProcessing = !1;
  }
  M.prototype._write = function(O, B, N) {
    N(new R("_write()"));
  }, M.prototype._writev = null, M.prototype.end = function(O, B, N) {
    var re = this._writableState;
    return typeof O == "function" ? (N = O, O = null, B = null) : typeof B == "function" && (N = B, B = null), O != null && this.write(O, B), re.corked && (re.corked = 1, this.uncork()), re.ending || G(this, re, N), this;
  }, Object.defineProperty(M.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function j(O) {
    return O.ending && O.length === 0 && O.bufferedRequest === null && !O.finished && !O.writing;
  }
  function pe(O, B) {
    O._final(function(N) {
      B.pendingcb--, N && I(O, N), B.prefinished = !0, O.emit("prefinish"), X(O, B);
    });
  }
  function ee(O, B) {
    !B.prefinished && !B.finalCalled && (typeof O._final == "function" && !B.destroyed ? (B.pendingcb++, B.finalCalled = !0, process$1.nextTick(pe, O, B)) : (B.prefinished = !0, O.emit("prefinish")));
  }
  function X(O, B) {
    var N = j(B);
    if (N && (ee(O, B), B.pendingcb === 0 && (B.finished = !0, O.emit("finish"), B.autoDestroy))) {
      var re = O._readableState;
      (!re || re.autoDestroy && re.endEmitted) && O.destroy();
    }
    return N;
  }
  function G(O, B, N) {
    B.ending = !0, X(O, B), N && (B.finished ? process$1.nextTick(N) : O.once("finish", N)), B.ended = !0, O.writable = !1;
  }
  function le(O, B, N) {
    var re = O.entry;
    for (O.entry = null; re; ) {
      var ne = re.callback;
      B.pendingcb--, ne(N), re = re.next;
    }
    B.corkedRequestsFree.next = O;
  }
  return Object.defineProperty(M.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(B) {
      this._writableState && (this._writableState.destroyed = B);
    }
  }), M.prototype.destroy = h.destroy, M.prototype._undestroy = h.undestroy, M.prototype._destroy = function(O, B) {
    B(O);
  }, _stream_writable;
}
var _stream_duplex, hasRequired_stream_duplex;
function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex;
  hasRequired_stream_duplex = 1;
  var t = Object.keys || function(g) {
    var l = [];
    for (var m in g) l.push(m);
    return l;
  };
  _stream_duplex = f;
  var e = require_stream_readable(), n = require_stream_writable();
  requireInherits_browser()(f, e);
  for (var s = t(n.prototype), r = 0; r < s.length; r++) {
    var a = s[r];
    f.prototype[a] || (f.prototype[a] = n.prototype[a]);
  }
  function f(g) {
    if (!(this instanceof f)) return new f(g);
    e.call(this, g), n.call(this, g), this.allowHalfOpen = !0, g && (g.readable === !1 && (this.readable = !1), g.writable === !1 && (this.writable = !1), g.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
  }
  Object.defineProperty(f.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(f.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(f.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function u() {
    this._writableState.ended || process$1.nextTick(h, this);
  }
  function h(g) {
    g.end();
  }
  return Object.defineProperty(f.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(l) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = l, this._writableState.destroyed = l);
    }
  }), _stream_duplex;
}
var string_decoder = {}, safeBuffer = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  return hasRequiredSafeBuffer || (hasRequiredSafeBuffer = 1, (function(t, e) {
    var n = requireDist(), s = n.Buffer;
    function r(f, u) {
      for (var h in f)
        u[h] = f[h];
    }
    s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? t.exports = n : (r(n, e), e.Buffer = a);
    function a(f, u, h) {
      return s(f, u, h);
    }
    a.prototype = Object.create(s.prototype), r(s, a), a.from = function(f, u, h) {
      if (typeof f == "number")
        throw new TypeError("Argument must not be a number");
      return s(f, u, h);
    }, a.alloc = function(f, u, h) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      var g = s(f);
      return u !== void 0 ? typeof h == "string" ? g.fill(u, h) : g.fill(u) : g.fill(0), g;
    }, a.allocUnsafe = function(f) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      return s(f);
    }, a.allocUnsafeSlow = function(f) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      return n.SlowBuffer(f);
    };
  })(safeBuffer, safeBuffer.exports)), safeBuffer.exports;
}
var hasRequiredString_decoder;
function requireString_decoder() {
  if (hasRequiredString_decoder) return string_decoder;
  hasRequiredString_decoder = 1;
  var t = requireSafeBuffer().Buffer, e = t.isEncoding || function(v) {
    switch (v = "" + v, v && v.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1;
    }
  };
  function n(v) {
    if (!v) return "utf8";
    for (var P; ; )
      switch (v) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return v;
        default:
          if (P) return;
          v = ("" + v).toLowerCase(), P = !0;
      }
  }
  function s(v) {
    var P = n(v);
    if (typeof P != "string" && (t.isEncoding === e || !e(v))) throw new Error("Unknown encoding: " + v);
    return P || v;
  }
  string_decoder.StringDecoder = r;
  function r(v) {
    this.encoding = s(v);
    var P;
    switch (this.encoding) {
      case "utf16le":
        this.text = m, this.end = w, P = 4;
        break;
      case "utf8":
        this.fillLast = h, P = 4;
        break;
      case "base64":
        this.text = R, this.end = p, P = 3;
        break;
      default:
        this.write = q, this.end = c;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = t.allocUnsafe(P);
  }
  r.prototype.write = function(v) {
    if (v.length === 0) return "";
    var P, E;
    if (this.lastNeed) {
      if (P = this.fillLast(v), P === void 0) return "";
      E = this.lastNeed, this.lastNeed = 0;
    } else
      E = 0;
    return E < v.length ? P ? P + this.text(v, E) : this.text(v, E) : P || "";
  }, r.prototype.end = l, r.prototype.text = g, r.prototype.fillLast = function(v) {
    if (this.lastNeed <= v.length)
      return v.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    v.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, v.length), this.lastNeed -= v.length;
  };
  function a(v) {
    return v <= 127 ? 0 : v >> 5 === 6 ? 2 : v >> 4 === 14 ? 3 : v >> 3 === 30 ? 4 : v >> 6 === 2 ? -1 : -2;
  }
  function f(v, P, E) {
    var I = P.length - 1;
    if (I < E) return 0;
    var A = a(P[I]);
    return A >= 0 ? (A > 0 && (v.lastNeed = A - 1), A) : --I < E || A === -2 ? 0 : (A = a(P[I]), A >= 0 ? (A > 0 && (v.lastNeed = A - 2), A) : --I < E || A === -2 ? 0 : (A = a(P[I]), A >= 0 ? (A > 0 && (A === 2 ? A = 0 : v.lastNeed = A - 3), A) : 0));
  }
  function u(v, P, E) {
    if ((P[0] & 192) !== 128)
      return v.lastNeed = 0, "�";
    if (v.lastNeed > 1 && P.length > 1) {
      if ((P[1] & 192) !== 128)
        return v.lastNeed = 1, "�";
      if (v.lastNeed > 2 && P.length > 2 && (P[2] & 192) !== 128)
        return v.lastNeed = 2, "�";
    }
  }
  function h(v) {
    var P = this.lastTotal - this.lastNeed, E = u(this, v);
    if (E !== void 0) return E;
    if (this.lastNeed <= v.length)
      return v.copy(this.lastChar, P, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    v.copy(this.lastChar, P, 0, v.length), this.lastNeed -= v.length;
  }
  function g(v, P) {
    var E = f(this, v, P);
    if (!this.lastNeed) return v.toString("utf8", P);
    this.lastTotal = E;
    var I = v.length - (E - this.lastNeed);
    return v.copy(this.lastChar, 0, I), v.toString("utf8", P, I);
  }
  function l(v) {
    var P = v && v.length ? this.write(v) : "";
    return this.lastNeed ? P + "�" : P;
  }
  function m(v, P) {
    if ((v.length - P) % 2 === 0) {
      var E = v.toString("utf16le", P);
      if (E) {
        var I = E.charCodeAt(E.length - 1);
        if (I >= 55296 && I <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = v[v.length - 2], this.lastChar[1] = v[v.length - 1], E.slice(0, -1);
      }
      return E;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = v[v.length - 1], v.toString("utf16le", P, v.length - 1);
  }
  function w(v) {
    var P = v && v.length ? this.write(v) : "";
    if (this.lastNeed) {
      var E = this.lastTotal - this.lastNeed;
      return P + this.lastChar.toString("utf16le", 0, E);
    }
    return P;
  }
  function R(v, P) {
    var E = (v.length - P) % 3;
    return E === 0 ? v.toString("base64", P) : (this.lastNeed = 3 - E, this.lastTotal = 3, E === 1 ? this.lastChar[0] = v[v.length - 1] : (this.lastChar[0] = v[v.length - 2], this.lastChar[1] = v[v.length - 1]), v.toString("base64", P, v.length - E));
  }
  function p(v) {
    var P = v && v.length ? this.write(v) : "";
    return this.lastNeed ? P + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : P;
  }
  function q(v) {
    return v.toString(this.encoding);
  }
  function c(v) {
    return v && v.length ? this.write(v) : "";
  }
  return string_decoder;
}
var endOfStream$1, hasRequiredEndOfStream$1;
function requireEndOfStream$1() {
  if (hasRequiredEndOfStream$1) return endOfStream$1;
  hasRequiredEndOfStream$1 = 1;
  var t = requireErrorsBrowser().codes.ERR_STREAM_PREMATURE_CLOSE;
  function e(a) {
    var f = !1;
    return function() {
      if (!f) {
        f = !0;
        for (var u = arguments.length, h = new Array(u), g = 0; g < u; g++)
          h[g] = arguments[g];
        a.apply(this, h);
      }
    };
  }
  function n() {
  }
  function s(a) {
    return a.setHeader && typeof a.abort == "function";
  }
  function r(a, f, u) {
    if (typeof f == "function") return r(a, null, f);
    f || (f = {}), u = e(u || n);
    var h = f.readable || f.readable !== !1 && a.readable, g = f.writable || f.writable !== !1 && a.writable, l = function() {
      a.writable || w();
    }, m = a._writableState && a._writableState.finished, w = function() {
      g = !1, m = !0, h || u.call(a);
    }, R = a._readableState && a._readableState.endEmitted, p = function() {
      h = !1, R = !0, g || u.call(a);
    }, q = function(E) {
      u.call(a, E);
    }, c = function() {
      var E;
      if (h && !R)
        return (!a._readableState || !a._readableState.ended) && (E = new t()), u.call(a, E);
      if (g && !m)
        return (!a._writableState || !a._writableState.ended) && (E = new t()), u.call(a, E);
    }, v = function() {
      a.req.on("finish", w);
    };
    return s(a) ? (a.on("complete", w), a.on("abort", c), a.req ? v() : a.on("request", v)) : g && !a._writableState && (a.on("end", l), a.on("close", l)), a.on("end", p), a.on("finish", w), f.error !== !1 && a.on("error", q), a.on("close", c), function() {
      a.removeListener("complete", w), a.removeListener("abort", c), a.removeListener("request", v), a.req && a.req.removeListener("finish", w), a.removeListener("end", l), a.removeListener("close", l), a.removeListener("finish", w), a.removeListener("end", p), a.removeListener("error", q), a.removeListener("close", c);
    };
  }
  return endOfStream$1 = r, endOfStream$1;
}
var async_iterator, hasRequiredAsync_iterator;
function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator;
  hasRequiredAsync_iterator = 1;
  var t;
  function e(E, I, A) {
    return I = n(I), I in E ? Object.defineProperty(E, I, { value: A, enumerable: !0, configurable: !0, writable: !0 }) : E[I] = A, E;
  }
  function n(E) {
    var I = s(E, "string");
    return typeof I == "symbol" ? I : String(I);
  }
  function s(E, I) {
    if (typeof E != "object" || E === null) return E;
    var A = E[Symbol.toPrimitive];
    if (A !== void 0) {
      var $ = A.call(E, I);
      if (typeof $ != "object") return $;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (I === "string" ? String : Number)(E);
  }
  var r = requireEndOfStream$1(), a = Symbol("lastResolve"), f = Symbol("lastReject"), u = Symbol("error"), h = Symbol("ended"), g = Symbol("lastPromise"), l = Symbol("handlePromise"), m = Symbol("stream");
  function w(E, I) {
    return {
      value: E,
      done: I
    };
  }
  function R(E) {
    var I = E[a];
    if (I !== null) {
      var A = E[m].read();
      A !== null && (E[g] = null, E[a] = null, E[f] = null, I(w(A, !1)));
    }
  }
  function p(E) {
    process$1.nextTick(R, E);
  }
  function q(E, I) {
    return function(A, $) {
      E.then(function() {
        if (I[h]) {
          A(w(void 0, !0));
          return;
        }
        I[l](A, $);
      }, $);
    };
  }
  var c = Object.getPrototypeOf(function() {
  }), v = Object.setPrototypeOf((t = {
    get stream() {
      return this[m];
    },
    next: function() {
      var I = this, A = this[u];
      if (A !== null)
        return Promise.reject(A);
      if (this[h])
        return Promise.resolve(w(void 0, !0));
      if (this[m].destroyed)
        return new Promise(function(V, C) {
          process$1.nextTick(function() {
            I[u] ? C(I[u]) : V(w(void 0, !0));
          });
        });
      var $ = this[g], x;
      if ($)
        x = new Promise(q($, this));
      else {
        var M = this[m].read();
        if (M !== null)
          return Promise.resolve(w(M, !1));
        x = new Promise(this[l]);
      }
      return this[g] = x, x;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var I = this;
    return new Promise(function(A, $) {
      I[m].destroy(null, function(x) {
        if (x) {
          $(x);
          return;
        }
        A(w(void 0, !0));
      });
    });
  }), t), c), P = function(I) {
    var A, $ = Object.create(v, (A = {}, e(A, m, {
      value: I,
      writable: !0
    }), e(A, a, {
      value: null,
      writable: !0
    }), e(A, f, {
      value: null,
      writable: !0
    }), e(A, u, {
      value: null,
      writable: !0
    }), e(A, h, {
      value: I._readableState.endEmitted,
      writable: !0
    }), e(A, l, {
      value: function(M, V) {
        var C = $[m].read();
        C ? ($[g] = null, $[a] = null, $[f] = null, M(w(C, !1))) : ($[a] = M, $[f] = V);
      },
      writable: !0
    }), A));
    return $[g] = null, r(I, function(x) {
      if (x && x.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var M = $[f];
        M !== null && ($[g] = null, $[a] = null, $[f] = null, M(x)), $[u] = x;
        return;
      }
      var V = $[a];
      V !== null && ($[g] = null, $[a] = null, $[f] = null, V(w(void 0, !0))), $[h] = !0;
    }), I.on("readable", p.bind(null, $)), $;
  };
  return async_iterator = P, async_iterator;
}
var fromBrowser, hasRequiredFromBrowser;
function requireFromBrowser() {
  return hasRequiredFromBrowser || (hasRequiredFromBrowser = 1, fromBrowser = function() {
    throw new Error("Readable.from is not available in the browser");
  }), fromBrowser;
}
var _stream_readable, hasRequired_stream_readable;
function require_stream_readable() {
  if (hasRequired_stream_readable) return _stream_readable;
  hasRequired_stream_readable = 1, _stream_readable = V;
  var t;
  V.ReadableState = M, requireEvents().EventEmitter;
  var e = function(L, H) {
    return L.listeners(H).length;
  }, n = requireStreamBrowser(), s = requireDist().Buffer, r = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function a(F) {
    return s.from(F);
  }
  function f(F) {
    return s.isBuffer(F) || F instanceof r;
  }
  var u = requireUtil$2(), h;
  u && u.debuglog ? h = u.debuglog("stream") : h = function() {
  };
  var g = requireBuffer_list$1(), l = requireDestroy$1(), m = requireState$1(), w = m.getHighWaterMark, R = requireErrorsBrowser().codes, p = R.ERR_INVALID_ARG_TYPE, q = R.ERR_STREAM_PUSH_AFTER_EOF, c = R.ERR_METHOD_NOT_IMPLEMENTED, v = R.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, P, E, I;
  requireInherits_browser()(V, n);
  var A = l.errorOrDestroy, $ = ["error", "close", "destroy", "pause", "resume"];
  function x(F, L, H) {
    if (typeof F.prependListener == "function") return F.prependListener(L, H);
    !F._events || !F._events[L] ? F.on(L, H) : Array.isArray(F._events[L]) ? F._events[L].unshift(H) : F._events[L] = [H, F._events[L]];
  }
  function M(F, L, H) {
    t = t || require_stream_duplex(), F = F || {}, typeof H != "boolean" && (H = L instanceof t), this.objectMode = !!F.objectMode, H && (this.objectMode = this.objectMode || !!F.readableObjectMode), this.highWaterMark = w(this, F, "readableHighWaterMark", H), this.buffer = new g(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = F.emitClose !== !1, this.autoDestroy = !!F.autoDestroy, this.destroyed = !1, this.defaultEncoding = F.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, F.encoding && (P || (P = requireString_decoder().StringDecoder), this.decoder = new P(F.encoding), this.encoding = F.encoding);
  }
  function V(F) {
    if (t = t || require_stream_duplex(), !(this instanceof V)) return new V(F);
    var L = this instanceof t;
    this._readableState = new M(F, this, L), this.readable = !0, F && (typeof F.read == "function" && (this._read = F.read), typeof F.destroy == "function" && (this._destroy = F.destroy)), n.call(this);
  }
  Object.defineProperty(V.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(L) {
      this._readableState && (this._readableState.destroyed = L);
    }
  }), V.prototype.destroy = l.destroy, V.prototype._undestroy = l.undestroy, V.prototype._destroy = function(F, L) {
    L(F);
  }, V.prototype.push = function(F, L) {
    var H = this._readableState, se;
    return H.objectMode ? se = !0 : typeof F == "string" && (L = L || H.defaultEncoding, L !== H.encoding && (F = s.from(F, L), L = ""), se = !0), C(this, F, L, !1, se);
  }, V.prototype.unshift = function(F) {
    return C(this, F, null, !0, !1);
  };
  function C(F, L, H, se, Ee) {
    h("readableAddChunk", L);
    var Re = F._readableState;
    if (L === null)
      Re.reading = !1, we(F, Re);
    else {
      var Pe;
      if (Ee || (Pe = y(Re, L)), Pe)
        A(F, Pe);
      else if (Re.objectMode || L && L.length > 0)
        if (typeof L != "string" && !Re.objectMode && Object.getPrototypeOf(L) !== s.prototype && (L = a(L)), se)
          Re.endEmitted ? A(F, new v()) : z(F, Re, L, !0);
        else if (Re.ended)
          A(F, new q());
        else {
          if (Re.destroyed)
            return !1;
          Re.reading = !1, Re.decoder && !H ? (L = Re.decoder.write(L), Re.objectMode || L.length !== 0 ? z(F, Re, L, !1) : fe(F, Re)) : z(F, Re, L, !1);
        }
      else se || (Re.reading = !1, fe(F, Re));
    }
    return !Re.ended && (Re.length < Re.highWaterMark || Re.length === 0);
  }
  function z(F, L, H, se) {
    L.flowing && L.length === 0 && !L.sync ? (L.awaitDrain = 0, F.emit("data", H)) : (L.length += L.objectMode ? 1 : H.length, se ? L.buffer.unshift(H) : L.buffer.push(H), L.needReadable && be(F)), fe(F, L);
  }
  function y(F, L) {
    var H;
    return !f(L) && typeof L != "string" && L !== void 0 && !F.objectMode && (H = new p("chunk", ["string", "Buffer", "Uint8Array"], L)), H;
  }
  V.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, V.prototype.setEncoding = function(F) {
    P || (P = requireString_decoder().StringDecoder);
    var L = new P(F);
    this._readableState.decoder = L, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var H = this._readableState.buffer.head, se = ""; H !== null; )
      se += L.write(H.data), H = H.next;
    return this._readableState.buffer.clear(), se !== "" && this._readableState.buffer.push(se), this._readableState.length = se.length, this;
  };
  var D = 1073741824;
  function ie(F) {
    return F >= D ? F = D : (F--, F |= F >>> 1, F |= F >>> 2, F |= F >>> 4, F |= F >>> 8, F |= F >>> 16, F++), F;
  }
  function de(F, L) {
    return F <= 0 || L.length === 0 && L.ended ? 0 : L.objectMode ? 1 : F !== F ? L.flowing && L.length ? L.buffer.head.data.length : L.length : (F > L.highWaterMark && (L.highWaterMark = ie(F)), F <= L.length ? F : L.ended ? L.length : (L.needReadable = !0, 0));
  }
  V.prototype.read = function(F) {
    h("read", F), F = parseInt(F, 10);
    var L = this._readableState, H = F;
    if (F !== 0 && (L.emittedReadable = !1), F === 0 && L.needReadable && ((L.highWaterMark !== 0 ? L.length >= L.highWaterMark : L.length > 0) || L.ended))
      return h("read: emitReadable", L.length, L.ended), L.length === 0 && L.ended ? N(this) : be(this), null;
    if (F = de(F, L), F === 0 && L.ended)
      return L.length === 0 && N(this), null;
    var se = L.needReadable;
    h("need readable", se), (L.length === 0 || L.length - F < L.highWaterMark) && (se = !0, h("length less than watermark", se)), L.ended || L.reading ? (se = !1, h("reading or ended", se)) : se && (h("do read"), L.reading = !0, L.sync = !0, L.length === 0 && (L.needReadable = !0), this._read(L.highWaterMark), L.sync = !1, L.reading || (F = de(H, L)));
    var Ee;
    return F > 0 ? Ee = B(F, L) : Ee = null, Ee === null ? (L.needReadable = L.length <= L.highWaterMark, F = 0) : (L.length -= F, L.awaitDrain = 0), L.length === 0 && (L.ended || (L.needReadable = !0), H !== F && L.ended && N(this)), Ee !== null && this.emit("data", Ee), Ee;
  };
  function we(F, L) {
    if (h("onEofChunk"), !L.ended) {
      if (L.decoder) {
        var H = L.decoder.end();
        H && H.length && (L.buffer.push(H), L.length += L.objectMode ? 1 : H.length);
      }
      L.ended = !0, L.sync ? be(F) : (L.needReadable = !1, L.emittedReadable || (L.emittedReadable = !0, ce(F)));
    }
  }
  function be(F) {
    var L = F._readableState;
    h("emitReadable", L.needReadable, L.emittedReadable), L.needReadable = !1, L.emittedReadable || (h("emitReadable", L.flowing), L.emittedReadable = !0, process$1.nextTick(ce, F));
  }
  function ce(F) {
    var L = F._readableState;
    h("emitReadable_", L.destroyed, L.length, L.ended), !L.destroyed && (L.length || L.ended) && (F.emit("readable"), L.emittedReadable = !1), L.needReadable = !L.flowing && !L.ended && L.length <= L.highWaterMark, O(F);
  }
  function fe(F, L) {
    L.readingMore || (L.readingMore = !0, process$1.nextTick(j, F, L));
  }
  function j(F, L) {
    for (; !L.reading && !L.ended && (L.length < L.highWaterMark || L.flowing && L.length === 0); ) {
      var H = L.length;
      if (h("maybeReadMore read 0"), F.read(0), H === L.length)
        break;
    }
    L.readingMore = !1;
  }
  V.prototype._read = function(F) {
    A(this, new c("_read()"));
  }, V.prototype.pipe = function(F, L) {
    var H = this, se = this._readableState;
    switch (se.pipesCount) {
      case 0:
        se.pipes = F;
        break;
      case 1:
        se.pipes = [se.pipes, F];
        break;
      default:
        se.pipes.push(F);
        break;
    }
    se.pipesCount += 1, h("pipe count=%d opts=%j", se.pipesCount, L);
    var Ee = (!L || L.end !== !1) && F !== process$1.stdout && F !== process$1.stderr, Re = Ee ? Oe : Le;
    se.endEmitted ? process$1.nextTick(Re) : H.once("end", Re), F.on("unpipe", Pe);
    function Pe(Me, ke) {
      h("onunpipe"), Me === H && ke && ke.hasUnpiped === !1 && (ke.hasUnpiped = !0, Ce());
    }
    function Oe() {
      h("onend"), F.end();
    }
    var te = pe(H);
    F.on("drain", te);
    var $e = !1;
    function Ce() {
      h("cleanup"), F.removeListener("close", ge), F.removeListener("finish", Se), F.removeListener("drain", te), F.removeListener("error", Ue), F.removeListener("unpipe", Pe), H.removeListener("end", Oe), H.removeListener("end", Le), H.removeListener("data", Te), $e = !0, se.awaitDrain && (!F._writableState || F._writableState.needDrain) && te();
    }
    H.on("data", Te);
    function Te(Me) {
      h("ondata");
      var ke = F.write(Me);
      h("dest.write", ke), ke === !1 && ((se.pipesCount === 1 && se.pipes === F || se.pipesCount > 1 && ne(se.pipes, F) !== -1) && !$e && (h("false write response, pause", se.awaitDrain), se.awaitDrain++), H.pause());
    }
    function Ue(Me) {
      h("onerror", Me), Le(), F.removeListener("error", Ue), e(F, "error") === 0 && A(F, Me);
    }
    x(F, "error", Ue);
    function ge() {
      F.removeListener("finish", Se), Le();
    }
    F.once("close", ge);
    function Se() {
      h("onfinish"), F.removeListener("close", ge), Le();
    }
    F.once("finish", Se);
    function Le() {
      h("unpipe"), H.unpipe(F);
    }
    return F.emit("pipe", H), se.flowing || (h("pipe resume"), H.resume()), F;
  };
  function pe(F) {
    return function() {
      var H = F._readableState;
      h("pipeOnDrain", H.awaitDrain), H.awaitDrain && H.awaitDrain--, H.awaitDrain === 0 && e(F, "data") && (H.flowing = !0, O(F));
    };
  }
  V.prototype.unpipe = function(F) {
    var L = this._readableState, H = {
      hasUnpiped: !1
    };
    if (L.pipesCount === 0) return this;
    if (L.pipesCount === 1)
      return F && F !== L.pipes ? this : (F || (F = L.pipes), L.pipes = null, L.pipesCount = 0, L.flowing = !1, F && F.emit("unpipe", this, H), this);
    if (!F) {
      var se = L.pipes, Ee = L.pipesCount;
      L.pipes = null, L.pipesCount = 0, L.flowing = !1;
      for (var Re = 0; Re < Ee; Re++) se[Re].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var Pe = ne(L.pipes, F);
    return Pe === -1 ? this : (L.pipes.splice(Pe, 1), L.pipesCount -= 1, L.pipesCount === 1 && (L.pipes = L.pipes[0]), F.emit("unpipe", this, H), this);
  }, V.prototype.on = function(F, L) {
    var H = n.prototype.on.call(this, F, L), se = this._readableState;
    return F === "data" ? (se.readableListening = this.listenerCount("readable") > 0, se.flowing !== !1 && this.resume()) : F === "readable" && !se.endEmitted && !se.readableListening && (se.readableListening = se.needReadable = !0, se.flowing = !1, se.emittedReadable = !1, h("on readable", se.length, se.reading), se.length ? be(this) : se.reading || process$1.nextTick(X, this)), H;
  }, V.prototype.addListener = V.prototype.on, V.prototype.removeListener = function(F, L) {
    var H = n.prototype.removeListener.call(this, F, L);
    return F === "readable" && process$1.nextTick(ee, this), H;
  }, V.prototype.removeAllListeners = function(F) {
    var L = n.prototype.removeAllListeners.apply(this, arguments);
    return (F === "readable" || F === void 0) && process$1.nextTick(ee, this), L;
  };
  function ee(F) {
    var L = F._readableState;
    L.readableListening = F.listenerCount("readable") > 0, L.resumeScheduled && !L.paused ? L.flowing = !0 : F.listenerCount("data") > 0 && F.resume();
  }
  function X(F) {
    h("readable nexttick read 0"), F.read(0);
  }
  V.prototype.resume = function() {
    var F = this._readableState;
    return F.flowing || (h("resume"), F.flowing = !F.readableListening, G(this, F)), F.paused = !1, this;
  };
  function G(F, L) {
    L.resumeScheduled || (L.resumeScheduled = !0, process$1.nextTick(le, F, L));
  }
  function le(F, L) {
    h("resume", L.reading), L.reading || F.read(0), L.resumeScheduled = !1, F.emit("resume"), O(F), L.flowing && !L.reading && F.read(0);
  }
  V.prototype.pause = function() {
    return h("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (h("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function O(F) {
    var L = F._readableState;
    for (h("flow", L.flowing); L.flowing && F.read() !== null; ) ;
  }
  V.prototype.wrap = function(F) {
    var L = this, H = this._readableState, se = !1;
    F.on("end", function() {
      if (h("wrapped end"), H.decoder && !H.ended) {
        var Pe = H.decoder.end();
        Pe && Pe.length && L.push(Pe);
      }
      L.push(null);
    }), F.on("data", function(Pe) {
      if (h("wrapped data"), H.decoder && (Pe = H.decoder.write(Pe)), !(H.objectMode && Pe == null) && !(!H.objectMode && (!Pe || !Pe.length))) {
        var Oe = L.push(Pe);
        Oe || (se = !0, F.pause());
      }
    });
    for (var Ee in F)
      this[Ee] === void 0 && typeof F[Ee] == "function" && (this[Ee] = /* @__PURE__ */ (function(Oe) {
        return function() {
          return F[Oe].apply(F, arguments);
        };
      })(Ee));
    for (var Re = 0; Re < $.length; Re++)
      F.on($[Re], this.emit.bind(this, $[Re]));
    return this._read = function(Pe) {
      h("wrapped _read", Pe), se && (se = !1, F.resume());
    }, this;
  }, typeof Symbol == "function" && (V.prototype[Symbol.asyncIterator] = function() {
    return E === void 0 && (E = requireAsync_iterator()), E(this);
  }), Object.defineProperty(V.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(V.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(V.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(L) {
      this._readableState && (this._readableState.flowing = L);
    }
  }), V._fromList = B, Object.defineProperty(V.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function B(F, L) {
    if (L.length === 0) return null;
    var H;
    return L.objectMode ? H = L.buffer.shift() : !F || F >= L.length ? (L.decoder ? H = L.buffer.join("") : L.buffer.length === 1 ? H = L.buffer.first() : H = L.buffer.concat(L.length), L.buffer.clear()) : H = L.buffer.consume(F, L.decoder), H;
  }
  function N(F) {
    var L = F._readableState;
    h("endReadable", L.endEmitted), L.endEmitted || (L.ended = !0, process$1.nextTick(re, L, F));
  }
  function re(F, L) {
    if (h("endReadableNT", F.endEmitted, F.length), !F.endEmitted && F.length === 0 && (F.endEmitted = !0, L.readable = !1, L.emit("end"), F.autoDestroy)) {
      var H = L._writableState;
      (!H || H.autoDestroy && H.finished) && L.destroy();
    }
  }
  typeof Symbol == "function" && (V.from = function(F, L) {
    return I === void 0 && (I = requireFromBrowser()), I(V, F, L);
  });
  function ne(F, L) {
    for (var H = 0, se = F.length; H < se; H++)
      if (F[H] === L) return H;
    return -1;
  }
  return _stream_readable;
}
var _stream_transform, hasRequired_stream_transform;
function require_stream_transform() {
  if (hasRequired_stream_transform) return _stream_transform;
  hasRequired_stream_transform = 1, _stream_transform = u;
  var t = requireErrorsBrowser().codes, e = t.ERR_METHOD_NOT_IMPLEMENTED, n = t.ERR_MULTIPLE_CALLBACK, s = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, r = t.ERR_TRANSFORM_WITH_LENGTH_0, a = require_stream_duplex();
  requireInherits_browser()(u, a);
  function f(l, m) {
    var w = this._transformState;
    w.transforming = !1;
    var R = w.writecb;
    if (R === null)
      return this.emit("error", new n());
    w.writechunk = null, w.writecb = null, m != null && this.push(m), R(l);
    var p = this._readableState;
    p.reading = !1, (p.needReadable || p.length < p.highWaterMark) && this._read(p.highWaterMark);
  }
  function u(l) {
    if (!(this instanceof u)) return new u(l);
    a.call(this, l), this._transformState = {
      afterTransform: f.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, l && (typeof l.transform == "function" && (this._transform = l.transform), typeof l.flush == "function" && (this._flush = l.flush)), this.on("prefinish", h);
  }
  function h() {
    var l = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(m, w) {
      g(l, m, w);
    }) : g(this, null, null);
  }
  u.prototype.push = function(l, m) {
    return this._transformState.needTransform = !1, a.prototype.push.call(this, l, m);
  }, u.prototype._transform = function(l, m, w) {
    w(new e("_transform()"));
  }, u.prototype._write = function(l, m, w) {
    var R = this._transformState;
    if (R.writecb = w, R.writechunk = l, R.writeencoding = m, !R.transforming) {
      var p = this._readableState;
      (R.needTransform || p.needReadable || p.length < p.highWaterMark) && this._read(p.highWaterMark);
    }
  }, u.prototype._read = function(l) {
    var m = this._transformState;
    m.writechunk !== null && !m.transforming ? (m.transforming = !0, this._transform(m.writechunk, m.writeencoding, m.afterTransform)) : m.needTransform = !0;
  }, u.prototype._destroy = function(l, m) {
    a.prototype._destroy.call(this, l, function(w) {
      m(w);
    });
  };
  function g(l, m, w) {
    if (m) return l.emit("error", m);
    if (w != null && l.push(w), l._writableState.length) throw new r();
    if (l._transformState.transforming) throw new s();
    return l.push(null);
  }
  return _stream_transform;
}
var _stream_passthrough, hasRequired_stream_passthrough;
function require_stream_passthrough() {
  if (hasRequired_stream_passthrough) return _stream_passthrough;
  hasRequired_stream_passthrough = 1, _stream_passthrough = e;
  var t = require_stream_transform();
  requireInherits_browser()(e, t);
  function e(n) {
    if (!(this instanceof e)) return new e(n);
    t.call(this, n);
  }
  return e.prototype._transform = function(n, s, r) {
    r(null, n);
  }, _stream_passthrough;
}
var pipeline_1$1, hasRequiredPipeline$1;
function requirePipeline$1() {
  if (hasRequiredPipeline$1) return pipeline_1$1;
  hasRequiredPipeline$1 = 1;
  var t;
  function e(w) {
    var R = !1;
    return function() {
      R || (R = !0, w.apply(void 0, arguments));
    };
  }
  var n = requireErrorsBrowser().codes, s = n.ERR_MISSING_ARGS, r = n.ERR_STREAM_DESTROYED;
  function a(w) {
    if (w) throw w;
  }
  function f(w) {
    return w.setHeader && typeof w.abort == "function";
  }
  function u(w, R, p, q) {
    q = e(q);
    var c = !1;
    w.on("close", function() {
      c = !0;
    }), t === void 0 && (t = requireEndOfStream$1()), t(w, {
      readable: R,
      writable: p
    }, function(P) {
      if (P) return q(P);
      c = !0, q();
    });
    var v = !1;
    return function(P) {
      if (!c && !v) {
        if (v = !0, f(w)) return w.abort();
        if (typeof w.destroy == "function") return w.destroy();
        q(P || new r("pipe"));
      }
    };
  }
  function h(w) {
    w();
  }
  function g(w, R) {
    return w.pipe(R);
  }
  function l(w) {
    return !w.length || typeof w[w.length - 1] != "function" ? a : w.pop();
  }
  function m() {
    for (var w = arguments.length, R = new Array(w), p = 0; p < w; p++)
      R[p] = arguments[p];
    var q = l(R);
    if (Array.isArray(R[0]) && (R = R[0]), R.length < 2)
      throw new s("streams");
    var c, v = R.map(function(P, E) {
      var I = E < R.length - 1, A = E > 0;
      return u(P, I, A, function($) {
        c || (c = $), $ && v.forEach(h), !I && (v.forEach(h), q(c));
      });
    });
    return R.reduce(g);
  }
  return pipeline_1$1 = m, pipeline_1$1;
}
var streamBrowserify, hasRequiredStreamBrowserify;
function requireStreamBrowserify() {
  if (hasRequiredStreamBrowserify) return streamBrowserify;
  hasRequiredStreamBrowserify = 1, streamBrowserify = n;
  var t = requireEvents().EventEmitter, e = requireInherits_browser();
  e(n, t), n.Readable = require_stream_readable(), n.Writable = require_stream_writable(), n.Duplex = require_stream_duplex(), n.Transform = require_stream_transform(), n.PassThrough = require_stream_passthrough(), n.finished = requireEndOfStream$1(), n.pipeline = requirePipeline$1(), n.Stream = n;
  function n() {
    t.call(this);
  }
  return n.prototype.pipe = function(s, r) {
    var a = this;
    function f(R) {
      s.writable && s.write(R) === !1 && a.pause && a.pause();
    }
    a.on("data", f);
    function u() {
      a.readable && a.resume && a.resume();
    }
    s.on("drain", u), !s._isStdio && (!r || r.end !== !1) && (a.on("end", g), a.on("close", l));
    var h = !1;
    function g() {
      h || (h = !0, s.end());
    }
    function l() {
      h || (h = !0, typeof s.destroy == "function" && s.destroy());
    }
    function m(R) {
      if (w(), t.listenerCount(this, "error") === 0)
        throw R;
    }
    a.on("error", m), s.on("error", m);
    function w() {
      a.removeListener("data", f), s.removeListener("drain", u), a.removeListener("end", g), a.removeListener("close", l), a.removeListener("error", m), s.removeListener("error", m), a.removeListener("end", w), a.removeListener("close", w), s.removeListener("close", w);
    }
    return a.on("end", w), a.on("close", w), s.on("close", w), s.emit("pipe", a), s;
  }, streamBrowserify;
}
var binding = {}, assert = { exports: {} }, errors$1 = {}, hasRequiredErrors$1;
function requireErrors$1() {
  if (hasRequiredErrors$1) return errors$1;
  hasRequiredErrors$1 = 1;
  function t(P) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(E) {
      return typeof E;
    } : function(E) {
      return E && typeof Symbol == "function" && E.constructor === Symbol && E !== Symbol.prototype ? "symbol" : typeof E;
    }, t(P);
  }
  function e(P, E, I) {
    return Object.defineProperty(P, "prototype", { writable: !1 }), P;
  }
  function n(P, E) {
    if (!(P instanceof E))
      throw new TypeError("Cannot call a class as a function");
  }
  function s(P, E) {
    if (typeof E != "function" && E !== null)
      throw new TypeError("Super expression must either be null or a function");
    P.prototype = Object.create(E && E.prototype, { constructor: { value: P, writable: !0, configurable: !0 } }), Object.defineProperty(P, "prototype", { writable: !1 }), E && r(P, E);
  }
  function r(P, E) {
    return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(A, $) {
      return A.__proto__ = $, A;
    }, r(P, E);
  }
  function a(P) {
    var E = h();
    return function() {
      var A = g(P), $;
      if (E) {
        var x = g(this).constructor;
        $ = Reflect.construct(A, arguments, x);
      } else
        $ = A.apply(this, arguments);
      return f(this, $);
    };
  }
  function f(P, E) {
    if (E && (t(E) === "object" || typeof E == "function"))
      return E;
    if (E !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return u(P);
  }
  function u(P) {
    if (P === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return P;
  }
  function h() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function g(P) {
    return g = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(I) {
      return I.__proto__ || Object.getPrototypeOf(I);
    }, g(P);
  }
  var l = {}, m, w;
  function R(P, E, I) {
    I || (I = Error);
    function A(x, M, V) {
      return typeof E == "string" ? E : E(x, M, V);
    }
    var $ = /* @__PURE__ */ (function(x) {
      s(V, x);
      var M = a(V);
      function V(C, z, y) {
        var D;
        return n(this, V), D = M.call(this, A(C, z, y)), D.code = P, D;
      }
      return e(V);
    })(I);
    l[P] = $;
  }
  function p(P, E) {
    if (Array.isArray(P)) {
      var I = P.length;
      return P = P.map(function(A) {
        return String(A);
      }), I > 2 ? "one of ".concat(E, " ").concat(P.slice(0, I - 1).join(", "), ", or ") + P[I - 1] : I === 2 ? "one of ".concat(E, " ").concat(P[0], " or ").concat(P[1]) : "of ".concat(E, " ").concat(P[0]);
    } else
      return "of ".concat(E, " ").concat(String(P));
  }
  function q(P, E, I) {
    return P.substr(0, E.length) === E;
  }
  function c(P, E, I) {
    return (I === void 0 || I > P.length) && (I = P.length), P.substring(I - E.length, I) === E;
  }
  function v(P, E, I) {
    return typeof I != "number" && (I = 0), I + E.length > P.length ? !1 : P.indexOf(E, I) !== -1;
  }
  return R("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), R("ERR_INVALID_ARG_TYPE", function(P, E, I) {
    m === void 0 && (m = requireAssert()), m(typeof P == "string", "'name' must be a string");
    var A;
    typeof E == "string" && q(E, "not ") ? (A = "must not be", E = E.replace(/^not /, "")) : A = "must be";
    var $;
    if (c(P, " argument"))
      $ = "The ".concat(P, " ").concat(A, " ").concat(p(E, "type"));
    else {
      var x = v(P, ".") ? "property" : "argument";
      $ = 'The "'.concat(P, '" ').concat(x, " ").concat(A, " ").concat(p(E, "type"));
    }
    return $ += ". Received type ".concat(t(I)), $;
  }, TypeError), R("ERR_INVALID_ARG_VALUE", function(P, E) {
    var I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
    w === void 0 && (w = requireUtil$2());
    var A = w.inspect(E);
    return A.length > 128 && (A = "".concat(A.slice(0, 128), "...")), "The argument '".concat(P, "' ").concat(I, ". Received ").concat(A);
  }, TypeError), R("ERR_INVALID_RETURN_VALUE", function(P, E, I) {
    var A;
    return I && I.constructor && I.constructor.name ? A = "instance of ".concat(I.constructor.name) : A = "type ".concat(t(I)), "Expected ".concat(P, ' to be returned from the "').concat(E, '"') + " function but got ".concat(A, ".");
  }, TypeError), R("ERR_MISSING_ARGS", function() {
    for (var P = arguments.length, E = new Array(P), I = 0; I < P; I++)
      E[I] = arguments[I];
    m === void 0 && (m = requireAssert()), m(E.length > 0, "At least one arg needs to be specified");
    var A = "The ", $ = E.length;
    switch (E = E.map(function(x) {
      return '"'.concat(x, '"');
    }), $) {
      case 1:
        A += "".concat(E[0], " argument");
        break;
      case 2:
        A += "".concat(E[0], " and ").concat(E[1], " arguments");
        break;
      default:
        A += E.slice(0, $ - 1).join(", "), A += ", and ".concat(E[$ - 1], " arguments");
        break;
    }
    return "".concat(A, " must be specified");
  }, TypeError), errors$1.codes = l, errors$1;
}
var assertion_error, hasRequiredAssertion_error;
function requireAssertion_error() {
  if (hasRequiredAssertion_error) return assertion_error;
  hasRequiredAssertion_error = 1;
  function t(fe, j) {
    var pe = Object.keys(fe);
    if (Object.getOwnPropertySymbols) {
      var ee = Object.getOwnPropertySymbols(fe);
      j && (ee = ee.filter(function(X) {
        return Object.getOwnPropertyDescriptor(fe, X).enumerable;
      })), pe.push.apply(pe, ee);
    }
    return pe;
  }
  function e(fe) {
    for (var j = 1; j < arguments.length; j++) {
      var pe = arguments[j] != null ? arguments[j] : {};
      j % 2 ? t(Object(pe), !0).forEach(function(ee) {
        n(fe, ee, pe[ee]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(fe, Object.getOwnPropertyDescriptors(pe)) : t(Object(pe)).forEach(function(ee) {
        Object.defineProperty(fe, ee, Object.getOwnPropertyDescriptor(pe, ee));
      });
    }
    return fe;
  }
  function n(fe, j, pe) {
    return j = f(j), j in fe ? Object.defineProperty(fe, j, { value: pe, enumerable: !0, configurable: !0, writable: !0 }) : fe[j] = pe, fe;
  }
  function s(fe, j) {
    if (!(fe instanceof j))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(fe, j) {
    for (var pe = 0; pe < j.length; pe++) {
      var ee = j[pe];
      ee.enumerable = ee.enumerable || !1, ee.configurable = !0, "value" in ee && (ee.writable = !0), Object.defineProperty(fe, f(ee.key), ee);
    }
  }
  function a(fe, j, pe) {
    return j && r(fe.prototype, j), Object.defineProperty(fe, "prototype", { writable: !1 }), fe;
  }
  function f(fe) {
    var j = u(fe, "string");
    return P(j) === "symbol" ? j : String(j);
  }
  function u(fe, j) {
    if (P(fe) !== "object" || fe === null) return fe;
    var pe = fe[Symbol.toPrimitive];
    if (pe !== void 0) {
      var ee = pe.call(fe, j);
      if (P(ee) !== "object") return ee;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(fe);
  }
  function h(fe, j) {
    if (typeof j != "function" && j !== null)
      throw new TypeError("Super expression must either be null or a function");
    fe.prototype = Object.create(j && j.prototype, { constructor: { value: fe, writable: !0, configurable: !0 } }), Object.defineProperty(fe, "prototype", { writable: !1 }), j && c(fe, j);
  }
  function g(fe) {
    var j = p();
    return function() {
      var ee = v(fe), X;
      if (j) {
        var G = v(this).constructor;
        X = Reflect.construct(ee, arguments, G);
      } else
        X = ee.apply(this, arguments);
      return l(this, X);
    };
  }
  function l(fe, j) {
    if (j && (P(j) === "object" || typeof j == "function"))
      return j;
    if (j !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return m(fe);
  }
  function m(fe) {
    if (fe === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return fe;
  }
  function w(fe) {
    var j = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return w = function(ee) {
      if (ee === null || !q(ee)) return ee;
      if (typeof ee != "function")
        throw new TypeError("Super expression must either be null or a function");
      if (typeof j < "u") {
        if (j.has(ee)) return j.get(ee);
        j.set(ee, X);
      }
      function X() {
        return R(ee, arguments, v(this).constructor);
      }
      return X.prototype = Object.create(ee.prototype, { constructor: { value: X, enumerable: !1, writable: !0, configurable: !0 } }), c(X, ee);
    }, w(fe);
  }
  function R(fe, j, pe) {
    return p() ? R = Reflect.construct.bind() : R = function(X, G, le) {
      var O = [null];
      O.push.apply(O, G);
      var B = Function.bind.apply(X, O), N = new B();
      return le && c(N, le.prototype), N;
    }, R.apply(null, arguments);
  }
  function p() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function q(fe) {
    return Function.toString.call(fe).indexOf("[native code]") !== -1;
  }
  function c(fe, j) {
    return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ee, X) {
      return ee.__proto__ = X, ee;
    }, c(fe, j);
  }
  function v(fe) {
    return v = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(pe) {
      return pe.__proto__ || Object.getPrototypeOf(pe);
    }, v(fe);
  }
  function P(fe) {
    "@babel/helpers - typeof";
    return P = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(j) {
      return typeof j;
    } : function(j) {
      return j && typeof Symbol == "function" && j.constructor === Symbol && j !== Symbol.prototype ? "symbol" : typeof j;
    }, P(fe);
  }
  var E = requireUtil$2(), I = E.inspect, A = requireErrors$1(), $ = A.codes.ERR_INVALID_ARG_TYPE;
  function x(fe, j, pe) {
    return (pe === void 0 || pe > fe.length) && (pe = fe.length), fe.substring(pe - j.length, pe) === j;
  }
  function M(fe, j) {
    if (j = Math.floor(j), fe.length == 0 || j == 0) return "";
    var pe = fe.length * j;
    for (j = Math.floor(Math.log(j) / Math.log(2)); j; )
      fe += fe, j--;
    return fe += fe.substring(0, pe - fe.length), fe;
  }
  var V = "", C = "", z = "", y = "", D = {
    deepStrictEqual: "Expected values to be strictly deep-equal:",
    strictEqual: "Expected values to be strictly equal:",
    strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
    deepEqual: "Expected values to be loosely deep-equal:",
    equal: "Expected values to be loosely equal:",
    notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
    notStrictEqual: 'Expected "actual" to be strictly unequal to:',
    notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
    notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
    notEqual: 'Expected "actual" to be loosely unequal to:',
    notIdentical: "Values identical but not reference-equal:"
  }, ie = 10;
  function de(fe) {
    var j = Object.keys(fe), pe = Object.create(Object.getPrototypeOf(fe));
    return j.forEach(function(ee) {
      pe[ee] = fe[ee];
    }), Object.defineProperty(pe, "message", {
      value: fe.message
    }), pe;
  }
  function we(fe) {
    return I(fe, {
      compact: !1,
      customInspect: !1,
      depth: 1e3,
      maxArrayLength: 1 / 0,
      // Assert compares only enumerable properties (with a few exceptions).
      showHidden: !1,
      // Having a long line as error is better than wrapping the line for
      // comparison for now.
      // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
      // have meta information about the inspected properties (i.e., know where
      // in what line the property starts and ends).
      breakLength: 1 / 0,
      // Assert does not detect proxies currently.
      showProxy: !1,
      sorted: !0,
      // Inspect getters as we also check them when comparing entries.
      getters: !0
    });
  }
  function be(fe, j, pe) {
    var ee = "", X = "", G = 0, le = "", O = !1, B = we(fe), N = B.split(`
`), re = we(j).split(`
`), ne = 0, F = "";
    if (pe === "strictEqual" && P(fe) === "object" && P(j) === "object" && fe !== null && j !== null && (pe = "strictEqualObject"), N.length === 1 && re.length === 1 && N[0] !== re[0]) {
      var L = N[0].length + re[0].length;
      if (L <= ie) {
        if ((P(fe) !== "object" || fe === null) && (P(j) !== "object" || j === null) && (fe !== 0 || j !== 0))
          return "".concat(D[pe], `

`) + "".concat(N[0], " !== ").concat(re[0], `
`);
      } else if (pe !== "strictEqualObject") {
        var H = process$1.stderr && process$1.stderr.isTTY ? process$1.stderr.columns : 80;
        if (L < H) {
          for (; N[0][ne] === re[0][ne]; )
            ne++;
          ne > 2 && (F = `
  `.concat(M(" ", ne), "^"), ne = 0);
        }
      }
    }
    for (var se = N[N.length - 1], Ee = re[re.length - 1]; se === Ee && (ne++ < 2 ? le = `
  `.concat(se).concat(le) : ee = se, N.pop(), re.pop(), !(N.length === 0 || re.length === 0)); )
      se = N[N.length - 1], Ee = re[re.length - 1];
    var Re = Math.max(N.length, re.length);
    if (Re === 0) {
      var Pe = B.split(`
`);
      if (Pe.length > 30)
        for (Pe[26] = "".concat(V, "...").concat(y); Pe.length > 27; )
          Pe.pop();
      return "".concat(D.notIdentical, `

`).concat(Pe.join(`
`), `
`);
    }
    ne > 3 && (le = `
`.concat(V, "...").concat(y).concat(le), O = !0), ee !== "" && (le = `
  `.concat(ee).concat(le), ee = "");
    var Oe = 0, te = D[pe] + `
`.concat(C, "+ actual").concat(y, " ").concat(z, "- expected").concat(y), $e = " ".concat(V, "...").concat(y, " Lines skipped");
    for (ne = 0; ne < Re; ne++) {
      var Ce = ne - G;
      if (N.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (X += `
`.concat(V, "...").concat(y), O = !0) : Ce > 3 && (X += `
  `.concat(re[ne - 2]), Oe++), X += `
  `.concat(re[ne - 1]), Oe++), G = ne, ee += `
`.concat(z, "-").concat(y, " ").concat(re[ne]), Oe++;
      else if (re.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (X += `
`.concat(V, "...").concat(y), O = !0) : Ce > 3 && (X += `
  `.concat(N[ne - 2]), Oe++), X += `
  `.concat(N[ne - 1]), Oe++), G = ne, X += `
`.concat(C, "+").concat(y, " ").concat(N[ne]), Oe++;
      else {
        var Te = re[ne], Ue = N[ne], ge = Ue !== Te && (!x(Ue, ",") || Ue.slice(0, -1) !== Te);
        ge && x(Te, ",") && Te.slice(0, -1) === Ue && (ge = !1, Ue += ","), ge ? (Ce > 1 && ne > 2 && (Ce > 4 ? (X += `
`.concat(V, "...").concat(y), O = !0) : Ce > 3 && (X += `
  `.concat(N[ne - 2]), Oe++), X += `
  `.concat(N[ne - 1]), Oe++), G = ne, X += `
`.concat(C, "+").concat(y, " ").concat(Ue), ee += `
`.concat(z, "-").concat(y, " ").concat(Te), Oe += 2) : (X += ee, ee = "", (Ce === 1 || ne === 0) && (X += `
  `.concat(Ue), Oe++));
      }
      if (Oe > 20 && ne < Re - 2)
        return "".concat(te).concat($e, `
`).concat(X, `
`).concat(V, "...").concat(y).concat(ee, `
`) + "".concat(V, "...").concat(y);
    }
    return "".concat(te).concat(O ? $e : "", `
`).concat(X).concat(ee).concat(le).concat(F);
  }
  var ce = /* @__PURE__ */ (function(fe, j) {
    h(ee, fe);
    var pe = g(ee);
    function ee(X) {
      var G;
      if (s(this, ee), P(X) !== "object" || X === null)
        throw new $("options", "Object", X);
      var le = X.message, O = X.operator, B = X.stackStartFn, N = X.actual, re = X.expected, ne = Error.stackTraceLimit;
      if (Error.stackTraceLimit = 0, le != null)
        G = pe.call(this, String(le));
      else if (process$1.stderr && process$1.stderr.isTTY && (process$1.stderr && process$1.stderr.getColorDepth && process$1.stderr.getColorDepth() !== 1 ? (V = "\x1B[34m", C = "\x1B[32m", y = "\x1B[39m", z = "\x1B[31m") : (V = "", C = "", y = "", z = "")), P(N) === "object" && N !== null && P(re) === "object" && re !== null && "stack" in N && N instanceof Error && "stack" in re && re instanceof Error && (N = de(N), re = de(re)), O === "deepStrictEqual" || O === "strictEqual")
        G = pe.call(this, be(N, re, O));
      else if (O === "notDeepStrictEqual" || O === "notStrictEqual") {
        var F = D[O], L = we(N).split(`
`);
        if (O === "notStrictEqual" && P(N) === "object" && N !== null && (F = D.notStrictEqualObject), L.length > 30)
          for (L[26] = "".concat(V, "...").concat(y); L.length > 27; )
            L.pop();
        L.length === 1 ? G = pe.call(this, "".concat(F, " ").concat(L[0])) : G = pe.call(this, "".concat(F, `

`).concat(L.join(`
`), `
`));
      } else {
        var H = we(N), se = "", Ee = D[O];
        O === "notDeepEqual" || O === "notEqual" ? (H = "".concat(D[O], `

`).concat(H), H.length > 1024 && (H = "".concat(H.slice(0, 1021), "..."))) : (se = "".concat(we(re)), H.length > 512 && (H = "".concat(H.slice(0, 509), "...")), se.length > 512 && (se = "".concat(se.slice(0, 509), "...")), O === "deepEqual" || O === "equal" ? H = "".concat(Ee, `

`).concat(H, `

should equal

`) : se = " ".concat(O, " ").concat(se)), G = pe.call(this, "".concat(H).concat(se));
      }
      return Error.stackTraceLimit = ne, G.generatedMessage = !le, Object.defineProperty(m(G), "name", {
        value: "AssertionError [ERR_ASSERTION]",
        enumerable: !1,
        writable: !0,
        configurable: !0
      }), G.code = "ERR_ASSERTION", G.actual = N, G.expected = re, G.operator = O, Error.captureStackTrace && Error.captureStackTrace(m(G), B), G.stack, G.name = "AssertionError", l(G);
    }
    return a(ee, [{
      key: "toString",
      value: function() {
        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
      }
    }, {
      key: j,
      value: function(G, le) {
        return I(this, e(e({}, le), {}, {
          customInspect: !1,
          depth: 0
        }));
      }
    }]), ee;
  })(/* @__PURE__ */ w(Error), I.custom);
  return assertion_error = ce, assertion_error;
}
var isArguments, hasRequiredIsArguments;
function requireIsArguments() {
  if (hasRequiredIsArguments) return isArguments;
  hasRequiredIsArguments = 1;
  var t = Object.prototype.toString;
  return isArguments = function(n) {
    var s = t.call(n), r = s === "[object Arguments]";
    return r || (r = s !== "[object Array]" && n !== null && typeof n == "object" && typeof n.length == "number" && n.length >= 0 && t.call(n.callee) === "[object Function]"), r;
  }, isArguments;
}
var implementation$3, hasRequiredImplementation$3;
function requireImplementation$3() {
  if (hasRequiredImplementation$3) return implementation$3;
  hasRequiredImplementation$3 = 1;
  var t;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, n = Object.prototype.toString, s = requireIsArguments(), r = Object.prototype.propertyIsEnumerable, a = !r.call({ toString: null }, "toString"), f = r.call(function() {
    }, "prototype"), u = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], h = function(w) {
      var R = w.constructor;
      return R && R.prototype === w;
    }, g = {
      $applicationCache: !0,
      $console: !0,
      $external: !0,
      $frame: !0,
      $frameElement: !0,
      $frames: !0,
      $innerHeight: !0,
      $innerWidth: !0,
      $onmozfullscreenchange: !0,
      $onmozfullscreenerror: !0,
      $outerHeight: !0,
      $outerWidth: !0,
      $pageXOffset: !0,
      $pageYOffset: !0,
      $parent: !0,
      $scrollLeft: !0,
      $scrollTop: !0,
      $scrollX: !0,
      $scrollY: !0,
      $self: !0,
      $webkitIndexedDB: !0,
      $webkitStorageInfo: !0,
      $window: !0
    }, l = (function() {
      if (typeof window > "u")
        return !1;
      for (var w in window)
        try {
          if (!g["$" + w] && e.call(window, w) && window[w] !== null && typeof window[w] == "object")
            try {
              h(window[w]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), m = function(w) {
      if (typeof window > "u" || !l)
        return h(w);
      try {
        return h(w);
      } catch {
        return !1;
      }
    };
    t = function(R) {
      var p = R !== null && typeof R == "object", q = n.call(R) === "[object Function]", c = s(R), v = p && n.call(R) === "[object String]", P = [];
      if (!p && !q && !c)
        throw new TypeError("Object.keys called on a non-object");
      var E = f && q;
      if (v && R.length > 0 && !e.call(R, 0))
        for (var I = 0; I < R.length; ++I)
          P.push(String(I));
      if (c && R.length > 0)
        for (var A = 0; A < R.length; ++A)
          P.push(String(A));
      else
        for (var $ in R)
          !(E && $ === "prototype") && e.call(R, $) && P.push(String($));
      if (a)
        for (var x = m(R), M = 0; M < u.length; ++M)
          !(x && u[M] === "constructor") && e.call(R, u[M]) && P.push(u[M]);
      return P;
    };
  }
  return implementation$3 = t, implementation$3;
}
var objectKeys, hasRequiredObjectKeys;
function requireObjectKeys() {
  if (hasRequiredObjectKeys) return objectKeys;
  hasRequiredObjectKeys = 1;
  var t = Array.prototype.slice, e = requireIsArguments(), n = Object.keys, s = n ? function(f) {
    return n(f);
  } : requireImplementation$3(), r = Object.keys;
  return s.shim = function() {
    if (Object.keys) {
      var f = (function() {
        var u = Object.keys(arguments);
        return u && u.length === arguments.length;
      })(1, 2);
      f || (Object.keys = function(h) {
        return e(h) ? r(t.call(h)) : r(h);
      });
    } else
      Object.keys = s;
    return Object.keys || s;
  }, objectKeys = s, objectKeys;
}
var implementation$2, hasRequiredImplementation$2;
function requireImplementation$2() {
  if (hasRequiredImplementation$2) return implementation$2;
  hasRequiredImplementation$2 = 1;
  var t = requireObjectKeys(), e = requireShams$1()(), n = /* @__PURE__ */ requireCallBound$1(), s = /* @__PURE__ */ requireEsObjectAtoms(), r = n("Array.prototype.push"), a = n("Object.prototype.propertyIsEnumerable"), f = e ? s.getOwnPropertySymbols : null;
  return implementation$2 = function(h, g) {
    if (h == null)
      throw new TypeError("target must be an object");
    var l = s(h);
    if (arguments.length === 1)
      return l;
    for (var m = 1; m < arguments.length; ++m) {
      var w = s(arguments[m]), R = t(w), p = e && (s.getOwnPropertySymbols || f);
      if (p)
        for (var q = p(w), c = 0; c < q.length; ++c) {
          var v = q[c];
          a(w, v) && r(R, v);
        }
      for (var P = 0; P < R.length; ++P) {
        var E = R[P];
        if (a(w, E)) {
          var I = w[E];
          l[E] = I;
        }
      }
    }
    return l;
  }, implementation$2;
}
var polyfill$2, hasRequiredPolyfill$2;
function requirePolyfill$2() {
  if (hasRequiredPolyfill$2) return polyfill$2;
  hasRequiredPolyfill$2 = 1;
  var t = requireImplementation$2(), e = function() {
    if (!Object.assign)
      return !1;
    for (var s = "abcdefghijklmnopqrst", r = s.split(""), a = {}, f = 0; f < r.length; ++f)
      a[r[f]] = r[f];
    var u = Object.assign({}, a), h = "";
    for (var g in u)
      h += g;
    return s !== h;
  }, n = function() {
    if (!Object.assign || !Object.preventExtensions)
      return !1;
    var s = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(s, "xy");
    } catch {
      return s[1] === "y";
    }
    return !1;
  };
  return polyfill$2 = function() {
    return !Object.assign || e() || n() ? t : Object.assign;
  }, polyfill$2;
}
var implementation$1, hasRequiredImplementation$1;
function requireImplementation$1() {
  if (hasRequiredImplementation$1) return implementation$1;
  hasRequiredImplementation$1 = 1;
  var t = function(e) {
    return e !== e;
  };
  return implementation$1 = function(n, s) {
    return n === 0 && s === 0 ? 1 / n === 1 / s : !!(n === s || t(n) && t(s));
  }, implementation$1;
}
var polyfill$1, hasRequiredPolyfill$1;
function requirePolyfill$1() {
  if (hasRequiredPolyfill$1) return polyfill$1;
  hasRequiredPolyfill$1 = 1;
  var t = requireImplementation$1();
  return polyfill$1 = function() {
    return typeof Object.is == "function" ? Object.is : t;
  }, polyfill$1;
}
var callBound, hasRequiredCallBound;
function requireCallBound() {
  if (hasRequiredCallBound) return callBound;
  hasRequiredCallBound = 1;
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = requireCallBind(), n = e(t("String.prototype.indexOf"));
  return callBound = function(r, a) {
    var f = t(r, !!a);
    return typeof f == "function" && n(r, ".prototype.") > -1 ? e(f) : f;
  }, callBound;
}
var defineProperties_1, hasRequiredDefineProperties;
function requireDefineProperties() {
  if (hasRequiredDefineProperties) return defineProperties_1;
  hasRequiredDefineProperties = 1;
  var t = requireObjectKeys(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", n = Object.prototype.toString, s = Array.prototype.concat, r = /* @__PURE__ */ requireDefineDataProperty(), a = function(g) {
    return typeof g == "function" && n.call(g) === "[object Function]";
  }, f = /* @__PURE__ */ requireHasPropertyDescriptors()(), u = function(g, l, m, w) {
    if (l in g) {
      if (w === !0) {
        if (g[l] === m)
          return;
      } else if (!a(w) || !w())
        return;
    }
    f ? r(g, l, m, !0) : r(g, l, m);
  }, h = function(g, l) {
    var m = arguments.length > 2 ? arguments[2] : {}, w = t(l);
    e && (w = s.call(w, Object.getOwnPropertySymbols(l)));
    for (var R = 0; R < w.length; R += 1)
      u(g, w[R], l[w[R]], m[w[R]]);
  };
  return h.supportsDescriptors = !!f, defineProperties_1 = h, defineProperties_1;
}
var shim$1, hasRequiredShim$1;
function requireShim$1() {
  if (hasRequiredShim$1) return shim$1;
  hasRequiredShim$1 = 1;
  var t = requirePolyfill$1(), e = requireDefineProperties();
  return shim$1 = function() {
    var s = t();
    return e(Object, { is: s }, {
      is: function() {
        return Object.is !== s;
      }
    }), s;
  }, shim$1;
}
var objectIs, hasRequiredObjectIs;
function requireObjectIs() {
  if (hasRequiredObjectIs) return objectIs;
  hasRequiredObjectIs = 1;
  var t = requireDefineProperties(), e = requireCallBind(), n = requireImplementation$1(), s = requirePolyfill$1(), r = requireShim$1(), a = e(s(), Object);
  return t(a, {
    getPolyfill: s,
    implementation: n,
    shim: r
  }), objectIs = a, objectIs;
}
var implementation, hasRequiredImplementation;
function requireImplementation() {
  return hasRequiredImplementation || (hasRequiredImplementation = 1, implementation = function(e) {
    return e !== e;
  }), implementation;
}
var polyfill, hasRequiredPolyfill;
function requirePolyfill() {
  if (hasRequiredPolyfill) return polyfill;
  hasRequiredPolyfill = 1;
  var t = requireImplementation();
  return polyfill = function() {
    return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : t;
  }, polyfill;
}
var shim, hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim;
  hasRequiredShim = 1;
  var t = requireDefineProperties(), e = requirePolyfill();
  return shim = function() {
    var s = e();
    return t(Number, { isNaN: s }, {
      isNaN: function() {
        return Number.isNaN !== s;
      }
    }), s;
  }, shim;
}
var isNan, hasRequiredIsNan;
function requireIsNan() {
  if (hasRequiredIsNan) return isNan;
  hasRequiredIsNan = 1;
  var t = requireCallBind(), e = requireDefineProperties(), n = requireImplementation(), s = requirePolyfill(), r = requireShim(), a = t(s(), Number);
  return e(a, {
    getPolyfill: s,
    implementation: n,
    shim: r
  }), isNan = a, isNan;
}
var comparisons, hasRequiredComparisons;
function requireComparisons() {
  if (hasRequiredComparisons) return comparisons;
  hasRequiredComparisons = 1;
  function t(ge, Se) {
    return a(ge) || r(ge, Se) || n(ge, Se) || e();
  }
  function e() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function n(ge, Se) {
    if (ge) {
      if (typeof ge == "string") return s(ge, Se);
      var Le = Object.prototype.toString.call(ge).slice(8, -1);
      if (Le === "Object" && ge.constructor && (Le = ge.constructor.name), Le === "Map" || Le === "Set") return Array.from(ge);
      if (Le === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(Le)) return s(ge, Se);
    }
  }
  function s(ge, Se) {
    (Se == null || Se > ge.length) && (Se = ge.length);
    for (var Le = 0, Me = new Array(Se); Le < Se; Le++) Me[Le] = ge[Le];
    return Me;
  }
  function r(ge, Se) {
    var Le = ge == null ? null : typeof Symbol < "u" && ge[Symbol.iterator] || ge["@@iterator"];
    if (Le != null) {
      var Me, ke, He, U, o = [], _ = !0, W = !1;
      try {
        if (He = (Le = Le.call(ge)).next, Se !== 0) for (; !(_ = (Me = He.call(Le)).done) && (o.push(Me.value), o.length !== Se); _ = !0) ;
      } catch (ue) {
        W = !0, ke = ue;
      } finally {
        try {
          if (!_ && Le.return != null && (U = Le.return(), Object(U) !== U)) return;
        } finally {
          if (W) throw ke;
        }
      }
      return o;
    }
  }
  function a(ge) {
    if (Array.isArray(ge)) return ge;
  }
  function f(ge) {
    "@babel/helpers - typeof";
    return f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Se) {
      return typeof Se;
    } : function(Se) {
      return Se && typeof Symbol == "function" && Se.constructor === Symbol && Se !== Symbol.prototype ? "symbol" : typeof Se;
    }, f(ge);
  }
  var u = /a/g.flags !== void 0, h = function(Se) {
    var Le = [];
    return Se.forEach(function(Me) {
      return Le.push(Me);
    }), Le;
  }, g = function(Se) {
    var Le = [];
    return Se.forEach(function(Me, ke) {
      return Le.push([ke, Me]);
    }), Le;
  }, l = Object.is ? Object.is : requireObjectIs(), m = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
    return [];
  }, w = Number.isNaN ? Number.isNaN : requireIsNan();
  function R(ge) {
    return ge.call.bind(ge);
  }
  var p = R(Object.prototype.hasOwnProperty), q = R(Object.prototype.propertyIsEnumerable), c = R(Object.prototype.toString), v = requireUtil$2().types, P = v.isAnyArrayBuffer, E = v.isArrayBufferView, I = v.isDate, A = v.isMap, $ = v.isRegExp, x = v.isSet, M = v.isNativeError, V = v.isBoxedPrimitive, C = v.isNumberObject, z = v.isStringObject, y = v.isBooleanObject, D = v.isBigIntObject, ie = v.isSymbolObject, de = v.isFloat32Array, we = v.isFloat64Array;
  function be(ge) {
    if (ge.length === 0 || ge.length > 10) return !0;
    for (var Se = 0; Se < ge.length; Se++) {
      var Le = ge.charCodeAt(Se);
      if (Le < 48 || Le > 57) return !0;
    }
    return ge.length === 10 && ge >= Math.pow(2, 32);
  }
  function ce(ge) {
    return Object.keys(ge).filter(be).concat(m(ge).filter(Object.prototype.propertyIsEnumerable.bind(ge)));
  }
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  function fe(ge, Se) {
    if (ge === Se)
      return 0;
    for (var Le = ge.length, Me = Se.length, ke = 0, He = Math.min(Le, Me); ke < He; ++ke)
      if (ge[ke] !== Se[ke]) {
        Le = ge[ke], Me = Se[ke];
        break;
      }
    return Le < Me ? -1 : Me < Le ? 1 : 0;
  }
  var j = !0, pe = !1, ee = 0, X = 1, G = 2, le = 3;
  function O(ge, Se) {
    return u ? ge.source === Se.source && ge.flags === Se.flags : RegExp.prototype.toString.call(ge) === RegExp.prototype.toString.call(Se);
  }
  function B(ge, Se) {
    if (ge.byteLength !== Se.byteLength)
      return !1;
    for (var Le = 0; Le < ge.byteLength; Le++)
      if (ge[Le] !== Se[Le])
        return !1;
    return !0;
  }
  function N(ge, Se) {
    return ge.byteLength !== Se.byteLength ? !1 : fe(new Uint8Array(ge.buffer, ge.byteOffset, ge.byteLength), new Uint8Array(Se.buffer, Se.byteOffset, Se.byteLength)) === 0;
  }
  function re(ge, Se) {
    return ge.byteLength === Se.byteLength && fe(new Uint8Array(ge), new Uint8Array(Se)) === 0;
  }
  function ne(ge, Se) {
    return C(ge) ? C(Se) && l(Number.prototype.valueOf.call(ge), Number.prototype.valueOf.call(Se)) : z(ge) ? z(Se) && String.prototype.valueOf.call(ge) === String.prototype.valueOf.call(Se) : y(ge) ? y(Se) && Boolean.prototype.valueOf.call(ge) === Boolean.prototype.valueOf.call(Se) : D(ge) ? D(Se) && BigInt.prototype.valueOf.call(ge) === BigInt.prototype.valueOf.call(Se) : ie(Se) && Symbol.prototype.valueOf.call(ge) === Symbol.prototype.valueOf.call(Se);
  }
  function F(ge, Se, Le, Me) {
    if (ge === Se)
      return ge !== 0 ? !0 : Le ? l(ge, Se) : !0;
    if (Le) {
      if (f(ge) !== "object")
        return typeof ge == "number" && w(ge) && w(Se);
      if (f(Se) !== "object" || ge === null || Se === null || Object.getPrototypeOf(ge) !== Object.getPrototypeOf(Se))
        return !1;
    } else {
      if (ge === null || f(ge) !== "object")
        return Se === null || f(Se) !== "object" ? ge == Se : !1;
      if (Se === null || f(Se) !== "object")
        return !1;
    }
    var ke = c(ge), He = c(Se);
    if (ke !== He)
      return !1;
    if (Array.isArray(ge)) {
      if (ge.length !== Se.length)
        return !1;
      var U = ce(ge), o = ce(Se);
      return U.length !== o.length ? !1 : H(ge, Se, Le, Me, X, U);
    }
    if (ke === "[object Object]" && (!A(ge) && A(Se) || !x(ge) && x(Se)))
      return !1;
    if (I(ge)) {
      if (!I(Se) || Date.prototype.getTime.call(ge) !== Date.prototype.getTime.call(Se))
        return !1;
    } else if ($(ge)) {
      if (!$(Se) || !O(ge, Se))
        return !1;
    } else if (M(ge) || ge instanceof Error) {
      if (ge.message !== Se.message || ge.name !== Se.name)
        return !1;
    } else if (E(ge)) {
      if (!Le && (de(ge) || we(ge))) {
        if (!B(ge, Se))
          return !1;
      } else if (!N(ge, Se))
        return !1;
      var _ = ce(ge), W = ce(Se);
      return _.length !== W.length ? !1 : H(ge, Se, Le, Me, ee, _);
    } else {
      if (x(ge))
        return !x(Se) || ge.size !== Se.size ? !1 : H(ge, Se, Le, Me, G);
      if (A(ge))
        return !A(Se) || ge.size !== Se.size ? !1 : H(ge, Se, Le, Me, le);
      if (P(ge)) {
        if (!re(ge, Se))
          return !1;
      } else if (V(ge) && !ne(ge, Se))
        return !1;
    }
    return H(ge, Se, Le, Me, ee);
  }
  function L(ge, Se) {
    return Se.filter(function(Le) {
      return q(ge, Le);
    });
  }
  function H(ge, Se, Le, Me, ke, He) {
    if (arguments.length === 5) {
      He = Object.keys(ge);
      var U = Object.keys(Se);
      if (He.length !== U.length)
        return !1;
    }
    for (var o = 0; o < He.length; o++)
      if (!p(Se, He[o]))
        return !1;
    if (Le && arguments.length === 5) {
      var _ = m(ge);
      if (_.length !== 0) {
        var W = 0;
        for (o = 0; o < _.length; o++) {
          var ue = _[o];
          if (q(ge, ue)) {
            if (!q(Se, ue))
              return !1;
            He.push(ue), W++;
          } else if (q(Se, ue))
            return !1;
        }
        var J = m(Se);
        if (_.length !== J.length && L(Se, J).length !== W)
          return !1;
      } else {
        var he = m(Se);
        if (he.length !== 0 && L(Se, he).length !== 0)
          return !1;
      }
    }
    if (He.length === 0 && (ke === ee || ke === X && ge.length === 0 || ge.size === 0))
      return !0;
    if (Me === void 0)
      Me = {
        val1: /* @__PURE__ */ new Map(),
        val2: /* @__PURE__ */ new Map(),
        position: 0
      };
    else {
      var k = Me.val1.get(ge);
      if (k !== void 0) {
        var Be = Me.val2.get(Se);
        if (Be !== void 0)
          return k === Be;
      }
      Me.position++;
    }
    Me.val1.set(ge, Me.position), Me.val2.set(Se, Me.position);
    var We = Ce(ge, Se, Le, He, Me, ke);
    return Me.val1.delete(ge), Me.val2.delete(Se), We;
  }
  function se(ge, Se, Le, Me) {
    for (var ke = h(ge), He = 0; He < ke.length; He++) {
      var U = ke[He];
      if (F(Se, U, Le, Me))
        return ge.delete(U), !0;
    }
    return !1;
  }
  function Ee(ge) {
    switch (f(ge)) {
      case "undefined":
        return null;
      case "object":
        return;
      case "symbol":
        return !1;
      case "string":
        ge = +ge;
      // Loose equal entries exist only if the string is possible to convert to
      // a regular number and not NaN.
      // Fall through
      case "number":
        if (w(ge))
          return !1;
    }
    return !0;
  }
  function Re(ge, Se, Le) {
    var Me = Ee(Le);
    return Me ?? (Se.has(Me) && !ge.has(Me));
  }
  function Pe(ge, Se, Le, Me, ke) {
    var He = Ee(Le);
    if (He != null)
      return He;
    var U = Se.get(He);
    return U === void 0 && !Se.has(He) || !F(Me, U, !1, ke) ? !1 : !ge.has(He) && F(Me, U, !1, ke);
  }
  function Oe(ge, Se, Le, Me) {
    for (var ke = null, He = h(ge), U = 0; U < He.length; U++) {
      var o = He[U];
      if (f(o) === "object" && o !== null)
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(o);
      else if (!Se.has(o)) {
        if (Le || !Re(ge, Se, o))
          return !1;
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(o);
      }
    }
    if (ke !== null) {
      for (var _ = h(Se), W = 0; W < _.length; W++) {
        var ue = _[W];
        if (f(ue) === "object" && ue !== null) {
          if (!se(ke, ue, Le, Me)) return !1;
        } else if (!Le && !ge.has(ue) && !se(ke, ue, Le, Me))
          return !1;
      }
      return ke.size === 0;
    }
    return !0;
  }
  function te(ge, Se, Le, Me, ke, He) {
    for (var U = h(ge), o = 0; o < U.length; o++) {
      var _ = U[o];
      if (F(Le, _, ke, He) && F(Me, Se.get(_), ke, He))
        return ge.delete(_), !0;
    }
    return !1;
  }
  function $e(ge, Se, Le, Me) {
    for (var ke = null, He = g(ge), U = 0; U < He.length; U++) {
      var o = t(He[U], 2), _ = o[0], W = o[1];
      if (f(_) === "object" && _ !== null)
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(_);
      else {
        var ue = Se.get(_);
        if (ue === void 0 && !Se.has(_) || !F(W, ue, Le, Me)) {
          if (Le || !Pe(ge, Se, _, W, Me)) return !1;
          ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(_);
        }
      }
    }
    if (ke !== null) {
      for (var J = g(Se), he = 0; he < J.length; he++) {
        var k = t(J[he], 2), Be = k[0], We = k[1];
        if (f(Be) === "object" && Be !== null) {
          if (!te(ke, ge, Be, We, Le, Me)) return !1;
        } else if (!Le && (!ge.has(Be) || !F(ge.get(Be), We, !1, Me)) && !te(ke, ge, Be, We, !1, Me))
          return !1;
      }
      return ke.size === 0;
    }
    return !0;
  }
  function Ce(ge, Se, Le, Me, ke, He) {
    var U = 0;
    if (He === G) {
      if (!Oe(ge, Se, Le, ke))
        return !1;
    } else if (He === le) {
      if (!$e(ge, Se, Le, ke))
        return !1;
    } else if (He === X)
      for (; U < ge.length; U++)
        if (p(ge, U)) {
          if (!p(Se, U) || !F(ge[U], Se[U], Le, ke))
            return !1;
        } else {
          if (p(Se, U))
            return !1;
          for (var o = Object.keys(ge); U < o.length; U++) {
            var _ = o[U];
            if (!p(Se, _) || !F(ge[_], Se[_], Le, ke))
              return !1;
          }
          return o.length === Object.keys(Se).length;
        }
    for (U = 0; U < Me.length; U++) {
      var W = Me[U];
      if (!F(ge[W], Se[W], Le, ke))
        return !1;
    }
    return !0;
  }
  function Te(ge, Se) {
    return F(ge, Se, pe);
  }
  function Ue(ge, Se) {
    return F(ge, Se, j);
  }
  return comparisons = {
    isDeepEqual: Te,
    isDeepStrictEqual: Ue
  }, comparisons;
}
var hasRequiredAssert;
function requireAssert() {
  if (hasRequiredAssert) return assert.exports;
  hasRequiredAssert = 1;
  function t(G) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(le) {
      return typeof le;
    } : function(le) {
      return le && typeof Symbol == "function" && le.constructor === Symbol && le !== Symbol.prototype ? "symbol" : typeof le;
    }, t(G);
  }
  function e(G, le, O) {
    return Object.defineProperty(G, "prototype", { writable: !1 }), G;
  }
  function n(G, le) {
    if (!(G instanceof le))
      throw new TypeError("Cannot call a class as a function");
  }
  var s = requireErrors$1(), r = s.codes, a = r.ERR_AMBIGUOUS_ARGUMENT, f = r.ERR_INVALID_ARG_TYPE, u = r.ERR_INVALID_ARG_VALUE, h = r.ERR_INVALID_RETURN_VALUE, g = r.ERR_MISSING_ARGS, l = requireAssertion_error(), m = requireUtil$2(), w = m.inspect, R = requireUtil$2().types, p = R.isPromise, q = R.isRegExp, c = requirePolyfill$2()(), v = requirePolyfill$1()(), P = requireCallBound()("RegExp.prototype.test"), E, I;
  function A() {
    var G = requireComparisons();
    E = G.isDeepEqual, I = G.isDeepStrictEqual;
  }
  var $ = !1, x = assert.exports = y, M = {};
  function V(G) {
    throw G.message instanceof Error ? G.message : new l(G);
  }
  function C(G, le, O, B, N) {
    var re = arguments.length, ne;
    if (re === 0)
      ne = "Failed";
    else if (re === 1)
      O = G, G = void 0;
    else {
      if ($ === !1) {
        $ = !0;
        var F = process$1.emitWarning ? process$1.emitWarning : console.warn.bind(console);
        F("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
      }
      re === 2 && (B = "!=");
    }
    if (O instanceof Error) throw O;
    var L = {
      actual: G,
      expected: le,
      operator: B === void 0 ? "fail" : B,
      stackStartFn: N || C
    };
    O !== void 0 && (L.message = O);
    var H = new l(L);
    throw ne && (H.message = ne, H.generatedMessage = !0), H;
  }
  x.fail = C, x.AssertionError = l;
  function z(G, le, O, B) {
    if (!O) {
      var N = !1;
      if (le === 0)
        N = !0, B = "No value argument passed to `assert.ok()`";
      else if (B instanceof Error)
        throw B;
      var re = new l({
        actual: O,
        expected: !0,
        message: B,
        operator: "==",
        stackStartFn: G
      });
      throw re.generatedMessage = N, re;
    }
  }
  function y() {
    for (var G = arguments.length, le = new Array(G), O = 0; O < G; O++)
      le[O] = arguments[O];
    z.apply(void 0, [y, le.length].concat(le));
  }
  x.ok = y, x.equal = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    le != O && V({
      actual: le,
      expected: O,
      message: B,
      operator: "==",
      stackStartFn: G
    });
  }, x.notEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    le == O && V({
      actual: le,
      expected: O,
      message: B,
      operator: "!=",
      stackStartFn: G
    });
  }, x.deepEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    E === void 0 && A(), E(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "deepEqual",
      stackStartFn: G
    });
  }, x.notDeepEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    E === void 0 && A(), E(le, O) && V({
      actual: le,
      expected: O,
      message: B,
      operator: "notDeepEqual",
      stackStartFn: G
    });
  }, x.deepStrictEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    E === void 0 && A(), I(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "deepStrictEqual",
      stackStartFn: G
    });
  }, x.notDeepStrictEqual = D;
  function D(G, le, O) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    E === void 0 && A(), I(G, le) && V({
      actual: G,
      expected: le,
      message: O,
      operator: "notDeepStrictEqual",
      stackStartFn: D
    });
  }
  x.strictEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    v(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "strictEqual",
      stackStartFn: G
    });
  }, x.notStrictEqual = function G(le, O, B) {
    if (arguments.length < 2)
      throw new g("actual", "expected");
    v(le, O) && V({
      actual: le,
      expected: O,
      message: B,
      operator: "notStrictEqual",
      stackStartFn: G
    });
  };
  var ie = /* @__PURE__ */ e(function G(le, O, B) {
    var N = this;
    n(this, G), O.forEach(function(re) {
      re in le && (B !== void 0 && typeof B[re] == "string" && q(le[re]) && P(le[re], B[re]) ? N[re] = B[re] : N[re] = le[re]);
    });
  });
  function de(G, le, O, B, N, re) {
    if (!(O in G) || !I(G[O], le[O])) {
      if (!B) {
        var ne = new ie(G, N), F = new ie(le, N, G), L = new l({
          actual: ne,
          expected: F,
          operator: "deepStrictEqual",
          stackStartFn: re
        });
        throw L.actual = G, L.expected = le, L.operator = re.name, L;
      }
      V({
        actual: G,
        expected: le,
        message: B,
        operator: re.name,
        stackStartFn: re
      });
    }
  }
  function we(G, le, O, B) {
    if (typeof le != "function") {
      if (q(le)) return P(le, G);
      if (arguments.length === 2)
        throw new f("expected", ["Function", "RegExp"], le);
      if (t(G) !== "object" || G === null) {
        var N = new l({
          actual: G,
          expected: le,
          message: O,
          operator: "deepStrictEqual",
          stackStartFn: B
        });
        throw N.operator = B.name, N;
      }
      var re = Object.keys(le);
      if (le instanceof Error)
        re.push("name", "message");
      else if (re.length === 0)
        throw new u("error", le, "may not be an empty object");
      return E === void 0 && A(), re.forEach(function(ne) {
        typeof G[ne] == "string" && q(le[ne]) && P(le[ne], G[ne]) || de(G, le, ne, O, re, B);
      }), !0;
    }
    return le.prototype !== void 0 && G instanceof le ? !0 : Error.isPrototypeOf(le) ? !1 : le.call({}, G) === !0;
  }
  function be(G) {
    if (typeof G != "function")
      throw new f("fn", "Function", G);
    try {
      G();
    } catch (le) {
      return le;
    }
    return M;
  }
  function ce(G) {
    return p(G) || G !== null && t(G) === "object" && typeof G.then == "function" && typeof G.catch == "function";
  }
  function fe(G) {
    return Promise.resolve().then(function() {
      var le;
      if (typeof G == "function") {
        if (le = G(), !ce(le))
          throw new h("instance of Promise", "promiseFn", le);
      } else if (ce(G))
        le = G;
      else
        throw new f("promiseFn", ["Function", "Promise"], G);
      return Promise.resolve().then(function() {
        return le;
      }).then(function() {
        return M;
      }).catch(function(O) {
        return O;
      });
    });
  }
  function j(G, le, O, B) {
    if (typeof O == "string") {
      if (arguments.length === 4)
        throw new f("error", ["Object", "Error", "Function", "RegExp"], O);
      if (t(le) === "object" && le !== null) {
        if (le.message === O)
          throw new a("error/message", 'The error message "'.concat(le.message, '" is identical to the message.'));
      } else if (le === O)
        throw new a("error/message", 'The error "'.concat(le, '" is identical to the message.'));
      B = O, O = void 0;
    } else if (O != null && t(O) !== "object" && typeof O != "function")
      throw new f("error", ["Object", "Error", "Function", "RegExp"], O);
    if (le === M) {
      var N = "";
      O && O.name && (N += " (".concat(O.name, ")")), N += B ? ": ".concat(B) : ".";
      var re = G.name === "rejects" ? "rejection" : "exception";
      V({
        actual: void 0,
        expected: O,
        operator: G.name,
        message: "Missing expected ".concat(re).concat(N),
        stackStartFn: G
      });
    }
    if (O && !we(le, O, B, G))
      throw le;
  }
  function pe(G, le, O, B) {
    if (le !== M) {
      if (typeof O == "string" && (B = O, O = void 0), !O || we(le, O)) {
        var N = B ? ": ".concat(B) : ".", re = G.name === "doesNotReject" ? "rejection" : "exception";
        V({
          actual: le,
          expected: O,
          operator: G.name,
          message: "Got unwanted ".concat(re).concat(N, `
`) + 'Actual message: "'.concat(le && le.message, '"'),
          stackStartFn: G
        });
      }
      throw le;
    }
  }
  x.throws = function G(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    j.apply(void 0, [G, be(le)].concat(B));
  }, x.rejects = function G(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(le).then(function(re) {
      return j.apply(void 0, [G, re].concat(B));
    });
  }, x.doesNotThrow = function G(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    pe.apply(void 0, [G, be(le)].concat(B));
  }, x.doesNotReject = function G(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(le).then(function(re) {
      return pe.apply(void 0, [G, re].concat(B));
    });
  }, x.ifError = function G(le) {
    if (le != null) {
      var O = "ifError got unwanted exception: ";
      t(le) === "object" && typeof le.message == "string" ? le.message.length === 0 && le.constructor ? O += le.constructor.name : O += le.message : O += w(le);
      var B = new l({
        actual: le,
        expected: null,
        operator: "ifError",
        message: O,
        stackStartFn: G
      }), N = le.stack;
      if (typeof N == "string") {
        var re = N.split(`
`);
        re.shift();
        for (var ne = B.stack.split(`
`), F = 0; F < re.length; F++) {
          var L = ne.indexOf(re[F]);
          if (L !== -1) {
            ne = ne.slice(0, L);
            break;
          }
        }
        B.stack = "".concat(ne.join(`
`), `
`).concat(re.join(`
`));
      }
      throw B;
    }
  };
  function ee(G, le, O, B, N) {
    if (!q(le))
      throw new f("regexp", "RegExp", le);
    var re = N === "match";
    if (typeof G != "string" || P(le, G) !== re) {
      if (O instanceof Error)
        throw O;
      var ne = !O;
      O = O || (typeof G != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(t(G), " (").concat(w(G), ")") : (re ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(w(le), `. Input:

`).concat(w(G), `
`));
      var F = new l({
        actual: G,
        expected: le,
        message: O,
        operator: N,
        stackStartFn: B
      });
      throw F.generatedMessage = ne, F;
    }
  }
  x.match = function G(le, O, B) {
    ee(le, O, B, G, "match");
  }, x.doesNotMatch = function G(le, O, B) {
    ee(le, O, B, G, "doesNotMatch");
  };
  function X() {
    for (var G = arguments.length, le = new Array(G), O = 0; O < G; O++)
      le[O] = arguments[O];
    z.apply(void 0, [X, le.length].concat(le));
  }
  return x.strict = c(X, x, {
    equal: x.strictEqual,
    deepEqual: x.deepStrictEqual,
    notEqual: x.notStrictEqual,
    notDeepEqual: x.notDeepStrictEqual
  }), x.strict.strict = x.strict, assert.exports;
}
var zstream, hasRequiredZstream;
function requireZstream() {
  if (hasRequiredZstream) return zstream;
  hasRequiredZstream = 1;
  function t() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return zstream = t, zstream;
}
var deflate = {}, common = {}, hasRequiredCommon;
function requireCommon() {
  return hasRequiredCommon || (hasRequiredCommon = 1, (function(t) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function n(a, f) {
      return Object.prototype.hasOwnProperty.call(a, f);
    }
    t.assign = function(a) {
      for (var f = Array.prototype.slice.call(arguments, 1); f.length; ) {
        var u = f.shift();
        if (u) {
          if (typeof u != "object")
            throw new TypeError(u + "must be non-object");
          for (var h in u)
            n(u, h) && (a[h] = u[h]);
        }
      }
      return a;
    }, t.shrinkBuf = function(a, f) {
      return a.length === f ? a : a.subarray ? a.subarray(0, f) : (a.length = f, a);
    };
    var s = {
      arraySet: function(a, f, u, h, g) {
        if (f.subarray && a.subarray) {
          a.set(f.subarray(u, u + h), g);
          return;
        }
        for (var l = 0; l < h; l++)
          a[g + l] = f[u + l];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        var f, u, h, g, l, m;
        for (h = 0, f = 0, u = a.length; f < u; f++)
          h += a[f].length;
        for (m = new Uint8Array(h), g = 0, f = 0, u = a.length; f < u; f++)
          l = a[f], m.set(l, g), g += l.length;
        return m;
      }
    }, r = {
      arraySet: function(a, f, u, h, g) {
        for (var l = 0; l < h; l++)
          a[g + l] = f[u + l];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        return [].concat.apply([], a);
      }
    };
    t.setTyped = function(a) {
      a ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, s)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, r));
    }, t.setTyped(e);
  })(common)), common;
}
var trees = {}, hasRequiredTrees;
function requireTrees() {
  if (hasRequiredTrees) return trees;
  hasRequiredTrees = 1;
  var t = requireCommon(), e = 4, n = 0, s = 1, r = 2;
  function a(o) {
    for (var _ = o.length; --_ >= 0; )
      o[_] = 0;
  }
  var f = 0, u = 1, h = 2, g = 3, l = 258, m = 29, w = 256, R = w + 1 + m, p = 30, q = 19, c = 2 * R + 1, v = 15, P = 16, E = 7, I = 256, A = 16, $ = 17, x = 18, M = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), V = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), C = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], y = 512, D = new Array((R + 2) * 2);
  a(D);
  var ie = new Array(p * 2);
  a(ie);
  var de = new Array(y);
  a(de);
  var we = new Array(l - g + 1);
  a(we);
  var be = new Array(m);
  a(be);
  var ce = new Array(p);
  a(ce);
  function fe(o, _, W, ue, J) {
    this.static_tree = o, this.extra_bits = _, this.extra_base = W, this.elems = ue, this.max_length = J, this.has_stree = o && o.length;
  }
  var j, pe, ee;
  function X(o, _) {
    this.dyn_tree = o, this.max_code = 0, this.stat_desc = _;
  }
  function G(o) {
    return o < 256 ? de[o] : de[256 + (o >>> 7)];
  }
  function le(o, _) {
    o.pending_buf[o.pending++] = _ & 255, o.pending_buf[o.pending++] = _ >>> 8 & 255;
  }
  function O(o, _, W) {
    o.bi_valid > P - W ? (o.bi_buf |= _ << o.bi_valid & 65535, le(o, o.bi_buf), o.bi_buf = _ >> P - o.bi_valid, o.bi_valid += W - P) : (o.bi_buf |= _ << o.bi_valid & 65535, o.bi_valid += W);
  }
  function B(o, _, W) {
    O(
      o,
      W[_ * 2],
      W[_ * 2 + 1]
      /*.Len*/
    );
  }
  function N(o, _) {
    var W = 0;
    do
      W |= o & 1, o >>>= 1, W <<= 1;
    while (--_ > 0);
    return W >>> 1;
  }
  function re(o) {
    o.bi_valid === 16 ? (le(o, o.bi_buf), o.bi_buf = 0, o.bi_valid = 0) : o.bi_valid >= 8 && (o.pending_buf[o.pending++] = o.bi_buf & 255, o.bi_buf >>= 8, o.bi_valid -= 8);
  }
  function ne(o, _) {
    var W = _.dyn_tree, ue = _.max_code, J = _.stat_desc.static_tree, he = _.stat_desc.has_stree, k = _.stat_desc.extra_bits, Be = _.stat_desc.extra_base, We = _.stat_desc.max_length, S, Ie, Fe, Z, _e, De, Ge = 0;
    for (Z = 0; Z <= v; Z++)
      o.bl_count[Z] = 0;
    for (W[o.heap[o.heap_max] * 2 + 1] = 0, S = o.heap_max + 1; S < c; S++)
      Ie = o.heap[S], Z = W[W[Ie * 2 + 1] * 2 + 1] + 1, Z > We && (Z = We, Ge++), W[Ie * 2 + 1] = Z, !(Ie > ue) && (o.bl_count[Z]++, _e = 0, Ie >= Be && (_e = k[Ie - Be]), De = W[Ie * 2], o.opt_len += De * (Z + _e), he && (o.static_len += De * (J[Ie * 2 + 1] + _e)));
    if (Ge !== 0) {
      do {
        for (Z = We - 1; o.bl_count[Z] === 0; )
          Z--;
        o.bl_count[Z]--, o.bl_count[Z + 1] += 2, o.bl_count[We]--, Ge -= 2;
      } while (Ge > 0);
      for (Z = We; Z !== 0; Z--)
        for (Ie = o.bl_count[Z]; Ie !== 0; )
          Fe = o.heap[--S], !(Fe > ue) && (W[Fe * 2 + 1] !== Z && (o.opt_len += (Z - W[Fe * 2 + 1]) * W[Fe * 2], W[Fe * 2 + 1] = Z), Ie--);
    }
  }
  function F(o, _, W) {
    var ue = new Array(v + 1), J = 0, he, k;
    for (he = 1; he <= v; he++)
      ue[he] = J = J + W[he - 1] << 1;
    for (k = 0; k <= _; k++) {
      var Be = o[k * 2 + 1];
      Be !== 0 && (o[k * 2] = N(ue[Be]++, Be));
    }
  }
  function L() {
    var o, _, W, ue, J, he = new Array(v + 1);
    for (W = 0, ue = 0; ue < m - 1; ue++)
      for (be[ue] = W, o = 0; o < 1 << M[ue]; o++)
        we[W++] = ue;
    for (we[W - 1] = ue, J = 0, ue = 0; ue < 16; ue++)
      for (ce[ue] = J, o = 0; o < 1 << V[ue]; o++)
        de[J++] = ue;
    for (J >>= 7; ue < p; ue++)
      for (ce[ue] = J << 7, o = 0; o < 1 << V[ue] - 7; o++)
        de[256 + J++] = ue;
    for (_ = 0; _ <= v; _++)
      he[_] = 0;
    for (o = 0; o <= 143; )
      D[o * 2 + 1] = 8, o++, he[8]++;
    for (; o <= 255; )
      D[o * 2 + 1] = 9, o++, he[9]++;
    for (; o <= 279; )
      D[o * 2 + 1] = 7, o++, he[7]++;
    for (; o <= 287; )
      D[o * 2 + 1] = 8, o++, he[8]++;
    for (F(D, R + 1, he), o = 0; o < p; o++)
      ie[o * 2 + 1] = 5, ie[o * 2] = N(o, 5);
    j = new fe(D, M, w + 1, R, v), pe = new fe(ie, V, 0, p, v), ee = new fe(new Array(0), C, 0, q, E);
  }
  function H(o) {
    var _;
    for (_ = 0; _ < R; _++)
      o.dyn_ltree[_ * 2] = 0;
    for (_ = 0; _ < p; _++)
      o.dyn_dtree[_ * 2] = 0;
    for (_ = 0; _ < q; _++)
      o.bl_tree[_ * 2] = 0;
    o.dyn_ltree[I * 2] = 1, o.opt_len = o.static_len = 0, o.last_lit = o.matches = 0;
  }
  function se(o) {
    o.bi_valid > 8 ? le(o, o.bi_buf) : o.bi_valid > 0 && (o.pending_buf[o.pending++] = o.bi_buf), o.bi_buf = 0, o.bi_valid = 0;
  }
  function Ee(o, _, W, ue) {
    se(o), le(o, W), le(o, ~W), t.arraySet(o.pending_buf, o.window, _, W, o.pending), o.pending += W;
  }
  function Re(o, _, W, ue) {
    var J = _ * 2, he = W * 2;
    return o[J] < o[he] || o[J] === o[he] && ue[_] <= ue[W];
  }
  function Pe(o, _, W) {
    for (var ue = o.heap[W], J = W << 1; J <= o.heap_len && (J < o.heap_len && Re(_, o.heap[J + 1], o.heap[J], o.depth) && J++, !Re(_, ue, o.heap[J], o.depth)); )
      o.heap[W] = o.heap[J], W = J, J <<= 1;
    o.heap[W] = ue;
  }
  function Oe(o, _, W) {
    var ue, J, he = 0, k, Be;
    if (o.last_lit !== 0)
      do
        ue = o.pending_buf[o.d_buf + he * 2] << 8 | o.pending_buf[o.d_buf + he * 2 + 1], J = o.pending_buf[o.l_buf + he], he++, ue === 0 ? B(o, J, _) : (k = we[J], B(o, k + w + 1, _), Be = M[k], Be !== 0 && (J -= be[k], O(o, J, Be)), ue--, k = G(ue), B(o, k, W), Be = V[k], Be !== 0 && (ue -= ce[k], O(o, ue, Be)));
      while (he < o.last_lit);
    B(o, I, _);
  }
  function te(o, _) {
    var W = _.dyn_tree, ue = _.stat_desc.static_tree, J = _.stat_desc.has_stree, he = _.stat_desc.elems, k, Be, We = -1, S;
    for (o.heap_len = 0, o.heap_max = c, k = 0; k < he; k++)
      W[k * 2] !== 0 ? (o.heap[++o.heap_len] = We = k, o.depth[k] = 0) : W[k * 2 + 1] = 0;
    for (; o.heap_len < 2; )
      S = o.heap[++o.heap_len] = We < 2 ? ++We : 0, W[S * 2] = 1, o.depth[S] = 0, o.opt_len--, J && (o.static_len -= ue[S * 2 + 1]);
    for (_.max_code = We, k = o.heap_len >> 1; k >= 1; k--)
      Pe(o, W, k);
    S = he;
    do
      k = o.heap[
        1
        /*SMALLEST*/
      ], o.heap[
        1
        /*SMALLEST*/
      ] = o.heap[o.heap_len--], Pe(
        o,
        W,
        1
        /*SMALLEST*/
      ), Be = o.heap[
        1
        /*SMALLEST*/
      ], o.heap[--o.heap_max] = k, o.heap[--o.heap_max] = Be, W[S * 2] = W[k * 2] + W[Be * 2], o.depth[S] = (o.depth[k] >= o.depth[Be] ? o.depth[k] : o.depth[Be]) + 1, W[k * 2 + 1] = W[Be * 2 + 1] = S, o.heap[
        1
        /*SMALLEST*/
      ] = S++, Pe(
        o,
        W,
        1
        /*SMALLEST*/
      );
    while (o.heap_len >= 2);
    o.heap[--o.heap_max] = o.heap[
      1
      /*SMALLEST*/
    ], ne(o, _), F(W, We, o.bl_count);
  }
  function $e(o, _, W) {
    var ue, J = -1, he, k = _[1], Be = 0, We = 7, S = 4;
    for (k === 0 && (We = 138, S = 3), _[(W + 1) * 2 + 1] = 65535, ue = 0; ue <= W; ue++)
      he = k, k = _[(ue + 1) * 2 + 1], !(++Be < We && he === k) && (Be < S ? o.bl_tree[he * 2] += Be : he !== 0 ? (he !== J && o.bl_tree[he * 2]++, o.bl_tree[A * 2]++) : Be <= 10 ? o.bl_tree[$ * 2]++ : o.bl_tree[x * 2]++, Be = 0, J = he, k === 0 ? (We = 138, S = 3) : he === k ? (We = 6, S = 3) : (We = 7, S = 4));
  }
  function Ce(o, _, W) {
    var ue, J = -1, he, k = _[1], Be = 0, We = 7, S = 4;
    for (k === 0 && (We = 138, S = 3), ue = 0; ue <= W; ue++)
      if (he = k, k = _[(ue + 1) * 2 + 1], !(++Be < We && he === k)) {
        if (Be < S)
          do
            B(o, he, o.bl_tree);
          while (--Be !== 0);
        else he !== 0 ? (he !== J && (B(o, he, o.bl_tree), Be--), B(o, A, o.bl_tree), O(o, Be - 3, 2)) : Be <= 10 ? (B(o, $, o.bl_tree), O(o, Be - 3, 3)) : (B(o, x, o.bl_tree), O(o, Be - 11, 7));
        Be = 0, J = he, k === 0 ? (We = 138, S = 3) : he === k ? (We = 6, S = 3) : (We = 7, S = 4);
      }
  }
  function Te(o) {
    var _;
    for ($e(o, o.dyn_ltree, o.l_desc.max_code), $e(o, o.dyn_dtree, o.d_desc.max_code), te(o, o.bl_desc), _ = q - 1; _ >= 3 && o.bl_tree[z[_] * 2 + 1] === 0; _--)
      ;
    return o.opt_len += 3 * (_ + 1) + 5 + 5 + 4, _;
  }
  function Ue(o, _, W, ue) {
    var J;
    for (O(o, _ - 257, 5), O(o, W - 1, 5), O(o, ue - 4, 4), J = 0; J < ue; J++)
      O(o, o.bl_tree[z[J] * 2 + 1], 3);
    Ce(o, o.dyn_ltree, _ - 1), Ce(o, o.dyn_dtree, W - 1);
  }
  function ge(o) {
    var _ = 4093624447, W;
    for (W = 0; W <= 31; W++, _ >>>= 1)
      if (_ & 1 && o.dyn_ltree[W * 2] !== 0)
        return n;
    if (o.dyn_ltree[18] !== 0 || o.dyn_ltree[20] !== 0 || o.dyn_ltree[26] !== 0)
      return s;
    for (W = 32; W < w; W++)
      if (o.dyn_ltree[W * 2] !== 0)
        return s;
    return n;
  }
  var Se = !1;
  function Le(o) {
    Se || (L(), Se = !0), o.l_desc = new X(o.dyn_ltree, j), o.d_desc = new X(o.dyn_dtree, pe), o.bl_desc = new X(o.bl_tree, ee), o.bi_buf = 0, o.bi_valid = 0, H(o);
  }
  function Me(o, _, W, ue) {
    O(o, (f << 1) + (ue ? 1 : 0), 3), Ee(o, _, W);
  }
  function ke(o) {
    O(o, u << 1, 3), B(o, I, D), re(o);
  }
  function He(o, _, W, ue) {
    var J, he, k = 0;
    o.level > 0 ? (o.strm.data_type === r && (o.strm.data_type = ge(o)), te(o, o.l_desc), te(o, o.d_desc), k = Te(o), J = o.opt_len + 3 + 7 >>> 3, he = o.static_len + 3 + 7 >>> 3, he <= J && (J = he)) : J = he = W + 5, W + 4 <= J && _ !== -1 ? Me(o, _, W, ue) : o.strategy === e || he === J ? (O(o, (u << 1) + (ue ? 1 : 0), 3), Oe(o, D, ie)) : (O(o, (h << 1) + (ue ? 1 : 0), 3), Ue(o, o.l_desc.max_code + 1, o.d_desc.max_code + 1, k + 1), Oe(o, o.dyn_ltree, o.dyn_dtree)), H(o), ue && se(o);
  }
  function U(o, _, W) {
    return o.pending_buf[o.d_buf + o.last_lit * 2] = _ >>> 8 & 255, o.pending_buf[o.d_buf + o.last_lit * 2 + 1] = _ & 255, o.pending_buf[o.l_buf + o.last_lit] = W & 255, o.last_lit++, _ === 0 ? o.dyn_ltree[W * 2]++ : (o.matches++, _--, o.dyn_ltree[(we[W] + w + 1) * 2]++, o.dyn_dtree[G(_) * 2]++), o.last_lit === o.lit_bufsize - 1;
  }
  return trees._tr_init = Le, trees._tr_stored_block = Me, trees._tr_flush_block = He, trees._tr_tally = U, trees._tr_align = ke, trees;
}
var adler32_1, hasRequiredAdler32;
function requireAdler32() {
  if (hasRequiredAdler32) return adler32_1;
  hasRequiredAdler32 = 1;
  function t(e, n, s, r) {
    for (var a = e & 65535 | 0, f = e >>> 16 & 65535 | 0, u = 0; s !== 0; ) {
      u = s > 2e3 ? 2e3 : s, s -= u;
      do
        a = a + n[r++] | 0, f = f + a | 0;
      while (--u);
      a %= 65521, f %= 65521;
    }
    return a | f << 16 | 0;
  }
  return adler32_1 = t, adler32_1;
}
var crc32_1, hasRequiredCrc32;
function requireCrc32() {
  if (hasRequiredCrc32) return crc32_1;
  hasRequiredCrc32 = 1;
  function t() {
    for (var s, r = [], a = 0; a < 256; a++) {
      s = a;
      for (var f = 0; f < 8; f++)
        s = s & 1 ? 3988292384 ^ s >>> 1 : s >>> 1;
      r[a] = s;
    }
    return r;
  }
  var e = t();
  function n(s, r, a, f) {
    var u = e, h = f + a;
    s ^= -1;
    for (var g = f; g < h; g++)
      s = s >>> 8 ^ u[(s ^ r[g]) & 255];
    return s ^ -1;
  }
  return crc32_1 = n, crc32_1;
}
var messages, hasRequiredMessages;
function requireMessages() {
  return hasRequiredMessages || (hasRequiredMessages = 1, messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  }), messages;
}
var hasRequiredDeflate;
function requireDeflate() {
  if (hasRequiredDeflate) return deflate;
  hasRequiredDeflate = 1;
  var t = requireCommon(), e = requireTrees(), n = requireAdler32(), s = requireCrc32(), r = requireMessages(), a = 0, f = 1, u = 3, h = 4, g = 5, l = 0, m = 1, w = -2, R = -3, p = -5, q = -1, c = 1, v = 2, P = 3, E = 4, I = 0, A = 2, $ = 8, x = 9, M = 15, V = 8, C = 29, z = 256, y = z + 1 + C, D = 30, ie = 19, de = 2 * y + 1, we = 15, be = 3, ce = 258, fe = ce + be + 1, j = 32, pe = 42, ee = 69, X = 73, G = 91, le = 103, O = 113, B = 666, N = 1, re = 2, ne = 3, F = 4, L = 3;
  function H(S, Ie) {
    return S.msg = r[Ie], Ie;
  }
  function se(S) {
    return (S << 1) - (S > 4 ? 9 : 0);
  }
  function Ee(S) {
    for (var Ie = S.length; --Ie >= 0; )
      S[Ie] = 0;
  }
  function Re(S) {
    var Ie = S.state, Fe = Ie.pending;
    Fe > S.avail_out && (Fe = S.avail_out), Fe !== 0 && (t.arraySet(S.output, Ie.pending_buf, Ie.pending_out, Fe, S.next_out), S.next_out += Fe, Ie.pending_out += Fe, S.total_out += Fe, S.avail_out -= Fe, Ie.pending -= Fe, Ie.pending === 0 && (Ie.pending_out = 0));
  }
  function Pe(S, Ie) {
    e._tr_flush_block(S, S.block_start >= 0 ? S.block_start : -1, S.strstart - S.block_start, Ie), S.block_start = S.strstart, Re(S.strm);
  }
  function Oe(S, Ie) {
    S.pending_buf[S.pending++] = Ie;
  }
  function te(S, Ie) {
    S.pending_buf[S.pending++] = Ie >>> 8 & 255, S.pending_buf[S.pending++] = Ie & 255;
  }
  function $e(S, Ie, Fe, Z) {
    var _e = S.avail_in;
    return _e > Z && (_e = Z), _e === 0 ? 0 : (S.avail_in -= _e, t.arraySet(Ie, S.input, S.next_in, _e, Fe), S.state.wrap === 1 ? S.adler = n(S.adler, Ie, _e, Fe) : S.state.wrap === 2 && (S.adler = s(S.adler, Ie, _e, Fe)), S.next_in += _e, S.total_in += _e, _e);
  }
  function Ce(S, Ie) {
    var Fe = S.max_chain_length, Z = S.strstart, _e, De, Ge = S.prev_length, K = S.nice_match, b = S.strstart > S.w_size - fe ? S.strstart - (S.w_size - fe) : 0, d = S.window, T = S.w_mask, Q = S.prev, ye = S.strstart + ce, qe = d[Z + Ge - 1], ae = d[Z + Ge];
    S.prev_length >= S.good_match && (Fe >>= 2), K > S.lookahead && (K = S.lookahead);
    do
      if (_e = Ie, !(d[_e + Ge] !== ae || d[_e + Ge - 1] !== qe || d[_e] !== d[Z] || d[++_e] !== d[Z + 1])) {
        Z += 2, _e++;
        do
          ;
        while (d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && d[++Z] === d[++_e] && Z < ye);
        if (De = ce - (ye - Z), Z = ye - ce, De > Ge) {
          if (S.match_start = Ie, Ge = De, De >= K)
            break;
          qe = d[Z + Ge - 1], ae = d[Z + Ge];
        }
      }
    while ((Ie = Q[Ie & T]) > b && --Fe !== 0);
    return Ge <= S.lookahead ? Ge : S.lookahead;
  }
  function Te(S) {
    var Ie = S.w_size, Fe, Z, _e, De, Ge;
    do {
      if (De = S.window_size - S.lookahead - S.strstart, S.strstart >= Ie + (Ie - fe)) {
        t.arraySet(S.window, S.window, Ie, Ie, 0), S.match_start -= Ie, S.strstart -= Ie, S.block_start -= Ie, Z = S.hash_size, Fe = Z;
        do
          _e = S.head[--Fe], S.head[Fe] = _e >= Ie ? _e - Ie : 0;
        while (--Z);
        Z = Ie, Fe = Z;
        do
          _e = S.prev[--Fe], S.prev[Fe] = _e >= Ie ? _e - Ie : 0;
        while (--Z);
        De += Ie;
      }
      if (S.strm.avail_in === 0)
        break;
      if (Z = $e(S.strm, S.window, S.strstart + S.lookahead, De), S.lookahead += Z, S.lookahead + S.insert >= be)
        for (Ge = S.strstart - S.insert, S.ins_h = S.window[Ge], S.ins_h = (S.ins_h << S.hash_shift ^ S.window[Ge + 1]) & S.hash_mask; S.insert && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[Ge + be - 1]) & S.hash_mask, S.prev[Ge & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = Ge, Ge++, S.insert--, !(S.lookahead + S.insert < be)); )
          ;
    } while (S.lookahead < fe && S.strm.avail_in !== 0);
  }
  function Ue(S, Ie) {
    var Fe = 65535;
    for (Fe > S.pending_buf_size - 5 && (Fe = S.pending_buf_size - 5); ; ) {
      if (S.lookahead <= 1) {
        if (Te(S), S.lookahead === 0 && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      S.strstart += S.lookahead, S.lookahead = 0;
      var Z = S.block_start + Fe;
      if ((S.strstart === 0 || S.strstart >= Z) && (S.lookahead = S.strstart - Z, S.strstart = Z, Pe(S, !1), S.strm.avail_out === 0) || S.strstart - S.block_start >= S.w_size - fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === h ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : (S.strstart > S.block_start && (Pe(S, !1), S.strm.avail_out === 0), N);
  }
  function ge(S, Ie) {
    for (var Fe, Z; ; ) {
      if (S.lookahead < fe) {
        if (Te(S), S.lookahead < fe && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (Fe = 0, S.lookahead >= be && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart), Fe !== 0 && S.strstart - Fe <= S.w_size - fe && (S.match_length = Ce(S, Fe)), S.match_length >= be)
        if (Z = e._tr_tally(S, S.strstart - S.match_start, S.match_length - be), S.lookahead -= S.match_length, S.match_length <= S.max_lazy_match && S.lookahead >= be) {
          S.match_length--;
          do
            S.strstart++, S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart;
          while (--S.match_length !== 0);
          S.strstart++;
        } else
          S.strstart += S.match_length, S.match_length = 0, S.ins_h = S.window[S.strstart], S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + 1]) & S.hash_mask;
      else
        Z = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++;
      if (Z && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = S.strstart < be - 1 ? S.strstart : be - 1, Ie === h ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function Se(S, Ie) {
    for (var Fe, Z, _e; ; ) {
      if (S.lookahead < fe) {
        if (Te(S), S.lookahead < fe && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (Fe = 0, S.lookahead >= be && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart), S.prev_length = S.match_length, S.prev_match = S.match_start, S.match_length = be - 1, Fe !== 0 && S.prev_length < S.max_lazy_match && S.strstart - Fe <= S.w_size - fe && (S.match_length = Ce(S, Fe), S.match_length <= 5 && (S.strategy === c || S.match_length === be && S.strstart - S.match_start > 4096) && (S.match_length = be - 1)), S.prev_length >= be && S.match_length <= S.prev_length) {
        _e = S.strstart + S.lookahead - be, Z = e._tr_tally(S, S.strstart - 1 - S.prev_match, S.prev_length - be), S.lookahead -= S.prev_length - 1, S.prev_length -= 2;
        do
          ++S.strstart <= _e && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart);
        while (--S.prev_length !== 0);
        if (S.match_available = 0, S.match_length = be - 1, S.strstart++, Z && (Pe(S, !1), S.strm.avail_out === 0))
          return N;
      } else if (S.match_available) {
        if (Z = e._tr_tally(S, 0, S.window[S.strstart - 1]), Z && Pe(S, !1), S.strstart++, S.lookahead--, S.strm.avail_out === 0)
          return N;
      } else
        S.match_available = 1, S.strstart++, S.lookahead--;
    }
    return S.match_available && (Z = e._tr_tally(S, 0, S.window[S.strstart - 1]), S.match_available = 0), S.insert = S.strstart < be - 1 ? S.strstart : be - 1, Ie === h ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function Le(S, Ie) {
    for (var Fe, Z, _e, De, Ge = S.window; ; ) {
      if (S.lookahead <= ce) {
        if (Te(S), S.lookahead <= ce && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (S.match_length = 0, S.lookahead >= be && S.strstart > 0 && (_e = S.strstart - 1, Z = Ge[_e], Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e])) {
        De = S.strstart + ce;
        do
          ;
        while (Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && Z === Ge[++_e] && _e < De);
        S.match_length = ce - (De - _e), S.match_length > S.lookahead && (S.match_length = S.lookahead);
      }
      if (S.match_length >= be ? (Fe = e._tr_tally(S, 1, S.match_length - be), S.lookahead -= S.match_length, S.strstart += S.match_length, S.match_length = 0) : (Fe = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++), Fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === h ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function Me(S, Ie) {
    for (var Fe; ; ) {
      if (S.lookahead === 0 && (Te(S), S.lookahead === 0)) {
        if (Ie === a)
          return N;
        break;
      }
      if (S.match_length = 0, Fe = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++, Fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === h ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function ke(S, Ie, Fe, Z, _e) {
    this.good_length = S, this.max_lazy = Ie, this.nice_length = Fe, this.max_chain = Z, this.func = _e;
  }
  var He;
  He = [
    /*      good lazy nice chain */
    new ke(0, 0, 0, 0, Ue),
    /* 0 store only */
    new ke(4, 4, 8, 4, ge),
    /* 1 max speed, no lazy matches */
    new ke(4, 5, 16, 8, ge),
    /* 2 */
    new ke(4, 6, 32, 32, ge),
    /* 3 */
    new ke(4, 4, 16, 16, Se),
    /* 4 lazy matches */
    new ke(8, 16, 32, 32, Se),
    /* 5 */
    new ke(8, 16, 128, 128, Se),
    /* 6 */
    new ke(8, 32, 128, 256, Se),
    /* 7 */
    new ke(32, 128, 258, 1024, Se),
    /* 8 */
    new ke(32, 258, 258, 4096, Se)
    /* 9 max compression */
  ];
  function U(S) {
    S.window_size = 2 * S.w_size, Ee(S.head), S.max_lazy_match = He[S.level].max_lazy, S.good_match = He[S.level].good_length, S.nice_match = He[S.level].nice_length, S.max_chain_length = He[S.level].max_chain, S.strstart = 0, S.block_start = 0, S.lookahead = 0, S.insert = 0, S.match_length = S.prev_length = be - 1, S.match_available = 0, S.ins_h = 0;
  }
  function o() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = $, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new t.Buf16(de * 2), this.dyn_dtree = new t.Buf16((2 * D + 1) * 2), this.bl_tree = new t.Buf16((2 * ie + 1) * 2), Ee(this.dyn_ltree), Ee(this.dyn_dtree), Ee(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new t.Buf16(we + 1), this.heap = new t.Buf16(2 * y + 1), Ee(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new t.Buf16(2 * y + 1), Ee(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function _(S) {
    var Ie;
    return !S || !S.state ? H(S, w) : (S.total_in = S.total_out = 0, S.data_type = A, Ie = S.state, Ie.pending = 0, Ie.pending_out = 0, Ie.wrap < 0 && (Ie.wrap = -Ie.wrap), Ie.status = Ie.wrap ? pe : O, S.adler = Ie.wrap === 2 ? 0 : 1, Ie.last_flush = a, e._tr_init(Ie), l);
  }
  function W(S) {
    var Ie = _(S);
    return Ie === l && U(S.state), Ie;
  }
  function ue(S, Ie) {
    return !S || !S.state || S.state.wrap !== 2 ? w : (S.state.gzhead = Ie, l);
  }
  function J(S, Ie, Fe, Z, _e, De) {
    if (!S)
      return w;
    var Ge = 1;
    if (Ie === q && (Ie = 6), Z < 0 ? (Ge = 0, Z = -Z) : Z > 15 && (Ge = 2, Z -= 16), _e < 1 || _e > x || Fe !== $ || Z < 8 || Z > 15 || Ie < 0 || Ie > 9 || De < 0 || De > E)
      return H(S, w);
    Z === 8 && (Z = 9);
    var K = new o();
    return S.state = K, K.strm = S, K.wrap = Ge, K.gzhead = null, K.w_bits = Z, K.w_size = 1 << K.w_bits, K.w_mask = K.w_size - 1, K.hash_bits = _e + 7, K.hash_size = 1 << K.hash_bits, K.hash_mask = K.hash_size - 1, K.hash_shift = ~~((K.hash_bits + be - 1) / be), K.window = new t.Buf8(K.w_size * 2), K.head = new t.Buf16(K.hash_size), K.prev = new t.Buf16(K.w_size), K.lit_bufsize = 1 << _e + 6, K.pending_buf_size = K.lit_bufsize * 4, K.pending_buf = new t.Buf8(K.pending_buf_size), K.d_buf = 1 * K.lit_bufsize, K.l_buf = 3 * K.lit_bufsize, K.level = Ie, K.strategy = De, K.method = Fe, W(S);
  }
  function he(S, Ie) {
    return J(S, Ie, $, M, V, I);
  }
  function k(S, Ie) {
    var Fe, Z, _e, De;
    if (!S || !S.state || Ie > g || Ie < 0)
      return S ? H(S, w) : w;
    if (Z = S.state, !S.output || !S.input && S.avail_in !== 0 || Z.status === B && Ie !== h)
      return H(S, S.avail_out === 0 ? p : w);
    if (Z.strm = S, Fe = Z.last_flush, Z.last_flush = Ie, Z.status === pe)
      if (Z.wrap === 2)
        S.adler = 0, Oe(Z, 31), Oe(Z, 139), Oe(Z, 8), Z.gzhead ? (Oe(
          Z,
          (Z.gzhead.text ? 1 : 0) + (Z.gzhead.hcrc ? 2 : 0) + (Z.gzhead.extra ? 4 : 0) + (Z.gzhead.name ? 8 : 0) + (Z.gzhead.comment ? 16 : 0)
        ), Oe(Z, Z.gzhead.time & 255), Oe(Z, Z.gzhead.time >> 8 & 255), Oe(Z, Z.gzhead.time >> 16 & 255), Oe(Z, Z.gzhead.time >> 24 & 255), Oe(Z, Z.level === 9 ? 2 : Z.strategy >= v || Z.level < 2 ? 4 : 0), Oe(Z, Z.gzhead.os & 255), Z.gzhead.extra && Z.gzhead.extra.length && (Oe(Z, Z.gzhead.extra.length & 255), Oe(Z, Z.gzhead.extra.length >> 8 & 255)), Z.gzhead.hcrc && (S.adler = s(S.adler, Z.pending_buf, Z.pending, 0)), Z.gzindex = 0, Z.status = ee) : (Oe(Z, 0), Oe(Z, 0), Oe(Z, 0), Oe(Z, 0), Oe(Z, 0), Oe(Z, Z.level === 9 ? 2 : Z.strategy >= v || Z.level < 2 ? 4 : 0), Oe(Z, L), Z.status = O);
      else {
        var Ge = $ + (Z.w_bits - 8 << 4) << 8, K = -1;
        Z.strategy >= v || Z.level < 2 ? K = 0 : Z.level < 6 ? K = 1 : Z.level === 6 ? K = 2 : K = 3, Ge |= K << 6, Z.strstart !== 0 && (Ge |= j), Ge += 31 - Ge % 31, Z.status = O, te(Z, Ge), Z.strstart !== 0 && (te(Z, S.adler >>> 16), te(Z, S.adler & 65535)), S.adler = 1;
      }
    if (Z.status === ee)
      if (Z.gzhead.extra) {
        for (_e = Z.pending; Z.gzindex < (Z.gzhead.extra.length & 65535) && !(Z.pending === Z.pending_buf_size && (Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), Re(S), _e = Z.pending, Z.pending === Z.pending_buf_size)); )
          Oe(Z, Z.gzhead.extra[Z.gzindex] & 255), Z.gzindex++;
        Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), Z.gzindex === Z.gzhead.extra.length && (Z.gzindex = 0, Z.status = X);
      } else
        Z.status = X;
    if (Z.status === X)
      if (Z.gzhead.name) {
        _e = Z.pending;
        do {
          if (Z.pending === Z.pending_buf_size && (Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), Re(S), _e = Z.pending, Z.pending === Z.pending_buf_size)) {
            De = 1;
            break;
          }
          Z.gzindex < Z.gzhead.name.length ? De = Z.gzhead.name.charCodeAt(Z.gzindex++) & 255 : De = 0, Oe(Z, De);
        } while (De !== 0);
        Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), De === 0 && (Z.gzindex = 0, Z.status = G);
      } else
        Z.status = G;
    if (Z.status === G)
      if (Z.gzhead.comment) {
        _e = Z.pending;
        do {
          if (Z.pending === Z.pending_buf_size && (Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), Re(S), _e = Z.pending, Z.pending === Z.pending_buf_size)) {
            De = 1;
            break;
          }
          Z.gzindex < Z.gzhead.comment.length ? De = Z.gzhead.comment.charCodeAt(Z.gzindex++) & 255 : De = 0, Oe(Z, De);
        } while (De !== 0);
        Z.gzhead.hcrc && Z.pending > _e && (S.adler = s(S.adler, Z.pending_buf, Z.pending - _e, _e)), De === 0 && (Z.status = le);
      } else
        Z.status = le;
    if (Z.status === le && (Z.gzhead.hcrc ? (Z.pending + 2 > Z.pending_buf_size && Re(S), Z.pending + 2 <= Z.pending_buf_size && (Oe(Z, S.adler & 255), Oe(Z, S.adler >> 8 & 255), S.adler = 0, Z.status = O)) : Z.status = O), Z.pending !== 0) {
      if (Re(S), S.avail_out === 0)
        return Z.last_flush = -1, l;
    } else if (S.avail_in === 0 && se(Ie) <= se(Fe) && Ie !== h)
      return H(S, p);
    if (Z.status === B && S.avail_in !== 0)
      return H(S, p);
    if (S.avail_in !== 0 || Z.lookahead !== 0 || Ie !== a && Z.status !== B) {
      var b = Z.strategy === v ? Me(Z, Ie) : Z.strategy === P ? Le(Z, Ie) : He[Z.level].func(Z, Ie);
      if ((b === ne || b === F) && (Z.status = B), b === N || b === ne)
        return S.avail_out === 0 && (Z.last_flush = -1), l;
      if (b === re && (Ie === f ? e._tr_align(Z) : Ie !== g && (e._tr_stored_block(Z, 0, 0, !1), Ie === u && (Ee(Z.head), Z.lookahead === 0 && (Z.strstart = 0, Z.block_start = 0, Z.insert = 0))), Re(S), S.avail_out === 0))
        return Z.last_flush = -1, l;
    }
    return Ie !== h ? l : Z.wrap <= 0 ? m : (Z.wrap === 2 ? (Oe(Z, S.adler & 255), Oe(Z, S.adler >> 8 & 255), Oe(Z, S.adler >> 16 & 255), Oe(Z, S.adler >> 24 & 255), Oe(Z, S.total_in & 255), Oe(Z, S.total_in >> 8 & 255), Oe(Z, S.total_in >> 16 & 255), Oe(Z, S.total_in >> 24 & 255)) : (te(Z, S.adler >>> 16), te(Z, S.adler & 65535)), Re(S), Z.wrap > 0 && (Z.wrap = -Z.wrap), Z.pending !== 0 ? l : m);
  }
  function Be(S) {
    var Ie;
    return !S || !S.state ? w : (Ie = S.state.status, Ie !== pe && Ie !== ee && Ie !== X && Ie !== G && Ie !== le && Ie !== O && Ie !== B ? H(S, w) : (S.state = null, Ie === O ? H(S, R) : l));
  }
  function We(S, Ie) {
    var Fe = Ie.length, Z, _e, De, Ge, K, b, d, T;
    if (!S || !S.state || (Z = S.state, Ge = Z.wrap, Ge === 2 || Ge === 1 && Z.status !== pe || Z.lookahead))
      return w;
    for (Ge === 1 && (S.adler = n(S.adler, Ie, Fe, 0)), Z.wrap = 0, Fe >= Z.w_size && (Ge === 0 && (Ee(Z.head), Z.strstart = 0, Z.block_start = 0, Z.insert = 0), T = new t.Buf8(Z.w_size), t.arraySet(T, Ie, Fe - Z.w_size, Z.w_size, 0), Ie = T, Fe = Z.w_size), K = S.avail_in, b = S.next_in, d = S.input, S.avail_in = Fe, S.next_in = 0, S.input = Ie, Te(Z); Z.lookahead >= be; ) {
      _e = Z.strstart, De = Z.lookahead - (be - 1);
      do
        Z.ins_h = (Z.ins_h << Z.hash_shift ^ Z.window[_e + be - 1]) & Z.hash_mask, Z.prev[_e & Z.w_mask] = Z.head[Z.ins_h], Z.head[Z.ins_h] = _e, _e++;
      while (--De);
      Z.strstart = _e, Z.lookahead = be - 1, Te(Z);
    }
    return Z.strstart += Z.lookahead, Z.block_start = Z.strstart, Z.insert = Z.lookahead, Z.lookahead = 0, Z.match_length = Z.prev_length = be - 1, Z.match_available = 0, S.next_in = b, S.input = d, S.avail_in = K, Z.wrap = Ge, l;
  }
  return deflate.deflateInit = he, deflate.deflateInit2 = J, deflate.deflateReset = W, deflate.deflateResetKeep = _, deflate.deflateSetHeader = ue, deflate.deflate = k, deflate.deflateEnd = Be, deflate.deflateSetDictionary = We, deflate.deflateInfo = "pako deflate (from Nodeca project)", deflate;
}
var inflate = {}, inffast, hasRequiredInffast;
function requireInffast() {
  if (hasRequiredInffast) return inffast;
  hasRequiredInffast = 1;
  var t = 30, e = 12;
  return inffast = function(s, r) {
    var a, f, u, h, g, l, m, w, R, p, q, c, v, P, E, I, A, $, x, M, V, C, z, y, D;
    a = s.state, f = s.next_in, y = s.input, u = f + (s.avail_in - 5), h = s.next_out, D = s.output, g = h - (r - s.avail_out), l = h + (s.avail_out - 257), m = a.dmax, w = a.wsize, R = a.whave, p = a.wnext, q = a.window, c = a.hold, v = a.bits, P = a.lencode, E = a.distcode, I = (1 << a.lenbits) - 1, A = (1 << a.distbits) - 1;
    e:
      do {
        v < 15 && (c += y[f++] << v, v += 8, c += y[f++] << v, v += 8), $ = P[c & I];
        r:
          for (; ; ) {
            if (x = $ >>> 24, c >>>= x, v -= x, x = $ >>> 16 & 255, x === 0)
              D[h++] = $ & 65535;
            else if (x & 16) {
              M = $ & 65535, x &= 15, x && (v < x && (c += y[f++] << v, v += 8), M += c & (1 << x) - 1, c >>>= x, v -= x), v < 15 && (c += y[f++] << v, v += 8, c += y[f++] << v, v += 8), $ = E[c & A];
              t:
                for (; ; ) {
                  if (x = $ >>> 24, c >>>= x, v -= x, x = $ >>> 16 & 255, x & 16) {
                    if (V = $ & 65535, x &= 15, v < x && (c += y[f++] << v, v += 8, v < x && (c += y[f++] << v, v += 8)), V += c & (1 << x) - 1, V > m) {
                      s.msg = "invalid distance too far back", a.mode = t;
                      break e;
                    }
                    if (c >>>= x, v -= x, x = h - g, V > x) {
                      if (x = V - x, x > R && a.sane) {
                        s.msg = "invalid distance too far back", a.mode = t;
                        break e;
                      }
                      if (C = 0, z = q, p === 0) {
                        if (C += w - x, x < M) {
                          M -= x;
                          do
                            D[h++] = q[C++];
                          while (--x);
                          C = h - V, z = D;
                        }
                      } else if (p < x) {
                        if (C += w + p - x, x -= p, x < M) {
                          M -= x;
                          do
                            D[h++] = q[C++];
                          while (--x);
                          if (C = 0, p < M) {
                            x = p, M -= x;
                            do
                              D[h++] = q[C++];
                            while (--x);
                            C = h - V, z = D;
                          }
                        }
                      } else if (C += p - x, x < M) {
                        M -= x;
                        do
                          D[h++] = q[C++];
                        while (--x);
                        C = h - V, z = D;
                      }
                      for (; M > 2; )
                        D[h++] = z[C++], D[h++] = z[C++], D[h++] = z[C++], M -= 3;
                      M && (D[h++] = z[C++], M > 1 && (D[h++] = z[C++]));
                    } else {
                      C = h - V;
                      do
                        D[h++] = D[C++], D[h++] = D[C++], D[h++] = D[C++], M -= 3;
                      while (M > 2);
                      M && (D[h++] = D[C++], M > 1 && (D[h++] = D[C++]));
                    }
                  } else if ((x & 64) === 0) {
                    $ = E[($ & 65535) + (c & (1 << x) - 1)];
                    continue t;
                  } else {
                    s.msg = "invalid distance code", a.mode = t;
                    break e;
                  }
                  break;
                }
            } else if ((x & 64) === 0) {
              $ = P[($ & 65535) + (c & (1 << x) - 1)];
              continue r;
            } else if (x & 32) {
              a.mode = e;
              break e;
            } else {
              s.msg = "invalid literal/length code", a.mode = t;
              break e;
            }
            break;
          }
      } while (f < u && h < l);
    M = v >> 3, f -= M, v -= M << 3, c &= (1 << v) - 1, s.next_in = f, s.next_out = h, s.avail_in = f < u ? 5 + (u - f) : 5 - (f - u), s.avail_out = h < l ? 257 + (l - h) : 257 - (h - l), a.hold = c, a.bits = v;
  }, inffast;
}
var inftrees, hasRequiredInftrees;
function requireInftrees() {
  if (hasRequiredInftrees) return inftrees;
  hasRequiredInftrees = 1;
  var t = requireCommon(), e = 15, n = 852, s = 592, r = 0, a = 1, f = 2, u = [
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ], h = [
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ], g = [
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ], l = [
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  return inftrees = function(w, R, p, q, c, v, P, E) {
    var I = E.bits, A = 0, $ = 0, x = 0, M = 0, V = 0, C = 0, z = 0, y = 0, D = 0, ie = 0, de, we, be, ce, fe, j = null, pe = 0, ee, X = new t.Buf16(e + 1), G = new t.Buf16(e + 1), le = null, O = 0, B, N, re;
    for (A = 0; A <= e; A++)
      X[A] = 0;
    for ($ = 0; $ < q; $++)
      X[R[p + $]]++;
    for (V = I, M = e; M >= 1 && X[M] === 0; M--)
      ;
    if (V > M && (V = M), M === 0)
      return c[v++] = 1 << 24 | 64 << 16 | 0, c[v++] = 1 << 24 | 64 << 16 | 0, E.bits = 1, 0;
    for (x = 1; x < M && X[x] === 0; x++)
      ;
    for (V < x && (V = x), y = 1, A = 1; A <= e; A++)
      if (y <<= 1, y -= X[A], y < 0)
        return -1;
    if (y > 0 && (w === r || M !== 1))
      return -1;
    for (G[1] = 0, A = 1; A < e; A++)
      G[A + 1] = G[A] + X[A];
    for ($ = 0; $ < q; $++)
      R[p + $] !== 0 && (P[G[R[p + $]]++] = $);
    if (w === r ? (j = le = P, ee = 19) : w === a ? (j = u, pe -= 257, le = h, O -= 257, ee = 256) : (j = g, le = l, ee = -1), ie = 0, $ = 0, A = x, fe = v, C = V, z = 0, be = -1, D = 1 << V, ce = D - 1, w === a && D > n || w === f && D > s)
      return 1;
    for (; ; ) {
      B = A - z, P[$] < ee ? (N = 0, re = P[$]) : P[$] > ee ? (N = le[O + P[$]], re = j[pe + P[$]]) : (N = 96, re = 0), de = 1 << A - z, we = 1 << C, x = we;
      do
        we -= de, c[fe + (ie >> z) + we] = B << 24 | N << 16 | re | 0;
      while (we !== 0);
      for (de = 1 << A - 1; ie & de; )
        de >>= 1;
      if (de !== 0 ? (ie &= de - 1, ie += de) : ie = 0, $++, --X[A] === 0) {
        if (A === M)
          break;
        A = R[p + P[$]];
      }
      if (A > V && (ie & ce) !== be) {
        for (z === 0 && (z = V), fe += x, C = A - z, y = 1 << C; C + z < M && (y -= X[C + z], !(y <= 0)); )
          C++, y <<= 1;
        if (D += 1 << C, w === a && D > n || w === f && D > s)
          return 1;
        be = ie & ce, c[be] = V << 24 | C << 16 | fe - v | 0;
      }
    }
    return ie !== 0 && (c[fe + ie] = A - z << 24 | 64 << 16 | 0), E.bits = V, 0;
  }, inftrees;
}
var hasRequiredInflate;
function requireInflate() {
  if (hasRequiredInflate) return inflate;
  hasRequiredInflate = 1;
  var t = requireCommon(), e = requireAdler32(), n = requireCrc32(), s = requireInffast(), r = requireInftrees(), a = 0, f = 1, u = 2, h = 4, g = 5, l = 6, m = 0, w = 1, R = 2, p = -2, q = -3, c = -4, v = -5, P = 8, E = 1, I = 2, A = 3, $ = 4, x = 5, M = 6, V = 7, C = 8, z = 9, y = 10, D = 11, ie = 12, de = 13, we = 14, be = 15, ce = 16, fe = 17, j = 18, pe = 19, ee = 20, X = 21, G = 22, le = 23, O = 24, B = 25, N = 26, re = 27, ne = 28, F = 29, L = 30, H = 31, se = 32, Ee = 852, Re = 592, Pe = 15, Oe = Pe;
  function te(J) {
    return (J >>> 24 & 255) + (J >>> 8 & 65280) + ((J & 65280) << 8) + ((J & 255) << 24);
  }
  function $e() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new t.Buf16(320), this.work = new t.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function Ce(J) {
    var he;
    return !J || !J.state ? p : (he = J.state, J.total_in = J.total_out = he.total = 0, J.msg = "", he.wrap && (J.adler = he.wrap & 1), he.mode = E, he.last = 0, he.havedict = 0, he.dmax = 32768, he.head = null, he.hold = 0, he.bits = 0, he.lencode = he.lendyn = new t.Buf32(Ee), he.distcode = he.distdyn = new t.Buf32(Re), he.sane = 1, he.back = -1, m);
  }
  function Te(J) {
    var he;
    return !J || !J.state ? p : (he = J.state, he.wsize = 0, he.whave = 0, he.wnext = 0, Ce(J));
  }
  function Ue(J, he) {
    var k, Be;
    return !J || !J.state || (Be = J.state, he < 0 ? (k = 0, he = -he) : (k = (he >> 4) + 1, he < 48 && (he &= 15)), he && (he < 8 || he > 15)) ? p : (Be.window !== null && Be.wbits !== he && (Be.window = null), Be.wrap = k, Be.wbits = he, Te(J));
  }
  function ge(J, he) {
    var k, Be;
    return J ? (Be = new $e(), J.state = Be, Be.window = null, k = Ue(J, he), k !== m && (J.state = null), k) : p;
  }
  function Se(J) {
    return ge(J, Oe);
  }
  var Le = !0, Me, ke;
  function He(J) {
    if (Le) {
      var he;
      for (Me = new t.Buf32(512), ke = new t.Buf32(32), he = 0; he < 144; )
        J.lens[he++] = 8;
      for (; he < 256; )
        J.lens[he++] = 9;
      for (; he < 280; )
        J.lens[he++] = 7;
      for (; he < 288; )
        J.lens[he++] = 8;
      for (r(f, J.lens, 0, 288, Me, 0, J.work, { bits: 9 }), he = 0; he < 32; )
        J.lens[he++] = 5;
      r(u, J.lens, 0, 32, ke, 0, J.work, { bits: 5 }), Le = !1;
    }
    J.lencode = Me, J.lenbits = 9, J.distcode = ke, J.distbits = 5;
  }
  function U(J, he, k, Be) {
    var We, S = J.state;
    return S.window === null && (S.wsize = 1 << S.wbits, S.wnext = 0, S.whave = 0, S.window = new t.Buf8(S.wsize)), Be >= S.wsize ? (t.arraySet(S.window, he, k - S.wsize, S.wsize, 0), S.wnext = 0, S.whave = S.wsize) : (We = S.wsize - S.wnext, We > Be && (We = Be), t.arraySet(S.window, he, k - Be, We, S.wnext), Be -= We, Be ? (t.arraySet(S.window, he, k - Be, Be, 0), S.wnext = Be, S.whave = S.wsize) : (S.wnext += We, S.wnext === S.wsize && (S.wnext = 0), S.whave < S.wsize && (S.whave += We))), 0;
  }
  function o(J, he) {
    var k, Be, We, S, Ie, Fe, Z, _e, De, Ge, K, b, d, T, Q = 0, ye, qe, ae, oe, me, xe, Ae, je, Ve = new t.Buf8(4), Ye, Qe, nr = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!J || !J.state || !J.output || !J.input && J.avail_in !== 0)
      return p;
    k = J.state, k.mode === ie && (k.mode = de), Ie = J.next_out, We = J.output, Z = J.avail_out, S = J.next_in, Be = J.input, Fe = J.avail_in, _e = k.hold, De = k.bits, Ge = Fe, K = Z, je = m;
    e:
      for (; ; )
        switch (k.mode) {
          case E:
            if (k.wrap === 0) {
              k.mode = de;
              break;
            }
            for (; De < 16; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if (k.wrap & 2 && _e === 35615) {
              k.check = 0, Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, k.check = n(k.check, Ve, 2, 0), _e = 0, De = 0, k.mode = I;
              break;
            }
            if (k.flags = 0, k.head && (k.head.done = !1), !(k.wrap & 1) || /* check if zlib header allowed */
            (((_e & 255) << 8) + (_e >> 8)) % 31) {
              J.msg = "incorrect header check", k.mode = L;
              break;
            }
            if ((_e & 15) !== P) {
              J.msg = "unknown compression method", k.mode = L;
              break;
            }
            if (_e >>>= 4, De -= 4, Ae = (_e & 15) + 8, k.wbits === 0)
              k.wbits = Ae;
            else if (Ae > k.wbits) {
              J.msg = "invalid window size", k.mode = L;
              break;
            }
            k.dmax = 1 << Ae, J.adler = k.check = 1, k.mode = _e & 512 ? y : ie, _e = 0, De = 0;
            break;
          case I:
            for (; De < 16; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if (k.flags = _e, (k.flags & 255) !== P) {
              J.msg = "unknown compression method", k.mode = L;
              break;
            }
            if (k.flags & 57344) {
              J.msg = "unknown header flags set", k.mode = L;
              break;
            }
            k.head && (k.head.text = _e >> 8 & 1), k.flags & 512 && (Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, k.check = n(k.check, Ve, 2, 0)), _e = 0, De = 0, k.mode = A;
          /* falls through */
          case A:
            for (; De < 32; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            k.head && (k.head.time = _e), k.flags & 512 && (Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, Ve[2] = _e >>> 16 & 255, Ve[3] = _e >>> 24 & 255, k.check = n(k.check, Ve, 4, 0)), _e = 0, De = 0, k.mode = $;
          /* falls through */
          case $:
            for (; De < 16; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            k.head && (k.head.xflags = _e & 255, k.head.os = _e >> 8), k.flags & 512 && (Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, k.check = n(k.check, Ve, 2, 0)), _e = 0, De = 0, k.mode = x;
          /* falls through */
          case x:
            if (k.flags & 1024) {
              for (; De < 16; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              k.length = _e, k.head && (k.head.extra_len = _e), k.flags & 512 && (Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, k.check = n(k.check, Ve, 2, 0)), _e = 0, De = 0;
            } else k.head && (k.head.extra = null);
            k.mode = M;
          /* falls through */
          case M:
            if (k.flags & 1024 && (b = k.length, b > Fe && (b = Fe), b && (k.head && (Ae = k.head.extra_len - k.length, k.head.extra || (k.head.extra = new Array(k.head.extra_len)), t.arraySet(
              k.head.extra,
              Be,
              S,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              b,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Ae
            )), k.flags & 512 && (k.check = n(k.check, Be, b, S)), Fe -= b, S += b, k.length -= b), k.length))
              break e;
            k.length = 0, k.mode = V;
          /* falls through */
          case V:
            if (k.flags & 2048) {
              if (Fe === 0)
                break e;
              b = 0;
              do
                Ae = Be[S + b++], k.head && Ae && k.length < 65536 && (k.head.name += String.fromCharCode(Ae));
              while (Ae && b < Fe);
              if (k.flags & 512 && (k.check = n(k.check, Be, b, S)), Fe -= b, S += b, Ae)
                break e;
            } else k.head && (k.head.name = null);
            k.length = 0, k.mode = C;
          /* falls through */
          case C:
            if (k.flags & 4096) {
              if (Fe === 0)
                break e;
              b = 0;
              do
                Ae = Be[S + b++], k.head && Ae && k.length < 65536 && (k.head.comment += String.fromCharCode(Ae));
              while (Ae && b < Fe);
              if (k.flags & 512 && (k.check = n(k.check, Be, b, S)), Fe -= b, S += b, Ae)
                break e;
            } else k.head && (k.head.comment = null);
            k.mode = z;
          /* falls through */
          case z:
            if (k.flags & 512) {
              for (; De < 16; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              if (_e !== (k.check & 65535)) {
                J.msg = "header crc mismatch", k.mode = L;
                break;
              }
              _e = 0, De = 0;
            }
            k.head && (k.head.hcrc = k.flags >> 9 & 1, k.head.done = !0), J.adler = k.check = 0, k.mode = ie;
            break;
          case y:
            for (; De < 32; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            J.adler = k.check = te(_e), _e = 0, De = 0, k.mode = D;
          /* falls through */
          case D:
            if (k.havedict === 0)
              return J.next_out = Ie, J.avail_out = Z, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, R;
            J.adler = k.check = 1, k.mode = ie;
          /* falls through */
          case ie:
            if (he === g || he === l)
              break e;
          /* falls through */
          case de:
            if (k.last) {
              _e >>>= De & 7, De -= De & 7, k.mode = re;
              break;
            }
            for (; De < 3; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            switch (k.last = _e & 1, _e >>>= 1, De -= 1, _e & 3) {
              case 0:
                k.mode = we;
                break;
              case 1:
                if (He(k), k.mode = ee, he === l) {
                  _e >>>= 2, De -= 2;
                  break e;
                }
                break;
              case 2:
                k.mode = fe;
                break;
              case 3:
                J.msg = "invalid block type", k.mode = L;
            }
            _e >>>= 2, De -= 2;
            break;
          case we:
            for (_e >>>= De & 7, De -= De & 7; De < 32; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if ((_e & 65535) !== (_e >>> 16 ^ 65535)) {
              J.msg = "invalid stored block lengths", k.mode = L;
              break;
            }
            if (k.length = _e & 65535, _e = 0, De = 0, k.mode = be, he === l)
              break e;
          /* falls through */
          case be:
            k.mode = ce;
          /* falls through */
          case ce:
            if (b = k.length, b) {
              if (b > Fe && (b = Fe), b > Z && (b = Z), b === 0)
                break e;
              t.arraySet(We, Be, S, b, Ie), Fe -= b, S += b, Z -= b, Ie += b, k.length -= b;
              break;
            }
            k.mode = ie;
            break;
          case fe:
            for (; De < 14; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if (k.nlen = (_e & 31) + 257, _e >>>= 5, De -= 5, k.ndist = (_e & 31) + 1, _e >>>= 5, De -= 5, k.ncode = (_e & 15) + 4, _e >>>= 4, De -= 4, k.nlen > 286 || k.ndist > 30) {
              J.msg = "too many length or distance symbols", k.mode = L;
              break;
            }
            k.have = 0, k.mode = j;
          /* falls through */
          case j:
            for (; k.have < k.ncode; ) {
              for (; De < 3; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              k.lens[nr[k.have++]] = _e & 7, _e >>>= 3, De -= 3;
            }
            for (; k.have < 19; )
              k.lens[nr[k.have++]] = 0;
            if (k.lencode = k.lendyn, k.lenbits = 7, Ye = { bits: k.lenbits }, je = r(a, k.lens, 0, 19, k.lencode, 0, k.work, Ye), k.lenbits = Ye.bits, je) {
              J.msg = "invalid code lengths set", k.mode = L;
              break;
            }
            k.have = 0, k.mode = pe;
          /* falls through */
          case pe:
            for (; k.have < k.nlen + k.ndist; ) {
              for (; Q = k.lencode[_e & (1 << k.lenbits) - 1], ye = Q >>> 24, qe = Q >>> 16 & 255, ae = Q & 65535, !(ye <= De); ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              if (ae < 16)
                _e >>>= ye, De -= ye, k.lens[k.have++] = ae;
              else {
                if (ae === 16) {
                  for (Qe = ye + 2; De < Qe; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  if (_e >>>= ye, De -= ye, k.have === 0) {
                    J.msg = "invalid bit length repeat", k.mode = L;
                    break;
                  }
                  Ae = k.lens[k.have - 1], b = 3 + (_e & 3), _e >>>= 2, De -= 2;
                } else if (ae === 17) {
                  for (Qe = ye + 3; De < Qe; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  _e >>>= ye, De -= ye, Ae = 0, b = 3 + (_e & 7), _e >>>= 3, De -= 3;
                } else {
                  for (Qe = ye + 7; De < Qe; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  _e >>>= ye, De -= ye, Ae = 0, b = 11 + (_e & 127), _e >>>= 7, De -= 7;
                }
                if (k.have + b > k.nlen + k.ndist) {
                  J.msg = "invalid bit length repeat", k.mode = L;
                  break;
                }
                for (; b--; )
                  k.lens[k.have++] = Ae;
              }
            }
            if (k.mode === L)
              break;
            if (k.lens[256] === 0) {
              J.msg = "invalid code -- missing end-of-block", k.mode = L;
              break;
            }
            if (k.lenbits = 9, Ye = { bits: k.lenbits }, je = r(f, k.lens, 0, k.nlen, k.lencode, 0, k.work, Ye), k.lenbits = Ye.bits, je) {
              J.msg = "invalid literal/lengths set", k.mode = L;
              break;
            }
            if (k.distbits = 6, k.distcode = k.distdyn, Ye = { bits: k.distbits }, je = r(u, k.lens, k.nlen, k.ndist, k.distcode, 0, k.work, Ye), k.distbits = Ye.bits, je) {
              J.msg = "invalid distances set", k.mode = L;
              break;
            }
            if (k.mode = ee, he === l)
              break e;
          /* falls through */
          case ee:
            k.mode = X;
          /* falls through */
          case X:
            if (Fe >= 6 && Z >= 258) {
              J.next_out = Ie, J.avail_out = Z, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, s(J, K), Ie = J.next_out, We = J.output, Z = J.avail_out, S = J.next_in, Be = J.input, Fe = J.avail_in, _e = k.hold, De = k.bits, k.mode === ie && (k.back = -1);
              break;
            }
            for (k.back = 0; Q = k.lencode[_e & (1 << k.lenbits) - 1], ye = Q >>> 24, qe = Q >>> 16 & 255, ae = Q & 65535, !(ye <= De); ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if (qe && (qe & 240) === 0) {
              for (oe = ye, me = qe, xe = ae; Q = k.lencode[xe + ((_e & (1 << oe + me) - 1) >> oe)], ye = Q >>> 24, qe = Q >>> 16 & 255, ae = Q & 65535, !(oe + ye <= De); ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              _e >>>= oe, De -= oe, k.back += oe;
            }
            if (_e >>>= ye, De -= ye, k.back += ye, k.length = ae, qe === 0) {
              k.mode = N;
              break;
            }
            if (qe & 32) {
              k.back = -1, k.mode = ie;
              break;
            }
            if (qe & 64) {
              J.msg = "invalid literal/length code", k.mode = L;
              break;
            }
            k.extra = qe & 15, k.mode = G;
          /* falls through */
          case G:
            if (k.extra) {
              for (Qe = k.extra; De < Qe; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              k.length += _e & (1 << k.extra) - 1, _e >>>= k.extra, De -= k.extra, k.back += k.extra;
            }
            k.was = k.length, k.mode = le;
          /* falls through */
          case le:
            for (; Q = k.distcode[_e & (1 << k.distbits) - 1], ye = Q >>> 24, qe = Q >>> 16 & 255, ae = Q & 65535, !(ye <= De); ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if ((qe & 240) === 0) {
              for (oe = ye, me = qe, xe = ae; Q = k.distcode[xe + ((_e & (1 << oe + me) - 1) >> oe)], ye = Q >>> 24, qe = Q >>> 16 & 255, ae = Q & 65535, !(oe + ye <= De); ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              _e >>>= oe, De -= oe, k.back += oe;
            }
            if (_e >>>= ye, De -= ye, k.back += ye, qe & 64) {
              J.msg = "invalid distance code", k.mode = L;
              break;
            }
            k.offset = ae, k.extra = qe & 15, k.mode = O;
          /* falls through */
          case O:
            if (k.extra) {
              for (Qe = k.extra; De < Qe; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              k.offset += _e & (1 << k.extra) - 1, _e >>>= k.extra, De -= k.extra, k.back += k.extra;
            }
            if (k.offset > k.dmax) {
              J.msg = "invalid distance too far back", k.mode = L;
              break;
            }
            k.mode = B;
          /* falls through */
          case B:
            if (Z === 0)
              break e;
            if (b = K - Z, k.offset > b) {
              if (b = k.offset - b, b > k.whave && k.sane) {
                J.msg = "invalid distance too far back", k.mode = L;
                break;
              }
              b > k.wnext ? (b -= k.wnext, d = k.wsize - b) : d = k.wnext - b, b > k.length && (b = k.length), T = k.window;
            } else
              T = We, d = Ie - k.offset, b = k.length;
            b > Z && (b = Z), Z -= b, k.length -= b;
            do
              We[Ie++] = T[d++];
            while (--b);
            k.length === 0 && (k.mode = X);
            break;
          case N:
            if (Z === 0)
              break e;
            We[Ie++] = k.length, Z--, k.mode = X;
            break;
          case re:
            if (k.wrap) {
              for (; De < 32; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e |= Be[S++] << De, De += 8;
              }
              if (K -= Z, J.total_out += K, k.total += K, K && (J.adler = k.check = /*UPDATE(state.check, put - _out, _out);*/
              k.flags ? n(k.check, We, K, Ie - K) : e(k.check, We, K, Ie - K)), K = Z, (k.flags ? _e : te(_e)) !== k.check) {
                J.msg = "incorrect data check", k.mode = L;
                break;
              }
              _e = 0, De = 0;
            }
            k.mode = ne;
          /* falls through */
          case ne:
            if (k.wrap && k.flags) {
              for (; De < 32; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              if (_e !== (k.total & 4294967295)) {
                J.msg = "incorrect length check", k.mode = L;
                break;
              }
              _e = 0, De = 0;
            }
            k.mode = F;
          /* falls through */
          case F:
            je = w;
            break e;
          case L:
            je = q;
            break e;
          case H:
            return c;
          case se:
          /* falls through */
          default:
            return p;
        }
    return J.next_out = Ie, J.avail_out = Z, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, (k.wsize || K !== J.avail_out && k.mode < L && (k.mode < re || he !== h)) && U(J, J.output, J.next_out, K - J.avail_out), Ge -= J.avail_in, K -= J.avail_out, J.total_in += Ge, J.total_out += K, k.total += K, k.wrap && K && (J.adler = k.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    k.flags ? n(k.check, We, K, J.next_out - K) : e(k.check, We, K, J.next_out - K)), J.data_type = k.bits + (k.last ? 64 : 0) + (k.mode === ie ? 128 : 0) + (k.mode === ee || k.mode === be ? 256 : 0), (Ge === 0 && K === 0 || he === h) && je === m && (je = v), je;
  }
  function _(J) {
    if (!J || !J.state)
      return p;
    var he = J.state;
    return he.window && (he.window = null), J.state = null, m;
  }
  function W(J, he) {
    var k;
    return !J || !J.state || (k = J.state, (k.wrap & 2) === 0) ? p : (k.head = he, he.done = !1, m);
  }
  function ue(J, he) {
    var k = he.length, Be, We, S;
    return !J || !J.state || (Be = J.state, Be.wrap !== 0 && Be.mode !== D) ? p : Be.mode === D && (We = 1, We = e(We, he, k, 0), We !== Be.check) ? q : (S = U(J, he, k, k), S ? (Be.mode = H, c) : (Be.havedict = 1, m));
  }
  return inflate.inflateReset = Te, inflate.inflateReset2 = Ue, inflate.inflateResetKeep = Ce, inflate.inflateInit = Se, inflate.inflateInit2 = ge, inflate.inflate = o, inflate.inflateEnd = _, inflate.inflateGetHeader = W, inflate.inflateSetDictionary = ue, inflate.inflateInfo = "pako inflate (from Nodeca project)", inflate;
}
var constants, hasRequiredConstants;
function requireConstants() {
  return hasRequiredConstants || (hasRequiredConstants = 1, constants = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    //Z_MEM_ERROR:     -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  }), constants;
}
var hasRequiredBinding;
function requireBinding() {
  return hasRequiredBinding || (hasRequiredBinding = 1, (function(t) {
    var e = requireAssert(), n = requireZstream(), s = requireDeflate(), r = requireInflate(), a = requireConstants();
    for (var f in a)
      t[f] = a[f];
    t.NONE = 0, t.DEFLATE = 1, t.INFLATE = 2, t.GZIP = 3, t.GUNZIP = 4, t.DEFLATERAW = 5, t.INFLATERAW = 6, t.UNZIP = 7;
    var u = 31, h = 139;
    function g(l) {
      if (typeof l != "number" || l < t.DEFLATE || l > t.UNZIP)
        throw new TypeError("Bad argument");
      this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = l, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0;
    }
    g.prototype.close = function() {
      if (this.write_in_progress) {
        this.pending_close = !0;
        return;
      }
      this.pending_close = !1, e(this.init_done, "close before init"), e(this.mode <= t.UNZIP), this.mode === t.DEFLATE || this.mode === t.GZIP || this.mode === t.DEFLATERAW ? s.deflateEnd(this.strm) : (this.mode === t.INFLATE || this.mode === t.GUNZIP || this.mode === t.INFLATERAW || this.mode === t.UNZIP) && r.inflateEnd(this.strm), this.mode = t.NONE, this.dictionary = null;
    }, g.prototype.write = function(l, m, w, R, p, q, c) {
      return this._write(!0, l, m, w, R, p, q, c);
    }, g.prototype.writeSync = function(l, m, w, R, p, q, c) {
      return this._write(!1, l, m, w, R, p, q, c);
    }, g.prototype._write = function(l, m, w, R, p, q, c, v) {
      if (e.equal(arguments.length, 8), e(this.init_done, "write before init"), e(this.mode !== t.NONE, "already finalized"), e.equal(!1, this.write_in_progress, "write already in progress"), e.equal(!1, this.pending_close, "close is pending"), this.write_in_progress = !0, e.equal(!1, m === void 0, "must provide flush value"), this.write_in_progress = !0, m !== t.Z_NO_FLUSH && m !== t.Z_PARTIAL_FLUSH && m !== t.Z_SYNC_FLUSH && m !== t.Z_FULL_FLUSH && m !== t.Z_FINISH && m !== t.Z_BLOCK)
        throw new Error("Invalid flush value");
      if (w == null && (w = Buffer.alloc(0), p = 0, R = 0), this.strm.avail_in = p, this.strm.input = w, this.strm.next_in = R, this.strm.avail_out = v, this.strm.output = q, this.strm.next_out = c, this.flush = m, !l)
        return this._process(), this._checkError() ? this._afterSync() : void 0;
      var P = this;
      return process$1.nextTick(function() {
        P._process(), P._after();
      }), this;
    }, g.prototype._afterSync = function() {
      var l = this.strm.avail_out, m = this.strm.avail_in;
      return this.write_in_progress = !1, [m, l];
    }, g.prototype._process = function() {
      var l = null;
      switch (this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = s.deflate(this.strm, this.flush);
          break;
        case t.UNZIP:
          switch (this.strm.avail_in > 0 && (l = this.strm.next_in), this.gzip_id_bytes_read) {
            case 0:
              if (l === null)
                break;
              if (this.strm.input[l] === u) {
                if (this.gzip_id_bytes_read = 1, l++, this.strm.avail_in === 1)
                  break;
              } else {
                this.mode = t.INFLATE;
                break;
              }
            // fallthrough
            case 1:
              if (l === null)
                break;
              this.strm.input[l] === h ? (this.gzip_id_bytes_read = 2, this.mode = t.GUNZIP) : this.mode = t.INFLATE;
              break;
            default:
              throw new Error("invalid number of gzip magic number bytes read");
          }
        // fallthrough
        case t.INFLATE:
        case t.GUNZIP:
        case t.INFLATERAW:
          for (this.err = r.inflate(
            this.strm,
            this.flush
            // If data was encoded with dictionary
          ), this.err === t.Z_NEED_DICT && this.dictionary && (this.err = r.inflateSetDictionary(this.strm, this.dictionary), this.err === t.Z_OK ? this.err = r.inflate(this.strm, this.flush) : this.err === t.Z_DATA_ERROR && (this.err = t.Z_NEED_DICT)); this.strm.avail_in > 0 && this.mode === t.GUNZIP && this.err === t.Z_STREAM_END && this.strm.next_in[0] !== 0; )
            this.reset(), this.err = r.inflate(this.strm, this.flush);
          break;
        default:
          throw new Error("Unknown mode " + this.mode);
      }
    }, g.prototype._checkError = function() {
      switch (this.err) {
        case t.Z_OK:
        case t.Z_BUF_ERROR:
          if (this.strm.avail_out !== 0 && this.flush === t.Z_FINISH)
            return this._error("unexpected end of file"), !1;
          break;
        case t.Z_STREAM_END:
          break;
        case t.Z_NEED_DICT:
          return this.dictionary == null ? this._error("Missing dictionary") : this._error("Bad dictionary"), !1;
        default:
          return this._error("Zlib error"), !1;
      }
      return !0;
    }, g.prototype._after = function() {
      if (this._checkError()) {
        var l = this.strm.avail_out, m = this.strm.avail_in;
        this.write_in_progress = !1, this.callback(m, l), this.pending_close && this.close();
      }
    }, g.prototype._error = function(l) {
      this.strm.msg && (l = this.strm.msg), this.onerror(
        l,
        this.err
        // no hope of rescue.
      ), this.write_in_progress = !1, this.pending_close && this.close();
    }, g.prototype.init = function(l, m, w, R, p) {
      e(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])"), e(l >= 8 && l <= 15, "invalid windowBits"), e(m >= -1 && m <= 9, "invalid compression level"), e(w >= 1 && w <= 9, "invalid memlevel"), e(R === t.Z_FILTERED || R === t.Z_HUFFMAN_ONLY || R === t.Z_RLE || R === t.Z_FIXED || R === t.Z_DEFAULT_STRATEGY, "invalid strategy"), this._init(m, l, w, R, p), this._setDictionary();
    }, g.prototype.params = function() {
      throw new Error("deflateParams Not supported");
    }, g.prototype.reset = function() {
      this._reset(), this._setDictionary();
    }, g.prototype._init = function(l, m, w, R, p) {
      switch (this.level = l, this.windowBits = m, this.memLevel = w, this.strategy = R, this.flush = t.Z_NO_FLUSH, this.err = t.Z_OK, (this.mode === t.GZIP || this.mode === t.GUNZIP) && (this.windowBits += 16), this.mode === t.UNZIP && (this.windowBits += 32), (this.mode === t.DEFLATERAW || this.mode === t.INFLATERAW) && (this.windowBits = -1 * this.windowBits), this.strm = new n(), this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = s.deflateInit2(this.strm, this.level, t.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
          break;
        case t.INFLATE:
        case t.GUNZIP:
        case t.INFLATERAW:
        case t.UNZIP:
          this.err = r.inflateInit2(this.strm, this.windowBits);
          break;
        default:
          throw new Error("Unknown mode " + this.mode);
      }
      this.err !== t.Z_OK && this._error("Init error"), this.dictionary = p, this.write_in_progress = !1, this.init_done = !0;
    }, g.prototype._setDictionary = function() {
      if (this.dictionary != null) {
        switch (this.err = t.Z_OK, this.mode) {
          case t.DEFLATE:
          case t.DEFLATERAW:
            this.err = s.deflateSetDictionary(this.strm, this.dictionary);
            break;
        }
        this.err !== t.Z_OK && this._error("Failed to set dictionary");
      }
    }, g.prototype._reset = function() {
      switch (this.err = t.Z_OK, this.mode) {
        case t.DEFLATE:
        case t.DEFLATERAW:
        case t.GZIP:
          this.err = s.deflateReset(this.strm);
          break;
        case t.INFLATE:
        case t.INFLATERAW:
        case t.GUNZIP:
          this.err = r.inflateReset(this.strm);
          break;
      }
      this.err !== t.Z_OK && this._error("Failed to reset stream");
    }, t.Zlib = g;
  })(binding)), binding;
}
var hasRequiredLib;
function requireLib() {
  return hasRequiredLib || (hasRequiredLib = 1, (function(t) {
    var e = requireDist().Buffer, n = requireStreamBrowserify().Transform, s = requireBinding(), r = requireUtil$2(), a = requireAssert().ok, f = requireDist().kMaxLength, u = "Cannot create final Buffer. It would be larger than 0x" + f.toString(16) + " bytes";
    s.Z_MIN_WINDOWBITS = 8, s.Z_MAX_WINDOWBITS = 15, s.Z_DEFAULT_WINDOWBITS = 15, s.Z_MIN_CHUNK = 64, s.Z_MAX_CHUNK = 1 / 0, s.Z_DEFAULT_CHUNK = 16 * 1024, s.Z_MIN_MEMLEVEL = 1, s.Z_MAX_MEMLEVEL = 9, s.Z_DEFAULT_MEMLEVEL = 8, s.Z_MIN_LEVEL = -1, s.Z_MAX_LEVEL = 9, s.Z_DEFAULT_LEVEL = s.Z_DEFAULT_COMPRESSION;
    for (var h = Object.keys(s), g = 0; g < h.length; g++) {
      var l = h[g];
      l.match(/^Z/) && Object.defineProperty(t, l, {
        enumerable: !0,
        value: s[l],
        writable: !1
      });
    }
    for (var m = {
      Z_OK: s.Z_OK,
      Z_STREAM_END: s.Z_STREAM_END,
      Z_NEED_DICT: s.Z_NEED_DICT,
      Z_ERRNO: s.Z_ERRNO,
      Z_STREAM_ERROR: s.Z_STREAM_ERROR,
      Z_DATA_ERROR: s.Z_DATA_ERROR,
      Z_MEM_ERROR: s.Z_MEM_ERROR,
      Z_BUF_ERROR: s.Z_BUF_ERROR,
      Z_VERSION_ERROR: s.Z_VERSION_ERROR
    }, w = Object.keys(m), R = 0; R < w.length; R++) {
      var p = w[R];
      m[m[p]] = p;
    }
    Object.defineProperty(t, "codes", {
      enumerable: !0,
      value: Object.freeze(m),
      writable: !1
    }), t.Deflate = v, t.Inflate = P, t.Gzip = E, t.Gunzip = I, t.DeflateRaw = A, t.InflateRaw = $, t.Unzip = x, t.createDeflate = function(y) {
      return new v(y);
    }, t.createInflate = function(y) {
      return new P(y);
    }, t.createDeflateRaw = function(y) {
      return new A(y);
    }, t.createInflateRaw = function(y) {
      return new $(y);
    }, t.createGzip = function(y) {
      return new E(y);
    }, t.createGunzip = function(y) {
      return new I(y);
    }, t.createUnzip = function(y) {
      return new x(y);
    }, t.deflate = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new v(D), y, ie);
    }, t.deflateSync = function(y, D) {
      return c(new v(D), y);
    }, t.gzip = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new E(D), y, ie);
    }, t.gzipSync = function(y, D) {
      return c(new E(D), y);
    }, t.deflateRaw = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new A(D), y, ie);
    }, t.deflateRawSync = function(y, D) {
      return c(new A(D), y);
    }, t.unzip = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new x(D), y, ie);
    }, t.unzipSync = function(y, D) {
      return c(new x(D), y);
    }, t.inflate = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new P(D), y, ie);
    }, t.inflateSync = function(y, D) {
      return c(new P(D), y);
    }, t.gunzip = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new I(D), y, ie);
    }, t.gunzipSync = function(y, D) {
      return c(new I(D), y);
    }, t.inflateRaw = function(y, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new $(D), y, ie);
    }, t.inflateRawSync = function(y, D) {
      return c(new $(D), y);
    };
    function q(y, D, ie) {
      var de = [], we = 0;
      y.on("error", ce), y.on("end", fe), y.end(D), be();
      function be() {
        for (var j; (j = y.read()) !== null; )
          de.push(j), we += j.length;
        y.once("readable", be);
      }
      function ce(j) {
        y.removeListener("end", fe), y.removeListener("readable", be), ie(j);
      }
      function fe() {
        var j, pe = null;
        we >= f ? pe = new RangeError(u) : j = e.concat(de, we), de = [], y.close(), ie(pe, j);
      }
    }
    function c(y, D) {
      if (typeof D == "string" && (D = e.from(D)), !e.isBuffer(D)) throw new TypeError("Not a string or buffer");
      var ie = y._finishFlushFlag;
      return y._processChunk(D, ie);
    }
    function v(y) {
      if (!(this instanceof v)) return new v(y);
      V.call(this, y, s.DEFLATE);
    }
    function P(y) {
      if (!(this instanceof P)) return new P(y);
      V.call(this, y, s.INFLATE);
    }
    function E(y) {
      if (!(this instanceof E)) return new E(y);
      V.call(this, y, s.GZIP);
    }
    function I(y) {
      if (!(this instanceof I)) return new I(y);
      V.call(this, y, s.GUNZIP);
    }
    function A(y) {
      if (!(this instanceof A)) return new A(y);
      V.call(this, y, s.DEFLATERAW);
    }
    function $(y) {
      if (!(this instanceof $)) return new $(y);
      V.call(this, y, s.INFLATERAW);
    }
    function x(y) {
      if (!(this instanceof x)) return new x(y);
      V.call(this, y, s.UNZIP);
    }
    function M(y) {
      return y === s.Z_NO_FLUSH || y === s.Z_PARTIAL_FLUSH || y === s.Z_SYNC_FLUSH || y === s.Z_FULL_FLUSH || y === s.Z_FINISH || y === s.Z_BLOCK;
    }
    function V(y, D) {
      var ie = this;
      if (this._opts = y = y || {}, this._chunkSize = y.chunkSize || t.Z_DEFAULT_CHUNK, n.call(this, y), y.flush && !M(y.flush))
        throw new Error("Invalid flush flag: " + y.flush);
      if (y.finishFlush && !M(y.finishFlush))
        throw new Error("Invalid flush flag: " + y.finishFlush);
      if (this._flushFlag = y.flush || s.Z_NO_FLUSH, this._finishFlushFlag = typeof y.finishFlush < "u" ? y.finishFlush : s.Z_FINISH, y.chunkSize && (y.chunkSize < t.Z_MIN_CHUNK || y.chunkSize > t.Z_MAX_CHUNK))
        throw new Error("Invalid chunk size: " + y.chunkSize);
      if (y.windowBits && (y.windowBits < t.Z_MIN_WINDOWBITS || y.windowBits > t.Z_MAX_WINDOWBITS))
        throw new Error("Invalid windowBits: " + y.windowBits);
      if (y.level && (y.level < t.Z_MIN_LEVEL || y.level > t.Z_MAX_LEVEL))
        throw new Error("Invalid compression level: " + y.level);
      if (y.memLevel && (y.memLevel < t.Z_MIN_MEMLEVEL || y.memLevel > t.Z_MAX_MEMLEVEL))
        throw new Error("Invalid memLevel: " + y.memLevel);
      if (y.strategy && y.strategy != t.Z_FILTERED && y.strategy != t.Z_HUFFMAN_ONLY && y.strategy != t.Z_RLE && y.strategy != t.Z_FIXED && y.strategy != t.Z_DEFAULT_STRATEGY)
        throw new Error("Invalid strategy: " + y.strategy);
      if (y.dictionary && !e.isBuffer(y.dictionary))
        throw new Error("Invalid dictionary: it should be a Buffer instance");
      this._handle = new s.Zlib(D);
      var de = this;
      this._hadError = !1, this._handle.onerror = function(ce, fe) {
        C(de), de._hadError = !0;
        var j = new Error(ce);
        j.errno = fe, j.code = t.codes[fe], de.emit("error", j);
      };
      var we = t.Z_DEFAULT_COMPRESSION;
      typeof y.level == "number" && (we = y.level);
      var be = t.Z_DEFAULT_STRATEGY;
      typeof y.strategy == "number" && (be = y.strategy), this._handle.init(y.windowBits || t.Z_DEFAULT_WINDOWBITS, we, y.memLevel || t.Z_DEFAULT_MEMLEVEL, be, y.dictionary), this._buffer = e.allocUnsafe(this._chunkSize), this._offset = 0, this._level = we, this._strategy = be, this.once("end", this.close), Object.defineProperty(this, "_closed", {
        get: function() {
          return !ie._handle;
        },
        configurable: !0,
        enumerable: !0
      });
    }
    r.inherits(V, n), V.prototype.params = function(y, D, ie) {
      if (y < t.Z_MIN_LEVEL || y > t.Z_MAX_LEVEL)
        throw new RangeError("Invalid compression level: " + y);
      if (D != t.Z_FILTERED && D != t.Z_HUFFMAN_ONLY && D != t.Z_RLE && D != t.Z_FIXED && D != t.Z_DEFAULT_STRATEGY)
        throw new TypeError("Invalid strategy: " + D);
      if (this._level !== y || this._strategy !== D) {
        var de = this;
        this.flush(s.Z_SYNC_FLUSH, function() {
          a(de._handle, "zlib binding closed"), de._handle.params(y, D), de._hadError || (de._level = y, de._strategy = D, ie && ie());
        });
      } else
        process$1.nextTick(ie);
    }, V.prototype.reset = function() {
      return a(this._handle, "zlib binding closed"), this._handle.reset();
    }, V.prototype._flush = function(y) {
      this._transform(e.alloc(0), "", y);
    }, V.prototype.flush = function(y, D) {
      var ie = this, de = this._writableState;
      (typeof y == "function" || y === void 0 && !D) && (D = y, y = s.Z_FULL_FLUSH), de.ended ? D && process$1.nextTick(D) : de.ending ? D && this.once("end", D) : de.needDrain ? D && this.once("drain", function() {
        return ie.flush(y, D);
      }) : (this._flushFlag = y, this.write(e.alloc(0), "", D));
    }, V.prototype.close = function(y) {
      C(this, y), process$1.nextTick(z, this);
    };
    function C(y, D) {
      D && process$1.nextTick(D), y._handle && (y._handle.close(), y._handle = null);
    }
    function z(y) {
      y.emit("close");
    }
    V.prototype._transform = function(y, D, ie) {
      var de, we = this._writableState, be = we.ending || we.ended, ce = be && (!y || we.length === y.length);
      if (y !== null && !e.isBuffer(y)) return ie(new Error("invalid input"));
      if (!this._handle) return ie(new Error("zlib binding closed"));
      ce ? de = this._finishFlushFlag : (de = this._flushFlag, y.length >= we.length && (this._flushFlag = this._opts.flush || s.Z_NO_FLUSH)), this._processChunk(y, de, ie);
    }, V.prototype._processChunk = function(y, D, ie) {
      var de = y && y.length, we = this._chunkSize - this._offset, be = 0, ce = this, fe = typeof ie == "function";
      if (!fe) {
        var j = [], pe = 0, ee;
        this.on("error", function(B) {
          ee = B;
        }), a(this._handle, "zlib binding closed");
        do
          var X = this._handle.writeSync(
            D,
            y,
            // in
            be,
            // in_off
            de,
            // in_len
            this._buffer,
            // out
            this._offset,
            //out_off
            we
          );
        while (!this._hadError && O(X[0], X[1]));
        if (this._hadError)
          throw ee;
        if (pe >= f)
          throw C(this), new RangeError(u);
        var G = e.concat(j, pe);
        return C(this), G;
      }
      a(this._handle, "zlib binding closed");
      var le = this._handle.write(
        D,
        y,
        // in
        be,
        // in_off
        de,
        // in_len
        this._buffer,
        // out
        this._offset,
        //out_off
        we
      );
      le.buffer = y, le.callback = O;
      function O(B, N) {
        if (this && (this.buffer = null, this.callback = null), !ce._hadError) {
          var re = we - N;
          if (a(re >= 0, "have should not go down"), re > 0) {
            var ne = ce._buffer.slice(ce._offset, ce._offset + re);
            ce._offset += re, fe ? ce.push(ne) : (j.push(ne), pe += ne.length);
          }
          if ((N === 0 || ce._offset >= ce._chunkSize) && (we = ce._chunkSize, ce._offset = 0, ce._buffer = e.allocUnsafe(ce._chunkSize)), N === 0) {
            if (be += de - B, de = B, !fe) return !0;
            var F = ce._handle.write(D, y, be, de, ce._buffer, ce._offset, ce._chunkSize);
            F.callback = O, F.buffer = y;
            return;
          }
          if (!fe) return !1;
          ie();
        }
      }
    }, r.inherits(v, V), r.inherits(P, V), r.inherits(E, V), r.inherits(I, V), r.inherits(A, V), r.inherits($, V), r.inherits(x, V);
  })(lib)), lib;
}
var utils$2, hasRequiredUtils$2;
function requireUtils$2() {
  if (hasRequiredUtils$2) return utils$2;
  hasRequiredUtils$2 = 1;
  function t(l, m) {
    const w = l.split("/");
    let R = 0;
    if (w[R] === "") {
      for (; m[".."] !== void 0; )
        m = m[".."];
      R++;
    }
    for (; R < w.length; R++)
      m = m[w[R]];
    return m;
  }
  function e(l) {
    if (typeof l == "string")
      return { type: l };
    if (Array.isArray(l))
      return { type: l[0], typeArgs: l[1] };
    if (typeof l.type == "string")
      return l;
    throw new Error("Not a fieldinfo");
  }
  function n(l, m, { count: w, countType: R }, p) {
    let q = 0, c = 0;
    return typeof w == "number" ? q = w : typeof w < "u" ? q = t(w, p) : typeof R < "u" ? { size: c, value: q } = u(() => this.read(l, m, e(R), p), "$count") : q = 0, { count: q, size: c };
  }
  function s(l, m, w, { count: R, countType: p }, q) {
    return typeof R < "u" && l !== R || typeof p < "u" && (w = this.write(l, m, w, e(p), q)), w;
  }
  function r(l, { count: m, countType: w }, R) {
    return typeof m > "u" && typeof w < "u" ? u(() => this.sizeOf(l, e(w), R), "$count") : 0;
  }
  function a(l, m) {
    throw l.field = l.field ? m + "." + l.field : m, l;
  }
  function f(l, m) {
    try {
      return l();
    } catch (w) {
      m(w);
    }
  }
  function u(l, m) {
    return f(l, (w) => a(w, m));
  }
  class h extends Error {
    constructor(m) {
      super(m), this.name = this.constructor.name, this.message = m, Error.captureStackTrace != null && Error.captureStackTrace(this, this.constructor.name);
    }
  }
  class g extends h {
    constructor(m) {
      super(m), this.partialReadError = !0;
    }
  }
  return utils$2 = {
    getField: t,
    getFieldInfo: e,
    addErrorField: a,
    getCount: n,
    sendCount: s,
    calcCount: r,
    tryCatch: f,
    tryDoc: u,
    PartialReadError: g
  }, utils$2;
}
var lodash_reduce = { exports: {} };
lodash_reduce.exports;
var hasRequiredLodash_reduce;
function requireLodash_reduce() {
  return hasRequiredLodash_reduce || (hasRequiredLodash_reduce = 1, (function(t, e) {
    var n = 200, s = "Expected a function", r = "__lodash_hash_undefined__", a = 1, f = 2, u = 9007199254740991, h = "[object Arguments]", g = "[object Array]", l = "[object Boolean]", m = "[object Date]", w = "[object Error]", R = "[object Function]", p = "[object GeneratorFunction]", q = "[object Map]", c = "[object Number]", v = "[object Object]", P = "[object Promise]", E = "[object RegExp]", I = "[object Set]", A = "[object String]", $ = "[object Symbol]", x = "[object WeakMap]", M = "[object ArrayBuffer]", V = "[object DataView]", C = "[object Float32Array]", z = "[object Float64Array]", y = "[object Int8Array]", D = "[object Int16Array]", ie = "[object Int32Array]", de = "[object Uint8Array]", we = "[object Uint8ClampedArray]", be = "[object Uint16Array]", ce = "[object Uint32Array]", fe = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, j = /^\w*$/, pe = /^\./, ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, X = /[\\^$.*+?()[\]{}|]/g, G = /\\(\\)?/g, le = /^\[object .+?Constructor\]$/, O = /^(?:0|[1-9]\d*)$/, B = {};
    B[C] = B[z] = B[y] = B[D] = B[ie] = B[de] = B[we] = B[be] = B[ce] = !0, B[h] = B[g] = B[M] = B[l] = B[V] = B[m] = B[w] = B[R] = B[q] = B[c] = B[v] = B[E] = B[I] = B[A] = B[x] = !1;
    var N = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, re = typeof self == "object" && self && self.Object === Object && self, ne = N || re || Function("return this")(), F = e && !e.nodeType && e, L = F && !0 && t && !t.nodeType && t, H = L && L.exports === F, se = H && N.process, Ee = (function() {
      try {
        return se && se.binding("util");
      } catch {
      }
    })(), Re = Ee && Ee.isTypedArray;
    function Pe(Y, ve, Ne, ze) {
      var Ke = -1, Ze = Y ? Y.length : 0;
      for (ze && Ze && (Ne = Y[++Ke]); ++Ke < Ze; )
        Ne = ve(Ne, Y[Ke], Ke, Y);
      return Ne;
    }
    function Oe(Y, ve) {
      for (var Ne = -1, ze = Y ? Y.length : 0; ++Ne < ze; )
        if (ve(Y[Ne], Ne, Y))
          return !0;
      return !1;
    }
    function te(Y) {
      return function(ve) {
        return ve == null ? void 0 : ve[Y];
      };
    }
    function $e(Y, ve, Ne, ze, Ke) {
      return Ke(Y, function(Ze, er, lr) {
        Ne = ze ? (ze = !1, Ze) : ve(Ne, Ze, er, lr);
      }), Ne;
    }
    function Ce(Y, ve) {
      for (var Ne = -1, ze = Array(Y); ++Ne < Y; )
        ze[Ne] = ve(Ne);
      return ze;
    }
    function Te(Y) {
      return function(ve) {
        return Y(ve);
      };
    }
    function Ue(Y, ve) {
      return Y == null ? void 0 : Y[ve];
    }
    function ge(Y) {
      var ve = !1;
      if (Y != null && typeof Y.toString != "function")
        try {
          ve = !!(Y + "");
        } catch {
        }
      return ve;
    }
    function Se(Y) {
      var ve = -1, Ne = Array(Y.size);
      return Y.forEach(function(ze, Ke) {
        Ne[++ve] = [Ke, ze];
      }), Ne;
    }
    function Le(Y, ve) {
      return function(Ne) {
        return Y(ve(Ne));
      };
    }
    function Me(Y) {
      var ve = -1, Ne = Array(Y.size);
      return Y.forEach(function(ze) {
        Ne[++ve] = ze;
      }), Ne;
    }
    var ke = Array.prototype, He = Function.prototype, U = Object.prototype, o = ne["__core-js_shared__"], _ = (function() {
      var Y = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "");
      return Y ? "Symbol(src)_1." + Y : "";
    })(), W = He.toString, ue = U.hasOwnProperty, J = U.toString, he = RegExp(
      "^" + W.call(ue).replace(X, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), k = ne.Symbol, Be = ne.Uint8Array, We = U.propertyIsEnumerable, S = ke.splice, Ie = Le(Object.keys, Object), Fe = Br(ne, "DataView"), Z = Br(ne, "Map"), _e = Br(ne, "Promise"), De = Br(ne, "Set"), Ge = Br(ne, "WeakMap"), K = Br(Object, "create"), b = xr(Fe), d = xr(Z), T = xr(_e), Q = xr(De), ye = xr(Ge), qe = k ? k.prototype : void 0, ae = qe ? qe.valueOf : void 0, oe = qe ? qe.toString : void 0;
    function me(Y) {
      var ve = -1, Ne = Y ? Y.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = Y[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function xe() {
      this.__data__ = K ? K(null) : {};
    }
    function Ae(Y) {
      return this.has(Y) && delete this.__data__[Y];
    }
    function je(Y) {
      var ve = this.__data__;
      if (K) {
        var Ne = ve[Y];
        return Ne === r ? void 0 : Ne;
      }
      return ue.call(ve, Y) ? ve[Y] : void 0;
    }
    function Ve(Y) {
      var ve = this.__data__;
      return K ? ve[Y] !== void 0 : ue.call(ve, Y);
    }
    function Ye(Y, ve) {
      var Ne = this.__data__;
      return Ne[Y] = K && ve === void 0 ? r : ve, this;
    }
    me.prototype.clear = xe, me.prototype.delete = Ae, me.prototype.get = je, me.prototype.has = Ve, me.prototype.set = Ye;
    function Qe(Y) {
      var ve = -1, Ne = Y ? Y.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = Y[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function nr() {
      this.__data__ = [];
    }
    function Xe(Y) {
      var ve = this.__data__, Ne = Rr(ve, Y);
      if (Ne < 0)
        return !1;
      var ze = ve.length - 1;
      return Ne == ze ? ve.pop() : S.call(ve, Ne, 1), !0;
    }
    function rr(Y) {
      var ve = this.__data__, Ne = Rr(ve, Y);
      return Ne < 0 ? void 0 : ve[Ne][1];
    }
    function ar(Y) {
      return Rr(this.__data__, Y) > -1;
    }
    function Je(Y, ve) {
      var Ne = this.__data__, ze = Rr(Ne, Y);
      return ze < 0 ? Ne.push([Y, ve]) : Ne[ze][1] = ve, this;
    }
    Qe.prototype.clear = nr, Qe.prototype.delete = Xe, Qe.prototype.get = rr, Qe.prototype.has = ar, Qe.prototype.set = Je;
    function tr(Y) {
      var ve = -1, Ne = Y ? Y.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = Y[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function or() {
      this.__data__ = {
        hash: new me(),
        map: new (Z || Qe)(),
        string: new me()
      };
    }
    function ir(Y) {
      return jr(this, Y).delete(Y);
    }
    function wr(Y) {
      return jr(this, Y).get(Y);
    }
    function yr(Y) {
      return jr(this, Y).has(Y);
    }
    function mr(Y, ve) {
      return jr(this, Y).set(Y, ve), this;
    }
    tr.prototype.clear = or, tr.prototype.delete = ir, tr.prototype.get = wr, tr.prototype.has = yr, tr.prototype.set = mr;
    function _r(Y) {
      var ve = -1, Ne = Y ? Y.length : 0;
      for (this.__data__ = new tr(); ++ve < Ne; )
        this.add(Y[ve]);
    }
    function Er(Y) {
      return this.__data__.set(Y, r), this;
    }
    function dr(Y) {
      return this.__data__.has(Y);
    }
    _r.prototype.add = _r.prototype.push = Er, _r.prototype.has = dr;
    function ur(Y) {
      this.__data__ = new Qe(Y);
    }
    function Sr() {
      this.__data__ = new Qe();
    }
    function br(Y) {
      return this.__data__.delete(Y);
    }
    function Or(Y) {
      return this.__data__.get(Y);
    }
    function Cr(Y) {
      return this.__data__.has(Y);
    }
    function Nr(Y, ve) {
      var Ne = this.__data__;
      if (Ne instanceof Qe) {
        var ze = Ne.__data__;
        if (!Z || ze.length < n - 1)
          return ze.push([Y, ve]), this;
        Ne = this.__data__ = new tr(ze);
      }
      return Ne.set(Y, ve), this;
    }
    ur.prototype.clear = Sr, ur.prototype.delete = br, ur.prototype.get = Or, ur.prototype.has = Cr, ur.prototype.set = Nr;
    function $r(Y, ve) {
      var Ne = qr(Y) || ot(Y) ? Ce(Y.length, String) : [], ze = Ne.length, Ke = !!ze;
      for (var Ze in Y)
        ue.call(Y, Ze) && !(Ke && (Ze == "length" || tt(Ze, ze))) && Ne.push(Ze);
      return Ne;
    }
    function Rr(Y, ve) {
      for (var Ne = Y.length; Ne--; )
        if (at(Y[Ne][0], ve))
          return Ne;
      return -1;
    }
    var Fr = wt(kr), Lr = Et();
    function kr(Y, ve) {
      return Y && Lr(Y, ve, Hr);
    }
    function Ar(Y, ve) {
      ve = Mr(ve, Y) ? [ve] : et(ve);
      for (var Ne = 0, ze = ve.length; Y != null && Ne < ze; )
        Y = Y[Ur(ve[Ne++])];
      return Ne && Ne == ze ? Y : void 0;
    }
    function ut(Y) {
      return J.call(Y);
    }
    function ft(Y, ve) {
      return Y != null && ve in Object(Y);
    }
    function Kr(Y, ve, Ne, ze, Ke) {
      return Y === ve ? !0 : Y == null || ve == null || !zr(Y) && !Wr(ve) ? Y !== Y && ve !== ve : ct(Y, ve, Kr, Ne, ze, Ke);
    }
    function ct(Y, ve, Ne, ze, Ke, Ze) {
      var er = qr(Y), lr = qr(ve), sr = g, fr = g;
      er || (sr = Tr(Y), sr = sr == h ? v : sr), lr || (fr = Tr(ve), fr = fr == h ? v : fr);
      var hr = sr == v && !ge(Y), pr = fr == v && !ge(ve), cr = sr == fr;
      if (cr && !hr)
        return Ze || (Ze = new ur()), er || $t(Y) ? rt(Y, ve, Ne, ze, Ke, Ze) : St(Y, ve, sr, Ne, ze, Ke, Ze);
      if (!(Ke & f)) {
        var gr = hr && ue.call(Y, "__wrapped__"), vr = pr && ue.call(ve, "__wrapped__");
        if (gr || vr) {
          var Ir = gr ? Y.value() : Y, Pr = vr ? ve.value() : ve;
          return Ze || (Ze = new ur()), Ne(Ir, Pr, ze, Ke, Ze);
        }
      }
      return cr ? (Ze || (Ze = new ur()), Rt(Y, ve, Ne, ze, Ke, Ze)) : !1;
    }
    function dt(Y, ve, Ne, ze) {
      var Ke = Ne.length, Ze = Ke;
      if (Y == null)
        return !Ze;
      for (Y = Object(Y); Ke--; ) {
        var er = Ne[Ke];
        if (er[2] ? er[1] !== Y[er[0]] : !(er[0] in Y))
          return !1;
      }
      for (; ++Ke < Ze; ) {
        er = Ne[Ke];
        var lr = er[0], sr = Y[lr], fr = er[1];
        if (er[2]) {
          if (sr === void 0 && !(lr in Y))
            return !1;
        } else {
          var hr = new ur(), pr;
          if (!(pr === void 0 ? Kr(fr, sr, ze, a | f, hr) : pr))
            return !1;
        }
      }
      return !0;
    }
    function ht(Y) {
      if (!zr(Y) || qt(Y))
        return !1;
      var ve = st(Y) || ge(Y) ? he : le;
      return ve.test(xr(Y));
    }
    function pt(Y) {
      return Wr(Y) && Xr(Y.length) && !!B[J.call(Y)];
    }
    function yt(Y) {
      return typeof Y == "function" ? Y : Y == null ? Nt : typeof Y == "object" ? qr(Y) ? vt(Y[0], Y[1]) : gt(Y) : Lt(Y);
    }
    function mt(Y) {
      if (!It(Y))
        return Ie(Y);
      var ve = [];
      for (var Ne in Object(Y))
        ue.call(Y, Ne) && Ne != "constructor" && ve.push(Ne);
      return ve;
    }
    function gt(Y) {
      var ve = Pt(Y);
      return ve.length == 1 && ve[0][2] ? it(ve[0][0], ve[0][1]) : function(Ne) {
        return Ne === Y || dt(Ne, Y, ve);
      };
    }
    function vt(Y, ve) {
      return Mr(Y) && nt(ve) ? it(Ur(Y), ve) : function(Ne) {
        var ze = Bt(Ne, Y);
        return ze === void 0 && ze === ve ? Ct(Ne, Y) : Kr(ve, ze, void 0, a | f);
      };
    }
    function _t(Y) {
      return function(ve) {
        return Ar(ve, Y);
      };
    }
    function bt(Y) {
      if (typeof Y == "string")
        return Y;
      if (Jr(Y))
        return oe ? oe.call(Y) : "";
      var ve = Y + "";
      return ve == "0" && 1 / Y == -1 / 0 ? "-0" : ve;
    }
    function et(Y) {
      return qr(Y) ? Y : Ot(Y);
    }
    function wt(Y, ve) {
      return function(Ne, ze) {
        if (Ne == null)
          return Ne;
        if (!Qr(Ne))
          return Y(Ne, ze);
        for (var Ke = Ne.length, Ze = -1, er = Object(Ne); ++Ze < Ke && ze(er[Ze], Ze, er) !== !1; )
          ;
        return Ne;
      };
    }
    function Et(Y) {
      return function(ve, Ne, ze) {
        for (var Ke = -1, Ze = Object(ve), er = ze(ve), lr = er.length; lr--; ) {
          var sr = er[++Ke];
          if (Ne(Ze[sr], sr, Ze) === !1)
            break;
        }
        return ve;
      };
    }
    function rt(Y, ve, Ne, ze, Ke, Ze) {
      var er = Ke & f, lr = Y.length, sr = ve.length;
      if (lr != sr && !(er && sr > lr))
        return !1;
      var fr = Ze.get(Y);
      if (fr && Ze.get(ve))
        return fr == ve;
      var hr = -1, pr = !0, cr = Ke & a ? new _r() : void 0;
      for (Ze.set(Y, ve), Ze.set(ve, Y); ++hr < lr; ) {
        var gr = Y[hr], vr = ve[hr];
        if (ze)
          var Ir = er ? ze(vr, gr, hr, ve, Y, Ze) : ze(gr, vr, hr, Y, ve, Ze);
        if (Ir !== void 0) {
          if (Ir)
            continue;
          pr = !1;
          break;
        }
        if (cr) {
          if (!Oe(ve, function(Pr, Dr) {
            if (!cr.has(Dr) && (gr === Pr || Ne(gr, Pr, ze, Ke, Ze)))
              return cr.add(Dr);
          })) {
            pr = !1;
            break;
          }
        } else if (!(gr === vr || Ne(gr, vr, ze, Ke, Ze))) {
          pr = !1;
          break;
        }
      }
      return Ze.delete(Y), Ze.delete(ve), pr;
    }
    function St(Y, ve, Ne, ze, Ke, Ze, er) {
      switch (Ne) {
        case V:
          if (Y.byteLength != ve.byteLength || Y.byteOffset != ve.byteOffset)
            return !1;
          Y = Y.buffer, ve = ve.buffer;
        case M:
          return !(Y.byteLength != ve.byteLength || !ze(new Be(Y), new Be(ve)));
        case l:
        case m:
        case c:
          return at(+Y, +ve);
        case w:
          return Y.name == ve.name && Y.message == ve.message;
        case E:
        case A:
          return Y == ve + "";
        case q:
          var lr = Se;
        case I:
          var sr = Ze & f;
          if (lr || (lr = Me), Y.size != ve.size && !sr)
            return !1;
          var fr = er.get(Y);
          if (fr)
            return fr == ve;
          Ze |= a, er.set(Y, ve);
          var hr = rt(lr(Y), lr(ve), ze, Ke, Ze, er);
          return er.delete(Y), hr;
        case $:
          if (ae)
            return ae.call(Y) == ae.call(ve);
      }
      return !1;
    }
    function Rt(Y, ve, Ne, ze, Ke, Ze) {
      var er = Ke & f, lr = Hr(Y), sr = lr.length, fr = Hr(ve), hr = fr.length;
      if (sr != hr && !er)
        return !1;
      for (var pr = sr; pr--; ) {
        var cr = lr[pr];
        if (!(er ? cr in ve : ue.call(ve, cr)))
          return !1;
      }
      var gr = Ze.get(Y);
      if (gr && Ze.get(ve))
        return gr == ve;
      var vr = !0;
      Ze.set(Y, ve), Ze.set(ve, Y);
      for (var Ir = er; ++pr < sr; ) {
        cr = lr[pr];
        var Pr = Y[cr], Dr = ve[cr];
        if (ze)
          var lt = er ? ze(Dr, Pr, cr, ve, Y, Ze) : ze(Pr, Dr, cr, Y, ve, Ze);
        if (!(lt === void 0 ? Pr === Dr || Ne(Pr, Dr, ze, Ke, Ze) : lt)) {
          vr = !1;
          break;
        }
        Ir || (Ir = cr == "constructor");
      }
      if (vr && !Ir) {
        var Vr = Y.constructor, Gr = ve.constructor;
        Vr != Gr && "constructor" in Y && "constructor" in ve && !(typeof Vr == "function" && Vr instanceof Vr && typeof Gr == "function" && Gr instanceof Gr) && (vr = !1);
      }
      return Ze.delete(Y), Ze.delete(ve), vr;
    }
    function jr(Y, ve) {
      var Ne = Y.__data__;
      return Tt(ve) ? Ne[typeof ve == "string" ? "string" : "hash"] : Ne.map;
    }
    function Pt(Y) {
      for (var ve = Hr(Y), Ne = ve.length; Ne--; ) {
        var ze = ve[Ne], Ke = Y[ze];
        ve[Ne] = [ze, Ke, nt(Ke)];
      }
      return ve;
    }
    function Br(Y, ve) {
      var Ne = Ue(Y, ve);
      return ht(Ne) ? Ne : void 0;
    }
    var Tr = ut;
    (Fe && Tr(new Fe(new ArrayBuffer(1))) != V || Z && Tr(new Z()) != q || _e && Tr(_e.resolve()) != P || De && Tr(new De()) != I || Ge && Tr(new Ge()) != x) && (Tr = function(Y) {
      var ve = J.call(Y), Ne = ve == v ? Y.constructor : void 0, ze = Ne ? xr(Ne) : void 0;
      if (ze)
        switch (ze) {
          case b:
            return V;
          case d:
            return q;
          case T:
            return P;
          case Q:
            return I;
          case ye:
            return x;
        }
      return ve;
    });
    function At(Y, ve, Ne) {
      ve = Mr(ve, Y) ? [ve] : et(ve);
      for (var ze, Ke = -1, er = ve.length; ++Ke < er; ) {
        var Ze = Ur(ve[Ke]);
        if (!(ze = Y != null && Ne(Y, Ze)))
          break;
        Y = Y[Ze];
      }
      if (ze)
        return ze;
      var er = Y ? Y.length : 0;
      return !!er && Xr(er) && tt(Ze, er) && (qr(Y) || ot(Y));
    }
    function tt(Y, ve) {
      return ve = ve ?? u, !!ve && (typeof Y == "number" || O.test(Y)) && Y > -1 && Y % 1 == 0 && Y < ve;
    }
    function Mr(Y, ve) {
      if (qr(Y))
        return !1;
      var Ne = typeof Y;
      return Ne == "number" || Ne == "symbol" || Ne == "boolean" || Y == null || Jr(Y) ? !0 : j.test(Y) || !fe.test(Y) || ve != null && Y in Object(ve);
    }
    function Tt(Y) {
      var ve = typeof Y;
      return ve == "string" || ve == "number" || ve == "symbol" || ve == "boolean" ? Y !== "__proto__" : Y === null;
    }
    function qt(Y) {
      return !!_ && _ in Y;
    }
    function It(Y) {
      var ve = Y && Y.constructor, Ne = typeof ve == "function" && ve.prototype || U;
      return Y === Ne;
    }
    function nt(Y) {
      return Y === Y && !zr(Y);
    }
    function it(Y, ve) {
      return function(Ne) {
        return Ne == null ? !1 : Ne[Y] === ve && (ve !== void 0 || Y in Object(Ne));
      };
    }
    var Ot = Yr(function(Y) {
      Y = Ft(Y);
      var ve = [];
      return pe.test(Y) && ve.push(""), Y.replace(ee, function(Ne, ze, Ke, Ze) {
        ve.push(Ke ? Ze.replace(G, "$1") : ze || Ne);
      }), ve;
    });
    function Ur(Y) {
      if (typeof Y == "string" || Jr(Y))
        return Y;
      var ve = Y + "";
      return ve == "0" && 1 / Y == -1 / 0 ? "-0" : ve;
    }
    function xr(Y) {
      if (Y != null) {
        try {
          return W.call(Y);
        } catch {
        }
        try {
          return Y + "";
        } catch {
        }
      }
      return "";
    }
    function xt(Y, ve, Ne) {
      var ze = qr(Y) ? Pe : $e, Ke = arguments.length < 3;
      return ze(Y, yt(ve), Ne, Ke, Fr);
    }
    function Yr(Y, ve) {
      if (typeof Y != "function" || ve && typeof ve != "function")
        throw new TypeError(s);
      var Ne = function() {
        var ze = arguments, Ke = ve ? ve.apply(this, ze) : ze[0], Ze = Ne.cache;
        if (Ze.has(Ke))
          return Ze.get(Ke);
        var er = Y.apply(this, ze);
        return Ne.cache = Ze.set(Ke, er), er;
      };
      return Ne.cache = new (Yr.Cache || tr)(), Ne;
    }
    Yr.Cache = tr;
    function at(Y, ve) {
      return Y === ve || Y !== Y && ve !== ve;
    }
    function ot(Y) {
      return Dt(Y) && ue.call(Y, "callee") && (!We.call(Y, "callee") || J.call(Y) == h);
    }
    var qr = Array.isArray;
    function Qr(Y) {
      return Y != null && Xr(Y.length) && !st(Y);
    }
    function Dt(Y) {
      return Wr(Y) && Qr(Y);
    }
    function st(Y) {
      var ve = zr(Y) ? J.call(Y) : "";
      return ve == R || ve == p;
    }
    function Xr(Y) {
      return typeof Y == "number" && Y > -1 && Y % 1 == 0 && Y <= u;
    }
    function zr(Y) {
      var ve = typeof Y;
      return !!Y && (ve == "object" || ve == "function");
    }
    function Wr(Y) {
      return !!Y && typeof Y == "object";
    }
    function Jr(Y) {
      return typeof Y == "symbol" || Wr(Y) && J.call(Y) == $;
    }
    var $t = Re ? Te(Re) : pt;
    function Ft(Y) {
      return Y == null ? "" : bt(Y);
    }
    function Bt(Y, ve, Ne) {
      var ze = Y == null ? void 0 : Ar(Y, ve);
      return ze === void 0 ? Ne : ze;
    }
    function Ct(Y, ve) {
      return Y != null && At(Y, ve, ft);
    }
    function Hr(Y) {
      return Qr(Y) ? $r(Y) : mt(Y);
    }
    function Nt(Y) {
      return Y;
    }
    function Lt(Y) {
      return Mr(Y) ? te(Ur(Y)) : _t(Y);
    }
    t.exports = xt;
  })(lodash_reduce, lodash_reduce.exports)), lodash_reduce.exports;
}
var uri_all$1 = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
var uri_all = uri_all$1.exports, hasRequiredUri_all;
function requireUri_all() {
  return hasRequiredUri_all || (hasRequiredUri_all = 1, (function(t, e) {
    (function(n, s) {
      s(e);
    })(uri_all, (function(n) {
      function s() {
        for (var ae = arguments.length, oe = Array(ae), me = 0; me < ae; me++)
          oe[me] = arguments[me];
        if (oe.length > 1) {
          oe[0] = oe[0].slice(0, -1);
          for (var xe = oe.length - 1, Ae = 1; Ae < xe; ++Ae)
            oe[Ae] = oe[Ae].slice(1, -1);
          return oe[xe] = oe[xe].slice(1), oe.join("");
        } else
          return oe[0];
      }
      function r(ae) {
        return "(?:" + ae + ")";
      }
      function a(ae) {
        return ae === void 0 ? "undefined" : ae === null ? "null" : Object.prototype.toString.call(ae).split(" ").pop().split("]").shift().toLowerCase();
      }
      function f(ae) {
        return ae.toUpperCase();
      }
      function u(ae) {
        return ae != null ? ae instanceof Array ? ae : typeof ae.length != "number" || ae.split || ae.setInterval || ae.call ? [ae] : Array.prototype.slice.call(ae) : [];
      }
      function h(ae, oe) {
        var me = ae;
        if (oe)
          for (var xe in oe)
            me[xe] = oe[xe];
        return me;
      }
      function g(ae) {
        var oe = "[A-Za-z]", me = "[0-9]", xe = s(me, "[A-Fa-f]"), Ae = r(r("%[EFef]" + xe + "%" + xe + xe + "%" + xe + xe) + "|" + r("%[89A-Fa-f]" + xe + "%" + xe + xe) + "|" + r("%" + xe + xe)), je = "[\\:\\/\\?\\#\\[\\]\\@]", Ve = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Ye = s(je, Ve), Qe = ae ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", nr = ae ? "[\\uE000-\\uF8FF]" : "[]", Xe = s(oe, me, "[\\-\\.\\_\\~]", Qe);
        r(oe + s(oe, me, "[\\+\\-\\.]") + "*"), r(r(Ae + "|" + s(Xe, Ve, "[\\:]")) + "*");
        var rr = r(r("25[0-5]") + "|" + r("2[0-4]" + me) + "|" + r("1" + me + me) + "|" + r("0?[1-9]" + me) + "|0?0?" + me), ar = r(rr + "\\." + rr + "\\." + rr + "\\." + rr), Je = r(xe + "{1,4}"), tr = r(r(Je + "\\:" + Je) + "|" + ar), or = r(r(Je + "\\:") + "{6}" + tr), ir = r("\\:\\:" + r(Je + "\\:") + "{5}" + tr), wr = r(r(Je) + "?\\:\\:" + r(Je + "\\:") + "{4}" + tr), yr = r(r(r(Je + "\\:") + "{0,1}" + Je) + "?\\:\\:" + r(Je + "\\:") + "{3}" + tr), mr = r(r(r(Je + "\\:") + "{0,2}" + Je) + "?\\:\\:" + r(Je + "\\:") + "{2}" + tr), _r = r(r(r(Je + "\\:") + "{0,3}" + Je) + "?\\:\\:" + Je + "\\:" + tr), Er = r(r(r(Je + "\\:") + "{0,4}" + Je) + "?\\:\\:" + tr), dr = r(r(r(Je + "\\:") + "{0,5}" + Je) + "?\\:\\:" + Je), ur = r(r(r(Je + "\\:") + "{0,6}" + Je) + "?\\:\\:"), Sr = r([or, ir, wr, yr, mr, _r, Er, dr, ur].join("|")), br = r(r(Xe + "|" + Ae) + "+");
        r("[vV]" + xe + "+\\." + s(Xe, Ve, "[\\:]") + "+"), r(r(Ae + "|" + s(Xe, Ve)) + "*");
        var Or = r(Ae + "|" + s(Xe, Ve, "[\\:\\@]"));
        return r(r(Ae + "|" + s(Xe, Ve, "[\\@]")) + "+"), r(r(Or + "|" + s("[\\/\\?]", nr)) + "*"), {
          NOT_SCHEME: new RegExp(s("[^]", oe, me, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(s("[^\\%\\:]", Xe, Ve), "g"),
          NOT_HOST: new RegExp(s("[^\\%\\[\\]\\:]", Xe, Ve), "g"),
          NOT_PATH: new RegExp(s("[^\\%\\/\\:\\@]", Xe, Ve), "g"),
          NOT_PATH_NOSCHEME: new RegExp(s("[^\\%\\/\\@]", Xe, Ve), "g"),
          NOT_QUERY: new RegExp(s("[^\\%]", Xe, Ve, "[\\:\\@\\/\\?]", nr), "g"),
          NOT_FRAGMENT: new RegExp(s("[^\\%]", Xe, Ve, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(s("[^]", Xe, Ve), "g"),
          UNRESERVED: new RegExp(Xe, "g"),
          OTHER_CHARS: new RegExp(s("[^\\%]", Xe, Ye), "g"),
          PCT_ENCODED: new RegExp(Ae, "g"),
          IPV4ADDRESS: new RegExp("^(" + ar + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + Sr + ")" + r(r("\\%25|\\%(?!" + xe + "{2})") + "(" + br + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var l = g(!1), m = g(!0), w = /* @__PURE__ */ (function() {
        function ae(oe, me) {
          var xe = [], Ae = !0, je = !1, Ve = void 0;
          try {
            for (var Ye = oe[Symbol.iterator](), Qe; !(Ae = (Qe = Ye.next()).done) && (xe.push(Qe.value), !(me && xe.length === me)); Ae = !0)
              ;
          } catch (nr) {
            je = !0, Ve = nr;
          } finally {
            try {
              !Ae && Ye.return && Ye.return();
            } finally {
              if (je) throw Ve;
            }
          }
          return xe;
        }
        return function(oe, me) {
          if (Array.isArray(oe))
            return oe;
          if (Symbol.iterator in Object(oe))
            return ae(oe, me);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
      })(), R = function(ae) {
        if (Array.isArray(ae)) {
          for (var oe = 0, me = Array(ae.length); oe < ae.length; oe++) me[oe] = ae[oe];
          return me;
        } else
          return Array.from(ae);
      }, p = 2147483647, q = 36, c = 1, v = 26, P = 38, E = 700, I = 72, A = 128, $ = "-", x = /^xn--/, M = /[^\0-\x7E]/, V = /[\x2E\u3002\uFF0E\uFF61]/g, C = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, z = q - c, y = Math.floor, D = String.fromCharCode;
      function ie(ae) {
        throw new RangeError(C[ae]);
      }
      function de(ae, oe) {
        for (var me = [], xe = ae.length; xe--; )
          me[xe] = oe(ae[xe]);
        return me;
      }
      function we(ae, oe) {
        var me = ae.split("@"), xe = "";
        me.length > 1 && (xe = me[0] + "@", ae = me[1]), ae = ae.replace(V, ".");
        var Ae = ae.split("."), je = de(Ae, oe).join(".");
        return xe + je;
      }
      function be(ae) {
        for (var oe = [], me = 0, xe = ae.length; me < xe; ) {
          var Ae = ae.charCodeAt(me++);
          if (Ae >= 55296 && Ae <= 56319 && me < xe) {
            var je = ae.charCodeAt(me++);
            (je & 64512) == 56320 ? oe.push(((Ae & 1023) << 10) + (je & 1023) + 65536) : (oe.push(Ae), me--);
          } else
            oe.push(Ae);
        }
        return oe;
      }
      var ce = function(oe) {
        return String.fromCodePoint.apply(String, R(oe));
      }, fe = function(oe) {
        return oe - 48 < 10 ? oe - 22 : oe - 65 < 26 ? oe - 65 : oe - 97 < 26 ? oe - 97 : q;
      }, j = function(oe, me) {
        return oe + 22 + 75 * (oe < 26) - ((me != 0) << 5);
      }, pe = function(oe, me, xe) {
        var Ae = 0;
        for (
          oe = xe ? y(oe / E) : oe >> 1, oe += y(oe / me);
          /* no initialization */
          oe > z * v >> 1;
          Ae += q
        )
          oe = y(oe / z);
        return y(Ae + (z + 1) * oe / (oe + P));
      }, ee = function(oe) {
        var me = [], xe = oe.length, Ae = 0, je = A, Ve = I, Ye = oe.lastIndexOf($);
        Ye < 0 && (Ye = 0);
        for (var Qe = 0; Qe < Ye; ++Qe)
          oe.charCodeAt(Qe) >= 128 && ie("not-basic"), me.push(oe.charCodeAt(Qe));
        for (var nr = Ye > 0 ? Ye + 1 : 0; nr < xe; ) {
          for (
            var Xe = Ae, rr = 1, ar = q;
            ;
            /* no condition */
            ar += q
          ) {
            nr >= xe && ie("invalid-input");
            var Je = fe(oe.charCodeAt(nr++));
            (Je >= q || Je > y((p - Ae) / rr)) && ie("overflow"), Ae += Je * rr;
            var tr = ar <= Ve ? c : ar >= Ve + v ? v : ar - Ve;
            if (Je < tr)
              break;
            var or = q - tr;
            rr > y(p / or) && ie("overflow"), rr *= or;
          }
          var ir = me.length + 1;
          Ve = pe(Ae - Xe, ir, Xe == 0), y(Ae / ir) > p - je && ie("overflow"), je += y(Ae / ir), Ae %= ir, me.splice(Ae++, 0, je);
        }
        return String.fromCodePoint.apply(String, me);
      }, X = function(oe) {
        var me = [];
        oe = be(oe);
        var xe = oe.length, Ae = A, je = 0, Ve = I, Ye = !0, Qe = !1, nr = void 0;
        try {
          for (var Xe = oe[Symbol.iterator](), rr; !(Ye = (rr = Xe.next()).done); Ye = !0) {
            var ar = rr.value;
            ar < 128 && me.push(D(ar));
          }
        } catch (Ar) {
          Qe = !0, nr = Ar;
        } finally {
          try {
            !Ye && Xe.return && Xe.return();
          } finally {
            if (Qe)
              throw nr;
          }
        }
        var Je = me.length, tr = Je;
        for (Je && me.push($); tr < xe; ) {
          var or = p, ir = !0, wr = !1, yr = void 0;
          try {
            for (var mr = oe[Symbol.iterator](), _r; !(ir = (_r = mr.next()).done); ir = !0) {
              var Er = _r.value;
              Er >= Ae && Er < or && (or = Er);
            }
          } catch (Ar) {
            wr = !0, yr = Ar;
          } finally {
            try {
              !ir && mr.return && mr.return();
            } finally {
              if (wr)
                throw yr;
            }
          }
          var dr = tr + 1;
          or - Ae > y((p - je) / dr) && ie("overflow"), je += (or - Ae) * dr, Ae = or;
          var ur = !0, Sr = !1, br = void 0;
          try {
            for (var Or = oe[Symbol.iterator](), Cr; !(ur = (Cr = Or.next()).done); ur = !0) {
              var Nr = Cr.value;
              if (Nr < Ae && ++je > p && ie("overflow"), Nr == Ae) {
                for (
                  var $r = je, Rr = q;
                  ;
                  /* no condition */
                  Rr += q
                ) {
                  var Fr = Rr <= Ve ? c : Rr >= Ve + v ? v : Rr - Ve;
                  if ($r < Fr)
                    break;
                  var Lr = $r - Fr, kr = q - Fr;
                  me.push(D(j(Fr + Lr % kr, 0))), $r = y(Lr / kr);
                }
                me.push(D(j($r, 0))), Ve = pe(je, dr, tr == Je), je = 0, ++tr;
              }
            }
          } catch (Ar) {
            Sr = !0, br = Ar;
          } finally {
            try {
              !ur && Or.return && Or.return();
            } finally {
              if (Sr)
                throw br;
            }
          }
          ++je, ++Ae;
        }
        return me.join("");
      }, G = function(oe) {
        return we(oe, function(me) {
          return x.test(me) ? ee(me.slice(4).toLowerCase()) : me;
        });
      }, le = function(oe) {
        return we(oe, function(me) {
          return M.test(me) ? "xn--" + X(me) : me;
        });
      }, O = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        version: "2.1.0",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        ucs2: {
          decode: be,
          encode: ce
        },
        decode: ee,
        encode: X,
        toASCII: le,
        toUnicode: G
      }, B = {};
      function N(ae) {
        var oe = ae.charCodeAt(0), me = void 0;
        return oe < 16 ? me = "%0" + oe.toString(16).toUpperCase() : oe < 128 ? me = "%" + oe.toString(16).toUpperCase() : oe < 2048 ? me = "%" + (oe >> 6 | 192).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase() : me = "%" + (oe >> 12 | 224).toString(16).toUpperCase() + "%" + (oe >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase(), me;
      }
      function re(ae) {
        for (var oe = "", me = 0, xe = ae.length; me < xe; ) {
          var Ae = parseInt(ae.substr(me + 1, 2), 16);
          if (Ae < 128)
            oe += String.fromCharCode(Ae), me += 3;
          else if (Ae >= 194 && Ae < 224) {
            if (xe - me >= 6) {
              var je = parseInt(ae.substr(me + 4, 2), 16);
              oe += String.fromCharCode((Ae & 31) << 6 | je & 63);
            } else
              oe += ae.substr(me, 6);
            me += 6;
          } else if (Ae >= 224) {
            if (xe - me >= 9) {
              var Ve = parseInt(ae.substr(me + 4, 2), 16), Ye = parseInt(ae.substr(me + 7, 2), 16);
              oe += String.fromCharCode((Ae & 15) << 12 | (Ve & 63) << 6 | Ye & 63);
            } else
              oe += ae.substr(me, 9);
            me += 9;
          } else
            oe += ae.substr(me, 3), me += 3;
        }
        return oe;
      }
      function ne(ae, oe) {
        function me(xe) {
          var Ae = re(xe);
          return Ae.match(oe.UNRESERVED) ? Ae : xe;
        }
        return ae.scheme && (ae.scheme = String(ae.scheme).replace(oe.PCT_ENCODED, me).toLowerCase().replace(oe.NOT_SCHEME, "")), ae.userinfo !== void 0 && (ae.userinfo = String(ae.userinfo).replace(oe.PCT_ENCODED, me).replace(oe.NOT_USERINFO, N).replace(oe.PCT_ENCODED, f)), ae.host !== void 0 && (ae.host = String(ae.host).replace(oe.PCT_ENCODED, me).toLowerCase().replace(oe.NOT_HOST, N).replace(oe.PCT_ENCODED, f)), ae.path !== void 0 && (ae.path = String(ae.path).replace(oe.PCT_ENCODED, me).replace(ae.scheme ? oe.NOT_PATH : oe.NOT_PATH_NOSCHEME, N).replace(oe.PCT_ENCODED, f)), ae.query !== void 0 && (ae.query = String(ae.query).replace(oe.PCT_ENCODED, me).replace(oe.NOT_QUERY, N).replace(oe.PCT_ENCODED, f)), ae.fragment !== void 0 && (ae.fragment = String(ae.fragment).replace(oe.PCT_ENCODED, me).replace(oe.NOT_FRAGMENT, N).replace(oe.PCT_ENCODED, f)), ae;
      }
      function F(ae) {
        return ae.replace(/^0*(.*)/, "$1") || "0";
      }
      function L(ae, oe) {
        var me = ae.match(oe.IPV4ADDRESS) || [], xe = w(me, 2), Ae = xe[1];
        return Ae ? Ae.split(".").map(F).join(".") : ae;
      }
      function H(ae, oe) {
        var me = ae.match(oe.IPV6ADDRESS) || [], xe = w(me, 3), Ae = xe[1], je = xe[2];
        if (Ae) {
          for (var Ve = Ae.toLowerCase().split("::").reverse(), Ye = w(Ve, 2), Qe = Ye[0], nr = Ye[1], Xe = nr ? nr.split(":").map(F) : [], rr = Qe.split(":").map(F), ar = oe.IPV4ADDRESS.test(rr[rr.length - 1]), Je = ar ? 7 : 8, tr = rr.length - Je, or = Array(Je), ir = 0; ir < Je; ++ir)
            or[ir] = Xe[ir] || rr[tr + ir] || "";
          ar && (or[Je - 1] = L(or[Je - 1], oe));
          var wr = or.reduce(function(dr, ur, Sr) {
            if (!ur || ur === "0") {
              var br = dr[dr.length - 1];
              br && br.index + br.length === Sr ? br.length++ : dr.push({ index: Sr, length: 1 });
            }
            return dr;
          }, []), yr = wr.sort(function(dr, ur) {
            return ur.length - dr.length;
          })[0], mr = void 0;
          if (yr && yr.length > 1) {
            var _r = or.slice(0, yr.index), Er = or.slice(yr.index + yr.length);
            mr = _r.join(":") + "::" + Er.join(":");
          } else
            mr = or.join(":");
          return je && (mr += "%" + je), mr;
        } else
          return ae;
      }
      var se = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Ee = "".match(/(){0}/)[1] === void 0;
      function Re(ae) {
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, me = {}, xe = oe.iri !== !1 ? m : l;
        oe.reference === "suffix" && (ae = (oe.scheme ? oe.scheme + ":" : "") + "//" + ae);
        var Ae = ae.match(se);
        if (Ae) {
          Ee ? (me.scheme = Ae[1], me.userinfo = Ae[3], me.host = Ae[4], me.port = parseInt(Ae[5], 10), me.path = Ae[6] || "", me.query = Ae[7], me.fragment = Ae[8], isNaN(me.port) && (me.port = Ae[5])) : (me.scheme = Ae[1] || void 0, me.userinfo = ae.indexOf("@") !== -1 ? Ae[3] : void 0, me.host = ae.indexOf("//") !== -1 ? Ae[4] : void 0, me.port = parseInt(Ae[5], 10), me.path = Ae[6] || "", me.query = ae.indexOf("?") !== -1 ? Ae[7] : void 0, me.fragment = ae.indexOf("#") !== -1 ? Ae[8] : void 0, isNaN(me.port) && (me.port = ae.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? Ae[4] : void 0)), me.host && (me.host = H(L(me.host, xe), xe)), me.scheme === void 0 && me.userinfo === void 0 && me.host === void 0 && me.port === void 0 && !me.path && me.query === void 0 ? me.reference = "same-document" : me.scheme === void 0 ? me.reference = "relative" : me.fragment === void 0 ? me.reference = "absolute" : me.reference = "uri", oe.reference && oe.reference !== "suffix" && oe.reference !== me.reference && (me.error = me.error || "URI is not a " + oe.reference + " reference.");
          var je = B[(oe.scheme || me.scheme || "").toLowerCase()];
          if (!oe.unicodeSupport && (!je || !je.unicodeSupport)) {
            if (me.host && (oe.domainHost || je && je.domainHost))
              try {
                me.host = O.toASCII(me.host.replace(xe.PCT_ENCODED, re).toLowerCase());
              } catch (Ve) {
                me.error = me.error || "Host's domain name can not be converted to ASCII via punycode: " + Ve;
              }
            ne(me, l);
          } else
            ne(me, xe);
          je && je.parse && je.parse(me, oe);
        } else
          me.error = me.error || "URI can not be parsed.";
        return me;
      }
      function Pe(ae, oe) {
        var me = oe.iri !== !1 ? m : l, xe = [];
        return ae.userinfo !== void 0 && (xe.push(ae.userinfo), xe.push("@")), ae.host !== void 0 && xe.push(H(L(String(ae.host), me), me).replace(me.IPV6ADDRESS, function(Ae, je, Ve) {
          return "[" + je + (Ve ? "%25" + Ve : "") + "]";
        })), (typeof ae.port == "number" || typeof ae.port == "string") && (xe.push(":"), xe.push(String(ae.port))), xe.length ? xe.join("") : void 0;
      }
      var Oe = /^\.\.?\//, te = /^\/\.(\/|$)/, $e = /^\/\.\.(\/|$)/, Ce = /^\/?(?:.|\n)*?(?=\/|$)/;
      function Te(ae) {
        for (var oe = []; ae.length; )
          if (ae.match(Oe))
            ae = ae.replace(Oe, "");
          else if (ae.match(te))
            ae = ae.replace(te, "/");
          else if (ae.match($e))
            ae = ae.replace($e, "/"), oe.pop();
          else if (ae === "." || ae === "..")
            ae = "";
          else {
            var me = ae.match(Ce);
            if (me) {
              var xe = me[0];
              ae = ae.slice(xe.length), oe.push(xe);
            } else
              throw new Error("Unexpected dot segment condition");
          }
        return oe.join("");
      }
      function Ue(ae) {
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, me = oe.iri ? m : l, xe = [], Ae = B[(oe.scheme || ae.scheme || "").toLowerCase()];
        if (Ae && Ae.serialize && Ae.serialize(ae, oe), ae.host && !me.IPV6ADDRESS.test(ae.host)) {
          if (oe.domainHost || Ae && Ae.domainHost)
            try {
              ae.host = oe.iri ? O.toUnicode(ae.host) : O.toASCII(ae.host.replace(me.PCT_ENCODED, re).toLowerCase());
            } catch (Ye) {
              ae.error = ae.error || "Host's domain name can not be converted to " + (oe.iri ? "Unicode" : "ASCII") + " via punycode: " + Ye;
            }
        }
        ne(ae, me), oe.reference !== "suffix" && ae.scheme && (xe.push(ae.scheme), xe.push(":"));
        var je = Pe(ae, oe);
        if (je !== void 0 && (oe.reference !== "suffix" && xe.push("//"), xe.push(je), ae.path && ae.path.charAt(0) !== "/" && xe.push("/")), ae.path !== void 0) {
          var Ve = ae.path;
          !oe.absolutePath && (!Ae || !Ae.absolutePath) && (Ve = Te(Ve)), je === void 0 && (Ve = Ve.replace(/^\/\//, "/%2F")), xe.push(Ve);
        }
        return ae.query !== void 0 && (xe.push("?"), xe.push(ae.query)), ae.fragment !== void 0 && (xe.push("#"), xe.push(ae.fragment)), xe.join("");
      }
      function ge(ae, oe) {
        var me = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, xe = arguments[3], Ae = {};
        return xe || (ae = Re(Ue(ae, me), me), oe = Re(Ue(oe, me), me)), me = me || {}, !me.tolerant && oe.scheme ? (Ae.scheme = oe.scheme, Ae.userinfo = oe.userinfo, Ae.host = oe.host, Ae.port = oe.port, Ae.path = Te(oe.path || ""), Ae.query = oe.query) : (oe.userinfo !== void 0 || oe.host !== void 0 || oe.port !== void 0 ? (Ae.userinfo = oe.userinfo, Ae.host = oe.host, Ae.port = oe.port, Ae.path = Te(oe.path || ""), Ae.query = oe.query) : (oe.path ? (oe.path.charAt(0) === "/" ? Ae.path = Te(oe.path) : ((ae.userinfo !== void 0 || ae.host !== void 0 || ae.port !== void 0) && !ae.path ? Ae.path = "/" + oe.path : ae.path ? Ae.path = ae.path.slice(0, ae.path.lastIndexOf("/") + 1) + oe.path : Ae.path = oe.path, Ae.path = Te(Ae.path)), Ae.query = oe.query) : (Ae.path = ae.path, oe.query !== void 0 ? Ae.query = oe.query : Ae.query = ae.query), Ae.userinfo = ae.userinfo, Ae.host = ae.host, Ae.port = ae.port), Ae.scheme = ae.scheme), Ae.fragment = oe.fragment, Ae;
      }
      function Se(ae, oe, me) {
        var xe = h({ scheme: "null" }, me);
        return Ue(ge(Re(ae, xe), Re(oe, xe), xe, !0), xe);
      }
      function Le(ae, oe) {
        return typeof ae == "string" ? ae = Ue(Re(ae, oe), oe) : a(ae) === "object" && (ae = Re(Ue(ae, oe), oe)), ae;
      }
      function Me(ae, oe, me) {
        return typeof ae == "string" ? ae = Ue(Re(ae, me), me) : a(ae) === "object" && (ae = Ue(ae, me)), typeof oe == "string" ? oe = Ue(Re(oe, me), me) : a(oe) === "object" && (oe = Ue(oe, me)), ae === oe;
      }
      function ke(ae, oe) {
        return ae && ae.toString().replace(!oe || !oe.iri ? l.ESCAPE : m.ESCAPE, N);
      }
      function He(ae, oe) {
        return ae && ae.toString().replace(!oe || !oe.iri ? l.PCT_ENCODED : m.PCT_ENCODED, re);
      }
      var U = {
        scheme: "http",
        domainHost: !0,
        parse: function(oe, me) {
          return oe.host || (oe.error = oe.error || "HTTP URIs must have a host."), oe;
        },
        serialize: function(oe, me) {
          var xe = String(oe.scheme).toLowerCase() === "https";
          return (oe.port === (xe ? 443 : 80) || oe.port === "") && (oe.port = void 0), oe.path || (oe.path = "/"), oe;
        }
      }, o = {
        scheme: "https",
        domainHost: U.domainHost,
        parse: U.parse,
        serialize: U.serialize
      };
      function _(ae) {
        return typeof ae.secure == "boolean" ? ae.secure : String(ae.scheme).toLowerCase() === "wss";
      }
      var W = {
        scheme: "ws",
        domainHost: !0,
        parse: function(oe, me) {
          var xe = oe;
          return xe.secure = _(xe), xe.resourceName = (xe.path || "/") + (xe.query ? "?" + xe.query : ""), xe.path = void 0, xe.query = void 0, xe;
        },
        serialize: function(oe, me) {
          if ((oe.port === (_(oe) ? 443 : 80) || oe.port === "") && (oe.port = void 0), typeof oe.secure == "boolean" && (oe.scheme = oe.secure ? "wss" : "ws", oe.secure = void 0), oe.resourceName) {
            var xe = oe.resourceName.split("?"), Ae = w(xe, 2), je = Ae[0], Ve = Ae[1];
            oe.path = je && je !== "/" ? je : void 0, oe.query = Ve, oe.resourceName = void 0;
          }
          return oe.fragment = void 0, oe;
        }
      }, ue = {
        scheme: "wss",
        domainHost: W.domainHost,
        parse: W.parse,
        serialize: W.serialize
      }, J = {}, he = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", k = "[0-9A-Fa-f]", Be = r(r("%[EFef]" + k + "%" + k + k + "%" + k + k) + "|" + r("%[89A-Fa-f]" + k + "%" + k + k) + "|" + r("%" + k + k)), We = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", S = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Ie = s(S, '[\\"\\\\]'), Fe = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", Z = new RegExp(he, "g"), _e = new RegExp(Be, "g"), De = new RegExp(s("[^]", We, "[\\.]", '[\\"]', Ie), "g"), Ge = new RegExp(s("[^]", he, Fe), "g"), K = Ge;
      function b(ae) {
        var oe = re(ae);
        return oe.match(Z) ? oe : ae;
      }
      var d = {
        scheme: "mailto",
        parse: function(oe, me) {
          var xe = oe, Ae = xe.to = xe.path ? xe.path.split(",") : [];
          if (xe.path = void 0, xe.query) {
            for (var je = !1, Ve = {}, Ye = xe.query.split("&"), Qe = 0, nr = Ye.length; Qe < nr; ++Qe) {
              var Xe = Ye[Qe].split("=");
              switch (Xe[0]) {
                case "to":
                  for (var rr = Xe[1].split(","), ar = 0, Je = rr.length; ar < Je; ++ar)
                    Ae.push(rr[ar]);
                  break;
                case "subject":
                  xe.subject = He(Xe[1], me);
                  break;
                case "body":
                  xe.body = He(Xe[1], me);
                  break;
                default:
                  je = !0, Ve[He(Xe[0], me)] = He(Xe[1], me);
                  break;
              }
            }
            je && (xe.headers = Ve);
          }
          xe.query = void 0;
          for (var tr = 0, or = Ae.length; tr < or; ++tr) {
            var ir = Ae[tr].split("@");
            if (ir[0] = He(ir[0]), me.unicodeSupport)
              ir[1] = He(ir[1], me).toLowerCase();
            else
              try {
                ir[1] = O.toASCII(He(ir[1], me).toLowerCase());
              } catch (wr) {
                xe.error = xe.error || "Email address's domain name can not be converted to ASCII via punycode: " + wr;
              }
            Ae[tr] = ir.join("@");
          }
          return xe;
        },
        serialize: function(oe, me) {
          var xe = oe, Ae = u(oe.to);
          if (Ae) {
            for (var je = 0, Ve = Ae.length; je < Ve; ++je) {
              var Ye = String(Ae[je]), Qe = Ye.lastIndexOf("@"), nr = Ye.slice(0, Qe).replace(_e, b).replace(_e, f).replace(De, N), Xe = Ye.slice(Qe + 1);
              try {
                Xe = me.iri ? O.toUnicode(Xe) : O.toASCII(He(Xe, me).toLowerCase());
              } catch (tr) {
                xe.error = xe.error || "Email address's domain name can not be converted to " + (me.iri ? "Unicode" : "ASCII") + " via punycode: " + tr;
              }
              Ae[je] = nr + "@" + Xe;
            }
            xe.path = Ae.join(",");
          }
          var rr = oe.headers = oe.headers || {};
          oe.subject && (rr.subject = oe.subject), oe.body && (rr.body = oe.body);
          var ar = [];
          for (var Je in rr)
            rr[Je] !== J[Je] && ar.push(Je.replace(_e, b).replace(_e, f).replace(Ge, N) + "=" + rr[Je].replace(_e, b).replace(_e, f).replace(K, N));
          return ar.length && (xe.query = ar.join("&")), xe;
        }
      }, T = /^([^\:]+)\:(.*)/, Q = {
        scheme: "urn",
        parse: function(oe, me) {
          var xe = oe.path && oe.path.match(T), Ae = oe;
          if (xe) {
            var je = me.scheme || Ae.scheme || "urn", Ve = xe[1].toLowerCase(), Ye = xe[2], Qe = je + ":" + (me.nid || Ve), nr = B[Qe];
            Ae.nid = Ve, Ae.nss = Ye, Ae.path = void 0, nr && (Ae = nr.parse(Ae, me));
          } else
            Ae.error = Ae.error || "URN can not be parsed.";
          return Ae;
        },
        serialize: function(oe, me) {
          var xe = me.scheme || oe.scheme || "urn", Ae = oe.nid, je = xe + ":" + (me.nid || Ae), Ve = B[je];
          Ve && (oe = Ve.serialize(oe, me));
          var Ye = oe, Qe = oe.nss;
          return Ye.path = (Ae || me.nid) + ":" + Qe, Ye;
        }
      }, ye = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, qe = {
        scheme: "urn:uuid",
        parse: function(oe, me) {
          var xe = oe;
          return xe.uuid = xe.nss, xe.nss = void 0, !me.tolerant && (!xe.uuid || !xe.uuid.match(ye)) && (xe.error = xe.error || "UUID is not valid."), xe;
        },
        serialize: function(oe, me) {
          var xe = oe;
          return xe.nss = (oe.uuid || "").toLowerCase(), xe;
        }
      };
      B[U.scheme] = U, B[o.scheme] = o, B[W.scheme] = W, B[ue.scheme] = ue, B[d.scheme] = d, B[Q.scheme] = Q, B[qe.scheme] = qe, n.SCHEMES = B, n.pctEncChar = N, n.pctDecChars = re, n.parse = Re, n.removeDotSegments = Te, n.serialize = Ue, n.resolveComponents = ge, n.resolve = Se, n.normalize = Le, n.equal = Me, n.escapeComponent = ke, n.unescapeComponent = He, Object.defineProperty(n, "__esModule", { value: !0 });
    }));
  })(uri_all$1, uri_all$1.exports)), uri_all$1.exports;
}
var fastDeepEqual, hasRequiredFastDeepEqual;
function requireFastDeepEqual() {
  return hasRequiredFastDeepEqual || (hasRequiredFastDeepEqual = 1, fastDeepEqual = function t(e, n) {
    if (e === n) return !0;
    if (e && n && typeof e == "object" && typeof n == "object") {
      if (e.constructor !== n.constructor) return !1;
      var s, r, a;
      if (Array.isArray(e)) {
        if (s = e.length, s != n.length) return !1;
        for (r = s; r-- !== 0; )
          if (!t(e[r], n[r])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === n.source && e.flags === n.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === n.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === n.toString();
      if (a = Object.keys(e), s = a.length, s !== Object.keys(n).length) return !1;
      for (r = s; r-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, a[r])) return !1;
      for (r = s; r-- !== 0; ) {
        var f = a[r];
        if (!t(e[f], n[f])) return !1;
      }
      return !0;
    }
    return e !== e && n !== n;
  }), fastDeepEqual;
}
var ucs2length, hasRequiredUcs2length;
function requireUcs2length() {
  return hasRequiredUcs2length || (hasRequiredUcs2length = 1, ucs2length = function(e) {
    for (var n = 0, s = e.length, r = 0, a; r < s; )
      n++, a = e.charCodeAt(r++), a >= 55296 && a <= 56319 && r < s && (a = e.charCodeAt(r), (a & 64512) == 56320 && r++);
    return n;
  }), ucs2length;
}
var util$1, hasRequiredUtil$1;
function requireUtil$1() {
  if (hasRequiredUtil$1) return util$1;
  hasRequiredUtil$1 = 1, util$1 = {
    copy: t,
    checkDataType: e,
    checkDataTypes: n,
    coerceToTypes: r,
    toHash: a,
    getProperty: h,
    escapeQuotes: g,
    equal: requireFastDeepEqual(),
    ucs2length: requireUcs2length(),
    varOccurences: l,
    varReplace: m,
    schemaHasRules: w,
    schemaHasRulesExcept: R,
    schemaUnknownRules: p,
    toQuotedString: q,
    getPathExpr: c,
    getPath: v,
    getData: I,
    unescapeFragment: $,
    unescapeJsonPointer: V,
    escapeFragment: x,
    escapeJsonPointer: M
  };
  function t(C, z) {
    z = z || {};
    for (var y in C) z[y] = C[y];
    return z;
  }
  function e(C, z, y, D) {
    var ie = D ? " !== " : " === ", de = D ? " || " : " && ", we = D ? "!" : "", be = D ? "" : "!";
    switch (C) {
      case "null":
        return z + ie + "null";
      case "array":
        return we + "Array.isArray(" + z + ")";
      case "object":
        return "(" + we + z + de + "typeof " + z + ie + '"object"' + de + be + "Array.isArray(" + z + "))";
      case "integer":
        return "(typeof " + z + ie + '"number"' + de + be + "(" + z + " % 1)" + de + z + ie + z + (y ? de + we + "isFinite(" + z + ")" : "") + ")";
      case "number":
        return "(typeof " + z + ie + '"' + C + '"' + (y ? de + we + "isFinite(" + z + ")" : "") + ")";
      default:
        return "typeof " + z + ie + '"' + C + '"';
    }
  }
  function n(C, z, y) {
    switch (C.length) {
      case 1:
        return e(C[0], z, y, !0);
      default:
        var D = "", ie = a(C);
        ie.array && ie.object && (D = ie.null ? "(" : "(!" + z + " || ", D += "typeof " + z + ' !== "object")', delete ie.null, delete ie.array, delete ie.object), ie.number && delete ie.integer;
        for (var de in ie)
          D += (D ? " && " : "") + e(de, z, y, !0);
        return D;
    }
  }
  var s = a(["string", "number", "integer", "boolean", "null"]);
  function r(C, z) {
    if (Array.isArray(z)) {
      for (var y = [], D = 0; D < z.length; D++) {
        var ie = z[D];
        (s[ie] || C === "array" && ie === "array") && (y[y.length] = ie);
      }
      if (y.length) return y;
    } else {
      if (s[z])
        return [z];
      if (C === "array" && z === "array")
        return ["array"];
    }
  }
  function a(C) {
    for (var z = {}, y = 0; y < C.length; y++) z[C[y]] = !0;
    return z;
  }
  var f = /^[a-z$_][a-z$_0-9]*$/i, u = /'|\\/g;
  function h(C) {
    return typeof C == "number" ? "[" + C + "]" : f.test(C) ? "." + C : "['" + g(C) + "']";
  }
  function g(C) {
    return C.replace(u, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
  }
  function l(C, z) {
    z += "[^0-9]";
    var y = C.match(new RegExp(z, "g"));
    return y ? y.length : 0;
  }
  function m(C, z, y) {
    return z += "([^0-9])", y = y.replace(/\$/g, "$$$$"), C.replace(new RegExp(z, "g"), y + "$1");
  }
  function w(C, z) {
    if (typeof C == "boolean") return !C;
    for (var y in C) if (z[y]) return !0;
  }
  function R(C, z, y) {
    if (typeof C == "boolean") return !C && y != "not";
    for (var D in C) if (D != y && z[D]) return !0;
  }
  function p(C, z) {
    if (typeof C != "boolean") {
      for (var y in C) if (!z[y]) return y;
    }
  }
  function q(C) {
    return "'" + g(C) + "'";
  }
  function c(C, z, y, D) {
    var ie = y ? "'/' + " + z + (D ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : D ? "'[' + " + z + " + ']'" : "'[\\'' + " + z + " + '\\']'";
    return A(C, ie);
  }
  function v(C, z, y) {
    var D = q(y ? "/" + M(z) : h(z));
    return A(C, D);
  }
  var P = /^\/(?:[^~]|~0|~1)*$/, E = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function I(C, z, y) {
    var D, ie, de, we;
    if (C === "") return "rootData";
    if (C[0] == "/") {
      if (!P.test(C)) throw new Error("Invalid JSON-pointer: " + C);
      ie = C, de = "rootData";
    } else {
      if (we = C.match(E), !we) throw new Error("Invalid JSON-pointer: " + C);
      if (D = +we[1], ie = we[2], ie == "#") {
        if (D >= z) throw new Error("Cannot access property/index " + D + " levels up, current level is " + z);
        return y[z - D];
      }
      if (D > z) throw new Error("Cannot access data " + D + " levels up, current level is " + z);
      if (de = "data" + (z - D || ""), !ie) return de;
    }
    for (var be = de, ce = ie.split("/"), fe = 0; fe < ce.length; fe++) {
      var j = ce[fe];
      j && (de += h(V(j)), be += " && " + de);
    }
    return be;
  }
  function A(C, z) {
    return C == '""' ? z : (C + " + " + z).replace(/([^\\])' \+ '/g, "$1");
  }
  function $(C) {
    return V(decodeURIComponent(C));
  }
  function x(C) {
    return encodeURIComponent(M(C));
  }
  function M(C) {
    return C.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function V(C) {
    return C.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  return util$1;
}
var schema_obj, hasRequiredSchema_obj;
function requireSchema_obj() {
  if (hasRequiredSchema_obj) return schema_obj;
  hasRequiredSchema_obj = 1;
  var t = requireUtil$1();
  schema_obj = e;
  function e(n) {
    t.copy(n, this);
  }
  return schema_obj;
}
var jsonSchemaTraverse = { exports: {} }, hasRequiredJsonSchemaTraverse;
function requireJsonSchemaTraverse() {
  if (hasRequiredJsonSchemaTraverse) return jsonSchemaTraverse.exports;
  hasRequiredJsonSchemaTraverse = 1;
  var t = jsonSchemaTraverse.exports = function(s, r, a) {
    typeof r == "function" && (a = r, r = {}), a = r.cb || a;
    var f = typeof a == "function" ? a : a.pre || function() {
    }, u = a.post || function() {
    };
    e(r, f, u, s, "", s);
  };
  t.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0
  }, t.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, t.propsKeywords = {
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, t.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(s, r, a, f, u, h, g, l, m, w) {
    if (f && typeof f == "object" && !Array.isArray(f)) {
      r(f, u, h, g, l, m, w);
      for (var R in f) {
        var p = f[R];
        if (Array.isArray(p)) {
          if (R in t.arrayKeywords)
            for (var q = 0; q < p.length; q++)
              e(s, r, a, p[q], u + "/" + R + "/" + q, h, u, R, f, q);
        } else if (R in t.propsKeywords) {
          if (p && typeof p == "object")
            for (var c in p)
              e(s, r, a, p[c], u + "/" + R + "/" + n(c), h, u, R, f, c);
        } else (R in t.keywords || s.allKeys && !(R in t.skipKeywords)) && e(s, r, a, p, u + "/" + R, h, u, R, f);
      }
      a(f, u, h, g, l, m, w);
    }
  }
  function n(s) {
    return s.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return jsonSchemaTraverse.exports;
}
var resolve_1, hasRequiredResolve;
function requireResolve() {
  if (hasRequiredResolve) return resolve_1;
  hasRequiredResolve = 1;
  var t = requireUri_all(), e = requireFastDeepEqual(), n = requireUtil$1(), s = requireSchema_obj(), r = requireJsonSchemaTraverse();
  resolve_1 = a, a.normalizeId = v, a.fullPath = p, a.url = P, a.ids = E, a.inlineRef = m, a.schema = f;
  function a(I, A, $) {
    var x = this._refs[$];
    if (typeof x == "string")
      if (this._refs[x]) x = this._refs[x];
      else return a.call(this, I, A, x);
    if (x = x || this._schemas[$], x instanceof s)
      return m(x.schema, this._opts.inlineRefs) ? x.schema : x.validate || this._compile(x);
    var M = f.call(this, A, $), V, C, z;
    return M && (V = M.schema, A = M.root, z = M.baseId), V instanceof s ? C = V.validate || I.call(this, V.schema, A, void 0, z) : V !== void 0 && (C = m(V, this._opts.inlineRefs) ? V : I.call(this, V, A, void 0, z)), C;
  }
  function f(I, A) {
    var $ = t.parse(A), x = q($), M = p(this._getId(I.schema));
    if (Object.keys(I.schema).length === 0 || x !== M) {
      var V = v(x), C = this._refs[V];
      if (typeof C == "string")
        return u.call(this, I, C, $);
      if (C instanceof s)
        C.validate || this._compile(C), I = C;
      else if (C = this._schemas[V], C instanceof s) {
        if (C.validate || this._compile(C), V == v(A))
          return { schema: C, root: I, baseId: M };
        I = C;
      } else
        return;
      if (!I.schema) return;
      M = p(this._getId(I.schema));
    }
    return g.call(this, $, M, I.schema, I);
  }
  function u(I, A, $) {
    var x = f.call(this, I, A);
    if (x) {
      var M = x.schema, V = x.baseId;
      I = x.root;
      var C = this._getId(M);
      return C && (V = P(V, C)), g.call(this, $, V, M, I);
    }
  }
  var h = n.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function g(I, A, $, x) {
    if (I.fragment = I.fragment || "", I.fragment.slice(0, 1) == "/") {
      for (var M = I.fragment.split("/"), V = 1; V < M.length; V++) {
        var C = M[V];
        if (C) {
          if (C = n.unescapeFragment(C), $ = $[C], $ === void 0) break;
          var z;
          if (!h[C] && (z = this._getId($), z && (A = P(A, z)), $.$ref)) {
            var y = P(A, $.$ref), D = f.call(this, x, y);
            D && ($ = D.schema, x = D.root, A = D.baseId);
          }
        }
      }
      if ($ !== void 0 && $ !== x.schema)
        return { schema: $, root: x, baseId: A };
    }
  }
  var l = n.toHash([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum"
  ]);
  function m(I, A) {
    if (A === !1) return !1;
    if (A === void 0 || A === !0) return w(I);
    if (A) return R(I) <= A;
  }
  function w(I) {
    var A;
    if (Array.isArray(I)) {
      for (var $ = 0; $ < I.length; $++)
        if (A = I[$], typeof A == "object" && !w(A)) return !1;
    } else
      for (var x in I)
        if (x == "$ref" || (A = I[x], typeof A == "object" && !w(A))) return !1;
    return !0;
  }
  function R(I) {
    var A = 0, $;
    if (Array.isArray(I)) {
      for (var x = 0; x < I.length; x++)
        if ($ = I[x], typeof $ == "object" && (A += R($)), A == 1 / 0) return 1 / 0;
    } else
      for (var M in I) {
        if (M == "$ref") return 1 / 0;
        if (l[M])
          A++;
        else if ($ = I[M], typeof $ == "object" && (A += R($) + 1), A == 1 / 0) return 1 / 0;
      }
    return A;
  }
  function p(I, A) {
    A !== !1 && (I = v(I));
    var $ = t.parse(I);
    return q($);
  }
  function q(I) {
    return t.serialize(I).split("#")[0] + "#";
  }
  var c = /#\/?$/;
  function v(I) {
    return I ? I.replace(c, "") : "";
  }
  function P(I, A) {
    return A = v(A), t.resolve(I, A);
  }
  function E(I) {
    var A = v(this._getId(I)), $ = { "": A }, x = { "": p(A, !1) }, M = {}, V = this;
    return r(I, { allKeys: !0 }, function(C, z, y, D, ie, de, we) {
      if (z !== "") {
        var be = V._getId(C), ce = $[D], fe = x[D] + "/" + ie;
        if (we !== void 0 && (fe += "/" + (typeof we == "number" ? we : n.escapeFragment(we))), typeof be == "string") {
          be = ce = v(ce ? t.resolve(ce, be) : be);
          var j = V._refs[be];
          if (typeof j == "string" && (j = V._refs[j]), j && j.schema) {
            if (!e(C, j.schema))
              throw new Error('id "' + be + '" resolves to more than one schema');
          } else if (be != v(fe))
            if (be[0] == "#") {
              if (M[be] && !e(C, M[be]))
                throw new Error('id "' + be + '" resolves to more than one schema');
              M[be] = C;
            } else
              V._refs[be] = fe;
        }
        $[z] = ce, x[z] = fe;
      }
    }), M;
  }
  return resolve_1;
}
var error_classes, hasRequiredError_classes;
function requireError_classes() {
  if (hasRequiredError_classes) return error_classes;
  hasRequiredError_classes = 1;
  var t = requireResolve();
  error_classes = {
    Validation: s(e),
    MissingRef: s(n)
  };
  function e(r) {
    this.message = "validation failed", this.errors = r, this.ajv = this.validation = !0;
  }
  n.message = function(r, a) {
    return "can't resolve reference " + a + " from id " + r;
  };
  function n(r, a, f) {
    this.message = f || n.message(r, a), this.missingRef = t.url(r, a), this.missingSchema = t.normalizeId(t.fullPath(this.missingRef));
  }
  function s(r) {
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
  }
  return error_classes;
}
var fastJsonStableStringify, hasRequiredFastJsonStableStringify;
function requireFastJsonStableStringify() {
  return hasRequiredFastJsonStableStringify || (hasRequiredFastJsonStableStringify = 1, fastJsonStableStringify = function(t, e) {
    e || (e = {}), typeof e == "function" && (e = { cmp: e });
    var n = typeof e.cycles == "boolean" ? e.cycles : !1, s = e.cmp && /* @__PURE__ */ (function(a) {
      return function(f) {
        return function(u, h) {
          var g = { key: u, value: f[u] }, l = { key: h, value: f[h] };
          return a(g, l);
        };
      };
    })(e.cmp), r = [];
    return (function a(f) {
      if (f && f.toJSON && typeof f.toJSON == "function" && (f = f.toJSON()), f !== void 0) {
        if (typeof f == "number") return isFinite(f) ? "" + f : "null";
        if (typeof f != "object") return JSON.stringify(f);
        var u, h;
        if (Array.isArray(f)) {
          for (h = "[", u = 0; u < f.length; u++)
            u && (h += ","), h += a(f[u]) || "null";
          return h + "]";
        }
        if (f === null) return "null";
        if (r.indexOf(f) !== -1) {
          if (n) return JSON.stringify("__cycle__");
          throw new TypeError("Converting circular structure to JSON");
        }
        var g = r.push(f) - 1, l = Object.keys(f).sort(s && s(f));
        for (h = "", u = 0; u < l.length; u++) {
          var m = l[u], w = a(f[m]);
          w && (h && (h += ","), h += JSON.stringify(m) + ":" + w);
        }
        return r.splice(g, 1), "{" + h + "}";
      }
    })(t);
  }), fastJsonStableStringify;
}
var validate, hasRequiredValidate;
function requireValidate() {
  return hasRequiredValidate || (hasRequiredValidate = 1, validate = function(e, n, s) {
    var r = "", a = e.schema.$async === !0, f = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), u = e.self._getId(e.schema);
    if (e.opts.strictKeywords) {
      var h = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
      if (h) {
        var g = "unknown keyword: " + h;
        if (e.opts.strictKeywords === "log") e.logger.warn(g);
        else throw new Error(g);
      }
    }
    if (e.isTop && (r += " var validate = ", a && (e.async = !0, r += "async "), r += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", u && (e.opts.sourceCode || e.opts.processCode) && (r += " " + ("/*# sourceURL=" + u + " */") + " ")), typeof e.schema == "boolean" || !(f || e.schema.$ref)) {
      var n = "false schema", l = e.level, m = e.dataLevel, w = e.schema[n], R = e.schemaPath + e.util.getProperty(n), p = e.errSchemaPath + "/" + n, A = !e.opts.allErrors, M, q = "data" + (m || ""), I = "valid" + l;
      if (e.schema === !1) {
        e.isTop ? A = !0 : r += " var " + I + " = false; ";
        var c = c || [];
        c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'boolean schema is false' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
        var v = r;
        r = c.pop(), !e.compositeRule && A ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else
        e.isTop ? a ? r += " return data; " : r += " validate.errors = null; return true; " : r += " var " + I + " = true; ";
      return e.isTop && (r += " }; return validate; "), r;
    }
    if (e.isTop) {
      var P = e.isTop, l = e.level = 0, m = e.dataLevel = 0, q = "data";
      if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
        var E = "default is ignored in the schema root";
        if (e.opts.strictDefaults === "log") e.logger.warn(E);
        else throw new Error(E);
      }
      r += " var vErrors = null; ", r += " var errors = 0;     ", r += " if (rootData === undefined) rootData = data; ";
    } else {
      var l = e.level, m = e.dataLevel, q = "data" + (m || "");
      if (u && (e.baseId = e.resolve.url(e.baseId, u)), a && !e.async) throw new Error("async schema in sync schema");
      r += " var errs_" + l + " = errors;";
    }
    var I = "valid" + l, A = !e.opts.allErrors, $ = "", x = "", M, V = e.schema.type, C = Array.isArray(V);
    if (V && e.opts.nullable && e.schema.nullable === !0 && (C ? V.indexOf("null") == -1 && (V = V.concat("null")) : V != "null" && (V = [V, "null"], C = !0)), C && V.length == 1 && (V = V[0], C = !1), e.schema.$ref && f) {
      if (e.opts.extendRefs == "fail")
        throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
      e.opts.extendRefs !== !0 && (f = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
    }
    if (e.schema.$comment && e.opts.$comment && (r += " " + e.RULES.all.$comment.code(e, "$comment")), V) {
      if (e.opts.coerceTypes)
        var z = e.util.coerceToTypes(e.opts.coerceTypes, V);
      var y = e.RULES.types[V];
      if (z || C || y === !0 || y && !te(y)) {
        var R = e.schemaPath + ".type", p = e.errSchemaPath + "/type", R = e.schemaPath + ".type", p = e.errSchemaPath + "/type", D = C ? "checkDataTypes" : "checkDataType";
        if (r += " if (" + e.util[D](V, q, e.opts.strictNumbers, !0) + ") { ", z) {
          var ie = "dataType" + l, de = "coerced" + l;
          r += " var " + ie + " = typeof " + q + "; var " + de + " = undefined; ", e.opts.coerceTypes == "array" && (r += " if (" + ie + " == 'object' && Array.isArray(" + q + ") && " + q + ".length == 1) { " + q + " = " + q + "[0]; " + ie + " = typeof " + q + "; if (" + e.util.checkDataType(e.schema.type, q, e.opts.strictNumbers) + ") " + de + " = " + q + "; } "), r += " if (" + de + " !== undefined) ; ";
          var we = z;
          if (we)
            for (var be, ce = -1, fe = we.length - 1; ce < fe; )
              be = we[ce += 1], be == "string" ? r += " else if (" + ie + " == 'number' || " + ie + " == 'boolean') " + de + " = '' + " + q + "; else if (" + q + " === null) " + de + " = ''; " : be == "number" || be == "integer" ? (r += " else if (" + ie + " == 'boolean' || " + q + " === null || (" + ie + " == 'string' && " + q + " && " + q + " == +" + q + " ", be == "integer" && (r += " && !(" + q + " % 1)"), r += ")) " + de + " = +" + q + "; ") : be == "boolean" ? r += " else if (" + q + " === 'false' || " + q + " === 0 || " + q + " === null) " + de + " = false; else if (" + q + " === 'true' || " + q + " === 1) " + de + " = true; " : be == "null" ? r += " else if (" + q + " === '' || " + q + " === 0 || " + q + " === false) " + de + " = null; " : e.opts.coerceTypes == "array" && be == "array" && (r += " else if (" + ie + " == 'string' || " + ie + " == 'number' || " + ie + " == 'boolean' || " + q + " == null) " + de + " = [" + q + "]; ");
          r += " else {   ";
          var c = c || [];
          c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
          var v = r;
          r = c.pop(), !e.compositeRule && A ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } if (" + de + " !== undefined) {  ";
          var j = m ? "data" + (m - 1 || "") : "parentData", pe = m ? e.dataPathArr[m] : "parentDataProperty";
          r += " " + q + " = " + de + "; ", m || (r += "if (" + j + " !== undefined)"), r += " " + j + "[" + pe + "] = " + de + "; } ";
        } else {
          var c = c || [];
          c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
          var v = r;
          r = c.pop(), !e.compositeRule && A ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        r += " } ";
      }
    }
    if (e.schema.$ref && !f)
      r += " " + e.RULES.all.$ref.code(e, "$ref") + " ", A && (r += " } if (errors === ", P ? r += "0" : r += "errs_" + l, r += ") { ", x += "}");
    else {
      var ee = e.RULES;
      if (ee) {
        for (var y, X = -1, G = ee.length - 1; X < G; )
          if (y = ee[X += 1], te(y)) {
            if (y.type && (r += " if (" + e.util.checkDataType(y.type, q, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
              if (y.type == "object" && e.schema.properties) {
                var w = e.schema.properties, le = Object.keys(w), O = le;
                if (O)
                  for (var B, N = -1, re = O.length - 1; N < re; ) {
                    B = O[N += 1];
                    var ne = w[B];
                    if (ne.default !== void 0) {
                      var F = q + e.util.getProperty(B);
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var E = "default is ignored for: " + F;
                          if (e.opts.strictDefaults === "log") e.logger.warn(E);
                          else throw new Error(E);
                        }
                      } else
                        r += " if (" + F + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + F + " === null || " + F + " === '' "), r += " ) " + F + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(ne.default) + " " : r += " " + JSON.stringify(ne.default) + " ", r += "; ";
                    }
                  }
              } else if (y.type == "array" && Array.isArray(e.schema.items)) {
                var L = e.schema.items;
                if (L) {
                  for (var ne, ce = -1, H = L.length - 1; ce < H; )
                    if (ne = L[ce += 1], ne.default !== void 0) {
                      var F = q + "[" + ce + "]";
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var E = "default is ignored for: " + F;
                          if (e.opts.strictDefaults === "log") e.logger.warn(E);
                          else throw new Error(E);
                        }
                      } else
                        r += " if (" + F + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + F + " === null || " + F + " === '' "), r += " ) " + F + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(ne.default) + " " : r += " " + JSON.stringify(ne.default) + " ", r += "; ";
                    }
                }
              }
            }
            var se = y.rules;
            if (se) {
              for (var Ee, Re = -1, Pe = se.length - 1; Re < Pe; )
                if (Ee = se[Re += 1], $e(Ee)) {
                  var Oe = Ee.code(e, Ee.keyword, y.type);
                  Oe && (r += " " + Oe + " ", A && ($ += "}"));
                }
            }
            if (A && (r += " " + $ + " ", $ = ""), y.type && (r += " } ", V && V === y.type && !z)) {
              r += " else { ";
              var R = e.schemaPath + ".type", p = e.errSchemaPath + "/type", c = c || [];
              c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
              var v = r;
              r = c.pop(), !e.compositeRule && A ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ";
            }
            A && (r += " if (errors === ", P ? r += "0" : r += "errs_" + l, r += ") { ", x += "}");
          }
      }
    }
    A && (r += " " + x + " "), P ? (a ? (r += " if (errors === 0) return data;           ", r += " else throw new ValidationError(vErrors); ") : (r += " validate.errors = vErrors; ", r += " return errors === 0;       "), r += " }; return validate;") : r += " var " + I + " = errors === errs_" + l + ";";
    function te(Te) {
      for (var Ue = Te.rules, ge = 0; ge < Ue.length; ge++)
        if ($e(Ue[ge])) return !0;
    }
    function $e(Te) {
      return e.schema[Te.keyword] !== void 0 || Te.implements && Ce(Te);
    }
    function Ce(Te) {
      for (var Ue = Te.implements, ge = 0; ge < Ue.length; ge++)
        if (e.schema[Ue[ge]] !== void 0) return !0;
    }
    return r;
  }), validate;
}
var compile_1, hasRequiredCompile;
function requireCompile() {
  if (hasRequiredCompile) return compile_1;
  hasRequiredCompile = 1;
  var t = requireResolve(), e = requireUtil$1(), n = requireError_classes(), s = requireFastJsonStableStringify(), r = requireValidate(), a = e.ucs2length, f = requireFastDeepEqual(), u = n.Validation;
  compile_1 = h;
  function h(c, v, P, E) {
    var I = this, A = this._opts, $ = [void 0], x = {}, M = [], V = {}, C = [], z = {}, y = [];
    function D(ne, F) {
      var L = A.regExp ? "regExp" : "new RegExp";
      return "var pattern" + ne + " = " + L + "(" + e.toQuotedString(F[ne]) + ");";
    }
    v = v || { schema: c, refVal: $, refs: x };
    var ie = g.call(this, c, v, E), de = this._compilations[ie.index];
    if (ie.compiling) return de.callValidate = j;
    var we = this._formats, be = this.RULES;
    try {
      var ce = pe(c, v, P, E);
      de.validate = ce;
      var fe = de.callValidate;
      return fe && (fe.schema = ce.schema, fe.errors = null, fe.refs = ce.refs, fe.refVal = ce.refVal, fe.root = ce.root, fe.$async = ce.$async, A.sourceCode && (fe.source = ce.source)), ce;
    } finally {
      l.call(this, c, v, E);
    }
    function j() {
      var ne = de.validate, F = ne.apply(this, arguments);
      return j.errors = ne.errors, F;
    }
    function pe(ne, F, L, H) {
      var se = !F || F && F.schema == ne;
      if (F.schema != v.schema)
        return h.call(I, ne, F, L, H);
      var Ee = ne.$async === !0, Re = r({
        isTop: !0,
        schema: ne,
        isRoot: se,
        baseId: H,
        root: F,
        schemaPath: "",
        errSchemaPath: "#",
        errorPath: '""',
        MissingRefError: n.MissingRef,
        RULES: be,
        validate: r,
        util: e,
        resolve: t,
        resolveRef: ee,
        usePattern: B,
        useDefault: N,
        useCustomRule: re,
        opts: A,
        formats: we,
        logger: I.logger,
        self: I
      });
      Re = q($, R) + q(M, D) + q(C, w) + q(y, p) + Re, A.processCode && (Re = A.processCode(Re, ne));
      var Pe;
      try {
        var Oe = new Function(
          "self",
          "RULES",
          "formats",
          "root",
          "refVal",
          "defaults",
          "customRules",
          "equal",
          "ucs2length",
          "ValidationError",
          "regExp",
          Re
        );
        Pe = Oe(
          I,
          be,
          we,
          v,
          $,
          C,
          y,
          f,
          a,
          u,
          A.regExp
        ), $[0] = Pe;
      } catch (te) {
        throw I.logger.error("Error compiling schema, function code:", Re), te;
      }
      return Pe.schema = ne, Pe.errors = null, Pe.refs = x, Pe.refVal = $, Pe.root = se ? Pe : F, Ee && (Pe.$async = !0), A.sourceCode === !0 && (Pe.source = {
        code: Re,
        patterns: M,
        defaults: C
      }), Pe;
    }
    function ee(ne, F, L) {
      F = t.url(ne, F);
      var H = x[F], se, Ee;
      if (H !== void 0)
        return se = $[H], Ee = "refVal[" + H + "]", O(se, Ee);
      if (!L && v.refs) {
        var Re = v.refs[F];
        if (Re !== void 0)
          return se = v.refVal[Re], Ee = X(F, se), O(se, Ee);
      }
      Ee = X(F);
      var Pe = t.call(I, pe, v, F);
      if (Pe === void 0) {
        var Oe = P && P[F];
        Oe && (Pe = t.inlineRef(Oe, A.inlineRefs) ? Oe : h.call(I, Oe, v, P, ne));
      }
      if (Pe === void 0)
        G(F);
      else
        return le(F, Pe), O(Pe, Ee);
    }
    function X(ne, F) {
      var L = $.length;
      return $[L] = F, x[ne] = L, "refVal" + L;
    }
    function G(ne) {
      delete x[ne];
    }
    function le(ne, F) {
      var L = x[ne];
      $[L] = F;
    }
    function O(ne, F) {
      return typeof ne == "object" || typeof ne == "boolean" ? { code: F, schema: ne, inline: !0 } : { code: F, $async: ne && !!ne.$async };
    }
    function B(ne) {
      var F = V[ne];
      return F === void 0 && (F = V[ne] = M.length, M[F] = ne), "pattern" + F;
    }
    function N(ne) {
      switch (typeof ne) {
        case "boolean":
        case "number":
          return "" + ne;
        case "string":
          return e.toQuotedString(ne);
        case "object":
          if (ne === null) return "null";
          var F = s(ne), L = z[F];
          return L === void 0 && (L = z[F] = C.length, C[L] = ne), "default" + L;
      }
    }
    function re(ne, F, L, H) {
      if (I._opts.validateSchema !== !1) {
        var se = ne.definition.dependencies;
        if (se && !se.every(function(Ue) {
          return Object.prototype.hasOwnProperty.call(L, Ue);
        }))
          throw new Error("parent schema must have all required keywords: " + se.join(","));
        var Ee = ne.definition.validateSchema;
        if (Ee) {
          var Re = Ee(F);
          if (!Re) {
            var Pe = "keyword schema is invalid: " + I.errorsText(Ee.errors);
            if (I._opts.validateSchema == "log") I.logger.error(Pe);
            else throw new Error(Pe);
          }
        }
      }
      var Oe = ne.definition.compile, te = ne.definition.inline, $e = ne.definition.macro, Ce;
      if (Oe)
        Ce = Oe.call(I, F, L, H);
      else if ($e)
        Ce = $e.call(I, F, L, H), A.validateSchema !== !1 && I.validateSchema(Ce, !0);
      else if (te)
        Ce = te.call(I, H, ne.keyword, F, L);
      else if (Ce = ne.definition.validate, !Ce) return;
      if (Ce === void 0)
        throw new Error('custom keyword "' + ne.keyword + '"failed to compile');
      var Te = y.length;
      return y[Te] = Ce, {
        code: "customRule" + Te,
        validate: Ce
      };
    }
  }
  function g(c, v, P) {
    var E = m.call(this, c, v, P);
    return E >= 0 ? { index: E, compiling: !0 } : (E = this._compilations.length, this._compilations[E] = {
      schema: c,
      root: v,
      baseId: P
    }, { index: E, compiling: !1 });
  }
  function l(c, v, P) {
    var E = m.call(this, c, v, P);
    E >= 0 && this._compilations.splice(E, 1);
  }
  function m(c, v, P) {
    for (var E = 0; E < this._compilations.length; E++) {
      var I = this._compilations[E];
      if (I.schema == c && I.root == v && I.baseId == P) return E;
    }
    return -1;
  }
  function w(c) {
    return "var default" + c + " = defaults[" + c + "];";
  }
  function R(c, v) {
    return v[c] === void 0 ? "" : "var refVal" + c + " = refVal[" + c + "];";
  }
  function p(c) {
    return "var customRule" + c + " = customRules[" + c + "];";
  }
  function q(c, v) {
    if (!c.length) return "";
    for (var P = "", E = 0; E < c.length; E++)
      P += v(E, c);
    return P;
  }
  return compile_1;
}
var cache = { exports: {} }, hasRequiredCache;
function requireCache() {
  if (hasRequiredCache) return cache.exports;
  hasRequiredCache = 1;
  var t = cache.exports = function() {
    this._cache = {};
  };
  return t.prototype.put = function(n, s) {
    this._cache[n] = s;
  }, t.prototype.get = function(n) {
    return this._cache[n];
  }, t.prototype.del = function(n) {
    delete this._cache[n];
  }, t.prototype.clear = function() {
    this._cache = {};
  }, cache.exports;
}
var formats_1, hasRequiredFormats;
function requireFormats() {
  if (hasRequiredFormats) return formats_1;
  hasRequiredFormats = 1;
  var t = requireUtil$1(), e = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, n = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], s = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, r = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, a = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, f = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, u = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, h = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, g = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, l = /^(?:\/(?:[^~/]|~0|~1)*)*$/, m = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, w = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
  formats_1 = R;
  function R(x) {
    return x = x == "full" ? "full" : "fast", t.copy(R[x]);
  }
  R.fast = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
    "date-time": /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    "uri-template": u,
    url: h,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    hostname: r,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: $,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: g,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": l,
    "json-pointer-uri-fragment": m,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": w
  }, R.full = {
    date: q,
    time: c,
    "date-time": P,
    uri: I,
    "uri-reference": f,
    "uri-template": u,
    url: h,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: r,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: $,
    uuid: g,
    "json-pointer": l,
    "json-pointer-uri-fragment": m,
    "relative-json-pointer": w
  };
  function p(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  function q(x) {
    var M = x.match(e);
    if (!M) return !1;
    var V = +M[1], C = +M[2], z = +M[3];
    return C >= 1 && C <= 12 && z >= 1 && z <= (C == 2 && p(V) ? 29 : n[C]);
  }
  function c(x, M) {
    var V = x.match(s);
    if (!V) return !1;
    var C = V[1], z = V[2], y = V[3], D = V[5];
    return (C <= 23 && z <= 59 && y <= 59 || C == 23 && z == 59 && y == 60) && (!M || D);
  }
  var v = /t|\s/i;
  function P(x) {
    var M = x.split(v);
    return M.length == 2 && q(M[0]) && c(M[1], !0);
  }
  var E = /\/|:/;
  function I(x) {
    return E.test(x) && a.test(x);
  }
  var A = /[^\\]\\Z/;
  function $(x) {
    if (A.test(x)) return !1;
    try {
      return new RegExp(x), !0;
    } catch {
      return !1;
    }
  }
  return formats_1;
}
var ref, hasRequiredRef;
function requireRef() {
  return hasRequiredRef || (hasRequiredRef = 1, ref = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.errSchemaPath + "/" + n, g = !e.opts.allErrors, l = "data" + (f || ""), m = "valid" + a, w, R;
    if (u == "#" || u == "#/")
      e.isRoot ? (w = e.async, R = "validate") : (w = e.root.schema.$async === !0, R = "root.refVal[0]");
    else {
      var p = e.resolveRef(e.baseId, u, e.isRoot);
      if (p === void 0) {
        var q = e.MissingRefError.message(e.baseId, u);
        if (e.opts.missingRefs == "fail") {
          e.logger.error(q);
          var c = c || [];
          c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { ref: '" + e.util.escapeQuotes(u) + "' } ", e.opts.messages !== !1 && (r += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(u) + "' "), e.opts.verbose && (r += " , schema: " + e.util.toQuotedString(u) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + l + " "), r += " } ") : r += " {} ";
          var v = r;
          r = c.pop(), !e.compositeRule && g ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", g && (r += " if (false) { ");
        } else if (e.opts.missingRefs == "ignore")
          e.logger.warn(q), g && (r += " if (true) { ");
        else
          throw new e.MissingRefError(e.baseId, u, q);
      } else if (p.inline) {
        var P = e.util.copy(e);
        P.level++;
        var E = "valid" + P.level;
        P.schema = p.schema, P.schemaPath = "", P.errSchemaPath = u;
        var I = e.validate(P).replace(/validate\.schema/g, p.code);
        r += " " + I + " ", g && (r += " if (" + E + ") { ");
      } else
        w = p.$async === !0 || e.async && p.$async !== !1, R = p.code;
    }
    if (R) {
      var c = c || [];
      c.push(r), r = "", e.opts.passContext ? r += " " + R + ".call(this, " : r += " " + R + "( ", r += " " + l + ", (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var A = f ? "data" + (f - 1 || "") : "parentData", $ = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + A + " , " + $ + ", rootData)  ";
      var x = r;
      if (r = c.pop(), w) {
        if (!e.async) throw new Error("async schema referenced by sync schema");
        g && (r += " var " + m + "; "), r += " try { await " + x + "; ", g && (r += " " + m + " = true; "), r += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", g && (r += " " + m + " = false; "), r += " } ", g && (r += " if (" + m + ") { ");
      } else
        r += " if (!" + x + ") { if (vErrors === null) vErrors = " + R + ".errors; else vErrors = vErrors.concat(" + R + ".errors); errors = vErrors.length; } ", g && (r += " else { ");
    }
    return r;
  }), ref;
}
var allOf, hasRequiredAllOf;
function requireAllOf() {
  return hasRequiredAllOf || (hasRequiredAllOf = 1, allOf = function(e, n, s) {
    var r = " ", a = e.schema[n], f = e.schemaPath + e.util.getProperty(n), u = e.errSchemaPath + "/" + n, h = !e.opts.allErrors, g = e.util.copy(e), l = "";
    g.level++;
    var m = "valid" + g.level, w = g.baseId, R = !0, p = a;
    if (p)
      for (var q, c = -1, v = p.length - 1; c < v; )
        q = p[c += 1], (e.opts.strictKeywords ? typeof q == "object" && Object.keys(q).length > 0 || q === !1 : e.util.schemaHasRules(q, e.RULES.all)) && (R = !1, g.schema = q, g.schemaPath = f + "[" + c + "]", g.errSchemaPath = u + "/" + c, r += "  " + e.validate(g) + " ", g.baseId = w, h && (r += " if (" + m + ") { ", l += "}"));
    return h && (R ? r += " if (true) { " : r += " " + l.slice(0, -1) + " "), r;
  }), allOf;
}
var anyOf, hasRequiredAnyOf;
function requireAnyOf() {
  return hasRequiredAnyOf || (hasRequiredAnyOf = 1, anyOf = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, p = e.util.copy(e), q = "";
    p.level++;
    var c = "valid" + p.level, v = u.every(function(M) {
      return e.opts.strictKeywords ? typeof M == "object" && Object.keys(M).length > 0 || M === !1 : e.util.schemaHasRules(M, e.RULES.all);
    });
    if (v) {
      var P = p.baseId;
      r += " var " + R + " = errors; var " + w + " = false;  ";
      var E = e.compositeRule;
      e.compositeRule = p.compositeRule = !0;
      var I = u;
      if (I)
        for (var A, $ = -1, x = I.length - 1; $ < x; )
          A = I[$ += 1], p.schema = A, p.schemaPath = h + "[" + $ + "]", p.errSchemaPath = g + "/" + $, r += "  " + e.validate(p) + " ", p.baseId = P, r += " " + w + " = " + w + " || " + c + "; if (!" + w + ") { ", q += "}";
      e.compositeRule = p.compositeRule = E, r += " " + q + " if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && l && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " } else {  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      l && (r += " if (true) { ");
    return r;
  }), anyOf;
}
var comment, hasRequiredComment;
function requireComment() {
  return hasRequiredComment || (hasRequiredComment = 1, comment = function(e, n, s) {
    var r = " ", a = e.schema[n], f = e.errSchemaPath + "/" + n;
    e.opts.allErrors;
    var u = e.util.toQuotedString(a);
    return e.opts.$comment === !0 ? r += " console.log(" + u + ");" : typeof e.opts.$comment == "function" && (r += " self._opts.$comment(" + u + ", " + e.util.toQuotedString(f) + ", validate.root.schema);"), r;
  }), comment;
}
var _const, hasRequired_const;
function require_const() {
  return hasRequired_const || (hasRequired_const = 1, _const = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && u && u.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; "), R || (r += " var schema" + a + " = validate.schema" + h + ";"), r += "var " + w + " = equal(" + m + ", schema" + a + "); if (!" + w + ") {   ";
    var p = p || [];
    p.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { allowedValue: schema" + a + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to constant' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var q = r;
    return r = p.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + q + "]); " : r += " validate.errors = [" + q + "]; return false; " : r += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", l && (r += " else { "), r;
  }), _const;
}
var contains, hasRequiredContains;
function requireContains() {
  return hasRequiredContains || (hasRequiredContains = 1, contains = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, p = e.util.copy(e), q = "";
    p.level++;
    var c = "valid" + p.level, v = "i" + a, P = p.dataLevel = e.dataLevel + 1, E = "data" + P, I = e.baseId, A = e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all);
    if (r += "var " + R + " = errors;var " + w + ";", A) {
      var $ = e.compositeRule;
      e.compositeRule = p.compositeRule = !0, p.schema = u, p.schemaPath = h, p.errSchemaPath = g, r += " var " + c + " = false; for (var " + v + " = 0; " + v + " < " + m + ".length; " + v + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
      var x = m + "[" + v + "]";
      p.dataPathArr[P] = v;
      var M = e.validate(p);
      p.baseId = I, e.util.varOccurences(M, E) < 2 ? r += " " + e.util.varReplace(M, E, x) + " " : r += " var " + E + " = " + x + "; " + M + " ", r += " if (" + c + ") break; }  ", e.compositeRule = p.compositeRule = $, r += " " + q + " if (!" + c + ") {";
    } else
      r += " if (" + m + ".length == 0) {";
    var V = V || [];
    V.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should contain a valid item' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var C = r;
    return r = V.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + C + "]); " : r += " validate.errors = [" + C + "]; return false; " : r += " var err = " + C + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ", A && (r += "  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; } "), e.opts.allErrors && (r += " } "), r;
  }), contains;
}
var dependencies, hasRequiredDependencies;
function requireDependencies() {
  return hasRequiredDependencies || (hasRequiredDependencies = 1, dependencies = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), p = "";
    R.level++;
    var q = "valid" + R.level, c = {}, v = {}, P = e.opts.ownProperties;
    for ($ in u)
      if ($ != "__proto__") {
        var E = u[$], I = Array.isArray(E) ? v : c;
        I[$] = E;
      }
    r += "var " + w + " = errors;";
    var A = e.errorPath;
    r += "var missing" + a + ";";
    for (var $ in v)
      if (I = v[$], I.length) {
        if (r += " if ( " + m + e.util.getProperty($) + " !== undefined ", P && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), l) {
          r += " && ( ";
          var x = I;
          if (x)
            for (var M, V = -1, C = x.length - 1; V < C; ) {
              M = x[V += 1], V && (r += " || ");
              var z = e.util.getProperty(M), y = m + z;
              r += " ( ( " + y + " === undefined ", P && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") && (missing" + a + " = " + e.util.toQuotedString(e.opts.jsonPointers ? M : z) + ") ) ";
            }
          r += ")) {  ";
          var D = "missing" + a, ie = "' + " + D + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(A, D, !0) : A + " + " + D);
          var de = de || [];
          de.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var we = r;
          r = de.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + we + "]); " : r += " validate.errors = [" + we + "]; return false; " : r += " var err = " + we + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        } else {
          r += " ) { ";
          var be = I;
          if (be)
            for (var M, ce = -1, fe = be.length - 1; ce < fe; ) {
              M = be[ce += 1];
              var z = e.util.getProperty(M), ie = e.util.escapeQuotes(M), y = m + z;
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(A, M, e.opts.jsonPointers)), r += " if ( " + y + " === undefined ", P && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
            }
        }
        r += " }   ", l && (p += "}", r += " else { ");
      }
    e.errorPath = A;
    var j = R.baseId;
    for (var $ in c) {
      var E = c[$];
      (e.opts.strictKeywords ? typeof E == "object" && Object.keys(E).length > 0 || E === !1 : e.util.schemaHasRules(E, e.RULES.all)) && (r += " " + q + " = true; if ( " + m + e.util.getProperty($) + " !== undefined ", P && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), r += ") { ", R.schema = E, R.schemaPath = h + e.util.getProperty($), R.errSchemaPath = g + "/" + e.util.escapeFragment($), r += "  " + e.validate(R) + " ", R.baseId = j, r += " }  ", l && (r += " if (" + q + ") { ", p += "}"));
    }
    return l && (r += "   " + p + " if (" + w + " == errors) {"), r;
  }), dependencies;
}
var _enum, hasRequired_enum;
function require_enum() {
  return hasRequired_enum || (hasRequired_enum = 1, _enum = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && u && u.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ");
    var p = "i" + a, q = "schema" + a;
    R || (r += " var " + q + " = validate.schema" + h + ";"), r += "var " + w + ";", R && (r += " if (schema" + a + " === undefined) " + w + " = true; else if (!Array.isArray(schema" + a + ")) " + w + " = false; else {"), r += "" + w + " = false;for (var " + p + "=0; " + p + "<" + q + ".length; " + p + "++) if (equal(" + m + ", " + q + "[" + p + "])) { " + w + " = true; break; }", R && (r += "  }  "), r += " if (!" + w + ") {   ";
    var c = c || [];
    c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { allowedValues: schema" + a + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = c.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", l && (r += " else { "), r;
  }), _enum;
}
var format, hasRequiredFormat;
function requireFormat() {
  return hasRequiredFormat || (hasRequiredFormat = 1, format = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || "");
    if (e.opts.format === !1)
      return l && (r += " if (true) { "), r;
    var w = e.opts.$data && u && u.$data, R;
    w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u;
    var p = e.opts.unknownFormats, q = Array.isArray(p);
    if (w) {
      var c = "format" + a, v = "isObject" + a, P = "formatType" + a;
      r += " var " + c + " = formats[" + R + "]; var " + v + " = typeof " + c + " == 'object' && !(" + c + " instanceof RegExp) && " + c + ".validate; var " + P + " = " + v + " && " + c + ".type || 'string'; if (" + v + ") { ", e.async && (r += " var async" + a + " = " + c + ".async; "), r += " " + c + " = " + c + ".validate; } if (  ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'string') || "), r += " (", p != "ignore" && (r += " (" + R + " && !" + c + " ", q && (r += " && self._opts.unknownFormats.indexOf(" + R + ") == -1 "), r += ") || "), r += " (" + c + " && " + P + " == '" + s + "' && !(typeof " + c + " == 'function' ? ", e.async ? r += " (async" + a + " ? await " + c + "(" + m + ") : " + c + "(" + m + ")) " : r += " " + c + "(" + m + ") ", r += " : " + c + ".test(" + m + "))))) {";
    } else {
      var c = e.formats[u];
      if (!c) {
        if (p == "ignore")
          return e.logger.warn('unknown format "' + u + '" ignored in schema at path "' + e.errSchemaPath + '"'), l && (r += " if (true) { "), r;
        if (q && p.indexOf(u) >= 0)
          return l && (r += " if (true) { "), r;
        throw new Error('unknown format "' + u + '" is used in schema at path "' + e.errSchemaPath + '"');
      }
      var v = typeof c == "object" && !(c instanceof RegExp) && c.validate, P = v && c.type || "string";
      if (v) {
        var E = c.async === !0;
        c = c.validate;
      }
      if (P != s)
        return l && (r += " if (true) { "), r;
      if (E) {
        if (!e.async) throw new Error("async format in sync schema");
        var I = "formats" + e.util.getProperty(u) + ".validate";
        r += " if (!(await " + I + "(" + m + "))) { ";
      } else {
        r += " if (! ";
        var I = "formats" + e.util.getProperty(u);
        v && (I += ".validate"), typeof c == "function" ? r += " " + I + "(" + m + ") " : r += " " + I + ".test(" + m + ") ", r += ") { ";
      }
    }
    var A = A || [];
    A.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { format:  ", w ? r += "" + R : r += "" + e.util.toQuotedString(u), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match format "`, w ? r += "' + " + R + " + '" : r += "" + e.util.escapeQuotes(u), r += `"' `), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + e.util.toQuotedString(u), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var $ = r;
    return r = A.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + $ + "]); " : r += " validate.errors = [" + $ + "]; return false; " : r += " var err = " + $ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", l && (r += " else { "), r;
  }), format;
}
var _if, hasRequired_if;
function require_if() {
  return hasRequired_if || (hasRequired_if = 1, _if = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, p = e.util.copy(e);
    p.level++;
    var q = "valid" + p.level, c = e.schema.then, v = e.schema.else, P = c !== void 0 && (e.opts.strictKeywords ? typeof c == "object" && Object.keys(c).length > 0 || c === !1 : e.util.schemaHasRules(c, e.RULES.all)), E = v !== void 0 && (e.opts.strictKeywords ? typeof v == "object" && Object.keys(v).length > 0 || v === !1 : e.util.schemaHasRules(v, e.RULES.all)), I = p.baseId;
    if (P || E) {
      var A;
      p.createErrors = !1, p.schema = u, p.schemaPath = h, p.errSchemaPath = g, r += " var " + R + " = errors; var " + w + " = true;  ";
      var $ = e.compositeRule;
      e.compositeRule = p.compositeRule = !0, r += "  " + e.validate(p) + " ", p.baseId = I, p.createErrors = !0, r += "  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; }  ", e.compositeRule = p.compositeRule = $, P ? (r += " if (" + q + ") {  ", p.schema = e.schema.then, p.schemaPath = e.schemaPath + ".then", p.errSchemaPath = e.errSchemaPath + "/then", r += "  " + e.validate(p) + " ", p.baseId = I, r += " " + w + " = " + q + "; ", P && E ? (A = "ifClause" + a, r += " var " + A + " = 'then'; ") : A = "'then'", r += " } ", E && (r += " else { ")) : r += " if (!" + q + ") { ", E && (p.schema = e.schema.else, p.schemaPath = e.schemaPath + ".else", p.errSchemaPath = e.errSchemaPath + "/else", r += "  " + e.validate(p) + " ", p.baseId = I, r += " " + w + " = " + q + "; ", P && E ? (A = "ifClause" + a, r += " var " + A + " = 'else'; ") : A = "'else'", r += " } "), r += " if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { failingKeyword: " + A + " } ", e.opts.messages !== !1 && (r += ` , message: 'should match "' + ` + A + ` + '" schema' `), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && l && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " }   ", l && (r += " else { ");
    } else
      l && (r += " if (true) { ");
    return r;
  }), _if;
}
var items, hasRequiredItems;
function requireItems() {
  return hasRequiredItems || (hasRequiredItems = 1, items = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, p = e.util.copy(e), q = "";
    p.level++;
    var c = "valid" + p.level, v = "i" + a, P = p.dataLevel = e.dataLevel + 1, E = "data" + P, I = e.baseId;
    if (r += "var " + R + " = errors;var " + w + ";", Array.isArray(u)) {
      var A = e.schema.additionalItems;
      if (A === !1) {
        r += " " + w + " = " + m + ".length <= " + u.length + "; ";
        var $ = g;
        g = e.errSchemaPath + "/additionalItems", r += "  if (!" + w + ") {   ";
        var x = x || [];
        x.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { limit: " + u.length + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have more than " + u.length + " items' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
        var M = r;
        r = x.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + M + "]); " : r += " validate.errors = [" + M + "]; return false; " : r += " var err = " + M + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", g = $, l && (q += "}", r += " else { ");
      }
      var V = u;
      if (V) {
        for (var C, z = -1, y = V.length - 1; z < y; )
          if (C = V[z += 1], e.opts.strictKeywords ? typeof C == "object" && Object.keys(C).length > 0 || C === !1 : e.util.schemaHasRules(C, e.RULES.all)) {
            r += " " + c + " = true; if (" + m + ".length > " + z + ") { ";
            var D = m + "[" + z + "]";
            p.schema = C, p.schemaPath = h + "[" + z + "]", p.errSchemaPath = g + "/" + z, p.errorPath = e.util.getPathExpr(e.errorPath, z, e.opts.jsonPointers, !0), p.dataPathArr[P] = z;
            var ie = e.validate(p);
            p.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", r += " }  ", l && (r += " if (" + c + ") { ", q += "}");
          }
      }
      if (typeof A == "object" && (e.opts.strictKeywords ? typeof A == "object" && Object.keys(A).length > 0 || A === !1 : e.util.schemaHasRules(A, e.RULES.all))) {
        p.schema = A, p.schemaPath = e.schemaPath + ".additionalItems", p.errSchemaPath = e.errSchemaPath + "/additionalItems", r += " " + c + " = true; if (" + m + ".length > " + u.length + ") {  for (var " + v + " = " + u.length + "; " + v + " < " + m + ".length; " + v + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
        var D = m + "[" + v + "]";
        p.dataPathArr[P] = v;
        var ie = e.validate(p);
        p.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", l && (r += " if (!" + c + ") break; "), r += " } }  ", l && (r += " if (" + c + ") { ", q += "}");
      }
    } else if (e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      p.schema = u, p.schemaPath = h, p.errSchemaPath = g, r += "  for (var " + v + " = 0; " + v + " < " + m + ".length; " + v + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
      var D = m + "[" + v + "]";
      p.dataPathArr[P] = v;
      var ie = e.validate(p);
      p.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", l && (r += " if (!" + c + ") break; "), r += " }";
    }
    return l && (r += " " + q + " if (" + R + " == errors) {"), r;
  }), items;
}
var _limit, hasRequired_limit;
function require_limit() {
  return hasRequired_limit || (hasRequired_limit = 1, _limit = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, I, m = "data" + (f || ""), w = e.opts.$data && u && u.$data, R;
    w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u;
    var p = n == "maximum", q = p ? "exclusiveMaximum" : "exclusiveMinimum", c = e.schema[q], v = e.opts.$data && c && c.$data, P = p ? "<" : ">", E = p ? ">" : "<", I = void 0;
    if (!(w || typeof u == "number" || u === void 0))
      throw new Error(n + " must be number");
    if (!(v || c === void 0 || typeof c == "number" || typeof c == "boolean"))
      throw new Error(q + " must be number or boolean");
    if (v) {
      var A = e.util.getData(c.$data, f, e.dataPathArr), $ = "exclusive" + a, x = "exclType" + a, M = "exclIsNumber" + a, V = "op" + a, C = "' + " + V + " + '";
      r += " var schemaExcl" + a + " = " + A + "; ", A = "schemaExcl" + a, r += " var " + $ + "; var " + x + " = typeof " + A + "; if (" + x + " != 'boolean' && " + x + " != 'undefined' && " + x + " != 'number') { ";
      var I = q, z = z || [];
      z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: '" + q + " should be boolean' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var y = r;
      r = z.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + x + " == 'number' ? ( (" + $ + " = " + R + " === undefined || " + A + " " + P + "= " + R + ") ? " + m + " " + E + "= " + A + " : " + m + " " + E + " " + R + " ) : ( (" + $ + " = " + A + " === true) ? " + m + " " + E + "= " + R + " : " + m + " " + E + " " + R + " ) || " + m + " !== " + m + ") { var op" + a + " = " + $ + " ? '" + P + "' : '" + P + "='; ", u === void 0 && (I = q, g = e.errSchemaPath + "/" + q, R = A, w = v);
    } else {
      var M = typeof c == "number", C = P;
      if (M && w) {
        var V = "'" + C + "'";
        r += " if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " ( " + R + " === undefined || " + c + " " + P + "= " + R + " ? " + m + " " + E + "= " + c + " : " + m + " " + E + " " + R + " ) || " + m + " !== " + m + ") { ";
      } else {
        M && u === void 0 ? ($ = !0, I = q, g = e.errSchemaPath + "/" + q, R = c, E += "=") : (M && (R = Math[p ? "min" : "max"](c, u)), c === (M ? R : !0) ? ($ = !0, I = q, g = e.errSchemaPath + "/" + q, E += "=") : ($ = !1, C += "="));
        var V = "'" + C + "'";
        r += " if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + m + " " + E + " " + R + " || " + m + " !== " + m + ") { ";
      }
    }
    I = I || n;
    var z = z || [];
    z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { comparison: " + V + ", limit: " + R + ", exclusive: " + $ + " } ", e.opts.messages !== !1 && (r += " , message: 'should be " + C + " ", w ? r += "' + " + R : r += "" + R + "'"), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = z.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", l && (r += " else { "), r;
  }), _limit;
}
var _limitItems, hasRequired_limitItems;
function require_limitItems() {
  return hasRequired_limitItems || (hasRequired_limitItems = 1, _limitItems = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && u && u.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u, !(w || typeof u == "number"))
      throw new Error(n + " must be number");
    var p = n == "maxItems" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + m + ".length " + p + " " + R + ") { ";
    var q = n, c = c || [];
    c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", n == "maxItems" ? r += "more" : r += "fewer", r += " than ", w ? r += "' + " + R + " + '" : r += "" + u, r += " items' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = c.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", l && (r += " else { "), r;
  }), _limitItems;
}
var _limitLength, hasRequired_limitLength;
function require_limitLength() {
  return hasRequired_limitLength || (hasRequired_limitLength = 1, _limitLength = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && u && u.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u, !(w || typeof u == "number"))
      throw new Error(n + " must be number");
    var p = n == "maxLength" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), e.opts.unicode === !1 ? r += " " + m + ".length " : r += " ucs2length(" + m + ") ", r += " " + p + " " + R + ") { ";
    var q = n, c = c || [];
    c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT be ", n == "maxLength" ? r += "longer" : r += "shorter", r += " than ", w ? r += "' + " + R + " + '" : r += "" + u, r += " characters' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = c.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", l && (r += " else { "), r;
  }), _limitLength;
}
var _limitProperties, hasRequired_limitProperties;
function require_limitProperties() {
  return hasRequired_limitProperties || (hasRequired_limitProperties = 1, _limitProperties = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && u && u.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u, !(w || typeof u == "number"))
      throw new Error(n + " must be number");
    var p = n == "maxProperties" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " Object.keys(" + m + ").length " + p + " " + R + ") { ";
    var q = n, c = c || [];
    c.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", n == "maxProperties" ? r += "more" : r += "fewer", r += " than ", w ? r += "' + " + R + " + '" : r += "" + u, r += " properties' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = c.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", l && (r += " else { "), r;
  }), _limitProperties;
}
var multipleOf, hasRequiredMultipleOf;
function requireMultipleOf() {
  return hasRequiredMultipleOf || (hasRequiredMultipleOf = 1, multipleOf = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = e.opts.$data && u && u.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = u, !(w || typeof u == "number"))
      throw new Error(n + " must be number");
    r += "var division" + a + ";if (", w && (r += " " + R + " !== undefined && ( typeof " + R + " != 'number' || "), r += " (division" + a + " = " + m + " / " + R + ", ", e.opts.multipleOfPrecision ? r += " Math.abs(Math.round(division" + a + ") - division" + a + ") > 1e-" + e.opts.multipleOfPrecision + " " : r += " division" + a + " !== parseInt(division" + a + ") ", r += " ) ", w && (r += "  )  "), r += " ) {   ";
    var p = p || [];
    p.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { multipleOf: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should be multiple of ", w ? r += "' + " + R : r += "" + R + "'"), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var q = r;
    return r = p.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + q + "]); " : r += " validate.errors = [" + q + "]; return false; " : r += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", l && (r += " else { "), r;
  }), multipleOf;
}
var not, hasRequiredNot;
function requireNot() {
  return hasRequiredNot || (hasRequiredNot = 1, not = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e);
    R.level++;
    var p = "valid" + R.level;
    if (e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      R.schema = u, R.schemaPath = h, R.errSchemaPath = g, r += " var " + w + " = errors;  ";
      var q = e.compositeRule;
      e.compositeRule = R.compositeRule = !0, R.createErrors = !1;
      var c;
      R.opts.allErrors && (c = R.opts.allErrors, R.opts.allErrors = !1), r += " " + e.validate(R) + " ", R.createErrors = !0, c && (R.opts.allErrors = c), e.compositeRule = R.compositeRule = q, r += " if (" + p + ") {   ";
      var v = v || [];
      v.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var P = r;
      r = v.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + P + "]); " : r += " validate.errors = [" + P + "]; return false; " : r += " var err = " + P + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else {  errors = " + w + "; if (vErrors !== null) { if (" + w + ") vErrors.length = " + w + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      r += "  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", l && (r += " if (false) { ");
    return r;
  }), not;
}
var oneOf, hasRequiredOneOf;
function requireOneOf() {
  return hasRequiredOneOf || (hasRequiredOneOf = 1, oneOf = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, p = e.util.copy(e), q = "";
    p.level++;
    var c = "valid" + p.level, v = p.baseId, P = "prevValid" + a, E = "passingSchemas" + a;
    r += "var " + R + " = errors , " + P + " = false , " + w + " = false , " + E + " = null; ";
    var I = e.compositeRule;
    e.compositeRule = p.compositeRule = !0;
    var A = u;
    if (A)
      for (var $, x = -1, M = A.length - 1; x < M; )
        $ = A[x += 1], (e.opts.strictKeywords ? typeof $ == "object" && Object.keys($).length > 0 || $ === !1 : e.util.schemaHasRules($, e.RULES.all)) ? (p.schema = $, p.schemaPath = h + "[" + x + "]", p.errSchemaPath = g + "/" + x, r += "  " + e.validate(p) + " ", p.baseId = v) : r += " var " + c + " = true; ", x && (r += " if (" + c + " && " + P + ") { " + w + " = false; " + E + " = [" + E + ", " + x + "]; } else { ", q += "}"), r += " if (" + c + ") { " + w + " = " + P + " = true; " + E + " = " + x + "; }";
    return e.compositeRule = p.compositeRule = I, r += "" + q + "if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { passingSchemas: " + E + " } ", e.opts.messages !== !1 && (r += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && l && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += "} else {  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; }", e.opts.allErrors && (r += " } "), r;
  }), oneOf;
}
var pattern, hasRequiredPattern;
function requirePattern() {
  return hasRequiredPattern || (hasRequiredPattern = 1, pattern = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && u && u.$data, p;
    R ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", p = "schema" + a) : p = u;
    var q = e.opts.regExp ? "regExp" : "new RegExp";
    if (R)
      r += " var " + w + " = true; try { " + w + " = " + q + "(" + p + ").test(" + m + "); } catch(e) { " + w + " = false; } if ( ", R && (r += " (" + p + " !== undefined && typeof " + p + " != 'string') || "), r += " !" + w + ") {";
    else {
      var c = e.usePattern(u);
      r += " if ( ", R && (r += " (" + p + " !== undefined && typeof " + p + " != 'string') || "), r += " !" + c + ".test(" + m + ") ) {";
    }
    var v = v || [];
    v.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { pattern:  ", R ? r += "" + p : r += "" + e.util.toQuotedString(u), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match pattern "`, R ? r += "' + " + p + " + '" : r += "" + e.util.escapeQuotes(u), r += `"' `), e.opts.verbose && (r += " , schema:  ", R ? r += "validate.schema" + h : r += "" + e.util.toQuotedString(u), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var P = r;
    return r = v.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + P + "]); " : r += " validate.errors = [" + P + "]; return false; " : r += " var err = " + P + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", l && (r += " else { "), r;
  }), pattern;
}
var properties$3, hasRequiredProperties;
function requireProperties() {
  return hasRequiredProperties || (hasRequiredProperties = 1, properties$3 = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), p = "";
    R.level++;
    var q = "valid" + R.level, c = "key" + a, v = "idx" + a, P = R.dataLevel = e.dataLevel + 1, E = "data" + P, I = "dataProperties" + a, A = Object.keys(u || {}).filter(ce), $ = e.schema.patternProperties || {}, x = Object.keys($).filter(ce), M = e.schema.additionalProperties, V = A.length || x.length, C = M === !1, z = typeof M == "object" && Object.keys(M).length, y = e.opts.removeAdditional, D = C || z || y, ie = e.opts.ownProperties, de = e.baseId, we = e.schema.required;
    if (we && !(e.opts.$data && we.$data) && we.length < e.opts.loopRequired)
      var be = e.util.toHash(we);
    function ce(Me) {
      return Me !== "__proto__";
    }
    if (r += "var " + w + " = errors;var " + q + " = true;", ie && (r += " var " + I + " = undefined;"), D) {
      if (ie ? r += " " + I + " = " + I + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + I + ".length; " + v + "++) { var " + c + " = " + I + "[" + v + "]; " : r += " for (var " + c + " in " + m + ") { ", V) {
        if (r += " var isAdditional" + a + " = !(false ", A.length)
          if (A.length > 8)
            r += " || validate.schema" + h + ".hasOwnProperty(" + c + ") ";
          else {
            var fe = A;
            if (fe)
              for (var j, pe = -1, ee = fe.length - 1; pe < ee; )
                j = fe[pe += 1], r += " || " + c + " == " + e.util.toQuotedString(j) + " ";
          }
        if (x.length) {
          var X = x;
          if (X)
            for (var G, le = -1, O = X.length - 1; le < O; )
              G = X[le += 1], r += " || " + e.usePattern(G) + ".test(" + c + ") ";
        }
        r += " ); if (isAdditional" + a + ") { ";
      }
      if (y == "all")
        r += " delete " + m + "[" + c + "]; ";
      else {
        var B = e.errorPath, N = "' + " + c + " + '";
        if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, c, e.opts.jsonPointers)), C)
          if (y)
            r += " delete " + m + "[" + c + "]; ";
          else {
            r += " " + q + " = false; ";
            var re = g;
            g = e.errSchemaPath + "/additionalProperties";
            var ne = ne || [];
            ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { additionalProperty: '" + N + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is an invalid additional property" : r += "should NOT have additional properties", r += "' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
            var F = r;
            r = ne.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + F + "]); " : r += " validate.errors = [" + F + "]; return false; " : r += " var err = " + F + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", g = re, l && (r += " break; ");
          }
        else if (z)
          if (y == "failing") {
            r += " var " + w + " = errors;  ";
            var L = e.compositeRule;
            e.compositeRule = R.compositeRule = !0, R.schema = M, R.schemaPath = e.schemaPath + ".additionalProperties", R.errSchemaPath = e.errSchemaPath + "/additionalProperties", R.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, c, e.opts.jsonPointers);
            var H = m + "[" + c + "]";
            R.dataPathArr[P] = c;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", r += " if (!" + q + ") { errors = " + w + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + m + "[" + c + "]; }  ", e.compositeRule = R.compositeRule = L;
          } else {
            R.schema = M, R.schemaPath = e.schemaPath + ".additionalProperties", R.errSchemaPath = e.errSchemaPath + "/additionalProperties", R.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, c, e.opts.jsonPointers);
            var H = m + "[" + c + "]";
            R.dataPathArr[P] = c;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", l && (r += " if (!" + q + ") break; ");
          }
        e.errorPath = B;
      }
      V && (r += " } "), r += " }  ", l && (r += " if (" + q + ") { ", p += "}");
    }
    var Ee = e.opts.useDefaults && !e.compositeRule;
    if (A.length) {
      var Re = A;
      if (Re)
        for (var j, Pe = -1, Oe = Re.length - 1; Pe < Oe; ) {
          j = Re[Pe += 1];
          var te = u[j];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            var $e = e.util.getProperty(j), H = m + $e, Ce = Ee && te.default !== void 0;
            R.schema = te, R.schemaPath = h + $e, R.errSchemaPath = g + "/" + e.util.escapeFragment(j), R.errorPath = e.util.getPath(e.errorPath, j, e.opts.jsonPointers), R.dataPathArr[P] = e.util.toQuotedString(j);
            var se = e.validate(R);
            if (R.baseId = de, e.util.varOccurences(se, E) < 2) {
              se = e.util.varReplace(se, E, H);
              var Te = H;
            } else {
              var Te = E;
              r += " var " + E + " = " + H + "; ";
            }
            if (Ce)
              r += " " + se + " ";
            else {
              if (be && be[j]) {
                r += " if ( " + Te + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(j) + "') "), r += ") { " + q + " = false; ";
                var B = e.errorPath, re = g, Ue = e.util.escapeQuotes(j);
                e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(B, j, e.opts.jsonPointers)), g = e.errSchemaPath + "/required";
                var ne = ne || [];
                ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + Ue + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + Ue + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
                var F = r;
                r = ne.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + F + "]); " : r += " validate.errors = [" + F + "]; return false; " : r += " var err = " + F + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", g = re, e.errorPath = B, r += " } else { ";
              } else
                l ? (r += " if ( " + Te + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(j) + "') "), r += ") { " + q + " = true; } else { ") : (r += " if (" + Te + " !== undefined ", ie && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(j) + "') "), r += " ) { ");
              r += " " + se + " } ";
            }
          }
          l && (r += " if (" + q + ") { ", p += "}");
        }
    }
    if (x.length) {
      var ge = x;
      if (ge)
        for (var G, Se = -1, Le = ge.length - 1; Se < Le; ) {
          G = ge[Se += 1];
          var te = $[G];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            R.schema = te, R.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(G), R.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(G), ie ? r += " " + I + " = " + I + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + I + ".length; " + v + "++) { var " + c + " = " + I + "[" + v + "]; " : r += " for (var " + c + " in " + m + ") { ", r += " if (" + e.usePattern(G) + ".test(" + c + ")) { ", R.errorPath = e.util.getPathExpr(e.errorPath, c, e.opts.jsonPointers);
            var H = m + "[" + c + "]";
            R.dataPathArr[P] = c;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", l && (r += " if (!" + q + ") break; "), r += " } ", l && (r += " else " + q + " = true; "), r += " }  ", l && (r += " if (" + q + ") { ", p += "}");
          }
        }
    }
    return l && (r += " " + p + " if (" + w + " == errors) {"), r;
  }), properties$3;
}
var propertyNames, hasRequiredPropertyNames;
function requirePropertyNames() {
  return hasRequiredPropertyNames || (hasRequiredPropertyNames = 1, propertyNames = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), p = "";
    R.level++;
    var q = "valid" + R.level;
    if (r += "var " + w + " = errors;", e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      R.schema = u, R.schemaPath = h, R.errSchemaPath = g;
      var c = "key" + a, v = "idx" + a, P = "i" + a, E = "' + " + c + " + '", I = R.dataLevel = e.dataLevel + 1, A = "data" + I, $ = "dataProperties" + a, x = e.opts.ownProperties, M = e.baseId;
      x && (r += " var " + $ + " = undefined; "), x ? r += " " + $ + " = " + $ + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + $ + ".length; " + v + "++) { var " + c + " = " + $ + "[" + v + "]; " : r += " for (var " + c + " in " + m + ") { ", r += " var startErrs" + a + " = errors; ";
      var V = c, C = e.compositeRule;
      e.compositeRule = R.compositeRule = !0;
      var z = e.validate(R);
      R.baseId = M, e.util.varOccurences(z, A) < 2 ? r += " " + e.util.varReplace(z, A, V) + " " : r += " var " + A + " = " + V + "; " + z + " ", e.compositeRule = R.compositeRule = C, r += " if (!" + q + ") { for (var " + P + "=startErrs" + a + "; " + P + "<errors; " + P + "++) { vErrors[" + P + "].propertyName = " + c + "; }   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { propertyName: '" + E + "' } ", e.opts.messages !== !1 && (r += " , message: 'property name \\'" + E + "\\' is invalid' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && l && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), l && (r += " break; "), r += " } }";
    }
    return l && (r += " " + p + " if (" + w + " == errors) {"), r;
  }), propertyNames;
}
var required$1, hasRequiredRequired;
function requireRequired() {
  return hasRequiredRequired || (hasRequiredRequired = 1, required$1 = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && u && u.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ");
    var p = "schema" + a;
    if (!R)
      if (u.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
        var q = [], c = u;
        if (c)
          for (var v, P = -1, E = c.length - 1; P < E; ) {
            v = c[P += 1];
            var I = e.schema.properties[v];
            I && (e.opts.strictKeywords ? typeof I == "object" && Object.keys(I).length > 0 || I === !1 : e.util.schemaHasRules(I, e.RULES.all)) || (q[q.length] = v);
          }
      } else
        var q = u;
    if (R || q.length) {
      var A = e.errorPath, $ = R || q.length >= e.opts.loopRequired, x = e.opts.ownProperties;
      if (l)
        if (r += " var missing" + a + "; ", $) {
          R || (r += " var " + p + " = validate.schema" + h + "; ");
          var M = "i" + a, V = "schema" + a + "[" + M + "]", C = "' + " + V + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(A, V, e.opts.jsonPointers)), r += " var " + w + " = true; ", R && (r += " if (schema" + a + " === undefined) " + w + " = true; else if (!Array.isArray(schema" + a + ")) " + w + " = false; else {"), r += " for (var " + M + " = 0; " + M + " < " + p + ".length; " + M + "++) { " + w + " = " + m + "[" + p + "[" + M + "]] !== undefined ", x && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", " + p + "[" + M + "]) "), r += "; if (!" + w + ") break; } ", R && (r += "  }  "), r += "  if (!" + w + ") {   ";
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var y = r;
          r = z.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        } else {
          r += " if ( ";
          var D = q;
          if (D)
            for (var ie, M = -1, de = D.length - 1; M < de; ) {
              ie = D[M += 1], M && (r += " || ");
              var we = e.util.getProperty(ie), be = m + we;
              r += " ( ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") && (missing" + a + " = " + e.util.toQuotedString(e.opts.jsonPointers ? ie : we) + ") ) ";
            }
          r += ") {  ";
          var V = "missing" + a, C = "' + " + V + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(A, V, !0) : A + " + " + V);
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var y = r;
          r = z.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        }
      else if ($) {
        R || (r += " var " + p + " = validate.schema" + h + "; ");
        var M = "i" + a, V = "schema" + a + "[" + M + "]", C = "' + " + V + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(A, V, e.opts.jsonPointers)), R && (r += " if (" + p + " && !Array.isArray(" + p + ")) {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + p + " !== undefined) { "), r += " for (var " + M + " = 0; " + M + " < " + p + ".length; " + M + "++) { if (" + m + "[" + p + "[" + M + "]] === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", " + p + "[" + M + "]) "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", R && (r += "  }  ");
      } else {
        var ce = q;
        if (ce)
          for (var ie, fe = -1, j = ce.length - 1; fe < j; ) {
            ie = ce[fe += 1];
            var we = e.util.getProperty(ie), C = e.util.escapeQuotes(ie), be = m + we;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(A, ie, e.opts.jsonPointers)), r += " if ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      e.errorPath = A;
    } else l && (r += " if (true) {");
    return r;
  }), required$1;
}
var uniqueItems, hasRequiredUniqueItems;
function requireUniqueItems() {
  return hasRequiredUniqueItems || (hasRequiredUniqueItems = 1, uniqueItems = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && u && u.$data, p;
    if (R ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", p = "schema" + a) : p = u, (u || R) && e.opts.uniqueItems !== !1) {
      R && (r += " var " + w + "; if (" + p + " === false || " + p + " === undefined) " + w + " = true; else if (typeof " + p + " != 'boolean') " + w + " = false; else { "), r += " var i = " + m + ".length , " + w + " = true , j; if (i > 1) { ";
      var q = e.schema.items && e.schema.items.type, c = Array.isArray(q);
      if (!q || q == "object" || q == "array" || c && (q.indexOf("object") >= 0 || q.indexOf("array") >= 0))
        r += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + m + "[i], " + m + "[j])) { " + w + " = false; break outer; } } } ";
      else {
        r += " var itemIndices = {}, item; for (;i--;) { var item = " + m + "[i]; ";
        var v = "checkDataType" + (c ? "s" : "");
        r += " if (" + e.util[v](q, "item", e.opts.strictNumbers, !0) + ") continue; ", c && (r += ` if (typeof item == 'string') item = '"' + item; `), r += " if (typeof itemIndices[item] == 'number') { " + w + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
      }
      r += " } ", R && (r += "  }  "), r += " if (!" + w + ") {   ";
      var P = P || [];
      P.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (r += " , schema:  ", R ? r += "validate.schema" + h : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var E = r;
      r = P.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", l && (r += " else { ");
    } else
      l && (r += " if (true) { ");
    return r;
  }), uniqueItems;
}
var dotjs, hasRequiredDotjs;
function requireDotjs() {
  return hasRequiredDotjs || (hasRequiredDotjs = 1, dotjs = {
    $ref: requireRef(),
    allOf: requireAllOf(),
    anyOf: requireAnyOf(),
    $comment: requireComment(),
    const: require_const(),
    contains: requireContains(),
    dependencies: requireDependencies(),
    enum: require_enum(),
    format: requireFormat(),
    if: require_if(),
    items: requireItems(),
    maximum: require_limit(),
    minimum: require_limit(),
    maxItems: require_limitItems(),
    minItems: require_limitItems(),
    maxLength: require_limitLength(),
    minLength: require_limitLength(),
    maxProperties: require_limitProperties(),
    minProperties: require_limitProperties(),
    multipleOf: requireMultipleOf(),
    not: requireNot(),
    oneOf: requireOneOf(),
    pattern: requirePattern(),
    properties: requireProperties(),
    propertyNames: requirePropertyNames(),
    required: requireRequired(),
    uniqueItems: requireUniqueItems(),
    validate: requireValidate()
  }), dotjs;
}
var rules, hasRequiredRules;
function requireRules() {
  if (hasRequiredRules) return rules;
  hasRequiredRules = 1;
  var t = requireDotjs(), e = requireUtil$1().toHash;
  return rules = function() {
    var s = [
      {
        type: "number",
        rules: [
          { maximum: ["exclusiveMaximum"] },
          { minimum: ["exclusiveMinimum"] },
          "multipleOf",
          "format"
        ]
      },
      {
        type: "string",
        rules: ["maxLength", "minLength", "pattern", "format"]
      },
      {
        type: "array",
        rules: ["maxItems", "minItems", "items", "contains", "uniqueItems"]
      },
      {
        type: "object",
        rules: [
          "maxProperties",
          "minProperties",
          "required",
          "dependencies",
          "propertyNames",
          { properties: ["additionalProperties", "patternProperties"] }
        ]
      },
      { rules: ["$ref", "const", "enum", "not", "anyOf", "oneOf", "allOf", "if"] }
    ], r = ["type", "$comment"], a = [
      "$schema",
      "$id",
      "id",
      "$data",
      "$async",
      "title",
      "description",
      "default",
      "definitions",
      "examples",
      "readOnly",
      "writeOnly",
      "contentMediaType",
      "contentEncoding",
      "additionalItems",
      "then",
      "else"
    ], f = ["number", "integer", "string", "array", "object", "boolean", "null"];
    return s.all = e(r), s.types = e(f), s.forEach(function(u) {
      u.rules = u.rules.map(function(h) {
        var g;
        if (typeof h == "object") {
          var l = Object.keys(h)[0];
          g = h[l], h = l, g.forEach(function(w) {
            r.push(w), s.all[w] = !0;
          });
        }
        r.push(h);
        var m = s.all[h] = {
          keyword: h,
          code: t[h],
          implements: g
        };
        return m;
      }), s.all.$comment = {
        keyword: "$comment",
        code: t.$comment
      }, u.type && (s.types[u.type] = u);
    }), s.keywords = e(r.concat(a)), s.custom = {}, s;
  }, rules;
}
var data, hasRequiredData;
function requireData() {
  if (hasRequiredData) return data;
  hasRequiredData = 1;
  var t = [
    "multipleOf",
    "maximum",
    "exclusiveMaximum",
    "minimum",
    "exclusiveMinimum",
    "maxLength",
    "minLength",
    "pattern",
    "additionalItems",
    "maxItems",
    "minItems",
    "uniqueItems",
    "maxProperties",
    "minProperties",
    "required",
    "additionalProperties",
    "enum",
    "format",
    "const"
  ];
  return data = function(e, n) {
    for (var s = 0; s < n.length; s++) {
      e = JSON.parse(JSON.stringify(e));
      var r = n[s].split("/"), a = e, f;
      for (f = 1; f < r.length; f++)
        a = a[r[f]];
      for (f = 0; f < t.length; f++) {
        var u = t[f], h = a[u];
        h && (a[u] = {
          anyOf: [
            h,
            { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
          ]
        });
      }
    }
    return e;
  }, data;
}
var async, hasRequiredAsync;
function requireAsync() {
  if (hasRequiredAsync) return async;
  hasRequiredAsync = 1;
  var t = requireError_classes().MissingRef;
  async = e;
  function e(n, s, r) {
    var a = this;
    if (typeof this._opts.loadSchema != "function")
      throw new Error("options.loadSchema should be a function");
    typeof s == "function" && (r = s, s = void 0);
    var f = u(n).then(function() {
      var g = a._addSchema(n, void 0, s);
      return g.validate || h(g);
    });
    return r && f.then(
      function(g) {
        r(null, g);
      },
      r
    ), f;
    function u(g) {
      var l = g.$schema;
      return l && !a.getSchema(l) ? e.call(a, { $ref: l }, !0) : Promise.resolve();
    }
    function h(g) {
      try {
        return a._compile(g);
      } catch (m) {
        if (m instanceof t) return l(m);
        throw m;
      }
      function l(m) {
        var w = m.missingSchema;
        if (q(w)) throw new Error("Schema " + w + " is loaded but " + m.missingRef + " cannot be resolved");
        var R = a._loadingSchemas[w];
        return R || (R = a._loadingSchemas[w] = a._opts.loadSchema(w), R.then(p, p)), R.then(function(c) {
          if (!q(w))
            return u(c).then(function() {
              q(w) || a.addSchema(c, w, void 0, s);
            });
        }).then(function() {
          return h(g);
        });
        function p() {
          delete a._loadingSchemas[w];
        }
        function q(c) {
          return a._refs[c] || a._schemas[c];
        }
      }
    }
  }
  return async;
}
var custom, hasRequiredCustom;
function requireCustom() {
  return hasRequiredCustom || (hasRequiredCustom = 1, custom = function(e, n, s) {
    var r = " ", a = e.level, f = e.dataLevel, u = e.schema[n], h = e.schemaPath + e.util.getProperty(n), g = e.errSchemaPath + "/" + n, l = !e.opts.allErrors, m, w = "data" + (f || ""), R = "valid" + a, p = "errs__" + a, q = e.opts.$data && u && u.$data, c;
    q ? (r += " var schema" + a + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", c = "schema" + a) : c = u;
    var v = this, P = "definition" + a, E = v.definition, I = "", A, $, x, M, V;
    if (q && E.$data) {
      V = "keywordValidate" + a;
      var C = E.validateSchema;
      r += " var " + P + " = RULES.custom['" + n + "'].definition; var " + V + " = " + P + ".validate;";
    } else {
      if (M = e.useCustomRule(v, u, e.schema, e), !M) return;
      c = "validate.schema" + h, V = M.code, A = E.compile, $ = E.inline, x = E.macro;
    }
    var z = V + ".errors", y = "i" + a, D = "ruleErr" + a, ie = E.async;
    if (ie && !e.async) throw new Error("async keyword in sync schema");
    if ($ || x || (r += "" + z + " = null;"), r += "var " + p + " = errors;var " + R + ";", q && E.$data && (I += "}", r += " if (" + c + " === undefined) { " + R + " = true; } else { ", C && (I += "}", r += " " + R + " = " + P + ".validateSchema(" + c + "); if (" + R + ") { ")), $)
      E.statements ? r += " " + M.validate + " " : r += " " + R + " = " + M.validate + "; ";
    else if (x) {
      var de = e.util.copy(e), I = "";
      de.level++;
      var we = "valid" + de.level;
      de.schema = M.validate, de.schemaPath = "";
      var be = e.compositeRule;
      e.compositeRule = de.compositeRule = !0;
      var ce = e.validate(de).replace(/validate\.schema/g, V);
      e.compositeRule = de.compositeRule = be, r += " " + ce;
    } else {
      var fe = fe || [];
      fe.push(r), r = "", r += "  " + V + ".call( ", e.opts.passContext ? r += "this" : r += "self", A || E.schema === !1 ? r += " , " + w + " " : r += " , " + c + " , " + w + " , validate.schema" + e.schemaPath + " ", r += " , (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var j = f ? "data" + (f - 1 || "") : "parentData", pe = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + j + " , " + pe + " , rootData )  ";
      var ee = r;
      r = fe.pop(), E.errors === !1 ? (r += " " + R + " = ", ie && (r += "await "), r += "" + ee + "; ") : ie ? (z = "customErrors" + a, r += " var " + z + " = null; try { " + R + " = await " + ee + "; } catch (e) { " + R + " = false; if (e instanceof ValidationError) " + z + " = e.errors; else throw e; } ") : r += " " + z + " = null; " + R + " = " + ee + "; ";
    }
    if (E.modifying && (r += " if (" + j + ") " + w + " = " + j + "[" + pe + "];"), r += "" + I, E.valid)
      l && (r += " if (true) { ");
    else {
      r += " if ( ", E.valid === void 0 ? (r += " !", x ? r += "" + we : r += "" + R) : r += " " + !E.valid + " ", r += ") { ", m = v.keyword;
      var fe = fe || [];
      fe.push(r), r = "";
      var fe = fe || [];
      fe.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { keyword: '" + v.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + v.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
      var X = r;
      r = fe.pop(), !e.compositeRule && l ? e.async ? r += " throw new ValidationError([" + X + "]); " : r += " validate.errors = [" + X + "]; return false; " : r += " var err = " + X + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      var G = r;
      r = fe.pop(), $ ? E.errors ? E.errors != "full" && (r += "  for (var " + y + "=" + p + "; " + y + "<errors; " + y + "++) { var " + D + " = vErrors[" + y + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + D + ".schemaPath === undefined) { " + D + '.schemaPath = "' + g + '"; } ', e.opts.verbose && (r += " " + D + ".schema = " + c + "; " + D + ".data = " + w + "; "), r += " } ") : E.errors === !1 ? r += " " + G + " " : (r += " if (" + p + " == errors) { " + G + " } else {  for (var " + y + "=" + p + "; " + y + "<errors; " + y + "++) { var " + D + " = vErrors[" + y + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + D + ".schemaPath === undefined) { " + D + '.schemaPath = "' + g + '"; } ', e.opts.verbose && (r += " " + D + ".schema = " + c + "; " + D + ".data = " + w + "; "), r += " } } ") : x ? (r += "   var err =   ", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(g) + " , params: { keyword: '" + v.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + v.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + h + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && l && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; ")) : E.errors === !1 ? r += " " + G + " " : (r += " if (Array.isArray(" + z + ")) { if (vErrors === null) vErrors = " + z + "; else vErrors = vErrors.concat(" + z + "); errors = vErrors.length;  for (var " + y + "=" + p + "; " + y + "<errors; " + y + "++) { var " + D + " = vErrors[" + y + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + D + '.schemaPath = "' + g + '";  ', e.opts.verbose && (r += " " + D + ".schema = " + c + "; " + D + ".data = " + w + "; "), r += " } } else { " + G + " } "), r += " } ", l && (r += " else { ");
    }
    return r;
  }), custom;
}
const $schema$1 = "http://json-schema.org/draft-07/schema#", $id$1 = "http://json-schema.org/draft-07/schema#", title$2 = "Core schema meta-schema", definitions$1 = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, type$3 = ["object", "boolean"], properties$2 = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, require$$13 = {
  $schema: $schema$1,
  $id: $id$1,
  title: title$2,
  definitions: definitions$1,
  type: type$3,
  properties: properties$2,
  default: !0
};
var definition_schema, hasRequiredDefinition_schema;
function requireDefinition_schema() {
  if (hasRequiredDefinition_schema) return definition_schema;
  hasRequiredDefinition_schema = 1;
  var t = require$$13;
  return definition_schema = {
    $id: "https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js",
    definitions: {
      simpleTypes: t.definitions.simpleTypes
    },
    type: "object",
    dependencies: {
      schema: ["validate"],
      $data: ["validate"],
      statements: ["inline"],
      valid: { not: { required: ["macro"] } }
    },
    properties: {
      type: t.properties.type,
      schema: { type: "boolean" },
      statements: { type: "boolean" },
      dependencies: {
        type: "array",
        items: { type: "string" }
      },
      metaSchema: { type: "object" },
      modifying: { type: "boolean" },
      valid: { type: "boolean" },
      $data: { type: "boolean" },
      async: { type: "boolean" },
      errors: {
        anyOf: [
          { type: "boolean" },
          { const: "full" }
        ]
      }
    }
  }, definition_schema;
}
var keyword, hasRequiredKeyword;
function requireKeyword() {
  if (hasRequiredKeyword) return keyword;
  hasRequiredKeyword = 1;
  var t = /^[a-z_$][a-z0-9_$-]*$/i, e = requireCustom(), n = requireDefinition_schema();
  keyword = {
    add: s,
    get: r,
    remove: a,
    validate: f
  };
  function s(u, h) {
    var g = this.RULES;
    if (g.keywords[u])
      throw new Error("Keyword " + u + " is already defined");
    if (!t.test(u))
      throw new Error("Keyword " + u + " is not a valid identifier");
    if (h) {
      this.validateKeyword(h, !0);
      var l = h.type;
      if (Array.isArray(l))
        for (var m = 0; m < l.length; m++)
          R(u, l[m], h);
      else
        R(u, l, h);
      var w = h.metaSchema;
      w && (h.$data && this._opts.$data && (w = {
        anyOf: [
          w,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      }), h.validateSchema = this.compile(w, !0));
    }
    g.keywords[u] = g.all[u] = !0;
    function R(p, q, c) {
      for (var v, P = 0; P < g.length; P++) {
        var E = g[P];
        if (E.type == q) {
          v = E;
          break;
        }
      }
      v || (v = { type: q, rules: [] }, g.push(v));
      var I = {
        keyword: p,
        definition: c,
        custom: !0,
        code: e,
        implements: c.implements
      };
      v.rules.push(I), g.custom[p] = I;
    }
    return this;
  }
  function r(u) {
    var h = this.RULES.custom[u];
    return h ? h.definition : this.RULES.keywords[u] || !1;
  }
  function a(u) {
    var h = this.RULES;
    delete h.keywords[u], delete h.all[u], delete h.custom[u];
    for (var g = 0; g < h.length; g++)
      for (var l = h[g].rules, m = 0; m < l.length; m++)
        if (l[m].keyword == u) {
          l.splice(m, 1);
          break;
        }
    return this;
  }
  function f(u, h) {
    f.errors = null;
    var g = this._validateKeyword = this._validateKeyword || this.compile(n, !0);
    if (g(u)) return !0;
    if (f.errors = g.errors, h)
      throw new Error("custom keyword definition is invalid: " + this.errorsText(g.errors));
    return !1;
  }
  return keyword;
}
const $schema = "http://json-schema.org/draft-07/schema#", $id = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", description = "Meta-schema for $data reference (JSON Schema extension proposal)", type$2 = "object", required = ["$data"], properties$1 = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, additionalProperties$1 = !1, require$$12 = {
  $schema,
  $id,
  description,
  type: type$2,
  required,
  properties: properties$1,
  additionalProperties: additionalProperties$1
};
var ajv, hasRequiredAjv;
function requireAjv() {
  if (hasRequiredAjv) return ajv;
  hasRequiredAjv = 1;
  var t = requireCompile(), e = requireResolve(), n = requireCache(), s = requireSchema_obj(), r = requireFastJsonStableStringify(), a = requireFormats(), f = requireRules(), u = requireData(), h = requireUtil$1();
  ajv = p, p.prototype.validate = q, p.prototype.compile = c, p.prototype.addSchema = v, p.prototype.addMetaSchema = P, p.prototype.validateSchema = E, p.prototype.getSchema = A, p.prototype.removeSchema = M, p.prototype.addFormat = be, p.prototype.errorsText = we, p.prototype._addSchema = C, p.prototype._compile = z, p.prototype.compileAsync = requireAsync();
  var g = requireKeyword();
  p.prototype.addKeyword = g.add, p.prototype.getKeyword = g.get, p.prototype.removeKeyword = g.remove, p.prototype.validateKeyword = g.validate;
  var l = requireError_classes();
  p.ValidationError = l.Validation, p.MissingRefError = l.MissingRef, p.$dataMetaSchema = u;
  var m = "http://json-schema.org/draft-07/schema", w = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], R = ["/properties"];
  function p(O) {
    if (!(this instanceof p)) return new p(O);
    O = this._opts = h.copy(O) || {}, G(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = a(O.format), this._cache = O.cache || new n(), this._loadingSchemas = {}, this._compilations = [], this.RULES = f(), this._getId = y(O), O.loopRequired = O.loopRequired || 1 / 0, O.errorDataPath == "property" && (O._errorDataPathProperty = !0), O.serialize === void 0 && (O.serialize = r), this._metaOpts = X(this), O.formats && j(this), O.keywords && pe(this), ce(this), typeof O.meta == "object" && this.addMetaSchema(O.meta), O.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), fe(this);
  }
  function q(O, B) {
    var N;
    if (typeof O == "string") {
      if (N = this.getSchema(O), !N) throw new Error('no schema with key or ref "' + O + '"');
    } else {
      var re = this._addSchema(O);
      N = re.validate || this._compile(re);
    }
    var ne = N(B);
    return N.$async !== !0 && (this.errors = N.errors), ne;
  }
  function c(O, B) {
    var N = this._addSchema(O, void 0, B);
    return N.validate || this._compile(N);
  }
  function v(O, B, N, re) {
    if (Array.isArray(O)) {
      for (var ne = 0; ne < O.length; ne++) this.addSchema(O[ne], void 0, N, re);
      return this;
    }
    var F = this._getId(O);
    if (F !== void 0 && typeof F != "string")
      throw new Error("schema id must be string");
    return B = e.normalizeId(B || F), ee(this, B), this._schemas[B] = this._addSchema(O, N, re, !0), this;
  }
  function P(O, B, N) {
    return this.addSchema(O, B, N, !0), this;
  }
  function E(O, B) {
    var N = O.$schema;
    if (N !== void 0 && typeof N != "string")
      throw new Error("$schema must be a string");
    if (N = N || this._opts.defaultMeta || I(this), !N)
      return this.logger.warn("meta-schema not available"), this.errors = null, !0;
    var re = this.validate(N, O);
    if (!re && B) {
      var ne = "schema is invalid: " + this.errorsText();
      if (this._opts.validateSchema == "log") this.logger.error(ne);
      else throw new Error(ne);
    }
    return re;
  }
  function I(O) {
    var B = O._opts.meta;
    return O._opts.defaultMeta = typeof B == "object" ? O._getId(B) || B : O.getSchema(m) ? m : void 0, O._opts.defaultMeta;
  }
  function A(O) {
    var B = x(this, O);
    switch (typeof B) {
      case "object":
        return B.validate || this._compile(B);
      case "string":
        return this.getSchema(B);
      case "undefined":
        return $(this, O);
    }
  }
  function $(O, B) {
    var N = e.schema.call(O, { schema: {} }, B);
    if (N) {
      var re = N.schema, ne = N.root, F = N.baseId, L = t.call(O, re, ne, void 0, F);
      return O._fragments[B] = new s({
        ref: B,
        fragment: !0,
        schema: re,
        root: ne,
        baseId: F,
        validate: L
      }), L;
    }
  }
  function x(O, B) {
    return B = e.normalizeId(B), O._schemas[B] || O._refs[B] || O._fragments[B];
  }
  function M(O) {
    if (O instanceof RegExp)
      return V(this, this._schemas, O), V(this, this._refs, O), this;
    switch (typeof O) {
      case "undefined":
        return V(this, this._schemas), V(this, this._refs), this._cache.clear(), this;
      case "string":
        var B = x(this, O);
        return B && this._cache.del(B.cacheKey), delete this._schemas[O], delete this._refs[O], this;
      case "object":
        var N = this._opts.serialize, re = N ? N(O) : O;
        this._cache.del(re);
        var ne = this._getId(O);
        ne && (ne = e.normalizeId(ne), delete this._schemas[ne], delete this._refs[ne]);
    }
    return this;
  }
  function V(O, B, N) {
    for (var re in B) {
      var ne = B[re];
      !ne.meta && (!N || N.test(re)) && (O._cache.del(ne.cacheKey), delete B[re]);
    }
  }
  function C(O, B, N, re) {
    if (typeof O != "object" && typeof O != "boolean")
      throw new Error("schema should be object or boolean");
    var ne = this._opts.serialize, F = ne ? ne(O) : O, L = this._cache.get(F);
    if (L) return L;
    re = re || this._opts.addUsedSchema !== !1;
    var H = e.normalizeId(this._getId(O));
    H && re && ee(this, H);
    var se = this._opts.validateSchema !== !1 && !B, Ee;
    se && !(Ee = H && H == e.normalizeId(O.$schema)) && this.validateSchema(O, !0);
    var Re = e.ids.call(this, O), Pe = new s({
      id: H,
      schema: O,
      localRefs: Re,
      cacheKey: F,
      meta: N
    });
    return H[0] != "#" && re && (this._refs[H] = Pe), this._cache.put(F, Pe), se && Ee && this.validateSchema(O, !0), Pe;
  }
  function z(O, B) {
    if (O.compiling)
      return O.validate = ne, ne.schema = O.schema, ne.errors = null, ne.root = B || ne, O.schema.$async === !0 && (ne.$async = !0), ne;
    O.compiling = !0;
    var N;
    O.meta && (N = this._opts, this._opts = this._metaOpts);
    var re;
    try {
      re = t.call(this, O.schema, B, O.localRefs);
    } catch (F) {
      throw delete O.validate, F;
    } finally {
      O.compiling = !1, O.meta && (this._opts = N);
    }
    return O.validate = re, O.refs = re.refs, O.refVal = re.refVal, O.root = re.root, re;
    function ne() {
      var F = O.validate, L = F.apply(this, arguments);
      return ne.errors = F.errors, L;
    }
  }
  function y(O) {
    switch (O.schemaId) {
      case "auto":
        return de;
      case "id":
        return D;
      default:
        return ie;
    }
  }
  function D(O) {
    return O.$id && this.logger.warn("schema $id ignored", O.$id), O.id;
  }
  function ie(O) {
    return O.id && this.logger.warn("schema id ignored", O.id), O.$id;
  }
  function de(O) {
    if (O.$id && O.id && O.$id != O.id)
      throw new Error("schema $id is different from id");
    return O.$id || O.id;
  }
  function we(O, B) {
    if (O = O || this.errors, !O) return "No errors";
    B = B || {};
    for (var N = B.separator === void 0 ? ", " : B.separator, re = B.dataVar === void 0 ? "data" : B.dataVar, ne = "", F = 0; F < O.length; F++) {
      var L = O[F];
      L && (ne += re + L.dataPath + " " + L.message + N);
    }
    return ne.slice(0, -N.length);
  }
  function be(O, B) {
    return typeof B == "string" && (B = new RegExp(B)), this._formats[O] = B, this;
  }
  function ce(O) {
    var B;
    if (O._opts.$data && (B = require$$12, O.addMetaSchema(B, B.$id, !0)), O._opts.meta !== !1) {
      var N = require$$13;
      O._opts.$data && (N = u(N, R)), O.addMetaSchema(N, m, !0), O._refs["http://json-schema.org/schema"] = m;
    }
  }
  function fe(O) {
    var B = O._opts.schemas;
    if (B)
      if (Array.isArray(B)) O.addSchema(B);
      else for (var N in B) O.addSchema(B[N], N);
  }
  function j(O) {
    for (var B in O._opts.formats) {
      var N = O._opts.formats[B];
      O.addFormat(B, N);
    }
  }
  function pe(O) {
    for (var B in O._opts.keywords) {
      var N = O._opts.keywords[B];
      O.addKeyword(B, N);
    }
  }
  function ee(O, B) {
    if (O._schemas[B] || O._refs[B])
      throw new Error('schema with key or id "' + B + '" already exists');
  }
  function X(O) {
    for (var B = h.copy(O._opts), N = 0; N < w.length; N++)
      delete B[w[N]];
    return B;
  }
  function G(O) {
    var B = O._opts.logger;
    if (B === !1)
      O.logger = { log: le, warn: le, error: le };
    else {
      if (B === void 0 && (B = console), !(typeof B == "object" && B.log && B.warn && B.error))
        throw new Error("logger must implement log, warn and error methods");
      O.logger = B;
    }
  }
  function le() {
  }
  return ajv;
}
const title$1 = "definitions", definitions = { contextualizedFieldName: { type: "string", pattern: "^(this\\.)?.+$" }, dataTypeArgsCount: { oneOf: [{ $ref: "#/definitions/contextualizedFieldName" }, { type: "number" }] }, fieldName: { type: "string", pattern: "^[a-zA-Z0-9_]+$" } }, type$1 = "object", require$$2$1 = {
  title: title$1,
  definitions,
  type: type$1
}, title = "protocol", type = "object", properties = { types: { type: "object", patternProperties: { "^[0-9a-zA-Z_]+$": { oneOf: [{ type: "string" }, { type: "array", items: [{ type: "string" }, { oneOf: [{ type: "object" }, { type: "array" }] }] }] } }, additionalProperties: !1 } }, patternProperties = { "^(?!types)[a-zA-Z_]+$": { $ref: "#" } }, additionalProperties = !1, require$$3$1 = {
  title,
  type,
  properties,
  patternProperties,
  additionalProperties
}, i8$3 = { enum: ["i8"] }, u8$1 = { enum: ["u8"] }, i16$3 = { enum: ["i16"] }, u16$2 = { enum: ["u16"] }, i32$3 = { enum: ["i32"] }, u32$1 = { enum: ["u32"] }, f32$3 = { enum: ["f32"] }, f64$3 = { enum: ["f64"] }, li8$1 = { enum: ["li8"] }, lu8$1 = { enum: ["lu8"] }, li16$1 = { enum: ["li16"] }, lu16$1 = { enum: ["lu16"] }, li32$1 = { enum: ["li32"] }, lu32$1 = { enum: ["lu32"] }, lf32$1 = { enum: ["lf32"] }, lf64$1 = { enum: ["lf64"] }, i64$3 = { enum: ["i64"] }, li64$1 = { enum: ["li64"] }, u64$1 = { enum: ["u64"] }, lu64$1 = { enum: ["lu64"] }, varint$2 = { enum: ["varint"] }, varint64$1 = { enum: ["varint64"] }, varint128$1 = { enum: ["varint128"] }, zigzag32$2 = { enum: ["zigzag32"] }, zigzag64$2 = { enum: ["zigzag64"] }, int$1 = { title: "int", type: "array", items: [{ enum: ["int"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, lint$1 = { title: "lint", type: "array", items: [{ enum: ["lint"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, require$$4 = {
  i8: i8$3,
  u8: u8$1,
  i16: i16$3,
  u16: u16$2,
  i32: i32$3,
  u32: u32$1,
  f32: f32$3,
  f64: f64$3,
  li8: li8$1,
  lu8: lu8$1,
  li16: li16$1,
  lu16: lu16$1,
  li32: li32$1,
  lu32: lu32$1,
  lf32: lf32$1,
  lf64: lf64$1,
  i64: i64$3,
  li64: li64$1,
  u64: u64$1,
  lu64: lu64$1,
  varint: varint$2,
  varint64: varint64$1,
  varint128: varint128$1,
  zigzag32: zigzag32$2,
  zigzag64: zigzag64$2,
  int: int$1,
  lint: lint$1
}, pstring$3 = { title: "pstring", type: "array", items: [{ enum: ["pstring"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["count"] }] }], additionalItems: !1 }, buffer$1 = { title: "buffer", type: "array", items: [{ enum: ["buffer"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["count"] }] }] }, bitfield$1 = { title: "bitfield", type: "array", items: [{ enum: ["bitfield"] }, { type: "array", items: { type: "object", properties: { name: { $ref: "definitions#/definitions/fieldName" }, size: { type: "number" }, signed: { type: "boolean" } }, required: ["name", "size", "signed"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, bitflags$1 = { title: "bitflags", type: "array", items: [{ enum: ["bitflags"] }, { type: "object", additionalItems: !1 }], additionalItems: !1 }, mapper$1 = { title: "mapper", type: "array", items: [{ enum: ["mapper"] }, { type: "object", properties: { type: { $ref: "dataType" }, mappings: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _]+$": { type: "string" } }, additionalProperties: !1 } }, required: ["type", "mappings"], additionalProperties: !1 }], additionalItems: !1 }, require$$5 = {
  pstring: pstring$3,
  buffer: buffer$1,
  bitfield: bitfield$1,
  bitflags: bitflags$1,
  mapper: mapper$1
}, array$1 = { title: "array", type: "array", items: [{ enum: ["array"] }, { oneOf: [{ type: "object", properties: { type: { $ref: "dataType" }, countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["type", "countType"] }, { type: "object", properties: { type: { $ref: "dataType" }, count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["type", "count"] }] }], additionalItems: !1 }, count$1 = { title: "count", type: "array", items: [{ enum: ["count"] }, { type: "object", properties: { countFor: { $ref: "definitions#/definitions/contextualizedFieldName" }, type: { $ref: "dataType" } }, required: ["countFor", "type"], additionalProperties: !1 }], additionalItems: !1 }, container$3 = { title: "container", type: "array", items: [{ enum: ["container"] }, { type: "array", items: { type: "object", properties: { anon: { type: "boolean" }, name: { $ref: "definitions#/definitions/fieldName" }, type: { $ref: "dataType" } }, oneOf: [{ required: ["anon"] }, { required: ["name"] }], required: ["type"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, require$$6 = {
  array: array$1,
  count: count$1,
  container: container$3
}, option$1 = { title: "option", type: "array", items: [{ enum: ["option"] }, { $ref: "dataType" }], additionalItems: !1 }, require$$7 = {
  switch: { title: "switch", type: "array", items: [{ enum: ["switch"] }, { type: "object", properties: { compareTo: { $ref: "definitions#/definitions/contextualizedFieldName" }, compareToValue: { type: "string" }, fields: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _:/]+$": { $ref: "dataType" } }, additionalProperties: !1 }, default: { $ref: "dataType" } }, oneOf: [{ required: ["compareTo", "fields"] }, { required: ["compareToValue", "fields"] }], additionalProperties: !1 }], additionalItems: !1 },
  option: option$1
}, bool = { enum: ["bool"] }, cstring = { title: "cstring", type: "array", items: [{ enum: ["cstring"] }, { type: "object", properties: { encoding: { type: "string" } }, additionalProperties: !1, required: [] }], additionalItems: !1 }, require$$8 = {
  bool,
  cstring,
  void: { enum: ["void"] }
};
var protodefValidator, hasRequiredProtodefValidator;
function requireProtodefValidator() {
  if (hasRequiredProtodefValidator) return protodefValidator;
  hasRequiredProtodefValidator = 1;
  const t = requireAjv(), e = requireAssert();
  class n {
    constructor(r) {
      this.createAjvInstance(r), this.addDefaultTypes();
    }
    createAjvInstance(r) {
      this.typesSchemas = {}, this.compiled = !1, this.ajv = new t({ verbose: !0 }), this.ajv.addSchema(require$$2$1, "definitions"), this.ajv.addSchema(require$$3$1, "protocol"), r && Object.keys(r).forEach((a) => this.addType(a, r[a]));
    }
    addDefaultTypes() {
      this.addTypes(require$$4), this.addTypes(require$$5), this.addTypes(require$$6), this.addTypes(require$$7), this.addTypes(require$$8);
    }
    addTypes(r) {
      Object.keys(r).forEach((a) => this.addType(a, r[a]));
    }
    typeToSchemaName(r) {
      return r.replace("|", "_");
    }
    addType(r, a) {
      const f = this.typeToSchemaName(r);
      this.typesSchemas[f] == null && (a || (a = {
        oneOf: [
          { enum: [r] },
          {
            type: "array",
            items: [
              { enum: [r] },
              { oneOf: [{ type: "object" }, { type: "array" }] }
            ]
          }
        ]
      }), this.typesSchemas[f] = a, this.compiled ? this.createAjvInstance(this.typesSchemas) : this.ajv.addSchema(a, f), this.ajv.removeSchema("dataType"), this.ajv.addSchema({
        title: "dataType",
        oneOf: [{ enum: ["native"] }].concat(Object.keys(this.typesSchemas).map((u) => ({ $ref: this.typeToSchemaName(u) })))
      }, "dataType"));
    }
    validateType(r) {
      let a = this.ajv.validate("dataType", r);
      if (this.compiled = !0, !a)
        throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
    }
    validateTypeGoingInside(r) {
      if (Array.isArray(r)) {
        e.ok(this.typesSchemas[this.typeToSchemaName(r[0])] != null, r + " is an undefined type");
        let a = this.ajv.validate(r[0], r);
        if (this.compiled = !0, !a)
          throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
      } else {
        if (r == "native")
          return;
        e.ok(this.typesSchemas[this.typeToSchemaName(r)] != null, r + " is an undefined type");
      }
    }
    validateProtocol(r) {
      let a = this.ajv.validate("protocol", r);
      e.ok(a, JSON.stringify(this.ajv.errors, null, 2));
      function f(u, h, g) {
        const l = new n(h.typesSchemas);
        Object.keys(u).forEach((m) => {
          m == "types" ? (Object.keys(u[m]).forEach((w) => l.addType(w)), Object.keys(u[m]).forEach((w) => {
            try {
              l.validateType(u[m][w], g + "." + m + "." + w);
            } catch {
              throw new Error("Error at " + g + "." + m + "." + w);
            }
          })) : f(u[m], l, g + "." + m);
        });
      }
      f(r, this, "root");
    }
  }
  return protodefValidator = n, protodefValidator;
}
const i8$2 = { enum: ["i8"] }, u8 = { enum: ["u8"] }, i16$2 = { enum: ["i16"] }, u16$1 = { enum: ["u16"] }, i32$2 = { enum: ["i32"] }, u32 = { enum: ["u32"] }, f32$2 = { enum: ["f32"] }, f64$2 = { enum: ["f64"] }, li8 = { enum: ["li8"] }, lu8 = { enum: ["lu8"] }, li16 = { enum: ["li16"] }, lu16 = { enum: ["lu16"] }, li32 = { enum: ["li32"] }, lu32 = { enum: ["lu32"] }, lf32 = { enum: ["lf32"] }, lf64 = { enum: ["lf64"] }, i64$2 = { enum: ["i64"] }, li64 = { enum: ["li64"] }, u64 = { enum: ["u64"] }, lu64 = { enum: ["lu64"] }, varint$1 = { enum: ["varint"] }, varint64 = { enum: ["varint64"] }, varint128 = { enum: ["varint128"] }, zigzag32$1 = { enum: ["zigzag32"] }, zigzag64$1 = { enum: ["zigzag64"] }, int = { title: "int", type: "array", items: [{ enum: ["int"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, lint = { title: "lint", type: "array", items: [{ enum: ["lint"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, require$$1$3 = {
  i8: i8$2,
  u8,
  i16: i16$2,
  u16: u16$1,
  i32: i32$2,
  u32,
  f32: f32$2,
  f64: f64$2,
  li8,
  lu8,
  li16,
  lu16,
  li32,
  lu32,
  lf32,
  lf64,
  i64: i64$2,
  li64,
  u64,
  lu64,
  varint: varint$1,
  varint64,
  varint128,
  zigzag32: zigzag32$1,
  zigzag64: zigzag64$1,
  int,
  lint
};
var numeric, hasRequiredNumeric;
function requireNumeric() {
  if (hasRequiredNumeric) return numeric;
  hasRequiredNumeric = 1;
  const { PartialReadError: t } = requireUtils$2();
  class e extends Array {
    valueOf() {
      return BigInt.asIntN(64, BigInt(this[0]) << 32n) | BigInt.asUintN(32, BigInt(this[1]));
    }
    toString() {
      return this.valueOf().toString();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.valueOf();
    }
  }
  class n extends Array {
    valueOf() {
      return BigInt.asUintN(64, BigInt(this[0]) << 32n) | BigInt.asUintN(32, BigInt(this[1]));
    }
    toString() {
      return this.valueOf().toString();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.valueOf();
    }
  }
  function s(p, q) {
    if (q + 8 > p.length)
      throw new t();
    return {
      value: new e(p.readInt32BE(q), p.readInt32BE(q + 4)),
      size: 8
    };
  }
  function r(p, q, c) {
    return typeof p == "bigint" ? q.writeBigInt64BE(p, c) : (q.writeInt32BE(p[0], c), q.writeInt32BE(p[1], c + 4)), c + 8;
  }
  function a(p, q) {
    if (q + 8 > p.length)
      throw new t();
    return {
      value: new e(p.readInt32LE(q + 4), p.readInt32LE(q)),
      size: 8
    };
  }
  function f(p, q, c) {
    return typeof p == "bigint" ? q.writeBigInt64LE(p, c) : (q.writeInt32LE(p[0], c + 4), q.writeInt32LE(p[1], c)), c + 8;
  }
  function u(p, q) {
    if (q + 8 > p.length)
      throw new t();
    return {
      value: new n(p.readUInt32BE(q), p.readUInt32BE(q + 4)),
      size: 8
    };
  }
  function h(p, q, c) {
    return typeof p == "bigint" ? q.writeBigUInt64BE(p, c) : (q.writeUInt32BE(p[0], c), q.writeUInt32BE(p[1], c + 4)), c + 8;
  }
  function g(p, q) {
    if (q + 8 > p.length)
      throw new t();
    return {
      value: new n(p.readUInt32LE(q + 4), p.readUInt32LE(q)),
      size: 8
    };
  }
  function l(p, q, c) {
    return typeof p == "bigint" ? q.writeBigUInt64LE(p, c) : (q.writeUInt32LE(p[0], c + 4), q.writeUInt32LE(p[1], c)), c + 8;
  }
  function m(p, q, c, v) {
    return [(I, A) => {
      if (A + c > I.length)
        throw new t();
      return {
        value: I[p](A),
        size: c
      };
    }, (I, A, $) => (A[q](I, $), $ + c), c, v];
  }
  const w = {
    i8: ["readInt8", "writeInt8", 1],
    u8: ["readUInt8", "writeUInt8", 1],
    i16: ["readInt16BE", "writeInt16BE", 2],
    u16: ["readUInt16BE", "writeUInt16BE", 2],
    i32: ["readInt32BE", "writeInt32BE", 4],
    u32: ["readUInt32BE", "writeUInt32BE", 4],
    f32: ["readFloatBE", "writeFloatBE", 4],
    f64: ["readDoubleBE", "writeDoubleBE", 8],
    li8: ["readInt8", "writeInt8", 1],
    lu8: ["readUInt8", "writeUInt8", 1],
    li16: ["readInt16LE", "writeInt16LE", 2],
    lu16: ["readUInt16LE", "writeUInt16LE", 2],
    li32: ["readInt32LE", "writeInt32LE", 4],
    lu32: ["readUInt32LE", "writeUInt32LE", 4],
    lf32: ["readFloatLE", "writeFloatLE", 4],
    lf64: ["readDoubleLE", "writeDoubleLE", 8]
  }, R = Object.keys(w).reduce((p, q) => (p[q] = m(w[q][0], w[q][1], w[q][2], require$$1$3[q]), p), {});
  return R.i64 = [s, r, 8, require$$1$3.i64], R.li64 = [a, f, 8, require$$1$3.li64], R.u64 = [u, h, 8, require$$1$3.u64], R.lu64 = [g, l, 8, require$$1$3.lu64], numeric = R, numeric;
}
const pstring$2 = { title: "pstring", type: "array", items: [{ enum: ["pstring"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["count"] }] }], additionalItems: !1 }, buffer = { title: "buffer", type: "array", items: [{ enum: ["buffer"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["count"] }] }] }, bitfield = { title: "bitfield", type: "array", items: [{ enum: ["bitfield"] }, { type: "array", items: { type: "object", properties: { name: { $ref: "definitions#/definitions/fieldName" }, size: { type: "number" }, signed: { type: "boolean" } }, required: ["name", "size", "signed"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, bitflags = { title: "bitflags", type: "array", items: [{ enum: ["bitflags"] }, { type: "object", additionalItems: !1 }], additionalItems: !1 }, mapper = { title: "mapper", type: "array", items: [{ enum: ["mapper"] }, { type: "object", properties: { type: { $ref: "dataType" }, mappings: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _]+$": { type: "string" } }, additionalProperties: !1 } }, required: ["type", "mappings"], additionalProperties: !1 }], additionalItems: !1 }, require$$1$2 = {
  pstring: pstring$2,
  buffer,
  bitfield,
  bitflags,
  mapper
};
var varint, hasRequiredVarint;
function requireVarint() {
  if (hasRequiredVarint) return varint;
  hasRequiredVarint = 1;
  const { PartialReadError: t } = requireUtils$2();
  varint = {
    varint: [e, s, n, require$$1$3.varint],
    varint64: [r, u, f, require$$1$3.varint64],
    varint128: [a, u, f, require$$1$3.varint128],
    zigzag32: [h, l, g, require$$1$3.zigzag32],
    zigzag64: [m, R, w, require$$1$3.zigzag64]
  };
  function e(p, q) {
    let c = 0, v = 0, P = q;
    for (; ; ) {
      if (P >= p.length) throw new t("Unexpected buffer end while reading VarInt");
      const E = p.readUInt8(P);
      if (c |= (E & 127) << v, P++, !(E & 128))
        return { value: c, size: P - q };
      if (v += 7, v > 64) throw new t(`varint is too big: ${v}`);
    }
  }
  function n(p) {
    let q = 0;
    for (; p & -128; )
      p >>>= 7, q++;
    return q + 1;
  }
  function s(p, q, c) {
    let v = 0;
    for (; p & -128; )
      q.writeUInt8(p & 255 | 128, c + v), v++, p >>>= 7;
    return q.writeUInt8(p, c + v), c + v + 1;
  }
  function r(p, q) {
    let c = 0n, v = 0n, P = q;
    for (; ; ) {
      if (P >= p.length) throw new t("Unexpected buffer end while reading VarLong");
      const E = p.readUInt8(P);
      if (c |= (BigInt(E) & 0x7Fn) << v, P++, !(E & 128))
        return { value: c, size: P - q };
      if (v += 7n, v > 63n) throw new Error(`varint is too big: ${v}`);
    }
  }
  function a(p, q) {
    let c = 0n, v = 0n, P = q;
    for (; ; ) {
      if (P >= p.length) throw new t("Unexpected buffer end while reading VarLong");
      const E = p.readUInt8(P);
      if (c |= (BigInt(E) & 0x7Fn) << v, P++, !(E & 128))
        return { value: c, size: P - q };
      if (v += 7n, v > 127n) throw new Error(`varint is too big: ${v}`);
    }
  }
  function f(p) {
    p = BigInt(p);
    let q = 0;
    do
      p >>= 7n, q++;
    while (p !== 0n);
    return q;
  }
  function u(p, q, c) {
    p = BigInt(p);
    let v = c;
    do {
      const P = p & 0x7Fn;
      p >>= 7n, q.writeUInt8(Number(P) | (p ? 128 : 0), v++);
    } while (p);
    return v;
  }
  function h(p, q) {
    const { value: c, size: v } = e(p, q);
    return { value: c >>> 1 ^ -(c & 1), size: v };
  }
  function g(p) {
    return n(p << 1 ^ p >> 31);
  }
  function l(p, q, c) {
    return s(p << 1 ^ p >> 31, q, c);
  }
  function m(p, q) {
    const { value: c, size: v } = r(p, q);
    return { value: c >> 1n ^ -(c & 1n), size: v };
  }
  function w(p) {
    return f(BigInt(p) << 1n ^ BigInt(p) >> 63n);
  }
  function R(p, q, c) {
    return u(BigInt(p) << 1n ^ BigInt(p) >> 63n, q, c);
  }
  return varint;
}
var utils$1, hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  const { getCount: t, sendCount: e, calcCount: n, PartialReadError: s } = requireUtils$2();
  utils$1 = {
    bool: [m, w, 1, require$$1$2.bool],
    pstring: [h, g, l, require$$1$2.pstring],
    buffer: [R, p, q, require$$1$2.buffer],
    void: [c, v, 0, require$$1$2.void],
    bitfield: [E, I, A, require$$1$2.bitfield],
    bitflags: [V, C, z, require$$1$2.bitflags],
    cstring: [$, x, M, require$$1$2.cstring],
    mapper: [a, f, u, require$$1$2.mapper],
    ...requireVarint()
  };
  function r(y, D) {
    return y === D || parseInt(y) === parseInt(D);
  }
  function a(y, D, { type: ie, mappings: de }, we) {
    const { size: be, value: ce } = this.read(y, D, ie, we);
    let fe = null;
    const j = Object.keys(de);
    for (let pe = 0; pe < j.length; pe++)
      if (r(j[pe], ce)) {
        fe = de[j[pe]];
        break;
      }
    if (fe == null) throw new Error(ce + " is not in the mappings value");
    return {
      size: be,
      value: fe
    };
  }
  function f(y, D, ie, { type: de, mappings: we }, be) {
    const ce = Object.keys(we);
    let fe = null;
    for (let j = 0; j < ce.length; j++)
      if (r(we[ce[j]], y)) {
        fe = ce[j];
        break;
      }
    if (fe == null) throw new Error(y + " is not in the mappings value");
    return this.write(fe, D, ie, de, be);
  }
  function u(y, { type: D, mappings: ie }, de) {
    const we = Object.keys(ie);
    let be = null;
    for (let ce = 0; ce < we.length; ce++)
      if (r(ie[we[ce]], y)) {
        be = we[ce];
        break;
      }
    if (be == null) throw new Error(y + " is not in the mappings value");
    return this.sizeOf(be, D, de);
  }
  function h(y, D, ie, de) {
    const { size: we, count: be } = t.call(this, y, D, ie, de), ce = D + we, fe = ce + be;
    if (fe > y.length)
      throw new s("Missing characters in string, found size is " + y.length + " expected size was " + fe);
    return {
      value: y.toString(ie.encoding || "utf8", ce, fe),
      size: fe - D
    };
  }
  function g(y, D, ie, de, we) {
    const be = Buffer.byteLength(y, "utf8");
    return ie = e.call(this, be, D, ie, de, we), D.write(y, ie, be, de.encoding || "utf8"), ie + be;
  }
  function l(y, D, ie) {
    const de = Buffer.byteLength(y, D.encoding || "utf8");
    return n.call(this, de, D, ie) + de;
  }
  function m(y, D) {
    if (D + 1 > y.length) throw new s();
    return {
      value: !!y.readInt8(D),
      size: 1
    };
  }
  function w(y, D, ie) {
    return D.writeInt8(+y, ie), ie + 1;
  }
  function R(y, D, ie, de) {
    const { size: we, count: be } = t.call(this, y, D, ie, de);
    if (D += we, D + be > y.length) throw new s();
    return {
      value: y.slice(D, D + be),
      size: we + be
    };
  }
  function p(y, D, ie, de, we) {
    return y instanceof Buffer || (y = Buffer.from(y)), ie = e.call(this, y.length, D, ie, de, we), y.copy(D, ie), ie + y.length;
  }
  function q(y, D, ie) {
    return y instanceof Buffer || (y = Buffer.from(y)), n.call(this, y.length, D, ie) + y.length;
  }
  function c() {
    return {
      value: void 0,
      size: 0
    };
  }
  function v(y, D, ie) {
    return ie;
  }
  function P(y) {
    return (1 << y) - 1;
  }
  function E(y, D, ie) {
    const de = D;
    let we = null, be = 0;
    const ce = {};
    return ce.value = ie.reduce((fe, { size: j, signed: pe, name: ee }) => {
      let X = j, G = 0;
      for (; X > 0; ) {
        if (be === 0) {
          if (y.length < D + 1)
            throw new s();
          we = y[D++], be = 8;
        }
        const le = Math.min(X, be);
        G = G << le | (we & P(be)) >> be - le, be -= le, X -= le;
      }
      return pe && G >= 1 << j - 1 && (G -= 1 << j), fe[ee] = G, fe;
    }, {}), ce.size = D - de, ce;
  }
  function I(y, D, ie, de) {
    let we = 0, be = 0;
    return de.forEach(({ size: ce, signed: fe, name: j }) => {
      const pe = y[j];
      if (!fe && pe < 0 || fe && pe < -(1 << ce - 1))
        throw new Error(y + " < " + fe ? -(1 << ce - 1) : 0);
      if (!fe && pe >= 1 << ce || fe && pe >= (1 << ce - 1) - 1)
        throw new Error(y + " >= " + fe ? 1 << ce : (1 << ce - 1) - 1);
      for (; ce > 0; ) {
        const ee = Math.min(8 - be, ce);
        we = we << ee | pe >> ce - ee & P(ee), ce -= ee, be += ee, be === 8 && (D[ie++] = we, be = 0, we = 0);
      }
    }), be !== 0 && (D[ie++] = we << 8 - be), ie;
  }
  function A(y, D) {
    return Math.ceil(D.reduce((ie, { size: de }) => ie + de, 0) / 8);
  }
  function $(y, D, ie) {
    let de = 0;
    for (; D + de < y.length && y[D + de] !== 0; )
      de++;
    if (y.length < D + de + 1)
      throw new s();
    return {
      value: y.toString((ie == null ? void 0 : ie.encoding) || "utf8", D, D + de),
      size: de + 1
    };
  }
  function x(y, D, ie, de) {
    const we = Buffer.byteLength(y, (de == null ? void 0 : de.encoding) || "utf8");
    return D.write(y, ie, we, (de == null ? void 0 : de.encoding) || "utf8"), ie += we, D.writeInt8(0, ie), ie + 1;
  }
  function M(y) {
    return Buffer.byteLength(y, "utf8") + 1;
  }
  function V(y, D, { type: ie, flags: de, shift: we, big: be }, ce) {
    const { size: fe, value: j } = this.read(y, D, ie, ce);
    let pe = {};
    if (Array.isArray(de))
      for (const [X, G] of Object.entries(de))
        pe[G] = be ? 1n << BigInt(X) : 1 << X;
    else if (we)
      for (const X in de)
        pe[X] = be ? 1n << BigInt(de[X]) : 1 << de[X];
    else
      pe = de;
    const ee = { _value: j };
    for (const X in pe)
      ee[X] = (j & pe[X]) === pe[X];
    return { value: ee, size: fe };
  }
  function C(y, D, ie, { type: de, flags: we, shift: be, big: ce }, fe) {
    let j = {};
    if (Array.isArray(we))
      for (const [ee, X] of Object.entries(we))
        j[X] = ce ? 1n << BigInt(ee) : 1 << ee;
    else if (be)
      for (const ee in we)
        j[ee] = ce ? 1n << BigInt(we[ee]) : 1 << we[ee];
    else
      j = we;
    let pe = y._value || (ce ? 0n : 0);
    for (const ee in j)
      y[ee] && (pe |= j[ee]);
    return this.write(pe, D, ie, de, fe);
  }
  function z(y, { type: D, flags: ie, shift: de, big: we }, be) {
    if (!y) throw new Error("Missing field");
    let ce = {};
    if (Array.isArray(ie))
      for (const [j, pe] of Object.entries(ie))
        ce[pe] = we ? 1n << BigInt(j) : 1 << j;
    else if (de)
      for (const j in ie)
        ce[j] = we ? 1n << BigInt(ie[j]) : 1 << ie[j];
    else
      ce = ie;
    let fe = y._value || (we ? 0n : 0);
    for (const j in ce)
      y[j] && (fe |= ce[j]);
    return this.sizeOf(fe, D, be);
  }
  return utils$1;
}
const array = { title: "array", type: "array", items: [{ enum: ["array"] }, { oneOf: [{ type: "object", properties: { type: { $ref: "dataType" }, countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["type", "countType"] }, { type: "object", properties: { type: { $ref: "dataType" }, count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["type", "count"] }] }], additionalItems: !1 }, count = { title: "count", type: "array", items: [{ enum: ["count"] }, { type: "object", properties: { countFor: { $ref: "definitions#/definitions/contextualizedFieldName" }, type: { $ref: "dataType" } }, required: ["countFor", "type"], additionalProperties: !1 }], additionalItems: !1 }, container$2 = { title: "container", type: "array", items: [{ enum: ["container"] }, { type: "array", items: { type: "object", properties: { anon: { type: "boolean" }, name: { $ref: "definitions#/definitions/fieldName" }, type: { $ref: "dataType" } }, oneOf: [{ required: ["anon"] }, { required: ["name"] }], required: ["type"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, require$$1$1 = {
  array,
  count,
  container: container$2
};
var structures, hasRequiredStructures;
function requireStructures() {
  if (hasRequiredStructures) return structures;
  hasRequiredStructures = 1;
  const { getField: t, getCount: e, sendCount: n, calcCount: s, tryDoc: r } = requireUtils$2();
  structures = {
    array: [a, f, u, require$$1$1.array],
    count: [m, w, R, require$$1$1.count],
    container: [h, g, l, require$$1$1.container]
  };
  function a(p, q, c, v) {
    const P = {
      value: [],
      size: 0
    };
    let E, { count: I, size: A } = e.call(this, p, q, c, v);
    q += A, P.size += A;
    for (let $ = 0; $ < I; $++)
      ({ size: A, value: E } = r(() => this.read(p, q, c.type, v), $)), P.size += A, q += A, P.value.push(E);
    return P;
  }
  function f(p, q, c, v, P) {
    return c = n.call(this, p.length, q, c, v, P), p.reduce((E, I, A) => r(() => this.write(I, q, E, v.type, P), A), c);
  }
  function u(p, q, c) {
    let v = s.call(this, p.length, q, c);
    return v = p.reduce((P, E, I) => r(() => P + this.sizeOf(E, q.type, c), I), v), v;
  }
  function h(p, q, c, v) {
    const P = {
      value: { "..": v },
      size: 0
    };
    return c.forEach(({ type: E, name: I, anon: A }) => {
      r(() => {
        const $ = this.read(p, q, E, P.value);
        P.size += $.size, q += $.size, A ? $.value !== void 0 && Object.keys($.value).forEach((x) => {
          P.value[x] = $.value[x];
        }) : P.value[I] = $.value;
      }, I || "unknown");
    }), delete P.value[".."], P;
  }
  function g(p, q, c, v, P) {
    return p[".."] = P, c = v.reduce((E, { type: I, name: A, anon: $ }) => r(() => this.write($ ? p : p[A], q, E, I, p), A || "unknown"), c), delete p[".."], c;
  }
  function l(p, q, c) {
    p[".."] = c;
    const v = q.reduce((P, { type: E, name: I, anon: A }) => P + r(() => this.sizeOf(A ? p : p[I], E, p), I || "unknown"), 0);
    return delete p[".."], v;
  }
  function m(p, q, { type: c }, v) {
    return this.read(p, q, c, v);
  }
  function w(p, q, c, { countFor: v, type: P }, E) {
    return this.write(t(v, E).length, q, c, P, E);
  }
  function R(p, { countFor: q, type: c }, v) {
    return this.sizeOf(t(q, v).length, c, v);
  }
  return structures;
}
const option = { title: "option", type: "array", items: [{ enum: ["option"] }, { $ref: "dataType" }], additionalItems: !1 }, require$$1 = {
  switch: { title: "switch", type: "array", items: [{ enum: ["switch"] }, { type: "object", properties: { compareTo: { $ref: "definitions#/definitions/contextualizedFieldName" }, compareToValue: { type: "string" }, fields: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _:/]+$": { $ref: "dataType" } }, additionalProperties: !1 }, default: { $ref: "dataType" } }, oneOf: [{ required: ["compareTo", "fields"] }, { required: ["compareToValue", "fields"] }], additionalProperties: !1 }], additionalItems: !1 },
  option
};
var conditional, hasRequiredConditional;
function requireConditional() {
  if (hasRequiredConditional) return conditional;
  hasRequiredConditional = 1;
  const { getField: t, getFieldInfo: e, tryDoc: n, PartialReadError: s } = requireUtils$2();
  conditional = {
    switch: [r, a, f, require$$1.switch],
    option: [u, h, g, require$$1.option]
  };
  function r(l, m, { compareTo: w, fields: R, compareToValue: p, default: q }, c) {
    if (w = p !== void 0 ? p : t(w, c), typeof R[w] > "u" && typeof q > "u")
      throw new Error(w + " has no associated fieldInfo in switch");
    for (const I in R)
      I.startsWith("/") && (R[this.types[I.slice(1)]] = R[I], delete R[I]);
    const v = typeof R[w] > "u", P = v ? q : R[w], E = e(P);
    return n(() => this.read(l, m, E, c), v ? "default" : w);
  }
  function a(l, m, w, { compareTo: R, fields: p, compareToValue: q, default: c }, v) {
    if (R = q !== void 0 ? q : t(R, v), typeof p[R] > "u" && typeof c > "u")
      throw new Error(R + " has no associated fieldInfo in switch");
    for (const I in p)
      I.startsWith("/") && (p[this.types[I.slice(1)]] = p[I], delete p[I]);
    const P = typeof p[R] > "u", E = e(P ? c : p[R]);
    return n(() => this.write(l, m, w, E, v), P ? "default" : R);
  }
  function f(l, { compareTo: m, fields: w, compareToValue: R, default: p }, q) {
    if (m = R !== void 0 ? R : t(m, q), typeof w[m] > "u" && typeof p > "u")
      throw new Error(m + " has no associated fieldInfo in switch");
    for (const P in w)
      P.startsWith("/") && (w[this.types[P.slice(1)]] = w[P], delete w[P]);
    const c = typeof w[m] > "u", v = e(c ? p : w[m]);
    return n(() => this.sizeOf(l, v, q), c ? "default" : m);
  }
  function u(l, m, w, R) {
    if (l.length < m + 1)
      throw new s();
    if (l.readUInt8(m++) !== 0) {
      const q = this.read(l, m, w, R);
      return q.size++, q;
    } else
      return { size: 1 };
  }
  function h(l, m, w, R, p) {
    return l != null ? (m.writeUInt8(1, w++), w = this.write(l, m, w, R, p)) : m.writeUInt8(0, w++), w;
  }
  function g(l, m, w) {
    return l == null ? 1 : this.sizeOf(l, m, w) + 1;
  }
  return conditional;
}
var protodef$1, hasRequiredProtodef$1;
function requireProtodef$1() {
  if (hasRequiredProtodef$1) return protodef$1;
  hasRequiredProtodef$1 = 1;
  const { getFieldInfo: t, tryCatch: e } = requireUtils$2(), n = requireLodash_reduce(), s = requireProtodefValidator();
  function r(g) {
    return typeof g == "string" || Array.isArray(g) && typeof g[0] == "string" || g.type;
  }
  function a(g, l, m) {
    return typeof l == "string" && l.charAt(0) === "$" ? g.push({ path: m, val: l.substr(1) }) : (Array.isArray(l) || typeof l == "object") && (g = g.concat(n(l, a, []).map((w) => ({ path: m + "." + w.path, val: w.val })))), g;
  }
  function f(g, l, m) {
    const w = g.split(".").reverse();
    for (; w.length > 1; )
      m = m[w.pop()];
    m[w.pop()] = l;
  }
  function u(g, l) {
    const m = JSON.stringify(l), w = n(l, a, []);
    function R(p) {
      const q = JSON.parse(m);
      return w.forEach((c) => {
        f(c.path, p[c.val], q);
      }), q;
    }
    return [function(q, c, v, P) {
      return g[0].call(this, q, c, R(v), P);
    }, function(q, c, v, P, E) {
      return g[1].call(this, q, c, v, R(P), E);
    }, function(q, c, v) {
      return typeof g[2] == "function" ? g[2].call(this, q, R(c), v) : g[2];
    }];
  }
  class h {
    constructor(l = !0) {
      this.types = {}, this.validator = l ? new s() : null, this.addDefaultTypes();
    }
    addDefaultTypes() {
      this.addTypes(requireNumeric()), this.addTypes(requireUtils$1()), this.addTypes(requireStructures()), this.addTypes(requireConditional());
    }
    addProtocol(l, m) {
      const w = this;
      function R(p, q) {
        p !== void 0 && (p.types && w.addTypes(p.types), R(p == null ? void 0 : p[q[0]], q.slice(1)));
      }
      this.validator && this.validator.validateProtocol(l), R(l, m);
    }
    addType(l, m, w = !0) {
      if (m === "native") {
        this.validator && this.validator.addType(l);
        return;
      }
      if (r(m)) {
        this.validator && (w && this.validator.validateType(m), this.validator.addType(l));
        const { type: R, typeArgs: p } = t(m);
        this.types[l] = p ? u(this.types[R], p) : this.types[R];
      } else
        this.validator && (m[3] ? this.validator.addType(l, m[3]) : this.validator.addType(l)), this.types[l] = m;
    }
    addTypes(l) {
      Object.keys(l).forEach((m) => this.addType(m, l[m], !1)), this.validator && Object.keys(l).forEach((m) => {
        r(l[m]) && this.validator.validateType(l[m]);
      });
    }
    setVariable(l, m) {
      this.types[l] = m;
    }
    read(l, m, w, R) {
      const { type: p, typeArgs: q } = t(w), c = this.types[p];
      if (!c)
        throw new Error("missing data type: " + p);
      return c[0].call(this, l, m, q, R);
    }
    write(l, m, w, R, p) {
      const { type: q, typeArgs: c } = t(R), v = this.types[q];
      if (!v)
        throw new Error("missing data type: " + q);
      return v[1].call(this, l, m, w, c, p);
    }
    sizeOf(l, m, w) {
      const { type: R, typeArgs: p } = t(m), q = this.types[R];
      if (!q)
        throw new Error("missing data type: " + R);
      return typeof q[2] == "function" ? q[2].call(this, l, p, w) : q[2];
    }
    createPacketBuffer(l, m) {
      const w = e(
        () => this.sizeOf(m, l, {}),
        (p) => {
          throw p.message = `SizeOf error for ${p.field} : ${p.message}`, p;
        }
      ), R = Buffer.allocUnsafe(w);
      return e(
        () => this.write(m, R, 0, l, {}),
        (p) => {
          throw p.message = `Write error for ${p.field} : ${p.message}`, p;
        }
      ), R;
    }
    parsePacketBuffer(l, m, w = 0) {
      const { value: R, size: p } = e(
        () => this.read(m, w, l, {}),
        (q) => {
          throw q.message = `Read error for ${q.field} : ${q.message}`, q;
        }
      );
      return {
        data: R,
        metadata: {
          size: p
        },
        buffer: m.slice(0, p),
        fullBuffer: m
      };
    }
  }
  return protodef$1 = h, protodef$1;
}
var browser$2 = { exports: {} }, stream = { exports: {} }, primordials, hasRequiredPrimordials;
function requirePrimordials() {
  if (hasRequiredPrimordials) return primordials;
  hasRequiredPrimordials = 1;
  class t extends Error {
    constructor(n) {
      if (!Array.isArray(n))
        throw new TypeError(`Expected input to be an Array, got ${typeof n}`);
      let s = "";
      for (let r = 0; r < n.length; r++)
        s += `    ${n[r].stack}
`;
      super(s), this.name = "AggregateError", this.errors = n;
    }
  }
  return primordials = {
    AggregateError: t,
    ArrayIsArray(e) {
      return Array.isArray(e);
    },
    ArrayPrototypeIncludes(e, n) {
      return e.includes(n);
    },
    ArrayPrototypeIndexOf(e, n) {
      return e.indexOf(n);
    },
    ArrayPrototypeJoin(e, n) {
      return e.join(n);
    },
    ArrayPrototypeMap(e, n) {
      return e.map(n);
    },
    ArrayPrototypePop(e, n) {
      return e.pop(n);
    },
    ArrayPrototypePush(e, n) {
      return e.push(n);
    },
    ArrayPrototypeSlice(e, n, s) {
      return e.slice(n, s);
    },
    Error,
    FunctionPrototypeCall(e, n, ...s) {
      return e.call(n, ...s);
    },
    FunctionPrototypeSymbolHasInstance(e, n) {
      return Function.prototype[Symbol.hasInstance].call(e, n);
    },
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties(e, n) {
      return Object.defineProperties(e, n);
    },
    ObjectDefineProperty(e, n, s) {
      return Object.defineProperty(e, n, s);
    },
    ObjectGetOwnPropertyDescriptor(e, n) {
      return Object.getOwnPropertyDescriptor(e, n);
    },
    ObjectKeys(e) {
      return Object.keys(e);
    },
    ObjectSetPrototypeOf(e, n) {
      return Object.setPrototypeOf(e, n);
    },
    Promise,
    PromisePrototypeCatch(e, n) {
      return e.catch(n);
    },
    PromisePrototypeThen(e, n, s) {
      return e.then(n, s);
    },
    PromiseReject(e) {
      return Promise.reject(e);
    },
    PromiseResolve(e) {
      return Promise.resolve(e);
    },
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest(e, n) {
      return e.test(n);
    },
    SafeSet: Set,
    String,
    StringPrototypeSlice(e, n, s) {
      return e.slice(n, s);
    },
    StringPrototypeToLowerCase(e) {
      return e.toLowerCase();
    },
    StringPrototypeToUpperCase(e) {
      return e.toUpperCase();
    },
    StringPrototypeTrim(e) {
      return e.trim();
    },
    Symbol,
    SymbolFor: Symbol.for,
    SymbolAsyncIterator: Symbol.asyncIterator,
    SymbolHasInstance: Symbol.hasInstance,
    SymbolIterator: Symbol.iterator,
    SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
    SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
    TypedArrayPrototypeSet(e, n, s) {
      return e.set(n, s);
    },
    Boolean,
    Uint8Array
  }, primordials;
}
var util = { exports: {} }, inspect, hasRequiredInspect;
function requireInspect() {
  return hasRequiredInspect || (hasRequiredInspect = 1, inspect = {
    format(t, ...e) {
      return t.replace(/%([sdifj])/g, function(...[n, s]) {
        const r = e.shift();
        return s === "f" ? r.toFixed(6) : s === "j" ? JSON.stringify(r) : s === "s" && typeof r == "object" ? `${r.constructor !== Object ? r.constructor.name : ""} {}`.trim() : r.toString();
      });
    },
    inspect(t) {
      switch (typeof t) {
        case "string":
          if (t.includes("'"))
            if (t.includes('"')) {
              if (!t.includes("`") && !t.includes("${"))
                return `\`${t}\``;
            } else return `"${t}"`;
          return `'${t}'`;
        case "number":
          return isNaN(t) ? "NaN" : Object.is(t, -0) ? String(t) : t;
        case "bigint":
          return `${String(t)}n`;
        case "boolean":
        case "undefined":
          return String(t);
        case "object":
          return "{}";
      }
    }
  }), inspect;
}
var errors, hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  const { format: t, inspect: e } = requireInspect(), { AggregateError: n } = requirePrimordials(), s = globalThis.AggregateError || n, r = Symbol("kIsNodeError"), a = [
    "string",
    "function",
    "number",
    "object",
    // Accept 'Function' and 'Object' as alternative to the lower cased version.
    "Function",
    "Object",
    "boolean",
    "bigint",
    "symbol"
  ], f = /^([A-Z][a-z0-9]*)+$/, u = "__node_internal_", h = {};
  function g(c, v) {
    if (!c)
      throw new h.ERR_INTERNAL_ASSERTION(v);
  }
  function l(c) {
    let v = "", P = c.length;
    const E = c[0] === "-" ? 1 : 0;
    for (; P >= E + 4; P -= 3)
      v = `_${c.slice(P - 3, P)}${v}`;
    return `${c.slice(0, P)}${v}`;
  }
  function m(c, v, P) {
    if (typeof v == "function")
      return g(
        v.length <= P.length,
        // Default options do not count.
        `Code: ${c}; The provided arguments length (${P.length}) does not match the required ones (${v.length}).`
      ), v(...P);
    const E = (v.match(/%[dfijoOs]/g) || []).length;
    return g(
      E === P.length,
      `Code: ${c}; The provided arguments length (${P.length}) does not match the required ones (${E}).`
    ), P.length === 0 ? v : t(v, ...P);
  }
  function w(c, v, P) {
    P || (P = Error);
    class E extends P {
      constructor(...A) {
        super(m(c, v, A));
      }
      toString() {
        return `${this.name} [${c}]: ${this.message}`;
      }
    }
    Object.defineProperties(E.prototype, {
      name: {
        value: P.name,
        writable: !0,
        enumerable: !1,
        configurable: !0
      },
      toString: {
        value() {
          return `${this.name} [${c}]: ${this.message}`;
        },
        writable: !0,
        enumerable: !1,
        configurable: !0
      }
    }), E.prototype.code = c, E.prototype[r] = !0, h[c] = E;
  }
  function R(c) {
    const v = u + c.name;
    return Object.defineProperty(c, "name", {
      value: v
    }), c;
  }
  function p(c, v) {
    if (c && v && c !== v) {
      if (Array.isArray(v.errors))
        return v.errors.push(c), v;
      const P = new s([v, c], v.message);
      return P.code = v.code, P;
    }
    return c || v;
  }
  class q extends Error {
    constructor(v = "The operation was aborted", P = void 0) {
      if (P !== void 0 && typeof P != "object")
        throw new h.ERR_INVALID_ARG_TYPE("options", "Object", P);
      super(v, P), this.code = "ABORT_ERR", this.name = "AbortError";
    }
  }
  return w("ERR_ASSERTION", "%s", Error), w(
    "ERR_INVALID_ARG_TYPE",
    (c, v, P) => {
      g(typeof c == "string", "'name' must be a string"), Array.isArray(v) || (v = [v]);
      let E = "The ";
      c.endsWith(" argument") ? E += `${c} ` : E += `"${c}" ${c.includes(".") ? "property" : "argument"} `, E += "must be ";
      const I = [], A = [], $ = [];
      for (const M of v)
        g(typeof M == "string", "All expected entries have to be of type string"), a.includes(M) ? I.push(M.toLowerCase()) : f.test(M) ? A.push(M) : (g(M !== "object", 'The value "object" should be written as "Object"'), $.push(M));
      if (A.length > 0) {
        const M = I.indexOf("object");
        M !== -1 && (I.splice(I, M, 1), A.push("Object"));
      }
      if (I.length > 0) {
        switch (I.length) {
          case 1:
            E += `of type ${I[0]}`;
            break;
          case 2:
            E += `one of type ${I[0]} or ${I[1]}`;
            break;
          default: {
            const M = I.pop();
            E += `one of type ${I.join(", ")}, or ${M}`;
          }
        }
        (A.length > 0 || $.length > 0) && (E += " or ");
      }
      if (A.length > 0) {
        switch (A.length) {
          case 1:
            E += `an instance of ${A[0]}`;
            break;
          case 2:
            E += `an instance of ${A[0]} or ${A[1]}`;
            break;
          default: {
            const M = A.pop();
            E += `an instance of ${A.join(", ")}, or ${M}`;
          }
        }
        $.length > 0 && (E += " or ");
      }
      switch ($.length) {
        case 0:
          break;
        case 1:
          $[0].toLowerCase() !== $[0] && (E += "an "), E += `${$[0]}`;
          break;
        case 2:
          E += `one of ${$[0]} or ${$[1]}`;
          break;
        default: {
          const M = $.pop();
          E += `one of ${$.join(", ")}, or ${M}`;
        }
      }
      if (P == null)
        E += `. Received ${P}`;
      else if (typeof P == "function" && P.name)
        E += `. Received function ${P.name}`;
      else if (typeof P == "object") {
        var x;
        if ((x = P.constructor) !== null && x !== void 0 && x.name)
          E += `. Received an instance of ${P.constructor.name}`;
        else {
          const M = e(P, {
            depth: -1
          });
          E += `. Received ${M}`;
        }
      } else {
        let M = e(P, {
          colors: !1
        });
        M.length > 25 && (M = `${M.slice(0, 25)}...`), E += `. Received type ${typeof P} (${M})`;
      }
      return E;
    },
    TypeError
  ), w(
    "ERR_INVALID_ARG_VALUE",
    (c, v, P = "is invalid") => {
      let E = e(v);
      return E.length > 128 && (E = E.slice(0, 128) + "..."), `The ${c.includes(".") ? "property" : "argument"} '${c}' ${P}. Received ${E}`;
    },
    TypeError
  ), w(
    "ERR_INVALID_RETURN_VALUE",
    (c, v, P) => {
      var E;
      const I = P != null && (E = P.constructor) !== null && E !== void 0 && E.name ? `instance of ${P.constructor.name}` : `type ${typeof P}`;
      return `Expected ${c} to be returned from the "${v}" function but got ${I}.`;
    },
    TypeError
  ), w(
    "ERR_MISSING_ARGS",
    (...c) => {
      g(c.length > 0, "At least one arg needs to be specified");
      let v;
      const P = c.length;
      switch (c = (Array.isArray(c) ? c : [c]).map((E) => `"${E}"`).join(" or "), P) {
        case 1:
          v += `The ${c[0]} argument`;
          break;
        case 2:
          v += `The ${c[0]} and ${c[1]} arguments`;
          break;
        default:
          {
            const E = c.pop();
            v += `The ${c.join(", ")}, and ${E} arguments`;
          }
          break;
      }
      return `${v} must be specified`;
    },
    TypeError
  ), w(
    "ERR_OUT_OF_RANGE",
    (c, v, P) => {
      g(v, 'Missing "range" argument');
      let E;
      if (Number.isInteger(P) && Math.abs(P) > 2 ** 32)
        E = l(String(P));
      else if (typeof P == "bigint") {
        E = String(P);
        const I = BigInt(2) ** BigInt(32);
        (P > I || P < -I) && (E = l(E)), E += "n";
      } else
        E = e(P);
      return `The value of "${c}" is out of range. It must be ${v}. Received ${E}`;
    },
    RangeError
  ), w("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error), w("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error), w("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error), w("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error), w("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error), w("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), w("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error), w("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error), w("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error), w("ERR_STREAM_WRITE_AFTER_END", "write after end", Error), w("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError), errors = {
    AbortError: q,
    aggregateTwoErrors: R(p),
    hideStackFrames: R,
    codes: h
  }, errors;
}
var browser$1 = { exports: {} }, hasRequiredBrowser$2;
function requireBrowser$2() {
  if (hasRequiredBrowser$2) return browser$1.exports;
  hasRequiredBrowser$2 = 1;
  const { AbortController: t, AbortSignal: e } = typeof self < "u" ? self : typeof window < "u" ? window : (
    /* otherwise */
    void 0
  );
  return browser$1.exports = t, browser$1.exports.AbortSignal = e, browser$1.exports.default = t, browser$1.exports;
}
var hasRequiredUtil;
function requireUtil() {
  return hasRequiredUtil || (hasRequiredUtil = 1, (function(t) {
    const e = requireDist(), { format: n, inspect: s } = requireInspect(), {
      codes: { ERR_INVALID_ARG_TYPE: r }
    } = requireErrors(), { kResistStopPropagation: a, AggregateError: f, SymbolDispose: u } = requirePrimordials(), h = globalThis.AbortSignal || requireBrowser$2().AbortSignal, g = globalThis.AbortController || requireBrowser$2().AbortController, l = Object.getPrototypeOf(async function() {
    }).constructor, m = globalThis.Blob || e.Blob, w = typeof m < "u" ? function(c) {
      return c instanceof m;
    } : function(c) {
      return !1;
    }, R = (q, c) => {
      if (q !== void 0 && (q === null || typeof q != "object" || !("aborted" in q)))
        throw new r(c, "AbortSignal", q);
    }, p = (q, c) => {
      if (typeof q != "function")
        throw new r(c, "Function", q);
    };
    t.exports = {
      AggregateError: f,
      kEmptyObject: Object.freeze({}),
      once(q) {
        let c = !1;
        return function(...v) {
          c || (c = !0, q.apply(this, v));
        };
      },
      createDeferredPromise: function() {
        let q, c;
        return {
          promise: new Promise((P, E) => {
            q = P, c = E;
          }),
          resolve: q,
          reject: c
        };
      },
      promisify(q) {
        return new Promise((c, v) => {
          q((P, ...E) => P ? v(P) : c(...E));
        });
      },
      debuglog() {
        return function() {
        };
      },
      format: n,
      inspect: s,
      types: {
        isAsyncFunction(q) {
          return q instanceof l;
        },
        isArrayBufferView(q) {
          return ArrayBuffer.isView(q);
        }
      },
      isBlob: w,
      deprecate(q, c) {
        return q;
      },
      addAbortListener: requireEvents().addAbortListener || function(c, v) {
        if (c === void 0)
          throw new r("signal", "AbortSignal", c);
        R(c, "signal"), p(v, "listener");
        let P;
        return c.aborted ? queueMicrotask(() => v()) : (c.addEventListener("abort", v, {
          __proto__: null,
          once: !0,
          [a]: !0
        }), P = () => {
          c.removeEventListener("abort", v);
        }), {
          __proto__: null,
          [u]() {
            var E;
            (E = P) === null || E === void 0 || E();
          }
        };
      },
      AbortSignalAny: h.any || function(c) {
        if (c.length === 1)
          return c[0];
        const v = new g(), P = () => v.abort();
        return c.forEach((E) => {
          R(E, "signals"), E.addEventListener("abort", P, {
            once: !0
          });
        }), v.signal.addEventListener(
          "abort",
          () => {
            c.forEach((E) => E.removeEventListener("abort", P));
          },
          {
            once: !0
          }
        ), v.signal;
      }
    }, t.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
  })(util)), util.exports;
}
var operators = {}, validators, hasRequiredValidators;
function requireValidators() {
  if (hasRequiredValidators) return validators;
  hasRequiredValidators = 1;
  const {
    ArrayIsArray: t,
    ArrayPrototypeIncludes: e,
    ArrayPrototypeJoin: n,
    ArrayPrototypeMap: s,
    NumberIsInteger: r,
    NumberIsNaN: a,
    NumberMAX_SAFE_INTEGER: f,
    NumberMIN_SAFE_INTEGER: u,
    NumberParseInt: h,
    ObjectPrototypeHasOwnProperty: g,
    RegExpPrototypeExec: l,
    String: m,
    StringPrototypeToUpperCase: w,
    StringPrototypeTrim: R
  } = requirePrimordials(), {
    hideStackFrames: p,
    codes: { ERR_SOCKET_BAD_PORT: q, ERR_INVALID_ARG_TYPE: c, ERR_INVALID_ARG_VALUE: v, ERR_OUT_OF_RANGE: P, ERR_UNKNOWN_SIGNAL: E }
  } = requireErrors(), { normalizeEncoding: I } = requireUtil(), { isAsyncFunction: A, isArrayBufferView: $ } = requireUtil().types, x = {};
  function M(te) {
    return te === (te | 0);
  }
  function V(te) {
    return te === te >>> 0;
  }
  const C = /^[0-7]+$/, z = "must be a 32-bit unsigned integer or an octal string";
  function y(te, $e, Ce) {
    if (typeof te > "u" && (te = Ce), typeof te == "string") {
      if (l(C, te) === null)
        throw new v($e, te, z);
      te = h(te, 8);
    }
    return de(te, $e), te;
  }
  const D = p((te, $e, Ce = u, Te = f) => {
    if (typeof te != "number") throw new c($e, "number", te);
    if (!r(te)) throw new P($e, "an integer", te);
    if (te < Ce || te > Te) throw new P($e, `>= ${Ce} && <= ${Te}`, te);
  }), ie = p((te, $e, Ce = -2147483648, Te = 2147483647) => {
    if (typeof te != "number")
      throw new c($e, "number", te);
    if (!r(te))
      throw new P($e, "an integer", te);
    if (te < Ce || te > Te)
      throw new P($e, `>= ${Ce} && <= ${Te}`, te);
  }), de = p((te, $e, Ce = !1) => {
    if (typeof te != "number")
      throw new c($e, "number", te);
    if (!r(te))
      throw new P($e, "an integer", te);
    const Te = Ce ? 1 : 0, Ue = 4294967295;
    if (te < Te || te > Ue)
      throw new P($e, `>= ${Te} && <= ${Ue}`, te);
  });
  function we(te, $e) {
    if (typeof te != "string") throw new c($e, "string", te);
  }
  function be(te, $e, Ce = void 0, Te) {
    if (typeof te != "number") throw new c($e, "number", te);
    if (Ce != null && te < Ce || Te != null && te > Te || (Ce != null || Te != null) && a(te))
      throw new P(
        $e,
        `${Ce != null ? `>= ${Ce}` : ""}${Ce != null && Te != null ? " && " : ""}${Te != null ? `<= ${Te}` : ""}`,
        te
      );
  }
  const ce = p((te, $e, Ce) => {
    if (!e(Ce, te)) {
      const Ue = "must be one of: " + n(
        s(Ce, (ge) => typeof ge == "string" ? `'${ge}'` : m(ge)),
        ", "
      );
      throw new v($e, te, Ue);
    }
  });
  function fe(te, $e) {
    if (typeof te != "boolean") throw new c($e, "boolean", te);
  }
  function j(te, $e, Ce) {
    return te == null || !g(te, $e) ? Ce : te[$e];
  }
  const pe = p((te, $e, Ce = null) => {
    const Te = j(Ce, "allowArray", !1), Ue = j(Ce, "allowFunction", !1);
    if (!j(Ce, "nullable", !1) && te === null || !Te && t(te) || typeof te != "object" && (!Ue || typeof te != "function"))
      throw new c($e, "Object", te);
  }), ee = p((te, $e) => {
    if (te != null && typeof te != "object" && typeof te != "function")
      throw new c($e, "a dictionary", te);
  }), X = p((te, $e, Ce = 0) => {
    if (!t(te))
      throw new c($e, "Array", te);
    if (te.length < Ce) {
      const Te = `must be longer than ${Ce}`;
      throw new v($e, te, Te);
    }
  });
  function G(te, $e) {
    X(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++)
      we(te[Ce], `${$e}[${Ce}]`);
  }
  function le(te, $e) {
    X(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++)
      fe(te[Ce], `${$e}[${Ce}]`);
  }
  function O(te, $e) {
    X(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++) {
      const Te = te[Ce], Ue = `${$e}[${Ce}]`;
      if (Te == null)
        throw new c(Ue, "AbortSignal", Te);
      F(Te, Ue);
    }
  }
  function B(te, $e = "signal") {
    if (we(te, $e), x[te] === void 0)
      throw x[w(te)] !== void 0 ? new E(te + " (signals must use all capital letters)") : new E(te);
  }
  const N = p((te, $e = "buffer") => {
    if (!$(te))
      throw new c($e, ["Buffer", "TypedArray", "DataView"], te);
  });
  function re(te, $e) {
    const Ce = I($e), Te = te.length;
    if (Ce === "hex" && Te % 2 !== 0)
      throw new v("encoding", $e, `is invalid for data of length ${Te}`);
  }
  function ne(te, $e = "Port", Ce = !0) {
    if (typeof te != "number" && typeof te != "string" || typeof te == "string" && R(te).length === 0 || +te !== +te >>> 0 || te > 65535 || te === 0 && !Ce)
      throw new q($e, te, Ce);
    return te | 0;
  }
  const F = p((te, $e) => {
    if (te !== void 0 && (te === null || typeof te != "object" || !("aborted" in te)))
      throw new c($e, "AbortSignal", te);
  }), L = p((te, $e) => {
    if (typeof te != "function") throw new c($e, "Function", te);
  }), H = p((te, $e) => {
    if (typeof te != "function" || A(te)) throw new c($e, "Function", te);
  }), se = p((te, $e) => {
    if (te !== void 0) throw new c($e, "undefined", te);
  });
  function Ee(te, $e, Ce) {
    if (!e(Ce, te))
      throw new c($e, `('${n(Ce, "|")}')`, te);
  }
  const Re = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function Pe(te, $e) {
    if (typeof te > "u" || !l(Re, te))
      throw new v(
        $e,
        te,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"'
      );
  }
  function Oe(te) {
    if (typeof te == "string")
      return Pe(te, "hints"), te;
    if (t(te)) {
      const $e = te.length;
      let Ce = "";
      if ($e === 0)
        return Ce;
      for (let Te = 0; Te < $e; Te++) {
        const Ue = te[Te];
        Pe(Ue, "hints"), Ce += Ue, Te !== $e - 1 && (Ce += ", ");
      }
      return Ce;
    }
    throw new v(
      "hints",
      te,
      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
    );
  }
  return validators = {
    isInt32: M,
    isUint32: V,
    parseFileMode: y,
    validateArray: X,
    validateStringArray: G,
    validateBooleanArray: le,
    validateAbortSignalArray: O,
    validateBoolean: fe,
    validateBuffer: N,
    validateDictionary: ee,
    validateEncoding: re,
    validateFunction: L,
    validateInt32: ie,
    validateInteger: D,
    validateNumber: be,
    validateObject: pe,
    validateOneOf: ce,
    validatePlainFunction: H,
    validatePort: ne,
    validateSignalName: B,
    validateString: we,
    validateUint32: de,
    validateUndefined: se,
    validateUnion: Ee,
    validateAbortSignal: F,
    validateLinkHeaderValue: Oe
  }, validators;
}
var endOfStream = { exports: {} }, browser = { exports: {} }, hasRequiredBrowser$1;
function requireBrowser$1() {
  if (hasRequiredBrowser$1) return browser.exports;
  hasRequiredBrowser$1 = 1;
  var t = browser.exports = {}, e, n;
  function s() {
    throw new Error("setTimeout has not been defined");
  }
  function r() {
    throw new Error("clearTimeout has not been defined");
  }
  (function() {
    try {
      typeof setTimeout == "function" ? e = setTimeout : e = s;
    } catch {
      e = s;
    }
    try {
      typeof clearTimeout == "function" ? n = clearTimeout : n = r;
    } catch {
      n = r;
    }
  })();
  function a(q) {
    if (e === setTimeout)
      return setTimeout(q, 0);
    if ((e === s || !e) && setTimeout)
      return e = setTimeout, setTimeout(q, 0);
    try {
      return e(q, 0);
    } catch {
      try {
        return e.call(null, q, 0);
      } catch {
        return e.call(this, q, 0);
      }
    }
  }
  function f(q) {
    if (n === clearTimeout)
      return clearTimeout(q);
    if ((n === r || !n) && clearTimeout)
      return n = clearTimeout, clearTimeout(q);
    try {
      return n(q);
    } catch {
      try {
        return n.call(null, q);
      } catch {
        return n.call(this, q);
      }
    }
  }
  var u = [], h = !1, g, l = -1;
  function m() {
    !h || !g || (h = !1, g.length ? u = g.concat(u) : l = -1, u.length && w());
  }
  function w() {
    if (!h) {
      var q = a(m);
      h = !0;
      for (var c = u.length; c; ) {
        for (g = u, u = []; ++l < c; )
          g && g[l].run();
        l = -1, c = u.length;
      }
      g = null, h = !1, f(q);
    }
  }
  t.nextTick = function(q) {
    var c = new Array(arguments.length - 1);
    if (arguments.length > 1)
      for (var v = 1; v < arguments.length; v++)
        c[v - 1] = arguments[v];
    u.push(new R(q, c)), u.length === 1 && !h && a(w);
  };
  function R(q, c) {
    this.fun = q, this.array = c;
  }
  R.prototype.run = function() {
    this.fun.apply(null, this.array);
  }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {};
  function p() {
  }
  return t.on = p, t.addListener = p, t.once = p, t.off = p, t.removeListener = p, t.removeAllListeners = p, t.emit = p, t.prependListener = p, t.prependOnceListener = p, t.listeners = function(q) {
    return [];
  }, t.binding = function(q) {
    throw new Error("process.binding is not supported");
  }, t.cwd = function() {
    return "/";
  }, t.chdir = function(q) {
    throw new Error("process.chdir is not supported");
  }, t.umask = function() {
    return 0;
  }, browser.exports;
}
var utils, hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  const { SymbolAsyncIterator: t, SymbolIterator: e, SymbolFor: n } = requirePrimordials(), s = n("nodejs.stream.destroyed"), r = n("nodejs.stream.errored"), a = n("nodejs.stream.readable"), f = n("nodejs.stream.writable"), u = n("nodejs.stream.disturbed"), h = n("nodejs.webstream.isClosedPromise"), g = n("nodejs.webstream.controllerErrorFunction");
  function l(j, pe = !1) {
    var ee;
    return !!(j && typeof j.pipe == "function" && typeof j.on == "function" && (!pe || typeof j.pause == "function" && typeof j.resume == "function") && (!j._writableState || ((ee = j._readableState) === null || ee === void 0 ? void 0 : ee.readable) !== !1) && // Duplex
    (!j._writableState || j._readableState));
  }
  function m(j) {
    var pe;
    return !!(j && typeof j.write == "function" && typeof j.on == "function" && (!j._readableState || ((pe = j._writableState) === null || pe === void 0 ? void 0 : pe.writable) !== !1));
  }
  function w(j) {
    return !!(j && typeof j.pipe == "function" && j._readableState && typeof j.on == "function" && typeof j.write == "function");
  }
  function R(j) {
    return j && (j._readableState || j._writableState || typeof j.write == "function" && typeof j.on == "function" || typeof j.pipe == "function" && typeof j.on == "function");
  }
  function p(j) {
    return !!(j && !R(j) && typeof j.pipeThrough == "function" && typeof j.getReader == "function" && typeof j.cancel == "function");
  }
  function q(j) {
    return !!(j && !R(j) && typeof j.getWriter == "function" && typeof j.abort == "function");
  }
  function c(j) {
    return !!(j && !R(j) && typeof j.readable == "object" && typeof j.writable == "object");
  }
  function v(j) {
    return p(j) || q(j) || c(j);
  }
  function P(j, pe) {
    return j == null ? !1 : pe === !0 ? typeof j[t] == "function" : pe === !1 ? typeof j[e] == "function" : typeof j[t] == "function" || typeof j[e] == "function";
  }
  function E(j) {
    if (!R(j)) return null;
    const pe = j._writableState, ee = j._readableState, X = pe || ee;
    return !!(j.destroyed || j[s] || X != null && X.destroyed);
  }
  function I(j) {
    if (!m(j)) return null;
    if (j.writableEnded === !0) return !0;
    const pe = j._writableState;
    return pe != null && pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function A(j, pe) {
    if (!m(j)) return null;
    if (j.writableFinished === !0) return !0;
    const ee = j._writableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.finished) != "boolean" ? null : !!(ee.finished || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function $(j) {
    if (!l(j)) return null;
    if (j.readableEnded === !0) return !0;
    const pe = j._readableState;
    return !pe || pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function x(j, pe) {
    if (!l(j)) return null;
    const ee = j._readableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.endEmitted) != "boolean" ? null : !!(ee.endEmitted || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function M(j) {
    return j && j[a] != null ? j[a] : typeof (j == null ? void 0 : j.readable) != "boolean" ? null : E(j) ? !1 : l(j) && j.readable && !x(j);
  }
  function V(j) {
    return j && j[f] != null ? j[f] : typeof (j == null ? void 0 : j.writable) != "boolean" ? null : E(j) ? !1 : m(j) && j.writable && !I(j);
  }
  function C(j, pe) {
    return R(j) ? E(j) ? !0 : !((pe == null ? void 0 : pe.readable) !== !1 && M(j) || (pe == null ? void 0 : pe.writable) !== !1 && V(j)) : null;
  }
  function z(j) {
    var pe, ee;
    return R(j) ? j.writableErrored ? j.writableErrored : (pe = (ee = j._writableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function y(j) {
    var pe, ee;
    return R(j) ? j.readableErrored ? j.readableErrored : (pe = (ee = j._readableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function D(j) {
    if (!R(j))
      return null;
    if (typeof j.closed == "boolean")
      return j.closed;
    const pe = j._writableState, ee = j._readableState;
    return typeof (pe == null ? void 0 : pe.closed) == "boolean" || typeof (ee == null ? void 0 : ee.closed) == "boolean" ? (pe == null ? void 0 : pe.closed) || (ee == null ? void 0 : ee.closed) : typeof j._closed == "boolean" && ie(j) ? j._closed : null;
  }
  function ie(j) {
    return typeof j._closed == "boolean" && typeof j._defaultKeepAlive == "boolean" && typeof j._removedConnection == "boolean" && typeof j._removedContLen == "boolean";
  }
  function de(j) {
    return typeof j._sent100 == "boolean" && ie(j);
  }
  function we(j) {
    var pe;
    return typeof j._consuming == "boolean" && typeof j._dumped == "boolean" && ((pe = j.req) === null || pe === void 0 ? void 0 : pe.upgradeOrConnect) === void 0;
  }
  function be(j) {
    if (!R(j)) return null;
    const pe = j._writableState, ee = j._readableState, X = pe || ee;
    return !X && de(j) || !!(X && X.autoDestroy && X.emitClose && X.closed === !1);
  }
  function ce(j) {
    var pe;
    return !!(j && ((pe = j[u]) !== null && pe !== void 0 ? pe : j.readableDidRead || j.readableAborted));
  }
  function fe(j) {
    var pe, ee, X, G, le, O, B, N, re, ne;
    return !!(j && ((pe = (ee = (X = (G = (le = (O = j[r]) !== null && O !== void 0 ? O : j.readableErrored) !== null && le !== void 0 ? le : j.writableErrored) !== null && G !== void 0 ? G : (B = j._readableState) === null || B === void 0 ? void 0 : B.errorEmitted) !== null && X !== void 0 ? X : (N = j._writableState) === null || N === void 0 ? void 0 : N.errorEmitted) !== null && ee !== void 0 ? ee : (re = j._readableState) === null || re === void 0 ? void 0 : re.errored) !== null && pe !== void 0 ? pe : !((ne = j._writableState) === null || ne === void 0) && ne.errored));
  }
  return utils = {
    isDestroyed: E,
    kIsDestroyed: s,
    isDisturbed: ce,
    kIsDisturbed: u,
    isErrored: fe,
    kIsErrored: r,
    isReadable: M,
    kIsReadable: a,
    kIsClosedPromise: h,
    kControllerErrorFunction: g,
    kIsWritable: f,
    isClosed: D,
    isDuplexNodeStream: w,
    isFinished: C,
    isIterable: P,
    isReadableNodeStream: l,
    isReadableStream: p,
    isReadableEnded: $,
    isReadableFinished: x,
    isReadableErrored: y,
    isNodeStream: R,
    isWebStream: v,
    isWritable: V,
    isWritableNodeStream: m,
    isWritableStream: q,
    isWritableEnded: I,
    isWritableFinished: A,
    isWritableErrored: z,
    isServerRequest: we,
    isServerResponse: de,
    willEmitClose: be,
    isTransformStream: c
  }, utils;
}
var hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream.exports;
  hasRequiredEndOfStream = 1;
  const t = requireBrowser$1(), { AbortError: e, codes: n } = requireErrors(), { ERR_INVALID_ARG_TYPE: s, ERR_STREAM_PREMATURE_CLOSE: r } = n, { kEmptyObject: a, once: f } = requireUtil(), { validateAbortSignal: u, validateFunction: h, validateObject: g, validateBoolean: l } = requireValidators(), { Promise: m, PromisePrototypeThen: w, SymbolDispose: R } = requirePrimordials(), {
    isClosed: p,
    isReadable: q,
    isReadableNodeStream: c,
    isReadableStream: v,
    isReadableFinished: P,
    isReadableErrored: E,
    isWritable: I,
    isWritableNodeStream: A,
    isWritableStream: $,
    isWritableFinished: x,
    isWritableErrored: M,
    isNodeStream: V,
    willEmitClose: C,
    kIsClosedPromise: z
  } = requireUtils();
  let y;
  function D(ce) {
    return ce.setHeader && typeof ce.abort == "function";
  }
  const ie = () => {
  };
  function de(ce, fe, j) {
    var pe, ee;
    if (arguments.length === 2 ? (j = fe, fe = a) : fe == null ? fe = a : g(fe, "options"), h(j, "callback"), u(fe.signal, "options.signal"), j = f(j), v(ce) || $(ce))
      return we(ce, fe, j);
    if (!V(ce))
      throw new s("stream", ["ReadableStream", "WritableStream", "Stream"], ce);
    const X = (pe = fe.readable) !== null && pe !== void 0 ? pe : c(ce), G = (ee = fe.writable) !== null && ee !== void 0 ? ee : A(ce), le = ce._writableState, O = ce._readableState, B = () => {
      ce.writable || ne();
    };
    let N = C(ce) && c(ce) === X && A(ce) === G, re = x(ce, !1);
    const ne = () => {
      re = !0, ce.destroyed && (N = !1), !(N && (!ce.readable || X)) && (!X || F) && j.call(ce);
    };
    let F = P(ce, !1);
    const L = () => {
      F = !0, ce.destroyed && (N = !1), !(N && (!ce.writable || G)) && (!G || re) && j.call(ce);
    }, H = (te) => {
      j.call(ce, te);
    };
    let se = p(ce);
    const Ee = () => {
      se = !0;
      const te = M(ce) || E(ce);
      if (te && typeof te != "boolean")
        return j.call(ce, te);
      if (X && !F && c(ce, !0) && !P(ce, !1))
        return j.call(ce, new r());
      if (G && !re && !x(ce, !1))
        return j.call(ce, new r());
      j.call(ce);
    }, Re = () => {
      se = !0;
      const te = M(ce) || E(ce);
      if (te && typeof te != "boolean")
        return j.call(ce, te);
      j.call(ce);
    }, Pe = () => {
      ce.req.on("finish", ne);
    };
    D(ce) ? (ce.on("complete", ne), N || ce.on("abort", Ee), ce.req ? Pe() : ce.on("request", Pe)) : G && !le && (ce.on("end", B), ce.on("close", B)), !N && typeof ce.aborted == "boolean" && ce.on("aborted", Ee), ce.on("end", L), ce.on("finish", ne), fe.error !== !1 && ce.on("error", H), ce.on("close", Ee), se ? t.nextTick(Ee) : le != null && le.errorEmitted || O != null && O.errorEmitted ? N || t.nextTick(Re) : (!X && (!N || q(ce)) && (re || I(ce) === !1) || !G && (!N || I(ce)) && (F || q(ce) === !1) || O && ce.req && ce.aborted) && t.nextTick(Re);
    const Oe = () => {
      j = ie, ce.removeListener("aborted", Ee), ce.removeListener("complete", ne), ce.removeListener("abort", Ee), ce.removeListener("request", Pe), ce.req && ce.req.removeListener("finish", ne), ce.removeListener("end", B), ce.removeListener("close", B), ce.removeListener("finish", ne), ce.removeListener("end", L), ce.removeListener("error", H), ce.removeListener("close", Ee);
    };
    if (fe.signal && !se) {
      const te = () => {
        const $e = j;
        Oe(), $e.call(
          ce,
          new e(void 0, {
            cause: fe.signal.reason
          })
        );
      };
      if (fe.signal.aborted)
        t.nextTick(te);
      else {
        y = y || requireUtil().addAbortListener;
        const $e = y(fe.signal, te), Ce = j;
        j = f((...Te) => {
          $e[R](), Ce.apply(ce, Te);
        });
      }
    }
    return Oe;
  }
  function we(ce, fe, j) {
    let pe = !1, ee = ie;
    if (fe.signal)
      if (ee = () => {
        pe = !0, j.call(
          ce,
          new e(void 0, {
            cause: fe.signal.reason
          })
        );
      }, fe.signal.aborted)
        t.nextTick(ee);
      else {
        y = y || requireUtil().addAbortListener;
        const G = y(fe.signal, ee), le = j;
        j = f((...O) => {
          G[R](), le.apply(ce, O);
        });
      }
    const X = (...G) => {
      pe || t.nextTick(() => j.apply(ce, G));
    };
    return w(ce[z].promise, X, X), ie;
  }
  function be(ce, fe) {
    var j;
    let pe = !1;
    return fe === null && (fe = a), (j = fe) !== null && j !== void 0 && j.cleanup && (l(fe.cleanup, "cleanup"), pe = fe.cleanup), new m((ee, X) => {
      const G = de(ce, fe, (le) => {
        pe && G(), le ? X(le) : ee();
      });
    });
  }
  return endOfStream.exports = de, endOfStream.exports.finished = be, endOfStream.exports;
}
var destroy_1, hasRequiredDestroy;
function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1;
  hasRequiredDestroy = 1;
  const t = requireBrowser$1(), {
    aggregateTwoErrors: e,
    codes: { ERR_MULTIPLE_CALLBACK: n },
    AbortError: s
  } = requireErrors(), { Symbol: r } = requirePrimordials(), { kIsDestroyed: a, isDestroyed: f, isFinished: u, isServerRequest: h } = requireUtils(), g = r("kDestroy"), l = r("kConstruct");
  function m(C, z, y) {
    C && (C.stack, z && !z.errored && (z.errored = C), y && !y.errored && (y.errored = C));
  }
  function w(C, z) {
    const y = this._readableState, D = this._writableState, ie = D || y;
    return D != null && D.destroyed || y != null && y.destroyed ? (typeof z == "function" && z(), this) : (m(C, D, y), D && (D.destroyed = !0), y && (y.destroyed = !0), ie.constructed ? R(this, C, z) : this.once(g, function(de) {
      R(this, e(de, C), z);
    }), this);
  }
  function R(C, z, y) {
    let D = !1;
    function ie(de) {
      if (D)
        return;
      D = !0;
      const we = C._readableState, be = C._writableState;
      m(de, be, we), be && (be.closed = !0), we && (we.closed = !0), typeof y == "function" && y(de), de ? t.nextTick(p, C, de) : t.nextTick(q, C);
    }
    try {
      C._destroy(z || null, ie);
    } catch (de) {
      ie(de);
    }
  }
  function p(C, z) {
    c(C, z), q(C);
  }
  function q(C) {
    const z = C._readableState, y = C._writableState;
    y && (y.closeEmitted = !0), z && (z.closeEmitted = !0), (y != null && y.emitClose || z != null && z.emitClose) && C.emit("close");
  }
  function c(C, z) {
    const y = C._readableState, D = C._writableState;
    D != null && D.errorEmitted || y != null && y.errorEmitted || (D && (D.errorEmitted = !0), y && (y.errorEmitted = !0), C.emit("error", z));
  }
  function v() {
    const C = this._readableState, z = this._writableState;
    C && (C.constructed = !0, C.closed = !1, C.closeEmitted = !1, C.destroyed = !1, C.errored = null, C.errorEmitted = !1, C.reading = !1, C.ended = C.readable === !1, C.endEmitted = C.readable === !1), z && (z.constructed = !0, z.destroyed = !1, z.closed = !1, z.closeEmitted = !1, z.errored = null, z.errorEmitted = !1, z.finalCalled = !1, z.prefinished = !1, z.ended = z.writable === !1, z.ending = z.writable === !1, z.finished = z.writable === !1);
  }
  function P(C, z, y) {
    const D = C._readableState, ie = C._writableState;
    if (ie != null && ie.destroyed || D != null && D.destroyed)
      return this;
    D != null && D.autoDestroy || ie != null && ie.autoDestroy ? C.destroy(z) : z && (z.stack, ie && !ie.errored && (ie.errored = z), D && !D.errored && (D.errored = z), y ? t.nextTick(c, C, z) : c(C, z));
  }
  function E(C, z) {
    if (typeof C._construct != "function")
      return;
    const y = C._readableState, D = C._writableState;
    y && (y.constructed = !1), D && (D.constructed = !1), C.once(l, z), !(C.listenerCount(l) > 1) && t.nextTick(I, C);
  }
  function I(C) {
    let z = !1;
    function y(D) {
      if (z) {
        P(C, D ?? new n());
        return;
      }
      z = !0;
      const ie = C._readableState, de = C._writableState, we = de || ie;
      ie && (ie.constructed = !0), de && (de.constructed = !0), we.destroyed ? C.emit(g, D) : D ? P(C, D, !0) : t.nextTick(A, C);
    }
    try {
      C._construct((D) => {
        t.nextTick(y, D);
      });
    } catch (D) {
      t.nextTick(y, D);
    }
  }
  function A(C) {
    C.emit(l);
  }
  function $(C) {
    return (C == null ? void 0 : C.setHeader) && typeof C.abort == "function";
  }
  function x(C) {
    C.emit("close");
  }
  function M(C, z) {
    C.emit("error", z), t.nextTick(x, C);
  }
  function V(C, z) {
    !C || f(C) || (!z && !u(C) && (z = new s()), h(C) ? (C.socket = null, C.destroy(z)) : $(C) ? C.abort() : $(C.req) ? C.req.abort() : typeof C.destroy == "function" ? C.destroy(z) : typeof C.close == "function" ? C.close() : z ? t.nextTick(M, C, z) : t.nextTick(x, C), C.destroyed || (C[a] = !0));
  }
  return destroy_1 = {
    construct: E,
    destroyer: V,
    destroy: w,
    undestroy: v,
    errorOrDestroy: P
  }, destroy_1;
}
var legacy, hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  const { ArrayIsArray: t, ObjectSetPrototypeOf: e } = requirePrimordials(), { EventEmitter: n } = requireEvents();
  function s(a) {
    n.call(this, a);
  }
  e(s.prototype, n.prototype), e(s, n), s.prototype.pipe = function(a, f) {
    const u = this;
    function h(q) {
      a.writable && a.write(q) === !1 && u.pause && u.pause();
    }
    u.on("data", h);
    function g() {
      u.readable && u.resume && u.resume();
    }
    a.on("drain", g), !a._isStdio && (!f || f.end !== !1) && (u.on("end", m), u.on("close", w));
    let l = !1;
    function m() {
      l || (l = !0, a.end());
    }
    function w() {
      l || (l = !0, typeof a.destroy == "function" && a.destroy());
    }
    function R(q) {
      p(), n.listenerCount(this, "error") === 0 && this.emit("error", q);
    }
    r(u, "error", R), r(a, "error", R);
    function p() {
      u.removeListener("data", h), a.removeListener("drain", g), u.removeListener("end", m), u.removeListener("close", w), u.removeListener("error", R), a.removeListener("error", R), u.removeListener("end", p), u.removeListener("close", p), a.removeListener("close", p);
    }
    return u.on("end", p), u.on("close", p), a.on("close", p), a.emit("pipe", u), a;
  };
  function r(a, f, u) {
    if (typeof a.prependListener == "function") return a.prependListener(f, u);
    !a._events || !a._events[f] ? a.on(f, u) : t(a._events[f]) ? a._events[f].unshift(u) : a._events[f] = [u, a._events[f]];
  }
  return legacy = {
    Stream: s,
    prependListener: r
  }, legacy;
}
var addAbortSignal = { exports: {} }, hasRequiredAddAbortSignal;
function requireAddAbortSignal() {
  return hasRequiredAddAbortSignal || (hasRequiredAddAbortSignal = 1, (function(t) {
    const { SymbolDispose: e } = requirePrimordials(), { AbortError: n, codes: s } = requireErrors(), { isNodeStream: r, isWebStream: a, kControllerErrorFunction: f } = requireUtils(), u = requireEndOfStream(), { ERR_INVALID_ARG_TYPE: h } = s;
    let g;
    const l = (m, w) => {
      if (typeof m != "object" || !("aborted" in m))
        throw new h(w, "AbortSignal", m);
    };
    t.exports.addAbortSignal = function(w, R) {
      if (l(w, "signal"), !r(R) && !a(R))
        throw new h("stream", ["ReadableStream", "WritableStream", "Stream"], R);
      return t.exports.addAbortSignalNoValidate(w, R);
    }, t.exports.addAbortSignalNoValidate = function(m, w) {
      if (typeof m != "object" || !("aborted" in m))
        return w;
      const R = r(w) ? () => {
        w.destroy(
          new n(void 0, {
            cause: m.reason
          })
        );
      } : () => {
        w[f](
          new n(void 0, {
            cause: m.reason
          })
        );
      };
      if (m.aborted)
        R();
      else {
        g = g || requireUtil().addAbortListener;
        const p = g(m, R);
        u(w, p[e]);
      }
      return w;
    };
  })(addAbortSignal)), addAbortSignal.exports;
}
var buffer_list, hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  const { StringPrototypeSlice: t, SymbolIterator: e, TypedArrayPrototypeSet: n, Uint8Array: s } = requirePrimordials(), { Buffer: r } = requireDist(), { inspect: a } = requireUtil();
  return buffer_list = class {
    constructor() {
      this.head = null, this.tail = null, this.length = 0;
    }
    push(u) {
      const h = {
        data: u,
        next: null
      };
      this.length > 0 ? this.tail.next = h : this.head = h, this.tail = h, ++this.length;
    }
    unshift(u) {
      const h = {
        data: u,
        next: this.head
      };
      this.length === 0 && (this.tail = h), this.head = h, ++this.length;
    }
    shift() {
      if (this.length === 0) return;
      const u = this.head.data;
      return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, u;
    }
    clear() {
      this.head = this.tail = null, this.length = 0;
    }
    join(u) {
      if (this.length === 0) return "";
      let h = this.head, g = "" + h.data;
      for (; (h = h.next) !== null; ) g += u + h.data;
      return g;
    }
    concat(u) {
      if (this.length === 0) return r.alloc(0);
      const h = r.allocUnsafe(u >>> 0);
      let g = this.head, l = 0;
      for (; g; )
        n(h, g.data, l), l += g.data.length, g = g.next;
      return h;
    }
    // Consumes a specified amount of bytes or characters from the buffered data.
    consume(u, h) {
      const g = this.head.data;
      if (u < g.length) {
        const l = g.slice(0, u);
        return this.head.data = g.slice(u), l;
      }
      return u === g.length ? this.shift() : h ? this._getString(u) : this._getBuffer(u);
    }
    first() {
      return this.head.data;
    }
    *[e]() {
      for (let u = this.head; u; u = u.next)
        yield u.data;
    }
    // Consumes a specified amount of characters from the buffered data.
    _getString(u) {
      let h = "", g = this.head, l = 0;
      do {
        const m = g.data;
        if (u > m.length)
          h += m, u -= m.length;
        else {
          u === m.length ? (h += m, ++l, g.next ? this.head = g.next : this.head = this.tail = null) : (h += t(m, 0, u), this.head = g, g.data = t(m, u));
          break;
        }
        ++l;
      } while ((g = g.next) !== null);
      return this.length -= l, h;
    }
    // Consumes a specified amount of bytes from the buffered data.
    _getBuffer(u) {
      const h = r.allocUnsafe(u), g = u;
      let l = this.head, m = 0;
      do {
        const w = l.data;
        if (u > w.length)
          n(h, w, g - u), u -= w.length;
        else {
          u === w.length ? (n(h, w, g - u), ++m, l.next ? this.head = l.next : this.head = this.tail = null) : (n(h, new s(w.buffer, w.byteOffset, u), g - u), this.head = l, l.data = w.slice(u));
          break;
        }
        ++m;
      } while ((l = l.next) !== null);
      return this.length -= m, h;
    }
    // Make sure the linked list only shows the minimal necessary information.
    [Symbol.for("nodejs.util.inspect.custom")](u, h) {
      return a(this, {
        ...h,
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: !1
      });
    }
  }, buffer_list;
}
var state, hasRequiredState;
function requireState() {
  if (hasRequiredState) return state;
  hasRequiredState = 1;
  const { MathFloor: t, NumberIsInteger: e } = requirePrimordials(), { validateInteger: n } = requireValidators(), { ERR_INVALID_ARG_VALUE: s } = requireErrors().codes;
  let r = 16 * 1024, a = 16;
  function f(l, m, w) {
    return l.highWaterMark != null ? l.highWaterMark : m ? l[w] : null;
  }
  function u(l) {
    return l ? a : r;
  }
  function h(l, m) {
    n(m, "value", 0), l ? a = m : r = m;
  }
  function g(l, m, w, R) {
    const p = f(m, R, w);
    if (p != null) {
      if (!e(p) || p < 0) {
        const q = R ? `options.${w}` : "options.highWaterMark";
        throw new s(q, p);
      }
      return t(p);
    }
    return u(l.objectMode);
  }
  return state = {
    getHighWaterMark: g,
    getDefaultHighWaterMark: u,
    setDefaultHighWaterMark: h
  }, state;
}
var from_1, hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from_1;
  hasRequiredFrom = 1;
  const t = requireBrowser$1(), { PromisePrototypeThen: e, SymbolAsyncIterator: n, SymbolIterator: s } = requirePrimordials(), { Buffer: r } = requireDist(), { ERR_INVALID_ARG_TYPE: a, ERR_STREAM_NULL_VALUES: f } = requireErrors().codes;
  function u(h, g, l) {
    let m;
    if (typeof g == "string" || g instanceof r)
      return new h({
        objectMode: !0,
        ...l,
        read() {
          this.push(g), this.push(null);
        }
      });
    let w;
    if (g && g[n])
      w = !0, m = g[n]();
    else if (g && g[s])
      w = !1, m = g[s]();
    else
      throw new a("iterable", ["Iterable"], g);
    const R = new h({
      objectMode: !0,
      highWaterMark: 1,
      // TODO(ronag): What options should be allowed?
      ...l
    });
    let p = !1;
    R._read = function() {
      p || (p = !0, c());
    }, R._destroy = function(v, P) {
      e(
        q(v),
        () => t.nextTick(P, v),
        // nextTick is here in case cb throws
        (E) => t.nextTick(P, E || v)
      );
    };
    async function q(v) {
      const P = v != null, E = typeof m.throw == "function";
      if (P && E) {
        const { value: I, done: A } = await m.throw(v);
        if (await I, A)
          return;
      }
      if (typeof m.return == "function") {
        const { value: I } = await m.return();
        await I;
      }
    }
    async function c() {
      for (; ; ) {
        try {
          const { value: v, done: P } = w ? await m.next() : m.next();
          if (P)
            R.push(null);
          else {
            const E = v && typeof v.then == "function" ? await v : v;
            if (E === null)
              throw p = !1, new f();
            if (R.push(E))
              continue;
            p = !1;
          }
        } catch (v) {
          R.destroy(v);
        }
        break;
      }
    }
    return R;
  }
  return from_1 = u, from_1;
}
var readable, hasRequiredReadable;
function requireReadable() {
  if (hasRequiredReadable) return readable;
  hasRequiredReadable = 1;
  const t = requireBrowser$1(), {
    ArrayPrototypeIndexOf: e,
    NumberIsInteger: n,
    NumberIsNaN: s,
    NumberParseInt: r,
    ObjectDefineProperties: a,
    ObjectKeys: f,
    ObjectSetPrototypeOf: u,
    Promise: h,
    SafeSet: g,
    SymbolAsyncDispose: l,
    SymbolAsyncIterator: m,
    Symbol: w
  } = requirePrimordials();
  readable = Te, Te.ReadableState = Ce;
  const { EventEmitter: R } = requireEvents(), { Stream: p, prependListener: q } = requireLegacy(), { Buffer: c } = requireDist(), { addAbortSignal: v } = requireAddAbortSignal(), P = requireEndOfStream();
  let E = requireUtil().debuglog("stream", (K) => {
    E = K;
  });
  const I = requireBuffer_list(), A = requireDestroy(), { getHighWaterMark: $, getDefaultHighWaterMark: x } = requireState(), {
    aggregateTwoErrors: M,
    codes: {
      ERR_INVALID_ARG_TYPE: V,
      ERR_METHOD_NOT_IMPLEMENTED: C,
      ERR_OUT_OF_RANGE: z,
      ERR_STREAM_PUSH_AFTER_EOF: y,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT: D
    },
    AbortError: ie
  } = requireErrors(), { validateObject: de } = requireValidators(), we = w("kPaused"), { StringDecoder: be } = requireString_decoder(), ce = requireFrom();
  u(Te.prototype, p.prototype), u(Te, p);
  const fe = () => {
  }, { errorOrDestroy: j } = A, pe = 1, ee = 2, X = 4, G = 8, le = 16, O = 32, B = 64, N = 128, re = 256, ne = 512, F = 1024, L = 2048, H = 4096, se = 8192, Ee = 16384, Re = 32768, Pe = 65536, Oe = 1 << 17, te = 1 << 18;
  function $e(K) {
    return {
      enumerable: !1,
      get() {
        return (this.state & K) !== 0;
      },
      set(b) {
        b ? this.state |= K : this.state &= ~K;
      }
    };
  }
  a(Ce.prototype, {
    objectMode: $e(pe),
    ended: $e(ee),
    endEmitted: $e(X),
    reading: $e(G),
    // Stream is still being constructed and cannot be
    // destroyed until construction finished or failed.
    // Async construction is opt in, therefore we start as
    // constructed.
    constructed: $e(le),
    // A flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    sync: $e(O),
    // Whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    needReadable: $e(B),
    emittedReadable: $e(N),
    readableListening: $e(re),
    resumeScheduled: $e(ne),
    // True if the error was already emitted and should not be thrown again.
    errorEmitted: $e(F),
    emitClose: $e(L),
    autoDestroy: $e(H),
    // Has it been destroyed.
    destroyed: $e(se),
    // Indicates whether the stream has finished destroying.
    closed: $e(Ee),
    // True if close has been emitted or would have been emitted
    // depending on emitClose.
    closeEmitted: $e(Re),
    multiAwaitDrain: $e(Pe),
    // If true, a maybeReadMore has been scheduled.
    readingMore: $e(Oe),
    dataEmitted: $e(te)
  });
  function Ce(K, b, d) {
    typeof d != "boolean" && (d = b instanceof requireDuplex()), this.state = L | H | le | O, K && K.objectMode && (this.state |= pe), d && K && K.readableObjectMode && (this.state |= pe), this.highWaterMark = K ? $(this, K, "readableHighWaterMark", d) : x(!1), this.buffer = new I(), this.length = 0, this.pipes = [], this.flowing = null, this[we] = null, K && K.emitClose === !1 && (this.state &= ~L), K && K.autoDestroy === !1 && (this.state &= ~H), this.errored = null, this.defaultEncoding = K && K.defaultEncoding || "utf8", this.awaitDrainWriters = null, this.decoder = null, this.encoding = null, K && K.encoding && (this.decoder = new be(K.encoding), this.encoding = K.encoding);
  }
  function Te(K) {
    if (!(this instanceof Te)) return new Te(K);
    const b = this instanceof requireDuplex();
    this._readableState = new Ce(K, this, b), K && (typeof K.read == "function" && (this._read = K.read), typeof K.destroy == "function" && (this._destroy = K.destroy), typeof K.construct == "function" && (this._construct = K.construct), K.signal && !b && v(K.signal, this)), p.call(this, K), A.construct(this, () => {
      this._readableState.needReadable && o(this, this._readableState);
    });
  }
  Te.prototype.destroy = A.destroy, Te.prototype._undestroy = A.undestroy, Te.prototype._destroy = function(K, b) {
    b(K);
  }, Te.prototype[R.captureRejectionSymbol] = function(K) {
    this.destroy(K);
  }, Te.prototype[l] = function() {
    let K;
    return this.destroyed || (K = this.readableEnded ? null : new ie(), this.destroy(K)), new h((b, d) => P(this, (T) => T && T !== K ? d(T) : b(null)));
  }, Te.prototype.push = function(K, b) {
    return Ue(this, K, b, !1);
  }, Te.prototype.unshift = function(K, b) {
    return Ue(this, K, b, !0);
  };
  function Ue(K, b, d, T) {
    E("readableAddChunk", b);
    const Q = K._readableState;
    let ye;
    if ((Q.state & pe) === 0 && (typeof b == "string" ? (d = d || Q.defaultEncoding, Q.encoding !== d && (T && Q.encoding ? b = c.from(b, d).toString(Q.encoding) : (b = c.from(b, d), d = ""))) : b instanceof c ? d = "" : p._isUint8Array(b) ? (b = p._uint8ArrayToBuffer(b), d = "") : b != null && (ye = new V("chunk", ["string", "Buffer", "Uint8Array"], b))), ye)
      j(K, ye);
    else if (b === null)
      Q.state &= ~G, ke(K, Q);
    else if ((Q.state & pe) !== 0 || b && b.length > 0)
      if (T)
        if ((Q.state & X) !== 0) j(K, new D());
        else {
          if (Q.destroyed || Q.errored) return !1;
          ge(K, Q, b, !0);
        }
      else if (Q.ended)
        j(K, new y());
      else {
        if (Q.destroyed || Q.errored)
          return !1;
        Q.state &= ~G, Q.decoder && !d ? (b = Q.decoder.write(b), Q.objectMode || b.length !== 0 ? ge(K, Q, b, !1) : o(K, Q)) : ge(K, Q, b, !1);
      }
    else T || (Q.state &= ~G, o(K, Q));
    return !Q.ended && (Q.length < Q.highWaterMark || Q.length === 0);
  }
  function ge(K, b, d, T) {
    b.flowing && b.length === 0 && !b.sync && K.listenerCount("data") > 0 ? ((b.state & Pe) !== 0 ? b.awaitDrainWriters.clear() : b.awaitDrainWriters = null, b.dataEmitted = !0, K.emit("data", d)) : (b.length += b.objectMode ? 1 : d.length, T ? b.buffer.unshift(d) : b.buffer.push(d), (b.state & B) !== 0 && He(K)), o(K, b);
  }
  Te.prototype.isPaused = function() {
    const K = this._readableState;
    return K[we] === !0 || K.flowing === !1;
  }, Te.prototype.setEncoding = function(K) {
    const b = new be(K);
    this._readableState.decoder = b, this._readableState.encoding = this._readableState.decoder.encoding;
    const d = this._readableState.buffer;
    let T = "";
    for (const Q of d)
      T += b.write(Q);
    return d.clear(), T !== "" && d.push(T), this._readableState.length = T.length, this;
  };
  const Se = 1073741824;
  function Le(K) {
    if (K > Se)
      throw new z("size", "<= 1GiB", K);
    return K--, K |= K >>> 1, K |= K >>> 2, K |= K >>> 4, K |= K >>> 8, K |= K >>> 16, K++, K;
  }
  function Me(K, b) {
    return K <= 0 || b.length === 0 && b.ended ? 0 : (b.state & pe) !== 0 ? 1 : s(K) ? b.flowing && b.length ? b.buffer.first().length : b.length : K <= b.length ? K : b.ended ? b.length : 0;
  }
  Te.prototype.read = function(K) {
    E("read", K), K === void 0 ? K = NaN : n(K) || (K = r(K, 10));
    const b = this._readableState, d = K;
    if (K > b.highWaterMark && (b.highWaterMark = Le(K)), K !== 0 && (b.state &= ~N), K === 0 && b.needReadable && ((b.highWaterMark !== 0 ? b.length >= b.highWaterMark : b.length > 0) || b.ended))
      return E("read: emitReadable", b.length, b.ended), b.length === 0 && b.ended ? Fe(this) : He(this), null;
    if (K = Me(K, b), K === 0 && b.ended)
      return b.length === 0 && Fe(this), null;
    let T = (b.state & B) !== 0;
    if (E("need readable", T), (b.length === 0 || b.length - K < b.highWaterMark) && (T = !0, E("length less than watermark", T)), b.ended || b.reading || b.destroyed || b.errored || !b.constructed)
      T = !1, E("reading, ended or constructing", T);
    else if (T) {
      E("do read"), b.state |= G | O, b.length === 0 && (b.state |= B);
      try {
        this._read(b.highWaterMark);
      } catch (ye) {
        j(this, ye);
      }
      b.state &= ~O, b.reading || (K = Me(d, b));
    }
    let Q;
    return K > 0 ? Q = Ie(K, b) : Q = null, Q === null ? (b.needReadable = b.length <= b.highWaterMark, K = 0) : (b.length -= K, b.multiAwaitDrain ? b.awaitDrainWriters.clear() : b.awaitDrainWriters = null), b.length === 0 && (b.ended || (b.needReadable = !0), d !== K && b.ended && Fe(this)), Q !== null && !b.errorEmitted && !b.closeEmitted && (b.dataEmitted = !0, this.emit("data", Q)), Q;
  };
  function ke(K, b) {
    if (E("onEofChunk"), !b.ended) {
      if (b.decoder) {
        const d = b.decoder.end();
        d && d.length && (b.buffer.push(d), b.length += b.objectMode ? 1 : d.length);
      }
      b.ended = !0, b.sync ? He(K) : (b.needReadable = !1, b.emittedReadable = !0, U(K));
    }
  }
  function He(K) {
    const b = K._readableState;
    E("emitReadable", b.needReadable, b.emittedReadable), b.needReadable = !1, b.emittedReadable || (E("emitReadable", b.flowing), b.emittedReadable = !0, t.nextTick(U, K));
  }
  function U(K) {
    const b = K._readableState;
    E("emitReadable_", b.destroyed, b.length, b.ended), !b.destroyed && !b.errored && (b.length || b.ended) && (K.emit("readable"), b.emittedReadable = !1), b.needReadable = !b.flowing && !b.ended && b.length <= b.highWaterMark, Be(K);
  }
  function o(K, b) {
    !b.readingMore && b.constructed && (b.readingMore = !0, t.nextTick(_, K, b));
  }
  function _(K, b) {
    for (; !b.reading && !b.ended && (b.length < b.highWaterMark || b.flowing && b.length === 0); ) {
      const d = b.length;
      if (E("maybeReadMore read 0"), K.read(0), d === b.length)
        break;
    }
    b.readingMore = !1;
  }
  Te.prototype._read = function(K) {
    throw new C("_read()");
  }, Te.prototype.pipe = function(K, b) {
    const d = this, T = this._readableState;
    T.pipes.length === 1 && (T.multiAwaitDrain || (T.multiAwaitDrain = !0, T.awaitDrainWriters = new g(T.awaitDrainWriters ? [T.awaitDrainWriters] : []))), T.pipes.push(K), E("pipe count=%d opts=%j", T.pipes.length, b);
    const ye = (!b || b.end !== !1) && K !== t.stdout && K !== t.stderr ? ae : nr;
    T.endEmitted ? t.nextTick(ye) : d.once("end", ye), K.on("unpipe", qe);
    function qe(Xe, rr) {
      E("onunpipe"), Xe === d && rr && rr.hasUnpiped === !1 && (rr.hasUnpiped = !0, xe());
    }
    function ae() {
      E("onend"), K.end();
    }
    let oe, me = !1;
    function xe() {
      E("cleanup"), K.removeListener("close", Ye), K.removeListener("finish", Qe), oe && K.removeListener("drain", oe), K.removeListener("error", Ve), K.removeListener("unpipe", qe), d.removeListener("end", ae), d.removeListener("end", nr), d.removeListener("data", je), me = !0, oe && T.awaitDrainWriters && (!K._writableState || K._writableState.needDrain) && oe();
    }
    function Ae() {
      me || (T.pipes.length === 1 && T.pipes[0] === K ? (E("false write response, pause", 0), T.awaitDrainWriters = K, T.multiAwaitDrain = !1) : T.pipes.length > 1 && T.pipes.includes(K) && (E("false write response, pause", T.awaitDrainWriters.size), T.awaitDrainWriters.add(K)), d.pause()), oe || (oe = W(d, K), K.on("drain", oe));
    }
    d.on("data", je);
    function je(Xe) {
      E("ondata");
      const rr = K.write(Xe);
      E("dest.write", rr), rr === !1 && Ae();
    }
    function Ve(Xe) {
      if (E("onerror", Xe), nr(), K.removeListener("error", Ve), K.listenerCount("error") === 0) {
        const rr = K._writableState || K._readableState;
        rr && !rr.errorEmitted ? j(K, Xe) : K.emit("error", Xe);
      }
    }
    q(K, "error", Ve);
    function Ye() {
      K.removeListener("finish", Qe), nr();
    }
    K.once("close", Ye);
    function Qe() {
      E("onfinish"), K.removeListener("close", Ye), nr();
    }
    K.once("finish", Qe);
    function nr() {
      E("unpipe"), d.unpipe(K);
    }
    return K.emit("pipe", d), K.writableNeedDrain === !0 ? Ae() : T.flowing || (E("pipe resume"), d.resume()), K;
  };
  function W(K, b) {
    return function() {
      const T = K._readableState;
      T.awaitDrainWriters === b ? (E("pipeOnDrain", 1), T.awaitDrainWriters = null) : T.multiAwaitDrain && (E("pipeOnDrain", T.awaitDrainWriters.size), T.awaitDrainWriters.delete(b)), (!T.awaitDrainWriters || T.awaitDrainWriters.size === 0) && K.listenerCount("data") && K.resume();
    };
  }
  Te.prototype.unpipe = function(K) {
    const b = this._readableState, d = {
      hasUnpiped: !1
    };
    if (b.pipes.length === 0) return this;
    if (!K) {
      const Q = b.pipes;
      b.pipes = [], this.pause();
      for (let ye = 0; ye < Q.length; ye++)
        Q[ye].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    const T = e(b.pipes, K);
    return T === -1 ? this : (b.pipes.splice(T, 1), b.pipes.length === 0 && this.pause(), K.emit("unpipe", this, d), this);
  }, Te.prototype.on = function(K, b) {
    const d = p.prototype.on.call(this, K, b), T = this._readableState;
    return K === "data" ? (T.readableListening = this.listenerCount("readable") > 0, T.flowing !== !1 && this.resume()) : K === "readable" && !T.endEmitted && !T.readableListening && (T.readableListening = T.needReadable = !0, T.flowing = !1, T.emittedReadable = !1, E("on readable", T.length, T.reading), T.length ? He(this) : T.reading || t.nextTick(J, this)), d;
  }, Te.prototype.addListener = Te.prototype.on, Te.prototype.removeListener = function(K, b) {
    const d = p.prototype.removeListener.call(this, K, b);
    return K === "readable" && t.nextTick(ue, this), d;
  }, Te.prototype.off = Te.prototype.removeListener, Te.prototype.removeAllListeners = function(K) {
    const b = p.prototype.removeAllListeners.apply(this, arguments);
    return (K === "readable" || K === void 0) && t.nextTick(ue, this), b;
  };
  function ue(K) {
    const b = K._readableState;
    b.readableListening = K.listenerCount("readable") > 0, b.resumeScheduled && b[we] === !1 ? b.flowing = !0 : K.listenerCount("data") > 0 ? K.resume() : b.readableListening || (b.flowing = null);
  }
  function J(K) {
    E("readable nexttick read 0"), K.read(0);
  }
  Te.prototype.resume = function() {
    const K = this._readableState;
    return K.flowing || (E("resume"), K.flowing = !K.readableListening, he(this, K)), K[we] = !1, this;
  };
  function he(K, b) {
    b.resumeScheduled || (b.resumeScheduled = !0, t.nextTick(k, K, b));
  }
  function k(K, b) {
    E("resume", b.reading), b.reading || K.read(0), b.resumeScheduled = !1, K.emit("resume"), Be(K), b.flowing && !b.reading && K.read(0);
  }
  Te.prototype.pause = function() {
    return E("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (E("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState[we] = !0, this;
  };
  function Be(K) {
    const b = K._readableState;
    for (E("flow", b.flowing); b.flowing && K.read() !== null; ) ;
  }
  Te.prototype.wrap = function(K) {
    let b = !1;
    K.on("data", (T) => {
      !this.push(T) && K.pause && (b = !0, K.pause());
    }), K.on("end", () => {
      this.push(null);
    }), K.on("error", (T) => {
      j(this, T);
    }), K.on("close", () => {
      this.destroy();
    }), K.on("destroy", () => {
      this.destroy();
    }), this._read = () => {
      b && K.resume && (b = !1, K.resume());
    };
    const d = f(K);
    for (let T = 1; T < d.length; T++) {
      const Q = d[T];
      this[Q] === void 0 && typeof K[Q] == "function" && (this[Q] = K[Q].bind(K));
    }
    return this;
  }, Te.prototype[m] = function() {
    return We(this);
  }, Te.prototype.iterator = function(K) {
    return K !== void 0 && de(K, "options"), We(this, K);
  };
  function We(K, b) {
    typeof K.read != "function" && (K = Te.wrap(K, {
      objectMode: !0
    }));
    const d = S(K, b);
    return d.stream = K, d;
  }
  async function* S(K, b) {
    let d = fe;
    function T(qe) {
      this === K ? (d(), d = fe) : d = qe;
    }
    K.on("readable", T);
    let Q;
    const ye = P(
      K,
      {
        writable: !1
      },
      (qe) => {
        Q = qe ? M(Q, qe) : null, d(), d = fe;
      }
    );
    try {
      for (; ; ) {
        const qe = K.destroyed ? null : K.read();
        if (qe !== null)
          yield qe;
        else {
          if (Q)
            throw Q;
          if (Q === null)
            return;
          await new h(T);
        }
      }
    } catch (qe) {
      throw Q = M(Q, qe), Q;
    } finally {
      (Q || (b == null ? void 0 : b.destroyOnReturn) !== !1) && (Q === void 0 || K._readableState.autoDestroy) ? A.destroyer(K, null) : (K.off("readable", T), ye());
    }
  }
  a(Te.prototype, {
    readable: {
      __proto__: null,
      get() {
        const K = this._readableState;
        return !!K && K.readable !== !1 && !K.destroyed && !K.errorEmitted && !K.endEmitted;
      },
      set(K) {
        this._readableState && (this._readableState.readable = !!K);
      }
    },
    readableDidRead: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return this._readableState.dataEmitted;
      }
    },
    readableAborted: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return !!(this._readableState.readable !== !1 && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
      }
    },
    readableHighWaterMark: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return this._readableState.highWaterMark;
      }
    },
    readableBuffer: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return this._readableState && this._readableState.buffer;
      }
    },
    readableFlowing: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return this._readableState.flowing;
      },
      set: function(K) {
        this._readableState && (this._readableState.flowing = K);
      }
    },
    readableLength: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState.length;
      }
    },
    readableObjectMode: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.objectMode : !1;
      }
    },
    readableEncoding: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.encoding : null;
      }
    },
    errored: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.errored : null;
      }
    },
    closed: {
      __proto__: null,
      get() {
        return this._readableState ? this._readableState.closed : !1;
      }
    },
    destroyed: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.destroyed : !1;
      },
      set(K) {
        this._readableState && (this._readableState.destroyed = K);
      }
    },
    readableEnded: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.endEmitted : !1;
      }
    }
  }), a(Ce.prototype, {
    // Legacy getter for `pipesCount`.
    pipesCount: {
      __proto__: null,
      get() {
        return this.pipes.length;
      }
    },
    // Legacy property for `paused`.
    paused: {
      __proto__: null,
      get() {
        return this[we] !== !1;
      },
      set(K) {
        this[we] = !!K;
      }
    }
  }), Te._fromList = Ie;
  function Ie(K, b) {
    if (b.length === 0) return null;
    let d;
    return b.objectMode ? d = b.buffer.shift() : !K || K >= b.length ? (b.decoder ? d = b.buffer.join("") : b.buffer.length === 1 ? d = b.buffer.first() : d = b.buffer.concat(b.length), b.buffer.clear()) : d = b.buffer.consume(K, b.decoder), d;
  }
  function Fe(K) {
    const b = K._readableState;
    E("endReadable", b.endEmitted), b.endEmitted || (b.ended = !0, t.nextTick(Z, b, K));
  }
  function Z(K, b) {
    if (E("endReadableNT", K.endEmitted, K.length), !K.errored && !K.closeEmitted && !K.endEmitted && K.length === 0) {
      if (K.endEmitted = !0, b.emit("end"), b.writable && b.allowHalfOpen === !1)
        t.nextTick(_e, b);
      else if (K.autoDestroy) {
        const d = b._writableState;
        (!d || d.autoDestroy && // We don't expect the writable to ever 'finish'
        // if writable is explicitly set to false.
        (d.finished || d.writable === !1)) && b.destroy();
      }
    }
  }
  function _e(K) {
    K.writable && !K.writableEnded && !K.destroyed && K.end();
  }
  Te.from = function(K, b) {
    return ce(Te, K, b);
  };
  let De;
  function Ge() {
    return De === void 0 && (De = {}), De;
  }
  return Te.fromWeb = function(K, b) {
    return Ge().newStreamReadableFromReadableStream(K, b);
  }, Te.toWeb = function(K, b) {
    return Ge().newReadableStreamFromStreamReadable(K, b);
  }, Te.wrap = function(K, b) {
    var d, T;
    return new Te({
      objectMode: (d = (T = K.readableObjectMode) !== null && T !== void 0 ? T : K.objectMode) !== null && d !== void 0 ? d : !0,
      ...b,
      destroy(Q, ye) {
        A.destroyer(K, Q), ye(Q);
      }
    }).wrap(K);
  }, readable;
}
var writable, hasRequiredWritable;
function requireWritable() {
  if (hasRequiredWritable) return writable;
  hasRequiredWritable = 1;
  const t = requireBrowser$1(), {
    ArrayPrototypeSlice: e,
    Error: n,
    FunctionPrototypeSymbolHasInstance: s,
    ObjectDefineProperty: r,
    ObjectDefineProperties: a,
    ObjectSetPrototypeOf: f,
    StringPrototypeToLowerCase: u,
    Symbol: h,
    SymbolHasInstance: g
  } = requirePrimordials();
  writable = de, de.WritableState = D;
  const { EventEmitter: l } = requireEvents(), m = requireLegacy().Stream, { Buffer: w } = requireDist(), R = requireDestroy(), { addAbortSignal: p } = requireAddAbortSignal(), { getHighWaterMark: q, getDefaultHighWaterMark: c } = requireState(), {
    ERR_INVALID_ARG_TYPE: v,
    ERR_METHOD_NOT_IMPLEMENTED: P,
    ERR_MULTIPLE_CALLBACK: E,
    ERR_STREAM_CANNOT_PIPE: I,
    ERR_STREAM_DESTROYED: A,
    ERR_STREAM_ALREADY_FINISHED: $,
    ERR_STREAM_NULL_VALUES: x,
    ERR_STREAM_WRITE_AFTER_END: M,
    ERR_UNKNOWN_ENCODING: V
  } = requireErrors().codes, { errorOrDestroy: C } = R;
  f(de.prototype, m.prototype), f(de, m);
  function z() {
  }
  const y = h("kOnFinished");
  function D(H, se, Ee) {
    typeof Ee != "boolean" && (Ee = se instanceof requireDuplex()), this.objectMode = !!(H && H.objectMode), Ee && (this.objectMode = this.objectMode || !!(H && H.writableObjectMode)), this.highWaterMark = H ? q(this, H, "writableHighWaterMark", Ee) : c(!1), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    const Re = !!(H && H.decodeStrings === !1);
    this.decodeStrings = !Re, this.defaultEncoding = H && H.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = j.bind(void 0, se), this.writecb = null, this.writelen = 0, this.afterWriteTickInfo = null, ie(this), this.pendingcb = 0, this.constructed = !0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !H || H.emitClose !== !1, this.autoDestroy = !H || H.autoDestroy !== !1, this.errored = null, this.closed = !1, this.closeEmitted = !1, this[y] = [];
  }
  function ie(H) {
    H.buffered = [], H.bufferedIndex = 0, H.allBuffers = !0, H.allNoop = !0;
  }
  D.prototype.getBuffer = function() {
    return e(this.buffered, this.bufferedIndex);
  }, r(D.prototype, "bufferedRequestCount", {
    __proto__: null,
    get() {
      return this.buffered.length - this.bufferedIndex;
    }
  });
  function de(H) {
    const se = this instanceof requireDuplex();
    if (!se && !s(de, this)) return new de(H);
    this._writableState = new D(H, this, se), H && (typeof H.write == "function" && (this._write = H.write), typeof H.writev == "function" && (this._writev = H.writev), typeof H.destroy == "function" && (this._destroy = H.destroy), typeof H.final == "function" && (this._final = H.final), typeof H.construct == "function" && (this._construct = H.construct), H.signal && p(H.signal, this)), m.call(this, H), R.construct(this, () => {
      const Ee = this._writableState;
      Ee.writing || G(this, Ee), N(this, Ee);
    });
  }
  r(de, g, {
    __proto__: null,
    value: function(H) {
      return s(this, H) ? !0 : this !== de ? !1 : H && H._writableState instanceof D;
    }
  }), de.prototype.pipe = function() {
    C(this, new I());
  };
  function we(H, se, Ee, Re) {
    const Pe = H._writableState;
    if (typeof Ee == "function")
      Re = Ee, Ee = Pe.defaultEncoding;
    else {
      if (!Ee) Ee = Pe.defaultEncoding;
      else if (Ee !== "buffer" && !w.isEncoding(Ee)) throw new V(Ee);
      typeof Re != "function" && (Re = z);
    }
    if (se === null)
      throw new x();
    if (!Pe.objectMode)
      if (typeof se == "string")
        Pe.decodeStrings !== !1 && (se = w.from(se, Ee), Ee = "buffer");
      else if (se instanceof w)
        Ee = "buffer";
      else if (m._isUint8Array(se))
        se = m._uint8ArrayToBuffer(se), Ee = "buffer";
      else
        throw new v("chunk", ["string", "Buffer", "Uint8Array"], se);
    let Oe;
    return Pe.ending ? Oe = new M() : Pe.destroyed && (Oe = new A("write")), Oe ? (t.nextTick(Re, Oe), C(H, Oe, !0), Oe) : (Pe.pendingcb++, be(H, Pe, se, Ee, Re));
  }
  de.prototype.write = function(H, se, Ee) {
    return we(this, H, se, Ee) === !0;
  }, de.prototype.cork = function() {
    this._writableState.corked++;
  }, de.prototype.uncork = function() {
    const H = this._writableState;
    H.corked && (H.corked--, H.writing || G(this, H));
  }, de.prototype.setDefaultEncoding = function(se) {
    if (typeof se == "string" && (se = u(se)), !w.isEncoding(se)) throw new V(se);
    return this._writableState.defaultEncoding = se, this;
  };
  function be(H, se, Ee, Re, Pe) {
    const Oe = se.objectMode ? 1 : Ee.length;
    se.length += Oe;
    const te = se.length < se.highWaterMark;
    return te || (se.needDrain = !0), se.writing || se.corked || se.errored || !se.constructed ? (se.buffered.push({
      chunk: Ee,
      encoding: Re,
      callback: Pe
    }), se.allBuffers && Re !== "buffer" && (se.allBuffers = !1), se.allNoop && Pe !== z && (se.allNoop = !1)) : (se.writelen = Oe, se.writecb = Pe, se.writing = !0, se.sync = !0, H._write(Ee, Re, se.onwrite), se.sync = !1), te && !se.errored && !se.destroyed;
  }
  function ce(H, se, Ee, Re, Pe, Oe, te) {
    se.writelen = Re, se.writecb = te, se.writing = !0, se.sync = !0, se.destroyed ? se.onwrite(new A("write")) : Ee ? H._writev(Pe, se.onwrite) : H._write(Pe, Oe, se.onwrite), se.sync = !1;
  }
  function fe(H, se, Ee, Re) {
    --se.pendingcb, Re(Ee), X(se), C(H, Ee);
  }
  function j(H, se) {
    const Ee = H._writableState, Re = Ee.sync, Pe = Ee.writecb;
    if (typeof Pe != "function") {
      C(H, new E());
      return;
    }
    Ee.writing = !1, Ee.writecb = null, Ee.length -= Ee.writelen, Ee.writelen = 0, se ? (se.stack, Ee.errored || (Ee.errored = se), H._readableState && !H._readableState.errored && (H._readableState.errored = se), Re ? t.nextTick(fe, H, Ee, se, Pe) : fe(H, Ee, se, Pe)) : (Ee.buffered.length > Ee.bufferedIndex && G(H, Ee), Re ? Ee.afterWriteTickInfo !== null && Ee.afterWriteTickInfo.cb === Pe ? Ee.afterWriteTickInfo.count++ : (Ee.afterWriteTickInfo = {
      count: 1,
      cb: Pe,
      stream: H,
      state: Ee
    }, t.nextTick(pe, Ee.afterWriteTickInfo)) : ee(H, Ee, 1, Pe));
  }
  function pe({ stream: H, state: se, count: Ee, cb: Re }) {
    return se.afterWriteTickInfo = null, ee(H, se, Ee, Re);
  }
  function ee(H, se, Ee, Re) {
    for (!se.ending && !H.destroyed && se.length === 0 && se.needDrain && (se.needDrain = !1, H.emit("drain")); Ee-- > 0; )
      se.pendingcb--, Re();
    se.destroyed && X(se), N(H, se);
  }
  function X(H) {
    if (H.writing)
      return;
    for (let Pe = H.bufferedIndex; Pe < H.buffered.length; ++Pe) {
      var se;
      const { chunk: Oe, callback: te } = H.buffered[Pe], $e = H.objectMode ? 1 : Oe.length;
      H.length -= $e, te(
        (se = H.errored) !== null && se !== void 0 ? se : new A("write")
      );
    }
    const Ee = H[y].splice(0);
    for (let Pe = 0; Pe < Ee.length; Pe++) {
      var Re;
      Ee[Pe](
        (Re = H.errored) !== null && Re !== void 0 ? Re : new A("end")
      );
    }
    ie(H);
  }
  function G(H, se) {
    if (se.corked || se.bufferProcessing || se.destroyed || !se.constructed)
      return;
    const { buffered: Ee, bufferedIndex: Re, objectMode: Pe } = se, Oe = Ee.length - Re;
    if (!Oe)
      return;
    let te = Re;
    if (se.bufferProcessing = !0, Oe > 1 && H._writev) {
      se.pendingcb -= Oe - 1;
      const $e = se.allNoop ? z : (Te) => {
        for (let Ue = te; Ue < Ee.length; ++Ue)
          Ee[Ue].callback(Te);
      }, Ce = se.allNoop && te === 0 ? Ee : e(Ee, te);
      Ce.allBuffers = se.allBuffers, ce(H, se, !0, se.length, Ce, "", $e), ie(se);
    } else {
      do {
        const { chunk: $e, encoding: Ce, callback: Te } = Ee[te];
        Ee[te++] = null;
        const Ue = Pe ? 1 : $e.length;
        ce(H, se, !1, Ue, $e, Ce, Te);
      } while (te < Ee.length && !se.writing);
      te === Ee.length ? ie(se) : te > 256 ? (Ee.splice(0, te), se.bufferedIndex = 0) : se.bufferedIndex = te;
    }
    se.bufferProcessing = !1;
  }
  de.prototype._write = function(H, se, Ee) {
    if (this._writev)
      this._writev(
        [
          {
            chunk: H,
            encoding: se
          }
        ],
        Ee
      );
    else
      throw new P("_write()");
  }, de.prototype._writev = null, de.prototype.end = function(H, se, Ee) {
    const Re = this._writableState;
    typeof H == "function" ? (Ee = H, H = null, se = null) : typeof se == "function" && (Ee = se, se = null);
    let Pe;
    if (H != null) {
      const Oe = we(this, H, se);
      Oe instanceof n && (Pe = Oe);
    }
    return Re.corked && (Re.corked = 1, this.uncork()), Pe || (!Re.errored && !Re.ending ? (Re.ending = !0, N(this, Re, !0), Re.ended = !0) : Re.finished ? Pe = new $("end") : Re.destroyed && (Pe = new A("end"))), typeof Ee == "function" && (Pe || Re.finished ? t.nextTick(Ee, Pe) : Re[y].push(Ee)), this;
  };
  function le(H) {
    return H.ending && !H.destroyed && H.constructed && H.length === 0 && !H.errored && H.buffered.length === 0 && !H.finished && !H.writing && !H.errorEmitted && !H.closeEmitted;
  }
  function O(H, se) {
    let Ee = !1;
    function Re(Pe) {
      if (Ee) {
        C(H, Pe ?? E());
        return;
      }
      if (Ee = !0, se.pendingcb--, Pe) {
        const Oe = se[y].splice(0);
        for (let te = 0; te < Oe.length; te++)
          Oe[te](Pe);
        C(H, Pe, se.sync);
      } else le(se) && (se.prefinished = !0, H.emit("prefinish"), se.pendingcb++, t.nextTick(re, H, se));
    }
    se.sync = !0, se.pendingcb++;
    try {
      H._final(Re);
    } catch (Pe) {
      Re(Pe);
    }
    se.sync = !1;
  }
  function B(H, se) {
    !se.prefinished && !se.finalCalled && (typeof H._final == "function" && !se.destroyed ? (se.finalCalled = !0, O(H, se)) : (se.prefinished = !0, H.emit("prefinish")));
  }
  function N(H, se, Ee) {
    le(se) && (B(H, se), se.pendingcb === 0 && (Ee ? (se.pendingcb++, t.nextTick(
      (Re, Pe) => {
        le(Pe) ? re(Re, Pe) : Pe.pendingcb--;
      },
      H,
      se
    )) : le(se) && (se.pendingcb++, re(H, se))));
  }
  function re(H, se) {
    se.pendingcb--, se.finished = !0;
    const Ee = se[y].splice(0);
    for (let Re = 0; Re < Ee.length; Re++)
      Ee[Re]();
    if (H.emit("finish"), se.autoDestroy) {
      const Re = H._readableState;
      (!Re || Re.autoDestroy && // We don't expect the readable to ever 'end'
      // if readable is explicitly set to false.
      (Re.endEmitted || Re.readable === !1)) && H.destroy();
    }
  }
  a(de.prototype, {
    closed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.closed : !1;
      }
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.destroyed : !1;
      },
      set(H) {
        this._writableState && (this._writableState.destroyed = H);
      }
    },
    writable: {
      __proto__: null,
      get() {
        const H = this._writableState;
        return !!H && H.writable !== !1 && !H.destroyed && !H.errored && !H.ending && !H.ended;
      },
      set(H) {
        this._writableState && (this._writableState.writable = !!H);
      }
    },
    writableFinished: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.finished : !1;
      }
    },
    writableObjectMode: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.objectMode : !1;
      }
    },
    writableBuffer: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.getBuffer();
      }
    },
    writableEnded: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.ending : !1;
      }
    },
    writableNeedDrain: {
      __proto__: null,
      get() {
        const H = this._writableState;
        return H ? !H.destroyed && !H.ending && H.needDrain : !1;
      }
    },
    writableHighWaterMark: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.highWaterMark;
      }
    },
    writableCorked: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.corked : 0;
      }
    },
    writableLength: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.length;
      }
    },
    errored: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._writableState ? this._writableState.errored : null;
      }
    },
    writableAborted: {
      __proto__: null,
      enumerable: !1,
      get: function() {
        return !!(this._writableState.writable !== !1 && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
      }
    }
  });
  const ne = R.destroy;
  de.prototype.destroy = function(H, se) {
    const Ee = this._writableState;
    return !Ee.destroyed && (Ee.bufferedIndex < Ee.buffered.length || Ee[y].length) && t.nextTick(X, Ee), ne.call(this, H, se), this;
  }, de.prototype._undestroy = R.undestroy, de.prototype._destroy = function(H, se) {
    se(H);
  }, de.prototype[l.captureRejectionSymbol] = function(H) {
    this.destroy(H);
  };
  let F;
  function L() {
    return F === void 0 && (F = {}), F;
  }
  return de.fromWeb = function(H, se) {
    return L().newStreamWritableFromWritableStream(H, se);
  }, de.toWeb = function(H) {
    return L().newWritableStreamFromStreamWritable(H);
  }, writable;
}
var duplexify, hasRequiredDuplexify;
function requireDuplexify() {
  if (hasRequiredDuplexify) return duplexify;
  hasRequiredDuplexify = 1;
  const t = requireBrowser$1(), e = requireDist(), {
    isReadable: n,
    isWritable: s,
    isIterable: r,
    isNodeStream: a,
    isReadableNodeStream: f,
    isWritableNodeStream: u,
    isDuplexNodeStream: h,
    isReadableStream: g,
    isWritableStream: l
  } = requireUtils(), m = requireEndOfStream(), {
    AbortError: w,
    codes: { ERR_INVALID_ARG_TYPE: R, ERR_INVALID_RETURN_VALUE: p }
  } = requireErrors(), { destroyer: q } = requireDestroy(), c = requireDuplex(), v = requireReadable(), P = requireWritable(), { createDeferredPromise: E } = requireUtil(), I = requireFrom(), A = globalThis.Blob || e.Blob, $ = typeof A < "u" ? function(D) {
    return D instanceof A;
  } : function(D) {
    return !1;
  }, x = globalThis.AbortController || requireBrowser$2().AbortController, { FunctionPrototypeCall: M } = requirePrimordials();
  class V extends c {
    constructor(D) {
      super(D), (D == null ? void 0 : D.readable) === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), (D == null ? void 0 : D.writable) === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0);
    }
  }
  duplexify = function y(D, ie) {
    if (h(D))
      return D;
    if (f(D))
      return z({
        readable: D
      });
    if (u(D))
      return z({
        writable: D
      });
    if (a(D))
      return z({
        writable: !1,
        readable: !1
      });
    if (g(D))
      return z({
        readable: v.fromWeb(D)
      });
    if (l(D))
      return z({
        writable: P.fromWeb(D)
      });
    if (typeof D == "function") {
      const { value: we, write: be, final: ce, destroy: fe } = C(D);
      if (r(we))
        return I(V, we, {
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          write: be,
          final: ce,
          destroy: fe
        });
      const j = we == null ? void 0 : we.then;
      if (typeof j == "function") {
        let pe;
        const ee = M(
          j,
          we,
          (X) => {
            if (X != null)
              throw new p("nully", "body", X);
          },
          (X) => {
            q(pe, X);
          }
        );
        return pe = new V({
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          readable: !1,
          write: be,
          final(X) {
            ce(async () => {
              try {
                await ee, t.nextTick(X, null);
              } catch (G) {
                t.nextTick(X, G);
              }
            });
          },
          destroy: fe
        });
      }
      throw new p("Iterable, AsyncIterable or AsyncFunction", ie, we);
    }
    if ($(D))
      return y(D.arrayBuffer());
    if (r(D))
      return I(V, D, {
        // TODO (ronag): highWaterMark?
        objectMode: !0,
        writable: !1
      });
    if (g(D == null ? void 0 : D.readable) && l(D == null ? void 0 : D.writable))
      return V.fromWeb(D);
    if (typeof (D == null ? void 0 : D.writable) == "object" || typeof (D == null ? void 0 : D.readable) == "object") {
      const we = D != null && D.readable ? f(D == null ? void 0 : D.readable) ? D == null ? void 0 : D.readable : y(D.readable) : void 0, be = D != null && D.writable ? u(D == null ? void 0 : D.writable) ? D == null ? void 0 : D.writable : y(D.writable) : void 0;
      return z({
        readable: we,
        writable: be
      });
    }
    const de = D == null ? void 0 : D.then;
    if (typeof de == "function") {
      let we;
      return M(
        de,
        D,
        (be) => {
          be != null && we.push(be), we.push(null);
        },
        (be) => {
          q(we, be);
        }
      ), we = new V({
        objectMode: !0,
        writable: !1,
        read() {
        }
      });
    }
    throw new R(
      ie,
      [
        "Blob",
        "ReadableStream",
        "WritableStream",
        "Stream",
        "Iterable",
        "AsyncIterable",
        "Function",
        "{ readable, writable } pair",
        "Promise"
      ],
      D
    );
  };
  function C(y) {
    let { promise: D, resolve: ie } = E();
    const de = new x(), we = de.signal;
    return {
      value: y(
        (async function* () {
          for (; ; ) {
            const ce = D;
            D = null;
            const { chunk: fe, done: j, cb: pe } = await ce;
            if (t.nextTick(pe), j) return;
            if (we.aborted)
              throw new w(void 0, {
                cause: we.reason
              });
            ({ promise: D, resolve: ie } = E()), yield fe;
          }
        })(),
        {
          signal: we
        }
      ),
      write(ce, fe, j) {
        const pe = ie;
        ie = null, pe({
          chunk: ce,
          done: !1,
          cb: j
        });
      },
      final(ce) {
        const fe = ie;
        ie = null, fe({
          done: !0,
          cb: ce
        });
      },
      destroy(ce, fe) {
        de.abort(), fe(ce);
      }
    };
  }
  function z(y) {
    const D = y.readable && typeof y.readable.read != "function" ? v.wrap(y.readable) : y.readable, ie = y.writable;
    let de = !!n(D), we = !!s(ie), be, ce, fe, j, pe;
    function ee(X) {
      const G = j;
      j = null, G ? G(X) : X && pe.destroy(X);
    }
    return pe = new V({
      // TODO (ronag): highWaterMark?
      readableObjectMode: !!(D != null && D.readableObjectMode),
      writableObjectMode: !!(ie != null && ie.writableObjectMode),
      readable: de,
      writable: we
    }), we && (m(ie, (X) => {
      we = !1, X && q(D, X), ee(X);
    }), pe._write = function(X, G, le) {
      ie.write(X, G) ? le() : be = le;
    }, pe._final = function(X) {
      ie.end(), ce = X;
    }, ie.on("drain", function() {
      if (be) {
        const X = be;
        be = null, X();
      }
    }), ie.on("finish", function() {
      if (ce) {
        const X = ce;
        ce = null, X();
      }
    })), de && (m(D, (X) => {
      de = !1, X && q(D, X), ee(X);
    }), D.on("readable", function() {
      if (fe) {
        const X = fe;
        fe = null, X();
      }
    }), D.on("end", function() {
      pe.push(null);
    }), pe._read = function() {
      for (; ; ) {
        const X = D.read();
        if (X === null) {
          fe = pe._read;
          return;
        }
        if (!pe.push(X))
          return;
      }
    }), pe._destroy = function(X, G) {
      !X && j !== null && (X = new w()), fe = null, be = null, ce = null, j === null ? G(X) : (j = G, q(ie, X), q(D, X));
    }, pe;
  }
  return duplexify;
}
var duplex, hasRequiredDuplex;
function requireDuplex() {
  if (hasRequiredDuplex) return duplex;
  hasRequiredDuplex = 1;
  const {
    ObjectDefineProperties: t,
    ObjectGetOwnPropertyDescriptor: e,
    ObjectKeys: n,
    ObjectSetPrototypeOf: s
  } = requirePrimordials();
  duplex = f;
  const r = requireReadable(), a = requireWritable();
  s(f.prototype, r.prototype), s(f, r);
  {
    const l = n(a.prototype);
    for (let m = 0; m < l.length; m++) {
      const w = l[m];
      f.prototype[w] || (f.prototype[w] = a.prototype[w]);
    }
  }
  function f(l) {
    if (!(this instanceof f)) return new f(l);
    r.call(this, l), a.call(this, l), l ? (this.allowHalfOpen = l.allowHalfOpen !== !1, l.readable === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), l.writable === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0)) : this.allowHalfOpen = !0;
  }
  t(f.prototype, {
    writable: {
      __proto__: null,
      ...e(a.prototype, "writable")
    },
    writableHighWaterMark: {
      __proto__: null,
      ...e(a.prototype, "writableHighWaterMark")
    },
    writableObjectMode: {
      __proto__: null,
      ...e(a.prototype, "writableObjectMode")
    },
    writableBuffer: {
      __proto__: null,
      ...e(a.prototype, "writableBuffer")
    },
    writableLength: {
      __proto__: null,
      ...e(a.prototype, "writableLength")
    },
    writableFinished: {
      __proto__: null,
      ...e(a.prototype, "writableFinished")
    },
    writableCorked: {
      __proto__: null,
      ...e(a.prototype, "writableCorked")
    },
    writableEnded: {
      __proto__: null,
      ...e(a.prototype, "writableEnded")
    },
    writableNeedDrain: {
      __proto__: null,
      ...e(a.prototype, "writableNeedDrain")
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
      },
      set(l) {
        this._readableState && this._writableState && (this._readableState.destroyed = l, this._writableState.destroyed = l);
      }
    }
  });
  let u;
  function h() {
    return u === void 0 && (u = {}), u;
  }
  f.fromWeb = function(l, m) {
    return h().newStreamDuplexFromReadableWritablePair(l, m);
  }, f.toWeb = function(l) {
    return h().newReadableWritablePairFromDuplex(l);
  };
  let g;
  return f.from = function(l) {
    return g || (g = requireDuplexify()), g(l, "body");
  }, duplex;
}
var transform, hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform;
  hasRequiredTransform = 1;
  const { ObjectSetPrototypeOf: t, Symbol: e } = requirePrimordials();
  transform = f;
  const { ERR_METHOD_NOT_IMPLEMENTED: n } = requireErrors().codes, s = requireDuplex(), { getHighWaterMark: r } = requireState();
  t(f.prototype, s.prototype), t(f, s);
  const a = e("kCallback");
  function f(g) {
    if (!(this instanceof f)) return new f(g);
    const l = g ? r(this, g, "readableHighWaterMark", !0) : null;
    l === 0 && (g = {
      ...g,
      highWaterMark: null,
      readableHighWaterMark: l,
      // TODO (ronag): 0 is not optimal since we have
      // a "bug" where we check needDrain before calling _write and not after.
      // Refs: https://github.com/nodejs/node/pull/32887
      // Refs: https://github.com/nodejs/node/pull/35941
      writableHighWaterMark: g.writableHighWaterMark || 0
    }), s.call(this, g), this._readableState.sync = !1, this[a] = null, g && (typeof g.transform == "function" && (this._transform = g.transform), typeof g.flush == "function" && (this._flush = g.flush)), this.on("prefinish", h);
  }
  function u(g) {
    typeof this._flush == "function" && !this.destroyed ? this._flush((l, m) => {
      if (l) {
        g ? g(l) : this.destroy(l);
        return;
      }
      m != null && this.push(m), this.push(null), g && g();
    }) : (this.push(null), g && g());
  }
  function h() {
    this._final !== u && u.call(this);
  }
  return f.prototype._final = u, f.prototype._transform = function(g, l, m) {
    throw new n("_transform()");
  }, f.prototype._write = function(g, l, m) {
    const w = this._readableState, R = this._writableState, p = w.length;
    this._transform(g, l, (q, c) => {
      if (q) {
        m(q);
        return;
      }
      c != null && this.push(c), R.ended || // Backwards compat.
      p === w.length || // Backwards compat.
      w.length < w.highWaterMark ? m() : this[a] = m;
    });
  }, f.prototype._read = function() {
    if (this[a]) {
      const g = this[a];
      this[a] = null, g();
    }
  }, transform;
}
var passthrough, hasRequiredPassthrough;
function requirePassthrough() {
  if (hasRequiredPassthrough) return passthrough;
  hasRequiredPassthrough = 1;
  const { ObjectSetPrototypeOf: t } = requirePrimordials();
  passthrough = n;
  const e = requireTransform();
  t(n.prototype, e.prototype), t(n, e);
  function n(s) {
    if (!(this instanceof n)) return new n(s);
    e.call(this, s);
  }
  return n.prototype._transform = function(s, r, a) {
    a(null, s);
  }, passthrough;
}
var pipeline_1, hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  const t = requireBrowser$1(), { ArrayIsArray: e, Promise: n, SymbolAsyncIterator: s, SymbolDispose: r } = requirePrimordials(), a = requireEndOfStream(), { once: f } = requireUtil(), u = requireDestroy(), h = requireDuplex(), {
    aggregateTwoErrors: g,
    codes: {
      ERR_INVALID_ARG_TYPE: l,
      ERR_INVALID_RETURN_VALUE: m,
      ERR_MISSING_ARGS: w,
      ERR_STREAM_DESTROYED: R,
      ERR_STREAM_PREMATURE_CLOSE: p
    },
    AbortError: q
  } = requireErrors(), { validateFunction: c, validateAbortSignal: v } = requireValidators(), {
    isIterable: P,
    isReadable: E,
    isReadableNodeStream: I,
    isNodeStream: A,
    isTransformStream: $,
    isWebStream: x,
    isReadableStream: M,
    isReadableFinished: V
  } = requireUtils(), C = globalThis.AbortController || requireBrowser$2().AbortController;
  let z, y, D;
  function ie(X, G, le) {
    let O = !1;
    X.on("close", () => {
      O = !0;
    });
    const B = a(
      X,
      {
        readable: G,
        writable: le
      },
      (N) => {
        O = !N;
      }
    );
    return {
      destroy: (N) => {
        O || (O = !0, u.destroyer(X, N || new R("pipe")));
      },
      cleanup: B
    };
  }
  function de(X) {
    return c(X[X.length - 1], "streams[stream.length - 1]"), X.pop();
  }
  function we(X) {
    if (P(X))
      return X;
    if (I(X))
      return be(X);
    throw new l("val", ["Readable", "Iterable", "AsyncIterable"], X);
  }
  async function* be(X) {
    y || (y = requireReadable()), yield* y.prototype[s].call(X);
  }
  async function ce(X, G, le, { end: O }) {
    let B, N = null;
    const re = (L) => {
      if (L && (B = L), N) {
        const H = N;
        N = null, H();
      }
    }, ne = () => new n((L, H) => {
      B ? H(B) : N = () => {
        B ? H(B) : L();
      };
    });
    G.on("drain", re);
    const F = a(
      G,
      {
        readable: !1
      },
      re
    );
    try {
      G.writableNeedDrain && await ne();
      for await (const L of X)
        G.write(L) || await ne();
      O && (G.end(), await ne()), le();
    } catch (L) {
      le(B !== L ? g(B, L) : L);
    } finally {
      F(), G.off("drain", re);
    }
  }
  async function fe(X, G, le, { end: O }) {
    $(G) && (G = G.writable);
    const B = G.getWriter();
    try {
      for await (const N of X)
        await B.ready, B.write(N).catch(() => {
        });
      await B.ready, O && await B.close(), le();
    } catch (N) {
      try {
        await B.abort(N), le(N);
      } catch (re) {
        le(re);
      }
    }
  }
  function j(...X) {
    return pe(X, f(de(X)));
  }
  function pe(X, G, le) {
    if (X.length === 1 && e(X[0]) && (X = X[0]), X.length < 2)
      throw new w("streams");
    const O = new C(), B = O.signal, N = le == null ? void 0 : le.signal, re = [];
    v(N, "options.signal");
    function ne() {
      Pe(new q());
    }
    D = D || requireUtil().addAbortListener;
    let F;
    N && (F = D(N, ne));
    let L, H;
    const se = [];
    let Ee = 0;
    function Re(Ce) {
      Pe(Ce, --Ee === 0);
    }
    function Pe(Ce, Te) {
      var Ue;
      if (Ce && (!L || L.code === "ERR_STREAM_PREMATURE_CLOSE") && (L = Ce), !(!L && !Te)) {
        for (; se.length; )
          se.shift()(L);
        (Ue = F) === null || Ue === void 0 || Ue[r](), O.abort(), Te && (L || re.forEach((ge) => ge()), t.nextTick(G, L, H));
      }
    }
    let Oe;
    for (let Ce = 0; Ce < X.length; Ce++) {
      const Te = X[Ce], Ue = Ce < X.length - 1, ge = Ce > 0, Se = Ue || (le == null ? void 0 : le.end) !== !1, Le = Ce === X.length - 1;
      if (A(Te)) {
        let Me = function(ke) {
          ke && ke.name !== "AbortError" && ke.code !== "ERR_STREAM_PREMATURE_CLOSE" && Re(ke);
        };
        if (Se) {
          const { destroy: ke, cleanup: He } = ie(Te, Ue, ge);
          se.push(ke), E(Te) && Le && re.push(He);
        }
        Te.on("error", Me), E(Te) && Le && re.push(() => {
          Te.removeListener("error", Me);
        });
      }
      if (Ce === 0)
        if (typeof Te == "function") {
          if (Oe = Te({
            signal: B
          }), !P(Oe))
            throw new m("Iterable, AsyncIterable or Stream", "source", Oe);
        } else P(Te) || I(Te) || $(Te) ? Oe = Te : Oe = h.from(Te);
      else if (typeof Te == "function") {
        if ($(Oe)) {
          var te;
          Oe = we((te = Oe) === null || te === void 0 ? void 0 : te.readable);
        } else
          Oe = we(Oe);
        if (Oe = Te(Oe, {
          signal: B
        }), Ue) {
          if (!P(Oe, !0))
            throw new m("AsyncIterable", `transform[${Ce - 1}]`, Oe);
        } else {
          var $e;
          z || (z = requirePassthrough());
          const Me = new z({
            objectMode: !0
          }), ke = ($e = Oe) === null || $e === void 0 ? void 0 : $e.then;
          if (typeof ke == "function")
            Ee++, ke.call(
              Oe,
              (o) => {
                H = o, o != null && Me.write(o), Se && Me.end(), t.nextTick(Re);
              },
              (o) => {
                Me.destroy(o), t.nextTick(Re, o);
              }
            );
          else if (P(Oe, !0))
            Ee++, ce(Oe, Me, Re, {
              end: Se
            });
          else if (M(Oe) || $(Oe)) {
            const o = Oe.readable || Oe;
            Ee++, ce(o, Me, Re, {
              end: Se
            });
          } else
            throw new m("AsyncIterable or Promise", "destination", Oe);
          Oe = Me;
          const { destroy: He, cleanup: U } = ie(Oe, !1, !0);
          se.push(He), Le && re.push(U);
        }
      } else if (A(Te)) {
        if (I(Oe)) {
          Ee += 2;
          const Me = ee(Oe, Te, Re, {
            end: Se
          });
          E(Te) && Le && re.push(Me);
        } else if ($(Oe) || M(Oe)) {
          const Me = Oe.readable || Oe;
          Ee++, ce(Me, Te, Re, {
            end: Se
          });
        } else if (P(Oe))
          Ee++, ce(Oe, Te, Re, {
            end: Se
          });
        else
          throw new l(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Te;
      } else if (x(Te)) {
        if (I(Oe))
          Ee++, fe(we(Oe), Te, Re, {
            end: Se
          });
        else if (M(Oe) || P(Oe))
          Ee++, fe(Oe, Te, Re, {
            end: Se
          });
        else if ($(Oe))
          Ee++, fe(Oe.readable, Te, Re, {
            end: Se
          });
        else
          throw new l(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Te;
      } else
        Oe = h.from(Te);
    }
    return (B != null && B.aborted || N != null && N.aborted) && t.nextTick(ne), Oe;
  }
  function ee(X, G, le, { end: O }) {
    let B = !1;
    if (G.on("close", () => {
      B || le(new p());
    }), X.pipe(G, {
      end: !1
    }), O) {
      let N = function() {
        B = !0, G.end();
      };
      V(X) ? t.nextTick(N) : X.once("end", N);
    } else
      le();
    return a(
      X,
      {
        readable: !0,
        writable: !1
      },
      (N) => {
        const re = X._readableState;
        N && N.code === "ERR_STREAM_PREMATURE_CLOSE" && re && re.ended && !re.errored && !re.errorEmitted ? X.once("end", le).once("error", le) : le(N);
      }
    ), a(
      G,
      {
        readable: !1,
        writable: !0
      },
      le
    );
  }
  return pipeline_1 = {
    pipelineImpl: pe,
    pipeline: j
  }, pipeline_1;
}
var compose, hasRequiredCompose;
function requireCompose() {
  if (hasRequiredCompose) return compose;
  hasRequiredCompose = 1;
  const { pipeline: t } = requirePipeline(), e = requireDuplex(), { destroyer: n } = requireDestroy(), {
    isNodeStream: s,
    isReadable: r,
    isWritable: a,
    isWebStream: f,
    isTransformStream: u,
    isWritableStream: h,
    isReadableStream: g
  } = requireUtils(), {
    AbortError: l,
    codes: { ERR_INVALID_ARG_VALUE: m, ERR_MISSING_ARGS: w }
  } = requireErrors(), R = requireEndOfStream();
  return compose = function(...q) {
    if (q.length === 0)
      throw new w("streams");
    if (q.length === 1)
      return e.from(q[0]);
    const c = [...q];
    if (typeof q[0] == "function" && (q[0] = e.from(q[0])), typeof q[q.length - 1] == "function") {
      const z = q.length - 1;
      q[z] = e.from(q[z]);
    }
    for (let z = 0; z < q.length; ++z)
      if (!(!s(q[z]) && !f(q[z]))) {
        if (z < q.length - 1 && !(r(q[z]) || g(q[z]) || u(q[z])))
          throw new m(`streams[${z}]`, c[z], "must be readable");
        if (z > 0 && !(a(q[z]) || h(q[z]) || u(q[z])))
          throw new m(`streams[${z}]`, c[z], "must be writable");
      }
    let v, P, E, I, A;
    function $(z) {
      const y = I;
      I = null, y ? y(z) : z ? A.destroy(z) : !C && !V && A.destroy();
    }
    const x = q[0], M = t(q, $), V = !!(a(x) || h(x) || u(x)), C = !!(r(M) || g(M) || u(M));
    if (A = new e({
      // TODO (ronag): highWaterMark?
      writableObjectMode: !!(x != null && x.writableObjectMode),
      readableObjectMode: !!(M != null && M.readableObjectMode),
      writable: V,
      readable: C
    }), V) {
      if (s(x))
        A._write = function(y, D, ie) {
          x.write(y, D) ? ie() : v = ie;
        }, A._final = function(y) {
          x.end(), P = y;
        }, x.on("drain", function() {
          if (v) {
            const y = v;
            v = null, y();
          }
        });
      else if (f(x)) {
        const D = (u(x) ? x.writable : x).getWriter();
        A._write = async function(ie, de, we) {
          try {
            await D.ready, D.write(ie).catch(() => {
            }), we();
          } catch (be) {
            we(be);
          }
        }, A._final = async function(ie) {
          try {
            await D.ready, D.close().catch(() => {
            }), P = ie;
          } catch (de) {
            ie(de);
          }
        };
      }
      const z = u(M) ? M.readable : M;
      R(z, () => {
        if (P) {
          const y = P;
          P = null, y();
        }
      });
    }
    if (C) {
      if (s(M))
        M.on("readable", function() {
          if (E) {
            const z = E;
            E = null, z();
          }
        }), M.on("end", function() {
          A.push(null);
        }), A._read = function() {
          for (; ; ) {
            const z = M.read();
            if (z === null) {
              E = A._read;
              return;
            }
            if (!A.push(z))
              return;
          }
        };
      else if (f(M)) {
        const y = (u(M) ? M.readable : M).getReader();
        A._read = async function() {
          for (; ; )
            try {
              const { value: D, done: ie } = await y.read();
              if (!A.push(D))
                return;
              if (ie) {
                A.push(null);
                return;
              }
            } catch {
              return;
            }
        };
      }
    }
    return A._destroy = function(z, y) {
      !z && I !== null && (z = new l()), E = null, v = null, P = null, I === null ? y(z) : (I = y, s(M) && n(M, z));
    }, A;
  }, compose;
}
var hasRequiredOperators;
function requireOperators() {
  if (hasRequiredOperators) return operators;
  hasRequiredOperators = 1;
  const t = globalThis.AbortController || requireBrowser$2().AbortController, {
    codes: { ERR_INVALID_ARG_VALUE: e, ERR_INVALID_ARG_TYPE: n, ERR_MISSING_ARGS: s, ERR_OUT_OF_RANGE: r },
    AbortError: a
  } = requireErrors(), { validateAbortSignal: f, validateInteger: u, validateObject: h } = requireValidators(), g = requirePrimordials().Symbol("kWeak"), l = requirePrimordials().Symbol("kResistStopPropagation"), { finished: m } = requireEndOfStream(), w = requireCompose(), { addAbortSignalNoValidate: R } = requireAddAbortSignal(), { isWritable: p, isNodeStream: q } = requireUtils(), { deprecate: c } = requireUtil(), {
    ArrayPrototypePush: v,
    Boolean: P,
    MathFloor: E,
    Number: I,
    NumberIsNaN: A,
    Promise: $,
    PromiseReject: x,
    PromiseResolve: M,
    PromisePrototypeThen: V,
    Symbol: C
  } = requirePrimordials(), z = C("kEmpty"), y = C("kEof");
  function D(N, re) {
    if (re != null && h(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), q(N) && !p(N))
      throw new e("stream", N, "must be writable");
    const ne = w(this, N);
    return re != null && re.signal && R(re.signal, ne), ne;
  }
  function ie(N, re) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    re != null && h(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal");
    let ne = 1;
    (re == null ? void 0 : re.concurrency) != null && (ne = E(re.concurrency));
    let F = ne - 1;
    return (re == null ? void 0 : re.highWaterMark) != null && (F = E(re.highWaterMark)), u(ne, "options.concurrency", 1), u(F, "options.highWaterMark", 0), F += ne, (async function* () {
      const H = requireUtil().AbortSignalAny(
        [re == null ? void 0 : re.signal].filter(P)
      ), se = this, Ee = [], Re = {
        signal: H
      };
      let Pe, Oe, te = !1, $e = 0;
      function Ce() {
        te = !0, Te();
      }
      function Te() {
        $e -= 1, Ue();
      }
      function Ue() {
        Oe && !te && $e < ne && Ee.length < F && (Oe(), Oe = null);
      }
      async function ge() {
        try {
          for await (let Se of se) {
            if (te)
              return;
            if (H.aborted)
              throw new a();
            try {
              if (Se = N(Se, Re), Se === z)
                continue;
              Se = M(Se);
            } catch (Le) {
              Se = x(Le);
            }
            $e += 1, V(Se, Te, Ce), Ee.push(Se), Pe && (Pe(), Pe = null), !te && (Ee.length >= F || $e >= ne) && await new $((Le) => {
              Oe = Le;
            });
          }
          Ee.push(y);
        } catch (Se) {
          const Le = x(Se);
          V(Le, Te, Ce), Ee.push(Le);
        } finally {
          te = !0, Pe && (Pe(), Pe = null);
        }
      }
      ge();
      try {
        for (; ; ) {
          for (; Ee.length > 0; ) {
            const Se = await Ee[0];
            if (Se === y)
              return;
            if (H.aborted)
              throw new a();
            Se !== z && (yield Se), Ee.shift(), Ue();
          }
          await new $((Se) => {
            Pe = Se;
          });
        }
      } finally {
        te = !0, Oe && (Oe(), Oe = null);
      }
    }).call(this);
  }
  function de(N = void 0) {
    return N != null && h(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal"), (async function* () {
      let ne = 0;
      for await (const L of this) {
        var F;
        if (N != null && (F = N.signal) !== null && F !== void 0 && F.aborted)
          throw new a({
            cause: N.signal.reason
          });
        yield [ne++, L];
      }
    }).call(this);
  }
  async function we(N, re = void 0) {
    for await (const ne of j.call(this, N, re))
      return !0;
    return !1;
  }
  async function be(N, re = void 0) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    return !await we.call(
      this,
      async (...ne) => !await N(...ne),
      re
    );
  }
  async function ce(N, re) {
    for await (const ne of j.call(this, N, re))
      return ne;
  }
  async function fe(N, re) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    async function ne(F, L) {
      return await N(F, L), z;
    }
    for await (const F of ie.call(this, ne, re)) ;
  }
  function j(N, re) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    async function ne(F, L) {
      return await N(F, L) ? F : z;
    }
    return ie.call(this, ne, re);
  }
  class pe extends s {
    constructor() {
      super("reduce"), this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function ee(N, re, ne) {
    var F;
    if (typeof N != "function")
      throw new n("reducer", ["Function", "AsyncFunction"], N);
    ne != null && h(ne, "options"), (ne == null ? void 0 : ne.signal) != null && f(ne.signal, "options.signal");
    let L = arguments.length > 1;
    if (ne != null && (F = ne.signal) !== null && F !== void 0 && F.aborted) {
      const Pe = new a(void 0, {
        cause: ne.signal.reason
      });
      throw this.once("error", () => {
      }), await m(this.destroy(Pe)), Pe;
    }
    const H = new t(), se = H.signal;
    if (ne != null && ne.signal) {
      const Pe = {
        once: !0,
        [g]: this,
        [l]: !0
      };
      ne.signal.addEventListener("abort", () => H.abort(), Pe);
    }
    let Ee = !1;
    try {
      for await (const Pe of this) {
        var Re;
        if (Ee = !0, ne != null && (Re = ne.signal) !== null && Re !== void 0 && Re.aborted)
          throw new a();
        L ? re = await N(re, Pe, {
          signal: se
        }) : (re = Pe, L = !0);
      }
      if (!Ee && !L)
        throw new pe();
    } finally {
      H.abort();
    }
    return re;
  }
  async function X(N) {
    N != null && h(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal");
    const re = [];
    for await (const F of this) {
      var ne;
      if (N != null && (ne = N.signal) !== null && ne !== void 0 && ne.aborted)
        throw new a(void 0, {
          cause: N.signal.reason
        });
      v(re, F);
    }
    return re;
  }
  function G(N, re) {
    const ne = ie.call(this, N, re);
    return (async function* () {
      for await (const L of ne)
        yield* L;
    }).call(this);
  }
  function le(N) {
    if (N = I(N), A(N))
      return 0;
    if (N < 0)
      throw new r("number", ">= 0", N);
    return N;
  }
  function O(N, re = void 0) {
    return re != null && h(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = le(N), (async function* () {
      var F;
      if (re != null && (F = re.signal) !== null && F !== void 0 && F.aborted)
        throw new a();
      for await (const H of this) {
        var L;
        if (re != null && (L = re.signal) !== null && L !== void 0 && L.aborted)
          throw new a();
        N-- <= 0 && (yield H);
      }
    }).call(this);
  }
  function B(N, re = void 0) {
    return re != null && h(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = le(N), (async function* () {
      var F;
      if (re != null && (F = re.signal) !== null && F !== void 0 && F.aborted)
        throw new a();
      for await (const H of this) {
        var L;
        if (re != null && (L = re.signal) !== null && L !== void 0 && L.aborted)
          throw new a();
        if (N-- > 0 && (yield H), N <= 0)
          return;
      }
    }).call(this);
  }
  return operators.streamReturningOperators = {
    asIndexedPairs: c(de, "readable.asIndexedPairs will be removed in a future version."),
    drop: O,
    filter: j,
    flatMap: G,
    map: ie,
    take: B,
    compose: D
  }, operators.promiseReturningOperators = {
    every: be,
    forEach: fe,
    reduce: ee,
    toArray: X,
    some: we,
    find: ce
  }, operators;
}
var promises, hasRequiredPromises;
function requirePromises() {
  if (hasRequiredPromises) return promises;
  hasRequiredPromises = 1;
  const { ArrayPrototypePop: t, Promise: e } = requirePrimordials(), { isIterable: n, isNodeStream: s, isWebStream: r } = requireUtils(), { pipelineImpl: a } = requirePipeline(), { finished: f } = requireEndOfStream();
  requireStream();
  function u(...h) {
    return new e((g, l) => {
      let m, w;
      const R = h[h.length - 1];
      if (R && typeof R == "object" && !s(R) && !n(R) && !r(R)) {
        const p = t(h);
        m = p.signal, w = p.end;
      }
      a(
        h,
        (p, q) => {
          p ? l(p) : g(q);
        },
        {
          signal: m,
          end: w
        }
      );
    });
  }
  return promises = {
    finished: f,
    pipeline: u
  }, promises;
}
var hasRequiredStream;
function requireStream() {
  if (hasRequiredStream) return stream.exports;
  hasRequiredStream = 1;
  const { Buffer: t } = requireDist(), { ObjectDefineProperty: e, ObjectKeys: n, ReflectApply: s } = requirePrimordials(), {
    promisify: { custom: r }
  } = requireUtil(), { streamReturningOperators: a, promiseReturningOperators: f } = requireOperators(), {
    codes: { ERR_ILLEGAL_CONSTRUCTOR: u }
  } = requireErrors(), h = requireCompose(), { setDefaultHighWaterMark: g, getDefaultHighWaterMark: l } = requireState(), { pipeline: m } = requirePipeline(), { destroyer: w } = requireDestroy(), R = requireEndOfStream(), p = requirePromises(), q = requireUtils(), c = stream.exports = requireLegacy().Stream;
  c.isDestroyed = q.isDestroyed, c.isDisturbed = q.isDisturbed, c.isErrored = q.isErrored, c.isReadable = q.isReadable, c.isWritable = q.isWritable, c.Readable = requireReadable();
  for (const P of n(a)) {
    let I = function(...A) {
      if (new.target)
        throw u();
      return c.Readable.from(s(E, this, A));
    };
    const E = a[P];
    e(I, "name", {
      __proto__: null,
      value: E.name
    }), e(I, "length", {
      __proto__: null,
      value: E.length
    }), e(c.Readable.prototype, P, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  for (const P of n(f)) {
    let I = function(...A) {
      if (new.target)
        throw u();
      return s(E, this, A);
    };
    const E = f[P];
    e(I, "name", {
      __proto__: null,
      value: E.name
    }), e(I, "length", {
      __proto__: null,
      value: E.length
    }), e(c.Readable.prototype, P, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  c.Writable = requireWritable(), c.Duplex = requireDuplex(), c.Transform = requireTransform(), c.PassThrough = requirePassthrough(), c.pipeline = m;
  const { addAbortSignal: v } = requireAddAbortSignal();
  return c.addAbortSignal = v, c.finished = R, c.destroy = w, c.compose = h, c.setDefaultHighWaterMark = g, c.getDefaultHighWaterMark = l, e(c, "promises", {
    __proto__: null,
    configurable: !0,
    enumerable: !0,
    get() {
      return p;
    }
  }), e(m, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return p.pipeline;
    }
  }), e(R, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return p.finished;
    }
  }), c.Stream = c, c._isUint8Array = function(E) {
    return E instanceof Uint8Array;
  }, c._uint8ArrayToBuffer = function(E) {
    return t.from(E.buffer, E.byteOffset, E.byteLength);
  }, stream.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  return hasRequiredBrowser || (hasRequiredBrowser = 1, (function(t) {
    const e = requireStream(), n = requirePromises(), s = e.Readable.destroy;
    t.exports = e.Readable, t.exports._uint8ArrayToBuffer = e._uint8ArrayToBuffer, t.exports._isUint8Array = e._isUint8Array, t.exports.isDisturbed = e.isDisturbed, t.exports.isErrored = e.isErrored, t.exports.isReadable = e.isReadable, t.exports.Readable = e.Readable, t.exports.Writable = e.Writable, t.exports.Duplex = e.Duplex, t.exports.Transform = e.Transform, t.exports.PassThrough = e.PassThrough, t.exports.addAbortSignal = e.addAbortSignal, t.exports.finished = e.finished, t.exports.destroy = e.destroy, t.exports.destroy = s, t.exports.pipeline = e.pipeline, t.exports.compose = e.compose, Object.defineProperty(e, "promises", {
      configurable: !0,
      enumerable: !0,
      get() {
        return n;
      }
    }), t.exports.Stream = e.Stream, t.exports.default = t.exports;
  })(browser$2)), browser$2.exports;
}
var serializer, hasRequiredSerializer;
function requireSerializer() {
  if (hasRequiredSerializer) return serializer;
  hasRequiredSerializer = 1;
  const t = requireBrowser().Transform;
  class e extends t {
    constructor(a, f) {
      super({ writableObjectMode: !0 }), this.proto = a, this.mainType = f, this.queue = Buffer.alloc(0);
    }
    createPacketBuffer(a) {
      return this.proto.createPacketBuffer(this.mainType, a);
    }
    _transform(a, f, u) {
      let h;
      try {
        h = this.createPacketBuffer(a);
      } catch (g) {
        return u(g);
      }
      return this.push(h), u();
    }
  }
  class n extends t {
    constructor(a, f) {
      super({ readableObjectMode: !0 }), this.proto = a, this.mainType = f, this.queue = Buffer.alloc(0);
    }
    parsePacketBuffer(a) {
      return this.proto.parsePacketBuffer(this.mainType, a);
    }
    _transform(a, f, u) {
      for (this.queue = Buffer.concat([this.queue, a]); ; ) {
        let h;
        try {
          h = this.parsePacketBuffer(this.queue);
        } catch (g) {
          return g.partialReadError ? u() : (g.buffer = this.queue, this.queue = Buffer.alloc(0), u(g));
        }
        this.push(h), this.queue = this.queue.slice(h.metadata.size);
      }
    }
  }
  class s extends t {
    constructor(a, f, u = !1) {
      super({ readableObjectMode: !0 }), this.proto = a, this.mainType = f, this.noErrorLogging = u;
    }
    parsePacketBuffer(a) {
      return this.proto.parsePacketBuffer(this.mainType, a);
    }
    _transform(a, f, u) {
      let h;
      try {
        h = this.parsePacketBuffer(a), h.metadata.size !== a.length && !this.noErrorLogging && console.log("Chunk size is " + a.length + " but only " + h.metadata.size + " was read ; partial packet : " + JSON.stringify(h.data) + "; buffer :" + a.toString("hex"));
      } catch (g) {
        return g.partialReadError ? (this.noErrorLogging || console.log(g.stack), u()) : u(g);
      }
      this.push(h), u();
    }
  }
  return serializer = {
    Serializer: e,
    Parser: n,
    FullPacketParser: s
  }, serializer;
}
var compilerConditional, hasRequiredCompilerConditional;
function requireCompilerConditional() {
  return hasRequiredCompilerConditional || (hasRequiredCompilerConditional = 1, compilerConditional = {
    Read: {
      switch: ["parametrizable", (t, e) => {
        let n = e.compareTo ? e.compareTo : e.compareToValue;
        const s = [];
        n.startsWith("$") ? s.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType(e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType(e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, s);
      }],
      option: ["parametrizable", (t, e) => {
        let n = `const {value} = ctx.bool(buffer, offset)
`;
        return n += `if (value) {
`, n += "  const { value, size } = " + t.callType(e, "offset + 1") + `
`, n += `  return { value, size: size + 1 }
`, n += `}
`, n += "return { value: undefined, size: 1}", t.wrapCode(n);
      }]
    },
    Write: {
      switch: ["parametrizable", (t, e) => {
        let n = e.compareTo ? e.compareTo : e.compareToValue;
        const s = [];
        n.startsWith("$") ? s.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, s);
      }],
      option: ["parametrizable", (t, e) => {
        let n = `if (value != null) {
`;
        return n += `  offset = ctx.bool(1, buffer, offset)
`, n += "  offset = " + t.callType("value", e) + `
`, n += `} else {
`, n += `  offset = ctx.bool(0, buffer, offset)
`, n += `}
`, n += "return offset", t.wrapCode(n);
      }]
    },
    SizeOf: {
      switch: ["parametrizable", (t, e) => {
        let n = e.compareTo ? e.compareTo : e.compareToValue;
        const s = [];
        n.startsWith("$") ? s.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, s);
      }],
      option: ["parametrizable", (t, e) => {
        let n = `if (value != null) {
`;
        return n += "  return 1 + " + t.callType("value", e) + `
`, n += `}
`, n += "return 1", t.wrapCode(n);
      }]
    }
  }), compilerConditional;
}
var compilerStructures, hasRequiredCompilerStructures;
function requireCompilerStructures() {
  if (hasRequiredCompilerStructures) return compilerStructures;
  hasRequiredCompilerStructures = 1, compilerStructures = {
    Read: {
      array: ["parametrizable", (n, s) => {
        let r = "";
        if (s.countType)
          r += "const { value: count, size: countSize } = " + n.callType(s.countType) + `
`;
        else if (s.count)
          r += "const count = " + s.count + `
`, r += `const countSize = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return r += `if (count > 0xffffff && !ctx.noArraySizeCheck) throw new Error("array size is abnormally large, not reading: " + count)
`, r += `const data = []
`, r += `let size = countSize
`, r += `for (let i = 0; i < count; i++) {
`, r += "  const elem = " + n.callType(s.type, "offset + size") + `
`, r += `  data.push(elem.value)
`, r += `  size += elem.size
`, r += `}
`, r += "return { value: data, size }", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, s) => {
        const r = "return " + n.callType(s.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, s) => {
        s = e(s);
        let r = "", a = "offset";
        const f = [];
        for (const h in s) {
          const { type: g, name: l, anon: m, _shouldBeInlined: w } = s[h];
          let R, p;
          if (g instanceof Array && g[0] === "bitfield" && m) {
            const q = [];
            for (const { name: c } of g[1]) {
              const v = n.getField(c);
              c === v ? (f.push(c), q.push(c)) : (f.push(`${c}: ${v}`), q.push(`${c}: ${v}`));
            }
            R = "{" + q.join(", ") + "}", p = `anon${h}Size`;
          } else
            R = n.getField(l), p = `${R}Size`, w ? f.push("..." + l) : l === R ? f.push(l) : f.push(`${l}: ${R}`);
          r += `let { value: ${R}, size: ${p} } = ` + n.callType(g, a) + `
`, a += ` + ${p}`;
        }
        const u = a.split(" + ");
        return u.shift(), u.length === 0 && u.push("0"), r += "return { value: { " + f.join(", ") + " }, size: " + u.join(" + ") + "}", n.wrapCode(r);
      }]
    },
    Write: {
      array: ["parametrizable", (n, s) => {
        let r = "";
        if (s.countType)
          r += "offset = " + n.callType("value.length", s.countType) + `
`;
        else if (s.count === null)
          throw new Error("Array must contain either count or countType");
        return r += `for (let i = 0; i < value.length; i++) {
`, r += "  offset = " + n.callType("value[i]", s.type) + `
`, r += `}
`, r += "return offset", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, s) => {
        const r = "return " + n.callType("value", s.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, s) => {
        s = e(s);
        let r = "";
        for (const a in s) {
          const { type: f, name: u, anon: h, _shouldBeInlined: g } = s[a];
          let l;
          if (f instanceof Array && f[0] === "bitfield" && h) {
            const m = [];
            for (const { name: w } of f[1]) {
              const R = n.getField(w);
              r += `const ${R} = value.${w}
`, w === R ? m.push(w) : m.push(`${w}: ${R}`);
            }
            l = "{" + m.join(", ") + "}";
          } else
            l = n.getField(u), g ? r += `let ${u} = value
` : r += `let ${l} = value.${u}
`;
          r += "offset = " + n.callType(l, f) + `
`;
        }
        return r += "return offset", n.wrapCode(r);
      }]
    },
    SizeOf: {
      array: ["parametrizable", (n, s) => {
        let r = "";
        if (s.countType)
          r += "let size = " + n.callType("value.length", s.countType) + `
`;
        else if (s.count)
          r += `let size = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return isNaN(n.callType("value[i]", s.type)) ? (r += `for (let i = 0; i < value.length; i++) {
`, r += "  size += " + n.callType("value[i]", s.type) + `
`, r += `}
`) : r += "size += value.length * " + n.callType("value[i]", s.type) + `
`, r += "return size", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, s) => {
        const r = "return " + n.callType("value", s.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, s) => {
        s = e(s);
        let r = `let size = 0
`;
        for (const a in s) {
          const { type: f, name: u, anon: h, _shouldBeInlined: g } = s[a];
          let l;
          if (f instanceof Array && f[0] === "bitfield" && h) {
            const m = [];
            for (const { name: w } of f[1]) {
              const R = n.getField(w);
              r += `const ${R} = value.${w}
`, w === R ? m.push(w) : m.push(`${w}: ${R}`);
            }
            l = "{" + m.join(", ") + "}";
          } else
            l = n.getField(u), g ? r += `let ${u} = value
` : r += `let ${l} = value.${u}
`;
          r += "size += " + n.callType(l, f) + `
`;
        }
        return r += "return size", n.wrapCode(r);
      }]
    }
  };
  function t() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  function e(n) {
    const s = [];
    for (const r in n) {
      const { type: a, anon: f } = n[r];
      if (f && !(a instanceof Array && a[0] === "bitfield"))
        if (a instanceof Array && a[0] === "container")
          for (const u in a[1]) s.push(a[1][u]);
        else if (a instanceof Array && a[0] === "switch")
          s.push({
            name: t(),
            _shouldBeInlined: !0,
            type: a
          });
        else
          throw new Error("Cannot inline anonymous type: " + a);
      else
        s.push(n[r]);
    }
    return s;
  }
  return compilerStructures;
}
var compilerUtils, hasRequiredCompilerUtils;
function requireCompilerUtils() {
  if (hasRequiredCompilerUtils) return compilerUtils;
  hasRequiredCompilerUtils = 1, compilerUtils = {
    Read: {
      pstring: ["parametrizable", (s, r) => {
        let a = "";
        if (r.countType)
          a += "const { value: count, size: countSize } = " + s.callType(r.countType) + `
`;
        else if (r.count)
          a += "const count = " + r.count + `
`, a += `const countSize = 0
`;
        else
          throw new Error("pstring must contain either count or countType");
        return a += `offset += countSize
`, a += `if (offset + count > buffer.length) {
`, a += `  throw new PartialReadError("Missing characters in string, found size is " + buffer.length + " expected size was " + (offset + count))
`, a += `}
`, a += `return { value: buffer.toString("${r.encoding || "utf8"}", offset, offset + count), size: count + countSize }`, s.wrapCode(a);
      }],
      buffer: ["parametrizable", (s, r) => {
        let a = "";
        if (r.countType)
          a += "const { value: count, size: countSize } = " + s.callType(r.countType) + `
`;
        else if (r.count)
          a += "const count = " + r.count + `
`, a += `const countSize = 0
`;
        else
          throw new Error("buffer must contain either count or countType");
        return a += `offset += countSize
`, a += `if (offset + count > buffer.length) {
`, a += `  throw new PartialReadError()
`, a += `}
`, a += "return { value: buffer.slice(offset, offset + count), size: count + countSize }", s.wrapCode(a);
      }],
      bitfield: ["parametrizable", (s, r) => {
        let a = "";
        const f = Math.ceil(r.reduce((g, { size: l }) => g + l, 0) / 8);
        a += `if ( offset + ${f} > buffer.length) { throw new PartialReadError() }
`;
        const u = [];
        let h = 8;
        a += `let bits = buffer[offset++]
`;
        for (const g in r) {
          const { name: l, size: m, signed: w } = r[g], R = s.getField(l);
          for (; h < m; )
            h += 8, a += `bits = (bits << 8) | buffer[offset++]
`;
          a += `let ${R} = (bits >> ` + (h - m) + ") & 0x" + ((1 << m) - 1).toString(16) + `
`, w && (a += `${R} -= (${R} & 0x` + (1 << m - 1).toString(16) + `) << 1
`), h -= m, l === R ? u.push(l) : u.push(`${l}: ${R}`);
        }
        return a += "return { value: { " + u.join(", ") + ` }, size: ${f} }`, s.wrapCode(a);
      }],
      bitflags: ["parametrizable", (s, { type: r, flags: a, shift: f, big: u }) => {
        let h = JSON.stringify(a);
        if (Array.isArray(a)) {
          h = "{";
          for (const [g, l] of Object.entries(a)) h += `"${l}": ${u ? 1n << BigInt(g) : 1 << g}` + (u ? "n," : ",");
          h += "}";
        } else if (f) {
          h = "{";
          for (const g in a) h += `"${g}": ${1 << a[g]}${u ? "n," : ","}`;
          h += "}";
        }
        return s.wrapCode(`
const { value: _value, size } = ${s.callType(r, "offset")}
const value = { _value }
const flags = ${h}
for (const key in flags) {
  value[key] = (_value & flags[key]) == flags[key]
}
return { value, size }
      `.trim());
      }],
      mapper: ["parametrizable", (s, r) => {
        let a = "const { value, size } = " + s.callType(r.type) + `
`;
        return a += "return { value: " + JSON.stringify(t(r.mappings)) + "[value] || value, size }", s.wrapCode(a);
      }]
    },
    Write: {
      pstring: ["parametrizable", (s, r) => {
        let a = `const length = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          a += "offset = " + s.callType("length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return a += `buffer.write(value, offset, length, "${r.encoding || "utf8"}")
`, a += "return offset + length", s.wrapCode(a);
      }],
      buffer: ["parametrizable", (s, r) => {
        let a = `if (!(value instanceof Buffer)) value = Buffer.from(value)
`;
        if (r.countType)
          a += "offset = " + s.callType("value.length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return a += `value.copy(buffer, offset)
`, a += "return offset + value.length", s.wrapCode(a);
      }],
      bitfield: ["parametrizable", (s, r) => {
        let a = "", f = 0, u = "";
        for (const h in r) {
          let { name: g, size: l } = r[h];
          const m = s.getField(g);
          for (u += `let ${m} = value.${g}
`; l > 0; ) {
            const w = Math.min(8 - f, l), R = (1 << w) - 1;
            a !== "" && (a = `((${a}) << ${w}) | `), a += `((${m} >> ` + (l - w) + ") & 0x" + R.toString(16) + ")", l -= w, f += w, f === 8 && (u += "buffer[offset++] = " + a + `
`, f = 0, a = "");
          }
        }
        return f !== 0 && (u += "buffer[offset++] = (" + a + ") << " + (8 - f) + `
`), u += "return offset", s.wrapCode(u);
      }],
      bitflags: ["parametrizable", (s, { type: r, flags: a, shift: f, big: u }) => {
        let h = JSON.stringify(a);
        if (Array.isArray(a)) {
          h = "{";
          for (const [g, l] of Object.entries(a)) h += `"${l}": ${u ? 1n << BigInt(g) : 1 << g}` + (u ? "n," : ",");
          h += "}";
        } else if (f) {
          h = "{";
          for (const g in a) h += `"${g}": ${1 << a[g]}${u ? "n," : ","}`;
          h += "}";
        }
        return s.wrapCode(`
const flags = ${h}
let val = value._value ${u ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val, buffer, offset)
      `.trim());
      }],
      mapper: ["parametrizable", (s, r) => {
        const a = JSON.stringify(e(r.mappings)), f = "return " + s.callType(`${a}[value] || value`, r.type);
        return s.wrapCode(f);
      }]
    },
    SizeOf: {
      pstring: ["parametrizable", (s, r) => {
        let a = `let size = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          a += "size += " + s.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return a += "return size", s.wrapCode(a);
      }],
      buffer: ["parametrizable", (s, r) => {
        let a = `let size = value instanceof Buffer ? value.length : Buffer.from(value).length
`;
        if (r.countType)
          a += "size += " + s.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return a += "return size", s.wrapCode(a);
      }],
      bitfield: ["parametrizable", (s, r) => `${Math.ceil(r.reduce((f, { size: u }) => f + u, 0) / 8)}`],
      bitflags: ["parametrizable", (s, { type: r, flags: a, shift: f, big: u }) => {
        let h = JSON.stringify(a);
        if (Array.isArray(a)) {
          h = "{";
          for (const [g, l] of Object.entries(a)) h += `"${l}": ${u ? 1n << BigInt(g) : 1 << g}` + (u ? "n," : ",");
          h += "}";
        } else if (f) {
          h = "{";
          for (const g in a) h += `"${g}": ${1 << a[g]}${u ? "n," : ","}`;
          h += "}";
        }
        return s.wrapCode(`
const flags = ${h}
let val = value._value ${u ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val)
      `.trim());
      }],
      mapper: ["parametrizable", (s, r) => {
        const a = JSON.stringify(e(r.mappings)), f = "return " + s.callType(`${a}[value] || value`, r.type);
        return s.wrapCode(f);
      }]
    }
  };
  function t(s) {
    const r = {};
    for (let a in s) {
      let f = s[a];
      a = n(a), isNaN(f) || (f = Number(f)), f === "true" && (f = !0), f === "false" && (f = !1), r[a] = f;
    }
    return r;
  }
  function e(s) {
    const r = {};
    for (let a in s) {
      const f = s[a];
      a = n(a), r[f] = isNaN(a) ? a : parseInt(a, 10);
    }
    return r;
  }
  function n(s) {
    return s.match(/^0x[0-9a-f]+$/i) ? parseInt(s.substring(2), 16) : s;
  }
  return compilerUtils;
}
var compiler, hasRequiredCompiler;
function requireCompiler() {
  if (hasRequiredCompiler) return compiler;
  hasRequiredCompiler = 1;
  const numeric = requireNumeric(), utils = requireUtils$1(), conditionalDatatypes = requireCompilerConditional(), structuresDatatypes = requireCompilerStructures(), utilsDatatypes = requireCompilerUtils(), { tryCatch } = requireUtils$2();
  class ProtoDefCompiler {
    constructor() {
      this.readCompiler = new ReadCompiler(), this.writeCompiler = new WriteCompiler(), this.sizeOfCompiler = new SizeOfCompiler();
    }
    addTypes(e) {
      this.readCompiler.addTypes(e.Read), this.writeCompiler.addTypes(e.Write), this.sizeOfCompiler.addTypes(e.SizeOf);
    }
    addTypesToCompile(e) {
      this.readCompiler.addTypesToCompile(e), this.writeCompiler.addTypesToCompile(e), this.sizeOfCompiler.addTypesToCompile(e);
    }
    addProtocol(e, n) {
      this.readCompiler.addProtocol(e, n), this.writeCompiler.addProtocol(e, n), this.sizeOfCompiler.addProtocol(e, n);
    }
    addVariable(e, n) {
      this.readCompiler.addContextType(e, n), this.writeCompiler.addContextType(e, n), this.sizeOfCompiler.addContextType(e, n);
    }
    compileProtoDefSync(e = { printCode: !1 }) {
      const n = this.sizeOfCompiler.generate(), s = this.writeCompiler.generate(), r = this.readCompiler.generate();
      e.printCode && (console.log("// SizeOf:"), console.log(n), console.log("// Write:"), console.log(s), console.log("// Read:"), console.log(r));
      const a = this.sizeOfCompiler.compile(n), f = this.writeCompiler.compile(s), u = this.readCompiler.compile(r);
      return new CompiledProtodef(a, f, u);
    }
  }
  class CompiledProtodef {
    constructor(e, n, s) {
      this.sizeOfCtx = e, this.writeCtx = n, this.readCtx = s;
    }
    read(e, n, s) {
      const r = this.readCtx[s];
      if (!r)
        throw new Error("missing data type: " + s);
      return r(e, n);
    }
    write(e, n, s, r) {
      const a = this.writeCtx[r];
      if (!a)
        throw new Error("missing data type: " + r);
      return a(e, n, s);
    }
    setVariable(e, n) {
      this.sizeOfCtx[e] = n, this.readCtx[e] = n, this.writeCtx[e] = n;
    }
    sizeOf(e, n) {
      const s = this.sizeOfCtx[n];
      if (!s)
        throw new Error("missing data type: " + n);
      return typeof s == "function" ? s(e) : s;
    }
    createPacketBuffer(e, n) {
      const s = tryCatch(
        () => this.sizeOf(n, e),
        (a) => {
          throw a.message = `SizeOf error for ${a.field} : ${a.message}`, a;
        }
      ), r = Buffer.allocUnsafe(s);
      return tryCatch(
        () => this.write(n, r, 0, e),
        (a) => {
          throw a.message = `Write error for ${a.field} : ${a.message}`, a;
        }
      ), r;
    }
    parsePacketBuffer(e, n, s = 0) {
      const { value: r, size: a } = tryCatch(
        () => this.read(n, s, e),
        (f) => {
          throw f.message = `Read error for ${f.field} : ${f.message}`, f;
        }
      );
      return {
        data: r,
        metadata: { size: a },
        buffer: n.slice(0, a),
        fullBuffer: n
      };
    }
  }
  class Compiler {
    constructor() {
      this.primitiveTypes = {}, this.native = {}, this.context = {}, this.types = {}, this.scopeStack = [], this.parameterizableTypes = {};
    }
    /**
     * A native type is a type read or written by a function that will be called in it's
     * original context.
     * @param {*} type
     * @param {*} fn
     */
    addNativeType(t, e) {
      this.primitiveTypes[t] = `native.${t}`, this.native[t] = e, this.types[t] = "native";
    }
    /**
     * A context type is a type that will be called in the protocol's context. It can refer to
     * registred native types using native.{type}() or context type (provided and generated)
     * using ctx.{type}(), but cannot access it's original context.
     * @param {*} type
     * @param {*} fn
     */
    addContextType(t, e) {
      this.primitiveTypes[t] = `ctx.${t}`, this.context[t] = e.toString();
    }
    /**
     * A parametrizable type is a function that will be generated at compile time using the
     * provided maker function
     * @param {*} type
     * @param {*} maker
     */
    addParametrizableType(t, e) {
      this.parameterizableTypes[t] = e;
    }
    addTypes(t) {
      for (const [e, [n, s]] of Object.entries(t))
        n === "native" ? this.addNativeType(e, s) : n === "context" ? this.addContextType(e, s) : n === "parametrizable" && this.addParametrizableType(e, s);
    }
    addTypesToCompile(t) {
      for (const [e, n] of Object.entries(t))
        (!this.types[e] || this.types[e] === "native") && (this.types[e] = n);
    }
    addProtocol(t, e) {
      const n = this;
      function s(r, a) {
        r !== void 0 && (r.types && n.addTypesToCompile(r.types), s(r[a.shift()], a));
      }
      s(t, e.slice(0));
    }
    indent(t, e = "  ") {
      return t.split(`
`).map((n) => e + n).join(`
`);
    }
    getField(t, e) {
      const n = t.split("/");
      let s = this.scopeStack.length - 1;
      const r = ["value", "enum", "default", "size", "offset"];
      for (; n.length; ) {
        const a = this.scopeStack[s], f = n.shift();
        if (f === "..") {
          s--;
          continue;
        }
        if (a[f]) return a[f] + (n.length ? "." + n.join(".") : "");
        if (n.length !== 0)
          throw new Error("Cannot access properties of undefined field");
        let u = 0;
        r.includes(f) && u++;
        for (let h = 0; h < s; h++)
          this.scopeStack[h][f] && u++;
        return e ? a[f] = f : a[f] = f + (u || ""), a[f];
      }
      throw new Error("Unknown field " + n);
    }
    generate() {
      this.scopeStack = [{}];
      const t = [];
      for (const e in this.context)
        t[e] = this.context[e];
      for (const e in this.types)
        t[e] || (this.types[e] !== "native" ? (t[e] = this.compileType(this.types[e]), t[e].startsWith("ctx") && (t[e] = "function () { return " + t[e] + "(...arguments) }"), isNaN(t[e]) || (t[e] = this.wrapCode("  return " + t[e]))) : t[e] = `native.${e}`);
      return `() => {
` + this.indent(`const ctx = {
` + this.indent(Object.keys(t).map((e) => e + ": " + t[e]).join(`,
`)) + `
}
return ctx`) + `
}`;
    }
    /**
     * Compile the given js code, providing native.{type} to the context, return the compiled types
     * @param {*} code
     */
    compile(code) {
      this.native;
      const { PartialReadError } = requireUtils$2();
      return eval(code)();
    }
  }
  class ReadCompiler extends Compiler {
    constructor() {
      super(), this.addTypes(conditionalDatatypes.Read), this.addTypes(structuresDatatypes.Read), this.addTypes(utilsDatatypes.Read);
      for (const e in numeric)
        this.addNativeType(e, numeric[e][0]);
      for (const e in utils)
        this.addNativeType(e, utils[e][0]);
    }
    compileType(e) {
      if (e instanceof Array) {
        if (this.parameterizableTypes[e[0]])
          return this.parameterizableTypes[e[0]](this, e[1]);
        if (this.types[e[0]] && this.types[e[0]] !== "native")
          return this.wrapCode("return " + this.callType(e[0], "offset", Object.values(e[1])));
        throw new Error("Unknown parametrizable type: " + JSON.stringify(e[0]));
      } else
        return e === "native" ? "null" : this.types[e] ? "ctx." + e : this.primitiveTypes[e];
    }
    wrapCode(e, n = []) {
      return n.length > 0 ? "(buffer, offset, " + n.join(", ") + `) => {
` + this.indent(e) + `
}` : `(buffer, offset) => {
` + this.indent(e) + `
}`;
    }
    callType(e, n = "offset", s = []) {
      if (e instanceof Array && this.types[e[0]] && this.types[e[0]] !== "native")
        return this.callType(e[0], n, Object.values(e[1]));
      e instanceof Array && e[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(e);
      return e instanceof Array && e[0] === "container" && this.scopeStack.pop(), s.length > 0 ? "(" + r + `)(buffer, ${n}, ` + s.map((a) => this.getField(a)).join(", ") + ")" : "(" + r + `)(buffer, ${n})`;
    }
  }
  class WriteCompiler extends Compiler {
    constructor() {
      super(), this.addTypes(conditionalDatatypes.Write), this.addTypes(structuresDatatypes.Write), this.addTypes(utilsDatatypes.Write);
      for (const e in numeric)
        this.addNativeType(e, numeric[e][1]);
      for (const e in utils)
        this.addNativeType(e, utils[e][1]);
    }
    compileType(e) {
      if (e instanceof Array) {
        if (this.parameterizableTypes[e[0]])
          return this.parameterizableTypes[e[0]](this, e[1]);
        if (this.types[e[0]] && this.types[e[0]] !== "native")
          return this.wrapCode("return " + this.callType("value", e[0], "offset", Object.values(e[1])));
        throw new Error("Unknown parametrizable type: " + e[0]);
      } else
        return e === "native" ? "null" : this.types[e] ? "ctx." + e : this.primitiveTypes[e];
    }
    wrapCode(e, n = []) {
      return n.length > 0 ? "(value, buffer, offset, " + n.join(", ") + `) => {
` + this.indent(e) + `
}` : `(value, buffer, offset) => {
` + this.indent(e) + `
}`;
    }
    callType(e, n, s = "offset", r = []) {
      if (n instanceof Array && this.types[n[0]] && this.types[n[0]] !== "native")
        return this.callType(e, n[0], s, Object.values(n[1]));
      n instanceof Array && n[0] === "container" && this.scopeStack.push({});
      const a = this.compileType(n);
      return n instanceof Array && n[0] === "container" && this.scopeStack.pop(), r.length > 0 ? "(" + a + `)(${e}, buffer, ${s}, ` + r.map((f) => this.getField(f)).join(", ") + ")" : "(" + a + `)(${e}, buffer, ${s})`;
    }
  }
  class SizeOfCompiler extends Compiler {
    constructor() {
      super(), this.addTypes(conditionalDatatypes.SizeOf), this.addTypes(structuresDatatypes.SizeOf), this.addTypes(utilsDatatypes.SizeOf);
      for (const e in numeric)
        this.addNativeType(e, numeric[e][2]);
      for (const e in utils)
        this.addNativeType(e, utils[e][2]);
    }
    /**
     * A native type is a type read or written by a function that will be called in it's
     * original context.
     * @param {*} type
     * @param {*} fn
     */
    addNativeType(e, n) {
      this.primitiveTypes[e] = `native.${e}`, isNaN(n) ? this.native[e] = n : this.native[e] = (s) => n, this.types[e] = "native";
    }
    compileType(e) {
      if (e instanceof Array) {
        if (this.parameterizableTypes[e[0]])
          return this.parameterizableTypes[e[0]](this, e[1]);
        if (this.types[e[0]] && this.types[e[0]] !== "native")
          return this.wrapCode("return " + this.callType("value", e[0], Object.values(e[1])));
        throw new Error("Unknown parametrizable type: " + e[0]);
      } else
        return e === "native" ? "null" : isNaN(this.primitiveTypes[e]) ? this.types[e] ? "ctx." + e : this.primitiveTypes[e] : this.primitiveTypes[e];
    }
    wrapCode(e, n = []) {
      return n.length > 0 ? "(value, " + n.join(", ") + `) => {
` + this.indent(e) + `
}` : `(value) => {
` + this.indent(e) + `
}`;
    }
    callType(e, n, s = []) {
      if (n instanceof Array && this.types[n[0]] && this.types[n[0]] !== "native")
        return this.callType(e, n[0], Object.values(n[1]));
      n instanceof Array && n[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(n);
      return n instanceof Array && n[0] === "container" && this.scopeStack.pop(), isNaN(r) ? s.length > 0 ? "(" + r + `)(${e}, ` + s.map((a) => this.getField(a)).join(", ") + ")" : "(" + r + `)(${e})` : r;
    }
  }
  return compiler = {
    ReadCompiler,
    WriteCompiler,
    SizeOfCompiler,
    ProtoDefCompiler,
    CompiledProtodef
  }, compiler;
}
var src, hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  const t = requireProtodef$1(), e = new t();
  return src = {
    ProtoDef: t,
    Serializer: requireSerializer().Serializer,
    Parser: requireSerializer().Parser,
    FullPacketParser: requireSerializer().FullPacketParser,
    Compiler: requireCompiler(),
    types: e.types,
    utils: requireUtils$2()
  }, src;
}
var protodef, hasRequiredProtodef;
function requireProtodef() {
  return hasRequiredProtodef || (hasRequiredProtodef = 1, protodef = requireSrc()), protodef;
}
const container$1 = "native", i8$1 = "native", compound$2 = "native", nbtTagName = "native", i16$1 = "native", u16 = "native", i32$1 = "native", i64$1 = "native", f32$1 = "native", f64$1 = "native", pstring$1 = "native", shortString$1 = ["pstring", { countType: "u16" }], byteArray$1 = ["array", { countType: "i32", type: "i8" }], list$1 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "i32", type: ["nbtSwitch", { type: "type" }] }] }]], intArray$1 = ["array", { countType: "i32", type: "i32" }], longArray$1 = ["array", { countType: "i32", type: "i64" }], nbtMapper$1 = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], nbtSwitch$1 = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "i32", long: "i64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], nbt$3 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], anonymousNbt = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], anonOptionalNbt = ["optionalNbtType", { tagType: "anonymousNbt" }], optionalNbt = ["optionalNbtType", { tagType: "nbt" }], require$$2 = {
  void: "native",
  container: container$1,
  i8: i8$1,
  switch: "native",
  compound: compound$2,
  nbtTagName,
  i16: i16$1,
  u16,
  i32: i32$1,
  i64: i64$1,
  f32: f32$1,
  f64: f64$1,
  pstring: pstring$1,
  shortString: shortString$1,
  byteArray: byteArray$1,
  list: list$1,
  intArray: intArray$1,
  longArray: longArray$1,
  nbtMapper: nbtMapper$1,
  nbtSwitch: nbtSwitch$1,
  nbt: nbt$3,
  anonymousNbt,
  anonOptionalNbt,
  optionalNbt
}, container = "native", i8 = "native", compound$1 = "native", zigzag32 = "native", zigzag64 = "native", i16 = "native", i32 = "native", i64 = "native", f32 = "native", f64 = "native", pstring = "native", shortString = ["pstring", { countType: "varint" }], byteArray = ["array", { countType: "zigzag32", type: "i8" }], list = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "zigzag32", type: ["nbtSwitch", { type: "type" }] }] }]], intArray = ["array", { countType: "zigzag32", type: "i32" }], longArray = ["array", { countType: "zigzag32", type: "i64" }], nbtMapper = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], nbtSwitch = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "zigzag32", long: "zigzag64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], nbt$2 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], require$$3 = {
  void: "native",
  container,
  i8,
  switch: "native",
  compound: compound$1,
  zigzag32,
  zigzag64,
  i16,
  i32,
  i64,
  f32,
  f64,
  pstring,
  shortString,
  byteArray,
  list,
  intArray,
  longArray,
  nbtMapper,
  nbtSwitch,
  nbt: nbt$2
};
var compilerCompound, hasRequiredCompilerCompound;
function requireCompilerCompound() {
  return hasRequiredCompilerCompound || (hasRequiredCompilerCompound = 1, compilerCompound = {
    Read: {
      compound: ["context", (t, e) => {
        const n = {
          value: {},
          size: 0
        };
        for (; e !== t.length; ) {
          const s = ctx.i8(t, e);
          if (s.value === 0) {
            n.size += s.size;
            break;
          }
          if (s.value > 20)
            throw new Error(`Invalid tag: ${s.value} > 20`);
          const r = ctx.nbt(t, e);
          e += r.size, n.size += r.size, n.value[r.value.name] = {
            type: r.value.type,
            value: r.value.value
          };
        }
        return n;
      }]
    },
    Write: {
      compound: ["context", (t, e, n) => {
        for (const s in t)
          n = ctx.nbt({
            name: s,
            type: t[s].type,
            value: t[s].value
          }, e, n);
        return n = ctx.i8(0, e, n), n;
      }]
    },
    SizeOf: {
      compound: ["context", (t) => {
        let e = 1;
        for (const n in t)
          e += ctx.nbt({
            name: n,
            type: t[n].type,
            value: t[n].value
          });
        return e;
      }]
    }
  }), compilerCompound;
}
var compilerTagname, hasRequiredCompilerTagname;
function requireCompilerTagname() {
  if (hasRequiredCompilerTagname) return compilerTagname;
  hasRequiredCompilerTagname = 1;
  function t(s, r) {
    const { value: a, size: f } = ctx.shortString(s, r);
    for (const u of a)
      if (u === "\0") throw new Error("unexpected tag end");
    return { value: a, size: f };
  }
  function e(...s) {
    return ctx.shortString(...s);
  }
  function n(...s) {
    return ctx.shortString(...s);
  }
  return compilerTagname = {
    Read: { nbtTagName: ["context", t] },
    Write: { nbtTagName: ["context", e] },
    SizeOf: { nbtTagName: ["context", n] }
  }, compilerTagname;
}
var optional, hasRequiredOptional;
function requireOptional() {
  if (hasRequiredOptional) return optional;
  hasRequiredOptional = 1;
  function t(r, a, { tagType: f }, u) {
    if (a + 1 > r.length)
      throw new Error("Read out of bounds");
    return r.readInt8(a) === 0 ? { size: 1 } : this.read(r, a, f, u);
  }
  function e(r, a, f, { tagType: u }, h) {
    return r === void 0 ? (a.writeInt8(0, f), f + 1) : this.write(r, a, f, u, h);
  }
  function n(r, { tagType: a }, f) {
    return r === void 0 ? 1 : this.sizeOf(r, a, a, f);
  }
  return optional = {
    compiler: {
      Read: {
        optionalNbtType: ["parametrizable", (r, { tagType: a }) => r.wrapCode(`
if (offset + 1 > buffer.length) { throw new PartialReadError() }
if (buffer.readInt8(offset) === 0) return { size: 1 }
return ${r.callType(a)}
      `)]
      },
      Write: {
        optionalNbtType: ["parametrizable", (r, { tagType: a }) => r.wrapCode(`
if (value === undefined) {
  buffer.writeInt8(0, offset)
  return offset + 1
}
return ${r.callType("value", a)}
      `)]
      },
      SizeOf: {
        optionalNbtType: ["parametrizable", (r, { tagType: a }) => r.wrapCode(`
if (value === undefined) { return 1 }
return ${r.callType("value", a)}
      `)]
      }
    },
    interpret: { optionalNbtType: [t, e, n] }
  }, optional;
}
var compound, hasRequiredCompound;
function requireCompound() {
  if (hasRequiredCompound) return compound;
  hasRequiredCompound = 1, compound = {
    compound: [t, e, n]
  };
  function t(s, r, a, f) {
    const u = {
      value: {},
      size: 0
    };
    for (; ; ) {
      const h = this.read(s, r, "i8", f);
      if (h.value === 0) {
        r += h.size, u.size += h.size;
        break;
      }
      const g = this.read(s, r, "nbt", f);
      r += g.size, u.size += g.size, u.value[g.value.name] = {
        type: g.value.type,
        value: g.value.value
      };
    }
    return u;
  }
  function e(s, r, a, f, u) {
    const h = this;
    return Object.keys(s).forEach(function(g) {
      a = h.write({
        name: g,
        type: s[g].type,
        value: s[g].value
      }, r, a, "nbt", u);
    }), a = this.write(0, r, a, "i8", u), a;
  }
  function n(s, r, a) {
    const f = this;
    return 1 + Object.keys(s).reduce(function(h, g) {
      return h + f.sizeOf({
        name: g,
        type: s[g].type,
        value: s[g].value
      }, "nbt", a);
    }, 0);
  }
  return compound;
}
var tagType, hasRequiredTagType;
function requireTagType() {
  return hasRequiredTagType || (hasRequiredTagType = 1, tagType = {
    Byte: "byte",
    Short: "short",
    Int: "int",
    Long: "long",
    Float: "float",
    Double: "double",
    ByteArray: "byteArray",
    String: "string",
    List: "list",
    Compound: "compound",
    IntArray: "intArray",
    LongArray: "longArray"
  }), tagType;
}
var nbt$1, hasRequiredNbt;
function requireNbt() {
  if (hasRequiredNbt) return nbt$1;
  hasRequiredNbt = 1;
  const t = requireLib(), { ProtoDefCompiler: e } = requireProtodef().Compiler, n = JSON.stringify(require$$2), s = n.replace(/([iuf][0-7]+)/g, "l$1"), r = JSON.stringify(require$$3).replace(/([if][0-7]+)/g, "l$1");
  function a(A, $) {
    $.addTypes(requireCompilerCompound()), $.addTypes(requireCompilerTagname()), $.addTypes(requireOptional().compiler);
    let x = n;
    A === "littleVarint" ? x = r : A === "little" && (x = s), $.addTypesToCompile(JSON.parse(x));
  }
  function f(A, $) {
    $.addTypes(requireCompound()), $.addTypes(requireOptional().interpret);
    let x = n;
    A === "littleVarint" ? x = r : A === "little" && (x = s), $.addTypes(JSON.parse(x)), $.types.nbtTagName = $.types.shortString;
  }
  function u(A) {
    const $ = new e();
    return a(A, $), $.compileProtoDefSync();
  }
  const h = u("big"), g = u("little"), l = u("littleVarint"), m = {
    big: h,
    little: g,
    littleVarint: l
  };
  function w(A, $ = "big") {
    return $ === !0 && ($ = "little"), m[$].createPacketBuffer("nbt", A);
  }
  function R(A, $ = "big", x = {}) {
    return $ === !0 && ($ = "little"), m[$].setVariable("noArraySizeCheck", x.noArraySizeCheck), m[$].parsePacketBuffer("nbt", A, A.startOffset).data;
  }
  const p = function(A) {
    let $ = !0;
    return A[0] !== 31 && ($ = !1), A[1] !== 139 && ($ = !1), $;
  }, q = (A) => A[1] === 0 && A[2] === 0 && A[3] === 0;
  async function c(A, $, x = {}) {
    if (!(A instanceof Buffer)) throw new Error("Invalid argument: `data` must be a Buffer object");
    p(A) && (A = await new Promise((V, C) => {
      t.gunzip(A, (z, y) => {
        z ? C(z) : V(y);
      });
    })), m[$].setVariable("noArraySizeCheck", x.noArraySizeCheck);
    const M = m[$].parsePacketBuffer("nbt", A, A.startOffset);
    return M.metadata.buffer = A, M.type = $, M;
  }
  async function v(A, $, x) {
    if (A instanceof ArrayBuffer)
      A = Buffer.from(A);
    else if (!(A instanceof Buffer))
      throw new Error("Invalid argument: `data` must be a Buffer or ArrayBuffer object");
    let M = null;
    if (typeof $ == "function")
      x = $;
    else if ($ === !0 || $ === "little")
      M = "little";
    else if ($ === "big")
      M = "big";
    else if ($ === "littleVarint")
      M = "littleVarint";
    else if ($)
      throw new Error("Unrecognized format: " + $);
    if (A.startOffset = A.startOffset || 0, !M && !A.startOffset && q(A) && (A.startOffset += 8, M = "little"), M)
      try {
        const z = await c(A, M);
        return x && x(null, z.data, z.type, z.metadata), { parsed: z.data, type: z.type, metadata: z.metadata };
      } catch (z) {
        if (x) return x(z);
        throw z;
      }
    const V = ({ buffer: z, size: y }) => {
      const D = y, ie = z.length - z.startOffset, we = z[D + z.startOffset] === 10;
      if (D < ie && !we)
        throw new Error(`Unexpected EOF at ${D}: still have ${ie - D} bytes to read !`);
    };
    let C = null;
    try {
      C = await c(A, "big"), V(C.metadata);
    } catch (z) {
      try {
        C = await c(A, "little"), V(C.metadata);
      } catch {
        try {
          C = await c(A, "littleVarint"), V(C.metadata);
        } catch {
          if (x) return x(z);
          throw z;
        }
      }
    }
    return x && x(null, C.data, C.type, C.metadata), { parsed: C.data, type: C.type, metadata: C.metadata };
  }
  function P(A) {
    function $(x, M) {
      return M === "compound" ? Object.keys(x).reduce(function(V, C) {
        return V[C] = P(x[C]), V;
      }, {}) : M === "list" ? x.value.map(function(V) {
        return $(V, x.type);
      }) : x;
    }
    return $(A.value, A.type);
  }
  function E(A, $) {
    if (A.type !== $.type) return !1;
    if (A.type === "compound") {
      const x = Object.keys(A.value), M = Object.keys($.value);
      if (x.length !== M.length) return !1;
      for (const V of x)
        if (!E(A.value[V], $.value[V])) return !1;
      return !0;
    }
    if (A.type === "list") {
      if (A.value.length !== $.value.length) return !1;
      for (let x = 0; x < A.value.length; x++)
        if (!E(A.value[x], $.value[x])) return !1;
      return !0;
    }
    if (A.type === "byteArray" || A.type === "intArray" || A.type === "shortArray") {
      if (A.value.length !== $.value.length) return !1;
      for (let x = 0; x < A.value.length; x++)
        if (A.value[x] !== $.value[x]) return !1;
      return !0;
    }
    if (A.type === "long")
      return A.value[0] === $.value[0] && A.value[1] === $.value[1];
    if (A.type === "longArray") {
      if (A.value.length !== $.value.length) return !1;
      for (let x = 0; x < A.value.length; x++)
        if (A.value[x][0] !== $.value[x][0] || A.value[x][1] !== $.value[x][1]) return !1;
      return !0;
    }
    return A.value === $.value;
  }
  const I = {
    bool(A = !1) {
      return { type: "bool", value: A };
    },
    short(A) {
      return { type: "short", value: A };
    },
    byte(A) {
      return { type: "byte", value: A };
    },
    string(A) {
      return { type: "string", value: A };
    },
    comp(A, $ = "") {
      return { type: "compound", name: $, value: A };
    },
    int(A) {
      return { type: "int", value: A };
    },
    float(A) {
      return { type: "float", value: A };
    },
    double(A) {
      return { type: "double", value: A };
    },
    long(A) {
      return { type: "long", value: A };
    },
    list(A) {
      return { type: "list", value: { type: (A == null ? void 0 : A.type) ?? "end", value: (A == null ? void 0 : A.value) ?? [] } };
    },
    byteArray(A = []) {
      return { type: "byteArray", value: A };
    },
    shortArray(A = []) {
      return { type: "shortArray", value: A };
    },
    intArray(A = []) {
      return { type: "intArray", value: A };
    },
    longArray(A = []) {
      return { type: "longArray", value: A };
    }
  };
  return nbt$1 = {
    addTypesToCompiler: a,
    addTypesToInterpreter: f,
    writeUncompressed: w,
    parseUncompressed: R,
    simplify: P,
    hasBedrockLevelHeader: q,
    parse: v,
    parseAs: c,
    equal: E,
    proto: h,
    protoLE: g,
    protos: m,
    TagType: requireTagType(),
    ...I
  }, nbt$1;
}
var nbtExports = requireNbt();
const nbt = /* @__PURE__ */ getDefaultExportFromCjs$1(nbtExports), DEFAULT_PALETTE = {
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
}, FALLBACK_COLOR = [128, 128, 128];
function lookupColor(t) {
  return DEFAULT_PALETTE[t] ?? FALLBACK_COLOR;
}
function buildPalette(t) {
  const e = {};
  for (const n of t)
    e[n] = lookupColor(n);
  return e;
}
async function parseNBT(t) {
  const { parsed: e } = await nbt.parse(new Uint8Array(t));
  return nbt.simplify(e);
}
const LEGACY_BLOCK_MAP = {
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
function parseSchematicLegacy(t) {
  const e = t.Width ?? 0, n = t.Height ?? 0, s = t.Length ?? 0, r = t.Blocks ?? [], a = [];
  let f = 0;
  for (let h = 0; h < n; h++)
    for (let g = 0; g < s; g++)
      for (let l = 0; l < e && !(f >= r.length); l++) {
        const m = r[f++];
        if (m === 0) continue;
        const w = LEGACY_BLOCK_MAP[m] ?? `minecraft:unknown_${m}`;
        a.push([l, h, g, w]);
      }
  const u = new Set(a.map((h) => h[3]));
  return { blocks: a, palette: buildPalette(u) };
}
function readVarint(t, e) {
  let n = 0, s = 0, r = e;
  for (; r < t.length; ) {
    const a = t[r];
    if (n |= (a & 127) << s, r++, (a & 128) === 0) break;
    s += 7;
  }
  return [n, r - e];
}
function parseSponge(t) {
  var m, w;
  let e = t;
  e.Schematic && (e = e.Schematic);
  const n = e.Width ?? 0, s = e.Height ?? 0, r = e.Length ?? 0;
  let a, f;
  (m = e.Blocks) != null && m.Palette && ((w = e.Blocks) != null && w.Data) ? (a = e.Blocks.Palette, f = e.Blocks.Data) : (a = e.Palette ?? {}, f = e.BlockData ?? []);
  const u = /* @__PURE__ */ new Map();
  for (const [R, p] of Object.entries(a)) {
    const c = (R.startsWith("minecraft:") ? R : `minecraft:${R}`).split("[")[0];
    u.set(Number(p), c);
  }
  const h = [];
  let g = 0;
  for (let R = 0; R < s; R++)
    for (let p = 0; p < r; p++)
      for (let q = 0; q < n && !(g >= f.length); q++) {
        const [c, v] = readVarint(f, g);
        g += v;
        const P = u.get(c) ?? `minecraft:unknown_${c}`;
        P !== "minecraft:air" && h.push([q, R, p, P]);
      }
  const l = new Set(h.map((R) => R[3]));
  return { blocks: h, palette: buildPalette(l) };
}
function parseLitematic(t) {
  var r, a, f, u, h, g;
  const e = t.Regions ?? {}, n = [];
  for (const l of Object.values(e)) {
    const m = l.BlockStatePalette ?? [];
    if (m.length === 0) continue;
    const w = Math.abs(((r = l.Size) == null ? void 0 : r.x) ?? 0), R = Math.abs(((a = l.Size) == null ? void 0 : a.y) ?? 0), p = Math.abs(((f = l.Size) == null ? void 0 : f.z) ?? 0);
    if (w * R * p === 0) continue;
    const c = ((u = l.Position) == null ? void 0 : u.x) ?? 0, v = ((h = l.Position) == null ? void 0 : h.y) ?? 0, P = ((g = l.Position) == null ? void 0 : g.z) ?? 0, E = Math.max(2, Math.ceil(Math.log2(m.length))), I = (1 << E) - 1, A = l.BlockStates ?? [];
    if (A.length === 0) continue;
    const $ = A.map((M) => BigInt(M));
    let x = 0;
    for (let M = 0; M < R; M++)
      for (let V = 0; V < p; V++)
        for (let C = 0; C < w; C++) {
          const z = Math.floor(x / 64), y = x % 64;
          if (x += E, z >= $.length) continue;
          let D;
          if (y + E <= 64)
            D = Number($[z] >> BigInt(y) & BigInt(I));
          else {
            const we = 64 - y, be = Number($[z] >> BigInt(y) & BigInt((1 << we) - 1)), ce = z + 1 < $.length ? Number($[z + 1] & BigInt((1 << E - we) - 1)) : 0;
            D = be | ce << we;
          }
          if (D >= m.length) continue;
          const ie = m[D], de = (ie == null ? void 0 : ie.Name) ?? ie ?? "minecraft:air";
          de !== "minecraft:air" && n.push([C + c, M + v, V + P, de]);
        }
  }
  const s = new Set(n.map((l) => l[3]));
  return { blocks: n, palette: buildPalette(s) };
}
function parseFromNBT(t) {
  var n;
  if (t.Regions)
    return parseLitematic(t);
  let e = t;
  if (e.Schematic && (e = e.Schematic), (n = e.Blocks) != null && n.Palette || e.Palette)
    return parseSponge(t);
  if (e.Blocks && typeof e.Width == "number")
    return parseSchematicLegacy(t);
  throw new Error("Unrecognized NBT schematic format");
}
const SUPPORTED_EXTENSIONS = [".schematic", ".schem", ".litematic", ".json"];
async function parseFile(t) {
  var n;
  const e = "." + (((n = t.name.split(".").pop()) == null ? void 0 : n.toLowerCase()) ?? "");
  if (e === ".json") {
    const s = await t.text(), r = JSON.parse(s);
    if (r.blocks && r.palette) return r;
    throw new Error("JSON file must contain 'blocks' and 'palette' keys");
  }
  if (e === ".schematic" || e === ".schem" || e === ".litematic") {
    const s = await t.arrayBuffer(), r = await parseNBT(s);
    return parseFromNBT(r);
  }
  throw new Error(`Unsupported file format: ${e}. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`);
}
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
.csv-gi-btn { width:20px; height:20px; border-radius:3px; background:none; border:1px solid transparent; color:#555; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .12s; }
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
function injectStyles() {
  if (document.getElementById("csv-styles")) return;
  const t = document.createElement("style");
  t.id = "csv-styles", t.textContent = CSS, document.head.appendChild(t);
}
function createViewerDOM(t, e) {
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "csv-root";
  const s = document.createElement("div");
  s.className = "csv-canvas-wrap", n.appendChild(s);
  let r = null;
  e.gallery && (r = document.createElement("div"), r.className = "csv-gallery", n.appendChild(r));
  let a = null;
  e.infoBar && (a = document.createElement("div"), a.className = "csv-info", n.appendChild(a));
  const f = document.createElement("div");
  f.className = "csv-tooltip", document.body.appendChild(f);
  let u = null;
  e.dragDrop && (u = document.createElement("div"), u.className = "csv-drop-overlay", u.innerHTML = "<span>Drop to add schematics</span>", n.appendChild(u));
  const h = document.createElement("div");
  h.className = "csv-add-bar";
  const g = document.createElement("label");
  g.className = "csv-add-btn", g.textContent = "+ Add";
  const l = document.createElement("input");
  l.type = "file", l.multiple = !0, l.accept = ".litematic,.schematic,.schem,.json", l.className = "csv-add-input", g.appendChild(l), h.appendChild(g);
  const m = document.createElement("button");
  return m.className = "csv-add-btn", m.textContent = "Clear", h.appendChild(m), n.appendChild(h), t.appendChild(n), { root: n, canvasWrap: s, galleryEl: r, infoEl: a, tooltip: f, dropOverlay: u, addInput: l, clearBtn: m };
}
function renderGallery(t, e, n, s) {
  t.innerHTML = "";
  for (const r of e) {
    const a = document.createElement("div");
    a.className = "csv-gallery-item" + (r.visible ? "" : " hidden-item"), a.innerHTML = `
      <div class="csv-gi-color" style="background:${r.color}"></div>
      <div class="csv-gi-info">
        <div class="csv-gi-name" title="${r.name}">${r.name}</div>
        <div class="csv-gi-meta">${r.blockCount.toLocaleString()} blocks · ${r.typeCount} types</div>
      </div>
      <div class="csv-gi-actions">
        <button class="csv-gi-btn vis ${r.visible ? "" : "off"}" data-id="${r.id}" title="Toggle visibility">${r.visible ? "●" : "○"}</button>
        <button class="csv-gi-btn del" data-id="${r.id}" title="Remove">×</button>
      </div>
    `, t.appendChild(a);
  }
  t.querySelectorAll(".vis").forEach((r) => {
    r.addEventListener("click", () => n(r.dataset.id));
  }), t.querySelectorAll(".del").forEach((r) => {
    r.addEventListener("click", () => s(r.dataset.id));
  });
}
function updateInfoBar(t, e) {
  const n = e.filter((a) => a.visible), s = n.reduce((a, f) => a + f.blockCount, 0), r = new Set(n.flatMap((a) => Object.keys(a.data.palette)));
  if (e.length === 0) {
    t.classList.remove("visible");
    return;
  }
  t.textContent = `${e.length} schematic${e.length > 1 ? "s" : ""} · ${s.toLocaleString()} blocks · ${r.size} types`, t.classList.add("visible");
}
function showTooltip(t, e, n, s) {
  const r = e.blockId.replace("minecraft:", "");
  t.innerHTML = `
    <div class="bt-name">${r}</div>
    <div class="bt-row">
      <div class="bt-swatch" style="background:rgb(${e.color.join(",")})"></div>
      <span class="bt-pos">${e.position.join(", ")}</span>
    </div>
    <div class="bt-schem">${e.schematicName}</div>
  `, t.style.left = n + "px", t.style.top = s + "px", t.classList.add("visible");
}
function hideTooltip(t) {
  t.classList.remove("visible");
}
class SchemaViewer extends EventEmitter {
  constructor(e) {
    super(), this.entries = /* @__PURE__ */ new Map(), this.colorIdx = 0, this.config = {
      container: e.container,
      background: e.background ?? "#090b0c",
      gallery: e.gallery ?? !0,
      controls: e.controls ?? !0,
      tooltip: e.tooltip ?? !0,
      infoBar: e.infoBar ?? !0,
      dragDrop: e.dragDrop ?? !0,
      fov: e.fov ?? 60,
      maxPixelRatio: e.maxPixelRatio ?? 2
    }, injectStyles(), this.dom = createViewerDOM(this.config.container, {
      gallery: this.config.gallery,
      controls: this.config.controls,
      infoBar: this.config.infoBar,
      dragDrop: this.config.dragDrop
    }), this.scene = new SceneManager({
      container: this.dom.canvasWrap,
      background: this.config.background,
      fov: this.config.fov,
      maxPixelRatio: this.config.maxPixelRatio,
      onBlockHover: this.config.tooltip ? (n, s, r) => {
        n ? (showTooltip(this.dom.tooltip, n, s, r), this.emit("block:hover", n)) : (hideTooltip(this.dom.tooltip), this.emit("block:hover", null));
      } : void 0
    }), this.setupDragDrop(), this.setupAddButton(), this.emit("ready");
  }
  /** Load a schematic into the viewer. */
  addSchematic(e, n, s) {
    const r = s ?? crypto.randomUUID().slice(0, 8), a = GALLERY_COLORS[this.colorIdx % GALLERY_COLORS.length];
    this.colorIdx++;
    const f = {
      id: r,
      name: e,
      data: n,
      visible: !0,
      color: a,
      blockCount: n.blocks.length,
      typeCount: Object.keys(n.palette).length
    };
    return this.entries.set(r, f), this.scene.addSchematic(r, e, n), this.refresh(), this.emit("schematic:add", f), f;
  }
  /** Remove a schematic from the viewer. */
  removeSchematic(e) {
    this.entries.has(e) && (this.entries.delete(e), this.scene.removeSchematic(e), this.refresh(), this.emit("schematic:remove", e));
  }
  /** Toggle visibility of a schematic. */
  toggleSchematic(e) {
    const n = this.entries.get(e);
    n && (n.visible = !n.visible, this.scene.setSchematicVisible(e, n.visible), this.refresh(), this.emit("schematic:toggle", e, n.visible));
  }
  /** Set visibility of a specific schematic. */
  setSchematicVisible(e, n) {
    const s = this.entries.get(e);
    !s || s.visible === n || (s.visible = n, this.scene.setSchematicVisible(e, n), this.refresh(), this.emit("schematic:toggle", e, n));
  }
  /** Remove all loaded schematics. */
  clear() {
    for (const e of [...this.entries.keys()])
      this.removeSchematic(e);
    this.colorIdx = 0;
  }
  /** Get all loaded schematic entries. */
  getSchematics() {
    return [...this.entries.values()];
  }
  /** Get a schematic entry by ID. */
  getSchematic(e) {
    return this.entries.get(e);
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
  async loadFromURL(e, n) {
    var f;
    const s = await fetch(n);
    if (!s.ok) throw new Error(`Failed to fetch ${n}: ${s.status}`);
    const r = (f = n.split(/[?#]/)[0].split(".").pop()) == null ? void 0 : f.toLowerCase();
    if (r && r !== "json" && SUPPORTED_EXTENSIONS.includes(`.${r}`)) {
      const u = await s.blob(), h = new File([u], `${e}.${r}`);
      return this.loadFromFile(h);
    }
    const a = await s.json();
    return this.addSchematic(e, a);
  }
  /**
   * Load a schematic from a File object.
   * Supports .schematic, .schem, .litematic (parsed client-side via NBT)
   * and .json (blocks.json format).
   */
  async loadFromFile(e) {
    const n = await parseFile(e), s = e.name.replace(/\.[^.]+$/, "");
    return this.addSchematic(s, n);
  }
  refresh() {
    const e = this.getSchematics();
    this.dom.galleryEl && renderGallery(
      this.dom.galleryEl,
      e,
      (n) => this.toggleSchematic(n),
      (n) => this.removeSchematic(n)
    ), this.dom.infoEl && updateInfoBar(this.dom.infoEl, e);
  }
  setupDragDrop() {
    if (!this.config.dragDrop || !this.dom.dropOverlay) return;
    const e = this.dom.dropOverlay;
    let n = 0;
    this.dom.root.addEventListener("dragenter", (s) => {
      s.preventDefault(), n++, e.classList.add("visible");
    }), this.dom.root.addEventListener("dragleave", () => {
      n--, n <= 0 && (n = 0, e.classList.remove("visible"));
    }), this.dom.root.addEventListener("dragover", (s) => s.preventDefault()), this.dom.root.addEventListener("drop", async (s) => {
      var a;
      s.preventDefault(), n = 0, e.classList.remove("visible");
      const r = (a = s.dataTransfer) == null ? void 0 : a.files;
      if (r)
        for (const f of Array.from(r))
          try {
            await this.loadFromFile(f);
          } catch (u) {
            console.error(`Failed to load ${f.name}:`, u);
          }
    });
  }
  setupAddButton() {
    this.dom.addInput.addEventListener("change", async () => {
      const e = this.dom.addInput.files;
      if (e)
        for (const n of Array.from(e))
          try {
            await this.loadFromFile(n);
          } catch (s) {
            console.error(`Failed to load ${n.name}:`, s);
          }
      this.dom.addInput.value = "";
    }), this.dom.clearBtn.addEventListener("click", () => this.clear());
  }
}
export {
  SUPPORTED_EXTENSIONS,
  SchemaViewer,
  parseFile
};
