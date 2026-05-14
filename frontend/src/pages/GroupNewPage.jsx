import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, UsersRound } from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { createGroup, addGroupMember } from '../services/groupSupabaseService'

export default function GroupNewPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [members, setMembers] = useState([{ name: '', email: '' }])
  const [saving, setSaving] = useState(false)

  const addMemberRow = () => {
    setMembers((prev) => [...prev, { name: '', email: '' }])
  }

  const removeMemberRow = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMember = (index, key, value) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [key]: value } : member
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Nama grup wajib diisi')
      return
    }

    try {
      setSaving(true)

      const group = await createGroup({
        name,
        description,
      })

      const validMembers = members.filter((member) => member.name.trim())

      await Promise.all(
        validMembers.map((member) =>
          addGroupMember({
            groupId: group.id,
            name: member.name,
            email: member.email,
          })
        )
      )

      alert('Grup berhasil dibuat')
      navigate('/group')
    } catch (error) {
      console.error(error)
      alert(error.message || 'Gagal membuat grup')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <header className="rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
              <button
                onClick={() => navigate('/group')}
                className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#082f5f]"
              >
                <ArrowLeft size={17} />
                Kembali ke Grup
              </button>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2fc] text-[#082f5f]">
                  <UsersRound size={26} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#082f5f]">Buat Grup Baru</p>
                  <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                    Mulai grup patungan
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                    Buat grup terlebih dahulu, lalu tambahkan anggota agar bisa dipakai saat mencatat transaksi.
                  </p>
                </div>
              </div>
            </header>

            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]"
            >
              <section>
                <h2 className="text-xl font-black text-[#082f5f]">
                  Informasi Grup
                </h2>

                <div className="mt-5 grid gap-4">
                  <InputField
                    label="Nama Grup"
                    value={name}
                    placeholder="Contoh: Kost Melati"
                    onChange={setName}
                  />

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                      Deskripsi
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Grup patungan kebutuhan kos"
                      className="min-h-[110px] w-full resize-none rounded-2xl border border-[#dfe7f2] bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#082f5f]">
                      Anggota Grup
                    </h2>
                    <p className="mt-1 text-sm text-[#667085]">
                      Minimal isi nama anggota. Email boleh dikosongkan dulu.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addMemberRow}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#082f5f] px-4 text-sm font-black text-[#082f5f]"
                  >
                    <Plus size={17} />
                    Tambah Anggota
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-2xl border border-[#dfe7f2] bg-[#f8fbff] p-4 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <InputField
                        label="Nama"
                        value={member.name}
                        placeholder="Nama anggota"
                        onChange={(value) => updateMember(index, 'name', value)}
                      />

                      <InputField
                        label="Email"
                        value={member.email}
                        placeholder="email@contoh.com"
                        onChange={(value) => updateMember(index, 'email', value)}
                      />

                      <button
                        type="button"
                        onClick={() => removeMemberRow(index)}
                        disabled={members.length === 1}
                        className="flex h-12 items-center justify-center self-end rounded-2xl text-[#c91f1f] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 md:w-12"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/group')}
                  className="h-12 rounded-2xl px-6 text-sm font-black text-[#667085]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 rounded-2xl bg-[#082f5f] px-6 text-sm font-black text-white transition hover:bg-[#06264d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Grup'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
    />
  </div>
)