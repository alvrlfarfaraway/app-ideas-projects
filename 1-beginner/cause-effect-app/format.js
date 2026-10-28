const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Mengambil huruf pertama dari kata pertama dan kata terakhir sebuah nama.
 * Contoh: "Galih Prasetyo" -> "GP", "Ratna" -> "R".
 */
function getInitials(name) {
  const words = name.trim().split(/\s+/).filter((word) => word !== "");
  if (words.length === 0) {
    return "";
  }
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Menyusun alamat menjadi tiga baris: jalan, kota dan provinsi, lalu negara.
 */
function formatAddress(person) {
  return `${person.street}\n${person.city}, ${person.state}\n${person.country}`;
}

/**
 * Mengubah tanggal "YYYY-MM-DD" menjadi teks, contoh: "1995-02-14" -> "14 Februari 1995".
 */
function formatBirthday(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/**
 * Menghitung umur pada tanggal `today` (objek Date). Umur bertambah tepat di hari ulang tahun.
 */
function calculateAge(isoDate, today) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const currentMonth = today.getMonth() + 1; // getMonth() dimulai dari 0
  const hasHadBirthday = currentMonth > month || (currentMonth === month && today.getDate() >= day);
  return today.getFullYear() - year - (hasHadBirthday ? 0 : 1);
}
