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

// Mengembalikan true jika `run` melempar error.
function throwsError(run) {
  try {
    run();
    return false;
  } catch {
    return true;
  }
}

// litIndex: riak lampu
test("langkah 0 menyalakan lampu pertama", () => litIndex(0), 0);
test("langkah 6 menyalakan lampu terakhir", () => litIndex(6), 6);
test("setelah lampu terakhir kembali ke lampu pertama", () => litIndex(7), 0);
test("tepat satu lampu menyala tiap langkah dan pendahulunya padam", () => {
  for (let step = 1; step < 20; step++) {
    if (litIndex(step) !== (litIndex(step - 1) + 1) % LIGHT_COUNT) {
      return `salah pada langkah ${step}`;
    }
  }
  return "riak benar";
}, "riak benar");
test("baris kedua bergeser satu lampu", () => litIndex(0, 1), 1);
test("baris ketujuh pada langkah 3 menyalakan indeks 2", () => litIndex(3, 6), 2);
test("jumlah lampu lain tetap berputar", () => litIndex(5, 0, 4), 1);

// clampInt: membatasi nilai input
test("interval di dalam rentang tidak berubah", () => clampInt("300", INTERVAL), 300);
test("interval terlalu kecil dinaikkan ke minimum", () => clampInt("10", INTERVAL), INTERVAL.min);
test("interval terlalu besar diturunkan ke maksimum", () => clampInt(99999, INTERVAL), INTERVAL.max);
test("input kosong memakai nilai bawaan", () => clampInt("", INTERVAL), INTERVAL.default);
test("teks bukan angka memakai nilai bawaan", () => clampInt("abc", ROWS), ROWS.default);
test("pecahan dibulatkan", () => clampInt("3.6", ROWS), 4);
test("baris dibatasi 1–7", () => `${clampInt(0, ROWS)}-${clampInt(8, ROWS)}`, "1-7");

// litAppearance: intensitas
test("intensitas 100 memberi kecerahan 1.6", () => litAppearance(100, 48).brightness, 1.6);
test("intensitas 50 memberi cahaya setengah ukuran lampu", () => litAppearance(50, 48).glow, 24);
test("intensitas di bawah minimum dibatasi ke 10", () => litAppearance(0, 50).glow, 5);
test("lampu menyala lebih terang jika intensitas lebih tinggi", () => litAppearance(80, 48).brightness > litAppearance(20, 48).brightness, true);

// hexToRgb
test('"#ff3b3b" menjadi "255 59 59"', () => hexToRgb("#ff3b3b"), "255 59 59");
test("huruf besar juga diterima", () => hexToRgb("#4C6EF5"), "76 110 245");
test("warna tidak valid ditolak", () => throwsError(() => hexToRgb("merah")), true);

// Data bawaan
test("ada 7 warna bawaan", () => DEFAULT_COLORS.length, LIGHT_COUNT);
test("semua warna bawaan valid", () => DEFAULT_COLORS.every((color) => !throwsError(() => hexToRgb(color))), true);

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
