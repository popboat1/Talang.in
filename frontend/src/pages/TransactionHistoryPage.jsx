import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Plus,
  ReceiptText,
  Save,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from '../services/transactionSupabaseService'
import Sidebar from '../components/Sidebar'

const ITEMS_PER_PAGE = 3

const formatRupiah = (value) =>
  `Rp${Number(value || 0).toLocaleString('id-ID')}`

const getInitial = (name = '') => name.slice(0, 1).toUpperCase()

export default function TransactionHistoryPage() {
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [status, setStatus] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [editing, setEditing] = useState(null)

  const normalizeTransaction = (item) => {
    const participants = item.transaction_participants || []

    return {
      id: item.id,
      group: item.groups?.name || 'Grup',
      desc: item.title,
      amount: Number(item.amount || 0),
      date: item.date || 'Hari ini',
      category: item.category || 'Lainnya',
      paidBy: item.paid_by,
      splitWith: participants.map((p) => p.member_name),
      perOrang:
        participants.length > 0
          ? Math.round(Number(item.amount || 0) / participants.length)
          : Number(item.amount || 0),
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchTransactions = async () => {
      try {
        setLoading(true)

        const data = await getTransactions()
        const normalized = data.map(normalizeTransaction)

        if (!isMounted) return

        setTransactions(normalized)
        setSelected(normalized[0] || null)
      } catch (error) {
        console.error(error)
        alert('Gagal memuat transaksi dari database')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTransactions()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => ['Semua', ...new Set(transactions.map((item) => item.category))],
    [transactions]
  )

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      const keyword = search.toLowerCase()

      const matchSearch =
        item.desc.toLowerCase().includes(keyword) ||
        item.group.toLowerCase().includes(keyword) ||
        item.paidBy.toLowerCase().includes(keyword)

      const matchCategory = category === 'Semua' || item.category === category
      const matchStatus = status === 'Semua' || status === 'Aktif'

      return matchSearch && matchCategory && matchStatus
    })
  }, [transactions, search, category, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage((page) => {
        if (page > totalPages) return totalPages
        if (page !== 1) return 1
        return page
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [search, category, status, totalPages])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Hapus transaksi ini?')
    if (!confirmDelete) return

    try {
      await deleteTransaction(id)

      const updated = transactions.filter((item) => item.id !== id)
      setTransactions(updated)

      if (selected?.id === id) {
        setSelected(updated[0] || null)
      }
    } catch (error) {
      console.error(error)
      alert('Gagal menghapus transaksi')
    }
  }

  const handleUpdate = async (updatedTransaction) => {
  try {
    const updated = await updateTransaction({
      id: updatedTransaction.id,
      title: updatedTransaction.desc,
      amount: updatedTransaction.amount,
      category: updatedTransaction.category,
      paidBy: updatedTransaction.paidBy,
    })

    const normalized = normalizeTransaction({
      ...updated,
      transaction_participants:
        transactions.find((t) => t.id === updated.id)?.splitWith?.map(
          (member) => ({
            member_name: member,
          })
        ) || [],
    })

    setTransactions((prev) =>
      prev.map((item) =>
        item.id === normalized.id ? normalized : item
      )
    )

    setSelected(normalized)
    setEditing(null)
  } catch (error) {
    console.error(error)
    alert('Gagal update transaksi')
  }
}

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
      <style>
        {`
          @keyframes historyRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .history-rise {
            animation: historyRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-6">
            <section className="min-w-0 space-y-5">
              <header className="history-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0b3a70]">
                      Riwayat Transaksi
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                      Semua catatan patungan
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                      Pantau transaksi grup, siapa yang membayar, siapa yang ikut split,
                      dan status patungan setiap anggota.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/transaction')}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(8,47,95,.22)] transition hover:-translate-y-0.5 hover:bg-[#06264d] active:scale-[0.98]"
                  >
                    <Plus size={18} />
                    Tambah Transaksi
                  </button>
                </div>
              </header>

              <section className="history-rise rounded-[24px] border border-[#e7edf5] bg-white p-4 shadow-[0_14px_34px_rgba(15,39,66,.05)]">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                    />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari transaksi, grup, atau pembayar..."
                      className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-[#fbfcff] pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#082f5f] focus:bg-white focus:ring-4 focus:ring-[#eaf2fc]"
                    />
                  </div>

                  <SelectFilter value={category} onChange={setCategory} options={categories} />
                  <SelectFilter value={status} onChange={setStatus} options={['Semua', 'Aktif', 'Lunas']} />

                  <button
                    onClick={() => {
                      setSearch('')
                      setCategory('Semua')
                      setStatus('Semua')
                    }}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dfe7f2] bg-white px-4 text-sm font-black text-[#475467]"
                  >
                    <Filter size={17} />
                    Reset
                  </button>
                </div>
              </section>

              {loading ? (
                <div className="rounded-[28px] bg-white p-10 text-center text-sm font-bold text-[#667085]">
                  Memuat transaksi...
                </div>
              ) : (

                <section className="history-rise overflow-hidden rounded-[28px] border border-[#e7edf5] bg-white shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                  <div className="hidden grid-cols-[1.25fr_.9fr_.9fr_.9fr_.8fr] bg-[#f7f8fc] px-5 py-4 text-xs font-black uppercase text-[#475467] md:grid">
                    <span>Nama Transaksi</span>
                    <span>Kategori</span>
                    <span>Nominal</span>
                    <span>Pembayar</span>
                    <span>Anggota</span>
                  </div>

                  {paginatedTransactions.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                      <ReceiptText className="mx-auto text-[#0b3a70]" size={34} />
                      <h3 className="mt-4 text-base font-black text-[#1d2939]">
                        Tidak ada transaksi
                      </h3>
                      <p className="mt-2 text-sm text-[#667085]">
                        Coba ubah kata pencarian atau filter transaksi.
                      </p>
                    </div>
                  ) : (
                    paginatedTransactions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className={`grid w-full gap-3 border-t border-[#eef2f7] px-5 py-4 text-left text-sm transition hover:bg-[#f8fbff] md:grid-cols-[1.25fr_.9fr_.9fr_.9fr_.8fr] md:items-center ${selected?.id === item.id ? 'bg-[#f8fbff]' : 'bg-white'
                          }`}
                      >
                        <div>
                          <p className="font-black text-[#082f5f]">{item.desc}</p>
                          <p className="mt-1 text-xs text-[#667085]">
                            {item.group} · {item.date}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-[#fff7df] px-3 py-1 text-xs font-black text-[#8a6a00]">
                          {item.category}
                        </span>

                        <span className="font-black text-[#1d2939]">
                          {formatRupiah(item.amount)}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf2fc] text-xs font-black text-[#0b3a70]">
                            {getInitial(item.paidBy)}
                          </span>
                          <span className="font-semibold text-[#475467]">
                            {item.paidBy}
                          </span>
                        </div>

                        <span className="text-[#667085]">
                          {item.splitWith.length} anggota
                        </span>
                      </button>
                    ))
                  )}

                  <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[#667085]">
                      Menampilkan {paginatedTransactions.length} dari {filtered.length} transaksi
                    </p>

                    <div className="flex items-center gap-2">
                      <PageButton
                        icon={ChevronLeft}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                      />

                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1
                        const active = currentPage === page

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`h-9 rounded-xl px-4 text-sm font-black ${active
                              ? 'bg-[#082f5f] text-white'
                              : 'border border-[#dfe7f2] bg-white text-[#475467]'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <PageButton
                        icon={ChevronRight}
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((page) => Math.min(page + 1, totalPages))
                        }
                      />
                    </div>
                  </div>
                </section>
              )}
            </section>


            <aside className="history-rise lg:sticky lg:top-5 lg:self-start">
              <TransactionDetail
                transaction={selected}
                onClose={() => setSelected(null)}
                onEdit={(trx) => setEditing(trx)}
                onDelete={handleDelete}
              />
            </aside>
          </div>
        </main>
      </div>

      {editing && (
        <EditTransactionModal
          transaction={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}

const SelectFilter = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-12 rounded-2xl border border-[#dfe7f2] bg-white px-4 text-sm font-black text-[#475467] outline-none focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
  >
    {options.map((item) => (
      <option key={item}>{item}</option>
    ))}
  </select>
)

const PageButton = ({ icon: Icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfe7f2] bg-white text-[#475467] disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Icon size={16} />
  </button>
)

const TransactionDetail = ({ transaction, onClose, onEdit, onDelete }) => {
  if (!transaction) {
    return (
      <section className="rounded-[28px] border border-[#e7edf5] bg-white p-6 text-center shadow-[0_18px_45px_rgba(15,39,66,.06)]">
        <WalletCards className="mx-auto text-[#0b3a70]" size={34} />
        <h2 className="mt-4 text-lg font-black text-[#082f5f]">
          Pilih transaksi
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Klik salah satu transaksi untuk melihat rincian patungan.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.09)]">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#e5eaf2] pb-4">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
            Detail Transaksi
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Rincian pembayaran dan split anggota.
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#667085] hover:bg-[#f6f8fc]"
        >
          <X size={18} />
        </button>
      </div>

      <h3 className="text-2xl font-black tracking-[-0.04em] text-[#1d2939]">
        {transaction.desc}
      </h3>

      <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
        {formatRupiah(transaction.amount)}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-black text-[#8a6a00]">
          {transaction.category}
        </span>
        <span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-black text-[#0b3a70]">
          Aktif
        </span>
      </div>

      <div className="my-5 h-px bg-[#e5eaf2]" />

      <div className="grid grid-cols-2 gap-4">
        <DetailMeta icon={UserRound} label="Pembayar" value={transaction.paidBy} />
        <DetailMeta icon={CalendarDays} label="Tanggal" value={transaction.date} />
      </div>

      <div className="my-5 h-px bg-[#e5eaf2]" />

      <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-[#0b3a70]">
        Rincian Patungan
      </p>

      <div className="space-y-3">
        {transaction.splitWith.map((member) => {
          const isPayer = transaction.paidBy.includes(member)

          return (
            <div key={member} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${isPayer ? 'bg-[#eaf2fc] text-[#0b3a70]' : 'bg-[#d9f7ef] text-[#047857]'
                    }`}
                >
                  {getInitial(member)}
                </span>

                <div>
                  <p className="text-sm font-black text-[#1d2939]">{member}</p>
                  <p className="text-xs text-[#667085]">
                    {isPayer ? 'Pembayar / lunas' : `Hutang ke ${transaction.paidBy}`}
                  </p>
                </div>
              </div>

              <p className="text-sm font-black text-[#1d2939]">
                {formatRupiah(transaction.perOrang)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[#f6f4fb] p-4">
        <p className="text-sm font-black text-[#475467]">
          Status Piutang
        </p>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Anggota yang bukan pembayar perlu mengganti bagian patungan kepada{' '}
          <span className="font-black text-[#082f5f]">{transaction.paidBy}</span>.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit(transaction)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#082f5f] text-sm font-black text-[#082f5f]"
        >
          <Edit3 size={17} />
          Edit
        </button>

        <button
          onClick={() => onDelete(transaction.id)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#c91f1f] text-sm font-black text-white"
        >
          <Trash2 size={17} />
          Hapus
        </button>
      </div>
    </section>
  )
}

const DetailMeta = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-xs font-bold text-[#98a2b3]">{label}</p>
    <div className="mt-2 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf2fc] text-[#0b3a70]">
        <Icon size={15} />
      </span>
      <span className="text-sm font-black text-[#1d2939]">{value}</span>
    </div>
  </div>
)

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
  const [form, setForm] = useState({
    desc: transaction.desc,
    amount: transaction.amount,
    category: transaction.category,
    paidBy: transaction.paidBy,
  })

  const handleSubmit = () => {
    if (!form.desc || !form.amount || !form.category || !form.paidBy) return

    onSave({
      ...transaction,
      desc: form.desc,
      amount: Number(form.amount),
      category: form.category,
      paidBy: form.paidBy,
    })
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
              Edit Transaksi
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Perbarui data transaksi patungan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#667085] hover:bg-[#f6f8fc]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          <EditInput
            label="Nama Transaksi"
            value={form.desc}
            onChange={(value) => setForm({ ...form, desc: value })}
          />

          <EditInput
            label="Nominal"
            type="number"
            value={form.amount}
            onChange={(value) => setForm({ ...form, amount: value })}
          />

          <EditInput
            label="Kategori"
            value={form.category}
            onChange={(value) => setForm({ ...form, category: value })}
          />

          <EditInput
            label="Pembayar"
            value={form.paidBy}
            onChange={(value) => setForm({ ...form, paidBy: value })}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#082f5f] text-sm font-black text-white transition hover:bg-[#06264d]"
        >
          <Save size={17} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}

const EditInput = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
      {label}
    </label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-[#fbfcff] px-4 text-sm font-semibold text-[#1d2939] outline-none transition focus:border-[#082f5f] focus:bg-white focus:ring-4 focus:ring-[#eaf2fc]"
    />
  </div>
)