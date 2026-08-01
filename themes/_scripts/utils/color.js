/**
 * src/utils/color.js
 *
 * Color utilities for the Forest-Theme project.
 *
 * - Basic hex <-> rgb helpers (parseHex / toHex)
 * - mix / lighten / darken / withOpacity (kept for compatibility)
 * - HSL helpers + `saturate` (HSL mode by default)
 * - OKLab / OKLCH conversions and `saturate(..., {space: 'oklch'})`
 *
 * Implementation notes:
 * - `saturate(hex, amount, opts)` supports opts.space === 'oklch'
 *   where `amount` is interpreted as a relative fraction (0.25 => +25% chroma)
 *
 * References:
 * - OKLab / OKLCH formulas by Björn Ottosson: https://bottosson.github.io/posts/oklab/
 *
 * JSDoc types are provided to avoid implicit-any errors under strict checking.
 */

"use strict";

/** clamp a number to [min, max] */
/**
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* ---------------- Basic hex <-> rgb ---------------- */

/**
 * Parse a hex color string (#abc, abc, #aabbcc) into rgb components.
 * @param {string} hex
 * @returns {{r:number,g:number,b:number}}
 */
function parseHex(hex) {
  if (typeof hex !== "string") hex = String(hex || "");
  hex = hex.trim();
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 0) hex = "000000";
  if (hex.length === 8) hex = hex.slice(0, 6);
  if (hex.length === 4) hex = hex.slice(0, 3);
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) hex = "000000";
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Convert an rgb object into a hex string (#rrggbb).
 * @param {{r:number,g:number,b:number}} rgb
 * @returns {string}
 */
function toHex(rgb) {
  const r = clamp(Math.round(rgb.r), 0, 255);
  const g = clamp(Math.round(rgb.g), 0, 255);
  const b = clamp(Math.round(rgb.b), 0, 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Mix two hex colors by weight.
 * @param {string} c1 - base color hex
 * @param {string} c2 - color to mix in
 * @param {number} weight - 0..1 fraction of c2
 * @returns {string}
 */
function mix(c1, c2, weight) {
  weight = Number(weight) || 0;
  weight = clamp(weight, 0, 1);
  const rgb1 = parseHex(c1);
  const rgb2 = parseHex(c2);
  return toHex({
    r: rgb1.r * (1 - weight) + rgb2.r * weight,
    g: rgb1.g * (1 - weight) + rgb2.g * weight,
    b: rgb1.b * (1 - weight) + rgb2.b * weight,
  });
}

/**
 * Lighten a color by mixing with white.
 * @param {string} color
 * @param {number} amount - 0..1
 * @returns {string}
 */
function lighten(color, amount) {
  return mix(color, "#ffffff", amount);
}

/**
 * Darken a color by mixing with black.
 * @param {string} color
 * @param {number} amount - 0..1
 * @returns {string}
 */
function darken(color, amount) {
  return mix(color, "#000000", amount);
}

/**
 * Append hex opacity to a hex color (e.g. '#rrggbb' + '80' => '#rrggbb80').
 * @param {string} hex
 * @param {string} opacityHex - two hex characters '00'..'ff'
 * @returns {string}
 */
function withOpacity(hex, opacityHex) {
  if (typeof hex !== "string") hex = String(hex || "");
  if (!hex.startsWith("#")) hex = "#" + hex;
  if (typeof opacityHex !== "string") opacityHex = String(opacityHex || "");
  return hex + opacityHex;
}

/* ---------------- HSL helpers ---------------- */

/**
 * Convert RGB (0..255) to HSL.
 * Returns {h:0-360, s:0-100, l:0-100}
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{h:number,s:number,l:number}}
 */
function rgbToHsl(r, g, b) {
  r = clamp(Number(r) || 0, 0, 255) / 255;
  g = clamp(Number(g) || 0, 0, 255) / 255;
  b = clamp(Number(b) || 0, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h = h * 60;
  }

  return {
    h: Math.round(h),
    s: +(s * 100).toFixed(2),
    l: +(l * 100).toFixed(2),
  };
}

/**
 * Convert HSL to RGB (0..255).
 * h in degrees, s/l as percent (0..100)
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {{r:number,g:number,b:number}}
 */
function hslToRgb(h, s, l) {
  h = (((Number(h) || 0) % 360) + 360) % 360; // normalize
  s = clamp(Number(s) || 0, 0, 100) / 100;
  l = clamp(Number(l) || 0, 0, 100) / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;

  /**
   * Convert hue to an RGB component helper (used internally by HSL -> RGB).
   * @param {number} p_ - numeric
   * @param {number} q_ - numeric
   * @param {number} t  - numeric
   * @returns {number}
   */
  function hue2rgb(p_, q_, t) {
    p_ = Number(p_) || 0;
    q_ = Number(q_) || 0;
    t = Number(t) || 0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p_ + (q_ - p_) * 6 * t;
    if (t < 1 / 2) return q_;
    if (t < 2 / 3) return p_ + (q_ - p_) * (2 / 3 - t) * 6;
    return p_;
  }

  const r = hue2rgb(p, q, hk + 1 / 3);
  const g = hue2rgb(p, q, hk);
  const b = hue2rgb(p, q, hk - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/* ---------------- OKLab / OKLCH helpers ---------------- */

/**
 * Convert an sRGB channel (0..1) to linear-light value.
 * @param {number} v
 * @returns {number}
 */
function srgbToLinear(v) {
  // v is 0..1
  v = Number(v) || 0;
  if (v <= 0.04045) return v / 12.92;
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear-light channel to sRGB (0..1)
 * @param {number} v
 * @returns {number}
 */
function linearToSrgb(v) {
  v = Number(v) || 0;
  if (v <= 0.0031308) return v * 12.92;
  return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

/**
 * Convert RGB (0..255) to OKLab {L, a, b}
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{L:number,a:number,b:number}}
 */
function rgbToOklab(r, g, b) {
  // convert to 0..1
  const R = srgbToLinear(clamp(r / 255, 0, 1));
  const G = srgbToLinear(clamp(g / 255, 0, 1));
  const B = srgbToLinear(clamp(b / 255, 0, 1));

  // linear transform
  const l_ = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m_ = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s_ = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b_ = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return { L: L, a: a, b: b_ };
}

/**
 * Convert OKLab (L, a, b) to RGB (0..255)
 * @param {number} L
 * @param {number} a
 * @param {number} b
 * @returns {{r:number,g:number,b:number}}
 */
function oklabToRgb(L, a, b) {
  // inverse linear transform
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  // cube
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // transform back to linear RGB
  let R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // convert linear RGB to sRGB with gamma correction
  R = linearToSrgb(R);
  G = linearToSrgb(G);
  B = linearToSrgb(B);

  // clamp and convert 0..255 ints
  return {
    r: clamp(Math.round(R * 255), 0, 255),
    g: clamp(Math.round(G * 255), 0, 255),
    b: clamp(Math.round(B * 255), 0, 255),
  };
}

/**
 * Convert RGB (0..255) to OKLCH {L, C, h}, h in degrees 0..360
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{L:number,C:number,h:number}}
 */
function rgbToOklch(r, g, b) {
  const lab = rgbToOklab(r, g, b);
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return { L: lab.L, C: C, h: h };
}

/**
 * Convert OKLCH to RGB (0..255)
 * @param {number} L
 * @param {number} C
 * @param {number} h - degrees
 * @returns {{r:number,g:number,b:number}}
 */
function oklchToRgb(L, C, h) {
  const rad = (Number(h) || 0) * (Math.PI / 180);
  const a = C * Math.cos(rad);
  const b = C * Math.sin(rad);
  return oklabToRgb(L, a, b);
}

/* ---------------- Saturation utilities ---------------- */

/**
 * HSL-based saturate implementation (keeps existing semantics)
 * amount: fraction in [-1, 1]. Positive increases saturation by amount*100 percentage points.
 * @param {string} hex
 * @param {number} amount
 * @returns {string}
 */
function saturateHsl(hex, amount) {
  amount = Number(amount) || 0;
  amount = clamp(amount, -1, 1);
  const rgb = parseHex(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newS = clamp(hsl.s + amount * 100, 0, 100);
  const newRgb = hslToRgb(hsl.h, newS, hsl.l);
  return toHex(newRgb);
}

/**
 * OKLCH-based saturate implementation (relative mode by default).
 * - amount interpreted as relative fraction: amount = 0.25 => increase C by 25% (C *= 1 + 0.25)
 * - amount can be negative (down to -1 to zero the chroma)
 *
 * @param {string} hex
 * @param {number} amount - relative fraction (e.g. 0.25 => +25%)
 * @param {{mode?:string}} opts - optional. mode currently supports 'relative' (default) or 'absolute'
 *                               if mode === 'absolute', amount is added to chroma directly: C += amount
 * @returns {string}
 */
function saturateOklch(hex, amount, opts) {
  amount = Number(amount) || 0;
  opts = opts || {};
  const mode = opts.mode || "relative";

  const rgb = parseHex(hex);
  const lch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  let newC;

  if (mode === "absolute") {
    // amount is added directly to chroma units (caller must understand scale)
    newC = Math.max(0, lch.C + amount);
  } else {
    // default relative: scale chroma multiplicatively
    // allow amount >= -1 (e.g. -1 => zero chroma)
    newC = Math.max(
      0,
      lch.C * (1 + clamp(amount, -1, Number.POSITIVE_INFINITY)),
    );
  }

  // Reconstruct color
  const newRgb = oklchToRgb(lch.L, newC, lch.h);
  return toHex(newRgb);
}

/**
 * Main saturate function that supports HSL (default) and OKLCH via opts.space.
 * @param {string} hex
 * @param {number} amount
 * @param {{space?:string, mode?:string}} opts
 * @returns {string}
 */
function saturate(hex, amount, opts) {
  opts = opts || {};
  const space = opts.space || "hsl";
  if (space === "oklch") {
    return saturateOklch(hex, amount, opts);
  }
  return saturateHsl(hex, amount);
}

/**
 * Desaturate convenience wrapper. For OKLCH forward to saturate with negative amount.
 * @param {string} hex
 * @param {number} amount
 * @param {{space?:string, mode?:string}} opts
 * @returns {string}
 */
function desaturate(hex, amount, opts) {
  amount = Math.abs(Number(amount) || 0);
  // invert amount for saturate (negates)
  return saturate(hex, -amount, opts);
}

/* ---------------- Exports ---------------- */

/* ---------------- Color class (OKLCH internal) ---------------- */

/**
 * Color - immutable color object with OKLCH internal representation.
 *
 * Construction:
 *  - new Color('#aabbcc')
 *  - Color.fromHex('#aabbcc')
 *  - Color.fromRgb({r,g,b}) or Color.fromRgb(r,g,b)
 *  - Color.fromOklch({L,C,h}) or Color.fromOklch(L,C,h)
 *
 * Operations return new Color instances (immutable API):
 *  - color.saturate(0.25)         // OKLCH relative by default (+25% chroma)
 *  - color.desaturate(0.25)
 *  - color.lighten(0.1)           // +0.1 to L (OKLCH L is in ~0..1)
 *  - color.darken(0.1)
 *  - color.mix(other, weight)     // perceptual mix in OKLab
 *
 * Accessors:
 *  - color.hex
 *  - color.rgb -> {r,g,b}
 *  - color.oklch -> {L,C,h}
 *  - color.oklab -> {L,a,b}
 */
class Color {
  /**
   * Construct a Color.
   * @param {string|{r?:number,g?:number,b?:number}|{L?:number,C?:number,h?:number}|{L?:number,a?:number,b?:number}} input
   */
  constructor(input) {
    if (typeof input === "string") {
      // hex
      const rgb = parseHex(input);
      const okl = rgbToOklch(rgb.r, rgb.g, rgb.b);
      this._L = okl.L;
      this._C = okl.C;
      this._h = okl.h;
      return;
    }

    if (input && typeof input === "object") {
      /** @type {any} */
      const objAny = input;
      // prefer explicit rgb keys when present
      if ("r" in objAny || "g" in objAny || "b" in objAny) {
        const r = Number(objAny.r) || 0;
        const g = Number(objAny.g) || 0;
        const b = Number(objAny.b) || 0;
        const okl = rgbToOklch(r, g, b);
        this._L = okl.L;
        this._C = okl.C;
        this._h = okl.h;
        return;
      }
      if ("L" in objAny && "C" in objAny && "h" in objAny) {
        this._L = Number(objAny.L) || 0;
        this._C = Number(objAny.C) || 0;
        this._h = Number(objAny.h) || 0;
        return;
      }
      if ("L" in objAny && "a" in objAny && "b" in objAny) {
        const a = Number(objAny.a) || 0;
        const b = Number(objAny.b) || 0;
        this._L = Number(objAny.L) || 0;
        this._C = Math.sqrt(a * a + b * b);
        this._h = Math.atan2(b, a) * (180 / Math.PI);
        return;
      }
    }

    // fallback to black
    this._L = 0;
    this._C = 0;
    this._h = 0;
  }

  /* ---------- Static constructors ---------- */
  /**
   * Create from hex string.
   * @param {string} hex
   * @returns {Color}
   */
  static fromHex(hex) {
    return new Color(hex);
  }
  /**
   * Create from RGB (r,g,b) or pass an object {r,g,b}
   * @param {number|object} r
   * @param {number} [g]
   * @param {number} [b]
   * @returns {Color}
   */
  static fromRgb(r, g, b) {
    if (arguments.length === 1 && typeof r === "object") return new Color(r);
    return new Color({
      r: Number(r) || 0,
      g: Number(g) || 0,
      b: Number(b) || 0,
    });
  }
  /**
   * Create from OKLCH or pass object {L,C,h}
   * @param {number|object} L
   * @param {number} [C]
   * @param {number} [h]
   * @returns {Color}
   */
  static fromOklch(L, C, h) {
    if (arguments.length === 1 && typeof L === "object") return new Color(L);
    return new Color({
      L: Number(L) || 0,
      C: Number(C) || 0,
      h: Number(h) || 0,
    });
  }

  /* ---------- Accessors ---------- */
  get hex() {
    return toHex(oklchToRgb(this._L, this._C, this._h));
  }
  get rgb() {
    return oklchToRgb(this._L, this._C, this._h);
  }
  get oklch() {
    return { L: this._L, C: this._C, h: this._h };
  }
  get oklab() {
    const rad = (this._h || 0) * (Math.PI / 180);
    const a = this._C * Math.cos(rad);
    const b = this._C * Math.sin(rad);
    return { L: this._L, a, b };
  }

  /* ---------- Mutating operations (return new Color) ---------- */

  /**
   * Saturate the color.
   * @param {number} amount - fraction (e.g. 0.25 => +25% chroma)
   * @param {{mode?:string}} [opts]
   * @returns {Color}
   */
  saturate(amount, opts) {
    opts = opts || {};
    // Use the OKLCH-based algorithm for best perceptual result by default
    const hex = saturateOklch(this.hex, amount, opts);
    return Color.fromHex(hex);
  }

  /**
   * Desaturate the color.
   * @param {number} amount
   * @param {{mode?:string}} [opts]
   * @returns {Color}
   */
  desaturate(amount, opts) {
    amount = Math.abs(Number(amount) || 0);
    return this.saturate(-amount, opts);
  }

  /**
   * Lighten by adjusting OKLCH L (additive).
   * @param {number} amount
   * @returns {Color}
   */
  lighten(amount) {
    amount = Number(amount) || 0;
    const L = clamp(this._L + amount, 0, 1);
    return Color.fromOklch(L, this._C, this._h);
  }

  /**
   * Darken by adjusting OKLCH L.
   * @param {number} amount
   * @returns {Color}
   */
  darken(amount) {
    amount = Number(amount) || 0;
    return this.lighten(-amount);
  }

  /**
   * Perceptual mix in OKLab (not simple RGB mix).
   * @param {Color|string|object} other
   * @param {number} weight 0..1
   * @returns {Color}
   */
  mix(other, weight) {
    const o = other instanceof Color ? other : new Color(other);
    const w = clamp(Number(weight) || 0, 0, 1);
    const a1 = this.oklab;
    const a2 = o.oklab;
    const L = a1.L * (1 - w) + a2.L * w;
    const a = a1.a * (1 - w) + a2.a * w;
    const b = a1.b * (1 - w) + a2.b * w;
    const rgb = oklabToRgb(L, a, b);
    return Color.fromRgb(rgb);
  }

  /**
   * Return a simple string representation
   */
  toString() {
    return this.hex;
  }

  /**
   * Clone (immutably)
   */
  clone() {
    return Color.fromOklch(this._L, this._C, this._h);
  }
}

/* ---------------- Exports (include Color) ---------------- */
export {
  parseHex,
  toHex,
  mix,
  lighten,
  darken,
  withOpacity,
  // HSL helpers
  rgbToHsl,
  hslToRgb,
  saturateHsl,
  // OKLab / OKLCH helpers
  srgbToLinear,
  linearToSrgb,
  rgbToOklab,
  oklabToRgb,
  rgbToOklch,
  oklchToRgb,
  saturateOklch,
  // Main API
  saturate,
  desaturate,
  // Class
  Color,
};
