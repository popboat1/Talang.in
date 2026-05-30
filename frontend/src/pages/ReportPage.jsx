import Sidebar from '../components/Sidebar'

const user = { name: 'Fatimah' }

const ReportPage = () => {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />
      <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
        <div className="text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Dashboard Analitik
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Halaman ini akan diisi oleh tim Data Scientist
          </p>
        </div>
      </main>
    </div>
  )
}

export default ReportPage