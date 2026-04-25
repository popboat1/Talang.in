import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GroupPage from './pages/GroupPage'
import GroupDetailPage from './pages/GroupDetailPage'
import TransactionPage from './pages/TransactionPage'
import ReportPage from './pages/ReportPage'
import GroupNewPage from './pages/GroupNewPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
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