# VIP Merchant Registration — Deploy Guide

The registration form itself is no longer a standalone page — it's merged directly into the
`#vip-program` section of the root `index.html` (CSS in `css/amora-landing-v2.css`, JS in the
last inline `<script>` before `</body>`). This folder now only holds the backend:

- `appscript.gs` — backend Google Apps Script yang menyimpan submission ke Google Sheets.

## 1. Buat Google Sheet baru

1. Buka [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Beri nama, misal "VIP Merchant — Amora.id".
3. Biarkan kosong — header kolom (`Timestamp | Nama Toko | Email | WhatsApp | Link Marketplace | Status | Catatan Amora | Tidak Eligible`) akan otomatis dibuat oleh script saat submission pertama masuk, termasuk checkbox + highlight merah di kolom "Tidak Eligible" (lihat bagian "Cara cek data masuk" di bawah).

## 2. Paste dan deploy Apps Script

1. Di spreadsheet yang baru dibuat, klik **Extensions → Apps Script**.
2. Hapus isi default `Code.gs`, lalu paste seluruh isi `appscript.gs` dari folder ini.
3. Klik **Save** (ikon disket).
4. Klik **Deploy → New deployment**.
5. Pada "Select type", klik ikon gear ⚙️ dan pilih **Web app**.
6. Isi konfigurasi:
   - **Execute as:** Me (akun Google kamu)
   - **Who has access:** **Anyone**  ← wajib, agar bisa diakses publik dari halaman form
7. Klik **Deploy**. Google akan minta otorisasi izin pertama kali — klik **Authorize access**, pilih akun, lalu klik **Advanced → Go to (project name) → Allow**.
8. Setelah deploy berhasil, copy **Web app URL** yang muncul (bentuknya seperti `https://script.google.com/macros/s/AKfycb.../exec`).

## 3. Pasang Web App URL di index.html

1. Buka `index.html` (root proyek), cari blok `<script>` VIP Merchant registration menjelang `</body>`.
2. Cari baris ini:
   ```js
   var APPS_SCRIPT_URL = '...';
   ```
3. Ganti dengan URL yang sudah di-copy dari langkah 2.8.
4. (Opsional) Link "subscribe langsung tanpa coba gratis" sudah mengarah ke `#harga` (bagian
   pricing di halaman yang sama) — ganti `href="#harga"` pada `#vipSubscribeLink` /
   `#vipFullSubscribeLink` kalau tujuannya berbeda.

## 4. Setup reCAPTCHA v3 (anti-bot)

Form ini pakai reCAPTCHA v3 invisible (tidak ada checkbox "saya bukan robot" — skor dihitung
di belakang layar) ditambah honeypot field dan validasi server-side, supaya bot tidak bisa
mengisi form secara otomatis.

1. Buka [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → daftarkan site baru.
2. Pilih jenis **reCAPTCHA v3**.
3. Isi domain tempat situs di-hosting (contoh: `amora.id`).
4. Setelah submit, kamu akan mendapat dua key: **Site Key** dan **Secret Key**.
5. Di blok `<script>` yang sama di `index.html`, cari baris ini dan ganti dengan Site Key:
   ```js
   var RECAPTCHA_SITE_KEY = '...';
   ```
6. Di `appscript.gs`, cari baris ini dan ganti `[REPLACE SECRET KEY]` dengan Secret Key:
   ```js
   var RECAPTCHA_SECRET = '[REPLACE SECRET KEY]';
   ```
7. Re-deploy Apps Script (lihat catatan "New version" di bagian bawah halaman ini) setelah mengubah `appscript.gs`.

Catatan: jika kedua key ini dibiarkan sebagai placeholder, form tetap berfungsi (verifikasi
reCAPTCHA dilewati) — tapi lapisan proteksi anti-bot yang paling kuat jadi tidak aktif. Honeypot
field, minimum waktu isi form, dan validasi/dedup server-side tetap aktif tanpa konfigurasi tambahan.

## 5. Deploy

Situs (termasuk form ini) di-deploy sebagai satu kesatuan lewat proses deploy statis biasa untuk
root proyek — tidak ada langkah deploy terpisah untuk folder ini lagi.

## Catatan penting soal permission "Anyone"

Apps Script Web App **harus** di-deploy dengan **"Who has access: Anyone"** (bukan "Anyone with Google account" atau "Only myself"). Tanpa ini:
- Request `fetch()` dari domain hosting akan ditolak browser/Google dengan error 401/403.
- Setiap kali kamu mengubah isi `appscript.gs`, kamu harus membuat **New deployment** baru (bukan edit deployment lama) agar perubahan kode benar-benar live — atau gunakan **Deploy → Manage deployments → Edit (ikon pensil) → New version**.

## Cara cek data masuk

Setiap submission baru akan muncul sebagai baris baru di spreadsheet dengan status default **"Pending Review"**. Kolom **"Catatan Amora"** dikosongkan untuk diisi manual oleh tim kurasi — gunakan kolom ini untuk menandai approve/reject setelah proses kurasi WhatsApp (1–2 hari kerja).

## Menandai toko "Tidak Eligible" (tidak makan slot)

Kolom terakhir, **"Tidak Eligible"**, berupa checkbox. Centang checkbox ini untuk toko yang gagal kurasi — barisnya akan otomatis berwarna merah, dan baris itu **tidak dihitung** di slot counter halaman form (`GET` ke Apps Script mengecualikan baris yang dicentang). Jangan hapus barisnya — cukup centang, supaya histori tetap ada di sheet tapi tidak makan slot 30 VIP Merchant.

> Kalau spreadsheet kamu sudah punya data dari sebelum kolom ini ada, jalankan sekali fungsi `setupExistingSheet` dari Apps Script editor (pilih fungsinya di dropdown sebelah tombol **Run**, lalu klik **Run**) untuk menambahkan kolom + checkbox + format merah ke sheet yang sudah ada, tanpa mengubah data lain.
