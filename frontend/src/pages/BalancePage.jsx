import { useEffect, useMemo, useState } from 'react'
import {
    Bell,
    CheckCircle2,
    Eye,
    Loader2,
    Search,
    Send,
    ShieldCheck,
    WalletCards,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getUser } from '../services/authService'
import { getBalanceData } from '../services/balanceService'

const formatRupiah = (value) =>
    `Rp${Number(value || 0).toLocaleString('id-ID')}`

const fallbackData = {
    summary: {
        totalActiveDebt: 320000,
        debtors: 2,
        receivers: 2,
        pendingConfirmation: 185000,
    },
    members: [
        { id: 1, name: 'Ayu', status: 'Menerima', balance: 280000 },
        { id: 2, name: 'Raka', status: 'Membayar', balance: -95000 },
        { id: 3, name: 'Nina', status: 'Menerima', balance: 40000 },
        { id: 4, name: 'Budi', status: 'Membayar', balance: -225000 },
    ],
    settlements: [
        {
            id: 1,
            from: 'Raka',
            to: 'Ayu',
            amount: 95000,
            transaction: 'Makan Malam',
            status: 'Belum dibayar',
        },
        {
            id: 2,
            from: 'Budi',
            to: 'Ayu',
            amount: 185000,
            transaction: 'Belanja Bulanan',
            status: 'Menunggu konfirmasi',
        },
    ],
}

export default function BalancePage() {
    const user = getUser()

    const [data, setData] = useState(fallbackData)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const loadBalance = async () => {
            try {
                setLoading(true)
                const result = await getBalanceData()
                setData(result)
            } catch (error) {
                console.error(error)
                alert('Gagal memuat data balance')
            } finally {
                setLoading(false)
            }
        }
        loadBalance()
    }, [])

    const filteredSettlements = useMemo(() => {
        return data.settlements.filter((item) =>
            `${item.from} ${item.to} ${item.transaction} ${item.status}`
                .toLowerCase()
                .includes(search.toLowerCase())
        )
    }, [data.settlements, search])

    return (
        <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
            <style>
                {`
          @keyframes balanceRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .balance-rise {
            animation: balanceRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
            </style>

            <div className="flex min-h-screen">
                <Sidebar user={user} />

                <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
                        <header className="balance-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full lg:w-[520px]">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari transaksi atau anggota..."
                                    className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-white pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#082f5f] shadow-sm">
                                    <Bell size={19} />
                                </button>

                                <div className="hidden h-8 w-px bg-[#dfe7f2] sm:block" />

                                <h1 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                                    Balance / Utang
                                </h1>
                            </div>
                        </header>

                        <section className="balance-rise">
                            <h2 className="text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                                Balance / Utang
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#667085]">
                                Lihat ringkasan siapa harus bayar ke siapa secara transparan.
                            </p>
                        </section>

                        {loading ? (
                            <div className="flex min-h-[360px] items-center justify-center rounded-[28px] bg-white">
                                <Loader2 className="animate-spin text-[#082f5f]" size={34} />
                            </div>
                        ) : (
                            <>
                                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <SummaryCard
                                        label="Total Utang Aktif"
                                        value={formatRupiah(data.summary.totalActiveDebt)}
                                    />
                                    <SummaryCard
                                        label="Anggota Berutang"
                                        value={`${data.summary.debtors} Orang`}
                                        danger
                                    />
                                    <SummaryCard
                                        label="Anggota Menerima"
                                        value={`${data.summary.receivers} Orang`}
                                        blue
                                    />
                                    <SummaryCard
                                        label="Menunggu Konfirmasi"
                                        value={formatRupiah(data.summary.pendingConfirmation)}
                                        warning
                                    />
                                </section>

                                <section className="balance-rise">
                                    <h2 className="mb-4 text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                                        Saldo Anggota
                                    </h2>

                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        {data.members.map((member) => (
                                            <MemberCard key={member.id} member={member} />
                                        ))}
                                    </div>
                                </section>

                                <section className="balance-rise overflow-hidden rounded-[28px] border border-[#e7edf5] bg-white shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                                    <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                                        <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                                            Daftar Penyelesaian Pembayaran
                                        </h2>

                                        <button className="rounded-2xl bg-[#082f5f] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#06264d]">
                                            Export Report
                                        </button>
                                    </div>

                                    <div className="hidden grid-cols-[.8fr_.8fr_.9fr_1.3fr_1fr_.8fr] bg-[#f2f2f7] px-5 py-4 text-xs font-black uppercase text-[#475467] md:grid">
                                        <span>Dari</span>
                                        <span>Ke</span>
                                        <span>Nominal</span>
                                        <span>Terkait Transaksi</span>
                                        <span>Status</span>
                                        <span>Aksi</span>
                                    </div>

                                    {filteredSettlements.length === 0 ? (
                                        <div className="px-5 py-12 text-center">
                                            <WalletCards className="mx-auto text-[#082f5f]" size={34} />
                                            <p className="mt-3 text-sm font-black text-[#1d2939]">
                                                Tidak ada data pembayaran
                                            </p>
                                        </div>
                                    ) : (
                                        filteredSettlements.map((item) => (
                                            <SettlementRow key={item.id} item={item} />
                                        ))
                                    )}

                                    <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-[#667085]">
                                            Menampilkan {filteredSettlements.length} dari {data.settlements.length} penyelesaian
                                        </p>

                                        <div className="flex gap-2">
                                            <button className="rounded-xl border border-[#dfe7f2] px-4 py-2 text-sm font-medium text-[#667085]">
                                                Sebelumnya
                                            </button>
                                            <button className="rounded-xl border border-[#dfe7f2] px-4 py-2 text-sm font-medium text-[#667085]">
                                                Berikutnya
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

const SummaryCard = ({ label, value, danger, blue, warning }) => (
    <div className="balance-rise rounded-[22px] border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(15,39,66,.06)]">
        <p className="text-xs font-semibold text-[#475467]">{label}</p>
        <p
            className={`mt-3 text-2xl font-black tracking-[-0.04em] ${danger
                    ? 'text-[#c91f1f]'
                    : warning
                        ? 'text-[#7a3a00]'
                        : blue
                            ? 'text-[#3b5f93]'
                            : 'text-[#082f5f]'
                }`}
        >
            {value}
        </p>
    </div>
)

const MemberCard = ({ member }) => {
    const isDebt = member.balance < 0

    return (
        <div className="balance-rise rounded-[22px] border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(15,39,66,.06)]">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf2fc] text-sm font-black text-[#082f5f]">
                    {member.name.slice(0, 1)}
                </div>
                <p className="font-semibold text-[#1d2939]">{member.name}</p>
            </div>

            <p className="mt-5 text-sm text-[#667085]">{member.status}</p>
            <p
                className={`mt-1 text-xl font-black tracking-[-0.03em] ${isDebt ? 'text-[#c91f1f]' : 'text-[#3b5f93]'
                    }`}
            >
                {formatRupiah(Math.abs(member.balance))}
            </p>
        </div>
    )
}

const SettlementRow = ({ item }) => (
    <div className="grid gap-4 border-t border-[#eef2f7] px-5 py-4 text-sm md:grid-cols-[.8fr_.8fr_.9fr_1.3fr_1fr_.8fr] md:items-center">
        <Person name={item.from} color="red" />
        <Person name={item.to} color="blue" />

        <p className="font-black text-[#082f5f]">{formatRupiah(item.amount)}</p>
        <p className="text-[#475467]">{item.transaction}</p>

        <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${item.status === 'Belum dibayar'
                    ? 'bg-[#ffe4e4] text-[#b91c1c]'
                    : 'bg-[#ffedd5] text-[#9a3412]'
                }`}
        >
            {item.status}
        </span>

        <div className="flex items-center gap-4 text-[#082f5f]">
            <CheckCircle2 size={20} />
            <Send size={19} />
            <Eye size={20} />
            {item.status !== 'Belum dibayar' && (
                <ShieldCheck size={20} className="text-[#16a34a]" />
            )}
        </div>
    </div>
)

const Person = ({ name, color }) => (
    <div className="flex items-center gap-2">
        <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${color === 'red'
                    ? 'bg-[#ffe4e4] text-[#c91f1f]'
                    : 'bg-[#dbeafe] text-[#0b3a70]'
                }`}
        >
            {name.slice(0, 1)}
        </span>
        <span className="font-medium text-[#475467]">{name}</span>
    </div>
)