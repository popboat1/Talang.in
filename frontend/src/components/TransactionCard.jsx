const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const TransactionCard = ({ trx }) => (
  <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: "rgba(26,79,138,0.08)" }}>
          💳
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-800">{trx.desc}</p>
          <p className="text-[10px] text-gray-400">{trx.group} · {trx.date} · {trx.category}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-gray-800">{formatRupiah(trx.amount)}</p>
    </div>

    <div className="rounded-xl px-3 py-2" style={{ background: "#f8fafc" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-[10px] text-gray-400">Nombok: </span>
          <span className="text-[10px] font-semibold" style={{ color: "#0e7490" }}>{trx.paidBy}</span>
          <span className="text-[10px] text-gray-400"> · {trx.splitWith.length} orang</span>
        </div>
        <p className="text-xs font-bold" style={{ color: "#1a4f8a" }}>{formatRupiah(trx.perOrang)}/org</p>
      </div>
      <div className="flex items-center gap-1">
        {trx.splitWith.map((name) => (
          <div key={name}
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: "#1a4f8a", opacity: 0.75 }}
            title={name}>
            {name[0]}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default TransactionCard