from datetime import datetime


def detect_payment_imbalance(metrics):
    member_summary = metrics["member_summary"]
    total_paid_all = member_summary["total_paid"].sum()

    conflicts = []

    if total_paid_all == 0:
        return conflicts

    for _, row in member_summary.iterrows():
        paid_ratio = row["total_paid"] / total_paid_all

        if paid_ratio >= 0.5:
            conflicts.append({
                "type": "payment_imbalance",
                "member_id": row["member_id"],
                "member_name": row["name"],
                "value": round(paid_ratio * 100, 2),
                "severity": "high" if paid_ratio >= 0.7 else "medium"
            })

    return conflicts


def detect_high_debt(metrics):
    member_summary = metrics["member_summary"]
    conflicts = []

    avg_debt = member_summary["debt_amount"].mean()

    for _, row in member_summary.iterrows():
        if row["debt_amount"] > 0 and row["debt_amount"] >= avg_debt * 1.5:
            conflicts.append({
                "type": "high_debt",
                "member_id": row["member_id"],
                "member_name": row["name"],
                "value": int(row["debt_amount"]),
                "severity": "high"
            })

    return conflicts


def detect_overdue_debt(transactions, splits, settlements, current_date=None):
    if current_date is None:
        current_date = datetime(2026, 4, 20)

    conflicts = []

    merged = splits.merge(
        transactions[["transaction_id", "date", "paid_by"]],
        on="transaction_id",
        how="left"
    )

    for _, row in merged.iterrows():
        if row["member_id"] == row["paid_by"]:
            continue

        days_old = (current_date - row["date"]).days

        if days_old > 7:
            conflicts.append({
                "type": "overdue_debt",
                "member_id": row["member_id"],
                "to_member_id": row["paid_by"],
                "transaction_id": row["transaction_id"],
                "days_overdue": days_old,
                "value": int(row["share_amount"]),
                "severity": "high" if days_old > 14 else "medium"
            })

    return conflicts


def run_conflict_detection(metrics, transactions, splits, settlements):
    conflicts = []

    conflicts.extend(detect_payment_imbalance(metrics))
    conflicts.extend(detect_high_debt(metrics))
    conflicts.extend(detect_overdue_debt(transactions, splits, settlements))

    return conflicts