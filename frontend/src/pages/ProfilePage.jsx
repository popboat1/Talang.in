import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  CloudUpload,
  LockKeyhole,
  LogOut,
  Monitor,
  Save,
  Search,
  ShieldAlert,
  UserRound,
} from 'lucide-react'

import {
  getCurrentUser,
  logoutSupabase,
  updateCurrentUser,
} from '../services/authSupabaseService'

import Sidebar from '../components/Sidebar'

const formatUserName = (user) =>
  user?.name ||
  user?.full_name ||
  user?.user_metadata?.full_name ||
  user?.email?.split('@')[0] ||
  'User'

export default function ProfilePage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        const name = formatUserName(currentUser)
        const email = currentUser?.email || ''

        setForm((prev) => ({
          ...prev,
          fullName: name,
          username: email.split('@')[0] || '',
          email,
          phone: '',
        }))
      } catch (error) {
        console.error(error)
        navigate('/login', { replace: true })
      }
    }

    loadUser()
  }, [navigate])

  const displayName = formatUserName(user)
  const email = user?.email || 'budi.santoso@email.com'


  const [notifications, setNotifications] = useState({
    newTransaction: true,
    debtReminder: true,
    paymentConfirmation: true,
    weeklyInsight: false,
  })

  const filteredVisible = useMemo(() => {
    if (!search) return true

    return `profil akun notifikasi keamanan password logout preferensi bahasa mata uang tema`
      .toLowerCase()
      .includes(search.toLowerCase())
  }, [search])

  const handleSave = async () => {
    try {
      setSaving(true)

      const updatedUser = await updateCurrentUser({
        fullName: form.fullName,
      })

      setUser(updatedUser)

      localStorage.setItem(
        'talang_preferences',
        JSON.stringify({
          language: form.language,
          currency: form.currency,
        })
      )

      alert('Profil berhasil disimpan')
    } catch (error) {
      console.error(error)
      alert('Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logoutSupabase()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
      <style>
        {`
          @keyframes profileRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .profile-rise {
            animation: profileRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar user={user} />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <header className="profile-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-[#082f5f]">Profil & Pengaturan</p>
                <p className="mt-1 text-sm text-[#667085]">
                  Atur informasi akun dan preferensi aplikasi.
                </p>
              </div>

              <div className="relative w-full lg:w-[320px]">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari pengaturan..."
                  className="h-12 w-full rounded-2xl border border-[#e7edf5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                />
              </div>
            </header>

            {!filteredVisible ? (
              <section className="rounded-[28px] border border-dashed border-[#cbd8e8] bg-white p-10 text-center">
                <Search className="mx-auto text-[#082f5f]" size={34} />
                <h2 className="mt-4 text-lg font-black text-[#082f5f]">
                  Pengaturan tidak ditemukan
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Coba gunakan kata kunci lain.
                </p>
              </section>
            ) : (
              <>
                <section className="profile-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf2fc] text-2xl font-black text-[#082f5f] ring-4 ring-white shadow-md">
                          {displayName.slice(0, 1).toUpperCase()}
                        </div>

                        <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#082f5f] text-white shadow-md">
                          <UserRound size={15} />
                        </button>
                      </div>

                      <div>
                        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#082f5f]">
                          {displayName}
                        </h1>
                        <p className="mt-1 text-sm font-medium text-[#475467]">{email}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-black text-[#082f5f]">
                            Premium User
                          </span>
                          <span className="rounded-full bg-[#f1f4f9] px-3 py-1 text-xs font-black text-[#667085]">
                            ID: TLG-1029
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#082f5f] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#06264d]">
                      Edit Profil
                    </button>
                  </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="space-y-5">
                    <section className="profile-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                      <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                        Informasi Akun
                      </h2>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <InputField
                          label="Nama Lengkap"
                          value={form.fullName}
                          onChange={(value) => setForm({ ...form, fullName: value })}
                        />
                        <InputField
                          label="Username"
                          value={form.username}
                          onChange={(value) => setForm({ ...form, username: value })}
                        />
                        <InputField
                          label="Email"
                          value={form.email}
                          onChange={() => { }}
                          readOnly
                        />
                        <InputField
                          label="Nomor Telepon"
                          value={form.phone}
                          onChange={(value) => setForm({ ...form, phone: value })}
                        />
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-xs font-bold text-[#475467]">
                          Foto Profil
                        </label>

                        <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9c7d9] bg-[#f8fbff] p-6 text-center">
                          <CloudUpload className="text-[#667085]" size={34} />
                          <p className="mt-3 text-sm font-semibold text-[#667085]">
                            Klik atau seret file untuk upload
                          </p>
                          <p className="mt-1 text-xs text-[#98a2b3]">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button className="h-12 rounded-2xl px-6 text-sm font-black text-[#082f5f]">
                          Batalkan
                        </button>

                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-6 text-sm font-black text-white transition hover:bg-[#06264d] disabled:opacity-60"
                        >
                          <Save size={17} />
                          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
                    <section className="profile-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                      <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                        Notifikasi
                      </h2>

                      <div className="mt-5 space-y-5">
                        <ToggleRow
                          title="Transaksi baru"
                          desc="Update instan setiap ada tagihan"
                          value={notifications.newTransaction}
                          onChange={() =>
                            setNotifications({
                              ...notifications,
                              newTransaction: !notifications.newTransaction,
                            })
                          }
                        />

                        <ToggleRow
                          title="Pengingat utang"
                          desc="Kirim otomatis ke teman yang belum bayar"
                          value={notifications.debtReminder}
                          onChange={() =>
                            setNotifications({
                              ...notifications,
                              debtReminder: !notifications.debtReminder,
                            })
                          }
                        />

                        <ToggleRow
                          title="Konfirmasi pembayaran"
                          desc="Beritahu saya jika pembayaran diterima"
                          value={notifications.paymentConfirmation}
                          onChange={() =>
                            setNotifications({
                              ...notifications,
                              paymentConfirmation: !notifications.paymentConfirmation,
                            })
                          }
                        />

                        <ToggleRow
                          title="Insight mingguan"
                          desc="Rekap pengeluaran setiap hari Senin"
                          value={notifications.weeklyInsight}
                          onChange={() =>
                            setNotifications({
                              ...notifications,
                              weeklyInsight: !notifications.weeklyInsight,
                            })
                          }
                        />
                      </div>
                    </section>

                    <section className="profile-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                      <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                        Keamanan & Akun
                      </h2>

                      <div className="mt-5 space-y-3">
                        <ActionButton icon={LockKeyhole} label="Ubah Password" />
                        <ActionButton icon={Monitor} label="Keluar dari semua perangkat" />
                        <ActionButton icon={ShieldAlert} label="Hapus Akun" danger />
                      </div>
                    </section>

                    <section className="profile-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 text-center shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                      <p className="text-sm font-medium text-[#667085]">
                        Apakah Anda ingin keluar dari akun Anda?
                      </p>

                      <button
                        onClick={handleLogout}
                        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#082f5f] bg-white text-sm font-black text-[#082f5f] transition hover:bg-[#eaf2fc]"
                      >
                        <LogOut size={17} />
                        Keluar Sekarang
                      </button>
                    </section>
                  </aside>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

const InputField = ({ label, value, onChange, readOnly = false }) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-[#475467]">{label}</label>
    <input
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      className={`h-12 w-full rounded-2xl border border-[#dfe7f2] px-4 text-sm font-medium text-[#1d2939] outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc] ${readOnly ? 'bg-[#f3f4f6] text-[#667085]' : 'bg-white'
        }`}
    />
  </div>
)

const ToggleRow = ({ title, desc, value, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-black text-[#1d2939]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#667085]">{desc}</p>
    </div>

    <button
      onClick={onChange}
      className={`flex h-7 w-12 items-center rounded-full p-1 transition ${value ? 'bg-[#082f5f]' : 'bg-[#e5e7eb]'
        }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white transition ${value ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  </div>
)

const ActionButton = ({ icon: Icon, label, danger = false }) => (
  <button
    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-sm font-black transition hover:-translate-y-0.5 ${danger
        ? 'border-[#fecaca] bg-[#fff7f7] text-[#c91f1f]'
        : 'border-[#dfe7f2] bg-[#f8fbff] text-[#475467]'
      }`}
  >
    <span className="flex items-center gap-3">
      <Icon size={18} />
      {label}
    </span>
    <ChevronRight size={18} />
  </button>
)