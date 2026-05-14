import {
  BarChart3,
  Bot,
  CheckCircle2,
  ReceiptText,
  Sparkles,
  UsersRound,
} from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'
import { getGroups } from '../services/groupSupabaseService'
import { createTransaction, getTransactions } from '../services/transactionSupabaseService'
import Sidebar from '../components/Sidebar'
import AddManualModal from '../components/AddManualModal'
import AIInputModal from '../components/AIInputModal'
import { createNotification } from '../services/notificationSupabaseService'

const transactionCategories = [
  'Makanan',
  'Transportasi',
  'Akomodasi',
  'Utilitas',
  'Belanja',
  'Hiburan',
  'Iuran',
  'Lainnya',
]

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([])
  const [groups, setGroups] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeInput, setActiveInput] = useState('manual')

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions()

        setTransactions(
          data.map((item) => ({
            id: item.id,
            desc: item.title,
            amount: Number(item.amount || 0),
            category: item.category,
            paidBy: item.paid_by,
          }))
        )
      } catch (error) {
        console.error(error)
      }
    }

    loadTransactions()
  }, [])

  const handleAdd = async (trx) => {
    try {
      setSaving(true)

      const splitWith = trx.splitWith || []
      const amount = Number(trx.amount || 0)
      const perPerson = splitWith.length > 0 ? Math.round(amount / splitWith.length) : amount

      const saved = await createTransaction({
        groupId: trx.groupId || null,
        title: trx.desc || trx.title,
        amount,
        category: trx.category || 'Lainnya',
        paidBy: trx.paidBy,
        date: new Date().toISOString().slice(0, 10),
        participants: splitWith.map((name) => ({
          name,
          amount: perPerson,
        })),
      })

      await createNotification({
  title: `${trx.paidBy} menambahkan transaksi ${trx.desc || trx.title} sebesar ${formatRupiah(amount)}.`,
  type: 'Transaksi',
})

      setTransactions((prev) => [
        {
          id: saved.id,
          desc: saved.title,
          amount: Number(saved.amount || 0),
          category: saved.category,
          paidBy: saved.paid_by,
        },
        ...prev,
      ])

      alert('Transaksi berhasil disimpan')
    } catch (error) {
      console.error(error)
      alert(error.message || 'Gagal menyimpan transaksi')
    } finally {
      setSaving(false)
    }
  }

  const totalAmount = useMemo(() => {
    return transactions.reduce((total, trx) => total + Number(trx.amount || 0), 0)
  }, [transactions])

  const totalGroups = groups.length

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [transactionData, groupData] = await Promise.all([
          getTransactions(),
          getGroups(),
        ])

        setTransactions(
          transactionData.map((item) => ({
            id: item.id,
            desc: item.title,
            amount: Number(item.amount || 0),
            category: item.category,
            paidBy: item.paid_by,
          }))
        )

        setGroups(groupData)
      } catch (error) {
        console.error(error)
        alert('Gagal memuat data dari server')
      } finally {
        setLoadingGroups(false)
      }
    }

    loadInitialData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F3F7FD] font-['Inter',system-ui,sans-serif] text-[#0F2742]">
      <style>
        {`
          @keyframes transactionRise {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .transaction-rise {
            animation: transactionRise .55s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <header className="transaction-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0B2D55]">
                  Tambah Transaksi
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#0B2D55]">
                  Catat transaksi grup
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7890]">
                  Pilih input manual untuk kontrol penuh, atau gunakan AI Smart Input
                  agar transaksi bisa dicatat lebih cepat.
                </p>
              </div>
            </header>
            {saving && (
              <p className="mt-2 text-sm font-bold text-[#0B2D55]">
                Menyimpan transaksi...
              </p>
            )}

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                icon={ReceiptText}
                label="Total Transaksi"
                value={transactions.length}
                sub="Transaksi berhasil tercatat"
              />

              <StatCard
                icon={BarChart3}
                label="Total Pengeluaran"
                value={formatRupiah(totalAmount)}
                sub="Akumulasi transaksi tercatat"
              />

              <StatCard
                icon={UsersRound}
                label="Total Grup"
                value={totalGroups}
                sub="Grup tersedia untuk pencatatan"
              />
            </section>

            <section className="transaction-rise rounded-[32px] border border-[#DDE9F7] bg-white p-4 shadow-[0_18px_45px_rgba(11,45,85,.07)] sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0B2D55]">
                    Metode Input
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#0B2D55]">
                    Pilih cara mencatat transaksi
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7890]">
                    Form yang tidak dipilih akan disembunyikan supaya halaman lebih rapi
                    dan user fokus pada satu cara input.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F3F7FD] p-1">
                  <button
                    type="button"
                    onClick={() => setActiveInput('manual')}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${activeInput === 'manual'
                      ? 'bg-[#0B2D55] text-white shadow-[0_10px_25px_rgba(11,45,85,.20)]'
                      : 'text-[#6B7890] hover:bg-white'
                      }`}
                  >
                    <ReceiptText size={17} />
                    Manual
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveInput('ai')}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${activeInput === 'ai'
                      ? 'bg-[#0B2D55] text-white shadow-[0_10px_25px_rgba(11,45,85,.20)]'
                      : 'text-[#6B7890] hover:bg-white'
                      }`}
                  >
                    <Sparkles size={17} />
                    Smart AI
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <InputInfoCard
                  icon={ReceiptText}
                  title="Input Manual"
                  active={activeInput === 'manual'}
                  description="Isi transaksi dengan detail lengkap seperti nominal, grup, pembayar, kategori, dan anggota."
                  onClick={() => setActiveInput('manual')}
                />

                <InputInfoCard
                  icon={Bot}
                  title="AI Smart Input"
                  active={activeInput === 'ai'}
                  description="Tulis transaksi seperti chat biasa, lalu sistem membantu membaca nominal, pembayar, dan split."
                  onClick={() => setActiveInput('ai')}
                />
              </div>

              <div className="mt-6">
                {activeInput === 'manual' ? (
                  <AddManualModal
                    embedded
                    onAdd={handleAdd}
                    groups={groups}
                    categories={transactionCategories}
                    loadingGroups={loadingGroups}
                  />
                ) : (
                  <AIInputModal embedded onAdd={handleAdd} />
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

const InputInfoCard = ({ icon: Icon, title, description, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 ${active
      ? 'border-[#0B2D55] bg-[#F8FBFF] shadow-[0_14px_35px_rgba(11,45,85,.08)]'
      : 'border-[#DDE9F7] bg-white hover:bg-[#F8FBFF]'
      }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-[#0B2D55] text-white' : 'bg-[#EAF2FC] text-[#0B2D55]'
          }`}
      >
        <Icon size={21} />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-[#0B2D55]">{title}</h3>

          {active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FC] px-2 py-1 text-[10px] font-black text-[#0B2D55]">
              <CheckCircle2 size={12} />
              Dipilih
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-[#6B7890]">{description}</p>
      </div>
    </div>
  </button>
)

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="transaction-rise rounded-[26px] border border-[#DDE9F7] bg-white p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)]">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#0B2D55]">
      <Icon size={22} />
    </div>

    <p className="text-xs font-bold text-[#6B7890]">{label}</p>

    <p className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#0F2742]">
      {value}
    </p>

    <p className="mt-2 text-xs font-semibold leading-5 text-[#6B7890]">
      {sub}
    </p>
  </div>
)

export default TransactionPage