/**
 * Menulis panjang CSS. Nilai 0 ditulis tanpa satuan.
 * Contoh: formatLength(12, "px") -> "12px", formatLength(0, "%") -> "0".
 */
function formatLength(value, unit) {
  return value === 0 ? "0" : `${value}${unit}`;
}

/**
 * Meringkas 4 nilai sudut sesuai aturan shorthand CSS.
 * Urutan nilai: kiri atas, kanan atas, kanan bawah, kiri bawah.
 * - 4 nilai: setiap sudut berbeda
 * - 3 nilai: kanan atas = kiri bawah
 * - 2 nilai: kiri atas = kanan bawah dan kanan atas = kiri bawah
 * - 1 nilai: keempat sudut sama
 */
function compactValues(values) {
  const [topLeft, topRight, bottomRight, bottomLeft] = values;
  if (topRight !== bottomLeft) {
    return [topLeft, topRight, bottomRight, bottomLeft];
  }
  if (topLeft !== bottomRight) {
    return [topLeft, topRight, bottomRight];
  }
  if (topLeft !== topRight) {
    return [topLeft, topRight];
  }
  return [topLeft];
}

/**
 * Membuat nilai properti border-radius, contoh: "48px 16px" atau "30% 70% / 50%".
 * `horizontal` dan `vertical` berisi 4 angka dengan urutan yang sama seperti compactValues.
 * Jika radius vertikal sama dengan horizontal, bagian setelah "/" tidak perlu ditulis.
 */
function buildBorderRadius(horizontal, vertical, unit) {
  const horizontalText = compactValues(horizontal).map((value) => formatLength(value, unit)).join(" ");
  const verticalText = compactValues(vertical).map((value) => formatLength(value, unit)).join(" ");
  return horizontalText === verticalText ? horizontalText : `${horizontalText} / ${verticalText}`;
}
