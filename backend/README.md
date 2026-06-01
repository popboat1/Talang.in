# Talang.in Backend 🚀

Backend API untuk aplikasi **Talang.in**, platform manajemen patungan (*bill splitting*) yang membantu pengguna mengelola pengeluaran grup, utang-piutang, dan analisis kesehatan keuangan grup.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Database & Auth:** Supabase (PostgreSQL)
- **File Upload:** Multer (avatar upload)
- **Environment:** Dotenv
- **CORS:** Cross-Origin Resource Sharing enabled
- **Rate Limiting:** In-memory rate limiter (tanpa package tambahan)

## 🚀 Prasyarat (Prerequisites)

Pastikan sudah menginstal:
- [Node.js](https://nodejs.org/) (Rekomendasi versi LTS)
- Akun [Supabase](https://supabase.com/) untuk database dan autentikasi

## 📦 Instalasi

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd Talang.in/Backend
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env` dan isi dengan variabel berikut:
   ```env
   PORT=3000
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   AI_BASE_URL=https://your-ai-service-url
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=https://talangin-production.up.railway.app
   NODE_ENV=development
   ```

   | Variabel | Keterangan |
   |----------|------------|
   | `PORT` | Port server (default: 3000) |
   | `SUPABASE_URL` | URL proyek Supabase |
   | `SUPABASE_KEY` | Kunci `anon` Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role (untuk upload avatar & hapus akun) |
   | `AI_BASE_URL` | URL AI service untuk fitur Smart Input NLP |
   | `FRONTEND_URL` | URL frontend (untuk redirect OAuth & CORS) |
   | `BACKEND_URL` | URL backend production (untuk redirect Google OAuth callback) |
   | `NODE_ENV` | `development` atau `production` |

## 🏃 Menjalankan Project

- **Mode Pengembangan (dengan Nodemon):**
  ```bash
  npm run dev
  ```

- **Mode Produksi:**
  ```bash
  npm start
  ```

Server aktif di `http://localhost:3000` (atau port yang ditentukan).

## 🌐 Base URL Production

```
https://talangin-production.up.railway.app
```

## 🔁 Rate Limiting

| Grup | Batas | Window |
|------|-------|--------|
| Auth (`/api/v1/auth`) | 10 request | 15 menit |
| Analytics (`/api/v1/analytics`) | 30 request | 1 menit |
| Umum (semua route lain) | 120 request | 1 menit |

Jika batas terlampaui, server mengembalikan `429 Too Many Requests`.

## 📡 API Endpoints

Semua endpoint dimulai dengan prefix `/api/v1`.
Endpoint yang membutuhkan autentikasi wajib menyertakan header:
```
Authorization: Bearer <access_token>
```

---

### 🔐 Autentikasi (`/api/v1/auth`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Mendaftarkan user baru | ❌ |
| POST | `/login` | Login dan mendapatkan access token | ❌ |
| GET | `/google` | Redirect ke halaman login Google OAuth | ❌ |
| GET | `/google/callback` | Callback OAuth dari Google | ❌ |

**Body Register:**
```json
{
  "email": "user@gmail.com",
  "password": "password123",
  "username": "username",
  "full_name": "Nama Lengkap"
}
```

**Body Login:**
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

> **Google OAuth:** Akses `GET /api/v1/auth/google` melalui browser. Setelah berhasil, user akan di-redirect ke `FRONTEND_URL/dashboard?token=...&user=...`. Profil dibuat otomatis jika user belum terdaftar.

---

### 👤 Profil (`/api/v1/profiles`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/me` | Mendapatkan profil user yang sedang login | ✅ |
| PUT | `/me` | Memperbarui profil sendiri | ✅ |
| PUT | `/me/change-password` | Mengganti password | ✅ |
| DELETE | `/me` | Menghapus akun sendiri | ✅ |
| POST | `/me/avatar` | Upload foto profil (multipart/form-data) | ✅ |
| GET | `/:profile_id` | Mendapatkan profil user berdasarkan ID | ✅ |
| PUT | `/:profile_id` | Memperbarui profil berdasarkan ID (hanya milik sendiri) | ✅ |
| POST | `/:profile_id/avatar` | Upload avatar berdasarkan profile ID | ✅ |

**Body Update Profil:**
```json
{
  "full_name": "Nama Baru",
  "username": "username_baru",
  "avatar_url": "https://..."
}
```

**Body Ganti Password:**
```json
{
  "current_password": "passwordLama123",
  "new_password": "passwordBaru456"
}
```

**Upload Avatar:** kirim sebagai `multipart/form-data` dengan field `avatar` (maks 5 MB, hanya file gambar).

---

### 👥 Groups (`/api/v1/groups`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/create` | Membuat grup baru (pembuat otomatis jadi admin) | ✅ |
| POST | `/add-member` | Menambahkan anggota ke grup via profile ID | ✅ |
| POST | `/add-member-by-username` | Menambahkan anggota ke grup via username | ✅ |
| GET | `/` | Mendapatkan semua grup | ✅ |
| GET | `/my-groups` | Mendapatkan grup yang diikuti user yang login | ✅ |
| GET | `/:group_id` | Mendapatkan detail informasi grup | ✅ |
| GET | `/:group_id/members` | Mendapatkan daftar anggota grup | ✅ |
| DELETE | `/:group_id/members/:profile_id` | Mengeluarkan anggota dari grup | ✅ |
| DELETE | `/:group_id` | Menghapus grup | ✅ |

**Body Create Group:**
```json
{
  "group_name": "Nama Grup"
}
```

> `user_id` diambil otomatis dari token JWT, tidak perlu disertakan di body.

**Body Add Member (by profile ID):**
```json
{
  "group_id": "uuid-grup",
  "profile_id": "uuid-user"
}
```

**Body Add Member (by username):**
```json
{
  "group_id": "uuid-grup",
  "username": "username_teman"
}
```

---

### 🧾 Bills (`/api/v1/bills`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/split` | Membuat tagihan manual dengan split yang sudah dihitung frontend | ✅ |
| POST | `/split-nlp` | Membuat tagihan via teks natural (AI Smart Input) | ✅ |
| GET | `/detail/:bill_id` | Mendapatkan detail tagihan | ✅ |
| GET | `/:group_id/history` | Riwayat tagihan grup (support filter & pagination) | ✅ |
| GET | `/:bill_id/splits` | Rincian pembagian tagihan per anggota | ✅ |
| PUT | `/:bill_id` | Memperbarui tagihan | ✅ |
| DELETE | `/:bill_id` | Menghapus tagihan beserta split-nya | ✅ |

**Body Split Bill Manual:**
```json
{
  "group_id": "uuid-grup",
  "payer_id": "uuid-user",
  "amount": 150000,
  "description": "Makan Bakso",
  "category": "Makanan & Minuman",
  "split_method": "equal",
  "splits": [
    { "member_id": "uuid-user-1", "share_amount": 75000 },
    { "member_id": "uuid-user-2", "share_amount": 75000 }
  ]
}
```

**Body Split Bill NLP (Smart Input):**
```json
{
  "group_id": "uuid-grup",
  "raw_text": "Budi bayar makan siang berlima total 200rb",
  "group_members": [
    { "id": "uuid-1", "profile_id": "uuid-1", "name": "Budi" },
    { "id": "uuid-2", "profile_id": "uuid-2", "name": "Ani" }
  ]
}
```

**Query Params — GET `/:group_id/history`:**

| Param | Tipe | Deskripsi |
|-------|------|-----------|
| `page` | number | Halaman (default: 1) |
| `limit` | number | Jumlah per halaman (default: 10, maks: 100) |
| `search` | string | Filter berdasarkan nama transaksi (`description`) |
| `category` | string | Filter berdasarkan kategori (contoh: `Makanan & Minuman`) |

Kategori yang tersedia: `Makanan & Minuman`, `Transportasi`, `Belanja`, `Hiburan`, `Tagihan`, `Kesehatan`, `Pendidikan`, `Penginapan`, `Lainnya`.

**Body Update Bill:**
```json
{
  "amount": 200000,
  "description": "Makan Malam",
  "category": "Makanan & Minuman",
  "status": "settled"
}
```

---

### 💸 Settlements (`/api/v1/settlements`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/:group_id/recap` | Rekapitulasi utang-piutang grup | ✅ |
| GET | `/:group_id/simplify` | Saran penyederhanaan utang (Simplify Debt) | ✅ |
| GET | `/:group_id/settled-summary` | Ringkasan tagihan yang sudah lunas | ✅ |
| PUT | `/splits/:split_id/pay` | Tandai pembayaran (partial atau full) | ✅ |
| PUT | `/:group_id/settle` | Selesaikan semua utang antar dua anggota | ✅ |

**Body Pay Split:**
```json
{
  "payment_type": "partial",
  "amount": 25000
}
```
atau untuk lunas penuh:
```json
{
  "payment_type": "full"
}
```

**Body Settle Debt:**
```json
{
  "debtor_id": "uuid-user-berutang",
  "creditor_id": "uuid-user-piutang",
  "amount": 75000
}
```

---

### 📊 Analytics (`/api/v1/analytics`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/:group_id/health` | Skor kesehatan keuangan grup | ✅ |
| GET | `/:group_id/conflicts` | Daftar potensi konflik keuangan (AI Sensor) | ✅ |
| GET | `/:group_id/conflict-status` | Ringkasan status konflik | ✅ |
| GET | `/:group_id/dashboard` | Data dashboard analitik grup | ✅ |

---

### 🔔 Notifications (`/api/v1/notifications`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/` | Mendapatkan notifikasi milik user (maks 50, terbaru dulu) | ✅ |
| PUT | `/read-all` | Tandai semua notifikasi sebagai sudah dibaca | ✅ |
| PUT | `/:id/read` | Tandai satu notifikasi sebagai sudah dibaca | ✅ |
| DELETE | `/delete-all` | Hapus semua notifikasi milik user | ✅ |
| DELETE | `/:id` | Hapus satu notifikasi | ✅ |

> Notifikasi dikirim otomatis ke anggota grup saat tagihan baru dibuat (via `/split` maupun `/split-nlp`).

---

## 📁 Struktur Folder

```
Backend/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── billController.js
│   │   ├── groupController.js
│   │   ├── notificationController.js
│   │   ├── profileController.js
│   │   └── settlementController.js
│   ├── helpers/
│   │   └── activityLogHelper.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── billRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profileRoutes.js
│   │   └── settlementRoutes.js
│   └── app.js
├── .env
├── package.json
├── README.md
└── server.js
```

## 🗄️ Skema Database (Supabase)

| Tabel | Deskripsi |
|-------|-----------|
| `profiles` | Data profil pengguna |
| `groups` | Data grup patungan |
| `group_members` | Relasi anggota dan grup (dengan role: `admin` / `member`) |
| `group_analytics` | Data analitik per grup |
| `bills` | Data tagihan/transaksi |
| `bill_splits` | Rincian pembagian tagihan per anggota |
| `activity_logs` | Log aktivitas grup |
| `notifications` | Notifikasi per user |

## 🔒 Standar Respons API

Semua respons mengikuti format:
```json
{
  "success": true,
  "message": "Deskripsi hasil",
  "data": {}
}
```

| Status Code | Keterangan |
|-------------|------------|
| `200 OK` | Request berhasil |
| `201 Created` | Data berhasil dibuat |
| `400 Bad Request` | Input tidak valid atau tidak lengkap |
| `401 Unauthorized` | Token tidak valid atau tidak disertakan |
| `403 Forbidden` | Akses ditolak (bukan milik user) |
| `404 Not Found` | Resource tidak ditemukan |
| `429 Too Many Requests` | Rate limit terlampaui |
| `500 Internal Server Error` | Kesalahan pada server |