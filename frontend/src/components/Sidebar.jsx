import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
  )},
  { to: '/transaction', label: 'Transaksi', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  )},
  { to: '/group', label: 'Grup', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13V6l6-3 6 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
  )},
  { to: '/report', label: 'Laporan', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  )},
  { to: '/profile', label: 'Profil', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 13c0-3.333 2.667-6 6-6s6 2.667 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  )},
]

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-52 min-h-screen flex-shrink-0 px-3 py-5 gap-1"
        style={{ background: 'linear-gradient(160deg, #0c3460 0%, #071a35 60%, #030d1a 100%)' }}>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="rgba(200,218,245,0.8)" strokeWidth="1.2"/><path d="M4 7h6M7 4v6" stroke="rgba(200,218,245,0.8)" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <span className="text-sm font-medium" style={{ color: '#c8daf5' }}>Talang.in</span>
        </div>



        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-blue-200/60 hover:text-blue-100'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'rgba(255,255,255,0.1)' } : {}}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <button onClick={() => navigate('/')}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-200/60 hover:text-blue-100 transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Keluar
        </button>
      </aside>

      {/* Bottom navbar mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-14 border-t"
        style={{ background: '#071a35', borderColor: 'rgba(255,255,255,0.1)' }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs transition-all ${
                isActive ? 'text-white' : 'text-blue-200/50'
              }`
            }>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar