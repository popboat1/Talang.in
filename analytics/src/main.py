import json
from pathlib import Path

from load_data import load_data
from metrics import calculate_basic_metrics
from conflict_detection import run_conflict_detection
from insight_generation import generate_insights
from recommendation import generate_recommendations
from health_score import calculate_health_score


BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BASE_DIR / "data" / "outputs"


def dataframe_to_records(df):
    return df.to_dict(orient="records")


def main():
    members, transactions, splits, settlements = load_data()

    metrics = calculate_basic_metrics(
        members,
        transactions,
        splits,
        settlements
    )

    conflicts = run_conflict_detection(
        metrics,
        transactions,
        splits,
        settlements
    )

    insights = generate_insights(conflicts)
    recommendations = generate_recommendations(conflicts)
    health_score = calculate_health_score(conflicts)

    result = {
        "summary": {
            "total_spending": metrics["total_spending"],
            "total_transactions": metrics["total_transactions"]
        },
        "health_score": health_score,
        "conflicts": conflicts,
        "insights": insights,
        "recommendations": recommendations,
        "charts": {
            "spending_by_category": dataframe_to_records(metrics["spending_by_category"]),
            "spending_by_member": dataframe_to_records(metrics["spending_by_member"]),
            "payment_count": dataframe_to_records(metrics["payment_count"]),
            "weekly_trend": dataframe_to_records(metrics["weekly_trend"])
        }
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    output_path = OUTPUT_DIR / "group_analytics_result.json"

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(result, file, indent=2, ensure_ascii=False, default=str)

    print(f"Analytics result saved to: {output_path}")


if __name__ == "__main__":
    main()