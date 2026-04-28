import { NavLink } from "react-router-dom";

type AppLayoutProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Grup",
    path: "/group",
  },
  {
    label: "Transaksi",
    path: "/transaction",
  },
  {
    label: "Analytics",
    path: "/groups/g1/analytics",
  },
  {
    label: "Profil",
    path: "/profile",
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a4f8a] to-[#071a35] text-lg font-bold text-white shadow-sm">
                T
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Talang.in</h1>
                <p className="text-xs text-slate-500">
                  Smart Group Finance
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-[#1a4f8a] text-white shadow-sm"
                      : "text-slate-600 hover:bg-blue-50 hover:text-[#1a4f8a]",
                  ].join(" ")
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-[#1a4f8a]">
                Group Health
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Pantau kondisi keuangan grup dan cegah konflik sejak awal.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:ml-72">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">
          <div>
            <p className="text-xs text-slate-500">Talang.in</p>
            <h2 className="text-sm font-semibold text-slate-900">
              Group Finance Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-[#1a4f8a] sm:block">
              Grup: Kos Bareng
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1a4f8a] to-[#071a35] text-sm font-bold text-white">
              M
            </div>
          </div>
        </div>
      </header>

      <main className="lg:ml-72">{children}</main>
    </div>
  );
}