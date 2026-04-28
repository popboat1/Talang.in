import { useNavigate } from 'react-router-dom'
import { LogOut, LockKeyhole, ShieldCheck } from 'lucide-react'

import Sidebar from '../components/Sidebar'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileStats from '../components/profile/ProfileStats'
import ProfileInfoCard from '../components/profile/ProfileInfoCard'
import { getUser, logout } from '../services/authService'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F6F9FD',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
        @keyframes profileFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-fade-up {
          animation: profileFadeUp .55s cubic-bezier(.2,.8,.2,1) both;
        }
      `}
      </style>

      {/* Background grid seperti halaman lain */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar user={user} />

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-7">
            <div className="profile-fade-up">
              <ProfileHeader user={user} />
            </div>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
              <div className="flex flex-col gap-5">
                <div className="profile-fade-up" style={{ animationDelay: '80ms' }}>
                  <ProfileStats />
                </div>

                <div className="profile-fade-up" style={{ animationDelay: '140ms' }}>
                  <ProfileInfoCard user={user} />
                </div>
              </div>

              <aside className="profile-fade-up xl:sticky xl:top-7 xl:self-start" style={{ animationDelay: '200ms' }}>
                <section
                  className="rounded-[30px] border bg-white p-5 shadow-[0_16px_45px_rgba(11,45,85,.06)] sm:p-6"
                  style={{ borderColor: colors.border }}
                >
                  <div className="mb-5">
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      <ShieldCheck size={22} />
                    </div>

                    <h2
                      className="text-xl font-black tracking-[-0.035em]"
                      style={{ color: colors.textDark }}
                    >
                      Account Actions
                    </h2>

                    <p
                      className="mt-2 text-sm font-medium leading-6"
                      style={{ color: colors.textMuted }}
                    >
                      Kelola keamanan akun dan sesi login kamu dari sini.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,45,85,.07)] active:scale-[0.98]"
                      style={{
                        background: colors.surface,
                        borderColor: colors.border,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-2xl"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          <LockKeyhole size={18} />
                        </span>

                        <span>
                          <span
                            className="block text-sm font-black"
                            style={{ color: colors.textDark }}
                          >
                            Ubah password
                          </span>
                          <span
                            className="mt-0.5 block text-xs font-semibold"
                            style={{ color: colors.textMuted }}
                          >
                            Placeholder UI untuk fitur keamanan
                          </span>
                        </span>
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(220,38,38,.10)] active:scale-[0.98]"
                      style={{
                        background: colors.dangerSoft,
                        borderColor: '#FECACA',
                        color: colors.danger,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                          <LogOut size={18} />
                        </span>

                        <span>
                          <span className="block text-sm font-black">
                            Logout
                          </span>
                          <span className="mt-0.5 block text-xs font-semibold">
                            Keluar dari sesi akun saat ini
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                </section>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage