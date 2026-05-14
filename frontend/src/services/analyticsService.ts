import { supabase } from './supabaseClient'
import type { AnalyticsResult } from '../types/analytics'

export async function getGroupAnalytics(groupId?: string): Promise<AnalyticsResult> {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      transaction_participants(*)
    `)
    .order('date', { ascending: true })

  if (groupId && groupId !== 'g1') {
    query = query.eq('group_id', groupId)
  }

  const { data, error } = await query

  if (error) throw error

  const transactions = data || []

  const totalSpending = transactions.reduce(
    (sum, trx) => sum + Number(trx.amount || 0),
    0
  )

  const categoryMap: Record<string, number> = {}
  const payerMap: Record<string, number> = {}
  const weeklyMap: Record<string, number> = {}

  transactions.forEach((trx) => {
    const amount = Number(trx.amount || 0)
    const category = trx.category || 'Lainnya'
    const payer = trx.paid_by || 'Tidak diketahui'
    const date = trx.date || trx.created_at?.slice(0, 10)

    categoryMap[category] = (categoryMap[category] || 0) + amount
    payerMap[payer] = (payerMap[payer] || 0) + amount

    if (date) {
      weeklyMap[date] = (weeklyMap[date] || 0) + amount
    }
  })

  const spendingByCategory = Object.entries(categoryMap).map(
    ([category, total]) => ({
      category,
      total,
    })
  )

  const spendingByMember = Object.entries(payerMap).map(
    ([name, total_paid]) => ({
      name,
      total_paid,
    })
  )

  const weeklyTrend = Object.entries(weeklyMap).map(([date, total]) => ({
    date,
    total,
  }))

  const topPayer = spendingByMember.sort(
    (a, b) => b.total_paid - a.total_paid
  )[0]

  const topCategory = spendingByCategory.sort((a, b) => b.total - a.total)[0]

  const insights = []

  if (topPayer && totalSpending > 0 && topPayer.total_paid / totalSpending > 0.6) {
    insights.push({
      type: 'payment_imbalance',
      severity: 'medium',
      message: `${topPayer.name} terlalu sering menjadi pembayar utama. Sebaiknya pembayaran dibuat lebih bergantian agar cashflow grup lebih seimbang.`,
    })
  }

  if (topCategory) {
    insights.push({
      type: 'high_category',
      severity: 'low',
      message: `Kategori ${topCategory.category} menjadi pengeluaran terbesar dengan total ${topCategory.total.toLocaleString('id-ID')}.`,
    })
  }

  if (transactions.length === 0) {
    insights.push({
      type: 'healthy',
      severity: 'low',
      message: 'Belum ada transaksi yang bisa dianalisis.',
    })
  }

  return {
    summary: {
      total_spending: totalSpending,
      total_transactions: transactions.length,
    },
    charts: {
      spending_by_category: spendingByCategory,
      spending_by_member: spendingByMember,
      weekly_trend: weeklyTrend,
    },
    insights,
    recommendations: insights.map((item) => ({
      message: item.message,
    })),
    health_score: {
      score: totalSpending > 0 ? 78 : 100,
      label: totalSpending > 0 ? 'Perlu Dipantau' : 'Belum Ada Risiko',
    },
  } as AnalyticsResult
}