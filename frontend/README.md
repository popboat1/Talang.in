# Talang.in — Frontend

Aplikasi web manajemen keuangan bersama berbasis React + Vite. Talang.in memudahkan pencatatan transaksi, pengelolaan hutang-piutang antar teman atau grup, serta memberikan insight keuangan secara real-time.

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 + Inter font |
| Icon | Lucide React |
| Auth & DB | Supabase (`@supabase/supabase-js`) |
| HTTP Client | Axios |
| Deploy | Vercel |

---

## Fitur Utama

- **Dashboard** — ringkasan keuangan, saldo, dan aktivitas terbaru
- **Grup** — buat dan kelola grup untuk split bill bersama
- **Tambah Transaksi** — catat transaksi dengan berbagai metode split
- **Riwayat Transaksi** — lihat semua transaksi yang pernah dibuat
- **Balance / Utang** — pantau siapa berutang ke siapa secara real-time
- **Simplify Debt** — sederhanakan rantai hutang antar anggota grup
- **Insight & Analytics** — grafik dan analisis pengeluaran
- **Notifikasi** — pemberitahuan tagihan dan aktivitas grup
- **Panduan AI** — panduan format input transaksi berbasis AI
- **Profil** — kelola data akun dan pengaturan pengguna
- **Auth** — Login, Register, Lupa Password, Reset Password (termasuk Google OAuth)
- **Halaman Legal** — Syarat & Ketentuan, Kebijakan Privasi

---

## Struktur Folder

```
src/
├── assets/          # Gambar dan ikon statis
├── components/      # Komponen reusable (Layout, Sidebar, ProtectedRoute, ToastContainer)
├── context/         # React Context (AuthContext, ToastContext)
├── hooks/           # Custom hooks (useToast)
├── lib/             # Konfigurasi library (supabase.js)
├── pages/
│   ├── analytics/   # Insight & Analytics
│   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   ├── balance/     # Halaman Balance / Utang
│   ├── dashboard/   # Halaman Dashboard
│   ├── grup/        # Manajemen Grup
│   ├── legal/       # Syarat Ketentuan & Kebijakan Privasi
│   ├── notifikasi/  # Notifikasi
│   ├── panduan/     # Panduan AI
│   ├── profil/      # Profil Pengguna
│   ├── riwayat/     # Riwayat Transaksi
│   ├── simplify/    # Simplify Debt
│   ├── transaksi/   # Tambah Transaksi
│   └── LandingPage.jsx
├── services/        # Konfigurasi Axios (api.js)
├── utils/           # Helper functions (format.js)
├── App.jsx          # Root component + routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

---

## Cara Menjalankan

### 1. Clone & Install

```bash
git clone <url-repo>
cd <nama-folder>
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_API_URL=https://talangin-production.up.railway.app
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_APP_URL=https://talang-in-bay.vercel.app/
```

> Untuk development lokal, ganti `VITE_API_URL` dengan `http://localhost:<port>` sesuai port backend yang berjalan.

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## Scripts

```bash
npm run dev       # Jalankan development server
npm run build     # Build untuk production
npm run preview   # Preview hasil build
npm run lint      # Jalankan ESLint
```

---

## Deployment

Project ini dikonfigurasi untuk deploy ke **Vercel**. File `vercel.json` sudah tersedia untuk menangani client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Autentikasi

Autentikasi menggunakan dua mekanisme:

- **Login biasa** — email & password via REST API backend, token disimpan di `localStorage`
- **Google OAuth** — redirect ke backend, token dikirim kembali via URL params dan disimpan di `localStorage`

Halaman yang membutuhkan login dilindungi oleh komponen `ProtectedRoute`.

---

## Environment Variables

| Variable | Keterangan |
|---|---|
| `VITE_API_URL` | Base URL backend REST API |
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase |
| `VITE_APP_URL` | URL aplikasi frontend (production) |