// Logika murni untuk Christmas Lights. Tidak menyentuh DOM agar mudah dites di test.html.

const LIGHT_COUNT = 7;
const DEFAULT_COLORS = ["#ff3b3b", "#ff922b", "#ffd43b", "#51cf66", "#3bc9db", "#4c6ef5", "#e64980"];

const INTERVAL = { min: 50, max: 2000, default: 300 };
const INTENSITY = { min: 10, max: 100, default: 70 };
const SIZE = { min: 24, max: 72, default: 48 };
const ROWS = { min: 1, max: 7, default: 1 };

/**
 * Membatasi angka ke rentang [min, max] dan membulatkannya.
 * Nilai yang bukan angka (misalnya input kosong) diganti dengan `fallback`.
 */
function clampInt(value, limits, fallback = limits.default) {
  const number = Number(value);
  if (value === "" || value === null || !Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(limits.max, Math.max(limits.min, Math.round(number)));
}

/**
 * Indeks lampu yang menyala pada baris `row` di langkah ke-`step`.
 * Setiap baris digeser satu lampu dari baris di atasnya sehingga riaknya membentuk diagonal.
 */
function litIndex(step, row = 0, count = LIGHT_COUNT) {
  return (((step + row) % count) + count) % count;
}

/**
 * Mengubah intensitas (10–100) menjadi tampilan lampu yang menyala:
 * - brightness: pengali kecerahan untuk CSS filter (1 = warna asli)
 * - glow: radius cahaya di sekitar lampu, sebanding dengan ukurannya
 */
function litAppearance(intensity, size) {
  const level = clampInt(intensity, INTENSITY) / 100;
  return {
    brightness: Number((1 + level * 0.6).toFixed(2)),
    glow: Math.round(size * level),
  };
}

/** Mengubah "#rrggbb" menjadi "r g b" untuk dipakai di rgb(... / alpha). */
function hexToRgb(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (match === null) {
    throw new Error(`"${hex}" bukan warna hex yang valid`);
  }
  const value = parseInt(match[1], 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}
