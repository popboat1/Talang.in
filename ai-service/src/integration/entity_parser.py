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
            
    if "belas" in clean_text and base_val < 10:
        base_val += 10
    elif "puluh" in clean_text and base_val < 10:
        base_val *= 10

    multiplier = 1
    if any(k in clean_text for k in ["ribu", "rebu", "rb", "k"]):
        multiplier = 1000
    elif any(k in clean_text for k in ["juta", "jt"]):
        multiplier = 1000000

    return base_val * multiplier if base_val > 0 else normalize_price(text)


def get_entities_by_label(entities, label):
    return [e for e in entities if e.get("label") == label]


def unique_values(values):
    result = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def classify_category(title):
    text = title.lower()
    food_keywords = [
        "kopi", "ayam", "nasi", "mie", "pizza", "burger", "roti", "piza",
        "susu", "teh", "matcha", "coklat", "kue", "cake", "biscoff", "ramen",
        "spaghetti", "cireng", "kambing", "ikan", "soto", "bakso", "katsu",
        "es", "jus", "steak", "rice", "latte", "boba", "goreng", "kola", "sushi", "sate", "martabak"
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
    """Membersihkan verb transaksi dan nama anggota yang menempel pada judul item."""
    cleaned = title
    
    for member in group_members:
        cleaned = re.sub(rf'^{re.escape(member)}\s+', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(rf'\s+{re.escape(member)}$', '', cleaned, flags=re.IGNORECASE)
        
    cleaned = re.sub(r'\b(bayar|bayer|beli|talangin|trs|terus|ada|total)\b', '', cleaned, flags=re.IGNORECASE)
    
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
    if global_paid_by == "Unknown" and group_members:
        global_paid_by = group_members[0]
    elif global_paid_by == "Unknown" and all_global_persons:
        global_paid_by = all_global_persons[0]

    valid_items = []
    global_modifiers = {"tax": 0, "discount": 0}
    assigned_price_starts = set()

    item_entities = sorted(combined_items_pool, key=lambda e: e.get("start", 0))

    if item_entities:
        for i, current_item in enumerate(item_entities):
            item_start = current_item["start"]
            item_end_boundary = item_entities[i + 1]["start"] if i + 1 < len(item_entities) else len(text)
            item_segment_text = text[item_start:item_end_boundary]

            left_context = text[max(0, item_start - 15):item_start]
            match_prefix = re.search(r'\b(nasi|mie|es|jus|roti|matcha|koka|pizza|paket)\b\s*$', left_context, re.IGNORECASE)
            
            if match_prefix:
                extended_name = f"{match_prefix.group(1)} {current_item['text']}"
                actual_segment_start = text.find(match_prefix.group(1), max(0, item_start - 15))
            else:
                extended_name = current_item["text"]
                actual_segment_start = item_start

            extended_name = clean_item_title(extended_name, group_members)

            local_multipliers = [
                m for m in multiplier_entities
                if max(0, actual_segment_start - 12) <= m["start"] <= item_end_boundary
            ]
            quantity = 1
            if local_multipliers:
                m_ent = local_multipliers[0]
                digits = re.findall(r'\d+', m_ent["text"])
                if digits: quantity = int(digits[0])
                if m_ent["start"] < item_start and m_ent["text"] not in extended_name:
                    extended_name = f"{m_ent['text']} {extended_name}"

            segment_text_full = text[actual_segment_start:item_end_boundary]

            item_paid_by = global_paid_by
            lookback_context = text[max(0, actual_segment_start - 35):current_item["end"]]
            for p in group_members:
                if re.search(rf'\b{re.escape(p)}\b\s*(?:bayar|bayer|beli|talangin)', lookback_context, re.IGNORECASE):
                    item_paid_by = p

            local_prices = [
                p for p in price_entities 
                if actual_segment_start <= p["start"] <= item_end_boundary
            ]
            
            item_amount = 0
            if local_prices:
                price_ent = local_prices[0]
                assigned_price_starts.add(price_ent["start"])
                item_amount = parse_textual_price(price_ent["text"])
                
                is_unit_price = "@" in text[max(actual_segment_start, price_ent["start"] - 4):price_ent["start"]]
                if is_unit_price: item_amount *= quantity

            exclude_match = re.search(r'\b(kecuali|tanpa)\b', segment_text_full, re.IGNORECASE)
            
            local_persons = []
            for e in person_entities:
                if actual_segment_start <= e["start"] <= item_end_boundary:
                    std_name = member_case_map.get(e["text"].lower(), e["text"])
                    local_persons.append({"text": std_name, "start": e["start"]})

            has_assignment_keyword = bool(re.search(r'\b(untuk|buat|bagi|ke)\b', segment_text_full, re.IGNORECASE))

            if exclude_match:
                exclude_idx = actual_segment_start + exclude_match.start()
                excluded_names = {p["text"].lower() for p in local_persons if p["start"] > exclude_idx}
                baseline_pool = group_members if group_members else all_global_persons
                item_members = [m for m in baseline_pool if m.lower() not in excluded_names]
            elif has_assignment_keyword and local_persons:
                item_members = []
                for p in local_persons:
                    if p["text"] in extended_name:
                        pre_text = text[max(0, p["start"]-10):p["start"]].lower()
                        if not any(k in pre_text for k in ["untuk", "buat", "bagi", "ke"]):
                            continue
                    item_members.append(p["text"])
                item_members = unique_values(item_members)
                
                if len(item_members) > 1 and item_paid_by in item_members:
                    payer_pos = text.find(item_paid_by, actual_segment_start)
                    if payer_pos < text.find(current_item["text"], actual_segment_start) and not re.search(rf'\b{item_paid_by}\b', item_segment_text, re.IGNORECASE):
                        item_members = [m for m in item_members if m != item_paid_by]
            else:
                item_members = group_members if group_members else (all_global_persons if all_global_persons else [item_paid_by])

            if item_amount >= 0 and extended_name:
                valid_items.append({
                    "name": extended_name,
                    "amount": item_amount,
                    "members": item_members,
                    "paidBy": item_paid_by
                })

    for p_ent in price_entities:
        if p_ent["start"] not in assigned_price_starts:
            p_idx = p_ent["start"]
            surrounding_text = text[max(0, p_idx - 12):min(len(text), p_idx + 6)].lower()
            modifier_val = parse_textual_price(p_ent["text"])
            
            if any(k in surrounding_text for k in ["diskon", "promo", "potongan", "discount"]):
                global_modifiers["discount"] += modifier_val
            elif any(k in surrounding_text for k in ["tax", "pajak", "service", "charge"]):
                global_modifiers["tax"] += modifier_val

    # Terapkan perhitungan akhir proporsional 
    final_group_pool = group_members if group_members else all_global_persons
    if valid_items:
        split_method = "itemized" if len(valid_items) > 1 else "equal"
        base_total_amount = sum(i["amount"] for i in valid_items)
        net_modifier = global_modifiers["tax"] - global_modifiers["discount"]
        global_amount = max(0, base_total_amount + net_modifier)

        if base_total_amount > 0 and net_modifier != 0:
            allocated_modifier_total = 0
            for idx, item in enumerate(valid_items):
                if idx == len(valid_items) - 1:
                    item["amount"] += (net_modifier - allocated_modifier_total)
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
        "title": title,
        "amount": global_amount,
        "paidBy": global_paid_by,
        "category": category,
        "splitMethod": split_method,
        "participants": participant_amounts,
        "items": valid_items,
        "rawEntities": sorted_entities,
    }