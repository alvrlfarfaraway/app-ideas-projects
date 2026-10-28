/**
 * Mencari karakter pertama yang bukan "0" atau "1".
 * Mengembalikan karakter tersebut, atau null jika semua karakter valid.
 */
function findInvalidCharacter(text) {
  // for...of membaca string satu per satu karakter tanpa mengubahnya menjadi array
  for (const character of text) {
    if (character !== "0" && character !== "1") {
      return character;
    }
  }
  return null;
}

/**
 * Mengubah string biner menjadi angka desimal, contoh: "1011" -> 11n.
 *
 * Sesuai batasan project:
 * - Digit biner tidak disimpan di array; setiap digit dibaca langsung dari string.
 * - Nilai tiap digit dihitung dengan satu operasi matematika: 2 pangkat posisinya.
 *
 * Hasilnya berupa BigInt agar tetap akurat untuk biner yang sangat panjang
 * (Number biasa hanya akurat sampai 2^53 - 1).
 */
function binaryToDecimal(binary) {
  if (binary === "" || findInvalidCharacter(binary) !== null) {
    throw new Error(`"${binary}" bukan bilangan biner yang valid`);
  }

  let decimal = 0n;
  for (let i = 0; i < binary.length; i++) {
    const position = binary.length - 1 - i; // posisi dihitung dari kanan, mulai dari 0
    if (binary[i] === "1") {
      decimal += 2n ** BigInt(position);
    }
  }
  return decimal;
}
