import {
  BarChart3, CircleDollarSign, Gauge, MessageSquareText,
  Radar, ReceiptText, Route, ShieldCheck, Sparkles,
  WalletCards, Zap,
} from 'lucide-react'

export const navLinks = [
  ['Fitur', '#fitur'],
  ['Cara Kerja', '#cara-kerja'],
  ['Inovasi', '#inovasi'],
  ['Use Case', '#use-case'],
]

export const features = [
  { title: 'Catat Transaksi Grup', description: 'Input pembayar, anggota yang ikut patungan, dan nominal transaksi dalam flow yang ringan.', icon: ReceiptText, meta: 'Fast entry' },
  { title: 'Split Bill Otomatis', description: 'Pembagian dihitung otomatis agar setiap anggota tahu kewajiban tanpa debat ulang.', icon: CircleDollarSign, meta: 'Auto split' },
  { title: 'Pantau Utang & Balance', description: 'Lihat siapa membayar lebih, siapa masih berutang, dan settlement yang paling efisien.', icon: WalletCards, meta: 'Clear balance' },
  { title: 'Conflict Detection', description: 'Sistem membaca pola pembayaran tidak seimbang sebelum membuat suasana grup canggung.', icon: Radar, meta: 'Risk alert' },
  { title: 'Insight & Recommendation', description: 'Data transaksi diubah menjadi saran sederhana yang bisa langsung dipakai anggota grup.', icon: Sparkles, meta: 'Smart advice' },
  { title: 'Dashboard Analytics', description: 'Tren pengeluaran, health score, aktivitas anggota, dan status utang tampil dalam satu layar.', icon: BarChart3, meta: 'Live summary' },
]

export const steps = [
  { title: 'Buat grup', detail: 'Mulai dari ruang keuangan bersama untuk kost, liburan, komunitas, atau project.' },
  { title: 'Tambah anggota', detail: 'Masukkan teman yang ikut patungan dan atur siapa saja yang terlibat.' },
  { title: 'Catat transaksi', detail: 'Setiap pembayaran punya detail pembayar, peserta, kategori, dan nominal.' },
  { title: 'Talang.in menghitung', detail: 'Split, balance, dan rekomendasi settlement dihitung secara otomatis.' },
  { title: 'Baca insight', detail: 'Dashboard memberi ringkasan kondisi grup dan potensi masalah pembayaran.' },
]

export const useCases = ['Anak kos', 'Teman liburan', 'Kelompok kerja', 'Komunitas kecil', 'Project team', 'Event kecil']

export const stats = [
  { value: '3x', label: 'lebih cepat mencatat transaksi' },
  { value: '72', label: 'health score contoh grup' },
  { value: '100%', label: 'transparan untuk anggota' },
]

export const members = [
  { name: 'Ayu', role: 'Sering bayar konsumsi', balance: '+Rp280k' },
  { name: 'Raka', role: 'Perlu settlement', balance: '-Rp95k' },
  { name: 'Nina', role: 'Pembayaran stabil', balance: '+Rp40k' },
]

export const expenses = [58, 82, 44, 96, 68, 88, 62, 76]

export const problemItems = [
  ['Siapa yang sudah bayar?', Zap],
  ['Siapa yang masih punya utang?', Gauge],
  ['Kenapa pembayaran tidak seimbang?', ShieldCheck],
]

export const innovationItems = [
  ['Conflict Detection', 'Mendeteksi potensi masalah dari pola transaksi grup.', Radar],
  ['Insight Otomatis', 'Mengubah data mentah menjadi ringkasan yang mudah dipahami.', MessageSquareText],
  ['Recommendation', 'Memberi saran settlement agar pembayaran grup lebih sehat.', Route],
]

export const landingStyles = `
  @keyframes floatSlow { 0%,100%{transform:translate3d(0,0,0) rotate(0deg)}50%{transform:translate3d(0,-16px,0) rotate(.8deg)} }
  @keyframes riseIn { from{opacity:0;transform:translateY(26px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes scan { 0%{transform:translateY(-100%);opacity:0}20%,70%{opacity:.75}100%{transform:translateY(120%);opacity:0} }
  .reveal-up{animation:riseIn .75s cubic-bezier(.2,.8,.2,1) both}
  .float-slow{animation:floatSlow 7s ease-in-out infinite}
  .scan-line::after{content:'';position:absolute;inset-inline:0;top:0;height:38%;background:rgba(96,165,250,.18);animation:scan 5.2s ease-in-out infinite}
`