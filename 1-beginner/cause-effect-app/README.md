# Cause Effect App

> **Tier 1 — Beginner** · Spesifikasi: [Cause-Effect-App.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Cause-Effect-App.md) · **[Coba online](https://alvrlfarfaraway.github.io/app-ideas-projects/1-beginner/cause-effect-app/)**

Klik sebuah nama di daftar (sebab), lalu panel di sebelahnya menampilkan detail orang tersebut (akibat).

## Fitur

### User stories

- [x] Pengguna melihat daftar nama yang tersusun vertikal di panel ringkasan
- [x] Klik sebuah nama menampilkan nama lengkap, alamat, nomor telepon, dan tanggal lahirnya di panel sebelahnya
- [x] Klik nama lain memperbarui panel detail dengan data orang tersebut

### Bonus

- [x] Nama disorot saat kursor berada di atasnya (hover)
- [x] Nama yang diklik diberi efek terpilih yang berbeda dari hover: warna aksen, teks tebal, dan garis di kiri
- [x] Efek terpilih pindah ke nama baru saat nama lain diklik

### Tambahan

- Avatar berisi inisial dengan warna berbeda untuk setiap orang
- Umur dihitung otomatis dari tanggal lahir
- Di layar sempit, halaman otomatis bergulir ke panel detail setelah nama diklik

## Cara kerja

- Data uji ditulis langsung sebagai objek JavaScript di `people.js`, sesuai batasan spesifikasi. **Semua data di dalamnya fiktif.**
- Daftar nama dibuat dari data tersebut oleh `app.js`.
- Klik ditangani oleh satu event listener di elemen daftar (*event delegation*), bukan satu listener per nama.
- Nama yang terpilih ditandai dengan atribut `aria-current="true"`. CSS memakai atribut ini untuk efek terpilih, dan pembaca layar juga bisa mengenalinya.

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

## Test

Buka `test.html` di browser. Test memeriksa fungsi format (inisial, alamat, tanggal lahir, umur) serta kelengkapan data di `people.js`.

## Struktur file

| File                        | Isi                                                  |
| --------------------------- | ---------------------------------------------------- |
| `index.html`                | Struktur halaman                                     |
| `style.css`                 | Tampilan, termasuk mode gelap                        |
| `people.js`                 | Data uji (fiktif)                                    |
| `format.js`                 | Fungsi format: inisial, alamat, tanggal lahir, umur  |
| `app.js`                    | Membuat daftar nama dan mengisi panel detail         |
| `test.html`, `format.test.js` | Test untuk `format.js` dan `people.js`             |
