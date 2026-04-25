import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const user = { name: 'Fatimah' }

const groups = [
  { id: 1, name: 'Kost Melati', memberCount: 5, totalExpense: 120000 },
  { id: 2, name: 'Trip Lombok', memberCount: 8, totalExpense: 450000 },
  { id: 3, name: 'Arisan RT', memberCount: 12, totalExpense: 300000 },
]

const GroupPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-2xl w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-medium">Grup Saya</h1>
          <button className="px-3 py-1.5 rounded-lg text-xs text-white"
            style={{ background: '#0c3460' }}
            onClick={() => navigate('/group/new')}>
            + Buat Grup
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {groups.map((g, i) => (
            <div key={g.id} onClick={() => navigate(`/group/${g.id}`)}
              className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0"
                style={{ background: ['#b5d4f4','#9fe1cb','#f5c4b3'][i % 3], color: ['#0c447c','#085041','#712b13'][i % 3] }}>
                {g.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{g.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{g.memberCount} anggota</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total pengeluaran</p>
                <p className="text-sm font-medium">Rp {g.totalExpense.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GroupPage