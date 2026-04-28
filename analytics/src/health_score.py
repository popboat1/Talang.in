def calculate_health_score(conflicts):
    score = 100

    for conflict in conflicts:
        severity = conflict.get("severity", "low")
        conflict_type = conflict.get("type")

        if conflict_type == "payment_imbalance":
            score -= 15 if severity == "medium" else 25

        elif conflict_type == "high_debt":
            score -= 20

        elif conflict_type == "overdue_debt":
            score -= 10 if severity == "medium" else 20

    score = max(0, min(100, score))

    if score >= 80:
        label = "Sehat"
    elif score >= 60:
        label = "Perlu perhatian"
    else:
        label = "Berisiko"

    return {
        "score": score,
        "label": label
    }