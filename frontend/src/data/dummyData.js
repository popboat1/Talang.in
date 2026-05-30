export const dummyTransactions = [
  { id: 1, group: "Kost Melati", desc: "Beli sabun mandi", amount: 15000, date: "23 Apr", category: "Kebutuhan", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia"], perOrang: 5000 },
  { id: 2, group: "Trip Lombok", desc: "Makan siang", amount: 120000, date: "22 Apr", category: "Makan", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia","Dinda"], perOrang: 30000 },
  { id: 3, group: "Arisan RT", desc: "Iuran bulan ini", amount: 150000, date: "21 Apr", category: "Iuran", paidBy: "Bu Sari", splitWith: ["Fatimah","Bu Sari","Pak Budi"], perOrang: 50000 },
  { id: 4, group: "Kost Melati", desc: "Bayar listrik", amount: 75000, date: "20 Apr", category: "Utilitas", paidBy: "Risna, Fatimah", splitWith: ["Fatimah","Risna","Aulia","Dinda","Maulidacy"], perOrang: 15000 },
]

export const dummyGroups = {
  "Kost Melati": ["Fatimah", "Risna", "Aulia", "Dinda", "Maulidacy"],
  "Trip Lombok": ["Fatimah", "Risna", "Aulia", "Dinda"],
  "Arisan RT": ["Fatimah", "Bu Sari", "Pak Budi"],
}

export const dummyCategories = ["Kebutuhan", "Makan", "Utilitas", "Iuran", "Wisata", "Lainnya"]