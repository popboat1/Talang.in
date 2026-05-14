import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  HandCoins,
  Home,
  Landmark,
  LayoutDashboard,
  MessageSquareText,
  PieChart,
  ReceiptText,
  RefreshCcw,
  Route,
  ShieldAlert,
  Sparkles,
  Store,
  UsersRound,
  Utensils,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'

export type IconItem = {
  title: string
  description: string
  icon: LucideIcon
  tone?: 'purple' | 'yellow' | 'green' | 'red'
}

export const navLinks = [
  { label: 'Beranda', target: '#beranda' },
  { label: 'Fitur', target: '#fitur' },
  { label: 'Cara Kerja', target: '#cara-kerja' },
  { label: 'Insight', target: '#insight' },
  { label: 'Tentang', target: '#tentang' },
]

export const audiences: IconItem[] = [
  {
    title: 'Mahasiswa',
    description: 'Kelola uang kas organisasi, tugas kelompok, dan kebutuhan acara tanpa catatan tercecer.',
    icon: UsersRound,
    tone: 'purple',
  },
  {
    title: 'Anak kos',
    description: 'Catat iuran listrik, air, WiFi, dan kebutuhan bersama tanpa bingung menagih.',
    icon: Home,
    tone: 'purple',
  },
  {
    title: 'Teman liburan',
    description: 'Bagi biaya transportasi, penginapan, tiket, dan makan selama perjalanan.',
    icon: WalletCards,
    tone: 'yellow',
  },
  {
    title: 'Rekan kerja',
    description: 'Urus makan siang bareng, kado, atau acara kantor dengan pembagian yang jelas.',
    icon: Store,
    tone: 'purple',
  },
  {
    title: 'Komunitas',
    description: 'Transparansi iuran rutin dan pengeluaran acara komunitas dalam satu aplikasi.',
    icon: Landmark,
    tone: 'purple',
  },
  {
    title: 'Grup makan bersama',
    description: 'Split bill restoran secara instan, termasuk pajak, servis, dan anggota yang ikut.',
    icon: Utensils,
    tone: 'yellow',
  },
]

export const whyItems: IconItem[] = [
  {
    title: 'Pencatatan Otomatis',
    description: 'Masukkan pengeluaran grup, lalu sistem membantu membagi porsinya secara akurat.',
    icon: ReceiptText,
    tone: 'purple',
  },
  {
    title: 'Analisis Pintar',
    description: 'Lihat siapa yang paling sering menalangi dan ke mana uang grup dialokasikan.',
    icon: BarChart3,
    tone: 'yellow',
  },
  {
    title: 'Multi-Grup Dinamis',
    description: 'Kelola kebutuhan kos, liburan, proyek kantor, atau komunitas dalam satu tempat.',
    icon: UsersRound,
    tone: 'purple',
  },
]

export const features: (IconItem & { meta: string })[] = [
  {
    title: 'Catat Transaksi Patungan',
    description: 'Simpan semua pengeluaran grup dalam satu tempat agar tidak tercecer di chat.',
    icon: FileText,
    meta: 'Transaction',
    tone: 'purple',
  },
  {
    title: 'Split Bill Otomatis',
    description: 'Bagi tagihan ke anggota grup sesuai transaksi yang dicatat tanpa hitung manual.',
    icon: CircleDollarSign,
    meta: 'Auto split',
    tone: 'purple',
  },
  {
    title: 'Ringkasan Utang',
    description: 'Lihat siapa harus membayar ke siapa dengan tampilan yang jelas dan ringkas.',
    icon: WalletCards,
    meta: 'Balance',
    tone: 'yellow',
  },
  {
    title: 'Simplify Debt',
    description: 'Sederhanakan pembayaran agar utang antar anggota lebih mudah diselesaikan.',
    icon: Route,
    meta: 'Settlement',
    tone: 'purple',
  },
  {
    title: 'Riwayat Transaksi',
    description: 'Pantau semua catatan pengeluaran grup secara rapi, aman, dan transparan.',
    icon: CalendarClock,
    meta: 'History',
    tone: 'purple',
  },
  {
    title: 'Dashboard Analytics',
    description: 'Lihat pola pengeluaran, kategori terbesar, dan kondisi pembayaran grup.',
    icon: LayoutDashboard,
    meta: 'Insight',
    tone: 'yellow',
  },
]

export const aiItems: IconItem[] = [
  {
    title: 'AI Transaction Understanding',
    description: 'Pahami input natural seperti “Rani bayar makan 120 ribu untuk Rani, Budi, dan Sinta”.',
    icon: Sparkles,
    tone: 'purple',
  },
  {
    title: 'Conflict Detection',
    description: 'Deteksi kondisi yang rawan konflik, seperti satu anggota terlalu sering menalangi.',
    icon: ShieldAlert,
    tone: 'red',
  },
  {
    title: 'Conflict Insight',
    description: 'Ubah analisis data menjadi kalimat sederhana yang mudah dipahami anggota grup.',
    icon: MessageSquareText,
    tone: 'purple',
  },
  {
    title: 'Recommendation System',
    description: 'Berikan saran giliran pembayaran atau penyelesaian utang agar beban lebih merata.',
    icon: CheckCircle2,
    tone: 'green',
  },
]

export const steps = [
  {
    title: 'Buat grup',
    description: 'Buat ruang patungan untuk kos, liburan, kerja tim, atau acara bersama.',
    icon: UsersRound,
  },
  {
    title: 'Tambahkan anggota',
    description: 'Masukkan teman yang ikut dalam pengeluaran dan pembagian tagihan.',
    icon: UsersRound,
  },
  {
    title: 'Catat transaksi',
    description: 'Input manual atau gunakan AI smart input dengan bahasa sehari-hari.',
    icon: ReceiptText,
  },
  {
    title: 'Talang.in menghitung otomatis',
    description: 'Sistem menghitung porsi, balance, dan rekomendasi pembayaran.',
    icon: RefreshCcw,
  },
  {
    title: 'Lihat insight grup',
    description: 'Pantau utang, histori, tren, dan potensi konflik dari dashboard.',
    icon: PieChart,
  },
]

export const problems: IconItem[] = [
  {
    title: 'Catatan patungan tercecer di chat',
    description: 'Jejak pengeluaran hilang karena tertimbun pesan grup yang panjang.',
    icon: MessageSquareText,
  },
  {
    title: 'Bingung siapa berutang ke siapa',
    description: 'Hitung-hitungan manual mudah salah saat transaksi sudah semakin banyak.',
    icon: CircleDollarSign,
  },
  {
    title: 'Ada anggota terlalu sering menalangi',
    description: 'Beban finansial jadi tidak merata dan bisa membuat suasana grup kurang nyaman.',
    icon: HandCoins,
  },
  {
    title: 'Utang lama sering terlupakan',
    description: 'Tagihan kecil yang tidak tercatat sering tidak selesai karena lupa.',
    icon: CalendarClock,
  },
  {
    title: 'Pembagian terasa kurang transparan',
    description: 'Anggota ragu karena tidak ada rincian jelas tentang uang masuk dan keluar.',
    icon: ShieldAlert,
  },
]
