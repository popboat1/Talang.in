import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  Settings,
  Trash2,
  UserPlus,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import {
  addMember,
  getGroupById,
  removeMember,
} from "../services/groupService";
import { getUser } from "../services/authService";
import { getGroups } from '../services/groupSupabaseService'

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const normalizeGroup = (item) => {
  const group = item?.groups || item;

  return {
    id: group?.id,
    name: group?.name || "Tanpa Nama",
    description: group?.description || "Grup patungan aktif.",
    role: item?.role || group?.role || "member",
    memberCount:
      group?.group_members?.[0]?.count ||
      group?.members?.length ||
      group?.memberCount ||
      0,
    members: group?.members || group?.group_members || [],
    totalExpense: group?.totalExpense || group?.total_expense || 0,
    activeDebt: group?.activeDebt || group?.active_debt || 0,
    transactionsCount:
      group?.transactionsCount || group?.transactions_count || 0,
  };
};

const normalizeMember = (member, index) => {
  const user = member?.users || member?.user || member;

  return {
    id: user?.id || member?.user_id || member?.id || index,
    name:
      user?.name ||
      user?.full_name ||
      user?.email?.split("@")[0] ||
      `Anggota ${index + 1}`,
    email: user?.email || member?.email || "-",
    role: member?.role || user?.role || "member",
    totalPaid: member?.totalPaid || member?.total_paid || 0,
    balance: member?.balance || 0,
    status: member?.status || "Netral",
  };
};

export default function GroupPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [error, setError] = useState("");

  const loadGroups = async () => {
    setLoadingGroups(true);
    setError("");

    try {
      const data = await getGroups();
      const formatted = data.map(normalizeGroup);

      setGroups(formatted);

      if (formatted.length > 0) {
        await loadGroupDetail(formatted[0].id, formatted[0]);
      } else {
        setSelectedGroup(null);
        setMembers([]);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data grup");
    } finally {
      setLoadingGroups(false);
    }
  };

  const loadGroupDetail = async (groupId, fallbackGroup = null) => {
    if (!groupId) return;

    setLoadingDetail(true);
    setError("");

    try {
      const detail = await getGroupById(groupId);
      const normalized = normalizeGroup(detail);

      setSelectedGroup({
        ...fallbackGroup,
        ...normalized,
      });

      const rawMembers =
        detail?.members ||
        detail?.group_members ||
        detail?.groups?.members ||
        detail?.groups?.group_members ||
        fallbackGroup?.members ||
        [];

      setMembers(rawMembers.map(normalizeMember));
    } catch (err) {
      console.error(err);

      if (fallbackGroup) {
        setSelectedGroup(fallbackGroup);
        setMembers((fallbackGroup.members || []).map(normalizeMember));
      } else {
        setError("Gagal memuat detail grup");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadGroups();
    };

    init();
  }, []);

  const filteredGroups = useMemo(() => {
    if (!search) return groups;

    return groups.filter((group) =>
      `${group.name} ${group.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [groups, search]);

  const handleAddMember = async () => {
    if (!selectedGroup?.id || !memberEmail) {
      setError("Email anggota wajib diisi");
      return;
    }

    setSavingMember(true);
    setError("");

    try {
      await addMember(selectedGroup.id, memberEmail);
      setMemberEmail("");
      setModalOpen(false);
      await loadGroupDetail(selectedGroup.id, selectedGroup);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menambahkan anggota");
    } finally {
      setSavingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedGroup?.id || !userId) return;

    const confirmDelete = window.confirm("Hapus anggota ini dari grup?");
    if (!confirmDelete) return;

    try {
      await removeMember(selectedGroup.id, userId);
      await loadGroupDetail(selectedGroup.id, selectedGroup);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menghapus anggota");
    }
  };

  const totalMembers = members.length || selectedGroup?.memberCount || 0;

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#1d2939]">
      <style>
        {`
          @keyframes pageRise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes cardRise {
            from { opacity: 0; transform: translateY(14px) scale(.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .group-page-rise {
            animation: pageRise .5s cubic-bezier(.2,.8,.2,1) both;
          }

          .group-card-rise {
            animation: cardRise .45s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar user={user} />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-5 lg:px-6">
            <header className="group-page-rise flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0b3a70]">Grup</p>
                <h1 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#082f5f] sm:text-3xl">
                  Kelola grup patungan
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  Buat grup, kelola anggota, dan pantau ringkasan patungan
                  sebelum mencatat transaksi.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari grup..."
                    className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-white pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#0b3a70] focus:ring-4 focus:ring-[#eaf2fc] sm:w-[320px]"
                  />
                </div>

                <button
                  onClick={() => navigate("/group/new")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(8,47,95,.22)] transition hover:-translate-y-0.5 hover:bg-[#06264d] active:scale-[0.98]"
                >
                  <FolderPlus size={18} />
                  Buat Grup Baru
                </button>
              </div>
            </header>

            {error && (
              <div className="group-page-rise rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <section className="group-page-rise">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-[#082f5f]">
                  Daftar Grup
                </h2>

                <div className="flex items-center gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[#475467]">
                    <ChevronLeft size={18} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[#475467]">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {loadingGroups ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-[176px] animate-pulse rounded-[26px] border border-[#e7edf5] bg-white"
                    />
                  ))}
                </div>
              ) : filteredGroups.length === 0 ? (
                <EmptyGroups onCreate={() => navigate("/group/new")} />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredGroups.map((group, index) => {
                    const active = selectedGroup?.id === group.id;

                    return (
                      <button
                        key={group.id}
                        onClick={() => loadGroupDetail(group.id, group)}
                        className={`group-card-rise rounded-[26px] border bg-white p-5 text-left shadow-[0_14px_34px_rgba(15,39,66,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,39,66,.09)] ${
                          active ? "border-[#082f5f]" : "border-[#e7edf5]"
                        }`}
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <div className="mb-4 h-1 w-24 rounded-full bg-[#082f5f]" />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-black text-[#1d2939]">
                              {group.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#667085]">
                              {group.memberCount || 0} anggota terlibat
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              active
                                ? "bg-[#effaf4] text-[#16844a]"
                                : "bg-[#fff7df] text-[#8a6a00]"
                            }`}
                          >
                            {active ? "Aktif" : "Lihat"}
                          </span>
                        </div>

                        <div className="my-4 h-px bg-[#eef2f7]" />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] font-bold uppercase text-[#667085]">
                              Total exp
                            </p>
                            <p className="mt-1 text-sm font-black text-[#082f5f]">
                              {formatRupiah(group.totalExpense)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-bold uppercase text-[#667085]">
                              Sisa utang
                            </p>
                            <p className="mt-1 text-sm font-black text-[#c02626]">
                              {formatRupiah(group.activeDebt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-[#eaf2fc] px-4 py-3 text-center text-sm font-black text-[#0b3a70]">
                          Lihat Detail
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {!loadingGroups && filteredGroups.length > 0 && (
              <section className="group-page-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-[0_18px_45px_rgba(15,39,66,.06)]">
                {loadingDetail ? (
                  <div className="flex min-h-[320px] items-center justify-center">
                    <Loader2
                      className="animate-spin text-[#082f5f]"
                      size={30}
                    />
                  </div>
                ) : !selectedGroup ? (
                  <EmptyGroups onCreate={() => navigate("/group/new")} />
                ) : (
                  <>
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-black tracking-[-0.03em] text-[#1d2939]">
                            {selectedGroup.name}
                          </h2>

                          <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-black uppercase text-[#0b3a70]">
                            Active
                          </span>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">
                          {selectedGroup.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dfe7f2] bg-white text-[#475467] transition hover:bg-[#f6f8fc]">
                          <Edit3 size={18} />
                        </button>

                        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dfe7f2] bg-white text-[#475467] transition hover:bg-[#f6f8fc]">
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <InfoBox
                        label="Anggota"
                        value={`${totalMembers} Orang`}
                      />
                      <InfoBox
                        label="Transaksi"
                        value={`${selectedGroup.transactionsCount || 0} Data`}
                      />
                      <InfoBox
                        label="Total Pengeluaran"
                        value={formatRupiah(selectedGroup.totalExpense)}
                      />
                      <InfoBox
                        label="Utang Aktif"
                        value={formatRupiah(selectedGroup.activeDebt)}
                        danger
                      />
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-black text-[#1d2939]">
                          Kelola Anggota
                        </h3>
                        <p className="mt-1 text-sm text-[#667085]">
                          Tambahkan anggota agar bisa ikut dalam transaksi
                          patungan.
                        </p>
                      </div>

                      <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#06264d] active:scale-[0.98]"
                      >
                        <UserPlus size={17} />
                        Tambah Anggota
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-[22px] border border-[#e7edf5]">
                      <div className="hidden bg-[#f7f8fc] px-5 py-4 text-xs font-black uppercase text-[#475467] md:grid md:grid-cols-[1.2fr_1.5fr_.8fr_.9fr_.9fr_.7fr_.4fr]">
                        <span>Nama Anggota</span>
                        <span>Email/Username</span>
                        <span>Role</span>
                        <span>Total Bayar</span>
                        <span>Balance</span>
                        <span>Status</span>
                        <span></span>
                      </div>

                      {members.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <UsersRound
                            className="mx-auto text-[#98a2b3]"
                            size={34}
                          />
                          <p className="mt-3 text-sm font-black text-[#1d2939]">
                            Belum ada anggota yang tampil
                          </p>
                          <p className="mt-1 text-sm text-[#667085]">
                            Tambahkan anggota menggunakan email.
                          </p>
                        </div>
                      ) : (
                        members.map((member, index) => (
                          <div
                            key={member.id}
                            className="grid gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm md:grid-cols-[1.2fr_1.5fr_.8fr_.9fr_.9fr_.7fr_.4fr] md:items-center"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf2fc] text-xs font-black text-[#0b3a70]">
                                {member.name.slice(0, 1).toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#1d2939]">
                                {member.name}
                              </span>
                            </div>

                            <span className="text-[#667085]">
                              {member.email}
                            </span>

                            <span className="w-fit rounded-md bg-[#eef2f7] px-2 py-1 text-[10px] font-black uppercase text-[#475467]">
                              {member.role}
                            </span>

                            <span className="text-[#1d2939]">
                              {formatRupiah(member.totalPaid)}
                            </span>

                            <span
                              className={`font-semibold ${
                                member.balance < 0
                                  ? "text-[#c02626]"
                                  : "text-[#16a34a]"
                              }`}
                            >
                              {member.balance < 0 ? "-" : "+"}
                              {formatRupiah(Math.abs(member.balance))}
                            </span>

                            <span
                              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                                member.balance < 0
                                  ? "bg-[#fff7df] text-[#8a6a00]"
                                  : "bg-[#effaf4] text-[#16844a]"
                              }`}
                            >
                              {member.balance < 0 ? "Berutang" : "Menerima"}
                            </span>

                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#667085] transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0f172a]/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,.22)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#1d2939]">
                  Tambah Anggota
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#667085]">
                  Masukkan email anggota yang ingin ditambahkan ke grup.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6f8fc] text-[#475467]"
              >
                <X size={18} />
              </button>
            </div>

            <input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              type="email"
              placeholder="contoh@email.com"
              className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-[#f9fbff] px-4 text-sm font-medium outline-none transition focus:border-[#0b3a70] focus:bg-white focus:ring-4 focus:ring-[#eaf2fc]"
            />

            <button
              onClick={handleAddMember}
              disabled={savingMember}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#082f5f] text-sm font-black text-white transition hover:bg-[#06264d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingMember ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menambahkan...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Tambahkan Anggota
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoBox = ({ label, value, danger = false }) => (
  <div className="rounded-2xl bg-[#f7f8fc] p-5">
    <p className="text-xs font-black uppercase text-[#667085]">{label}</p>
    <p
      className={`mt-2 text-lg font-black ${danger ? "text-[#c02626]" : "text-[#082f5f]"}`}
    >
      {value}
    </p>
  </div>
);

const EmptyGroups = ({ onCreate }) => (
  <div className="rounded-[28px] border border-dashed border-[#cbd8e8] bg-white p-8 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#eaf2fc] text-[#082f5f]">
      <WalletCards size={26} />
    </div>

    <h2 className="mt-4 text-xl font-black tracking-[-0.03em] text-[#082f5f]">
      Kamu belum punya grup patungan
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
      Buat grup pertama untuk mulai mencatat transaksi, membagi tagihan, dan
      memantau balance anggota.
    </p>

    <button
      onClick={onCreate}
      className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <FolderPlus size={18} />
      Buat Grup Baru
    </button>
  </div>
);
