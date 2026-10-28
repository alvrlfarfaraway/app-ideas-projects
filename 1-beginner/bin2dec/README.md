# Bin2Dec — Konverter Biner ke Desimal

> **Tier 1 — Beginner** · Spesifikasi: [Bin2Dec-App.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Bin2Dec-App.md)

Bin2Dec mengubah bilangan biner (basis 2) menjadi bilangan desimal (basis 10). Hasilnya langsung muncul saat kamu mengetik.

## Fitur

### User stories

- [x] Pengguna dapat memasukkan hingga 8 digit biner dalam satu kolom input
- [x] Pengguna mendapat peringatan jika memasukkan karakter selain 0 atau 1
- [x] Pengguna melihat hasil desimal di satu kolom output

### Bonus

- [x] Pengguna dapat memasukkan biner dengan jumlah digit bebas (matikan opsi **Batasi 8 digit**)

### Batasan (constraints)

- **Tanpa array** untuk menyimpan digit biner: setiap digit dibaca langsung dari string lewat indeksnya.
- **Satu operasi matematika** untuk menghitung nilai tiap digit: perpangkatan `2 ** posisi`.

## Cara kerja

Setiap digit biner bernilai 2 pangkat posisinya, dihitung dari kanan mulai dari 0. Digit `1` menyumbang nilainya ke hasil, sedangkan digit `0` tidak.

| Biner  | 1      | 0      | 1      | 1      |
| ------ | ------ | ------ | ------ | ------ |
| Posisi | 3      | 2      | 1      | 0      |
| Nilai  | 2³ = 8 | 2² = 4 | 2¹ = 2 | 2⁰ = 1 |

`1011` → 8 + 0 + 2 + 1 = **11**

Hasil disimpan sebagai `BigInt` agar tetap akurat untuk biner yang sangat panjang. Tipe `Number` biasa hanya akurat sampai 2⁵³ − 1.

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

## Test

Buka `test.html` di browser. Halaman ini menjalankan semua test untuk `converter.js` dan menampilkan hasilnya.

## Struktur file

| File                             | Isi                                             |
| -------------------------------- | ----------------------------------------------- |
| `index.html`                     | Struktur halaman                                |
| `style.css`                      | Tampilan, termasuk mode gelap                   |
| `converter.js`                   | Logika konversi biner ke desimal                |
| `app.js`                         | Menghubungkan input, opsi, dan output di halaman |
| `test.html`, `converter.test.js` | Test untuk `converter.js`                       |
