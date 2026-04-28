def generate_insights(conflicts):
    insights = []

    for conflict in conflicts:
        conflict_type = conflict["type"]

        if conflict_type == "payment_imbalance":
            insights.append({
                "type": conflict_type,
                "severity": conflict["severity"],
                "message": (
                    f"{conflict['member_name']} terlalu sering menjadi pembayar utama "
                    f"dalam grup dengan kontribusi pembayaran sekitar {conflict['value']}%."
                )
            })

        elif conflict_type == "high_debt":
            insights.append({
                "type": conflict_type,
                "severity": conflict["severity"],
                "message": (
                    f"{conflict['member_name']} memiliki jumlah utang yang cukup tinggi "
                    f"dibanding anggota lain."
                )
            })

        elif conflict_type == "overdue_debt":
            insights.append({
                "type": conflict_type,
                "severity": conflict["severity"],
                "message": (
                    f"Terdapat utang yang belum diselesaikan selama "
                    f"{conflict['days_overdue']} hari."
                )
            })

    if not insights:
        insights.append({
            "type": "healthy",
            "severity": "low",
            "message": "Kondisi keuangan grup saat ini terlihat cukup seimbang."
        })

    return insights