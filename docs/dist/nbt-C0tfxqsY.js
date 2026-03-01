function _mergeNamespaces(t, e) {
  for (var o = 0; o < e.length; o++) {
    const l = e[o];
    if (typeof l != "string" && !Array.isArray(l)) {
      for (const r in l)
        if (r !== "default" && !(r in t)) {
          const n = Object.getOwnPropertyDescriptor(l, r);
          n && Object.defineProperty(t, r, n.get ? n : {
            enumerable: !0,
            get: () => l[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
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
  var o = t.indexOf("=");
  o === -1 && (o = e);
  var l = o === e ? 0 : 4 - o % 4;
  return [o, l];
}
function byteLength(t) {
  var e = getLens(t), o = e[0], l = e[1];
  return (o + l) * 3 / 4 - l;
}
function _byteLength(t, e, o) {
  return (e + o) * 3 / 4 - o;
}
function toByteArray(t) {
  var e, o = getLens(t), l = o[0], r = o[1], n = new Arr(_byteLength(t, l, r)), f = 0, u = r > 0 ? l - 4 : l, b;
  for (b = 0; b < u; b += 4)
    e = revLookup[t.charCodeAt(b)] << 18 | revLookup[t.charCodeAt(b + 1)] << 12 | revLookup[t.charCodeAt(b + 2)] << 6 | revLookup[t.charCodeAt(b + 3)], n[f++] = e >> 16 & 255, n[f++] = e >> 8 & 255, n[f++] = e & 255;
  return r === 2 && (e = revLookup[t.charCodeAt(b)] << 2 | revLookup[t.charCodeAt(b + 1)] >> 4, n[f++] = e & 255), r === 1 && (e = revLookup[t.charCodeAt(b)] << 10 | revLookup[t.charCodeAt(b + 1)] << 4 | revLookup[t.charCodeAt(b + 2)] >> 2, n[f++] = e >> 8 & 255, n[f++] = e & 255), n;
}
function tripletToBase64(t) {
  return lookup[t >> 18 & 63] + lookup[t >> 12 & 63] + lookup[t >> 6 & 63] + lookup[t & 63];
}
function encodeChunk(t, e, o) {
  for (var l, r = [], n = e; n < o; n += 3)
    l = (t[n] << 16 & 16711680) + (t[n + 1] << 8 & 65280) + (t[n + 2] & 255), r.push(tripletToBase64(l));
  return r.join("");
}
function fromByteArray(t) {
  for (var e, o = t.length, l = o % 3, r = [], n = 16383, f = 0, u = o - l; f < u; f += n)
    r.push(encodeChunk(t, f, f + n > u ? u : f + n));
  return l === 1 ? (e = t[o - 1], r.push(
    lookup[e >> 2] + lookup[e << 4 & 63] + "=="
  )) : l === 2 && (e = (t[o - 2] << 8) + t[o - 1], r.push(
    lookup[e >> 10] + lookup[e >> 4 & 63] + lookup[e << 2 & 63] + "="
  )), r.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(t, e, o, l, r) {
  var n, f, u = r * 8 - l - 1, b = (1 << u) - 1, S = b >> 1, s = -7, v = o ? r - 1 : 0, E = o ? -1 : 1, q = t[e + v];
  for (v += E, n = q & (1 << -s) - 1, q >>= -s, s += u; s > 0; n = n * 256 + t[e + v], v += E, s -= 8)
    ;
  for (f = n & (1 << -s) - 1, n >>= -s, s += l; s > 0; f = f * 256 + t[e + v], v += E, s -= 8)
    ;
  if (n === 0)
    n = 1 - S;
  else {
    if (n === b)
      return f ? NaN : (q ? -1 : 1) * (1 / 0);
    f = f + Math.pow(2, l), n = n - S;
  }
  return (q ? -1 : 1) * f * Math.pow(2, n - l);
};
ieee754.write = function(t, e, o, l, r, n) {
  var f, u, b, S = n * 8 - r - 1, s = (1 << S) - 1, v = s >> 1, E = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, q = l ? 0 : n - 1, p = l ? 1 : -1, T = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, f = s) : (f = Math.floor(Math.log(e) / Math.LN2), e * (b = Math.pow(2, -f)) < 1 && (f--, b *= 2), f + v >= 1 ? e += E / b : e += E * Math.pow(2, 1 - v), e * b >= 2 && (f++, b /= 2), f + v >= s ? (u = 0, f = s) : f + v >= 1 ? (u = (e * b - 1) * Math.pow(2, r), f = f + v) : (u = e * Math.pow(2, v - 1) * Math.pow(2, r), f = 0)); r >= 8; t[o + q] = u & 255, q += p, u /= 256, r -= 8)
    ;
  for (f = f << r | u, S += r; S > 0; t[o + q] = f & 255, q += p, f /= 256, S -= 8)
    ;
  t[o + q - p] |= T * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = base64Js, o = ieee754, l = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = s, t.SlowBuffer = R, t.INSPECT_MAX_BYTES = 50;
  const r = 2147483647;
  t.kMaxLength = r;
  const { Uint8Array: n, ArrayBuffer: f, SharedArrayBuffer: u } = globalThis;
  s.TYPED_ARRAY_SUPPORT = b(), !s.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function b() {
    try {
      const U = new n(1), a = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(a, n.prototype), Object.setPrototypeOf(U, a), U.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(s.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (s.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(s.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (s.isBuffer(this))
        return this.byteOffset;
    }
  });
  function S(U) {
    if (U > r)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
    const a = new n(U);
    return Object.setPrototypeOf(a, s.prototype), a;
  }
  function s(U, a, m) {
    if (typeof U == "number") {
      if (typeof a == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return p(U);
    }
    return v(U, a, m);
  }
  s.poolSize = 8192;
  function v(U, a, m) {
    if (typeof U == "string")
      return T(U, a);
    if (f.isView(U))
      return y(U);
    if (U == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
      );
    if (Se(U, f) || U && Se(U.buffer, f) || typeof u < "u" && (Se(U, u) || U && Se(U.buffer, u)))
      return A(U, a, m);
    if (typeof U == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const z = U.valueOf && U.valueOf();
    if (z != null && z !== U)
      return s.from(z, a, m);
    const le = w(U);
    if (le) return le;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof U[Symbol.toPrimitive] == "function")
      return s.from(U[Symbol.toPrimitive]("string"), a, m);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof U
    );
  }
  s.from = function(U, a, m) {
    return v(U, a, m);
  }, Object.setPrototypeOf(s.prototype, n.prototype), Object.setPrototypeOf(s, n);
  function E(U) {
    if (typeof U != "number")
      throw new TypeError('"size" argument must be of type number');
    if (U < 0)
      throw new RangeError('The value "' + U + '" is invalid for option "size"');
  }
  function q(U, a, m) {
    return E(U), U <= 0 ? S(U) : a !== void 0 ? typeof m == "string" ? S(U).fill(a, m) : S(U).fill(a) : S(U);
  }
  s.alloc = function(U, a, m) {
    return q(U, a, m);
  };
  function p(U) {
    return E(U), S(U < 0 ? 0 : I(U) | 0);
  }
  s.allocUnsafe = function(U) {
    return p(U);
  }, s.allocUnsafeSlow = function(U) {
    return p(U);
  };
  function T(U, a) {
    if ((typeof a != "string" || a === "") && (a = "utf8"), !s.isEncoding(a))
      throw new TypeError("Unknown encoding: " + a);
    const m = F(U, a) | 0;
    let z = S(m);
    const le = z.write(U, a);
    return le !== m && (z = z.slice(0, le)), z;
  }
  function d(U) {
    const a = U.length < 0 ? 0 : I(U.length) | 0, m = S(a);
    for (let z = 0; z < a; z += 1)
      m[z] = U[z] & 255;
    return m;
  }
  function y(U) {
    if (Se(U, n)) {
      const a = new n(U);
      return A(a.buffer, a.byteOffset, a.byteLength);
    }
    return d(U);
  }
  function A(U, a, m) {
    if (a < 0 || U.byteLength < a)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (U.byteLength < a + (m || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let z;
    return a === void 0 && m === void 0 ? z = new n(U) : m === void 0 ? z = new n(U, a) : z = new n(U, a, m), Object.setPrototypeOf(z, s.prototype), z;
  }
  function w(U) {
    if (s.isBuffer(U)) {
      const a = I(U.length) | 0, m = S(a);
      return m.length === 0 || U.copy(m, 0, 0, a), m;
    }
    if (U.length !== void 0)
      return typeof U.length != "number" || Le(U.length) ? S(0) : d(U);
    if (U.type === "Buffer" && Array.isArray(U.data))
      return d(U.data);
  }
  function I(U) {
    if (U >= r)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
    return U | 0;
  }
  function R(U) {
    return +U != U && (U = 0), s.alloc(+U);
  }
  s.isBuffer = function(a) {
    return a != null && a._isBuffer === !0 && a !== s.prototype;
  }, s.compare = function(a, m) {
    if (Se(a, n) && (a = s.from(a, a.offset, a.byteLength)), Se(m, n) && (m = s.from(m, m.offset, m.byteLength)), !s.isBuffer(a) || !s.isBuffer(m))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (a === m) return 0;
    let z = a.length, le = m.length;
    for (let X = 0, he = Math.min(z, le); X < he; ++X)
      if (a[X] !== m[X]) {
        z = a[X], le = m[X];
        break;
      }
    return z < le ? -1 : le < z ? 1 : 0;
  }, s.isEncoding = function(a) {
    switch (String(a).toLowerCase()) {
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
  }, s.concat = function(a, m) {
    if (!Array.isArray(a))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (a.length === 0)
      return s.alloc(0);
    let z;
    if (m === void 0)
      for (m = 0, z = 0; z < a.length; ++z)
        m += a[z].length;
    const le = s.allocUnsafe(m);
    let X = 0;
    for (z = 0; z < a.length; ++z) {
      let he = a[z];
      if (Se(he, n))
        X + he.length > le.length ? (s.isBuffer(he) || (he = s.from(he)), he.copy(le, X)) : n.prototype.set.call(
          le,
          he,
          X
        );
      else if (s.isBuffer(he))
        he.copy(le, X);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      X += he.length;
    }
    return le;
  };
  function F(U, a) {
    if (s.isBuffer(U))
      return U.length;
    if (f.isView(U) || Se(U, f))
      return U.byteLength;
    if (typeof U != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof U
      );
    const m = U.length, z = arguments.length > 2 && arguments[2] === !0;
    if (!z && m === 0) return 0;
    let le = !1;
    for (; ; )
      switch (a) {
        case "ascii":
        case "latin1":
        case "binary":
          return m;
        case "utf8":
        case "utf-8":
          return Fe(U).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return m * 2;
        case "hex":
          return m >>> 1;
        case "base64":
          return Ue(U).length;
        default:
          if (le)
            return z ? -1 : Fe(U).length;
          a = ("" + a).toLowerCase(), le = !0;
      }
  }
  s.byteLength = F;
  function x(U, a, m) {
    let z = !1;
    if ((a === void 0 || a < 0) && (a = 0), a > this.length || ((m === void 0 || m > this.length) && (m = this.length), m <= 0) || (m >>>= 0, a >>>= 0, m <= a))
      return "";
    for (U || (U = "utf8"); ; )
      switch (U) {
        case "hex":
          return ee(this, a, m);
        case "utf8":
        case "utf-8":
          return _e(this, a, m);
        case "ascii":
          return k(this, a, m);
        case "latin1":
        case "binary":
          return pe(this, a, m);
        case "base64":
          return Ee(this, a, m);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return J(this, a, m);
        default:
          if (z) throw new TypeError("Unknown encoding: " + U);
          U = (U + "").toLowerCase(), z = !0;
      }
  }
  s.prototype._isBuffer = !0;
  function M(U, a, m) {
    const z = U[a];
    U[a] = U[m], U[m] = z;
  }
  s.prototype.swap16 = function() {
    const a = this.length;
    if (a % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let m = 0; m < a; m += 2)
      M(this, m, m + 1);
    return this;
  }, s.prototype.swap32 = function() {
    const a = this.length;
    if (a % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let m = 0; m < a; m += 4)
      M(this, m, m + 3), M(this, m + 1, m + 2);
    return this;
  }, s.prototype.swap64 = function() {
    const a = this.length;
    if (a % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let m = 0; m < a; m += 8)
      M(this, m, m + 7), M(this, m + 1, m + 6), M(this, m + 2, m + 5), M(this, m + 3, m + 4);
    return this;
  }, s.prototype.toString = function() {
    const a = this.length;
    return a === 0 ? "" : arguments.length === 0 ? _e(this, 0, a) : x.apply(this, arguments);
  }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(a) {
    if (!s.isBuffer(a)) throw new TypeError("Argument must be a Buffer");
    return this === a ? !0 : s.compare(this, a) === 0;
  }, s.prototype.inspect = function() {
    let a = "";
    const m = t.INSPECT_MAX_BYTES;
    return a = this.toString("hex", 0, m).replace(/(.{2})/g, "$1 ").trim(), this.length > m && (a += " ... "), "<Buffer " + a + ">";
  }, l && (s.prototype[l] = s.prototype.inspect), s.prototype.compare = function(a, m, z, le, X) {
    if (Se(a, n) && (a = s.from(a, a.offset, a.byteLength)), !s.isBuffer(a))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof a
      );
    if (m === void 0 && (m = 0), z === void 0 && (z = a ? a.length : 0), le === void 0 && (le = 0), X === void 0 && (X = this.length), m < 0 || z > a.length || le < 0 || X > this.length)
      throw new RangeError("out of range index");
    if (le >= X && m >= z)
      return 0;
    if (le >= X)
      return -1;
    if (m >= z)
      return 1;
    if (m >>>= 0, z >>>= 0, le >>>= 0, X >>>= 0, this === a) return 0;
    let he = X - le, j = z - m;
    const Be = Math.min(he, j), We = this.slice(le, X), _ = a.slice(m, z);
    for (let Ie = 0; Ie < Be; ++Ie)
      if (We[Ie] !== _[Ie]) {
        he = We[Ie], j = _[Ie];
        break;
      }
    return he < j ? -1 : j < he ? 1 : 0;
  };
  function Q(U, a, m, z, le) {
    if (U.length === 0) return -1;
    if (typeof m == "string" ? (z = m, m = 0) : m > 2147483647 ? m = 2147483647 : m < -2147483648 && (m = -2147483648), m = +m, Le(m) && (m = le ? 0 : U.length - 1), m < 0 && (m = U.length + m), m >= U.length) {
      if (le) return -1;
      m = U.length - 1;
    } else if (m < 0)
      if (le) m = 0;
      else return -1;
    if (typeof a == "string" && (a = s.from(a, z)), s.isBuffer(a))
      return a.length === 0 ? -1 : C(U, a, m, z, le);
    if (typeof a == "number")
      return a = a & 255, typeof n.prototype.indexOf == "function" ? le ? n.prototype.indexOf.call(U, a, m) : n.prototype.lastIndexOf.call(U, a, m) : C(U, [a], m, z, le);
    throw new TypeError("val must be string, number or Buffer");
  }
  function C(U, a, m, z, le) {
    let X = 1, he = U.length, j = a.length;
    if (z !== void 0 && (z = String(z).toLowerCase(), z === "ucs2" || z === "ucs-2" || z === "utf16le" || z === "utf-16le")) {
      if (U.length < 2 || a.length < 2)
        return -1;
      X = 2, he /= 2, j /= 2, m /= 2;
    }
    function Be(_, Ie) {
      return X === 1 ? _[Ie] : _.readUInt16BE(Ie * X);
    }
    let We;
    if (le) {
      let _ = -1;
      for (We = m; We < he; We++)
        if (Be(U, We) === Be(a, _ === -1 ? 0 : We - _)) {
          if (_ === -1 && (_ = We), We - _ + 1 === j) return _ * X;
        } else
          _ !== -1 && (We -= We - _), _ = -1;
    } else
      for (m + j > he && (m = he - j), We = m; We >= 0; We--) {
        let _ = !0;
        for (let Ie = 0; Ie < j; Ie++)
          if (Be(U, We + Ie) !== Be(a, Ie)) {
            _ = !1;
            break;
          }
        if (_) return We;
      }
    return -1;
  }
  s.prototype.includes = function(a, m, z) {
    return this.indexOf(a, m, z) !== -1;
  }, s.prototype.indexOf = function(a, m, z) {
    return Q(this, a, m, z, !0);
  }, s.prototype.lastIndexOf = function(a, m, z) {
    return Q(this, a, m, z, !1);
  };
  function W(U, a, m, z) {
    m = Number(m) || 0;
    const le = U.length - m;
    z ? (z = Number(z), z > le && (z = le)) : z = le;
    const X = a.length;
    z > X / 2 && (z = X / 2);
    let he;
    for (he = 0; he < z; ++he) {
      const j = parseInt(a.substr(he * 2, 2), 16);
      if (Le(j)) return he;
      U[m + he] = j;
    }
    return he;
  }
  function h(U, a, m, z) {
    return me(Fe(a, U.length - m), U, m, z);
  }
  function $(U, a, m, z) {
    return me(Ce(a), U, m, z);
  }
  function ae(U, a, m, z) {
    return me(Ue(a), U, m, z);
  }
  function de(U, a, m, z) {
    return me(qe(a, U.length - m), U, m, z);
  }
  s.prototype.write = function(a, m, z, le) {
    if (m === void 0)
      le = "utf8", z = this.length, m = 0;
    else if (z === void 0 && typeof m == "string")
      le = m, z = this.length, m = 0;
    else if (isFinite(m))
      m = m >>> 0, isFinite(z) ? (z = z >>> 0, le === void 0 && (le = "utf8")) : (le = z, z = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const X = this.length - m;
    if ((z === void 0 || z > X) && (z = X), a.length > 0 && (z < 0 || m < 0) || m > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    le || (le = "utf8");
    let he = !1;
    for (; ; )
      switch (le) {
        case "hex":
          return W(this, a, m, z);
        case "utf8":
        case "utf-8":
          return h(this, a, m, z);
        case "ascii":
        case "latin1":
        case "binary":
          return $(this, a, m, z);
        case "base64":
          return ae(this, a, m, z);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return de(this, a, m, z);
        default:
          if (he) throw new TypeError("Unknown encoding: " + le);
          le = ("" + le).toLowerCase(), he = !0;
      }
  }, s.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ee(U, a, m) {
    return a === 0 && m === U.length ? e.fromByteArray(U) : e.fromByteArray(U.slice(a, m));
  }
  function _e(U, a, m) {
    m = Math.min(U.length, m);
    const z = [];
    let le = a;
    for (; le < m; ) {
      const X = U[le];
      let he = null, j = X > 239 ? 4 : X > 223 ? 3 : X > 191 ? 2 : 1;
      if (le + j <= m) {
        let Be, We, _, Ie;
        switch (j) {
          case 1:
            X < 128 && (he = X);
            break;
          case 2:
            Be = U[le + 1], (Be & 192) === 128 && (Ie = (X & 31) << 6 | Be & 63, Ie > 127 && (he = Ie));
            break;
          case 3:
            Be = U[le + 1], We = U[le + 2], (Be & 192) === 128 && (We & 192) === 128 && (Ie = (X & 15) << 12 | (Be & 63) << 6 | We & 63, Ie > 2047 && (Ie < 55296 || Ie > 57343) && (he = Ie));
            break;
          case 4:
            Be = U[le + 1], We = U[le + 2], _ = U[le + 3], (Be & 192) === 128 && (We & 192) === 128 && (_ & 192) === 128 && (Ie = (X & 15) << 18 | (Be & 63) << 12 | (We & 63) << 6 | _ & 63, Ie > 65535 && Ie < 1114112 && (he = Ie));
        }
      }
      he === null ? (he = 65533, j = 1) : he > 65535 && (he -= 65536, z.push(he >>> 10 & 1023 | 55296), he = 56320 | he & 1023), z.push(he), le += j;
    }
    return fe(z);
  }
  const ce = 4096;
  function fe(U) {
    const a = U.length;
    if (a <= ce)
      return String.fromCharCode.apply(String, U);
    let m = "", z = 0;
    for (; z < a; )
      m += String.fromCharCode.apply(
        String,
        U.slice(z, z += ce)
      );
    return m;
  }
  function k(U, a, m) {
    let z = "";
    m = Math.min(U.length, m);
    for (let le = a; le < m; ++le)
      z += String.fromCharCode(U[le] & 127);
    return z;
  }
  function pe(U, a, m) {
    let z = "";
    m = Math.min(U.length, m);
    for (let le = a; le < m; ++le)
      z += String.fromCharCode(U[le]);
    return z;
  }
  function ee(U, a, m) {
    const z = U.length;
    (!a || a < 0) && (a = 0), (!m || m < 0 || m > z) && (m = z);
    let le = "";
    for (let X = a; X < m; ++X)
      le += Me[U[X]];
    return le;
  }
  function J(U, a, m) {
    const z = U.slice(a, m);
    let le = "";
    for (let X = 0; X < z.length - 1; X += 2)
      le += String.fromCharCode(z[X] + z[X + 1] * 256);
    return le;
  }
  s.prototype.slice = function(a, m) {
    const z = this.length;
    a = ~~a, m = m === void 0 ? z : ~~m, a < 0 ? (a += z, a < 0 && (a = 0)) : a > z && (a = z), m < 0 ? (m += z, m < 0 && (m = 0)) : m > z && (m = z), m < a && (m = a);
    const le = this.subarray(a, m);
    return Object.setPrototypeOf(le, s.prototype), le;
  };
  function G(U, a, m) {
    if (U % 1 !== 0 || U < 0) throw new RangeError("offset is not uint");
    if (U + a > m) throw new RangeError("Trying to access beyond buffer length");
  }
  s.prototype.readUintLE = s.prototype.readUIntLE = function(a, m, z) {
    a = a >>> 0, m = m >>> 0, z || G(a, m, this.length);
    let le = this[a], X = 1, he = 0;
    for (; ++he < m && (X *= 256); )
      le += this[a + he] * X;
    return le;
  }, s.prototype.readUintBE = s.prototype.readUIntBE = function(a, m, z) {
    a = a >>> 0, m = m >>> 0, z || G(a, m, this.length);
    let le = this[a + --m], X = 1;
    for (; m > 0 && (X *= 256); )
      le += this[a + --m] * X;
    return le;
  }, s.prototype.readUint8 = s.prototype.readUInt8 = function(a, m) {
    return a = a >>> 0, m || G(a, 1, this.length), this[a];
  }, s.prototype.readUint16LE = s.prototype.readUInt16LE = function(a, m) {
    return a = a >>> 0, m || G(a, 2, this.length), this[a] | this[a + 1] << 8;
  }, s.prototype.readUint16BE = s.prototype.readUInt16BE = function(a, m) {
    return a = a >>> 0, m || G(a, 2, this.length), this[a] << 8 | this[a + 1];
  }, s.prototype.readUint32LE = s.prototype.readUInt32LE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), (this[a] | this[a + 1] << 8 | this[a + 2] << 16) + this[a + 3] * 16777216;
  }, s.prototype.readUint32BE = s.prototype.readUInt32BE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), this[a] * 16777216 + (this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3]);
  }, s.prototype.readBigUInt64LE = je(function(a) {
    a = a >>> 0, Re(a, "offset");
    const m = this[a], z = this[a + 7];
    (m === void 0 || z === void 0) && Ae(a, this.length - 8);
    const le = m + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + this[++a] * 2 ** 24, X = this[++a] + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + z * 2 ** 24;
    return BigInt(le) + (BigInt(X) << BigInt(32));
  }), s.prototype.readBigUInt64BE = je(function(a) {
    a = a >>> 0, Re(a, "offset");
    const m = this[a], z = this[a + 7];
    (m === void 0 || z === void 0) && Ae(a, this.length - 8);
    const le = m * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + this[++a], X = this[++a] * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + z;
    return (BigInt(le) << BigInt(32)) + BigInt(X);
  }), s.prototype.readIntLE = function(a, m, z) {
    a = a >>> 0, m = m >>> 0, z || G(a, m, this.length);
    let le = this[a], X = 1, he = 0;
    for (; ++he < m && (X *= 256); )
      le += this[a + he] * X;
    return X *= 128, le >= X && (le -= Math.pow(2, 8 * m)), le;
  }, s.prototype.readIntBE = function(a, m, z) {
    a = a >>> 0, m = m >>> 0, z || G(a, m, this.length);
    let le = m, X = 1, he = this[a + --le];
    for (; le > 0 && (X *= 256); )
      he += this[a + --le] * X;
    return X *= 128, he >= X && (he -= Math.pow(2, 8 * m)), he;
  }, s.prototype.readInt8 = function(a, m) {
    return a = a >>> 0, m || G(a, 1, this.length), this[a] & 128 ? (255 - this[a] + 1) * -1 : this[a];
  }, s.prototype.readInt16LE = function(a, m) {
    a = a >>> 0, m || G(a, 2, this.length);
    const z = this[a] | this[a + 1] << 8;
    return z & 32768 ? z | 4294901760 : z;
  }, s.prototype.readInt16BE = function(a, m) {
    a = a >>> 0, m || G(a, 2, this.length);
    const z = this[a + 1] | this[a] << 8;
    return z & 32768 ? z | 4294901760 : z;
  }, s.prototype.readInt32LE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), this[a] | this[a + 1] << 8 | this[a + 2] << 16 | this[a + 3] << 24;
  }, s.prototype.readInt32BE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), this[a] << 24 | this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3];
  }, s.prototype.readBigInt64LE = je(function(a) {
    a = a >>> 0, Re(a, "offset");
    const m = this[a], z = this[a + 7];
    (m === void 0 || z === void 0) && Ae(a, this.length - 8);
    const le = this[a + 4] + this[a + 5] * 2 ** 8 + this[a + 6] * 2 ** 16 + (z << 24);
    return (BigInt(le) << BigInt(32)) + BigInt(m + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + this[++a] * 2 ** 24);
  }), s.prototype.readBigInt64BE = je(function(a) {
    a = a >>> 0, Re(a, "offset");
    const m = this[a], z = this[a + 7];
    (m === void 0 || z === void 0) && Ae(a, this.length - 8);
    const le = (m << 24) + // Overflow
    this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + this[++a];
    return (BigInt(le) << BigInt(32)) + BigInt(this[++a] * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + z);
  }), s.prototype.readFloatLE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), o.read(this, a, !0, 23, 4);
  }, s.prototype.readFloatBE = function(a, m) {
    return a = a >>> 0, m || G(a, 4, this.length), o.read(this, a, !1, 23, 4);
  }, s.prototype.readDoubleLE = function(a, m) {
    return a = a >>> 0, m || G(a, 8, this.length), o.read(this, a, !0, 52, 8);
  }, s.prototype.readDoubleBE = function(a, m) {
    return a = a >>> 0, m || G(a, 8, this.length), o.read(this, a, !1, 52, 8);
  };
  function ue(U, a, m, z, le, X) {
    if (!s.isBuffer(U)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (a > le || a < X) throw new RangeError('"value" argument is out of bounds');
    if (m + z > U.length) throw new RangeError("Index out of range");
  }
  s.prototype.writeUintLE = s.prototype.writeUIntLE = function(a, m, z, le) {
    if (a = +a, m = m >>> 0, z = z >>> 0, !le) {
      const j = Math.pow(2, 8 * z) - 1;
      ue(this, a, m, z, j, 0);
    }
    let X = 1, he = 0;
    for (this[m] = a & 255; ++he < z && (X *= 256); )
      this[m + he] = a / X & 255;
    return m + z;
  }, s.prototype.writeUintBE = s.prototype.writeUIntBE = function(a, m, z, le) {
    if (a = +a, m = m >>> 0, z = z >>> 0, !le) {
      const j = Math.pow(2, 8 * z) - 1;
      ue(this, a, m, z, j, 0);
    }
    let X = z - 1, he = 1;
    for (this[m + X] = a & 255; --X >= 0 && (he *= 256); )
      this[m + X] = a / he & 255;
    return m + z;
  }, s.prototype.writeUint8 = s.prototype.writeUInt8 = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 1, 255, 0), this[m] = a & 255, m + 1;
  }, s.prototype.writeUint16LE = s.prototype.writeUInt16LE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 2, 65535, 0), this[m] = a & 255, this[m + 1] = a >>> 8, m + 2;
  }, s.prototype.writeUint16BE = s.prototype.writeUInt16BE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 2, 65535, 0), this[m] = a >>> 8, this[m + 1] = a & 255, m + 2;
  }, s.prototype.writeUint32LE = s.prototype.writeUInt32LE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 4, 4294967295, 0), this[m + 3] = a >>> 24, this[m + 2] = a >>> 16, this[m + 1] = a >>> 8, this[m] = a & 255, m + 4;
  }, s.prototype.writeUint32BE = s.prototype.writeUInt32BE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 4, 4294967295, 0), this[m] = a >>> 24, this[m + 1] = a >>> 16, this[m + 2] = a >>> 8, this[m + 3] = a & 255, m + 4;
  };
  function O(U, a, m, z, le) {
    we(a, z, le, U, m, 7);
    let X = Number(a & BigInt(4294967295));
    U[m++] = X, X = X >> 8, U[m++] = X, X = X >> 8, U[m++] = X, X = X >> 8, U[m++] = X;
    let he = Number(a >> BigInt(32) & BigInt(4294967295));
    return U[m++] = he, he = he >> 8, U[m++] = he, he = he >> 8, U[m++] = he, he = he >> 8, U[m++] = he, m;
  }
  function B(U, a, m, z, le) {
    we(a, z, le, U, m, 7);
    let X = Number(a & BigInt(4294967295));
    U[m + 7] = X, X = X >> 8, U[m + 6] = X, X = X >> 8, U[m + 5] = X, X = X >> 8, U[m + 4] = X;
    let he = Number(a >> BigInt(32) & BigInt(4294967295));
    return U[m + 3] = he, he = he >> 8, U[m + 2] = he, he = he >> 8, U[m + 1] = he, he = he >> 8, U[m] = he, m + 8;
  }
  s.prototype.writeBigUInt64LE = je(function(a, m = 0) {
    return O(this, a, m, BigInt(0), BigInt("0xffffffffffffffff"));
  }), s.prototype.writeBigUInt64BE = je(function(a, m = 0) {
    return B(this, a, m, BigInt(0), BigInt("0xffffffffffffffff"));
  }), s.prototype.writeIntLE = function(a, m, z, le) {
    if (a = +a, m = m >>> 0, !le) {
      const Be = Math.pow(2, 8 * z - 1);
      ue(this, a, m, z, Be - 1, -Be);
    }
    let X = 0, he = 1, j = 0;
    for (this[m] = a & 255; ++X < z && (he *= 256); )
      a < 0 && j === 0 && this[m + X - 1] !== 0 && (j = 1), this[m + X] = (a / he >> 0) - j & 255;
    return m + z;
  }, s.prototype.writeIntBE = function(a, m, z, le) {
    if (a = +a, m = m >>> 0, !le) {
      const Be = Math.pow(2, 8 * z - 1);
      ue(this, a, m, z, Be - 1, -Be);
    }
    let X = z - 1, he = 1, j = 0;
    for (this[m + X] = a & 255; --X >= 0 && (he *= 256); )
      a < 0 && j === 0 && this[m + X + 1] !== 0 && (j = 1), this[m + X] = (a / he >> 0) - j & 255;
    return m + z;
  }, s.prototype.writeInt8 = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 1, 127, -128), a < 0 && (a = 255 + a + 1), this[m] = a & 255, m + 1;
  }, s.prototype.writeInt16LE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 2, 32767, -32768), this[m] = a & 255, this[m + 1] = a >>> 8, m + 2;
  }, s.prototype.writeInt16BE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 2, 32767, -32768), this[m] = a >>> 8, this[m + 1] = a & 255, m + 2;
  }, s.prototype.writeInt32LE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 4, 2147483647, -2147483648), this[m] = a & 255, this[m + 1] = a >>> 8, this[m + 2] = a >>> 16, this[m + 3] = a >>> 24, m + 4;
  }, s.prototype.writeInt32BE = function(a, m, z) {
    return a = +a, m = m >>> 0, z || ue(this, a, m, 4, 2147483647, -2147483648), a < 0 && (a = 4294967295 + a + 1), this[m] = a >>> 24, this[m + 1] = a >>> 16, this[m + 2] = a >>> 8, this[m + 3] = a & 255, m + 4;
  }, s.prototype.writeBigInt64LE = je(function(a, m = 0) {
    return O(this, a, m, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), s.prototype.writeBigInt64BE = je(function(a, m = 0) {
    return B(this, a, m, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function N(U, a, m, z, le, X) {
    if (m + z > U.length) throw new RangeError("Index out of range");
    if (m < 0) throw new RangeError("Index out of range");
  }
  function re(U, a, m, z, le) {
    return a = +a, m = m >>> 0, le || N(U, a, m, 4), o.write(U, a, m, z, 23, 4), m + 4;
  }
  s.prototype.writeFloatLE = function(a, m, z) {
    return re(this, a, m, !0, z);
  }, s.prototype.writeFloatBE = function(a, m, z) {
    return re(this, a, m, !1, z);
  };
  function ne(U, a, m, z, le) {
    return a = +a, m = m >>> 0, le || N(U, a, m, 8), o.write(U, a, m, z, 52, 8), m + 8;
  }
  s.prototype.writeDoubleLE = function(a, m, z) {
    return ne(this, a, m, !0, z);
  }, s.prototype.writeDoubleBE = function(a, m, z) {
    return ne(this, a, m, !1, z);
  }, s.prototype.copy = function(a, m, z, le) {
    if (!s.isBuffer(a)) throw new TypeError("argument should be a Buffer");
    if (z || (z = 0), !le && le !== 0 && (le = this.length), m >= a.length && (m = a.length), m || (m = 0), le > 0 && le < z && (le = z), le === z || a.length === 0 || this.length === 0) return 0;
    if (m < 0)
      throw new RangeError("targetStart out of bounds");
    if (z < 0 || z >= this.length) throw new RangeError("Index out of range");
    if (le < 0) throw new RangeError("sourceEnd out of bounds");
    le > this.length && (le = this.length), a.length - m < le - z && (le = a.length - m + z);
    const X = le - z;
    return this === a && typeof n.prototype.copyWithin == "function" ? this.copyWithin(m, z, le) : n.prototype.set.call(
      a,
      this.subarray(z, le),
      m
    ), X;
  }, s.prototype.fill = function(a, m, z, le) {
    if (typeof a == "string") {
      if (typeof m == "string" ? (le = m, m = 0, z = this.length) : typeof z == "string" && (le = z, z = this.length), le !== void 0 && typeof le != "string")
        throw new TypeError("encoding must be a string");
      if (typeof le == "string" && !s.isEncoding(le))
        throw new TypeError("Unknown encoding: " + le);
      if (a.length === 1) {
        const he = a.charCodeAt(0);
        (le === "utf8" && he < 128 || le === "latin1") && (a = he);
      }
    } else typeof a == "number" ? a = a & 255 : typeof a == "boolean" && (a = Number(a));
    if (m < 0 || this.length < m || this.length < z)
      throw new RangeError("Out of range index");
    if (z <= m)
      return this;
    m = m >>> 0, z = z === void 0 ? this.length : z >>> 0, a || (a = 0);
    let X;
    if (typeof a == "number")
      for (X = m; X < z; ++X)
        this[X] = a;
    else {
      const he = s.isBuffer(a) ? a : s.from(a, le), j = he.length;
      if (j === 0)
        throw new TypeError('The value "' + a + '" is invalid for argument "value"');
      for (X = 0; X < z - m; ++X)
        this[X + m] = he[X % j];
    }
    return this;
  };
  const D = {};
  function L(U, a, m) {
    D[U] = class extends m {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: a.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${U}]`, this.stack, delete this.name;
      }
      get code() {
        return U;
      }
      set code(le) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: le,
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
    function(U, a) {
      return `The "${U}" argument must be of type number. Received type ${typeof a}`;
    },
    TypeError
  ), L(
    "ERR_OUT_OF_RANGE",
    function(U, a, m) {
      let z = `The value of "${U}" is out of range.`, le = m;
      return Number.isInteger(m) && Math.abs(m) > 2 ** 32 ? le = H(String(m)) : typeof m == "bigint" && (le = String(m), (m > BigInt(2) ** BigInt(32) || m < -(BigInt(2) ** BigInt(32))) && (le = H(le)), le += "n"), z += ` It must be ${a}. Received ${le}`, z;
    },
    RangeError
  );
  function H(U) {
    let a = "", m = U.length;
    const z = U[0] === "-" ? 1 : 0;
    for (; m >= z + 4; m -= 3)
      a = `_${U.slice(m - 3, m)}${a}`;
    return `${U.slice(0, m)}${a}`;
  }
  function se(U, a, m) {
    Re(a, "offset"), (U[a] === void 0 || U[a + m] === void 0) && Ae(a, U.length - (m + 1));
  }
  function we(U, a, m, z, le, X) {
    if (U > m || U < a) {
      const he = typeof a == "bigint" ? "n" : "";
      let j;
      throw a === 0 || a === BigInt(0) ? j = `>= 0${he} and < 2${he} ** ${(X + 1) * 8}${he}` : j = `>= -(2${he} ** ${(X + 1) * 8 - 1}${he}) and < 2 ** ${(X + 1) * 8 - 1}${he}`, new D.ERR_OUT_OF_RANGE("value", j, U);
    }
    se(z, le, X);
  }
  function Re(U, a) {
    if (typeof U != "number")
      throw new D.ERR_INVALID_ARG_TYPE(a, "number", U);
  }
  function Ae(U, a, m) {
    throw Math.floor(U) !== U ? (Re(U, m), new D.ERR_OUT_OF_RANGE("offset", "an integer", U)) : a < 0 ? new D.ERR_BUFFER_OUT_OF_BOUNDS() : new D.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${a}`,
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
  function Fe(U, a) {
    a = a || 1 / 0;
    let m;
    const z = U.length;
    let le = null;
    const X = [];
    for (let he = 0; he < z; ++he) {
      if (m = U.charCodeAt(he), m > 55295 && m < 57344) {
        if (!le) {
          if (m > 56319) {
            (a -= 3) > -1 && X.push(239, 191, 189);
            continue;
          } else if (he + 1 === z) {
            (a -= 3) > -1 && X.push(239, 191, 189);
            continue;
          }
          le = m;
          continue;
        }
        if (m < 56320) {
          (a -= 3) > -1 && X.push(239, 191, 189), le = m;
          continue;
        }
        m = (le - 55296 << 10 | m - 56320) + 65536;
      } else le && (a -= 3) > -1 && X.push(239, 191, 189);
      if (le = null, m < 128) {
        if ((a -= 1) < 0) break;
        X.push(m);
      } else if (m < 2048) {
        if ((a -= 2) < 0) break;
        X.push(
          m >> 6 | 192,
          m & 63 | 128
        );
      } else if (m < 65536) {
        if ((a -= 3) < 0) break;
        X.push(
          m >> 12 | 224,
          m >> 6 & 63 | 128,
          m & 63 | 128
        );
      } else if (m < 1114112) {
        if ((a -= 4) < 0) break;
        X.push(
          m >> 18 | 240,
          m >> 12 & 63 | 128,
          m >> 6 & 63 | 128,
          m & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return X;
  }
  function Ce(U) {
    const a = [];
    for (let m = 0; m < U.length; ++m)
      a.push(U.charCodeAt(m) & 255);
    return a;
  }
  function qe(U, a) {
    let m, z, le;
    const X = [];
    for (let he = 0; he < U.length && !((a -= 2) < 0); ++he)
      m = U.charCodeAt(he), z = m >> 8, le = m % 256, X.push(le), X.push(z);
    return X;
  }
  function Ue(U) {
    return e.toByteArray(te(U));
  }
  function me(U, a, m, z) {
    let le;
    for (le = 0; le < z && !(le + m >= a.length || le >= U.length); ++le)
      a[le + m] = U[le];
    return le;
  }
  function Se(U, a) {
    return U instanceof a || U != null && U.constructor != null && U.constructor.name != null && U.constructor.name === a.name;
  }
  function Le(U) {
    return U !== U;
  }
  const Me = (function() {
    const U = "0123456789abcdef", a = new Array(256);
    for (let m = 0; m < 16; ++m) {
      const z = m * 16;
      for (let le = 0; le < 16; ++le)
        a[z + le] = U[m] + U[le];
    }
    return a;
  })();
  function je(U) {
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
    for (var o = 1; o < arguments.length; o++)
      e[o - 1] = arguments[o];
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
    var e = {}, o = {};
    o.byteLength = s, o.toByteArray = E, o.fromByteArray = T;
    for (var l = [], r = [], n = typeof Uint8Array < "u" ? Uint8Array : Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", u = 0, b = f.length; u < b; ++u)
      l[u] = f[u], r[f.charCodeAt(u)] = u;
    r[45] = 62, r[95] = 63;
    function S(A) {
      var w = A.length;
      if (w % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var I = A.indexOf("=");
      I === -1 && (I = w);
      var R = I === w ? 0 : 4 - I % 4;
      return [I, R];
    }
    function s(A) {
      var w = S(A), I = w[0], R = w[1];
      return (I + R) * 3 / 4 - R;
    }
    function v(A, w, I) {
      return (w + I) * 3 / 4 - I;
    }
    function E(A) {
      var w, I = S(A), R = I[0], F = I[1], x = new n(v(A, R, F)), M = 0, Q = F > 0 ? R - 4 : R, C;
      for (C = 0; C < Q; C += 4)
        w = r[A.charCodeAt(C)] << 18 | r[A.charCodeAt(C + 1)] << 12 | r[A.charCodeAt(C + 2)] << 6 | r[A.charCodeAt(C + 3)], x[M++] = w >> 16 & 255, x[M++] = w >> 8 & 255, x[M++] = w & 255;
      return F === 2 && (w = r[A.charCodeAt(C)] << 2 | r[A.charCodeAt(C + 1)] >> 4, x[M++] = w & 255), F === 1 && (w = r[A.charCodeAt(C)] << 10 | r[A.charCodeAt(C + 1)] << 4 | r[A.charCodeAt(C + 2)] >> 2, x[M++] = w >> 8 & 255, x[M++] = w & 255), x;
    }
    function q(A) {
      return l[A >> 18 & 63] + l[A >> 12 & 63] + l[A >> 6 & 63] + l[A & 63];
    }
    function p(A, w, I) {
      for (var R, F = [], x = w; x < I; x += 3)
        R = (A[x] << 16 & 16711680) + (A[x + 1] << 8 & 65280) + (A[x + 2] & 255), F.push(q(R));
      return F.join("");
    }
    function T(A) {
      for (var w, I = A.length, R = I % 3, F = [], x = 16383, M = 0, Q = I - R; M < Q; M += x)
        F.push(p(A, M, M + x > Q ? Q : M + x));
      return R === 1 ? (w = A[I - 1], F.push(
        l[w >> 2] + l[w << 4 & 63] + "=="
      )) : R === 2 && (w = (A[I - 2] << 8) + A[I - 1], F.push(
        l[w >> 10] + l[w >> 4 & 63] + l[w << 2 & 63] + "="
      )), F.join("");
    }
    var d = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    d.read = function(A, w, I, R, F) {
      var x, M, Q = F * 8 - R - 1, C = (1 << Q) - 1, W = C >> 1, h = -7, $ = I ? F - 1 : 0, ae = I ? -1 : 1, de = A[w + $];
      for ($ += ae, x = de & (1 << -h) - 1, de >>= -h, h += Q; h > 0; x = x * 256 + A[w + $], $ += ae, h -= 8)
        ;
      for (M = x & (1 << -h) - 1, x >>= -h, h += R; h > 0; M = M * 256 + A[w + $], $ += ae, h -= 8)
        ;
      if (x === 0)
        x = 1 - W;
      else {
        if (x === C)
          return M ? NaN : (de ? -1 : 1) * (1 / 0);
        M = M + Math.pow(2, R), x = x - W;
      }
      return (de ? -1 : 1) * M * Math.pow(2, x - R);
    }, d.write = function(A, w, I, R, F, x) {
      var M, Q, C, W = x * 8 - F - 1, h = (1 << W) - 1, $ = h >> 1, ae = F === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, de = R ? 0 : x - 1, Ee = R ? 1 : -1, _e = w < 0 || w === 0 && 1 / w < 0 ? 1 : 0;
      for (w = Math.abs(w), isNaN(w) || w === 1 / 0 ? (Q = isNaN(w) ? 1 : 0, M = h) : (M = Math.floor(Math.log(w) / Math.LN2), w * (C = Math.pow(2, -M)) < 1 && (M--, C *= 2), M + $ >= 1 ? w += ae / C : w += ae * Math.pow(2, 1 - $), w * C >= 2 && (M++, C /= 2), M + $ >= h ? (Q = 0, M = h) : M + $ >= 1 ? (Q = (w * C - 1) * Math.pow(2, F), M = M + $) : (Q = w * Math.pow(2, $ - 1) * Math.pow(2, F), M = 0)); F >= 8; A[I + de] = Q & 255, de += Ee, Q /= 256, F -= 8)
        ;
      for (M = M << F | Q, W += F; W > 0; A[I + de] = M & 255, de += Ee, M /= 256, W -= 8)
        ;
      A[I + de - Ee] |= _e * 128;
    };
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    (function(A) {
      const w = o, I = d, R = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      A.Buffer = h, A.SlowBuffer = J, A.INSPECT_MAX_BYTES = 50;
      const F = 2147483647;
      A.kMaxLength = F;
      const { Uint8Array: x, ArrayBuffer: M, SharedArrayBuffer: Q } = globalThis;
      h.TYPED_ARRAY_SUPPORT = C(), !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function C() {
        try {
          const g = new x(1), c = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(c, x.prototype), Object.setPrototypeOf(g, c), g.foo() === 42;
        } catch {
          return !1;
        }
      }
      Object.defineProperty(h.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (h.isBuffer(this))
            return this.buffer;
        }
      }), Object.defineProperty(h.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (h.isBuffer(this))
            return this.byteOffset;
        }
      });
      function W(g) {
        if (g > F)
          throw new RangeError('The value "' + g + '" is invalid for option "size"');
        const c = new x(g);
        return Object.setPrototypeOf(c, h.prototype), c;
      }
      function h(g, c, P) {
        if (typeof g == "number") {
          if (typeof c == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return Ee(g);
        }
        return $(g, c, P);
      }
      h.poolSize = 8192;
      function $(g, c, P) {
        if (typeof g == "string")
          return _e(g, c);
        if (M.isView(g))
          return fe(g);
        if (g == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof g
          );
        if (V(g, M) || g && V(g.buffer, M) || typeof Q < "u" && (V(g, Q) || g && V(g.buffer, Q)))
          return k(g, c, P);
        if (typeof g == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const Y = g.valueOf && g.valueOf();
        if (Y != null && Y !== g)
          return h.from(Y, c, P);
        const ye = pe(g);
        if (ye) return ye;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof g[Symbol.toPrimitive] == "function")
          return h.from(g[Symbol.toPrimitive]("string"), c, P);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof g
        );
      }
      h.from = function(g, c, P) {
        return $(g, c, P);
      }, Object.setPrototypeOf(h.prototype, x.prototype), Object.setPrototypeOf(h, x);
      function ae(g) {
        if (typeof g != "number")
          throw new TypeError('"size" argument must be of type number');
        if (g < 0)
          throw new RangeError('The value "' + g + '" is invalid for option "size"');
      }
      function de(g, c, P) {
        return ae(g), g <= 0 ? W(g) : c !== void 0 ? typeof P == "string" ? W(g).fill(c, P) : W(g).fill(c) : W(g);
      }
      h.alloc = function(g, c, P) {
        return de(g, c, P);
      };
      function Ee(g) {
        return ae(g), W(g < 0 ? 0 : ee(g) | 0);
      }
      h.allocUnsafe = function(g) {
        return Ee(g);
      }, h.allocUnsafeSlow = function(g) {
        return Ee(g);
      };
      function _e(g, c) {
        if ((typeof c != "string" || c === "") && (c = "utf8"), !h.isEncoding(c))
          throw new TypeError("Unknown encoding: " + c);
        const P = G(g, c) | 0;
        let Y = W(P);
        const ye = Y.write(g, c);
        return ye !== P && (Y = Y.slice(0, ye)), Y;
      }
      function ce(g) {
        const c = g.length < 0 ? 0 : ee(g.length) | 0, P = W(c);
        for (let Y = 0; Y < c; Y += 1)
          P[Y] = g[Y] & 255;
        return P;
      }
      function fe(g) {
        if (V(g, x)) {
          const c = new x(g);
          return k(c.buffer, c.byteOffset, c.byteLength);
        }
        return ce(g);
      }
      function k(g, c, P) {
        if (c < 0 || g.byteLength < c)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (g.byteLength < c + (P || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let Y;
        return c === void 0 && P === void 0 ? Y = new x(g) : P === void 0 ? Y = new x(g, c) : Y = new x(g, c, P), Object.setPrototypeOf(Y, h.prototype), Y;
      }
      function pe(g) {
        if (h.isBuffer(g)) {
          const c = ee(g.length) | 0, P = W(c);
          return P.length === 0 || g.copy(P, 0, 0, c), P;
        }
        if (g.length !== void 0)
          return typeof g.length != "number" || be(g.length) ? W(0) : ce(g);
        if (g.type === "Buffer" && Array.isArray(g.data))
          return ce(g.data);
      }
      function ee(g) {
        if (g >= F)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + F.toString(16) + " bytes");
        return g | 0;
      }
      function J(g) {
        return +g != g && (g = 0), h.alloc(+g);
      }
      h.isBuffer = function(c) {
        return c != null && c._isBuffer === !0 && c !== h.prototype;
      }, h.compare = function(c, P) {
        if (V(c, x) && (c = h.from(c, c.offset, c.byteLength)), V(P, x) && (P = h.from(P, P.offset, P.byteLength)), !h.isBuffer(c) || !h.isBuffer(P))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (c === P) return 0;
        let Y = c.length, ye = P.length;
        for (let Te = 0, ie = Math.min(Y, ye); Te < ie; ++Te)
          if (c[Te] !== P[Te]) {
            Y = c[Te], ye = P[Te];
            break;
          }
        return Y < ye ? -1 : ye < Y ? 1 : 0;
      }, h.isEncoding = function(c) {
        switch (String(c).toLowerCase()) {
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
      }, h.concat = function(c, P) {
        if (!Array.isArray(c))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (c.length === 0)
          return h.alloc(0);
        let Y;
        if (P === void 0)
          for (P = 0, Y = 0; Y < c.length; ++Y)
            P += c[Y].length;
        const ye = h.allocUnsafe(P);
        let Te = 0;
        for (Y = 0; Y < c.length; ++Y) {
          let ie = c[Y];
          if (V(ie, x))
            Te + ie.length > ye.length ? (h.isBuffer(ie) || (ie = h.from(ie)), ie.copy(ye, Te)) : x.prototype.set.call(
              ye,
              ie,
              Te
            );
          else if (h.isBuffer(ie))
            ie.copy(ye, Te);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          Te += ie.length;
        }
        return ye;
      };
      function G(g, c) {
        if (h.isBuffer(g))
          return g.length;
        if (M.isView(g) || V(g, M))
          return g.byteLength;
        if (typeof g != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof g
          );
        const P = g.length, Y = arguments.length > 2 && arguments[2] === !0;
        if (!Y && P === 0) return 0;
        let ye = !1;
        for (; ; )
          switch (c) {
            case "ascii":
            case "latin1":
            case "binary":
              return P;
            case "utf8":
            case "utf-8":
              return Be(g).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return P * 2;
            case "hex":
              return P >>> 1;
            case "base64":
              return Ie(g).length;
            default:
              if (ye)
                return Y ? -1 : Be(g).length;
              c = ("" + c).toLowerCase(), ye = !0;
          }
      }
      h.byteLength = G;
      function ue(g, c, P) {
        let Y = !1;
        if ((c === void 0 || c < 0) && (c = 0), c > this.length || ((P === void 0 || P > this.length) && (P = this.length), P <= 0) || (P >>>= 0, c >>>= 0, P <= c))
          return "";
        for (g || (g = "utf8"); ; )
          switch (g) {
            case "hex":
              return Fe(this, c, P);
            case "utf8":
            case "utf-8":
              return we(this, c, P);
            case "ascii":
              return Oe(this, c, P);
            case "latin1":
            case "binary":
              return te(this, c, P);
            case "base64":
              return se(this, c, P);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Ce(this, c, P);
            default:
              if (Y) throw new TypeError("Unknown encoding: " + g);
              g = (g + "").toLowerCase(), Y = !0;
          }
      }
      h.prototype._isBuffer = !0;
      function O(g, c, P) {
        const Y = g[c];
        g[c] = g[P], g[P] = Y;
      }
      h.prototype.swap16 = function() {
        const c = this.length;
        if (c % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let P = 0; P < c; P += 2)
          O(this, P, P + 1);
        return this;
      }, h.prototype.swap32 = function() {
        const c = this.length;
        if (c % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let P = 0; P < c; P += 4)
          O(this, P, P + 3), O(this, P + 1, P + 2);
        return this;
      }, h.prototype.swap64 = function() {
        const c = this.length;
        if (c % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let P = 0; P < c; P += 8)
          O(this, P, P + 7), O(this, P + 1, P + 6), O(this, P + 2, P + 5), O(this, P + 3, P + 4);
        return this;
      }, h.prototype.toString = function() {
        const c = this.length;
        return c === 0 ? "" : arguments.length === 0 ? we(this, 0, c) : ue.apply(this, arguments);
      }, h.prototype.toLocaleString = h.prototype.toString, h.prototype.equals = function(c) {
        if (!h.isBuffer(c)) throw new TypeError("Argument must be a Buffer");
        return this === c ? !0 : h.compare(this, c) === 0;
      }, h.prototype.inspect = function() {
        let c = "";
        const P = A.INSPECT_MAX_BYTES;
        return c = this.toString("hex", 0, P).replace(/(.{2})/g, "$1 ").trim(), this.length > P && (c += " ... "), "<Buffer " + c + ">";
      }, R && (h.prototype[R] = h.prototype.inspect), h.prototype.compare = function(c, P, Y, ye, Te) {
        if (V(c, x) && (c = h.from(c, c.offset, c.byteLength)), !h.isBuffer(c))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof c
          );
        if (P === void 0 && (P = 0), Y === void 0 && (Y = c ? c.length : 0), ye === void 0 && (ye = 0), Te === void 0 && (Te = this.length), P < 0 || Y > c.length || ye < 0 || Te > this.length)
          throw new RangeError("out of range index");
        if (ye >= Te && P >= Y)
          return 0;
        if (ye >= Te)
          return -1;
        if (P >= Y)
          return 1;
        if (P >>>= 0, Y >>>= 0, ye >>>= 0, Te >>>= 0, this === c) return 0;
        let ie = Te - ye, oe = Y - P;
        const ve = Math.min(ie, oe), xe = this.slice(ye, Te), Pe = c.slice(P, Y);
        for (let ke = 0; ke < ve; ++ke)
          if (xe[ke] !== Pe[ke]) {
            ie = xe[ke], oe = Pe[ke];
            break;
          }
        return ie < oe ? -1 : oe < ie ? 1 : 0;
      };
      function B(g, c, P, Y, ye) {
        if (g.length === 0) return -1;
        if (typeof P == "string" ? (Y = P, P = 0) : P > 2147483647 ? P = 2147483647 : P < -2147483648 && (P = -2147483648), P = +P, be(P) && (P = ye ? 0 : g.length - 1), P < 0 && (P = g.length + P), P >= g.length) {
          if (ye) return -1;
          P = g.length - 1;
        } else if (P < 0)
          if (ye) P = 0;
          else return -1;
        if (typeof c == "string" && (c = h.from(c, Y)), h.isBuffer(c))
          return c.length === 0 ? -1 : N(g, c, P, Y, ye);
        if (typeof c == "number")
          return c = c & 255, typeof x.prototype.indexOf == "function" ? ye ? x.prototype.indexOf.call(g, c, P) : x.prototype.lastIndexOf.call(g, c, P) : N(g, [c], P, Y, ye);
        throw new TypeError("val must be string, number or Buffer");
      }
      function N(g, c, P, Y, ye) {
        let Te = 1, ie = g.length, oe = c.length;
        if (Y !== void 0 && (Y = String(Y).toLowerCase(), Y === "ucs2" || Y === "ucs-2" || Y === "utf16le" || Y === "utf-16le")) {
          if (g.length < 2 || c.length < 2)
            return -1;
          Te = 2, ie /= 2, oe /= 2, P /= 2;
        }
        function ve(Pe, ke) {
          return Te === 1 ? Pe[ke] : Pe.readUInt16BE(ke * Te);
        }
        let xe;
        if (ye) {
          let Pe = -1;
          for (xe = P; xe < ie; xe++)
            if (ve(g, xe) === ve(c, Pe === -1 ? 0 : xe - Pe)) {
              if (Pe === -1 && (Pe = xe), xe - Pe + 1 === oe) return Pe * Te;
            } else
              Pe !== -1 && (xe -= xe - Pe), Pe = -1;
        } else
          for (P + oe > ie && (P = ie - oe), xe = P; xe >= 0; xe--) {
            let Pe = !0;
            for (let ke = 0; ke < oe; ke++)
              if (ve(g, xe + ke) !== ve(c, ke)) {
                Pe = !1;
                break;
              }
            if (Pe) return xe;
          }
        return -1;
      }
      h.prototype.includes = function(c, P, Y) {
        return this.indexOf(c, P, Y) !== -1;
      }, h.prototype.indexOf = function(c, P, Y) {
        return B(this, c, P, Y, !0);
      }, h.prototype.lastIndexOf = function(c, P, Y) {
        return B(this, c, P, Y, !1);
      };
      function re(g, c, P, Y) {
        P = Number(P) || 0;
        const ye = g.length - P;
        Y ? (Y = Number(Y), Y > ye && (Y = ye)) : Y = ye;
        const Te = c.length;
        Y > Te / 2 && (Y = Te / 2);
        let ie;
        for (ie = 0; ie < Y; ++ie) {
          const oe = parseInt(c.substr(ie * 2, 2), 16);
          if (be(oe)) return ie;
          g[P + ie] = oe;
        }
        return ie;
      }
      function ne(g, c, P, Y) {
        return De(Be(c, g.length - P), g, P, Y);
      }
      function D(g, c, P, Y) {
        return De(We(c), g, P, Y);
      }
      function L(g, c, P, Y) {
        return De(Ie(c), g, P, Y);
      }
      function H(g, c, P, Y) {
        return De(_(c, g.length - P), g, P, Y);
      }
      h.prototype.write = function(c, P, Y, ye) {
        if (P === void 0)
          ye = "utf8", Y = this.length, P = 0;
        else if (Y === void 0 && typeof P == "string")
          ye = P, Y = this.length, P = 0;
        else if (isFinite(P))
          P = P >>> 0, isFinite(Y) ? (Y = Y >>> 0, ye === void 0 && (ye = "utf8")) : (ye = Y, Y = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const Te = this.length - P;
        if ((Y === void 0 || Y > Te) && (Y = Te), c.length > 0 && (Y < 0 || P < 0) || P > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        ye || (ye = "utf8");
        let ie = !1;
        for (; ; )
          switch (ye) {
            case "hex":
              return re(this, c, P, Y);
            case "utf8":
            case "utf-8":
              return ne(this, c, P, Y);
            case "ascii":
            case "latin1":
            case "binary":
              return D(this, c, P, Y);
            case "base64":
              return L(this, c, P, Y);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return H(this, c, P, Y);
            default:
              if (ie) throw new TypeError("Unknown encoding: " + ye);
              ye = ("" + ye).toLowerCase(), ie = !0;
          }
      }, h.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function se(g, c, P) {
        return c === 0 && P === g.length ? w.fromByteArray(g) : w.fromByteArray(g.slice(c, P));
      }
      function we(g, c, P) {
        P = Math.min(g.length, P);
        const Y = [];
        let ye = c;
        for (; ye < P; ) {
          const Te = g[ye];
          let ie = null, oe = Te > 239 ? 4 : Te > 223 ? 3 : Te > 191 ? 2 : 1;
          if (ye + oe <= P) {
            let ve, xe, Pe, ke;
            switch (oe) {
              case 1:
                Te < 128 && (ie = Te);
                break;
              case 2:
                ve = g[ye + 1], (ve & 192) === 128 && (ke = (Te & 31) << 6 | ve & 63, ke > 127 && (ie = ke));
                break;
              case 3:
                ve = g[ye + 1], xe = g[ye + 2], (ve & 192) === 128 && (xe & 192) === 128 && (ke = (Te & 15) << 12 | (ve & 63) << 6 | xe & 63, ke > 2047 && (ke < 55296 || ke > 57343) && (ie = ke));
                break;
              case 4:
                ve = g[ye + 1], xe = g[ye + 2], Pe = g[ye + 3], (ve & 192) === 128 && (xe & 192) === 128 && (Pe & 192) === 128 && (ke = (Te & 15) << 18 | (ve & 63) << 12 | (xe & 63) << 6 | Pe & 63, ke > 65535 && ke < 1114112 && (ie = ke));
            }
          }
          ie === null ? (ie = 65533, oe = 1) : ie > 65535 && (ie -= 65536, Y.push(ie >>> 10 & 1023 | 55296), ie = 56320 | ie & 1023), Y.push(ie), ye += oe;
        }
        return Ae(Y);
      }
      const Re = 4096;
      function Ae(g) {
        const c = g.length;
        if (c <= Re)
          return String.fromCharCode.apply(String, g);
        let P = "", Y = 0;
        for (; Y < c; )
          P += String.fromCharCode.apply(
            String,
            g.slice(Y, Y += Re)
          );
        return P;
      }
      function Oe(g, c, P) {
        let Y = "";
        P = Math.min(g.length, P);
        for (let ye = c; ye < P; ++ye)
          Y += String.fromCharCode(g[ye] & 127);
        return Y;
      }
      function te(g, c, P) {
        let Y = "";
        P = Math.min(g.length, P);
        for (let ye = c; ye < P; ++ye)
          Y += String.fromCharCode(g[ye]);
        return Y;
      }
      function Fe(g, c, P) {
        const Y = g.length;
        (!c || c < 0) && (c = 0), (!P || P < 0 || P > Y) && (P = Y);
        let ye = "";
        for (let Te = c; Te < P; ++Te)
          ye += $e[g[Te]];
        return ye;
      }
      function Ce(g, c, P) {
        const Y = g.slice(c, P);
        let ye = "";
        for (let Te = 0; Te < Y.length - 1; Te += 2)
          ye += String.fromCharCode(Y[Te] + Y[Te + 1] * 256);
        return ye;
      }
      h.prototype.slice = function(c, P) {
        const Y = this.length;
        c = ~~c, P = P === void 0 ? Y : ~~P, c < 0 ? (c += Y, c < 0 && (c = 0)) : c > Y && (c = Y), P < 0 ? (P += Y, P < 0 && (P = 0)) : P > Y && (P = Y), P < c && (P = c);
        const ye = this.subarray(c, P);
        return Object.setPrototypeOf(ye, h.prototype), ye;
      };
      function qe(g, c, P) {
        if (g % 1 !== 0 || g < 0) throw new RangeError("offset is not uint");
        if (g + c > P) throw new RangeError("Trying to access beyond buffer length");
      }
      h.prototype.readUintLE = h.prototype.readUIntLE = function(c, P, Y) {
        c = c >>> 0, P = P >>> 0, Y || qe(c, P, this.length);
        let ye = this[c], Te = 1, ie = 0;
        for (; ++ie < P && (Te *= 256); )
          ye += this[c + ie] * Te;
        return ye;
      }, h.prototype.readUintBE = h.prototype.readUIntBE = function(c, P, Y) {
        c = c >>> 0, P = P >>> 0, Y || qe(c, P, this.length);
        let ye = this[c + --P], Te = 1;
        for (; P > 0 && (Te *= 256); )
          ye += this[c + --P] * Te;
        return ye;
      }, h.prototype.readUint8 = h.prototype.readUInt8 = function(c, P) {
        return c = c >>> 0, P || qe(c, 1, this.length), this[c];
      }, h.prototype.readUint16LE = h.prototype.readUInt16LE = function(c, P) {
        return c = c >>> 0, P || qe(c, 2, this.length), this[c] | this[c + 1] << 8;
      }, h.prototype.readUint16BE = h.prototype.readUInt16BE = function(c, P) {
        return c = c >>> 0, P || qe(c, 2, this.length), this[c] << 8 | this[c + 1];
      }, h.prototype.readUint32LE = h.prototype.readUInt32LE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), (this[c] | this[c + 1] << 8 | this[c + 2] << 16) + this[c + 3] * 16777216;
      }, h.prototype.readUint32BE = h.prototype.readUInt32BE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), this[c] * 16777216 + (this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3]);
      }, h.prototype.readBigUInt64LE = Ve(function(c) {
        c = c >>> 0, le(c, "offset");
        const P = this[c], Y = this[c + 7];
        (P === void 0 || Y === void 0) && X(c, this.length - 8);
        const ye = P + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24, Te = this[++c] + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + Y * 2 ** 24;
        return BigInt(ye) + (BigInt(Te) << BigInt(32));
      }), h.prototype.readBigUInt64BE = Ve(function(c) {
        c = c >>> 0, le(c, "offset");
        const P = this[c], Y = this[c + 7];
        (P === void 0 || Y === void 0) && X(c, this.length - 8);
        const ye = P * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c], Te = this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + Y;
        return (BigInt(ye) << BigInt(32)) + BigInt(Te);
      }), h.prototype.readIntLE = function(c, P, Y) {
        c = c >>> 0, P = P >>> 0, Y || qe(c, P, this.length);
        let ye = this[c], Te = 1, ie = 0;
        for (; ++ie < P && (Te *= 256); )
          ye += this[c + ie] * Te;
        return Te *= 128, ye >= Te && (ye -= Math.pow(2, 8 * P)), ye;
      }, h.prototype.readIntBE = function(c, P, Y) {
        c = c >>> 0, P = P >>> 0, Y || qe(c, P, this.length);
        let ye = P, Te = 1, ie = this[c + --ye];
        for (; ye > 0 && (Te *= 256); )
          ie += this[c + --ye] * Te;
        return Te *= 128, ie >= Te && (ie -= Math.pow(2, 8 * P)), ie;
      }, h.prototype.readInt8 = function(c, P) {
        return c = c >>> 0, P || qe(c, 1, this.length), this[c] & 128 ? (255 - this[c] + 1) * -1 : this[c];
      }, h.prototype.readInt16LE = function(c, P) {
        c = c >>> 0, P || qe(c, 2, this.length);
        const Y = this[c] | this[c + 1] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, h.prototype.readInt16BE = function(c, P) {
        c = c >>> 0, P || qe(c, 2, this.length);
        const Y = this[c + 1] | this[c] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, h.prototype.readInt32LE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), this[c] | this[c + 1] << 8 | this[c + 2] << 16 | this[c + 3] << 24;
      }, h.prototype.readInt32BE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), this[c] << 24 | this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3];
      }, h.prototype.readBigInt64LE = Ve(function(c) {
        c = c >>> 0, le(c, "offset");
        const P = this[c], Y = this[c + 7];
        (P === void 0 || Y === void 0) && X(c, this.length - 8);
        const ye = this[c + 4] + this[c + 5] * 2 ** 8 + this[c + 6] * 2 ** 16 + (Y << 24);
        return (BigInt(ye) << BigInt(32)) + BigInt(P + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24);
      }), h.prototype.readBigInt64BE = Ve(function(c) {
        c = c >>> 0, le(c, "offset");
        const P = this[c], Y = this[c + 7];
        (P === void 0 || Y === void 0) && X(c, this.length - 8);
        const ye = (P << 24) + // Overflow
        this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c];
        return (BigInt(ye) << BigInt(32)) + BigInt(this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + Y);
      }), h.prototype.readFloatLE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), I.read(this, c, !0, 23, 4);
      }, h.prototype.readFloatBE = function(c, P) {
        return c = c >>> 0, P || qe(c, 4, this.length), I.read(this, c, !1, 23, 4);
      }, h.prototype.readDoubleLE = function(c, P) {
        return c = c >>> 0, P || qe(c, 8, this.length), I.read(this, c, !0, 52, 8);
      }, h.prototype.readDoubleBE = function(c, P) {
        return c = c >>> 0, P || qe(c, 8, this.length), I.read(this, c, !1, 52, 8);
      };
      function Ue(g, c, P, Y, ye, Te) {
        if (!h.isBuffer(g)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (c > ye || c < Te) throw new RangeError('"value" argument is out of bounds');
        if (P + Y > g.length) throw new RangeError("Index out of range");
      }
      h.prototype.writeUintLE = h.prototype.writeUIntLE = function(c, P, Y, ye) {
        if (c = +c, P = P >>> 0, Y = Y >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Y) - 1;
          Ue(this, c, P, Y, oe, 0);
        }
        let Te = 1, ie = 0;
        for (this[P] = c & 255; ++ie < Y && (Te *= 256); )
          this[P + ie] = c / Te & 255;
        return P + Y;
      }, h.prototype.writeUintBE = h.prototype.writeUIntBE = function(c, P, Y, ye) {
        if (c = +c, P = P >>> 0, Y = Y >>> 0, !ye) {
          const oe = Math.pow(2, 8 * Y) - 1;
          Ue(this, c, P, Y, oe, 0);
        }
        let Te = Y - 1, ie = 1;
        for (this[P + Te] = c & 255; --Te >= 0 && (ie *= 256); )
          this[P + Te] = c / ie & 255;
        return P + Y;
      }, h.prototype.writeUint8 = h.prototype.writeUInt8 = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 1, 255, 0), this[P] = c & 255, P + 1;
      }, h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 2, 65535, 0), this[P] = c & 255, this[P + 1] = c >>> 8, P + 2;
      }, h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 2, 65535, 0), this[P] = c >>> 8, this[P + 1] = c & 255, P + 2;
      }, h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 4, 4294967295, 0), this[P + 3] = c >>> 24, this[P + 2] = c >>> 16, this[P + 1] = c >>> 8, this[P] = c & 255, P + 4;
      }, h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 4, 4294967295, 0), this[P] = c >>> 24, this[P + 1] = c >>> 16, this[P + 2] = c >>> 8, this[P + 3] = c & 255, P + 4;
      };
      function me(g, c, P, Y, ye) {
        z(c, Y, ye, g, P, 7);
        let Te = Number(c & BigInt(4294967295));
        g[P++] = Te, Te = Te >> 8, g[P++] = Te, Te = Te >> 8, g[P++] = Te, Te = Te >> 8, g[P++] = Te;
        let ie = Number(c >> BigInt(32) & BigInt(4294967295));
        return g[P++] = ie, ie = ie >> 8, g[P++] = ie, ie = ie >> 8, g[P++] = ie, ie = ie >> 8, g[P++] = ie, P;
      }
      function Se(g, c, P, Y, ye) {
        z(c, Y, ye, g, P, 7);
        let Te = Number(c & BigInt(4294967295));
        g[P + 7] = Te, Te = Te >> 8, g[P + 6] = Te, Te = Te >> 8, g[P + 5] = Te, Te = Te >> 8, g[P + 4] = Te;
        let ie = Number(c >> BigInt(32) & BigInt(4294967295));
        return g[P + 3] = ie, ie = ie >> 8, g[P + 2] = ie, ie = ie >> 8, g[P + 1] = ie, ie = ie >> 8, g[P] = ie, P + 8;
      }
      h.prototype.writeBigUInt64LE = Ve(function(c, P = 0) {
        return me(this, c, P, BigInt(0), BigInt("0xffffffffffffffff"));
      }), h.prototype.writeBigUInt64BE = Ve(function(c, P = 0) {
        return Se(this, c, P, BigInt(0), BigInt("0xffffffffffffffff"));
      }), h.prototype.writeIntLE = function(c, P, Y, ye) {
        if (c = +c, P = P >>> 0, !ye) {
          const ve = Math.pow(2, 8 * Y - 1);
          Ue(this, c, P, Y, ve - 1, -ve);
        }
        let Te = 0, ie = 1, oe = 0;
        for (this[P] = c & 255; ++Te < Y && (ie *= 256); )
          c < 0 && oe === 0 && this[P + Te - 1] !== 0 && (oe = 1), this[P + Te] = (c / ie >> 0) - oe & 255;
        return P + Y;
      }, h.prototype.writeIntBE = function(c, P, Y, ye) {
        if (c = +c, P = P >>> 0, !ye) {
          const ve = Math.pow(2, 8 * Y - 1);
          Ue(this, c, P, Y, ve - 1, -ve);
        }
        let Te = Y - 1, ie = 1, oe = 0;
        for (this[P + Te] = c & 255; --Te >= 0 && (ie *= 256); )
          c < 0 && oe === 0 && this[P + Te + 1] !== 0 && (oe = 1), this[P + Te] = (c / ie >> 0) - oe & 255;
        return P + Y;
      }, h.prototype.writeInt8 = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 1, 127, -128), c < 0 && (c = 255 + c + 1), this[P] = c & 255, P + 1;
      }, h.prototype.writeInt16LE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 2, 32767, -32768), this[P] = c & 255, this[P + 1] = c >>> 8, P + 2;
      }, h.prototype.writeInt16BE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 2, 32767, -32768), this[P] = c >>> 8, this[P + 1] = c & 255, P + 2;
      }, h.prototype.writeInt32LE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 4, 2147483647, -2147483648), this[P] = c & 255, this[P + 1] = c >>> 8, this[P + 2] = c >>> 16, this[P + 3] = c >>> 24, P + 4;
      }, h.prototype.writeInt32BE = function(c, P, Y) {
        return c = +c, P = P >>> 0, Y || Ue(this, c, P, 4, 2147483647, -2147483648), c < 0 && (c = 4294967295 + c + 1), this[P] = c >>> 24, this[P + 1] = c >>> 16, this[P + 2] = c >>> 8, this[P + 3] = c & 255, P + 4;
      }, h.prototype.writeBigInt64LE = Ve(function(c, P = 0) {
        return me(this, c, P, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), h.prototype.writeBigInt64BE = Ve(function(c, P = 0) {
        return Se(this, c, P, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function Le(g, c, P, Y, ye, Te) {
        if (P + Y > g.length) throw new RangeError("Index out of range");
        if (P < 0) throw new RangeError("Index out of range");
      }
      function Me(g, c, P, Y, ye) {
        return c = +c, P = P >>> 0, ye || Le(g, c, P, 4), I.write(g, c, P, Y, 23, 4), P + 4;
      }
      h.prototype.writeFloatLE = function(c, P, Y) {
        return Me(this, c, P, !0, Y);
      }, h.prototype.writeFloatBE = function(c, P, Y) {
        return Me(this, c, P, !1, Y);
      };
      function je(g, c, P, Y, ye) {
        return c = +c, P = P >>> 0, ye || Le(g, c, P, 8), I.write(g, c, P, Y, 52, 8), P + 8;
      }
      h.prototype.writeDoubleLE = function(c, P, Y) {
        return je(this, c, P, !0, Y);
      }, h.prototype.writeDoubleBE = function(c, P, Y) {
        return je(this, c, P, !1, Y);
      }, h.prototype.copy = function(c, P, Y, ye) {
        if (!h.isBuffer(c)) throw new TypeError("argument should be a Buffer");
        if (Y || (Y = 0), !ye && ye !== 0 && (ye = this.length), P >= c.length && (P = c.length), P || (P = 0), ye > 0 && ye < Y && (ye = Y), ye === Y || c.length === 0 || this.length === 0) return 0;
        if (P < 0)
          throw new RangeError("targetStart out of bounds");
        if (Y < 0 || Y >= this.length) throw new RangeError("Index out of range");
        if (ye < 0) throw new RangeError("sourceEnd out of bounds");
        ye > this.length && (ye = this.length), c.length - P < ye - Y && (ye = c.length - P + Y);
        const Te = ye - Y;
        return this === c && typeof x.prototype.copyWithin == "function" ? this.copyWithin(P, Y, ye) : x.prototype.set.call(
          c,
          this.subarray(Y, ye),
          P
        ), Te;
      }, h.prototype.fill = function(c, P, Y, ye) {
        if (typeof c == "string") {
          if (typeof P == "string" ? (ye = P, P = 0, Y = this.length) : typeof Y == "string" && (ye = Y, Y = this.length), ye !== void 0 && typeof ye != "string")
            throw new TypeError("encoding must be a string");
          if (typeof ye == "string" && !h.isEncoding(ye))
            throw new TypeError("Unknown encoding: " + ye);
          if (c.length === 1) {
            const ie = c.charCodeAt(0);
            (ye === "utf8" && ie < 128 || ye === "latin1") && (c = ie);
          }
        } else typeof c == "number" ? c = c & 255 : typeof c == "boolean" && (c = Number(c));
        if (P < 0 || this.length < P || this.length < Y)
          throw new RangeError("Out of range index");
        if (Y <= P)
          return this;
        P = P >>> 0, Y = Y === void 0 ? this.length : Y >>> 0, c || (c = 0);
        let Te;
        if (typeof c == "number")
          for (Te = P; Te < Y; ++Te)
            this[Te] = c;
        else {
          const ie = h.isBuffer(c) ? c : h.from(c, ye), oe = ie.length;
          if (oe === 0)
            throw new TypeError('The value "' + c + '" is invalid for argument "value"');
          for (Te = 0; Te < Y - P; ++Te)
            this[Te + P] = ie[Te % oe];
        }
        return this;
      };
      const He = {};
      function U(g, c, P) {
        He[g] = class extends P {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: c.apply(this, arguments),
              writable: !0,
              configurable: !0
            }), this.name = `${this.name} [${g}]`, this.stack, delete this.name;
          }
          get code() {
            return g;
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
            return `${this.name} [${g}]: ${this.message}`;
          }
        };
      }
      U(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(g) {
          return g ? `${g} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        },
        RangeError
      ), U(
        "ERR_INVALID_ARG_TYPE",
        function(g, c) {
          return `The "${g}" argument must be of type number. Received type ${typeof c}`;
        },
        TypeError
      ), U(
        "ERR_OUT_OF_RANGE",
        function(g, c, P) {
          let Y = `The value of "${g}" is out of range.`, ye = P;
          return Number.isInteger(P) && Math.abs(P) > 2 ** 32 ? ye = a(String(P)) : typeof P == "bigint" && (ye = String(P), (P > BigInt(2) ** BigInt(32) || P < -(BigInt(2) ** BigInt(32))) && (ye = a(ye)), ye += "n"), Y += ` It must be ${c}. Received ${ye}`, Y;
        },
        RangeError
      );
      function a(g) {
        let c = "", P = g.length;
        const Y = g[0] === "-" ? 1 : 0;
        for (; P >= Y + 4; P -= 3)
          c = `_${g.slice(P - 3, P)}${c}`;
        return `${g.slice(0, P)}${c}`;
      }
      function m(g, c, P) {
        le(c, "offset"), (g[c] === void 0 || g[c + P] === void 0) && X(c, g.length - (P + 1));
      }
      function z(g, c, P, Y, ye, Te) {
        if (g > P || g < c) {
          const ie = typeof c == "bigint" ? "n" : "";
          let oe;
          throw c === 0 || c === BigInt(0) ? oe = `>= 0${ie} and < 2${ie} ** ${(Te + 1) * 8}${ie}` : oe = `>= -(2${ie} ** ${(Te + 1) * 8 - 1}${ie}) and < 2 ** ${(Te + 1) * 8 - 1}${ie}`, new He.ERR_OUT_OF_RANGE("value", oe, g);
        }
        m(Y, ye, Te);
      }
      function le(g, c) {
        if (typeof g != "number")
          throw new He.ERR_INVALID_ARG_TYPE(c, "number", g);
      }
      function X(g, c, P) {
        throw Math.floor(g) !== g ? (le(g, P), new He.ERR_OUT_OF_RANGE("offset", "an integer", g)) : c < 0 ? new He.ERR_BUFFER_OUT_OF_BOUNDS() : new He.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${c}`,
          g
        );
      }
      const he = /[^+/0-9A-Za-z-_]/g;
      function j(g) {
        if (g = g.split("=")[0], g = g.trim().replace(he, ""), g.length < 2) return "";
        for (; g.length % 4 !== 0; )
          g = g + "=";
        return g;
      }
      function Be(g, c) {
        c = c || 1 / 0;
        let P;
        const Y = g.length;
        let ye = null;
        const Te = [];
        for (let ie = 0; ie < Y; ++ie) {
          if (P = g.charCodeAt(ie), P > 55295 && P < 57344) {
            if (!ye) {
              if (P > 56319) {
                (c -= 3) > -1 && Te.push(239, 191, 189);
                continue;
              } else if (ie + 1 === Y) {
                (c -= 3) > -1 && Te.push(239, 191, 189);
                continue;
              }
              ye = P;
              continue;
            }
            if (P < 56320) {
              (c -= 3) > -1 && Te.push(239, 191, 189), ye = P;
              continue;
            }
            P = (ye - 55296 << 10 | P - 56320) + 65536;
          } else ye && (c -= 3) > -1 && Te.push(239, 191, 189);
          if (ye = null, P < 128) {
            if ((c -= 1) < 0) break;
            Te.push(P);
          } else if (P < 2048) {
            if ((c -= 2) < 0) break;
            Te.push(
              P >> 6 | 192,
              P & 63 | 128
            );
          } else if (P < 65536) {
            if ((c -= 3) < 0) break;
            Te.push(
              P >> 12 | 224,
              P >> 6 & 63 | 128,
              P & 63 | 128
            );
          } else if (P < 1114112) {
            if ((c -= 4) < 0) break;
            Te.push(
              P >> 18 | 240,
              P >> 12 & 63 | 128,
              P >> 6 & 63 | 128,
              P & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return Te;
      }
      function We(g) {
        const c = [];
        for (let P = 0; P < g.length; ++P)
          c.push(g.charCodeAt(P) & 255);
        return c;
      }
      function _(g, c) {
        let P, Y, ye;
        const Te = [];
        for (let ie = 0; ie < g.length && !((c -= 2) < 0); ++ie)
          P = g.charCodeAt(ie), Y = P >> 8, ye = P % 256, Te.push(ye), Te.push(Y);
        return Te;
      }
      function Ie(g) {
        return w.toByteArray(j(g));
      }
      function De(g, c, P, Y) {
        let ye;
        for (ye = 0; ye < Y && !(ye + P >= c.length || ye >= g.length); ++ye)
          c[ye + P] = g[ye];
        return ye;
      }
      function V(g, c) {
        return g instanceof c || g != null && g.constructor != null && g.constructor.name != null && g.constructor.name === c.name;
      }
      function be(g) {
        return g !== g;
      }
      const $e = (function() {
        const g = "0123456789abcdef", c = new Array(256);
        for (let P = 0; P < 16; ++P) {
          const Y = P * 16;
          for (let ye = 0; ye < 16; ++ye)
            c[Y + ye] = g[P] + g[ye];
        }
        return c;
      })();
      function Ve(g) {
        return typeof BigInt > "u" ? Z : g;
      }
      function Z() {
        throw new Error("BigInt not supported");
      }
    })(e);
    const y = e.Buffer;
    t.Blob = e.Blob, t.BlobOptions = e.BlobOptions, t.Buffer = e.Buffer, t.File = e.File, t.FileOptions = e.FileOptions, t.INSPECT_MAX_BYTES = e.INSPECT_MAX_BYTES, t.SlowBuffer = e.SlowBuffer, t.TranscodeEncoding = e.TranscodeEncoding, t.atob = e.atob, t.btoa = e.btoa, t.constants = e.constants, t.default = y, t.isAscii = e.isAscii, t.isUtf8 = e.isUtf8, t.kMaxLength = e.kMaxLength, t.kStringMaxLength = e.kStringMaxLength, t.resolveObjectURL = e.resolveObjectURL, t.transcode = e.transcode;
  })(dist)), dist;
}
var events = { exports: {} }, hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var t = typeof Reflect == "object" ? Reflect : null, e = t && typeof t.apply == "function" ? t.apply : function(R, F, x) {
    return Function.prototype.apply.call(R, F, x);
  }, o;
  t && typeof t.ownKeys == "function" ? o = t.ownKeys : Object.getOwnPropertySymbols ? o = function(R) {
    return Object.getOwnPropertyNames(R).concat(Object.getOwnPropertySymbols(R));
  } : o = function(R) {
    return Object.getOwnPropertyNames(R);
  };
  function l(I) {
    console && console.warn && console.warn(I);
  }
  var r = Number.isNaN || function(R) {
    return R !== R;
  };
  function n() {
    n.init.call(this);
  }
  events.exports = n, events.exports.once = y, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._eventsCount = 0, n.prototype._maxListeners = void 0;
  var f = 10;
  function u(I) {
    if (typeof I != "function")
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof I);
  }
  Object.defineProperty(n, "defaultMaxListeners", {
    enumerable: !0,
    get: function() {
      return f;
    },
    set: function(I) {
      if (typeof I != "number" || I < 0 || r(I))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + I + ".");
      f = I;
    }
  }), n.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, n.prototype.setMaxListeners = function(R) {
    if (typeof R != "number" || R < 0 || r(R))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + R + ".");
    return this._maxListeners = R, this;
  };
  function b(I) {
    return I._maxListeners === void 0 ? n.defaultMaxListeners : I._maxListeners;
  }
  n.prototype.getMaxListeners = function() {
    return b(this);
  }, n.prototype.emit = function(R) {
    for (var F = [], x = 1; x < arguments.length; x++) F.push(arguments[x]);
    var M = R === "error", Q = this._events;
    if (Q !== void 0)
      M = M && Q.error === void 0;
    else if (!M)
      return !1;
    if (M) {
      var C;
      if (F.length > 0 && (C = F[0]), C instanceof Error)
        throw C;
      var W = new Error("Unhandled error." + (C ? " (" + C.message + ")" : ""));
      throw W.context = C, W;
    }
    var h = Q[R];
    if (h === void 0)
      return !1;
    if (typeof h == "function")
      e(h, this, F);
    else
      for (var $ = h.length, ae = p(h, $), x = 0; x < $; ++x)
        e(ae[x], this, F);
    return !0;
  };
  function S(I, R, F, x) {
    var M, Q, C;
    if (u(F), Q = I._events, Q === void 0 ? (Q = I._events = /* @__PURE__ */ Object.create(null), I._eventsCount = 0) : (Q.newListener !== void 0 && (I.emit(
      "newListener",
      R,
      F.listener ? F.listener : F
    ), Q = I._events), C = Q[R]), C === void 0)
      C = Q[R] = F, ++I._eventsCount;
    else if (typeof C == "function" ? C = Q[R] = x ? [F, C] : [C, F] : x ? C.unshift(F) : C.push(F), M = b(I), M > 0 && C.length > M && !C.warned) {
      C.warned = !0;
      var W = new Error("Possible EventEmitter memory leak detected. " + C.length + " " + String(R) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      W.name = "MaxListenersExceededWarning", W.emitter = I, W.type = R, W.count = C.length, l(W);
    }
    return I;
  }
  n.prototype.addListener = function(R, F) {
    return S(this, R, F, !1);
  }, n.prototype.on = n.prototype.addListener, n.prototype.prependListener = function(R, F) {
    return S(this, R, F, !0);
  };
  function s() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function v(I, R, F) {
    var x = { fired: !1, wrapFn: void 0, target: I, type: R, listener: F }, M = s.bind(x);
    return M.listener = F, x.wrapFn = M, M;
  }
  n.prototype.once = function(R, F) {
    return u(F), this.on(R, v(this, R, F)), this;
  }, n.prototype.prependOnceListener = function(R, F) {
    return u(F), this.prependListener(R, v(this, R, F)), this;
  }, n.prototype.removeListener = function(R, F) {
    var x, M, Q, C, W;
    if (u(F), M = this._events, M === void 0)
      return this;
    if (x = M[R], x === void 0)
      return this;
    if (x === F || x.listener === F)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete M[R], M.removeListener && this.emit("removeListener", R, x.listener || F));
    else if (typeof x != "function") {
      for (Q = -1, C = x.length - 1; C >= 0; C--)
        if (x[C] === F || x[C].listener === F) {
          W = x[C].listener, Q = C;
          break;
        }
      if (Q < 0)
        return this;
      Q === 0 ? x.shift() : T(x, Q), x.length === 1 && (M[R] = x[0]), M.removeListener !== void 0 && this.emit("removeListener", R, W || F);
    }
    return this;
  }, n.prototype.off = n.prototype.removeListener, n.prototype.removeAllListeners = function(R) {
    var F, x, M;
    if (x = this._events, x === void 0)
      return this;
    if (x.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : x[R] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete x[R]), this;
    if (arguments.length === 0) {
      var Q = Object.keys(x), C;
      for (M = 0; M < Q.length; ++M)
        C = Q[M], C !== "removeListener" && this.removeAllListeners(C);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (F = x[R], typeof F == "function")
      this.removeListener(R, F);
    else if (F !== void 0)
      for (M = F.length - 1; M >= 0; M--)
        this.removeListener(R, F[M]);
    return this;
  };
  function E(I, R, F) {
    var x = I._events;
    if (x === void 0)
      return [];
    var M = x[R];
    return M === void 0 ? [] : typeof M == "function" ? F ? [M.listener || M] : [M] : F ? d(M) : p(M, M.length);
  }
  n.prototype.listeners = function(R) {
    return E(this, R, !0);
  }, n.prototype.rawListeners = function(R) {
    return E(this, R, !1);
  }, n.listenerCount = function(I, R) {
    return typeof I.listenerCount == "function" ? I.listenerCount(R) : q.call(I, R);
  }, n.prototype.listenerCount = q;
  function q(I) {
    var R = this._events;
    if (R !== void 0) {
      var F = R[I];
      if (typeof F == "function")
        return 1;
      if (F !== void 0)
        return F.length;
    }
    return 0;
  }
  n.prototype.eventNames = function() {
    return this._eventsCount > 0 ? o(this._events) : [];
  };
  function p(I, R) {
    for (var F = new Array(R), x = 0; x < R; ++x)
      F[x] = I[x];
    return F;
  }
  function T(I, R) {
    for (; R + 1 < I.length; R++)
      I[R] = I[R + 1];
    I.pop();
  }
  function d(I) {
    for (var R = new Array(I.length), F = 0; F < R.length; ++F)
      R[F] = I[F].listener || I[F];
    return R;
  }
  function y(I, R) {
    return new Promise(function(F, x) {
      function M(C) {
        I.removeListener(R, Q), x(C);
      }
      function Q() {
        typeof I.removeListener == "function" && I.removeListener("error", M), F([].slice.call(arguments));
      }
      w(I, R, Q, { once: !0 }), R !== "error" && A(I, M, { once: !0 });
    });
  }
  function A(I, R, F) {
    typeof I.on == "function" && w(I, "error", R, F);
  }
  function w(I, R, F, x) {
    if (typeof I.on == "function")
      x.once ? I.once(R, F) : I.on(R, F);
    else if (typeof I.addEventListener == "function")
      I.addEventListener(R, function M(Q) {
        x.once && I.removeEventListener(R, M), F(Q);
      });
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof I);
  }
  return events.exports;
}
var inherits_browser = { exports: {} }, hasRequiredInherits_browser;
function requireInherits_browser() {
  return hasRequiredInherits_browser || (hasRequiredInherits_browser = 1, typeof Object.create == "function" ? inherits_browser.exports = function(e, o) {
    o && (e.super_ = o, e.prototype = Object.create(o.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : inherits_browser.exports = function(e, o) {
    if (o) {
      e.super_ = o;
      var l = function() {
      };
      l.prototype = o.prototype, e.prototype = new l(), e.prototype.constructor = e;
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
    var e = {}, o = Symbol("test"), l = Object(o);
    if (typeof o == "string" || Object.prototype.toString.call(o) !== "[object Symbol]" || Object.prototype.toString.call(l) !== "[object Symbol]")
      return !1;
    var r = 42;
    e[o] = r;
    for (var n in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var f = Object.getOwnPropertySymbols(e);
    if (f.length !== 1 || f[0] !== o || !Object.prototype.propertyIsEnumerable.call(e, o))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var u = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, o)
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
  return sign = function(o) {
    return t(o) || o === 0 ? o : o < 0 ? -1 : 1;
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
  var t = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, o = Math.max, l = "[object Function]", r = function(b, S) {
    for (var s = [], v = 0; v < b.length; v += 1)
      s[v] = b[v];
    for (var E = 0; E < S.length; E += 1)
      s[E + b.length] = S[E];
    return s;
  }, n = function(b, S) {
    for (var s = [], v = S, E = 0; v < b.length; v += 1, E += 1)
      s[E] = b[v];
    return s;
  }, f = function(u, b) {
    for (var S = "", s = 0; s < u.length; s += 1)
      S += u[s], s + 1 < u.length && (S += b);
    return S;
  };
  return implementation$4 = function(b) {
    var S = this;
    if (typeof S != "function" || e.apply(S) !== l)
      throw new TypeError(t + S);
    for (var s = n(arguments, 1), v, E = function() {
      if (this instanceof v) {
        var y = S.apply(
          this,
          r(s, arguments)
        );
        return Object(y) === y ? y : this;
      }
      return S.apply(
        b,
        r(s, arguments)
      );
    }, q = o(0, S.length - s.length), p = [], T = 0; T < q; T++)
      p[T] = "$" + T;
    if (v = Function("binder", "return function (" + f(p, ",") + "){ return binder.apply(this,arguments); }")(E), S.prototype) {
      var d = function() {
      };
      d.prototype = S.prototype, v.prototype = new d(), d.prototype = null;
    }
    return v;
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
  var t = requireFunctionBind(), e = requireFunctionApply(), o = requireFunctionCall(), l = requireReflectApply();
  return actualApply = l || t.call(o, e), actualApply;
}
var callBindApplyHelpers, hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var t = requireFunctionBind(), e = /* @__PURE__ */ requireType(), o = requireFunctionCall(), l = requireActualApply();
  return callBindApplyHelpers = function(n) {
    if (n.length < 1 || typeof n[0] != "function")
      throw new e("a function is required");
    return l(t, o, n);
  }, callBindApplyHelpers;
}
var get, hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var t = requireCallBindApplyHelpers(), e = /* @__PURE__ */ requireGopd(), o;
  try {
    o = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (f) {
    if (!f || typeof f != "object" || !("code" in f) || f.code !== "ERR_PROTO_ACCESS")
      throw f;
  }
  var l = !!o && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), r = Object, n = r.getPrototypeOf;
  return get = l && typeof l.get == "function" ? t([l.get]) : typeof n == "function" ? (
    /** @type {import('./get')} */
    function(u) {
      return n(u == null ? u : r(u));
    }
  ) : !1, get;
}
var getProto, hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto;
  hasRequiredGetProto = 1;
  var t = requireReflect_getPrototypeOf(), e = requireObject_getPrototypeOf(), o = /* @__PURE__ */ requireGet();
  return getProto = t ? function(r) {
    return t(r);
  } : e ? function(r) {
    if (!r || typeof r != "object" && typeof r != "function")
      throw new TypeError("getProto: not an object");
    return e(r);
  } : o ? function(r) {
    return o(r);
  } : null, getProto;
}
var hasown, hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var t = Function.prototype.call, e = Object.prototype.hasOwnProperty, o = requireFunctionBind();
  return hasown = o.call(t, e), hasown;
}
var getIntrinsic, hasRequiredGetIntrinsic;
function requireGetIntrinsic() {
  if (hasRequiredGetIntrinsic) return getIntrinsic;
  hasRequiredGetIntrinsic = 1;
  var t, e = /* @__PURE__ */ requireEsObjectAtoms(), o = /* @__PURE__ */ requireEsErrors(), l = /* @__PURE__ */ require_eval(), r = /* @__PURE__ */ requireRange(), n = /* @__PURE__ */ requireRef$1(), f = /* @__PURE__ */ requireSyntax(), u = /* @__PURE__ */ requireType(), b = /* @__PURE__ */ requireUri(), S = /* @__PURE__ */ requireAbs(), s = /* @__PURE__ */ requireFloor(), v = /* @__PURE__ */ requireMax(), E = /* @__PURE__ */ requireMin(), q = /* @__PURE__ */ requirePow(), p = /* @__PURE__ */ requireRound(), T = /* @__PURE__ */ requireSign(), d = Function, y = function(re) {
    try {
      return d('"use strict"; return (' + re + ").constructor;")();
    } catch {
    }
  }, A = /* @__PURE__ */ requireGopd(), w = /* @__PURE__ */ requireEsDefineProperty(), I = function() {
    throw new u();
  }, R = A ? (function() {
    try {
      return arguments.callee, I;
    } catch {
      try {
        return A(arguments, "callee").get;
      } catch {
        return I;
      }
    }
  })() : I, F = requireHasSymbols()(), x = requireGetProto(), M = requireObject_getPrototypeOf(), Q = requireReflect_getPrototypeOf(), C = requireFunctionApply(), W = requireFunctionCall(), h = {}, $ = typeof Uint8Array > "u" || !x ? t : x(Uint8Array), ae = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
    "%ArrayIteratorPrototype%": F && x ? x([][Symbol.iterator]()) : t,
    "%AsyncFromSyncIteratorPrototype%": t,
    "%AsyncFunction%": h,
    "%AsyncGenerator%": h,
    "%AsyncGeneratorFunction%": h,
    "%AsyncIteratorPrototype%": h,
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
    "%Error%": o,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": l,
    "%Float16Array%": typeof Float16Array > "u" ? t : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
    "%Function%": d,
    "%GeneratorFunction%": h,
    "%Int8Array%": typeof Int8Array > "u" ? t : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? t : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? t : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": F && x ? x(x([][Symbol.iterator]())) : t,
    "%JSON%": typeof JSON == "object" ? JSON : t,
    "%Map%": typeof Map > "u" ? t : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !F || !x ? t : x((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": A,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? t : Promise,
    "%Proxy%": typeof Proxy > "u" ? t : Proxy,
    "%RangeError%": r,
    "%ReferenceError%": n,
    "%Reflect%": typeof Reflect > "u" ? t : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? t : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !F || !x ? t : x((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? t : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": F && x ? x(""[Symbol.iterator]()) : t,
    "%Symbol%": F ? Symbol : t,
    "%SyntaxError%": f,
    "%ThrowTypeError%": R,
    "%TypedArray%": $,
    "%TypeError%": u,
    "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
    "%URIError%": b,
    "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet,
    "%Function.prototype.call%": W,
    "%Function.prototype.apply%": C,
    "%Object.defineProperty%": w,
    "%Object.getPrototypeOf%": M,
    "%Math.abs%": S,
    "%Math.floor%": s,
    "%Math.max%": v,
    "%Math.min%": E,
    "%Math.pow%": q,
    "%Math.round%": p,
    "%Math.sign%": T,
    "%Reflect.getPrototypeOf%": Q
  };
  if (x)
    try {
      null.error;
    } catch (re) {
      var de = x(x(re));
      ae["%Error.prototype%"] = de;
    }
  var Ee = function re(ne) {
    var D;
    if (ne === "%AsyncFunction%")
      D = y("async function () {}");
    else if (ne === "%GeneratorFunction%")
      D = y("function* () {}");
    else if (ne === "%AsyncGeneratorFunction%")
      D = y("async function* () {}");
    else if (ne === "%AsyncGenerator%") {
      var L = re("%AsyncGeneratorFunction%");
      L && (D = L.prototype);
    } else if (ne === "%AsyncIteratorPrototype%") {
      var H = re("%AsyncGenerator%");
      H && x && (D = x(H.prototype));
    }
    return ae[ne] = D, D;
  }, _e = {
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
  }, ce = requireFunctionBind(), fe = /* @__PURE__ */ requireHasown(), k = ce.call(W, Array.prototype.concat), pe = ce.call(C, Array.prototype.splice), ee = ce.call(W, String.prototype.replace), J = ce.call(W, String.prototype.slice), G = ce.call(W, RegExp.prototype.exec), ue = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, O = /\\(\\)?/g, B = function(ne) {
    var D = J(ne, 0, 1), L = J(ne, -1);
    if (D === "%" && L !== "%")
      throw new f("invalid intrinsic syntax, expected closing `%`");
    if (L === "%" && D !== "%")
      throw new f("invalid intrinsic syntax, expected opening `%`");
    var H = [];
    return ee(ne, ue, function(se, we, Re, Ae) {
      H[H.length] = Re ? ee(Ae, O, "$1") : we || se;
    }), H;
  }, N = function(ne, D) {
    var L = ne, H;
    if (fe(_e, L) && (H = _e[L], L = "%" + H[0] + "%"), fe(ae, L)) {
      var se = ae[L];
      if (se === h && (se = Ee(L)), typeof se > "u" && !D)
        throw new u("intrinsic " + ne + " exists, but is not available. Please file an issue!");
      return {
        alias: H,
        name: L,
        value: se
      };
    }
    throw new f("intrinsic " + ne + " does not exist!");
  };
  return getIntrinsic = function(ne, D) {
    if (typeof ne != "string" || ne.length === 0)
      throw new u("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof D != "boolean")
      throw new u('"allowMissing" argument must be a boolean');
    if (G(/^%?[^%]*%?$/, ne) === null)
      throw new f("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var L = B(ne), H = L.length > 0 ? L[0] : "", se = N("%" + H + "%", D), we = se.name, Re = se.value, Ae = !1, Oe = se.alias;
    Oe && (H = Oe[0], pe(L, k([0, 1], Oe)));
    for (var te = 1, Fe = !0; te < L.length; te += 1) {
      var Ce = L[te], qe = J(Ce, 0, 1), Ue = J(Ce, -1);
      if ((qe === '"' || qe === "'" || qe === "`" || Ue === '"' || Ue === "'" || Ue === "`") && qe !== Ue)
        throw new f("property names with quotes must have matching quotes");
      if ((Ce === "constructor" || !Fe) && (Ae = !0), H += "." + Ce, we = "%" + H + "%", fe(ae, we))
        Re = ae[we];
      else if (Re != null) {
        if (!(Ce in Re)) {
          if (!D)
            throw new u("base intrinsic for " + ne + " exists, but the property is not available.");
          return;
        }
        if (A && te + 1 >= L.length) {
          var me = A(Re, Ce);
          Fe = !!me, Fe && "get" in me && !("originalValue" in me.get) ? Re = me.get : Re = Re[Ce];
        } else
          Fe = fe(Re, Ce), Re = Re[Ce];
        Fe && !Ae && (ae[we] = Re);
      }
    }
    return Re;
  }, getIntrinsic;
}
var callBound$1, hasRequiredCallBound$1;
function requireCallBound$1() {
  if (hasRequiredCallBound$1) return callBound$1;
  hasRequiredCallBound$1 = 1;
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = requireCallBindApplyHelpers(), o = e([t("%String.prototype.indexOf%")]);
  return callBound$1 = function(r, n) {
    var f = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      t(r, !!n)
    );
    return typeof f == "function" && o(r, ".prototype.") > -1 ? e(
      /** @type {const} */
      [f]
    ) : f;
  }, callBound$1;
}
var isArguments$1, hasRequiredIsArguments$1;
function requireIsArguments$1() {
  if (hasRequiredIsArguments$1) return isArguments$1;
  hasRequiredIsArguments$1 = 1;
  var t = requireShams()(), e = /* @__PURE__ */ requireCallBound$1(), o = e("Object.prototype.toString"), l = function(u) {
    return t && u && typeof u == "object" && Symbol.toStringTag in u ? !1 : o(u) === "[object Arguments]";
  }, r = function(u) {
    return l(u) ? !0 : u !== null && typeof u == "object" && "length" in u && typeof u.length == "number" && u.length >= 0 && o(u) !== "[object Array]" && "callee" in u && o(u.callee) === "[object Function]";
  }, n = (function() {
    return l(arguments);
  })();
  return l.isLegacyArguments = r, isArguments$1 = n ? l : r, isArguments$1;
}
var isRegex, hasRequiredIsRegex;
function requireIsRegex() {
  if (hasRequiredIsRegex) return isRegex;
  hasRequiredIsRegex = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireShams()(), o = /* @__PURE__ */ requireHasown(), l = /* @__PURE__ */ requireGopd(), r;
  if (e) {
    var n = t("RegExp.prototype.exec"), f = {}, u = function() {
      throw f;
    }, b = {
      toString: u,
      valueOf: u
    };
    typeof Symbol.toPrimitive == "symbol" && (b[Symbol.toPrimitive] = u), r = function(E) {
      if (!E || typeof E != "object")
        return !1;
      var q = (
        /** @type {NonNullable<typeof gOPD>} */
        l(
          /** @type {{ lastIndex?: unknown }} */
          E,
          "lastIndex"
        )
      ), p = q && o(q, "value");
      if (!p)
        return !1;
      try {
        n(
          E,
          /** @type {string} */
          /** @type {unknown} */
          b
        );
      } catch (T) {
        return T === f;
      }
    };
  } else {
    var S = t("Object.prototype.toString"), s = "[object RegExp]";
    r = function(E) {
      return !E || typeof E != "object" && typeof E != "function" ? !1 : S(E) === s;
    };
  }
  return isRegex = r, isRegex;
}
var safeRegexTest, hasRequiredSafeRegexTest;
function requireSafeRegexTest() {
  if (hasRequiredSafeRegexTest) return safeRegexTest;
  hasRequiredSafeRegexTest = 1;
  var t = /* @__PURE__ */ requireCallBound$1(), e = requireIsRegex(), o = t("RegExp.prototype.exec"), l = /* @__PURE__ */ requireType();
  return safeRegexTest = function(n) {
    if (!e(n))
      throw new l("`regex` must be a RegExp");
    return function(u) {
      return o(n, u) !== null;
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
  var t = /* @__PURE__ */ requireCallBound$1(), e = /* @__PURE__ */ requireSafeRegexTest(), o = e(/^\s*(?:function)?\*/), l = requireShams()(), r = requireGetProto(), n = t("Object.prototype.toString"), f = t("Function.prototype.toString"), u = /* @__PURE__ */ requireGeneratorFunction();
  return isGeneratorFunction = function(S) {
    if (typeof S != "function")
      return !1;
    if (o(f(S)))
      return !0;
    if (!l) {
      var s = n(S);
      return s === "[object GeneratorFunction]";
    }
    if (!r)
      return !1;
    var v = u();
    return v && r(S) === v.prototype;
  }, isGeneratorFunction;
}
var isCallable, hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var t = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, o, l;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      o = Object.defineProperty({}, "length", {
        get: function() {
          throw l;
        }
      }), l = {}, e(function() {
        throw 42;
      }, null, o);
    } catch (A) {
      A !== l && (e = null);
    }
  else
    e = null;
  var r = /^\s*class\b/, n = function(w) {
    try {
      var I = t.call(w);
      return r.test(I);
    } catch {
      return !1;
    }
  }, f = function(w) {
    try {
      return n(w) ? !1 : (t.call(w), !0);
    } catch {
      return !1;
    }
  }, u = Object.prototype.toString, b = "[object Object]", S = "[object Function]", s = "[object GeneratorFunction]", v = "[object HTMLAllCollection]", E = "[object HTML document.all class]", q = "[object HTMLCollection]", p = typeof Symbol == "function" && !!Symbol.toStringTag, T = !(0 in [,]), d = function() {
    return !1;
  };
  if (typeof document == "object") {
    var y = document.all;
    u.call(y) === u.call(document.all) && (d = function(w) {
      if ((T || !w) && (typeof w > "u" || typeof w == "object"))
        try {
          var I = u.call(w);
          return (I === v || I === E || I === q || I === b) && w("") == null;
        } catch {
        }
      return !1;
    });
  }
  return isCallable = e ? function(w) {
    if (d(w))
      return !0;
    if (!w || typeof w != "function" && typeof w != "object")
      return !1;
    try {
      e(w, null, o);
    } catch (I) {
      if (I !== l)
        return !1;
    }
    return !n(w) && f(w);
  } : function(w) {
    if (d(w))
      return !0;
    if (!w || typeof w != "function" && typeof w != "object")
      return !1;
    if (p)
      return f(w);
    if (n(w))
      return !1;
    var I = u.call(w);
    return I !== S && I !== s && !/^\[object HTML/.test(I) ? !1 : f(w);
  }, isCallable;
}
var forEach, hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach;
  hasRequiredForEach = 1;
  var t = requireIsCallable(), e = Object.prototype.toString, o = Object.prototype.hasOwnProperty, l = function(b, S, s) {
    for (var v = 0, E = b.length; v < E; v++)
      o.call(b, v) && (s == null ? S(b[v], v, b) : S.call(s, b[v], v, b));
  }, r = function(b, S, s) {
    for (var v = 0, E = b.length; v < E; v++)
      s == null ? S(b.charAt(v), v, b) : S.call(s, b.charAt(v), v, b);
  }, n = function(b, S, s) {
    for (var v in b)
      o.call(b, v) && (s == null ? S(b[v], v, b) : S.call(s, b[v], v, b));
  };
  function f(u) {
    return e.call(u) === "[object Array]";
  }
  return forEach = function(b, S, s) {
    if (!t(S))
      throw new TypeError("iterator must be a function");
    var v;
    arguments.length >= 3 && (v = s), f(b) ? l(b, S, v) : typeof b == "string" ? r(b, S, v) : n(b, S, v);
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
    for (var l = [], r = 0; r < t.length; r++)
      typeof e[t[r]] == "function" && (l[l.length] = t[r]);
    return l;
  }, availableTypedArrays;
}
var callBind = { exports: {} }, defineDataProperty, hasRequiredDefineDataProperty;
function requireDefineDataProperty() {
  if (hasRequiredDefineDataProperty) return defineDataProperty;
  hasRequiredDefineDataProperty = 1;
  var t = /* @__PURE__ */ requireEsDefineProperty(), e = /* @__PURE__ */ requireSyntax(), o = /* @__PURE__ */ requireType(), l = /* @__PURE__ */ requireGopd();
  return defineDataProperty = function(n, f, u) {
    if (!n || typeof n != "object" && typeof n != "function")
      throw new o("`obj` must be an object or a function`");
    if (typeof f != "string" && typeof f != "symbol")
      throw new o("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new o("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new o("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new o("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new o("`loose`, if provided, must be a boolean");
    var b = arguments.length > 3 ? arguments[3] : null, S = arguments.length > 4 ? arguments[4] : null, s = arguments.length > 5 ? arguments[5] : null, v = arguments.length > 6 ? arguments[6] : !1, E = !!l && l(n, f);
    if (t)
      t(n, f, {
        configurable: s === null && E ? E.configurable : !s,
        enumerable: b === null && E ? E.enumerable : !b,
        value: u,
        writable: S === null && E ? E.writable : !S
      });
    else if (v || !b && !S && !s)
      n[f] = u;
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
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = /* @__PURE__ */ requireDefineDataProperty(), o = /* @__PURE__ */ requireHasPropertyDescriptors()(), l = /* @__PURE__ */ requireGopd(), r = /* @__PURE__ */ requireType(), n = t("%Math.floor%");
  return setFunctionLength = function(u, b) {
    if (typeof u != "function")
      throw new r("`fn` is not a function");
    if (typeof b != "number" || b < 0 || b > 4294967295 || n(b) !== b)
      throw new r("`length` must be a positive 32-bit integer");
    var S = arguments.length > 2 && !!arguments[2], s = !0, v = !0;
    if ("length" in u && l) {
      var E = l(u, "length");
      E && !E.configurable && (s = !1), E && !E.writable && (v = !1);
    }
    return (s || v || !S) && (o ? e(
      /** @type {Parameters<define>[0]} */
      u,
      "length",
      b,
      !0,
      !0
    ) : e(
      /** @type {Parameters<define>[0]} */
      u,
      "length",
      b
    )), u;
  }, setFunctionLength;
}
var applyBind, hasRequiredApplyBind;
function requireApplyBind() {
  if (hasRequiredApplyBind) return applyBind;
  hasRequiredApplyBind = 1;
  var t = requireFunctionBind(), e = requireFunctionApply(), o = requireActualApply();
  return applyBind = function() {
    return o(t, e, arguments);
  }, applyBind;
}
var hasRequiredCallBind;
function requireCallBind() {
  return hasRequiredCallBind || (hasRequiredCallBind = 1, (function(t) {
    var e = /* @__PURE__ */ requireSetFunctionLength(), o = /* @__PURE__ */ requireEsDefineProperty(), l = requireCallBindApplyHelpers(), r = requireApplyBind();
    t.exports = function(f) {
      var u = l(arguments), b = f.length - (arguments.length - 1);
      return e(
        u,
        1 + (b > 0 ? b : 0),
        !0
      );
    }, o ? o(t.exports, "apply", { value: r }) : t.exports.apply = r;
  })(callBind)), callBind.exports;
}
var whichTypedArray, hasRequiredWhichTypedArray;
function requireWhichTypedArray() {
  if (hasRequiredWhichTypedArray) return whichTypedArray;
  hasRequiredWhichTypedArray = 1;
  var t = requireForEach(), e = /* @__PURE__ */ requireAvailableTypedArrays(), o = requireCallBind(), l = /* @__PURE__ */ requireCallBound$1(), r = /* @__PURE__ */ requireGopd(), n = requireGetProto(), f = l("Object.prototype.toString"), u = requireShams()(), b = typeof globalThis > "u" ? commonjsGlobal : globalThis, S = e(), s = l("String.prototype.slice"), v = l("Array.prototype.indexOf", !0) || function(d, y) {
    for (var A = 0; A < d.length; A += 1)
      if (d[A] === y)
        return A;
    return -1;
  }, E = { __proto__: null };
  u && r && n ? t(S, function(T) {
    var d = new b[T]();
    if (Symbol.toStringTag in d && n) {
      var y = n(d), A = r(y, Symbol.toStringTag);
      if (!A && y) {
        var w = n(y);
        A = r(w, Symbol.toStringTag);
      }
      if (A && A.get) {
        var I = o(A.get);
        E[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + T
        ] = I;
      }
    }
  }) : t(S, function(T) {
    var d = new b[T](), y = d.slice || d.set;
    if (y) {
      var A = (
        /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        o(y)
      );
      E[
        /** @type {`$${import('.').TypedArrayName}`} */
        "$" + T
      ] = A;
    }
  });
  var q = function(d) {
    var y = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      E,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(A, w) {
        if (!y)
          try {
            "$" + A(d) === w && (y = /** @type {import('.').TypedArrayName} */
            s(w, 1));
          } catch {
          }
      }
    ), y;
  }, p = function(d) {
    var y = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      E,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(A, w) {
        if (!y)
          try {
            A(d), y = /** @type {import('.').TypedArrayName} */
            s(w, 1);
          } catch {
          }
      }
    ), y;
  };
  return whichTypedArray = function(d) {
    if (!d || typeof d != "object")
      return !1;
    if (!u) {
      var y = s(f(d), 8, -1);
      return v(S, y) > -1 ? y : y !== "Object" ? !1 : p(d);
    }
    return r ? q(d) : null;
  }, whichTypedArray;
}
var isTypedArray, hasRequiredIsTypedArray;
function requireIsTypedArray() {
  if (hasRequiredIsTypedArray) return isTypedArray;
  hasRequiredIsTypedArray = 1;
  var t = /* @__PURE__ */ requireWhichTypedArray();
  return isTypedArray = function(o) {
    return !!t(o);
  }, isTypedArray;
}
var hasRequiredTypes;
function requireTypes() {
  return hasRequiredTypes || (hasRequiredTypes = 1, (function(t) {
    var e = /* @__PURE__ */ requireIsArguments$1(), o = requireIsGeneratorFunction(), l = /* @__PURE__ */ requireWhichTypedArray(), r = /* @__PURE__ */ requireIsTypedArray();
    function n(te) {
      return te.call.bind(te);
    }
    var f = typeof BigInt < "u", u = typeof Symbol < "u", b = n(Object.prototype.toString), S = n(Number.prototype.valueOf), s = n(String.prototype.valueOf), v = n(Boolean.prototype.valueOf);
    if (f)
      var E = n(BigInt.prototype.valueOf);
    if (u)
      var q = n(Symbol.prototype.valueOf);
    function p(te, Fe) {
      if (typeof te != "object")
        return !1;
      try {
        return Fe(te), !0;
      } catch {
        return !1;
      }
    }
    t.isArgumentsObject = e, t.isGeneratorFunction = o, t.isTypedArray = r;
    function T(te) {
      return typeof Promise < "u" && te instanceof Promise || te !== null && typeof te == "object" && typeof te.then == "function" && typeof te.catch == "function";
    }
    t.isPromise = T;
    function d(te) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(te) : r(te) || J(te);
    }
    t.isArrayBufferView = d;
    function y(te) {
      return l(te) === "Uint8Array";
    }
    t.isUint8Array = y;
    function A(te) {
      return l(te) === "Uint8ClampedArray";
    }
    t.isUint8ClampedArray = A;
    function w(te) {
      return l(te) === "Uint16Array";
    }
    t.isUint16Array = w;
    function I(te) {
      return l(te) === "Uint32Array";
    }
    t.isUint32Array = I;
    function R(te) {
      return l(te) === "Int8Array";
    }
    t.isInt8Array = R;
    function F(te) {
      return l(te) === "Int16Array";
    }
    t.isInt16Array = F;
    function x(te) {
      return l(te) === "Int32Array";
    }
    t.isInt32Array = x;
    function M(te) {
      return l(te) === "Float32Array";
    }
    t.isFloat32Array = M;
    function Q(te) {
      return l(te) === "Float64Array";
    }
    t.isFloat64Array = Q;
    function C(te) {
      return l(te) === "BigInt64Array";
    }
    t.isBigInt64Array = C;
    function W(te) {
      return l(te) === "BigUint64Array";
    }
    t.isBigUint64Array = W;
    function h(te) {
      return b(te) === "[object Map]";
    }
    h.working = typeof Map < "u" && h(/* @__PURE__ */ new Map());
    function $(te) {
      return typeof Map > "u" ? !1 : h.working ? h(te) : te instanceof Map;
    }
    t.isMap = $;
    function ae(te) {
      return b(te) === "[object Set]";
    }
    ae.working = typeof Set < "u" && ae(/* @__PURE__ */ new Set());
    function de(te) {
      return typeof Set > "u" ? !1 : ae.working ? ae(te) : te instanceof Set;
    }
    t.isSet = de;
    function Ee(te) {
      return b(te) === "[object WeakMap]";
    }
    Ee.working = typeof WeakMap < "u" && Ee(/* @__PURE__ */ new WeakMap());
    function _e(te) {
      return typeof WeakMap > "u" ? !1 : Ee.working ? Ee(te) : te instanceof WeakMap;
    }
    t.isWeakMap = _e;
    function ce(te) {
      return b(te) === "[object WeakSet]";
    }
    ce.working = typeof WeakSet < "u" && ce(/* @__PURE__ */ new WeakSet());
    function fe(te) {
      return ce(te);
    }
    t.isWeakSet = fe;
    function k(te) {
      return b(te) === "[object ArrayBuffer]";
    }
    k.working = typeof ArrayBuffer < "u" && k(new ArrayBuffer());
    function pe(te) {
      return typeof ArrayBuffer > "u" ? !1 : k.working ? k(te) : te instanceof ArrayBuffer;
    }
    t.isArrayBuffer = pe;
    function ee(te) {
      return b(te) === "[object DataView]";
    }
    ee.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && ee(new DataView(new ArrayBuffer(1), 0, 1));
    function J(te) {
      return typeof DataView > "u" ? !1 : ee.working ? ee(te) : te instanceof DataView;
    }
    t.isDataView = J;
    var G = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function ue(te) {
      return b(te) === "[object SharedArrayBuffer]";
    }
    function O(te) {
      return typeof G > "u" ? !1 : (typeof ue.working > "u" && (ue.working = ue(new G())), ue.working ? ue(te) : te instanceof G);
    }
    t.isSharedArrayBuffer = O;
    function B(te) {
      return b(te) === "[object AsyncFunction]";
    }
    t.isAsyncFunction = B;
    function N(te) {
      return b(te) === "[object Map Iterator]";
    }
    t.isMapIterator = N;
    function re(te) {
      return b(te) === "[object Set Iterator]";
    }
    t.isSetIterator = re;
    function ne(te) {
      return b(te) === "[object Generator]";
    }
    t.isGeneratorObject = ne;
    function D(te) {
      return b(te) === "[object WebAssembly.Module]";
    }
    t.isWebAssemblyCompiledModule = D;
    function L(te) {
      return p(te, S);
    }
    t.isNumberObject = L;
    function H(te) {
      return p(te, s);
    }
    t.isStringObject = H;
    function se(te) {
      return p(te, v);
    }
    t.isBooleanObject = se;
    function we(te) {
      return f && p(te, E);
    }
    t.isBigIntObject = we;
    function Re(te) {
      return u && p(te, q);
    }
    t.isSymbolObject = Re;
    function Ae(te) {
      return L(te) || H(te) || se(te) || we(te) || Re(te);
    }
    t.isBoxedPrimitive = Ae;
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
    var e = Object.getOwnPropertyDescriptors || function(J) {
      for (var G = Object.keys(J), ue = {}, O = 0; O < G.length; O++)
        ue[G[O]] = Object.getOwnPropertyDescriptor(J, G[O]);
      return ue;
    }, o = /%[sdj%]/g;
    t.format = function(ee) {
      if (!R(ee)) {
        for (var J = [], G = 0; G < arguments.length; G++)
          J.push(f(arguments[G]));
        return J.join(" ");
      }
      for (var G = 1, ue = arguments, O = ue.length, B = String(ee).replace(o, function(re) {
        if (re === "%%") return "%";
        if (G >= O) return re;
        switch (re) {
          case "%s":
            return String(ue[G++]);
          case "%d":
            return Number(ue[G++]);
          case "%j":
            try {
              return JSON.stringify(ue[G++]);
            } catch {
              return "[Circular]";
            }
          default:
            return re;
        }
      }), N = ue[G]; G < O; N = ue[++G])
        A(N) || !Q(N) ? B += " " + N : B += " " + f(N);
      return B;
    }, t.deprecate = function(ee, J) {
      if (typeof process$1 < "u" && process$1.noDeprecation === !0)
        return ee;
      if (typeof process$1 > "u")
        return function() {
          return t.deprecate(ee, J).apply(this, arguments);
        };
      var G = !1;
      function ue() {
        if (!G) {
          if (process$1.throwDeprecation)
            throw new Error(J);
          process$1.traceDeprecation ? console.trace(J) : console.error(J), G = !0;
        }
        return ee.apply(this, arguments);
      }
      return ue;
    };
    var l = {}, r = /^$/;
    if (process$1.env.NODE_DEBUG) {
      var n = process$1.env.NODE_DEBUG;
      n = n.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), r = new RegExp("^" + n + "$", "i");
    }
    t.debuglog = function(ee) {
      if (ee = ee.toUpperCase(), !l[ee])
        if (r.test(ee)) {
          var J = process$1.pid;
          l[ee] = function() {
            var G = t.format.apply(t, arguments);
            console.error("%s %d: %s", ee, J, G);
          };
        } else
          l[ee] = function() {
          };
      return l[ee];
    };
    function f(ee, J) {
      var G = {
        seen: [],
        stylize: b
      };
      return arguments.length >= 3 && (G.depth = arguments[2]), arguments.length >= 4 && (G.colors = arguments[3]), y(J) ? G.showHidden = J : J && t._extend(G, J), x(G.showHidden) && (G.showHidden = !1), x(G.depth) && (G.depth = 2), x(G.colors) && (G.colors = !1), x(G.customInspect) && (G.customInspect = !0), G.colors && (G.stylize = u), s(G, ee, G.depth);
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
    function u(ee, J) {
      var G = f.styles[J];
      return G ? "\x1B[" + f.colors[G][0] + "m" + ee + "\x1B[" + f.colors[G][1] + "m" : ee;
    }
    function b(ee, J) {
      return ee;
    }
    function S(ee) {
      var J = {};
      return ee.forEach(function(G, ue) {
        J[G] = !0;
      }), J;
    }
    function s(ee, J, G) {
      if (ee.customInspect && J && h(J.inspect) && // Filter out the util module, it's inspect function is special
      J.inspect !== t.inspect && // Also filter out any prototype objects using the circular check.
      !(J.constructor && J.constructor.prototype === J)) {
        var ue = J.inspect(G, ee);
        return R(ue) || (ue = s(ee, ue, G)), ue;
      }
      var O = v(ee, J);
      if (O)
        return O;
      var B = Object.keys(J), N = S(B);
      if (ee.showHidden && (B = Object.getOwnPropertyNames(J)), W(J) && (B.indexOf("message") >= 0 || B.indexOf("description") >= 0))
        return E(J);
      if (B.length === 0) {
        if (h(J)) {
          var re = J.name ? ": " + J.name : "";
          return ee.stylize("[Function" + re + "]", "special");
        }
        if (M(J))
          return ee.stylize(RegExp.prototype.toString.call(J), "regexp");
        if (C(J))
          return ee.stylize(Date.prototype.toString.call(J), "date");
        if (W(J))
          return E(J);
      }
      var ne = "", D = !1, L = ["{", "}"];
      if (d(J) && (D = !0, L = ["[", "]"]), h(J)) {
        var H = J.name ? ": " + J.name : "";
        ne = " [Function" + H + "]";
      }
      if (M(J) && (ne = " " + RegExp.prototype.toString.call(J)), C(J) && (ne = " " + Date.prototype.toUTCString.call(J)), W(J) && (ne = " " + E(J)), B.length === 0 && (!D || J.length == 0))
        return L[0] + ne + L[1];
      if (G < 0)
        return M(J) ? ee.stylize(RegExp.prototype.toString.call(J), "regexp") : ee.stylize("[Object]", "special");
      ee.seen.push(J);
      var se;
      return D ? se = q(ee, J, G, N, B) : se = B.map(function(we) {
        return p(ee, J, G, N, we, D);
      }), ee.seen.pop(), T(se, ne, L);
    }
    function v(ee, J) {
      if (x(J))
        return ee.stylize("undefined", "undefined");
      if (R(J)) {
        var G = "'" + JSON.stringify(J).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ee.stylize(G, "string");
      }
      if (I(J))
        return ee.stylize("" + J, "number");
      if (y(J))
        return ee.stylize("" + J, "boolean");
      if (A(J))
        return ee.stylize("null", "null");
    }
    function E(ee) {
      return "[" + Error.prototype.toString.call(ee) + "]";
    }
    function q(ee, J, G, ue, O) {
      for (var B = [], N = 0, re = J.length; N < re; ++N)
        ce(J, String(N)) ? B.push(p(
          ee,
          J,
          G,
          ue,
          String(N),
          !0
        )) : B.push("");
      return O.forEach(function(ne) {
        ne.match(/^\d+$/) || B.push(p(
          ee,
          J,
          G,
          ue,
          ne,
          !0
        ));
      }), B;
    }
    function p(ee, J, G, ue, O, B) {
      var N, re, ne;
      if (ne = Object.getOwnPropertyDescriptor(J, O) || { value: J[O] }, ne.get ? ne.set ? re = ee.stylize("[Getter/Setter]", "special") : re = ee.stylize("[Getter]", "special") : ne.set && (re = ee.stylize("[Setter]", "special")), ce(ue, O) || (N = "[" + O + "]"), re || (ee.seen.indexOf(ne.value) < 0 ? (A(G) ? re = s(ee, ne.value, null) : re = s(ee, ne.value, G - 1), re.indexOf(`
`) > -1 && (B ? re = re.split(`
`).map(function(D) {
        return "  " + D;
      }).join(`
`).slice(2) : re = `
` + re.split(`
`).map(function(D) {
        return "   " + D;
      }).join(`
`))) : re = ee.stylize("[Circular]", "special")), x(N)) {
        if (B && O.match(/^\d+$/))
          return re;
        N = JSON.stringify("" + O), N.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (N = N.slice(1, -1), N = ee.stylize(N, "name")) : (N = N.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), N = ee.stylize(N, "string"));
      }
      return N + ": " + re;
    }
    function T(ee, J, G) {
      var ue = ee.reduce(function(O, B) {
        return B.indexOf(`
`) >= 0, O + B.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return ue > 60 ? G[0] + (J === "" ? "" : J + `
 `) + " " + ee.join(`,
  `) + " " + G[1] : G[0] + J + " " + ee.join(", ") + " " + G[1];
    }
    t.types = requireTypes();
    function d(ee) {
      return Array.isArray(ee);
    }
    t.isArray = d;
    function y(ee) {
      return typeof ee == "boolean";
    }
    t.isBoolean = y;
    function A(ee) {
      return ee === null;
    }
    t.isNull = A;
    function w(ee) {
      return ee == null;
    }
    t.isNullOrUndefined = w;
    function I(ee) {
      return typeof ee == "number";
    }
    t.isNumber = I;
    function R(ee) {
      return typeof ee == "string";
    }
    t.isString = R;
    function F(ee) {
      return typeof ee == "symbol";
    }
    t.isSymbol = F;
    function x(ee) {
      return ee === void 0;
    }
    t.isUndefined = x;
    function M(ee) {
      return Q(ee) && ae(ee) === "[object RegExp]";
    }
    t.isRegExp = M, t.types.isRegExp = M;
    function Q(ee) {
      return typeof ee == "object" && ee !== null;
    }
    t.isObject = Q;
    function C(ee) {
      return Q(ee) && ae(ee) === "[object Date]";
    }
    t.isDate = C, t.types.isDate = C;
    function W(ee) {
      return Q(ee) && (ae(ee) === "[object Error]" || ee instanceof Error);
    }
    t.isError = W, t.types.isNativeError = W;
    function h(ee) {
      return typeof ee == "function";
    }
    t.isFunction = h;
    function $(ee) {
      return ee === null || typeof ee == "boolean" || typeof ee == "number" || typeof ee == "string" || typeof ee == "symbol" || // ES6 symbol
      typeof ee > "u";
    }
    t.isPrimitive = $, t.isBuffer = requireIsBufferBrowser();
    function ae(ee) {
      return Object.prototype.toString.call(ee);
    }
    function de(ee) {
      return ee < 10 ? "0" + ee.toString(10) : ee.toString(10);
    }
    var Ee = [
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
    function _e() {
      var ee = /* @__PURE__ */ new Date(), J = [
        de(ee.getHours()),
        de(ee.getMinutes()),
        de(ee.getSeconds())
      ].join(":");
      return [ee.getDate(), Ee[ee.getMonth()], J].join(" ");
    }
    t.log = function() {
      console.log("%s - %s", _e(), t.format.apply(t, arguments));
    }, t.inherits = requireInherits_browser(), t._extend = function(ee, J) {
      if (!J || !Q(J)) return ee;
      for (var G = Object.keys(J), ue = G.length; ue--; )
        ee[G[ue]] = J[G[ue]];
      return ee;
    };
    function ce(ee, J) {
      return Object.prototype.hasOwnProperty.call(ee, J);
    }
    var fe = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    t.promisify = function(J) {
      if (typeof J != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (fe && J[fe]) {
        var G = J[fe];
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
        for (var ue, O, B = new Promise(function(ne, D) {
          ue = ne, O = D;
        }), N = [], re = 0; re < arguments.length; re++)
          N.push(arguments[re]);
        N.push(function(ne, D) {
          ne ? O(ne) : ue(D);
        });
        try {
          J.apply(this, N);
        } catch (ne) {
          O(ne);
        }
        return B;
      }
      return Object.setPrototypeOf(G, Object.getPrototypeOf(J)), fe && Object.defineProperty(G, fe, {
        value: G,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        G,
        e(J)
      );
    }, t.promisify.custom = fe;
    function k(ee, J) {
      if (!ee) {
        var G = new Error("Promise was rejected with a falsy value");
        G.reason = ee, ee = G;
      }
      return J(ee);
    }
    function pe(ee) {
      if (typeof ee != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function J() {
        for (var G = [], ue = 0; ue < arguments.length; ue++)
          G.push(arguments[ue]);
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
            process$1.nextTick(k.bind(null, re, N));
          }
        );
      }
      return Object.setPrototypeOf(J, Object.getPrototypeOf(ee)), Object.defineProperties(
        J,
        e(ee)
      ), J;
    }
    t.callbackify = pe;
  })(util$2)), util$2;
}
var buffer_list$1, hasRequiredBuffer_list$1;
function requireBuffer_list$1() {
  if (hasRequiredBuffer_list$1) return buffer_list$1;
  hasRequiredBuffer_list$1 = 1;
  function t(p, T) {
    var d = Object.keys(p);
    if (Object.getOwnPropertySymbols) {
      var y = Object.getOwnPropertySymbols(p);
      T && (y = y.filter(function(A) {
        return Object.getOwnPropertyDescriptor(p, A).enumerable;
      })), d.push.apply(d, y);
    }
    return d;
  }
  function e(p) {
    for (var T = 1; T < arguments.length; T++) {
      var d = arguments[T] != null ? arguments[T] : {};
      T % 2 ? t(Object(d), !0).forEach(function(y) {
        o(p, y, d[y]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(p, Object.getOwnPropertyDescriptors(d)) : t(Object(d)).forEach(function(y) {
        Object.defineProperty(p, y, Object.getOwnPropertyDescriptor(d, y));
      });
    }
    return p;
  }
  function o(p, T, d) {
    return T = f(T), T in p ? Object.defineProperty(p, T, { value: d, enumerable: !0, configurable: !0, writable: !0 }) : p[T] = d, p;
  }
  function l(p, T) {
    if (!(p instanceof T))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(p, T) {
    for (var d = 0; d < T.length; d++) {
      var y = T[d];
      y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(p, f(y.key), y);
    }
  }
  function n(p, T, d) {
    return T && r(p.prototype, T), Object.defineProperty(p, "prototype", { writable: !1 }), p;
  }
  function f(p) {
    var T = u(p, "string");
    return typeof T == "symbol" ? T : String(T);
  }
  function u(p, T) {
    if (typeof p != "object" || p === null) return p;
    var d = p[Symbol.toPrimitive];
    if (d !== void 0) {
      var y = d.call(p, T);
      if (typeof y != "object") return y;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(p);
  }
  var b = requireDist(), S = b.Buffer, s = requireUtil$2(), v = s.inspect, E = v && v.custom || "inspect";
  function q(p, T, d) {
    S.prototype.copy.call(p, T, d);
  }
  return buffer_list$1 = /* @__PURE__ */ (function() {
    function p() {
      l(this, p), this.head = null, this.tail = null, this.length = 0;
    }
    return n(p, [{
      key: "push",
      value: function(d) {
        var y = {
          data: d,
          next: null
        };
        this.length > 0 ? this.tail.next = y : this.head = y, this.tail = y, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(d) {
        var y = {
          data: d,
          next: this.head
        };
        this.length === 0 && (this.tail = y), this.head = y, ++this.length;
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
        for (var y = this.head, A = "" + y.data; y = y.next; ) A += d + y.data;
        return A;
      }
    }, {
      key: "concat",
      value: function(d) {
        if (this.length === 0) return S.alloc(0);
        for (var y = S.allocUnsafe(d >>> 0), A = this.head, w = 0; A; )
          q(A.data, y, w), w += A.data.length, A = A.next;
        return y;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(d, y) {
        var A;
        return d < this.head.data.length ? (A = this.head.data.slice(0, d), this.head.data = this.head.data.slice(d)) : d === this.head.data.length ? A = this.shift() : A = y ? this._getString(d) : this._getBuffer(d), A;
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
        var y = this.head, A = 1, w = y.data;
        for (d -= w.length; y = y.next; ) {
          var I = y.data, R = d > I.length ? I.length : d;
          if (R === I.length ? w += I : w += I.slice(0, d), d -= R, d === 0) {
            R === I.length ? (++A, y.next ? this.head = y.next : this.head = this.tail = null) : (this.head = y, y.data = I.slice(R));
            break;
          }
          ++A;
        }
        return this.length -= A, w;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(d) {
        var y = S.allocUnsafe(d), A = this.head, w = 1;
        for (A.data.copy(y), d -= A.data.length; A = A.next; ) {
          var I = A.data, R = d > I.length ? I.length : d;
          if (I.copy(y, y.length - d, 0, R), d -= R, d === 0) {
            R === I.length ? (++w, A.next ? this.head = A.next : this.head = this.tail = null) : (this.head = A, A.data = I.slice(R));
            break;
          }
          ++w;
        }
        return this.length -= w, y;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: E,
      value: function(d, y) {
        return v(this, e(e({}, y), {}, {
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
    var b = this, S = this._readableState && this._readableState.destroyed, s = this._writableState && this._writableState.destroyed;
    return S || s ? (u ? u(f) : f && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process$1.nextTick(r, this, f)) : process$1.nextTick(r, this, f)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(f || null, function(v) {
      !u && v ? b._writableState ? b._writableState.errorEmitted ? process$1.nextTick(o, b) : (b._writableState.errorEmitted = !0, process$1.nextTick(e, b, v)) : process$1.nextTick(e, b, v) : u ? (process$1.nextTick(o, b), u(v)) : process$1.nextTick(o, b);
    }), this);
  }
  function e(f, u) {
    r(f, u), o(f);
  }
  function o(f) {
    f._writableState && !f._writableState.emitClose || f._readableState && !f._readableState.emitClose || f.emit("close");
  }
  function l() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function r(f, u) {
    f.emit("error", u);
  }
  function n(f, u) {
    var b = f._readableState, S = f._writableState;
    b && b.autoDestroy || S && S.autoDestroy ? f.destroy(u) : f.emit("error", u);
  }
  return destroy_1$1 = {
    destroy: t,
    undestroy: l,
    errorOrDestroy: n
  }, destroy_1$1;
}
var errorsBrowser = {}, hasRequiredErrorsBrowser;
function requireErrorsBrowser() {
  if (hasRequiredErrorsBrowser) return errorsBrowser;
  hasRequiredErrorsBrowser = 1;
  function t(u, b) {
    u.prototype = Object.create(b.prototype), u.prototype.constructor = u, u.__proto__ = b;
  }
  var e = {};
  function o(u, b, S) {
    S || (S = Error);
    function s(E, q, p) {
      return typeof b == "string" ? b : b(E, q, p);
    }
    var v = /* @__PURE__ */ (function(E) {
      t(q, E);
      function q(p, T, d) {
        return E.call(this, s(p, T, d)) || this;
      }
      return q;
    })(S);
    v.prototype.name = S.name, v.prototype.code = u, e[u] = v;
  }
  function l(u, b) {
    if (Array.isArray(u)) {
      var S = u.length;
      return u = u.map(function(s) {
        return String(s);
      }), S > 2 ? "one of ".concat(b, " ").concat(u.slice(0, S - 1).join(", "), ", or ") + u[S - 1] : S === 2 ? "one of ".concat(b, " ").concat(u[0], " or ").concat(u[1]) : "of ".concat(b, " ").concat(u[0]);
    } else
      return "of ".concat(b, " ").concat(String(u));
  }
  function r(u, b, S) {
    return u.substr(0, b.length) === b;
  }
  function n(u, b, S) {
    return (S === void 0 || S > u.length) && (S = u.length), u.substring(S - b.length, S) === b;
  }
  function f(u, b, S) {
    return typeof S != "number" && (S = 0), S + b.length > u.length ? !1 : u.indexOf(b, S) !== -1;
  }
  return o("ERR_INVALID_OPT_VALUE", function(u, b) {
    return 'The value "' + b + '" is invalid for option "' + u + '"';
  }, TypeError), o("ERR_INVALID_ARG_TYPE", function(u, b, S) {
    var s;
    typeof b == "string" && r(b, "not ") ? (s = "must not be", b = b.replace(/^not /, "")) : s = "must be";
    var v;
    if (n(u, " argument"))
      v = "The ".concat(u, " ").concat(s, " ").concat(l(b, "type"));
    else {
      var E = f(u, ".") ? "property" : "argument";
      v = 'The "'.concat(u, '" ').concat(E, " ").concat(s, " ").concat(l(b, "type"));
    }
    return v += ". Received type ".concat(typeof S), v;
  }, TypeError), o("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), o("ERR_METHOD_NOT_IMPLEMENTED", function(u) {
    return "The " + u + " method is not implemented";
  }), o("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), o("ERR_STREAM_DESTROYED", function(u) {
    return "Cannot call " + u + " after a stream was destroyed";
  }), o("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), o("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), o("ERR_STREAM_WRITE_AFTER_END", "write after end"), o("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), o("ERR_UNKNOWN_ENCODING", function(u) {
    return "Unknown encoding: " + u;
  }, TypeError), o("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), errorsBrowser.codes = e, errorsBrowser;
}
var state$1, hasRequiredState$1;
function requireState$1() {
  if (hasRequiredState$1) return state$1;
  hasRequiredState$1 = 1;
  var t = requireErrorsBrowser().codes.ERR_INVALID_OPT_VALUE;
  function e(l, r, n) {
    return l.highWaterMark != null ? l.highWaterMark : r ? l[n] : null;
  }
  function o(l, r, n, f) {
    var u = e(r, f, n);
    if (u != null) {
      if (!(isFinite(u) && Math.floor(u) === u) || u < 0) {
        var b = f ? n : "highWaterMark";
        throw new t(b, u);
      }
      return Math.floor(u);
    }
    return l.objectMode ? 16 : 16 * 1024;
  }
  return state$1 = {
    getHighWaterMark: o
  }, state$1;
}
var browser$3, hasRequiredBrowser$3;
function requireBrowser$3() {
  if (hasRequiredBrowser$3) return browser$3;
  hasRequiredBrowser$3 = 1, browser$3 = t;
  function t(o, l) {
    if (e("noDeprecation"))
      return o;
    var r = !1;
    function n() {
      if (!r) {
        if (e("throwDeprecation"))
          throw new Error(l);
        e("traceDeprecation") ? console.trace(l) : console.warn(l), r = !0;
      }
      return o.apply(this, arguments);
    }
    return n;
  }
  function e(o) {
    try {
      if (!commonjsGlobal.localStorage) return !1;
    } catch {
      return !1;
    }
    var l = commonjsGlobal.localStorage[o];
    return l == null ? !1 : String(l).toLowerCase() === "true";
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
      ue(B, O);
    };
  }
  var e;
  M.WritableState = F;
  var o = {
    deprecate: requireBrowser$3()
  }, l = requireStreamBrowser(), r = requireDist().Buffer, n = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function f(O) {
    return r.from(O);
  }
  function u(O) {
    return r.isBuffer(O) || O instanceof n;
  }
  var b = requireDestroy$1(), S = requireState$1(), s = S.getHighWaterMark, v = requireErrorsBrowser().codes, E = v.ERR_INVALID_ARG_TYPE, q = v.ERR_METHOD_NOT_IMPLEMENTED, p = v.ERR_MULTIPLE_CALLBACK, T = v.ERR_STREAM_CANNOT_PIPE, d = v.ERR_STREAM_DESTROYED, y = v.ERR_STREAM_NULL_VALUES, A = v.ERR_STREAM_WRITE_AFTER_END, w = v.ERR_UNKNOWN_ENCODING, I = b.errorOrDestroy;
  requireInherits_browser()(M, l);
  function R() {
  }
  function F(O, B, N) {
    e = e || require_stream_duplex(), O = O || {}, typeof N != "boolean" && (N = B instanceof e), this.objectMode = !!O.objectMode, N && (this.objectMode = this.objectMode || !!O.writableObjectMode), this.highWaterMark = s(this, O, "writableHighWaterMark", N), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var re = O.decodeStrings === !1;
    this.decodeStrings = !re, this.defaultEncoding = O.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(ne) {
      Ee(B, ne);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = O.emitClose !== !1, this.autoDestroy = !!O.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  F.prototype.getBuffer = function() {
    for (var B = this.bufferedRequest, N = []; B; )
      N.push(B), B = B.next;
    return N;
  }, (function() {
    try {
      Object.defineProperty(F.prototype, "buffer", {
        get: o.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var x;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (x = Function.prototype[Symbol.hasInstance], Object.defineProperty(M, Symbol.hasInstance, {
    value: function(B) {
      return x.call(this, B) ? !0 : this !== M ? !1 : B && B._writableState instanceof F;
    }
  })) : x = function(B) {
    return B instanceof this;
  };
  function M(O) {
    e = e || require_stream_duplex();
    var B = this instanceof e;
    if (!B && !x.call(M, this)) return new M(O);
    this._writableState = new F(O, this, B), this.writable = !0, O && (typeof O.write == "function" && (this._write = O.write), typeof O.writev == "function" && (this._writev = O.writev), typeof O.destroy == "function" && (this._destroy = O.destroy), typeof O.final == "function" && (this._final = O.final)), l.call(this);
  }
  M.prototype.pipe = function() {
    I(this, new T());
  };
  function Q(O, B) {
    var N = new A();
    I(O, N), process$1.nextTick(B, N);
  }
  function C(O, B, N, re) {
    var ne;
    return N === null ? ne = new y() : typeof N != "string" && !B.objectMode && (ne = new E("chunk", ["string", "Buffer"], N)), ne ? (I(O, ne), process$1.nextTick(re, ne), !1) : !0;
  }
  M.prototype.write = function(O, B, N) {
    var re = this._writableState, ne = !1, D = !re.objectMode && u(O);
    return D && !r.isBuffer(O) && (O = f(O)), typeof B == "function" && (N = B, B = null), D ? B = "buffer" : B || (B = re.defaultEncoding), typeof N != "function" && (N = R), re.ending ? Q(this, N) : (D || C(this, re, O, N)) && (re.pendingcb++, ne = h(this, re, D, O, B, N)), ne;
  }, M.prototype.cork = function() {
    this._writableState.corked++;
  }, M.prototype.uncork = function() {
    var O = this._writableState;
    O.corked && (O.corked--, !O.writing && !O.corked && !O.bufferProcessing && O.bufferedRequest && fe(this, O));
  }, M.prototype.setDefaultEncoding = function(B) {
    if (typeof B == "string" && (B = B.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((B + "").toLowerCase()) > -1)) throw new w(B);
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
  function W(O, B, N) {
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
  function h(O, B, N, re, ne, D) {
    if (!N) {
      var L = W(B, re, ne);
      re !== L && (N = !0, ne = "buffer", re = L);
    }
    var H = B.objectMode ? 1 : re.length;
    B.length += H;
    var se = B.length < B.highWaterMark;
    if (se || (B.needDrain = !0), B.writing || B.corked) {
      var we = B.lastBufferedRequest;
      B.lastBufferedRequest = {
        chunk: re,
        encoding: ne,
        isBuf: N,
        callback: D,
        next: null
      }, we ? we.next = B.lastBufferedRequest : B.bufferedRequest = B.lastBufferedRequest, B.bufferedRequestCount += 1;
    } else
      $(O, B, !1, H, re, ne, D);
    return se;
  }
  function $(O, B, N, re, ne, D, L) {
    B.writelen = re, B.writecb = L, B.writing = !0, B.sync = !0, B.destroyed ? B.onwrite(new d("write")) : N ? O._writev(ne, B.onwrite) : O._write(ne, D, B.onwrite), B.sync = !1;
  }
  function ae(O, B, N, re, ne) {
    --B.pendingcb, N ? (process$1.nextTick(ne, re), process$1.nextTick(J, O, B), O._writableState.errorEmitted = !0, I(O, re)) : (ne(re), O._writableState.errorEmitted = !0, I(O, re), J(O, B));
  }
  function de(O) {
    O.writing = !1, O.writecb = null, O.length -= O.writelen, O.writelen = 0;
  }
  function Ee(O, B) {
    var N = O._writableState, re = N.sync, ne = N.writecb;
    if (typeof ne != "function") throw new p();
    if (de(N), B) ae(O, N, re, B, ne);
    else {
      var D = k(N) || O.destroyed;
      !D && !N.corked && !N.bufferProcessing && N.bufferedRequest && fe(O, N), re ? process$1.nextTick(_e, O, N, D, ne) : _e(O, N, D, ne);
    }
  }
  function _e(O, B, N, re) {
    N || ce(O, B), B.pendingcb--, re(), J(O, B);
  }
  function ce(O, B) {
    B.length === 0 && B.needDrain && (B.needDrain = !1, O.emit("drain"));
  }
  function fe(O, B) {
    B.bufferProcessing = !0;
    var N = B.bufferedRequest;
    if (O._writev && N && N.next) {
      var re = B.bufferedRequestCount, ne = new Array(re), D = B.corkedRequestsFree;
      D.entry = N;
      for (var L = 0, H = !0; N; )
        ne[L] = N, N.isBuf || (H = !1), N = N.next, L += 1;
      ne.allBuffers = H, $(O, B, !0, B.length, ne, "", D.finish), B.pendingcb++, B.lastBufferedRequest = null, D.next ? (B.corkedRequestsFree = D.next, D.next = null) : B.corkedRequestsFree = new t(B), B.bufferedRequestCount = 0;
    } else {
      for (; N; ) {
        var se = N.chunk, we = N.encoding, Re = N.callback, Ae = B.objectMode ? 1 : se.length;
        if ($(O, B, !1, Ae, se, we, Re), N = N.next, B.bufferedRequestCount--, B.writing)
          break;
      }
      N === null && (B.lastBufferedRequest = null);
    }
    B.bufferedRequest = N, B.bufferProcessing = !1;
  }
  M.prototype._write = function(O, B, N) {
    N(new q("_write()"));
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
  function k(O) {
    return O.ending && O.length === 0 && O.bufferedRequest === null && !O.finished && !O.writing;
  }
  function pe(O, B) {
    O._final(function(N) {
      B.pendingcb--, N && I(O, N), B.prefinished = !0, O.emit("prefinish"), J(O, B);
    });
  }
  function ee(O, B) {
    !B.prefinished && !B.finalCalled && (typeof O._final == "function" && !B.destroyed ? (B.pendingcb++, B.finalCalled = !0, process$1.nextTick(pe, O, B)) : (B.prefinished = !0, O.emit("prefinish")));
  }
  function J(O, B) {
    var N = k(B);
    if (N && (ee(O, B), B.pendingcb === 0 && (B.finished = !0, O.emit("finish"), B.autoDestroy))) {
      var re = O._readableState;
      (!re || re.autoDestroy && re.endEmitted) && O.destroy();
    }
    return N;
  }
  function G(O, B, N) {
    B.ending = !0, J(O, B), N && (B.finished ? process$1.nextTick(N) : O.once("finish", N)), B.ended = !0, O.writable = !1;
  }
  function ue(O, B, N) {
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
  }), M.prototype.destroy = b.destroy, M.prototype._undestroy = b.undestroy, M.prototype._destroy = function(O, B) {
    B(O);
  }, _stream_writable;
}
var _stream_duplex, hasRequired_stream_duplex;
function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex;
  hasRequired_stream_duplex = 1;
  var t = Object.keys || function(S) {
    var s = [];
    for (var v in S) s.push(v);
    return s;
  };
  _stream_duplex = f;
  var e = require_stream_readable(), o = require_stream_writable();
  requireInherits_browser()(f, e);
  for (var l = t(o.prototype), r = 0; r < l.length; r++) {
    var n = l[r];
    f.prototype[n] || (f.prototype[n] = o.prototype[n]);
  }
  function f(S) {
    if (!(this instanceof f)) return new f(S);
    e.call(this, S), o.call(this, S), this.allowHalfOpen = !0, S && (S.readable === !1 && (this.readable = !1), S.writable === !1 && (this.writable = !1), S.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
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
    this._writableState.ended || process$1.nextTick(b, this);
  }
  function b(S) {
    S.end();
  }
  return Object.defineProperty(f.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(s) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = s, this._writableState.destroyed = s);
    }
  }), _stream_duplex;
}
var string_decoder = {}, safeBuffer = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  return hasRequiredSafeBuffer || (hasRequiredSafeBuffer = 1, (function(t, e) {
    var o = requireDist(), l = o.Buffer;
    function r(f, u) {
      for (var b in f)
        u[b] = f[b];
    }
    l.from && l.alloc && l.allocUnsafe && l.allocUnsafeSlow ? t.exports = o : (r(o, e), e.Buffer = n);
    function n(f, u, b) {
      return l(f, u, b);
    }
    n.prototype = Object.create(l.prototype), r(l, n), n.from = function(f, u, b) {
      if (typeof f == "number")
        throw new TypeError("Argument must not be a number");
      return l(f, u, b);
    }, n.alloc = function(f, u, b) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      var S = l(f);
      return u !== void 0 ? typeof b == "string" ? S.fill(u, b) : S.fill(u) : S.fill(0), S;
    }, n.allocUnsafe = function(f) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      return l(f);
    }, n.allocUnsafeSlow = function(f) {
      if (typeof f != "number")
        throw new TypeError("Argument must be a number");
      return o.SlowBuffer(f);
    };
  })(safeBuffer, safeBuffer.exports)), safeBuffer.exports;
}
var hasRequiredString_decoder;
function requireString_decoder() {
  if (hasRequiredString_decoder) return string_decoder;
  hasRequiredString_decoder = 1;
  var t = requireSafeBuffer().Buffer, e = t.isEncoding || function(y) {
    switch (y = "" + y, y && y.toLowerCase()) {
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
  function o(y) {
    if (!y) return "utf8";
    for (var A; ; )
      switch (y) {
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
          return y;
        default:
          if (A) return;
          y = ("" + y).toLowerCase(), A = !0;
      }
  }
  function l(y) {
    var A = o(y);
    if (typeof A != "string" && (t.isEncoding === e || !e(y))) throw new Error("Unknown encoding: " + y);
    return A || y;
  }
  string_decoder.StringDecoder = r;
  function r(y) {
    this.encoding = l(y);
    var A;
    switch (this.encoding) {
      case "utf16le":
        this.text = v, this.end = E, A = 4;
        break;
      case "utf8":
        this.fillLast = b, A = 4;
        break;
      case "base64":
        this.text = q, this.end = p, A = 3;
        break;
      default:
        this.write = T, this.end = d;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = t.allocUnsafe(A);
  }
  r.prototype.write = function(y) {
    if (y.length === 0) return "";
    var A, w;
    if (this.lastNeed) {
      if (A = this.fillLast(y), A === void 0) return "";
      w = this.lastNeed, this.lastNeed = 0;
    } else
      w = 0;
    return w < y.length ? A ? A + this.text(y, w) : this.text(y, w) : A || "";
  }, r.prototype.end = s, r.prototype.text = S, r.prototype.fillLast = function(y) {
    if (this.lastNeed <= y.length)
      return y.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    y.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, y.length), this.lastNeed -= y.length;
  };
  function n(y) {
    return y <= 127 ? 0 : y >> 5 === 6 ? 2 : y >> 4 === 14 ? 3 : y >> 3 === 30 ? 4 : y >> 6 === 2 ? -1 : -2;
  }
  function f(y, A, w) {
    var I = A.length - 1;
    if (I < w) return 0;
    var R = n(A[I]);
    return R >= 0 ? (R > 0 && (y.lastNeed = R - 1), R) : --I < w || R === -2 ? 0 : (R = n(A[I]), R >= 0 ? (R > 0 && (y.lastNeed = R - 2), R) : --I < w || R === -2 ? 0 : (R = n(A[I]), R >= 0 ? (R > 0 && (R === 2 ? R = 0 : y.lastNeed = R - 3), R) : 0));
  }
  function u(y, A, w) {
    if ((A[0] & 192) !== 128)
      return y.lastNeed = 0, "�";
    if (y.lastNeed > 1 && A.length > 1) {
      if ((A[1] & 192) !== 128)
        return y.lastNeed = 1, "�";
      if (y.lastNeed > 2 && A.length > 2 && (A[2] & 192) !== 128)
        return y.lastNeed = 2, "�";
    }
  }
  function b(y) {
    var A = this.lastTotal - this.lastNeed, w = u(this, y);
    if (w !== void 0) return w;
    if (this.lastNeed <= y.length)
      return y.copy(this.lastChar, A, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    y.copy(this.lastChar, A, 0, y.length), this.lastNeed -= y.length;
  }
  function S(y, A) {
    var w = f(this, y, A);
    if (!this.lastNeed) return y.toString("utf8", A);
    this.lastTotal = w;
    var I = y.length - (w - this.lastNeed);
    return y.copy(this.lastChar, 0, I), y.toString("utf8", A, I);
  }
  function s(y) {
    var A = y && y.length ? this.write(y) : "";
    return this.lastNeed ? A + "�" : A;
  }
  function v(y, A) {
    if ((y.length - A) % 2 === 0) {
      var w = y.toString("utf16le", A);
      if (w) {
        var I = w.charCodeAt(w.length - 1);
        if (I >= 55296 && I <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = y[y.length - 2], this.lastChar[1] = y[y.length - 1], w.slice(0, -1);
      }
      return w;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = y[y.length - 1], y.toString("utf16le", A, y.length - 1);
  }
  function E(y) {
    var A = y && y.length ? this.write(y) : "";
    if (this.lastNeed) {
      var w = this.lastTotal - this.lastNeed;
      return A + this.lastChar.toString("utf16le", 0, w);
    }
    return A;
  }
  function q(y, A) {
    var w = (y.length - A) % 3;
    return w === 0 ? y.toString("base64", A) : (this.lastNeed = 3 - w, this.lastTotal = 3, w === 1 ? this.lastChar[0] = y[y.length - 1] : (this.lastChar[0] = y[y.length - 2], this.lastChar[1] = y[y.length - 1]), y.toString("base64", A, y.length - w));
  }
  function p(y) {
    var A = y && y.length ? this.write(y) : "";
    return this.lastNeed ? A + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : A;
  }
  function T(y) {
    return y.toString(this.encoding);
  }
  function d(y) {
    return y && y.length ? this.write(y) : "";
  }
  return string_decoder;
}
var endOfStream$1, hasRequiredEndOfStream$1;
function requireEndOfStream$1() {
  if (hasRequiredEndOfStream$1) return endOfStream$1;
  hasRequiredEndOfStream$1 = 1;
  var t = requireErrorsBrowser().codes.ERR_STREAM_PREMATURE_CLOSE;
  function e(n) {
    var f = !1;
    return function() {
      if (!f) {
        f = !0;
        for (var u = arguments.length, b = new Array(u), S = 0; S < u; S++)
          b[S] = arguments[S];
        n.apply(this, b);
      }
    };
  }
  function o() {
  }
  function l(n) {
    return n.setHeader && typeof n.abort == "function";
  }
  function r(n, f, u) {
    if (typeof f == "function") return r(n, null, f);
    f || (f = {}), u = e(u || o);
    var b = f.readable || f.readable !== !1 && n.readable, S = f.writable || f.writable !== !1 && n.writable, s = function() {
      n.writable || E();
    }, v = n._writableState && n._writableState.finished, E = function() {
      S = !1, v = !0, b || u.call(n);
    }, q = n._readableState && n._readableState.endEmitted, p = function() {
      b = !1, q = !0, S || u.call(n);
    }, T = function(w) {
      u.call(n, w);
    }, d = function() {
      var w;
      if (b && !q)
        return (!n._readableState || !n._readableState.ended) && (w = new t()), u.call(n, w);
      if (S && !v)
        return (!n._writableState || !n._writableState.ended) && (w = new t()), u.call(n, w);
    }, y = function() {
      n.req.on("finish", E);
    };
    return l(n) ? (n.on("complete", E), n.on("abort", d), n.req ? y() : n.on("request", y)) : S && !n._writableState && (n.on("end", s), n.on("close", s)), n.on("end", p), n.on("finish", E), f.error !== !1 && n.on("error", T), n.on("close", d), function() {
      n.removeListener("complete", E), n.removeListener("abort", d), n.removeListener("request", y), n.req && n.req.removeListener("finish", E), n.removeListener("end", s), n.removeListener("close", s), n.removeListener("finish", E), n.removeListener("end", p), n.removeListener("error", T), n.removeListener("close", d);
    };
  }
  return endOfStream$1 = r, endOfStream$1;
}
var async_iterator, hasRequiredAsync_iterator;
function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator;
  hasRequiredAsync_iterator = 1;
  var t;
  function e(w, I, R) {
    return I = o(I), I in w ? Object.defineProperty(w, I, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : w[I] = R, w;
  }
  function o(w) {
    var I = l(w, "string");
    return typeof I == "symbol" ? I : String(I);
  }
  function l(w, I) {
    if (typeof w != "object" || w === null) return w;
    var R = w[Symbol.toPrimitive];
    if (R !== void 0) {
      var F = R.call(w, I);
      if (typeof F != "object") return F;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (I === "string" ? String : Number)(w);
  }
  var r = requireEndOfStream$1(), n = Symbol("lastResolve"), f = Symbol("lastReject"), u = Symbol("error"), b = Symbol("ended"), S = Symbol("lastPromise"), s = Symbol("handlePromise"), v = Symbol("stream");
  function E(w, I) {
    return {
      value: w,
      done: I
    };
  }
  function q(w) {
    var I = w[n];
    if (I !== null) {
      var R = w[v].read();
      R !== null && (w[S] = null, w[n] = null, w[f] = null, I(E(R, !1)));
    }
  }
  function p(w) {
    process$1.nextTick(q, w);
  }
  function T(w, I) {
    return function(R, F) {
      w.then(function() {
        if (I[b]) {
          R(E(void 0, !0));
          return;
        }
        I[s](R, F);
      }, F);
    };
  }
  var d = Object.getPrototypeOf(function() {
  }), y = Object.setPrototypeOf((t = {
    get stream() {
      return this[v];
    },
    next: function() {
      var I = this, R = this[u];
      if (R !== null)
        return Promise.reject(R);
      if (this[b])
        return Promise.resolve(E(void 0, !0));
      if (this[v].destroyed)
        return new Promise(function(Q, C) {
          process$1.nextTick(function() {
            I[u] ? C(I[u]) : Q(E(void 0, !0));
          });
        });
      var F = this[S], x;
      if (F)
        x = new Promise(T(F, this));
      else {
        var M = this[v].read();
        if (M !== null)
          return Promise.resolve(E(M, !1));
        x = new Promise(this[s]);
      }
      return this[S] = x, x;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var I = this;
    return new Promise(function(R, F) {
      I[v].destroy(null, function(x) {
        if (x) {
          F(x);
          return;
        }
        R(E(void 0, !0));
      });
    });
  }), t), d), A = function(I) {
    var R, F = Object.create(y, (R = {}, e(R, v, {
      value: I,
      writable: !0
    }), e(R, n, {
      value: null,
      writable: !0
    }), e(R, f, {
      value: null,
      writable: !0
    }), e(R, u, {
      value: null,
      writable: !0
    }), e(R, b, {
      value: I._readableState.endEmitted,
      writable: !0
    }), e(R, s, {
      value: function(M, Q) {
        var C = F[v].read();
        C ? (F[S] = null, F[n] = null, F[f] = null, M(E(C, !1))) : (F[n] = M, F[f] = Q);
      },
      writable: !0
    }), R));
    return F[S] = null, r(I, function(x) {
      if (x && x.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var M = F[f];
        M !== null && (F[S] = null, F[n] = null, F[f] = null, M(x)), F[u] = x;
        return;
      }
      var Q = F[n];
      Q !== null && (F[S] = null, F[n] = null, F[f] = null, Q(E(void 0, !0))), F[b] = !0;
    }), I.on("readable", p.bind(null, F)), F;
  };
  return async_iterator = A, async_iterator;
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
  hasRequired_stream_readable = 1, _stream_readable = Q;
  var t;
  Q.ReadableState = M, requireEvents().EventEmitter;
  var e = function(L, H) {
    return L.listeners(H).length;
  }, o = requireStreamBrowser(), l = requireDist().Buffer, r = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function n(D) {
    return l.from(D);
  }
  function f(D) {
    return l.isBuffer(D) || D instanceof r;
  }
  var u = requireUtil$2(), b;
  u && u.debuglog ? b = u.debuglog("stream") : b = function() {
  };
  var S = requireBuffer_list$1(), s = requireDestroy$1(), v = requireState$1(), E = v.getHighWaterMark, q = requireErrorsBrowser().codes, p = q.ERR_INVALID_ARG_TYPE, T = q.ERR_STREAM_PUSH_AFTER_EOF, d = q.ERR_METHOD_NOT_IMPLEMENTED, y = q.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, A, w, I;
  requireInherits_browser()(Q, o);
  var R = s.errorOrDestroy, F = ["error", "close", "destroy", "pause", "resume"];
  function x(D, L, H) {
    if (typeof D.prependListener == "function") return D.prependListener(L, H);
    !D._events || !D._events[L] ? D.on(L, H) : Array.isArray(D._events[L]) ? D._events[L].unshift(H) : D._events[L] = [H, D._events[L]];
  }
  function M(D, L, H) {
    t = t || require_stream_duplex(), D = D || {}, typeof H != "boolean" && (H = L instanceof t), this.objectMode = !!D.objectMode, H && (this.objectMode = this.objectMode || !!D.readableObjectMode), this.highWaterMark = E(this, D, "readableHighWaterMark", H), this.buffer = new S(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = D.emitClose !== !1, this.autoDestroy = !!D.autoDestroy, this.destroyed = !1, this.defaultEncoding = D.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, D.encoding && (A || (A = requireString_decoder().StringDecoder), this.decoder = new A(D.encoding), this.encoding = D.encoding);
  }
  function Q(D) {
    if (t = t || require_stream_duplex(), !(this instanceof Q)) return new Q(D);
    var L = this instanceof t;
    this._readableState = new M(D, this, L), this.readable = !0, D && (typeof D.read == "function" && (this._read = D.read), typeof D.destroy == "function" && (this._destroy = D.destroy)), o.call(this);
  }
  Object.defineProperty(Q.prototype, "destroyed", {
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
  }), Q.prototype.destroy = s.destroy, Q.prototype._undestroy = s.undestroy, Q.prototype._destroy = function(D, L) {
    L(D);
  }, Q.prototype.push = function(D, L) {
    var H = this._readableState, se;
    return H.objectMode ? se = !0 : typeof D == "string" && (L = L || H.defaultEncoding, L !== H.encoding && (D = l.from(D, L), L = ""), se = !0), C(this, D, L, !1, se);
  }, Q.prototype.unshift = function(D) {
    return C(this, D, null, !0, !1);
  };
  function C(D, L, H, se, we) {
    b("readableAddChunk", L);
    var Re = D._readableState;
    if (L === null)
      Re.reading = !1, Ee(D, Re);
    else {
      var Ae;
      if (we || (Ae = h(Re, L)), Ae)
        R(D, Ae);
      else if (Re.objectMode || L && L.length > 0)
        if (typeof L != "string" && !Re.objectMode && Object.getPrototypeOf(L) !== l.prototype && (L = n(L)), se)
          Re.endEmitted ? R(D, new y()) : W(D, Re, L, !0);
        else if (Re.ended)
          R(D, new T());
        else {
          if (Re.destroyed)
            return !1;
          Re.reading = !1, Re.decoder && !H ? (L = Re.decoder.write(L), Re.objectMode || L.length !== 0 ? W(D, Re, L, !1) : fe(D, Re)) : W(D, Re, L, !1);
        }
      else se || (Re.reading = !1, fe(D, Re));
    }
    return !Re.ended && (Re.length < Re.highWaterMark || Re.length === 0);
  }
  function W(D, L, H, se) {
    L.flowing && L.length === 0 && !L.sync ? (L.awaitDrain = 0, D.emit("data", H)) : (L.length += L.objectMode ? 1 : H.length, se ? L.buffer.unshift(H) : L.buffer.push(H), L.needReadable && _e(D)), fe(D, L);
  }
  function h(D, L) {
    var H;
    return !f(L) && typeof L != "string" && L !== void 0 && !D.objectMode && (H = new p("chunk", ["string", "Buffer", "Uint8Array"], L)), H;
  }
  Q.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, Q.prototype.setEncoding = function(D) {
    A || (A = requireString_decoder().StringDecoder);
    var L = new A(D);
    this._readableState.decoder = L, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var H = this._readableState.buffer.head, se = ""; H !== null; )
      se += L.write(H.data), H = H.next;
    return this._readableState.buffer.clear(), se !== "" && this._readableState.buffer.push(se), this._readableState.length = se.length, this;
  };
  var $ = 1073741824;
  function ae(D) {
    return D >= $ ? D = $ : (D--, D |= D >>> 1, D |= D >>> 2, D |= D >>> 4, D |= D >>> 8, D |= D >>> 16, D++), D;
  }
  function de(D, L) {
    return D <= 0 || L.length === 0 && L.ended ? 0 : L.objectMode ? 1 : D !== D ? L.flowing && L.length ? L.buffer.head.data.length : L.length : (D > L.highWaterMark && (L.highWaterMark = ae(D)), D <= L.length ? D : L.ended ? L.length : (L.needReadable = !0, 0));
  }
  Q.prototype.read = function(D) {
    b("read", D), D = parseInt(D, 10);
    var L = this._readableState, H = D;
    if (D !== 0 && (L.emittedReadable = !1), D === 0 && L.needReadable && ((L.highWaterMark !== 0 ? L.length >= L.highWaterMark : L.length > 0) || L.ended))
      return b("read: emitReadable", L.length, L.ended), L.length === 0 && L.ended ? N(this) : _e(this), null;
    if (D = de(D, L), D === 0 && L.ended)
      return L.length === 0 && N(this), null;
    var se = L.needReadable;
    b("need readable", se), (L.length === 0 || L.length - D < L.highWaterMark) && (se = !0, b("length less than watermark", se)), L.ended || L.reading ? (se = !1, b("reading or ended", se)) : se && (b("do read"), L.reading = !0, L.sync = !0, L.length === 0 && (L.needReadable = !0), this._read(L.highWaterMark), L.sync = !1, L.reading || (D = de(H, L)));
    var we;
    return D > 0 ? we = B(D, L) : we = null, we === null ? (L.needReadable = L.length <= L.highWaterMark, D = 0) : (L.length -= D, L.awaitDrain = 0), L.length === 0 && (L.ended || (L.needReadable = !0), H !== D && L.ended && N(this)), we !== null && this.emit("data", we), we;
  };
  function Ee(D, L) {
    if (b("onEofChunk"), !L.ended) {
      if (L.decoder) {
        var H = L.decoder.end();
        H && H.length && (L.buffer.push(H), L.length += L.objectMode ? 1 : H.length);
      }
      L.ended = !0, L.sync ? _e(D) : (L.needReadable = !1, L.emittedReadable || (L.emittedReadable = !0, ce(D)));
    }
  }
  function _e(D) {
    var L = D._readableState;
    b("emitReadable", L.needReadable, L.emittedReadable), L.needReadable = !1, L.emittedReadable || (b("emitReadable", L.flowing), L.emittedReadable = !0, process$1.nextTick(ce, D));
  }
  function ce(D) {
    var L = D._readableState;
    b("emitReadable_", L.destroyed, L.length, L.ended), !L.destroyed && (L.length || L.ended) && (D.emit("readable"), L.emittedReadable = !1), L.needReadable = !L.flowing && !L.ended && L.length <= L.highWaterMark, O(D);
  }
  function fe(D, L) {
    L.readingMore || (L.readingMore = !0, process$1.nextTick(k, D, L));
  }
  function k(D, L) {
    for (; !L.reading && !L.ended && (L.length < L.highWaterMark || L.flowing && L.length === 0); ) {
      var H = L.length;
      if (b("maybeReadMore read 0"), D.read(0), H === L.length)
        break;
    }
    L.readingMore = !1;
  }
  Q.prototype._read = function(D) {
    R(this, new d("_read()"));
  }, Q.prototype.pipe = function(D, L) {
    var H = this, se = this._readableState;
    switch (se.pipesCount) {
      case 0:
        se.pipes = D;
        break;
      case 1:
        se.pipes = [se.pipes, D];
        break;
      default:
        se.pipes.push(D);
        break;
    }
    se.pipesCount += 1, b("pipe count=%d opts=%j", se.pipesCount, L);
    var we = (!L || L.end !== !1) && D !== process$1.stdout && D !== process$1.stderr, Re = we ? Oe : Le;
    se.endEmitted ? process$1.nextTick(Re) : H.once("end", Re), D.on("unpipe", Ae);
    function Ae(Me, je) {
      b("onunpipe"), Me === H && je && je.hasUnpiped === !1 && (je.hasUnpiped = !0, Ce());
    }
    function Oe() {
      b("onend"), D.end();
    }
    var te = pe(H);
    D.on("drain", te);
    var Fe = !1;
    function Ce() {
      b("cleanup"), D.removeListener("close", me), D.removeListener("finish", Se), D.removeListener("drain", te), D.removeListener("error", Ue), D.removeListener("unpipe", Ae), H.removeListener("end", Oe), H.removeListener("end", Le), H.removeListener("data", qe), Fe = !0, se.awaitDrain && (!D._writableState || D._writableState.needDrain) && te();
    }
    H.on("data", qe);
    function qe(Me) {
      b("ondata");
      var je = D.write(Me);
      b("dest.write", je), je === !1 && ((se.pipesCount === 1 && se.pipes === D || se.pipesCount > 1 && ne(se.pipes, D) !== -1) && !Fe && (b("false write response, pause", se.awaitDrain), se.awaitDrain++), H.pause());
    }
    function Ue(Me) {
      b("onerror", Me), Le(), D.removeListener("error", Ue), e(D, "error") === 0 && R(D, Me);
    }
    x(D, "error", Ue);
    function me() {
      D.removeListener("finish", Se), Le();
    }
    D.once("close", me);
    function Se() {
      b("onfinish"), D.removeListener("close", me), Le();
    }
    D.once("finish", Se);
    function Le() {
      b("unpipe"), H.unpipe(D);
    }
    return D.emit("pipe", H), se.flowing || (b("pipe resume"), H.resume()), D;
  };
  function pe(D) {
    return function() {
      var H = D._readableState;
      b("pipeOnDrain", H.awaitDrain), H.awaitDrain && H.awaitDrain--, H.awaitDrain === 0 && e(D, "data") && (H.flowing = !0, O(D));
    };
  }
  Q.prototype.unpipe = function(D) {
    var L = this._readableState, H = {
      hasUnpiped: !1
    };
    if (L.pipesCount === 0) return this;
    if (L.pipesCount === 1)
      return D && D !== L.pipes ? this : (D || (D = L.pipes), L.pipes = null, L.pipesCount = 0, L.flowing = !1, D && D.emit("unpipe", this, H), this);
    if (!D) {
      var se = L.pipes, we = L.pipesCount;
      L.pipes = null, L.pipesCount = 0, L.flowing = !1;
      for (var Re = 0; Re < we; Re++) se[Re].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var Ae = ne(L.pipes, D);
    return Ae === -1 ? this : (L.pipes.splice(Ae, 1), L.pipesCount -= 1, L.pipesCount === 1 && (L.pipes = L.pipes[0]), D.emit("unpipe", this, H), this);
  }, Q.prototype.on = function(D, L) {
    var H = o.prototype.on.call(this, D, L), se = this._readableState;
    return D === "data" ? (se.readableListening = this.listenerCount("readable") > 0, se.flowing !== !1 && this.resume()) : D === "readable" && !se.endEmitted && !se.readableListening && (se.readableListening = se.needReadable = !0, se.flowing = !1, se.emittedReadable = !1, b("on readable", se.length, se.reading), se.length ? _e(this) : se.reading || process$1.nextTick(J, this)), H;
  }, Q.prototype.addListener = Q.prototype.on, Q.prototype.removeListener = function(D, L) {
    var H = o.prototype.removeListener.call(this, D, L);
    return D === "readable" && process$1.nextTick(ee, this), H;
  }, Q.prototype.removeAllListeners = function(D) {
    var L = o.prototype.removeAllListeners.apply(this, arguments);
    return (D === "readable" || D === void 0) && process$1.nextTick(ee, this), L;
  };
  function ee(D) {
    var L = D._readableState;
    L.readableListening = D.listenerCount("readable") > 0, L.resumeScheduled && !L.paused ? L.flowing = !0 : D.listenerCount("data") > 0 && D.resume();
  }
  function J(D) {
    b("readable nexttick read 0"), D.read(0);
  }
  Q.prototype.resume = function() {
    var D = this._readableState;
    return D.flowing || (b("resume"), D.flowing = !D.readableListening, G(this, D)), D.paused = !1, this;
  };
  function G(D, L) {
    L.resumeScheduled || (L.resumeScheduled = !0, process$1.nextTick(ue, D, L));
  }
  function ue(D, L) {
    b("resume", L.reading), L.reading || D.read(0), L.resumeScheduled = !1, D.emit("resume"), O(D), L.flowing && !L.reading && D.read(0);
  }
  Q.prototype.pause = function() {
    return b("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (b("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function O(D) {
    var L = D._readableState;
    for (b("flow", L.flowing); L.flowing && D.read() !== null; ) ;
  }
  Q.prototype.wrap = function(D) {
    var L = this, H = this._readableState, se = !1;
    D.on("end", function() {
      if (b("wrapped end"), H.decoder && !H.ended) {
        var Ae = H.decoder.end();
        Ae && Ae.length && L.push(Ae);
      }
      L.push(null);
    }), D.on("data", function(Ae) {
      if (b("wrapped data"), H.decoder && (Ae = H.decoder.write(Ae)), !(H.objectMode && Ae == null) && !(!H.objectMode && (!Ae || !Ae.length))) {
        var Oe = L.push(Ae);
        Oe || (se = !0, D.pause());
      }
    });
    for (var we in D)
      this[we] === void 0 && typeof D[we] == "function" && (this[we] = /* @__PURE__ */ (function(Oe) {
        return function() {
          return D[Oe].apply(D, arguments);
        };
      })(we));
    for (var Re = 0; Re < F.length; Re++)
      D.on(F[Re], this.emit.bind(this, F[Re]));
    return this._read = function(Ae) {
      b("wrapped _read", Ae), se && (se = !1, D.resume());
    }, this;
  }, typeof Symbol == "function" && (Q.prototype[Symbol.asyncIterator] = function() {
    return w === void 0 && (w = requireAsync_iterator()), w(this);
  }), Object.defineProperty(Q.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(Q.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(Q.prototype, "readableFlowing", {
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
  }), Q._fromList = B, Object.defineProperty(Q.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function B(D, L) {
    if (L.length === 0) return null;
    var H;
    return L.objectMode ? H = L.buffer.shift() : !D || D >= L.length ? (L.decoder ? H = L.buffer.join("") : L.buffer.length === 1 ? H = L.buffer.first() : H = L.buffer.concat(L.length), L.buffer.clear()) : H = L.buffer.consume(D, L.decoder), H;
  }
  function N(D) {
    var L = D._readableState;
    b("endReadable", L.endEmitted), L.endEmitted || (L.ended = !0, process$1.nextTick(re, L, D));
  }
  function re(D, L) {
    if (b("endReadableNT", D.endEmitted, D.length), !D.endEmitted && D.length === 0 && (D.endEmitted = !0, L.readable = !1, L.emit("end"), D.autoDestroy)) {
      var H = L._writableState;
      (!H || H.autoDestroy && H.finished) && L.destroy();
    }
  }
  typeof Symbol == "function" && (Q.from = function(D, L) {
    return I === void 0 && (I = requireFromBrowser()), I(Q, D, L);
  });
  function ne(D, L) {
    for (var H = 0, se = D.length; H < se; H++)
      if (D[H] === L) return H;
    return -1;
  }
  return _stream_readable;
}
var _stream_transform, hasRequired_stream_transform;
function require_stream_transform() {
  if (hasRequired_stream_transform) return _stream_transform;
  hasRequired_stream_transform = 1, _stream_transform = u;
  var t = requireErrorsBrowser().codes, e = t.ERR_METHOD_NOT_IMPLEMENTED, o = t.ERR_MULTIPLE_CALLBACK, l = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, r = t.ERR_TRANSFORM_WITH_LENGTH_0, n = require_stream_duplex();
  requireInherits_browser()(u, n);
  function f(s, v) {
    var E = this._transformState;
    E.transforming = !1;
    var q = E.writecb;
    if (q === null)
      return this.emit("error", new o());
    E.writechunk = null, E.writecb = null, v != null && this.push(v), q(s);
    var p = this._readableState;
    p.reading = !1, (p.needReadable || p.length < p.highWaterMark) && this._read(p.highWaterMark);
  }
  function u(s) {
    if (!(this instanceof u)) return new u(s);
    n.call(this, s), this._transformState = {
      afterTransform: f.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, s && (typeof s.transform == "function" && (this._transform = s.transform), typeof s.flush == "function" && (this._flush = s.flush)), this.on("prefinish", b);
  }
  function b() {
    var s = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(v, E) {
      S(s, v, E);
    }) : S(this, null, null);
  }
  u.prototype.push = function(s, v) {
    return this._transformState.needTransform = !1, n.prototype.push.call(this, s, v);
  }, u.prototype._transform = function(s, v, E) {
    E(new e("_transform()"));
  }, u.prototype._write = function(s, v, E) {
    var q = this._transformState;
    if (q.writecb = E, q.writechunk = s, q.writeencoding = v, !q.transforming) {
      var p = this._readableState;
      (q.needTransform || p.needReadable || p.length < p.highWaterMark) && this._read(p.highWaterMark);
    }
  }, u.prototype._read = function(s) {
    var v = this._transformState;
    v.writechunk !== null && !v.transforming ? (v.transforming = !0, this._transform(v.writechunk, v.writeencoding, v.afterTransform)) : v.needTransform = !0;
  }, u.prototype._destroy = function(s, v) {
    n.prototype._destroy.call(this, s, function(E) {
      v(E);
    });
  };
  function S(s, v, E) {
    if (v) return s.emit("error", v);
    if (E != null && s.push(E), s._writableState.length) throw new r();
    if (s._transformState.transforming) throw new l();
    return s.push(null);
  }
  return _stream_transform;
}
var _stream_passthrough, hasRequired_stream_passthrough;
function require_stream_passthrough() {
  if (hasRequired_stream_passthrough) return _stream_passthrough;
  hasRequired_stream_passthrough = 1, _stream_passthrough = e;
  var t = require_stream_transform();
  requireInherits_browser()(e, t);
  function e(o) {
    if (!(this instanceof e)) return new e(o);
    t.call(this, o);
  }
  return e.prototype._transform = function(o, l, r) {
    r(null, o);
  }, _stream_passthrough;
}
var pipeline_1$1, hasRequiredPipeline$1;
function requirePipeline$1() {
  if (hasRequiredPipeline$1) return pipeline_1$1;
  hasRequiredPipeline$1 = 1;
  var t;
  function e(E) {
    var q = !1;
    return function() {
      q || (q = !0, E.apply(void 0, arguments));
    };
  }
  var o = requireErrorsBrowser().codes, l = o.ERR_MISSING_ARGS, r = o.ERR_STREAM_DESTROYED;
  function n(E) {
    if (E) throw E;
  }
  function f(E) {
    return E.setHeader && typeof E.abort == "function";
  }
  function u(E, q, p, T) {
    T = e(T);
    var d = !1;
    E.on("close", function() {
      d = !0;
    }), t === void 0 && (t = requireEndOfStream$1()), t(E, {
      readable: q,
      writable: p
    }, function(A) {
      if (A) return T(A);
      d = !0, T();
    });
    var y = !1;
    return function(A) {
      if (!d && !y) {
        if (y = !0, f(E)) return E.abort();
        if (typeof E.destroy == "function") return E.destroy();
        T(A || new r("pipe"));
      }
    };
  }
  function b(E) {
    E();
  }
  function S(E, q) {
    return E.pipe(q);
  }
  function s(E) {
    return !E.length || typeof E[E.length - 1] != "function" ? n : E.pop();
  }
  function v() {
    for (var E = arguments.length, q = new Array(E), p = 0; p < E; p++)
      q[p] = arguments[p];
    var T = s(q);
    if (Array.isArray(q[0]) && (q = q[0]), q.length < 2)
      throw new l("streams");
    var d, y = q.map(function(A, w) {
      var I = w < q.length - 1, R = w > 0;
      return u(A, I, R, function(F) {
        d || (d = F), F && y.forEach(b), !I && (y.forEach(b), T(d));
      });
    });
    return q.reduce(S);
  }
  return pipeline_1$1 = v, pipeline_1$1;
}
var streamBrowserify, hasRequiredStreamBrowserify;
function requireStreamBrowserify() {
  if (hasRequiredStreamBrowserify) return streamBrowserify;
  hasRequiredStreamBrowserify = 1, streamBrowserify = o;
  var t = requireEvents().EventEmitter, e = requireInherits_browser();
  e(o, t), o.Readable = require_stream_readable(), o.Writable = require_stream_writable(), o.Duplex = require_stream_duplex(), o.Transform = require_stream_transform(), o.PassThrough = require_stream_passthrough(), o.finished = requireEndOfStream$1(), o.pipeline = requirePipeline$1(), o.Stream = o;
  function o() {
    t.call(this);
  }
  return o.prototype.pipe = function(l, r) {
    var n = this;
    function f(q) {
      l.writable && l.write(q) === !1 && n.pause && n.pause();
    }
    n.on("data", f);
    function u() {
      n.readable && n.resume && n.resume();
    }
    l.on("drain", u), !l._isStdio && (!r || r.end !== !1) && (n.on("end", S), n.on("close", s));
    var b = !1;
    function S() {
      b || (b = !0, l.end());
    }
    function s() {
      b || (b = !0, typeof l.destroy == "function" && l.destroy());
    }
    function v(q) {
      if (E(), t.listenerCount(this, "error") === 0)
        throw q;
    }
    n.on("error", v), l.on("error", v);
    function E() {
      n.removeListener("data", f), l.removeListener("drain", u), n.removeListener("end", S), n.removeListener("close", s), n.removeListener("error", v), l.removeListener("error", v), n.removeListener("end", E), n.removeListener("close", E), l.removeListener("close", E);
    }
    return n.on("end", E), n.on("close", E), l.on("close", E), l.emit("pipe", n), l;
  }, streamBrowserify;
}
var binding = {}, assert = { exports: {} }, errors$1 = {}, hasRequiredErrors$1;
function requireErrors$1() {
  if (hasRequiredErrors$1) return errors$1;
  hasRequiredErrors$1 = 1;
  function t(A) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(w) {
      return typeof w;
    } : function(w) {
      return w && typeof Symbol == "function" && w.constructor === Symbol && w !== Symbol.prototype ? "symbol" : typeof w;
    }, t(A);
  }
  function e(A, w, I) {
    return Object.defineProperty(A, "prototype", { writable: !1 }), A;
  }
  function o(A, w) {
    if (!(A instanceof w))
      throw new TypeError("Cannot call a class as a function");
  }
  function l(A, w) {
    if (typeof w != "function" && w !== null)
      throw new TypeError("Super expression must either be null or a function");
    A.prototype = Object.create(w && w.prototype, { constructor: { value: A, writable: !0, configurable: !0 } }), Object.defineProperty(A, "prototype", { writable: !1 }), w && r(A, w);
  }
  function r(A, w) {
    return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(R, F) {
      return R.__proto__ = F, R;
    }, r(A, w);
  }
  function n(A) {
    var w = b();
    return function() {
      var R = S(A), F;
      if (w) {
        var x = S(this).constructor;
        F = Reflect.construct(R, arguments, x);
      } else
        F = R.apply(this, arguments);
      return f(this, F);
    };
  }
  function f(A, w) {
    if (w && (t(w) === "object" || typeof w == "function"))
      return w;
    if (w !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return u(A);
  }
  function u(A) {
    if (A === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return A;
  }
  function b() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function S(A) {
    return S = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(I) {
      return I.__proto__ || Object.getPrototypeOf(I);
    }, S(A);
  }
  var s = {}, v, E;
  function q(A, w, I) {
    I || (I = Error);
    function R(x, M, Q) {
      return typeof w == "string" ? w : w(x, M, Q);
    }
    var F = /* @__PURE__ */ (function(x) {
      l(Q, x);
      var M = n(Q);
      function Q(C, W, h) {
        var $;
        return o(this, Q), $ = M.call(this, R(C, W, h)), $.code = A, $;
      }
      return e(Q);
    })(I);
    s[A] = F;
  }
  function p(A, w) {
    if (Array.isArray(A)) {
      var I = A.length;
      return A = A.map(function(R) {
        return String(R);
      }), I > 2 ? "one of ".concat(w, " ").concat(A.slice(0, I - 1).join(", "), ", or ") + A[I - 1] : I === 2 ? "one of ".concat(w, " ").concat(A[0], " or ").concat(A[1]) : "of ".concat(w, " ").concat(A[0]);
    } else
      return "of ".concat(w, " ").concat(String(A));
  }
  function T(A, w, I) {
    return A.substr(0, w.length) === w;
  }
  function d(A, w, I) {
    return (I === void 0 || I > A.length) && (I = A.length), A.substring(I - w.length, I) === w;
  }
  function y(A, w, I) {
    return typeof I != "number" && (I = 0), I + w.length > A.length ? !1 : A.indexOf(w, I) !== -1;
  }
  return q("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), q("ERR_INVALID_ARG_TYPE", function(A, w, I) {
    v === void 0 && (v = requireAssert()), v(typeof A == "string", "'name' must be a string");
    var R;
    typeof w == "string" && T(w, "not ") ? (R = "must not be", w = w.replace(/^not /, "")) : R = "must be";
    var F;
    if (d(A, " argument"))
      F = "The ".concat(A, " ").concat(R, " ").concat(p(w, "type"));
    else {
      var x = y(A, ".") ? "property" : "argument";
      F = 'The "'.concat(A, '" ').concat(x, " ").concat(R, " ").concat(p(w, "type"));
    }
    return F += ". Received type ".concat(t(I)), F;
  }, TypeError), q("ERR_INVALID_ARG_VALUE", function(A, w) {
    var I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
    E === void 0 && (E = requireUtil$2());
    var R = E.inspect(w);
    return R.length > 128 && (R = "".concat(R.slice(0, 128), "...")), "The argument '".concat(A, "' ").concat(I, ". Received ").concat(R);
  }, TypeError), q("ERR_INVALID_RETURN_VALUE", function(A, w, I) {
    var R;
    return I && I.constructor && I.constructor.name ? R = "instance of ".concat(I.constructor.name) : R = "type ".concat(t(I)), "Expected ".concat(A, ' to be returned from the "').concat(w, '"') + " function but got ".concat(R, ".");
  }, TypeError), q("ERR_MISSING_ARGS", function() {
    for (var A = arguments.length, w = new Array(A), I = 0; I < A; I++)
      w[I] = arguments[I];
    v === void 0 && (v = requireAssert()), v(w.length > 0, "At least one arg needs to be specified");
    var R = "The ", F = w.length;
    switch (w = w.map(function(x) {
      return '"'.concat(x, '"');
    }), F) {
      case 1:
        R += "".concat(w[0], " argument");
        break;
      case 2:
        R += "".concat(w[0], " and ").concat(w[1], " arguments");
        break;
      default:
        R += w.slice(0, F - 1).join(", "), R += ", and ".concat(w[F - 1], " arguments");
        break;
    }
    return "".concat(R, " must be specified");
  }, TypeError), errors$1.codes = s, errors$1;
}
var assertion_error, hasRequiredAssertion_error;
function requireAssertion_error() {
  if (hasRequiredAssertion_error) return assertion_error;
  hasRequiredAssertion_error = 1;
  function t(fe, k) {
    var pe = Object.keys(fe);
    if (Object.getOwnPropertySymbols) {
      var ee = Object.getOwnPropertySymbols(fe);
      k && (ee = ee.filter(function(J) {
        return Object.getOwnPropertyDescriptor(fe, J).enumerable;
      })), pe.push.apply(pe, ee);
    }
    return pe;
  }
  function e(fe) {
    for (var k = 1; k < arguments.length; k++) {
      var pe = arguments[k] != null ? arguments[k] : {};
      k % 2 ? t(Object(pe), !0).forEach(function(ee) {
        o(fe, ee, pe[ee]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(fe, Object.getOwnPropertyDescriptors(pe)) : t(Object(pe)).forEach(function(ee) {
        Object.defineProperty(fe, ee, Object.getOwnPropertyDescriptor(pe, ee));
      });
    }
    return fe;
  }
  function o(fe, k, pe) {
    return k = f(k), k in fe ? Object.defineProperty(fe, k, { value: pe, enumerable: !0, configurable: !0, writable: !0 }) : fe[k] = pe, fe;
  }
  function l(fe, k) {
    if (!(fe instanceof k))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(fe, k) {
    for (var pe = 0; pe < k.length; pe++) {
      var ee = k[pe];
      ee.enumerable = ee.enumerable || !1, ee.configurable = !0, "value" in ee && (ee.writable = !0), Object.defineProperty(fe, f(ee.key), ee);
    }
  }
  function n(fe, k, pe) {
    return k && r(fe.prototype, k), Object.defineProperty(fe, "prototype", { writable: !1 }), fe;
  }
  function f(fe) {
    var k = u(fe, "string");
    return A(k) === "symbol" ? k : String(k);
  }
  function u(fe, k) {
    if (A(fe) !== "object" || fe === null) return fe;
    var pe = fe[Symbol.toPrimitive];
    if (pe !== void 0) {
      var ee = pe.call(fe, k);
      if (A(ee) !== "object") return ee;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(fe);
  }
  function b(fe, k) {
    if (typeof k != "function" && k !== null)
      throw new TypeError("Super expression must either be null or a function");
    fe.prototype = Object.create(k && k.prototype, { constructor: { value: fe, writable: !0, configurable: !0 } }), Object.defineProperty(fe, "prototype", { writable: !1 }), k && d(fe, k);
  }
  function S(fe) {
    var k = p();
    return function() {
      var ee = y(fe), J;
      if (k) {
        var G = y(this).constructor;
        J = Reflect.construct(ee, arguments, G);
      } else
        J = ee.apply(this, arguments);
      return s(this, J);
    };
  }
  function s(fe, k) {
    if (k && (A(k) === "object" || typeof k == "function"))
      return k;
    if (k !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return v(fe);
  }
  function v(fe) {
    if (fe === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return fe;
  }
  function E(fe) {
    var k = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return E = function(ee) {
      if (ee === null || !T(ee)) return ee;
      if (typeof ee != "function")
        throw new TypeError("Super expression must either be null or a function");
      if (typeof k < "u") {
        if (k.has(ee)) return k.get(ee);
        k.set(ee, J);
      }
      function J() {
        return q(ee, arguments, y(this).constructor);
      }
      return J.prototype = Object.create(ee.prototype, { constructor: { value: J, enumerable: !1, writable: !0, configurable: !0 } }), d(J, ee);
    }, E(fe);
  }
  function q(fe, k, pe) {
    return p() ? q = Reflect.construct.bind() : q = function(J, G, ue) {
      var O = [null];
      O.push.apply(O, G);
      var B = Function.bind.apply(J, O), N = new B();
      return ue && d(N, ue.prototype), N;
    }, q.apply(null, arguments);
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
  function T(fe) {
    return Function.toString.call(fe).indexOf("[native code]") !== -1;
  }
  function d(fe, k) {
    return d = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ee, J) {
      return ee.__proto__ = J, ee;
    }, d(fe, k);
  }
  function y(fe) {
    return y = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(pe) {
      return pe.__proto__ || Object.getPrototypeOf(pe);
    }, y(fe);
  }
  function A(fe) {
    "@babel/helpers - typeof";
    return A = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(k) {
      return typeof k;
    } : function(k) {
      return k && typeof Symbol == "function" && k.constructor === Symbol && k !== Symbol.prototype ? "symbol" : typeof k;
    }, A(fe);
  }
  var w = requireUtil$2(), I = w.inspect, R = requireErrors$1(), F = R.codes.ERR_INVALID_ARG_TYPE;
  function x(fe, k, pe) {
    return (pe === void 0 || pe > fe.length) && (pe = fe.length), fe.substring(pe - k.length, pe) === k;
  }
  function M(fe, k) {
    if (k = Math.floor(k), fe.length == 0 || k == 0) return "";
    var pe = fe.length * k;
    for (k = Math.floor(Math.log(k) / Math.log(2)); k; )
      fe += fe, k--;
    return fe += fe.substring(0, pe - fe.length), fe;
  }
  var Q = "", C = "", W = "", h = "", $ = {
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
  }, ae = 10;
  function de(fe) {
    var k = Object.keys(fe), pe = Object.create(Object.getPrototypeOf(fe));
    return k.forEach(function(ee) {
      pe[ee] = fe[ee];
    }), Object.defineProperty(pe, "message", {
      value: fe.message
    }), pe;
  }
  function Ee(fe) {
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
  function _e(fe, k, pe) {
    var ee = "", J = "", G = 0, ue = "", O = !1, B = Ee(fe), N = B.split(`
`), re = Ee(k).split(`
`), ne = 0, D = "";
    if (pe === "strictEqual" && A(fe) === "object" && A(k) === "object" && fe !== null && k !== null && (pe = "strictEqualObject"), N.length === 1 && re.length === 1 && N[0] !== re[0]) {
      var L = N[0].length + re[0].length;
      if (L <= ae) {
        if ((A(fe) !== "object" || fe === null) && (A(k) !== "object" || k === null) && (fe !== 0 || k !== 0))
          return "".concat($[pe], `

`) + "".concat(N[0], " !== ").concat(re[0], `
`);
      } else if (pe !== "strictEqualObject") {
        var H = process$1.stderr && process$1.stderr.isTTY ? process$1.stderr.columns : 80;
        if (L < H) {
          for (; N[0][ne] === re[0][ne]; )
            ne++;
          ne > 2 && (D = `
  `.concat(M(" ", ne), "^"), ne = 0);
        }
      }
    }
    for (var se = N[N.length - 1], we = re[re.length - 1]; se === we && (ne++ < 2 ? ue = `
  `.concat(se).concat(ue) : ee = se, N.pop(), re.pop(), !(N.length === 0 || re.length === 0)); )
      se = N[N.length - 1], we = re[re.length - 1];
    var Re = Math.max(N.length, re.length);
    if (Re === 0) {
      var Ae = B.split(`
`);
      if (Ae.length > 30)
        for (Ae[26] = "".concat(Q, "...").concat(h); Ae.length > 27; )
          Ae.pop();
      return "".concat($.notIdentical, `

`).concat(Ae.join(`
`), `
`);
    }
    ne > 3 && (ue = `
`.concat(Q, "...").concat(h).concat(ue), O = !0), ee !== "" && (ue = `
  `.concat(ee).concat(ue), ee = "");
    var Oe = 0, te = $[pe] + `
`.concat(C, "+ actual").concat(h, " ").concat(W, "- expected").concat(h), Fe = " ".concat(Q, "...").concat(h, " Lines skipped");
    for (ne = 0; ne < Re; ne++) {
      var Ce = ne - G;
      if (N.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (J += `
`.concat(Q, "...").concat(h), O = !0) : Ce > 3 && (J += `
  `.concat(re[ne - 2]), Oe++), J += `
  `.concat(re[ne - 1]), Oe++), G = ne, ee += `
`.concat(W, "-").concat(h, " ").concat(re[ne]), Oe++;
      else if (re.length < ne + 1)
        Ce > 1 && ne > 2 && (Ce > 4 ? (J += `
`.concat(Q, "...").concat(h), O = !0) : Ce > 3 && (J += `
  `.concat(N[ne - 2]), Oe++), J += `
  `.concat(N[ne - 1]), Oe++), G = ne, J += `
`.concat(C, "+").concat(h, " ").concat(N[ne]), Oe++;
      else {
        var qe = re[ne], Ue = N[ne], me = Ue !== qe && (!x(Ue, ",") || Ue.slice(0, -1) !== qe);
        me && x(qe, ",") && qe.slice(0, -1) === Ue && (me = !1, Ue += ","), me ? (Ce > 1 && ne > 2 && (Ce > 4 ? (J += `
`.concat(Q, "...").concat(h), O = !0) : Ce > 3 && (J += `
  `.concat(N[ne - 2]), Oe++), J += `
  `.concat(N[ne - 1]), Oe++), G = ne, J += `
`.concat(C, "+").concat(h, " ").concat(Ue), ee += `
`.concat(W, "-").concat(h, " ").concat(qe), Oe += 2) : (J += ee, ee = "", (Ce === 1 || ne === 0) && (J += `
  `.concat(Ue), Oe++));
      }
      if (Oe > 20 && ne < Re - 2)
        return "".concat(te).concat(Fe, `
`).concat(J, `
`).concat(Q, "...").concat(h).concat(ee, `
`) + "".concat(Q, "...").concat(h);
    }
    return "".concat(te).concat(O ? Fe : "", `
`).concat(J).concat(ee).concat(ue).concat(D);
  }
  var ce = /* @__PURE__ */ (function(fe, k) {
    b(ee, fe);
    var pe = S(ee);
    function ee(J) {
      var G;
      if (l(this, ee), A(J) !== "object" || J === null)
        throw new F("options", "Object", J);
      var ue = J.message, O = J.operator, B = J.stackStartFn, N = J.actual, re = J.expected, ne = Error.stackTraceLimit;
      if (Error.stackTraceLimit = 0, ue != null)
        G = pe.call(this, String(ue));
      else if (process$1.stderr && process$1.stderr.isTTY && (process$1.stderr && process$1.stderr.getColorDepth && process$1.stderr.getColorDepth() !== 1 ? (Q = "\x1B[34m", C = "\x1B[32m", h = "\x1B[39m", W = "\x1B[31m") : (Q = "", C = "", h = "", W = "")), A(N) === "object" && N !== null && A(re) === "object" && re !== null && "stack" in N && N instanceof Error && "stack" in re && re instanceof Error && (N = de(N), re = de(re)), O === "deepStrictEqual" || O === "strictEqual")
        G = pe.call(this, _e(N, re, O));
      else if (O === "notDeepStrictEqual" || O === "notStrictEqual") {
        var D = $[O], L = Ee(N).split(`
`);
        if (O === "notStrictEqual" && A(N) === "object" && N !== null && (D = $.notStrictEqualObject), L.length > 30)
          for (L[26] = "".concat(Q, "...").concat(h); L.length > 27; )
            L.pop();
        L.length === 1 ? G = pe.call(this, "".concat(D, " ").concat(L[0])) : G = pe.call(this, "".concat(D, `

`).concat(L.join(`
`), `
`));
      } else {
        var H = Ee(N), se = "", we = $[O];
        O === "notDeepEqual" || O === "notEqual" ? (H = "".concat($[O], `

`).concat(H), H.length > 1024 && (H = "".concat(H.slice(0, 1021), "..."))) : (se = "".concat(Ee(re)), H.length > 512 && (H = "".concat(H.slice(0, 509), "...")), se.length > 512 && (se = "".concat(se.slice(0, 509), "...")), O === "deepEqual" || O === "equal" ? H = "".concat(we, `

`).concat(H, `

should equal

`) : se = " ".concat(O, " ").concat(se)), G = pe.call(this, "".concat(H).concat(se));
      }
      return Error.stackTraceLimit = ne, G.generatedMessage = !ue, Object.defineProperty(v(G), "name", {
        value: "AssertionError [ERR_ASSERTION]",
        enumerable: !1,
        writable: !0,
        configurable: !0
      }), G.code = "ERR_ASSERTION", G.actual = N, G.expected = re, G.operator = O, Error.captureStackTrace && Error.captureStackTrace(v(G), B), G.stack, G.name = "AssertionError", s(G);
    }
    return n(ee, [{
      key: "toString",
      value: function() {
        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
      }
    }, {
      key: k,
      value: function(G, ue) {
        return I(this, e(e({}, ue), {}, {
          customInspect: !1,
          depth: 0
        }));
      }
    }]), ee;
  })(/* @__PURE__ */ E(Error), I.custom);
  return assertion_error = ce, assertion_error;
}
var isArguments, hasRequiredIsArguments;
function requireIsArguments() {
  if (hasRequiredIsArguments) return isArguments;
  hasRequiredIsArguments = 1;
  var t = Object.prototype.toString;
  return isArguments = function(o) {
    var l = t.call(o), r = l === "[object Arguments]";
    return r || (r = l !== "[object Array]" && o !== null && typeof o == "object" && typeof o.length == "number" && o.length >= 0 && t.call(o.callee) === "[object Function]"), r;
  }, isArguments;
}
var implementation$3, hasRequiredImplementation$3;
function requireImplementation$3() {
  if (hasRequiredImplementation$3) return implementation$3;
  hasRequiredImplementation$3 = 1;
  var t;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, o = Object.prototype.toString, l = requireIsArguments(), r = Object.prototype.propertyIsEnumerable, n = !r.call({ toString: null }, "toString"), f = r.call(function() {
    }, "prototype"), u = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], b = function(E) {
      var q = E.constructor;
      return q && q.prototype === E;
    }, S = {
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
    }, s = (function() {
      if (typeof window > "u")
        return !1;
      for (var E in window)
        try {
          if (!S["$" + E] && e.call(window, E) && window[E] !== null && typeof window[E] == "object")
            try {
              b(window[E]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), v = function(E) {
      if (typeof window > "u" || !s)
        return b(E);
      try {
        return b(E);
      } catch {
        return !1;
      }
    };
    t = function(q) {
      var p = q !== null && typeof q == "object", T = o.call(q) === "[object Function]", d = l(q), y = p && o.call(q) === "[object String]", A = [];
      if (!p && !T && !d)
        throw new TypeError("Object.keys called on a non-object");
      var w = f && T;
      if (y && q.length > 0 && !e.call(q, 0))
        for (var I = 0; I < q.length; ++I)
          A.push(String(I));
      if (d && q.length > 0)
        for (var R = 0; R < q.length; ++R)
          A.push(String(R));
      else
        for (var F in q)
          !(w && F === "prototype") && e.call(q, F) && A.push(String(F));
      if (n)
        for (var x = v(q), M = 0; M < u.length; ++M)
          !(x && u[M] === "constructor") && e.call(q, u[M]) && A.push(u[M]);
      return A;
    };
  }
  return implementation$3 = t, implementation$3;
}
var objectKeys, hasRequiredObjectKeys;
function requireObjectKeys() {
  if (hasRequiredObjectKeys) return objectKeys;
  hasRequiredObjectKeys = 1;
  var t = Array.prototype.slice, e = requireIsArguments(), o = Object.keys, l = o ? function(f) {
    return o(f);
  } : requireImplementation$3(), r = Object.keys;
  return l.shim = function() {
    if (Object.keys) {
      var f = (function() {
        var u = Object.keys(arguments);
        return u && u.length === arguments.length;
      })(1, 2);
      f || (Object.keys = function(b) {
        return e(b) ? r(t.call(b)) : r(b);
      });
    } else
      Object.keys = l;
    return Object.keys || l;
  }, objectKeys = l, objectKeys;
}
var implementation$2, hasRequiredImplementation$2;
function requireImplementation$2() {
  if (hasRequiredImplementation$2) return implementation$2;
  hasRequiredImplementation$2 = 1;
  var t = requireObjectKeys(), e = requireShams$1()(), o = /* @__PURE__ */ requireCallBound$1(), l = /* @__PURE__ */ requireEsObjectAtoms(), r = o("Array.prototype.push"), n = o("Object.prototype.propertyIsEnumerable"), f = e ? l.getOwnPropertySymbols : null;
  return implementation$2 = function(b, S) {
    if (b == null)
      throw new TypeError("target must be an object");
    var s = l(b);
    if (arguments.length === 1)
      return s;
    for (var v = 1; v < arguments.length; ++v) {
      var E = l(arguments[v]), q = t(E), p = e && (l.getOwnPropertySymbols || f);
      if (p)
        for (var T = p(E), d = 0; d < T.length; ++d) {
          var y = T[d];
          n(E, y) && r(q, y);
        }
      for (var A = 0; A < q.length; ++A) {
        var w = q[A];
        if (n(E, w)) {
          var I = E[w];
          s[w] = I;
        }
      }
    }
    return s;
  }, implementation$2;
}
var polyfill$2, hasRequiredPolyfill$2;
function requirePolyfill$2() {
  if (hasRequiredPolyfill$2) return polyfill$2;
  hasRequiredPolyfill$2 = 1;
  var t = requireImplementation$2(), e = function() {
    if (!Object.assign)
      return !1;
    for (var l = "abcdefghijklmnopqrst", r = l.split(""), n = {}, f = 0; f < r.length; ++f)
      n[r[f]] = r[f];
    var u = Object.assign({}, n), b = "";
    for (var S in u)
      b += S;
    return l !== b;
  }, o = function() {
    if (!Object.assign || !Object.preventExtensions)
      return !1;
    var l = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(l, "xy");
    } catch {
      return l[1] === "y";
    }
    return !1;
  };
  return polyfill$2 = function() {
    return !Object.assign || e() || o() ? t : Object.assign;
  }, polyfill$2;
}
var implementation$1, hasRequiredImplementation$1;
function requireImplementation$1() {
  if (hasRequiredImplementation$1) return implementation$1;
  hasRequiredImplementation$1 = 1;
  var t = function(e) {
    return e !== e;
  };
  return implementation$1 = function(o, l) {
    return o === 0 && l === 0 ? 1 / o === 1 / l : !!(o === l || t(o) && t(l));
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
  var t = /* @__PURE__ */ requireGetIntrinsic(), e = requireCallBind(), o = e(t("String.prototype.indexOf"));
  return callBound = function(r, n) {
    var f = t(r, !!n);
    return typeof f == "function" && o(r, ".prototype.") > -1 ? e(f) : f;
  }, callBound;
}
var defineProperties_1, hasRequiredDefineProperties;
function requireDefineProperties() {
  if (hasRequiredDefineProperties) return defineProperties_1;
  hasRequiredDefineProperties = 1;
  var t = requireObjectKeys(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", o = Object.prototype.toString, l = Array.prototype.concat, r = /* @__PURE__ */ requireDefineDataProperty(), n = function(S) {
    return typeof S == "function" && o.call(S) === "[object Function]";
  }, f = /* @__PURE__ */ requireHasPropertyDescriptors()(), u = function(S, s, v, E) {
    if (s in S) {
      if (E === !0) {
        if (S[s] === v)
          return;
      } else if (!n(E) || !E())
        return;
    }
    f ? r(S, s, v, !0) : r(S, s, v);
  }, b = function(S, s) {
    var v = arguments.length > 2 ? arguments[2] : {}, E = t(s);
    e && (E = l.call(E, Object.getOwnPropertySymbols(s)));
    for (var q = 0; q < E.length; q += 1)
      u(S, E[q], s[E[q]], v[E[q]]);
  };
  return b.supportsDescriptors = !!f, defineProperties_1 = b, defineProperties_1;
}
var shim$1, hasRequiredShim$1;
function requireShim$1() {
  if (hasRequiredShim$1) return shim$1;
  hasRequiredShim$1 = 1;
  var t = requirePolyfill$1(), e = requireDefineProperties();
  return shim$1 = function() {
    var l = t();
    return e(Object, { is: l }, {
      is: function() {
        return Object.is !== l;
      }
    }), l;
  }, shim$1;
}
var objectIs, hasRequiredObjectIs;
function requireObjectIs() {
  if (hasRequiredObjectIs) return objectIs;
  hasRequiredObjectIs = 1;
  var t = requireDefineProperties(), e = requireCallBind(), o = requireImplementation$1(), l = requirePolyfill$1(), r = requireShim$1(), n = e(l(), Object);
  return t(n, {
    getPolyfill: l,
    implementation: o,
    shim: r
  }), objectIs = n, objectIs;
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
    var l = e();
    return t(Number, { isNaN: l }, {
      isNaN: function() {
        return Number.isNaN !== l;
      }
    }), l;
  }, shim;
}
var isNan, hasRequiredIsNan;
function requireIsNan() {
  if (hasRequiredIsNan) return isNan;
  hasRequiredIsNan = 1;
  var t = requireCallBind(), e = requireDefineProperties(), o = requireImplementation(), l = requirePolyfill(), r = requireShim(), n = t(l(), Number);
  return e(n, {
    getPolyfill: l,
    implementation: o,
    shim: r
  }), isNan = n, isNan;
}
var comparisons, hasRequiredComparisons;
function requireComparisons() {
  if (hasRequiredComparisons) return comparisons;
  hasRequiredComparisons = 1;
  function t(me, Se) {
    return n(me) || r(me, Se) || o(me, Se) || e();
  }
  function e() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function o(me, Se) {
    if (me) {
      if (typeof me == "string") return l(me, Se);
      var Le = Object.prototype.toString.call(me).slice(8, -1);
      if (Le === "Object" && me.constructor && (Le = me.constructor.name), Le === "Map" || Le === "Set") return Array.from(me);
      if (Le === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(Le)) return l(me, Se);
    }
  }
  function l(me, Se) {
    (Se == null || Se > me.length) && (Se = me.length);
    for (var Le = 0, Me = new Array(Se); Le < Se; Le++) Me[Le] = me[Le];
    return Me;
  }
  function r(me, Se) {
    var Le = me == null ? null : typeof Symbol < "u" && me[Symbol.iterator] || me["@@iterator"];
    if (Le != null) {
      var Me, je, He, U, a = [], m = !0, z = !1;
      try {
        if (He = (Le = Le.call(me)).next, Se !== 0) for (; !(m = (Me = He.call(Le)).done) && (a.push(Me.value), a.length !== Se); m = !0) ;
      } catch (le) {
        z = !0, je = le;
      } finally {
        try {
          if (!m && Le.return != null && (U = Le.return(), Object(U) !== U)) return;
        } finally {
          if (z) throw je;
        }
      }
      return a;
    }
  }
  function n(me) {
    if (Array.isArray(me)) return me;
  }
  function f(me) {
    "@babel/helpers - typeof";
    return f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Se) {
      return typeof Se;
    } : function(Se) {
      return Se && typeof Symbol == "function" && Se.constructor === Symbol && Se !== Symbol.prototype ? "symbol" : typeof Se;
    }, f(me);
  }
  var u = /a/g.flags !== void 0, b = function(Se) {
    var Le = [];
    return Se.forEach(function(Me) {
      return Le.push(Me);
    }), Le;
  }, S = function(Se) {
    var Le = [];
    return Se.forEach(function(Me, je) {
      return Le.push([je, Me]);
    }), Le;
  }, s = Object.is ? Object.is : requireObjectIs(), v = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
    return [];
  }, E = Number.isNaN ? Number.isNaN : requireIsNan();
  function q(me) {
    return me.call.bind(me);
  }
  var p = q(Object.prototype.hasOwnProperty), T = q(Object.prototype.propertyIsEnumerable), d = q(Object.prototype.toString), y = requireUtil$2().types, A = y.isAnyArrayBuffer, w = y.isArrayBufferView, I = y.isDate, R = y.isMap, F = y.isRegExp, x = y.isSet, M = y.isNativeError, Q = y.isBoxedPrimitive, C = y.isNumberObject, W = y.isStringObject, h = y.isBooleanObject, $ = y.isBigIntObject, ae = y.isSymbolObject, de = y.isFloat32Array, Ee = y.isFloat64Array;
  function _e(me) {
    if (me.length === 0 || me.length > 10) return !0;
    for (var Se = 0; Se < me.length; Se++) {
      var Le = me.charCodeAt(Se);
      if (Le < 48 || Le > 57) return !0;
    }
    return me.length === 10 && me >= Math.pow(2, 32);
  }
  function ce(me) {
    return Object.keys(me).filter(_e).concat(v(me).filter(Object.prototype.propertyIsEnumerable.bind(me)));
  }
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  function fe(me, Se) {
    if (me === Se)
      return 0;
    for (var Le = me.length, Me = Se.length, je = 0, He = Math.min(Le, Me); je < He; ++je)
      if (me[je] !== Se[je]) {
        Le = me[je], Me = Se[je];
        break;
      }
    return Le < Me ? -1 : Me < Le ? 1 : 0;
  }
  var k = !0, pe = !1, ee = 0, J = 1, G = 2, ue = 3;
  function O(me, Se) {
    return u ? me.source === Se.source && me.flags === Se.flags : RegExp.prototype.toString.call(me) === RegExp.prototype.toString.call(Se);
  }
  function B(me, Se) {
    if (me.byteLength !== Se.byteLength)
      return !1;
    for (var Le = 0; Le < me.byteLength; Le++)
      if (me[Le] !== Se[Le])
        return !1;
    return !0;
  }
  function N(me, Se) {
    return me.byteLength !== Se.byteLength ? !1 : fe(new Uint8Array(me.buffer, me.byteOffset, me.byteLength), new Uint8Array(Se.buffer, Se.byteOffset, Se.byteLength)) === 0;
  }
  function re(me, Se) {
    return me.byteLength === Se.byteLength && fe(new Uint8Array(me), new Uint8Array(Se)) === 0;
  }
  function ne(me, Se) {
    return C(me) ? C(Se) && s(Number.prototype.valueOf.call(me), Number.prototype.valueOf.call(Se)) : W(me) ? W(Se) && String.prototype.valueOf.call(me) === String.prototype.valueOf.call(Se) : h(me) ? h(Se) && Boolean.prototype.valueOf.call(me) === Boolean.prototype.valueOf.call(Se) : $(me) ? $(Se) && BigInt.prototype.valueOf.call(me) === BigInt.prototype.valueOf.call(Se) : ae(Se) && Symbol.prototype.valueOf.call(me) === Symbol.prototype.valueOf.call(Se);
  }
  function D(me, Se, Le, Me) {
    if (me === Se)
      return me !== 0 ? !0 : Le ? s(me, Se) : !0;
    if (Le) {
      if (f(me) !== "object")
        return typeof me == "number" && E(me) && E(Se);
      if (f(Se) !== "object" || me === null || Se === null || Object.getPrototypeOf(me) !== Object.getPrototypeOf(Se))
        return !1;
    } else {
      if (me === null || f(me) !== "object")
        return Se === null || f(Se) !== "object" ? me == Se : !1;
      if (Se === null || f(Se) !== "object")
        return !1;
    }
    var je = d(me), He = d(Se);
    if (je !== He)
      return !1;
    if (Array.isArray(me)) {
      if (me.length !== Se.length)
        return !1;
      var U = ce(me), a = ce(Se);
      return U.length !== a.length ? !1 : H(me, Se, Le, Me, J, U);
    }
    if (je === "[object Object]" && (!R(me) && R(Se) || !x(me) && x(Se)))
      return !1;
    if (I(me)) {
      if (!I(Se) || Date.prototype.getTime.call(me) !== Date.prototype.getTime.call(Se))
        return !1;
    } else if (F(me)) {
      if (!F(Se) || !O(me, Se))
        return !1;
    } else if (M(me) || me instanceof Error) {
      if (me.message !== Se.message || me.name !== Se.name)
        return !1;
    } else if (w(me)) {
      if (!Le && (de(me) || Ee(me))) {
        if (!B(me, Se))
          return !1;
      } else if (!N(me, Se))
        return !1;
      var m = ce(me), z = ce(Se);
      return m.length !== z.length ? !1 : H(me, Se, Le, Me, ee, m);
    } else {
      if (x(me))
        return !x(Se) || me.size !== Se.size ? !1 : H(me, Se, Le, Me, G);
      if (R(me))
        return !R(Se) || me.size !== Se.size ? !1 : H(me, Se, Le, Me, ue);
      if (A(me)) {
        if (!re(me, Se))
          return !1;
      } else if (Q(me) && !ne(me, Se))
        return !1;
    }
    return H(me, Se, Le, Me, ee);
  }
  function L(me, Se) {
    return Se.filter(function(Le) {
      return T(me, Le);
    });
  }
  function H(me, Se, Le, Me, je, He) {
    if (arguments.length === 5) {
      He = Object.keys(me);
      var U = Object.keys(Se);
      if (He.length !== U.length)
        return !1;
    }
    for (var a = 0; a < He.length; a++)
      if (!p(Se, He[a]))
        return !1;
    if (Le && arguments.length === 5) {
      var m = v(me);
      if (m.length !== 0) {
        var z = 0;
        for (a = 0; a < m.length; a++) {
          var le = m[a];
          if (T(me, le)) {
            if (!T(Se, le))
              return !1;
            He.push(le), z++;
          } else if (T(Se, le))
            return !1;
        }
        var X = v(Se);
        if (m.length !== X.length && L(Se, X).length !== z)
          return !1;
      } else {
        var he = v(Se);
        if (he.length !== 0 && L(Se, he).length !== 0)
          return !1;
      }
    }
    if (He.length === 0 && (je === ee || je === J && me.length === 0 || me.size === 0))
      return !0;
    if (Me === void 0)
      Me = {
        val1: /* @__PURE__ */ new Map(),
        val2: /* @__PURE__ */ new Map(),
        position: 0
      };
    else {
      var j = Me.val1.get(me);
      if (j !== void 0) {
        var Be = Me.val2.get(Se);
        if (Be !== void 0)
          return j === Be;
      }
      Me.position++;
    }
    Me.val1.set(me, Me.position), Me.val2.set(Se, Me.position);
    var We = Ce(me, Se, Le, He, Me, je);
    return Me.val1.delete(me), Me.val2.delete(Se), We;
  }
  function se(me, Se, Le, Me) {
    for (var je = b(me), He = 0; He < je.length; He++) {
      var U = je[He];
      if (D(Se, U, Le, Me))
        return me.delete(U), !0;
    }
    return !1;
  }
  function we(me) {
    switch (f(me)) {
      case "undefined":
        return null;
      case "object":
        return;
      case "symbol":
        return !1;
      case "string":
        me = +me;
      // Loose equal entries exist only if the string is possible to convert to
      // a regular number and not NaN.
      // Fall through
      case "number":
        if (E(me))
          return !1;
    }
    return !0;
  }
  function Re(me, Se, Le) {
    var Me = we(Le);
    return Me ?? (Se.has(Me) && !me.has(Me));
  }
  function Ae(me, Se, Le, Me, je) {
    var He = we(Le);
    if (He != null)
      return He;
    var U = Se.get(He);
    return U === void 0 && !Se.has(He) || !D(Me, U, !1, je) ? !1 : !me.has(He) && D(Me, U, !1, je);
  }
  function Oe(me, Se, Le, Me) {
    for (var je = null, He = b(me), U = 0; U < He.length; U++) {
      var a = He[U];
      if (f(a) === "object" && a !== null)
        je === null && (je = /* @__PURE__ */ new Set()), je.add(a);
      else if (!Se.has(a)) {
        if (Le || !Re(me, Se, a))
          return !1;
        je === null && (je = /* @__PURE__ */ new Set()), je.add(a);
      }
    }
    if (je !== null) {
      for (var m = b(Se), z = 0; z < m.length; z++) {
        var le = m[z];
        if (f(le) === "object" && le !== null) {
          if (!se(je, le, Le, Me)) return !1;
        } else if (!Le && !me.has(le) && !se(je, le, Le, Me))
          return !1;
      }
      return je.size === 0;
    }
    return !0;
  }
  function te(me, Se, Le, Me, je, He) {
    for (var U = b(me), a = 0; a < U.length; a++) {
      var m = U[a];
      if (D(Le, m, je, He) && D(Me, Se.get(m), je, He))
        return me.delete(m), !0;
    }
    return !1;
  }
  function Fe(me, Se, Le, Me) {
    for (var je = null, He = S(me), U = 0; U < He.length; U++) {
      var a = t(He[U], 2), m = a[0], z = a[1];
      if (f(m) === "object" && m !== null)
        je === null && (je = /* @__PURE__ */ new Set()), je.add(m);
      else {
        var le = Se.get(m);
        if (le === void 0 && !Se.has(m) || !D(z, le, Le, Me)) {
          if (Le || !Ae(me, Se, m, z, Me)) return !1;
          je === null && (je = /* @__PURE__ */ new Set()), je.add(m);
        }
      }
    }
    if (je !== null) {
      for (var X = S(Se), he = 0; he < X.length; he++) {
        var j = t(X[he], 2), Be = j[0], We = j[1];
        if (f(Be) === "object" && Be !== null) {
          if (!te(je, me, Be, We, Le, Me)) return !1;
        } else if (!Le && (!me.has(Be) || !D(me.get(Be), We, !1, Me)) && !te(je, me, Be, We, !1, Me))
          return !1;
      }
      return je.size === 0;
    }
    return !0;
  }
  function Ce(me, Se, Le, Me, je, He) {
    var U = 0;
    if (He === G) {
      if (!Oe(me, Se, Le, je))
        return !1;
    } else if (He === ue) {
      if (!Fe(me, Se, Le, je))
        return !1;
    } else if (He === J)
      for (; U < me.length; U++)
        if (p(me, U)) {
          if (!p(Se, U) || !D(me[U], Se[U], Le, je))
            return !1;
        } else {
          if (p(Se, U))
            return !1;
          for (var a = Object.keys(me); U < a.length; U++) {
            var m = a[U];
            if (!p(Se, m) || !D(me[m], Se[m], Le, je))
              return !1;
          }
          return a.length === Object.keys(Se).length;
        }
    for (U = 0; U < Me.length; U++) {
      var z = Me[U];
      if (!D(me[z], Se[z], Le, je))
        return !1;
    }
    return !0;
  }
  function qe(me, Se) {
    return D(me, Se, pe);
  }
  function Ue(me, Se) {
    return D(me, Se, k);
  }
  return comparisons = {
    isDeepEqual: qe,
    isDeepStrictEqual: Ue
  }, comparisons;
}
var hasRequiredAssert;
function requireAssert() {
  if (hasRequiredAssert) return assert.exports;
  hasRequiredAssert = 1;
  function t(G) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(ue) {
      return typeof ue;
    } : function(ue) {
      return ue && typeof Symbol == "function" && ue.constructor === Symbol && ue !== Symbol.prototype ? "symbol" : typeof ue;
    }, t(G);
  }
  function e(G, ue, O) {
    return Object.defineProperty(G, "prototype", { writable: !1 }), G;
  }
  function o(G, ue) {
    if (!(G instanceof ue))
      throw new TypeError("Cannot call a class as a function");
  }
  var l = requireErrors$1(), r = l.codes, n = r.ERR_AMBIGUOUS_ARGUMENT, f = r.ERR_INVALID_ARG_TYPE, u = r.ERR_INVALID_ARG_VALUE, b = r.ERR_INVALID_RETURN_VALUE, S = r.ERR_MISSING_ARGS, s = requireAssertion_error(), v = requireUtil$2(), E = v.inspect, q = requireUtil$2().types, p = q.isPromise, T = q.isRegExp, d = requirePolyfill$2()(), y = requirePolyfill$1()(), A = requireCallBound()("RegExp.prototype.test"), w, I;
  function R() {
    var G = requireComparisons();
    w = G.isDeepEqual, I = G.isDeepStrictEqual;
  }
  var F = !1, x = assert.exports = h, M = {};
  function Q(G) {
    throw G.message instanceof Error ? G.message : new s(G);
  }
  function C(G, ue, O, B, N) {
    var re = arguments.length, ne;
    if (re === 0)
      ne = "Failed";
    else if (re === 1)
      O = G, G = void 0;
    else {
      if (F === !1) {
        F = !0;
        var D = process$1.emitWarning ? process$1.emitWarning : console.warn.bind(console);
        D("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
      }
      re === 2 && (B = "!=");
    }
    if (O instanceof Error) throw O;
    var L = {
      actual: G,
      expected: ue,
      operator: B === void 0 ? "fail" : B,
      stackStartFn: N || C
    };
    O !== void 0 && (L.message = O);
    var H = new s(L);
    throw ne && (H.message = ne, H.generatedMessage = !0), H;
  }
  x.fail = C, x.AssertionError = s;
  function W(G, ue, O, B) {
    if (!O) {
      var N = !1;
      if (ue === 0)
        N = !0, B = "No value argument passed to `assert.ok()`";
      else if (B instanceof Error)
        throw B;
      var re = new s({
        actual: O,
        expected: !0,
        message: B,
        operator: "==",
        stackStartFn: G
      });
      throw re.generatedMessage = N, re;
    }
  }
  function h() {
    for (var G = arguments.length, ue = new Array(G), O = 0; O < G; O++)
      ue[O] = arguments[O];
    W.apply(void 0, [h, ue.length].concat(ue));
  }
  x.ok = h, x.equal = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    ue != O && Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "==",
      stackStartFn: G
    });
  }, x.notEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    ue == O && Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "!=",
      stackStartFn: G
    });
  }, x.deepEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    w === void 0 && R(), w(ue, O) || Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "deepEqual",
      stackStartFn: G
    });
  }, x.notDeepEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    w === void 0 && R(), w(ue, O) && Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "notDeepEqual",
      stackStartFn: G
    });
  }, x.deepStrictEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    w === void 0 && R(), I(ue, O) || Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "deepStrictEqual",
      stackStartFn: G
    });
  }, x.notDeepStrictEqual = $;
  function $(G, ue, O) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    w === void 0 && R(), I(G, ue) && Q({
      actual: G,
      expected: ue,
      message: O,
      operator: "notDeepStrictEqual",
      stackStartFn: $
    });
  }
  x.strictEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    y(ue, O) || Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "strictEqual",
      stackStartFn: G
    });
  }, x.notStrictEqual = function G(ue, O, B) {
    if (arguments.length < 2)
      throw new S("actual", "expected");
    y(ue, O) && Q({
      actual: ue,
      expected: O,
      message: B,
      operator: "notStrictEqual",
      stackStartFn: G
    });
  };
  var ae = /* @__PURE__ */ e(function G(ue, O, B) {
    var N = this;
    o(this, G), O.forEach(function(re) {
      re in ue && (B !== void 0 && typeof B[re] == "string" && T(ue[re]) && A(ue[re], B[re]) ? N[re] = B[re] : N[re] = ue[re]);
    });
  });
  function de(G, ue, O, B, N, re) {
    if (!(O in G) || !I(G[O], ue[O])) {
      if (!B) {
        var ne = new ae(G, N), D = new ae(ue, N, G), L = new s({
          actual: ne,
          expected: D,
          operator: "deepStrictEqual",
          stackStartFn: re
        });
        throw L.actual = G, L.expected = ue, L.operator = re.name, L;
      }
      Q({
        actual: G,
        expected: ue,
        message: B,
        operator: re.name,
        stackStartFn: re
      });
    }
  }
  function Ee(G, ue, O, B) {
    if (typeof ue != "function") {
      if (T(ue)) return A(ue, G);
      if (arguments.length === 2)
        throw new f("expected", ["Function", "RegExp"], ue);
      if (t(G) !== "object" || G === null) {
        var N = new s({
          actual: G,
          expected: ue,
          message: O,
          operator: "deepStrictEqual",
          stackStartFn: B
        });
        throw N.operator = B.name, N;
      }
      var re = Object.keys(ue);
      if (ue instanceof Error)
        re.push("name", "message");
      else if (re.length === 0)
        throw new u("error", ue, "may not be an empty object");
      return w === void 0 && R(), re.forEach(function(ne) {
        typeof G[ne] == "string" && T(ue[ne]) && A(ue[ne], G[ne]) || de(G, ue, ne, O, re, B);
      }), !0;
    }
    return ue.prototype !== void 0 && G instanceof ue ? !0 : Error.isPrototypeOf(ue) ? !1 : ue.call({}, G) === !0;
  }
  function _e(G) {
    if (typeof G != "function")
      throw new f("fn", "Function", G);
    try {
      G();
    } catch (ue) {
      return ue;
    }
    return M;
  }
  function ce(G) {
    return p(G) || G !== null && t(G) === "object" && typeof G.then == "function" && typeof G.catch == "function";
  }
  function fe(G) {
    return Promise.resolve().then(function() {
      var ue;
      if (typeof G == "function") {
        if (ue = G(), !ce(ue))
          throw new b("instance of Promise", "promiseFn", ue);
      } else if (ce(G))
        ue = G;
      else
        throw new f("promiseFn", ["Function", "Promise"], G);
      return Promise.resolve().then(function() {
        return ue;
      }).then(function() {
        return M;
      }).catch(function(O) {
        return O;
      });
    });
  }
  function k(G, ue, O, B) {
    if (typeof O == "string") {
      if (arguments.length === 4)
        throw new f("error", ["Object", "Error", "Function", "RegExp"], O);
      if (t(ue) === "object" && ue !== null) {
        if (ue.message === O)
          throw new n("error/message", 'The error message "'.concat(ue.message, '" is identical to the message.'));
      } else if (ue === O)
        throw new n("error/message", 'The error "'.concat(ue, '" is identical to the message.'));
      B = O, O = void 0;
    } else if (O != null && t(O) !== "object" && typeof O != "function")
      throw new f("error", ["Object", "Error", "Function", "RegExp"], O);
    if (ue === M) {
      var N = "";
      O && O.name && (N += " (".concat(O.name, ")")), N += B ? ": ".concat(B) : ".";
      var re = G.name === "rejects" ? "rejection" : "exception";
      Q({
        actual: void 0,
        expected: O,
        operator: G.name,
        message: "Missing expected ".concat(re).concat(N),
        stackStartFn: G
      });
    }
    if (O && !Ee(ue, O, B, G))
      throw ue;
  }
  function pe(G, ue, O, B) {
    if (ue !== M) {
      if (typeof O == "string" && (B = O, O = void 0), !O || Ee(ue, O)) {
        var N = B ? ": ".concat(B) : ".", re = G.name === "doesNotReject" ? "rejection" : "exception";
        Q({
          actual: ue,
          expected: O,
          operator: G.name,
          message: "Got unwanted ".concat(re).concat(N, `
`) + 'Actual message: "'.concat(ue && ue.message, '"'),
          stackStartFn: G
        });
      }
      throw ue;
    }
  }
  x.throws = function G(ue) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    k.apply(void 0, [G, _e(ue)].concat(B));
  }, x.rejects = function G(ue) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(ue).then(function(re) {
      return k.apply(void 0, [G, re].concat(B));
    });
  }, x.doesNotThrow = function G(ue) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    pe.apply(void 0, [G, _e(ue)].concat(B));
  }, x.doesNotReject = function G(ue) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), N = 1; N < O; N++)
      B[N - 1] = arguments[N];
    return fe(ue).then(function(re) {
      return pe.apply(void 0, [G, re].concat(B));
    });
  }, x.ifError = function G(ue) {
    if (ue != null) {
      var O = "ifError got unwanted exception: ";
      t(ue) === "object" && typeof ue.message == "string" ? ue.message.length === 0 && ue.constructor ? O += ue.constructor.name : O += ue.message : O += E(ue);
      var B = new s({
        actual: ue,
        expected: null,
        operator: "ifError",
        message: O,
        stackStartFn: G
      }), N = ue.stack;
      if (typeof N == "string") {
        var re = N.split(`
`);
        re.shift();
        for (var ne = B.stack.split(`
`), D = 0; D < re.length; D++) {
          var L = ne.indexOf(re[D]);
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
  function ee(G, ue, O, B, N) {
    if (!T(ue))
      throw new f("regexp", "RegExp", ue);
    var re = N === "match";
    if (typeof G != "string" || A(ue, G) !== re) {
      if (O instanceof Error)
        throw O;
      var ne = !O;
      O = O || (typeof G != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(t(G), " (").concat(E(G), ")") : (re ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(E(ue), `. Input:

`).concat(E(G), `
`));
      var D = new s({
        actual: G,
        expected: ue,
        message: O,
        operator: N,
        stackStartFn: B
      });
      throw D.generatedMessage = ne, D;
    }
  }
  x.match = function G(ue, O, B) {
    ee(ue, O, B, G, "match");
  }, x.doesNotMatch = function G(ue, O, B) {
    ee(ue, O, B, G, "doesNotMatch");
  };
  function J() {
    for (var G = arguments.length, ue = new Array(G), O = 0; O < G; O++)
      ue[O] = arguments[O];
    W.apply(void 0, [J, ue.length].concat(ue));
  }
  return x.strict = d(J, x, {
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
    function o(n, f) {
      return Object.prototype.hasOwnProperty.call(n, f);
    }
    t.assign = function(n) {
      for (var f = Array.prototype.slice.call(arguments, 1); f.length; ) {
        var u = f.shift();
        if (u) {
          if (typeof u != "object")
            throw new TypeError(u + "must be non-object");
          for (var b in u)
            o(u, b) && (n[b] = u[b]);
        }
      }
      return n;
    }, t.shrinkBuf = function(n, f) {
      return n.length === f ? n : n.subarray ? n.subarray(0, f) : (n.length = f, n);
    };
    var l = {
      arraySet: function(n, f, u, b, S) {
        if (f.subarray && n.subarray) {
          n.set(f.subarray(u, u + b), S);
          return;
        }
        for (var s = 0; s < b; s++)
          n[S + s] = f[u + s];
      },
      // Join array of chunks to single array.
      flattenChunks: function(n) {
        var f, u, b, S, s, v;
        for (b = 0, f = 0, u = n.length; f < u; f++)
          b += n[f].length;
        for (v = new Uint8Array(b), S = 0, f = 0, u = n.length; f < u; f++)
          s = n[f], v.set(s, S), S += s.length;
        return v;
      }
    }, r = {
      arraySet: function(n, f, u, b, S) {
        for (var s = 0; s < b; s++)
          n[S + s] = f[u + s];
      },
      // Join array of chunks to single array.
      flattenChunks: function(n) {
        return [].concat.apply([], n);
      }
    };
    t.setTyped = function(n) {
      n ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, l)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, r));
    }, t.setTyped(e);
  })(common)), common;
}
var trees = {}, hasRequiredTrees;
function requireTrees() {
  if (hasRequiredTrees) return trees;
  hasRequiredTrees = 1;
  var t = requireCommon(), e = 4, o = 0, l = 1, r = 2;
  function n(a) {
    for (var m = a.length; --m >= 0; )
      a[m] = 0;
  }
  var f = 0, u = 1, b = 2, S = 3, s = 258, v = 29, E = 256, q = E + 1 + v, p = 30, T = 19, d = 2 * q + 1, y = 15, A = 16, w = 7, I = 256, R = 16, F = 17, x = 18, M = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), Q = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), C = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], h = 512, $ = new Array((q + 2) * 2);
  n($);
  var ae = new Array(p * 2);
  n(ae);
  var de = new Array(h);
  n(de);
  var Ee = new Array(s - S + 1);
  n(Ee);
  var _e = new Array(v);
  n(_e);
  var ce = new Array(p);
  n(ce);
  function fe(a, m, z, le, X) {
    this.static_tree = a, this.extra_bits = m, this.extra_base = z, this.elems = le, this.max_length = X, this.has_stree = a && a.length;
  }
  var k, pe, ee;
  function J(a, m) {
    this.dyn_tree = a, this.max_code = 0, this.stat_desc = m;
  }
  function G(a) {
    return a < 256 ? de[a] : de[256 + (a >>> 7)];
  }
  function ue(a, m) {
    a.pending_buf[a.pending++] = m & 255, a.pending_buf[a.pending++] = m >>> 8 & 255;
  }
  function O(a, m, z) {
    a.bi_valid > A - z ? (a.bi_buf |= m << a.bi_valid & 65535, ue(a, a.bi_buf), a.bi_buf = m >> A - a.bi_valid, a.bi_valid += z - A) : (a.bi_buf |= m << a.bi_valid & 65535, a.bi_valid += z);
  }
  function B(a, m, z) {
    O(
      a,
      z[m * 2],
      z[m * 2 + 1]
      /*.Len*/
    );
  }
  function N(a, m) {
    var z = 0;
    do
      z |= a & 1, a >>>= 1, z <<= 1;
    while (--m > 0);
    return z >>> 1;
  }
  function re(a) {
    a.bi_valid === 16 ? (ue(a, a.bi_buf), a.bi_buf = 0, a.bi_valid = 0) : a.bi_valid >= 8 && (a.pending_buf[a.pending++] = a.bi_buf & 255, a.bi_buf >>= 8, a.bi_valid -= 8);
  }
  function ne(a, m) {
    var z = m.dyn_tree, le = m.max_code, X = m.stat_desc.static_tree, he = m.stat_desc.has_stree, j = m.stat_desc.extra_bits, Be = m.stat_desc.extra_base, We = m.stat_desc.max_length, _, Ie, De, V, be, $e, Ve = 0;
    for (V = 0; V <= y; V++)
      a.bl_count[V] = 0;
    for (z[a.heap[a.heap_max] * 2 + 1] = 0, _ = a.heap_max + 1; _ < d; _++)
      Ie = a.heap[_], V = z[z[Ie * 2 + 1] * 2 + 1] + 1, V > We && (V = We, Ve++), z[Ie * 2 + 1] = V, !(Ie > le) && (a.bl_count[V]++, be = 0, Ie >= Be && (be = j[Ie - Be]), $e = z[Ie * 2], a.opt_len += $e * (V + be), he && (a.static_len += $e * (X[Ie * 2 + 1] + be)));
    if (Ve !== 0) {
      do {
        for (V = We - 1; a.bl_count[V] === 0; )
          V--;
        a.bl_count[V]--, a.bl_count[V + 1] += 2, a.bl_count[We]--, Ve -= 2;
      } while (Ve > 0);
      for (V = We; V !== 0; V--)
        for (Ie = a.bl_count[V]; Ie !== 0; )
          De = a.heap[--_], !(De > le) && (z[De * 2 + 1] !== V && (a.opt_len += (V - z[De * 2 + 1]) * z[De * 2], z[De * 2 + 1] = V), Ie--);
    }
  }
  function D(a, m, z) {
    var le = new Array(y + 1), X = 0, he, j;
    for (he = 1; he <= y; he++)
      le[he] = X = X + z[he - 1] << 1;
    for (j = 0; j <= m; j++) {
      var Be = a[j * 2 + 1];
      Be !== 0 && (a[j * 2] = N(le[Be]++, Be));
    }
  }
  function L() {
    var a, m, z, le, X, he = new Array(y + 1);
    for (z = 0, le = 0; le < v - 1; le++)
      for (_e[le] = z, a = 0; a < 1 << M[le]; a++)
        Ee[z++] = le;
    for (Ee[z - 1] = le, X = 0, le = 0; le < 16; le++)
      for (ce[le] = X, a = 0; a < 1 << Q[le]; a++)
        de[X++] = le;
    for (X >>= 7; le < p; le++)
      for (ce[le] = X << 7, a = 0; a < 1 << Q[le] - 7; a++)
        de[256 + X++] = le;
    for (m = 0; m <= y; m++)
      he[m] = 0;
    for (a = 0; a <= 143; )
      $[a * 2 + 1] = 8, a++, he[8]++;
    for (; a <= 255; )
      $[a * 2 + 1] = 9, a++, he[9]++;
    for (; a <= 279; )
      $[a * 2 + 1] = 7, a++, he[7]++;
    for (; a <= 287; )
      $[a * 2 + 1] = 8, a++, he[8]++;
    for (D($, q + 1, he), a = 0; a < p; a++)
      ae[a * 2 + 1] = 5, ae[a * 2] = N(a, 5);
    k = new fe($, M, E + 1, q, y), pe = new fe(ae, Q, 0, p, y), ee = new fe(new Array(0), C, 0, T, w);
  }
  function H(a) {
    var m;
    for (m = 0; m < q; m++)
      a.dyn_ltree[m * 2] = 0;
    for (m = 0; m < p; m++)
      a.dyn_dtree[m * 2] = 0;
    for (m = 0; m < T; m++)
      a.bl_tree[m * 2] = 0;
    a.dyn_ltree[I * 2] = 1, a.opt_len = a.static_len = 0, a.last_lit = a.matches = 0;
  }
  function se(a) {
    a.bi_valid > 8 ? ue(a, a.bi_buf) : a.bi_valid > 0 && (a.pending_buf[a.pending++] = a.bi_buf), a.bi_buf = 0, a.bi_valid = 0;
  }
  function we(a, m, z, le) {
    se(a), ue(a, z), ue(a, ~z), t.arraySet(a.pending_buf, a.window, m, z, a.pending), a.pending += z;
  }
  function Re(a, m, z, le) {
    var X = m * 2, he = z * 2;
    return a[X] < a[he] || a[X] === a[he] && le[m] <= le[z];
  }
  function Ae(a, m, z) {
    for (var le = a.heap[z], X = z << 1; X <= a.heap_len && (X < a.heap_len && Re(m, a.heap[X + 1], a.heap[X], a.depth) && X++, !Re(m, le, a.heap[X], a.depth)); )
      a.heap[z] = a.heap[X], z = X, X <<= 1;
    a.heap[z] = le;
  }
  function Oe(a, m, z) {
    var le, X, he = 0, j, Be;
    if (a.last_lit !== 0)
      do
        le = a.pending_buf[a.d_buf + he * 2] << 8 | a.pending_buf[a.d_buf + he * 2 + 1], X = a.pending_buf[a.l_buf + he], he++, le === 0 ? B(a, X, m) : (j = Ee[X], B(a, j + E + 1, m), Be = M[j], Be !== 0 && (X -= _e[j], O(a, X, Be)), le--, j = G(le), B(a, j, z), Be = Q[j], Be !== 0 && (le -= ce[j], O(a, le, Be)));
      while (he < a.last_lit);
    B(a, I, m);
  }
  function te(a, m) {
    var z = m.dyn_tree, le = m.stat_desc.static_tree, X = m.stat_desc.has_stree, he = m.stat_desc.elems, j, Be, We = -1, _;
    for (a.heap_len = 0, a.heap_max = d, j = 0; j < he; j++)
      z[j * 2] !== 0 ? (a.heap[++a.heap_len] = We = j, a.depth[j] = 0) : z[j * 2 + 1] = 0;
    for (; a.heap_len < 2; )
      _ = a.heap[++a.heap_len] = We < 2 ? ++We : 0, z[_ * 2] = 1, a.depth[_] = 0, a.opt_len--, X && (a.static_len -= le[_ * 2 + 1]);
    for (m.max_code = We, j = a.heap_len >> 1; j >= 1; j--)
      Ae(a, z, j);
    _ = he;
    do
      j = a.heap[
        1
        /*SMALLEST*/
      ], a.heap[
        1
        /*SMALLEST*/
      ] = a.heap[a.heap_len--], Ae(
        a,
        z,
        1
        /*SMALLEST*/
      ), Be = a.heap[
        1
        /*SMALLEST*/
      ], a.heap[--a.heap_max] = j, a.heap[--a.heap_max] = Be, z[_ * 2] = z[j * 2] + z[Be * 2], a.depth[_] = (a.depth[j] >= a.depth[Be] ? a.depth[j] : a.depth[Be]) + 1, z[j * 2 + 1] = z[Be * 2 + 1] = _, a.heap[
        1
        /*SMALLEST*/
      ] = _++, Ae(
        a,
        z,
        1
        /*SMALLEST*/
      );
    while (a.heap_len >= 2);
    a.heap[--a.heap_max] = a.heap[
      1
      /*SMALLEST*/
    ], ne(a, m), D(z, We, a.bl_count);
  }
  function Fe(a, m, z) {
    var le, X = -1, he, j = m[1], Be = 0, We = 7, _ = 4;
    for (j === 0 && (We = 138, _ = 3), m[(z + 1) * 2 + 1] = 65535, le = 0; le <= z; le++)
      he = j, j = m[(le + 1) * 2 + 1], !(++Be < We && he === j) && (Be < _ ? a.bl_tree[he * 2] += Be : he !== 0 ? (he !== X && a.bl_tree[he * 2]++, a.bl_tree[R * 2]++) : Be <= 10 ? a.bl_tree[F * 2]++ : a.bl_tree[x * 2]++, Be = 0, X = he, j === 0 ? (We = 138, _ = 3) : he === j ? (We = 6, _ = 3) : (We = 7, _ = 4));
  }
  function Ce(a, m, z) {
    var le, X = -1, he, j = m[1], Be = 0, We = 7, _ = 4;
    for (j === 0 && (We = 138, _ = 3), le = 0; le <= z; le++)
      if (he = j, j = m[(le + 1) * 2 + 1], !(++Be < We && he === j)) {
        if (Be < _)
          do
            B(a, he, a.bl_tree);
          while (--Be !== 0);
        else he !== 0 ? (he !== X && (B(a, he, a.bl_tree), Be--), B(a, R, a.bl_tree), O(a, Be - 3, 2)) : Be <= 10 ? (B(a, F, a.bl_tree), O(a, Be - 3, 3)) : (B(a, x, a.bl_tree), O(a, Be - 11, 7));
        Be = 0, X = he, j === 0 ? (We = 138, _ = 3) : he === j ? (We = 6, _ = 3) : (We = 7, _ = 4);
      }
  }
  function qe(a) {
    var m;
    for (Fe(a, a.dyn_ltree, a.l_desc.max_code), Fe(a, a.dyn_dtree, a.d_desc.max_code), te(a, a.bl_desc), m = T - 1; m >= 3 && a.bl_tree[W[m] * 2 + 1] === 0; m--)
      ;
    return a.opt_len += 3 * (m + 1) + 5 + 5 + 4, m;
  }
  function Ue(a, m, z, le) {
    var X;
    for (O(a, m - 257, 5), O(a, z - 1, 5), O(a, le - 4, 4), X = 0; X < le; X++)
      O(a, a.bl_tree[W[X] * 2 + 1], 3);
    Ce(a, a.dyn_ltree, m - 1), Ce(a, a.dyn_dtree, z - 1);
  }
  function me(a) {
    var m = 4093624447, z;
    for (z = 0; z <= 31; z++, m >>>= 1)
      if (m & 1 && a.dyn_ltree[z * 2] !== 0)
        return o;
    if (a.dyn_ltree[18] !== 0 || a.dyn_ltree[20] !== 0 || a.dyn_ltree[26] !== 0)
      return l;
    for (z = 32; z < E; z++)
      if (a.dyn_ltree[z * 2] !== 0)
        return l;
    return o;
  }
  var Se = !1;
  function Le(a) {
    Se || (L(), Se = !0), a.l_desc = new J(a.dyn_ltree, k), a.d_desc = new J(a.dyn_dtree, pe), a.bl_desc = new J(a.bl_tree, ee), a.bi_buf = 0, a.bi_valid = 0, H(a);
  }
  function Me(a, m, z, le) {
    O(a, (f << 1) + (le ? 1 : 0), 3), we(a, m, z);
  }
  function je(a) {
    O(a, u << 1, 3), B(a, I, $), re(a);
  }
  function He(a, m, z, le) {
    var X, he, j = 0;
    a.level > 0 ? (a.strm.data_type === r && (a.strm.data_type = me(a)), te(a, a.l_desc), te(a, a.d_desc), j = qe(a), X = a.opt_len + 3 + 7 >>> 3, he = a.static_len + 3 + 7 >>> 3, he <= X && (X = he)) : X = he = z + 5, z + 4 <= X && m !== -1 ? Me(a, m, z, le) : a.strategy === e || he === X ? (O(a, (u << 1) + (le ? 1 : 0), 3), Oe(a, $, ae)) : (O(a, (b << 1) + (le ? 1 : 0), 3), Ue(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, j + 1), Oe(a, a.dyn_ltree, a.dyn_dtree)), H(a), le && se(a);
  }
  function U(a, m, z) {
    return a.pending_buf[a.d_buf + a.last_lit * 2] = m >>> 8 & 255, a.pending_buf[a.d_buf + a.last_lit * 2 + 1] = m & 255, a.pending_buf[a.l_buf + a.last_lit] = z & 255, a.last_lit++, m === 0 ? a.dyn_ltree[z * 2]++ : (a.matches++, m--, a.dyn_ltree[(Ee[z] + E + 1) * 2]++, a.dyn_dtree[G(m) * 2]++), a.last_lit === a.lit_bufsize - 1;
  }
  return trees._tr_init = Le, trees._tr_stored_block = Me, trees._tr_flush_block = He, trees._tr_tally = U, trees._tr_align = je, trees;
}
var adler32_1, hasRequiredAdler32;
function requireAdler32() {
  if (hasRequiredAdler32) return adler32_1;
  hasRequiredAdler32 = 1;
  function t(e, o, l, r) {
    for (var n = e & 65535 | 0, f = e >>> 16 & 65535 | 0, u = 0; l !== 0; ) {
      u = l > 2e3 ? 2e3 : l, l -= u;
      do
        n = n + o[r++] | 0, f = f + n | 0;
      while (--u);
      n %= 65521, f %= 65521;
    }
    return n | f << 16 | 0;
  }
  return adler32_1 = t, adler32_1;
}
var crc32_1, hasRequiredCrc32;
function requireCrc32() {
  if (hasRequiredCrc32) return crc32_1;
  hasRequiredCrc32 = 1;
  function t() {
    for (var l, r = [], n = 0; n < 256; n++) {
      l = n;
      for (var f = 0; f < 8; f++)
        l = l & 1 ? 3988292384 ^ l >>> 1 : l >>> 1;
      r[n] = l;
    }
    return r;
  }
  var e = t();
  function o(l, r, n, f) {
    var u = e, b = f + n;
    l ^= -1;
    for (var S = f; S < b; S++)
      l = l >>> 8 ^ u[(l ^ r[S]) & 255];
    return l ^ -1;
  }
  return crc32_1 = o, crc32_1;
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
  var t = requireCommon(), e = requireTrees(), o = requireAdler32(), l = requireCrc32(), r = requireMessages(), n = 0, f = 1, u = 3, b = 4, S = 5, s = 0, v = 1, E = -2, q = -3, p = -5, T = -1, d = 1, y = 2, A = 3, w = 4, I = 0, R = 2, F = 8, x = 9, M = 15, Q = 8, C = 29, W = 256, h = W + 1 + C, $ = 30, ae = 19, de = 2 * h + 1, Ee = 15, _e = 3, ce = 258, fe = ce + _e + 1, k = 32, pe = 42, ee = 69, J = 73, G = 91, ue = 103, O = 113, B = 666, N = 1, re = 2, ne = 3, D = 4, L = 3;
  function H(_, Ie) {
    return _.msg = r[Ie], Ie;
  }
  function se(_) {
    return (_ << 1) - (_ > 4 ? 9 : 0);
  }
  function we(_) {
    for (var Ie = _.length; --Ie >= 0; )
      _[Ie] = 0;
  }
  function Re(_) {
    var Ie = _.state, De = Ie.pending;
    De > _.avail_out && (De = _.avail_out), De !== 0 && (t.arraySet(_.output, Ie.pending_buf, Ie.pending_out, De, _.next_out), _.next_out += De, Ie.pending_out += De, _.total_out += De, _.avail_out -= De, Ie.pending -= De, Ie.pending === 0 && (Ie.pending_out = 0));
  }
  function Ae(_, Ie) {
    e._tr_flush_block(_, _.block_start >= 0 ? _.block_start : -1, _.strstart - _.block_start, Ie), _.block_start = _.strstart, Re(_.strm);
  }
  function Oe(_, Ie) {
    _.pending_buf[_.pending++] = Ie;
  }
  function te(_, Ie) {
    _.pending_buf[_.pending++] = Ie >>> 8 & 255, _.pending_buf[_.pending++] = Ie & 255;
  }
  function Fe(_, Ie, De, V) {
    var be = _.avail_in;
    return be > V && (be = V), be === 0 ? 0 : (_.avail_in -= be, t.arraySet(Ie, _.input, _.next_in, be, De), _.state.wrap === 1 ? _.adler = o(_.adler, Ie, be, De) : _.state.wrap === 2 && (_.adler = l(_.adler, Ie, be, De)), _.next_in += be, _.total_in += be, be);
  }
  function Ce(_, Ie) {
    var De = _.max_chain_length, V = _.strstart, be, $e, Ve = _.prev_length, Z = _.nice_match, g = _.strstart > _.w_size - fe ? _.strstart - (_.w_size - fe) : 0, c = _.window, P = _.w_mask, Y = _.prev, ye = _.strstart + ce, Te = c[V + Ve - 1], ie = c[V + Ve];
    _.prev_length >= _.good_match && (De >>= 2), Z > _.lookahead && (Z = _.lookahead);
    do
      if (be = Ie, !(c[be + Ve] !== ie || c[be + Ve - 1] !== Te || c[be] !== c[V] || c[++be] !== c[V + 1])) {
        V += 2, be++;
        do
          ;
        while (c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && c[++V] === c[++be] && V < ye);
        if ($e = ce - (ye - V), V = ye - ce, $e > Ve) {
          if (_.match_start = Ie, Ve = $e, $e >= Z)
            break;
          Te = c[V + Ve - 1], ie = c[V + Ve];
        }
      }
    while ((Ie = Y[Ie & P]) > g && --De !== 0);
    return Ve <= _.lookahead ? Ve : _.lookahead;
  }
  function qe(_) {
    var Ie = _.w_size, De, V, be, $e, Ve;
    do {
      if ($e = _.window_size - _.lookahead - _.strstart, _.strstart >= Ie + (Ie - fe)) {
        t.arraySet(_.window, _.window, Ie, Ie, 0), _.match_start -= Ie, _.strstart -= Ie, _.block_start -= Ie, V = _.hash_size, De = V;
        do
          be = _.head[--De], _.head[De] = be >= Ie ? be - Ie : 0;
        while (--V);
        V = Ie, De = V;
        do
          be = _.prev[--De], _.prev[De] = be >= Ie ? be - Ie : 0;
        while (--V);
        $e += Ie;
      }
      if (_.strm.avail_in === 0)
        break;
      if (V = Fe(_.strm, _.window, _.strstart + _.lookahead, $e), _.lookahead += V, _.lookahead + _.insert >= _e)
        for (Ve = _.strstart - _.insert, _.ins_h = _.window[Ve], _.ins_h = (_.ins_h << _.hash_shift ^ _.window[Ve + 1]) & _.hash_mask; _.insert && (_.ins_h = (_.ins_h << _.hash_shift ^ _.window[Ve + _e - 1]) & _.hash_mask, _.prev[Ve & _.w_mask] = _.head[_.ins_h], _.head[_.ins_h] = Ve, Ve++, _.insert--, !(_.lookahead + _.insert < _e)); )
          ;
    } while (_.lookahead < fe && _.strm.avail_in !== 0);
  }
  function Ue(_, Ie) {
    var De = 65535;
    for (De > _.pending_buf_size - 5 && (De = _.pending_buf_size - 5); ; ) {
      if (_.lookahead <= 1) {
        if (qe(_), _.lookahead === 0 && Ie === n)
          return N;
        if (_.lookahead === 0)
          break;
      }
      _.strstart += _.lookahead, _.lookahead = 0;
      var V = _.block_start + De;
      if ((_.strstart === 0 || _.strstart >= V) && (_.lookahead = _.strstart - V, _.strstart = V, Ae(_, !1), _.strm.avail_out === 0) || _.strstart - _.block_start >= _.w_size - fe && (Ae(_, !1), _.strm.avail_out === 0))
        return N;
    }
    return _.insert = 0, Ie === b ? (Ae(_, !0), _.strm.avail_out === 0 ? ne : D) : (_.strstart > _.block_start && (Ae(_, !1), _.strm.avail_out === 0), N);
  }
  function me(_, Ie) {
    for (var De, V; ; ) {
      if (_.lookahead < fe) {
        if (qe(_), _.lookahead < fe && Ie === n)
          return N;
        if (_.lookahead === 0)
          break;
      }
      if (De = 0, _.lookahead >= _e && (_.ins_h = (_.ins_h << _.hash_shift ^ _.window[_.strstart + _e - 1]) & _.hash_mask, De = _.prev[_.strstart & _.w_mask] = _.head[_.ins_h], _.head[_.ins_h] = _.strstart), De !== 0 && _.strstart - De <= _.w_size - fe && (_.match_length = Ce(_, De)), _.match_length >= _e)
        if (V = e._tr_tally(_, _.strstart - _.match_start, _.match_length - _e), _.lookahead -= _.match_length, _.match_length <= _.max_lazy_match && _.lookahead >= _e) {
          _.match_length--;
          do
            _.strstart++, _.ins_h = (_.ins_h << _.hash_shift ^ _.window[_.strstart + _e - 1]) & _.hash_mask, De = _.prev[_.strstart & _.w_mask] = _.head[_.ins_h], _.head[_.ins_h] = _.strstart;
          while (--_.match_length !== 0);
          _.strstart++;
        } else
          _.strstart += _.match_length, _.match_length = 0, _.ins_h = _.window[_.strstart], _.ins_h = (_.ins_h << _.hash_shift ^ _.window[_.strstart + 1]) & _.hash_mask;
      else
        V = e._tr_tally(_, 0, _.window[_.strstart]), _.lookahead--, _.strstart++;
      if (V && (Ae(_, !1), _.strm.avail_out === 0))
        return N;
    }
    return _.insert = _.strstart < _e - 1 ? _.strstart : _e - 1, Ie === b ? (Ae(_, !0), _.strm.avail_out === 0 ? ne : D) : _.last_lit && (Ae(_, !1), _.strm.avail_out === 0) ? N : re;
  }
  function Se(_, Ie) {
    for (var De, V, be; ; ) {
      if (_.lookahead < fe) {
        if (qe(_), _.lookahead < fe && Ie === n)
          return N;
        if (_.lookahead === 0)
          break;
      }
      if (De = 0, _.lookahead >= _e && (_.ins_h = (_.ins_h << _.hash_shift ^ _.window[_.strstart + _e - 1]) & _.hash_mask, De = _.prev[_.strstart & _.w_mask] = _.head[_.ins_h], _.head[_.ins_h] = _.strstart), _.prev_length = _.match_length, _.prev_match = _.match_start, _.match_length = _e - 1, De !== 0 && _.prev_length < _.max_lazy_match && _.strstart - De <= _.w_size - fe && (_.match_length = Ce(_, De), _.match_length <= 5 && (_.strategy === d || _.match_length === _e && _.strstart - _.match_start > 4096) && (_.match_length = _e - 1)), _.prev_length >= _e && _.match_length <= _.prev_length) {
        be = _.strstart + _.lookahead - _e, V = e._tr_tally(_, _.strstart - 1 - _.prev_match, _.prev_length - _e), _.lookahead -= _.prev_length - 1, _.prev_length -= 2;
        do
          ++_.strstart <= be && (_.ins_h = (_.ins_h << _.hash_shift ^ _.window[_.strstart + _e - 1]) & _.hash_mask, De = _.prev[_.strstart & _.w_mask] = _.head[_.ins_h], _.head[_.ins_h] = _.strstart);
        while (--_.prev_length !== 0);
        if (_.match_available = 0, _.match_length = _e - 1, _.strstart++, V && (Ae(_, !1), _.strm.avail_out === 0))
          return N;
      } else if (_.match_available) {
        if (V = e._tr_tally(_, 0, _.window[_.strstart - 1]), V && Ae(_, !1), _.strstart++, _.lookahead--, _.strm.avail_out === 0)
          return N;
      } else
        _.match_available = 1, _.strstart++, _.lookahead--;
    }
    return _.match_available && (V = e._tr_tally(_, 0, _.window[_.strstart - 1]), _.match_available = 0), _.insert = _.strstart < _e - 1 ? _.strstart : _e - 1, Ie === b ? (Ae(_, !0), _.strm.avail_out === 0 ? ne : D) : _.last_lit && (Ae(_, !1), _.strm.avail_out === 0) ? N : re;
  }
  function Le(_, Ie) {
    for (var De, V, be, $e, Ve = _.window; ; ) {
      if (_.lookahead <= ce) {
        if (qe(_), _.lookahead <= ce && Ie === n)
          return N;
        if (_.lookahead === 0)
          break;
      }
      if (_.match_length = 0, _.lookahead >= _e && _.strstart > 0 && (be = _.strstart - 1, V = Ve[be], V === Ve[++be] && V === Ve[++be] && V === Ve[++be])) {
        $e = _.strstart + ce;
        do
          ;
        while (V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && V === Ve[++be] && be < $e);
        _.match_length = ce - ($e - be), _.match_length > _.lookahead && (_.match_length = _.lookahead);
      }
      if (_.match_length >= _e ? (De = e._tr_tally(_, 1, _.match_length - _e), _.lookahead -= _.match_length, _.strstart += _.match_length, _.match_length = 0) : (De = e._tr_tally(_, 0, _.window[_.strstart]), _.lookahead--, _.strstart++), De && (Ae(_, !1), _.strm.avail_out === 0))
        return N;
    }
    return _.insert = 0, Ie === b ? (Ae(_, !0), _.strm.avail_out === 0 ? ne : D) : _.last_lit && (Ae(_, !1), _.strm.avail_out === 0) ? N : re;
  }
  function Me(_, Ie) {
    for (var De; ; ) {
      if (_.lookahead === 0 && (qe(_), _.lookahead === 0)) {
        if (Ie === n)
          return N;
        break;
      }
      if (_.match_length = 0, De = e._tr_tally(_, 0, _.window[_.strstart]), _.lookahead--, _.strstart++, De && (Ae(_, !1), _.strm.avail_out === 0))
        return N;
    }
    return _.insert = 0, Ie === b ? (Ae(_, !0), _.strm.avail_out === 0 ? ne : D) : _.last_lit && (Ae(_, !1), _.strm.avail_out === 0) ? N : re;
  }
  function je(_, Ie, De, V, be) {
    this.good_length = _, this.max_lazy = Ie, this.nice_length = De, this.max_chain = V, this.func = be;
  }
  var He;
  He = [
    /*      good lazy nice chain */
    new je(0, 0, 0, 0, Ue),
    /* 0 store only */
    new je(4, 4, 8, 4, me),
    /* 1 max speed, no lazy matches */
    new je(4, 5, 16, 8, me),
    /* 2 */
    new je(4, 6, 32, 32, me),
    /* 3 */
    new je(4, 4, 16, 16, Se),
    /* 4 lazy matches */
    new je(8, 16, 32, 32, Se),
    /* 5 */
    new je(8, 16, 128, 128, Se),
    /* 6 */
    new je(8, 32, 128, 256, Se),
    /* 7 */
    new je(32, 128, 258, 1024, Se),
    /* 8 */
    new je(32, 258, 258, 4096, Se)
    /* 9 max compression */
  ];
  function U(_) {
    _.window_size = 2 * _.w_size, we(_.head), _.max_lazy_match = He[_.level].max_lazy, _.good_match = He[_.level].good_length, _.nice_match = He[_.level].nice_length, _.max_chain_length = He[_.level].max_chain, _.strstart = 0, _.block_start = 0, _.lookahead = 0, _.insert = 0, _.match_length = _.prev_length = _e - 1, _.match_available = 0, _.ins_h = 0;
  }
  function a() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = F, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new t.Buf16(de * 2), this.dyn_dtree = new t.Buf16((2 * $ + 1) * 2), this.bl_tree = new t.Buf16((2 * ae + 1) * 2), we(this.dyn_ltree), we(this.dyn_dtree), we(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new t.Buf16(Ee + 1), this.heap = new t.Buf16(2 * h + 1), we(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new t.Buf16(2 * h + 1), we(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function m(_) {
    var Ie;
    return !_ || !_.state ? H(_, E) : (_.total_in = _.total_out = 0, _.data_type = R, Ie = _.state, Ie.pending = 0, Ie.pending_out = 0, Ie.wrap < 0 && (Ie.wrap = -Ie.wrap), Ie.status = Ie.wrap ? pe : O, _.adler = Ie.wrap === 2 ? 0 : 1, Ie.last_flush = n, e._tr_init(Ie), s);
  }
  function z(_) {
    var Ie = m(_);
    return Ie === s && U(_.state), Ie;
  }
  function le(_, Ie) {
    return !_ || !_.state || _.state.wrap !== 2 ? E : (_.state.gzhead = Ie, s);
  }
  function X(_, Ie, De, V, be, $e) {
    if (!_)
      return E;
    var Ve = 1;
    if (Ie === T && (Ie = 6), V < 0 ? (Ve = 0, V = -V) : V > 15 && (Ve = 2, V -= 16), be < 1 || be > x || De !== F || V < 8 || V > 15 || Ie < 0 || Ie > 9 || $e < 0 || $e > w)
      return H(_, E);
    V === 8 && (V = 9);
    var Z = new a();
    return _.state = Z, Z.strm = _, Z.wrap = Ve, Z.gzhead = null, Z.w_bits = V, Z.w_size = 1 << Z.w_bits, Z.w_mask = Z.w_size - 1, Z.hash_bits = be + 7, Z.hash_size = 1 << Z.hash_bits, Z.hash_mask = Z.hash_size - 1, Z.hash_shift = ~~((Z.hash_bits + _e - 1) / _e), Z.window = new t.Buf8(Z.w_size * 2), Z.head = new t.Buf16(Z.hash_size), Z.prev = new t.Buf16(Z.w_size), Z.lit_bufsize = 1 << be + 6, Z.pending_buf_size = Z.lit_bufsize * 4, Z.pending_buf = new t.Buf8(Z.pending_buf_size), Z.d_buf = 1 * Z.lit_bufsize, Z.l_buf = 3 * Z.lit_bufsize, Z.level = Ie, Z.strategy = $e, Z.method = De, z(_);
  }
  function he(_, Ie) {
    return X(_, Ie, F, M, Q, I);
  }
  function j(_, Ie) {
    var De, V, be, $e;
    if (!_ || !_.state || Ie > S || Ie < 0)
      return _ ? H(_, E) : E;
    if (V = _.state, !_.output || !_.input && _.avail_in !== 0 || V.status === B && Ie !== b)
      return H(_, _.avail_out === 0 ? p : E);
    if (V.strm = _, De = V.last_flush, V.last_flush = Ie, V.status === pe)
      if (V.wrap === 2)
        _.adler = 0, Oe(V, 31), Oe(V, 139), Oe(V, 8), V.gzhead ? (Oe(
          V,
          (V.gzhead.text ? 1 : 0) + (V.gzhead.hcrc ? 2 : 0) + (V.gzhead.extra ? 4 : 0) + (V.gzhead.name ? 8 : 0) + (V.gzhead.comment ? 16 : 0)
        ), Oe(V, V.gzhead.time & 255), Oe(V, V.gzhead.time >> 8 & 255), Oe(V, V.gzhead.time >> 16 & 255), Oe(V, V.gzhead.time >> 24 & 255), Oe(V, V.level === 9 ? 2 : V.strategy >= y || V.level < 2 ? 4 : 0), Oe(V, V.gzhead.os & 255), V.gzhead.extra && V.gzhead.extra.length && (Oe(V, V.gzhead.extra.length & 255), Oe(V, V.gzhead.extra.length >> 8 & 255)), V.gzhead.hcrc && (_.adler = l(_.adler, V.pending_buf, V.pending, 0)), V.gzindex = 0, V.status = ee) : (Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, V.level === 9 ? 2 : V.strategy >= y || V.level < 2 ? 4 : 0), Oe(V, L), V.status = O);
      else {
        var Ve = F + (V.w_bits - 8 << 4) << 8, Z = -1;
        V.strategy >= y || V.level < 2 ? Z = 0 : V.level < 6 ? Z = 1 : V.level === 6 ? Z = 2 : Z = 3, Ve |= Z << 6, V.strstart !== 0 && (Ve |= k), Ve += 31 - Ve % 31, V.status = O, te(V, Ve), V.strstart !== 0 && (te(V, _.adler >>> 16), te(V, _.adler & 65535)), _.adler = 1;
      }
    if (V.status === ee)
      if (V.gzhead.extra) {
        for (be = V.pending; V.gzindex < (V.gzhead.extra.length & 65535) && !(V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), Re(_), be = V.pending, V.pending === V.pending_buf_size)); )
          Oe(V, V.gzhead.extra[V.gzindex] & 255), V.gzindex++;
        V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), V.gzindex === V.gzhead.extra.length && (V.gzindex = 0, V.status = J);
      } else
        V.status = J;
    if (V.status === J)
      if (V.gzhead.name) {
        be = V.pending;
        do {
          if (V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), Re(_), be = V.pending, V.pending === V.pending_buf_size)) {
            $e = 1;
            break;
          }
          V.gzindex < V.gzhead.name.length ? $e = V.gzhead.name.charCodeAt(V.gzindex++) & 255 : $e = 0, Oe(V, $e);
        } while ($e !== 0);
        V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), $e === 0 && (V.gzindex = 0, V.status = G);
      } else
        V.status = G;
    if (V.status === G)
      if (V.gzhead.comment) {
        be = V.pending;
        do {
          if (V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), Re(_), be = V.pending, V.pending === V.pending_buf_size)) {
            $e = 1;
            break;
          }
          V.gzindex < V.gzhead.comment.length ? $e = V.gzhead.comment.charCodeAt(V.gzindex++) & 255 : $e = 0, Oe(V, $e);
        } while ($e !== 0);
        V.gzhead.hcrc && V.pending > be && (_.adler = l(_.adler, V.pending_buf, V.pending - be, be)), $e === 0 && (V.status = ue);
      } else
        V.status = ue;
    if (V.status === ue && (V.gzhead.hcrc ? (V.pending + 2 > V.pending_buf_size && Re(_), V.pending + 2 <= V.pending_buf_size && (Oe(V, _.adler & 255), Oe(V, _.adler >> 8 & 255), _.adler = 0, V.status = O)) : V.status = O), V.pending !== 0) {
      if (Re(_), _.avail_out === 0)
        return V.last_flush = -1, s;
    } else if (_.avail_in === 0 && se(Ie) <= se(De) && Ie !== b)
      return H(_, p);
    if (V.status === B && _.avail_in !== 0)
      return H(_, p);
    if (_.avail_in !== 0 || V.lookahead !== 0 || Ie !== n && V.status !== B) {
      var g = V.strategy === y ? Me(V, Ie) : V.strategy === A ? Le(V, Ie) : He[V.level].func(V, Ie);
      if ((g === ne || g === D) && (V.status = B), g === N || g === ne)
        return _.avail_out === 0 && (V.last_flush = -1), s;
      if (g === re && (Ie === f ? e._tr_align(V) : Ie !== S && (e._tr_stored_block(V, 0, 0, !1), Ie === u && (we(V.head), V.lookahead === 0 && (V.strstart = 0, V.block_start = 0, V.insert = 0))), Re(_), _.avail_out === 0))
        return V.last_flush = -1, s;
    }
    return Ie !== b ? s : V.wrap <= 0 ? v : (V.wrap === 2 ? (Oe(V, _.adler & 255), Oe(V, _.adler >> 8 & 255), Oe(V, _.adler >> 16 & 255), Oe(V, _.adler >> 24 & 255), Oe(V, _.total_in & 255), Oe(V, _.total_in >> 8 & 255), Oe(V, _.total_in >> 16 & 255), Oe(V, _.total_in >> 24 & 255)) : (te(V, _.adler >>> 16), te(V, _.adler & 65535)), Re(_), V.wrap > 0 && (V.wrap = -V.wrap), V.pending !== 0 ? s : v);
  }
  function Be(_) {
    var Ie;
    return !_ || !_.state ? E : (Ie = _.state.status, Ie !== pe && Ie !== ee && Ie !== J && Ie !== G && Ie !== ue && Ie !== O && Ie !== B ? H(_, E) : (_.state = null, Ie === O ? H(_, q) : s));
  }
  function We(_, Ie) {
    var De = Ie.length, V, be, $e, Ve, Z, g, c, P;
    if (!_ || !_.state || (V = _.state, Ve = V.wrap, Ve === 2 || Ve === 1 && V.status !== pe || V.lookahead))
      return E;
    for (Ve === 1 && (_.adler = o(_.adler, Ie, De, 0)), V.wrap = 0, De >= V.w_size && (Ve === 0 && (we(V.head), V.strstart = 0, V.block_start = 0, V.insert = 0), P = new t.Buf8(V.w_size), t.arraySet(P, Ie, De - V.w_size, V.w_size, 0), Ie = P, De = V.w_size), Z = _.avail_in, g = _.next_in, c = _.input, _.avail_in = De, _.next_in = 0, _.input = Ie, qe(V); V.lookahead >= _e; ) {
      be = V.strstart, $e = V.lookahead - (_e - 1);
      do
        V.ins_h = (V.ins_h << V.hash_shift ^ V.window[be + _e - 1]) & V.hash_mask, V.prev[be & V.w_mask] = V.head[V.ins_h], V.head[V.ins_h] = be, be++;
      while (--$e);
      V.strstart = be, V.lookahead = _e - 1, qe(V);
    }
    return V.strstart += V.lookahead, V.block_start = V.strstart, V.insert = V.lookahead, V.lookahead = 0, V.match_length = V.prev_length = _e - 1, V.match_available = 0, _.next_in = g, _.input = c, _.avail_in = Z, V.wrap = Ve, s;
  }
  return deflate.deflateInit = he, deflate.deflateInit2 = X, deflate.deflateReset = z, deflate.deflateResetKeep = m, deflate.deflateSetHeader = le, deflate.deflate = j, deflate.deflateEnd = Be, deflate.deflateSetDictionary = We, deflate.deflateInfo = "pako deflate (from Nodeca project)", deflate;
}
var inflate = {}, inffast, hasRequiredInffast;
function requireInffast() {
  if (hasRequiredInffast) return inffast;
  hasRequiredInffast = 1;
  var t = 30, e = 12;
  return inffast = function(l, r) {
    var n, f, u, b, S, s, v, E, q, p, T, d, y, A, w, I, R, F, x, M, Q, C, W, h, $;
    n = l.state, f = l.next_in, h = l.input, u = f + (l.avail_in - 5), b = l.next_out, $ = l.output, S = b - (r - l.avail_out), s = b + (l.avail_out - 257), v = n.dmax, E = n.wsize, q = n.whave, p = n.wnext, T = n.window, d = n.hold, y = n.bits, A = n.lencode, w = n.distcode, I = (1 << n.lenbits) - 1, R = (1 << n.distbits) - 1;
    e:
      do {
        y < 15 && (d += h[f++] << y, y += 8, d += h[f++] << y, y += 8), F = A[d & I];
        r:
          for (; ; ) {
            if (x = F >>> 24, d >>>= x, y -= x, x = F >>> 16 & 255, x === 0)
              $[b++] = F & 65535;
            else if (x & 16) {
              M = F & 65535, x &= 15, x && (y < x && (d += h[f++] << y, y += 8), M += d & (1 << x) - 1, d >>>= x, y -= x), y < 15 && (d += h[f++] << y, y += 8, d += h[f++] << y, y += 8), F = w[d & R];
              t:
                for (; ; ) {
                  if (x = F >>> 24, d >>>= x, y -= x, x = F >>> 16 & 255, x & 16) {
                    if (Q = F & 65535, x &= 15, y < x && (d += h[f++] << y, y += 8, y < x && (d += h[f++] << y, y += 8)), Q += d & (1 << x) - 1, Q > v) {
                      l.msg = "invalid distance too far back", n.mode = t;
                      break e;
                    }
                    if (d >>>= x, y -= x, x = b - S, Q > x) {
                      if (x = Q - x, x > q && n.sane) {
                        l.msg = "invalid distance too far back", n.mode = t;
                        break e;
                      }
                      if (C = 0, W = T, p === 0) {
                        if (C += E - x, x < M) {
                          M -= x;
                          do
                            $[b++] = T[C++];
                          while (--x);
                          C = b - Q, W = $;
                        }
                      } else if (p < x) {
                        if (C += E + p - x, x -= p, x < M) {
                          M -= x;
                          do
                            $[b++] = T[C++];
                          while (--x);
                          if (C = 0, p < M) {
                            x = p, M -= x;
                            do
                              $[b++] = T[C++];
                            while (--x);
                            C = b - Q, W = $;
                          }
                        }
                      } else if (C += p - x, x < M) {
                        M -= x;
                        do
                          $[b++] = T[C++];
                        while (--x);
                        C = b - Q, W = $;
                      }
                      for (; M > 2; )
                        $[b++] = W[C++], $[b++] = W[C++], $[b++] = W[C++], M -= 3;
                      M && ($[b++] = W[C++], M > 1 && ($[b++] = W[C++]));
                    } else {
                      C = b - Q;
                      do
                        $[b++] = $[C++], $[b++] = $[C++], $[b++] = $[C++], M -= 3;
                      while (M > 2);
                      M && ($[b++] = $[C++], M > 1 && ($[b++] = $[C++]));
                    }
                  } else if ((x & 64) === 0) {
                    F = w[(F & 65535) + (d & (1 << x) - 1)];
                    continue t;
                  } else {
                    l.msg = "invalid distance code", n.mode = t;
                    break e;
                  }
                  break;
                }
            } else if ((x & 64) === 0) {
              F = A[(F & 65535) + (d & (1 << x) - 1)];
              continue r;
            } else if (x & 32) {
              n.mode = e;
              break e;
            } else {
              l.msg = "invalid literal/length code", n.mode = t;
              break e;
            }
            break;
          }
      } while (f < u && b < s);
    M = y >> 3, f -= M, y -= M << 3, d &= (1 << y) - 1, l.next_in = f, l.next_out = b, l.avail_in = f < u ? 5 + (u - f) : 5 - (f - u), l.avail_out = b < s ? 257 + (s - b) : 257 - (b - s), n.hold = d, n.bits = y;
  }, inffast;
}
var inftrees, hasRequiredInftrees;
function requireInftrees() {
  if (hasRequiredInftrees) return inftrees;
  hasRequiredInftrees = 1;
  var t = requireCommon(), e = 15, o = 852, l = 592, r = 0, n = 1, f = 2, u = [
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
  ], b = [
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
  ], S = [
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
  ], s = [
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
  return inftrees = function(E, q, p, T, d, y, A, w) {
    var I = w.bits, R = 0, F = 0, x = 0, M = 0, Q = 0, C = 0, W = 0, h = 0, $ = 0, ae = 0, de, Ee, _e, ce, fe, k = null, pe = 0, ee, J = new t.Buf16(e + 1), G = new t.Buf16(e + 1), ue = null, O = 0, B, N, re;
    for (R = 0; R <= e; R++)
      J[R] = 0;
    for (F = 0; F < T; F++)
      J[q[p + F]]++;
    for (Q = I, M = e; M >= 1 && J[M] === 0; M--)
      ;
    if (Q > M && (Q = M), M === 0)
      return d[y++] = 1 << 24 | 64 << 16 | 0, d[y++] = 1 << 24 | 64 << 16 | 0, w.bits = 1, 0;
    for (x = 1; x < M && J[x] === 0; x++)
      ;
    for (Q < x && (Q = x), h = 1, R = 1; R <= e; R++)
      if (h <<= 1, h -= J[R], h < 0)
        return -1;
    if (h > 0 && (E === r || M !== 1))
      return -1;
    for (G[1] = 0, R = 1; R < e; R++)
      G[R + 1] = G[R] + J[R];
    for (F = 0; F < T; F++)
      q[p + F] !== 0 && (A[G[q[p + F]]++] = F);
    if (E === r ? (k = ue = A, ee = 19) : E === n ? (k = u, pe -= 257, ue = b, O -= 257, ee = 256) : (k = S, ue = s, ee = -1), ae = 0, F = 0, R = x, fe = y, C = Q, W = 0, _e = -1, $ = 1 << Q, ce = $ - 1, E === n && $ > o || E === f && $ > l)
      return 1;
    for (; ; ) {
      B = R - W, A[F] < ee ? (N = 0, re = A[F]) : A[F] > ee ? (N = ue[O + A[F]], re = k[pe + A[F]]) : (N = 96, re = 0), de = 1 << R - W, Ee = 1 << C, x = Ee;
      do
        Ee -= de, d[fe + (ae >> W) + Ee] = B << 24 | N << 16 | re | 0;
      while (Ee !== 0);
      for (de = 1 << R - 1; ae & de; )
        de >>= 1;
      if (de !== 0 ? (ae &= de - 1, ae += de) : ae = 0, F++, --J[R] === 0) {
        if (R === M)
          break;
        R = q[p + A[F]];
      }
      if (R > Q && (ae & ce) !== _e) {
        for (W === 0 && (W = Q), fe += x, C = R - W, h = 1 << C; C + W < M && (h -= J[C + W], !(h <= 0)); )
          C++, h <<= 1;
        if ($ += 1 << C, E === n && $ > o || E === f && $ > l)
          return 1;
        _e = ae & ce, d[_e] = Q << 24 | C << 16 | fe - y | 0;
      }
    }
    return ae !== 0 && (d[fe + ae] = R - W << 24 | 64 << 16 | 0), w.bits = Q, 0;
  }, inftrees;
}
var hasRequiredInflate;
function requireInflate() {
  if (hasRequiredInflate) return inflate;
  hasRequiredInflate = 1;
  var t = requireCommon(), e = requireAdler32(), o = requireCrc32(), l = requireInffast(), r = requireInftrees(), n = 0, f = 1, u = 2, b = 4, S = 5, s = 6, v = 0, E = 1, q = 2, p = -2, T = -3, d = -4, y = -5, A = 8, w = 1, I = 2, R = 3, F = 4, x = 5, M = 6, Q = 7, C = 8, W = 9, h = 10, $ = 11, ae = 12, de = 13, Ee = 14, _e = 15, ce = 16, fe = 17, k = 18, pe = 19, ee = 20, J = 21, G = 22, ue = 23, O = 24, B = 25, N = 26, re = 27, ne = 28, D = 29, L = 30, H = 31, se = 32, we = 852, Re = 592, Ae = 15, Oe = Ae;
  function te(X) {
    return (X >>> 24 & 255) + (X >>> 8 & 65280) + ((X & 65280) << 8) + ((X & 255) << 24);
  }
  function Fe() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new t.Buf16(320), this.work = new t.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function Ce(X) {
    var he;
    return !X || !X.state ? p : (he = X.state, X.total_in = X.total_out = he.total = 0, X.msg = "", he.wrap && (X.adler = he.wrap & 1), he.mode = w, he.last = 0, he.havedict = 0, he.dmax = 32768, he.head = null, he.hold = 0, he.bits = 0, he.lencode = he.lendyn = new t.Buf32(we), he.distcode = he.distdyn = new t.Buf32(Re), he.sane = 1, he.back = -1, v);
  }
  function qe(X) {
    var he;
    return !X || !X.state ? p : (he = X.state, he.wsize = 0, he.whave = 0, he.wnext = 0, Ce(X));
  }
  function Ue(X, he) {
    var j, Be;
    return !X || !X.state || (Be = X.state, he < 0 ? (j = 0, he = -he) : (j = (he >> 4) + 1, he < 48 && (he &= 15)), he && (he < 8 || he > 15)) ? p : (Be.window !== null && Be.wbits !== he && (Be.window = null), Be.wrap = j, Be.wbits = he, qe(X));
  }
  function me(X, he) {
    var j, Be;
    return X ? (Be = new Fe(), X.state = Be, Be.window = null, j = Ue(X, he), j !== v && (X.state = null), j) : p;
  }
  function Se(X) {
    return me(X, Oe);
  }
  var Le = !0, Me, je;
  function He(X) {
    if (Le) {
      var he;
      for (Me = new t.Buf32(512), je = new t.Buf32(32), he = 0; he < 144; )
        X.lens[he++] = 8;
      for (; he < 256; )
        X.lens[he++] = 9;
      for (; he < 280; )
        X.lens[he++] = 7;
      for (; he < 288; )
        X.lens[he++] = 8;
      for (r(f, X.lens, 0, 288, Me, 0, X.work, { bits: 9 }), he = 0; he < 32; )
        X.lens[he++] = 5;
      r(u, X.lens, 0, 32, je, 0, X.work, { bits: 5 }), Le = !1;
    }
    X.lencode = Me, X.lenbits = 9, X.distcode = je, X.distbits = 5;
  }
  function U(X, he, j, Be) {
    var We, _ = X.state;
    return _.window === null && (_.wsize = 1 << _.wbits, _.wnext = 0, _.whave = 0, _.window = new t.Buf8(_.wsize)), Be >= _.wsize ? (t.arraySet(_.window, he, j - _.wsize, _.wsize, 0), _.wnext = 0, _.whave = _.wsize) : (We = _.wsize - _.wnext, We > Be && (We = Be), t.arraySet(_.window, he, j - Be, We, _.wnext), Be -= We, Be ? (t.arraySet(_.window, he, j - Be, Be, 0), _.wnext = Be, _.whave = _.wsize) : (_.wnext += We, _.wnext === _.wsize && (_.wnext = 0), _.whave < _.wsize && (_.whave += We))), 0;
  }
  function a(X, he) {
    var j, Be, We, _, Ie, De, V, be, $e, Ve, Z, g, c, P, Y = 0, ye, Te, ie, oe, ve, xe, Pe, ke, Ge = new t.Buf8(4), Qe, Ye, nr = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!X || !X.state || !X.output || !X.input && X.avail_in !== 0)
      return p;
    j = X.state, j.mode === ae && (j.mode = de), Ie = X.next_out, We = X.output, V = X.avail_out, _ = X.next_in, Be = X.input, De = X.avail_in, be = j.hold, $e = j.bits, Ve = De, Z = V, ke = v;
    e:
      for (; ; )
        switch (j.mode) {
          case w:
            if (j.wrap === 0) {
              j.mode = de;
              break;
            }
            for (; $e < 16; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if (j.wrap & 2 && be === 35615) {
              j.check = 0, Ge[0] = be & 255, Ge[1] = be >>> 8 & 255, j.check = o(j.check, Ge, 2, 0), be = 0, $e = 0, j.mode = I;
              break;
            }
            if (j.flags = 0, j.head && (j.head.done = !1), !(j.wrap & 1) || /* check if zlib header allowed */
            (((be & 255) << 8) + (be >> 8)) % 31) {
              X.msg = "incorrect header check", j.mode = L;
              break;
            }
            if ((be & 15) !== A) {
              X.msg = "unknown compression method", j.mode = L;
              break;
            }
            if (be >>>= 4, $e -= 4, Pe = (be & 15) + 8, j.wbits === 0)
              j.wbits = Pe;
            else if (Pe > j.wbits) {
              X.msg = "invalid window size", j.mode = L;
              break;
            }
            j.dmax = 1 << Pe, X.adler = j.check = 1, j.mode = be & 512 ? h : ae, be = 0, $e = 0;
            break;
          case I:
            for (; $e < 16; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if (j.flags = be, (j.flags & 255) !== A) {
              X.msg = "unknown compression method", j.mode = L;
              break;
            }
            if (j.flags & 57344) {
              X.msg = "unknown header flags set", j.mode = L;
              break;
            }
            j.head && (j.head.text = be >> 8 & 1), j.flags & 512 && (Ge[0] = be & 255, Ge[1] = be >>> 8 & 255, j.check = o(j.check, Ge, 2, 0)), be = 0, $e = 0, j.mode = R;
          /* falls through */
          case R:
            for (; $e < 32; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            j.head && (j.head.time = be), j.flags & 512 && (Ge[0] = be & 255, Ge[1] = be >>> 8 & 255, Ge[2] = be >>> 16 & 255, Ge[3] = be >>> 24 & 255, j.check = o(j.check, Ge, 4, 0)), be = 0, $e = 0, j.mode = F;
          /* falls through */
          case F:
            for (; $e < 16; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            j.head && (j.head.xflags = be & 255, j.head.os = be >> 8), j.flags & 512 && (Ge[0] = be & 255, Ge[1] = be >>> 8 & 255, j.check = o(j.check, Ge, 2, 0)), be = 0, $e = 0, j.mode = x;
          /* falls through */
          case x:
            if (j.flags & 1024) {
              for (; $e < 16; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              j.length = be, j.head && (j.head.extra_len = be), j.flags & 512 && (Ge[0] = be & 255, Ge[1] = be >>> 8 & 255, j.check = o(j.check, Ge, 2, 0)), be = 0, $e = 0;
            } else j.head && (j.head.extra = null);
            j.mode = M;
          /* falls through */
          case M:
            if (j.flags & 1024 && (g = j.length, g > De && (g = De), g && (j.head && (Pe = j.head.extra_len - j.length, j.head.extra || (j.head.extra = new Array(j.head.extra_len)), t.arraySet(
              j.head.extra,
              Be,
              _,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              g,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Pe
            )), j.flags & 512 && (j.check = o(j.check, Be, g, _)), De -= g, _ += g, j.length -= g), j.length))
              break e;
            j.length = 0, j.mode = Q;
          /* falls through */
          case Q:
            if (j.flags & 2048) {
              if (De === 0)
                break e;
              g = 0;
              do
                Pe = Be[_ + g++], j.head && Pe && j.length < 65536 && (j.head.name += String.fromCharCode(Pe));
              while (Pe && g < De);
              if (j.flags & 512 && (j.check = o(j.check, Be, g, _)), De -= g, _ += g, Pe)
                break e;
            } else j.head && (j.head.name = null);
            j.length = 0, j.mode = C;
          /* falls through */
          case C:
            if (j.flags & 4096) {
              if (De === 0)
                break e;
              g = 0;
              do
                Pe = Be[_ + g++], j.head && Pe && j.length < 65536 && (j.head.comment += String.fromCharCode(Pe));
              while (Pe && g < De);
              if (j.flags & 512 && (j.check = o(j.check, Be, g, _)), De -= g, _ += g, Pe)
                break e;
            } else j.head && (j.head.comment = null);
            j.mode = W;
          /* falls through */
          case W:
            if (j.flags & 512) {
              for (; $e < 16; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              if (be !== (j.check & 65535)) {
                X.msg = "header crc mismatch", j.mode = L;
                break;
              }
              be = 0, $e = 0;
            }
            j.head && (j.head.hcrc = j.flags >> 9 & 1, j.head.done = !0), X.adler = j.check = 0, j.mode = ae;
            break;
          case h:
            for (; $e < 32; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            X.adler = j.check = te(be), be = 0, $e = 0, j.mode = $;
          /* falls through */
          case $:
            if (j.havedict === 0)
              return X.next_out = Ie, X.avail_out = V, X.next_in = _, X.avail_in = De, j.hold = be, j.bits = $e, q;
            X.adler = j.check = 1, j.mode = ae;
          /* falls through */
          case ae:
            if (he === S || he === s)
              break e;
          /* falls through */
          case de:
            if (j.last) {
              be >>>= $e & 7, $e -= $e & 7, j.mode = re;
              break;
            }
            for (; $e < 3; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            switch (j.last = be & 1, be >>>= 1, $e -= 1, be & 3) {
              case 0:
                j.mode = Ee;
                break;
              case 1:
                if (He(j), j.mode = ee, he === s) {
                  be >>>= 2, $e -= 2;
                  break e;
                }
                break;
              case 2:
                j.mode = fe;
                break;
              case 3:
                X.msg = "invalid block type", j.mode = L;
            }
            be >>>= 2, $e -= 2;
            break;
          case Ee:
            for (be >>>= $e & 7, $e -= $e & 7; $e < 32; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if ((be & 65535) !== (be >>> 16 ^ 65535)) {
              X.msg = "invalid stored block lengths", j.mode = L;
              break;
            }
            if (j.length = be & 65535, be = 0, $e = 0, j.mode = _e, he === s)
              break e;
          /* falls through */
          case _e:
            j.mode = ce;
          /* falls through */
          case ce:
            if (g = j.length, g) {
              if (g > De && (g = De), g > V && (g = V), g === 0)
                break e;
              t.arraySet(We, Be, _, g, Ie), De -= g, _ += g, V -= g, Ie += g, j.length -= g;
              break;
            }
            j.mode = ae;
            break;
          case fe:
            for (; $e < 14; ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if (j.nlen = (be & 31) + 257, be >>>= 5, $e -= 5, j.ndist = (be & 31) + 1, be >>>= 5, $e -= 5, j.ncode = (be & 15) + 4, be >>>= 4, $e -= 4, j.nlen > 286 || j.ndist > 30) {
              X.msg = "too many length or distance symbols", j.mode = L;
              break;
            }
            j.have = 0, j.mode = k;
          /* falls through */
          case k:
            for (; j.have < j.ncode; ) {
              for (; $e < 3; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              j.lens[nr[j.have++]] = be & 7, be >>>= 3, $e -= 3;
            }
            for (; j.have < 19; )
              j.lens[nr[j.have++]] = 0;
            if (j.lencode = j.lendyn, j.lenbits = 7, Qe = { bits: j.lenbits }, ke = r(n, j.lens, 0, 19, j.lencode, 0, j.work, Qe), j.lenbits = Qe.bits, ke) {
              X.msg = "invalid code lengths set", j.mode = L;
              break;
            }
            j.have = 0, j.mode = pe;
          /* falls through */
          case pe:
            for (; j.have < j.nlen + j.ndist; ) {
              for (; Y = j.lencode[be & (1 << j.lenbits) - 1], ye = Y >>> 24, Te = Y >>> 16 & 255, ie = Y & 65535, !(ye <= $e); ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              if (ie < 16)
                be >>>= ye, $e -= ye, j.lens[j.have++] = ie;
              else {
                if (ie === 16) {
                  for (Ye = ye + 2; $e < Ye; ) {
                    if (De === 0)
                      break e;
                    De--, be += Be[_++] << $e, $e += 8;
                  }
                  if (be >>>= ye, $e -= ye, j.have === 0) {
                    X.msg = "invalid bit length repeat", j.mode = L;
                    break;
                  }
                  Pe = j.lens[j.have - 1], g = 3 + (be & 3), be >>>= 2, $e -= 2;
                } else if (ie === 17) {
                  for (Ye = ye + 3; $e < Ye; ) {
                    if (De === 0)
                      break e;
                    De--, be += Be[_++] << $e, $e += 8;
                  }
                  be >>>= ye, $e -= ye, Pe = 0, g = 3 + (be & 7), be >>>= 3, $e -= 3;
                } else {
                  for (Ye = ye + 7; $e < Ye; ) {
                    if (De === 0)
                      break e;
                    De--, be += Be[_++] << $e, $e += 8;
                  }
                  be >>>= ye, $e -= ye, Pe = 0, g = 11 + (be & 127), be >>>= 7, $e -= 7;
                }
                if (j.have + g > j.nlen + j.ndist) {
                  X.msg = "invalid bit length repeat", j.mode = L;
                  break;
                }
                for (; g--; )
                  j.lens[j.have++] = Pe;
              }
            }
            if (j.mode === L)
              break;
            if (j.lens[256] === 0) {
              X.msg = "invalid code -- missing end-of-block", j.mode = L;
              break;
            }
            if (j.lenbits = 9, Qe = { bits: j.lenbits }, ke = r(f, j.lens, 0, j.nlen, j.lencode, 0, j.work, Qe), j.lenbits = Qe.bits, ke) {
              X.msg = "invalid literal/lengths set", j.mode = L;
              break;
            }
            if (j.distbits = 6, j.distcode = j.distdyn, Qe = { bits: j.distbits }, ke = r(u, j.lens, j.nlen, j.ndist, j.distcode, 0, j.work, Qe), j.distbits = Qe.bits, ke) {
              X.msg = "invalid distances set", j.mode = L;
              break;
            }
            if (j.mode = ee, he === s)
              break e;
          /* falls through */
          case ee:
            j.mode = J;
          /* falls through */
          case J:
            if (De >= 6 && V >= 258) {
              X.next_out = Ie, X.avail_out = V, X.next_in = _, X.avail_in = De, j.hold = be, j.bits = $e, l(X, Z), Ie = X.next_out, We = X.output, V = X.avail_out, _ = X.next_in, Be = X.input, De = X.avail_in, be = j.hold, $e = j.bits, j.mode === ae && (j.back = -1);
              break;
            }
            for (j.back = 0; Y = j.lencode[be & (1 << j.lenbits) - 1], ye = Y >>> 24, Te = Y >>> 16 & 255, ie = Y & 65535, !(ye <= $e); ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if (Te && (Te & 240) === 0) {
              for (oe = ye, ve = Te, xe = ie; Y = j.lencode[xe + ((be & (1 << oe + ve) - 1) >> oe)], ye = Y >>> 24, Te = Y >>> 16 & 255, ie = Y & 65535, !(oe + ye <= $e); ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              be >>>= oe, $e -= oe, j.back += oe;
            }
            if (be >>>= ye, $e -= ye, j.back += ye, j.length = ie, Te === 0) {
              j.mode = N;
              break;
            }
            if (Te & 32) {
              j.back = -1, j.mode = ae;
              break;
            }
            if (Te & 64) {
              X.msg = "invalid literal/length code", j.mode = L;
              break;
            }
            j.extra = Te & 15, j.mode = G;
          /* falls through */
          case G:
            if (j.extra) {
              for (Ye = j.extra; $e < Ye; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              j.length += be & (1 << j.extra) - 1, be >>>= j.extra, $e -= j.extra, j.back += j.extra;
            }
            j.was = j.length, j.mode = ue;
          /* falls through */
          case ue:
            for (; Y = j.distcode[be & (1 << j.distbits) - 1], ye = Y >>> 24, Te = Y >>> 16 & 255, ie = Y & 65535, !(ye <= $e); ) {
              if (De === 0)
                break e;
              De--, be += Be[_++] << $e, $e += 8;
            }
            if ((Te & 240) === 0) {
              for (oe = ye, ve = Te, xe = ie; Y = j.distcode[xe + ((be & (1 << oe + ve) - 1) >> oe)], ye = Y >>> 24, Te = Y >>> 16 & 255, ie = Y & 65535, !(oe + ye <= $e); ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              be >>>= oe, $e -= oe, j.back += oe;
            }
            if (be >>>= ye, $e -= ye, j.back += ye, Te & 64) {
              X.msg = "invalid distance code", j.mode = L;
              break;
            }
            j.offset = ie, j.extra = Te & 15, j.mode = O;
          /* falls through */
          case O:
            if (j.extra) {
              for (Ye = j.extra; $e < Ye; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              j.offset += be & (1 << j.extra) - 1, be >>>= j.extra, $e -= j.extra, j.back += j.extra;
            }
            if (j.offset > j.dmax) {
              X.msg = "invalid distance too far back", j.mode = L;
              break;
            }
            j.mode = B;
          /* falls through */
          case B:
            if (V === 0)
              break e;
            if (g = Z - V, j.offset > g) {
              if (g = j.offset - g, g > j.whave && j.sane) {
                X.msg = "invalid distance too far back", j.mode = L;
                break;
              }
              g > j.wnext ? (g -= j.wnext, c = j.wsize - g) : c = j.wnext - g, g > j.length && (g = j.length), P = j.window;
            } else
              P = We, c = Ie - j.offset, g = j.length;
            g > V && (g = V), V -= g, j.length -= g;
            do
              We[Ie++] = P[c++];
            while (--g);
            j.length === 0 && (j.mode = J);
            break;
          case N:
            if (V === 0)
              break e;
            We[Ie++] = j.length, V--, j.mode = J;
            break;
          case re:
            if (j.wrap) {
              for (; $e < 32; ) {
                if (De === 0)
                  break e;
                De--, be |= Be[_++] << $e, $e += 8;
              }
              if (Z -= V, X.total_out += Z, j.total += Z, Z && (X.adler = j.check = /*UPDATE(state.check, put - _out, _out);*/
              j.flags ? o(j.check, We, Z, Ie - Z) : e(j.check, We, Z, Ie - Z)), Z = V, (j.flags ? be : te(be)) !== j.check) {
                X.msg = "incorrect data check", j.mode = L;
                break;
              }
              be = 0, $e = 0;
            }
            j.mode = ne;
          /* falls through */
          case ne:
            if (j.wrap && j.flags) {
              for (; $e < 32; ) {
                if (De === 0)
                  break e;
                De--, be += Be[_++] << $e, $e += 8;
              }
              if (be !== (j.total & 4294967295)) {
                X.msg = "incorrect length check", j.mode = L;
                break;
              }
              be = 0, $e = 0;
            }
            j.mode = D;
          /* falls through */
          case D:
            ke = E;
            break e;
          case L:
            ke = T;
            break e;
          case H:
            return d;
          case se:
          /* falls through */
          default:
            return p;
        }
    return X.next_out = Ie, X.avail_out = V, X.next_in = _, X.avail_in = De, j.hold = be, j.bits = $e, (j.wsize || Z !== X.avail_out && j.mode < L && (j.mode < re || he !== b)) && U(X, X.output, X.next_out, Z - X.avail_out), Ve -= X.avail_in, Z -= X.avail_out, X.total_in += Ve, X.total_out += Z, j.total += Z, j.wrap && Z && (X.adler = j.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    j.flags ? o(j.check, We, Z, X.next_out - Z) : e(j.check, We, Z, X.next_out - Z)), X.data_type = j.bits + (j.last ? 64 : 0) + (j.mode === ae ? 128 : 0) + (j.mode === ee || j.mode === _e ? 256 : 0), (Ve === 0 && Z === 0 || he === b) && ke === v && (ke = y), ke;
  }
  function m(X) {
    if (!X || !X.state)
      return p;
    var he = X.state;
    return he.window && (he.window = null), X.state = null, v;
  }
  function z(X, he) {
    var j;
    return !X || !X.state || (j = X.state, (j.wrap & 2) === 0) ? p : (j.head = he, he.done = !1, v);
  }
  function le(X, he) {
    var j = he.length, Be, We, _;
    return !X || !X.state || (Be = X.state, Be.wrap !== 0 && Be.mode !== $) ? p : Be.mode === $ && (We = 1, We = e(We, he, j, 0), We !== Be.check) ? T : (_ = U(X, he, j, j), _ ? (Be.mode = H, d) : (Be.havedict = 1, v));
  }
  return inflate.inflateReset = qe, inflate.inflateReset2 = Ue, inflate.inflateResetKeep = Ce, inflate.inflateInit = Se, inflate.inflateInit2 = me, inflate.inflate = a, inflate.inflateEnd = m, inflate.inflateGetHeader = z, inflate.inflateSetDictionary = le, inflate.inflateInfo = "pako inflate (from Nodeca project)", inflate;
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
    var e = requireAssert(), o = requireZstream(), l = requireDeflate(), r = requireInflate(), n = requireConstants();
    for (var f in n)
      t[f] = n[f];
    t.NONE = 0, t.DEFLATE = 1, t.INFLATE = 2, t.GZIP = 3, t.GUNZIP = 4, t.DEFLATERAW = 5, t.INFLATERAW = 6, t.UNZIP = 7;
    var u = 31, b = 139;
    function S(s) {
      if (typeof s != "number" || s < t.DEFLATE || s > t.UNZIP)
        throw new TypeError("Bad argument");
      this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = s, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0;
    }
    S.prototype.close = function() {
      if (this.write_in_progress) {
        this.pending_close = !0;
        return;
      }
      this.pending_close = !1, e(this.init_done, "close before init"), e(this.mode <= t.UNZIP), this.mode === t.DEFLATE || this.mode === t.GZIP || this.mode === t.DEFLATERAW ? l.deflateEnd(this.strm) : (this.mode === t.INFLATE || this.mode === t.GUNZIP || this.mode === t.INFLATERAW || this.mode === t.UNZIP) && r.inflateEnd(this.strm), this.mode = t.NONE, this.dictionary = null;
    }, S.prototype.write = function(s, v, E, q, p, T, d) {
      return this._write(!0, s, v, E, q, p, T, d);
    }, S.prototype.writeSync = function(s, v, E, q, p, T, d) {
      return this._write(!1, s, v, E, q, p, T, d);
    }, S.prototype._write = function(s, v, E, q, p, T, d, y) {
      if (e.equal(arguments.length, 8), e(this.init_done, "write before init"), e(this.mode !== t.NONE, "already finalized"), e.equal(!1, this.write_in_progress, "write already in progress"), e.equal(!1, this.pending_close, "close is pending"), this.write_in_progress = !0, e.equal(!1, v === void 0, "must provide flush value"), this.write_in_progress = !0, v !== t.Z_NO_FLUSH && v !== t.Z_PARTIAL_FLUSH && v !== t.Z_SYNC_FLUSH && v !== t.Z_FULL_FLUSH && v !== t.Z_FINISH && v !== t.Z_BLOCK)
        throw new Error("Invalid flush value");
      if (E == null && (E = Buffer.alloc(0), p = 0, q = 0), this.strm.avail_in = p, this.strm.input = E, this.strm.next_in = q, this.strm.avail_out = y, this.strm.output = T, this.strm.next_out = d, this.flush = v, !s)
        return this._process(), this._checkError() ? this._afterSync() : void 0;
      var A = this;
      return process$1.nextTick(function() {
        A._process(), A._after();
      }), this;
    }, S.prototype._afterSync = function() {
      var s = this.strm.avail_out, v = this.strm.avail_in;
      return this.write_in_progress = !1, [v, s];
    }, S.prototype._process = function() {
      var s = null;
      switch (this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = l.deflate(this.strm, this.flush);
          break;
        case t.UNZIP:
          switch (this.strm.avail_in > 0 && (s = this.strm.next_in), this.gzip_id_bytes_read) {
            case 0:
              if (s === null)
                break;
              if (this.strm.input[s] === u) {
                if (this.gzip_id_bytes_read = 1, s++, this.strm.avail_in === 1)
                  break;
              } else {
                this.mode = t.INFLATE;
                break;
              }
            // fallthrough
            case 1:
              if (s === null)
                break;
              this.strm.input[s] === b ? (this.gzip_id_bytes_read = 2, this.mode = t.GUNZIP) : this.mode = t.INFLATE;
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
    }, S.prototype._checkError = function() {
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
    }, S.prototype._after = function() {
      if (this._checkError()) {
        var s = this.strm.avail_out, v = this.strm.avail_in;
        this.write_in_progress = !1, this.callback(v, s), this.pending_close && this.close();
      }
    }, S.prototype._error = function(s) {
      this.strm.msg && (s = this.strm.msg), this.onerror(
        s,
        this.err
        // no hope of rescue.
      ), this.write_in_progress = !1, this.pending_close && this.close();
    }, S.prototype.init = function(s, v, E, q, p) {
      e(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])"), e(s >= 8 && s <= 15, "invalid windowBits"), e(v >= -1 && v <= 9, "invalid compression level"), e(E >= 1 && E <= 9, "invalid memlevel"), e(q === t.Z_FILTERED || q === t.Z_HUFFMAN_ONLY || q === t.Z_RLE || q === t.Z_FIXED || q === t.Z_DEFAULT_STRATEGY, "invalid strategy"), this._init(v, s, E, q, p), this._setDictionary();
    }, S.prototype.params = function() {
      throw new Error("deflateParams Not supported");
    }, S.prototype.reset = function() {
      this._reset(), this._setDictionary();
    }, S.prototype._init = function(s, v, E, q, p) {
      switch (this.level = s, this.windowBits = v, this.memLevel = E, this.strategy = q, this.flush = t.Z_NO_FLUSH, this.err = t.Z_OK, (this.mode === t.GZIP || this.mode === t.GUNZIP) && (this.windowBits += 16), this.mode === t.UNZIP && (this.windowBits += 32), (this.mode === t.DEFLATERAW || this.mode === t.INFLATERAW) && (this.windowBits = -1 * this.windowBits), this.strm = new o(), this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = l.deflateInit2(this.strm, this.level, t.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
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
    }, S.prototype._setDictionary = function() {
      if (this.dictionary != null) {
        switch (this.err = t.Z_OK, this.mode) {
          case t.DEFLATE:
          case t.DEFLATERAW:
            this.err = l.deflateSetDictionary(this.strm, this.dictionary);
            break;
        }
        this.err !== t.Z_OK && this._error("Failed to set dictionary");
      }
    }, S.prototype._reset = function() {
      switch (this.err = t.Z_OK, this.mode) {
        case t.DEFLATE:
        case t.DEFLATERAW:
        case t.GZIP:
          this.err = l.deflateReset(this.strm);
          break;
        case t.INFLATE:
        case t.INFLATERAW:
        case t.GUNZIP:
          this.err = r.inflateReset(this.strm);
          break;
      }
      this.err !== t.Z_OK && this._error("Failed to reset stream");
    }, t.Zlib = S;
  })(binding)), binding;
}
var hasRequiredLib;
function requireLib() {
  return hasRequiredLib || (hasRequiredLib = 1, (function(t) {
    var e = requireDist().Buffer, o = requireStreamBrowserify().Transform, l = requireBinding(), r = requireUtil$2(), n = requireAssert().ok, f = requireDist().kMaxLength, u = "Cannot create final Buffer. It would be larger than 0x" + f.toString(16) + " bytes";
    l.Z_MIN_WINDOWBITS = 8, l.Z_MAX_WINDOWBITS = 15, l.Z_DEFAULT_WINDOWBITS = 15, l.Z_MIN_CHUNK = 64, l.Z_MAX_CHUNK = 1 / 0, l.Z_DEFAULT_CHUNK = 16 * 1024, l.Z_MIN_MEMLEVEL = 1, l.Z_MAX_MEMLEVEL = 9, l.Z_DEFAULT_MEMLEVEL = 8, l.Z_MIN_LEVEL = -1, l.Z_MAX_LEVEL = 9, l.Z_DEFAULT_LEVEL = l.Z_DEFAULT_COMPRESSION;
    for (var b = Object.keys(l), S = 0; S < b.length; S++) {
      var s = b[S];
      s.match(/^Z/) && Object.defineProperty(t, s, {
        enumerable: !0,
        value: l[s],
        writable: !1
      });
    }
    for (var v = {
      Z_OK: l.Z_OK,
      Z_STREAM_END: l.Z_STREAM_END,
      Z_NEED_DICT: l.Z_NEED_DICT,
      Z_ERRNO: l.Z_ERRNO,
      Z_STREAM_ERROR: l.Z_STREAM_ERROR,
      Z_DATA_ERROR: l.Z_DATA_ERROR,
      Z_MEM_ERROR: l.Z_MEM_ERROR,
      Z_BUF_ERROR: l.Z_BUF_ERROR,
      Z_VERSION_ERROR: l.Z_VERSION_ERROR
    }, E = Object.keys(v), q = 0; q < E.length; q++) {
      var p = E[q];
      v[v[p]] = p;
    }
    Object.defineProperty(t, "codes", {
      enumerable: !0,
      value: Object.freeze(v),
      writable: !1
    }), t.Deflate = y, t.Inflate = A, t.Gzip = w, t.Gunzip = I, t.DeflateRaw = R, t.InflateRaw = F, t.Unzip = x, t.createDeflate = function(h) {
      return new y(h);
    }, t.createInflate = function(h) {
      return new A(h);
    }, t.createDeflateRaw = function(h) {
      return new R(h);
    }, t.createInflateRaw = function(h) {
      return new F(h);
    }, t.createGzip = function(h) {
      return new w(h);
    }, t.createGunzip = function(h) {
      return new I(h);
    }, t.createUnzip = function(h) {
      return new x(h);
    }, t.deflate = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new y($), h, ae);
    }, t.deflateSync = function(h, $) {
      return d(new y($), h);
    }, t.gzip = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new w($), h, ae);
    }, t.gzipSync = function(h, $) {
      return d(new w($), h);
    }, t.deflateRaw = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new R($), h, ae);
    }, t.deflateRawSync = function(h, $) {
      return d(new R($), h);
    }, t.unzip = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new x($), h, ae);
    }, t.unzipSync = function(h, $) {
      return d(new x($), h);
    }, t.inflate = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new A($), h, ae);
    }, t.inflateSync = function(h, $) {
      return d(new A($), h);
    }, t.gunzip = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new I($), h, ae);
    }, t.gunzipSync = function(h, $) {
      return d(new I($), h);
    }, t.inflateRaw = function(h, $, ae) {
      return typeof $ == "function" && (ae = $, $ = {}), T(new F($), h, ae);
    }, t.inflateRawSync = function(h, $) {
      return d(new F($), h);
    };
    function T(h, $, ae) {
      var de = [], Ee = 0;
      h.on("error", ce), h.on("end", fe), h.end($), _e();
      function _e() {
        for (var k; (k = h.read()) !== null; )
          de.push(k), Ee += k.length;
        h.once("readable", _e);
      }
      function ce(k) {
        h.removeListener("end", fe), h.removeListener("readable", _e), ae(k);
      }
      function fe() {
        var k, pe = null;
        Ee >= f ? pe = new RangeError(u) : k = e.concat(de, Ee), de = [], h.close(), ae(pe, k);
      }
    }
    function d(h, $) {
      if (typeof $ == "string" && ($ = e.from($)), !e.isBuffer($)) throw new TypeError("Not a string or buffer");
      var ae = h._finishFlushFlag;
      return h._processChunk($, ae);
    }
    function y(h) {
      if (!(this instanceof y)) return new y(h);
      Q.call(this, h, l.DEFLATE);
    }
    function A(h) {
      if (!(this instanceof A)) return new A(h);
      Q.call(this, h, l.INFLATE);
    }
    function w(h) {
      if (!(this instanceof w)) return new w(h);
      Q.call(this, h, l.GZIP);
    }
    function I(h) {
      if (!(this instanceof I)) return new I(h);
      Q.call(this, h, l.GUNZIP);
    }
    function R(h) {
      if (!(this instanceof R)) return new R(h);
      Q.call(this, h, l.DEFLATERAW);
    }
    function F(h) {
      if (!(this instanceof F)) return new F(h);
      Q.call(this, h, l.INFLATERAW);
    }
    function x(h) {
      if (!(this instanceof x)) return new x(h);
      Q.call(this, h, l.UNZIP);
    }
    function M(h) {
      return h === l.Z_NO_FLUSH || h === l.Z_PARTIAL_FLUSH || h === l.Z_SYNC_FLUSH || h === l.Z_FULL_FLUSH || h === l.Z_FINISH || h === l.Z_BLOCK;
    }
    function Q(h, $) {
      var ae = this;
      if (this._opts = h = h || {}, this._chunkSize = h.chunkSize || t.Z_DEFAULT_CHUNK, o.call(this, h), h.flush && !M(h.flush))
        throw new Error("Invalid flush flag: " + h.flush);
      if (h.finishFlush && !M(h.finishFlush))
        throw new Error("Invalid flush flag: " + h.finishFlush);
      if (this._flushFlag = h.flush || l.Z_NO_FLUSH, this._finishFlushFlag = typeof h.finishFlush < "u" ? h.finishFlush : l.Z_FINISH, h.chunkSize && (h.chunkSize < t.Z_MIN_CHUNK || h.chunkSize > t.Z_MAX_CHUNK))
        throw new Error("Invalid chunk size: " + h.chunkSize);
      if (h.windowBits && (h.windowBits < t.Z_MIN_WINDOWBITS || h.windowBits > t.Z_MAX_WINDOWBITS))
        throw new Error("Invalid windowBits: " + h.windowBits);
      if (h.level && (h.level < t.Z_MIN_LEVEL || h.level > t.Z_MAX_LEVEL))
        throw new Error("Invalid compression level: " + h.level);
      if (h.memLevel && (h.memLevel < t.Z_MIN_MEMLEVEL || h.memLevel > t.Z_MAX_MEMLEVEL))
        throw new Error("Invalid memLevel: " + h.memLevel);
      if (h.strategy && h.strategy != t.Z_FILTERED && h.strategy != t.Z_HUFFMAN_ONLY && h.strategy != t.Z_RLE && h.strategy != t.Z_FIXED && h.strategy != t.Z_DEFAULT_STRATEGY)
        throw new Error("Invalid strategy: " + h.strategy);
      if (h.dictionary && !e.isBuffer(h.dictionary))
        throw new Error("Invalid dictionary: it should be a Buffer instance");
      this._handle = new l.Zlib($);
      var de = this;
      this._hadError = !1, this._handle.onerror = function(ce, fe) {
        C(de), de._hadError = !0;
        var k = new Error(ce);
        k.errno = fe, k.code = t.codes[fe], de.emit("error", k);
      };
      var Ee = t.Z_DEFAULT_COMPRESSION;
      typeof h.level == "number" && (Ee = h.level);
      var _e = t.Z_DEFAULT_STRATEGY;
      typeof h.strategy == "number" && (_e = h.strategy), this._handle.init(h.windowBits || t.Z_DEFAULT_WINDOWBITS, Ee, h.memLevel || t.Z_DEFAULT_MEMLEVEL, _e, h.dictionary), this._buffer = e.allocUnsafe(this._chunkSize), this._offset = 0, this._level = Ee, this._strategy = _e, this.once("end", this.close), Object.defineProperty(this, "_closed", {
        get: function() {
          return !ae._handle;
        },
        configurable: !0,
        enumerable: !0
      });
    }
    r.inherits(Q, o), Q.prototype.params = function(h, $, ae) {
      if (h < t.Z_MIN_LEVEL || h > t.Z_MAX_LEVEL)
        throw new RangeError("Invalid compression level: " + h);
      if ($ != t.Z_FILTERED && $ != t.Z_HUFFMAN_ONLY && $ != t.Z_RLE && $ != t.Z_FIXED && $ != t.Z_DEFAULT_STRATEGY)
        throw new TypeError("Invalid strategy: " + $);
      if (this._level !== h || this._strategy !== $) {
        var de = this;
        this.flush(l.Z_SYNC_FLUSH, function() {
          n(de._handle, "zlib binding closed"), de._handle.params(h, $), de._hadError || (de._level = h, de._strategy = $, ae && ae());
        });
      } else
        process$1.nextTick(ae);
    }, Q.prototype.reset = function() {
      return n(this._handle, "zlib binding closed"), this._handle.reset();
    }, Q.prototype._flush = function(h) {
      this._transform(e.alloc(0), "", h);
    }, Q.prototype.flush = function(h, $) {
      var ae = this, de = this._writableState;
      (typeof h == "function" || h === void 0 && !$) && ($ = h, h = l.Z_FULL_FLUSH), de.ended ? $ && process$1.nextTick($) : de.ending ? $ && this.once("end", $) : de.needDrain ? $ && this.once("drain", function() {
        return ae.flush(h, $);
      }) : (this._flushFlag = h, this.write(e.alloc(0), "", $));
    }, Q.prototype.close = function(h) {
      C(this, h), process$1.nextTick(W, this);
    };
    function C(h, $) {
      $ && process$1.nextTick($), h._handle && (h._handle.close(), h._handle = null);
    }
    function W(h) {
      h.emit("close");
    }
    Q.prototype._transform = function(h, $, ae) {
      var de, Ee = this._writableState, _e = Ee.ending || Ee.ended, ce = _e && (!h || Ee.length === h.length);
      if (h !== null && !e.isBuffer(h)) return ae(new Error("invalid input"));
      if (!this._handle) return ae(new Error("zlib binding closed"));
      ce ? de = this._finishFlushFlag : (de = this._flushFlag, h.length >= Ee.length && (this._flushFlag = this._opts.flush || l.Z_NO_FLUSH)), this._processChunk(h, de, ae);
    }, Q.prototype._processChunk = function(h, $, ae) {
      var de = h && h.length, Ee = this._chunkSize - this._offset, _e = 0, ce = this, fe = typeof ae == "function";
      if (!fe) {
        var k = [], pe = 0, ee;
        this.on("error", function(B) {
          ee = B;
        }), n(this._handle, "zlib binding closed");
        do
          var J = this._handle.writeSync(
            $,
            h,
            // in
            _e,
            // in_off
            de,
            // in_len
            this._buffer,
            // out
            this._offset,
            //out_off
            Ee
          );
        while (!this._hadError && O(J[0], J[1]));
        if (this._hadError)
          throw ee;
        if (pe >= f)
          throw C(this), new RangeError(u);
        var G = e.concat(k, pe);
        return C(this), G;
      }
      n(this._handle, "zlib binding closed");
      var ue = this._handle.write(
        $,
        h,
        // in
        _e,
        // in_off
        de,
        // in_len
        this._buffer,
        // out
        this._offset,
        //out_off
        Ee
      );
      ue.buffer = h, ue.callback = O;
      function O(B, N) {
        if (this && (this.buffer = null, this.callback = null), !ce._hadError) {
          var re = Ee - N;
          if (n(re >= 0, "have should not go down"), re > 0) {
            var ne = ce._buffer.slice(ce._offset, ce._offset + re);
            ce._offset += re, fe ? ce.push(ne) : (k.push(ne), pe += ne.length);
          }
          if ((N === 0 || ce._offset >= ce._chunkSize) && (Ee = ce._chunkSize, ce._offset = 0, ce._buffer = e.allocUnsafe(ce._chunkSize)), N === 0) {
            if (_e += de - B, de = B, !fe) return !0;
            var D = ce._handle.write($, h, _e, de, ce._buffer, ce._offset, ce._chunkSize);
            D.callback = O, D.buffer = h;
            return;
          }
          if (!fe) return !1;
          ae();
        }
      }
    }, r.inherits(y, Q), r.inherits(A, Q), r.inherits(w, Q), r.inherits(I, Q), r.inherits(R, Q), r.inherits(F, Q), r.inherits(x, Q);
  })(lib)), lib;
}
var utils$2, hasRequiredUtils$2;
function requireUtils$2() {
  if (hasRequiredUtils$2) return utils$2;
  hasRequiredUtils$2 = 1;
  function t(s, v) {
    const E = s.split("/");
    let q = 0;
    if (E[q] === "") {
      for (; v[".."] !== void 0; )
        v = v[".."];
      q++;
    }
    for (; q < E.length; q++)
      v = v[E[q]];
    return v;
  }
  function e(s) {
    if (typeof s == "string")
      return { type: s };
    if (Array.isArray(s))
      return { type: s[0], typeArgs: s[1] };
    if (typeof s.type == "string")
      return s;
    throw new Error("Not a fieldinfo");
  }
  function o(s, v, { count: E, countType: q }, p) {
    let T = 0, d = 0;
    return typeof E == "number" ? T = E : typeof E < "u" ? T = t(E, p) : typeof q < "u" ? { size: d, value: T } = u(() => this.read(s, v, e(q), p), "$count") : T = 0, { count: T, size: d };
  }
  function l(s, v, E, { count: q, countType: p }, T) {
    return typeof q < "u" && s !== q || typeof p < "u" && (E = this.write(s, v, E, e(p), T)), E;
  }
  function r(s, { count: v, countType: E }, q) {
    return typeof v > "u" && typeof E < "u" ? u(() => this.sizeOf(s, e(E), q), "$count") : 0;
  }
  function n(s, v) {
    throw s.field = s.field ? v + "." + s.field : v, s;
  }
  function f(s, v) {
    try {
      return s();
    } catch (E) {
      v(E);
    }
  }
  function u(s, v) {
    return f(s, (E) => n(E, v));
  }
  class b extends Error {
    constructor(v) {
      super(v), this.name = this.constructor.name, this.message = v, Error.captureStackTrace != null && Error.captureStackTrace(this, this.constructor.name);
    }
  }
  class S extends b {
    constructor(v) {
      super(v), this.partialReadError = !0;
    }
  }
  return utils$2 = {
    getField: t,
    getFieldInfo: e,
    addErrorField: n,
    getCount: o,
    sendCount: l,
    calcCount: r,
    tryCatch: f,
    tryDoc: u,
    PartialReadError: S
  }, utils$2;
}
var lodash_reduce = { exports: {} };
lodash_reduce.exports;
var hasRequiredLodash_reduce;
function requireLodash_reduce() {
  return hasRequiredLodash_reduce || (hasRequiredLodash_reduce = 1, (function(t, e) {
    var o = 200, l = "Expected a function", r = "__lodash_hash_undefined__", n = 1, f = 2, u = 9007199254740991, b = "[object Arguments]", S = "[object Array]", s = "[object Boolean]", v = "[object Date]", E = "[object Error]", q = "[object Function]", p = "[object GeneratorFunction]", T = "[object Map]", d = "[object Number]", y = "[object Object]", A = "[object Promise]", w = "[object RegExp]", I = "[object Set]", R = "[object String]", F = "[object Symbol]", x = "[object WeakMap]", M = "[object ArrayBuffer]", Q = "[object DataView]", C = "[object Float32Array]", W = "[object Float64Array]", h = "[object Int8Array]", $ = "[object Int16Array]", ae = "[object Int32Array]", de = "[object Uint8Array]", Ee = "[object Uint8ClampedArray]", _e = "[object Uint16Array]", ce = "[object Uint32Array]", fe = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, k = /^\w*$/, pe = /^\./, ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, J = /[\\^$.*+?()[\]{}|]/g, G = /\\(\\)?/g, ue = /^\[object .+?Constructor\]$/, O = /^(?:0|[1-9]\d*)$/, B = {};
    B[C] = B[W] = B[h] = B[$] = B[ae] = B[de] = B[Ee] = B[_e] = B[ce] = !0, B[b] = B[S] = B[M] = B[s] = B[Q] = B[v] = B[E] = B[q] = B[T] = B[d] = B[y] = B[w] = B[I] = B[R] = B[x] = !1;
    var N = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, re = typeof self == "object" && self && self.Object === Object && self, ne = N || re || Function("return this")(), D = e && !e.nodeType && e, L = D && !0 && t && !t.nodeType && t, H = L && L.exports === D, se = H && N.process, we = (function() {
      try {
        return se && se.binding("util");
      } catch {
      }
    })(), Re = we && we.isTypedArray;
    function Ae(K, ge, Ne, ze) {
      var Ke = -1, Ze = K ? K.length : 0;
      for (ze && Ze && (Ne = K[++Ke]); ++Ke < Ze; )
        Ne = ge(Ne, K[Ke], Ke, K);
      return Ne;
    }
    function Oe(K, ge) {
      for (var Ne = -1, ze = K ? K.length : 0; ++Ne < ze; )
        if (ge(K[Ne], Ne, K))
          return !0;
      return !1;
    }
    function te(K) {
      return function(ge) {
        return ge == null ? void 0 : ge[K];
      };
    }
    function Fe(K, ge, Ne, ze, Ke) {
      return Ke(K, function(Ze, er, ur) {
        Ne = ze ? (ze = !1, Ze) : ge(Ne, Ze, er, ur);
      }), Ne;
    }
    function Ce(K, ge) {
      for (var Ne = -1, ze = Array(K); ++Ne < K; )
        ze[Ne] = ge(Ne);
      return ze;
    }
    function qe(K) {
      return function(ge) {
        return K(ge);
      };
    }
    function Ue(K, ge) {
      return K == null ? void 0 : K[ge];
    }
    function me(K) {
      var ge = !1;
      if (K != null && typeof K.toString != "function")
        try {
          ge = !!(K + "");
        } catch {
        }
      return ge;
    }
    function Se(K) {
      var ge = -1, Ne = Array(K.size);
      return K.forEach(function(ze, Ke) {
        Ne[++ge] = [Ke, ze];
      }), Ne;
    }
    function Le(K, ge) {
      return function(Ne) {
        return K(ge(Ne));
      };
    }
    function Me(K) {
      var ge = -1, Ne = Array(K.size);
      return K.forEach(function(ze) {
        Ne[++ge] = ze;
      }), Ne;
    }
    var je = Array.prototype, He = Function.prototype, U = Object.prototype, a = ne["__core-js_shared__"], m = (function() {
      var K = /[^.]+$/.exec(a && a.keys && a.keys.IE_PROTO || "");
      return K ? "Symbol(src)_1." + K : "";
    })(), z = He.toString, le = U.hasOwnProperty, X = U.toString, he = RegExp(
      "^" + z.call(le).replace(J, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), j = ne.Symbol, Be = ne.Uint8Array, We = U.propertyIsEnumerable, _ = je.splice, Ie = Le(Object.keys, Object), De = Br(ne, "DataView"), V = Br(ne, "Map"), be = Br(ne, "Promise"), $e = Br(ne, "Set"), Ve = Br(ne, "WeakMap"), Z = Br(Object, "create"), g = xr(De), c = xr(V), P = xr(be), Y = xr($e), ye = xr(Ve), Te = j ? j.prototype : void 0, ie = Te ? Te.valueOf : void 0, oe = Te ? Te.toString : void 0;
    function ve(K) {
      var ge = -1, Ne = K ? K.length : 0;
      for (this.clear(); ++ge < Ne; ) {
        var ze = K[ge];
        this.set(ze[0], ze[1]);
      }
    }
    function xe() {
      this.__data__ = Z ? Z(null) : {};
    }
    function Pe(K) {
      return this.has(K) && delete this.__data__[K];
    }
    function ke(K) {
      var ge = this.__data__;
      if (Z) {
        var Ne = ge[K];
        return Ne === r ? void 0 : Ne;
      }
      return le.call(ge, K) ? ge[K] : void 0;
    }
    function Ge(K) {
      var ge = this.__data__;
      return Z ? ge[K] !== void 0 : le.call(ge, K);
    }
    function Qe(K, ge) {
      var Ne = this.__data__;
      return Ne[K] = Z && ge === void 0 ? r : ge, this;
    }
    ve.prototype.clear = xe, ve.prototype.delete = Pe, ve.prototype.get = ke, ve.prototype.has = Ge, ve.prototype.set = Qe;
    function Ye(K) {
      var ge = -1, Ne = K ? K.length : 0;
      for (this.clear(); ++ge < Ne; ) {
        var ze = K[ge];
        this.set(ze[0], ze[1]);
      }
    }
    function nr() {
      this.__data__ = [];
    }
    function Je(K) {
      var ge = this.__data__, Ne = Rr(ge, K);
      if (Ne < 0)
        return !1;
      var ze = ge.length - 1;
      return Ne == ze ? ge.pop() : _.call(ge, Ne, 1), !0;
    }
    function rr(K) {
      var ge = this.__data__, Ne = Rr(ge, K);
      return Ne < 0 ? void 0 : ge[Ne][1];
    }
    function ar(K) {
      return Rr(this.__data__, K) > -1;
    }
    function Xe(K, ge) {
      var Ne = this.__data__, ze = Rr(Ne, K);
      return ze < 0 ? Ne.push([K, ge]) : Ne[ze][1] = ge, this;
    }
    Ye.prototype.clear = nr, Ye.prototype.delete = Je, Ye.prototype.get = rr, Ye.prototype.has = ar, Ye.prototype.set = Xe;
    function tr(K) {
      var ge = -1, Ne = K ? K.length : 0;
      for (this.clear(); ++ge < Ne; ) {
        var ze = K[ge];
        this.set(ze[0], ze[1]);
      }
    }
    function or() {
      this.__data__ = {
        hash: new ve(),
        map: new (V || Ye)(),
        string: new ve()
      };
    }
    function ir(K) {
      return kr(this, K).delete(K);
    }
    function wr(K) {
      return kr(this, K).get(K);
    }
    function yr(K) {
      return kr(this, K).has(K);
    }
    function vr(K, ge) {
      return kr(this, K).set(K, ge), this;
    }
    tr.prototype.clear = or, tr.prototype.delete = ir, tr.prototype.get = wr, tr.prototype.has = yr, tr.prototype.set = vr;
    function br(K) {
      var ge = -1, Ne = K ? K.length : 0;
      for (this.__data__ = new tr(); ++ge < Ne; )
        this.add(K[ge]);
    }
    function Er(K) {
      return this.__data__.set(K, r), this;
    }
    function dr(K) {
      return this.__data__.has(K);
    }
    br.prototype.add = br.prototype.push = Er, br.prototype.has = dr;
    function lr(K) {
      this.__data__ = new Ye(K);
    }
    function Sr() {
      this.__data__ = new Ye();
    }
    function _r(K) {
      return this.__data__.delete(K);
    }
    function Or(K) {
      return this.__data__.get(K);
    }
    function Cr(K) {
      return this.__data__.has(K);
    }
    function Nr(K, ge) {
      var Ne = this.__data__;
      if (Ne instanceof Ye) {
        var ze = Ne.__data__;
        if (!V || ze.length < o - 1)
          return ze.push([K, ge]), this;
        Ne = this.__data__ = new tr(ze);
      }
      return Ne.set(K, ge), this;
    }
    lr.prototype.clear = Sr, lr.prototype.delete = _r, lr.prototype.get = Or, lr.prototype.has = Cr, lr.prototype.set = Nr;
    function Fr(K, ge) {
      var Ne = Tr(K) || at(K) ? Ce(K.length, String) : [], ze = Ne.length, Ke = !!ze;
      for (var Ze in K)
        le.call(K, Ze) && !(Ke && (Ze == "length" || rt(Ze, ze))) && Ne.push(Ze);
      return Ne;
    }
    function Rr(K, ge) {
      for (var Ne = K.length; Ne--; )
        if (it(K[Ne][0], ge))
          return Ne;
      return -1;
    }
    var Dr = _t(jr), Lr = wt();
    function jr(K, ge) {
      return K && Lr(K, ge, Hr);
    }
    function Pr(K, ge) {
      ge = Mr(ge, K) ? [ge] : Xr(ge);
      for (var Ne = 0, ze = ge.length; K != null && Ne < ze; )
        K = K[Ur(ge[Ne++])];
      return Ne && Ne == ze ? K : void 0;
    }
    function ut(K) {
      return X.call(K);
    }
    function lt(K, ge) {
      return K != null && ge in Object(K);
    }
    function Zr(K, ge, Ne, ze, Ke) {
      return K === ge ? !0 : K == null || ge == null || !zr(K) && !Wr(ge) ? K !== K && ge !== ge : ft(K, ge, Zr, Ne, ze, Ke);
    }
    function ft(K, ge, Ne, ze, Ke, Ze) {
      var er = Tr(K), ur = Tr(ge), sr = S, fr = S;
      er || (sr = qr(K), sr = sr == b ? y : sr), ur || (fr = qr(ge), fr = fr == b ? y : fr);
      var hr = sr == y && !me(K), pr = fr == y && !me(ge), cr = sr == fr;
      if (cr && !hr)
        return Ze || (Ze = new lr()), er || $t(K) ? et(K, ge, Ne, ze, Ke, Ze) : Et(K, ge, sr, Ne, ze, Ke, Ze);
      if (!(Ke & f)) {
        var mr = hr && le.call(K, "__wrapped__"), gr = pr && le.call(ge, "__wrapped__");
        if (mr || gr) {
          var Ir = mr ? K.value() : K, Ar = gr ? ge.value() : ge;
          return Ze || (Ze = new lr()), Ne(Ir, Ar, ze, Ke, Ze);
        }
      }
      return cr ? (Ze || (Ze = new lr()), St(K, ge, Ne, ze, Ke, Ze)) : !1;
    }
    function ct(K, ge, Ne, ze) {
      var Ke = Ne.length, Ze = Ke;
      if (K == null)
        return !Ze;
      for (K = Object(K); Ke--; ) {
        var er = Ne[Ke];
        if (er[2] ? er[1] !== K[er[0]] : !(er[0] in K))
          return !1;
      }
      for (; ++Ke < Ze; ) {
        er = Ne[Ke];
        var ur = er[0], sr = K[ur], fr = er[1];
        if (er[2]) {
          if (sr === void 0 && !(ur in K))
            return !1;
        } else {
          var hr = new lr(), pr;
          if (!(pr === void 0 ? Zr(fr, sr, ze, n | f, hr) : pr))
            return !1;
        }
      }
      return !0;
    }
    function dt(K) {
      if (!zr(K) || qt(K))
        return !1;
      var ge = ot(K) || me(K) ? he : ue;
      return ge.test(xr(K));
    }
    function ht(K) {
      return Wr(K) && Yr(K.length) && !!B[X.call(K)];
    }
    function pt(K) {
      return typeof K == "function" ? K : K == null ? Ct : typeof K == "object" ? Tr(K) ? mt(K[0], K[1]) : vt(K) : Nt(K);
    }
    function yt(K) {
      if (!Tt(K))
        return Ie(K);
      var ge = [];
      for (var Ne in Object(K))
        le.call(K, Ne) && Ne != "constructor" && ge.push(Ne);
      return ge;
    }
    function vt(K) {
      var ge = Rt(K);
      return ge.length == 1 && ge[0][2] ? nt(ge[0][0], ge[0][1]) : function(Ne) {
        return Ne === K || ct(Ne, K, ge);
      };
    }
    function mt(K, ge) {
      return Mr(K) && tt(ge) ? nt(Ur(K), ge) : function(Ne) {
        var ze = Dt(Ne, K);
        return ze === void 0 && ze === ge ? Bt(Ne, K) : Zr(ge, ze, void 0, n | f);
      };
    }
    function gt(K) {
      return function(ge) {
        return Pr(ge, K);
      };
    }
    function bt(K) {
      if (typeof K == "string")
        return K;
      if (Jr(K))
        return oe ? oe.call(K) : "";
      var ge = K + "";
      return ge == "0" && 1 / K == -1 / 0 ? "-0" : ge;
    }
    function Xr(K) {
      return Tr(K) ? K : It(K);
    }
    function _t(K, ge) {
      return function(Ne, ze) {
        if (Ne == null)
          return Ne;
        if (!Qr(Ne))
          return K(Ne, ze);
        for (var Ke = Ne.length, Ze = -1, er = Object(Ne); ++Ze < Ke && ze(er[Ze], Ze, er) !== !1; )
          ;
        return Ne;
      };
    }
    function wt(K) {
      return function(ge, Ne, ze) {
        for (var Ke = -1, Ze = Object(ge), er = ze(ge), ur = er.length; ur--; ) {
          var sr = er[++Ke];
          if (Ne(Ze[sr], sr, Ze) === !1)
            break;
        }
        return ge;
      };
    }
    function et(K, ge, Ne, ze, Ke, Ze) {
      var er = Ke & f, ur = K.length, sr = ge.length;
      if (ur != sr && !(er && sr > ur))
        return !1;
      var fr = Ze.get(K);
      if (fr && Ze.get(ge))
        return fr == ge;
      var hr = -1, pr = !0, cr = Ke & n ? new br() : void 0;
      for (Ze.set(K, ge), Ze.set(ge, K); ++hr < ur; ) {
        var mr = K[hr], gr = ge[hr];
        if (ze)
          var Ir = er ? ze(gr, mr, hr, ge, K, Ze) : ze(mr, gr, hr, K, ge, Ze);
        if (Ir !== void 0) {
          if (Ir)
            continue;
          pr = !1;
          break;
        }
        if (cr) {
          if (!Oe(ge, function(Ar, $r) {
            if (!cr.has($r) && (mr === Ar || Ne(mr, Ar, ze, Ke, Ze)))
              return cr.add($r);
          })) {
            pr = !1;
            break;
          }
        } else if (!(mr === gr || Ne(mr, gr, ze, Ke, Ze))) {
          pr = !1;
          break;
        }
      }
      return Ze.delete(K), Ze.delete(ge), pr;
    }
    function Et(K, ge, Ne, ze, Ke, Ze, er) {
      switch (Ne) {
        case Q:
          if (K.byteLength != ge.byteLength || K.byteOffset != ge.byteOffset)
            return !1;
          K = K.buffer, ge = ge.buffer;
        case M:
          return !(K.byteLength != ge.byteLength || !ze(new Be(K), new Be(ge)));
        case s:
        case v:
        case d:
          return it(+K, +ge);
        case E:
          return K.name == ge.name && K.message == ge.message;
        case w:
        case R:
          return K == ge + "";
        case T:
          var ur = Se;
        case I:
          var sr = Ze & f;
          if (ur || (ur = Me), K.size != ge.size && !sr)
            return !1;
          var fr = er.get(K);
          if (fr)
            return fr == ge;
          Ze |= n, er.set(K, ge);
          var hr = et(ur(K), ur(ge), ze, Ke, Ze, er);
          return er.delete(K), hr;
        case F:
          if (ie)
            return ie.call(K) == ie.call(ge);
      }
      return !1;
    }
    function St(K, ge, Ne, ze, Ke, Ze) {
      var er = Ke & f, ur = Hr(K), sr = ur.length, fr = Hr(ge), hr = fr.length;
      if (sr != hr && !er)
        return !1;
      for (var pr = sr; pr--; ) {
        var cr = ur[pr];
        if (!(er ? cr in ge : le.call(ge, cr)))
          return !1;
      }
      var mr = Ze.get(K);
      if (mr && Ze.get(ge))
        return mr == ge;
      var gr = !0;
      Ze.set(K, ge), Ze.set(ge, K);
      for (var Ir = er; ++pr < sr; ) {
        cr = ur[pr];
        var Ar = K[cr], $r = ge[cr];
        if (ze)
          var st = er ? ze($r, Ar, cr, ge, K, Ze) : ze(Ar, $r, cr, K, ge, Ze);
        if (!(st === void 0 ? Ar === $r || Ne(Ar, $r, ze, Ke, Ze) : st)) {
          gr = !1;
          break;
        }
        Ir || (Ir = cr == "constructor");
      }
      if (gr && !Ir) {
        var Gr = K.constructor, Vr = ge.constructor;
        Gr != Vr && "constructor" in K && "constructor" in ge && !(typeof Gr == "function" && Gr instanceof Gr && typeof Vr == "function" && Vr instanceof Vr) && (gr = !1);
      }
      return Ze.delete(K), Ze.delete(ge), gr;
    }
    function kr(K, ge) {
      var Ne = K.__data__;
      return Pt(ge) ? Ne[typeof ge == "string" ? "string" : "hash"] : Ne.map;
    }
    function Rt(K) {
      for (var ge = Hr(K), Ne = ge.length; Ne--; ) {
        var ze = ge[Ne], Ke = K[ze];
        ge[Ne] = [ze, Ke, tt(Ke)];
      }
      return ge;
    }
    function Br(K, ge) {
      var Ne = Ue(K, ge);
      return dt(Ne) ? Ne : void 0;
    }
    var qr = ut;
    (De && qr(new De(new ArrayBuffer(1))) != Q || V && qr(new V()) != T || be && qr(be.resolve()) != A || $e && qr(new $e()) != I || Ve && qr(new Ve()) != x) && (qr = function(K) {
      var ge = X.call(K), Ne = ge == y ? K.constructor : void 0, ze = Ne ? xr(Ne) : void 0;
      if (ze)
        switch (ze) {
          case g:
            return Q;
          case c:
            return T;
          case P:
            return A;
          case Y:
            return I;
          case ye:
            return x;
        }
      return ge;
    });
    function At(K, ge, Ne) {
      ge = Mr(ge, K) ? [ge] : Xr(ge);
      for (var ze, Ke = -1, er = ge.length; ++Ke < er; ) {
        var Ze = Ur(ge[Ke]);
        if (!(ze = K != null && Ne(K, Ze)))
          break;
        K = K[Ze];
      }
      if (ze)
        return ze;
      var er = K ? K.length : 0;
      return !!er && Yr(er) && rt(Ze, er) && (Tr(K) || at(K));
    }
    function rt(K, ge) {
      return ge = ge ?? u, !!ge && (typeof K == "number" || O.test(K)) && K > -1 && K % 1 == 0 && K < ge;
    }
    function Mr(K, ge) {
      if (Tr(K))
        return !1;
      var Ne = typeof K;
      return Ne == "number" || Ne == "symbol" || Ne == "boolean" || K == null || Jr(K) ? !0 : k.test(K) || !fe.test(K) || ge != null && K in Object(ge);
    }
    function Pt(K) {
      var ge = typeof K;
      return ge == "string" || ge == "number" || ge == "symbol" || ge == "boolean" ? K !== "__proto__" : K === null;
    }
    function qt(K) {
      return !!m && m in K;
    }
    function Tt(K) {
      var ge = K && K.constructor, Ne = typeof ge == "function" && ge.prototype || U;
      return K === Ne;
    }
    function tt(K) {
      return K === K && !zr(K);
    }
    function nt(K, ge) {
      return function(Ne) {
        return Ne == null ? !1 : Ne[K] === ge && (ge !== void 0 || K in Object(Ne));
      };
    }
    var It = Kr(function(K) {
      K = Ft(K);
      var ge = [];
      return pe.test(K) && ge.push(""), K.replace(ee, function(Ne, ze, Ke, Ze) {
        ge.push(Ke ? Ze.replace(G, "$1") : ze || Ne);
      }), ge;
    });
    function Ur(K) {
      if (typeof K == "string" || Jr(K))
        return K;
      var ge = K + "";
      return ge == "0" && 1 / K == -1 / 0 ? "-0" : ge;
    }
    function xr(K) {
      if (K != null) {
        try {
          return z.call(K);
        } catch {
        }
        try {
          return K + "";
        } catch {
        }
      }
      return "";
    }
    function Ot(K, ge, Ne) {
      var ze = Tr(K) ? Ae : Fe, Ke = arguments.length < 3;
      return ze(K, pt(ge), Ne, Ke, Dr);
    }
    function Kr(K, ge) {
      if (typeof K != "function" || ge && typeof ge != "function")
        throw new TypeError(l);
      var Ne = function() {
        var ze = arguments, Ke = ge ? ge.apply(this, ze) : ze[0], Ze = Ne.cache;
        if (Ze.has(Ke))
          return Ze.get(Ke);
        var er = K.apply(this, ze);
        return Ne.cache = Ze.set(Ke, er), er;
      };
      return Ne.cache = new (Kr.Cache || tr)(), Ne;
    }
    Kr.Cache = tr;
    function it(K, ge) {
      return K === ge || K !== K && ge !== ge;
    }
    function at(K) {
      return xt(K) && le.call(K, "callee") && (!We.call(K, "callee") || X.call(K) == b);
    }
    var Tr = Array.isArray;
    function Qr(K) {
      return K != null && Yr(K.length) && !ot(K);
    }
    function xt(K) {
      return Wr(K) && Qr(K);
    }
    function ot(K) {
      var ge = zr(K) ? X.call(K) : "";
      return ge == q || ge == p;
    }
    function Yr(K) {
      return typeof K == "number" && K > -1 && K % 1 == 0 && K <= u;
    }
    function zr(K) {
      var ge = typeof K;
      return !!K && (ge == "object" || ge == "function");
    }
    function Wr(K) {
      return !!K && typeof K == "object";
    }
    function Jr(K) {
      return typeof K == "symbol" || Wr(K) && X.call(K) == F;
    }
    var $t = Re ? qe(Re) : ht;
    function Ft(K) {
      return K == null ? "" : bt(K);
    }
    function Dt(K, ge, Ne) {
      var ze = K == null ? void 0 : Pr(K, ge);
      return ze === void 0 ? Ne : ze;
    }
    function Bt(K, ge) {
      return K != null && At(K, ge, lt);
    }
    function Hr(K) {
      return Qr(K) ? Fr(K) : yt(K);
    }
    function Ct(K) {
      return K;
    }
    function Nt(K) {
      return Mr(K) ? te(Ur(K)) : gt(K);
    }
    t.exports = Ot;
  })(lodash_reduce, lodash_reduce.exports)), lodash_reduce.exports;
}
var uri_all$1 = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
var uri_all = uri_all$1.exports, hasRequiredUri_all;
function requireUri_all() {
  return hasRequiredUri_all || (hasRequiredUri_all = 1, (function(t, e) {
    (function(o, l) {
      l(e);
    })(uri_all, (function(o) {
      function l() {
        for (var ie = arguments.length, oe = Array(ie), ve = 0; ve < ie; ve++)
          oe[ve] = arguments[ve];
        if (oe.length > 1) {
          oe[0] = oe[0].slice(0, -1);
          for (var xe = oe.length - 1, Pe = 1; Pe < xe; ++Pe)
            oe[Pe] = oe[Pe].slice(1, -1);
          return oe[xe] = oe[xe].slice(1), oe.join("");
        } else
          return oe[0];
      }
      function r(ie) {
        return "(?:" + ie + ")";
      }
      function n(ie) {
        return ie === void 0 ? "undefined" : ie === null ? "null" : Object.prototype.toString.call(ie).split(" ").pop().split("]").shift().toLowerCase();
      }
      function f(ie) {
        return ie.toUpperCase();
      }
      function u(ie) {
        return ie != null ? ie instanceof Array ? ie : typeof ie.length != "number" || ie.split || ie.setInterval || ie.call ? [ie] : Array.prototype.slice.call(ie) : [];
      }
      function b(ie, oe) {
        var ve = ie;
        if (oe)
          for (var xe in oe)
            ve[xe] = oe[xe];
        return ve;
      }
      function S(ie) {
        var oe = "[A-Za-z]", ve = "[0-9]", xe = l(ve, "[A-Fa-f]"), Pe = r(r("%[EFef]" + xe + "%" + xe + xe + "%" + xe + xe) + "|" + r("%[89A-Fa-f]" + xe + "%" + xe + xe) + "|" + r("%" + xe + xe)), ke = "[\\:\\/\\?\\#\\[\\]\\@]", Ge = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Qe = l(ke, Ge), Ye = ie ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", nr = ie ? "[\\uE000-\\uF8FF]" : "[]", Je = l(oe, ve, "[\\-\\.\\_\\~]", Ye);
        r(oe + l(oe, ve, "[\\+\\-\\.]") + "*"), r(r(Pe + "|" + l(Je, Ge, "[\\:]")) + "*");
        var rr = r(r("25[0-5]") + "|" + r("2[0-4]" + ve) + "|" + r("1" + ve + ve) + "|" + r("0?[1-9]" + ve) + "|0?0?" + ve), ar = r(rr + "\\." + rr + "\\." + rr + "\\." + rr), Xe = r(xe + "{1,4}"), tr = r(r(Xe + "\\:" + Xe) + "|" + ar), or = r(r(Xe + "\\:") + "{6}" + tr), ir = r("\\:\\:" + r(Xe + "\\:") + "{5}" + tr), wr = r(r(Xe) + "?\\:\\:" + r(Xe + "\\:") + "{4}" + tr), yr = r(r(r(Xe + "\\:") + "{0,1}" + Xe) + "?\\:\\:" + r(Xe + "\\:") + "{3}" + tr), vr = r(r(r(Xe + "\\:") + "{0,2}" + Xe) + "?\\:\\:" + r(Xe + "\\:") + "{2}" + tr), br = r(r(r(Xe + "\\:") + "{0,3}" + Xe) + "?\\:\\:" + Xe + "\\:" + tr), Er = r(r(r(Xe + "\\:") + "{0,4}" + Xe) + "?\\:\\:" + tr), dr = r(r(r(Xe + "\\:") + "{0,5}" + Xe) + "?\\:\\:" + Xe), lr = r(r(r(Xe + "\\:") + "{0,6}" + Xe) + "?\\:\\:"), Sr = r([or, ir, wr, yr, vr, br, Er, dr, lr].join("|")), _r = r(r(Je + "|" + Pe) + "+");
        r("[vV]" + xe + "+\\." + l(Je, Ge, "[\\:]") + "+"), r(r(Pe + "|" + l(Je, Ge)) + "*");
        var Or = r(Pe + "|" + l(Je, Ge, "[\\:\\@]"));
        return r(r(Pe + "|" + l(Je, Ge, "[\\@]")) + "+"), r(r(Or + "|" + l("[\\/\\?]", nr)) + "*"), {
          NOT_SCHEME: new RegExp(l("[^]", oe, ve, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(l("[^\\%\\:]", Je, Ge), "g"),
          NOT_HOST: new RegExp(l("[^\\%\\[\\]\\:]", Je, Ge), "g"),
          NOT_PATH: new RegExp(l("[^\\%\\/\\:\\@]", Je, Ge), "g"),
          NOT_PATH_NOSCHEME: new RegExp(l("[^\\%\\/\\@]", Je, Ge), "g"),
          NOT_QUERY: new RegExp(l("[^\\%]", Je, Ge, "[\\:\\@\\/\\?]", nr), "g"),
          NOT_FRAGMENT: new RegExp(l("[^\\%]", Je, Ge, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(l("[^]", Je, Ge), "g"),
          UNRESERVED: new RegExp(Je, "g"),
          OTHER_CHARS: new RegExp(l("[^\\%]", Je, Qe), "g"),
          PCT_ENCODED: new RegExp(Pe, "g"),
          IPV4ADDRESS: new RegExp("^(" + ar + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + Sr + ")" + r(r("\\%25|\\%(?!" + xe + "{2})") + "(" + _r + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var s = S(!1), v = S(!0), E = /* @__PURE__ */ (function() {
        function ie(oe, ve) {
          var xe = [], Pe = !0, ke = !1, Ge = void 0;
          try {
            for (var Qe = oe[Symbol.iterator](), Ye; !(Pe = (Ye = Qe.next()).done) && (xe.push(Ye.value), !(ve && xe.length === ve)); Pe = !0)
              ;
          } catch (nr) {
            ke = !0, Ge = nr;
          } finally {
            try {
              !Pe && Qe.return && Qe.return();
            } finally {
              if (ke) throw Ge;
            }
          }
          return xe;
        }
        return function(oe, ve) {
          if (Array.isArray(oe))
            return oe;
          if (Symbol.iterator in Object(oe))
            return ie(oe, ve);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
      })(), q = function(ie) {
        if (Array.isArray(ie)) {
          for (var oe = 0, ve = Array(ie.length); oe < ie.length; oe++) ve[oe] = ie[oe];
          return ve;
        } else
          return Array.from(ie);
      }, p = 2147483647, T = 36, d = 1, y = 26, A = 38, w = 700, I = 72, R = 128, F = "-", x = /^xn--/, M = /[^\0-\x7E]/, Q = /[\x2E\u3002\uFF0E\uFF61]/g, C = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, W = T - d, h = Math.floor, $ = String.fromCharCode;
      function ae(ie) {
        throw new RangeError(C[ie]);
      }
      function de(ie, oe) {
        for (var ve = [], xe = ie.length; xe--; )
          ve[xe] = oe(ie[xe]);
        return ve;
      }
      function Ee(ie, oe) {
        var ve = ie.split("@"), xe = "";
        ve.length > 1 && (xe = ve[0] + "@", ie = ve[1]), ie = ie.replace(Q, ".");
        var Pe = ie.split("."), ke = de(Pe, oe).join(".");
        return xe + ke;
      }
      function _e(ie) {
        for (var oe = [], ve = 0, xe = ie.length; ve < xe; ) {
          var Pe = ie.charCodeAt(ve++);
          if (Pe >= 55296 && Pe <= 56319 && ve < xe) {
            var ke = ie.charCodeAt(ve++);
            (ke & 64512) == 56320 ? oe.push(((Pe & 1023) << 10) + (ke & 1023) + 65536) : (oe.push(Pe), ve--);
          } else
            oe.push(Pe);
        }
        return oe;
      }
      var ce = function(oe) {
        return String.fromCodePoint.apply(String, q(oe));
      }, fe = function(oe) {
        return oe - 48 < 10 ? oe - 22 : oe - 65 < 26 ? oe - 65 : oe - 97 < 26 ? oe - 97 : T;
      }, k = function(oe, ve) {
        return oe + 22 + 75 * (oe < 26) - ((ve != 0) << 5);
      }, pe = function(oe, ve, xe) {
        var Pe = 0;
        for (
          oe = xe ? h(oe / w) : oe >> 1, oe += h(oe / ve);
          /* no initialization */
          oe > W * y >> 1;
          Pe += T
        )
          oe = h(oe / W);
        return h(Pe + (W + 1) * oe / (oe + A));
      }, ee = function(oe) {
        var ve = [], xe = oe.length, Pe = 0, ke = R, Ge = I, Qe = oe.lastIndexOf(F);
        Qe < 0 && (Qe = 0);
        for (var Ye = 0; Ye < Qe; ++Ye)
          oe.charCodeAt(Ye) >= 128 && ae("not-basic"), ve.push(oe.charCodeAt(Ye));
        for (var nr = Qe > 0 ? Qe + 1 : 0; nr < xe; ) {
          for (
            var Je = Pe, rr = 1, ar = T;
            ;
            /* no condition */
            ar += T
          ) {
            nr >= xe && ae("invalid-input");
            var Xe = fe(oe.charCodeAt(nr++));
            (Xe >= T || Xe > h((p - Pe) / rr)) && ae("overflow"), Pe += Xe * rr;
            var tr = ar <= Ge ? d : ar >= Ge + y ? y : ar - Ge;
            if (Xe < tr)
              break;
            var or = T - tr;
            rr > h(p / or) && ae("overflow"), rr *= or;
          }
          var ir = ve.length + 1;
          Ge = pe(Pe - Je, ir, Je == 0), h(Pe / ir) > p - ke && ae("overflow"), ke += h(Pe / ir), Pe %= ir, ve.splice(Pe++, 0, ke);
        }
        return String.fromCodePoint.apply(String, ve);
      }, J = function(oe) {
        var ve = [];
        oe = _e(oe);
        var xe = oe.length, Pe = R, ke = 0, Ge = I, Qe = !0, Ye = !1, nr = void 0;
        try {
          for (var Je = oe[Symbol.iterator](), rr; !(Qe = (rr = Je.next()).done); Qe = !0) {
            var ar = rr.value;
            ar < 128 && ve.push($(ar));
          }
        } catch (Pr) {
          Ye = !0, nr = Pr;
        } finally {
          try {
            !Qe && Je.return && Je.return();
          } finally {
            if (Ye)
              throw nr;
          }
        }
        var Xe = ve.length, tr = Xe;
        for (Xe && ve.push(F); tr < xe; ) {
          var or = p, ir = !0, wr = !1, yr = void 0;
          try {
            for (var vr = oe[Symbol.iterator](), br; !(ir = (br = vr.next()).done); ir = !0) {
              var Er = br.value;
              Er >= Pe && Er < or && (or = Er);
            }
          } catch (Pr) {
            wr = !0, yr = Pr;
          } finally {
            try {
              !ir && vr.return && vr.return();
            } finally {
              if (wr)
                throw yr;
            }
          }
          var dr = tr + 1;
          or - Pe > h((p - ke) / dr) && ae("overflow"), ke += (or - Pe) * dr, Pe = or;
          var lr = !0, Sr = !1, _r = void 0;
          try {
            for (var Or = oe[Symbol.iterator](), Cr; !(lr = (Cr = Or.next()).done); lr = !0) {
              var Nr = Cr.value;
              if (Nr < Pe && ++ke > p && ae("overflow"), Nr == Pe) {
                for (
                  var Fr = ke, Rr = T;
                  ;
                  /* no condition */
                  Rr += T
                ) {
                  var Dr = Rr <= Ge ? d : Rr >= Ge + y ? y : Rr - Ge;
                  if (Fr < Dr)
                    break;
                  var Lr = Fr - Dr, jr = T - Dr;
                  ve.push($(k(Dr + Lr % jr, 0))), Fr = h(Lr / jr);
                }
                ve.push($(k(Fr, 0))), Ge = pe(ke, dr, tr == Xe), ke = 0, ++tr;
              }
            }
          } catch (Pr) {
            Sr = !0, _r = Pr;
          } finally {
            try {
              !lr && Or.return && Or.return();
            } finally {
              if (Sr)
                throw _r;
            }
          }
          ++ke, ++Pe;
        }
        return ve.join("");
      }, G = function(oe) {
        return Ee(oe, function(ve) {
          return x.test(ve) ? ee(ve.slice(4).toLowerCase()) : ve;
        });
      }, ue = function(oe) {
        return Ee(oe, function(ve) {
          return M.test(ve) ? "xn--" + J(ve) : ve;
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
          decode: _e,
          encode: ce
        },
        decode: ee,
        encode: J,
        toASCII: ue,
        toUnicode: G
      }, B = {};
      function N(ie) {
        var oe = ie.charCodeAt(0), ve = void 0;
        return oe < 16 ? ve = "%0" + oe.toString(16).toUpperCase() : oe < 128 ? ve = "%" + oe.toString(16).toUpperCase() : oe < 2048 ? ve = "%" + (oe >> 6 | 192).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase() : ve = "%" + (oe >> 12 | 224).toString(16).toUpperCase() + "%" + (oe >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (oe & 63 | 128).toString(16).toUpperCase(), ve;
      }
      function re(ie) {
        for (var oe = "", ve = 0, xe = ie.length; ve < xe; ) {
          var Pe = parseInt(ie.substr(ve + 1, 2), 16);
          if (Pe < 128)
            oe += String.fromCharCode(Pe), ve += 3;
          else if (Pe >= 194 && Pe < 224) {
            if (xe - ve >= 6) {
              var ke = parseInt(ie.substr(ve + 4, 2), 16);
              oe += String.fromCharCode((Pe & 31) << 6 | ke & 63);
            } else
              oe += ie.substr(ve, 6);
            ve += 6;
          } else if (Pe >= 224) {
            if (xe - ve >= 9) {
              var Ge = parseInt(ie.substr(ve + 4, 2), 16), Qe = parseInt(ie.substr(ve + 7, 2), 16);
              oe += String.fromCharCode((Pe & 15) << 12 | (Ge & 63) << 6 | Qe & 63);
            } else
              oe += ie.substr(ve, 9);
            ve += 9;
          } else
            oe += ie.substr(ve, 3), ve += 3;
        }
        return oe;
      }
      function ne(ie, oe) {
        function ve(xe) {
          var Pe = re(xe);
          return Pe.match(oe.UNRESERVED) ? Pe : xe;
        }
        return ie.scheme && (ie.scheme = String(ie.scheme).replace(oe.PCT_ENCODED, ve).toLowerCase().replace(oe.NOT_SCHEME, "")), ie.userinfo !== void 0 && (ie.userinfo = String(ie.userinfo).replace(oe.PCT_ENCODED, ve).replace(oe.NOT_USERINFO, N).replace(oe.PCT_ENCODED, f)), ie.host !== void 0 && (ie.host = String(ie.host).replace(oe.PCT_ENCODED, ve).toLowerCase().replace(oe.NOT_HOST, N).replace(oe.PCT_ENCODED, f)), ie.path !== void 0 && (ie.path = String(ie.path).replace(oe.PCT_ENCODED, ve).replace(ie.scheme ? oe.NOT_PATH : oe.NOT_PATH_NOSCHEME, N).replace(oe.PCT_ENCODED, f)), ie.query !== void 0 && (ie.query = String(ie.query).replace(oe.PCT_ENCODED, ve).replace(oe.NOT_QUERY, N).replace(oe.PCT_ENCODED, f)), ie.fragment !== void 0 && (ie.fragment = String(ie.fragment).replace(oe.PCT_ENCODED, ve).replace(oe.NOT_FRAGMENT, N).replace(oe.PCT_ENCODED, f)), ie;
      }
      function D(ie) {
        return ie.replace(/^0*(.*)/, "$1") || "0";
      }
      function L(ie, oe) {
        var ve = ie.match(oe.IPV4ADDRESS) || [], xe = E(ve, 2), Pe = xe[1];
        return Pe ? Pe.split(".").map(D).join(".") : ie;
      }
      function H(ie, oe) {
        var ve = ie.match(oe.IPV6ADDRESS) || [], xe = E(ve, 3), Pe = xe[1], ke = xe[2];
        if (Pe) {
          for (var Ge = Pe.toLowerCase().split("::").reverse(), Qe = E(Ge, 2), Ye = Qe[0], nr = Qe[1], Je = nr ? nr.split(":").map(D) : [], rr = Ye.split(":").map(D), ar = oe.IPV4ADDRESS.test(rr[rr.length - 1]), Xe = ar ? 7 : 8, tr = rr.length - Xe, or = Array(Xe), ir = 0; ir < Xe; ++ir)
            or[ir] = Je[ir] || rr[tr + ir] || "";
          ar && (or[Xe - 1] = L(or[Xe - 1], oe));
          var wr = or.reduce(function(dr, lr, Sr) {
            if (!lr || lr === "0") {
              var _r = dr[dr.length - 1];
              _r && _r.index + _r.length === Sr ? _r.length++ : dr.push({ index: Sr, length: 1 });
            }
            return dr;
          }, []), yr = wr.sort(function(dr, lr) {
            return lr.length - dr.length;
          })[0], vr = void 0;
          if (yr && yr.length > 1) {
            var br = or.slice(0, yr.index), Er = or.slice(yr.index + yr.length);
            vr = br.join(":") + "::" + Er.join(":");
          } else
            vr = or.join(":");
          return ke && (vr += "%" + ke), vr;
        } else
          return ie;
      }
      var se = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, we = "".match(/(){0}/)[1] === void 0;
      function Re(ie) {
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, ve = {}, xe = oe.iri !== !1 ? v : s;
        oe.reference === "suffix" && (ie = (oe.scheme ? oe.scheme + ":" : "") + "//" + ie);
        var Pe = ie.match(se);
        if (Pe) {
          we ? (ve.scheme = Pe[1], ve.userinfo = Pe[3], ve.host = Pe[4], ve.port = parseInt(Pe[5], 10), ve.path = Pe[6] || "", ve.query = Pe[7], ve.fragment = Pe[8], isNaN(ve.port) && (ve.port = Pe[5])) : (ve.scheme = Pe[1] || void 0, ve.userinfo = ie.indexOf("@") !== -1 ? Pe[3] : void 0, ve.host = ie.indexOf("//") !== -1 ? Pe[4] : void 0, ve.port = parseInt(Pe[5], 10), ve.path = Pe[6] || "", ve.query = ie.indexOf("?") !== -1 ? Pe[7] : void 0, ve.fragment = ie.indexOf("#") !== -1 ? Pe[8] : void 0, isNaN(ve.port) && (ve.port = ie.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? Pe[4] : void 0)), ve.host && (ve.host = H(L(ve.host, xe), xe)), ve.scheme === void 0 && ve.userinfo === void 0 && ve.host === void 0 && ve.port === void 0 && !ve.path && ve.query === void 0 ? ve.reference = "same-document" : ve.scheme === void 0 ? ve.reference = "relative" : ve.fragment === void 0 ? ve.reference = "absolute" : ve.reference = "uri", oe.reference && oe.reference !== "suffix" && oe.reference !== ve.reference && (ve.error = ve.error || "URI is not a " + oe.reference + " reference.");
          var ke = B[(oe.scheme || ve.scheme || "").toLowerCase()];
          if (!oe.unicodeSupport && (!ke || !ke.unicodeSupport)) {
            if (ve.host && (oe.domainHost || ke && ke.domainHost))
              try {
                ve.host = O.toASCII(ve.host.replace(xe.PCT_ENCODED, re).toLowerCase());
              } catch (Ge) {
                ve.error = ve.error || "Host's domain name can not be converted to ASCII via punycode: " + Ge;
              }
            ne(ve, s);
          } else
            ne(ve, xe);
          ke && ke.parse && ke.parse(ve, oe);
        } else
          ve.error = ve.error || "URI can not be parsed.";
        return ve;
      }
      function Ae(ie, oe) {
        var ve = oe.iri !== !1 ? v : s, xe = [];
        return ie.userinfo !== void 0 && (xe.push(ie.userinfo), xe.push("@")), ie.host !== void 0 && xe.push(H(L(String(ie.host), ve), ve).replace(ve.IPV6ADDRESS, function(Pe, ke, Ge) {
          return "[" + ke + (Ge ? "%25" + Ge : "") + "]";
        })), (typeof ie.port == "number" || typeof ie.port == "string") && (xe.push(":"), xe.push(String(ie.port))), xe.length ? xe.join("") : void 0;
      }
      var Oe = /^\.\.?\//, te = /^\/\.(\/|$)/, Fe = /^\/\.\.(\/|$)/, Ce = /^\/?(?:.|\n)*?(?=\/|$)/;
      function qe(ie) {
        for (var oe = []; ie.length; )
          if (ie.match(Oe))
            ie = ie.replace(Oe, "");
          else if (ie.match(te))
            ie = ie.replace(te, "/");
          else if (ie.match(Fe))
            ie = ie.replace(Fe, "/"), oe.pop();
          else if (ie === "." || ie === "..")
            ie = "";
          else {
            var ve = ie.match(Ce);
            if (ve) {
              var xe = ve[0];
              ie = ie.slice(xe.length), oe.push(xe);
            } else
              throw new Error("Unexpected dot segment condition");
          }
        return oe.join("");
      }
      function Ue(ie) {
        var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, ve = oe.iri ? v : s, xe = [], Pe = B[(oe.scheme || ie.scheme || "").toLowerCase()];
        if (Pe && Pe.serialize && Pe.serialize(ie, oe), ie.host && !ve.IPV6ADDRESS.test(ie.host)) {
          if (oe.domainHost || Pe && Pe.domainHost)
            try {
              ie.host = oe.iri ? O.toUnicode(ie.host) : O.toASCII(ie.host.replace(ve.PCT_ENCODED, re).toLowerCase());
            } catch (Qe) {
              ie.error = ie.error || "Host's domain name can not be converted to " + (oe.iri ? "Unicode" : "ASCII") + " via punycode: " + Qe;
            }
        }
        ne(ie, ve), oe.reference !== "suffix" && ie.scheme && (xe.push(ie.scheme), xe.push(":"));
        var ke = Ae(ie, oe);
        if (ke !== void 0 && (oe.reference !== "suffix" && xe.push("//"), xe.push(ke), ie.path && ie.path.charAt(0) !== "/" && xe.push("/")), ie.path !== void 0) {
          var Ge = ie.path;
          !oe.absolutePath && (!Pe || !Pe.absolutePath) && (Ge = qe(Ge)), ke === void 0 && (Ge = Ge.replace(/^\/\//, "/%2F")), xe.push(Ge);
        }
        return ie.query !== void 0 && (xe.push("?"), xe.push(ie.query)), ie.fragment !== void 0 && (xe.push("#"), xe.push(ie.fragment)), xe.join("");
      }
      function me(ie, oe) {
        var ve = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, xe = arguments[3], Pe = {};
        return xe || (ie = Re(Ue(ie, ve), ve), oe = Re(Ue(oe, ve), ve)), ve = ve || {}, !ve.tolerant && oe.scheme ? (Pe.scheme = oe.scheme, Pe.userinfo = oe.userinfo, Pe.host = oe.host, Pe.port = oe.port, Pe.path = qe(oe.path || ""), Pe.query = oe.query) : (oe.userinfo !== void 0 || oe.host !== void 0 || oe.port !== void 0 ? (Pe.userinfo = oe.userinfo, Pe.host = oe.host, Pe.port = oe.port, Pe.path = qe(oe.path || ""), Pe.query = oe.query) : (oe.path ? (oe.path.charAt(0) === "/" ? Pe.path = qe(oe.path) : ((ie.userinfo !== void 0 || ie.host !== void 0 || ie.port !== void 0) && !ie.path ? Pe.path = "/" + oe.path : ie.path ? Pe.path = ie.path.slice(0, ie.path.lastIndexOf("/") + 1) + oe.path : Pe.path = oe.path, Pe.path = qe(Pe.path)), Pe.query = oe.query) : (Pe.path = ie.path, oe.query !== void 0 ? Pe.query = oe.query : Pe.query = ie.query), Pe.userinfo = ie.userinfo, Pe.host = ie.host, Pe.port = ie.port), Pe.scheme = ie.scheme), Pe.fragment = oe.fragment, Pe;
      }
      function Se(ie, oe, ve) {
        var xe = b({ scheme: "null" }, ve);
        return Ue(me(Re(ie, xe), Re(oe, xe), xe, !0), xe);
      }
      function Le(ie, oe) {
        return typeof ie == "string" ? ie = Ue(Re(ie, oe), oe) : n(ie) === "object" && (ie = Re(Ue(ie, oe), oe)), ie;
      }
      function Me(ie, oe, ve) {
        return typeof ie == "string" ? ie = Ue(Re(ie, ve), ve) : n(ie) === "object" && (ie = Ue(ie, ve)), typeof oe == "string" ? oe = Ue(Re(oe, ve), ve) : n(oe) === "object" && (oe = Ue(oe, ve)), ie === oe;
      }
      function je(ie, oe) {
        return ie && ie.toString().replace(!oe || !oe.iri ? s.ESCAPE : v.ESCAPE, N);
      }
      function He(ie, oe) {
        return ie && ie.toString().replace(!oe || !oe.iri ? s.PCT_ENCODED : v.PCT_ENCODED, re);
      }
      var U = {
        scheme: "http",
        domainHost: !0,
        parse: function(oe, ve) {
          return oe.host || (oe.error = oe.error || "HTTP URIs must have a host."), oe;
        },
        serialize: function(oe, ve) {
          var xe = String(oe.scheme).toLowerCase() === "https";
          return (oe.port === (xe ? 443 : 80) || oe.port === "") && (oe.port = void 0), oe.path || (oe.path = "/"), oe;
        }
      }, a = {
        scheme: "https",
        domainHost: U.domainHost,
        parse: U.parse,
        serialize: U.serialize
      };
      function m(ie) {
        return typeof ie.secure == "boolean" ? ie.secure : String(ie.scheme).toLowerCase() === "wss";
      }
      var z = {
        scheme: "ws",
        domainHost: !0,
        parse: function(oe, ve) {
          var xe = oe;
          return xe.secure = m(xe), xe.resourceName = (xe.path || "/") + (xe.query ? "?" + xe.query : ""), xe.path = void 0, xe.query = void 0, xe;
        },
        serialize: function(oe, ve) {
          if ((oe.port === (m(oe) ? 443 : 80) || oe.port === "") && (oe.port = void 0), typeof oe.secure == "boolean" && (oe.scheme = oe.secure ? "wss" : "ws", oe.secure = void 0), oe.resourceName) {
            var xe = oe.resourceName.split("?"), Pe = E(xe, 2), ke = Pe[0], Ge = Pe[1];
            oe.path = ke && ke !== "/" ? ke : void 0, oe.query = Ge, oe.resourceName = void 0;
          }
          return oe.fragment = void 0, oe;
        }
      }, le = {
        scheme: "wss",
        domainHost: z.domainHost,
        parse: z.parse,
        serialize: z.serialize
      }, X = {}, he = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", j = "[0-9A-Fa-f]", Be = r(r("%[EFef]" + j + "%" + j + j + "%" + j + j) + "|" + r("%[89A-Fa-f]" + j + "%" + j + j) + "|" + r("%" + j + j)), We = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", _ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Ie = l(_, '[\\"\\\\]'), De = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", V = new RegExp(he, "g"), be = new RegExp(Be, "g"), $e = new RegExp(l("[^]", We, "[\\.]", '[\\"]', Ie), "g"), Ve = new RegExp(l("[^]", he, De), "g"), Z = Ve;
      function g(ie) {
        var oe = re(ie);
        return oe.match(V) ? oe : ie;
      }
      var c = {
        scheme: "mailto",
        parse: function(oe, ve) {
          var xe = oe, Pe = xe.to = xe.path ? xe.path.split(",") : [];
          if (xe.path = void 0, xe.query) {
            for (var ke = !1, Ge = {}, Qe = xe.query.split("&"), Ye = 0, nr = Qe.length; Ye < nr; ++Ye) {
              var Je = Qe[Ye].split("=");
              switch (Je[0]) {
                case "to":
                  for (var rr = Je[1].split(","), ar = 0, Xe = rr.length; ar < Xe; ++ar)
                    Pe.push(rr[ar]);
                  break;
                case "subject":
                  xe.subject = He(Je[1], ve);
                  break;
                case "body":
                  xe.body = He(Je[1], ve);
                  break;
                default:
                  ke = !0, Ge[He(Je[0], ve)] = He(Je[1], ve);
                  break;
              }
            }
            ke && (xe.headers = Ge);
          }
          xe.query = void 0;
          for (var tr = 0, or = Pe.length; tr < or; ++tr) {
            var ir = Pe[tr].split("@");
            if (ir[0] = He(ir[0]), ve.unicodeSupport)
              ir[1] = He(ir[1], ve).toLowerCase();
            else
              try {
                ir[1] = O.toASCII(He(ir[1], ve).toLowerCase());
              } catch (wr) {
                xe.error = xe.error || "Email address's domain name can not be converted to ASCII via punycode: " + wr;
              }
            Pe[tr] = ir.join("@");
          }
          return xe;
        },
        serialize: function(oe, ve) {
          var xe = oe, Pe = u(oe.to);
          if (Pe) {
            for (var ke = 0, Ge = Pe.length; ke < Ge; ++ke) {
              var Qe = String(Pe[ke]), Ye = Qe.lastIndexOf("@"), nr = Qe.slice(0, Ye).replace(be, g).replace(be, f).replace($e, N), Je = Qe.slice(Ye + 1);
              try {
                Je = ve.iri ? O.toUnicode(Je) : O.toASCII(He(Je, ve).toLowerCase());
              } catch (tr) {
                xe.error = xe.error || "Email address's domain name can not be converted to " + (ve.iri ? "Unicode" : "ASCII") + " via punycode: " + tr;
              }
              Pe[ke] = nr + "@" + Je;
            }
            xe.path = Pe.join(",");
          }
          var rr = oe.headers = oe.headers || {};
          oe.subject && (rr.subject = oe.subject), oe.body && (rr.body = oe.body);
          var ar = [];
          for (var Xe in rr)
            rr[Xe] !== X[Xe] && ar.push(Xe.replace(be, g).replace(be, f).replace(Ve, N) + "=" + rr[Xe].replace(be, g).replace(be, f).replace(Z, N));
          return ar.length && (xe.query = ar.join("&")), xe;
        }
      }, P = /^([^\:]+)\:(.*)/, Y = {
        scheme: "urn",
        parse: function(oe, ve) {
          var xe = oe.path && oe.path.match(P), Pe = oe;
          if (xe) {
            var ke = ve.scheme || Pe.scheme || "urn", Ge = xe[1].toLowerCase(), Qe = xe[2], Ye = ke + ":" + (ve.nid || Ge), nr = B[Ye];
            Pe.nid = Ge, Pe.nss = Qe, Pe.path = void 0, nr && (Pe = nr.parse(Pe, ve));
          } else
            Pe.error = Pe.error || "URN can not be parsed.";
          return Pe;
        },
        serialize: function(oe, ve) {
          var xe = ve.scheme || oe.scheme || "urn", Pe = oe.nid, ke = xe + ":" + (ve.nid || Pe), Ge = B[ke];
          Ge && (oe = Ge.serialize(oe, ve));
          var Qe = oe, Ye = oe.nss;
          return Qe.path = (Pe || ve.nid) + ":" + Ye, Qe;
        }
      }, ye = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, Te = {
        scheme: "urn:uuid",
        parse: function(oe, ve) {
          var xe = oe;
          return xe.uuid = xe.nss, xe.nss = void 0, !ve.tolerant && (!xe.uuid || !xe.uuid.match(ye)) && (xe.error = xe.error || "UUID is not valid."), xe;
        },
        serialize: function(oe, ve) {
          var xe = oe;
          return xe.nss = (oe.uuid || "").toLowerCase(), xe;
        }
      };
      B[U.scheme] = U, B[a.scheme] = a, B[z.scheme] = z, B[le.scheme] = le, B[c.scheme] = c, B[Y.scheme] = Y, B[Te.scheme] = Te, o.SCHEMES = B, o.pctEncChar = N, o.pctDecChars = re, o.parse = Re, o.removeDotSegments = qe, o.serialize = Ue, o.resolveComponents = me, o.resolve = Se, o.normalize = Le, o.equal = Me, o.escapeComponent = je, o.unescapeComponent = He, Object.defineProperty(o, "__esModule", { value: !0 });
    }));
  })(uri_all$1, uri_all$1.exports)), uri_all$1.exports;
}
var fastDeepEqual, hasRequiredFastDeepEqual;
function requireFastDeepEqual() {
  return hasRequiredFastDeepEqual || (hasRequiredFastDeepEqual = 1, fastDeepEqual = function t(e, o) {
    if (e === o) return !0;
    if (e && o && typeof e == "object" && typeof o == "object") {
      if (e.constructor !== o.constructor) return !1;
      var l, r, n;
      if (Array.isArray(e)) {
        if (l = e.length, l != o.length) return !1;
        for (r = l; r-- !== 0; )
          if (!t(e[r], o[r])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === o.source && e.flags === o.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === o.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === o.toString();
      if (n = Object.keys(e), l = n.length, l !== Object.keys(o).length) return !1;
      for (r = l; r-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(o, n[r])) return !1;
      for (r = l; r-- !== 0; ) {
        var f = n[r];
        if (!t(e[f], o[f])) return !1;
      }
      return !0;
    }
    return e !== e && o !== o;
  }), fastDeepEqual;
}
var ucs2length, hasRequiredUcs2length;
function requireUcs2length() {
  return hasRequiredUcs2length || (hasRequiredUcs2length = 1, ucs2length = function(e) {
    for (var o = 0, l = e.length, r = 0, n; r < l; )
      o++, n = e.charCodeAt(r++), n >= 55296 && n <= 56319 && r < l && (n = e.charCodeAt(r), (n & 64512) == 56320 && r++);
    return o;
  }), ucs2length;
}
var util$1, hasRequiredUtil$1;
function requireUtil$1() {
  if (hasRequiredUtil$1) return util$1;
  hasRequiredUtil$1 = 1, util$1 = {
    copy: t,
    checkDataType: e,
    checkDataTypes: o,
    coerceToTypes: r,
    toHash: n,
    getProperty: b,
    escapeQuotes: S,
    equal: requireFastDeepEqual(),
    ucs2length: requireUcs2length(),
    varOccurences: s,
    varReplace: v,
    schemaHasRules: E,
    schemaHasRulesExcept: q,
    schemaUnknownRules: p,
    toQuotedString: T,
    getPathExpr: d,
    getPath: y,
    getData: I,
    unescapeFragment: F,
    unescapeJsonPointer: Q,
    escapeFragment: x,
    escapeJsonPointer: M
  };
  function t(C, W) {
    W = W || {};
    for (var h in C) W[h] = C[h];
    return W;
  }
  function e(C, W, h, $) {
    var ae = $ ? " !== " : " === ", de = $ ? " || " : " && ", Ee = $ ? "!" : "", _e = $ ? "" : "!";
    switch (C) {
      case "null":
        return W + ae + "null";
      case "array":
        return Ee + "Array.isArray(" + W + ")";
      case "object":
        return "(" + Ee + W + de + "typeof " + W + ae + '"object"' + de + _e + "Array.isArray(" + W + "))";
      case "integer":
        return "(typeof " + W + ae + '"number"' + de + _e + "(" + W + " % 1)" + de + W + ae + W + (h ? de + Ee + "isFinite(" + W + ")" : "") + ")";
      case "number":
        return "(typeof " + W + ae + '"' + C + '"' + (h ? de + Ee + "isFinite(" + W + ")" : "") + ")";
      default:
        return "typeof " + W + ae + '"' + C + '"';
    }
  }
  function o(C, W, h) {
    switch (C.length) {
      case 1:
        return e(C[0], W, h, !0);
      default:
        var $ = "", ae = n(C);
        ae.array && ae.object && ($ = ae.null ? "(" : "(!" + W + " || ", $ += "typeof " + W + ' !== "object")', delete ae.null, delete ae.array, delete ae.object), ae.number && delete ae.integer;
        for (var de in ae)
          $ += ($ ? " && " : "") + e(de, W, h, !0);
        return $;
    }
  }
  var l = n(["string", "number", "integer", "boolean", "null"]);
  function r(C, W) {
    if (Array.isArray(W)) {
      for (var h = [], $ = 0; $ < W.length; $++) {
        var ae = W[$];
        (l[ae] || C === "array" && ae === "array") && (h[h.length] = ae);
      }
      if (h.length) return h;
    } else {
      if (l[W])
        return [W];
      if (C === "array" && W === "array")
        return ["array"];
    }
  }
  function n(C) {
    for (var W = {}, h = 0; h < C.length; h++) W[C[h]] = !0;
    return W;
  }
  var f = /^[a-z$_][a-z$_0-9]*$/i, u = /'|\\/g;
  function b(C) {
    return typeof C == "number" ? "[" + C + "]" : f.test(C) ? "." + C : "['" + S(C) + "']";
  }
  function S(C) {
    return C.replace(u, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
  }
  function s(C, W) {
    W += "[^0-9]";
    var h = C.match(new RegExp(W, "g"));
    return h ? h.length : 0;
  }
  function v(C, W, h) {
    return W += "([^0-9])", h = h.replace(/\$/g, "$$$$"), C.replace(new RegExp(W, "g"), h + "$1");
  }
  function E(C, W) {
    if (typeof C == "boolean") return !C;
    for (var h in C) if (W[h]) return !0;
  }
  function q(C, W, h) {
    if (typeof C == "boolean") return !C && h != "not";
    for (var $ in C) if ($ != h && W[$]) return !0;
  }
  function p(C, W) {
    if (typeof C != "boolean") {
      for (var h in C) if (!W[h]) return h;
    }
  }
  function T(C) {
    return "'" + S(C) + "'";
  }
  function d(C, W, h, $) {
    var ae = h ? "'/' + " + W + ($ ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : $ ? "'[' + " + W + " + ']'" : "'[\\'' + " + W + " + '\\']'";
    return R(C, ae);
  }
  function y(C, W, h) {
    var $ = T(h ? "/" + M(W) : b(W));
    return R(C, $);
  }
  var A = /^\/(?:[^~]|~0|~1)*$/, w = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function I(C, W, h) {
    var $, ae, de, Ee;
    if (C === "") return "rootData";
    if (C[0] == "/") {
      if (!A.test(C)) throw new Error("Invalid JSON-pointer: " + C);
      ae = C, de = "rootData";
    } else {
      if (Ee = C.match(w), !Ee) throw new Error("Invalid JSON-pointer: " + C);
      if ($ = +Ee[1], ae = Ee[2], ae == "#") {
        if ($ >= W) throw new Error("Cannot access property/index " + $ + " levels up, current level is " + W);
        return h[W - $];
      }
      if ($ > W) throw new Error("Cannot access data " + $ + " levels up, current level is " + W);
      if (de = "data" + (W - $ || ""), !ae) return de;
    }
    for (var _e = de, ce = ae.split("/"), fe = 0; fe < ce.length; fe++) {
      var k = ce[fe];
      k && (de += b(Q(k)), _e += " && " + de);
    }
    return _e;
  }
  function R(C, W) {
    return C == '""' ? W : (C + " + " + W).replace(/([^\\])' \+ '/g, "$1");
  }
  function F(C) {
    return Q(decodeURIComponent(C));
  }
  function x(C) {
    return encodeURIComponent(M(C));
  }
  function M(C) {
    return C.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function Q(C) {
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
  function e(o) {
    t.copy(o, this);
  }
  return schema_obj;
}
var jsonSchemaTraverse = { exports: {} }, hasRequiredJsonSchemaTraverse;
function requireJsonSchemaTraverse() {
  if (hasRequiredJsonSchemaTraverse) return jsonSchemaTraverse.exports;
  hasRequiredJsonSchemaTraverse = 1;
  var t = jsonSchemaTraverse.exports = function(l, r, n) {
    typeof r == "function" && (n = r, r = {}), n = r.cb || n;
    var f = typeof n == "function" ? n : n.pre || function() {
    }, u = n.post || function() {
    };
    e(r, f, u, l, "", l);
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
  function e(l, r, n, f, u, b, S, s, v, E) {
    if (f && typeof f == "object" && !Array.isArray(f)) {
      r(f, u, b, S, s, v, E);
      for (var q in f) {
        var p = f[q];
        if (Array.isArray(p)) {
          if (q in t.arrayKeywords)
            for (var T = 0; T < p.length; T++)
              e(l, r, n, p[T], u + "/" + q + "/" + T, b, u, q, f, T);
        } else if (q in t.propsKeywords) {
          if (p && typeof p == "object")
            for (var d in p)
              e(l, r, n, p[d], u + "/" + q + "/" + o(d), b, u, q, f, d);
        } else (q in t.keywords || l.allKeys && !(q in t.skipKeywords)) && e(l, r, n, p, u + "/" + q, b, u, q, f);
      }
      n(f, u, b, S, s, v, E);
    }
  }
  function o(l) {
    return l.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return jsonSchemaTraverse.exports;
}
var resolve_1, hasRequiredResolve;
function requireResolve() {
  if (hasRequiredResolve) return resolve_1;
  hasRequiredResolve = 1;
  var t = requireUri_all(), e = requireFastDeepEqual(), o = requireUtil$1(), l = requireSchema_obj(), r = requireJsonSchemaTraverse();
  resolve_1 = n, n.normalizeId = y, n.fullPath = p, n.url = A, n.ids = w, n.inlineRef = v, n.schema = f;
  function n(I, R, F) {
    var x = this._refs[F];
    if (typeof x == "string")
      if (this._refs[x]) x = this._refs[x];
      else return n.call(this, I, R, x);
    if (x = x || this._schemas[F], x instanceof l)
      return v(x.schema, this._opts.inlineRefs) ? x.schema : x.validate || this._compile(x);
    var M = f.call(this, R, F), Q, C, W;
    return M && (Q = M.schema, R = M.root, W = M.baseId), Q instanceof l ? C = Q.validate || I.call(this, Q.schema, R, void 0, W) : Q !== void 0 && (C = v(Q, this._opts.inlineRefs) ? Q : I.call(this, Q, R, void 0, W)), C;
  }
  function f(I, R) {
    var F = t.parse(R), x = T(F), M = p(this._getId(I.schema));
    if (Object.keys(I.schema).length === 0 || x !== M) {
      var Q = y(x), C = this._refs[Q];
      if (typeof C == "string")
        return u.call(this, I, C, F);
      if (C instanceof l)
        C.validate || this._compile(C), I = C;
      else if (C = this._schemas[Q], C instanceof l) {
        if (C.validate || this._compile(C), Q == y(R))
          return { schema: C, root: I, baseId: M };
        I = C;
      } else
        return;
      if (!I.schema) return;
      M = p(this._getId(I.schema));
    }
    return S.call(this, F, M, I.schema, I);
  }
  function u(I, R, F) {
    var x = f.call(this, I, R);
    if (x) {
      var M = x.schema, Q = x.baseId;
      I = x.root;
      var C = this._getId(M);
      return C && (Q = A(Q, C)), S.call(this, F, Q, M, I);
    }
  }
  var b = o.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function S(I, R, F, x) {
    if (I.fragment = I.fragment || "", I.fragment.slice(0, 1) == "/") {
      for (var M = I.fragment.split("/"), Q = 1; Q < M.length; Q++) {
        var C = M[Q];
        if (C) {
          if (C = o.unescapeFragment(C), F = F[C], F === void 0) break;
          var W;
          if (!b[C] && (W = this._getId(F), W && (R = A(R, W)), F.$ref)) {
            var h = A(R, F.$ref), $ = f.call(this, x, h);
            $ && (F = $.schema, x = $.root, R = $.baseId);
          }
        }
      }
      if (F !== void 0 && F !== x.schema)
        return { schema: F, root: x, baseId: R };
    }
  }
  var s = o.toHash([
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
  function v(I, R) {
    if (R === !1) return !1;
    if (R === void 0 || R === !0) return E(I);
    if (R) return q(I) <= R;
  }
  function E(I) {
    var R;
    if (Array.isArray(I)) {
      for (var F = 0; F < I.length; F++)
        if (R = I[F], typeof R == "object" && !E(R)) return !1;
    } else
      for (var x in I)
        if (x == "$ref" || (R = I[x], typeof R == "object" && !E(R))) return !1;
    return !0;
  }
  function q(I) {
    var R = 0, F;
    if (Array.isArray(I)) {
      for (var x = 0; x < I.length; x++)
        if (F = I[x], typeof F == "object" && (R += q(F)), R == 1 / 0) return 1 / 0;
    } else
      for (var M in I) {
        if (M == "$ref") return 1 / 0;
        if (s[M])
          R++;
        else if (F = I[M], typeof F == "object" && (R += q(F) + 1), R == 1 / 0) return 1 / 0;
      }
    return R;
  }
  function p(I, R) {
    R !== !1 && (I = y(I));
    var F = t.parse(I);
    return T(F);
  }
  function T(I) {
    return t.serialize(I).split("#")[0] + "#";
  }
  var d = /#\/?$/;
  function y(I) {
    return I ? I.replace(d, "") : "";
  }
  function A(I, R) {
    return R = y(R), t.resolve(I, R);
  }
  function w(I) {
    var R = y(this._getId(I)), F = { "": R }, x = { "": p(R, !1) }, M = {}, Q = this;
    return r(I, { allKeys: !0 }, function(C, W, h, $, ae, de, Ee) {
      if (W !== "") {
        var _e = Q._getId(C), ce = F[$], fe = x[$] + "/" + ae;
        if (Ee !== void 0 && (fe += "/" + (typeof Ee == "number" ? Ee : o.escapeFragment(Ee))), typeof _e == "string") {
          _e = ce = y(ce ? t.resolve(ce, _e) : _e);
          var k = Q._refs[_e];
          if (typeof k == "string" && (k = Q._refs[k]), k && k.schema) {
            if (!e(C, k.schema))
              throw new Error('id "' + _e + '" resolves to more than one schema');
          } else if (_e != y(fe))
            if (_e[0] == "#") {
              if (M[_e] && !e(C, M[_e]))
                throw new Error('id "' + _e + '" resolves to more than one schema');
              M[_e] = C;
            } else
              Q._refs[_e] = fe;
        }
        F[W] = ce, x[W] = fe;
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
    Validation: l(e),
    MissingRef: l(o)
  };
  function e(r) {
    this.message = "validation failed", this.errors = r, this.ajv = this.validation = !0;
  }
  o.message = function(r, n) {
    return "can't resolve reference " + n + " from id " + r;
  };
  function o(r, n, f) {
    this.message = f || o.message(r, n), this.missingRef = t.url(r, n), this.missingSchema = t.normalizeId(t.fullPath(this.missingRef));
  }
  function l(r) {
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
  }
  return error_classes;
}
var fastJsonStableStringify, hasRequiredFastJsonStableStringify;
function requireFastJsonStableStringify() {
  return hasRequiredFastJsonStableStringify || (hasRequiredFastJsonStableStringify = 1, fastJsonStableStringify = function(t, e) {
    e || (e = {}), typeof e == "function" && (e = { cmp: e });
    var o = typeof e.cycles == "boolean" ? e.cycles : !1, l = e.cmp && /* @__PURE__ */ (function(n) {
      return function(f) {
        return function(u, b) {
          var S = { key: u, value: f[u] }, s = { key: b, value: f[b] };
          return n(S, s);
        };
      };
    })(e.cmp), r = [];
    return (function n(f) {
      if (f && f.toJSON && typeof f.toJSON == "function" && (f = f.toJSON()), f !== void 0) {
        if (typeof f == "number") return isFinite(f) ? "" + f : "null";
        if (typeof f != "object") return JSON.stringify(f);
        var u, b;
        if (Array.isArray(f)) {
          for (b = "[", u = 0; u < f.length; u++)
            u && (b += ","), b += n(f[u]) || "null";
          return b + "]";
        }
        if (f === null) return "null";
        if (r.indexOf(f) !== -1) {
          if (o) return JSON.stringify("__cycle__");
          throw new TypeError("Converting circular structure to JSON");
        }
        var S = r.push(f) - 1, s = Object.keys(f).sort(l && l(f));
        for (b = "", u = 0; u < s.length; u++) {
          var v = s[u], E = n(f[v]);
          E && (b && (b += ","), b += JSON.stringify(v) + ":" + E);
        }
        return r.splice(S, 1), "{" + b + "}";
      }
    })(t);
  }), fastJsonStableStringify;
}
var validate, hasRequiredValidate;
function requireValidate() {
  return hasRequiredValidate || (hasRequiredValidate = 1, validate = function(e, o, l) {
    var r = "", n = e.schema.$async === !0, f = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), u = e.self._getId(e.schema);
    if (e.opts.strictKeywords) {
      var b = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
      if (b) {
        var S = "unknown keyword: " + b;
        if (e.opts.strictKeywords === "log") e.logger.warn(S);
        else throw new Error(S);
      }
    }
    if (e.isTop && (r += " var validate = ", n && (e.async = !0, r += "async "), r += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", u && (e.opts.sourceCode || e.opts.processCode) && (r += " " + ("/*# sourceURL=" + u + " */") + " ")), typeof e.schema == "boolean" || !(f || e.schema.$ref)) {
      var o = "false schema", s = e.level, v = e.dataLevel, E = e.schema[o], q = e.schemaPath + e.util.getProperty(o), p = e.errSchemaPath + "/" + o, R = !e.opts.allErrors, M, T = "data" + (v || ""), I = "valid" + s;
      if (e.schema === !1) {
        e.isTop ? R = !0 : r += " var " + I + " = false; ";
        var d = d || [];
        d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'boolean schema is false' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + T + " "), r += " } ") : r += " {} ";
        var y = r;
        r = d.pop(), !e.compositeRule && R ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else
        e.isTop ? n ? r += " return data; " : r += " validate.errors = null; return true; " : r += " var " + I + " = true; ";
      return e.isTop && (r += " }; return validate; "), r;
    }
    if (e.isTop) {
      var A = e.isTop, s = e.level = 0, v = e.dataLevel = 0, T = "data";
      if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
        var w = "default is ignored in the schema root";
        if (e.opts.strictDefaults === "log") e.logger.warn(w);
        else throw new Error(w);
      }
      r += " var vErrors = null; ", r += " var errors = 0;     ", r += " if (rootData === undefined) rootData = data; ";
    } else {
      var s = e.level, v = e.dataLevel, T = "data" + (v || "");
      if (u && (e.baseId = e.resolve.url(e.baseId, u)), n && !e.async) throw new Error("async schema in sync schema");
      r += " var errs_" + s + " = errors;";
    }
    var I = "valid" + s, R = !e.opts.allErrors, F = "", x = "", M, Q = e.schema.type, C = Array.isArray(Q);
    if (Q && e.opts.nullable && e.schema.nullable === !0 && (C ? Q.indexOf("null") == -1 && (Q = Q.concat("null")) : Q != "null" && (Q = [Q, "null"], C = !0)), C && Q.length == 1 && (Q = Q[0], C = !1), e.schema.$ref && f) {
      if (e.opts.extendRefs == "fail")
        throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
      e.opts.extendRefs !== !0 && (f = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
    }
    if (e.schema.$comment && e.opts.$comment && (r += " " + e.RULES.all.$comment.code(e, "$comment")), Q) {
      if (e.opts.coerceTypes)
        var W = e.util.coerceToTypes(e.opts.coerceTypes, Q);
      var h = e.RULES.types[Q];
      if (W || C || h === !0 || h && !te(h)) {
        var q = e.schemaPath + ".type", p = e.errSchemaPath + "/type", q = e.schemaPath + ".type", p = e.errSchemaPath + "/type", $ = C ? "checkDataTypes" : "checkDataType";
        if (r += " if (" + e.util[$](Q, T, e.opts.strictNumbers, !0) + ") { ", W) {
          var ae = "dataType" + s, de = "coerced" + s;
          r += " var " + ae + " = typeof " + T + "; var " + de + " = undefined; ", e.opts.coerceTypes == "array" && (r += " if (" + ae + " == 'object' && Array.isArray(" + T + ") && " + T + ".length == 1) { " + T + " = " + T + "[0]; " + ae + " = typeof " + T + "; if (" + e.util.checkDataType(e.schema.type, T, e.opts.strictNumbers) + ") " + de + " = " + T + "; } "), r += " if (" + de + " !== undefined) ; ";
          var Ee = W;
          if (Ee)
            for (var _e, ce = -1, fe = Ee.length - 1; ce < fe; )
              _e = Ee[ce += 1], _e == "string" ? r += " else if (" + ae + " == 'number' || " + ae + " == 'boolean') " + de + " = '' + " + T + "; else if (" + T + " === null) " + de + " = ''; " : _e == "number" || _e == "integer" ? (r += " else if (" + ae + " == 'boolean' || " + T + " === null || (" + ae + " == 'string' && " + T + " && " + T + " == +" + T + " ", _e == "integer" && (r += " && !(" + T + " % 1)"), r += ")) " + de + " = +" + T + "; ") : _e == "boolean" ? r += " else if (" + T + " === 'false' || " + T + " === 0 || " + T + " === null) " + de + " = false; else if (" + T + " === 'true' || " + T + " === 1) " + de + " = true; " : _e == "null" ? r += " else if (" + T + " === '' || " + T + " === 0 || " + T + " === false) " + de + " = null; " : e.opts.coerceTypes == "array" && _e == "array" && (r += " else if (" + ae + " == 'string' || " + ae + " == 'number' || " + ae + " == 'boolean' || " + T + " == null) " + de + " = [" + T + "]; ");
          r += " else {   ";
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + Q.join(",") : r += "" + Q, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + Q.join(",") : r += "" + Q, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + q + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + T + " "), r += " } ") : r += " {} ";
          var y = r;
          r = d.pop(), !e.compositeRule && R ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } if (" + de + " !== undefined) {  ";
          var k = v ? "data" + (v - 1 || "") : "parentData", pe = v ? e.dataPathArr[v] : "parentDataProperty";
          r += " " + T + " = " + de + "; ", v || (r += "if (" + k + " !== undefined)"), r += " " + k + "[" + pe + "] = " + de + "; } ";
        } else {
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + Q.join(",") : r += "" + Q, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + Q.join(",") : r += "" + Q, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + q + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + T + " "), r += " } ") : r += " {} ";
          var y = r;
          r = d.pop(), !e.compositeRule && R ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        r += " } ";
      }
    }
    if (e.schema.$ref && !f)
      r += " " + e.RULES.all.$ref.code(e, "$ref") + " ", R && (r += " } if (errors === ", A ? r += "0" : r += "errs_" + s, r += ") { ", x += "}");
    else {
      var ee = e.RULES;
      if (ee) {
        for (var h, J = -1, G = ee.length - 1; J < G; )
          if (h = ee[J += 1], te(h)) {
            if (h.type && (r += " if (" + e.util.checkDataType(h.type, T, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
              if (h.type == "object" && e.schema.properties) {
                var E = e.schema.properties, ue = Object.keys(E), O = ue;
                if (O)
                  for (var B, N = -1, re = O.length - 1; N < re; ) {
                    B = O[N += 1];
                    var ne = E[B];
                    if (ne.default !== void 0) {
                      var D = T + e.util.getProperty(B);
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var w = "default is ignored for: " + D;
                          if (e.opts.strictDefaults === "log") e.logger.warn(w);
                          else throw new Error(w);
                        }
                      } else
                        r += " if (" + D + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + D + " === null || " + D + " === '' "), r += " ) " + D + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(ne.default) + " " : r += " " + JSON.stringify(ne.default) + " ", r += "; ";
                    }
                  }
              } else if (h.type == "array" && Array.isArray(e.schema.items)) {
                var L = e.schema.items;
                if (L) {
                  for (var ne, ce = -1, H = L.length - 1; ce < H; )
                    if (ne = L[ce += 1], ne.default !== void 0) {
                      var D = T + "[" + ce + "]";
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var w = "default is ignored for: " + D;
                          if (e.opts.strictDefaults === "log") e.logger.warn(w);
                          else throw new Error(w);
                        }
                      } else
                        r += " if (" + D + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + D + " === null || " + D + " === '' "), r += " ) " + D + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(ne.default) + " " : r += " " + JSON.stringify(ne.default) + " ", r += "; ";
                    }
                }
              }
            }
            var se = h.rules;
            if (se) {
              for (var we, Re = -1, Ae = se.length - 1; Re < Ae; )
                if (we = se[Re += 1], Fe(we)) {
                  var Oe = we.code(e, we.keyword, h.type);
                  Oe && (r += " " + Oe + " ", R && (F += "}"));
                }
            }
            if (R && (r += " " + F + " ", F = ""), h.type && (r += " } ", Q && Q === h.type && !W)) {
              r += " else { ";
              var q = e.schemaPath + ".type", p = e.errSchemaPath + "/type", d = d || [];
              d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (M || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(p) + " , params: { type: '", C ? r += "" + Q.join(",") : r += "" + Q, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", C ? r += "" + Q.join(",") : r += "" + Q, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + q + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + T + " "), r += " } ") : r += " {} ";
              var y = r;
              r = d.pop(), !e.compositeRule && R ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ";
            }
            R && (r += " if (errors === ", A ? r += "0" : r += "errs_" + s, r += ") { ", x += "}");
          }
      }
    }
    R && (r += " " + x + " "), A ? (n ? (r += " if (errors === 0) return data;           ", r += " else throw new ValidationError(vErrors); ") : (r += " validate.errors = vErrors; ", r += " return errors === 0;       "), r += " }; return validate;") : r += " var " + I + " = errors === errs_" + s + ";";
    function te(qe) {
      for (var Ue = qe.rules, me = 0; me < Ue.length; me++)
        if (Fe(Ue[me])) return !0;
    }
    function Fe(qe) {
      return e.schema[qe.keyword] !== void 0 || qe.implements && Ce(qe);
    }
    function Ce(qe) {
      for (var Ue = qe.implements, me = 0; me < Ue.length; me++)
        if (e.schema[Ue[me]] !== void 0) return !0;
    }
    return r;
  }), validate;
}
var compile_1, hasRequiredCompile;
function requireCompile() {
  if (hasRequiredCompile) return compile_1;
  hasRequiredCompile = 1;
  var t = requireResolve(), e = requireUtil$1(), o = requireError_classes(), l = requireFastJsonStableStringify(), r = requireValidate(), n = e.ucs2length, f = requireFastDeepEqual(), u = o.Validation;
  compile_1 = b;
  function b(d, y, A, w) {
    var I = this, R = this._opts, F = [void 0], x = {}, M = [], Q = {}, C = [], W = {}, h = [];
    function $(ne, D) {
      var L = R.regExp ? "regExp" : "new RegExp";
      return "var pattern" + ne + " = " + L + "(" + e.toQuotedString(D[ne]) + ");";
    }
    y = y || { schema: d, refVal: F, refs: x };
    var ae = S.call(this, d, y, w), de = this._compilations[ae.index];
    if (ae.compiling) return de.callValidate = k;
    var Ee = this._formats, _e = this.RULES;
    try {
      var ce = pe(d, y, A, w);
      de.validate = ce;
      var fe = de.callValidate;
      return fe && (fe.schema = ce.schema, fe.errors = null, fe.refs = ce.refs, fe.refVal = ce.refVal, fe.root = ce.root, fe.$async = ce.$async, R.sourceCode && (fe.source = ce.source)), ce;
    } finally {
      s.call(this, d, y, w);
    }
    function k() {
      var ne = de.validate, D = ne.apply(this, arguments);
      return k.errors = ne.errors, D;
    }
    function pe(ne, D, L, H) {
      var se = !D || D && D.schema == ne;
      if (D.schema != y.schema)
        return b.call(I, ne, D, L, H);
      var we = ne.$async === !0, Re = r({
        isTop: !0,
        schema: ne,
        isRoot: se,
        baseId: H,
        root: D,
        schemaPath: "",
        errSchemaPath: "#",
        errorPath: '""',
        MissingRefError: o.MissingRef,
        RULES: _e,
        validate: r,
        util: e,
        resolve: t,
        resolveRef: ee,
        usePattern: B,
        useDefault: N,
        useCustomRule: re,
        opts: R,
        formats: Ee,
        logger: I.logger,
        self: I
      });
      Re = T(F, q) + T(M, $) + T(C, E) + T(h, p) + Re, R.processCode && (Re = R.processCode(Re, ne));
      var Ae;
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
        Ae = Oe(
          I,
          _e,
          Ee,
          y,
          F,
          C,
          h,
          f,
          n,
          u,
          R.regExp
        ), F[0] = Ae;
      } catch (te) {
        throw I.logger.error("Error compiling schema, function code:", Re), te;
      }
      return Ae.schema = ne, Ae.errors = null, Ae.refs = x, Ae.refVal = F, Ae.root = se ? Ae : D, we && (Ae.$async = !0), R.sourceCode === !0 && (Ae.source = {
        code: Re,
        patterns: M,
        defaults: C
      }), Ae;
    }
    function ee(ne, D, L) {
      D = t.url(ne, D);
      var H = x[D], se, we;
      if (H !== void 0)
        return se = F[H], we = "refVal[" + H + "]", O(se, we);
      if (!L && y.refs) {
        var Re = y.refs[D];
        if (Re !== void 0)
          return se = y.refVal[Re], we = J(D, se), O(se, we);
      }
      we = J(D);
      var Ae = t.call(I, pe, y, D);
      if (Ae === void 0) {
        var Oe = A && A[D];
        Oe && (Ae = t.inlineRef(Oe, R.inlineRefs) ? Oe : b.call(I, Oe, y, A, ne));
      }
      if (Ae === void 0)
        G(D);
      else
        return ue(D, Ae), O(Ae, we);
    }
    function J(ne, D) {
      var L = F.length;
      return F[L] = D, x[ne] = L, "refVal" + L;
    }
    function G(ne) {
      delete x[ne];
    }
    function ue(ne, D) {
      var L = x[ne];
      F[L] = D;
    }
    function O(ne, D) {
      return typeof ne == "object" || typeof ne == "boolean" ? { code: D, schema: ne, inline: !0 } : { code: D, $async: ne && !!ne.$async };
    }
    function B(ne) {
      var D = Q[ne];
      return D === void 0 && (D = Q[ne] = M.length, M[D] = ne), "pattern" + D;
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
          var D = l(ne), L = W[D];
          return L === void 0 && (L = W[D] = C.length, C[L] = ne), "default" + L;
      }
    }
    function re(ne, D, L, H) {
      if (I._opts.validateSchema !== !1) {
        var se = ne.definition.dependencies;
        if (se && !se.every(function(Ue) {
          return Object.prototype.hasOwnProperty.call(L, Ue);
        }))
          throw new Error("parent schema must have all required keywords: " + se.join(","));
        var we = ne.definition.validateSchema;
        if (we) {
          var Re = we(D);
          if (!Re) {
            var Ae = "keyword schema is invalid: " + I.errorsText(we.errors);
            if (I._opts.validateSchema == "log") I.logger.error(Ae);
            else throw new Error(Ae);
          }
        }
      }
      var Oe = ne.definition.compile, te = ne.definition.inline, Fe = ne.definition.macro, Ce;
      if (Oe)
        Ce = Oe.call(I, D, L, H);
      else if (Fe)
        Ce = Fe.call(I, D, L, H), R.validateSchema !== !1 && I.validateSchema(Ce, !0);
      else if (te)
        Ce = te.call(I, H, ne.keyword, D, L);
      else if (Ce = ne.definition.validate, !Ce) return;
      if (Ce === void 0)
        throw new Error('custom keyword "' + ne.keyword + '"failed to compile');
      var qe = h.length;
      return h[qe] = Ce, {
        code: "customRule" + qe,
        validate: Ce
      };
    }
  }
  function S(d, y, A) {
    var w = v.call(this, d, y, A);
    return w >= 0 ? { index: w, compiling: !0 } : (w = this._compilations.length, this._compilations[w] = {
      schema: d,
      root: y,
      baseId: A
    }, { index: w, compiling: !1 });
  }
  function s(d, y, A) {
    var w = v.call(this, d, y, A);
    w >= 0 && this._compilations.splice(w, 1);
  }
  function v(d, y, A) {
    for (var w = 0; w < this._compilations.length; w++) {
      var I = this._compilations[w];
      if (I.schema == d && I.root == y && I.baseId == A) return w;
    }
    return -1;
  }
  function E(d) {
    return "var default" + d + " = defaults[" + d + "];";
  }
  function q(d, y) {
    return y[d] === void 0 ? "" : "var refVal" + d + " = refVal[" + d + "];";
  }
  function p(d) {
    return "var customRule" + d + " = customRules[" + d + "];";
  }
  function T(d, y) {
    if (!d.length) return "";
    for (var A = "", w = 0; w < d.length; w++)
      A += y(w, d);
    return A;
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
  return t.prototype.put = function(o, l) {
    this._cache[o] = l;
  }, t.prototype.get = function(o) {
    return this._cache[o];
  }, t.prototype.del = function(o) {
    delete this._cache[o];
  }, t.prototype.clear = function() {
    this._cache = {};
  }, cache.exports;
}
var formats_1, hasRequiredFormats;
function requireFormats() {
  if (hasRequiredFormats) return formats_1;
  hasRequiredFormats = 1;
  var t = requireUtil$1(), e = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, o = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], l = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, r = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, n = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, f = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, u = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, b = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, S = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, s = /^(?:\/(?:[^~/]|~0|~1)*)*$/, v = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, E = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
  formats_1 = q;
  function q(x) {
    return x = x == "full" ? "full" : "fast", t.copy(q[x]);
  }
  q.fast = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
    "date-time": /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    "uri-template": u,
    url: b,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    hostname: r,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: F,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: S,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": s,
    "json-pointer-uri-fragment": v,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": E
  }, q.full = {
    date: T,
    time: d,
    "date-time": A,
    uri: I,
    "uri-reference": f,
    "uri-template": u,
    url: b,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: r,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: F,
    uuid: S,
    "json-pointer": s,
    "json-pointer-uri-fragment": v,
    "relative-json-pointer": E
  };
  function p(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  function T(x) {
    var M = x.match(e);
    if (!M) return !1;
    var Q = +M[1], C = +M[2], W = +M[3];
    return C >= 1 && C <= 12 && W >= 1 && W <= (C == 2 && p(Q) ? 29 : o[C]);
  }
  function d(x, M) {
    var Q = x.match(l);
    if (!Q) return !1;
    var C = Q[1], W = Q[2], h = Q[3], $ = Q[5];
    return (C <= 23 && W <= 59 && h <= 59 || C == 23 && W == 59 && h == 60) && (!M || $);
  }
  var y = /t|\s/i;
  function A(x) {
    var M = x.split(y);
    return M.length == 2 && T(M[0]) && d(M[1], !0);
  }
  var w = /\/|:/;
  function I(x) {
    return w.test(x) && n.test(x);
  }
  var R = /[^\\]\\Z/;
  function F(x) {
    if (R.test(x)) return !1;
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
  return hasRequiredRef || (hasRequiredRef = 1, ref = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.errSchemaPath + "/" + o, S = !e.opts.allErrors, s = "data" + (f || ""), v = "valid" + n, E, q;
    if (u == "#" || u == "#/")
      e.isRoot ? (E = e.async, q = "validate") : (E = e.root.schema.$async === !0, q = "root.refVal[0]");
    else {
      var p = e.resolveRef(e.baseId, u, e.isRoot);
      if (p === void 0) {
        var T = e.MissingRefError.message(e.baseId, u);
        if (e.opts.missingRefs == "fail") {
          e.logger.error(T);
          var d = d || [];
          d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(b) + " , params: { ref: '" + e.util.escapeQuotes(u) + "' } ", e.opts.messages !== !1 && (r += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(u) + "' "), e.opts.verbose && (r += " , schema: " + e.util.toQuotedString(u) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + s + " "), r += " } ") : r += " {} ";
          var y = r;
          r = d.pop(), !e.compositeRule && S ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", S && (r += " if (false) { ");
        } else if (e.opts.missingRefs == "ignore")
          e.logger.warn(T), S && (r += " if (true) { ");
        else
          throw new e.MissingRefError(e.baseId, u, T);
      } else if (p.inline) {
        var A = e.util.copy(e);
        A.level++;
        var w = "valid" + A.level;
        A.schema = p.schema, A.schemaPath = "", A.errSchemaPath = u;
        var I = e.validate(A).replace(/validate\.schema/g, p.code);
        r += " " + I + " ", S && (r += " if (" + w + ") { ");
      } else
        E = p.$async === !0 || e.async && p.$async !== !1, q = p.code;
    }
    if (q) {
      var d = d || [];
      d.push(r), r = "", e.opts.passContext ? r += " " + q + ".call(this, " : r += " " + q + "( ", r += " " + s + ", (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var R = f ? "data" + (f - 1 || "") : "parentData", F = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + R + " , " + F + ", rootData)  ";
      var x = r;
      if (r = d.pop(), E) {
        if (!e.async) throw new Error("async schema referenced by sync schema");
        S && (r += " var " + v + "; "), r += " try { await " + x + "; ", S && (r += " " + v + " = true; "), r += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", S && (r += " " + v + " = false; "), r += " } ", S && (r += " if (" + v + ") { ");
      } else
        r += " if (!" + x + ") { if (vErrors === null) vErrors = " + q + ".errors; else vErrors = vErrors.concat(" + q + ".errors); errors = vErrors.length; } ", S && (r += " else { ");
    }
    return r;
  }), ref;
}
var allOf, hasRequiredAllOf;
function requireAllOf() {
  return hasRequiredAllOf || (hasRequiredAllOf = 1, allOf = function(e, o, l) {
    var r = " ", n = e.schema[o], f = e.schemaPath + e.util.getProperty(o), u = e.errSchemaPath + "/" + o, b = !e.opts.allErrors, S = e.util.copy(e), s = "";
    S.level++;
    var v = "valid" + S.level, E = S.baseId, q = !0, p = n;
    if (p)
      for (var T, d = -1, y = p.length - 1; d < y; )
        T = p[d += 1], (e.opts.strictKeywords ? typeof T == "object" && Object.keys(T).length > 0 || T === !1 : e.util.schemaHasRules(T, e.RULES.all)) && (q = !1, S.schema = T, S.schemaPath = f + "[" + d + "]", S.errSchemaPath = u + "/" + d, r += "  " + e.validate(S) + " ", S.baseId = E, b && (r += " if (" + v + ") { ", s += "}"));
    return b && (q ? r += " if (true) { " : r += " " + s.slice(0, -1) + " "), r;
  }), allOf;
}
var anyOf, hasRequiredAnyOf;
function requireAnyOf() {
  return hasRequiredAnyOf || (hasRequiredAnyOf = 1, anyOf = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = "errs__" + n, p = e.util.copy(e), T = "";
    p.level++;
    var d = "valid" + p.level, y = u.every(function(M) {
      return e.opts.strictKeywords ? typeof M == "object" && Object.keys(M).length > 0 || M === !1 : e.util.schemaHasRules(M, e.RULES.all);
    });
    if (y) {
      var A = p.baseId;
      r += " var " + q + " = errors; var " + E + " = false;  ";
      var w = e.compositeRule;
      e.compositeRule = p.compositeRule = !0;
      var I = u;
      if (I)
        for (var R, F = -1, x = I.length - 1; F < x; )
          R = I[F += 1], p.schema = R, p.schemaPath = b + "[" + F + "]", p.errSchemaPath = S + "/" + F, r += "  " + e.validate(p) + " ", p.baseId = A, r += " " + E + " = " + E + " || " + d + "; if (!" + E + ") { ", T += "}";
      e.compositeRule = p.compositeRule = w, r += " " + T + " if (!" + E + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && s && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " } else {  errors = " + q + "; if (vErrors !== null) { if (" + q + ") vErrors.length = " + q + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      s && (r += " if (true) { ");
    return r;
  }), anyOf;
}
var comment, hasRequiredComment;
function requireComment() {
  return hasRequiredComment || (hasRequiredComment = 1, comment = function(e, o, l) {
    var r = " ", n = e.schema[o], f = e.errSchemaPath + "/" + o;
    e.opts.allErrors;
    var u = e.util.toQuotedString(n);
    return e.opts.$comment === !0 ? r += " console.log(" + u + ");" : typeof e.opts.$comment == "function" && (r += " self._opts.$comment(" + u + ", " + e.util.toQuotedString(f) + ", validate.root.schema);"), r;
  }), comment;
}
var _const, hasRequired_const;
function require_const() {
  return hasRequired_const || (hasRequired_const = 1, _const = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = e.opts.$data && u && u.$data;
    q && (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; "), q || (r += " var schema" + n + " = validate.schema" + b + ";"), r += "var " + E + " = equal(" + v + ", schema" + n + "); if (!" + E + ") {   ";
    var p = p || [];
    p.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { allowedValue: schema" + n + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to constant' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var T = r;
    return r = p.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + T + "]); " : r += " validate.errors = [" + T + "]; return false; " : r += " var err = " + T + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", s && (r += " else { "), r;
  }), _const;
}
var contains, hasRequiredContains;
function requireContains() {
  return hasRequiredContains || (hasRequiredContains = 1, contains = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = "errs__" + n, p = e.util.copy(e), T = "";
    p.level++;
    var d = "valid" + p.level, y = "i" + n, A = p.dataLevel = e.dataLevel + 1, w = "data" + A, I = e.baseId, R = e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all);
    if (r += "var " + q + " = errors;var " + E + ";", R) {
      var F = e.compositeRule;
      e.compositeRule = p.compositeRule = !0, p.schema = u, p.schemaPath = b, p.errSchemaPath = S, r += " var " + d + " = false; for (var " + y + " = 0; " + y + " < " + v + ".length; " + y + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
      var x = v + "[" + y + "]";
      p.dataPathArr[A] = y;
      var M = e.validate(p);
      p.baseId = I, e.util.varOccurences(M, w) < 2 ? r += " " + e.util.varReplace(M, w, x) + " " : r += " var " + w + " = " + x + "; " + M + " ", r += " if (" + d + ") break; }  ", e.compositeRule = p.compositeRule = F, r += " " + T + " if (!" + d + ") {";
    } else
      r += " if (" + v + ".length == 0) {";
    var Q = Q || [];
    Q.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should contain a valid item' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var C = r;
    return r = Q.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + C + "]); " : r += " validate.errors = [" + C + "]; return false; " : r += " var err = " + C + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ", R && (r += "  errors = " + q + "; if (vErrors !== null) { if (" + q + ") vErrors.length = " + q + "; else vErrors = null; } "), e.opts.allErrors && (r += " } "), r;
  }), contains;
}
var dependencies, hasRequiredDependencies;
function requireDependencies() {
  return hasRequiredDependencies || (hasRequiredDependencies = 1, dependencies = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "errs__" + n, q = e.util.copy(e), p = "";
    q.level++;
    var T = "valid" + q.level, d = {}, y = {}, A = e.opts.ownProperties;
    for (F in u)
      if (F != "__proto__") {
        var w = u[F], I = Array.isArray(w) ? y : d;
        I[F] = w;
      }
    r += "var " + E + " = errors;";
    var R = e.errorPath;
    r += "var missing" + n + ";";
    for (var F in y)
      if (I = y[F], I.length) {
        if (r += " if ( " + v + e.util.getProperty(F) + " !== undefined ", A && (r += " && Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(F) + "') "), s) {
          r += " && ( ";
          var x = I;
          if (x)
            for (var M, Q = -1, C = x.length - 1; Q < C; ) {
              M = x[Q += 1], Q && (r += " || ");
              var W = e.util.getProperty(M), h = v + W;
              r += " ( ( " + h + " === undefined ", A && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(M) + "') "), r += ") && (missing" + n + " = " + e.util.toQuotedString(e.opts.jsonPointers ? M : W) + ") ) ";
            }
          r += ")) {  ";
          var $ = "missing" + n, ae = "' + " + $ + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(R, $, !0) : R + " + " + $);
          var de = de || [];
          de.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { property: '" + e.util.escapeQuotes(F) + "', missingProperty: '" + ae + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes(F) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var Ee = r;
          r = de.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + Ee + "]); " : r += " validate.errors = [" + Ee + "]; return false; " : r += " var err = " + Ee + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        } else {
          r += " ) { ";
          var _e = I;
          if (_e)
            for (var M, ce = -1, fe = _e.length - 1; ce < fe; ) {
              M = _e[ce += 1];
              var W = e.util.getProperty(M), ae = e.util.escapeQuotes(M), h = v + W;
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(R, M, e.opts.jsonPointers)), r += " if ( " + h + " === undefined ", A && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(M) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { property: '" + e.util.escapeQuotes(F) + "', missingProperty: '" + ae + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes(F) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
            }
        }
        r += " }   ", s && (p += "}", r += " else { ");
      }
    e.errorPath = R;
    var k = q.baseId;
    for (var F in d) {
      var w = d[F];
      (e.opts.strictKeywords ? typeof w == "object" && Object.keys(w).length > 0 || w === !1 : e.util.schemaHasRules(w, e.RULES.all)) && (r += " " + T + " = true; if ( " + v + e.util.getProperty(F) + " !== undefined ", A && (r += " && Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(F) + "') "), r += ") { ", q.schema = w, q.schemaPath = b + e.util.getProperty(F), q.errSchemaPath = S + "/" + e.util.escapeFragment(F), r += "  " + e.validate(q) + " ", q.baseId = k, r += " }  ", s && (r += " if (" + T + ") { ", p += "}"));
    }
    return s && (r += "   " + p + " if (" + E + " == errors) {"), r;
  }), dependencies;
}
var _enum, hasRequired_enum;
function require_enum() {
  return hasRequired_enum || (hasRequired_enum = 1, _enum = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = e.opts.$data && u && u.$data;
    q && (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ");
    var p = "i" + n, T = "schema" + n;
    q || (r += " var " + T + " = validate.schema" + b + ";"), r += "var " + E + ";", q && (r += " if (schema" + n + " === undefined) " + E + " = true; else if (!Array.isArray(schema" + n + ")) " + E + " = false; else {"), r += "" + E + " = false;for (var " + p + "=0; " + p + "<" + T + ".length; " + p + "++) if (equal(" + v + ", " + T + "[" + p + "])) { " + E + " = true; break; }", q && (r += "  }  "), r += " if (!" + E + ") {   ";
    var d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { allowedValues: schema" + n + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = d.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", s && (r += " else { "), r;
  }), _enum;
}
var format, hasRequiredFormat;
function requireFormat() {
  return hasRequiredFormat || (hasRequiredFormat = 1, format = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || "");
    if (e.opts.format === !1)
      return s && (r += " if (true) { "), r;
    var E = e.opts.$data && u && u.$data, q;
    E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u;
    var p = e.opts.unknownFormats, T = Array.isArray(p);
    if (E) {
      var d = "format" + n, y = "isObject" + n, A = "formatType" + n;
      r += " var " + d + " = formats[" + q + "]; var " + y + " = typeof " + d + " == 'object' && !(" + d + " instanceof RegExp) && " + d + ".validate; var " + A + " = " + y + " && " + d + ".type || 'string'; if (" + y + ") { ", e.async && (r += " var async" + n + " = " + d + ".async; "), r += " " + d + " = " + d + ".validate; } if (  ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'string') || "), r += " (", p != "ignore" && (r += " (" + q + " && !" + d + " ", T && (r += " && self._opts.unknownFormats.indexOf(" + q + ") == -1 "), r += ") || "), r += " (" + d + " && " + A + " == '" + l + "' && !(typeof " + d + " == 'function' ? ", e.async ? r += " (async" + n + " ? await " + d + "(" + v + ") : " + d + "(" + v + ")) " : r += " " + d + "(" + v + ") ", r += " : " + d + ".test(" + v + "))))) {";
    } else {
      var d = e.formats[u];
      if (!d) {
        if (p == "ignore")
          return e.logger.warn('unknown format "' + u + '" ignored in schema at path "' + e.errSchemaPath + '"'), s && (r += " if (true) { "), r;
        if (T && p.indexOf(u) >= 0)
          return s && (r += " if (true) { "), r;
        throw new Error('unknown format "' + u + '" is used in schema at path "' + e.errSchemaPath + '"');
      }
      var y = typeof d == "object" && !(d instanceof RegExp) && d.validate, A = y && d.type || "string";
      if (y) {
        var w = d.async === !0;
        d = d.validate;
      }
      if (A != l)
        return s && (r += " if (true) { "), r;
      if (w) {
        if (!e.async) throw new Error("async format in sync schema");
        var I = "formats" + e.util.getProperty(u) + ".validate";
        r += " if (!(await " + I + "(" + v + "))) { ";
      } else {
        r += " if (! ";
        var I = "formats" + e.util.getProperty(u);
        y && (I += ".validate"), typeof d == "function" ? r += " " + I + "(" + v + ") " : r += " " + I + ".test(" + v + ") ", r += ") { ";
      }
    }
    var R = R || [];
    R.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { format:  ", E ? r += "" + q : r += "" + e.util.toQuotedString(u), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match format "`, E ? r += "' + " + q + " + '" : r += "" + e.util.escapeQuotes(u), r += `"' `), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + e.util.toQuotedString(u), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var F = r;
    return r = R.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + F + "]); " : r += " validate.errors = [" + F + "]; return false; " : r += " var err = " + F + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", s && (r += " else { "), r;
  }), format;
}
var _if, hasRequired_if;
function require_if() {
  return hasRequired_if || (hasRequired_if = 1, _if = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = "errs__" + n, p = e.util.copy(e);
    p.level++;
    var T = "valid" + p.level, d = e.schema.then, y = e.schema.else, A = d !== void 0 && (e.opts.strictKeywords ? typeof d == "object" && Object.keys(d).length > 0 || d === !1 : e.util.schemaHasRules(d, e.RULES.all)), w = y !== void 0 && (e.opts.strictKeywords ? typeof y == "object" && Object.keys(y).length > 0 || y === !1 : e.util.schemaHasRules(y, e.RULES.all)), I = p.baseId;
    if (A || w) {
      var R;
      p.createErrors = !1, p.schema = u, p.schemaPath = b, p.errSchemaPath = S, r += " var " + q + " = errors; var " + E + " = true;  ";
      var F = e.compositeRule;
      e.compositeRule = p.compositeRule = !0, r += "  " + e.validate(p) + " ", p.baseId = I, p.createErrors = !0, r += "  errors = " + q + "; if (vErrors !== null) { if (" + q + ") vErrors.length = " + q + "; else vErrors = null; }  ", e.compositeRule = p.compositeRule = F, A ? (r += " if (" + T + ") {  ", p.schema = e.schema.then, p.schemaPath = e.schemaPath + ".then", p.errSchemaPath = e.errSchemaPath + "/then", r += "  " + e.validate(p) + " ", p.baseId = I, r += " " + E + " = " + T + "; ", A && w ? (R = "ifClause" + n, r += " var " + R + " = 'then'; ") : R = "'then'", r += " } ", w && (r += " else { ")) : r += " if (!" + T + ") { ", w && (p.schema = e.schema.else, p.schemaPath = e.schemaPath + ".else", p.errSchemaPath = e.errSchemaPath + "/else", r += "  " + e.validate(p) + " ", p.baseId = I, r += " " + E + " = " + T + "; ", A && w ? (R = "ifClause" + n, r += " var " + R + " = 'else'; ") : R = "'else'", r += " } "), r += " if (!" + E + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { failingKeyword: " + R + " } ", e.opts.messages !== !1 && (r += ` , message: 'should match "' + ` + R + ` + '" schema' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && s && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " }   ", s && (r += " else { ");
    } else
      s && (r += " if (true) { ");
    return r;
  }), _if;
}
var items, hasRequiredItems;
function requireItems() {
  return hasRequiredItems || (hasRequiredItems = 1, items = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = "errs__" + n, p = e.util.copy(e), T = "";
    p.level++;
    var d = "valid" + p.level, y = "i" + n, A = p.dataLevel = e.dataLevel + 1, w = "data" + A, I = e.baseId;
    if (r += "var " + q + " = errors;var " + E + ";", Array.isArray(u)) {
      var R = e.schema.additionalItems;
      if (R === !1) {
        r += " " + E + " = " + v + ".length <= " + u.length + "; ";
        var F = S;
        S = e.errSchemaPath + "/additionalItems", r += "  if (!" + E + ") {   ";
        var x = x || [];
        x.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { limit: " + u.length + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have more than " + u.length + " items' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
        var M = r;
        r = x.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + M + "]); " : r += " validate.errors = [" + M + "]; return false; " : r += " var err = " + M + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", S = F, s && (T += "}", r += " else { ");
      }
      var Q = u;
      if (Q) {
        for (var C, W = -1, h = Q.length - 1; W < h; )
          if (C = Q[W += 1], e.opts.strictKeywords ? typeof C == "object" && Object.keys(C).length > 0 || C === !1 : e.util.schemaHasRules(C, e.RULES.all)) {
            r += " " + d + " = true; if (" + v + ".length > " + W + ") { ";
            var $ = v + "[" + W + "]";
            p.schema = C, p.schemaPath = b + "[" + W + "]", p.errSchemaPath = S + "/" + W, p.errorPath = e.util.getPathExpr(e.errorPath, W, e.opts.jsonPointers, !0), p.dataPathArr[A] = W;
            var ae = e.validate(p);
            p.baseId = I, e.util.varOccurences(ae, w) < 2 ? r += " " + e.util.varReplace(ae, w, $) + " " : r += " var " + w + " = " + $ + "; " + ae + " ", r += " }  ", s && (r += " if (" + d + ") { ", T += "}");
          }
      }
      if (typeof R == "object" && (e.opts.strictKeywords ? typeof R == "object" && Object.keys(R).length > 0 || R === !1 : e.util.schemaHasRules(R, e.RULES.all))) {
        p.schema = R, p.schemaPath = e.schemaPath + ".additionalItems", p.errSchemaPath = e.errSchemaPath + "/additionalItems", r += " " + d + " = true; if (" + v + ".length > " + u.length + ") {  for (var " + y + " = " + u.length + "; " + y + " < " + v + ".length; " + y + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
        var $ = v + "[" + y + "]";
        p.dataPathArr[A] = y;
        var ae = e.validate(p);
        p.baseId = I, e.util.varOccurences(ae, w) < 2 ? r += " " + e.util.varReplace(ae, w, $) + " " : r += " var " + w + " = " + $ + "; " + ae + " ", s && (r += " if (!" + d + ") break; "), r += " } }  ", s && (r += " if (" + d + ") { ", T += "}");
      }
    } else if (e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      p.schema = u, p.schemaPath = b, p.errSchemaPath = S, r += "  for (var " + y + " = 0; " + y + " < " + v + ".length; " + y + "++) { ", p.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
      var $ = v + "[" + y + "]";
      p.dataPathArr[A] = y;
      var ae = e.validate(p);
      p.baseId = I, e.util.varOccurences(ae, w) < 2 ? r += " " + e.util.varReplace(ae, w, $) + " " : r += " var " + w + " = " + $ + "; " + ae + " ", s && (r += " if (!" + d + ") break; "), r += " }";
    }
    return s && (r += " " + T + " if (" + q + " == errors) {"), r;
  }), items;
}
var _limit, hasRequired_limit;
function require_limit() {
  return hasRequired_limit || (hasRequired_limit = 1, _limit = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, I, v = "data" + (f || ""), E = e.opts.$data && u && u.$data, q;
    E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u;
    var p = o == "maximum", T = p ? "exclusiveMaximum" : "exclusiveMinimum", d = e.schema[T], y = e.opts.$data && d && d.$data, A = p ? "<" : ">", w = p ? ">" : "<", I = void 0;
    if (!(E || typeof u == "number" || u === void 0))
      throw new Error(o + " must be number");
    if (!(y || d === void 0 || typeof d == "number" || typeof d == "boolean"))
      throw new Error(T + " must be number or boolean");
    if (y) {
      var R = e.util.getData(d.$data, f, e.dataPathArr), F = "exclusive" + n, x = "exclType" + n, M = "exclIsNumber" + n, Q = "op" + n, C = "' + " + Q + " + '";
      r += " var schemaExcl" + n + " = " + R + "; ", R = "schemaExcl" + n, r += " var " + F + "; var " + x + " = typeof " + R + "; if (" + x + " != 'boolean' && " + x + " != 'undefined' && " + x + " != 'number') { ";
      var I = T, W = W || [];
      W.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: '" + T + " should be boolean' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var h = r;
      r = W.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + h + "]); " : r += " validate.errors = [" + h + "]; return false; " : r += " var err = " + h + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), r += " " + x + " == 'number' ? ( (" + F + " = " + q + " === undefined || " + R + " " + A + "= " + q + ") ? " + v + " " + w + "= " + R + " : " + v + " " + w + " " + q + " ) : ( (" + F + " = " + R + " === true) ? " + v + " " + w + "= " + q + " : " + v + " " + w + " " + q + " ) || " + v + " !== " + v + ") { var op" + n + " = " + F + " ? '" + A + "' : '" + A + "='; ", u === void 0 && (I = T, S = e.errSchemaPath + "/" + T, q = R, E = y);
    } else {
      var M = typeof d == "number", C = A;
      if (M && E) {
        var Q = "'" + C + "'";
        r += " if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), r += " ( " + q + " === undefined || " + d + " " + A + "= " + q + " ? " + v + " " + w + "= " + d + " : " + v + " " + w + " " + q + " ) || " + v + " !== " + v + ") { ";
      } else {
        M && u === void 0 ? (F = !0, I = T, S = e.errSchemaPath + "/" + T, q = d, w += "=") : (M && (q = Math[p ? "min" : "max"](d, u)), d === (M ? q : !0) ? (F = !0, I = T, S = e.errSchemaPath + "/" + T, w += "=") : (F = !1, C += "="));
        var Q = "'" + C + "'";
        r += " if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), r += " " + v + " " + w + " " + q + " || " + v + " !== " + v + ") { ";
      }
    }
    I = I || o;
    var W = W || [];
    W.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { comparison: " + Q + ", limit: " + q + ", exclusive: " + F + " } ", e.opts.messages !== !1 && (r += " , message: 'should be " + C + " ", E ? r += "' + " + q : r += "" + q + "'"), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var h = r;
    return r = W.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + h + "]); " : r += " validate.errors = [" + h + "]; return false; " : r += " var err = " + h + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", s && (r += " else { "), r;
  }), _limit;
}
var _limitItems, hasRequired_limitItems;
function require_limitItems() {
  return hasRequired_limitItems || (hasRequired_limitItems = 1, _limitItems = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, T, v = "data" + (f || ""), E = e.opts.$data && u && u.$data, q;
    if (E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u, !(E || typeof u == "number"))
      throw new Error(o + " must be number");
    var p = o == "maxItems" ? ">" : "<";
    r += "if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), r += " " + v + ".length " + p + " " + q + ") { ";
    var T = o, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (T || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { limit: " + q + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", o == "maxItems" ? r += "more" : r += "fewer", r += " than ", E ? r += "' + " + q + " + '" : r += "" + u, r += " items' "), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = d.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", s && (r += " else { "), r;
  }), _limitItems;
}
var _limitLength, hasRequired_limitLength;
function require_limitLength() {
  return hasRequired_limitLength || (hasRequired_limitLength = 1, _limitLength = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, T, v = "data" + (f || ""), E = e.opts.$data && u && u.$data, q;
    if (E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u, !(E || typeof u == "number"))
      throw new Error(o + " must be number");
    var p = o == "maxLength" ? ">" : "<";
    r += "if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), e.opts.unicode === !1 ? r += " " + v + ".length " : r += " ucs2length(" + v + ") ", r += " " + p + " " + q + ") { ";
    var T = o, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (T || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { limit: " + q + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT be ", o == "maxLength" ? r += "longer" : r += "shorter", r += " than ", E ? r += "' + " + q + " + '" : r += "" + u, r += " characters' "), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = d.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", s && (r += " else { "), r;
  }), _limitLength;
}
var _limitProperties, hasRequired_limitProperties;
function require_limitProperties() {
  return hasRequired_limitProperties || (hasRequired_limitProperties = 1, _limitProperties = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, T, v = "data" + (f || ""), E = e.opts.$data && u && u.$data, q;
    if (E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u, !(E || typeof u == "number"))
      throw new Error(o + " must be number");
    var p = o == "maxProperties" ? ">" : "<";
    r += "if ( ", E && (r += " (" + q + " !== undefined && typeof " + q + " != 'number') || "), r += " Object.keys(" + v + ").length " + p + " " + q + ") { ";
    var T = o, d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (T || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { limit: " + q + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", o == "maxProperties" ? r += "more" : r += "fewer", r += " than ", E ? r += "' + " + q + " + '" : r += "" + u, r += " properties' "), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = d.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", s && (r += " else { "), r;
  }), _limitProperties;
}
var multipleOf, hasRequiredMultipleOf;
function requireMultipleOf() {
  return hasRequiredMultipleOf || (hasRequiredMultipleOf = 1, multipleOf = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = e.opts.$data && u && u.$data, q;
    if (E ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", q = "schema" + n) : q = u, !(E || typeof u == "number"))
      throw new Error(o + " must be number");
    r += "var division" + n + ";if (", E && (r += " " + q + " !== undefined && ( typeof " + q + " != 'number' || "), r += " (division" + n + " = " + v + " / " + q + ", ", e.opts.multipleOfPrecision ? r += " Math.abs(Math.round(division" + n + ") - division" + n + ") > 1e-" + e.opts.multipleOfPrecision + " " : r += " division" + n + " !== parseInt(division" + n + ") ", r += " ) ", E && (r += "  )  "), r += " ) {   ";
    var p = p || [];
    p.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { multipleOf: " + q + " } ", e.opts.messages !== !1 && (r += " , message: 'should be multiple of ", E ? r += "' + " + q : r += "" + q + "'"), e.opts.verbose && (r += " , schema:  ", E ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var T = r;
    return r = p.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + T + "]); " : r += " validate.errors = [" + T + "]; return false; " : r += " var err = " + T + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", s && (r += " else { "), r;
  }), multipleOf;
}
var not, hasRequiredNot;
function requireNot() {
  return hasRequiredNot || (hasRequiredNot = 1, not = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "errs__" + n, q = e.util.copy(e);
    q.level++;
    var p = "valid" + q.level;
    if (e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      q.schema = u, q.schemaPath = b, q.errSchemaPath = S, r += " var " + E + " = errors;  ";
      var T = e.compositeRule;
      e.compositeRule = q.compositeRule = !0, q.createErrors = !1;
      var d;
      q.opts.allErrors && (d = q.opts.allErrors, q.opts.allErrors = !1), r += " " + e.validate(q) + " ", q.createErrors = !0, d && (q.opts.allErrors = d), e.compositeRule = q.compositeRule = T, r += " if (" + p + ") {   ";
      var y = y || [];
      y.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var A = r;
      r = y.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + A + "]); " : r += " validate.errors = [" + A + "]; return false; " : r += " var err = " + A + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else {  errors = " + E + "; if (vErrors !== null) { if (" + E + ") vErrors.length = " + E + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      r += "  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", s && (r += " if (false) { ");
    return r;
  }), not;
}
var oneOf, hasRequiredOneOf;
function requireOneOf() {
  return hasRequiredOneOf || (hasRequiredOneOf = 1, oneOf = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = "errs__" + n, p = e.util.copy(e), T = "";
    p.level++;
    var d = "valid" + p.level, y = p.baseId, A = "prevValid" + n, w = "passingSchemas" + n;
    r += "var " + q + " = errors , " + A + " = false , " + E + " = false , " + w + " = null; ";
    var I = e.compositeRule;
    e.compositeRule = p.compositeRule = !0;
    var R = u;
    if (R)
      for (var F, x = -1, M = R.length - 1; x < M; )
        F = R[x += 1], (e.opts.strictKeywords ? typeof F == "object" && Object.keys(F).length > 0 || F === !1 : e.util.schemaHasRules(F, e.RULES.all)) ? (p.schema = F, p.schemaPath = b + "[" + x + "]", p.errSchemaPath = S + "/" + x, r += "  " + e.validate(p) + " ", p.baseId = y) : r += " var " + d + " = true; ", x && (r += " if (" + d + " && " + A + ") { " + E + " = false; " + w + " = [" + w + ", " + x + "]; } else { ", T += "}"), r += " if (" + d + ") { " + E + " = " + A + " = true; " + w + " = " + x + "; }";
    return e.compositeRule = p.compositeRule = I, r += "" + T + "if (!" + E + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { passingSchemas: " + w + " } ", e.opts.messages !== !1 && (r += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && s && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += "} else {  errors = " + q + "; if (vErrors !== null) { if (" + q + ") vErrors.length = " + q + "; else vErrors = null; }", e.opts.allErrors && (r += " } "), r;
  }), oneOf;
}
var pattern, hasRequiredPattern;
function requirePattern() {
  return hasRequiredPattern || (hasRequiredPattern = 1, pattern = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = e.opts.$data && u && u.$data, p;
    q ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", p = "schema" + n) : p = u;
    var T = e.opts.regExp ? "regExp" : "new RegExp";
    if (q)
      r += " var " + E + " = true; try { " + E + " = " + T + "(" + p + ").test(" + v + "); } catch(e) { " + E + " = false; } if ( ", q && (r += " (" + p + " !== undefined && typeof " + p + " != 'string') || "), r += " !" + E + ") {";
    else {
      var d = e.usePattern(u);
      r += " if ( ", q && (r += " (" + p + " !== undefined && typeof " + p + " != 'string') || "), r += " !" + d + ".test(" + v + ") ) {";
    }
    var y = y || [];
    y.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { pattern:  ", q ? r += "" + p : r += "" + e.util.toQuotedString(u), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match pattern "`, q ? r += "' + " + p + " + '" : r += "" + e.util.escapeQuotes(u), r += `"' `), e.opts.verbose && (r += " , schema:  ", q ? r += "validate.schema" + b : r += "" + e.util.toQuotedString(u), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var A = r;
    return r = y.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + A + "]); " : r += " validate.errors = [" + A + "]; return false; " : r += " var err = " + A + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", s && (r += " else { "), r;
  }), pattern;
}
var properties$3, hasRequiredProperties;
function requireProperties() {
  return hasRequiredProperties || (hasRequiredProperties = 1, properties$3 = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "errs__" + n, q = e.util.copy(e), p = "";
    q.level++;
    var T = "valid" + q.level, d = "key" + n, y = "idx" + n, A = q.dataLevel = e.dataLevel + 1, w = "data" + A, I = "dataProperties" + n, R = Object.keys(u || {}).filter(ce), F = e.schema.patternProperties || {}, x = Object.keys(F).filter(ce), M = e.schema.additionalProperties, Q = R.length || x.length, C = M === !1, W = typeof M == "object" && Object.keys(M).length, h = e.opts.removeAdditional, $ = C || W || h, ae = e.opts.ownProperties, de = e.baseId, Ee = e.schema.required;
    if (Ee && !(e.opts.$data && Ee.$data) && Ee.length < e.opts.loopRequired)
      var _e = e.util.toHash(Ee);
    function ce(Me) {
      return Me !== "__proto__";
    }
    if (r += "var " + E + " = errors;var " + T + " = true;", ae && (r += " var " + I + " = undefined;"), $) {
      if (ae ? r += " " + I + " = " + I + " || Object.keys(" + v + "); for (var " + y + "=0; " + y + "<" + I + ".length; " + y + "++) { var " + d + " = " + I + "[" + y + "]; " : r += " for (var " + d + " in " + v + ") { ", Q) {
        if (r += " var isAdditional" + n + " = !(false ", R.length)
          if (R.length > 8)
            r += " || validate.schema" + b + ".hasOwnProperty(" + d + ") ";
          else {
            var fe = R;
            if (fe)
              for (var k, pe = -1, ee = fe.length - 1; pe < ee; )
                k = fe[pe += 1], r += " || " + d + " == " + e.util.toQuotedString(k) + " ";
          }
        if (x.length) {
          var J = x;
          if (J)
            for (var G, ue = -1, O = J.length - 1; ue < O; )
              G = J[ue += 1], r += " || " + e.usePattern(G) + ".test(" + d + ") ";
        }
        r += " ); if (isAdditional" + n + ") { ";
      }
      if (h == "all")
        r += " delete " + v + "[" + d + "]; ";
      else {
        var B = e.errorPath, N = "' + " + d + " + '";
        if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers)), C)
          if (h)
            r += " delete " + v + "[" + d + "]; ";
          else {
            r += " " + T + " = false; ";
            var re = S;
            S = e.errSchemaPath + "/additionalProperties";
            var ne = ne || [];
            ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { additionalProperty: '" + N + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is an invalid additional property" : r += "should NOT have additional properties", r += "' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
            var D = r;
            r = ne.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", S = re, s && (r += " break; ");
          }
        else if (W)
          if (h == "failing") {
            r += " var " + E + " = errors;  ";
            var L = e.compositeRule;
            e.compositeRule = q.compositeRule = !0, q.schema = M, q.schemaPath = e.schemaPath + ".additionalProperties", q.errSchemaPath = e.errSchemaPath + "/additionalProperties", q.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = v + "[" + d + "]";
            q.dataPathArr[A] = d;
            var se = e.validate(q);
            q.baseId = de, e.util.varOccurences(se, w) < 2 ? r += " " + e.util.varReplace(se, w, H) + " " : r += " var " + w + " = " + H + "; " + se + " ", r += " if (!" + T + ") { errors = " + E + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + v + "[" + d + "]; }  ", e.compositeRule = q.compositeRule = L;
          } else {
            q.schema = M, q.schemaPath = e.schemaPath + ".additionalProperties", q.errSchemaPath = e.errSchemaPath + "/additionalProperties", q.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = v + "[" + d + "]";
            q.dataPathArr[A] = d;
            var se = e.validate(q);
            q.baseId = de, e.util.varOccurences(se, w) < 2 ? r += " " + e.util.varReplace(se, w, H) + " " : r += " var " + w + " = " + H + "; " + se + " ", s && (r += " if (!" + T + ") break; ");
          }
        e.errorPath = B;
      }
      Q && (r += " } "), r += " }  ", s && (r += " if (" + T + ") { ", p += "}");
    }
    var we = e.opts.useDefaults && !e.compositeRule;
    if (R.length) {
      var Re = R;
      if (Re)
        for (var k, Ae = -1, Oe = Re.length - 1; Ae < Oe; ) {
          k = Re[Ae += 1];
          var te = u[k];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            var Fe = e.util.getProperty(k), H = v + Fe, Ce = we && te.default !== void 0;
            q.schema = te, q.schemaPath = b + Fe, q.errSchemaPath = S + "/" + e.util.escapeFragment(k), q.errorPath = e.util.getPath(e.errorPath, k, e.opts.jsonPointers), q.dataPathArr[A] = e.util.toQuotedString(k);
            var se = e.validate(q);
            if (q.baseId = de, e.util.varOccurences(se, w) < 2) {
              se = e.util.varReplace(se, w, H);
              var qe = H;
            } else {
              var qe = w;
              r += " var " + w + " = " + H + "; ";
            }
            if (Ce)
              r += " " + se + " ";
            else {
              if (_e && _e[k]) {
                r += " if ( " + qe + " === undefined ", ae && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += ") { " + T + " = false; ";
                var B = e.errorPath, re = S, Ue = e.util.escapeQuotes(k);
                e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(B, k, e.opts.jsonPointers)), S = e.errSchemaPath + "/required";
                var ne = ne || [];
                ne.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + Ue + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + Ue + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
                var D = r;
                r = ne.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", S = re, e.errorPath = B, r += " } else { ";
              } else
                s ? (r += " if ( " + qe + " === undefined ", ae && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += ") { " + T + " = true; } else { ") : (r += " if (" + qe + " !== undefined ", ae && (r += " &&   Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += " ) { ");
              r += " " + se + " } ";
            }
          }
          s && (r += " if (" + T + ") { ", p += "}");
        }
    }
    if (x.length) {
      var me = x;
      if (me)
        for (var G, Se = -1, Le = me.length - 1; Se < Le; ) {
          G = me[Se += 1];
          var te = F[G];
          if (e.opts.strictKeywords ? typeof te == "object" && Object.keys(te).length > 0 || te === !1 : e.util.schemaHasRules(te, e.RULES.all)) {
            q.schema = te, q.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(G), q.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(G), ae ? r += " " + I + " = " + I + " || Object.keys(" + v + "); for (var " + y + "=0; " + y + "<" + I + ".length; " + y + "++) { var " + d + " = " + I + "[" + y + "]; " : r += " for (var " + d + " in " + v + ") { ", r += " if (" + e.usePattern(G) + ".test(" + d + ")) { ", q.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers);
            var H = v + "[" + d + "]";
            q.dataPathArr[A] = d;
            var se = e.validate(q);
            q.baseId = de, e.util.varOccurences(se, w) < 2 ? r += " " + e.util.varReplace(se, w, H) + " " : r += " var " + w + " = " + H + "; " + se + " ", s && (r += " if (!" + T + ") break; "), r += " } ", s && (r += " else " + T + " = true; "), r += " }  ", s && (r += " if (" + T + ") { ", p += "}");
          }
        }
    }
    return s && (r += " " + p + " if (" + E + " == errors) {"), r;
  }), properties$3;
}
var propertyNames, hasRequiredPropertyNames;
function requirePropertyNames() {
  return hasRequiredPropertyNames || (hasRequiredPropertyNames = 1, propertyNames = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "errs__" + n, q = e.util.copy(e), p = "";
    q.level++;
    var T = "valid" + q.level;
    if (r += "var " + E + " = errors;", e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)) {
      q.schema = u, q.schemaPath = b, q.errSchemaPath = S;
      var d = "key" + n, y = "idx" + n, A = "i" + n, w = "' + " + d + " + '", I = q.dataLevel = e.dataLevel + 1, R = "data" + I, F = "dataProperties" + n, x = e.opts.ownProperties, M = e.baseId;
      x && (r += " var " + F + " = undefined; "), x ? r += " " + F + " = " + F + " || Object.keys(" + v + "); for (var " + y + "=0; " + y + "<" + F + ".length; " + y + "++) { var " + d + " = " + F + "[" + y + "]; " : r += " for (var " + d + " in " + v + ") { ", r += " var startErrs" + n + " = errors; ";
      var Q = d, C = e.compositeRule;
      e.compositeRule = q.compositeRule = !0;
      var W = e.validate(q);
      q.baseId = M, e.util.varOccurences(W, R) < 2 ? r += " " + e.util.varReplace(W, R, Q) + " " : r += " var " + R + " = " + Q + "; " + W + " ", e.compositeRule = q.compositeRule = C, r += " if (!" + T + ") { for (var " + A + "=startErrs" + n + "; " + A + "<errors; " + A + "++) { vErrors[" + A + "].propertyName = " + d + "; }   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { propertyName: '" + w + "' } ", e.opts.messages !== !1 && (r += " , message: 'property name \\'" + w + "\\' is invalid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && s && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), s && (r += " break; "), r += " } }";
    }
    return s && (r += " " + p + " if (" + E + " == errors) {"), r;
  }), propertyNames;
}
var required$1, hasRequiredRequired;
function requireRequired() {
  return hasRequiredRequired || (hasRequiredRequired = 1, required$1 = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = e.opts.$data && u && u.$data;
    q && (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ");
    var p = "schema" + n;
    if (!q)
      if (u.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
        var T = [], d = u;
        if (d)
          for (var y, A = -1, w = d.length - 1; A < w; ) {
            y = d[A += 1];
            var I = e.schema.properties[y];
            I && (e.opts.strictKeywords ? typeof I == "object" && Object.keys(I).length > 0 || I === !1 : e.util.schemaHasRules(I, e.RULES.all)) || (T[T.length] = y);
          }
      } else
        var T = u;
    if (q || T.length) {
      var R = e.errorPath, F = q || T.length >= e.opts.loopRequired, x = e.opts.ownProperties;
      if (s)
        if (r += " var missing" + n + "; ", F) {
          q || (r += " var " + p + " = validate.schema" + b + "; ");
          var M = "i" + n, Q = "schema" + n + "[" + M + "]", C = "' + " + Q + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(R, Q, e.opts.jsonPointers)), r += " var " + E + " = true; ", q && (r += " if (schema" + n + " === undefined) " + E + " = true; else if (!Array.isArray(schema" + n + ")) " + E + " = false; else {"), r += " for (var " + M + " = 0; " + M + " < " + p + ".length; " + M + "++) { " + E + " = " + v + "[" + p + "[" + M + "]] !== undefined ", x && (r += " &&   Object.prototype.hasOwnProperty.call(" + v + ", " + p + "[" + M + "]) "), r += "; if (!" + E + ") break; } ", q && (r += "  }  "), r += "  if (!" + E + ") {   ";
          var W = W || [];
          W.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var h = r;
          r = W.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + h + "]); " : r += " validate.errors = [" + h + "]; return false; " : r += " var err = " + h + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        } else {
          r += " if ( ";
          var $ = T;
          if ($)
            for (var ae, M = -1, de = $.length - 1; M < de; ) {
              ae = $[M += 1], M && (r += " || ");
              var Ee = e.util.getProperty(ae), _e = v + Ee;
              r += " ( ( " + _e + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(ae) + "') "), r += ") && (missing" + n + " = " + e.util.toQuotedString(e.opts.jsonPointers ? ae : Ee) + ") ) ";
            }
          r += ") {  ";
          var Q = "missing" + n, C = "' + " + Q + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(R, Q, !0) : R + " + " + Q);
          var W = W || [];
          W.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var h = r;
          r = W.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + h + "]); " : r += " validate.errors = [" + h + "]; return false; " : r += " var err = " + h + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        }
      else if (F) {
        q || (r += " var " + p + " = validate.schema" + b + "; ");
        var M = "i" + n, Q = "schema" + n + "[" + M + "]", C = "' + " + Q + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(R, Q, e.opts.jsonPointers)), q && (r += " if (" + p + " && !Array.isArray(" + p + ")) {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + p + " !== undefined) { "), r += " for (var " + M + " = 0; " + M + " < " + p + ".length; " + M + "++) { if (" + v + "[" + p + "[" + M + "]] === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", " + p + "[" + M + "]) "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", q && (r += "  }  ");
      } else {
        var ce = T;
        if (ce)
          for (var ae, fe = -1, k = ce.length - 1; fe < k; ) {
            ae = ce[fe += 1];
            var Ee = e.util.getProperty(ae), C = e.util.escapeQuotes(ae), _e = v + Ee;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(R, ae, e.opts.jsonPointers)), r += " if ( " + _e + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(ae) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { missingProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + C + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      e.errorPath = R;
    } else s && (r += " if (true) {");
    return r;
  }), required$1;
}
var uniqueItems, hasRequiredUniqueItems;
function requireUniqueItems() {
  return hasRequiredUniqueItems || (hasRequiredUniqueItems = 1, uniqueItems = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v = "data" + (f || ""), E = "valid" + n, q = e.opts.$data && u && u.$data, p;
    if (q ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", p = "schema" + n) : p = u, (u || q) && e.opts.uniqueItems !== !1) {
      q && (r += " var " + E + "; if (" + p + " === false || " + p + " === undefined) " + E + " = true; else if (typeof " + p + " != 'boolean') " + E + " = false; else { "), r += " var i = " + v + ".length , " + E + " = true , j; if (i > 1) { ";
      var T = e.schema.items && e.schema.items.type, d = Array.isArray(T);
      if (!T || T == "object" || T == "array" || d && (T.indexOf("object") >= 0 || T.indexOf("array") >= 0))
        r += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + v + "[i], " + v + "[j])) { " + E + " = false; break outer; } } } ";
      else {
        r += " var itemIndices = {}, item; for (;i--;) { var item = " + v + "[i]; ";
        var y = "checkDataType" + (d ? "s" : "");
        r += " if (" + e.util[y](T, "item", e.opts.strictNumbers, !0) + ") continue; ", d && (r += ` if (typeof item == 'string') item = '"' + item; `), r += " if (typeof itemIndices[item] == 'number') { " + E + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
      }
      r += " } ", q && (r += "  }  "), r += " if (!" + E + ") {   ";
      var A = A || [];
      A.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (r += " , schema:  ", q ? r += "validate.schema" + b : r += "" + u, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var w = r;
      r = A.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + w + "]); " : r += " validate.errors = [" + w + "]; return false; " : r += " var err = " + w + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", s && (r += " else { ");
    } else
      s && (r += " if (true) { ");
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
    var l = [
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
    ], r = ["type", "$comment"], n = [
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
    return l.all = e(r), l.types = e(f), l.forEach(function(u) {
      u.rules = u.rules.map(function(b) {
        var S;
        if (typeof b == "object") {
          var s = Object.keys(b)[0];
          S = b[s], b = s, S.forEach(function(E) {
            r.push(E), l.all[E] = !0;
          });
        }
        r.push(b);
        var v = l.all[b] = {
          keyword: b,
          code: t[b],
          implements: S
        };
        return v;
      }), l.all.$comment = {
        keyword: "$comment",
        code: t.$comment
      }, u.type && (l.types[u.type] = u);
    }), l.keywords = e(r.concat(n)), l.custom = {}, l;
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
  return data = function(e, o) {
    for (var l = 0; l < o.length; l++) {
      e = JSON.parse(JSON.stringify(e));
      var r = o[l].split("/"), n = e, f;
      for (f = 1; f < r.length; f++)
        n = n[r[f]];
      for (f = 0; f < t.length; f++) {
        var u = t[f], b = n[u];
        b && (n[u] = {
          anyOf: [
            b,
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
  function e(o, l, r) {
    var n = this;
    if (typeof this._opts.loadSchema != "function")
      throw new Error("options.loadSchema should be a function");
    typeof l == "function" && (r = l, l = void 0);
    var f = u(o).then(function() {
      var S = n._addSchema(o, void 0, l);
      return S.validate || b(S);
    });
    return r && f.then(
      function(S) {
        r(null, S);
      },
      r
    ), f;
    function u(S) {
      var s = S.$schema;
      return s && !n.getSchema(s) ? e.call(n, { $ref: s }, !0) : Promise.resolve();
    }
    function b(S) {
      try {
        return n._compile(S);
      } catch (v) {
        if (v instanceof t) return s(v);
        throw v;
      }
      function s(v) {
        var E = v.missingSchema;
        if (T(E)) throw new Error("Schema " + E + " is loaded but " + v.missingRef + " cannot be resolved");
        var q = n._loadingSchemas[E];
        return q || (q = n._loadingSchemas[E] = n._opts.loadSchema(E), q.then(p, p)), q.then(function(d) {
          if (!T(E))
            return u(d).then(function() {
              T(E) || n.addSchema(d, E, void 0, l);
            });
        }).then(function() {
          return b(S);
        });
        function p() {
          delete n._loadingSchemas[E];
        }
        function T(d) {
          return n._refs[d] || n._schemas[d];
        }
      }
    }
  }
  return async;
}
var custom, hasRequiredCustom;
function requireCustom() {
  return hasRequiredCustom || (hasRequiredCustom = 1, custom = function(e, o, l) {
    var r = " ", n = e.level, f = e.dataLevel, u = e.schema[o], b = e.schemaPath + e.util.getProperty(o), S = e.errSchemaPath + "/" + o, s = !e.opts.allErrors, v, E = "data" + (f || ""), q = "valid" + n, p = "errs__" + n, T = e.opts.$data && u && u.$data, d;
    T ? (r += " var schema" + n + " = " + e.util.getData(u.$data, f, e.dataPathArr) + "; ", d = "schema" + n) : d = u;
    var y = this, A = "definition" + n, w = y.definition, I = "", R, F, x, M, Q;
    if (T && w.$data) {
      Q = "keywordValidate" + n;
      var C = w.validateSchema;
      r += " var " + A + " = RULES.custom['" + o + "'].definition; var " + Q + " = " + A + ".validate;";
    } else {
      if (M = e.useCustomRule(y, u, e.schema, e), !M) return;
      d = "validate.schema" + b, Q = M.code, R = w.compile, F = w.inline, x = w.macro;
    }
    var W = Q + ".errors", h = "i" + n, $ = "ruleErr" + n, ae = w.async;
    if (ae && !e.async) throw new Error("async keyword in sync schema");
    if (F || x || (r += "" + W + " = null;"), r += "var " + p + " = errors;var " + q + ";", T && w.$data && (I += "}", r += " if (" + d + " === undefined) { " + q + " = true; } else { ", C && (I += "}", r += " " + q + " = " + A + ".validateSchema(" + d + "); if (" + q + ") { ")), F)
      w.statements ? r += " " + M.validate + " " : r += " " + q + " = " + M.validate + "; ";
    else if (x) {
      var de = e.util.copy(e), I = "";
      de.level++;
      var Ee = "valid" + de.level;
      de.schema = M.validate, de.schemaPath = "";
      var _e = e.compositeRule;
      e.compositeRule = de.compositeRule = !0;
      var ce = e.validate(de).replace(/validate\.schema/g, Q);
      e.compositeRule = de.compositeRule = _e, r += " " + ce;
    } else {
      var fe = fe || [];
      fe.push(r), r = "", r += "  " + Q + ".call( ", e.opts.passContext ? r += "this" : r += "self", R || w.schema === !1 ? r += " , " + E + " " : r += " , " + d + " , " + E + " , validate.schema" + e.schemaPath + " ", r += " , (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var k = f ? "data" + (f - 1 || "") : "parentData", pe = f ? e.dataPathArr[f] : "parentDataProperty";
      r += " , " + k + " , " + pe + " , rootData )  ";
      var ee = r;
      r = fe.pop(), w.errors === !1 ? (r += " " + q + " = ", ae && (r += "await "), r += "" + ee + "; ") : ae ? (W = "customErrors" + n, r += " var " + W + " = null; try { " + q + " = await " + ee + "; } catch (e) { " + q + " = false; if (e instanceof ValidationError) " + W + " = e.errors; else throw e; } ") : r += " " + W + " = null; " + q + " = " + ee + "; ";
    }
    if (w.modifying && (r += " if (" + k + ") " + E + " = " + k + "[" + pe + "];"), r += "" + I, w.valid)
      s && (r += " if (true) { ");
    else {
      r += " if ( ", w.valid === void 0 ? (r += " !", x ? r += "" + Ee : r += "" + q) : r += " " + !w.valid + " ", r += ") { ", v = y.keyword;
      var fe = fe || [];
      fe.push(r), r = "";
      var fe = fe || [];
      fe.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (v || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { keyword: '" + y.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + y.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + E + " "), r += " } ") : r += " {} ";
      var J = r;
      r = fe.pop(), !e.compositeRule && s ? e.async ? r += " throw new ValidationError([" + J + "]); " : r += " validate.errors = [" + J + "]; return false; " : r += " var err = " + J + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      var G = r;
      r = fe.pop(), F ? w.errors ? w.errors != "full" && (r += "  for (var " + h + "=" + p + "; " + h + "<errors; " + h + "++) { var " + $ + " = vErrors[" + h + "]; if (" + $ + ".dataPath === undefined) " + $ + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + $ + ".schemaPath === undefined) { " + $ + '.schemaPath = "' + S + '"; } ', e.opts.verbose && (r += " " + $ + ".schema = " + d + "; " + $ + ".data = " + E + "; "), r += " } ") : w.errors === !1 ? r += " " + G + " " : (r += " if (" + p + " == errors) { " + G + " } else {  for (var " + h + "=" + p + "; " + h + "<errors; " + h + "++) { var " + $ + " = vErrors[" + h + "]; if (" + $ + ".dataPath === undefined) " + $ + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + $ + ".schemaPath === undefined) { " + $ + '.schemaPath = "' + S + '"; } ', e.opts.verbose && (r += " " + $ + ".schema = " + d + "; " + $ + ".data = " + E + "; "), r += " } } ") : x ? (r += "   var err =   ", e.createErrors !== !1 ? (r += " { keyword: '" + (v || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(S) + " , params: { keyword: '" + y.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + y.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + E + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && s && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; ")) : w.errors === !1 ? r += " " + G + " " : (r += " if (Array.isArray(" + W + ")) { if (vErrors === null) vErrors = " + W + "; else vErrors = vErrors.concat(" + W + "); errors = vErrors.length;  for (var " + h + "=" + p + "; " + h + "<errors; " + h + "++) { var " + $ + " = vErrors[" + h + "]; if (" + $ + ".dataPath === undefined) " + $ + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + $ + '.schemaPath = "' + S + '";  ', e.opts.verbose && (r += " " + $ + ".schema = " + d + "; " + $ + ".data = " + E + "; "), r += " } } else { " + G + " } "), r += " } ", s && (r += " else { ");
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
  var t = /^[a-z_$][a-z0-9_$-]*$/i, e = requireCustom(), o = requireDefinition_schema();
  keyword = {
    add: l,
    get: r,
    remove: n,
    validate: f
  };
  function l(u, b) {
    var S = this.RULES;
    if (S.keywords[u])
      throw new Error("Keyword " + u + " is already defined");
    if (!t.test(u))
      throw new Error("Keyword " + u + " is not a valid identifier");
    if (b) {
      this.validateKeyword(b, !0);
      var s = b.type;
      if (Array.isArray(s))
        for (var v = 0; v < s.length; v++)
          q(u, s[v], b);
      else
        q(u, s, b);
      var E = b.metaSchema;
      E && (b.$data && this._opts.$data && (E = {
        anyOf: [
          E,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      }), b.validateSchema = this.compile(E, !0));
    }
    S.keywords[u] = S.all[u] = !0;
    function q(p, T, d) {
      for (var y, A = 0; A < S.length; A++) {
        var w = S[A];
        if (w.type == T) {
          y = w;
          break;
        }
      }
      y || (y = { type: T, rules: [] }, S.push(y));
      var I = {
        keyword: p,
        definition: d,
        custom: !0,
        code: e,
        implements: d.implements
      };
      y.rules.push(I), S.custom[p] = I;
    }
    return this;
  }
  function r(u) {
    var b = this.RULES.custom[u];
    return b ? b.definition : this.RULES.keywords[u] || !1;
  }
  function n(u) {
    var b = this.RULES;
    delete b.keywords[u], delete b.all[u], delete b.custom[u];
    for (var S = 0; S < b.length; S++)
      for (var s = b[S].rules, v = 0; v < s.length; v++)
        if (s[v].keyword == u) {
          s.splice(v, 1);
          break;
        }
    return this;
  }
  function f(u, b) {
    f.errors = null;
    var S = this._validateKeyword = this._validateKeyword || this.compile(o, !0);
    if (S(u)) return !0;
    if (f.errors = S.errors, b)
      throw new Error("custom keyword definition is invalid: " + this.errorsText(S.errors));
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
  var t = requireCompile(), e = requireResolve(), o = requireCache(), l = requireSchema_obj(), r = requireFastJsonStableStringify(), n = requireFormats(), f = requireRules(), u = requireData(), b = requireUtil$1();
  ajv = p, p.prototype.validate = T, p.prototype.compile = d, p.prototype.addSchema = y, p.prototype.addMetaSchema = A, p.prototype.validateSchema = w, p.prototype.getSchema = R, p.prototype.removeSchema = M, p.prototype.addFormat = _e, p.prototype.errorsText = Ee, p.prototype._addSchema = C, p.prototype._compile = W, p.prototype.compileAsync = requireAsync();
  var S = requireKeyword();
  p.prototype.addKeyword = S.add, p.prototype.getKeyword = S.get, p.prototype.removeKeyword = S.remove, p.prototype.validateKeyword = S.validate;
  var s = requireError_classes();
  p.ValidationError = s.Validation, p.MissingRefError = s.MissingRef, p.$dataMetaSchema = u;
  var v = "http://json-schema.org/draft-07/schema", E = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], q = ["/properties"];
  function p(O) {
    if (!(this instanceof p)) return new p(O);
    O = this._opts = b.copy(O) || {}, G(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = n(O.format), this._cache = O.cache || new o(), this._loadingSchemas = {}, this._compilations = [], this.RULES = f(), this._getId = h(O), O.loopRequired = O.loopRequired || 1 / 0, O.errorDataPath == "property" && (O._errorDataPathProperty = !0), O.serialize === void 0 && (O.serialize = r), this._metaOpts = J(this), O.formats && k(this), O.keywords && pe(this), ce(this), typeof O.meta == "object" && this.addMetaSchema(O.meta), O.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), fe(this);
  }
  function T(O, B) {
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
  function y(O, B, N, re) {
    if (Array.isArray(O)) {
      for (var ne = 0; ne < O.length; ne++) this.addSchema(O[ne], void 0, N, re);
      return this;
    }
    var D = this._getId(O);
    if (D !== void 0 && typeof D != "string")
      throw new Error("schema id must be string");
    return B = e.normalizeId(B || D), ee(this, B), this._schemas[B] = this._addSchema(O, N, re, !0), this;
  }
  function A(O, B, N) {
    return this.addSchema(O, B, N, !0), this;
  }
  function w(O, B) {
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
    return O._opts.defaultMeta = typeof B == "object" ? O._getId(B) || B : O.getSchema(v) ? v : void 0, O._opts.defaultMeta;
  }
  function R(O) {
    var B = x(this, O);
    switch (typeof B) {
      case "object":
        return B.validate || this._compile(B);
      case "string":
        return this.getSchema(B);
      case "undefined":
        return F(this, O);
    }
  }
  function F(O, B) {
    var N = e.schema.call(O, { schema: {} }, B);
    if (N) {
      var re = N.schema, ne = N.root, D = N.baseId, L = t.call(O, re, ne, void 0, D);
      return O._fragments[B] = new l({
        ref: B,
        fragment: !0,
        schema: re,
        root: ne,
        baseId: D,
        validate: L
      }), L;
    }
  }
  function x(O, B) {
    return B = e.normalizeId(B), O._schemas[B] || O._refs[B] || O._fragments[B];
  }
  function M(O) {
    if (O instanceof RegExp)
      return Q(this, this._schemas, O), Q(this, this._refs, O), this;
    switch (typeof O) {
      case "undefined":
        return Q(this, this._schemas), Q(this, this._refs), this._cache.clear(), this;
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
  function Q(O, B, N) {
    for (var re in B) {
      var ne = B[re];
      !ne.meta && (!N || N.test(re)) && (O._cache.del(ne.cacheKey), delete B[re]);
    }
  }
  function C(O, B, N, re) {
    if (typeof O != "object" && typeof O != "boolean")
      throw new Error("schema should be object or boolean");
    var ne = this._opts.serialize, D = ne ? ne(O) : O, L = this._cache.get(D);
    if (L) return L;
    re = re || this._opts.addUsedSchema !== !1;
    var H = e.normalizeId(this._getId(O));
    H && re && ee(this, H);
    var se = this._opts.validateSchema !== !1 && !B, we;
    se && !(we = H && H == e.normalizeId(O.$schema)) && this.validateSchema(O, !0);
    var Re = e.ids.call(this, O), Ae = new l({
      id: H,
      schema: O,
      localRefs: Re,
      cacheKey: D,
      meta: N
    });
    return H[0] != "#" && re && (this._refs[H] = Ae), this._cache.put(D, Ae), se && we && this.validateSchema(O, !0), Ae;
  }
  function W(O, B) {
    if (O.compiling)
      return O.validate = ne, ne.schema = O.schema, ne.errors = null, ne.root = B || ne, O.schema.$async === !0 && (ne.$async = !0), ne;
    O.compiling = !0;
    var N;
    O.meta && (N = this._opts, this._opts = this._metaOpts);
    var re;
    try {
      re = t.call(this, O.schema, B, O.localRefs);
    } catch (D) {
      throw delete O.validate, D;
    } finally {
      O.compiling = !1, O.meta && (this._opts = N);
    }
    return O.validate = re, O.refs = re.refs, O.refVal = re.refVal, O.root = re.root, re;
    function ne() {
      var D = O.validate, L = D.apply(this, arguments);
      return ne.errors = D.errors, L;
    }
  }
  function h(O) {
    switch (O.schemaId) {
      case "auto":
        return de;
      case "id":
        return $;
      default:
        return ae;
    }
  }
  function $(O) {
    return O.$id && this.logger.warn("schema $id ignored", O.$id), O.id;
  }
  function ae(O) {
    return O.id && this.logger.warn("schema id ignored", O.id), O.$id;
  }
  function de(O) {
    if (O.$id && O.id && O.$id != O.id)
      throw new Error("schema $id is different from id");
    return O.$id || O.id;
  }
  function Ee(O, B) {
    if (O = O || this.errors, !O) return "No errors";
    B = B || {};
    for (var N = B.separator === void 0 ? ", " : B.separator, re = B.dataVar === void 0 ? "data" : B.dataVar, ne = "", D = 0; D < O.length; D++) {
      var L = O[D];
      L && (ne += re + L.dataPath + " " + L.message + N);
    }
    return ne.slice(0, -N.length);
  }
  function _e(O, B) {
    return typeof B == "string" && (B = new RegExp(B)), this._formats[O] = B, this;
  }
  function ce(O) {
    var B;
    if (O._opts.$data && (B = require$$12, O.addMetaSchema(B, B.$id, !0)), O._opts.meta !== !1) {
      var N = require$$13;
      O._opts.$data && (N = u(N, q)), O.addMetaSchema(N, v, !0), O._refs["http://json-schema.org/schema"] = v;
    }
  }
  function fe(O) {
    var B = O._opts.schemas;
    if (B)
      if (Array.isArray(B)) O.addSchema(B);
      else for (var N in B) O.addSchema(B[N], N);
  }
  function k(O) {
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
  function J(O) {
    for (var B = b.copy(O._opts), N = 0; N < E.length; N++)
      delete B[E[N]];
    return B;
  }
  function G(O) {
    var B = O._opts.logger;
    if (B === !1)
      O.logger = { log: ue, warn: ue, error: ue };
    else {
      if (B === void 0 && (B = console), !(typeof B == "object" && B.log && B.warn && B.error))
        throw new Error("logger must implement log, warn and error methods");
      O.logger = B;
    }
  }
  function ue() {
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
  class o {
    constructor(r) {
      this.createAjvInstance(r), this.addDefaultTypes();
    }
    createAjvInstance(r) {
      this.typesSchemas = {}, this.compiled = !1, this.ajv = new t({ verbose: !0 }), this.ajv.addSchema(require$$2$1, "definitions"), this.ajv.addSchema(require$$3$1, "protocol"), r && Object.keys(r).forEach((n) => this.addType(n, r[n]));
    }
    addDefaultTypes() {
      this.addTypes(require$$4), this.addTypes(require$$5), this.addTypes(require$$6), this.addTypes(require$$7), this.addTypes(require$$8);
    }
    addTypes(r) {
      Object.keys(r).forEach((n) => this.addType(n, r[n]));
    }
    typeToSchemaName(r) {
      return r.replace("|", "_");
    }
    addType(r, n) {
      const f = this.typeToSchemaName(r);
      this.typesSchemas[f] == null && (n || (n = {
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
      }), this.typesSchemas[f] = n, this.compiled ? this.createAjvInstance(this.typesSchemas) : this.ajv.addSchema(n, f), this.ajv.removeSchema("dataType"), this.ajv.addSchema({
        title: "dataType",
        oneOf: [{ enum: ["native"] }].concat(Object.keys(this.typesSchemas).map((u) => ({ $ref: this.typeToSchemaName(u) })))
      }, "dataType"));
    }
    validateType(r) {
      let n = this.ajv.validate("dataType", r);
      if (this.compiled = !0, !n)
        throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
    }
    validateTypeGoingInside(r) {
      if (Array.isArray(r)) {
        e.ok(this.typesSchemas[this.typeToSchemaName(r[0])] != null, r + " is an undefined type");
        let n = this.ajv.validate(r[0], r);
        if (this.compiled = !0, !n)
          throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
      } else {
        if (r == "native")
          return;
        e.ok(this.typesSchemas[this.typeToSchemaName(r)] != null, r + " is an undefined type");
      }
    }
    validateProtocol(r) {
      let n = this.ajv.validate("protocol", r);
      e.ok(n, JSON.stringify(this.ajv.errors, null, 2));
      function f(u, b, S) {
        const s = new o(b.typesSchemas);
        Object.keys(u).forEach((v) => {
          v == "types" ? (Object.keys(u[v]).forEach((E) => s.addType(E)), Object.keys(u[v]).forEach((E) => {
            try {
              s.validateType(u[v][E], S + "." + v + "." + E);
            } catch {
              throw new Error("Error at " + S + "." + v + "." + E);
            }
          })) : f(u[v], s, S + "." + v);
        });
      }
      f(r, this, "root");
    }
  }
  return protodefValidator = o, protodefValidator;
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
  class o extends Array {
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
  function l(p, T) {
    if (T + 8 > p.length)
      throw new t();
    return {
      value: new e(p.readInt32BE(T), p.readInt32BE(T + 4)),
      size: 8
    };
  }
  function r(p, T, d) {
    return typeof p == "bigint" ? T.writeBigInt64BE(p, d) : (T.writeInt32BE(p[0], d), T.writeInt32BE(p[1], d + 4)), d + 8;
  }
  function n(p, T) {
    if (T + 8 > p.length)
      throw new t();
    return {
      value: new e(p.readInt32LE(T + 4), p.readInt32LE(T)),
      size: 8
    };
  }
  function f(p, T, d) {
    return typeof p == "bigint" ? T.writeBigInt64LE(p, d) : (T.writeInt32LE(p[0], d + 4), T.writeInt32LE(p[1], d)), d + 8;
  }
  function u(p, T) {
    if (T + 8 > p.length)
      throw new t();
    return {
      value: new o(p.readUInt32BE(T), p.readUInt32BE(T + 4)),
      size: 8
    };
  }
  function b(p, T, d) {
    return typeof p == "bigint" ? T.writeBigUInt64BE(p, d) : (T.writeUInt32BE(p[0], d), T.writeUInt32BE(p[1], d + 4)), d + 8;
  }
  function S(p, T) {
    if (T + 8 > p.length)
      throw new t();
    return {
      value: new o(p.readUInt32LE(T + 4), p.readUInt32LE(T)),
      size: 8
    };
  }
  function s(p, T, d) {
    return typeof p == "bigint" ? T.writeBigUInt64LE(p, d) : (T.writeUInt32LE(p[0], d + 4), T.writeUInt32LE(p[1], d)), d + 8;
  }
  function v(p, T, d, y) {
    return [(I, R) => {
      if (R + d > I.length)
        throw new t();
      return {
        value: I[p](R),
        size: d
      };
    }, (I, R, F) => (R[T](I, F), F + d), d, y];
  }
  const E = {
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
  }, q = Object.keys(E).reduce((p, T) => (p[T] = v(E[T][0], E[T][1], E[T][2], require$$1$3[T]), p), {});
  return q.i64 = [l, r, 8, require$$1$3.i64], q.li64 = [n, f, 8, require$$1$3.li64], q.u64 = [u, b, 8, require$$1$3.u64], q.lu64 = [S, s, 8, require$$1$3.lu64], numeric = q, numeric;
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
    varint: [e, l, o, require$$1$3.varint],
    varint64: [r, u, f, require$$1$3.varint64],
    varint128: [n, u, f, require$$1$3.varint128],
    zigzag32: [b, s, S, require$$1$3.zigzag32],
    zigzag64: [v, q, E, require$$1$3.zigzag64]
  };
  function e(p, T) {
    let d = 0, y = 0, A = T;
    for (; ; ) {
      if (A >= p.length) throw new t("Unexpected buffer end while reading VarInt");
      const w = p.readUInt8(A);
      if (d |= (w & 127) << y, A++, !(w & 128))
        return { value: d, size: A - T };
      if (y += 7, y > 64) throw new t(`varint is too big: ${y}`);
    }
  }
  function o(p) {
    let T = 0;
    for (; p & -128; )
      p >>>= 7, T++;
    return T + 1;
  }
  function l(p, T, d) {
    let y = 0;
    for (; p & -128; )
      T.writeUInt8(p & 255 | 128, d + y), y++, p >>>= 7;
    return T.writeUInt8(p, d + y), d + y + 1;
  }
  function r(p, T) {
    let d = 0n, y = 0n, A = T;
    for (; ; ) {
      if (A >= p.length) throw new t("Unexpected buffer end while reading VarLong");
      const w = p.readUInt8(A);
      if (d |= (BigInt(w) & 0x7Fn) << y, A++, !(w & 128))
        return { value: d, size: A - T };
      if (y += 7n, y > 63n) throw new Error(`varint is too big: ${y}`);
    }
  }
  function n(p, T) {
    let d = 0n, y = 0n, A = T;
    for (; ; ) {
      if (A >= p.length) throw new t("Unexpected buffer end while reading VarLong");
      const w = p.readUInt8(A);
      if (d |= (BigInt(w) & 0x7Fn) << y, A++, !(w & 128))
        return { value: d, size: A - T };
      if (y += 7n, y > 127n) throw new Error(`varint is too big: ${y}`);
    }
  }
  function f(p) {
    p = BigInt(p);
    let T = 0;
    do
      p >>= 7n, T++;
    while (p !== 0n);
    return T;
  }
  function u(p, T, d) {
    p = BigInt(p);
    let y = d;
    do {
      const A = p & 0x7Fn;
      p >>= 7n, T.writeUInt8(Number(A) | (p ? 128 : 0), y++);
    } while (p);
    return y;
  }
  function b(p, T) {
    const { value: d, size: y } = e(p, T);
    return { value: d >>> 1 ^ -(d & 1), size: y };
  }
  function S(p) {
    return o(p << 1 ^ p >> 31);
  }
  function s(p, T, d) {
    return l(p << 1 ^ p >> 31, T, d);
  }
  function v(p, T) {
    const { value: d, size: y } = r(p, T);
    return { value: d >> 1n ^ -(d & 1n), size: y };
  }
  function E(p) {
    return f(BigInt(p) << 1n ^ BigInt(p) >> 63n);
  }
  function q(p, T, d) {
    return u(BigInt(p) << 1n ^ BigInt(p) >> 63n, T, d);
  }
  return varint;
}
var utils$1, hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  const { getCount: t, sendCount: e, calcCount: o, PartialReadError: l } = requireUtils$2();
  utils$1 = {
    bool: [v, E, 1, require$$1$2.bool],
    pstring: [b, S, s, require$$1$2.pstring],
    buffer: [q, p, T, require$$1$2.buffer],
    void: [d, y, 0, require$$1$2.void],
    bitfield: [w, I, R, require$$1$2.bitfield],
    bitflags: [Q, C, W, require$$1$2.bitflags],
    cstring: [F, x, M, require$$1$2.cstring],
    mapper: [n, f, u, require$$1$2.mapper],
    ...requireVarint()
  };
  function r(h, $) {
    return h === $ || parseInt(h) === parseInt($);
  }
  function n(h, $, { type: ae, mappings: de }, Ee) {
    const { size: _e, value: ce } = this.read(h, $, ae, Ee);
    let fe = null;
    const k = Object.keys(de);
    for (let pe = 0; pe < k.length; pe++)
      if (r(k[pe], ce)) {
        fe = de[k[pe]];
        break;
      }
    if (fe == null) throw new Error(ce + " is not in the mappings value");
    return {
      size: _e,
      value: fe
    };
  }
  function f(h, $, ae, { type: de, mappings: Ee }, _e) {
    const ce = Object.keys(Ee);
    let fe = null;
    for (let k = 0; k < ce.length; k++)
      if (r(Ee[ce[k]], h)) {
        fe = ce[k];
        break;
      }
    if (fe == null) throw new Error(h + " is not in the mappings value");
    return this.write(fe, $, ae, de, _e);
  }
  function u(h, { type: $, mappings: ae }, de) {
    const Ee = Object.keys(ae);
    let _e = null;
    for (let ce = 0; ce < Ee.length; ce++)
      if (r(ae[Ee[ce]], h)) {
        _e = Ee[ce];
        break;
      }
    if (_e == null) throw new Error(h + " is not in the mappings value");
    return this.sizeOf(_e, $, de);
  }
  function b(h, $, ae, de) {
    const { size: Ee, count: _e } = t.call(this, h, $, ae, de), ce = $ + Ee, fe = ce + _e;
    if (fe > h.length)
      throw new l("Missing characters in string, found size is " + h.length + " expected size was " + fe);
    return {
      value: h.toString(ae.encoding || "utf8", ce, fe),
      size: fe - $
    };
  }
  function S(h, $, ae, de, Ee) {
    const _e = Buffer.byteLength(h, "utf8");
    return ae = e.call(this, _e, $, ae, de, Ee), $.write(h, ae, _e, de.encoding || "utf8"), ae + _e;
  }
  function s(h, $, ae) {
    const de = Buffer.byteLength(h, $.encoding || "utf8");
    return o.call(this, de, $, ae) + de;
  }
  function v(h, $) {
    if ($ + 1 > h.length) throw new l();
    return {
      value: !!h.readInt8($),
      size: 1
    };
  }
  function E(h, $, ae) {
    return $.writeInt8(+h, ae), ae + 1;
  }
  function q(h, $, ae, de) {
    const { size: Ee, count: _e } = t.call(this, h, $, ae, de);
    if ($ += Ee, $ + _e > h.length) throw new l();
    return {
      value: h.slice($, $ + _e),
      size: Ee + _e
    };
  }
  function p(h, $, ae, de, Ee) {
    return h instanceof Buffer || (h = Buffer.from(h)), ae = e.call(this, h.length, $, ae, de, Ee), h.copy($, ae), ae + h.length;
  }
  function T(h, $, ae) {
    return h instanceof Buffer || (h = Buffer.from(h)), o.call(this, h.length, $, ae) + h.length;
  }
  function d() {
    return {
      value: void 0,
      size: 0
    };
  }
  function y(h, $, ae) {
    return ae;
  }
  function A(h) {
    return (1 << h) - 1;
  }
  function w(h, $, ae) {
    const de = $;
    let Ee = null, _e = 0;
    const ce = {};
    return ce.value = ae.reduce((fe, { size: k, signed: pe, name: ee }) => {
      let J = k, G = 0;
      for (; J > 0; ) {
        if (_e === 0) {
          if (h.length < $ + 1)
            throw new l();
          Ee = h[$++], _e = 8;
        }
        const ue = Math.min(J, _e);
        G = G << ue | (Ee & A(_e)) >> _e - ue, _e -= ue, J -= ue;
      }
      return pe && G >= 1 << k - 1 && (G -= 1 << k), fe[ee] = G, fe;
    }, {}), ce.size = $ - de, ce;
  }
  function I(h, $, ae, de) {
    let Ee = 0, _e = 0;
    return de.forEach(({ size: ce, signed: fe, name: k }) => {
      const pe = h[k];
      if (!fe && pe < 0 || fe && pe < -(1 << ce - 1))
        throw new Error(h + " < " + fe ? -(1 << ce - 1) : 0);
      if (!fe && pe >= 1 << ce || fe && pe >= (1 << ce - 1) - 1)
        throw new Error(h + " >= " + fe ? 1 << ce : (1 << ce - 1) - 1);
      for (; ce > 0; ) {
        const ee = Math.min(8 - _e, ce);
        Ee = Ee << ee | pe >> ce - ee & A(ee), ce -= ee, _e += ee, _e === 8 && ($[ae++] = Ee, _e = 0, Ee = 0);
      }
    }), _e !== 0 && ($[ae++] = Ee << 8 - _e), ae;
  }
  function R(h, $) {
    return Math.ceil($.reduce((ae, { size: de }) => ae + de, 0) / 8);
  }
  function F(h, $, ae) {
    let de = 0;
    for (; $ + de < h.length && h[$ + de] !== 0; )
      de++;
    if (h.length < $ + de + 1)
      throw new l();
    return {
      value: h.toString((ae == null ? void 0 : ae.encoding) || "utf8", $, $ + de),
      size: de + 1
    };
  }
  function x(h, $, ae, de) {
    const Ee = Buffer.byteLength(h, (de == null ? void 0 : de.encoding) || "utf8");
    return $.write(h, ae, Ee, (de == null ? void 0 : de.encoding) || "utf8"), ae += Ee, $.writeInt8(0, ae), ae + 1;
  }
  function M(h) {
    return Buffer.byteLength(h, "utf8") + 1;
  }
  function Q(h, $, { type: ae, flags: de, shift: Ee, big: _e }, ce) {
    const { size: fe, value: k } = this.read(h, $, ae, ce);
    let pe = {};
    if (Array.isArray(de))
      for (const [J, G] of Object.entries(de))
        pe[G] = _e ? 1n << BigInt(J) : 1 << J;
    else if (Ee)
      for (const J in de)
        pe[J] = _e ? 1n << BigInt(de[J]) : 1 << de[J];
    else
      pe = de;
    const ee = { _value: k };
    for (const J in pe)
      ee[J] = (k & pe[J]) === pe[J];
    return { value: ee, size: fe };
  }
  function C(h, $, ae, { type: de, flags: Ee, shift: _e, big: ce }, fe) {
    let k = {};
    if (Array.isArray(Ee))
      for (const [ee, J] of Object.entries(Ee))
        k[J] = ce ? 1n << BigInt(ee) : 1 << ee;
    else if (_e)
      for (const ee in Ee)
        k[ee] = ce ? 1n << BigInt(Ee[ee]) : 1 << Ee[ee];
    else
      k = Ee;
    let pe = h._value || (ce ? 0n : 0);
    for (const ee in k)
      h[ee] && (pe |= k[ee]);
    return this.write(pe, $, ae, de, fe);
  }
  function W(h, { type: $, flags: ae, shift: de, big: Ee }, _e) {
    if (!h) throw new Error("Missing field");
    let ce = {};
    if (Array.isArray(ae))
      for (const [k, pe] of Object.entries(ae))
        ce[pe] = Ee ? 1n << BigInt(k) : 1 << k;
    else if (de)
      for (const k in ae)
        ce[k] = Ee ? 1n << BigInt(ae[k]) : 1 << ae[k];
    else
      ce = ae;
    let fe = h._value || (Ee ? 0n : 0);
    for (const k in ce)
      h[k] && (fe |= ce[k]);
    return this.sizeOf(fe, $, _e);
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
  const { getField: t, getCount: e, sendCount: o, calcCount: l, tryDoc: r } = requireUtils$2();
  structures = {
    array: [n, f, u, require$$1$1.array],
    count: [v, E, q, require$$1$1.count],
    container: [b, S, s, require$$1$1.container]
  };
  function n(p, T, d, y) {
    const A = {
      value: [],
      size: 0
    };
    let w, { count: I, size: R } = e.call(this, p, T, d, y);
    T += R, A.size += R;
    for (let F = 0; F < I; F++)
      ({ size: R, value: w } = r(() => this.read(p, T, d.type, y), F)), A.size += R, T += R, A.value.push(w);
    return A;
  }
  function f(p, T, d, y, A) {
    return d = o.call(this, p.length, T, d, y, A), p.reduce((w, I, R) => r(() => this.write(I, T, w, y.type, A), R), d);
  }
  function u(p, T, d) {
    let y = l.call(this, p.length, T, d);
    return y = p.reduce((A, w, I) => r(() => A + this.sizeOf(w, T.type, d), I), y), y;
  }
  function b(p, T, d, y) {
    const A = {
      value: { "..": y },
      size: 0
    };
    return d.forEach(({ type: w, name: I, anon: R }) => {
      r(() => {
        const F = this.read(p, T, w, A.value);
        A.size += F.size, T += F.size, R ? F.value !== void 0 && Object.keys(F.value).forEach((x) => {
          A.value[x] = F.value[x];
        }) : A.value[I] = F.value;
      }, I || "unknown");
    }), delete A.value[".."], A;
  }
  function S(p, T, d, y, A) {
    return p[".."] = A, d = y.reduce((w, { type: I, name: R, anon: F }) => r(() => this.write(F ? p : p[R], T, w, I, p), R || "unknown"), d), delete p[".."], d;
  }
  function s(p, T, d) {
    p[".."] = d;
    const y = T.reduce((A, { type: w, name: I, anon: R }) => A + r(() => this.sizeOf(R ? p : p[I], w, p), I || "unknown"), 0);
    return delete p[".."], y;
  }
  function v(p, T, { type: d }, y) {
    return this.read(p, T, d, y);
  }
  function E(p, T, d, { countFor: y, type: A }, w) {
    return this.write(t(y, w).length, T, d, A, w);
  }
  function q(p, { countFor: T, type: d }, y) {
    return this.sizeOf(t(T, y).length, d, y);
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
  const { getField: t, getFieldInfo: e, tryDoc: o, PartialReadError: l } = requireUtils$2();
  conditional = {
    switch: [r, n, f, require$$1.switch],
    option: [u, b, S, require$$1.option]
  };
  function r(s, v, { compareTo: E, fields: q, compareToValue: p, default: T }, d) {
    if (E = p !== void 0 ? p : t(E, d), typeof q[E] > "u" && typeof T > "u")
      throw new Error(E + " has no associated fieldInfo in switch");
    for (const I in q)
      I.startsWith("/") && (q[this.types[I.slice(1)]] = q[I], delete q[I]);
    const y = typeof q[E] > "u", A = y ? T : q[E], w = e(A);
    return o(() => this.read(s, v, w, d), y ? "default" : E);
  }
  function n(s, v, E, { compareTo: q, fields: p, compareToValue: T, default: d }, y) {
    if (q = T !== void 0 ? T : t(q, y), typeof p[q] > "u" && typeof d > "u")
      throw new Error(q + " has no associated fieldInfo in switch");
    for (const I in p)
      I.startsWith("/") && (p[this.types[I.slice(1)]] = p[I], delete p[I]);
    const A = typeof p[q] > "u", w = e(A ? d : p[q]);
    return o(() => this.write(s, v, E, w, y), A ? "default" : q);
  }
  function f(s, { compareTo: v, fields: E, compareToValue: q, default: p }, T) {
    if (v = q !== void 0 ? q : t(v, T), typeof E[v] > "u" && typeof p > "u")
      throw new Error(v + " has no associated fieldInfo in switch");
    for (const A in E)
      A.startsWith("/") && (E[this.types[A.slice(1)]] = E[A], delete E[A]);
    const d = typeof E[v] > "u", y = e(d ? p : E[v]);
    return o(() => this.sizeOf(s, y, T), d ? "default" : v);
  }
  function u(s, v, E, q) {
    if (s.length < v + 1)
      throw new l();
    if (s.readUInt8(v++) !== 0) {
      const T = this.read(s, v, E, q);
      return T.size++, T;
    } else
      return { size: 1 };
  }
  function b(s, v, E, q, p) {
    return s != null ? (v.writeUInt8(1, E++), E = this.write(s, v, E, q, p)) : v.writeUInt8(0, E++), E;
  }
  function S(s, v, E) {
    return s == null ? 1 : this.sizeOf(s, v, E) + 1;
  }
  return conditional;
}
var protodef$1, hasRequiredProtodef$1;
function requireProtodef$1() {
  if (hasRequiredProtodef$1) return protodef$1;
  hasRequiredProtodef$1 = 1;
  const { getFieldInfo: t, tryCatch: e } = requireUtils$2(), o = requireLodash_reduce(), l = requireProtodefValidator();
  function r(S) {
    return typeof S == "string" || Array.isArray(S) && typeof S[0] == "string" || S.type;
  }
  function n(S, s, v) {
    return typeof s == "string" && s.charAt(0) === "$" ? S.push({ path: v, val: s.substr(1) }) : (Array.isArray(s) || typeof s == "object") && (S = S.concat(o(s, n, []).map((E) => ({ path: v + "." + E.path, val: E.val })))), S;
  }
  function f(S, s, v) {
    const E = S.split(".").reverse();
    for (; E.length > 1; )
      v = v[E.pop()];
    v[E.pop()] = s;
  }
  function u(S, s) {
    const v = JSON.stringify(s), E = o(s, n, []);
    function q(p) {
      const T = JSON.parse(v);
      return E.forEach((d) => {
        f(d.path, p[d.val], T);
      }), T;
    }
    return [function(T, d, y, A) {
      return S[0].call(this, T, d, q(y), A);
    }, function(T, d, y, A, w) {
      return S[1].call(this, T, d, y, q(A), w);
    }, function(T, d, y) {
      return typeof S[2] == "function" ? S[2].call(this, T, q(d), y) : S[2];
    }];
  }
  class b {
    constructor(s = !0) {
      this.types = {}, this.validator = s ? new l() : null, this.addDefaultTypes();
    }
    addDefaultTypes() {
      this.addTypes(requireNumeric()), this.addTypes(requireUtils$1()), this.addTypes(requireStructures()), this.addTypes(requireConditional());
    }
    addProtocol(s, v) {
      const E = this;
      function q(p, T) {
        p !== void 0 && (p.types && E.addTypes(p.types), q(p == null ? void 0 : p[T[0]], T.slice(1)));
      }
      this.validator && this.validator.validateProtocol(s), q(s, v);
    }
    addType(s, v, E = !0) {
      if (v === "native") {
        this.validator && this.validator.addType(s);
        return;
      }
      if (r(v)) {
        this.validator && (E && this.validator.validateType(v), this.validator.addType(s));
        const { type: q, typeArgs: p } = t(v);
        this.types[s] = p ? u(this.types[q], p) : this.types[q];
      } else
        this.validator && (v[3] ? this.validator.addType(s, v[3]) : this.validator.addType(s)), this.types[s] = v;
    }
    addTypes(s) {
      Object.keys(s).forEach((v) => this.addType(v, s[v], !1)), this.validator && Object.keys(s).forEach((v) => {
        r(s[v]) && this.validator.validateType(s[v]);
      });
    }
    setVariable(s, v) {
      this.types[s] = v;
    }
    read(s, v, E, q) {
      const { type: p, typeArgs: T } = t(E), d = this.types[p];
      if (!d)
        throw new Error("missing data type: " + p);
      return d[0].call(this, s, v, T, q);
    }
    write(s, v, E, q, p) {
      const { type: T, typeArgs: d } = t(q), y = this.types[T];
      if (!y)
        throw new Error("missing data type: " + T);
      return y[1].call(this, s, v, E, d, p);
    }
    sizeOf(s, v, E) {
      const { type: q, typeArgs: p } = t(v), T = this.types[q];
      if (!T)
        throw new Error("missing data type: " + q);
      return typeof T[2] == "function" ? T[2].call(this, s, p, E) : T[2];
    }
    createPacketBuffer(s, v) {
      const E = e(
        () => this.sizeOf(v, s, {}),
        (p) => {
          throw p.message = `SizeOf error for ${p.field} : ${p.message}`, p;
        }
      ), q = Buffer.allocUnsafe(E);
      return e(
        () => this.write(v, q, 0, s, {}),
        (p) => {
          throw p.message = `Write error for ${p.field} : ${p.message}`, p;
        }
      ), q;
    }
    parsePacketBuffer(s, v, E = 0) {
      const { value: q, size: p } = e(
        () => this.read(v, E, s, {}),
        (T) => {
          throw T.message = `Read error for ${T.field} : ${T.message}`, T;
        }
      );
      return {
        data: q,
        metadata: {
          size: p
        },
        buffer: v.slice(0, p),
        fullBuffer: v
      };
    }
  }
  return protodef$1 = b, protodef$1;
}
var browser$2 = { exports: {} }, stream = { exports: {} }, primordials, hasRequiredPrimordials;
function requirePrimordials() {
  if (hasRequiredPrimordials) return primordials;
  hasRequiredPrimordials = 1;
  class t extends Error {
    constructor(o) {
      if (!Array.isArray(o))
        throw new TypeError(`Expected input to be an Array, got ${typeof o}`);
      let l = "";
      for (let r = 0; r < o.length; r++)
        l += `    ${o[r].stack}
`;
      super(l), this.name = "AggregateError", this.errors = o;
    }
  }
  return primordials = {
    AggregateError: t,
    ArrayIsArray(e) {
      return Array.isArray(e);
    },
    ArrayPrototypeIncludes(e, o) {
      return e.includes(o);
    },
    ArrayPrototypeIndexOf(e, o) {
      return e.indexOf(o);
    },
    ArrayPrototypeJoin(e, o) {
      return e.join(o);
    },
    ArrayPrototypeMap(e, o) {
      return e.map(o);
    },
    ArrayPrototypePop(e, o) {
      return e.pop(o);
    },
    ArrayPrototypePush(e, o) {
      return e.push(o);
    },
    ArrayPrototypeSlice(e, o, l) {
      return e.slice(o, l);
    },
    Error,
    FunctionPrototypeCall(e, o, ...l) {
      return e.call(o, ...l);
    },
    FunctionPrototypeSymbolHasInstance(e, o) {
      return Function.prototype[Symbol.hasInstance].call(e, o);
    },
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties(e, o) {
      return Object.defineProperties(e, o);
    },
    ObjectDefineProperty(e, o, l) {
      return Object.defineProperty(e, o, l);
    },
    ObjectGetOwnPropertyDescriptor(e, o) {
      return Object.getOwnPropertyDescriptor(e, o);
    },
    ObjectKeys(e) {
      return Object.keys(e);
    },
    ObjectSetPrototypeOf(e, o) {
      return Object.setPrototypeOf(e, o);
    },
    Promise,
    PromisePrototypeCatch(e, o) {
      return e.catch(o);
    },
    PromisePrototypeThen(e, o, l) {
      return e.then(o, l);
    },
    PromiseReject(e) {
      return Promise.reject(e);
    },
    PromiseResolve(e) {
      return Promise.resolve(e);
    },
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest(e, o) {
      return e.test(o);
    },
    SafeSet: Set,
    String,
    StringPrototypeSlice(e, o, l) {
      return e.slice(o, l);
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
    TypedArrayPrototypeSet(e, o, l) {
      return e.set(o, l);
    },
    Boolean,
    Uint8Array
  }, primordials;
}
var util = { exports: {} }, inspect, hasRequiredInspect;
function requireInspect() {
  return hasRequiredInspect || (hasRequiredInspect = 1, inspect = {
    format(t, ...e) {
      return t.replace(/%([sdifj])/g, function(...[o, l]) {
        const r = e.shift();
        return l === "f" ? r.toFixed(6) : l === "j" ? JSON.stringify(r) : l === "s" && typeof r == "object" ? `${r.constructor !== Object ? r.constructor.name : ""} {}`.trim() : r.toString();
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
  const { format: t, inspect: e } = requireInspect(), { AggregateError: o } = requirePrimordials(), l = globalThis.AggregateError || o, r = Symbol("kIsNodeError"), n = [
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
  ], f = /^([A-Z][a-z0-9]*)+$/, u = "__node_internal_", b = {};
  function S(d, y) {
    if (!d)
      throw new b.ERR_INTERNAL_ASSERTION(y);
  }
  function s(d) {
    let y = "", A = d.length;
    const w = d[0] === "-" ? 1 : 0;
    for (; A >= w + 4; A -= 3)
      y = `_${d.slice(A - 3, A)}${y}`;
    return `${d.slice(0, A)}${y}`;
  }
  function v(d, y, A) {
    if (typeof y == "function")
      return S(
        y.length <= A.length,
        // Default options do not count.
        `Code: ${d}; The provided arguments length (${A.length}) does not match the required ones (${y.length}).`
      ), y(...A);
    const w = (y.match(/%[dfijoOs]/g) || []).length;
    return S(
      w === A.length,
      `Code: ${d}; The provided arguments length (${A.length}) does not match the required ones (${w}).`
    ), A.length === 0 ? y : t(y, ...A);
  }
  function E(d, y, A) {
    A || (A = Error);
    class w extends A {
      constructor(...R) {
        super(v(d, y, R));
      }
      toString() {
        return `${this.name} [${d}]: ${this.message}`;
      }
    }
    Object.defineProperties(w.prototype, {
      name: {
        value: A.name,
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
    }), w.prototype.code = d, w.prototype[r] = !0, b[d] = w;
  }
  function q(d) {
    const y = u + d.name;
    return Object.defineProperty(d, "name", {
      value: y
    }), d;
  }
  function p(d, y) {
    if (d && y && d !== y) {
      if (Array.isArray(y.errors))
        return y.errors.push(d), y;
      const A = new l([y, d], y.message);
      return A.code = y.code, A;
    }
    return d || y;
  }
  class T extends Error {
    constructor(y = "The operation was aborted", A = void 0) {
      if (A !== void 0 && typeof A != "object")
        throw new b.ERR_INVALID_ARG_TYPE("options", "Object", A);
      super(y, A), this.code = "ABORT_ERR", this.name = "AbortError";
    }
  }
  return E("ERR_ASSERTION", "%s", Error), E(
    "ERR_INVALID_ARG_TYPE",
    (d, y, A) => {
      S(typeof d == "string", "'name' must be a string"), Array.isArray(y) || (y = [y]);
      let w = "The ";
      d.endsWith(" argument") ? w += `${d} ` : w += `"${d}" ${d.includes(".") ? "property" : "argument"} `, w += "must be ";
      const I = [], R = [], F = [];
      for (const M of y)
        S(typeof M == "string", "All expected entries have to be of type string"), n.includes(M) ? I.push(M.toLowerCase()) : f.test(M) ? R.push(M) : (S(M !== "object", 'The value "object" should be written as "Object"'), F.push(M));
      if (R.length > 0) {
        const M = I.indexOf("object");
        M !== -1 && (I.splice(I, M, 1), R.push("Object"));
      }
      if (I.length > 0) {
        switch (I.length) {
          case 1:
            w += `of type ${I[0]}`;
            break;
          case 2:
            w += `one of type ${I[0]} or ${I[1]}`;
            break;
          default: {
            const M = I.pop();
            w += `one of type ${I.join(", ")}, or ${M}`;
          }
        }
        (R.length > 0 || F.length > 0) && (w += " or ");
      }
      if (R.length > 0) {
        switch (R.length) {
          case 1:
            w += `an instance of ${R[0]}`;
            break;
          case 2:
            w += `an instance of ${R[0]} or ${R[1]}`;
            break;
          default: {
            const M = R.pop();
            w += `an instance of ${R.join(", ")}, or ${M}`;
          }
        }
        F.length > 0 && (w += " or ");
      }
      switch (F.length) {
        case 0:
          break;
        case 1:
          F[0].toLowerCase() !== F[0] && (w += "an "), w += `${F[0]}`;
          break;
        case 2:
          w += `one of ${F[0]} or ${F[1]}`;
          break;
        default: {
          const M = F.pop();
          w += `one of ${F.join(", ")}, or ${M}`;
        }
      }
      if (A == null)
        w += `. Received ${A}`;
      else if (typeof A == "function" && A.name)
        w += `. Received function ${A.name}`;
      else if (typeof A == "object") {
        var x;
        if ((x = A.constructor) !== null && x !== void 0 && x.name)
          w += `. Received an instance of ${A.constructor.name}`;
        else {
          const M = e(A, {
            depth: -1
          });
          w += `. Received ${M}`;
        }
      } else {
        let M = e(A, {
          colors: !1
        });
        M.length > 25 && (M = `${M.slice(0, 25)}...`), w += `. Received type ${typeof A} (${M})`;
      }
      return w;
    },
    TypeError
  ), E(
    "ERR_INVALID_ARG_VALUE",
    (d, y, A = "is invalid") => {
      let w = e(y);
      return w.length > 128 && (w = w.slice(0, 128) + "..."), `The ${d.includes(".") ? "property" : "argument"} '${d}' ${A}. Received ${w}`;
    },
    TypeError
  ), E(
    "ERR_INVALID_RETURN_VALUE",
    (d, y, A) => {
      var w;
      const I = A != null && (w = A.constructor) !== null && w !== void 0 && w.name ? `instance of ${A.constructor.name}` : `type ${typeof A}`;
      return `Expected ${d} to be returned from the "${y}" function but got ${I}.`;
    },
    TypeError
  ), E(
    "ERR_MISSING_ARGS",
    (...d) => {
      S(d.length > 0, "At least one arg needs to be specified");
      let y;
      const A = d.length;
      switch (d = (Array.isArray(d) ? d : [d]).map((w) => `"${w}"`).join(" or "), A) {
        case 1:
          y += `The ${d[0]} argument`;
          break;
        case 2:
          y += `The ${d[0]} and ${d[1]} arguments`;
          break;
        default:
          {
            const w = d.pop();
            y += `The ${d.join(", ")}, and ${w} arguments`;
          }
          break;
      }
      return `${y} must be specified`;
    },
    TypeError
  ), E(
    "ERR_OUT_OF_RANGE",
    (d, y, A) => {
      S(y, 'Missing "range" argument');
      let w;
      if (Number.isInteger(A) && Math.abs(A) > 2 ** 32)
        w = s(String(A));
      else if (typeof A == "bigint") {
        w = String(A);
        const I = BigInt(2) ** BigInt(32);
        (A > I || A < -I) && (w = s(w)), w += "n";
      } else
        w = e(A);
      return `The value of "${d}" is out of range. It must be ${y}. Received ${w}`;
    },
    RangeError
  ), E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error), E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error), E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error), E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error), E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error), E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error), E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error), E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error), E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error), E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError), errors = {
    AbortError: T,
    aggregateTwoErrors: q(p),
    hideStackFrames: q,
    codes: b
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
    const e = requireDist(), { format: o, inspect: l } = requireInspect(), {
      codes: { ERR_INVALID_ARG_TYPE: r }
    } = requireErrors(), { kResistStopPropagation: n, AggregateError: f, SymbolDispose: u } = requirePrimordials(), b = globalThis.AbortSignal || requireBrowser$2().AbortSignal, S = globalThis.AbortController || requireBrowser$2().AbortController, s = Object.getPrototypeOf(async function() {
    }).constructor, v = globalThis.Blob || e.Blob, E = typeof v < "u" ? function(d) {
      return d instanceof v;
    } : function(d) {
      return !1;
    }, q = (T, d) => {
      if (T !== void 0 && (T === null || typeof T != "object" || !("aborted" in T)))
        throw new r(d, "AbortSignal", T);
    }, p = (T, d) => {
      if (typeof T != "function")
        throw new r(d, "Function", T);
    };
    t.exports = {
      AggregateError: f,
      kEmptyObject: Object.freeze({}),
      once(T) {
        let d = !1;
        return function(...y) {
          d || (d = !0, T.apply(this, y));
        };
      },
      createDeferredPromise: function() {
        let T, d;
        return {
          promise: new Promise((A, w) => {
            T = A, d = w;
          }),
          resolve: T,
          reject: d
        };
      },
      promisify(T) {
        return new Promise((d, y) => {
          T((A, ...w) => A ? y(A) : d(...w));
        });
      },
      debuglog() {
        return function() {
        };
      },
      format: o,
      inspect: l,
      types: {
        isAsyncFunction(T) {
          return T instanceof s;
        },
        isArrayBufferView(T) {
          return ArrayBuffer.isView(T);
        }
      },
      isBlob: E,
      deprecate(T, d) {
        return T;
      },
      addAbortListener: requireEvents().addAbortListener || function(d, y) {
        if (d === void 0)
          throw new r("signal", "AbortSignal", d);
        q(d, "signal"), p(y, "listener");
        let A;
        return d.aborted ? queueMicrotask(() => y()) : (d.addEventListener("abort", y, {
          __proto__: null,
          once: !0,
          [n]: !0
        }), A = () => {
          d.removeEventListener("abort", y);
        }), {
          __proto__: null,
          [u]() {
            var w;
            (w = A) === null || w === void 0 || w();
          }
        };
      },
      AbortSignalAny: b.any || function(d) {
        if (d.length === 1)
          return d[0];
        const y = new S(), A = () => y.abort();
        return d.forEach((w) => {
          q(w, "signals"), w.addEventListener("abort", A, {
            once: !0
          });
        }), y.signal.addEventListener(
          "abort",
          () => {
            d.forEach((w) => w.removeEventListener("abort", A));
          },
          {
            once: !0
          }
        ), y.signal;
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
    ArrayPrototypeJoin: o,
    ArrayPrototypeMap: l,
    NumberIsInteger: r,
    NumberIsNaN: n,
    NumberMAX_SAFE_INTEGER: f,
    NumberMIN_SAFE_INTEGER: u,
    NumberParseInt: b,
    ObjectPrototypeHasOwnProperty: S,
    RegExpPrototypeExec: s,
    String: v,
    StringPrototypeToUpperCase: E,
    StringPrototypeTrim: q
  } = requirePrimordials(), {
    hideStackFrames: p,
    codes: { ERR_SOCKET_BAD_PORT: T, ERR_INVALID_ARG_TYPE: d, ERR_INVALID_ARG_VALUE: y, ERR_OUT_OF_RANGE: A, ERR_UNKNOWN_SIGNAL: w }
  } = requireErrors(), { normalizeEncoding: I } = requireUtil(), { isAsyncFunction: R, isArrayBufferView: F } = requireUtil().types, x = {};
  function M(te) {
    return te === (te | 0);
  }
  function Q(te) {
    return te === te >>> 0;
  }
  const C = /^[0-7]+$/, W = "must be a 32-bit unsigned integer or an octal string";
  function h(te, Fe, Ce) {
    if (typeof te > "u" && (te = Ce), typeof te == "string") {
      if (s(C, te) === null)
        throw new y(Fe, te, W);
      te = b(te, 8);
    }
    return de(te, Fe), te;
  }
  const $ = p((te, Fe, Ce = u, qe = f) => {
    if (typeof te != "number") throw new d(Fe, "number", te);
    if (!r(te)) throw new A(Fe, "an integer", te);
    if (te < Ce || te > qe) throw new A(Fe, `>= ${Ce} && <= ${qe}`, te);
  }), ae = p((te, Fe, Ce = -2147483648, qe = 2147483647) => {
    if (typeof te != "number")
      throw new d(Fe, "number", te);
    if (!r(te))
      throw new A(Fe, "an integer", te);
    if (te < Ce || te > qe)
      throw new A(Fe, `>= ${Ce} && <= ${qe}`, te);
  }), de = p((te, Fe, Ce = !1) => {
    if (typeof te != "number")
      throw new d(Fe, "number", te);
    if (!r(te))
      throw new A(Fe, "an integer", te);
    const qe = Ce ? 1 : 0, Ue = 4294967295;
    if (te < qe || te > Ue)
      throw new A(Fe, `>= ${qe} && <= ${Ue}`, te);
  });
  function Ee(te, Fe) {
    if (typeof te != "string") throw new d(Fe, "string", te);
  }
  function _e(te, Fe, Ce = void 0, qe) {
    if (typeof te != "number") throw new d(Fe, "number", te);
    if (Ce != null && te < Ce || qe != null && te > qe || (Ce != null || qe != null) && n(te))
      throw new A(
        Fe,
        `${Ce != null ? `>= ${Ce}` : ""}${Ce != null && qe != null ? " && " : ""}${qe != null ? `<= ${qe}` : ""}`,
        te
      );
  }
  const ce = p((te, Fe, Ce) => {
    if (!e(Ce, te)) {
      const Ue = "must be one of: " + o(
        l(Ce, (me) => typeof me == "string" ? `'${me}'` : v(me)),
        ", "
      );
      throw new y(Fe, te, Ue);
    }
  });
  function fe(te, Fe) {
    if (typeof te != "boolean") throw new d(Fe, "boolean", te);
  }
  function k(te, Fe, Ce) {
    return te == null || !S(te, Fe) ? Ce : te[Fe];
  }
  const pe = p((te, Fe, Ce = null) => {
    const qe = k(Ce, "allowArray", !1), Ue = k(Ce, "allowFunction", !1);
    if (!k(Ce, "nullable", !1) && te === null || !qe && t(te) || typeof te != "object" && (!Ue || typeof te != "function"))
      throw new d(Fe, "Object", te);
  }), ee = p((te, Fe) => {
    if (te != null && typeof te != "object" && typeof te != "function")
      throw new d(Fe, "a dictionary", te);
  }), J = p((te, Fe, Ce = 0) => {
    if (!t(te))
      throw new d(Fe, "Array", te);
    if (te.length < Ce) {
      const qe = `must be longer than ${Ce}`;
      throw new y(Fe, te, qe);
    }
  });
  function G(te, Fe) {
    J(te, Fe);
    for (let Ce = 0; Ce < te.length; Ce++)
      Ee(te[Ce], `${Fe}[${Ce}]`);
  }
  function ue(te, Fe) {
    J(te, Fe);
    for (let Ce = 0; Ce < te.length; Ce++)
      fe(te[Ce], `${Fe}[${Ce}]`);
  }
  function O(te, Fe) {
    J(te, Fe);
    for (let Ce = 0; Ce < te.length; Ce++) {
      const qe = te[Ce], Ue = `${Fe}[${Ce}]`;
      if (qe == null)
        throw new d(Ue, "AbortSignal", qe);
      D(qe, Ue);
    }
  }
  function B(te, Fe = "signal") {
    if (Ee(te, Fe), x[te] === void 0)
      throw x[E(te)] !== void 0 ? new w(te + " (signals must use all capital letters)") : new w(te);
  }
  const N = p((te, Fe = "buffer") => {
    if (!F(te))
      throw new d(Fe, ["Buffer", "TypedArray", "DataView"], te);
  });
  function re(te, Fe) {
    const Ce = I(Fe), qe = te.length;
    if (Ce === "hex" && qe % 2 !== 0)
      throw new y("encoding", Fe, `is invalid for data of length ${qe}`);
  }
  function ne(te, Fe = "Port", Ce = !0) {
    if (typeof te != "number" && typeof te != "string" || typeof te == "string" && q(te).length === 0 || +te !== +te >>> 0 || te > 65535 || te === 0 && !Ce)
      throw new T(Fe, te, Ce);
    return te | 0;
  }
  const D = p((te, Fe) => {
    if (te !== void 0 && (te === null || typeof te != "object" || !("aborted" in te)))
      throw new d(Fe, "AbortSignal", te);
  }), L = p((te, Fe) => {
    if (typeof te != "function") throw new d(Fe, "Function", te);
  }), H = p((te, Fe) => {
    if (typeof te != "function" || R(te)) throw new d(Fe, "Function", te);
  }), se = p((te, Fe) => {
    if (te !== void 0) throw new d(Fe, "undefined", te);
  });
  function we(te, Fe, Ce) {
    if (!e(Ce, te))
      throw new d(Fe, `('${o(Ce, "|")}')`, te);
  }
  const Re = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function Ae(te, Fe) {
    if (typeof te > "u" || !s(Re, te))
      throw new y(
        Fe,
        te,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"'
      );
  }
  function Oe(te) {
    if (typeof te == "string")
      return Ae(te, "hints"), te;
    if (t(te)) {
      const Fe = te.length;
      let Ce = "";
      if (Fe === 0)
        return Ce;
      for (let qe = 0; qe < Fe; qe++) {
        const Ue = te[qe];
        Ae(Ue, "hints"), Ce += Ue, qe !== Fe - 1 && (Ce += ", ");
      }
      return Ce;
    }
    throw new y(
      "hints",
      te,
      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
    );
  }
  return validators = {
    isInt32: M,
    isUint32: Q,
    parseFileMode: h,
    validateArray: J,
    validateStringArray: G,
    validateBooleanArray: ue,
    validateAbortSignalArray: O,
    validateBoolean: fe,
    validateBuffer: N,
    validateDictionary: ee,
    validateEncoding: re,
    validateFunction: L,
    validateInt32: ae,
    validateInteger: $,
    validateNumber: _e,
    validateObject: pe,
    validateOneOf: ce,
    validatePlainFunction: H,
    validatePort: ne,
    validateSignalName: B,
    validateString: Ee,
    validateUint32: de,
    validateUndefined: se,
    validateUnion: we,
    validateAbortSignal: D,
    validateLinkHeaderValue: Oe
  }, validators;
}
var endOfStream = { exports: {} }, browser = { exports: {} }, hasRequiredBrowser$1;
function requireBrowser$1() {
  if (hasRequiredBrowser$1) return browser.exports;
  hasRequiredBrowser$1 = 1;
  var t = browser.exports = {}, e, o;
  function l() {
    throw new Error("setTimeout has not been defined");
  }
  function r() {
    throw new Error("clearTimeout has not been defined");
  }
  (function() {
    try {
      typeof setTimeout == "function" ? e = setTimeout : e = l;
    } catch {
      e = l;
    }
    try {
      typeof clearTimeout == "function" ? o = clearTimeout : o = r;
    } catch {
      o = r;
    }
  })();
  function n(T) {
    if (e === setTimeout)
      return setTimeout(T, 0);
    if ((e === l || !e) && setTimeout)
      return e = setTimeout, setTimeout(T, 0);
    try {
      return e(T, 0);
    } catch {
      try {
        return e.call(null, T, 0);
      } catch {
        return e.call(this, T, 0);
      }
    }
  }
  function f(T) {
    if (o === clearTimeout)
      return clearTimeout(T);
    if ((o === r || !o) && clearTimeout)
      return o = clearTimeout, clearTimeout(T);
    try {
      return o(T);
    } catch {
      try {
        return o.call(null, T);
      } catch {
        return o.call(this, T);
      }
    }
  }
  var u = [], b = !1, S, s = -1;
  function v() {
    !b || !S || (b = !1, S.length ? u = S.concat(u) : s = -1, u.length && E());
  }
  function E() {
    if (!b) {
      var T = n(v);
      b = !0;
      for (var d = u.length; d; ) {
        for (S = u, u = []; ++s < d; )
          S && S[s].run();
        s = -1, d = u.length;
      }
      S = null, b = !1, f(T);
    }
  }
  t.nextTick = function(T) {
    var d = new Array(arguments.length - 1);
    if (arguments.length > 1)
      for (var y = 1; y < arguments.length; y++)
        d[y - 1] = arguments[y];
    u.push(new q(T, d)), u.length === 1 && !b && n(E);
  };
  function q(T, d) {
    this.fun = T, this.array = d;
  }
  q.prototype.run = function() {
    this.fun.apply(null, this.array);
  }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {};
  function p() {
  }
  return t.on = p, t.addListener = p, t.once = p, t.off = p, t.removeListener = p, t.removeAllListeners = p, t.emit = p, t.prependListener = p, t.prependOnceListener = p, t.listeners = function(T) {
    return [];
  }, t.binding = function(T) {
    throw new Error("process.binding is not supported");
  }, t.cwd = function() {
    return "/";
  }, t.chdir = function(T) {
    throw new Error("process.chdir is not supported");
  }, t.umask = function() {
    return 0;
  }, browser.exports;
}
var utils, hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  const { SymbolAsyncIterator: t, SymbolIterator: e, SymbolFor: o } = requirePrimordials(), l = o("nodejs.stream.destroyed"), r = o("nodejs.stream.errored"), n = o("nodejs.stream.readable"), f = o("nodejs.stream.writable"), u = o("nodejs.stream.disturbed"), b = o("nodejs.webstream.isClosedPromise"), S = o("nodejs.webstream.controllerErrorFunction");
  function s(k, pe = !1) {
    var ee;
    return !!(k && typeof k.pipe == "function" && typeof k.on == "function" && (!pe || typeof k.pause == "function" && typeof k.resume == "function") && (!k._writableState || ((ee = k._readableState) === null || ee === void 0 ? void 0 : ee.readable) !== !1) && // Duplex
    (!k._writableState || k._readableState));
  }
  function v(k) {
    var pe;
    return !!(k && typeof k.write == "function" && typeof k.on == "function" && (!k._readableState || ((pe = k._writableState) === null || pe === void 0 ? void 0 : pe.writable) !== !1));
  }
  function E(k) {
    return !!(k && typeof k.pipe == "function" && k._readableState && typeof k.on == "function" && typeof k.write == "function");
  }
  function q(k) {
    return k && (k._readableState || k._writableState || typeof k.write == "function" && typeof k.on == "function" || typeof k.pipe == "function" && typeof k.on == "function");
  }
  function p(k) {
    return !!(k && !q(k) && typeof k.pipeThrough == "function" && typeof k.getReader == "function" && typeof k.cancel == "function");
  }
  function T(k) {
    return !!(k && !q(k) && typeof k.getWriter == "function" && typeof k.abort == "function");
  }
  function d(k) {
    return !!(k && !q(k) && typeof k.readable == "object" && typeof k.writable == "object");
  }
  function y(k) {
    return p(k) || T(k) || d(k);
  }
  function A(k, pe) {
    return k == null ? !1 : pe === !0 ? typeof k[t] == "function" : pe === !1 ? typeof k[e] == "function" : typeof k[t] == "function" || typeof k[e] == "function";
  }
  function w(k) {
    if (!q(k)) return null;
    const pe = k._writableState, ee = k._readableState, J = pe || ee;
    return !!(k.destroyed || k[l] || J != null && J.destroyed);
  }
  function I(k) {
    if (!v(k)) return null;
    if (k.writableEnded === !0) return !0;
    const pe = k._writableState;
    return pe != null && pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function R(k, pe) {
    if (!v(k)) return null;
    if (k.writableFinished === !0) return !0;
    const ee = k._writableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.finished) != "boolean" ? null : !!(ee.finished || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function F(k) {
    if (!s(k)) return null;
    if (k.readableEnded === !0) return !0;
    const pe = k._readableState;
    return !pe || pe.errored ? !1 : typeof (pe == null ? void 0 : pe.ended) != "boolean" ? null : pe.ended;
  }
  function x(k, pe) {
    if (!s(k)) return null;
    const ee = k._readableState;
    return ee != null && ee.errored ? !1 : typeof (ee == null ? void 0 : ee.endEmitted) != "boolean" ? null : !!(ee.endEmitted || pe === !1 && ee.ended === !0 && ee.length === 0);
  }
  function M(k) {
    return k && k[n] != null ? k[n] : typeof (k == null ? void 0 : k.readable) != "boolean" ? null : w(k) ? !1 : s(k) && k.readable && !x(k);
  }
  function Q(k) {
    return k && k[f] != null ? k[f] : typeof (k == null ? void 0 : k.writable) != "boolean" ? null : w(k) ? !1 : v(k) && k.writable && !I(k);
  }
  function C(k, pe) {
    return q(k) ? w(k) ? !0 : !((pe == null ? void 0 : pe.readable) !== !1 && M(k) || (pe == null ? void 0 : pe.writable) !== !1 && Q(k)) : null;
  }
  function W(k) {
    var pe, ee;
    return q(k) ? k.writableErrored ? k.writableErrored : (pe = (ee = k._writableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function h(k) {
    var pe, ee;
    return q(k) ? k.readableErrored ? k.readableErrored : (pe = (ee = k._readableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && pe !== void 0 ? pe : null : null;
  }
  function $(k) {
    if (!q(k))
      return null;
    if (typeof k.closed == "boolean")
      return k.closed;
    const pe = k._writableState, ee = k._readableState;
    return typeof (pe == null ? void 0 : pe.closed) == "boolean" || typeof (ee == null ? void 0 : ee.closed) == "boolean" ? (pe == null ? void 0 : pe.closed) || (ee == null ? void 0 : ee.closed) : typeof k._closed == "boolean" && ae(k) ? k._closed : null;
  }
  function ae(k) {
    return typeof k._closed == "boolean" && typeof k._defaultKeepAlive == "boolean" && typeof k._removedConnection == "boolean" && typeof k._removedContLen == "boolean";
  }
  function de(k) {
    return typeof k._sent100 == "boolean" && ae(k);
  }
  function Ee(k) {
    var pe;
    return typeof k._consuming == "boolean" && typeof k._dumped == "boolean" && ((pe = k.req) === null || pe === void 0 ? void 0 : pe.upgradeOrConnect) === void 0;
  }
  function _e(k) {
    if (!q(k)) return null;
    const pe = k._writableState, ee = k._readableState, J = pe || ee;
    return !J && de(k) || !!(J && J.autoDestroy && J.emitClose && J.closed === !1);
  }
  function ce(k) {
    var pe;
    return !!(k && ((pe = k[u]) !== null && pe !== void 0 ? pe : k.readableDidRead || k.readableAborted));
  }
  function fe(k) {
    var pe, ee, J, G, ue, O, B, N, re, ne;
    return !!(k && ((pe = (ee = (J = (G = (ue = (O = k[r]) !== null && O !== void 0 ? O : k.readableErrored) !== null && ue !== void 0 ? ue : k.writableErrored) !== null && G !== void 0 ? G : (B = k._readableState) === null || B === void 0 ? void 0 : B.errorEmitted) !== null && J !== void 0 ? J : (N = k._writableState) === null || N === void 0 ? void 0 : N.errorEmitted) !== null && ee !== void 0 ? ee : (re = k._readableState) === null || re === void 0 ? void 0 : re.errored) !== null && pe !== void 0 ? pe : !((ne = k._writableState) === null || ne === void 0) && ne.errored));
  }
  return utils = {
    isDestroyed: w,
    kIsDestroyed: l,
    isDisturbed: ce,
    kIsDisturbed: u,
    isErrored: fe,
    kIsErrored: r,
    isReadable: M,
    kIsReadable: n,
    kIsClosedPromise: b,
    kControllerErrorFunction: S,
    kIsWritable: f,
    isClosed: $,
    isDuplexNodeStream: E,
    isFinished: C,
    isIterable: A,
    isReadableNodeStream: s,
    isReadableStream: p,
    isReadableEnded: F,
    isReadableFinished: x,
    isReadableErrored: h,
    isNodeStream: q,
    isWebStream: y,
    isWritable: Q,
    isWritableNodeStream: v,
    isWritableStream: T,
    isWritableEnded: I,
    isWritableFinished: R,
    isWritableErrored: W,
    isServerRequest: Ee,
    isServerResponse: de,
    willEmitClose: _e,
    isTransformStream: d
  }, utils;
}
var hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream.exports;
  hasRequiredEndOfStream = 1;
  const t = requireBrowser$1(), { AbortError: e, codes: o } = requireErrors(), { ERR_INVALID_ARG_TYPE: l, ERR_STREAM_PREMATURE_CLOSE: r } = o, { kEmptyObject: n, once: f } = requireUtil(), { validateAbortSignal: u, validateFunction: b, validateObject: S, validateBoolean: s } = requireValidators(), { Promise: v, PromisePrototypeThen: E, SymbolDispose: q } = requirePrimordials(), {
    isClosed: p,
    isReadable: T,
    isReadableNodeStream: d,
    isReadableStream: y,
    isReadableFinished: A,
    isReadableErrored: w,
    isWritable: I,
    isWritableNodeStream: R,
    isWritableStream: F,
    isWritableFinished: x,
    isWritableErrored: M,
    isNodeStream: Q,
    willEmitClose: C,
    kIsClosedPromise: W
  } = requireUtils();
  let h;
  function $(ce) {
    return ce.setHeader && typeof ce.abort == "function";
  }
  const ae = () => {
  };
  function de(ce, fe, k) {
    var pe, ee;
    if (arguments.length === 2 ? (k = fe, fe = n) : fe == null ? fe = n : S(fe, "options"), b(k, "callback"), u(fe.signal, "options.signal"), k = f(k), y(ce) || F(ce))
      return Ee(ce, fe, k);
    if (!Q(ce))
      throw new l("stream", ["ReadableStream", "WritableStream", "Stream"], ce);
    const J = (pe = fe.readable) !== null && pe !== void 0 ? pe : d(ce), G = (ee = fe.writable) !== null && ee !== void 0 ? ee : R(ce), ue = ce._writableState, O = ce._readableState, B = () => {
      ce.writable || ne();
    };
    let N = C(ce) && d(ce) === J && R(ce) === G, re = x(ce, !1);
    const ne = () => {
      re = !0, ce.destroyed && (N = !1), !(N && (!ce.readable || J)) && (!J || D) && k.call(ce);
    };
    let D = A(ce, !1);
    const L = () => {
      D = !0, ce.destroyed && (N = !1), !(N && (!ce.writable || G)) && (!G || re) && k.call(ce);
    }, H = (te) => {
      k.call(ce, te);
    };
    let se = p(ce);
    const we = () => {
      se = !0;
      const te = M(ce) || w(ce);
      if (te && typeof te != "boolean")
        return k.call(ce, te);
      if (J && !D && d(ce, !0) && !A(ce, !1))
        return k.call(ce, new r());
      if (G && !re && !x(ce, !1))
        return k.call(ce, new r());
      k.call(ce);
    }, Re = () => {
      se = !0;
      const te = M(ce) || w(ce);
      if (te && typeof te != "boolean")
        return k.call(ce, te);
      k.call(ce);
    }, Ae = () => {
      ce.req.on("finish", ne);
    };
    $(ce) ? (ce.on("complete", ne), N || ce.on("abort", we), ce.req ? Ae() : ce.on("request", Ae)) : G && !ue && (ce.on("end", B), ce.on("close", B)), !N && typeof ce.aborted == "boolean" && ce.on("aborted", we), ce.on("end", L), ce.on("finish", ne), fe.error !== !1 && ce.on("error", H), ce.on("close", we), se ? t.nextTick(we) : ue != null && ue.errorEmitted || O != null && O.errorEmitted ? N || t.nextTick(Re) : (!J && (!N || T(ce)) && (re || I(ce) === !1) || !G && (!N || I(ce)) && (D || T(ce) === !1) || O && ce.req && ce.aborted) && t.nextTick(Re);
    const Oe = () => {
      k = ae, ce.removeListener("aborted", we), ce.removeListener("complete", ne), ce.removeListener("abort", we), ce.removeListener("request", Ae), ce.req && ce.req.removeListener("finish", ne), ce.removeListener("end", B), ce.removeListener("close", B), ce.removeListener("finish", ne), ce.removeListener("end", L), ce.removeListener("error", H), ce.removeListener("close", we);
    };
    if (fe.signal && !se) {
      const te = () => {
        const Fe = k;
        Oe(), Fe.call(
          ce,
          new e(void 0, {
            cause: fe.signal.reason
          })
        );
      };
      if (fe.signal.aborted)
        t.nextTick(te);
      else {
        h = h || requireUtil().addAbortListener;
        const Fe = h(fe.signal, te), Ce = k;
        k = f((...qe) => {
          Fe[q](), Ce.apply(ce, qe);
        });
      }
    }
    return Oe;
  }
  function Ee(ce, fe, k) {
    let pe = !1, ee = ae;
    if (fe.signal)
      if (ee = () => {
        pe = !0, k.call(
          ce,
          new e(void 0, {
            cause: fe.signal.reason
          })
        );
      }, fe.signal.aborted)
        t.nextTick(ee);
      else {
        h = h || requireUtil().addAbortListener;
        const G = h(fe.signal, ee), ue = k;
        k = f((...O) => {
          G[q](), ue.apply(ce, O);
        });
      }
    const J = (...G) => {
      pe || t.nextTick(() => k.apply(ce, G));
    };
    return E(ce[W].promise, J, J), ae;
  }
  function _e(ce, fe) {
    var k;
    let pe = !1;
    return fe === null && (fe = n), (k = fe) !== null && k !== void 0 && k.cleanup && (s(fe.cleanup, "cleanup"), pe = fe.cleanup), new v((ee, J) => {
      const G = de(ce, fe, (ue) => {
        pe && G(), ue ? J(ue) : ee();
      });
    });
  }
  return endOfStream.exports = de, endOfStream.exports.finished = _e, endOfStream.exports;
}
var destroy_1, hasRequiredDestroy;
function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1;
  hasRequiredDestroy = 1;
  const t = requireBrowser$1(), {
    aggregateTwoErrors: e,
    codes: { ERR_MULTIPLE_CALLBACK: o },
    AbortError: l
  } = requireErrors(), { Symbol: r } = requirePrimordials(), { kIsDestroyed: n, isDestroyed: f, isFinished: u, isServerRequest: b } = requireUtils(), S = r("kDestroy"), s = r("kConstruct");
  function v(C, W, h) {
    C && (C.stack, W && !W.errored && (W.errored = C), h && !h.errored && (h.errored = C));
  }
  function E(C, W) {
    const h = this._readableState, $ = this._writableState, ae = $ || h;
    return $ != null && $.destroyed || h != null && h.destroyed ? (typeof W == "function" && W(), this) : (v(C, $, h), $ && ($.destroyed = !0), h && (h.destroyed = !0), ae.constructed ? q(this, C, W) : this.once(S, function(de) {
      q(this, e(de, C), W);
    }), this);
  }
  function q(C, W, h) {
    let $ = !1;
    function ae(de) {
      if ($)
        return;
      $ = !0;
      const Ee = C._readableState, _e = C._writableState;
      v(de, _e, Ee), _e && (_e.closed = !0), Ee && (Ee.closed = !0), typeof h == "function" && h(de), de ? t.nextTick(p, C, de) : t.nextTick(T, C);
    }
    try {
      C._destroy(W || null, ae);
    } catch (de) {
      ae(de);
    }
  }
  function p(C, W) {
    d(C, W), T(C);
  }
  function T(C) {
    const W = C._readableState, h = C._writableState;
    h && (h.closeEmitted = !0), W && (W.closeEmitted = !0), (h != null && h.emitClose || W != null && W.emitClose) && C.emit("close");
  }
  function d(C, W) {
    const h = C._readableState, $ = C._writableState;
    $ != null && $.errorEmitted || h != null && h.errorEmitted || ($ && ($.errorEmitted = !0), h && (h.errorEmitted = !0), C.emit("error", W));
  }
  function y() {
    const C = this._readableState, W = this._writableState;
    C && (C.constructed = !0, C.closed = !1, C.closeEmitted = !1, C.destroyed = !1, C.errored = null, C.errorEmitted = !1, C.reading = !1, C.ended = C.readable === !1, C.endEmitted = C.readable === !1), W && (W.constructed = !0, W.destroyed = !1, W.closed = !1, W.closeEmitted = !1, W.errored = null, W.errorEmitted = !1, W.finalCalled = !1, W.prefinished = !1, W.ended = W.writable === !1, W.ending = W.writable === !1, W.finished = W.writable === !1);
  }
  function A(C, W, h) {
    const $ = C._readableState, ae = C._writableState;
    if (ae != null && ae.destroyed || $ != null && $.destroyed)
      return this;
    $ != null && $.autoDestroy || ae != null && ae.autoDestroy ? C.destroy(W) : W && (W.stack, ae && !ae.errored && (ae.errored = W), $ && !$.errored && ($.errored = W), h ? t.nextTick(d, C, W) : d(C, W));
  }
  function w(C, W) {
    if (typeof C._construct != "function")
      return;
    const h = C._readableState, $ = C._writableState;
    h && (h.constructed = !1), $ && ($.constructed = !1), C.once(s, W), !(C.listenerCount(s) > 1) && t.nextTick(I, C);
  }
  function I(C) {
    let W = !1;
    function h($) {
      if (W) {
        A(C, $ ?? new o());
        return;
      }
      W = !0;
      const ae = C._readableState, de = C._writableState, Ee = de || ae;
      ae && (ae.constructed = !0), de && (de.constructed = !0), Ee.destroyed ? C.emit(S, $) : $ ? A(C, $, !0) : t.nextTick(R, C);
    }
    try {
      C._construct(($) => {
        t.nextTick(h, $);
      });
    } catch ($) {
      t.nextTick(h, $);
    }
  }
  function R(C) {
    C.emit(s);
  }
  function F(C) {
    return (C == null ? void 0 : C.setHeader) && typeof C.abort == "function";
  }
  function x(C) {
    C.emit("close");
  }
  function M(C, W) {
    C.emit("error", W), t.nextTick(x, C);
  }
  function Q(C, W) {
    !C || f(C) || (!W && !u(C) && (W = new l()), b(C) ? (C.socket = null, C.destroy(W)) : F(C) ? C.abort() : F(C.req) ? C.req.abort() : typeof C.destroy == "function" ? C.destroy(W) : typeof C.close == "function" ? C.close() : W ? t.nextTick(M, C, W) : t.nextTick(x, C), C.destroyed || (C[n] = !0));
  }
  return destroy_1 = {
    construct: w,
    destroyer: Q,
    destroy: E,
    undestroy: y,
    errorOrDestroy: A
  }, destroy_1;
}
var legacy, hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  const { ArrayIsArray: t, ObjectSetPrototypeOf: e } = requirePrimordials(), { EventEmitter: o } = requireEvents();
  function l(n) {
    o.call(this, n);
  }
  e(l.prototype, o.prototype), e(l, o), l.prototype.pipe = function(n, f) {
    const u = this;
    function b(T) {
      n.writable && n.write(T) === !1 && u.pause && u.pause();
    }
    u.on("data", b);
    function S() {
      u.readable && u.resume && u.resume();
    }
    n.on("drain", S), !n._isStdio && (!f || f.end !== !1) && (u.on("end", v), u.on("close", E));
    let s = !1;
    function v() {
      s || (s = !0, n.end());
    }
    function E() {
      s || (s = !0, typeof n.destroy == "function" && n.destroy());
    }
    function q(T) {
      p(), o.listenerCount(this, "error") === 0 && this.emit("error", T);
    }
    r(u, "error", q), r(n, "error", q);
    function p() {
      u.removeListener("data", b), n.removeListener("drain", S), u.removeListener("end", v), u.removeListener("close", E), u.removeListener("error", q), n.removeListener("error", q), u.removeListener("end", p), u.removeListener("close", p), n.removeListener("close", p);
    }
    return u.on("end", p), u.on("close", p), n.on("close", p), n.emit("pipe", u), n;
  };
  function r(n, f, u) {
    if (typeof n.prependListener == "function") return n.prependListener(f, u);
    !n._events || !n._events[f] ? n.on(f, u) : t(n._events[f]) ? n._events[f].unshift(u) : n._events[f] = [u, n._events[f]];
  }
  return legacy = {
    Stream: l,
    prependListener: r
  }, legacy;
}
var addAbortSignal = { exports: {} }, hasRequiredAddAbortSignal;
function requireAddAbortSignal() {
  return hasRequiredAddAbortSignal || (hasRequiredAddAbortSignal = 1, (function(t) {
    const { SymbolDispose: e } = requirePrimordials(), { AbortError: o, codes: l } = requireErrors(), { isNodeStream: r, isWebStream: n, kControllerErrorFunction: f } = requireUtils(), u = requireEndOfStream(), { ERR_INVALID_ARG_TYPE: b } = l;
    let S;
    const s = (v, E) => {
      if (typeof v != "object" || !("aborted" in v))
        throw new b(E, "AbortSignal", v);
    };
    t.exports.addAbortSignal = function(E, q) {
      if (s(E, "signal"), !r(q) && !n(q))
        throw new b("stream", ["ReadableStream", "WritableStream", "Stream"], q);
      return t.exports.addAbortSignalNoValidate(E, q);
    }, t.exports.addAbortSignalNoValidate = function(v, E) {
      if (typeof v != "object" || !("aborted" in v))
        return E;
      const q = r(E) ? () => {
        E.destroy(
          new o(void 0, {
            cause: v.reason
          })
        );
      } : () => {
        E[f](
          new o(void 0, {
            cause: v.reason
          })
        );
      };
      if (v.aborted)
        q();
      else {
        S = S || requireUtil().addAbortListener;
        const p = S(v, q);
        u(E, p[e]);
      }
      return E;
    };
  })(addAbortSignal)), addAbortSignal.exports;
}
var buffer_list, hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  const { StringPrototypeSlice: t, SymbolIterator: e, TypedArrayPrototypeSet: o, Uint8Array: l } = requirePrimordials(), { Buffer: r } = requireDist(), { inspect: n } = requireUtil();
  return buffer_list = class {
    constructor() {
      this.head = null, this.tail = null, this.length = 0;
    }
    push(u) {
      const b = {
        data: u,
        next: null
      };
      this.length > 0 ? this.tail.next = b : this.head = b, this.tail = b, ++this.length;
    }
    unshift(u) {
      const b = {
        data: u,
        next: this.head
      };
      this.length === 0 && (this.tail = b), this.head = b, ++this.length;
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
      let b = this.head, S = "" + b.data;
      for (; (b = b.next) !== null; ) S += u + b.data;
      return S;
    }
    concat(u) {
      if (this.length === 0) return r.alloc(0);
      const b = r.allocUnsafe(u >>> 0);
      let S = this.head, s = 0;
      for (; S; )
        o(b, S.data, s), s += S.data.length, S = S.next;
      return b;
    }
    // Consumes a specified amount of bytes or characters from the buffered data.
    consume(u, b) {
      const S = this.head.data;
      if (u < S.length) {
        const s = S.slice(0, u);
        return this.head.data = S.slice(u), s;
      }
      return u === S.length ? this.shift() : b ? this._getString(u) : this._getBuffer(u);
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
      let b = "", S = this.head, s = 0;
      do {
        const v = S.data;
        if (u > v.length)
          b += v, u -= v.length;
        else {
          u === v.length ? (b += v, ++s, S.next ? this.head = S.next : this.head = this.tail = null) : (b += t(v, 0, u), this.head = S, S.data = t(v, u));
          break;
        }
        ++s;
      } while ((S = S.next) !== null);
      return this.length -= s, b;
    }
    // Consumes a specified amount of bytes from the buffered data.
    _getBuffer(u) {
      const b = r.allocUnsafe(u), S = u;
      let s = this.head, v = 0;
      do {
        const E = s.data;
        if (u > E.length)
          o(b, E, S - u), u -= E.length;
        else {
          u === E.length ? (o(b, E, S - u), ++v, s.next ? this.head = s.next : this.head = this.tail = null) : (o(b, new l(E.buffer, E.byteOffset, u), S - u), this.head = s, s.data = E.slice(u));
          break;
        }
        ++v;
      } while ((s = s.next) !== null);
      return this.length -= v, b;
    }
    // Make sure the linked list only shows the minimal necessary information.
    [Symbol.for("nodejs.util.inspect.custom")](u, b) {
      return n(this, {
        ...b,
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
  const { MathFloor: t, NumberIsInteger: e } = requirePrimordials(), { validateInteger: o } = requireValidators(), { ERR_INVALID_ARG_VALUE: l } = requireErrors().codes;
  let r = 16 * 1024, n = 16;
  function f(s, v, E) {
    return s.highWaterMark != null ? s.highWaterMark : v ? s[E] : null;
  }
  function u(s) {
    return s ? n : r;
  }
  function b(s, v) {
    o(v, "value", 0), s ? n = v : r = v;
  }
  function S(s, v, E, q) {
    const p = f(v, q, E);
    if (p != null) {
      if (!e(p) || p < 0) {
        const T = q ? `options.${E}` : "options.highWaterMark";
        throw new l(T, p);
      }
      return t(p);
    }
    return u(s.objectMode);
  }
  return state = {
    getHighWaterMark: S,
    getDefaultHighWaterMark: u,
    setDefaultHighWaterMark: b
  }, state;
}
var from_1, hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from_1;
  hasRequiredFrom = 1;
  const t = requireBrowser$1(), { PromisePrototypeThen: e, SymbolAsyncIterator: o, SymbolIterator: l } = requirePrimordials(), { Buffer: r } = requireDist(), { ERR_INVALID_ARG_TYPE: n, ERR_STREAM_NULL_VALUES: f } = requireErrors().codes;
  function u(b, S, s) {
    let v;
    if (typeof S == "string" || S instanceof r)
      return new b({
        objectMode: !0,
        ...s,
        read() {
          this.push(S), this.push(null);
        }
      });
    let E;
    if (S && S[o])
      E = !0, v = S[o]();
    else if (S && S[l])
      E = !1, v = S[l]();
    else
      throw new n("iterable", ["Iterable"], S);
    const q = new b({
      objectMode: !0,
      highWaterMark: 1,
      // TODO(ronag): What options should be allowed?
      ...s
    });
    let p = !1;
    q._read = function() {
      p || (p = !0, d());
    }, q._destroy = function(y, A) {
      e(
        T(y),
        () => t.nextTick(A, y),
        // nextTick is here in case cb throws
        (w) => t.nextTick(A, w || y)
      );
    };
    async function T(y) {
      const A = y != null, w = typeof v.throw == "function";
      if (A && w) {
        const { value: I, done: R } = await v.throw(y);
        if (await I, R)
          return;
      }
      if (typeof v.return == "function") {
        const { value: I } = await v.return();
        await I;
      }
    }
    async function d() {
      for (; ; ) {
        try {
          const { value: y, done: A } = E ? await v.next() : v.next();
          if (A)
            q.push(null);
          else {
            const w = y && typeof y.then == "function" ? await y : y;
            if (w === null)
              throw p = !1, new f();
            if (q.push(w))
              continue;
            p = !1;
          }
        } catch (y) {
          q.destroy(y);
        }
        break;
      }
    }
    return q;
  }
  return from_1 = u, from_1;
}
var readable, hasRequiredReadable;
function requireReadable() {
  if (hasRequiredReadable) return readable;
  hasRequiredReadable = 1;
  const t = requireBrowser$1(), {
    ArrayPrototypeIndexOf: e,
    NumberIsInteger: o,
    NumberIsNaN: l,
    NumberParseInt: r,
    ObjectDefineProperties: n,
    ObjectKeys: f,
    ObjectSetPrototypeOf: u,
    Promise: b,
    SafeSet: S,
    SymbolAsyncDispose: s,
    SymbolAsyncIterator: v,
    Symbol: E
  } = requirePrimordials();
  readable = qe, qe.ReadableState = Ce;
  const { EventEmitter: q } = requireEvents(), { Stream: p, prependListener: T } = requireLegacy(), { Buffer: d } = requireDist(), { addAbortSignal: y } = requireAddAbortSignal(), A = requireEndOfStream();
  let w = requireUtil().debuglog("stream", (Z) => {
    w = Z;
  });
  const I = requireBuffer_list(), R = requireDestroy(), { getHighWaterMark: F, getDefaultHighWaterMark: x } = requireState(), {
    aggregateTwoErrors: M,
    codes: {
      ERR_INVALID_ARG_TYPE: Q,
      ERR_METHOD_NOT_IMPLEMENTED: C,
      ERR_OUT_OF_RANGE: W,
      ERR_STREAM_PUSH_AFTER_EOF: h,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT: $
    },
    AbortError: ae
  } = requireErrors(), { validateObject: de } = requireValidators(), Ee = E("kPaused"), { StringDecoder: _e } = requireString_decoder(), ce = requireFrom();
  u(qe.prototype, p.prototype), u(qe, p);
  const fe = () => {
  }, { errorOrDestroy: k } = R, pe = 1, ee = 2, J = 4, G = 8, ue = 16, O = 32, B = 64, N = 128, re = 256, ne = 512, D = 1024, L = 2048, H = 4096, se = 8192, we = 16384, Re = 32768, Ae = 65536, Oe = 1 << 17, te = 1 << 18;
  function Fe(Z) {
    return {
      enumerable: !1,
      get() {
        return (this.state & Z) !== 0;
      },
      set(g) {
        g ? this.state |= Z : this.state &= ~Z;
      }
    };
  }
  n(Ce.prototype, {
    objectMode: Fe(pe),
    ended: Fe(ee),
    endEmitted: Fe(J),
    reading: Fe(G),
    // Stream is still being constructed and cannot be
    // destroyed until construction finished or failed.
    // Async construction is opt in, therefore we start as
    // constructed.
    constructed: Fe(ue),
    // A flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    sync: Fe(O),
    // Whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    needReadable: Fe(B),
    emittedReadable: Fe(N),
    readableListening: Fe(re),
    resumeScheduled: Fe(ne),
    // True if the error was already emitted and should not be thrown again.
    errorEmitted: Fe(D),
    emitClose: Fe(L),
    autoDestroy: Fe(H),
    // Has it been destroyed.
    destroyed: Fe(se),
    // Indicates whether the stream has finished destroying.
    closed: Fe(we),
    // True if close has been emitted or would have been emitted
    // depending on emitClose.
    closeEmitted: Fe(Re),
    multiAwaitDrain: Fe(Ae),
    // If true, a maybeReadMore has been scheduled.
    readingMore: Fe(Oe),
    dataEmitted: Fe(te)
  });
  function Ce(Z, g, c) {
    typeof c != "boolean" && (c = g instanceof requireDuplex()), this.state = L | H | ue | O, Z && Z.objectMode && (this.state |= pe), c && Z && Z.readableObjectMode && (this.state |= pe), this.highWaterMark = Z ? F(this, Z, "readableHighWaterMark", c) : x(!1), this.buffer = new I(), this.length = 0, this.pipes = [], this.flowing = null, this[Ee] = null, Z && Z.emitClose === !1 && (this.state &= ~L), Z && Z.autoDestroy === !1 && (this.state &= ~H), this.errored = null, this.defaultEncoding = Z && Z.defaultEncoding || "utf8", this.awaitDrainWriters = null, this.decoder = null, this.encoding = null, Z && Z.encoding && (this.decoder = new _e(Z.encoding), this.encoding = Z.encoding);
  }
  function qe(Z) {
    if (!(this instanceof qe)) return new qe(Z);
    const g = this instanceof requireDuplex();
    this._readableState = new Ce(Z, this, g), Z && (typeof Z.read == "function" && (this._read = Z.read), typeof Z.destroy == "function" && (this._destroy = Z.destroy), typeof Z.construct == "function" && (this._construct = Z.construct), Z.signal && !g && y(Z.signal, this)), p.call(this, Z), R.construct(this, () => {
      this._readableState.needReadable && a(this, this._readableState);
    });
  }
  qe.prototype.destroy = R.destroy, qe.prototype._undestroy = R.undestroy, qe.prototype._destroy = function(Z, g) {
    g(Z);
  }, qe.prototype[q.captureRejectionSymbol] = function(Z) {
    this.destroy(Z);
  }, qe.prototype[s] = function() {
    let Z;
    return this.destroyed || (Z = this.readableEnded ? null : new ae(), this.destroy(Z)), new b((g, c) => A(this, (P) => P && P !== Z ? c(P) : g(null)));
  }, qe.prototype.push = function(Z, g) {
    return Ue(this, Z, g, !1);
  }, qe.prototype.unshift = function(Z, g) {
    return Ue(this, Z, g, !0);
  };
  function Ue(Z, g, c, P) {
    w("readableAddChunk", g);
    const Y = Z._readableState;
    let ye;
    if ((Y.state & pe) === 0 && (typeof g == "string" ? (c = c || Y.defaultEncoding, Y.encoding !== c && (P && Y.encoding ? g = d.from(g, c).toString(Y.encoding) : (g = d.from(g, c), c = ""))) : g instanceof d ? c = "" : p._isUint8Array(g) ? (g = p._uint8ArrayToBuffer(g), c = "") : g != null && (ye = new Q("chunk", ["string", "Buffer", "Uint8Array"], g))), ye)
      k(Z, ye);
    else if (g === null)
      Y.state &= ~G, je(Z, Y);
    else if ((Y.state & pe) !== 0 || g && g.length > 0)
      if (P)
        if ((Y.state & J) !== 0) k(Z, new $());
        else {
          if (Y.destroyed || Y.errored) return !1;
          me(Z, Y, g, !0);
        }
      else if (Y.ended)
        k(Z, new h());
      else {
        if (Y.destroyed || Y.errored)
          return !1;
        Y.state &= ~G, Y.decoder && !c ? (g = Y.decoder.write(g), Y.objectMode || g.length !== 0 ? me(Z, Y, g, !1) : a(Z, Y)) : me(Z, Y, g, !1);
      }
    else P || (Y.state &= ~G, a(Z, Y));
    return !Y.ended && (Y.length < Y.highWaterMark || Y.length === 0);
  }
  function me(Z, g, c, P) {
    g.flowing && g.length === 0 && !g.sync && Z.listenerCount("data") > 0 ? ((g.state & Ae) !== 0 ? g.awaitDrainWriters.clear() : g.awaitDrainWriters = null, g.dataEmitted = !0, Z.emit("data", c)) : (g.length += g.objectMode ? 1 : c.length, P ? g.buffer.unshift(c) : g.buffer.push(c), (g.state & B) !== 0 && He(Z)), a(Z, g);
  }
  qe.prototype.isPaused = function() {
    const Z = this._readableState;
    return Z[Ee] === !0 || Z.flowing === !1;
  }, qe.prototype.setEncoding = function(Z) {
    const g = new _e(Z);
    this._readableState.decoder = g, this._readableState.encoding = this._readableState.decoder.encoding;
    const c = this._readableState.buffer;
    let P = "";
    for (const Y of c)
      P += g.write(Y);
    return c.clear(), P !== "" && c.push(P), this._readableState.length = P.length, this;
  };
  const Se = 1073741824;
  function Le(Z) {
    if (Z > Se)
      throw new W("size", "<= 1GiB", Z);
    return Z--, Z |= Z >>> 1, Z |= Z >>> 2, Z |= Z >>> 4, Z |= Z >>> 8, Z |= Z >>> 16, Z++, Z;
  }
  function Me(Z, g) {
    return Z <= 0 || g.length === 0 && g.ended ? 0 : (g.state & pe) !== 0 ? 1 : l(Z) ? g.flowing && g.length ? g.buffer.first().length : g.length : Z <= g.length ? Z : g.ended ? g.length : 0;
  }
  qe.prototype.read = function(Z) {
    w("read", Z), Z === void 0 ? Z = NaN : o(Z) || (Z = r(Z, 10));
    const g = this._readableState, c = Z;
    if (Z > g.highWaterMark && (g.highWaterMark = Le(Z)), Z !== 0 && (g.state &= ~N), Z === 0 && g.needReadable && ((g.highWaterMark !== 0 ? g.length >= g.highWaterMark : g.length > 0) || g.ended))
      return w("read: emitReadable", g.length, g.ended), g.length === 0 && g.ended ? De(this) : He(this), null;
    if (Z = Me(Z, g), Z === 0 && g.ended)
      return g.length === 0 && De(this), null;
    let P = (g.state & B) !== 0;
    if (w("need readable", P), (g.length === 0 || g.length - Z < g.highWaterMark) && (P = !0, w("length less than watermark", P)), g.ended || g.reading || g.destroyed || g.errored || !g.constructed)
      P = !1, w("reading, ended or constructing", P);
    else if (P) {
      w("do read"), g.state |= G | O, g.length === 0 && (g.state |= B);
      try {
        this._read(g.highWaterMark);
      } catch (ye) {
        k(this, ye);
      }
      g.state &= ~O, g.reading || (Z = Me(c, g));
    }
    let Y;
    return Z > 0 ? Y = Ie(Z, g) : Y = null, Y === null ? (g.needReadable = g.length <= g.highWaterMark, Z = 0) : (g.length -= Z, g.multiAwaitDrain ? g.awaitDrainWriters.clear() : g.awaitDrainWriters = null), g.length === 0 && (g.ended || (g.needReadable = !0), c !== Z && g.ended && De(this)), Y !== null && !g.errorEmitted && !g.closeEmitted && (g.dataEmitted = !0, this.emit("data", Y)), Y;
  };
  function je(Z, g) {
    if (w("onEofChunk"), !g.ended) {
      if (g.decoder) {
        const c = g.decoder.end();
        c && c.length && (g.buffer.push(c), g.length += g.objectMode ? 1 : c.length);
      }
      g.ended = !0, g.sync ? He(Z) : (g.needReadable = !1, g.emittedReadable = !0, U(Z));
    }
  }
  function He(Z) {
    const g = Z._readableState;
    w("emitReadable", g.needReadable, g.emittedReadable), g.needReadable = !1, g.emittedReadable || (w("emitReadable", g.flowing), g.emittedReadable = !0, t.nextTick(U, Z));
  }
  function U(Z) {
    const g = Z._readableState;
    w("emitReadable_", g.destroyed, g.length, g.ended), !g.destroyed && !g.errored && (g.length || g.ended) && (Z.emit("readable"), g.emittedReadable = !1), g.needReadable = !g.flowing && !g.ended && g.length <= g.highWaterMark, Be(Z);
  }
  function a(Z, g) {
    !g.readingMore && g.constructed && (g.readingMore = !0, t.nextTick(m, Z, g));
  }
  function m(Z, g) {
    for (; !g.reading && !g.ended && (g.length < g.highWaterMark || g.flowing && g.length === 0); ) {
      const c = g.length;
      if (w("maybeReadMore read 0"), Z.read(0), c === g.length)
        break;
    }
    g.readingMore = !1;
  }
  qe.prototype._read = function(Z) {
    throw new C("_read()");
  }, qe.prototype.pipe = function(Z, g) {
    const c = this, P = this._readableState;
    P.pipes.length === 1 && (P.multiAwaitDrain || (P.multiAwaitDrain = !0, P.awaitDrainWriters = new S(P.awaitDrainWriters ? [P.awaitDrainWriters] : []))), P.pipes.push(Z), w("pipe count=%d opts=%j", P.pipes.length, g);
    const ye = (!g || g.end !== !1) && Z !== t.stdout && Z !== t.stderr ? ie : nr;
    P.endEmitted ? t.nextTick(ye) : c.once("end", ye), Z.on("unpipe", Te);
    function Te(Je, rr) {
      w("onunpipe"), Je === c && rr && rr.hasUnpiped === !1 && (rr.hasUnpiped = !0, xe());
    }
    function ie() {
      w("onend"), Z.end();
    }
    let oe, ve = !1;
    function xe() {
      w("cleanup"), Z.removeListener("close", Qe), Z.removeListener("finish", Ye), oe && Z.removeListener("drain", oe), Z.removeListener("error", Ge), Z.removeListener("unpipe", Te), c.removeListener("end", ie), c.removeListener("end", nr), c.removeListener("data", ke), ve = !0, oe && P.awaitDrainWriters && (!Z._writableState || Z._writableState.needDrain) && oe();
    }
    function Pe() {
      ve || (P.pipes.length === 1 && P.pipes[0] === Z ? (w("false write response, pause", 0), P.awaitDrainWriters = Z, P.multiAwaitDrain = !1) : P.pipes.length > 1 && P.pipes.includes(Z) && (w("false write response, pause", P.awaitDrainWriters.size), P.awaitDrainWriters.add(Z)), c.pause()), oe || (oe = z(c, Z), Z.on("drain", oe));
    }
    c.on("data", ke);
    function ke(Je) {
      w("ondata");
      const rr = Z.write(Je);
      w("dest.write", rr), rr === !1 && Pe();
    }
    function Ge(Je) {
      if (w("onerror", Je), nr(), Z.removeListener("error", Ge), Z.listenerCount("error") === 0) {
        const rr = Z._writableState || Z._readableState;
        rr && !rr.errorEmitted ? k(Z, Je) : Z.emit("error", Je);
      }
    }
    T(Z, "error", Ge);
    function Qe() {
      Z.removeListener("finish", Ye), nr();
    }
    Z.once("close", Qe);
    function Ye() {
      w("onfinish"), Z.removeListener("close", Qe), nr();
    }
    Z.once("finish", Ye);
    function nr() {
      w("unpipe"), c.unpipe(Z);
    }
    return Z.emit("pipe", c), Z.writableNeedDrain === !0 ? Pe() : P.flowing || (w("pipe resume"), c.resume()), Z;
  };
  function z(Z, g) {
    return function() {
      const P = Z._readableState;
      P.awaitDrainWriters === g ? (w("pipeOnDrain", 1), P.awaitDrainWriters = null) : P.multiAwaitDrain && (w("pipeOnDrain", P.awaitDrainWriters.size), P.awaitDrainWriters.delete(g)), (!P.awaitDrainWriters || P.awaitDrainWriters.size === 0) && Z.listenerCount("data") && Z.resume();
    };
  }
  qe.prototype.unpipe = function(Z) {
    const g = this._readableState, c = {
      hasUnpiped: !1
    };
    if (g.pipes.length === 0) return this;
    if (!Z) {
      const Y = g.pipes;
      g.pipes = [], this.pause();
      for (let ye = 0; ye < Y.length; ye++)
        Y[ye].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    const P = e(g.pipes, Z);
    return P === -1 ? this : (g.pipes.splice(P, 1), g.pipes.length === 0 && this.pause(), Z.emit("unpipe", this, c), this);
  }, qe.prototype.on = function(Z, g) {
    const c = p.prototype.on.call(this, Z, g), P = this._readableState;
    return Z === "data" ? (P.readableListening = this.listenerCount("readable") > 0, P.flowing !== !1 && this.resume()) : Z === "readable" && !P.endEmitted && !P.readableListening && (P.readableListening = P.needReadable = !0, P.flowing = !1, P.emittedReadable = !1, w("on readable", P.length, P.reading), P.length ? He(this) : P.reading || t.nextTick(X, this)), c;
  }, qe.prototype.addListener = qe.prototype.on, qe.prototype.removeListener = function(Z, g) {
    const c = p.prototype.removeListener.call(this, Z, g);
    return Z === "readable" && t.nextTick(le, this), c;
  }, qe.prototype.off = qe.prototype.removeListener, qe.prototype.removeAllListeners = function(Z) {
    const g = p.prototype.removeAllListeners.apply(this, arguments);
    return (Z === "readable" || Z === void 0) && t.nextTick(le, this), g;
  };
  function le(Z) {
    const g = Z._readableState;
    g.readableListening = Z.listenerCount("readable") > 0, g.resumeScheduled && g[Ee] === !1 ? g.flowing = !0 : Z.listenerCount("data") > 0 ? Z.resume() : g.readableListening || (g.flowing = null);
  }
  function X(Z) {
    w("readable nexttick read 0"), Z.read(0);
  }
  qe.prototype.resume = function() {
    const Z = this._readableState;
    return Z.flowing || (w("resume"), Z.flowing = !Z.readableListening, he(this, Z)), Z[Ee] = !1, this;
  };
  function he(Z, g) {
    g.resumeScheduled || (g.resumeScheduled = !0, t.nextTick(j, Z, g));
  }
  function j(Z, g) {
    w("resume", g.reading), g.reading || Z.read(0), g.resumeScheduled = !1, Z.emit("resume"), Be(Z), g.flowing && !g.reading && Z.read(0);
  }
  qe.prototype.pause = function() {
    return w("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (w("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState[Ee] = !0, this;
  };
  function Be(Z) {
    const g = Z._readableState;
    for (w("flow", g.flowing); g.flowing && Z.read() !== null; ) ;
  }
  qe.prototype.wrap = function(Z) {
    let g = !1;
    Z.on("data", (P) => {
      !this.push(P) && Z.pause && (g = !0, Z.pause());
    }), Z.on("end", () => {
      this.push(null);
    }), Z.on("error", (P) => {
      k(this, P);
    }), Z.on("close", () => {
      this.destroy();
    }), Z.on("destroy", () => {
      this.destroy();
    }), this._read = () => {
      g && Z.resume && (g = !1, Z.resume());
    };
    const c = f(Z);
    for (let P = 1; P < c.length; P++) {
      const Y = c[P];
      this[Y] === void 0 && typeof Z[Y] == "function" && (this[Y] = Z[Y].bind(Z));
    }
    return this;
  }, qe.prototype[v] = function() {
    return We(this);
  }, qe.prototype.iterator = function(Z) {
    return Z !== void 0 && de(Z, "options"), We(this, Z);
  };
  function We(Z, g) {
    typeof Z.read != "function" && (Z = qe.wrap(Z, {
      objectMode: !0
    }));
    const c = _(Z, g);
    return c.stream = Z, c;
  }
  async function* _(Z, g) {
    let c = fe;
    function P(Te) {
      this === Z ? (c(), c = fe) : c = Te;
    }
    Z.on("readable", P);
    let Y;
    const ye = A(
      Z,
      {
        writable: !1
      },
      (Te) => {
        Y = Te ? M(Y, Te) : null, c(), c = fe;
      }
    );
    try {
      for (; ; ) {
        const Te = Z.destroyed ? null : Z.read();
        if (Te !== null)
          yield Te;
        else {
          if (Y)
            throw Y;
          if (Y === null)
            return;
          await new b(P);
        }
      }
    } catch (Te) {
      throw Y = M(Y, Te), Y;
    } finally {
      (Y || (g == null ? void 0 : g.destroyOnReturn) !== !1) && (Y === void 0 || Z._readableState.autoDestroy) ? R.destroyer(Z, null) : (Z.off("readable", P), ye());
    }
  }
  n(qe.prototype, {
    readable: {
      __proto__: null,
      get() {
        const Z = this._readableState;
        return !!Z && Z.readable !== !1 && !Z.destroyed && !Z.errorEmitted && !Z.endEmitted;
      },
      set(Z) {
        this._readableState && (this._readableState.readable = !!Z);
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
      set: function(Z) {
        this._readableState && (this._readableState.flowing = Z);
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
      set(Z) {
        this._readableState && (this._readableState.destroyed = Z);
      }
    },
    readableEnded: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.endEmitted : !1;
      }
    }
  }), n(Ce.prototype, {
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
        return this[Ee] !== !1;
      },
      set(Z) {
        this[Ee] = !!Z;
      }
    }
  }), qe._fromList = Ie;
  function Ie(Z, g) {
    if (g.length === 0) return null;
    let c;
    return g.objectMode ? c = g.buffer.shift() : !Z || Z >= g.length ? (g.decoder ? c = g.buffer.join("") : g.buffer.length === 1 ? c = g.buffer.first() : c = g.buffer.concat(g.length), g.buffer.clear()) : c = g.buffer.consume(Z, g.decoder), c;
  }
  function De(Z) {
    const g = Z._readableState;
    w("endReadable", g.endEmitted), g.endEmitted || (g.ended = !0, t.nextTick(V, g, Z));
  }
  function V(Z, g) {
    if (w("endReadableNT", Z.endEmitted, Z.length), !Z.errored && !Z.closeEmitted && !Z.endEmitted && Z.length === 0) {
      if (Z.endEmitted = !0, g.emit("end"), g.writable && g.allowHalfOpen === !1)
        t.nextTick(be, g);
      else if (Z.autoDestroy) {
        const c = g._writableState;
        (!c || c.autoDestroy && // We don't expect the writable to ever 'finish'
        // if writable is explicitly set to false.
        (c.finished || c.writable === !1)) && g.destroy();
      }
    }
  }
  function be(Z) {
    Z.writable && !Z.writableEnded && !Z.destroyed && Z.end();
  }
  qe.from = function(Z, g) {
    return ce(qe, Z, g);
  };
  let $e;
  function Ve() {
    return $e === void 0 && ($e = {}), $e;
  }
  return qe.fromWeb = function(Z, g) {
    return Ve().newStreamReadableFromReadableStream(Z, g);
  }, qe.toWeb = function(Z, g) {
    return Ve().newReadableStreamFromStreamReadable(Z, g);
  }, qe.wrap = function(Z, g) {
    var c, P;
    return new qe({
      objectMode: (c = (P = Z.readableObjectMode) !== null && P !== void 0 ? P : Z.objectMode) !== null && c !== void 0 ? c : !0,
      ...g,
      destroy(Y, ye) {
        R.destroyer(Z, Y), ye(Y);
      }
    }).wrap(Z);
  }, readable;
}
var writable, hasRequiredWritable;
function requireWritable() {
  if (hasRequiredWritable) return writable;
  hasRequiredWritable = 1;
  const t = requireBrowser$1(), {
    ArrayPrototypeSlice: e,
    Error: o,
    FunctionPrototypeSymbolHasInstance: l,
    ObjectDefineProperty: r,
    ObjectDefineProperties: n,
    ObjectSetPrototypeOf: f,
    StringPrototypeToLowerCase: u,
    Symbol: b,
    SymbolHasInstance: S
  } = requirePrimordials();
  writable = de, de.WritableState = $;
  const { EventEmitter: s } = requireEvents(), v = requireLegacy().Stream, { Buffer: E } = requireDist(), q = requireDestroy(), { addAbortSignal: p } = requireAddAbortSignal(), { getHighWaterMark: T, getDefaultHighWaterMark: d } = requireState(), {
    ERR_INVALID_ARG_TYPE: y,
    ERR_METHOD_NOT_IMPLEMENTED: A,
    ERR_MULTIPLE_CALLBACK: w,
    ERR_STREAM_CANNOT_PIPE: I,
    ERR_STREAM_DESTROYED: R,
    ERR_STREAM_ALREADY_FINISHED: F,
    ERR_STREAM_NULL_VALUES: x,
    ERR_STREAM_WRITE_AFTER_END: M,
    ERR_UNKNOWN_ENCODING: Q
  } = requireErrors().codes, { errorOrDestroy: C } = q;
  f(de.prototype, v.prototype), f(de, v);
  function W() {
  }
  const h = b("kOnFinished");
  function $(H, se, we) {
    typeof we != "boolean" && (we = se instanceof requireDuplex()), this.objectMode = !!(H && H.objectMode), we && (this.objectMode = this.objectMode || !!(H && H.writableObjectMode)), this.highWaterMark = H ? T(this, H, "writableHighWaterMark", we) : d(!1), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    const Re = !!(H && H.decodeStrings === !1);
    this.decodeStrings = !Re, this.defaultEncoding = H && H.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = k.bind(void 0, se), this.writecb = null, this.writelen = 0, this.afterWriteTickInfo = null, ae(this), this.pendingcb = 0, this.constructed = !0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !H || H.emitClose !== !1, this.autoDestroy = !H || H.autoDestroy !== !1, this.errored = null, this.closed = !1, this.closeEmitted = !1, this[h] = [];
  }
  function ae(H) {
    H.buffered = [], H.bufferedIndex = 0, H.allBuffers = !0, H.allNoop = !0;
  }
  $.prototype.getBuffer = function() {
    return e(this.buffered, this.bufferedIndex);
  }, r($.prototype, "bufferedRequestCount", {
    __proto__: null,
    get() {
      return this.buffered.length - this.bufferedIndex;
    }
  });
  function de(H) {
    const se = this instanceof requireDuplex();
    if (!se && !l(de, this)) return new de(H);
    this._writableState = new $(H, this, se), H && (typeof H.write == "function" && (this._write = H.write), typeof H.writev == "function" && (this._writev = H.writev), typeof H.destroy == "function" && (this._destroy = H.destroy), typeof H.final == "function" && (this._final = H.final), typeof H.construct == "function" && (this._construct = H.construct), H.signal && p(H.signal, this)), v.call(this, H), q.construct(this, () => {
      const we = this._writableState;
      we.writing || G(this, we), N(this, we);
    });
  }
  r(de, S, {
    __proto__: null,
    value: function(H) {
      return l(this, H) ? !0 : this !== de ? !1 : H && H._writableState instanceof $;
    }
  }), de.prototype.pipe = function() {
    C(this, new I());
  };
  function Ee(H, se, we, Re) {
    const Ae = H._writableState;
    if (typeof we == "function")
      Re = we, we = Ae.defaultEncoding;
    else {
      if (!we) we = Ae.defaultEncoding;
      else if (we !== "buffer" && !E.isEncoding(we)) throw new Q(we);
      typeof Re != "function" && (Re = W);
    }
    if (se === null)
      throw new x();
    if (!Ae.objectMode)
      if (typeof se == "string")
        Ae.decodeStrings !== !1 && (se = E.from(se, we), we = "buffer");
      else if (se instanceof E)
        we = "buffer";
      else if (v._isUint8Array(se))
        se = v._uint8ArrayToBuffer(se), we = "buffer";
      else
        throw new y("chunk", ["string", "Buffer", "Uint8Array"], se);
    let Oe;
    return Ae.ending ? Oe = new M() : Ae.destroyed && (Oe = new R("write")), Oe ? (t.nextTick(Re, Oe), C(H, Oe, !0), Oe) : (Ae.pendingcb++, _e(H, Ae, se, we, Re));
  }
  de.prototype.write = function(H, se, we) {
    return Ee(this, H, se, we) === !0;
  }, de.prototype.cork = function() {
    this._writableState.corked++;
  }, de.prototype.uncork = function() {
    const H = this._writableState;
    H.corked && (H.corked--, H.writing || G(this, H));
  }, de.prototype.setDefaultEncoding = function(se) {
    if (typeof se == "string" && (se = u(se)), !E.isEncoding(se)) throw new Q(se);
    return this._writableState.defaultEncoding = se, this;
  };
  function _e(H, se, we, Re, Ae) {
    const Oe = se.objectMode ? 1 : we.length;
    se.length += Oe;
    const te = se.length < se.highWaterMark;
    return te || (se.needDrain = !0), se.writing || se.corked || se.errored || !se.constructed ? (se.buffered.push({
      chunk: we,
      encoding: Re,
      callback: Ae
    }), se.allBuffers && Re !== "buffer" && (se.allBuffers = !1), se.allNoop && Ae !== W && (se.allNoop = !1)) : (se.writelen = Oe, se.writecb = Ae, se.writing = !0, se.sync = !0, H._write(we, Re, se.onwrite), se.sync = !1), te && !se.errored && !se.destroyed;
  }
  function ce(H, se, we, Re, Ae, Oe, te) {
    se.writelen = Re, se.writecb = te, se.writing = !0, se.sync = !0, se.destroyed ? se.onwrite(new R("write")) : we ? H._writev(Ae, se.onwrite) : H._write(Ae, Oe, se.onwrite), se.sync = !1;
  }
  function fe(H, se, we, Re) {
    --se.pendingcb, Re(we), J(se), C(H, we);
  }
  function k(H, se) {
    const we = H._writableState, Re = we.sync, Ae = we.writecb;
    if (typeof Ae != "function") {
      C(H, new w());
      return;
    }
    we.writing = !1, we.writecb = null, we.length -= we.writelen, we.writelen = 0, se ? (se.stack, we.errored || (we.errored = se), H._readableState && !H._readableState.errored && (H._readableState.errored = se), Re ? t.nextTick(fe, H, we, se, Ae) : fe(H, we, se, Ae)) : (we.buffered.length > we.bufferedIndex && G(H, we), Re ? we.afterWriteTickInfo !== null && we.afterWriteTickInfo.cb === Ae ? we.afterWriteTickInfo.count++ : (we.afterWriteTickInfo = {
      count: 1,
      cb: Ae,
      stream: H,
      state: we
    }, t.nextTick(pe, we.afterWriteTickInfo)) : ee(H, we, 1, Ae));
  }
  function pe({ stream: H, state: se, count: we, cb: Re }) {
    return se.afterWriteTickInfo = null, ee(H, se, we, Re);
  }
  function ee(H, se, we, Re) {
    for (!se.ending && !H.destroyed && se.length === 0 && se.needDrain && (se.needDrain = !1, H.emit("drain")); we-- > 0; )
      se.pendingcb--, Re();
    se.destroyed && J(se), N(H, se);
  }
  function J(H) {
    if (H.writing)
      return;
    for (let Ae = H.bufferedIndex; Ae < H.buffered.length; ++Ae) {
      var se;
      const { chunk: Oe, callback: te } = H.buffered[Ae], Fe = H.objectMode ? 1 : Oe.length;
      H.length -= Fe, te(
        (se = H.errored) !== null && se !== void 0 ? se : new R("write")
      );
    }
    const we = H[h].splice(0);
    for (let Ae = 0; Ae < we.length; Ae++) {
      var Re;
      we[Ae](
        (Re = H.errored) !== null && Re !== void 0 ? Re : new R("end")
      );
    }
    ae(H);
  }
  function G(H, se) {
    if (se.corked || se.bufferProcessing || se.destroyed || !se.constructed)
      return;
    const { buffered: we, bufferedIndex: Re, objectMode: Ae } = se, Oe = we.length - Re;
    if (!Oe)
      return;
    let te = Re;
    if (se.bufferProcessing = !0, Oe > 1 && H._writev) {
      se.pendingcb -= Oe - 1;
      const Fe = se.allNoop ? W : (qe) => {
        for (let Ue = te; Ue < we.length; ++Ue)
          we[Ue].callback(qe);
      }, Ce = se.allNoop && te === 0 ? we : e(we, te);
      Ce.allBuffers = se.allBuffers, ce(H, se, !0, se.length, Ce, "", Fe), ae(se);
    } else {
      do {
        const { chunk: Fe, encoding: Ce, callback: qe } = we[te];
        we[te++] = null;
        const Ue = Ae ? 1 : Fe.length;
        ce(H, se, !1, Ue, Fe, Ce, qe);
      } while (te < we.length && !se.writing);
      te === we.length ? ae(se) : te > 256 ? (we.splice(0, te), se.bufferedIndex = 0) : se.bufferedIndex = te;
    }
    se.bufferProcessing = !1;
  }
  de.prototype._write = function(H, se, we) {
    if (this._writev)
      this._writev(
        [
          {
            chunk: H,
            encoding: se
          }
        ],
        we
      );
    else
      throw new A("_write()");
  }, de.prototype._writev = null, de.prototype.end = function(H, se, we) {
    const Re = this._writableState;
    typeof H == "function" ? (we = H, H = null, se = null) : typeof se == "function" && (we = se, se = null);
    let Ae;
    if (H != null) {
      const Oe = Ee(this, H, se);
      Oe instanceof o && (Ae = Oe);
    }
    return Re.corked && (Re.corked = 1, this.uncork()), Ae || (!Re.errored && !Re.ending ? (Re.ending = !0, N(this, Re, !0), Re.ended = !0) : Re.finished ? Ae = new F("end") : Re.destroyed && (Ae = new R("end"))), typeof we == "function" && (Ae || Re.finished ? t.nextTick(we, Ae) : Re[h].push(we)), this;
  };
  function ue(H) {
    return H.ending && !H.destroyed && H.constructed && H.length === 0 && !H.errored && H.buffered.length === 0 && !H.finished && !H.writing && !H.errorEmitted && !H.closeEmitted;
  }
  function O(H, se) {
    let we = !1;
    function Re(Ae) {
      if (we) {
        C(H, Ae ?? w());
        return;
      }
      if (we = !0, se.pendingcb--, Ae) {
        const Oe = se[h].splice(0);
        for (let te = 0; te < Oe.length; te++)
          Oe[te](Ae);
        C(H, Ae, se.sync);
      } else ue(se) && (se.prefinished = !0, H.emit("prefinish"), se.pendingcb++, t.nextTick(re, H, se));
    }
    se.sync = !0, se.pendingcb++;
    try {
      H._final(Re);
    } catch (Ae) {
      Re(Ae);
    }
    se.sync = !1;
  }
  function B(H, se) {
    !se.prefinished && !se.finalCalled && (typeof H._final == "function" && !se.destroyed ? (se.finalCalled = !0, O(H, se)) : (se.prefinished = !0, H.emit("prefinish")));
  }
  function N(H, se, we) {
    ue(se) && (B(H, se), se.pendingcb === 0 && (we ? (se.pendingcb++, t.nextTick(
      (Re, Ae) => {
        ue(Ae) ? re(Re, Ae) : Ae.pendingcb--;
      },
      H,
      se
    )) : ue(se) && (se.pendingcb++, re(H, se))));
  }
  function re(H, se) {
    se.pendingcb--, se.finished = !0;
    const we = se[h].splice(0);
    for (let Re = 0; Re < we.length; Re++)
      we[Re]();
    if (H.emit("finish"), se.autoDestroy) {
      const Re = H._readableState;
      (!Re || Re.autoDestroy && // We don't expect the readable to ever 'end'
      // if readable is explicitly set to false.
      (Re.endEmitted || Re.readable === !1)) && H.destroy();
    }
  }
  n(de.prototype, {
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
  const ne = q.destroy;
  de.prototype.destroy = function(H, se) {
    const we = this._writableState;
    return !we.destroyed && (we.bufferedIndex < we.buffered.length || we[h].length) && t.nextTick(J, we), ne.call(this, H, se), this;
  }, de.prototype._undestroy = q.undestroy, de.prototype._destroy = function(H, se) {
    se(H);
  }, de.prototype[s.captureRejectionSymbol] = function(H) {
    this.destroy(H);
  };
  let D;
  function L() {
    return D === void 0 && (D = {}), D;
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
    isReadable: o,
    isWritable: l,
    isIterable: r,
    isNodeStream: n,
    isReadableNodeStream: f,
    isWritableNodeStream: u,
    isDuplexNodeStream: b,
    isReadableStream: S,
    isWritableStream: s
  } = requireUtils(), v = requireEndOfStream(), {
    AbortError: E,
    codes: { ERR_INVALID_ARG_TYPE: q, ERR_INVALID_RETURN_VALUE: p }
  } = requireErrors(), { destroyer: T } = requireDestroy(), d = requireDuplex(), y = requireReadable(), A = requireWritable(), { createDeferredPromise: w } = requireUtil(), I = requireFrom(), R = globalThis.Blob || e.Blob, F = typeof R < "u" ? function($) {
    return $ instanceof R;
  } : function($) {
    return !1;
  }, x = globalThis.AbortController || requireBrowser$2().AbortController, { FunctionPrototypeCall: M } = requirePrimordials();
  class Q extends d {
    constructor($) {
      super($), ($ == null ? void 0 : $.readable) === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), ($ == null ? void 0 : $.writable) === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0);
    }
  }
  duplexify = function h($, ae) {
    if (b($))
      return $;
    if (f($))
      return W({
        readable: $
      });
    if (u($))
      return W({
        writable: $
      });
    if (n($))
      return W({
        writable: !1,
        readable: !1
      });
    if (S($))
      return W({
        readable: y.fromWeb($)
      });
    if (s($))
      return W({
        writable: A.fromWeb($)
      });
    if (typeof $ == "function") {
      const { value: Ee, write: _e, final: ce, destroy: fe } = C($);
      if (r(Ee))
        return I(Q, Ee, {
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          write: _e,
          final: ce,
          destroy: fe
        });
      const k = Ee == null ? void 0 : Ee.then;
      if (typeof k == "function") {
        let pe;
        const ee = M(
          k,
          Ee,
          (J) => {
            if (J != null)
              throw new p("nully", "body", J);
          },
          (J) => {
            T(pe, J);
          }
        );
        return pe = new Q({
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          readable: !1,
          write: _e,
          final(J) {
            ce(async () => {
              try {
                await ee, t.nextTick(J, null);
              } catch (G) {
                t.nextTick(J, G);
              }
            });
          },
          destroy: fe
        });
      }
      throw new p("Iterable, AsyncIterable or AsyncFunction", ae, Ee);
    }
    if (F($))
      return h($.arrayBuffer());
    if (r($))
      return I(Q, $, {
        // TODO (ronag): highWaterMark?
        objectMode: !0,
        writable: !1
      });
    if (S($ == null ? void 0 : $.readable) && s($ == null ? void 0 : $.writable))
      return Q.fromWeb($);
    if (typeof ($ == null ? void 0 : $.writable) == "object" || typeof ($ == null ? void 0 : $.readable) == "object") {
      const Ee = $ != null && $.readable ? f($ == null ? void 0 : $.readable) ? $ == null ? void 0 : $.readable : h($.readable) : void 0, _e = $ != null && $.writable ? u($ == null ? void 0 : $.writable) ? $ == null ? void 0 : $.writable : h($.writable) : void 0;
      return W({
        readable: Ee,
        writable: _e
      });
    }
    const de = $ == null ? void 0 : $.then;
    if (typeof de == "function") {
      let Ee;
      return M(
        de,
        $,
        (_e) => {
          _e != null && Ee.push(_e), Ee.push(null);
        },
        (_e) => {
          T(Ee, _e);
        }
      ), Ee = new Q({
        objectMode: !0,
        writable: !1,
        read() {
        }
      });
    }
    throw new q(
      ae,
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
      $
    );
  };
  function C(h) {
    let { promise: $, resolve: ae } = w();
    const de = new x(), Ee = de.signal;
    return {
      value: h(
        (async function* () {
          for (; ; ) {
            const ce = $;
            $ = null;
            const { chunk: fe, done: k, cb: pe } = await ce;
            if (t.nextTick(pe), k) return;
            if (Ee.aborted)
              throw new E(void 0, {
                cause: Ee.reason
              });
            ({ promise: $, resolve: ae } = w()), yield fe;
          }
        })(),
        {
          signal: Ee
        }
      ),
      write(ce, fe, k) {
        const pe = ae;
        ae = null, pe({
          chunk: ce,
          done: !1,
          cb: k
        });
      },
      final(ce) {
        const fe = ae;
        ae = null, fe({
          done: !0,
          cb: ce
        });
      },
      destroy(ce, fe) {
        de.abort(), fe(ce);
      }
    };
  }
  function W(h) {
    const $ = h.readable && typeof h.readable.read != "function" ? y.wrap(h.readable) : h.readable, ae = h.writable;
    let de = !!o($), Ee = !!l(ae), _e, ce, fe, k, pe;
    function ee(J) {
      const G = k;
      k = null, G ? G(J) : J && pe.destroy(J);
    }
    return pe = new Q({
      // TODO (ronag): highWaterMark?
      readableObjectMode: !!($ != null && $.readableObjectMode),
      writableObjectMode: !!(ae != null && ae.writableObjectMode),
      readable: de,
      writable: Ee
    }), Ee && (v(ae, (J) => {
      Ee = !1, J && T($, J), ee(J);
    }), pe._write = function(J, G, ue) {
      ae.write(J, G) ? ue() : _e = ue;
    }, pe._final = function(J) {
      ae.end(), ce = J;
    }, ae.on("drain", function() {
      if (_e) {
        const J = _e;
        _e = null, J();
      }
    }), ae.on("finish", function() {
      if (ce) {
        const J = ce;
        ce = null, J();
      }
    })), de && (v($, (J) => {
      de = !1, J && T($, J), ee(J);
    }), $.on("readable", function() {
      if (fe) {
        const J = fe;
        fe = null, J();
      }
    }), $.on("end", function() {
      pe.push(null);
    }), pe._read = function() {
      for (; ; ) {
        const J = $.read();
        if (J === null) {
          fe = pe._read;
          return;
        }
        if (!pe.push(J))
          return;
      }
    }), pe._destroy = function(J, G) {
      !J && k !== null && (J = new E()), fe = null, _e = null, ce = null, k === null ? G(J) : (k = G, T(ae, J), T($, J));
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
    ObjectKeys: o,
    ObjectSetPrototypeOf: l
  } = requirePrimordials();
  duplex = f;
  const r = requireReadable(), n = requireWritable();
  l(f.prototype, r.prototype), l(f, r);
  {
    const s = o(n.prototype);
    for (let v = 0; v < s.length; v++) {
      const E = s[v];
      f.prototype[E] || (f.prototype[E] = n.prototype[E]);
    }
  }
  function f(s) {
    if (!(this instanceof f)) return new f(s);
    r.call(this, s), n.call(this, s), s ? (this.allowHalfOpen = s.allowHalfOpen !== !1, s.readable === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), s.writable === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0)) : this.allowHalfOpen = !0;
  }
  t(f.prototype, {
    writable: {
      __proto__: null,
      ...e(n.prototype, "writable")
    },
    writableHighWaterMark: {
      __proto__: null,
      ...e(n.prototype, "writableHighWaterMark")
    },
    writableObjectMode: {
      __proto__: null,
      ...e(n.prototype, "writableObjectMode")
    },
    writableBuffer: {
      __proto__: null,
      ...e(n.prototype, "writableBuffer")
    },
    writableLength: {
      __proto__: null,
      ...e(n.prototype, "writableLength")
    },
    writableFinished: {
      __proto__: null,
      ...e(n.prototype, "writableFinished")
    },
    writableCorked: {
      __proto__: null,
      ...e(n.prototype, "writableCorked")
    },
    writableEnded: {
      __proto__: null,
      ...e(n.prototype, "writableEnded")
    },
    writableNeedDrain: {
      __proto__: null,
      ...e(n.prototype, "writableNeedDrain")
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
      },
      set(s) {
        this._readableState && this._writableState && (this._readableState.destroyed = s, this._writableState.destroyed = s);
      }
    }
  });
  let u;
  function b() {
    return u === void 0 && (u = {}), u;
  }
  f.fromWeb = function(s, v) {
    return b().newStreamDuplexFromReadableWritablePair(s, v);
  }, f.toWeb = function(s) {
    return b().newReadableWritablePairFromDuplex(s);
  };
  let S;
  return f.from = function(s) {
    return S || (S = requireDuplexify()), S(s, "body");
  }, duplex;
}
var transform, hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform;
  hasRequiredTransform = 1;
  const { ObjectSetPrototypeOf: t, Symbol: e } = requirePrimordials();
  transform = f;
  const { ERR_METHOD_NOT_IMPLEMENTED: o } = requireErrors().codes, l = requireDuplex(), { getHighWaterMark: r } = requireState();
  t(f.prototype, l.prototype), t(f, l);
  const n = e("kCallback");
  function f(S) {
    if (!(this instanceof f)) return new f(S);
    const s = S ? r(this, S, "readableHighWaterMark", !0) : null;
    s === 0 && (S = {
      ...S,
      highWaterMark: null,
      readableHighWaterMark: s,
      // TODO (ronag): 0 is not optimal since we have
      // a "bug" where we check needDrain before calling _write and not after.
      // Refs: https://github.com/nodejs/node/pull/32887
      // Refs: https://github.com/nodejs/node/pull/35941
      writableHighWaterMark: S.writableHighWaterMark || 0
    }), l.call(this, S), this._readableState.sync = !1, this[n] = null, S && (typeof S.transform == "function" && (this._transform = S.transform), typeof S.flush == "function" && (this._flush = S.flush)), this.on("prefinish", b);
  }
  function u(S) {
    typeof this._flush == "function" && !this.destroyed ? this._flush((s, v) => {
      if (s) {
        S ? S(s) : this.destroy(s);
        return;
      }
      v != null && this.push(v), this.push(null), S && S();
    }) : (this.push(null), S && S());
  }
  function b() {
    this._final !== u && u.call(this);
  }
  return f.prototype._final = u, f.prototype._transform = function(S, s, v) {
    throw new o("_transform()");
  }, f.prototype._write = function(S, s, v) {
    const E = this._readableState, q = this._writableState, p = E.length;
    this._transform(S, s, (T, d) => {
      if (T) {
        v(T);
        return;
      }
      d != null && this.push(d), q.ended || // Backwards compat.
      p === E.length || // Backwards compat.
      E.length < E.highWaterMark ? v() : this[n] = v;
    });
  }, f.prototype._read = function() {
    if (this[n]) {
      const S = this[n];
      this[n] = null, S();
    }
  }, transform;
}
var passthrough, hasRequiredPassthrough;
function requirePassthrough() {
  if (hasRequiredPassthrough) return passthrough;
  hasRequiredPassthrough = 1;
  const { ObjectSetPrototypeOf: t } = requirePrimordials();
  passthrough = o;
  const e = requireTransform();
  t(o.prototype, e.prototype), t(o, e);
  function o(l) {
    if (!(this instanceof o)) return new o(l);
    e.call(this, l);
  }
  return o.prototype._transform = function(l, r, n) {
    n(null, l);
  }, passthrough;
}
var pipeline_1, hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  const t = requireBrowser$1(), { ArrayIsArray: e, Promise: o, SymbolAsyncIterator: l, SymbolDispose: r } = requirePrimordials(), n = requireEndOfStream(), { once: f } = requireUtil(), u = requireDestroy(), b = requireDuplex(), {
    aggregateTwoErrors: S,
    codes: {
      ERR_INVALID_ARG_TYPE: s,
      ERR_INVALID_RETURN_VALUE: v,
      ERR_MISSING_ARGS: E,
      ERR_STREAM_DESTROYED: q,
      ERR_STREAM_PREMATURE_CLOSE: p
    },
    AbortError: T
  } = requireErrors(), { validateFunction: d, validateAbortSignal: y } = requireValidators(), {
    isIterable: A,
    isReadable: w,
    isReadableNodeStream: I,
    isNodeStream: R,
    isTransformStream: F,
    isWebStream: x,
    isReadableStream: M,
    isReadableFinished: Q
  } = requireUtils(), C = globalThis.AbortController || requireBrowser$2().AbortController;
  let W, h, $;
  function ae(J, G, ue) {
    let O = !1;
    J.on("close", () => {
      O = !0;
    });
    const B = n(
      J,
      {
        readable: G,
        writable: ue
      },
      (N) => {
        O = !N;
      }
    );
    return {
      destroy: (N) => {
        O || (O = !0, u.destroyer(J, N || new q("pipe")));
      },
      cleanup: B
    };
  }
  function de(J) {
    return d(J[J.length - 1], "streams[stream.length - 1]"), J.pop();
  }
  function Ee(J) {
    if (A(J))
      return J;
    if (I(J))
      return _e(J);
    throw new s("val", ["Readable", "Iterable", "AsyncIterable"], J);
  }
  async function* _e(J) {
    h || (h = requireReadable()), yield* h.prototype[l].call(J);
  }
  async function ce(J, G, ue, { end: O }) {
    let B, N = null;
    const re = (L) => {
      if (L && (B = L), N) {
        const H = N;
        N = null, H();
      }
    }, ne = () => new o((L, H) => {
      B ? H(B) : N = () => {
        B ? H(B) : L();
      };
    });
    G.on("drain", re);
    const D = n(
      G,
      {
        readable: !1
      },
      re
    );
    try {
      G.writableNeedDrain && await ne();
      for await (const L of J)
        G.write(L) || await ne();
      O && (G.end(), await ne()), ue();
    } catch (L) {
      ue(B !== L ? S(B, L) : L);
    } finally {
      D(), G.off("drain", re);
    }
  }
  async function fe(J, G, ue, { end: O }) {
    F(G) && (G = G.writable);
    const B = G.getWriter();
    try {
      for await (const N of J)
        await B.ready, B.write(N).catch(() => {
        });
      await B.ready, O && await B.close(), ue();
    } catch (N) {
      try {
        await B.abort(N), ue(N);
      } catch (re) {
        ue(re);
      }
    }
  }
  function k(...J) {
    return pe(J, f(de(J)));
  }
  function pe(J, G, ue) {
    if (J.length === 1 && e(J[0]) && (J = J[0]), J.length < 2)
      throw new E("streams");
    const O = new C(), B = O.signal, N = ue == null ? void 0 : ue.signal, re = [];
    y(N, "options.signal");
    function ne() {
      Ae(new T());
    }
    $ = $ || requireUtil().addAbortListener;
    let D;
    N && (D = $(N, ne));
    let L, H;
    const se = [];
    let we = 0;
    function Re(Ce) {
      Ae(Ce, --we === 0);
    }
    function Ae(Ce, qe) {
      var Ue;
      if (Ce && (!L || L.code === "ERR_STREAM_PREMATURE_CLOSE") && (L = Ce), !(!L && !qe)) {
        for (; se.length; )
          se.shift()(L);
        (Ue = D) === null || Ue === void 0 || Ue[r](), O.abort(), qe && (L || re.forEach((me) => me()), t.nextTick(G, L, H));
      }
    }
    let Oe;
    for (let Ce = 0; Ce < J.length; Ce++) {
      const qe = J[Ce], Ue = Ce < J.length - 1, me = Ce > 0, Se = Ue || (ue == null ? void 0 : ue.end) !== !1, Le = Ce === J.length - 1;
      if (R(qe)) {
        let Me = function(je) {
          je && je.name !== "AbortError" && je.code !== "ERR_STREAM_PREMATURE_CLOSE" && Re(je);
        };
        if (Se) {
          const { destroy: je, cleanup: He } = ae(qe, Ue, me);
          se.push(je), w(qe) && Le && re.push(He);
        }
        qe.on("error", Me), w(qe) && Le && re.push(() => {
          qe.removeListener("error", Me);
        });
      }
      if (Ce === 0)
        if (typeof qe == "function") {
          if (Oe = qe({
            signal: B
          }), !A(Oe))
            throw new v("Iterable, AsyncIterable or Stream", "source", Oe);
        } else A(qe) || I(qe) || F(qe) ? Oe = qe : Oe = b.from(qe);
      else if (typeof qe == "function") {
        if (F(Oe)) {
          var te;
          Oe = Ee((te = Oe) === null || te === void 0 ? void 0 : te.readable);
        } else
          Oe = Ee(Oe);
        if (Oe = qe(Oe, {
          signal: B
        }), Ue) {
          if (!A(Oe, !0))
            throw new v("AsyncIterable", `transform[${Ce - 1}]`, Oe);
        } else {
          var Fe;
          W || (W = requirePassthrough());
          const Me = new W({
            objectMode: !0
          }), je = (Fe = Oe) === null || Fe === void 0 ? void 0 : Fe.then;
          if (typeof je == "function")
            we++, je.call(
              Oe,
              (a) => {
                H = a, a != null && Me.write(a), Se && Me.end(), t.nextTick(Re);
              },
              (a) => {
                Me.destroy(a), t.nextTick(Re, a);
              }
            );
          else if (A(Oe, !0))
            we++, ce(Oe, Me, Re, {
              end: Se
            });
          else if (M(Oe) || F(Oe)) {
            const a = Oe.readable || Oe;
            we++, ce(a, Me, Re, {
              end: Se
            });
          } else
            throw new v("AsyncIterable or Promise", "destination", Oe);
          Oe = Me;
          const { destroy: He, cleanup: U } = ae(Oe, !1, !0);
          se.push(He), Le && re.push(U);
        }
      } else if (R(qe)) {
        if (I(Oe)) {
          we += 2;
          const Me = ee(Oe, qe, Re, {
            end: Se
          });
          w(qe) && Le && re.push(Me);
        } else if (F(Oe) || M(Oe)) {
          const Me = Oe.readable || Oe;
          we++, ce(Me, qe, Re, {
            end: Se
          });
        } else if (A(Oe))
          we++, ce(Oe, qe, Re, {
            end: Se
          });
        else
          throw new s(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = qe;
      } else if (x(qe)) {
        if (I(Oe))
          we++, fe(Ee(Oe), qe, Re, {
            end: Se
          });
        else if (M(Oe) || A(Oe))
          we++, fe(Oe, qe, Re, {
            end: Se
          });
        else if (F(Oe))
          we++, fe(Oe.readable, qe, Re, {
            end: Se
          });
        else
          throw new s(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = qe;
      } else
        Oe = b.from(qe);
    }
    return (B != null && B.aborted || N != null && N.aborted) && t.nextTick(ne), Oe;
  }
  function ee(J, G, ue, { end: O }) {
    let B = !1;
    if (G.on("close", () => {
      B || ue(new p());
    }), J.pipe(G, {
      end: !1
    }), O) {
      let N = function() {
        B = !0, G.end();
      };
      Q(J) ? t.nextTick(N) : J.once("end", N);
    } else
      ue();
    return n(
      J,
      {
        readable: !0,
        writable: !1
      },
      (N) => {
        const re = J._readableState;
        N && N.code === "ERR_STREAM_PREMATURE_CLOSE" && re && re.ended && !re.errored && !re.errorEmitted ? J.once("end", ue).once("error", ue) : ue(N);
      }
    ), n(
      G,
      {
        readable: !1,
        writable: !0
      },
      ue
    );
  }
  return pipeline_1 = {
    pipelineImpl: pe,
    pipeline: k
  }, pipeline_1;
}
var compose, hasRequiredCompose;
function requireCompose() {
  if (hasRequiredCompose) return compose;
  hasRequiredCompose = 1;
  const { pipeline: t } = requirePipeline(), e = requireDuplex(), { destroyer: o } = requireDestroy(), {
    isNodeStream: l,
    isReadable: r,
    isWritable: n,
    isWebStream: f,
    isTransformStream: u,
    isWritableStream: b,
    isReadableStream: S
  } = requireUtils(), {
    AbortError: s,
    codes: { ERR_INVALID_ARG_VALUE: v, ERR_MISSING_ARGS: E }
  } = requireErrors(), q = requireEndOfStream();
  return compose = function(...T) {
    if (T.length === 0)
      throw new E("streams");
    if (T.length === 1)
      return e.from(T[0]);
    const d = [...T];
    if (typeof T[0] == "function" && (T[0] = e.from(T[0])), typeof T[T.length - 1] == "function") {
      const W = T.length - 1;
      T[W] = e.from(T[W]);
    }
    for (let W = 0; W < T.length; ++W)
      if (!(!l(T[W]) && !f(T[W]))) {
        if (W < T.length - 1 && !(r(T[W]) || S(T[W]) || u(T[W])))
          throw new v(`streams[${W}]`, d[W], "must be readable");
        if (W > 0 && !(n(T[W]) || b(T[W]) || u(T[W])))
          throw new v(`streams[${W}]`, d[W], "must be writable");
      }
    let y, A, w, I, R;
    function F(W) {
      const h = I;
      I = null, h ? h(W) : W ? R.destroy(W) : !C && !Q && R.destroy();
    }
    const x = T[0], M = t(T, F), Q = !!(n(x) || b(x) || u(x)), C = !!(r(M) || S(M) || u(M));
    if (R = new e({
      // TODO (ronag): highWaterMark?
      writableObjectMode: !!(x != null && x.writableObjectMode),
      readableObjectMode: !!(M != null && M.readableObjectMode),
      writable: Q,
      readable: C
    }), Q) {
      if (l(x))
        R._write = function(h, $, ae) {
          x.write(h, $) ? ae() : y = ae;
        }, R._final = function(h) {
          x.end(), A = h;
        }, x.on("drain", function() {
          if (y) {
            const h = y;
            y = null, h();
          }
        });
      else if (f(x)) {
        const $ = (u(x) ? x.writable : x).getWriter();
        R._write = async function(ae, de, Ee) {
          try {
            await $.ready, $.write(ae).catch(() => {
            }), Ee();
          } catch (_e) {
            Ee(_e);
          }
        }, R._final = async function(ae) {
          try {
            await $.ready, $.close().catch(() => {
            }), A = ae;
          } catch (de) {
            ae(de);
          }
        };
      }
      const W = u(M) ? M.readable : M;
      q(W, () => {
        if (A) {
          const h = A;
          A = null, h();
        }
      });
    }
    if (C) {
      if (l(M))
        M.on("readable", function() {
          if (w) {
            const W = w;
            w = null, W();
          }
        }), M.on("end", function() {
          R.push(null);
        }), R._read = function() {
          for (; ; ) {
            const W = M.read();
            if (W === null) {
              w = R._read;
              return;
            }
            if (!R.push(W))
              return;
          }
        };
      else if (f(M)) {
        const h = (u(M) ? M.readable : M).getReader();
        R._read = async function() {
          for (; ; )
            try {
              const { value: $, done: ae } = await h.read();
              if (!R.push($))
                return;
              if (ae) {
                R.push(null);
                return;
              }
            } catch {
              return;
            }
        };
      }
    }
    return R._destroy = function(W, h) {
      !W && I !== null && (W = new s()), w = null, y = null, A = null, I === null ? h(W) : (I = h, l(M) && o(M, W));
    }, R;
  }, compose;
}
var hasRequiredOperators;
function requireOperators() {
  if (hasRequiredOperators) return operators;
  hasRequiredOperators = 1;
  const t = globalThis.AbortController || requireBrowser$2().AbortController, {
    codes: { ERR_INVALID_ARG_VALUE: e, ERR_INVALID_ARG_TYPE: o, ERR_MISSING_ARGS: l, ERR_OUT_OF_RANGE: r },
    AbortError: n
  } = requireErrors(), { validateAbortSignal: f, validateInteger: u, validateObject: b } = requireValidators(), S = requirePrimordials().Symbol("kWeak"), s = requirePrimordials().Symbol("kResistStopPropagation"), { finished: v } = requireEndOfStream(), E = requireCompose(), { addAbortSignalNoValidate: q } = requireAddAbortSignal(), { isWritable: p, isNodeStream: T } = requireUtils(), { deprecate: d } = requireUtil(), {
    ArrayPrototypePush: y,
    Boolean: A,
    MathFloor: w,
    Number: I,
    NumberIsNaN: R,
    Promise: F,
    PromiseReject: x,
    PromiseResolve: M,
    PromisePrototypeThen: Q,
    Symbol: C
  } = requirePrimordials(), W = C("kEmpty"), h = C("kEof");
  function $(N, re) {
    if (re != null && b(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), T(N) && !p(N))
      throw new e("stream", N, "must be writable");
    const ne = E(this, N);
    return re != null && re.signal && q(re.signal, ne), ne;
  }
  function ae(N, re) {
    if (typeof N != "function")
      throw new o("fn", ["Function", "AsyncFunction"], N);
    re != null && b(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal");
    let ne = 1;
    (re == null ? void 0 : re.concurrency) != null && (ne = w(re.concurrency));
    let D = ne - 1;
    return (re == null ? void 0 : re.highWaterMark) != null && (D = w(re.highWaterMark)), u(ne, "options.concurrency", 1), u(D, "options.highWaterMark", 0), D += ne, (async function* () {
      const H = requireUtil().AbortSignalAny(
        [re == null ? void 0 : re.signal].filter(A)
      ), se = this, we = [], Re = {
        signal: H
      };
      let Ae, Oe, te = !1, Fe = 0;
      function Ce() {
        te = !0, qe();
      }
      function qe() {
        Fe -= 1, Ue();
      }
      function Ue() {
        Oe && !te && Fe < ne && we.length < D && (Oe(), Oe = null);
      }
      async function me() {
        try {
          for await (let Se of se) {
            if (te)
              return;
            if (H.aborted)
              throw new n();
            try {
              if (Se = N(Se, Re), Se === W)
                continue;
              Se = M(Se);
            } catch (Le) {
              Se = x(Le);
            }
            Fe += 1, Q(Se, qe, Ce), we.push(Se), Ae && (Ae(), Ae = null), !te && (we.length >= D || Fe >= ne) && await new F((Le) => {
              Oe = Le;
            });
          }
          we.push(h);
        } catch (Se) {
          const Le = x(Se);
          Q(Le, qe, Ce), we.push(Le);
        } finally {
          te = !0, Ae && (Ae(), Ae = null);
        }
      }
      me();
      try {
        for (; ; ) {
          for (; we.length > 0; ) {
            const Se = await we[0];
            if (Se === h)
              return;
            if (H.aborted)
              throw new n();
            Se !== W && (yield Se), we.shift(), Ue();
          }
          await new F((Se) => {
            Ae = Se;
          });
        }
      } finally {
        te = !0, Oe && (Oe(), Oe = null);
      }
    }).call(this);
  }
  function de(N = void 0) {
    return N != null && b(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal"), (async function* () {
      let ne = 0;
      for await (const L of this) {
        var D;
        if (N != null && (D = N.signal) !== null && D !== void 0 && D.aborted)
          throw new n({
            cause: N.signal.reason
          });
        yield [ne++, L];
      }
    }).call(this);
  }
  async function Ee(N, re = void 0) {
    for await (const ne of k.call(this, N, re))
      return !0;
    return !1;
  }
  async function _e(N, re = void 0) {
    if (typeof N != "function")
      throw new o("fn", ["Function", "AsyncFunction"], N);
    return !await Ee.call(
      this,
      async (...ne) => !await N(...ne),
      re
    );
  }
  async function ce(N, re) {
    for await (const ne of k.call(this, N, re))
      return ne;
  }
  async function fe(N, re) {
    if (typeof N != "function")
      throw new o("fn", ["Function", "AsyncFunction"], N);
    async function ne(D, L) {
      return await N(D, L), W;
    }
    for await (const D of ae.call(this, ne, re)) ;
  }
  function k(N, re) {
    if (typeof N != "function")
      throw new o("fn", ["Function", "AsyncFunction"], N);
    async function ne(D, L) {
      return await N(D, L) ? D : W;
    }
    return ae.call(this, ne, re);
  }
  class pe extends l {
    constructor() {
      super("reduce"), this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function ee(N, re, ne) {
    var D;
    if (typeof N != "function")
      throw new o("reducer", ["Function", "AsyncFunction"], N);
    ne != null && b(ne, "options"), (ne == null ? void 0 : ne.signal) != null && f(ne.signal, "options.signal");
    let L = arguments.length > 1;
    if (ne != null && (D = ne.signal) !== null && D !== void 0 && D.aborted) {
      const Ae = new n(void 0, {
        cause: ne.signal.reason
      });
      throw this.once("error", () => {
      }), await v(this.destroy(Ae)), Ae;
    }
    const H = new t(), se = H.signal;
    if (ne != null && ne.signal) {
      const Ae = {
        once: !0,
        [S]: this,
        [s]: !0
      };
      ne.signal.addEventListener("abort", () => H.abort(), Ae);
    }
    let we = !1;
    try {
      for await (const Ae of this) {
        var Re;
        if (we = !0, ne != null && (Re = ne.signal) !== null && Re !== void 0 && Re.aborted)
          throw new n();
        L ? re = await N(re, Ae, {
          signal: se
        }) : (re = Ae, L = !0);
      }
      if (!we && !L)
        throw new pe();
    } finally {
      H.abort();
    }
    return re;
  }
  async function J(N) {
    N != null && b(N, "options"), (N == null ? void 0 : N.signal) != null && f(N.signal, "options.signal");
    const re = [];
    for await (const D of this) {
      var ne;
      if (N != null && (ne = N.signal) !== null && ne !== void 0 && ne.aborted)
        throw new n(void 0, {
          cause: N.signal.reason
        });
      y(re, D);
    }
    return re;
  }
  function G(N, re) {
    const ne = ae.call(this, N, re);
    return (async function* () {
      for await (const L of ne)
        yield* L;
    }).call(this);
  }
  function ue(N) {
    if (N = I(N), R(N))
      return 0;
    if (N < 0)
      throw new r("number", ">= 0", N);
    return N;
  }
  function O(N, re = void 0) {
    return re != null && b(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = ue(N), (async function* () {
      var D;
      if (re != null && (D = re.signal) !== null && D !== void 0 && D.aborted)
        throw new n();
      for await (const H of this) {
        var L;
        if (re != null && (L = re.signal) !== null && L !== void 0 && L.aborted)
          throw new n();
        N-- <= 0 && (yield H);
      }
    }).call(this);
  }
  function B(N, re = void 0) {
    return re != null && b(re, "options"), (re == null ? void 0 : re.signal) != null && f(re.signal, "options.signal"), N = ue(N), (async function* () {
      var D;
      if (re != null && (D = re.signal) !== null && D !== void 0 && D.aborted)
        throw new n();
      for await (const H of this) {
        var L;
        if (re != null && (L = re.signal) !== null && L !== void 0 && L.aborted)
          throw new n();
        if (N-- > 0 && (yield H), N <= 0)
          return;
      }
    }).call(this);
  }
  return operators.streamReturningOperators = {
    asIndexedPairs: d(de, "readable.asIndexedPairs will be removed in a future version."),
    drop: O,
    filter: k,
    flatMap: G,
    map: ae,
    take: B,
    compose: $
  }, operators.promiseReturningOperators = {
    every: _e,
    forEach: fe,
    reduce: ee,
    toArray: J,
    some: Ee,
    find: ce
  }, operators;
}
var promises, hasRequiredPromises;
function requirePromises() {
  if (hasRequiredPromises) return promises;
  hasRequiredPromises = 1;
  const { ArrayPrototypePop: t, Promise: e } = requirePrimordials(), { isIterable: o, isNodeStream: l, isWebStream: r } = requireUtils(), { pipelineImpl: n } = requirePipeline(), { finished: f } = requireEndOfStream();
  requireStream();
  function u(...b) {
    return new e((S, s) => {
      let v, E;
      const q = b[b.length - 1];
      if (q && typeof q == "object" && !l(q) && !o(q) && !r(q)) {
        const p = t(b);
        v = p.signal, E = p.end;
      }
      n(
        b,
        (p, T) => {
          p ? s(p) : S(T);
        },
        {
          signal: v,
          end: E
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
  const { Buffer: t } = requireDist(), { ObjectDefineProperty: e, ObjectKeys: o, ReflectApply: l } = requirePrimordials(), {
    promisify: { custom: r }
  } = requireUtil(), { streamReturningOperators: n, promiseReturningOperators: f } = requireOperators(), {
    codes: { ERR_ILLEGAL_CONSTRUCTOR: u }
  } = requireErrors(), b = requireCompose(), { setDefaultHighWaterMark: S, getDefaultHighWaterMark: s } = requireState(), { pipeline: v } = requirePipeline(), { destroyer: E } = requireDestroy(), q = requireEndOfStream(), p = requirePromises(), T = requireUtils(), d = stream.exports = requireLegacy().Stream;
  d.isDestroyed = T.isDestroyed, d.isDisturbed = T.isDisturbed, d.isErrored = T.isErrored, d.isReadable = T.isReadable, d.isWritable = T.isWritable, d.Readable = requireReadable();
  for (const A of o(n)) {
    let I = function(...R) {
      if (new.target)
        throw u();
      return d.Readable.from(l(w, this, R));
    };
    const w = n[A];
    e(I, "name", {
      __proto__: null,
      value: w.name
    }), e(I, "length", {
      __proto__: null,
      value: w.length
    }), e(d.Readable.prototype, A, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  for (const A of o(f)) {
    let I = function(...R) {
      if (new.target)
        throw u();
      return l(w, this, R);
    };
    const w = f[A];
    e(I, "name", {
      __proto__: null,
      value: w.name
    }), e(I, "length", {
      __proto__: null,
      value: w.length
    }), e(d.Readable.prototype, A, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  d.Writable = requireWritable(), d.Duplex = requireDuplex(), d.Transform = requireTransform(), d.PassThrough = requirePassthrough(), d.pipeline = v;
  const { addAbortSignal: y } = requireAddAbortSignal();
  return d.addAbortSignal = y, d.finished = q, d.destroy = E, d.compose = b, d.setDefaultHighWaterMark = S, d.getDefaultHighWaterMark = s, e(d, "promises", {
    __proto__: null,
    configurable: !0,
    enumerable: !0,
    get() {
      return p;
    }
  }), e(v, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return p.pipeline;
    }
  }), e(q, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return p.finished;
    }
  }), d.Stream = d, d._isUint8Array = function(w) {
    return w instanceof Uint8Array;
  }, d._uint8ArrayToBuffer = function(w) {
    return t.from(w.buffer, w.byteOffset, w.byteLength);
  }, stream.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  return hasRequiredBrowser || (hasRequiredBrowser = 1, (function(t) {
    const e = requireStream(), o = requirePromises(), l = e.Readable.destroy;
    t.exports = e.Readable, t.exports._uint8ArrayToBuffer = e._uint8ArrayToBuffer, t.exports._isUint8Array = e._isUint8Array, t.exports.isDisturbed = e.isDisturbed, t.exports.isErrored = e.isErrored, t.exports.isReadable = e.isReadable, t.exports.Readable = e.Readable, t.exports.Writable = e.Writable, t.exports.Duplex = e.Duplex, t.exports.Transform = e.Transform, t.exports.PassThrough = e.PassThrough, t.exports.addAbortSignal = e.addAbortSignal, t.exports.finished = e.finished, t.exports.destroy = e.destroy, t.exports.destroy = l, t.exports.pipeline = e.pipeline, t.exports.compose = e.compose, Object.defineProperty(e, "promises", {
      configurable: !0,
      enumerable: !0,
      get() {
        return o;
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
    constructor(n, f) {
      super({ writableObjectMode: !0 }), this.proto = n, this.mainType = f, this.queue = Buffer.alloc(0);
    }
    createPacketBuffer(n) {
      return this.proto.createPacketBuffer(this.mainType, n);
    }
    _transform(n, f, u) {
      let b;
      try {
        b = this.createPacketBuffer(n);
      } catch (S) {
        return u(S);
      }
      return this.push(b), u();
    }
  }
  class o extends t {
    constructor(n, f) {
      super({ readableObjectMode: !0 }), this.proto = n, this.mainType = f, this.queue = Buffer.alloc(0);
    }
    parsePacketBuffer(n) {
      return this.proto.parsePacketBuffer(this.mainType, n);
    }
    _transform(n, f, u) {
      for (this.queue = Buffer.concat([this.queue, n]); ; ) {
        let b;
        try {
          b = this.parsePacketBuffer(this.queue);
        } catch (S) {
          return S.partialReadError ? u() : (S.buffer = this.queue, this.queue = Buffer.alloc(0), u(S));
        }
        this.push(b), this.queue = this.queue.slice(b.metadata.size);
      }
    }
  }
  class l extends t {
    constructor(n, f, u = !1) {
      super({ readableObjectMode: !0 }), this.proto = n, this.mainType = f, this.noErrorLogging = u;
    }
    parsePacketBuffer(n) {
      return this.proto.parsePacketBuffer(this.mainType, n);
    }
    _transform(n, f, u) {
      let b;
      try {
        b = this.parsePacketBuffer(n), b.metadata.size !== n.length && !this.noErrorLogging && console.log("Chunk size is " + n.length + " but only " + b.metadata.size + " was read ; partial packet : " + JSON.stringify(b.data) + "; buffer :" + n.toString("hex"));
      } catch (S) {
        return S.partialReadError ? (this.noErrorLogging || console.log(S.stack), u()) : u(S);
      }
      this.push(b), u();
    }
  }
  return serializer = {
    Serializer: e,
    Parser: o,
    FullPacketParser: l
  }, serializer;
}
var compilerConditional, hasRequiredCompilerConditional;
function requireCompilerConditional() {
  return hasRequiredCompilerConditional || (hasRequiredCompilerConditional = 1, compilerConditional = {
    Read: {
      switch: ["parametrizable", (t, e) => {
        let o = e.compareTo ? e.compareTo : e.compareToValue;
        const l = [];
        o.startsWith("$") ? l.push(o) : e.compareTo && (o = t.getField(o, !0));
        let r = `switch (${o}) {
`;
        for (const n in e.fields) {
          let f = n;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType(e.fields[n])) + `
`;
        }
        return r += t.indent("default: return " + t.callType(e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, l);
      }],
      option: ["parametrizable", (t, e) => {
        let o = `const {value} = ctx.bool(buffer, offset)
`;
        return o += `if (value) {
`, o += "  const { value, size } = " + t.callType(e, "offset + 1") + `
`, o += `  return { value, size: size + 1 }
`, o += `}
`, o += "return { value: undefined, size: 1}", t.wrapCode(o);
      }]
    },
    Write: {
      switch: ["parametrizable", (t, e) => {
        let o = e.compareTo ? e.compareTo : e.compareToValue;
        const l = [];
        o.startsWith("$") ? l.push(o) : e.compareTo && (o = t.getField(o, !0));
        let r = `switch (${o}) {
`;
        for (const n in e.fields) {
          let f = n;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[n])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, l);
      }],
      option: ["parametrizable", (t, e) => {
        let o = `if (value != null) {
`;
        return o += `  offset = ctx.bool(1, buffer, offset)
`, o += "  offset = " + t.callType("value", e) + `
`, o += `} else {
`, o += `  offset = ctx.bool(0, buffer, offset)
`, o += `}
`, o += "return offset", t.wrapCode(o);
      }]
    },
    SizeOf: {
      switch: ["parametrizable", (t, e) => {
        let o = e.compareTo ? e.compareTo : e.compareToValue;
        const l = [];
        o.startsWith("$") ? l.push(o) : e.compareTo && (o = t.getField(o, !0));
        let r = `switch (${o}) {
`;
        for (const n in e.fields) {
          let f = n;
          f.startsWith("/") ? f = "ctx." + f.slice(1) : isNaN(f) && f !== "true" && f !== "false" && (f = `"${f}"`), r += t.indent(`case ${f}: return ` + t.callType("value", e.fields[n])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, l);
      }],
      option: ["parametrizable", (t, e) => {
        let o = `if (value != null) {
`;
        return o += "  return 1 + " + t.callType("value", e) + `
`, o += `}
`, o += "return 1", t.wrapCode(o);
      }]
    }
  }), compilerConditional;
}
var compilerStructures, hasRequiredCompilerStructures;
function requireCompilerStructures() {
  if (hasRequiredCompilerStructures) return compilerStructures;
  hasRequiredCompilerStructures = 1, compilerStructures = {
    Read: {
      array: ["parametrizable", (o, l) => {
        let r = "";
        if (l.countType)
          r += "const { value: count, size: countSize } = " + o.callType(l.countType) + `
`;
        else if (l.count)
          r += "const count = " + l.count + `
`, r += `const countSize = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return r += `if (count > 0xffffff && !ctx.noArraySizeCheck) throw new Error("array size is abnormally large, not reading: " + count)
`, r += `const data = []
`, r += `let size = countSize
`, r += `for (let i = 0; i < count; i++) {
`, r += "  const elem = " + o.callType(l.type, "offset + size") + `
`, r += `  data.push(elem.value)
`, r += `  size += elem.size
`, r += `}
`, r += "return { value: data, size }", o.wrapCode(r);
      }],
      count: ["parametrizable", (o, l) => {
        const r = "return " + o.callType(l.type);
        return o.wrapCode(r);
      }],
      container: ["parametrizable", (o, l) => {
        l = e(l);
        let r = "", n = "offset";
        const f = [];
        for (const b in l) {
          const { type: S, name: s, anon: v, _shouldBeInlined: E } = l[b];
          let q, p;
          if (S instanceof Array && S[0] === "bitfield" && v) {
            const T = [];
            for (const { name: d } of S[1]) {
              const y = o.getField(d);
              d === y ? (f.push(d), T.push(d)) : (f.push(`${d}: ${y}`), T.push(`${d}: ${y}`));
            }
            q = "{" + T.join(", ") + "}", p = `anon${b}Size`;
          } else
            q = o.getField(s), p = `${q}Size`, E ? f.push("..." + s) : s === q ? f.push(s) : f.push(`${s}: ${q}`);
          r += `let { value: ${q}, size: ${p} } = ` + o.callType(S, n) + `
`, n += ` + ${p}`;
        }
        const u = n.split(" + ");
        return u.shift(), u.length === 0 && u.push("0"), r += "return { value: { " + f.join(", ") + " }, size: " + u.join(" + ") + "}", o.wrapCode(r);
      }]
    },
    Write: {
      array: ["parametrizable", (o, l) => {
        let r = "";
        if (l.countType)
          r += "offset = " + o.callType("value.length", l.countType) + `
`;
        else if (l.count === null)
          throw new Error("Array must contain either count or countType");
        return r += `for (let i = 0; i < value.length; i++) {
`, r += "  offset = " + o.callType("value[i]", l.type) + `
`, r += `}
`, r += "return offset", o.wrapCode(r);
      }],
      count: ["parametrizable", (o, l) => {
        const r = "return " + o.callType("value", l.type);
        return o.wrapCode(r);
      }],
      container: ["parametrizable", (o, l) => {
        l = e(l);
        let r = "";
        for (const n in l) {
          const { type: f, name: u, anon: b, _shouldBeInlined: S } = l[n];
          let s;
          if (f instanceof Array && f[0] === "bitfield" && b) {
            const v = [];
            for (const { name: E } of f[1]) {
              const q = o.getField(E);
              r += `const ${q} = value.${E}
`, E === q ? v.push(E) : v.push(`${E}: ${q}`);
            }
            s = "{" + v.join(", ") + "}";
          } else
            s = o.getField(u), S ? r += `let ${u} = value
` : r += `let ${s} = value.${u}
`;
          r += "offset = " + o.callType(s, f) + `
`;
        }
        return r += "return offset", o.wrapCode(r);
      }]
    },
    SizeOf: {
      array: ["parametrizable", (o, l) => {
        let r = "";
        if (l.countType)
          r += "let size = " + o.callType("value.length", l.countType) + `
`;
        else if (l.count)
          r += `let size = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return isNaN(o.callType("value[i]", l.type)) ? (r += `for (let i = 0; i < value.length; i++) {
`, r += "  size += " + o.callType("value[i]", l.type) + `
`, r += `}
`) : r += "size += value.length * " + o.callType("value[i]", l.type) + `
`, r += "return size", o.wrapCode(r);
      }],
      count: ["parametrizable", (o, l) => {
        const r = "return " + o.callType("value", l.type);
        return o.wrapCode(r);
      }],
      container: ["parametrizable", (o, l) => {
        l = e(l);
        let r = `let size = 0
`;
        for (const n in l) {
          const { type: f, name: u, anon: b, _shouldBeInlined: S } = l[n];
          let s;
          if (f instanceof Array && f[0] === "bitfield" && b) {
            const v = [];
            for (const { name: E } of f[1]) {
              const q = o.getField(E);
              r += `const ${q} = value.${E}
`, E === q ? v.push(E) : v.push(`${E}: ${q}`);
            }
            s = "{" + v.join(", ") + "}";
          } else
            s = o.getField(u), S ? r += `let ${u} = value
` : r += `let ${s} = value.${u}
`;
          r += "size += " + o.callType(s, f) + `
`;
        }
        return r += "return size", o.wrapCode(r);
      }]
    }
  };
  function t() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  function e(o) {
    const l = [];
    for (const r in o) {
      const { type: n, anon: f } = o[r];
      if (f && !(n instanceof Array && n[0] === "bitfield"))
        if (n instanceof Array && n[0] === "container")
          for (const u in n[1]) l.push(n[1][u]);
        else if (n instanceof Array && n[0] === "switch")
          l.push({
            name: t(),
            _shouldBeInlined: !0,
            type: n
          });
        else
          throw new Error("Cannot inline anonymous type: " + n);
      else
        l.push(o[r]);
    }
    return l;
  }
  return compilerStructures;
}
var compilerUtils, hasRequiredCompilerUtils;
function requireCompilerUtils() {
  if (hasRequiredCompilerUtils) return compilerUtils;
  hasRequiredCompilerUtils = 1, compilerUtils = {
    Read: {
      pstring: ["parametrizable", (l, r) => {
        let n = "";
        if (r.countType)
          n += "const { value: count, size: countSize } = " + l.callType(r.countType) + `
`;
        else if (r.count)
          n += "const count = " + r.count + `
`, n += `const countSize = 0
`;
        else
          throw new Error("pstring must contain either count or countType");
        return n += `offset += countSize
`, n += `if (offset + count > buffer.length) {
`, n += `  throw new PartialReadError("Missing characters in string, found size is " + buffer.length + " expected size was " + (offset + count))
`, n += `}
`, n += `return { value: buffer.toString("${r.encoding || "utf8"}", offset, offset + count), size: count + countSize }`, l.wrapCode(n);
      }],
      buffer: ["parametrizable", (l, r) => {
        let n = "";
        if (r.countType)
          n += "const { value: count, size: countSize } = " + l.callType(r.countType) + `
`;
        else if (r.count)
          n += "const count = " + r.count + `
`, n += `const countSize = 0
`;
        else
          throw new Error("buffer must contain either count or countType");
        return n += `offset += countSize
`, n += `if (offset + count > buffer.length) {
`, n += `  throw new PartialReadError()
`, n += `}
`, n += "return { value: buffer.slice(offset, offset + count), size: count + countSize }", l.wrapCode(n);
      }],
      bitfield: ["parametrizable", (l, r) => {
        let n = "";
        const f = Math.ceil(r.reduce((S, { size: s }) => S + s, 0) / 8);
        n += `if ( offset + ${f} > buffer.length) { throw new PartialReadError() }
`;
        const u = [];
        let b = 8;
        n += `let bits = buffer[offset++]
`;
        for (const S in r) {
          const { name: s, size: v, signed: E } = r[S], q = l.getField(s);
          for (; b < v; )
            b += 8, n += `bits = (bits << 8) | buffer[offset++]
`;
          n += `let ${q} = (bits >> ` + (b - v) + ") & 0x" + ((1 << v) - 1).toString(16) + `
`, E && (n += `${q} -= (${q} & 0x` + (1 << v - 1).toString(16) + `) << 1
`), b -= v, s === q ? u.push(s) : u.push(`${s}: ${q}`);
        }
        return n += "return { value: { " + u.join(", ") + ` }, size: ${f} }`, l.wrapCode(n);
      }],
      bitflags: ["parametrizable", (l, { type: r, flags: n, shift: f, big: u }) => {
        let b = JSON.stringify(n);
        if (Array.isArray(n)) {
          b = "{";
          for (const [S, s] of Object.entries(n)) b += `"${s}": ${u ? 1n << BigInt(S) : 1 << S}` + (u ? "n," : ",");
          b += "}";
        } else if (f) {
          b = "{";
          for (const S in n) b += `"${S}": ${1 << n[S]}${u ? "n," : ","}`;
          b += "}";
        }
        return l.wrapCode(`
const { value: _value, size } = ${l.callType(r, "offset")}
const value = { _value }
const flags = ${b}
for (const key in flags) {
  value[key] = (_value & flags[key]) == flags[key]
}
return { value, size }
      `.trim());
      }],
      mapper: ["parametrizable", (l, r) => {
        let n = "const { value, size } = " + l.callType(r.type) + `
`;
        return n += "return { value: " + JSON.stringify(t(r.mappings)) + "[value] || value, size }", l.wrapCode(n);
      }]
    },
    Write: {
      pstring: ["parametrizable", (l, r) => {
        let n = `const length = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          n += "offset = " + l.callType("length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return n += `buffer.write(value, offset, length, "${r.encoding || "utf8"}")
`, n += "return offset + length", l.wrapCode(n);
      }],
      buffer: ["parametrizable", (l, r) => {
        let n = `if (!(value instanceof Buffer)) value = Buffer.from(value)
`;
        if (r.countType)
          n += "offset = " + l.callType("value.length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return n += `value.copy(buffer, offset)
`, n += "return offset + value.length", l.wrapCode(n);
      }],
      bitfield: ["parametrizable", (l, r) => {
        let n = "", f = 0, u = "";
        for (const b in r) {
          let { name: S, size: s } = r[b];
          const v = l.getField(S);
          for (u += `let ${v} = value.${S}
`; s > 0; ) {
            const E = Math.min(8 - f, s), q = (1 << E) - 1;
            n !== "" && (n = `((${n}) << ${E}) | `), n += `((${v} >> ` + (s - E) + ") & 0x" + q.toString(16) + ")", s -= E, f += E, f === 8 && (u += "buffer[offset++] = " + n + `
`, f = 0, n = "");
          }
        }
        return f !== 0 && (u += "buffer[offset++] = (" + n + ") << " + (8 - f) + `
`), u += "return offset", l.wrapCode(u);
      }],
      bitflags: ["parametrizable", (l, { type: r, flags: n, shift: f, big: u }) => {
        let b = JSON.stringify(n);
        if (Array.isArray(n)) {
          b = "{";
          for (const [S, s] of Object.entries(n)) b += `"${s}": ${u ? 1n << BigInt(S) : 1 << S}` + (u ? "n," : ",");
          b += "}";
        } else if (f) {
          b = "{";
          for (const S in n) b += `"${S}": ${1 << n[S]}${u ? "n," : ","}`;
          b += "}";
        }
        return l.wrapCode(`
const flags = ${b}
let val = value._value ${u ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val, buffer, offset)
      `.trim());
      }],
      mapper: ["parametrizable", (l, r) => {
        const n = JSON.stringify(e(r.mappings)), f = "return " + l.callType(`${n}[value] || value`, r.type);
        return l.wrapCode(f);
      }]
    },
    SizeOf: {
      pstring: ["parametrizable", (l, r) => {
        let n = `let size = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          n += "size += " + l.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return n += "return size", l.wrapCode(n);
      }],
      buffer: ["parametrizable", (l, r) => {
        let n = `let size = value instanceof Buffer ? value.length : Buffer.from(value).length
`;
        if (r.countType)
          n += "size += " + l.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return n += "return size", l.wrapCode(n);
      }],
      bitfield: ["parametrizable", (l, r) => `${Math.ceil(r.reduce((f, { size: u }) => f + u, 0) / 8)}`],
      bitflags: ["parametrizable", (l, { type: r, flags: n, shift: f, big: u }) => {
        let b = JSON.stringify(n);
        if (Array.isArray(n)) {
          b = "{";
          for (const [S, s] of Object.entries(n)) b += `"${s}": ${u ? 1n << BigInt(S) : 1 << S}` + (u ? "n," : ",");
          b += "}";
        } else if (f) {
          b = "{";
          for (const S in n) b += `"${S}": ${1 << n[S]}${u ? "n," : ","}`;
          b += "}";
        }
        return l.wrapCode(`
const flags = ${b}
let val = value._value ${u ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val)
      `.trim());
      }],
      mapper: ["parametrizable", (l, r) => {
        const n = JSON.stringify(e(r.mappings)), f = "return " + l.callType(`${n}[value] || value`, r.type);
        return l.wrapCode(f);
      }]
    }
  };
  function t(l) {
    const r = {};
    for (let n in l) {
      let f = l[n];
      n = o(n), isNaN(f) || (f = Number(f)), f === "true" && (f = !0), f === "false" && (f = !1), r[n] = f;
    }
    return r;
  }
  function e(l) {
    const r = {};
    for (let n in l) {
      const f = l[n];
      n = o(n), r[f] = isNaN(n) ? n : parseInt(n, 10);
    }
    return r;
  }
  function o(l) {
    return l.match(/^0x[0-9a-f]+$/i) ? parseInt(l.substring(2), 16) : l;
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
    addProtocol(e, o) {
      this.readCompiler.addProtocol(e, o), this.writeCompiler.addProtocol(e, o), this.sizeOfCompiler.addProtocol(e, o);
    }
    addVariable(e, o) {
      this.readCompiler.addContextType(e, o), this.writeCompiler.addContextType(e, o), this.sizeOfCompiler.addContextType(e, o);
    }
    compileProtoDefSync(e = { printCode: !1 }) {
      const o = this.sizeOfCompiler.generate(), l = this.writeCompiler.generate(), r = this.readCompiler.generate();
      e.printCode && (console.log("// SizeOf:"), console.log(o), console.log("// Write:"), console.log(l), console.log("// Read:"), console.log(r));
      const n = this.sizeOfCompiler.compile(o), f = this.writeCompiler.compile(l), u = this.readCompiler.compile(r);
      return new CompiledProtodef(n, f, u);
    }
  }
  class CompiledProtodef {
    constructor(e, o, l) {
      this.sizeOfCtx = e, this.writeCtx = o, this.readCtx = l;
    }
    read(e, o, l) {
      const r = this.readCtx[l];
      if (!r)
        throw new Error("missing data type: " + l);
      return r(e, o);
    }
    write(e, o, l, r) {
      const n = this.writeCtx[r];
      if (!n)
        throw new Error("missing data type: " + r);
      return n(e, o, l);
    }
    setVariable(e, o) {
      this.sizeOfCtx[e] = o, this.readCtx[e] = o, this.writeCtx[e] = o;
    }
    sizeOf(e, o) {
      const l = this.sizeOfCtx[o];
      if (!l)
        throw new Error("missing data type: " + o);
      return typeof l == "function" ? l(e) : l;
    }
    createPacketBuffer(e, o) {
      const l = tryCatch(
        () => this.sizeOf(o, e),
        (n) => {
          throw n.message = `SizeOf error for ${n.field} : ${n.message}`, n;
        }
      ), r = Buffer.allocUnsafe(l);
      return tryCatch(
        () => this.write(o, r, 0, e),
        (n) => {
          throw n.message = `Write error for ${n.field} : ${n.message}`, n;
        }
      ), r;
    }
    parsePacketBuffer(e, o, l = 0) {
      const { value: r, size: n } = tryCatch(
        () => this.read(o, l, e),
        (f) => {
          throw f.message = `Read error for ${f.field} : ${f.message}`, f;
        }
      );
      return {
        data: r,
        metadata: { size: n },
        buffer: o.slice(0, n),
        fullBuffer: o
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
      for (const [e, [o, l]] of Object.entries(t))
        o === "native" ? this.addNativeType(e, l) : o === "context" ? this.addContextType(e, l) : o === "parametrizable" && this.addParametrizableType(e, l);
    }
    addTypesToCompile(t) {
      for (const [e, o] of Object.entries(t))
        (!this.types[e] || this.types[e] === "native") && (this.types[e] = o);
    }
    addProtocol(t, e) {
      const o = this;
      function l(r, n) {
        r !== void 0 && (r.types && o.addTypesToCompile(r.types), l(r[n.shift()], n));
      }
      l(t, e.slice(0));
    }
    indent(t, e = "  ") {
      return t.split(`
`).map((o) => e + o).join(`
`);
    }
    getField(t, e) {
      const o = t.split("/");
      let l = this.scopeStack.length - 1;
      const r = ["value", "enum", "default", "size", "offset"];
      for (; o.length; ) {
        const n = this.scopeStack[l], f = o.shift();
        if (f === "..") {
          l--;
          continue;
        }
        if (n[f]) return n[f] + (o.length ? "." + o.join(".") : "");
        if (o.length !== 0)
          throw new Error("Cannot access properties of undefined field");
        let u = 0;
        r.includes(f) && u++;
        for (let b = 0; b < l; b++)
          this.scopeStack[b][f] && u++;
        return e ? n[f] = f : n[f] = f + (u || ""), n[f];
      }
      throw new Error("Unknown field " + o);
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
    wrapCode(e, o = []) {
      return o.length > 0 ? "(buffer, offset, " + o.join(", ") + `) => {
` + this.indent(e) + `
}` : `(buffer, offset) => {
` + this.indent(e) + `
}`;
    }
    callType(e, o = "offset", l = []) {
      if (e instanceof Array && this.types[e[0]] && this.types[e[0]] !== "native")
        return this.callType(e[0], o, Object.values(e[1]));
      e instanceof Array && e[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(e);
      return e instanceof Array && e[0] === "container" && this.scopeStack.pop(), l.length > 0 ? "(" + r + `)(buffer, ${o}, ` + l.map((n) => this.getField(n)).join(", ") + ")" : "(" + r + `)(buffer, ${o})`;
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
    wrapCode(e, o = []) {
      return o.length > 0 ? "(value, buffer, offset, " + o.join(", ") + `) => {
` + this.indent(e) + `
}` : `(value, buffer, offset) => {
` + this.indent(e) + `
}`;
    }
    callType(e, o, l = "offset", r = []) {
      if (o instanceof Array && this.types[o[0]] && this.types[o[0]] !== "native")
        return this.callType(e, o[0], l, Object.values(o[1]));
      o instanceof Array && o[0] === "container" && this.scopeStack.push({});
      const n = this.compileType(o);
      return o instanceof Array && o[0] === "container" && this.scopeStack.pop(), r.length > 0 ? "(" + n + `)(${e}, buffer, ${l}, ` + r.map((f) => this.getField(f)).join(", ") + ")" : "(" + n + `)(${e}, buffer, ${l})`;
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
    addNativeType(e, o) {
      this.primitiveTypes[e] = `native.${e}`, isNaN(o) ? this.native[e] = o : this.native[e] = (l) => o, this.types[e] = "native";
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
    wrapCode(e, o = []) {
      return o.length > 0 ? "(value, " + o.join(", ") + `) => {
` + this.indent(e) + `
}` : `(value) => {
` + this.indent(e) + `
}`;
    }
    callType(e, o, l = []) {
      if (o instanceof Array && this.types[o[0]] && this.types[o[0]] !== "native")
        return this.callType(e, o[0], Object.values(o[1]));
      o instanceof Array && o[0] === "container" && this.scopeStack.push({});
      const r = this.compileType(o);
      return o instanceof Array && o[0] === "container" && this.scopeStack.pop(), isNaN(r) ? l.length > 0 ? "(" + r + `)(${e}, ` + l.map((n) => this.getField(n)).join(", ") + ")" : "(" + r + `)(${e})` : r;
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
const container$1 = "native", i8$1 = "native", compound$2 = "native", nbtTagName = "native", i16$1 = "native", u16 = "native", i32$1 = "native", i64$1 = "native", f32$1 = "native", f64$1 = "native", pstring$1 = "native", shortString$1 = ["pstring", { countType: "u16" }], byteArray$1 = ["array", { countType: "i32", type: "i8" }], list$1 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "i32", type: ["nbtSwitch", { type: "type" }] }] }]], intArray$1 = ["array", { countType: "i32", type: "i32" }], longArray$1 = ["array", { countType: "i32", type: "i64" }], nbtMapper$1 = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], nbtSwitch$1 = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "i32", long: "i64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], nbt$4 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], anonymousNbt = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], anonOptionalNbt = ["optionalNbtType", { tagType: "anonymousNbt" }], optionalNbt = ["optionalNbtType", { tagType: "nbt" }], require$$2 = {
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
  nbt: nbt$4,
  anonymousNbt,
  anonOptionalNbt,
  optionalNbt
}, container = "native", i8 = "native", compound$1 = "native", zigzag32 = "native", zigzag64 = "native", i16 = "native", i32 = "native", i64 = "native", f32 = "native", f64 = "native", pstring = "native", shortString = ["pstring", { countType: "varint" }], byteArray = ["array", { countType: "zigzag32", type: "i8" }], list = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "zigzag32", type: ["nbtSwitch", { type: "type" }] }] }]], intArray = ["array", { countType: "zigzag32", type: "i32" }], longArray = ["array", { countType: "zigzag32", type: "i64" }], nbtMapper = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], nbtSwitch = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "zigzag32", long: "zigzag64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], nbt$3 = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], require$$3 = {
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
  nbt: nbt$3
};
var compilerCompound, hasRequiredCompilerCompound;
function requireCompilerCompound() {
  return hasRequiredCompilerCompound || (hasRequiredCompilerCompound = 1, compilerCompound = {
    Read: {
      compound: ["context", (t, e) => {
        const o = {
          value: {},
          size: 0
        };
        for (; e !== t.length; ) {
          const l = ctx.i8(t, e);
          if (l.value === 0) {
            o.size += l.size;
            break;
          }
          if (l.value > 20)
            throw new Error(`Invalid tag: ${l.value} > 20`);
          const r = ctx.nbt(t, e);
          e += r.size, o.size += r.size, o.value[r.value.name] = {
            type: r.value.type,
            value: r.value.value
          };
        }
        return o;
      }]
    },
    Write: {
      compound: ["context", (t, e, o) => {
        for (const l in t)
          o = ctx.nbt({
            name: l,
            type: t[l].type,
            value: t[l].value
          }, e, o);
        return o = ctx.i8(0, e, o), o;
      }]
    },
    SizeOf: {
      compound: ["context", (t) => {
        let e = 1;
        for (const o in t)
          e += ctx.nbt({
            name: o,
            type: t[o].type,
            value: t[o].value
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
  function t(l, r) {
    const { value: n, size: f } = ctx.shortString(l, r);
    for (const u of n)
      if (u === "\0") throw new Error("unexpected tag end");
    return { value: n, size: f };
  }
  function e(...l) {
    return ctx.shortString(...l);
  }
  function o(...l) {
    return ctx.shortString(...l);
  }
  return compilerTagname = {
    Read: { nbtTagName: ["context", t] },
    Write: { nbtTagName: ["context", e] },
    SizeOf: { nbtTagName: ["context", o] }
  }, compilerTagname;
}
var optional, hasRequiredOptional;
function requireOptional() {
  if (hasRequiredOptional) return optional;
  hasRequiredOptional = 1;
  function t(r, n, { tagType: f }, u) {
    if (n + 1 > r.length)
      throw new Error("Read out of bounds");
    return r.readInt8(n) === 0 ? { size: 1 } : this.read(r, n, f, u);
  }
  function e(r, n, f, { tagType: u }, b) {
    return r === void 0 ? (n.writeInt8(0, f), f + 1) : this.write(r, n, f, u, b);
  }
  function o(r, { tagType: n }, f) {
    return r === void 0 ? 1 : this.sizeOf(r, n, n, f);
  }
  return optional = {
    compiler: {
      Read: {
        optionalNbtType: ["parametrizable", (r, { tagType: n }) => r.wrapCode(`
if (offset + 1 > buffer.length) { throw new PartialReadError() }
if (buffer.readInt8(offset) === 0) return { size: 1 }
return ${r.callType(n)}
      `)]
      },
      Write: {
        optionalNbtType: ["parametrizable", (r, { tagType: n }) => r.wrapCode(`
if (value === undefined) {
  buffer.writeInt8(0, offset)
  return offset + 1
}
return ${r.callType("value", n)}
      `)]
      },
      SizeOf: {
        optionalNbtType: ["parametrizable", (r, { tagType: n }) => r.wrapCode(`
if (value === undefined) { return 1 }
return ${r.callType("value", n)}
      `)]
      }
    },
    interpret: { optionalNbtType: [t, e, o] }
  }, optional;
}
var compound, hasRequiredCompound;
function requireCompound() {
  if (hasRequiredCompound) return compound;
  hasRequiredCompound = 1, compound = {
    compound: [t, e, o]
  };
  function t(l, r, n, f) {
    const u = {
      value: {},
      size: 0
    };
    for (; ; ) {
      const b = this.read(l, r, "i8", f);
      if (b.value === 0) {
        r += b.size, u.size += b.size;
        break;
      }
      const S = this.read(l, r, "nbt", f);
      r += S.size, u.size += S.size, u.value[S.value.name] = {
        type: S.value.type,
        value: S.value.value
      };
    }
    return u;
  }
  function e(l, r, n, f, u) {
    const b = this;
    return Object.keys(l).forEach(function(S) {
      n = b.write({
        name: S,
        type: l[S].type,
        value: l[S].value
      }, r, n, "nbt", u);
    }), n = this.write(0, r, n, "i8", u), n;
  }
  function o(l, r, n) {
    const f = this;
    return 1 + Object.keys(l).reduce(function(b, S) {
      return b + f.sizeOf({
        name: S,
        type: l[S].type,
        value: l[S].value
      }, "nbt", n);
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
var nbt$2, hasRequiredNbt;
function requireNbt() {
  if (hasRequiredNbt) return nbt$2;
  hasRequiredNbt = 1;
  const t = requireLib(), { ProtoDefCompiler: e } = requireProtodef().Compiler, o = JSON.stringify(require$$2), l = o.replace(/([iuf][0-7]+)/g, "l$1"), r = JSON.stringify(require$$3).replace(/([if][0-7]+)/g, "l$1");
  function n(R, F) {
    F.addTypes(requireCompilerCompound()), F.addTypes(requireCompilerTagname()), F.addTypes(requireOptional().compiler);
    let x = o;
    R === "littleVarint" ? x = r : R === "little" && (x = l), F.addTypesToCompile(JSON.parse(x));
  }
  function f(R, F) {
    F.addTypes(requireCompound()), F.addTypes(requireOptional().interpret);
    let x = o;
    R === "littleVarint" ? x = r : R === "little" && (x = l), F.addTypes(JSON.parse(x)), F.types.nbtTagName = F.types.shortString;
  }
  function u(R) {
    const F = new e();
    return n(R, F), F.compileProtoDefSync();
  }
  const b = u("big"), S = u("little"), s = u("littleVarint"), v = {
    big: b,
    little: S,
    littleVarint: s
  };
  function E(R, F = "big") {
    return F === !0 && (F = "little"), v[F].createPacketBuffer("nbt", R);
  }
  function q(R, F = "big", x = {}) {
    return F === !0 && (F = "little"), v[F].setVariable("noArraySizeCheck", x.noArraySizeCheck), v[F].parsePacketBuffer("nbt", R, R.startOffset).data;
  }
  const p = function(R) {
    let F = !0;
    return R[0] !== 31 && (F = !1), R[1] !== 139 && (F = !1), F;
  }, T = (R) => R[1] === 0 && R[2] === 0 && R[3] === 0;
  async function d(R, F, x = {}) {
    if (!(R instanceof Buffer)) throw new Error("Invalid argument: `data` must be a Buffer object");
    p(R) && (R = await new Promise((Q, C) => {
      t.gunzip(R, (W, h) => {
        W ? C(W) : Q(h);
      });
    })), v[F].setVariable("noArraySizeCheck", x.noArraySizeCheck);
    const M = v[F].parsePacketBuffer("nbt", R, R.startOffset);
    return M.metadata.buffer = R, M.type = F, M;
  }
  async function y(R, F, x) {
    if (R instanceof ArrayBuffer)
      R = Buffer.from(R);
    else if (!(R instanceof Buffer))
      throw new Error("Invalid argument: `data` must be a Buffer or ArrayBuffer object");
    let M = null;
    if (typeof F == "function")
      x = F;
    else if (F === !0 || F === "little")
      M = "little";
    else if (F === "big")
      M = "big";
    else if (F === "littleVarint")
      M = "littleVarint";
    else if (F)
      throw new Error("Unrecognized format: " + F);
    if (R.startOffset = R.startOffset || 0, !M && !R.startOffset && T(R) && (R.startOffset += 8, M = "little"), M)
      try {
        const W = await d(R, M);
        return x && x(null, W.data, W.type, W.metadata), { parsed: W.data, type: W.type, metadata: W.metadata };
      } catch (W) {
        if (x) return x(W);
        throw W;
      }
    const Q = ({ buffer: W, size: h }) => {
      const $ = h, ae = W.length - W.startOffset, Ee = W[$ + W.startOffset] === 10;
      if ($ < ae && !Ee)
        throw new Error(`Unexpected EOF at ${$}: still have ${ae - $} bytes to read !`);
    };
    let C = null;
    try {
      C = await d(R, "big"), Q(C.metadata);
    } catch (W) {
      try {
        C = await d(R, "little"), Q(C.metadata);
      } catch {
        try {
          C = await d(R, "littleVarint"), Q(C.metadata);
        } catch {
          if (x) return x(W);
          throw W;
        }
      }
    }
    return x && x(null, C.data, C.type, C.metadata), { parsed: C.data, type: C.type, metadata: C.metadata };
  }
  function A(R) {
    function F(x, M) {
      return M === "compound" ? Object.keys(x).reduce(function(Q, C) {
        return Q[C] = A(x[C]), Q;
      }, {}) : M === "list" ? x.value.map(function(Q) {
        return F(Q, x.type);
      }) : x;
    }
    return F(R.value, R.type);
  }
  function w(R, F) {
    if (R.type !== F.type) return !1;
    if (R.type === "compound") {
      const x = Object.keys(R.value), M = Object.keys(F.value);
      if (x.length !== M.length) return !1;
      for (const Q of x)
        if (!w(R.value[Q], F.value[Q])) return !1;
      return !0;
    }
    if (R.type === "list") {
      if (R.value.length !== F.value.length) return !1;
      for (let x = 0; x < R.value.length; x++)
        if (!w(R.value[x], F.value[x])) return !1;
      return !0;
    }
    if (R.type === "byteArray" || R.type === "intArray" || R.type === "shortArray") {
      if (R.value.length !== F.value.length) return !1;
      for (let x = 0; x < R.value.length; x++)
        if (R.value[x] !== F.value[x]) return !1;
      return !0;
    }
    if (R.type === "long")
      return R.value[0] === F.value[0] && R.value[1] === F.value[1];
    if (R.type === "longArray") {
      if (R.value.length !== F.value.length) return !1;
      for (let x = 0; x < R.value.length; x++)
        if (R.value[x][0] !== F.value[x][0] || R.value[x][1] !== F.value[x][1]) return !1;
      return !0;
    }
    return R.value === F.value;
  }
  const I = {
    bool(R = !1) {
      return { type: "bool", value: R };
    },
    short(R) {
      return { type: "short", value: R };
    },
    byte(R) {
      return { type: "byte", value: R };
    },
    string(R) {
      return { type: "string", value: R };
    },
    comp(R, F = "") {
      return { type: "compound", name: F, value: R };
    },
    int(R) {
      return { type: "int", value: R };
    },
    float(R) {
      return { type: "float", value: R };
    },
    double(R) {
      return { type: "double", value: R };
    },
    long(R) {
      return { type: "long", value: R };
    },
    list(R) {
      return { type: "list", value: { type: (R == null ? void 0 : R.type) ?? "end", value: (R == null ? void 0 : R.value) ?? [] } };
    },
    byteArray(R = []) {
      return { type: "byteArray", value: R };
    },
    shortArray(R = []) {
      return { type: "shortArray", value: R };
    },
    intArray(R = []) {
      return { type: "intArray", value: R };
    },
    longArray(R = []) {
      return { type: "longArray", value: R };
    }
  };
  return nbt$2 = {
    addTypesToCompiler: n,
    addTypesToInterpreter: f,
    writeUncompressed: E,
    parseUncompressed: q,
    simplify: A,
    hasBedrockLevelHeader: T,
    parse: y,
    parseAs: d,
    equal: w,
    proto: b,
    protoLE: S,
    protos: v,
    TagType: requireTagType(),
    ...I
  }, nbt$2;
}
var nbtExports = requireNbt();
const nbt = /* @__PURE__ */ getDefaultExportFromCjs$1(nbtExports), nbt$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: nbt
}, [nbtExports]);
export {
  nbt$1 as n
};
