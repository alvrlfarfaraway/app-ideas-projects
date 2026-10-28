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

// binaryToDecimal
test('"0" menjadi 0', () => binaryToDecimal("0"), 0n);
test('"1" menjadi 1', () => binaryToDecimal("1"), 1n);
test('"1011" menjadi 11', () => binaryToDecimal("1011"), 11n);
test('"11111111" menjadi 255 (nilai 8 digit terbesar)', () => binaryToDecimal("11111111"), 255n);
test('"00000101" menjadi 5 (nol di depan tidak berpengaruh)', () => binaryToDecimal("00000101"), 5n);
test("64 digit angka 1 menjadi 2^64 - 1 (bonus: panjang bebas)", () => binaryToDecimal("1".repeat(64)), 2n ** 64n - 1n);
test("semua angka 0–255 cocok (n → biner → desimal = n)", () => {
  for (let n = 0; n <= 255; n++) {
    const binary = n.toString(2);
    if (binaryToDecimal(binary) !== BigInt(n)) {
      return `salah pada ${binary}`;
    }
  }
  return "semua cocok";
}, "semua cocok");
test("string kosong ditolak", () => throwsError(() => binaryToDecimal("")), true);
test('"102" ditolak', () => throwsError(() => binaryToDecimal("102")), true);

// findInvalidCharacter
test('"1010" tidak punya karakter salah', () => findInvalidCharacter("1010"), null);
test('karakter salah pertama di "10201" adalah "2"', () => findInvalidCharacter("10201"), "2");
test("spasi terdeteksi sebagai karakter salah", () => findInvalidCharacter("10 1"), " ");
test("emoji terbaca utuh sebagai satu karakter", () => findInvalidCharacter("1😀"), "😀");

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
