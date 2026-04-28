def calculate_health_score(conflicts):
    score = 100

    conflict_types = {conflict.get("type") for conflict in conflicts}

    if "payment_imbalance" in conflict_types:
        score -= 25

    if "high_debt" in conflict_types:
        score -= 25

    if "overdue_debt" in conflict_types:
        score -= 30

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