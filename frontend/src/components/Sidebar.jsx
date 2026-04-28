import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ReceiptText,
  UsersRound,
  BarChart3,
  UserRound,
  LogOut,
  WalletCards,
} from 'lucide-react'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FECACA',
}

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/transaction',
    label: 'Transaksi',
    icon: ReceiptText,
  },
  {
    to: '/group',
    label: 'Grup',
    icon: UsersRound,
  },
  {
    to: '/report',
    label: 'Laporan',
    icon: BarChart3,
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: UserRound,
  },
]

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>
        {`
          @keyframes sidebarRise {
            from {
              opacity: 0;
              transform: translateX(-16px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes mobileNavRise {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .sidebar-rise {
            animation: sidebarRise .55s cubic-bezier(.2,.8,.2,1) both;
          }

          .mobile-nav-rise {
            animation: mobileNavRise .45s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      {/* Sidebar desktop */}
      <aside
        className="sidebar-rise fixed bottom-0 left-0 top-0 z-40 hidden h-screen w-72 shrink-0 flex-col border-r px-4 py-5 md:flex"
        style={{
          background: colors.background,
          borderColor: colors.border,
        }}
      >
        {/* Brand */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-7 flex items-center gap-3 rounded-[24px] px-3 py-3 text-left transition hover:bg-[#F8FBFF] active:scale-[0.98]"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[20px] shadow-[0_14px_30px_rgba(11,45,85,.16)]"
            style={{
              background: colors.navy,
              color: '#FFFFFF',
            }}
          >
            <WalletCards size={24} />
          </div>

          <div className="min-w-0">
            <h1
              className="text-lg font-black leading-tight tracking-[-0.04em]"
              style={{ color: colors.textDark }}
            >
              Talang.in
            </h1>
            <p className="mt-0.5 text-xs font-bold" style={{ color: colors.textMuted }}>
              Group Finance OS
            </p>
          </div>
        </button>

        {/* Menu */}
        <nav className="flex flex-1 flex-col gap-1.5">
          {navItems.map((item, index) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center gap-3 overflow-hidden rounded-[20px] px-3 py-3 text-sm font-black transition duration-300 active:scale-[0.98]',
                    isActive
                      ? 'shadow-[0_16px_38px_rgba(11,45,85,.16)]'
                      : 'hover:-translate-y-0.5 hover:bg-[#F8FBFF]',
                  ].join(' ')
                }
                style={({ isActive }) => ({
                  background: isActive ? colors.navy : 'transparent',
                  color: isActive ? '#FFFFFF' : colors.textMuted,
                  animationDelay: `${index * 50}ms`,
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                    )}

                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.16)' : colors.soft,
                        color: isActive ? '#FFFFFF' : colors.navySoft,
                      }}
                    >
                      <Icon size={19} />
                    </span>

                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 rounded-[20px] border px-3 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(220,38,38,.12)] active:scale-[0.98]"
          style={{
            background: colors.dangerSoft,
            color: colors.danger,
            borderColor: colors.dangerBorder,
          }}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white transition group-hover:scale-105"
            style={{ color: colors.danger }}
          >
            <LogOut size={19} />
          </span>
          Keluar
        </button>
      </aside>

      {/* Bottom navbar mobile */}
      <nav
        className="mobile-nav-rise fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 px-3 pb-[calc(.55rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(11,45,85,.12)] backdrop-blur-xl md:hidden"
        style={{ borderColor: colors.border }}
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="group flex min-w-0 flex-col items-center justify-center rounded-[18px] px-1 py-2 text-[10px] font-black transition active:scale-95"
                style={({ isActive }) => ({
                  background: isActive ? colors.soft : 'transparent',
                  color: isActive ? colors.navySoft : colors.textMuted,
                })}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="mb-1 flex h-8 w-8 items-center justify-center rounded-2xl transition group-hover:-translate-y-0.5"
                      style={{
                        background: isActive ? colors.navy : 'transparent',
                        color: isActive ? '#FFFFFF' : colors.textMuted,
                      }}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.6 : 2.1} />
                    </span>

                    <span className="max-w-full truncate leading-none">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Sidebar