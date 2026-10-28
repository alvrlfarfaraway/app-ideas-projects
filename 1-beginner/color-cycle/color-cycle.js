// Logika murni untuk Color Cycle. Tidak menyentuh DOM agar mudah dites di test.html.

/**
 * Format warna yang bisa dipilih. Nilai setiap komponen selalu 0 sampai `modulus - 1`.
 * Nilai yang melewati batas berputar kembali dari 0, seperti odometer.
 */
const FORMATS = {
  rgb: {
    hexValues: true,
    wrapHint: "Setiap langkah, kenaikan ditambahkan ke nilainya. Nilai yang melewati FF berputar kembali dari 00.",
    components: [
      { symbol: "R", name: "Merah", modulus: 256, color: "#e03131" },
      { symbol: "G", name: "Hijau", modulus: 256, color: "#2f9e44" },
      { symbol: "B", name: "Biru", modulus: 256, color: "#1c7ed6" },
    ],
  },
  hsl: {
    hexValues: false,
    wrapHint: "Setiap langkah, kenaikan ditambahkan ke nilainya. H yang melewati 359° kembali dari 0°, S dan L yang melewati 100% kembali dari 0%.",
    components: [
      { symbol: "H", name: "Rona", modulus: 360, unit: "°" },
      { symbol: "S", name: "Saturasi", modulus: 101, unit: "%" },
      { symbol: "L", name: "Kecerahan", modulus: 101, unit: "%" },
    ],
  },
};

// Minimal 200 ms: paling banyak 5 perubahan per detik (2,5 kedipan), di bawah batas
// aman WCAG yaitu 3 kedipan per detik, walaupun kenaikannya besar.
const INTERVAL = { min: 200, max: 2000, default: 250 };
const DEFAULT_COLOR = [0x20, 0x60, 0xc0]; // #2060C0
const DEFAULT_INCREMENTS = { rgb: [8, 4, -2], hsl: [5, 0, 0] };

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

function invalid(error) {
  return { value: null, error };
}

/**
 * Membaca satu komponen warna heksadesimal 2 digit, contoh: "FF" -> 255.
 * Mengembalikan { value, error }. Jika input tidak valid, value bernilai null
 * dan error berisi peringatan untuk pengguna.
 */
function parseHexComponent(text) {
  // for...of membaca per karakter, jadi emoji terbaca utuh sebagai satu karakter
  for (const character of text) {
    if (!/^[0-9a-f]$/i.test(character)) {
      const shown = /\s/.test(character) ? "spasi" : `"${character}"`;
      return invalid(`Karakter ${shown} bukan digit heksadesimal. Gunakan 0–9 atau A–F.`);
    }
  }
  if (text.length === 0) {
    return invalid("Isi 2 digit heksadesimal, dari 00 sampai FF.");
  }
  if (text.length === 1) {
    return invalid(`Isi 2 digit, misalnya 0${text.toUpperCase()}.`);
  }
  if (text.length > 2) {
    return invalid("Maksimal 2 digit.");
  }
  return { value: parseInt(text, 16), error: "" };
}

/**
 * Membaca bilangan bulat dari rentang [min, max], contoh: "-3" -> -3.
 * Mengembalikan { value, error } seperti parseHexComponent.
 */
function parseInteger(text, min, max) {
  const trimmed = text.trim();
  if (trimmed === "") {
    return invalid(`Isi bilangan bulat dari ${min} sampai ${max}.`);
  }
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return invalid(`Harus bilangan bulat (tanpa koma) dari ${min} sampai ${max}.`);
  }
  const value = Number(trimmed) + 0; // + 0 mengubah -0 menjadi 0
  if (value < min || value > max) {
    return invalid(`Harus antara ${min} dan ${max}.`);
  }
  return { value, error: "" };
}

/**
 * Menambahkan `increment` ke `value`, lalu memutarnya ke rentang 0 sampai modulus - 1.
 * Contoh: cycleValue(250, 10, 256) -> 4, cycleValue(0, -1, 256) -> 255.
 */
function cycleValue(value, increment, modulus) {
  return (((value + increment) % modulus) + modulus) % modulus;
}

/** Warna pada langkah berikutnya: setiap komponen ditambah kenaikannya masing-masing. */
function nextValues(format, values, increments) {
  return FORMATS[format].components.map((component, index) =>
    cycleValue(values[index], increments[index], component.modulus));
}

/** Menulis angka 0–255 sebagai 2 digit heksadesimal, contoh: 10 -> "0A". */
function toHex2(value) {
  return value.toString(16).toUpperCase().padStart(2, "0");
}

/** Menulis warna sebagai kode CSS, contoh: "#2060C0" atau "hsl(216, 71%, 44%)". */
function cssColor(format, values) {
  if (format === "rgb") {
    return `#${values.map(toHex2).join("")}`;
  }
  const [hue, saturation, lightness] = values;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Mengubah HSL (H 0–359, S dan L 0–100) menjadi RGB (0–255).
 * Rumusnya mengikuti contoh kode di spesifikasi CSS Color Level 4.
 */
function hslToRgb([hue, saturation, lightness]) {
  const s = saturation / 100;
  const l = lightness / 100;
  const amount = s * Math.min(l, 1 - l);
  const channel = (n) => {
    const k = (n + hue / 30) % 12;
    return l - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [channel(0), channel(8), channel(4)].map((value) => Math.round(value * 255));
}

/** Mengubah RGB (0–255) menjadi HSL yang dibulatkan ke bilangan bulat. */
function rgbToHsl([red, green, blue]) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const chroma = max - min;

  let hue = 0;
  let saturation = 0;
  if (chroma !== 0) {
    saturation = chroma / (1 - Math.abs(2 * lightness - 1));
    if (max === r) {
      hue = (g - b) / chroma;
    } else if (max === g) {
      hue = (b - r) / chroma + 2;
    } else {
      hue = (r - g) / chroma + 4;
    }
  }
  // cycleValue merapikan hue negatif (misalnya magenta, -60°) dan 360° hasil pembulatan menjadi 0°
  return [cycleValue(Math.round(hue * 60), 0, 360), Math.round(saturation * 100), Math.round(lightness * 100)];
}

/** Mengubah nilai warna dari satu format ke format lain. Selalu mengembalikan array baru. */
function convertValues(values, from, to) {
  if (from === to) {
    return [...values];
  }
  return to === "hsl" ? rgbToHsl(values) : hslToRgb(values);
}

/**
 * Warna yang hanya memperlihatkan satu komponen, untuk kotak kecil di samping namanya.
 * RGB: komponen lain dibuat 0, misalnya merah saja -> #200000.
 * HSL: H tampil sebagai rona murni, S sebagai rona dengan saturasi itu, L sebagai abu-abu.
 */
function isolatedColor(format, index, values) {
  if (format === "rgb") {
    return cssColor("rgb", values.map((value, i) => (i === index ? value : 0)));
  }
  const [hue, saturation, lightness] = values;
  const isolated = [[hue, 100, 50], [hue, saturation, 50], [0, 0, lightness]][index];
  return cssColor("hsl", isolated);
}

/** Luminans relatif sebuah warna RGB menurut WCAG: 0 untuk hitam, 1 untuk putih. */
function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Memilih teks hitam atau putih, mana yang kontrasnya lebih tinggi di atas warna `rgb`. */
function readableTextColor(rgb) {
  const luminance = relativeLuminance(rgb);
  const contrastWithBlack = (luminance + 0.05) / 0.05;
  const contrastWithWhite = 1.05 / (luminance + 0.05);
  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff";
}
