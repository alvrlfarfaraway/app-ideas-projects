# Christmas Lights — Lampu Natal Berkelip

> **Tier 1 — Beginner** · Spesifikasi: [Christmas-Lights-App.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Christmas-Lights-App.md) · **[Coba online](https://alvrlfarfaraway.github.io/app-ideas-projects/1-beginner/christmas-lights/)**

Tujuh lampu berwarna berjajar dan menyala bergantian mengikuti timer. Saat satu lampu menyala, lampu sebelumnya kembali ke intensitas normal, sehingga cahayanya tampak merambat seperti untaian lampu Natal.

## Fitur

### User stories

- [x] Pengguna dapat menekan tombol untuk memulai dan menghentikan lampu (**Mulai** / **Berhenti**)
- [x] Pengguna dapat mengubah interval waktu pergantian lampu (50–2000 ms)

### Bonus

- [x] Pengguna dapat memilih warna setiap lampu
- [x] Pengguna dapat mengatur nilai intensitas lampu yang menyala (10–100%)
- [x] Pengguna dapat mengubah ukuran setiap lampu (24–72 px)
- [x] Pengguna dapat memilih jumlah baris, dari 1 sampai 7

Untuk mengatur warna atau ukuran, klik sebuah lampu, lalu ubah di panel **Lampu N**. Pengaturan itu berlaku untuk lampu di posisi yang sama pada semua baris.

## Cara kerja

Timer menambah nomor langkah setiap interval. Lampu yang menyala di baris `r` pada langkah `s` adalah:

```
indeks = (s + r) mod 7
```

Di baris pertama (`r = 0`) lampu menyala berurutan 0, 1, 2, …, 6, lalu kembali ke 0. Setiap baris berikutnya bergeser satu lampu, sehingga dengan beberapa baris riaknya membentuk garis diagonal.

Timer memakai `setTimeout` berantai, bukan `setInterval`. Saat interval diubah ketika lampu sedang menyala, timer langsung dijadwalkan ulang dengan interval baru.

Lampu yang tidak menyala ditampilkan redup (warna dengan transparansi 30%). Lampu yang menyala memakai warna penuh, dibuat lebih terang dengan `filter: brightness()`, dan diberi cahaya (`box-shadow`). Kecerahan dan radius cahayanya mengikuti nilai intensitas.

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

## Test

Buka `test.html` di browser. Halaman ini menjalankan semua test untuk `lights.js` dan menampilkan hasilnya.

## Struktur file

| File                          | Isi                                                        |
| ----------------------------- | ---------------------------------------------------------- |
| `index.html`                  | Struktur halaman                                           |
| `style.css`                   | Tampilan lampu dan kontrol, termasuk mode gelap            |
| `lights.js`                   | Logika: urutan lampu, batas nilai input, intensitas, warna |
| `app.js`                      | Timer, membuat lampu, dan menghubungkan kontrol di halaman |
| `test.html`, `lights.test.js` | Test untuk `lights.js`                                     |
