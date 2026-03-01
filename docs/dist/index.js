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
    var o;
    (o = this.listeners.get(e)) == null || o.delete(n);
  }
  emit(e, ...n) {
    var o;
    (o = this.listeners.get(e)) == null || o.forEach((r) => r(...n));
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
    let o = this.minAzimuthAngle, r = this.maxAzimuthAngle;
    isFinite(o) && isFinite(r) && (o < -Math.PI ? o += _twoPI : o > Math.PI && (o -= _twoPI), r < -Math.PI ? r += _twoPI : r > Math.PI && (r -= _twoPI), o <= r ? this._spherical.theta = Math.max(o, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (o + r) / 2 ? Math.max(o, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
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
        const l = _v.length();
        f = this._clampDistance(l * this._scale);
        const c = l - f;
        this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), a = !!c;
      } else if (this.object.isOrthographicCamera) {
        const l = new Vector3(this._mouse.x, this._mouse.y, 0);
        l.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), a = c !== this.object.zoom;
        const y = new Vector3(this._mouse.x, this._mouse.y, 0);
        y.unproject(this.object), this.object.position.sub(y).add(l), this.object.updateMatrixWorld(), f = _v.length();
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
    const o = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const r = this.object.position;
      _v.copy(r).sub(this.target);
      let a = _v.length();
      a *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * a / o.clientHeight, this.object.matrix), this._panUp(2 * n * a / o.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / o.clientWidth, this.object.matrix), this._panUp(n * (this.object.top - this.object.bottom) / this.object.zoom / o.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
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
    const o = this.domElement.getBoundingClientRect(), r = e - o.left, a = n - o.top, f = o.width, l = o.height;
    this._mouse.x = r / f * 2 - 1, this._mouse.y = -(a / l) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
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
      const n = this._getSecondPointerPosition(e), o = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._rotateStart.set(o, r);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1)
      this._panStart.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), o = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panStart.set(o, r);
    }
  }
  _handleTouchStartDolly(e) {
    const n = this._getSecondPointerPosition(e), o = e.pageX - n.x, r = e.pageY - n.y, a = Math.sqrt(o * o + r * r);
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
      const o = this._getSecondPointerPosition(e), r = 0.5 * (e.pageX + o.x), a = 0.5 * (e.pageY + o.y);
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
      const n = this._getSecondPointerPosition(e), o = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panEnd.set(o, r);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const n = this._getSecondPointerPosition(e), o = e.pageX - n.x, r = e.pageY - n.y, a = Math.sqrt(o * o + r * r);
    this._dollyEnd.set(0, a), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const f = (e.pageX + n.x) * 0.5, l = (e.pageY + n.y) * 0.5;
    this._updateZoomParameters(f, l);
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
    const n = e.deltaMode, o = {
      clientX: e.clientX,
      clientY: e.clientY,
      deltaY: e.deltaY
    };
    switch (n) {
      case 1:
        o.deltaY *= 16;
        break;
      case 2:
        o.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (o.deltaY *= 10), o;
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
], DEFAULT_BACKGROUND = "#090b0c", DEFAULT_FOV = 60, DEFAULT_MAX_PIXEL_RATIO = 2, MOVE_SPEED = 40, ROTATE_SPEED = 1.5, TEX_SIZE = 16;
function clamp(t) {
  return Math.max(0, Math.min(255, Math.round(t)));
}
function vary(t, e, n) {
  const o = (n() - 0.5) * 2 * e;
  return [clamp(t[0] + o), clamp(t[1] + o), clamp(t[2] + o)];
}
function varyChannel(t, e, n) {
  return [
    clamp(t[0] + (n() - 0.5) * 2 * e),
    clamp(t[1] + (n() - 0.5) * 2 * e),
    clamp(t[2] + (n() - 0.5) * 2 * e)
  ];
}
function darken(t, e) {
  return [clamp(t[0] * e), clamp(t[1] * e), clamp(t[2] * e)];
}
function lighten(t, e) {
  return [
    clamp(t[0] + (255 - t[0]) * e),
    clamp(t[1] + (255 - t[1]) * e),
    clamp(t[2] + (255 - t[2]) * e)
  ];
}
function seededRng(t) {
  let e = t;
  return () => (e = e * 1664525 + 1013904223 & 4294967295, (e >>> 0) / 4294967295);
}
function setPixel(t, e, n, o) {
  const r = (n * TEX_SIZE + e) * 4;
  t[r] = o[0], t[r + 1] = o[1], t[r + 2] = o[2], t[r + 3] = 255;
}
function fillAll(t, e, n, o) {
  for (let r = 0; r < TEX_SIZE; r++)
    for (let a = 0; a < TEX_SIZE; a++)
      setPixel(t, a, r, vary(e, n, o));
}
const patternStone = (t, e, n) => {
  fillAll(t, e, 12, n);
  for (let o = 0; o < 20; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, darken(e, 0.8 + n() * 0.15));
  }
}, patternPlanks = (t, e, n) => {
  for (let r = 0; r < TEX_SIZE; r++) {
    const a = Math.floor(r / 4), f = vary(e, 8, seededRng(a * 137)), l = r % 4 === 0;
    for (let c = 0; c < TEX_SIZE; c++)
      l ? setPixel(t, c, r, darken(f, 0.7)) : setPixel(t, c, r, varyChannel(f, 6, n));
  }
}, patternLog = (t, e, n) => {
  const o = darken(e, 0.75);
  for (let r = 0; r < TEX_SIZE; r++)
    for (let a = 0; a < TEX_SIZE; a++) {
      const l = r % 4 === 0 || r % 4 === 1 ? vary(o, 6, n) : vary(e, 8, n);
      setPixel(t, a, r, l);
    }
}, patternBricks = (t, e, n) => {
  const o = [150, 140, 135];
  for (let r = 0; r < TEX_SIZE; r++) {
    const a = Math.floor(r / 4), f = r % 4 === 0, l = a % 2 === 0 ? 0 : 8;
    for (let c = 0; c < TEX_SIZE; c++) {
      const y = (c + l) % 8 === 0;
      f || y ? setPixel(t, c, r, vary(o, 5, n)) : setPixel(t, c, r, varyChannel(e, 8, n));
    }
  }
}, patternStoneBricks = (t, e, n) => {
  const o = darken(e, 0.65);
  for (let r = 0; r < TEX_SIZE; r++) {
    const a = Math.floor(r / 4), f = r % 4 === 0, l = a % 2 === 0 ? 0 : 8;
    for (let c = 0; c < TEX_SIZE; c++) {
      const y = (c + l) % 8 === 0;
      f || y ? setPixel(t, c, r, vary(o, 4, n)) : setPixel(t, c, r, vary(e, 8, n));
    }
  }
}, patternWool = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const a = (r + o) % 2 === 0 ? 4 : -4, f = [
        clamp(e[0] + a + (n() - 0.5) * 6),
        clamp(e[1] + a + (n() - 0.5) * 6),
        clamp(e[2] + a + (n() - 0.5) * 6)
      ];
      setPixel(t, r, o, f);
    }
}, patternConcrete = (t, e, n) => {
  fillAll(t, e, 3, n);
}, patternTerracotta = (t, e, n) => {
  fillAll(t, e, 6, n);
  for (let o = 0; o < 8; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, lighten(e, 0.1));
  }
}, patternGlass = (t, e, n) => {
  const o = darken(e, 0.7);
  for (let r = 0; r < TEX_SIZE; r++)
    for (let a = 0; a < TEX_SIZE; a++)
      a === 0 || r === 0 || a === 15 || r === 15 ? setPixel(t, a, r, o) : a === 1 || r === 1 ? setPixel(t, a, r, lighten(e, 0.3)) : setPixel(t, a, r, vary(e, 3, n));
}, patternOre = (t, e, n) => {
  fillAll(t, [125, 125, 125], 10, n);
  const r = e;
  for (let a = 0; a < 6; a++) {
    const f = 3 + Math.floor(n() * 10), l = 3 + Math.floor(n() * 10);
    for (let c = -1; c <= 1; c++)
      for (let y = -1; y <= 1; y++)
        if (n() > 0.4) {
          const u = (f + y + TEX_SIZE) % TEX_SIZE, m = (l + c + TEX_SIZE) % TEX_SIZE;
          setPixel(t, u, m, vary(r, 10, n));
        }
  }
}, patternDirt = (t, e, n) => {
  fillAll(t, e, 14, n);
  for (let o = 0; o < 12; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, darken(e, 0.8));
  }
}, patternGrass = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++) {
    const r = o / TEX_SIZE, a = [134, 96, 67], f = [
      clamp(e[0] * (1 - r * 0.6) + a[0] * r * 0.6),
      clamp(e[1] * (1 - r * 0.6) + a[1] * r * 0.6),
      clamp(e[2] * (1 - r * 0.6) + a[2] * r * 0.6)
    ];
    for (let l = 0; l < TEX_SIZE; l++)
      setPixel(t, l, o, varyChannel(f, 10, n));
  }
}, patternSand = (t, e, n) => {
  fillAll(t, e, 8, n);
  for (let o = 0; o < 10; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, darken(e, 0.9));
  }
}, patternSandstone = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++) {
    const r = o < 4 ? lighten(e, 0.08) : o < 12 ? e : darken(e, 0.9);
    for (let a = 0; a < TEX_SIZE; a++)
      setPixel(t, a, o, vary(r, 5, n));
  }
}, patternLeaves = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++)
      n() < 0.25 ? setPixel(t, r, o, darken(e, 0.6 + n() * 0.2)) : setPixel(t, r, o, varyChannel(e, 14, n));
}, patternMetal = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++) {
    const r = o % 4 < 2 ? lighten(e, 0.06) : darken(e, 0.95);
    for (let a = 0; a < TEX_SIZE; a++)
      setPixel(t, a, o, vary(r, 4, n));
  }
}, patternSnow = (t, e, n) => {
  fillAll(t, e, 4, n);
}, patternObsidian = (t, e, n) => {
  fillAll(t, e, 6, n);
  for (let o = 0; o < 10; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, [clamp(e[0] + 20 + n() * 20), clamp(e[1] + 5), clamp(e[2] + 30 + n() * 15)]);
  }
}, patternNether = (t, e, n) => {
  fillAll(t, e, 10, n);
  for (let o = 0; o < 15; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, lighten(e, 0.15 + n() * 0.1));
  }
}, patternBookshelf = (t, e, n) => {
  const o = e, r = [
    [160, 50, 40],
    [50, 80, 50],
    [40, 50, 120],
    [130, 100, 30],
    [100, 40, 100],
    [60, 100, 100],
    [150, 80, 50],
    [80, 60, 110]
  ];
  for (let a = 0; a < TEX_SIZE; a++) {
    const f = a === 0 || a === 5 || a === 10 || a === 15;
    for (let l = 0; l < TEX_SIZE; l++)
      if (f)
        setPixel(t, l, a, vary(o, 6, n));
      else {
        const c = Math.floor(a / 5), y = (l * 3 + c) % r.length;
        setPixel(t, l, a, vary(r[y], 10, n));
      }
  }
}, patternPrismarine = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const a = n() < 0.3 ? [0, 15, 10] : n() < 0.5 ? [0, -10, -5] : [0, 0, 0], f = [
        clamp(e[0] + a[0] + (n() - 0.5) * 10),
        clamp(e[1] + a[1] + (n() - 0.5) * 10),
        clamp(e[2] + a[2] + (n() - 0.5) * 10)
      ];
      setPixel(t, r, o, f);
    }
}, patternCobblestone = (t, e, n) => {
  fillAll(t, e, 8, n);
  for (let o = 0; o < 5; o++) {
    const r = 2 + Math.floor(n() * 12), a = 2 + Math.floor(n() * 12), f = 1 + Math.floor(n() * 2), l = n() > 0.5 ? darken(e, 0.82) : lighten(e, 0.08);
    for (let c = -f; c <= f; c++)
      for (let y = -f; y <= f; y++)
        if (y * y + c * c <= f * f + 1) {
          const u = (r + y + TEX_SIZE) % TEX_SIZE, m = (a + c + TEX_SIZE) % TEX_SIZE;
          setPixel(t, u, m, vary(l, 4, n));
        }
  }
}, patternQuartz = (t, e, n) => {
  fillAll(t, e, 3, n);
  for (let o = 0; o < 6; o++) {
    const r = Math.floor(n() * TEX_SIZE), a = Math.floor(n() * TEX_SIZE);
    setPixel(t, r, a, darken(e, 0.92));
  }
}, patternDeepslate = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const f = (r + o * 2) % 6 < 2 ? darken(e, 0.88) : vary(e, 6, n);
      setPixel(t, r, o, f);
    }
}, patternWater = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const a = Math.sin((r + o * 0.5) * 0.8) * 12, f = [
        clamp(e[0] + a + (n() - 0.5) * 8),
        clamp(e[1] + a + (n() - 0.5) * 8),
        clamp(e[2] + a * 0.5 + (n() - 0.5) * 6)
      ];
      setPixel(t, r, o, f);
    }
}, patternLava = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const a = Math.sin(r * 0.6) * Math.cos(o * 0.4) * 25, f = [
        clamp(e[0] + a + (n() - 0.5) * 15),
        clamp(e[1] + a * 0.6 + (n() - 0.5) * 15),
        clamp(e[2] + (n() - 0.5) * 8)
      ];
      setPixel(t, r, o, f);
    }
}, patternGlowstone = (t, e, n) => {
  for (let o = 0; o < TEX_SIZE; o++)
    for (let r = 0; r < TEX_SIZE; r++) {
      const f = n() < 0.2 ? lighten(e, 0.3 + n() * 0.2) : vary(e, 12, n);
      setPixel(t, r, o, f);
    }
}, patternDefault = (t, e, n) => {
  fillAll(t, e, 8, n);
};
function matchPattern(t) {
  const e = t.replace("minecraft:", "");
  return e.includes("planks") ? patternPlanks : e.includes("_log") || e.includes("_wood") ? patternLog : e.includes("stone_brick") || e.includes("deepslate_brick") || e.includes("deepslate_tile") || e.includes("nether_brick") || e.includes("end_stone_brick") || e.includes("mud_brick") ? patternStoneBricks : e === "bricks" || e.includes("brick") ? patternBricks : e.includes("cobblestone") || e === "gravel" ? patternCobblestone : e.includes("wool") ? patternWool : e.includes("concrete_powder") ? patternSand : e.includes("concrete") ? patternConcrete : e.includes("terracotta") ? patternTerracotta : e.includes("glass") ? patternGlass : e.includes("ore") ? patternOre : e.includes("leaves") ? patternLeaves : e.includes("sandstone") ? patternSandstone : e === "minecraft:sand" || e === "sand" ? patternSand : e.includes("dirt") || e === "clay" || e.includes("mud") || e.includes("packed_mud") ? patternDirt : e.includes("grass_block") ? patternGrass : e.includes("snow") ? patternSnow : e === "obsidian" || e.includes("obsidian") ? patternObsidian : e.includes("nether") || e.includes("soul") ? patternNether : e.includes("iron") || e.includes("gold") || e.includes("copper") || e.includes("diamond") || e.includes("emerald") || e.includes("lapis") ? patternMetal : e.includes("quartz") || e.includes("calcite") || e.includes("bone") ? patternQuartz : e.includes("deepslate") || e.includes("blackstone") ? patternDeepslate : e.includes("prismarine") ? patternPrismarine : e === "bookshelf" ? patternBookshelf : e === "water" ? patternWater : e === "lava" ? patternLava : e.includes("glowstone") || e.includes("sea_lantern") || e.includes("shroomlight") ? patternGlowstone : e.includes("purpur") ? patternStoneBricks : e.includes("stone") || e.includes("andesite") || e.includes("diorite") || e.includes("granite") || e.includes("tuff") || e.includes("bedrock") ? patternStone : patternDefault;
}
const textureCache = /* @__PURE__ */ new Map();
function getBlockTexture(t, e) {
  const n = `${t}_${e[0]}_${e[1]}_${e[2]}`, o = textureCache.get(n);
  if (o) return o;
  const r = document.createElement("canvas");
  r.width = TEX_SIZE, r.height = TEX_SIZE;
  const a = r.getContext("2d"), f = a.createImageData(TEX_SIZE, TEX_SIZE);
  let l = 0;
  for (let m = 0; m < t.length; m++)
    l = (l << 5) - l + t.charCodeAt(m) | 0;
  const c = seededRng(Math.abs(l));
  matchPattern(t)(f.data, e, c), a.putImageData(f, 0, 0);
  const u = new THREE.CanvasTexture(r);
  return u.magFilter = THREE.NearestFilter, u.minFilter = THREE.NearestFilter, u.colorSpace = THREE.SRGBColorSpace, textureCache.set(n, u), u;
}
const Gr = class Gr {
  constructor(e) {
    this.animId = 0, this.groups = /* @__PURE__ */ new Map(), this.raycaster = new THREE.Raycaster(), this.mouse = new THREE.Vector2(), this.keys = {}, this.container = e.container, this.onBlockHover = e.onBlockHover;
    const n = e.background ?? DEFAULT_BACKGROUND, o = e.fov ?? DEFAULT_FOV, r = e.maxPixelRatio ?? DEFAULT_MAX_PIXEL_RATIO, a = this.container.clientWidth, f = this.container.clientHeight;
    this.scene = new THREE.Scene(), this.scene.background = new THREE.Color(n), this.camera = new THREE.PerspectiveCamera(o, a / f, 0.1, 5e3), this.renderer = new THREE.WebGLRenderer({ antialias: !0 }), this.renderer.setSize(a, f), this.renderer.setPixelRatio(Math.min(devicePixelRatio, r)), this.container.appendChild(this.renderer.domElement), this.controls = new OrbitControls(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.08, this.controls.rotateSpeed = 0.8, this.controls.minDistance = 1, this.controls.maxDistance = 5e3, this.scene.add(new THREE.AmbientLight(16777215, 0.5));
    const l = new THREE.DirectionalLight(16777215, 0.9);
    l.position.set(1, 2, 1.5), this.scene.add(l);
    const c = new THREE.DirectionalLight(16777215, 0.2);
    c.position.set(-1, 0.5, -1), this.scene.add(c), this.resizeObserver = new ResizeObserver(() => this.handleResize()), this.resizeObserver.observe(this.container), this.boundKeyDown = (y) => this.handleKeyDown(y), this.boundKeyUp = (y) => this.handleKeyUp(y), window.addEventListener("keydown", this.boundKeyDown), window.addEventListener("keyup", this.boundKeyUp), window.addEventListener("blur", () => {
      this.keys = {};
    }), this.onBlockHover && (this.renderer.domElement.addEventListener("mousemove", (y) => this.handleMouseMove(y)), this.renderer.domElement.addEventListener("mouseleave", () => {
      var y;
      return (y = this.onBlockHover) == null ? void 0 : y.call(this, null, 0, 0);
    })), this.startLoop();
  }
  addSchematic(e, n, o) {
    this.removeSchematic(e);
    const { group: r, lookup: a } = this.buildMesh(o);
    r.userData.sid = e, this.scene.add(r), this.groups.set(e, {
      group: r,
      lookup: a,
      palette: o.palette,
      schematicId: e,
      schematicName: n
    }), this.fitCamera();
  }
  removeSchematic(e) {
    const n = this.groups.get(e);
    n && (this.scene.remove(n.group), n.group.traverse((o) => {
      if (o.geometry && o.geometry.dispose(), o.material) {
        const r = o.material;
        Array.isArray(r) ? r.forEach((a) => a.dispose()) : r.dispose();
      }
    }), this.groups.delete(e), this.fitCamera());
  }
  setSchematicVisible(e, n) {
    const o = this.groups.get(e);
    o && (o.group.visible = n);
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
    const o = n.getCenter(new THREE.Vector3()), r = n.getSize(new THREE.Vector3()), a = Math.max(r.x, r.y, r.z);
    this.controls.target.copy(o), this.camera.position.set(o.x + a * 0.8, o.y + a * 0.5, o.z + a * 1.2), this.camera.lookAt(o), this.controls.update(), this.initPos = this.camera.position.clone(), this.initTarget = this.controls.target.clone(), this.grid && this.scene.remove(this.grid), this.grid = new THREE.GridHelper(a * 2, Math.floor(a * 2), 2236962, 1579032), this.grid.position.set(o.x, n.min.y - 0.5, o.z), this.scene.add(this.grid);
  }
  destroy() {
    cancelAnimationFrame(this.animId), this.resizeObserver.disconnect(), window.removeEventListener("keydown", this.boundKeyDown), window.removeEventListener("keyup", this.boundKeyUp);
    for (const [e] of this.groups) this.removeSchematic(e);
    this.renderer.dispose(), this.renderer.domElement.remove();
  }
  buildMesh(e) {
    const n = {};
    for (const [f, l, c, y] of e.blocks)
      n[y] || (n[y] = []), n[y].push(f, l, c);
    const o = new THREE.Group(), r = new THREE.BoxGeometry(1, 1, 1), a = /* @__PURE__ */ new Map();
    for (const [f, l] of Object.entries(n)) {
      const c = e.palette[f] ?? [128, 128, 128], y = getBlockTexture(f, c), u = new THREE.MeshLambertMaterial({ map: y }), m = l.length / 3, w = new THREE.InstancedMesh(r, u, m), R = new THREE.Object3D();
      for (let h = 0; h < m; h++) {
        const q = l[h * 3], d = l[h * 3 + 1], v = l[h * 3 + 2];
        R.position.set(q, d, v), R.updateMatrix(), w.setMatrixAt(h, R.matrix), a.set(`${w.uuid}_${h}`, { bid: f, x: q, y: d, z: v });
      }
      w.instanceMatrix.needsUpdate = !0, o.add(w);
    }
    return { group: o, lookup: a };
  }
  handleResize() {
    const e = this.container.clientWidth, n = this.container.clientHeight;
    !e || !n || (this.camera.aspect = e / n, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, n));
  }
  handleMouseMove(e) {
    var r, a, f;
    const n = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - n.left) / n.width * 2 - 1, this.mouse.y = -((e.clientY - n.top) / n.height) * 2 + 1, this.raycaster.setFromCamera(this.mouse, this.camera);
    const o = this.raycaster.intersectObjects(this.scene.children, !0);
    for (const l of o)
      if (l.object.isInstancedMesh && l.instanceId != null) {
        const c = l.object.parent, y = (r = c == null ? void 0 : c.userData) == null ? void 0 : r.sid, u = y ? this.groups.get(y) : void 0;
        if (!u) continue;
        const m = `${l.object.uuid}_${l.instanceId}`, w = u.lookup.get(m);
        if (w) {
          const R = u.palette[w.bid] ?? [128, 128, 128];
          (a = this.onBlockHover) == null || a.call(
            this,
            {
              blockId: w.bid,
              position: [w.x, w.y, w.z],
              color: R,
              schematicName: u.schematicName,
              schematicId: u.schematicId
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
    var n, o;
    const e = (n = document.activeElement) == null ? void 0 : n.tagName;
    return e === "INPUT" || e === "TEXTAREA" || ((o = document.activeElement) == null ? void 0 : o.isContentEditable) === !0;
  }
  handleKeyDown(e) {
    if (this.isTyping()) return;
    const n = e.key.toLowerCase();
    Gr.VIEWER_KEYS.has(n) && (this.keys[n] = !0, n === " " && e.preventDefault());
  }
  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = !1;
  }
  processKeys(e) {
    const n = MOVE_SPEED * e, o = ROTATE_SPEED * e, r = new THREE.Vector3();
    this.camera.getWorldDirection(r);
    const a = new THREE.Vector3(0, 1, 0), f = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0).normalize();
    let l = r.clone();
    l.y = 0, l.lengthSq() < 1e-3 && (l.set(-this.camera.matrixWorld.elements[8], 0, -this.camera.matrixWorld.elements[10]).normalize(), l.lengthSq() < 1e-3 && l.set(0, 0, -1)), l.normalize();
    const c = new THREE.Vector3().crossVectors(l, a).normalize(), y = this.keys;
    if (y.w && (this.controls.target.addScaledVector(l, n), this.camera.position.addScaledVector(l, n)), y.s && (this.controls.target.addScaledVector(l, -n), this.camera.position.addScaledVector(l, -n)), y.a && (this.controls.target.addScaledVector(c, -n), this.camera.position.addScaledVector(c, -n)), y.d && (this.controls.target.addScaledVector(c, n), this.camera.position.addScaledVector(c, n)), y.arrowup && (this.controls.target.addScaledVector(r, n), this.camera.position.addScaledVector(r, n)), y.arrowdown && (this.controls.target.addScaledVector(r, -n), this.camera.position.addScaledVector(r, -n)), y.arrowleft && (this.controls.target.addScaledVector(f, -n), this.camera.position.addScaledVector(f, -n)), y.arrowright && (this.controls.target.addScaledVector(f, n), this.camera.position.addScaledVector(f, n)), y[" "] && (this.camera.position.y += n, this.controls.target.y += n), y.q ? this.controls.autoRotateSpeed = -30 : y.e ? this.controls.autoRotateSpeed = 30 : this.controls.autoRotateSpeed = 0, this.controls.autoRotate = y.q || y.e || !1, y.r) {
      const w = this.camera.position.clone().sub(this.controls.target);
      w.applyAxisAngle(f, -o), this.camera.position.copy(this.controls.target).add(w);
    }
    if (y.f) {
      const w = this.camera.position.clone().sub(this.controls.target);
      w.applyAxisAngle(f, o), this.camera.position.copy(this.controls.target).add(w);
    }
    const u = this.camera.position.distanceTo(this.controls.target), m = {
      1: () => r.clone().negate(),
      2: () => r.clone(),
      3: () => f.clone().negate(),
      4: () => f.clone(),
      5: () => new THREE.Vector3(0, 1, 0),
      6: () => new THREE.Vector3(0, -1, 0)
    };
    for (const [w, R] of Object.entries(m))
      if (y[w]) {
        const h = this.controls.target.clone(), q = R().normalize();
        this.camera.position.copy(h).addScaledVector(q, u), this.camera.lookAt(h), this.controls.update(), y[w] = !1;
      }
    y[0] && this.initPos && this.initTarget && (this.camera.position.copy(this.initPos), this.controls.target.copy(this.initTarget), this.controls.update(), y[0] = !1);
  }
  startLoop() {
    let e = performance.now();
    const n = (o) => {
      this.animId = requestAnimationFrame(n), this.processKeys((o - e) / 1e3), e = o, this.controls.update(), this.renderer.render(this.scene, this.camera);
    };
    this.animId = requestAnimationFrame(n);
  }
};
Gr.VIEWER_KEYS = /* @__PURE__ */ new Set([
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
let SceneManager = Gr;
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
  var o = n === e ? 0 : 4 - n % 4;
  return [n, o];
}
function byteLength(t) {
  var e = getLens(t), n = e[0], o = e[1];
  return (n + o) * 3 / 4 - o;
}
function _byteLength(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function toByteArray(t) {
  var e, n = getLens(t), o = n[0], r = n[1], a = new Arr(_byteLength(t, o, r)), f = 0, l = r > 0 ? o - 4 : o, c;
  for (c = 0; c < l; c += 4)
    e = revLookup[t.charCodeAt(c)] << 18 | revLookup[t.charCodeAt(c + 1)] << 12 | revLookup[t.charCodeAt(c + 2)] << 6 | revLookup[t.charCodeAt(c + 3)], a[f++] = e >> 16 & 255, a[f++] = e >> 8 & 255, a[f++] = e & 255;
  return r === 2 && (e = revLookup[t.charCodeAt(c)] << 2 | revLookup[t.charCodeAt(c + 1)] >> 4, a[f++] = e & 255), r === 1 && (e = revLookup[t.charCodeAt(c)] << 10 | revLookup[t.charCodeAt(c + 1)] << 4 | revLookup[t.charCodeAt(c + 2)] >> 2, a[f++] = e >> 8 & 255, a[f++] = e & 255), a;
}
function tripletToBase64(t) {
  return lookup[t >> 18 & 63] + lookup[t >> 12 & 63] + lookup[t >> 6 & 63] + lookup[t & 63];
}
function encodeChunk(t, e, n) {
  for (var o, r = [], a = e; a < n; a += 3)
    o = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (t[a + 2] & 255), r.push(tripletToBase64(o));
  return r.join("");
}
function fromByteArray(t) {
  for (var e, n = t.length, o = n % 3, r = [], a = 16383, f = 0, l = n - o; f < l; f += a)
    r.push(encodeChunk(t, f, f + a > l ? l : f + a));
  return o === 1 ? (e = t[n - 1], r.push(
    lookup[e >> 2] + lookup[e << 4 & 63] + "=="
  )) : o === 2 && (e = (t[n - 2] << 8) + t[n - 1], r.push(
    lookup[e >> 10] + lookup[e >> 4 & 63] + lookup[e << 2 & 63] + "="
  )), r.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(t, e, n, o, r) {
  var a, f, l = r * 8 - o - 1, c = (1 << l) - 1, y = c >> 1, u = -7, m = n ? r - 1 : 0, w = n ? -1 : 1, R = t[e + m];
  for (m += w, a = R & (1 << -u) - 1, R >>= -u, u += l; u > 0; a = a * 256 + t[e + m], m += w, u -= 8)
    ;
  for (f = a & (1 << -u) - 1, a >>= -u, u += o; u > 0; f = f * 256 + t[e + m], m += w, u -= 8)
    ;
  if (a === 0)
    a = 1 - y;
  else {
    if (a === c)
      return f ? NaN : (R ? -1 : 1) * (1 / 0);
    f = f + Math.pow(2, o), a = a - y;
  }
  return (R ? -1 : 1) * f * Math.pow(2, a - o);
};
ieee754.write = function(t, e, n, o, r, a) {
  var f, l, c, y = a * 8 - r - 1, u = (1 << y) - 1, m = u >> 1, w = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, R = o ? 0 : a - 1, h = o ? 1 : -1, q = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (l = isNaN(e) ? 1 : 0, f = u) : (f = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -f)) < 1 && (f--, c *= 2), f + m >= 1 ? e += w / c : e += w * Math.pow(2, 1 - m), e * c >= 2 && (f++, c /= 2), f + m >= u ? (l = 0, f = u) : f + m >= 1 ? (l = (e * c - 1) * Math.pow(2, r), f = f + m) : (l = e * Math.pow(2, m - 1) * Math.pow(2, r), f = 0)); r >= 8; t[n + R] = l & 255, R += h, l /= 256, r -= 8)
    ;
  for (f = f << r | l, y += r; y > 0; t[n + R] = f & 255, R += h, f /= 256, y -= 8)
    ;
  t[n + R - h] |= q * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = base64Js, n = ieee754, o = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = u, t.SlowBuffer = T, t.INSPECT_MAX_BYTES = 50;
  const r = 2147483647;
  t.kMaxLength = r;
  const { Uint8Array: a, ArrayBuffer: f, SharedArrayBuffer: l } = globalThis;
  u.TYPED_ARRAY_SUPPORT = c(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function c() {
    try {
      const U = new a(1), s = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(s, a.prototype), Object.setPrototypeOf(U, s), U.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function y(U) {
    if (U > r)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
    const s = new a(U);
    return Object.setPrototypeOf(s, u.prototype), s;
  }
  function u(U, s, _) {
    if (typeof U == "number") {
      if (typeof s == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return h(U);
    }
    return m(U, s, _);
  }
  u.poolSize = 8192;
  function m(U, s, _) {
    if (typeof U == "string")
      return q(U, s);
    if (f.isView(U))
      return v(U);
    if (U == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
      );
    if (Se(U, f) || U && Se(U.buffer, f) || typeof l < "u" && (Se(U, l) || U && Se(U.buffer, l)))
      return P(U, s, _);
    if (typeof U == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const W = U.valueOf && U.valueOf();
    if (W != null && W !== U)
      return u.from(W, s, _);
    const ue = E(U);
    if (ue) return ue;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof U[Symbol.toPrimitive] == "function")
      return u.from(U[Symbol.toPrimitive]("string"), s, _);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
    );
  }
  u.from = function(U, s, _) {
    return m(U, s, _);
  }, Object.setPrototypeOf(u.prototype, a.prototype), Object.setPrototypeOf(u, a);
  function w(U) {
    if (typeof U != "number")
      throw new TypeError('"size" argument must be of type number');
    if (U < 0)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
  }
  function R(U, s, _) {
    return w(U), U <= 0 ? y(U) : s !== void 0 ? typeof _ == "string" ? y(U).fill(s, _) : y(U).fill(s) : y(U);
  }
  u.alloc = function(U, s, _) {
    return R(U, s, _);
  };
  function h(U) {
    return w(U), y(U < 0 ? 0 : I(U) | 0);
  }
  u.allocUnsafe = function(U) {
    return h(U);
  }, u.allocUnsafeSlow = function(U) {
    return h(U);
  };
  function q(U, s) {
    if ((typeof s != "string" || s === "") && (s = "utf8"), !u.isEncoding(s))
      throw new TypeError("Unknown encoding: " + s);
    const _ = $(U, s) | 0;
    let W = y(_);
    const ue = W.write(U, s);
    return ue !== _ && (W = W.slice(0, ue)), W;
  }
  function d(U) {
    const s = U.length < 0 ? 0 : I(U.length) | 0, _ = y(s);
    for (let W = 0; W < s; W += 1)
      _[W] = U[W] & 255;
    return _;
  }
  function v(U) {
    if (Se(U, a)) {
      const s = new a(U);
      return P(s.buffer, s.byteOffset, s.byteLength);
    }
    return d(U);
  }
  function P(U, s, _) {
    if (s < 0 || U.byteLength < s)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (U.byteLength < s + (_ || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let W;
    return s === void 0 && _ === void 0 ? W = new a(U) : _ === void 0 ? W = new a(U, s) : W = new a(U, s, _), Object.setPrototypeOf(W, u.prototype), W;
  }
  function E(U) {
    if (u.isBuffer(U)) {
      const s = I(U.length) | 0, _ = y(s);
      return _.length === 0 || U.copy(_, 0, 0, s), _;
    }
    if (U.length !== void 0)
      return typeof U.length != "number" || Le(U.length) ? y(0) : d(U);
    if (U.type === "Buffer" && Array.isArray(U.data))
      return d(U.data);
  }
  function I(U) {
    if (U >= r)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
    return U | 0;
  }
  function T(U) {
    return +U != U && (U = 0), u.alloc(+U);
  }
  u.isBuffer = function(s) {
    return s != null && s._isBuffer === !0 && s !== u.prototype;
  }, u.compare = function(s, _) {
    if (Se(s, a) && (s = u.from(s, s.offset, s.byteLength)), Se(_, a) && (_ = u.from(_, _.offset, _.byteLength)), !u.isBuffer(s) || !u.isBuffer(_))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (s === _) return 0;
    let W = s.length, ue = _.length;
    for (let J = 0, he = Math.min(W, ue); J < he; ++J)
      if (s[J] !== _[J]) {
        W = s[J], ue = _[J];
        break;
      }
    return W < ue ? -1 : ue < W ? 1 : 0;
  }, u.isEncoding = function(s) {
    switch (String(s).toLowerCase()) {
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
  }, u.concat = function(s, _) {
    if (!Array.isArray(s))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (s.length === 0)
      return u.alloc(0);
    let W;
    if (_ === void 0)
      for (_ = 0, W = 0; W < s.length; ++W)
        _ += s[W].length;
    const ue = u.allocUnsafe(_);
    let J = 0;
    for (W = 0; W < s.length; ++W) {
      let he = s[W];
      if (Se(he, a))
        J + he.length > ue.length ? (u.isBuffer(he) || (he = u.from(he)), he.copy(ue, J)) : a.prototype.set.call(
          ue,
          he,
          J
        );
      else if (u.isBuffer(he))
        he.copy(ue, J);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      J += he.length;
    }
    return ue;
  };
  function $(U, s) {
    if (u.isBuffer(U))
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
      switch (s) {
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
          s = ("" + s).toLowerCase(), ue = !0;
      }
  }
  u.byteLength = $;
  function x(U, s, _) {
    let W = !1;
    if ((s === void 0 || s < 0) && (s = 0), s > this.length || ((_ === void 0 || _ > this.length) && (_ = this.length), _ <= 0) || (_ >>>= 0, s >>>= 0, _ <= s))
      return "";
    for (U || (U = "utf8"); ; )
      switch (U) {
        case "hex":
          return ee(this, s, _);
        case "utf8":
        case "utf-8":
          return be(this, s, _);
        case "ascii":
          return M(this, s, _);
        case "latin1":
        case "binary":
          return pe(this, s, _);
        case "base64":
          return we(this, s, _);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Q(this, s, _);
        default:
          if (W) throw new TypeError("Unknown encoding: " + U);
          U = (U + "").toLowerCase(), W = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function j(U, s, _) {
    const W = U[s];
    U[s] = U[_], U[_] = W;
  }
  u.prototype.swap16 = function() {
    const s = this.length;
    if (s % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let _ = 0; _ < s; _ += 2)
      j(this, _, _ + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const s = this.length;
    if (s % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let _ = 0; _ < s; _ += 4)
      j(this, _, _ + 3), j(this, _ + 1, _ + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const s = this.length;
    if (s % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let _ = 0; _ < s; _ += 8)
      j(this, _, _ + 7), j(this, _ + 1, _ + 6), j(this, _ + 2, _ + 5), j(this, _ + 3, _ + 4);
    return this;
  }, u.prototype.toString = function() {
    const s = this.length;
    return s === 0 ? "" : arguments.length === 0 ? be(this, 0, s) : x.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(s) {
    if (!u.isBuffer(s)) throw new TypeError("Argument must be a Buffer");
    return this === s ? !0 : u.compare(this, s) === 0;
  }, u.prototype.inspect = function() {
    let s = "";
    const _ = t.INSPECT_MAX_BYTES;
    return s = this.toString("hex", 0, _).replace(/(.{2})/g, "$1 ").trim(), this.length > _ && (s += " ... "), "<Buffer " + s + ">";
  }, o && (u.prototype[o] = u.prototype.inspect), u.prototype.compare = function(s, _, W, ue, J) {
    if (Se(s, a) && (s = u.from(s, s.offset, s.byteLength)), !u.isBuffer(s))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof s
      );
    if (_ === void 0 && (_ = 0), W === void 0 && (W = s ? s.length : 0), ue === void 0 && (ue = 0), J === void 0 && (J = this.length), _ < 0 || W > s.length || ue < 0 || J > this.length)
      throw new RangeError("out of range index");
    if (ue >= J && _ >= W)
      return 0;
    if (ue >= J)
      return -1;
    if (_ >= W)
      return 1;
    if (_ >>>= 0, W >>>= 0, ue >>>= 0, J >>>= 0, this === s) return 0;
    let he = J - ue, k = W - _;
    const Be = Math.min(he, k), We = this.slice(ue, J), S = s.slice(_, W);
    for (let Ie = 0; Ie < Be; ++Ie)
      if (We[Ie] !== S[Ie]) {
        he = We[Ie], k = S[Ie];
        break;
      }
    return he < k ? -1 : k < he ? 1 : 0;
  };
  function V(U, s, _, W, ue) {
    if (U.length === 0) return -1;
    if (typeof _ == "string" ? (W = _, _ = 0) : _ > 2147483647 ? _ = 2147483647 : _ < -2147483648 && (_ = -2147483648), _ = +_, Le(_) && (_ = ue ? 0 : U.length - 1), _ < 0 && (_ = U.length + _), _ >= U.length) {
      if (ue) return -1;
      _ = U.length - 1;
    } else if (_ < 0)
      if (ue) _ = 0;
      else return -1;
    if (typeof s == "string" && (s = u.from(s, W)), u.isBuffer(s))
      return s.length === 0 ? -1 : C(U, s, _, W, ue);
    if (typeof s == "number")
      return s = s & 255, typeof a.prototype.indexOf == "function" ? ue ? a.prototype.indexOf.call(U, s, _) : a.prototype.lastIndexOf.call(U, s, _) : C(U, [s], _, W, ue);
    throw new TypeError("val must be string, number or Buffer");
  }
  function C(U, s, _, W, ue) {
    let J = 1, he = U.length, k = s.length;
    if (W !== void 0 && (W = String(W).toLowerCase(), W === "ucs2" || W === "ucs-2" || W === "utf16le" || W === "utf-16le")) {
      if (U.length < 2 || s.length < 2)
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
        if (Be(U, We) === Be(s, S === -1 ? 0 : We - S)) {
          if (S === -1 && (S = We), We - S + 1 === k) return S * J;
        } else
          S !== -1 && (We -= We - S), S = -1;
    } else
      for (_ + k > he && (_ = he - k), We = _; We >= 0; We--) {
        let S = !0;
        for (let Ie = 0; Ie < k; Ie++)
          if (Be(U, We + Ie) !== Be(s, Ie)) {
            S = !1;
            break;
          }
        if (S) return We;
      }
    return -1;
  }
  u.prototype.includes = function(s, _, W) {
    return this.indexOf(s, _, W) !== -1;
  }, u.prototype.indexOf = function(s, _, W) {
    return V(this, s, _, W, !0);
  }, u.prototype.lastIndexOf = function(s, _, W) {
    return V(this, s, _, W, !1);
  };
  function z(U, s, _, W) {
    _ = Number(_) || 0;
    const ue = U.length - _;
    W ? (W = Number(W), W > ue && (W = ue)) : W = ue;
    const J = s.length;
    W > J / 2 && (W = J / 2);
    let he;
    for (he = 0; he < W; ++he) {
      const k = parseInt(s.substr(he * 2, 2), 16);
      if (Le(k)) return he;
      U[_ + he] = k;
    }
    return he;
  }
  function g(U, s, _, W) {
    return ge($e(s, U.length - _), U, _, W);
  }
  function D(U, s, _, W) {
    return ge(Ce(s), U, _, W);
  }
  function ie(U, s, _, W) {
    return ge(Ue(s), U, _, W);
  }
  function de(U, s, _, W) {
    return ge(Ae(s, U.length - _), U, _, W);
  }
  u.prototype.write = function(s, _, W, ue) {
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
    if ((W === void 0 || W > J) && (W = J), s.length > 0 && (W < 0 || _ < 0) || _ > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    ue || (ue = "utf8");
    let he = !1;
    for (; ; )
      switch (ue) {
        case "hex":
          return z(this, s, _, W);
        case "utf8":
        case "utf-8":
          return g(this, s, _, W);
        case "ascii":
        case "latin1":
        case "binary":
          return D(this, s, _, W);
        case "base64":
          return ie(this, s, _, W);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return de(this, s, _, W);
        default:
          if (he) throw new TypeError("Unknown encoding: " + ue);
          ue = ("" + ue).toLowerCase(), he = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function we(U, s, _) {
    return s === 0 && _ === U.length ? e.fromByteArray(U) : e.fromByteArray(U.slice(s, _));
  }
  function be(U, s, _) {
    _ = Math.min(U.length, _);
    const W = [];
    let ue = s;
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
    const s = U.length;
    if (s <= ce)
      return String.fromCharCode.apply(String, U);
    let _ = "", W = 0;
    for (; W < s; )
      _ += String.fromCharCode.apply(
        String,
        U.slice(W, W += ce)
      );
    return _;
  }
  function M(U, s, _) {
    let W = "";
    _ = Math.min(U.length, _);
    for (let ue = s; ue < _; ++ue)
      W += String.fromCharCode(U[ue] & 127);
    return W;
  }
  function pe(U, s, _) {
    let W = "";
    _ = Math.min(U.length, _);
    for (let ue = s; ue < _; ++ue)
      W += String.fromCharCode(U[ue]);
    return W;
  }
  function ee(U, s, _) {
    const W = U.length;
    (!s || s < 0) && (s = 0), (!_ || _ < 0 || _ > W) && (_ = W);
    let ue = "";
    for (let J = s; J < _; ++J)
      ue += je[U[J]];
    return ue;
  }
  function Q(U, s, _) {
    const W = U.slice(s, _);
    let ue = "";
    for (let J = 0; J < W.length - 1; J += 2)
      ue += String.fromCharCode(W[J] + W[J + 1] * 256);
    return ue;
  }
  u.prototype.slice = function(s, _) {
    const W = this.length;
    s = ~~s, _ = _ === void 0 ? W : ~~_, s < 0 ? (s += W, s < 0 && (s = 0)) : s > W && (s = W), _ < 0 ? (_ += W, _ < 0 && (_ = 0)) : _ > W && (_ = W), _ < s && (_ = s);
    const ue = this.subarray(s, _);
    return Object.setPrototypeOf(ue, u.prototype), ue;
  };
  function Z(U, s, _) {
    if (U % 1 !== 0 || U < 0) throw new RangeError("offset is not uint");
    if (U + s > _) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(s, _, W) {
    s = s >>> 0, _ = _ >>> 0, W || Z(s, _, this.length);
    let ue = this[s], J = 1, he = 0;
    for (; ++he < _ && (J *= 256); )
      ue += this[s + he] * J;
    return ue;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(s, _, W) {
    s = s >>> 0, _ = _ >>> 0, W || Z(s, _, this.length);
    let ue = this[s + --_], J = 1;
    for (; _ > 0 && (J *= 256); )
      ue += this[s + --_] * J;
    return ue;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(s, _) {
    return s = s >>> 0, _ || Z(s, 1, this.length), this[s];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 2, this.length), this[s] | this[s + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 2, this.length), this[s] << 8 | this[s + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), (this[s] | this[s + 1] << 8 | this[s + 2] << 16) + this[s + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), this[s] * 16777216 + (this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3]);
  }, u.prototype.readBigUInt64LE = ke(function(s) {
    s = s >>> 0, Re(s, "offset");
    const _ = this[s], W = this[s + 7];
    (_ === void 0 || W === void 0) && Pe(s, this.length - 8);
    const ue = _ + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24, J = this[++s] + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + W * 2 ** 24;
    return BigInt(ue) + (BigInt(J) << BigInt(32));
  }), u.prototype.readBigUInt64BE = ke(function(s) {
    s = s >>> 0, Re(s, "offset");
    const _ = this[s], W = this[s + 7];
    (_ === void 0 || W === void 0) && Pe(s, this.length - 8);
    const ue = _ * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s], J = this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + W;
    return (BigInt(ue) << BigInt(32)) + BigInt(J);
  }), u.prototype.readIntLE = function(s, _, W) {
    s = s >>> 0, _ = _ >>> 0, W || Z(s, _, this.length);
    let ue = this[s], J = 1, he = 0;
    for (; ++he < _ && (J *= 256); )
      ue += this[s + he] * J;
    return J *= 128, ue >= J && (ue -= Math.pow(2, 8 * _)), ue;
  }, u.prototype.readIntBE = function(s, _, W) {
    s = s >>> 0, _ = _ >>> 0, W || Z(s, _, this.length);
    let ue = _, J = 1, he = this[s + --ue];
    for (; ue > 0 && (J *= 256); )
      he += this[s + --ue] * J;
    return J *= 128, he >= J && (he -= Math.pow(2, 8 * _)), he;
  }, u.prototype.readInt8 = function(s, _) {
    return s = s >>> 0, _ || Z(s, 1, this.length), this[s] & 128 ? (255 - this[s] + 1) * -1 : this[s];
  }, u.prototype.readInt16LE = function(s, _) {
    s = s >>> 0, _ || Z(s, 2, this.length);
    const W = this[s] | this[s + 1] << 8;
    return W & 32768 ? W | 4294901760 : W;
  }, u.prototype.readInt16BE = function(s, _) {
    s = s >>> 0, _ || Z(s, 2, this.length);
    const W = this[s + 1] | this[s] << 8;
    return W & 32768 ? W | 4294901760 : W;
  }, u.prototype.readInt32LE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), this[s] | this[s + 1] << 8 | this[s + 2] << 16 | this[s + 3] << 24;
  }, u.prototype.readInt32BE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), this[s] << 24 | this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3];
  }, u.prototype.readBigInt64LE = ke(function(s) {
    s = s >>> 0, Re(s, "offset");
    const _ = this[s], W = this[s + 7];
    (_ === void 0 || W === void 0) && Pe(s, this.length - 8);
    const ue = this[s + 4] + this[s + 5] * 2 ** 8 + this[s + 6] * 2 ** 16 + (W << 24);
    return (BigInt(ue) << BigInt(32)) + BigInt(_ + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24);
  }), u.prototype.readBigInt64BE = ke(function(s) {
    s = s >>> 0, Re(s, "offset");
    const _ = this[s], W = this[s + 7];
    (_ === void 0 || W === void 0) && Pe(s, this.length - 8);
    const ue = (_ << 24) + // Overflow
    this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s];
    return (BigInt(ue) << BigInt(32)) + BigInt(this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + W);
  }), u.prototype.readFloatLE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), n.read(this, s, !0, 23, 4);
  }, u.prototype.readFloatBE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 4, this.length), n.read(this, s, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 8, this.length), n.read(this, s, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(s, _) {
    return s = s >>> 0, _ || Z(s, 8, this.length), n.read(this, s, !1, 52, 8);
  };
  function le(U, s, _, W, ue, J) {
    if (!u.isBuffer(U)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (s > ue || s < J) throw new RangeError('"value" argument is out of bounds');
    if (_ + W > U.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(s, _, W, ue) {
    if (s = +s, _ = _ >>> 0, W = W >>> 0, !ue) {
      const k = Math.pow(2, 8 * W) - 1;
      le(this, s, _, W, k, 0);
    }
    let J = 1, he = 0;
    for (this[_] = s & 255; ++he < W && (J *= 256); )
      this[_ + he] = s / J & 255;
    return _ + W;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(s, _, W, ue) {
    if (s = +s, _ = _ >>> 0, W = W >>> 0, !ue) {
      const k = Math.pow(2, 8 * W) - 1;
      le(this, s, _, W, k, 0);
    }
    let J = W - 1, he = 1;
    for (this[_ + J] = s & 255; --J >= 0 && (he *= 256); )
      this[_ + J] = s / he & 255;
    return _ + W;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 1, 255, 0), this[_] = s & 255, _ + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 2, 65535, 0), this[_] = s & 255, this[_ + 1] = s >>> 8, _ + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 2, 65535, 0), this[_] = s >>> 8, this[_ + 1] = s & 255, _ + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 4, 4294967295, 0), this[_ + 3] = s >>> 24, this[_ + 2] = s >>> 16, this[_ + 1] = s >>> 8, this[_] = s & 255, _ + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 4, 4294967295, 0), this[_] = s >>> 24, this[_ + 1] = s >>> 16, this[_ + 2] = s >>> 8, this[_ + 3] = s & 255, _ + 4;
  };
  function O(U, s, _, W, ue) {
    Ee(s, W, ue, U, _, 7);
    let J = Number(s & BigInt(4294967295));
    U[_++] = J, J = J >> 8, U[_++] = J, J = J >> 8, U[_++] = J, J = J >> 8, U[_++] = J;
    let he = Number(s >> BigInt(32) & BigInt(4294967295));
    return U[_++] = he, he = he >> 8, U[_++] = he, he = he >> 8, U[_++] = he, he = he >> 8, U[_++] = he, _;
  }
  function B(U, s, _, W, ue) {
    Ee(s, W, ue, U, _, 7);
    let J = Number(s & BigInt(4294967295));
    U[_ + 7] = J, J = J >> 8, U[_ + 6] = J, J = J >> 8, U[_ + 5] = J, J = J >> 8, U[_ + 4] = J;
    let he = Number(s >> BigInt(32) & BigInt(4294967295));
    return U[_ + 3] = he, he = he >> 8, U[_ + 2] = he, he = he >> 8, U[_ + 1] = he, he = he >> 8, U[_] = he, _ + 8;
  }
  u.prototype.writeBigUInt64LE = ke(function(s, _ = 0) {
    return O(this, s, _, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = ke(function(s, _ = 0) {
    return B(this, s, _, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(s, _, W, ue) {
    if (s = +s, _ = _ >>> 0, !ue) {
      const Be = Math.pow(2, 8 * W - 1);
      le(this, s, _, W, Be - 1, -Be);
    }
    let J = 0, he = 1, k = 0;
    for (this[_] = s & 255; ++J < W && (he *= 256); )
      s < 0 && k === 0 && this[_ + J - 1] !== 0 && (k = 1), this[_ + J] = (s / he >> 0) - k & 255;
    return _ + W;
  }, u.prototype.writeIntBE = function(s, _, W, ue) {
    if (s = +s, _ = _ >>> 0, !ue) {
      const Be = Math.pow(2, 8 * W - 1);
      le(this, s, _, W, Be - 1, -Be);
    }
    let J = W - 1, he = 1, k = 0;
    for (this[_ + J] = s & 255; --J >= 0 && (he *= 256); )
      s < 0 && k === 0 && this[_ + J + 1] !== 0 && (k = 1), this[_ + J] = (s / he >> 0) - k & 255;
    return _ + W;
  }, u.prototype.writeInt8 = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 1, 127, -128), s < 0 && (s = 255 + s + 1), this[_] = s & 255, _ + 1;
  }, u.prototype.writeInt16LE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 2, 32767, -32768), this[_] = s & 255, this[_ + 1] = s >>> 8, _ + 2;
  }, u.prototype.writeInt16BE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 2, 32767, -32768), this[_] = s >>> 8, this[_ + 1] = s & 255, _ + 2;
  }, u.prototype.writeInt32LE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 4, 2147483647, -2147483648), this[_] = s & 255, this[_ + 1] = s >>> 8, this[_ + 2] = s >>> 16, this[_ + 3] = s >>> 24, _ + 4;
  }, u.prototype.writeInt32BE = function(s, _, W) {
    return s = +s, _ = _ >>> 0, W || le(this, s, _, 4, 2147483647, -2147483648), s < 0 && (s = 4294967295 + s + 1), this[_] = s >>> 24, this[_ + 1] = s >>> 16, this[_ + 2] = s >>> 8, this[_ + 3] = s & 255, _ + 4;
  }, u.prototype.writeBigInt64LE = ke(function(s, _ = 0) {
    return O(this, s, _, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = ke(function(s, _ = 0) {
    return B(this, s, _, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function N(U, s, _, W, ue, J) {
    if (_ + W > U.length) throw new RangeError("Index out of range");
    if (_ < 0) throw new RangeError("Index out of range");
  }
  function re(U, s, _, W, ue) {
    return s = +s, _ = _ >>> 0, ue || N(U, s, _, 4), n.write(U, s, _, W, 23, 4), _ + 4;
  }
  u.prototype.writeFloatLE = function(s, _, W) {
    return re(this, s, _, !0, W);
  }, u.prototype.writeFloatBE = function(s, _, W) {
    return re(this, s, _, !1, W);
  };
  function ne(U, s, _, W, ue) {
    return s = +s, _ = _ >>> 0, ue || N(U, s, _, 8), n.write(U, s, _, W, 52, 8), _ + 8;
  }
  u.prototype.writeDoubleLE = function(s, _, W) {
    return ne(this, s, _, !0, W);
  }, u.prototype.writeDoubleBE = function(s, _, W) {
    return ne(this, s, _, !1, W);
  }, u.prototype.copy = function(s, _, W, ue) {
    if (!u.isBuffer(s)) throw new TypeError("argument should be a Buffer");
    if (W || (W = 0), !ue && ue !== 0 && (ue = this.length), _ >= s.length && (_ = s.length), _ || (_ = 0), ue > 0 && ue < W && (ue = W), ue === W || s.length === 0 || this.length === 0) return 0;
    if (_ < 0)
      throw new RangeError("targetStart out of bounds");
    if (W < 0 || W >= this.length) throw new RangeError("Index out of range");
    if (ue < 0) throw new RangeError("sourceEnd out of bounds");
    ue > this.length && (ue = this.length), s.length - _ < ue - W && (ue = s.length - _ + W);
    const J = ue - W;
    return this === s && typeof a.prototype.copyWithin == "function" ? this.copyWithin(_, W, ue) : a.prototype.set.call(
      s,
      this.subarray(W, ue),
      _
    ), J;
  }, u.prototype.fill = function(s, _, W, ue) {
    if (typeof s == "string") {
      if (typeof _ == "string" ? (ue = _, _ = 0, W = this.length) : typeof W == "string" && (ue = W, W = this.length), ue !== void 0 && typeof ue != "string")
        throw new TypeError("encoding must be a string");
      if (typeof ue == "string" && !u.isEncoding(ue))
        throw new TypeError("Unknown encoding: " + ue);
      if (s.length === 1) {
        const he = s.charCodeAt(0);
        (ue === "utf8" && he < 128 || ue === "latin1") && (s = he);
      }
    } else typeof s == "number" ? s = s & 255 : typeof s == "boolean" && (s = Number(s));
    if (_ < 0 || this.length < _ || this.length < W)
      throw new RangeError("Out of range index");
    if (W <= _)
      return this;
    _ = _ >>> 0, W = W === void 0 ? this.length : W >>> 0, s || (s = 0);
    let J;
    if (typeof s == "number")
      for (J = _; J < W; ++J)
        this[J] = s;
    else {
      const he = u.isBuffer(s) ? s : u.from(s, ue), k = he.length;
      if (k === 0)
        throw new TypeError('The value "' + s + '" is invalid for argument "value"');
      for (J = 0; J < W - _; ++J)
        this[J + _] = he[J % k];
    }
    return this;
  };
  const F = {};
  function L(U, s, _) {
    F[U] = class extends _ {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: s.apply(this, arguments),
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
    function(U, s) {
      return `The "${U}" argument must be of type number. Received type ${typeof s}`;
    },
    TypeError
  ), L(
    "ERR_OUT_OF_RANGE",
    function(U, s, _) {
      let W = `The value of "${U}" is out of range.`, ue = _;
      return Number.isInteger(_) && Math.abs(_) > 2 ** 32 ? ue = H(String(_)) : typeof _ == "bigint" && (ue = String(_), (_ > BigInt(2) ** BigInt(32) || _ < -(BigInt(2) ** BigInt(32))) && (ue = H(ue)), ue += "n"), W += ` It must be ${s}. Received ${ue}`, W;
    },
    RangeError
  );
  function H(U) {
    let s = "", _ = U.length;
    const W = U[0] === "-" ? 1 : 0;
    for (; _ >= W + 4; _ -= 3)
      s = `_${U.slice(_ - 3, _)}${s}`;
    return `${U.slice(0, _)}${s}`;
  }
  function se(U, s, _) {
    Re(s, "offset"), (U[s] === void 0 || U[s + _] === void 0) && Pe(s, U.length - (_ + 1));
  }
  function Ee(U, s, _, W, ue, J) {
    if (U > _ || U < s) {
      const he = typeof s == "bigint" ? "n" : "";
      let k;
      throw s === 0 || s === BigInt(0) ? k = `>= 0${he} and < 2${he} ** ${(J + 1) * 8}${he}` : k = `>= -(2${he} ** ${(J + 1) * 8 - 1}${he}) and < 2 ** ${(J + 1) * 8 - 1}${he}`, new F.ERR_OUT_OF_RANGE("value", k, U);
    }
    se(W, ue, J);
  }
  function Re(U, s) {
    if (typeof U != "number")
      throw new F.ERR_INVALID_ARG_TYPE(s, "number", U);
  }
  function Pe(U, s, _) {
    throw Math.floor(U) !== U ? (Re(U, _), new F.ERR_OUT_OF_RANGE("offset", "an integer", U)) : s < 0 ? new F.ERR_BUFFER_OUT_OF_BOUNDS() : new F.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${s}`,
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
  function $e(U, s) {
    s = s || 1 / 0;
    let _;
    const W = U.length;
    let ue = null;
    const J = [];
    for (let he = 0; he < W; ++he) {
      if (_ = U.charCodeAt(he), _ > 55295 && _ < 57344) {
        if (!ue) {
          if (_ > 56319) {
            (s -= 3) > -1 && J.push(239, 191, 189);
            continue;
          } else if (he + 1 === W) {
            (s -= 3) > -1 && J.push(239, 191, 189);
            continue;
          }
          ue = _;
          continue;
        }
        if (_ < 56320) {
          (s -= 3) > -1 && J.push(239, 191, 189), ue = _;
          continue;
        }
        _ = (ue - 55296 << 10 | _ - 56320) + 65536;
      } else ue && (s -= 3) > -1 && J.push(239, 191, 189);
      if (ue = null, _ < 128) {
        if ((s -= 1) < 0) break;
        J.push(_);
      } else if (_ < 2048) {
        if ((s -= 2) < 0) break;
        J.push(
          _ >> 6 | 192,
          _ & 63 | 128
        );
      } else if (_ < 65536) {
        if ((s -= 3) < 0) break;
        J.push(
          _ >> 12 | 224,
          _ >> 6 & 63 | 128,
          _ & 63 | 128
        );
      } else if (_ < 1114112) {
        if ((s -= 4) < 0) break;
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
    const s = [];
    for (let _ = 0; _ < U.length; ++_)
      s.push(U.charCodeAt(_) & 255);
    return s;
  }
  function Ae(U, s) {
    let _, W, ue;
    const J = [];
    for (let he = 0; he < U.length && !((s -= 2) < 0); ++he)
      _ = U.charCodeAt(he), W = _ >> 8, ue = _ % 256, J.push(ue), J.push(W);
    return J;
  }
  function Ue(U) {
    return e.toByteArray(te(U));
  }
  function ge(U, s, _, W) {
    let ue;
    for (ue = 0; ue < W && !(ue + _ >= s.length || ue >= U.length); ++ue)
      s[ue + _] = U[ue];
    return ue;
  }
  function Se(U, s) {
    return U instanceof s || U != null && U.constructor != null && U.constructor.name != null && U.constructor.name === s.name;
  }
  function Le(U) {
    return U !== U;
  }
  const je = (function() {
    const U = "0123456789abcdef", s = new Array(256);
    for (let _ = 0; _ < 16; ++_) {
      const W = _ * 16;
      for (let ue = 0; ue < 16; ++ue)
        s[W + ue] = U[_] + U[ue];
    }
    return s;
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
    n.byteLength = u, n.toByteArray = w, n.fromByteArray = q;
    for (var o = [], r = [], a = typeof Uint8Array < "u" ? Uint8Array : Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", l = 0, c = f.length; l < c; ++l)
      o[l] = f[l], r[f.charCodeAt(l)] = l;
    r[45] = 62, r[95] = 63;
    function y(P) {
      var E = P.length;
      if (E % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var I = P.indexOf("=");
      I === -1 && (I = E);
      var T = I === E ? 0 : 4 - I % 4;
      return [I, T];
    }
    function u(P) {
      var E = y(P), I = E[0], T = E[1];
      return (I + T) * 3 / 4 - T;
    }
    function m(P, E, I) {
      return (E + I) * 3 / 4 - I;
    }
    function w(P) {
      var E, I = y(P), T = I[0], $ = I[1], x = new a(m(P, T, $)), j = 0, V = $ > 0 ? T - 4 : T, C;
      for (C = 0; C < V; C += 4)
        E = r[P.charCodeAt(C)] << 18 | r[P.charCodeAt(C + 1)] << 12 | r[P.charCodeAt(C + 2)] << 6 | r[P.charCodeAt(C + 3)], x[j++] = E >> 16 & 255, x[j++] = E >> 8 & 255, x[j++] = E & 255;
      return $ === 2 && (E = r[P.charCodeAt(C)] << 2 | r[P.charCodeAt(C + 1)] >> 4, x[j++] = E & 255), $ === 1 && (E = r[P.charCodeAt(C)] << 10 | r[P.charCodeAt(C + 1)] << 4 | r[P.charCodeAt(C + 2)] >> 2, x[j++] = E >> 8 & 255, x[j++] = E & 255), x;
    }
    function R(P) {
      return o[P >> 18 & 63] + o[P >> 12 & 63] + o[P >> 6 & 63] + o[P & 63];
    }
    function h(P, E, I) {
      for (var T, $ = [], x = E; x < I; x += 3)
        T = (P[x] << 16 & 16711680) + (P[x + 1] << 8 & 65280) + (P[x + 2] & 255), $.push(R(T));
      return $.join("");
    }
    function q(P) {
      for (var E, I = P.length, T = I % 3, $ = [], x = 16383, j = 0, V = I - T; j < V; j += x)
        $.push(h(P, j, j + x > V ? V : j + x));
      return T === 1 ? (E = P[I - 1], $.push(
        o[E >> 2] + o[E << 4 & 63] + "=="
      )) : T === 2 && (E = (P[I - 2] << 8) + P[I - 1], $.push(
        o[E >> 10] + o[E >> 4 & 63] + o[E << 2 & 63] + "="
      )), $.join("");
    }
    var d = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    d.read = function(P, E, I, T, $) {
      var x, j, V = $ * 8 - T - 1, C = (1 << V) - 1, z = C >> 1, g = -7, D = I ? $ - 1 : 0, ie = I ? -1 : 1, de = P[E + D];
      for (D += ie, x = de & (1 << -g) - 1, de >>= -g, g += V; g > 0; x = x * 256 + P[E + D], D += ie, g -= 8)
        ;
      for (j = x & (1 << -g) - 1, x >>= -g, g += T; g > 0; j = j * 256 + P[E + D], D += ie, g -= 8)
        ;
      if (x === 0)
        x = 1 - z;
      else {
        if (x === C)
          return j ? NaN : (de ? -1 : 1) * (1 / 0);
        j = j + Math.pow(2, T), x = x - z;
      }
      return (de ? -1 : 1) * j * Math.pow(2, x - T);
    }, d.write = function(P, E, I, T, $, x) {
      var j, V, C, z = x * 8 - $ - 1, g = (1 << z) - 1, D = g >> 1, ie = $ === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, de = T ? 0 : x - 1, we = T ? 1 : -1, be = E < 0 || E === 0 && 1 / E < 0 ? 1 : 0;
      for (E = Math.abs(E), isNaN(E) || E === 1 / 0 ? (V = isNaN(E) ? 1 : 0, j = g) : (j = Math.floor(Math.log(E) / Math.LN2), E * (C = Math.pow(2, -j)) < 1 && (j--, C *= 2), j + D >= 1 ? E += ie / C : E += ie * Math.pow(2, 1 - D), E * C >= 2 && (j++, C /= 2), j + D >= g ? (V = 0, j = g) : j + D >= 1 ? (V = (E * C - 1) * Math.pow(2, $), j = j + D) : (V = E * Math.pow(2, D - 1) * Math.pow(2, $), j = 0)); $ >= 8; P[I + de] = V & 255, de += we, V /= 256, $ -= 8)
        ;
      for (j = j << $ | V, z += $; z > 0; P[I + de] = j & 255, de += we, j /= 256, z -= 8)
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
      const E = n, I = d, T = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      P.Buffer = g, P.SlowBuffer = Q, P.INSPECT_MAX_BYTES = 50;
      const $ = 2147483647;
      P.kMaxLength = $;
      const { Uint8Array: x, ArrayBuffer: j, SharedArrayBuffer: V } = globalThis;
      g.TYPED_ARRAY_SUPPORT = C(), !g.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function C() {
        try {
          const b = new x(1), p = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(p, x.prototype), Object.setPrototypeOf(b, p), b.foo() === 42;
        } catch {
          return !1;
        }
      }
      Object.defineProperty(g.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (g.isBuffer(this))
            return this.buffer;
        }
      }), Object.defineProperty(g.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (g.isBuffer(this))
            return this.byteOffset;
        }
      });
      function z(b) {
        if (b > $)
          throw new RangeError('The value "' + b + '" is invalid for option "size"');
        const p = new x(b);
        return Object.setPrototypeOf(p, g.prototype), p;
      }
      function g(b, p, A) {
        if (typeof b == "number") {
          if (typeof p == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return we(b);
        }
        return D(b, p, A);
      }
      g.poolSize = 8192;
      function D(b, p, A) {
        if (typeof b == "string")
          return be(b, p);
        if (j.isView(b))
          return fe(b);
        if (b == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b
          );
        if (G(b, j) || b && G(b.buffer, j) || typeof V < "u" && (G(b, V) || b && G(b.buffer, V)))
          return M(b, p, A);
        if (typeof b == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const Y = b.valueOf && b.valueOf();
        if (Y != null && Y !== b)
          return g.from(Y, p, A);
        const ye = pe(b);
        if (ye) return ye;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof b[Symbol.toPrimitive] == "function")
          return g.from(b[Symbol.toPrimitive]("string"), p, A);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b
        );
      }
      g.from = function(b, p, A) {
        return D(b, p, A);
      }, Object.setPrototypeOf(g.prototype, x.prototype), Object.setPrototypeOf(g, x);
      function ie(b) {
        if (typeof b != "number")
          throw new TypeError('"size" argument must be of type number');
        if (b < 0)
          throw new RangeError('The value "' + b + '" is invalid for option "size"');
      }
      function de(b, p, A) {
        return ie(b), b <= 0 ? z(b) : p !== void 0 ? typeof A == "string" ? z(b).fill(p, A) : z(b).fill(p) : z(b);
      }
      g.alloc = function(b, p, A) {
        return de(b, p, A);
      };
      function we(b) {
        return ie(b), z(b < 0 ? 0 : ee(b) | 0);
      }
      g.allocUnsafe = function(b) {
        return we(b);
      }, g.allocUnsafeSlow = function(b) {
        return we(b);
      };
      function be(b, p) {
        if ((typeof p != "string" || p === "") && (p = "utf8"), !g.isEncoding(p))
          throw new TypeError("Unknown encoding: " + p);
        const A = Z(b, p) | 0;
        let Y = z(A);
        const ye = Y.write(b, p);
        return ye !== A && (Y = Y.slice(0, ye)), Y;
      }
      function ce(b) {
        const p = b.length < 0 ? 0 : ee(b.length) | 0, A = z(p);
        for (let Y = 0; Y < p; Y += 1)
          A[Y] = b[Y] & 255;
        return A;
      }
      function fe(b) {
        if (G(b, x)) {
          const p = new x(b);
          return M(p.buffer, p.byteOffset, p.byteLength);
        }
        return ce(b);
      }
      function M(b, p, A) {
        if (p < 0 || b.byteLength < p)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (b.byteLength < p + (A || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let Y;
        return p === void 0 && A === void 0 ? Y = new x(b) : A === void 0 ? Y = new x(b, p) : Y = new x(b, p, A), Object.setPrototypeOf(Y, g.prototype), Y;
      }
      function pe(b) {
        if (g.isBuffer(b)) {
          const p = ee(b.length) | 0, A = z(p);
          return A.length === 0 || b.copy(A, 0, 0, p), A;
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
      function Q(b) {
        return +b != b && (b = 0), g.alloc(+b);
      }
      g.isBuffer = function(p) {
        return p != null && p._isBuffer === !0 && p !== g.prototype;
      }, g.compare = function(p, A) {
        if (G(p, x) && (p = g.from(p, p.offset, p.byteLength)), G(A, x) && (A = g.from(A, A.offset, A.byteLength)), !g.isBuffer(p) || !g.isBuffer(A))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (p === A) return 0;
        let Y = p.length, ye = A.length;
        for (let qe = 0, ae = Math.min(Y, ye); qe < ae; ++qe)
          if (p[qe] !== A[qe]) {
            Y = p[qe], ye = A[qe];
            break;
          }
        return Y < ye ? -1 : ye < Y ? 1 : 0;
      }, g.isEncoding = function(p) {
        switch (String(p).toLowerCase()) {
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
      }, g.concat = function(p, A) {
        if (!Array.isArray(p))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (p.length === 0)
          return g.alloc(0);
        let Y;
        if (A === void 0)
          for (A = 0, Y = 0; Y < p.length; ++Y)
            A += p[Y].length;
        const ye = g.allocUnsafe(A);
        let qe = 0;
        for (Y = 0; Y < p.length; ++Y) {
          let ae = p[Y];
          if (G(ae, x))
            qe + ae.length > ye.length ? (g.isBuffer(ae) || (ae = g.from(ae)), ae.copy(ye, qe)) : x.prototype.set.call(
              ye,
              ae,
              qe
            );
          else if (g.isBuffer(ae))
            ae.copy(ye, qe);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          qe += ae.length;
        }
        return ye;
      };
      function Z(b, p) {
        if (g.isBuffer(b))
          return b.length;
        if (j.isView(b) || G(b, j))
          return b.byteLength;
        if (typeof b != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof b
          );
        const A = b.length, Y = arguments.length > 2 && arguments[2] === !0;
        if (!Y && A === 0) return 0;
        let ye = !1;
        for (; ; )
          switch (p) {
            case "ascii":
            case "latin1":
            case "binary":
              return A;
            case "utf8":
            case "utf-8":
              return Be(b).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return A * 2;
            case "hex":
              return A >>> 1;
            case "base64":
              return Ie(b).length;
            default:
              if (ye)
                return Y ? -1 : Be(b).length;
              p = ("" + p).toLowerCase(), ye = !0;
          }
      }
      g.byteLength = Z;
      function le(b, p, A) {
        let Y = !1;
        if ((p === void 0 || p < 0) && (p = 0), p > this.length || ((A === void 0 || A > this.length) && (A = this.length), A <= 0) || (A >>>= 0, p >>>= 0, A <= p))
          return "";
        for (b || (b = "utf8"); ; )
          switch (b) {
            case "hex":
              return $e(this, p, A);
            case "utf8":
            case "utf-8":
              return Ee(this, p, A);
            case "ascii":
              return Oe(this, p, A);
            case "latin1":
            case "binary":
              return te(this, p, A);
            case "base64":
              return se(this, p, A);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Ce(this, p, A);
            default:
              if (Y) throw new TypeError("Unknown encoding: " + b);
              b = (b + "").toLowerCase(), Y = !0;
          }
      }
      g.prototype._isBuffer = !0;
      function O(b, p, A) {
        const Y = b[p];
        b[p] = b[A], b[A] = Y;
      }
      g.prototype.swap16 = function() {
        const p = this.length;
        if (p % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let A = 0; A < p; A += 2)
          O(this, A, A + 1);
        return this;
      }, g.prototype.swap32 = function() {
        const p = this.length;
        if (p % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let A = 0; A < p; A += 4)
          O(this, A, A + 3), O(this, A + 1, A + 2);
        return this;
      }, g.prototype.swap64 = function() {
        const p = this.length;
        if (p % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let A = 0; A < p; A += 8)
          O(this, A, A + 7), O(this, A + 1, A + 6), O(this, A + 2, A + 5), O(this, A + 3, A + 4);
        return this;
      }, g.prototype.toString = function() {
        const p = this.length;
        return p === 0 ? "" : arguments.length === 0 ? Ee(this, 0, p) : le.apply(this, arguments);
      }, g.prototype.toLocaleString = g.prototype.toString, g.prototype.equals = function(p) {
        if (!g.isBuffer(p)) throw new TypeError("Argument must be a Buffer");
        return this === p ? !0 : g.compare(this, p) === 0;
      }, g.prototype.inspect = function() {
        let p = "";
        const A = P.INSPECT_MAX_BYTES;
        return p = this.toString("hex", 0, A).replace(/(.{2})/g, "$1 ").trim(), this.length > A && (p += " ... "), "<Buffer " + p + ">";
      }, T && (g.prototype[T] = g.prototype.inspect), g.prototype.compare = function(p, A, Y, ye, qe) {
        if (G(p, x) && (p = g.from(p, p.offset, p.byteLength)), !g.isBuffer(p))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof p
          );
        if (A === void 0 && (A = 0), Y === void 0 && (Y = p ? p.length : 0), ye === void 0 && (ye = 0), qe === void 0 && (qe = this.length), A < 0 || Y > p.length || ye < 0 || qe > this.length)
          throw new RangeError("out of range index");
        if (ye >= qe && A >= Y)
          return 0;
        if (ye >= qe)
          return -1;
        if (A >= Y)
          return 1;
        if (A >>>= 0, Y >>>= 0, ye >>>= 0, qe >>>= 0, this === p) return 0;
        let ae = qe - ye, oe = Y - A;
        const me = Math.min(ae, oe), xe = this.slice(ye, qe), Te = p.slice(A, Y);
        for (let Me = 0; Me < me; ++Me)
          if (xe[Me] !== Te[Me]) {
            ae = xe[Me], oe = Te[Me];
            break;
          }
        return ae < oe ? -1 : oe < ae ? 1 : 0;
      };
      function B(b, p, A, Y, ye) {
        if (b.length === 0) return -1;
        if (typeof A == "string" ? (Y = A, A = 0) : A > 2147483647 ? A = 2147483647 : A < -2147483648 && (A = -2147483648), A = +A, _e(A) && (A = ye ? 0 : b.length - 1), A < 0 && (A = b.length + A), A >= b.length) {
          if (ye) return -1;
          A = b.length - 1;
        } else if (A < 0)
          if (ye) A = 0;
          else return -1;
        if (typeof p == "string" && (p = g.from(p, Y)), g.isBuffer(p))
          return p.length === 0 ? -1 : N(b, p, A, Y, ye);
        if (typeof p == "number")
          return p = p & 255, typeof x.prototype.indexOf == "function" ? ye ? x.prototype.indexOf.call(b, p, A) : x.prototype.lastIndexOf.call(b, p, A) : N(b, [p], A, Y, ye);
        throw new TypeError("val must be string, number or Buffer");
      }
      function N(b, p, A, Y, ye) {
        let qe = 1, ae = b.length, oe = p.length;
        if (Y !== void 0 && (Y = String(Y).toLowerCase(), Y === "ucs2" || Y === "ucs-2" || Y === "utf16le" || Y === "utf-16le")) {
          if (b.length < 2 || p.length < 2)
            return -1;
          qe = 2, ae /= 2, oe /= 2, A /= 2;
        }
        function me(Te, Me) {
          return qe === 1 ? Te[Me] : Te.readUInt16BE(Me * qe);
        }
        let xe;
        if (ye) {
          let Te = -1;
          for (xe = A; xe < ae; xe++)
            if (me(b, xe) === me(p, Te === -1 ? 0 : xe - Te)) {
              if (Te === -1 && (Te = xe), xe - Te + 1 === oe) return Te * qe;
            } else
              Te !== -1 && (xe -= xe - Te), Te = -1;
        } else
          for (A + oe > ae && (A = ae - oe), xe = A; xe >= 0; xe--) {
            let Te = !0;
            for (let Me = 0; Me < oe; Me++)
              if (me(b, xe + Me) !== me(p, Me)) {
                Te = !1;
                break;
              }
            if (Te) return xe;
          }
        return -1;
      }
      g.prototype.includes = function(p, A, Y) {
        return this.indexOf(p, A, Y) !== -1;
      }, g.prototype.indexOf = function(p, A, Y) {
        return B(this, p, A, Y, !0);
      }, g.prototype.lastIndexOf = function(p, A, Y) {
        return B(this, p, A, Y, !1);
      };
      function re(b, p, A, Y) {
        A = Number(A) || 0;
        const ye = b.length - A;
        Y ? (Y = Number(Y), Y > ye && (Y = ye)) : Y = ye;
        const qe = p.length;
        Y > qe / 2 && (Y = qe / 2);
        let ae;
        for (ae = 0; ae < Y; ++ae) {
          const oe = parseInt(p.substr(ae * 2, 2), 16);
          if (_e(oe)) return ae;
          b[A + ae] = oe;
        }
        return ae;
      }
      function ne(b, p, A, Y) {
        return Fe(Be(p, b.length - A), b, A, Y);
      }
      function F(b, p, A, Y) {
        return Fe(We(p), b, A, Y);
      }
      function L(b, p, A, Y) {
        return Fe(Ie(p), b, A, Y);
      }
      function H(b, p, A, Y) {
        return Fe(S(p, b.length - A), b, A, Y);
      }
      g.prototype.write = function(p, A, Y, ye) {
        if (A === void 0)
          ye = "utf8", Y = this.length, A = 0;
        else if (Y === void 0 && typeof A == "string")
          ye = A, Y = this.length, A = 0;
        else if (isFinite(A))
          A = A >>> 0, isFinite(Y) ? (Y = Y >>> 0, ye === void 0 && (ye = "utf8")) : (ye = Y, Y = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const qe = this.length - A;
        if ((Y === void 0 || Y > qe) && (Y = qe), p.length > 0 && (Y < 0 || A < 0) || A > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        ye || (ye = "utf8");
        let ae = !1;
        for (; ; )
          switch (ye) {
            case "hex":
              return re(this, p, A, Y);
            case "utf8":
            case "utf-8":
              return ne(this, p, A, Y);
            case "ascii":
            case "latin1":
            case "binary":
              return F(this, p, A, Y);
            case "base64":
              return L(this, p, A, Y);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return H(this, p, A, Y);
            default:
              if (ae) throw new TypeError("Unknown encoding: " + ye);
              ye = ("" + ye).toLowerCase(), ae = !0;
          }
      }, g.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function se(b, p, A) {
        return p === 0 && A === b.length ? E.fromByteArray(b) : E.fromByteArray(b.slice(p, A));
      }
      function Ee(b, p, A) {
        A = Math.min(b.length, A);
        const Y = [];
        let ye = p;
        for (; ye < A; ) {
          const qe = b[ye];
          let ae = null, oe = qe > 239 ? 4 : qe > 223 ? 3 : qe > 191 ? 2 : 1;
          if (ye + oe <= A) {
            let me, xe, Te, Me;
            switch (oe) {
              case 1:
                qe < 128 && (ae = qe);
                break;
              case 2:
                me = b[ye + 1], (me & 192) === 128 && (Me = (qe & 31) << 6 | me & 63, Me > 127 && (ae = Me));
                break;
              case 3:
                me = b[ye + 1], xe = b[ye + 2], (me & 192) === 128 && (xe & 192) === 128 && (Me = (qe & 15) << 12 | (me & 63) << 6 | xe & 63, Me > 2047 && (Me < 55296 || Me > 57343) && (ae = Me));
                break;
              case 4:
                me = b[ye + 1], xe = b[ye + 2], Te = b[ye + 3], (me & 192) === 128 && (xe & 192) === 128 && (Te & 192) === 128 && (Me = (qe & 15) << 18 | (me & 63) << 12 | (xe & 63) << 6 | Te & 63, Me > 65535 && Me < 1114112 && (ae = Me));
            }
          }
          ae === null ? (ae = 65533, oe = 1) : ae > 65535 && (ae -= 65536, Y.push(ae >>> 10 & 1023 | 55296), ae = 56320 | ae & 1023), Y.push(ae), ye += oe;
        }
        return Pe(Y);
      }
      const Re = 4096;
      function Pe(b) {
        const p = b.length;
        if (p <= Re)
          return String.fromCharCode.apply(String, b);
        let A = "", Y = 0;
        for (; Y < p; )
          A += String.fromCharCode.apply(
            String,
            b.slice(Y, Y += Re)
          );
        return A;
      }
      function Oe(b, p, A) {
        let Y = "";
        A = Math.min(b.length, A);
        for (let ye = p; ye < A; ++ye)
          Y += String.fromCharCode(b[ye] & 127);
        return Y;
      }
      function te(b, p, A) {
        let Y = "";
        A = Math.min(b.length, A);
        for (let ye = p; ye < A; ++ye)
          Y += String.fromCharCode(b[ye]);
        return Y;
      }
      function $e(b, p, A) {
        const Y = b.length;
        (!p || p < 0) && (p = 0), (!A || A < 0 || A > Y) && (A = Y);
        let ye = "";
        for (let qe = p; qe < A; ++qe)
          ye += De[b[qe]];
        return ye;
      }
      function Ce(b, p, A) {
        const Y = b.slice(p, A);
        let ye = "";
        for (let qe = 0; qe < Y.length - 1; qe += 2)
          ye += String.fromCharCode(Y[qe] + Y[qe + 1] * 256);
        return ye;
      }
      g.prototype.slice = function(p, A) {
        const Y = this.length;
        p = ~~p, A = A === void 0 ? Y : ~~A, p < 0 ? (p += Y, p < 0 && (p = 0)) : p > Y && (p = Y), A < 0 ? (A += Y, A < 0 && (A = 0)) : A > Y && (A = Y), A < p && (A = p);
        const ye = this.subarray(p, A);
        return Object.setPrototypeOf(ye, g.prototype), ye;
      };
      function Ae(b, p, A) {
        if (b % 1 !== 0 || b < 0) throw new RangeError("offset is not uint");
        if (b + p > A) throw new RangeError("Trying to access beyond buffer length");
      }
      g.prototype.readUintLE = g.prototype.readUIntLE = function(p, A, Y) {
        p = p >>> 0, A = A >>> 0, Y || Ae(p, A, this.length);
        let ye = this[p], qe = 1, ae = 0;
        for (; ++ae < A && (qe *= 256); )
          ye += this[p + ae] * qe;
        return ye;
      }, g.prototype.readUintBE = g.prototype.readUIntBE = function(p, A, Y) {
        p = p >>> 0, A = A >>> 0, Y || Ae(p, A, this.length);
        let ye = this[p + --A], qe = 1;
        for (; A > 0 && (qe *= 256); )
          ye += this[p + --A] * qe;
        return ye;
      }, g.prototype.readUint8 = g.prototype.readUInt8 = function(p, A) {
        return p = p >>> 0, A || Ae(p, 1, this.length), this[p];
      }, g.prototype.readUint16LE = g.prototype.readUInt16LE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 2, this.length), this[p] | this[p + 1] << 8;
      }, g.prototype.readUint16BE = g.prototype.readUInt16BE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 2, this.length), this[p] << 8 | this[p + 1];
      }, g.prototype.readUint32LE = g.prototype.readUInt32LE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), (this[p] | this[p + 1] << 8 | this[p + 2] << 16) + this[p + 3] * 16777216;
      }, g.prototype.readUint32BE = g.prototype.readUInt32BE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), this[p] * 16777216 + (this[p + 1] << 16 | this[p + 2] << 8 | this[p + 3]);
      }, g.prototype.readBigUInt64LE = Ze(function(p) {
        p = p >>> 0, ue(p, "offset");
        const A = this[p], Y = this[p + 7];
        (A === void 0 || Y === void 0) && J(p, this.length - 8);
        const ye = A + this[++p] * 2 ** 8 + this[++p] * 2 ** 16 + this[++p] * 2 ** 24, qe = this[++p] + this[++p] * 2 ** 8 + this[++p] * 2 ** 16 + Y * 2 ** 24;
        return BigInt(ye) + (BigInt(qe) << BigInt(32));
      }), g.prototype.readBigUInt64BE = Ze(function(p) {
        p = p >>> 0, ue(p, "offset");
        const A = this[p], Y = this[p + 7];
        (A === void 0 || Y === void 0) && J(p, this.length - 8);
        const ye = A * 2 ** 24 + this[++p] * 2 ** 16 + this[++p] * 2 ** 8 + this[++p], qe = this[++p] * 2 ** 24 + this[++p] * 2 ** 16 + this[++p] * 2 ** 8 + Y;
        return (BigInt(ye) << BigInt(32)) + BigInt(qe);
      }), g.prototype.readIntLE = function(p, A, Y) {
        p = p >>> 0, A = A >>> 0, Y || Ae(p, A, this.length);
        let ye = this[p], qe = 1, ae = 0;
        for (; ++ae < A && (qe *= 256); )
          ye += this[p + ae] * qe;
        return qe *= 128, ye >= qe && (ye -= Math.pow(2, 8 * A)), ye;
      }, g.prototype.readIntBE = function(p, A, Y) {
        p = p >>> 0, A = A >>> 0, Y || Ae(p, A, this.length);
        let ye = A, qe = 1, ae = this[p + --ye];
        for (; ye > 0 && (qe *= 256); )
          ae += this[p + --ye] * qe;
        return qe *= 128, ae >= qe && (ae -= Math.pow(2, 8 * A)), ae;
      }, g.prototype.readInt8 = function(p, A) {
        return p = p >>> 0, A || Ae(p, 1, this.length), this[p] & 128 ? (255 - this[p] + 1) * -1 : this[p];
      }, g.prototype.readInt16LE = function(p, A) {
        p = p >>> 0, A || Ae(p, 2, this.length);
        const Y = this[p] | this[p + 1] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, g.prototype.readInt16BE = function(p, A) {
        p = p >>> 0, A || Ae(p, 2, this.length);
        const Y = this[p + 1] | this[p] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, g.prototype.readInt32LE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), this[p] | this[p + 1] << 8 | this[p + 2] << 16 | this[p + 3] << 24;
      }, g.prototype.readInt32BE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), this[p] << 24 | this[p + 1] << 16 | this[p + 2] << 8 | this[p + 3];
      }, g.prototype.readBigInt64LE = Ze(function(p) {
        p = p >>> 0, ue(p, "offset");
        const A = this[p], Y = this[p + 7];
        (A === void 0 || Y === void 0) && J(p, this.length - 8);
        const ye = this[p + 4] + this[p + 5] * 2 ** 8 + this[p + 6] * 2 ** 16 + (Y << 24);
        return (BigInt(ye) << BigInt(32)) + BigInt(A + this[++p] * 2 ** 8 + this[++p] * 2 ** 16 + this[++p] * 2 ** 24);
      }), g.prototype.readBigInt64BE = Ze(function(p) {
        p = p >>> 0, ue(p, "offset");
        const A = this[p], Y = this[p + 7];
        (A === void 0 || Y === void 0) && J(p, this.length - 8);
        const ye = (A << 24) + // Overflow
        this[++p] * 2 ** 16 + this[++p] * 2 ** 8 + this[++p];
        return (BigInt(ye) << BigInt(32)) + BigInt(this[++p] * 2 ** 24 + this[++p] * 2 ** 16 + this[++p] * 2 ** 8 + Y);
      }), g.prototype.readFloatLE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), I.read(this, p, !0, 23, 4);
      }, g.prototype.readFloatBE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 4, this.length), I.read(this, p, !1, 23, 4);
      }, g.prototype.readDoubleLE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 8, this.length), I.read(this, p, !0, 52, 8);
      }, g.prototype.readDoubleBE = function(p, A) {
        return p = p >>> 0, A || Ae(p, 8, this.length), I.read(this, p, !1, 52, 8);
      };
      function Ue(b, p, A, Y, ye, qe) {
        if (!g.isBuffer(b)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (p > ye || p < qe) throw new RangeError('"value" argument is out of bounds');
        if (A + Y > b.length) throw new RangeError("Index out of range");
      }
      g.prototype.writeUintLE = g.prototype.writeUIntLE = function(p, A, Y, ye) {
        if (p = +p, A = A >>> 0, Y = Y >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Y) - 1;
          Ue(this, p, A, Y, oe, 0);
        }
        let qe = 1, ae = 0;
        for (this[A] = p & 255; ++ae < Y && (qe *= 256); )
          this[A + ae] = p / qe & 255;
        return A + Y;
      }, g.prototype.writeUintBE = g.prototype.writeUIntBE = function(p, A, Y, ye) {
        if (p = +p, A = A >>> 0, Y = Y >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Y) - 1;
          Ue(this, p, A, Y, oe, 0);
        }
        let qe = Y - 1, ae = 1;
        for (this[A + qe] = p & 255; --qe >= 0 && (ae *= 256); )
          this[A + qe] = p / ae & 255;
        return A + Y;
      }, g.prototype.writeUint8 = g.prototype.writeUInt8 = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 1, 255, 0), this[A] = p & 255, A + 1;
      }, g.prototype.writeUint16LE = g.prototype.writeUInt16LE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 2, 65535, 0), this[A] = p & 255, this[A + 1] = p >>> 8, A + 2;
      }, g.prototype.writeUint16BE = g.prototype.writeUInt16BE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 2, 65535, 0), this[A] = p >>> 8, this[A + 1] = p & 255, A + 2;
      }, g.prototype.writeUint32LE = g.prototype.writeUInt32LE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 4, 4294967295, 0), this[A + 3] = p >>> 24, this[A + 2] = p >>> 16, this[A + 1] = p >>> 8, this[A] = p & 255, A + 4;
      }, g.prototype.writeUint32BE = g.prototype.writeUInt32BE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 4, 4294967295, 0), this[A] = p >>> 24, this[A + 1] = p >>> 16, this[A + 2] = p >>> 8, this[A + 3] = p & 255, A + 4;
      };
      function ge(b, p, A, Y, ye) {
        W(p, Y, ye, b, A, 7);
        let qe = Number(p & BigInt(4294967295));
        b[A++] = qe, qe = qe >> 8, b[A++] = qe, qe = qe >> 8, b[A++] = qe, qe = qe >> 8, b[A++] = qe;
        let ae = Number(p >> BigInt(32) & BigInt(4294967295));
        return b[A++] = ae, ae = ae >> 8, b[A++] = ae, ae = ae >> 8, b[A++] = ae, ae = ae >> 8, b[A++] = ae, A;
      }
      function Se(b, p, A, Y, ye) {
        W(p, Y, ye, b, A, 7);
        let qe = Number(p & BigInt(4294967295));
        b[A + 7] = qe, qe = qe >> 8, b[A + 6] = qe, qe = qe >> 8, b[A + 5] = qe, qe = qe >> 8, b[A + 4] = qe;
        let ae = Number(p >> BigInt(32) & BigInt(4294967295));
        return b[A + 3] = ae, ae = ae >> 8, b[A + 2] = ae, ae = ae >> 8, b[A + 1] = ae, ae = ae >> 8, b[A] = ae, A + 8;
      }
      g.prototype.writeBigUInt64LE = Ze(function(p, A = 0) {
        return ge(this, p, A, BigInt(0), BigInt("0xffffffffffffffff"));
      }), g.prototype.writeBigUInt64BE = Ze(function(p, A = 0) {
        return Se(this, p, A, BigInt(0), BigInt("0xffffffffffffffff"));
      }), g.prototype.writeIntLE = function(p, A, Y, ye) {
        if (p = +p, A = A >>> 0, !ye) {
          const me = Math.pow(2, 8 * Y - 1);
          Ue(this, p, A, Y, me - 1, -me);
        }
        let qe = 0, ae = 1, oe = 0;
        for (this[A] = p & 255; ++qe < Y && (ae *= 256); )
          p < 0 && oe === 0 && this[A + qe - 1] !== 0 && (oe = 1), this[A + qe] = (p / ae >> 0) - oe & 255;
        return A + Y;
      }, g.prototype.writeIntBE = function(p, A, Y, ye) {
        if (p = +p, A = A >>> 0, !ye) {
          const me = Math.pow(2, 8 * Y - 1);
          Ue(this, p, A, Y, me - 1, -me);
        }
        let qe = Y - 1, ae = 1, oe = 0;
        for (this[A + qe] = p & 255; --qe >= 0 && (ae *= 256); )
          p < 0 && oe === 0 && this[A + qe + 1] !== 0 && (oe = 1), this[A + qe] = (p / ae >> 0) - oe & 255;
        return A + Y;
      }, g.prototype.writeInt8 = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 1, 127, -128), p < 0 && (p = 255 + p + 1), this[A] = p & 255, A + 1;
      }, g.prototype.writeInt16LE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 2, 32767, -32768), this[A] = p & 255, this[A + 1] = p >>> 8, A + 2;
      }, g.prototype.writeInt16BE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 2, 32767, -32768), this[A] = p >>> 8, this[A + 1] = p & 255, A + 2;
      }, g.prototype.writeInt32LE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 4, 2147483647, -2147483648), this[A] = p & 255, this[A + 1] = p >>> 8, this[A + 2] = p >>> 16, this[A + 3] = p >>> 24, A + 4;
      }, g.prototype.writeInt32BE = function(p, A, Y) {
        return p = +p, A = A >>> 0, Y || Ue(this, p, A, 4, 2147483647, -2147483648), p < 0 && (p = 4294967295 + p + 1), this[A] = p >>> 24, this[A + 1] = p >>> 16, this[A + 2] = p >>> 8, this[A + 3] = p & 255, A + 4;
      }, g.prototype.writeBigInt64LE = Ze(function(p, A = 0) {
        return ge(this, p, A, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), g.prototype.writeBigInt64BE = Ze(function(p, A = 0) {
        return Se(this, p, A, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function Le(b, p, A, Y, ye, qe) {
        if (A + Y > b.length) throw new RangeError("Index out of range");
        if (A < 0) throw new RangeError("Index out of range");
      }
      function je(b, p, A, Y, ye) {
        return p = +p, A = A >>> 0, ye || Le(b, p, A, 4), I.write(b, p, A, Y, 23, 4), A + 4;
      }
      g.prototype.writeFloatLE = function(p, A, Y) {
        return je(this, p, A, !0, Y);
      }, g.prototype.writeFloatBE = function(p, A, Y) {
        return je(this, p, A, !1, Y);
      };
      function ke(b, p, A, Y, ye) {
        return p = +p, A = A >>> 0, ye || Le(b, p, A, 8), I.write(b, p, A, Y, 52, 8), A + 8;
      }
      g.prototype.writeDoubleLE = function(p, A, Y) {
        return ke(this, p, A, !0, Y);
      }, g.prototype.writeDoubleBE = function(p, A, Y) {
        return ke(this, p, A, !1, Y);
      }, g.prototype.copy = function(p, A, Y, ye) {
        if (!g.isBuffer(p)) throw new TypeError("argument should be a Buffer");
        if (Y || (Y = 0), !ye && ye !== 0 && (ye = this.length), A >= p.length && (A = p.length), A || (A = 0), ye > 0 && ye < Y && (ye = Y), ye === Y || p.length === 0 || this.length === 0) return 0;
        if (A < 0)
          throw new RangeError("targetStart out of bounds");
        if (Y < 0 || Y >= this.length) throw new RangeError("Index out of range");
        if (ye < 0) throw new RangeError("sourceEnd out of bounds");
        ye > this.length && (ye = this.length), p.length - A < ye - Y && (ye = p.length - A + Y);
        const qe = ye - Y;
        return this === p && typeof x.prototype.copyWithin == "function" ? this.copyWithin(A, Y, ye) : x.prototype.set.call(
          p,
          this.subarray(Y, ye),
          A
        ), qe;
      }, g.prototype.fill = function(p, A, Y, ye) {
        if (typeof p == "string") {
          if (typeof A == "string" ? (ye = A, A = 0, Y = this.length) : typeof Y == "string" && (ye = Y, Y = this.length), ye !== void 0 && typeof ye != "string")
            throw new TypeError("encoding must be a string");
          if (typeof ye == "string" && !g.isEncoding(ye))
            throw new TypeError("Unknown encoding: " + ye);
          if (p.length === 1) {
            const ae = p.charCodeAt(0);
            (ye === "utf8" && ae < 128 || ye === "latin1") && (p = ae);
          }
        } else typeof p == "number" ? p = p & 255 : typeof p == "boolean" && (p = Number(p));
        if (A < 0 || this.length < A || this.length < Y)
          throw new RangeError("Out of range index");
        if (Y <= A)
          return this;
        A = A >>> 0, Y = Y === void 0 ? this.length : Y >>> 0, p || (p = 0);
        let qe;
        if (typeof p == "number")
          for (qe = A; qe < Y; ++qe)
            this[qe] = p;
        else {
          const ae = g.isBuffer(p) ? p : g.from(p, ye), oe = ae.length;
          if (oe === 0)
            throw new TypeError('The value "' + p + '" is invalid for argument "value"');
          for (qe = 0; qe < Y - A; ++qe)
            this[qe + A] = ae[qe % oe];
        }
        return this;
      };
      const He = {};
      function U(b, p, A) {
        He[b] = class extends A {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: p.apply(this, arguments),
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
        function(b, p) {
          return `The "${b}" argument must be of type number. Received type ${typeof p}`;
        },
        TypeError
      ), U(
        "ERR_OUT_OF_RANGE",
        function(b, p, A) {
          let Y = `The value of "${b}" is out of range.`, ye = A;
          return Number.isInteger(A) && Math.abs(A) > 2 ** 32 ? ye = s(String(A)) : typeof A == "bigint" && (ye = String(A), (A > BigInt(2) ** BigInt(32) || A < -(BigInt(2) ** BigInt(32))) && (ye = s(ye)), ye += "n"), Y += ` It must be ${p}. Received ${ye}`, Y;
        },
        RangeError
      );
      function s(b) {
        let p = "", A = b.length;
        const Y = b[0] === "-" ? 1 : 0;
        for (; A >= Y + 4; A -= 3)
          p = `_${b.slice(A - 3, A)}${p}`;
        return `${b.slice(0, A)}${p}`;
      }
      function _(b, p, A) {
        ue(p, "offset"), (b[p] === void 0 || b[p + A] === void 0) && J(p, b.length - (A + 1));
      }
      function W(b, p, A, Y, ye, qe) {
        if (b > A || b < p) {
          const ae = typeof p == "bigint" ? "n" : "";
          let oe;
          throw p === 0 || p === BigInt(0) ? oe = `>= 0${ae} and < 2${ae} ** ${(qe + 1) * 8}${ae}` : oe = `>= -(2${ae} ** ${(qe + 1) * 8 - 1}${ae}) and < 2 ** ${(qe + 1) * 8 - 1}${ae}`, new He.ERR_OUT_OF_RANGE("value", oe, b);
        }
        _(Y, ye, qe);
      }
      function ue(b, p) {
        if (typeof b != "number")
          throw new He.ERR_INVALID_ARG_TYPE(p, "number", b);
      }
      function J(b, p, A) {
        throw Math.floor(b) !== b ? (ue(b, A), new He.ERR_OUT_OF_RANGE("offset", "an integer", b)) : p < 0 ? new He.ERR_BUFFER_OUT_OF_BOUNDS() : new He.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${p}`,
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
      function Be(b, p) {
        p = p || 1 / 0;
        let A;
        const Y = b.length;
        let ye = null;
        const qe = [];
        for (let ae = 0; ae < Y; ++ae) {
          if (A = b.charCodeAt(ae), A > 55295 && A < 57344) {
            if (!ye) {
              if (A > 56319) {
                (p -= 3) > -1 && qe.push(239, 191, 189);
                continue;
              } else if (ae + 1 === Y) {
                (p -= 3) > -1 && qe.push(239, 191, 189);
                continue;
              }
              ye = A;
              continue;
            }
            if (A < 56320) {
              (p -= 3) > -1 && qe.push(239, 191, 189), ye = A;
              continue;
            }
            A = (ye - 55296 << 10 | A - 56320) + 65536;
          } else ye && (p -= 3) > -1 && qe.push(239, 191, 189);
          if (ye = null, A < 128) {
            if ((p -= 1) < 0) break;
            qe.push(A);
          } else if (A < 2048) {
            if ((p -= 2) < 0) break;
            qe.push(
              A >> 6 | 192,
              A & 63 | 128
            );
          } else if (A < 65536) {
            if ((p -= 3) < 0) break;
            qe.push(
              A >> 12 | 224,
              A >> 6 & 63 | 128,
              A & 63 | 128
            );
          } else if (A < 1114112) {
            if ((p -= 4) < 0) break;
            qe.push(
              A >> 18 | 240,
              A >> 12 & 63 | 128,
              A >> 6 & 63 | 128,
              A & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return qe;
      }
      function We(b) {
        const p = [];
        for (let A = 0; A < b.length; ++A)
          p.push(b.charCodeAt(A) & 255);
        return p;
      }
      function S(b, p) {
        let A, Y, ye;
        const qe = [];
        for (let ae = 0; ae < b.length && !((p -= 2) < 0); ++ae)
          A = b.charCodeAt(ae), Y = A >> 8, ye = A % 256, qe.push(ye), qe.push(Y);
        return qe;
      }
      function Ie(b) {
        return E.toByteArray(k(b));
      }
      function Fe(b, p, A, Y) {
        let ye;
        for (ye = 0; ye < Y && !(ye + A >= p.length || ye >= b.length); ++ye)
          p[ye + A] = b[ye];
        return ye;
      }
      function G(b, p) {
        return b instanceof p || b != null && b.constructor != null && b.constructor.name != null && b.constructor.name === p.name;
      }
      function _e(b) {
        return b !== b;
      }
      const De = (function() {
        const b = "0123456789abcdef", p = new Array(256);
        for (let A = 0; A < 16; ++A) {
          const Y = A * 16;
          for (let ye = 0; ye < 16; ++ye)
            p[Y + ye] = b[A] + b[ye];
        }
        return p;
      })();
      function Ze(b) {
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
  var t = typeof Reflect == "object" ? Reflect : null, e = t && typeof t.apply == "function" ? t.apply : function(T, $, x) {
    return Function.prototype.apply.call(T, $, x);
  }, n;
  t && typeof t.ownKeys == "function" ? n = t.ownKeys : Object.getOwnPropertySymbols ? n = function(T) {
    return Object.getOwnPropertyNames(T).concat(Object.getOwnPropertySymbols(T));
  } : n = function(T) {
    return Object.getOwnPropertyNames(T);
  };
  function o(I) {
    console && console.warn && console.warn(I);
  }
  var r = Number.isNaN || function(T) {
    return T !== T;
  };
  function a() {
    a.init.call(this);
  }
  events.exports = a, events.exports.once = v, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._eventsCount = 0, a.prototype._maxListeners = void 0;
  var f = 10;
  function l(I) {
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
  }, a.prototype.setMaxListeners = function(T) {
    if (typeof T != "number" || T < 0 || r(T))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + T + ".");
    return this._maxListeners = T, this;
  };
  function c(I) {
    return I._maxListeners === void 0 ? a.defaultMaxListeners : I._maxListeners;
  }
  a.prototype.getMaxListeners = function() {
    return c(this);
  }, a.prototype.emit = function(T) {
    for (var $ = [], x = 1; x < arguments.length; x++) $.push(arguments[x]);
    var j = T === "error", V = this._events;
    if (V !== void 0)
      j = j && V.error === void 0;
    else if (!j)
      return !1;
    if (j) {
      var C;
      if ($.length > 0 && (C = $[0]), C instanceof Error)
        throw C;
      var z = new Error("Unhandled error." + (C ? " (" + C.message + ")" : ""));
      throw z.context = C, z;
    }
    var g = V[T];
    if (g === void 0)
      return !1;
    if (typeof g == "function")
      e(g, this, $);
    else
      for (var D = g.length, ie = h(g, D), x = 0; x < D; ++x)
        e(ie[x], this, $);
    return !0;
  };
  function y(I, T, $, x) {
    var j, V, C;
    if (l($), V = I._events, V === void 0 ? (V = I._events = /* @__PURE__ */ Object.create(null), I._eventsCount = 0) : (V.newListener !== void 0 && (I.emit(
      "newListener",
      T,
      $.listener ? $.listener : $
    ), V = I._events), C = V[T]), C === void 0)
      C = V[T] = $, ++I._eventsCount;
    else if (typeof C == "function" ? C = V[T] = x ? [$, C] : [C, $] : x ? C.unshift($) : C.push($), j = c(I), j > 0 && C.length > j && !C.warned) {
      C.warned = !0;
      var z = new Error("Possible EventEmitter memory leak detected. " + C.length + " " + String(T) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      z.name = "MaxListenersExceededWarning", z.emitter = I, z.type = T, z.count = C.length, o(z);
    }
    return I;
  }
  a.prototype.addListener = function(T, $) {
    return y(this, T, $, !1);
  }, a.prototype.on = a.prototype.addListener, a.prototype.prependListener = function(T, $) {
    return y(this, T, $, !0);
  };
  function u() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function m(I, T, $) {
    var x = { fired: !1, wrapFn: void 0, target: I, type: T, listener: $ }, j = u.bind(x);
    return j.listener = $, x.wrapFn = j, j;
  }
  a.prototype.once = function(T, $) {
    return l($), this.on(T, m(this, T, $)), this;
  }, a.prototype.prependOnceListener = function(T, $) {
    return l($), this.prependListener(T, m(this, T, $)), this;
  }, a.prototype.removeListener = function(T, $) {
    var x, j, V, C, z;
    if (l($), j = this._events, j === void 0)
      return this;
    if (x = j[T], x === void 0)
      return this;
    if (x === $ || x.listener === $)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete j[T], j.removeListener && this.emit("removeListener", T, x.listener || $));
    else if (typeof x != "function") {
      for (V = -1, C = x.length - 1; C >= 0; C--)
        if (x[C] === $ || x[C].listener === $) {
          z = x[C].listener, V = C;
          break;
        }
      if (V < 0)
        return this;
      V === 0 ? x.shift() : q(x, V), x.length === 1 && (j[T] = x[0]), j.removeListener !== void 0 && this.emit("removeListener", T, z || $);
    }
    return this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.removeAllListeners = function(T) {
    var $, x, j;
    if (x = this._events, x === void 0)
      return this;
    if (x.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : x[T] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete x[T]), this;
    if (arguments.length === 0) {
      var V = Object.keys(x), C;
      for (j = 0; j < V.length; ++j)
        C = V[j], C !== "removeListener" && this.removeAllListeners(C);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if ($ = x[T], typeof $ == "function")
      this.removeListener(T, $);
    else if ($ !== void 0)
      for (j = $.length - 1; j >= 0; j--)
        this.removeListener(T, $[j]);
    return this;
  };
  function w(I, T, $) {
    var x = I._events;
    if (x === void 0)
      return [];
    var j = x[T];
    return j === void 0 ? [] : typeof j == "function" ? $ ? [j.listener || j] : [j] : $ ? d(j) : h(j, j.length);
  }
  a.prototype.listeners = function(T) {
    return w(this, T, !0);
  }, a.prototype.rawListeners = function(T) {
    return w(this, T, !1);
  }, a.listenerCount = function(I, T) {
    return typeof I.listenerCount == "function" ? I.listenerCount(T) : R.call(I, T);
  }, a.prototype.listenerCount = R;
  function R(I) {
    var T = this._events;
    if (T !== void 0) {
      var $ = T[I];
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
  function h(I, T) {
    for (var $ = new Array(T), x = 0; x < T; ++x)
      $[x] = I[x];
    return $;
  }
  function q(I, T) {
    for (; T + 1 < I.length; T++)
      I[T] = I[T + 1];
    I.pop();
  }
  function d(I) {
    for (var T = new Array(I.length), $ = 0; $ < T.length; ++$)
      T[$] = I[$].listener || I[$];
    return T;
  }
  function v(I, T) {
    return new Promise(function($, x) {
      function j(C) {
        I.removeListener(T, V), x(C);
      }
      function V() {
        typeof I.removeListener == "function" && I.removeListener("error", j), $([].slice.call(arguments));
      }
      E(I, T, V, { once: !0 }), T !== "error" && P(I, j, { once: !0 });
    });
  }
  function P(I, T, $) {
    typeof I.on == "function" && E(I, "error", T, $);
  }
  function E(I, T, $, x) {
    if (typeof I.on == "function")
      x.once ? I.once(T, $) : I.on(T, $);
    else if (typeof I.addEventListener == "function")
      I.addEventListener(T, function j(V) {
        x.once && I.removeEventListener(T, j), $(V);
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
      var o = function() {
      };
      o.prototype = n.prototype, e.prototype = new o(), e.prototype.constructor = e;
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
    var e = {}, n = Symbol("test"), o = Object(n);
    if (typeof n == "string" || Object.prototype.toString.call(n) !== "[object Symbol]" || Object.prototype.toString.call(o) !== "[object Symbol]")
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
      var l = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, n)
      );
      if (l.value !== r || l.enumerable !== !0)
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
  var t = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, n = Math.max, o = "[object Function]", r = function(c, y) {
    for (var u = [], m = 0; m < c.length; m += 1)
      u[m] = c[m];
    for (var w = 0; w < y.length; w += 1)
      u[w + c.length] = y[w];
    return u;
  }, a = function(c, y) {
    for (var u = [], m = y, w = 0; m < c.length; m += 1, w += 1)
      u[w] = c[m];
    return u;
  }, f = function(l, c) {
    for (var y = "", u = 0; u < l.length; u += 1)
      y += l[u], u + 1 < l.length && (y += c);
    return y;
  };
  return implementation$4 = function(c) {
    var y = this;
    if (typeof y != "function" || e.apply(y) !== o)
      throw new TypeError(t + y);
    for (var u = a(arguments, 1), m, w = function() {
      if (this instanceof m) {
        var v = y.apply(
          this,
          r(u, arguments)
        );
        return Object(v) === v ? v : this;
      }
      return y.apply(
        c,
        r(u, arguments)
      );
    }, R = n(0, y.length - u.length), h = [], q = 0; q < R; q++)
      h[q] = "$" + q;
    if (m = Function("binder", "return function (" + f(h, ",") + "){ return binder.apply(this,arguments); }")(w), y.prototype) {
      var d = function() {
      };
      d.prototype = y.prototype, m.prototype = new d(), d.prototype = null;
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
  var t = requireFunctionBind(), e = requireFunctionApply(), n = requireFunctionCall(), o = requireReflectApply();
  return actualApply = o || t.call(n, e), actualApply;
}
var callBindApplyHelpers, hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var t = requireFunctionBind(), e = /* @__PURE__ */ requireType(), n = requireFunctionCall(), o = requireActualApply();
  return callBindApplyHelpers = function(a) {
    if (a.length < 1 || typeof a[0] != "function")
      throw new e("a function is required");
    return o(t, n, a);
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
  var o = !!n && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), r = Object, a = r.getPrototypeOf;
  return get = o && typeof o.get == "function" ? t([o.get]) : typeof a == "function" ? (
    /** @type {import('./get')} */
    function(l) {
      return a(l == null ? l : r(l));
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
  var t, e = /* @__PURE__ */ requireEsObjectAtoms(), n = /* @__PURE__ */ requireEsErrors(), o = /* @__PURE__ */ require_eval(), r = /* @__PURE__ */ requireRange(), a = /* @__PURE__ */ requireRef$1(), f = /* @__PURE__ */ requireSyntax(), l = /* @__PURE__ */ requireType(), c = /* @__PURE__ */ requireUri(), y = /* @__PURE__ */ requireAbs(), u = /* @__PURE__ */ requireFloor(), m = /* @__PURE__ */ requireMax(), w = /* @__PURE__ */ requireMin(), R = /* @__PURE__ */ requirePow(), h = /* @__PURE__ */ requireRound(), q = /* @__PURE__ */ requireSign(), d = Function, v = function(re) {
    try {
      return d('"use strict"; return (' + re + ").constructor;")();
    } catch {
    }
  }, P = /* @__PURE__ */ requireGopd(), E = /* @__PURE__ */ requireEsDefineProperty(), I = function() {
    throw new l();
  }, T = P ? (function() {
    try {
      return arguments.callee, I;
    } catch {
      try {
        return P(arguments, "callee").get;
      } catch {
        return I;
      }
    }
  })() : I, $ = requireHasSymbols()(), x = requireGetProto(), j = requireObject_getPrototypeOf(), V = requireReflect_getPrototypeOf(), C = requireFunctionApply(), z = requireFunctionCall(), g = {}, D = typeof Uint8Array > "u" || !x ? t : x(Uint8Array), ie = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
    "%ArrayIteratorPrototype%": $ && x ? x([][Symbol.iterator]()) : t,
    "%AsyncFromSyncIteratorPrototype%": t,
    "%AsyncFunction%": g,
    "%AsyncGenerator%": g,
    "%AsyncGeneratorFunction%": g,
    "%AsyncIteratorPrototype%": g,
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
    "%EvalError%": o,
    "%Float16Array%": typeof Float16Array > "u" ? t : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
    "%Function%": d,
    "%GeneratorFunction%": g,
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
    "%ThrowTypeError%": T,
    "%TypedArray%": D,
    "%TypeError%": l,
    "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
    "%URIError%": c,
    "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet,
    "%Function.prototype.call%": z,
    "%Function.prototype.apply%": C,
    "%Object.defineProperty%": E,
    "%Object.getPrototypeOf%": j,
    "%Math.abs%": y,
    "%Math.floor%": u,
    "%Math.max%": m,
    "%Math.min%": w,
    "%Math.pow%": R,
    "%Math.round%": h,
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
  }, ce = requireFunctionBind(), fe = /* @__PURE__ */ requireHasown(), M = ce.call(z, Array.prototype.concat), pe = ce.call(C, Array.prototype.splice), ee = ce.call(z, String.prototype.replace), Q = ce.call(z, String.prototype.slice), Z = ce.call(z, RegExp.prototype.exec), le = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, O = /\\(\\)?/g, B = function(ne) {
    var F = Q(ne, 0, 1), L = Q(ne, -1);
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
      if (se === g && (se = we(L)), typeof se > "u" && !F)
        throw new l("intrinsic " + ne + " exists, but is not available. Please file an issue!");
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
      throw new l("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof F != "boolean")
      throw new l('"allowMissing" argument must be a boolean');
    if (Z(/^%?[^%]*%?$/, ne) === null)
      throw new f("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var L = B(ne), H = L.length > 0 ? L[0] : "", se = N("%" + H + "%", F), Ee = se.name, Re = se.value, Pe = !1, Oe = se.alias;
    Oe && (H = Oe[0], pe(L, M([0, 1], Oe)));
    for (var te = 1, $e = !0; te < L.length; te += 1) {
      var Ce = L[te], Ae = Q(Ce, 0, 1), Ue = Q(Ce, -1);
      if ((Ae === '"' || Ae === "'" || Ae === "`" || Ue === '"' || Ue === "'" || Ue === "`") && Ae !== Ue)
        throw new f("property names with quotes must have matching quotes");
      if ((Ce === "constructor" || !$e) && (Pe = !0), H += "." + Ce, Ee = "%" + H + "%", fe(ie, Ee))
        Re = ie[Ee];
      else if (Re != null) {
        if (!(Ce in Re)) {
          if (!F)
            throw new l("base intrinsic for " + ne + " exists, but the property is not available.");
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
  var t = requireShams()(), e = /* @__PURE__ */ requireCallBound$1(), n = e("Object.prototype.toString"), o = function(l) {
    return t && l && typeof l == "object" && Symbol.toStringTag in l ? !1 : n(l) === "[object Arguments]";
  }, r = function(l) {
    return o(l) ? !0 : l !== null && typeof l == "object" && "length" in l && typeof l.length == "number" && l.length >= 0 && n(l) !== "[object Array]" && "callee" in l && n(l.callee) === "[object Function]";
  }, a = (function() {
    return o(arguments);
  })();
  return o.isLegacyArguments = r, isArguments$1 = a ? o : r, isArguments$1;
}
var isRegex, hasRequiredIsRegex;
function requireIsRegex() {
  if (hasRequiredIsRegex) return isRegex;
  hasRequiredIsRegex = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireShams()(), n = /* @__PURE__ */ requireHasown(), o = /* @__PURE__ */ requireGopd(), r;
  if (e) {
    var a = t("RegExp.prototype.exec"), f = {}, l = function() {
      throw f;
    }, c = {
      toString: l,
      valueOf: l
    };
    typeof Symbol.toPrimitive == "symbol" && (c[Symbol.toPrimitive] = l), r = function(w) {
      if (!w || typeof w != "object")
        return !1;
      var R = (
        /** @type {NonNullable<typeof gOPD>} */
        o(
          /** @type {{ lastIndex?: unknown }} */
          w,
          "lastIndex"
        )
      ), h = R && n(R, "value");
      if (!h)
        return !1;
      try {
        a(
          w,
          /** @type {string} */
          /** @type {unknown} */
          c
        );
      } catch (q) {
        return q === f;
      }
    };
  } else {
    var y = t("Object.prototype.toString"), u = "[object RegExp]";
    r = function(w) {
      return !w || typeof w != "object" && typeof w != "function" ? !1 : y(w) === u;
    };
  }
  return isRegex = r, isRegex;
}
var safeRegexTest, hasRequiredSafeRegexTest;
function requireSafeRegexTest() {
  if (hasRequiredSafeRegexTest) return safeRegexTest;
  hasRequiredSafeRegexTest = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireIsRegex(), n = t("RegExp.prototype.exec"), o = /* @__PURE__ */ requireType();
  return safeRegexTest = function(a) {
    if (!e(a))
      throw new o("`regex` must be a RegExp");
    return function(l) {
      return n(a, l) !== null;
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
  var t = /* @__PURE__ */ requireCallBound$1(), e = /* @__PURE__ */ requireSafeRegexTest(), n = e(/^\s*(?:function)?\*/), o = requireShams()(), r = requireGetProto(), a = t("Object.prototype.toString"), f = t("Function.prototype.toString"), l = /* @__PURE__ */ requireGeneratorFunction();
  return isGeneratorFunction = function(y) {
    if (typeof y != "function")
      return !1;
    if (n(f(y)))
      return !0;
    if (!o) {
      var u = a(y);
      return u === "[object GeneratorFunction]";
    }
    if (!r)
      return !1;
    var m = l();
    return m && r(y) === m.prototype;
  }, isGeneratorFunction;
}
var isCallable, hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var t = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, n, o;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      n = Object.defineProperty({}, "length", {
        get: function() {
          throw o;
        }
      }), o = {}, e(function() {
        throw 42;
      }, null, n);
    } catch (P) {
      P !== o && (e = null);
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
  }, l = Object.prototype.toString, c = "[object Object]", y = "[object Function]", u = "[object GeneratorFunction]", m = "[object HTMLAllCollection]", w = "[object HTML document.all class]", R = "[object HTMLCollection]", h = typeof Symbol == "function" && !!Symbol.toStringTag, q = !(0 in [,]), d = function() {
    return !1;
  };
  if (typeof document == "object") {
    var v = document.all;
    l.call(v) === l.call(document.all) && (d = function(E) {
      if ((q || !E) && (typeof E > "u" || typeof E == "object"))
        try {
          var I = l.call(E);
          return (I === m || I === w || I === R || I === c) && E("") == null;
        } catch {
        }
      return !1;
    });
  }
  return isCallable = e ? function(E) {
    if (d(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    try {
      e(E, null, n);
    } catch (I) {
      if (I !== o)
        return !1;
    }
    return !a(E) && f(E);
  } : function(E) {
    if (d(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    if (h)
      return f(E);
    if (a(E))
      return !1;
    var I = l.call(E);
    return I !== y && I !== u && !/^\[object HTML/.test(I) ? !1 : f(E);
  }, isCallable;
}
var forEach, hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach;
  hasRequiredForEach = 1;
  var t = requireIsCallable(), e = Object.prototype.toString, n = Object.prototype.hasOwnProperty, o = function(c, y, u) {
    for (var m = 0, w = c.length; m < w; m++)
      n.call(c, m) && (u == null ? y(c[m], m, c) : y.call(u, c[m], m, c));
  }, r = function(c, y, u) {
    for (var m = 0, w = c.length; m < w; m++)
      u == null ? y(c.charAt(m), m, c) : y.call(u, c.charAt(m), m, c);
  }, a = function(c, y, u) {
    for (var m in c)
      n.call(c, m) && (u == null ? y(c[m], m, c) : y.call(u, c[m], m, c));
  };
  function f(l) {
    return e.call(l) === "[object Array]";
  }
  return forEach = function(c, y, u) {
    if (!t(y))
      throw new TypeError("iterator must be a function");
    var m;
    arguments.length >= 3 && (m = u), f(c) ? o(c, y, m) : typeof c == "string" ? r(c, y, m) : a(c, y, m);
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
    for (var o = [], r = 0; r < t.length; r++)
      typeof e[t[r]] == "function" && (o[o.length] = t[r]);
    return o;
  }, availableTypedArrays;
}
var callBind = { exports: {} }, defineDataProperty, hasRequiredDefineDataProperty;
function requireDefineDataProperty() {
  if (hasRequiredDefineDataProperty) return defineDataProperty;
  hasRequiredDefineDataProperty = 1;
  var t = /* @__PURE__ */ requireEsDefineProperty(), e = /* @__PURE__ */ requireSyntax(), n = /* @__PURE__ */ requireType(), o = /* @__PURE__ */ requireGopd();
  return defineDataProperty = function(a, f, l) {
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
    var c = arguments.length > 3 ? arguments[3] : null, y = arguments.length > 4 ? arguments[4] : null, u = arguments.length > 5 ? arguments[5] : null, m = arguments.length > 6 ? arguments[6] : !1, w = !!o && o(a, f);
    if (t)
      t(a, f, {
        configurable: u === null && w ? w.configurable : !u,
        enumerable: c === null && w ? w.enumerable : !c,
        value: l,
        writable: y === null && w ? w.writable : !y
      });
    else if (m || !c && !y && !u)
      a[f] = l;
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
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = /* @__PURE__ */ requireDefineDataProperty(), n = /* @__PURE__ */ requireHasPropertyDescriptors()(), o = /* @__PURE__ */ requireGopd(), r = /* @__PURE__ */ requireType(), a = t("%Math.floor%");
  return setFunctionLength = function(l, c) {
    if (typeof l != "function")
      throw new r("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || a(c) !== c)
      throw new r("`length` must be a positive 32-bit integer");
    var y = arguments.length > 2 && !!arguments[2], u = !0, m = !0;
    if ("length" in l && o) {
      var w = o(l, "length");
      w && !w.configurable && (u = !1), w && !w.writable && (m = !1);
    }
    return (u || m || !y) && (n ? e(
      /** @type {Parameters<define>[0]} */
      l,
      "length",
      c,
      !0,
      !0
    ) : e(
      /** @type {Parameters<define>[0]} */
      l,
      "length",
      c
    )), l;
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
    var e = /* @__PURE__ */ requireSetFunctionLength(), n = /* @__PURE__ */ requireEsDefineProperty(), o = requireCallBindApplyHelpers(), r = requireApplyBind();
    t.exports = function(f) {
      var l = o(arguments), c = f.length - (arguments.length - 1);
      return e(
        l,
        1 + (c > 0 ? c : 0),
        !0
      );
    }, n ? n(t.exports, "apply", { value: r }) : t.exports.apply = r;
  })(callBind)), callBind.exports;
}
var whichTypedArray, hasRequiredWhichTypedArray;
function requireWhichTypedArray() {
  if (hasRequiredWhichTypedArray) return whichTypedArray;
  hasRequiredWhichTypedArray = 1;
  var t = requireForEach(), e = /* @__PURE__ */ requireAvailableTypedArrays(), n = requireCallBind(), o = /* @__PURE__ */ requireCallBound$1(), r = /* @__PURE__ */ requireGopd(), a = requireGetProto(), f = o("Object.prototype.toString"), l = requireShams()(), c = typeof globalThis > "u" ? commonjsGlobal : globalThis, y = e(), u = o("String.prototype.slice"), m = o("Array.prototype.indexOf", !0) || function(d, v) {
    for (var P = 0; P < d.length; P += 1)
      if (d[P] === v)
        return P;
    return -1;
  }, w = { __proto__: null };
  l && r && a ? t(y, function(q) {
    var d = new c[q]();
    if (Symbol.toStringTag in d && a) {
      var v = a(d), P = r(v, Symbol.toStringTag);
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
  }) : t(y, function(q) {
    var d = new c[q](), v = d.slice || d.set;
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
  var R = function(d) {
    var v = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      w,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(P, E) {
        if (!v)
          try {
            "$" + P(d) === E && (v = /** @type {import('.').TypedArrayName} */
            u(E, 1));
          } catch {
          }
      }
    ), v;
  }, h = function(d) {
    var v = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      w,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(P, E) {
        if (!v)
          try {
            P(d), v = /** @type {import('.').TypedArrayName} */
            u(E, 1);
          } catch {
          }
      }
    ), v;
  };
  return whichTypedArray = function(d) {
    if (!d || typeof d != "object")
      return !1;
    if (!l) {
      var v = u(f(d), 8, -1);
      return m(y, v) > -1 ? v : v !== "Object" ? !1 : h(d);
    }
    return r ? R(d) : null;
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
    var e = /* @__PURE__ */ requireIsArguments$1(), n = requireIsGeneratorFunction(), o = /* @__PURE__ */ requireWhichTypedArray(), r = /* @__PURE__ */ requireIsTypedArray();
    function a(te) {
      return te.call.bind(te);
    }
    var f = typeof BigInt < "u", l = typeof Symbol < "u", c = a(Object.prototype.toString), y = a(Number.prototype.valueOf), u = a(String.prototype.valueOf), m = a(Boolean.prototype.valueOf);
    if (f)
      var w = a(BigInt.prototype.valueOf);
    if (l)
      var R = a(Symbol.prototype.valueOf);
    function h(te, $e) {
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
    function d(te) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(te) : r(te) || Q(te);
    }
    t.isArrayBufferView = d;
    function v(te) {
      return o(te) === "Uint8Array";
    }
    t.isUint8Array = v;
    function P(te) {
      return o(te) === "Uint8ClampedArray";
    }
    t.isUint8ClampedArray = P;
    function E(te) {
      return o(te) === "Uint16Array";
    }
    t.isUint16Array = E;
    function I(te) {
      return o(te) === "Uint32Array";
    }
    t.isUint32Array = I;
    function T(te) {
      return o(te) === "Int8Array";
    }
    t.isInt8Array = T;
    function $(te) {
      return o(te) === "Int16Array";
    }
    t.isInt16Array = $;
    function x(te) {
      return o(te) === "Int32Array";
    }
    t.isInt32Array = x;
    function j(te) {
      return o(te) === "Float32Array";
    }
    t.isFloat32Array = j;
    function V(te) {
      return o(te) === "Float64Array";
    }
    t.isFloat64Array = V;
    function C(te) {
      return o(te) === "BigInt64Array";
    }
    t.isBigInt64Array = C;
    function z(te) {
      return o(te) === "BigUint64Array";
    }
    t.isBigUint64Array = z;
    function g(te) {
      return c(te) === "[object Map]";
    }
    g.working = typeof Map < "u" && g(/* @__PURE__ */ new Map());
    function D(te) {
      return typeof Map > "u" ? !1 : g.working ? g(te) : te instanceof Map;
    }
    t.isMap = D;
    function ie(te) {
      return c(te) === "[object Set]";
    }
    ie.working = typeof Set < "u" && ie(/* @__PURE__ */ new Set());
    function de(te) {
      return typeof Set > "u" ? !1 : ie.working ? ie(te) : te instanceof Set;
    }
    t.isSet = de;
    function we(te) {
      return c(te) === "[object WeakMap]";
    }
    we.working = typeof WeakMap < "u" && we(/* @__PURE__ */ new WeakMap());
    function be(te) {
      return typeof WeakMap > "u" ? !1 : we.working ? we(te) : te instanceof WeakMap;
    }
    t.isWeakMap = be;
    function ce(te) {
      return c(te) === "[object WeakSet]";
    }
    ce.working = typeof WeakSet < "u" && ce(/* @__PURE__ */ new WeakSet());
    function fe(te) {
      return ce(te);
    }
    t.isWeakSet = fe;
    function M(te) {
      return c(te) === "[object ArrayBuffer]";
    }
    M.working = typeof ArrayBuffer < "u" && M(new ArrayBuffer());
    function pe(te) {
      return typeof ArrayBuffer > "u" ? !1 : M.working ? M(te) : te instanceof ArrayBuffer;
    }
    t.isArrayBuffer = pe;
    function ee(te) {
      return c(te) === "[object DataView]";
    }
    ee.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && ee(new DataView(new ArrayBuffer(1), 0, 1));
    function Q(te) {
      return typeof DataView > "u" ? !1 : ee.working ? ee(te) : te instanceof DataView;
    }
    t.isDataView = Q;
    var Z = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function le(te) {
      return c(te) === "[object SharedArrayBuffer]";
    }
    function O(te) {
      return typeof Z > "u" ? !1 : (typeof le.working > "u" && (le.working = le(new Z())), le.working ? le(te) : te instanceof Z);
    }
    t.isSharedArrayBuffer = O;
    function B(te) {
      return c(te) === "[object AsyncFunction]";
    }
    t.isAsyncFunction = B;
    function N(te) {
      return c(te) === "[object Map Iterator]";
    }
    t.isMapIterator = N;
    function re(te) {
      return c(te) === "[object Set Iterator]";
    }
    t.isSetIterator = re;
    function ne(te) {
      return c(te) === "[object Generator]";
    }
    t.isGeneratorObject = ne;
    function F(te) {
      return c(te) === "[object WebAssembly.Module]";
    }
    t.isWebAssemblyCompiledModule = F;
    function L(te) {
      return h(te, y);
    }
    t.isNumberObject = L;
    function H(te) {
      return h(te, u);
    }
    t.isStringObject = H;
    function se(te) {
      return h(te, m);
    }
    t.isBooleanObject = se;
    function Ee(te) {
      return f && h(te, w);
    }
    t.isBigIntObject = Ee;
    function Re(te) {
      return l && h(te, R);
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
    var e = Object.getOwnPropertyDescriptors || function(Q) {
      for (var Z = Object.keys(Q), le = {}, O = 0; O < Z.length; O++)
        le[Z[O]] = Object.getOwnPropertyDescriptor(Q, Z[O]);
      return le;
    }, n = /%[sdj%]/g;
    t.format = function(ee) {
      if (!T(ee)) {
        for (var Q = [], Z = 0; Z < arguments.length; Z++)
          Q.push(f(arguments[Z]));
        return Q.join(" ");
      }
      for (var Z = 1, le = arguments, O = le.length, B = String(ee).replace(n, function(re) {
        if (re === "%%") return "%";
        if (Z >= O) return re;
        switch (re) {
          case "%s":
            return String(le[Z++]);
          case "%d":
            return Number(le[Z++]);
          case "%j":
            try {
              return JSON.stringify(le[Z++]);
            } catch {
              return "[Circular]";
            }
          default:
            return re;
        }
      }), N = le[Z]; Z < O; N = le[++Z])
        P(N) || !V(N) ? B += " " + N : B += " " + f(N);
      return B;
    }, t.deprecate = function(ee, Q) {
      if (typeof process$1 < "u" && process$1.noDeprecation === !0)
        return ee;
      if (typeof process$1 > "u")
        return function() {
          return t.deprecate(ee, Q).apply(this, arguments);
        };
      var Z = !1;
      function le() {
        if (!Z) {
          if (process$1.throwDeprecation)
            throw new Error(Q);
          process$1.traceDeprecation ? console.trace(Q) : console.error(Q), Z = !0;
        }
        return ee.apply(this, arguments);
      }
      return le;
    };
    var o = {}, r = /^$/;
    if (process$1.env.NODE_DEBUG) {
      var a = process$1.env.NODE_DEBUG;
      a = a.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), r = new RegExp("^" + a + "$", "i");
    }
    t.debuglog = function(ee) {
      if (ee = ee.toUpperCase(), !o[ee])
        if (r.test(ee)) {
          var Q = process$1.pid;
          o[ee] = function() {
            var Z = t.format.apply(t, arguments);
            console.error("%s %d: %s", ee, Q, Z);
          };
        } else
          o[ee] = function() {
          };
      return o[ee];
    };
    function f(ee, Q) {
      var Z = {
        seen: [],
        stylize: c
      };
      return arguments.length >= 3 && (Z.depth = arguments[2]), arguments.length >= 4 && (Z.colors = arguments[3]), v(Q) ? Z.showHidden = Q : Q && t._extend(Z, Q), x(Z.showHidden) && (Z.showHidden = !1), x(Z.depth) && (Z.depth = 2), x(Z.colors) && (Z.colors = !1), x(Z.customInspect) && (Z.customInspect = !0), Z.colors && (Z.stylize = l), u(Z, ee, Z.depth);
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
    function l(ee, Q) {
      var Z = f.styles[Q];
      return Z ? "\x1B[" + f.colors[Z][0] + "m" + ee + "\x1B[" + f.colors[Z][1] + "m" : ee;
    }
    function c(ee, Q) {
      return ee;
    }
    function y(ee) {
      var Q = {};
      return ee.forEach(function(Z, le) {
        Q[Z] = !0;
      }), Q;
    }
    function u(ee, Q, Z) {
      if (ee.customInspect && Q && g(Q.inspect) && // Filter out the util module, it's inspect function is special
      Q.inspect !== t.inspect && // Also filter out any prototype objects using the circular check.
      !(Q.constructor && Q.constructor.prototype === Q)) {
        var le = Q.inspect(Z, ee);
        return T(le) || (le = u(ee, le, Z)), le;
      }
      var O = m(ee, Q);
      if (O)
        return O;
      var B = Object.keys(Q), N = y(B);
      if (ee.showHidden && (B = Object.getOwnPropertyNames(Q)), z(Q) && (B.indexOf("message") >= 0 || B.indexOf("description") >= 0))
        return w(Q);
      if (B.length === 0) {
        if (g(Q)) {
          var re = Q.name ? ": " + Q.name : "";
          return ee.stylize("[Function" + re + "]", "special");
        }
        if (j(Q))
          return ee.stylize(RegExp.prototype.toString.call(Q), "regexp");
        if (C(Q))
          return ee.stylize(Date.prototype.toString.call(Q), "date");
        if (z(Q))
          return w(Q);
      }
      var ne = "", F = !1, L = ["{", "}"];
      if (d(Q) && (F = !0, L = ["[", "]"]), g(Q)) {
        var H = Q.name ? ": " + Q.name : "";
        ne = " [Function" + H + "]";
      }
      if (j(Q) && (ne = " " + RegExp.prototype.toString.call(Q)), C(Q) && (ne = " " + Date.prototype.toUTCString.call(Q)), z(Q) && (ne = " " + w(Q)), B.length === 0 && (!F || Q.length == 0))
        return L[0] + ne + L[1];
      if (Z < 0)
        return j(Q) ? ee.stylize(RegExp.prototype.toString.call(Q), "regexp") : ee.stylize("[Object]", "special");
      ee.seen.push(Q);
      var se;
      return F ? se = R(ee, Q, Z, N, B) : se = B.map(function(Ee) {
        return h(ee, Q, Z, N, Ee, F);
      }), ee.seen.pop(), q(se, ne, L);
    }
    function m(ee, Q) {
      if (x(Q))
        return ee.stylize("undefined", "undefined");
      if (T(Q)) {
        var Z = "'" + JSON.stringify(Q).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ee.stylize(Z, "string");
      }
      if (I(Q))
        return ee.stylize("" + Q, "number");
      if (v(Q))
        return ee.stylize("" + Q, "boolean");
      if (P(Q))
        return ee.stylize("null", "null");
    }
    function w(ee) {
      return "[" + Error.prototype.toString.call(ee) + "]";
    }
    function R(ee, Q, Z, le, O) {
      for (var B = [], N = 0, re = Q.length; N < re; ++N)
        ce(Q, String(N)) ? B.push(h(
          ee,
          Q,
          Z,
          le,
          String(N),
          !0
        )) : B.push("");
      return O.forEach(function(ne) {
        ne.match(/^\d+$/) || B.push(h(
          ee,
          Q,
          Z,
          le,
          ne,
          !0
        ));
      }), B;
    }
    function h(ee, Q, Z, le, O, B) {
      var N, re, ne;
      if (ne = Object.getOwnPropertyDescriptor(Q, O) || { value: Q[O] }, ne.get ? ne.set ? re = ee.stylize("[Getter/Setter]", "special") : re = ee.stylize("[Getter]", "special") : ne.set && (re = ee.stylize("[Setter]", "special")), ce(le, O) || (N = "[" + O + "]"), re || (ee.seen.indexOf(ne.value) < 0 ? (P(Z) ? re = u(ee, ne.value, null) : re = u(ee, ne.value, Z - 1), re.indexOf(`
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
    function q(ee, Q, Z) {
      var le = ee.reduce(function(O, B) {
        return B.indexOf(`
`) >= 0, O + B.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return le > 60 ? Z[0] + (Q === "" ? "" : Q + `
 `) + " " + ee.join(`,
  `) + " " + Z[1] : Z[0] + Q + " " + ee.join(", ") + " " + Z[1];
    }
    t.types = requireTypes();
    function d(ee) {
      return Array.isArray(ee);
    }
    t.isArray = d;
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
    function T(ee) {
      return typeof ee == "string";
    }
    t.isString = T;
    function $(ee) {
      return typeof ee == "symbol";
    }
    t.isSymbol = $;
    function x(ee) {
      return ee === void 0;
    }
    t.isUndefined = x;
    function j(ee) {
      return V(ee) && ie(ee) === "[object RegExp]";
    }
    t.isRegExp = j, t.types.isRegExp = j;
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
    function g(ee) {
      return typeof ee == "function";
    }
    t.isFunction = g;
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
      var ee = /* @__PURE__ */ new Date(), Q = [
        de(ee.getHours()),
        de(ee.getMinutes()),
        de(ee.getSeconds())
      ].join(":");
      return [ee.getDate(), we[ee.getMonth()], Q].join(" ");
    }
    t.log = function() {
      console.log("%s - %s", be(), t.format.apply(t, arguments));
    }, t.inherits = requireInherits_browser(), t._extend = function(ee, Q) {
      if (!Q || !V(Q)) return ee;
      for (var Z = Object.keys(Q), le = Z.length; le--; )
        ee[Z[le]] = Q[Z[le]];
      return ee;
    };
    function ce(ee, Q) {
      return Object.prototype.hasOwnProperty.call(ee, Q);
    }
    var fe = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    t.promisify = function(Q) {
      if (typeof Q != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (fe && Q[fe]) {
        var Z = Q[fe];
        if (typeof Z != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(Z, fe, {
          value: Z,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), Z;
      }
      function Z() {
        for (var le, O, B = new Promise(function(ne, F) {
          le = ne, O = F;
        }), N = [], re = 0; re < arguments.length; re++)
          N.push(arguments[re]);
        N.push(function(ne, F) {
          ne ? O(ne) : le(F);
        });
        try {
          Q.apply(this, N);
        } catch (ne) {
          O(ne);
        }
        return B;
      }
      return Object.setPrototypeOf(Z, Object.getPrototypeOf(Q)), fe && Object.defineProperty(Z, fe, {
        value: Z,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        Z,
        e(Q)
      );
    }, t.promisify.custom = fe;
    function M(ee, Q) {
      if (!ee) {
        var Z = new Error("Promise was rejected with a falsy value");
        Z.reason = ee, ee = Z;
      }
      return Q(ee);
    }
    function pe(ee) {
      if (typeof ee != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function Q() {
        for (var Z = [], le = 0; le < arguments.length; le++)
          Z.push(arguments[le]);
        var O = Z.pop();
        if (typeof O != "function")
          throw new TypeError("The last argument must be of type Function");
        var B = this, N = function() {
          return O.apply(B, arguments);
        };
        ee.apply(this, Z).then(
          function(re) {
            process$1.nextTick(N.bind(null, null, re));
          },
          function(re) {
            process$1.nextTick(M.bind(null, re, N));
          }
        );
      }
      return Object.setPrototypeOf(Q, Object.getPrototypeOf(ee)), Object.defineProperties(
        Q,
        e(ee)
      ), Q;
    }
    t.callbackify = pe;
  })(util$2)), util$2;
}
var buffer_list$1, hasRequiredBuffer_list$1;
function requireBuffer_list$1() {
  if (hasRequiredBuffer_list$1) return buffer_list$1;
  hasRequiredBuffer_list$1 = 1;
  function t(h, q) {
    var d = Object.keys(h);
    if (Object.getOwnPropertySymbols) {
      var v = Object.getOwnPropertySymbols(h);
      q && (v = v.filter(function(P) {
        return Object.getOwnPropertyDescriptor(h, P).enumerable;
      })), d.push.apply(d, v);
    }
    return d;
  }
  function e(h) {
    for (var q = 1; q < arguments.length; q++) {
      var d = arguments[q] != null ? arguments[q] : {};
      q % 2 ? t(Object(d), !0).forEach(function(v) {
        n(h, v, d[v]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(h, Object.getOwnPropertyDescriptors(d)) : t(Object(d)).forEach(function(v) {
        Object.defineProperty(h, v, Object.getOwnPropertyDescriptor(d, v));
      });
    }
    return h;
  }
  function n(h, q, d) {
    return q = f(q), q in h ? Object.defineProperty(h, q, { value: d, enumerable: !0, configurable: !0, writable: !0 }) : h[q] = d, h;
  }
  function o(h, q) {
    if (!(h instanceof q))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(h, q) {
    for (var d = 0; d < q.length; d++) {
      var v = q[d];
      v.enumerable = v.enumerable || !1, v.configurable = !0, "value" in v && (v.writable = !0), Object.defineProperty(h, f(v.key), v);
    }
  }
  function a(h, q, d) {
    return q && r(h.prototype, q), Object.defineProperty(h, "prototype", { writable: !1 }), h;
  }
  function f(h) {
    var q = l(h, "string");
    return typeof q == "symbol" ? q : String(q);
  }
  function l(h, q) {
    if (typeof h != "object" || h === null) return h;
    var d = h[Symbol.toPrimitive];
    if (d !== void 0) {
      var v = d.call(h, q);
      if (typeof v != "object") return v;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(h);
  }
  var c = requireDist(), y = c.Buffer, u = requireUtil$2(), m = u.inspect, w = m && m.custom || "inspect";
  function R(h, q, d) {
    y.prototype.copy.call(h, q, d);
  }
  return buffer_list$1 = /* @__PURE__ */ (function() {
    function h() {
      o(this, h), this.head = null, this.tail = null, this.length = 0;
    }
    return a(h, [{
      key: "push",
      value: function(d) {
        var v = {
          data: d,
          next: null
        };
        this.length > 0 ? this.tail.next = v : this.head = v, this.tail = v, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(d) {
        var v = {
          data: d,
          next: this.head
        };
        this.length === 0 && (this.tail = v), this.head = v, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var d = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, d;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(d) {
        if (this.length === 0) return "";
        for (var v = this.head, P = "" + v.data; v = v.next; ) P += d + v.data;
        return P;
      }
    }, {
      key: "concat",
      value: function(d) {
        if (this.length === 0) return y.alloc(0);
        for (var v = y.allocUnsafe(d >>> 0), P = this.head, E = 0; P; )
          R(P.data, v, E), E += P.data.length, P = P.next;
        return v;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(d, v) {
        var P;
        return d < this.head.data.length ? (P = this.head.data.slice(0, d), this.head.data = this.head.data.slice(d)) : d === this.head.data.length ? P = this.shift() : P = v ? this._getString(d) : this._getBuffer(d), P;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(d) {
        var v = this.head, P = 1, E = v.data;
        for (d -= E.length; v = v.next; ) {
          var I = v.data, T = d > I.length ? I.length : d;
          if (T === I.length ? E += I : E += I.slice(0, d), d -= T, d === 0) {
            T === I.length ? (++P, v.next ? this.head = v.next : this.head = this.tail = null) : (this.head = v, v.data = I.slice(T));
            break;
          }
          ++P;
        }
        return this.length -= P, E;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(d) {
        var v = y.allocUnsafe(d), P = this.head, E = 1;
        for (P.data.copy(v), d -= P.data.length; P = P.next; ) {
          var I = P.data, T = d > I.length ? I.length : d;
          if (I.copy(v, v.length - d, 0, T), d -= T, d === 0) {
            T === I.length ? (++E, P.next ? this.head = P.next : this.head = this.tail = null) : (this.head = P, P.data = I.slice(T));
            break;
          }
          ++E;
        }
        return this.length -= E, v;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: w,
      value: function(d, v) {
        return m(this, e(e({}, v), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), h;
  })(), buffer_list$1;
}
var destroy_1$1, hasRequiredDestroy$1;
function requireDestroy$1() {
  if (hasRequiredDestroy$1) return destroy_1$1;
  hasRequiredDestroy$1 = 1;
  function t(f, l) {
    var c = this, y = this._readableState && this._readableState.destroyed, u = this._writableState && this._writableState.destroyed;
    return y || u ? (l ? l(f) : f && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process$1.nextTick(r, this, f)) : process$1.nextTick(r, this, f)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(f || null, function(m) {
      !l && m ? c._writableState ? c._writableState.errorEmitted ? process$1.nextTick(n, c) : (c._writableState.errorEmitted = !0, process$1.nextTick(e, c, m)) : process$1.nextTick(e, c, m) : l ? (process$1.nextTick(n, c), l(m)) : process$1.nextTick(n, c);
    }), this);
  }
  function e(f, l) {
    r(f, l), n(f);
  }
  function n(f) {
    f._writableState && !f._writableState.emitClose || f._readableState && !f._readableState.emitClose || f.emit("close");
  }
  function o() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function r(f, l) {
    f.emit("error", l);
  }
  function a(f, l) {
    var c = f._readableState, y = f._writableState;
    c && c.autoDestroy || y && y.autoDestroy ? f.destroy(l) : f.emit("error", l);
  }
  return destroy_1$1 = {
    destroy: t,
    undestroy: o,
    errorOrDestroy: a
  }, destroy_1$1;
}
var errorsBrowser = {}, hasRequiredErrorsBrowser;
function requireErrorsBrowser() {
  if (hasRequiredErrorsBrowser) return errorsBrowser;
  hasRequiredErrorsBrowser = 1;
  function t(l, c) {
    l.prototype = Object.create(c.prototype), l.prototype.constructor = l, l.__proto__ = c;
  }
  var e = {};
  function n(l, c, y) {
    y || (y = Error);
    function u(w, R, h) {
      return typeof c == "string" ? c : c(w, R, h);
    }
    var m = /* @__PURE__ */ (function(w) {
      t(R, w);
      function R(h, q, d) {
        return w.call(this, u(h, q, d)) || this;
      }
      return R;
    })(y);
    m.prototype.name = y.name, m.prototype.code = l, e[l] = m;
  }
  function o(l, c) {
    if (Array.isArray(l)) {
      var y = l.length;
      return l = l.map(function(u) {
        return String(u);
      }), y > 2 ? "one of ".concat(c, " ").concat(l.slice(0, y - 1).join(", "), ", or ") + l[y - 1] : y === 2 ? "one of ".concat(c, " ").concat(l[0], " or ").concat(l[1]) : "of ".concat(c, " ").concat(l[0]);
    } else
      return "of ".concat(c, " ").concat(String(l));
  }
  function r(l, c, y) {
    return l.substr(0, c.length) === c;
  }
  function a(l, c, y) {
    return (y === void 0 || y > l.length) && (y = l.length), l.substring(y - c.length, y) === c;
  }
  function f(l, c, y) {
    return typeof y != "number" && (y = 0), y + c.length > l.length ? !1 : l.indexOf(c, y) !== -1;
  }
  return n("ERR_INVALID_OPT_VALUE", function(l, c) {
    return 'The value "' + c + '" is invalid for option "' + l + '"';
  }, TypeError), n("ERR_INVALID_ARG_TYPE", function(l, c, y) {
    var u;
    typeof c == "string" && r(c, "not ") ? (u = "must not be", c = c.replace(/^not /, "")) : u = "must be";
    var m;
    if (a(l, " argument"))
      m = "The ".concat(l, " ").concat(u, " ").concat(o(c, "type"));
    else {
      var w = f(l, ".") ? "property" : "argument";
      m = 'The "'.concat(l, '" ').concat(w, " ").concat(u, " ").concat(o(c, "type"));
    }
    return m += ". Received type ".concat(typeof y), m;
  }, TypeError), n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), n("ERR_METHOD_NOT_IMPLEMENTED", function(l) {
    return "The " + l + " method is not implemented";
  }), n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), n("ERR_STREAM_DESTROYED", function(l) {
    return "Cannot call " + l + " after a stream was destroyed";
  }), n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), n("ERR_STREAM_WRITE_AFTER_END", "write after end"), n("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), n("ERR_UNKNOWN_ENCODING", function(l) {
    return "Unknown encoding: " + l;
  }, TypeError), n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), errorsBrowser.codes = e, errorsBrowser;
}
var state$1, hasRequiredState$1;
function requireState$1() {
  if (hasRequiredState$1) return state$1;
  hasRequiredState$1 = 1;
  var t = requireErrorsBrowser().codes.ERR_INVALID_OPT_VALUE;
  function e(o, r, a) {
    return o.highWaterMark != null ? o.highWaterMark : r ? o[a] : null;
  }
  function n(o, r, a, f) {
    var l = e(r, f, a);
    if (l != null) {
      if (!(isFinite(l) && Math.floor(l) === l) || l < 0) {
        var c = f ? a : "highWaterMark";
        throw new t(c, l);
      }
      return Math.floor(l);
    }
    return o.objectMode ? 16 : 16 * 1024;
  }
  return state$1 = {
    getHighWaterMark: n
  }, state$1;
}
var browser$3, hasRequiredBrowser$3;
function requireBrowser$3() {
  if (hasRequiredBrowser$3) return browser$3;
  hasRequiredBrowser$3 = 1, browser$3 = t;
  function t(n, o) {
    if (e("noDeprecation"))
      return n;
    var r = !1;
    function a() {
      if (!r) {
        if (e("throwDeprecation"))
          throw new Error(o);
        e("traceDeprecation") ? console.trace(o) : console.warn(o), r = !0;
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
    var o = commonjsGlobal.localStorage[n];
    return o == null ? !1 : String(o).toLowerCase() === "true";
  }
  return browser$3;
}
var _stream_writable, hasRequired_stream_writable;
function require_stream_writable() {
  if (hasRequired_stream_writable) return _stream_writable;
  hasRequired_stream_writable = 1, _stream_writable = j;
  function t(O) {
    var B = this;
    this.next = null, this.entry = null, this.finish = function() {
      le(B, O);
    };
  }
  var e;
  j.WritableState = $;
  var n = {
    deprecate: requireBrowser$3()
  }, o = requireStreamBrowser(), r = requireDist().Buffer, a = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function f(O) {
    return r.from(O);
  }
  function l(O) {
    return r.isBuffer(O) || O instanceof a;
  }
  var c = requireDestroy$1(), y = requireState$1(), u = y.getHighWaterMark, m = requireErrorsBrowser().codes, w = m.ERR_INVALID_ARG_TYPE, R = m.ERR_METHOD_NOT_IMPLEMENTED, h = m.ERR_MULTIPLE_CALLBACK, q = m.ERR_STREAM_CANNOT_PIPE, d = m.ERR_STREAM_DESTROYED, v = m.ERR_STREAM_NULL_VALUES, P = m.ERR_STREAM_WRITE_AFTER_END, E = m.ERR_UNKNOWN_ENCODING, I = c.errorOrDestroy;
  requireInherits_browser()(j, o);
  function T() {
  }
  function $(O, B, N) {
    e = e || require_stream_duplex(), O = O || {}, typeof N != "boolean" && (N = B instanceof e), this.objectMode = !!O.objectMode, N && (this.objectMode = this.objectMode || !!O.writableObjectMode), this.highWaterMark = u(this, O, "writableHighWaterMark", N), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
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
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (x = Function.prototype[Symbol.hasInstance], Object.defineProperty(j, Symbol.hasInstance, {
    value: function(B) {
      return x.call(this, B) ? !0 : this !== j ? !1 : B && B._writableState instanceof $;
    }
  })) : x = function(B) {
    return B instanceof this;
  };
  function j(O) {
    e = e || require_stream_duplex();
    var B = this instanceof e;
    if (!B && !x.call(j, this)) return new j(O);
    this._writableState = new $(O, this, B), this.writable = !0, O && (typeof O.write == "function" && (this._write = O.write), typeof O.writev == "function" && (this._writev = O.writev), typeof O.destroy == "function" && (this._destroy = O.destroy), typeof O.final == "function" && (this._final = O.final)), o.call(this);
  }
  j.prototype.pipe = function() {
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
  j.prototype.write = function(O, B, N) {
    var re = this._writableState, ne = !1, F = !re.objectMode && l(O);
    return F && !r.isBuffer(O) && (O = f(O)), typeof B == "function" && (N = B, B = null), F ? B = "buffer" : B || (B = re.defaultEncoding), typeof N != "function" && (N = T), re.ending ? V(this, N) : (F || C(this, re, O, N)) && (re.pendingcb++, ne = g(this, re, F, O, B, N)), ne;
  }, j.prototype.cork = function() {
    this._writableState.corked++;
  }, j.prototype.uncork = function() {
    var O = this._writableState;
    O.corked && (O.corked--, !O.writing && !O.corked && !O.bufferProcessing && O.bufferedRequest && fe(this, O));
  }, j.prototype.setDefaultEncoding = function(B) {
    if (typeof B == "string" && (B = B.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((B + "").toLowerCase()) > -1)) throw new E(B);
    return this._writableState.defaultEncoding = B, this;
  }, Object.defineProperty(j.prototype, "writableBuffer", {
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
  Object.defineProperty(j.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function g(O, B, N, re, ne, F) {
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
    B.writelen = re, B.writecb = L, B.writing = !0, B.sync = !0, B.destroyed ? B.onwrite(new d("write")) : N ? O._writev(ne, B.onwrite) : O._write(ne, F, B.onwrite), B.sync = !1;
  }
  function ie(O, B, N, re, ne) {
    --B.pendingcb, N ? (process$1.nextTick(ne, re), process$1.nextTick(Q, O, B), O._writableState.errorEmitted = !0, I(O, re)) : (ne(re), O._writableState.errorEmitted = !0, I(O, re), Q(O, B));
  }
  function de(O) {
    O.writing = !1, O.writecb = null, O.length -= O.writelen, O.writelen = 0;
  }
  function we(O, B) {
    var N = O._writableState, re = N.sync, ne = N.writecb;
    if (typeof ne != "function") throw new h();
    if (de(N), B) ie(O, N, re, B, ne);
    else {
      var F = M(N) || O.destroyed;
      !F && !N.corked && !N.bufferProcessing && N.bufferedRequest && fe(O, N), re ? process$1.nextTick(be, O, N, F, ne) : be(O, N, F, ne);
    }
  }
  function be(O, B, N, re) {
    N || ce(O, B), B.pendingcb--, re(), Q(O, B);
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
  j.prototype._write = function(O, B, N) {
    N(new R("_write()"));
  }, j.prototype._writev = null, j.prototype.end = function(O, B, N) {
    var re = this._writableState;
    return typeof O == "function" ? (N = O, O = null, B = null) : typeof B == "function" && (N = B, B = null), O != null && this.write(O, B), re.corked && (re.corked = 1, this.uncork()), re.ending || Z(this, re, N), this;
  }, Object.defineProperty(j.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function M(O) {
    return O.ending && O.length === 0 && O.bufferedRequest === null && !O.finished && !O.writing;
  }
  function pe(O, B) {
    O._final(function(N) {
      B.pendingcb--, N && I(O, N), B.prefinished = !0, O.emit("prefinish"), Q(O, B);
    });
  }
  function ee(O, B) {
    !B.prefinished && !B.finalCalled && (typeof O._final == "function" && !B.destroyed ? (B.pendingcb++, B.finalCalled = !0, process$1.nextTick(pe, O, B)) : (B.prefinished = !0, O.emit("prefinish")));
  }
  function Q(O, B) {
    var N = M(B);
    if (N && (ee(O, B), B.pendingcb === 0 && (B.finished = !0, O.emit("finish"), B.autoDestroy))) {
      var re = O._readableState;
      (!re || re.autoDestroy && re.endEmitted) && O.destroy();
    }
    return N;
  }
  function Z(O, B, N) {
    B.ending = !0, Q(O, B), N && (B.finished ? process$1.nextTick(N) : O.once("finish", N)), B.ended = !0, O.writable = !1;
  }
  function le(O, B, N) {
    var re = O.entry;
    for (O.entry = null; re; ) {
      var ne = re.callback;
      B.pendingcb--, ne(N), re = re.next;
    }
    B.corkedRequestsFree.next = O;
  }
  return Object.defineProperty(j.prototype, "destroyed", {
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
  }), j.prototype.destroy = c.destroy, j.prototype._undestroy = c.undestroy, j.prototype._destroy = function(O, B) {
    B(O);
  }, _stream_writable;
}
var _stream_duplex, hasRequired_stream_duplex;
function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex;
  hasRequired_stream_duplex = 1;
  var t = Object.keys || function(y) {
    var u = [];
    for (var m in y) u.push(m);
    return u;
  };
  _stream_duplex = f;
  var e = require_stream_readable(), n = require_stream_writable();
  requireInherits_browser()(f, e);
  for (var o = t(n.prototype), r = 0; r < o.length; r++) {
    var a = o[r];
    f.prototype[a] || (f.prototype[a] = n.prototype[a]);
  }
  function f(y) {
    if (!(this instanceof f)) return new f(y);
    e.call(this, y), n.call(this, y), this.allowHalfOpen = !0, y && (y.readable === !1 && (this.readable = !1), y.writable === !1 && (this.writable = !1), y.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", l)));
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
  function l() {
    this._writableState.ended || process$1.nextTick(c, this);
  }
  function c(y) {
    y.end();
  }
  return Object.defineProperty(f.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(u) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = u, this._writableState.destroyed = u);
    }
  }), _stream_duplex;
}
var string_decoder = {}, safeBuffer = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  return hasRequiredSafeBuffer || (hasRequiredSafeBuffer = 1, (function(t, e) {
    var n = requireDist(), o = n.Buffer;
    function r(f, l) {
      for (var c in f)
        l[c] = f[c];
    }
    o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? t.exports = n : (r(n, e), e.Buffer = a);
    function a(f, l, c) {
      return o(f, l, c);
    }
    a.prototype = Object.create(o.prototype), r(o, a), a.from = function(f, l, c) {
      if (typeof f == "number")
        throw new TypeError("Argument must not be a number");
      return o(f, l, c);
    }, a.alloc = function(f, l, c) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      var y = o(f);
      return l !== void 0 ? typeof c == "string" ? y.fill(l, c) : y.fill(l) : y.fill(0), y;
    }, a.allocUnsafe = function(f) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      return o(f);
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
  function o(v) {
    var P = n(v);
    if (typeof P != "string" && (t.isEncoding === e || !e(v))) throw new Error("Unknown encoding: " + v);
    return P || v;
  }
  string_decoder.StringDecoder = r;
  function r(v) {
    this.encoding = o(v);
    var P;
    switch (this.encoding) {
      case "utf16le":
        this.text = m, this.end = w, P = 4;
        break;
      case "utf8":
        this.fillLast = c, P = 4;
        break;
      case "base64":
        this.text = R, this.end = h, P = 3;
        break;
      default:
        this.write = q, this.end = d;
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
  }, r.prototype.end = u, r.prototype.text = y, r.prototype.fillLast = function(v) {
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
    var T = a(P[I]);
    return T >= 0 ? (T > 0 && (v.lastNeed = T - 1), T) : --I < E || T === -2 ? 0 : (T = a(P[I]), T >= 0 ? (T > 0 && (v.lastNeed = T - 2), T) : --I < E || T === -2 ? 0 : (T = a(P[I]), T >= 0 ? (T > 0 && (T === 2 ? T = 0 : v.lastNeed = T - 3), T) : 0));
  }
  function l(v, P, E) {
    if ((P[0] & 192) !== 128)
      return v.lastNeed = 0, "�";
    if (v.lastNeed > 1 && P.length > 1) {
      if ((P[1] & 192) !== 128)
        return v.lastNeed = 1, "�";
      if (v.lastNeed > 2 && P.length > 2 && (P[2] & 192) !== 128)
        return v.lastNeed = 2, "�";
    }
  }
  function c(v) {
    var P = this.lastTotal - this.lastNeed, E = l(this, v);
    if (E !== void 0) return E;
    if (this.lastNeed <= v.length)
      return v.copy(this.lastChar, P, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    v.copy(this.lastChar, P, 0, v.length), this.lastNeed -= v.length;
  }
  function y(v, P) {
    var E = f(this, v, P);
    if (!this.lastNeed) return v.toString("utf8", P);
    this.lastTotal = E;
    var I = v.length - (E - this.lastNeed);
    return v.copy(this.lastChar, 0, I), v.toString("utf8", P, I);
  }
  function u(v) {
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
  function h(v) {
    var P = v && v.length ? this.write(v) : "";
    return this.lastNeed ? P + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : P;
  }
  function q(v) {
    return v.toString(this.encoding);
  }
  function d(v) {
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
        for (var l = arguments.length, c = new Array(l), y = 0; y < l; y++)
          c[y] = arguments[y];
        a.apply(this, c);
      }
    };
  }
  function n() {
  }
  function o(a) {
    return a.setHeader && typeof a.abort == "function";
  }
  function r(a, f, l) {
    if (typeof f == "function") return r(a, null, f);
    f || (f = {}), l = e(l || n);
    var c = f.readable || f.readable !== !1 && a.readable, y = f.writable || f.writable !== !1 && a.writable, u = function() {
      a.writable || w();
    }, m = a._writableState && a._writableState.finished, w = function() {
      y = !1, m = !0, c || l.call(a);
    }, R = a._readableState && a._readableState.endEmitted, h = function() {
      c = !1, R = !0, y || l.call(a);
    }, q = function(E) {
      l.call(a, E);
    }, d = function() {
      var E;
      if (c && !R)
        return (!a._readableState || !a._readableState.ended) && (E = new t()), l.call(a, E);
      if (y && !m)
        return (!a._writableState || !a._writableState.ended) && (E = new t()), l.call(a, E);
    }, v = function() {
      a.req.on("finish", w);
    };
    return o(a) ? (a.on("complete", w), a.on("abort", d), a.req ? v() : a.on("request", v)) : y && !a._writableState && (a.on("end", u), a.on("close", u)), a.on("end", h), a.on("finish", w), f.error !== !1 && a.on("error", q), a.on("close", d), function() {
      a.removeListener("complete", w), a.removeListener("abort", d), a.removeListener("request", v), a.req && a.req.removeListener("finish", w), a.removeListener("end", u), a.removeListener("close", u), a.removeListener("finish", w), a.removeListener("end", h), a.removeListener("error", q), a.removeListener("close", d);
    };
  }
  return endOfStream$1 = r, endOfStream$1;
}
var async_iterator, hasRequiredAsync_iterator;
function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator;
  hasRequiredAsync_iterator = 1;
  var t;
  function e(E, I, T) {
    return I = n(I), I in E ? Object.defineProperty(E, I, { value: T, enumerable: !0, configurable: !0, writable: !0 }) : E[I] = T, E;
  }
  function n(E) {
    var I = o(E, "string");
    return typeof I == "symbol" ? I : String(I);
  }
  function o(E, I) {
    if (typeof E != "object" || E === null) return E;
    var T = E[Symbol.toPrimitive];
    if (T !== void 0) {
      var $ = T.call(E, I);
      if (typeof $ != "object") return $;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (I === "string" ? String : Number)(E);
  }
  var r = requireEndOfStream$1(), a = Symbol("lastResolve"), f = Symbol("lastReject"), l = Symbol("error"), c = Symbol("ended"), y = Symbol("lastPromise"), u = Symbol("handlePromise"), m = Symbol("stream");
  function w(E, I) {
    return {
      value: E,
      done: I
    };
  }
  function R(E) {
    var I = E[a];
    if (I !== null) {
      var T = E[m].read();
      T !== null && (E[y] = null, E[a] = null, E[f] = null, I(w(T, !1)));
    }
  }
  function h(E) {
    process$1.nextTick(R, E);
  }
  function q(E, I) {
    return function(T, $) {
      E.then(function() {
        if (I[c]) {
          T(w(void 0, !0));
          return;
        }
        I[u](T, $);
      }, $);
    };
  }
  var d = Object.getPrototypeOf(function() {
  }), v = Object.setPrototypeOf((t = {
    get stream() {
      return this[m];
    },
    next: function() {
      var I = this, T = this[l];
      if (T !== null)
        return Promise.reject(T);
      if (this[c])
        return Promise.resolve(w(void 0, !0));
      if (this[m].destroyed)
        return new Promise(function(V, C) {
          process$1.nextTick(function() {
            I[l] ? C(I[l]) : V(w(void 0, !0));
          });
        });
      var $ = this[y], x;
      if ($)
        x = new Promise(q($, this));
      else {
        var j = this[m].read();
        if (j !== null)
          return Promise.resolve(w(j, !1));
        x = new Promise(this[u]);
      }
      return this[y] = x, x;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var I = this;
    return new Promise(function(T, $) {
      I[m].destroy(null, function(x) {
        if (x) {
          $(x);
          return;
        }
        T(w(void 0, !0));
      });
    });
  }), t), d), P = function(I) {
    var T, $ = Object.create(v, (T = {}, e(T, m, {
      value: I,
      writable: !0
    }), e(T, a, {
      value: null,
      writable: !0
    }), e(T, f, {
      value: null,
      writable: !0
    }), e(T, l, {
      value: null,
      writable: !0
    }), e(T, c, {
      value: I._readableState.endEmitted,
      writable: !0
    }), e(T, u, {
      value: function(j, V) {
        var C = $[m].read();
        C ? ($[y] = null, $[a] = null, $[f] = null, j(w(C, !1))) : ($[a] = j, $[f] = V);
      },
      writable: !0
    }), T));
    return $[y] = null, r(I, function(x) {
      if (x && x.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var j = $[f];
        j !== null && ($[y] = null, $[a] = null, $[f] = null, j(x)), $[l] = x;
        return;
      }
      var V = $[a];
      V !== null && ($[y] = null, $[a] = null, $[f] = null, V(w(void 0, !0))), $[c] = !0;
    }), I.on("readable", h.bind(null, $)), $;
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
  V.ReadableState = j, requireEvents().EventEmitter;
  var e = function(L, H) {
    return L.listeners(H).length;
  }, n = requireStreamBrowser(), o = requireDist().Buffer, r = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function a(F) {
    return o.from(F);
  }
  function f(F) {
    return o.isBuffer(F) || F instanceof r;
  }
  var l = requireUtil$2(), c;
  l && l.debuglog ? c = l.debuglog("stream") : c = function() {
  };
  var y = requireBuffer_list$1(), u = requireDestroy$1(), m = requireState$1(), w = m.getHighWaterMark, R = requireErrorsBrowser().codes, h = R.ERR_INVALID_ARG_TYPE, q = R.ERR_STREAM_PUSH_AFTER_EOF, d = R.ERR_METHOD_NOT_IMPLEMENTED, v = R.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, P, E, I;
  requireInherits_browser()(V, n);
  var T = u.errorOrDestroy, $ = ["error", "close", "destroy", "pause", "resume"];
  function x(F, L, H) {
    if (typeof F.prependListener == "function") return F.prependListener(L, H);
    !F._events || !F._events[L] ? F.on(L, H) : Array.isArray(F._events[L]) ? F._events[L].unshift(H) : F._events[L] = [H, F._events[L]];
  }
  function j(F, L, H) {
    t = t || require_stream_duplex(), F = F || {}, typeof H != "boolean" && (H = L instanceof t), this.objectMode = !!F.objectMode, H && (this.objectMode = this.objectMode || !!F.readableObjectMode), this.highWaterMark = w(this, F, "readableHighWaterMark", H), this.buffer = new y(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = F.emitClose !== !1, this.autoDestroy = !!F.autoDestroy, this.destroyed = !1, this.defaultEncoding = F.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, F.encoding && (P || (P = requireString_decoder().StringDecoder), this.decoder = new P(F.encoding), this.encoding = F.encoding);
  }
  function V(F) {
    if (t = t || require_stream_duplex(), !(this instanceof V)) return new V(F);
    var L = this instanceof t;
    this._readableState = new j(F, this, L), this.readable = !0, F && (typeof F.read == "function" && (this._read = F.read), typeof F.destroy == "function" && (this._destroy = F.destroy)), n.call(this);
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
  }), V.prototype.destroy = u.destroy, V.prototype._undestroy = u.undestroy, V.prototype._destroy = function(F, L) {
    L(F);
  }, V.prototype.push = function(F, L) {
    var H = this._readableState, se;
    return H.objectMode ? se = !0 : typeof F == "string" && (L = L || H.defaultEncoding, L !== H.encoding && (F = o.from(F, L), L = ""), se = !0), C(this, F, L, !1, se);
  }, V.prototype.unshift = function(F) {
    return C(this, F, null, !0, !1);
  };
  function C(F, L, H, se, Ee) {
    c("readableAddChunk", L);
    var Re = F._readableState;
    if (L === null)
      Re.reading = !1, we(F, Re);
    else {
      var Pe;
      if (Ee || (Pe = g(Re, L)), Pe)
        T(F, Pe);
      else if (Re.objectMode || L && L.length > 0)
        if (typeof L != "string" && !Re.objectMode && Object.getPrototypeOf(L) !== o.prototype && (L = a(L)), se)
          Re.endEmitted ? T(F, new v()) : z(F, Re, L, !0);
        else if (Re.ended)
          T(F, new q());
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
  function g(F, L) {
    var H;
    return !f(L) && typeof L != "string" && L !== void 0 && !F.objectMode && (H = new h("chunk", ["string", "Buffer", "Uint8Array"], L)), H;
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
    c("read", F), F = parseInt(F, 10);
    var L = this._readableState, H = F;
    if (F !== 0 && (L.emittedReadable = !1), F === 0 && L.needReadable && ((L.highWaterMark !== 0 ? L.length >= L.highWaterMark : L.length > 0) || L.ended))
      return c("read: emitReadable", L.length, L.ended), L.length === 0 && L.ended ? N(this) : be(this), null;
    if (F = de(F, L), F === 0 && L.ended)
      return L.length === 0 && N(this), null;
    var se = L.needReadable;
    c("need readable", se), (L.length === 0 || L.length - F < L.highWaterMark) && (se = !0, c("length less than watermark", se)), L.ended || L.reading ? (se = !1, c("reading or ended", se)) : se && (c("do read"), L.reading = !0, L.sync = !0, L.length === 0 && (L.needReadable = !0), this._read(L.highWaterMark), L.sync = !1, L.reading || (F = de(H, L)));
    var Ee;
    return F > 0 ? Ee = B(F, L) : Ee = null, Ee === null ? (L.needReadable = L.length <= L.highWaterMark, F = 0) : (L.length -= F, L.awaitDrain = 0), L.length === 0 && (L.ended || (L.needReadable = !0), H !== F && L.ended && N(this)), Ee !== null && this.emit("data", Ee), Ee;
  };
  function we(F, L) {
    if (c("onEofChunk"), !L.ended) {
      if (L.decoder) {
        var H = L.decoder.end();
        H && H.length && (L.buffer.push(H), L.length += L.objectMode ? 1 : H.length);
      }
      L.ended = !0, L.sync ? be(F) : (L.needReadable = !1, L.emittedReadable || (L.emittedReadable = !0, ce(F)));
    }
  }
  function be(F) {
    var L = F._readableState;
    c("emitReadable", L.needReadable, L.emittedReadable), L.needReadable = !1, L.emittedReadable || (c("emitReadable", L.flowing), L.emittedReadable = !0, process$1.nextTick(ce, F));
  }
  function ce(F) {
    var L = F._readableState;
    c("emitReadable_", L.destroyed, L.length, L.ended), !L.destroyed && (L.length || L.ended) && (F.emit("readable"), L.emittedReadable = !1), L.needReadable = !L.flowing && !L.ended && L.length <= L.highWaterMark, O(F);
  }
  function fe(F, L) {
    L.readingMore || (L.readingMore = !0, process$1.nextTick(M, F, L));
  }
  function M(F, L) {
    for (; !L.reading && !L.ended && (L.length < L.highWaterMark || L.flowing && L.length === 0); ) {
      var H = L.length;
      if (c("maybeReadMore read 0"), F.read(0), H === L.length)
        break;
    }
    L.readingMore = !1;
  }
  V.prototype._read = function(F) {
    T(this, new d("_read()"));
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
    se.pipesCount += 1, c("pipe count=%d opts=%j", se.pipesCount, L);
    var Ee = (!L || L.end !== !1) && F !== process$1.stdout && F !== process$1.stderr, Re = Ee ? Oe : Le;
    se.endEmitted ? process$1.nextTick(Re) : H.once("end", Re), F.on("unpipe", Pe);
    function Pe(je, ke) {
      c("onunpipe"), je === H && ke && ke.hasUnpiped === !1 && (ke.hasUnpiped = !0, Ce());
    }
    function Oe() {
      c("onend"), F.end();
    }
    var te = pe(H);
    F.on("drain", te);
    var $e = !1;
    function Ce() {
      c("cleanup"), F.removeListener("close", ge), F.removeListener("finish", Se), F.removeListener("drain", te), F.removeListener("error", Ue), F.removeListener("unpipe", Pe), H.removeListener("end", Oe), H.removeListener("end", Le), H.removeListener("data", Ae), $e = !0, se.awaitDrain && (!F._writableState || F._writableState.needDrain) && te();
    }
    H.on("data", Ae);
    function Ae(je) {
      c("ondata");
      var ke = F.write(je);
      c("dest.write", ke), ke === !1 && ((se.pipesCount === 1 && se.pipes === F || se.pipesCount > 1 && ne(se.pipes, F) !== -1) && !$e && (c("false write response, pause", se.awaitDrain), se.awaitDrain++), H.pause());
    }
    function Ue(je) {
      c("onerror", je), Le(), F.removeListener("error", Ue), e(F, "error") === 0 && T(F, je);
    }
    x(F, "error", Ue);
    function ge() {
      F.removeListener("finish", Se), Le();
    }
    F.once("close", ge);
    function Se() {
      c("onfinish"), F.removeListener("close", ge), Le();
    }
    F.once("finish", Se);
    function Le() {
      c("unpipe"), H.unpipe(F);
    }
    return F.emit("pipe", H), se.flowing || (c("pipe resume"), H.resume()), F;
  };
  function pe(F) {
    return function() {
      var H = F._readableState;
      c("pipeOnDrain", H.awaitDrain), H.awaitDrain && H.awaitDrain--, H.awaitDrain === 0 && e(F, "data") && (H.flowing = !0, O(F));
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
    return F === "data" ? (se.readableListening = this.listenerCount("readable") > 0, se.flowing !== !1 && this.resume()) : F === "readable" && !se.endEmitted && !se.readableListening && (se.readableListening = se.needReadable = !0, se.flowing = !1, se.emittedReadable = !1, c("on readable", se.length, se.reading), se.length ? be(this) : se.reading || process$1.nextTick(Q, this)), H;
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
  function Q(F) {
    c("readable nexttick read 0"), F.read(0);
  }
  V.prototype.resume = function() {
    var F = this._readableState;
    return F.flowing || (c("resume"), F.flowing = !F.readableListening, Z(this, F)), F.paused = !1, this;
  };
  function Z(F, L) {
    L.resumeScheduled || (L.resumeScheduled = !0, process$1.nextTick(le, F, L));
  }
  function le(F, L) {
    c("resume", L.reading), L.reading || F.read(0), L.resumeScheduled = !1, F.emit("resume"), O(F), L.flowing && !L.reading && F.read(0);
  }
  V.prototype.pause = function() {
    return c("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (c("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function O(F) {
    var L = F._readableState;
    for (c("flow", L.flowing); L.flowing && F.read() !== null; ) ;
  }
  V.prototype.wrap = function(F) {
    var L = this, H = this._readableState, se = !1;
    F.on("end", function() {
      if (c("wrapped end"), H.decoder && !H.ended) {
        var Pe = H.decoder.end();
        Pe && Pe.length && L.push(Pe);
      }
      L.push(null);
    }), F.on("data", function(Pe) {
      if (c("wrapped data"), H.decoder && (Pe = H.decoder.write(Pe)), !(H.objectMode && Pe == null) && !(!H.objectMode && (!Pe || !Pe.length))) {
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
      c("wrapped _read", Pe), se && (se = !1, F.resume());
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
    c("endReadable", L.endEmitted), L.endEmitted || (L.ended = !0, process$1.nextTick(re, L, F));
  }
  function re(F, L) {
    if (c("endReadableNT", F.endEmitted, F.length), !F.endEmitted && F.length === 0 && (F.endEmitted = !0, L.readable = !1, L.emit("end"), F.autoDestroy)) {
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
  hasRequired_stream_transform = 1, _stream_transform = l;
  var t = requireErrorsBrowser().codes, e = t.ERR_METHOD_NOT_IMPLEMENTED, n = t.ERR_MULTIPLE_CALLBACK, o = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, r = t.ERR_TRANSFORM_WITH_LENGTH_0, a = require_stream_duplex();
  requireInherits_browser()(l, a);
  function f(u, m) {
    var w = this._transformState;
    w.transforming = !1;
    var R = w.writecb;
    if (R === null)
      return this.emit("error", new n());
    w.writechunk = null, w.writecb = null, m != null && this.push(m), R(u);
    var h = this._readableState;
    h.reading = !1, (h.needReadable || h.length < h.highWaterMark) && this._read(h.highWaterMark);
  }
  function l(u) {
    if (!(this instanceof l)) return new l(u);
    a.call(this, u), this._transformState = {
      afterTransform: f.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, u && (typeof u.transform == "function" && (this._transform = u.transform), typeof u.flush == "function" && (this._flush = u.flush)), this.on("prefinish", c);
  }
  function c() {
    var u = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(m, w) {
      y(u, m, w);
    }) : y(this, null, null);
  }
  l.prototype.push = function(u, m) {
    return this._transformState.needTransform = !1, a.prototype.push.call(this, u, m);
  }, l.prototype._transform = function(u, m, w) {
    w(new e("_transform()"));
  }, l.prototype._write = function(u, m, w) {
    var R = this._transformState;
    if (R.writecb = w, R.writechunk = u, R.writeencoding = m, !R.transforming) {
      var h = this._readableState;
      (R.needTransform || h.needReadable || h.length < h.highWaterMark) && this._read(h.highWaterMark);
    }
  }, l.prototype._read = function(u) {
    var m = this._transformState;
    m.writechunk !== null && !m.transforming ? (m.transforming = !0, this._transform(m.writechunk, m.writeencoding, m.afterTransform)) : m.needTransform = !0;
  }, l.prototype._destroy = function(u, m) {
    a.prototype._destroy.call(this, u, function(w) {
      m(w);
    });
  };
  function y(u, m, w) {
    if (m) return u.emit("error", m);
    if (w != null && u.push(w), u._writableState.length) throw new r();
    if (u._transformState.transforming) throw new o();
    return u.push(null);
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
  return e.prototype._transform = function(n, o, r) {
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
  var n = requireErrorsBrowser().codes, o = n.ERR_MISSING_ARGS, r = n.ERR_STREAM_DESTROYED;
  function a(w) {
    if (w) throw w;
  }
  function f(w) {
    return w.setHeader && typeof w.abort == "function";
  }
  function l(w, R, h, q) {
    q = e(q);
    var d = !1;
    w.on("close", function() {
      d = !0;
    }), t === void 0 && (t = requireEndOfStream$1()), t(w, {
      readable: R,
      writable: h
    }, function(P) {
      if (P) return q(P);
      d = !0, q();
    });
    var v = !1;
    return function(P) {
      if (!d && !v) {
        if (v = !0, f(w)) return w.abort();
        if (typeof w.destroy == "function") return w.destroy();
        q(P || new r("pipe"));
      }
    };
  }
  function c(w) {
    w();
  }
  function y(w, R) {
    return w.pipe(R);
  }
  function u(w) {
    return !w.length || typeof w[w.length - 1] != "function" ? a : w.pop();
  }
  function m() {
    for (var w = arguments.length, R = new Array(w), h = 0; h < w; h++)
      R[h] = arguments[h];
    var q = u(R);
    if (Array.isArray(R[0]) && (R = R[0]), R.length < 2)
      throw new o("streams");
    var d, v = R.map(function(P, E) {
      var I = E < R.length - 1, T = E > 0;
      return l(P, I, T, function($) {
        d || (d = $), $ && v.forEach(c), !I && (v.forEach(c), q(d));
      });
    });
    return R.reduce(y);
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
  return n.prototype.pipe = function(o, r) {
    var a = this;
    function f(R) {
      o.writable && o.write(R) === !1 && a.pause && a.pause();
    }
    a.on("data", f);
    function l() {
      a.readable && a.resume && a.resume();
    }
    o.on("drain", l), !o._isStdio && (!r || r.end !== !1) && (a.on("end", y), a.on("close", u));
    var c = !1;
    function y() {
      c || (c = !0, o.end());
    }
    function u() {
      c || (c = !0, typeof o.destroy == "function" && o.destroy());
    }
    function m(R) {
      if (w(), t.listenerCount(this, "error") === 0)
        throw R;
    }
    a.on("error", m), o.on("error", m);
    function w() {
      a.removeListener("data", f), o.removeListener("drain", l), a.removeListener("end", y), a.removeListener("close", u), a.removeListener("error", m), o.removeListener("error", m), a.removeListener("end", w), a.removeListener("close", w), o.removeListener("close", w);
    }
    return a.on("end", w), a.on("close", w), o.on("close", w), o.emit("pipe", a), o;
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
  function o(P, E) {
    if (typeof E != "function" && E !== null)
      throw new TypeError("Super expression must either be null or a function");
    P.prototype = Object.create(E && E.prototype, { constructor: { value: P, writable: !0, configurable: !0 } }), Object.defineProperty(P, "prototype", { writable: !1 }), E && r(P, E);
  }
  function r(P, E) {
    return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(T, $) {
      return T.__proto__ = $, T;
    }, r(P, E);
  }
  function a(P) {
    var E = c();
    return function() {
      var T = y(P), $;
      if (E) {
        var x = y(this).constructor;
        $ = Reflect.construct(T, arguments, x);
      } else
        $ = T.apply(this, arguments);
      return f(this, $);
    };
  }
  function f(P, E) {
    if (E && (t(E) === "object" || typeof E == "function"))
      return E;
    if (E !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return l(P);
  }
  function l(P) {
    if (P === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return P;
  }
  function c() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function y(P) {
    return y = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(I) {
      return I.__proto__ || Object.getPrototypeOf(I);
    }, y(P);
  }
  var u = {}, m, w;
  function R(P, E, I) {
    I || (I = Error);
    function T(x, j, V) {
      return typeof E == "string" ? E : E(x, j, V);
    }
    var $ = /* @__PURE__ */ (function(x) {
      o(V, x);
      var j = a(V);
      function V(C, z, g) {
        var D;
        return n(this, V), D = j.call(this, T(C, z, g)), D.code = P, D;
      }
      return e(V);
    })(I);
    u[P] = $;
  }
  function h(P, E) {
    if (Array.isArray(P)) {
      var I = P.length;
      return P = P.map(function(T) {
        return String(T);
      }), I > 2 ? "one of ".concat(E, " ").concat(P.slice(0, I - 1).join(", "), ", or ") + P[I - 1] : I === 2 ? "one of ".concat(E, " ").concat(P[0], " or ").concat(P[1]) : "of ".concat(E, " ").concat(P[0]);
    } else
      return "of ".concat(E, " ").concat(String(P));
  }
  function q(P, E, I) {
    return P.substr(0, E.length) === E;
  }
  function d(P, E, I) {
    return (I === void 0 || I > P.length) && (I = P.length), P.substring(I - E.length, I) === E;
  }
  function v(P, E, I) {
    return typeof I != "number" && (I = 0), I + E.length > P.length ? !1 : P.indexOf(E, I) !== -1;
  }
  return R("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), R("ERR_INVALID_ARG_TYPE", function(P, E, I) {
    m === void 0 && (m = requireAssert()), m(typeof P == "string", "'name' must be a string");
    var T;
    typeof E == "string" && q(E, "not ") ? (T = "must not be", E = E.replace(/^not /, "")) : T = "must be";
    var $;
    if (d(P, " argument"))
      $ = "The ".concat(P, " ").concat(T, " ").concat(h(E, "type"));
    else {
      var x = v(P, ".") ? "property" : "argument";
      $ = 'The "'.concat(P, '" ').concat(x, " ").concat(T, " ").concat(h(E, "type"));
    }
    return $ += ". Received type ".concat(t(I)), $;
  }, TypeError), R("ERR_INVALID_ARG_VALUE", function(P, E) {
    var I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
    w === void 0 && (w = requireUtil$2());
    var T = w.inspect(E);
    return T.length > 128 && (T = "".concat(T.slice(0, 128), "...")), "The argument '".concat(P, "' ").concat(I, ". Received ").concat(T);
  }, TypeError), R("ERR_INVALID_RETURN_VALUE", function(P, E, I) {
    var T;
    return I && I.constructor && I.constructor.name ? T = "instance of ".concat(I.constructor.name) : T = "type ".concat(t(I)), "Expected ".concat(P, ' to be returned from the "').concat(E, '"') + " function but got ".concat(T, ".");
  }, TypeError), R("ERR_MISSING_ARGS", function() {
    for (var P = arguments.length, E = new Array(P), I = 0; I < P; I++)
      E[I] = arguments[I];
    m === void 0 && (m = requireAssert()), m(E.length > 0, "At least one arg needs to be specified");
    var T = "The ", $ = E.length;
    switch (E = E.map(function(x) {
      return '"'.concat(x, '"');
    }), $) {
      case 1:
        T += "".concat(E[0], " argument");
        break;
      case 2:
        T += "".concat(E[0], " and ").concat(E[1], " arguments");
        break;
      default:
        T += E.slice(0, $ - 1).join(", "), T += ", and ".concat(E[$ - 1], " arguments");
        break;
    }
    return "".concat(T, " must be specified");
  }, TypeError), errors$1.codes = u, errors$1;
}
var assertion_error, hasRequiredAssertion_error;
function requireAssertion_error() {
  if (hasRequiredAssertion_error) return assertion_error;
  hasRequiredAssertion_error = 1;
  function t(fe, M) {
    var pe = Object.keys(fe);
    if (Object.getOwnPropertySymbols) {
      var ee = Object.getOwnPropertySymbols(fe);
      M && (ee = ee.filter(function(Q) {
        return Object.getOwnPropertyDescriptor(fe, Q).enumerable;
      })), pe.push.apply(pe, ee);
    }
    return pe;
  }
  function e(fe) {
    for (var M = 1; M < arguments.length; M++) {
      var pe = arguments[M] != null ? arguments[M] : {};
      M % 2 ? t(Object(pe), !0).forEach(function(ee) {
        n(fe, ee, pe[ee]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(fe, Object.getOwnPropertyDescriptors(pe)) : t(Object(pe)).forEach(function(ee) {
        Object.defineProperty(fe, ee, Object.getOwnPropertyDescriptor(pe, ee));
      });
    }
    return fe;
  }
  function n(fe, M, pe) {
    return M = f(M), M in fe ? Object.defineProperty(fe, M, { value: pe, enumerable: !0, configurable: !0, writable: !0 }) : fe[M] = pe, fe;
  }
  function o(fe, M) {
    if (!(fe instanceof M))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(fe, M) {
    for (var pe = 0; pe < M.length; pe++) {
      var ee = M[pe];
      ee.enumerable = ee.enumerable || !1, ee.configurable = !0, "value" in ee && (ee.writable = !0), Object.defineProperty(fe, f(ee.key), ee);
    }
  }
  function a(fe, M, pe) {
    return M && r(fe.prototype, M), Object.defineProperty(fe, "prototype", { writable: !1 }), fe;
  }
  function f(fe) {
    var M = l(fe, "string");
    return P(M) === "symbol" ? M : String(M);
  }
  function l(fe, M) {
    if (P(fe) !== "object" || fe === null) return fe;
    var pe = fe[Symbol.toPrimitive];
    if (pe !== void 0) {
      var ee = pe.call(fe, M);
      if (P(ee) !== "object") return ee;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(fe);
  }
  function c(fe, M) {
    if (typeof M != "function" && M !== null)
      throw new TypeError("Super expression must either be null or a function");
    fe.prototype = Object.create(M && M.prototype, { constructor: { value: fe, writable: !0, configurable: !0 } }), Object.defineProperty(fe, "prototype", { writable: !1 }), M && d(fe, M);
  }
  function y(fe) {
    var M = h();
    return function() {
      var ee = v(fe), Q;
      if (M) {
        var Z = v(this).constructor;
        Q = Reflect.construct(ee, arguments, Z);
      } else
        Q = ee.apply(this, arguments);
      return u(this, Q);
    };
  }
  function u(fe, M) {
    if (M && (P(M) === "object" || typeof M == "function"))
      return M;
    if (M !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return m(fe);
  }
  function m(fe) {
    if (fe === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return fe;
  }
  function w(fe) {
    var M = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return w = function(ee) {
      if (ee === null || !q(ee)) return ee;
      if (typeof ee != "function")
        throw new TypeError("Super expression must either be null or a function");
      if (typeof M < "u") {
        if (M.has(ee)) return M.get(ee);
        M.set(ee, Q);
      }
      function Q() {
        return R(ee, arguments, v(this).constructor);
      }
      return Q.prototype = Object.create(ee.prototype, { constructor: { value: Q, enumerable: !1, writable: !0, configurable: !0 } }), d(Q, ee);
    }, w(fe);
  }
  function R(fe, M, pe) {
    return h() ? R = Reflect.construct.bind() : R = function(Q, Z, le) {
      var O = [null];
      O.push.apply(O, Z);
      var B = Function.bind.apply(Q, O), N = new B();
      return le && d(N, le.prototype), N;
    }, R.apply(null, arguments);
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
  function q(fe) {
    return Function.toString.call(fe).indexOf("[native code]") !== -1;
  }
  function d(fe, M) {
    return d = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ee, Q) {
      return ee.__proto__ = Q, ee;
    }, d(fe, M);
  }
  function v(fe) {
    return v = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(pe) {
      return pe.__proto__ || Object.getPrototypeOf(pe);
    }, v(fe);
  }
  function P(fe) {
    "@babel/helpers - typeof";
    return P = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(M) {
      return typeof M;
    } : function(M) {
      return M && typeof Symbol == "function" && M.constructor === Symbol && M !== Symbol.prototype ? "symbol" : typeof M;
    }, P(fe);
  }
  var E = requireUtil$2(), I = E.inspect, T = requireErrors$1(), $ = T.codes.ERR_INVALID_ARG_TYPE;
  function x(fe, M, pe) {
    return (pe === void 0 || pe > fe.length) && (pe = fe.length), fe.substring(pe - M.length, pe) === M;
  }
  function j(fe, M) {
    if (M = Math.floor(M), fe.length == 0 || M == 0) return "";
    var pe = fe.length * M;
    for (M = Math.floor(Math.log(M) / Math.log(2)); M; )
      fe += fe, M--;
    return fe += fe.substring(0, pe - fe.length), fe;
  }
  var V = "", C = "", z = "", g = "", D = {
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
    var M = Object.keys(fe), pe = Object.create(Object.getPrototypeOf(fe));
    return M.forEach(function(ee) {
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
  function be(fe, M, pe) {
    var ee = "", Q = "", Z = 0, le = "", O = !1, B = we(fe), N = B.split(`
`), re = we(M).split(`
`), ne = 0, F = "";
    if (pe === "strictEqual" && P(fe) === "object" && P(M) === "object" && fe !== null && M !== null && (pe = "strictEqualObject"), N.length === 1 && re.length === 1 && N[0] !== re[0]) {
      var L = N[0].length + re[0].length;
      if (L <= ie) {
        if ((P(fe) !== "object" || fe === null) && (P(M) !== "object" || M === null) && (fe !== 0 || M !== 0))
          return "".concat(D[pe], `

`) + "".concat(N[0], " !== ").concat(re[0], `
`);
      } else if (pe !== "strictEqualObject") {
        var H = process$1.stderr && process$1.stderr.isTTY ? process$1.stderr.columns : 80;
        if (L < H) {
          for (; N[0][ne] === re[0][ne]; )
            ne++;
          ne > 2 && (F = `
  `.concat(j(" ", ne), "^"), ne = 0);
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
        for (Pe[26] = "".concat(V, "...").concat(g); Pe.length > 27; )
          Pe.pop();
      return "".concat(D.notIdentical, `

`).concat(Pe.join(`
`), `
`);
    }
    ne > 3 && (le = `
`.concat(V, "...").concat(g).concat(le), O = !0), ee !== "" && (le = `
  `.concat(ee).concat(le), ee = "");
    var Oe = 0, te = D[pe] + `
`.concat(C, "+ actual").concat(g, " ").concat(z, "- expected").concat(g), $e = " ".concat(V, "...").concat(g, " Lines skipped");
    for (ne = 0; ne < Re; ne++) {
      var Ce = ne - Z;
      if (N.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (Q += `
`.concat(V, "...").concat(g), O = !0) : Ce > 3 && (Q += `
  `.concat(re[ne - 2]), Oe++), Q += `
  `.concat(re[ne - 1]), Oe++), Z = ne, ee += `
`.concat(z, "-").concat(g, " ").concat(re[ne]), Oe++;
      else if (re.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (Q += `
`.concat(V, "...").concat(g), O = !0) : Ce > 3 && (Q += `
  `.concat(N[ne - 2]), Oe++), Q += `
  `.concat(N[ne - 1]), Oe++), Z = ne, Q += `
`.concat(C, "+").concat(g, " ").concat(N[ne]), Oe++;
      else {
        var Ae = re[ne], Ue = N[ne], ge = Ue !== Ae && (!x(Ue, ",") || Ue.slice(0, -1) !== Ae);
        ge && x(Ae, ",") && Ae.slice(0, -1) === Ue && (ge = !1, Ue += ","), ge ? (Ce > 1 && ne > 2 && (Ce > 4 ? (Q += `
`.concat(V, "...").concat(g), O = !0) : Ce > 3 && (Q += `
  `.concat(N[ne - 2]), Oe++), Q += `
  `.concat(N[ne - 1]), Oe++), Z = ne, Q += `
`.concat(C, "+").concat(g, " ").concat(Ue), ee += `
`.concat(z, "-").concat(g, " ").concat(Ae), Oe += 2) : (Q += ee, ee = "", (Ce === 1 || ne === 0) && (Q += `
  `.concat(Ue), Oe++));
      }
      if (Oe > 20 && ne < Re - 2)
        return "".concat(te).concat($e, `
`).concat(Q, `
`).concat(V, "...").concat(g).concat(ee, `
`) + "".concat(V, "...").concat(g);
    }
    return "".concat(te).concat(O ? $e : "", `
`).concat(Q).concat(ee).concat(le).concat(F);
  }
  var ce = /* @__PURE__ */ (function(fe, M) {
    c(ee, fe);
    var pe = y(ee);
    function ee(Q) {
      var Z;
      if (o(this, ee), P(Q) !== "object" || Q === null)
        throw new $("options", "Object", Q);
      var le = Q.message, O = Q.operator, B = Q.stackStartFn, N = Q.actual, re = Q.expected, ne = Error.stackTraceLimit;
      if (Error.stackTraceLimit = 0, le != null)
        Z = pe.call(this, String(le));
      else if (process$1.stderr && process$1.stderr.isTTY && (process$1.stderr && process$1.stderr.getColorDepth && process$1.stderr.getColorDepth() !== 1 ? (V = "\x1B[34m", C = "\x1B[32m", g = "\x1B[39m", z = "\x1B[31m") : (V = "", C = "", g = "", z = "")), P(N) === "object" && N !== null && P(re) === "object" && re !== null && "stack" in N && N instanceof Error && "stack" in re && re instanceof Error && (N = de(N), re = de(re)), O === "deepStrictEqual" || O === "strictEqual")
        Z = pe.call(this, be(N, re, O));
      else if (O === "notDeepStrictEqual" || O === "notStrictEqual") {
        var F = D[O], L = we(N).split(`
`);
        if (O === "notStrictEqual" && P(N) === "object" && N !== null && (F = D.notStrictEqualObject), L.length > 30)
          for (L[26] = "".concat(V, "...").concat(g); L.length > 27; )
            L.pop();
        L.length === 1 ? Z = pe.call(this, "".concat(F, " ").concat(L[0])) : Z = pe.call(this, "".concat(F, `

`).concat(L.join(`
`), `
`));
      } else {
        var H = we(N), se = "", Ee = D[O];
        O === "notDeepEqual" || O === "notEqual" ? (H = "".concat(D[O], `

`).concat(H), H.length > 1024 && (H = "".concat(H.slice(0, 1021), "..."))) : (se = "".concat(we(re)), H.length > 512 && (H = "".concat(H.slice(0, 509), "...")), se.length > 512 && (se = "".concat(se.slice(0, 509), "...")), O === "deepEqual" || O === "equal" ? H = "".concat(Ee, `

`).concat(H, `

should equal

`) : se = " ".concat(O, " ").concat(se)), Z = pe.call(this, "".concat(H).concat(se));
      }
      return Error.stackTraceLimit = ne, Z.generatedMessage = !le, Object.defineProperty(m(Z), "name", {
        value: "AssertionError [ERR_ASSERTION]",
        enumerable: !1,
        writable: !0,
        configurable: !0
      }), Z.code = "ERR_ASSERTION", Z.actual = N, Z.expected = re, Z.operator = O, Error.captureStackTrace && Error.captureStackTrace(m(Z), B), Z.stack, Z.name = "AssertionError", u(Z);
    }
    return a(ee, [{
      key: "toString",
      value: function() {
        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
      }
    }, {
      key: M,
      value: function(Z, le) {
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
    var o = t.call(n), r = o === "[object Arguments]";
    return r || (r = o !== "[object Array]" && n !== null && typeof n == "object" && typeof n.length == "number" && n.length >= 0 && t.call(n.callee) === "[object Function]"), r;
  }, isArguments;
}
var implementation$3, hasRequiredImplementation$3;
function requireImplementation$3() {
  if (hasRequiredImplementation$3) return implementation$3;
  hasRequiredImplementation$3 = 1;
  var t;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, n = Object.prototype.toString, o = requireIsArguments(), r = Object.prototype.propertyIsEnumerable, a = !r.call({ toString: null }, "toString"), f = r.call(function() {
    }, "prototype"), l = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], c = function(w) {
      var R = w.constructor;
      return R && R.prototype === w;
    }, y = {
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
    }, u = (function() {
      if (typeof window > "u")
        return !1;
      for (var w in window)
        try {
          if (!y["$" + w] && e.call(window, w) && window[w] !== null && typeof window[w] == "object")
            try {
              c(window[w]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), m = function(w) {
      if (typeof window > "u" || !u)
        return c(w);
      try {
        return c(w);
      } catch {
        return !1;
      }
    };
    t = function(R) {
      var h = R !== null && typeof R == "object", q = n.call(R) === "[object Function]", d = o(R), v = h && n.call(R) === "[object String]", P = [];
      if (!h && !q && !d)
        throw new TypeError("Object.keys called on a non-object");
      var E = f && q;
      if (v && R.length > 0 && !e.call(R, 0))
        for (var I = 0; I < R.length; ++I)
          P.push(String(I));
      if (d && R.length > 0)
        for (var T = 0; T < R.length; ++T)
          P.push(String(T));
      else
        for (var $ in R)
          !(E && $ === "prototype") && e.call(R, $) && P.push(String($));
      if (a)
        for (var x = m(R), j = 0; j < l.length; ++j)
          !(x && l[j] === "constructor") && e.call(R, l[j]) && P.push(l[j]);
      return P;
    };
  }
  return implementation$3 = t, implementation$3;
}
var objectKeys, hasRequiredObjectKeys;
function requireObjectKeys() {
  if (hasRequiredObjectKeys) return objectKeys;
  hasRequiredObjectKeys = 1;
  var t = Array.prototype.slice, e = requireIsArguments(), n = Object.keys, o = n ? function(f) {
    return n(f);
  } : requireImplementation$3(), r = Object.keys;
  return o.shim = function() {
    if (Object.keys) {
      var f = (function() {
        var l = Object.keys(arguments);
        return l && l.length === arguments.length;
      })(1, 2);
      f || (Object.keys = function(c) {
        return e(c) ? r(t.call(c)) : r(c);
      });
    } else
      Object.keys = o;
    return Object.keys || o;
  }, objectKeys = o, objectKeys;
}
var implementation$2, hasRequiredImplementation$2;
function requireImplementation$2() {
  if (hasRequiredImplementation$2) return implementation$2;
  hasRequiredImplementation$2 = 1;
  var t = requireObjectKeys(), e = requireShams$1()(), n = /* @__PURE__ */ requireCallBound$1(), o = /* @__PURE__ */ requireEsObjectAtoms(), r = n("Array.prototype.push"), a = n("Object.prototype.propertyIsEnumerable"), f = e ? o.getOwnPropertySymbols : null;
  return implementation$2 = function(c, y) {
    if (c == null)
      throw new TypeError("target must be an object");
    var u = o(c);
    if (arguments.length === 1)
      return u;
    for (var m = 1; m < arguments.length; ++m) {
      var w = o(arguments[m]), R = t(w), h = e && (o.getOwnPropertySymbols || f);
      if (h)
        for (var q = h(w), d = 0; d < q.length; ++d) {
          var v = q[d];
          a(w, v) && r(R, v);
        }
      for (var P = 0; P < R.length; ++P) {
        var E = R[P];
        if (a(w, E)) {
          var I = w[E];
          u[E] = I;
        }
      }
    }
    return u;
  }, implementation$2;
}
var polyfill$2, hasRequiredPolyfill$2;
function requirePolyfill$2() {
  if (hasRequiredPolyfill$2) return polyfill$2;
  hasRequiredPolyfill$2 = 1;
  var t = requireImplementation$2(), e = function() {
    if (!Object.assign)
      return !1;
    for (var o = "abcdefghijklmnopqrst", r = o.split(""), a = {}, f = 0; f < r.length; ++f)
      a[r[f]] = r[f];
    var l = Object.assign({}, a), c = "";
    for (var y in l)
      c += y;
    return o !== c;
  }, n = function() {
    if (!Object.assign || !Object.preventExtensions)
      return !1;
    var o = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(o, "xy");
    } catch {
      return o[1] === "y";
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
  return implementation$1 = function(n, o) {
    return n === 0 && o === 0 ? 1 / n === 1 / o : !!(n === o || t(n) && t(o));
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
  var t = requireObjectKeys(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", n = Object.prototype.toString, o = Array.prototype.concat, r = /* @__PURE__ */ requireDefineDataProperty(), a = function(y) {
    return typeof y == "function" && n.call(y) === "[object Function]";
  }, f = /* @__PURE__ */ requireHasPropertyDescriptors()(), l = function(y, u, m, w) {
    if (u in y) {
      if (w === !0) {
        if (y[u] === m)
          return;
      } else if (!a(w) || !w())
        return;
    }
    f ? r(y, u, m, !0) : r(y, u, m);
  }, c = function(y, u) {
    var m = arguments.length > 2 ? arguments[2] : {}, w = t(u);
    e && (w = o.call(w, Object.getOwnPropertySymbols(u)));
    for (var R = 0; R < w.length; R += 1)
      l(y, w[R], u[w[R]], m[w[R]]);
  };
  return c.supportsDescriptors = !!f, defineProperties_1 = c, defineProperties_1;
}
var shim$1, hasRequiredShim$1;
function requireShim$1() {
  if (hasRequiredShim$1) return shim$1;
  hasRequiredShim$1 = 1;
  var t = requirePolyfill$1(), e = requireDefineProperties();
  return shim$1 = function() {
    var o = t();
    return e(Object, { is: o }, {
      is: function() {
        return Object.is !== o;
      }
    }), o;
  }, shim$1;
}
var objectIs, hasRequiredObjectIs;
function requireObjectIs() {
  if (hasRequiredObjectIs) return objectIs;
  hasRequiredObjectIs = 1;
  var t = requireDefineProperties(), e = requireCallBind(), n = requireImplementation$1(), o = requirePolyfill$1(), r = requireShim$1(), a = e(o(), Object);
  return t(a, {
    getPolyfill: o,
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
    var o = e();
    return t(Number, { isNaN: o }, {
      isNaN: function() {
        return Number.isNaN !== o;
      }
    }), o;
  }, shim;
}
var isNan, hasRequiredIsNan;
function requireIsNan() {
  if (hasRequiredIsNan) return isNan;
  hasRequiredIsNan = 1;
  var t = requireCallBind(), e = requireDefineProperties(), n = requireImplementation(), o = requirePolyfill(), r = requireShim(), a = t(o(), Number);
  return e(a, {
    getPolyfill: o,
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
      if (typeof ge == "string") return o(ge, Se);
      var Le = Object.prototype.toString.call(ge).slice(8, -1);
      if (Le === "Object" && ge.constructor && (Le = ge.constructor.name), Le === "Map" || Le === "Set") return Array.from(ge);
      if (Le === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(Le)) return o(ge, Se);
    }
  }
  function o(ge, Se) {
    (Se == null || Se > ge.length) && (Se = ge.length);
    for (var Le = 0, je = new Array(Se); Le < Se; Le++) je[Le] = ge[Le];
    return je;
  }
  function r(ge, Se) {
    var Le = ge == null ? null : typeof Symbol < "u" && ge[Symbol.iterator] || ge["@@iterator"];
    if (Le != null) {
      var je, ke, He, U, s = [], _ = !0, W = !1;
      try {
        if (He = (Le = Le.call(ge)).next, Se !== 0) for (; !(_ = (je = He.call(Le)).done) && (s.push(je.value), s.length !== Se); _ = !0) ;
      } catch (ue) {
        W = !0, ke = ue;
      } finally {
        try {
          if (!_ && Le.return != null && (U = Le.return(), Object(U) !== U)) return;
        } finally {
          if (W) throw ke;
        }
      }
      return s;
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
  var l = /a/g.flags !== void 0, c = function(Se) {
    var Le = [];
    return Se.forEach(function(je) {
      return Le.push(je);
    }), Le;
  }, y = function(Se) {
    var Le = [];
    return Se.forEach(function(je, ke) {
      return Le.push([ke, je]);
    }), Le;
  }, u = Object.is ? Object.is : requireObjectIs(), m = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
    return [];
  }, w = Number.isNaN ? Number.isNaN : requireIsNan();
  function R(ge) {
    return ge.call.bind(ge);
  }
  var h = R(Object.prototype.hasOwnProperty), q = R(Object.prototype.propertyIsEnumerable), d = R(Object.prototype.toString), v = requireUtil$2().types, P = v.isAnyArrayBuffer, E = v.isArrayBufferView, I = v.isDate, T = v.isMap, $ = v.isRegExp, x = v.isSet, j = v.isNativeError, V = v.isBoxedPrimitive, C = v.isNumberObject, z = v.isStringObject, g = v.isBooleanObject, D = v.isBigIntObject, ie = v.isSymbolObject, de = v.isFloat32Array, we = v.isFloat64Array;
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
    for (var Le = ge.length, je = Se.length, ke = 0, He = Math.min(Le, je); ke < He; ++ke)
      if (ge[ke] !== Se[ke]) {
        Le = ge[ke], je = Se[ke];
        break;
      }
    return Le < je ? -1 : je < Le ? 1 : 0;
  }
  var M = !0, pe = !1, ee = 0, Q = 1, Z = 2, le = 3;
  function O(ge, Se) {
    return l ? ge.source === Se.source && ge.flags === Se.flags : RegExp.prototype.toString.call(ge) === RegExp.prototype.toString.call(Se);
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
    return C(ge) ? C(Se) && u(Number.prototype.valueOf.call(ge), Number.prototype.valueOf.call(Se)) : z(ge) ? z(Se) && String.prototype.valueOf.call(ge) === String.prototype.valueOf.call(Se) : g(ge) ? g(Se) && Boolean.prototype.valueOf.call(ge) === Boolean.prototype.valueOf.call(Se) : D(ge) ? D(Se) && BigInt.prototype.valueOf.call(ge) === BigInt.prototype.valueOf.call(Se) : ie(Se) && Symbol.prototype.valueOf.call(ge) === Symbol.prototype.valueOf.call(Se);
  }
  function F(ge, Se, Le, je) {
    if (ge === Se)
      return ge !== 0 ? !0 : Le ? u(ge, Se) : !0;
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
    var ke = d(ge), He = d(Se);
    if (ke !== He)
      return !1;
    if (Array.isArray(ge)) {
      if (ge.length !== Se.length)
        return !1;
      var U = ce(ge), s = ce(Se);
      return U.length !== s.length ? !1 : H(ge, Se, Le, je, Q, U);
    }
    if (ke === "[object Object]" && (!T(ge) && T(Se) || !x(ge) && x(Se)))
      return !1;
    if (I(ge)) {
      if (!I(Se) || Date.prototype.getTime.call(ge) !== Date.prototype.getTime.call(Se))
        return !1;
    } else if ($(ge)) {
      if (!$(Se) || !O(ge, Se))
        return !1;
    } else if (j(ge) || ge instanceof Error) {
      if (ge.message !== Se.message || ge.name !== Se.name)
        return !1;
    } else if (E(ge)) {
      if (!Le && (de(ge) || we(ge))) {
        if (!B(ge, Se))
          return !1;
      } else if (!N(ge, Se))
        return !1;
      var _ = ce(ge), W = ce(Se);
      return _.length !== W.length ? !1 : H(ge, Se, Le, je, ee, _);
    } else {
      if (x(ge))
        return !x(Se) || ge.size !== Se.size ? !1 : H(ge, Se, Le, je, Z);
      if (T(ge))
        return !T(Se) || ge.size !== Se.size ? !1 : H(ge, Se, Le, je, le);
      if (P(ge)) {
        if (!re(ge, Se))
          return !1;
      } else if (V(ge) && !ne(ge, Se))
        return !1;
    }
    return H(ge, Se, Le, je, ee);
  }
  function L(ge, Se) {
    return Se.filter(function(Le) {
      return q(ge, Le);
    });
  }
  function H(ge, Se, Le, je, ke, He) {
    if (arguments.length === 5) {
      He = Object.keys(ge);
      var U = Object.keys(Se);
      if (He.length !== U.length)
        return !1;
    }
    for (var s = 0; s < He.length; s++)
      if (!h(Se, He[s]))
        return !1;
    if (Le && arguments.length === 5) {
      var _ = m(ge);
      if (_.length !== 0) {
        var W = 0;
        for (s = 0; s < _.length; s++) {
          var ue = _[s];
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
    if (He.length === 0 && (ke === ee || ke === Q && ge.length === 0 || ge.size === 0))
      return !0;
    if (je === void 0)
      je = {
        val1: /* @__PURE__ */ new Map(),
        val2: /* @__PURE__ */ new Map(),
        position: 0
      };
    else {
      var k = je.val1.get(ge);
      if (k !== void 0) {
        var Be = je.val2.get(Se);
        if (Be !== void 0)
          return k === Be;
      }
      je.position++;
    }
    je.val1.set(ge, je.position), je.val2.set(Se, je.position);
    var We = Ce(ge, Se, Le, He, je, ke);
    return je.val1.delete(ge), je.val2.delete(Se), We;
  }
  function se(ge, Se, Le, je) {
    for (var ke = c(ge), He = 0; He < ke.length; He++) {
      var U = ke[He];
      if (F(Se, U, Le, je))
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
    var je = Ee(Le);
    return je ?? (Se.has(je) && !ge.has(je));
  }
  function Pe(ge, Se, Le, je, ke) {
    var He = Ee(Le);
    if (He != null)
      return He;
    var U = Se.get(He);
    return U === void 0 && !Se.has(He) || !F(je, U, !1, ke) ? !1 : !ge.has(He) && F(je, U, !1, ke);
  }
  function Oe(ge, Se, Le, je) {
    for (var ke = null, He = c(ge), U = 0; U < He.length; U++) {
      var s = He[U];
      if (f(s) === "object" && s !== null)
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(s);
      else if (!Se.has(s)) {
        if (Le || !Re(ge, Se, s))
          return !1;
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(s);
      }
    }
    if (ke !== null) {
      for (var _ = c(Se), W = 0; W < _.length; W++) {
        var ue = _[W];
        if (f(ue) === "object" && ue !== null) {
          if (!se(ke, ue, Le, je)) return !1;
        } else if (!Le && !ge.has(ue) && !se(ke, ue, Le, je))
          return !1;
      }
      return ke.size === 0;
    }
    return !0;
  }
  function te(ge, Se, Le, je, ke, He) {
    for (var U = c(ge), s = 0; s < U.length; s++) {
      var _ = U[s];
      if (F(Le, _, ke, He) && F(je, Se.get(_), ke, He))
        return ge.delete(_), !0;
    }
    return !1;
  }
  function $e(ge, Se, Le, je) {
    for (var ke = null, He = y(ge), U = 0; U < He.length; U++) {
      var s = t(He[U], 2), _ = s[0], W = s[1];
      if (f(_) === "object" && _ !== null)
        ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(_);
      else {
        var ue = Se.get(_);
        if (ue === void 0 && !Se.has(_) || !F(W, ue, Le, je)) {
          if (Le || !Pe(ge, Se, _, W, je)) return !1;
          ke === null && (ke = /* @__PURE__ */ new Set()), ke.add(_);
        }
      }
    }
    if (ke !== null) {
      for (var J = y(Se), he = 0; he < J.length; he++) {
        var k = t(J[he], 2), Be = k[0], We = k[1];
        if (f(Be) === "object" && Be !== null) {
          if (!te(ke, ge, Be, We, Le, je)) return !1;
        } else if (!Le && (!ge.has(Be) || !F(ge.get(Be), We, !1, je)) && !te(ke, ge, Be, We, !1, je))
          return !1;
      }
      return ke.size === 0;
    }
    return !0;
  }
  function Ce(ge, Se, Le, je, ke, He) {
    var U = 0;
    if (He === Z) {
      if (!Oe(ge, Se, Le, ke))
        return !1;
    } else if (He === le) {
      if (!$e(ge, Se, Le, ke))
        return !1;
    } else if (He === Q)
      for (; U < ge.length; U++)
        if (h(ge, U)) {
          if (!h(Se, U) || !F(ge[U], Se[U], Le, ke))
            return !1;
        } else {
          if (h(Se, U))
            return !1;
          for (var s = Object.keys(ge); U < s.length; U++) {
            var _ = s[U];
            if (!h(Se, _) || !F(ge[_], Se[_], Le, ke))
              return !1;
          }
          return s.length === Object.keys(Se).length;
        }
    for (U = 0; U < je.length; U++) {
      var W = je[U];
      if (!F(ge[W], Se[W], Le, ke))
        return !1;
    }
    return !0;
  }
  function Ae(ge, Se) {
    return F(ge, Se, pe);
  }
  function Ue(ge, Se) {
    return F(ge, Se, M);
  }
  return comparisons = {
    isDeepEqual: Ae,
    isDeepStrictEqual: Ue
  }, comparisons;
}
var hasRequiredAssert;
function requireAssert() {
  if (hasRequiredAssert) return assert.exports;
  hasRequiredAssert = 1;
  function t(Z) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(le) {
      return typeof le;
    } : function(le) {
      return le && typeof Symbol == "function" && le.constructor === Symbol && le !== Symbol.prototype ? "symbol" : typeof le;
    }, t(Z);
  }
  function e(Z, le, O) {
    return Object.defineProperty(Z, "prototype", { writable: !1 }), Z;
  }
  function n(Z, le) {
    if (!(Z instanceof le))
      throw new TypeError("Cannot call a class as a function");
  }
  var o = requireErrors$1(), r = o.codes, a = r.ERR_AMBIGUOUS_ARGUMENT, f = r.ERR_INVALID_ARG_TYPE, l = r.ERR_INVALID_ARG_VALUE, c = r.ERR_INVALID_RETURN_VALUE, y = r.ERR_MISSING_ARGS, u = requireAssertion_error(), m = requireUtil$2(), w = m.inspect, R = requireUtil$2().types, h = R.isPromise, q = R.isRegExp, d = requirePolyfill$2()(), v = requirePolyfill$1()(), P = requireCallBound()("RegExp.prototype.test"), E, I;
  function T() {
    var Z = requireComparisons();
    E = Z.isDeepEqual, I = Z.isDeepStrictEqual;
  }
  var $ = !1, x = assert.exports = g, j = {};
  function V(Z) {
    throw Z.message instanceof Error ? Z.message : new u(Z);
  }
  function C(Z, le, O, B, N) {
    var re = arguments.length, ne;
    if (re === 0)
      ne = "Failed";
    else if (re === 1)
      O = Z, Z = void 0;
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
      actual: Z,
      expected: le,
      operator: B === void 0 ? "fail" : B,
      stackStartFn: N || C
    };
    O !== void 0 && (L.message = O);
    var H = new u(L);
    throw ne && (H.message = ne, H.generatedMessage = !0), H;
  }
  x.fail = C, x.AssertionError = u;
  function z(Z, le, O, B) {
    if (!O) {
      var N = !1;
      if (le === 0)
        N = !0, B = "No value argument passed to `assert.ok()`";
      else if (B instanceof Error)
        throw B;
      var re = new u({
        actual: O,
        expected: !0,
        message: B,
        operator: "==",
        stackStartFn: Z
      });
      throw re.generatedMessage = N, re;
    }
  }
  function g() {
    for (var Z = arguments.length, le = new Array(Z), O = 0; O < Z; O++)
      le[O] = arguments[O];
    z.apply(void 0, [g, le.length].concat(le));
  }
  x.ok = g, x.equal = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    le != O && V({
      actual: le,
      expected: O,
      message: B,
      operator: "==",
      stackStartFn: Z
    });
  }, x.notEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    le == O && V({
      actual: le,
      expected: O,
      message: B,
      operator: "!=",
      stackStartFn: Z
    });
  }, x.deepEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    E === void 0 && T(), E(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "deepEqual",
      stackStartFn: Z
    });
  }, x.notDeepEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    E === void 0 && T(), E(le, O) && V({
      actual: le,
      expected: O,
      message: B,
      operator: "notDeepEqual",
      stackStartFn: Z
    });
  }, x.deepStrictEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    E === void 0 && T(), I(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "deepStrictEqual",
      stackStartFn: Z
    });
  }, x.notDeepStrictEqual = D;
  function D(Z, le, O) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    E === void 0 && T(), I(Z, le) && V({
      actual: Z,
      expected: le,
      message: O,
      operator: "notDeepStrictEqual",
      stackStartFn: D
    });
  }
  x.strictEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    v(le, O) || V({
      actual: le,
      expected: O,
      message: B,
      operator: "strictEqual",
      stackStartFn: Z
    });
  }, x.notStrictEqual = function Z(le, O, B) {
    if (arguments.length < 2)
      throw new y("actual", "expected");
    v(le, O) && V({
      actual: le,
      expected: O,
      message: B,
      operator: "notStrictEqual",
      stackStartFn: Z
    });
  };
  var ie = /* @__PURE__ */ e(function Z(le, O, B) {
    var N = this;
    n(this, Z), O.forEach(function(re) {
      re in le && (B !== void 0 && typeof B[re] == "string" && q(le[re]) && P(le[re], B[re]) ? N[re] = B[re] : N[re] = le[re]);
    });
  });
  function de(Z, le, O, B, N, re) {
    if (!(O in Z) || !I(Z[O], le[O])) {
      if (!B) {
        var ne = new ie(Z, N), F = new ie(le, N, Z), L = new u({
          actual: ne,
          expected: F,
          operator: "deepStrictEqual",
          stackStartFn: re
        });
        throw L.actual = Z, L.expected = le, L.operator = re.name, L;
      }
      V({
        actual: Z,
        expected: le,
        message: B,
        operator: re.name,
        stackStartFn: re
      });
    }
  }
  function we(Z, le, O, B) {
    if (typeof le != "function") {
      if (q(le)) return P(le, Z);
      if (arguments.length === 2)
        throw new f("expected", ["Function", "RegExp"], le);
      if (t(Z) !== "object" || Z === null) {
        var N = new u({
          actual: Z,
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
        throw new l("error", le, "may not be an empty object");
      return E === void 0 && T(), re.forEach(function(ne) {
        typeof Z[ne] == "string" && q(le[ne]) && P(le[ne], Z[ne]) || de(Z, le, ne, O, re, B);
      }), !0;
    }
    return le.prototype !== void 0 && Z instanceof le ? !0 : Error.isPrototypeOf(le) ? !1 : le.call({}, Z) === !0;
  }
  function be(Z) {
    if (typeof Z != "function")
      throw new f("fn", "Function", Z);
    try {
      Z();
    } catch (le) {
      return le;
    }
    return j;
  }
  function ce(Z) {
    return h(Z) || Z !== null && t(Z) === "object" && typeof Z.then == "function" && typeof Z.catch == "function";
  }
  function fe(Z) {
    return Promise.resolve().then(function() {
      var le;
      if (typeof Z == "function") {
        if (le = Z(), !ce(le))
          throw new c("instance of Promise", "promiseFn", le);
      } else if (ce(Z))
        le = Z;
      else
        throw new f("promiseFn", ["Function", "Promise"], Z);
      return Promise.resolve().then(function() {
        return le;
      }).then(function() {
        return j;
      }).catch(function(O) {
        return O;
      });
    });
  }
  function M(Z, le, O, B) {
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
    if (le === j) {
      var N = "";
      O && O.name && (N += " (".concat(O.name, ")")), N += B ? ": ".concat(B) : ".";
      var re = Z.name === "rejects" ? "rejection" : "exception";
      V({
        actual: void 0,
        expected: O,
        operator: Z.name,
        message: "Missing expected ".concat(re).concat(N),
        stackStartFn: Z
      });
    }
    if (O && !we(le, O, B, Z))
      throw le;
  }
  function pe(Z, le, O, B) {
    if (le !== j) {
      if (typeof O == "string" && (B = O, O = void 0), !O || we(le, O)) {
        var N = B ? ": ".concat(B) : ".", re = Z.name === "doesNotReject" ? "rejection" : "exception";
        V({
          actual: le,
          expected: O,
          operator: Z.name,
          message: "Got unwanted ".concat(re).concat(N, `
`) + 'Actual message: "'.concat(le && le.message, '"'),
          stackStartFn: Z
        });
      }
      throw le;
    }
  }
  x.throws = function Z(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    M.apply(void 0, [Z, be(le)].concat(B));
  }, x.rejects = function Z(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(le).then(function(re) {
      return M.apply(void 0, [Z, re].concat(B));
    });
  }, x.doesNotThrow = function Z(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    pe.apply(void 0, [Z, be(le)].concat(B));
  }, x.doesNotReject = function Z(le) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(le).then(function(re) {
      return pe.apply(void 0, [Z, re].concat(B));
    });
  }, x.ifError = function Z(le) {
    if (le != null) {
      var O = "ifError got unwanted exception: ";
      t(le) === "object" && typeof le.message == "string" ? le.message.length === 0 && le.constructor ? O += le.constructor.name : O += le.message : O += w(le);
      var B = new u({
        actual: le,
        expected: null,
        operator: "ifError",
        message: O,
        stackStartFn: Z
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
  function ee(Z, le, O, B, N) {
    if (!q(le))
      throw new f("regexp", "RegExp", le);
    var re = N === "match";
    if (typeof Z != "string" || P(le, Z) !== re) {
      if (O instanceof Error)
        throw O;
      var ne = !O;
      O = O || (typeof Z != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(t(Z), " (").concat(w(Z), ")") : (re ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(w(le), `. Input:

`).concat(w(Z), `
`));
      var F = new u({
        actual: Z,
        expected: le,
        message: O,
        operator: N,
        stackStartFn: B
      });
      throw F.generatedMessage = ne, F;
    }
  }
  x.match = function Z(le, O, B) {
    ee(le, O, B, Z, "match");
  }, x.doesNotMatch = function Z(le, O, B) {
    ee(le, O, B, Z, "doesNotMatch");
  };
  function Q() {
    for (var Z = arguments.length, le = new Array(Z), O = 0; O < Z; O++)
      le[O] = arguments[O];
    z.apply(void 0, [Q, le.length].concat(le));
  }
  return x.strict = d(Q, x, {
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
        var l = f.shift();
        if (l) {
          if (typeof l != "object")
            throw new TypeError(l + "must be non-object");
          for (var c in l)
            n(l, c) && (a[c] = l[c]);
        }
      }
      return a;
    }, t.shrinkBuf = function(a, f) {
      return a.length === f ? a : a.subarray ? a.subarray(0, f) : (a.length = f, a);
    };
    var o = {
      arraySet: function(a, f, l, c, y) {
        if (f.subarray && a.subarray) {
          a.set(f.subarray(l, l + c), y);
          return;
        }
        for (var u = 0; u < c; u++)
          a[y + u] = f[l + u];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        var f, l, c, y, u, m;
        for (c = 0, f = 0, l = a.length; f < l; f++)
          c += a[f].length;
        for (m = new Uint8Array(c), y = 0, f = 0, l = a.length; f < l; f++)
          u = a[f], m.set(u, y), y += u.length;
        return m;
      }
    }, r = {
      arraySet: function(a, f, l, c, y) {
        for (var u = 0; u < c; u++)
          a[y + u] = f[l + u];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        return [].concat.apply([], a);
      }
    };
    t.setTyped = function(a) {
      a ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, o)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, r));
    }, t.setTyped(e);
  })(common)), common;
}
var trees = {}, hasRequiredTrees;
function requireTrees() {
  if (hasRequiredTrees) return trees;
  hasRequiredTrees = 1;
  var t = requireCommon(), e = 4, n = 0, o = 1, r = 2;
  function a(s) {
    for (var _ = s.length; --_ >= 0; )
      s[_] = 0;
  }
  var f = 0, l = 1, c = 2, y = 3, u = 258, m = 29, w = 256, R = w + 1 + m, h = 30, q = 19, d = 2 * R + 1, v = 15, P = 16, E = 7, I = 256, T = 16, $ = 17, x = 18, j = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), V = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), C = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], g = 512, D = new Array((R + 2) * 2);
  a(D);
  var ie = new Array(h * 2);
  a(ie);
  var de = new Array(g);
  a(de);
  var we = new Array(u - y + 1);
  a(we);
  var be = new Array(m);
  a(be);
  var ce = new Array(h);
  a(ce);
  function fe(s, _, W, ue, J) {
    this.static_tree = s, this.extra_bits = _, this.extra_base = W, this.elems = ue, this.max_length = J, this.has_stree = s && s.length;
  }
  var M, pe, ee;
  function Q(s, _) {
    this.dyn_tree = s, this.max_code = 0, this.stat_desc = _;
  }
  function Z(s) {
    return s < 256 ? de[s] : de[256 + (s >>> 7)];
  }
  function le(s, _) {
    s.pending_buf[s.pending++] = _ & 255, s.pending_buf[s.pending++] = _ >>> 8 & 255;
  }
  function O(s, _, W) {
    s.bi_valid > P - W ? (s.bi_buf |= _ << s.bi_valid & 65535, le(s, s.bi_buf), s.bi_buf = _ >> P - s.bi_valid, s.bi_valid += W - P) : (s.bi_buf |= _ << s.bi_valid & 65535, s.bi_valid += W);
  }
  function B(s, _, W) {
    O(
      s,
      W[_ * 2],
      W[_ * 2 + 1]
      /*.Len*/
    );
  }
  function N(s, _) {
    var W = 0;
    do
      W |= s & 1, s >>>= 1, W <<= 1;
    while (--_ > 0);
    return W >>> 1;
  }
  function re(s) {
    s.bi_valid === 16 ? (le(s, s.bi_buf), s.bi_buf = 0, s.bi_valid = 0) : s.bi_valid >= 8 && (s.pending_buf[s.pending++] = s.bi_buf & 255, s.bi_buf >>= 8, s.bi_valid -= 8);
  }
  function ne(s, _) {
    var W = _.dyn_tree, ue = _.max_code, J = _.stat_desc.static_tree, he = _.stat_desc.has_stree, k = _.stat_desc.extra_bits, Be = _.stat_desc.extra_base, We = _.stat_desc.max_length, S, Ie, Fe, G, _e, De, Ze = 0;
    for (G = 0; G <= v; G++)
      s.bl_count[G] = 0;
    for (W[s.heap[s.heap_max] * 2 + 1] = 0, S = s.heap_max + 1; S < d; S++)
      Ie = s.heap[S], G = W[W[Ie * 2 + 1] * 2 + 1] + 1, G > We && (G = We, Ze++), W[Ie * 2 + 1] = G, !(Ie > ue) && (s.bl_count[G]++, _e = 0, Ie >= Be && (_e = k[Ie - Be]), De = W[Ie * 2], s.opt_len += De * (G + _e), he && (s.static_len += De * (J[Ie * 2 + 1] + _e)));
    if (Ze !== 0) {
      do {
        for (G = We - 1; s.bl_count[G] === 0; )
          G--;
        s.bl_count[G]--, s.bl_count[G + 1] += 2, s.bl_count[We]--, Ze -= 2;
      } while (Ze > 0);
      for (G = We; G !== 0; G--)
        for (Ie = s.bl_count[G]; Ie !== 0; )
          Fe = s.heap[--S], !(Fe > ue) && (W[Fe * 2 + 1] !== G && (s.opt_len += (G - W[Fe * 2 + 1]) * W[Fe * 2], W[Fe * 2 + 1] = G), Ie--);
    }
  }
  function F(s, _, W) {
    var ue = new Array(v + 1), J = 0, he, k;
    for (he = 1; he <= v; he++)
      ue[he] = J = J + W[he - 1] << 1;
    for (k = 0; k <= _; k++) {
      var Be = s[k * 2 + 1];
      Be !== 0 && (s[k * 2] = N(ue[Be]++, Be));
    }
  }
  function L() {
    var s, _, W, ue, J, he = new Array(v + 1);
    for (W = 0, ue = 0; ue < m - 1; ue++)
      for (be[ue] = W, s = 0; s < 1 << j[ue]; s++)
        we[W++] = ue;
    for (we[W - 1] = ue, J = 0, ue = 0; ue < 16; ue++)
      for (ce[ue] = J, s = 0; s < 1 << V[ue]; s++)
        de[J++] = ue;
    for (J >>= 7; ue < h; ue++)
      for (ce[ue] = J << 7, s = 0; s < 1 << V[ue] - 7; s++)
        de[256 + J++] = ue;
    for (_ = 0; _ <= v; _++)
      he[_] = 0;
    for (s = 0; s <= 143; )
      D[s * 2 + 1] = 8, s++, he[8]++;
    for (; s <= 255; )
      D[s * 2 + 1] = 9, s++, he[9]++;
    for (; s <= 279; )
      D[s * 2 + 1] = 7, s++, he[7]++;
    for (; s <= 287; )
      D[s * 2 + 1] = 8, s++, he[8]++;
    for (F(D, R + 1, he), s = 0; s < h; s++)
      ie[s * 2 + 1] = 5, ie[s * 2] = N(s, 5);
    M = new fe(D, j, w + 1, R, v), pe = new fe(ie, V, 0, h, v), ee = new fe(new Array(0), C, 0, q, E);
  }
  function H(s) {
    var _;
    for (_ = 0; _ < R; _++)
      s.dyn_ltree[_ * 2] = 0;
    for (_ = 0; _ < h; _++)
      s.dyn_dtree[_ * 2] = 0;
    for (_ = 0; _ < q; _++)
      s.bl_tree[_ * 2] = 0;
    s.dyn_ltree[I * 2] = 1, s.opt_len = s.static_len = 0, s.last_lit = s.matches = 0;
  }
  function se(s) {
    s.bi_valid > 8 ? le(s, s.bi_buf) : s.bi_valid > 0 && (s.pending_buf[s.pending++] = s.bi_buf), s.bi_buf = 0, s.bi_valid = 0;
  }
  function Ee(s, _, W, ue) {
    se(s), le(s, W), le(s, ~W), t.arraySet(s.pending_buf, s.window, _, W, s.pending), s.pending += W;
  }
  function Re(s, _, W, ue) {
    var J = _ * 2, he = W * 2;
    return s[J] < s[he] || s[J] === s[he] && ue[_] <= ue[W];
  }
  function Pe(s, _, W) {
    for (var ue = s.heap[W], J = W << 1; J <= s.heap_len && (J < s.heap_len && Re(_, s.heap[J + 1], s.heap[J], s.depth) && J++, !Re(_, ue, s.heap[J], s.depth)); )
      s.heap[W] = s.heap[J], W = J, J <<= 1;
    s.heap[W] = ue;
  }
  function Oe(s, _, W) {
    var ue, J, he = 0, k, Be;
    if (s.last_lit !== 0)
      do
        ue = s.pending_buf[s.d_buf + he * 2] << 8 | s.pending_buf[s.d_buf + he * 2 + 1], J = s.pending_buf[s.l_buf + he], he++, ue === 0 ? B(s, J, _) : (k = we[J], B(s, k + w + 1, _), Be = j[k], Be !== 0 && (J -= be[k], O(s, J, Be)), ue--, k = Z(ue), B(s, k, W), Be = V[k], Be !== 0 && (ue -= ce[k], O(s, ue, Be)));
      while (he < s.last_lit);
    B(s, I, _);
  }
  function te(s, _) {
    var W = _.dyn_tree, ue = _.stat_desc.static_tree, J = _.stat_desc.has_stree, he = _.stat_desc.elems, k, Be, We = -1, S;
    for (s.heap_len = 0, s.heap_max = d, k = 0; k < he; k++)
      W[k * 2] !== 0 ? (s.heap[++s.heap_len] = We = k, s.depth[k] = 0) : W[k * 2 + 1] = 0;
    for (; s.heap_len < 2; )
      S = s.heap[++s.heap_len] = We < 2 ? ++We : 0, W[S * 2] = 1, s.depth[S] = 0, s.opt_len--, J && (s.static_len -= ue[S * 2 + 1]);
    for (_.max_code = We, k = s.heap_len >> 1; k >= 1; k--)
      Pe(s, W, k);
    S = he;
    do
      k = s.heap[
        1
        /*SMALLEST*/
      ], s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--], Pe(
        s,
        W,
        1
        /*SMALLEST*/
      ), Be = s.heap[
        1
        /*SMALLEST*/
      ], s.heap[--s.heap_max] = k, s.heap[--s.heap_max] = Be, W[S * 2] = W[k * 2] + W[Be * 2], s.depth[S] = (s.depth[k] >= s.depth[Be] ? s.depth[k] : s.depth[Be]) + 1, W[k * 2 + 1] = W[Be * 2 + 1] = S, s.heap[
        1
        /*SMALLEST*/
      ] = S++, Pe(
        s,
        W,
        1
        /*SMALLEST*/
      );
    while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ], ne(s, _), F(W, We, s.bl_count);
  }
  function $e(s, _, W) {
    var ue, J = -1, he, k = _[1], Be = 0, We = 7, S = 4;
    for (k === 0 && (We = 138, S = 3), _[(W + 1) * 2 + 1] = 65535, ue = 0; ue <= W; ue++)
      he = k, k = _[(ue + 1) * 2 + 1], !(++Be < We && he === k) && (Be < S ? s.bl_tree[he * 2] += Be : he !== 0 ? (he !== J && s.bl_tree[he * 2]++, s.bl_tree[T * 2]++) : Be <= 10 ? s.bl_tree[$ * 2]++ : s.bl_tree[x * 2]++, Be = 0, J = he, k === 0 ? (We = 138, S = 3) : he === k ? (We = 6, S = 3) : (We = 7, S = 4));
  }
  function Ce(s, _, W) {
    var ue, J = -1, he, k = _[1], Be = 0, We = 7, S = 4;
    for (k === 0 && (We = 138, S = 3), ue = 0; ue <= W; ue++)
      if (he = k, k = _[(ue + 1) * 2 + 1], !(++Be < We && he === k)) {
        if (Be < S)
          do
            B(s, he, s.bl_tree);
          while (--Be !== 0);
        else he !== 0 ? (he !== J && (B(s, he, s.bl_tree), Be--), B(s, T, s.bl_tree), O(s, Be - 3, 2)) : Be <= 10 ? (B(s, $, s.bl_tree), O(s, Be - 3, 3)) : (B(s, x, s.bl_tree), O(s, Be - 11, 7));
        Be = 0, J = he, k === 0 ? (We = 138, S = 3) : he === k ? (We = 6, S = 3) : (We = 7, S = 4);
      }
  }
  function Ae(s) {
    var _;
    for ($e(s, s.dyn_ltree, s.l_desc.max_code), $e(s, s.dyn_dtree, s.d_desc.max_code), te(s, s.bl_desc), _ = q - 1; _ >= 3 && s.bl_tree[z[_] * 2 + 1] === 0; _--)
      ;
    return s.opt_len += 3 * (_ + 1) + 5 + 5 + 4, _;
  }
  function Ue(s, _, W, ue) {
    var J;
    for (O(s, _ - 257, 5), O(s, W - 1, 5), O(s, ue - 4, 4), J = 0; J < ue; J++)
      O(s, s.bl_tree[z[J] * 2 + 1], 3);
    Ce(s, s.dyn_ltree, _ - 1), Ce(s, s.dyn_dtree, W - 1);
  }
  function ge(s) {
    var _ = 4093624447, W;
    for (W = 0; W <= 31; W++, _ >>>= 1)
      if (_ & 1 && s.dyn_ltree[W * 2] !== 0)
        return n;
    if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0)
      return o;
    for (W = 32; W < w; W++)
      if (s.dyn_ltree[W * 2] !== 0)
        return o;
    return n;
  }
  var Se = !1;
  function Le(s) {
    Se || (L(), Se = !0), s.l_desc = new Q(s.dyn_ltree, M), s.d_desc = new Q(s.dyn_dtree, pe), s.bl_desc = new Q(s.bl_tree, ee), s.bi_buf = 0, s.bi_valid = 0, H(s);
  }
  function je(s, _, W, ue) {
    O(s, (f << 1) + (ue ? 1 : 0), 3), Ee(s, _, W);
  }
  function ke(s) {
    O(s, l << 1, 3), B(s, I, D), re(s);
  }
  function He(s, _, W, ue) {
    var J, he, k = 0;
    s.level > 0 ? (s.strm.data_type === r && (s.strm.data_type = ge(s)), te(s, s.l_desc), te(s, s.d_desc), k = Ae(s), J = s.opt_len + 3 + 7 >>> 3, he = s.static_len + 3 + 7 >>> 3, he <= J && (J = he)) : J = he = W + 5, W + 4 <= J && _ !== -1 ? je(s, _, W, ue) : s.strategy === e || he === J ? (O(s, (l << 1) + (ue ? 1 : 0), 3), Oe(s, D, ie)) : (O(s, (c << 1) + (ue ? 1 : 0), 3), Ue(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, k + 1), Oe(s, s.dyn_ltree, s.dyn_dtree)), H(s), ue && se(s);
  }
  function U(s, _, W) {
    return s.pending_buf[s.d_buf + s.last_lit * 2] = _ >>> 8 & 255, s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = _ & 255, s.pending_buf[s.l_buf + s.last_lit] = W & 255, s.last_lit++, _ === 0 ? s.dyn_ltree[W * 2]++ : (s.matches++, _--, s.dyn_ltree[(we[W] + w + 1) * 2]++, s.dyn_dtree[Z(_) * 2]++), s.last_lit === s.lit_bufsize - 1;
  }
  return trees._tr_init = Le, trees._tr_stored_block = je, trees._tr_flush_block = He, trees._tr_tally = U, trees._tr_align = ke, trees;
}
var adler32_1, hasRequiredAdler32;
function requireAdler32() {
  if (hasRequiredAdler32) return adler32_1;
  hasRequiredAdler32 = 1;
  function t(e, n, o, r) {
    for (var a = e & 65535 | 0, f = e >>> 16 & 65535 | 0, l = 0; o !== 0; ) {
      l = o > 2e3 ? 2e3 : o, o -= l;
      do
        a = a + n[r++] | 0, f = f + a | 0;
      while (--l);
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
    for (var o, r = [], a = 0; a < 256; a++) {
      o = a;
      for (var f = 0; f < 8; f++)
        o = o & 1 ? 3988292384 ^ o >>> 1 : o >>> 1;
      r[a] = o;
    }
    return r;
  }
  var e = t();
  function n(o, r, a, f) {
    var l = e, c = f + a;
    o ^= -1;
    for (var y = f; y < c; y++)
      o = o >>> 8 ^ l[(o ^ r[y]) & 255];
    return o ^ -1;
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
  var t = requireCommon(), e = requireTrees(), n = requireAdler32(), o = requireCrc32(), r = requireMessages(), a = 0, f = 1, l = 3, c = 4, y = 5, u = 0, m = 1, w = -2, R = -3, h = -5, q = -1, d = 1, v = 2, P = 3, E = 4, I = 0, T = 2, $ = 8, x = 9, j = 15, V = 8, C = 29, z = 256, g = z + 1 + C, D = 30, ie = 19, de = 2 * g + 1, we = 15, be = 3, ce = 258, fe = ce + be + 1, M = 32, pe = 42, ee = 69, Q = 73, Z = 91, le = 103, O = 113, B = 666, N = 1, re = 2, ne = 3, F = 4, L = 3;
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
  function $e(S, Ie, Fe, G) {
    var _e = S.avail_in;
    return _e > G && (_e = G), _e === 0 ? 0 : (S.avail_in -= _e, t.arraySet(Ie, S.input, S.next_in, _e, Fe), S.state.wrap === 1 ? S.adler = n(S.adler, Ie, _e, Fe) : S.state.wrap === 2 && (S.adler = o(S.adler, Ie, _e, Fe)), S.next_in += _e, S.total_in += _e, _e);
  }
  function Ce(S, Ie) {
    var Fe = S.max_chain_length, G = S.strstart, _e, De, Ze = S.prev_length, K = S.nice_match, b = S.strstart > S.w_size - fe ? S.strstart - (S.w_size - fe) : 0, p = S.window, A = S.w_mask, Y = S.prev, ye = S.strstart + ce, qe = p[G + Ze - 1], ae = p[G + Ze];
    S.prev_length >= S.good_match && (Fe >>= 2), K > S.lookahead && (K = S.lookahead);
    do
      if (_e = Ie, !(p[_e + Ze] !== ae || p[_e + Ze - 1] !== qe || p[_e] !== p[G] || p[++_e] !== p[G + 1])) {
        G += 2, _e++;
        do
          ;
        while (p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && p[++G] === p[++_e] && G < ye);
        if (De = ce - (ye - G), G = ye - ce, De > Ze) {
          if (S.match_start = Ie, Ze = De, De >= K)
            break;
          qe = p[G + Ze - 1], ae = p[G + Ze];
        }
      }
    while ((Ie = Y[Ie & A]) > b && --Fe !== 0);
    return Ze <= S.lookahead ? Ze : S.lookahead;
  }
  function Ae(S) {
    var Ie = S.w_size, Fe, G, _e, De, Ze;
    do {
      if (De = S.window_size - S.lookahead - S.strstart, S.strstart >= Ie + (Ie - fe)) {
        t.arraySet(S.window, S.window, Ie, Ie, 0), S.match_start -= Ie, S.strstart -= Ie, S.block_start -= Ie, G = S.hash_size, Fe = G;
        do
          _e = S.head[--Fe], S.head[Fe] = _e >= Ie ? _e - Ie : 0;
        while (--G);
        G = Ie, Fe = G;
        do
          _e = S.prev[--Fe], S.prev[Fe] = _e >= Ie ? _e - Ie : 0;
        while (--G);
        De += Ie;
      }
      if (S.strm.avail_in === 0)
        break;
      if (G = $e(S.strm, S.window, S.strstart + S.lookahead, De), S.lookahead += G, S.lookahead + S.insert >= be)
        for (Ze = S.strstart - S.insert, S.ins_h = S.window[Ze], S.ins_h = (S.ins_h << S.hash_shift ^ S.window[Ze + 1]) & S.hash_mask; S.insert && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[Ze + be - 1]) & S.hash_mask, S.prev[Ze & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = Ze, Ze++, S.insert--, !(S.lookahead + S.insert < be)); )
          ;
    } while (S.lookahead < fe && S.strm.avail_in !== 0);
  }
  function Ue(S, Ie) {
    var Fe = 65535;
    for (Fe > S.pending_buf_size - 5 && (Fe = S.pending_buf_size - 5); ; ) {
      if (S.lookahead <= 1) {
        if (Ae(S), S.lookahead === 0 && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      S.strstart += S.lookahead, S.lookahead = 0;
      var G = S.block_start + Fe;
      if ((S.strstart === 0 || S.strstart >= G) && (S.lookahead = S.strstart - G, S.strstart = G, Pe(S, !1), S.strm.avail_out === 0) || S.strstart - S.block_start >= S.w_size - fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === c ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : (S.strstart > S.block_start && (Pe(S, !1), S.strm.avail_out === 0), N);
  }
  function ge(S, Ie) {
    for (var Fe, G; ; ) {
      if (S.lookahead < fe) {
        if (Ae(S), S.lookahead < fe && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (Fe = 0, S.lookahead >= be && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart), Fe !== 0 && S.strstart - Fe <= S.w_size - fe && (S.match_length = Ce(S, Fe)), S.match_length >= be)
        if (G = e._tr_tally(S, S.strstart - S.match_start, S.match_length - be), S.lookahead -= S.match_length, S.match_length <= S.max_lazy_match && S.lookahead >= be) {
          S.match_length--;
          do
            S.strstart++, S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart;
          while (--S.match_length !== 0);
          S.strstart++;
        } else
          S.strstart += S.match_length, S.match_length = 0, S.ins_h = S.window[S.strstart], S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + 1]) & S.hash_mask;
      else
        G = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++;
      if (G && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = S.strstart < be - 1 ? S.strstart : be - 1, Ie === c ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function Se(S, Ie) {
    for (var Fe, G, _e; ; ) {
      if (S.lookahead < fe) {
        if (Ae(S), S.lookahead < fe && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (Fe = 0, S.lookahead >= be && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart), S.prev_length = S.match_length, S.prev_match = S.match_start, S.match_length = be - 1, Fe !== 0 && S.prev_length < S.max_lazy_match && S.strstart - Fe <= S.w_size - fe && (S.match_length = Ce(S, Fe), S.match_length <= 5 && (S.strategy === d || S.match_length === be && S.strstart - S.match_start > 4096) && (S.match_length = be - 1)), S.prev_length >= be && S.match_length <= S.prev_length) {
        _e = S.strstart + S.lookahead - be, G = e._tr_tally(S, S.strstart - 1 - S.prev_match, S.prev_length - be), S.lookahead -= S.prev_length - 1, S.prev_length -= 2;
        do
          ++S.strstart <= _e && (S.ins_h = (S.ins_h << S.hash_shift ^ S.window[S.strstart + be - 1]) & S.hash_mask, Fe = S.prev[S.strstart & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = S.strstart);
        while (--S.prev_length !== 0);
        if (S.match_available = 0, S.match_length = be - 1, S.strstart++, G && (Pe(S, !1), S.strm.avail_out === 0))
          return N;
      } else if (S.match_available) {
        if (G = e._tr_tally(S, 0, S.window[S.strstart - 1]), G && Pe(S, !1), S.strstart++, S.lookahead--, S.strm.avail_out === 0)
          return N;
      } else
        S.match_available = 1, S.strstart++, S.lookahead--;
    }
    return S.match_available && (G = e._tr_tally(S, 0, S.window[S.strstart - 1]), S.match_available = 0), S.insert = S.strstart < be - 1 ? S.strstart : be - 1, Ie === c ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function Le(S, Ie) {
    for (var Fe, G, _e, De, Ze = S.window; ; ) {
      if (S.lookahead <= ce) {
        if (Ae(S), S.lookahead <= ce && Ie === a)
          return N;
        if (S.lookahead === 0)
          break;
      }
      if (S.match_length = 0, S.lookahead >= be && S.strstart > 0 && (_e = S.strstart - 1, G = Ze[_e], G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e])) {
        De = S.strstart + ce;
        do
          ;
        while (G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && G === Ze[++_e] && _e < De);
        S.match_length = ce - (De - _e), S.match_length > S.lookahead && (S.match_length = S.lookahead);
      }
      if (S.match_length >= be ? (Fe = e._tr_tally(S, 1, S.match_length - be), S.lookahead -= S.match_length, S.strstart += S.match_length, S.match_length = 0) : (Fe = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++), Fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === c ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function je(S, Ie) {
    for (var Fe; ; ) {
      if (S.lookahead === 0 && (Ae(S), S.lookahead === 0)) {
        if (Ie === a)
          return N;
        break;
      }
      if (S.match_length = 0, Fe = e._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++, Fe && (Pe(S, !1), S.strm.avail_out === 0))
        return N;
    }
    return S.insert = 0, Ie === c ? (Pe(S, !0), S.strm.avail_out === 0 ? ne : F) : S.last_lit && (Pe(S, !1), S.strm.avail_out === 0) ? N : re;
  }
  function ke(S, Ie, Fe, G, _e) {
    this.good_length = S, this.max_lazy = Ie, this.nice_length = Fe, this.max_chain = G, this.func = _e;
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
  function s() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = $, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new t.Buf16(de * 2), this.dyn_dtree = new t.Buf16((2 * D + 1) * 2), this.bl_tree = new t.Buf16((2 * ie + 1) * 2), Ee(this.dyn_ltree), Ee(this.dyn_dtree), Ee(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new t.Buf16(we + 1), this.heap = new t.Buf16(2 * g + 1), Ee(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new t.Buf16(2 * g + 1), Ee(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function _(S) {
    var Ie;
    return !S || !S.state ? H(S, w) : (S.total_in = S.total_out = 0, S.data_type = T, Ie = S.state, Ie.pending = 0, Ie.pending_out = 0, Ie.wrap < 0 && (Ie.wrap = -Ie.wrap), Ie.status = Ie.wrap ? pe : O, S.adler = Ie.wrap === 2 ? 0 : 1, Ie.last_flush = a, e._tr_init(Ie), u);
  }
  function W(S) {
    var Ie = _(S);
    return Ie === u && U(S.state), Ie;
  }
  function ue(S, Ie) {
    return !S || !S.state || S.state.wrap !== 2 ? w : (S.state.gzhead = Ie, u);
  }
  function J(S, Ie, Fe, G, _e, De) {
    if (!S)
      return w;
    var Ze = 1;
    if (Ie === q && (Ie = 6), G < 0 ? (Ze = 0, G = -G) : G > 15 && (Ze = 2, G -= 16), _e < 1 || _e > x || Fe !== $ || G < 8 || G > 15 || Ie < 0 || Ie > 9 || De < 0 || De > E)
      return H(S, w);
    G === 8 && (G = 9);
    var K = new s();
    return S.state = K, K.strm = S, K.wrap = Ze, K.gzhead = null, K.w_bits = G, K.w_size = 1 << K.w_bits, K.w_mask = K.w_size - 1, K.hash_bits = _e + 7, K.hash_size = 1 << K.hash_bits, K.hash_mask = K.hash_size - 1, K.hash_shift = ~~((K.hash_bits + be - 1) / be), K.window = new t.Buf8(K.w_size * 2), K.head = new t.Buf16(K.hash_size), K.prev = new t.Buf16(K.w_size), K.lit_bufsize = 1 << _e + 6, K.pending_buf_size = K.lit_bufsize * 4, K.pending_buf = new t.Buf8(K.pending_buf_size), K.d_buf = 1 * K.lit_bufsize, K.l_buf = 3 * K.lit_bufsize, K.level = Ie, K.strategy = De, K.method = Fe, W(S);
  }
  function he(S, Ie) {
    return J(S, Ie, $, j, V, I);
  }
  function k(S, Ie) {
    var Fe, G, _e, De;
    if (!S || !S.state || Ie > y || Ie < 0)
      return S ? H(S, w) : w;
    if (G = S.state, !S.output || !S.input && S.avail_in !== 0 || G.status === B && Ie !== c)
      return H(S, S.avail_out === 0 ? h : w);
    if (G.strm = S, Fe = G.last_flush, G.last_flush = Ie, G.status === pe)
      if (G.wrap === 2)
        S.adler = 0, Oe(G, 31), Oe(G, 139), Oe(G, 8), G.gzhead ? (Oe(
          G,
          (G.gzhead.text ? 1 : 0) + (G.gzhead.hcrc ? 2 : 0) + (G.gzhead.extra ? 4 : 0) + (G.gzhead.name ? 8 : 0) + (G.gzhead.comment ? 16 : 0)
        ), Oe(G, G.gzhead.time & 255), Oe(G, G.gzhead.time >> 8 & 255), Oe(G, G.gzhead.time >> 16 & 255), Oe(G, G.gzhead.time >> 24 & 255), Oe(G, G.level === 9 ? 2 : G.strategy >= v || G.level < 2 ? 4 : 0), Oe(G, G.gzhead.os & 255), G.gzhead.extra && G.gzhead.extra.length && (Oe(G, G.gzhead.extra.length & 255), Oe(G, G.gzhead.extra.length >> 8 & 255)), G.gzhead.hcrc && (S.adler = o(S.adler, G.pending_buf, G.pending, 0)), G.gzindex = 0, G.status = ee) : (Oe(G, 0), Oe(G, 0), Oe(G, 0), Oe(G, 0), Oe(G, 0), Oe(G, G.level === 9 ? 2 : G.strategy >= v || G.level < 2 ? 4 : 0), Oe(G, L), G.status = O);
      else {
        var Ze = $ + (G.w_bits - 8 << 4) << 8, K = -1;
        G.strategy >= v || G.level < 2 ? K = 0 : G.level < 6 ? K = 1 : G.level === 6 ? K = 2 : K = 3, Ze |= K << 6, G.strstart !== 0 && (Ze |= M), Ze += 31 - Ze % 31, G.status = O, te(G, Ze), G.strstart !== 0 && (te(G, S.adler >>> 16), te(G, S.adler & 65535)), S.adler = 1;
      }
    if (G.status === ee)
      if (G.gzhead.extra) {
        for (_e = G.pending; G.gzindex < (G.gzhead.extra.length & 65535) && !(G.pending === G.pending_buf_size && (G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), Re(S), _e = G.pending, G.pending === G.pending_buf_size)); )
          Oe(G, G.gzhead.extra[G.gzindex] & 255), G.gzindex++;
        G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), G.gzindex === G.gzhead.extra.length && (G.gzindex = 0, G.status = Q);
      } else
        G.status = Q;
    if (G.status === Q)
      if (G.gzhead.name) {
        _e = G.pending;
        do {
          if (G.pending === G.pending_buf_size && (G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), Re(S), _e = G.pending, G.pending === G.pending_buf_size)) {
            De = 1;
            break;
          }
          G.gzindex < G.gzhead.name.length ? De = G.gzhead.name.charCodeAt(G.gzindex++) & 255 : De = 0, Oe(G, De);
        } while (De !== 0);
        G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), De === 0 && (G.gzindex = 0, G.status = Z);
      } else
        G.status = Z;
    if (G.status === Z)
      if (G.gzhead.comment) {
        _e = G.pending;
        do {
          if (G.pending === G.pending_buf_size && (G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), Re(S), _e = G.pending, G.pending === G.pending_buf_size)) {
            De = 1;
            break;
          }
          G.gzindex < G.gzhead.comment.length ? De = G.gzhead.comment.charCodeAt(G.gzindex++) & 255 : De = 0, Oe(G, De);
        } while (De !== 0);
        G.gzhead.hcrc && G.pending > _e && (S.adler = o(S.adler, G.pending_buf, G.pending - _e, _e)), De === 0 && (G.status = le);
      } else
        G.status = le;
    if (G.status === le && (G.gzhead.hcrc ? (G.pending + 2 > G.pending_buf_size && Re(S), G.pending + 2 <= G.pending_buf_size && (Oe(G, S.adler & 255), Oe(G, S.adler >> 8 & 255), S.adler = 0, G.status = O)) : G.status = O), G.pending !== 0) {
      if (Re(S), S.avail_out === 0)
        return G.last_flush = -1, u;
    } else if (S.avail_in === 0 && se(Ie) <= se(Fe) && Ie !== c)
      return H(S, h);
    if (G.status === B && S.avail_in !== 0)
      return H(S, h);
    if (S.avail_in !== 0 || G.lookahead !== 0 || Ie !== a && G.status !== B) {
      var b = G.strategy === v ? je(G, Ie) : G.strategy === P ? Le(G, Ie) : He[G.level].func(G, Ie);
      if ((b === ne || b === F) && (G.status = B), b === N || b === ne)
        return S.avail_out === 0 && (G.last_flush = -1), u;
      if (b === re && (Ie === f ? e._tr_align(G) : Ie !== y && (e._tr_stored_block(G, 0, 0, !1), Ie === l && (Ee(G.head), G.lookahead === 0 && (G.strstart = 0, G.block_start = 0, G.insert = 0))), Re(S), S.avail_out === 0))
        return G.last_flush = -1, u;
    }
    return Ie !== c ? u : G.wrap <= 0 ? m : (G.wrap === 2 ? (Oe(G, S.adler & 255), Oe(G, S.adler >> 8 & 255), Oe(G, S.adler >> 16 & 255), Oe(G, S.adler >> 24 & 255), Oe(G, S.total_in & 255), Oe(G, S.total_in >> 8 & 255), Oe(G, S.total_in >> 16 & 255), Oe(G, S.total_in >> 24 & 255)) : (te(G, S.adler >>> 16), te(G, S.adler & 65535)), Re(S), G.wrap > 0 && (G.wrap = -G.wrap), G.pending !== 0 ? u : m);
  }
  function Be(S) {
    var Ie;
    return !S || !S.state ? w : (Ie = S.state.status, Ie !== pe && Ie !== ee && Ie !== Q && Ie !== Z && Ie !== le && Ie !== O && Ie !== B ? H(S, w) : (S.state = null, Ie === O ? H(S, R) : u));
  }
  function We(S, Ie) {
    var Fe = Ie.length, G, _e, De, Ze, K, b, p, A;
    if (!S || !S.state || (G = S.state, Ze = G.wrap, Ze === 2 || Ze === 1 && G.status !== pe || G.lookahead))
      return w;
    for (Ze === 1 && (S.adler = n(S.adler, Ie, Fe, 0)), G.wrap = 0, Fe >= G.w_size && (Ze === 0 && (Ee(G.head), G.strstart = 0, G.block_start = 0, G.insert = 0), A = new t.Buf8(G.w_size), t.arraySet(A, Ie, Fe - G.w_size, G.w_size, 0), Ie = A, Fe = G.w_size), K = S.avail_in, b = S.next_in, p = S.input, S.avail_in = Fe, S.next_in = 0, S.input = Ie, Ae(G); G.lookahead >= be; ) {
      _e = G.strstart, De = G.lookahead - (be - 1);
      do
        G.ins_h = (G.ins_h << G.hash_shift ^ G.window[_e + be - 1]) & G.hash_mask, G.prev[_e & G.w_mask] = G.head[G.ins_h], G.head[G.ins_h] = _e, _e++;
      while (--De);
      G.strstart = _e, G.lookahead = be - 1, Ae(G);
    }
    return G.strstart += G.lookahead, G.block_start = G.strstart, G.insert = G.lookahead, G.lookahead = 0, G.match_length = G.prev_length = be - 1, G.match_available = 0, S.next_in = b, S.input = p, S.avail_in = K, G.wrap = Ze, u;
  }
  return deflate.deflateInit = he, deflate.deflateInit2 = J, deflate.deflateReset = W, deflate.deflateResetKeep = _, deflate.deflateSetHeader = ue, deflate.deflate = k, deflate.deflateEnd = Be, deflate.deflateSetDictionary = We, deflate.deflateInfo = "pako deflate (from Nodeca project)", deflate;
}
var inflate = {}, inffast, hasRequiredInffast;
function requireInffast() {
  if (hasRequiredInffast) return inffast;
  hasRequiredInffast = 1;
  var t = 30, e = 12;
  return inffast = function(o, r) {
    var a, f, l, c, y, u, m, w, R, h, q, d, v, P, E, I, T, $, x, j, V, C, z, g, D;
    a = o.state, f = o.next_in, g = o.input, l = f + (o.avail_in - 5), c = o.next_out, D = o.output, y = c - (r - o.avail_out), u = c + (o.avail_out - 257), m = a.dmax, w = a.wsize, R = a.whave, h = a.wnext, q = a.window, d = a.hold, v = a.bits, P = a.lencode, E = a.distcode, I = (1 << a.lenbits) - 1, T = (1 << a.distbits) - 1;
    e:
      do {
        v < 15 && (d += g[f++] << v, v += 8, d += g[f++] << v, v += 8), $ = P[d & I];
        r:
          for (; ; ) {
            if (x = $ >>> 24, d >>>= x, v -= x, x = $ >>> 16 & 255, x === 0)
              D[c++] = $ & 65535;
            else if (x & 16) {
              j = $ & 65535, x &= 15, x && (v < x && (d += g[f++] << v, v += 8), j += d & (1 << x) - 1, d >>>= x, v -= x), v < 15 && (d += g[f++] << v, v += 8, d += g[f++] << v, v += 8), $ = E[d & T];
              t:
                for (; ; ) {
                  if (x = $ >>> 24, d >>>= x, v -= x, x = $ >>> 16 & 255, x & 16) {
                    if (V = $ & 65535, x &= 15, v < x && (d += g[f++] << v, v += 8, v < x && (d += g[f++] << v, v += 8)), V += d & (1 << x) - 1, V > m) {
                      o.msg = "invalid distance too far back", a.mode = t;
                      break e;
                    }
                    if (d >>>= x, v -= x, x = c - y, V > x) {
                      if (x = V - x, x > R && a.sane) {
                        o.msg = "invalid distance too far back", a.mode = t;
                        break e;
                      }
                      if (C = 0, z = q, h === 0) {
                        if (C += w - x, x < j) {
                          j -= x;
                          do
                            D[c++] = q[C++];
                          while (--x);
                          C = c - V, z = D;
                        }
                      } else if (h < x) {
                        if (C += w + h - x, x -= h, x < j) {
                          j -= x;
                          do
                            D[c++] = q[C++];
                          while (--x);
                          if (C = 0, h < j) {
                            x = h, j -= x;
                            do
                              D[c++] = q[C++];
                            while (--x);
                            C = c - V, z = D;
                          }
                        }
                      } else if (C += h - x, x < j) {
                        j -= x;
                        do
                          D[c++] = q[C++];
                        while (--x);
                        C = c - V, z = D;
                      }
                      for (; j > 2; )
                        D[c++] = z[C++], D[c++] = z[C++], D[c++] = z[C++], j -= 3;
                      j && (D[c++] = z[C++], j > 1 && (D[c++] = z[C++]));
                    } else {
                      C = c - V;
                      do
                        D[c++] = D[C++], D[c++] = D[C++], D[c++] = D[C++], j -= 3;
                      while (j > 2);
                      j && (D[c++] = D[C++], j > 1 && (D[c++] = D[C++]));
                    }
                  } else if ((x & 64) === 0) {
                    $ = E[($ & 65535) + (d & (1 << x) - 1)];
                    continue t;
                  } else {
                    o.msg = "invalid distance code", a.mode = t;
                    break e;
                  }
                  break;
                }
            } else if ((x & 64) === 0) {
              $ = P[($ & 65535) + (d & (1 << x) - 1)];
              continue r;
            } else if (x & 32) {
              a.mode = e;
              break e;
            } else {
              o.msg = "invalid literal/length code", a.mode = t;
              break e;
            }
            break;
          }
      } while (f < l && c < u);
    j = v >> 3, f -= j, v -= j << 3, d &= (1 << v) - 1, o.next_in = f, o.next_out = c, o.avail_in = f < l ? 5 + (l - f) : 5 - (f - l), o.avail_out = c < u ? 257 + (u - c) : 257 - (c - u), a.hold = d, a.bits = v;
  }, inffast;
}
var inftrees, hasRequiredInftrees;
function requireInftrees() {
  if (hasRequiredInftrees) return inftrees;
  hasRequiredInftrees = 1;
  var t = requireCommon(), e = 15, n = 852, o = 592, r = 0, a = 1, f = 2, l = [
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
  ], c = [
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
  ], y = [
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
  ], u = [
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
  return inftrees = function(w, R, h, q, d, v, P, E) {
    var I = E.bits, T = 0, $ = 0, x = 0, j = 0, V = 0, C = 0, z = 0, g = 0, D = 0, ie = 0, de, we, be, ce, fe, M = null, pe = 0, ee, Q = new t.Buf16(e + 1), Z = new t.Buf16(e + 1), le = null, O = 0, B, N, re;
    for (T = 0; T <= e; T++)
      Q[T] = 0;
    for ($ = 0; $ < q; $++)
      Q[R[h + $]]++;
    for (V = I, j = e; j >= 1 && Q[j] === 0; j--)
      ;
    if (V > j && (V = j), j === 0)
      return d[v++] = 1 << 24 | 64 << 16 | 0, d[v++] = 1 << 24 | 64 << 16 | 0, E.bits = 1, 0;
    for (x = 1; x < j && Q[x] === 0; x++)
      ;
    for (V < x && (V = x), g = 1, T = 1; T <= e; T++)
      if (g <<= 1, g -= Q[T], g < 0)
        return -1;
    if (g > 0 && (w === r || j !== 1))
      return -1;
    for (Z[1] = 0, T = 1; T < e; T++)
      Z[T + 1] = Z[T] + Q[T];
    for ($ = 0; $ < q; $++)
      R[h + $] !== 0 && (P[Z[R[h + $]]++] = $);
    if (w === r ? (M = le = P, ee = 19) : w === a ? (M = l, pe -= 257, le = c, O -= 257, ee = 256) : (M = y, le = u, ee = -1), ie = 0, $ = 0, T = x, fe = v, C = V, z = 0, be = -1, D = 1 << V, ce = D - 1, w === a && D > n || w === f && D > o)
      return 1;
    for (; ; ) {
      B = T - z, P[$] < ee ? (N = 0, re = P[$]) : P[$] > ee ? (N = le[O + P[$]], re = M[pe + P[$]]) : (N = 96, re = 0), de = 1 << T - z, we = 1 << C, x = we;
      do
        we -= de, d[fe + (ie >> z) + we] = B << 24 | N << 16 | re | 0;
      while (we !== 0);
      for (de = 1 << T - 1; ie & de; )
        de >>= 1;
      if (de !== 0 ? (ie &= de - 1, ie += de) : ie = 0, $++, --Q[T] === 0) {
        if (T === j)
          break;
        T = R[h + P[$]];
      }
      if (T > V && (ie & ce) !== be) {
        for (z === 0 && (z = V), fe += x, C = T - z, g = 1 << C; C + z < j && (g -= Q[C + z], !(g <= 0)); )
          C++, g <<= 1;
        if (D += 1 << C, w === a && D > n || w === f && D > o)
          return 1;
        be = ie & ce, d[be] = V << 24 | C << 16 | fe - v | 0;
      }
    }
    return ie !== 0 && (d[fe + ie] = T - z << 24 | 64 << 16 | 0), E.bits = V, 0;
  }, inftrees;
}
var hasRequiredInflate;
function requireInflate() {
  if (hasRequiredInflate) return inflate;
  hasRequiredInflate = 1;
  var t = requireCommon(), e = requireAdler32(), n = requireCrc32(), o = requireInffast(), r = requireInftrees(), a = 0, f = 1, l = 2, c = 4, y = 5, u = 6, m = 0, w = 1, R = 2, h = -2, q = -3, d = -4, v = -5, P = 8, E = 1, I = 2, T = 3, $ = 4, x = 5, j = 6, V = 7, C = 8, z = 9, g = 10, D = 11, ie = 12, de = 13, we = 14, be = 15, ce = 16, fe = 17, M = 18, pe = 19, ee = 20, Q = 21, Z = 22, le = 23, O = 24, B = 25, N = 26, re = 27, ne = 28, F = 29, L = 30, H = 31, se = 32, Ee = 852, Re = 592, Pe = 15, Oe = Pe;
  function te(J) {
    return (J >>> 24 & 255) + (J >>> 8 & 65280) + ((J & 65280) << 8) + ((J & 255) << 24);
  }
  function $e() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new t.Buf16(320), this.work = new t.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function Ce(J) {
    var he;
    return !J || !J.state ? h : (he = J.state, J.total_in = J.total_out = he.total = 0, J.msg = "", he.wrap && (J.adler = he.wrap & 1), he.mode = E, he.last = 0, he.havedict = 0, he.dmax = 32768, he.head = null, he.hold = 0, he.bits = 0, he.lencode = he.lendyn = new t.Buf32(Ee), he.distcode = he.distdyn = new t.Buf32(Re), he.sane = 1, he.back = -1, m);
  }
  function Ae(J) {
    var he;
    return !J || !J.state ? h : (he = J.state, he.wsize = 0, he.whave = 0, he.wnext = 0, Ce(J));
  }
  function Ue(J, he) {
    var k, Be;
    return !J || !J.state || (Be = J.state, he < 0 ? (k = 0, he = -he) : (k = (he >> 4) + 1, he < 48 && (he &= 15)), he && (he < 8 || he > 15)) ? h : (Be.window !== null && Be.wbits !== he && (Be.window = null), Be.wrap = k, Be.wbits = he, Ae(J));
  }
  function ge(J, he) {
    var k, Be;
    return J ? (Be = new $e(), J.state = Be, Be.window = null, k = Ue(J, he), k !== m && (J.state = null), k) : h;
  }
  function Se(J) {
    return ge(J, Oe);
  }
  var Le = !0, je, ke;
  function He(J) {
    if (Le) {
      var he;
      for (je = new t.Buf32(512), ke = new t.Buf32(32), he = 0; he < 144; )
        J.lens[he++] = 8;
      for (; he < 256; )
        J.lens[he++] = 9;
      for (; he < 280; )
        J.lens[he++] = 7;
      for (; he < 288; )
        J.lens[he++] = 8;
      for (r(f, J.lens, 0, 288, je, 0, J.work, { bits: 9 }), he = 0; he < 32; )
        J.lens[he++] = 5;
      r(l, J.lens, 0, 32, ke, 0, J.work, { bits: 5 }), Le = !1;
    }
    J.lencode = je, J.lenbits = 9, J.distcode = ke, J.distbits = 5;
  }
  function U(J, he, k, Be) {
    var We, S = J.state;
    return S.window === null && (S.wsize = 1 << S.wbits, S.wnext = 0, S.whave = 0, S.window = new t.Buf8(S.wsize)), Be >= S.wsize ? (t.arraySet(S.window, he, k - S.wsize, S.wsize, 0), S.wnext = 0, S.whave = S.wsize) : (We = S.wsize - S.wnext, We > Be && (We = Be), t.arraySet(S.window, he, k - Be, We, S.wnext), Be -= We, Be ? (t.arraySet(S.window, he, k - Be, Be, 0), S.wnext = Be, S.whave = S.wsize) : (S.wnext += We, S.wnext === S.wsize && (S.wnext = 0), S.whave < S.wsize && (S.whave += We))), 0;
  }
  function s(J, he) {
    var k, Be, We, S, Ie, Fe, G, _e, De, Ze, K, b, p, A, Y = 0, ye, qe, ae, oe, me, xe, Te, Me, Ve = new t.Buf8(4), Xe, Ye, nr = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!J || !J.state || !J.output || !J.input && J.avail_in !== 0)
      return h;
    k = J.state, k.mode === ie && (k.mode = de), Ie = J.next_out, We = J.output, G = J.avail_out, S = J.next_in, Be = J.input, Fe = J.avail_in, _e = k.hold, De = k.bits, Ze = Fe, K = G, Me = m;
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
            if (_e >>>= 4, De -= 4, Te = (_e & 15) + 8, k.wbits === 0)
              k.wbits = Te;
            else if (Te > k.wbits) {
              J.msg = "invalid window size", k.mode = L;
              break;
            }
            k.dmax = 1 << Te, J.adler = k.check = 1, k.mode = _e & 512 ? g : ie, _e = 0, De = 0;
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
            k.head && (k.head.text = _e >> 8 & 1), k.flags & 512 && (Ve[0] = _e & 255, Ve[1] = _e >>> 8 & 255, k.check = n(k.check, Ve, 2, 0)), _e = 0, De = 0, k.mode = T;
          /* falls through */
          case T:
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
            k.mode = j;
          /* falls through */
          case j:
            if (k.flags & 1024 && (b = k.length, b > Fe && (b = Fe), b && (k.head && (Te = k.head.extra_len - k.length, k.head.extra || (k.head.extra = new Array(k.head.extra_len)), t.arraySet(
              k.head.extra,
              Be,
              S,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              b,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Te
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
                Te = Be[S + b++], k.head && Te && k.length < 65536 && (k.head.name += String.fromCharCode(Te));
              while (Te && b < Fe);
              if (k.flags & 512 && (k.check = n(k.check, Be, b, S)), Fe -= b, S += b, Te)
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
                Te = Be[S + b++], k.head && Te && k.length < 65536 && (k.head.comment += String.fromCharCode(Te));
              while (Te && b < Fe);
              if (k.flags & 512 && (k.check = n(k.check, Be, b, S)), Fe -= b, S += b, Te)
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
          case g:
            for (; De < 32; ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            J.adler = k.check = te(_e), _e = 0, De = 0, k.mode = D;
          /* falls through */
          case D:
            if (k.havedict === 0)
              return J.next_out = Ie, J.avail_out = G, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, R;
            J.adler = k.check = 1, k.mode = ie;
          /* falls through */
          case ie:
            if (he === y || he === u)
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
                if (He(k), k.mode = ee, he === u) {
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
            if (k.length = _e & 65535, _e = 0, De = 0, k.mode = be, he === u)
              break e;
          /* falls through */
          case be:
            k.mode = ce;
          /* falls through */
          case ce:
            if (b = k.length, b) {
              if (b > Fe && (b = Fe), b > G && (b = G), b === 0)
                break e;
              t.arraySet(We, Be, S, b, Ie), Fe -= b, S += b, G -= b, Ie += b, k.length -= b;
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
            k.have = 0, k.mode = M;
          /* falls through */
          case M:
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
            if (k.lencode = k.lendyn, k.lenbits = 7, Xe = { bits: k.lenbits }, Me = r(a, k.lens, 0, 19, k.lencode, 0, k.work, Xe), k.lenbits = Xe.bits, Me) {
              J.msg = "invalid code lengths set", k.mode = L;
              break;
            }
            k.have = 0, k.mode = pe;
          /* falls through */
          case pe:
            for (; k.have < k.nlen + k.ndist; ) {
              for (; Y = k.lencode[_e & (1 << k.lenbits) - 1], ye = Y >>> 24, qe = Y >>> 16 & 255, ae = Y & 65535, !(ye <= De); ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              if (ae < 16)
                _e >>>= ye, De -= ye, k.lens[k.have++] = ae;
              else {
                if (ae === 16) {
                  for (Ye = ye + 2; De < Ye; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  if (_e >>>= ye, De -= ye, k.have === 0) {
                    J.msg = "invalid bit length repeat", k.mode = L;
                    break;
                  }
                  Te = k.lens[k.have - 1], b = 3 + (_e & 3), _e >>>= 2, De -= 2;
                } else if (ae === 17) {
                  for (Ye = ye + 3; De < Ye; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  _e >>>= ye, De -= ye, Te = 0, b = 3 + (_e & 7), _e >>>= 3, De -= 3;
                } else {
                  for (Ye = ye + 7; De < Ye; ) {
                    if (Fe === 0)
                      break e;
                    Fe--, _e += Be[S++] << De, De += 8;
                  }
                  _e >>>= ye, De -= ye, Te = 0, b = 11 + (_e & 127), _e >>>= 7, De -= 7;
                }
                if (k.have + b > k.nlen + k.ndist) {
                  J.msg = "invalid bit length repeat", k.mode = L;
                  break;
                }
                for (; b--; )
                  k.lens[k.have++] = Te;
              }
            }
            if (k.mode === L)
              break;
            if (k.lens[256] === 0) {
              J.msg = "invalid code -- missing end-of-block", k.mode = L;
              break;
            }
            if (k.lenbits = 9, Xe = { bits: k.lenbits }, Me = r(f, k.lens, 0, k.nlen, k.lencode, 0, k.work, Xe), k.lenbits = Xe.bits, Me) {
              J.msg = "invalid literal/lengths set", k.mode = L;
              break;
            }
            if (k.distbits = 6, k.distcode = k.distdyn, Xe = { bits: k.distbits }, Me = r(l, k.lens, k.nlen, k.ndist, k.distcode, 0, k.work, Xe), k.distbits = Xe.bits, Me) {
              J.msg = "invalid distances set", k.mode = L;
              break;
            }
            if (k.mode = ee, he === u)
              break e;
          /* falls through */
          case ee:
            k.mode = Q;
          /* falls through */
          case Q:
            if (Fe >= 6 && G >= 258) {
              J.next_out = Ie, J.avail_out = G, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, o(J, K), Ie = J.next_out, We = J.output, G = J.avail_out, S = J.next_in, Be = J.input, Fe = J.avail_in, _e = k.hold, De = k.bits, k.mode === ie && (k.back = -1);
              break;
            }
            for (k.back = 0; Y = k.lencode[_e & (1 << k.lenbits) - 1], ye = Y >>> 24, qe = Y >>> 16 & 255, ae = Y & 65535, !(ye <= De); ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if (qe && (qe & 240) === 0) {
              for (oe = ye, me = qe, xe = ae; Y = k.lencode[xe + ((_e & (1 << oe + me) - 1) >> oe)], ye = Y >>> 24, qe = Y >>> 16 & 255, ae = Y & 65535, !(oe + ye <= De); ) {
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
            k.extra = qe & 15, k.mode = Z;
          /* falls through */
          case Z:
            if (k.extra) {
              for (Ye = k.extra; De < Ye; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e += Be[S++] << De, De += 8;
              }
              k.length += _e & (1 << k.extra) - 1, _e >>>= k.extra, De -= k.extra, k.back += k.extra;
            }
            k.was = k.length, k.mode = le;
          /* falls through */
          case le:
            for (; Y = k.distcode[_e & (1 << k.distbits) - 1], ye = Y >>> 24, qe = Y >>> 16 & 255, ae = Y & 65535, !(ye <= De); ) {
              if (Fe === 0)
                break e;
              Fe--, _e += Be[S++] << De, De += 8;
            }
            if ((qe & 240) === 0) {
              for (oe = ye, me = qe, xe = ae; Y = k.distcode[xe + ((_e & (1 << oe + me) - 1) >> oe)], ye = Y >>> 24, qe = Y >>> 16 & 255, ae = Y & 65535, !(oe + ye <= De); ) {
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
              for (Ye = k.extra; De < Ye; ) {
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
            if (G === 0)
              break e;
            if (b = K - G, k.offset > b) {
              if (b = k.offset - b, b > k.whave && k.sane) {
                J.msg = "invalid distance too far back", k.mode = L;
                break;
              }
              b > k.wnext ? (b -= k.wnext, p = k.wsize - b) : p = k.wnext - b, b > k.length && (b = k.length), A = k.window;
            } else
              A = We, p = Ie - k.offset, b = k.length;
            b > G && (b = G), G -= b, k.length -= b;
            do
              We[Ie++] = A[p++];
            while (--b);
            k.length === 0 && (k.mode = Q);
            break;
          case N:
            if (G === 0)
              break e;
            We[Ie++] = k.length, G--, k.mode = Q;
            break;
          case re:
            if (k.wrap) {
              for (; De < 32; ) {
                if (Fe === 0)
                  break e;
                Fe--, _e |= Be[S++] << De, De += 8;
              }
              if (K -= G, J.total_out += K, k.total += K, K && (J.adler = k.check = /*UPDATE(state.check, put - _out, _out);*/
              k.flags ? n(k.check, We, K, Ie - K) : e(k.check, We, K, Ie - K)), K = G, (k.flags ? _e : te(_e)) !== k.check) {
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
            Me = w;
            break e;
          case L:
            Me = q;
            break e;
          case H:
            return d;
          case se:
          /* falls through */
          default:
            return h;
        }
    return J.next_out = Ie, J.avail_out = G, J.next_in = S, J.avail_in = Fe, k.hold = _e, k.bits = De, (k.wsize || K !== J.avail_out && k.mode < L && (k.mode < re || he !== c)) && U(J, J.output, J.next_out, K - J.avail_out), Ze -= J.avail_in, K -= J.avail_out, J.total_in += Ze, J.total_out += K, k.total += K, k.wrap && K && (J.adler = k.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    k.flags ? n(k.check, We, K, J.next_out - K) : e(k.check, We, K, J.next_out - K)), J.data_type = k.bits + (k.last ? 64 : 0) + (k.mode === ie ? 128 : 0) + (k.mode === ee || k.mode === be ? 256 : 0), (Ze === 0 && K === 0 || he === c) && Me === m && (Me = v), Me;
  }
  function _(J) {
    if (!J || !J.state)
      return h;
    var he = J.state;
    return he.window && (he.window = null), J.state = null, m;
  }
  function W(J, he) {
    var k;
    return !J || !J.state || (k = J.state, (k.wrap & 2) === 0) ? h : (k.head = he, he.done = !1, m);
  }
  function ue(J, he) {
    var k = he.length, Be, We, S;
    return !J || !J.state || (Be = J.state, Be.wrap !== 0 && Be.mode !== D) ? h : Be.mode === D && (We = 1, We = e(We, he, k, 0), We !== Be.check) ? q : (S = U(J, he, k, k), S ? (Be.mode = H, d) : (Be.havedict = 1, m));
  }
  return inflate.inflateReset = Ae, inflate.inflateReset2 = Ue, inflate.inflateResetKeep = Ce, inflate.inflateInit = Se, inflate.inflateInit2 = ge, inflate.inflate = s, inflate.inflateEnd = _, inflate.inflateGetHeader = W, inflate.inflateSetDictionary = ue, inflate.inflateInfo = "pako inflate (from Nodeca project)", inflate;
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
    var e = requireAssert(), n = requireZstream(), o = requireDeflate(), r = requireInflate(), a = requireConstants();
    for (var f in a)
      t[f] = a[f];
    t.NONE = 0, t.DEFLATE = 1, t.INFLATE = 2, t.GZIP = 3, t.GUNZIP = 4, t.DEFLATERAW = 5, t.INFLATERAW = 6, t.UNZIP = 7;
    var l = 31, c = 139;
    function y(u) {
      if (typeof u != "number" || u < t.DEFLATE || u > t.UNZIP)
        throw new TypeError("Bad argument");
      this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = u, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0;
    }
    y.prototype.close = function() {
      if (this.write_in_progress) {
        this.pending_close = !0;
        return;
      }
      this.pending_close = !1, e(this.init_done, "close before init"), e(this.mode <= t.UNZIP), this.mode === t.DEFLATE || this.mode === t.GZIP || this.mode === t.DEFLATERAW ? o.deflateEnd(this.strm) : (this.mode === t.INFLATE || this.mode === t.GUNZIP || this.mode === t.INFLATERAW || this.mode === t.UNZIP) && r.inflateEnd(this.strm), this.mode = t.NONE, this.dictionary = null;
    }, y.prototype.write = function(u, m, w, R, h, q, d) {
      return this._write(!0, u, m, w, R, h, q, d);
    }, y.prototype.writeSync = function(u, m, w, R, h, q, d) {
      return this._write(!1, u, m, w, R, h, q, d);
    }, y.prototype._write = function(u, m, w, R, h, q, d, v) {
      if (e.equal(arguments.length, 8), e(this.init_done, "write before init"), e(this.mode !== t.NONE, "already finalized"), e.equal(!1, this.write_in_progress, "write already in progress"), e.equal(!1, this.pending_close, "close is pending"), this.write_in_progress = !0, e.equal(!1, m === void 0, "must provide flush value"), this.write_in_progress = !0, m !== t.Z_NO_FLUSH && m !== t.Z_PARTIAL_FLUSH && m !== t.Z_SYNC_FLUSH && m !== t.Z_FULL_FLUSH && m !== t.Z_FINISH && m !== t.Z_BLOCK)
        throw new Error("Invalid flush value");
      if (w == null && (w = Buffer.alloc(0), h = 0, R = 0), this.strm.avail_in = h, this.strm.input = w, this.strm.next_in = R, this.strm.avail_out = v, this.strm.output = q, this.strm.next_out = d, this.flush = m, !u)
        return this._process(), this._checkError() ? this._afterSync() : void 0;
      var P = this;
      return process$1.nextTick(function() {
        P._process(), P._after();
      }), this;
    }, y.prototype._afterSync = function() {
      var u = this.strm.avail_out, m = this.strm.avail_in;
      return this.write_in_progress = !1, [m, u];
    }, y.prototype._process = function() {
      var u = null;
      switch (this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = o.deflate(this.strm, this.flush);
          break;
        case t.UNZIP:
          switch (this.strm.avail_in > 0 && (u = this.strm.next_in), this.gzip_id_bytes_read) {
            case 0:
              if (u === null)
                break;
              if (this.strm.input[u] === l) {
                if (this.gzip_id_bytes_read = 1, u++, this.strm.avail_in === 1)
                  break;
              } else {
                this.mode = t.INFLATE;
                break;
              }
            // fallthrough
            case 1:
              if (u === null)
                break;
              this.strm.input[u] === c ? (this.gzip_id_bytes_read = 2, this.mode = t.GUNZIP) : this.mode = t.INFLATE;
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
    }, y.prototype._checkError = function() {
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
    }, y.prototype._after = function() {
      if (this._checkError()) {
        var u = this.strm.avail_out, m = this.strm.avail_in;
        this.write_in_progress = !1, this.callback(m, u), this.pending_close && this.close();
      }
    }, y.prototype._error = function(u) {
      this.strm.msg && (u = this.strm.msg), this.onerror(
        u,
        this.err
        // no hope of rescue.
      ), this.write_in_progress = !1, this.pending_close && this.close();
    }, y.prototype.init = function(u, m, w, R, h) {
      e(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])"), e(u >= 8 && u <= 15, "invalid windowBits"), e(m >= -1 && m <= 9, "invalid compression level"), e(w >= 1 && w <= 9, "invalid memlevel"), e(R === t.Z_FILTERED || R === t.Z_HUFFMAN_ONLY || R === t.Z_RLE || R === t.Z_FIXED || R === t.Z_DEFAULT_STRATEGY, "invalid strategy"), this._init(m, u, w, R, h), this._setDictionary();
    }, y.prototype.params = function() {
      throw new Error("deflateParams Not supported");
    }, y.prototype.reset = function() {
      this._reset(), this._setDictionary();
    }, y.prototype._init = function(u, m, w, R, h) {
      switch (this.level = u, this.windowBits = m, this.memLevel = w, this.strategy = R, this.flush = t.Z_NO_FLUSH, this.err = t.Z_OK, (this.mode === t.GZIP || this.mode === t.GUNZIP) && (this.windowBits += 16), this.mode === t.UNZIP && (this.windowBits += 32), (this.mode === t.DEFLATERAW || this.mode === t.INFLATERAW) && (this.windowBits = -1 * this.windowBits), this.strm = new n(), this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = o.deflateInit2(this.strm, this.level, t.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
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
      this.err !== t.Z_OK && this._error("Init error"), this.dictionary = h, this.write_in_progress = !1, this.init_done = !0;
    }, y.prototype._setDictionary = function() {
      if (this.dictionary != null) {
        switch (this.err = t.Z_OK, this.mode) {
          case t.DEFLATE:
          case t.DEFLATERAW:
            this.err = o.deflateSetDictionary(this.strm, this.dictionary);
            break;
        }
        this.err !== t.Z_OK && this._error("Failed to set dictionary");
      }
    }, y.prototype._reset = function() {
      switch (this.err = t.Z_OK, this.mode) {
        case t.DEFLATE:
        case t.DEFLATERAW:
        case t.GZIP:
          this.err = o.deflateReset(this.strm);
          break;
        case t.INFLATE:
        case t.INFLATERAW:
        case t.GUNZIP:
          this.err = r.inflateReset(this.strm);
          break;
      }
      this.err !== t.Z_OK && this._error("Failed to reset stream");
    }, t.Zlib = y;
  })(binding)), binding;
}
var hasRequiredLib;
function requireLib() {
  return hasRequiredLib || (hasRequiredLib = 1, (function(t) {
    var e = requireDist().Buffer, n = requireStreamBrowserify().Transform, o = requireBinding(), r = requireUtil$2(), a = requireAssert().ok, f = requireDist().kMaxLength, l = "Cannot create final Buffer. It would be larger than 0x" + f.toString(16) + " bytes";
    o.Z_MIN_WINDOWBITS = 8, o.Z_MAX_WINDOWBITS = 15, o.Z_DEFAULT_WINDOWBITS = 15, o.Z_MIN_CHUNK = 64, o.Z_MAX_CHUNK = 1 / 0, o.Z_DEFAULT_CHUNK = 16 * 1024, o.Z_MIN_MEMLEVEL = 1, o.Z_MAX_MEMLEVEL = 9, o.Z_DEFAULT_MEMLEVEL = 8, o.Z_MIN_LEVEL = -1, o.Z_MAX_LEVEL = 9, o.Z_DEFAULT_LEVEL = o.Z_DEFAULT_COMPRESSION;
    for (var c = Object.keys(o), y = 0; y < c.length; y++) {
      var u = c[y];
      u.match(/^Z/) && Object.defineProperty(t, u, {
        enumerable: !0,
        value: o[u],
        writable: !1
      });
    }
    for (var m = {
      Z_OK: o.Z_OK,
      Z_STREAM_END: o.Z_STREAM_END,
      Z_NEED_DICT: o.Z_NEED_DICT,
      Z_ERRNO: o.Z_ERRNO,
      Z_STREAM_ERROR: o.Z_STREAM_ERROR,
      Z_DATA_ERROR: o.Z_DATA_ERROR,
      Z_MEM_ERROR: o.Z_MEM_ERROR,
      Z_BUF_ERROR: o.Z_BUF_ERROR,
      Z_VERSION_ERROR: o.Z_VERSION_ERROR
    }, w = Object.keys(m), R = 0; R < w.length; R++) {
      var h = w[R];
      m[m[h]] = h;
    }
    Object.defineProperty(t, "codes", {
      enumerable: !0,
      value: Object.freeze(m),
      writable: !1
    }), t.Deflate = v, t.Inflate = P, t.Gzip = E, t.Gunzip = I, t.DeflateRaw = T, t.InflateRaw = $, t.Unzip = x, t.createDeflate = function(g) {
      return new v(g);
    }, t.createInflate = function(g) {
      return new P(g);
    }, t.createDeflateRaw = function(g) {
      return new T(g);
    }, t.createInflateRaw = function(g) {
      return new $(g);
    }, t.createGzip = function(g) {
      return new E(g);
    }, t.createGunzip = function(g) {
      return new I(g);
    }, t.createUnzip = function(g) {
      return new x(g);
    }, t.deflate = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new v(D), g, ie);
    }, t.deflateSync = function(g, D) {
      return d(new v(D), g);
    }, t.gzip = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new E(D), g, ie);
    }, t.gzipSync = function(g, D) {
      return d(new E(D), g);
    }, t.deflateRaw = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new T(D), g, ie);
    }, t.deflateRawSync = function(g, D) {
      return d(new T(D), g);
    }, t.unzip = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new x(D), g, ie);
    }, t.unzipSync = function(g, D) {
      return d(new x(D), g);
    }, t.inflate = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new P(D), g, ie);
    }, t.inflateSync = function(g, D) {
      return d(new P(D), g);
    }, t.gunzip = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new I(D), g, ie);
    }, t.gunzipSync = function(g, D) {
      return d(new I(D), g);
    }, t.inflateRaw = function(g, D, ie) {
      return typeof D == "function" && (ie = D, D = {}), q(new $(D), g, ie);
    }, t.inflateRawSync = function(g, D) {
      return d(new $(D), g);
    };
    function q(g, D, ie) {
      var de = [], we = 0;
      g.on("error", ce), g.on("end", fe), g.end(D), be();
      function be() {
        for (var M; (M = g.read()) !== null; )
          de.push(M), we += M.length;
        g.once("readable", be);
      }
      function ce(M) {
        g.removeListener("end", fe), g.removeListener("readable", be), ie(M);
      }
      function fe() {
        var M, pe = null;
        we >= f ? pe = new RangeError(l) : M = e.concat(de, we), de = [], g.close(), ie(pe, M);
      }
    }
    function d(g, D) {
      if (typeof D == "string" && (D = e.from(D)), !e.isBuffer(D)) throw new TypeError("Not a string or buffer");
      var ie = g._finishFlushFlag;
      return g._processChunk(D, ie);
    }
    function v(g) {
      if (!(this instanceof v)) return new v(g);
      V.call(this, g, o.DEFLATE);
    }
    function P(g) {
      if (!(this instanceof P)) return new P(g);
      V.call(this, g, o.INFLATE);
    }
    function E(g) {
      if (!(this instanceof E)) return new E(g);
      V.call(this, g, o.GZIP);
    }
    function I(g) {
      if (!(this instanceof I)) return new I(g);
      V.call(this, g, o.GUNZIP);
    }
    function T(g) {
      if (!(this instanceof T)) return new T(g);
      V.call(this, g, o.DEFLATERAW);
    }
    function $(g) {
      if (!(this instanceof $)) return new $(g);
      V.call(this, g, o.INFLATERAW);
    }
    function x(g) {
      if (!(this instanceof x)) return new x(g);
      V.call(this, g, o.UNZIP);
    }
    function j(g) {
      return g === o.Z_NO_FLUSH || g === o.Z_PARTIAL_FLUSH || g === o.Z_SYNC_FLUSH || g === o.Z_FULL_FLUSH || g === o.Z_FINISH || g === o.Z_BLOCK;
    }
    function V(g, D) {
      var ie = this;
      if (this._opts = g = g || {}, this._chunkSize = g.chunkSize || t.Z_DEFAULT_CHUNK, n.call(this, g), g.flush && !j(g.flush))
        throw new Error("Invalid flush flag: " + g.flush);
      if (g.finishFlush && !j(g.finishFlush))
        throw new Error("Invalid flush flag: " + g.finishFlush);
      if (this._flushFlag = g.flush || o.Z_NO_FLUSH, this._finishFlushFlag = typeof g.finishFlush < "u" ? g.finishFlush : o.Z_FINISH, g.chunkSize && (g.chunkSize < t.Z_MIN_CHUNK || g.chunkSize > t.Z_MAX_CHUNK))
        throw new Error("Invalid chunk size: " + g.chunkSize);
      if (g.windowBits && (g.windowBits < t.Z_MIN_WINDOWBITS || g.windowBits > t.Z_MAX_WINDOWBITS))
        throw new Error("Invalid windowBits: " + g.windowBits);
      if (g.level && (g.level < t.Z_MIN_LEVEL || g.level > t.Z_MAX_LEVEL))
        throw new Error("Invalid compression level: " + g.level);
      if (g.memLevel && (g.memLevel < t.Z_MIN_MEMLEVEL || g.memLevel > t.Z_MAX_MEMLEVEL))
        throw new Error("Invalid memLevel: " + g.memLevel);
      if (g.strategy && g.strategy != t.Z_FILTERED && g.strategy != t.Z_HUFFMAN_ONLY && g.strategy != t.Z_RLE && g.strategy != t.Z_FIXED && g.strategy != t.Z_DEFAULT_STRATEGY)
        throw new Error("Invalid strategy: " + g.strategy);
      if (g.dictionary && !e.isBuffer(g.dictionary))
        throw new Error("Invalid dictionary: it should be a Buffer instance");
      this._handle = new o.Zlib(D);
      var de = this;
      this._hadError = !1, this._handle.onerror = function(ce, fe) {
        C(de), de._hadError = !0;
        var M = new Error(ce);
        M.errno = fe, M.code = t.codes[fe], de.emit("error", M);
      };
      var we = t.Z_DEFAULT_COMPRESSION;
      typeof g.level == "number" && (we = g.level);
      var be = t.Z_DEFAULT_STRATEGY;
      typeof g.strategy == "number" && (be = g.strategy), this._handle.init(g.windowBits || t.Z_DEFAULT_WINDOWBITS, we, g.memLevel || t.Z_DEFAULT_MEMLEVEL, be, g.dictionary), this._buffer = e.allocUnsafe(this._chunkSize), this._offset = 0, this._level = we, this._strategy = be, this.once("end", this.close), Object.defineProperty(this, "_closed", {
        get: function() {
          return !ie._handle;
        },
        configurable: !0,
        enumerable: !0
      });
    }
    r.inherits(V, n), V.prototype.params = function(g, D, ie) {
      if (g < t.Z_MIN_LEVEL || g > t.Z_MAX_LEVEL)
        throw new RangeError("Invalid compression level: " + g);
      if (D != t.Z_FILTERED && D != t.Z_HUFFMAN_ONLY && D != t.Z_RLE && D != t.Z_FIXED && D != t.Z_DEFAULT_STRATEGY)
        throw new TypeError("Invalid strategy: " + D);
      if (this._level !== g || this._strategy !== D) {
        var de = this;
        this.flush(o.Z_SYNC_FLUSH, function() {
          a(de._handle, "zlib binding closed"), de._handle.params(g, D), de._hadError || (de._level = g, de._strategy = D, ie && ie());
        });
      } else
        process$1.nextTick(ie);
    }, V.prototype.reset = function() {
      return a(this._handle, "zlib binding closed"), this._handle.reset();
    }, V.prototype._flush = function(g) {
      this._transform(e.alloc(0), "", g);
    }, V.prototype.flush = function(g, D) {
      var ie = this, de = this._writableState;
      (typeof g == "function" || g === void 0 && !D) && (D = g, g = o.Z_FULL_FLUSH), de.ended ? D && process$1.nextTick(D) : de.ending ? D && this.once("end", D) : de.needDrain ? D && this.once("drain", function() {
        return ie.flush(g, D);
      }) : (this._flushFlag = g, this.write(e.alloc(0), "", D));
    }, V.prototype.close = function(g) {
      C(this, g), process$1.nextTick(z, this);
    };
    function C(g, D) {
      D && process$1.nextTick(D), g._handle && (g._handle.close(), g._handle = null);
    }
    function z(g) {
      g.emit("close");
    }
    V.prototype._transform = function(g, D, ie) {
      var de, we = this._writableState, be = we.ending || we.ended, ce = be && (!g || we.length === g.length);
      if (g !== null && !e.isBuffer(g)) return ie(new Error("invalid input"));
      if (!this._handle) return ie(new Error("zlib binding closed"));
      ce ? de = this._finishFlushFlag : (de = this._flushFlag, g.length >= we.length && (this._flushFlag = this._opts.flush || o.Z_NO_FLUSH)), this._processChunk(g, de, ie);
    }, V.prototype._processChunk = function(g, D, ie) {
      var de = g && g.length, we = this._chunkSize - this._offset, be = 0, ce = this, fe = typeof ie == "function";
      if (!fe) {
        var M = [], pe = 0, ee;
        this.on("error", function(B) {
          ee = B;
        }), a(this._handle, "zlib binding closed");
        do
          var Q = this._handle.writeSync(
            D,
            g,
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
        while (!this._hadError && O(Q[0], Q[1]));
        if (this._hadError)
          throw ee;
        if (pe >= f)
          throw C(this), new RangeError(l);
        var Z = e.concat(M, pe);
        return C(this), Z;
      }
      a(this._handle, "zlib binding closed");
      var le = this._handle.write(
        D,
        g,
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
      le.buffer = g, le.callback = O;
      function O(B, N) {
        if (this && (this.buffer = null, this.callback = null), !ce._hadError) {
          var re = we - N;
          if (a(re >= 0, "have should not go down"), re > 0) {
            var ne = ce._buffer.slice(ce._offset, ce._offset + re);
            ce._offset += re, fe ? ce.push(ne) : (M.push(ne), pe += ne.length);
          }
          if ((N === 0 || ce._offset >= ce._chunkSize) && (we = ce._chunkSize, ce._offset = 0, ce._buffer = e.allocUnsafe(ce._chunkSize)), N === 0) {
            if (be += de - B, de = B, !fe) return !0;
            var F = ce._handle.write(D, g, be, de, ce._buffer, ce._offset, ce._chunkSize);
            F.callback = O, F.buffer = g;
            return;
          }
          if (!fe) return !1;
          ie();
        }
      }
    }, r.inherits(v, V), r.inherits(P, V), r.inherits(E, V), r.inherits(I, V), r.inherits(T, V), r.inherits($, V), r.inherits(x, V);
  })(lib)), lib;
}
var utils$2, hasRequiredUtils$2;
function requireUtils$2() {
  if (hasRequiredUtils$2) return utils$2;
  hasRequiredUtils$2 = 1;
  function t(u, m) {
    const w = u.split("/");
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
  function e(u) {
    if (typeof u == "string")
      return { type: u };
    if (Array.isArray(u))
      return { type: u[0], typeArgs: u[1] };
    if (typeof u.type == "string")
      return u;
    throw new Error("Not a fieldinfo");
  }
  function n(u, m, { count: w, countType: R }, h) {
    let q = 0, d = 0;
    return typeof w == "number" ? q = w : typeof w < "u" ? q = t(w, h) : typeof R < "u" ? { size: d, value: q } = l(() => this.read(u, m, e(R), h), "$count") : q = 0, { count: q, size: d };
  }
  function o(u, m, w, { count: R, countType: h }, q) {
    return typeof R < "u" && u !== R || typeof h < "u" && (w = this.write(u, m, w, e(h), q)), w;
  }
  function r(u, { count: m, countType: w }, R) {
    return typeof m > "u" && typeof w < "u" ? l(() => this.sizeOf(u, e(w), R), "$count") : 0;
  }
  function a(u, m) {
    throw u.field = u.field ? m + "." + u.field : m, u;
  }
  function f(u, m) {
    try {
      return u();
    } catch (w) {
      m(w);
    }
  }
  function l(u, m) {
    return f(u, (w) => a(w, m));
  }
  class c extends Error {
    constructor(m) {
      super(m), this.name = this.constructor.name, this.message = m, Error.captureStackTrace != null && Error.captureStackTrace(this, this.constructor.name);
    }
  }
  class y extends c {
    constructor(m) {
      super(m), this.partialReadError = !0;
    }
  }
  return utils$2 = {
    getField: t,
    getFieldInfo: e,
    addErrorField: a,
    getCount: n,
    sendCount: o,
    calcCount: r,
    tryCatch: f,
    tryDoc: l,
    PartialReadError: y
  }, utils$2;
}
var lodash_reduce = { exports: {} };
lodash_reduce.exports;
var hasRequiredLodash_reduce;
function requireLodash_reduce() {
  return hasRequiredLodash_reduce || (hasRequiredLodash_reduce = 1, (function(t, e) {
    var n = 200, o = "Expected a function", r = "__lodash_hash_undefined__", a = 1, f = 2, l = 9007199254740991, c = "[object Arguments]", y = "[object Array]", u = "[object Boolean]", m = "[object Date]", w = "[object Error]", R = "[object Function]", h = "[object GeneratorFunction]", q = "[object Map]", d = "[object Number]", v = "[object Object]", P = "[object Promise]", E = "[object RegExp]", I = "[object Set]", T = "[object String]", $ = "[object Symbol]", x = "[object WeakMap]", j = "[object ArrayBuffer]", V = "[object DataView]", C = "[object Float32Array]", z = "[object Float64Array]", g = "[object Int8Array]", D = "[object Int16Array]", ie = "[object Int32Array]", de = "[object Uint8Array]", we = "[object Uint8ClampedArray]", be = "[object Uint16Array]", ce = "[object Uint32Array]", fe = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, M = /^\w*$/, pe = /^\./, ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Q = /[\\^$.*+?()[\]{}|]/g, Z = /\\(\\)?/g, le = /^\[object .+?Constructor\]$/, O = /^(?:0|[1-9]\d*)$/, B = {};
    B[C] = B[z] = B[g] = B[D] = B[ie] = B[de] = B[we] = B[be] = B[ce] = !0, B[c] = B[y] = B[j] = B[u] = B[V] = B[m] = B[w] = B[R] = B[q] = B[d] = B[v] = B[E] = B[I] = B[T] = B[x] = !1;
    var N = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, re = typeof self == "object" && self && self.Object === Object && self, ne = N || re || Function("return this")(), F = e && !e.nodeType && e, L = F && !0 && t && !t.nodeType && t, H = L && L.exports === F, se = H && N.process, Ee = (function() {
      try {
        return se && se.binding("util");
      } catch {
      }
    })(), Re = Ee && Ee.isTypedArray;
    function Pe(X, ve, Ne, ze) {
      var Ke = -1, Ge = X ? X.length : 0;
      for (ze && Ge && (Ne = X[++Ke]); ++Ke < Ge; )
        Ne = ve(Ne, X[Ke], Ke, X);
      return Ne;
    }
    function Oe(X, ve) {
      for (var Ne = -1, ze = X ? X.length : 0; ++Ne < ze; )
        if (ve(X[Ne], Ne, X))
          return !0;
      return !1;
    }
    function te(X) {
      return function(ve) {
        return ve == null ? void 0 : ve[X];
      };
    }
    function $e(X, ve, Ne, ze, Ke) {
      return Ke(X, function(Ge, er, lr) {
        Ne = ze ? (ze = !1, Ge) : ve(Ne, Ge, er, lr);
      }), Ne;
    }
    function Ce(X, ve) {
      for (var Ne = -1, ze = Array(X); ++Ne < X; )
        ze[Ne] = ve(Ne);
      return ze;
    }
    function Ae(X) {
      return function(ve) {
        return X(ve);
      };
    }
    function Ue(X, ve) {
      return X == null ? void 0 : X[ve];
    }
    function ge(X) {
      var ve = !1;
      if (X != null && typeof X.toString != "function")
        try {
          ve = !!(X + "");
        } catch {
        }
      return ve;
    }
    function Se(X) {
      var ve = -1, Ne = Array(X.size);
      return X.forEach(function(ze, Ke) {
        Ne[++ve] = [Ke, ze];
      }), Ne;
    }
    function Le(X, ve) {
      return function(Ne) {
        return X(ve(Ne));
      };
    }
    function je(X) {
      var ve = -1, Ne = Array(X.size);
      return X.forEach(function(ze) {
        Ne[++ve] = ze;
      }), Ne;
    }
    var ke = Array.prototype, He = Function.prototype, U = Object.prototype, s = ne["__core-js_shared__"], _ = (function() {
      var X = /[^.]+$/.exec(s && s.keys && s.keys.IE_PROTO || "");
      return X ? "Symbol(src)_1." + X : "";
    })(), W = He.toString, ue = U.hasOwnProperty, J = U.toString, he = RegExp(
      "^" + W.call(ue).replace(Q, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), k = ne.Symbol, Be = ne.Uint8Array, We = U.propertyIsEnumerable, S = ke.splice, Ie = Le(Object.keys, Object), Fe = Br(ne, "DataView"), G = Br(ne, "Map"), _e = Br(ne, "Promise"), De = Br(ne, "Set"), Ze = Br(ne, "WeakMap"), K = Br(Object, "create"), b = xr(Fe), p = xr(G), A = xr(_e), Y = xr(De), ye = xr(Ze), qe = k ? k.prototype : void 0, ae = qe ? qe.valueOf : void 0, oe = qe ? qe.toString : void 0;
    function me(X) {
      var ve = -1, Ne = X ? X.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = X[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function xe() {
      this.__data__ = K ? K(null) : {};
    }
    function Te(X) {
      return this.has(X) && delete this.__data__[X];
    }
    function Me(X) {
      var ve = this.__data__;
      if (K) {
        var Ne = ve[X];
        return Ne === r ? void 0 : Ne;
      }
      return ue.call(ve, X) ? ve[X] : void 0;
    }
    function Ve(X) {
      var ve = this.__data__;
      return K ? ve[X] !== void 0 : ue.call(ve, X);
    }
    function Xe(X, ve) {
      var Ne = this.__data__;
      return Ne[X] = K && ve === void 0 ? r : ve, this;
    }
    me.prototype.clear = xe, me.prototype.delete = Te, me.prototype.get = Me, me.prototype.has = Ve, me.prototype.set = Xe;
    function Ye(X) {
      var ve = -1, Ne = X ? X.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = X[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function nr() {
      this.__data__ = [];
    }
    function Qe(X) {
      var ve = this.__data__, Ne = Rr(ve, X);
      if (Ne < 0)
        return !1;
      var ze = ve.length - 1;
      return Ne == ze ? ve.pop() : S.call(ve, Ne, 1), !0;
    }
    function rr(X) {
      var ve = this.__data__, Ne = Rr(ve, X);
      return Ne < 0 ? void 0 : ve[Ne][1];
    }
    function ar(X) {
      return Rr(this.__data__, X) > -1;
    }
    function Je(X, ve) {
      var Ne = this.__data__, ze = Rr(Ne, X);
      return ze < 0 ? Ne.push([X, ve]) : Ne[ze][1] = ve, this;
    }
    Ye.prototype.clear = nr, Ye.prototype.delete = Qe, Ye.prototype.get = rr, Ye.prototype.has = ar, Ye.prototype.set = Je;
    function tr(X) {
      var ve = -1, Ne = X ? X.length : 0;
      for (this.clear(); ++ve < Ne; ) {
        var ze = X[ve];
        this.set(ze[0], ze[1]);
      }
    }
    function or() {
      this.__data__ = {
        hash: new me(),
        map: new (G || Ye)(),
        string: new me()
      };
    }
    function ir(X) {
      return Mr(this, X).delete(X);
    }
    function wr(X) {
      return Mr(this, X).get(X);
    }
    function yr(X) {
      return Mr(this, X).has(X);
    }
    function mr(X, ve) {
      return Mr(this, X).set(X, ve), this;
    }
    tr.prototype.clear = or, tr.prototype.delete = ir, tr.prototype.get = wr, tr.prototype.has = yr, tr.prototype.set = mr;
    function _r(X) {
      var ve = -1, Ne = X ? X.length : 0;
      for (this.__data__ = new tr(); ++ve < Ne; )
        this.add(X[ve]);
    }
    function Er(X) {
      return this.__data__.set(X, r), this;
    }
    function dr(X) {
      return this.__data__.has(X);
    }
    _r.prototype.add = _r.prototype.push = Er, _r.prototype.has = dr;
    function ur(X) {
      this.__data__ = new Ye(X);
    }
    function Sr() {
      this.__data__ = new Ye();
    }
    function br(X) {
      return this.__data__.delete(X);
    }
    function Or(X) {
      return this.__data__.get(X);
    }
    function Cr(X) {
      return this.__data__.has(X);
    }
    function Nr(X, ve) {
      var Ne = this.__data__;
      if (Ne instanceof Ye) {
        var ze = Ne.__data__;
        if (!G || ze.length < n - 1)
          return ze.push([X, ve]), this;
        Ne = this.__data__ = new tr(ze);
      }
      return Ne.set(X, ve), this;
    }
    ur.prototype.clear = Sr, ur.prototype.delete = br, ur.prototype.get = Or, ur.prototype.has = Cr, ur.prototype.set = Nr;
    function $r(X, ve) {
      var Ne = qr(X) || ot(X) ? Ce(X.length, String) : [], ze = Ne.length, Ke = !!ze;
      for (var Ge in X)
        ue.call(X, Ge) && !(Ke && (Ge == "length" || tt(Ge, ze))) && Ne.push(Ge);
      return Ne;
    }
    function Rr(X, ve) {
      for (var Ne = X.length; Ne--; )
        if (at(X[Ne][0], ve))
          return Ne;
      return -1;
    }
    var Fr = wt(kr), Lr = Et();
    function kr(X, ve) {
      return X && Lr(X, ve, Hr);
    }
    function Tr(X, ve) {
      ve = jr(ve, X) ? [ve] : et(ve);
      for (var Ne = 0, ze = ve.length; X != null && Ne < ze; )
        X = X[Ur(ve[Ne++])];
      return Ne && Ne == ze ? X : void 0;
    }
    function ut(X) {
      return J.call(X);
    }
    function ft(X, ve) {
      return X != null && ve in Object(X);
    }
    function Kr(X, ve, Ne, ze, Ke) {
      return X === ve ? !0 : X == null || ve == null || !zr(X) && !Wr(ve) ? X !== X && ve !== ve : ct(X, ve, Kr, Ne, ze, Ke);
    }
    function ct(X, ve, Ne, ze, Ke, Ge) {
      var er = qr(X), lr = qr(ve), sr = y, fr = y;
      er || (sr = Ar(X), sr = sr == c ? v : sr), lr || (fr = Ar(ve), fr = fr == c ? v : fr);
      var hr = sr == v && !ge(X), pr = fr == v && !ge(ve), cr = sr == fr;
      if (cr && !hr)
        return Ge || (Ge = new ur()), er || $t(X) ? rt(X, ve, Ne, ze, Ke, Ge) : St(X, ve, sr, Ne, ze, Ke, Ge);
      if (!(Ke & f)) {
        var gr = hr && ue.call(X, "__wrapped__"), vr = pr && ue.call(ve, "__wrapped__");
        if (gr || vr) {
          var Ir = gr ? X.value() : X, Pr = vr ? ve.value() : ve;
          return Ge || (Ge = new ur()), Ne(Ir, Pr, ze, Ke, Ge);
        }
      }
      return cr ? (Ge || (Ge = new ur()), Rt(X, ve, Ne, ze, Ke, Ge)) : !1;
    }
    function dt(X, ve, Ne, ze) {
      var Ke = Ne.length, Ge = Ke;
      if (X == null)
        return !Ge;
      for (X = Object(X); Ke--; ) {
        var er = Ne[Ke];
        if (er[2] ? er[1] !== X[er[0]] : !(er[0] in X))
          return !1;
      }
      for (; ++Ke < Ge; ) {
        er = Ne[Ke];
        var lr = er[0], sr = X[lr], fr = er[1];
        if (er[2]) {
          if (sr === void 0 && !(lr in X))
            return !1;
        } else {
          var hr = new ur(), pr;
          if (!(pr === void 0 ? Kr(fr, sr, ze, a | f, hr) : pr))
            return !1;
        }
      }
      return !0;
    }
    function ht(X) {
      if (!zr(X) || qt(X))
        return !1;
      var ve = st(X) || ge(X) ? he : le;
      return ve.test(xr(X));
    }
    function pt(X) {
      return Wr(X) && Qr(X.length) && !!B[J.call(X)];
    }
    function yt(X) {
      return typeof X == "function" ? X : X == null ? Nt : typeof X == "object" ? qr(X) ? vt(X[0], X[1]) : gt(X) : Lt(X);
    }
    function mt(X) {
      if (!It(X))
        return Ie(X);
      var ve = [];
      for (var Ne in Object(X))
        ue.call(X, Ne) && Ne != "constructor" && ve.push(Ne);
      return ve;
    }
    function gt(X) {
      var ve = Pt(X);
      return ve.length == 1 && ve[0][2] ? it(ve[0][0], ve[0][1]) : function(Ne) {
        return Ne === X || dt(Ne, X, ve);
      };
    }
    function vt(X, ve) {
      return jr(X) && nt(ve) ? it(Ur(X), ve) : function(Ne) {
        var ze = Bt(Ne, X);
        return ze === void 0 && ze === ve ? Ct(Ne, X) : Kr(ve, ze, void 0, a | f);
      };
    }
    function _t(X) {
      return function(ve) {
        return Tr(ve, X);
      };
    }
    function bt(X) {
      if (typeof X == "string")
        return X;
      if (Jr(X))
        return oe ? oe.call(X) : "";
      var ve = X + "";
      return ve == "0" && 1 / X == -1 / 0 ? "-0" : ve;
    }
    function et(X) {
      return qr(X) ? X : Ot(X);
    }
    function wt(X, ve) {
      return function(Ne, ze) {
        if (Ne == null)
          return Ne;
        if (!Yr(Ne))
          return X(Ne, ze);
        for (var Ke = Ne.length, Ge = -1, er = Object(Ne); ++Ge < Ke && ze(er[Ge], Ge, er) !== !1; )
          ;
        return Ne;
      };
    }
    function Et(X) {
      return function(ve, Ne, ze) {
        for (var Ke = -1, Ge = Object(ve), er = ze(ve), lr = er.length; lr--; ) {
          var sr = er[++Ke];
          if (Ne(Ge[sr], sr, Ge) === !1)
            break;
        }
        return ve;
      };
    }
    function rt(X, ve, Ne, ze, Ke, Ge) {
      var er = Ke & f, lr = X.length, sr = ve.length;
      if (lr != sr && !(er && sr > lr))
        return !1;
      var fr = Ge.get(X);
      if (fr && Ge.get(ve))
        return fr == ve;
      var hr = -1, pr = !0, cr = Ke & a ? new _r() : void 0;
      for (Ge.set(X, ve), Ge.set(ve, X); ++hr < lr; ) {
        var gr = X[hr], vr = ve[hr];
        if (ze)
          var Ir = er ? ze(vr, gr, hr, ve, X, Ge) : ze(gr, vr, hr, X, ve, Ge);
        if (Ir !== void 0) {
          if (Ir)
            continue;
          pr = !1;
          break;
        }
        if (cr) {
          if (!Oe(ve, function(Pr, Dr) {
            if (!cr.has(Dr) && (gr === Pr || Ne(gr, Pr, ze, Ke, Ge)))
              return cr.add(Dr);
          })) {
            pr = !1;
            break;
          }
        } else if (!(gr === vr || Ne(gr, vr, ze, Ke, Ge))) {
          pr = !1;
          break;
        }
      }
      return Ge.delete(X), Ge.delete(ve), pr;
    }
    function St(X, ve, Ne, ze, Ke, Ge, er) {
      switch (Ne) {
        case V:
          if (X.byteLength != ve.byteLength || X.byteOffset != ve.byteOffset)
            return !1;
          X = X.buffer, ve = ve.buffer;
        case j:
          return !(X.byteLength != ve.byteLength || !ze(new Be(X), new Be(ve)));
        case u:
        case m:
        case d:
          return at(+X, +ve);
        case w:
          return X.name == ve.name && X.message == ve.message;
        case E:
        case T:
          return X == ve + "";
        case q:
          var lr = Se;
        case I:
          var sr = Ge & f;
          if (lr || (lr = je), X.size != ve.size && !sr)
            return !1;
          var fr = er.get(X);
          if (fr)
            return fr == ve;
          Ge |= a, er.set(X, ve);
          var hr = rt(lr(X), lr(ve), ze, Ke, Ge, er);
          return er.delete(X), hr;
        case $:
          if (ae)
            return ae.call(X) == ae.call(ve);
      }
      return !1;
    }
    function Rt(X, ve, Ne, ze, Ke, Ge) {
      var er = Ke & f, lr = Hr(X), sr = lr.length, fr = Hr(ve), hr = fr.length;
      if (sr != hr && !er)
        return !1;
      for (var pr = sr; pr--; ) {
        var cr = lr[pr];
        if (!(er ? cr in ve : ue.call(ve, cr)))
          return !1;
      }
      var gr = Ge.get(X);
      if (gr && Ge.get(ve))
        return gr == ve;
      var vr = !0;
      Ge.set(X, ve), Ge.set(ve, X);
      for (var Ir = er; ++pr < sr; ) {
        cr = lr[pr];
        var Pr = X[cr], Dr = ve[cr];
        if (ze)
          var lt = er ? ze(Dr, Pr, cr, ve, X, Ge) : ze(Pr, Dr, cr, X, ve, Ge);
        if (!(lt === void 0 ? Pr === Dr || Ne(Pr, Dr, ze, Ke, Ge) : lt)) {
          vr = !1;
          break;
        }
        Ir || (Ir = cr == "constructor");
      }
      if (vr && !Ir) {
        var Vr = X.constructor, Zr = ve.constructor;
        Vr != Zr && "constructor" in X && "constructor" in ve && !(typeof Vr == "function" && Vr instanceof Vr && typeof Zr == "function" && Zr instanceof Zr) && (vr = !1);
      }
      return Ge.delete(X), Ge.delete(ve), vr;
    }
    function Mr(X, ve) {
      var Ne = X.__data__;
      return At(ve) ? Ne[typeof ve == "string" ? "string" : "hash"] : Ne.map;
    }
    function Pt(X) {
      for (var ve = Hr(X), Ne = ve.length; Ne--; ) {
        var ze = ve[Ne], Ke = X[ze];
        ve[Ne] = [ze, Ke, nt(Ke)];
      }
      return ve;
    }
    function Br(X, ve) {
      var Ne = Ue(X, ve);
      return ht(Ne) ? Ne : void 0;
    }
    var Ar = ut;
    (Fe && Ar(new Fe(new ArrayBuffer(1))) != V || G && Ar(new G()) != q || _e && Ar(_e.resolve()) != P || De && Ar(new De()) != I || Ze && Ar(new Ze()) != x) && (Ar = function(X) {
      var ve = J.call(X), Ne = ve == v ? X.constructor : void 0, ze = Ne ? xr(Ne) : void 0;
      if (ze)
        switch (ze) {
          case b:
            return V;
          case p:
            return q;
          case A:
            return P;
          case Y:
            return I;
          case ye:
            return x;
        }
      return ve;
    });
    function Tt(X, ve, Ne) {
      ve = jr(ve, X) ? [ve] : et(ve);
      for (var ze, Ke = -1, er = ve.length; ++Ke < er; ) {
        var Ge = Ur(ve[Ke]);
        if (!(ze = X != null && Ne(X, Ge)))
          break;
        X = X[Ge];
      }
      if (ze)
        return ze;
      var er = X ? X.length : 0;
      return !!er && Qr(er) && tt(Ge, er) && (qr(X) || ot(X));
    }
    function tt(X, ve) {
      return ve = ve ?? l, !!ve && (typeof X == "number" || O.test(X)) && X > -1 && X % 1 == 0 && X < ve;
    }
    function jr(X, ve) {
      if (qr(X))
        return !1;
      var Ne = typeof X;
      return Ne == "number" || Ne == "symbol" || Ne == "boolean" || X == null || Jr(X) ? !0 : M.test(X) || !fe.test(X) || ve != null && X in Object(ve);
    }
    function At(X) {
      var ve = typeof X;
      return ve == "string" || ve == "number" || ve == "symbol" || ve == "boolean" ? X !== "__proto__" : X === null;
    }
    function qt(X) {
      return !!_ && _ in X;
    }
    function It(X) {
      var ve = X && X.constructor, Ne = typeof ve == "function" && ve.prototype || U;
      return X === Ne;
    }
    function nt(X) {
      return X === X && !zr(X);
    }
    function it(X, ve) {
      return function(Ne) {
        return Ne == null ? !1 : Ne[X] === ve && (ve !== void 0 || X in Object(Ne));
      };
    }
    var Ot = Xr(function(X) {
      X = Ft(X);
      var ve = [];
      return pe.test(X) && ve.push(""), X.replace(ee, function(Ne, ze, Ke, Ge) {
        ve.push(Ke ? Ge.replace(Z, "$1") : ze || Ne);
      }), ve;
    });
    function Ur(X) {
      if (typeof X == "string" || Jr(X))
        return X;
      var ve = X + "";
      return ve == "0" && 1 / X == -1 / 0 ? "-0" : ve;
    }
    function xr(X) {
      if (X != null) {
        try {
          return W.call(X);
        } catch {
        }
        try {
          return X + "";
        } catch {
        }
      }
      return "";
    }
    function xt(X, ve, Ne) {
      var ze = qr(X) ? Pe : $e, Ke = arguments.length < 3;
      return ze(X, yt(ve), Ne, Ke, Fr);
    }
    function Xr(X, ve) {
      if (typeof X != "function" || ve && typeof ve != "function")
        throw new TypeError(o);
      var Ne = function() {
        var ze = arguments, Ke = ve ? ve.apply(this, ze) : ze[0], Ge = Ne.cache;
        if (Ge.has(Ke))
          return Ge.get(Ke);
        var er = X.apply(this, ze);
        return Ne.cache = Ge.set(Ke, er), er;
      };
      return Ne.cache = new (Xr.Cache || tr)(), Ne;
    }
    Xr.Cache = tr;
    function at(X, ve) {
      return X === ve || X !== X && ve !== ve;
    }
    function ot(X) {
      return Dt(X) && ue.call(X, "callee") && (!We.call(X, "callee") || J.call(X) == c);
    }
    var qr = Array.isArray;
    function Yr(X) {
      return X != null && Qr(X.length) && !st(X);
    }
    function Dt(X) {
      return Wr(X) && Yr(X);
    }
    function st(X) {
      var ve = zr(X) ? J.call(X) : "";
      return ve == R || ve == h;
    }
    function Qr(X) {
      return typeof X == "number" && X > -1 && X % 1 == 0 && X <= l;
    }
    function zr(X) {
      var ve = typeof X;
      return !!X && (ve == "object" || ve == "function");
    }
    function Wr(X) {
      return !!X && typeof X == "object";
    }
    function Jr(X) {
      return typeof X == "symbol" || Wr(X) && J.call(X) == $;
    }
    var $t = Re ? Ae(Re) : pt;
    function Ft(X) {
      return X == null ? "" : bt(X);
    }
    function Bt(X, ve, Ne) {
      var ze = X == null ? void 0 : Tr(X, ve);
      return ze === void 0 ? Ne : ze;
    }
    function Ct(X, ve) {
      return X != null && Tt(X, ve, ft);
    }
    function Hr(X) {
      return Yr(X) ? $r(X) : mt(X);
    }
    function Nt(X) {
      return X;
    }
    function Lt(X) {
      return jr(X) ? te(Ur(X)) : _t(X);
    }
    t.exports = xt;
  })(lodash_reduce, lodash_reduce.exports)), lodash_reduce.exports;
}
var uri_all$1 = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
var uri_all = uri_all$1.exports, hasRequiredUri_all;
function requireUri_all() {
  return hasRequiredUri_all || (hasRequiredUri_all = 1, (function(t, e) {
    (function(n, o) {
      o(e);
    })(uri_all, (function(n) {
      function o() {
        for (var ae = arguments.length, oe = Array(ae), me = 0; me < ae; me++)
          oe[me] = arguments[me];
        if (oe.length > 1) {
          oe[0] = oe[0].slice(0, -1);
          for (var xe = oe.length - 1, Te = 1; Te < xe; ++Te)
            oe[Te] = oe[Te].slice(1, -1);
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
      function l(ae) {
        return ae != null ? ae instanceof Array ? ae : typeof ae.length != "number" || ae.split || ae.setInterval || ae.call ? [ae] : Array.prototype.slice.call(ae) : [];
      }
      function c(ae, oe) {
        var me = ae;
        if (oe)
          for (var xe in oe)
            me[xe] = oe[xe];
        return me;
      }
      function y(ae) {
        var oe = "[A-Za-z]", me = "[0-9]", xe = o(me, "[A-Fa-f]"), Te = r(r("%[EFef]" + xe + "%" + xe + xe + "%" + xe + xe) + "|" + r("%[89A-Fa-f]" + xe + "%" + xe + xe) + "|" + r("%" + xe + xe)), Me = "[\\:\\/\\?\\#\\[\\]\\@]", Ve = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Xe = o(Me, Ve), Ye = ae ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", nr = ae ? "[\\uE000-\\uF8FF]" : "[]", Qe = o(oe, me, "[\\-\\.\\_\\~]", Ye);
        r(oe + o(oe, me, "[\\+\\-\\.]") + "*"), r(r(Te + "|" + o(Qe, Ve, "[\\:]")) + "*");
        var rr = r(r("25[0-5]") + "|" + r("2[0-4]" + me) + "|" + r("1" + me + me) + "|" + r("0?[1-9]" + me) + "|0?0?" + me), ar = r(rr + "\\." + rr + "\\." + rr + "\\." + rr), Je = r(xe + "{1,4}"), tr = r(r(Je + "\\:" + Je) + "|" + ar), or = r(r(Je + "\\:") + "{6}" + tr), ir = r("\\:\\:" + r(Je + "\\:") + "{5}" + tr), wr = r(r(Je) + "?\\:\\:" + r(Je + "\\:") + "{4}" + tr), yr = r(r(r(Je + "\\:") + "{0,1}" + Je) + "?\\:\\:" + r(Je + "\\:") + "{3}" + tr), mr = r(r(r(Je + "\\:") + "{0,2}" + Je) + "?\\:\\:" + r(Je + "\\:") + "{2}" + tr), _r = r(r(r(Je + "\\:") + "{0,3}" + Je) + "?\\:\\:" + Je + "\\:" + tr), Er = r(r(r(Je + "\\:") + "{0,4}" + Je) + "?\\:\\:" + tr), dr = r(r(r(Je + "\\:") + "{0,5}" + Je) + "?\\:\\:" + Je), ur = r(r(r(Je + "\\:") + "{0,6}" + Je) + "?\\:\\:"), Sr = r([or, ir, wr, yr, mr, _r, Er, dr, ur].join("|")), br = r(r(Qe + "|" + Te) + "+");
        r("[vV]" + xe + "+\\." + o(Qe, Ve, "[\\:]") + "+"), r(r(Te + "|" + o(Qe, Ve)) + "*");
        var Or = r(Te + "|" + o(Qe, Ve, "[\\:\\@]"));
        return r(r(Te + "|" + o(Qe, Ve, "[\\@]")) + "+"), r(r(Or + "|" + o("[\\/\\?]", nr)) + "*"), {
          NOT_SCHEME: new RegExp(o("[^]", oe, me, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(o("[^\\%\\:]", Qe, Ve), "g"),
          NOT_HOST: new RegExp(o("[^\\%\\[\\]\\:]", Qe, Ve), "g"),
          NOT_PATH: new RegExp(o("[^\\%\\/\\:\\@]", Qe, Ve), "g"),
          NOT_PATH_NOSCHEME: new RegExp(o("[^\\%\\/\\@]", Qe, Ve), "g"),
          NOT_QUERY: new RegExp(o("[^\\%]", Qe, Ve, "[\\:\\@\\/\\?]", nr), "g"),
          NOT_FRAGMENT: new RegExp(o("[^\\%]", Qe, Ve, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(o("[^]", Qe, Ve), "g"),
          UNRESERVED: new RegExp(Qe, "g"),
          OTHER_CHARS: new RegExp(o("[^\\%]", Qe, Xe), "g"),
          PCT_ENCODED: new RegExp(Te, "g"),
          IPV4ADDRESS: new RegExp("^(" + ar + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + Sr + ")" + r(r("\\%25|\\%(?!" + xe + "{2})") + "(" + br + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var u = y(!1), m = y(!0), w = /* @__PURE__ */ (function() {
        function ae(oe, me) {
          var xe = [], Te = !0, Me = !1, Ve = void 0;
          try {
            for (var Xe = oe[Symbol.iterator](), Ye; !(Te = (Ye = Xe.next()).done) && (xe.push(Ye.value), !(me && xe.length === me)); Te = !0)
              ;
          } catch (nr) {
            Me = !0, Ve = nr;
          } finally {
            try {
              !Te && Xe.return && Xe.return();
            } finally {
              if (Me) throw Ve;
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
      }, h = 2147483647, q = 36, d = 1, v = 26, P = 38, E = 700, I = 72, T = 128, $ = "-", x = /^xn--/, j = /[^\0-\x7E]/, V = /[\x2E\u3002\uFF0E\uFF61]/g, C = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, z = q - d, g = Math.floor, D = String.fromCharCode;
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
        var Te = ae.split("."), Me = de(Te, oe).join(".");
        return xe + Me;
      }
      function be(ae) {
        for (var oe = [], me = 0, xe = ae.length; me < xe; ) {
          var Te = ae.charCodeAt(me++);
          if (Te >= 55296 && Te <= 56319 && me < xe) {
            var Me = ae.charCodeAt(me++);
            (Me & 64512) == 56320 ? oe.push(((Te & 1023) << 10) + (Me & 1023) + 65536) : (oe.push(Te), me--);
          } else
            oe.push(Te);
        }
        return oe;
      }
      var ce = function(oe) {
        return String.fromCodePoint.apply(String, R(oe));
      }, fe = function(oe) {
        return oe - 48 < 10 ? oe - 22 : oe - 65 < 26 ? oe - 65 : oe - 97 < 26 ? oe - 97 : q;
      }, M = function(oe, me) {
        return oe + 22 + 75 * (oe < 26) - ((me != 0) << 5);
      }, pe = function(oe, me, xe) {
        var Te = 0;
        for (
          oe = xe ? g(oe / E) : oe >> 1, oe += g(oe / me);
          /* no initialization */
          oe > z * v >> 1;
          Te += q
        )
          oe = g(oe / z);
        return g(Te + (z + 1) * oe / (oe + P));
      }, ee = function(oe) {
        var me = [], xe = oe.length, Te = 0, Me = T, Ve = I, Xe = oe.lastIndexOf($);
        Xe < 0 && (Xe = 0);
        for (var Ye = 0; Ye < Xe; ++Ye)
          oe.charCodeAt(Ye) >= 128 && ie("not-basic"), me.push(oe.charCodeAt(Ye));
        for (var nr = Xe > 0 ? Xe + 1 : 0; nr < xe; ) {
          for (
            var Qe = Te, rr = 1, ar = q;
            ;
            /* no condition */
            ar += q
          ) {
            nr >= xe && ie("invalid-input");
            var Je = fe(oe.charCodeAt(nr++));
            (Je >= q || Je > g((h - Te) / rr)) && ie("overflow"), Te += Je * rr;
            var tr = ar <= Ve ? d : ar >= Ve + v ? v : ar - Ve;
            if (Je < tr)
              break;
            var or = q - tr;
            rr > g(h / or) && ie("overflow"), rr *= or;
          }
          var ir = me.length + 1;
          Ve = pe(Te - Qe, ir, Qe == 0), g(Te / ir) > h - Me && ie("overflow"), Me += g(Te / ir), Te %= ir, me.splice(Te++, 0, Me);
        }
        return String.fromCodePoint.apply(String, me);
      }, Q = function(oe) {
        var me = [];
        oe = be(oe);
        var xe = oe.length, Te = T, Me = 0, Ve = I, Xe = !0, Ye = !1, nr = void 0;
        try {
          for (var Qe = oe[Symbol.iterator](), rr; !(Xe = (rr = Qe.next()).done); Xe = !0) {
            var ar = rr.value;
            ar < 128 && me.push(D(ar));
          }
        } catch (Tr) {
          Ye = !0, nr = Tr;
        } finally {
          try {
            !Xe && Qe.return && Qe.return();
          } finally {
            if (Ye)
              throw nr;
          }
        }
        var Je = me.length, tr = Je;
        for (Je && me.push($); tr < xe; ) {
          var or = h, ir = !0, wr = !1, yr = void 0;
          try {
            for (var mr = oe[Symbol.iterator](), _r; !(ir = (_r = mr.next()).done); ir = !0) {
              var Er = _r.value;
              Er >= Te && Er < or && (or = Er);
            }
          } catch (Tr) {
            wr = !0, yr = Tr;
          } finally {
            try {
              !ir && mr.return && mr.return();
            } finally {
              if (wr)
                throw yr;
            }
          }
          var dr = tr + 1;
          or - Te > g((h - Me) / dr) && ie("overflow"), Me += (or - Te) * dr, Te = or;
          var ur = !0, Sr = !1, br = void 0;
          try {
            for (var Or = oe[Symbol.iterator](), Cr; !(ur = (Cr = Or.next()).done); ur = !0) {
              var Nr = Cr.value;
              if (Nr < Te && ++Me > h && ie("overflow"), Nr == Te) {
                for (
                  var $r = Me, Rr = q;
                  ;
                  /* no condition */
                  Rr += q
                ) {
                  var Fr = Rr <= Ve ? d : Rr >= Ve + v ? v : Rr - Ve;
                  if ($r < Fr)
                    break;
                  var Lr = $r - Fr, kr = q - Fr;
                  me.push(D(M(Fr + Lr % kr, 0))), $r = g(Lr / kr);
                }
                me.push(D(M($r, 0))), Ve = pe(Me, dr, tr == Je), Me = 0, ++tr;
              }
            }
          } catch (Tr) {
            Sr = !0, br = Tr;
          } finally {
            try {
              !ur && Or.return && Or.return();
            } finally {
              if (Sr)
                throw br;
            }
          }
          ++Me, ++Te;
        }
        return me.join("");
      }, Z = function(oe) {
        return we(oe, function(me) {
          return x.test(me) ? ee(me.slice(4).toLowerCase()) : me;
        });
      }, le = function(oe) {
        return we(oe, function(me) {
          return j.test(me) ? "xn--" + Q(me) : me;
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
        encode: Q,
        toASCII: le,
        toUnicode: Z
      }, B = {};
      function N(ae) {
        var oe = ae.charCodeAt(0), me = void 0;
        return oe < 16 ? me = "%0" + oe.toString(16).toUpperCase() : oe < 128 ? me = "%" + oe.toString(16).toUpperCase() : oe < 2048 ? me = "%" + (oe >> 6 | 192).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase() : me = "%" + (oe >> 12 | 224).toString(16).toUpperCase() + "%" + (oe >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase(), me;
      }
      function re(ae) {
        for (var oe = "", me = 0, xe = ae.length; me < xe; ) {
          var Te = parseInt(ae.substr(me + 1, 2), 16);
          if (Te < 128)
            oe += String.fromCharCode(Te), me += 3;
          else if (Te >= 194 && Te < 224) {
            if (xe - me >= 6) {
              var Me = parseInt(ae.substr(me + 4, 2), 16);
              oe += String.fromCharCode((Te & 31) << 6 | Me & 63);
            } else
              oe += ae.substr(me, 6);
            me += 6;
          } else if (Te >= 224) {
            if (xe - me >= 9) {
              var Ve = parseInt(ae.substr(me + 4, 2), 16), Xe = parseInt(ae.substr(me + 7, 2), 16);
              oe += String.fromCharCode((Te & 15) << 12 | (Ve & 63) << 6 | Xe & 63);
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
          var Te = re(xe);
          return Te.match(oe.UNRESERVED) ? Te : xe;
        }
        return ae.scheme && (ae.scheme = String(ae.scheme).replace(oe.PCT_ENCODED, me).toLowerCase().replace(oe.NOT_SCHEME, "")), ae.userinfo !== void 0 && (ae.userinfo = String(ae.userinfo).replace(oe.PCT_ENCODED, me).replace(oe.NOT_USERINFO, N).replace(oe.PCT_ENCODED, f)), ae.host !== void 0 && (ae.host = String(ae.host).replace(oe.PCT_ENCODED, me).toLowerCase().replace(oe.NOT_HOST, N).replace(oe.PCT_ENCODED, f)), ae.path !== void 0 && (ae.path = String(ae.path).replace(oe.PCT_ENCODED, me).replace(ae.scheme ? oe.NOT_PATH : oe.NOT_PATH_NOSCHEME, N).replace(oe.PCT_ENCODED, f)), ae.query !== void 0 && (ae.query = String(ae.query).replace(oe.PCT_ENCODED, me).replace(oe.NOT_QUERY, N).replace(oe.PCT_ENCODED, f)), ae.fragment !== void 0 && (ae.fragment = String(ae.fragment).replace(oe.PCT_ENCODED, me).replace(oe.NOT_FRAGMENT, N).replace(oe.PCT_ENCODED, f)), ae;
      }
      function F(ae) {
        return ae.replace(/^0*(.*)/, "$1") || "0";
      }
      function L(ae, oe) {
        var me = ae.match(oe.IPV4ADDRESS) || [], xe = w(me, 2), Te = xe[1];
        return Te ? Te.split(".").map(F).join(".") : ae;
      }
      function H(ae, oe) {
        var me = ae.match(oe.IPV6ADDRESS) || [], xe = w(me, 3), Te = xe[1], Me = xe[2];
        if (Te) {
          for (var Ve = Te.toLowerCase().split("::").reverse(), Xe = w(Ve, 2), Ye = Xe[0], nr = Xe[1], Qe = nr ? nr.split(":").map(F) : [], rr = Ye.split(":").map(F), ar = oe.IPV4ADDRESS.test(rr[rr.length - 1]), Je = ar ? 7 : 8, tr = rr.length - Je, or = Array(Je), ir = 0; ir < Je; ++ir)
            or[ir] = Qe[ir] || rr[tr + ir] || "";
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
          return Me && (mr += "%" + Me), mr;
        } else
          return ae;
      }
      var se = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Ee = "".match(/(){0}/)[1] === void 0;
      function Re(ae) {
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, me = {}, xe = oe.iri !== !1 ? m : u;
        oe.reference === "suffix" && (ae = (oe.scheme ? oe.scheme + ":" : "") + "//" + ae);
        var Te = ae.match(se);
        if (Te) {
          Ee ? (me.scheme = Te[1], me.userinfo = Te[3], me.host = Te[4], me.port = parseInt(Te[5], 10), me.path = Te[6] || "", me.query = Te[7], me.fragment = Te[8], isNaN(me.port) && (me.port = Te[5])) : (me.scheme = Te[1] || void 0, me.userinfo = ae.indexOf("@") !== -1 ? Te[3] : void 0, me.host = ae.indexOf("//") !== -1 ? Te[4] : void 0, me.port = parseInt(Te[5], 10), me.path = Te[6] || "", me.query = ae.indexOf("?") !== -1 ? Te[7] : void 0, me.fragment = ae.indexOf("#") !== -1 ? Te[8] : void 0, isNaN(me.port) && (me.port = ae.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? Te[4] : void 0)), me.host && (me.host = H(L(me.host, xe), xe)), me.scheme === void 0 && me.userinfo === void 0 && me.host === void 0 && me.port === void 0 && !me.path && me.query === void 0 ? me.reference = "same-document" : me.scheme === void 0 ? me.reference = "relative" : me.fragment === void 0 ? me.reference = "absolute" : me.reference = "uri", oe.reference && oe.reference !== "suffix" && oe.reference !== me.reference && (me.error = me.error || "URI is not a " + oe.reference + " reference.");
          var Me = B[(oe.scheme || me.scheme || "").toLowerCase()];
          if (!oe.unicodeSupport && (!Me || !Me.unicodeSupport)) {
            if (me.host && (oe.domainHost || Me && Me.domainHost))
              try {
                me.host = O.toASCII(me.host.replace(xe.PCT_ENCODED, re).toLowerCase());
              } catch (Ve) {
                me.error = me.error || "Host's domain name can not be converted to ASCII via punycode: " + Ve;
              }
            ne(me, u);
          } else
            ne(me, xe);
          Me && Me.parse && Me.parse(me, oe);
        } else
          me.error = me.error || "URI can not be parsed.";
        return me;
      }
      function Pe(ae, oe) {
        var me = oe.iri !== !1 ? m : u, xe = [];
        return ae.userinfo !== void 0 && (xe.push(ae.userinfo), xe.push("@")), ae.host !== void 0 && xe.push(H(L(String(ae.host), me), me).replace(me.IPV6ADDRESS, function(Te, Me, Ve) {
          return "[" + Me + (Ve ? "%25" + Ve : "") + "]";
        })), (typeof ae.port == "number" || typeof ae.port == "string") && (xe.push(":"), xe.push(String(ae.port))), xe.length ? xe.join("") : void 0;
      }
      var Oe = /^\.\.?\//, te = /^\/\.(\/|$)/, $e = /^\/\.\.(\/|$)/, Ce = /^\/?(?:.|\n)*?(?=\/|$)/;
      function Ae(ae) {
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
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, me = oe.iri ? m : u, xe = [], Te = B[(oe.scheme || ae.scheme || "").toLowerCase()];
        if (Te && Te.serialize && Te.serialize(ae, oe), ae.host && !me.IPV6ADDRESS.test(ae.host)) {
          if (oe.domainHost || Te && Te.domainHost)
            try {
              ae.host = oe.iri ? O.toUnicode(ae.host) : O.toASCII(ae.host.replace(me.PCT_ENCODED, re).toLowerCase());
            } catch (Xe) {
              ae.error = ae.error || "Host's domain name can not be converted to " + (oe.iri ? "Unicode" : "ASCII") + " via punycode: " + Xe;
            }
        }
        ne(ae, me), oe.reference !== "suffix" && ae.scheme && (xe.push(ae.scheme), xe.push(":"));
        var Me = Pe(ae, oe);
        if (Me !== void 0 && (oe.reference !== "suffix" && xe.push("//"), xe.push(Me), ae.path && ae.path.charAt(0) !== "/" && xe.push("/")), ae.path !== void 0) {
          var Ve = ae.path;
          !oe.absolutePath && (!Te || !Te.absolutePath) && (Ve = Ae(Ve)), Me === void 0 && (Ve = Ve.replace(/^\/\//, "/%2F")), xe.push(Ve);
        }
        return ae.query !== void 0 && (xe.push("?"), xe.push(ae.query)), ae.fragment !== void 0 && (xe.push("#"), xe.push(ae.fragment)), xe.join("");
      }
      function ge(ae, oe) {
        var me = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, xe = arguments[3], Te = {};
        return xe || (ae = Re(Ue(ae, me), me), oe = Re(Ue(oe, me), me)), me = me || {}, !me.tolerant && oe.scheme ? (Te.scheme = oe.scheme, Te.userinfo = oe.userinfo, Te.host = oe.host, Te.port = oe.port, Te.path = Ae(oe.path || ""), Te.query = oe.query) : (oe.userinfo !== void 0 || oe.host !== void 0 || oe.port !== void 0 ? (Te.userinfo = oe.userinfo, Te.host = oe.host, Te.port = oe.port, Te.path = Ae(oe.path || ""), Te.query = oe.query) : (oe.path ? (oe.path.charAt(0) === "/" ? Te.path = Ae(oe.path) : ((ae.userinfo !== void 0 || ae.host !== void 0 || ae.port !== void 0) && !ae.path ? Te.path = "/" + oe.path : ae.path ? Te.path = ae.path.slice(0, ae.path.lastIndexOf("/") + 1) + oe.path : Te.path = oe.path, Te.path = Ae(Te.path)), Te.query = oe.query) : (Te.path = ae.path, oe.query !== void 0 ? Te.query = oe.query : Te.query = ae.query), Te.userinfo = ae.userinfo, Te.host = ae.host, Te.port = ae.port), Te.scheme = ae.scheme), Te.fragment = oe.fragment, Te;
      }
      function Se(ae, oe, me) {
        var xe = c({ scheme: "null" }, me);
        return Ue(ge(Re(ae, xe), Re(oe, xe), xe, !0), xe);
      }
      function Le(ae, oe) {
        return typeof ae == "string" ? ae = Ue(Re(ae, oe), oe) : a(ae) === "object" && (ae = Re(Ue(ae, oe), oe)), ae;
      }
      function je(ae, oe, me) {
        return typeof ae == "string" ? ae = Ue(Re(ae, me), me) : a(ae) === "object" && (ae = Ue(ae, me)), typeof oe == "string" ? oe = Ue(Re(oe, me), me) : a(oe) === "object" && (oe = Ue(oe, me)), ae === oe;
      }
      function ke(ae, oe) {
        return ae && ae.toString().replace(!oe || !oe.iri ? u.ESCAPE : m.ESCAPE, N);
      }
      function He(ae, oe) {
        return ae && ae.toString().replace(!oe || !oe.iri ? u.PCT_ENCODED : m.PCT_ENCODED, re);
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
      }, s = {
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
            var xe = oe.resourceName.split("?"), Te = w(xe, 2), Me = Te[0], Ve = Te[1];
            oe.path = Me && Me !== "/" ? Me : void 0, oe.query = Ve, oe.resourceName = void 0;
          }
          return oe.fragment = void 0, oe;
        }
      }, ue = {
        scheme: "wss",
        domainHost: W.domainHost,
        parse: W.parse,
        serialize: W.serialize
      }, J = {}, he = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", k = "[0-9A-Fa-f]", Be = r(r("%[EFef]" + k + "%" + k + k + "%" + k + k) + "|" + r("%[89A-Fa-f]" + k + "%" + k + k) + "|" + r("%" + k + k)), We = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", S = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Ie = o(S, '[\\"\\\\]'), Fe = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", G = new RegExp(he, "g"), _e = new RegExp(Be, "g"), De = new RegExp(o("[^]", We, "[\\.]", '[\\"]', Ie), "g"), Ze = new RegExp(o("[^]", he, Fe), "g"), K = Ze;
      function b(ae) {
        var oe = re(ae);
        return oe.match(G) ? oe : ae;
      }
      var p = {
        scheme: "mailto",
        parse: function(oe, me) {
          var xe = oe, Te = xe.to = xe.path ? xe.path.split(",") : [];
          if (xe.path = void 0, xe.query) {
            for (var Me = !1, Ve = {}, Xe = xe.query.split("&"), Ye = 0, nr = Xe.length; Ye < nr; ++Ye) {
              var Qe = Xe[Ye].split("=");
              switch (Qe[0]) {
                case "to":
                  for (var rr = Qe[1].split(","), ar = 0, Je = rr.length; ar < Je; ++ar)
                    Te.push(rr[ar]);
                  break;
                case "subject":
                  xe.subject = He(Qe[1], me);
                  break;
                case "body":
                  xe.body = He(Qe[1], me);
                  break;
                default:
                  Me = !0, Ve[He(Qe[0], me)] = He(Qe[1], me);
                  break;
              }
            }
            Me && (xe.headers = Ve);
          }
          xe.query = void 0;
          for (var tr = 0, or = Te.length; tr < or; ++tr) {
            var ir = Te[tr].split("@");
            if (ir[0] = He(ir[0]), me.unicodeSupport)
              ir[1] = He(ir[1], me).toLowerCase();
            else
              try {
                ir[1] = O.toASCII(He(ir[1], me).toLowerCase());
              } catch (wr) {
                xe.error = xe.error || "Email address's domain name can not be converted to ASCII via punycode: " + wr;
              }
            Te[tr] = ir.join("@");
          }
          return xe;
        },
        serialize: function(oe, me) {
          var xe = oe, Te = l(oe.to);
          if (Te) {
            for (var Me = 0, Ve = Te.length; Me < Ve; ++Me) {
              var Xe = String(Te[Me]), Ye = Xe.lastIndexOf("@"), nr = Xe.slice(0, Ye).replace(_e, b).replace(_e, f).replace(De, N), Qe = Xe.slice(Ye + 1);
              try {
                Qe = me.iri ? O.toUnicode(Qe) : O.toASCII(He(Qe, me).toLowerCase());
              } catch (tr) {
                xe.error = xe.error || "Email address's domain name can not be converted to " + (me.iri ? "Unicode" : "ASCII") + " via punycode: " + tr;
              }
              Te[Me] = nr + "@" + Qe;
            }
            xe.path = Te.join(",");
          }
          var rr = oe.headers = oe.headers || {};
          oe.subject && (rr.subject = oe.subject), oe.body && (rr.body = oe.body);
          var ar = [];
          for (var Je in rr)
            rr[Je] !== J[Je] && ar.push(Je.replace(_e, b).replace(_e, f).replace(Ze, N) + "=" + rr[Je].replace(_e, b).replace(_e, f).replace(K, N));
          return ar.length && (xe.query = ar.join("&")), xe;
        }
      }, A = /^([^\:]+)\:(.*)/, Y = {
        scheme: "urn",
        parse: function(oe, me) {
          var xe = oe.path && oe.path.match(A), Te = oe;
          if (xe) {
            var Me = me.scheme || Te.scheme || "urn", Ve = xe[1].toLowerCase(), Xe = xe[2], Ye = Me + ":" + (me.nid || Ve), nr = B[Ye];
            Te.nid = Ve, Te.nss = Xe, Te.path = void 0, nr && (Te = nr.parse(Te, me));
          } else
            Te.error = Te.error || "URN can not be parsed.";
          return Te;
        },
        serialize: function(oe, me) {
          var xe = me.scheme || oe.scheme || "urn", Te = oe.nid, Me = xe + ":" + (me.nid || Te), Ve = B[Me];
          Ve && (oe = Ve.serialize(oe, me));
          var Xe = oe, Ye = oe.nss;
          return Xe.path = (Te || me.nid) + ":" + Ye, Xe;
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
      B[U.scheme] = U, B[s.scheme] = s, B[W.scheme] = W, B[ue.scheme] = ue, B[p.scheme] = p, B[Y.scheme] = Y, B[qe.scheme] = qe, n.SCHEMES = B, n.pctEncChar = N, n.pctDecChars = re, n.parse = Re, n.removeDotSegments = Ae, n.serialize = Ue, n.resolveComponents = ge, n.resolve = Se, n.normalize = Le, n.equal = je, n.escapeComponent = ke, n.unescapeComponent = He, Object.defineProperty(n, "__esModule", { value: !0 });
    }));
  })(uri_all$1, uri_all$1.exports)), uri_all$1.exports;
}
var fastDeepEqual, hasRequiredFastDeepEqual;
function requireFastDeepEqual() {
  return hasRequiredFastDeepEqual || (hasRequiredFastDeepEqual = 1, fastDeepEqual = function t(e, n) {
    if (e === n) return !0;
    if (e && n && typeof e == "object" && typeof n == "object") {
      if (e.constructor !== n.constructor) return !1;
      var o, r, a;
      if (Array.isArray(e)) {
        if (o = e.length, o != n.length) return !1;
        for (r = o; r-- !== 0; )
          if (!t(e[r], n[r])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === n.source && e.flags === n.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === n.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === n.toString();
      if (a = Object.keys(e), o = a.length, o !== Object.keys(n).length) return !1;
      for (r = o; r-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, a[r])) return !1;
      for (r = o; r-- !== 0; ) {
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
    for (var n = 0, o = e.length, r = 0, a; r < o; )
      n++, a = e.charCodeAt(r++), a >= 55296 && a <= 56319 && r < o && (a = e.charCodeAt(r), (a & 64512) == 56320 && r++);
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
    getProperty: c,
    escapeQuotes: y,
    equal: requireFastDeepEqual(),
    ucs2length: requireUcs2length(),
    varOccurences: u,
    varReplace: m,
    schemaHasRules: w,
    schemaHasRulesExcept: R,
    schemaUnknownRules: h,
    toQuotedString: q,
    getPathExpr: d,
    getPath: v,
    getData: I,
    unescapeFragment: $,
    unescapeJsonPointer: V,
    escapeFragment: x,
    escapeJsonPointer: j
  };
  function t(C, z) {
    z = z || {};
    for (var g in C) z[g] = C[g];
    return z;
  }
  function e(C, z, g, D) {
    var ie = D ? " !== " : " === ", de = D ? " || " : " && ", we = D ? "!" : "", be = D ? "" : "!";
    switch (C) {
      case "null":
        return z + ie + "null";
      case "array":
        return we + "Array.isArray(" + z + ")";
      case "object":
        return "(" + we + z + de + "typeof " + z + ie + '"object"' + de + be + "Array.isArray(" + z + "))";
      case "integer":
        return "(typeof " + z + ie + '"number"' + de + be + "(" + z + " % 1)" + de + z + ie + z + (g ? de + we + "isFinite(" + z + ")" : "") + ")";
      case "number":
        return "(typeof " + z + ie + '"' + C + '"' + (g ? de + we + "isFinite(" + z + ")" : "") + ")";
      default:
        return "typeof " + z + ie + '"' + C + '"';
    }
  }
  function n(C, z, g) {
    switch (C.length) {
      case 1:
        return e(C[0], z, g, !0);
      default:
        var D = "", ie = a(C);
        ie.array && ie.object && (D = ie.null ? "(" : "(!" + z + " || ", D += "typeof " + z + ' !== "object")', delete ie.null, delete ie.array, delete ie.object), ie.number && delete ie.integer;
        for (var de in ie)
          D += (D ? " && " : "") + e(de, z, g, !0);
        return D;
    }
  }
  var o = a(["string", "number", "integer", "boolean", "null"]);
  function r(C, z) {
    if (Array.isArray(z)) {
      for (var g = [], D = 0; D < z.length; D++) {
        var ie = z[D];
        (o[ie] || C === "array" && ie === "array") && (g[g.length] = ie);
      }
      if (g.length) return g;
    } else {
      if (o[z])
        return [z];
      if (C === "array" && z === "array")
        return ["array"];
    }
  }
  function a(C) {
    for (var z = {}, g = 0; g < C.length; g++) z[C[g]] = !0;
    return z;
  }
  var f = /^[a-z$_][a-z$_0-9]*$/i, l = /'|\\/g;
  function c(C) {
    return typeof C == "number" ? "[" + C + "]" : f.test(C) ? "." + C : "['" + y(C) + "']";
  }
  function y(C) {
    return C.replace(l, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
  }
  function u(C, z) {
    z += "[^0-9]";
    var g = C.match(new RegExp(z, "g"));
    return g ? g.length : 0;
  }
  function m(C, z, g) {
    return z += "([^0-9])", g = g.replace(/\$/g, "$$$$"), C.replace(new RegExp(z, "g"), g + "$1");
  }
  function w(C, z) {
    if (typeof C == "boolean") return !C;
    for (var g in C) if (z[g]) return !0;
  }
  function R(C, z, g) {
    if (typeof C == "boolean") return !C && g != "not";
    for (var D in C) if (D != g && z[D]) return !0;
  }
  function h(C, z) {
    if (typeof C != "boolean") {
      for (var g in C) if (!z[g]) return g;
    }
  }
  function q(C) {
    return "'" + y(C) + "'";
  }
  function d(C, z, g, D) {
    var ie = g ? "'/' + " + z + (D ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : D ? "'[' + " + z + " + ']'" : "'[\\'' + " + z + " + '\\']'";
    return T(C, ie);
  }
  function v(C, z, g) {
    var D = q(g ? "/" + j(z) : c(z));
    return T(C, D);
  }
  var P = /^\/(?:[^~]|~0|~1)*$/, E = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function I(C, z, g) {
    var D, ie, de, we;
    if (C === "") return "rootData";
    if (C[0] == "/") {
      if (!P.test(C)) throw new Error("Invalid JSON-pointer: " + C);
      ie = C, de = "rootData";
    } else {
      if (we = C.match(E), !we) throw new Error("Invalid JSON-pointer: " + C);
      if (D = +we[1], ie = we[2], ie == "#") {
        if (D >= z) throw new Error("Cannot access property/index " + D + " levels up, current level is " + z);
        return g[z - D];
      }
      if (D > z) throw new Error("Cannot access data " + D + " levels up, current level is " + z);
      if (de = "data" + (z - D || ""), !ie) return de;
    }
    for (var be = de, ce = ie.split("/"), fe = 0; fe < ce.length; fe++) {
      var M = ce[fe];
      M && (de += c(V(M)), be += " && " + de);
    }
    return be;
  }
  function T(C, z) {
    return C == '""' ? z : (C + " + " + z).replace(/([^\\])' \+ '/g, "$1");
  }
  function $(C) {
    return V(decodeURIComponent(C));
  }
  function x(C) {
    return encodeURIComponent(j(C));
  }
  function j(C) {
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
  var t = jsonSchemaTraverse.exports = function(o, r, a) {
    typeof r == "function" && (a = r, r = {}), a = r.cb || a;
    var f = typeof a == "function" ? a : a.pre || function() {
    }, l = a.post || function() {
    };
    e(r, f, l, o, "", o);
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
  function e(o, r, a, f, l, c, y, u, m, w) {
    if (f && typeof f == "object" && !Array.isArray(f)) {
      r(f, l, c, y, u, m, w);
      for (var R in f) {
        var h = f[R];
        if (Array.isArray(h)) {
          if (R in t.arrayKeywords)
            for (var q = 0; q < h.length; q++)
              e(o, r, a, h[q], l + "/" + R + "/" + q, c, l, R, f, q);
        } else if (R in t.propsKeywords) {
          if (h && typeof h == "object")
            for (var d in h)
              e(o, r, a, h[d], l + "/" + R + "/" + n(d), c, l, R, f, d);
        } else (R in t.keywords || o.allKeys && !(R in t.skipKeywords)) && e(o, r, a, h, l + "/" + R, c, l, R, f);
      }
      a(f, l, c, y, u, m, w);
    }
  }
  function n(o) {
    return o.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return jsonSchemaTraverse.exports;
}
var resolve_1, hasRequiredResolve;
function requireResolve() {
  if (hasRequiredResolve) return resolve_1;
  hasRequiredResolve = 1;
  var t = requireUri_all(), e = requireFastDeepEqual(), n = requireUtil$1(), o = requireSchema_obj(), r = requireJsonSchemaTraverse();
  resolve_1 = a, a.normalizeId = v, a.fullPath = h, a.url = P, a.ids = E, a.inlineRef = m, a.schema = f;
  function a(I, T, $) {
    var x = this._refs[$];
    if (typeof x == "string")
      if (this._refs[x]) x = this._refs[x];
      else return a.call(this, I, T, x);
    if (x = x || this._schemas[$], x instanceof o)
      return m(x.schema, this._opts.inlineRefs) ? x.schema : x.validate || this._compile(x);
    var j = f.call(this, T, $), V, C, z;
    return j && (V = j.schema, T = j.root, z = j.baseId), V instanceof o ? C = V.validate || I.call(this, V.schema, T, void 0, z) : V !== void 0 && (C = m(V, this._opts.inlineRefs) ? V : I.call(this, V, T, void 0, z)), C;
  }
  function f(I, T) {
    var $ = t.parse(T), x = q($), j = h(this._getId(I.schema));
    if (Object.keys(I.schema).length === 0 || x !== j) {
      var V = v(x), C = this._refs[V];
      if (typeof C == "string")
        return l.call(this, I, C, $);
      if (C instanceof o)
        C.validate || this._compile(C), I = C;
      else if (C = this._schemas[V], C instanceof o) {
        if (C.validate || this._compile(C), V == v(T))
          return { schema: C, root: I, baseId: j };
        I = C;
      } else
        return;
      if (!I.schema) return;
      j = h(this._getId(I.schema));
    }
    return y.call(this, $, j, I.schema, I);
  }
  function l(I, T, $) {
    var x = f.call(this, I, T);
    if (x) {
      var j = x.schema, V = x.baseId;
      I = x.root;
      var C = this._getId(j);
      return C && (V = P(V, C)), y.call(this, $, V, j, I);
    }
  }
  var c = n.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function y(I, T, $, x) {
    if (I.fragment = I.fragment || "", I.fragment.slice(0, 1) == "/") {
      for (var j = I.fragment.split("/"), V = 1; V < j.length; V++) {
        var C = j[V];
        if (C) {
          if (C = n.unescapeFragment(C), $ = $[C], $ === void 0) break;
          var z;
          if (!c[C] && (z = this._getId($), z && (T = P(T, z)), $.$ref)) {
            var g = P(T, $.$ref), D = f.call(this, x, g);
            D && ($ = D.schema, x = D.root, T = D.baseId);
          }
        }
      }
      if ($ !== void 0 && $ !== x.schema)
        return { schema: $, root: x, baseId: T };
    }
  }
  var u = n.toHash([
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
  function m(I, T) {
    if (T === !1) return !1;
    if (T === void 0 || T === !0) return w(I);
    if (T) return R(I) <= T;
  }
  function w(I) {
    var T;
    if (Array.isArray(I)) {
      for (var $ = 0; $ < I.length; $++)
        if (T = I[$], typeof T == "object" && !w(T)) return !1;
    } else
      for (var x in I)
        if (x == "$ref" || (T = I[x], typeof T == "object" && !w(T))) return !1;
    return !0;
  }
  function R(I) {
    var T = 0, $;
    if (Array.isArray(I)) {
      for (var x = 0; x < I.length; x++)
        if ($ = I[x], typeof $ == "object" && (T += R($)), T == 1 / 0) return 1 / 0;
    } else
      for (var j in I) {
        if (j == "$ref") return 1 / 0;
        if (u[j])
          T++;
        else if ($ = I[j], typeof $ == "object" && (T += R($) + 1), T == 1 / 0) return 1 / 0;
      }
    return T;
  }
  function h(I, T) {
    T !== !1 && (I = v(I));
    var $ = t.parse(I);
    return q($);
  }
  function q(I) {
    return t.serialize(I).split("#")[0] + "#";
  }
  var d = /#\/?$/;
  function v(I) {
    return I ? I.replace(d, "") : "";
  }
  function P(I, T) {
    return T = v(T), t.resolve(I, T);
  }
  function E(I) {
    var T = v(this._getId(I)), $ = { "": T }, x = { "": h(T, !1) }, j = {}, V = this;
    return r(I, { allKeys: !0 }, function(C, z, g, D, ie, de, we) {
      if (z !== "") {
        var be = V._getId(C), ce = $[D], fe = x[D] + "/" + ie;
        if (we !== void 0 && (fe += "/" + (typeof we == "number" ? we : n.escapeFragment(we))), typeof be == "string") {
          be = ce = v(ce ? t.resolve(ce, be) : be);
          var M = V._refs[be];
          if (typeof M == "string" && (M = V._refs[M]), M && M.schema) {
            if (!e(C, M.schema))
              throw new Error('id "' + be + '" resolves to more than one schema');
          } else if (be != v(fe))
            if (be[0] == "#") {
              if (j[be] && !e(C, j[be]))
                throw new Error('id "' + be + '" resolves to more than one schema');
              j[be] = C;
            } else
              V._refs[be] = fe;
        }
        $[z] = ce, x[z] = fe;
      }
    }), j;
  }
  return resolve_1;
}
var error_classes, hasRequiredError_classes;
function requireError_classes() {
  if (hasRequiredError_classes) return error_classes;
  hasRequiredError_classes = 1;
  var t = requireResolve();
  error_classes = {
    Validation: o(e),
    MissingRef: o(n)
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
  function o(r) {
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
  }
  return error_classes;
}
var fastJsonStableStringify, hasRequiredFastJsonStableStringify;
function requireFastJsonStableStringify() {
  return hasRequiredFastJsonStableStringify || (hasRequiredFastJsonStableStringify = 1, fastJsonStableStringify = function(t, e) {
    e || (e = {}), typeof e == "function" && (e = { cmp: e });
    var n = typeof e.cycles == "boolean" ? e.cycles : !1, o = e.cmp && /* @__PURE__ */ (function(a) {
      return function(f) {
        return function(l, c) {
          var y = { key: l, value: f[l] }, u = { key: c, value: f[c] };
          return a(y, u);
        };
      };
    })(e.cmp), r = [];
    return (function a(f) {
      if (f && f.toJSON && typeof f.toJSON == "function" && (f = f.toJSON()), f !== void 0) {
        if (typeof f == "number") return isFinite(f) ? "" + f : "null";
        if (typeof f != "object") return JSON.stringify(f);
        var l, c;
        if (Array.isArray(f)) {
          for (c = "[", l = 0; l < f.length; l++)
            l && (c += ","), c += a(f[l]) || "null";
          return c + "]";
        }
        if (f === null) return "null";
        if (r.indexOf(f) !== -1) {
          if (n) return JSON.stringify("__cycle__");
          throw new TypeError("Converting circular structure to JSON");
        }
        var y = r.push(f) - 1, u = Object.keys(f).sort(o && o(f));
        for (c = "", l = 0; l < u.length; l++) {
          var m = u[l], w = a(f[m]);
          w && (c && (c += ","), c += JSON.stringify(m) + ":" + w);
        }
        return r.splice(y, 1), "{" + c + "}";
      }
    })(t);
  }), fastJsonStableStringify;
}
var validate, hasRequiredValidate;
function requireValidate() {
  return hasRequiredValidate || (hasRequiredValidate = 1, validate = function(e, n, o) {
    var r = "", a = e.schema.$async === !0, f = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), l = e.self._getId(e.schema);
    if (e.opts.strictKeywords) {
      var c = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
      if (c) {
        var y = "unknown keyword: " + c;
        if (e.opts.strictKeywords === "log") e.logger.warn(y);
        else throw new Error(y);
      }
    }
    if (e.isTop && (r += " var validate = ", a && (e.async = !0, r += "async "), r += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", l && (e.opts.sourceCode || e.opts.processCode) && (r += " " + ("/*# sourceURL=" + l + " */") + " ")), typeof e.schema == "boolean" || !(f || e.schema.$ref)) {
      var n = "false schema", u = e.level, m = e.dataLevel, w = e.schema[n], R = e.schemaPath + e.util.getProperty(n), h = e.errSchemaPath + "/" + n, T = !e.opts.allErrors, j, q = "data" + (m || ""), I = "valid" + u;
      if (e.schema === !1) {
        e.isTop ? T = !0 : r += " var " + I + " = false; ";
        var d = d || [];
        d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (j || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'boolean schema is false' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
        var v = r;
        r = d.pop(), !e.compositeRule && T ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else
        e.isTop ? a ? r += " return data; " : r += " validate.errors = null; return true; " : r += " var " + I + " = true; ";
      return e.isTop && (r += " }; return validate; "), r;
    }
    if (e.isTop) {
      var P = e.isTop, u = e.level = 0, m = e.dataLevel = 0, q = "data";
      if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
        var E = "default is ignored in the schema root";
        if (e.opts.strictDefaults === "log") e.logger.warn(E);
        else throw new Error(E);
      }
      r += " var vErrors = null; ", r += " var errors = 0;     ", r += " if (rootData === undefined) rootData = data; ";
    } else {
      var u = e.level, m = e.dataLevel, q = "data" + (m || "");
      if (l && (e.baseId = e.resolve.url(e.baseId, l)), a && !e.async) throw new Error("async schema in sync schema");
      r += " var errs_" + u + " = errors;";
    }
    var I = "valid" + u, T = !e.opts.allErrors, $ = "", x = "", j, V = e.schema.type, C = Array.isArray(V);
    if (V && e.opts.nullable && e.schema.nullable === !0 && (C ? V.indexOf("null") == -1 && (V = V.concat("null")) : V != "null" && (V = [V, "null"], C = !0)), C && V.length == 1 && (V = V[0], C = !1), e.schema.$ref && f) {
      if (e.opts.extendRefs == "fail")
        throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
      e.opts.extendRefs !== !0 && (f = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
    }
    if (e.schema.$comment && e.opts.$comment && (r += " " + e.RULES.all.$comment.code(e, "$comment")), V) {
      if (e.opts.coerceTypes)
        var z = e.util.coerceToTypes(e.opts.coerceTypes, V);
      var g = e.RULES.types[V];
      if (z || C || g === !0 || g && !te(g)) {
        var R = e.schemaPath + ".type", h = e.errSchemaPath + "/type", R = e.schemaPath + ".type", h = e.errSchemaPath + "/type", D = C ? "checkDataTypes" : "checkDataType";
        if (r += " if (" + e.util[D](V, q, e.opts.strictNumbers, !0) + ") { ", z) {
          var ie = "dataType" + u, de = "coerced" + u;
          r += " var " + ie + " = typeof " + q + "; var " + de + " = undefined; ", e.opts.coerceTypes == "array" && (r += " if (" + ie + " == 'object' && Array.isArray(" + q + ") && " + q + ".length == 1) { " + q + " = " + q + "[0]; " + ie + " = typeof " + q + "; if (" + e.util.checkDataType(e.schema.type, q, e.opts.strictNumbers) + ") " + de + " = " + q + "; } "), r += " if (" + de + " !== undefined) ; ";
          var we = z;
          if (we)
            for (var be, ce = -1, fe = we.length - 1; ce < fe; )
              be = we[ce += 1], be == "string" ? r += " else if (" + ie + " == 'number' || " + ie + " == 'boolean') " + de + " = '' + " + q + "; else if (" + q + " === null) " + de + " = ''; " : be == "number" || be == "integer" ? (r += " else if (" + ie + " == 'boolean' || " + q + " === null || (" + ie + " == 'string' && " + q + " && " + q + " == +" + q + " ", be == "integer" && (r += " && !(" + q + " % 1)"), r += ")) " + de + " = +" + q + "; ") : be == "boolean" ? r += " else if (" + q + " === 'false' || " + q + " === 0 || " + q + " === null) " + de + " = false; else if (" + q + " === 'true' || " + q + " === 1) " + de + " = true; " : be == "null" ? r += " else if (" + q + " === '' || " + q + " === 0 || " + q + " === false) " + de + " = null; " : e.opts.coerceTypes == "array" && be == "array" && (r += " else if (" + ie + " == 'string' || " + ie + " == 'number' || " + ie + " == 'boolean' || " + q + " == null) " + de + " = [" + q + "]; ");
          r += " else {   ";
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (j || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
          var v = r;
          r = d.pop(), !e.compositeRule && T ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } if (" + de + " !== undefined) {  ";
          var M = m ? "data" + (m - 1 || "") : "parentData", pe = m ? e.dataPathArr[m] : "parentDataProperty";
          r += " " + q + " = " + de + "; ", m || (r += "if (" + M + " !== undefined)"), r += " " + M + "[" + pe + "] = " + de + "; } ";
        } else {
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (j || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
          var v = r;
          r = d.pop(), !e.compositeRule && T ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        r += " } ";
      }
    }
    if (e.schema.$ref && !f)
      r += " " + e.RULES.all.$ref.code(e, "$ref") + " ", T && (r += " } if (errors === ", P ? r += "0" : r += "errs_" + u, r += ") { ", x += "}");
    else {
      var ee = e.RULES;
      if (ee) {
        for (var g, Q = -1, Z = ee.length - 1; Q < Z; )
          if (g = ee[Q += 1], te(g)) {
            if (g.type && (r += " if (" + e.util.checkDataType(g.type, q, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
              if (g.type == "object" && e.schema.properties) {
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
              } else if (g.type == "array" && Array.isArray(e.schema.items)) {
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
            var se = g.rules;
            if (se) {
              for (var Ee, Re = -1, Pe = se.length - 1; Re < Pe; )
                if (Ee = se[Re += 1], $e(Ee)) {
                  var Oe = Ee.code(e, Ee.keyword, g.type);
                  Oe && (r += " " + Oe + " ", T && ($ += "}"));
                }
            }
            if (T && (r += " " + $ + " ", $ = ""), g.type && (r += " } ", V && V === g.type && !z)) {
              r += " else { ";
              var R = e.schemaPath + ".type", h = e.errSchemaPath + "/type", d = d || [];
              d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (j || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", C ? r += "" + V.join(",") : r += "" + V, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + V.join(",") : r += "" + V, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + R + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + q + " "), r += " } ") : r += " {} ";
              var v = r;
              r = d.pop(), !e.compositeRule && T ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ";
            }
            T && (r += " if (errors === ", P ? r += "0" : r += "errs_" + u, r += ") { ", x += "}");
          }
      }
    }
    T && (r += " " + x + " "), P ? (a ? (r += " if (errors === 0) return data;           ", r += " else throw new ValidationError(vErrors); ") : (r += " validate.errors = vErrors; ", r += " return errors === 0;       "), r += " }; return validate;") : r += " var " + I + " = errors === errs_" + u + ";";
    function te(Ae) {
      for (var Ue = Ae.rules, ge = 0; ge < Ue.length; ge++)
        if ($e(Ue[ge])) return !0;
    }
    function $e(Ae) {
      return e.schema[Ae.keyword] !== void 0 || Ae.implements && Ce(Ae);
    }
    function Ce(Ae) {
      for (var Ue = Ae.implements, ge = 0; ge < Ue.length; ge++)
        if (e.schema[Ue[ge]] !== void 0) return !0;
    }
    return r;
  }), validate;
}
var compile_1, hasRequiredCompile;
function requireCompile() {
  if (hasRequiredCompile) return compile_1;
  hasRequiredCompile = 1;
  var t = requireResolve(), e = requireUtil$1(), n = requireError_classes(), o = requireFastJsonStableStringify(), r = requireValidate(), a = e.ucs2length, f = requireFastDeepEqual(), l = n.Validation;
  compile_1 = c;
  function c(d, v, P, E) {
    var I = this, T = this._opts, $ = [void 0], x = {}, j = [], V = {}, C = [], z = {}, g = [];
    function D(ne, F) {
      var L = T.regExp ? "regExp" : "new RegExp";
      return "var pattern" + ne + " = " + L + "(" + e.toQuotedString(F[ne]) + ");";
    }
    v = v || { schema: d, refVal: $, refs: x };
    var ie = y.call(this, d, v, E), de = this._compilations[ie.index];
    if (ie.compiling) return de.callValidate = M;
    var we = this._formats, be = this.RULES;
    try {
      var ce = pe(d, v, P, E);
      de.validate = ce;
      var fe = de.callValidate;
      return fe && (fe.schema = ce.schema, fe.errors = null, fe.refs = ce.refs, fe.refVal = ce.refVal, fe.root = ce.root, fe.$async = ce.$async, T.sourceCode && (fe.source = ce.source)), ce;
    } finally {
      u.call(this, d, v, E);
    }
    function M() {
      var ne = de.validate, F = ne.apply(this, arguments);
      return M.errors = ne.errors, F;
    }
    function pe(ne, F, L, H) {
      var se = !F || F && F.schema == ne;
      if (F.schema != v.schema)
        return c.call(I, ne, F, L, H);
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
        opts: T,
        formats: we,
        logger: I.logger,
        self: I
      });
      Re = q($, R) + q(j, D) + q(C, w) + q(g, h) + Re, T.processCode && (Re = T.processCode(Re, ne));
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
          g,
          f,
          a,
          l,
          T.regExp
        ), $[0] = Pe;
      } catch (te) {
        throw I.logger.error("Error compiling schema, function code:", Re), te;
      }
      return Pe.schema = ne, Pe.errors = null, Pe.refs = x, Pe.refVal = $, Pe.root = se ? Pe : F, Ee && (Pe.$async = !0), T.sourceCode === !0 && (Pe.source = {
        code: Re,
        patterns: j,
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
          return se = v.refVal[Re], Ee = Q(F, se), O(se, Ee);
      }
      Ee = Q(F);
      var Pe = t.call(I, pe, v, F);
      if (Pe === void 0) {
        var Oe = P && P[F];
        Oe && (Pe = t.inlineRef(Oe, T.inlineRefs) ? Oe : c.call(I, Oe, v, P, ne));
      }
      if (Pe === void 0)
        Z(F);
      else
        return le(F, Pe), O(Pe, Ee);
    }
    function Q(ne, F) {
      var L = $.length;
      return $[L] = F, x[ne] = L, "refVal" + L;
    }
    function Z(ne) {
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
      return F === void 0 && (F = V[ne] = j.length, j[F] = ne), "pattern" + F;
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
          var F = o(ne), L = z[F];
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
        Ce = $e.call(I, F, L, H), T.validateSchema !== !1 && I.validateSchema(Ce, !0);
      else if (te)
        Ce = te.call(I, H, ne.keyword, F, L);
      else if (Ce = ne.definition.validate, !Ce) return;
      if (Ce === void 0)
        throw new Error('custom keyword "' + ne.keyword + '"failed to compile');
      var Ae = g.length;
      return g[Ae] = Ce, {
        code: "customRule" + Ae,
        validate: Ce
      };
    }
  }
  function y(d, v, P) {
    var E = m.call(this, d, v, P);
    return E >= 0 ? { index: E, compiling: !0 } : (E = this._compilations.length, this._compilations[E] = {
      schema: d,
      root: v,
      baseId: P
    }, { index: E, compiling: !1 });
  }
  function u(d, v, P) {
    var E = m.call(this, d, v, P);
    E >= 0 && this._compilations.splice(E, 1);
  }
  function m(d, v, P) {
    for (var E = 0; E < this._compilations.length; E++) {
      var I = this._compilations[E];
      if (I.schema == d && I.root == v && I.baseId == P) return E;
    }
    return -1;
  }
  function w(d) {
    return "var default" + d + " = defaults[" + d + "];";
  }
  function R(d, v) {
    return v[d] === void 0 ? "" : "var refVal" + d + " = refVal[" + d + "];";
  }
  function h(d) {
    return "var customRule" + d + " = customRules[" + d + "];";
  }
  function q(d, v) {
    if (!d.length) return "";
    for (var P = "", E = 0; E < d.length; E++)
      P += v(E, d);
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
  return t.prototype.put = function(n, o) {
    this._cache[n] = o;
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
  var t = requireUtil$1(), e = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, n = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], o = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, r = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, a = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, f = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, l = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, c = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, y = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, u = /^(?:\/(?:[^~/]|~0|~1)*)*$/, m = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, w = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
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
    "uri-template": l,
    url: c,
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
    uuid: y,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": u,
    "json-pointer-uri-fragment": m,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": w
  }, R.full = {
    date: q,
    time: d,
    "date-time": P,
    uri: I,
    "uri-reference": f,
    "uri-template": l,
    url: c,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: r,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: $,
    uuid: y,
    "json-pointer": u,
    "json-pointer-uri-fragment": m,
    "relative-json-pointer": w
  };
  function h(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  function q(x) {
    var j = x.match(e);
    if (!j) return !1;
    var V = +j[1], C = +j[2], z = +j[3];
    return C >= 1 && C <= 12 && z >= 1 && z <= (C == 2 && h(V) ? 29 : n[C]);
  }
  function d(x, j) {
    var V = x.match(o);
    if (!V) return !1;
    var C = V[1], z = V[2], g = V[3], D = V[5];
    return (C <= 23 && z <= 59 && g <= 59 || C == 23 && z == 59 && g == 60) && (!j || D);
  }
  var v = /t|\s/i;
  function P(x) {
    var j = x.split(v);
    return j.length == 2 && q(j[0]) && d(j[1], !0);
  }
  var E = /\/|:/;
  function I(x) {
    return E.test(x) && a.test(x);
  }
  var T = /[^\\]\\Z/;
  function $(x) {
    if (T.test(x)) return !1;
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
  return hasRequiredRef || (hasRequiredRef = 1, ref = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.errSchemaPath + "/" + n, y = !e.opts.allErrors, u = "data" + (f || ""), m = "valid" + a, w, R;
    if (l == "#" || l == "#/")
      e.isRoot ? (w = e.async, R = "validate") : (w = e.root.schema.$async === !0, R = "root.refVal[0]");
    else {
      var h = e.resolveRef(e.baseId, l, e.isRoot);
      if (h === void 0) {
        var q = e.MissingRefError.message(e.baseId, l);
        if (e.opts.missingRefs == "fail") {
          e.logger.error(q);
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { ref: '" + e.util.escapeQuotes(l) + "' } ", e.opts.messages !== !1 && (r += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(l) + "' "), e.opts.verbose && (r += " , schema: " + e.util.toQuotedString(l) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + u + " "), r += " } ") : r += " {} ";
          var v = r;
          r = d.pop(), !e.compositeRule && y ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", y && (r += " if (false) { ");
        } else if (e.opts.missingRefs == "ignore")
          e.logger.warn(q), y && (r += " if (true) { ");
        else
          throw new e.MissingRefError(e.baseId, l, q);
      } else if (h.inline) {
        var P = e.util.copy(e);
        P.level++;
        var E = "valid" + P.level;
        P.schema = h.schema, P.schemaPath = "", P.errSchemaPath = l;
        var I = e.validate(P).replace(/validate\.schema/g, h.code);
        r += " " + I + " ", y && (r += " if (" + E + ") { ");
      } else
        w = h.$async === !0 || e.async && h.$async !== !1, R = h.code;
    }
    if (R) {
      var d = d || [];
      d.push(r), r = "", e.opts.passContext ? r += " " + R + ".call(this, " : r += " " + R + "( ", r += " " + u + ", (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var T = f ? "data" + (f - 1 || "") : "parentData", $ = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + T + " , " + $ + ", rootData)  ";
      var x = r;
      if (r = d.pop(), w) {
        if (!e.async) throw new Error("async schema referenced by sync schema");
        y && (r += " var " + m + "; "), r += " try { await " + x + "; ", y && (r += " " + m + " = true; "), r += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", y && (r += " " + m + " = false; "), r += " } ", y && (r += " if (" + m + ") { ");
      } else
        r += " if (!" + x + ") { if (vErrors === null) vErrors = " + R + ".errors; else vErrors = vErrors.concat(" + R + ".errors); errors = vErrors.length; } ", y && (r += " else { ");
    }
    return r;
  }), ref;
}
var allOf, hasRequiredAllOf;
function requireAllOf() {
  return hasRequiredAllOf || (hasRequiredAllOf = 1, allOf = function(e, n, o) {
    var r = " ", a = e.schema[n], f = e.schemaPath + e.util.getProperty(n), l = e.errSchemaPath + "/" + n, c = !e.opts.allErrors, y = e.util.copy(e), u = "";
    y.level++;
    var m = "valid" + y.level, w = y.baseId, R = !0, h = a;
    if (h)
      for (var q, d = -1, v = h.length - 1; d < v; )
        q = h[d += 1], (e.opts.strictKeywords ? typeof q == "object" && Object.keys(q).length > 0 || q === !1 : e.util.schemaHasRules(q, e.RULES.all)) && (R = !1, y.schema = q, y.schemaPath = f + "[" + d + "]", y.errSchemaPath = l + "/" + d, r += "  " + e.validate(y) + " ", y.baseId = w, c && (r += " if (" + m + ") { ", u += "}"));
    return c && (R ? r += " if (true) { " : r += " " + u.slice(0, -1) + " "), r;
  }), allOf;
}
var anyOf, hasRequiredAnyOf;
function requireAnyOf() {
  return hasRequiredAnyOf || (hasRequiredAnyOf = 1, anyOf = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, h = e.util.copy(e), q = "";
    h.level++;
    var d = "valid" + h.level, v = l.every(function(j) {
      return e.opts.strictKeywords ? typeof j == "object" && Object.keys(j).length > 0 || j === !1 : e.util.schemaHasRules(j, e.RULES.all);
    });
    if (v) {
      var P = h.baseId;
      r += " var " + R + " = errors; var " + w + " = false;  ";
      var E = e.compositeRule;
      e.compositeRule = h.compositeRule = !0;
      var I = l;
      if (I)
        for (var T, $ = -1, x = I.length - 1; $ < x; )
          T = I[$ += 1], h.schema = T, h.schemaPath = c + "[" + $ + "]", h.errSchemaPath = y + "/" + $, r += "  " + e.validate(h) + " ", h.baseId = P, r += " " + w + " = " + w + " || " + d + "; if (!" + w + ") { ", q += "}";
      e.compositeRule = h.compositeRule = E, r += " " + q + " if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " } else {  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      u && (r += " if (true) { ");
    return r;
  }), anyOf;
}
var comment, hasRequiredComment;
function requireComment() {
  return hasRequiredComment || (hasRequiredComment = 1, comment = function(e, n, o) {
    var r = " ", a = e.schema[n], f = e.errSchemaPath + "/" + n;
    e.opts.allErrors;
    var l = e.util.toQuotedString(a);
    return e.opts.$comment === !0 ? r += " console.log(" + l + ");" : typeof e.opts.$comment == "function" && (r += " self._opts.$comment(" + l + ", " + e.util.toQuotedString(f) + ", validate.root.schema);"), r;
  }), comment;
}
var _const, hasRequired_const;
function require_const() {
  return hasRequired_const || (hasRequired_const = 1, _const = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && l && l.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; "), R || (r += " var schema" + a + " = validate.schema" + c + ";"), r += "var " + w + " = equal(" + m + ", schema" + a + "); if (!" + w + ") {   ";
    var h = h || [];
    h.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { allowedValue: schema" + a + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to constant' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var q = r;
    return r = h.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + q + "]); " : r += " validate.errors = [" + q + "]; return false; " : r += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", u && (r += " else { "), r;
  }), _const;
}
var contains, hasRequiredContains;
function requireContains() {
  return hasRequiredContains || (hasRequiredContains = 1, contains = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, h = e.util.copy(e), q = "";
    h.level++;
    var d = "valid" + h.level, v = "i" + a, P = h.dataLevel = e.dataLevel + 1, E = "data" + P, I = e.baseId, T = e.opts.strictKeywords ? typeof l == "object" && Object.keys(l).length > 0 || l === !1 : e.util.schemaHasRules(l, e.RULES.all);
    if (r += "var " + R + " = errors;var " + w + ";", T) {
      var $ = e.compositeRule;
      e.compositeRule = h.compositeRule = !0, h.schema = l, h.schemaPath = c, h.errSchemaPath = y, r += " var " + d + " = false; for (var " + v + " = 0; " + v + " < " + m + ".length; " + v + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
      var x = m + "[" + v + "]";
      h.dataPathArr[P] = v;
      var j = e.validate(h);
      h.baseId = I, e.util.varOccurences(j, E) < 2 ? r += " " + e.util.varReplace(j, E, x) + " " : r += " var " + E + " = " + x + "; " + j + " ", r += " if (" + d + ") break; }  ", e.compositeRule = h.compositeRule = $, r += " " + q + " if (!" + d + ") {";
    } else
      r += " if (" + m + ".length == 0) {";
    var V = V || [];
    V.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should contain a valid item' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var C = r;
    return r = V.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + C + "]); " : r += " validate.errors = [" + C + "]; return false; " : r += " var err = " + C + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ", T && (r += "  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; } "), e.opts.allErrors && (r += " } "), r;
  }), contains;
}
var dependencies, hasRequiredDependencies;
function requireDependencies() {
  return hasRequiredDependencies || (hasRequiredDependencies = 1, dependencies = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), h = "";
    R.level++;
    var q = "valid" + R.level, d = {}, v = {}, P = e.opts.ownProperties;
    for ($ in l)
      if ($ != "__proto__") {
        var E = l[$], I = Array.isArray(E) ? v : d;
        I[$] = E;
      }
    r += "var " + w + " = errors;";
    var T = e.errorPath;
    r += "var missing" + a + ";";
    for (var $ in v)
      if (I = v[$], I.length) {
        if (r += " if ( " + m + e.util.getProperty($) + " !== undefined ", P && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), u) {
          r += " && ( ";
          var x = I;
          if (x)
            for (var j, V = -1, C = x.length - 1; V < C; ) {
              j = x[V += 1], V && (r += " || ");
              var z = e.util.getProperty(j), g = m + z;
              r += " ( ( " + g + " === undefined ", P && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(j) + "') "), r += ") && (missing" + a + " = " + e.util.toQuotedString(e.opts.jsonPointers ? j : z) + ") ) ";
            }
          r += ")) {  ";
          var D = "missing" + a, ie = "' + " + D + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(T, D, !0) : T + " + " + D);
          var de = de || [];
          de.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var we = r;
          r = de.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + we + "]); " : r += " validate.errors = [" + we + "]; return false; " : r += " var err = " + we + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        } else {
          r += " ) { ";
          var be = I;
          if (be)
            for (var j, ce = -1, fe = be.length - 1; ce < fe; ) {
              j = be[ce += 1];
              var z = e.util.getProperty(j), ie = e.util.escapeQuotes(j), g = m + z;
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(T, j, e.opts.jsonPointers)), r += " if ( " + g + " === undefined ", P && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(j) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
            }
        }
        r += " }   ", u && (h += "}", r += " else { ");
      }
    e.errorPath = T;
    var M = R.baseId;
    for (var $ in d) {
      var E = d[$];
      (e.opts.strictKeywords ? typeof E == "object" && Object.keys(E).length > 0 || E === !1 : e.util.schemaHasRules(E, e.RULES.all)) && (r += " " + q + " = true; if ( " + m + e.util.getProperty($) + " !== undefined ", P && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), r += ") { ", R.schema = E, R.schemaPath = c + e.util.getProperty($), R.errSchemaPath = y + "/" + e.util.escapeFragment($), r += "  " + e.validate(R) + " ", R.baseId = M, r += " }  ", u && (r += " if (" + q + ") { ", h += "}"));
    }
    return u && (r += "   " + h + " if (" + w + " == errors) {"), r;
  }), dependencies;
}
var _enum, hasRequired_enum;
function require_enum() {
  return hasRequired_enum || (hasRequired_enum = 1, _enum = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && l && l.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ");
    var h = "i" + a, q = "schema" + a;
    R || (r += " var " + q + " = validate.schema" + c + ";"), r += "var " + w + ";", R && (r += " if (schema" + a + " === undefined) " + w + " = true; else if (!Array.isArray(schema" + a + ")) " + w + " = false; else {"), r += "" + w + " = false;for (var " + h + "=0; " + h + "<" + q + ".length; " + h + "++) if (equal(" + m + ", " + q + "[" + h + "])) { " + w + " = true; break; }", R && (r += "  }  "), r += " if (!" + w + ") {   ";
    var d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { allowedValues: schema" + a + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = d.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", u && (r += " else { "), r;
  }), _enum;
}
var format, hasRequiredFormat;
function requireFormat() {
  return hasRequiredFormat || (hasRequiredFormat = 1, format = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || "");
    if (e.opts.format === !1)
      return u && (r += " if (true) { "), r;
    var w = e.opts.$data && l && l.$data, R;
    w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l;
    var h = e.opts.unknownFormats, q = Array.isArray(h);
    if (w) {
      var d = "format" + a, v = "isObject" + a, P = "formatType" + a;
      r += " var " + d + " = formats[" + R + "]; var " + v + " = typeof " + d + " == 'object' && !(" + d + " instanceof RegExp) && " + d + ".validate; var " + P + " = " + v + " && " + d + ".type || 'string'; if (" + v + ") { ", e.async && (r += " var async" + a + " = " + d + ".async; "), r += " " + d + " = " + d + ".validate; } if (  ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'string') || "), r += " (", h != "ignore" && (r += " (" + R + " && !" + d + " ", q && (r += " && self._opts.unknownFormats.indexOf(" + R + ") == -1 "), r += ") || "), r += " (" + d + " && " + P + " == '" + o + "' && !(typeof " + d + " == 'function' ? ", e.async ? r += " (async" + a + " ? await " + d + "(" + m + ") : " + d + "(" + m + ")) " : r += " " + d + "(" + m + ") ", r += " : " + d + ".test(" + m + "))))) {";
    } else {
      var d = e.formats[l];
      if (!d) {
        if (h == "ignore")
          return e.logger.warn('unknown format "' + l + '" ignored in schema at path "' + e.errSchemaPath + '"'), u && (r += " if (true) { "), r;
        if (q && h.indexOf(l) >= 0)
          return u && (r += " if (true) { "), r;
        throw new Error('unknown format "' + l + '" is used in schema at path "' + e.errSchemaPath + '"');
      }
      var v = typeof d == "object" && !(d instanceof RegExp) && d.validate, P = v && d.type || "string";
      if (v) {
        var E = d.async === !0;
        d = d.validate;
      }
      if (P != o)
        return u && (r += " if (true) { "), r;
      if (E) {
        if (!e.async) throw new Error("async format in sync schema");
        var I = "formats" + e.util.getProperty(l) + ".validate";
        r += " if (!(await " + I + "(" + m + "))) { ";
      } else {
        r += " if (! ";
        var I = "formats" + e.util.getProperty(l);
        v && (I += ".validate"), typeof d == "function" ? r += " " + I + "(" + m + ") " : r += " " + I + ".test(" + m + ") ", r += ") { ";
      }
    }
    var T = T || [];
    T.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { format:  ", w ? r += "" + R : r += "" + e.util.toQuotedString(l), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match format "`, w ? r += "' + " + R + " + '" : r += "" + e.util.escapeQuotes(l), r += `"' `), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + e.util.toQuotedString(l), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var $ = r;
    return r = T.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + $ + "]); " : r += " validate.errors = [" + $ + "]; return false; " : r += " var err = " + $ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", u && (r += " else { "), r;
  }), format;
}
var _if, hasRequired_if;
function require_if() {
  return hasRequired_if || (hasRequired_if = 1, _if = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, h = e.util.copy(e);
    h.level++;
    var q = "valid" + h.level, d = e.schema.then, v = e.schema.else, P = d !== void 0 && (e.opts.strictKeywords ? typeof d == "object" && Object.keys(d).length > 0 || d === !1 : e.util.schemaHasRules(d, e.RULES.all)), E = v !== void 0 && (e.opts.strictKeywords ? typeof v == "object" && Object.keys(v).length > 0 || v === !1 : e.util.schemaHasRules(v, e.RULES.all)), I = h.baseId;
    if (P || E) {
      var T;
      h.createErrors = !1, h.schema = l, h.schemaPath = c, h.errSchemaPath = y, r += " var " + R + " = errors; var " + w + " = true;  ";
      var $ = e.compositeRule;
      e.compositeRule = h.compositeRule = !0, r += "  " + e.validate(h) + " ", h.baseId = I, h.createErrors = !0, r += "  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; }  ", e.compositeRule = h.compositeRule = $, P ? (r += " if (" + q + ") {  ", h.schema = e.schema.then, h.schemaPath = e.schemaPath + ".then", h.errSchemaPath = e.errSchemaPath + "/then", r += "  " + e.validate(h) + " ", h.baseId = I, r += " " + w + " = " + q + "; ", P && E ? (T = "ifClause" + a, r += " var " + T + " = 'then'; ") : T = "'then'", r += " } ", E && (r += " else { ")) : r += " if (!" + q + ") { ", E && (h.schema = e.schema.else, h.schemaPath = e.schemaPath + ".else", h.errSchemaPath = e.errSchemaPath + "/else", r += "  " + e.validate(h) + " ", h.baseId = I, r += " " + w + " = " + q + "; ", P && E ? (T = "ifClause" + a, r += " var " + T + " = 'else'; ") : T = "'else'", r += " } "), r += " if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { failingKeyword: " + T + " } ", e.opts.messages !== !1 && (r += ` , message: 'should match "' + ` + T + ` + '" schema' `), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " }   ", u && (r += " else { ");
    } else
      u && (r += " if (true) { ");
    return r;
  }), _if;
}
var items, hasRequiredItems;
function requireItems() {
  return hasRequiredItems || (hasRequiredItems = 1, items = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, h = e.util.copy(e), q = "";
    h.level++;
    var d = "valid" + h.level, v = "i" + a, P = h.dataLevel = e.dataLevel + 1, E = "data" + P, I = e.baseId;
    if (r += "var " + R + " = errors;var " + w + ";", Array.isArray(l)) {
      var T = e.schema.additionalItems;
      if (T === !1) {
        r += " " + w + " = " + m + ".length <= " + l.length + "; ";
        var $ = y;
        y = e.errSchemaPath + "/additionalItems", r += "  if (!" + w + ") {   ";
        var x = x || [];
        x.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { limit: " + l.length + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have more than " + l.length + " items' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
        var j = r;
        r = x.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + j + "]); " : r += " validate.errors = [" + j + "]; return false; " : r += " var err = " + j + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", y = $, u && (q += "}", r += " else { ");
      }
      var V = l;
      if (V) {
        for (var C, z = -1, g = V.length - 1; z < g; )
          if (C = V[z += 1], e.opts.strictKeywords ? typeof C == "object" && Object.keys(C).length > 0 || C === !1 : e.util.schemaHasRules(C, e.RULES.all)) {
            r += " " + d + " = true; if (" + m + ".length > " + z + ") { ";
            var D = m + "[" + z + "]";
            h.schema = C, h.schemaPath = c + "[" + z + "]", h.errSchemaPath = y + "/" + z, h.errorPath = e.util.getPathExpr(e.errorPath, z, e.opts.jsonPointers, !0), h.dataPathArr[P] = z;
            var ie = e.validate(h);
            h.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", r += " }  ", u && (r += " if (" + d + ") { ", q += "}");
          }
      }
      if (typeof T == "object" && (e.opts.strictKeywords ? typeof T == "object" && Object.keys(T).length > 0 || T === !1 : e.util.schemaHasRules(T, e.RULES.all))) {
        h.schema = T, h.schemaPath = e.schemaPath + ".additionalItems", h.errSchemaPath = e.errSchemaPath + "/additionalItems", r += " " + d + " = true; if (" + m + ".length > " + l.length + ") {  for (var " + v + " = " + l.length + "; " + v + " < " + m + ".length; " + v + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
        var D = m + "[" + v + "]";
        h.dataPathArr[P] = v;
        var ie = e.validate(h);
        h.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", u && (r += " if (!" + d + ") break; "), r += " } }  ", u && (r += " if (" + d + ") { ", q += "}");
      }
    } else if (e.opts.strictKeywords ? typeof l == "object" && Object.keys(l).length > 0 || l === !1 : e.util.schemaHasRules(l, e.RULES.all)) {
      h.schema = l, h.schemaPath = c, h.errSchemaPath = y, r += "  for (var " + v + " = 0; " + v + " < " + m + ".length; " + v + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers, !0);
      var D = m + "[" + v + "]";
      h.dataPathArr[P] = v;
      var ie = e.validate(h);
      h.baseId = I, e.util.varOccurences(ie, E) < 2 ? r += " " + e.util.varReplace(ie, E, D) + " " : r += " var " + E + " = " + D + "; " + ie + " ", u && (r += " if (!" + d + ") break; "), r += " }";
    }
    return u && (r += " " + q + " if (" + R + " == errors) {"), r;
  }), items;
}
var _limit, hasRequired_limit;
function require_limit() {
  return hasRequired_limit || (hasRequired_limit = 1, _limit = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, I, m = "data" + (f || ""), w = e.opts.$data && l && l.$data, R;
    w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l;
    var h = n == "maximum", q = h ? "exclusiveMaximum" : "exclusiveMinimum", d = e.schema[q], v = e.opts.$data && d && d.$data, P = h ? "<" : ">", E = h ? ">" : "<", I = void 0;
    if (!(w || typeof l == "number" || l === void 0))
      throw new Error(n + " must be number");
    if (!(v || d === void 0 || typeof d == "number" || typeof d == "boolean"))
      throw new Error(q + " must be number or boolean");
    if (v) {
      var T = e.util.getData(d.$data, f, e.dataPathArr), $ = "exclusive" + a, x = "exclType" + a, j = "exclIsNumber" + a, V = "op" + a, C = "' + " + V + " + '";
      r += " var schemaExcl" + a + " = " + T + "; ", T = "schemaExcl" + a, r += " var " + $ + "; var " + x + " = typeof " + T + "; if (" + x + " != 'boolean' && " + x + " != 'undefined' && " + x + " != 'number') { ";
      var I = q, z = z || [];
      z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: '" + q + " should be boolean' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var g = r;
      r = z.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + g + "]); " : r += " validate.errors = [" + g + "]; return false; " : r += " var err = " + g + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + x + " == 'number' ? ( (" + $ + " = " + R + " === undefined || " + T + " " + P + "= " + R + ") ? " + m + " " + E + "= " + T + " : " + m + " " + E + " " + R + " ) : ( (" + $ + " = " + T + " === true) ? " + m + " " + E + "= " + R + " : " + m + " " + E + " " + R + " ) || " + m + " !== " + m + ") { var op" + a + " = " + $ + " ? '" + P + "' : '" + P + "='; ", l === void 0 && (I = q, y = e.errSchemaPath + "/" + q, R = T, w = v);
    } else {
      var j = typeof d == "number", C = P;
      if (j && w) {
        var V = "'" + C + "'";
        r += " if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " ( " + R + " === undefined || " + d + " " + P + "= " + R + " ? " + m + " " + E + "= " + d + " : " + m + " " + E + " " + R + " ) || " + m + " !== " + m + ") { ";
      } else {
        j && l === void 0 ? ($ = !0, I = q, y = e.errSchemaPath + "/" + q, R = d, E += "=") : (j && (R = Math[h ? "min" : "max"](d, l)), d === (j ? R : !0) ? ($ = !0, I = q, y = e.errSchemaPath + "/" + q, E += "=") : ($ = !1, C += "="));
        var V = "'" + C + "'";
        r += " if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + m + " " + E + " " + R + " || " + m + " !== " + m + ") { ";
      }
    }
    I = I || n;
    var z = z || [];
    z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { comparison: " + V + ", limit: " + R + ", exclusive: " + $ + " } ", e.opts.messages !== !1 && (r += " , message: 'should be " + C + " ", w ? r += "' + " + R : r += "" + R + "'"), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var g = r;
    return r = z.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + g + "]); " : r += " validate.errors = [" + g + "]; return false; " : r += " var err = " + g + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", u && (r += " else { "), r;
  }), _limit;
}
var _limitItems, hasRequired_limitItems;
function require_limitItems() {
  return hasRequired_limitItems || (hasRequired_limitItems = 1, _limitItems = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && l && l.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l, !(w || typeof l == "number"))
      throw new Error(n + " must be number");
    var h = n == "maxItems" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " " + m + ".length " + h + " " + R + ") { ";
    var q = n, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", n == "maxItems" ? r += "more" : r += "fewer", r += " than ", w ? r += "' + " + R + " + '" : r += "" + l, r += " items' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = d.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", u && (r += " else { "), r;
  }), _limitItems;
}
var _limitLength, hasRequired_limitLength;
function require_limitLength() {
  return hasRequired_limitLength || (hasRequired_limitLength = 1, _limitLength = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && l && l.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l, !(w || typeof l == "number"))
      throw new Error(n + " must be number");
    var h = n == "maxLength" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), e.opts.unicode === !1 ? r += " " + m + ".length " : r += " ucs2length(" + m + ") ", r += " " + h + " " + R + ") { ";
    var q = n, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT be ", n == "maxLength" ? r += "longer" : r += "shorter", r += " than ", w ? r += "' + " + R + " + '" : r += "" + l, r += " characters' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = d.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", u && (r += " else { "), r;
  }), _limitLength;
}
var _limitProperties, hasRequired_limitProperties;
function require_limitProperties() {
  return hasRequired_limitProperties || (hasRequired_limitProperties = 1, _limitProperties = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, q, m = "data" + (f || ""), w = e.opts.$data && l && l.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l, !(w || typeof l == "number"))
      throw new Error(n + " must be number");
    var h = n == "maxProperties" ? ">" : "<";
    r += "if ( ", w && (r += " (" + R + " !== undefined && typeof " + R + " != 'number') || "), r += " Object.keys(" + m + ").length " + h + " " + R + ") { ";
    var q = n, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { limit: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", n == "maxProperties" ? r += "more" : r += "fewer", r += " than ", w ? r += "' + " + R + " + '" : r += "" + l, r += " properties' "), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var v = r;
    return r = d.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + v + "]); " : r += " validate.errors = [" + v + "]; return false; " : r += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", u && (r += " else { "), r;
  }), _limitProperties;
}
var multipleOf, hasRequiredMultipleOf;
function requireMultipleOf() {
  return hasRequiredMultipleOf || (hasRequiredMultipleOf = 1, multipleOf = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = e.opts.$data && l && l.$data, R;
    if (w ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", R = "schema" + a) : R = l, !(w || typeof l == "number"))
      throw new Error(n + " must be number");
    r += "var division" + a + ";if (", w && (r += " " + R + " !== undefined && ( typeof " + R + " != 'number' || "), r += " (division" + a + " = " + m + " / " + R + ", ", e.opts.multipleOfPrecision ? r += " Math.abs(Math.round(division" + a + ") - division" + a + ") > 1e-" + e.opts.multipleOfPrecision + " " : r += " division" + a + " !== parseInt(division" + a + ") ", r += " ) ", w && (r += "  )  "), r += " ) {   ";
    var h = h || [];
    h.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { multipleOf: " + R + " } ", e.opts.messages !== !1 && (r += " , message: 'should be multiple of ", w ? r += "' + " + R : r += "" + R + "'"), e.opts.verbose && (r += " , schema:  ", w ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var q = r;
    return r = h.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + q + "]); " : r += " validate.errors = [" + q + "]; return false; " : r += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", u && (r += " else { "), r;
  }), multipleOf;
}
var not, hasRequiredNot;
function requireNot() {
  return hasRequiredNot || (hasRequiredNot = 1, not = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e);
    R.level++;
    var h = "valid" + R.level;
    if (e.opts.strictKeywords ? typeof l == "object" && Object.keys(l).length > 0 || l === !1 : e.util.schemaHasRules(l, e.RULES.all)) {
      R.schema = l, R.schemaPath = c, R.errSchemaPath = y, r += " var " + w + " = errors;  ";
      var q = e.compositeRule;
      e.compositeRule = R.compositeRule = !0, R.createErrors = !1;
      var d;
      R.opts.allErrors && (d = R.opts.allErrors, R.opts.allErrors = !1), r += " " + e.validate(R) + " ", R.createErrors = !0, d && (R.opts.allErrors = d), e.compositeRule = R.compositeRule = q, r += " if (" + h + ") {   ";
      var v = v || [];
      v.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var P = r;
      r = v.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + P + "]); " : r += " validate.errors = [" + P + "]; return false; " : r += " var err = " + P + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else {  errors = " + w + "; if (vErrors !== null) { if (" + w + ") vErrors.length = " + w + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      r += "  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", u && (r += " if (false) { ");
    return r;
  }), not;
}
var oneOf, hasRequiredOneOf;
function requireOneOf() {
  return hasRequiredOneOf || (hasRequiredOneOf = 1, oneOf = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = "errs__" + a, h = e.util.copy(e), q = "";
    h.level++;
    var d = "valid" + h.level, v = h.baseId, P = "prevValid" + a, E = "passingSchemas" + a;
    r += "var " + R + " = errors , " + P + " = false , " + w + " = false , " + E + " = null; ";
    var I = e.compositeRule;
    e.compositeRule = h.compositeRule = !0;
    var T = l;
    if (T)
      for (var $, x = -1, j = T.length - 1; x < j; )
        $ = T[x += 1], (e.opts.strictKeywords ? typeof $ == "object" && Object.keys($).length > 0 || $ === !1 : e.util.schemaHasRules($, e.RULES.all)) ? (h.schema = $, h.schemaPath = c + "[" + x + "]", h.errSchemaPath = y + "/" + x, r += "  " + e.validate(h) + " ", h.baseId = v) : r += " var " + d + " = true; ", x && (r += " if (" + d + " && " + P + ") { " + w + " = false; " + E + " = [" + E + ", " + x + "]; } else { ", q += "}"), r += " if (" + d + ") { " + w + " = " + P + " = true; " + E + " = " + x + "; }";
    return e.compositeRule = h.compositeRule = I, r += "" + q + "if (!" + w + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { passingSchemas: " + E + " } ", e.opts.messages !== !1 && (r += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += "} else {  errors = " + R + "; if (vErrors !== null) { if (" + R + ") vErrors.length = " + R + "; else vErrors = null; }", e.opts.allErrors && (r += " } "), r;
  }), oneOf;
}
var pattern, hasRequiredPattern;
function requirePattern() {
  return hasRequiredPattern || (hasRequiredPattern = 1, pattern = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && l && l.$data, h;
    R ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", h = "schema" + a) : h = l;
    var q = e.opts.regExp ? "regExp" : "new RegExp";
    if (R)
      r += " var " + w + " = true; try { " + w + " = " + q + "(" + h + ").test(" + m + "); } catch(e) { " + w + " = false; } if ( ", R && (r += " (" + h + " !== undefined && typeof " + h + " != 'string') || "), r += " !" + w + ") {";
    else {
      var d = e.usePattern(l);
      r += " if ( ", R && (r += " (" + h + " !== undefined && typeof " + h + " != 'string') || "), r += " !" + d + ".test(" + m + ") ) {";
    }
    var v = v || [];
    v.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { pattern:  ", R ? r += "" + h : r += "" + e.util.toQuotedString(l), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match pattern "`, R ? r += "' + " + h + " + '" : r += "" + e.util.escapeQuotes(l), r += `"' `), e.opts.verbose && (r += " , schema:  ", R ? r += "validate.schema" + c : r += "" + e.util.toQuotedString(l), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var P = r;
    return r = v.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + P + "]); " : r += " validate.errors = [" + P + "]; return false; " : r += " var err = " + P + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", u && (r += " else { "), r;
  }), pattern;
}
var properties$3, hasRequiredProperties;
function requireProperties() {
  return hasRequiredProperties || (hasRequiredProperties = 1, properties$3 = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), h = "";
    R.level++;
    var q = "valid" + R.level, d = "key" + a, v = "idx" + a, P = R.dataLevel = e.dataLevel + 1, E = "data" + P, I = "dataProperties" + a, T = Object.keys(l || {}).filter(ce), $ = e.schema.patternProperties || {}, x = Object.keys($).filter(ce), j = e.schema.additionalProperties, V = T.length || x.length, C = j === !1, z = typeof j == "object" && Object.keys(j).length, g = e.opts.removeAdditional, D = C || z || g, ie = e.opts.ownProperties, de = e.baseId, we = e.schema.required;
    if (we && !(e.opts.$data && we.$data) && we.length < e.opts.loopRequired)
      var be = e.util.toHash(we);
    function ce(je) {
      return je !== "__proto__";
    }
    if (r += "var " + w + " = errors;var " + q + " = true;", ie && (r += " var " + I + " = undefined;"), D) {
      if (ie ? r += " " + I + " = " + I + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + I + ".length; " + v + "++) { var " + d + " = " + I + "[" + v + "]; " : r += " for (var " + d + " in " + m + ") { ", V) {
        if (r += " var isAdditional" + a + " = !(false ", T.length)
          if (T.length > 8)
            r += " || validate.schema" + c + ".hasOwnProperty(" + d + ") ";
          else {
            var fe = T;
            if (fe)
              for (var M, pe = -1, ee = fe.length - 1; pe < ee; )
                M = fe[pe += 1], r += " || " + d + " == " + e.util.toQuotedString(M) + " ";
          }
        if (x.length) {
          var Q = x;
          if (Q)
            for (var Z, le = -1, O = Q.length - 1; le < O; )
              Z = Q[le += 1], r += " || " + e.usePattern(Z) + ".test(" + d + ") ";
        }
        r += " ); if (isAdditional" + a + ") { ";
      }
      if (g == "all")
        r += " delete " + m + "[" + d + "]; ";
      else {
        var B = e.errorPath, N = "' + " + d + " + '";
        if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers)), C)
          if (g)
            r += " delete " + m + "[" + d + "]; ";
          else {
            r += " " + q + " = false; ";
            var re = y;
            y = e.errSchemaPath + "/additionalProperties";
            var ne = ne || [];
            ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { additionalProperty: '" + N + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is an invalid additional property" : r += "should NOT have additional properties", r += "' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
            var F = r;
            r = ne.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + F + "]); " : r += " validate.errors = [" + F + "]; return false; " : r += " var err = " + F + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", y = re, u && (r += " break; ");
          }
        else if (z)
          if (g == "failing") {
            r += " var " + w + " = errors;  ";
            var L = e.compositeRule;
            e.compositeRule = R.compositeRule = !0, R.schema = j, R.schemaPath = e.schemaPath + ".additionalProperties", R.errSchemaPath = e.errSchemaPath + "/additionalProperties", R.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = m + "[" + d + "]";
            R.dataPathArr[P] = d;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", r += " if (!" + q + ") { errors = " + w + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + m + "[" + d + "]; }  ", e.compositeRule = R.compositeRule = L;
          } else {
            R.schema = j, R.schemaPath = e.schemaPath + ".additionalProperties", R.errSchemaPath = e.errSchemaPath + "/additionalProperties", R.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = m + "[" + d + "]";
            R.dataPathArr[P] = d;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", u && (r += " if (!" + q + ") break; ");
          }
        e.errorPath = B;
      }
      V && (r += " } "), r += " }  ", u && (r += " if (" + q + ") { ", h += "}");
    }
    var Ee = e.opts.useDefaults && !e.compositeRule;
    if (T.length) {
      var Re = T;
      if (Re)
        for (var M, Pe = -1, Oe = Re.length - 1; Pe < Oe; ) {
          M = Re[Pe += 1];
          var te = l[M];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            var $e = e.util.getProperty(M), H = m + $e, Ce = Ee && te.default !== void 0;
            R.schema = te, R.schemaPath = c + $e, R.errSchemaPath = y + "/" + e.util.escapeFragment(M), R.errorPath = e.util.getPath(e.errorPath, M, e.opts.jsonPointers), R.dataPathArr[P] = e.util.toQuotedString(M);
            var se = e.validate(R);
            if (R.baseId = de, e.util.varOccurences(se, E) < 2) {
              se = e.util.varReplace(se, E, H);
              var Ae = H;
            } else {
              var Ae = E;
              r += " var " + E + " = " + H + "; ";
            }
            if (Ce)
              r += " " + se + " ";
            else {
              if (be && be[M]) {
                r += " if ( " + Ae + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") { " + q + " = false; ";
                var B = e.errorPath, re = y, Ue = e.util.escapeQuotes(M);
                e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(B, M, e.opts.jsonPointers)), y = e.errSchemaPath + "/required";
                var ne = ne || [];
                ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + Ue + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + Ue + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
                var F = r;
                r = ne.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + F + "]); " : r += " validate.errors = [" + F + "]; return false; " : r += " var err = " + F + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", y = re, e.errorPath = B, r += " } else { ";
              } else
                u ? (r += " if ( " + Ae + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") { " + q + " = true; } else { ") : (r += " if (" + Ae + " !== undefined ", ie && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += " ) { ");
              r += " " + se + " } ";
            }
          }
          u && (r += " if (" + q + ") { ", h += "}");
        }
    }
    if (x.length) {
      var ge = x;
      if (ge)
        for (var Z, Se = -1, Le = ge.length - 1; Se < Le; ) {
          Z = ge[Se += 1];
          var te = $[Z];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            R.schema = te, R.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(Z), R.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(Z), ie ? r += " " + I + " = " + I + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + I + ".length; " + v + "++) { var " + d + " = " + I + "[" + v + "]; " : r += " for (var " + d + " in " + m + ") { ", r += " if (" + e.usePattern(Z) + ".test(" + d + ")) { ", R.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = m + "[" + d + "]";
            R.dataPathArr[P] = d;
            var se = e.validate(R);
            R.baseId = de, e.util.varOccurences(se, E) < 2 ? r += " " + e.util.varReplace(se, E, H) + " " : r += " var " + E + " = " + H + "; " + se + " ", u && (r += " if (!" + q + ") break; "), r += " } ", u && (r += " else " + q + " = true; "), r += " }  ", u && (r += " if (" + q + ") { ", h += "}");
          }
        }
    }
    return u && (r += " " + h + " if (" + w + " == errors) {"), r;
  }), properties$3;
}
var propertyNames, hasRequiredPropertyNames;
function requirePropertyNames() {
  return hasRequiredPropertyNames || (hasRequiredPropertyNames = 1, propertyNames = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "errs__" + a, R = e.util.copy(e), h = "";
    R.level++;
    var q = "valid" + R.level;
    if (r += "var " + w + " = errors;", e.opts.strictKeywords ? typeof l == "object" && Object.keys(l).length > 0 || l === !1 : e.util.schemaHasRules(l, e.RULES.all)) {
      R.schema = l, R.schemaPath = c, R.errSchemaPath = y;
      var d = "key" + a, v = "idx" + a, P = "i" + a, E = "' + " + d + " + '", I = R.dataLevel = e.dataLevel + 1, T = "data" + I, $ = "dataProperties" + a, x = e.opts.ownProperties, j = e.baseId;
      x && (r += " var " + $ + " = undefined; "), x ? r += " " + $ + " = " + $ + " || Object.keys(" + m + "); for (var " + v + "=0; " + v + "<" + $ + ".length; " + v + "++) { var " + d + " = " + $ + "[" + v + "]; " : r += " for (var " + d + " in " + m + ") { ", r += " var startErrs" + a + " = errors; ";
      var V = d, C = e.compositeRule;
      e.compositeRule = R.compositeRule = !0;
      var z = e.validate(R);
      R.baseId = j, e.util.varOccurences(z, T) < 2 ? r += " " + e.util.varReplace(z, T, V) + " " : r += " var " + T + " = " + V + "; " + z + " ", e.compositeRule = R.compositeRule = C, r += " if (!" + q + ") { for (var " + P + "=startErrs" + a + "; " + P + "<errors; " + P + "++) { vErrors[" + P + "].propertyName = " + d + "; }   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { propertyName: '" + E + "' } ", e.opts.messages !== !1 && (r += " , message: 'property name \\'" + E + "\\' is invalid' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), u && (r += " break; "), r += " } }";
    }
    return u && (r += " " + h + " if (" + w + " == errors) {"), r;
  }), propertyNames;
}
var required$1, hasRequiredRequired;
function requireRequired() {
  return hasRequiredRequired || (hasRequiredRequired = 1, required$1 = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && l && l.$data;
    R && (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ");
    var h = "schema" + a;
    if (!R)
      if (l.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
        var q = [], d = l;
        if (d)
          for (var v, P = -1, E = d.length - 1; P < E; ) {
            v = d[P += 1];
            var I = e.schema.properties[v];
            I && (e.opts.strictKeywords ? typeof I == "object" && Object.keys(I).length > 0 || I === !1 : e.util.schemaHasRules(I, e.RULES.all)) || (q[q.length] = v);
          }
      } else
        var q = l;
    if (R || q.length) {
      var T = e.errorPath, $ = R || q.length >= e.opts.loopRequired, x = e.opts.ownProperties;
      if (u)
        if (r += " var missing" + a + "; ", $) {
          R || (r += " var " + h + " = validate.schema" + c + "; ");
          var j = "i" + a, V = "schema" + a + "[" + j + "]", C = "' + " + V + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(T, V, e.opts.jsonPointers)), r += " var " + w + " = true; ", R && (r += " if (schema" + a + " === undefined) " + w + " = true; else if (!Array.isArray(schema" + a + ")) " + w + " = false; else {"), r += " for (var " + j + " = 0; " + j + " < " + h + ".length; " + j + "++) { " + w + " = " + m + "[" + h + "[" + j + "]] !== undefined ", x && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", " + h + "[" + j + "]) "), r += "; if (!" + w + ") break; } ", R && (r += "  }  "), r += "  if (!" + w + ") {   ";
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var g = r;
          r = z.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + g + "]); " : r += " validate.errors = [" + g + "]; return false; " : r += " var err = " + g + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        } else {
          r += " if ( ";
          var D = q;
          if (D)
            for (var ie, j = -1, de = D.length - 1; j < de; ) {
              ie = D[j += 1], j && (r += " || ");
              var we = e.util.getProperty(ie), be = m + we;
              r += " ( ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") && (missing" + a + " = " + e.util.toQuotedString(e.opts.jsonPointers ? ie : we) + ") ) ";
            }
          r += ") {  ";
          var V = "missing" + a, C = "' + " + V + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(T, V, !0) : T + " + " + V);
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var g = r;
          r = z.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + g + "]); " : r += " validate.errors = [" + g + "]; return false; " : r += " var err = " + g + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        }
      else if ($) {
        R || (r += " var " + h + " = validate.schema" + c + "; ");
        var j = "i" + a, V = "schema" + a + "[" + j + "]", C = "' + " + V + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(T, V, e.opts.jsonPointers)), R && (r += " if (" + h + " && !Array.isArray(" + h + ")) {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + h + " !== undefined) { "), r += " for (var " + j + " = 0; " + j + " < " + h + ".length; " + j + "++) { if (" + m + "[" + h + "[" + j + "]] === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", " + h + "[" + j + "]) "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", R && (r += "  }  ");
      } else {
        var ce = q;
        if (ce)
          for (var ie, fe = -1, M = ce.length - 1; fe < M; ) {
            ie = ce[fe += 1];
            var we = e.util.getProperty(ie), C = e.util.escapeQuotes(ie), be = m + we;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(T, ie, e.opts.jsonPointers)), r += " if ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      e.errorPath = T;
    } else u && (r += " if (true) {");
    return r;
  }), required$1;
}
var uniqueItems, hasRequiredUniqueItems;
function requireUniqueItems() {
  return hasRequiredUniqueItems || (hasRequiredUniqueItems = 1, uniqueItems = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m = "data" + (f || ""), w = "valid" + a, R = e.opts.$data && l && l.$data, h;
    if (R ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", h = "schema" + a) : h = l, (l || R) && e.opts.uniqueItems !== !1) {
      R && (r += " var " + w + "; if (" + h + " === false || " + h + " === undefined) " + w + " = true; else if (typeof " + h + " != 'boolean') " + w + " = false; else { "), r += " var i = " + m + ".length , " + w + " = true , j; if (i > 1) { ";
      var q = e.schema.items && e.schema.items.type, d = Array.isArray(q);
      if (!q || q == "object" || q == "array" || d && (q.indexOf("object") >= 0 || q.indexOf("array") >= 0))
        r += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + m + "[i], " + m + "[j])) { " + w + " = false; break outer; } } } ";
      else {
        r += " var itemIndices = {}, item; for (;i--;) { var item = " + m + "[i]; ";
        var v = "checkDataType" + (d ? "s" : "");
        r += " if (" + e.util[v](q, "item", e.opts.strictNumbers, !0) + ") continue; ", d && (r += ` if (typeof item == 'string') item = '"' + item; `), r += " if (typeof itemIndices[item] == 'number') { " + w + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
      }
      r += " } ", R && (r += "  }  "), r += " if (!" + w + ") {   ";
      var P = P || [];
      P.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (r += " , schema:  ", R ? r += "validate.schema" + c : r += "" + l, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var E = r;
      r = P.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", u && (r += " else { ");
    } else
      u && (r += " if (true) { ");
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
    var o = [
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
    return o.all = e(r), o.types = e(f), o.forEach(function(l) {
      l.rules = l.rules.map(function(c) {
        var y;
        if (typeof c == "object") {
          var u = Object.keys(c)[0];
          y = c[u], c = u, y.forEach(function(w) {
            r.push(w), o.all[w] = !0;
          });
        }
        r.push(c);
        var m = o.all[c] = {
          keyword: c,
          code: t[c],
          implements: y
        };
        return m;
      }), o.all.$comment = {
        keyword: "$comment",
        code: t.$comment
      }, l.type && (o.types[l.type] = l);
    }), o.keywords = e(r.concat(a)), o.custom = {}, o;
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
    for (var o = 0; o < n.length; o++) {
      e = JSON.parse(JSON.stringify(e));
      var r = n[o].split("/"), a = e, f;
      for (f = 1; f < r.length; f++)
        a = a[r[f]];
      for (f = 0; f < t.length; f++) {
        var l = t[f], c = a[l];
        c && (a[l] = {
          anyOf: [
            c,
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
  function e(n, o, r) {
    var a = this;
    if (typeof this._opts.loadSchema != "function")
      throw new Error("options.loadSchema should be a function");
    typeof o == "function" && (r = o, o = void 0);
    var f = l(n).then(function() {
      var y = a._addSchema(n, void 0, o);
      return y.validate || c(y);
    });
    return r && f.then(
      function(y) {
        r(null, y);
      },
      r
    ), f;
    function l(y) {
      var u = y.$schema;
      return u && !a.getSchema(u) ? e.call(a, { $ref: u }, !0) : Promise.resolve();
    }
    function c(y) {
      try {
        return a._compile(y);
      } catch (m) {
        if (m instanceof t) return u(m);
        throw m;
      }
      function u(m) {
        var w = m.missingSchema;
        if (q(w)) throw new Error("Schema " + w + " is loaded but " + m.missingRef + " cannot be resolved");
        var R = a._loadingSchemas[w];
        return R || (R = a._loadingSchemas[w] = a._opts.loadSchema(w), R.then(h, h)), R.then(function(d) {
          if (!q(w))
            return l(d).then(function() {
              q(w) || a.addSchema(d, w, void 0, o);
            });
        }).then(function() {
          return c(y);
        });
        function h() {
          delete a._loadingSchemas[w];
        }
        function q(d) {
          return a._refs[d] || a._schemas[d];
        }
      }
    }
  }
  return async;
}
var custom, hasRequiredCustom;
function requireCustom() {
  return hasRequiredCustom || (hasRequiredCustom = 1, custom = function(e, n, o) {
    var r = " ", a = e.level, f = e.dataLevel, l = e.schema[n], c = e.schemaPath + e.util.getProperty(n), y = e.errSchemaPath + "/" + n, u = !e.opts.allErrors, m, w = "data" + (f || ""), R = "valid" + a, h = "errs__" + a, q = e.opts.$data && l && l.$data, d;
    q ? (r += " var schema" + a + " = " + e.util.getData(l.$data, f, e.dataPathArr) + "; ", d = "schema" + a) : d = l;
    var v = this, P = "definition" + a, E = v.definition, I = "", T, $, x, j, V;
    if (q && E.$data) {
      V = "keywordValidate" + a;
      var C = E.validateSchema;
      r += " var " + P + " = RULES.custom['" + n + "'].definition; var " + V + " = " + P + ".validate;";
    } else {
      if (j = e.useCustomRule(v, l, e.schema, e), !j) return;
      d = "validate.schema" + c, V = j.code, T = E.compile, $ = E.inline, x = E.macro;
    }
    var z = V + ".errors", g = "i" + a, D = "ruleErr" + a, ie = E.async;
    if (ie && !e.async) throw new Error("async keyword in sync schema");
    if ($ || x || (r += "" + z + " = null;"), r += "var " + h + " = errors;var " + R + ";", q && E.$data && (I += "}", r += " if (" + d + " === undefined) { " + R + " = true; } else { ", C && (I += "}", r += " " + R + " = " + P + ".validateSchema(" + d + "); if (" + R + ") { ")), $)
      E.statements ? r += " " + j.validate + " " : r += " " + R + " = " + j.validate + "; ";
    else if (x) {
      var de = e.util.copy(e), I = "";
      de.level++;
      var we = "valid" + de.level;
      de.schema = j.validate, de.schemaPath = "";
      var be = e.compositeRule;
      e.compositeRule = de.compositeRule = !0;
      var ce = e.validate(de).replace(/validate\.schema/g, V);
      e.compositeRule = de.compositeRule = be, r += " " + ce;
    } else {
      var fe = fe || [];
      fe.push(r), r = "", r += "  " + V + ".call( ", e.opts.passContext ? r += "this" : r += "self", T || E.schema === !1 ? r += " , " + w + " " : r += " , " + d + " , " + w + " , validate.schema" + e.schemaPath + " ", r += " , (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var M = f ? "data" + (f - 1 || "") : "parentData", pe = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + M + " , " + pe + " , rootData )  ";
      var ee = r;
      r = fe.pop(), E.errors === !1 ? (r += " " + R + " = ", ie && (r += "await "), r += "" + ee + "; ") : ie ? (z = "customErrors" + a, r += " var " + z + " = null; try { " + R + " = await " + ee + "; } catch (e) { " + R + " = false; if (e instanceof ValidationError) " + z + " = e.errors; else throw e; } ") : r += " " + z + " = null; " + R + " = " + ee + "; ";
    }
    if (E.modifying && (r += " if (" + M + ") " + w + " = " + M + "[" + pe + "];"), r += "" + I, E.valid)
      u && (r += " if (true) { ");
    else {
      r += " if ( ", E.valid === void 0 ? (r += " !", x ? r += "" + we : r += "" + R) : r += " " + !E.valid + " ", r += ") { ", m = v.keyword;
      var fe = fe || [];
      fe.push(r), r = "";
      var fe = fe || [];
      fe.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { keyword: '" + v.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + v.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
      var Q = r;
      r = fe.pop(), !e.compositeRule && u ? e.async ? r += " throw new ValidationError([" + Q + "]); " : r += " validate.errors = [" + Q + "]; return false; " : r += " var err = " + Q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      var Z = r;
      r = fe.pop(), $ ? E.errors ? E.errors != "full" && (r += "  for (var " + g + "=" + h + "; " + g + "<errors; " + g + "++) { var " + D + " = vErrors[" + g + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + D + ".schemaPath === undefined) { " + D + '.schemaPath = "' + y + '"; } ', e.opts.verbose && (r += " " + D + ".schema = " + d + "; " + D + ".data = " + w + "; "), r += " } ") : E.errors === !1 ? r += " " + Z + " " : (r += " if (" + h + " == errors) { " + Z + " } else {  for (var " + g + "=" + h + "; " + g + "<errors; " + g + "++) { var " + D + " = vErrors[" + g + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + D + ".schemaPath === undefined) { " + D + '.schemaPath = "' + y + '"; } ', e.opts.verbose && (r += " " + D + ".schema = " + d + "; " + D + ".data = " + w + "; "), r += " } } ") : x ? (r += "   var err =   ", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(y) + " , params: { keyword: '" + v.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + v.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; ")) : E.errors === !1 ? r += " " + Z + " " : (r += " if (Array.isArray(" + z + ")) { if (vErrors === null) vErrors = " + z + "; else vErrors = vErrors.concat(" + z + "); errors = vErrors.length;  for (var " + g + "=" + h + "; " + g + "<errors; " + g + "++) { var " + D + " = vErrors[" + g + "]; if (" + D + ".dataPath === undefined) " + D + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + D + '.schemaPath = "' + y + '";  ', e.opts.verbose && (r += " " + D + ".schema = " + d + "; " + D + ".data = " + w + "; "), r += " } } else { " + Z + " } "), r += " } ", u && (r += " else { ");
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
    add: o,
    get: r,
    remove: a,
    validate: f
  };
  function o(l, c) {
    var y = this.RULES;
    if (y.keywords[l])
      throw new Error("Keyword " + l + " is already defined");
    if (!t.test(l))
      throw new Error("Keyword " + l + " is not a valid identifier");
    if (c) {
      this.validateKeyword(c, !0);
      var u = c.type;
      if (Array.isArray(u))
        for (var m = 0; m < u.length; m++)
          R(l, u[m], c);
      else
        R(l, u, c);
      var w = c.metaSchema;
      w && (c.$data && this._opts.$data && (w = {
        anyOf: [
          w,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      }), c.validateSchema = this.compile(w, !0));
    }
    y.keywords[l] = y.all[l] = !0;
    function R(h, q, d) {
      for (var v, P = 0; P < y.length; P++) {
        var E = y[P];
        if (E.type == q) {
          v = E;
          break;
        }
      }
      v || (v = { type: q, rules: [] }, y.push(v));
      var I = {
        keyword: h,
        definition: d,
        custom: !0,
        code: e,
        implements: d.implements
      };
      v.rules.push(I), y.custom[h] = I;
    }
    return this;
  }
  function r(l) {
    var c = this.RULES.custom[l];
    return c ? c.definition : this.RULES.keywords[l] || !1;
  }
  function a(l) {
    var c = this.RULES;
    delete c.keywords[l], delete c.all[l], delete c.custom[l];
    for (var y = 0; y < c.length; y++)
      for (var u = c[y].rules, m = 0; m < u.length; m++)
        if (u[m].keyword == l) {
          u.splice(m, 1);
          break;
        }
    return this;
  }
  function f(l, c) {
    f.errors = null;
    var y = this._validateKeyword = this._validateKeyword || this.compile(n, !0);
    if (y(l)) return !0;
    if (f.errors = y.errors, c)
      throw new Error("custom keyword definition is invalid: " + this.errorsText(y.errors));
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
  var t = requireCompile(), e = requireResolve(), n = requireCache(), o = requireSchema_obj(), r = requireFastJsonStableStringify(), a = requireFormats(), f = requireRules(), l = requireData(), c = requireUtil$1();
  ajv = h, h.prototype.validate = q, h.prototype.compile = d, h.prototype.addSchema = v, h.prototype.addMetaSchema = P, h.prototype.validateSchema = E, h.prototype.getSchema = T, h.prototype.removeSchema = j, h.prototype.addFormat = be, h.prototype.errorsText = we, h.prototype._addSchema = C, h.prototype._compile = z, h.prototype.compileAsync = requireAsync();
  var y = requireKeyword();
  h.prototype.addKeyword = y.add, h.prototype.getKeyword = y.get, h.prototype.removeKeyword = y.remove, h.prototype.validateKeyword = y.validate;
  var u = requireError_classes();
  h.ValidationError = u.Validation, h.MissingRefError = u.MissingRef, h.$dataMetaSchema = l;
  var m = "http://json-schema.org/draft-07/schema", w = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], R = ["/properties"];
  function h(O) {
    if (!(this instanceof h)) return new h(O);
    O = this._opts = c.copy(O) || {}, Z(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = a(O.format), this._cache = O.cache || new n(), this._loadingSchemas = {}, this._compilations = [], this.RULES = f(), this._getId = g(O), O.loopRequired = O.loopRequired || 1 / 0, O.errorDataPath == "property" && (O._errorDataPathProperty = !0), O.serialize === void 0 && (O.serialize = r), this._metaOpts = Q(this), O.formats && M(this), O.keywords && pe(this), ce(this), typeof O.meta == "object" && this.addMetaSchema(O.meta), O.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), fe(this);
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
  function d(O, B) {
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
  function T(O) {
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
      return O._fragments[B] = new o({
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
  function j(O) {
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
    var Re = e.ids.call(this, O), Pe = new o({
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
  function g(O) {
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
      O._opts.$data && (N = l(N, R)), O.addMetaSchema(N, m, !0), O._refs["http://json-schema.org/schema"] = m;
    }
  }
  function fe(O) {
    var B = O._opts.schemas;
    if (B)
      if (Array.isArray(B)) O.addSchema(B);
      else for (var N in B) O.addSchema(B[N], N);
  }
  function M(O) {
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
  function Q(O) {
    for (var B = c.copy(O._opts), N = 0; N < w.length; N++)
      delete B[w[N]];
    return B;
  }
  function Z(O) {
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
        oneOf: [{ enum: ["native"] }].concat(Object.keys(this.typesSchemas).map((l) => ({ $ref: this.typeToSchemaName(l) })))
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
      function f(l, c, y) {
        const u = new n(c.typesSchemas);
        Object.keys(l).forEach((m) => {
          m == "types" ? (Object.keys(l[m]).forEach((w) => u.addType(w)), Object.keys(l[m]).forEach((w) => {
            try {
              u.validateType(l[m][w], y + "." + m + "." + w);
            } catch {
              throw new Error("Error at " + y + "." + m + "." + w);
            }
          })) : f(l[m], u, y + "." + m);
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
  function o(h, q) {
    if (q + 8 > h.length)
      throw new t();
    return {
      value: new e(h.readInt32BE(q), h.readInt32BE(q + 4)),
      size: 8
    };
  }
  function r(h, q, d) {
    return typeof h == "bigint" ? q.writeBigInt64BE(h, d) : (q.writeInt32BE(h[0], d), q.writeInt32BE(h[1], d + 4)), d + 8;
  }
  function a(h, q) {
    if (q + 8 > h.length)
      throw new t();
    return {
      value: new e(h.readInt32LE(q + 4), h.readInt32LE(q)),
      size: 8
    };
  }
  function f(h, q, d) {
    return typeof h == "bigint" ? q.writeBigInt64LE(h, d) : (q.writeInt32LE(h[0], d + 4), q.writeInt32LE(h[1], d)), d + 8;
  }
  function l(h, q) {
    if (q + 8 > h.length)
      throw new t();
    return {
      value: new n(h.readUInt32BE(q), h.readUInt32BE(q + 4)),
      size: 8
    };
  }
  function c(h, q, d) {
    return typeof h == "bigint" ? q.writeBigUInt64BE(h, d) : (q.writeUInt32BE(h[0], d), q.writeUInt32BE(h[1], d + 4)), d + 8;
  }
  function y(h, q) {
    if (q + 8 > h.length)
      throw new t();
    return {
      value: new n(h.readUInt32LE(q + 4), h.readUInt32LE(q)),
      size: 8
    };
  }
  function u(h, q, d) {
    return typeof h == "bigint" ? q.writeBigUInt64LE(h, d) : (q.writeUInt32LE(h[0], d + 4), q.writeUInt32LE(h[1], d)), d + 8;
  }
  function m(h, q, d, v) {
    return [(I, T) => {
      if (T + d > I.length)
        throw new t();
      return {
        value: I[h](T),
        size: d
      };
    }, (I, T, $) => (T[q](I, $), $ + d), d, v];
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
  }, R = Object.keys(w).reduce((h, q) => (h[q] = m(w[q][0], w[q][1], w[q][2], require$$1$3[q]), h), {});
  return R.i64 = [o, r, 8, require$$1$3.i64], R.li64 = [a, f, 8, require$$1$3.li64], R.u64 = [l, c, 8, require$$1$3.u64], R.lu64 = [y, u, 8, require$$1$3.lu64], numeric = R, numeric;
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
    varint: [e, o, n, require$$1$3.varint],
    varint64: [r, l, f, require$$1$3.varint64],
    varint128: [a, l, f, require$$1$3.varint128],
    zigzag32: [c, u, y, require$$1$3.zigzag32],
    zigzag64: [m, R, w, require$$1$3.zigzag64]
  };
  function e(h, q) {
    let d = 0, v = 0, P = q;
    for (; ; ) {
      if (P >= h.length) throw new t("Unexpected buffer end while reading VarInt");
      const E = h.readUInt8(P);
      if (d |= (E & 127) << v, P++, !(E & 128))
        return { value: d, size: P - q };
      if (v += 7, v > 64) throw new t(`varint is too big: ${v}`);
    }
  }
  function n(h) {
    let q = 0;
    for (; h & -128; )
      h >>>= 7, q++;
    return q + 1;
  }
  function o(h, q, d) {
    let v = 0;
    for (; h & -128; )
      q.writeUInt8(h & 255 | 128, d + v), v++, h >>>= 7;
    return q.writeUInt8(h, d + v), d + v + 1;
  }
  function r(h, q) {
    let d = 0n, v = 0n, P = q;
    for (; ; ) {
      if (P >= h.length) throw new t("Unexpected buffer end while reading VarLong");
      const E = h.readUInt8(P);
      if (d |= (BigInt(E) & 0x7Fn) << v, P++, !(E & 128))
        return { value: d, size: P - q };
      if (v += 7n, v > 63n) throw new Error(`varint is too big: ${v}`);
    }
  }
  function a(h, q) {
    let d = 0n, v = 0n, P = q;
    for (; ; ) {
      if (P >= h.length) throw new t("Unexpected buffer end while reading VarLong");
      const E = h.readUInt8(P);
      if (d |= (BigInt(E) & 0x7Fn) << v, P++, !(E & 128))
        return { value: d, size: P - q };
      if (v += 7n, v > 127n) throw new Error(`varint is too big: ${v}`);
    }
  }
  function f(h) {
    h = BigInt(h);
    let q = 0;
    do
      h >>= 7n, q++;
    while (h !== 0n);
    return q;
  }
  function l(h, q, d) {
    h = BigInt(h);
    let v = d;
    do {
      const P = h & 0x7Fn;
      h >>= 7n, q.writeUInt8(Number(P) | (h ? 128 : 0), v++);
    } while (h);
    return v;
  }
  function c(h, q) {
    const { value: d, size: v } = e(h, q);
    return { value: d >>> 1 ^ -(d & 1), size: v };
  }
  function y(h) {
    return n(h << 1 ^ h >> 31);
  }
  function u(h, q, d) {
    return o(h << 1 ^ h >> 31, q, d);
  }
  function m(h, q) {
    const { value: d, size: v } = r(h, q);
    return { value: d >> 1n ^ -(d & 1n), size: v };
  }
  function w(h) {
    return f(BigInt(h) << 1n ^ BigInt(h) >> 63n);
  }
  function R(h, q, d) {
    return l(BigInt(h) << 1n ^ BigInt(h) >> 63n, q, d);
  }
  return varint;
}
var utils$1, hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  const { getCount: t, sendCount: e, calcCount: n, PartialReadError: o } = requireUtils$2();
  utils$1 = {
    bool: [m, w, 1, require$$1$2.bool],
    pstring: [c, y, u, require$$1$2.pstring],
    buffer: [R, h, q, require$$1$2.buffer],
    void: [d, v, 0, require$$1$2.void],
    bitfield: [E, I, T, require$$1$2.bitfield],
    bitflags: [V, C, z, require$$1$2.bitflags],
    cstring: [$, x, j, require$$1$2.cstring],
    mapper: [a, f, l, require$$1$2.mapper],
    ...requireVarint()
  };
  function r(g, D) {
    return g === D || parseInt(g) === parseInt(D);
  }
  function a(g, D, { type: ie, mappings: de }, we) {
    const { size: be, value: ce } = this.read(g, D, ie, we);
    let fe = null;
    const M = Object.keys(de);
    for (let pe = 0; pe < M.length; pe++)
      if (r(M[pe], ce)) {
        fe = de[M[pe]];
        break;
      }
    if (fe == null) throw new Error(ce + " is not in the mappings value");
    return {
      size: be,
      value: fe
    };
  }
  function f(g, D, ie, { type: de, mappings: we }, be) {
    const ce = Object.keys(we);
    let fe = null;
    for (let M = 0; M < ce.length; M++)
      if (r(we[ce[M]], g)) {
        fe = ce[M];
        break;
      }
    if (fe == null) throw new Error(g + " is not in the mappings value");
    return this.write(fe, D, ie, de, be);
  }
  function l(g, { type: D, mappings: ie }, de) {
    const we = Object.keys(ie);
    let be = null;
    for (let ce = 0; ce < we.length; ce++)
      if (r(ie[we[ce]], g)) {
        be = we[ce];
        break;
      }
    if (be == null) throw new Error(g + " is not in the mappings value");
    return this.sizeOf(be, D, de);
  }
  function c(g, D, ie, de) {
    const { size: we, count: be } = t.call(this, g, D, ie, de), ce = D + we, fe = ce + be;
    if (fe > g.length)
      throw new o("Missing characters in string, found size is " + g.length + " expected size was " + fe);
    return {
      value: g.toString(ie.encoding || "utf8", ce, fe),
      size: fe - D
    };
  }
  function y(g, D, ie, de, we) {
    const be = Buffer.byteLength(g, "utf8");
    return ie = e.call(this, be, D, ie, de, we), D.write(g, ie, be, de.encoding || "utf8"), ie + be;
  }
  function u(g, D, ie) {
    const de = Buffer.byteLength(g, D.encoding || "utf8");
    return n.call(this, de, D, ie) + de;
  }
  function m(g, D) {
    if (D + 1 > g.length) throw new o();
    return {
      value: !!g.readInt8(D),
      size: 1
    };
  }
  function w(g, D, ie) {
    return D.writeInt8(+g, ie), ie + 1;
  }
  function R(g, D, ie, de) {
    const { size: we, count: be } = t.call(this, g, D, ie, de);
    if (D += we, D + be > g.length) throw new o();
    return {
      value: g.slice(D, D + be),
      size: we + be
    };
  }
  function h(g, D, ie, de, we) {
    return g instanceof Buffer || (g = Buffer.from(g)), ie = e.call(this, g.length, D, ie, de, we), g.copy(D, ie), ie + g.length;
  }
  function q(g, D, ie) {
    return g instanceof Buffer || (g = Buffer.from(g)), n.call(this, g.length, D, ie) + g.length;
  }
  function d() {
    return {
      value: void 0,
      size: 0
    };
  }
  function v(g, D, ie) {
    return ie;
  }
  function P(g) {
    return (1 << g) - 1;
  }
  function E(g, D, ie) {
    const de = D;
    let we = null, be = 0;
    const ce = {};
    return ce.value = ie.reduce((fe, { size: M, signed: pe, name: ee }) => {
      let Q = M, Z = 0;
      for (; Q > 0; ) {
        if (be === 0) {
          if (g.length < D + 1)
            throw new o();
          we = g[D++], be = 8;
        }
        const le = Math.min(Q, be);
        Z = Z << le | (we & P(be)) >> be - le, be -= le, Q -= le;
      }
      return pe && Z >= 1 << M - 1 && (Z -= 1 << M), fe[ee] = Z, fe;
    }, {}), ce.size = D - de, ce;
  }
  function I(g, D, ie, de) {
    let we = 0, be = 0;
    return de.forEach(({ size: ce, signed: fe, name: M }) => {
      const pe = g[M];
      if (!fe && pe < 0 || fe && pe < -(1 << ce - 1))
        throw new Error(g + " < " + fe ? -(1 << ce - 1) : 0);
      if (!fe && pe >= 1 << ce || fe && pe >= (1 << ce - 1) - 1)
        throw new Error(g + " >= " + fe ? 1 << ce : (1 << ce - 1) - 1);
      for (; ce > 0; ) {
        const ee = Math.min(8 - be, ce);
        we = we << ee | pe >> ce - ee & P(ee), ce -= ee, be += ee, be === 8 && (D[ie++] = we, be = 0, we = 0);
      }
    }), be !== 0 && (D[ie++] = we << 8 - be), ie;
  }
  function T(g, D) {
    return Math.ceil(D.reduce((ie, { size: de }) => ie + de, 0) / 8);
  }
  function $(g, D, ie) {
    let de = 0;
    for (; D + de < g.length && g[D + de] !== 0; )
      de++;
    if (g.length < D + de + 1)
      throw new o();
    return {
      value: g.toString((ie == null ? void 0 : ie.encoding) || "utf8", D, D + de),
      size: de + 1
    };
  }
  function x(g, D, ie, de) {
    const we = Buffer.byteLength(g, (de == null ? void 0 : de.encoding) || "utf8");
    return D.write(g, ie, we, (de == null ? void 0 : de.encoding) || "utf8"), ie += we, D.writeInt8(0, ie), ie + 1;
  }
  function j(g) {
    return Buffer.byteLength(g, "utf8") + 1;
  }
  function V(g, D, { type: ie, flags: de, shift: we, big: be }, ce) {
    const { size: fe, value: M } = this.read(g, D, ie, ce);
    let pe = {};
    if (Array.isArray(de))
      for (const [Q, Z] of Object.entries(de))
        pe[Z] = be ? 1n << BigInt(Q) : 1 << Q;
    else if (we)
      for (const Q in de)
        pe[Q] = be ? 1n << BigInt(de[Q]) : 1 << de[Q];
    else
      pe = de;
    const ee = { _value: M };
    for (const Q in pe)
      ee[Q] = (M & pe[Q]) === pe[Q];
    return { value: ee, size: fe };
  }
  function C(g, D, ie, { type: de, flags: we, shift: be, big: ce }, fe) {
    let M = {};
    if (Array.isArray(we))
      for (const [ee, Q] of Object.entries(we))
        M[Q] = ce ? 1n << BigInt(ee) : 1 << ee;
    else if (be)
      for (const ee in we)
        M[ee] = ce ? 1n << BigInt(we[ee]) : 1 << we[ee];
    else
      M = we;
    let pe = g._value || (ce ? 0n : 0);
    for (const ee in M)
      g[ee] && (pe |= M[ee]);
    return this.write(pe, D, ie, de, fe);
  }
  function z(g, { type: D, flags: ie, shift: de, big: we }, be) {
    if (!g) throw new Error("Missing field");
    let ce = {};
    if (Array.isArray(ie))
      for (const [M, pe] of Object.entries(ie))
        ce[pe] = we ? 1n << BigInt(M) : 1 << M;
    else if (de)
      for (const M in ie)
        ce[M] = we ? 1n << BigInt(ie[M]) : 1 << ie[M];
    else
      ce = ie;
    let fe = g._value || (we ? 0n : 0);
    for (const M in ce)
      g[M] && (fe |= ce[M]);
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
  const { getField: t, getCount: e, sendCount: n, calcCount: o, tryDoc: r } = requireUtils$2();
  structures = {
    array: [a, f, l, require$$1$1.array],
    count: [m, w, R, require$$1$1.count],
    container: [c, y, u, require$$1$1.container]
  };
  function a(h, q, d, v) {
    const P = {
      value: [],
      size: 0
    };
    let E, { count: I, size: T } = e.call(this, h, q, d, v);
    q += T, P.size += T;
    for (let $ = 0; $ < I; $++)
      ({ size: T, value: E } = r(() => this.read(h, q, d.type, v), $)), P.size += T, q += T, P.value.push(E);
    return P;
  }
  function f(h, q, d, v, P) {
    return d = n.call(this, h.length, q, d, v, P), h.reduce((E, I, T) => r(() => this.write(I, q, E, v.type, P), T), d);
  }
  function l(h, q, d) {
    let v = o.call(this, h.length, q, d);
    return v = h.reduce((P, E, I) => r(() => P + this.sizeOf(E, q.type, d), I), v), v;
  }
  function c(h, q, d, v) {
    const P = {
      value: { "..": v },
      size: 0
    };
    return d.forEach(({ type: E, name: I, anon: T }) => {
      r(() => {
        const $ = this.read(h, q, E, P.value);
        P.size += $.size, q += $.size, T ? $.value !== void 0 && Object.keys($.value).forEach((x) => {
          P.value[x] = $.value[x];
        }) : P.value[I] = $.value;
      }, I || "unknown");
    }), delete P.value[".."], P;
  }
  function y(h, q, d, v, P) {
    return h[".."] = P, d = v.reduce((E, { type: I, name: T, anon: $ }) => r(() => this.write($ ? h : h[T], q, E, I, h), T || "unknown"), d), delete h[".."], d;
  }
  function u(h, q, d) {
    h[".."] = d;
    const v = q.reduce((P, { type: E, name: I, anon: T }) => P + r(() => this.sizeOf(T ? h : h[I], E, h), I || "unknown"), 0);
    return delete h[".."], v;
  }
  function m(h, q, { type: d }, v) {
    return this.read(h, q, d, v);
  }
  function w(h, q, d, { countFor: v, type: P }, E) {
    return this.write(t(v, E).length, q, d, P, E);
  }
  function R(h, { countFor: q, type: d }, v) {
    return this.sizeOf(t(q, v).length, d, v);
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
  const { getField: t, getFieldInfo: e, tryDoc: n, PartialReadError: o } = requireUtils$2();
  conditional = {
    switch: [r, a, f, require$$1.switch],
    option: [l, c, y, require$$1.option]
  };
  function r(u, m, { compareTo: w, fields: R, compareToValue: h, default: q }, d) {
    if (w = h !== void 0 ? h : t(w, d), typeof R[w] > "u" && typeof q > "u")
      throw new Error(w + " has no associated fieldInfo in switch");
    for (const I in R)
      I.startsWith("/") && (R[this.types[I.slice(1)]] = R[I], delete R[I]);
    const v = typeof R[w] > "u", P = v ? q : R[w], E = e(P);
    return n(() => this.read(u, m, E, d), v ? "default" : w);
  }
  function a(u, m, w, { compareTo: R, fields: h, compareToValue: q, default: d }, v) {
    if (R = q !== void 0 ? q : t(R, v), typeof h[R] > "u" && typeof d > "u")
      throw new Error(R + " has no associated fieldInfo in switch");
    for (const I in h)
      I.startsWith("/") && (h[this.types[I.slice(1)]] = h[I], delete h[I]);
    const P = typeof h[R] > "u", E = e(P ? d : h[R]);
    return n(() => this.write(u, m, w, E, v), P ? "default" : R);
  }
  function f(u, { compareTo: m, fields: w, compareToValue: R, default: h }, q) {
    if (m = R !== void 0 ? R : t(m, q), typeof w[m] > "u" && typeof h > "u")
      throw new Error(m + " has no associated fieldInfo in switch");
    for (const P in w)
      P.startsWith("/") && (w[this.types[P.slice(1)]] = w[P], delete w[P]);
    const d = typeof w[m] > "u", v = e(d ? h : w[m]);
    return n(() => this.sizeOf(u, v, q), d ? "default" : m);
  }
  function l(u, m, w, R) {
    if (u.length < m + 1)
      throw new o();
    if (u.readUInt8(m++) !== 0) {
      const q = this.read(u, m, w, R);
      return q.size++, q;
    } else
      return { size: 1 };
  }
  function c(u, m, w, R, h) {
    return u != null ? (m.writeUInt8(1, w++), w = this.write(u, m, w, R, h)) : m.writeUInt8(0, w++), w;
  }
  function y(u, m, w) {
    return u == null ? 1 : this.sizeOf(u, m, w) + 1;
  }
  return conditional;
}
var protodef$1, hasRequiredProtodef$1;
function requireProtodef$1() {
  if (hasRequiredProtodef$1) return protodef$1;
  hasRequiredProtodef$1 = 1;
  const { getFieldInfo: t, tryCatch: e } = requireUtils$2(), n = requireLodash_reduce(), o = requireProtodefValidator();
  function r(y) {
    return typeof y == "string" || Array.isArray(y) && typeof y[0] == "string" || y.type;
  }
  function a(y, u, m) {
    return typeof u == "string" && u.charAt(0) === "$" ? y.push({ path: m, val: u.substr(1) }) : (Array.isArray(u) || typeof u == "object") && (y = y.concat(n(u, a, []).map((w) => ({ path: m + "." + w.path, val: w.val })))), y;
  }
  function f(y, u, m) {
    const w = y.split(".").reverse();
    for (; w.length > 1; )
      m = m[w.pop()];
    m[w.pop()] = u;
  }
  function l(y, u) {
    const m = JSON.stringify(u), w = n(u, a, []);
    function R(h) {
      const q = JSON.parse(m);
      return w.forEach((d) => {
        f(d.path, h[d.val], q);
      }), q;
    }
    return [function(q, d, v, P) {
      return y[0].call(this, q, d, R(v), P);
    }, function(q, d, v, P, E) {
      return y[1].call(this, q, d, v, R(P), E);
    }, function(q, d, v) {
      return typeof y[2] == "function" ? y[2].call(this, q, R(d), v) : y[2];
    }];
  }
  class c {
    constructor(u = !0) {
      this.types = {}, this.validator = u ? new o() : null, this.addDefaultTypes();
    }
    addDefaultTypes() {
      this.addTypes(requireNumeric()), this.addTypes(requireUtils$1()), this.addTypes(requireStructures()), this.addTypes(requireConditional());
    }
    addProtocol(u, m) {
      const w = this;
      function R(h, q) {
        h !== void 0 && (h.types && w.addTypes(h.types), R(h == null ? void 0 : h[q[0]], q.slice(1)));
      }
      this.validator && this.validator.validateProtocol(u), R(u, m);
    }
    addType(u, m, w = !0) {
      if (m === "native") {
        this.validator && this.validator.addType(u);
        return;
      }
      if (r(m)) {
        this.validator && (w && this.validator.validateType(m), this.validator.addType(u));
        const { type: R, typeArgs: h } = t(m);
        this.types[u] = h ? l(this.types[R], h) : this.types[R];
      } else
        this.validator && (m[3] ? this.validator.addType(u, m[3]) : this.validator.addType(u)), this.types[u] = m;
    }
    addTypes(u) {
      Object.keys(u).forEach((m) => this.addType(m, u[m], !1)), this.validator && Object.keys(u).forEach((m) => {
        r(u[m]) && this.validator.validateType(u[m]);
      });
    }
    setVariable(u, m) {
      this.types[u] = m;
    }
    read(u, m, w, R) {
      const { type: h, typeArgs: q } = t(w), d = this.types[h];
      if (!d)
        throw new Error("missing data type: " + h);
      return d[0].call(this, u, m, q, R);
    }
    write(u, m, w, R, h) {
      const { type: q, typeArgs: d } = t(R), v = this.types[q];
      if (!v)
        throw new Error("missing data type: " + q);
      return v[1].call(this, u, m, w, d, h);
    }
    sizeOf(u, m, w) {
      const { type: R, typeArgs: h } = t(m), q = this.types[R];
      if (!q)
        throw new Error("missing data type: " + R);
      return typeof q[2] == "function" ? q[2].call(this, u, h, w) : q[2];
    }
    createPacketBuffer(u, m) {
      const w = e(
        () => this.sizeOf(m, u, {}),
        (h) => {
          throw h.message = `SizeOf error for ${h.field} : ${h.message}`, h;
        }
      ), R = Buffer.allocUnsafe(w);
      return e(
        () => this.write(m, R, 0, u, {}),
        (h) => {
          throw h.message = `Write error for ${h.field} : ${h.message}`, h;
        }
      ), R;
    }
    parsePacketBuffer(u, m, w = 0) {
      const { value: R, size: h } = e(
        () => this.read(m, w, u, {}),
        (q) => {
          throw q.message = `Read error for ${q.field} : ${q.message}`, q;
        }
      );
      return {
        data: R,
        metadata: {
          size: h
        },
        buffer: m.slice(0, h),
        fullBuffer: m
      };
    }
  }
  return protodef$1 = c, protodef$1;
}
var browser$2 = { exports: {} }, stream = { exports: {} }, primordials, hasRequiredPrimordials;
function requirePrimordials() {
  if (hasRequiredPrimordials) return primordials;
  hasRequiredPrimordials = 1;
  class t extends Error {
    constructor(n) {
      if (!Array.isArray(n))
        throw new TypeError(`Expected input to be an Array, got ${typeof n}`);
      let o = "";
      for (let r = 0; r < n.length; r++)
        o += `    ${n[r].stack}
`;
      super(o), this.name = "AggregateError", this.errors = n;
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
    ArrayPrototypeSlice(e, n, o) {
      return e.slice(n, o);
    },
    Error,
    FunctionPrototypeCall(e, n, ...o) {
      return e.call(n, ...o);
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
    ObjectDefineProperty(e, n, o) {
      return Object.defineProperty(e, n, o);
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
    PromisePrototypeThen(e, n, o) {
      return e.then(n, o);
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
    StringPrototypeSlice(e, n, o) {
      return e.slice(n, o);
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
    TypedArrayPrototypeSet(e, n, o) {
      return e.set(n, o);
    },
    Boolean,
    Uint8Array
  }, primordials;
}
var util = { exports: {} }, inspect, hasRequiredInspect;
function requireInspect() {
  return hasRequiredInspect || (hasRequiredInspect = 1, inspect = {
    format(t, ...e) {
      return t.replace(/%([sdifj])/g, function(...[n, o]) {
        const r = e.shift();
        return o === "f" ? r.toFixed(6) : o === "j" ? JSON.stringify(r) : o === "s" && typeof r == "object" ? `${r.constructor !== Object ? r.constructor.name : ""} {}`.trim() : r.toString();
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
  const { format: t, inspect: e } = requireInspect(), { AggregateError: n } = requirePrimordials(), o = globalThis.AggregateError || n, r = Symbol("kIsNodeError"), a = [
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
  ], f = /^([A-Z][a-z0-9]*)+$/, l = "__node_internal_", c = {};
  function y(d, v) {
    if (!d)
      throw new c.ERR_INTERNAL_ASSERTION(v);
  }
  function u(d) {
    let v = "", P = d.length;
    const E = d[0] === "-" ? 1 : 0;
    for (; P >= E + 4; P -= 3)
      v = `_${d.slice(P - 3, P)}${v}`;
    return `${d.slice(0, P)}${v}`;
  }
  function m(d, v, P) {
    if (typeof v == "function")
      return y(
        v.length <= P.length,
        // Default options do not count.
        `Code: ${d}; The provided arguments length (${P.length}) does not match the required ones (${v.length}).`
      ), v(...P);
    const E = (v.match(/%[dfijoOs]/g) || []).length;
    return y(
      E === P.length,
      `Code: ${d}; The provided arguments length (${P.length}) does not match the required ones (${E}).`
    ), P.length === 0 ? v : t(v, ...P);
  }
  function w(d, v, P) {
    P || (P = Error);
    class E extends P {
      constructor(...T) {
        super(m(d, v, T));
      }
      toString() {
        return `${this.name} [${d}]: ${this.message}`;
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
          return `${this.name} [${d}]: ${this.message}`;
        },
        writable: !0,
        enumerable: !1,
        configurable: !0
      }
    }), E.prototype.code = d, E.prototype[r] = !0, c[d] = E;
  }
  function R(d) {
    const v = l + d.name;
    return Object.defineProperty(d, "name", {
      value: v
    }), d;
  }
  function h(d, v) {
    if (d && v && d !== v) {
      if (Array.isArray(v.errors))
        return v.errors.push(d), v;
      const P = new o([v, d], v.message);
      return P.code = v.code, P;
    }
    return d || v;
  }
  class q extends Error {
    constructor(v = "The operation was aborted", P = void 0) {
      if (P !== void 0 && typeof P != "object")
        throw new c.ERR_INVALID_ARG_TYPE("options", "Object", P);
      super(v, P), this.code = "ABORT_ERR", this.name = "AbortError";
    }
  }
  return w("ERR_ASSERTION", "%s", Error), w(
    "ERR_INVALID_ARG_TYPE",
    (d, v, P) => {
      y(typeof d == "string", "'name' must be a string"), Array.isArray(v) || (v = [v]);
      let E = "The ";
      d.endsWith(" argument") ? E += `${d} ` : E += `"${d}" ${d.includes(".") ? "property" : "argument"} `, E += "must be ";
      const I = [], T = [], $ = [];
      for (const j of v)
        y(typeof j == "string", "All expected entries have to be of type string"), a.includes(j) ? I.push(j.toLowerCase()) : f.test(j) ? T.push(j) : (y(j !== "object", 'The value "object" should be written as "Object"'), $.push(j));
      if (T.length > 0) {
        const j = I.indexOf("object");
        j !== -1 && (I.splice(I, j, 1), T.push("Object"));
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
            const j = I.pop();
            E += `one of type ${I.join(", ")}, or ${j}`;
          }
        }
        (T.length > 0 || $.length > 0) && (E += " or ");
      }
      if (T.length > 0) {
        switch (T.length) {
          case 1:
            E += `an instance of ${T[0]}`;
            break;
          case 2:
            E += `an instance of ${T[0]} or ${T[1]}`;
            break;
          default: {
            const j = T.pop();
            E += `an instance of ${T.join(", ")}, or ${j}`;
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
          const j = $.pop();
          E += `one of ${$.join(", ")}, or ${j}`;
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
          const j = e(P, {
            depth: -1
          });
          E += `. Received ${j}`;
        }
      } else {
        let j = e(P, {
          colors: !1
        });
        j.length > 25 && (j = `${j.slice(0, 25)}...`), E += `. Received type ${typeof P} (${j})`;
      }
      return E;
    },
    TypeError
  ), w(
    "ERR_INVALID_ARG_VALUE",
    (d, v, P = "is invalid") => {
      let E = e(v);
      return E.length > 128 && (E = E.slice(0, 128) + "..."), `The ${d.includes(".") ? "property" : "argument"} '${d}' ${P}. Received ${E}`;
    },
    TypeError
  ), w(
    "ERR_INVALID_RETURN_VALUE",
    (d, v, P) => {
      var E;
      const I = P != null && (E = P.constructor) !== null && E !== void 0 && E.name ? `instance of ${P.constructor.name}` : `type ${typeof P}`;
      return `Expected ${d} to be returned from the "${v}" function but got ${I}.`;
    },
    TypeError
  ), w(
    "ERR_MISSING_ARGS",
    (...d) => {
      y(d.length > 0, "At least one arg needs to be specified");
      let v;
      const P = d.length;
      switch (d = (Array.isArray(d) ? d : [d]).map((E) => `"${E}"`).join(" or "), P) {
        case 1:
          v += `The ${d[0]} argument`;
          break;
        case 2:
          v += `The ${d[0]} and ${d[1]} arguments`;
          break;
        default:
          {
            const E = d.pop();
            v += `The ${d.join(", ")}, and ${E} arguments`;
          }
          break;
      }
      return `${v} must be specified`;
    },
    TypeError
  ), w(
    "ERR_OUT_OF_RANGE",
    (d, v, P) => {
      y(v, 'Missing "range" argument');
      let E;
      if (Number.isInteger(P) && Math.abs(P) > 2 ** 32)
        E = u(String(P));
      else if (typeof P == "bigint") {
        E = String(P);
        const I = BigInt(2) ** BigInt(32);
        (P > I || P < -I) && (E = u(E)), E += "n";
      } else
        E = e(P);
      return `The value of "${d}" is out of range. It must be ${v}. Received ${E}`;
    },
    RangeError
  ), w("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error), w("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error), w("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error), w("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error), w("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error), w("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), w("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error), w("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error), w("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error), w("ERR_STREAM_WRITE_AFTER_END", "write after end", Error), w("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError), errors = {
    AbortError: q,
    aggregateTwoErrors: R(h),
    hideStackFrames: R,
    codes: c
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
    const e = requireDist(), { format: n, inspect: o } = requireInspect(), {
      codes: { ERR_INVALID_ARG_TYPE: r }
    } = requireErrors(), { kResistStopPropagation: a, AggregateError: f, SymbolDispose: l } = requirePrimordials(), c = globalThis.AbortSignal || requireBrowser$2().AbortSignal, y = globalThis.AbortController || requireBrowser$2().AbortController, u = Object.getPrototypeOf(async function() {
    }).constructor, m = globalThis.Blob || e.Blob, w = typeof m < "u" ? function(d) {
      return d instanceof m;
    } : function(d) {
      return !1;
    }, R = (q, d) => {
      if (q !== void 0 && (q === null || typeof q != "object" || !("aborted" in q)))
        throw new r(d, "AbortSignal", q);
    }, h = (q, d) => {
      if (typeof q != "function")
        throw new r(d, "Function", q);
    };
    t.exports = {
      AggregateError: f,
      kEmptyObject: Object.freeze({}),
      once(q) {
        let d = !1;
        return function(...v) {
          d || (d = !0, q.apply(this, v));
        };
      },
      createDeferredPromise: function() {
        let q, d;
        return {
          promise: new Promise((P, E) => {
            q = P, d = E;
          }),
          resolve: q,
          reject: d
        };
      },
      promisify(q) {
        return new Promise((d, v) => {
          q((P, ...E) => P ? v(P) : d(...E));
        });
      },
      debuglog() {
        return function() {
        };
      },
      format: n,
      inspect: o,
      types: {
        isAsyncFunction(q) {
          return q instanceof u;
        },
        isArrayBufferView(q) {
          return ArrayBuffer.isView(q);
        }
      },
      isBlob: w,
      deprecate(q, d) {
        return q;
      },
      addAbortListener: requireEvents().addAbortListener || function(d, v) {
        if (d === void 0)
          throw new r("signal", "AbortSignal", d);
        R(d, "signal"), h(v, "listener");
        let P;
        return d.aborted ? queueMicrotask(() => v()) : (d.addEventListener("abort", v, {
          __proto__: null,
          once: !0,
          [a]: !0
        }), P = () => {
          d.removeEventListener("abort", v);
        }), {
          __proto__: null,
          [l]() {
            var E;
            (E = P) === null || E === void 0 || E();
          }
        };
      },
      AbortSignalAny: c.any || function(d) {
        if (d.length === 1)
          return d[0];
        const v = new y(), P = () => v.abort();
        return d.forEach((E) => {
          R(E, "signals"), E.addEventListener("abort", P, {
            once: !0
          });
        }), v.signal.addEventListener(
          "abort",
          () => {
            d.forEach((E) => E.removeEventListener("abort", P));
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
    ArrayPrototypeMap: o,
    NumberIsInteger: r,
    NumberIsNaN: a,
    NumberMAX_SAFE_INTEGER: f,
    NumberMIN_SAFE_INTEGER: l,
    NumberParseInt: c,
    ObjectPrototypeHasOwnProperty: y,
    RegExpPrototypeExec: u,
    String: m,
    StringPrototypeToUpperCase: w,
    StringPrototypeTrim: R
  } = requirePrimordials(), {
    hideStackFrames: h,
    codes: { ERR_SOCKET_BAD_PORT: q, ERR_INVALID_ARG_TYPE: d, ERR_INVALID_ARG_VALUE: v, ERR_OUT_OF_RANGE: P, ERR_UNKNOWN_SIGNAL: E }
  } = requireErrors(), { normalizeEncoding: I } = requireUtil(), { isAsyncFunction: T, isArrayBufferView: $ } = requireUtil().types, x = {};
  function j(te) {
    return te === (te | 0);
  }
  function V(te) {
    return te === te >>> 0;
  }
  const C = /^[0-7]+$/, z = "must be a 32-bit unsigned integer or an octal string";
  function g(te, $e, Ce) {
    if (typeof te > "u" && (te = Ce), typeof te == "string") {
      if (u(C, te) === null)
        throw new v($e, te, z);
      te = c(te, 8);
    }
    return de(te, $e), te;
  }
  const D = h((te, $e, Ce = l, Ae = f) => {
    if (typeof te != "number") throw new d($e, "number", te);
    if (!r(te)) throw new P($e, "an integer", te);
    if (te < Ce || te > Ae) throw new P($e, `>= ${Ce} && <= ${Ae}`, te);
  }), ie = h((te, $e, Ce = -2147483648, Ae = 2147483647) => {
    if (typeof te != "number")
      throw new d($e, "number", te);
    if (!r(te))
      throw new P($e, "an integer", te);
    if (te < Ce || te > Ae)
      throw new P($e, `>= ${Ce} && <= ${Ae}`, te);
  }), de = h((te, $e, Ce = !1) => {
    if (typeof te != "number")
      throw new d($e, "number", te);
    if (!r(te))
      throw new P($e, "an integer", te);
    const Ae = Ce ? 1 : 0, Ue = 4294967295;
    if (te < Ae || te > Ue)
      throw new P($e, `>= ${Ae} && <= ${Ue}`, te);
  });
  function we(te, $e) {
    if (typeof te != "string") throw new d($e, "string", te);
  }
  function be(te, $e, Ce = void 0, Ae) {
    if (typeof te != "number") throw new d($e, "number", te);
    if (Ce != null && te < Ce || Ae != null && te > Ae || (Ce != null || Ae != null) && a(te))
      throw new P(
        $e,
        `${Ce != null ? `>= ${Ce}` : ""}${Ce != null && Ae != null ? " && " : ""}${Ae != null ? `<= ${Ae}` : ""}`,
        te
      );
  }
  const ce = h((te, $e, Ce) => {
    if (!e(Ce, te)) {
      const Ue = "must be one of: " + n(
        o(Ce, (ge) => typeof ge == "string" ? `'${ge}'` : m(ge)),
        ", "
      );
      throw new v($e, te, Ue);
    }
  });
  function fe(te, $e) {
    if (typeof te != "boolean") throw new d($e, "boolean", te);
  }
  function M(te, $e, Ce) {
    return te == null || !y(te, $e) ? Ce : te[$e];
  }
  const pe = h((te, $e, Ce = null) => {
    const Ae = M(Ce, "allowArray", !1), Ue = M(Ce, "allowFunction", !1);
    if (!M(Ce, "nullable", !1) && te === null || !Ae && t(te) || typeof te != "object" && (!Ue || typeof te != "function"))
      throw new d($e, "Object", te);
  }), ee = h((te, $e) => {
    if (te != null && typeof te != "object" && typeof te != "function")
      throw new d($e, "a dictionary", te);
  }), Q = h((te, $e, Ce = 0) => {
    if (!t(te))
      throw new d($e, "Array", te);
    if (te.length < Ce) {
      const Ae = `must be longer than ${Ce}`;
      throw new v($e, te, Ae);
    }
  });
  function Z(te, $e) {
    Q(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++)
      we(te[Ce], `${$e}[${Ce}]`);
  }
  function le(te, $e) {
    Q(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++)
      fe(te[Ce], `${$e}[${Ce}]`);
  }
  function O(te, $e) {
    Q(te, $e);
    for (let Ce = 0; Ce < te.length; Ce++) {
      const Ae = te[Ce], Ue = `${$e}[${Ce}]`;
      if (Ae == null)
        throw new d(Ue, "AbortSignal", Ae);
      F(Ae, Ue);
    }
  }
  function B(te, $e = "signal") {
    if (we(te, $e), x[te] === void 0)
      throw x[w(te)] !== void 0 ? new E(te + " (signals must use all capital letters)") : new E(te);
  }
  const N = h((te, $e = "buffer") => {
    if (!$(te))
      throw new d($e, ["Buffer", "TypedArray", "DataView"], te);
  });
  function re(te, $e) {
    const Ce = I($e), Ae = te.length;
    if (Ce === "hex" && Ae % 2 !== 0)
      throw new v("encoding", $e, `is invalid for data of length ${Ae}`);
  }
  function ne(te, $e = "Port", Ce = !0) {
    if (typeof te != "number" && typeof te != "string" || typeof te == "string" && R(te).length === 0 || +te !== +te >>> 0 || te > 65535 || te === 0 && !Ce)
      throw new q($e, te, Ce);
    return te | 0;
  }
  const F = h((te, $e) => {
    if (te !== void 0 && (te === null || typeof te != "object" || !("aborted" in te)))
      throw new d($e, "AbortSignal", te);
  }), L = h((te, $e) => {
    if (typeof te != "function") throw new d($e, "Function", te);
  }), H = h((te, $e) => {
    if (typeof te != "function" || T(te)) throw new d($e, "Function", te);
  }), se = h((te, $e) => {
    if (te !== void 0) throw new d($e, "undefined", te);
  });
  function Ee(te, $e, Ce) {
    if (!e(Ce, te))
      throw new d($e, `('${n(Ce, "|")}')`, te);
  }
  const Re = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function Pe(te, $e) {
    if (typeof te > "u" || !u(Re, te))
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
      for (let Ae = 0; Ae < $e; Ae++) {
        const Ue = te[Ae];
        Pe(Ue, "hints"), Ce += Ue, Ae !== $e - 1 && (Ce += ", ");
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
    isInt32: j,
    isUint32: V,
    parseFileMode: g,
    validateArray: Q,
    validateStringArray: Z,
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
  function o() {
    throw new Error("setTimeout has not been defined");
  }
  function r() {
    throw new Error("clearTimeout has not been defined");
  }
  (function() {
    try {
      typeof setTimeout == "function" ? e = setTimeout : e = o;
    } catch {
      e = o;
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
    if ((e === o || !e) && setTimeout)
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
  var l = [], c = !1, y, u = -1;
  function m() {
    !c || !y || (c = !1, y.length ? l = y.concat(l) : u = -1, l.length && w());
  }
  function w() {
    if (!c) {
      var q = a(m);
      c = !0;
      for (var d = l.length; d; ) {
        for (y = l, l = []; ++u < d; )
          y && y[u].run();
        u = -1, d = l.length;
      }
      y = null, c = !1, f(q);
    }
  }
  t.nextTick = function(q) {
    var d = new Array(arguments.length - 1);
    if (arguments.length > 1)
      for (var v = 1; v < arguments.length; v++)
        d[v - 1] = arguments[v];
    l.push(new R(q, d)), l.length === 1 && !c && a(w);
  };
  function R(q, d) {
    this.fun = q, this.array = d;
  }
  R.prototype.run = function() {
    this.fun.apply(null, this.array);
  }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {};
  function h() {
  }
  return t.on = h, t.addListener = h, t.once = h, t.off = h, t.removeListener = h, t.removeAllListeners = h, t.emit = h, t.prependListener = h, t.prependOnceListener = h, t.listeners = function(q) {
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
  const { SymbolAsyncIterator: t, SymbolIterator: e, SymbolFor: n } = requirePrimordials(), o = n("nodejs.stream.destroyed"), r = n("nodejs.stream.errored"), a = n("nodejs.stream.readable"), f = n("nodejs.stream.writable"), l = n("nodejs.stream.disturbed"), c = n("nodejs.webstream.isClosedPromise"), y = n("nodejs.webstream.controllerErrorFunction");
  function u(M, pe = !1) {
    var ee;
    return !!(M && typeof M.pipe == "function" && typeof M.on == "function" && (!pe || typeof M.pause == "function" && typeof M.resume == "function") && (!M._writableState || ((ee = M._readableState) === null || ee === void 0 ? void 0 : ee.readable) !== !1) && // Duplex
    (!M._writableState || M._readableState));
  }
  function m(M) {
    var pe;
    return !!(M && typeof M.write == "function" && typeof M.on == "function" && (!M._readableState || ((pe = M._writableState) === null || pe === void 0 ? void 0 : pe.writable) !== !1));
  }
  function w(M) {
    return !!(M && typeof M.pipe == "function" && M._readableState && typeof M.on == "function" && typeof M.write == "function");
  }
  function R(M) {
    return M && (M._readableState || M._writableState || typeof M.write == "function" && typeof M.on == "function" || typeof M.pipe == "function" && typeof M.on == "function");
  }
  function h(M) {
    return !!(M && !R(M) && typeof M.pipeThrough == "function" && typeof M.getReader == "function" && typeof M.cancel == "function");
  }
  function q(M) {
    return !!(M && !R(M) && typeof M.getWriter == "function" && typeof M.abort == "function");
  }
  function d(M) {
    return !!(M && !R(M) && typeof M.readable == "object" && typeof M.writable == "object");
  }
  function v(M) {
    return h(M) || q(M) || d(M);
  }
  function P(M, pe) {
    return M == null ? !1 : pe === !0 ? typeof M[t] == "function" : pe === !1 ? typeof M[e] == "function" : typeof M[t] == "function" || typeof M[e] == "function";
  }
  function E(M) {
    if (!R(M)) return null;
    const pe = M._writableState, ee = M._readableState, Q = pe || ee;
    return !!(M.destroyed || M[o] || Q != null && Q.destroyed);
  }
  function I(M) {
    if (!m(M)) return null;
    if (M.writableEnded === !0) return !0;
    const pe = M._writableState;
    return pe != null && pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function T(M, pe) {
    if (!m(M)) return null;
    if (M.writableFinished === !0) return !0;
    const ee = M._writableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.finished) != "boolean" ? null : !!(ee.finished || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function $(M) {
    if (!u(M)) return null;
    if (M.readableEnded === !0) return !0;
    const pe = M._readableState;
    return !pe || pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function x(M, pe) {
    if (!u(M)) return null;
    const ee = M._readableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.endEmitted) != "boolean" ? null : !!(ee.endEmitted || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function j(M) {
    return M && M[a] != null ? M[a] : typeof (M == null ? void 0 : M.readable) != "boolean" ? null : E(M) ? !1 : u(M) && M.readable && !x(M);
  }
  function V(M) {
    return M && M[f] != null ? M[f] : typeof (M == null ? void 0 : M.writable) != "boolean" ? null : E(M) ? !1 : m(M) && M.writable && !I(M);
  }
  function C(M, pe) {
    return R(M) ? E(M) ? !0 : !((pe == null ? void 0 : pe.readable) !== !1 && j(M) || (pe == null ? void 0 : pe.writable) !== !1 && V(M)) : null;
  }
  function z(M) {
    var pe, ee;
    return R(M) ? M.writableErrored ? M.writableErrored : (pe = (ee = M._writableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function g(M) {
    var pe, ee;
    return R(M) ? M.readableErrored ? M.readableErrored : (pe = (ee = M._readableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function D(M) {
    if (!R(M))
      return null;
    if (typeof M.closed == "boolean")
      return M.closed;
    const pe = M._writableState, ee = M._readableState;
    return typeof (pe == null ? void 0 : pe.closed) == "boolean" || typeof (ee == null ? void 0 : ee.closed) == "boolean" ? (pe == null ? void 0 : pe.closed) || (ee == null ? void 0 : ee.closed) : typeof M._closed == "boolean" && ie(M) ? M._closed : null;
  }
  function ie(M) {
    return typeof M._closed == "boolean" && typeof M._defaultKeepAlive == "boolean" && typeof M._removedConnection == "boolean" && typeof M._removedContLen == "boolean";
  }
  function de(M) {
    return typeof M._sent100 == "boolean" && ie(M);
  }
  function we(M) {
    var pe;
    return typeof M._consuming == "boolean" && typeof M._dumped == "boolean" && ((pe = M.req) === null || pe === void 0 ? void 0 : pe.upgradeOrConnect) === void 0;
  }
  function be(M) {
    if (!R(M)) return null;
    const pe = M._writableState, ee = M._readableState, Q = pe || ee;
    return !Q && de(M) || !!(Q && Q.autoDestroy && Q.emitClose && Q.closed === !1);
  }
  function ce(M) {
    var pe;
    return !!(M && ((pe = M[l]) !== null && pe !== void 0 ? pe : M.readableDidRead || M.readableAborted));
  }
  function fe(M) {
    var pe, ee, Q, Z, le, O, B, N, re, ne;
    return !!(M && ((pe = (ee = (Q = (Z = (le = (O = M[r]) !== null && O !== void 0 ? O : M.readableErrored) !== null && le !== void 0 ? le : M.writableErrored) !== null && Z !== void 0 ? Z : (B = M._readableState) === null || B === void 0 ? void 0 : B.errorEmitted) !== null && Q !== void 0 ? Q : (N = M._writableState) === null || N === void 0 ? void 0 : N.errorEmitted) !== null && ee !== void 0 ? ee : (re = M._readableState) === null || re === void 0 ? void 0 : re.errored) !== null && pe !== void 0 ? pe : !((ne = M._writableState) === null || ne === void 0) && ne.errored));
  }
  return utils = {
    isDestroyed: E,
    kIsDestroyed: o,
    isDisturbed: ce,
    kIsDisturbed: l,
    isErrored: fe,
    kIsErrored: r,
    isReadable: j,
    kIsReadable: a,
    kIsClosedPromise: c,
    kControllerErrorFunction: y,
    kIsWritable: f,
    isClosed: D,
    isDuplexNodeStream: w,
    isFinished: C,
    isIterable: P,
    isReadableNodeStream: u,
    isReadableStream: h,
    isReadableEnded: $,
    isReadableFinished: x,
    isReadableErrored: g,
    isNodeStream: R,
    isWebStream: v,
    isWritable: V,
    isWritableNodeStream: m,
    isWritableStream: q,
    isWritableEnded: I,
    isWritableFinished: T,
    isWritableErrored: z,
    isServerRequest: we,
    isServerResponse: de,
    willEmitClose: be,
    isTransformStream: d
  }, utils;
}
var hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream.exports;
  hasRequiredEndOfStream = 1;
  const t = requireBrowser$1(), { AbortError: e, codes: n } = requireErrors(), { ERR_INVALID_ARG_TYPE: o, ERR_STREAM_PREMATURE_CLOSE: r } = n, { kEmptyObject: a, once: f } = requireUtil(), { validateAbortSignal: l, validateFunction: c, validateObject: y, validateBoolean: u } = requireValidators(), { Promise: m, PromisePrototypeThen: w, SymbolDispose: R } = requirePrimordials(), {
    isClosed: h,
    isReadable: q,
    isReadableNodeStream: d,
    isReadableStream: v,
    isReadableFinished: P,
    isReadableErrored: E,
    isWritable: I,
    isWritableNodeStream: T,
    isWritableStream: $,
    isWritableFinished: x,
    isWritableErrored: j,
    isNodeStream: V,
    willEmitClose: C,
    kIsClosedPromise: z
  } = requireUtils();
  let g;
  function D(ce) {
    return ce.setHeader && typeof ce.abort == "function";
  }
  const ie = () => {
  };
  function de(ce, fe, M) {
    var pe, ee;
    if (arguments.length === 2 ? (M = fe, fe = a) : fe == null ? fe = a : y(fe, "options"), c(M, "callback"), l(fe.signal, "options.signal"), M = f(M), v(ce) || $(ce))
      return we(ce, fe, M);
    if (!V(ce))
      throw new o("stream", ["ReadableStream", "WritableStream", "Stream"], ce);
    const Q = (pe = fe.readable) !== null && pe !== void 0 ? pe : d(ce), Z = (ee = fe.writable) !== null && ee !== void 0 ? ee : T(ce), le = ce._writableState, O = ce._readableState, B = () => {
      ce.writable || ne();
    };
    let N = C(ce) && d(ce) === Q && T(ce) === Z, re = x(ce, !1);
    const ne = () => {
      re = !0, ce.destroyed && (N = !1), !(N && (!ce.readable || Q)) && (!Q || F) && M.call(ce);
    };
    let F = P(ce, !1);
    const L = () => {
      F = !0, ce.destroyed && (N = !1), !(N && (!ce.writable || Z)) && (!Z || re) && M.call(ce);
    }, H = (te) => {
      M.call(ce, te);
    };
    let se = h(ce);
    const Ee = () => {
      se = !0;
      const te = j(ce) || E(ce);
      if (te && typeof te != "boolean")
        return M.call(ce, te);
      if (Q && !F && d(ce, !0) && !P(ce, !1))
        return M.call(ce, new r());
      if (Z && !re && !x(ce, !1))
        return M.call(ce, new r());
      M.call(ce);
    }, Re = () => {
      se = !0;
      const te = j(ce) || E(ce);
      if (te && typeof te != "boolean")
        return M.call(ce, te);
      M.call(ce);
    }, Pe = () => {
      ce.req.on("finish", ne);
    };
    D(ce) ? (ce.on("complete", ne), N || ce.on("abort", Ee), ce.req ? Pe() : ce.on("request", Pe)) : Z && !le && (ce.on("end", B), ce.on("close", B)), !N && typeof ce.aborted == "boolean" && ce.on("aborted", Ee), ce.on("end", L), ce.on("finish", ne), fe.error !== !1 && ce.on("error", H), ce.on("close", Ee), se ? t.nextTick(Ee) : le != null && le.errorEmitted || O != null && O.errorEmitted ? N || t.nextTick(Re) : (!Q && (!N || q(ce)) && (re || I(ce) === !1) || !Z && (!N || I(ce)) && (F || q(ce) === !1) || O && ce.req && ce.aborted) && t.nextTick(Re);
    const Oe = () => {
      M = ie, ce.removeListener("aborted", Ee), ce.removeListener("complete", ne), ce.removeListener("abort", Ee), ce.removeListener("request", Pe), ce.req && ce.req.removeListener("finish", ne), ce.removeListener("end", B), ce.removeListener("close", B), ce.removeListener("finish", ne), ce.removeListener("end", L), ce.removeListener("error", H), ce.removeListener("close", Ee);
    };
    if (fe.signal && !se) {
      const te = () => {
        const $e = M;
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
        g = g || requireUtil().addAbortListener;
        const $e = g(fe.signal, te), Ce = M;
        M = f((...Ae) => {
          $e[R](), Ce.apply(ce, Ae);
        });
      }
    }
    return Oe;
  }
  function we(ce, fe, M) {
    let pe = !1, ee = ie;
    if (fe.signal)
      if (ee = () => {
        pe = !0, M.call(
          ce,
          new e(void 0, {
            cause: fe.signal.reason
          })
        );
      }, fe.signal.aborted)
        t.nextTick(ee);
      else {
        g = g || requireUtil().addAbortListener;
        const Z = g(fe.signal, ee), le = M;
        M = f((...O) => {
          Z[R](), le.apply(ce, O);
        });
      }
    const Q = (...Z) => {
      pe || t.nextTick(() => M.apply(ce, Z));
    };
    return w(ce[z].promise, Q, Q), ie;
  }
  function be(ce, fe) {
    var M;
    let pe = !1;
    return fe === null && (fe = a), (M = fe) !== null && M !== void 0 && M.cleanup && (u(fe.cleanup, "cleanup"), pe = fe.cleanup), new m((ee, Q) => {
      const Z = de(ce, fe, (le) => {
        pe && Z(), le ? Q(le) : ee();
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
    AbortError: o
  } = requireErrors(), { Symbol: r } = requirePrimordials(), { kIsDestroyed: a, isDestroyed: f, isFinished: l, isServerRequest: c } = requireUtils(), y = r("kDestroy"), u = r("kConstruct");
  function m(C, z, g) {
    C && (C.stack, z && !z.errored && (z.errored = C), g && !g.errored && (g.errored = C));
  }
  function w(C, z) {
    const g = this._readableState, D = this._writableState, ie = D || g;
    return D != null && D.destroyed || g != null && g.destroyed ? (typeof z == "function" && z(), this) : (m(C, D, g), D && (D.destroyed = !0), g && (g.destroyed = !0), ie.constructed ? R(this, C, z) : this.once(y, function(de) {
      R(this, e(de, C), z);
    }), this);
  }
  function R(C, z, g) {
    let D = !1;
    function ie(de) {
      if (D)
        return;
      D = !0;
      const we = C._readableState, be = C._writableState;
      m(de, be, we), be && (be.closed = !0), we && (we.closed = !0), typeof g == "function" && g(de), de ? t.nextTick(h, C, de) : t.nextTick(q, C);
    }
    try {
      C._destroy(z || null, ie);
    } catch (de) {
      ie(de);
    }
  }
  function h(C, z) {
    d(C, z), q(C);
  }
  function q(C) {
    const z = C._readableState, g = C._writableState;
    g && (g.closeEmitted = !0), z && (z.closeEmitted = !0), (g != null && g.emitClose || z != null && z.emitClose) && C.emit("close");
  }
  function d(C, z) {
    const g = C._readableState, D = C._writableState;
    D != null && D.errorEmitted || g != null && g.errorEmitted || (D && (D.errorEmitted = !0), g && (g.errorEmitted = !0), C.emit("error", z));
  }
  function v() {
    const C = this._readableState, z = this._writableState;
    C && (C.constructed = !0, C.closed = !1, C.closeEmitted = !1, C.destroyed = !1, C.errored = null, C.errorEmitted = !1, C.reading = !1, C.ended = C.readable === !1, C.endEmitted = C.readable === !1), z && (z.constructed = !0, z.destroyed = !1, z.closed = !1, z.closeEmitted = !1, z.errored = null, z.errorEmitted = !1, z.finalCalled = !1, z.prefinished = !1, z.ended = z.writable === !1, z.ending = z.writable === !1, z.finished = z.writable === !1);
  }
  function P(C, z, g) {
    const D = C._readableState, ie = C._writableState;
    if (ie != null && ie.destroyed || D != null && D.destroyed)
      return this;
    D != null && D.autoDestroy || ie != null && ie.autoDestroy ? C.destroy(z) : z && (z.stack, ie && !ie.errored && (ie.errored = z), D && !D.errored && (D.errored = z), g ? t.nextTick(d, C, z) : d(C, z));
  }
  function E(C, z) {
    if (typeof C._construct != "function")
      return;
    const g = C._readableState, D = C._writableState;
    g && (g.constructed = !1), D && (D.constructed = !1), C.once(u, z), !(C.listenerCount(u) > 1) && t.nextTick(I, C);
  }
  function I(C) {
    let z = !1;
    function g(D) {
      if (z) {
        P(C, D ?? new n());
        return;
      }
      z = !0;
      const ie = C._readableState, de = C._writableState, we = de || ie;
      ie && (ie.constructed = !0), de && (de.constructed = !0), we.destroyed ? C.emit(y, D) : D ? P(C, D, !0) : t.nextTick(T, C);
    }
    try {
      C._construct((D) => {
        t.nextTick(g, D);
      });
    } catch (D) {
      t.nextTick(g, D);
    }
  }
  function T(C) {
    C.emit(u);
  }
  function $(C) {
    return (C == null ? void 0 : C.setHeader) && typeof C.abort == "function";
  }
  function x(C) {
    C.emit("close");
  }
  function j(C, z) {
    C.emit("error", z), t.nextTick(x, C);
  }
  function V(C, z) {
    !C || f(C) || (!z && !l(C) && (z = new o()), c(C) ? (C.socket = null, C.destroy(z)) : $(C) ? C.abort() : $(C.req) ? C.req.abort() : typeof C.destroy == "function" ? C.destroy(z) : typeof C.close == "function" ? C.close() : z ? t.nextTick(j, C, z) : t.nextTick(x, C), C.destroyed || (C[a] = !0));
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
  function o(a) {
    n.call(this, a);
  }
  e(o.prototype, n.prototype), e(o, n), o.prototype.pipe = function(a, f) {
    const l = this;
    function c(q) {
      a.writable && a.write(q) === !1 && l.pause && l.pause();
    }
    l.on("data", c);
    function y() {
      l.readable && l.resume && l.resume();
    }
    a.on("drain", y), !a._isStdio && (!f || f.end !== !1) && (l.on("end", m), l.on("close", w));
    let u = !1;
    function m() {
      u || (u = !0, a.end());
    }
    function w() {
      u || (u = !0, typeof a.destroy == "function" && a.destroy());
    }
    function R(q) {
      h(), n.listenerCount(this, "error") === 0 && this.emit("error", q);
    }
    r(l, "error", R), r(a, "error", R);
    function h() {
      l.removeListener("data", c), a.removeListener("drain", y), l.removeListener("end", m), l.removeListener("close", w), l.removeListener("error", R), a.removeListener("error", R), l.removeListener("end", h), l.removeListener("close", h), a.removeListener("close", h);
    }
    return l.on("end", h), l.on("close", h), a.on("close", h), a.emit("pipe", l), a;
  };
  function r(a, f, l) {
    if (typeof a.prependListener == "function") return a.prependListener(f, l);
    !a._events || !a._events[f] ? a.on(f, l) : t(a._events[f]) ? a._events[f].unshift(l) : a._events[f] = [l, a._events[f]];
  }
  return legacy = {
    Stream: o,
    prependListener: r
  }, legacy;
}
var addAbortSignal = { exports: {} }, hasRequiredAddAbortSignal;
function requireAddAbortSignal() {
  return hasRequiredAddAbortSignal || (hasRequiredAddAbortSignal = 1, (function(t) {
    const { SymbolDispose: e } = requirePrimordials(), { AbortError: n, codes: o } = requireErrors(), { isNodeStream: r, isWebStream: a, kControllerErrorFunction: f } = requireUtils(), l = requireEndOfStream(), { ERR_INVALID_ARG_TYPE: c } = o;
    let y;
    const u = (m, w) => {
      if (typeof m != "object" || !("aborted" in m))
        throw new c(w, "AbortSignal", m);
    };
    t.exports.addAbortSignal = function(w, R) {
      if (u(w, "signal"), !r(R) && !a(R))
        throw new c("stream", ["ReadableStream", "WritableStream", "Stream"], R);
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
        y = y || requireUtil().addAbortListener;
        const h = y(m, R);
        l(w, h[e]);
      }
      return w;
    };
  })(addAbortSignal)), addAbortSignal.exports;
}
var buffer_list, hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  const { StringPrototypeSlice: t, SymbolIterator: e, TypedArrayPrototypeSet: n, Uint8Array: o } = requirePrimordials(), { Buffer: r } = requireDist(), { inspect: a } = requireUtil();
  return buffer_list = class {
    constructor() {
      this.head = null, this.tail = null, this.length = 0;
    }
    push(l) {
      const c = {
        data: l,
        next: null
      };
      this.length > 0 ? this.tail.next = c : this.head = c, this.tail = c, ++this.length;
    }
    unshift(l) {
      const c = {
        data: l,
        next: this.head
      };
      this.length === 0 && (this.tail = c), this.head = c, ++this.length;
    }
    shift() {
      if (this.length === 0) return;
      const l = this.head.data;
      return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, l;
    }
    clear() {
      this.head = this.tail = null, this.length = 0;
    }
    join(l) {
      if (this.length === 0) return "";
      let c = this.head, y = "" + c.data;
      for (; (c = c.next) !== null; ) y += l + c.data;
      return y;
    }
    concat(l) {
      if (this.length === 0) return r.alloc(0);
      const c = r.allocUnsafe(l >>> 0);
      let y = this.head, u = 0;
      for (; y; )
        n(c, y.data, u), u += y.data.length, y = y.next;
      return c;
    }
    // Consumes a specified amount of bytes or characters from the buffered data.
    consume(l, c) {
      const y = this.head.data;
      if (l < y.length) {
        const u = y.slice(0, l);
        return this.head.data = y.slice(l), u;
      }
      return l === y.length ? this.shift() : c ? this._getString(l) : this._getBuffer(l);
    }
    first() {
      return this.head.data;
    }
    *[e]() {
      for (let l = this.head; l; l = l.next)
        yield l.data;
    }
    // Consumes a specified amount of characters from the buffered data.
    _getString(l) {
      let c = "", y = this.head, u = 0;
      do {
        const m = y.data;
        if (l > m.length)
          c += m, l -= m.length;
        else {
          l === m.length ? (c += m, ++u, y.next ? this.head = y.next : this.head = this.tail = null) : (c += t(m, 0, l), this.head = y, y.data = t(m, l));
          break;
        }
        ++u;
      } while ((y = y.next) !== null);
      return this.length -= u, c;
    }
    // Consumes a specified amount of bytes from the buffered data.
    _getBuffer(l) {
      const c = r.allocUnsafe(l), y = l;
      let u = this.head, m = 0;
      do {
        const w = u.data;
        if (l > w.length)
          n(c, w, y - l), l -= w.length;
        else {
          l === w.length ? (n(c, w, y - l), ++m, u.next ? this.head = u.next : this.head = this.tail = null) : (n(c, new o(w.buffer, w.byteOffset, l), y - l), this.head = u, u.data = w.slice(l));
          break;
        }
        ++m;
      } while ((u = u.next) !== null);
      return this.length -= m, c;
    }
    // Make sure the linked list only shows the minimal necessary information.
    [Symbol.for("nodejs.util.inspect.custom")](l, c) {
      return a(this, {
        ...c,
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
  const { MathFloor: t, NumberIsInteger: e } = requirePrimordials(), { validateInteger: n } = requireValidators(), { ERR_INVALID_ARG_VALUE: o } = requireErrors().codes;
  let r = 16 * 1024, a = 16;
  function f(u, m, w) {
    return u.highWaterMark != null ? u.highWaterMark : m ? u[w] : null;
  }
  function l(u) {
    return u ? a : r;
  }
  function c(u, m) {
    n(m, "value", 0), u ? a = m : r = m;
  }
  function y(u, m, w, R) {
    const h = f(m, R, w);
    if (h != null) {
      if (!e(h) || h < 0) {
        const q = R ? `options.${w}` : "options.highWaterMark";
        throw new o(q, h);
      }
      return t(h);
    }
    return l(u.objectMode);
  }
  return state = {
    getHighWaterMark: y,
    getDefaultHighWaterMark: l,
    setDefaultHighWaterMark: c
  }, state;
}
var from_1, hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from_1;
  hasRequiredFrom = 1;
  const t = requireBrowser$1(), { PromisePrototypeThen: e, SymbolAsyncIterator: n, SymbolIterator: o } = requirePrimordials(), { Buffer: r } = requireDist(), { ERR_INVALID_ARG_TYPE: a, ERR_STREAM_NULL_VALUES: f } = requireErrors().codes;
  function l(c, y, u) {
    let m;
    if (typeof y == "string" || y instanceof r)
      return new c({
        objectMode: !0,
        ...u,
        read() {
          this.push(y), this.push(null);
        }
      });
    let w;
    if (y && y[n])
      w = !0, m = y[n]();
    else if (y && y[o])
      w = !1, m = y[o]();
    else
      throw new a("iterable", ["Iterable"], y);
    const R = new c({
      objectMode: !0,
      highWaterMark: 1,
      // TODO(ronag): What options should be allowed?
      ...u
    });
    let h = !1;
    R._read = function() {
      h || (h = !0, d());
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
        const { value: I, done: T } = await m.throw(v);
        if (await I, T)
          return;
      }
      if (typeof m.return == "function") {
        const { value: I } = await m.return();
        await I;
      }
    }
    async function d() {
      for (; ; ) {
        try {
          const { value: v, done: P } = w ? await m.next() : m.next();
          if (P)
            R.push(null);
          else {
            const E = v && typeof v.then == "function" ? await v : v;
            if (E === null)
              throw h = !1, new f();
            if (R.push(E))
              continue;
            h = !1;
          }
        } catch (v) {
          R.destroy(v);
        }
        break;
      }
    }
    return R;
  }
  return from_1 = l, from_1;
}
var readable, hasRequiredReadable;
function requireReadable() {
  if (hasRequiredReadable) return readable;
  hasRequiredReadable = 1;
  const t = requireBrowser$1(), {
    ArrayPrototypeIndexOf: e,
    NumberIsInteger: n,
    NumberIsNaN: o,
    NumberParseInt: r,
    ObjectDefineProperties: a,
    ObjectKeys: f,
    ObjectSetPrototypeOf: l,
    Promise: c,
    SafeSet: y,
    SymbolAsyncDispose: u,
    SymbolAsyncIterator: m,
    Symbol: w
  } = requirePrimordials();
  readable = Ae, Ae.ReadableState = Ce;
  const { EventEmitter: R } = requireEvents(), { Stream: h, prependListener: q } = requireLegacy(), { Buffer: d } = requireDist(), { addAbortSignal: v } = requireAddAbortSignal(), P = requireEndOfStream();
  let E = requireUtil().debuglog("stream", (K) => {
    E = K;
  });
  const I = requireBuffer_list(), T = requireDestroy(), { getHighWaterMark: $, getDefaultHighWaterMark: x } = requireState(), {
    aggregateTwoErrors: j,
    codes: {
      ERR_INVALID_ARG_TYPE: V,
      ERR_METHOD_NOT_IMPLEMENTED: C,
      ERR_OUT_OF_RANGE: z,
      ERR_STREAM_PUSH_AFTER_EOF: g,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT: D
    },
    AbortError: ie
  } = requireErrors(), { validateObject: de } = requireValidators(), we = w("kPaused"), { StringDecoder: be } = requireString_decoder(), ce = requireFrom();
  l(Ae.prototype, h.prototype), l(Ae, h);
  const fe = () => {
  }, { errorOrDestroy: M } = T, pe = 1, ee = 2, Q = 4, Z = 8, le = 16, O = 32, B = 64, N = 128, re = 256, ne = 512, F = 1024, L = 2048, H = 4096, se = 8192, Ee = 16384, Re = 32768, Pe = 65536, Oe = 1 << 17, te = 1 << 18;
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
    endEmitted: $e(Q),
    reading: $e(Z),
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
  function Ce(K, b, p) {
    typeof p != "boolean" && (p = b instanceof requireDuplex()), this.state = L | H | le | O, K && K.objectMode && (this.state |= pe), p && K && K.readableObjectMode && (this.state |= pe), this.highWaterMark = K ? $(this, K, "readableHighWaterMark", p) : x(!1), this.buffer = new I(), this.length = 0, this.pipes = [], this.flowing = null, this[we] = null, K && K.emitClose === !1 && (this.state &= ~L), K && K.autoDestroy === !1 && (this.state &= ~H), this.errored = null, this.defaultEncoding = K && K.defaultEncoding || "utf8", this.awaitDrainWriters = null, this.decoder = null, this.encoding = null, K && K.encoding && (this.decoder = new be(K.encoding), this.encoding = K.encoding);
  }
  function Ae(K) {
    if (!(this instanceof Ae)) return new Ae(K);
    const b = this instanceof requireDuplex();
    this._readableState = new Ce(K, this, b), K && (typeof K.read == "function" && (this._read = K.read), typeof K.destroy == "function" && (this._destroy = K.destroy), typeof K.construct == "function" && (this._construct = K.construct), K.signal && !b && v(K.signal, this)), h.call(this, K), T.construct(this, () => {
      this._readableState.needReadable && s(this, this._readableState);
    });
  }
  Ae.prototype.destroy = T.destroy, Ae.prototype._undestroy = T.undestroy, Ae.prototype._destroy = function(K, b) {
    b(K);
  }, Ae.prototype[R.captureRejectionSymbol] = function(K) {
    this.destroy(K);
  }, Ae.prototype[u] = function() {
    let K;
    return this.destroyed || (K = this.readableEnded ? null : new ie(), this.destroy(K)), new c((b, p) => P(this, (A) => A && A !== K ? p(A) : b(null)));
  }, Ae.prototype.push = function(K, b) {
    return Ue(this, K, b, !1);
  }, Ae.prototype.unshift = function(K, b) {
    return Ue(this, K, b, !0);
  };
  function Ue(K, b, p, A) {
    E("readableAddChunk", b);
    const Y = K._readableState;
    let ye;
    if ((Y.state & pe) === 0 && (typeof b == "string" ? (p = p || Y.defaultEncoding, Y.encoding !== p && (A && Y.encoding ? b = d.from(b, p).toString(Y.encoding) : (b = d.from(b, p), p = ""))) : b instanceof d ? p = "" : h._isUint8Array(b) ? (b = h._uint8ArrayToBuffer(b), p = "") : b != null && (ye = new V("chunk", ["string", "Buffer", "Uint8Array"], b))), ye)
      M(K, ye);
    else if (b === null)
      Y.state &= ~Z, ke(K, Y);
    else if ((Y.state & pe) !== 0 || b && b.length > 0)
      if (A)
        if ((Y.state & Q) !== 0) M(K, new D());
        else {
          if (Y.destroyed || Y.errored) return !1;
          ge(K, Y, b, !0);
        }
      else if (Y.ended)
        M(K, new g());
      else {
        if (Y.destroyed || Y.errored)
          return !1;
        Y.state &= ~Z, Y.decoder && !p ? (b = Y.decoder.write(b), Y.objectMode || b.length !== 0 ? ge(K, Y, b, !1) : s(K, Y)) : ge(K, Y, b, !1);
      }
    else A || (Y.state &= ~Z, s(K, Y));
    return !Y.ended && (Y.length < Y.highWaterMark || Y.length === 0);
  }
  function ge(K, b, p, A) {
    b.flowing && b.length === 0 && !b.sync && K.listenerCount("data") > 0 ? ((b.state & Pe) !== 0 ? b.awaitDrainWriters.clear() : b.awaitDrainWriters = null, b.dataEmitted = !0, K.emit("data", p)) : (b.length += b.objectMode ? 1 : p.length, A ? b.buffer.unshift(p) : b.buffer.push(p), (b.state & B) !== 0 && He(K)), s(K, b);
  }
  Ae.prototype.isPaused = function() {
    const K = this._readableState;
    return K[we] === !0 || K.flowing === !1;
  }, Ae.prototype.setEncoding = function(K) {
    const b = new be(K);
    this._readableState.decoder = b, this._readableState.encoding = this._readableState.decoder.encoding;
    const p = this._readableState.buffer;
    let A = "";
    for (const Y of p)
      A += b.write(Y);
    return p.clear(), A !== "" && p.push(A), this._readableState.length = A.length, this;
  };
  const Se = 1073741824;
  function Le(K) {
    if (K > Se)
      throw new z("size", "<= 1GiB", K);
    return K--, K |= K >>> 1, K |= K >>> 2, K |= K >>> 4, K |= K >>> 8, K |= K >>> 16, K++, K;
  }
  function je(K, b) {
    return K <= 0 || b.length === 0 && b.ended ? 0 : (b.state & pe) !== 0 ? 1 : o(K) ? b.flowing && b.length ? b.buffer.first().length : b.length : K <= b.length ? K : b.ended ? b.length : 0;
  }
  Ae.prototype.read = function(K) {
    E("read", K), K === void 0 ? K = NaN : n(K) || (K = r(K, 10));
    const b = this._readableState, p = K;
    if (K > b.highWaterMark && (b.highWaterMark = Le(K)), K !== 0 && (b.state &= ~N), K === 0 && b.needReadable && ((b.highWaterMark !== 0 ? b.length >= b.highWaterMark : b.length > 0) || b.ended))
      return E("read: emitReadable", b.length, b.ended), b.length === 0 && b.ended ? Fe(this) : He(this), null;
    if (K = je(K, b), K === 0 && b.ended)
      return b.length === 0 && Fe(this), null;
    let A = (b.state & B) !== 0;
    if (E("need readable", A), (b.length === 0 || b.length - K < b.highWaterMark) && (A = !0, E("length less than watermark", A)), b.ended || b.reading || b.destroyed || b.errored || !b.constructed)
      A = !1, E("reading, ended or constructing", A);
    else if (A) {
      E("do read"), b.state |= Z | O, b.length === 0 && (b.state |= B);
      try {
        this._read(b.highWaterMark);
      } catch (ye) {
        M(this, ye);
      }
      b.state &= ~O, b.reading || (K = je(p, b));
    }
    let Y;
    return K > 0 ? Y = Ie(K, b) : Y = null, Y === null ? (b.needReadable = b.length <= b.highWaterMark, K = 0) : (b.length -= K, b.multiAwaitDrain ? b.awaitDrainWriters.clear() : b.awaitDrainWriters = null), b.length === 0 && (b.ended || (b.needReadable = !0), p !== K && b.ended && Fe(this)), Y !== null && !b.errorEmitted && !b.closeEmitted && (b.dataEmitted = !0, this.emit("data", Y)), Y;
  };
  function ke(K, b) {
    if (E("onEofChunk"), !b.ended) {
      if (b.decoder) {
        const p = b.decoder.end();
        p && p.length && (b.buffer.push(p), b.length += b.objectMode ? 1 : p.length);
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
  function s(K, b) {
    !b.readingMore && b.constructed && (b.readingMore = !0, t.nextTick(_, K, b));
  }
  function _(K, b) {
    for (; !b.reading && !b.ended && (b.length < b.highWaterMark || b.flowing && b.length === 0); ) {
      const p = b.length;
      if (E("maybeReadMore read 0"), K.read(0), p === b.length)
        break;
    }
    b.readingMore = !1;
  }
  Ae.prototype._read = function(K) {
    throw new C("_read()");
  }, Ae.prototype.pipe = function(K, b) {
    const p = this, A = this._readableState;
    A.pipes.length === 1 && (A.multiAwaitDrain || (A.multiAwaitDrain = !0, A.awaitDrainWriters = new y(A.awaitDrainWriters ? [A.awaitDrainWriters] : []))), A.pipes.push(K), E("pipe count=%d opts=%j", A.pipes.length, b);
    const ye = (!b || b.end !== !1) && K !== t.stdout && K !== t.stderr ? ae : nr;
    A.endEmitted ? t.nextTick(ye) : p.once("end", ye), K.on("unpipe", qe);
    function qe(Qe, rr) {
      E("onunpipe"), Qe === p && rr && rr.hasUnpiped === !1 && (rr.hasUnpiped = !0, xe());
    }
    function ae() {
      E("onend"), K.end();
    }
    let oe, me = !1;
    function xe() {
      E("cleanup"), K.removeListener("close", Xe), K.removeListener("finish", Ye), oe && K.removeListener("drain", oe), K.removeListener("error", Ve), K.removeListener("unpipe", qe), p.removeListener("end", ae), p.removeListener("end", nr), p.removeListener("data", Me), me = !0, oe && A.awaitDrainWriters && (!K._writableState || K._writableState.needDrain) && oe();
    }
    function Te() {
      me || (A.pipes.length === 1 && A.pipes[0] === K ? (E("false write response, pause", 0), A.awaitDrainWriters = K, A.multiAwaitDrain = !1) : A.pipes.length > 1 && A.pipes.includes(K) && (E("false write response, pause", A.awaitDrainWriters.size), A.awaitDrainWriters.add(K)), p.pause()), oe || (oe = W(p, K), K.on("drain", oe));
    }
    p.on("data", Me);
    function Me(Qe) {
      E("ondata");
      const rr = K.write(Qe);
      E("dest.write", rr), rr === !1 && Te();
    }
    function Ve(Qe) {
      if (E("onerror", Qe), nr(), K.removeListener("error", Ve), K.listenerCount("error") === 0) {
        const rr = K._writableState || K._readableState;
        rr && !rr.errorEmitted ? M(K, Qe) : K.emit("error", Qe);
      }
    }
    q(K, "error", Ve);
    function Xe() {
      K.removeListener("finish", Ye), nr();
    }
    K.once("close", Xe);
    function Ye() {
      E("onfinish"), K.removeListener("close", Xe), nr();
    }
    K.once("finish", Ye);
    function nr() {
      E("unpipe"), p.unpipe(K);
    }
    return K.emit("pipe", p), K.writableNeedDrain === !0 ? Te() : A.flowing || (E("pipe resume"), p.resume()), K;
  };
  function W(K, b) {
    return function() {
      const A = K._readableState;
      A.awaitDrainWriters === b ? (E("pipeOnDrain", 1), A.awaitDrainWriters = null) : A.multiAwaitDrain && (E("pipeOnDrain", A.awaitDrainWriters.size), A.awaitDrainWriters.delete(b)), (!A.awaitDrainWriters || A.awaitDrainWriters.size === 0) && K.listenerCount("data") && K.resume();
    };
  }
  Ae.prototype.unpipe = function(K) {
    const b = this._readableState, p = {
      hasUnpiped: !1
    };
    if (b.pipes.length === 0) return this;
    if (!K) {
      const Y = b.pipes;
      b.pipes = [], this.pause();
      for (let ye = 0; ye < Y.length; ye++)
        Y[ye].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    const A = e(b.pipes, K);
    return A === -1 ? this : (b.pipes.splice(A, 1), b.pipes.length === 0 && this.pause(), K.emit("unpipe", this, p), this);
  }, Ae.prototype.on = function(K, b) {
    const p = h.prototype.on.call(this, K, b), A = this._readableState;
    return K === "data" ? (A.readableListening = this.listenerCount("readable") > 0, A.flowing !== !1 && this.resume()) : K === "readable" && !A.endEmitted && !A.readableListening && (A.readableListening = A.needReadable = !0, A.flowing = !1, A.emittedReadable = !1, E("on readable", A.length, A.reading), A.length ? He(this) : A.reading || t.nextTick(J, this)), p;
  }, Ae.prototype.addListener = Ae.prototype.on, Ae.prototype.removeListener = function(K, b) {
    const p = h.prototype.removeListener.call(this, K, b);
    return K === "readable" && t.nextTick(ue, this), p;
  }, Ae.prototype.off = Ae.prototype.removeListener, Ae.prototype.removeAllListeners = function(K) {
    const b = h.prototype.removeAllListeners.apply(this, arguments);
    return (K === "readable" || K === void 0) && t.nextTick(ue, this), b;
  };
  function ue(K) {
    const b = K._readableState;
    b.readableListening = K.listenerCount("readable") > 0, b.resumeScheduled && b[we] === !1 ? b.flowing = !0 : K.listenerCount("data") > 0 ? K.resume() : b.readableListening || (b.flowing = null);
  }
  function J(K) {
    E("readable nexttick read 0"), K.read(0);
  }
  Ae.prototype.resume = function() {
    const K = this._readableState;
    return K.flowing || (E("resume"), K.flowing = !K.readableListening, he(this, K)), K[we] = !1, this;
  };
  function he(K, b) {
    b.resumeScheduled || (b.resumeScheduled = !0, t.nextTick(k, K, b));
  }
  function k(K, b) {
    E("resume", b.reading), b.reading || K.read(0), b.resumeScheduled = !1, K.emit("resume"), Be(K), b.flowing && !b.reading && K.read(0);
  }
  Ae.prototype.pause = function() {
    return E("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (E("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState[we] = !0, this;
  };
  function Be(K) {
    const b = K._readableState;
    for (E("flow", b.flowing); b.flowing && K.read() !== null; ) ;
  }
  Ae.prototype.wrap = function(K) {
    let b = !1;
    K.on("data", (A) => {
      !this.push(A) && K.pause && (b = !0, K.pause());
    }), K.on("end", () => {
      this.push(null);
    }), K.on("error", (A) => {
      M(this, A);
    }), K.on("close", () => {
      this.destroy();
    }), K.on("destroy", () => {
      this.destroy();
    }), this._read = () => {
      b && K.resume && (b = !1, K.resume());
    };
    const p = f(K);
    for (let A = 1; A < p.length; A++) {
      const Y = p[A];
      this[Y] === void 0 && typeof K[Y] == "function" && (this[Y] = K[Y].bind(K));
    }
    return this;
  }, Ae.prototype[m] = function() {
    return We(this);
  }, Ae.prototype.iterator = function(K) {
    return K !== void 0 && de(K, "options"), We(this, K);
  };
  function We(K, b) {
    typeof K.read != "function" && (K = Ae.wrap(K, {
      objectMode: !0
    }));
    const p = S(K, b);
    return p.stream = K, p;
  }
  async function* S(K, b) {
    let p = fe;
    function A(qe) {
      this === K ? (p(), p = fe) : p = qe;
    }
    K.on("readable", A);
    let Y;
    const ye = P(
      K,
      {
        writable: !1
      },
      (qe) => {
        Y = qe ? j(Y, qe) : null, p(), p = fe;
      }
    );
    try {
      for (; ; ) {
        const qe = K.destroyed ? null : K.read();
        if (qe !== null)
          yield qe;
        else {
          if (Y)
            throw Y;
          if (Y === null)
            return;
          await new c(A);
        }
      }
    } catch (qe) {
      throw Y = j(Y, qe), Y;
    } finally {
      (Y || (b == null ? void 0 : b.destroyOnReturn) !== !1) && (Y === void 0 || K._readableState.autoDestroy) ? T.destroyer(K, null) : (K.off("readable", A), ye());
    }
  }
  a(Ae.prototype, {
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
  }), Ae._fromList = Ie;
  function Ie(K, b) {
    if (b.length === 0) return null;
    let p;
    return b.objectMode ? p = b.buffer.shift() : !K || K >= b.length ? (b.decoder ? p = b.buffer.join("") : b.buffer.length === 1 ? p = b.buffer.first() : p = b.buffer.concat(b.length), b.buffer.clear()) : p = b.buffer.consume(K, b.decoder), p;
  }
  function Fe(K) {
    const b = K._readableState;
    E("endReadable", b.endEmitted), b.endEmitted || (b.ended = !0, t.nextTick(G, b, K));
  }
  function G(K, b) {
    if (E("endReadableNT", K.endEmitted, K.length), !K.errored && !K.closeEmitted && !K.endEmitted && K.length === 0) {
      if (K.endEmitted = !0, b.emit("end"), b.writable && b.allowHalfOpen === !1)
        t.nextTick(_e, b);
      else if (K.autoDestroy) {
        const p = b._writableState;
        (!p || p.autoDestroy && // We don't expect the writable to ever 'finish'
        // if writable is explicitly set to false.
        (p.finished || p.writable === !1)) && b.destroy();
      }
    }
  }
  function _e(K) {
    K.writable && !K.writableEnded && !K.destroyed && K.end();
  }
  Ae.from = function(K, b) {
    return ce(Ae, K, b);
  };
  let De;
  function Ze() {
    return De === void 0 && (De = {}), De;
  }
  return Ae.fromWeb = function(K, b) {
    return Ze().newStreamReadableFromReadableStream(K, b);
  }, Ae.toWeb = function(K, b) {
    return Ze().newReadableStreamFromStreamReadable(K, b);
  }, Ae.wrap = function(K, b) {
    var p, A;
    return new Ae({
      objectMode: (p = (A = K.readableObjectMode) !== null && A !== void 0 ? A : K.objectMode) !== null && p !== void 0 ? p : !0,
      ...b,
      destroy(Y, ye) {
        T.destroyer(K, Y), ye(Y);
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
    FunctionPrototypeSymbolHasInstance: o,
    ObjectDefineProperty: r,
    ObjectDefineProperties: a,
    ObjectSetPrototypeOf: f,
    StringPrototypeToLowerCase: l,
    Symbol: c,
    SymbolHasInstance: y
  } = requirePrimordials();
  writable = de, de.WritableState = D;
  const { EventEmitter: u } = requireEvents(), m = requireLegacy().Stream, { Buffer: w } = requireDist(), R = requireDestroy(), { addAbortSignal: h } = requireAddAbortSignal(), { getHighWaterMark: q, getDefaultHighWaterMark: d } = requireState(), {
    ERR_INVALID_ARG_TYPE: v,
    ERR_METHOD_NOT_IMPLEMENTED: P,
    ERR_MULTIPLE_CALLBACK: E,
    ERR_STREAM_CANNOT_PIPE: I,
    ERR_STREAM_DESTROYED: T,
    ERR_STREAM_ALREADY_FINISHED: $,
    ERR_STREAM_NULL_VALUES: x,
    ERR_STREAM_WRITE_AFTER_END: j,
    ERR_UNKNOWN_ENCODING: V
  } = requireErrors().codes, { errorOrDestroy: C } = R;
  f(de.prototype, m.prototype), f(de, m);
  function z() {
  }
  const g = c("kOnFinished");
  function D(H, se, Ee) {
    typeof Ee != "boolean" && (Ee = se instanceof requireDuplex()), this.objectMode = !!(H && H.objectMode), Ee && (this.objectMode = this.objectMode || !!(H && H.writableObjectMode)), this.highWaterMark = H ? q(this, H, "writableHighWaterMark", Ee) : d(!1), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    const Re = !!(H && H.decodeStrings === !1);
    this.decodeStrings = !Re, this.defaultEncoding = H && H.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = M.bind(void 0, se), this.writecb = null, this.writelen = 0, this.afterWriteTickInfo = null, ie(this), this.pendingcb = 0, this.constructed = !0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !H || H.emitClose !== !1, this.autoDestroy = !H || H.autoDestroy !== !1, this.errored = null, this.closed = !1, this.closeEmitted = !1, this[g] = [];
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
    if (!se && !o(de, this)) return new de(H);
    this._writableState = new D(H, this, se), H && (typeof H.write == "function" && (this._write = H.write), typeof H.writev == "function" && (this._writev = H.writev), typeof H.destroy == "function" && (this._destroy = H.destroy), typeof H.final == "function" && (this._final = H.final), typeof H.construct == "function" && (this._construct = H.construct), H.signal && h(H.signal, this)), m.call(this, H), R.construct(this, () => {
      const Ee = this._writableState;
      Ee.writing || Z(this, Ee), N(this, Ee);
    });
  }
  r(de, y, {
    __proto__: null,
    value: function(H) {
      return o(this, H) ? !0 : this !== de ? !1 : H && H._writableState instanceof D;
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
    return Pe.ending ? Oe = new j() : Pe.destroyed && (Oe = new T("write")), Oe ? (t.nextTick(Re, Oe), C(H, Oe, !0), Oe) : (Pe.pendingcb++, be(H, Pe, se, Ee, Re));
  }
  de.prototype.write = function(H, se, Ee) {
    return we(this, H, se, Ee) === !0;
  }, de.prototype.cork = function() {
    this._writableState.corked++;
  }, de.prototype.uncork = function() {
    const H = this._writableState;
    H.corked && (H.corked--, H.writing || Z(this, H));
  }, de.prototype.setDefaultEncoding = function(se) {
    if (typeof se == "string" && (se = l(se)), !w.isEncoding(se)) throw new V(se);
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
    se.writelen = Re, se.writecb = te, se.writing = !0, se.sync = !0, se.destroyed ? se.onwrite(new T("write")) : Ee ? H._writev(Pe, se.onwrite) : H._write(Pe, Oe, se.onwrite), se.sync = !1;
  }
  function fe(H, se, Ee, Re) {
    --se.pendingcb, Re(Ee), Q(se), C(H, Ee);
  }
  function M(H, se) {
    const Ee = H._writableState, Re = Ee.sync, Pe = Ee.writecb;
    if (typeof Pe != "function") {
      C(H, new E());
      return;
    }
    Ee.writing = !1, Ee.writecb = null, Ee.length -= Ee.writelen, Ee.writelen = 0, se ? (se.stack, Ee.errored || (Ee.errored = se), H._readableState && !H._readableState.errored && (H._readableState.errored = se), Re ? t.nextTick(fe, H, Ee, se, Pe) : fe(H, Ee, se, Pe)) : (Ee.buffered.length > Ee.bufferedIndex && Z(H, Ee), Re ? Ee.afterWriteTickInfo !== null && Ee.afterWriteTickInfo.cb === Pe ? Ee.afterWriteTickInfo.count++ : (Ee.afterWriteTickInfo = {
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
    se.destroyed && Q(se), N(H, se);
  }
  function Q(H) {
    if (H.writing)
      return;
    for (let Pe = H.bufferedIndex; Pe < H.buffered.length; ++Pe) {
      var se;
      const { chunk: Oe, callback: te } = H.buffered[Pe], $e = H.objectMode ? 1 : Oe.length;
      H.length -= $e, te(
        (se = H.errored) !== null && se !== void 0 ? se : new T("write")
      );
    }
    const Ee = H[g].splice(0);
    for (let Pe = 0; Pe < Ee.length; Pe++) {
      var Re;
      Ee[Pe](
        (Re = H.errored) !== null && Re !== void 0 ? Re : new T("end")
      );
    }
    ie(H);
  }
  function Z(H, se) {
    if (se.corked || se.bufferProcessing || se.destroyed || !se.constructed)
      return;
    const { buffered: Ee, bufferedIndex: Re, objectMode: Pe } = se, Oe = Ee.length - Re;
    if (!Oe)
      return;
    let te = Re;
    if (se.bufferProcessing = !0, Oe > 1 && H._writev) {
      se.pendingcb -= Oe - 1;
      const $e = se.allNoop ? z : (Ae) => {
        for (let Ue = te; Ue < Ee.length; ++Ue)
          Ee[Ue].callback(Ae);
      }, Ce = se.allNoop && te === 0 ? Ee : e(Ee, te);
      Ce.allBuffers = se.allBuffers, ce(H, se, !0, se.length, Ce, "", $e), ie(se);
    } else {
      do {
        const { chunk: $e, encoding: Ce, callback: Ae } = Ee[te];
        Ee[te++] = null;
        const Ue = Pe ? 1 : $e.length;
        ce(H, se, !1, Ue, $e, Ce, Ae);
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
    return Re.corked && (Re.corked = 1, this.uncork()), Pe || (!Re.errored && !Re.ending ? (Re.ending = !0, N(this, Re, !0), Re.ended = !0) : Re.finished ? Pe = new $("end") : Re.destroyed && (Pe = new T("end"))), typeof Ee == "function" && (Pe || Re.finished ? t.nextTick(Ee, Pe) : Re[g].push(Ee)), this;
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
        const Oe = se[g].splice(0);
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
    const Ee = se[g].splice(0);
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
    return !Ee.destroyed && (Ee.bufferedIndex < Ee.buffered.length || Ee[g].length) && t.nextTick(Q, Ee), ne.call(this, H, se), this;
  }, de.prototype._undestroy = R.undestroy, de.prototype._destroy = function(H, se) {
    se(H);
  }, de.prototype[u.captureRejectionSymbol] = function(H) {
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
    isWritable: o,
    isIterable: r,
    isNodeStream: a,
    isReadableNodeStream: f,
    isWritableNodeStream: l,
    isDuplexNodeStream: c,
    isReadableStream: y,
    isWritableStream: u
  } = requireUtils(), m = requireEndOfStream(), {
    AbortError: w,
    codes: { ERR_INVALID_ARG_TYPE: R, ERR_INVALID_RETURN_VALUE: h }
  } = requireErrors(), { destroyer: q } = requireDestroy(), d = requireDuplex(), v = requireReadable(), P = requireWritable(), { createDeferredPromise: E } = requireUtil(), I = requireFrom(), T = globalThis.Blob || e.Blob, $ = typeof T < "u" ? function(D) {
    return D instanceof T;
  } : function(D) {
    return !1;
  }, x = globalThis.AbortController || requireBrowser$2().AbortController, { FunctionPrototypeCall: j } = requirePrimordials();
  class V extends d {
    constructor(D) {
      super(D), (D == null ? void 0 : D.readable) === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), (D == null ? void 0 : D.writable) === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0);
    }
  }
  duplexify = function g(D, ie) {
    if (c(D))
      return D;
    if (f(D))
      return z({
        readable: D
      });
    if (l(D))
      return z({
        writable: D
      });
    if (a(D))
      return z({
        writable: !1,
        readable: !1
      });
    if (y(D))
      return z({
        readable: v.fromWeb(D)
      });
    if (u(D))
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
      const M = we == null ? void 0 : we.then;
      if (typeof M == "function") {
        let pe;
        const ee = j(
          M,
          we,
          (Q) => {
            if (Q != null)
              throw new h("nully", "body", Q);
          },
          (Q) => {
            q(pe, Q);
          }
        );
        return pe = new V({
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          readable: !1,
          write: be,
          final(Q) {
            ce(async () => {
              try {
                await ee, t.nextTick(Q, null);
              } catch (Z) {
                t.nextTick(Q, Z);
              }
            });
          },
          destroy: fe
        });
      }
      throw new h("Iterable, AsyncIterable or AsyncFunction", ie, we);
    }
    if ($(D))
      return g(D.arrayBuffer());
    if (r(D))
      return I(V, D, {
        // TODO (ronag): highWaterMark?
        objectMode: !0,
        writable: !1
      });
    if (y(D == null ? void 0 : D.readable) && u(D == null ? void 0 : D.writable))
      return V.fromWeb(D);
    if (typeof (D == null ? void 0 : D.writable) == "object" || typeof (D == null ? void 0 : D.readable) == "object") {
      const we = D != null && D.readable ? f(D == null ? void 0 : D.readable) ? D == null ? void 0 : D.readable : g(D.readable) : void 0, be = D != null && D.writable ? l(D == null ? void 0 : D.writable) ? D == null ? void 0 : D.writable : g(D.writable) : void 0;
      return z({
        readable: we,
        writable: be
      });
    }
    const de = D == null ? void 0 : D.then;
    if (typeof de == "function") {
      let we;
      return j(
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
  function C(g) {
    let { promise: D, resolve: ie } = E();
    const de = new x(), we = de.signal;
    return {
      value: g(
        (async function* () {
          for (; ; ) {
            const ce = D;
            D = null;
            const { chunk: fe, done: M, cb: pe } = await ce;
            if (t.nextTick(pe), M) return;
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
      write(ce, fe, M) {
        const pe = ie;
        ie = null, pe({
          chunk: ce,
          done: !1,
          cb: M
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
  function z(g) {
    const D = g.readable && typeof g.readable.read != "function" ? v.wrap(g.readable) : g.readable, ie = g.writable;
    let de = !!n(D), we = !!o(ie), be, ce, fe, M, pe;
    function ee(Q) {
      const Z = M;
      M = null, Z ? Z(Q) : Q && pe.destroy(Q);
    }
    return pe = new V({
      // TODO (ronag): highWaterMark?
      readableObjectMode: !!(D != null && D.readableObjectMode),
      writableObjectMode: !!(ie != null && ie.writableObjectMode),
      readable: de,
      writable: we
    }), we && (m(ie, (Q) => {
      we = !1, Q && q(D, Q), ee(Q);
    }), pe._write = function(Q, Z, le) {
      ie.write(Q, Z) ? le() : be = le;
    }, pe._final = function(Q) {
      ie.end(), ce = Q;
    }, ie.on("drain", function() {
      if (be) {
        const Q = be;
        be = null, Q();
      }
    }), ie.on("finish", function() {
      if (ce) {
        const Q = ce;
        ce = null, Q();
      }
    })), de && (m(D, (Q) => {
      de = !1, Q && q(D, Q), ee(Q);
    }), D.on("readable", function() {
      if (fe) {
        const Q = fe;
        fe = null, Q();
      }
    }), D.on("end", function() {
      pe.push(null);
    }), pe._read = function() {
      for (; ; ) {
        const Q = D.read();
        if (Q === null) {
          fe = pe._read;
          return;
        }
        if (!pe.push(Q))
          return;
      }
    }), pe._destroy = function(Q, Z) {
      !Q && M !== null && (Q = new w()), fe = null, be = null, ce = null, M === null ? Z(Q) : (M = Z, q(ie, Q), q(D, Q));
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
    ObjectSetPrototypeOf: o
  } = requirePrimordials();
  duplex = f;
  const r = requireReadable(), a = requireWritable();
  o(f.prototype, r.prototype), o(f, r);
  {
    const u = n(a.prototype);
    for (let m = 0; m < u.length; m++) {
      const w = u[m];
      f.prototype[w] || (f.prototype[w] = a.prototype[w]);
    }
  }
  function f(u) {
    if (!(this instanceof f)) return new f(u);
    r.call(this, u), a.call(this, u), u ? (this.allowHalfOpen = u.allowHalfOpen !== !1, u.readable === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), u.writable === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0)) : this.allowHalfOpen = !0;
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
      set(u) {
        this._readableState && this._writableState && (this._readableState.destroyed = u, this._writableState.destroyed = u);
      }
    }
  });
  let l;
  function c() {
    return l === void 0 && (l = {}), l;
  }
  f.fromWeb = function(u, m) {
    return c().newStreamDuplexFromReadableWritablePair(u, m);
  }, f.toWeb = function(u) {
    return c().newReadableWritablePairFromDuplex(u);
  };
  let y;
  return f.from = function(u) {
    return y || (y = requireDuplexify()), y(u, "body");
  }, duplex;
}
var transform, hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform;
  hasRequiredTransform = 1;
  const { ObjectSetPrototypeOf: t, Symbol: e } = requirePrimordials();
  transform = f;
  const { ERR_METHOD_NOT_IMPLEMENTED: n } = requireErrors().codes, o = requireDuplex(), { getHighWaterMark: r } = requireState();
  t(f.prototype, o.prototype), t(f, o);
  const a = e("kCallback");
  function f(y) {
    if (!(this instanceof f)) return new f(y);
    const u = y ? r(this, y, "readableHighWaterMark", !0) : null;
    u === 0 && (y = {
      ...y,
      highWaterMark: null,
      readableHighWaterMark: u,
      // TODO (ronag): 0 is not optimal since we have
      // a "bug" where we check needDrain before calling _write and not after.
      // Refs: https://github.com/nodejs/node/pull/32887
      // Refs: https://github.com/nodejs/node/pull/35941
      writableHighWaterMark: y.writableHighWaterMark || 0
    }), o.call(this, y), this._readableState.sync = !1, this[a] = null, y && (typeof y.transform == "function" && (this._transform = y.transform), typeof y.flush == "function" && (this._flush = y.flush)), this.on("prefinish", c);
  }
  function l(y) {
    typeof this._flush == "function" && !this.destroyed ? this._flush((u, m) => {
      if (u) {
        y ? y(u) : this.destroy(u);
        return;
      }
      m != null && this.push(m), this.push(null), y && y();
    }) : (this.push(null), y && y());
  }
  function c() {
    this._final !== l && l.call(this);
  }
  return f.prototype._final = l, f.prototype._transform = function(y, u, m) {
    throw new n("_transform()");
  }, f.prototype._write = function(y, u, m) {
    const w = this._readableState, R = this._writableState, h = w.length;
    this._transform(y, u, (q, d) => {
      if (q) {
        m(q);
        return;
      }
      d != null && this.push(d), R.ended || // Backwards compat.
      h === w.length || // Backwards compat.
      w.length < w.highWaterMark ? m() : this[a] = m;
    });
  }, f.prototype._read = function() {
    if (this[a]) {
      const y = this[a];
      this[a] = null, y();
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
  function n(o) {
    if (!(this instanceof n)) return new n(o);
    e.call(this, o);
  }
  return n.prototype._transform = function(o, r, a) {
    a(null, o);
  }, passthrough;
}
var pipeline_1, hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  const t = requireBrowser$1(), { ArrayIsArray: e, Promise: n, SymbolAsyncIterator: o, SymbolDispose: r } = requirePrimordials(), a = requireEndOfStream(), { once: f } = requireUtil(), l = requireDestroy(), c = requireDuplex(), {
    aggregateTwoErrors: y,
    codes: {
      ERR_INVALID_ARG_TYPE: u,
      ERR_INVALID_RETURN_VALUE: m,
      ERR_MISSING_ARGS: w,
      ERR_STREAM_DESTROYED: R,
      ERR_STREAM_PREMATURE_CLOSE: h
    },
    AbortError: q
  } = requireErrors(), { validateFunction: d, validateAbortSignal: v } = requireValidators(), {
    isIterable: P,
    isReadable: E,
    isReadableNodeStream: I,
    isNodeStream: T,
    isTransformStream: $,
    isWebStream: x,
    isReadableStream: j,
    isReadableFinished: V
  } = requireUtils(), C = globalThis.AbortController || requireBrowser$2().AbortController;
  let z, g, D;
  function ie(Q, Z, le) {
    let O = !1;
    Q.on("close", () => {
      O = !0;
    });
    const B = a(
      Q,
      {
        readable: Z,
        writable: le
      },
      (N) => {
        O = !N;
      }
    );
    return {
      destroy: (N) => {
        O || (O = !0, l.destroyer(Q, N || new R("pipe")));
      },
      cleanup: B
    };
  }
  function de(Q) {
    return d(Q[Q.length - 1], "streams[stream.length - 1]"), Q.pop();
  }
  function we(Q) {
    if (P(Q))
      return Q;
    if (I(Q))
      return be(Q);
    throw new u("val", ["Readable", "Iterable", "AsyncIterable"], Q);
  }
  async function* be(Q) {
    g || (g = requireReadable()), yield* g.prototype[o].call(Q);
  }
  async function ce(Q, Z, le, { end: O }) {
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
    Z.on("drain", re);
    const F = a(
      Z,
      {
        readable: !1
      },
      re
    );
    try {
      Z.writableNeedDrain && await ne();
      for await (const L of Q)
        Z.write(L) || await ne();
      O && (Z.end(), await ne()), le();
    } catch (L) {
      le(B !== L ? y(B, L) : L);
    } finally {
      F(), Z.off("drain", re);
    }
  }
  async function fe(Q, Z, le, { end: O }) {
    $(Z) && (Z = Z.writable);
    const B = Z.getWriter();
    try {
      for await (const N of Q)
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
  function M(...Q) {
    return pe(Q, f(de(Q)));
  }
  function pe(Q, Z, le) {
    if (Q.length === 1 && e(Q[0]) && (Q = Q[0]), Q.length < 2)
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
    function Pe(Ce, Ae) {
      var Ue;
      if (Ce && (!L || L.code === "ERR_STREAM_PREMATURE_CLOSE") && (L = Ce), !(!L && !Ae)) {
        for (; se.length; )
          se.shift()(L);
        (Ue = F) === null || Ue === void 0 || Ue[r](), O.abort(), Ae && (L || re.forEach((ge) => ge()), t.nextTick(Z, L, H));
      }
    }
    let Oe;
    for (let Ce = 0; Ce < Q.length; Ce++) {
      const Ae = Q[Ce], Ue = Ce < Q.length - 1, ge = Ce > 0, Se = Ue || (le == null ? void 0 : le.end) !== !1, Le = Ce === Q.length - 1;
      if (T(Ae)) {
        let je = function(ke) {
          ke && ke.name !== "AbortError" && ke.code !== "ERR_STREAM_PREMATURE_CLOSE" && Re(ke);
        };
        if (Se) {
          const { destroy: ke, cleanup: He } = ie(Ae, Ue, ge);
          se.push(ke), E(Ae) && Le && re.push(He);
        }
        Ae.on("error", je), E(Ae) && Le && re.push(() => {
          Ae.removeListener("error", je);
        });
      }
      if (Ce === 0)
        if (typeof Ae == "function") {
          if (Oe = Ae({
            signal: B
          }), !P(Oe))
            throw new m("Iterable, AsyncIterable or Stream", "source", Oe);
        } else P(Ae) || I(Ae) || $(Ae) ? Oe = Ae : Oe = c.from(Ae);
      else if (typeof Ae == "function") {
        if ($(Oe)) {
          var te;
          Oe = we((te = Oe) === null || te === void 0 ? void 0 : te.readable);
        } else
          Oe = we(Oe);
        if (Oe = Ae(Oe, {
          signal: B
        }), Ue) {
          if (!P(Oe, !0))
            throw new m("AsyncIterable", `transform[${Ce - 1}]`, Oe);
        } else {
          var $e;
          z || (z = requirePassthrough());
          const je = new z({
            objectMode: !0
          }), ke = ($e = Oe) === null || $e === void 0 ? void 0 : $e.then;
          if (typeof ke == "function")
            Ee++, ke.call(
              Oe,
              (s) => {
                H = s, s != null && je.write(s), Se && je.end(), t.nextTick(Re);
              },
              (s) => {
                je.destroy(s), t.nextTick(Re, s);
              }
            );
          else if (P(Oe, !0))
            Ee++, ce(Oe, je, Re, {
              end: Se
            });
          else if (j(Oe) || $(Oe)) {
            const s = Oe.readable || Oe;
            Ee++, ce(s, je, Re, {
              end: Se
            });
          } else
            throw new m("AsyncIterable or Promise", "destination", Oe);
          Oe = je;
          const { destroy: He, cleanup: U } = ie(Oe, !1, !0);
          se.push(He), Le && re.push(U);
        }
      } else if (T(Ae)) {
        if (I(Oe)) {
          Ee += 2;
          const je = ee(Oe, Ae, Re, {
            end: Se
          });
          E(Ae) && Le && re.push(je);
        } else if ($(Oe) || j(Oe)) {
          const je = Oe.readable || Oe;
          Ee++, ce(je, Ae, Re, {
            end: Se
          });
        } else if (P(Oe))
          Ee++, ce(Oe, Ae, Re, {
            end: Se
          });
        else
          throw new u(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Ae;
      } else if (x(Ae)) {
        if (I(Oe))
          Ee++, fe(we(Oe), Ae, Re, {
            end: Se
          });
        else if (j(Oe) || P(Oe))
          Ee++, fe(Oe, Ae, Re, {
            end: Se
          });
        else if ($(Oe))
          Ee++, fe(Oe.readable, Ae, Re, {
            end: Se
          });
        else
          throw new u(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Ae;
      } else
        Oe = c.from(Ae);
    }
    return (B != null && B.aborted || N != null && N.aborted) && t.nextTick(ne), Oe;
  }
  function ee(Q, Z, le, { end: O }) {
    let B = !1;
    if (Z.on("close", () => {
      B || le(new h());
    }), Q.pipe(Z, {
      end: !1
    }), O) {
      let N = function() {
        B = !0, Z.end();
      };
      V(Q) ? t.nextTick(N) : Q.once("end", N);
    } else
      le();
    return a(
      Q,
      {
        readable: !0,
        writable: !1
      },
      (N) => {
        const re = Q._readableState;
        N && N.code === "ERR_STREAM_PREMATURE_CLOSE" && re && re.ended && !re.errored && !re.errorEmitted ? Q.once("end", le).once("error", le) : le(N);
      }
    ), a(
      Z,
      {
        readable: !1,
        writable: !0
      },
      le
    );
  }
  return pipeline_1 = {
    pipelineImpl: pe,
    pipeline: M
  }, pipeline_1;
}
var compose, hasRequiredCompose;
function requireCompose() {
  if (hasRequiredCompose) return compose;
  hasRequiredCompose = 1;
  const { pipeline: t } = requirePipeline(), e = requireDuplex(), { destroyer: n } = requireDestroy(), {
    isNodeStream: o,
    isReadable: r,
    isWritable: a,
    isWebStream: f,
    isTransformStream: l,
    isWritableStream: c,
    isReadableStream: y
  } = requireUtils(), {
    AbortError: u,
    codes: { ERR_INVALID_ARG_VALUE: m, ERR_MISSING_ARGS: w }
  } = requireErrors(), R = requireEndOfStream();
  return compose = function(...q) {
    if (q.length === 0)
      throw new w("streams");
    if (q.length === 1)
      return e.from(q[0]);
    const d = [...q];
    if (typeof q[0] == "function" && (q[0] = e.from(q[0])), typeof q[q.length - 1] == "function") {
      const z = q.length - 1;
      q[z] = e.from(q[z]);
    }
    for (let z = 0; z < q.length; ++z)
      if (!(!o(q[z]) && !f(q[z]))) {
        if (z < q.length - 1 && !(r(q[z]) || y(q[z]) || l(q[z])))
          throw new m(`streams[${z}]`, d[z], "must be readable");
        if (z > 0 && !(a(q[z]) || c(q[z]) || l(q[z])))
          throw new m(`streams[${z}]`, d[z], "must be writable");
      }
    let v, P, E, I, T;
    function $(z) {
      const g = I;
      I = null, g ? g(z) : z ? T.destroy(z) : !C && !V && T.destroy();
    }
    const x = q[0], j = t(q, $), V = !!(a(x) || c(x) || l(x)), C = !!(r(j) || y(j) || l(j));
    if (T = new e({
      // TODO (ronag): highWaterMark?
      writableObjectMode: !!(x != null && x.writableObjectMode),
      readableObjectMode: !!(j != null && j.readableObjectMode),
      writable: V,
      readable: C
    }), V) {
      if (o(x))
        T._write = function(g, D, ie) {
          x.write(g, D) ? ie() : v = ie;
        }, T._final = function(g) {
          x.end(), P = g;
        }, x.on("drain", function() {
          if (v) {
            const g = v;
            v = null, g();
          }
        });
      else if (f(x)) {
        const D = (l(x) ? x.writable : x).getWriter();
        T._write = async function(ie, de, we) {
          try {
            await D.ready, D.write(ie).catch(() => {
            }), we();
          } catch (be) {
            we(be);
          }
        }, T._final = async function(ie) {
          try {
            await D.ready, D.close().catch(() => {
            }), P = ie;
          } catch (de) {
            ie(de);
          }
        };
      }
      const z = l(j) ? j.readable : j;
      R(z, () => {
        if (P) {
          const g = P;
          P = null, g();
        }
      });
    }
    if (C) {
      if (o(j))
        j.on("readable", function() {
          if (E) {
            const z = E;
            E = null, z();
          }
        }), j.on("end", function() {
          T.push(null);
        }), T._read = function() {
          for (; ; ) {
            const z = j.read();
            if (z === null) {
              E = T._read;
              return;
            }
            if (!T.push(z))
              return;
          }
        };
      else if (f(j)) {
        const g = (l(j) ? j.readable : j).getReader();
        T._read = async function() {
          for (; ; )
            try {
              const { value: D, done: ie } = await g.read();
              if (!T.push(D))
                return;
              if (ie) {
                T.push(null);
                return;
              }
            } catch {
              return;
            }
        };
      }
    }
    return T._destroy = function(z, g) {
      !z && I !== null && (z = new u()), E = null, v = null, P = null, I === null ? g(z) : (I = g, o(j) && n(j, z));
    }, T;
  }, compose;
}
var hasRequiredOperators;
function requireOperators() {
  if (hasRequiredOperators) return operators;
  hasRequiredOperators = 1;
  const t = globalThis.AbortController || requireBrowser$2().AbortController, {
    codes: { ERR_INVALID_ARG_VALUE: e, ERR_INVALID_ARG_TYPE: n, ERR_MISSING_ARGS: o, ERR_OUT_OF_RANGE: r },
    AbortError: a
  } = requireErrors(), { validateAbortSignal: f, validateInteger: l, validateObject: c } = requireValidators(), y = requirePrimordials().Symbol("kWeak"), u = requirePrimordials().Symbol("kResistStopPropagation"), { finished: m } = requireEndOfStream(), w = requireCompose(), { addAbortSignalNoValidate: R } = requireAddAbortSignal(), { isWritable: h, isNodeStream: q } = requireUtils(), { deprecate: d } = requireUtil(), {
    ArrayPrototypePush: v,
    Boolean: P,
    MathFloor: E,
    Number: I,
    NumberIsNaN: T,
    Promise: $,
    PromiseReject: x,
    PromiseResolve: j,
    PromisePrototypeThen: V,
    Symbol: C
  } = requirePrimordials(), z = C("kEmpty"), g = C("kEof");
  function D(N, re) {
    if (re != null && c(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), q(N) && !h(N))
      throw new e("stream", N, "must be writable");
    const ne = w(this, N);
    return re != null && re.signal && R(re.signal, ne), ne;
  }
  function ie(N, re) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    re != null && c(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal");
    let ne = 1;
    (re == null ? void 0 : re.concurrency) != null && (ne = E(re.concurrency));
    let F = ne - 1;
    return (re == null ? void 0 : re.highWaterMark) != null && (F = E(re.highWaterMark)), l(ne, "options.concurrency", 1), l(F, "options.highWaterMark", 0), F += ne, (async function* () {
      const H = requireUtil().AbortSignalAny(
        [re == null ? void 0 : re.signal].filter(P)
      ), se = this, Ee = [], Re = {
        signal: H
      };
      let Pe, Oe, te = !1, $e = 0;
      function Ce() {
        te = !0, Ae();
      }
      function Ae() {
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
              Se = j(Se);
            } catch (Le) {
              Se = x(Le);
            }
            $e += 1, V(Se, Ae, Ce), Ee.push(Se), Pe && (Pe(), Pe = null), !te && (Ee.length >= F || $e >= ne) && await new $((Le) => {
              Oe = Le;
            });
          }
          Ee.push(g);
        } catch (Se) {
          const Le = x(Se);
          V(Le, Ae, Ce), Ee.push(Le);
        } finally {
          te = !0, Pe && (Pe(), Pe = null);
        }
      }
      ge();
      try {
        for (; ; ) {
          for (; Ee.length > 0; ) {
            const Se = await Ee[0];
            if (Se === g)
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
    return N != null && c(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal"), (async function* () {
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
    for await (const ne of M.call(this, N, re))
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
    for await (const ne of M.call(this, N, re))
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
  function M(N, re) {
    if (typeof N != "function")
      throw new n("fn", ["Function", "AsyncFunction"], N);
    async function ne(F, L) {
      return await N(F, L) ? F : z;
    }
    return ie.call(this, ne, re);
  }
  class pe extends o {
    constructor() {
      super("reduce"), this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function ee(N, re, ne) {
    var F;
    if (typeof N != "function")
      throw new n("reducer", ["Function", "AsyncFunction"], N);
    ne != null && c(ne, "options"), (ne == null ? void 0 : ne.signal) != null && f(ne.signal, "options.signal");
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
        [y]: this,
        [u]: !0
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
  async function Q(N) {
    N != null && c(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal");
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
  function Z(N, re) {
    const ne = ie.call(this, N, re);
    return (async function* () {
      for await (const L of ne)
        yield* L;
    }).call(this);
  }
  function le(N) {
    if (N = I(N), T(N))
      return 0;
    if (N < 0)
      throw new r("number", ">= 0", N);
    return N;
  }
  function O(N, re = void 0) {
    return re != null && c(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = le(N), (async function* () {
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
    return re != null && c(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = le(N), (async function* () {
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
    asIndexedPairs: d(de, "readable.asIndexedPairs will be removed in a future version."),
    drop: O,
    filter: M,
    flatMap: Z,
    map: ie,
    take: B,
    compose: D
  }, operators.promiseReturningOperators = {
    every: be,
    forEach: fe,
    reduce: ee,
    toArray: Q,
    some: we,
    find: ce
  }, operators;
}
var promises, hasRequiredPromises;
function requirePromises() {
  if (hasRequiredPromises) return promises;
  hasRequiredPromises = 1;
  const { ArrayPrototypePop: t, Promise: e } = requirePrimordials(), { isIterable: n, isNodeStream: o, isWebStream: r } = requireUtils(), { pipelineImpl: a } = requirePipeline(), { finished: f } = requireEndOfStream();
  requireStream();
  function l(...c) {
    return new e((y, u) => {
      let m, w;
      const R = c[c.length - 1];
      if (R && typeof R == "object" && !o(R) && !n(R) && !r(R)) {
        const h = t(c);
        m = h.signal, w = h.end;
      }
      a(
        c,
        (h, q) => {
          h ? u(h) : y(q);
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
    pipeline: l
  }, promises;
}
var hasRequiredStream;
function requireStream() {
  if (hasRequiredStream) return stream.exports;
  hasRequiredStream = 1;
  const { Buffer: t } = requireDist(), { ObjectDefineProperty: e, ObjectKeys: n, ReflectApply: o } = requirePrimordials(), {
    promisify: { custom: r }
  } = requireUtil(), { streamReturningOperators: a, promiseReturningOperators: f } = requireOperators(), {
    codes: { ERR_ILLEGAL_CONSTRUCTOR: l }
  } = requireErrors(), c = requireCompose(), { setDefaultHighWaterMark: y, getDefaultHighWaterMark: u } = requireState(), { pipeline: m } = requirePipeline(), { destroyer: w } = requireDestroy(), R = requireEndOfStream(), h = requirePromises(), q = requireUtils(), d = stream.exports = requireLegacy().Stream;
  d.isDestroyed = q.isDestroyed, d.isDisturbed = q.isDisturbed, d.isErrored = q.isErrored, d.isReadable = q.isReadable, d.isWritable = q.isWritable, d.Readable = requireReadable();
  for (const P of n(a)) {
    let I = function(...T) {
      if (new.target)
        throw l();
      return d.Readable.from(o(E, this, T));
    };
    const E = a[P];
    e(I, "name", {
      __proto__: null,
      value: E.name
    }), e(I, "length", {
      __proto__: null,
      value: E.length
    }), e(d.Readable.prototype, P, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  for (const P of n(f)) {
    let I = function(...T) {
      if (new.target)
        throw l();
      return o(E, this, T);
    };
    const E = f[P];
    e(I, "name", {
      __proto__: null,
      value: E.name
    }), e(I, "length", {
      __proto__: null,
      value: E.length
    }), e(d.Readable.prototype, P, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  d.Writable = requireWritable(), d.Duplex = requireDuplex(), d.Transform = requireTransform(), d.PassThrough = requirePassthrough(), d.pipeline = m;
  const { addAbortSignal: v } = requireAddAbortSignal();
  return d.addAbortSignal = v, d.finished = R, d.destroy = w, d.compose = c, d.setDefaultHighWaterMark = y, d.getDefaultHighWaterMark = u, e(d, "promises", {
    __proto__: null,
    configurable: !0,
    enumerable: !0,
    get() {
      return h;
    }
  }), e(m, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return h.pipeline;
    }
  }), e(R, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return h.finished;
    }
  }), d.Stream = d, d._isUint8Array = function(E) {
    return E instanceof Uint8Array;
  }, d._uint8ArrayToBuffer = function(E) {
    return t.from(E.buffer, E.byteOffset, E.byteLength);
  }, stream.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  return hasRequiredBrowser || (hasRequiredBrowser = 1, (function(t) {
    const e = requireStream(), n = requirePromises(), o = e.Readable.destroy;
    t.exports = e.Readable, t.exports._uint8ArrayToBuffer = e._uint8ArrayToBuffer, t.exports._isUint8Array = e._isUint8Array, t.exports.isDisturbed = e.isDisturbed, t.exports.isErrored = e.isErrored, t.exports.isReadable = e.isReadable, t.exports.Readable = e.Readable, t.exports.Writable = e.Writable, t.exports.Duplex = e.Duplex, t.exports.Transform = e.Transform, t.exports.PassThrough = e.PassThrough, t.exports.addAbortSignal = e.addAbortSignal, t.exports.finished = e.finished, t.exports.destroy = e.destroy, t.exports.destroy = o, t.exports.pipeline = e.pipeline, t.exports.compose = e.compose, Object.defineProperty(e, "promises", {
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
    _transform(a, f, l) {
      let c;
      try {
        c = this.createPacketBuffer(a);
      } catch (y) {
        return l(y);
      }
      return this.push(c), l();
    }
  }
  class n extends t {
    constructor(a, f) {
      super({ readableObjectMode: !0 }), this.proto = a, this.mainType = f, this.queue = Buffer.alloc(0);
    }
    parsePacketBuffer(a) {
      return this.proto.parsePacketBuffer(this.mainType, a);
    }
    _transform(a, f, l) {
      for (this.queue = Buffer.concat([this.queue, a]); ; ) {
        let c;
        try {
          c = this.parsePacketBuffer(this.queue);
        } catch (y) {
          return y.partialReadError ? l() : (y.buffer = this.queue, this.queue = Buffer.alloc(0), l(y));
        }
        this.push(c), this.queue = this.queue.slice(c.metadata.size);
      }
    }
  }
  class o extends t {
    constructor(a, f, l = !1) {
      super({ readableObjectMode: !0 }), this.proto = a, this.mainType = f, this.noErrorLogging = l;
    }
    parsePacketBuffer(a) {
      return this.proto.parsePacketBuffer(this.mainType, a);
    }
    _transform(a, f, l) {
      let c;
      try {
        c = this.parsePacketBuffer(a), c.metadata.size !== a.length && !this.noErrorLogging && console.log("Chunk size is " + a.length + " but only " + c.metadata.size + " was read ; partial packet : " + JSON.stringify(c.data) + "; buffer :" + a.toString("hex"));
      } catch (y) {
        return y.partialReadError ? (this.noErrorLogging || console.log(y.stack), l()) : l(y);
      }
      this.push(c), l();
    }
  }
  return serializer = {
    Serializer: e,
    Parser: n,
    FullPacketParser: o
  }, serializer;
}
var compilerConditional, hasRequiredCompilerConditional;
function requireCompilerConditional() {
  return hasRequiredCompilerConditional || (hasRequiredCompilerConditional = 1, compilerConditional = {
    Read: {
      switch: ["parametrizable", (t, e) => {
        let n = e.compareTo ? e.compareTo : e.compareToValue;
        const o = [];
        n.startsWith("$") ? o.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType(e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType(e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, o);
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
        const o = [];
        n.startsWith("$") ? o.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, o);
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
        const o = [];
        n.startsWith("$") ? o.push(n) : e.compareTo && (n = t.getField(n, !0));
        let r = `switch (${n}) {
`;
        for (const a in e.fields) {
          let f = a;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[a])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, o);
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
      array: ["parametrizable", (n, o) => {
        let r = "";
        if (o.countType)
          r += "const { value: count, size: countSize } = " + n.callType(o.countType) + `
`;
        else if (o.count)
          r += "const count = " + o.count + `
`, r += `const countSize = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return r += `if (count > 0xffffff && !ctx.noArraySizeCheck) throw new Error("array size is abnormally large, not reading: " + count)
`, r += `const data = []
`, r += `let size = countSize
`, r += `for (let i = 0; i < count; i++) {
`, r += "  const elem = " + n.callType(o.type, "offset + size") + `
`, r += `  data.push(elem.value)
`, r += `  size += elem.size
`, r += `}
`, r += "return { value: data, size }", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, o) => {
        const r = "return " + n.callType(o.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, o) => {
        o = e(o);
        let r = "", a = "offset";
        const f = [];
        for (const c in o) {
          const { type: y, name: u, anon: m, _shouldBeInlined: w } = o[c];
          let R, h;
          if (y instanceof Array && y[0] === "bitfield" && m) {
            const q = [];
            for (const { name: d } of y[1]) {
              const v = n.getField(d);
              d === v ? (f.push(d), q.push(d)) : (f.push(`${d}: ${v}`), q.push(`${d}: ${v}`));
            }
            R = "{" + q.join(", ") + "}", h = `anon${c}Size`;
          } else
            R = n.getField(u), h = `${R}Size`, w ? f.push("..." + u) : u === R ? f.push(u) : f.push(`${u}: ${R}`);
          r += `let { value: ${R}, size: ${h} } = ` + n.callType(y, a) + `
`, a += ` + ${h}`;
        }
        const l = a.split(" + ");
        return l.shift(), l.length === 0 && l.push("0"), r += "return { value: { " + f.join(", ") + " }, size: " + l.join(" + ") + "}", n.wrapCode(r);
      }]
    },
    Write: {
      array: ["parametrizable", (n, o) => {
        let r = "";
        if (o.countType)
          r += "offset = " + n.callType("value.length", o.countType) + `
`;
        else if (o.count === null)
          throw new Error("Array must contain either count or countType");
        return r += `for (let i = 0; i < value.length; i++) {
`, r += "  offset = " + n.callType("value[i]", o.type) + `
`, r += `}
`, r += "return offset", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, o) => {
        const r = "return " + n.callType("value", o.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, o) => {
        o = e(o);
        let r = "";
        for (const a in o) {
          const { type: f, name: l, anon: c, _shouldBeInlined: y } = o[a];
          let u;
          if (f instanceof Array && f[0] === "bitfield" && c) {
            const m = [];
            for (const { name: w } of f[1]) {
              const R = n.getField(w);
              r += `const ${R} = value.${w}
`, w === R ? m.push(w) : m.push(`${w}: ${R}`);
            }
            u = "{" + m.join(", ") + "}";
          } else
            u = n.getField(l), y ? r += `let ${l} = value
` : r += `let ${u} = value.${l}
`;
          r += "offset = " + n.callType(u, f) + `
`;
        }
        return r += "return offset", n.wrapCode(r);
      }]
    },
    SizeOf: {
      array: ["parametrizable", (n, o) => {
        let r = "";
        if (o.countType)
          r += "let size = " + n.callType("value.length", o.countType) + `
`;
        else if (o.count)
          r += `let size = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return isNaN(n.callType("value[i]", o.type)) ? (r += `for (let i = 0; i < value.length; i++) {
`, r += "  size += " + n.callType("value[i]", o.type) + `
`, r += `}
`) : r += "size += value.length * " + n.callType("value[i]", o.type) + `
`, r += "return size", n.wrapCode(r);
      }],
      count: ["parametrizable", (n, o) => {
        const r = "return " + n.callType("value", o.type);
        return n.wrapCode(r);
      }],
      container: ["parametrizable", (n, o) => {
        o = e(o);
        let r = `let size = 0
`;
        for (const a in o) {
          const { type: f, name: l, anon: c, _shouldBeInlined: y } = o[a];
          let u;
          if (f instanceof Array && f[0] === "bitfield" && c) {
            const m = [];
            for (const { name: w } of f[1]) {
              const R = n.getField(w);
              r += `const ${R} = value.${w}
`, w === R ? m.push(w) : m.push(`${w}: ${R}`);
            }
            u = "{" + m.join(", ") + "}";
          } else
            u = n.getField(l), y ? r += `let ${l} = value
` : r += `let ${u} = value.${l}
`;
          r += "size += " + n.callType(u, f) + `
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
    const o = [];
    for (const r in n) {
      const { type: a, anon: f } = n[r];
      if (f && !(a instanceof Array && a[0] === "bitfield"))
        if (a instanceof Array && a[0] === "container")
          for (const l in a[1]) o.push(a[1][l]);
        else if (a instanceof Array && a[0] === "switch")
          o.push({
            name: t(),
            _shouldBeInlined: !0,
            type: a
          });
        else
          throw new Error("Cannot inline anonymous type: " + a);
      else
        o.push(n[r]);
    }
    return o;
  }
  return compilerStructures;
}
var compilerUtils, hasRequiredCompilerUtils;
function requireCompilerUtils() {
  if (hasRequiredCompilerUtils) return compilerUtils;
  hasRequiredCompilerUtils = 1, compilerUtils = {
    Read: {
      pstring: ["parametrizable", (o, r) => {
        let a = "";
        if (r.countType)
          a += "const { value: count, size: countSize } = " + o.callType(r.countType) + `
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
`, a += `return { value: buffer.toString("${r.encoding || "utf8"}", offset, offset + count), size: count + countSize }`, o.wrapCode(a);
      }],
      buffer: ["parametrizable", (o, r) => {
        let a = "";
        if (r.countType)
          a += "const { value: count, size: countSize } = " + o.callType(r.countType) + `
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
`, a += "return { value: buffer.slice(offset, offset + count), size: count + countSize }", o.wrapCode(a);
      }],
      bitfield: ["parametrizable", (o, r) => {
        let a = "";
        const f = Math.ceil(r.reduce((y, { size: u }) => y + u, 0) / 8);
        a += `if ( offset + ${f} > buffer.length) { throw new PartialReadError() }
`;
        const l = [];
        let c = 8;
        a += `let bits = buffer[offset++]
`;
        for (const y in r) {
          const { name: u, size: m, signed: w } = r[y], R = o.getField(u);
          for (; c < m; )
            c += 8, a += `bits = (bits << 8) | buffer[offset++]
`;
          a += `let ${R} = (bits >> ` + (c - m) + ") & 0x" + ((1 << m) - 1).toString(16) + `
`, w && (a += `${R} -= (${R} & 0x` + (1 << m - 1).toString(16) + `) << 1
`), c -= m, u === R ? l.push(u) : l.push(`${u}: ${R}`);
        }
        return a += "return { value: { " + l.join(", ") + ` }, size: ${f} }`, o.wrapCode(a);
      }],
      bitflags: ["parametrizable", (o, { type: r, flags: a, shift: f, big: l }) => {
        let c = JSON.stringify(a);
        if (Array.isArray(a)) {
          c = "{";
          for (const [y, u] of Object.entries(a)) c += `"${u}": ${l ? 1n << BigInt(y) : 1 << y}` + (l ? "n," : ",");
          c += "}";
        } else if (f) {
          c = "{";
          for (const y in a) c += `"${y}": ${1 << a[y]}${l ? "n," : ","}`;
          c += "}";
        }
        return o.wrapCode(`
const { value: _value, size } = ${o.callType(r, "offset")}
const value = { _value }
const flags = ${c}
for (const key in flags) {
  value[key] = (_value & flags[key]) == flags[key]
}
return { value, size }
      `.trim());
      }],
      mapper: ["parametrizable", (o, r) => {
        let a = "const { value, size } = " + o.callType(r.type) + `
`;
        return a += "return { value: " + JSON.stringify(t(r.mappings)) + "[value] || value, size }", o.wrapCode(a);
      }]
    },
    Write: {
      pstring: ["parametrizable", (o, r) => {
        let a = `const length = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          a += "offset = " + o.callType("length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return a += `buffer.write(value, offset, length, "${r.encoding || "utf8"}")
`, a += "return offset + length", o.wrapCode(a);
      }],
      buffer: ["parametrizable", (o, r) => {
        let a = `if (!(value instanceof Buffer)) value = Buffer.from(value)
`;
        if (r.countType)
          a += "offset = " + o.callType("value.length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return a += `value.copy(buffer, offset)
`, a += "return offset + value.length", o.wrapCode(a);
      }],
      bitfield: ["parametrizable", (o, r) => {
        let a = "", f = 0, l = "";
        for (const c in r) {
          let { name: y, size: u } = r[c];
          const m = o.getField(y);
          for (l += `let ${m} = value.${y}
`; u > 0; ) {
            const w = Math.min(8 - f, u), R = (1 << w) - 1;
            a !== "" && (a = `((${a}) << ${w}) | `), a += `((${m} >> ` + (u - w) + ") & 0x" + R.toString(16) + ")", u -= w, f += w, f === 8 && (l += "buffer[offset++] = " + a + `
`, f = 0, a = "");
          }
        }
        return f !== 0 && (l += "buffer[offset++] = (" + a + ") << " + (8 - f) + `
`), l += "return offset", o.wrapCode(l);
      }],
      bitflags: ["parametrizable", (o, { type: r, flags: a, shift: f, big: l }) => {
        let c = JSON.stringify(a);
        if (Array.isArray(a)) {
          c = "{";
          for (const [y, u] of Object.entries(a)) c += `"${u}": ${l ? 1n << BigInt(y) : 1 << y}` + (l ? "n," : ",");
          c += "}";
        } else if (f) {
          c = "{";
          for (const y in a) c += `"${y}": ${1 << a[y]}${l ? "n," : ","}`;
          c += "}";
        }
        return o.wrapCode(`
const flags = ${c}
let val = value._value ${l ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val, buffer, offset)
      `.trim());
      }],
      mapper: ["parametrizable", (o, r) => {
        const a = JSON.stringify(e(r.mappings)), f = "return " + o.callType(`${a}[value] || value`, r.type);
        return o.wrapCode(f);
      }]
    },
    SizeOf: {
      pstring: ["parametrizable", (o, r) => {
        let a = `let size = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          a += "size += " + o.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return a += "return size", o.wrapCode(a);
      }],
      buffer: ["parametrizable", (o, r) => {
        let a = `let size = value instanceof Buffer ? value.length : Buffer.from(value).length
`;
        if (r.countType)
          a += "size += " + o.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return a += "return size", o.wrapCode(a);
      }],
      bitfield: ["parametrizable", (o, r) => `${Math.ceil(r.reduce((f, { size: l }) => f + l, 0) / 8)}`],
      bitflags: ["parametrizable", (o, { type: r, flags: a, shift: f, big: l }) => {
        let c = JSON.stringify(a);
        if (Array.isArray(a)) {
          c = "{";
          for (const [y, u] of Object.entries(a)) c += `"${u}": ${l ? 1n << BigInt(y) : 1 << y}` + (l ? "n," : ",");
          c += "}";
        } else if (f) {
          c = "{";
          for (const y in a) c += `"${y}": ${1 << a[y]}${l ? "n," : ","}`;
          c += "}";
        }
        return o.wrapCode(`
const flags = ${c}
let val = value._value ${l ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val)
      `.trim());
      }],
      mapper: ["parametrizable", (o, r) => {
        const a = JSON.stringify(e(r.mappings)), f = "return " + o.callType(`${a}[value] || value`, r.type);
        return o.wrapCode(f);
      }]
    }
  };
  function t(o) {
    const r = {};
    for (let a in o) {
      let f = o[a];
      a = n(a), isNaN(f) || (f = Number(f)), f === "true" && (f = !0), f === "false" && (f = !1), r[a] = f;
    }
    return r;
  }
  function e(o) {
    const r = {};
    for (let a in o) {
      const f = o[a];
      a = n(a), r[f] = isNaN(a) ? a : parseInt(a, 10);
    }
    return r;
  }
  function n(o) {
    return o.match(/^0x[0-9a-f]+$/i) ? parseInt(o.substring(2), 16) : o;
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
      const n = this.sizeOfCompiler.generate(), o = this.writeCompiler.generate(), r = this.readCompiler.generate();
      e.printCode && (console.log("// SizeOf:"), console.log(n), console.log("// Write:"), console.log(o), console.log("// Read:"), console.log(r));
      const a = this.sizeOfCompiler.compile(n), f = this.writeCompiler.compile(o), l = this.readCompiler.compile(r);
      return new CompiledProtodef(a, f, l);
    }
  }
  class CompiledProtodef {
    constructor(e, n, o) {
      this.sizeOfCtx = e, this.writeCtx = n, this.readCtx = o;
    }
    read(e, n, o) {
      const r = this.readCtx[o];
      if (!r)
        throw new Error("missing data type: " + o);
      return r(e, n);
    }
    write(e, n, o, r) {
      const a = this.writeCtx[r];
      if (!a)
        throw new Error("missing data type: " + r);
      return a(e, n, o);
    }
    setVariable(e, n) {
      this.sizeOfCtx[e] = n, this.readCtx[e] = n, this.writeCtx[e] = n;
    }
    sizeOf(e, n) {
      const o = this.sizeOfCtx[n];
      if (!o)
        throw new Error("missing data type: " + n);
      return typeof o == "function" ? o(e) : o;
    }
    createPacketBuffer(e, n) {
      const o = tryCatch(
        () => this.sizeOf(n, e),
        (a) => {
          throw a.message = `SizeOf error for ${a.field} : ${a.message}`, a;
        }
      ), r = Buffer.allocUnsafe(o);
      return tryCatch(
        () => this.write(n, r, 0, e),
        (a) => {
          throw a.message = `Write error for ${a.field} : ${a.message}`, a;
        }
      ), r;
    }
    parsePacketBuffer(e, n, o = 0) {
      const { value: r, size: a } = tryCatch(
        () => this.read(n, o, e),
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
      for (const [e, [n, o]] of Object.entries(t))
        n === "native" ? this.addNativeType(e, o) : n === "context" ? this.addContextType(e, o) : n === "parametrizable" && this.addParametrizableType(e, o);
    }
    addTypesToCompile(t) {
      for (const [e, n] of Object.entries(t))
        (!this.types[e] || this.types[e] === "native") && (this.types[e] = n);
    }
    addProtocol(t, e) {
      const n = this;
      function o(r, a) {
        r !== void 0 && (r.types && n.addTypesToCompile(r.types), o(r[a.shift()], a));
      }
      o(t, e.slice(0));
    }
    indent(t, e = "  ") {
      return t.split(`
`).map((n) => e + n).join(`
`);
    }
    getField(t, e) {
      const n = t.split("/");
      let o = this.scopeStack.length - 1;
      const r = ["value", "enum", "default", "size", "offset"];
      for (; n.length; ) {
        const a = this.scopeStack[o], f = n.shift();
        if (f === "..") {
          o--;
          continue;
        }
        if (a[f]) return a[f] + (n.length ? "." + n.join(".") : "");
        if (n.length !== 0)
          throw new Error("Cannot access properties of undefined field");
        let l = 0;
        r.includes(f) && l++;
        for (let c = 0; c < o; c++)
          this.scopeStack[c][f] && l++;
        return e ? a[f] = f : a[f] = f + (l || ""), a[f];
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
    callType(e, n = "offset", o = []) {
      if (e instanceof Array && this.types[e[0]] && this.types[e[0]] !== "native")
        return this.callType(e[0], n, Object.values(e[1]));
      e instanceof Array && e[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(e);
      return e instanceof Array && e[0] === "container" && this.scopeStack.pop(), o.length > 0 ? "(" + r + `)(buffer, ${n}, ` + o.map((a) => this.getField(a)).join(", ") + ")" : "(" + r + `)(buffer, ${n})`;
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
    callType(e, n, o = "offset", r = []) {
      if (n instanceof Array && this.types[n[0]] && this.types[n[0]] !== "native")
        return this.callType(e, n[0], o, Object.values(n[1]));
      n instanceof Array && n[0] === "container" && this.scopeStack.push({});
      const a = this.compileType(n);
      return n instanceof Array && n[0] === "container" && this.scopeStack.pop(), r.length > 0 ? "(" + a + `)(${e}, buffer, ${o}, ` + r.map((f) => this.getField(f)).join(", ") + ")" : "(" + a + `)(${e}, buffer, ${o})`;
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
      this.primitiveTypes[e] = `native.${e}`, isNaN(n) ? this.native[e] = n : this.native[e] = (o) => n, this.types[e] = "native";
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
    callType(e, n, o = []) {
      if (n instanceof Array && this.types[n[0]] && this.types[n[0]] !== "native")
        return this.callType(e, n[0], Object.values(n[1]));
      n instanceof Array && n[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(n);
      return n instanceof Array && n[0] === "container" && this.scopeStack.pop(), isNaN(r) ? o.length > 0 ? "(" + r + `)(${e}, ` + o.map((a) => this.getField(a)).join(", ") + ")" : "(" + r + `)(${e})` : r;
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
          const o = ctx.i8(t, e);
          if (o.value === 0) {
            n.size += o.size;
            break;
          }
          if (o.value > 20)
            throw new Error(`Invalid tag: ${o.value} > 20`);
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
        for (const o in t)
          n = ctx.nbt({
            name: o,
            type: t[o].type,
            value: t[o].value
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
  function t(o, r) {
    const { value: a, size: f } = ctx.shortString(o, r);
    for (const l of a)
      if (l === "\0") throw new Error("unexpected tag end");
    return { value: a, size: f };
  }
  function e(...o) {
    return ctx.shortString(...o);
  }
  function n(...o) {
    return ctx.shortString(...o);
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
  function t(r, a, { tagType: f }, l) {
    if (a + 1 > r.length)
      throw new Error("Read out of bounds");
    return r.readInt8(a) === 0 ? { size: 1 } : this.read(r, a, f, l);
  }
  function e(r, a, f, { tagType: l }, c) {
    return r === void 0 ? (a.writeInt8(0, f), f + 1) : this.write(r, a, f, l, c);
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
  function t(o, r, a, f) {
    const l = {
      value: {},
      size: 0
    };
    for (; ; ) {
      const c = this.read(o, r, "i8", f);
      if (c.value === 0) {
        r += c.size, l.size += c.size;
        break;
      }
      const y = this.read(o, r, "nbt", f);
      r += y.size, l.size += y.size, l.value[y.value.name] = {
        type: y.value.type,
        value: y.value.value
      };
    }
    return l;
  }
  function e(o, r, a, f, l) {
    const c = this;
    return Object.keys(o).forEach(function(y) {
      a = c.write({
        name: y,
        type: o[y].type,
        value: o[y].value
      }, r, a, "nbt", l);
    }), a = this.write(0, r, a, "i8", l), a;
  }
  function n(o, r, a) {
    const f = this;
    return 1 + Object.keys(o).reduce(function(c, y) {
      return c + f.sizeOf({
        name: y,
        type: o[y].type,
        value: o[y].value
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
  const t = requireLib(), { ProtoDefCompiler: e } = requireProtodef().Compiler, n = JSON.stringify(require$$2), o = n.replace(/([iuf][0-7]+)/g, "l$1"), r = JSON.stringify(require$$3).replace(/([if][0-7]+)/g, "l$1");
  function a(T, $) {
    $.addTypes(requireCompilerCompound()), $.addTypes(requireCompilerTagname()), $.addTypes(requireOptional().compiler);
    let x = n;
    T === "littleVarint" ? x = r : T === "little" && (x = o), $.addTypesToCompile(JSON.parse(x));
  }
  function f(T, $) {
    $.addTypes(requireCompound()), $.addTypes(requireOptional().interpret);
    let x = n;
    T === "littleVarint" ? x = r : T === "little" && (x = o), $.addTypes(JSON.parse(x)), $.types.nbtTagName = $.types.shortString;
  }
  function l(T) {
    const $ = new e();
    return a(T, $), $.compileProtoDefSync();
  }
  const c = l("big"), y = l("little"), u = l("littleVarint"), m = {
    big: c,
    little: y,
    littleVarint: u
  };
  function w(T, $ = "big") {
    return $ === !0 && ($ = "little"), m[$].createPacketBuffer("nbt", T);
  }
  function R(T, $ = "big", x = {}) {
    return $ === !0 && ($ = "little"), m[$].setVariable("noArraySizeCheck", x.noArraySizeCheck), m[$].parsePacketBuffer("nbt", T, T.startOffset).data;
  }
  const h = function(T) {
    let $ = !0;
    return T[0] !== 31 && ($ = !1), T[1] !== 139 && ($ = !1), $;
  }, q = (T) => T[1] === 0 && T[2] === 0 && T[3] === 0;
  async function d(T, $, x = {}) {
    if (!(T instanceof Buffer)) throw new Error("Invalid argument: `data` must be a Buffer object");
    h(T) && (T = await new Promise((V, C) => {
      t.gunzip(T, (z, g) => {
        z ? C(z) : V(g);
      });
    })), m[$].setVariable("noArraySizeCheck", x.noArraySizeCheck);
    const j = m[$].parsePacketBuffer("nbt", T, T.startOffset);
    return j.metadata.buffer = T, j.type = $, j;
  }
  async function v(T, $, x) {
    if (T instanceof ArrayBuffer)
      T = Buffer.from(T);
    else if (!(T instanceof Buffer))
      throw new Error("Invalid argument: `data` must be a Buffer or ArrayBuffer object");
    let j = null;
    if (typeof $ == "function")
      x = $;
    else if ($ === !0 || $ === "little")
      j = "little";
    else if ($ === "big")
      j = "big";
    else if ($ === "littleVarint")
      j = "littleVarint";
    else if ($)
      throw new Error("Unrecognized format: " + $);
    if (T.startOffset = T.startOffset || 0, !j && !T.startOffset && q(T) && (T.startOffset += 8, j = "little"), j)
      try {
        const z = await d(T, j);
        return x && x(null, z.data, z.type, z.metadata), { parsed: z.data, type: z.type, metadata: z.metadata };
      } catch (z) {
        if (x) return x(z);
        throw z;
      }
    const V = ({ buffer: z, size: g }) => {
      const D = g, ie = z.length - z.startOffset, we = z[D + z.startOffset] === 10;
      if (D < ie && !we)
        throw new Error(`Unexpected EOF at ${D}: still have ${ie - D} bytes to read !`);
    };
    let C = null;
    try {
      C = await d(T, "big"), V(C.metadata);
    } catch (z) {
      try {
        C = await d(T, "little"), V(C.metadata);
      } catch {
        try {
          C = await d(T, "littleVarint"), V(C.metadata);
        } catch {
          if (x) return x(z);
          throw z;
        }
      }
    }
    return x && x(null, C.data, C.type, C.metadata), { parsed: C.data, type: C.type, metadata: C.metadata };
  }
  function P(T) {
    function $(x, j) {
      return j === "compound" ? Object.keys(x).reduce(function(V, C) {
        return V[C] = P(x[C]), V;
      }, {}) : j === "list" ? x.value.map(function(V) {
        return $(V, x.type);
      }) : x;
    }
    return $(T.value, T.type);
  }
  function E(T, $) {
    if (T.type !== $.type) return !1;
    if (T.type === "compound") {
      const x = Object.keys(T.value), j = Object.keys($.value);
      if (x.length !== j.length) return !1;
      for (const V of x)
        if (!E(T.value[V], $.value[V])) return !1;
      return !0;
    }
    if (T.type === "list") {
      if (T.value.length !== $.value.length) return !1;
      for (let x = 0; x < T.value.length; x++)
        if (!E(T.value[x], $.value[x])) return !1;
      return !0;
    }
    if (T.type === "byteArray" || T.type === "intArray" || T.type === "shortArray") {
      if (T.value.length !== $.value.length) return !1;
      for (let x = 0; x < T.value.length; x++)
        if (T.value[x] !== $.value[x]) return !1;
      return !0;
    }
    if (T.type === "long")
      return T.value[0] === $.value[0] && T.value[1] === $.value[1];
    if (T.type === "longArray") {
      if (T.value.length !== $.value.length) return !1;
      for (let x = 0; x < T.value.length; x++)
        if (T.value[x][0] !== $.value[x][0] || T.value[x][1] !== $.value[x][1]) return !1;
      return !0;
    }
    return T.value === $.value;
  }
  const I = {
    bool(T = !1) {
      return { type: "bool", value: T };
    },
    short(T) {
      return { type: "short", value: T };
    },
    byte(T) {
      return { type: "byte", value: T };
    },
    string(T) {
      return { type: "string", value: T };
    },
    comp(T, $ = "") {
      return { type: "compound", name: $, value: T };
    },
    int(T) {
      return { type: "int", value: T };
    },
    float(T) {
      return { type: "float", value: T };
    },
    double(T) {
      return { type: "double", value: T };
    },
    long(T) {
      return { type: "long", value: T };
    },
    list(T) {
      return { type: "list", value: { type: (T == null ? void 0 : T.type) ?? "end", value: (T == null ? void 0 : T.value) ?? [] } };
    },
    byteArray(T = []) {
      return { type: "byteArray", value: T };
    },
    shortArray(T = []) {
      return { type: "shortArray", value: T };
    },
    intArray(T = []) {
      return { type: "intArray", value: T };
    },
    longArray(T = []) {
      return { type: "longArray", value: T };
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
    parseAs: d,
    equal: E,
    proto: c,
    protoLE: y,
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
  const e = t.Width ?? 0, n = t.Height ?? 0, o = t.Length ?? 0, r = t.Blocks ?? [], a = [];
  let f = 0;
  for (let c = 0; c < n; c++)
    for (let y = 0; y < o; y++)
      for (let u = 0; u < e && !(f >= r.length); u++) {
        const m = r[f++];
        if (m === 0) continue;
        const w = LEGACY_BLOCK_MAP[m] ?? `minecraft:unknown_${m}`;
        a.push([u, c, y, w]);
      }
  const l = new Set(a.map((c) => c[3]));
  return { blocks: a, palette: buildPalette(l) };
}
function readVarint(t, e) {
  let n = 0, o = 0, r = e;
  for (; r < t.length; ) {
    const a = t[r];
    if (n |= (a & 127) << o, r++, (a & 128) === 0) break;
    o += 7;
  }
  return [n, r - e];
}
function parseSponge(t) {
  var m, w;
  let e = t;
  e.Schematic && (e = e.Schematic);
  const n = e.Width ?? 0, o = e.Height ?? 0, r = e.Length ?? 0;
  let a, f;
  (m = e.Blocks) != null && m.Palette && ((w = e.Blocks) != null && w.Data) ? (a = e.Blocks.Palette, f = e.Blocks.Data) : (a = e.Palette ?? {}, f = e.BlockData ?? []);
  const l = /* @__PURE__ */ new Map();
  for (const [R, h] of Object.entries(a)) {
    const d = (R.startsWith("minecraft:") ? R : `minecraft:${R}`).split("[")[0];
    l.set(Number(h), d);
  }
  const c = [];
  let y = 0;
  for (let R = 0; R < o; R++)
    for (let h = 0; h < r; h++)
      for (let q = 0; q < n && !(y >= f.length); q++) {
        const [d, v] = readVarint(f, y);
        y += v;
        const P = l.get(d) ?? `minecraft:unknown_${d}`;
        P !== "minecraft:air" && c.push([q, R, h, P]);
      }
  const u = new Set(c.map((R) => R[3]));
  return { blocks: c, palette: buildPalette(u) };
}
function parseLitematic(t) {
  var r, a, f, l, c, y;
  const e = t.Regions ?? {}, n = [];
  for (const u of Object.values(e)) {
    const m = u.BlockStatePalette ?? [];
    if (m.length === 0) continue;
    const w = Math.abs(((r = u.Size) == null ? void 0 : r.x) ?? 0), R = Math.abs(((a = u.Size) == null ? void 0 : a.y) ?? 0), h = Math.abs(((f = u.Size) == null ? void 0 : f.z) ?? 0);
    if (w * R * h === 0) continue;
    const d = ((l = u.Position) == null ? void 0 : l.x) ?? 0, v = ((c = u.Position) == null ? void 0 : c.y) ?? 0, P = ((y = u.Position) == null ? void 0 : y.z) ?? 0, E = Math.max(2, Math.ceil(Math.log2(m.length))), I = (1 << E) - 1, T = u.BlockStates ?? [];
    if (T.length === 0) continue;
    const $ = T.map((j) => BigInt(j));
    let x = 0;
    for (let j = 0; j < R; j++)
      for (let V = 0; V < h; V++)
        for (let C = 0; C < w; C++) {
          const z = Math.floor(x / 64), g = x % 64;
          if (x += E, z >= $.length) continue;
          let D;
          if (g + E <= 64)
            D = Number($[z] >> BigInt(g) & BigInt(I));
          else {
            const we = 64 - g, be = Number($[z] >> BigInt(g) & BigInt((1 << we) - 1)), ce = z + 1 < $.length ? Number($[z + 1] & BigInt((1 << E - we) - 1)) : 0;
            D = be | ce << we;
          }
          if (D >= m.length) continue;
          const ie = m[D], de = (ie == null ? void 0 : ie.Name) ?? ie ?? "minecraft:air";
          de !== "minecraft:air" && n.push([C + d, j + v, V + P, de]);
        }
  }
  const o = new Set(n.map((u) => u[3]));
  return { blocks: n, palette: buildPalette(o) };
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
    const o = await t.text(), r = JSON.parse(o);
    if (r.blocks && r.palette) return r;
    throw new Error("JSON file must contain 'blocks' and 'palette' keys");
  }
  if (e === ".schematic" || e === ".schem" || e === ".litematic") {
    const o = await t.arrayBuffer(), r = await parseNBT(o);
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
function injectStyles() {
  if (document.getElementById("csv-styles")) return;
  const t = document.createElement("style");
  t.id = "csv-styles", t.textContent = CSS, document.head.appendChild(t);
}
function createViewerDOM(t, e) {
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "csv-root";
  const o = document.createElement("div");
  o.className = "csv-canvas-wrap", n.appendChild(o);
  let r = null;
  e.gallery && (r = document.createElement("div"), r.className = "csv-gallery", n.appendChild(r));
  let a = null;
  e.infoBar && (a = document.createElement("div"), a.className = "csv-info", n.appendChild(a));
  const f = document.createElement("div");
  f.className = "csv-tooltip", document.body.appendChild(f);
  let l = null;
  e.dragDrop && (l = document.createElement("div"), l.className = "csv-drop-overlay", l.innerHTML = "<span>Drop to add schematics</span>", n.appendChild(l));
  const c = document.createElement("div");
  c.className = "csv-add-bar";
  const y = document.createElement("label");
  y.className = "csv-add-btn", y.textContent = "+ Add";
  const u = document.createElement("input");
  u.type = "file", u.multiple = !0, u.accept = ".litematic,.schematic,.schem,.json", u.className = "csv-add-input", y.appendChild(u), c.appendChild(y);
  const m = document.createElement("button");
  return m.className = "csv-add-btn", m.textContent = "Clear", c.appendChild(m), n.appendChild(c), t.appendChild(n), { root: n, canvasWrap: o, galleryEl: r, infoEl: a, tooltip: f, dropOverlay: l, addInput: u, clearBtn: m };
}
function renderGallery(t, e, n, o) {
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
    r.addEventListener("click", () => o(r.dataset.id));
  });
}
function updateInfoBar(t, e) {
  const n = e.filter((a) => a.visible), o = n.reduce((a, f) => a + f.blockCount, 0), r = new Set(n.flatMap((a) => Object.keys(a.data.palette)));
  if (e.length === 0) {
    t.classList.remove("visible");
    return;
  }
  t.textContent = `${e.length} schematic${e.length > 1 ? "s" : ""} · ${o.toLocaleString()} blocks · ${r.size} types`, t.classList.add("visible");
}
function showTooltip(t, e, n, o) {
  const r = e.blockId.replace("minecraft:", "");
  t.innerHTML = `
    <div class="bt-name">${r}</div>
    <div class="bt-row">
      <div class="bt-swatch" style="background:rgb(${e.color.join(",")})"></div>
      <span class="bt-pos">${e.position.join(", ")}</span>
    </div>
    <div class="bt-schem">${e.schematicName}</div>
  `, t.style.left = n + "px", t.style.top = o + "px", t.classList.add("visible");
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
      onBlockHover: this.config.tooltip ? (n, o, r) => {
        n ? (showTooltip(this.dom.tooltip, n, o, r), this.emit("block:hover", n)) : (hideTooltip(this.dom.tooltip), this.emit("block:hover", null));
      } : void 0
    }), this.setupDragDrop(), this.setupAddButton(), this.emit("ready");
  }
  /** Load a schematic into the viewer. */
  addSchematic(e, n, o) {
    const r = o ?? crypto.randomUUID().slice(0, 8), a = GALLERY_COLORS[this.colorIdx % GALLERY_COLORS.length];
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
    const o = this.entries.get(e);
    !o || o.visible === n || (o.visible = n, this.scene.setSchematicVisible(e, n), this.refresh(), this.emit("schematic:toggle", e, n));
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
    const o = await fetch(n);
    if (!o.ok) throw new Error(`Failed to fetch ${n}: ${o.status}`);
    const r = (f = n.split(/[?#]/)[0].split(".").pop()) == null ? void 0 : f.toLowerCase();
    if (r && r !== "json" && SUPPORTED_EXTENSIONS.includes(`.${r}`)) {
      const l = await o.blob(), c = new File([l], `${e}.${r}`);
      return this.loadFromFile(c);
    }
    const a = await o.json();
    return this.addSchematic(e, a);
  }
  /**
   * Load a schematic from a File object.
   * Supports .schematic, .schem, .litematic (parsed client-side via NBT)
   * and .json (blocks.json format).
   */
  async loadFromFile(e) {
    const n = await parseFile(e), o = e.name.replace(/\.[^.]+$/, "");
    return this.addSchematic(o, n);
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
    this.dom.root.addEventListener("dragenter", (o) => {
      o.preventDefault(), n++, e.classList.add("visible");
    }), this.dom.root.addEventListener("dragleave", () => {
      n--, n <= 0 && (n = 0, e.classList.remove("visible"));
    }), this.dom.root.addEventListener("dragover", (o) => o.preventDefault()), this.dom.root.addEventListener("drop", async (o) => {
      var a;
      o.preventDefault(), n = 0, e.classList.remove("visible");
      const r = (a = o.dataTransfer) == null ? void 0 : a.files;
      if (r)
        for (const f of Array.from(r))
          try {
            await this.loadFromFile(f);
          } catch (l) {
            console.error(`Failed to load ${f.name}:`, l);
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
          } catch (o) {
            console.error(`Failed to load ${n.name}:`, o);
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
