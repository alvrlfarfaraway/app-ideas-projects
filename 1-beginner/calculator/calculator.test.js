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

// Menekan tombol di `keys` secara berurutan. Tombol dipisah spasi, dan angka seperti "12.5" diketik per karakter.
function pressKeys(keys) {
  let state = createCalculator();
  for (const token of keys.split(" ")) {
    if (token === "") {
      continue;
    }
    if (/^[0-9.]+$/.test(token)) {
      for (const character of token) {
        state = press(state, character);
      }
    } else {
      state = press(state, token);
    }
  }
  return state;
}

// Menekan `keys`, lalu membandingkan isi layar dengan `expected`.
function testDisplay(keys, expected, note = "") {
  const description = `${keys || "(belum ada tombol)"} → ${expected}${note ? ` (${note})` : ""}`;
  test(description, () => getDisplay(pressKeys(keys)), expected);
}

// Menekan `keys`, lalu membandingkan baris perhitungan di atas layar dengan `expected`.
function testExpression(keys, expected) {
  test(`baris atas setelah ${keys || "(belum ada tombol)"} → "${expected}"`, () => pressKeys(keys).expression, expected);
}

// Layar dan input angka
testDisplay("", "0", "layar awal");
testDisplay("123", "123");
testDisplay("123456789", "12345678", "digit ke-9 diabaikan");
testDisplay("007", "7", "nol di depan diganti");

// Operasi
testDisplay("12 + 7 =", "19");
testDisplay("5 - 8 =", "-3");
testDisplay("6 * 7 =", "42");
testDisplay("8 / 2 =", "4");
testDisplay("7 =", "7", "hanya angka terakhir");
testDisplay("5 + 3 +", "8", "hasil operasi sebelumnya tampil saat operasi berikutnya dipilih");
testDisplay("5 + 3 * 2 =", "16", "dihitung urut dari kiri");
testDisplay("5 + =", "10", "angka terakhir dipakai dua kali");
testDisplay("5 + 3 = =", "11", "= berulang mengulang operasi terakhir");
testDisplay("5 + * 3 =", "15", "operasi bisa diganti sebelum angka kedua");
testDisplay("5 + 3 = 2 + 1 =", "3", "angka setelah = memulai perhitungan baru");
testDisplay("5 + 3 = * 2 =", "16", "operasi setelah = melanjutkan dari hasil");

// Tombol C
testDisplay("5 + 3 C", "0", "angka terakhir dihapus");
testDisplay("5 + 3 C 4 =", "9", "operasi yang menunggu tetap ada");
testDisplay("5 + 3 C =", "5", "angka yang dihapus dihitung 0");
testDisplay("5 + C", "5", "operasi dibatalkan, layar kembali ke nilai sebelumnya");
testDisplay("5 + C - 2 =", "3");
testDisplay("5 + 3 * C", "3");
testDisplay("5 + 3 * C =", "8");
testDisplay("5 + 3 = C", "3", "= juga bisa dibatalkan");
testDisplay("5 + 3 C C", "5", "C berikutnya membatalkan operasi sebelumnya");
testDisplay("C", "0", "C di awal tidak berbuat apa-apa");

// Tombol AC
testDisplay("5 + 3 AC", "0");
testDisplay("5 + 3 AC 2 =", "2", "semua isi memori terhapus");

// ERR
testDisplay("99999999 + 1 =", "ERR", "hasil 9 digit");
testDisplay("99999999 * 2 =", "ERR");
testDisplay("99999999 +/- - 1 =", "ERR", "hasil negatif 9 digit");
testDisplay("99999999 + 0 =", "99999999", "8 digit masih boleh");
testDisplay("5 / 0 =", "ERR", "dibagi nol");
testDisplay("5 / 0 = +", "ERR", "operasi diabaikan saat ERR");
testDisplay("5 / 0 = 7", "7", "digit setelah ERR memulai perhitungan baru");
testDisplay("99999999 + 1 = C", "1", "C membatalkan operasi yang menyebabkan ERR");

// Bonus: tombol ±
testDisplay("5 +/-", "-5");
testDisplay("5 +/- +/-", "5");
testDisplay("5 + 3 = +/-", "-8", "tanda hasil ikut berubah");
testDisplay("5 + +/- 3 =", "-2", "tanda angka di layar berubah sebelum angka kedua");
testDisplay("0 +/-", "0", "nol tidak punya tanda");
testDisplay("5 + 3 = +/- C", "8", "C membatalkan ±");

// Bonus: angka desimal
testDisplay(".5", "0.5");
testDisplay("1..", "1.", "titik kedua diabaikan");
testDisplay("1.23456", "1.234", "maksimal 3 digit desimal");
testDisplay("12345678.9", "12345678.9", "desimal tetap bisa setelah 8 digit");
testDisplay("1.5 + 2.25 =", "3.75");
testDisplay("0.1 + 0.2 =", "0.3", "tanpa galat floating point");
testDisplay("1.50 + 1.50 =", "3", "nol di belakang dibuang");
testDisplay("0.5 * 0.5 =", "0.25");
testDisplay("1 / 3 =", "0.333");
testDisplay("2 / 3 =", "0.667", "dibulatkan");
testDisplay("2 +/- / 3 =", "-0.667");
testDisplay("0.001 / 2 =", "0.001", "setengah dibulatkan menjauhi nol");
testDisplay("2.5 +/- * 2 =", "-5");

// Baris perhitungan di atas layar
testExpression("", "");
testExpression("5 +", "5 +");
testExpression("5 + 3", "5 +");
testExpression("5 + 3 *", "8 ×");
testExpression("5 + 3 =", "5 + 3 =");
testExpression("5 - 3 +/- =", "5 − (-3) =");
testExpression("99999999 + 1 =", "99999999 + 1 =");
testExpression("5 + 3 = 2", "");

// Batasan: tanpa eval()
test("logika kalkulator tidak memakai eval() atau Function()", () => {
  const functions = [press, pressDigit, pressDecimal, pressOperator, pressEquals, pressClear, pressToggleSign, calculate];
  return functions.some((fn) => /\beval\s*\(|\bFunction\s*\(/.test(fn.toString()));
}, false);

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
