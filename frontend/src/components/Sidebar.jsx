import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  History,
  LayoutDashboard,
  LogOut,
  PlusSquare,
  User,
  Users,
  WalletCards,
  Workflow,
} from 'lucide-react'

import {
  getCurrentUser,
  logoutSupabase,
} from '../services/authSupabaseService'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Grup', path: '/group', icon: Users },
  { label: 'Tambah Transaksi', path: '/transaction', icon: PlusSquare },
  { label: 'Riwayat Transaksi', path: '/transaction/history', icon: History },
  { label: 'Balance/Utang', path: '/balance', icon: WalletCards },
  { label: 'Simplify Debt', path: '/simplify-debt', icon: Workflow },
  { label: 'Insight & Analytics', path: '/report', icon: BarChart3 },
  { label: 'Notifikasi', path: '/notification', icon: Bell },
  { label: 'Profil', path: '/profile', icon: User },
]

export default function Sidebar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(user || null)

  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        setCurrentUser(user)
        return
      }

      try {
        const data = await getCurrentUser()
        setCurrentUser(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadUser()
  }, [user])

  const displayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    currentUser?.name ||
    currentUser?.email?.split('@')[0] ||
    'User'

  const email = currentUser?.email || ''

  const isMenuActive = (path) => {
    if (path === '/transaction') {
      return location.pathname === '/transaction'
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      await logoutSupabase()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login', { replace: true })
    } catch (error) {
      console.error(error)
      alert('Gagal logout')
    }
  }

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[264px] border-r border-[#e6edf5] bg-white shadow-[8px_0_28px_rgba(15,39,66,.04)] md:flex md:flex-col">
        <div className="px-7 pb-7 pt-8">
          <button onClick={() => navigate('/dashboard')} className="text-left">
            <h1 className="text-2xl font-black tracking-[-0.045em] text-[#082f5f]">
              Talang.in
            </h1>
            <p className="mt-1 text-sm font-semibold text-[#475467]">
              Financial Manager
            </p>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isMenuActive(item.path)

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#b8d2ff] text-[#082f5f]'
                    : 'text-[#4b5563] hover:bg-[#f4f7fb] hover:text-[#082f5f]'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={2.2}
                  className={`shrink-0 transition ${
                    isActive
                      ? 'text-[#082f5f]'
                      : 'text-[#4b5563] group-hover:text-[#082f5f]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-[#e6edf5] px-5 py-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-black text-[#082f5f]">
              {displayName.slice(0, 1).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1d2939]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#667085]">
                {email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-[#c91f1f] transition hover:bg-red-50"
          >
            <LogOut size={20} strokeWidth={2.2} />
            Logout
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e6edf5] bg-white/95 px-3 py-2 shadow-[0_-12px_30px_rgba(15,39,66,.08)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = isMenuActive(item.path)

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-bold transition ${
                  isActive
                    ? 'bg-[#b8d2ff] text-[#082f5f]'
                    : 'text-[#667085] hover:bg-[#f4f7fb]'
                }`}
              >
                <Icon size={19} strokeWidth={2.2} />
                <span className="mt-1 line-clamp-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}