def generate_recommendations(conflicts):
    recommendations = []

    added_types = set()

    for conflict in conflicts:
        conflict_type = conflict["type"]

        if conflict_type in added_types:
            continue

        if conflict_type == "payment_imbalance":
            recommendations.append({
                "type": conflict_type,
                "message": (
                    "Disarankan anggota lain menjadi pembayar pada transaksi berikutnya "
                    "agar beban pembayaran lebih seimbang."
                )
            })

        elif conflict_type == "high_debt":
            recommendations.append({
                "type": conflict_type,
                "message": (
                    "Anggota dengan utang tinggi disarankan menyelesaikan sebagian "
                    "utangnya terlebih dahulu."
                )
            })

        elif conflict_type == "overdue_debt":
            recommendations.append({
                "type": conflict_type,
                "message": (
                    "Beberapa utang sudah cukup lama belum dibayar. Grup disarankan "
                    "menyelesaikan utang lama sebelum menambah transaksi baru."
                )
            })

        added_types.add(conflict_type)

    if not recommendations:
        recommendations.append({
            "type": "healthy",
            "message": "Tidak ada rekomendasi khusus. Kondisi grup masih cukup baik."
        })

    return recommendations