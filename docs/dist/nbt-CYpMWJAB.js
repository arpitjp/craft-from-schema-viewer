function wd(t, e) {
  for (var l = 0; l < e.length; l++) {
    const c = e[l];
    if (typeof c != "string" && !Array.isArray(c)) {
      for (const r in c)
        if (r !== "default" && !(r in t)) {
          const i = Object.getOwnPropertyDescriptor(c, r);
          i && Object.defineProperty(t, r, i.get ? i : {
            enumerable: !0,
            get: () => c[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var Tr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _d(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var tc = {}, zt = {};
zt.byteLength = Rd;
zt.toByteArray = Pd;
zt.fromByteArray = Od;
var Br = [], Pr = [], Ed = typeof Uint8Array < "u" ? Uint8Array : Array, nn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var lt = 0, Sd = nn.length; lt < Sd; ++lt)
  Br[lt] = nn[lt], Pr[nn.charCodeAt(lt)] = lt;
Pr[45] = 62;
Pr[95] = 63;
function nc(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var l = t.indexOf("=");
  l === -1 && (l = e);
  var c = l === e ? 0 : 4 - l % 4;
  return [l, c];
}
function Rd(t) {
  var e = nc(t), l = e[0], c = e[1];
  return (l + c) * 3 / 4 - c;
}
function Ad(t, e, l) {
  return (e + l) * 3 / 4 - l;
}
function Pd(t) {
  var e, l = nc(t), c = l[0], r = l[1], i = new Ed(Ad(t, c, r)), p = 0, f = r > 0 ? c - 4 : c, b;
  for (b = 0; b < f; b += 4)
    e = Pr[t.charCodeAt(b)] << 18 | Pr[t.charCodeAt(b + 1)] << 12 | Pr[t.charCodeAt(b + 2)] << 6 | Pr[t.charCodeAt(b + 3)], i[p++] = e >> 16 & 255, i[p++] = e >> 8 & 255, i[p++] = e & 255;
  return r === 2 && (e = Pr[t.charCodeAt(b)] << 2 | Pr[t.charCodeAt(b + 1)] >> 4, i[p++] = e & 255), r === 1 && (e = Pr[t.charCodeAt(b)] << 10 | Pr[t.charCodeAt(b + 1)] << 4 | Pr[t.charCodeAt(b + 2)] >> 2, i[p++] = e >> 8 & 255, i[p++] = e & 255), i;
}
function Td(t) {
  return Br[t >> 18 & 63] + Br[t >> 12 & 63] + Br[t >> 6 & 63] + Br[t & 63];
}
function Id(t, e, l) {
  for (var c, r = [], i = e; i < l; i += 3)
    c = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), r.push(Td(c));
  return r.join("");
}
function Od(t) {
  for (var e, l = t.length, c = l % 3, r = [], i = 16383, p = 0, f = l - c; p < f; p += i)
    r.push(Id(t, p, p + i > f ? f : p + i));
  return c === 1 ? (e = t[l - 1], r.push(
    Br[e >> 2] + Br[e << 4 & 63] + "=="
  )) : c === 2 && (e = (t[l - 2] << 8) + t[l - 1], r.push(
    Br[e >> 10] + Br[e >> 4 & 63] + Br[e << 2 & 63] + "="
  )), r.join("");
}
var ko = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ko.read = function(t, e, l, c, r) {
  var i, p, f = r * 8 - c - 1, b = (1 << f) - 1, A = b >> 1, o = -7, v = l ? r - 1 : 0, S = l ? -1 : 1, s = t[e + v];
  for (v += S, i = s & (1 << -o) - 1, s >>= -o, o += f; o > 0; i = i * 256 + t[e + v], v += S, o -= 8)
    ;
  for (p = i & (1 << -o) - 1, i >>= -o, o += c; o > 0; p = p * 256 + t[e + v], v += S, o -= 8)
    ;
  if (i === 0)
    i = 1 - A;
  else {
    if (i === b)
      return p ? NaN : (s ? -1 : 1) * (1 / 0);
    p = p + Math.pow(2, c), i = i - A;
  }
  return (s ? -1 : 1) * p * Math.pow(2, i - c);
};
ko.write = function(t, e, l, c, r, i) {
  var p, f, b, A = i * 8 - r - 1, o = (1 << A) - 1, v = o >> 1, S = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, s = c ? 0 : i - 1, a = c ? 1 : -1, w = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (f = isNaN(e) ? 1 : 0, p = o) : (p = Math.floor(Math.log(e) / Math.LN2), e * (b = Math.pow(2, -p)) < 1 && (p--, b *= 2), p + v >= 1 ? e += S / b : e += S * Math.pow(2, 1 - v), e * b >= 2 && (p++, b /= 2), p + v >= o ? (f = 0, p = o) : p + v >= 1 ? (f = (e * b - 1) * Math.pow(2, r), p = p + v) : (f = e * Math.pow(2, v - 1) * Math.pow(2, r), p = 0)); r >= 8; t[l + s] = f & 255, s += a, f /= 256, r -= 8)
    ;
  for (p = p << r | f, A += r; A > 0; t[l + s] = p & 255, s += a, p /= 256, A -= 8)
    ;
  t[l + s - a] |= w * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = zt, l = ko, c = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = o, t.SlowBuffer = P, t.INSPECT_MAX_BYTES = 50;
  const r = 2147483647;
  t.kMaxLength = r;
  const { Uint8Array: i, ArrayBuffer: p, SharedArrayBuffer: f } = globalThis;
  o.TYPED_ARRAY_SUPPORT = b(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function b() {
    try {
      const $ = new i(1), n = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(n, i.prototype), Object.setPrototypeOf($, n), $.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(o.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(o.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.byteOffset;
    }
  });
  function A($) {
    if ($ > r)
      throw new RangeError('The value "' + $ + '" is invalid for option "size"');
    const n = new i($);
    return Object.setPrototypeOf(n, o.prototype), n;
  }
  function o($, n, g) {
    if (typeof $ == "number") {
      if (typeof n == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return a($);
    }
    return v($, n, g);
  }
  o.poolSize = 8192;
  function v($, n, g) {
    if (typeof $ == "string")
      return w($, n);
    if (p.isView($))
      return d($);
    if ($ == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof $
      );
    if (Ee($, p) || $ && Ee($.buffer, p) || typeof f < "u" && (Ee($, f) || $ && Ee($.buffer, f)))
      return E($, n, g);
    if (typeof $ == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const U = $.valueOf && $.valueOf();
    if (U != null && U !== $)
      return o.from(U, n, g);
    const fe = _($);
    if (fe) return fe;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof $[Symbol.toPrimitive] == "function")
      return o.from($[Symbol.toPrimitive]("string"), n, g);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof $
    );
  }
  o.from = function($, n, g) {
    return v($, n, g);
  }, Object.setPrototypeOf(o.prototype, i.prototype), Object.setPrototypeOf(o, i);
  function S($) {
    if (typeof $ != "number")
      throw new TypeError('"size" argument must be of type number');
    if ($ < 0)
      throw new RangeError('The value "' + $ + '" is invalid for option "size"');
  }
  function s($, n, g) {
    return S($), $ <= 0 ? A($) : n !== void 0 ? typeof g == "string" ? A($).fill(n, g) : A($).fill(n) : A($);
  }
  o.alloc = function($, n, g) {
    return s($, n, g);
  };
  function a($) {
    return S($), A($ < 0 ? 0 : I($) | 0);
  }
  o.allocUnsafe = function($) {
    return a($);
  }, o.allocUnsafeSlow = function($) {
    return a($);
  };
  function w($, n) {
    if ((typeof n != "string" || n === "") && (n = "utf8"), !o.isEncoding(n))
      throw new TypeError("Unknown encoding: " + n);
    const g = D($, n) | 0;
    let U = A(g);
    const fe = U.write($, n);
    return fe !== g && (U = U.slice(0, fe)), U;
  }
  function u($) {
    const n = $.length < 0 ? 0 : I($.length) | 0, g = A(n);
    for (let U = 0; U < n; U += 1)
      g[U] = $[U] & 255;
    return g;
  }
  function d($) {
    if (Ee($, i)) {
      const n = new i($);
      return E(n.buffer, n.byteOffset, n.byteLength);
    }
    return u($);
  }
  function E($, n, g) {
    if (n < 0 || $.byteLength < n)
      throw new RangeError('"offset" is outside of buffer bounds');
    if ($.byteLength < n + (g || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let U;
    return n === void 0 && g === void 0 ? U = new i($) : g === void 0 ? U = new i($, n) : U = new i($, n, g), Object.setPrototypeOf(U, o.prototype), U;
  }
  function _($) {
    if (o.isBuffer($)) {
      const n = I($.length) | 0, g = A(n);
      return g.length === 0 || $.copy(g, 0, 0, n), g;
    }
    if ($.length !== void 0)
      return typeof $.length != "number" || je($.length) ? A(0) : u($);
    if ($.type === "Buffer" && Array.isArray($.data))
      return u($.data);
  }
  function I($) {
    if ($ >= r)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
    return $ | 0;
  }
  function P($) {
    return +$ != $ && ($ = 0), o.alloc(+$);
  }
  o.isBuffer = function(n) {
    return n != null && n._isBuffer === !0 && n !== o.prototype;
  }, o.compare = function(n, g) {
    if (Ee(n, i) && (n = o.from(n, n.offset, n.byteLength)), Ee(g, i) && (g = o.from(g, g.offset, g.byteLength)), !o.isBuffer(n) || !o.isBuffer(g))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (n === g) return 0;
    let U = n.length, fe = g.length;
    for (let J = 0, de = Math.min(U, fe); J < de; ++J)
      if (n[J] !== g[J]) {
        U = n[J], fe = g[J];
        break;
      }
    return U < fe ? -1 : fe < U ? 1 : 0;
  }, o.isEncoding = function(n) {
    switch (String(n).toLowerCase()) {
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
  }, o.concat = function(n, g) {
    if (!Array.isArray(n))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (n.length === 0)
      return o.alloc(0);
    let U;
    if (g === void 0)
      for (g = 0, U = 0; U < n.length; ++U)
        g += n[U].length;
    const fe = o.allocUnsafe(g);
    let J = 0;
    for (U = 0; U < n.length; ++U) {
      let de = n[U];
      if (Ee(de, i))
        J + de.length > fe.length ? (o.isBuffer(de) || (de = o.from(de)), de.copy(fe, J)) : i.prototype.set.call(
          fe,
          de,
          J
        );
      else if (o.isBuffer(de))
        de.copy(fe, J);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      J += de.length;
    }
    return fe;
  };
  function D($, n) {
    if (o.isBuffer($))
      return $.length;
    if (p.isView($) || Ee($, p))
      return $.byteLength;
    if (typeof $ != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof $
      );
    const g = $.length, U = arguments.length > 2 && arguments[2] === !0;
    if (!U && g === 0) return 0;
    let fe = !1;
    for (; ; )
      switch (n) {
        case "ascii":
        case "latin1":
        case "binary":
          return g;
        case "utf8":
        case "utf-8":
          return De($).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return g * 2;
        case "hex":
          return g >>> 1;
        case "base64":
          return $e($).length;
        default:
          if (fe)
            return U ? -1 : De($).length;
          n = ("" + n).toLowerCase(), fe = !0;
      }
  }
  o.byteLength = D;
  function x($, n, g) {
    let U = !1;
    if ((n === void 0 || n < 0) && (n = 0), n > this.length || ((g === void 0 || g > this.length) && (g = this.length), g <= 0) || (g >>>= 0, n >>>= 0, g <= n))
      return "";
    for ($ || ($ = "utf8"); ; )
      switch ($) {
        case "hex":
          return X(this, n, g);
        case "utf8":
        case "utf-8":
          return be(this, n, g);
        case "ascii":
          return k(this, n, g);
        case "latin1":
        case "binary":
          return he(this, n, g);
        case "base64":
          return _e(this, n, g);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Q(this, n, g);
        default:
          if (U) throw new TypeError("Unknown encoding: " + $);
          $ = ($ + "").toLowerCase(), U = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function q($, n, g) {
    const U = $[n];
    $[n] = $[g], $[g] = U;
  }
  o.prototype.swap16 = function() {
    const n = this.length;
    if (n % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let g = 0; g < n; g += 2)
      q(this, g, g + 1);
    return this;
  }, o.prototype.swap32 = function() {
    const n = this.length;
    if (n % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let g = 0; g < n; g += 4)
      q(this, g, g + 3), q(this, g + 1, g + 2);
    return this;
  }, o.prototype.swap64 = function() {
    const n = this.length;
    if (n % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let g = 0; g < n; g += 8)
      q(this, g, g + 7), q(this, g + 1, g + 6), q(this, g + 2, g + 5), q(this, g + 3, g + 4);
    return this;
  }, o.prototype.toString = function() {
    const n = this.length;
    return n === 0 ? "" : arguments.length === 0 ? be(this, 0, n) : x.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(n) {
    if (!o.isBuffer(n)) throw new TypeError("Argument must be a Buffer");
    return this === n ? !0 : o.compare(this, n) === 0;
  }, o.prototype.inspect = function() {
    let n = "";
    const g = t.INSPECT_MAX_BYTES;
    return n = this.toString("hex", 0, g).replace(/(.{2})/g, "$1 ").trim(), this.length > g && (n += " ... "), "<Buffer " + n + ">";
  }, c && (o.prototype[c] = o.prototype.inspect), o.prototype.compare = function(n, g, U, fe, J) {
    if (Ee(n, i) && (n = o.from(n, n.offset, n.byteLength)), !o.isBuffer(n))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof n
      );
    if (g === void 0 && (g = 0), U === void 0 && (U = n ? n.length : 0), fe === void 0 && (fe = 0), J === void 0 && (J = this.length), g < 0 || U > n.length || fe < 0 || J > this.length)
      throw new RangeError("out of range index");
    if (fe >= J && g >= U)
      return 0;
    if (fe >= J)
      return -1;
    if (g >= U)
      return 1;
    if (g >>>= 0, U >>>= 0, fe >>>= 0, J >>>= 0, this === n) return 0;
    let de = J - fe, M = U - g;
    const Be = Math.min(de, M), ze = this.slice(fe, J), R = n.slice(g, U);
    for (let Ie = 0; Ie < Be; ++Ie)
      if (ze[Ie] !== R[Ie]) {
        de = ze[Ie], M = R[Ie];
        break;
      }
    return de < M ? -1 : M < de ? 1 : 0;
  };
  function K($, n, g, U, fe) {
    if ($.length === 0) return -1;
    if (typeof g == "string" ? (U = g, g = 0) : g > 2147483647 ? g = 2147483647 : g < -2147483648 && (g = -2147483648), g = +g, je(g) && (g = fe ? 0 : $.length - 1), g < 0 && (g = $.length + g), g >= $.length) {
      if (fe) return -1;
      g = $.length - 1;
    } else if (g < 0)
      if (fe) g = 0;
      else return -1;
    if (typeof n == "string" && (n = o.from(n, U)), o.isBuffer(n))
      return n.length === 0 ? -1 : L($, n, g, U, fe);
    if (typeof n == "number")
      return n = n & 255, typeof i.prototype.indexOf == "function" ? fe ? i.prototype.indexOf.call($, n, g) : i.prototype.lastIndexOf.call($, n, g) : L($, [n], g, U, fe);
    throw new TypeError("val must be string, number or Buffer");
  }
  function L($, n, g, U, fe) {
    let J = 1, de = $.length, M = n.length;
    if (U !== void 0 && (U = String(U).toLowerCase(), U === "ucs2" || U === "ucs-2" || U === "utf16le" || U === "utf-16le")) {
      if ($.length < 2 || n.length < 2)
        return -1;
      J = 2, de /= 2, M /= 2, g /= 2;
    }
    function Be(R, Ie) {
      return J === 1 ? R[Ie] : R.readUInt16BE(Ie * J);
    }
    let ze;
    if (fe) {
      let R = -1;
      for (ze = g; ze < de; ze++)
        if (Be($, ze) === Be(n, R === -1 ? 0 : ze - R)) {
          if (R === -1 && (R = ze), ze - R + 1 === M) return R * J;
        } else
          R !== -1 && (ze -= ze - R), R = -1;
    } else
      for (g + M > de && (g = de - M), ze = g; ze >= 0; ze--) {
        let R = !0;
        for (let Ie = 0; Ie < M; Ie++)
          if (Be($, ze + Ie) !== Be(n, Ie)) {
            R = !1;
            break;
          }
        if (R) return ze;
      }
    return -1;
  }
  o.prototype.includes = function(n, g, U) {
    return this.indexOf(n, g, U) !== -1;
  }, o.prototype.indexOf = function(n, g, U) {
    return K(this, n, g, U, !0);
  }, o.prototype.lastIndexOf = function(n, g, U) {
    return K(this, n, g, U, !1);
  };
  function z($, n, g, U) {
    g = Number(g) || 0;
    const fe = $.length - g;
    U ? (U = Number(U), U > fe && (U = fe)) : U = fe;
    const J = n.length;
    U > J / 2 && (U = J / 2);
    let de;
    for (de = 0; de < U; ++de) {
      const M = parseInt(n.substr(de * 2, 2), 16);
      if (je(M)) return de;
      $[g + de] = M;
    }
    return de;
  }
  function y($, n, g, U) {
    return ve(De(n, $.length - g), $, g, U);
  }
  function F($, n, g, U) {
    return ve(Le(n), $, g, U);
  }
  function ie($, n, g, U) {
    return ve($e(n), $, g, U);
  }
  function ce($, n, g, U) {
    return ve(Pe(n, $.length - g), $, g, U);
  }
  o.prototype.write = function(n, g, U, fe) {
    if (g === void 0)
      fe = "utf8", U = this.length, g = 0;
    else if (U === void 0 && typeof g == "string")
      fe = g, U = this.length, g = 0;
    else if (isFinite(g))
      g = g >>> 0, isFinite(U) ? (U = U >>> 0, fe === void 0 && (fe = "utf8")) : (fe = U, U = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const J = this.length - g;
    if ((U === void 0 || U > J) && (U = J), n.length > 0 && (U < 0 || g < 0) || g > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    fe || (fe = "utf8");
    let de = !1;
    for (; ; )
      switch (fe) {
        case "hex":
          return z(this, n, g, U);
        case "utf8":
        case "utf-8":
          return y(this, n, g, U);
        case "ascii":
        case "latin1":
        case "binary":
          return F(this, n, g, U);
        case "base64":
          return ie(this, n, g, U);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ce(this, n, g, U);
        default:
          if (de) throw new TypeError("Unknown encoding: " + fe);
          fe = ("" + fe).toLowerCase(), de = !0;
      }
  }, o.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function _e($, n, g) {
    return n === 0 && g === $.length ? e.fromByteArray($) : e.fromByteArray($.slice(n, g));
  }
  function be($, n, g) {
    g = Math.min($.length, g);
    const U = [];
    let fe = n;
    for (; fe < g; ) {
      const J = $[fe];
      let de = null, M = J > 239 ? 4 : J > 223 ? 3 : J > 191 ? 2 : 1;
      if (fe + M <= g) {
        let Be, ze, R, Ie;
        switch (M) {
          case 1:
            J < 128 && (de = J);
            break;
          case 2:
            Be = $[fe + 1], (Be & 192) === 128 && (Ie = (J & 31) << 6 | Be & 63, Ie > 127 && (de = Ie));
            break;
          case 3:
            Be = $[fe + 1], ze = $[fe + 2], (Be & 192) === 128 && (ze & 192) === 128 && (Ie = (J & 15) << 12 | (Be & 63) << 6 | ze & 63, Ie > 2047 && (Ie < 55296 || Ie > 57343) && (de = Ie));
            break;
          case 4:
            Be = $[fe + 1], ze = $[fe + 2], R = $[fe + 3], (Be & 192) === 128 && (ze & 192) === 128 && (R & 192) === 128 && (Ie = (J & 15) << 18 | (Be & 63) << 12 | (ze & 63) << 6 | R & 63, Ie > 65535 && Ie < 1114112 && (de = Ie));
        }
      }
      de === null ? (de = 65533, M = 1) : de > 65535 && (de -= 65536, U.push(de >>> 10 & 1023 | 55296), de = 56320 | de & 1023), U.push(de), fe += M;
    }
    return le(U);
  }
  const ue = 4096;
  function le($) {
    const n = $.length;
    if (n <= ue)
      return String.fromCharCode.apply(String, $);
    let g = "", U = 0;
    for (; U < n; )
      g += String.fromCharCode.apply(
        String,
        $.slice(U, U += ue)
      );
    return g;
  }
  function k($, n, g) {
    let U = "";
    g = Math.min($.length, g);
    for (let fe = n; fe < g; ++fe)
      U += String.fromCharCode($[fe] & 127);
    return U;
  }
  function he($, n, g) {
    let U = "";
    g = Math.min($.length, g);
    for (let fe = n; fe < g; ++fe)
      U += String.fromCharCode($[fe]);
    return U;
  }
  function X($, n, g) {
    const U = $.length;
    (!n || n < 0) && (n = 0), (!g || g < 0 || g > U) && (g = U);
    let fe = "";
    for (let J = n; J < g; ++J)
      fe += qe[$[J]];
    return fe;
  }
  function Q($, n, g) {
    const U = $.slice(n, g);
    let fe = "";
    for (let J = 0; J < U.length - 1; J += 2)
      fe += String.fromCharCode(U[J] + U[J + 1] * 256);
    return fe;
  }
  o.prototype.slice = function(n, g) {
    const U = this.length;
    n = ~~n, g = g === void 0 ? U : ~~g, n < 0 ? (n += U, n < 0 && (n = 0)) : n > U && (n = U), g < 0 ? (g += U, g < 0 && (g = 0)) : g > U && (g = U), g < n && (g = n);
    const fe = this.subarray(n, g);
    return Object.setPrototypeOf(fe, o.prototype), fe;
  };
  function H($, n, g) {
    if ($ % 1 !== 0 || $ < 0) throw new RangeError("offset is not uint");
    if ($ + n > g) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(n, g, U) {
    n = n >>> 0, g = g >>> 0, U || H(n, g, this.length);
    let fe = this[n], J = 1, de = 0;
    for (; ++de < g && (J *= 256); )
      fe += this[n + de] * J;
    return fe;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(n, g, U) {
    n = n >>> 0, g = g >>> 0, U || H(n, g, this.length);
    let fe = this[n + --g], J = 1;
    for (; g > 0 && (J *= 256); )
      fe += this[n + --g] * J;
    return fe;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(n, g) {
    return n = n >>> 0, g || H(n, 1, this.length), this[n];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(n, g) {
    return n = n >>> 0, g || H(n, 2, this.length), this[n] | this[n + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(n, g) {
    return n = n >>> 0, g || H(n, 2, this.length), this[n] << 8 | this[n + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), (this[n] | this[n + 1] << 8 | this[n + 2] << 16) + this[n + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), this[n] * 16777216 + (this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3]);
  }, o.prototype.readBigUInt64LE = Me(function(n) {
    n = n >>> 0, Se(n, "offset");
    const g = this[n], U = this[n + 7];
    (g === void 0 || U === void 0) && Re(n, this.length - 8);
    const fe = g + this[++n] * 2 ** 8 + this[++n] * 2 ** 16 + this[++n] * 2 ** 24, J = this[++n] + this[++n] * 2 ** 8 + this[++n] * 2 ** 16 + U * 2 ** 24;
    return BigInt(fe) + (BigInt(J) << BigInt(32));
  }), o.prototype.readBigUInt64BE = Me(function(n) {
    n = n >>> 0, Se(n, "offset");
    const g = this[n], U = this[n + 7];
    (g === void 0 || U === void 0) && Re(n, this.length - 8);
    const fe = g * 2 ** 24 + this[++n] * 2 ** 16 + this[++n] * 2 ** 8 + this[++n], J = this[++n] * 2 ** 24 + this[++n] * 2 ** 16 + this[++n] * 2 ** 8 + U;
    return (BigInt(fe) << BigInt(32)) + BigInt(J);
  }), o.prototype.readIntLE = function(n, g, U) {
    n = n >>> 0, g = g >>> 0, U || H(n, g, this.length);
    let fe = this[n], J = 1, de = 0;
    for (; ++de < g && (J *= 256); )
      fe += this[n + de] * J;
    return J *= 128, fe >= J && (fe -= Math.pow(2, 8 * g)), fe;
  }, o.prototype.readIntBE = function(n, g, U) {
    n = n >>> 0, g = g >>> 0, U || H(n, g, this.length);
    let fe = g, J = 1, de = this[n + --fe];
    for (; fe > 0 && (J *= 256); )
      de += this[n + --fe] * J;
    return J *= 128, de >= J && (de -= Math.pow(2, 8 * g)), de;
  }, o.prototype.readInt8 = function(n, g) {
    return n = n >>> 0, g || H(n, 1, this.length), this[n] & 128 ? (255 - this[n] + 1) * -1 : this[n];
  }, o.prototype.readInt16LE = function(n, g) {
    n = n >>> 0, g || H(n, 2, this.length);
    const U = this[n] | this[n + 1] << 8;
    return U & 32768 ? U | 4294901760 : U;
  }, o.prototype.readInt16BE = function(n, g) {
    n = n >>> 0, g || H(n, 2, this.length);
    const U = this[n + 1] | this[n] << 8;
    return U & 32768 ? U | 4294901760 : U;
  }, o.prototype.readInt32LE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), this[n] | this[n + 1] << 8 | this[n + 2] << 16 | this[n + 3] << 24;
  }, o.prototype.readInt32BE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), this[n] << 24 | this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3];
  }, o.prototype.readBigInt64LE = Me(function(n) {
    n = n >>> 0, Se(n, "offset");
    const g = this[n], U = this[n + 7];
    (g === void 0 || U === void 0) && Re(n, this.length - 8);
    const fe = this[n + 4] + this[n + 5] * 2 ** 8 + this[n + 6] * 2 ** 16 + (U << 24);
    return (BigInt(fe) << BigInt(32)) + BigInt(g + this[++n] * 2 ** 8 + this[++n] * 2 ** 16 + this[++n] * 2 ** 24);
  }), o.prototype.readBigInt64BE = Me(function(n) {
    n = n >>> 0, Se(n, "offset");
    const g = this[n], U = this[n + 7];
    (g === void 0 || U === void 0) && Re(n, this.length - 8);
    const fe = (g << 24) + // Overflow
    this[++n] * 2 ** 16 + this[++n] * 2 ** 8 + this[++n];
    return (BigInt(fe) << BigInt(32)) + BigInt(this[++n] * 2 ** 24 + this[++n] * 2 ** 16 + this[++n] * 2 ** 8 + U);
  }), o.prototype.readFloatLE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), l.read(this, n, !0, 23, 4);
  }, o.prototype.readFloatBE = function(n, g) {
    return n = n >>> 0, g || H(n, 4, this.length), l.read(this, n, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(n, g) {
    return n = n >>> 0, g || H(n, 8, this.length), l.read(this, n, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(n, g) {
    return n = n >>> 0, g || H(n, 8, this.length), l.read(this, n, !1, 52, 8);
  };
  function se($, n, g, U, fe, J) {
    if (!o.isBuffer($)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (n > fe || n < J) throw new RangeError('"value" argument is out of bounds');
    if (g + U > $.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(n, g, U, fe) {
    if (n = +n, g = g >>> 0, U = U >>> 0, !fe) {
      const M = Math.pow(2, 8 * U) - 1;
      se(this, n, g, U, M, 0);
    }
    let J = 1, de = 0;
    for (this[g] = n & 255; ++de < U && (J *= 256); )
      this[g + de] = n / J & 255;
    return g + U;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(n, g, U, fe) {
    if (n = +n, g = g >>> 0, U = U >>> 0, !fe) {
      const M = Math.pow(2, 8 * U) - 1;
      se(this, n, g, U, M, 0);
    }
    let J = U - 1, de = 1;
    for (this[g + J] = n & 255; --J >= 0 && (de *= 256); )
      this[g + J] = n / de & 255;
    return g + U;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 1, 255, 0), this[g] = n & 255, g + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 2, 65535, 0), this[g] = n & 255, this[g + 1] = n >>> 8, g + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 2, 65535, 0), this[g] = n >>> 8, this[g + 1] = n & 255, g + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 4, 4294967295, 0), this[g + 3] = n >>> 24, this[g + 2] = n >>> 16, this[g + 1] = n >>> 8, this[g] = n & 255, g + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 4, 4294967295, 0), this[g] = n >>> 24, this[g + 1] = n >>> 16, this[g + 2] = n >>> 8, this[g + 3] = n & 255, g + 4;
  };
  function O($, n, g, U, fe) {
    we(n, U, fe, $, g, 7);
    let J = Number(n & BigInt(4294967295));
    $[g++] = J, J = J >> 8, $[g++] = J, J = J >> 8, $[g++] = J, J = J >> 8, $[g++] = J;
    let de = Number(n >> BigInt(32) & BigInt(4294967295));
    return $[g++] = de, de = de >> 8, $[g++] = de, de = de >> 8, $[g++] = de, de = de >> 8, $[g++] = de, g;
  }
  function B($, n, g, U, fe) {
    we(n, U, fe, $, g, 7);
    let J = Number(n & BigInt(4294967295));
    $[g + 7] = J, J = J >> 8, $[g + 6] = J, J = J >> 8, $[g + 5] = J, J = J >> 8, $[g + 4] = J;
    let de = Number(n >> BigInt(32) & BigInt(4294967295));
    return $[g + 3] = de, de = de >> 8, $[g + 2] = de, de = de >> 8, $[g + 1] = de, de = de >> 8, $[g] = de, g + 8;
  }
  o.prototype.writeBigUInt64LE = Me(function(n, g = 0) {
    return O(this, n, g, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeBigUInt64BE = Me(function(n, g = 0) {
    return B(this, n, g, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeIntLE = function(n, g, U, fe) {
    if (n = +n, g = g >>> 0, !fe) {
      const Be = Math.pow(2, 8 * U - 1);
      se(this, n, g, U, Be - 1, -Be);
    }
    let J = 0, de = 1, M = 0;
    for (this[g] = n & 255; ++J < U && (de *= 256); )
      n < 0 && M === 0 && this[g + J - 1] !== 0 && (M = 1), this[g + J] = (n / de >> 0) - M & 255;
    return g + U;
  }, o.prototype.writeIntBE = function(n, g, U, fe) {
    if (n = +n, g = g >>> 0, !fe) {
      const Be = Math.pow(2, 8 * U - 1);
      se(this, n, g, U, Be - 1, -Be);
    }
    let J = U - 1, de = 1, M = 0;
    for (this[g + J] = n & 255; --J >= 0 && (de *= 256); )
      n < 0 && M === 0 && this[g + J + 1] !== 0 && (M = 1), this[g + J] = (n / de >> 0) - M & 255;
    return g + U;
  }, o.prototype.writeInt8 = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 1, 127, -128), n < 0 && (n = 255 + n + 1), this[g] = n & 255, g + 1;
  }, o.prototype.writeInt16LE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 2, 32767, -32768), this[g] = n & 255, this[g + 1] = n >>> 8, g + 2;
  }, o.prototype.writeInt16BE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 2, 32767, -32768), this[g] = n >>> 8, this[g + 1] = n & 255, g + 2;
  }, o.prototype.writeInt32LE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 4, 2147483647, -2147483648), this[g] = n & 255, this[g + 1] = n >>> 8, this[g + 2] = n >>> 16, this[g + 3] = n >>> 24, g + 4;
  }, o.prototype.writeInt32BE = function(n, g, U) {
    return n = +n, g = g >>> 0, U || se(this, n, g, 4, 2147483647, -2147483648), n < 0 && (n = 4294967295 + n + 1), this[g] = n >>> 24, this[g + 1] = n >>> 16, this[g + 2] = n >>> 8, this[g + 3] = n & 255, g + 4;
  }, o.prototype.writeBigInt64LE = Me(function(n, g = 0) {
    return O(this, n, g, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), o.prototype.writeBigInt64BE = Me(function(n, g = 0) {
    return B(this, n, g, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function C($, n, g, U, fe, J) {
    if (g + U > $.length) throw new RangeError("Index out of range");
    if (g < 0) throw new RangeError("Index out of range");
  }
  function ee($, n, g, U, fe) {
    return n = +n, g = g >>> 0, fe || C($, n, g, 4), l.write($, n, g, U, 23, 4), g + 4;
  }
  o.prototype.writeFloatLE = function(n, g, U) {
    return ee(this, n, g, !0, U);
  }, o.prototype.writeFloatBE = function(n, g, U) {
    return ee(this, n, g, !1, U);
  };
  function te($, n, g, U, fe) {
    return n = +n, g = g >>> 0, fe || C($, n, g, 8), l.write($, n, g, U, 52, 8), g + 8;
  }
  o.prototype.writeDoubleLE = function(n, g, U) {
    return te(this, n, g, !0, U);
  }, o.prototype.writeDoubleBE = function(n, g, U) {
    return te(this, n, g, !1, U);
  }, o.prototype.copy = function(n, g, U, fe) {
    if (!o.isBuffer(n)) throw new TypeError("argument should be a Buffer");
    if (U || (U = 0), !fe && fe !== 0 && (fe = this.length), g >= n.length && (g = n.length), g || (g = 0), fe > 0 && fe < U && (fe = U), fe === U || n.length === 0 || this.length === 0) return 0;
    if (g < 0)
      throw new RangeError("targetStart out of bounds");
    if (U < 0 || U >= this.length) throw new RangeError("Index out of range");
    if (fe < 0) throw new RangeError("sourceEnd out of bounds");
    fe > this.length && (fe = this.length), n.length - g < fe - U && (fe = n.length - g + U);
    const J = fe - U;
    return this === n && typeof i.prototype.copyWithin == "function" ? this.copyWithin(g, U, fe) : i.prototype.set.call(
      n,
      this.subarray(U, fe),
      g
    ), J;
  }, o.prototype.fill = function(n, g, U, fe) {
    if (typeof n == "string") {
      if (typeof g == "string" ? (fe = g, g = 0, U = this.length) : typeof U == "string" && (fe = U, U = this.length), fe !== void 0 && typeof fe != "string")
        throw new TypeError("encoding must be a string");
      if (typeof fe == "string" && !o.isEncoding(fe))
        throw new TypeError("Unknown encoding: " + fe);
      if (n.length === 1) {
        const de = n.charCodeAt(0);
        (fe === "utf8" && de < 128 || fe === "latin1") && (n = de);
      }
    } else typeof n == "number" ? n = n & 255 : typeof n == "boolean" && (n = Number(n));
    if (g < 0 || this.length < g || this.length < U)
      throw new RangeError("Out of range index");
    if (U <= g)
      return this;
    g = g >>> 0, U = U === void 0 ? this.length : U >>> 0, n || (n = 0);
    let J;
    if (typeof n == "number")
      for (J = g; J < U; ++J)
        this[J] = n;
    else {
      const de = o.isBuffer(n) ? n : o.from(n, fe), M = de.length;
      if (M === 0)
        throw new TypeError('The value "' + n + '" is invalid for argument "value"');
      for (J = 0; J < U - g; ++J)
        this[J + g] = de[J % M];
    }
    return this;
  };
  const N = {};
  function j($, n, g) {
    N[$] = class extends g {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: n.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${$}]`, this.stack, delete this.name;
      }
      get code() {
        return $;
      }
      set code(fe) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: fe,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${$}]: ${this.message}`;
      }
    };
  }
  j(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function($) {
      return $ ? `${$} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), j(
    "ERR_INVALID_ARG_TYPE",
    function($, n) {
      return `The "${$}" argument must be of type number. Received type ${typeof n}`;
    },
    TypeError
  ), j(
    "ERR_OUT_OF_RANGE",
    function($, n, g) {
      let U = `The value of "${$}" is out of range.`, fe = g;
      return Number.isInteger(g) && Math.abs(g) > 2 ** 32 ? fe = W(String(g)) : typeof g == "bigint" && (fe = String(g), (g > BigInt(2) ** BigInt(32) || g < -(BigInt(2) ** BigInt(32))) && (fe = W(fe)), fe += "n"), U += ` It must be ${n}. Received ${fe}`, U;
    },
    RangeError
  );
  function W($) {
    let n = "", g = $.length;
    const U = $[0] === "-" ? 1 : 0;
    for (; g >= U + 4; g -= 3)
      n = `_${$.slice(g - 3, g)}${n}`;
    return `${$.slice(0, g)}${n}`;
  }
  function oe($, n, g) {
    Se(n, "offset"), ($[n] === void 0 || $[n + g] === void 0) && Re(n, $.length - (g + 1));
  }
  function we($, n, g, U, fe, J) {
    if ($ > g || $ < n) {
      const de = typeof n == "bigint" ? "n" : "";
      let M;
      throw n === 0 || n === BigInt(0) ? M = `>= 0${de} and < 2${de} ** ${(J + 1) * 8}${de}` : M = `>= -(2${de} ** ${(J + 1) * 8 - 1}${de}) and < 2 ** ${(J + 1) * 8 - 1}${de}`, new N.ERR_OUT_OF_RANGE("value", M, $);
    }
    oe(U, fe, J);
  }
  function Se($, n) {
    if (typeof $ != "number")
      throw new N.ERR_INVALID_ARG_TYPE(n, "number", $);
  }
  function Re($, n, g) {
    throw Math.floor($) !== $ ? (Se($, g), new N.ERR_OUT_OF_RANGE("offset", "an integer", $)) : n < 0 ? new N.ERR_BUFFER_OUT_OF_BOUNDS() : new N.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${n}`,
      $
    );
  }
  const Oe = /[^+/0-9A-Za-z-_]/g;
  function re($) {
    if ($ = $.split("=")[0], $ = $.trim().replace(Oe, ""), $.length < 2) return "";
    for (; $.length % 4 !== 0; )
      $ = $ + "=";
    return $;
  }
  function De($, n) {
    n = n || 1 / 0;
    let g;
    const U = $.length;
    let fe = null;
    const J = [];
    for (let de = 0; de < U; ++de) {
      if (g = $.charCodeAt(de), g > 55295 && g < 57344) {
        if (!fe) {
          if (g > 56319) {
            (n -= 3) > -1 && J.push(239, 191, 189);
            continue;
          } else if (de + 1 === U) {
            (n -= 3) > -1 && J.push(239, 191, 189);
            continue;
          }
          fe = g;
          continue;
        }
        if (g < 56320) {
          (n -= 3) > -1 && J.push(239, 191, 189), fe = g;
          continue;
        }
        g = (fe - 55296 << 10 | g - 56320) + 65536;
      } else fe && (n -= 3) > -1 && J.push(239, 191, 189);
      if (fe = null, g < 128) {
        if ((n -= 1) < 0) break;
        J.push(g);
      } else if (g < 2048) {
        if ((n -= 2) < 0) break;
        J.push(
          g >> 6 | 192,
          g & 63 | 128
        );
      } else if (g < 65536) {
        if ((n -= 3) < 0) break;
        J.push(
          g >> 12 | 224,
          g >> 6 & 63 | 128,
          g & 63 | 128
        );
      } else if (g < 1114112) {
        if ((n -= 4) < 0) break;
        J.push(
          g >> 18 | 240,
          g >> 12 & 63 | 128,
          g >> 6 & 63 | 128,
          g & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return J;
  }
  function Le($) {
    const n = [];
    for (let g = 0; g < $.length; ++g)
      n.push($.charCodeAt(g) & 255);
    return n;
  }
  function Pe($, n) {
    let g, U, fe;
    const J = [];
    for (let de = 0; de < $.length && !((n -= 2) < 0); ++de)
      g = $.charCodeAt(de), U = g >> 8, fe = g % 256, J.push(fe), J.push(U);
    return J;
  }
  function $e($) {
    return e.toByteArray(re($));
  }
  function ve($, n, g, U) {
    let fe;
    for (fe = 0; fe < U && !(fe + g >= n.length || fe >= $.length); ++fe)
      n[fe + g] = $[fe];
    return fe;
  }
  function Ee($, n) {
    return $ instanceof n || $ != null && $.constructor != null && $.constructor.name != null && $.constructor.name === n.name;
  }
  function je($) {
    return $ !== $;
  }
  const qe = (function() {
    const $ = "0123456789abcdef", n = new Array(256);
    for (let g = 0; g < 16; ++g) {
      const U = g * 16;
      for (let fe = 0; fe < 16; ++fe)
        n[U + fe] = $[g] + $[fe];
    }
    return n;
  })();
  function Me($) {
    return typeof BigInt > "u" ? We : $;
  }
  function We() {
    throw new Error("BigInt not supported");
  }
})(tc);
const dr = tc.Buffer;
function xd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var ic = { exports: {} }, ur = ic.exports = {}, Dr, Nr;
function Co() {
  throw new Error("setTimeout has not been defined");
}
function jo() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Dr = setTimeout : Dr = Co;
  } catch {
    Dr = Co;
  }
  try {
    typeof clearTimeout == "function" ? Nr = clearTimeout : Nr = jo;
  } catch {
    Nr = jo;
  }
})();
function ac(t) {
  if (Dr === setTimeout)
    return setTimeout(t, 0);
  if ((Dr === Co || !Dr) && setTimeout)
    return Dr = setTimeout, setTimeout(t, 0);
  try {
    return Dr(t, 0);
  } catch {
    try {
      return Dr.call(null, t, 0);
    } catch {
      return Dr.call(this, t, 0);
    }
  }
}
function Fd(t) {
  if (Nr === clearTimeout)
    return clearTimeout(t);
  if ((Nr === jo || !Nr) && clearTimeout)
    return Nr = clearTimeout, clearTimeout(t);
  try {
    return Nr(t);
  } catch {
    try {
      return Nr.call(null, t);
    } catch {
      return Nr.call(this, t);
    }
  }
}
var qr = [], ut = !1, tt, Ut = -1;
function Dd() {
  !ut || !tt || (ut = !1, tt.length ? qr = tt.concat(qr) : Ut = -1, qr.length && oc());
}
function oc() {
  if (!ut) {
    var t = ac(Dd);
    ut = !0;
    for (var e = qr.length; e; ) {
      for (tt = qr, qr = []; ++Ut < e; )
        tt && tt[Ut].run();
      Ut = -1, e = qr.length;
    }
    tt = null, ut = !1, Fd(t);
  }
}
ur.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var l = 1; l < arguments.length; l++)
      e[l - 1] = arguments[l];
  qr.push(new sc(t, e)), qr.length === 1 && !ut && ac(oc);
};
function sc(t, e) {
  this.fun = t, this.array = e;
}
sc.prototype.run = function() {
  this.fun.apply(null, this.array);
};
ur.title = "browser";
ur.browser = !0;
ur.env = {};
ur.argv = [];
ur.version = "";
ur.versions = {};
function zr() {
}
ur.on = zr;
ur.addListener = zr;
ur.once = zr;
ur.off = zr;
ur.removeListener = zr;
ur.removeAllListeners = zr;
ur.emit = zr;
ur.prependListener = zr;
ur.prependOnceListener = zr;
ur.listeners = function(t) {
  return [];
};
ur.binding = function(t) {
  throw new Error("process.binding is not supported");
};
ur.cwd = function() {
  return "/";
};
ur.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
ur.umask = function() {
  return 0;
};
var Nd = ic.exports;
const Ke = /* @__PURE__ */ xd(Nd);
var an = {}, on = {}, us;
function wr() {
  return us || (us = 1, (function(t) {
    Object.defineProperties(t, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
    var e = {}, l = {};
    l.byteLength = o, l.toByteArray = S, l.fromByteArray = w;
    for (var c = [], r = [], i = typeof Uint8Array < "u" ? Uint8Array : Array, p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, b = p.length; f < b; ++f)
      c[f] = p[f], r[p.charCodeAt(f)] = f;
    r[45] = 62, r[95] = 63;
    function A(E) {
      var _ = E.length;
      if (_ % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var I = E.indexOf("=");
      I === -1 && (I = _);
      var P = I === _ ? 0 : 4 - I % 4;
      return [I, P];
    }
    function o(E) {
      var _ = A(E), I = _[0], P = _[1];
      return (I + P) * 3 / 4 - P;
    }
    function v(E, _, I) {
      return (_ + I) * 3 / 4 - I;
    }
    function S(E) {
      var _, I = A(E), P = I[0], D = I[1], x = new i(v(E, P, D)), q = 0, K = D > 0 ? P - 4 : P, L;
      for (L = 0; L < K; L += 4)
        _ = r[E.charCodeAt(L)] << 18 | r[E.charCodeAt(L + 1)] << 12 | r[E.charCodeAt(L + 2)] << 6 | r[E.charCodeAt(L + 3)], x[q++] = _ >> 16 & 255, x[q++] = _ >> 8 & 255, x[q++] = _ & 255;
      return D === 2 && (_ = r[E.charCodeAt(L)] << 2 | r[E.charCodeAt(L + 1)] >> 4, x[q++] = _ & 255), D === 1 && (_ = r[E.charCodeAt(L)] << 10 | r[E.charCodeAt(L + 1)] << 4 | r[E.charCodeAt(L + 2)] >> 2, x[q++] = _ >> 8 & 255, x[q++] = _ & 255), x;
    }
    function s(E) {
      return c[E >> 18 & 63] + c[E >> 12 & 63] + c[E >> 6 & 63] + c[E & 63];
    }
    function a(E, _, I) {
      for (var P, D = [], x = _; x < I; x += 3)
        P = (E[x] << 16 & 16711680) + (E[x + 1] << 8 & 65280) + (E[x + 2] & 255), D.push(s(P));
      return D.join("");
    }
    function w(E) {
      for (var _, I = E.length, P = I % 3, D = [], x = 16383, q = 0, K = I - P; q < K; q += x)
        D.push(a(E, q, q + x > K ? K : q + x));
      return P === 1 ? (_ = E[I - 1], D.push(
        c[_ >> 2] + c[_ << 4 & 63] + "=="
      )) : P === 2 && (_ = (E[I - 2] << 8) + E[I - 1], D.push(
        c[_ >> 10] + c[_ >> 4 & 63] + c[_ << 2 & 63] + "="
      )), D.join("");
    }
    var u = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    u.read = function(E, _, I, P, D) {
      var x, q, K = D * 8 - P - 1, L = (1 << K) - 1, z = L >> 1, y = -7, F = I ? D - 1 : 0, ie = I ? -1 : 1, ce = E[_ + F];
      for (F += ie, x = ce & (1 << -y) - 1, ce >>= -y, y += K; y > 0; x = x * 256 + E[_ + F], F += ie, y -= 8)
        ;
      for (q = x & (1 << -y) - 1, x >>= -y, y += P; y > 0; q = q * 256 + E[_ + F], F += ie, y -= 8)
        ;
      if (x === 0)
        x = 1 - z;
      else {
        if (x === L)
          return q ? NaN : (ce ? -1 : 1) * (1 / 0);
        q = q + Math.pow(2, P), x = x - z;
      }
      return (ce ? -1 : 1) * q * Math.pow(2, x - P);
    }, u.write = function(E, _, I, P, D, x) {
      var q, K, L, z = x * 8 - D - 1, y = (1 << z) - 1, F = y >> 1, ie = D === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, ce = P ? 0 : x - 1, _e = P ? 1 : -1, be = _ < 0 || _ === 0 && 1 / _ < 0 ? 1 : 0;
      for (_ = Math.abs(_), isNaN(_) || _ === 1 / 0 ? (K = isNaN(_) ? 1 : 0, q = y) : (q = Math.floor(Math.log(_) / Math.LN2), _ * (L = Math.pow(2, -q)) < 1 && (q--, L *= 2), q + F >= 1 ? _ += ie / L : _ += ie * Math.pow(2, 1 - F), _ * L >= 2 && (q++, L /= 2), q + F >= y ? (K = 0, q = y) : q + F >= 1 ? (K = (_ * L - 1) * Math.pow(2, D), q = q + F) : (K = _ * Math.pow(2, F - 1) * Math.pow(2, D), q = 0)); D >= 8; E[I + ce] = K & 255, ce += _e, K /= 256, D -= 8)
        ;
      for (q = q << D | K, z += D; z > 0; E[I + ce] = q & 255, ce += _e, q /= 256, z -= 8)
        ;
      E[I + ce - _e] |= be * 128;
    };
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    (function(E) {
      const _ = l, I = u, P = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      E.Buffer = y, E.SlowBuffer = Q, E.INSPECT_MAX_BYTES = 50;
      const D = 2147483647;
      E.kMaxLength = D;
      const { Uint8Array: x, ArrayBuffer: q, SharedArrayBuffer: K } = globalThis;
      y.TYPED_ARRAY_SUPPORT = L(), !y.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function L() {
        try {
          const m = new x(1), h = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(h, x.prototype), Object.setPrototypeOf(m, h), m.foo() === 42;
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
      function z(m) {
        if (m > D)
          throw new RangeError('The value "' + m + '" is invalid for option "size"');
        const h = new x(m);
        return Object.setPrototypeOf(h, y.prototype), h;
      }
      function y(m, h, T) {
        if (typeof m == "number") {
          if (typeof h == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return _e(m);
        }
        return F(m, h, T);
      }
      y.poolSize = 8192;
      function F(m, h, T) {
        if (typeof m == "string")
          return be(m, h);
        if (q.isView(m))
          return le(m);
        if (m == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
          );
        if (V(m, q) || m && V(m.buffer, q) || typeof K < "u" && (V(m, K) || m && V(m.buffer, K)))
          return k(m, h, T);
        if (typeof m == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const Y = m.valueOf && m.valueOf();
        if (Y != null && Y !== m)
          return y.from(Y, h, T);
        const pe = he(m);
        if (pe) return pe;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof m[Symbol.toPrimitive] == "function")
          return y.from(m[Symbol.toPrimitive]("string"), h, T);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
        );
      }
      y.from = function(m, h, T) {
        return F(m, h, T);
      }, Object.setPrototypeOf(y.prototype, x.prototype), Object.setPrototypeOf(y, x);
      function ie(m) {
        if (typeof m != "number")
          throw new TypeError('"size" argument must be of type number');
        if (m < 0)
          throw new RangeError('The value "' + m + '" is invalid for option "size"');
      }
      function ce(m, h, T) {
        return ie(m), m <= 0 ? z(m) : h !== void 0 ? typeof T == "string" ? z(m).fill(h, T) : z(m).fill(h) : z(m);
      }
      y.alloc = function(m, h, T) {
        return ce(m, h, T);
      };
      function _e(m) {
        return ie(m), z(m < 0 ? 0 : X(m) | 0);
      }
      y.allocUnsafe = function(m) {
        return _e(m);
      }, y.allocUnsafeSlow = function(m) {
        return _e(m);
      };
      function be(m, h) {
        if ((typeof h != "string" || h === "") && (h = "utf8"), !y.isEncoding(h))
          throw new TypeError("Unknown encoding: " + h);
        const T = H(m, h) | 0;
        let Y = z(T);
        const pe = Y.write(m, h);
        return pe !== T && (Y = Y.slice(0, pe)), Y;
      }
      function ue(m) {
        const h = m.length < 0 ? 0 : X(m.length) | 0, T = z(h);
        for (let Y = 0; Y < h; Y += 1)
          T[Y] = m[Y] & 255;
        return T;
      }
      function le(m) {
        if (V(m, x)) {
          const h = new x(m);
          return k(h.buffer, h.byteOffset, h.byteLength);
        }
        return ue(m);
      }
      function k(m, h, T) {
        if (h < 0 || m.byteLength < h)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (m.byteLength < h + (T || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let Y;
        return h === void 0 && T === void 0 ? Y = new x(m) : T === void 0 ? Y = new x(m, h) : Y = new x(m, h, T), Object.setPrototypeOf(Y, y.prototype), Y;
      }
      function he(m) {
        if (y.isBuffer(m)) {
          const h = X(m.length) | 0, T = z(h);
          return T.length === 0 || m.copy(T, 0, 0, h), T;
        }
        if (m.length !== void 0)
          return typeof m.length != "number" || me(m.length) ? z(0) : ue(m);
        if (m.type === "Buffer" && Array.isArray(m.data))
          return ue(m.data);
      }
      function X(m) {
        if (m >= D)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + D.toString(16) + " bytes");
        return m | 0;
      }
      function Q(m) {
        return +m != m && (m = 0), y.alloc(+m);
      }
      y.isBuffer = function(h) {
        return h != null && h._isBuffer === !0 && h !== y.prototype;
      }, y.compare = function(h, T) {
        if (V(h, x) && (h = y.from(h, h.offset, h.byteLength)), V(T, x) && (T = y.from(T, T.offset, T.byteLength)), !y.isBuffer(h) || !y.isBuffer(T))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (h === T) return 0;
        let Y = h.length, pe = T.length;
        for (let Te = 0, ne = Math.min(Y, pe); Te < ne; ++Te)
          if (h[Te] !== T[Te]) {
            Y = h[Te], pe = T[Te];
            break;
          }
        return Y < pe ? -1 : pe < Y ? 1 : 0;
      }, y.isEncoding = function(h) {
        switch (String(h).toLowerCase()) {
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
      }, y.concat = function(h, T) {
        if (!Array.isArray(h))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (h.length === 0)
          return y.alloc(0);
        let Y;
        if (T === void 0)
          for (T = 0, Y = 0; Y < h.length; ++Y)
            T += h[Y].length;
        const pe = y.allocUnsafe(T);
        let Te = 0;
        for (Y = 0; Y < h.length; ++Y) {
          let ne = h[Y];
          if (V(ne, x))
            Te + ne.length > pe.length ? (y.isBuffer(ne) || (ne = y.from(ne)), ne.copy(pe, Te)) : x.prototype.set.call(
              pe,
              ne,
              Te
            );
          else if (y.isBuffer(ne))
            ne.copy(pe, Te);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          Te += ne.length;
        }
        return pe;
      };
      function H(m, h) {
        if (y.isBuffer(m))
          return m.length;
        if (q.isView(m) || V(m, q))
          return m.byteLength;
        if (typeof m != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof m
          );
        const T = m.length, Y = arguments.length > 2 && arguments[2] === !0;
        if (!Y && T === 0) return 0;
        let pe = !1;
        for (; ; )
          switch (h) {
            case "ascii":
            case "latin1":
            case "binary":
              return T;
            case "utf8":
            case "utf-8":
              return Be(m).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return T * 2;
            case "hex":
              return T >>> 1;
            case "base64":
              return Ie(m).length;
            default:
              if (pe)
                return Y ? -1 : Be(m).length;
              h = ("" + h).toLowerCase(), pe = !0;
          }
      }
      y.byteLength = H;
      function se(m, h, T) {
        let Y = !1;
        if ((h === void 0 || h < 0) && (h = 0), h > this.length || ((T === void 0 || T > this.length) && (T = this.length), T <= 0) || (T >>>= 0, h >>>= 0, T <= h))
          return "";
        for (m || (m = "utf8"); ; )
          switch (m) {
            case "hex":
              return De(this, h, T);
            case "utf8":
            case "utf-8":
              return we(this, h, T);
            case "ascii":
              return Oe(this, h, T);
            case "latin1":
            case "binary":
              return re(this, h, T);
            case "base64":
              return oe(this, h, T);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Le(this, h, T);
            default:
              if (Y) throw new TypeError("Unknown encoding: " + m);
              m = (m + "").toLowerCase(), Y = !0;
          }
      }
      y.prototype._isBuffer = !0;
      function O(m, h, T) {
        const Y = m[h];
        m[h] = m[T], m[T] = Y;
      }
      y.prototype.swap16 = function() {
        const h = this.length;
        if (h % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let T = 0; T < h; T += 2)
          O(this, T, T + 1);
        return this;
      }, y.prototype.swap32 = function() {
        const h = this.length;
        if (h % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let T = 0; T < h; T += 4)
          O(this, T, T + 3), O(this, T + 1, T + 2);
        return this;
      }, y.prototype.swap64 = function() {
        const h = this.length;
        if (h % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let T = 0; T < h; T += 8)
          O(this, T, T + 7), O(this, T + 1, T + 6), O(this, T + 2, T + 5), O(this, T + 3, T + 4);
        return this;
      }, y.prototype.toString = function() {
        const h = this.length;
        return h === 0 ? "" : arguments.length === 0 ? we(this, 0, h) : se.apply(this, arguments);
      }, y.prototype.toLocaleString = y.prototype.toString, y.prototype.equals = function(h) {
        if (!y.isBuffer(h)) throw new TypeError("Argument must be a Buffer");
        return this === h ? !0 : y.compare(this, h) === 0;
      }, y.prototype.inspect = function() {
        let h = "";
        const T = E.INSPECT_MAX_BYTES;
        return h = this.toString("hex", 0, T).replace(/(.{2})/g, "$1 ").trim(), this.length > T && (h += " ... "), "<Buffer " + h + ">";
      }, P && (y.prototype[P] = y.prototype.inspect), y.prototype.compare = function(h, T, Y, pe, Te) {
        if (V(h, x) && (h = y.from(h, h.offset, h.byteLength)), !y.isBuffer(h))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof h
          );
        if (T === void 0 && (T = 0), Y === void 0 && (Y = h ? h.length : 0), pe === void 0 && (pe = 0), Te === void 0 && (Te = this.length), T < 0 || Y > h.length || pe < 0 || Te > this.length)
          throw new RangeError("out of range index");
        if (pe >= Te && T >= Y)
          return 0;
        if (pe >= Te)
          return -1;
        if (T >= Y)
          return 1;
        if (T >>>= 0, Y >>>= 0, pe >>>= 0, Te >>>= 0, this === h) return 0;
        let ne = Te - pe, ae = Y - T;
        const ye = Math.min(ne, ae), xe = this.slice(pe, Te), Ae = h.slice(T, Y);
        for (let ke = 0; ke < ye; ++ke)
          if (xe[ke] !== Ae[ke]) {
            ne = xe[ke], ae = Ae[ke];
            break;
          }
        return ne < ae ? -1 : ae < ne ? 1 : 0;
      };
      function B(m, h, T, Y, pe) {
        if (m.length === 0) return -1;
        if (typeof T == "string" ? (Y = T, T = 0) : T > 2147483647 ? T = 2147483647 : T < -2147483648 && (T = -2147483648), T = +T, me(T) && (T = pe ? 0 : m.length - 1), T < 0 && (T = m.length + T), T >= m.length) {
          if (pe) return -1;
          T = m.length - 1;
        } else if (T < 0)
          if (pe) T = 0;
          else return -1;
        if (typeof h == "string" && (h = y.from(h, Y)), y.isBuffer(h))
          return h.length === 0 ? -1 : C(m, h, T, Y, pe);
        if (typeof h == "number")
          return h = h & 255, typeof x.prototype.indexOf == "function" ? pe ? x.prototype.indexOf.call(m, h, T) : x.prototype.lastIndexOf.call(m, h, T) : C(m, [h], T, Y, pe);
        throw new TypeError("val must be string, number or Buffer");
      }
      function C(m, h, T, Y, pe) {
        let Te = 1, ne = m.length, ae = h.length;
        if (Y !== void 0 && (Y = String(Y).toLowerCase(), Y === "ucs2" || Y === "ucs-2" || Y === "utf16le" || Y === "utf-16le")) {
          if (m.length < 2 || h.length < 2)
            return -1;
          Te = 2, ne /= 2, ae /= 2, T /= 2;
        }
        function ye(Ae, ke) {
          return Te === 1 ? Ae[ke] : Ae.readUInt16BE(ke * Te);
        }
        let xe;
        if (pe) {
          let Ae = -1;
          for (xe = T; xe < ne; xe++)
            if (ye(m, xe) === ye(h, Ae === -1 ? 0 : xe - Ae)) {
              if (Ae === -1 && (Ae = xe), xe - Ae + 1 === ae) return Ae * Te;
            } else
              Ae !== -1 && (xe -= xe - Ae), Ae = -1;
        } else
          for (T + ae > ne && (T = ne - ae), xe = T; xe >= 0; xe--) {
            let Ae = !0;
            for (let ke = 0; ke < ae; ke++)
              if (ye(m, xe + ke) !== ye(h, ke)) {
                Ae = !1;
                break;
              }
            if (Ae) return xe;
          }
        return -1;
      }
      y.prototype.includes = function(h, T, Y) {
        return this.indexOf(h, T, Y) !== -1;
      }, y.prototype.indexOf = function(h, T, Y) {
        return B(this, h, T, Y, !0);
      }, y.prototype.lastIndexOf = function(h, T, Y) {
        return B(this, h, T, Y, !1);
      };
      function ee(m, h, T, Y) {
        T = Number(T) || 0;
        const pe = m.length - T;
        Y ? (Y = Number(Y), Y > pe && (Y = pe)) : Y = pe;
        const Te = h.length;
        Y > Te / 2 && (Y = Te / 2);
        let ne;
        for (ne = 0; ne < Y; ++ne) {
          const ae = parseInt(h.substr(ne * 2, 2), 16);
          if (me(ae)) return ne;
          m[T + ne] = ae;
        }
        return ne;
      }
      function te(m, h, T, Y) {
        return Ne(Be(h, m.length - T), m, T, Y);
      }
      function N(m, h, T, Y) {
        return Ne(ze(h), m, T, Y);
      }
      function j(m, h, T, Y) {
        return Ne(Ie(h), m, T, Y);
      }
      function W(m, h, T, Y) {
        return Ne(R(h, m.length - T), m, T, Y);
      }
      y.prototype.write = function(h, T, Y, pe) {
        if (T === void 0)
          pe = "utf8", Y = this.length, T = 0;
        else if (Y === void 0 && typeof T == "string")
          pe = T, Y = this.length, T = 0;
        else if (isFinite(T))
          T = T >>> 0, isFinite(Y) ? (Y = Y >>> 0, pe === void 0 && (pe = "utf8")) : (pe = Y, Y = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const Te = this.length - T;
        if ((Y === void 0 || Y > Te) && (Y = Te), h.length > 0 && (Y < 0 || T < 0) || T > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        pe || (pe = "utf8");
        let ne = !1;
        for (; ; )
          switch (pe) {
            case "hex":
              return ee(this, h, T, Y);
            case "utf8":
            case "utf-8":
              return te(this, h, T, Y);
            case "ascii":
            case "latin1":
            case "binary":
              return N(this, h, T, Y);
            case "base64":
              return j(this, h, T, Y);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return W(this, h, T, Y);
            default:
              if (ne) throw new TypeError("Unknown encoding: " + pe);
              pe = ("" + pe).toLowerCase(), ne = !0;
          }
      }, y.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function oe(m, h, T) {
        return h === 0 && T === m.length ? _.fromByteArray(m) : _.fromByteArray(m.slice(h, T));
      }
      function we(m, h, T) {
        T = Math.min(m.length, T);
        const Y = [];
        let pe = h;
        for (; pe < T; ) {
          const Te = m[pe];
          let ne = null, ae = Te > 239 ? 4 : Te > 223 ? 3 : Te > 191 ? 2 : 1;
          if (pe + ae <= T) {
            let ye, xe, Ae, ke;
            switch (ae) {
              case 1:
                Te < 128 && (ne = Te);
                break;
              case 2:
                ye = m[pe + 1], (ye & 192) === 128 && (ke = (Te & 31) << 6 | ye & 63, ke > 127 && (ne = ke));
                break;
              case 3:
                ye = m[pe + 1], xe = m[pe + 2], (ye & 192) === 128 && (xe & 192) === 128 && (ke = (Te & 15) << 12 | (ye & 63) << 6 | xe & 63, ke > 2047 && (ke < 55296 || ke > 57343) && (ne = ke));
                break;
              case 4:
                ye = m[pe + 1], xe = m[pe + 2], Ae = m[pe + 3], (ye & 192) === 128 && (xe & 192) === 128 && (Ae & 192) === 128 && (ke = (Te & 15) << 18 | (ye & 63) << 12 | (xe & 63) << 6 | Ae & 63, ke > 65535 && ke < 1114112 && (ne = ke));
            }
          }
          ne === null ? (ne = 65533, ae = 1) : ne > 65535 && (ne -= 65536, Y.push(ne >>> 10 & 1023 | 55296), ne = 56320 | ne & 1023), Y.push(ne), pe += ae;
        }
        return Re(Y);
      }
      const Se = 4096;
      function Re(m) {
        const h = m.length;
        if (h <= Se)
          return String.fromCharCode.apply(String, m);
        let T = "", Y = 0;
        for (; Y < h; )
          T += String.fromCharCode.apply(
            String,
            m.slice(Y, Y += Se)
          );
        return T;
      }
      function Oe(m, h, T) {
        let Y = "";
        T = Math.min(m.length, T);
        for (let pe = h; pe < T; ++pe)
          Y += String.fromCharCode(m[pe] & 127);
        return Y;
      }
      function re(m, h, T) {
        let Y = "";
        T = Math.min(m.length, T);
        for (let pe = h; pe < T; ++pe)
          Y += String.fromCharCode(m[pe]);
        return Y;
      }
      function De(m, h, T) {
        const Y = m.length;
        (!h || h < 0) && (h = 0), (!T || T < 0 || T > Y) && (T = Y);
        let pe = "";
        for (let Te = h; Te < T; ++Te)
          pe += Fe[m[Te]];
        return pe;
      }
      function Le(m, h, T) {
        const Y = m.slice(h, T);
        let pe = "";
        for (let Te = 0; Te < Y.length - 1; Te += 2)
          pe += String.fromCharCode(Y[Te] + Y[Te + 1] * 256);
        return pe;
      }
      y.prototype.slice = function(h, T) {
        const Y = this.length;
        h = ~~h, T = T === void 0 ? Y : ~~T, h < 0 ? (h += Y, h < 0 && (h = 0)) : h > Y && (h = Y), T < 0 ? (T += Y, T < 0 && (T = 0)) : T > Y && (T = Y), T < h && (T = h);
        const pe = this.subarray(h, T);
        return Object.setPrototypeOf(pe, y.prototype), pe;
      };
      function Pe(m, h, T) {
        if (m % 1 !== 0 || m < 0) throw new RangeError("offset is not uint");
        if (m + h > T) throw new RangeError("Trying to access beyond buffer length");
      }
      y.prototype.readUintLE = y.prototype.readUIntLE = function(h, T, Y) {
        h = h >>> 0, T = T >>> 0, Y || Pe(h, T, this.length);
        let pe = this[h], Te = 1, ne = 0;
        for (; ++ne < T && (Te *= 256); )
          pe += this[h + ne] * Te;
        return pe;
      }, y.prototype.readUintBE = y.prototype.readUIntBE = function(h, T, Y) {
        h = h >>> 0, T = T >>> 0, Y || Pe(h, T, this.length);
        let pe = this[h + --T], Te = 1;
        for (; T > 0 && (Te *= 256); )
          pe += this[h + --T] * Te;
        return pe;
      }, y.prototype.readUint8 = y.prototype.readUInt8 = function(h, T) {
        return h = h >>> 0, T || Pe(h, 1, this.length), this[h];
      }, y.prototype.readUint16LE = y.prototype.readUInt16LE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 2, this.length), this[h] | this[h + 1] << 8;
      }, y.prototype.readUint16BE = y.prototype.readUInt16BE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 2, this.length), this[h] << 8 | this[h + 1];
      }, y.prototype.readUint32LE = y.prototype.readUInt32LE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), (this[h] | this[h + 1] << 8 | this[h + 2] << 16) + this[h + 3] * 16777216;
      }, y.prototype.readUint32BE = y.prototype.readUInt32BE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), this[h] * 16777216 + (this[h + 1] << 16 | this[h + 2] << 8 | this[h + 3]);
      }, y.prototype.readBigUInt64LE = Ve(function(h) {
        h = h >>> 0, fe(h, "offset");
        const T = this[h], Y = this[h + 7];
        (T === void 0 || Y === void 0) && J(h, this.length - 8);
        const pe = T + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + this[++h] * 2 ** 24, Te = this[++h] + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + Y * 2 ** 24;
        return BigInt(pe) + (BigInt(Te) << BigInt(32));
      }), y.prototype.readBigUInt64BE = Ve(function(h) {
        h = h >>> 0, fe(h, "offset");
        const T = this[h], Y = this[h + 7];
        (T === void 0 || Y === void 0) && J(h, this.length - 8);
        const pe = T * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + this[++h], Te = this[++h] * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + Y;
        return (BigInt(pe) << BigInt(32)) + BigInt(Te);
      }), y.prototype.readIntLE = function(h, T, Y) {
        h = h >>> 0, T = T >>> 0, Y || Pe(h, T, this.length);
        let pe = this[h], Te = 1, ne = 0;
        for (; ++ne < T && (Te *= 256); )
          pe += this[h + ne] * Te;
        return Te *= 128, pe >= Te && (pe -= Math.pow(2, 8 * T)), pe;
      }, y.prototype.readIntBE = function(h, T, Y) {
        h = h >>> 0, T = T >>> 0, Y || Pe(h, T, this.length);
        let pe = T, Te = 1, ne = this[h + --pe];
        for (; pe > 0 && (Te *= 256); )
          ne += this[h + --pe] * Te;
        return Te *= 128, ne >= Te && (ne -= Math.pow(2, 8 * T)), ne;
      }, y.prototype.readInt8 = function(h, T) {
        return h = h >>> 0, T || Pe(h, 1, this.length), this[h] & 128 ? (255 - this[h] + 1) * -1 : this[h];
      }, y.prototype.readInt16LE = function(h, T) {
        h = h >>> 0, T || Pe(h, 2, this.length);
        const Y = this[h] | this[h + 1] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, y.prototype.readInt16BE = function(h, T) {
        h = h >>> 0, T || Pe(h, 2, this.length);
        const Y = this[h + 1] | this[h] << 8;
        return Y & 32768 ? Y | 4294901760 : Y;
      }, y.prototype.readInt32LE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), this[h] | this[h + 1] << 8 | this[h + 2] << 16 | this[h + 3] << 24;
      }, y.prototype.readInt32BE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), this[h] << 24 | this[h + 1] << 16 | this[h + 2] << 8 | this[h + 3];
      }, y.prototype.readBigInt64LE = Ve(function(h) {
        h = h >>> 0, fe(h, "offset");
        const T = this[h], Y = this[h + 7];
        (T === void 0 || Y === void 0) && J(h, this.length - 8);
        const pe = this[h + 4] + this[h + 5] * 2 ** 8 + this[h + 6] * 2 ** 16 + (Y << 24);
        return (BigInt(pe) << BigInt(32)) + BigInt(T + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + this[++h] * 2 ** 24);
      }), y.prototype.readBigInt64BE = Ve(function(h) {
        h = h >>> 0, fe(h, "offset");
        const T = this[h], Y = this[h + 7];
        (T === void 0 || Y === void 0) && J(h, this.length - 8);
        const pe = (T << 24) + // Overflow
        this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + this[++h];
        return (BigInt(pe) << BigInt(32)) + BigInt(this[++h] * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + Y);
      }), y.prototype.readFloatLE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), I.read(this, h, !0, 23, 4);
      }, y.prototype.readFloatBE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 4, this.length), I.read(this, h, !1, 23, 4);
      }, y.prototype.readDoubleLE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 8, this.length), I.read(this, h, !0, 52, 8);
      }, y.prototype.readDoubleBE = function(h, T) {
        return h = h >>> 0, T || Pe(h, 8, this.length), I.read(this, h, !1, 52, 8);
      };
      function $e(m, h, T, Y, pe, Te) {
        if (!y.isBuffer(m)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (h > pe || h < Te) throw new RangeError('"value" argument is out of bounds');
        if (T + Y > m.length) throw new RangeError("Index out of range");
      }
      y.prototype.writeUintLE = y.prototype.writeUIntLE = function(h, T, Y, pe) {
        if (h = +h, T = T >>> 0, Y = Y >>> 0, !pe) {
          const ae = Math.pow(2, 8 * Y) - 1;
          $e(this, h, T, Y, ae, 0);
        }
        let Te = 1, ne = 0;
        for (this[T] = h & 255; ++ne < Y && (Te *= 256); )
          this[T + ne] = h / Te & 255;
        return T + Y;
      }, y.prototype.writeUintBE = y.prototype.writeUIntBE = function(h, T, Y, pe) {
        if (h = +h, T = T >>> 0, Y = Y >>> 0, !pe) {
          const ae = Math.pow(2, 8 * Y) - 1;
          $e(this, h, T, Y, ae, 0);
        }
        let Te = Y - 1, ne = 1;
        for (this[T + Te] = h & 255; --Te >= 0 && (ne *= 256); )
          this[T + Te] = h / ne & 255;
        return T + Y;
      }, y.prototype.writeUint8 = y.prototype.writeUInt8 = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 1, 255, 0), this[T] = h & 255, T + 1;
      }, y.prototype.writeUint16LE = y.prototype.writeUInt16LE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 2, 65535, 0), this[T] = h & 255, this[T + 1] = h >>> 8, T + 2;
      }, y.prototype.writeUint16BE = y.prototype.writeUInt16BE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 2, 65535, 0), this[T] = h >>> 8, this[T + 1] = h & 255, T + 2;
      }, y.prototype.writeUint32LE = y.prototype.writeUInt32LE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 4, 4294967295, 0), this[T + 3] = h >>> 24, this[T + 2] = h >>> 16, this[T + 1] = h >>> 8, this[T] = h & 255, T + 4;
      }, y.prototype.writeUint32BE = y.prototype.writeUInt32BE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 4, 4294967295, 0), this[T] = h >>> 24, this[T + 1] = h >>> 16, this[T + 2] = h >>> 8, this[T + 3] = h & 255, T + 4;
      };
      function ve(m, h, T, Y, pe) {
        U(h, Y, pe, m, T, 7);
        let Te = Number(h & BigInt(4294967295));
        m[T++] = Te, Te = Te >> 8, m[T++] = Te, Te = Te >> 8, m[T++] = Te, Te = Te >> 8, m[T++] = Te;
        let ne = Number(h >> BigInt(32) & BigInt(4294967295));
        return m[T++] = ne, ne = ne >> 8, m[T++] = ne, ne = ne >> 8, m[T++] = ne, ne = ne >> 8, m[T++] = ne, T;
      }
      function Ee(m, h, T, Y, pe) {
        U(h, Y, pe, m, T, 7);
        let Te = Number(h & BigInt(4294967295));
        m[T + 7] = Te, Te = Te >> 8, m[T + 6] = Te, Te = Te >> 8, m[T + 5] = Te, Te = Te >> 8, m[T + 4] = Te;
        let ne = Number(h >> BigInt(32) & BigInt(4294967295));
        return m[T + 3] = ne, ne = ne >> 8, m[T + 2] = ne, ne = ne >> 8, m[T + 1] = ne, ne = ne >> 8, m[T] = ne, T + 8;
      }
      y.prototype.writeBigUInt64LE = Ve(function(h, T = 0) {
        return ve(this, h, T, BigInt(0), BigInt("0xffffffffffffffff"));
      }), y.prototype.writeBigUInt64BE = Ve(function(h, T = 0) {
        return Ee(this, h, T, BigInt(0), BigInt("0xffffffffffffffff"));
      }), y.prototype.writeIntLE = function(h, T, Y, pe) {
        if (h = +h, T = T >>> 0, !pe) {
          const ye = Math.pow(2, 8 * Y - 1);
          $e(this, h, T, Y, ye - 1, -ye);
        }
        let Te = 0, ne = 1, ae = 0;
        for (this[T] = h & 255; ++Te < Y && (ne *= 256); )
          h < 0 && ae === 0 && this[T + Te - 1] !== 0 && (ae = 1), this[T + Te] = (h / ne >> 0) - ae & 255;
        return T + Y;
      }, y.prototype.writeIntBE = function(h, T, Y, pe) {
        if (h = +h, T = T >>> 0, !pe) {
          const ye = Math.pow(2, 8 * Y - 1);
          $e(this, h, T, Y, ye - 1, -ye);
        }
        let Te = Y - 1, ne = 1, ae = 0;
        for (this[T + Te] = h & 255; --Te >= 0 && (ne *= 256); )
          h < 0 && ae === 0 && this[T + Te + 1] !== 0 && (ae = 1), this[T + Te] = (h / ne >> 0) - ae & 255;
        return T + Y;
      }, y.prototype.writeInt8 = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 1, 127, -128), h < 0 && (h = 255 + h + 1), this[T] = h & 255, T + 1;
      }, y.prototype.writeInt16LE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 2, 32767, -32768), this[T] = h & 255, this[T + 1] = h >>> 8, T + 2;
      }, y.prototype.writeInt16BE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 2, 32767, -32768), this[T] = h >>> 8, this[T + 1] = h & 255, T + 2;
      }, y.prototype.writeInt32LE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 4, 2147483647, -2147483648), this[T] = h & 255, this[T + 1] = h >>> 8, this[T + 2] = h >>> 16, this[T + 3] = h >>> 24, T + 4;
      }, y.prototype.writeInt32BE = function(h, T, Y) {
        return h = +h, T = T >>> 0, Y || $e(this, h, T, 4, 2147483647, -2147483648), h < 0 && (h = 4294967295 + h + 1), this[T] = h >>> 24, this[T + 1] = h >>> 16, this[T + 2] = h >>> 8, this[T + 3] = h & 255, T + 4;
      }, y.prototype.writeBigInt64LE = Ve(function(h, T = 0) {
        return ve(this, h, T, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), y.prototype.writeBigInt64BE = Ve(function(h, T = 0) {
        return Ee(this, h, T, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function je(m, h, T, Y, pe, Te) {
        if (T + Y > m.length) throw new RangeError("Index out of range");
        if (T < 0) throw new RangeError("Index out of range");
      }
      function qe(m, h, T, Y, pe) {
        return h = +h, T = T >>> 0, pe || je(m, h, T, 4), I.write(m, h, T, Y, 23, 4), T + 4;
      }
      y.prototype.writeFloatLE = function(h, T, Y) {
        return qe(this, h, T, !0, Y);
      }, y.prototype.writeFloatBE = function(h, T, Y) {
        return qe(this, h, T, !1, Y);
      };
      function Me(m, h, T, Y, pe) {
        return h = +h, T = T >>> 0, pe || je(m, h, T, 8), I.write(m, h, T, Y, 52, 8), T + 8;
      }
      y.prototype.writeDoubleLE = function(h, T, Y) {
        return Me(this, h, T, !0, Y);
      }, y.prototype.writeDoubleBE = function(h, T, Y) {
        return Me(this, h, T, !1, Y);
      }, y.prototype.copy = function(h, T, Y, pe) {
        if (!y.isBuffer(h)) throw new TypeError("argument should be a Buffer");
        if (Y || (Y = 0), !pe && pe !== 0 && (pe = this.length), T >= h.length && (T = h.length), T || (T = 0), pe > 0 && pe < Y && (pe = Y), pe === Y || h.length === 0 || this.length === 0) return 0;
        if (T < 0)
          throw new RangeError("targetStart out of bounds");
        if (Y < 0 || Y >= this.length) throw new RangeError("Index out of range");
        if (pe < 0) throw new RangeError("sourceEnd out of bounds");
        pe > this.length && (pe = this.length), h.length - T < pe - Y && (pe = h.length - T + Y);
        const Te = pe - Y;
        return this === h && typeof x.prototype.copyWithin == "function" ? this.copyWithin(T, Y, pe) : x.prototype.set.call(
          h,
          this.subarray(Y, pe),
          T
        ), Te;
      }, y.prototype.fill = function(h, T, Y, pe) {
        if (typeof h == "string") {
          if (typeof T == "string" ? (pe = T, T = 0, Y = this.length) : typeof Y == "string" && (pe = Y, Y = this.length), pe !== void 0 && typeof pe != "string")
            throw new TypeError("encoding must be a string");
          if (typeof pe == "string" && !y.isEncoding(pe))
            throw new TypeError("Unknown encoding: " + pe);
          if (h.length === 1) {
            const ne = h.charCodeAt(0);
            (pe === "utf8" && ne < 128 || pe === "latin1") && (h = ne);
          }
        } else typeof h == "number" ? h = h & 255 : typeof h == "boolean" && (h = Number(h));
        if (T < 0 || this.length < T || this.length < Y)
          throw new RangeError("Out of range index");
        if (Y <= T)
          return this;
        T = T >>> 0, Y = Y === void 0 ? this.length : Y >>> 0, h || (h = 0);
        let Te;
        if (typeof h == "number")
          for (Te = T; Te < Y; ++Te)
            this[Te] = h;
        else {
          const ne = y.isBuffer(h) ? h : y.from(h, pe), ae = ne.length;
          if (ae === 0)
            throw new TypeError('The value "' + h + '" is invalid for argument "value"');
          for (Te = 0; Te < Y - T; ++Te)
            this[Te + T] = ne[Te % ae];
        }
        return this;
      };
      const We = {};
      function $(m, h, T) {
        We[m] = class extends T {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: h.apply(this, arguments),
              writable: !0,
              configurable: !0
            }), this.name = `${this.name} [${m}]`, this.stack, delete this.name;
          }
          get code() {
            return m;
          }
          set code(pe) {
            Object.defineProperty(this, "code", {
              configurable: !0,
              enumerable: !0,
              value: pe,
              writable: !0
            });
          }
          toString() {
            return `${this.name} [${m}]: ${this.message}`;
          }
        };
      }
      $(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(m) {
          return m ? `${m} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        },
        RangeError
      ), $(
        "ERR_INVALID_ARG_TYPE",
        function(m, h) {
          return `The "${m}" argument must be of type number. Received type ${typeof h}`;
        },
        TypeError
      ), $(
        "ERR_OUT_OF_RANGE",
        function(m, h, T) {
          let Y = `The value of "${m}" is out of range.`, pe = T;
          return Number.isInteger(T) && Math.abs(T) > 2 ** 32 ? pe = n(String(T)) : typeof T == "bigint" && (pe = String(T), (T > BigInt(2) ** BigInt(32) || T < -(BigInt(2) ** BigInt(32))) && (pe = n(pe)), pe += "n"), Y += ` It must be ${h}. Received ${pe}`, Y;
        },
        RangeError
      );
      function n(m) {
        let h = "", T = m.length;
        const Y = m[0] === "-" ? 1 : 0;
        for (; T >= Y + 4; T -= 3)
          h = `_${m.slice(T - 3, T)}${h}`;
        return `${m.slice(0, T)}${h}`;
      }
      function g(m, h, T) {
        fe(h, "offset"), (m[h] === void 0 || m[h + T] === void 0) && J(h, m.length - (T + 1));
      }
      function U(m, h, T, Y, pe, Te) {
        if (m > T || m < h) {
          const ne = typeof h == "bigint" ? "n" : "";
          let ae;
          throw h === 0 || h === BigInt(0) ? ae = `>= 0${ne} and < 2${ne} ** ${(Te + 1) * 8}${ne}` : ae = `>= -(2${ne} ** ${(Te + 1) * 8 - 1}${ne}) and < 2 ** ${(Te + 1) * 8 - 1}${ne}`, new We.ERR_OUT_OF_RANGE("value", ae, m);
        }
        g(Y, pe, Te);
      }
      function fe(m, h) {
        if (typeof m != "number")
          throw new We.ERR_INVALID_ARG_TYPE(h, "number", m);
      }
      function J(m, h, T) {
        throw Math.floor(m) !== m ? (fe(m, T), new We.ERR_OUT_OF_RANGE("offset", "an integer", m)) : h < 0 ? new We.ERR_BUFFER_OUT_OF_BOUNDS() : new We.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${h}`,
          m
        );
      }
      const de = /[^+/0-9A-Za-z-_]/g;
      function M(m) {
        if (m = m.split("=")[0], m = m.trim().replace(de, ""), m.length < 2) return "";
        for (; m.length % 4 !== 0; )
          m = m + "=";
        return m;
      }
      function Be(m, h) {
        h = h || 1 / 0;
        let T;
        const Y = m.length;
        let pe = null;
        const Te = [];
        for (let ne = 0; ne < Y; ++ne) {
          if (T = m.charCodeAt(ne), T > 55295 && T < 57344) {
            if (!pe) {
              if (T > 56319) {
                (h -= 3) > -1 && Te.push(239, 191, 189);
                continue;
              } else if (ne + 1 === Y) {
                (h -= 3) > -1 && Te.push(239, 191, 189);
                continue;
              }
              pe = T;
              continue;
            }
            if (T < 56320) {
              (h -= 3) > -1 && Te.push(239, 191, 189), pe = T;
              continue;
            }
            T = (pe - 55296 << 10 | T - 56320) + 65536;
          } else pe && (h -= 3) > -1 && Te.push(239, 191, 189);
          if (pe = null, T < 128) {
            if ((h -= 1) < 0) break;
            Te.push(T);
          } else if (T < 2048) {
            if ((h -= 2) < 0) break;
            Te.push(
              T >> 6 | 192,
              T & 63 | 128
            );
          } else if (T < 65536) {
            if ((h -= 3) < 0) break;
            Te.push(
              T >> 12 | 224,
              T >> 6 & 63 | 128,
              T & 63 | 128
            );
          } else if (T < 1114112) {
            if ((h -= 4) < 0) break;
            Te.push(
              T >> 18 | 240,
              T >> 12 & 63 | 128,
              T >> 6 & 63 | 128,
              T & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return Te;
      }
      function ze(m) {
        const h = [];
        for (let T = 0; T < m.length; ++T)
          h.push(m.charCodeAt(T) & 255);
        return h;
      }
      function R(m, h) {
        let T, Y, pe;
        const Te = [];
        for (let ne = 0; ne < m.length && !((h -= 2) < 0); ++ne)
          T = m.charCodeAt(ne), Y = T >> 8, pe = T % 256, Te.push(pe), Te.push(Y);
        return Te;
      }
      function Ie(m) {
        return _.toByteArray(M(m));
      }
      function Ne(m, h, T, Y) {
        let pe;
        for (pe = 0; pe < Y && !(pe + T >= h.length || pe >= m.length); ++pe)
          h[pe + T] = m[pe];
        return pe;
      }
      function V(m, h) {
        return m instanceof h || m != null && m.constructor != null && m.constructor.name != null && m.constructor.name === h.name;
      }
      function me(m) {
        return m !== m;
      }
      const Fe = (function() {
        const m = "0123456789abcdef", h = new Array(256);
        for (let T = 0; T < 16; ++T) {
          const Y = T * 16;
          for (let pe = 0; pe < 16; ++pe)
            h[Y + pe] = m[T] + m[pe];
        }
        return h;
      })();
      function Ve(m) {
        return typeof BigInt > "u" ? G : m;
      }
      function G() {
        throw new Error("BigInt not supported");
      }
    })(e);
    const d = e.Buffer;
    t.Blob = e.Blob, t.BlobOptions = e.BlobOptions, t.Buffer = e.Buffer, t.File = e.File, t.FileOptions = e.FileOptions, t.INSPECT_MAX_BYTES = e.INSPECT_MAX_BYTES, t.SlowBuffer = e.SlowBuffer, t.TranscodeEncoding = e.TranscodeEncoding, t.atob = e.atob, t.btoa = e.btoa, t.constants = e.constants, t.default = d, t.isAscii = e.isAscii, t.isUtf8 = e.isUtf8, t.kMaxLength = e.kMaxLength, t.kStringMaxLength = e.kStringMaxLength, t.resolveObjectURL = e.resolveObjectURL, t.transcode = e.transcode;
  })(on)), on;
}
var jt = { exports: {} }, cs;
function nt() {
  if (cs) return jt.exports;
  cs = 1;
  var t = typeof Reflect == "object" ? Reflect : null, e = t && typeof t.apply == "function" ? t.apply : function(P, D, x) {
    return Function.prototype.apply.call(P, D, x);
  }, l;
  t && typeof t.ownKeys == "function" ? l = t.ownKeys : Object.getOwnPropertySymbols ? l = function(P) {
    return Object.getOwnPropertyNames(P).concat(Object.getOwnPropertySymbols(P));
  } : l = function(P) {
    return Object.getOwnPropertyNames(P);
  };
  function c(I) {
    console && console.warn && console.warn(I);
  }
  var r = Number.isNaN || function(P) {
    return P !== P;
  };
  function i() {
    i.init.call(this);
  }
  jt.exports = i, jt.exports.once = d, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._eventsCount = 0, i.prototype._maxListeners = void 0;
  var p = 10;
  function f(I) {
    if (typeof I != "function")
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof I);
  }
  Object.defineProperty(i, "defaultMaxListeners", {
    enumerable: !0,
    get: function() {
      return p;
    },
    set: function(I) {
      if (typeof I != "number" || I < 0 || r(I))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + I + ".");
      p = I;
    }
  }), i.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, i.prototype.setMaxListeners = function(P) {
    if (typeof P != "number" || P < 0 || r(P))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + P + ".");
    return this._maxListeners = P, this;
  };
  function b(I) {
    return I._maxListeners === void 0 ? i.defaultMaxListeners : I._maxListeners;
  }
  i.prototype.getMaxListeners = function() {
    return b(this);
  }, i.prototype.emit = function(P) {
    for (var D = [], x = 1; x < arguments.length; x++) D.push(arguments[x]);
    var q = P === "error", K = this._events;
    if (K !== void 0)
      q = q && K.error === void 0;
    else if (!q)
      return !1;
    if (q) {
      var L;
      if (D.length > 0 && (L = D[0]), L instanceof Error)
        throw L;
      var z = new Error("Unhandled error." + (L ? " (" + L.message + ")" : ""));
      throw z.context = L, z;
    }
    var y = K[P];
    if (y === void 0)
      return !1;
    if (typeof y == "function")
      e(y, this, D);
    else
      for (var F = y.length, ie = a(y, F), x = 0; x < F; ++x)
        e(ie[x], this, D);
    return !0;
  };
  function A(I, P, D, x) {
    var q, K, L;
    if (f(D), K = I._events, K === void 0 ? (K = I._events = /* @__PURE__ */ Object.create(null), I._eventsCount = 0) : (K.newListener !== void 0 && (I.emit(
      "newListener",
      P,
      D.listener ? D.listener : D
    ), K = I._events), L = K[P]), L === void 0)
      L = K[P] = D, ++I._eventsCount;
    else if (typeof L == "function" ? L = K[P] = x ? [D, L] : [L, D] : x ? L.unshift(D) : L.push(D), q = b(I), q > 0 && L.length > q && !L.warned) {
      L.warned = !0;
      var z = new Error("Possible EventEmitter memory leak detected. " + L.length + " " + String(P) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      z.name = "MaxListenersExceededWarning", z.emitter = I, z.type = P, z.count = L.length, c(z);
    }
    return I;
  }
  i.prototype.addListener = function(P, D) {
    return A(this, P, D, !1);
  }, i.prototype.on = i.prototype.addListener, i.prototype.prependListener = function(P, D) {
    return A(this, P, D, !0);
  };
  function o() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function v(I, P, D) {
    var x = { fired: !1, wrapFn: void 0, target: I, type: P, listener: D }, q = o.bind(x);
    return q.listener = D, x.wrapFn = q, q;
  }
  i.prototype.once = function(P, D) {
    return f(D), this.on(P, v(this, P, D)), this;
  }, i.prototype.prependOnceListener = function(P, D) {
    return f(D), this.prependListener(P, v(this, P, D)), this;
  }, i.prototype.removeListener = function(P, D) {
    var x, q, K, L, z;
    if (f(D), q = this._events, q === void 0)
      return this;
    if (x = q[P], x === void 0)
      return this;
    if (x === D || x.listener === D)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete q[P], q.removeListener && this.emit("removeListener", P, x.listener || D));
    else if (typeof x != "function") {
      for (K = -1, L = x.length - 1; L >= 0; L--)
        if (x[L] === D || x[L].listener === D) {
          z = x[L].listener, K = L;
          break;
        }
      if (K < 0)
        return this;
      K === 0 ? x.shift() : w(x, K), x.length === 1 && (q[P] = x[0]), q.removeListener !== void 0 && this.emit("removeListener", P, z || D);
    }
    return this;
  }, i.prototype.off = i.prototype.removeListener, i.prototype.removeAllListeners = function(P) {
    var D, x, q;
    if (x = this._events, x === void 0)
      return this;
    if (x.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : x[P] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete x[P]), this;
    if (arguments.length === 0) {
      var K = Object.keys(x), L;
      for (q = 0; q < K.length; ++q)
        L = K[q], L !== "removeListener" && this.removeAllListeners(L);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (D = x[P], typeof D == "function")
      this.removeListener(P, D);
    else if (D !== void 0)
      for (q = D.length - 1; q >= 0; q--)
        this.removeListener(P, D[q]);
    return this;
  };
  function S(I, P, D) {
    var x = I._events;
    if (x === void 0)
      return [];
    var q = x[P];
    return q === void 0 ? [] : typeof q == "function" ? D ? [q.listener || q] : [q] : D ? u(q) : a(q, q.length);
  }
  i.prototype.listeners = function(P) {
    return S(this, P, !0);
  }, i.prototype.rawListeners = function(P) {
    return S(this, P, !1);
  }, i.listenerCount = function(I, P) {
    return typeof I.listenerCount == "function" ? I.listenerCount(P) : s.call(I, P);
  }, i.prototype.listenerCount = s;
  function s(I) {
    var P = this._events;
    if (P !== void 0) {
      var D = P[I];
      if (typeof D == "function")
        return 1;
      if (D !== void 0)
        return D.length;
    }
    return 0;
  }
  i.prototype.eventNames = function() {
    return this._eventsCount > 0 ? l(this._events) : [];
  };
  function a(I, P) {
    for (var D = new Array(P), x = 0; x < P; ++x)
      D[x] = I[x];
    return D;
  }
  function w(I, P) {
    for (; P + 1 < I.length; P++)
      I[P] = I[P + 1];
    I.pop();
  }
  function u(I) {
    for (var P = new Array(I.length), D = 0; D < P.length; ++D)
      P[D] = I[D].listener || I[D];
    return P;
  }
  function d(I, P) {
    return new Promise(function(D, x) {
      function q(L) {
        I.removeListener(P, K), x(L);
      }
      function K() {
        typeof I.removeListener == "function" && I.removeListener("error", q), D([].slice.call(arguments));
      }
      _(I, P, K, { once: !0 }), P !== "error" && E(I, q, { once: !0 });
    });
  }
  function E(I, P, D) {
    typeof I.on == "function" && _(I, "error", P, D);
  }
  function _(I, P, D, x) {
    if (typeof I.on == "function")
      x.once ? I.once(P, D) : I.on(P, D);
    else if (typeof I.addEventListener == "function")
      I.addEventListener(P, function q(K) {
        x.once && I.removeEventListener(P, q), D(K);
      });
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof I);
  }
  return jt.exports;
}
var Mt = { exports: {} }, ds;
function it() {
  return ds || (ds = 1, typeof Object.create == "function" ? Mt.exports = function(e, l) {
    l && (e.super_ = l, e.prototype = Object.create(l.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : Mt.exports = function(e, l) {
    if (l) {
      e.super_ = l;
      var c = function() {
      };
      c.prototype = l.prototype, e.prototype = new c(), e.prototype.constructor = e;
    }
  }), Mt.exports;
}
var sn, hs;
function fc() {
  return hs || (hs = 1, sn = nt().EventEmitter), sn;
}
var fn = {}, ln = {}, un, ps;
function qo() {
  return ps || (ps = 1, un = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, l = Symbol("test"), c = Object(l);
    if (typeof l == "string" || Object.prototype.toString.call(l) !== "[object Symbol]" || Object.prototype.toString.call(c) !== "[object Symbol]")
      return !1;
    var r = 42;
    e[l] = r;
    for (var i in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var p = Object.getOwnPropertySymbols(e);
    if (p.length !== 1 || p[0] !== l || !Object.prototype.propertyIsEnumerable.call(e, l))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var f = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, l)
      );
      if (f.value !== r || f.enumerable !== !0)
        return !1;
    }
    return !0;
  }), un;
}
var cn, ys;
function Wt() {
  if (ys) return cn;
  ys = 1;
  var t = qo();
  return cn = function() {
    return t() && !!Symbol.toStringTag;
  }, cn;
}
var dn, vs;
function $o() {
  return vs || (vs = 1, dn = Object), dn;
}
var hn, gs;
function Bd() {
  return gs || (gs = 1, hn = Error), hn;
}
var pn, ms;
function Ld() {
  return ms || (ms = 1, pn = EvalError), pn;
}
var yn, bs;
function Cd() {
  return bs || (bs = 1, yn = RangeError), yn;
}
var vn, ws;
function jd() {
  return ws || (ws = 1, vn = ReferenceError), vn;
}
var gn, _s;
function lc() {
  return _s || (_s = 1, gn = SyntaxError), gn;
}
var mn, Es;
function Et() {
  return Es || (Es = 1, mn = TypeError), mn;
}
var bn, Ss;
function Md() {
  return Ss || (Ss = 1, bn = URIError), bn;
}
var wn, Rs;
function kd() {
  return Rs || (Rs = 1, wn = Math.abs), wn;
}
var _n, As;
function qd() {
  return As || (As = 1, _n = Math.floor), _n;
}
var En, Ps;
function $d() {
  return Ps || (Ps = 1, En = Math.max), En;
}
var Sn, Ts;
function Ud() {
  return Ts || (Ts = 1, Sn = Math.min), Sn;
}
var Rn, Is;
function zd() {
  return Is || (Is = 1, Rn = Math.pow), Rn;
}
var An, Os;
function Wd() {
  return Os || (Os = 1, An = Math.round), An;
}
var Pn, xs;
function Hd() {
  return xs || (xs = 1, Pn = Number.isNaN || function(e) {
    return e !== e;
  }), Pn;
}
var Tn, Fs;
function Vd() {
  if (Fs) return Tn;
  Fs = 1;
  var t = /* @__PURE__ */ Hd();
  return Tn = function(l) {
    return t(l) || l === 0 ? l : l < 0 ? -1 : 1;
  }, Tn;
}
var In, Ds;
function Gd() {
  return Ds || (Ds = 1, In = Object.getOwnPropertyDescriptor), In;
}
var On, Ns;
function dt() {
  if (Ns) return On;
  Ns = 1;
  var t = /* @__PURE__ */ Gd();
  if (t)
    try {
      t([], "length");
    } catch {
      t = null;
    }
  return On = t, On;
}
var xn, Bs;
function Ht() {
  if (Bs) return xn;
  Bs = 1;
  var t = Object.defineProperty || !1;
  if (t)
    try {
      t({}, "a", { value: 1 });
    } catch {
      t = !1;
    }
  return xn = t, xn;
}
var Fn, Ls;
function Zd() {
  if (Ls) return Fn;
  Ls = 1;
  var t = typeof Symbol < "u" && Symbol, e = qo();
  return Fn = function() {
    return typeof t != "function" || typeof Symbol != "function" || typeof t("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, Fn;
}
var Dn, Cs;
function uc() {
  return Cs || (Cs = 1, Dn = typeof Reflect < "u" && Reflect.getPrototypeOf || null), Dn;
}
var Nn, js;
function cc() {
  if (js) return Nn;
  js = 1;
  var t = /* @__PURE__ */ $o();
  return Nn = t.getPrototypeOf || null, Nn;
}
var Bn, Ms;
function Kd() {
  if (Ms) return Bn;
  Ms = 1;
  var t = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, l = Math.max, c = "[object Function]", r = function(b, A) {
    for (var o = [], v = 0; v < b.length; v += 1)
      o[v] = b[v];
    for (var S = 0; S < A.length; S += 1)
      o[S + b.length] = A[S];
    return o;
  }, i = function(b, A) {
    for (var o = [], v = A, S = 0; v < b.length; v += 1, S += 1)
      o[S] = b[v];
    return o;
  }, p = function(f, b) {
    for (var A = "", o = 0; o < f.length; o += 1)
      A += f[o], o + 1 < f.length && (A += b);
    return A;
  };
  return Bn = function(b) {
    var A = this;
    if (typeof A != "function" || e.apply(A) !== c)
      throw new TypeError(t + A);
    for (var o = i(arguments, 1), v, S = function() {
      if (this instanceof v) {
        var d = A.apply(
          this,
          r(o, arguments)
        );
        return Object(d) === d ? d : this;
      }
      return A.apply(
        b,
        r(o, arguments)
      );
    }, s = l(0, A.length - o.length), a = [], w = 0; w < s; w++)
      a[w] = "$" + w;
    if (v = Function("binder", "return function (" + p(a, ",") + "){ return binder.apply(this,arguments); }")(S), A.prototype) {
      var u = function() {
      };
      u.prototype = A.prototype, v.prototype = new u(), u.prototype = null;
    }
    return v;
  }, Bn;
}
var Ln, ks;
function St() {
  if (ks) return Ln;
  ks = 1;
  var t = Kd();
  return Ln = Function.prototype.bind || t, Ln;
}
var Cn, qs;
function Uo() {
  return qs || (qs = 1, Cn = Function.prototype.call), Cn;
}
var jn, $s;
function zo() {
  return $s || ($s = 1, jn = Function.prototype.apply), jn;
}
var Mn, Us;
function Yd() {
  return Us || (Us = 1, Mn = typeof Reflect < "u" && Reflect && Reflect.apply), Mn;
}
var kn, zs;
function dc() {
  if (zs) return kn;
  zs = 1;
  var t = St(), e = zo(), l = Uo(), c = Yd();
  return kn = c || t.call(l, e), kn;
}
var qn, Ws;
function Wo() {
  if (Ws) return qn;
  Ws = 1;
  var t = St(), e = /* @__PURE__ */ Et(), l = Uo(), c = dc();
  return qn = function(i) {
    if (i.length < 1 || typeof i[0] != "function")
      throw new e("a function is required");
    return c(t, l, i);
  }, qn;
}
var $n, Hs;
function Qd() {
  if (Hs) return $n;
  Hs = 1;
  var t = Wo(), e = /* @__PURE__ */ dt(), l;
  try {
    l = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (p) {
    if (!p || typeof p != "object" || !("code" in p) || p.code !== "ERR_PROTO_ACCESS")
      throw p;
  }
  var c = !!l && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), r = Object, i = r.getPrototypeOf;
  return $n = c && typeof c.get == "function" ? t([c.get]) : typeof i == "function" ? (
    /** @type {import('./get')} */
    function(f) {
      return i(f == null ? f : r(f));
    }
  ) : !1, $n;
}
var Un, Vs;
function Ho() {
  if (Vs) return Un;
  Vs = 1;
  var t = uc(), e = cc(), l = /* @__PURE__ */ Qd();
  return Un = t ? function(r) {
    return t(r);
  } : e ? function(r) {
    if (!r || typeof r != "object" && typeof r != "function")
      throw new TypeError("getProto: not an object");
    return e(r);
  } : l ? function(r) {
    return l(r);
  } : null, Un;
}
var zn, Gs;
function hc() {
  if (Gs) return zn;
  Gs = 1;
  var t = Function.prototype.call, e = Object.prototype.hasOwnProperty, l = St();
  return zn = l.call(t, e), zn;
}
var Wn, Zs;
function Vo() {
  if (Zs) return Wn;
  Zs = 1;
  var t, e = /* @__PURE__ */ $o(), l = /* @__PURE__ */ Bd(), c = /* @__PURE__ */ Ld(), r = /* @__PURE__ */ Cd(), i = /* @__PURE__ */ jd(), p = /* @__PURE__ */ lc(), f = /* @__PURE__ */ Et(), b = /* @__PURE__ */ Md(), A = /* @__PURE__ */ kd(), o = /* @__PURE__ */ qd(), v = /* @__PURE__ */ $d(), S = /* @__PURE__ */ Ud(), s = /* @__PURE__ */ zd(), a = /* @__PURE__ */ Wd(), w = /* @__PURE__ */ Vd(), u = Function, d = function(ee) {
    try {
      return u('"use strict"; return (' + ee + ").constructor;")();
    } catch {
    }
  }, E = /* @__PURE__ */ dt(), _ = /* @__PURE__ */ Ht(), I = function() {
    throw new f();
  }, P = E ? (function() {
    try {
      return arguments.callee, I;
    } catch {
      try {
        return E(arguments, "callee").get;
      } catch {
        return I;
      }
    }
  })() : I, D = Zd()(), x = Ho(), q = cc(), K = uc(), L = zo(), z = Uo(), y = {}, F = typeof Uint8Array > "u" || !x ? t : x(Uint8Array), ie = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
    "%ArrayIteratorPrototype%": D && x ? x([][Symbol.iterator]()) : t,
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
    "%Error%": l,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": c,
    "%Float16Array%": typeof Float16Array > "u" ? t : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
    "%Function%": u,
    "%GeneratorFunction%": y,
    "%Int8Array%": typeof Int8Array > "u" ? t : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? t : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? t : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": D && x ? x(x([][Symbol.iterator]())) : t,
    "%JSON%": typeof JSON == "object" ? JSON : t,
    "%Map%": typeof Map > "u" ? t : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !D || !x ? t : x((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": E,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? t : Promise,
    "%Proxy%": typeof Proxy > "u" ? t : Proxy,
    "%RangeError%": r,
    "%ReferenceError%": i,
    "%Reflect%": typeof Reflect > "u" ? t : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? t : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !D || !x ? t : x((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? t : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": D && x ? x(""[Symbol.iterator]()) : t,
    "%Symbol%": D ? Symbol : t,
    "%SyntaxError%": p,
    "%ThrowTypeError%": P,
    "%TypedArray%": F,
    "%TypeError%": f,
    "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
    "%URIError%": b,
    "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet,
    "%Function.prototype.call%": z,
    "%Function.prototype.apply%": L,
    "%Object.defineProperty%": _,
    "%Object.getPrototypeOf%": q,
    "%Math.abs%": A,
    "%Math.floor%": o,
    "%Math.max%": v,
    "%Math.min%": S,
    "%Math.pow%": s,
    "%Math.round%": a,
    "%Math.sign%": w,
    "%Reflect.getPrototypeOf%": K
  };
  if (x)
    try {
      null.error;
    } catch (ee) {
      var ce = x(x(ee));
      ie["%Error.prototype%"] = ce;
    }
  var _e = function ee(te) {
    var N;
    if (te === "%AsyncFunction%")
      N = d("async function () {}");
    else if (te === "%GeneratorFunction%")
      N = d("function* () {}");
    else if (te === "%AsyncGeneratorFunction%")
      N = d("async function* () {}");
    else if (te === "%AsyncGenerator%") {
      var j = ee("%AsyncGeneratorFunction%");
      j && (N = j.prototype);
    } else if (te === "%AsyncIteratorPrototype%") {
      var W = ee("%AsyncGenerator%");
      W && x && (N = x(W.prototype));
    }
    return ie[te] = N, N;
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
  }, ue = St(), le = /* @__PURE__ */ hc(), k = ue.call(z, Array.prototype.concat), he = ue.call(L, Array.prototype.splice), X = ue.call(z, String.prototype.replace), Q = ue.call(z, String.prototype.slice), H = ue.call(z, RegExp.prototype.exec), se = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, O = /\\(\\)?/g, B = function(te) {
    var N = Q(te, 0, 1), j = Q(te, -1);
    if (N === "%" && j !== "%")
      throw new p("invalid intrinsic syntax, expected closing `%`");
    if (j === "%" && N !== "%")
      throw new p("invalid intrinsic syntax, expected opening `%`");
    var W = [];
    return X(te, se, function(oe, we, Se, Re) {
      W[W.length] = Se ? X(Re, O, "$1") : we || oe;
    }), W;
  }, C = function(te, N) {
    var j = te, W;
    if (le(be, j) && (W = be[j], j = "%" + W[0] + "%"), le(ie, j)) {
      var oe = ie[j];
      if (oe === y && (oe = _e(j)), typeof oe > "u" && !N)
        throw new f("intrinsic " + te + " exists, but is not available. Please file an issue!");
      return {
        alias: W,
        name: j,
        value: oe
      };
    }
    throw new p("intrinsic " + te + " does not exist!");
  };
  return Wn = function(te, N) {
    if (typeof te != "string" || te.length === 0)
      throw new f("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof N != "boolean")
      throw new f('"allowMissing" argument must be a boolean');
    if (H(/^%?[^%]*%?$/, te) === null)
      throw new p("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var j = B(te), W = j.length > 0 ? j[0] : "", oe = C("%" + W + "%", N), we = oe.name, Se = oe.value, Re = !1, Oe = oe.alias;
    Oe && (W = Oe[0], he(j, k([0, 1], Oe)));
    for (var re = 1, De = !0; re < j.length; re += 1) {
      var Le = j[re], Pe = Q(Le, 0, 1), $e = Q(Le, -1);
      if ((Pe === '"' || Pe === "'" || Pe === "`" || $e === '"' || $e === "'" || $e === "`") && Pe !== $e)
        throw new p("property names with quotes must have matching quotes");
      if ((Le === "constructor" || !De) && (Re = !0), W += "." + Le, we = "%" + W + "%", le(ie, we))
        Se = ie[we];
      else if (Se != null) {
        if (!(Le in Se)) {
          if (!N)
            throw new f("base intrinsic for " + te + " exists, but the property is not available.");
          return;
        }
        if (E && re + 1 >= j.length) {
          var ve = E(Se, Le);
          De = !!ve, De && "get" in ve && !("originalValue" in ve.get) ? Se = ve.get : Se = Se[Le];
        } else
          De = le(Se, Le), Se = Se[Le];
        De && !Re && (ie[we] = Se);
      }
    }
    return Se;
  }, Wn;
}
var Hn, Ks;
function ht() {
  if (Ks) return Hn;
  Ks = 1;
  var t = /* @__PURE__ */ Vo(), e = Wo(), l = e([t("%String.prototype.indexOf%")]);
  return Hn = function(r, i) {
    var p = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      t(r, !!i)
    );
    return typeof p == "function" && l(r, ".prototype.") > -1 ? e(
      /** @type {const} */
      [p]
    ) : p;
  }, Hn;
}
var Vn, Ys;
function Jd() {
  if (Ys) return Vn;
  Ys = 1;
  var t = Wt()(), e = /* @__PURE__ */ ht(), l = e("Object.prototype.toString"), c = function(f) {
    return t && f && typeof f == "object" && Symbol.toStringTag in f ? !1 : l(f) === "[object Arguments]";
  }, r = function(f) {
    return c(f) ? !0 : f !== null && typeof f == "object" && "length" in f && typeof f.length == "number" && f.length >= 0 && l(f) !== "[object Array]" && "callee" in f && l(f.callee) === "[object Function]";
  }, i = (function() {
    return c(arguments);
  })();
  return c.isLegacyArguments = r, Vn = i ? c : r, Vn;
}
var Gn, Qs;
function Xd() {
  if (Qs) return Gn;
  Qs = 1;
  var t = /* @__PURE__ */ ht(), e = Wt()(), l = /* @__PURE__ */ hc(), c = /* @__PURE__ */ dt(), r;
  if (e) {
    var i = t("RegExp.prototype.exec"), p = {}, f = function() {
      throw p;
    }, b = {
      toString: f,
      valueOf: f
    };
    typeof Symbol.toPrimitive == "symbol" && (b[Symbol.toPrimitive] = f), r = function(S) {
      if (!S || typeof S != "object")
        return !1;
      var s = (
        /** @type {NonNullable<typeof gOPD>} */
        c(
          /** @type {{ lastIndex?: unknown }} */
          S,
          "lastIndex"
        )
      ), a = s && l(s, "value");
      if (!a)
        return !1;
      try {
        i(
          S,
          /** @type {string} */
          /** @type {unknown} */
          b
        );
      } catch (w) {
        return w === p;
      }
    };
  } else {
    var A = t("Object.prototype.toString"), o = "[object RegExp]";
    r = function(S) {
      return !S || typeof S != "object" && typeof S != "function" ? !1 : A(S) === o;
    };
  }
  return Gn = r, Gn;
}
var Zn, Js;
function eh() {
  if (Js) return Zn;
  Js = 1;
  var t = /* @__PURE__ */ ht(), e = Xd(), l = t("RegExp.prototype.exec"), c = /* @__PURE__ */ Et();
  return Zn = function(i) {
    if (!e(i))
      throw new c("`regex` must be a RegExp");
    return function(f) {
      return l(i, f) !== null;
    };
  }, Zn;
}
var Kn, Xs;
function rh() {
  if (Xs) return Kn;
  Xs = 1;
  const t = (
    /** @type {GeneratorFunctionConstructor} */
    (function* () {
    }).constructor
  );
  return Kn = () => t, Kn;
}
var Yn, ef;
function th() {
  if (ef) return Yn;
  ef = 1;
  var t = /* @__PURE__ */ ht(), e = /* @__PURE__ */ eh(), l = e(/^\s*(?:function)?\*/), c = Wt()(), r = Ho(), i = t("Object.prototype.toString"), p = t("Function.prototype.toString"), f = /* @__PURE__ */ rh();
  return Yn = function(A) {
    if (typeof A != "function")
      return !1;
    if (l(p(A)))
      return !0;
    if (!c) {
      var o = i(A);
      return o === "[object GeneratorFunction]";
    }
    if (!r)
      return !1;
    var v = f();
    return v && r(A) === v.prototype;
  }, Yn;
}
var Qn, rf;
function nh() {
  if (rf) return Qn;
  rf = 1;
  var t = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, l, c;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      l = Object.defineProperty({}, "length", {
        get: function() {
          throw c;
        }
      }), c = {}, e(function() {
        throw 42;
      }, null, l);
    } catch (E) {
      E !== c && (e = null);
    }
  else
    e = null;
  var r = /^\s*class\b/, i = function(_) {
    try {
      var I = t.call(_);
      return r.test(I);
    } catch {
      return !1;
    }
  }, p = function(_) {
    try {
      return i(_) ? !1 : (t.call(_), !0);
    } catch {
      return !1;
    }
  }, f = Object.prototype.toString, b = "[object Object]", A = "[object Function]", o = "[object GeneratorFunction]", v = "[object HTMLAllCollection]", S = "[object HTML document.all class]", s = "[object HTMLCollection]", a = typeof Symbol == "function" && !!Symbol.toStringTag, w = !(0 in [,]), u = function() {
    return !1;
  };
  if (typeof document == "object") {
    var d = document.all;
    f.call(d) === f.call(document.all) && (u = function(_) {
      if ((w || !_) && (typeof _ > "u" || typeof _ == "object"))
        try {
          var I = f.call(_);
          return (I === v || I === S || I === s || I === b) && _("") == null;
        } catch {
        }
      return !1;
    });
  }
  return Qn = e ? function(_) {
    if (u(_))
      return !0;
    if (!_ || typeof _ != "function" && typeof _ != "object")
      return !1;
    try {
      e(_, null, l);
    } catch (I) {
      if (I !== c)
        return !1;
    }
    return !i(_) && p(_);
  } : function(_) {
    if (u(_))
      return !0;
    if (!_ || typeof _ != "function" && typeof _ != "object")
      return !1;
    if (a)
      return p(_);
    if (i(_))
      return !1;
    var I = f.call(_);
    return I !== A && I !== o && !/^\[object HTML/.test(I) ? !1 : p(_);
  }, Qn;
}
var Jn, tf;
function ih() {
  if (tf) return Jn;
  tf = 1;
  var t = nh(), e = Object.prototype.toString, l = Object.prototype.hasOwnProperty, c = function(b, A, o) {
    for (var v = 0, S = b.length; v < S; v++)
      l.call(b, v) && (o == null ? A(b[v], v, b) : A.call(o, b[v], v, b));
  }, r = function(b, A, o) {
    for (var v = 0, S = b.length; v < S; v++)
      o == null ? A(b.charAt(v), v, b) : A.call(o, b.charAt(v), v, b);
  }, i = function(b, A, o) {
    for (var v in b)
      l.call(b, v) && (o == null ? A(b[v], v, b) : A.call(o, b[v], v, b));
  };
  function p(f) {
    return e.call(f) === "[object Array]";
  }
  return Jn = function(b, A, o) {
    if (!t(A))
      throw new TypeError("iterator must be a function");
    var v;
    arguments.length >= 3 && (v = o), p(b) ? c(b, A, v) : typeof b == "string" ? r(b, A, v) : i(b, A, v);
  }, Jn;
}
var Xn, nf;
function ah() {
  return nf || (nf = 1, Xn = [
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
  ]), Xn;
}
var ei, af;
function oh() {
  if (af) return ei;
  af = 1;
  var t = /* @__PURE__ */ ah(), e = typeof globalThis > "u" ? Tr : globalThis;
  return ei = function() {
    for (var c = [], r = 0; r < t.length; r++)
      typeof e[t[r]] == "function" && (c[c.length] = t[r]);
    return c;
  }, ei;
}
var ri = { exports: {} }, ti, of;
function pc() {
  if (of) return ti;
  of = 1;
  var t = /* @__PURE__ */ Ht(), e = /* @__PURE__ */ lc(), l = /* @__PURE__ */ Et(), c = /* @__PURE__ */ dt();
  return ti = function(i, p, f) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new l("`obj` must be an object or a function`");
    if (typeof p != "string" && typeof p != "symbol")
      throw new l("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new l("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new l("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new l("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new l("`loose`, if provided, must be a boolean");
    var b = arguments.length > 3 ? arguments[3] : null, A = arguments.length > 4 ? arguments[4] : null, o = arguments.length > 5 ? arguments[5] : null, v = arguments.length > 6 ? arguments[6] : !1, S = !!c && c(i, p);
    if (t)
      t(i, p, {
        configurable: o === null && S ? S.configurable : !o,
        enumerable: b === null && S ? S.enumerable : !b,
        value: f,
        writable: A === null && S ? S.writable : !A
      });
    else if (v || !b && !A && !o)
      i[p] = f;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, ti;
}
var ni, sf;
function yc() {
  if (sf) return ni;
  sf = 1;
  var t = /* @__PURE__ */ Ht(), e = function() {
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
  }, ni = e, ni;
}
var ii, ff;
function sh() {
  if (ff) return ii;
  ff = 1;
  var t = /* @__PURE__ */ Vo(), e = /* @__PURE__ */ pc(), l = /* @__PURE__ */ yc()(), c = /* @__PURE__ */ dt(), r = /* @__PURE__ */ Et(), i = t("%Math.floor%");
  return ii = function(f, b) {
    if (typeof f != "function")
      throw new r("`fn` is not a function");
    if (typeof b != "number" || b < 0 || b > 4294967295 || i(b) !== b)
      throw new r("`length` must be a positive 32-bit integer");
    var A = arguments.length > 2 && !!arguments[2], o = !0, v = !0;
    if ("length" in f && c) {
      var S = c(f, "length");
      S && !S.configurable && (o = !1), S && !S.writable && (v = !1);
    }
    return (o || v || !A) && (l ? e(
      /** @type {Parameters<define>[0]} */
      f,
      "length",
      b,
      !0,
      !0
    ) : e(
      /** @type {Parameters<define>[0]} */
      f,
      "length",
      b
    )), f;
  }, ii;
}
var ai, lf;
function fh() {
  if (lf) return ai;
  lf = 1;
  var t = St(), e = zo(), l = dc();
  return ai = function() {
    return l(t, e, arguments);
  }, ai;
}
var uf;
function Vt() {
  return uf || (uf = 1, (function(t) {
    var e = /* @__PURE__ */ sh(), l = /* @__PURE__ */ Ht(), c = Wo(), r = fh();
    t.exports = function(p) {
      var f = c(arguments), b = p.length - (arguments.length - 1);
      return e(
        f,
        1 + (b > 0 ? b : 0),
        !0
      );
    }, l ? l(t.exports, "apply", { value: r }) : t.exports.apply = r;
  })(ri)), ri.exports;
}
var oi, cf;
function vc() {
  if (cf) return oi;
  cf = 1;
  var t = ih(), e = /* @__PURE__ */ oh(), l = Vt(), c = /* @__PURE__ */ ht(), r = /* @__PURE__ */ dt(), i = Ho(), p = c("Object.prototype.toString"), f = Wt()(), b = typeof globalThis > "u" ? Tr : globalThis, A = e(), o = c("String.prototype.slice"), v = c("Array.prototype.indexOf", !0) || function(u, d) {
    for (var E = 0; E < u.length; E += 1)
      if (u[E] === d)
        return E;
    return -1;
  }, S = { __proto__: null };
  f && r && i ? t(A, function(w) {
    var u = new b[w]();
    if (Symbol.toStringTag in u && i) {
      var d = i(u), E = r(d, Symbol.toStringTag);
      if (!E && d) {
        var _ = i(d);
        E = r(_, Symbol.toStringTag);
      }
      if (E && E.get) {
        var I = l(E.get);
        S[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + w
        ] = I;
      }
    }
  }) : t(A, function(w) {
    var u = new b[w](), d = u.slice || u.set;
    if (d) {
      var E = (
        /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        l(d)
      );
      S[
        /** @type {`$${import('.').TypedArrayName}`} */
        "$" + w
      ] = E;
    }
  });
  var s = function(u) {
    var d = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      S,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(E, _) {
        if (!d)
          try {
            "$" + E(u) === _ && (d = /** @type {import('.').TypedArrayName} */
            o(_, 1));
          } catch {
          }
      }
    ), d;
  }, a = function(u) {
    var d = !1;
    return t(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      S,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(E, _) {
        if (!d)
          try {
            E(u), d = /** @type {import('.').TypedArrayName} */
            o(_, 1);
          } catch {
          }
      }
    ), d;
  };
  return oi = function(u) {
    if (!u || typeof u != "object")
      return !1;
    if (!f) {
      var d = o(p(u), 8, -1);
      return v(A, d) > -1 ? d : d !== "Object" ? !1 : a(u);
    }
    return r ? s(u) : null;
  }, oi;
}
var si, df;
function lh() {
  if (df) return si;
  df = 1;
  var t = /* @__PURE__ */ vc();
  return si = function(l) {
    return !!t(l);
  }, si;
}
var hf;
function uh() {
  return hf || (hf = 1, (function(t) {
    var e = /* @__PURE__ */ Jd(), l = th(), c = /* @__PURE__ */ vc(), r = /* @__PURE__ */ lh();
    function i(re) {
      return re.call.bind(re);
    }
    var p = typeof BigInt < "u", f = typeof Symbol < "u", b = i(Object.prototype.toString), A = i(Number.prototype.valueOf), o = i(String.prototype.valueOf), v = i(Boolean.prototype.valueOf);
    if (p)
      var S = i(BigInt.prototype.valueOf);
    if (f)
      var s = i(Symbol.prototype.valueOf);
    function a(re, De) {
      if (typeof re != "object")
        return !1;
      try {
        return De(re), !0;
      } catch {
        return !1;
      }
    }
    t.isArgumentsObject = e, t.isGeneratorFunction = l, t.isTypedArray = r;
    function w(re) {
      return typeof Promise < "u" && re instanceof Promise || re !== null && typeof re == "object" && typeof re.then == "function" && typeof re.catch == "function";
    }
    t.isPromise = w;
    function u(re) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(re) : r(re) || Q(re);
    }
    t.isArrayBufferView = u;
    function d(re) {
      return c(re) === "Uint8Array";
    }
    t.isUint8Array = d;
    function E(re) {
      return c(re) === "Uint8ClampedArray";
    }
    t.isUint8ClampedArray = E;
    function _(re) {
      return c(re) === "Uint16Array";
    }
    t.isUint16Array = _;
    function I(re) {
      return c(re) === "Uint32Array";
    }
    t.isUint32Array = I;
    function P(re) {
      return c(re) === "Int8Array";
    }
    t.isInt8Array = P;
    function D(re) {
      return c(re) === "Int16Array";
    }
    t.isInt16Array = D;
    function x(re) {
      return c(re) === "Int32Array";
    }
    t.isInt32Array = x;
    function q(re) {
      return c(re) === "Float32Array";
    }
    t.isFloat32Array = q;
    function K(re) {
      return c(re) === "Float64Array";
    }
    t.isFloat64Array = K;
    function L(re) {
      return c(re) === "BigInt64Array";
    }
    t.isBigInt64Array = L;
    function z(re) {
      return c(re) === "BigUint64Array";
    }
    t.isBigUint64Array = z;
    function y(re) {
      return b(re) === "[object Map]";
    }
    y.working = typeof Map < "u" && y(/* @__PURE__ */ new Map());
    function F(re) {
      return typeof Map > "u" ? !1 : y.working ? y(re) : re instanceof Map;
    }
    t.isMap = F;
    function ie(re) {
      return b(re) === "[object Set]";
    }
    ie.working = typeof Set < "u" && ie(/* @__PURE__ */ new Set());
    function ce(re) {
      return typeof Set > "u" ? !1 : ie.working ? ie(re) : re instanceof Set;
    }
    t.isSet = ce;
    function _e(re) {
      return b(re) === "[object WeakMap]";
    }
    _e.working = typeof WeakMap < "u" && _e(/* @__PURE__ */ new WeakMap());
    function be(re) {
      return typeof WeakMap > "u" ? !1 : _e.working ? _e(re) : re instanceof WeakMap;
    }
    t.isWeakMap = be;
    function ue(re) {
      return b(re) === "[object WeakSet]";
    }
    ue.working = typeof WeakSet < "u" && ue(/* @__PURE__ */ new WeakSet());
    function le(re) {
      return ue(re);
    }
    t.isWeakSet = le;
    function k(re) {
      return b(re) === "[object ArrayBuffer]";
    }
    k.working = typeof ArrayBuffer < "u" && k(new ArrayBuffer());
    function he(re) {
      return typeof ArrayBuffer > "u" ? !1 : k.working ? k(re) : re instanceof ArrayBuffer;
    }
    t.isArrayBuffer = he;
    function X(re) {
      return b(re) === "[object DataView]";
    }
    X.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && X(new DataView(new ArrayBuffer(1), 0, 1));
    function Q(re) {
      return typeof DataView > "u" ? !1 : X.working ? X(re) : re instanceof DataView;
    }
    t.isDataView = Q;
    var H = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function se(re) {
      return b(re) === "[object SharedArrayBuffer]";
    }
    function O(re) {
      return typeof H > "u" ? !1 : (typeof se.working > "u" && (se.working = se(new H())), se.working ? se(re) : re instanceof H);
    }
    t.isSharedArrayBuffer = O;
    function B(re) {
      return b(re) === "[object AsyncFunction]";
    }
    t.isAsyncFunction = B;
    function C(re) {
      return b(re) === "[object Map Iterator]";
    }
    t.isMapIterator = C;
    function ee(re) {
      return b(re) === "[object Set Iterator]";
    }
    t.isSetIterator = ee;
    function te(re) {
      return b(re) === "[object Generator]";
    }
    t.isGeneratorObject = te;
    function N(re) {
      return b(re) === "[object WebAssembly.Module]";
    }
    t.isWebAssemblyCompiledModule = N;
    function j(re) {
      return a(re, A);
    }
    t.isNumberObject = j;
    function W(re) {
      return a(re, o);
    }
    t.isStringObject = W;
    function oe(re) {
      return a(re, v);
    }
    t.isBooleanObject = oe;
    function we(re) {
      return p && a(re, S);
    }
    t.isBigIntObject = we;
    function Se(re) {
      return f && a(re, s);
    }
    t.isSymbolObject = Se;
    function Re(re) {
      return j(re) || W(re) || oe(re) || we(re) || Se(re);
    }
    t.isBoxedPrimitive = Re;
    function Oe(re) {
      return typeof Uint8Array < "u" && (he(re) || O(re));
    }
    t.isAnyArrayBuffer = Oe, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(re) {
      Object.defineProperty(t, re, {
        enumerable: !1,
        value: function() {
          throw new Error(re + " is not supported in userland");
        }
      });
    });
  })(ln)), ln;
}
var fi, pf;
function ch() {
  return pf || (pf = 1, fi = function(e) {
    return e && typeof e == "object" && typeof e.copy == "function" && typeof e.fill == "function" && typeof e.readUInt8 == "function";
  }), fi;
}
var yf;
function Yr() {
  return yf || (yf = 1, (function(t) {
    var e = Object.getOwnPropertyDescriptors || function(Q) {
      for (var H = Object.keys(Q), se = {}, O = 0; O < H.length; O++)
        se[H[O]] = Object.getOwnPropertyDescriptor(Q, H[O]);
      return se;
    }, l = /%[sdj%]/g;
    t.format = function(X) {
      if (!P(X)) {
        for (var Q = [], H = 0; H < arguments.length; H++)
          Q.push(p(arguments[H]));
        return Q.join(" ");
      }
      for (var H = 1, se = arguments, O = se.length, B = String(X).replace(l, function(ee) {
        if (ee === "%%") return "%";
        if (H >= O) return ee;
        switch (ee) {
          case "%s":
            return String(se[H++]);
          case "%d":
            return Number(se[H++]);
          case "%j":
            try {
              return JSON.stringify(se[H++]);
            } catch {
              return "[Circular]";
            }
          default:
            return ee;
        }
      }), C = se[H]; H < O; C = se[++H])
        E(C) || !K(C) ? B += " " + C : B += " " + p(C);
      return B;
    }, t.deprecate = function(X, Q) {
      if (typeof Ke < "u" && Ke.noDeprecation === !0)
        return X;
      if (typeof Ke > "u")
        return function() {
          return t.deprecate(X, Q).apply(this, arguments);
        };
      var H = !1;
      function se() {
        if (!H) {
          if (Ke.throwDeprecation)
            throw new Error(Q);
          Ke.traceDeprecation ? console.trace(Q) : console.error(Q), H = !0;
        }
        return X.apply(this, arguments);
      }
      return se;
    };
    var c = {}, r = /^$/;
    if (Ke.env.NODE_DEBUG) {
      var i = Ke.env.NODE_DEBUG;
      i = i.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), r = new RegExp("^" + i + "$", "i");
    }
    t.debuglog = function(X) {
      if (X = X.toUpperCase(), !c[X])
        if (r.test(X)) {
          var Q = Ke.pid;
          c[X] = function() {
            var H = t.format.apply(t, arguments);
            console.error("%s %d: %s", X, Q, H);
          };
        } else
          c[X] = function() {
          };
      return c[X];
    };
    function p(X, Q) {
      var H = {
        seen: [],
        stylize: b
      };
      return arguments.length >= 3 && (H.depth = arguments[2]), arguments.length >= 4 && (H.colors = arguments[3]), d(Q) ? H.showHidden = Q : Q && t._extend(H, Q), x(H.showHidden) && (H.showHidden = !1), x(H.depth) && (H.depth = 2), x(H.colors) && (H.colors = !1), x(H.customInspect) && (H.customInspect = !0), H.colors && (H.stylize = f), o(H, X, H.depth);
    }
    t.inspect = p, p.colors = {
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
    }, p.styles = {
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
    function f(X, Q) {
      var H = p.styles[Q];
      return H ? "\x1B[" + p.colors[H][0] + "m" + X + "\x1B[" + p.colors[H][1] + "m" : X;
    }
    function b(X, Q) {
      return X;
    }
    function A(X) {
      var Q = {};
      return X.forEach(function(H, se) {
        Q[H] = !0;
      }), Q;
    }
    function o(X, Q, H) {
      if (X.customInspect && Q && y(Q.inspect) && // Filter out the util module, it's inspect function is special
      Q.inspect !== t.inspect && // Also filter out any prototype objects using the circular check.
      !(Q.constructor && Q.constructor.prototype === Q)) {
        var se = Q.inspect(H, X);
        return P(se) || (se = o(X, se, H)), se;
      }
      var O = v(X, Q);
      if (O)
        return O;
      var B = Object.keys(Q), C = A(B);
      if (X.showHidden && (B = Object.getOwnPropertyNames(Q)), z(Q) && (B.indexOf("message") >= 0 || B.indexOf("description") >= 0))
        return S(Q);
      if (B.length === 0) {
        if (y(Q)) {
          var ee = Q.name ? ": " + Q.name : "";
          return X.stylize("[Function" + ee + "]", "special");
        }
        if (q(Q))
          return X.stylize(RegExp.prototype.toString.call(Q), "regexp");
        if (L(Q))
          return X.stylize(Date.prototype.toString.call(Q), "date");
        if (z(Q))
          return S(Q);
      }
      var te = "", N = !1, j = ["{", "}"];
      if (u(Q) && (N = !0, j = ["[", "]"]), y(Q)) {
        var W = Q.name ? ": " + Q.name : "";
        te = " [Function" + W + "]";
      }
      if (q(Q) && (te = " " + RegExp.prototype.toString.call(Q)), L(Q) && (te = " " + Date.prototype.toUTCString.call(Q)), z(Q) && (te = " " + S(Q)), B.length === 0 && (!N || Q.length == 0))
        return j[0] + te + j[1];
      if (H < 0)
        return q(Q) ? X.stylize(RegExp.prototype.toString.call(Q), "regexp") : X.stylize("[Object]", "special");
      X.seen.push(Q);
      var oe;
      return N ? oe = s(X, Q, H, C, B) : oe = B.map(function(we) {
        return a(X, Q, H, C, we, N);
      }), X.seen.pop(), w(oe, te, j);
    }
    function v(X, Q) {
      if (x(Q))
        return X.stylize("undefined", "undefined");
      if (P(Q)) {
        var H = "'" + JSON.stringify(Q).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return X.stylize(H, "string");
      }
      if (I(Q))
        return X.stylize("" + Q, "number");
      if (d(Q))
        return X.stylize("" + Q, "boolean");
      if (E(Q))
        return X.stylize("null", "null");
    }
    function S(X) {
      return "[" + Error.prototype.toString.call(X) + "]";
    }
    function s(X, Q, H, se, O) {
      for (var B = [], C = 0, ee = Q.length; C < ee; ++C)
        ue(Q, String(C)) ? B.push(a(
          X,
          Q,
          H,
          se,
          String(C),
          !0
        )) : B.push("");
      return O.forEach(function(te) {
        te.match(/^\d+$/) || B.push(a(
          X,
          Q,
          H,
          se,
          te,
          !0
        ));
      }), B;
    }
    function a(X, Q, H, se, O, B) {
      var C, ee, te;
      if (te = Object.getOwnPropertyDescriptor(Q, O) || { value: Q[O] }, te.get ? te.set ? ee = X.stylize("[Getter/Setter]", "special") : ee = X.stylize("[Getter]", "special") : te.set && (ee = X.stylize("[Setter]", "special")), ue(se, O) || (C = "[" + O + "]"), ee || (X.seen.indexOf(te.value) < 0 ? (E(H) ? ee = o(X, te.value, null) : ee = o(X, te.value, H - 1), ee.indexOf(`
`) > -1 && (B ? ee = ee.split(`
`).map(function(N) {
        return "  " + N;
      }).join(`
`).slice(2) : ee = `
` + ee.split(`
`).map(function(N) {
        return "   " + N;
      }).join(`
`))) : ee = X.stylize("[Circular]", "special")), x(C)) {
        if (B && O.match(/^\d+$/))
          return ee;
        C = JSON.stringify("" + O), C.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (C = C.slice(1, -1), C = X.stylize(C, "name")) : (C = C.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), C = X.stylize(C, "string"));
      }
      return C + ": " + ee;
    }
    function w(X, Q, H) {
      var se = X.reduce(function(O, B) {
        return B.indexOf(`
`) >= 0, O + B.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return se > 60 ? H[0] + (Q === "" ? "" : Q + `
 `) + " " + X.join(`,
  `) + " " + H[1] : H[0] + Q + " " + X.join(", ") + " " + H[1];
    }
    t.types = uh();
    function u(X) {
      return Array.isArray(X);
    }
    t.isArray = u;
    function d(X) {
      return typeof X == "boolean";
    }
    t.isBoolean = d;
    function E(X) {
      return X === null;
    }
    t.isNull = E;
    function _(X) {
      return X == null;
    }
    t.isNullOrUndefined = _;
    function I(X) {
      return typeof X == "number";
    }
    t.isNumber = I;
    function P(X) {
      return typeof X == "string";
    }
    t.isString = P;
    function D(X) {
      return typeof X == "symbol";
    }
    t.isSymbol = D;
    function x(X) {
      return X === void 0;
    }
    t.isUndefined = x;
    function q(X) {
      return K(X) && ie(X) === "[object RegExp]";
    }
    t.isRegExp = q, t.types.isRegExp = q;
    function K(X) {
      return typeof X == "object" && X !== null;
    }
    t.isObject = K;
    function L(X) {
      return K(X) && ie(X) === "[object Date]";
    }
    t.isDate = L, t.types.isDate = L;
    function z(X) {
      return K(X) && (ie(X) === "[object Error]" || X instanceof Error);
    }
    t.isError = z, t.types.isNativeError = z;
    function y(X) {
      return typeof X == "function";
    }
    t.isFunction = y;
    function F(X) {
      return X === null || typeof X == "boolean" || typeof X == "number" || typeof X == "string" || typeof X == "symbol" || // ES6 symbol
      typeof X > "u";
    }
    t.isPrimitive = F, t.isBuffer = ch();
    function ie(X) {
      return Object.prototype.toString.call(X);
    }
    function ce(X) {
      return X < 10 ? "0" + X.toString(10) : X.toString(10);
    }
    var _e = [
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
      var X = /* @__PURE__ */ new Date(), Q = [
        ce(X.getHours()),
        ce(X.getMinutes()),
        ce(X.getSeconds())
      ].join(":");
      return [X.getDate(), _e[X.getMonth()], Q].join(" ");
    }
    t.log = function() {
      console.log("%s - %s", be(), t.format.apply(t, arguments));
    }, t.inherits = it(), t._extend = function(X, Q) {
      if (!Q || !K(Q)) return X;
      for (var H = Object.keys(Q), se = H.length; se--; )
        X[H[se]] = Q[H[se]];
      return X;
    };
    function ue(X, Q) {
      return Object.prototype.hasOwnProperty.call(X, Q);
    }
    var le = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    t.promisify = function(Q) {
      if (typeof Q != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (le && Q[le]) {
        var H = Q[le];
        if (typeof H != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(H, le, {
          value: H,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), H;
      }
      function H() {
        for (var se, O, B = new Promise(function(te, N) {
          se = te, O = N;
        }), C = [], ee = 0; ee < arguments.length; ee++)
          C.push(arguments[ee]);
        C.push(function(te, N) {
          te ? O(te) : se(N);
        });
        try {
          Q.apply(this, C);
        } catch (te) {
          O(te);
        }
        return B;
      }
      return Object.setPrototypeOf(H, Object.getPrototypeOf(Q)), le && Object.defineProperty(H, le, {
        value: H,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        H,
        e(Q)
      );
    }, t.promisify.custom = le;
    function k(X, Q) {
      if (!X) {
        var H = new Error("Promise was rejected with a falsy value");
        H.reason = X, X = H;
      }
      return Q(X);
    }
    function he(X) {
      if (typeof X != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function Q() {
        for (var H = [], se = 0; se < arguments.length; se++)
          H.push(arguments[se]);
        var O = H.pop();
        if (typeof O != "function")
          throw new TypeError("The last argument must be of type Function");
        var B = this, C = function() {
          return O.apply(B, arguments);
        };
        X.apply(this, H).then(
          function(ee) {
            Ke.nextTick(C.bind(null, null, ee));
          },
          function(ee) {
            Ke.nextTick(k.bind(null, ee, C));
          }
        );
      }
      return Object.setPrototypeOf(Q, Object.getPrototypeOf(X)), Object.defineProperties(
        Q,
        e(X)
      ), Q;
    }
    t.callbackify = he;
  })(fn)), fn;
}
var li, vf;
function dh() {
  if (vf) return li;
  vf = 1;
  function t(a, w) {
    var u = Object.keys(a);
    if (Object.getOwnPropertySymbols) {
      var d = Object.getOwnPropertySymbols(a);
      w && (d = d.filter(function(E) {
        return Object.getOwnPropertyDescriptor(a, E).enumerable;
      })), u.push.apply(u, d);
    }
    return u;
  }
  function e(a) {
    for (var w = 1; w < arguments.length; w++) {
      var u = arguments[w] != null ? arguments[w] : {};
      w % 2 ? t(Object(u), !0).forEach(function(d) {
        l(a, d, u[d]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(u)) : t(Object(u)).forEach(function(d) {
        Object.defineProperty(a, d, Object.getOwnPropertyDescriptor(u, d));
      });
    }
    return a;
  }
  function l(a, w, u) {
    return w = p(w), w in a ? Object.defineProperty(a, w, { value: u, enumerable: !0, configurable: !0, writable: !0 }) : a[w] = u, a;
  }
  function c(a, w) {
    if (!(a instanceof w))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(a, w) {
    for (var u = 0; u < w.length; u++) {
      var d = w[u];
      d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, p(d.key), d);
    }
  }
  function i(a, w, u) {
    return w && r(a.prototype, w), Object.defineProperty(a, "prototype", { writable: !1 }), a;
  }
  function p(a) {
    var w = f(a, "string");
    return typeof w == "symbol" ? w : String(w);
  }
  function f(a, w) {
    if (typeof a != "object" || a === null) return a;
    var u = a[Symbol.toPrimitive];
    if (u !== void 0) {
      var d = u.call(a, w);
      if (typeof d != "object") return d;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(a);
  }
  var b = wr(), A = b.Buffer, o = Yr(), v = o.inspect, S = v && v.custom || "inspect";
  function s(a, w, u) {
    A.prototype.copy.call(a, w, u);
  }
  return li = /* @__PURE__ */ (function() {
    function a() {
      c(this, a), this.head = null, this.tail = null, this.length = 0;
    }
    return i(a, [{
      key: "push",
      value: function(u) {
        var d = {
          data: u,
          next: null
        };
        this.length > 0 ? this.tail.next = d : this.head = d, this.tail = d, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(u) {
        var d = {
          data: u,
          next: this.head
        };
        this.length === 0 && (this.tail = d), this.head = d, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var u = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, u;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(u) {
        if (this.length === 0) return "";
        for (var d = this.head, E = "" + d.data; d = d.next; ) E += u + d.data;
        return E;
      }
    }, {
      key: "concat",
      value: function(u) {
        if (this.length === 0) return A.alloc(0);
        for (var d = A.allocUnsafe(u >>> 0), E = this.head, _ = 0; E; )
          s(E.data, d, _), _ += E.data.length, E = E.next;
        return d;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(u, d) {
        var E;
        return u < this.head.data.length ? (E = this.head.data.slice(0, u), this.head.data = this.head.data.slice(u)) : u === this.head.data.length ? E = this.shift() : E = d ? this._getString(u) : this._getBuffer(u), E;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(u) {
        var d = this.head, E = 1, _ = d.data;
        for (u -= _.length; d = d.next; ) {
          var I = d.data, P = u > I.length ? I.length : u;
          if (P === I.length ? _ += I : _ += I.slice(0, u), u -= P, u === 0) {
            P === I.length ? (++E, d.next ? this.head = d.next : this.head = this.tail = null) : (this.head = d, d.data = I.slice(P));
            break;
          }
          ++E;
        }
        return this.length -= E, _;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(u) {
        var d = A.allocUnsafe(u), E = this.head, _ = 1;
        for (E.data.copy(d), u -= E.data.length; E = E.next; ) {
          var I = E.data, P = u > I.length ? I.length : u;
          if (I.copy(d, d.length - u, 0, P), u -= P, u === 0) {
            P === I.length ? (++_, E.next ? this.head = E.next : this.head = this.tail = null) : (this.head = E, E.data = I.slice(P));
            break;
          }
          ++_;
        }
        return this.length -= _, d;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: S,
      value: function(u, d) {
        return v(this, e(e({}, d), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), a;
  })(), li;
}
var ui, gf;
function gc() {
  if (gf) return ui;
  gf = 1;
  function t(p, f) {
    var b = this, A = this._readableState && this._readableState.destroyed, o = this._writableState && this._writableState.destroyed;
    return A || o ? (f ? f(p) : p && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, Ke.nextTick(r, this, p)) : Ke.nextTick(r, this, p)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(p || null, function(v) {
      !f && v ? b._writableState ? b._writableState.errorEmitted ? Ke.nextTick(l, b) : (b._writableState.errorEmitted = !0, Ke.nextTick(e, b, v)) : Ke.nextTick(e, b, v) : f ? (Ke.nextTick(l, b), f(v)) : Ke.nextTick(l, b);
    }), this);
  }
  function e(p, f) {
    r(p, f), l(p);
  }
  function l(p) {
    p._writableState && !p._writableState.emitClose || p._readableState && !p._readableState.emitClose || p.emit("close");
  }
  function c() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function r(p, f) {
    p.emit("error", f);
  }
  function i(p, f) {
    var b = p._readableState, A = p._writableState;
    b && b.autoDestroy || A && A.autoDestroy ? p.destroy(f) : p.emit("error", f);
  }
  return ui = {
    destroy: t,
    undestroy: c,
    errorOrDestroy: i
  }, ui;
}
var ci = {}, mf;
function pt() {
  if (mf) return ci;
  mf = 1;
  function t(f, b) {
    f.prototype = Object.create(b.prototype), f.prototype.constructor = f, f.__proto__ = b;
  }
  var e = {};
  function l(f, b, A) {
    A || (A = Error);
    function o(S, s, a) {
      return typeof b == "string" ? b : b(S, s, a);
    }
    var v = /* @__PURE__ */ (function(S) {
      t(s, S);
      function s(a, w, u) {
        return S.call(this, o(a, w, u)) || this;
      }
      return s;
    })(A);
    v.prototype.name = A.name, v.prototype.code = f, e[f] = v;
  }
  function c(f, b) {
    if (Array.isArray(f)) {
      var A = f.length;
      return f = f.map(function(o) {
        return String(o);
      }), A > 2 ? "one of ".concat(b, " ").concat(f.slice(0, A - 1).join(", "), ", or ") + f[A - 1] : A === 2 ? "one of ".concat(b, " ").concat(f[0], " or ").concat(f[1]) : "of ".concat(b, " ").concat(f[0]);
    } else
      return "of ".concat(b, " ").concat(String(f));
  }
  function r(f, b, A) {
    return f.substr(0, b.length) === b;
  }
  function i(f, b, A) {
    return (A === void 0 || A > f.length) && (A = f.length), f.substring(A - b.length, A) === b;
  }
  function p(f, b, A) {
    return typeof A != "number" && (A = 0), A + b.length > f.length ? !1 : f.indexOf(b, A) !== -1;
  }
  return l("ERR_INVALID_OPT_VALUE", function(f, b) {
    return 'The value "' + b + '" is invalid for option "' + f + '"';
  }, TypeError), l("ERR_INVALID_ARG_TYPE", function(f, b, A) {
    var o;
    typeof b == "string" && r(b, "not ") ? (o = "must not be", b = b.replace(/^not /, "")) : o = "must be";
    var v;
    if (i(f, " argument"))
      v = "The ".concat(f, " ").concat(o, " ").concat(c(b, "type"));
    else {
      var S = p(f, ".") ? "property" : "argument";
      v = 'The "'.concat(f, '" ').concat(S, " ").concat(o, " ").concat(c(b, "type"));
    }
    return v += ". Received type ".concat(typeof A), v;
  }, TypeError), l("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), l("ERR_METHOD_NOT_IMPLEMENTED", function(f) {
    return "The " + f + " method is not implemented";
  }), l("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), l("ERR_STREAM_DESTROYED", function(f) {
    return "Cannot call " + f + " after a stream was destroyed";
  }), l("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), l("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), l("ERR_STREAM_WRITE_AFTER_END", "write after end"), l("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), l("ERR_UNKNOWN_ENCODING", function(f) {
    return "Unknown encoding: " + f;
  }, TypeError), l("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), ci.codes = e, ci;
}
var di, bf;
function mc() {
  if (bf) return di;
  bf = 1;
  var t = pt().codes.ERR_INVALID_OPT_VALUE;
  function e(c, r, i) {
    return c.highWaterMark != null ? c.highWaterMark : r ? c[i] : null;
  }
  function l(c, r, i, p) {
    var f = e(r, p, i);
    if (f != null) {
      if (!(isFinite(f) && Math.floor(f) === f) || f < 0) {
        var b = p ? i : "highWaterMark";
        throw new t(b, f);
      }
      return Math.floor(f);
    }
    return c.objectMode ? 16 : 16 * 1024;
  }
  return di = {
    getHighWaterMark: l
  }, di;
}
var hi, wf;
function hh() {
  if (wf) return hi;
  wf = 1, hi = t;
  function t(l, c) {
    if (e("noDeprecation"))
      return l;
    var r = !1;
    function i() {
      if (!r) {
        if (e("throwDeprecation"))
          throw new Error(c);
        e("traceDeprecation") ? console.trace(c) : console.warn(c), r = !0;
      }
      return l.apply(this, arguments);
    }
    return i;
  }
  function e(l) {
    try {
      if (!Tr.localStorage) return !1;
    } catch {
      return !1;
    }
    var c = Tr.localStorage[l];
    return c == null ? !1 : String(c).toLowerCase() === "true";
  }
  return hi;
}
var pi, _f;
function bc() {
  if (_f) return pi;
  _f = 1, pi = q;
  function t(O) {
    var B = this;
    this.next = null, this.entry = null, this.finish = function() {
      se(B, O);
    };
  }
  var e;
  q.WritableState = D;
  var l = {
    deprecate: hh()
  }, c = fc(), r = wr().Buffer, i = (typeof Tr < "u" ? Tr : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function p(O) {
    return r.from(O);
  }
  function f(O) {
    return r.isBuffer(O) || O instanceof i;
  }
  var b = gc(), A = mc(), o = A.getHighWaterMark, v = pt().codes, S = v.ERR_INVALID_ARG_TYPE, s = v.ERR_METHOD_NOT_IMPLEMENTED, a = v.ERR_MULTIPLE_CALLBACK, w = v.ERR_STREAM_CANNOT_PIPE, u = v.ERR_STREAM_DESTROYED, d = v.ERR_STREAM_NULL_VALUES, E = v.ERR_STREAM_WRITE_AFTER_END, _ = v.ERR_UNKNOWN_ENCODING, I = b.errorOrDestroy;
  it()(q, c);
  function P() {
  }
  function D(O, B, C) {
    e = e || ct(), O = O || {}, typeof C != "boolean" && (C = B instanceof e), this.objectMode = !!O.objectMode, C && (this.objectMode = this.objectMode || !!O.writableObjectMode), this.highWaterMark = o(this, O, "writableHighWaterMark", C), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var ee = O.decodeStrings === !1;
    this.decodeStrings = !ee, this.defaultEncoding = O.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(te) {
      _e(B, te);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = O.emitClose !== !1, this.autoDestroy = !!O.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  D.prototype.getBuffer = function() {
    for (var B = this.bufferedRequest, C = []; B; )
      C.push(B), B = B.next;
    return C;
  }, (function() {
    try {
      Object.defineProperty(D.prototype, "buffer", {
        get: l.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var x;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (x = Function.prototype[Symbol.hasInstance], Object.defineProperty(q, Symbol.hasInstance, {
    value: function(B) {
      return x.call(this, B) ? !0 : this !== q ? !1 : B && B._writableState instanceof D;
    }
  })) : x = function(B) {
    return B instanceof this;
  };
  function q(O) {
    e = e || ct();
    var B = this instanceof e;
    if (!B && !x.call(q, this)) return new q(O);
    this._writableState = new D(O, this, B), this.writable = !0, O && (typeof O.write == "function" && (this._write = O.write), typeof O.writev == "function" && (this._writev = O.writev), typeof O.destroy == "function" && (this._destroy = O.destroy), typeof O.final == "function" && (this._final = O.final)), c.call(this);
  }
  q.prototype.pipe = function() {
    I(this, new w());
  };
  function K(O, B) {
    var C = new E();
    I(O, C), Ke.nextTick(B, C);
  }
  function L(O, B, C, ee) {
    var te;
    return C === null ? te = new d() : typeof C != "string" && !B.objectMode && (te = new S("chunk", ["string", "Buffer"], C)), te ? (I(O, te), Ke.nextTick(ee, te), !1) : !0;
  }
  q.prototype.write = function(O, B, C) {
    var ee = this._writableState, te = !1, N = !ee.objectMode && f(O);
    return N && !r.isBuffer(O) && (O = p(O)), typeof B == "function" && (C = B, B = null), N ? B = "buffer" : B || (B = ee.defaultEncoding), typeof C != "function" && (C = P), ee.ending ? K(this, C) : (N || L(this, ee, O, C)) && (ee.pendingcb++, te = y(this, ee, N, O, B, C)), te;
  }, q.prototype.cork = function() {
    this._writableState.corked++;
  }, q.prototype.uncork = function() {
    var O = this._writableState;
    O.corked && (O.corked--, !O.writing && !O.corked && !O.bufferProcessing && O.bufferedRequest && le(this, O));
  }, q.prototype.setDefaultEncoding = function(B) {
    if (typeof B == "string" && (B = B.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((B + "").toLowerCase()) > -1)) throw new _(B);
    return this._writableState.defaultEncoding = B, this;
  }, Object.defineProperty(q.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function z(O, B, C) {
    return !O.objectMode && O.decodeStrings !== !1 && typeof B == "string" && (B = r.from(B, C)), B;
  }
  Object.defineProperty(q.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function y(O, B, C, ee, te, N) {
    if (!C) {
      var j = z(B, ee, te);
      ee !== j && (C = !0, te = "buffer", ee = j);
    }
    var W = B.objectMode ? 1 : ee.length;
    B.length += W;
    var oe = B.length < B.highWaterMark;
    if (oe || (B.needDrain = !0), B.writing || B.corked) {
      var we = B.lastBufferedRequest;
      B.lastBufferedRequest = {
        chunk: ee,
        encoding: te,
        isBuf: C,
        callback: N,
        next: null
      }, we ? we.next = B.lastBufferedRequest : B.bufferedRequest = B.lastBufferedRequest, B.bufferedRequestCount += 1;
    } else
      F(O, B, !1, W, ee, te, N);
    return oe;
  }
  function F(O, B, C, ee, te, N, j) {
    B.writelen = ee, B.writecb = j, B.writing = !0, B.sync = !0, B.destroyed ? B.onwrite(new u("write")) : C ? O._writev(te, B.onwrite) : O._write(te, N, B.onwrite), B.sync = !1;
  }
  function ie(O, B, C, ee, te) {
    --B.pendingcb, C ? (Ke.nextTick(te, ee), Ke.nextTick(Q, O, B), O._writableState.errorEmitted = !0, I(O, ee)) : (te(ee), O._writableState.errorEmitted = !0, I(O, ee), Q(O, B));
  }
  function ce(O) {
    O.writing = !1, O.writecb = null, O.length -= O.writelen, O.writelen = 0;
  }
  function _e(O, B) {
    var C = O._writableState, ee = C.sync, te = C.writecb;
    if (typeof te != "function") throw new a();
    if (ce(C), B) ie(O, C, ee, B, te);
    else {
      var N = k(C) || O.destroyed;
      !N && !C.corked && !C.bufferProcessing && C.bufferedRequest && le(O, C), ee ? Ke.nextTick(be, O, C, N, te) : be(O, C, N, te);
    }
  }
  function be(O, B, C, ee) {
    C || ue(O, B), B.pendingcb--, ee(), Q(O, B);
  }
  function ue(O, B) {
    B.length === 0 && B.needDrain && (B.needDrain = !1, O.emit("drain"));
  }
  function le(O, B) {
    B.bufferProcessing = !0;
    var C = B.bufferedRequest;
    if (O._writev && C && C.next) {
      var ee = B.bufferedRequestCount, te = new Array(ee), N = B.corkedRequestsFree;
      N.entry = C;
      for (var j = 0, W = !0; C; )
        te[j] = C, C.isBuf || (W = !1), C = C.next, j += 1;
      te.allBuffers = W, F(O, B, !0, B.length, te, "", N.finish), B.pendingcb++, B.lastBufferedRequest = null, N.next ? (B.corkedRequestsFree = N.next, N.next = null) : B.corkedRequestsFree = new t(B), B.bufferedRequestCount = 0;
    } else {
      for (; C; ) {
        var oe = C.chunk, we = C.encoding, Se = C.callback, Re = B.objectMode ? 1 : oe.length;
        if (F(O, B, !1, Re, oe, we, Se), C = C.next, B.bufferedRequestCount--, B.writing)
          break;
      }
      C === null && (B.lastBufferedRequest = null);
    }
    B.bufferedRequest = C, B.bufferProcessing = !1;
  }
  q.prototype._write = function(O, B, C) {
    C(new s("_write()"));
  }, q.prototype._writev = null, q.prototype.end = function(O, B, C) {
    var ee = this._writableState;
    return typeof O == "function" ? (C = O, O = null, B = null) : typeof B == "function" && (C = B, B = null), O != null && this.write(O, B), ee.corked && (ee.corked = 1, this.uncork()), ee.ending || H(this, ee, C), this;
  }, Object.defineProperty(q.prototype, "writableLength", {
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
  function he(O, B) {
    O._final(function(C) {
      B.pendingcb--, C && I(O, C), B.prefinished = !0, O.emit("prefinish"), Q(O, B);
    });
  }
  function X(O, B) {
    !B.prefinished && !B.finalCalled && (typeof O._final == "function" && !B.destroyed ? (B.pendingcb++, B.finalCalled = !0, Ke.nextTick(he, O, B)) : (B.prefinished = !0, O.emit("prefinish")));
  }
  function Q(O, B) {
    var C = k(B);
    if (C && (X(O, B), B.pendingcb === 0 && (B.finished = !0, O.emit("finish"), B.autoDestroy))) {
      var ee = O._readableState;
      (!ee || ee.autoDestroy && ee.endEmitted) && O.destroy();
    }
    return C;
  }
  function H(O, B, C) {
    B.ending = !0, Q(O, B), C && (B.finished ? Ke.nextTick(C) : O.once("finish", C)), B.ended = !0, O.writable = !1;
  }
  function se(O, B, C) {
    var ee = O.entry;
    for (O.entry = null; ee; ) {
      var te = ee.callback;
      B.pendingcb--, te(C), ee = ee.next;
    }
    B.corkedRequestsFree.next = O;
  }
  return Object.defineProperty(q.prototype, "destroyed", {
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
  }), q.prototype.destroy = b.destroy, q.prototype._undestroy = b.undestroy, q.prototype._destroy = function(O, B) {
    B(O);
  }, pi;
}
var yi, Ef;
function ct() {
  if (Ef) return yi;
  Ef = 1;
  var t = Object.keys || function(A) {
    var o = [];
    for (var v in A) o.push(v);
    return o;
  };
  yi = p;
  var e = wc(), l = bc();
  it()(p, e);
  for (var c = t(l.prototype), r = 0; r < c.length; r++) {
    var i = c[r];
    p.prototype[i] || (p.prototype[i] = l.prototype[i]);
  }
  function p(A) {
    if (!(this instanceof p)) return new p(A);
    e.call(this, A), l.call(this, A), this.allowHalfOpen = !0, A && (A.readable === !1 && (this.readable = !1), A.writable === !1 && (this.writable = !1), A.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", f)));
  }
  Object.defineProperty(p.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(p.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(p.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function f() {
    this._writableState.ended || Ke.nextTick(b, this);
  }
  function b(A) {
    A.end();
  }
  return Object.defineProperty(p.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(o) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = o, this._writableState.destroyed = o);
    }
  }), yi;
}
var vi = {}, kt = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Sf;
function ph() {
  return Sf || (Sf = 1, (function(t, e) {
    var l = wr(), c = l.Buffer;
    function r(p, f) {
      for (var b in p)
        f[b] = p[b];
    }
    c.from && c.alloc && c.allocUnsafe && c.allocUnsafeSlow ? t.exports = l : (r(l, e), e.Buffer = i);
    function i(p, f, b) {
      return c(p, f, b);
    }
    i.prototype = Object.create(c.prototype), r(c, i), i.from = function(p, f, b) {
      if (typeof p == "number")
        throw new TypeError("Argument must not be a number");
      return c(p, f, b);
    }, i.alloc = function(p, f, b) {
      if (typeof p != "number")
        throw new TypeError("Argument must be a number");
      var A = c(p);
      return f !== void 0 ? typeof b == "string" ? A.fill(f, b) : A.fill(f) : A.fill(0), A;
    }, i.allocUnsafe = function(p) {
      if (typeof p != "number")
        throw new TypeError("Argument must be a number");
      return c(p);
    }, i.allocUnsafeSlow = function(p) {
      if (typeof p != "number")
        throw new TypeError("Argument must be a number");
      return l.SlowBuffer(p);
    };
  })(kt, kt.exports)), kt.exports;
}
var Rf;
function Mo() {
  if (Rf) return vi;
  Rf = 1;
  var t = ph().Buffer, e = t.isEncoding || function(d) {
    switch (d = "" + d, d && d.toLowerCase()) {
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
  function l(d) {
    if (!d) return "utf8";
    for (var E; ; )
      switch (d) {
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
          return d;
        default:
          if (E) return;
          d = ("" + d).toLowerCase(), E = !0;
      }
  }
  function c(d) {
    var E = l(d);
    if (typeof E != "string" && (t.isEncoding === e || !e(d))) throw new Error("Unknown encoding: " + d);
    return E || d;
  }
  vi.StringDecoder = r;
  function r(d) {
    this.encoding = c(d);
    var E;
    switch (this.encoding) {
      case "utf16le":
        this.text = v, this.end = S, E = 4;
        break;
      case "utf8":
        this.fillLast = b, E = 4;
        break;
      case "base64":
        this.text = s, this.end = a, E = 3;
        break;
      default:
        this.write = w, this.end = u;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = t.allocUnsafe(E);
  }
  r.prototype.write = function(d) {
    if (d.length === 0) return "";
    var E, _;
    if (this.lastNeed) {
      if (E = this.fillLast(d), E === void 0) return "";
      _ = this.lastNeed, this.lastNeed = 0;
    } else
      _ = 0;
    return _ < d.length ? E ? E + this.text(d, _) : this.text(d, _) : E || "";
  }, r.prototype.end = o, r.prototype.text = A, r.prototype.fillLast = function(d) {
    if (this.lastNeed <= d.length)
      return d.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    d.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, d.length), this.lastNeed -= d.length;
  };
  function i(d) {
    return d <= 127 ? 0 : d >> 5 === 6 ? 2 : d >> 4 === 14 ? 3 : d >> 3 === 30 ? 4 : d >> 6 === 2 ? -1 : -2;
  }
  function p(d, E, _) {
    var I = E.length - 1;
    if (I < _) return 0;
    var P = i(E[I]);
    return P >= 0 ? (P > 0 && (d.lastNeed = P - 1), P) : --I < _ || P === -2 ? 0 : (P = i(E[I]), P >= 0 ? (P > 0 && (d.lastNeed = P - 2), P) : --I < _ || P === -2 ? 0 : (P = i(E[I]), P >= 0 ? (P > 0 && (P === 2 ? P = 0 : d.lastNeed = P - 3), P) : 0));
  }
  function f(d, E, _) {
    if ((E[0] & 192) !== 128)
      return d.lastNeed = 0, "�";
    if (d.lastNeed > 1 && E.length > 1) {
      if ((E[1] & 192) !== 128)
        return d.lastNeed = 1, "�";
      if (d.lastNeed > 2 && E.length > 2 && (E[2] & 192) !== 128)
        return d.lastNeed = 2, "�";
    }
  }
  function b(d) {
    var E = this.lastTotal - this.lastNeed, _ = f(this, d);
    if (_ !== void 0) return _;
    if (this.lastNeed <= d.length)
      return d.copy(this.lastChar, E, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    d.copy(this.lastChar, E, 0, d.length), this.lastNeed -= d.length;
  }
  function A(d, E) {
    var _ = p(this, d, E);
    if (!this.lastNeed) return d.toString("utf8", E);
    this.lastTotal = _;
    var I = d.length - (_ - this.lastNeed);
    return d.copy(this.lastChar, 0, I), d.toString("utf8", E, I);
  }
  function o(d) {
    var E = d && d.length ? this.write(d) : "";
    return this.lastNeed ? E + "�" : E;
  }
  function v(d, E) {
    if ((d.length - E) % 2 === 0) {
      var _ = d.toString("utf16le", E);
      if (_) {
        var I = _.charCodeAt(_.length - 1);
        if (I >= 55296 && I <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = d[d.length - 2], this.lastChar[1] = d[d.length - 1], _.slice(0, -1);
      }
      return _;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = d[d.length - 1], d.toString("utf16le", E, d.length - 1);
  }
  function S(d) {
    var E = d && d.length ? this.write(d) : "";
    if (this.lastNeed) {
      var _ = this.lastTotal - this.lastNeed;
      return E + this.lastChar.toString("utf16le", 0, _);
    }
    return E;
  }
  function s(d, E) {
    var _ = (d.length - E) % 3;
    return _ === 0 ? d.toString("base64", E) : (this.lastNeed = 3 - _, this.lastTotal = 3, _ === 1 ? this.lastChar[0] = d[d.length - 1] : (this.lastChar[0] = d[d.length - 2], this.lastChar[1] = d[d.length - 1]), d.toString("base64", E, d.length - _));
  }
  function a(d) {
    var E = d && d.length ? this.write(d) : "";
    return this.lastNeed ? E + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : E;
  }
  function w(d) {
    return d.toString(this.encoding);
  }
  function u(d) {
    return d && d.length ? this.write(d) : "";
  }
  return vi;
}
var gi, Af;
function Go() {
  if (Af) return gi;
  Af = 1;
  var t = pt().codes.ERR_STREAM_PREMATURE_CLOSE;
  function e(i) {
    var p = !1;
    return function() {
      if (!p) {
        p = !0;
        for (var f = arguments.length, b = new Array(f), A = 0; A < f; A++)
          b[A] = arguments[A];
        i.apply(this, b);
      }
    };
  }
  function l() {
  }
  function c(i) {
    return i.setHeader && typeof i.abort == "function";
  }
  function r(i, p, f) {
    if (typeof p == "function") return r(i, null, p);
    p || (p = {}), f = e(f || l);
    var b = p.readable || p.readable !== !1 && i.readable, A = p.writable || p.writable !== !1 && i.writable, o = function() {
      i.writable || S();
    }, v = i._writableState && i._writableState.finished, S = function() {
      A = !1, v = !0, b || f.call(i);
    }, s = i._readableState && i._readableState.endEmitted, a = function() {
      b = !1, s = !0, A || f.call(i);
    }, w = function(_) {
      f.call(i, _);
    }, u = function() {
      var _;
      if (b && !s)
        return (!i._readableState || !i._readableState.ended) && (_ = new t()), f.call(i, _);
      if (A && !v)
        return (!i._writableState || !i._writableState.ended) && (_ = new t()), f.call(i, _);
    }, d = function() {
      i.req.on("finish", S);
    };
    return c(i) ? (i.on("complete", S), i.on("abort", u), i.req ? d() : i.on("request", d)) : A && !i._writableState && (i.on("end", o), i.on("close", o)), i.on("end", a), i.on("finish", S), p.error !== !1 && i.on("error", w), i.on("close", u), function() {
      i.removeListener("complete", S), i.removeListener("abort", u), i.removeListener("request", d), i.req && i.req.removeListener("finish", S), i.removeListener("end", o), i.removeListener("close", o), i.removeListener("finish", S), i.removeListener("end", a), i.removeListener("error", w), i.removeListener("close", u);
    };
  }
  return gi = r, gi;
}
var mi, Pf;
function yh() {
  if (Pf) return mi;
  Pf = 1;
  var t;
  function e(_, I, P) {
    return I = l(I), I in _ ? Object.defineProperty(_, I, { value: P, enumerable: !0, configurable: !0, writable: !0 }) : _[I] = P, _;
  }
  function l(_) {
    var I = c(_, "string");
    return typeof I == "symbol" ? I : String(I);
  }
  function c(_, I) {
    if (typeof _ != "object" || _ === null) return _;
    var P = _[Symbol.toPrimitive];
    if (P !== void 0) {
      var D = P.call(_, I);
      if (typeof D != "object") return D;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (I === "string" ? String : Number)(_);
  }
  var r = Go(), i = Symbol("lastResolve"), p = Symbol("lastReject"), f = Symbol("error"), b = Symbol("ended"), A = Symbol("lastPromise"), o = Symbol("handlePromise"), v = Symbol("stream");
  function S(_, I) {
    return {
      value: _,
      done: I
    };
  }
  function s(_) {
    var I = _[i];
    if (I !== null) {
      var P = _[v].read();
      P !== null && (_[A] = null, _[i] = null, _[p] = null, I(S(P, !1)));
    }
  }
  function a(_) {
    Ke.nextTick(s, _);
  }
  function w(_, I) {
    return function(P, D) {
      _.then(function() {
        if (I[b]) {
          P(S(void 0, !0));
          return;
        }
        I[o](P, D);
      }, D);
    };
  }
  var u = Object.getPrototypeOf(function() {
  }), d = Object.setPrototypeOf((t = {
    get stream() {
      return this[v];
    },
    next: function() {
      var I = this, P = this[f];
      if (P !== null)
        return Promise.reject(P);
      if (this[b])
        return Promise.resolve(S(void 0, !0));
      if (this[v].destroyed)
        return new Promise(function(K, L) {
          Ke.nextTick(function() {
            I[f] ? L(I[f]) : K(S(void 0, !0));
          });
        });
      var D = this[A], x;
      if (D)
        x = new Promise(w(D, this));
      else {
        var q = this[v].read();
        if (q !== null)
          return Promise.resolve(S(q, !1));
        x = new Promise(this[o]);
      }
      return this[A] = x, x;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var I = this;
    return new Promise(function(P, D) {
      I[v].destroy(null, function(x) {
        if (x) {
          D(x);
          return;
        }
        P(S(void 0, !0));
      });
    });
  }), t), u), E = function(I) {
    var P, D = Object.create(d, (P = {}, e(P, v, {
      value: I,
      writable: !0
    }), e(P, i, {
      value: null,
      writable: !0
    }), e(P, p, {
      value: null,
      writable: !0
    }), e(P, f, {
      value: null,
      writable: !0
    }), e(P, b, {
      value: I._readableState.endEmitted,
      writable: !0
    }), e(P, o, {
      value: function(q, K) {
        var L = D[v].read();
        L ? (D[A] = null, D[i] = null, D[p] = null, q(S(L, !1))) : (D[i] = q, D[p] = K);
      },
      writable: !0
    }), P));
    return D[A] = null, r(I, function(x) {
      if (x && x.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var q = D[p];
        q !== null && (D[A] = null, D[i] = null, D[p] = null, q(x)), D[f] = x;
        return;
      }
      var K = D[i];
      K !== null && (D[A] = null, D[i] = null, D[p] = null, K(S(void 0, !0))), D[b] = !0;
    }), I.on("readable", a.bind(null, D)), D;
  };
  return mi = E, mi;
}
var bi, Tf;
function vh() {
  return Tf || (Tf = 1, bi = function() {
    throw new Error("Readable.from is not available in the browser");
  }), bi;
}
var wi, If;
function wc() {
  if (If) return wi;
  If = 1, wi = K;
  var t;
  K.ReadableState = q, nt().EventEmitter;
  var e = function(j, W) {
    return j.listeners(W).length;
  }, l = fc(), c = wr().Buffer, r = (typeof Tr < "u" ? Tr : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function i(N) {
    return c.from(N);
  }
  function p(N) {
    return c.isBuffer(N) || N instanceof r;
  }
  var f = Yr(), b;
  f && f.debuglog ? b = f.debuglog("stream") : b = function() {
  };
  var A = dh(), o = gc(), v = mc(), S = v.getHighWaterMark, s = pt().codes, a = s.ERR_INVALID_ARG_TYPE, w = s.ERR_STREAM_PUSH_AFTER_EOF, u = s.ERR_METHOD_NOT_IMPLEMENTED, d = s.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, E, _, I;
  it()(K, l);
  var P = o.errorOrDestroy, D = ["error", "close", "destroy", "pause", "resume"];
  function x(N, j, W) {
    if (typeof N.prependListener == "function") return N.prependListener(j, W);
    !N._events || !N._events[j] ? N.on(j, W) : Array.isArray(N._events[j]) ? N._events[j].unshift(W) : N._events[j] = [W, N._events[j]];
  }
  function q(N, j, W) {
    t = t || ct(), N = N || {}, typeof W != "boolean" && (W = j instanceof t), this.objectMode = !!N.objectMode, W && (this.objectMode = this.objectMode || !!N.readableObjectMode), this.highWaterMark = S(this, N, "readableHighWaterMark", W), this.buffer = new A(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = N.emitClose !== !1, this.autoDestroy = !!N.autoDestroy, this.destroyed = !1, this.defaultEncoding = N.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, N.encoding && (E || (E = Mo().StringDecoder), this.decoder = new E(N.encoding), this.encoding = N.encoding);
  }
  function K(N) {
    if (t = t || ct(), !(this instanceof K)) return new K(N);
    var j = this instanceof t;
    this._readableState = new q(N, this, j), this.readable = !0, N && (typeof N.read == "function" && (this._read = N.read), typeof N.destroy == "function" && (this._destroy = N.destroy)), l.call(this);
  }
  Object.defineProperty(K.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(j) {
      this._readableState && (this._readableState.destroyed = j);
    }
  }), K.prototype.destroy = o.destroy, K.prototype._undestroy = o.undestroy, K.prototype._destroy = function(N, j) {
    j(N);
  }, K.prototype.push = function(N, j) {
    var W = this._readableState, oe;
    return W.objectMode ? oe = !0 : typeof N == "string" && (j = j || W.defaultEncoding, j !== W.encoding && (N = c.from(N, j), j = ""), oe = !0), L(this, N, j, !1, oe);
  }, K.prototype.unshift = function(N) {
    return L(this, N, null, !0, !1);
  };
  function L(N, j, W, oe, we) {
    b("readableAddChunk", j);
    var Se = N._readableState;
    if (j === null)
      Se.reading = !1, _e(N, Se);
    else {
      var Re;
      if (we || (Re = y(Se, j)), Re)
        P(N, Re);
      else if (Se.objectMode || j && j.length > 0)
        if (typeof j != "string" && !Se.objectMode && Object.getPrototypeOf(j) !== c.prototype && (j = i(j)), oe)
          Se.endEmitted ? P(N, new d()) : z(N, Se, j, !0);
        else if (Se.ended)
          P(N, new w());
        else {
          if (Se.destroyed)
            return !1;
          Se.reading = !1, Se.decoder && !W ? (j = Se.decoder.write(j), Se.objectMode || j.length !== 0 ? z(N, Se, j, !1) : le(N, Se)) : z(N, Se, j, !1);
        }
      else oe || (Se.reading = !1, le(N, Se));
    }
    return !Se.ended && (Se.length < Se.highWaterMark || Se.length === 0);
  }
  function z(N, j, W, oe) {
    j.flowing && j.length === 0 && !j.sync ? (j.awaitDrain = 0, N.emit("data", W)) : (j.length += j.objectMode ? 1 : W.length, oe ? j.buffer.unshift(W) : j.buffer.push(W), j.needReadable && be(N)), le(N, j);
  }
  function y(N, j) {
    var W;
    return !p(j) && typeof j != "string" && j !== void 0 && !N.objectMode && (W = new a("chunk", ["string", "Buffer", "Uint8Array"], j)), W;
  }
  K.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, K.prototype.setEncoding = function(N) {
    E || (E = Mo().StringDecoder);
    var j = new E(N);
    this._readableState.decoder = j, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var W = this._readableState.buffer.head, oe = ""; W !== null; )
      oe += j.write(W.data), W = W.next;
    return this._readableState.buffer.clear(), oe !== "" && this._readableState.buffer.push(oe), this._readableState.length = oe.length, this;
  };
  var F = 1073741824;
  function ie(N) {
    return N >= F ? N = F : (N--, N |= N >>> 1, N |= N >>> 2, N |= N >>> 4, N |= N >>> 8, N |= N >>> 16, N++), N;
  }
  function ce(N, j) {
    return N <= 0 || j.length === 0 && j.ended ? 0 : j.objectMode ? 1 : N !== N ? j.flowing && j.length ? j.buffer.head.data.length : j.length : (N > j.highWaterMark && (j.highWaterMark = ie(N)), N <= j.length ? N : j.ended ? j.length : (j.needReadable = !0, 0));
  }
  K.prototype.read = function(N) {
    b("read", N), N = parseInt(N, 10);
    var j = this._readableState, W = N;
    if (N !== 0 && (j.emittedReadable = !1), N === 0 && j.needReadable && ((j.highWaterMark !== 0 ? j.length >= j.highWaterMark : j.length > 0) || j.ended))
      return b("read: emitReadable", j.length, j.ended), j.length === 0 && j.ended ? C(this) : be(this), null;
    if (N = ce(N, j), N === 0 && j.ended)
      return j.length === 0 && C(this), null;
    var oe = j.needReadable;
    b("need readable", oe), (j.length === 0 || j.length - N < j.highWaterMark) && (oe = !0, b("length less than watermark", oe)), j.ended || j.reading ? (oe = !1, b("reading or ended", oe)) : oe && (b("do read"), j.reading = !0, j.sync = !0, j.length === 0 && (j.needReadable = !0), this._read(j.highWaterMark), j.sync = !1, j.reading || (N = ce(W, j)));
    var we;
    return N > 0 ? we = B(N, j) : we = null, we === null ? (j.needReadable = j.length <= j.highWaterMark, N = 0) : (j.length -= N, j.awaitDrain = 0), j.length === 0 && (j.ended || (j.needReadable = !0), W !== N && j.ended && C(this)), we !== null && this.emit("data", we), we;
  };
  function _e(N, j) {
    if (b("onEofChunk"), !j.ended) {
      if (j.decoder) {
        var W = j.decoder.end();
        W && W.length && (j.buffer.push(W), j.length += j.objectMode ? 1 : W.length);
      }
      j.ended = !0, j.sync ? be(N) : (j.needReadable = !1, j.emittedReadable || (j.emittedReadable = !0, ue(N)));
    }
  }
  function be(N) {
    var j = N._readableState;
    b("emitReadable", j.needReadable, j.emittedReadable), j.needReadable = !1, j.emittedReadable || (b("emitReadable", j.flowing), j.emittedReadable = !0, Ke.nextTick(ue, N));
  }
  function ue(N) {
    var j = N._readableState;
    b("emitReadable_", j.destroyed, j.length, j.ended), !j.destroyed && (j.length || j.ended) && (N.emit("readable"), j.emittedReadable = !1), j.needReadable = !j.flowing && !j.ended && j.length <= j.highWaterMark, O(N);
  }
  function le(N, j) {
    j.readingMore || (j.readingMore = !0, Ke.nextTick(k, N, j));
  }
  function k(N, j) {
    for (; !j.reading && !j.ended && (j.length < j.highWaterMark || j.flowing && j.length === 0); ) {
      var W = j.length;
      if (b("maybeReadMore read 0"), N.read(0), W === j.length)
        break;
    }
    j.readingMore = !1;
  }
  K.prototype._read = function(N) {
    P(this, new u("_read()"));
  }, K.prototype.pipe = function(N, j) {
    var W = this, oe = this._readableState;
    switch (oe.pipesCount) {
      case 0:
        oe.pipes = N;
        break;
      case 1:
        oe.pipes = [oe.pipes, N];
        break;
      default:
        oe.pipes.push(N);
        break;
    }
    oe.pipesCount += 1, b("pipe count=%d opts=%j", oe.pipesCount, j);
    var we = (!j || j.end !== !1) && N !== Ke.stdout && N !== Ke.stderr, Se = we ? Oe : je;
    oe.endEmitted ? Ke.nextTick(Se) : W.once("end", Se), N.on("unpipe", Re);
    function Re(qe, Me) {
      b("onunpipe"), qe === W && Me && Me.hasUnpiped === !1 && (Me.hasUnpiped = !0, Le());
    }
    function Oe() {
      b("onend"), N.end();
    }
    var re = he(W);
    N.on("drain", re);
    var De = !1;
    function Le() {
      b("cleanup"), N.removeListener("close", ve), N.removeListener("finish", Ee), N.removeListener("drain", re), N.removeListener("error", $e), N.removeListener("unpipe", Re), W.removeListener("end", Oe), W.removeListener("end", je), W.removeListener("data", Pe), De = !0, oe.awaitDrain && (!N._writableState || N._writableState.needDrain) && re();
    }
    W.on("data", Pe);
    function Pe(qe) {
      b("ondata");
      var Me = N.write(qe);
      b("dest.write", Me), Me === !1 && ((oe.pipesCount === 1 && oe.pipes === N || oe.pipesCount > 1 && te(oe.pipes, N) !== -1) && !De && (b("false write response, pause", oe.awaitDrain), oe.awaitDrain++), W.pause());
    }
    function $e(qe) {
      b("onerror", qe), je(), N.removeListener("error", $e), e(N, "error") === 0 && P(N, qe);
    }
    x(N, "error", $e);
    function ve() {
      N.removeListener("finish", Ee), je();
    }
    N.once("close", ve);
    function Ee() {
      b("onfinish"), N.removeListener("close", ve), je();
    }
    N.once("finish", Ee);
    function je() {
      b("unpipe"), W.unpipe(N);
    }
    return N.emit("pipe", W), oe.flowing || (b("pipe resume"), W.resume()), N;
  };
  function he(N) {
    return function() {
      var W = N._readableState;
      b("pipeOnDrain", W.awaitDrain), W.awaitDrain && W.awaitDrain--, W.awaitDrain === 0 && e(N, "data") && (W.flowing = !0, O(N));
    };
  }
  K.prototype.unpipe = function(N) {
    var j = this._readableState, W = {
      hasUnpiped: !1
    };
    if (j.pipesCount === 0) return this;
    if (j.pipesCount === 1)
      return N && N !== j.pipes ? this : (N || (N = j.pipes), j.pipes = null, j.pipesCount = 0, j.flowing = !1, N && N.emit("unpipe", this, W), this);
    if (!N) {
      var oe = j.pipes, we = j.pipesCount;
      j.pipes = null, j.pipesCount = 0, j.flowing = !1;
      for (var Se = 0; Se < we; Se++) oe[Se].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var Re = te(j.pipes, N);
    return Re === -1 ? this : (j.pipes.splice(Re, 1), j.pipesCount -= 1, j.pipesCount === 1 && (j.pipes = j.pipes[0]), N.emit("unpipe", this, W), this);
  }, K.prototype.on = function(N, j) {
    var W = l.prototype.on.call(this, N, j), oe = this._readableState;
    return N === "data" ? (oe.readableListening = this.listenerCount("readable") > 0, oe.flowing !== !1 && this.resume()) : N === "readable" && !oe.endEmitted && !oe.readableListening && (oe.readableListening = oe.needReadable = !0, oe.flowing = !1, oe.emittedReadable = !1, b("on readable", oe.length, oe.reading), oe.length ? be(this) : oe.reading || Ke.nextTick(Q, this)), W;
  }, K.prototype.addListener = K.prototype.on, K.prototype.removeListener = function(N, j) {
    var W = l.prototype.removeListener.call(this, N, j);
    return N === "readable" && Ke.nextTick(X, this), W;
  }, K.prototype.removeAllListeners = function(N) {
    var j = l.prototype.removeAllListeners.apply(this, arguments);
    return (N === "readable" || N === void 0) && Ke.nextTick(X, this), j;
  };
  function X(N) {
    var j = N._readableState;
    j.readableListening = N.listenerCount("readable") > 0, j.resumeScheduled && !j.paused ? j.flowing = !0 : N.listenerCount("data") > 0 && N.resume();
  }
  function Q(N) {
    b("readable nexttick read 0"), N.read(0);
  }
  K.prototype.resume = function() {
    var N = this._readableState;
    return N.flowing || (b("resume"), N.flowing = !N.readableListening, H(this, N)), N.paused = !1, this;
  };
  function H(N, j) {
    j.resumeScheduled || (j.resumeScheduled = !0, Ke.nextTick(se, N, j));
  }
  function se(N, j) {
    b("resume", j.reading), j.reading || N.read(0), j.resumeScheduled = !1, N.emit("resume"), O(N), j.flowing && !j.reading && N.read(0);
  }
  K.prototype.pause = function() {
    return b("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (b("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function O(N) {
    var j = N._readableState;
    for (b("flow", j.flowing); j.flowing && N.read() !== null; ) ;
  }
  K.prototype.wrap = function(N) {
    var j = this, W = this._readableState, oe = !1;
    N.on("end", function() {
      if (b("wrapped end"), W.decoder && !W.ended) {
        var Re = W.decoder.end();
        Re && Re.length && j.push(Re);
      }
      j.push(null);
    }), N.on("data", function(Re) {
      if (b("wrapped data"), W.decoder && (Re = W.decoder.write(Re)), !(W.objectMode && Re == null) && !(!W.objectMode && (!Re || !Re.length))) {
        var Oe = j.push(Re);
        Oe || (oe = !0, N.pause());
      }
    });
    for (var we in N)
      this[we] === void 0 && typeof N[we] == "function" && (this[we] = /* @__PURE__ */ (function(Oe) {
        return function() {
          return N[Oe].apply(N, arguments);
        };
      })(we));
    for (var Se = 0; Se < D.length; Se++)
      N.on(D[Se], this.emit.bind(this, D[Se]));
    return this._read = function(Re) {
      b("wrapped _read", Re), oe && (oe = !1, N.resume());
    }, this;
  }, typeof Symbol == "function" && (K.prototype[Symbol.asyncIterator] = function() {
    return _ === void 0 && (_ = yh()), _(this);
  }), Object.defineProperty(K.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(K.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(K.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(j) {
      this._readableState && (this._readableState.flowing = j);
    }
  }), K._fromList = B, Object.defineProperty(K.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function B(N, j) {
    if (j.length === 0) return null;
    var W;
    return j.objectMode ? W = j.buffer.shift() : !N || N >= j.length ? (j.decoder ? W = j.buffer.join("") : j.buffer.length === 1 ? W = j.buffer.first() : W = j.buffer.concat(j.length), j.buffer.clear()) : W = j.buffer.consume(N, j.decoder), W;
  }
  function C(N) {
    var j = N._readableState;
    b("endReadable", j.endEmitted), j.endEmitted || (j.ended = !0, Ke.nextTick(ee, j, N));
  }
  function ee(N, j) {
    if (b("endReadableNT", N.endEmitted, N.length), !N.endEmitted && N.length === 0 && (N.endEmitted = !0, j.readable = !1, j.emit("end"), N.autoDestroy)) {
      var W = j._writableState;
      (!W || W.autoDestroy && W.finished) && j.destroy();
    }
  }
  typeof Symbol == "function" && (K.from = function(N, j) {
    return I === void 0 && (I = vh()), I(K, N, j);
  });
  function te(N, j) {
    for (var W = 0, oe = N.length; W < oe; W++)
      if (N[W] === j) return W;
    return -1;
  }
  return wi;
}
var _i, Of;
function _c() {
  if (Of) return _i;
  Of = 1, _i = f;
  var t = pt().codes, e = t.ERR_METHOD_NOT_IMPLEMENTED, l = t.ERR_MULTIPLE_CALLBACK, c = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, r = t.ERR_TRANSFORM_WITH_LENGTH_0, i = ct();
  it()(f, i);
  function p(o, v) {
    var S = this._transformState;
    S.transforming = !1;
    var s = S.writecb;
    if (s === null)
      return this.emit("error", new l());
    S.writechunk = null, S.writecb = null, v != null && this.push(v), s(o);
    var a = this._readableState;
    a.reading = !1, (a.needReadable || a.length < a.highWaterMark) && this._read(a.highWaterMark);
  }
  function f(o) {
    if (!(this instanceof f)) return new f(o);
    i.call(this, o), this._transformState = {
      afterTransform: p.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, o && (typeof o.transform == "function" && (this._transform = o.transform), typeof o.flush == "function" && (this._flush = o.flush)), this.on("prefinish", b);
  }
  function b() {
    var o = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(v, S) {
      A(o, v, S);
    }) : A(this, null, null);
  }
  f.prototype.push = function(o, v) {
    return this._transformState.needTransform = !1, i.prototype.push.call(this, o, v);
  }, f.prototype._transform = function(o, v, S) {
    S(new e("_transform()"));
  }, f.prototype._write = function(o, v, S) {
    var s = this._transformState;
    if (s.writecb = S, s.writechunk = o, s.writeencoding = v, !s.transforming) {
      var a = this._readableState;
      (s.needTransform || a.needReadable || a.length < a.highWaterMark) && this._read(a.highWaterMark);
    }
  }, f.prototype._read = function(o) {
    var v = this._transformState;
    v.writechunk !== null && !v.transforming ? (v.transforming = !0, this._transform(v.writechunk, v.writeencoding, v.afterTransform)) : v.needTransform = !0;
  }, f.prototype._destroy = function(o, v) {
    i.prototype._destroy.call(this, o, function(S) {
      v(S);
    });
  };
  function A(o, v, S) {
    if (v) return o.emit("error", v);
    if (S != null && o.push(S), o._writableState.length) throw new r();
    if (o._transformState.transforming) throw new c();
    return o.push(null);
  }
  return _i;
}
var Ei, xf;
function gh() {
  if (xf) return Ei;
  xf = 1, Ei = e;
  var t = _c();
  it()(e, t);
  function e(l) {
    if (!(this instanceof e)) return new e(l);
    t.call(this, l);
  }
  return e.prototype._transform = function(l, c, r) {
    r(null, l);
  }, Ei;
}
var Si, Ff;
function mh() {
  if (Ff) return Si;
  Ff = 1;
  var t;
  function e(S) {
    var s = !1;
    return function() {
      s || (s = !0, S.apply(void 0, arguments));
    };
  }
  var l = pt().codes, c = l.ERR_MISSING_ARGS, r = l.ERR_STREAM_DESTROYED;
  function i(S) {
    if (S) throw S;
  }
  function p(S) {
    return S.setHeader && typeof S.abort == "function";
  }
  function f(S, s, a, w) {
    w = e(w);
    var u = !1;
    S.on("close", function() {
      u = !0;
    }), t === void 0 && (t = Go()), t(S, {
      readable: s,
      writable: a
    }, function(E) {
      if (E) return w(E);
      u = !0, w();
    });
    var d = !1;
    return function(E) {
      if (!u && !d) {
        if (d = !0, p(S)) return S.abort();
        if (typeof S.destroy == "function") return S.destroy();
        w(E || new r("pipe"));
      }
    };
  }
  function b(S) {
    S();
  }
  function A(S, s) {
    return S.pipe(s);
  }
  function o(S) {
    return !S.length || typeof S[S.length - 1] != "function" ? i : S.pop();
  }
  function v() {
    for (var S = arguments.length, s = new Array(S), a = 0; a < S; a++)
      s[a] = arguments[a];
    var w = o(s);
    if (Array.isArray(s[0]) && (s = s[0]), s.length < 2)
      throw new c("streams");
    var u, d = s.map(function(E, _) {
      var I = _ < s.length - 1, P = _ > 0;
      return f(E, I, P, function(D) {
        u || (u = D), D && d.forEach(b), !I && (d.forEach(b), w(u));
      });
    });
    return s.reduce(A);
  }
  return Si = v, Si;
}
var Ri, Df;
function bh() {
  if (Df) return Ri;
  Df = 1, Ri = l;
  var t = nt().EventEmitter, e = it();
  e(l, t), l.Readable = wc(), l.Writable = bc(), l.Duplex = ct(), l.Transform = _c(), l.PassThrough = gh(), l.finished = Go(), l.pipeline = mh(), l.Stream = l;
  function l() {
    t.call(this);
  }
  return l.prototype.pipe = function(c, r) {
    var i = this;
    function p(s) {
      c.writable && c.write(s) === !1 && i.pause && i.pause();
    }
    i.on("data", p);
    function f() {
      i.readable && i.resume && i.resume();
    }
    c.on("drain", f), !c._isStdio && (!r || r.end !== !1) && (i.on("end", A), i.on("close", o));
    var b = !1;
    function A() {
      b || (b = !0, c.end());
    }
    function o() {
      b || (b = !0, typeof c.destroy == "function" && c.destroy());
    }
    function v(s) {
      if (S(), t.listenerCount(this, "error") === 0)
        throw s;
    }
    i.on("error", v), c.on("error", v);
    function S() {
      i.removeListener("data", p), c.removeListener("drain", f), i.removeListener("end", A), i.removeListener("close", o), i.removeListener("error", v), c.removeListener("error", v), i.removeListener("end", S), i.removeListener("close", S), c.removeListener("close", S);
    }
    return i.on("end", S), i.on("close", S), c.on("close", S), c.emit("pipe", i), c;
  }, Ri;
}
var Ai = {}, Pi = { exports: {} }, Ti = {}, Nf;
function Ec() {
  if (Nf) return Ti;
  Nf = 1;
  function t(E) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(_) {
      return typeof _;
    } : function(_) {
      return _ && typeof Symbol == "function" && _.constructor === Symbol && _ !== Symbol.prototype ? "symbol" : typeof _;
    }, t(E);
  }
  function e(E, _, I) {
    return Object.defineProperty(E, "prototype", { writable: !1 }), E;
  }
  function l(E, _) {
    if (!(E instanceof _))
      throw new TypeError("Cannot call a class as a function");
  }
  function c(E, _) {
    if (typeof _ != "function" && _ !== null)
      throw new TypeError("Super expression must either be null or a function");
    E.prototype = Object.create(_ && _.prototype, { constructor: { value: E, writable: !0, configurable: !0 } }), Object.defineProperty(E, "prototype", { writable: !1 }), _ && r(E, _);
  }
  function r(E, _) {
    return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(P, D) {
      return P.__proto__ = D, P;
    }, r(E, _);
  }
  function i(E) {
    var _ = b();
    return function() {
      var P = A(E), D;
      if (_) {
        var x = A(this).constructor;
        D = Reflect.construct(P, arguments, x);
      } else
        D = P.apply(this, arguments);
      return p(this, D);
    };
  }
  function p(E, _) {
    if (_ && (t(_) === "object" || typeof _ == "function"))
      return _;
    if (_ !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return f(E);
  }
  function f(E) {
    if (E === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return E;
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
  function A(E) {
    return A = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(I) {
      return I.__proto__ || Object.getPrototypeOf(I);
    }, A(E);
  }
  var o = {}, v, S;
  function s(E, _, I) {
    I || (I = Error);
    function P(x, q, K) {
      return typeof _ == "string" ? _ : _(x, q, K);
    }
    var D = /* @__PURE__ */ (function(x) {
      c(K, x);
      var q = i(K);
      function K(L, z, y) {
        var F;
        return l(this, K), F = q.call(this, P(L, z, y)), F.code = E, F;
      }
      return e(K);
    })(I);
    o[E] = D;
  }
  function a(E, _) {
    if (Array.isArray(E)) {
      var I = E.length;
      return E = E.map(function(P) {
        return String(P);
      }), I > 2 ? "one of ".concat(_, " ").concat(E.slice(0, I - 1).join(", "), ", or ") + E[I - 1] : I === 2 ? "one of ".concat(_, " ").concat(E[0], " or ").concat(E[1]) : "of ".concat(_, " ").concat(E[0]);
    } else
      return "of ".concat(_, " ").concat(String(E));
  }
  function w(E, _, I) {
    return E.substr(0, _.length) === _;
  }
  function u(E, _, I) {
    return (I === void 0 || I > E.length) && (I = E.length), E.substring(I - _.length, I) === _;
  }
  function d(E, _, I) {
    return typeof I != "number" && (I = 0), I + _.length > E.length ? !1 : E.indexOf(_, I) !== -1;
  }
  return s("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), s("ERR_INVALID_ARG_TYPE", function(E, _, I) {
    v === void 0 && (v = wt()), v(typeof E == "string", "'name' must be a string");
    var P;
    typeof _ == "string" && w(_, "not ") ? (P = "must not be", _ = _.replace(/^not /, "")) : P = "must be";
    var D;
    if (u(E, " argument"))
      D = "The ".concat(E, " ").concat(P, " ").concat(a(_, "type"));
    else {
      var x = d(E, ".") ? "property" : "argument";
      D = 'The "'.concat(E, '" ').concat(x, " ").concat(P, " ").concat(a(_, "type"));
    }
    return D += ". Received type ".concat(t(I)), D;
  }, TypeError), s("ERR_INVALID_ARG_VALUE", function(E, _) {
    var I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
    S === void 0 && (S = Yr());
    var P = S.inspect(_);
    return P.length > 128 && (P = "".concat(P.slice(0, 128), "...")), "The argument '".concat(E, "' ").concat(I, ". Received ").concat(P);
  }, TypeError), s("ERR_INVALID_RETURN_VALUE", function(E, _, I) {
    var P;
    return I && I.constructor && I.constructor.name ? P = "instance of ".concat(I.constructor.name) : P = "type ".concat(t(I)), "Expected ".concat(E, ' to be returned from the "').concat(_, '"') + " function but got ".concat(P, ".");
  }, TypeError), s("ERR_MISSING_ARGS", function() {
    for (var E = arguments.length, _ = new Array(E), I = 0; I < E; I++)
      _[I] = arguments[I];
    v === void 0 && (v = wt()), v(_.length > 0, "At least one arg needs to be specified");
    var P = "The ", D = _.length;
    switch (_ = _.map(function(x) {
      return '"'.concat(x, '"');
    }), D) {
      case 1:
        P += "".concat(_[0], " argument");
        break;
      case 2:
        P += "".concat(_[0], " and ").concat(_[1], " arguments");
        break;
      default:
        P += _.slice(0, D - 1).join(", "), P += ", and ".concat(_[D - 1], " arguments");
        break;
    }
    return "".concat(P, " must be specified");
  }, TypeError), Ti.codes = o, Ti;
}
var Ii, Bf;
function wh() {
  if (Bf) return Ii;
  Bf = 1;
  function t(le, k) {
    var he = Object.keys(le);
    if (Object.getOwnPropertySymbols) {
      var X = Object.getOwnPropertySymbols(le);
      k && (X = X.filter(function(Q) {
        return Object.getOwnPropertyDescriptor(le, Q).enumerable;
      })), he.push.apply(he, X);
    }
    return he;
  }
  function e(le) {
    for (var k = 1; k < arguments.length; k++) {
      var he = arguments[k] != null ? arguments[k] : {};
      k % 2 ? t(Object(he), !0).forEach(function(X) {
        l(le, X, he[X]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(le, Object.getOwnPropertyDescriptors(he)) : t(Object(he)).forEach(function(X) {
        Object.defineProperty(le, X, Object.getOwnPropertyDescriptor(he, X));
      });
    }
    return le;
  }
  function l(le, k, he) {
    return k = p(k), k in le ? Object.defineProperty(le, k, { value: he, enumerable: !0, configurable: !0, writable: !0 }) : le[k] = he, le;
  }
  function c(le, k) {
    if (!(le instanceof k))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(le, k) {
    for (var he = 0; he < k.length; he++) {
      var X = k[he];
      X.enumerable = X.enumerable || !1, X.configurable = !0, "value" in X && (X.writable = !0), Object.defineProperty(le, p(X.key), X);
    }
  }
  function i(le, k, he) {
    return k && r(le.prototype, k), Object.defineProperty(le, "prototype", { writable: !1 }), le;
  }
  function p(le) {
    var k = f(le, "string");
    return E(k) === "symbol" ? k : String(k);
  }
  function f(le, k) {
    if (E(le) !== "object" || le === null) return le;
    var he = le[Symbol.toPrimitive];
    if (he !== void 0) {
      var X = he.call(le, k);
      if (E(X) !== "object") return X;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(le);
  }
  function b(le, k) {
    if (typeof k != "function" && k !== null)
      throw new TypeError("Super expression must either be null or a function");
    le.prototype = Object.create(k && k.prototype, { constructor: { value: le, writable: !0, configurable: !0 } }), Object.defineProperty(le, "prototype", { writable: !1 }), k && u(le, k);
  }
  function A(le) {
    var k = a();
    return function() {
      var X = d(le), Q;
      if (k) {
        var H = d(this).constructor;
        Q = Reflect.construct(X, arguments, H);
      } else
        Q = X.apply(this, arguments);
      return o(this, Q);
    };
  }
  function o(le, k) {
    if (k && (E(k) === "object" || typeof k == "function"))
      return k;
    if (k !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return v(le);
  }
  function v(le) {
    if (le === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return le;
  }
  function S(le) {
    var k = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return S = function(X) {
      if (X === null || !w(X)) return X;
      if (typeof X != "function")
        throw new TypeError("Super expression must either be null or a function");
      if (typeof k < "u") {
        if (k.has(X)) return k.get(X);
        k.set(X, Q);
      }
      function Q() {
        return s(X, arguments, d(this).constructor);
      }
      return Q.prototype = Object.create(X.prototype, { constructor: { value: Q, enumerable: !1, writable: !0, configurable: !0 } }), u(Q, X);
    }, S(le);
  }
  function s(le, k, he) {
    return a() ? s = Reflect.construct.bind() : s = function(Q, H, se) {
      var O = [null];
      O.push.apply(O, H);
      var B = Function.bind.apply(Q, O), C = new B();
      return se && u(C, se.prototype), C;
    }, s.apply(null, arguments);
  }
  function a() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function w(le) {
    return Function.toString.call(le).indexOf("[native code]") !== -1;
  }
  function u(le, k) {
    return u = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(X, Q) {
      return X.__proto__ = Q, X;
    }, u(le, k);
  }
  function d(le) {
    return d = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(he) {
      return he.__proto__ || Object.getPrototypeOf(he);
    }, d(le);
  }
  function E(le) {
    "@babel/helpers - typeof";
    return E = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(k) {
      return typeof k;
    } : function(k) {
      return k && typeof Symbol == "function" && k.constructor === Symbol && k !== Symbol.prototype ? "symbol" : typeof k;
    }, E(le);
  }
  var _ = Yr(), I = _.inspect, P = Ec(), D = P.codes.ERR_INVALID_ARG_TYPE;
  function x(le, k, he) {
    return (he === void 0 || he > le.length) && (he = le.length), le.substring(he - k.length, he) === k;
  }
  function q(le, k) {
    if (k = Math.floor(k), le.length == 0 || k == 0) return "";
    var he = le.length * k;
    for (k = Math.floor(Math.log(k) / Math.log(2)); k; )
      le += le, k--;
    return le += le.substring(0, he - le.length), le;
  }
  var K = "", L = "", z = "", y = "", F = {
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
  function ce(le) {
    var k = Object.keys(le), he = Object.create(Object.getPrototypeOf(le));
    return k.forEach(function(X) {
      he[X] = le[X];
    }), Object.defineProperty(he, "message", {
      value: le.message
    }), he;
  }
  function _e(le) {
    return I(le, {
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
  function be(le, k, he) {
    var X = "", Q = "", H = 0, se = "", O = !1, B = _e(le), C = B.split(`
`), ee = _e(k).split(`
`), te = 0, N = "";
    if (he === "strictEqual" && E(le) === "object" && E(k) === "object" && le !== null && k !== null && (he = "strictEqualObject"), C.length === 1 && ee.length === 1 && C[0] !== ee[0]) {
      var j = C[0].length + ee[0].length;
      if (j <= ie) {
        if ((E(le) !== "object" || le === null) && (E(k) !== "object" || k === null) && (le !== 0 || k !== 0))
          return "".concat(F[he], `

`) + "".concat(C[0], " !== ").concat(ee[0], `
`);
      } else if (he !== "strictEqualObject") {
        var W = Ke.stderr && Ke.stderr.isTTY ? Ke.stderr.columns : 80;
        if (j < W) {
          for (; C[0][te] === ee[0][te]; )
            te++;
          te > 2 && (N = `
  `.concat(q(" ", te), "^"), te = 0);
        }
      }
    }
    for (var oe = C[C.length - 1], we = ee[ee.length - 1]; oe === we && (te++ < 2 ? se = `
  `.concat(oe).concat(se) : X = oe, C.pop(), ee.pop(), !(C.length === 0 || ee.length === 0)); )
      oe = C[C.length - 1], we = ee[ee.length - 1];
    var Se = Math.max(C.length, ee.length);
    if (Se === 0) {
      var Re = B.split(`
`);
      if (Re.length > 30)
        for (Re[26] = "".concat(K, "...").concat(y); Re.length > 27; )
          Re.pop();
      return "".concat(F.notIdentical, `

`).concat(Re.join(`
`), `
`);
    }
    te > 3 && (se = `
`.concat(K, "...").concat(y).concat(se), O = !0), X !== "" && (se = `
  `.concat(X).concat(se), X = "");
    var Oe = 0, re = F[he] + `
`.concat(L, "+ actual").concat(y, " ").concat(z, "- expected").concat(y), De = " ".concat(K, "...").concat(y, " Lines skipped");
    for (te = 0; te < Se; te++) {
      var Le = te - H;
      if (C.length < te + 1)
        Le > 1 && te > 2 && (Le > 4 ? (Q += `
`.concat(K, "...").concat(y), O = !0) : Le > 3 && (Q += `
  `.concat(ee[te - 2]), Oe++), Q += `
  `.concat(ee[te - 1]), Oe++), H = te, X += `
`.concat(z, "-").concat(y, " ").concat(ee[te]), Oe++;
      else if (ee.length < te + 1)
        Le > 1 && te > 2 && (Le > 4 ? (Q += `
`.concat(K, "...").concat(y), O = !0) : Le > 3 && (Q += `
  `.concat(C[te - 2]), Oe++), Q += `
  `.concat(C[te - 1]), Oe++), H = te, Q += `
`.concat(L, "+").concat(y, " ").concat(C[te]), Oe++;
      else {
        var Pe = ee[te], $e = C[te], ve = $e !== Pe && (!x($e, ",") || $e.slice(0, -1) !== Pe);
        ve && x(Pe, ",") && Pe.slice(0, -1) === $e && (ve = !1, $e += ","), ve ? (Le > 1 && te > 2 && (Le > 4 ? (Q += `
`.concat(K, "...").concat(y), O = !0) : Le > 3 && (Q += `
  `.concat(C[te - 2]), Oe++), Q += `
  `.concat(C[te - 1]), Oe++), H = te, Q += `
`.concat(L, "+").concat(y, " ").concat($e), X += `
`.concat(z, "-").concat(y, " ").concat(Pe), Oe += 2) : (Q += X, X = "", (Le === 1 || te === 0) && (Q += `
  `.concat($e), Oe++));
      }
      if (Oe > 20 && te < Se - 2)
        return "".concat(re).concat(De, `
`).concat(Q, `
`).concat(K, "...").concat(y).concat(X, `
`) + "".concat(K, "...").concat(y);
    }
    return "".concat(re).concat(O ? De : "", `
`).concat(Q).concat(X).concat(se).concat(N);
  }
  var ue = /* @__PURE__ */ (function(le, k) {
    b(X, le);
    var he = A(X);
    function X(Q) {
      var H;
      if (c(this, X), E(Q) !== "object" || Q === null)
        throw new D("options", "Object", Q);
      var se = Q.message, O = Q.operator, B = Q.stackStartFn, C = Q.actual, ee = Q.expected, te = Error.stackTraceLimit;
      if (Error.stackTraceLimit = 0, se != null)
        H = he.call(this, String(se));
      else if (Ke.stderr && Ke.stderr.isTTY && (Ke.stderr && Ke.stderr.getColorDepth && Ke.stderr.getColorDepth() !== 1 ? (K = "\x1B[34m", L = "\x1B[32m", y = "\x1B[39m", z = "\x1B[31m") : (K = "", L = "", y = "", z = "")), E(C) === "object" && C !== null && E(ee) === "object" && ee !== null && "stack" in C && C instanceof Error && "stack" in ee && ee instanceof Error && (C = ce(C), ee = ce(ee)), O === "deepStrictEqual" || O === "strictEqual")
        H = he.call(this, be(C, ee, O));
      else if (O === "notDeepStrictEqual" || O === "notStrictEqual") {
        var N = F[O], j = _e(C).split(`
`);
        if (O === "notStrictEqual" && E(C) === "object" && C !== null && (N = F.notStrictEqualObject), j.length > 30)
          for (j[26] = "".concat(K, "...").concat(y); j.length > 27; )
            j.pop();
        j.length === 1 ? H = he.call(this, "".concat(N, " ").concat(j[0])) : H = he.call(this, "".concat(N, `

`).concat(j.join(`
`), `
`));
      } else {
        var W = _e(C), oe = "", we = F[O];
        O === "notDeepEqual" || O === "notEqual" ? (W = "".concat(F[O], `

`).concat(W), W.length > 1024 && (W = "".concat(W.slice(0, 1021), "..."))) : (oe = "".concat(_e(ee)), W.length > 512 && (W = "".concat(W.slice(0, 509), "...")), oe.length > 512 && (oe = "".concat(oe.slice(0, 509), "...")), O === "deepEqual" || O === "equal" ? W = "".concat(we, `

`).concat(W, `

should equal

`) : oe = " ".concat(O, " ").concat(oe)), H = he.call(this, "".concat(W).concat(oe));
      }
      return Error.stackTraceLimit = te, H.generatedMessage = !se, Object.defineProperty(v(H), "name", {
        value: "AssertionError [ERR_ASSERTION]",
        enumerable: !1,
        writable: !0,
        configurable: !0
      }), H.code = "ERR_ASSERTION", H.actual = C, H.expected = ee, H.operator = O, Error.captureStackTrace && Error.captureStackTrace(v(H), B), H.stack, H.name = "AssertionError", o(H);
    }
    return i(X, [{
      key: "toString",
      value: function() {
        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
      }
    }, {
      key: k,
      value: function(H, se) {
        return I(this, e(e({}, se), {}, {
          customInspect: !1,
          depth: 0
        }));
      }
    }]), X;
  })(/* @__PURE__ */ S(Error), I.custom);
  return Ii = ue, Ii;
}
var Oi, Lf;
function Sc() {
  if (Lf) return Oi;
  Lf = 1;
  var t = Object.prototype.toString;
  return Oi = function(l) {
    var c = t.call(l), r = c === "[object Arguments]";
    return r || (r = c !== "[object Array]" && l !== null && typeof l == "object" && typeof l.length == "number" && l.length >= 0 && t.call(l.callee) === "[object Function]"), r;
  }, Oi;
}
var xi, Cf;
function _h() {
  if (Cf) return xi;
  Cf = 1;
  var t;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, l = Object.prototype.toString, c = Sc(), r = Object.prototype.propertyIsEnumerable, i = !r.call({ toString: null }, "toString"), p = r.call(function() {
    }, "prototype"), f = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], b = function(S) {
      var s = S.constructor;
      return s && s.prototype === S;
    }, A = {
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
    }, o = (function() {
      if (typeof window > "u")
        return !1;
      for (var S in window)
        try {
          if (!A["$" + S] && e.call(window, S) && window[S] !== null && typeof window[S] == "object")
            try {
              b(window[S]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), v = function(S) {
      if (typeof window > "u" || !o)
        return b(S);
      try {
        return b(S);
      } catch {
        return !1;
      }
    };
    t = function(s) {
      var a = s !== null && typeof s == "object", w = l.call(s) === "[object Function]", u = c(s), d = a && l.call(s) === "[object String]", E = [];
      if (!a && !w && !u)
        throw new TypeError("Object.keys called on a non-object");
      var _ = p && w;
      if (d && s.length > 0 && !e.call(s, 0))
        for (var I = 0; I < s.length; ++I)
          E.push(String(I));
      if (u && s.length > 0)
        for (var P = 0; P < s.length; ++P)
          E.push(String(P));
      else
        for (var D in s)
          !(_ && D === "prototype") && e.call(s, D) && E.push(String(D));
      if (i)
        for (var x = v(s), q = 0; q < f.length; ++q)
          !(x && f[q] === "constructor") && e.call(s, f[q]) && E.push(f[q]);
      return E;
    };
  }
  return xi = t, xi;
}
var Fi, jf;
function Rc() {
  if (jf) return Fi;
  jf = 1;
  var t = Array.prototype.slice, e = Sc(), l = Object.keys, c = l ? function(p) {
    return l(p);
  } : _h(), r = Object.keys;
  return c.shim = function() {
    if (Object.keys) {
      var p = (function() {
        var f = Object.keys(arguments);
        return f && f.length === arguments.length;
      })(1, 2);
      p || (Object.keys = function(b) {
        return e(b) ? r(t.call(b)) : r(b);
      });
    } else
      Object.keys = c;
    return Object.keys || c;
  }, Fi = c, Fi;
}
var Di, Mf;
function Eh() {
  if (Mf) return Di;
  Mf = 1;
  var t = Rc(), e = qo()(), l = /* @__PURE__ */ ht(), c = /* @__PURE__ */ $o(), r = l("Array.prototype.push"), i = l("Object.prototype.propertyIsEnumerable"), p = e ? c.getOwnPropertySymbols : null;
  return Di = function(b, A) {
    if (b == null)
      throw new TypeError("target must be an object");
    var o = c(b);
    if (arguments.length === 1)
      return o;
    for (var v = 1; v < arguments.length; ++v) {
      var S = c(arguments[v]), s = t(S), a = e && (c.getOwnPropertySymbols || p);
      if (a)
        for (var w = a(S), u = 0; u < w.length; ++u) {
          var d = w[u];
          i(S, d) && r(s, d);
        }
      for (var E = 0; E < s.length; ++E) {
        var _ = s[E];
        if (i(S, _)) {
          var I = S[_];
          o[_] = I;
        }
      }
    }
    return o;
  }, Di;
}
var Ni, kf;
function Sh() {
  if (kf) return Ni;
  kf = 1;
  var t = Eh(), e = function() {
    if (!Object.assign)
      return !1;
    for (var c = "abcdefghijklmnopqrst", r = c.split(""), i = {}, p = 0; p < r.length; ++p)
      i[r[p]] = r[p];
    var f = Object.assign({}, i), b = "";
    for (var A in f)
      b += A;
    return c !== b;
  }, l = function() {
    if (!Object.assign || !Object.preventExtensions)
      return !1;
    var c = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(c, "xy");
    } catch {
      return c[1] === "y";
    }
    return !1;
  };
  return Ni = function() {
    return !Object.assign || e() || l() ? t : Object.assign;
  }, Ni;
}
var Bi, qf;
function Ac() {
  if (qf) return Bi;
  qf = 1;
  var t = function(e) {
    return e !== e;
  };
  return Bi = function(l, c) {
    return l === 0 && c === 0 ? 1 / l === 1 / c : !!(l === c || t(l) && t(c));
  }, Bi;
}
var Li, $f;
function Zo() {
  if ($f) return Li;
  $f = 1;
  var t = Ac();
  return Li = function() {
    return typeof Object.is == "function" ? Object.is : t;
  }, Li;
}
var Ci, Uf;
function Rh() {
  if (Uf) return Ci;
  Uf = 1;
  var t = /* @__PURE__ */ Vo(), e = Vt(), l = e(t("String.prototype.indexOf"));
  return Ci = function(r, i) {
    var p = t(r, !!i);
    return typeof p == "function" && l(r, ".prototype.") > -1 ? e(p) : p;
  }, Ci;
}
var ji, zf;
function Gt() {
  if (zf) return ji;
  zf = 1;
  var t = Rc(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", l = Object.prototype.toString, c = Array.prototype.concat, r = /* @__PURE__ */ pc(), i = function(A) {
    return typeof A == "function" && l.call(A) === "[object Function]";
  }, p = /* @__PURE__ */ yc()(), f = function(A, o, v, S) {
    if (o in A) {
      if (S === !0) {
        if (A[o] === v)
          return;
      } else if (!i(S) || !S())
        return;
    }
    p ? r(A, o, v, !0) : r(A, o, v);
  }, b = function(A, o) {
    var v = arguments.length > 2 ? arguments[2] : {}, S = t(o);
    e && (S = c.call(S, Object.getOwnPropertySymbols(o)));
    for (var s = 0; s < S.length; s += 1)
      f(A, S[s], o[S[s]], v[S[s]]);
  };
  return b.supportsDescriptors = !!p, ji = b, ji;
}
var Mi, Wf;
function Ah() {
  if (Wf) return Mi;
  Wf = 1;
  var t = Zo(), e = Gt();
  return Mi = function() {
    var c = t();
    return e(Object, { is: c }, {
      is: function() {
        return Object.is !== c;
      }
    }), c;
  }, Mi;
}
var ki, Hf;
function Ph() {
  if (Hf) return ki;
  Hf = 1;
  var t = Gt(), e = Vt(), l = Ac(), c = Zo(), r = Ah(), i = e(c(), Object);
  return t(i, {
    getPolyfill: c,
    implementation: l,
    shim: r
  }), ki = i, ki;
}
var qi, Vf;
function Pc() {
  return Vf || (Vf = 1, qi = function(e) {
    return e !== e;
  }), qi;
}
var $i, Gf;
function Tc() {
  if (Gf) return $i;
  Gf = 1;
  var t = Pc();
  return $i = function() {
    return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : t;
  }, $i;
}
var Ui, Zf;
function Th() {
  if (Zf) return Ui;
  Zf = 1;
  var t = Gt(), e = Tc();
  return Ui = function() {
    var c = e();
    return t(Number, { isNaN: c }, {
      isNaN: function() {
        return Number.isNaN !== c;
      }
    }), c;
  }, Ui;
}
var zi, Kf;
function Ih() {
  if (Kf) return zi;
  Kf = 1;
  var t = Vt(), e = Gt(), l = Pc(), c = Tc(), r = Th(), i = t(c(), Number);
  return e(i, {
    getPolyfill: c,
    implementation: l,
    shim: r
  }), zi = i, zi;
}
var Wi, Yf;
function Oh() {
  if (Yf) return Wi;
  Yf = 1;
  function t(ve, Ee) {
    return i(ve) || r(ve, Ee) || l(ve, Ee) || e();
  }
  function e() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function l(ve, Ee) {
    if (ve) {
      if (typeof ve == "string") return c(ve, Ee);
      var je = Object.prototype.toString.call(ve).slice(8, -1);
      if (je === "Object" && ve.constructor && (je = ve.constructor.name), je === "Map" || je === "Set") return Array.from(ve);
      if (je === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(je)) return c(ve, Ee);
    }
  }
  function c(ve, Ee) {
    (Ee == null || Ee > ve.length) && (Ee = ve.length);
    for (var je = 0, qe = new Array(Ee); je < Ee; je++) qe[je] = ve[je];
    return qe;
  }
  function r(ve, Ee) {
    var je = ve == null ? null : typeof Symbol < "u" && ve[Symbol.iterator] || ve["@@iterator"];
    if (je != null) {
      var qe, Me, We, $, n = [], g = !0, U = !1;
      try {
        if (We = (je = je.call(ve)).next, Ee !== 0) for (; !(g = (qe = We.call(je)).done) && (n.push(qe.value), n.length !== Ee); g = !0) ;
      } catch (fe) {
        U = !0, Me = fe;
      } finally {
        try {
          if (!g && je.return != null && ($ = je.return(), Object($) !== $)) return;
        } finally {
          if (U) throw Me;
        }
      }
      return n;
    }
  }
  function i(ve) {
    if (Array.isArray(ve)) return ve;
  }
  function p(ve) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Ee) {
      return typeof Ee;
    } : function(Ee) {
      return Ee && typeof Symbol == "function" && Ee.constructor === Symbol && Ee !== Symbol.prototype ? "symbol" : typeof Ee;
    }, p(ve);
  }
  var f = /a/g.flags !== void 0, b = function(Ee) {
    var je = [];
    return Ee.forEach(function(qe) {
      return je.push(qe);
    }), je;
  }, A = function(Ee) {
    var je = [];
    return Ee.forEach(function(qe, Me) {
      return je.push([Me, qe]);
    }), je;
  }, o = Object.is ? Object.is : Ph(), v = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
    return [];
  }, S = Number.isNaN ? Number.isNaN : Ih();
  function s(ve) {
    return ve.call.bind(ve);
  }
  var a = s(Object.prototype.hasOwnProperty), w = s(Object.prototype.propertyIsEnumerable), u = s(Object.prototype.toString), d = Yr().types, E = d.isAnyArrayBuffer, _ = d.isArrayBufferView, I = d.isDate, P = d.isMap, D = d.isRegExp, x = d.isSet, q = d.isNativeError, K = d.isBoxedPrimitive, L = d.isNumberObject, z = d.isStringObject, y = d.isBooleanObject, F = d.isBigIntObject, ie = d.isSymbolObject, ce = d.isFloat32Array, _e = d.isFloat64Array;
  function be(ve) {
    if (ve.length === 0 || ve.length > 10) return !0;
    for (var Ee = 0; Ee < ve.length; Ee++) {
      var je = ve.charCodeAt(Ee);
      if (je < 48 || je > 57) return !0;
    }
    return ve.length === 10 && ve >= Math.pow(2, 32);
  }
  function ue(ve) {
    return Object.keys(ve).filter(be).concat(v(ve).filter(Object.prototype.propertyIsEnumerable.bind(ve)));
  }
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  function le(ve, Ee) {
    if (ve === Ee)
      return 0;
    for (var je = ve.length, qe = Ee.length, Me = 0, We = Math.min(je, qe); Me < We; ++Me)
      if (ve[Me] !== Ee[Me]) {
        je = ve[Me], qe = Ee[Me];
        break;
      }
    return je < qe ? -1 : qe < je ? 1 : 0;
  }
  var k = !0, he = !1, X = 0, Q = 1, H = 2, se = 3;
  function O(ve, Ee) {
    return f ? ve.source === Ee.source && ve.flags === Ee.flags : RegExp.prototype.toString.call(ve) === RegExp.prototype.toString.call(Ee);
  }
  function B(ve, Ee) {
    if (ve.byteLength !== Ee.byteLength)
      return !1;
    for (var je = 0; je < ve.byteLength; je++)
      if (ve[je] !== Ee[je])
        return !1;
    return !0;
  }
  function C(ve, Ee) {
    return ve.byteLength !== Ee.byteLength ? !1 : le(new Uint8Array(ve.buffer, ve.byteOffset, ve.byteLength), new Uint8Array(Ee.buffer, Ee.byteOffset, Ee.byteLength)) === 0;
  }
  function ee(ve, Ee) {
    return ve.byteLength === Ee.byteLength && le(new Uint8Array(ve), new Uint8Array(Ee)) === 0;
  }
  function te(ve, Ee) {
    return L(ve) ? L(Ee) && o(Number.prototype.valueOf.call(ve), Number.prototype.valueOf.call(Ee)) : z(ve) ? z(Ee) && String.prototype.valueOf.call(ve) === String.prototype.valueOf.call(Ee) : y(ve) ? y(Ee) && Boolean.prototype.valueOf.call(ve) === Boolean.prototype.valueOf.call(Ee) : F(ve) ? F(Ee) && BigInt.prototype.valueOf.call(ve) === BigInt.prototype.valueOf.call(Ee) : ie(Ee) && Symbol.prototype.valueOf.call(ve) === Symbol.prototype.valueOf.call(Ee);
  }
  function N(ve, Ee, je, qe) {
    if (ve === Ee)
      return ve !== 0 ? !0 : je ? o(ve, Ee) : !0;
    if (je) {
      if (p(ve) !== "object")
        return typeof ve == "number" && S(ve) && S(Ee);
      if (p(Ee) !== "object" || ve === null || Ee === null || Object.getPrototypeOf(ve) !== Object.getPrototypeOf(Ee))
        return !1;
    } else {
      if (ve === null || p(ve) !== "object")
        return Ee === null || p(Ee) !== "object" ? ve == Ee : !1;
      if (Ee === null || p(Ee) !== "object")
        return !1;
    }
    var Me = u(ve), We = u(Ee);
    if (Me !== We)
      return !1;
    if (Array.isArray(ve)) {
      if (ve.length !== Ee.length)
        return !1;
      var $ = ue(ve), n = ue(Ee);
      return $.length !== n.length ? !1 : W(ve, Ee, je, qe, Q, $);
    }
    if (Me === "[object Object]" && (!P(ve) && P(Ee) || !x(ve) && x(Ee)))
      return !1;
    if (I(ve)) {
      if (!I(Ee) || Date.prototype.getTime.call(ve) !== Date.prototype.getTime.call(Ee))
        return !1;
    } else if (D(ve)) {
      if (!D(Ee) || !O(ve, Ee))
        return !1;
    } else if (q(ve) || ve instanceof Error) {
      if (ve.message !== Ee.message || ve.name !== Ee.name)
        return !1;
    } else if (_(ve)) {
      if (!je && (ce(ve) || _e(ve))) {
        if (!B(ve, Ee))
          return !1;
      } else if (!C(ve, Ee))
        return !1;
      var g = ue(ve), U = ue(Ee);
      return g.length !== U.length ? !1 : W(ve, Ee, je, qe, X, g);
    } else {
      if (x(ve))
        return !x(Ee) || ve.size !== Ee.size ? !1 : W(ve, Ee, je, qe, H);
      if (P(ve))
        return !P(Ee) || ve.size !== Ee.size ? !1 : W(ve, Ee, je, qe, se);
      if (E(ve)) {
        if (!ee(ve, Ee))
          return !1;
      } else if (K(ve) && !te(ve, Ee))
        return !1;
    }
    return W(ve, Ee, je, qe, X);
  }
  function j(ve, Ee) {
    return Ee.filter(function(je) {
      return w(ve, je);
    });
  }
  function W(ve, Ee, je, qe, Me, We) {
    if (arguments.length === 5) {
      We = Object.keys(ve);
      var $ = Object.keys(Ee);
      if (We.length !== $.length)
        return !1;
    }
    for (var n = 0; n < We.length; n++)
      if (!a(Ee, We[n]))
        return !1;
    if (je && arguments.length === 5) {
      var g = v(ve);
      if (g.length !== 0) {
        var U = 0;
        for (n = 0; n < g.length; n++) {
          var fe = g[n];
          if (w(ve, fe)) {
            if (!w(Ee, fe))
              return !1;
            We.push(fe), U++;
          } else if (w(Ee, fe))
            return !1;
        }
        var J = v(Ee);
        if (g.length !== J.length && j(Ee, J).length !== U)
          return !1;
      } else {
        var de = v(Ee);
        if (de.length !== 0 && j(Ee, de).length !== 0)
          return !1;
      }
    }
    if (We.length === 0 && (Me === X || Me === Q && ve.length === 0 || ve.size === 0))
      return !0;
    if (qe === void 0)
      qe = {
        val1: /* @__PURE__ */ new Map(),
        val2: /* @__PURE__ */ new Map(),
        position: 0
      };
    else {
      var M = qe.val1.get(ve);
      if (M !== void 0) {
        var Be = qe.val2.get(Ee);
        if (Be !== void 0)
          return M === Be;
      }
      qe.position++;
    }
    qe.val1.set(ve, qe.position), qe.val2.set(Ee, qe.position);
    var ze = Le(ve, Ee, je, We, qe, Me);
    return qe.val1.delete(ve), qe.val2.delete(Ee), ze;
  }
  function oe(ve, Ee, je, qe) {
    for (var Me = b(ve), We = 0; We < Me.length; We++) {
      var $ = Me[We];
      if (N(Ee, $, je, qe))
        return ve.delete($), !0;
    }
    return !1;
  }
  function we(ve) {
    switch (p(ve)) {
      case "undefined":
        return null;
      case "object":
        return;
      case "symbol":
        return !1;
      case "string":
        ve = +ve;
      // Loose equal entries exist only if the string is possible to convert to
      // a regular number and not NaN.
      // Fall through
      case "number":
        if (S(ve))
          return !1;
    }
    return !0;
  }
  function Se(ve, Ee, je) {
    var qe = we(je);
    return qe ?? (Ee.has(qe) && !ve.has(qe));
  }
  function Re(ve, Ee, je, qe, Me) {
    var We = we(je);
    if (We != null)
      return We;
    var $ = Ee.get(We);
    return $ === void 0 && !Ee.has(We) || !N(qe, $, !1, Me) ? !1 : !ve.has(We) && N(qe, $, !1, Me);
  }
  function Oe(ve, Ee, je, qe) {
    for (var Me = null, We = b(ve), $ = 0; $ < We.length; $++) {
      var n = We[$];
      if (p(n) === "object" && n !== null)
        Me === null && (Me = /* @__PURE__ */ new Set()), Me.add(n);
      else if (!Ee.has(n)) {
        if (je || !Se(ve, Ee, n))
          return !1;
        Me === null && (Me = /* @__PURE__ */ new Set()), Me.add(n);
      }
    }
    if (Me !== null) {
      for (var g = b(Ee), U = 0; U < g.length; U++) {
        var fe = g[U];
        if (p(fe) === "object" && fe !== null) {
          if (!oe(Me, fe, je, qe)) return !1;
        } else if (!je && !ve.has(fe) && !oe(Me, fe, je, qe))
          return !1;
      }
      return Me.size === 0;
    }
    return !0;
  }
  function re(ve, Ee, je, qe, Me, We) {
    for (var $ = b(ve), n = 0; n < $.length; n++) {
      var g = $[n];
      if (N(je, g, Me, We) && N(qe, Ee.get(g), Me, We))
        return ve.delete(g), !0;
    }
    return !1;
  }
  function De(ve, Ee, je, qe) {
    for (var Me = null, We = A(ve), $ = 0; $ < We.length; $++) {
      var n = t(We[$], 2), g = n[0], U = n[1];
      if (p(g) === "object" && g !== null)
        Me === null && (Me = /* @__PURE__ */ new Set()), Me.add(g);
      else {
        var fe = Ee.get(g);
        if (fe === void 0 && !Ee.has(g) || !N(U, fe, je, qe)) {
          if (je || !Re(ve, Ee, g, U, qe)) return !1;
          Me === null && (Me = /* @__PURE__ */ new Set()), Me.add(g);
        }
      }
    }
    if (Me !== null) {
      for (var J = A(Ee), de = 0; de < J.length; de++) {
        var M = t(J[de], 2), Be = M[0], ze = M[1];
        if (p(Be) === "object" && Be !== null) {
          if (!re(Me, ve, Be, ze, je, qe)) return !1;
        } else if (!je && (!ve.has(Be) || !N(ve.get(Be), ze, !1, qe)) && !re(Me, ve, Be, ze, !1, qe))
          return !1;
      }
      return Me.size === 0;
    }
    return !0;
  }
  function Le(ve, Ee, je, qe, Me, We) {
    var $ = 0;
    if (We === H) {
      if (!Oe(ve, Ee, je, Me))
        return !1;
    } else if (We === se) {
      if (!De(ve, Ee, je, Me))
        return !1;
    } else if (We === Q)
      for (; $ < ve.length; $++)
        if (a(ve, $)) {
          if (!a(Ee, $) || !N(ve[$], Ee[$], je, Me))
            return !1;
        } else {
          if (a(Ee, $))
            return !1;
          for (var n = Object.keys(ve); $ < n.length; $++) {
            var g = n[$];
            if (!a(Ee, g) || !N(ve[g], Ee[g], je, Me))
              return !1;
          }
          return n.length === Object.keys(Ee).length;
        }
    for ($ = 0; $ < qe.length; $++) {
      var U = qe[$];
      if (!N(ve[U], Ee[U], je, Me))
        return !1;
    }
    return !0;
  }
  function Pe(ve, Ee) {
    return N(ve, Ee, he);
  }
  function $e(ve, Ee) {
    return N(ve, Ee, k);
  }
  return Wi = {
    isDeepEqual: Pe,
    isDeepStrictEqual: $e
  }, Wi;
}
var Qf;
function wt() {
  if (Qf) return Pi.exports;
  Qf = 1;
  function t(H) {
    "@babel/helpers - typeof";
    return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(se) {
      return typeof se;
    } : function(se) {
      return se && typeof Symbol == "function" && se.constructor === Symbol && se !== Symbol.prototype ? "symbol" : typeof se;
    }, t(H);
  }
  function e(H, se, O) {
    return Object.defineProperty(H, "prototype", { writable: !1 }), H;
  }
  function l(H, se) {
    if (!(H instanceof se))
      throw new TypeError("Cannot call a class as a function");
  }
  var c = Ec(), r = c.codes, i = r.ERR_AMBIGUOUS_ARGUMENT, p = r.ERR_INVALID_ARG_TYPE, f = r.ERR_INVALID_ARG_VALUE, b = r.ERR_INVALID_RETURN_VALUE, A = r.ERR_MISSING_ARGS, o = wh(), v = Yr(), S = v.inspect, s = Yr().types, a = s.isPromise, w = s.isRegExp, u = Sh()(), d = Zo()(), E = Rh()("RegExp.prototype.test"), _, I;
  function P() {
    var H = Oh();
    _ = H.isDeepEqual, I = H.isDeepStrictEqual;
  }
  var D = !1, x = Pi.exports = y, q = {};
  function K(H) {
    throw H.message instanceof Error ? H.message : new o(H);
  }
  function L(H, se, O, B, C) {
    var ee = arguments.length, te;
    if (ee === 0)
      te = "Failed";
    else if (ee === 1)
      O = H, H = void 0;
    else {
      if (D === !1) {
        D = !0;
        var N = Ke.emitWarning ? Ke.emitWarning : console.warn.bind(console);
        N("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
      }
      ee === 2 && (B = "!=");
    }
    if (O instanceof Error) throw O;
    var j = {
      actual: H,
      expected: se,
      operator: B === void 0 ? "fail" : B,
      stackStartFn: C || L
    };
    O !== void 0 && (j.message = O);
    var W = new o(j);
    throw te && (W.message = te, W.generatedMessage = !0), W;
  }
  x.fail = L, x.AssertionError = o;
  function z(H, se, O, B) {
    if (!O) {
      var C = !1;
      if (se === 0)
        C = !0, B = "No value argument passed to `assert.ok()`";
      else if (B instanceof Error)
        throw B;
      var ee = new o({
        actual: O,
        expected: !0,
        message: B,
        operator: "==",
        stackStartFn: H
      });
      throw ee.generatedMessage = C, ee;
    }
  }
  function y() {
    for (var H = arguments.length, se = new Array(H), O = 0; O < H; O++)
      se[O] = arguments[O];
    z.apply(void 0, [y, se.length].concat(se));
  }
  x.ok = y, x.equal = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    se != O && K({
      actual: se,
      expected: O,
      message: B,
      operator: "==",
      stackStartFn: H
    });
  }, x.notEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    se == O && K({
      actual: se,
      expected: O,
      message: B,
      operator: "!=",
      stackStartFn: H
    });
  }, x.deepEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    _ === void 0 && P(), _(se, O) || K({
      actual: se,
      expected: O,
      message: B,
      operator: "deepEqual",
      stackStartFn: H
    });
  }, x.notDeepEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    _ === void 0 && P(), _(se, O) && K({
      actual: se,
      expected: O,
      message: B,
      operator: "notDeepEqual",
      stackStartFn: H
    });
  }, x.deepStrictEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    _ === void 0 && P(), I(se, O) || K({
      actual: se,
      expected: O,
      message: B,
      operator: "deepStrictEqual",
      stackStartFn: H
    });
  }, x.notDeepStrictEqual = F;
  function F(H, se, O) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    _ === void 0 && P(), I(H, se) && K({
      actual: H,
      expected: se,
      message: O,
      operator: "notDeepStrictEqual",
      stackStartFn: F
    });
  }
  x.strictEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    d(se, O) || K({
      actual: se,
      expected: O,
      message: B,
      operator: "strictEqual",
      stackStartFn: H
    });
  }, x.notStrictEqual = function H(se, O, B) {
    if (arguments.length < 2)
      throw new A("actual", "expected");
    d(se, O) && K({
      actual: se,
      expected: O,
      message: B,
      operator: "notStrictEqual",
      stackStartFn: H
    });
  };
  var ie = /* @__PURE__ */ e(function H(se, O, B) {
    var C = this;
    l(this, H), O.forEach(function(ee) {
      ee in se && (B !== void 0 && typeof B[ee] == "string" && w(se[ee]) && E(se[ee], B[ee]) ? C[ee] = B[ee] : C[ee] = se[ee]);
    });
  });
  function ce(H, se, O, B, C, ee) {
    if (!(O in H) || !I(H[O], se[O])) {
      if (!B) {
        var te = new ie(H, C), N = new ie(se, C, H), j = new o({
          actual: te,
          expected: N,
          operator: "deepStrictEqual",
          stackStartFn: ee
        });
        throw j.actual = H, j.expected = se, j.operator = ee.name, j;
      }
      K({
        actual: H,
        expected: se,
        message: B,
        operator: ee.name,
        stackStartFn: ee
      });
    }
  }
  function _e(H, se, O, B) {
    if (typeof se != "function") {
      if (w(se)) return E(se, H);
      if (arguments.length === 2)
        throw new p("expected", ["Function", "RegExp"], se);
      if (t(H) !== "object" || H === null) {
        var C = new o({
          actual: H,
          expected: se,
          message: O,
          operator: "deepStrictEqual",
          stackStartFn: B
        });
        throw C.operator = B.name, C;
      }
      var ee = Object.keys(se);
      if (se instanceof Error)
        ee.push("name", "message");
      else if (ee.length === 0)
        throw new f("error", se, "may not be an empty object");
      return _ === void 0 && P(), ee.forEach(function(te) {
        typeof H[te] == "string" && w(se[te]) && E(se[te], H[te]) || ce(H, se, te, O, ee, B);
      }), !0;
    }
    return se.prototype !== void 0 && H instanceof se ? !0 : Error.isPrototypeOf(se) ? !1 : se.call({}, H) === !0;
  }
  function be(H) {
    if (typeof H != "function")
      throw new p("fn", "Function", H);
    try {
      H();
    } catch (se) {
      return se;
    }
    return q;
  }
  function ue(H) {
    return a(H) || H !== null && t(H) === "object" && typeof H.then == "function" && typeof H.catch == "function";
  }
  function le(H) {
    return Promise.resolve().then(function() {
      var se;
      if (typeof H == "function") {
        if (se = H(), !ue(se))
          throw new b("instance of Promise", "promiseFn", se);
      } else if (ue(H))
        se = H;
      else
        throw new p("promiseFn", ["Function", "Promise"], H);
      return Promise.resolve().then(function() {
        return se;
      }).then(function() {
        return q;
      }).catch(function(O) {
        return O;
      });
    });
  }
  function k(H, se, O, B) {
    if (typeof O == "string") {
      if (arguments.length === 4)
        throw new p("error", ["Object", "Error", "Function", "RegExp"], O);
      if (t(se) === "object" && se !== null) {
        if (se.message === O)
          throw new i("error/message", 'The error message "'.concat(se.message, '" is identical to the message.'));
      } else if (se === O)
        throw new i("error/message", 'The error "'.concat(se, '" is identical to the message.'));
      B = O, O = void 0;
    } else if (O != null && t(O) !== "object" && typeof O != "function")
      throw new p("error", ["Object", "Error", "Function", "RegExp"], O);
    if (se === q) {
      var C = "";
      O && O.name && (C += " (".concat(O.name, ")")), C += B ? ": ".concat(B) : ".";
      var ee = H.name === "rejects" ? "rejection" : "exception";
      K({
        actual: void 0,
        expected: O,
        operator: H.name,
        message: "Missing expected ".concat(ee).concat(C),
        stackStartFn: H
      });
    }
    if (O && !_e(se, O, B, H))
      throw se;
  }
  function he(H, se, O, B) {
    if (se !== q) {
      if (typeof O == "string" && (B = O, O = void 0), !O || _e(se, O)) {
        var C = B ? ": ".concat(B) : ".", ee = H.name === "doesNotReject" ? "rejection" : "exception";
        K({
          actual: se,
          expected: O,
          operator: H.name,
          message: "Got unwanted ".concat(ee).concat(C, `
`) + 'Actual message: "'.concat(se && se.message, '"'),
          stackStartFn: H
        });
      }
      throw se;
    }
  }
  x.throws = function H(se) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), C = 1; C < O; C++)
      B[C - 1] = arguments[C];
    k.apply(void 0, [H, be(se)].concat(B));
  }, x.rejects = function H(se) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), C = 1; C < O; C++)
      B[C - 1] = arguments[C];
    return le(se).then(function(ee) {
      return k.apply(void 0, [H, ee].concat(B));
    });
  }, x.doesNotThrow = function H(se) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), C = 1; C < O; C++)
      B[C - 1] = arguments[C];
    he.apply(void 0, [H, be(se)].concat(B));
  }, x.doesNotReject = function H(se) {
    for (var O = arguments.length, B = new Array(O > 1 ? O - 1 : 0), C = 1; C < O; C++)
      B[C - 1] = arguments[C];
    return le(se).then(function(ee) {
      return he.apply(void 0, [H, ee].concat(B));
    });
  }, x.ifError = function H(se) {
    if (se != null) {
      var O = "ifError got unwanted exception: ";
      t(se) === "object" && typeof se.message == "string" ? se.message.length === 0 && se.constructor ? O += se.constructor.name : O += se.message : O += S(se);
      var B = new o({
        actual: se,
        expected: null,
        operator: "ifError",
        message: O,
        stackStartFn: H
      }), C = se.stack;
      if (typeof C == "string") {
        var ee = C.split(`
`);
        ee.shift();
        for (var te = B.stack.split(`
`), N = 0; N < ee.length; N++) {
          var j = te.indexOf(ee[N]);
          if (j !== -1) {
            te = te.slice(0, j);
            break;
          }
        }
        B.stack = "".concat(te.join(`
`), `
`).concat(ee.join(`
`));
      }
      throw B;
    }
  };
  function X(H, se, O, B, C) {
    if (!w(se))
      throw new p("regexp", "RegExp", se);
    var ee = C === "match";
    if (typeof H != "string" || E(se, H) !== ee) {
      if (O instanceof Error)
        throw O;
      var te = !O;
      O = O || (typeof H != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(t(H), " (").concat(S(H), ")") : (ee ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(S(se), `. Input:

`).concat(S(H), `
`));
      var N = new o({
        actual: H,
        expected: se,
        message: O,
        operator: C,
        stackStartFn: B
      });
      throw N.generatedMessage = te, N;
    }
  }
  x.match = function H(se, O, B) {
    X(se, O, B, H, "match");
  }, x.doesNotMatch = function H(se, O, B) {
    X(se, O, B, H, "doesNotMatch");
  };
  function Q() {
    for (var H = arguments.length, se = new Array(H), O = 0; O < H; O++)
      se[O] = arguments[O];
    z.apply(void 0, [Q, se.length].concat(se));
  }
  return x.strict = u(Q, x, {
    equal: x.strictEqual,
    deepEqual: x.deepStrictEqual,
    notEqual: x.notStrictEqual,
    notDeepEqual: x.notDeepStrictEqual
  }), x.strict.strict = x.strict, Pi.exports;
}
var Hi, Jf;
function xh() {
  if (Jf) return Hi;
  Jf = 1;
  function t() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return Hi = t, Hi;
}
var xr = {}, Vi = {}, Xf;
function Zt() {
  return Xf || (Xf = 1, (function(t) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function l(i, p) {
      return Object.prototype.hasOwnProperty.call(i, p);
    }
    t.assign = function(i) {
      for (var p = Array.prototype.slice.call(arguments, 1); p.length; ) {
        var f = p.shift();
        if (f) {
          if (typeof f != "object")
            throw new TypeError(f + "must be non-object");
          for (var b in f)
            l(f, b) && (i[b] = f[b]);
        }
      }
      return i;
    }, t.shrinkBuf = function(i, p) {
      return i.length === p ? i : i.subarray ? i.subarray(0, p) : (i.length = p, i);
    };
    var c = {
      arraySet: function(i, p, f, b, A) {
        if (p.subarray && i.subarray) {
          i.set(p.subarray(f, f + b), A);
          return;
        }
        for (var o = 0; o < b; o++)
          i[A + o] = p[f + o];
      },
      // Join array of chunks to single array.
      flattenChunks: function(i) {
        var p, f, b, A, o, v;
        for (b = 0, p = 0, f = i.length; p < f; p++)
          b += i[p].length;
        for (v = new Uint8Array(b), A = 0, p = 0, f = i.length; p < f; p++)
          o = i[p], v.set(o, A), A += o.length;
        return v;
      }
    }, r = {
      arraySet: function(i, p, f, b, A) {
        for (var o = 0; o < b; o++)
          i[A + o] = p[f + o];
      },
      // Join array of chunks to single array.
      flattenChunks: function(i) {
        return [].concat.apply([], i);
      }
    };
    t.setTyped = function(i) {
      i ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, c)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, r));
    }, t.setTyped(e);
  })(Vi)), Vi;
}
var rt = {}, el;
function Fh() {
  if (el) return rt;
  el = 1;
  var t = Zt(), e = 4, l = 0, c = 1, r = 2;
  function i(n) {
    for (var g = n.length; --g >= 0; )
      n[g] = 0;
  }
  var p = 0, f = 1, b = 2, A = 3, o = 258, v = 29, S = 256, s = S + 1 + v, a = 30, w = 19, u = 2 * s + 1, d = 15, E = 16, _ = 7, I = 256, P = 16, D = 17, x = 18, q = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), K = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), L = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], y = 512, F = new Array((s + 2) * 2);
  i(F);
  var ie = new Array(a * 2);
  i(ie);
  var ce = new Array(y);
  i(ce);
  var _e = new Array(o - A + 1);
  i(_e);
  var be = new Array(v);
  i(be);
  var ue = new Array(a);
  i(ue);
  function le(n, g, U, fe, J) {
    this.static_tree = n, this.extra_bits = g, this.extra_base = U, this.elems = fe, this.max_length = J, this.has_stree = n && n.length;
  }
  var k, he, X;
  function Q(n, g) {
    this.dyn_tree = n, this.max_code = 0, this.stat_desc = g;
  }
  function H(n) {
    return n < 256 ? ce[n] : ce[256 + (n >>> 7)];
  }
  function se(n, g) {
    n.pending_buf[n.pending++] = g & 255, n.pending_buf[n.pending++] = g >>> 8 & 255;
  }
  function O(n, g, U) {
    n.bi_valid > E - U ? (n.bi_buf |= g << n.bi_valid & 65535, se(n, n.bi_buf), n.bi_buf = g >> E - n.bi_valid, n.bi_valid += U - E) : (n.bi_buf |= g << n.bi_valid & 65535, n.bi_valid += U);
  }
  function B(n, g, U) {
    O(
      n,
      U[g * 2],
      U[g * 2 + 1]
      /*.Len*/
    );
  }
  function C(n, g) {
    var U = 0;
    do
      U |= n & 1, n >>>= 1, U <<= 1;
    while (--g > 0);
    return U >>> 1;
  }
  function ee(n) {
    n.bi_valid === 16 ? (se(n, n.bi_buf), n.bi_buf = 0, n.bi_valid = 0) : n.bi_valid >= 8 && (n.pending_buf[n.pending++] = n.bi_buf & 255, n.bi_buf >>= 8, n.bi_valid -= 8);
  }
  function te(n, g) {
    var U = g.dyn_tree, fe = g.max_code, J = g.stat_desc.static_tree, de = g.stat_desc.has_stree, M = g.stat_desc.extra_bits, Be = g.stat_desc.extra_base, ze = g.stat_desc.max_length, R, Ie, Ne, V, me, Fe, Ve = 0;
    for (V = 0; V <= d; V++)
      n.bl_count[V] = 0;
    for (U[n.heap[n.heap_max] * 2 + 1] = 0, R = n.heap_max + 1; R < u; R++)
      Ie = n.heap[R], V = U[U[Ie * 2 + 1] * 2 + 1] + 1, V > ze && (V = ze, Ve++), U[Ie * 2 + 1] = V, !(Ie > fe) && (n.bl_count[V]++, me = 0, Ie >= Be && (me = M[Ie - Be]), Fe = U[Ie * 2], n.opt_len += Fe * (V + me), de && (n.static_len += Fe * (J[Ie * 2 + 1] + me)));
    if (Ve !== 0) {
      do {
        for (V = ze - 1; n.bl_count[V] === 0; )
          V--;
        n.bl_count[V]--, n.bl_count[V + 1] += 2, n.bl_count[ze]--, Ve -= 2;
      } while (Ve > 0);
      for (V = ze; V !== 0; V--)
        for (Ie = n.bl_count[V]; Ie !== 0; )
          Ne = n.heap[--R], !(Ne > fe) && (U[Ne * 2 + 1] !== V && (n.opt_len += (V - U[Ne * 2 + 1]) * U[Ne * 2], U[Ne * 2 + 1] = V), Ie--);
    }
  }
  function N(n, g, U) {
    var fe = new Array(d + 1), J = 0, de, M;
    for (de = 1; de <= d; de++)
      fe[de] = J = J + U[de - 1] << 1;
    for (M = 0; M <= g; M++) {
      var Be = n[M * 2 + 1];
      Be !== 0 && (n[M * 2] = C(fe[Be]++, Be));
    }
  }
  function j() {
    var n, g, U, fe, J, de = new Array(d + 1);
    for (U = 0, fe = 0; fe < v - 1; fe++)
      for (be[fe] = U, n = 0; n < 1 << q[fe]; n++)
        _e[U++] = fe;
    for (_e[U - 1] = fe, J = 0, fe = 0; fe < 16; fe++)
      for (ue[fe] = J, n = 0; n < 1 << K[fe]; n++)
        ce[J++] = fe;
    for (J >>= 7; fe < a; fe++)
      for (ue[fe] = J << 7, n = 0; n < 1 << K[fe] - 7; n++)
        ce[256 + J++] = fe;
    for (g = 0; g <= d; g++)
      de[g] = 0;
    for (n = 0; n <= 143; )
      F[n * 2 + 1] = 8, n++, de[8]++;
    for (; n <= 255; )
      F[n * 2 + 1] = 9, n++, de[9]++;
    for (; n <= 279; )
      F[n * 2 + 1] = 7, n++, de[7]++;
    for (; n <= 287; )
      F[n * 2 + 1] = 8, n++, de[8]++;
    for (N(F, s + 1, de), n = 0; n < a; n++)
      ie[n * 2 + 1] = 5, ie[n * 2] = C(n, 5);
    k = new le(F, q, S + 1, s, d), he = new le(ie, K, 0, a, d), X = new le(new Array(0), L, 0, w, _);
  }
  function W(n) {
    var g;
    for (g = 0; g < s; g++)
      n.dyn_ltree[g * 2] = 0;
    for (g = 0; g < a; g++)
      n.dyn_dtree[g * 2] = 0;
    for (g = 0; g < w; g++)
      n.bl_tree[g * 2] = 0;
    n.dyn_ltree[I * 2] = 1, n.opt_len = n.static_len = 0, n.last_lit = n.matches = 0;
  }
  function oe(n) {
    n.bi_valid > 8 ? se(n, n.bi_buf) : n.bi_valid > 0 && (n.pending_buf[n.pending++] = n.bi_buf), n.bi_buf = 0, n.bi_valid = 0;
  }
  function we(n, g, U, fe) {
    oe(n), se(n, U), se(n, ~U), t.arraySet(n.pending_buf, n.window, g, U, n.pending), n.pending += U;
  }
  function Se(n, g, U, fe) {
    var J = g * 2, de = U * 2;
    return n[J] < n[de] || n[J] === n[de] && fe[g] <= fe[U];
  }
  function Re(n, g, U) {
    for (var fe = n.heap[U], J = U << 1; J <= n.heap_len && (J < n.heap_len && Se(g, n.heap[J + 1], n.heap[J], n.depth) && J++, !Se(g, fe, n.heap[J], n.depth)); )
      n.heap[U] = n.heap[J], U = J, J <<= 1;
    n.heap[U] = fe;
  }
  function Oe(n, g, U) {
    var fe, J, de = 0, M, Be;
    if (n.last_lit !== 0)
      do
        fe = n.pending_buf[n.d_buf + de * 2] << 8 | n.pending_buf[n.d_buf + de * 2 + 1], J = n.pending_buf[n.l_buf + de], de++, fe === 0 ? B(n, J, g) : (M = _e[J], B(n, M + S + 1, g), Be = q[M], Be !== 0 && (J -= be[M], O(n, J, Be)), fe--, M = H(fe), B(n, M, U), Be = K[M], Be !== 0 && (fe -= ue[M], O(n, fe, Be)));
      while (de < n.last_lit);
    B(n, I, g);
  }
  function re(n, g) {
    var U = g.dyn_tree, fe = g.stat_desc.static_tree, J = g.stat_desc.has_stree, de = g.stat_desc.elems, M, Be, ze = -1, R;
    for (n.heap_len = 0, n.heap_max = u, M = 0; M < de; M++)
      U[M * 2] !== 0 ? (n.heap[++n.heap_len] = ze = M, n.depth[M] = 0) : U[M * 2 + 1] = 0;
    for (; n.heap_len < 2; )
      R = n.heap[++n.heap_len] = ze < 2 ? ++ze : 0, U[R * 2] = 1, n.depth[R] = 0, n.opt_len--, J && (n.static_len -= fe[R * 2 + 1]);
    for (g.max_code = ze, M = n.heap_len >> 1; M >= 1; M--)
      Re(n, U, M);
    R = de;
    do
      M = n.heap[
        1
        /*SMALLEST*/
      ], n.heap[
        1
        /*SMALLEST*/
      ] = n.heap[n.heap_len--], Re(
        n,
        U,
        1
        /*SMALLEST*/
      ), Be = n.heap[
        1
        /*SMALLEST*/
      ], n.heap[--n.heap_max] = M, n.heap[--n.heap_max] = Be, U[R * 2] = U[M * 2] + U[Be * 2], n.depth[R] = (n.depth[M] >= n.depth[Be] ? n.depth[M] : n.depth[Be]) + 1, U[M * 2 + 1] = U[Be * 2 + 1] = R, n.heap[
        1
        /*SMALLEST*/
      ] = R++, Re(
        n,
        U,
        1
        /*SMALLEST*/
      );
    while (n.heap_len >= 2);
    n.heap[--n.heap_max] = n.heap[
      1
      /*SMALLEST*/
    ], te(n, g), N(U, ze, n.bl_count);
  }
  function De(n, g, U) {
    var fe, J = -1, de, M = g[1], Be = 0, ze = 7, R = 4;
    for (M === 0 && (ze = 138, R = 3), g[(U + 1) * 2 + 1] = 65535, fe = 0; fe <= U; fe++)
      de = M, M = g[(fe + 1) * 2 + 1], !(++Be < ze && de === M) && (Be < R ? n.bl_tree[de * 2] += Be : de !== 0 ? (de !== J && n.bl_tree[de * 2]++, n.bl_tree[P * 2]++) : Be <= 10 ? n.bl_tree[D * 2]++ : n.bl_tree[x * 2]++, Be = 0, J = de, M === 0 ? (ze = 138, R = 3) : de === M ? (ze = 6, R = 3) : (ze = 7, R = 4));
  }
  function Le(n, g, U) {
    var fe, J = -1, de, M = g[1], Be = 0, ze = 7, R = 4;
    for (M === 0 && (ze = 138, R = 3), fe = 0; fe <= U; fe++)
      if (de = M, M = g[(fe + 1) * 2 + 1], !(++Be < ze && de === M)) {
        if (Be < R)
          do
            B(n, de, n.bl_tree);
          while (--Be !== 0);
        else de !== 0 ? (de !== J && (B(n, de, n.bl_tree), Be--), B(n, P, n.bl_tree), O(n, Be - 3, 2)) : Be <= 10 ? (B(n, D, n.bl_tree), O(n, Be - 3, 3)) : (B(n, x, n.bl_tree), O(n, Be - 11, 7));
        Be = 0, J = de, M === 0 ? (ze = 138, R = 3) : de === M ? (ze = 6, R = 3) : (ze = 7, R = 4);
      }
  }
  function Pe(n) {
    var g;
    for (De(n, n.dyn_ltree, n.l_desc.max_code), De(n, n.dyn_dtree, n.d_desc.max_code), re(n, n.bl_desc), g = w - 1; g >= 3 && n.bl_tree[z[g] * 2 + 1] === 0; g--)
      ;
    return n.opt_len += 3 * (g + 1) + 5 + 5 + 4, g;
  }
  function $e(n, g, U, fe) {
    var J;
    for (O(n, g - 257, 5), O(n, U - 1, 5), O(n, fe - 4, 4), J = 0; J < fe; J++)
      O(n, n.bl_tree[z[J] * 2 + 1], 3);
    Le(n, n.dyn_ltree, g - 1), Le(n, n.dyn_dtree, U - 1);
  }
  function ve(n) {
    var g = 4093624447, U;
    for (U = 0; U <= 31; U++, g >>>= 1)
      if (g & 1 && n.dyn_ltree[U * 2] !== 0)
        return l;
    if (n.dyn_ltree[18] !== 0 || n.dyn_ltree[20] !== 0 || n.dyn_ltree[26] !== 0)
      return c;
    for (U = 32; U < S; U++)
      if (n.dyn_ltree[U * 2] !== 0)
        return c;
    return l;
  }
  var Ee = !1;
  function je(n) {
    Ee || (j(), Ee = !0), n.l_desc = new Q(n.dyn_ltree, k), n.d_desc = new Q(n.dyn_dtree, he), n.bl_desc = new Q(n.bl_tree, X), n.bi_buf = 0, n.bi_valid = 0, W(n);
  }
  function qe(n, g, U, fe) {
    O(n, (p << 1) + (fe ? 1 : 0), 3), we(n, g, U);
  }
  function Me(n) {
    O(n, f << 1, 3), B(n, I, F), ee(n);
  }
  function We(n, g, U, fe) {
    var J, de, M = 0;
    n.level > 0 ? (n.strm.data_type === r && (n.strm.data_type = ve(n)), re(n, n.l_desc), re(n, n.d_desc), M = Pe(n), J = n.opt_len + 3 + 7 >>> 3, de = n.static_len + 3 + 7 >>> 3, de <= J && (J = de)) : J = de = U + 5, U + 4 <= J && g !== -1 ? qe(n, g, U, fe) : n.strategy === e || de === J ? (O(n, (f << 1) + (fe ? 1 : 0), 3), Oe(n, F, ie)) : (O(n, (b << 1) + (fe ? 1 : 0), 3), $e(n, n.l_desc.max_code + 1, n.d_desc.max_code + 1, M + 1), Oe(n, n.dyn_ltree, n.dyn_dtree)), W(n), fe && oe(n);
  }
  function $(n, g, U) {
    return n.pending_buf[n.d_buf + n.last_lit * 2] = g >>> 8 & 255, n.pending_buf[n.d_buf + n.last_lit * 2 + 1] = g & 255, n.pending_buf[n.l_buf + n.last_lit] = U & 255, n.last_lit++, g === 0 ? n.dyn_ltree[U * 2]++ : (n.matches++, g--, n.dyn_ltree[(_e[U] + S + 1) * 2]++, n.dyn_dtree[H(g) * 2]++), n.last_lit === n.lit_bufsize - 1;
  }
  return rt._tr_init = je, rt._tr_stored_block = qe, rt._tr_flush_block = We, rt._tr_tally = $, rt._tr_align = Me, rt;
}
var Gi, rl;
function Ic() {
  if (rl) return Gi;
  rl = 1;
  function t(e, l, c, r) {
    for (var i = e & 65535 | 0, p = e >>> 16 & 65535 | 0, f = 0; c !== 0; ) {
      f = c > 2e3 ? 2e3 : c, c -= f;
      do
        i = i + l[r++] | 0, p = p + i | 0;
      while (--f);
      i %= 65521, p %= 65521;
    }
    return i | p << 16 | 0;
  }
  return Gi = t, Gi;
}
var Zi, tl;
function Oc() {
  if (tl) return Zi;
  tl = 1;
  function t() {
    for (var c, r = [], i = 0; i < 256; i++) {
      c = i;
      for (var p = 0; p < 8; p++)
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      r[i] = c;
    }
    return r;
  }
  var e = t();
  function l(c, r, i, p) {
    var f = e, b = p + i;
    c ^= -1;
    for (var A = p; A < b; A++)
      c = c >>> 8 ^ f[(c ^ r[A]) & 255];
    return c ^ -1;
  }
  return Zi = l, Zi;
}
var Ki, nl;
function Dh() {
  return nl || (nl = 1, Ki = {
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
  }), Ki;
}
var il;
function Nh() {
  if (il) return xr;
  il = 1;
  var t = Zt(), e = Fh(), l = Ic(), c = Oc(), r = Dh(), i = 0, p = 1, f = 3, b = 4, A = 5, o = 0, v = 1, S = -2, s = -3, a = -5, w = -1, u = 1, d = 2, E = 3, _ = 4, I = 0, P = 2, D = 8, x = 9, q = 15, K = 8, L = 29, z = 256, y = z + 1 + L, F = 30, ie = 19, ce = 2 * y + 1, _e = 15, be = 3, ue = 258, le = ue + be + 1, k = 32, he = 42, X = 69, Q = 73, H = 91, se = 103, O = 113, B = 666, C = 1, ee = 2, te = 3, N = 4, j = 3;
  function W(R, Ie) {
    return R.msg = r[Ie], Ie;
  }
  function oe(R) {
    return (R << 1) - (R > 4 ? 9 : 0);
  }
  function we(R) {
    for (var Ie = R.length; --Ie >= 0; )
      R[Ie] = 0;
  }
  function Se(R) {
    var Ie = R.state, Ne = Ie.pending;
    Ne > R.avail_out && (Ne = R.avail_out), Ne !== 0 && (t.arraySet(R.output, Ie.pending_buf, Ie.pending_out, Ne, R.next_out), R.next_out += Ne, Ie.pending_out += Ne, R.total_out += Ne, R.avail_out -= Ne, Ie.pending -= Ne, Ie.pending === 0 && (Ie.pending_out = 0));
  }
  function Re(R, Ie) {
    e._tr_flush_block(R, R.block_start >= 0 ? R.block_start : -1, R.strstart - R.block_start, Ie), R.block_start = R.strstart, Se(R.strm);
  }
  function Oe(R, Ie) {
    R.pending_buf[R.pending++] = Ie;
  }
  function re(R, Ie) {
    R.pending_buf[R.pending++] = Ie >>> 8 & 255, R.pending_buf[R.pending++] = Ie & 255;
  }
  function De(R, Ie, Ne, V) {
    var me = R.avail_in;
    return me > V && (me = V), me === 0 ? 0 : (R.avail_in -= me, t.arraySet(Ie, R.input, R.next_in, me, Ne), R.state.wrap === 1 ? R.adler = l(R.adler, Ie, me, Ne) : R.state.wrap === 2 && (R.adler = c(R.adler, Ie, me, Ne)), R.next_in += me, R.total_in += me, me);
  }
  function Le(R, Ie) {
    var Ne = R.max_chain_length, V = R.strstart, me, Fe, Ve = R.prev_length, G = R.nice_match, m = R.strstart > R.w_size - le ? R.strstart - (R.w_size - le) : 0, h = R.window, T = R.w_mask, Y = R.prev, pe = R.strstart + ue, Te = h[V + Ve - 1], ne = h[V + Ve];
    R.prev_length >= R.good_match && (Ne >>= 2), G > R.lookahead && (G = R.lookahead);
    do
      if (me = Ie, !(h[me + Ve] !== ne || h[me + Ve - 1] !== Te || h[me] !== h[V] || h[++me] !== h[V + 1])) {
        V += 2, me++;
        do
          ;
        while (h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && h[++V] === h[++me] && V < pe);
        if (Fe = ue - (pe - V), V = pe - ue, Fe > Ve) {
          if (R.match_start = Ie, Ve = Fe, Fe >= G)
            break;
          Te = h[V + Ve - 1], ne = h[V + Ve];
        }
      }
    while ((Ie = Y[Ie & T]) > m && --Ne !== 0);
    return Ve <= R.lookahead ? Ve : R.lookahead;
  }
  function Pe(R) {
    var Ie = R.w_size, Ne, V, me, Fe, Ve;
    do {
      if (Fe = R.window_size - R.lookahead - R.strstart, R.strstart >= Ie + (Ie - le)) {
        t.arraySet(R.window, R.window, Ie, Ie, 0), R.match_start -= Ie, R.strstart -= Ie, R.block_start -= Ie, V = R.hash_size, Ne = V;
        do
          me = R.head[--Ne], R.head[Ne] = me >= Ie ? me - Ie : 0;
        while (--V);
        V = Ie, Ne = V;
        do
          me = R.prev[--Ne], R.prev[Ne] = me >= Ie ? me - Ie : 0;
        while (--V);
        Fe += Ie;
      }
      if (R.strm.avail_in === 0)
        break;
      if (V = De(R.strm, R.window, R.strstart + R.lookahead, Fe), R.lookahead += V, R.lookahead + R.insert >= be)
        for (Ve = R.strstart - R.insert, R.ins_h = R.window[Ve], R.ins_h = (R.ins_h << R.hash_shift ^ R.window[Ve + 1]) & R.hash_mask; R.insert && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[Ve + be - 1]) & R.hash_mask, R.prev[Ve & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = Ve, Ve++, R.insert--, !(R.lookahead + R.insert < be)); )
          ;
    } while (R.lookahead < le && R.strm.avail_in !== 0);
  }
  function $e(R, Ie) {
    var Ne = 65535;
    for (Ne > R.pending_buf_size - 5 && (Ne = R.pending_buf_size - 5); ; ) {
      if (R.lookahead <= 1) {
        if (Pe(R), R.lookahead === 0 && Ie === i)
          return C;
        if (R.lookahead === 0)
          break;
      }
      R.strstart += R.lookahead, R.lookahead = 0;
      var V = R.block_start + Ne;
      if ((R.strstart === 0 || R.strstart >= V) && (R.lookahead = R.strstart - V, R.strstart = V, Re(R, !1), R.strm.avail_out === 0) || R.strstart - R.block_start >= R.w_size - le && (Re(R, !1), R.strm.avail_out === 0))
        return C;
    }
    return R.insert = 0, Ie === b ? (Re(R, !0), R.strm.avail_out === 0 ? te : N) : (R.strstart > R.block_start && (Re(R, !1), R.strm.avail_out === 0), C);
  }
  function ve(R, Ie) {
    for (var Ne, V; ; ) {
      if (R.lookahead < le) {
        if (Pe(R), R.lookahead < le && Ie === i)
          return C;
        if (R.lookahead === 0)
          break;
      }
      if (Ne = 0, R.lookahead >= be && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + be - 1]) & R.hash_mask, Ne = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart), Ne !== 0 && R.strstart - Ne <= R.w_size - le && (R.match_length = Le(R, Ne)), R.match_length >= be)
        if (V = e._tr_tally(R, R.strstart - R.match_start, R.match_length - be), R.lookahead -= R.match_length, R.match_length <= R.max_lazy_match && R.lookahead >= be) {
          R.match_length--;
          do
            R.strstart++, R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + be - 1]) & R.hash_mask, Ne = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart;
          while (--R.match_length !== 0);
          R.strstart++;
        } else
          R.strstart += R.match_length, R.match_length = 0, R.ins_h = R.window[R.strstart], R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 1]) & R.hash_mask;
      else
        V = e._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++;
      if (V && (Re(R, !1), R.strm.avail_out === 0))
        return C;
    }
    return R.insert = R.strstart < be - 1 ? R.strstart : be - 1, Ie === b ? (Re(R, !0), R.strm.avail_out === 0 ? te : N) : R.last_lit && (Re(R, !1), R.strm.avail_out === 0) ? C : ee;
  }
  function Ee(R, Ie) {
    for (var Ne, V, me; ; ) {
      if (R.lookahead < le) {
        if (Pe(R), R.lookahead < le && Ie === i)
          return C;
        if (R.lookahead === 0)
          break;
      }
      if (Ne = 0, R.lookahead >= be && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + be - 1]) & R.hash_mask, Ne = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart), R.prev_length = R.match_length, R.prev_match = R.match_start, R.match_length = be - 1, Ne !== 0 && R.prev_length < R.max_lazy_match && R.strstart - Ne <= R.w_size - le && (R.match_length = Le(R, Ne), R.match_length <= 5 && (R.strategy === u || R.match_length === be && R.strstart - R.match_start > 4096) && (R.match_length = be - 1)), R.prev_length >= be && R.match_length <= R.prev_length) {
        me = R.strstart + R.lookahead - be, V = e._tr_tally(R, R.strstart - 1 - R.prev_match, R.prev_length - be), R.lookahead -= R.prev_length - 1, R.prev_length -= 2;
        do
          ++R.strstart <= me && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + be - 1]) & R.hash_mask, Ne = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart);
        while (--R.prev_length !== 0);
        if (R.match_available = 0, R.match_length = be - 1, R.strstart++, V && (Re(R, !1), R.strm.avail_out === 0))
          return C;
      } else if (R.match_available) {
        if (V = e._tr_tally(R, 0, R.window[R.strstart - 1]), V && Re(R, !1), R.strstart++, R.lookahead--, R.strm.avail_out === 0)
          return C;
      } else
        R.match_available = 1, R.strstart++, R.lookahead--;
    }
    return R.match_available && (V = e._tr_tally(R, 0, R.window[R.strstart - 1]), R.match_available = 0), R.insert = R.strstart < be - 1 ? R.strstart : be - 1, Ie === b ? (Re(R, !0), R.strm.avail_out === 0 ? te : N) : R.last_lit && (Re(R, !1), R.strm.avail_out === 0) ? C : ee;
  }
  function je(R, Ie) {
    for (var Ne, V, me, Fe, Ve = R.window; ; ) {
      if (R.lookahead <= ue) {
        if (Pe(R), R.lookahead <= ue && Ie === i)
          return C;
        if (R.lookahead === 0)
          break;
      }
      if (R.match_length = 0, R.lookahead >= be && R.strstart > 0 && (me = R.strstart - 1, V = Ve[me], V === Ve[++me] && V === Ve[++me] && V === Ve[++me])) {
        Fe = R.strstart + ue;
        do
          ;
        while (V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && V === Ve[++me] && me < Fe);
        R.match_length = ue - (Fe - me), R.match_length > R.lookahead && (R.match_length = R.lookahead);
      }
      if (R.match_length >= be ? (Ne = e._tr_tally(R, 1, R.match_length - be), R.lookahead -= R.match_length, R.strstart += R.match_length, R.match_length = 0) : (Ne = e._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++), Ne && (Re(R, !1), R.strm.avail_out === 0))
        return C;
    }
    return R.insert = 0, Ie === b ? (Re(R, !0), R.strm.avail_out === 0 ? te : N) : R.last_lit && (Re(R, !1), R.strm.avail_out === 0) ? C : ee;
  }
  function qe(R, Ie) {
    for (var Ne; ; ) {
      if (R.lookahead === 0 && (Pe(R), R.lookahead === 0)) {
        if (Ie === i)
          return C;
        break;
      }
      if (R.match_length = 0, Ne = e._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++, Ne && (Re(R, !1), R.strm.avail_out === 0))
        return C;
    }
    return R.insert = 0, Ie === b ? (Re(R, !0), R.strm.avail_out === 0 ? te : N) : R.last_lit && (Re(R, !1), R.strm.avail_out === 0) ? C : ee;
  }
  function Me(R, Ie, Ne, V, me) {
    this.good_length = R, this.max_lazy = Ie, this.nice_length = Ne, this.max_chain = V, this.func = me;
  }
  var We;
  We = [
    /*      good lazy nice chain */
    new Me(0, 0, 0, 0, $e),
    /* 0 store only */
    new Me(4, 4, 8, 4, ve),
    /* 1 max speed, no lazy matches */
    new Me(4, 5, 16, 8, ve),
    /* 2 */
    new Me(4, 6, 32, 32, ve),
    /* 3 */
    new Me(4, 4, 16, 16, Ee),
    /* 4 lazy matches */
    new Me(8, 16, 32, 32, Ee),
    /* 5 */
    new Me(8, 16, 128, 128, Ee),
    /* 6 */
    new Me(8, 32, 128, 256, Ee),
    /* 7 */
    new Me(32, 128, 258, 1024, Ee),
    /* 8 */
    new Me(32, 258, 258, 4096, Ee)
    /* 9 max compression */
  ];
  function $(R) {
    R.window_size = 2 * R.w_size, we(R.head), R.max_lazy_match = We[R.level].max_lazy, R.good_match = We[R.level].good_length, R.nice_match = We[R.level].nice_length, R.max_chain_length = We[R.level].max_chain, R.strstart = 0, R.block_start = 0, R.lookahead = 0, R.insert = 0, R.match_length = R.prev_length = be - 1, R.match_available = 0, R.ins_h = 0;
  }
  function n() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = D, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new t.Buf16(ce * 2), this.dyn_dtree = new t.Buf16((2 * F + 1) * 2), this.bl_tree = new t.Buf16((2 * ie + 1) * 2), we(this.dyn_ltree), we(this.dyn_dtree), we(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new t.Buf16(_e + 1), this.heap = new t.Buf16(2 * y + 1), we(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new t.Buf16(2 * y + 1), we(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function g(R) {
    var Ie;
    return !R || !R.state ? W(R, S) : (R.total_in = R.total_out = 0, R.data_type = P, Ie = R.state, Ie.pending = 0, Ie.pending_out = 0, Ie.wrap < 0 && (Ie.wrap = -Ie.wrap), Ie.status = Ie.wrap ? he : O, R.adler = Ie.wrap === 2 ? 0 : 1, Ie.last_flush = i, e._tr_init(Ie), o);
  }
  function U(R) {
    var Ie = g(R);
    return Ie === o && $(R.state), Ie;
  }
  function fe(R, Ie) {
    return !R || !R.state || R.state.wrap !== 2 ? S : (R.state.gzhead = Ie, o);
  }
  function J(R, Ie, Ne, V, me, Fe) {
    if (!R)
      return S;
    var Ve = 1;
    if (Ie === w && (Ie = 6), V < 0 ? (Ve = 0, V = -V) : V > 15 && (Ve = 2, V -= 16), me < 1 || me > x || Ne !== D || V < 8 || V > 15 || Ie < 0 || Ie > 9 || Fe < 0 || Fe > _)
      return W(R, S);
    V === 8 && (V = 9);
    var G = new n();
    return R.state = G, G.strm = R, G.wrap = Ve, G.gzhead = null, G.w_bits = V, G.w_size = 1 << G.w_bits, G.w_mask = G.w_size - 1, G.hash_bits = me + 7, G.hash_size = 1 << G.hash_bits, G.hash_mask = G.hash_size - 1, G.hash_shift = ~~((G.hash_bits + be - 1) / be), G.window = new t.Buf8(G.w_size * 2), G.head = new t.Buf16(G.hash_size), G.prev = new t.Buf16(G.w_size), G.lit_bufsize = 1 << me + 6, G.pending_buf_size = G.lit_bufsize * 4, G.pending_buf = new t.Buf8(G.pending_buf_size), G.d_buf = 1 * G.lit_bufsize, G.l_buf = 3 * G.lit_bufsize, G.level = Ie, G.strategy = Fe, G.method = Ne, U(R);
  }
  function de(R, Ie) {
    return J(R, Ie, D, q, K, I);
  }
  function M(R, Ie) {
    var Ne, V, me, Fe;
    if (!R || !R.state || Ie > A || Ie < 0)
      return R ? W(R, S) : S;
    if (V = R.state, !R.output || !R.input && R.avail_in !== 0 || V.status === B && Ie !== b)
      return W(R, R.avail_out === 0 ? a : S);
    if (V.strm = R, Ne = V.last_flush, V.last_flush = Ie, V.status === he)
      if (V.wrap === 2)
        R.adler = 0, Oe(V, 31), Oe(V, 139), Oe(V, 8), V.gzhead ? (Oe(
          V,
          (V.gzhead.text ? 1 : 0) + (V.gzhead.hcrc ? 2 : 0) + (V.gzhead.extra ? 4 : 0) + (V.gzhead.name ? 8 : 0) + (V.gzhead.comment ? 16 : 0)
        ), Oe(V, V.gzhead.time & 255), Oe(V, V.gzhead.time >> 8 & 255), Oe(V, V.gzhead.time >> 16 & 255), Oe(V, V.gzhead.time >> 24 & 255), Oe(V, V.level === 9 ? 2 : V.strategy >= d || V.level < 2 ? 4 : 0), Oe(V, V.gzhead.os & 255), V.gzhead.extra && V.gzhead.extra.length && (Oe(V, V.gzhead.extra.length & 255), Oe(V, V.gzhead.extra.length >> 8 & 255)), V.gzhead.hcrc && (R.adler = c(R.adler, V.pending_buf, V.pending, 0)), V.gzindex = 0, V.status = X) : (Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, 0), Oe(V, V.level === 9 ? 2 : V.strategy >= d || V.level < 2 ? 4 : 0), Oe(V, j), V.status = O);
      else {
        var Ve = D + (V.w_bits - 8 << 4) << 8, G = -1;
        V.strategy >= d || V.level < 2 ? G = 0 : V.level < 6 ? G = 1 : V.level === 6 ? G = 2 : G = 3, Ve |= G << 6, V.strstart !== 0 && (Ve |= k), Ve += 31 - Ve % 31, V.status = O, re(V, Ve), V.strstart !== 0 && (re(V, R.adler >>> 16), re(V, R.adler & 65535)), R.adler = 1;
      }
    if (V.status === X)
      if (V.gzhead.extra) {
        for (me = V.pending; V.gzindex < (V.gzhead.extra.length & 65535) && !(V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), Se(R), me = V.pending, V.pending === V.pending_buf_size)); )
          Oe(V, V.gzhead.extra[V.gzindex] & 255), V.gzindex++;
        V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), V.gzindex === V.gzhead.extra.length && (V.gzindex = 0, V.status = Q);
      } else
        V.status = Q;
    if (V.status === Q)
      if (V.gzhead.name) {
        me = V.pending;
        do {
          if (V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), Se(R), me = V.pending, V.pending === V.pending_buf_size)) {
            Fe = 1;
            break;
          }
          V.gzindex < V.gzhead.name.length ? Fe = V.gzhead.name.charCodeAt(V.gzindex++) & 255 : Fe = 0, Oe(V, Fe);
        } while (Fe !== 0);
        V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), Fe === 0 && (V.gzindex = 0, V.status = H);
      } else
        V.status = H;
    if (V.status === H)
      if (V.gzhead.comment) {
        me = V.pending;
        do {
          if (V.pending === V.pending_buf_size && (V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), Se(R), me = V.pending, V.pending === V.pending_buf_size)) {
            Fe = 1;
            break;
          }
          V.gzindex < V.gzhead.comment.length ? Fe = V.gzhead.comment.charCodeAt(V.gzindex++) & 255 : Fe = 0, Oe(V, Fe);
        } while (Fe !== 0);
        V.gzhead.hcrc && V.pending > me && (R.adler = c(R.adler, V.pending_buf, V.pending - me, me)), Fe === 0 && (V.status = se);
      } else
        V.status = se;
    if (V.status === se && (V.gzhead.hcrc ? (V.pending + 2 > V.pending_buf_size && Se(R), V.pending + 2 <= V.pending_buf_size && (Oe(V, R.adler & 255), Oe(V, R.adler >> 8 & 255), R.adler = 0, V.status = O)) : V.status = O), V.pending !== 0) {
      if (Se(R), R.avail_out === 0)
        return V.last_flush = -1, o;
    } else if (R.avail_in === 0 && oe(Ie) <= oe(Ne) && Ie !== b)
      return W(R, a);
    if (V.status === B && R.avail_in !== 0)
      return W(R, a);
    if (R.avail_in !== 0 || V.lookahead !== 0 || Ie !== i && V.status !== B) {
      var m = V.strategy === d ? qe(V, Ie) : V.strategy === E ? je(V, Ie) : We[V.level].func(V, Ie);
      if ((m === te || m === N) && (V.status = B), m === C || m === te)
        return R.avail_out === 0 && (V.last_flush = -1), o;
      if (m === ee && (Ie === p ? e._tr_align(V) : Ie !== A && (e._tr_stored_block(V, 0, 0, !1), Ie === f && (we(V.head), V.lookahead === 0 && (V.strstart = 0, V.block_start = 0, V.insert = 0))), Se(R), R.avail_out === 0))
        return V.last_flush = -1, o;
    }
    return Ie !== b ? o : V.wrap <= 0 ? v : (V.wrap === 2 ? (Oe(V, R.adler & 255), Oe(V, R.adler >> 8 & 255), Oe(V, R.adler >> 16 & 255), Oe(V, R.adler >> 24 & 255), Oe(V, R.total_in & 255), Oe(V, R.total_in >> 8 & 255), Oe(V, R.total_in >> 16 & 255), Oe(V, R.total_in >> 24 & 255)) : (re(V, R.adler >>> 16), re(V, R.adler & 65535)), Se(R), V.wrap > 0 && (V.wrap = -V.wrap), V.pending !== 0 ? o : v);
  }
  function Be(R) {
    var Ie;
    return !R || !R.state ? S : (Ie = R.state.status, Ie !== he && Ie !== X && Ie !== Q && Ie !== H && Ie !== se && Ie !== O && Ie !== B ? W(R, S) : (R.state = null, Ie === O ? W(R, s) : o));
  }
  function ze(R, Ie) {
    var Ne = Ie.length, V, me, Fe, Ve, G, m, h, T;
    if (!R || !R.state || (V = R.state, Ve = V.wrap, Ve === 2 || Ve === 1 && V.status !== he || V.lookahead))
      return S;
    for (Ve === 1 && (R.adler = l(R.adler, Ie, Ne, 0)), V.wrap = 0, Ne >= V.w_size && (Ve === 0 && (we(V.head), V.strstart = 0, V.block_start = 0, V.insert = 0), T = new t.Buf8(V.w_size), t.arraySet(T, Ie, Ne - V.w_size, V.w_size, 0), Ie = T, Ne = V.w_size), G = R.avail_in, m = R.next_in, h = R.input, R.avail_in = Ne, R.next_in = 0, R.input = Ie, Pe(V); V.lookahead >= be; ) {
      me = V.strstart, Fe = V.lookahead - (be - 1);
      do
        V.ins_h = (V.ins_h << V.hash_shift ^ V.window[me + be - 1]) & V.hash_mask, V.prev[me & V.w_mask] = V.head[V.ins_h], V.head[V.ins_h] = me, me++;
      while (--Fe);
      V.strstart = me, V.lookahead = be - 1, Pe(V);
    }
    return V.strstart += V.lookahead, V.block_start = V.strstart, V.insert = V.lookahead, V.lookahead = 0, V.match_length = V.prev_length = be - 1, V.match_available = 0, R.next_in = m, R.input = h, R.avail_in = G, V.wrap = Ve, o;
  }
  return xr.deflateInit = de, xr.deflateInit2 = J, xr.deflateReset = U, xr.deflateResetKeep = g, xr.deflateSetHeader = fe, xr.deflate = M, xr.deflateEnd = Be, xr.deflateSetDictionary = ze, xr.deflateInfo = "pako deflate (from Nodeca project)", xr;
}
var Ar = {}, Yi, al;
function Bh() {
  if (al) return Yi;
  al = 1;
  var t = 30, e = 12;
  return Yi = function(c, r) {
    var i, p, f, b, A, o, v, S, s, a, w, u, d, E, _, I, P, D, x, q, K, L, z, y, F;
    i = c.state, p = c.next_in, y = c.input, f = p + (c.avail_in - 5), b = c.next_out, F = c.output, A = b - (r - c.avail_out), o = b + (c.avail_out - 257), v = i.dmax, S = i.wsize, s = i.whave, a = i.wnext, w = i.window, u = i.hold, d = i.bits, E = i.lencode, _ = i.distcode, I = (1 << i.lenbits) - 1, P = (1 << i.distbits) - 1;
    e:
      do {
        d < 15 && (u += y[p++] << d, d += 8, u += y[p++] << d, d += 8), D = E[u & I];
        r:
          for (; ; ) {
            if (x = D >>> 24, u >>>= x, d -= x, x = D >>> 16 & 255, x === 0)
              F[b++] = D & 65535;
            else if (x & 16) {
              q = D & 65535, x &= 15, x && (d < x && (u += y[p++] << d, d += 8), q += u & (1 << x) - 1, u >>>= x, d -= x), d < 15 && (u += y[p++] << d, d += 8, u += y[p++] << d, d += 8), D = _[u & P];
              t:
                for (; ; ) {
                  if (x = D >>> 24, u >>>= x, d -= x, x = D >>> 16 & 255, x & 16) {
                    if (K = D & 65535, x &= 15, d < x && (u += y[p++] << d, d += 8, d < x && (u += y[p++] << d, d += 8)), K += u & (1 << x) - 1, K > v) {
                      c.msg = "invalid distance too far back", i.mode = t;
                      break e;
                    }
                    if (u >>>= x, d -= x, x = b - A, K > x) {
                      if (x = K - x, x > s && i.sane) {
                        c.msg = "invalid distance too far back", i.mode = t;
                        break e;
                      }
                      if (L = 0, z = w, a === 0) {
                        if (L += S - x, x < q) {
                          q -= x;
                          do
                            F[b++] = w[L++];
                          while (--x);
                          L = b - K, z = F;
                        }
                      } else if (a < x) {
                        if (L += S + a - x, x -= a, x < q) {
                          q -= x;
                          do
                            F[b++] = w[L++];
                          while (--x);
                          if (L = 0, a < q) {
                            x = a, q -= x;
                            do
                              F[b++] = w[L++];
                            while (--x);
                            L = b - K, z = F;
                          }
                        }
                      } else if (L += a - x, x < q) {
                        q -= x;
                        do
                          F[b++] = w[L++];
                        while (--x);
                        L = b - K, z = F;
                      }
                      for (; q > 2; )
                        F[b++] = z[L++], F[b++] = z[L++], F[b++] = z[L++], q -= 3;
                      q && (F[b++] = z[L++], q > 1 && (F[b++] = z[L++]));
                    } else {
                      L = b - K;
                      do
                        F[b++] = F[L++], F[b++] = F[L++], F[b++] = F[L++], q -= 3;
                      while (q > 2);
                      q && (F[b++] = F[L++], q > 1 && (F[b++] = F[L++]));
                    }
                  } else if ((x & 64) === 0) {
                    D = _[(D & 65535) + (u & (1 << x) - 1)];
                    continue t;
                  } else {
                    c.msg = "invalid distance code", i.mode = t;
                    break e;
                  }
                  break;
                }
            } else if ((x & 64) === 0) {
              D = E[(D & 65535) + (u & (1 << x) - 1)];
              continue r;
            } else if (x & 32) {
              i.mode = e;
              break e;
            } else {
              c.msg = "invalid literal/length code", i.mode = t;
              break e;
            }
            break;
          }
      } while (p < f && b < o);
    q = d >> 3, p -= q, d -= q << 3, u &= (1 << d) - 1, c.next_in = p, c.next_out = b, c.avail_in = p < f ? 5 + (f - p) : 5 - (p - f), c.avail_out = b < o ? 257 + (o - b) : 257 - (b - o), i.hold = u, i.bits = d;
  }, Yi;
}
var Qi, ol;
function Lh() {
  if (ol) return Qi;
  ol = 1;
  var t = Zt(), e = 15, l = 852, c = 592, r = 0, i = 1, p = 2, f = [
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
  ], A = [
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
  ], o = [
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
  return Qi = function(S, s, a, w, u, d, E, _) {
    var I = _.bits, P = 0, D = 0, x = 0, q = 0, K = 0, L = 0, z = 0, y = 0, F = 0, ie = 0, ce, _e, be, ue, le, k = null, he = 0, X, Q = new t.Buf16(e + 1), H = new t.Buf16(e + 1), se = null, O = 0, B, C, ee;
    for (P = 0; P <= e; P++)
      Q[P] = 0;
    for (D = 0; D < w; D++)
      Q[s[a + D]]++;
    for (K = I, q = e; q >= 1 && Q[q] === 0; q--)
      ;
    if (K > q && (K = q), q === 0)
      return u[d++] = 1 << 24 | 64 << 16 | 0, u[d++] = 1 << 24 | 64 << 16 | 0, _.bits = 1, 0;
    for (x = 1; x < q && Q[x] === 0; x++)
      ;
    for (K < x && (K = x), y = 1, P = 1; P <= e; P++)
      if (y <<= 1, y -= Q[P], y < 0)
        return -1;
    if (y > 0 && (S === r || q !== 1))
      return -1;
    for (H[1] = 0, P = 1; P < e; P++)
      H[P + 1] = H[P] + Q[P];
    for (D = 0; D < w; D++)
      s[a + D] !== 0 && (E[H[s[a + D]]++] = D);
    if (S === r ? (k = se = E, X = 19) : S === i ? (k = f, he -= 257, se = b, O -= 257, X = 256) : (k = A, se = o, X = -1), ie = 0, D = 0, P = x, le = d, L = K, z = 0, be = -1, F = 1 << K, ue = F - 1, S === i && F > l || S === p && F > c)
      return 1;
    for (; ; ) {
      B = P - z, E[D] < X ? (C = 0, ee = E[D]) : E[D] > X ? (C = se[O + E[D]], ee = k[he + E[D]]) : (C = 96, ee = 0), ce = 1 << P - z, _e = 1 << L, x = _e;
      do
        _e -= ce, u[le + (ie >> z) + _e] = B << 24 | C << 16 | ee | 0;
      while (_e !== 0);
      for (ce = 1 << P - 1; ie & ce; )
        ce >>= 1;
      if (ce !== 0 ? (ie &= ce - 1, ie += ce) : ie = 0, D++, --Q[P] === 0) {
        if (P === q)
          break;
        P = s[a + E[D]];
      }
      if (P > K && (ie & ue) !== be) {
        for (z === 0 && (z = K), le += x, L = P - z, y = 1 << L; L + z < q && (y -= Q[L + z], !(y <= 0)); )
          L++, y <<= 1;
        if (F += 1 << L, S === i && F > l || S === p && F > c)
          return 1;
        be = ie & ue, u[be] = K << 24 | L << 16 | le - d | 0;
      }
    }
    return ie !== 0 && (u[le + ie] = P - z << 24 | 64 << 16 | 0), _.bits = K, 0;
  }, Qi;
}
var sl;
function Ch() {
  if (sl) return Ar;
  sl = 1;
  var t = Zt(), e = Ic(), l = Oc(), c = Bh(), r = Lh(), i = 0, p = 1, f = 2, b = 4, A = 5, o = 6, v = 0, S = 1, s = 2, a = -2, w = -3, u = -4, d = -5, E = 8, _ = 1, I = 2, P = 3, D = 4, x = 5, q = 6, K = 7, L = 8, z = 9, y = 10, F = 11, ie = 12, ce = 13, _e = 14, be = 15, ue = 16, le = 17, k = 18, he = 19, X = 20, Q = 21, H = 22, se = 23, O = 24, B = 25, C = 26, ee = 27, te = 28, N = 29, j = 30, W = 31, oe = 32, we = 852, Se = 592, Re = 15, Oe = Re;
  function re(J) {
    return (J >>> 24 & 255) + (J >>> 8 & 65280) + ((J & 65280) << 8) + ((J & 255) << 24);
  }
  function De() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new t.Buf16(320), this.work = new t.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function Le(J) {
    var de;
    return !J || !J.state ? a : (de = J.state, J.total_in = J.total_out = de.total = 0, J.msg = "", de.wrap && (J.adler = de.wrap & 1), de.mode = _, de.last = 0, de.havedict = 0, de.dmax = 32768, de.head = null, de.hold = 0, de.bits = 0, de.lencode = de.lendyn = new t.Buf32(we), de.distcode = de.distdyn = new t.Buf32(Se), de.sane = 1, de.back = -1, v);
  }
  function Pe(J) {
    var de;
    return !J || !J.state ? a : (de = J.state, de.wsize = 0, de.whave = 0, de.wnext = 0, Le(J));
  }
  function $e(J, de) {
    var M, Be;
    return !J || !J.state || (Be = J.state, de < 0 ? (M = 0, de = -de) : (M = (de >> 4) + 1, de < 48 && (de &= 15)), de && (de < 8 || de > 15)) ? a : (Be.window !== null && Be.wbits !== de && (Be.window = null), Be.wrap = M, Be.wbits = de, Pe(J));
  }
  function ve(J, de) {
    var M, Be;
    return J ? (Be = new De(), J.state = Be, Be.window = null, M = $e(J, de), M !== v && (J.state = null), M) : a;
  }
  function Ee(J) {
    return ve(J, Oe);
  }
  var je = !0, qe, Me;
  function We(J) {
    if (je) {
      var de;
      for (qe = new t.Buf32(512), Me = new t.Buf32(32), de = 0; de < 144; )
        J.lens[de++] = 8;
      for (; de < 256; )
        J.lens[de++] = 9;
      for (; de < 280; )
        J.lens[de++] = 7;
      for (; de < 288; )
        J.lens[de++] = 8;
      for (r(p, J.lens, 0, 288, qe, 0, J.work, { bits: 9 }), de = 0; de < 32; )
        J.lens[de++] = 5;
      r(f, J.lens, 0, 32, Me, 0, J.work, { bits: 5 }), je = !1;
    }
    J.lencode = qe, J.lenbits = 9, J.distcode = Me, J.distbits = 5;
  }
  function $(J, de, M, Be) {
    var ze, R = J.state;
    return R.window === null && (R.wsize = 1 << R.wbits, R.wnext = 0, R.whave = 0, R.window = new t.Buf8(R.wsize)), Be >= R.wsize ? (t.arraySet(R.window, de, M - R.wsize, R.wsize, 0), R.wnext = 0, R.whave = R.wsize) : (ze = R.wsize - R.wnext, ze > Be && (ze = Be), t.arraySet(R.window, de, M - Be, ze, R.wnext), Be -= ze, Be ? (t.arraySet(R.window, de, M - Be, Be, 0), R.wnext = Be, R.whave = R.wsize) : (R.wnext += ze, R.wnext === R.wsize && (R.wnext = 0), R.whave < R.wsize && (R.whave += ze))), 0;
  }
  function n(J, de) {
    var M, Be, ze, R, Ie, Ne, V, me, Fe, Ve, G, m, h, T, Y = 0, pe, Te, ne, ae, ye, xe, Ae, ke, He = new t.Buf8(4), Ye, Qe, nr = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!J || !J.state || !J.output || !J.input && J.avail_in !== 0)
      return a;
    M = J.state, M.mode === ie && (M.mode = ce), Ie = J.next_out, ze = J.output, V = J.avail_out, R = J.next_in, Be = J.input, Ne = J.avail_in, me = M.hold, Fe = M.bits, Ve = Ne, G = V, ke = v;
    e:
      for (; ; )
        switch (M.mode) {
          case _:
            if (M.wrap === 0) {
              M.mode = ce;
              break;
            }
            for (; Fe < 16; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if (M.wrap & 2 && me === 35615) {
              M.check = 0, He[0] = me & 255, He[1] = me >>> 8 & 255, M.check = l(M.check, He, 2, 0), me = 0, Fe = 0, M.mode = I;
              break;
            }
            if (M.flags = 0, M.head && (M.head.done = !1), !(M.wrap & 1) || /* check if zlib header allowed */
            (((me & 255) << 8) + (me >> 8)) % 31) {
              J.msg = "incorrect header check", M.mode = j;
              break;
            }
            if ((me & 15) !== E) {
              J.msg = "unknown compression method", M.mode = j;
              break;
            }
            if (me >>>= 4, Fe -= 4, Ae = (me & 15) + 8, M.wbits === 0)
              M.wbits = Ae;
            else if (Ae > M.wbits) {
              J.msg = "invalid window size", M.mode = j;
              break;
            }
            M.dmax = 1 << Ae, J.adler = M.check = 1, M.mode = me & 512 ? y : ie, me = 0, Fe = 0;
            break;
          case I:
            for (; Fe < 16; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if (M.flags = me, (M.flags & 255) !== E) {
              J.msg = "unknown compression method", M.mode = j;
              break;
            }
            if (M.flags & 57344) {
              J.msg = "unknown header flags set", M.mode = j;
              break;
            }
            M.head && (M.head.text = me >> 8 & 1), M.flags & 512 && (He[0] = me & 255, He[1] = me >>> 8 & 255, M.check = l(M.check, He, 2, 0)), me = 0, Fe = 0, M.mode = P;
          /* falls through */
          case P:
            for (; Fe < 32; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            M.head && (M.head.time = me), M.flags & 512 && (He[0] = me & 255, He[1] = me >>> 8 & 255, He[2] = me >>> 16 & 255, He[3] = me >>> 24 & 255, M.check = l(M.check, He, 4, 0)), me = 0, Fe = 0, M.mode = D;
          /* falls through */
          case D:
            for (; Fe < 16; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            M.head && (M.head.xflags = me & 255, M.head.os = me >> 8), M.flags & 512 && (He[0] = me & 255, He[1] = me >>> 8 & 255, M.check = l(M.check, He, 2, 0)), me = 0, Fe = 0, M.mode = x;
          /* falls through */
          case x:
            if (M.flags & 1024) {
              for (; Fe < 16; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              M.length = me, M.head && (M.head.extra_len = me), M.flags & 512 && (He[0] = me & 255, He[1] = me >>> 8 & 255, M.check = l(M.check, He, 2, 0)), me = 0, Fe = 0;
            } else M.head && (M.head.extra = null);
            M.mode = q;
          /* falls through */
          case q:
            if (M.flags & 1024 && (m = M.length, m > Ne && (m = Ne), m && (M.head && (Ae = M.head.extra_len - M.length, M.head.extra || (M.head.extra = new Array(M.head.extra_len)), t.arraySet(
              M.head.extra,
              Be,
              R,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              m,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Ae
            )), M.flags & 512 && (M.check = l(M.check, Be, m, R)), Ne -= m, R += m, M.length -= m), M.length))
              break e;
            M.length = 0, M.mode = K;
          /* falls through */
          case K:
            if (M.flags & 2048) {
              if (Ne === 0)
                break e;
              m = 0;
              do
                Ae = Be[R + m++], M.head && Ae && M.length < 65536 && (M.head.name += String.fromCharCode(Ae));
              while (Ae && m < Ne);
              if (M.flags & 512 && (M.check = l(M.check, Be, m, R)), Ne -= m, R += m, Ae)
                break e;
            } else M.head && (M.head.name = null);
            M.length = 0, M.mode = L;
          /* falls through */
          case L:
            if (M.flags & 4096) {
              if (Ne === 0)
                break e;
              m = 0;
              do
                Ae = Be[R + m++], M.head && Ae && M.length < 65536 && (M.head.comment += String.fromCharCode(Ae));
              while (Ae && m < Ne);
              if (M.flags & 512 && (M.check = l(M.check, Be, m, R)), Ne -= m, R += m, Ae)
                break e;
            } else M.head && (M.head.comment = null);
            M.mode = z;
          /* falls through */
          case z:
            if (M.flags & 512) {
              for (; Fe < 16; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              if (me !== (M.check & 65535)) {
                J.msg = "header crc mismatch", M.mode = j;
                break;
              }
              me = 0, Fe = 0;
            }
            M.head && (M.head.hcrc = M.flags >> 9 & 1, M.head.done = !0), J.adler = M.check = 0, M.mode = ie;
            break;
          case y:
            for (; Fe < 32; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            J.adler = M.check = re(me), me = 0, Fe = 0, M.mode = F;
          /* falls through */
          case F:
            if (M.havedict === 0)
              return J.next_out = Ie, J.avail_out = V, J.next_in = R, J.avail_in = Ne, M.hold = me, M.bits = Fe, s;
            J.adler = M.check = 1, M.mode = ie;
          /* falls through */
          case ie:
            if (de === A || de === o)
              break e;
          /* falls through */
          case ce:
            if (M.last) {
              me >>>= Fe & 7, Fe -= Fe & 7, M.mode = ee;
              break;
            }
            for (; Fe < 3; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            switch (M.last = me & 1, me >>>= 1, Fe -= 1, me & 3) {
              case 0:
                M.mode = _e;
                break;
              case 1:
                if (We(M), M.mode = X, de === o) {
                  me >>>= 2, Fe -= 2;
                  break e;
                }
                break;
              case 2:
                M.mode = le;
                break;
              case 3:
                J.msg = "invalid block type", M.mode = j;
            }
            me >>>= 2, Fe -= 2;
            break;
          case _e:
            for (me >>>= Fe & 7, Fe -= Fe & 7; Fe < 32; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if ((me & 65535) !== (me >>> 16 ^ 65535)) {
              J.msg = "invalid stored block lengths", M.mode = j;
              break;
            }
            if (M.length = me & 65535, me = 0, Fe = 0, M.mode = be, de === o)
              break e;
          /* falls through */
          case be:
            M.mode = ue;
          /* falls through */
          case ue:
            if (m = M.length, m) {
              if (m > Ne && (m = Ne), m > V && (m = V), m === 0)
                break e;
              t.arraySet(ze, Be, R, m, Ie), Ne -= m, R += m, V -= m, Ie += m, M.length -= m;
              break;
            }
            M.mode = ie;
            break;
          case le:
            for (; Fe < 14; ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if (M.nlen = (me & 31) + 257, me >>>= 5, Fe -= 5, M.ndist = (me & 31) + 1, me >>>= 5, Fe -= 5, M.ncode = (me & 15) + 4, me >>>= 4, Fe -= 4, M.nlen > 286 || M.ndist > 30) {
              J.msg = "too many length or distance symbols", M.mode = j;
              break;
            }
            M.have = 0, M.mode = k;
          /* falls through */
          case k:
            for (; M.have < M.ncode; ) {
              for (; Fe < 3; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              M.lens[nr[M.have++]] = me & 7, me >>>= 3, Fe -= 3;
            }
            for (; M.have < 19; )
              M.lens[nr[M.have++]] = 0;
            if (M.lencode = M.lendyn, M.lenbits = 7, Ye = { bits: M.lenbits }, ke = r(i, M.lens, 0, 19, M.lencode, 0, M.work, Ye), M.lenbits = Ye.bits, ke) {
              J.msg = "invalid code lengths set", M.mode = j;
              break;
            }
            M.have = 0, M.mode = he;
          /* falls through */
          case he:
            for (; M.have < M.nlen + M.ndist; ) {
              for (; Y = M.lencode[me & (1 << M.lenbits) - 1], pe = Y >>> 24, Te = Y >>> 16 & 255, ne = Y & 65535, !(pe <= Fe); ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              if (ne < 16)
                me >>>= pe, Fe -= pe, M.lens[M.have++] = ne;
              else {
                if (ne === 16) {
                  for (Qe = pe + 2; Fe < Qe; ) {
                    if (Ne === 0)
                      break e;
                    Ne--, me += Be[R++] << Fe, Fe += 8;
                  }
                  if (me >>>= pe, Fe -= pe, M.have === 0) {
                    J.msg = "invalid bit length repeat", M.mode = j;
                    break;
                  }
                  Ae = M.lens[M.have - 1], m = 3 + (me & 3), me >>>= 2, Fe -= 2;
                } else if (ne === 17) {
                  for (Qe = pe + 3; Fe < Qe; ) {
                    if (Ne === 0)
                      break e;
                    Ne--, me += Be[R++] << Fe, Fe += 8;
                  }
                  me >>>= pe, Fe -= pe, Ae = 0, m = 3 + (me & 7), me >>>= 3, Fe -= 3;
                } else {
                  for (Qe = pe + 7; Fe < Qe; ) {
                    if (Ne === 0)
                      break e;
                    Ne--, me += Be[R++] << Fe, Fe += 8;
                  }
                  me >>>= pe, Fe -= pe, Ae = 0, m = 11 + (me & 127), me >>>= 7, Fe -= 7;
                }
                if (M.have + m > M.nlen + M.ndist) {
                  J.msg = "invalid bit length repeat", M.mode = j;
                  break;
                }
                for (; m--; )
                  M.lens[M.have++] = Ae;
              }
            }
            if (M.mode === j)
              break;
            if (M.lens[256] === 0) {
              J.msg = "invalid code -- missing end-of-block", M.mode = j;
              break;
            }
            if (M.lenbits = 9, Ye = { bits: M.lenbits }, ke = r(p, M.lens, 0, M.nlen, M.lencode, 0, M.work, Ye), M.lenbits = Ye.bits, ke) {
              J.msg = "invalid literal/lengths set", M.mode = j;
              break;
            }
            if (M.distbits = 6, M.distcode = M.distdyn, Ye = { bits: M.distbits }, ke = r(f, M.lens, M.nlen, M.ndist, M.distcode, 0, M.work, Ye), M.distbits = Ye.bits, ke) {
              J.msg = "invalid distances set", M.mode = j;
              break;
            }
            if (M.mode = X, de === o)
              break e;
          /* falls through */
          case X:
            M.mode = Q;
          /* falls through */
          case Q:
            if (Ne >= 6 && V >= 258) {
              J.next_out = Ie, J.avail_out = V, J.next_in = R, J.avail_in = Ne, M.hold = me, M.bits = Fe, c(J, G), Ie = J.next_out, ze = J.output, V = J.avail_out, R = J.next_in, Be = J.input, Ne = J.avail_in, me = M.hold, Fe = M.bits, M.mode === ie && (M.back = -1);
              break;
            }
            for (M.back = 0; Y = M.lencode[me & (1 << M.lenbits) - 1], pe = Y >>> 24, Te = Y >>> 16 & 255, ne = Y & 65535, !(pe <= Fe); ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if (Te && (Te & 240) === 0) {
              for (ae = pe, ye = Te, xe = ne; Y = M.lencode[xe + ((me & (1 << ae + ye) - 1) >> ae)], pe = Y >>> 24, Te = Y >>> 16 & 255, ne = Y & 65535, !(ae + pe <= Fe); ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              me >>>= ae, Fe -= ae, M.back += ae;
            }
            if (me >>>= pe, Fe -= pe, M.back += pe, M.length = ne, Te === 0) {
              M.mode = C;
              break;
            }
            if (Te & 32) {
              M.back = -1, M.mode = ie;
              break;
            }
            if (Te & 64) {
              J.msg = "invalid literal/length code", M.mode = j;
              break;
            }
            M.extra = Te & 15, M.mode = H;
          /* falls through */
          case H:
            if (M.extra) {
              for (Qe = M.extra; Fe < Qe; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              M.length += me & (1 << M.extra) - 1, me >>>= M.extra, Fe -= M.extra, M.back += M.extra;
            }
            M.was = M.length, M.mode = se;
          /* falls through */
          case se:
            for (; Y = M.distcode[me & (1 << M.distbits) - 1], pe = Y >>> 24, Te = Y >>> 16 & 255, ne = Y & 65535, !(pe <= Fe); ) {
              if (Ne === 0)
                break e;
              Ne--, me += Be[R++] << Fe, Fe += 8;
            }
            if ((Te & 240) === 0) {
              for (ae = pe, ye = Te, xe = ne; Y = M.distcode[xe + ((me & (1 << ae + ye) - 1) >> ae)], pe = Y >>> 24, Te = Y >>> 16 & 255, ne = Y & 65535, !(ae + pe <= Fe); ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              me >>>= ae, Fe -= ae, M.back += ae;
            }
            if (me >>>= pe, Fe -= pe, M.back += pe, Te & 64) {
              J.msg = "invalid distance code", M.mode = j;
              break;
            }
            M.offset = ne, M.extra = Te & 15, M.mode = O;
          /* falls through */
          case O:
            if (M.extra) {
              for (Qe = M.extra; Fe < Qe; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              M.offset += me & (1 << M.extra) - 1, me >>>= M.extra, Fe -= M.extra, M.back += M.extra;
            }
            if (M.offset > M.dmax) {
              J.msg = "invalid distance too far back", M.mode = j;
              break;
            }
            M.mode = B;
          /* falls through */
          case B:
            if (V === 0)
              break e;
            if (m = G - V, M.offset > m) {
              if (m = M.offset - m, m > M.whave && M.sane) {
                J.msg = "invalid distance too far back", M.mode = j;
                break;
              }
              m > M.wnext ? (m -= M.wnext, h = M.wsize - m) : h = M.wnext - m, m > M.length && (m = M.length), T = M.window;
            } else
              T = ze, h = Ie - M.offset, m = M.length;
            m > V && (m = V), V -= m, M.length -= m;
            do
              ze[Ie++] = T[h++];
            while (--m);
            M.length === 0 && (M.mode = Q);
            break;
          case C:
            if (V === 0)
              break e;
            ze[Ie++] = M.length, V--, M.mode = Q;
            break;
          case ee:
            if (M.wrap) {
              for (; Fe < 32; ) {
                if (Ne === 0)
                  break e;
                Ne--, me |= Be[R++] << Fe, Fe += 8;
              }
              if (G -= V, J.total_out += G, M.total += G, G && (J.adler = M.check = /*UPDATE(state.check, put - _out, _out);*/
              M.flags ? l(M.check, ze, G, Ie - G) : e(M.check, ze, G, Ie - G)), G = V, (M.flags ? me : re(me)) !== M.check) {
                J.msg = "incorrect data check", M.mode = j;
                break;
              }
              me = 0, Fe = 0;
            }
            M.mode = te;
          /* falls through */
          case te:
            if (M.wrap && M.flags) {
              for (; Fe < 32; ) {
                if (Ne === 0)
                  break e;
                Ne--, me += Be[R++] << Fe, Fe += 8;
              }
              if (me !== (M.total & 4294967295)) {
                J.msg = "incorrect length check", M.mode = j;
                break;
              }
              me = 0, Fe = 0;
            }
            M.mode = N;
          /* falls through */
          case N:
            ke = S;
            break e;
          case j:
            ke = w;
            break e;
          case W:
            return u;
          case oe:
          /* falls through */
          default:
            return a;
        }
    return J.next_out = Ie, J.avail_out = V, J.next_in = R, J.avail_in = Ne, M.hold = me, M.bits = Fe, (M.wsize || G !== J.avail_out && M.mode < j && (M.mode < ee || de !== b)) && $(J, J.output, J.next_out, G - J.avail_out), Ve -= J.avail_in, G -= J.avail_out, J.total_in += Ve, J.total_out += G, M.total += G, M.wrap && G && (J.adler = M.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    M.flags ? l(M.check, ze, G, J.next_out - G) : e(M.check, ze, G, J.next_out - G)), J.data_type = M.bits + (M.last ? 64 : 0) + (M.mode === ie ? 128 : 0) + (M.mode === X || M.mode === be ? 256 : 0), (Ve === 0 && G === 0 || de === b) && ke === v && (ke = d), ke;
  }
  function g(J) {
    if (!J || !J.state)
      return a;
    var de = J.state;
    return de.window && (de.window = null), J.state = null, v;
  }
  function U(J, de) {
    var M;
    return !J || !J.state || (M = J.state, (M.wrap & 2) === 0) ? a : (M.head = de, de.done = !1, v);
  }
  function fe(J, de) {
    var M = de.length, Be, ze, R;
    return !J || !J.state || (Be = J.state, Be.wrap !== 0 && Be.mode !== F) ? a : Be.mode === F && (ze = 1, ze = e(ze, de, M, 0), ze !== Be.check) ? w : (R = $(J, de, M, M), R ? (Be.mode = W, u) : (Be.havedict = 1, v));
  }
  return Ar.inflateReset = Pe, Ar.inflateReset2 = $e, Ar.inflateResetKeep = Le, Ar.inflateInit = Ee, Ar.inflateInit2 = ve, Ar.inflate = n, Ar.inflateEnd = g, Ar.inflateGetHeader = U, Ar.inflateSetDictionary = fe, Ar.inflateInfo = "pako inflate (from Nodeca project)", Ar;
}
var Ji, fl;
function jh() {
  return fl || (fl = 1, Ji = {
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
  }), Ji;
}
var ll;
function Mh() {
  return ll || (ll = 1, (function(t) {
    var e = wt(), l = xh(), c = Nh(), r = Ch(), i = jh();
    for (var p in i)
      t[p] = i[p];
    t.NONE = 0, t.DEFLATE = 1, t.INFLATE = 2, t.GZIP = 3, t.GUNZIP = 4, t.DEFLATERAW = 5, t.INFLATERAW = 6, t.UNZIP = 7;
    var f = 31, b = 139;
    function A(o) {
      if (typeof o != "number" || o < t.DEFLATE || o > t.UNZIP)
        throw new TypeError("Bad argument");
      this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = o, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0;
    }
    A.prototype.close = function() {
      if (this.write_in_progress) {
        this.pending_close = !0;
        return;
      }
      this.pending_close = !1, e(this.init_done, "close before init"), e(this.mode <= t.UNZIP), this.mode === t.DEFLATE || this.mode === t.GZIP || this.mode === t.DEFLATERAW ? c.deflateEnd(this.strm) : (this.mode === t.INFLATE || this.mode === t.GUNZIP || this.mode === t.INFLATERAW || this.mode === t.UNZIP) && r.inflateEnd(this.strm), this.mode = t.NONE, this.dictionary = null;
    }, A.prototype.write = function(o, v, S, s, a, w, u) {
      return this._write(!0, o, v, S, s, a, w, u);
    }, A.prototype.writeSync = function(o, v, S, s, a, w, u) {
      return this._write(!1, o, v, S, s, a, w, u);
    }, A.prototype._write = function(o, v, S, s, a, w, u, d) {
      if (e.equal(arguments.length, 8), e(this.init_done, "write before init"), e(this.mode !== t.NONE, "already finalized"), e.equal(!1, this.write_in_progress, "write already in progress"), e.equal(!1, this.pending_close, "close is pending"), this.write_in_progress = !0, e.equal(!1, v === void 0, "must provide flush value"), this.write_in_progress = !0, v !== t.Z_NO_FLUSH && v !== t.Z_PARTIAL_FLUSH && v !== t.Z_SYNC_FLUSH && v !== t.Z_FULL_FLUSH && v !== t.Z_FINISH && v !== t.Z_BLOCK)
        throw new Error("Invalid flush value");
      if (S == null && (S = dr.alloc(0), a = 0, s = 0), this.strm.avail_in = a, this.strm.input = S, this.strm.next_in = s, this.strm.avail_out = d, this.strm.output = w, this.strm.next_out = u, this.flush = v, !o)
        return this._process(), this._checkError() ? this._afterSync() : void 0;
      var E = this;
      return Ke.nextTick(function() {
        E._process(), E._after();
      }), this;
    }, A.prototype._afterSync = function() {
      var o = this.strm.avail_out, v = this.strm.avail_in;
      return this.write_in_progress = !1, [v, o];
    }, A.prototype._process = function() {
      var o = null;
      switch (this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = c.deflate(this.strm, this.flush);
          break;
        case t.UNZIP:
          switch (this.strm.avail_in > 0 && (o = this.strm.next_in), this.gzip_id_bytes_read) {
            case 0:
              if (o === null)
                break;
              if (this.strm.input[o] === f) {
                if (this.gzip_id_bytes_read = 1, o++, this.strm.avail_in === 1)
                  break;
              } else {
                this.mode = t.INFLATE;
                break;
              }
            // fallthrough
            case 1:
              if (o === null)
                break;
              this.strm.input[o] === b ? (this.gzip_id_bytes_read = 2, this.mode = t.GUNZIP) : this.mode = t.INFLATE;
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
    }, A.prototype._checkError = function() {
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
    }, A.prototype._after = function() {
      if (this._checkError()) {
        var o = this.strm.avail_out, v = this.strm.avail_in;
        this.write_in_progress = !1, this.callback(v, o), this.pending_close && this.close();
      }
    }, A.prototype._error = function(o) {
      this.strm.msg && (o = this.strm.msg), this.onerror(
        o,
        this.err
        // no hope of rescue.
      ), this.write_in_progress = !1, this.pending_close && this.close();
    }, A.prototype.init = function(o, v, S, s, a) {
      e(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])"), e(o >= 8 && o <= 15, "invalid windowBits"), e(v >= -1 && v <= 9, "invalid compression level"), e(S >= 1 && S <= 9, "invalid memlevel"), e(s === t.Z_FILTERED || s === t.Z_HUFFMAN_ONLY || s === t.Z_RLE || s === t.Z_FIXED || s === t.Z_DEFAULT_STRATEGY, "invalid strategy"), this._init(v, o, S, s, a), this._setDictionary();
    }, A.prototype.params = function() {
      throw new Error("deflateParams Not supported");
    }, A.prototype.reset = function() {
      this._reset(), this._setDictionary();
    }, A.prototype._init = function(o, v, S, s, a) {
      switch (this.level = o, this.windowBits = v, this.memLevel = S, this.strategy = s, this.flush = t.Z_NO_FLUSH, this.err = t.Z_OK, (this.mode === t.GZIP || this.mode === t.GUNZIP) && (this.windowBits += 16), this.mode === t.UNZIP && (this.windowBits += 32), (this.mode === t.DEFLATERAW || this.mode === t.INFLATERAW) && (this.windowBits = -1 * this.windowBits), this.strm = new l(), this.mode) {
        case t.DEFLATE:
        case t.GZIP:
        case t.DEFLATERAW:
          this.err = c.deflateInit2(this.strm, this.level, t.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
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
      this.err !== t.Z_OK && this._error("Init error"), this.dictionary = a, this.write_in_progress = !1, this.init_done = !0;
    }, A.prototype._setDictionary = function() {
      if (this.dictionary != null) {
        switch (this.err = t.Z_OK, this.mode) {
          case t.DEFLATE:
          case t.DEFLATERAW:
            this.err = c.deflateSetDictionary(this.strm, this.dictionary);
            break;
        }
        this.err !== t.Z_OK && this._error("Failed to set dictionary");
      }
    }, A.prototype._reset = function() {
      switch (this.err = t.Z_OK, this.mode) {
        case t.DEFLATE:
        case t.DEFLATERAW:
        case t.GZIP:
          this.err = c.deflateReset(this.strm);
          break;
        case t.INFLATE:
        case t.INFLATERAW:
        case t.GUNZIP:
          this.err = r.inflateReset(this.strm);
          break;
      }
      this.err !== t.Z_OK && this._error("Failed to reset stream");
    }, t.Zlib = A;
  })(Ai)), Ai;
}
var ul;
function kh() {
  return ul || (ul = 1, (function(t) {
    var e = wr().Buffer, l = bh().Transform, c = Mh(), r = Yr(), i = wt().ok, p = wr().kMaxLength, f = "Cannot create final Buffer. It would be larger than 0x" + p.toString(16) + " bytes";
    c.Z_MIN_WINDOWBITS = 8, c.Z_MAX_WINDOWBITS = 15, c.Z_DEFAULT_WINDOWBITS = 15, c.Z_MIN_CHUNK = 64, c.Z_MAX_CHUNK = 1 / 0, c.Z_DEFAULT_CHUNK = 16 * 1024, c.Z_MIN_MEMLEVEL = 1, c.Z_MAX_MEMLEVEL = 9, c.Z_DEFAULT_MEMLEVEL = 8, c.Z_MIN_LEVEL = -1, c.Z_MAX_LEVEL = 9, c.Z_DEFAULT_LEVEL = c.Z_DEFAULT_COMPRESSION;
    for (var b = Object.keys(c), A = 0; A < b.length; A++) {
      var o = b[A];
      o.match(/^Z/) && Object.defineProperty(t, o, {
        enumerable: !0,
        value: c[o],
        writable: !1
      });
    }
    for (var v = {
      Z_OK: c.Z_OK,
      Z_STREAM_END: c.Z_STREAM_END,
      Z_NEED_DICT: c.Z_NEED_DICT,
      Z_ERRNO: c.Z_ERRNO,
      Z_STREAM_ERROR: c.Z_STREAM_ERROR,
      Z_DATA_ERROR: c.Z_DATA_ERROR,
      Z_MEM_ERROR: c.Z_MEM_ERROR,
      Z_BUF_ERROR: c.Z_BUF_ERROR,
      Z_VERSION_ERROR: c.Z_VERSION_ERROR
    }, S = Object.keys(v), s = 0; s < S.length; s++) {
      var a = S[s];
      v[v[a]] = a;
    }
    Object.defineProperty(t, "codes", {
      enumerable: !0,
      value: Object.freeze(v),
      writable: !1
    }), t.Deflate = d, t.Inflate = E, t.Gzip = _, t.Gunzip = I, t.DeflateRaw = P, t.InflateRaw = D, t.Unzip = x, t.createDeflate = function(y) {
      return new d(y);
    }, t.createInflate = function(y) {
      return new E(y);
    }, t.createDeflateRaw = function(y) {
      return new P(y);
    }, t.createInflateRaw = function(y) {
      return new D(y);
    }, t.createGzip = function(y) {
      return new _(y);
    }, t.createGunzip = function(y) {
      return new I(y);
    }, t.createUnzip = function(y) {
      return new x(y);
    }, t.deflate = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new d(F), y, ie);
    }, t.deflateSync = function(y, F) {
      return u(new d(F), y);
    }, t.gzip = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new _(F), y, ie);
    }, t.gzipSync = function(y, F) {
      return u(new _(F), y);
    }, t.deflateRaw = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new P(F), y, ie);
    }, t.deflateRawSync = function(y, F) {
      return u(new P(F), y);
    }, t.unzip = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new x(F), y, ie);
    }, t.unzipSync = function(y, F) {
      return u(new x(F), y);
    }, t.inflate = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new E(F), y, ie);
    }, t.inflateSync = function(y, F) {
      return u(new E(F), y);
    }, t.gunzip = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new I(F), y, ie);
    }, t.gunzipSync = function(y, F) {
      return u(new I(F), y);
    }, t.inflateRaw = function(y, F, ie) {
      return typeof F == "function" && (ie = F, F = {}), w(new D(F), y, ie);
    }, t.inflateRawSync = function(y, F) {
      return u(new D(F), y);
    };
    function w(y, F, ie) {
      var ce = [], _e = 0;
      y.on("error", ue), y.on("end", le), y.end(F), be();
      function be() {
        for (var k; (k = y.read()) !== null; )
          ce.push(k), _e += k.length;
        y.once("readable", be);
      }
      function ue(k) {
        y.removeListener("end", le), y.removeListener("readable", be), ie(k);
      }
      function le() {
        var k, he = null;
        _e >= p ? he = new RangeError(f) : k = e.concat(ce, _e), ce = [], y.close(), ie(he, k);
      }
    }
    function u(y, F) {
      if (typeof F == "string" && (F = e.from(F)), !e.isBuffer(F)) throw new TypeError("Not a string or buffer");
      var ie = y._finishFlushFlag;
      return y._processChunk(F, ie);
    }
    function d(y) {
      if (!(this instanceof d)) return new d(y);
      K.call(this, y, c.DEFLATE);
    }
    function E(y) {
      if (!(this instanceof E)) return new E(y);
      K.call(this, y, c.INFLATE);
    }
    function _(y) {
      if (!(this instanceof _)) return new _(y);
      K.call(this, y, c.GZIP);
    }
    function I(y) {
      if (!(this instanceof I)) return new I(y);
      K.call(this, y, c.GUNZIP);
    }
    function P(y) {
      if (!(this instanceof P)) return new P(y);
      K.call(this, y, c.DEFLATERAW);
    }
    function D(y) {
      if (!(this instanceof D)) return new D(y);
      K.call(this, y, c.INFLATERAW);
    }
    function x(y) {
      if (!(this instanceof x)) return new x(y);
      K.call(this, y, c.UNZIP);
    }
    function q(y) {
      return y === c.Z_NO_FLUSH || y === c.Z_PARTIAL_FLUSH || y === c.Z_SYNC_FLUSH || y === c.Z_FULL_FLUSH || y === c.Z_FINISH || y === c.Z_BLOCK;
    }
    function K(y, F) {
      var ie = this;
      if (this._opts = y = y || {}, this._chunkSize = y.chunkSize || t.Z_DEFAULT_CHUNK, l.call(this, y), y.flush && !q(y.flush))
        throw new Error("Invalid flush flag: " + y.flush);
      if (y.finishFlush && !q(y.finishFlush))
        throw new Error("Invalid flush flag: " + y.finishFlush);
      if (this._flushFlag = y.flush || c.Z_NO_FLUSH, this._finishFlushFlag = typeof y.finishFlush < "u" ? y.finishFlush : c.Z_FINISH, y.chunkSize && (y.chunkSize < t.Z_MIN_CHUNK || y.chunkSize > t.Z_MAX_CHUNK))
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
      this._handle = new c.Zlib(F);
      var ce = this;
      this._hadError = !1, this._handle.onerror = function(ue, le) {
        L(ce), ce._hadError = !0;
        var k = new Error(ue);
        k.errno = le, k.code = t.codes[le], ce.emit("error", k);
      };
      var _e = t.Z_DEFAULT_COMPRESSION;
      typeof y.level == "number" && (_e = y.level);
      var be = t.Z_DEFAULT_STRATEGY;
      typeof y.strategy == "number" && (be = y.strategy), this._handle.init(y.windowBits || t.Z_DEFAULT_WINDOWBITS, _e, y.memLevel || t.Z_DEFAULT_MEMLEVEL, be, y.dictionary), this._buffer = e.allocUnsafe(this._chunkSize), this._offset = 0, this._level = _e, this._strategy = be, this.once("end", this.close), Object.defineProperty(this, "_closed", {
        get: function() {
          return !ie._handle;
        },
        configurable: !0,
        enumerable: !0
      });
    }
    r.inherits(K, l), K.prototype.params = function(y, F, ie) {
      if (y < t.Z_MIN_LEVEL || y > t.Z_MAX_LEVEL)
        throw new RangeError("Invalid compression level: " + y);
      if (F != t.Z_FILTERED && F != t.Z_HUFFMAN_ONLY && F != t.Z_RLE && F != t.Z_FIXED && F != t.Z_DEFAULT_STRATEGY)
        throw new TypeError("Invalid strategy: " + F);
      if (this._level !== y || this._strategy !== F) {
        var ce = this;
        this.flush(c.Z_SYNC_FLUSH, function() {
          i(ce._handle, "zlib binding closed"), ce._handle.params(y, F), ce._hadError || (ce._level = y, ce._strategy = F, ie && ie());
        });
      } else
        Ke.nextTick(ie);
    }, K.prototype.reset = function() {
      return i(this._handle, "zlib binding closed"), this._handle.reset();
    }, K.prototype._flush = function(y) {
      this._transform(e.alloc(0), "", y);
    }, K.prototype.flush = function(y, F) {
      var ie = this, ce = this._writableState;
      (typeof y == "function" || y === void 0 && !F) && (F = y, y = c.Z_FULL_FLUSH), ce.ended ? F && Ke.nextTick(F) : ce.ending ? F && this.once("end", F) : ce.needDrain ? F && this.once("drain", function() {
        return ie.flush(y, F);
      }) : (this._flushFlag = y, this.write(e.alloc(0), "", F));
    }, K.prototype.close = function(y) {
      L(this, y), Ke.nextTick(z, this);
    };
    function L(y, F) {
      F && Ke.nextTick(F), y._handle && (y._handle.close(), y._handle = null);
    }
    function z(y) {
      y.emit("close");
    }
    K.prototype._transform = function(y, F, ie) {
      var ce, _e = this._writableState, be = _e.ending || _e.ended, ue = be && (!y || _e.length === y.length);
      if (y !== null && !e.isBuffer(y)) return ie(new Error("invalid input"));
      if (!this._handle) return ie(new Error("zlib binding closed"));
      ue ? ce = this._finishFlushFlag : (ce = this._flushFlag, y.length >= _e.length && (this._flushFlag = this._opts.flush || c.Z_NO_FLUSH)), this._processChunk(y, ce, ie);
    }, K.prototype._processChunk = function(y, F, ie) {
      var ce = y && y.length, _e = this._chunkSize - this._offset, be = 0, ue = this, le = typeof ie == "function";
      if (!le) {
        var k = [], he = 0, X;
        this.on("error", function(B) {
          X = B;
        }), i(this._handle, "zlib binding closed");
        do
          var Q = this._handle.writeSync(
            F,
            y,
            // in
            be,
            // in_off
            ce,
            // in_len
            this._buffer,
            // out
            this._offset,
            //out_off
            _e
          );
        while (!this._hadError && O(Q[0], Q[1]));
        if (this._hadError)
          throw X;
        if (he >= p)
          throw L(this), new RangeError(f);
        var H = e.concat(k, he);
        return L(this), H;
      }
      i(this._handle, "zlib binding closed");
      var se = this._handle.write(
        F,
        y,
        // in
        be,
        // in_off
        ce,
        // in_len
        this._buffer,
        // out
        this._offset,
        //out_off
        _e
      );
      se.buffer = y, se.callback = O;
      function O(B, C) {
        if (this && (this.buffer = null, this.callback = null), !ue._hadError) {
          var ee = _e - C;
          if (i(ee >= 0, "have should not go down"), ee > 0) {
            var te = ue._buffer.slice(ue._offset, ue._offset + ee);
            ue._offset += ee, le ? ue.push(te) : (k.push(te), he += te.length);
          }
          if ((C === 0 || ue._offset >= ue._chunkSize) && (_e = ue._chunkSize, ue._offset = 0, ue._buffer = e.allocUnsafe(ue._chunkSize)), C === 0) {
            if (be += ce - B, ce = B, !le) return !0;
            var N = ue._handle.write(F, y, be, ce, ue._buffer, ue._offset, ue._chunkSize);
            N.callback = O, N.buffer = y;
            return;
          }
          if (!le) return !1;
          ie();
        }
      }
    }, r.inherits(d, K), r.inherits(E, K), r.inherits(_, K), r.inherits(I, K), r.inherits(P, K), r.inherits(D, K), r.inherits(x, K);
  })(an)), an;
}
var Xi, cl;
function $r() {
  if (cl) return Xi;
  cl = 1;
  function t(o, v) {
    const S = o.split("/");
    let s = 0;
    if (S[s] === "") {
      for (; v[".."] !== void 0; )
        v = v[".."];
      s++;
    }
    for (; s < S.length; s++)
      v = v[S[s]];
    return v;
  }
  function e(o) {
    if (typeof o == "string")
      return { type: o };
    if (Array.isArray(o))
      return { type: o[0], typeArgs: o[1] };
    if (typeof o.type == "string")
      return o;
    throw new Error("Not a fieldinfo");
  }
  function l(o, v, { count: S, countType: s }, a) {
    let w = 0, u = 0;
    return typeof S == "number" ? w = S : typeof S < "u" ? w = t(S, a) : typeof s < "u" ? { size: u, value: w } = f(() => this.read(o, v, e(s), a), "$count") : w = 0, { count: w, size: u };
  }
  function c(o, v, S, { count: s, countType: a }, w) {
    return typeof s < "u" && o !== s || typeof a < "u" && (S = this.write(o, v, S, e(a), w)), S;
  }
  function r(o, { count: v, countType: S }, s) {
    return typeof v > "u" && typeof S < "u" ? f(() => this.sizeOf(o, e(S), s), "$count") : 0;
  }
  function i(o, v) {
    throw o.field = o.field ? v + "." + o.field : v, o;
  }
  function p(o, v) {
    try {
      return o();
    } catch (S) {
      v(S);
    }
  }
  function f(o, v) {
    return p(o, (S) => i(S, v));
  }
  class b extends Error {
    constructor(v) {
      super(v), this.name = this.constructor.name, this.message = v, Error.captureStackTrace != null && Error.captureStackTrace(this, this.constructor.name);
    }
  }
  class A extends b {
    constructor(v) {
      super(v), this.partialReadError = !0;
    }
  }
  return Xi = {
    getField: t,
    getFieldInfo: e,
    addErrorField: i,
    getCount: l,
    sendCount: c,
    calcCount: r,
    tryCatch: p,
    tryDoc: f,
    PartialReadError: A
  }, Xi;
}
var mt = { exports: {} };
mt.exports;
var dl;
function qh() {
  return dl || (dl = 1, (function(t, e) {
    var l = 200, c = "Expected a function", r = "__lodash_hash_undefined__", i = 1, p = 2, f = 9007199254740991, b = "[object Arguments]", A = "[object Array]", o = "[object Boolean]", v = "[object Date]", S = "[object Error]", s = "[object Function]", a = "[object GeneratorFunction]", w = "[object Map]", u = "[object Number]", d = "[object Object]", E = "[object Promise]", _ = "[object RegExp]", I = "[object Set]", P = "[object String]", D = "[object Symbol]", x = "[object WeakMap]", q = "[object ArrayBuffer]", K = "[object DataView]", L = "[object Float32Array]", z = "[object Float64Array]", y = "[object Int8Array]", F = "[object Int16Array]", ie = "[object Int32Array]", ce = "[object Uint8Array]", _e = "[object Uint8ClampedArray]", be = "[object Uint16Array]", ue = "[object Uint32Array]", le = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, k = /^\w*$/, he = /^\./, X = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Q = /[\\^$.*+?()[\]{}|]/g, H = /\\(\\)?/g, se = /^\[object .+?Constructor\]$/, O = /^(?:0|[1-9]\d*)$/, B = {};
    B[L] = B[z] = B[y] = B[F] = B[ie] = B[ce] = B[_e] = B[be] = B[ue] = !0, B[b] = B[A] = B[q] = B[o] = B[K] = B[v] = B[S] = B[s] = B[w] = B[u] = B[d] = B[_] = B[I] = B[P] = B[x] = !1;
    var C = typeof Tr == "object" && Tr && Tr.Object === Object && Tr, ee = typeof self == "object" && self && self.Object === Object && self, te = C || ee || Function("return this")(), N = e && !e.nodeType && e, j = N && !0 && t && !t.nodeType && t, W = j && j.exports === N, oe = W && C.process, we = (function() {
      try {
        return oe && oe.binding("util");
      } catch {
      }
    })(), Se = we && we.isTypedArray;
    function Re(Z, ge, Ce, Ue) {
      var Ze = -1, Ge = Z ? Z.length : 0;
      for (Ue && Ge && (Ce = Z[++Ze]); ++Ze < Ge; )
        Ce = ge(Ce, Z[Ze], Ze, Z);
      return Ce;
    }
    function Oe(Z, ge) {
      for (var Ce = -1, Ue = Z ? Z.length : 0; ++Ce < Ue; )
        if (ge(Z[Ce], Ce, Z))
          return !0;
      return !1;
    }
    function re(Z) {
      return function(ge) {
        return ge == null ? void 0 : ge[Z];
      };
    }
    function De(Z, ge, Ce, Ue, Ze) {
      return Ze(Z, function(Ge, er, lr) {
        Ce = Ue ? (Ue = !1, Ge) : ge(Ce, Ge, er, lr);
      }), Ce;
    }
    function Le(Z, ge) {
      for (var Ce = -1, Ue = Array(Z); ++Ce < Z; )
        Ue[Ce] = ge(Ce);
      return Ue;
    }
    function Pe(Z) {
      return function(ge) {
        return Z(ge);
      };
    }
    function $e(Z, ge) {
      return Z == null ? void 0 : Z[ge];
    }
    function ve(Z) {
      var ge = !1;
      if (Z != null && typeof Z.toString != "function")
        try {
          ge = !!(Z + "");
        } catch {
        }
      return ge;
    }
    function Ee(Z) {
      var ge = -1, Ce = Array(Z.size);
      return Z.forEach(function(Ue, Ze) {
        Ce[++ge] = [Ze, Ue];
      }), Ce;
    }
    function je(Z, ge) {
      return function(Ce) {
        return Z(ge(Ce));
      };
    }
    function qe(Z) {
      var ge = -1, Ce = Array(Z.size);
      return Z.forEach(function(Ue) {
        Ce[++ge] = Ue;
      }), Ce;
    }
    var Me = Array.prototype, We = Function.prototype, $ = Object.prototype, n = te["__core-js_shared__"], g = (function() {
      var Z = /[^.]+$/.exec(n && n.keys && n.keys.IE_PROTO || "");
      return Z ? "Symbol(src)_1." + Z : "";
    })(), U = We.toString, fe = $.hasOwnProperty, J = $.toString, de = RegExp(
      "^" + U.call(fe).replace(Q, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), M = te.Symbol, Be = te.Uint8Array, ze = $.propertyIsEnumerable, R = Me.splice, Ie = je(Object.keys, Object), Ne = ft(te, "DataView"), V = ft(te, "Map"), me = ft(te, "Promise"), Fe = ft(te, "Set"), Ve = ft(te, "WeakMap"), G = ft(Object, "create"), m = Xr(Ne), h = Xr(V), T = Xr(me), Y = Xr(Fe), pe = Xr(Ve), Te = M ? M.prototype : void 0, ne = Te ? Te.valueOf : void 0, ae = Te ? Te.toString : void 0;
    function ye(Z) {
      var ge = -1, Ce = Z ? Z.length : 0;
      for (this.clear(); ++ge < Ce; ) {
        var Ue = Z[ge];
        this.set(Ue[0], Ue[1]);
      }
    }
    function xe() {
      this.__data__ = G ? G(null) : {};
    }
    function Ae(Z) {
      return this.has(Z) && delete this.__data__[Z];
    }
    function ke(Z) {
      var ge = this.__data__;
      if (G) {
        var Ce = ge[Z];
        return Ce === r ? void 0 : Ce;
      }
      return fe.call(ge, Z) ? ge[Z] : void 0;
    }
    function He(Z) {
      var ge = this.__data__;
      return G ? ge[Z] !== void 0 : fe.call(ge, Z);
    }
    function Ye(Z, ge) {
      var Ce = this.__data__;
      return Ce[Z] = G && ge === void 0 ? r : ge, this;
    }
    ye.prototype.clear = xe, ye.prototype.delete = Ae, ye.prototype.get = ke, ye.prototype.has = He, ye.prototype.set = Ye;
    function Qe(Z) {
      var ge = -1, Ce = Z ? Z.length : 0;
      for (this.clear(); ++ge < Ce; ) {
        var Ue = Z[ge];
        this.set(Ue[0], Ue[1]);
      }
    }
    function nr() {
      this.__data__ = [];
    }
    function Je(Z) {
      var ge = this.__data__, Ce = Mr(ge, Z);
      if (Ce < 0)
        return !1;
      var Ue = ge.length - 1;
      return Ce == Ue ? ge.pop() : R.call(ge, Ce, 1), !0;
    }
    function rr(Z) {
      var ge = this.__data__, Ce = Mr(ge, Z);
      return Ce < 0 ? void 0 : ge[Ce][1];
    }
    function ar(Z) {
      return Mr(this.__data__, Z) > -1;
    }
    function Xe(Z, ge) {
      var Ce = this.__data__, Ue = Mr(Ce, Z);
      return Ue < 0 ? Ce.push([Z, ge]) : Ce[Ue][1] = ge, this;
    }
    Qe.prototype.clear = nr, Qe.prototype.delete = Je, Qe.prototype.get = rr, Qe.prototype.has = ar, Qe.prototype.set = Xe;
    function tr(Z) {
      var ge = -1, Ce = Z ? Z.length : 0;
      for (this.clear(); ++ge < Ce; ) {
        var Ue = Z[ge];
        this.set(Ue[0], Ue[1]);
      }
    }
    function sr() {
      this.__data__ = {
        hash: new ye(),
        map: new (V || Qe)(),
        string: new ye()
      };
    }
    function ir(Z) {
      return Ot(this, Z).delete(Z);
    }
    function Fr(Z) {
      return Ot(this, Z).get(Z);
    }
    function _r(Z) {
      return Ot(this, Z).has(Z);
    }
    function Er(Z, ge) {
      return Ot(this, Z).set(Z, ge), this;
    }
    tr.prototype.clear = sr, tr.prototype.delete = ir, tr.prototype.get = Fr, tr.prototype.has = _r, tr.prototype.set = Er;
    function Ir(Z) {
      var ge = -1, Ce = Z ? Z.length : 0;
      for (this.__data__ = new tr(); ++ge < Ce; )
        this.add(Z[ge]);
    }
    function Cr(Z) {
      return this.__data__.set(Z, r), this;
    }
    function vr(Z) {
      return this.__data__.has(Z);
    }
    Ir.prototype.add = Ir.prototype.push = Cr, Ir.prototype.has = vr;
    function cr(Z) {
      this.__data__ = new Qe(Z);
    }
    function jr() {
      this.__data__ = new Qe();
    }
    function Or(Z) {
      return this.__data__.delete(Z);
    }
    function Jr(Z) {
      return this.__data__.get(Z);
    }
    function At(Z) {
      return this.__data__.has(Z);
    }
    function Pt(Z, ge) {
      var Ce = this.__data__;
      if (Ce instanceof Qe) {
        var Ue = Ce.__data__;
        if (!V || Ue.length < l - 1)
          return Ue.push([Z, ge]), this;
        Ce = this.__data__ = new tr(Ue);
      }
      return Ce.set(Z, ge), this;
    }
    cr.prototype.clear = jr, cr.prototype.delete = Or, cr.prototype.get = Jr, cr.prototype.has = At, cr.prototype.set = Pt;
    function ot(Z, ge) {
      var Ce = Gr(Z) || ss(Z) ? Le(Z.length, String) : [], Ue = Ce.length, Ze = !!Ue;
      for (var Ge in Z)
        fe.call(Z, Ge) && !(Ze && (Ge == "length" || ns(Ge, Ue))) && Ce.push(Ge);
      return Ce;
    }
    function Mr(Z, ge) {
      for (var Ce = Z.length; Ce--; )
        if (os(Z[Ce][0], ge))
          return Ce;
      return -1;
    }
    var st = td(It), Tt = nd();
    function It(Z, ge) {
      return Z && Tt(Z, ge, Bt);
    }
    function Hr(Z, ge) {
      ge = xt(ge, Z) ? [ge] : rs(ge);
      for (var Ce = 0, Ue = ge.length; Z != null && Ce < Ue; )
        Z = Z[Ft(ge[Ce++])];
      return Ce && Ce == Ue ? Z : void 0;
    }
    function Wc(Z) {
      return J.call(Z);
    }
    function Hc(Z, ge) {
      return Z != null && ge in Object(Z);
    }
    function Jt(Z, ge, Ce, Ue, Ze) {
      return Z === ge ? !0 : Z == null || ge == null || !Dt(Z) && !Nt(ge) ? Z !== Z && ge !== ge : Vc(Z, ge, Jt, Ce, Ue, Ze);
    }
    function Vc(Z, ge, Ce, Ue, Ze, Ge) {
      var er = Gr(Z), lr = Gr(ge), fr = A, hr = A;
      er || (fr = Vr(Z), fr = fr == b ? d : fr), lr || (hr = Vr(ge), hr = hr == b ? d : hr);
      var gr = fr == d && !ve(Z), mr = hr == d && !ve(ge), pr = fr == hr;
      if (pr && !gr)
        return Ge || (Ge = new cr()), er || pd(Z) ? ts(Z, ge, Ce, Ue, Ze, Ge) : id(Z, ge, fr, Ce, Ue, Ze, Ge);
      if (!(Ze & p)) {
        var Sr = gr && fe.call(Z, "__wrapped__"), Rr = mr && fe.call(ge, "__wrapped__");
        if (Sr || Rr) {
          var Zr = Sr ? Z.value() : Z, kr = Rr ? ge.value() : ge;
          return Ge || (Ge = new cr()), Ce(Zr, kr, Ue, Ze, Ge);
        }
      }
      return pr ? (Ge || (Ge = new cr()), ad(Z, ge, Ce, Ue, Ze, Ge)) : !1;
    }
    function Gc(Z, ge, Ce, Ue) {
      var Ze = Ce.length, Ge = Ze;
      if (Z == null)
        return !Ge;
      for (Z = Object(Z); Ze--; ) {
        var er = Ce[Ze];
        if (er[2] ? er[1] !== Z[er[0]] : !(er[0] in Z))
          return !1;
      }
      for (; ++Ze < Ge; ) {
        er = Ce[Ze];
        var lr = er[0], fr = Z[lr], hr = er[1];
        if (er[2]) {
          if (fr === void 0 && !(lr in Z))
            return !1;
        } else {
          var gr = new cr(), mr;
          if (!(mr === void 0 ? Jt(hr, fr, Ue, i | p, gr) : mr))
            return !1;
        }
      }
      return !0;
    }
    function Zc(Z) {
      if (!Dt(Z) || ld(Z))
        return !1;
      var ge = fs(Z) || ve(Z) ? de : se;
      return ge.test(Xr(Z));
    }
    function Kc(Z) {
      return Nt(Z) && rn(Z.length) && !!B[J.call(Z)];
    }
    function Yc(Z) {
      return typeof Z == "function" ? Z : Z == null ? md : typeof Z == "object" ? Gr(Z) ? Xc(Z[0], Z[1]) : Jc(Z) : bd(Z);
    }
    function Qc(Z) {
      if (!ud(Z))
        return Ie(Z);
      var ge = [];
      for (var Ce in Object(Z))
        fe.call(Z, Ce) && Ce != "constructor" && ge.push(Ce);
      return ge;
    }
    function Jc(Z) {
      var ge = od(Z);
      return ge.length == 1 && ge[0][2] ? as(ge[0][0], ge[0][1]) : function(Ce) {
        return Ce === Z || Gc(Ce, Z, ge);
      };
    }
    function Xc(Z, ge) {
      return xt(Z) && is(ge) ? as(Ft(Z), ge) : function(Ce) {
        var Ue = vd(Ce, Z);
        return Ue === void 0 && Ue === ge ? gd(Ce, Z) : Jt(ge, Ue, void 0, i | p);
      };
    }
    function ed(Z) {
      return function(ge) {
        return Hr(ge, Z);
      };
    }
    function rd(Z) {
      if (typeof Z == "string")
        return Z;
      if (tn(Z))
        return ae ? ae.call(Z) : "";
      var ge = Z + "";
      return ge == "0" && 1 / Z == -1 / 0 ? "-0" : ge;
    }
    function rs(Z) {
      return Gr(Z) ? Z : cd(Z);
    }
    function td(Z, ge) {
      return function(Ce, Ue) {
        if (Ce == null)
          return Ce;
        if (!en(Ce))
          return Z(Ce, Ue);
        for (var Ze = Ce.length, Ge = -1, er = Object(Ce); ++Ge < Ze && Ue(er[Ge], Ge, er) !== !1; )
          ;
        return Ce;
      };
    }
    function nd(Z) {
      return function(ge, Ce, Ue) {
        for (var Ze = -1, Ge = Object(ge), er = Ue(ge), lr = er.length; lr--; ) {
          var fr = er[++Ze];
          if (Ce(Ge[fr], fr, Ge) === !1)
            break;
        }
        return ge;
      };
    }
    function ts(Z, ge, Ce, Ue, Ze, Ge) {
      var er = Ze & p, lr = Z.length, fr = ge.length;
      if (lr != fr && !(er && fr > lr))
        return !1;
      var hr = Ge.get(Z);
      if (hr && Ge.get(ge))
        return hr == ge;
      var gr = -1, mr = !0, pr = Ze & i ? new Ir() : void 0;
      for (Ge.set(Z, ge), Ge.set(ge, Z); ++gr < lr; ) {
        var Sr = Z[gr], Rr = ge[gr];
        if (Ue)
          var Zr = er ? Ue(Rr, Sr, gr, ge, Z, Ge) : Ue(Sr, Rr, gr, Z, ge, Ge);
        if (Zr !== void 0) {
          if (Zr)
            continue;
          mr = !1;
          break;
        }
        if (pr) {
          if (!Oe(ge, function(kr, et) {
            if (!pr.has(et) && (Sr === kr || Ce(Sr, kr, Ue, Ze, Ge)))
              return pr.add(et);
          })) {
            mr = !1;
            break;
          }
        } else if (!(Sr === Rr || Ce(Sr, Rr, Ue, Ze, Ge))) {
          mr = !1;
          break;
        }
      }
      return Ge.delete(Z), Ge.delete(ge), mr;
    }
    function id(Z, ge, Ce, Ue, Ze, Ge, er) {
      switch (Ce) {
        case K:
          if (Z.byteLength != ge.byteLength || Z.byteOffset != ge.byteOffset)
            return !1;
          Z = Z.buffer, ge = ge.buffer;
        case q:
          return !(Z.byteLength != ge.byteLength || !Ue(new Be(Z), new Be(ge)));
        case o:
        case v:
        case u:
          return os(+Z, +ge);
        case S:
          return Z.name == ge.name && Z.message == ge.message;
        case _:
        case P:
          return Z == ge + "";
        case w:
          var lr = Ee;
        case I:
          var fr = Ge & p;
          if (lr || (lr = qe), Z.size != ge.size && !fr)
            return !1;
          var hr = er.get(Z);
          if (hr)
            return hr == ge;
          Ge |= i, er.set(Z, ge);
          var gr = ts(lr(Z), lr(ge), Ue, Ze, Ge, er);
          return er.delete(Z), gr;
        case D:
          if (ne)
            return ne.call(Z) == ne.call(ge);
      }
      return !1;
    }
    function ad(Z, ge, Ce, Ue, Ze, Ge) {
      var er = Ze & p, lr = Bt(Z), fr = lr.length, hr = Bt(ge), gr = hr.length;
      if (fr != gr && !er)
        return !1;
      for (var mr = fr; mr--; ) {
        var pr = lr[mr];
        if (!(er ? pr in ge : fe.call(ge, pr)))
          return !1;
      }
      var Sr = Ge.get(Z);
      if (Sr && Ge.get(ge))
        return Sr == ge;
      var Rr = !0;
      Ge.set(Z, ge), Ge.set(ge, Z);
      for (var Zr = er; ++mr < fr; ) {
        pr = lr[mr];
        var kr = Z[pr], et = ge[pr];
        if (Ue)
          var ls = er ? Ue(et, kr, pr, ge, Z, Ge) : Ue(kr, et, pr, Z, ge, Ge);
        if (!(ls === void 0 ? kr === et || Ce(kr, et, Ue, Ze, Ge) : ls)) {
          Rr = !1;
          break;
        }
        Zr || (Zr = pr == "constructor");
      }
      if (Rr && !Zr) {
        var Lt = Z.constructor, Ct = ge.constructor;
        Lt != Ct && "constructor" in Z && "constructor" in ge && !(typeof Lt == "function" && Lt instanceof Lt && typeof Ct == "function" && Ct instanceof Ct) && (Rr = !1);
      }
      return Ge.delete(Z), Ge.delete(ge), Rr;
    }
    function Ot(Z, ge) {
      var Ce = Z.__data__;
      return fd(ge) ? Ce[typeof ge == "string" ? "string" : "hash"] : Ce.map;
    }
    function od(Z) {
      for (var ge = Bt(Z), Ce = ge.length; Ce--; ) {
        var Ue = ge[Ce], Ze = Z[Ue];
        ge[Ce] = [Ue, Ze, is(Ze)];
      }
      return ge;
    }
    function ft(Z, ge) {
      var Ce = $e(Z, ge);
      return Zc(Ce) ? Ce : void 0;
    }
    var Vr = Wc;
    (Ne && Vr(new Ne(new ArrayBuffer(1))) != K || V && Vr(new V()) != w || me && Vr(me.resolve()) != E || Fe && Vr(new Fe()) != I || Ve && Vr(new Ve()) != x) && (Vr = function(Z) {
      var ge = J.call(Z), Ce = ge == d ? Z.constructor : void 0, Ue = Ce ? Xr(Ce) : void 0;
      if (Ue)
        switch (Ue) {
          case m:
            return K;
          case h:
            return w;
          case T:
            return E;
          case Y:
            return I;
          case pe:
            return x;
        }
      return ge;
    });
    function sd(Z, ge, Ce) {
      ge = xt(ge, Z) ? [ge] : rs(ge);
      for (var Ue, Ze = -1, er = ge.length; ++Ze < er; ) {
        var Ge = Ft(ge[Ze]);
        if (!(Ue = Z != null && Ce(Z, Ge)))
          break;
        Z = Z[Ge];
      }
      if (Ue)
        return Ue;
      var er = Z ? Z.length : 0;
      return !!er && rn(er) && ns(Ge, er) && (Gr(Z) || ss(Z));
    }
    function ns(Z, ge) {
      return ge = ge ?? f, !!ge && (typeof Z == "number" || O.test(Z)) && Z > -1 && Z % 1 == 0 && Z < ge;
    }
    function xt(Z, ge) {
      if (Gr(Z))
        return !1;
      var Ce = typeof Z;
      return Ce == "number" || Ce == "symbol" || Ce == "boolean" || Z == null || tn(Z) ? !0 : k.test(Z) || !le.test(Z) || ge != null && Z in Object(ge);
    }
    function fd(Z) {
      var ge = typeof Z;
      return ge == "string" || ge == "number" || ge == "symbol" || ge == "boolean" ? Z !== "__proto__" : Z === null;
    }
    function ld(Z) {
      return !!g && g in Z;
    }
    function ud(Z) {
      var ge = Z && Z.constructor, Ce = typeof ge == "function" && ge.prototype || $;
      return Z === Ce;
    }
    function is(Z) {
      return Z === Z && !Dt(Z);
    }
    function as(Z, ge) {
      return function(Ce) {
        return Ce == null ? !1 : Ce[Z] === ge && (ge !== void 0 || Z in Object(Ce));
      };
    }
    var cd = Xt(function(Z) {
      Z = yd(Z);
      var ge = [];
      return he.test(Z) && ge.push(""), Z.replace(X, function(Ce, Ue, Ze, Ge) {
        ge.push(Ze ? Ge.replace(H, "$1") : Ue || Ce);
      }), ge;
    });
    function Ft(Z) {
      if (typeof Z == "string" || tn(Z))
        return Z;
      var ge = Z + "";
      return ge == "0" && 1 / Z == -1 / 0 ? "-0" : ge;
    }
    function Xr(Z) {
      if (Z != null) {
        try {
          return U.call(Z);
        } catch {
        }
        try {
          return Z + "";
        } catch {
        }
      }
      return "";
    }
    function dd(Z, ge, Ce) {
      var Ue = Gr(Z) ? Re : De, Ze = arguments.length < 3;
      return Ue(Z, Yc(ge), Ce, Ze, st);
    }
    function Xt(Z, ge) {
      if (typeof Z != "function" || ge && typeof ge != "function")
        throw new TypeError(c);
      var Ce = function() {
        var Ue = arguments, Ze = ge ? ge.apply(this, Ue) : Ue[0], Ge = Ce.cache;
        if (Ge.has(Ze))
          return Ge.get(Ze);
        var er = Z.apply(this, Ue);
        return Ce.cache = Ge.set(Ze, er), er;
      };
      return Ce.cache = new (Xt.Cache || tr)(), Ce;
    }
    Xt.Cache = tr;
    function os(Z, ge) {
      return Z === ge || Z !== Z && ge !== ge;
    }
    function ss(Z) {
      return hd(Z) && fe.call(Z, "callee") && (!ze.call(Z, "callee") || J.call(Z) == b);
    }
    var Gr = Array.isArray;
    function en(Z) {
      return Z != null && rn(Z.length) && !fs(Z);
    }
    function hd(Z) {
      return Nt(Z) && en(Z);
    }
    function fs(Z) {
      var ge = Dt(Z) ? J.call(Z) : "";
      return ge == s || ge == a;
    }
    function rn(Z) {
      return typeof Z == "number" && Z > -1 && Z % 1 == 0 && Z <= f;
    }
    function Dt(Z) {
      var ge = typeof Z;
      return !!Z && (ge == "object" || ge == "function");
    }
    function Nt(Z) {
      return !!Z && typeof Z == "object";
    }
    function tn(Z) {
      return typeof Z == "symbol" || Nt(Z) && J.call(Z) == D;
    }
    var pd = Se ? Pe(Se) : Kc;
    function yd(Z) {
      return Z == null ? "" : rd(Z);
    }
    function vd(Z, ge, Ce) {
      var Ue = Z == null ? void 0 : Hr(Z, ge);
      return Ue === void 0 ? Ce : Ue;
    }
    function gd(Z, ge) {
      return Z != null && sd(Z, ge, Hc);
    }
    function Bt(Z) {
      return en(Z) ? ot(Z) : Qc(Z);
    }
    function md(Z) {
      return Z;
    }
    function bd(Z) {
      return xt(Z) ? re(Ft(Z)) : ed(Z);
    }
    t.exports = dd;
  })(mt, mt.exports)), mt.exports;
}
var bt = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
var $h = bt.exports, hl;
function Uh() {
  return hl || (hl = 1, (function(t, e) {
    (function(l, c) {
      c(e);
    })($h, (function(l) {
      function c() {
        for (var ne = arguments.length, ae = Array(ne), ye = 0; ye < ne; ye++)
          ae[ye] = arguments[ye];
        if (ae.length > 1) {
          ae[0] = ae[0].slice(0, -1);
          for (var xe = ae.length - 1, Ae = 1; Ae < xe; ++Ae)
            ae[Ae] = ae[Ae].slice(1, -1);
          return ae[xe] = ae[xe].slice(1), ae.join("");
        } else
          return ae[0];
      }
      function r(ne) {
        return "(?:" + ne + ")";
      }
      function i(ne) {
        return ne === void 0 ? "undefined" : ne === null ? "null" : Object.prototype.toString.call(ne).split(" ").pop().split("]").shift().toLowerCase();
      }
      function p(ne) {
        return ne.toUpperCase();
      }
      function f(ne) {
        return ne != null ? ne instanceof Array ? ne : typeof ne.length != "number" || ne.split || ne.setInterval || ne.call ? [ne] : Array.prototype.slice.call(ne) : [];
      }
      function b(ne, ae) {
        var ye = ne;
        if (ae)
          for (var xe in ae)
            ye[xe] = ae[xe];
        return ye;
      }
      function A(ne) {
        var ae = "[A-Za-z]", ye = "[0-9]", xe = c(ye, "[A-Fa-f]"), Ae = r(r("%[EFef]" + xe + "%" + xe + xe + "%" + xe + xe) + "|" + r("%[89A-Fa-f]" + xe + "%" + xe + xe) + "|" + r("%" + xe + xe)), ke = "[\\:\\/\\?\\#\\[\\]\\@]", He = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Ye = c(ke, He), Qe = ne ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", nr = ne ? "[\\uE000-\\uF8FF]" : "[]", Je = c(ae, ye, "[\\-\\.\\_\\~]", Qe);
        r(ae + c(ae, ye, "[\\+\\-\\.]") + "*"), r(r(Ae + "|" + c(Je, He, "[\\:]")) + "*");
        var rr = r(r("25[0-5]") + "|" + r("2[0-4]" + ye) + "|" + r("1" + ye + ye) + "|" + r("0?[1-9]" + ye) + "|0?0?" + ye), ar = r(rr + "\\." + rr + "\\." + rr + "\\." + rr), Xe = r(xe + "{1,4}"), tr = r(r(Xe + "\\:" + Xe) + "|" + ar), sr = r(r(Xe + "\\:") + "{6}" + tr), ir = r("\\:\\:" + r(Xe + "\\:") + "{5}" + tr), Fr = r(r(Xe) + "?\\:\\:" + r(Xe + "\\:") + "{4}" + tr), _r = r(r(r(Xe + "\\:") + "{0,1}" + Xe) + "?\\:\\:" + r(Xe + "\\:") + "{3}" + tr), Er = r(r(r(Xe + "\\:") + "{0,2}" + Xe) + "?\\:\\:" + r(Xe + "\\:") + "{2}" + tr), Ir = r(r(r(Xe + "\\:") + "{0,3}" + Xe) + "?\\:\\:" + Xe + "\\:" + tr), Cr = r(r(r(Xe + "\\:") + "{0,4}" + Xe) + "?\\:\\:" + tr), vr = r(r(r(Xe + "\\:") + "{0,5}" + Xe) + "?\\:\\:" + Xe), cr = r(r(r(Xe + "\\:") + "{0,6}" + Xe) + "?\\:\\:"), jr = r([sr, ir, Fr, _r, Er, Ir, Cr, vr, cr].join("|")), Or = r(r(Je + "|" + Ae) + "+");
        r("[vV]" + xe + "+\\." + c(Je, He, "[\\:]") + "+"), r(r(Ae + "|" + c(Je, He)) + "*");
        var Jr = r(Ae + "|" + c(Je, He, "[\\:\\@]"));
        return r(r(Ae + "|" + c(Je, He, "[\\@]")) + "+"), r(r(Jr + "|" + c("[\\/\\?]", nr)) + "*"), {
          NOT_SCHEME: new RegExp(c("[^]", ae, ye, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(c("[^\\%\\:]", Je, He), "g"),
          NOT_HOST: new RegExp(c("[^\\%\\[\\]\\:]", Je, He), "g"),
          NOT_PATH: new RegExp(c("[^\\%\\/\\:\\@]", Je, He), "g"),
          NOT_PATH_NOSCHEME: new RegExp(c("[^\\%\\/\\@]", Je, He), "g"),
          NOT_QUERY: new RegExp(c("[^\\%]", Je, He, "[\\:\\@\\/\\?]", nr), "g"),
          NOT_FRAGMENT: new RegExp(c("[^\\%]", Je, He, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(c("[^]", Je, He), "g"),
          UNRESERVED: new RegExp(Je, "g"),
          OTHER_CHARS: new RegExp(c("[^\\%]", Je, Ye), "g"),
          PCT_ENCODED: new RegExp(Ae, "g"),
          IPV4ADDRESS: new RegExp("^(" + ar + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + jr + ")" + r(r("\\%25|\\%(?!" + xe + "{2})") + "(" + Or + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var o = A(!1), v = A(!0), S = /* @__PURE__ */ (function() {
        function ne(ae, ye) {
          var xe = [], Ae = !0, ke = !1, He = void 0;
          try {
            for (var Ye = ae[Symbol.iterator](), Qe; !(Ae = (Qe = Ye.next()).done) && (xe.push(Qe.value), !(ye && xe.length === ye)); Ae = !0)
              ;
          } catch (nr) {
            ke = !0, He = nr;
          } finally {
            try {
              !Ae && Ye.return && Ye.return();
            } finally {
              if (ke) throw He;
            }
          }
          return xe;
        }
        return function(ae, ye) {
          if (Array.isArray(ae))
            return ae;
          if (Symbol.iterator in Object(ae))
            return ne(ae, ye);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
      })(), s = function(ne) {
        if (Array.isArray(ne)) {
          for (var ae = 0, ye = Array(ne.length); ae < ne.length; ae++) ye[ae] = ne[ae];
          return ye;
        } else
          return Array.from(ne);
      }, a = 2147483647, w = 36, u = 1, d = 26, E = 38, _ = 700, I = 72, P = 128, D = "-", x = /^xn--/, q = /[^\0-\x7E]/, K = /[\x2E\u3002\uFF0E\uFF61]/g, L = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, z = w - u, y = Math.floor, F = String.fromCharCode;
      function ie(ne) {
        throw new RangeError(L[ne]);
      }
      function ce(ne, ae) {
        for (var ye = [], xe = ne.length; xe--; )
          ye[xe] = ae(ne[xe]);
        return ye;
      }
      function _e(ne, ae) {
        var ye = ne.split("@"), xe = "";
        ye.length > 1 && (xe = ye[0] + "@", ne = ye[1]), ne = ne.replace(K, ".");
        var Ae = ne.split("."), ke = ce(Ae, ae).join(".");
        return xe + ke;
      }
      function be(ne) {
        for (var ae = [], ye = 0, xe = ne.length; ye < xe; ) {
          var Ae = ne.charCodeAt(ye++);
          if (Ae >= 55296 && Ae <= 56319 && ye < xe) {
            var ke = ne.charCodeAt(ye++);
            (ke & 64512) == 56320 ? ae.push(((Ae & 1023) << 10) + (ke & 1023) + 65536) : (ae.push(Ae), ye--);
          } else
            ae.push(Ae);
        }
        return ae;
      }
      var ue = function(ae) {
        return String.fromCodePoint.apply(String, s(ae));
      }, le = function(ae) {
        return ae - 48 < 10 ? ae - 22 : ae - 65 < 26 ? ae - 65 : ae - 97 < 26 ? ae - 97 : w;
      }, k = function(ae, ye) {
        return ae + 22 + 75 * (ae < 26) - ((ye != 0) << 5);
      }, he = function(ae, ye, xe) {
        var Ae = 0;
        for (
          ae = xe ? y(ae / _) : ae >> 1, ae += y(ae / ye);
          /* no initialization */
          ae > z * d >> 1;
          Ae += w
        )
          ae = y(ae / z);
        return y(Ae + (z + 1) * ae / (ae + E));
      }, X = function(ae) {
        var ye = [], xe = ae.length, Ae = 0, ke = P, He = I, Ye = ae.lastIndexOf(D);
        Ye < 0 && (Ye = 0);
        for (var Qe = 0; Qe < Ye; ++Qe)
          ae.charCodeAt(Qe) >= 128 && ie("not-basic"), ye.push(ae.charCodeAt(Qe));
        for (var nr = Ye > 0 ? Ye + 1 : 0; nr < xe; ) {
          for (
            var Je = Ae, rr = 1, ar = w;
            ;
            /* no condition */
            ar += w
          ) {
            nr >= xe && ie("invalid-input");
            var Xe = le(ae.charCodeAt(nr++));
            (Xe >= w || Xe > y((a - Ae) / rr)) && ie("overflow"), Ae += Xe * rr;
            var tr = ar <= He ? u : ar >= He + d ? d : ar - He;
            if (Xe < tr)
              break;
            var sr = w - tr;
            rr > y(a / sr) && ie("overflow"), rr *= sr;
          }
          var ir = ye.length + 1;
          He = he(Ae - Je, ir, Je == 0), y(Ae / ir) > a - ke && ie("overflow"), ke += y(Ae / ir), Ae %= ir, ye.splice(Ae++, 0, ke);
        }
        return String.fromCodePoint.apply(String, ye);
      }, Q = function(ae) {
        var ye = [];
        ae = be(ae);
        var xe = ae.length, Ae = P, ke = 0, He = I, Ye = !0, Qe = !1, nr = void 0;
        try {
          for (var Je = ae[Symbol.iterator](), rr; !(Ye = (rr = Je.next()).done); Ye = !0) {
            var ar = rr.value;
            ar < 128 && ye.push(F(ar));
          }
        } catch (Hr) {
          Qe = !0, nr = Hr;
        } finally {
          try {
            !Ye && Je.return && Je.return();
          } finally {
            if (Qe)
              throw nr;
          }
        }
        var Xe = ye.length, tr = Xe;
        for (Xe && ye.push(D); tr < xe; ) {
          var sr = a, ir = !0, Fr = !1, _r = void 0;
          try {
            for (var Er = ae[Symbol.iterator](), Ir; !(ir = (Ir = Er.next()).done); ir = !0) {
              var Cr = Ir.value;
              Cr >= Ae && Cr < sr && (sr = Cr);
            }
          } catch (Hr) {
            Fr = !0, _r = Hr;
          } finally {
            try {
              !ir && Er.return && Er.return();
            } finally {
              if (Fr)
                throw _r;
            }
          }
          var vr = tr + 1;
          sr - Ae > y((a - ke) / vr) && ie("overflow"), ke += (sr - Ae) * vr, Ae = sr;
          var cr = !0, jr = !1, Or = void 0;
          try {
            for (var Jr = ae[Symbol.iterator](), At; !(cr = (At = Jr.next()).done); cr = !0) {
              var Pt = At.value;
              if (Pt < Ae && ++ke > a && ie("overflow"), Pt == Ae) {
                for (
                  var ot = ke, Mr = w;
                  ;
                  /* no condition */
                  Mr += w
                ) {
                  var st = Mr <= He ? u : Mr >= He + d ? d : Mr - He;
                  if (ot < st)
                    break;
                  var Tt = ot - st, It = w - st;
                  ye.push(F(k(st + Tt % It, 0))), ot = y(Tt / It);
                }
                ye.push(F(k(ot, 0))), He = he(ke, vr, tr == Xe), ke = 0, ++tr;
              }
            }
          } catch (Hr) {
            jr = !0, Or = Hr;
          } finally {
            try {
              !cr && Jr.return && Jr.return();
            } finally {
              if (jr)
                throw Or;
            }
          }
          ++ke, ++Ae;
        }
        return ye.join("");
      }, H = function(ae) {
        return _e(ae, function(ye) {
          return x.test(ye) ? X(ye.slice(4).toLowerCase()) : ye;
        });
      }, se = function(ae) {
        return _e(ae, function(ye) {
          return q.test(ye) ? "xn--" + Q(ye) : ye;
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
          encode: ue
        },
        decode: X,
        encode: Q,
        toASCII: se,
        toUnicode: H
      }, B = {};
      function C(ne) {
        var ae = ne.charCodeAt(0), ye = void 0;
        return ae < 16 ? ye = "%0" + ae.toString(16).toUpperCase() : ae < 128 ? ye = "%" + ae.toString(16).toUpperCase() : ae < 2048 ? ye = "%" + (ae >> 6 | 192).toString(16).toUpperCase() + "%" + (ae & 63 | 128).toString(16).toUpperCase() : ye = "%" + (ae >> 12 | 224).toString(16).toUpperCase() + "%" + (ae >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (ae & 63 | 128).toString(16).toUpperCase(), ye;
      }
      function ee(ne) {
        for (var ae = "", ye = 0, xe = ne.length; ye < xe; ) {
          var Ae = parseInt(ne.substr(ye + 1, 2), 16);
          if (Ae < 128)
            ae += String.fromCharCode(Ae), ye += 3;
          else if (Ae >= 194 && Ae < 224) {
            if (xe - ye >= 6) {
              var ke = parseInt(ne.substr(ye + 4, 2), 16);
              ae += String.fromCharCode((Ae & 31) << 6 | ke & 63);
            } else
              ae += ne.substr(ye, 6);
            ye += 6;
          } else if (Ae >= 224) {
            if (xe - ye >= 9) {
              var He = parseInt(ne.substr(ye + 4, 2), 16), Ye = parseInt(ne.substr(ye + 7, 2), 16);
              ae += String.fromCharCode((Ae & 15) << 12 | (He & 63) << 6 | Ye & 63);
            } else
              ae += ne.substr(ye, 9);
            ye += 9;
          } else
            ae += ne.substr(ye, 3), ye += 3;
        }
        return ae;
      }
      function te(ne, ae) {
        function ye(xe) {
          var Ae = ee(xe);
          return Ae.match(ae.UNRESERVED) ? Ae : xe;
        }
        return ne.scheme && (ne.scheme = String(ne.scheme).replace(ae.PCT_ENCODED, ye).toLowerCase().replace(ae.NOT_SCHEME, "")), ne.userinfo !== void 0 && (ne.userinfo = String(ne.userinfo).replace(ae.PCT_ENCODED, ye).replace(ae.NOT_USERINFO, C).replace(ae.PCT_ENCODED, p)), ne.host !== void 0 && (ne.host = String(ne.host).replace(ae.PCT_ENCODED, ye).toLowerCase().replace(ae.NOT_HOST, C).replace(ae.PCT_ENCODED, p)), ne.path !== void 0 && (ne.path = String(ne.path).replace(ae.PCT_ENCODED, ye).replace(ne.scheme ? ae.NOT_PATH : ae.NOT_PATH_NOSCHEME, C).replace(ae.PCT_ENCODED, p)), ne.query !== void 0 && (ne.query = String(ne.query).replace(ae.PCT_ENCODED, ye).replace(ae.NOT_QUERY, C).replace(ae.PCT_ENCODED, p)), ne.fragment !== void 0 && (ne.fragment = String(ne.fragment).replace(ae.PCT_ENCODED, ye).replace(ae.NOT_FRAGMENT, C).replace(ae.PCT_ENCODED, p)), ne;
      }
      function N(ne) {
        return ne.replace(/^0*(.*)/, "$1") || "0";
      }
      function j(ne, ae) {
        var ye = ne.match(ae.IPV4ADDRESS) || [], xe = S(ye, 2), Ae = xe[1];
        return Ae ? Ae.split(".").map(N).join(".") : ne;
      }
      function W(ne, ae) {
        var ye = ne.match(ae.IPV6ADDRESS) || [], xe = S(ye, 3), Ae = xe[1], ke = xe[2];
        if (Ae) {
          for (var He = Ae.toLowerCase().split("::").reverse(), Ye = S(He, 2), Qe = Ye[0], nr = Ye[1], Je = nr ? nr.split(":").map(N) : [], rr = Qe.split(":").map(N), ar = ae.IPV4ADDRESS.test(rr[rr.length - 1]), Xe = ar ? 7 : 8, tr = rr.length - Xe, sr = Array(Xe), ir = 0; ir < Xe; ++ir)
            sr[ir] = Je[ir] || rr[tr + ir] || "";
          ar && (sr[Xe - 1] = j(sr[Xe - 1], ae));
          var Fr = sr.reduce(function(vr, cr, jr) {
            if (!cr || cr === "0") {
              var Or = vr[vr.length - 1];
              Or && Or.index + Or.length === jr ? Or.length++ : vr.push({ index: jr, length: 1 });
            }
            return vr;
          }, []), _r = Fr.sort(function(vr, cr) {
            return cr.length - vr.length;
          })[0], Er = void 0;
          if (_r && _r.length > 1) {
            var Ir = sr.slice(0, _r.index), Cr = sr.slice(_r.index + _r.length);
            Er = Ir.join(":") + "::" + Cr.join(":");
          } else
            Er = sr.join(":");
          return ke && (Er += "%" + ke), Er;
        } else
          return ne;
      }
      var oe = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, we = "".match(/(){0}/)[1] === void 0;
      function Se(ne) {
        var ae = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, ye = {}, xe = ae.iri !== !1 ? v : o;
        ae.reference === "suffix" && (ne = (ae.scheme ? ae.scheme + ":" : "") + "//" + ne);
        var Ae = ne.match(oe);
        if (Ae) {
          we ? (ye.scheme = Ae[1], ye.userinfo = Ae[3], ye.host = Ae[4], ye.port = parseInt(Ae[5], 10), ye.path = Ae[6] || "", ye.query = Ae[7], ye.fragment = Ae[8], isNaN(ye.port) && (ye.port = Ae[5])) : (ye.scheme = Ae[1] || void 0, ye.userinfo = ne.indexOf("@") !== -1 ? Ae[3] : void 0, ye.host = ne.indexOf("//") !== -1 ? Ae[4] : void 0, ye.port = parseInt(Ae[5], 10), ye.path = Ae[6] || "", ye.query = ne.indexOf("?") !== -1 ? Ae[7] : void 0, ye.fragment = ne.indexOf("#") !== -1 ? Ae[8] : void 0, isNaN(ye.port) && (ye.port = ne.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? Ae[4] : void 0)), ye.host && (ye.host = W(j(ye.host, xe), xe)), ye.scheme === void 0 && ye.userinfo === void 0 && ye.host === void 0 && ye.port === void 0 && !ye.path && ye.query === void 0 ? ye.reference = "same-document" : ye.scheme === void 0 ? ye.reference = "relative" : ye.fragment === void 0 ? ye.reference = "absolute" : ye.reference = "uri", ae.reference && ae.reference !== "suffix" && ae.reference !== ye.reference && (ye.error = ye.error || "URI is not a " + ae.reference + " reference.");
          var ke = B[(ae.scheme || ye.scheme || "").toLowerCase()];
          if (!ae.unicodeSupport && (!ke || !ke.unicodeSupport)) {
            if (ye.host && (ae.domainHost || ke && ke.domainHost))
              try {
                ye.host = O.toASCII(ye.host.replace(xe.PCT_ENCODED, ee).toLowerCase());
              } catch (He) {
                ye.error = ye.error || "Host's domain name can not be converted to ASCII via punycode: " + He;
              }
            te(ye, o);
          } else
            te(ye, xe);
          ke && ke.parse && ke.parse(ye, ae);
        } else
          ye.error = ye.error || "URI can not be parsed.";
        return ye;
      }
      function Re(ne, ae) {
        var ye = ae.iri !== !1 ? v : o, xe = [];
        return ne.userinfo !== void 0 && (xe.push(ne.userinfo), xe.push("@")), ne.host !== void 0 && xe.push(W(j(String(ne.host), ye), ye).replace(ye.IPV6ADDRESS, function(Ae, ke, He) {
          return "[" + ke + (He ? "%25" + He : "") + "]";
        })), (typeof ne.port == "number" || typeof ne.port == "string") && (xe.push(":"), xe.push(String(ne.port))), xe.length ? xe.join("") : void 0;
      }
      var Oe = /^\.\.?\//, re = /^\/\.(\/|$)/, De = /^\/\.\.(\/|$)/, Le = /^\/?(?:.|\n)*?(?=\/|$)/;
      function Pe(ne) {
        for (var ae = []; ne.length; )
          if (ne.match(Oe))
            ne = ne.replace(Oe, "");
          else if (ne.match(re))
            ne = ne.replace(re, "/");
          else if (ne.match(De))
            ne = ne.replace(De, "/"), ae.pop();
          else if (ne === "." || ne === "..")
            ne = "";
          else {
            var ye = ne.match(Le);
            if (ye) {
              var xe = ye[0];
              ne = ne.slice(xe.length), ae.push(xe);
            } else
              throw new Error("Unexpected dot segment condition");
          }
        return ae.join("");
      }
      function $e(ne) {
        var ae = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, ye = ae.iri ? v : o, xe = [], Ae = B[(ae.scheme || ne.scheme || "").toLowerCase()];
        if (Ae && Ae.serialize && Ae.serialize(ne, ae), ne.host && !ye.IPV6ADDRESS.test(ne.host)) {
          if (ae.domainHost || Ae && Ae.domainHost)
            try {
              ne.host = ae.iri ? O.toUnicode(ne.host) : O.toASCII(ne.host.replace(ye.PCT_ENCODED, ee).toLowerCase());
            } catch (Ye) {
              ne.error = ne.error || "Host's domain name can not be converted to " + (ae.iri ? "Unicode" : "ASCII") + " via punycode: " + Ye;
            }
        }
        te(ne, ye), ae.reference !== "suffix" && ne.scheme && (xe.push(ne.scheme), xe.push(":"));
        var ke = Re(ne, ae);
        if (ke !== void 0 && (ae.reference !== "suffix" && xe.push("//"), xe.push(ke), ne.path && ne.path.charAt(0) !== "/" && xe.push("/")), ne.path !== void 0) {
          var He = ne.path;
          !ae.absolutePath && (!Ae || !Ae.absolutePath) && (He = Pe(He)), ke === void 0 && (He = He.replace(/^\/\//, "/%2F")), xe.push(He);
        }
        return ne.query !== void 0 && (xe.push("?"), xe.push(ne.query)), ne.fragment !== void 0 && (xe.push("#"), xe.push(ne.fragment)), xe.join("");
      }
      function ve(ne, ae) {
        var ye = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, xe = arguments[3], Ae = {};
        return xe || (ne = Se($e(ne, ye), ye), ae = Se($e(ae, ye), ye)), ye = ye || {}, !ye.tolerant && ae.scheme ? (Ae.scheme = ae.scheme, Ae.userinfo = ae.userinfo, Ae.host = ae.host, Ae.port = ae.port, Ae.path = Pe(ae.path || ""), Ae.query = ae.query) : (ae.userinfo !== void 0 || ae.host !== void 0 || ae.port !== void 0 ? (Ae.userinfo = ae.userinfo, Ae.host = ae.host, Ae.port = ae.port, Ae.path = Pe(ae.path || ""), Ae.query = ae.query) : (ae.path ? (ae.path.charAt(0) === "/" ? Ae.path = Pe(ae.path) : ((ne.userinfo !== void 0 || ne.host !== void 0 || ne.port !== void 0) && !ne.path ? Ae.path = "/" + ae.path : ne.path ? Ae.path = ne.path.slice(0, ne.path.lastIndexOf("/") + 1) + ae.path : Ae.path = ae.path, Ae.path = Pe(Ae.path)), Ae.query = ae.query) : (Ae.path = ne.path, ae.query !== void 0 ? Ae.query = ae.query : Ae.query = ne.query), Ae.userinfo = ne.userinfo, Ae.host = ne.host, Ae.port = ne.port), Ae.scheme = ne.scheme), Ae.fragment = ae.fragment, Ae;
      }
      function Ee(ne, ae, ye) {
        var xe = b({ scheme: "null" }, ye);
        return $e(ve(Se(ne, xe), Se(ae, xe), xe, !0), xe);
      }
      function je(ne, ae) {
        return typeof ne == "string" ? ne = $e(Se(ne, ae), ae) : i(ne) === "object" && (ne = Se($e(ne, ae), ae)), ne;
      }
      function qe(ne, ae, ye) {
        return typeof ne == "string" ? ne = $e(Se(ne, ye), ye) : i(ne) === "object" && (ne = $e(ne, ye)), typeof ae == "string" ? ae = $e(Se(ae, ye), ye) : i(ae) === "object" && (ae = $e(ae, ye)), ne === ae;
      }
      function Me(ne, ae) {
        return ne && ne.toString().replace(!ae || !ae.iri ? o.ESCAPE : v.ESCAPE, C);
      }
      function We(ne, ae) {
        return ne && ne.toString().replace(!ae || !ae.iri ? o.PCT_ENCODED : v.PCT_ENCODED, ee);
      }
      var $ = {
        scheme: "http",
        domainHost: !0,
        parse: function(ae, ye) {
          return ae.host || (ae.error = ae.error || "HTTP URIs must have a host."), ae;
        },
        serialize: function(ae, ye) {
          var xe = String(ae.scheme).toLowerCase() === "https";
          return (ae.port === (xe ? 443 : 80) || ae.port === "") && (ae.port = void 0), ae.path || (ae.path = "/"), ae;
        }
      }, n = {
        scheme: "https",
        domainHost: $.domainHost,
        parse: $.parse,
        serialize: $.serialize
      };
      function g(ne) {
        return typeof ne.secure == "boolean" ? ne.secure : String(ne.scheme).toLowerCase() === "wss";
      }
      var U = {
        scheme: "ws",
        domainHost: !0,
        parse: function(ae, ye) {
          var xe = ae;
          return xe.secure = g(xe), xe.resourceName = (xe.path || "/") + (xe.query ? "?" + xe.query : ""), xe.path = void 0, xe.query = void 0, xe;
        },
        serialize: function(ae, ye) {
          if ((ae.port === (g(ae) ? 443 : 80) || ae.port === "") && (ae.port = void 0), typeof ae.secure == "boolean" && (ae.scheme = ae.secure ? "wss" : "ws", ae.secure = void 0), ae.resourceName) {
            var xe = ae.resourceName.split("?"), Ae = S(xe, 2), ke = Ae[0], He = Ae[1];
            ae.path = ke && ke !== "/" ? ke : void 0, ae.query = He, ae.resourceName = void 0;
          }
          return ae.fragment = void 0, ae;
        }
      }, fe = {
        scheme: "wss",
        domainHost: U.domainHost,
        parse: U.parse,
        serialize: U.serialize
      }, J = {}, de = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", M = "[0-9A-Fa-f]", Be = r(r("%[EFef]" + M + "%" + M + M + "%" + M + M) + "|" + r("%[89A-Fa-f]" + M + "%" + M + M) + "|" + r("%" + M + M)), ze = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", R = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Ie = c(R, '[\\"\\\\]'), Ne = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", V = new RegExp(de, "g"), me = new RegExp(Be, "g"), Fe = new RegExp(c("[^]", ze, "[\\.]", '[\\"]', Ie), "g"), Ve = new RegExp(c("[^]", de, Ne), "g"), G = Ve;
      function m(ne) {
        var ae = ee(ne);
        return ae.match(V) ? ae : ne;
      }
      var h = {
        scheme: "mailto",
        parse: function(ae, ye) {
          var xe = ae, Ae = xe.to = xe.path ? xe.path.split(",") : [];
          if (xe.path = void 0, xe.query) {
            for (var ke = !1, He = {}, Ye = xe.query.split("&"), Qe = 0, nr = Ye.length; Qe < nr; ++Qe) {
              var Je = Ye[Qe].split("=");
              switch (Je[0]) {
                case "to":
                  for (var rr = Je[1].split(","), ar = 0, Xe = rr.length; ar < Xe; ++ar)
                    Ae.push(rr[ar]);
                  break;
                case "subject":
                  xe.subject = We(Je[1], ye);
                  break;
                case "body":
                  xe.body = We(Je[1], ye);
                  break;
                default:
                  ke = !0, He[We(Je[0], ye)] = We(Je[1], ye);
                  break;
              }
            }
            ke && (xe.headers = He);
          }
          xe.query = void 0;
          for (var tr = 0, sr = Ae.length; tr < sr; ++tr) {
            var ir = Ae[tr].split("@");
            if (ir[0] = We(ir[0]), ye.unicodeSupport)
              ir[1] = We(ir[1], ye).toLowerCase();
            else
              try {
                ir[1] = O.toASCII(We(ir[1], ye).toLowerCase());
              } catch (Fr) {
                xe.error = xe.error || "Email address's domain name can not be converted to ASCII via punycode: " + Fr;
              }
            Ae[tr] = ir.join("@");
          }
          return xe;
        },
        serialize: function(ae, ye) {
          var xe = ae, Ae = f(ae.to);
          if (Ae) {
            for (var ke = 0, He = Ae.length; ke < He; ++ke) {
              var Ye = String(Ae[ke]), Qe = Ye.lastIndexOf("@"), nr = Ye.slice(0, Qe).replace(me, m).replace(me, p).replace(Fe, C), Je = Ye.slice(Qe + 1);
              try {
                Je = ye.iri ? O.toUnicode(Je) : O.toASCII(We(Je, ye).toLowerCase());
              } catch (tr) {
                xe.error = xe.error || "Email address's domain name can not be converted to " + (ye.iri ? "Unicode" : "ASCII") + " via punycode: " + tr;
              }
              Ae[ke] = nr + "@" + Je;
            }
            xe.path = Ae.join(",");
          }
          var rr = ae.headers = ae.headers || {};
          ae.subject && (rr.subject = ae.subject), ae.body && (rr.body = ae.body);
          var ar = [];
          for (var Xe in rr)
            rr[Xe] !== J[Xe] && ar.push(Xe.replace(me, m).replace(me, p).replace(Ve, C) + "=" + rr[Xe].replace(me, m).replace(me, p).replace(G, C));
          return ar.length && (xe.query = ar.join("&")), xe;
        }
      }, T = /^([^\:]+)\:(.*)/, Y = {
        scheme: "urn",
        parse: function(ae, ye) {
          var xe = ae.path && ae.path.match(T), Ae = ae;
          if (xe) {
            var ke = ye.scheme || Ae.scheme || "urn", He = xe[1].toLowerCase(), Ye = xe[2], Qe = ke + ":" + (ye.nid || He), nr = B[Qe];
            Ae.nid = He, Ae.nss = Ye, Ae.path = void 0, nr && (Ae = nr.parse(Ae, ye));
          } else
            Ae.error = Ae.error || "URN can not be parsed.";
          return Ae;
        },
        serialize: function(ae, ye) {
          var xe = ye.scheme || ae.scheme || "urn", Ae = ae.nid, ke = xe + ":" + (ye.nid || Ae), He = B[ke];
          He && (ae = He.serialize(ae, ye));
          var Ye = ae, Qe = ae.nss;
          return Ye.path = (Ae || ye.nid) + ":" + Qe, Ye;
        }
      }, pe = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, Te = {
        scheme: "urn:uuid",
        parse: function(ae, ye) {
          var xe = ae;
          return xe.uuid = xe.nss, xe.nss = void 0, !ye.tolerant && (!xe.uuid || !xe.uuid.match(pe)) && (xe.error = xe.error || "UUID is not valid."), xe;
        },
        serialize: function(ae, ye) {
          var xe = ae;
          return xe.nss = (ae.uuid || "").toLowerCase(), xe;
        }
      };
      B[$.scheme] = $, B[n.scheme] = n, B[U.scheme] = U, B[fe.scheme] = fe, B[h.scheme] = h, B[Y.scheme] = Y, B[Te.scheme] = Te, l.SCHEMES = B, l.pctEncChar = C, l.pctDecChars = ee, l.parse = Se, l.removeDotSegments = Pe, l.serialize = $e, l.resolveComponents = ve, l.resolve = Ee, l.normalize = je, l.equal = qe, l.escapeComponent = Me, l.unescapeComponent = We, Object.defineProperty(l, "__esModule", { value: !0 });
    }));
  })(bt, bt.exports)), bt.exports;
}
var ea, pl;
function Ko() {
  return pl || (pl = 1, ea = function t(e, l) {
    if (e === l) return !0;
    if (e && l && typeof e == "object" && typeof l == "object") {
      if (e.constructor !== l.constructor) return !1;
      var c, r, i;
      if (Array.isArray(e)) {
        if (c = e.length, c != l.length) return !1;
        for (r = c; r-- !== 0; )
          if (!t(e[r], l[r])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === l.source && e.flags === l.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === l.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === l.toString();
      if (i = Object.keys(e), c = i.length, c !== Object.keys(l).length) return !1;
      for (r = c; r-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(l, i[r])) return !1;
      for (r = c; r-- !== 0; ) {
        var p = i[r];
        if (!t(e[p], l[p])) return !1;
      }
      return !0;
    }
    return e !== e && l !== l;
  }), ea;
}
var ra, yl;
function zh() {
  return yl || (yl = 1, ra = function(e) {
    for (var l = 0, c = e.length, r = 0, i; r < c; )
      l++, i = e.charCodeAt(r++), i >= 55296 && i <= 56319 && r < c && (i = e.charCodeAt(r), (i & 64512) == 56320 && r++);
    return l;
  }), ra;
}
var ta, vl;
function yt() {
  if (vl) return ta;
  vl = 1, ta = {
    copy: t,
    checkDataType: e,
    checkDataTypes: l,
    coerceToTypes: r,
    toHash: i,
    getProperty: b,
    escapeQuotes: A,
    equal: Ko(),
    ucs2length: zh(),
    varOccurences: o,
    varReplace: v,
    schemaHasRules: S,
    schemaHasRulesExcept: s,
    schemaUnknownRules: a,
    toQuotedString: w,
    getPathExpr: u,
    getPath: d,
    getData: I,
    unescapeFragment: D,
    unescapeJsonPointer: K,
    escapeFragment: x,
    escapeJsonPointer: q
  };
  function t(L, z) {
    z = z || {};
    for (var y in L) z[y] = L[y];
    return z;
  }
  function e(L, z, y, F) {
    var ie = F ? " !== " : " === ", ce = F ? " || " : " && ", _e = F ? "!" : "", be = F ? "" : "!";
    switch (L) {
      case "null":
        return z + ie + "null";
      case "array":
        return _e + "Array.isArray(" + z + ")";
      case "object":
        return "(" + _e + z + ce + "typeof " + z + ie + '"object"' + ce + be + "Array.isArray(" + z + "))";
      case "integer":
        return "(typeof " + z + ie + '"number"' + ce + be + "(" + z + " % 1)" + ce + z + ie + z + (y ? ce + _e + "isFinite(" + z + ")" : "") + ")";
      case "number":
        return "(typeof " + z + ie + '"' + L + '"' + (y ? ce + _e + "isFinite(" + z + ")" : "") + ")";
      default:
        return "typeof " + z + ie + '"' + L + '"';
    }
  }
  function l(L, z, y) {
    switch (L.length) {
      case 1:
        return e(L[0], z, y, !0);
      default:
        var F = "", ie = i(L);
        ie.array && ie.object && (F = ie.null ? "(" : "(!" + z + " || ", F += "typeof " + z + ' !== "object")', delete ie.null, delete ie.array, delete ie.object), ie.number && delete ie.integer;
        for (var ce in ie)
          F += (F ? " && " : "") + e(ce, z, y, !0);
        return F;
    }
  }
  var c = i(["string", "number", "integer", "boolean", "null"]);
  function r(L, z) {
    if (Array.isArray(z)) {
      for (var y = [], F = 0; F < z.length; F++) {
        var ie = z[F];
        (c[ie] || L === "array" && ie === "array") && (y[y.length] = ie);
      }
      if (y.length) return y;
    } else {
      if (c[z])
        return [z];
      if (L === "array" && z === "array")
        return ["array"];
    }
  }
  function i(L) {
    for (var z = {}, y = 0; y < L.length; y++) z[L[y]] = !0;
    return z;
  }
  var p = /^[a-z$_][a-z$_0-9]*$/i, f = /'|\\/g;
  function b(L) {
    return typeof L == "number" ? "[" + L + "]" : p.test(L) ? "." + L : "['" + A(L) + "']";
  }
  function A(L) {
    return L.replace(f, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
  }
  function o(L, z) {
    z += "[^0-9]";
    var y = L.match(new RegExp(z, "g"));
    return y ? y.length : 0;
  }
  function v(L, z, y) {
    return z += "([^0-9])", y = y.replace(/\$/g, "$$$$"), L.replace(new RegExp(z, "g"), y + "$1");
  }
  function S(L, z) {
    if (typeof L == "boolean") return !L;
    for (var y in L) if (z[y]) return !0;
  }
  function s(L, z, y) {
    if (typeof L == "boolean") return !L && y != "not";
    for (var F in L) if (F != y && z[F]) return !0;
  }
  function a(L, z) {
    if (typeof L != "boolean") {
      for (var y in L) if (!z[y]) return y;
    }
  }
  function w(L) {
    return "'" + A(L) + "'";
  }
  function u(L, z, y, F) {
    var ie = y ? "'/' + " + z + (F ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : F ? "'[' + " + z + " + ']'" : "'[\\'' + " + z + " + '\\']'";
    return P(L, ie);
  }
  function d(L, z, y) {
    var F = w(y ? "/" + q(z) : b(z));
    return P(L, F);
  }
  var E = /^\/(?:[^~]|~0|~1)*$/, _ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function I(L, z, y) {
    var F, ie, ce, _e;
    if (L === "") return "rootData";
    if (L[0] == "/") {
      if (!E.test(L)) throw new Error("Invalid JSON-pointer: " + L);
      ie = L, ce = "rootData";
    } else {
      if (_e = L.match(_), !_e) throw new Error("Invalid JSON-pointer: " + L);
      if (F = +_e[1], ie = _e[2], ie == "#") {
        if (F >= z) throw new Error("Cannot access property/index " + F + " levels up, current level is " + z);
        return y[z - F];
      }
      if (F > z) throw new Error("Cannot access data " + F + " levels up, current level is " + z);
      if (ce = "data" + (z - F || ""), !ie) return ce;
    }
    for (var be = ce, ue = ie.split("/"), le = 0; le < ue.length; le++) {
      var k = ue[le];
      k && (ce += b(K(k)), be += " && " + ce);
    }
    return be;
  }
  function P(L, z) {
    return L == '""' ? z : (L + " + " + z).replace(/([^\\])' \+ '/g, "$1");
  }
  function D(L) {
    return K(decodeURIComponent(L));
  }
  function x(L) {
    return encodeURIComponent(q(L));
  }
  function q(L) {
    return L.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function K(L) {
    return L.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  return ta;
}
var na, gl;
function xc() {
  if (gl) return na;
  gl = 1;
  var t = yt();
  na = e;
  function e(l) {
    t.copy(l, this);
  }
  return na;
}
var ia = { exports: {} }, ml;
function Wh() {
  if (ml) return ia.exports;
  ml = 1;
  var t = ia.exports = function(c, r, i) {
    typeof r == "function" && (i = r, r = {}), i = r.cb || i;
    var p = typeof i == "function" ? i : i.pre || function() {
    }, f = i.post || function() {
    };
    e(r, p, f, c, "", c);
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
  function e(c, r, i, p, f, b, A, o, v, S) {
    if (p && typeof p == "object" && !Array.isArray(p)) {
      r(p, f, b, A, o, v, S);
      for (var s in p) {
        var a = p[s];
        if (Array.isArray(a)) {
          if (s in t.arrayKeywords)
            for (var w = 0; w < a.length; w++)
              e(c, r, i, a[w], f + "/" + s + "/" + w, b, f, s, p, w);
        } else if (s in t.propsKeywords) {
          if (a && typeof a == "object")
            for (var u in a)
              e(c, r, i, a[u], f + "/" + s + "/" + l(u), b, f, s, p, u);
        } else (s in t.keywords || c.allKeys && !(s in t.skipKeywords)) && e(c, r, i, a, f + "/" + s, b, f, s, p);
      }
      i(p, f, b, A, o, v, S);
    }
  }
  function l(c) {
    return c.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return ia.exports;
}
var aa, bl;
function Yo() {
  if (bl) return aa;
  bl = 1;
  var t = Uh(), e = Ko(), l = yt(), c = xc(), r = Wh();
  aa = i, i.normalizeId = d, i.fullPath = a, i.url = E, i.ids = _, i.inlineRef = v, i.schema = p;
  function i(I, P, D) {
    var x = this._refs[D];
    if (typeof x == "string")
      if (this._refs[x]) x = this._refs[x];
      else return i.call(this, I, P, x);
    if (x = x || this._schemas[D], x instanceof c)
      return v(x.schema, this._opts.inlineRefs) ? x.schema : x.validate || this._compile(x);
    var q = p.call(this, P, D), K, L, z;
    return q && (K = q.schema, P = q.root, z = q.baseId), K instanceof c ? L = K.validate || I.call(this, K.schema, P, void 0, z) : K !== void 0 && (L = v(K, this._opts.inlineRefs) ? K : I.call(this, K, P, void 0, z)), L;
  }
  function p(I, P) {
    var D = t.parse(P), x = w(D), q = a(this._getId(I.schema));
    if (Object.keys(I.schema).length === 0 || x !== q) {
      var K = d(x), L = this._refs[K];
      if (typeof L == "string")
        return f.call(this, I, L, D);
      if (L instanceof c)
        L.validate || this._compile(L), I = L;
      else if (L = this._schemas[K], L instanceof c) {
        if (L.validate || this._compile(L), K == d(P))
          return { schema: L, root: I, baseId: q };
        I = L;
      } else
        return;
      if (!I.schema) return;
      q = a(this._getId(I.schema));
    }
    return A.call(this, D, q, I.schema, I);
  }
  function f(I, P, D) {
    var x = p.call(this, I, P);
    if (x) {
      var q = x.schema, K = x.baseId;
      I = x.root;
      var L = this._getId(q);
      return L && (K = E(K, L)), A.call(this, D, K, q, I);
    }
  }
  var b = l.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function A(I, P, D, x) {
    if (I.fragment = I.fragment || "", I.fragment.slice(0, 1) == "/") {
      for (var q = I.fragment.split("/"), K = 1; K < q.length; K++) {
        var L = q[K];
        if (L) {
          if (L = l.unescapeFragment(L), D = D[L], D === void 0) break;
          var z;
          if (!b[L] && (z = this._getId(D), z && (P = E(P, z)), D.$ref)) {
            var y = E(P, D.$ref), F = p.call(this, x, y);
            F && (D = F.schema, x = F.root, P = F.baseId);
          }
        }
      }
      if (D !== void 0 && D !== x.schema)
        return { schema: D, root: x, baseId: P };
    }
  }
  var o = l.toHash([
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
  function v(I, P) {
    if (P === !1) return !1;
    if (P === void 0 || P === !0) return S(I);
    if (P) return s(I) <= P;
  }
  function S(I) {
    var P;
    if (Array.isArray(I)) {
      for (var D = 0; D < I.length; D++)
        if (P = I[D], typeof P == "object" && !S(P)) return !1;
    } else
      for (var x in I)
        if (x == "$ref" || (P = I[x], typeof P == "object" && !S(P))) return !1;
    return !0;
  }
  function s(I) {
    var P = 0, D;
    if (Array.isArray(I)) {
      for (var x = 0; x < I.length; x++)
        if (D = I[x], typeof D == "object" && (P += s(D)), P == 1 / 0) return 1 / 0;
    } else
      for (var q in I) {
        if (q == "$ref") return 1 / 0;
        if (o[q])
          P++;
        else if (D = I[q], typeof D == "object" && (P += s(D) + 1), P == 1 / 0) return 1 / 0;
      }
    return P;
  }
  function a(I, P) {
    P !== !1 && (I = d(I));
    var D = t.parse(I);
    return w(D);
  }
  function w(I) {
    return t.serialize(I).split("#")[0] + "#";
  }
  var u = /#\/?$/;
  function d(I) {
    return I ? I.replace(u, "") : "";
  }
  function E(I, P) {
    return P = d(P), t.resolve(I, P);
  }
  function _(I) {
    var P = d(this._getId(I)), D = { "": P }, x = { "": a(P, !1) }, q = {}, K = this;
    return r(I, { allKeys: !0 }, function(L, z, y, F, ie, ce, _e) {
      if (z !== "") {
        var be = K._getId(L), ue = D[F], le = x[F] + "/" + ie;
        if (_e !== void 0 && (le += "/" + (typeof _e == "number" ? _e : l.escapeFragment(_e))), typeof be == "string") {
          be = ue = d(ue ? t.resolve(ue, be) : be);
          var k = K._refs[be];
          if (typeof k == "string" && (k = K._refs[k]), k && k.schema) {
            if (!e(L, k.schema))
              throw new Error('id "' + be + '" resolves to more than one schema');
          } else if (be != d(le))
            if (be[0] == "#") {
              if (q[be] && !e(L, q[be]))
                throw new Error('id "' + be + '" resolves to more than one schema');
              q[be] = L;
            } else
              K._refs[be] = le;
        }
        D[z] = ue, x[z] = le;
      }
    }), q;
  }
  return aa;
}
var oa, wl;
function Qo() {
  if (wl) return oa;
  wl = 1;
  var t = Yo();
  oa = {
    Validation: c(e),
    MissingRef: c(l)
  };
  function e(r) {
    this.message = "validation failed", this.errors = r, this.ajv = this.validation = !0;
  }
  l.message = function(r, i) {
    return "can't resolve reference " + i + " from id " + r;
  };
  function l(r, i, p) {
    this.message = p || l.message(r, i), this.missingRef = t.url(r, i), this.missingSchema = t.normalizeId(t.fullPath(this.missingRef));
  }
  function c(r) {
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
  }
  return oa;
}
var sa, _l;
function Fc() {
  return _l || (_l = 1, sa = function(t, e) {
    e || (e = {}), typeof e == "function" && (e = { cmp: e });
    var l = typeof e.cycles == "boolean" ? e.cycles : !1, c = e.cmp && /* @__PURE__ */ (function(i) {
      return function(p) {
        return function(f, b) {
          var A = { key: f, value: p[f] }, o = { key: b, value: p[b] };
          return i(A, o);
        };
      };
    })(e.cmp), r = [];
    return (function i(p) {
      if (p && p.toJSON && typeof p.toJSON == "function" && (p = p.toJSON()), p !== void 0) {
        if (typeof p == "number") return isFinite(p) ? "" + p : "null";
        if (typeof p != "object") return JSON.stringify(p);
        var f, b;
        if (Array.isArray(p)) {
          for (b = "[", f = 0; f < p.length; f++)
            f && (b += ","), b += i(p[f]) || "null";
          return b + "]";
        }
        if (p === null) return "null";
        if (r.indexOf(p) !== -1) {
          if (l) return JSON.stringify("__cycle__");
          throw new TypeError("Converting circular structure to JSON");
        }
        var A = r.push(p) - 1, o = Object.keys(p).sort(c && c(p));
        for (b = "", f = 0; f < o.length; f++) {
          var v = o[f], S = i(p[v]);
          S && (b && (b += ","), b += JSON.stringify(v) + ":" + S);
        }
        return r.splice(A, 1), "{" + b + "}";
      }
    })(t);
  }), sa;
}
var fa, El;
function Dc() {
  return El || (El = 1, fa = function(e, l, c) {
    var r = "", i = e.schema.$async === !0, p = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), f = e.self._getId(e.schema);
    if (e.opts.strictKeywords) {
      var b = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
      if (b) {
        var A = "unknown keyword: " + b;
        if (e.opts.strictKeywords === "log") e.logger.warn(A);
        else throw new Error(A);
      }
    }
    if (e.isTop && (r += " var validate = ", i && (e.async = !0, r += "async "), r += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", f && (e.opts.sourceCode || e.opts.processCode) && (r += " " + ("/*# sourceURL=" + f + " */") + " ")), typeof e.schema == "boolean" || !(p || e.schema.$ref)) {
      var l = "false schema", o = e.level, v = e.dataLevel, S = e.schema[l], s = e.schemaPath + e.util.getProperty(l), a = e.errSchemaPath + "/" + l, P = !e.opts.allErrors, q, w = "data" + (v || ""), I = "valid" + o;
      if (e.schema === !1) {
        e.isTop ? P = !0 : r += " var " + I + " = false; ";
        var u = u || [];
        u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(a) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'boolean schema is false' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
        var d = r;
        r = u.pop(), !e.compositeRule && P ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else
        e.isTop ? i ? r += " return data; " : r += " validate.errors = null; return true; " : r += " var " + I + " = true; ";
      return e.isTop && (r += " }; return validate; "), r;
    }
    if (e.isTop) {
      var E = e.isTop, o = e.level = 0, v = e.dataLevel = 0, w = "data";
      if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
        var _ = "default is ignored in the schema root";
        if (e.opts.strictDefaults === "log") e.logger.warn(_);
        else throw new Error(_);
      }
      r += " var vErrors = null; ", r += " var errors = 0;     ", r += " if (rootData === undefined) rootData = data; ";
    } else {
      var o = e.level, v = e.dataLevel, w = "data" + (v || "");
      if (f && (e.baseId = e.resolve.url(e.baseId, f)), i && !e.async) throw new Error("async schema in sync schema");
      r += " var errs_" + o + " = errors;";
    }
    var I = "valid" + o, P = !e.opts.allErrors, D = "", x = "", q, K = e.schema.type, L = Array.isArray(K);
    if (K && e.opts.nullable && e.schema.nullable === !0 && (L ? K.indexOf("null") == -1 && (K = K.concat("null")) : K != "null" && (K = [K, "null"], L = !0)), L && K.length == 1 && (K = K[0], L = !1), e.schema.$ref && p) {
      if (e.opts.extendRefs == "fail")
        throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
      e.opts.extendRefs !== !0 && (p = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
    }
    if (e.schema.$comment && e.opts.$comment && (r += " " + e.RULES.all.$comment.code(e, "$comment")), K) {
      if (e.opts.coerceTypes)
        var z = e.util.coerceToTypes(e.opts.coerceTypes, K);
      var y = e.RULES.types[K];
      if (z || L || y === !0 || y && !re(y)) {
        var s = e.schemaPath + ".type", a = e.errSchemaPath + "/type", s = e.schemaPath + ".type", a = e.errSchemaPath + "/type", F = L ? "checkDataTypes" : "checkDataType";
        if (r += " if (" + e.util[F](K, w, e.opts.strictNumbers, !0) + ") { ", z) {
          var ie = "dataType" + o, ce = "coerced" + o;
          r += " var " + ie + " = typeof " + w + "; var " + ce + " = undefined; ", e.opts.coerceTypes == "array" && (r += " if (" + ie + " == 'object' && Array.isArray(" + w + ") && " + w + ".length == 1) { " + w + " = " + w + "[0]; " + ie + " = typeof " + w + "; if (" + e.util.checkDataType(e.schema.type, w, e.opts.strictNumbers) + ") " + ce + " = " + w + "; } "), r += " if (" + ce + " !== undefined) ; ";
          var _e = z;
          if (_e)
            for (var be, ue = -1, le = _e.length - 1; ue < le; )
              be = _e[ue += 1], be == "string" ? r += " else if (" + ie + " == 'number' || " + ie + " == 'boolean') " + ce + " = '' + " + w + "; else if (" + w + " === null) " + ce + " = ''; " : be == "number" || be == "integer" ? (r += " else if (" + ie + " == 'boolean' || " + w + " === null || (" + ie + " == 'string' && " + w + " && " + w + " == +" + w + " ", be == "integer" && (r += " && !(" + w + " % 1)"), r += ")) " + ce + " = +" + w + "; ") : be == "boolean" ? r += " else if (" + w + " === 'false' || " + w + " === 0 || " + w + " === null) " + ce + " = false; else if (" + w + " === 'true' || " + w + " === 1) " + ce + " = true; " : be == "null" ? r += " else if (" + w + " === '' || " + w + " === 0 || " + w + " === false) " + ce + " = null; " : e.opts.coerceTypes == "array" && be == "array" && (r += " else if (" + ie + " == 'string' || " + ie + " == 'number' || " + ie + " == 'boolean' || " + w + " == null) " + ce + " = [" + w + "]; ");
          r += " else {   ";
          var u = u || [];
          u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(a) + " , params: { type: '", L ? r += "" + K.join(",") : r += "" + K, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", L ? r += "" + K.join(",") : r += "" + K, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + s + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
          var d = r;
          r = u.pop(), !e.compositeRule && P ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } if (" + ce + " !== undefined) {  ";
          var k = v ? "data" + (v - 1 || "") : "parentData", he = v ? e.dataPathArr[v] : "parentDataProperty";
          r += " " + w + " = " + ce + "; ", v || (r += "if (" + k + " !== undefined)"), r += " " + k + "[" + he + "] = " + ce + "; } ";
        } else {
          var u = u || [];
          u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(a) + " , params: { type: '", L ? r += "" + K.join(",") : r += "" + K, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", L ? r += "" + K.join(",") : r += "" + K, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + s + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
          var d = r;
          r = u.pop(), !e.compositeRule && P ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        r += " } ";
      }
    }
    if (e.schema.$ref && !p)
      r += " " + e.RULES.all.$ref.code(e, "$ref") + " ", P && (r += " } if (errors === ", E ? r += "0" : r += "errs_" + o, r += ") { ", x += "}");
    else {
      var X = e.RULES;
      if (X) {
        for (var y, Q = -1, H = X.length - 1; Q < H; )
          if (y = X[Q += 1], re(y)) {
            if (y.type && (r += " if (" + e.util.checkDataType(y.type, w, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
              if (y.type == "object" && e.schema.properties) {
                var S = e.schema.properties, se = Object.keys(S), O = se;
                if (O)
                  for (var B, C = -1, ee = O.length - 1; C < ee; ) {
                    B = O[C += 1];
                    var te = S[B];
                    if (te.default !== void 0) {
                      var N = w + e.util.getProperty(B);
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var _ = "default is ignored for: " + N;
                          if (e.opts.strictDefaults === "log") e.logger.warn(_);
                          else throw new Error(_);
                        }
                      } else
                        r += " if (" + N + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + N + " === null || " + N + " === '' "), r += " ) " + N + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(te.default) + " " : r += " " + JSON.stringify(te.default) + " ", r += "; ";
                    }
                  }
              } else if (y.type == "array" && Array.isArray(e.schema.items)) {
                var j = e.schema.items;
                if (j) {
                  for (var te, ue = -1, W = j.length - 1; ue < W; )
                    if (te = j[ue += 1], te.default !== void 0) {
                      var N = w + "[" + ue + "]";
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var _ = "default is ignored for: " + N;
                          if (e.opts.strictDefaults === "log") e.logger.warn(_);
                          else throw new Error(_);
                        }
                      } else
                        r += " if (" + N + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + N + " === null || " + N + " === '' "), r += " ) " + N + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(te.default) + " " : r += " " + JSON.stringify(te.default) + " ", r += "; ";
                    }
                }
              }
            }
            var oe = y.rules;
            if (oe) {
              for (var we, Se = -1, Re = oe.length - 1; Se < Re; )
                if (we = oe[Se += 1], De(we)) {
                  var Oe = we.code(e, we.keyword, y.type);
                  Oe && (r += " " + Oe + " ", P && (D += "}"));
                }
            }
            if (P && (r += " " + D + " ", D = ""), y.type && (r += " } ", K && K === y.type && !z)) {
              r += " else { ";
              var s = e.schemaPath + ".type", a = e.errSchemaPath + "/type", u = u || [];
              u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (q || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(a) + " , params: { type: '", L ? r += "" + K.join(",") : r += "" + K, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", L ? r += "" + K.join(",") : r += "" + K, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + s + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + w + " "), r += " } ") : r += " {} ";
              var d = r;
              r = u.pop(), !e.compositeRule && P ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ";
            }
            P && (r += " if (errors === ", E ? r += "0" : r += "errs_" + o, r += ") { ", x += "}");
          }
      }
    }
    P && (r += " " + x + " "), E ? (i ? (r += " if (errors === 0) return data;           ", r += " else throw new ValidationError(vErrors); ") : (r += " validate.errors = vErrors; ", r += " return errors === 0;       "), r += " }; return validate;") : r += " var " + I + " = errors === errs_" + o + ";";
    function re(Pe) {
      for (var $e = Pe.rules, ve = 0; ve < $e.length; ve++)
        if (De($e[ve])) return !0;
    }
    function De(Pe) {
      return e.schema[Pe.keyword] !== void 0 || Pe.implements && Le(Pe);
    }
    function Le(Pe) {
      for (var $e = Pe.implements, ve = 0; ve < $e.length; ve++)
        if (e.schema[$e[ve]] !== void 0) return !0;
    }
    return r;
  }), fa;
}
var la, Sl;
function Hh() {
  if (Sl) return la;
  Sl = 1;
  var t = Yo(), e = yt(), l = Qo(), c = Fc(), r = Dc(), i = e.ucs2length, p = Ko(), f = l.Validation;
  la = b;
  function b(u, d, E, _) {
    var I = this, P = this._opts, D = [void 0], x = {}, q = [], K = {}, L = [], z = {}, y = [];
    function F(te, N) {
      var j = P.regExp ? "regExp" : "new RegExp";
      return "var pattern" + te + " = " + j + "(" + e.toQuotedString(N[te]) + ");";
    }
    d = d || { schema: u, refVal: D, refs: x };
    var ie = A.call(this, u, d, _), ce = this._compilations[ie.index];
    if (ie.compiling) return ce.callValidate = k;
    var _e = this._formats, be = this.RULES;
    try {
      var ue = he(u, d, E, _);
      ce.validate = ue;
      var le = ce.callValidate;
      return le && (le.schema = ue.schema, le.errors = null, le.refs = ue.refs, le.refVal = ue.refVal, le.root = ue.root, le.$async = ue.$async, P.sourceCode && (le.source = ue.source)), ue;
    } finally {
      o.call(this, u, d, _);
    }
    function k() {
      var te = ce.validate, N = te.apply(this, arguments);
      return k.errors = te.errors, N;
    }
    function he(te, N, j, W) {
      var oe = !N || N && N.schema == te;
      if (N.schema != d.schema)
        return b.call(I, te, N, j, W);
      var we = te.$async === !0, Se = r({
        isTop: !0,
        schema: te,
        isRoot: oe,
        baseId: W,
        root: N,
        schemaPath: "",
        errSchemaPath: "#",
        errorPath: '""',
        MissingRefError: l.MissingRef,
        RULES: be,
        validate: r,
        util: e,
        resolve: t,
        resolveRef: X,
        usePattern: B,
        useDefault: C,
        useCustomRule: ee,
        opts: P,
        formats: _e,
        logger: I.logger,
        self: I
      });
      Se = w(D, s) + w(q, F) + w(L, S) + w(y, a) + Se, P.processCode && (Se = P.processCode(Se, te));
      var Re;
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
          Se
        );
        Re = Oe(
          I,
          be,
          _e,
          d,
          D,
          L,
          y,
          p,
          i,
          f,
          P.regExp
        ), D[0] = Re;
      } catch (re) {
        throw I.logger.error("Error compiling schema, function code:", Se), re;
      }
      return Re.schema = te, Re.errors = null, Re.refs = x, Re.refVal = D, Re.root = oe ? Re : N, we && (Re.$async = !0), P.sourceCode === !0 && (Re.source = {
        code: Se,
        patterns: q,
        defaults: L
      }), Re;
    }
    function X(te, N, j) {
      N = t.url(te, N);
      var W = x[N], oe, we;
      if (W !== void 0)
        return oe = D[W], we = "refVal[" + W + "]", O(oe, we);
      if (!j && d.refs) {
        var Se = d.refs[N];
        if (Se !== void 0)
          return oe = d.refVal[Se], we = Q(N, oe), O(oe, we);
      }
      we = Q(N);
      var Re = t.call(I, he, d, N);
      if (Re === void 0) {
        var Oe = E && E[N];
        Oe && (Re = t.inlineRef(Oe, P.inlineRefs) ? Oe : b.call(I, Oe, d, E, te));
      }
      if (Re === void 0)
        H(N);
      else
        return se(N, Re), O(Re, we);
    }
    function Q(te, N) {
      var j = D.length;
      return D[j] = N, x[te] = j, "refVal" + j;
    }
    function H(te) {
      delete x[te];
    }
    function se(te, N) {
      var j = x[te];
      D[j] = N;
    }
    function O(te, N) {
      return typeof te == "object" || typeof te == "boolean" ? { code: N, schema: te, inline: !0 } : { code: N, $async: te && !!te.$async };
    }
    function B(te) {
      var N = K[te];
      return N === void 0 && (N = K[te] = q.length, q[N] = te), "pattern" + N;
    }
    function C(te) {
      switch (typeof te) {
        case "boolean":
        case "number":
          return "" + te;
        case "string":
          return e.toQuotedString(te);
        case "object":
          if (te === null) return "null";
          var N = c(te), j = z[N];
          return j === void 0 && (j = z[N] = L.length, L[j] = te), "default" + j;
      }
    }
    function ee(te, N, j, W) {
      if (I._opts.validateSchema !== !1) {
        var oe = te.definition.dependencies;
        if (oe && !oe.every(function($e) {
          return Object.prototype.hasOwnProperty.call(j, $e);
        }))
          throw new Error("parent schema must have all required keywords: " + oe.join(","));
        var we = te.definition.validateSchema;
        if (we) {
          var Se = we(N);
          if (!Se) {
            var Re = "keyword schema is invalid: " + I.errorsText(we.errors);
            if (I._opts.validateSchema == "log") I.logger.error(Re);
            else throw new Error(Re);
          }
        }
      }
      var Oe = te.definition.compile, re = te.definition.inline, De = te.definition.macro, Le;
      if (Oe)
        Le = Oe.call(I, N, j, W);
      else if (De)
        Le = De.call(I, N, j, W), P.validateSchema !== !1 && I.validateSchema(Le, !0);
      else if (re)
        Le = re.call(I, W, te.keyword, N, j);
      else if (Le = te.definition.validate, !Le) return;
      if (Le === void 0)
        throw new Error('custom keyword "' + te.keyword + '"failed to compile');
      var Pe = y.length;
      return y[Pe] = Le, {
        code: "customRule" + Pe,
        validate: Le
      };
    }
  }
  function A(u, d, E) {
    var _ = v.call(this, u, d, E);
    return _ >= 0 ? { index: _, compiling: !0 } : (_ = this._compilations.length, this._compilations[_] = {
      schema: u,
      root: d,
      baseId: E
    }, { index: _, compiling: !1 });
  }
  function o(u, d, E) {
    var _ = v.call(this, u, d, E);
    _ >= 0 && this._compilations.splice(_, 1);
  }
  function v(u, d, E) {
    for (var _ = 0; _ < this._compilations.length; _++) {
      var I = this._compilations[_];
      if (I.schema == u && I.root == d && I.baseId == E) return _;
    }
    return -1;
  }
  function S(u) {
    return "var default" + u + " = defaults[" + u + "];";
  }
  function s(u, d) {
    return d[u] === void 0 ? "" : "var refVal" + u + " = refVal[" + u + "];";
  }
  function a(u) {
    return "var customRule" + u + " = customRules[" + u + "];";
  }
  function w(u, d) {
    if (!u.length) return "";
    for (var E = "", _ = 0; _ < u.length; _++)
      E += d(_, u);
    return E;
  }
  return la;
}
var ua = { exports: {} }, Rl;
function Vh() {
  if (Rl) return ua.exports;
  Rl = 1;
  var t = ua.exports = function() {
    this._cache = {};
  };
  return t.prototype.put = function(l, c) {
    this._cache[l] = c;
  }, t.prototype.get = function(l) {
    return this._cache[l];
  }, t.prototype.del = function(l) {
    delete this._cache[l];
  }, t.prototype.clear = function() {
    this._cache = {};
  }, ua.exports;
}
var ca, Al;
function Gh() {
  if (Al) return ca;
  Al = 1;
  var t = yt(), e = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, l = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], c = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, r = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, i = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, p = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, f = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, b = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, A = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, o = /^(?:\/(?:[^~/]|~0|~1)*)*$/, v = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, S = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
  ca = s;
  function s(x) {
    return x = x == "full" ? "full" : "fast", t.copy(s[x]);
  }
  s.fast = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
    "date-time": /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    "uri-template": f,
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
    regex: D,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: A,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": o,
    "json-pointer-uri-fragment": v,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": S
  }, s.full = {
    date: w,
    time: u,
    "date-time": E,
    uri: I,
    "uri-reference": p,
    "uri-template": f,
    url: b,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: r,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: D,
    uuid: A,
    "json-pointer": o,
    "json-pointer-uri-fragment": v,
    "relative-json-pointer": S
  };
  function a(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  function w(x) {
    var q = x.match(e);
    if (!q) return !1;
    var K = +q[1], L = +q[2], z = +q[3];
    return L >= 1 && L <= 12 && z >= 1 && z <= (L == 2 && a(K) ? 29 : l[L]);
  }
  function u(x, q) {
    var K = x.match(c);
    if (!K) return !1;
    var L = K[1], z = K[2], y = K[3], F = K[5];
    return (L <= 23 && z <= 59 && y <= 59 || L == 23 && z == 59 && y == 60) && (!q || F);
  }
  var d = /t|\s/i;
  function E(x) {
    var q = x.split(d);
    return q.length == 2 && w(q[0]) && u(q[1], !0);
  }
  var _ = /\/|:/;
  function I(x) {
    return _.test(x) && i.test(x);
  }
  var P = /[^\\]\\Z/;
  function D(x) {
    if (P.test(x)) return !1;
    try {
      return new RegExp(x), !0;
    } catch {
      return !1;
    }
  }
  return ca;
}
var da, Pl;
function Zh() {
  return Pl || (Pl = 1, da = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.errSchemaPath + "/" + l, A = !e.opts.allErrors, o = "data" + (p || ""), v = "valid" + i, S, s;
    if (f == "#" || f == "#/")
      e.isRoot ? (S = e.async, s = "validate") : (S = e.root.schema.$async === !0, s = "root.refVal[0]");
    else {
      var a = e.resolveRef(e.baseId, f, e.isRoot);
      if (a === void 0) {
        var w = e.MissingRefError.message(e.baseId, f);
        if (e.opts.missingRefs == "fail") {
          e.logger.error(w);
          var u = u || [];
          u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(b) + " , params: { ref: '" + e.util.escapeQuotes(f) + "' } ", e.opts.messages !== !1 && (r += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(f) + "' "), e.opts.verbose && (r += " , schema: " + e.util.toQuotedString(f) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + o + " "), r += " } ") : r += " {} ";
          var d = r;
          r = u.pop(), !e.compositeRule && A ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", A && (r += " if (false) { ");
        } else if (e.opts.missingRefs == "ignore")
          e.logger.warn(w), A && (r += " if (true) { ");
        else
          throw new e.MissingRefError(e.baseId, f, w);
      } else if (a.inline) {
        var E = e.util.copy(e);
        E.level++;
        var _ = "valid" + E.level;
        E.schema = a.schema, E.schemaPath = "", E.errSchemaPath = f;
        var I = e.validate(E).replace(/validate\.schema/g, a.code);
        r += " " + I + " ", A && (r += " if (" + _ + ") { ");
      } else
        S = a.$async === !0 || e.async && a.$async !== !1, s = a.code;
    }
    if (s) {
      var u = u || [];
      u.push(r), r = "", e.opts.passContext ? r += " " + s + ".call(this, " : r += " " + s + "( ", r += " " + o + ", (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var P = p ? "data" + (p - 1 || "") : "parentData", D = p ? e.dataPathArr[p] : "parentDataProperty";
      r += " , " + P + " , " + D + ", rootData)  ";
      var x = r;
      if (r = u.pop(), S) {
        if (!e.async) throw new Error("async schema referenced by sync schema");
        A && (r += " var " + v + "; "), r += " try { await " + x + "; ", A && (r += " " + v + " = true; "), r += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", A && (r += " " + v + " = false; "), r += " } ", A && (r += " if (" + v + ") { ");
      } else
        r += " if (!" + x + ") { if (vErrors === null) vErrors = " + s + ".errors; else vErrors = vErrors.concat(" + s + ".errors); errors = vErrors.length; } ", A && (r += " else { ");
    }
    return r;
  }), da;
}
var ha, Tl;
function Kh() {
  return Tl || (Tl = 1, ha = function(e, l, c) {
    var r = " ", i = e.schema[l], p = e.schemaPath + e.util.getProperty(l), f = e.errSchemaPath + "/" + l, b = !e.opts.allErrors, A = e.util.copy(e), o = "";
    A.level++;
    var v = "valid" + A.level, S = A.baseId, s = !0, a = i;
    if (a)
      for (var w, u = -1, d = a.length - 1; u < d; )
        w = a[u += 1], (e.opts.strictKeywords ? typeof w == "object" && Object.keys(w).length > 0 || w === !1 : e.util.schemaHasRules(w, e.RULES.all)) && (s = !1, A.schema = w, A.schemaPath = p + "[" + u + "]", A.errSchemaPath = f + "/" + u, r += "  " + e.validate(A) + " ", A.baseId = S, b && (r += " if (" + v + ") { ", o += "}"));
    return b && (s ? r += " if (true) { " : r += " " + o.slice(0, -1) + " "), r;
  }), ha;
}
var pa, Il;
function Yh() {
  return Il || (Il = 1, pa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = "errs__" + i, a = e.util.copy(e), w = "";
    a.level++;
    var u = "valid" + a.level, d = f.every(function(q) {
      return e.opts.strictKeywords ? typeof q == "object" && Object.keys(q).length > 0 || q === !1 : e.util.schemaHasRules(q, e.RULES.all);
    });
    if (d) {
      var E = a.baseId;
      r += " var " + s + " = errors; var " + S + " = false;  ";
      var _ = e.compositeRule;
      e.compositeRule = a.compositeRule = !0;
      var I = f;
      if (I)
        for (var P, D = -1, x = I.length - 1; D < x; )
          P = I[D += 1], a.schema = P, a.schemaPath = b + "[" + D + "]", a.errSchemaPath = A + "/" + D, r += "  " + e.validate(a) + " ", a.baseId = E, r += " " + S + " = " + S + " || " + u + "; if (!" + S + ") { ", w += "}";
      e.compositeRule = a.compositeRule = _, r += " " + w + " if (!" + S + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && o && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " } else {  errors = " + s + "; if (vErrors !== null) { if (" + s + ") vErrors.length = " + s + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      o && (r += " if (true) { ");
    return r;
  }), pa;
}
var ya, Ol;
function Qh() {
  return Ol || (Ol = 1, ya = function(e, l, c) {
    var r = " ", i = e.schema[l], p = e.errSchemaPath + "/" + l;
    e.opts.allErrors;
    var f = e.util.toQuotedString(i);
    return e.opts.$comment === !0 ? r += " console.log(" + f + ");" : typeof e.opts.$comment == "function" && (r += " self._opts.$comment(" + f + ", " + e.util.toQuotedString(p) + ", validate.root.schema);"), r;
  }), ya;
}
var va, xl;
function Jh() {
  return xl || (xl = 1, va = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = e.opts.$data && f && f.$data;
    s && (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; "), s || (r += " var schema" + i + " = validate.schema" + b + ";"), r += "var " + S + " = equal(" + v + ", schema" + i + "); if (!" + S + ") {   ";
    var a = a || [];
    a.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { allowedValue: schema" + i + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to constant' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var w = r;
    return r = a.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + w + "]); " : r += " validate.errors = [" + w + "]; return false; " : r += " var err = " + w + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", o && (r += " else { "), r;
  }), va;
}
var ga, Fl;
function Xh() {
  return Fl || (Fl = 1, ga = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = "errs__" + i, a = e.util.copy(e), w = "";
    a.level++;
    var u = "valid" + a.level, d = "i" + i, E = a.dataLevel = e.dataLevel + 1, _ = "data" + E, I = e.baseId, P = e.opts.strictKeywords ? typeof f == "object" && Object.keys(f).length > 0 || f === !1 : e.util.schemaHasRules(f, e.RULES.all);
    if (r += "var " + s + " = errors;var " + S + ";", P) {
      var D = e.compositeRule;
      e.compositeRule = a.compositeRule = !0, a.schema = f, a.schemaPath = b, a.errSchemaPath = A, r += " var " + u + " = false; for (var " + d + " = 0; " + d + " < " + v + ".length; " + d + "++) { ", a.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers, !0);
      var x = v + "[" + d + "]";
      a.dataPathArr[E] = d;
      var q = e.validate(a);
      a.baseId = I, e.util.varOccurences(q, _) < 2 ? r += " " + e.util.varReplace(q, _, x) + " " : r += " var " + _ + " = " + x + "; " + q + " ", r += " if (" + u + ") break; }  ", e.compositeRule = a.compositeRule = D, r += " " + w + " if (!" + u + ") {";
    } else
      r += " if (" + v + ".length == 0) {";
    var K = K || [];
    K.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should contain a valid item' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var L = r;
    return r = K.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + L + "]); " : r += " validate.errors = [" + L + "]; return false; " : r += " var err = " + L + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ", P && (r += "  errors = " + s + "; if (vErrors !== null) { if (" + s + ") vErrors.length = " + s + "; else vErrors = null; } "), e.opts.allErrors && (r += " } "), r;
  }), ga;
}
var ma, Dl;
function ep() {
  return Dl || (Dl = 1, ma = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "errs__" + i, s = e.util.copy(e), a = "";
    s.level++;
    var w = "valid" + s.level, u = {}, d = {}, E = e.opts.ownProperties;
    for (D in f)
      if (D != "__proto__") {
        var _ = f[D], I = Array.isArray(_) ? d : u;
        I[D] = _;
      }
    r += "var " + S + " = errors;";
    var P = e.errorPath;
    r += "var missing" + i + ";";
    for (var D in d)
      if (I = d[D], I.length) {
        if (r += " if ( " + v + e.util.getProperty(D) + " !== undefined ", E && (r += " && Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(D) + "') "), o) {
          r += " && ( ";
          var x = I;
          if (x)
            for (var q, K = -1, L = x.length - 1; K < L; ) {
              q = x[K += 1], K && (r += " || ");
              var z = e.util.getProperty(q), y = v + z;
              r += " ( ( " + y + " === undefined ", E && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(q) + "') "), r += ") && (missing" + i + " = " + e.util.toQuotedString(e.opts.jsonPointers ? q : z) + ") ) ";
            }
          r += ")) {  ";
          var F = "missing" + i, ie = "' + " + F + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(P, F, !0) : P + " + " + F);
          var ce = ce || [];
          ce.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { property: '" + e.util.escapeQuotes(D) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes(D) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var _e = r;
          r = ce.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + _e + "]); " : r += " validate.errors = [" + _e + "]; return false; " : r += " var err = " + _e + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        } else {
          r += " ) { ";
          var be = I;
          if (be)
            for (var q, ue = -1, le = be.length - 1; ue < le; ) {
              q = be[ue += 1];
              var z = e.util.getProperty(q), ie = e.util.escapeQuotes(q), y = v + z;
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(P, q, e.opts.jsonPointers)), r += " if ( " + y + " === undefined ", E && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(q) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { property: '" + e.util.escapeQuotes(D) + "', missingProperty: '" + ie + "', depsCount: " + I.length + ", deps: '" + e.util.escapeQuotes(I.length == 1 ? I[0] : I.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", I.length == 1 ? r += "property " + e.util.escapeQuotes(I[0]) : r += "properties " + e.util.escapeQuotes(I.join(", ")), r += " when property " + e.util.escapeQuotes(D) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
            }
        }
        r += " }   ", o && (a += "}", r += " else { ");
      }
    e.errorPath = P;
    var k = s.baseId;
    for (var D in u) {
      var _ = u[D];
      (e.opts.strictKeywords ? typeof _ == "object" && Object.keys(_).length > 0 || _ === !1 : e.util.schemaHasRules(_, e.RULES.all)) && (r += " " + w + " = true; if ( " + v + e.util.getProperty(D) + " !== undefined ", E && (r += " && Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(D) + "') "), r += ") { ", s.schema = _, s.schemaPath = b + e.util.getProperty(D), s.errSchemaPath = A + "/" + e.util.escapeFragment(D), r += "  " + e.validate(s) + " ", s.baseId = k, r += " }  ", o && (r += " if (" + w + ") { ", a += "}"));
    }
    return o && (r += "   " + a + " if (" + S + " == errors) {"), r;
  }), ma;
}
var ba, Nl;
function rp() {
  return Nl || (Nl = 1, ba = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = e.opts.$data && f && f.$data;
    s && (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ");
    var a = "i" + i, w = "schema" + i;
    s || (r += " var " + w + " = validate.schema" + b + ";"), r += "var " + S + ";", s && (r += " if (schema" + i + " === undefined) " + S + " = true; else if (!Array.isArray(schema" + i + ")) " + S + " = false; else {"), r += "" + S + " = false;for (var " + a + "=0; " + a + "<" + w + ".length; " + a + "++) if (equal(" + v + ", " + w + "[" + a + "])) { " + S + " = true; break; }", s && (r += "  }  "), r += " if (!" + S + ") {   ";
    var u = u || [];
    u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { allowedValues: schema" + i + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var d = r;
    return r = u.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", o && (r += " else { "), r;
  }), ba;
}
var wa, Bl;
function tp() {
  return Bl || (Bl = 1, wa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || "");
    if (e.opts.format === !1)
      return o && (r += " if (true) { "), r;
    var S = e.opts.$data && f && f.$data, s;
    S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f;
    var a = e.opts.unknownFormats, w = Array.isArray(a);
    if (S) {
      var u = "format" + i, d = "isObject" + i, E = "formatType" + i;
      r += " var " + u + " = formats[" + s + "]; var " + d + " = typeof " + u + " == 'object' && !(" + u + " instanceof RegExp) && " + u + ".validate; var " + E + " = " + d + " && " + u + ".type || 'string'; if (" + d + ") { ", e.async && (r += " var async" + i + " = " + u + ".async; "), r += " " + u + " = " + u + ".validate; } if (  ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'string') || "), r += " (", a != "ignore" && (r += " (" + s + " && !" + u + " ", w && (r += " && self._opts.unknownFormats.indexOf(" + s + ") == -1 "), r += ") || "), r += " (" + u + " && " + E + " == '" + c + "' && !(typeof " + u + " == 'function' ? ", e.async ? r += " (async" + i + " ? await " + u + "(" + v + ") : " + u + "(" + v + ")) " : r += " " + u + "(" + v + ") ", r += " : " + u + ".test(" + v + "))))) {";
    } else {
      var u = e.formats[f];
      if (!u) {
        if (a == "ignore")
          return e.logger.warn('unknown format "' + f + '" ignored in schema at path "' + e.errSchemaPath + '"'), o && (r += " if (true) { "), r;
        if (w && a.indexOf(f) >= 0)
          return o && (r += " if (true) { "), r;
        throw new Error('unknown format "' + f + '" is used in schema at path "' + e.errSchemaPath + '"');
      }
      var d = typeof u == "object" && !(u instanceof RegExp) && u.validate, E = d && u.type || "string";
      if (d) {
        var _ = u.async === !0;
        u = u.validate;
      }
      if (E != c)
        return o && (r += " if (true) { "), r;
      if (_) {
        if (!e.async) throw new Error("async format in sync schema");
        var I = "formats" + e.util.getProperty(f) + ".validate";
        r += " if (!(await " + I + "(" + v + "))) { ";
      } else {
        r += " if (! ";
        var I = "formats" + e.util.getProperty(f);
        d && (I += ".validate"), typeof u == "function" ? r += " " + I + "(" + v + ") " : r += " " + I + ".test(" + v + ") ", r += ") { ";
      }
    }
    var P = P || [];
    P.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { format:  ", S ? r += "" + s : r += "" + e.util.toQuotedString(f), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match format "`, S ? r += "' + " + s + " + '" : r += "" + e.util.escapeQuotes(f), r += `"' `), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + e.util.toQuotedString(f), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var D = r;
    return r = P.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", o && (r += " else { "), r;
  }), wa;
}
var _a, Ll;
function np() {
  return Ll || (Ll = 1, _a = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = "errs__" + i, a = e.util.copy(e);
    a.level++;
    var w = "valid" + a.level, u = e.schema.then, d = e.schema.else, E = u !== void 0 && (e.opts.strictKeywords ? typeof u == "object" && Object.keys(u).length > 0 || u === !1 : e.util.schemaHasRules(u, e.RULES.all)), _ = d !== void 0 && (e.opts.strictKeywords ? typeof d == "object" && Object.keys(d).length > 0 || d === !1 : e.util.schemaHasRules(d, e.RULES.all)), I = a.baseId;
    if (E || _) {
      var P;
      a.createErrors = !1, a.schema = f, a.schemaPath = b, a.errSchemaPath = A, r += " var " + s + " = errors; var " + S + " = true;  ";
      var D = e.compositeRule;
      e.compositeRule = a.compositeRule = !0, r += "  " + e.validate(a) + " ", a.baseId = I, a.createErrors = !0, r += "  errors = " + s + "; if (vErrors !== null) { if (" + s + ") vErrors.length = " + s + "; else vErrors = null; }  ", e.compositeRule = a.compositeRule = D, E ? (r += " if (" + w + ") {  ", a.schema = e.schema.then, a.schemaPath = e.schemaPath + ".then", a.errSchemaPath = e.errSchemaPath + "/then", r += "  " + e.validate(a) + " ", a.baseId = I, r += " " + S + " = " + w + "; ", E && _ ? (P = "ifClause" + i, r += " var " + P + " = 'then'; ") : P = "'then'", r += " } ", _ && (r += " else { ")) : r += " if (!" + w + ") { ", _ && (a.schema = e.schema.else, a.schemaPath = e.schemaPath + ".else", a.errSchemaPath = e.errSchemaPath + "/else", r += "  " + e.validate(a) + " ", a.baseId = I, r += " " + S + " = " + w + "; ", E && _ ? (P = "ifClause" + i, r += " var " + P + " = 'else'; ") : P = "'else'", r += " } "), r += " if (!" + S + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { failingKeyword: " + P + " } ", e.opts.messages !== !1 && (r += ` , message: 'should match "' + ` + P + ` + '" schema' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && o && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " }   ", o && (r += " else { ");
    } else
      o && (r += " if (true) { ");
    return r;
  }), _a;
}
var Ea, Cl;
function ip() {
  return Cl || (Cl = 1, Ea = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = "errs__" + i, a = e.util.copy(e), w = "";
    a.level++;
    var u = "valid" + a.level, d = "i" + i, E = a.dataLevel = e.dataLevel + 1, _ = "data" + E, I = e.baseId;
    if (r += "var " + s + " = errors;var " + S + ";", Array.isArray(f)) {
      var P = e.schema.additionalItems;
      if (P === !1) {
        r += " " + S + " = " + v + ".length <= " + f.length + "; ";
        var D = A;
        A = e.errSchemaPath + "/additionalItems", r += "  if (!" + S + ") {   ";
        var x = x || [];
        x.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { limit: " + f.length + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have more than " + f.length + " items' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
        var q = r;
        r = x.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + q + "]); " : r += " validate.errors = [" + q + "]; return false; " : r += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", A = D, o && (w += "}", r += " else { ");
      }
      var K = f;
      if (K) {
        for (var L, z = -1, y = K.length - 1; z < y; )
          if (L = K[z += 1], e.opts.strictKeywords ? typeof L == "object" && Object.keys(L).length > 0 || L === !1 : e.util.schemaHasRules(L, e.RULES.all)) {
            r += " " + u + " = true; if (" + v + ".length > " + z + ") { ";
            var F = v + "[" + z + "]";
            a.schema = L, a.schemaPath = b + "[" + z + "]", a.errSchemaPath = A + "/" + z, a.errorPath = e.util.getPathExpr(e.errorPath, z, e.opts.jsonPointers, !0), a.dataPathArr[E] = z;
            var ie = e.validate(a);
            a.baseId = I, e.util.varOccurences(ie, _) < 2 ? r += " " + e.util.varReplace(ie, _, F) + " " : r += " var " + _ + " = " + F + "; " + ie + " ", r += " }  ", o && (r += " if (" + u + ") { ", w += "}");
          }
      }
      if (typeof P == "object" && (e.opts.strictKeywords ? typeof P == "object" && Object.keys(P).length > 0 || P === !1 : e.util.schemaHasRules(P, e.RULES.all))) {
        a.schema = P, a.schemaPath = e.schemaPath + ".additionalItems", a.errSchemaPath = e.errSchemaPath + "/additionalItems", r += " " + u + " = true; if (" + v + ".length > " + f.length + ") {  for (var " + d + " = " + f.length + "; " + d + " < " + v + ".length; " + d + "++) { ", a.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers, !0);
        var F = v + "[" + d + "]";
        a.dataPathArr[E] = d;
        var ie = e.validate(a);
        a.baseId = I, e.util.varOccurences(ie, _) < 2 ? r += " " + e.util.varReplace(ie, _, F) + " " : r += " var " + _ + " = " + F + "; " + ie + " ", o && (r += " if (!" + u + ") break; "), r += " } }  ", o && (r += " if (" + u + ") { ", w += "}");
      }
    } else if (e.opts.strictKeywords ? typeof f == "object" && Object.keys(f).length > 0 || f === !1 : e.util.schemaHasRules(f, e.RULES.all)) {
      a.schema = f, a.schemaPath = b, a.errSchemaPath = A, r += "  for (var " + d + " = 0; " + d + " < " + v + ".length; " + d + "++) { ", a.errorPath = e.util.getPathExpr(e.errorPath, d, e.opts.jsonPointers, !0);
      var F = v + "[" + d + "]";
      a.dataPathArr[E] = d;
      var ie = e.validate(a);
      a.baseId = I, e.util.varOccurences(ie, _) < 2 ? r += " " + e.util.varReplace(ie, _, F) + " " : r += " var " + _ + " = " + F + "; " + ie + " ", o && (r += " if (!" + u + ") break; "), r += " }";
    }
    return o && (r += " " + w + " if (" + s + " == errors) {"), r;
  }), Ea;
}
var Sa, jl;
function Ml() {
  return jl || (jl = 1, Sa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, I, v = "data" + (p || ""), S = e.opts.$data && f && f.$data, s;
    S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f;
    var a = l == "maximum", w = a ? "exclusiveMaximum" : "exclusiveMinimum", u = e.schema[w], d = e.opts.$data && u && u.$data, E = a ? "<" : ">", _ = a ? ">" : "<", I = void 0;
    if (!(S || typeof f == "number" || f === void 0))
      throw new Error(l + " must be number");
    if (!(d || u === void 0 || typeof u == "number" || typeof u == "boolean"))
      throw new Error(w + " must be number or boolean");
    if (d) {
      var P = e.util.getData(u.$data, p, e.dataPathArr), D = "exclusive" + i, x = "exclType" + i, q = "exclIsNumber" + i, K = "op" + i, L = "' + " + K + " + '";
      r += " var schemaExcl" + i + " = " + P + "; ", P = "schemaExcl" + i, r += " var " + D + "; var " + x + " = typeof " + P + "; if (" + x + " != 'boolean' && " + x + " != 'undefined' && " + x + " != 'number') { ";
      var I = w, z = z || [];
      z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: '" + w + " should be boolean' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var y = r;
      r = z.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), r += " " + x + " == 'number' ? ( (" + D + " = " + s + " === undefined || " + P + " " + E + "= " + s + ") ? " + v + " " + _ + "= " + P + " : " + v + " " + _ + " " + s + " ) : ( (" + D + " = " + P + " === true) ? " + v + " " + _ + "= " + s + " : " + v + " " + _ + " " + s + " ) || " + v + " !== " + v + ") { var op" + i + " = " + D + " ? '" + E + "' : '" + E + "='; ", f === void 0 && (I = w, A = e.errSchemaPath + "/" + w, s = P, S = d);
    } else {
      var q = typeof u == "number", L = E;
      if (q && S) {
        var K = "'" + L + "'";
        r += " if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), r += " ( " + s + " === undefined || " + u + " " + E + "= " + s + " ? " + v + " " + _ + "= " + u + " : " + v + " " + _ + " " + s + " ) || " + v + " !== " + v + ") { ";
      } else {
        q && f === void 0 ? (D = !0, I = w, A = e.errSchemaPath + "/" + w, s = u, _ += "=") : (q && (s = Math[a ? "min" : "max"](u, f)), u === (q ? s : !0) ? (D = !0, I = w, A = e.errSchemaPath + "/" + w, _ += "=") : (D = !1, L += "="));
        var K = "'" + L + "'";
        r += " if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), r += " " + v + " " + _ + " " + s + " || " + v + " !== " + v + ") { ";
      }
    }
    I = I || l;
    var z = z || [];
    z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (I || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { comparison: " + K + ", limit: " + s + ", exclusive: " + D + " } ", e.opts.messages !== !1 && (r += " , message: 'should be " + L + " ", S ? r += "' + " + s : r += "" + s + "'"), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var y = r;
    return r = z.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", o && (r += " else { "), r;
  }), Sa;
}
var Ra, kl;
function ql() {
  return kl || (kl = 1, Ra = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, w, v = "data" + (p || ""), S = e.opts.$data && f && f.$data, s;
    if (S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f, !(S || typeof f == "number"))
      throw new Error(l + " must be number");
    var a = l == "maxItems" ? ">" : "<";
    r += "if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), r += " " + v + ".length " + a + " " + s + ") { ";
    var w = l, u = u || [];
    u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (w || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { limit: " + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", l == "maxItems" ? r += "more" : r += "fewer", r += " than ", S ? r += "' + " + s + " + '" : r += "" + f, r += " items' "), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var d = r;
    return r = u.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", o && (r += " else { "), r;
  }), Ra;
}
var Aa, $l;
function Ul() {
  return $l || ($l = 1, Aa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, w, v = "data" + (p || ""), S = e.opts.$data && f && f.$data, s;
    if (S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f, !(S || typeof f == "number"))
      throw new Error(l + " must be number");
    var a = l == "maxLength" ? ">" : "<";
    r += "if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), e.opts.unicode === !1 ? r += " " + v + ".length " : r += " ucs2length(" + v + ") ", r += " " + a + " " + s + ") { ";
    var w = l, u = u || [];
    u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (w || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { limit: " + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT be ", l == "maxLength" ? r += "longer" : r += "shorter", r += " than ", S ? r += "' + " + s + " + '" : r += "" + f, r += " characters' "), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var d = r;
    return r = u.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", o && (r += " else { "), r;
  }), Aa;
}
var Pa, zl;
function Wl() {
  return zl || (zl = 1, Pa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, w, v = "data" + (p || ""), S = e.opts.$data && f && f.$data, s;
    if (S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f, !(S || typeof f == "number"))
      throw new Error(l + " must be number");
    var a = l == "maxProperties" ? ">" : "<";
    r += "if ( ", S && (r += " (" + s + " !== undefined && typeof " + s + " != 'number') || "), r += " Object.keys(" + v + ").length " + a + " " + s + ") { ";
    var w = l, u = u || [];
    u.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (w || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { limit: " + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", l == "maxProperties" ? r += "more" : r += "fewer", r += " than ", S ? r += "' + " + s + " + '" : r += "" + f, r += " properties' "), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var d = r;
    return r = u.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + d + "]); " : r += " validate.errors = [" + d + "]; return false; " : r += " var err = " + d + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", o && (r += " else { "), r;
  }), Pa;
}
var Ta, Hl;
function ap() {
  return Hl || (Hl = 1, Ta = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = e.opts.$data && f && f.$data, s;
    if (S ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", s = "schema" + i) : s = f, !(S || typeof f == "number"))
      throw new Error(l + " must be number");
    r += "var division" + i + ";if (", S && (r += " " + s + " !== undefined && ( typeof " + s + " != 'number' || "), r += " (division" + i + " = " + v + " / " + s + ", ", e.opts.multipleOfPrecision ? r += " Math.abs(Math.round(division" + i + ") - division" + i + ") > 1e-" + e.opts.multipleOfPrecision + " " : r += " division" + i + " !== parseInt(division" + i + ") ", r += " ) ", S && (r += "  )  "), r += " ) {   ";
    var a = a || [];
    a.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { multipleOf: " + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should be multiple of ", S ? r += "' + " + s : r += "" + s + "'"), e.opts.verbose && (r += " , schema:  ", S ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var w = r;
    return r = a.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + w + "]); " : r += " validate.errors = [" + w + "]; return false; " : r += " var err = " + w + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", o && (r += " else { "), r;
  }), Ta;
}
var Ia, Vl;
function op() {
  return Vl || (Vl = 1, Ia = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "errs__" + i, s = e.util.copy(e);
    s.level++;
    var a = "valid" + s.level;
    if (e.opts.strictKeywords ? typeof f == "object" && Object.keys(f).length > 0 || f === !1 : e.util.schemaHasRules(f, e.RULES.all)) {
      s.schema = f, s.schemaPath = b, s.errSchemaPath = A, r += " var " + S + " = errors;  ";
      var w = e.compositeRule;
      e.compositeRule = s.compositeRule = !0, s.createErrors = !1;
      var u;
      s.opts.allErrors && (u = s.opts.allErrors, s.opts.allErrors = !1), r += " " + e.validate(s) + " ", s.createErrors = !0, u && (s.opts.allErrors = u), e.compositeRule = s.compositeRule = w, r += " if (" + a + ") {   ";
      var d = d || [];
      d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var E = r;
      r = d.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else {  errors = " + S + "; if (vErrors !== null) { if (" + S + ") vErrors.length = " + S + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      r += "  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", o && (r += " if (false) { ");
    return r;
  }), Ia;
}
var Oa, Gl;
function sp() {
  return Gl || (Gl = 1, Oa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = "errs__" + i, a = e.util.copy(e), w = "";
    a.level++;
    var u = "valid" + a.level, d = a.baseId, E = "prevValid" + i, _ = "passingSchemas" + i;
    r += "var " + s + " = errors , " + E + " = false , " + S + " = false , " + _ + " = null; ";
    var I = e.compositeRule;
    e.compositeRule = a.compositeRule = !0;
    var P = f;
    if (P)
      for (var D, x = -1, q = P.length - 1; x < q; )
        D = P[x += 1], (e.opts.strictKeywords ? typeof D == "object" && Object.keys(D).length > 0 || D === !1 : e.util.schemaHasRules(D, e.RULES.all)) ? (a.schema = D, a.schemaPath = b + "[" + x + "]", a.errSchemaPath = A + "/" + x, r += "  " + e.validate(a) + " ", a.baseId = d) : r += " var " + u + " = true; ", x && (r += " if (" + u + " && " + E + ") { " + S + " = false; " + _ + " = [" + _ + ", " + x + "]; } else { ", w += "}"), r += " if (" + u + ") { " + S + " = " + E + " = true; " + _ + " = " + x + "; }";
    return e.compositeRule = a.compositeRule = I, r += "" + w + "if (!" + S + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { passingSchemas: " + _ + " } ", e.opts.messages !== !1 && (r += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && o && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += "} else {  errors = " + s + "; if (vErrors !== null) { if (" + s + ") vErrors.length = " + s + "; else vErrors = null; }", e.opts.allErrors && (r += " } "), r;
  }), Oa;
}
var xa, Zl;
function fp() {
  return Zl || (Zl = 1, xa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = e.opts.$data && f && f.$data, a;
    s ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", a = "schema" + i) : a = f;
    var w = e.opts.regExp ? "regExp" : "new RegExp";
    if (s)
      r += " var " + S + " = true; try { " + S + " = " + w + "(" + a + ").test(" + v + "); } catch(e) { " + S + " = false; } if ( ", s && (r += " (" + a + " !== undefined && typeof " + a + " != 'string') || "), r += " !" + S + ") {";
    else {
      var u = e.usePattern(f);
      r += " if ( ", s && (r += " (" + a + " !== undefined && typeof " + a + " != 'string') || "), r += " !" + u + ".test(" + v + ") ) {";
    }
    var d = d || [];
    d.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { pattern:  ", s ? r += "" + a : r += "" + e.util.toQuotedString(f), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match pattern "`, s ? r += "' + " + a + " + '" : r += "" + e.util.escapeQuotes(f), r += `"' `), e.opts.verbose && (r += " , schema:  ", s ? r += "validate.schema" + b : r += "" + e.util.toQuotedString(f), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
    var E = r;
    return r = d.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", o && (r += " else { "), r;
  }), xa;
}
var Fa, Kl;
function lp() {
  return Kl || (Kl = 1, Fa = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "errs__" + i, s = e.util.copy(e), a = "";
    s.level++;
    var w = "valid" + s.level, u = "key" + i, d = "idx" + i, E = s.dataLevel = e.dataLevel + 1, _ = "data" + E, I = "dataProperties" + i, P = Object.keys(f || {}).filter(ue), D = e.schema.patternProperties || {}, x = Object.keys(D).filter(ue), q = e.schema.additionalProperties, K = P.length || x.length, L = q === !1, z = typeof q == "object" && Object.keys(q).length, y = e.opts.removeAdditional, F = L || z || y, ie = e.opts.ownProperties, ce = e.baseId, _e = e.schema.required;
    if (_e && !(e.opts.$data && _e.$data) && _e.length < e.opts.loopRequired)
      var be = e.util.toHash(_e);
    function ue(qe) {
      return qe !== "__proto__";
    }
    if (r += "var " + S + " = errors;var " + w + " = true;", ie && (r += " var " + I + " = undefined;"), F) {
      if (ie ? r += " " + I + " = " + I + " || Object.keys(" + v + "); for (var " + d + "=0; " + d + "<" + I + ".length; " + d + "++) { var " + u + " = " + I + "[" + d + "]; " : r += " for (var " + u + " in " + v + ") { ", K) {
        if (r += " var isAdditional" + i + " = !(false ", P.length)
          if (P.length > 8)
            r += " || validate.schema" + b + ".hasOwnProperty(" + u + ") ";
          else {
            var le = P;
            if (le)
              for (var k, he = -1, X = le.length - 1; he < X; )
                k = le[he += 1], r += " || " + u + " == " + e.util.toQuotedString(k) + " ";
          }
        if (x.length) {
          var Q = x;
          if (Q)
            for (var H, se = -1, O = Q.length - 1; se < O; )
              H = Q[se += 1], r += " || " + e.usePattern(H) + ".test(" + u + ") ";
        }
        r += " ); if (isAdditional" + i + ") { ";
      }
      if (y == "all")
        r += " delete " + v + "[" + u + "]; ";
      else {
        var B = e.errorPath, C = "' + " + u + " + '";
        if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, u, e.opts.jsonPointers)), L)
          if (y)
            r += " delete " + v + "[" + u + "]; ";
          else {
            r += " " + w + " = false; ";
            var ee = A;
            A = e.errSchemaPath + "/additionalProperties";
            var te = te || [];
            te.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { additionalProperty: '" + C + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is an invalid additional property" : r += "should NOT have additional properties", r += "' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
            var N = r;
            r = te.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + N + "]); " : r += " validate.errors = [" + N + "]; return false; " : r += " var err = " + N + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", A = ee, o && (r += " break; ");
          }
        else if (z)
          if (y == "failing") {
            r += " var " + S + " = errors;  ";
            var j = e.compositeRule;
            e.compositeRule = s.compositeRule = !0, s.schema = q, s.schemaPath = e.schemaPath + ".additionalProperties", s.errSchemaPath = e.errSchemaPath + "/additionalProperties", s.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, u, e.opts.jsonPointers);
            var W = v + "[" + u + "]";
            s.dataPathArr[E] = u;
            var oe = e.validate(s);
            s.baseId = ce, e.util.varOccurences(oe, _) < 2 ? r += " " + e.util.varReplace(oe, _, W) + " " : r += " var " + _ + " = " + W + "; " + oe + " ", r += " if (!" + w + ") { errors = " + S + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + v + "[" + u + "]; }  ", e.compositeRule = s.compositeRule = j;
          } else {
            s.schema = q, s.schemaPath = e.schemaPath + ".additionalProperties", s.errSchemaPath = e.errSchemaPath + "/additionalProperties", s.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, u, e.opts.jsonPointers);
            var W = v + "[" + u + "]";
            s.dataPathArr[E] = u;
            var oe = e.validate(s);
            s.baseId = ce, e.util.varOccurences(oe, _) < 2 ? r += " " + e.util.varReplace(oe, _, W) + " " : r += " var " + _ + " = " + W + "; " + oe + " ", o && (r += " if (!" + w + ") break; ");
          }
        e.errorPath = B;
      }
      K && (r += " } "), r += " }  ", o && (r += " if (" + w + ") { ", a += "}");
    }
    var we = e.opts.useDefaults && !e.compositeRule;
    if (P.length) {
      var Se = P;
      if (Se)
        for (var k, Re = -1, Oe = Se.length - 1; Re < Oe; ) {
          k = Se[Re += 1];
          var re = f[k];
          if (e.opts.strictKeywords ? typeof re == "object" && Object.keys(re).length > 0 || re === !1 : e.util.schemaHasRules(re, e.RULES.all)) {
            var De = e.util.getProperty(k), W = v + De, Le = we && re.default !== void 0;
            s.schema = re, s.schemaPath = b + De, s.errSchemaPath = A + "/" + e.util.escapeFragment(k), s.errorPath = e.util.getPath(e.errorPath, k, e.opts.jsonPointers), s.dataPathArr[E] = e.util.toQuotedString(k);
            var oe = e.validate(s);
            if (s.baseId = ce, e.util.varOccurences(oe, _) < 2) {
              oe = e.util.varReplace(oe, _, W);
              var Pe = W;
            } else {
              var Pe = _;
              r += " var " + _ + " = " + W + "; ";
            }
            if (Le)
              r += " " + oe + " ";
            else {
              if (be && be[k]) {
                r += " if ( " + Pe + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += ") { " + w + " = false; ";
                var B = e.errorPath, ee = A, $e = e.util.escapeQuotes(k);
                e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(B, k, e.opts.jsonPointers)), A = e.errSchemaPath + "/required";
                var te = te || [];
                te.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + $e + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + $e + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
                var N = r;
                r = te.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + N + "]); " : r += " validate.errors = [" + N + "]; return false; " : r += " var err = " + N + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", A = ee, e.errorPath = B, r += " } else { ";
              } else
                o ? (r += " if ( " + Pe + " === undefined ", ie && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += ") { " + w + " = true; } else { ") : (r += " if (" + Pe + " !== undefined ", ie && (r += " &&   Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(k) + "') "), r += " ) { ");
              r += " " + oe + " } ";
            }
          }
          o && (r += " if (" + w + ") { ", a += "}");
        }
    }
    if (x.length) {
      var ve = x;
      if (ve)
        for (var H, Ee = -1, je = ve.length - 1; Ee < je; ) {
          H = ve[Ee += 1];
          var re = D[H];
          if (e.opts.strictKeywords ? typeof re == "object" && Object.keys(re).length > 0 || re === !1 : e.util.schemaHasRules(re, e.RULES.all)) {
            s.schema = re, s.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(H), s.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(H), ie ? r += " " + I + " = " + I + " || Object.keys(" + v + "); for (var " + d + "=0; " + d + "<" + I + ".length; " + d + "++) { var " + u + " = " + I + "[" + d + "]; " : r += " for (var " + u + " in " + v + ") { ", r += " if (" + e.usePattern(H) + ".test(" + u + ")) { ", s.errorPath = e.util.getPathExpr(e.errorPath, u, e.opts.jsonPointers);
            var W = v + "[" + u + "]";
            s.dataPathArr[E] = u;
            var oe = e.validate(s);
            s.baseId = ce, e.util.varOccurences(oe, _) < 2 ? r += " " + e.util.varReplace(oe, _, W) + " " : r += " var " + _ + " = " + W + "; " + oe + " ", o && (r += " if (!" + w + ") break; "), r += " } ", o && (r += " else " + w + " = true; "), r += " }  ", o && (r += " if (" + w + ") { ", a += "}");
          }
        }
    }
    return o && (r += " " + a + " if (" + S + " == errors) {"), r;
  }), Fa;
}
var Da, Yl;
function up() {
  return Yl || (Yl = 1, Da = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "errs__" + i, s = e.util.copy(e), a = "";
    s.level++;
    var w = "valid" + s.level;
    if (r += "var " + S + " = errors;", e.opts.strictKeywords ? typeof f == "object" && Object.keys(f).length > 0 || f === !1 : e.util.schemaHasRules(f, e.RULES.all)) {
      s.schema = f, s.schemaPath = b, s.errSchemaPath = A;
      var u = "key" + i, d = "idx" + i, E = "i" + i, _ = "' + " + u + " + '", I = s.dataLevel = e.dataLevel + 1, P = "data" + I, D = "dataProperties" + i, x = e.opts.ownProperties, q = e.baseId;
      x && (r += " var " + D + " = undefined; "), x ? r += " " + D + " = " + D + " || Object.keys(" + v + "); for (var " + d + "=0; " + d + "<" + D + ".length; " + d + "++) { var " + u + " = " + D + "[" + d + "]; " : r += " for (var " + u + " in " + v + ") { ", r += " var startErrs" + i + " = errors; ";
      var K = u, L = e.compositeRule;
      e.compositeRule = s.compositeRule = !0;
      var z = e.validate(s);
      s.baseId = q, e.util.varOccurences(z, P) < 2 ? r += " " + e.util.varReplace(z, P, K) + " " : r += " var " + P + " = " + K + "; " + z + " ", e.compositeRule = s.compositeRule = L, r += " if (!" + w + ") { for (var " + E + "=startErrs" + i + "; " + E + "<errors; " + E + "++) { vErrors[" + E + "].propertyName = " + u + "; }   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { propertyName: '" + _ + "' } ", e.opts.messages !== !1 && (r += " , message: 'property name \\'" + _ + "\\' is invalid' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && o && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), o && (r += " break; "), r += " } }";
    }
    return o && (r += " " + a + " if (" + S + " == errors) {"), r;
  }), Da;
}
var Na, Ql;
function cp() {
  return Ql || (Ql = 1, Na = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = e.opts.$data && f && f.$data;
    s && (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ");
    var a = "schema" + i;
    if (!s)
      if (f.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
        var w = [], u = f;
        if (u)
          for (var d, E = -1, _ = u.length - 1; E < _; ) {
            d = u[E += 1];
            var I = e.schema.properties[d];
            I && (e.opts.strictKeywords ? typeof I == "object" && Object.keys(I).length > 0 || I === !1 : e.util.schemaHasRules(I, e.RULES.all)) || (w[w.length] = d);
          }
      } else
        var w = f;
    if (s || w.length) {
      var P = e.errorPath, D = s || w.length >= e.opts.loopRequired, x = e.opts.ownProperties;
      if (o)
        if (r += " var missing" + i + "; ", D) {
          s || (r += " var " + a + " = validate.schema" + b + "; ");
          var q = "i" + i, K = "schema" + i + "[" + q + "]", L = "' + " + K + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(P, K, e.opts.jsonPointers)), r += " var " + S + " = true; ", s && (r += " if (schema" + i + " === undefined) " + S + " = true; else if (!Array.isArray(schema" + i + ")) " + S + " = false; else {"), r += " for (var " + q + " = 0; " + q + " < " + a + ".length; " + q + "++) { " + S + " = " + v + "[" + a + "[" + q + "]] !== undefined ", x && (r += " &&   Object.prototype.hasOwnProperty.call(" + v + ", " + a + "[" + q + "]) "), r += "; if (!" + S + ") break; } ", s && (r += "  }  "), r += "  if (!" + S + ") {   ";
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + L + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + L + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var y = r;
          r = z.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        } else {
          r += " if ( ";
          var F = w;
          if (F)
            for (var ie, q = -1, ce = F.length - 1; q < ce; ) {
              ie = F[q += 1], q && (r += " || ");
              var _e = e.util.getProperty(ie), be = v + _e;
              r += " ( ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") && (missing" + i + " = " + e.util.toQuotedString(e.opts.jsonPointers ? ie : _e) + ") ) ";
            }
          r += ") {  ";
          var K = "missing" + i, L = "' + " + K + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(P, K, !0) : P + " + " + K);
          var z = z || [];
          z.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + L + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + L + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
          var y = r;
          r = z.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + y + "]); " : r += " validate.errors = [" + y + "]; return false; " : r += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        }
      else if (D) {
        s || (r += " var " + a + " = validate.schema" + b + "; ");
        var q = "i" + i, K = "schema" + i + "[" + q + "]", L = "' + " + K + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(P, K, e.opts.jsonPointers)), s && (r += " if (" + a + " && !Array.isArray(" + a + ")) {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + L + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + L + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + a + " !== undefined) { "), r += " for (var " + q + " = 0; " + q + " < " + a + ".length; " + q + "++) { if (" + v + "[" + a + "[" + q + "]] === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", " + a + "[" + q + "]) "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + L + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + L + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", s && (r += "  }  ");
      } else {
        var ue = w;
        if (ue)
          for (var ie, le = -1, k = ue.length - 1; le < k; ) {
            ie = ue[le += 1];
            var _e = e.util.getProperty(ie), L = e.util.escapeQuotes(ie), be = v + _e;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(P, ie, e.opts.jsonPointers)), r += " if ( " + be + " === undefined ", x && (r += " || ! Object.prototype.hasOwnProperty.call(" + v + ", '" + e.util.escapeQuotes(ie) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { missingProperty: '" + L + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + L + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      e.errorPath = P;
    } else o && (r += " if (true) {");
    return r;
  }), Na;
}
var Ba, Jl;
function dp() {
  return Jl || (Jl = 1, Ba = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v = "data" + (p || ""), S = "valid" + i, s = e.opts.$data && f && f.$data, a;
    if (s ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", a = "schema" + i) : a = f, (f || s) && e.opts.uniqueItems !== !1) {
      s && (r += " var " + S + "; if (" + a + " === false || " + a + " === undefined) " + S + " = true; else if (typeof " + a + " != 'boolean') " + S + " = false; else { "), r += " var i = " + v + ".length , " + S + " = true , j; if (i > 1) { ";
      var w = e.schema.items && e.schema.items.type, u = Array.isArray(w);
      if (!w || w == "object" || w == "array" || u && (w.indexOf("object") >= 0 || w.indexOf("array") >= 0))
        r += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + v + "[i], " + v + "[j])) { " + S + " = false; break outer; } } } ";
      else {
        r += " var itemIndices = {}, item; for (;i--;) { var item = " + v + "[i]; ";
        var d = "checkDataType" + (u ? "s" : "");
        r += " if (" + e.util[d](w, "item", e.opts.strictNumbers, !0) + ") continue; ", u && (r += ` if (typeof item == 'string') item = '"' + item; `), r += " if (typeof itemIndices[item] == 'number') { " + S + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
      }
      r += " } ", s && (r += "  }  "), r += " if (!" + S + ") {   ";
      var E = E || [];
      E.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (r += " , schema:  ", s ? r += "validate.schema" + b : r += "" + f, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + v + " "), r += " } ") : r += " {} ";
      var _ = r;
      r = E.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + _ + "]); " : r += " validate.errors = [" + _ + "]; return false; " : r += " var err = " + _ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", o && (r += " else { ");
    } else
      o && (r += " if (true) { ");
    return r;
  }), Ba;
}
var La, Xl;
function hp() {
  return Xl || (Xl = 1, La = {
    $ref: Zh(),
    allOf: Kh(),
    anyOf: Yh(),
    $comment: Qh(),
    const: Jh(),
    contains: Xh(),
    dependencies: ep(),
    enum: rp(),
    format: tp(),
    if: np(),
    items: ip(),
    maximum: Ml(),
    minimum: Ml(),
    maxItems: ql(),
    minItems: ql(),
    maxLength: Ul(),
    minLength: Ul(),
    maxProperties: Wl(),
    minProperties: Wl(),
    multipleOf: ap(),
    not: op(),
    oneOf: sp(),
    pattern: fp(),
    properties: lp(),
    propertyNames: up(),
    required: cp(),
    uniqueItems: dp(),
    validate: Dc()
  }), La;
}
var Ca, eu;
function pp() {
  if (eu) return Ca;
  eu = 1;
  var t = hp(), e = yt().toHash;
  return Ca = function() {
    var c = [
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
    ], r = ["type", "$comment"], i = [
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
    ], p = ["number", "integer", "string", "array", "object", "boolean", "null"];
    return c.all = e(r), c.types = e(p), c.forEach(function(f) {
      f.rules = f.rules.map(function(b) {
        var A;
        if (typeof b == "object") {
          var o = Object.keys(b)[0];
          A = b[o], b = o, A.forEach(function(S) {
            r.push(S), c.all[S] = !0;
          });
        }
        r.push(b);
        var v = c.all[b] = {
          keyword: b,
          code: t[b],
          implements: A
        };
        return v;
      }), c.all.$comment = {
        keyword: "$comment",
        code: t.$comment
      }, f.type && (c.types[f.type] = f);
    }), c.keywords = e(r.concat(i)), c.custom = {}, c;
  }, Ca;
}
var ja, ru;
function yp() {
  if (ru) return ja;
  ru = 1;
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
  return ja = function(e, l) {
    for (var c = 0; c < l.length; c++) {
      e = JSON.parse(JSON.stringify(e));
      var r = l[c].split("/"), i = e, p;
      for (p = 1; p < r.length; p++)
        i = i[r[p]];
      for (p = 0; p < t.length; p++) {
        var f = t[p], b = i[f];
        b && (i[f] = {
          anyOf: [
            b,
            { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
          ]
        });
      }
    }
    return e;
  }, ja;
}
var Ma, tu;
function vp() {
  if (tu) return Ma;
  tu = 1;
  var t = Qo().MissingRef;
  Ma = e;
  function e(l, c, r) {
    var i = this;
    if (typeof this._opts.loadSchema != "function")
      throw new Error("options.loadSchema should be a function");
    typeof c == "function" && (r = c, c = void 0);
    var p = f(l).then(function() {
      var A = i._addSchema(l, void 0, c);
      return A.validate || b(A);
    });
    return r && p.then(
      function(A) {
        r(null, A);
      },
      r
    ), p;
    function f(A) {
      var o = A.$schema;
      return o && !i.getSchema(o) ? e.call(i, { $ref: o }, !0) : Promise.resolve();
    }
    function b(A) {
      try {
        return i._compile(A);
      } catch (v) {
        if (v instanceof t) return o(v);
        throw v;
      }
      function o(v) {
        var S = v.missingSchema;
        if (w(S)) throw new Error("Schema " + S + " is loaded but " + v.missingRef + " cannot be resolved");
        var s = i._loadingSchemas[S];
        return s || (s = i._loadingSchemas[S] = i._opts.loadSchema(S), s.then(a, a)), s.then(function(u) {
          if (!w(S))
            return f(u).then(function() {
              w(S) || i.addSchema(u, S, void 0, c);
            });
        }).then(function() {
          return b(A);
        });
        function a() {
          delete i._loadingSchemas[S];
        }
        function w(u) {
          return i._refs[u] || i._schemas[u];
        }
      }
    }
  }
  return Ma;
}
var ka, nu;
function gp() {
  return nu || (nu = 1, ka = function(e, l, c) {
    var r = " ", i = e.level, p = e.dataLevel, f = e.schema[l], b = e.schemaPath + e.util.getProperty(l), A = e.errSchemaPath + "/" + l, o = !e.opts.allErrors, v, S = "data" + (p || ""), s = "valid" + i, a = "errs__" + i, w = e.opts.$data && f && f.$data, u;
    w ? (r += " var schema" + i + " = " + e.util.getData(f.$data, p, e.dataPathArr) + "; ", u = "schema" + i) : u = f;
    var d = this, E = "definition" + i, _ = d.definition, I = "", P, D, x, q, K;
    if (w && _.$data) {
      K = "keywordValidate" + i;
      var L = _.validateSchema;
      r += " var " + E + " = RULES.custom['" + l + "'].definition; var " + K + " = " + E + ".validate;";
    } else {
      if (q = e.useCustomRule(d, f, e.schema, e), !q) return;
      u = "validate.schema" + b, K = q.code, P = _.compile, D = _.inline, x = _.macro;
    }
    var z = K + ".errors", y = "i" + i, F = "ruleErr" + i, ie = _.async;
    if (ie && !e.async) throw new Error("async keyword in sync schema");
    if (D || x || (r += "" + z + " = null;"), r += "var " + a + " = errors;var " + s + ";", w && _.$data && (I += "}", r += " if (" + u + " === undefined) { " + s + " = true; } else { ", L && (I += "}", r += " " + s + " = " + E + ".validateSchema(" + u + "); if (" + s + ") { ")), D)
      _.statements ? r += " " + q.validate + " " : r += " " + s + " = " + q.validate + "; ";
    else if (x) {
      var ce = e.util.copy(e), I = "";
      ce.level++;
      var _e = "valid" + ce.level;
      ce.schema = q.validate, ce.schemaPath = "";
      var be = e.compositeRule;
      e.compositeRule = ce.compositeRule = !0;
      var ue = e.validate(ce).replace(/validate\.schema/g, K);
      e.compositeRule = ce.compositeRule = be, r += " " + ue;
    } else {
      var le = le || [];
      le.push(r), r = "", r += "  " + K + ".call( ", e.opts.passContext ? r += "this" : r += "self", P || _.schema === !1 ? r += " , " + S + " " : r += " , " + u + " , " + S + " , validate.schema" + e.schemaPath + " ", r += " , (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var k = p ? "data" + (p - 1 || "") : "parentData", he = p ? e.dataPathArr[p] : "parentDataProperty";
      r += " , " + k + " , " + he + " , rootData )  ";
      var X = r;
      r = le.pop(), _.errors === !1 ? (r += " " + s + " = ", ie && (r += "await "), r += "" + X + "; ") : ie ? (z = "customErrors" + i, r += " var " + z + " = null; try { " + s + " = await " + X + "; } catch (e) { " + s + " = false; if (e instanceof ValidationError) " + z + " = e.errors; else throw e; } ") : r += " " + z + " = null; " + s + " = " + X + "; ";
    }
    if (_.modifying && (r += " if (" + k + ") " + S + " = " + k + "[" + he + "];"), r += "" + I, _.valid)
      o && (r += " if (true) { ");
    else {
      r += " if ( ", _.valid === void 0 ? (r += " !", x ? r += "" + _e : r += "" + s) : r += " " + !_.valid + " ", r += ") { ", v = d.keyword;
      var le = le || [];
      le.push(r), r = "";
      var le = le || [];
      le.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (v || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { keyword: '" + d.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + d.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + S + " "), r += " } ") : r += " {} ";
      var Q = r;
      r = le.pop(), !e.compositeRule && o ? e.async ? r += " throw new ValidationError([" + Q + "]); " : r += " validate.errors = [" + Q + "]; return false; " : r += " var err = " + Q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      var H = r;
      r = le.pop(), D ? _.errors ? _.errors != "full" && (r += "  for (var " + y + "=" + a + "; " + y + "<errors; " + y + "++) { var " + F + " = vErrors[" + y + "]; if (" + F + ".dataPath === undefined) " + F + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + F + ".schemaPath === undefined) { " + F + '.schemaPath = "' + A + '"; } ', e.opts.verbose && (r += " " + F + ".schema = " + u + "; " + F + ".data = " + S + "; "), r += " } ") : _.errors === !1 ? r += " " + H + " " : (r += " if (" + a + " == errors) { " + H + " } else {  for (var " + y + "=" + a + "; " + y + "<errors; " + y + "++) { var " + F + " = vErrors[" + y + "]; if (" + F + ".dataPath === undefined) " + F + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + F + ".schemaPath === undefined) { " + F + '.schemaPath = "' + A + '"; } ', e.opts.verbose && (r += " " + F + ".schema = " + u + "; " + F + ".data = " + S + "; "), r += " } } ") : x ? (r += "   var err =   ", e.createErrors !== !1 ? (r += " { keyword: '" + (v || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(A) + " , params: { keyword: '" + d.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + d.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + b + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + S + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && o && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; ")) : _.errors === !1 ? r += " " + H + " " : (r += " if (Array.isArray(" + z + ")) { if (vErrors === null) vErrors = " + z + "; else vErrors = vErrors.concat(" + z + "); errors = vErrors.length;  for (var " + y + "=" + a + "; " + y + "<errors; " + y + "++) { var " + F + " = vErrors[" + y + "]; if (" + F + ".dataPath === undefined) " + F + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + F + '.schemaPath = "' + A + '";  ', e.opts.verbose && (r += " " + F + ".schema = " + u + "; " + F + ".data = " + S + "; "), r += " } } else { " + H + " } "), r += " } ", o && (r += " else { ");
    }
    return r;
  }), ka;
}
const mp = "http://json-schema.org/draft-07/schema#", bp = "http://json-schema.org/draft-07/schema#", wp = "Core schema meta-schema", _p = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Ep = ["object", "boolean"], Sp = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Nc = {
  $schema: mp,
  $id: bp,
  title: wp,
  definitions: _p,
  type: Ep,
  properties: Sp,
  default: !0
};
var qa, iu;
function Rp() {
  if (iu) return qa;
  iu = 1;
  var t = Nc;
  return qa = {
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
  }, qa;
}
var $a, au;
function Ap() {
  if (au) return $a;
  au = 1;
  var t = /^[a-z_$][a-z0-9_$-]*$/i, e = gp(), l = Rp();
  $a = {
    add: c,
    get: r,
    remove: i,
    validate: p
  };
  function c(f, b) {
    var A = this.RULES;
    if (A.keywords[f])
      throw new Error("Keyword " + f + " is already defined");
    if (!t.test(f))
      throw new Error("Keyword " + f + " is not a valid identifier");
    if (b) {
      this.validateKeyword(b, !0);
      var o = b.type;
      if (Array.isArray(o))
        for (var v = 0; v < o.length; v++)
          s(f, o[v], b);
      else
        s(f, o, b);
      var S = b.metaSchema;
      S && (b.$data && this._opts.$data && (S = {
        anyOf: [
          S,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      }), b.validateSchema = this.compile(S, !0));
    }
    A.keywords[f] = A.all[f] = !0;
    function s(a, w, u) {
      for (var d, E = 0; E < A.length; E++) {
        var _ = A[E];
        if (_.type == w) {
          d = _;
          break;
        }
      }
      d || (d = { type: w, rules: [] }, A.push(d));
      var I = {
        keyword: a,
        definition: u,
        custom: !0,
        code: e,
        implements: u.implements
      };
      d.rules.push(I), A.custom[a] = I;
    }
    return this;
  }
  function r(f) {
    var b = this.RULES.custom[f];
    return b ? b.definition : this.RULES.keywords[f] || !1;
  }
  function i(f) {
    var b = this.RULES;
    delete b.keywords[f], delete b.all[f], delete b.custom[f];
    for (var A = 0; A < b.length; A++)
      for (var o = b[A].rules, v = 0; v < o.length; v++)
        if (o[v].keyword == f) {
          o.splice(v, 1);
          break;
        }
    return this;
  }
  function p(f, b) {
    p.errors = null;
    var A = this._validateKeyword = this._validateKeyword || this.compile(l, !0);
    if (A(f)) return !0;
    if (p.errors = A.errors, b)
      throw new Error("custom keyword definition is invalid: " + this.errorsText(A.errors));
    return !1;
  }
  return $a;
}
const Pp = "http://json-schema.org/draft-07/schema#", Tp = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Ip = "Meta-schema for $data reference (JSON Schema extension proposal)", Op = "object", xp = ["$data"], Fp = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Dp = !1, Np = {
  $schema: Pp,
  $id: Tp,
  description: Ip,
  type: Op,
  required: xp,
  properties: Fp,
  additionalProperties: Dp
};
var Ua, ou;
function Bp() {
  if (ou) return Ua;
  ou = 1;
  var t = Hh(), e = Yo(), l = Vh(), c = xc(), r = Fc(), i = Gh(), p = pp(), f = yp(), b = yt();
  Ua = a, a.prototype.validate = w, a.prototype.compile = u, a.prototype.addSchema = d, a.prototype.addMetaSchema = E, a.prototype.validateSchema = _, a.prototype.getSchema = P, a.prototype.removeSchema = q, a.prototype.addFormat = be, a.prototype.errorsText = _e, a.prototype._addSchema = L, a.prototype._compile = z, a.prototype.compileAsync = vp();
  var A = Ap();
  a.prototype.addKeyword = A.add, a.prototype.getKeyword = A.get, a.prototype.removeKeyword = A.remove, a.prototype.validateKeyword = A.validate;
  var o = Qo();
  a.ValidationError = o.Validation, a.MissingRefError = o.MissingRef, a.$dataMetaSchema = f;
  var v = "http://json-schema.org/draft-07/schema", S = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], s = ["/properties"];
  function a(O) {
    if (!(this instanceof a)) return new a(O);
    O = this._opts = b.copy(O) || {}, H(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = i(O.format), this._cache = O.cache || new l(), this._loadingSchemas = {}, this._compilations = [], this.RULES = p(), this._getId = y(O), O.loopRequired = O.loopRequired || 1 / 0, O.errorDataPath == "property" && (O._errorDataPathProperty = !0), O.serialize === void 0 && (O.serialize = r), this._metaOpts = Q(this), O.formats && k(this), O.keywords && he(this), ue(this), typeof O.meta == "object" && this.addMetaSchema(O.meta), O.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), le(this);
  }
  function w(O, B) {
    var C;
    if (typeof O == "string") {
      if (C = this.getSchema(O), !C) throw new Error('no schema with key or ref "' + O + '"');
    } else {
      var ee = this._addSchema(O);
      C = ee.validate || this._compile(ee);
    }
    var te = C(B);
    return C.$async !== !0 && (this.errors = C.errors), te;
  }
  function u(O, B) {
    var C = this._addSchema(O, void 0, B);
    return C.validate || this._compile(C);
  }
  function d(O, B, C, ee) {
    if (Array.isArray(O)) {
      for (var te = 0; te < O.length; te++) this.addSchema(O[te], void 0, C, ee);
      return this;
    }
    var N = this._getId(O);
    if (N !== void 0 && typeof N != "string")
      throw new Error("schema id must be string");
    return B = e.normalizeId(B || N), X(this, B), this._schemas[B] = this._addSchema(O, C, ee, !0), this;
  }
  function E(O, B, C) {
    return this.addSchema(O, B, C, !0), this;
  }
  function _(O, B) {
    var C = O.$schema;
    if (C !== void 0 && typeof C != "string")
      throw new Error("$schema must be a string");
    if (C = C || this._opts.defaultMeta || I(this), !C)
      return this.logger.warn("meta-schema not available"), this.errors = null, !0;
    var ee = this.validate(C, O);
    if (!ee && B) {
      var te = "schema is invalid: " + this.errorsText();
      if (this._opts.validateSchema == "log") this.logger.error(te);
      else throw new Error(te);
    }
    return ee;
  }
  function I(O) {
    var B = O._opts.meta;
    return O._opts.defaultMeta = typeof B == "object" ? O._getId(B) || B : O.getSchema(v) ? v : void 0, O._opts.defaultMeta;
  }
  function P(O) {
    var B = x(this, O);
    switch (typeof B) {
      case "object":
        return B.validate || this._compile(B);
      case "string":
        return this.getSchema(B);
      case "undefined":
        return D(this, O);
    }
  }
  function D(O, B) {
    var C = e.schema.call(O, { schema: {} }, B);
    if (C) {
      var ee = C.schema, te = C.root, N = C.baseId, j = t.call(O, ee, te, void 0, N);
      return O._fragments[B] = new c({
        ref: B,
        fragment: !0,
        schema: ee,
        root: te,
        baseId: N,
        validate: j
      }), j;
    }
  }
  function x(O, B) {
    return B = e.normalizeId(B), O._schemas[B] || O._refs[B] || O._fragments[B];
  }
  function q(O) {
    if (O instanceof RegExp)
      return K(this, this._schemas, O), K(this, this._refs, O), this;
    switch (typeof O) {
      case "undefined":
        return K(this, this._schemas), K(this, this._refs), this._cache.clear(), this;
      case "string":
        var B = x(this, O);
        return B && this._cache.del(B.cacheKey), delete this._schemas[O], delete this._refs[O], this;
      case "object":
        var C = this._opts.serialize, ee = C ? C(O) : O;
        this._cache.del(ee);
        var te = this._getId(O);
        te && (te = e.normalizeId(te), delete this._schemas[te], delete this._refs[te]);
    }
    return this;
  }
  function K(O, B, C) {
    for (var ee in B) {
      var te = B[ee];
      !te.meta && (!C || C.test(ee)) && (O._cache.del(te.cacheKey), delete B[ee]);
    }
  }
  function L(O, B, C, ee) {
    if (typeof O != "object" && typeof O != "boolean")
      throw new Error("schema should be object or boolean");
    var te = this._opts.serialize, N = te ? te(O) : O, j = this._cache.get(N);
    if (j) return j;
    ee = ee || this._opts.addUsedSchema !== !1;
    var W = e.normalizeId(this._getId(O));
    W && ee && X(this, W);
    var oe = this._opts.validateSchema !== !1 && !B, we;
    oe && !(we = W && W == e.normalizeId(O.$schema)) && this.validateSchema(O, !0);
    var Se = e.ids.call(this, O), Re = new c({
      id: W,
      schema: O,
      localRefs: Se,
      cacheKey: N,
      meta: C
    });
    return W[0] != "#" && ee && (this._refs[W] = Re), this._cache.put(N, Re), oe && we && this.validateSchema(O, !0), Re;
  }
  function z(O, B) {
    if (O.compiling)
      return O.validate = te, te.schema = O.schema, te.errors = null, te.root = B || te, O.schema.$async === !0 && (te.$async = !0), te;
    O.compiling = !0;
    var C;
    O.meta && (C = this._opts, this._opts = this._metaOpts);
    var ee;
    try {
      ee = t.call(this, O.schema, B, O.localRefs);
    } catch (N) {
      throw delete O.validate, N;
    } finally {
      O.compiling = !1, O.meta && (this._opts = C);
    }
    return O.validate = ee, O.refs = ee.refs, O.refVal = ee.refVal, O.root = ee.root, ee;
    function te() {
      var N = O.validate, j = N.apply(this, arguments);
      return te.errors = N.errors, j;
    }
  }
  function y(O) {
    switch (O.schemaId) {
      case "auto":
        return ce;
      case "id":
        return F;
      default:
        return ie;
    }
  }
  function F(O) {
    return O.$id && this.logger.warn("schema $id ignored", O.$id), O.id;
  }
  function ie(O) {
    return O.id && this.logger.warn("schema id ignored", O.id), O.$id;
  }
  function ce(O) {
    if (O.$id && O.id && O.$id != O.id)
      throw new Error("schema $id is different from id");
    return O.$id || O.id;
  }
  function _e(O, B) {
    if (O = O || this.errors, !O) return "No errors";
    B = B || {};
    for (var C = B.separator === void 0 ? ", " : B.separator, ee = B.dataVar === void 0 ? "data" : B.dataVar, te = "", N = 0; N < O.length; N++) {
      var j = O[N];
      j && (te += ee + j.dataPath + " " + j.message + C);
    }
    return te.slice(0, -C.length);
  }
  function be(O, B) {
    return typeof B == "string" && (B = new RegExp(B)), this._formats[O] = B, this;
  }
  function ue(O) {
    var B;
    if (O._opts.$data && (B = Np, O.addMetaSchema(B, B.$id, !0)), O._opts.meta !== !1) {
      var C = Nc;
      O._opts.$data && (C = f(C, s)), O.addMetaSchema(C, v, !0), O._refs["http://json-schema.org/schema"] = v;
    }
  }
  function le(O) {
    var B = O._opts.schemas;
    if (B)
      if (Array.isArray(B)) O.addSchema(B);
      else for (var C in B) O.addSchema(B[C], C);
  }
  function k(O) {
    for (var B in O._opts.formats) {
      var C = O._opts.formats[B];
      O.addFormat(B, C);
    }
  }
  function he(O) {
    for (var B in O._opts.keywords) {
      var C = O._opts.keywords[B];
      O.addKeyword(B, C);
    }
  }
  function X(O, B) {
    if (O._schemas[B] || O._refs[B])
      throw new Error('schema with key or id "' + B + '" already exists');
  }
  function Q(O) {
    for (var B = b.copy(O._opts), C = 0; C < S.length; C++)
      delete B[S[C]];
    return B;
  }
  function H(O) {
    var B = O._opts.logger;
    if (B === !1)
      O.logger = { log: se, warn: se, error: se };
    else {
      if (B === void 0 && (B = console), !(typeof B == "object" && B.log && B.warn && B.error))
        throw new Error("logger must implement log, warn and error methods");
      O.logger = B;
    }
  }
  function se() {
  }
  return Ua;
}
const Lp = "definitions", Cp = { contextualizedFieldName: { type: "string", pattern: "^(this\\.)?.+$" }, dataTypeArgsCount: { oneOf: [{ $ref: "#/definitions/contextualizedFieldName" }, { type: "number" }] }, fieldName: { type: "string", pattern: "^[a-zA-Z0-9_]+$" } }, jp = "object", Mp = {
  title: Lp,
  definitions: Cp,
  type: jp
}, kp = "protocol", qp = "object", $p = { types: { type: "object", patternProperties: { "^[0-9a-zA-Z_]+$": { oneOf: [{ type: "string" }, { type: "array", items: [{ type: "string" }, { oneOf: [{ type: "object" }, { type: "array" }] }] }] } }, additionalProperties: !1 } }, Up = { "^(?!types)[a-zA-Z_]+$": { $ref: "#" } }, zp = !1, Wp = {
  title: kp,
  type: qp,
  properties: $p,
  patternProperties: Up,
  additionalProperties: zp
}, Hp = { enum: ["i8"] }, Vp = { enum: ["u8"] }, Gp = { enum: ["i16"] }, Zp = { enum: ["u16"] }, Kp = { enum: ["i32"] }, Yp = { enum: ["u32"] }, Qp = { enum: ["f32"] }, Jp = { enum: ["f64"] }, Xp = { enum: ["li8"] }, ey = { enum: ["lu8"] }, ry = { enum: ["li16"] }, ty = { enum: ["lu16"] }, ny = { enum: ["li32"] }, iy = { enum: ["lu32"] }, ay = { enum: ["lf32"] }, oy = { enum: ["lf64"] }, sy = { enum: ["i64"] }, fy = { enum: ["li64"] }, ly = { enum: ["u64"] }, uy = { enum: ["lu64"] }, cy = { enum: ["varint"] }, dy = { enum: ["varint64"] }, hy = { enum: ["varint128"] }, py = { enum: ["zigzag32"] }, yy = { enum: ["zigzag64"] }, vy = { title: "int", type: "array", items: [{ enum: ["int"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, gy = { title: "lint", type: "array", items: [{ enum: ["lint"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, my = {
  i8: Hp,
  u8: Vp,
  i16: Gp,
  u16: Zp,
  i32: Kp,
  u32: Yp,
  f32: Qp,
  f64: Jp,
  li8: Xp,
  lu8: ey,
  li16: ry,
  lu16: ty,
  li32: ny,
  lu32: iy,
  lf32: ay,
  lf64: oy,
  i64: sy,
  li64: fy,
  u64: ly,
  lu64: uy,
  varint: cy,
  varint64: dy,
  varint128: hy,
  zigzag32: py,
  zigzag64: yy,
  int: vy,
  lint: gy
}, by = { title: "pstring", type: "array", items: [{ enum: ["pstring"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["count"] }] }], additionalItems: !1 }, wy = { title: "buffer", type: "array", items: [{ enum: ["buffer"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["count"] }] }] }, _y = { title: "bitfield", type: "array", items: [{ enum: ["bitfield"] }, { type: "array", items: { type: "object", properties: { name: { $ref: "definitions#/definitions/fieldName" }, size: { type: "number" }, signed: { type: "boolean" } }, required: ["name", "size", "signed"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, Ey = { title: "bitflags", type: "array", items: [{ enum: ["bitflags"] }, { type: "object", additionalItems: !1 }], additionalItems: !1 }, Sy = { title: "mapper", type: "array", items: [{ enum: ["mapper"] }, { type: "object", properties: { type: { $ref: "dataType" }, mappings: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _]+$": { type: "string" } }, additionalProperties: !1 } }, required: ["type", "mappings"], additionalProperties: !1 }], additionalItems: !1 }, Ry = {
  pstring: by,
  buffer: wy,
  bitfield: _y,
  bitflags: Ey,
  mapper: Sy
}, Ay = { title: "array", type: "array", items: [{ enum: ["array"] }, { oneOf: [{ type: "object", properties: { type: { $ref: "dataType" }, countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["type", "countType"] }, { type: "object", properties: { type: { $ref: "dataType" }, count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["type", "count"] }] }], additionalItems: !1 }, Py = { title: "count", type: "array", items: [{ enum: ["count"] }, { type: "object", properties: { countFor: { $ref: "definitions#/definitions/contextualizedFieldName" }, type: { $ref: "dataType" } }, required: ["countFor", "type"], additionalProperties: !1 }], additionalItems: !1 }, Ty = { title: "container", type: "array", items: [{ enum: ["container"] }, { type: "array", items: { type: "object", properties: { anon: { type: "boolean" }, name: { $ref: "definitions#/definitions/fieldName" }, type: { $ref: "dataType" } }, oneOf: [{ required: ["anon"] }, { required: ["name"] }], required: ["type"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, Iy = {
  array: Ay,
  count: Py,
  container: Ty
}, Oy = { title: "option", type: "array", items: [{ enum: ["option"] }, { $ref: "dataType" }], additionalItems: !1 }, xy = {
  switch: { title: "switch", type: "array", items: [{ enum: ["switch"] }, { type: "object", properties: { compareTo: { $ref: "definitions#/definitions/contextualizedFieldName" }, compareToValue: { type: "string" }, fields: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _:/]+$": { $ref: "dataType" } }, additionalProperties: !1 }, default: { $ref: "dataType" } }, oneOf: [{ required: ["compareTo", "fields"] }, { required: ["compareToValue", "fields"] }], additionalProperties: !1 }], additionalItems: !1 },
  option: Oy
}, Fy = { enum: ["bool"] }, Dy = { title: "cstring", type: "array", items: [{ enum: ["cstring"] }, { type: "object", properties: { encoding: { type: "string" } }, additionalProperties: !1, required: [] }], additionalItems: !1 }, Ny = {
  bool: Fy,
  cstring: Dy,
  void: { enum: ["void"] }
};
var za, su;
function By() {
  if (su) return za;
  su = 1;
  const t = Bp(), e = wt();
  class l {
    constructor(r) {
      this.createAjvInstance(r), this.addDefaultTypes();
    }
    createAjvInstance(r) {
      this.typesSchemas = {}, this.compiled = !1, this.ajv = new t({ verbose: !0 }), this.ajv.addSchema(Mp, "definitions"), this.ajv.addSchema(Wp, "protocol"), r && Object.keys(r).forEach((i) => this.addType(i, r[i]));
    }
    addDefaultTypes() {
      this.addTypes(my), this.addTypes(Ry), this.addTypes(Iy), this.addTypes(xy), this.addTypes(Ny);
    }
    addTypes(r) {
      Object.keys(r).forEach((i) => this.addType(i, r[i]));
    }
    typeToSchemaName(r) {
      return r.replace("|", "_");
    }
    addType(r, i) {
      const p = this.typeToSchemaName(r);
      this.typesSchemas[p] == null && (i || (i = {
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
      }), this.typesSchemas[p] = i, this.compiled ? this.createAjvInstance(this.typesSchemas) : this.ajv.addSchema(i, p), this.ajv.removeSchema("dataType"), this.ajv.addSchema({
        title: "dataType",
        oneOf: [{ enum: ["native"] }].concat(Object.keys(this.typesSchemas).map((f) => ({ $ref: this.typeToSchemaName(f) })))
      }, "dataType"));
    }
    validateType(r) {
      let i = this.ajv.validate("dataType", r);
      if (this.compiled = !0, !i)
        throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
    }
    validateTypeGoingInside(r) {
      if (Array.isArray(r)) {
        e.ok(this.typesSchemas[this.typeToSchemaName(r[0])] != null, r + " is an undefined type");
        let i = this.ajv.validate(r[0], r);
        if (this.compiled = !0, !i)
          throw console.log(JSON.stringify(this.ajv.errors[0], null, 2)), this.ajv.errors[0].parentSchema.title == "dataType" && this.validateTypeGoingInside(this.ajv.errors[0].data), new Error("validation error");
      } else {
        if (r == "native")
          return;
        e.ok(this.typesSchemas[this.typeToSchemaName(r)] != null, r + " is an undefined type");
      }
    }
    validateProtocol(r) {
      let i = this.ajv.validate("protocol", r);
      e.ok(i, JSON.stringify(this.ajv.errors, null, 2));
      function p(f, b, A) {
        const o = new l(b.typesSchemas);
        Object.keys(f).forEach((v) => {
          v == "types" ? (Object.keys(f[v]).forEach((S) => o.addType(S)), Object.keys(f[v]).forEach((S) => {
            try {
              o.validateType(f[v][S], A + "." + v + "." + S);
            } catch {
              throw new Error("Error at " + A + "." + v + "." + S);
            }
          })) : p(f[v], o, A + "." + v);
        });
      }
      p(r, this, "root");
    }
  }
  return za = l, za;
}
const Ly = { enum: ["i8"] }, Cy = { enum: ["u8"] }, jy = { enum: ["i16"] }, My = { enum: ["u16"] }, ky = { enum: ["i32"] }, qy = { enum: ["u32"] }, $y = { enum: ["f32"] }, Uy = { enum: ["f64"] }, zy = { enum: ["li8"] }, Wy = { enum: ["lu8"] }, Hy = { enum: ["li16"] }, Vy = { enum: ["lu16"] }, Gy = { enum: ["li32"] }, Zy = { enum: ["lu32"] }, Ky = { enum: ["lf32"] }, Yy = { enum: ["lf64"] }, Qy = { enum: ["i64"] }, Jy = { enum: ["li64"] }, Xy = { enum: ["u64"] }, ev = { enum: ["lu64"] }, rv = { enum: ["varint"] }, tv = { enum: ["varint64"] }, nv = { enum: ["varint128"] }, iv = { enum: ["zigzag32"] }, av = { enum: ["zigzag64"] }, ov = { title: "int", type: "array", items: [{ enum: ["int"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, sv = { title: "lint", type: "array", items: [{ enum: ["lint"] }, { type: "array", items: { type: "object", properties: { size: { type: "number" } }, required: ["size"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, Lr = {
  i8: Ly,
  u8: Cy,
  i16: jy,
  u16: My,
  i32: ky,
  u32: qy,
  f32: $y,
  f64: Uy,
  li8: zy,
  lu8: Wy,
  li16: Hy,
  lu16: Vy,
  li32: Gy,
  lu32: Zy,
  lf32: Ky,
  lf64: Yy,
  i64: Qy,
  li64: Jy,
  u64: Xy,
  lu64: ev,
  varint: rv,
  varint64: tv,
  varint128: nv,
  zigzag32: iv,
  zigzag64: av,
  int: ov,
  lint: sv
};
var Wa, fu;
function Bc() {
  if (fu) return Wa;
  fu = 1;
  const { PartialReadError: t } = $r();
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
  class l extends Array {
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
  function c(a, w) {
    if (w + 8 > a.length)
      throw new t();
    return {
      value: new e(a.readInt32BE(w), a.readInt32BE(w + 4)),
      size: 8
    };
  }
  function r(a, w, u) {
    return typeof a == "bigint" ? w.writeBigInt64BE(a, u) : (w.writeInt32BE(a[0], u), w.writeInt32BE(a[1], u + 4)), u + 8;
  }
  function i(a, w) {
    if (w + 8 > a.length)
      throw new t();
    return {
      value: new e(a.readInt32LE(w + 4), a.readInt32LE(w)),
      size: 8
    };
  }
  function p(a, w, u) {
    return typeof a == "bigint" ? w.writeBigInt64LE(a, u) : (w.writeInt32LE(a[0], u + 4), w.writeInt32LE(a[1], u)), u + 8;
  }
  function f(a, w) {
    if (w + 8 > a.length)
      throw new t();
    return {
      value: new l(a.readUInt32BE(w), a.readUInt32BE(w + 4)),
      size: 8
    };
  }
  function b(a, w, u) {
    return typeof a == "bigint" ? w.writeBigUInt64BE(a, u) : (w.writeUInt32BE(a[0], u), w.writeUInt32BE(a[1], u + 4)), u + 8;
  }
  function A(a, w) {
    if (w + 8 > a.length)
      throw new t();
    return {
      value: new l(a.readUInt32LE(w + 4), a.readUInt32LE(w)),
      size: 8
    };
  }
  function o(a, w, u) {
    return typeof a == "bigint" ? w.writeBigUInt64LE(a, u) : (w.writeUInt32LE(a[0], u + 4), w.writeUInt32LE(a[1], u)), u + 8;
  }
  function v(a, w, u, d) {
    return [(I, P) => {
      if (P + u > I.length)
        throw new t();
      return {
        value: I[a](P),
        size: u
      };
    }, (I, P, D) => (P[w](I, D), D + u), u, d];
  }
  const S = {
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
  }, s = Object.keys(S).reduce((a, w) => (a[w] = v(S[w][0], S[w][1], S[w][2], Lr[w]), a), {});
  return s.i64 = [c, r, 8, Lr.i64], s.li64 = [i, p, 8, Lr.li64], s.u64 = [f, b, 8, Lr.u64], s.lu64 = [A, o, 8, Lr.lu64], Wa = s, Wa;
}
const fv = { title: "pstring", type: "array", items: [{ enum: ["pstring"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" }, encoding: { type: "string" } }, additionalProperties: !1, required: ["count"] }] }], additionalItems: !1 }, lv = { title: "buffer", type: "array", items: [{ enum: ["buffer"] }, { oneOf: [{ type: "object", properties: { countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["countType"] }, { type: "object", properties: { count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["count"] }] }] }, uv = { title: "bitfield", type: "array", items: [{ enum: ["bitfield"] }, { type: "array", items: { type: "object", properties: { name: { $ref: "definitions#/definitions/fieldName" }, size: { type: "number" }, signed: { type: "boolean" } }, required: ["name", "size", "signed"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, cv = { title: "bitflags", type: "array", items: [{ enum: ["bitflags"] }, { type: "object", additionalItems: !1 }], additionalItems: !1 }, dv = { title: "mapper", type: "array", items: [{ enum: ["mapper"] }, { type: "object", properties: { type: { $ref: "dataType" }, mappings: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _]+$": { type: "string" } }, additionalProperties: !1 } }, required: ["type", "mappings"], additionalProperties: !1 }], additionalItems: !1 }, Kr = {
  pstring: fv,
  buffer: lv,
  bitfield: uv,
  bitflags: cv,
  mapper: dv
};
var Ha, lu;
function hv() {
  if (lu) return Ha;
  lu = 1;
  const { PartialReadError: t } = $r();
  Ha = {
    varint: [e, c, l, Lr.varint],
    varint64: [r, f, p, Lr.varint64],
    varint128: [i, f, p, Lr.varint128],
    zigzag32: [b, o, A, Lr.zigzag32],
    zigzag64: [v, s, S, Lr.zigzag64]
  };
  function e(a, w) {
    let u = 0, d = 0, E = w;
    for (; ; ) {
      if (E >= a.length) throw new t("Unexpected buffer end while reading VarInt");
      const _ = a.readUInt8(E);
      if (u |= (_ & 127) << d, E++, !(_ & 128))
        return { value: u, size: E - w };
      if (d += 7, d > 64) throw new t(`varint is too big: ${d}`);
    }
  }
  function l(a) {
    let w = 0;
    for (; a & -128; )
      a >>>= 7, w++;
    return w + 1;
  }
  function c(a, w, u) {
    let d = 0;
    for (; a & -128; )
      w.writeUInt8(a & 255 | 128, u + d), d++, a >>>= 7;
    return w.writeUInt8(a, u + d), u + d + 1;
  }
  function r(a, w) {
    let u = 0n, d = 0n, E = w;
    for (; ; ) {
      if (E >= a.length) throw new t("Unexpected buffer end while reading VarLong");
      const _ = a.readUInt8(E);
      if (u |= (BigInt(_) & 0x7Fn) << d, E++, !(_ & 128))
        return { value: u, size: E - w };
      if (d += 7n, d > 63n) throw new Error(`varint is too big: ${d}`);
    }
  }
  function i(a, w) {
    let u = 0n, d = 0n, E = w;
    for (; ; ) {
      if (E >= a.length) throw new t("Unexpected buffer end while reading VarLong");
      const _ = a.readUInt8(E);
      if (u |= (BigInt(_) & 0x7Fn) << d, E++, !(_ & 128))
        return { value: u, size: E - w };
      if (d += 7n, d > 127n) throw new Error(`varint is too big: ${d}`);
    }
  }
  function p(a) {
    a = BigInt(a);
    let w = 0;
    do
      a >>= 7n, w++;
    while (a !== 0n);
    return w;
  }
  function f(a, w, u) {
    a = BigInt(a);
    let d = u;
    do {
      const E = a & 0x7Fn;
      a >>= 7n, w.writeUInt8(Number(E) | (a ? 128 : 0), d++);
    } while (a);
    return d;
  }
  function b(a, w) {
    const { value: u, size: d } = e(a, w);
    return { value: u >>> 1 ^ -(u & 1), size: d };
  }
  function A(a) {
    return l(a << 1 ^ a >> 31);
  }
  function o(a, w, u) {
    return c(a << 1 ^ a >> 31, w, u);
  }
  function v(a, w) {
    const { value: u, size: d } = r(a, w);
    return { value: u >> 1n ^ -(u & 1n), size: d };
  }
  function S(a) {
    return p(BigInt(a) << 1n ^ BigInt(a) >> 63n);
  }
  function s(a, w, u) {
    return f(BigInt(a) << 1n ^ BigInt(a) >> 63n, w, u);
  }
  return Ha;
}
var Va, uu;
function Lc() {
  if (uu) return Va;
  uu = 1;
  const { getCount: t, sendCount: e, calcCount: l, PartialReadError: c } = $r();
  Va = {
    bool: [v, S, 1, Kr.bool],
    pstring: [b, A, o, Kr.pstring],
    buffer: [s, a, w, Kr.buffer],
    void: [u, d, 0, Kr.void],
    bitfield: [_, I, P, Kr.bitfield],
    bitflags: [K, L, z, Kr.bitflags],
    cstring: [D, x, q, Kr.cstring],
    mapper: [i, p, f, Kr.mapper],
    ...hv()
  };
  function r(y, F) {
    return y === F || parseInt(y) === parseInt(F);
  }
  function i(y, F, { type: ie, mappings: ce }, _e) {
    const { size: be, value: ue } = this.read(y, F, ie, _e);
    let le = null;
    const k = Object.keys(ce);
    for (let he = 0; he < k.length; he++)
      if (r(k[he], ue)) {
        le = ce[k[he]];
        break;
      }
    if (le == null) throw new Error(ue + " is not in the mappings value");
    return {
      size: be,
      value: le
    };
  }
  function p(y, F, ie, { type: ce, mappings: _e }, be) {
    const ue = Object.keys(_e);
    let le = null;
    for (let k = 0; k < ue.length; k++)
      if (r(_e[ue[k]], y)) {
        le = ue[k];
        break;
      }
    if (le == null) throw new Error(y + " is not in the mappings value");
    return this.write(le, F, ie, ce, be);
  }
  function f(y, { type: F, mappings: ie }, ce) {
    const _e = Object.keys(ie);
    let be = null;
    for (let ue = 0; ue < _e.length; ue++)
      if (r(ie[_e[ue]], y)) {
        be = _e[ue];
        break;
      }
    if (be == null) throw new Error(y + " is not in the mappings value");
    return this.sizeOf(be, F, ce);
  }
  function b(y, F, ie, ce) {
    const { size: _e, count: be } = t.call(this, y, F, ie, ce), ue = F + _e, le = ue + be;
    if (le > y.length)
      throw new c("Missing characters in string, found size is " + y.length + " expected size was " + le);
    return {
      value: y.toString(ie.encoding || "utf8", ue, le),
      size: le - F
    };
  }
  function A(y, F, ie, ce, _e) {
    const be = dr.byteLength(y, "utf8");
    return ie = e.call(this, be, F, ie, ce, _e), F.write(y, ie, be, ce.encoding || "utf8"), ie + be;
  }
  function o(y, F, ie) {
    const ce = dr.byteLength(y, F.encoding || "utf8");
    return l.call(this, ce, F, ie) + ce;
  }
  function v(y, F) {
    if (F + 1 > y.length) throw new c();
    return {
      value: !!y.readInt8(F),
      size: 1
    };
  }
  function S(y, F, ie) {
    return F.writeInt8(+y, ie), ie + 1;
  }
  function s(y, F, ie, ce) {
    const { size: _e, count: be } = t.call(this, y, F, ie, ce);
    if (F += _e, F + be > y.length) throw new c();
    return {
      value: y.slice(F, F + be),
      size: _e + be
    };
  }
  function a(y, F, ie, ce, _e) {
    return y instanceof dr || (y = dr.from(y)), ie = e.call(this, y.length, F, ie, ce, _e), y.copy(F, ie), ie + y.length;
  }
  function w(y, F, ie) {
    return y instanceof dr || (y = dr.from(y)), l.call(this, y.length, F, ie) + y.length;
  }
  function u() {
    return {
      value: void 0,
      size: 0
    };
  }
  function d(y, F, ie) {
    return ie;
  }
  function E(y) {
    return (1 << y) - 1;
  }
  function _(y, F, ie) {
    const ce = F;
    let _e = null, be = 0;
    const ue = {};
    return ue.value = ie.reduce((le, { size: k, signed: he, name: X }) => {
      let Q = k, H = 0;
      for (; Q > 0; ) {
        if (be === 0) {
          if (y.length < F + 1)
            throw new c();
          _e = y[F++], be = 8;
        }
        const se = Math.min(Q, be);
        H = H << se | (_e & E(be)) >> be - se, be -= se, Q -= se;
      }
      return he && H >= 1 << k - 1 && (H -= 1 << k), le[X] = H, le;
    }, {}), ue.size = F - ce, ue;
  }
  function I(y, F, ie, ce) {
    let _e = 0, be = 0;
    return ce.forEach(({ size: ue, signed: le, name: k }) => {
      const he = y[k];
      if (!le && he < 0 || le && he < -(1 << ue - 1))
        throw new Error(y + " < " + le ? -(1 << ue - 1) : 0);
      if (!le && he >= 1 << ue || le && he >= (1 << ue - 1) - 1)
        throw new Error(y + " >= " + le ? 1 << ue : (1 << ue - 1) - 1);
      for (; ue > 0; ) {
        const X = Math.min(8 - be, ue);
        _e = _e << X | he >> ue - X & E(X), ue -= X, be += X, be === 8 && (F[ie++] = _e, be = 0, _e = 0);
      }
    }), be !== 0 && (F[ie++] = _e << 8 - be), ie;
  }
  function P(y, F) {
    return Math.ceil(F.reduce((ie, { size: ce }) => ie + ce, 0) / 8);
  }
  function D(y, F, ie) {
    let ce = 0;
    for (; F + ce < y.length && y[F + ce] !== 0; )
      ce++;
    if (y.length < F + ce + 1)
      throw new c();
    return {
      value: y.toString((ie == null ? void 0 : ie.encoding) || "utf8", F, F + ce),
      size: ce + 1
    };
  }
  function x(y, F, ie, ce) {
    const _e = dr.byteLength(y, (ce == null ? void 0 : ce.encoding) || "utf8");
    return F.write(y, ie, _e, (ce == null ? void 0 : ce.encoding) || "utf8"), ie += _e, F.writeInt8(0, ie), ie + 1;
  }
  function q(y) {
    return dr.byteLength(y, "utf8") + 1;
  }
  function K(y, F, { type: ie, flags: ce, shift: _e, big: be }, ue) {
    const { size: le, value: k } = this.read(y, F, ie, ue);
    let he = {};
    if (Array.isArray(ce))
      for (const [Q, H] of Object.entries(ce))
        he[H] = be ? 1n << BigInt(Q) : 1 << Q;
    else if (_e)
      for (const Q in ce)
        he[Q] = be ? 1n << BigInt(ce[Q]) : 1 << ce[Q];
    else
      he = ce;
    const X = { _value: k };
    for (const Q in he)
      X[Q] = (k & he[Q]) === he[Q];
    return { value: X, size: le };
  }
  function L(y, F, ie, { type: ce, flags: _e, shift: be, big: ue }, le) {
    let k = {};
    if (Array.isArray(_e))
      for (const [X, Q] of Object.entries(_e))
        k[Q] = ue ? 1n << BigInt(X) : 1 << X;
    else if (be)
      for (const X in _e)
        k[X] = ue ? 1n << BigInt(_e[X]) : 1 << _e[X];
    else
      k = _e;
    let he = y._value || (ue ? 0n : 0);
    for (const X in k)
      y[X] && (he |= k[X]);
    return this.write(he, F, ie, ce, le);
  }
  function z(y, { type: F, flags: ie, shift: ce, big: _e }, be) {
    if (!y) throw new Error("Missing field");
    let ue = {};
    if (Array.isArray(ie))
      for (const [k, he] of Object.entries(ie))
        ue[he] = _e ? 1n << BigInt(k) : 1 << k;
    else if (ce)
      for (const k in ie)
        ue[k] = _e ? 1n << BigInt(ie[k]) : 1 << ie[k];
    else
      ue = ie;
    let le = y._value || (_e ? 0n : 0);
    for (const k in ue)
      y[k] && (le |= ue[k]);
    return this.sizeOf(le, F, be);
  }
  return Va;
}
const pv = { title: "array", type: "array", items: [{ enum: ["array"] }, { oneOf: [{ type: "object", properties: { type: { $ref: "dataType" }, countType: { $ref: "dataType" } }, additionalProperties: !1, required: ["type", "countType"] }, { type: "object", properties: { type: { $ref: "dataType" }, count: { $ref: "definitions#/definitions/dataTypeArgsCount" } }, additionalProperties: !1, required: ["type", "count"] }] }], additionalItems: !1 }, yv = { title: "count", type: "array", items: [{ enum: ["count"] }, { type: "object", properties: { countFor: { $ref: "definitions#/definitions/contextualizedFieldName" }, type: { $ref: "dataType" } }, required: ["countFor", "type"], additionalProperties: !1 }], additionalItems: !1 }, vv = { title: "container", type: "array", items: [{ enum: ["container"] }, { type: "array", items: { type: "object", properties: { anon: { type: "boolean" }, name: { $ref: "definitions#/definitions/fieldName" }, type: { $ref: "dataType" } }, oneOf: [{ required: ["anon"] }, { required: ["name"] }], required: ["type"], additionalProperties: !1 }, additionalItems: !1 }], additionalItems: !1 }, Ga = {
  array: pv,
  count: yv,
  container: vv
};
var Za, cu;
function gv() {
  if (cu) return Za;
  cu = 1;
  const { getField: t, getCount: e, sendCount: l, calcCount: c, tryDoc: r } = $r();
  Za = {
    array: [i, p, f, Ga.array],
    count: [v, S, s, Ga.count],
    container: [b, A, o, Ga.container]
  };
  function i(a, w, u, d) {
    const E = {
      value: [],
      size: 0
    };
    let _, { count: I, size: P } = e.call(this, a, w, u, d);
    w += P, E.size += P;
    for (let D = 0; D < I; D++)
      ({ size: P, value: _ } = r(() => this.read(a, w, u.type, d), D)), E.size += P, w += P, E.value.push(_);
    return E;
  }
  function p(a, w, u, d, E) {
    return u = l.call(this, a.length, w, u, d, E), a.reduce((_, I, P) => r(() => this.write(I, w, _, d.type, E), P), u);
  }
  function f(a, w, u) {
    let d = c.call(this, a.length, w, u);
    return d = a.reduce((E, _, I) => r(() => E + this.sizeOf(_, w.type, u), I), d), d;
  }
  function b(a, w, u, d) {
    const E = {
      value: { "..": d },
      size: 0
    };
    return u.forEach(({ type: _, name: I, anon: P }) => {
      r(() => {
        const D = this.read(a, w, _, E.value);
        E.size += D.size, w += D.size, P ? D.value !== void 0 && Object.keys(D.value).forEach((x) => {
          E.value[x] = D.value[x];
        }) : E.value[I] = D.value;
      }, I || "unknown");
    }), delete E.value[".."], E;
  }
  function A(a, w, u, d, E) {
    return a[".."] = E, u = d.reduce((_, { type: I, name: P, anon: D }) => r(() => this.write(D ? a : a[P], w, _, I, a), P || "unknown"), u), delete a[".."], u;
  }
  function o(a, w, u) {
    a[".."] = u;
    const d = w.reduce((E, { type: _, name: I, anon: P }) => E + r(() => this.sizeOf(P ? a : a[I], _, a), I || "unknown"), 0);
    return delete a[".."], d;
  }
  function v(a, w, { type: u }, d) {
    return this.read(a, w, u, d);
  }
  function S(a, w, u, { countFor: d, type: E }, _) {
    return this.write(t(d, _).length, w, u, E, _);
  }
  function s(a, { countFor: w, type: u }, d) {
    return this.sizeOf(t(w, d).length, u, d);
  }
  return Za;
}
const mv = { title: "option", type: "array", items: [{ enum: ["option"] }, { $ref: "dataType" }], additionalItems: !1 }, du = {
  switch: { title: "switch", type: "array", items: [{ enum: ["switch"] }, { type: "object", properties: { compareTo: { $ref: "definitions#/definitions/contextualizedFieldName" }, compareToValue: { type: "string" }, fields: { type: "object", patternProperties: { "^[-a-zA-Z0-9 _:/]+$": { $ref: "dataType" } }, additionalProperties: !1 }, default: { $ref: "dataType" } }, oneOf: [{ required: ["compareTo", "fields"] }, { required: ["compareToValue", "fields"] }], additionalProperties: !1 }], additionalItems: !1 },
  option: mv
};
var Ka, hu;
function bv() {
  if (hu) return Ka;
  hu = 1;
  const { getField: t, getFieldInfo: e, tryDoc: l, PartialReadError: c } = $r();
  Ka = {
    switch: [r, i, p, du.switch],
    option: [f, b, A, du.option]
  };
  function r(o, v, { compareTo: S, fields: s, compareToValue: a, default: w }, u) {
    if (S = a !== void 0 ? a : t(S, u), typeof s[S] > "u" && typeof w > "u")
      throw new Error(S + " has no associated fieldInfo in switch");
    for (const I in s)
      I.startsWith("/") && (s[this.types[I.slice(1)]] = s[I], delete s[I]);
    const d = typeof s[S] > "u", E = d ? w : s[S], _ = e(E);
    return l(() => this.read(o, v, _, u), d ? "default" : S);
  }
  function i(o, v, S, { compareTo: s, fields: a, compareToValue: w, default: u }, d) {
    if (s = w !== void 0 ? w : t(s, d), typeof a[s] > "u" && typeof u > "u")
      throw new Error(s + " has no associated fieldInfo in switch");
    for (const I in a)
      I.startsWith("/") && (a[this.types[I.slice(1)]] = a[I], delete a[I]);
    const E = typeof a[s] > "u", _ = e(E ? u : a[s]);
    return l(() => this.write(o, v, S, _, d), E ? "default" : s);
  }
  function p(o, { compareTo: v, fields: S, compareToValue: s, default: a }, w) {
    if (v = s !== void 0 ? s : t(v, w), typeof S[v] > "u" && typeof a > "u")
      throw new Error(v + " has no associated fieldInfo in switch");
    for (const E in S)
      E.startsWith("/") && (S[this.types[E.slice(1)]] = S[E], delete S[E]);
    const u = typeof S[v] > "u", d = e(u ? a : S[v]);
    return l(() => this.sizeOf(o, d, w), u ? "default" : v);
  }
  function f(o, v, S, s) {
    if (o.length < v + 1)
      throw new c();
    if (o.readUInt8(v++) !== 0) {
      const w = this.read(o, v, S, s);
      return w.size++, w;
    } else
      return { size: 1 };
  }
  function b(o, v, S, s, a) {
    return o != null ? (v.writeUInt8(1, S++), S = this.write(o, v, S, s, a)) : v.writeUInt8(0, S++), S;
  }
  function A(o, v, S) {
    return o == null ? 1 : this.sizeOf(o, v, S) + 1;
  }
  return Ka;
}
var Ya, pu;
function wv() {
  if (pu) return Ya;
  pu = 1;
  const { getFieldInfo: t, tryCatch: e } = $r(), l = qh(), c = By();
  function r(A) {
    return typeof A == "string" || Array.isArray(A) && typeof A[0] == "string" || A.type;
  }
  function i(A, o, v) {
    return typeof o == "string" && o.charAt(0) === "$" ? A.push({ path: v, val: o.substr(1) }) : (Array.isArray(o) || typeof o == "object") && (A = A.concat(l(o, i, []).map((S) => ({ path: v + "." + S.path, val: S.val })))), A;
  }
  function p(A, o, v) {
    const S = A.split(".").reverse();
    for (; S.length > 1; )
      v = v[S.pop()];
    v[S.pop()] = o;
  }
  function f(A, o) {
    const v = JSON.stringify(o), S = l(o, i, []);
    function s(a) {
      const w = JSON.parse(v);
      return S.forEach((u) => {
        p(u.path, a[u.val], w);
      }), w;
    }
    return [function(w, u, d, E) {
      return A[0].call(this, w, u, s(d), E);
    }, function(w, u, d, E, _) {
      return A[1].call(this, w, u, d, s(E), _);
    }, function(w, u, d) {
      return typeof A[2] == "function" ? A[2].call(this, w, s(u), d) : A[2];
    }];
  }
  class b {
    constructor(o = !0) {
      this.types = {}, this.validator = o ? new c() : null, this.addDefaultTypes();
    }
    addDefaultTypes() {
      this.addTypes(Bc()), this.addTypes(Lc()), this.addTypes(gv()), this.addTypes(bv());
    }
    addProtocol(o, v) {
      const S = this;
      function s(a, w) {
        a !== void 0 && (a.types && S.addTypes(a.types), s(a == null ? void 0 : a[w[0]], w.slice(1)));
      }
      this.validator && this.validator.validateProtocol(o), s(o, v);
    }
    addType(o, v, S = !0) {
      if (v === "native") {
        this.validator && this.validator.addType(o);
        return;
      }
      if (r(v)) {
        this.validator && (S && this.validator.validateType(v), this.validator.addType(o));
        const { type: s, typeArgs: a } = t(v);
        this.types[o] = a ? f(this.types[s], a) : this.types[s];
      } else
        this.validator && (v[3] ? this.validator.addType(o, v[3]) : this.validator.addType(o)), this.types[o] = v;
    }
    addTypes(o) {
      Object.keys(o).forEach((v) => this.addType(v, o[v], !1)), this.validator && Object.keys(o).forEach((v) => {
        r(o[v]) && this.validator.validateType(o[v]);
      });
    }
    setVariable(o, v) {
      this.types[o] = v;
    }
    read(o, v, S, s) {
      const { type: a, typeArgs: w } = t(S), u = this.types[a];
      if (!u)
        throw new Error("missing data type: " + a);
      return u[0].call(this, o, v, w, s);
    }
    write(o, v, S, s, a) {
      const { type: w, typeArgs: u } = t(s), d = this.types[w];
      if (!d)
        throw new Error("missing data type: " + w);
      return d[1].call(this, o, v, S, u, a);
    }
    sizeOf(o, v, S) {
      const { type: s, typeArgs: a } = t(v), w = this.types[s];
      if (!w)
        throw new Error("missing data type: " + s);
      return typeof w[2] == "function" ? w[2].call(this, o, a, S) : w[2];
    }
    createPacketBuffer(o, v) {
      const S = e(
        () => this.sizeOf(v, o, {}),
        (a) => {
          throw a.message = `SizeOf error for ${a.field} : ${a.message}`, a;
        }
      ), s = dr.allocUnsafe(S);
      return e(
        () => this.write(v, s, 0, o, {}),
        (a) => {
          throw a.message = `Write error for ${a.field} : ${a.message}`, a;
        }
      ), s;
    }
    parsePacketBuffer(o, v, S = 0) {
      const { value: s, size: a } = e(
        () => this.read(v, S, o, {}),
        (w) => {
          throw w.message = `Read error for ${w.field} : ${w.message}`, w;
        }
      );
      return {
        data: s,
        metadata: {
          size: a
        },
        buffer: v.slice(0, a),
        fullBuffer: v
      };
    }
  }
  return Ya = b, Ya;
}
var Qa = { exports: {} }, Ja = { exports: {} }, Xa, yu;
function or() {
  if (yu) return Xa;
  yu = 1;
  class t extends Error {
    constructor(l) {
      if (!Array.isArray(l))
        throw new TypeError(`Expected input to be an Array, got ${typeof l}`);
      let c = "";
      for (let r = 0; r < l.length; r++)
        c += `    ${l[r].stack}
`;
      super(c), this.name = "AggregateError", this.errors = l;
    }
  }
  return Xa = {
    AggregateError: t,
    ArrayIsArray(e) {
      return Array.isArray(e);
    },
    ArrayPrototypeIncludes(e, l) {
      return e.includes(l);
    },
    ArrayPrototypeIndexOf(e, l) {
      return e.indexOf(l);
    },
    ArrayPrototypeJoin(e, l) {
      return e.join(l);
    },
    ArrayPrototypeMap(e, l) {
      return e.map(l);
    },
    ArrayPrototypePop(e, l) {
      return e.pop(l);
    },
    ArrayPrototypePush(e, l) {
      return e.push(l);
    },
    ArrayPrototypeSlice(e, l, c) {
      return e.slice(l, c);
    },
    Error,
    FunctionPrototypeCall(e, l, ...c) {
      return e.call(l, ...c);
    },
    FunctionPrototypeSymbolHasInstance(e, l) {
      return Function.prototype[Symbol.hasInstance].call(e, l);
    },
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties(e, l) {
      return Object.defineProperties(e, l);
    },
    ObjectDefineProperty(e, l, c) {
      return Object.defineProperty(e, l, c);
    },
    ObjectGetOwnPropertyDescriptor(e, l) {
      return Object.getOwnPropertyDescriptor(e, l);
    },
    ObjectKeys(e) {
      return Object.keys(e);
    },
    ObjectSetPrototypeOf(e, l) {
      return Object.setPrototypeOf(e, l);
    },
    Promise,
    PromisePrototypeCatch(e, l) {
      return e.catch(l);
    },
    PromisePrototypeThen(e, l, c) {
      return e.then(l, c);
    },
    PromiseReject(e) {
      return Promise.reject(e);
    },
    PromiseResolve(e) {
      return Promise.resolve(e);
    },
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest(e, l) {
      return e.test(l);
    },
    SafeSet: Set,
    String,
    StringPrototypeSlice(e, l, c) {
      return e.slice(l, c);
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
    TypedArrayPrototypeSet(e, l, c) {
      return e.set(l, c);
    },
    Boolean,
    Uint8Array
  }, Xa;
}
var eo = { exports: {} }, ro, vu;
function Cc() {
  return vu || (vu = 1, ro = {
    format(t, ...e) {
      return t.replace(/%([sdifj])/g, function(...[l, c]) {
        const r = e.shift();
        return c === "f" ? r.toFixed(6) : c === "j" ? JSON.stringify(r) : c === "s" && typeof r == "object" ? `${r.constructor !== Object ? r.constructor.name : ""} {}`.trim() : r.toString();
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
  }), ro;
}
var to, gu;
function yr() {
  if (gu) return to;
  gu = 1;
  const { format: t, inspect: e } = Cc(), { AggregateError: l } = or(), c = globalThis.AggregateError || l, r = Symbol("kIsNodeError"), i = [
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
  ], p = /^([A-Z][a-z0-9]*)+$/, f = "__node_internal_", b = {};
  function A(u, d) {
    if (!u)
      throw new b.ERR_INTERNAL_ASSERTION(d);
  }
  function o(u) {
    let d = "", E = u.length;
    const _ = u[0] === "-" ? 1 : 0;
    for (; E >= _ + 4; E -= 3)
      d = `_${u.slice(E - 3, E)}${d}`;
    return `${u.slice(0, E)}${d}`;
  }
  function v(u, d, E) {
    if (typeof d == "function")
      return A(
        d.length <= E.length,
        // Default options do not count.
        `Code: ${u}; The provided arguments length (${E.length}) does not match the required ones (${d.length}).`
      ), d(...E);
    const _ = (d.match(/%[dfijoOs]/g) || []).length;
    return A(
      _ === E.length,
      `Code: ${u}; The provided arguments length (${E.length}) does not match the required ones (${_}).`
    ), E.length === 0 ? d : t(d, ...E);
  }
  function S(u, d, E) {
    E || (E = Error);
    class _ extends E {
      constructor(...P) {
        super(v(u, d, P));
      }
      toString() {
        return `${this.name} [${u}]: ${this.message}`;
      }
    }
    Object.defineProperties(_.prototype, {
      name: {
        value: E.name,
        writable: !0,
        enumerable: !1,
        configurable: !0
      },
      toString: {
        value() {
          return `${this.name} [${u}]: ${this.message}`;
        },
        writable: !0,
        enumerable: !1,
        configurable: !0
      }
    }), _.prototype.code = u, _.prototype[r] = !0, b[u] = _;
  }
  function s(u) {
    const d = f + u.name;
    return Object.defineProperty(u, "name", {
      value: d
    }), u;
  }
  function a(u, d) {
    if (u && d && u !== d) {
      if (Array.isArray(d.errors))
        return d.errors.push(u), d;
      const E = new c([d, u], d.message);
      return E.code = d.code, E;
    }
    return u || d;
  }
  class w extends Error {
    constructor(d = "The operation was aborted", E = void 0) {
      if (E !== void 0 && typeof E != "object")
        throw new b.ERR_INVALID_ARG_TYPE("options", "Object", E);
      super(d, E), this.code = "ABORT_ERR", this.name = "AbortError";
    }
  }
  return S("ERR_ASSERTION", "%s", Error), S(
    "ERR_INVALID_ARG_TYPE",
    (u, d, E) => {
      A(typeof u == "string", "'name' must be a string"), Array.isArray(d) || (d = [d]);
      let _ = "The ";
      u.endsWith(" argument") ? _ += `${u} ` : _ += `"${u}" ${u.includes(".") ? "property" : "argument"} `, _ += "must be ";
      const I = [], P = [], D = [];
      for (const q of d)
        A(typeof q == "string", "All expected entries have to be of type string"), i.includes(q) ? I.push(q.toLowerCase()) : p.test(q) ? P.push(q) : (A(q !== "object", 'The value "object" should be written as "Object"'), D.push(q));
      if (P.length > 0) {
        const q = I.indexOf("object");
        q !== -1 && (I.splice(I, q, 1), P.push("Object"));
      }
      if (I.length > 0) {
        switch (I.length) {
          case 1:
            _ += `of type ${I[0]}`;
            break;
          case 2:
            _ += `one of type ${I[0]} or ${I[1]}`;
            break;
          default: {
            const q = I.pop();
            _ += `one of type ${I.join(", ")}, or ${q}`;
          }
        }
        (P.length > 0 || D.length > 0) && (_ += " or ");
      }
      if (P.length > 0) {
        switch (P.length) {
          case 1:
            _ += `an instance of ${P[0]}`;
            break;
          case 2:
            _ += `an instance of ${P[0]} or ${P[1]}`;
            break;
          default: {
            const q = P.pop();
            _ += `an instance of ${P.join(", ")}, or ${q}`;
          }
        }
        D.length > 0 && (_ += " or ");
      }
      switch (D.length) {
        case 0:
          break;
        case 1:
          D[0].toLowerCase() !== D[0] && (_ += "an "), _ += `${D[0]}`;
          break;
        case 2:
          _ += `one of ${D[0]} or ${D[1]}`;
          break;
        default: {
          const q = D.pop();
          _ += `one of ${D.join(", ")}, or ${q}`;
        }
      }
      if (E == null)
        _ += `. Received ${E}`;
      else if (typeof E == "function" && E.name)
        _ += `. Received function ${E.name}`;
      else if (typeof E == "object") {
        var x;
        if ((x = E.constructor) !== null && x !== void 0 && x.name)
          _ += `. Received an instance of ${E.constructor.name}`;
        else {
          const q = e(E, {
            depth: -1
          });
          _ += `. Received ${q}`;
        }
      } else {
        let q = e(E, {
          colors: !1
        });
        q.length > 25 && (q = `${q.slice(0, 25)}...`), _ += `. Received type ${typeof E} (${q})`;
      }
      return _;
    },
    TypeError
  ), S(
    "ERR_INVALID_ARG_VALUE",
    (u, d, E = "is invalid") => {
      let _ = e(d);
      return _.length > 128 && (_ = _.slice(0, 128) + "..."), `The ${u.includes(".") ? "property" : "argument"} '${u}' ${E}. Received ${_}`;
    },
    TypeError
  ), S(
    "ERR_INVALID_RETURN_VALUE",
    (u, d, E) => {
      var _;
      const I = E != null && (_ = E.constructor) !== null && _ !== void 0 && _.name ? `instance of ${E.constructor.name}` : `type ${typeof E}`;
      return `Expected ${u} to be returned from the "${d}" function but got ${I}.`;
    },
    TypeError
  ), S(
    "ERR_MISSING_ARGS",
    (...u) => {
      A(u.length > 0, "At least one arg needs to be specified");
      let d;
      const E = u.length;
      switch (u = (Array.isArray(u) ? u : [u]).map((_) => `"${_}"`).join(" or "), E) {
        case 1:
          d += `The ${u[0]} argument`;
          break;
        case 2:
          d += `The ${u[0]} and ${u[1]} arguments`;
          break;
        default:
          {
            const _ = u.pop();
            d += `The ${u.join(", ")}, and ${_} arguments`;
          }
          break;
      }
      return `${d} must be specified`;
    },
    TypeError
  ), S(
    "ERR_OUT_OF_RANGE",
    (u, d, E) => {
      A(d, 'Missing "range" argument');
      let _;
      if (Number.isInteger(E) && Math.abs(E) > 2 ** 32)
        _ = o(String(E));
      else if (typeof E == "bigint") {
        _ = String(E);
        const I = BigInt(2) ** BigInt(32);
        (E > I || E < -I) && (_ = o(_)), _ += "n";
      } else
        _ = e(E);
      return `The value of "${u}" is out of range. It must be ${d}. Received ${_}`;
    },
    RangeError
  ), S("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error), S("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error), S("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error), S("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error), S("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error), S("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), S("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error), S("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error), S("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error), S("ERR_STREAM_WRITE_AFTER_END", "write after end", Error), S("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError), to = {
    AbortError: w,
    aggregateTwoErrors: s(a),
    hideStackFrames: s,
    codes: b
  }, to;
}
var gt = { exports: {} }, mu;
function _t() {
  if (mu) return gt.exports;
  mu = 1;
  const { AbortController: t, AbortSignal: e } = typeof self < "u" ? self : typeof window < "u" ? window : (
    /* otherwise */
    void 0
  );
  return gt.exports = t, gt.exports.AbortSignal = e, gt.exports.default = t, gt.exports;
}
var bu;
function br() {
  return bu || (bu = 1, (function(t) {
    const e = wr(), { format: l, inspect: c } = Cc(), {
      codes: { ERR_INVALID_ARG_TYPE: r }
    } = yr(), { kResistStopPropagation: i, AggregateError: p, SymbolDispose: f } = or(), b = globalThis.AbortSignal || _t().AbortSignal, A = globalThis.AbortController || _t().AbortController, o = Object.getPrototypeOf(async function() {
    }).constructor, v = globalThis.Blob || e.Blob, S = typeof v < "u" ? function(u) {
      return u instanceof v;
    } : function(u) {
      return !1;
    }, s = (w, u) => {
      if (w !== void 0 && (w === null || typeof w != "object" || !("aborted" in w)))
        throw new r(u, "AbortSignal", w);
    }, a = (w, u) => {
      if (typeof w != "function")
        throw new r(u, "Function", w);
    };
    t.exports = {
      AggregateError: p,
      kEmptyObject: Object.freeze({}),
      once(w) {
        let u = !1;
        return function(...d) {
          u || (u = !0, w.apply(this, d));
        };
      },
      createDeferredPromise: function() {
        let w, u;
        return {
          promise: new Promise((E, _) => {
            w = E, u = _;
          }),
          resolve: w,
          reject: u
        };
      },
      promisify(w) {
        return new Promise((u, d) => {
          w((E, ..._) => E ? d(E) : u(..._));
        });
      },
      debuglog() {
        return function() {
        };
      },
      format: l,
      inspect: c,
      types: {
        isAsyncFunction(w) {
          return w instanceof o;
        },
        isArrayBufferView(w) {
          return ArrayBuffer.isView(w);
        }
      },
      isBlob: S,
      deprecate(w, u) {
        return w;
      },
      addAbortListener: nt().addAbortListener || function(u, d) {
        if (u === void 0)
          throw new r("signal", "AbortSignal", u);
        s(u, "signal"), a(d, "listener");
        let E;
        return u.aborted ? queueMicrotask(() => d()) : (u.addEventListener("abort", d, {
          __proto__: null,
          once: !0,
          [i]: !0
        }), E = () => {
          u.removeEventListener("abort", d);
        }), {
          __proto__: null,
          [f]() {
            var _;
            (_ = E) === null || _ === void 0 || _();
          }
        };
      },
      AbortSignalAny: b.any || function(u) {
        if (u.length === 1)
          return u[0];
        const d = new A(), E = () => d.abort();
        return u.forEach((_) => {
          s(_, "signals"), _.addEventListener("abort", E, {
            once: !0
          });
        }), d.signal.addEventListener(
          "abort",
          () => {
            u.forEach((_) => _.removeEventListener("abort", E));
          },
          {
            once: !0
          }
        ), d.signal;
      }
    }, t.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
  })(eo)), eo.exports;
}
var qt = {}, no, wu;
function Rt() {
  if (wu) return no;
  wu = 1;
  const {
    ArrayIsArray: t,
    ArrayPrototypeIncludes: e,
    ArrayPrototypeJoin: l,
    ArrayPrototypeMap: c,
    NumberIsInteger: r,
    NumberIsNaN: i,
    NumberMAX_SAFE_INTEGER: p,
    NumberMIN_SAFE_INTEGER: f,
    NumberParseInt: b,
    ObjectPrototypeHasOwnProperty: A,
    RegExpPrototypeExec: o,
    String: v,
    StringPrototypeToUpperCase: S,
    StringPrototypeTrim: s
  } = or(), {
    hideStackFrames: a,
    codes: { ERR_SOCKET_BAD_PORT: w, ERR_INVALID_ARG_TYPE: u, ERR_INVALID_ARG_VALUE: d, ERR_OUT_OF_RANGE: E, ERR_UNKNOWN_SIGNAL: _ }
  } = yr(), { normalizeEncoding: I } = br(), { isAsyncFunction: P, isArrayBufferView: D } = br().types, x = {};
  function q(re) {
    return re === (re | 0);
  }
  function K(re) {
    return re === re >>> 0;
  }
  const L = /^[0-7]+$/, z = "must be a 32-bit unsigned integer or an octal string";
  function y(re, De, Le) {
    if (typeof re > "u" && (re = Le), typeof re == "string") {
      if (o(L, re) === null)
        throw new d(De, re, z);
      re = b(re, 8);
    }
    return ce(re, De), re;
  }
  const F = a((re, De, Le = f, Pe = p) => {
    if (typeof re != "number") throw new u(De, "number", re);
    if (!r(re)) throw new E(De, "an integer", re);
    if (re < Le || re > Pe) throw new E(De, `>= ${Le} && <= ${Pe}`, re);
  }), ie = a((re, De, Le = -2147483648, Pe = 2147483647) => {
    if (typeof re != "number")
      throw new u(De, "number", re);
    if (!r(re))
      throw new E(De, "an integer", re);
    if (re < Le || re > Pe)
      throw new E(De, `>= ${Le} && <= ${Pe}`, re);
  }), ce = a((re, De, Le = !1) => {
    if (typeof re != "number")
      throw new u(De, "number", re);
    if (!r(re))
      throw new E(De, "an integer", re);
    const Pe = Le ? 1 : 0, $e = 4294967295;
    if (re < Pe || re > $e)
      throw new E(De, `>= ${Pe} && <= ${$e}`, re);
  });
  function _e(re, De) {
    if (typeof re != "string") throw new u(De, "string", re);
  }
  function be(re, De, Le = void 0, Pe) {
    if (typeof re != "number") throw new u(De, "number", re);
    if (Le != null && re < Le || Pe != null && re > Pe || (Le != null || Pe != null) && i(re))
      throw new E(
        De,
        `${Le != null ? `>= ${Le}` : ""}${Le != null && Pe != null ? " && " : ""}${Pe != null ? `<= ${Pe}` : ""}`,
        re
      );
  }
  const ue = a((re, De, Le) => {
    if (!e(Le, re)) {
      const $e = "must be one of: " + l(
        c(Le, (ve) => typeof ve == "string" ? `'${ve}'` : v(ve)),
        ", "
      );
      throw new d(De, re, $e);
    }
  });
  function le(re, De) {
    if (typeof re != "boolean") throw new u(De, "boolean", re);
  }
  function k(re, De, Le) {
    return re == null || !A(re, De) ? Le : re[De];
  }
  const he = a((re, De, Le = null) => {
    const Pe = k(Le, "allowArray", !1), $e = k(Le, "allowFunction", !1);
    if (!k(Le, "nullable", !1) && re === null || !Pe && t(re) || typeof re != "object" && (!$e || typeof re != "function"))
      throw new u(De, "Object", re);
  }), X = a((re, De) => {
    if (re != null && typeof re != "object" && typeof re != "function")
      throw new u(De, "a dictionary", re);
  }), Q = a((re, De, Le = 0) => {
    if (!t(re))
      throw new u(De, "Array", re);
    if (re.length < Le) {
      const Pe = `must be longer than ${Le}`;
      throw new d(De, re, Pe);
    }
  });
  function H(re, De) {
    Q(re, De);
    for (let Le = 0; Le < re.length; Le++)
      _e(re[Le], `${De}[${Le}]`);
  }
  function se(re, De) {
    Q(re, De);
    for (let Le = 0; Le < re.length; Le++)
      le(re[Le], `${De}[${Le}]`);
  }
  function O(re, De) {
    Q(re, De);
    for (let Le = 0; Le < re.length; Le++) {
      const Pe = re[Le], $e = `${De}[${Le}]`;
      if (Pe == null)
        throw new u($e, "AbortSignal", Pe);
      N(Pe, $e);
    }
  }
  function B(re, De = "signal") {
    if (_e(re, De), x[re] === void 0)
      throw x[S(re)] !== void 0 ? new _(re + " (signals must use all capital letters)") : new _(re);
  }
  const C = a((re, De = "buffer") => {
    if (!D(re))
      throw new u(De, ["Buffer", "TypedArray", "DataView"], re);
  });
  function ee(re, De) {
    const Le = I(De), Pe = re.length;
    if (Le === "hex" && Pe % 2 !== 0)
      throw new d("encoding", De, `is invalid for data of length ${Pe}`);
  }
  function te(re, De = "Port", Le = !0) {
    if (typeof re != "number" && typeof re != "string" || typeof re == "string" && s(re).length === 0 || +re !== +re >>> 0 || re > 65535 || re === 0 && !Le)
      throw new w(De, re, Le);
    return re | 0;
  }
  const N = a((re, De) => {
    if (re !== void 0 && (re === null || typeof re != "object" || !("aborted" in re)))
      throw new u(De, "AbortSignal", re);
  }), j = a((re, De) => {
    if (typeof re != "function") throw new u(De, "Function", re);
  }), W = a((re, De) => {
    if (typeof re != "function" || P(re)) throw new u(De, "Function", re);
  }), oe = a((re, De) => {
    if (re !== void 0) throw new u(De, "undefined", re);
  });
  function we(re, De, Le) {
    if (!e(Le, re))
      throw new u(De, `('${l(Le, "|")}')`, re);
  }
  const Se = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function Re(re, De) {
    if (typeof re > "u" || !o(Se, re))
      throw new d(
        De,
        re,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"'
      );
  }
  function Oe(re) {
    if (typeof re == "string")
      return Re(re, "hints"), re;
    if (t(re)) {
      const De = re.length;
      let Le = "";
      if (De === 0)
        return Le;
      for (let Pe = 0; Pe < De; Pe++) {
        const $e = re[Pe];
        Re($e, "hints"), Le += $e, Pe !== De - 1 && (Le += ", ");
      }
      return Le;
    }
    throw new d(
      "hints",
      re,
      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
    );
  }
  return no = {
    isInt32: q,
    isUint32: K,
    parseFileMode: y,
    validateArray: Q,
    validateStringArray: H,
    validateBooleanArray: se,
    validateAbortSignalArray: O,
    validateBoolean: le,
    validateBuffer: C,
    validateDictionary: X,
    validateEncoding: ee,
    validateFunction: j,
    validateInt32: ie,
    validateInteger: F,
    validateNumber: be,
    validateObject: he,
    validateOneOf: ue,
    validatePlainFunction: W,
    validatePort: te,
    validateSignalName: B,
    validateString: _e,
    validateUint32: ce,
    validateUndefined: oe,
    validateUnion: we,
    validateAbortSignal: N,
    validateLinkHeaderValue: Oe
  }, no;
}
var $t = { exports: {} }, io = { exports: {} }, _u;
function at() {
  if (_u) return io.exports;
  _u = 1;
  var t = io.exports = {}, e, l;
  function c() {
    throw new Error("setTimeout has not been defined");
  }
  function r() {
    throw new Error("clearTimeout has not been defined");
  }
  (function() {
    try {
      typeof setTimeout == "function" ? e = setTimeout : e = c;
    } catch {
      e = c;
    }
    try {
      typeof clearTimeout == "function" ? l = clearTimeout : l = r;
    } catch {
      l = r;
    }
  })();
  function i(w) {
    if (e === setTimeout)
      return setTimeout(w, 0);
    if ((e === c || !e) && setTimeout)
      return e = setTimeout, setTimeout(w, 0);
    try {
      return e(w, 0);
    } catch {
      try {
        return e.call(null, w, 0);
      } catch {
        return e.call(this, w, 0);
      }
    }
  }
  function p(w) {
    if (l === clearTimeout)
      return clearTimeout(w);
    if ((l === r || !l) && clearTimeout)
      return l = clearTimeout, clearTimeout(w);
    try {
      return l(w);
    } catch {
      try {
        return l.call(null, w);
      } catch {
        return l.call(this, w);
      }
    }
  }
  var f = [], b = !1, A, o = -1;
  function v() {
    !b || !A || (b = !1, A.length ? f = A.concat(f) : o = -1, f.length && S());
  }
  function S() {
    if (!b) {
      var w = i(v);
      b = !0;
      for (var u = f.length; u; ) {
        for (A = f, f = []; ++o < u; )
          A && A[o].run();
        o = -1, u = f.length;
      }
      A = null, b = !1, p(w);
    }
  }
  t.nextTick = function(w) {
    var u = new Array(arguments.length - 1);
    if (arguments.length > 1)
      for (var d = 1; d < arguments.length; d++)
        u[d - 1] = arguments[d];
    f.push(new s(w, u)), f.length === 1 && !b && i(S);
  };
  function s(w, u) {
    this.fun = w, this.array = u;
  }
  s.prototype.run = function() {
    this.fun.apply(null, this.array);
  }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {};
  function a() {
  }
  return t.on = a, t.addListener = a, t.once = a, t.off = a, t.removeListener = a, t.removeAllListeners = a, t.emit = a, t.prependListener = a, t.prependOnceListener = a, t.listeners = function(w) {
    return [];
  }, t.binding = function(w) {
    throw new Error("process.binding is not supported");
  }, t.cwd = function() {
    return "/";
  }, t.chdir = function(w) {
    throw new Error("process.chdir is not supported");
  }, t.umask = function() {
    return 0;
  }, io.exports;
}
var ao, Eu;
function Wr() {
  if (Eu) return ao;
  Eu = 1;
  const { SymbolAsyncIterator: t, SymbolIterator: e, SymbolFor: l } = or(), c = l("nodejs.stream.destroyed"), r = l("nodejs.stream.errored"), i = l("nodejs.stream.readable"), p = l("nodejs.stream.writable"), f = l("nodejs.stream.disturbed"), b = l("nodejs.webstream.isClosedPromise"), A = l("nodejs.webstream.controllerErrorFunction");
  function o(k, he = !1) {
    var X;
    return !!(k && typeof k.pipe == "function" && typeof k.on == "function" && (!he || typeof k.pause == "function" && typeof k.resume == "function") && (!k._writableState || ((X = k._readableState) === null || X === void 0 ? void 0 : X.readable) !== !1) && // Duplex
    (!k._writableState || k._readableState));
  }
  function v(k) {
    var he;
    return !!(k && typeof k.write == "function" && typeof k.on == "function" && (!k._readableState || ((he = k._writableState) === null || he === void 0 ? void 0 : he.writable) !== !1));
  }
  function S(k) {
    return !!(k && typeof k.pipe == "function" && k._readableState && typeof k.on == "function" && typeof k.write == "function");
  }
  function s(k) {
    return k && (k._readableState || k._writableState || typeof k.write == "function" && typeof k.on == "function" || typeof k.pipe == "function" && typeof k.on == "function");
  }
  function a(k) {
    return !!(k && !s(k) && typeof k.pipeThrough == "function" && typeof k.getReader == "function" && typeof k.cancel == "function");
  }
  function w(k) {
    return !!(k && !s(k) && typeof k.getWriter == "function" && typeof k.abort == "function");
  }
  function u(k) {
    return !!(k && !s(k) && typeof k.readable == "object" && typeof k.writable == "object");
  }
  function d(k) {
    return a(k) || w(k) || u(k);
  }
  function E(k, he) {
    return k == null ? !1 : he === !0 ? typeof k[t] == "function" : he === !1 ? typeof k[e] == "function" : typeof k[t] == "function" || typeof k[e] == "function";
  }
  function _(k) {
    if (!s(k)) return null;
    const he = k._writableState, X = k._readableState, Q = he || X;
    return !!(k.destroyed || k[c] || Q != null && Q.destroyed);
  }
  function I(k) {
    if (!v(k)) return null;
    if (k.writableEnded === !0) return !0;
    const he = k._writableState;
    return he != null && he.errored ? !1 : typeof (he == null ? void 0 : he.ended) != "boolean" ? null : he.ended;
  }
  function P(k, he) {
    if (!v(k)) return null;
    if (k.writableFinished === !0) return !0;
    const X = k._writableState;
    return X != null && X.errored ? !1 : typeof (X == null ? void 0 : X.finished) != "boolean" ? null : !!(X.finished || he === !1 && X.ended === !0 && X.length === 0);
  }
  function D(k) {
    if (!o(k)) return null;
    if (k.readableEnded === !0) return !0;
    const he = k._readableState;
    return !he || he.errored ? !1 : typeof (he == null ? void 0 : he.ended) != "boolean" ? null : he.ended;
  }
  function x(k, he) {
    if (!o(k)) return null;
    const X = k._readableState;
    return X != null && X.errored ? !1 : typeof (X == null ? void 0 : X.endEmitted) != "boolean" ? null : !!(X.endEmitted || he === !1 && X.ended === !0 && X.length === 0);
  }
  function q(k) {
    return k && k[i] != null ? k[i] : typeof (k == null ? void 0 : k.readable) != "boolean" ? null : _(k) ? !1 : o(k) && k.readable && !x(k);
  }
  function K(k) {
    return k && k[p] != null ? k[p] : typeof (k == null ? void 0 : k.writable) != "boolean" ? null : _(k) ? !1 : v(k) && k.writable && !I(k);
  }
  function L(k, he) {
    return s(k) ? _(k) ? !0 : !((he == null ? void 0 : he.readable) !== !1 && q(k) || (he == null ? void 0 : he.writable) !== !1 && K(k)) : null;
  }
  function z(k) {
    var he, X;
    return s(k) ? k.writableErrored ? k.writableErrored : (he = (X = k._writableState) === null || X === void 0 ? void 0 : X.errored) !== null && he !== void 0 ? he : null : null;
  }
  function y(k) {
    var he, X;
    return s(k) ? k.readableErrored ? k.readableErrored : (he = (X = k._readableState) === null || X === void 0 ? void 0 : X.errored) !== null && he !== void 0 ? he : null : null;
  }
  function F(k) {
    if (!s(k))
      return null;
    if (typeof k.closed == "boolean")
      return k.closed;
    const he = k._writableState, X = k._readableState;
    return typeof (he == null ? void 0 : he.closed) == "boolean" || typeof (X == null ? void 0 : X.closed) == "boolean" ? (he == null ? void 0 : he.closed) || (X == null ? void 0 : X.closed) : typeof k._closed == "boolean" && ie(k) ? k._closed : null;
  }
  function ie(k) {
    return typeof k._closed == "boolean" && typeof k._defaultKeepAlive == "boolean" && typeof k._removedConnection == "boolean" && typeof k._removedContLen == "boolean";
  }
  function ce(k) {
    return typeof k._sent100 == "boolean" && ie(k);
  }
  function _e(k) {
    var he;
    return typeof k._consuming == "boolean" && typeof k._dumped == "boolean" && ((he = k.req) === null || he === void 0 ? void 0 : he.upgradeOrConnect) === void 0;
  }
  function be(k) {
    if (!s(k)) return null;
    const he = k._writableState, X = k._readableState, Q = he || X;
    return !Q && ce(k) || !!(Q && Q.autoDestroy && Q.emitClose && Q.closed === !1);
  }
  function ue(k) {
    var he;
    return !!(k && ((he = k[f]) !== null && he !== void 0 ? he : k.readableDidRead || k.readableAborted));
  }
  function le(k) {
    var he, X, Q, H, se, O, B, C, ee, te;
    return !!(k && ((he = (X = (Q = (H = (se = (O = k[r]) !== null && O !== void 0 ? O : k.readableErrored) !== null && se !== void 0 ? se : k.writableErrored) !== null && H !== void 0 ? H : (B = k._readableState) === null || B === void 0 ? void 0 : B.errorEmitted) !== null && Q !== void 0 ? Q : (C = k._writableState) === null || C === void 0 ? void 0 : C.errorEmitted) !== null && X !== void 0 ? X : (ee = k._readableState) === null || ee === void 0 ? void 0 : ee.errored) !== null && he !== void 0 ? he : !((te = k._writableState) === null || te === void 0) && te.errored));
  }
  return ao = {
    isDestroyed: _,
    kIsDestroyed: c,
    isDisturbed: ue,
    kIsDisturbed: f,
    isErrored: le,
    kIsErrored: r,
    isReadable: q,
    kIsReadable: i,
    kIsClosedPromise: b,
    kControllerErrorFunction: A,
    kIsWritable: p,
    isClosed: F,
    isDuplexNodeStream: S,
    isFinished: L,
    isIterable: E,
    isReadableNodeStream: o,
    isReadableStream: a,
    isReadableEnded: D,
    isReadableFinished: x,
    isReadableErrored: y,
    isNodeStream: s,
    isWebStream: d,
    isWritable: K,
    isWritableNodeStream: v,
    isWritableStream: w,
    isWritableEnded: I,
    isWritableFinished: P,
    isWritableErrored: z,
    isServerRequest: _e,
    isServerResponse: ce,
    willEmitClose: be,
    isTransformStream: u
  }, ao;
}
var Su;
function Qr() {
  if (Su) return $t.exports;
  Su = 1;
  const t = at(), { AbortError: e, codes: l } = yr(), { ERR_INVALID_ARG_TYPE: c, ERR_STREAM_PREMATURE_CLOSE: r } = l, { kEmptyObject: i, once: p } = br(), { validateAbortSignal: f, validateFunction: b, validateObject: A, validateBoolean: o } = Rt(), { Promise: v, PromisePrototypeThen: S, SymbolDispose: s } = or(), {
    isClosed: a,
    isReadable: w,
    isReadableNodeStream: u,
    isReadableStream: d,
    isReadableFinished: E,
    isReadableErrored: _,
    isWritable: I,
    isWritableNodeStream: P,
    isWritableStream: D,
    isWritableFinished: x,
    isWritableErrored: q,
    isNodeStream: K,
    willEmitClose: L,
    kIsClosedPromise: z
  } = Wr();
  let y;
  function F(ue) {
    return ue.setHeader && typeof ue.abort == "function";
  }
  const ie = () => {
  };
  function ce(ue, le, k) {
    var he, X;
    if (arguments.length === 2 ? (k = le, le = i) : le == null ? le = i : A(le, "options"), b(k, "callback"), f(le.signal, "options.signal"), k = p(k), d(ue) || D(ue))
      return _e(ue, le, k);
    if (!K(ue))
      throw new c("stream", ["ReadableStream", "WritableStream", "Stream"], ue);
    const Q = (he = le.readable) !== null && he !== void 0 ? he : u(ue), H = (X = le.writable) !== null && X !== void 0 ? X : P(ue), se = ue._writableState, O = ue._readableState, B = () => {
      ue.writable || te();
    };
    let C = L(ue) && u(ue) === Q && P(ue) === H, ee = x(ue, !1);
    const te = () => {
      ee = !0, ue.destroyed && (C = !1), !(C && (!ue.readable || Q)) && (!Q || N) && k.call(ue);
    };
    let N = E(ue, !1);
    const j = () => {
      N = !0, ue.destroyed && (C = !1), !(C && (!ue.writable || H)) && (!H || ee) && k.call(ue);
    }, W = (re) => {
      k.call(ue, re);
    };
    let oe = a(ue);
    const we = () => {
      oe = !0;
      const re = q(ue) || _(ue);
      if (re && typeof re != "boolean")
        return k.call(ue, re);
      if (Q && !N && u(ue, !0) && !E(ue, !1))
        return k.call(ue, new r());
      if (H && !ee && !x(ue, !1))
        return k.call(ue, new r());
      k.call(ue);
    }, Se = () => {
      oe = !0;
      const re = q(ue) || _(ue);
      if (re && typeof re != "boolean")
        return k.call(ue, re);
      k.call(ue);
    }, Re = () => {
      ue.req.on("finish", te);
    };
    F(ue) ? (ue.on("complete", te), C || ue.on("abort", we), ue.req ? Re() : ue.on("request", Re)) : H && !se && (ue.on("end", B), ue.on("close", B)), !C && typeof ue.aborted == "boolean" && ue.on("aborted", we), ue.on("end", j), ue.on("finish", te), le.error !== !1 && ue.on("error", W), ue.on("close", we), oe ? t.nextTick(we) : se != null && se.errorEmitted || O != null && O.errorEmitted ? C || t.nextTick(Se) : (!Q && (!C || w(ue)) && (ee || I(ue) === !1) || !H && (!C || I(ue)) && (N || w(ue) === !1) || O && ue.req && ue.aborted) && t.nextTick(Se);
    const Oe = () => {
      k = ie, ue.removeListener("aborted", we), ue.removeListener("complete", te), ue.removeListener("abort", we), ue.removeListener("request", Re), ue.req && ue.req.removeListener("finish", te), ue.removeListener("end", B), ue.removeListener("close", B), ue.removeListener("finish", te), ue.removeListener("end", j), ue.removeListener("error", W), ue.removeListener("close", we);
    };
    if (le.signal && !oe) {
      const re = () => {
        const De = k;
        Oe(), De.call(
          ue,
          new e(void 0, {
            cause: le.signal.reason
          })
        );
      };
      if (le.signal.aborted)
        t.nextTick(re);
      else {
        y = y || br().addAbortListener;
        const De = y(le.signal, re), Le = k;
        k = p((...Pe) => {
          De[s](), Le.apply(ue, Pe);
        });
      }
    }
    return Oe;
  }
  function _e(ue, le, k) {
    let he = !1, X = ie;
    if (le.signal)
      if (X = () => {
        he = !0, k.call(
          ue,
          new e(void 0, {
            cause: le.signal.reason
          })
        );
      }, le.signal.aborted)
        t.nextTick(X);
      else {
        y = y || br().addAbortListener;
        const H = y(le.signal, X), se = k;
        k = p((...O) => {
          H[s](), se.apply(ue, O);
        });
      }
    const Q = (...H) => {
      he || t.nextTick(() => k.apply(ue, H));
    };
    return S(ue[z].promise, Q, Q), ie;
  }
  function be(ue, le) {
    var k;
    let he = !1;
    return le === null && (le = i), (k = le) !== null && k !== void 0 && k.cleanup && (o(le.cleanup, "cleanup"), he = le.cleanup), new v((X, Q) => {
      const H = ce(ue, le, (se) => {
        he && H(), se ? Q(se) : X();
      });
    });
  }
  return $t.exports = ce, $t.exports.finished = be, $t.exports;
}
var oo, Ru;
function vt() {
  if (Ru) return oo;
  Ru = 1;
  const t = at(), {
    aggregateTwoErrors: e,
    codes: { ERR_MULTIPLE_CALLBACK: l },
    AbortError: c
  } = yr(), { Symbol: r } = or(), { kIsDestroyed: i, isDestroyed: p, isFinished: f, isServerRequest: b } = Wr(), A = r("kDestroy"), o = r("kConstruct");
  function v(L, z, y) {
    L && (L.stack, z && !z.errored && (z.errored = L), y && !y.errored && (y.errored = L));
  }
  function S(L, z) {
    const y = this._readableState, F = this._writableState, ie = F || y;
    return F != null && F.destroyed || y != null && y.destroyed ? (typeof z == "function" && z(), this) : (v(L, F, y), F && (F.destroyed = !0), y && (y.destroyed = !0), ie.constructed ? s(this, L, z) : this.once(A, function(ce) {
      s(this, e(ce, L), z);
    }), this);
  }
  function s(L, z, y) {
    let F = !1;
    function ie(ce) {
      if (F)
        return;
      F = !0;
      const _e = L._readableState, be = L._writableState;
      v(ce, be, _e), be && (be.closed = !0), _e && (_e.closed = !0), typeof y == "function" && y(ce), ce ? t.nextTick(a, L, ce) : t.nextTick(w, L);
    }
    try {
      L._destroy(z || null, ie);
    } catch (ce) {
      ie(ce);
    }
  }
  function a(L, z) {
    u(L, z), w(L);
  }
  function w(L) {
    const z = L._readableState, y = L._writableState;
    y && (y.closeEmitted = !0), z && (z.closeEmitted = !0), (y != null && y.emitClose || z != null && z.emitClose) && L.emit("close");
  }
  function u(L, z) {
    const y = L._readableState, F = L._writableState;
    F != null && F.errorEmitted || y != null && y.errorEmitted || (F && (F.errorEmitted = !0), y && (y.errorEmitted = !0), L.emit("error", z));
  }
  function d() {
    const L = this._readableState, z = this._writableState;
    L && (L.constructed = !0, L.closed = !1, L.closeEmitted = !1, L.destroyed = !1, L.errored = null, L.errorEmitted = !1, L.reading = !1, L.ended = L.readable === !1, L.endEmitted = L.readable === !1), z && (z.constructed = !0, z.destroyed = !1, z.closed = !1, z.closeEmitted = !1, z.errored = null, z.errorEmitted = !1, z.finalCalled = !1, z.prefinished = !1, z.ended = z.writable === !1, z.ending = z.writable === !1, z.finished = z.writable === !1);
  }
  function E(L, z, y) {
    const F = L._readableState, ie = L._writableState;
    if (ie != null && ie.destroyed || F != null && F.destroyed)
      return this;
    F != null && F.autoDestroy || ie != null && ie.autoDestroy ? L.destroy(z) : z && (z.stack, ie && !ie.errored && (ie.errored = z), F && !F.errored && (F.errored = z), y ? t.nextTick(u, L, z) : u(L, z));
  }
  function _(L, z) {
    if (typeof L._construct != "function")
      return;
    const y = L._readableState, F = L._writableState;
    y && (y.constructed = !1), F && (F.constructed = !1), L.once(o, z), !(L.listenerCount(o) > 1) && t.nextTick(I, L);
  }
  function I(L) {
    let z = !1;
    function y(F) {
      if (z) {
        E(L, F ?? new l());
        return;
      }
      z = !0;
      const ie = L._readableState, ce = L._writableState, _e = ce || ie;
      ie && (ie.constructed = !0), ce && (ce.constructed = !0), _e.destroyed ? L.emit(A, F) : F ? E(L, F, !0) : t.nextTick(P, L);
    }
    try {
      L._construct((F) => {
        t.nextTick(y, F);
      });
    } catch (F) {
      t.nextTick(y, F);
    }
  }
  function P(L) {
    L.emit(o);
  }
  function D(L) {
    return (L == null ? void 0 : L.setHeader) && typeof L.abort == "function";
  }
  function x(L) {
    L.emit("close");
  }
  function q(L, z) {
    L.emit("error", z), t.nextTick(x, L);
  }
  function K(L, z) {
    !L || p(L) || (!z && !f(L) && (z = new c()), b(L) ? (L.socket = null, L.destroy(z)) : D(L) ? L.abort() : D(L.req) ? L.req.abort() : typeof L.destroy == "function" ? L.destroy(z) : typeof L.close == "function" ? L.close() : z ? t.nextTick(q, L, z) : t.nextTick(x, L), L.destroyed || (L[i] = !0));
  }
  return oo = {
    construct: _,
    destroyer: K,
    destroy: S,
    undestroy: d,
    errorOrDestroy: E
  }, oo;
}
var so, Au;
function Jo() {
  if (Au) return so;
  Au = 1;
  const { ArrayIsArray: t, ObjectSetPrototypeOf: e } = or(), { EventEmitter: l } = nt();
  function c(i) {
    l.call(this, i);
  }
  e(c.prototype, l.prototype), e(c, l), c.prototype.pipe = function(i, p) {
    const f = this;
    function b(w) {
      i.writable && i.write(w) === !1 && f.pause && f.pause();
    }
    f.on("data", b);
    function A() {
      f.readable && f.resume && f.resume();
    }
    i.on("drain", A), !i._isStdio && (!p || p.end !== !1) && (f.on("end", v), f.on("close", S));
    let o = !1;
    function v() {
      o || (o = !0, i.end());
    }
    function S() {
      o || (o = !0, typeof i.destroy == "function" && i.destroy());
    }
    function s(w) {
      a(), l.listenerCount(this, "error") === 0 && this.emit("error", w);
    }
    r(f, "error", s), r(i, "error", s);
    function a() {
      f.removeListener("data", b), i.removeListener("drain", A), f.removeListener("end", v), f.removeListener("close", S), f.removeListener("error", s), i.removeListener("error", s), f.removeListener("end", a), f.removeListener("close", a), i.removeListener("close", a);
    }
    return f.on("end", a), f.on("close", a), i.on("close", a), i.emit("pipe", f), i;
  };
  function r(i, p, f) {
    if (typeof i.prependListener == "function") return i.prependListener(p, f);
    !i._events || !i._events[p] ? i.on(p, f) : t(i._events[p]) ? i._events[p].unshift(f) : i._events[p] = [f, i._events[p]];
  }
  return so = {
    Stream: c,
    prependListener: r
  }, so;
}
var fo = { exports: {} }, Pu;
function Kt() {
  return Pu || (Pu = 1, (function(t) {
    const { SymbolDispose: e } = or(), { AbortError: l, codes: c } = yr(), { isNodeStream: r, isWebStream: i, kControllerErrorFunction: p } = Wr(), f = Qr(), { ERR_INVALID_ARG_TYPE: b } = c;
    let A;
    const o = (v, S) => {
      if (typeof v != "object" || !("aborted" in v))
        throw new b(S, "AbortSignal", v);
    };
    t.exports.addAbortSignal = function(S, s) {
      if (o(S, "signal"), !r(s) && !i(s))
        throw new b("stream", ["ReadableStream", "WritableStream", "Stream"], s);
      return t.exports.addAbortSignalNoValidate(S, s);
    }, t.exports.addAbortSignalNoValidate = function(v, S) {
      if (typeof v != "object" || !("aborted" in v))
        return S;
      const s = r(S) ? () => {
        S.destroy(
          new l(void 0, {
            cause: v.reason
          })
        );
      } : () => {
        S[p](
          new l(void 0, {
            cause: v.reason
          })
        );
      };
      if (v.aborted)
        s();
      else {
        A = A || br().addAbortListener;
        const a = A(v, s);
        f(S, a[e]);
      }
      return S;
    };
  })(fo)), fo.exports;
}
var lo, Tu;
function _v() {
  if (Tu) return lo;
  Tu = 1;
  const { StringPrototypeSlice: t, SymbolIterator: e, TypedArrayPrototypeSet: l, Uint8Array: c } = or(), { Buffer: r } = wr(), { inspect: i } = br();
  return lo = class {
    constructor() {
      this.head = null, this.tail = null, this.length = 0;
    }
    push(f) {
      const b = {
        data: f,
        next: null
      };
      this.length > 0 ? this.tail.next = b : this.head = b, this.tail = b, ++this.length;
    }
    unshift(f) {
      const b = {
        data: f,
        next: this.head
      };
      this.length === 0 && (this.tail = b), this.head = b, ++this.length;
    }
    shift() {
      if (this.length === 0) return;
      const f = this.head.data;
      return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, f;
    }
    clear() {
      this.head = this.tail = null, this.length = 0;
    }
    join(f) {
      if (this.length === 0) return "";
      let b = this.head, A = "" + b.data;
      for (; (b = b.next) !== null; ) A += f + b.data;
      return A;
    }
    concat(f) {
      if (this.length === 0) return r.alloc(0);
      const b = r.allocUnsafe(f >>> 0);
      let A = this.head, o = 0;
      for (; A; )
        l(b, A.data, o), o += A.data.length, A = A.next;
      return b;
    }
    // Consumes a specified amount of bytes or characters from the buffered data.
    consume(f, b) {
      const A = this.head.data;
      if (f < A.length) {
        const o = A.slice(0, f);
        return this.head.data = A.slice(f), o;
      }
      return f === A.length ? this.shift() : b ? this._getString(f) : this._getBuffer(f);
    }
    first() {
      return this.head.data;
    }
    *[e]() {
      for (let f = this.head; f; f = f.next)
        yield f.data;
    }
    // Consumes a specified amount of characters from the buffered data.
    _getString(f) {
      let b = "", A = this.head, o = 0;
      do {
        const v = A.data;
        if (f > v.length)
          b += v, f -= v.length;
        else {
          f === v.length ? (b += v, ++o, A.next ? this.head = A.next : this.head = this.tail = null) : (b += t(v, 0, f), this.head = A, A.data = t(v, f));
          break;
        }
        ++o;
      } while ((A = A.next) !== null);
      return this.length -= o, b;
    }
    // Consumes a specified amount of bytes from the buffered data.
    _getBuffer(f) {
      const b = r.allocUnsafe(f), A = f;
      let o = this.head, v = 0;
      do {
        const S = o.data;
        if (f > S.length)
          l(b, S, A - f), f -= S.length;
        else {
          f === S.length ? (l(b, S, A - f), ++v, o.next ? this.head = o.next : this.head = this.tail = null) : (l(b, new c(S.buffer, S.byteOffset, f), A - f), this.head = o, o.data = S.slice(f));
          break;
        }
        ++v;
      } while ((o = o.next) !== null);
      return this.length -= v, b;
    }
    // Make sure the linked list only shows the minimal necessary information.
    [Symbol.for("nodejs.util.inspect.custom")](f, b) {
      return i(this, {
        ...b,
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: !1
      });
    }
  }, lo;
}
var uo, Iu;
function Yt() {
  if (Iu) return uo;
  Iu = 1;
  const { MathFloor: t, NumberIsInteger: e } = or(), { validateInteger: l } = Rt(), { ERR_INVALID_ARG_VALUE: c } = yr().codes;
  let r = 16 * 1024, i = 16;
  function p(o, v, S) {
    return o.highWaterMark != null ? o.highWaterMark : v ? o[S] : null;
  }
  function f(o) {
    return o ? i : r;
  }
  function b(o, v) {
    l(v, "value", 0), o ? i = v : r = v;
  }
  function A(o, v, S, s) {
    const a = p(v, s, S);
    if (a != null) {
      if (!e(a) || a < 0) {
        const w = s ? `options.${S}` : "options.highWaterMark";
        throw new c(w, a);
      }
      return t(a);
    }
    return f(o.objectMode);
  }
  return uo = {
    getHighWaterMark: A,
    getDefaultHighWaterMark: f,
    setDefaultHighWaterMark: b
  }, uo;
}
var co, Ou;
function jc() {
  if (Ou) return co;
  Ou = 1;
  const t = at(), { PromisePrototypeThen: e, SymbolAsyncIterator: l, SymbolIterator: c } = or(), { Buffer: r } = wr(), { ERR_INVALID_ARG_TYPE: i, ERR_STREAM_NULL_VALUES: p } = yr().codes;
  function f(b, A, o) {
    let v;
    if (typeof A == "string" || A instanceof r)
      return new b({
        objectMode: !0,
        ...o,
        read() {
          this.push(A), this.push(null);
        }
      });
    let S;
    if (A && A[l])
      S = !0, v = A[l]();
    else if (A && A[c])
      S = !1, v = A[c]();
    else
      throw new i("iterable", ["Iterable"], A);
    const s = new b({
      objectMode: !0,
      highWaterMark: 1,
      // TODO(ronag): What options should be allowed?
      ...o
    });
    let a = !1;
    s._read = function() {
      a || (a = !0, u());
    }, s._destroy = function(d, E) {
      e(
        w(d),
        () => t.nextTick(E, d),
        // nextTick is here in case cb throws
        (_) => t.nextTick(E, _ || d)
      );
    };
    async function w(d) {
      const E = d != null, _ = typeof v.throw == "function";
      if (E && _) {
        const { value: I, done: P } = await v.throw(d);
        if (await I, P)
          return;
      }
      if (typeof v.return == "function") {
        const { value: I } = await v.return();
        await I;
      }
    }
    async function u() {
      for (; ; ) {
        try {
          const { value: d, done: E } = S ? await v.next() : v.next();
          if (E)
            s.push(null);
          else {
            const _ = d && typeof d.then == "function" ? await d : d;
            if (_ === null)
              throw a = !1, new p();
            if (s.push(_))
              continue;
            a = !1;
          }
        } catch (d) {
          s.destroy(d);
        }
        break;
      }
    }
    return s;
  }
  return co = f, co;
}
var ho, xu;
function Qt() {
  if (xu) return ho;
  xu = 1;
  const t = at(), {
    ArrayPrototypeIndexOf: e,
    NumberIsInteger: l,
    NumberIsNaN: c,
    NumberParseInt: r,
    ObjectDefineProperties: i,
    ObjectKeys: p,
    ObjectSetPrototypeOf: f,
    Promise: b,
    SafeSet: A,
    SymbolAsyncDispose: o,
    SymbolAsyncIterator: v,
    Symbol: S
  } = or();
  ho = Pe, Pe.ReadableState = Le;
  const { EventEmitter: s } = nt(), { Stream: a, prependListener: w } = Jo(), { Buffer: u } = wr(), { addAbortSignal: d } = Kt(), E = Qr();
  let _ = br().debuglog("stream", (G) => {
    _ = G;
  });
  const I = _v(), P = vt(), { getHighWaterMark: D, getDefaultHighWaterMark: x } = Yt(), {
    aggregateTwoErrors: q,
    codes: {
      ERR_INVALID_ARG_TYPE: K,
      ERR_METHOD_NOT_IMPLEMENTED: L,
      ERR_OUT_OF_RANGE: z,
      ERR_STREAM_PUSH_AFTER_EOF: y,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT: F
    },
    AbortError: ie
  } = yr(), { validateObject: ce } = Rt(), _e = S("kPaused"), { StringDecoder: be } = Mo(), ue = jc();
  f(Pe.prototype, a.prototype), f(Pe, a);
  const le = () => {
  }, { errorOrDestroy: k } = P, he = 1, X = 2, Q = 4, H = 8, se = 16, O = 32, B = 64, C = 128, ee = 256, te = 512, N = 1024, j = 2048, W = 4096, oe = 8192, we = 16384, Se = 32768, Re = 65536, Oe = 1 << 17, re = 1 << 18;
  function De(G) {
    return {
      enumerable: !1,
      get() {
        return (this.state & G) !== 0;
      },
      set(m) {
        m ? this.state |= G : this.state &= ~G;
      }
    };
  }
  i(Le.prototype, {
    objectMode: De(he),
    ended: De(X),
    endEmitted: De(Q),
    reading: De(H),
    // Stream is still being constructed and cannot be
    // destroyed until construction finished or failed.
    // Async construction is opt in, therefore we start as
    // constructed.
    constructed: De(se),
    // A flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    sync: De(O),
    // Whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    needReadable: De(B),
    emittedReadable: De(C),
    readableListening: De(ee),
    resumeScheduled: De(te),
    // True if the error was already emitted and should not be thrown again.
    errorEmitted: De(N),
    emitClose: De(j),
    autoDestroy: De(W),
    // Has it been destroyed.
    destroyed: De(oe),
    // Indicates whether the stream has finished destroying.
    closed: De(we),
    // True if close has been emitted or would have been emitted
    // depending on emitClose.
    closeEmitted: De(Se),
    multiAwaitDrain: De(Re),
    // If true, a maybeReadMore has been scheduled.
    readingMore: De(Oe),
    dataEmitted: De(re)
  });
  function Le(G, m, h) {
    typeof h != "boolean" && (h = m instanceof Ur()), this.state = j | W | se | O, G && G.objectMode && (this.state |= he), h && G && G.readableObjectMode && (this.state |= he), this.highWaterMark = G ? D(this, G, "readableHighWaterMark", h) : x(!1), this.buffer = new I(), this.length = 0, this.pipes = [], this.flowing = null, this[_e] = null, G && G.emitClose === !1 && (this.state &= ~j), G && G.autoDestroy === !1 && (this.state &= ~W), this.errored = null, this.defaultEncoding = G && G.defaultEncoding || "utf8", this.awaitDrainWriters = null, this.decoder = null, this.encoding = null, G && G.encoding && (this.decoder = new be(G.encoding), this.encoding = G.encoding);
  }
  function Pe(G) {
    if (!(this instanceof Pe)) return new Pe(G);
    const m = this instanceof Ur();
    this._readableState = new Le(G, this, m), G && (typeof G.read == "function" && (this._read = G.read), typeof G.destroy == "function" && (this._destroy = G.destroy), typeof G.construct == "function" && (this._construct = G.construct), G.signal && !m && d(G.signal, this)), a.call(this, G), P.construct(this, () => {
      this._readableState.needReadable && n(this, this._readableState);
    });
  }
  Pe.prototype.destroy = P.destroy, Pe.prototype._undestroy = P.undestroy, Pe.prototype._destroy = function(G, m) {
    m(G);
  }, Pe.prototype[s.captureRejectionSymbol] = function(G) {
    this.destroy(G);
  }, Pe.prototype[o] = function() {
    let G;
    return this.destroyed || (G = this.readableEnded ? null : new ie(), this.destroy(G)), new b((m, h) => E(this, (T) => T && T !== G ? h(T) : m(null)));
  }, Pe.prototype.push = function(G, m) {
    return $e(this, G, m, !1);
  }, Pe.prototype.unshift = function(G, m) {
    return $e(this, G, m, !0);
  };
  function $e(G, m, h, T) {
    _("readableAddChunk", m);
    const Y = G._readableState;
    let pe;
    if ((Y.state & he) === 0 && (typeof m == "string" ? (h = h || Y.defaultEncoding, Y.encoding !== h && (T && Y.encoding ? m = u.from(m, h).toString(Y.encoding) : (m = u.from(m, h), h = ""))) : m instanceof u ? h = "" : a._isUint8Array(m) ? (m = a._uint8ArrayToBuffer(m), h = "") : m != null && (pe = new K("chunk", ["string", "Buffer", "Uint8Array"], m))), pe)
      k(G, pe);
    else if (m === null)
      Y.state &= ~H, Me(G, Y);
    else if ((Y.state & he) !== 0 || m && m.length > 0)
      if (T)
        if ((Y.state & Q) !== 0) k(G, new F());
        else {
          if (Y.destroyed || Y.errored) return !1;
          ve(G, Y, m, !0);
        }
      else if (Y.ended)
        k(G, new y());
      else {
        if (Y.destroyed || Y.errored)
          return !1;
        Y.state &= ~H, Y.decoder && !h ? (m = Y.decoder.write(m), Y.objectMode || m.length !== 0 ? ve(G, Y, m, !1) : n(G, Y)) : ve(G, Y, m, !1);
      }
    else T || (Y.state &= ~H, n(G, Y));
    return !Y.ended && (Y.length < Y.highWaterMark || Y.length === 0);
  }
  function ve(G, m, h, T) {
    m.flowing && m.length === 0 && !m.sync && G.listenerCount("data") > 0 ? ((m.state & Re) !== 0 ? m.awaitDrainWriters.clear() : m.awaitDrainWriters = null, m.dataEmitted = !0, G.emit("data", h)) : (m.length += m.objectMode ? 1 : h.length, T ? m.buffer.unshift(h) : m.buffer.push(h), (m.state & B) !== 0 && We(G)), n(G, m);
  }
  Pe.prototype.isPaused = function() {
    const G = this._readableState;
    return G[_e] === !0 || G.flowing === !1;
  }, Pe.prototype.setEncoding = function(G) {
    const m = new be(G);
    this._readableState.decoder = m, this._readableState.encoding = this._readableState.decoder.encoding;
    const h = this._readableState.buffer;
    let T = "";
    for (const Y of h)
      T += m.write(Y);
    return h.clear(), T !== "" && h.push(T), this._readableState.length = T.length, this;
  };
  const Ee = 1073741824;
  function je(G) {
    if (G > Ee)
      throw new z("size", "<= 1GiB", G);
    return G--, G |= G >>> 1, G |= G >>> 2, G |= G >>> 4, G |= G >>> 8, G |= G >>> 16, G++, G;
  }
  function qe(G, m) {
    return G <= 0 || m.length === 0 && m.ended ? 0 : (m.state & he) !== 0 ? 1 : c(G) ? m.flowing && m.length ? m.buffer.first().length : m.length : G <= m.length ? G : m.ended ? m.length : 0;
  }
  Pe.prototype.read = function(G) {
    _("read", G), G === void 0 ? G = NaN : l(G) || (G = r(G, 10));
    const m = this._readableState, h = G;
    if (G > m.highWaterMark && (m.highWaterMark = je(G)), G !== 0 && (m.state &= ~C), G === 0 && m.needReadable && ((m.highWaterMark !== 0 ? m.length >= m.highWaterMark : m.length > 0) || m.ended))
      return _("read: emitReadable", m.length, m.ended), m.length === 0 && m.ended ? Ne(this) : We(this), null;
    if (G = qe(G, m), G === 0 && m.ended)
      return m.length === 0 && Ne(this), null;
    let T = (m.state & B) !== 0;
    if (_("need readable", T), (m.length === 0 || m.length - G < m.highWaterMark) && (T = !0, _("length less than watermark", T)), m.ended || m.reading || m.destroyed || m.errored || !m.constructed)
      T = !1, _("reading, ended or constructing", T);
    else if (T) {
      _("do read"), m.state |= H | O, m.length === 0 && (m.state |= B);
      try {
        this._read(m.highWaterMark);
      } catch (pe) {
        k(this, pe);
      }
      m.state &= ~O, m.reading || (G = qe(h, m));
    }
    let Y;
    return G > 0 ? Y = Ie(G, m) : Y = null, Y === null ? (m.needReadable = m.length <= m.highWaterMark, G = 0) : (m.length -= G, m.multiAwaitDrain ? m.awaitDrainWriters.clear() : m.awaitDrainWriters = null), m.length === 0 && (m.ended || (m.needReadable = !0), h !== G && m.ended && Ne(this)), Y !== null && !m.errorEmitted && !m.closeEmitted && (m.dataEmitted = !0, this.emit("data", Y)), Y;
  };
  function Me(G, m) {
    if (_("onEofChunk"), !m.ended) {
      if (m.decoder) {
        const h = m.decoder.end();
        h && h.length && (m.buffer.push(h), m.length += m.objectMode ? 1 : h.length);
      }
      m.ended = !0, m.sync ? We(G) : (m.needReadable = !1, m.emittedReadable = !0, $(G));
    }
  }
  function We(G) {
    const m = G._readableState;
    _("emitReadable", m.needReadable, m.emittedReadable), m.needReadable = !1, m.emittedReadable || (_("emitReadable", m.flowing), m.emittedReadable = !0, t.nextTick($, G));
  }
  function $(G) {
    const m = G._readableState;
    _("emitReadable_", m.destroyed, m.length, m.ended), !m.destroyed && !m.errored && (m.length || m.ended) && (G.emit("readable"), m.emittedReadable = !1), m.needReadable = !m.flowing && !m.ended && m.length <= m.highWaterMark, Be(G);
  }
  function n(G, m) {
    !m.readingMore && m.constructed && (m.readingMore = !0, t.nextTick(g, G, m));
  }
  function g(G, m) {
    for (; !m.reading && !m.ended && (m.length < m.highWaterMark || m.flowing && m.length === 0); ) {
      const h = m.length;
      if (_("maybeReadMore read 0"), G.read(0), h === m.length)
        break;
    }
    m.readingMore = !1;
  }
  Pe.prototype._read = function(G) {
    throw new L("_read()");
  }, Pe.prototype.pipe = function(G, m) {
    const h = this, T = this._readableState;
    T.pipes.length === 1 && (T.multiAwaitDrain || (T.multiAwaitDrain = !0, T.awaitDrainWriters = new A(T.awaitDrainWriters ? [T.awaitDrainWriters] : []))), T.pipes.push(G), _("pipe count=%d opts=%j", T.pipes.length, m);
    const pe = (!m || m.end !== !1) && G !== t.stdout && G !== t.stderr ? ne : nr;
    T.endEmitted ? t.nextTick(pe) : h.once("end", pe), G.on("unpipe", Te);
    function Te(Je, rr) {
      _("onunpipe"), Je === h && rr && rr.hasUnpiped === !1 && (rr.hasUnpiped = !0, xe());
    }
    function ne() {
      _("onend"), G.end();
    }
    let ae, ye = !1;
    function xe() {
      _("cleanup"), G.removeListener("close", Ye), G.removeListener("finish", Qe), ae && G.removeListener("drain", ae), G.removeListener("error", He), G.removeListener("unpipe", Te), h.removeListener("end", ne), h.removeListener("end", nr), h.removeListener("data", ke), ye = !0, ae && T.awaitDrainWriters && (!G._writableState || G._writableState.needDrain) && ae();
    }
    function Ae() {
      ye || (T.pipes.length === 1 && T.pipes[0] === G ? (_("false write response, pause", 0), T.awaitDrainWriters = G, T.multiAwaitDrain = !1) : T.pipes.length > 1 && T.pipes.includes(G) && (_("false write response, pause", T.awaitDrainWriters.size), T.awaitDrainWriters.add(G)), h.pause()), ae || (ae = U(h, G), G.on("drain", ae));
    }
    h.on("data", ke);
    function ke(Je) {
      _("ondata");
      const rr = G.write(Je);
      _("dest.write", rr), rr === !1 && Ae();
    }
    function He(Je) {
      if (_("onerror", Je), nr(), G.removeListener("error", He), G.listenerCount("error") === 0) {
        const rr = G._writableState || G._readableState;
        rr && !rr.errorEmitted ? k(G, Je) : G.emit("error", Je);
      }
    }
    w(G, "error", He);
    function Ye() {
      G.removeListener("finish", Qe), nr();
    }
    G.once("close", Ye);
    function Qe() {
      _("onfinish"), G.removeListener("close", Ye), nr();
    }
    G.once("finish", Qe);
    function nr() {
      _("unpipe"), h.unpipe(G);
    }
    return G.emit("pipe", h), G.writableNeedDrain === !0 ? Ae() : T.flowing || (_("pipe resume"), h.resume()), G;
  };
  function U(G, m) {
    return function() {
      const T = G._readableState;
      T.awaitDrainWriters === m ? (_("pipeOnDrain", 1), T.awaitDrainWriters = null) : T.multiAwaitDrain && (_("pipeOnDrain", T.awaitDrainWriters.size), T.awaitDrainWriters.delete(m)), (!T.awaitDrainWriters || T.awaitDrainWriters.size === 0) && G.listenerCount("data") && G.resume();
    };
  }
  Pe.prototype.unpipe = function(G) {
    const m = this._readableState, h = {
      hasUnpiped: !1
    };
    if (m.pipes.length === 0) return this;
    if (!G) {
      const Y = m.pipes;
      m.pipes = [], this.pause();
      for (let pe = 0; pe < Y.length; pe++)
        Y[pe].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    const T = e(m.pipes, G);
    return T === -1 ? this : (m.pipes.splice(T, 1), m.pipes.length === 0 && this.pause(), G.emit("unpipe", this, h), this);
  }, Pe.prototype.on = function(G, m) {
    const h = a.prototype.on.call(this, G, m), T = this._readableState;
    return G === "data" ? (T.readableListening = this.listenerCount("readable") > 0, T.flowing !== !1 && this.resume()) : G === "readable" && !T.endEmitted && !T.readableListening && (T.readableListening = T.needReadable = !0, T.flowing = !1, T.emittedReadable = !1, _("on readable", T.length, T.reading), T.length ? We(this) : T.reading || t.nextTick(J, this)), h;
  }, Pe.prototype.addListener = Pe.prototype.on, Pe.prototype.removeListener = function(G, m) {
    const h = a.prototype.removeListener.call(this, G, m);
    return G === "readable" && t.nextTick(fe, this), h;
  }, Pe.prototype.off = Pe.prototype.removeListener, Pe.prototype.removeAllListeners = function(G) {
    const m = a.prototype.removeAllListeners.apply(this, arguments);
    return (G === "readable" || G === void 0) && t.nextTick(fe, this), m;
  };
  function fe(G) {
    const m = G._readableState;
    m.readableListening = G.listenerCount("readable") > 0, m.resumeScheduled && m[_e] === !1 ? m.flowing = !0 : G.listenerCount("data") > 0 ? G.resume() : m.readableListening || (m.flowing = null);
  }
  function J(G) {
    _("readable nexttick read 0"), G.read(0);
  }
  Pe.prototype.resume = function() {
    const G = this._readableState;
    return G.flowing || (_("resume"), G.flowing = !G.readableListening, de(this, G)), G[_e] = !1, this;
  };
  function de(G, m) {
    m.resumeScheduled || (m.resumeScheduled = !0, t.nextTick(M, G, m));
  }
  function M(G, m) {
    _("resume", m.reading), m.reading || G.read(0), m.resumeScheduled = !1, G.emit("resume"), Be(G), m.flowing && !m.reading && G.read(0);
  }
  Pe.prototype.pause = function() {
    return _("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (_("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState[_e] = !0, this;
  };
  function Be(G) {
    const m = G._readableState;
    for (_("flow", m.flowing); m.flowing && G.read() !== null; ) ;
  }
  Pe.prototype.wrap = function(G) {
    let m = !1;
    G.on("data", (T) => {
      !this.push(T) && G.pause && (m = !0, G.pause());
    }), G.on("end", () => {
      this.push(null);
    }), G.on("error", (T) => {
      k(this, T);
    }), G.on("close", () => {
      this.destroy();
    }), G.on("destroy", () => {
      this.destroy();
    }), this._read = () => {
      m && G.resume && (m = !1, G.resume());
    };
    const h = p(G);
    for (let T = 1; T < h.length; T++) {
      const Y = h[T];
      this[Y] === void 0 && typeof G[Y] == "function" && (this[Y] = G[Y].bind(G));
    }
    return this;
  }, Pe.prototype[v] = function() {
    return ze(this);
  }, Pe.prototype.iterator = function(G) {
    return G !== void 0 && ce(G, "options"), ze(this, G);
  };
  function ze(G, m) {
    typeof G.read != "function" && (G = Pe.wrap(G, {
      objectMode: !0
    }));
    const h = R(G, m);
    return h.stream = G, h;
  }
  async function* R(G, m) {
    let h = le;
    function T(Te) {
      this === G ? (h(), h = le) : h = Te;
    }
    G.on("readable", T);
    let Y;
    const pe = E(
      G,
      {
        writable: !1
      },
      (Te) => {
        Y = Te ? q(Y, Te) : null, h(), h = le;
      }
    );
    try {
      for (; ; ) {
        const Te = G.destroyed ? null : G.read();
        if (Te !== null)
          yield Te;
        else {
          if (Y)
            throw Y;
          if (Y === null)
            return;
          await new b(T);
        }
      }
    } catch (Te) {
      throw Y = q(Y, Te), Y;
    } finally {
      (Y || (m == null ? void 0 : m.destroyOnReturn) !== !1) && (Y === void 0 || G._readableState.autoDestroy) ? P.destroyer(G, null) : (G.off("readable", T), pe());
    }
  }
  i(Pe.prototype, {
    readable: {
      __proto__: null,
      get() {
        const G = this._readableState;
        return !!G && G.readable !== !1 && !G.destroyed && !G.errorEmitted && !G.endEmitted;
      },
      set(G) {
        this._readableState && (this._readableState.readable = !!G);
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
      set: function(G) {
        this._readableState && (this._readableState.flowing = G);
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
      set(G) {
        this._readableState && (this._readableState.destroyed = G);
      }
    },
    readableEnded: {
      __proto__: null,
      enumerable: !1,
      get() {
        return this._readableState ? this._readableState.endEmitted : !1;
      }
    }
  }), i(Le.prototype, {
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
        return this[_e] !== !1;
      },
      set(G) {
        this[_e] = !!G;
      }
    }
  }), Pe._fromList = Ie;
  function Ie(G, m) {
    if (m.length === 0) return null;
    let h;
    return m.objectMode ? h = m.buffer.shift() : !G || G >= m.length ? (m.decoder ? h = m.buffer.join("") : m.buffer.length === 1 ? h = m.buffer.first() : h = m.buffer.concat(m.length), m.buffer.clear()) : h = m.buffer.consume(G, m.decoder), h;
  }
  function Ne(G) {
    const m = G._readableState;
    _("endReadable", m.endEmitted), m.endEmitted || (m.ended = !0, t.nextTick(V, m, G));
  }
  function V(G, m) {
    if (_("endReadableNT", G.endEmitted, G.length), !G.errored && !G.closeEmitted && !G.endEmitted && G.length === 0) {
      if (G.endEmitted = !0, m.emit("end"), m.writable && m.allowHalfOpen === !1)
        t.nextTick(me, m);
      else if (G.autoDestroy) {
        const h = m._writableState;
        (!h || h.autoDestroy && // We don't expect the writable to ever 'finish'
        // if writable is explicitly set to false.
        (h.finished || h.writable === !1)) && m.destroy();
      }
    }
  }
  function me(G) {
    G.writable && !G.writableEnded && !G.destroyed && G.end();
  }
  Pe.from = function(G, m) {
    return ue(Pe, G, m);
  };
  let Fe;
  function Ve() {
    return Fe === void 0 && (Fe = {}), Fe;
  }
  return Pe.fromWeb = function(G, m) {
    return Ve().newStreamReadableFromReadableStream(G, m);
  }, Pe.toWeb = function(G, m) {
    return Ve().newReadableStreamFromStreamReadable(G, m);
  }, Pe.wrap = function(G, m) {
    var h, T;
    return new Pe({
      objectMode: (h = (T = G.readableObjectMode) !== null && T !== void 0 ? T : G.objectMode) !== null && h !== void 0 ? h : !0,
      ...m,
      destroy(Y, pe) {
        P.destroyer(G, Y), pe(Y);
      }
    }).wrap(G);
  }, ho;
}
var po, Fu;
function Xo() {
  if (Fu) return po;
  Fu = 1;
  const t = at(), {
    ArrayPrototypeSlice: e,
    Error: l,
    FunctionPrototypeSymbolHasInstance: c,
    ObjectDefineProperty: r,
    ObjectDefineProperties: i,
    ObjectSetPrototypeOf: p,
    StringPrototypeToLowerCase: f,
    Symbol: b,
    SymbolHasInstance: A
  } = or();
  po = ce, ce.WritableState = F;
  const { EventEmitter: o } = nt(), v = Jo().Stream, { Buffer: S } = wr(), s = vt(), { addAbortSignal: a } = Kt(), { getHighWaterMark: w, getDefaultHighWaterMark: u } = Yt(), {
    ERR_INVALID_ARG_TYPE: d,
    ERR_METHOD_NOT_IMPLEMENTED: E,
    ERR_MULTIPLE_CALLBACK: _,
    ERR_STREAM_CANNOT_PIPE: I,
    ERR_STREAM_DESTROYED: P,
    ERR_STREAM_ALREADY_FINISHED: D,
    ERR_STREAM_NULL_VALUES: x,
    ERR_STREAM_WRITE_AFTER_END: q,
    ERR_UNKNOWN_ENCODING: K
  } = yr().codes, { errorOrDestroy: L } = s;
  p(ce.prototype, v.prototype), p(ce, v);
  function z() {
  }
  const y = b("kOnFinished");
  function F(W, oe, we) {
    typeof we != "boolean" && (we = oe instanceof Ur()), this.objectMode = !!(W && W.objectMode), we && (this.objectMode = this.objectMode || !!(W && W.writableObjectMode)), this.highWaterMark = W ? w(this, W, "writableHighWaterMark", we) : u(!1), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    const Se = !!(W && W.decodeStrings === !1);
    this.decodeStrings = !Se, this.defaultEncoding = W && W.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = k.bind(void 0, oe), this.writecb = null, this.writelen = 0, this.afterWriteTickInfo = null, ie(this), this.pendingcb = 0, this.constructed = !0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !W || W.emitClose !== !1, this.autoDestroy = !W || W.autoDestroy !== !1, this.errored = null, this.closed = !1, this.closeEmitted = !1, this[y] = [];
  }
  function ie(W) {
    W.buffered = [], W.bufferedIndex = 0, W.allBuffers = !0, W.allNoop = !0;
  }
  F.prototype.getBuffer = function() {
    return e(this.buffered, this.bufferedIndex);
  }, r(F.prototype, "bufferedRequestCount", {
    __proto__: null,
    get() {
      return this.buffered.length - this.bufferedIndex;
    }
  });
  function ce(W) {
    const oe = this instanceof Ur();
    if (!oe && !c(ce, this)) return new ce(W);
    this._writableState = new F(W, this, oe), W && (typeof W.write == "function" && (this._write = W.write), typeof W.writev == "function" && (this._writev = W.writev), typeof W.destroy == "function" && (this._destroy = W.destroy), typeof W.final == "function" && (this._final = W.final), typeof W.construct == "function" && (this._construct = W.construct), W.signal && a(W.signal, this)), v.call(this, W), s.construct(this, () => {
      const we = this._writableState;
      we.writing || H(this, we), C(this, we);
    });
  }
  r(ce, A, {
    __proto__: null,
    value: function(W) {
      return c(this, W) ? !0 : this !== ce ? !1 : W && W._writableState instanceof F;
    }
  }), ce.prototype.pipe = function() {
    L(this, new I());
  };
  function _e(W, oe, we, Se) {
    const Re = W._writableState;
    if (typeof we == "function")
      Se = we, we = Re.defaultEncoding;
    else {
      if (!we) we = Re.defaultEncoding;
      else if (we !== "buffer" && !S.isEncoding(we)) throw new K(we);
      typeof Se != "function" && (Se = z);
    }
    if (oe === null)
      throw new x();
    if (!Re.objectMode)
      if (typeof oe == "string")
        Re.decodeStrings !== !1 && (oe = S.from(oe, we), we = "buffer");
      else if (oe instanceof S)
        we = "buffer";
      else if (v._isUint8Array(oe))
        oe = v._uint8ArrayToBuffer(oe), we = "buffer";
      else
        throw new d("chunk", ["string", "Buffer", "Uint8Array"], oe);
    let Oe;
    return Re.ending ? Oe = new q() : Re.destroyed && (Oe = new P("write")), Oe ? (t.nextTick(Se, Oe), L(W, Oe, !0), Oe) : (Re.pendingcb++, be(W, Re, oe, we, Se));
  }
  ce.prototype.write = function(W, oe, we) {
    return _e(this, W, oe, we) === !0;
  }, ce.prototype.cork = function() {
    this._writableState.corked++;
  }, ce.prototype.uncork = function() {
    const W = this._writableState;
    W.corked && (W.corked--, W.writing || H(this, W));
  }, ce.prototype.setDefaultEncoding = function(oe) {
    if (typeof oe == "string" && (oe = f(oe)), !S.isEncoding(oe)) throw new K(oe);
    return this._writableState.defaultEncoding = oe, this;
  };
  function be(W, oe, we, Se, Re) {
    const Oe = oe.objectMode ? 1 : we.length;
    oe.length += Oe;
    const re = oe.length < oe.highWaterMark;
    return re || (oe.needDrain = !0), oe.writing || oe.corked || oe.errored || !oe.constructed ? (oe.buffered.push({
      chunk: we,
      encoding: Se,
      callback: Re
    }), oe.allBuffers && Se !== "buffer" && (oe.allBuffers = !1), oe.allNoop && Re !== z && (oe.allNoop = !1)) : (oe.writelen = Oe, oe.writecb = Re, oe.writing = !0, oe.sync = !0, W._write(we, Se, oe.onwrite), oe.sync = !1), re && !oe.errored && !oe.destroyed;
  }
  function ue(W, oe, we, Se, Re, Oe, re) {
    oe.writelen = Se, oe.writecb = re, oe.writing = !0, oe.sync = !0, oe.destroyed ? oe.onwrite(new P("write")) : we ? W._writev(Re, oe.onwrite) : W._write(Re, Oe, oe.onwrite), oe.sync = !1;
  }
  function le(W, oe, we, Se) {
    --oe.pendingcb, Se(we), Q(oe), L(W, we);
  }
  function k(W, oe) {
    const we = W._writableState, Se = we.sync, Re = we.writecb;
    if (typeof Re != "function") {
      L(W, new _());
      return;
    }
    we.writing = !1, we.writecb = null, we.length -= we.writelen, we.writelen = 0, oe ? (oe.stack, we.errored || (we.errored = oe), W._readableState && !W._readableState.errored && (W._readableState.errored = oe), Se ? t.nextTick(le, W, we, oe, Re) : le(W, we, oe, Re)) : (we.buffered.length > we.bufferedIndex && H(W, we), Se ? we.afterWriteTickInfo !== null && we.afterWriteTickInfo.cb === Re ? we.afterWriteTickInfo.count++ : (we.afterWriteTickInfo = {
      count: 1,
      cb: Re,
      stream: W,
      state: we
    }, t.nextTick(he, we.afterWriteTickInfo)) : X(W, we, 1, Re));
  }
  function he({ stream: W, state: oe, count: we, cb: Se }) {
    return oe.afterWriteTickInfo = null, X(W, oe, we, Se);
  }
  function X(W, oe, we, Se) {
    for (!oe.ending && !W.destroyed && oe.length === 0 && oe.needDrain && (oe.needDrain = !1, W.emit("drain")); we-- > 0; )
      oe.pendingcb--, Se();
    oe.destroyed && Q(oe), C(W, oe);
  }
  function Q(W) {
    if (W.writing)
      return;
    for (let Re = W.bufferedIndex; Re < W.buffered.length; ++Re) {
      var oe;
      const { chunk: Oe, callback: re } = W.buffered[Re], De = W.objectMode ? 1 : Oe.length;
      W.length -= De, re(
        (oe = W.errored) !== null && oe !== void 0 ? oe : new P("write")
      );
    }
    const we = W[y].splice(0);
    for (let Re = 0; Re < we.length; Re++) {
      var Se;
      we[Re](
        (Se = W.errored) !== null && Se !== void 0 ? Se : new P("end")
      );
    }
    ie(W);
  }
  function H(W, oe) {
    if (oe.corked || oe.bufferProcessing || oe.destroyed || !oe.constructed)
      return;
    const { buffered: we, bufferedIndex: Se, objectMode: Re } = oe, Oe = we.length - Se;
    if (!Oe)
      return;
    let re = Se;
    if (oe.bufferProcessing = !0, Oe > 1 && W._writev) {
      oe.pendingcb -= Oe - 1;
      const De = oe.allNoop ? z : (Pe) => {
        for (let $e = re; $e < we.length; ++$e)
          we[$e].callback(Pe);
      }, Le = oe.allNoop && re === 0 ? we : e(we, re);
      Le.allBuffers = oe.allBuffers, ue(W, oe, !0, oe.length, Le, "", De), ie(oe);
    } else {
      do {
        const { chunk: De, encoding: Le, callback: Pe } = we[re];
        we[re++] = null;
        const $e = Re ? 1 : De.length;
        ue(W, oe, !1, $e, De, Le, Pe);
      } while (re < we.length && !oe.writing);
      re === we.length ? ie(oe) : re > 256 ? (we.splice(0, re), oe.bufferedIndex = 0) : oe.bufferedIndex = re;
    }
    oe.bufferProcessing = !1;
  }
  ce.prototype._write = function(W, oe, we) {
    if (this._writev)
      this._writev(
        [
          {
            chunk: W,
            encoding: oe
          }
        ],
        we
      );
    else
      throw new E("_write()");
  }, ce.prototype._writev = null, ce.prototype.end = function(W, oe, we) {
    const Se = this._writableState;
    typeof W == "function" ? (we = W, W = null, oe = null) : typeof oe == "function" && (we = oe, oe = null);
    let Re;
    if (W != null) {
      const Oe = _e(this, W, oe);
      Oe instanceof l && (Re = Oe);
    }
    return Se.corked && (Se.corked = 1, this.uncork()), Re || (!Se.errored && !Se.ending ? (Se.ending = !0, C(this, Se, !0), Se.ended = !0) : Se.finished ? Re = new D("end") : Se.destroyed && (Re = new P("end"))), typeof we == "function" && (Re || Se.finished ? t.nextTick(we, Re) : Se[y].push(we)), this;
  };
  function se(W) {
    return W.ending && !W.destroyed && W.constructed && W.length === 0 && !W.errored && W.buffered.length === 0 && !W.finished && !W.writing && !W.errorEmitted && !W.closeEmitted;
  }
  function O(W, oe) {
    let we = !1;
    function Se(Re) {
      if (we) {
        L(W, Re ?? _());
        return;
      }
      if (we = !0, oe.pendingcb--, Re) {
        const Oe = oe[y].splice(0);
        for (let re = 0; re < Oe.length; re++)
          Oe[re](Re);
        L(W, Re, oe.sync);
      } else se(oe) && (oe.prefinished = !0, W.emit("prefinish"), oe.pendingcb++, t.nextTick(ee, W, oe));
    }
    oe.sync = !0, oe.pendingcb++;
    try {
      W._final(Se);
    } catch (Re) {
      Se(Re);
    }
    oe.sync = !1;
  }
  function B(W, oe) {
    !oe.prefinished && !oe.finalCalled && (typeof W._final == "function" && !oe.destroyed ? (oe.finalCalled = !0, O(W, oe)) : (oe.prefinished = !0, W.emit("prefinish")));
  }
  function C(W, oe, we) {
    se(oe) && (B(W, oe), oe.pendingcb === 0 && (we ? (oe.pendingcb++, t.nextTick(
      (Se, Re) => {
        se(Re) ? ee(Se, Re) : Re.pendingcb--;
      },
      W,
      oe
    )) : se(oe) && (oe.pendingcb++, ee(W, oe))));
  }
  function ee(W, oe) {
    oe.pendingcb--, oe.finished = !0;
    const we = oe[y].splice(0);
    for (let Se = 0; Se < we.length; Se++)
      we[Se]();
    if (W.emit("finish"), oe.autoDestroy) {
      const Se = W._readableState;
      (!Se || Se.autoDestroy && // We don't expect the readable to ever 'end'
      // if readable is explicitly set to false.
      (Se.endEmitted || Se.readable === !1)) && W.destroy();
    }
  }
  i(ce.prototype, {
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
      set(W) {
        this._writableState && (this._writableState.destroyed = W);
      }
    },
    writable: {
      __proto__: null,
      get() {
        const W = this._writableState;
        return !!W && W.writable !== !1 && !W.destroyed && !W.errored && !W.ending && !W.ended;
      },
      set(W) {
        this._writableState && (this._writableState.writable = !!W);
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
        const W = this._writableState;
        return W ? !W.destroyed && !W.ending && W.needDrain : !1;
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
  const te = s.destroy;
  ce.prototype.destroy = function(W, oe) {
    const we = this._writableState;
    return !we.destroyed && (we.bufferedIndex < we.buffered.length || we[y].length) && t.nextTick(Q, we), te.call(this, W, oe), this;
  }, ce.prototype._undestroy = s.undestroy, ce.prototype._destroy = function(W, oe) {
    oe(W);
  }, ce.prototype[o.captureRejectionSymbol] = function(W) {
    this.destroy(W);
  };
  let N;
  function j() {
    return N === void 0 && (N = {}), N;
  }
  return ce.fromWeb = function(W, oe) {
    return j().newStreamWritableFromWritableStream(W, oe);
  }, ce.toWeb = function(W) {
    return j().newWritableStreamFromStreamWritable(W);
  }, po;
}
var yo, Du;
function Ev() {
  if (Du) return yo;
  Du = 1;
  const t = at(), e = wr(), {
    isReadable: l,
    isWritable: c,
    isIterable: r,
    isNodeStream: i,
    isReadableNodeStream: p,
    isWritableNodeStream: f,
    isDuplexNodeStream: b,
    isReadableStream: A,
    isWritableStream: o
  } = Wr(), v = Qr(), {
    AbortError: S,
    codes: { ERR_INVALID_ARG_TYPE: s, ERR_INVALID_RETURN_VALUE: a }
  } = yr(), { destroyer: w } = vt(), u = Ur(), d = Qt(), E = Xo(), { createDeferredPromise: _ } = br(), I = jc(), P = globalThis.Blob || e.Blob, D = typeof P < "u" ? function(F) {
    return F instanceof P;
  } : function(F) {
    return !1;
  }, x = globalThis.AbortController || _t().AbortController, { FunctionPrototypeCall: q } = or();
  class K extends u {
    constructor(F) {
      super(F), (F == null ? void 0 : F.readable) === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), (F == null ? void 0 : F.writable) === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0);
    }
  }
  yo = function y(F, ie) {
    if (b(F))
      return F;
    if (p(F))
      return z({
        readable: F
      });
    if (f(F))
      return z({
        writable: F
      });
    if (i(F))
      return z({
        writable: !1,
        readable: !1
      });
    if (A(F))
      return z({
        readable: d.fromWeb(F)
      });
    if (o(F))
      return z({
        writable: E.fromWeb(F)
      });
    if (typeof F == "function") {
      const { value: _e, write: be, final: ue, destroy: le } = L(F);
      if (r(_e))
        return I(K, _e, {
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          write: be,
          final: ue,
          destroy: le
        });
      const k = _e == null ? void 0 : _e.then;
      if (typeof k == "function") {
        let he;
        const X = q(
          k,
          _e,
          (Q) => {
            if (Q != null)
              throw new a("nully", "body", Q);
          },
          (Q) => {
            w(he, Q);
          }
        );
        return he = new K({
          // TODO (ronag): highWaterMark?
          objectMode: !0,
          readable: !1,
          write: be,
          final(Q) {
            ue(async () => {
              try {
                await X, t.nextTick(Q, null);
              } catch (H) {
                t.nextTick(Q, H);
              }
            });
          },
          destroy: le
        });
      }
      throw new a("Iterable, AsyncIterable or AsyncFunction", ie, _e);
    }
    if (D(F))
      return y(F.arrayBuffer());
    if (r(F))
      return I(K, F, {
        // TODO (ronag): highWaterMark?
        objectMode: !0,
        writable: !1
      });
    if (A(F == null ? void 0 : F.readable) && o(F == null ? void 0 : F.writable))
      return K.fromWeb(F);
    if (typeof (F == null ? void 0 : F.writable) == "object" || typeof (F == null ? void 0 : F.readable) == "object") {
      const _e = F != null && F.readable ? p(F == null ? void 0 : F.readable) ? F == null ? void 0 : F.readable : y(F.readable) : void 0, be = F != null && F.writable ? f(F == null ? void 0 : F.writable) ? F == null ? void 0 : F.writable : y(F.writable) : void 0;
      return z({
        readable: _e,
        writable: be
      });
    }
    const ce = F == null ? void 0 : F.then;
    if (typeof ce == "function") {
      let _e;
      return q(
        ce,
        F,
        (be) => {
          be != null && _e.push(be), _e.push(null);
        },
        (be) => {
          w(_e, be);
        }
      ), _e = new K({
        objectMode: !0,
        writable: !1,
        read() {
        }
      });
    }
    throw new s(
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
      F
    );
  };
  function L(y) {
    let { promise: F, resolve: ie } = _();
    const ce = new x(), _e = ce.signal;
    return {
      value: y(
        (async function* () {
          for (; ; ) {
            const ue = F;
            F = null;
            const { chunk: le, done: k, cb: he } = await ue;
            if (t.nextTick(he), k) return;
            if (_e.aborted)
              throw new S(void 0, {
                cause: _e.reason
              });
            ({ promise: F, resolve: ie } = _()), yield le;
          }
        })(),
        {
          signal: _e
        }
      ),
      write(ue, le, k) {
        const he = ie;
        ie = null, he({
          chunk: ue,
          done: !1,
          cb: k
        });
      },
      final(ue) {
        const le = ie;
        ie = null, le({
          done: !0,
          cb: ue
        });
      },
      destroy(ue, le) {
        ce.abort(), le(ue);
      }
    };
  }
  function z(y) {
    const F = y.readable && typeof y.readable.read != "function" ? d.wrap(y.readable) : y.readable, ie = y.writable;
    let ce = !!l(F), _e = !!c(ie), be, ue, le, k, he;
    function X(Q) {
      const H = k;
      k = null, H ? H(Q) : Q && he.destroy(Q);
    }
    return he = new K({
      // TODO (ronag): highWaterMark?
      readableObjectMode: !!(F != null && F.readableObjectMode),
      writableObjectMode: !!(ie != null && ie.writableObjectMode),
      readable: ce,
      writable: _e
    }), _e && (v(ie, (Q) => {
      _e = !1, Q && w(F, Q), X(Q);
    }), he._write = function(Q, H, se) {
      ie.write(Q, H) ? se() : be = se;
    }, he._final = function(Q) {
      ie.end(), ue = Q;
    }, ie.on("drain", function() {
      if (be) {
        const Q = be;
        be = null, Q();
      }
    }), ie.on("finish", function() {
      if (ue) {
        const Q = ue;
        ue = null, Q();
      }
    })), ce && (v(F, (Q) => {
      ce = !1, Q && w(F, Q), X(Q);
    }), F.on("readable", function() {
      if (le) {
        const Q = le;
        le = null, Q();
      }
    }), F.on("end", function() {
      he.push(null);
    }), he._read = function() {
      for (; ; ) {
        const Q = F.read();
        if (Q === null) {
          le = he._read;
          return;
        }
        if (!he.push(Q))
          return;
      }
    }), he._destroy = function(Q, H) {
      !Q && k !== null && (Q = new S()), le = null, be = null, ue = null, k === null ? H(Q) : (k = H, w(ie, Q), w(F, Q));
    }, he;
  }
  return yo;
}
var vo, Nu;
function Ur() {
  if (Nu) return vo;
  Nu = 1;
  const {
    ObjectDefineProperties: t,
    ObjectGetOwnPropertyDescriptor: e,
    ObjectKeys: l,
    ObjectSetPrototypeOf: c
  } = or();
  vo = p;
  const r = Qt(), i = Xo();
  c(p.prototype, r.prototype), c(p, r);
  {
    const o = l(i.prototype);
    for (let v = 0; v < o.length; v++) {
      const S = o[v];
      p.prototype[S] || (p.prototype[S] = i.prototype[S]);
    }
  }
  function p(o) {
    if (!(this instanceof p)) return new p(o);
    r.call(this, o), i.call(this, o), o ? (this.allowHalfOpen = o.allowHalfOpen !== !1, o.readable === !1 && (this._readableState.readable = !1, this._readableState.ended = !0, this._readableState.endEmitted = !0), o.writable === !1 && (this._writableState.writable = !1, this._writableState.ending = !0, this._writableState.ended = !0, this._writableState.finished = !0)) : this.allowHalfOpen = !0;
  }
  t(p.prototype, {
    writable: {
      __proto__: null,
      ...e(i.prototype, "writable")
    },
    writableHighWaterMark: {
      __proto__: null,
      ...e(i.prototype, "writableHighWaterMark")
    },
    writableObjectMode: {
      __proto__: null,
      ...e(i.prototype, "writableObjectMode")
    },
    writableBuffer: {
      __proto__: null,
      ...e(i.prototype, "writableBuffer")
    },
    writableLength: {
      __proto__: null,
      ...e(i.prototype, "writableLength")
    },
    writableFinished: {
      __proto__: null,
      ...e(i.prototype, "writableFinished")
    },
    writableCorked: {
      __proto__: null,
      ...e(i.prototype, "writableCorked")
    },
    writableEnded: {
      __proto__: null,
      ...e(i.prototype, "writableEnded")
    },
    writableNeedDrain: {
      __proto__: null,
      ...e(i.prototype, "writableNeedDrain")
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
      },
      set(o) {
        this._readableState && this._writableState && (this._readableState.destroyed = o, this._writableState.destroyed = o);
      }
    }
  });
  let f;
  function b() {
    return f === void 0 && (f = {}), f;
  }
  p.fromWeb = function(o, v) {
    return b().newStreamDuplexFromReadableWritablePair(o, v);
  }, p.toWeb = function(o) {
    return b().newReadableWritablePairFromDuplex(o);
  };
  let A;
  return p.from = function(o) {
    return A || (A = Ev()), A(o, "body");
  }, vo;
}
var go, Bu;
function Mc() {
  if (Bu) return go;
  Bu = 1;
  const { ObjectSetPrototypeOf: t, Symbol: e } = or();
  go = p;
  const { ERR_METHOD_NOT_IMPLEMENTED: l } = yr().codes, c = Ur(), { getHighWaterMark: r } = Yt();
  t(p.prototype, c.prototype), t(p, c);
  const i = e("kCallback");
  function p(A) {
    if (!(this instanceof p)) return new p(A);
    const o = A ? r(this, A, "readableHighWaterMark", !0) : null;
    o === 0 && (A = {
      ...A,
      highWaterMark: null,
      readableHighWaterMark: o,
      // TODO (ronag): 0 is not optimal since we have
      // a "bug" where we check needDrain before calling _write and not after.
      // Refs: https://github.com/nodejs/node/pull/32887
      // Refs: https://github.com/nodejs/node/pull/35941
      writableHighWaterMark: A.writableHighWaterMark || 0
    }), c.call(this, A), this._readableState.sync = !1, this[i] = null, A && (typeof A.transform == "function" && (this._transform = A.transform), typeof A.flush == "function" && (this._flush = A.flush)), this.on("prefinish", b);
  }
  function f(A) {
    typeof this._flush == "function" && !this.destroyed ? this._flush((o, v) => {
      if (o) {
        A ? A(o) : this.destroy(o);
        return;
      }
      v != null && this.push(v), this.push(null), A && A();
    }) : (this.push(null), A && A());
  }
  function b() {
    this._final !== f && f.call(this);
  }
  return p.prototype._final = f, p.prototype._transform = function(A, o, v) {
    throw new l("_transform()");
  }, p.prototype._write = function(A, o, v) {
    const S = this._readableState, s = this._writableState, a = S.length;
    this._transform(A, o, (w, u) => {
      if (w) {
        v(w);
        return;
      }
      u != null && this.push(u), s.ended || // Backwards compat.
      a === S.length || // Backwards compat.
      S.length < S.highWaterMark ? v() : this[i] = v;
    });
  }, p.prototype._read = function() {
    if (this[i]) {
      const A = this[i];
      this[i] = null, A();
    }
  }, go;
}
var mo, Lu;
function kc() {
  if (Lu) return mo;
  Lu = 1;
  const { ObjectSetPrototypeOf: t } = or();
  mo = l;
  const e = Mc();
  t(l.prototype, e.prototype), t(l, e);
  function l(c) {
    if (!(this instanceof l)) return new l(c);
    e.call(this, c);
  }
  return l.prototype._transform = function(c, r, i) {
    i(null, c);
  }, mo;
}
var bo, Cu;
function es() {
  if (Cu) return bo;
  Cu = 1;
  const t = at(), { ArrayIsArray: e, Promise: l, SymbolAsyncIterator: c, SymbolDispose: r } = or(), i = Qr(), { once: p } = br(), f = vt(), b = Ur(), {
    aggregateTwoErrors: A,
    codes: {
      ERR_INVALID_ARG_TYPE: o,
      ERR_INVALID_RETURN_VALUE: v,
      ERR_MISSING_ARGS: S,
      ERR_STREAM_DESTROYED: s,
      ERR_STREAM_PREMATURE_CLOSE: a
    },
    AbortError: w
  } = yr(), { validateFunction: u, validateAbortSignal: d } = Rt(), {
    isIterable: E,
    isReadable: _,
    isReadableNodeStream: I,
    isNodeStream: P,
    isTransformStream: D,
    isWebStream: x,
    isReadableStream: q,
    isReadableFinished: K
  } = Wr(), L = globalThis.AbortController || _t().AbortController;
  let z, y, F;
  function ie(Q, H, se) {
    let O = !1;
    Q.on("close", () => {
      O = !0;
    });
    const B = i(
      Q,
      {
        readable: H,
        writable: se
      },
      (C) => {
        O = !C;
      }
    );
    return {
      destroy: (C) => {
        O || (O = !0, f.destroyer(Q, C || new s("pipe")));
      },
      cleanup: B
    };
  }
  function ce(Q) {
    return u(Q[Q.length - 1], "streams[stream.length - 1]"), Q.pop();
  }
  function _e(Q) {
    if (E(Q))
      return Q;
    if (I(Q))
      return be(Q);
    throw new o("val", ["Readable", "Iterable", "AsyncIterable"], Q);
  }
  async function* be(Q) {
    y || (y = Qt()), yield* y.prototype[c].call(Q);
  }
  async function ue(Q, H, se, { end: O }) {
    let B, C = null;
    const ee = (j) => {
      if (j && (B = j), C) {
        const W = C;
        C = null, W();
      }
    }, te = () => new l((j, W) => {
      B ? W(B) : C = () => {
        B ? W(B) : j();
      };
    });
    H.on("drain", ee);
    const N = i(
      H,
      {
        readable: !1
      },
      ee
    );
    try {
      H.writableNeedDrain && await te();
      for await (const j of Q)
        H.write(j) || await te();
      O && (H.end(), await te()), se();
    } catch (j) {
      se(B !== j ? A(B, j) : j);
    } finally {
      N(), H.off("drain", ee);
    }
  }
  async function le(Q, H, se, { end: O }) {
    D(H) && (H = H.writable);
    const B = H.getWriter();
    try {
      for await (const C of Q)
        await B.ready, B.write(C).catch(() => {
        });
      await B.ready, O && await B.close(), se();
    } catch (C) {
      try {
        await B.abort(C), se(C);
      } catch (ee) {
        se(ee);
      }
    }
  }
  function k(...Q) {
    return he(Q, p(ce(Q)));
  }
  function he(Q, H, se) {
    if (Q.length === 1 && e(Q[0]) && (Q = Q[0]), Q.length < 2)
      throw new S("streams");
    const O = new L(), B = O.signal, C = se == null ? void 0 : se.signal, ee = [];
    d(C, "options.signal");
    function te() {
      Re(new w());
    }
    F = F || br().addAbortListener;
    let N;
    C && (N = F(C, te));
    let j, W;
    const oe = [];
    let we = 0;
    function Se(Le) {
      Re(Le, --we === 0);
    }
    function Re(Le, Pe) {
      var $e;
      if (Le && (!j || j.code === "ERR_STREAM_PREMATURE_CLOSE") && (j = Le), !(!j && !Pe)) {
        for (; oe.length; )
          oe.shift()(j);
        ($e = N) === null || $e === void 0 || $e[r](), O.abort(), Pe && (j || ee.forEach((ve) => ve()), t.nextTick(H, j, W));
      }
    }
    let Oe;
    for (let Le = 0; Le < Q.length; Le++) {
      const Pe = Q[Le], $e = Le < Q.length - 1, ve = Le > 0, Ee = $e || (se == null ? void 0 : se.end) !== !1, je = Le === Q.length - 1;
      if (P(Pe)) {
        let qe = function(Me) {
          Me && Me.name !== "AbortError" && Me.code !== "ERR_STREAM_PREMATURE_CLOSE" && Se(Me);
        };
        if (Ee) {
          const { destroy: Me, cleanup: We } = ie(Pe, $e, ve);
          oe.push(Me), _(Pe) && je && ee.push(We);
        }
        Pe.on("error", qe), _(Pe) && je && ee.push(() => {
          Pe.removeListener("error", qe);
        });
      }
      if (Le === 0)
        if (typeof Pe == "function") {
          if (Oe = Pe({
            signal: B
          }), !E(Oe))
            throw new v("Iterable, AsyncIterable or Stream", "source", Oe);
        } else E(Pe) || I(Pe) || D(Pe) ? Oe = Pe : Oe = b.from(Pe);
      else if (typeof Pe == "function") {
        if (D(Oe)) {
          var re;
          Oe = _e((re = Oe) === null || re === void 0 ? void 0 : re.readable);
        } else
          Oe = _e(Oe);
        if (Oe = Pe(Oe, {
          signal: B
        }), $e) {
          if (!E(Oe, !0))
            throw new v("AsyncIterable", `transform[${Le - 1}]`, Oe);
        } else {
          var De;
          z || (z = kc());
          const qe = new z({
            objectMode: !0
          }), Me = (De = Oe) === null || De === void 0 ? void 0 : De.then;
          if (typeof Me == "function")
            we++, Me.call(
              Oe,
              (n) => {
                W = n, n != null && qe.write(n), Ee && qe.end(), t.nextTick(Se);
              },
              (n) => {
                qe.destroy(n), t.nextTick(Se, n);
              }
            );
          else if (E(Oe, !0))
            we++, ue(Oe, qe, Se, {
              end: Ee
            });
          else if (q(Oe) || D(Oe)) {
            const n = Oe.readable || Oe;
            we++, ue(n, qe, Se, {
              end: Ee
            });
          } else
            throw new v("AsyncIterable or Promise", "destination", Oe);
          Oe = qe;
          const { destroy: We, cleanup: $ } = ie(Oe, !1, !0);
          oe.push(We), je && ee.push($);
        }
      } else if (P(Pe)) {
        if (I(Oe)) {
          we += 2;
          const qe = X(Oe, Pe, Se, {
            end: Ee
          });
          _(Pe) && je && ee.push(qe);
        } else if (D(Oe) || q(Oe)) {
          const qe = Oe.readable || Oe;
          we++, ue(qe, Pe, Se, {
            end: Ee
          });
        } else if (E(Oe))
          we++, ue(Oe, Pe, Se, {
            end: Ee
          });
        else
          throw new o(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Pe;
      } else if (x(Pe)) {
        if (I(Oe))
          we++, le(_e(Oe), Pe, Se, {
            end: Ee
          });
        else if (q(Oe) || E(Oe))
          we++, le(Oe, Pe, Se, {
            end: Ee
          });
        else if (D(Oe))
          we++, le(Oe.readable, Pe, Se, {
            end: Ee
          });
        else
          throw new o(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            Oe
          );
        Oe = Pe;
      } else
        Oe = b.from(Pe);
    }
    return (B != null && B.aborted || C != null && C.aborted) && t.nextTick(te), Oe;
  }
  function X(Q, H, se, { end: O }) {
    let B = !1;
    if (H.on("close", () => {
      B || se(new a());
    }), Q.pipe(H, {
      end: !1
    }), O) {
      let C = function() {
        B = !0, H.end();
      };
      K(Q) ? t.nextTick(C) : Q.once("end", C);
    } else
      se();
    return i(
      Q,
      {
        readable: !0,
        writable: !1
      },
      (C) => {
        const ee = Q._readableState;
        C && C.code === "ERR_STREAM_PREMATURE_CLOSE" && ee && ee.ended && !ee.errored && !ee.errorEmitted ? Q.once("end", se).once("error", se) : se(C);
      }
    ), i(
      H,
      {
        readable: !1,
        writable: !0
      },
      se
    );
  }
  return bo = {
    pipelineImpl: he,
    pipeline: k
  }, bo;
}
var wo, ju;
function qc() {
  if (ju) return wo;
  ju = 1;
  const { pipeline: t } = es(), e = Ur(), { destroyer: l } = vt(), {
    isNodeStream: c,
    isReadable: r,
    isWritable: i,
    isWebStream: p,
    isTransformStream: f,
    isWritableStream: b,
    isReadableStream: A
  } = Wr(), {
    AbortError: o,
    codes: { ERR_INVALID_ARG_VALUE: v, ERR_MISSING_ARGS: S }
  } = yr(), s = Qr();
  return wo = function(...w) {
    if (w.length === 0)
      throw new S("streams");
    if (w.length === 1)
      return e.from(w[0]);
    const u = [...w];
    if (typeof w[0] == "function" && (w[0] = e.from(w[0])), typeof w[w.length - 1] == "function") {
      const z = w.length - 1;
      w[z] = e.from(w[z]);
    }
    for (let z = 0; z < w.length; ++z)
      if (!(!c(w[z]) && !p(w[z]))) {
        if (z < w.length - 1 && !(r(w[z]) || A(w[z]) || f(w[z])))
          throw new v(`streams[${z}]`, u[z], "must be readable");
        if (z > 0 && !(i(w[z]) || b(w[z]) || f(w[z])))
          throw new v(`streams[${z}]`, u[z], "must be writable");
      }
    let d, E, _, I, P;
    function D(z) {
      const y = I;
      I = null, y ? y(z) : z ? P.destroy(z) : !L && !K && P.destroy();
    }
    const x = w[0], q = t(w, D), K = !!(i(x) || b(x) || f(x)), L = !!(r(q) || A(q) || f(q));
    if (P = new e({
      // TODO (ronag): highWaterMark?
      writableObjectMode: !!(x != null && x.writableObjectMode),
      readableObjectMode: !!(q != null && q.readableObjectMode),
      writable: K,
      readable: L
    }), K) {
      if (c(x))
        P._write = function(y, F, ie) {
          x.write(y, F) ? ie() : d = ie;
        }, P._final = function(y) {
          x.end(), E = y;
        }, x.on("drain", function() {
          if (d) {
            const y = d;
            d = null, y();
          }
        });
      else if (p(x)) {
        const F = (f(x) ? x.writable : x).getWriter();
        P._write = async function(ie, ce, _e) {
          try {
            await F.ready, F.write(ie).catch(() => {
            }), _e();
          } catch (be) {
            _e(be);
          }
        }, P._final = async function(ie) {
          try {
            await F.ready, F.close().catch(() => {
            }), E = ie;
          } catch (ce) {
            ie(ce);
          }
        };
      }
      const z = f(q) ? q.readable : q;
      s(z, () => {
        if (E) {
          const y = E;
          E = null, y();
        }
      });
    }
    if (L) {
      if (c(q))
        q.on("readable", function() {
          if (_) {
            const z = _;
            _ = null, z();
          }
        }), q.on("end", function() {
          P.push(null);
        }), P._read = function() {
          for (; ; ) {
            const z = q.read();
            if (z === null) {
              _ = P._read;
              return;
            }
            if (!P.push(z))
              return;
          }
        };
      else if (p(q)) {
        const y = (f(q) ? q.readable : q).getReader();
        P._read = async function() {
          for (; ; )
            try {
              const { value: F, done: ie } = await y.read();
              if (!P.push(F))
                return;
              if (ie) {
                P.push(null);
                return;
              }
            } catch {
              return;
            }
        };
      }
    }
    return P._destroy = function(z, y) {
      !z && I !== null && (z = new o()), _ = null, d = null, E = null, I === null ? y(z) : (I = y, c(q) && l(q, z));
    }, P;
  }, wo;
}
var Mu;
function Sv() {
  if (Mu) return qt;
  Mu = 1;
  const t = globalThis.AbortController || _t().AbortController, {
    codes: { ERR_INVALID_ARG_VALUE: e, ERR_INVALID_ARG_TYPE: l, ERR_MISSING_ARGS: c, ERR_OUT_OF_RANGE: r },
    AbortError: i
  } = yr(), { validateAbortSignal: p, validateInteger: f, validateObject: b } = Rt(), A = or().Symbol("kWeak"), o = or().Symbol("kResistStopPropagation"), { finished: v } = Qr(), S = qc(), { addAbortSignalNoValidate: s } = Kt(), { isWritable: a, isNodeStream: w } = Wr(), { deprecate: u } = br(), {
    ArrayPrototypePush: d,
    Boolean: E,
    MathFloor: _,
    Number: I,
    NumberIsNaN: P,
    Promise: D,
    PromiseReject: x,
    PromiseResolve: q,
    PromisePrototypeThen: K,
    Symbol: L
  } = or(), z = L("kEmpty"), y = L("kEof");
  function F(C, ee) {
    if (ee != null && b(ee, "options"), (ee == null ? void 0 : ee.signal) != null && p(ee.signal, "options.signal"), w(C) && !a(C))
      throw new e("stream", C, "must be writable");
    const te = S(this, C);
    return ee != null && ee.signal && s(ee.signal, te), te;
  }
  function ie(C, ee) {
    if (typeof C != "function")
      throw new l("fn", ["Function", "AsyncFunction"], C);
    ee != null && b(ee, "options"), (ee == null ? void 0 : ee.signal) != null && p(ee.signal, "options.signal");
    let te = 1;
    (ee == null ? void 0 : ee.concurrency) != null && (te = _(ee.concurrency));
    let N = te - 1;
    return (ee == null ? void 0 : ee.highWaterMark) != null && (N = _(ee.highWaterMark)), f(te, "options.concurrency", 1), f(N, "options.highWaterMark", 0), N += te, (async function* () {
      const W = br().AbortSignalAny(
        [ee == null ? void 0 : ee.signal].filter(E)
      ), oe = this, we = [], Se = {
        signal: W
      };
      let Re, Oe, re = !1, De = 0;
      function Le() {
        re = !0, Pe();
      }
      function Pe() {
        De -= 1, $e();
      }
      function $e() {
        Oe && !re && De < te && we.length < N && (Oe(), Oe = null);
      }
      async function ve() {
        try {
          for await (let Ee of oe) {
            if (re)
              return;
            if (W.aborted)
              throw new i();
            try {
              if (Ee = C(Ee, Se), Ee === z)
                continue;
              Ee = q(Ee);
            } catch (je) {
              Ee = x(je);
            }
            De += 1, K(Ee, Pe, Le), we.push(Ee), Re && (Re(), Re = null), !re && (we.length >= N || De >= te) && await new D((je) => {
              Oe = je;
            });
          }
          we.push(y);
        } catch (Ee) {
          const je = x(Ee);
          K(je, Pe, Le), we.push(je);
        } finally {
          re = !0, Re && (Re(), Re = null);
        }
      }
      ve();
      try {
        for (; ; ) {
          for (; we.length > 0; ) {
            const Ee = await we[0];
            if (Ee === y)
              return;
            if (W.aborted)
              throw new i();
            Ee !== z && (yield Ee), we.shift(), $e();
          }
          await new D((Ee) => {
            Re = Ee;
          });
        }
      } finally {
        re = !0, Oe && (Oe(), Oe = null);
      }
    }).call(this);
  }
  function ce(C = void 0) {
    return C != null && b(C, "options"), (C == null ? void 0 : C.signal) != null && p(C.signal, "options.signal"), (async function* () {
      let te = 0;
      for await (const j of this) {
        var N;
        if (C != null && (N = C.signal) !== null && N !== void 0 && N.aborted)
          throw new i({
            cause: C.signal.reason
          });
        yield [te++, j];
      }
    }).call(this);
  }
  async function _e(C, ee = void 0) {
    for await (const te of k.call(this, C, ee))
      return !0;
    return !1;
  }
  async function be(C, ee = void 0) {
    if (typeof C != "function")
      throw new l("fn", ["Function", "AsyncFunction"], C);
    return !await _e.call(
      this,
      async (...te) => !await C(...te),
      ee
    );
  }
  async function ue(C, ee) {
    for await (const te of k.call(this, C, ee))
      return te;
  }
  async function le(C, ee) {
    if (typeof C != "function")
      throw new l("fn", ["Function", "AsyncFunction"], C);
    async function te(N, j) {
      return await C(N, j), z;
    }
    for await (const N of ie.call(this, te, ee)) ;
  }
  function k(C, ee) {
    if (typeof C != "function")
      throw new l("fn", ["Function", "AsyncFunction"], C);
    async function te(N, j) {
      return await C(N, j) ? N : z;
    }
    return ie.call(this, te, ee);
  }
  class he extends c {
    constructor() {
      super("reduce"), this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function X(C, ee, te) {
    var N;
    if (typeof C != "function")
      throw new l("reducer", ["Function", "AsyncFunction"], C);
    te != null && b(te, "options"), (te == null ? void 0 : te.signal) != null && p(te.signal, "options.signal");
    let j = arguments.length > 1;
    if (te != null && (N = te.signal) !== null && N !== void 0 && N.aborted) {
      const Re = new i(void 0, {
        cause: te.signal.reason
      });
      throw this.once("error", () => {
      }), await v(this.destroy(Re)), Re;
    }
    const W = new t(), oe = W.signal;
    if (te != null && te.signal) {
      const Re = {
        once: !0,
        [A]: this,
        [o]: !0
      };
      te.signal.addEventListener("abort", () => W.abort(), Re);
    }
    let we = !1;
    try {
      for await (const Re of this) {
        var Se;
        if (we = !0, te != null && (Se = te.signal) !== null && Se !== void 0 && Se.aborted)
          throw new i();
        j ? ee = await C(ee, Re, {
          signal: oe
        }) : (ee = Re, j = !0);
      }
      if (!we && !j)
        throw new he();
    } finally {
      W.abort();
    }
    return ee;
  }
  async function Q(C) {
    C != null && b(C, "options"), (C == null ? void 0 : C.signal) != null && p(C.signal, "options.signal");
    const ee = [];
    for await (const N of this) {
      var te;
      if (C != null && (te = C.signal) !== null && te !== void 0 && te.aborted)
        throw new i(void 0, {
          cause: C.signal.reason
        });
      d(ee, N);
    }
    return ee;
  }
  function H(C, ee) {
    const te = ie.call(this, C, ee);
    return (async function* () {
      for await (const j of te)
        yield* j;
    }).call(this);
  }
  function se(C) {
    if (C = I(C), P(C))
      return 0;
    if (C < 0)
      throw new r("number", ">= 0", C);
    return C;
  }
  function O(C, ee = void 0) {
    return ee != null && b(ee, "options"), (ee == null ? void 0 : ee.signal) != null && p(ee.signal, "options.signal"), C = se(C), (async function* () {
      var N;
      if (ee != null && (N = ee.signal) !== null && N !== void 0 && N.aborted)
        throw new i();
      for await (const W of this) {
        var j;
        if (ee != null && (j = ee.signal) !== null && j !== void 0 && j.aborted)
          throw new i();
        C-- <= 0 && (yield W);
      }
    }).call(this);
  }
  function B(C, ee = void 0) {
    return ee != null && b(ee, "options"), (ee == null ? void 0 : ee.signal) != null && p(ee.signal, "options.signal"), C = se(C), (async function* () {
      var N;
      if (ee != null && (N = ee.signal) !== null && N !== void 0 && N.aborted)
        throw new i();
      for await (const W of this) {
        var j;
        if (ee != null && (j = ee.signal) !== null && j !== void 0 && j.aborted)
          throw new i();
        if (C-- > 0 && (yield W), C <= 0)
          return;
      }
    }).call(this);
  }
  return qt.streamReturningOperators = {
    asIndexedPairs: u(ce, "readable.asIndexedPairs will be removed in a future version."),
    drop: O,
    filter: k,
    flatMap: H,
    map: ie,
    take: B,
    compose: F
  }, qt.promiseReturningOperators = {
    every: be,
    forEach: le,
    reduce: X,
    toArray: Q,
    some: _e,
    find: ue
  }, qt;
}
var _o, ku;
function $c() {
  if (ku) return _o;
  ku = 1;
  const { ArrayPrototypePop: t, Promise: e } = or(), { isIterable: l, isNodeStream: c, isWebStream: r } = Wr(), { pipelineImpl: i } = es(), { finished: p } = Qr();
  Uc();
  function f(...b) {
    return new e((A, o) => {
      let v, S;
      const s = b[b.length - 1];
      if (s && typeof s == "object" && !c(s) && !l(s) && !r(s)) {
        const a = t(b);
        v = a.signal, S = a.end;
      }
      i(
        b,
        (a, w) => {
          a ? o(a) : A(w);
        },
        {
          signal: v,
          end: S
        }
      );
    });
  }
  return _o = {
    finished: p,
    pipeline: f
  }, _o;
}
var qu;
function Uc() {
  if (qu) return Ja.exports;
  qu = 1;
  const { Buffer: t } = wr(), { ObjectDefineProperty: e, ObjectKeys: l, ReflectApply: c } = or(), {
    promisify: { custom: r }
  } = br(), { streamReturningOperators: i, promiseReturningOperators: p } = Sv(), {
    codes: { ERR_ILLEGAL_CONSTRUCTOR: f }
  } = yr(), b = qc(), { setDefaultHighWaterMark: A, getDefaultHighWaterMark: o } = Yt(), { pipeline: v } = es(), { destroyer: S } = vt(), s = Qr(), a = $c(), w = Wr(), u = Ja.exports = Jo().Stream;
  u.isDestroyed = w.isDestroyed, u.isDisturbed = w.isDisturbed, u.isErrored = w.isErrored, u.isReadable = w.isReadable, u.isWritable = w.isWritable, u.Readable = Qt();
  for (const E of l(i)) {
    let I = function(...P) {
      if (new.target)
        throw f();
      return u.Readable.from(c(_, this, P));
    };
    const _ = i[E];
    e(I, "name", {
      __proto__: null,
      value: _.name
    }), e(I, "length", {
      __proto__: null,
      value: _.length
    }), e(u.Readable.prototype, E, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  for (const E of l(p)) {
    let I = function(...P) {
      if (new.target)
        throw f();
      return c(_, this, P);
    };
    const _ = p[E];
    e(I, "name", {
      __proto__: null,
      value: _.name
    }), e(I, "length", {
      __proto__: null,
      value: _.length
    }), e(u.Readable.prototype, E, {
      __proto__: null,
      value: I,
      enumerable: !1,
      configurable: !0,
      writable: !0
    });
  }
  u.Writable = Xo(), u.Duplex = Ur(), u.Transform = Mc(), u.PassThrough = kc(), u.pipeline = v;
  const { addAbortSignal: d } = Kt();
  return u.addAbortSignal = d, u.finished = s, u.destroy = S, u.compose = b, u.setDefaultHighWaterMark = A, u.getDefaultHighWaterMark = o, e(u, "promises", {
    __proto__: null,
    configurable: !0,
    enumerable: !0,
    get() {
      return a;
    }
  }), e(v, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return a.pipeline;
    }
  }), e(s, r, {
    __proto__: null,
    enumerable: !0,
    get() {
      return a.finished;
    }
  }), u.Stream = u, u._isUint8Array = function(_) {
    return _ instanceof Uint8Array;
  }, u._uint8ArrayToBuffer = function(_) {
    return t.from(_.buffer, _.byteOffset, _.byteLength);
  }, Ja.exports;
}
var $u;
function Rv() {
  return $u || ($u = 1, (function(t) {
    const e = Uc(), l = $c(), c = e.Readable.destroy;
    t.exports = e.Readable, t.exports._uint8ArrayToBuffer = e._uint8ArrayToBuffer, t.exports._isUint8Array = e._isUint8Array, t.exports.isDisturbed = e.isDisturbed, t.exports.isErrored = e.isErrored, t.exports.isReadable = e.isReadable, t.exports.Readable = e.Readable, t.exports.Writable = e.Writable, t.exports.Duplex = e.Duplex, t.exports.Transform = e.Transform, t.exports.PassThrough = e.PassThrough, t.exports.addAbortSignal = e.addAbortSignal, t.exports.finished = e.finished, t.exports.destroy = e.destroy, t.exports.destroy = c, t.exports.pipeline = e.pipeline, t.exports.compose = e.compose, Object.defineProperty(e, "promises", {
      configurable: !0,
      enumerable: !0,
      get() {
        return l;
      }
    }), t.exports.Stream = e.Stream, t.exports.default = t.exports;
  })(Qa)), Qa.exports;
}
var Eo, Uu;
function So() {
  if (Uu) return Eo;
  Uu = 1;
  const t = Rv().Transform;
  class e extends t {
    constructor(i, p) {
      super({ writableObjectMode: !0 }), this.proto = i, this.mainType = p, this.queue = dr.alloc(0);
    }
    createPacketBuffer(i) {
      return this.proto.createPacketBuffer(this.mainType, i);
    }
    _transform(i, p, f) {
      let b;
      try {
        b = this.createPacketBuffer(i);
      } catch (A) {
        return f(A);
      }
      return this.push(b), f();
    }
  }
  class l extends t {
    constructor(i, p) {
      super({ readableObjectMode: !0 }), this.proto = i, this.mainType = p, this.queue = dr.alloc(0);
    }
    parsePacketBuffer(i) {
      return this.proto.parsePacketBuffer(this.mainType, i);
    }
    _transform(i, p, f) {
      for (this.queue = dr.concat([this.queue, i]); ; ) {
        let b;
        try {
          b = this.parsePacketBuffer(this.queue);
        } catch (A) {
          return A.partialReadError ? f() : (A.buffer = this.queue, this.queue = dr.alloc(0), f(A));
        }
        this.push(b), this.queue = this.queue.slice(b.metadata.size);
      }
    }
  }
  class c extends t {
    constructor(i, p, f = !1) {
      super({ readableObjectMode: !0 }), this.proto = i, this.mainType = p, this.noErrorLogging = f;
    }
    parsePacketBuffer(i) {
      return this.proto.parsePacketBuffer(this.mainType, i);
    }
    _transform(i, p, f) {
      let b;
      try {
        b = this.parsePacketBuffer(i), b.metadata.size !== i.length && !this.noErrorLogging && console.log("Chunk size is " + i.length + " but only " + b.metadata.size + " was read ; partial packet : " + JSON.stringify(b.data) + "; buffer :" + i.toString("hex"));
      } catch (A) {
        return A.partialReadError ? (this.noErrorLogging || console.log(A.stack), f()) : f(A);
      }
      this.push(b), f();
    }
  }
  return Eo = {
    Serializer: e,
    Parser: l,
    FullPacketParser: c
  }, Eo;
}
var Ro, zu;
function Av() {
  return zu || (zu = 1, Ro = {
    Read: {
      switch: ["parametrizable", (t, e) => {
        let l = e.compareTo ? e.compareTo : e.compareToValue;
        const c = [];
        l.startsWith("$") ? c.push(l) : e.compareTo && (l = t.getField(l, !0));
        let r = `switch (${l}) {
`;
        for (const i in e.fields) {
          let p = i;
          p.startsWith("/") ? p = "ctx." + p.slice(1) : isNaN(p) && p !== "true" && p !== "false" && (p = `"${p}"`), r += t.indent(`case ${p}: return ` + t.callType(e.fields[i])) + `
`;
        }
        return r += t.indent("default: return " + t.callType(e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, c);
      }],
      option: ["parametrizable", (t, e) => {
        let l = `const {value} = ctx.bool(buffer, offset)
`;
        return l += `if (value) {
`, l += "  const { value, size } = " + t.callType(e, "offset + 1") + `
`, l += `  return { value, size: size + 1 }
`, l += `}
`, l += "return { value: undefined, size: 1}", t.wrapCode(l);
      }]
    },
    Write: {
      switch: ["parametrizable", (t, e) => {
        let l = e.compareTo ? e.compareTo : e.compareToValue;
        const c = [];
        l.startsWith("$") ? c.push(l) : e.compareTo && (l = t.getField(l, !0));
        let r = `switch (${l}) {
`;
        for (const i in e.fields) {
          let p = i;
          p.startsWith("/") ? p = "ctx." + p.slice(1) : isNaN(p) && p !== "true" && p !== "false" && (p = `"${p}"`), r += t.indent(`case ${p}: return ` + t.callType("value", e.fields[i])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, c);
      }],
      option: ["parametrizable", (t, e) => {
        let l = `if (value != null) {
`;
        return l += `  offset = ctx.bool(1, buffer, offset)
`, l += "  offset = " + t.callType("value", e) + `
`, l += `} else {
`, l += `  offset = ctx.bool(0, buffer, offset)
`, l += `}
`, l += "return offset", t.wrapCode(l);
      }]
    },
    SizeOf: {
      switch: ["parametrizable", (t, e) => {
        let l = e.compareTo ? e.compareTo : e.compareToValue;
        const c = [];
        l.startsWith("$") ? c.push(l) : e.compareTo && (l = t.getField(l, !0));
        let r = `switch (${l}) {
`;
        for (const i in e.fields) {
          let p = i;
          p.startsWith("/") ? p = "ctx." + p.slice(1) : isNaN(p) && p !== "true" && p !== "false" && (p = `"${p}"`), r += t.indent(`case ${p}: return ` + t.callType("value", e.fields[i])) + `
`;
        }
        return r += t.indent("default: return " + t.callType("value", e.default ? e.default : "void")) + `
`, r += "}", t.wrapCode(r, c);
      }],
      option: ["parametrizable", (t, e) => {
        let l = `if (value != null) {
`;
        return l += "  return 1 + " + t.callType("value", e) + `
`, l += `}
`, l += "return 1", t.wrapCode(l);
      }]
    }
  }), Ro;
}
var Ao, Wu;
function Pv() {
  if (Wu) return Ao;
  Wu = 1, Ao = {
    Read: {
      array: ["parametrizable", (l, c) => {
        let r = "";
        if (c.countType)
          r += "const { value: count, size: countSize } = " + l.callType(c.countType) + `
`;
        else if (c.count)
          r += "const count = " + c.count + `
`, r += `const countSize = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return r += `if (count > 0xffffff && !ctx.noArraySizeCheck) throw new Error("array size is abnormally large, not reading: " + count)
`, r += `const data = []
`, r += `let size = countSize
`, r += `for (let i = 0; i < count; i++) {
`, r += "  const elem = " + l.callType(c.type, "offset + size") + `
`, r += `  data.push(elem.value)
`, r += `  size += elem.size
`, r += `}
`, r += "return { value: data, size }", l.wrapCode(r);
      }],
      count: ["parametrizable", (l, c) => {
        const r = "return " + l.callType(c.type);
        return l.wrapCode(r);
      }],
      container: ["parametrizable", (l, c) => {
        c = e(c);
        let r = "", i = "offset";
        const p = [];
        for (const b in c) {
          const { type: A, name: o, anon: v, _shouldBeInlined: S } = c[b];
          let s, a;
          if (A instanceof Array && A[0] === "bitfield" && v) {
            const w = [];
            for (const { name: u } of A[1]) {
              const d = l.getField(u);
              u === d ? (p.push(u), w.push(u)) : (p.push(`${u}: ${d}`), w.push(`${u}: ${d}`));
            }
            s = "{" + w.join(", ") + "}", a = `anon${b}Size`;
          } else
            s = l.getField(o), a = `${s}Size`, S ? p.push("..." + o) : o === s ? p.push(o) : p.push(`${o}: ${s}`);
          r += `let { value: ${s}, size: ${a} } = ` + l.callType(A, i) + `
`, i += ` + ${a}`;
        }
        const f = i.split(" + ");
        return f.shift(), f.length === 0 && f.push("0"), r += "return { value: { " + p.join(", ") + " }, size: " + f.join(" + ") + "}", l.wrapCode(r);
      }]
    },
    Write: {
      array: ["parametrizable", (l, c) => {
        let r = "";
        if (c.countType)
          r += "offset = " + l.callType("value.length", c.countType) + `
`;
        else if (c.count === null)
          throw new Error("Array must contain either count or countType");
        return r += `for (let i = 0; i < value.length; i++) {
`, r += "  offset = " + l.callType("value[i]", c.type) + `
`, r += `}
`, r += "return offset", l.wrapCode(r);
      }],
      count: ["parametrizable", (l, c) => {
        const r = "return " + l.callType("value", c.type);
        return l.wrapCode(r);
      }],
      container: ["parametrizable", (l, c) => {
        c = e(c);
        let r = "";
        for (const i in c) {
          const { type: p, name: f, anon: b, _shouldBeInlined: A } = c[i];
          let o;
          if (p instanceof Array && p[0] === "bitfield" && b) {
            const v = [];
            for (const { name: S } of p[1]) {
              const s = l.getField(S);
              r += `const ${s} = value.${S}
`, S === s ? v.push(S) : v.push(`${S}: ${s}`);
            }
            o = "{" + v.join(", ") + "}";
          } else
            o = l.getField(f), A ? r += `let ${f} = value
` : r += `let ${o} = value.${f}
`;
          r += "offset = " + l.callType(o, p) + `
`;
        }
        return r += "return offset", l.wrapCode(r);
      }]
    },
    SizeOf: {
      array: ["parametrizable", (l, c) => {
        let r = "";
        if (c.countType)
          r += "let size = " + l.callType("value.length", c.countType) + `
`;
        else if (c.count)
          r += `let size = 0
`;
        else
          throw new Error("Array must contain either count or countType");
        return isNaN(l.callType("value[i]", c.type)) ? (r += `for (let i = 0; i < value.length; i++) {
`, r += "  size += " + l.callType("value[i]", c.type) + `
`, r += `}
`) : r += "size += value.length * " + l.callType("value[i]", c.type) + `
`, r += "return size", l.wrapCode(r);
      }],
      count: ["parametrizable", (l, c) => {
        const r = "return " + l.callType("value", c.type);
        return l.wrapCode(r);
      }],
      container: ["parametrizable", (l, c) => {
        c = e(c);
        let r = `let size = 0
`;
        for (const i in c) {
          const { type: p, name: f, anon: b, _shouldBeInlined: A } = c[i];
          let o;
          if (p instanceof Array && p[0] === "bitfield" && b) {
            const v = [];
            for (const { name: S } of p[1]) {
              const s = l.getField(S);
              r += `const ${s} = value.${S}
`, S === s ? v.push(S) : v.push(`${S}: ${s}`);
            }
            o = "{" + v.join(", ") + "}";
          } else
            o = l.getField(f), A ? r += `let ${f} = value
` : r += `let ${o} = value.${f}
`;
          r += "size += " + l.callType(o, p) + `
`;
        }
        return r += "return size", l.wrapCode(r);
      }]
    }
  };
  function t() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  function e(l) {
    const c = [];
    for (const r in l) {
      const { type: i, anon: p } = l[r];
      if (p && !(i instanceof Array && i[0] === "bitfield"))
        if (i instanceof Array && i[0] === "container")
          for (const f in i[1]) c.push(i[1][f]);
        else if (i instanceof Array && i[0] === "switch")
          c.push({
            name: t(),
            _shouldBeInlined: !0,
            type: i
          });
        else
          throw new Error("Cannot inline anonymous type: " + i);
      else
        c.push(l[r]);
    }
    return c;
  }
  return Ao;
}
var Po, Hu;
function Tv() {
  if (Hu) return Po;
  Hu = 1, Po = {
    Read: {
      pstring: ["parametrizable", (c, r) => {
        let i = "";
        if (r.countType)
          i += "const { value: count, size: countSize } = " + c.callType(r.countType) + `
`;
        else if (r.count)
          i += "const count = " + r.count + `
`, i += `const countSize = 0
`;
        else
          throw new Error("pstring must contain either count or countType");
        return i += `offset += countSize
`, i += `if (offset + count > buffer.length) {
`, i += `  throw new PartialReadError("Missing characters in string, found size is " + buffer.length + " expected size was " + (offset + count))
`, i += `}
`, i += `return { value: buffer.toString("${r.encoding || "utf8"}", offset, offset + count), size: count + countSize }`, c.wrapCode(i);
      }],
      buffer: ["parametrizable", (c, r) => {
        let i = "";
        if (r.countType)
          i += "const { value: count, size: countSize } = " + c.callType(r.countType) + `
`;
        else if (r.count)
          i += "const count = " + r.count + `
`, i += `const countSize = 0
`;
        else
          throw new Error("buffer must contain either count or countType");
        return i += `offset += countSize
`, i += `if (offset + count > buffer.length) {
`, i += `  throw new PartialReadError()
`, i += `}
`, i += "return { value: buffer.slice(offset, offset + count), size: count + countSize }", c.wrapCode(i);
      }],
      bitfield: ["parametrizable", (c, r) => {
        let i = "";
        const p = Math.ceil(r.reduce((A, { size: o }) => A + o, 0) / 8);
        i += `if ( offset + ${p} > buffer.length) { throw new PartialReadError() }
`;
        const f = [];
        let b = 8;
        i += `let bits = buffer[offset++]
`;
        for (const A in r) {
          const { name: o, size: v, signed: S } = r[A], s = c.getField(o);
          for (; b < v; )
            b += 8, i += `bits = (bits << 8) | buffer[offset++]
`;
          i += `let ${s} = (bits >> ` + (b - v) + ") & 0x" + ((1 << v) - 1).toString(16) + `
`, S && (i += `${s} -= (${s} & 0x` + (1 << v - 1).toString(16) + `) << 1
`), b -= v, o === s ? f.push(o) : f.push(`${o}: ${s}`);
        }
        return i += "return { value: { " + f.join(", ") + ` }, size: ${p} }`, c.wrapCode(i);
      }],
      bitflags: ["parametrizable", (c, { type: r, flags: i, shift: p, big: f }) => {
        let b = JSON.stringify(i);
        if (Array.isArray(i)) {
          b = "{";
          for (const [A, o] of Object.entries(i)) b += `"${o}": ${f ? 1n << BigInt(A) : 1 << A}` + (f ? "n," : ",");
          b += "}";
        } else if (p) {
          b = "{";
          for (const A in i) b += `"${A}": ${1 << i[A]}${f ? "n," : ","}`;
          b += "}";
        }
        return c.wrapCode(`
const { value: _value, size } = ${c.callType(r, "offset")}
const value = { _value }
const flags = ${b}
for (const key in flags) {
  value[key] = (_value & flags[key]) == flags[key]
}
return { value, size }
      `.trim());
      }],
      mapper: ["parametrizable", (c, r) => {
        let i = "const { value, size } = " + c.callType(r.type) + `
`;
        return i += "return { value: " + JSON.stringify(t(r.mappings)) + "[value] || value, size }", c.wrapCode(i);
      }]
    },
    Write: {
      pstring: ["parametrizable", (c, r) => {
        let i = `const length = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          i += "offset = " + c.callType("length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return i += `buffer.write(value, offset, length, "${r.encoding || "utf8"}")
`, i += "return offset + length", c.wrapCode(i);
      }],
      buffer: ["parametrizable", (c, r) => {
        let i = `if (!(value instanceof Buffer)) value = Buffer.from(value)
`;
        if (r.countType)
          i += "offset = " + c.callType("value.length", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return i += `value.copy(buffer, offset)
`, i += "return offset + value.length", c.wrapCode(i);
      }],
      bitfield: ["parametrizable", (c, r) => {
        let i = "", p = 0, f = "";
        for (const b in r) {
          let { name: A, size: o } = r[b];
          const v = c.getField(A);
          for (f += `let ${v} = value.${A}
`; o > 0; ) {
            const S = Math.min(8 - p, o), s = (1 << S) - 1;
            i !== "" && (i = `((${i}) << ${S}) | `), i += `((${v} >> ` + (o - S) + ") & 0x" + s.toString(16) + ")", o -= S, p += S, p === 8 && (f += "buffer[offset++] = " + i + `
`, p = 0, i = "");
          }
        }
        return p !== 0 && (f += "buffer[offset++] = (" + i + ") << " + (8 - p) + `
`), f += "return offset", c.wrapCode(f);
      }],
      bitflags: ["parametrizable", (c, { type: r, flags: i, shift: p, big: f }) => {
        let b = JSON.stringify(i);
        if (Array.isArray(i)) {
          b = "{";
          for (const [A, o] of Object.entries(i)) b += `"${o}": ${f ? 1n << BigInt(A) : 1 << A}` + (f ? "n," : ",");
          b += "}";
        } else if (p) {
          b = "{";
          for (const A in i) b += `"${A}": ${1 << i[A]}${f ? "n," : ","}`;
          b += "}";
        }
        return c.wrapCode(`
const flags = ${b}
let val = value._value ${f ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val, buffer, offset)
      `.trim());
      }],
      mapper: ["parametrizable", (c, r) => {
        const i = JSON.stringify(e(r.mappings)), p = "return " + c.callType(`${i}[value] || value`, r.type);
        return c.wrapCode(p);
      }]
    },
    SizeOf: {
      pstring: ["parametrizable", (c, r) => {
        let i = `let size = Buffer.byteLength(value, "${r.encoding || "utf8"}")
`;
        if (r.countType)
          i += "size += " + c.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("pstring must contain either count or countType");
        return i += "return size", c.wrapCode(i);
      }],
      buffer: ["parametrizable", (c, r) => {
        let i = `let size = value instanceof Buffer ? value.length : Buffer.from(value).length
`;
        if (r.countType)
          i += "size += " + c.callType("size", r.countType) + `
`;
        else if (r.count === null)
          throw new Error("buffer must contain either count or countType");
        return i += "return size", c.wrapCode(i);
      }],
      bitfield: ["parametrizable", (c, r) => `${Math.ceil(r.reduce((p, { size: f }) => p + f, 0) / 8)}`],
      bitflags: ["parametrizable", (c, { type: r, flags: i, shift: p, big: f }) => {
        let b = JSON.stringify(i);
        if (Array.isArray(i)) {
          b = "{";
          for (const [A, o] of Object.entries(i)) b += `"${o}": ${f ? 1n << BigInt(A) : 1 << A}` + (f ? "n," : ",");
          b += "}";
        } else if (p) {
          b = "{";
          for (const A in i) b += `"${A}": ${1 << i[A]}${f ? "n," : ","}`;
          b += "}";
        }
        return c.wrapCode(`
const flags = ${b}
let val = value._value ${f ? "|| 0n" : ""}
for (const key in flags) {
  if (value[key]) val |= flags[key]
}
return (ctx.${r})(val)
      `.trim());
      }],
      mapper: ["parametrizable", (c, r) => {
        const i = JSON.stringify(e(r.mappings)), p = "return " + c.callType(`${i}[value] || value`, r.type);
        return c.wrapCode(p);
      }]
    }
  };
  function t(c) {
    const r = {};
    for (let i in c) {
      let p = c[i];
      i = l(i), isNaN(p) || (p = Number(p)), p === "true" && (p = !0), p === "false" && (p = !1), r[i] = p;
    }
    return r;
  }
  function e(c) {
    const r = {};
    for (let i in c) {
      const p = c[i];
      i = l(i), r[p] = isNaN(i) ? i : parseInt(i, 10);
    }
    return r;
  }
  function l(c) {
    return c.match(/^0x[0-9a-f]+$/i) ? parseInt(c.substring(2), 16) : c;
  }
  return Po;
}
var To, Vu;
function Iv() {
  if (Vu) return To;
  Vu = 1;
  const t = Bc(), e = Lc(), l = Av(), c = Pv(), r = Tv(), { tryCatch: i } = $r();
  class p {
    constructor() {
      this.readCompiler = new A(), this.writeCompiler = new o(), this.sizeOfCompiler = new v();
    }
    addTypes(s) {
      this.readCompiler.addTypes(s.Read), this.writeCompiler.addTypes(s.Write), this.sizeOfCompiler.addTypes(s.SizeOf);
    }
    addTypesToCompile(s) {
      this.readCompiler.addTypesToCompile(s), this.writeCompiler.addTypesToCompile(s), this.sizeOfCompiler.addTypesToCompile(s);
    }
    addProtocol(s, a) {
      this.readCompiler.addProtocol(s, a), this.writeCompiler.addProtocol(s, a), this.sizeOfCompiler.addProtocol(s, a);
    }
    addVariable(s, a) {
      this.readCompiler.addContextType(s, a), this.writeCompiler.addContextType(s, a), this.sizeOfCompiler.addContextType(s, a);
    }
    compileProtoDefSync(s = { printCode: !1 }) {
      const a = this.sizeOfCompiler.generate(), w = this.writeCompiler.generate(), u = this.readCompiler.generate();
      s.printCode && (console.log("// SizeOf:"), console.log(a), console.log("// Write:"), console.log(w), console.log("// Read:"), console.log(u));
      const d = this.sizeOfCompiler.compile(a), E = this.writeCompiler.compile(w), _ = this.readCompiler.compile(u);
      return new f(d, E, _);
    }
  }
  class f {
    constructor(s, a, w) {
      this.sizeOfCtx = s, this.writeCtx = a, this.readCtx = w;
    }
    read(s, a, w) {
      const u = this.readCtx[w];
      if (!u)
        throw new Error("missing data type: " + w);
      return u(s, a);
    }
    write(s, a, w, u) {
      const d = this.writeCtx[u];
      if (!d)
        throw new Error("missing data type: " + u);
      return d(s, a, w);
    }
    setVariable(s, a) {
      this.sizeOfCtx[s] = a, this.readCtx[s] = a, this.writeCtx[s] = a;
    }
    sizeOf(s, a) {
      const w = this.sizeOfCtx[a];
      if (!w)
        throw new Error("missing data type: " + a);
      return typeof w == "function" ? w(s) : w;
    }
    createPacketBuffer(s, a) {
      const w = i(
        () => this.sizeOf(a, s),
        (d) => {
          throw d.message = `SizeOf error for ${d.field} : ${d.message}`, d;
        }
      ), u = dr.allocUnsafe(w);
      return i(
        () => this.write(a, u, 0, s),
        (d) => {
          throw d.message = `Write error for ${d.field} : ${d.message}`, d;
        }
      ), u;
    }
    parsePacketBuffer(s, a, w = 0) {
      const { value: u, size: d } = i(
        () => this.read(a, w, s),
        (E) => {
          throw E.message = `Read error for ${E.field} : ${E.message}`, E;
        }
      );
      return {
        data: u,
        metadata: { size: d },
        buffer: a.slice(0, d),
        fullBuffer: a
      };
    }
  }
  class b {
    constructor() {
      this.primitiveTypes = {}, this.native = {}, this.context = {}, this.types = {}, this.scopeStack = [], this.parameterizableTypes = {};
    }
    /**
     * A native type is a type read or written by a function that will be called in it's
     * original context.
     * @param {*} type
     * @param {*} fn
     */
    addNativeType(s, a) {
      this.primitiveTypes[s] = `native.${s}`, this.native[s] = a, this.types[s] = "native";
    }
    /**
     * A context type is a type that will be called in the protocol's context. It can refer to
     * registred native types using native.{type}() or context type (provided and generated)
     * using ctx.{type}(), but cannot access it's original context.
     * @param {*} type
     * @param {*} fn
     */
    addContextType(s, a) {
      this.primitiveTypes[s] = `ctx.${s}`, this.context[s] = a.toString();
    }
    /**
     * A parametrizable type is a function that will be generated at compile time using the
     * provided maker function
     * @param {*} type
     * @param {*} maker
     */
    addParametrizableType(s, a) {
      this.parameterizableTypes[s] = a;
    }
    addTypes(s) {
      for (const [a, [w, u]] of Object.entries(s))
        w === "native" ? this.addNativeType(a, u) : w === "context" ? this.addContextType(a, u) : w === "parametrizable" && this.addParametrizableType(a, u);
    }
    addTypesToCompile(s) {
      for (const [a, w] of Object.entries(s))
        (!this.types[a] || this.types[a] === "native") && (this.types[a] = w);
    }
    addProtocol(s, a) {
      const w = this;
      function u(d, E) {
        d !== void 0 && (d.types && w.addTypesToCompile(d.types), u(d[E.shift()], E));
      }
      u(s, a.slice(0));
    }
    indent(s, a = "  ") {
      return s.split(`
`).map((w) => a + w).join(`
`);
    }
    getField(s, a) {
      const w = s.split("/");
      let u = this.scopeStack.length - 1;
      const d = ["value", "enum", "default", "size", "offset"];
      for (; w.length; ) {
        const E = this.scopeStack[u], _ = w.shift();
        if (_ === "..") {
          u--;
          continue;
        }
        if (E[_]) return E[_] + (w.length ? "." + w.join(".") : "");
        if (w.length !== 0)
          throw new Error("Cannot access properties of undefined field");
        let I = 0;
        d.includes(_) && I++;
        for (let P = 0; P < u; P++)
          this.scopeStack[P][_] && I++;
        return a ? E[_] = _ : E[_] = _ + (I || ""), E[_];
      }
      throw new Error("Unknown field " + w);
    }
    generate() {
      this.scopeStack = [{}];
      const s = [];
      for (const a in this.context)
        s[a] = this.context[a];
      for (const a in this.types)
        s[a] || (this.types[a] !== "native" ? (s[a] = this.compileType(this.types[a]), s[a].startsWith("ctx") && (s[a] = "function () { return " + s[a] + "(...arguments) }"), isNaN(s[a]) || (s[a] = this.wrapCode("  return " + s[a]))) : s[a] = `native.${a}`);
      return `() => {
` + this.indent(`const ctx = {
` + this.indent(Object.keys(s).map((a) => a + ": " + s[a]).join(`,
`)) + `
}
return ctx`) + `
}`;
    }
    /**
     * Compile the given js code, providing native.{type} to the context, return the compiled types
     * @param {*} code
     */
    compile(s) {
      const a = this.native, { PartialReadError: w } = $r();
      return new Function("native", "PartialReadError", "return " + s)(a, w)();
    }
  }
  class A extends b {
    constructor() {
      super(), this.addTypes(l.Read), this.addTypes(c.Read), this.addTypes(r.Read);
      for (const s in t)
        this.addNativeType(s, t[s][0]);
      for (const s in e)
        this.addNativeType(s, e[s][0]);
    }
    compileType(s) {
      if (s instanceof Array) {
        if (this.parameterizableTypes[s[0]])
          return this.parameterizableTypes[s[0]](this, s[1]);
        if (this.types[s[0]] && this.types[s[0]] !== "native")
          return this.wrapCode("return " + this.callType(s[0], "offset", Object.values(s[1])));
        throw new Error("Unknown parametrizable type: " + JSON.stringify(s[0]));
      } else
        return s === "native" ? "null" : this.types[s] ? "ctx." + s : this.primitiveTypes[s];
    }
    wrapCode(s, a = []) {
      return a.length > 0 ? "(buffer, offset, " + a.join(", ") + `) => {
` + this.indent(s) + `
}` : `(buffer, offset) => {
` + this.indent(s) + `
}`;
    }
    callType(s, a = "offset", w = []) {
      if (s instanceof Array && this.types[s[0]] && this.types[s[0]] !== "native")
        return this.callType(s[0], a, Object.values(s[1]));
      s instanceof Array && s[0] === "container" && this.scopeStack.push({});
      const u = this.compileType(s);
      return s instanceof Array && s[0] === "container" && this.scopeStack.pop(), w.length > 0 ? "(" + u + `)(buffer, ${a}, ` + w.map((d) => this.getField(d)).join(", ") + ")" : "(" + u + `)(buffer, ${a})`;
    }
  }
  class o extends b {
    constructor() {
      super(), this.addTypes(l.Write), this.addTypes(c.Write), this.addTypes(r.Write);
      for (const s in t)
        this.addNativeType(s, t[s][1]);
      for (const s in e)
        this.addNativeType(s, e[s][1]);
    }
    compileType(s) {
      if (s instanceof Array) {
        if (this.parameterizableTypes[s[0]])
          return this.parameterizableTypes[s[0]](this, s[1]);
        if (this.types[s[0]] && this.types[s[0]] !== "native")
          return this.wrapCode("return " + this.callType("value", s[0], "offset", Object.values(s[1])));
        throw new Error("Unknown parametrizable type: " + s[0]);
      } else
        return s === "native" ? "null" : this.types[s] ? "ctx." + s : this.primitiveTypes[s];
    }
    wrapCode(s, a = []) {
      return a.length > 0 ? "(value, buffer, offset, " + a.join(", ") + `) => {
` + this.indent(s) + `
}` : `(value, buffer, offset) => {
` + this.indent(s) + `
}`;
    }
    callType(s, a, w = "offset", u = []) {
      if (a instanceof Array && this.types[a[0]] && this.types[a[0]] !== "native")
        return this.callType(s, a[0], w, Object.values(a[1]));
      a instanceof Array && a[0] === "container" && this.scopeStack.push({});
      const d = this.compileType(a);
      return a instanceof Array && a[0] === "container" && this.scopeStack.pop(), u.length > 0 ? "(" + d + `)(${s}, buffer, ${w}, ` + u.map((E) => this.getField(E)).join(", ") + ")" : "(" + d + `)(${s}, buffer, ${w})`;
    }
  }
  class v extends b {
    constructor() {
      super(), this.addTypes(l.SizeOf), this.addTypes(c.SizeOf), this.addTypes(r.SizeOf);
      for (const s in t)
        this.addNativeType(s, t[s][2]);
      for (const s in e)
        this.addNativeType(s, e[s][2]);
    }
    /**
     * A native type is a type read or written by a function that will be called in it's
     * original context.
     * @param {*} type
     * @param {*} fn
     */
    addNativeType(s, a) {
      this.primitiveTypes[s] = `native.${s}`, isNaN(a) ? this.native[s] = a : this.native[s] = (w) => a, this.types[s] = "native";
    }
    compileType(s) {
      if (s instanceof Array) {
        if (this.parameterizableTypes[s[0]])
          return this.parameterizableTypes[s[0]](this, s[1]);
        if (this.types[s[0]] && this.types[s[0]] !== "native")
          return this.wrapCode("return " + this.callType("value", s[0], Object.values(s[1])));
        throw new Error("Unknown parametrizable type: " + s[0]);
      } else
        return s === "native" ? "null" : isNaN(this.primitiveTypes[s]) ? this.types[s] ? "ctx." + s : this.primitiveTypes[s] : this.primitiveTypes[s];
    }
    wrapCode(s, a = []) {
      return a.length > 0 ? "(value, " + a.join(", ") + `) => {
` + this.indent(s) + `
}` : `(value) => {
` + this.indent(s) + `
}`;
    }
    callType(s, a, w = []) {
      if (a instanceof Array && this.types[a[0]] && this.types[a[0]] !== "native")
        return this.callType(s, a[0], Object.values(a[1]));
      a instanceof Array && a[0] === "container" && this.scopeStack.push({});
      const u = this.compileType(a);
      return a instanceof Array && a[0] === "container" && this.scopeStack.pop(), isNaN(u) ? w.length > 0 ? "(" + u + `)(${s}, ` + w.map((d) => this.getField(d)).join(", ") + ")" : "(" + u + `)(${s})` : u;
    }
  }
  return To = {
    ReadCompiler: A,
    WriteCompiler: o,
    SizeOfCompiler: v,
    ProtoDefCompiler: p,
    CompiledProtodef: f
  }, To;
}
var Io, Gu;
function Ov() {
  if (Gu) return Io;
  Gu = 1;
  const t = wv(), e = new t();
  return Io = {
    ProtoDef: t,
    Serializer: So().Serializer,
    Parser: So().Parser,
    FullPacketParser: So().FullPacketParser,
    Compiler: Iv(),
    types: e.types,
    utils: $r()
  }, Io;
}
var Oo, Zu;
function xv() {
  return Zu || (Zu = 1, Oo = Ov()), Oo;
}
const Fv = "native", Dv = "native", Nv = "native", Bv = "native", Lv = "native", Cv = "native", jv = "native", Mv = "native", kv = "native", qv = "native", $v = "native", Uv = ["pstring", { countType: "u16" }], zv = ["array", { countType: "i32", type: "i8" }], Wv = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "i32", type: ["nbtSwitch", { type: "type" }] }] }]], Hv = ["array", { countType: "i32", type: "i32" }], Vv = ["array", { countType: "i32", type: "i64" }], Gv = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], Zv = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "i32", long: "i64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], Kv = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], Yv = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], Qv = ["optionalNbtType", { tagType: "anonymousNbt" }], Jv = ["optionalNbtType", { tagType: "nbt" }], Xv = {
  void: "native",
  container: Fv,
  i8: Dv,
  switch: "native",
  compound: Nv,
  nbtTagName: Bv,
  i16: Lv,
  u16: Cv,
  i32: jv,
  i64: Mv,
  f32: kv,
  f64: qv,
  pstring: $v,
  shortString: Uv,
  byteArray: zv,
  list: Wv,
  intArray: Hv,
  longArray: Vv,
  nbtMapper: Gv,
  nbtSwitch: Zv,
  nbt: Kv,
  anonymousNbt: Yv,
  anonOptionalNbt: Qv,
  optionalNbt: Jv
}, eg = "native", rg = "native", tg = "native", ng = "native", ig = "native", ag = "native", og = "native", sg = "native", fg = "native", lg = "native", ug = "native", cg = ["pstring", { countType: "varint" }], dg = ["array", { countType: "zigzag32", type: "i8" }], hg = ["container", [{ name: "type", type: "nbtMapper" }, { name: "value", type: ["array", { countType: "zigzag32", type: ["nbtSwitch", { type: "type" }] }] }]], pg = ["array", { countType: "zigzag32", type: "i32" }], yg = ["array", { countType: "zigzag32", type: "i64" }], vg = ["mapper", { type: "i8", mappings: { 0: "end", 1: "byte", 2: "short", 3: "int", 4: "long", 5: "float", 6: "double", 7: "byteArray", 8: "string", 9: "list", 10: "compound", 11: "intArray", 12: "longArray" } }], gg = ["switch", { compareTo: "$type", fields: { end: "void", byte: "i8", short: "i16", int: "zigzag32", long: "zigzag64", float: "f32", double: "f64", byteArray: "byteArray", string: "shortString", list: "list", compound: "compound", intArray: "intArray", longArray: "longArray" } }], mg = ["container", [{ name: "type", type: "nbtMapper" }, { name: "name", type: "nbtTagName" }, { name: "value", type: ["nbtSwitch", { type: "type" }] }]], bg = {
  void: "native",
  container: eg,
  i8: rg,
  switch: "native",
  compound: tg,
  zigzag32: ng,
  zigzag64: ig,
  i16: ag,
  i32: og,
  i64: sg,
  f32: fg,
  f64: lg,
  pstring: ug,
  shortString: cg,
  byteArray: dg,
  list: hg,
  intArray: pg,
  longArray: yg,
  nbtMapper: vg,
  nbtSwitch: gg,
  nbt: mg
};
var xo, Ku;
function wg() {
  return Ku || (Ku = 1, xo = {
    Read: {
      compound: ["context", (t, e) => {
        const l = {
          value: {},
          size: 0
        };
        for (; e !== t.length; ) {
          const c = ctx.i8(t, e);
          if (c.value === 0) {
            l.size += c.size;
            break;
          }
          if (c.value > 20)
            throw new Error(`Invalid tag: ${c.value} > 20`);
          const r = ctx.nbt(t, e);
          e += r.size, l.size += r.size, l.value[r.value.name] = {
            type: r.value.type,
            value: r.value.value
          };
        }
        return l;
      }]
    },
    Write: {
      compound: ["context", (t, e, l) => {
        for (const c in t)
          l = ctx.nbt({
            name: c,
            type: t[c].type,
            value: t[c].value
          }, e, l);
        return l = ctx.i8(0, e, l), l;
      }]
    },
    SizeOf: {
      compound: ["context", (t) => {
        let e = 1;
        for (const l in t)
          e += ctx.nbt({
            name: l,
            type: t[l].type,
            value: t[l].value
          });
        return e;
      }]
    }
  }), xo;
}
var Fo, Yu;
function _g() {
  if (Yu) return Fo;
  Yu = 1;
  function t(c, r) {
    const { value: i, size: p } = ctx.shortString(c, r);
    for (const f of i)
      if (f === "\0") throw new Error("unexpected tag end");
    return { value: i, size: p };
  }
  function e(...c) {
    return ctx.shortString(...c);
  }
  function l(...c) {
    return ctx.shortString(...c);
  }
  return Fo = {
    Read: { nbtTagName: ["context", t] },
    Write: { nbtTagName: ["context", e] },
    SizeOf: { nbtTagName: ["context", l] }
  }, Fo;
}
var Do, Qu;
function Ju() {
  if (Qu) return Do;
  Qu = 1;
  function t(r, i, { tagType: p }, f) {
    if (i + 1 > r.length)
      throw new Error("Read out of bounds");
    return r.readInt8(i) === 0 ? { size: 1 } : this.read(r, i, p, f);
  }
  function e(r, i, p, { tagType: f }, b) {
    return r === void 0 ? (i.writeInt8(0, p), p + 1) : this.write(r, i, p, f, b);
  }
  function l(r, { tagType: i }, p) {
    return r === void 0 ? 1 : this.sizeOf(r, i, i, p);
  }
  return Do = {
    compiler: {
      Read: {
        optionalNbtType: ["parametrizable", (r, { tagType: i }) => r.wrapCode(`
if (offset + 1 > buffer.length) { throw new PartialReadError() }
if (buffer.readInt8(offset) === 0) return { size: 1 }
return ${r.callType(i)}
      `)]
      },
      Write: {
        optionalNbtType: ["parametrizable", (r, { tagType: i }) => r.wrapCode(`
if (value === undefined) {
  buffer.writeInt8(0, offset)
  return offset + 1
}
return ${r.callType("value", i)}
      `)]
      },
      SizeOf: {
        optionalNbtType: ["parametrizable", (r, { tagType: i }) => r.wrapCode(`
if (value === undefined) { return 1 }
return ${r.callType("value", i)}
      `)]
      }
    },
    interpret: { optionalNbtType: [t, e, l] }
  }, Do;
}
var No, Xu;
function Eg() {
  if (Xu) return No;
  Xu = 1, No = {
    compound: [t, e, l]
  };
  function t(c, r, i, p) {
    const f = {
      value: {},
      size: 0
    };
    for (; ; ) {
      const b = this.read(c, r, "i8", p);
      if (b.value === 0) {
        r += b.size, f.size += b.size;
        break;
      }
      const A = this.read(c, r, "nbt", p);
      r += A.size, f.size += A.size, f.value[A.value.name] = {
        type: A.value.type,
        value: A.value.value
      };
    }
    return f;
  }
  function e(c, r, i, p, f) {
    const b = this;
    return Object.keys(c).forEach(function(A) {
      i = b.write({
        name: A,
        type: c[A].type,
        value: c[A].value
      }, r, i, "nbt", f);
    }), i = this.write(0, r, i, "i8", f), i;
  }
  function l(c, r, i) {
    const p = this;
    return 1 + Object.keys(c).reduce(function(b, A) {
      return b + p.sizeOf({
        name: A,
        type: c[A].type,
        value: c[A].value
      }, "nbt", i);
    }, 0);
  }
  return No;
}
var Bo, ec;
function Sg() {
  return ec || (ec = 1, Bo = {
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
  }), Bo;
}
var Lo, rc;
function Rg() {
  if (rc) return Lo;
  rc = 1;
  const t = kh(), { ProtoDefCompiler: e } = xv().Compiler, l = JSON.stringify(Xv), c = l.replace(/([iuf][0-7]+)/g, "l$1"), r = JSON.stringify(bg).replace(/([if][0-7]+)/g, "l$1");
  function i(P, D) {
    D.addTypes(wg()), D.addTypes(_g()), D.addTypes(Ju().compiler);
    let x = l;
    P === "littleVarint" ? x = r : P === "little" && (x = c), D.addTypesToCompile(JSON.parse(x));
  }
  function p(P, D) {
    D.addTypes(Eg()), D.addTypes(Ju().interpret);
    let x = l;
    P === "littleVarint" ? x = r : P === "little" && (x = c), D.addTypes(JSON.parse(x)), D.types.nbtTagName = D.types.shortString;
  }
  function f(P) {
    const D = new e();
    return i(P, D), D.compileProtoDefSync();
  }
  const b = f("big"), A = f("little"), o = f("littleVarint"), v = {
    big: b,
    little: A,
    littleVarint: o
  };
  function S(P, D = "big") {
    return D === !0 && (D = "little"), v[D].createPacketBuffer("nbt", P);
  }
  function s(P, D = "big", x = {}) {
    return D === !0 && (D = "little"), v[D].setVariable("noArraySizeCheck", x.noArraySizeCheck), v[D].parsePacketBuffer("nbt", P, P.startOffset).data;
  }
  const a = function(P) {
    let D = !0;
    return P[0] !== 31 && (D = !1), P[1] !== 139 && (D = !1), D;
  }, w = (P) => P[1] === 0 && P[2] === 0 && P[3] === 0;
  async function u(P, D, x = {}) {
    if (!(P instanceof dr)) throw new Error("Invalid argument: `data` must be a Buffer object");
    a(P) && (P = await new Promise((K, L) => {
      t.gunzip(P, (z, y) => {
        z ? L(z) : K(y);
      });
    })), v[D].setVariable("noArraySizeCheck", x.noArraySizeCheck);
    const q = v[D].parsePacketBuffer("nbt", P, P.startOffset);
    return q.metadata.buffer = P, q.type = D, q;
  }
  async function d(P, D, x) {
    if (P instanceof ArrayBuffer)
      P = dr.from(P);
    else if (!(P instanceof dr))
      throw new Error("Invalid argument: `data` must be a Buffer or ArrayBuffer object");
    let q = null;
    if (typeof D == "function")
      x = D;
    else if (D === !0 || D === "little")
      q = "little";
    else if (D === "big")
      q = "big";
    else if (D === "littleVarint")
      q = "littleVarint";
    else if (D)
      throw new Error("Unrecognized format: " + D);
    if (P.startOffset = P.startOffset || 0, !q && !P.startOffset && w(P) && (P.startOffset += 8, q = "little"), q)
      try {
        const z = await u(P, q);
        return x && x(null, z.data, z.type, z.metadata), { parsed: z.data, type: z.type, metadata: z.metadata };
      } catch (z) {
        if (x) return x(z);
        throw z;
      }
    const K = ({ buffer: z, size: y }) => {
      const F = y, ie = z.length - z.startOffset, _e = z[F + z.startOffset] === 10;
      if (F < ie && !_e)
        throw new Error(`Unexpected EOF at ${F}: still have ${ie - F} bytes to read !`);
    };
    let L = null;
    try {
      L = await u(P, "big"), K(L.metadata);
    } catch (z) {
      try {
        L = await u(P, "little"), K(L.metadata);
      } catch {
        try {
          L = await u(P, "littleVarint"), K(L.metadata);
        } catch {
          if (x) return x(z);
          throw z;
        }
      }
    }
    return x && x(null, L.data, L.type, L.metadata), { parsed: L.data, type: L.type, metadata: L.metadata };
  }
  function E(P) {
    function D(x, q) {
      return q === "compound" ? Object.keys(x).reduce(function(K, L) {
        return K[L] = E(x[L]), K;
      }, {}) : q === "list" ? x.value.map(function(K) {
        return D(K, x.type);
      }) : x;
    }
    return D(P.value, P.type);
  }
  function _(P, D) {
    if (P.type !== D.type) return !1;
    if (P.type === "compound") {
      const x = Object.keys(P.value), q = Object.keys(D.value);
      if (x.length !== q.length) return !1;
      for (const K of x)
        if (!_(P.value[K], D.value[K])) return !1;
      return !0;
    }
    if (P.type === "list") {
      if (P.value.length !== D.value.length) return !1;
      for (let x = 0; x < P.value.length; x++)
        if (!_(P.value[x], D.value[x])) return !1;
      return !0;
    }
    if (P.type === "byteArray" || P.type === "intArray" || P.type === "shortArray") {
      if (P.value.length !== D.value.length) return !1;
      for (let x = 0; x < P.value.length; x++)
        if (P.value[x] !== D.value[x]) return !1;
      return !0;
    }
    if (P.type === "long")
      return P.value[0] === D.value[0] && P.value[1] === D.value[1];
    if (P.type === "longArray") {
      if (P.value.length !== D.value.length) return !1;
      for (let x = 0; x < P.value.length; x++)
        if (P.value[x][0] !== D.value[x][0] || P.value[x][1] !== D.value[x][1]) return !1;
      return !0;
    }
    return P.value === D.value;
  }
  const I = {
    bool(P = !1) {
      return { type: "bool", value: P };
    },
    short(P) {
      return { type: "short", value: P };
    },
    byte(P) {
      return { type: "byte", value: P };
    },
    string(P) {
      return { type: "string", value: P };
    },
    comp(P, D = "") {
      return { type: "compound", name: D, value: P };
    },
    int(P) {
      return { type: "int", value: P };
    },
    float(P) {
      return { type: "float", value: P };
    },
    double(P) {
      return { type: "double", value: P };
    },
    long(P) {
      return { type: "long", value: P };
    },
    list(P) {
      return { type: "list", value: { type: (P == null ? void 0 : P.type) ?? "end", value: (P == null ? void 0 : P.value) ?? [] } };
    },
    byteArray(P = []) {
      return { type: "byteArray", value: P };
    },
    shortArray(P = []) {
      return { type: "shortArray", value: P };
    },
    intArray(P = []) {
      return { type: "intArray", value: P };
    },
    longArray(P = []) {
      return { type: "longArray", value: P };
    }
  };
  return Lo = {
    addTypesToCompiler: i,
    addTypesToInterpreter: p,
    writeUncompressed: S,
    parseUncompressed: s,
    simplify: E,
    hasBedrockLevelHeader: w,
    parse: d,
    parseAs: u,
    equal: _,
    proto: b,
    protoLE: A,
    protos: v,
    TagType: Sg(),
    ...I
  }, Lo;
}
var zc = Rg();
const Ag = /* @__PURE__ */ _d(zc), Og = /* @__PURE__ */ wd({
  __proto__: null,
  default: Ag
}, [zc]);
export {
  Og as n
};
