import json
from src.integration.smart_input_service import analyze_smart_input

GROUP_MEMBERS = ["Michael", "Dani", "Sinta"]

TEST_SUITE = {
    "Case 1: Multiplier & Quantity Prefix": {
        "text": "Michael bayar 3 burger total 150k untuk Michael Dani Sinta, terus 2 koka kola 30k buat Sinta",
        "group_members": GROUP_MEMBERS
    },
    "Case 2: Global Modifiers (Tax & Discount Isolation)": {
        "text": "Michael bayar sushi 200k untuk Dani Sinta, terus ada tax 20k dan diskon 10k",
        "group_members": GROUP_MEMBERS
    },
    "Case 3: Negative Exclusion Filter (kecuali/tanpa)": {
        "text": "Michael bayar pizza large 120k untuk semua anggota kecuali Dani",
        "group_members": GROUP_MEMBERS
    },
    "Case 4: Numeric Punctuation & Unit Scaling (@)": {
        "text": "Michael bayar ayam bakar Rp.45.500,- buat Dani, terus es campur @12.500 x2 buat Sinta",
        "group_members": GROUP_MEMBERS
    },
    "Case 5: Multi-Payer Sequence Routing": {
        "text": "Michael bayar sate 60k buat Dani, terus Dani bayar martabak 40k buat Michael Sinta",
        "group_members": GROUP_MEMBERS
    },
    "Case 6: Slang, Typos, and Capitalization Variance": {
        "text": "michael bayer piza 100rb trs es teh limabelas rebu buat daNi",
        "group_members": GROUP_MEMBERS
    },
    "Case 7: Implicit Shared Cost (No Target Keyword)": {
        "text": "Michael bayar katsu 90k dan ramen 110k",
        "group_members": GROUP_MEMBERS
    },
    "Case 8: Member Name Embedded in Item Title": {
        "text": "Michael bayar Nasi Goreng Gila Dani 45k untuk Sinta",
        "group_members": GROUP_MEMBERS
    },
    "Case 9: Zero-Value / Free Promotional Items": {
        "text": "Michael bayar paket hemat 150k terus dapet free extra es teh 0k buat Sinta Dani",
        "group_members": GROUP_MEMBERS
    },
    "Case 10: Multi-line Break Structure (WhatsApp Copy-Paste)": {
        "text": "Michael bayar:\n- Nasi uduk 25k buat Dani\n- Es jeruk 10k buat Sinta\nTotal tax 3k",
        "group_members": GROUP_MEMBERS
    }
}

def execute_local_suite():
    for case_id, payload in TEST_SUITE.items():
        print(f"\nTESTING: {case_id}")
        print(f"Input Text: \n\"\"\"\n{payload['text']}\n\"\"\"")
        print("-" * 60)

        try:
            result = analyze_smart_input(
                text=payload["text"],
                group_members=payload["group_members"]
            )

            print(f"Title       : {result.get('title')}")
            print(f"Total Amount : Rp {result.get('amount'):,}")
            print(f"Global Payer : {result.get('paidBy')}")
            print(f"Split Method : {result.get('splitMethod')}")
            print(f"Category     : {result.get('category')}")
            
            print("\nExtracted Item Matrix:")
            items = result.get("items", [])
            if items:
                for item in items:
                    print(f"   • {item['name']:<20} | Rp {item['amount']:<7,} | PaidBy: {item.get('paidBy', 'Unknown'):<8} | Consumers: {item['members']}")
            else:
                print("   [Empty items array - Fallback to global split execution]")

            print("\nCalculated Final Participant Obligations:")
            for participant in result.get("participants", []):
                print(f"   • {participant['name']:<8}: Rp {participant['amount']:,}")

        except Exception as e:
            print(f"ENGINE CRASHED on this case! Error Details: {str(e)}")

if __name__ == "__main__":
    execute_local_suite()