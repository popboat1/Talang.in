import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    BarChart as ReBarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'
import {
    Bell,
    Clock3,
    Lightbulb,
    Search,
    TrendingUp,
    TriangleAlert,
    UserRound,
    Utensils,
    WalletCards,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getGroupAnalytics } from '../services/analyticsService'
import type { AnalyticsResult } from '../types/analytics'
import { getUser } from '../services/authService'

const colors = {
    navy: '#082f5f',
    navySoft: '#0b3a70',
    background: '#f6f8fc',
    card: '#ffffff',
    soft: '#eaf2fc',
    border: '#e7edf5',
    muted: '#667085',
    danger: '#c91f1f',
    warning: '#8a4b00',
}

const chartColors = ['#082f5f', '#3b5f93', '#9ec5ff', '#d7dbe5']

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)

const formatShortCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
    if (value >= 1000) return `${Math.round(value / 1000)}K`
    return String(value || 0)
}

const formatDate = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
    })
}

const getInsightTitle = (type: string) => {
    const titles: Record<string, string> = {
        payment_imbalance: 'Pembayar Tidak Seimbang',
        overdue_debt: 'Utang Lama Belum Selesai',
        high_debt: 'Utang Menumpuk',
        healthy: 'Kondisi Grup Sehat',
    }

    return titles[type] || type.replaceAll('_', ' ')
}

const getSummaryInsights = (insights: AnalyticsResult['insights']) => {
    const result = insights.slice(0, 3)

    if (result.length === 0) {
        return [
            {
                type: 'healthy',
                severity: 'low',
                message: 'Kondisi patungan grup terlihat cukup sehat dan tidak ada potensi masalah besar.',
            },
        ]
    }

    return result
}

export default function GroupAnalyticsPage() {
    const user = getUser()
    const { groupId } = useParams()
    const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('Bulanan')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await getGroupAnalytics(groupId || 'g1')
                setAnalytics(data)
            } catch (error) {
                console.error('Gagal memuat analytics:', error)
            } finally {
                setLoading(false)
            }
        }

        loadAnalytics()
    }, [groupId])

    const biggestCategory = useMemo(() => {
        if (!analytics?.charts.spending_by_category?.length) return null

        return analytics.charts.spending_by_category.reduce((max, item) =>
            item.total > max.total ? item : max
        )
    }, [analytics])

    const topPayer = useMemo(() => {
        if (!analytics?.charts.spending_by_member?.length) return null

        return analytics.charts.spending_by_member.reduce((max, item) =>
            item.total_paid > max.total_paid ? item : max
        )
    }, [analytics])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f8fc]">
                <div className="flex min-h-screen">
                    <Sidebar user={user} />
                    <main className="flex flex-1 items-center justify-center md:pl-[264px]">
                        <div className="rounded-[28px] bg-white px-8 py-10 text-center shadow-[0_18px_45px_rgba(15,39,66,.08)]">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#eaf2fc] border-t-[#082f5f]" />
                            <p className="font-black text-[#082f5f]">Memuat analytics...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-[#f6f8fc]">
                <div className="flex min-h-screen">
                    <Sidebar user={user} />
                    <main className="flex flex-1 items-center justify-center md:pl-[264px]">
                        <p className="font-bold text-[#667085]">Data analytics belum tersedia.</p>
                    </main>
                </div>
            </div>
        )
    }

    const insights = getSummaryInsights(analytics.insights)

    return (
        <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
            <style>
                {`
          @keyframes analyticsRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .analytics-rise {
            animation: analyticsRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
            </style>

            <div className="flex min-h-screen">
                <Sidebar user={user} />

                <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
                        <header className="analytics-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full lg:w-[520px]">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari data..."
                                    className="h-12 w-full rounded-2xl border border-[#e7edf5] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#082f5f] shadow-sm">
                                    <Bell size={18} />
                                </button>

                                <div className="hidden h-8 w-px bg-[#dfe7f2] sm:block" />

                                <div className="text-right">
                                    <p className="text-sm font-black text-[#082f5f]">Insight & Analytics</p>
                                    <p className="text-xs text-[#667085]">Pantau kondisi grup</p>
                                </div>
                            </div>
                        </header>

                        <section className="analytics-rise flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                                    Insight & Analytics
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-[#667085]">
                                    Pahami pola pengeluaran, kondisi utang, dan potensi konflik dalam grup.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-1 shadow-sm">
                                {['Mingguan', 'Bulanan', 'Custom'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setPeriod(item)}
                                        className={`rounded-xl px-4 py-2 text-sm font-black transition ${period === item
                                                ? 'bg-[#eaf2fc] text-[#082f5f]'
                                                : 'text-[#667085] hover:bg-[#f6f8fc]'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                title="Total Pengeluaran"
                                value={formatCurrency(analytics.summary.total_spending)}
                                icon={WalletCards}
                                note={`${analytics.summary.total_transactions} transaksi tercatat`}
                                danger
                            />

                            <MetricCard
                                title="Kategori Terbesar"
                                value={biggestCategory ? `${biggestCategory.category}` : '-'}
                                icon={Utensils}
                                note={biggestCategory ? `${formatCurrency(biggestCategory.total)} total pengeluaran` : 'Belum ada data'}
                            />

                            <MetricCard
                                title="Pembayar Teraktif"
                                value={topPayer?.name || '-'}
                                icon={UserRound}
                                note={topPayer ? `${formatCurrency(topPayer.total_paid)} dibayarkan` : 'Belum ada data'}
                            />

                            <MetricCard
                                title="Health Score"
                                value={`${analytics.health_score.score}/100`}
                                icon={Clock3}
                                note={analytics.health_score.label}
                                danger={analytics.health_score.score < 70}
                            />
                        </section>

                        <section className="grid gap-5 xl:grid-cols-2">
                            <ChartPanel title="Kategori Pengeluaran">
                                <div className="grid h-full gap-4 md:grid-cols-[1fr_180px] md:items-center">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <RePieChart>
                                            <Pie
                                                data={analytics.charts.spending_by_category}
                                                dataKey="total"
                                                nameKey="category"
                                                innerRadius={58}
                                                outerRadius={90}
                                                paddingAngle={3}
                                            >
                                                {analytics.charts.spending_by_category.map((_, index) => (
                                                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        </RePieChart>
                                    </ResponsiveContainer>

                                    <div className="space-y-3">
                                        {analytics.charts.spending_by_category.map((item, index) => (
                                            <div key={item.category} className="flex items-center gap-2 text-sm">
                                                <span
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ background: chartColors[index % chartColors.length] }}
                                                />
                                                <span className="text-[#667085]">{item.category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ChartPanel>

                            <ChartPanel title="Pengeluaran per Anggota">
                                <div className="space-y-5">
                                    {analytics.charts.spending_by_member.map((member) => {
                                        const max = Math.max(...analytics.charts.spending_by_member.map((m) => m.total_paid))
                                        const width = max ? (member.total_paid / max) * 100 : 0

                                        return (
                                            <div key={member.name}>
                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                    <span className="font-semibold text-[#475467]">{member.name}</span>
                                                    <span className="font-black text-[#1d2939]">
                                                        {formatCurrency(member.total_paid)}
                                                    </span>
                                                </div>
                                                <div className="h-3 rounded-full bg-[#edf1f7]">
                                                    <div
                                                        className="h-full rounded-full bg-[#082f5f]"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ChartPanel>
                        </section>

                        <ChartPanel title="Tren Pengeluaran Mingguan" tall>
                            <ResponsiveContainer width="100%" height="100%">
                                <ReLineChart data={analytics.charts.weekly_trend}>
                                    <CartesianGrid stroke="#e7edf5" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => formatDate(String(value))}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(Number(value))}
                                        labelFormatter={(value) => formatDate(String(value))}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#082f5f"
                                        strokeWidth={4}
                                        dot={{ r: 5, fill: '#082f5f' }}
                                        activeDot={{ r: 7 }}
                                    />
                                </ReLineChart>
                            </ResponsiveContainer>
                        </ChartPanel>

                        <section>
                            <h2 className="mb-4 text-lg font-black text-[#1d2939]">
                                Deteksi Potensi Masalah
                            </h2>

                            <div className="grid gap-4 lg:grid-cols-3">
                                {insights.map((item, index) => (
                                    <ProblemCard
                                        key={index}
                                        title={getInsightTitle(item.type)}
                                        message={item.message}
                                    />
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-[#bdd7ff] bg-[#eaf2fc] p-5">
                            <div className="flex gap-3">
                                <Lightbulb className="mt-0.5 shrink-0 text-[#082f5f]" size={20} />
                                <p className="text-sm leading-6 text-[#3b5f93]">
                                    Distribusi pembayaran dalam grup belum seimbang jika satu anggota terlalu
                                    sering menjadi pembayar utama. Gunakan insight ini untuk menjaga cashflow
                                    antar anggota tetap adil.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-black text-[#1d2939]">
                                Rekomendasi Cerdas
                            </h2>

                            <div className="space-y-3">
                                {analytics.recommendations.slice(0, 3).map((recommendation, index) => (
                                    <button
                                        key={index}
                                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#dfe7f2] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f4f9] text-[#082f5f]">
                                                <Lightbulb size={19} />
                                            </div>
                                            <p className="text-sm leading-6 text-[#475467]">
                                                {recommendation.message}
                                            </p>
                                        </div>

                                        <span className="text-xl text-[#667085]">›</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}

const MetricCard = ({
    title,
    value,
    icon: Icon,
    note,
    danger = false,
}: {
    title: string
    value: string
    icon: React.ElementType
    note: string
    danger?: boolean
}) => (
    <div className="analytics-rise rounded-[24px] border border-[#e7edf5] bg-white p-5 shadow-[0_14px_34px_rgba(15,39,66,.06)]">
        <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#667085]">{title}</p>
            <Icon size={20} className={danger ? 'text-[#c91f1f]' : 'text-[#082f5f]'} />
        </div>

        <p className="text-2xl font-black tracking-[-0.04em] text-[#082f5f]">
            {value}
        </p>

        <p className={`mt-2 text-sm font-semibold ${danger ? 'text-[#c91f1f]' : 'text-[#667085]'}`}>
            {note}
        </p>
    </div>
)

const ChartPanel = ({
    title,
    children,
    tall = false,
}: {
    title: string
    children: React.ReactNode
    tall?: boolean
}) => (
    <section className="analytics-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
        <h2 className="mb-5 text-base font-black text-[#1d2939]">{title}</h2>
        <div className={tall ? 'h-[360px]' : 'min-h-[260px]'}>
            {children}
        </div>
    </section>
)

const ProblemCard = ({ title, message }: { title: string; message: string }) => (
    <div className="analytics-rise rounded-[24px] border-l-4 border-l-[#c91f1f] bg-white p-5 shadow-[0_14px_34px_rgba(15,39,66,.06)]">
        <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 shrink-0 text-[#c91f1f]" size={20} />
            <div>
                <h3 className="text-sm font-black text-[#1d2939]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{message}</p>
            </div>
        </div>
    </div>
)