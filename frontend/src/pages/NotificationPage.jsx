import {
    Bell,
    CheckCheck,
    CheckCircle2,
    Mail,
    Search,
    TriangleAlert,
    Wand2,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getUser } from '../services/authService'
import { useEffect, useMemo, useState } from 'react'

import {
    deleteNotification,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from '../services/notificationSupabaseService'

const tabs = ['Semua', 'Transaksi', 'Pembayaran', 'Insight', 'Pengingat']

export default function NotificationPage() {
    const user = getUser()

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Semua')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)

                const data = await getNotifications()

                const formatted = data.map((item) => ({
                    id: item.id,
                    type: item.type || 'Transaksi',
                    title: item.title,
                    time: new Date(item.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }),
                    read: item.is_read || false,
                    urgent: item.urgent || false,
                    action: 'Buka Detail',
                }))

                setNotifications(formatted)
            } catch (error) {
                console.error(error)
                alert('Gagal memuat notifikasi')
            } finally {
                setLoading(false)
            }
        }

        loadNotifications()
    }, [])

    const filtered = useMemo(() => {
        return notifications.filter((item) => {
            const matchTab = activeTab === 'Semua' || item.type === activeTab
            const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
            return matchTab && matchSearch
        })
    }, [notifications, activeTab, search])

    const unreadCount = notifications.filter((item) => !item.read).length

    const markAllRead = async () => {
        try {
            await markAllNotificationsRead()

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    read: true,
                }))
            )
        } catch (error) {
            console.error(error)
        }
    }

    const markRead = async (id) => {
        try {
            await markNotificationRead(id)

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, read: true } : item
                )
            )
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteNotification = async (id) => {
        try {
            await deleteNotification(id)

            setNotifications((prev) =>
                prev.filter((item) => item.id !== id)
            )
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
            <style>
                {`
          @keyframes notifRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .notif-rise {
            animation: notifRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
            </style>

            <div className="flex min-h-screen">
                <Sidebar user={user} />

                <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
                        <header className="notif-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="mt-6 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                                    Notifikasi
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-[#667085]">
                                    Pantau aktivitas penting dari grup patungan kamu.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative w-full sm:w-[320px]">
                                    <Search
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari notifikasi..."
                                        className="h-12 w-full rounded-2xl border border-[#e7edf5] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                                    />
                                </div>

                                <button
                                    onClick={markAllRead}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#082f5f] bg-white px-5 text-sm font-black text-[#082f5f] transition hover:-translate-y-0.5 hover:bg-[#eaf2fc]"
                                >
                                    <CheckCheck size={17} />
                                    Tandai semua sudah dibaca
                                </button>
                            </div>
                        </header>

                        <section className="notif-rise flex gap-2 overflow-x-auto pb-1">
                            {tabs.map((tab) => {
                                const active = activeTab === tab

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition ${active
                                            ? 'bg-[#082f5f] text-white'
                                            : 'bg-[#e9ebef] text-[#667085] hover:bg-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                )
                            })}
                        </section>

                        <section className="notif-rise space-y-3">
                            {loading ? (
                                <div className="rounded-[24px] bg-white px-6 py-10 text-center text-sm font-bold text-[#082f5f]">
                                    Memuat notifikasi...
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#cbd8e8] bg-white px-6 py-14 text-center">
                                    <Bell className="mx-auto text-[#082f5f]" size={34} />
                                    <h2 className="mt-4 text-lg font-black text-[#082f5f]">
                                        Tidak ada notifikasi
                                    </h2>
                                    <p className="mt-2 text-sm text-[#667085]">
                                        Semua aktivitas penting akan muncul di sini.
                                    </p>
                                </div>
                            ) : (
                                filtered.map((item, index) => (
                                    <NotificationItem
                                        key={item.id}
                                        item={item}
                                        delay={index * 55}
                                        onRead={() => markRead(item.id)}
                                        onDelete={() => handleDeleteNotification(item.id)}
                                    />
                                ))
                            )}
                        </section>

                        <section className="notif-rise overflow-hidden rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                            <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
                                <div>
                                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#082f5f]">
                                        Tetap Teratur dengan Talang.in
                                    </h2>

                                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#667085]">
                                        Jangan biarkan transaksi penting terlewat. Gunakan sistem notifikasi
                                        pintar untuk memastikan semua utang dan piutang diselesaikan tepat
                                        waktu bersama teman-temanmu.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#082f5f] shadow-sm ring-1 ring-[#e7edf5]">
                                            <Bell size={17} />
                                            Aktifkan Push
                                        </button>

                                        <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#082f5f] shadow-sm ring-1 ring-[#e7edf5]">
                                            <Mail size={17} />
                                            Ringkasan Email
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-[26px] bg-[#a8dddd] p-6">
                                    <div className="rounded-[24px] bg-[#082f5f] p-5 text-white shadow-[0_18px_45px_rgba(8,47,95,.22)]">
                                        <div className="mb-5 flex items-center justify-between">
                                            <p className="text-sm font-black">Talang.in Report</p>
                                            <Wand2 size={20} />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-4 w-2/3 rounded-full bg-white/25" />
                                            <div className="h-4 w-1/2 rounded-full bg-white/20" />
                                            <div className="mt-5 grid grid-cols-3 gap-3">
                                                <div className="h-20 rounded-2xl bg-white/15" />
                                                <div className="h-28 rounded-2xl bg-white/25" />
                                                <div className="h-16 rounded-2xl bg-white/15" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <p className="text-sm font-semibold text-[#667085]">
                            {unreadCount} notifikasi belum dibaca
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

const NotificationItem = ({ item, onRead, onDelete, delay }) => {
    const Icon = item.urgent
        ? TriangleAlert
        : item.type === 'Insight'
            ? Wand2
            : item.type === 'Pembayaran'
                ? CheckCircle2
                : Bell

    return (
        <div
            className={`notif-rise rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.read ? 'bg-white border-[#e7edf5]' : 'bg-[#eaf2ff] border-[#bdd7ff]'
                } ${item.urgent ? 'border-l-4 border-l-[#c91f1f]' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.urgent
                            ? 'bg-[#ffe4e4] text-[#c91f1f]'
                            : item.read
                                ? 'bg-[#eef0f4] text-[#667085]'
                                : 'bg-[#b8d2ff] text-[#082f5f]'
                        }`}
                >
                    <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p className="text-sm font-black leading-6 text-[#1d2939]">
                            {item.title}
                        </p>

                        <div className="flex shrink-0 items-center gap-3">
                            <span className="text-xs font-bold text-[#082f5f]">
                                {item.time}
                            </span>
                            {!item.read && (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#082f5f]" />
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4">
                        <button
                            onClick={onRead}
                            className="text-sm font-semibold text-[#082f5f] hover:underline"
                        >
                            {item.action}
                        </button>

                        <button
                            onClick={onDelete}
                            className="text-sm font-semibold text-[#667085] hover:text-[#c91f1f]"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}