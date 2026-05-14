import { useMemo, useState } from "react";
import {
  CheckCircle2,
  GitBranch,
  Info,
  RefreshCcw,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { getSimplifiedDebts } from "../services/simplifyDebtService";

const formatRupiah = (value) =>
  `Rp${Number(value || 0).toLocaleString("id-ID")}`;

export default function SimplifyDebtPage() {
  const [initialPayments, setInitialPayments] = useState([]);
  const [optimizedPayments, setOptimizedPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimplifyData = async () => {
      try {
        setLoading(true);

        const data = await getSimplifiedDebts();

        setInitialPayments(data.initialPayments);
        setOptimizedPayments(data.optimizedPayments);
        setMembers(data.members);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat simplify debt");
      } finally {
        setLoading(false);
      }
    };

    loadSimplifyData();
  }, []);

  const [search, setSearch] = useState("");

  const filteredInitial = useMemo(() => {
    return initialPayments.filter((item) =>
      `${item.from} ${item.to} ${item.amount}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, initialPayments]);

  const filteredOptimized = useMemo(() => {
    return optimizedPayments.filter((item) =>
      `${item.from} ${item.to} ${item.amount}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, optimizedPayments]);

  const efficiency = Math.round(
    ((initialPayments.length - optimizedPayments.length) /
      initialPayments.length) *
      100,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] p-10 text-center font-bold text-[#082f5f]">
        Memuat simplify debt...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
      <style>
        {`
          @keyframes simplifyRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .simplify-rise {
            animation: simplifyRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <header className="simplify-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0b3a70]">
                  Simplify Debt
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                  Sederhanakan pembayaran utang
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                  Sistem membantu mengurangi jumlah transfer antar anggota tanpa
                  mengubah total hak dan kewajiban masing-masing.
                </p>
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari anggota atau nominal..."
                  className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-white pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#082f5f] focus:ring-4 focus:ring-[#eaf2fc]"
                />
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SummaryCard
                label="Initial Payments"
                value={initialPayments.length}
                suffix="transaksi"
              />
              <SummaryCard
                label="Optimized Payments"
                value={optimizedPayments.length}
                suffix="transaksi"
                active
              />
              <SummaryCard
                label="Efficiency Gain"
                value={`${efficiency}%`}
                suffix="lebih sedikit transfer"
                orange
              />
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <PaymentTable
                title="Sebelum Disederhanakan"
                icon={GitBranch}
                data={filteredInitial}
              />

              <PaymentTable
                title="Setelah Disederhanakan"
                icon={Sparkles}
                data={filteredOptimized}
                recommended
              />
            </section>

            <section className="simplify-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
              <h2 className="text-center text-sm font-black text-[#475467]">
                Visual Alur Pembayaran Optimal
              </h2>

              <div className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
                {members.map((member, index) => (
                  <div key={member} className="flex items-center gap-6">
                    <MemberNode
                      name={member.name}
                      active={member.balance > 0}
                    />

                    {index < members.length - 1 && (
                      <div className="hidden h-px w-24 border-t border-dashed border-[#cbd8e8] lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="simplify-rise rounded-2xl border border-[#bdd7ff] bg-[#eaf2fc] p-4">
              <div className="flex gap-3">
                <Info size={20} className="mt-0.5 shrink-0 text-[#0b3a70]" />
                <p className="text-sm leading-6 text-[#3b5f93]">
                  Dengan penyederhanaan ini, jumlah transfer antar anggota
                  menjadi lebih sedikit tanpa mengubah total hak dan kewajiban.
                  Cocok digunakan setelah semua transaksi grup tercatat.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dfe7f2] bg-white px-6 text-sm font-black text-[#667085] transition hover:-translate-y-0.5">
                <RefreshCcw size={17} />
                Reset
              </button>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#082f5f] bg-white px-6 text-sm font-black text-[#082f5f] transition hover:-translate-y-0.5">
                Lihat Detail Perhitungan
              </button>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-6 text-sm font-black text-white shadow-[0_14px_32px_rgba(8,47,95,.22)] transition hover:-translate-y-0.5 hover:bg-[#06264d]">
                <CheckCircle2 size={17} />
                Gunakan Rekomendasi
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

const SummaryCard = ({ label, value, suffix, active, orange }) => (
  <div
    className={`simplify-rise rounded-[22px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,39,66,.06)] ${
      active ? "border-t-4 border-t-[#082f5f]" : "border-[#e7edf5]"
    }`}
  >
    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#98a2b3]">
      {label}
    </p>
    <div className="mt-4 flex items-end gap-2">
      <p
        className={`text-4xl font-black tracking-[-0.06em] ${
          orange ? "text-[#e58b4a]" : "text-[#082f5f]"
        }`}
      >
        {value}
      </p>
      <p className="mb-1 text-sm text-[#667085]">{suffix}</p>
    </div>
  </div>
);

const PaymentTable = ({ title, icon: Icon, data, recommended }) => (
  <section
    className={`simplify-rise overflow-hidden rounded-[24px] border bg-white shadow-[0_18px_45px_rgba(15,39,66,.06)] ${
      recommended ? "border-[#082f5f]" : "border-[#e7edf5]"
    }`}
  >
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-[#082f5f]" />
        <h2 className="text-sm font-black text-[#475467]">{title}</h2>
      </div>

      {recommended && (
        <span className="rounded-full bg-[#082f5f] px-3 py-1 text-[10px] font-black text-white">
          Rekomendasi
        </span>
      )}
    </div>

    <div className="bg-[#f7f8fc] px-5 py-3 text-xs font-black uppercase text-[#667085]">
      <div className="grid grid-cols-[1fr_auto]">
        <span>Keterangan</span>
        <span>Jumlah</span>
      </div>
    </div>

    <div className="divide-y divide-[#eef2f7]">
      {data.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[#667085]">
          Tidak ada data pembayaran.
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 text-sm"
          >
            <span className="font-semibold text-[#475467]">
              {item.from} bayar {item.to}
            </span>
            <span className="font-black text-[#082f5f]">
              {formatRupiah(item.amount)}
            </span>
          </div>
        ))
      )}
    </div>
  </section>
);

const MemberNode = ({ name, active }) => (
  <div className="flex flex-col items-center">
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
        active
          ? "border-[#082f5f] bg-[#082f5f] text-white shadow-[0_16px_35px_rgba(8,47,95,.22)]"
          : "border-[#98a2b3] bg-[#f7f8fc] text-[#1d2939]"
      }`}
    >
      <UserRound size={25} />
    </div>
    <p
      className={`mt-3 text-sm font-black ${active ? "text-[#082f5f]" : "text-[#475467]"}`}
    >
      {name}
    </p>
  </div>
);
