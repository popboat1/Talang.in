# main service for ai smart input
# combines: 1. ner model results, 2. rule-based fallback, 3. transaction post-processing

import re
from src.inference.predict import NERPredictor
from .entity_parser import parse_entities_to_transaction
from .rule_based_ner import predict_entities_rule_based


# global predictor so the model doesn't reload on every api request
_predictor = None


def get_predictor():
    """load ner model once. reuse on subsequent calls."""
    global _predictor

    if _predictor is None:
        _predictor = NERPredictor(
            model_path="models/bill_ner_model_28k.keras",
            format_type="keras",
            config_path="outputs/training_config_28k.json",
            vocab_dir="outputs/vocabs"
        )

    return _predictor


def merge_missing_group_members(text, entities, group_members):
    """catches all occurrences of group member names in the text,
    including names that appear multiple times on different lines."""
    if not group_members:
        return entities

    lower_text = text.lower()
    merged_entities = list(entities)

    for member in group_members:
        member_lower = member.lower()
        
        for match in re.finditer(rf'\b{re.escape(member_lower)}\b', lower_text):
            start = match.start()
            end = match.end()

            is_covered = any(
                e.get("label") == "PERSON" and e.get("start", 0) <= start < e.get("end", 0) 
                for e in merged_entities
            )
            
            if not is_covered:
                merged_entities.append({
                    "text": text[start:end],
                    "label": "PERSON",
                    "start": start,
                    "end": end,
                })

    return sorted(merged_entities, key=lambda item: item.get("start", 0))


def analyze_smart_input(text, entities=None, group_members=None):
    """main ai smart transaction input service.
    flow: manual entities -> ner model -> rule-based fallback -> group member merge -> parse."""
    group_members = group_members or []
    entities = list(entities or [])

    if not entities:
        try:
            predictor = get_predictor()
            prediction = predictor.predict_entities(text)
            entities = prediction.get("entities", [])
        except Exception as error:
            print(f"model inference failed: {error}")

    fallback_entities = predict_entities_rule_based(text, group_members)
    for f_ent in fallback_entities:
        is_overlapping = any(
            max(f_ent["start"], m["start"]) < min(f_ent["end"], m["end"])
            for m in entities
        )
        if not is_overlapping:
            entities.append(f_ent)

    entities = sorted(entities, key=lambda x: x["start"])

    entities = merge_missing_group_members(text, entities, group_members)
    result = parse_entities_to_transaction(text, entities, group_members=group_members)

    if group_members:
        result = match_with_group_members(result, group_members)

    result["status"] = "success"
    result["message"] = "AI Smart Input berhasil diproses"
    return result


def match_with_group_members(result, group_members):
    """normalizes detected person names to match the original group member casing.
    e.g. model reads 'ayu', group member is 'Ayu' -> output 'Ayu'."""
    normalized_members = {
        member.lower(): member
        for member in group_members
    }

    matched_participants = []

    for participant in result.get("participants", []):
        raw_name = participant["name"]
        normalized_name = raw_name.lower()

        if normalized_name in normalized_members:
            participant["name"] = normalized_members[normalized_name]
            matched_participants.append(participant)

    if matched_participants:
        result["participants"] = matched_participants

    # paidBy is now a list — normalize each name
    paid_by = result.get("paidBy", [])
    if isinstance(paid_by, str):
        paid_by = [paid_by]
    result["paidBy"] = [
        normalized_members.get(name.lower(), name)
        for name in paid_by
    ]

    return result