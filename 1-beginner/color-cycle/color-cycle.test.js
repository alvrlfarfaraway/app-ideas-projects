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

// parseHexComponent
test('"FF" menjadi 255', () => parseHexComponent("FF").value, 255);
test('huruf kecil "0a" menjadi 10', () => parseHexComponent("0a").value, 10);
test("semua nilai 00–FF terbaca kembali", () => {
  for (let n = 0; n <= 255; n++) {
    if (parseHexComponent(toHex2(n)).value !== n) return `salah pada ${n}`;
  }
  return "semua cocok";
}, "semua cocok");
test('"G1" ditolak dan menyebut "G"', () => parseHexComponent("G1").error.includes('"G"'), true);
test("spasi ditolak", () => parseHexComponent("F ").error.includes("spasi"), true);
test("emoji terbaca utuh", () => parseHexComponent("😀").error.includes('"😀"'), true);
test('1 digit "F" menyarankan "0F"', () => parseHexComponent("F").error.includes("0F"), true);
test("kosong ditolak", () => parseHexComponent("").value, null);
test("3 digit ditolak", () => parseHexComponent("FFF").value, null);

// parseInteger
test('"-3" menjadi -3', () => parseInteger("-3", -255, 255).value, -3);
test('"+2" menjadi 2', () => parseInteger("+2", -255, 255).value, 2);
test('"-0" menjadi 0, bukan -0', () => Object.is(parseInteger("-0", -255, 255).value, 0), true);
test('"2.5" ditolak', () => parseInteger("2.5", -255, 255).value, null);
test('"?" (input number tak terbaca) ditolak', () => parseInteger("?", -255, 255).value, null);
test("kosong ditolak", () => parseInteger("", -255, 255).value, null);
test("di luar rentang ditolak", () => parseInteger("256", -255, 255).error, "Harus antara -255 dan 255.");

// cycleValue dan nextValues
test("FF + 1 berputar ke 00", () => cycleValue(255, 1, 256), 0);
test("250 + 10 berputar ke 4", () => cycleValue(250, 10, 256), 4);
test("00 - 1 berputar ke FF", () => cycleValue(0, -1, 256), 255);
test("hue 350 + 20 menjadi 10", () => cycleValue(350, 20, 360), 10);
test("L 100 + 1 menjadi 0", () => cycleValue(100, 1, 101), 0);
test("langkah RGB", () => nextValues("rgb", [255, 0, 128], [1, 2, -1]).join(), "0,2,127");

// Format dan konversi
test("toHex2(10) = 0A", () => toHex2(10), "0A");
test("cssColor RGB", () => cssColor("rgb", [32, 96, 192]), "#2060C0");
test("cssColor HSL", () => cssColor("hsl", [210, 100, 56]), "hsl(210, 100%, 56%)");
test("merah ke HSL", () => rgbToHsl([255, 0, 0]).join(), "0,100,50");
test("#2060C0 ke HSL", () => rgbToHsl([32, 96, 192]).join(), "216,71,44");
test("magenta ke HSL (hue negatif dirapikan)", () => rgbToHsl([255, 0, 255]).join(), "300,100,50");
test("putih dan hitam ke HSL", () => `${rgbToHsl([255, 255, 255])}|${rgbToHsl([0, 0, 0])}`, "0,0,100|0,0,0");
test("hsl(210, 100%, 56%) ke RGB", () => hslToRgb([210, 100, 56]).join(), "31,143,255");
test("hslToRgb sama dengan hasil browser", () => {
  const probe = document.createElement("div");
  document.body.append(probe);
  for (let h = 0; h < 360; h += 7) {
    for (let s = 0; s <= 100; s += 9) {
      for (let l = 0; l <= 100; l += 9) {
        probe.style.color = `hsl(${h}, ${s}%, ${l}%)`;
        const expected = getComputedStyle(probe).color;
        const actual = `rgb(${hslToRgb([h, s, l]).join(", ")})`;
        if (actual !== expected) return `beda di hsl(${h}, ${s}%, ${l}%): ${actual} vs ${expected}`;
      }
    }
  }
  probe.remove();
  return "semua sama";
}, "semua sama");
test("convertValues ke format yang sama membuat array baru", () => {
  const values = [1, 2, 3];
  return convertValues(values, "rgb", "rgb") !== values;
}, true);
test("isolatedColor R", () => isolatedColor("rgb", 0, [32, 96, 192]), "#200000");
test("isolatedColor L", () => isolatedColor("hsl", 2, [210, 100, 56]), "hsl(0, 0%, 56%)");

// readableTextColor
test("teks hitam di atas putih", () => readableTextColor([255, 255, 255]), "#000000");
test("teks putih di atas #2060C0", () => readableTextColor([32, 96, 192]), "#ffffff");
test("teks hitam di atas kuning", () => readableTextColor([255, 255, 0]), "#000000");

// Batas interval
test("interval di bawah minimum dinaikkan", () => clampInt("100", INTERVAL), 200);
test("paling banyak 5 perubahan per detik", () => 1000 / INTERVAL.min <= 5, true);

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
