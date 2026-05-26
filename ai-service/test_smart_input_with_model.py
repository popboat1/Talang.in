import json
from src.integration.smart_input_service import analyze_smart_input

GROUP_MEMBERS = ["Michael", "Dani", "Sinta"]

# each test case has: text, group_members, and expected outcomes.
# expected is checked field-by-field with tolerance for rounding.
TEST_SUITE = {
    "Case 0: List": {
        "text": "Ayu bayar semuanya:\n- Nasi goreng seafood 45k untuk Ayu Raka\n- 2 Mie tektek @30k buat Michael Dani\n- Sinta pesen Nasi gila 35k\n- Es teh manis 5k x5\nDiskon 20k, tax 15k",
        "group_members": ["Michael", "Dani", "Sinta", "Ayu", "Raka"],
        "expected": {
            "amount": 160000,
            "paidBy": ["Ayu"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 4,
            "item_names": ["Nasi goreng seafood", "2 Mie tektek", "Nasi gila", "Es teh manis"],
            "item_members": [
                {"Ayu", "Raka"},
                {"Michael", "Dani"},
                {"Sinta"},
                {"Michael", "Dani", "Sinta", "Ayu", "Raka"},
            ],
        }
    },
    "Case 0.5: Breakdown composition": {
        "text": "makan siang dibayarin Fatimah dan maria total 150000\n risna total 30000\nmaria total 25000\n fatimah 20000\n michael total 35000\n elisabeth 15000\n maulida 15000\n es teh 6  10000",
        "group_members": ["Michael", "Fatimah", "Maria", "Risna", "Elisabeth", "Maulida"],
        "expected": {
            "amount": 150000,
            "paidBy": ["Fatimah", "Maria"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 7,
            # es teh should be shared among all 6 members, not just maulida
            "item_members_check": {
                "es teh": {"Michael", "Fatimah", "Maria", "Risna", "Elisabeth", "Maulida"},
            },
            "participants": {
                "Michael": 36667,
                "Fatimah": 21667,
                "Maria": 26667,
                "Risna": 31667,
                "Elisabeth": 16666,
                "Maulida": 16666,
            },
        }
    },
    "Case 1: Multiplier & Quantity Prefix": {
        "text": "Michael bayar 3 burger total 150k untuk Michael Dani Sinta, terus 2 koka kola 30k buat Sinta",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 180000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "item_members": [
                {"Michael", "Dani", "Sinta"},
                {"Sinta"},
            ],
            "participants": {
                "Michael": 50000,
                "Dani": 50000,
                "Sinta": 80000,
            },
        }
    },
    "Case 2: Global Modifiers (Tax & Discount Isolation)": {
        "text": "Michael bayar sushi 200k untuk Dani Sinta, terus ada tax 20k dan diskon 10k",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 210000,
            "paidBy": ["Michael"],
            "splitMethod": "equal",
            "category": "Makanan",
            "item_count": 1,
            "item_members": [
                {"Dani", "Sinta"},
            ],
            "participants": {
                "Michael": 0,
                "Dani": 105000,
                "Sinta": 105000,
            },
        }
    },
    "Case 3: Negative Exclusion Filter (kecuali/tanpa)": {
        "text": "Michael bayar pizza large 120k untuk semua anggota kecuali Dani",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 120000,
            "paidBy": ["Michael"],
            "splitMethod": "equal",
            "category": "Makanan",
            "item_count": 1,
            "item_members": [
                {"Michael", "Sinta"},
            ],
            "participants": {
                "Michael": 60000,
                "Dani": 0,
                "Sinta": 60000,
            },
        }
    },
    "Case 4: Numeric Punctuation & Unit Scaling (@)": {
        "text": "Michael bayar ayam bakar Rp.45.500,- buat Dani, terus es campur @12.500 x2 buat Sinta",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 70500,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "item_members": [
                {"Dani"},
                {"Sinta"},
            ],
            "participants": {
                "Michael": 0,
                "Dani": 45500,
                "Sinta": 25000,
            },
        }
    },
    "Case 5: Multi-Payer Sequence Routing": {
        "text": "Michael bayar sate 60k buat Dani, terus Dani bayar martabak 40k buat Michael Sinta",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 100000,
            "paidBy": ["Michael", "Dani"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "participants": {
                "Michael": 20000,
                "Dani": 60000,
                "Sinta": 20000,
            },
        }
    },
    "Case 6: Slang, Typos, and Capitalization Variance": {
        "text": "michael bayer piza 100rb trs es teh limabelas rebu buat daNi",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 115000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "participants": {
                "Michael": 100000,
                "Dani": 15000,
                "Sinta": 0,
            },
        }
    },
    "Case 7: Implicit Shared Cost (No Target Keyword)": {
        "text": "Michael bayar katsu 90k dan ramen 110k",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 200000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "item_members": [
                {"Michael", "Dani", "Sinta"},
                {"Michael", "Dani", "Sinta"},
            ],
        }
    },
    "Case 8: Member Name Embedded in Item Title": {
        "text": "Michael bayar Nasi Goreng Gila Dani 45k untuk Sinta",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 45000,
            "paidBy": ["Michael"],
            "splitMethod": "equal",
            "category": "Makanan",
            "item_count": 1,
            "item_members": [
                {"Sinta"},
            ],
            "participants": {
                "Michael": 0,
                "Dani": 0,
                "Sinta": 45000,
            },
        }
    },
    "Case 9: Zero-Value / Free Promotional Items": {
        "text": "Michael bayar paket hemat 150k terus dapet free extra es teh 0k buat Sinta Dani",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 150000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "participants": {
                "Michael": 50000,
                "Dani": 50000,
                "Sinta": 50000,
            },
        }
    },
    "Case 10: Multi-line Break Structure (WhatsApp Copy-Paste)": {
        "text": "Michael bayar:\n- Nasi uduk 25k buat Dani\n- Es jeruk 10k buat Sinta\nTotal tax 3k",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 38000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "item_members": [
                {"Dani"},
                {"Sinta"},
            ],
            "participants": {
                "Michael": 0,
            },
        }
    },
    "Case 11: Breakdown with bagian keyword": {
        "text": "Risna bayar geprek total 250rb, bagian Fatimah 75rb, bagian Peronika 75rb, Risna yang bayar",
        "group_members": ["Risna", "Fatimah", "Peronika"],
        "expected": {
            "amount": 250000,
            "paidBy": ["Risna"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 3,
            "participants": {
                "Risna": 100000,
                "Fatimah": 75000,
                "Peronika": 75000,
            },
        }
    },
    "Case 12: Inline person-item pairs": {
        "text": "Michael beli ayam geprek 12rb, sinta es teh 5rb",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 17000,
            "paidBy": ["Michael"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 2,
            "participants": {
                "Michael": 12000,
                "Dani": 0,
                "Sinta": 5000,
            },
        }
    },
    "Case 13: Per-person itemization (no global payer)": {
        "text": "- Michael: ayam geprek 12rb\n - Sinta koka kola: 16rb\n - Dani: ayam geprek 11rb",
        "group_members": GROUP_MEMBERS,
        "expected": {
            "amount": 39000,
            # no global payer — each person pays their own
            "paidBy": ["Michael", "Sinta", "Dani"],
            "splitMethod": "itemized",
            "category": "Makanan",
            "item_count": 3,
            "participants": {
                "Michael": 12000,
                "Dani": 11000,
                "Sinta": 16000,
            },
        }
    },
}


# --- validation logic ---

def _check_field(actual, expected, field, tolerance=0):
    """checks a single field. returns (passed, message)."""
    if field not in expected:
        return True, None

    exp = expected[field]
    act = actual.get(field)

    if field == "paidBy":
        # paidBy is now a list — compare as sets
        act_set = set(act) if isinstance(act, list) else {act}
        exp_set = set(exp) if isinstance(exp, list) else {exp}
        if act_set == exp_set:
            return True, None
        return False, f"paidBy: got {sorted(act_set)}, expected {sorted(exp_set)}"

    if field == "item_count":
        items = actual.get("items", [])
        if len(items) == exp:
            return True, None
        return False, f"item_count: got {len(items)}, expected {exp}"

    if field == "item_names":
        item_names = [i["name"] for i in actual.get("items", [])]
        if item_names == exp:
            return True, None
        return False, f"item_names: got {item_names}, expected {exp}"

    if field == "item_members":
        items = actual.get("items", [])
        all_ok = True
        msgs = []
        for i, exp_members in enumerate(exp):
            if i >= len(items):
                msgs.append(f"  item[{i}]: missing (only {len(items)} items)")
                all_ok = False
                continue
            act_members = set(items[i].get("members", []))
            if act_members != exp_members:
                msgs.append(f"  item[{i}] '{items[i]['name']}': got {sorted(act_members)}, expected {sorted(exp_members)}")
                all_ok = False
        if all_ok:
            return True, None
        return False, "item_members:\n" + "\n".join(msgs)

    if field == "item_members_check":
        # partial check — only verify specific items by name
        items = actual.get("items", [])
        msgs = []
        all_ok = True
        for item_name, exp_members in exp.items():
            matching = [i for i in items if item_name.lower() in i["name"].lower()]
            if not matching:
                msgs.append(f"  '{item_name}': item not found")
                all_ok = False
                continue
            act_members = set(matching[0].get("members", []))
            if act_members != exp_members:
                msgs.append(f"  '{item_name}': got {sorted(act_members)}, expected {sorted(exp_members)}")
                all_ok = False
        if all_ok:
            return True, None
        return False, "item_members_check:\n" + "\n".join(msgs)

    if field == "participants":
        act_parts = {p["name"]: p["amount"] for p in actual.get("participants", [])}
        msgs = []
        all_ok = True
        for name, exp_amount in exp.items():
            act_amount = act_parts.get(name)
            if act_amount is None:
                msgs.append(f"  {name}: missing from participants")
                all_ok = False
            elif abs(act_amount - exp_amount) > tolerance:
                msgs.append(f"  {name}: got Rp {act_amount:,}, expected Rp {exp_amount:,} (diff={act_amount - exp_amount:+,})")
                all_ok = False
        if all_ok:
            return True, None
        return False, "participants:\n" + "\n".join(msgs)

    # default: exact comparison
    if act == exp:
        return True, None
    return False, f"{field}: got {act}, expected {exp}"


def validate_result(result, expected, tolerance=2):
    """validates result against expected outcomes. returns (pass_count, fail_count, messages)."""
    passes = 0
    fails = 0
    messages = []

    fields_to_check = [
        "amount", "paidBy", "splitMethod", "category",
        "item_count", "item_names", "item_members", "item_members_check",
        "participants",
    ]

    for field in fields_to_check:
        if field not in expected:
            continue
        passed, msg = _check_field(result, expected, field, tolerance=tolerance)
        if passed:
            passes += 1
        else:
            fails += 1
            messages.append(msg)

    return passes, fails, messages


def execute_local_suite():
    total_passes = 0
    total_fails = 0
    case_results = []

    for case_id, payload in TEST_SUITE.items():
        print(f"\nTESTING: {case_id}")
        print(f"Input Text: \n\"\"\"\n{payload['text']}\n\"\"\"")
        print("-" * 60)

        try:
            result = analyze_smart_input(
                text=payload["text"],
                group_members=payload["group_members"]
            )

            # display actual output
            paid_by = result.get("paidBy", [])
            paid_by_str = ", ".join(paid_by) if isinstance(paid_by, list) else paid_by
            print(f"Title       : {result.get('title')}")
            print(f"Total Amount : Rp {result.get('amount'):,}")
            print(f"Global Payer : {paid_by_str}")
            print(f"Split Method : {result.get('splitMethod')}")
            print(f"Category     : {result.get('category')}")

            print("\nExtracted Item Matrix:")
            items = result.get("items", [])
            if items:
                for item in items:
                    print(f"   * {item['name']:<20} | Rp {item['amount']:<7,} | PaidBy: {item.get('paidBy', 'Unknown'):<8} | Consumers: {item['members']}")
            else:
                print("   [empty items array - fallback to global split]")

            print("\nCalculated Final Participant Obligations:")
            for participant in result.get("participants", []):
                print(f"   * {participant['name']:<8}: Rp {participant['amount']:,}")

            # validate against expected outcomes
            expected = payload.get("expected")
            if expected:
                passes, fails, messages = validate_result(result, expected)
                total_passes += passes
                total_fails += fails

                if fails == 0:
                    print(f"\n   >> PASS ({passes}/{passes} checks)")
                    case_results.append((case_id, True, passes, 0))
                else:
                    print(f"\n   >> FAIL ({fails} failed, {passes} passed)")
                    for msg in messages:
                        print(f"      {msg}")
                    case_results.append((case_id, False, passes, fails))
            else:
                print("\n   >> [no expected outcomes defined]")
                case_results.append((case_id, None, 0, 0))

        except Exception as e:
            print(f"ENGINE CRASHED on this case! error: {str(e)}")
            import traceback
            traceback.print_exc()
            total_fails += 1
            case_results.append((case_id, False, 0, 1))

    # --- summary ---
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for case_id, passed, p, f in case_results:
        if passed is None:
            status = "SKIP"
        elif passed:
            status = "PASS"
        else:
            status = "FAIL"
        print(f"  [{status}] {case_id} ({p} passed, {f} failed)")

    print(f"\ntotal: {total_passes} passed, {total_fails} failed out of {total_passes + total_fails} checks")

    if total_fails == 0:
        print("all checks passed.")
    else:
        print(f"{total_fails} check(s) need attention.")


if __name__ == "__main__":
    execute_local_suite()