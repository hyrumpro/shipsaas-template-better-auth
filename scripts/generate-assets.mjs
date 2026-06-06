#!/usr/bin/env node
/**
 * scripts/generate-assets.mjs
 *
 * Generates the static brand assets that the app references from `public/`:
 *   - og-image.png  (1200x630)  — Open Graph / Twitter card image
 *   - favicon.ico   (32x32)     — Browser tab icon
 *   - logo.png      (256x256)   — PWA / schema.org logo
 *
 * Pure-Node: no native deps. Uses `zlib` to deflate raw pixel data and writes
 * valid PNGs manually, then wraps the PNG inside an ICO container.
 *
 * The visuals are intentionally simple — solid brand background, hairline
 * frame, dot grid, and the wordmark. Buyers of the template are expected
 * to replace these with their own artwork.
 *
 * Run:  node scripts/generate-assets.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "..", "public");
mkdirSync(PUBLIC_DIR, { recursive: true });

/* ----------------------------------------------------------------------------
 * Brand palette (mirrors src/app/globals.css :root tokens)
 * -------------------------------------------------------------------------- */
const PALETTE = {
  bgLight: [255, 255, 255],
  bgDark: [11, 15, 26],
  fgLight: [28, 32, 44],
  fgDark: [244, 246, 250],
  border: [226, 232, 240],
  accent: [79, 70, 229],
  mute: [148, 163, 184],
};

/* ----------------------------------------------------------------------------
 * 5x7 pixel font for ASCII uppercase + digits + a few symbols
 * Each glyph is 7 rows of 5 bits. The 'ShipSaaS' wordmark uses only A-Z, 0-9,
 * space, period and dash.
 * -------------------------------------------------------------------------- */
const FONT = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 12, 12],
  "-": [0, 0, 0, 31, 0, 0, 0],
  "/": [3, 6, 12, 24, 16, 0, 0],
  "0": [14, 17, 17, 17, 17, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [14, 17, 1, 6, 1, 17, 14],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 1, 17, 14],
  "6": [6, 8, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 4, 8, 16, 16],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 2, 12],
  A: [14, 17, 17, 17, 31, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
};

const FONT_WIDTH = 5;
const FONT_HEIGHT = 7;
const FONT_SPACING = 1;

function textWidth(text) {
  return text.length * FONT_WIDTH + (text.length - 1) * FONT_SPACING;
}

function drawText(pixels, width, height, text, x, y, scale, color) {
  const upper = text.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const glyph = FONT[upper[i]] || FONT[" "];
    for (let row = 0; row < FONT_HEIGHT; row++) {
      for (let col = 0; col < FONT_WIDTH; col++) {
        const on = (glyph[row] >> (FONT_WIDTH - 1 - col)) & 1;
        if (!on) continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = x + (i * (FONT_WIDTH + FONT_SPACING) + col) * scale + sx;
            const py = y + (row * scale) + sy;
            if (px < 0 || px >= width || py < 0 || py >= height) continue;
            setPixel(pixels, width, height, px, py, color);
          }
        }
      }
    }
  }
}

function setPixel(pixels, width, height, x, y, [r, g, b]) {
  const idx = (y * width + x) * 4;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = 255;
}

function getPixel(pixels, width, x, y) {
  const idx = (y * width + x) * 4;
  return [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
}

function blend(bg, fg, alpha) {
  return [
    Math.round(bg[0] * (1 - alpha) + fg[0] * alpha),
    Math.round(bg[1] * (1 - alpha) + fg[1] * alpha),
    Math.round(bg[2] * (1 - alpha) + fg[2] * alpha),
  ];
}

function fill(pixels, width, height, color) {
  for (let i = 0; i < width * height; i++) {
    pixels[i * 4] = color[0];
    pixels[i * 4 + 1] = color[1];
    pixels[i * 4 + 2] = color[2];
    pixels[i * 4 + 3] = 255;
  }
}

function drawHairlineFrame(pixels, width, height, inset, thickness, color) {
  for (let t = 0; t < thickness; t++) {
    for (let x = inset; x < width - inset; x++) {
      setPixel(pixels, width, height, x, inset + t, color);
      setPixel(pixels, width, height, x, height - inset - 1 - t, color);
    }
    for (let y = inset; y < height - inset; y++) {
      setPixel(pixels, width, height, inset + t, y, color);
      setPixel(pixels, width, height, width - inset - 1 - t, y, color);
    }
  }
}

function drawDotGrid(pixels, width, height, color, step = 40, radius = 1) {
  for (let y = step; y < height; y += step) {
    for (let x = step; x < width; x += step) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const px = x + dx;
          const py = y + dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const existing = getPixel(pixels, width, px, py);
          const mixed = blend(existing, color, 0.35);
          setPixel(pixels, width, height, px, py, mixed);
        }
      }
    }
  }
}

function drawGlyph(pixels, width, height, cx, cy, radius, color) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;
      const existing = getPixel(pixels, width, x, y);
      const mixed = blend(existing, color, Math.max(0, 1 - dist / radius) * 0.9 + 0.1);
      setPixel(pixels, width, height, x, y, mixed);
    }
  }
}

function drawDiamond(pixels, width, height, cx, cy, size, color) {
  for (let y = cy - size; y <= cy + size; y++) {
    for (let x = cx - size; x <= cx + size; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      if (dx + dy > size) continue;
      setPixel(pixels, width, height, x, y, color);
    }
  }
}

/* ----------------------------------------------------------------------------
 * PNG encoder
 * -------------------------------------------------------------------------- */
function crc32(buf) {
  const table = (crc32.table ??= (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      t[n] = c >>> 0;
    }
    return t;
  })());
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const filtered = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    filtered[y * (stride + 1)] = 0;
    rgba.copy(filtered, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const compressed = deflateSync(filtered, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ----------------------------------------------------------------------------
 * ICO encoder (wraps a single PNG entry — supported by all modern browsers)
 * -------------------------------------------------------------------------- */
function encodeIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuffer]);
}

/* ----------------------------------------------------------------------------
 * Compositions
 * -------------------------------------------------------------------------- */
function buildOgImage({ width = 1200, height = 630, dark = false } = {}) {
  const pixels = Buffer.alloc(width * height * 4);
  const bg = dark ? PALETTE.bgDark : PALETTE.bgLight;
  const fg = dark ? PALETTE.fgDark : PALETTE.fgLight;
  const border = dark ? [38, 50, 73] : PALETTE.border;

  fill(pixels, width, height, bg);
  drawDotGrid(pixels, width, height, border, 48, 1);
  drawHairlineFrame(pixels, width, height, 32, 1, border);

  const wordmark = "SHIPSAAS";
  const subtitle = "NEXT.JS 16  SAAS  TEMPLATE";
  const tagline = "LAUNCH IN DAYS.";

  const wordmarkScale = 14;
  const subtitleScale = 5;
  const taglineScale = 9;

  const wWidth = textWidth(wordmark) * wordmarkScale;
  const wHeight = FONT_HEIGHT * wordmarkScale;
  const sWidth = textWidth(subtitle) * subtitleScale;
  const sHeight = FONT_HEIGHT * subtitleScale;
  const tWidth = textWidth(tagline) * taglineScale;
  const tHeight = FONT_HEIGHT * taglineScale;

  const centerY = Math.floor(height / 2);
  const gap = 28;
  const blockHeight = wHeight + gap + sHeight + gap + tHeight;
  const blockTop = centerY - Math.floor(blockHeight / 2);

  drawText(
    pixels,
    width,
    height,
    wordmark,
    Math.floor((width - wWidth) / 2),
    blockTop,
    wordmarkScale,
    fg,
  );

  drawText(
    pixels,
    width,
    height,
    subtitle,
    Math.floor((width - sWidth) / 2),
    blockTop + wHeight + gap,
    subtitleScale,
    dark ? PALETTE.mute : [100, 116, 139],
  );

  drawText(
    pixels,
    width,
    height,
    tagline,
    Math.floor((width - tWidth) / 2),
    blockTop + wHeight + gap + sHeight + gap,
    taglineScale,
    dark ? [129, 140, 248] : [67, 56, 202],
  );

  const glyphSize = 18;
  const glyphY = blockTop - glyphSize * 2 - 24;
  drawDiamond(pixels, width, height, Math.floor(width / 2), glyphY, glyphSize, dark ? [129, 140, 248] : [67, 56, 202]);
  drawGlyph(pixels, width, height, Math.floor(width / 2), glyphY, 6, bg);

  return encodePng(width, height, pixels);
}

function buildFavicon({ size = 32, dark = false } = {}) {
  const pixels = Buffer.alloc(size * size * 4);
  const bg = dark ? PALETTE.bgDark : [67, 56, 202];
  fill(pixels, size, size, bg);
  const diamondSize = Math.floor(size * 0.36);
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  drawDiamond(pixels, size, size, cx, cy, diamondSize, dark ? PALETTE.bgDark : [255, 255, 255]);
  const inner = Math.max(2, Math.floor(diamondSize * 0.32));
  drawDiamond(pixels, size, size, cx, cy, inner, dark ? [129, 140, 248] : [67, 56, 202]);
  return encodePng(size, size, pixels);
}

function buildLogo({ size = 256, dark = false } = {}) {
  const pixels = Buffer.alloc(size * size * 4);
  const bg = dark ? PALETTE.bgDark : PALETTE.bgLight;
  fill(pixels, size, size, bg);
  const diamondSize = Math.floor(size * 0.18);
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  drawDiamond(pixels, size, size, cx, cy, diamondSize, [67, 56, 202]);
  const inner = Math.max(2, Math.floor(diamondSize * 0.32));
  drawDiamond(pixels, size, size, cx, cy, inner, [255, 255, 255]);
  return encodePng(size, size, pixels);
}

/* ----------------------------------------------------------------------------
 * Write files
 * -------------------------------------------------------------------------- */
function writeAsset(filename, data) {
  const out = join(PUBLIC_DIR, filename);
  writeFileSync(out, data);
  console.log(`  wrote ${filename} (${data.length} bytes)`);
}

console.log("Generating brand assets in public/...");
writeAsset("og-image.png", buildOgImage());
writeAsset("og-image-dark.png", buildOgImage({ dark: true }));
writeAsset("logo.png", buildLogo());
const faviconPng = buildFavicon();
writeAsset("favicon.ico", encodeIco(faviconPng, 32));
writeAsset("apple-touch-icon.png", buildFavicon({ size: 180 }));
console.log("Done.");
