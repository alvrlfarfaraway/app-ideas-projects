// Test sederhana tanpa library: buka test.html di browser untuk melihat hasilnya.
const resultList = document.getElementById("results");
const summary = document.getElementById("summary");
let passed = 0;
let failed = 0;

// Menjalankan `run`, lalu membandingkan hasilnya dengan `expected`.
function test(description, run, expected) {
  let actual;
  try {
    actual = run();
  } catch (error) {
    actual = `error: ${error.message}`;
  }

  const item = document.createElement("li");
  if (actual === expected) {
    passed++;
    item.className = "pass";
    item.textContent = `✓ ${description}`;
  } else {
    failed++;
    item.className = "fail";
    item.textContent = `✗ ${description} — hasil: ${actual}, seharusnya: ${expected}`;
  }
  resultList.append(item);
}

// formatLength
test("0 ditulis tanpa satuan", () => formatLength(0, "px"), "0");
test("12 dengan satuan px", () => formatLength(12, "px"), "12px");
test("50 dengan satuan %", () => formatLength(50, "%"), "50%");

// compactValues: aturan shorthand CSS
test("4 sudut sama → 1 nilai", () => compactValues([8, 8, 8, 8]).join(" "), "8");
test("kiri atas = kanan bawah, kanan atas = kiri bawah → 2 nilai", () => compactValues([8, 4, 8, 4]).join(" "), "8 4");
test("kanan atas = kiri bawah → 3 nilai", () => compactValues([8, 4, 2, 4]).join(" "), "8 4 2");
test("semua berbeda → 4 nilai", () => compactValues([1, 2, 3, 4]).join(" "), "1 2 3 4");
test("hanya kiri atas = kanan bawah → tetap 4 nilai", () => compactValues([5, 1, 5, 2]).join(" "), "5 1 5 2");

// buildBorderRadius
test("mode 4 nilai, semua sudut 20px", () => buildBorderRadius([20, 20, 20, 20], [20, 20, 20, 20], "px"), "20px");
test("mode 4 nilai, nilai awal aplikasi", () => buildBorderRadius([48, 16, 48, 16], [48, 16, 48, 16], "px"), "48px 16px");
test("semua sudut 0", () => buildBorderRadius([0, 0, 0, 0], [0, 0, 0, 0], "px"), "0");
test("mode 8 nilai memakai tanda /", () => buildBorderRadius([30, 70, 70, 30], [30, 30, 70, 70], "%"), "30% 70% 70% 30% / 30% 30% 70% 70%");
test("bagian vertikal diringkas terpisah", () => buildBorderRadius([10, 10, 10, 10], [20, 20, 20, 20], "px"), "10px / 20px");

// Bandingkan dengan browser: shorthand buatan kita harus menghasilkan radius yang sama
// seperti mengatur setiap sudut satu per satu.
test("6.561 kombinasi 8 nilai (0, 10, 25px) cocok dengan hasil browser", () => {
  const options = [0, 10, 25];
  const properties = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"];
  const shorthandBox = document.createElement("div");
  const longhandBox = document.createElement("div");

  for (let combination = 0; combination < 3 ** 8; combination++) {
    // Ubah nomor kombinasi menjadi 8 digit basis 3, lalu pilih nilai untuk setiap digit.
    const values = [];
    let rest = combination;
    for (let i = 0; i < 8; i++) {
      values.push(options[rest % 3]);
      rest = Math.floor(rest / 3);
    }
    const horizontal = values.slice(0, 4);
    const vertical = values.slice(4);
    const borderRadius = buildBorderRadius(horizontal, vertical, "px");

    shorthandBox.style.borderRadius = "";
    shorthandBox.style.borderRadius = borderRadius;
    for (let corner = 0; corner < 4; corner++) {
      const property = properties[corner];
      longhandBox.style[property] = `${horizontal[corner]}px ${vertical[corner]}px`;
      if (shorthandBox.style[property] !== longhandBox.style[property]) {
        return `berbeda pada "${borderRadius}"`;
      }
    }
  }
  return "semua cocok";
}, "semua cocok");

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
