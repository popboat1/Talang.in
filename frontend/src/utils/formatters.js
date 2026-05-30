// Format Rupiah
export const formatRupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

// Calculate remaining debt
export const calculateRemaining = (original, paid) => original - paid

// Calculate percentage
export const calculatePercentage = (paid, original) => {
  if (original === 0) return 0
  return Math.round((paid / original) * 100)
}
