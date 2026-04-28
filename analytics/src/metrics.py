import pandas as pd


def calculate_basic_metrics(members, transactions, splits, settlements):
    total_spending = transactions["amount"].sum()
    total_transactions = len(transactions)

    spending_by_category = (
        transactions.groupby("category")["amount"]
        .sum()
        .reset_index()
        .rename(columns={"amount": "total"})
    )

    spending_by_payer = (
        transactions.groupby("paid_by")["amount"]
        .sum()
        .reset_index()
        .rename(columns={"paid_by": "member_id", "amount": "total_paid"})
    )

    payment_count = (
        transactions.groupby("paid_by")
        .size()
        .reset_index(name="payment_count")
        .rename(columns={"paid_by": "member_id"})
    )

    member_share = (
        splits.groupby("member_id")["share_amount"]
        .sum()
        .reset_index()
        .rename(columns={"share_amount": "total_share"})
    )

    settlement_paid = (
        settlements.groupby("from_member")["amount"]
        .sum()
        .reset_index()
        .rename(columns={"from_member": "member_id", "amount": "settlement_paid"})
    )

    settlement_received = (
        settlements.groupby("to_member")["amount"]
        .sum()
        .reset_index()
        .rename(columns={"to_member": "member_id", "amount": "settlement_received"})
    )

    member_summary = members.copy()

    member_summary = member_summary.merge(spending_by_payer, on="member_id", how="left")
    member_summary = member_summary.merge(payment_count, on="member_id", how="left")
    member_summary = member_summary.merge(member_share, on="member_id", how="left")
    member_summary = member_summary.merge(settlement_paid, on="member_id", how="left")
    member_summary = member_summary.merge(settlement_received, on="member_id", how="left")

    member_summary = member_summary.fillna(0)

    member_summary["net_balance"] = (
        member_summary["total_paid"]
        - member_summary["total_share"]
        + member_summary["settlement_received"]
        - member_summary["settlement_paid"]
    )

    member_summary["debt_amount"] = member_summary["net_balance"].apply(
        lambda x: abs(x) if x < 0 else 0
    )

    weekly_trend = (
        transactions.set_index("date")
        .resample("W")["amount"]
        .sum()
        .reset_index()
        .rename(columns={"amount": "total"})
    )

    return {
        "total_spending": int(total_spending),
        "total_transactions": int(total_transactions),
        "spending_by_category": spending_by_category,
        "spending_by_member": member_summary[["member_id", "name", "total_paid"]],
        "payment_count": member_summary[["member_id", "name", "payment_count"]],
        "member_summary": member_summary,
        "weekly_trend": weekly_trend,
    }