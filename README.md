# Manajemen Konten API

API ini menyediakan fitur CRUD narasi, upload foto ke Supabase Storage, crowdfunding narasi, dan simulasi pembayaran menggunakan Firebase Firestore.

## Persiapan

- Pastikan sudah mengisi file `.env` dengan variabel Supabase.
- Pastikan sudah menyiapkan file `serviceAccountKey.json` untuk Firebase Admin SDK.

## Endpoint

### Narasi

#### Create Narasi
`POST /narasi`
- Form-data:
  - `judul` (string, required)
  - `deskripsi` (string, required)
  - `id_organisasi` (string, required)
  - `expired_at` (string, optional, ISO date)
  - `status` (string, optional, default: "active")
  - `crowdfund` (number, required jika narasi pertama organisasi)
  - `foto` (file, optional)
  - `kategory_konten` (enum, required): Salah satu dari `infografis`, `poster`, `video`, `meme`, `gambar`
  - `budget_infografis` (number, optional, default: 0)
  - `budget_poster` (number, optional, default: 0)
  - `budget_video` (number, optional, default: 0)
  - `budget_meme` (number, optional, default: 0)
  - `budget_gambar` (number, optional, default: 0)
- Response: data narasi

#### Get All Narasi
`GET /narasi`
- Query:
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `status` (string, optional: "active" / "non-active")
- Response: list narasi (dengan namaOrganisasi dan fotoProfile)

#### Get Narasi By ID
`GET /narasi/:id`
- Response: detail narasi (dengan namaOrganisasi dan fotoProfile)

#### Update Narasi
`PUT /narasi/:id`
- Body: field yang ingin diupdate, termasuk:
  - `kategory_konten` (enum, lihat di atas)
  - `budget_infografis`, `budget_poster`, `budget_video`, `budget_meme`, `budget_gambar`
- Response: data narasi

#### Delete Narasi
`DELETE /narasi/:id`
- Response: `{ message: "Deleted" }`

---

### Pembayaran / Crowdfund

#### Tambah Crowdfund
`POST /pembayaran`
- JSON body:
  - `narasiId` (string, required)
  - `organisasiId` (string, required)
  - `jumlah` (number, required)
- Response: data pembayaran

#### Get List Pembayaran per Narasi
`GET /pembayaran/:narasiId`
- Response: list pembayaran untuk narasi tersebut

---

## Catatan

- Organisasi wajib mengisi crowdfund sendiri saat membuat narasi pertamanya.
- Crowdfund narasi akan bertambah setiap ada pembayaran baru.
- Upload foto narasi menggunakan field `foto` (form-data, file).
- Data organisasi diambil dari koleksi `organisasi` (field: nama, fotoProfile).
- Field `kategory_konten` wajib diisi dan hanya boleh salah satu dari: `infografis`, `poster`, `video`, `meme`, `gambar`.
- Field budget per kategori (`budget_infografis`, dst) dapat diisi sesuai kebutuhan, default 0 jika tidak diisi.

---

## Struktur Koleksi Firestore

- `narasi`: { judul, deskripsi, id_organisasi, fotoUrl, expired_at, status, crowdfund }
- `organisasi`: { nama, fotoProfile }
- `pembayaran`: { narasiId, organisasiId, jumlah, tanggal, isInitial }

---

## Contoh Request Create Narasi (dengan crowdfund dan foto)

```
POST /narasi
Content-Type: multipart/form-data

judul: "Judul Narasi"
deskripsi: "Deskripsi"
id_organisasi: "ORG123"
expired_at: "2024-12-31T23:59:59Z"
status: "active"
crowdfund: 100000
foto: (file)
kategory_konten: "infografis"
budget_infografis: 50000
```

---

## Pengembangan

- Pastikan sudah install dependensi: `npm install`
- Jalankan server: `node app.js`
