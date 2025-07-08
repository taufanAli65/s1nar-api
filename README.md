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
- **Contoh Request:**
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
- **Contoh Response:**
  ```json
  {
    "id": "narasiId123",
    "judul": "Judul Narasi",
    "deskripsi": "Deskripsi",
    "id_organisasi": "ORG123",
    "fotoUrl": "https://...",
    "expired_at": "2024-12-31T23:59:59Z",
    "status": "active",
    "kategory_konten": "infografis",
    "budget-infografis": 50000,
    "budget-poster": 0,
    "budget-video": 0,
    "budget-meme": 0,
    "budget-gambar": 0
  }
  ```

#### Get All Narasi
`GET /narasi`
- Query:
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `status` (string, optional: "active" / "non-active")
- **Contoh Response:**
  ```json
  [
    {
      "id": "narasiId123",
      "judul": "Judul Narasi",
      "deskripsi": "Deskripsi",
      "id_organisasi": "ORG123",
      "fotoUrl": "https://...",
      "expired_at": "2024-12-31T23:59:59Z",
      "status": "active",
      "kategory_konten": "infografis",
      "budget-infografis": 50000,
      "budget-poster": 0,
      "budget-video": 0,
      "budget-meme": 0,
      "budget-gambar": 0,
      "namaOrganisasi": "Nama Organisasi",
      "fotoProfile": "https://..."
    }
  ]
  ```

#### Get Narasi By ID
`GET /narasi/:id`
- **Contoh Response:**
  ```json
  {
    "id": "narasiId123",
    "judul": "Judul Narasi",
    "deskripsi": "Deskripsi",
    "id_organisasi": "ORG123",
    "fotoUrl": "https://...",
    "expired_at": "2024-12-31T23:59:59Z",
    "status": "active",
    "kategory_konten": "infografis",
    "budget-infografis": 50000,
    "budget-poster": 0,
    "budget-video": 0,
    "budget-meme": 0,
    "budget-gambar": 0,
    "namaOrganisasi": "Nama Organisasi",
    "fotoProfile": "https://..."
  }
  ```

#### Update Narasi
`PUT /narasi/:id`
- **Contoh Request:**
  ```json
  {
    "judul": "Judul Baru",
    "status": "non-active"
  }
  ```
- **Contoh Response:** sama seperti create/get

#### Delete Narasi
`DELETE /narasi/:id`
- **Contoh Response:**
  ```json
  { "message": "Deleted" }
  ```

#### Expire Narasi (ubah status jadi expired)
`PATCH /narasi/:id/expired`
- **Contoh Response:**
  ```json
  {
    "id": "narasiId123",
    "status": "expired",
    // ...field lain...
  }
  ```

---

### Pembayaran / Crowdfund

#### Tambah Crowdfund ke Narasi
`POST /pembayaran`
- **Catatan tambahan:**  
  - Jika field `userId` diisi, saldo user/organisasi akan otomatis dikurangi sesuai jumlah donasi.
  - Jika narasi pertama, organisasi wajib mengisi crowdfund dan saldo organisasi akan dikurangi.
- **Contoh Request:**
  ```json
  {
    "narasiId": "narasiId123",
    "organisasiId": "ORG123",
    "jumlah": 50000
  }
  ```
- **Contoh Response:**
  ```json
  {
    "narasiId": "narasiId123",
    "organisasiId": "ORG123",
    "jumlah": 50000,
    "isInitial": false,
    "userId": null,
    "tipe": "narasi"
  }
  ```

#### Get List Pembayaran per Narasi
`GET /pembayaran/:narasiId`
- **Contoh Response:**
  ```json
  [
    {
      "id": "pembayaranId1",
      "narasiId": "narasiId123",
      "organisasiId": "ORG123",
      "jumlah": 50000,
      "tanggal": "2024-06-01T12:00:00Z",
      "isInitial": false,
      "userId": null,
      "tipe": "narasi"
    }
  ]
  ```

#### Tambah Crowdfund ke Organisasi
`POST /pembayaran/organisasi`
- **Contoh Request:**
  ```json
  {
    "organisasiId": "ORG123",
    "jumlah": 100000,
    "userId": "user123"
  }
  ```
- **Contoh Response:**
  ```json
  {
    "organisasiId": "ORG123",
    "jumlah": 100000,
    "userId": "user123",
    "tipe": "organisasi"
  }
  ```

#### Get List Pembayaran per Organisasi
`GET /pembayaran/organisasi/:organisasiId`
- **Contoh Response:**
  ```json
  [
    {
      "id": "pembayaranId2",
      "organisasiId": "ORG123",
      "jumlah": 100000,
      "tanggal": "2024-06-01T12:00:00Z",
      "userId": "user123",
      "tipe": "organisasi"
    }
  ]
  ```

---

### Idea

#### Buat Idea (User)
`POST /idea`
- **Contoh Request:** (form-data)
  ```
  judul_ide: "Ide Keren"
  deskripsi: "Penjelasan ide"
  narasi_id: "narasiId123"
  user_id: "user123"
  attachment_file: (file)
  ```
- **Contoh Response:**
  ```json
  {
    "id": "ideaId123",
    "judul_ide": "Ide Keren",
    "attachment_file": "https://...",
    "deskripsi": "Penjelasan ide",
    "narasi_id": "narasiId123",
    "user_id": "user123",
    "status": "pending",
    "revisi_count": 0
  }
  ```

#### Update Status Idea (Organisasi)
`PATCH /idea/:id/status`
- **Contoh Request:**
  ```json
  { "status": "revisi" }
  ```
- **Contoh Response:**
  ```json
  {
    "id": "ideaId123",
    "status": "revisi",
    "revisi_count": 1
    // ...field lain...
  }
  ```

#### ACC Idea (Organisasi)
`POST /idea/:id/acc`
- **Contoh Response:**
  ```json
  {
    "id": "ideaId123",
    "judul_ide": "Ide Keren",
    "status": "accepted",
    "saldo_diterima": 50000,
    // ...field lain...
  }
  ```

#### Lihat Idea Berdasarkan Narasi (User)
`GET /idea/narasi/:narasi_id`
- **Contoh Response:** array of idea

#### Lihat Idea Berdasarkan Kategori Narasi (User)
`GET /idea/kategori/:kategory_konten`
- **Contoh Response:** array of idea

#### Lihat Idea yang Dibuat User
`GET /idea/user/:user_id`
- **Contoh Response:** array of idea

#### Lihat Idea Berdasarkan Organisasi (Organisasi)
`GET /idea/organisasi/:organisasi_id`
- **Contoh Response:** array of idea

---

### Content

#### Update Status Content (Organisasi)
`PATCH /content/:id/status`
- **Contoh Request:**
  ```json
  { "status": "revisi" }
  ```
- **Contoh Response:**
  ```json
  {
    "id": "contentId123",
    "status": "revisi",
    "revisi_count": 1
    // ...field lain...
  }
  ```

---

## Catatan Idea & Content

- Status idea: `pending`, `revisi`, `accepted`, `rejected`.
- Organisasi hanya bisa revisi maksimal 3x (baik di idea maupun content).
- Jika organisasi ACC idea, maka:
  - Idea dipindahkan ke koleksi `content`.
  - User mendapat saldo sesuai budget narasi dan kategori.
- Organisasi bisa update status content (revisi/selesai, revisi maksimal 3x).

---

## Catatan

- User biasa dapat memberikan crowdfund langsung ke organisasi (`/pembayaran/organisasi`) atau ke narasi tertentu (`/pembayaran`).
- Organisasi juga dapat mengisi crowdfund ke narasi sendiri (khusus narasi pertama wajib).
- Field `userId` pada crowdfund ke organisasi opsional, jika diisi berarti crowdfund dari user biasa.

---

## Struktur Koleksi Firestore

- `narasi`: { judul, deskripsi, id_organisasi, fotoUrl, expired_at, status, crowdfund }
- `organisasi`: { nama, fotoProfile }
- `pembayaran`: { narasiId, organisasiId, jumlah, tanggal, isInitial }
- `idea`: { judul_ide, deskripsi, narasi_id, user_id, revisi, attachment_file }

---

## Pengembangan

- Pastikan sudah install dependensi: `npm install`
- Jalankan server: `node app.js`

## Auth

### Register User (dengan Upload Foto)

**Endpoint:**  
`POST /auth/register`

**Deskripsi:**  
Registrasi user baru (role: `creator` atau `organisasi`). Bisa upload foto profil yang akan disimpan di Supabase.

**Headers:**  
`Content-Type: multipart/form-data`

**Body (form-data):**
- `email` (string, required)
- `password` (string, required)
- `role` (string, required, "creator" atau "organisasi")
- `nama` (string, required jika role=organisasi)
- `deskripsi` (string, optional, untuk creator/organisasi)
- `domisili` (string, optional, hanya untuk creator)
- `website` (string, optional, hanya untuk organisasi)
- `facebook` (string, optional, hanya untuk organisasi)
- `instagram` (string, optional, hanya untuk organisasi)
- `linkedin` (string, optional, hanya untuk organisasi)
- `foto` (file, optional) — file gambar yang akan diupload ke Supabase

- **Catatan:**  
  - Jika role = `creator`, field tambahan: `deskripsi` dan `domisili` akan disimpan pada user.
  - Jika role = `organisasi`, field tambahan: `deskripsi`, `website`, `facebook`, `instagram`, `linkedin` akan disimpan pada organisasi.
role: organisasi
nama: Organisasi Hebat
foto: [file image]
```

**Contoh Response:**
```json
{
  "message": "Account created",
  "uid": "firebase-uid",
  "role": "organisasi",
  "fotoUrl": "https://your-supabase-url/storage/v1/object/public/foto-narasi/narasi/1680000000000-xxxxxx.jpg"
}
```

**Catatan:**  
- Jika tidak mengupload foto, field `fotoUrl` akan bernilai `null`.
- Untuk login, gunakan Firebase Auth client SDK di frontend.

### Login

`POST /auth/login`

- **Body (JSON):**
  - `email` (string, required)
  - `password` (string, required)

- **Catatan Penting:**
  - Untuk login, gunakan Firebase Auth client SDK di frontend untuk mendapatkan ID token.
  - Endpoint ini hanya placeholder. Kirimkan ID token ke backend untuk verifikasi jika dibutuhkan.

- **Contoh Response:**
  ```json
  {
    "error": "Use Firebase Auth client SDK to sign in and send ID token to backend."
  }
  ```

### Top Up Saldo

`POST /pembayaran/topup`
- **Body (JSON):**
  - `userId` (string, required)
  - `jumlah` (number, required)
- **Contoh Response:**
  ```json
  {
    "message": "Top up berhasil",
    "userId": "user123",
    "jumlah": 100000
  }
  ```

### Cek Saldo User

`GET /pembayaran/saldo/:userId`
- **Contoh Response:**
  ```json
  {
    "userId": "user123",
    "saldo": 150000
  }
  ```
