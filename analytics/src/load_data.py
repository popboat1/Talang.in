import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "dummy"


def load_data():
    members = pd.read_csv(DATA_DIR / "members.csv")
    transactions = pd.read_csv(DATA_DIR / "transactions.csv")
    splits = pd.read_csv(DATA_DIR / "splits.csv")
    settlements = pd.read_csv(DATA_DIR / "settlements.csv")

    transactions["date"] = pd.to_datetime(transactions["date"])
    settlements["date"] = pd.to_datetime(settlements["date"])

    return members, transactions, splits, settlements