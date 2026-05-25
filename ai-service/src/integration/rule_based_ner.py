import re


# Pattern untuk mendeteksi harga informal.
# Ini dipakai sebagai fallback jika model NER belum menangkap entity tertentu.
PRICE_PATTERN = re.compile(
    r"\brp\.?\s*\d+(?:[.,]\d+)*\b|"                 # rp 45.500, rp15000
    r"\b\d+(?:[.,]\d+)*\s*(?:k|rb|ribu|rebu|jt|juta)\b|" # 150k, 150 rb
    r"\b\d{3,}(?:[.,]\d{3})*\b|"                     # 15000, 45.500
    r"goceng|seceng|cenggo|noceng|ceban|seceban|noban|cepek|satu cepek",
    re.IGNORECASE,
)


# Pattern untuk mendeteksi jumlah orang/porsi.
# Contoh: x4, 4 orang, 6 kepala, 2 porsi.
MULTIPLIER_PATTERN = re.compile(
    r"\bx\d+\b|\b\d+\s*(orang|kepala|porsi)\b",
    re.IGNORECASE,
)


def predict_entities_rule_based(text: str, group_members=None):
    """
    Fallback sederhana untuk mengambil entity dari teks.

    Fungsi ini dipakai jika:
    1. model NER gagal diload
    2. model NER belum menangkap beberapa entity
    3. ada nama anggota grup yang terlewat oleh model

    Output dibuat sama seperti hasil model:
    [
      {"text": "...", "label": "PERSON", "start": 0, "end": 3}
    ]
    """
    entities = []
    group_members = group_members or []

    for member in group_members:
        pattern = re.compile(rf"\b{re.escape(member)}\b", re.IGNORECASE)
        for match in pattern.finditer(text):
            entities.append({
                "text": match.group(), "label": "PERSON",
                "start": match.start(), "end": match.end(),
            })

    bullet_pattern = re.compile(
        r"(?:^|\n)\s*[\-\*]\s*(?:(?P<name>[a-zA-Z]+)\s+pesen\s+)?(?:(?P<qty>\d+)\s+)?(?P<item>[a-zA-Z\s]+?)(?=\s+(?:rp\.?|@)?\s*\d|\s+untuk|\s+buat|$)",
        re.IGNORECASE
    )
    for match in bullet_pattern.finditer(text):
        item_text = match.group("item").strip(" .,-:*")
        if item_text and len(item_text) >= 2:
            entities.append({
                "text": item_text, "label": "ITEM",
                "start": match.start("item"), "end": match.end("item"),
            })
        # Ubah prefix angka list menjadi MULTIPLIER resmi
        if match.group("qty"):
            entities.append({
                "text": match.group("qty"), "label": "MULTIPLIER",
                "start": match.start("qty"), "end": match.end("qty"),
            })

    # 3. Deteksi PRICE
    for match in PRICE_PATTERN.finditer(text):
        entities.append({
            "text": match.group().strip(), "label": "PRICE",
            "start": match.start(), "end": match.end(),
        })

    # 4. Deteksi MULTIPLIER Suffix (x5, dsb)
    for match in MULTIPLIER_PATTERN.finditer(text):
        entities.append({
            "text": match.group(), "label": "MULTIPLIER",
            "start": match.start(), "end": match.end(),
        })

    return sorted(entities, key=lambda item: item["start"])


def extract_item_candidates(text: str):
    """
    Mengambil kandidat ITEM secara rule-based.

    Contoh:
    "Ayu bayar pizza 90k dan es teh 20k untuk Raka"
    akan mencoba mengambil:
    - pizza
    - es teh

    Catatan:
    Ini hanya fallback sementara, bukan pengganti model NER.
    """

    items = []

    patterns = [
        r"bayar[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"beli[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"tagihan[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"nota[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"rekap[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"billing[:\s\-]+(.+?)(?=\s+\d|\s+rp|\s+untuk|\s+buat|$)",
        r"(?:^|\n)\s*[\-\*]\s*(?:(?:\w+\s+)?pesen\s+|\d+\s+)?([a-zA-Z\s]+?)(?=\s+(?:rp\.?|@)?\s*\d|\s+untuk|\s+buat|$)",
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            candidate = match.group(1).strip(" .,-:")

            if not candidate:
                continue

            parts = re.split(r"\s+dan\s+|,|\n", candidate)
            cursor = match.start(1)

            for part in parts:
                item_name = part.strip(" .,-:*")

                if not item_name or len(item_name) < 2:
                    continue

                start = text.lower().find(item_name.lower(), cursor)
                if start == -1:
                    start = cursor

                end = start + len(item_name)

                items.append({
                    "text": item_name,
                    "label": "ITEM",
                    "start": start,
                    "end": end,
                })
                cursor = end

    return items