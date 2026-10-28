# Border Radius Previewer

> **Tier 1 — Beginner** · Spesifikasi: [Border-Radius-Previewer.md](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Border-Radius-Previewer.md) · **[Coba online](https://alvrlfarfaraway.github.io/app-ideas-projects/1-beginner/border-radius-previewer/)**

Atur `border-radius` setiap sudut kotak dengan slider, lihat bentuknya berubah secara langsung, lalu salin CSS-nya.

## Fitur

### User stories

- [x] Pengguna melihat kotak yang diberi properti `border-radius`
- [x] Pengguna dapat mengubah 4 nilai `border-radius`: kiri atas, kanan atas, kanan bawah, dan kiri bawah
- [x] Pengguna dapat menyalin CSS hasilnya ke clipboard

### Bonus

- [x] Pengguna dapat mengubah 8 nilai `border-radius` untuk membuat bentuk yang lebih kompleks (aktifkan **Mode 8 nilai**)

### Tambahan

- Pilihan satuan `px` atau `%`
- CSS yang dihasilkan otomatis diringkas sesuai aturan shorthand

## Cara kerja

`border-radius` menerima nilai untuk keempat sudut, berurutan searah jarum jam mulai dari kiri atas:

```css
border-radius: kiri-atas kanan-atas kanan-bawah kiri-bawah;
```

Setiap sudut sebenarnya adalah potongan elips dengan dua radius: horizontal dan vertikal. Radius vertikal ditulis setelah tanda `/`. Dengan 8 nilai ini kamu bisa membuat bentuk seperti tetesan atau gumpalan:

```css
border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
```

Jika beberapa sudut bernilai sama, CSS-nya bisa diringkas:

| Jumlah nilai | Arti                                             | Contoh              |
| ------------ | ------------------------------------------------ | ------------------- |
| 1            | Keempat sudut sama                               | `20px`              |
| 2            | Kiri atas & kanan bawah, kanan atas & kiri bawah | `48px 16px`         |
| 3            | Kiri atas, kanan atas & kiri bawah, kanan bawah  | `48px 16px 8px`     |
| 4            | Setiap sudut berbeda                             | `48px 16px 8px 4px` |

## Menjalankan

Tidak perlu instalasi. Buka `index.html` di browser.

Tombol **Salin CSS** memakai Clipboard API. Jika browser menolak, teks CSS otomatis dipilih sehingga kamu cukup menekan Ctrl+C.

## Test

Buka `test.html` di browser. Selain menguji contoh-contoh di atas, test juga mencocokkan 6.561 kombinasi nilai dengan cara browser sendiri membaca CSS `border-radius`.

## Struktur file

| File                                 | Isi                                                    |
| ------------------------------------ | ------------------------------------------------------ |
| `index.html`                         | Struktur halaman                                       |
| `style.css`                          | Tampilan, termasuk mode gelap                          |
| `border-radius.js`                   | Logika pembuat nilai `border-radius`                   |
| `app.js`                             | Menghubungkan slider, opsi, pratinjau, dan tombol salin |
| `test.html`, `border-radius.test.js` | Test untuk `border-radius.js`                          |
