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

// getInitials
test('"Galih Prasetyo" menjadi "GP"', () => getInitials("Galih Prasetyo"), "GP");
test("tiga kata memakai kata pertama dan terakhir", () => getInitials("Melati Anggraini Putri"), "MP");
test("satu kata menjadi satu huruf", () => getInitials("Ratna"), "R");
test("spasi berlebih dan huruf kecil tetap rapi", () => getInitials("  dimas   saputra "), "DS");
test("nama kosong menjadi string kosong", () => getInitials(""), "");

// formatAddress
test("alamat disusun menjadi tiga baris", () => formatAddress({
  street: "Jl. Kenanga No. 12",
  city: "Bandung",
  state: "Jawa Barat",
  country: "Indonesia",
}), "Jl. Kenanga No. 12\nBandung, Jawa Barat\nIndonesia");

// formatBirthday
test('"1995-02-14" menjadi "14 Februari 1995"', () => formatBirthday("1995-02-14"), "14 Februari 1995");
test('tanggal tanpa nol di depan: "2001-12-01" menjadi "1 Desember 2001"', () => formatBirthday("2001-12-01"), "1 Desember 2001");

// calculateAge, dihitung pada 28 Oktober 2026
const today = new Date(2026, 9, 28);
test("ulang tahun sudah lewat tahun ini", () => calculateAge("1995-02-14", today), 31);
test("ulang tahun belum tiba tahun ini", () => calculateAge("2001-12-01", today), 24);
test("tepat di hari ulang tahun, umur bertambah", () => calculateAge("2000-10-28", today), 26);
test("sehari sebelum ulang tahun, umur belum bertambah", () => calculateAge("2000-10-29", today), 25);

// Data uji di people.js
test("data berisi minimal 5 orang", () => people.length >= 5, true);
test("nama setiap orang berbeda", () => new Set(people.map((person) => person.name)).size === people.length, true);
test("semua orang punya data lengkap dan tanggal lahir yang valid", () => {
  const fields = ["name", "street", "city", "state", "country", "telephone", "birthday"];
  for (const person of people) {
    for (const field of fields) {
      if (typeof person[field] !== "string" || person[field].trim() === "") {
        return `${person.name}: ${field} kosong`;
      }
    }
    // Tanggal harus berformat YYYY-MM-DD dan benar-benar ada di kalender.
    const [year, month, day] = person.birthday.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(person.birthday) || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return `${person.name}: tanggal lahir tidak valid`;
    }
  }
  return "lengkap";
}, "lengkap");

summary.textContent = failed === 0
  ? `Semua ${passed} test lulus ✓`
  : `${failed} dari ${passed + failed} test gagal ✗`;
summary.className = failed === 0 ? "pass" : "fail";
document.title = summary.textContent;
