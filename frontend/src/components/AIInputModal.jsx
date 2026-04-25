import { useState, useRef, useEffect } from 'react'

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const AIInputModal = ({ onClose, onAdd }) => {
  const idRef = useRef(0)
  useEffect(() => { if (idRef.current === 0) idRef.current = Date.now() }, [])

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleParse = () => {
    if (!text) return
    setLoading(true)
    setTimeout(() => {
      const amount = text.match(/\d+/) ? parseInt(text.match(/\d+/)[0]) * 1000 : 25000
      const members = text.toLowerCase().includes('berdua') ? 2
        : text.toLowerCase().includes('bertiga') ? 3
        : text.toLowerCase().includes('berempat') ? 4 : 2
      const splitWith = ["Fatimah", "Risna", "Aulia", "Dinda"].slice(0, members)
      const paidBy = text.toLowerCase().includes('aku') || text.toLowerCase().includes('saya')
        ? ["Fatimah"] : ["Fatimah", "Risna"].slice(0, text.toLowerCase().includes('kami berdua') ? 2 : 1)
      setResult({
        desc: text.includes('makan') ? 'Makan bersama'
          : text.includes('listrik') ? 'Bayar listrik'
          : text.includes('geprek') ? 'Ayam geprek' : 'Transaksi grup',
        amount,
        group: "Kost Melati",
        paidBy,
        splitWith,
        category: text.includes('makan') || text.includes('geprek') ? 'Makan' : 'Kebutuhan',
        perOrang: Math.round(amount / members),
      })
      setLoading(false)
    }, 1200)
  }

  const handleConfirm = () => {
    if (!result) return
    onAdd({ ...result, paidBy: result.paidBy.join(', '), date: 'Hari ini', id: idRef.current++ })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end lg:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✦</span>
            <p className="text-sm font-semibold text-gray-800">Input AI</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>
        <p className="text-xs text-gray-400 mb-4">Ketik transaksi pakai bahasa natural, AI langsung proses split bill-nya</p>

        <textarea rows={3}
          placeholder={'Contoh:\n"Geprek 75 ribu buat 3 orang, aku yang bayar"\n"Listrik kost 150rb, aku sama Risna yang nombok buat 5 orang"'}
          value={text} onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none mb-3" />

        <button onClick={handleParse} disabled={loading || !text}
          className="w-full h-10 rounded-xl text-sm font-medium text-white mb-4 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}>
          {loading ? '⏳ Memproses...' : '✦ Proses dengan AI'}
        </button>

        {result && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "#f0f4f9", border: "1px solid #e2e8f0" }}>
            <p className="text-xs font-semibold text-gray-600 mb-3">Hasil parsing AI:</p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <p className="text-gray-400 mb-0.5">Deskripsi</p>
                <p className="font-semibold text-gray-800">{result.desc}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Total</p>
                <p className="font-semibold text-gray-800">{formatRupiah(result.amount)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Yang nombok</p>
                <div className="flex gap-1 flex-wrap">
                  {result.paidBy.map(name => (
                    <span key={name} className="px-2 py-0.5 rounded-full text-[10px] text-white"
                      style={{ background: "#0e7490" }}>{name}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Per orang</p>
                <p className="font-semibold" style={{ color: "#1a4f8a" }}>{formatRupiah(result.perOrang)}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-gray-400 text-xs mb-1">Dibagi ke</p>
              <div className="flex gap-1 flex-wrap">
                {result.splitWith.map(name => (
                  <span key={name} className="px-2 py-0.5 rounded-full text-[10px] text-white"
                    style={{ background: "#1a4f8a" }}>{name}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-[10px] text-gray-400 mb-1">Yang perlu bayar ke nombok:</p>
              {result.splitWith.filter(n => !result.paidBy.includes(n)).map(name => (
                <div key={name} className="flex justify-between py-0.5">
                  <span className="text-[10px] text-gray-600">{name} → {result.paidBy.join(' & ')}</span>
                  <span className="text-[10px] font-semibold" style={{ color: "#dc2626" }}>{formatRupiah(result.perOrang)}</span>
                </div>
              ))}
            </div>
            <button onClick={handleConfirm}
              className="w-full mt-3 h-9 rounded-lg text-xs font-medium text-white"
              style={{ background: "#16a34a" }}>
              ✓ Konfirmasi & Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIInputModal