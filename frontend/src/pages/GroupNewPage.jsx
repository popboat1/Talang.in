import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { createGroup, addMember } from '../services/groupService'
import { getUser } from '../services/authService'

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
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-lg w-full mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/group')} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            ← Kembali
          </button>
          <h1 className="text-base font-medium">Buat Grup Baru</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['Info Grup', 'Tambah Anggota'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
                  style={{
                    background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#0c3460' : 'var(--color-border-tertiary)',
                    color: step >= i + 1 ? 'white' : 'var(--color-text-secondary)'
                  }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="text-xs" style={{ color: step === i + 1 ? '#0c3460' : 'var(--color-text-secondary)' }}>
                  {label}
                </span>
              </div>
              {i < 1 && <div className="w-8 h-px" style={{ background: 'var(--color-border-tertiary)' }} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Info Grup */}
        {step === 1 && (
          <div className="rounded-xl border p-5" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
            <h2 className="text-sm font-medium mb-4">Informasi Grup</h2>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Nama Grup *</label>
              <input
                type="text"
                placeholder="Contoh: Kost Melati, Trip Bali"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--color-border-tertiary)', background: 'var(--color-background-tertiary)' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Deskripsi (opsional)</label>
              <textarea
                placeholder="Deskripsi singkat grup..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--color-border-tertiary)', background: 'var(--color-background-tertiary)' }}
              />
            </div>

            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="w-full h-10 rounded-lg text-sm font-medium text-white disabled:opacity-60"
              style={{ background: '#0c3460' }}
            >
              {loading ? 'Membuat grup...' : 'Buat Grup & Lanjutkan →'}
            </button>
          </div>
        )}

        {/* STEP 2: Tambah Anggota */}
        {step === 2 && (
          <div>
            <div className="rounded-xl border p-5 mb-4" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                  style={{ background: '#b5d4f4', color: '#0c447c' }}>
                  {createdGroup?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{createdGroup?.name}</p>
                  <p className="text-xs text-green-600">✓ Grup berhasil dibuat!</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-5" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <h2 className="text-sm font-medium mb-1">Tambah Anggota</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Masukkan email anggota yang sudah terdaftar di Talang.in
              </p>

              {addError && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-500">{addError}</p>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  className="flex-1 h-9 px-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border-tertiary)', background: 'var(--color-background-tertiary)' }}
                />
                <button
                  onClick={handleAddMember}
                  disabled={addLoading || !emailInput}
                  className="px-4 h-9 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                  style={{ background: '#0c3460' }}
                >
                  {addLoading ? '...' : 'Tambah'}
                </button>
              </div>

              {/* List anggota yang sudah ditambahkan */}
              {addedMembers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Anggota ditambahkan:</p>
                  <div className="flex flex-col gap-1.5">
                    {addedMembers.map((email, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'var(--color-background-tertiary)' }}>
                        <span className="text-green-500 text-xs">✓</span>
                        <span className="text-xs">{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/group/${createdGroup.id}`)}
                  className="flex-1 h-10 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#0c3460' }}
                >
                  Selesai →
                </button>
              </div>

              <button
                onClick={() => navigate(`/group/${createdGroup.id}`)}
                className="w-full mt-2 text-xs text-center"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Lewati, tambah anggota nanti
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default GroupNewPage