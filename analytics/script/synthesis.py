import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
import random

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Missing API Key! Check your .env file.")

client = genai.Client(api_key=API_KEY)

BATCHES = 10000
OUTPUT_FILE = "addition.json"

EXAMPLE_POOL = [
    {
        "format": "PARAGRAPH",
        "raw_text": "Sumpah ya [PERSON_1] lama bgt tf nya. Tagihan [ITEM_1] bulan ini udah keluar total [PRICE_1]. Karena kita berlima, patungan aja, masing-masing kena [PRICE_2]. Si [PERSON_2] kan kemaren udah nalangin [ITEM_2] gw [PRICE_3], jadi dia gausah tf.",
        "entities": [{"entity": "PERSON", "value": "[PERSON_1]"}, {"entity": "ITEM", "value": "[ITEM_1]"}, {"entity": "PRICE", "value": "[PRICE_1]"}, {"entity": "MULTIPLIER", "value": "berlima"}, {"entity": "MULTIPLIER", "value": "patungan"}, {"entity": "MULTIPLIER", "value": "masing-masing"}, {"entity": "PRICE", "value": "[PRICE_2]"}, {"entity": "PERSON", "value": "[PERSON_2]"}, {"entity": "ITEM", "value": "[ITEM_2]"}, {"entity": "PRICE", "value": "[PRICE_3]"}, {"entity": "PERSON", "value": "dia"}]
    },
    {
        "format": "LIST_ONLY",
        "raw_text": "Rekap patungan [ITEM_1] semalem:\n1. [PERSON_1]: [ITEM_2] [PRICE_1]\n2. [PERSON_2]: [PRICE_2]\n3. Gw: [PRICE_3]\nTotal [PRICE_4], bagi 3 jadi [PRICE_5]. Yg kurang bayar ke gw.",
        "entities": [{"entity": "MULTIPLIER", "value": "patungan"}, {"entity": "ITEM", "value": "[ITEM_1]"}, {"entity": "PERSON", "value": "[PERSON_1]"}, {"entity": "ITEM", "value": "[ITEM_2]"}, {"entity": "PRICE", "value": "[PRICE_1]"}, {"entity": "PERSON", "value": "[PERSON_2]"}, {"entity": "PRICE", "value": "[PRICE_2]"}, {"entity": "PRICE", "value": "[PRICE_3]"}, {"entity": "PRICE", "value": "[PRICE_4]"}, {"entity": "MULTIPLIER", "value": "bagi 3"}, {"entity": "PRICE", "value": "[PRICE_5]"}]
    },
    {
        "format": "SHORT_CHAT",
        "raw_text": "[PERSON_1] belum bayar [ITEM_1] kemaren, [PRICE_1] ya.",
        "entities": [{"entity":"PERSON","value":"[PERSON_1]"},{"entity":"ITEM","value":"[ITEM_1]"},{"entity":"PRICE","value":"[PRICE_1]"}]
    },
    {
        "format": "INCOMPLETE",
        "raw_text": "Inget ga kemaren [PERSON_1] pesen [ITEM_1]? Berapa tuh harganya lupa gw.",
        "entities": [{"entity":"PERSON","value":"[PERSON_1]"},{"entity":"ITEM","value":"[ITEM_1]"}]
    },
    {
        "format": "MIXED",
        "raw_text": "Eh guys, ini rincian [ITEM_1] kemaren ya:\n- [PERSON_1]: [PRICE_1]\n- [PERSON_2]: [PRICE_2]\nTolong tf ke gw ya berdua.",
        "entities": [{"entity":"ITEM","value":"[ITEM_1]"}, {"entity":"PERSON","value":"[PERSON_1]"}, {"entity":"PRICE","value":"[PRICE_1]"}, {"entity":"PERSON","value":"[PERSON_2]"}, {"entity":"PRICE","value":"[PRICE_2]"}, {"entity":"MULTIPLIER", "value":"berdua"}]
    },
    {
        "format": "CHAOTIC",
        "raw_text": "eh buset dah [PERSON_1] lu kmrn kan pesen [ITEM_1] gw lupa jdnya brp ya [PRICE_1] kl gasalah eh bukan deng wkwk au ah yg pntg tf aja dlu",
        "entities": [{"entity":"PERSON","value":"[PERSON_1]"}, {"entity":"ITEM","value":"[ITEM_1]"}, {"entity":"PRICE","value":"[PRICE_1]"}]
    }
]

FORMATS = [

    # ── STRUCTURED / LIST-BASED ─────────────────────────────────────────────

    ("LIST_RECEIPT: A cold, itemized receipt clone. Lines follow strict 'ITEM . . . PRICE' or "
     "'ITEM (qty) @ PRICE = SUBTOTAL' format. No pronouns, no filler. Could be copy-pasted "
     "from a POS system or typed manually by someone very organized.", 0.10),

    ("LIST_ASSIGNMENT: A roster-style list assigning each PERSON their specific amount. "
     "Format: '[PERSON]: [PRICE]' per line. No item names needed — just who owes what. "
     "Feels like a class attendance sheet repurposed for debt collection.", 0.08),

    ("LIST_BREAKDOWN: A multi-section list: first an itemized section (what was ordered), "
     "then a separate 'PEMBAGIAN' or 'TOTAL PER ORANG' section. Two clear visual blocks "
     "separated by a divider line (---) or emoji (📋). Common in group admin chats.", 0.07),

    # ── MIXED CONVERSATIONAL + STRUCTURE ────────────────────────────────────

    ("MIXED_INTRO_THEN_LIST: Opens with 1 sentence of human context (apology, recap, frustration), "
     "then drops into a dashed or bulleted list. The contrast between the warm opener and "
     "the cold list is the key texture. No closing sentence.", 0.08),

    ("MIXED_LIST_THEN_OUTRO: The list comes FIRST (itemized or per-person), then ends with "
     "1-2 sentences of social pressure, deadline, or instruction ('transfer sebelum jam 10 malem', "
     "'yang belum bayar DM gw'). The human part is at the END, not the start.", 0.07),

    ("MIXED_INLINE: No bullet points or line breaks — items and prices are embedded inside "
     "flowing prose using natural connectors: 'terus', 'sama', 'ditambah', 'belum lagi'. "
     "Reads like someone dictating a receipt out loud. Dense but not chaotic.", 0.06),

    # ── SHORT / COMPRESSED ──────────────────────────────────────────────────

    ("SHORT_DEMAND: One sentence only. Cuts straight to the amount and the person. "
     "Zero context, zero pleasantries. Feels slightly aggressive. "
     "Example register: 'Transfer [PRICE_1] ke gw.' or '[PERSON_1] kurang [PRICE_1].'", 0.06),

    ("SHORT_REMINDER: 1-2 sentences framed as a gentle or passive-aggressive reminder of "
     "something already discussed. Implies prior context: 'Inget kan kemaren...', "
     "'Btw masih kurang...', 'Udah gw bilang kan...'. The debt is old news.", 0.05),

    ("SHORT_QUESTION: 1-2 sentences phrased as a question, not a statement. The sender is "
     "confirming, clarifying, or guilt-tripping via interrogative form. "
     "'[PERSON_1] udah tf belum?', '[ITEM_1] kemaren [PRICE_1] kan?'", 0.04),

    # ── PARAGRAPH / NARRATIVE ───────────────────────────────────────────────

    ("PARAGRAPH_STORY: A long, narrative paragraph that tells the story of what happened "
     "before getting to the bill. Sets the scene, names participants, describes the event, "
     "then arrives at the financial ask. Reads like a WhatsApp essay. 4-6 sentences minimum.", 0.05),

    ("PARAGRAPH_EMOTIONAL: A long paragraph where the financial request is buried inside "
     "emotional content — frustration, exhaustion, passive aggression, or guilt-tripping. "
     "The money ask is not the opening line. Feels like a relationship complaint that "
     "happens to include prices.", 0.04),

    ("PARAGRAPH_EXPLAIN: A long paragraph that focuses on EXPLAINING the math — why the "
     "split is unequal, how a complication changed the total, why someone owes more or less. "
     "Heavy use of 'karena', 'soalnya', 'makanya', 'jadi'. Reads like a patient teacher "
     "walking someone through arithmetic they got wrong.", 0.04),

    # ── CHAOTIC / INFORMAL ──────────────────────────────────────────────────

    ("CHAOTIC_TYPO: Stream-of-consciousness with deliberate typos, missing spaces, "
     "autocorrect errors, and no punctuation. Words run together. Prices and names appear "
     "mid-thought. Feels like someone typing furiously on a phone while multitasking.", 0.04),

    ("CHAOTIC_FRAGMENTED: Multiple very short messages merged into one, separated by '/' "
     "or line breaks. Simulates someone who sent 4 separate chat bubbles. Each fragment "
     "is 3-6 words. Entity info is scattered across fragments, requiring the reader "
     "(and the NER model) to stitch it together.", 0.04),

    ("CHAOTIC_CORRECTION: Message contains an explicit self-correction mid-way — the sender "
     "realizes they made a math error and corrects it inline. "
     "Uses 'eh wait', 'maksudnya', '*[PRICE_X]', 'koreksi', 'salah tadi'. "
     "Two versions of a price or amount appear in the same message.", 0.03),

    # ── INCOMPLETE / AMBIGUOUS ──────────────────────────────────────────────

    ("INCOMPLETE_MISSING_PRICE: A natural message where one or more prices are conspicuously "
     "absent. The sender either forgot, is asking for confirmation, or assumes the reader "
     "already knows. Other entities (PERSON, ITEM, MULTIPLIER) are present.", 0.04),

    ("INCOMPLETE_MISSING_PERSON: The amounts and items are clear but it's ambiguous WHO owes "
     "what. Uses 'kalian', 'masing-masing', 'semua', 'yang pesen X' as vague person references "
     "instead of [PERSON_X]. Requires inference to assign debt.", 0.04),

    ("INCOMPLETE_HALF_SENT: Feels like the message was cut off or sent before finishing. "
     "Ends abruptly mid-calculation or mid-sentence. Uses trailing '...' or just stops. "
     "The last entity mentioned is incomplete or its relationship is unclear.", 0.02),
]

SEEDS = {
    "personas": [
        # ── COLLEGE / STUDENT ───────────────────────────────────────────────
        "A broke college student ('Anak kos akhir bulan') who is desperately counting every rupiah and mentions their dwindling rice supply.",
        "A college student who just got their monthly allowance (uang bulanan) and is suddenly very generous but still needs to collect debts.",
        "A stressed thesis student ('lagi ngerjain skripsi') who treats every small debt like a life-or-death matter because they need printer money.",
        "A college student living off instant noodles (indomie) who is owed money for a group project material purchase.",

        # ── WORKPLACE ───────────────────────────────────────────────────────
        "A passive-aggressive coworker who uses formal Bahasa Indonesia with slightly sarcastic corporate jargon ('sesuai dengan kesepakatan bersama...').",
        "A new employee (karyawan baru) who is too scared to directly ask their senior for money so they hint at it very indirectly.",
        "A WFH remote worker who paid for a team lunch delivery and needs reimbursement before the end of the billing cycle.",
        "A burnt-out office worker on their last nerve who just wants everyone to transfer immediately so they can log off.",

        # ── GEN Z / INTERNET CULTURE ────────────────────────────────────────
        "A hyperactive Gen Z gamer using excessive gaming slang: 'ratio', 'sus', 'no cap', 'diff', 'touch grass', 'skill issue'.",
        "A chronically-online Gen Z who communicates entirely in meme references and ironic detachment but still needs the money.",
        "A TikTok-addicted friend who phrases the bill split as if narrating a TikTok video ('POV: your friend still hasn't paid...').",
        "A Gen Z who uses lowercase for everything, no punctuation, and pepper their texts with 'fr fr', 'ngl', 'not me', 'lowkey'.",

        # ── PERSONALITY TYPES ───────────────────────────────────────────────
        "A confused friend who is genuinely terrible at basic math, keeps getting the wrong total, and shows their incorrect working.",
        "A forgetful person suddenly remembering a debt from 2-3 months ago, embarrassed but still needing the money back.",
        "An angry roommate who has hit their absolute limit with people not paying, escalating to threats of a house meeting.",
        "The exhausted 'Mom' of the friend group who organizes everything and is deeply tired of being everyone's unpaid treasurer.",
        "An overly polite junior (adik tingkat) who is dying of embarrassment asking a senior (kakak tingkat) for money.",
        "A dramatic friend using extreme hyperbole — they will 'literally die', 'tidak bisa makan', 'bakal jual ginjal' if not paid today.",
        "A sarcastic troll who makes backhanded compliments about how 'kaya banget' everyone must be to keep forgetting to pay.",
        "A hyper-organized project manager using Scrum terminology: 'action item', 'blocker', 'sprint', 'deliverable', 'stakeholder'.",
        "A passive person who never directly asks for money but uses increasingly obvious hints and sighs ('btw gw lagi bokek bgt nih...').",
        "A conspiracy theorist who believes the restaurant, the app, AND the government are all conspiring to overcharge them.",

        # ── LIFESTYLE / INTEREST-BASED ──────────────────────────────────────
        "A gym bro who frames everything in fitness terms: the bill is their 'macros', paying is 'gains', debt is 'skipping leg day'.",
        "A K-Pop stan who uses fandom vocabulary: 'bias', 'anti', 'sasaeng', 'comeback', 'slay', 'era' while asking for the money.",
        "A foodie who cannot help giving a detailed Zomato-style review of every item before demanding payment.",
        "A hustler/entrepreneur who treats a casual group dinner like a formal B2B invoice with 'payment terms: NET-3'.",
        "A fashion-obsessed friend (hypebeast) who compares every price to the cost of streetwear items they want.",
        "A self-proclaimed minimalist who finds the entire concept of a complicated bill split spiritually offensive and says so.",

        # ── SITUATIONAL / STATES ────────────────────────────────────────────
        "A sleepy friend who clearly just woke up: texts are half-finished, they confuse names, and correct themselves mid-sentence.",
        "A drunk (or very tired) friend texting at 2am whose message is surprisingly coherent except for a few key errors.",
        "A friend who is simultaneously texting multiple people and keeps mixing up which group chat they're in.",
        "A person who just got broken up with and is now collecting ALL old debts with intense, slightly unhinged energy.",

        # ── SPECIAL TONES ───────────────────────────────────────────────────
        "A fast-talker who uses maximum abbreviations: 'g', 'lu', 'y', 'krn', 'smpt', 'bgt', 'tp', 'udh', 'blm', 'jg', 'msh'.",
        "A formal adat/traditional person who uses very polite, almost archaic Indonesian ('mohon kiranya berkenan...').",
        "A friend who has clearly copy-pasted their message from a template and forgot to change some of the placeholder names.",
        "A person who communicates only via voice-note transcription — so the message reads like spoken word, with 'eh', 'um', 'jadi gini'.",
    ],

    "scenarios": [
        # ── FOOD & DELIVERY ─────────────────────────────────────────────────
        "Splitting a late-night GoFood order: Martabak Manis with various toppings where each person wanted different halves.",
        "Dividing a GrabFood order of Pecel Lele, Ayam Bakar, and Es Teh where the delivery fee needs to be split proportionally.",
        "Collecting payment for a shared Kopi Kenangan or Fore Coffee order where everyone got different sizes and add-ons.",
        "Splitting a massive McDonald's McDelivery order at 1am where someone added apple pie 'for the table' without asking.",
        "Dividing a Warteg (warung tegal) catering order for a study session where portions were unequal.",

        # ── SUBSCRIPTIONS & DIGITAL ─────────────────────────────────────────
        "Collecting monthly dues for a shared Netflix account after the password-sharing crackdown forced everyone onto one plan.",
        "Splitting a Spotify Family Plan where the 'family admin' is tired of chasing people every month.",
        "Collecting payment for a shared Canva Pro or Adobe account for a college design team.",
        "Patungan for a YouTube Premium family plan because the ads were driving everyone insane.",
        "Splitting the cost of a ChatGPT Plus or Midjourney subscription shared among a group of freelancers.",

        # ── SPORTS & LEISURE ────────────────────────────────────────────────
        "Patungan for a Futsal court booking (2 hours, weekend rate) plus buying a new ball because someone burst the old one.",
        "Splitting a Badminton court rental plus shuttlecock costs where some people played 3 sets and others only 1.",
        "Collecting for a gym day pass for the whole squad to try out a new gym.",
        "Splitting the cost of a bowling lane rental at a mall where everyone played different numbers of rounds.",

        # ── TRAVEL & TRANSPORT ──────────────────────────────────────────────
        "Calculating the road trip split: Bensin, Tol, Parkir, and Snacks — where the driver insists on being compensated extra.",
        "Splitting an Airbnb in Bandung or Yogyakarta for a long weekend where room quality differed (master vs non-master).",
        "Dividing a Sewa Mobil (car rental) cost including the driver fee and petrol for a group trip.",
        "Splitting multiple GoCar rides after a night out with different drop-off points across the city.",
        "Collecting for train or bus tickets (KAI) booked under one person's account for a group trip.",
        "Splitting a short-haul flight (Citilink/Lion Air) booked together where some got window seats (extra fee).",

        # ── GIFTS & SOCIAL ──────────────────────────────────────────────────
        "Collecting patungan for a wedding gift (amplop kondangan) where the agreed amount per person keeps changing.",
        "Splitting the cost of a birthday cake, balloon decorations, and a custom gift for a mutual friend's surprise party.",
        "Collecting money for a farewell (perpisahan) gift for a friend who is moving abroad or changing jobs.",
        "Patungan for a get-well-soon hamper (parcel) for a sick friend in the hospital.",

        # ── SHOPPING ────────────────────────────────────────────────────────
        "Splitting a Tokopedia haul where everyone bought different things under one order to get free ongkir.",
        "Dividing a Shopee bulk order of the same product (e.g., skincare, supplements) bought at a group discount.",
        "Collecting for a group order from a UMKM or small business that only accepts one payment.",
        "Splitting an IKEA haul where everyone bought different furniture but shared the delivery fee.",

        # ── UTILITIES & COMMUNAL ────────────────────────────────────────────
        "Splitting the monthly Indihome or IndiHome Wi-Fi bill at a boarding house (kosan) with 5 people.",
        "Dividing the monthly electricity (PLN) and water (PDAM) bill at a shared rented house.",
        "Collecting patungan for communal kosan supplies: galon air, sabun, tisu, and a broom that broke.",
        "Patungan for vet bills and cat food for the communal kosan cat that everyone feeds but nobody officially owns.",

        # ── ENTERTAINMENT ───────────────────────────────────────────────────
        "Splitting a karaoke bill (Happy Puppy/Inul Vizta): room rental, extra hours, food, and drinks.",
        "Dividing the cost of escape room tickets where the group paid together at the counter.",
        "Splitting a Dufan or Trans Studio day pass plus locker rental and a shared meal inside.",
        "Collecting for concert tickets (Coldplay, BLACKPINK, Noah) bought in one batch under a single account.",
        "Splitting a bar tab where some people drank alcohol and some only had soft drinks — a delicate negotiation.",

        # ── ACADEMIC / WORK ─────────────────────────────────────────────────
        "Dividing material costs for a college Capstone/Tugas Akhir project: sensor parts, 3D print filament, PCB.",
        "Splitting printing and binding costs for a group report or skripsi draft that needed 5 copies.",
        "Collecting patungan for a team lunch during a work offsite or company retreat.",
        "Splitting a Zoom Pro or Google Workspace subscription for a small startup team.",

        # ── GAMING ──────────────────────────────────────────────────────────
        "Splitting the cost of a Steam game bought under one account for a group LAN party.",
        "Collecting patungan for a shared in-game item, guild fund, or battle pass in Mobile Legends or Valorant.",
        "Splitting the cost of a PS5 game bought physically that multiple friends want to borrow/share.",
    ],

    "complications": [
        # ── PRICING ISSUES ──────────────────────────────────────────────────
        "One person ordered something significantly more expensive than everyone else and is quietly hoping nobody does the math.",
        "The promo code failed at checkout, so the price is 30-40% higher than what everyone budgeted.",
        "There is a PB1 restaurant tax, a service charge, and a platform fee that together add 25% to the base price.",
        "The item went out of stock mid-order and was automatically replaced with a more expensive alternative.",
        "The sender is very subtly rounding every amount UP by 2-5k per person, pocketing a small profit.",
        "Currency conversion is involved because one person paid in USD or SGD while abroad.",

        # ── PAYMENT HISTORY ISSUES ──────────────────────────────────────────
        "Someone hasn't paid a debt from the PREVIOUS group outing, so that amount needs to be added to this one.",
        "Someone already transferred a DP (down payment) of an arbitrary amount and now the remaining split is awkward.",
        "Someone sent the payment but to the wrong account/number, and is now claiming they've already paid.",
        "Someone transferred but included a random note ('ganti utang kemaren') that doesn't match this transaction.",
        "One person insists they paid cash 'at the scene' but nobody remembers receiving it.",
        "The group treasurer lost track and isn't sure who has and hasn't paid, so they're asking everyone to confirm.",

        # ── PORTION / FAIRNESS DISPUTES ─────────────────────────────────────
        "Someone claims they 'only had a few bites' of a shared dish and shouldn't pay the full portion price.",
        "Two people shared one portion of food, so their individual cost should be halved — but the math is awkward.",
        "One person left the event early and is arguing they should only pay for the time/food they consumed.",
        "Someone ordered for their partner/sibling who wasn't in the group, and the group is debating whether to absorb that cost.",
        "The shared platter or snack dish was consumed mostly by two people but is being split equally among five.",
        "Someone is a vegetarian/vegan and refuses to pay their equal share toward meat dishes they didn't touch.",

        # ── TECHNICAL / APP ISSUES ──────────────────────────────────────────
        "The BCA Mobile or Livin app is down, causing panic about whether a transfer actually went through.",
        "Someone paid with a mix of GoPay, OVO, ShopeePay cashback coins, and actual money — the math is nightmarish.",
        "The GrabFood/GoFood app applied a hidden 'rain surge' or 'peak hour' fee that nobody approved.",
        "The e-wallet account hit its unverified transaction limit and the payment is stuck pending.",
        "Someone's bank account is temporarily blocked from outgoing transfers until they update their KYC.",

        # ── SOCIAL DYNAMICS ─────────────────────────────────────────────────
        "The most 'kaya' person in the group is mysteriously always the slowest to transfer despite paying being trivial for them.",
        "Someone keeps saying 'bayarin dulu, nanti gw ganti' but their repayment track record is, diplomatically, 'varied'.",
        "Someone promised to pay 'next month after gajian' but gajian was two weeks ago and they've gone quiet.",
        "The group is trying not to embarrass one member who is clearly struggling financially but still needs to collect.",
        "Someone is threatening to remove non-payers from the group chat, which is causing more drama than the debt itself.",
        "A friend-of-a-friend attended and consumed but was never officially part of the payment group.",

        # ── LOGISTICAL CHAOS ────────────────────────────────────────────────
        "The sender lost the receipt and is reconstructing prices from memory and screenshots of the menu.",
        "The order arrived with missing items, so the total needs to be recalculated after a partial refund.",
        "There was an additional last-minute cash purchase (parkir, plastik, saus extra) that wasn't in the original total.",
        "The trip had an unexpected detour that added toll and petrol costs nobody budgeted for.",
        "The booking platform charged a cancellation fee because someone dropped out last minute.",
        "An item nobody remembers ordering appeared on the final bill and nobody is claiming it.",
        "The group used a split-payment feature on the app but it malfunctioned and charged one person the full amount.",
    ],

    "entity_constraints": [
        # ── COMPLETE ────────────────────────────────────────────────────────
        "Use all four entity types (PERSON, ITEM, PRICE, MULTIPLIER) freely and naturally.",
        "Use all entity types but make MULTIPLIER the grammatical focus — the splitting logic is the main point.",

        # ── MISSING ITEM ────────────────────────────────────────────────────
        "Do NOT use any [ITEM_X] placeholder. Refer to items only vaguely: 'itu', 'yang kemaren', 'pesanan lu', 'barangnya'.",
        "Do NOT use any [ITEM_X]. The item is implied by the scenario — the sender assumes everyone knows what it was.",

        # ── MISSING PRICE ────────────────────────────────────────────────────
        "Do NOT include any [PRICE_X]. The sender is asking what the price was, not stating it.",
        "Do NOT include any [PRICE_X]. The price was mentioned in a previous message and the sender just references 'yang tadi' or 'harga yang udah disepakatin'.",

        # ── MISSING PERSON ───────────────────────────────────────────────────
        "Only use ONE [PERSON_X] by name. All other people are referred to collectively: 'kalian', 'semua', 'yang lain', 'sisanya'.",
        "Do NOT use any [PERSON_X] at all. Everyone is addressed as 'kalian' or 'lo semua'. No individual is named.",

        # ── MISSING MULTIPLIER ───────────────────────────────────────────────
        "Do NOT use any MULTIPLIER phrases. State each person's exact amount directly without explaining the division logic.",
        "Do NOT use MULTIPLIER. The split is unequal and stated per-person rather than as a formula.",

        # ── MINIMAL ENTITIES ────────────────────────────────────────────────
        "Use ONLY PERSON and PRICE. No item names, no multiplier. Just who owes how much.",
        "Use ONLY ITEM and PRICE. No person is named. No split logic. Just a price list.",

        # ── AMBIGUOUS / NOISY ────────────────────────────────────────────────
        "Include conflicting PRICE values — an initial wrong price and a corrected one — both in the same message.",
        "Mention a PERSON by both [PERSON_X] placeholder AND a pronoun ('dia', 'tu', 'si itu') in the same message.",
        "Include a PRICE that is described approximately: 'sekitar', 'kira-kira', 'lebih kurang', not an exact figure.",
    ],

    # ── NEW DIMENSION: CHANNEL / MEDIUM ─────────────────────────────────────
    # Controls WHERE this message is being sent, affecting formality and length
    "channel": [
        "A private 1-on-1 WhatsApp message to the specific person who owes money. Tone is direct and personal.",
        "A message in a group WhatsApp chat with 5-8 people. Tone addresses everyone but calls out specific names.",
        "A message in a large class/angkatan group chat (50+ members). Sender is slightly embarrassed about the public ask.",
        "A WhatsApp status/story that passive-aggressively hints at the unpaid debt without naming names.",
        "A LINE OpenChat message in a semi-formal group (e.g., a campus organization or work committee).",
        "A Telegram group message with inline formatting — the sender uses *bold* and `code blocks` to organize the bill.",
        "A direct message to the group admin asking them to remind everyone else, rather than confronting people directly.",
        "A follow-up message sent after the original bill post was ignored for 48+ hours. Tone has escalated.",
    ],
}

def get_random_seed():
    formats, weights = zip(*FORMATS)
    chosen_format = random.choices(formats, weights=weights, k=1)[0]
    
    return {
        "persona": random.choice(SEEDS["personas"]),
        "scenario": random.choice(SEEDS["scenarios"]),
        "complication": random.choice(SEEDS["complications"]),
        "format_style": chosen_format,
        "entity_constraint": random.choice(SEEDS["entity_constraints"]),
        "channel": random.choice(SEEDS["channel"])
    }
    
SYSTEM_PROMPT = """You are an expert NLP data synthesizer and a native Indonesian speaker who is highly familiar with Gen Z and Millennial WhatsApp chat culture. 
Your task is to generate diverse Indonesian text messages regarding splitting group bills. 
Crucially, you must adapt your writing style to strictly match the requested format—seamlessly switching between highly complex, emotional chat paragraphs and extremely dry, rigid ledger lists as instructed.
Output ONLY a raw JSON array. Do not use markdown blocks."""

def build_prompt(seed, anti_repeat_block, examples_block):
    return f"""Generate 3 unique JSON objects. 

### YOUR ASSIGNED CONTEXT FOR THIS BATCH:
- **Speaker Persona:** {seed['persona']}
- **Scenario:** {seed['scenario']}
- **Social Complication:** {seed['complication']}
- **OUTPUT FORMAT/STYLE:** {seed['format_style']}
- **Entity Constraint:** {seed['entity_constraint']}
- **Message Channel:** {seed['channel']}

{anti_repeat_block}

### CRITICAL INSTRUCTION: USE EXACT PLACEHOLDERS
Do NOT invent names, foods, or prices. You MUST use these exact bracketed placeholders in the text:
- People: [PERSON_1] through [PERSON_8] (Use only as many as needed)
- Objects/Services: [ITEM_1] through [ITEM_6] (Use only as many as needed)
- Money/Prices: [PRICE_1] through [PRICE_8] (Use only as many as needed)

>>> MANDATORY NUMBERING RULE <<<
For EVERY single JSON object/message you generate, you MUST restart the placeholder numbering from 1. 
Object 1 must start with [PERSON_1], [ITEM_1], etc. 
Object 2 MUST ALSO start with [PERSON_1], [ITEM_1], etc. 
Do NOT continue the counter across different messages in the array!

Note: Keep multipliers as natural words (e.g., 'bagi 3', 'patungan').

### CONSTRAINTS FOR REALISM & DIVERSITY:
1. ADAPT TO THE FORMAT STYLE (CRITICAL): The `format_style` overrides the persona. If the style is 'LIST_ONLY', strictly output a receipt-like list. ZERO conversational filler. No yapping, no storytelling.
2. You MUST adopt the Assigned Persona and Context perfectly, UNLESS restricted by the LIST_ONLY format.
3. LET THE CHANNEL SHAPE THE TONE: A 1-on-1 message is direct and personal. A large group chat is slightly more performative. A follow-up after 48 hours ignored has escalated frustration. A WhatsApp status has no direct addressee.
4. TEMPLATE BUSTING (MANDATORY): NEVER start sentences with "Bro", "Eh", "Guys", "Yo", or "Wkwk". Jump straight into the thought.
5. LOGICAL MATH & MULTIPLIERS (MANDATORY): If you use a multiplier phrase like 'bagi 5', the implied group size MUST actually be 5. Do not hallucinate 'bagi 7' if the text only involves 2 or 3 people. The number of [PERSON_X] placeholders used must logically align with the multiplier.
6. ENTITIES TO EXTRACT: 
   - `PERSON`: The exact string '[PERSON_X]' or pronouns (dia, cowoknya).
   - `ITEM`: The exact string '[ITEM_X]'.
   - `PRICE`: The exact string '[PRICE_X]'.
   - `MULTIPLIER`: Phrases indicating division ('bagi 3', 'berempat', 'masing-masing').
     
### JSON SCHEMA ENFORCEMENT (CRITICAL)
Every single object in the JSON array MUST have exactly two keys:
1. "raw_text": The generated text message.
2. "entities": An array of objects mapping the placeholders, with exactly two keys:
   - "entity": The TYPE of the entity. This MUST be exactly one of: "PERSON", "ITEM", "PRICE", or "MULTIPLIER".
   - "value": The exact string or placeholder found in the text (e.g., "[PERSON_1]", "[PRICE_2]", "bagi 6").
NEVER use "message" as a key. Do NOT forget the entities array.

### TARGET FORMAT EXAMPLE (USE THIS STRUCTURE):
[
{examples_block}
]

Start directly with '['."""

def clean_json_response(text):
    """Strips markdown code blocks if the model ignores the system prompt."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

master_dataset = []

if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        master_dataset = json.load(f)
    print(f"Resuming from {len(master_dataset)} existing records.")

# MOD 6: Added top_k=40 to prevent degenerate loops
generation_config = types.GenerateContentConfig(
    system_instruction=SYSTEM_PROMPT,
    temperature=1.2, 
    top_p=0.95,
    top_k=40,
    max_output_tokens=8192,
)

for i in range(BATCHES):
    print(f"\n--- Generating batch {i + 1}/{BATCHES} ---")
    
    current_seed = get_random_seed()
    
    # anti repeat block extraction
    recent_openings = [r['raw_text'][:40] for r in master_dataset[-10:] if 'raw_text' in r]
    anti_repeat_block = ""
    if recent_openings:
        banned_list = "\n".join(f'- "{o}..."' for o in recent_openings)
        anti_repeat_block = f"### BANNED OPENING PATTERNS (do NOT start with these or similar):\n{banned_list}"
    
    # fetch correct sample dynamically
    format_key = current_seed['format_style'].split(":")[0]
    relevant_examples = [e for e in EXAMPLE_POOL if e.get('format') == format_key]
    
    if relevant_examples:
        chosen_example = random.choice(relevant_examples)
        display_example = {k: v for k, v in chosen_example.items() if k != 'format'}
        examples_block = json.dumps(display_example, indent=2)
    else:
        examples_block = '  // Generate exactly as instructed by the schema without anchoring'

    print(f"Seeding -> Format: {format_key}\nConstraint: {current_seed['entity_constraint']}\nPersona: {current_seed['persona']}\ncomplication: {current_seed['complication']}")
    
    seeded_prompt = build_prompt(current_seed, anti_repeat_block, examples_block)
    
    try:
        response_stream = client.models.generate_content_stream(
            model="gemma-4-31b-it", 
            contents=seeded_prompt,
            config=generation_config
        )
        
        raw_output = ""
        print("Generating JSON: ", end="", flush=True)

        for chunk in response_stream:
            if chunk.text:
                print(chunk.text, end="", flush=True) 
                raw_output += chunk.text              
        
        print("\nStream complete. Parsing JSON...")
        
        cleaned_output = clean_json_response(raw_output)
        batch_data = json.loads(cleaned_output)
        master_dataset.extend(batch_data)
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(master_dataset, f, indent=2, ensure_ascii=False)
            
        print(f"Success! Saved {len(batch_data)} records. Total: {len(master_dataset)}")
        
    except json.JSONDecodeError:
        print("JSON Parsing Error. Skipping batch.")
    except Exception as e:
        print(f"API Error: {e}")
        time.sleep(5) 
        
    time.sleep(1) 

print("\n🎉 Data generation complete!")