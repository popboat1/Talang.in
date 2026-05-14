import { Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import GroupPage from '../pages/GroupPage'
import GroupNewPage from '../pages/GroupNewPage'
import GroupDetailPage from '../pages/GroupDetailPage'
import TransactionPage from '../pages/TransactionPage'
import ReportPage from '../pages/ReportPage'
import ProfilePage from '../pages/ProfilePage'
import TransactionHistoryPage from '../pages/TransactionHistoryPage'

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'))
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/group"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/group/new"
        element={
          <ProtectedRoute>
            <GroupNewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/group/:id"
        element={
          <ProtectedRoute>
            <GroupDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaction/history"
        element={
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <TransactionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}