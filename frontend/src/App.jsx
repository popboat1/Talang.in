import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GroupPage from './pages/GroupPage'
import GroupDetailPage from './pages/GroupDetailPage'
import TransactionPage from './pages/TransactionPage'
import GroupNewPage from './pages/GroupNewPage'
import ProfilePage from './pages/ProfilePage'
import GroupAnalyticsPage from './pages/GroupAnalyticsPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import BalancePage from './pages/BalancePage'
import SimplifyDebtPage from './pages/SimplifyDebtPage'
import NotificationPage from './pages/NotificationPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/group" element={<GroupPage />} />
      <Route path="/group/:id" element={<GroupDetailPage />} />
      <Route path="/transaction/history" element={<TransactionHistoryPage />} />
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/balance" element={<BalancePage />} />
      <Route path="/simplify-debt" element={<SimplifyDebtPage />} />
      <Route path="/notification" element={<NotificationPage />} />  
      <Route path="/report" element={<GroupAnalyticsPage />} />
      <Route path="/group/new" element={<GroupNewPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/groups/:groupId/analytics" element={<GroupAnalyticsPage />} />
    </Routes>
  )
}

export default App