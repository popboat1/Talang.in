import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  FolderPlus,
  Loader2,
  Mail,
  Plus,
  UserPlus,
  UsersRound,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { createGroup, addMember } from '../services/groupService'
import { getUser } from '../services/authService'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F3F7FD',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const GroupNewPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [step, setStep] = useState(1) // step 1: info grup, step 2: tambah anggota
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdGroup, setCreatedGroup] = useState(null)
  const [emailInput, setEmailInput] = useState('')
  const [addedMembers, setAddedMembers] = useState([])
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  const handleCreateGroup = async () => {
    if (!form.name) { setError('Nama grup wajib diisi'); return }
    setLoading(true)
    setError('')
    try {
      const group = await createGroup(form.name, form.description)
      setCreatedGroup(group)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat grup')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!emailInput) return
    setAddLoading(true)
    setAddError('')
    try {
      await addMember(createdGroup.id, emailInput)
      setAddedMembers([...addedMembers, emailInput])
      setEmailInput('')
    } catch (err) {
      setAddError(err.response?.data?.message || 'Gagal menambahkan anggota')
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
          @keyframes groupNewRise {
            from {
              opacity: 0;
              transform: translateY(22px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes groupNewFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .group-new-rise {
            animation: groupNewRise .68s cubic-bezier(.2,.8,.2,1) both;
          }

          .group-new-float {
            animation: groupNewFloat 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar user={user} />

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-7">
            {/* Header */}
            <section
              className="group-new-rise overflow-hidden rounded-[34px] border bg-white/90 p-5 shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl sm:p-6 lg:p-7"
              style={{ borderColor: colors.border }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => navigate('/group')}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B2D55] shadow-[0_14px_35px_rgba(11,45,85,.1)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(11,45,85,.14)] active:scale-95"
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="min-w-0">
                    <div
                      className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      Buat Grup Baru
                    </div>

                    <h1
                      className="text-3xl font-black leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl"
                      style={{ color: colors.textDark }}
                    >
                      Siapkan grup patungan baru.
                    </h1>

                    <p
                      className="mt-4 max-w-2xl text-sm font-medium leading-7 sm:text-base"
                      style={{ color: colors.textMuted }}
                    >
                      Buat grup, tambahkan anggota, lalu mulai kelola transaksi bersama dengan lebih rapi dan transparan.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-[28px] border p-4"
                  style={{ borderColor: colors.border, background: colors.surface }}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black" style={{ color: colors.textDark }}>
                        Progress pembuatan
                      </p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                        {step === 1 ? 'Lengkapi informasi grup' : 'Tambahkan anggota grup'}
                      </p>
                    </div>

                    <div
                      className="group-new-float flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                      style={{ background: colors.navy }}
                    >
                      {step === 1 ? <FolderPlus size={23} /> : <UserPlus size={23} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {['Info Grup', 'Tambah Anggota'].map((label, index) => {
                      const number = index + 1
                      const active = step === number
                      const done = step > number

                      return (
                        <div
                          key={label}
                          className="rounded-2xl border p-3"
                          style={{
                            background: active || done ? colors.card : colors.surface,
                            borderColor: active
                              ? colors.navy
                              : done
                                ? '#BBF7D0'
                                : colors.border,
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black"
                              style={{
                                background: done
                                  ? colors.success
                                  : active
                                    ? colors.navy
                                    : colors.soft,
                                color: done || active ? '#FFFFFF' : colors.textMuted,
                              }}
                            >
                              {done ? <Check size={14} /> : number}
                            </div>

                            <p
                              className="text-xs font-black"
                              style={{
                                color: active
                                  ? colors.navy
                                  : done
                                    ? colors.success
                                    : colors.textMuted,
                              }}
                            >
                              Step {number}
                            </p>
                          </div>

                          <p className="text-xs font-semibold" style={{ color: colors.textDark }}>
                            {label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Main form layout */}
            <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="group-new-rise" style={{ animationDelay: '90ms' }}>
                {/* STEP 1: Info Grup */}
                {step === 1 && (
                  <div
                    className="rounded-[32px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-6"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="mb-6 flex items-start gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{ background: colors.soft, color: colors.navySoft }}
                      >
                        <FolderPlus size={22} />
                      </div>

                      <div>
                        <h2
                          className="text-xl font-black tracking-[-0.035em]"
                          style={{ color: colors.textDark }}
                        >
                          Informasi Grup
                        </h2>
                        <p
                          className="mt-1 text-sm font-medium leading-6"
                          style={{ color: colors.textMuted }}
                        >
                          Masukkan nama dan deskripsi singkat agar grup mudah dikenali.
                        </p>
                      </div>
                    </div>

                    {error && (
                      <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-semibold text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <label
                          className="mb-2 block text-xs font-black uppercase tracking-[0.14em]"
                          style={{ color: colors.textMuted }}
                        >
                          Nama Grup *
                        </label>

                        <input
                          type="text"
                          placeholder="Contoh: Kost Melati, Trip Bali"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-slate-300 focus:ring-4"
                          style={{
                            borderColor: colors.border,
                            color: colors.textDark,
                            '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-2 block text-xs font-black uppercase tracking-[0.14em]"
                          style={{ color: colors.textMuted }}
                        >
                          Deskripsi
                        </label>

                        <textarea
                          placeholder="Deskripsi singkat grup..."
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={5}
                          className="w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm font-semibold leading-7 outline-none transition placeholder:text-slate-300 focus:ring-4"
                          style={{
                            borderColor: colors.border,
                            color: colors.textDark,
                            '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                          }}
                        />
                      </div>

                      <button
                        onClick={handleCreateGroup}
                        disabled={loading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: colors.navy }}
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Membuat grup...
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            Buat Grup & Lanjutkan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Tambah Anggota */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div
                      className="rounded-[32px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-6"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-xl font-black"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          {createdGroup?.name?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="truncate text-lg font-black"
                            style={{ color: colors.textDark }}
                          >
                            {createdGroup?.name}
                          </p>

                          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-black" style={{ color: colors.success }}>
                            <CheckCircle2 size={14} />
                            Grup berhasil dibuat
                          </p>
                        </div>
                      </div>

                      <div
                        className="rounded-[24px] border p-4"
                        style={{ background: colors.successSoft, borderColor: '#BBF7D0' }}
                      >
                        <p className="text-sm font-black" style={{ color: colors.success }}>
                          Step berikutnya: tambahkan anggota
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-6" style={{ color: colors.textMuted }}>
                          Kamu bisa menambahkan email anggota sekarang atau melewati langkah ini.
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-[32px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-6"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="mb-6 flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          <UserPlus size={22} />
                        </div>

                        <div>
                          <h2
                            className="text-xl font-black tracking-[-0.035em]"
                            style={{ color: colors.textDark }}
                          >
                            Tambah Anggota
                          </h2>
                          <p
                            className="mt-1 text-sm font-medium leading-6"
                            style={{ color: colors.textMuted }}
                          >
                            Masukkan email anggota yang sudah terdaftar di Talang.in.
                          </p>
                        </div>
                      </div>

                      {addError && (
                        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                          <p className="text-sm font-semibold text-red-600">{addError}</p>
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                            style={{ color: colors.navySoft }}
                          />

                          <input
                            type="email"
                            placeholder="email@contoh.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                            className="h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-300 focus:ring-4"
                            style={{
                              borderColor: colors.border,
                              color: colors.textDark,
                              '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                            }}
                          />
                        </div>

                        <button
                          onClick={handleAddMember}
                          disabled={addLoading || !emailInput}
                          className="flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          style={{ background: colors.navy }}
                        >
                          {addLoading ? (
                            <>
                              <Loader2 size={17} className="animate-spin" />
                              Menambah...
                            </>
                          ) : (
                            <>
                              <Plus size={17} />
                              Tambah
                            </>
                          )}
                        </button>
                      </div>

                      {addedMembers.length > 0 && (
                        <div className="mt-5">
                          <p
                            className="mb-3 text-xs font-black uppercase tracking-[0.14em]"
                            style={{ color: colors.textMuted }}
                          >
                            Anggota ditambahkan
                          </p>

                          <div className="grid gap-2">
                            {addedMembers.map((email, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 rounded-2xl border px-4 py-3"
                                style={{ background: colors.surface, borderColor: colors.border }}
                              >
                                <span
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                                  style={{ background: colors.successSoft, color: colors.success }}
                                >
                                  <Check size={16} />
                                </span>

                                <span
                                  className="min-w-0 break-all text-sm font-semibold"
                                  style={{ color: colors.textDark }}
                                >
                                  {email}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <button
                          onClick={() => navigate(`/group/${createdGroup.id}`)}
                          className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition hover:-translate-y-0.5 active:scale-[0.98]"
                          style={{ background: colors.navy }}
                        >
                          Selesai
                        </button>

                        <button
                          onClick={() => navigate(`/group/${createdGroup.id}`)}
                          className="flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-black transition hover:-translate-y-0.5 active:scale-[0.98]"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          Lewati
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side helper */}
              <aside className="group-new-rise lg:sticky lg:top-7 lg:self-start" style={{ animationDelay: '160ms' }}>
                <div
                  className="rounded-[32px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: colors.navy }}
                  >
                    <UsersRound size={23} />
                  </div>

                  <h3
                    className="text-lg font-black tracking-[-0.035em]"
                    style={{ color: colors.textDark }}
                  >
                    Tips membuat grup
                  </h3>

                  <p
                    className="mt-2 text-sm font-medium leading-7"
                    style={{ color: colors.textMuted }}
                  >
                    Gunakan nama grup yang mudah dikenali, lalu tambahkan anggota yang sering ikut patungan.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      'Nama grup sebaiknya singkat dan jelas.',
                      'Deskripsi membantu anggota memahami tujuan grup.',
                      'Anggota bisa ditambahkan sekarang atau nanti.',
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-2xl px-3 py-3"
                        style={{ background: colors.surface }}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                          style={{ background: colors.navy }}
                        >
                          {index + 1}
                        </span>

                        <p
                          className="text-xs font-semibold leading-5"
                          style={{ color: colors.textMuted }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GroupNewPage