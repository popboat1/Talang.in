import re
from .price_normalizer import normalize_price

TEXTUAL_NUMBERS = {
    "se": 1, "satu": 1, "dua": 2, "tiga": 3, "empat": 4, "lima": 5,
    "enam": 6, "tujuh": 7, "delapan": 8, "sembilan": 9, "sepuluh": 10,
    "sebelas": 11, "duabelas": 12, "tigabelas": 13, "empatbelas": 14, "limabelas": 15
}

def parse_textual_price(text: str) -> int:
    """Mengubah ekspresi harga tekstual seperti 'limabelas rebu' menjadi integer."""
    clean_text = text.lower().replace(" ", "")
    base_val = 0
    for word, num in TEXTUAL_NUMBERS.items():
        if clean_text.startswith(word):
            base_val = num
            if "belas" in clean_text and word != "limabelas" and not clean_text.startswith("limabelas"):
                base_val = num + 10
            break
            
    if "belas" in clean_text and base_val < 10: base_val += 10
    elif "puluh" in clean_text and base_val < 10: base_val *= 10

    multiplier = 1
    if any(k in clean_text for k in ["ribu", "rebu", "rb", "k"]): multiplier = 1000
    elif any(k in clean_text for k in ["juta", "jt"]): multiplier = 1000000

    return base_val * multiplier if base_val > 0 else normalize_price(text)


def get_entities_by_label(entities, label):
    return [e for e in entities if e.get("label") == label]


def unique_values(values):
    result = []
    for value in values:
        if value and value not in result: result.append(value)
    return result


def classify_category(title):
    text = title.lower()
    food_keywords = [
        "kopi", "ayam", "nasi", "mie", "pizza", "burger", "roti", "piza",
        "susu", "teh", "matcha", "coklat", "kue", "cake", "biscoff", "ramen",
        "spaghetti", "cireng", "kambing", "ikan", "soto", "bakso", "katsu",
        "es", "jus", "steak", "rice", "latte", "boba", "goreng", "kola", "sushi", "sate", "martabak", "geprek"
    ]
    if any(k in text for k in food_keywords): return "Makanan"
    if any(k in text for k in ["gojek", "grab", "taxi", "bensin", "parkir"]): return "Transportasi"
    if any(k in text for k in ["listrik", "air", "wifi", "internet", "pulsa"]): return "Utilitas"
    return "Lainnya"


def split_amount_exact(amount, members):
    if not members: return []
    base_amount = amount // len(members)
    remainder = amount % len(members)
    result = []
    for index, name in enumerate(members):
        member_amount = base_amount + (1 if index < remainder else 0)
        result.append({"name": name, "amount": member_amount})
    return result


def calculate_equal_split(amount, participants):
    return split_amount_exact(amount, participants)


def calculate_itemized_split(items, participants):
    if not participants: return []
    balances = {name: 0 for name in participants}
    for item in items:
        item_members = item.get("members") or participants
        split_result = split_amount_exact(item["amount"], item_members)
        for split in split_result:
            name = split["name"]
            if name not in balances: balances[name] = 0
            balances[name] += split["amount"]
    return [{"name": name, "amount": amount} for name, amount in balances.items()]


def clean_item_title(title: str, group_members: list) -> str:
    cleaned = re.sub(r'\b(bayar|bayer|beli|talangin|trs|terus|ada|total)\b', '', title, flags=re.IGNORECASE)
    for member in group_members:
        cleaned = re.sub(rf'\s+{re.escape(member)}$', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(rf'^{re.escape(member)}\s+', '', cleaned, flags=re.IGNORECASE)
    return re.sub(r'\s+', ' ', cleaned).strip(" :,.-")


def parse_entities_to_transaction(text, entities, group_members=None):
    group_members = group_members or []
    member_case_map = {m.lower(): m for m in group_members}

    from .rule_based_ner import extract_item_candidates
    regex_items = extract_item_candidates(text)
    model_items = get_entities_by_label(entities, "ITEM")
    combined_items_pool = list(model_items)
    
    for r_item in regex_items:
        if not any(max(r_item["start"], m["start"]) < min(r_item["end"], m["end"]) for m in combined_items_pool):
            combined_items_pool.append(r_item)

    sorted_entities = sorted(entities, key=lambda e: e.get("start", 0))
    person_entities = get_entities_by_label(sorted_entities, "PERSON")
    price_entities = get_entities_by_label(sorted_entities, "PRICE")
    multiplier_entities = get_entities_by_label(sorted_entities, "MULTIPLIER")

    all_global_persons = unique_values([member_case_map.get(e["text"].lower(), e["text"]) for e in person_entities])
    
    global_paid_by = "Unknown"
    for p in group_members:
        if re.search(rf'\b{re.escape(p)}\b\s*(?:bayar|bayer|beli|talangin)', text, re.IGNORECASE):
            global_paid_by = p
            break
    if global_paid_by == "Unknown" and group_members: global_paid_by = group_members[0]
    elif global_paid_by == "Unknown" and all_global_persons: global_paid_by = all_global_persons[0]

    valid_items = []
    global_modifiers = {"tax": 0, "discount": 0}
    assigned_price_starts = set()

    item_entities = sorted(combined_items_pool, key=lambda e: e.get("start", 0))

    # Helper: cek apakah harga berada di konteks modifier (tax/diskon)
    def _is_modifier_price(price_ent):
        p_idx = price_ent["start"]
        surrounding = text[max(0, p_idx - 15):min(len(text), p_idx + 10)].lower()
        return any(k in surrounding for k in ["diskon", "promo", "potongan", "discount", "tax", "pajak", "service", "charge"])

    # Non-modifier secondary prices — menentukan apakah Case 11 relevan
    non_modifier_secondary_prices = [p for p in price_entities[1:] if not _is_modifier_price(p)]

    # 1. Penanganan Asymmetric Breakdown Tunggal (Case 11)
    # Hanya aktif jika ada harga sekunder non-modifier (bukan tax/diskon)
    if len(item_entities) == 1 and len(price_entities) > 1 and len(non_modifier_secondary_prices) > 0:
        current_item = item_entities[0]
        extended_name = current_item["text"]
        
        left_context = text[max(0, current_item["start"] - 15):current_item["start"]]
        match_prefix = re.search(r'\b(nasi|mie|es|jus|roti|matcha|koka|pizza|paket|ayam)\b\s*$', left_context, re.IGNORECASE)
        if match_prefix:
            extended_name = f"{match_prefix.group(1)} {extended_name}"
        extended_name = clean_item_title(extended_name, group_members)

        total_header_price = parse_textual_price(price_entities[0]["text"])
        assigned_price_starts.add(price_entities[0]["start"])
        
        individual_shares = []
        local_persons = [{"text": member_case_map.get(e["text"].lower(), e["text"]), "start": e["start"]} for e in person_entities]

        for price_ent in price_entities[1:]:
            # Lewati harga yang merupakan modifier global (tax/diskon) — biarkan Step 3 yang menangani
            if _is_modifier_price(price_ent):
                continue

            p_idx = price_ent["start"]
            price_val = parse_textual_price(price_ent["text"])
            
            preceding_persons = [p for p in local_persons if p["start"] < p_idx]
            closest_person = max(preceding_persons, key=lambda x: x["start"])["text"] if preceding_persons else min(local_persons, key=lambda x: abs(x["start"] - p_idx))["text"]
            
            if closest_person:
                individual_shares.append({"name": closest_person, "amount": price_val})
                assigned_price_starts.add(price_ent["start"])

        total_allocated = sum(s["amount"] for s in individual_shares)
        remainder_amount = total_header_price - total_allocated
        
        for share in individual_shares:
            valid_items.append({"name": f"{extended_name} ({share['name']})", "amount": share["amount"], "members": [share["name"]], "paidBy": global_paid_by})
        if remainder_amount > 0:
            valid_items.append({"name": f"{extended_name} ({global_paid_by})", "amount": remainder_amount, "members": [global_paid_by], "paidBy": global_paid_by})

    # 2. Penanganan Standar Multi-Item Menggunakan Pembatasan Proksimitas Sekuensial
    else:
        for idx, current_item in enumerate(item_entities):
            item_start = current_item["start"]
            next_item_start = item_entities[idx + 1]["start"] if idx + 1 < len(item_entities) else len(text)
            prev_item_end = item_entities[idx - 1]["end"] if idx > 0 else 0

            # Deteksi Teks Window
            left_context = text[max(prev_item_end, item_start - 15):item_start]
            match_prefix = re.search(r'\b(nasi|mie|es|jus|roti|matcha|koka|pizza|paket|ayam)\b\s*$', left_context, re.IGNORECASE)
            
            actual_segment_start = text.find(match_prefix.group(1), max(prev_item_end, item_start - 15)) if match_prefix else item_start
            extended_name = f"{match_prefix.group(1)} {current_item['text']}" if match_prefix else current_item["text"]
            extended_name = clean_item_title(extended_name, group_members)

            # Batas Window Konsumen & Harga
            search_window_start = actual_segment_start
            search_window_end = next_item_start

            # Hubungkan Harga Terdekat
            local_prices = [p for p in price_entities if search_window_start <= p["start"] <= search_window_end]
            item_amount = 0
            if local_prices:
                price_ent = local_prices[0]
                item_amount = parse_textual_price(price_ent["text"])
                assigned_price_starts.add(price_ent["start"])

            # Hubungkan Multiplier / Kuantitas
            local_multipliers = [m for m in multiplier_entities if search_window_start <= m["start"] <= search_window_end]
            quantity = 1
            if local_multipliers:
                digits = re.findall(r'\d+', local_multipliers[0]["text"])
                if digits: quantity = int(digits[0])
                
                if "@" in text[max(0, local_prices[0]["start"] - 4):local_prices[0]["start"]] if local_prices else False:
                    item_amount *= quantity
                if local_multipliers[0]["start"] < item_start and local_multipliers[0]["text"] not in extended_name:
                    extended_name = f"{local_multipliers[0]['text']} {extended_name}"

            # Hubungkan Payer Segmen — hanya update jika nama diikuti kata kerja bayar/beli
            item_paid_by = global_paid_by
            for p in group_members:
                if re.search(rf'\b{re.escape(p)}\b\s*(?:bayar|bayer|beli|talangin)', text[prev_item_end:item_start], re.IGNORECASE):
                    item_paid_by = p

            # Hubungkan Konsumen Segmen Lokal
            # Window diperluas ke prev_item_end agar nama yang muncul tepat sebelum
            # item (pola "Sinta es teh" atau "- Dani: ayam geprek") bisa tertangkap
            local_persons = []
            for e in person_entities:
                if prev_item_end <= e["start"] <= search_window_end:
                    local_persons.append({"text": member_case_map.get(e["text"].lower(), e["text"]), "start": e["start"]})

            exclude_match = re.search(r'\b(kecuali|tanpa)\b', text[search_window_start:search_window_end], re.IGNORECASE)
            has_assignment_keyword = bool(re.search(r'\b(untuk|buat|bagi|ke|bagian|jatah)\b', text[search_window_start:search_window_end], re.IGNORECASE))

            if exclude_match:
                exclude_global_idx = search_window_start + exclude_match.start()
                excluded_names = {p["text"].lower() for p in local_persons if p["start"] > exclude_global_idx}
                item_members = [m for m in (group_members if group_members else all_global_persons) if m.lower() not in excluded_names]
            elif has_assignment_keyword:
                keyword_match = re.search(r'\b(untuk|buat|bagi|ke|bagian|jatah)\b', text[search_window_start:search_window_end], re.IGNORECASE)
                keyword_global_idx = search_window_start + keyword_match.start()
                
                item_members = unique_values([
                    p["text"] for p in local_persons 
                    if p["start"] > keyword_global_idx and "\n" not in text[keyword_global_idx:p["start"]]
                ])
                if not item_members:
                    item_members = group_members if group_members else all_global_persons
            else:
                # Kepemilikan Mandiri Implisit (Sinta es teh -> Sinta sendiri)
                preceding_persons = [p for p in local_persons if p["start"] <= item_start]
                is_standalone = False
                
                if preceding_persons:
                    closest_p = max(preceding_persons, key=lambda x: x["start"])
                    
                    start_idx = closest_p["start"] + len(closest_p["text"])
                    end_idx = max(start_idx, actual_segment_start) 
                    between_text = text[start_idx:end_idx].lower()
                    
                    item_text_lower = current_item["text"].lower()
                    transaction_keywords = ["bayar", "bayer", "beliin", "talangin", "bayarin"]
                    
                    has_transaction_verb = any(
                        verb in between_text or verb in item_text_lower 
                        for verb in transaction_keywords
                    )
                    
                    # Jika tidak ada kata transaksi, ini adalah pesanan mandiri murni
                    if not has_transaction_verb:
                        is_standalone = True
                
                if is_standalone:
                    item_members = [closest_p["text"]]
                else:
                    item_members = group_members if group_members else all_global_persons

            if extended_name:
                valid_items.append({"name": extended_name, "amount": item_amount, "members": item_members, "paidBy": item_paid_by})

    # 3. Ambil Modifikator Global Sisa (Tax / Diskon)
    for p_ent in price_entities:
        if p_ent["start"] not in assigned_price_starts:
            p_idx = p_ent["start"]
            surrounding_text = text[max(0, p_idx - 15):min(len(text), p_idx + 10)].lower()
            modifier_val = parse_textual_price(p_ent["text"])
            if any(k in surrounding_text for k in ["diskon", "promo", "potongan", "discount"]): global_modifiers["discount"] += modifier_val
            elif any(k in surrounding_text for k in ["tax", "pajak", "service", "charge"]): global_modifiers["tax"] += modifier_val

    # 4. Distribusi Nominal Akhir Pas Berimbang
    final_group_pool = group_members if group_members else all_global_persons
    if valid_items:
        split_method = "itemized" if len(valid_items) > 1 else "equal"
        base_total_amount = sum(i["amount"] for i in valid_items)
        net_modifier = global_modifiers["tax"] - global_modifiers["discount"]
        global_amount = max(0, base_total_amount + net_modifier)

        if base_total_amount > 0 and net_modifier != 0:
            allocated_modifier_total = 0
            for idx, item in enumerate(valid_items):
                if idx == len(valid_items) - 1: item["amount"] += (net_modifier - allocated_modifier_total)
                else:
                    proportion = item["amount"] / base_total_amount
                    allocated = int(net_modifier * proportion)
                    item["amount"] += allocated
                    allocated_modifier_total += allocated

        title = ", ".join(unique_values([i["name"] for i in valid_items]))
        participant_amounts = calculate_itemized_split(valid_items, final_group_pool)
    else:
        split_method = "equal"
        title = "Transaksi AI"
        prices = [parse_textual_price(e["text"]) for e in price_entities]
        global_amount = sum(prices) if prices else 0
        participant_amounts = calculate_equal_split(global_amount, final_group_pool)

    category = classify_category(title)

    return {
        "title": title, "amount": global_amount, "paidBy": global_paid_by,
        "category": category, "splitMethod": split_method,
        "participants": participant_amounts, "items": valid_items, "rawEntities": sorted_entities,
    }