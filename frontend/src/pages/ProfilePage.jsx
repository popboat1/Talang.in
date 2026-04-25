import Sidebar from '../components/Sidebar'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileStats from '../components/profile/ProfileStats'
import ProfileInfoCard from '../components/profile/ProfileInfoCard'
import { getUser, logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 flex flex-col gap-4 w-full">
        <ProfileHeader user={user} />
        <ProfileStats />
        <ProfileInfoCard user={user} />
        <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-base font-bold"
            style={{
            background: 'rgba(226, 75, 74, 0.30)',
            border: '1px solid #e24b4a',
            color: '#e24b4a'
            }}>
            Keluar dari akun
        </button>
      </main>
    </div>
  )
}

export default ProfilePage