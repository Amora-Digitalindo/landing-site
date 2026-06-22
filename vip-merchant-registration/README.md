# VIP Merchant Registration — Deploy Guide

Dua file di folder ini:
- `index.html` — halaman form lengkap (CSS & JS inline), siap deploy ke Netlify/Vercel/hosting statis apapun.
- `appscript.gs` — backend Google Apps Script yang menyimpan submission ke Google Sheets.

## 1. Buat Google Sheet baru

1. Buka [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Beri nama, misal "VIP Merchant — Amora.id".
3. Biarkan kosong — header kolom (`Timestamp | Nama Toko | WhatsApp | Link Marketplace | Status | Catatan Amora`) akan otomatis dibuat oleh script saat submission pertama masuk.

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

## 3. Pasang Web App URL ke index.html

1. Buka `index.html`.
2. Cari baris ini di bagian atas `<script>`:
   ```js
   const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Ganti dengan URL yang sudah di-copy dari langkah 2.8, contoh:
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec';
   ```
4. (Opsional) Ganti juga `SUBSCRIBE_URL` di bawahnya jika link tujuan "subscribe langsung" berbeda dari default.

## 4. Deploy index.html

Upload folder ini (atau cukup `index.html`) ke hosting statis pilihanmu:
- **Netlify**: drag-and-drop folder ke [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: `vercel deploy` dari dalam folder ini, atau hubungkan repo via dashboard
- **Hosting lain**: upload `index.html` apa adanya — tidak butuh build step

## Catatan penting soal permission "Anyone"

Apps Script Web App **harus** di-deploy dengan **"Who has access: Anyone"** (bukan "Anyone with Google account" atau "Only myself"). Tanpa ini:
- Request `fetch()` dari domain hosting (Netlify/Vercel) akan ditolak browser/Google dengan error 401/403.
- Setiap kali kamu mengubah isi `appscript.gs`, kamu harus membuat **New deployment** baru (bukan edit deployment lama) agar perubahan kode benar-benar live — atau gunakan **Deploy → Manage deployments → Edit (ikon pensil) → New version**.

## Cara cek data masuk

Setiap submission baru akan muncul sebagai baris baru di spreadsheet dengan status default **"Pending Review"**. Kolom **"Catatan Amora"** dikosongkan untuk diisi manual oleh tim kurasi — gunakan kolom ini untuk menandai approve/reject setelah proses kurasi WhatsApp (1–2 hari kerja).
