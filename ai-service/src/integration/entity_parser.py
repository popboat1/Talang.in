import re
from .price_normalizer import normalize_price

# textual numbers sorted by length (longest first) to avoid prefix collisions.
# e.g. "limabelas" must match before "lima", "sebelas" before "se".
TEXTUAL_NUMBERS = [
    ("sembilanbelas", 19), ("delapanbelas", 18), ("tujuhbelas", 17),
    ("enambelas", 16), ("limabelas", 15), ("empatbelas", 14),
    ("tigabelas", 13), ("duabelas", 12), ("sebelas", 11), ("sepuluh", 10),
    ("sembilan", 9), ("delapan", 8), ("tujuh", 7), ("enam", 6),
    ("lima", 5), ("empat", 4), ("tiga", 3), ("dua", 2),
    ("satu", 1), ("se", 1),
]


def parse_textual_price(text: str) -> int:
    """converts textual price like 'limabelas rebu' or 'duapuluh ribu' to int."""
    if not text or not text.strip():
        return 0
    clean_text = text.lower().replace(" ", "")
    base_val = 0

    # match longest textual number first to avoid prefix issues
    for word, num in TEXTUAL_NUMBERS:
        if clean_text.startswith(word):
            base_val = num
            remainder = clean_text[len(word):]
            # handle compound tens: duapuluh, tigapuluh, etc.
            if remainder.startswith("puluh") and base_val < 10:
                base_val *= 10
                after_puluh = remainder[5:]  # skip "puluh"
                # check for units after puluh (duapuluhlima = 25)
                for w2, n2 in TEXTUAL_NUMBERS:
                    if after_puluh.startswith(w2):
                        base_val += n2
                        break
            break

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
        "es", "jus", "steak", "rice", "latte", "boba", "goreng", "kola",
        "sushi", "sate", "martabak", "geprek", "uduk", "jeruk", "campur",
        "gila", "tektek", "seafood", "hemat",
    ]
    if any(k in text for k in food_keywords):
        return "Makanan"
    if any(k in text for k in ["gojek", "grab", "taxi", "bensin", "parkir"]):
        return "Transportasi"
    if any(k in text for k in ["listrik", "air", "wifi", "internet", "pulsa"]):
        return "Utilitas"
    return "Lainnya"


def split_amount_exact(amount, members):
    if not members:
        return []
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
    if not participants:
        return []
    balances = {name: 0 for name in participants}
    for item in items:
        item_members = item.get("members") or participants
        split_result = split_amount_exact(item["amount"], item_members)
        for split in split_result:
            name = split["name"]
            if name not in balances:
                balances[name] = 0
            balances[name] += split["amount"]
    return [{"name": name, "amount": amount} for name, amount in balances.items()]


def clean_item_title(title: str, group_members: list) -> str:
    """strips payment verbs and trailing member names from item title."""
    cleaned = re.sub(
        r'\b(bayar|bayer|beli|talangin|trs|terus|ada|total|pesen)\b',
        '', title, flags=re.IGNORECASE
    )
    for member in group_members:
        cleaned = re.sub(rf'\s+{re.escape(member)}$', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(rf'^{re.escape(member)}\s+', '', cleaned, flags=re.IGNORECASE)
    return re.sub(r'\s+', ' ', cleaned).strip(" :,.-")


# --- payer and format detection helpers ---

def _detect_payers(text, member_case_map, group_members, all_global_persons):
    """detects all payers from text. returns a list of payer names.
    handles passive form (dibayarin X dan Y), active form (X bayar),
    and confirmation form (X yang bayar)."""
    payers = []

    # passive form: dibayarin/bayarin Name1 dan Name2
    passive_match = re.search(
        r'(?:dibayarin|bayarin|ditalangin)\s+'
        r'([a-zA-Z]+(?:\s+(?:dan|&)\s+[a-zA-Z]+)*)',
        text, re.IGNORECASE
    )
    if passive_match:
        names_text = passive_match.group(1)
        for name_part in re.split(r'\s+(?:dan|&)\s+', names_text, flags=re.IGNORECASE):
            name_lower = name_part.strip().lower()
            if name_lower in member_case_map:
                resolved = member_case_map[name_lower]
                if resolved not in payers:
                    payers.append(resolved)

    # active form: Name bayar/beli/etc — scan all group members
    for p in group_members:
        if re.search(rf'\b{re.escape(p)}\b\s*(?:bayar|bayer|beli|talangin)', text, re.IGNORECASE):
            if p not in payers:
                payers.append(p)

    # confirmation form: Name yang bayar (e.g. "risna yang bayar")
    yang_match = re.search(r'(\b[a-zA-Z]+)\s+yang\s+(?:bayar|bayarin)', text, re.IGNORECASE)
    if yang_match:
        name_lower = yang_match.group(1).lower()
        if name_lower in member_case_map:
            resolved = member_case_map[name_lower]
            if resolved not in payers:
                payers.append(resolved)

    # fallback: first group member or first detected person
    if not payers:
        if group_members:
            payers = [group_members[0]]
        elif all_global_persons:
            payers = [all_global_persons[0]]
        else:
            payers = ["Unknown"]

    return payers


def _detect_per_person_format(text, group_members):
    """detects if text is in per-person itemization format.
    e.g. '- Michael: ayam geprek 12rb' where each line maps to a person
    and there is no global payer verb."""
    payment_verbs = [
        "bayar", "bayer", "beli", "talangin", "bayarin",
        "dibayarin", "ditalangin"
    ]
    has_payer_verb = bool(re.search(
        r'\b(' + '|'.join(payment_verbs) + r')\b', text, re.IGNORECASE
    ))

    if has_payer_verb or not group_members:
        return False

    lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
    if not lines:
        return False

    # check if majority of lines start with a known member name
    named_lines = 0
    for line in lines:
        stripped = line.lstrip('-*\u2022 ').strip()
        for member in group_members:
            if re.match(rf'(?i){re.escape(member)}\b', stripped):
                named_lines += 1
                break

    return named_lines > 0 and named_lines >= len(lines) * 0.5


def _extract_line_item_text(line_text, group_members):
    """extracts item-like text from a line by removing numbers and member names.
    returns the cleaned text, or empty string if nothing remains."""
    # strip all digits and punctuation that looks numeric
    alpha_only = re.sub(r'[^a-zA-Z\s]', '', line_text).strip()

    # strip known member names
    cleaned = alpha_only
    for member in group_members:
        cleaned = re.sub(rf'\b{re.escape(member)}\b', '', cleaned, flags=re.IGNORECASE)

    # strip common keywords that aren't item names
    noise_words = ["total", "bagian", "jatah", "untuk", "buat", "dan", "yang", "pesen"]
    for word in noise_words:
        cleaned = re.sub(rf'\b{word}\b', '', cleaned, flags=re.IGNORECASE)

    return re.sub(r'\s+', ' ', cleaned).strip()


# --- main transaction parser ---

def parse_entities_to_transaction(text, entities, group_members=None):
    group_members = group_members or []
    member_case_map = {m.lower(): m for m in group_members}

    from .rule_based_ner import extract_item_candidates
    regex_items = extract_item_candidates(text)
    model_items = get_entities_by_label(entities, "ITEM")
    combined_items_pool = list(model_items)

    # merge regex-detected items that don't overlap with model items
    for r_item in regex_items:
        if not any(max(r_item["start"], m["start"]) < min(r_item["end"], m["end"]) for m in combined_items_pool):
            combined_items_pool.append(r_item)

    sorted_entities = sorted(entities, key=lambda e: e.get("start", 0))
    person_entities = get_entities_by_label(sorted_entities, "PERSON")
    price_entities = get_entities_by_label(sorted_entities, "PRICE")
    multiplier_entities = get_entities_by_label(sorted_entities, "MULTIPLIER")

    all_global_persons = unique_values([
        member_case_map.get(e["text"].lower(), e["text"]) for e in person_entities
    ])

    # detect all payers (supports multi-payer like "dibayarin X dan Y")
    global_paid_by = _detect_payers(text, member_case_map, group_members, all_global_persons)

    # detect per-person itemization format (no global payer, each person owns their line)
    is_per_person_format = _detect_per_person_format(text, group_members)

    valid_items = []
    global_modifiers = {"tax": 0, "discount": 0}
    assigned_price_starts = set()
    consumed_person_starts = set()

    item_entities = sorted(combined_items_pool, key=lambda e: e.get("start", 0))

    def _is_modifier_price(price_ent):
        p_idx = price_ent["start"]
        surrounding = text[max(0, p_idx - 15):min(len(text), p_idx + 10)].lower()
        return any(k in surrounding for k in [
            "diskon", "promo", "potongan", "discount",
            "tax", "pajak", "service", "charge"
        ])

    non_modifier_secondary_prices = [p for p in price_entities if not _is_modifier_price(p)]

    # clean entities: if model misdetects a member name as ITEM, reclassify as PERSON
    cleaned_item_entities = []
    for item in item_entities:
        if item["text"].lower() in member_case_map:
            if not any(p["start"] == item["start"] for p in person_entities):
                person_entities.append({
                    "text": member_case_map[item["text"].lower()],
                    "label": "PERSON",
                    "start": item["start"],
                    "end": item["end"]
                })
        else:
            cleaned_item_entities.append(item)

    person_entities = sorted(person_entities, key=lambda e: e["start"])
    item_entities = sorted(cleaned_item_entities, key=lambda e: e["start"])

    # keep full item pool for line-level lookups in the breakdown path
    all_detected_items = [
        ie for ie in combined_items_pool
        if ie["text"].lower() not in member_case_map
    ]

    # --- path 1: breakdown composition ---
    # triggers when there are few items but many prices (person-amount breakdown).
    # e.g. "total 150k / risna 30k / maria 25k / ..."
    if len(item_entities) <= 1 and len(non_modifier_secondary_prices) > 1:
        header_price_ent = max(
            non_modifier_secondary_prices,
            key=lambda p: parse_textual_price(p["text"])
        )
        header_amount = parse_textual_price(header_price_ent["text"])
        assigned_price_starts.add(header_price_ent["start"])

        individual_shares = []

        for price_ent in non_modifier_secondary_prices:
            if price_ent["start"] == header_price_ent["start"]:
                continue

            p_idx = price_ent["start"]
            price_val = parse_textual_price(price_ent["text"])

            line_start = text.rfind('\n', 0, p_idx) + 1
            line_end = text.find('\n', p_idx)
            if line_end == -1:
                line_end = len(text)
            line_text = text[line_start:line_end]

            # find persons on this line
            line_persons = [p for p in person_entities if line_start <= p["start"] <= line_end]

            # check if line has item-like text (not just numbers/member names/keywords)
            item_text_on_line = _extract_line_item_text(line_text, group_members)
            has_item_text = len(item_text_on_line) >= 2

            if line_persons:
                # person found on this line — assign to the closest one before the price
                preceding_line_persons = [p for p in line_persons if p["start"] < p_idx]
                if preceding_line_persons:
                    closest_p_ent = max(preceding_line_persons, key=lambda x: x["start"])
                else:
                    closest_p_ent = min(line_persons, key=lambda x: abs(x["start"] - p_idx))
                consumer = member_case_map.get(closest_p_ent["text"].lower(), closest_p_ent["text"])
                consumers = [consumer]

            elif has_item_text:
                # line has item text but no person — treat as shared item for all members.
                # this handles cases like "es teh 6 10000" where the item is shared.
                consumers = list(group_members) if group_members else list(all_global_persons)

            else:
                # bare price line, no item text — fallback to nearest preceding person
                preceding_persons = [p for p in person_entities if p["start"] < p_idx]
                if preceding_persons:
                    closest_p_ent = max(preceding_persons, key=lambda x: x["start"])
                    consumer = member_case_map.get(closest_p_ent["text"].lower(), closest_p_ent["text"])
                else:
                    closest_p_ent = (
                        min(person_entities, key=lambda x: abs(x["start"] - p_idx))
                        if person_entities else None
                    )
                    consumer = (
                        member_case_map.get(closest_p_ent["text"].lower(), closest_p_ent["text"])
                        if closest_p_ent else global_paid_by[0]
                    )
                consumers = [consumer]

            # determine item title from entities or line text
            line_items_found = [
                ie for ie in all_detected_items
                if ie["start"] >= line_start and ie["end"] <= line_end
            ]
            if line_items_found:
                item_title = clean_item_title(line_items_found[0]["text"], group_members)
            elif len(consumers) == 1:
                item_title = f"Pesanan {consumers[0]}"
            else:
                # shared item — use extracted item text as title
                item_title = (
                    clean_item_title(item_text_on_line, group_members)
                    if item_text_on_line else "Item bersama"
                )

            individual_shares.append({
                "name": item_title,
                "amount": price_val,
                "members": consumers,
                "paidBy": global_paid_by[0]
            })
            assigned_price_starts.add(price_ent["start"])

        total_allocated = sum(s["amount"] for s in individual_shares)
        remainder_amount = header_amount - total_allocated

        for share in individual_shares:
            valid_items.append(share)

        # remainder (unallocated amount) goes to the global payer
        if remainder_amount > 0:
            header_consumer = global_paid_by[0]

            global_item_entity = item_entities[0] if item_entities else None
            header_p_idx = header_price_ent["start"]
            h_line_start = text.rfind('\n', 0, header_p_idx) + 1
            h_line_end = text.find('\n', header_p_idx)
            if h_line_end == -1:
                h_line_end = len(text)

            if (global_item_entity
                    and global_item_entity["start"] >= h_line_start
                    and global_item_entity["end"] <= h_line_end):
                header_title = clean_item_title(global_item_entity["text"], group_members)
            else:
                header_title = f"Pesanan {header_consumer}"

            valid_items.append({
                "name": header_title,
                "amount": remainder_amount,
                "members": [header_consumer],
                "paidBy": global_paid_by[0]
            })

    # --- path 2: standard multi-item parsing with proximity boundaries ---
    else:
        for idx, current_item in enumerate(item_entities):
            item_start = current_item["start"]
            next_item_start = (
                item_entities[idx + 1]["start"]
                if idx + 1 < len(item_entities) else len(text)
            )
            prev_item_end = item_entities[idx - 1]["end"] if idx > 0 else 0

            # try to extend item name with a known prefix from the left context
            left_context = text[max(prev_item_end, item_start - 15):item_start]
            match_prefix = re.search(
                r'\b(nasi|mie|es|jus|roti|matcha|koka|pizza|paket|ayam)\b\s*$',
                left_context, re.IGNORECASE
            )

            actual_segment_start = (
                text.find(match_prefix.group(1), max(prev_item_end, item_start - 15))
                if match_prefix else item_start
            )
            extended_name = (
                f"{match_prefix.group(1)} {current_item['text']}"
                if match_prefix else current_item["text"]
            )
            extended_name = clean_item_title(extended_name, group_members)

            search_window_start = actual_segment_start
            search_window_end = next_item_start

            # find prices in this item's window
            local_prices = [
                p for p in price_entities
                if search_window_start <= p["start"] <= search_window_end
            ]
            item_amount = 0
            if local_prices:
                price_ent = local_prices[0]
                item_amount = parse_textual_price(price_ent["text"])
                assigned_price_starts.add(price_ent["start"])

            # handle multipliers (x5, @12.500 x2, 3 burger, etc.)
            local_multipliers = [
                m for m in multiplier_entities
                if prev_item_end <= m["start"] <= search_window_end
            ]
            quantity = 1
            if local_multipliers:
                closest_multiplier = min(
                    local_multipliers, key=lambda x: abs(x["start"] - item_start)
                )
                digits = re.findall(r'\d+', closest_multiplier["text"])
                if digits:
                    quantity = int(digits[0])

                multiplier_text = closest_multiplier["text"].lower()
                # widen the @ detection window slightly for robustness
                has_at_symbol = (
                    "@" in text[max(0, local_prices[0]["start"] - 8):local_prices[0]["start"]]
                    if local_prices else False
                )
                has_x_symbol = "x" in multiplier_text
                is_prefix_qty = closest_multiplier["start"] < item_start

                if has_at_symbol or has_x_symbol:
                    item_amount *= quantity

                if is_prefix_qty and closest_multiplier["text"] not in extended_name:
                    extended_name = f"{closest_multiplier['text']} {extended_name}"

            # determine payer for this specific item
            item_paid_by = global_paid_by[0]
            for p in group_members:
                if re.search(
                    rf'\b{re.escape(p)}\b\s*(?:bayar|bayer|beli|talangin)',
                    text[prev_item_end:item_start], re.IGNORECASE
                ):
                    item_paid_by = p

            # determine consumers for this item
            local_persons = []
            for e in person_entities:
                if prev_item_end <= e["start"] <= search_window_end and e["start"] not in consumed_person_starts:
                    local_persons.append({
                        "text": member_case_map.get(e["text"].lower(), e["text"]),
                        "start": e["start"]
                    })

            window_text = text[search_window_start:search_window_end]
            exclude_match = re.search(r'\b(kecuali|tanpa)\b', window_text, re.IGNORECASE)
            has_assignment_keyword = bool(re.search(
                r'\b(untuk|buat|bagi|ke|bagian|jatah)\b', window_text, re.IGNORECASE
            ))

            if exclude_match:
                # negative exclusion: "untuk semua kecuali Dani"
                exclude_global_idx = search_window_start + exclude_match.start()
                excluded_names = {
                    p["text"].lower() for p in local_persons
                    if p["start"] > exclude_global_idx
                }
                item_members = [
                    m for m in (group_members if group_members else all_global_persons)
                    if m.lower() not in excluded_names
                ]
                for p in local_persons:
                    if p["start"] > exclude_global_idx:
                        consumed_person_starts.add(p["start"])

            elif has_assignment_keyword:
                # explicit assignment: "untuk Dani Sinta", "buat Michael"
                keyword_match = re.search(
                    r'\b(untuk|buat|bagi|ke|bagian|jatah)\b', window_text, re.IGNORECASE
                )
                keyword_global_idx = search_window_start + keyword_match.start()
                
                assigned_persons = [
                    p for p in local_persons
                    if p["start"] > keyword_global_idx
                    and "\n" not in text[keyword_global_idx:p["start"]]
                ]
                item_members = unique_values([p["text"] for p in assigned_persons])
                for p in assigned_persons:
                    consumed_person_starts.add(p["start"])
                
                if not item_members:
                    item_members = group_members if group_members else all_global_persons

            else:
                # no assignment keyword — check standalone person-to-item pattern.
                # collect ALL preceding persons that don't have a payment verb
                # between them and the item (not just the closest one).
                preceding_persons = [
                    p for p in local_persons if p["start"] <= item_start
                ]
                standalone_members = []
                if preceding_persons:
                    for p in preceding_persons:
                        between_text = text[
                            p["start"] + len(p["text"]):actual_segment_start
                        ].lower()
                        if not any(
                            verb in between_text
                            for verb in ["bayar", "bayer", "beliin", "talangin", "bayarin"]
                        ):
                            standalone_members.append(p["text"])
                            consumed_person_starts.add(p["start"])

                if standalone_members:
                    item_members = standalone_members
                else:
                    item_members = group_members if group_members else all_global_persons

            # in per-person format, each person pays their own items
            if is_per_person_format and item_members and len(item_members) == 1:
                item_paid_by = item_members[0]

            if extended_name:
                valid_items.append({
                    "name": extended_name,
                    "amount": item_amount,
                    "members": item_members,
                    "paidBy": item_paid_by
                })

    # --- collect remaining unassigned prices as global modifiers (tax/discount) ---
    for p_ent in price_entities:
        if p_ent["start"] not in assigned_price_starts:
            p_idx = p_ent["start"]
            surrounding_text = text[max(0, p_idx - 15):min(len(text), p_idx + 10)].lower()
            modifier_val = parse_textual_price(p_ent["text"])
            if any(k in surrounding_text for k in ["diskon", "promo", "potongan", "discount"]):
                global_modifiers["discount"] += modifier_val
            elif any(k in surrounding_text for k in ["tax", "pajak", "service", "charge"]):
                global_modifiers["tax"] += modifier_val

    # --- distribute modifiers proportionally and compute final amounts ---
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
        title = "Transaksi"
        prices = [parse_textual_price(e["text"]) for e in price_entities]
        global_amount = sum(prices) if prices else 0
        participant_amounts = calculate_equal_split(global_amount, final_group_pool)

    # if per-person format, update global paidBy to reflect all individual payers
    if is_per_person_format and valid_items:
        all_item_payers = unique_values([item["paidBy"] for item in valid_items])
        if all_item_payers:
            global_paid_by = all_item_payers

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