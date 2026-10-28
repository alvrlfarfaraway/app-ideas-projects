# Calculator — Kalkulator Sederhana

> **Tier 1 — Beginner** · Spesifikasi: [Calculator-App.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Calculator-App.md) · **[Coba online](https://alvrlfarfaraway.github.io/app-ideas-projects/1-beginner/calculator/)**

Kalkulator untuk tambah, kurang, kali, dan bagi dengan angka hingga 8 digit. Semua perhitungan ditulis sendiri, tanpa `eval()`.

## Fitur

### User stories

- [x] Pengguna melihat layar yang menampilkan angka yang sedang diketik atau hasil operasi terakhir
- [x] Pengguna melihat tombol digit 0–9, operasi `+`, `−`, `÷`, `=`, tombol `C`, dan tombol `AC`
- [x] Pengguna dapat mengetik angka hingga 8 digit. Digit berikutnya diabaikan
- [x] Pengguna dapat menekan tombol operasi untuk melihat hasil dari:
  - hasil operasi sebelumnya dan angka terakhir: `5 + 3 × 2 =` → `16`
  - dua angka terakhir: `5 + 3 =` → `8`
  - angka terakhir: `7 =` → `7`
- [x] Pengguna dapat menekan `C` untuk menghapus angka atau operasi terakhir. Jika yang terakhir berupa operasi, layar kembali ke nilai sebelum operasi itu
- [x] Pengguna dapat menekan `AC` untuk menghapus semua dan mengembalikan layar ke `0`
- [x] Pengguna melihat `ERR` jika hasil operasi melebihi 8 digit. `ERR` juga muncul saat membagi dengan nol

### Bonus

- [x] Pengguna dapat menekan `±` untuk mengubah tanda angka yang sedang tampil
- [x] Pengguna dapat memakai tombol `.` untuk angka desimal hingga 3 angka di belakang titik

### Batasan (constraints)

- **Tanpa `eval()`.** Setiap operasi dihitung di fungsi `calculate` di `calculator.js`.

### Tambahan

- Tombol `×` untuk perkalian. Spesifikasi hanya menyebut `+`, `-`, `/`, dan `=`.
- Baris kecil di atas layar menampilkan perhitungan yang sedang berjalan, misalnya `5 + 3 =`.
- Menekan `=` lagi mengulang operasi terakhir: `5 + 3 = =` → `11`.
- Bisa dipakai dengan keyboard: angka, `.`, `+`, `-`, `*`, `/`, `Enter` untuk `=`, `Backspace` untuk `C`, dan `Esc` untuk `AC`.

## Cara kerja

### Urutan perhitungan

Seperti kalkulator saku, setiap operasi langsung dihitung dari kiri ke kanan, tanpa aturan "kali dulu baru tambah". Jadi `5 + 3 × 2` dihitung sebagai `(5 + 3) × 2 = 16`.

### Angka desimal tanpa galat

Angka disimpan sebagai `BigInt` dalam satuan seperseribu, jadi `1.5` disimpan sebagai `1500`. Karena semuanya bilangan bulat, `0.1 + 0.2` hasilnya tepat `0.3`. Dengan `Number` biasa, hasilnya `0.30000000000000004`.

Hasil kali dan bagi dibulatkan ke 3 angka desimal, sama dengan batas desimal saat mengetik. Angka 5 dibulatkan menjauhi nol, jadi `2 ÷ 3 = 0.667`.

Batas 8 digit berlaku untuk bagian di depan titik desimal. Hasil dari `-99999999.999` sampai `99999999.999` masih ditampilkan. Di luar rentang itu, layar menampilkan `ERR`.

### Tombol C

Setiap operasi menyimpan state sebelumnya. Jika ada angka yang sedang diketik, `C` menghapus angka itu. Jika tidak ada, `C` kembali ke state sebelum operasi terakhir. Karena itu `C` bisa ditekan berulang kali:

| Tombol  | Layar | Keterangan             |
| ------- | ----- | ---------------------- |
| `5 + 3` | `3`   |                        |
| `C`     | `0`   | angka `3` dihapus      |
| `C`     | `5`   | operasi `+` dibatalkan |

`C` juga membatalkan `ERR`. Setelah `99999999 + 1 =`, menekan `C` mengembalikan layar ke `1`, jadi angkanya bisa diganti.

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

## Test

Buka `test.html` di browser. Halaman ini menjalankan semua test untuk `calculator.js` dan menampilkan hasilnya.

## Struktur file

| File                              | Isi                                                                 |
| --------------------------------- | ------------------------------------------------------------------- |
| `index.html`                      | Struktur halaman dan tombol                                         |
| `style.css`                       | Tampilan, termasuk mode gelap                                       |
| `calculator.js`                   | Logika kalkulator, terpisah dari halaman                            |
| `app.js`                          | Menghubungkan tombol dan keyboard ke logika, lalu memperbarui layar |
| `test.html`, `calculator.test.js` | Test untuk `calculator.js`                                          |
