import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GroupPage from './pages/GroupPage'
import GroupDetailPage from './pages/GroupDetailPage'
import TransactionPage from './pages/TransactionPage'
import ReportPage from './pages/ReportPage'
import GroupNewPage from './pages/GroupNewPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from "./pages/LandingPage";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
    const navigate = useNavigate()

    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('token', session.access_token)
          localStorage.setItem('user', JSON.stringify(session.user))
          navigate('/dashboard')
        }
      })
      return () => subscription.unsubscribe()
    }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/group" element={<GroupPage />} />
      <Route path="/group/:id" element={<GroupDetailPage />} />
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/group/new" element={<GroupNewPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App