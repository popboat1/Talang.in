import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "recharts";
import {
    Activity,
    BarChart3,
    ChartPie,
    Lightbulb,
    ReceiptText,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    TriangleAlert,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

import type { ReactNode } from "react";
import { getGroupAnalytics } from "../services/analyticsService";
import type { AnalyticsResult } from "../types/analytics";
import Sidebar from "../components/Sidebar";

const colors = {
    navy: "#0B2D55",
    navySoft: "#123F73",
    background: "#F3F7FD",
    card: "#FFFFFF",
    surface: "#F8FBFF",
    soft: "#EAF2FC",
    border: "#DDE9F7",
    textDark: "#0F2742",
    textMuted: "#6B7890",
    success: "#16A34A",
    successSoft: "#F0FDF4",
    warning: "#CA8A04",
    warningSoft: "#FEFCE8",
    danger: "#DC2626",
    dangerSoft: "#FEF2F2",
};

const chartColors = ["#0B2D55", "#123F73", "#2F6FA8", "#6EA8E7", "#9CC3EC"];

function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
}

function getScoreStyle(score: number) {
    if (score >= 80) {
        return {
            background: colors.successSoft,
            color: colors.success,
            borderColor: "#BBF7D0",
            label: "Sehat",
        };
    }

    if (score >= 60) {
        return {
            background: colors.warningSoft,
            color: colors.warning,
            borderColor: "#FEF08A",
            label: "Perlu dipantau",
        };
    }

    return {
        background: colors.dangerSoft,
        color: colors.danger,
        borderColor: "#FECACA",
        label: "Berisiko",
    };
}

function formatShortDate(value: string) {
    const date = new Date(value);

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    });
}

function getReadableInsightTitle(type: string) {
    const titles: Record<string, string> = {
        payment_imbalance: "Pembayaran Tidak Seimbang",
        overdue_debt: "Utang Lama Belum Dibayar",
        high_debt: "Utang Anggota Tinggi",
        healthy: "Kondisi Grup Sehat",
    };

    return titles[type] || type.replaceAll("_", " ");
}

function summarizeInsights(insights: AnalyticsResult["insights"]) {
    const paymentImbalance = insights.find(
        (insight) => insight.type === "payment_imbalance"
    );

    const overdueDebts = insights.filter(
        (insight) => insight.type === "overdue_debt"
    );

    const highDebt = insights.find((insight) => insight.type === "high_debt");

    const summarized = [];

    if (paymentImbalance) {
        summarized.push({
            type: "payment_imbalance",
            severity: paymentImbalance.severity,
            title: "Pembayaran Tidak Seimbang",
            message: paymentImbalance.message,
        });
    }

    if (overdueDebts.length > 0) {
        const days = overdueDebts
            .map((item) => {
                const match = item.message.match(/\d+/);
                return match ? Number(match[0]) : 0;
            })
            .filter((day) => day > 0);

        const maxDays = Math.max(...days);

        summarized.push({
            type: "overdue_debt",
            severity: "high",
            title: "Utang Lama Belum Dibayar",
            message: `Ada ${overdueDebts.length} utang yang belum diselesaikan lebih dari 7 hari. Keterlambatan terlama adalah ${maxDays} hari.`,
        });
    }

    if (highDebt) {
        summarized.push({
            type: "high_debt",
            severity: highDebt.severity,
            title: "Utang Anggota Tinggi",
            message: highDebt.message,
        });
    }

    if (summarized.length === 0) {
        summarized.push({
            type: "healthy",
            severity: "low",
            title: "Kondisi Grup Sehat",
            message: "Kondisi keuangan grup saat ini terlihat cukup seimbang.",
        });
    }

    return summarized.slice(0, 4);
}

const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    delay = 0,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    description: string;
    delay?: number;
}) => (
    <div
        className="analytics-rise rounded-[28px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(11,45,85,.11)]"
        style={{ borderColor: colors.border, animationDelay: `${delay}ms` }}
    >
        <div className="mb-4 flex items-start justify-between gap-3">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: colors.soft, color: colors.navySoft }}
            >
                <Icon size={22} />
            </div>

            <span
                className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                style={{ background: colors.surface, color: colors.textMuted }}
            >
                Aktif
            </span>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.13em]" style={{ color: colors.textMuted }}>
            {label}
        </p>

        <p className="mt-2 break-words text-2xl font-black tracking-[-0.045em]" style={{ color: colors.textDark }}>
            {value}
        </p>

        <p className="mt-2 text-xs font-semibold leading-5" style={{ color: colors.textMuted }}>
            {description}
        </p>
    </div>
);

const ChartCard = ({
    icon: Icon,
    title,
    description,
    children,
    className = "",
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
}) => (
    <section
        className={`analytics-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5 lg:p-6 ${className}`}
        style={{ borderColor: colors.border }}
    >
        <div className="mb-5 flex items-start gap-3">
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: colors.soft, color: colors.navySoft }}
            >
                <Icon size={20} />
            </div>

            <div>
                <h3 className="text-base font-black tracking-[-0.02em] sm:text-lg" style={{ color: colors.textDark }}>
                    {title}
                </h3>
                <p className="mt-1 text-xs font-medium leading-5 sm:text-sm" style={{ color: colors.textMuted }}>
                    {description}
                </p>
            </div>
        </div>

        <div className="h-[280px] sm:h-[320px]">
            {children}
        </div>
    </section>
);

export default function GroupAnalyticsPage() {
    const { groupId } = useParams();
    const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);

    useEffect(() => {
        getGroupAnalytics(groupId || "g1").then(setAnalytics);
    }, [groupId]);

    if (!analytics) {
        return (
            <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
                <style>
                    {`
            @keyframes pulseSoft {
              0%, 100% {
                opacity: .55;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: scale(1.04);
              }
            }

            .loading-pulse {
              animation: pulseSoft 2.2s ease-in-out infinite;
            }
          `}
                </style>

                <div className="pointer-events-none fixed inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
                </div>

                <div className="relative z-10 flex min-h-screen">
                    <Sidebar />

                    <main className="flex min-w-0 flex-1 items-center justify-center px-4 pb-24 md:pl-72 md:pb-8">
                        <div
                            className="rounded-[30px] border bg-white/90 px-8 py-10 text-center shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl"
                            style={{ borderColor: colors.border }}
                        >
                            <div
                                className="loading-pulse mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                                style={{ background: colors.navy }}
                            >
                                <BarChart3 size={26} />
                            </div>

                            <p className="text-sm font-black" style={{ color: colors.textDark }}>
                                Memuat dashboard analytics...
                            </p>
                            <p className="mt-2 text-xs font-semibold" style={{ color: colors.textMuted }}>
                                Mohon tunggu sebentar.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const scoreClass = getScoreColor(analytics.health_score.score);
    const scoreStyle = getScoreStyle(analytics.health_score.score);
    const summarizedInsights = summarizeInsights(analytics.insights);

    return (
        <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
            <style>
                {`
          @keyframes analyticsRise {
            from {
              opacity: 0;
              transform: translateY(22px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes analyticsFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .analytics-rise {
            animation: analyticsRise .68s cubic-bezier(.2,.8,.2,1) both;
          }

          .analytics-float {
            animation: analyticsFloat 6s ease-in-out infinite;
          }
        `}
            </style>

            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
            </div>

            <div className="relative z-10 flex min-h-screen">
                <Sidebar />

                <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-7">
                        <section
                            className="analytics-rise overflow-hidden rounded-[34px] border bg-white/90 p-5 shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl sm:p-6 lg:p-7"
                            style={{ borderColor: colors.border }}
                        >
                            <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="analytics-float flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-white shadow-[0_18px_45px_rgba(11,45,85,.22)] sm:h-16 sm:w-16"
                                        style={{ background: colors.navy }}
                                    >
                                        <BarChart3 size={30} />
                                    </div>

                                    <div className="min-w-0">
                                        <div
                                            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                                            style={{ background: colors.soft, color: colors.navySoft }}
                                        >
                                            Talang.in Analytics
                                        </div>

                                        <h1
                                            className="text-3xl font-black leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl"
                                            style={{ color: colors.textDark }}
                                        >
                                            Group Financial Dashboard
                                        </h1>

                                        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 sm:text-base" style={{ color: colors.textMuted }}>
                                            Pantau kondisi keuangan grup, deteksi potensi konflik, dan lihat rekomendasi agar pembayaran tetap sehat dan transparan.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="rounded-[28px] border p-4"
                                    style={{
                                        background: scoreStyle.background,
                                        borderColor: scoreStyle.borderColor,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: scoreStyle.color }}>
                                                Health Score
                                            </p>

                                            <div className="mt-3 flex items-end gap-2">
                                                <p className="text-5xl font-black tracking-[-0.07em]" style={{ color: scoreStyle.color }}>
                                                    {analytics.health_score.score}
                                                </p>
                                                <p className="pb-2 text-sm font-black" style={{ color: scoreStyle.color }}>
                                                    /100
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-black" style={{ color: scoreStyle.color }}>
                                                {analytics.health_score.label}
                                            </p>
                                        </div>

                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70"
                                            style={{ color: scoreStyle.color }}
                                        >
                                            <ShieldCheck size={24} />
                                        </div>
                                    </div>

                                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${analytics.health_score.score}%`,
                                                background: scoreStyle.color,
                                            }}
                                        />
                                    </div>

                                    <span className={`mt-3 hidden rounded-full border px-3 py-1 text-xs font-black ${scoreClass}`}>
                                        {scoreStyle.label}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <StatCard
                                icon={WalletCards}
                                label="Total Pengeluaran"
                                value={formatCurrency(analytics.summary.total_spending)}
                                description="Total pengeluaran yang tercatat dalam grup."
                                delay={70}
                            />

                            <StatCard
                                icon={ReceiptText}
                                label="Jumlah Transaksi"
                                value={analytics.summary.total_transactions}
                                description="Jumlah transaksi yang masuk ke analytics."
                                delay={140}
                            />

                            <StatCard
                                icon={Activity}
                                label="Status Grup"
                                value={scoreStyle.label}
                                description="Ringkasan kondisi kesehatan finansial grup."
                                delay={210}
                            />
                        </section>

                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <ChartCard
                                icon={ChartPie}
                                title="Pengeluaran per Kategori"
                                description="Kategori dengan pengeluaran terbesar dalam grup."
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={analytics.charts.spending_by_category}
                                            dataKey="total"
                                            nameKey="category"
                                            outerRadius="78%"
                                            label={(entry) => {
                                                const item = entry as { category?: string }
                                                return item.category || ""
                                            }}
                                        >
                                            {analytics.charts.spending_by_category.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={chartColors[index % chartColors.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) =>
                                                formatCurrency(Number(Array.isArray(value) ? value[0] : value))
                                            }
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard
                                icon={BarChart3}
                                title="Pengeluaran per Anggota"
                                description="Anggota yang paling sering menjadi pembayar."
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <ReBarChart data={analytics.charts.spending_by_member}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#DDE9F7" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatCurrency(Number(Array.isArray(value) ? value[0] : value))
                                            }
                                        />
                                        <Bar dataKey="total_paid" fill={colors.navy} radius={[10, 10, 0, 0]} />
                                    </ReBarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </section>

                        <ChartCard
                            icon={TrendingUp}
                            title="Tren Pengeluaran Mingguan"
                            description="Melihat pola naik turun pengeluaran grup dari waktu ke waktu."
                            className="analytics-rise"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <ReLineChart data={analytics.charts.weekly_trend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#DDE9F7" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => formatShortDate(value)}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(Number(Array.isArray(value) ? value[0] : value))
                                        }
                                        labelFormatter={(value) => formatShortDate(String(value))}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke={colors.navy}
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: colors.navy }}
                                        activeDot={{ r: 6 }}
                                    />
                                </ReLineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <section
                                className="analytics-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5 lg:p-6"
                                style={{ borderColor: colors.border }}
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                                        style={{ background: colors.dangerSoft, color: colors.danger }}
                                    >
                                        <TriangleAlert size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black sm:text-lg" style={{ color: colors.textDark }}>
                                            Conflict Insight
                                        </h3>
                                        <p className="mt-1 text-xs font-medium sm:text-sm" style={{ color: colors.textMuted }}>
                                            Ringkasan risiko dan potensi konflik pembayaran.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {summarizedInsights.map((insight, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[22px] border p-4"
                                            style={{
                                                background: insight.type === "healthy" ? colors.successSoft : colors.soft,
                                                borderColor: insight.type === "healthy" ? "#BBF7D0" : colors.border,
                                            }}
                                        >
                                            <p className="text-sm font-black" style={{ color: colors.textDark }}>
                                                {getReadableInsightTitle(insight.type) || insight.title}
                                            </p>
                                            <p className="mt-2 text-sm font-medium leading-7" style={{ color: colors.textMuted }}>
                                                {insight.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section
                                className="analytics-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5 lg:p-6"
                                style={{ borderColor: colors.border }}
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                                        style={{ background: colors.soft, color: colors.navySoft }}
                                    >
                                        <Lightbulb size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black sm:text-lg" style={{ color: colors.textDark }}>
                                            Recommendation
                                        </h3>
                                        <p className="mt-1 text-xs font-medium sm:text-sm" style={{ color: colors.textMuted }}>
                                            Saran praktis untuk menjaga pembayaran grup tetap sehat.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {analytics.recommendations.slice(0, 3).map((recommendation, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[22px] border p-4"
                                            style={{ background: colors.surface, borderColor: colors.border }}
                                        >
                                            <div className="mb-2 flex items-center gap-2">
                                                <span
                                                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white"
                                                    style={{ background: colors.navy }}
                                                >
                                                    {index + 1}
                                                </span>

                                                <p className="text-sm font-black" style={{ color: colors.textDark }}>
                                                    Saran {index + 1}
                                                </p>
                                            </div>

                                            <p className="text-sm font-medium leading-7" style={{ color: colors.textMuted }}>
                                                {recommendation.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}