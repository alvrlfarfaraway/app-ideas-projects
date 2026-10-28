# Color Cycle — Siklus Warna

> **Tier 1 — Beginner** · Spesifikasi: [Color-Cycle-App.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Color-Cycle-App.md) · **[Coba online](https://alvrlfarfaraway.github.io/app-ideas-projects/1-beginner/color-cycle/)**

Color Cycle mengisi sebuah kotak dengan warna pilihanmu, lalu mengubahnya sedikit demi sedikit. Setiap langkah, kenaikan yang kamu tentukan ditambahkan ke setiap komponen warna, sehingga kamu bisa melihat pengaruh tiap bagian kode warna seperti `#2060C0`.

## Fitur

### User stories

- [x] Pengguna dapat mengisi warna awal sebagai kode heksadesimal 6 digit yang dipecah menjadi tiga komponen 2 digit: merah (R), hijau (G), dan biru (B)
- [x] Pengguna dapat mengisi kenaikan untuk setiap komponen, yang ditambahkan ke komponen itu setiap 0,25 detik
- [x] Pengguna melihat warna kotak berubah setiap 0,25 detik
- [x] Pengguna hanya dapat mengubah komponen warna dan kenaikannya ketika aplikasi berhenti
- [x] Pengguna dapat memulai dan menghentikan perubahan warna dengan tombol yang namanya berganti: **Mulai** (Start) saat berhenti dan **Berhenti** (Stop) saat berjalan
- [x] Pengguna mendapat peringatan jika mengisi komponen warna dengan karakter selain digit heksadesimal

### Bonus

- [x] Pengguna dapat mengubah interval perubahan warna (200–2000 ms)
- [x] Pengguna dapat memilih format warna: RGB (hex) atau HSL

## Cara pakai

1. Isi nilai setiap komponen. Di format RGB, nilainya 2 digit heksadesimal (`00`–`FF`) dan angka desimalnya tampil di sebelahnya.
2. Isi kenaikan per langkah dengan bilangan bulat desimal. Kenaikan boleh negatif, misalnya `-2`.
3. Tekan **Mulai** (atau Enter di salah satu isian). Selama warna berputar, isian dikunci. Tekan **Berhenti** untuk mengubahnya lagi.
4. Isian selalu menampilkan warna saat ini, jadi **Mulai** berikutnya melanjutkan dari warna terakhir. **Kembali ke awal** memulihkan warna yang terakhir kamu ketik.

Kotak kecil di samping nama komponen menampilkan komponen itu saja, misalnya hanya merah untuk R. Garis di bawahnya menunjukkan posisi nilai dalam rentangnya.

## Cara kerja

Setiap langkah, kenaikan ditambahkan ke nilai komponen. Nilai yang melewati batas berputar kembali dari 0, seperti odometer:

```
nilai baru = (nilai + kenaikan) mod 256
```

Contoh: `FF` + 8 = 263, lalu 263 mod 256 = 7, jadi hasilnya `07`. Kenaikan negatif juga berputar: `00` − 1 menjadi `FF`.

Di format HSL, H (rona) memakai mod 360 (0°–359°), sedangkan S (saturasi) dan L (kecerahan) memakai mod 101 (0%–100%).

Saat format diganti, warna diubah ke format baru dan dibulatkan ke bilangan bulat, jadi warnanya bisa bergeser 1–2 tingkat. Karena itu kode warna dalam format lain di bawah kode utama ditulis dengan tanda `≈`. Rumus HSL ke RGB mengikuti spesifikasi CSS Color Level 4, dan test-nya membandingkan hasilnya dengan konversi browser.

Warna teks di dalam kotak (hitam atau putih) dipilih yang kontrasnya paling tinggi menurut rumus luminans WCAG.

Interval paling cepat 200 ms, jadi kotak berubah paling banyak 5 kali per detik. Dengan begitu kotak tetap di bawah batas aman WCAG untuk kedipan (3 kedipan per detik), walaupun kenaikannya besar.

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

## Test

Buka `test.html` di browser. Halaman ini menjalankan semua test untuk `color-cycle.js` dan menampilkan hasilnya.

## Struktur file

| File                               | Isi                                                                   |
| ---------------------------------- | --------------------------------------------------------------------- |
| `index.html`                       | Struktur halaman                                                      |
| `style.css`                        | Tampilan, termasuk mode gelap                                         |
| `color-cycle.js`                   | Logika: membaca isian, memutar nilai, konversi RGB ↔ HSL, kontras teks |
| `app.js`                           | Timer, penguncian isian saat berjalan, dan kontrol di halaman         |
| `test.html`, `color-cycle.test.js` | Test untuk `color-cycle.js`                                           |
