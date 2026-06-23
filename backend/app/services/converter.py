import re
from difflib import get_close_matches
from app.services.dictionary import DICTIONARY, WORD_GUIDE


PUNCTUATION_MAP = {
    ".": "।",
    "?": "?",
    "!": "!",
    ",": ",",
    ":": ":",
    ";": ";"
}

DICTIONARY_KEYS = list(DICTIONARY.keys())


# Long patterns first. This works like a small phonetic engine.
PHONETIC_MAP = [
    ("kkh", "ক্ষ"),
    ("ng", "ং"),
    ("kh", "খ"),
    ("gh", "ঘ"),
    ("ch", "চ"),
    ("jh", "ঝ"),
    ("th", "থ"),
    ("dh", "ধ"),
    ("ph", "ফ"),
    ("bh", "ভ"),
    ("sh", "শ"),
    ("ss", "ষ"),
    ("oo", "ু"),
    ("ou", "ৌ"),
    ("oi", "ৈ"),
    ("aa", "া"),
    ("ee", "ী"),
    ("ii", "ী"),
    ("ai", "াই"),
    ("au", "াউ"),
    ("a", "া"),
    ("b", "ব"),
    ("c", "ক"),
    ("d", "দ"),
    ("e", "ে"),
    ("f", "ফ"),
    ("g", "গ"),
    ("h", "হ"),
    ("i", "ি"),
    ("j", "জ"),
    ("k", "ক"),
    ("l", "ল"),
    ("m", "ম"),
    ("n", "ন"),
    ("o", "ো"),
    ("p", "প"),
    ("q", "ক"),
    ("r", "র"),
    ("s", "স"),
    ("t", "ত"),
    ("u", "ু"),
    ("v", "ভ"),
    ("w", "ও"),
    ("x", "ক্স"),
    ("y", "য়"),
    ("z", "জ")
]


def tokenize(text: str):
    return re.findall(r"[A-Za-z]+|[\u0980-\u09FF]+|[0-9]+|[^\w\s]", text, re.UNICODE)


def is_english_word(token: str):
    return bool(re.fullmatch(r"[A-Za-z]+", token))


def is_bangla_word(token: str):
    return bool(re.search(r"[\u0980-\u09FF]", token))


def phonetic_convert(word: str):
    """
    Fallback transliteration.
    Not Avro-level perfect, but much better than returning English word.
    """
    word = word.lower()
    result = ""
    i = 0

    while i < len(word):
        matched = False

        for pattern, bangla in PHONETIC_MAP:
            if word.startswith(pattern, i):
                result += bangla
                i += len(pattern)
                matched = True
                break

        if not matched:
            result += word[i]
            i += 1

    # Clean common awkward starting vowel signs
    if result.startswith("া"):
        result = "আ" + result[1:]
    elif result.startswith("ি"):
        result = "ই" + result[1:]
    elif result.startswith("ী"):
        result = "ঈ" + result[1:]
    elif result.startswith("ু"):
        result = "উ" + result[1:]
    elif result.startswith("ে"):
        result = "এ" + result[1:]
    elif result.startswith("ো"):
        result = "ও" + result[1:]

    return result


def smart_match(word: str):
    clean_word = word.lower().strip()

    # 1. Exact dictionary match
    if clean_word in DICTIONARY:
        return DICTIONARY[clean_word]

    # 2. Fuzzy match only for long words
    # Short words fuzzy করলে wrong output বেশি হয়
    if len(clean_word) >= 4:
        matches = get_close_matches(clean_word, DICTIONARY_KEYS, n=1, cutoff=0.88)
        if matches:
            return DICTIONARY[matches[0]]

    # 3. Phonetic fallback
    return phonetic_convert(clean_word)


def join_tokens(tokens):
    output = ""

    for token in tokens:
        if token in PUNCTUATION_MAP.values() or token in ["?", "!", ",", ":", ";"]:
            output = output.rstrip() + token + " "
        else:
            output += token + " "

    return output.strip()


def convert_text(text: str) -> str:
    tokens = tokenize(text)
    converted_tokens = []

    for token in tokens:
        if token in PUNCTUATION_MAP:
            converted_tokens.append(PUNCTUATION_MAP[token])

        elif is_english_word(token):
            converted_tokens.append(smart_match(token))

        elif is_bangla_word(token):
            converted_tokens.append(token)

        else:
            converted_tokens.append(token)

    return join_tokens(converted_tokens)


def get_suggestions(prefix: str, limit: int = 8):
    prefix = prefix.lower().strip()

    if not prefix:
        return []

    starts = [word for word in DICTIONARY_KEYS if word.startswith(prefix)]
    contains = [word for word in DICTIONARY_KEYS if prefix in word and word not in starts]

    fuzzy = []
    if len(prefix) >= 2:
        fuzzy = get_close_matches(prefix, DICTIONARY_KEYS, n=limit, cutoff=0.55)

    combined = list(dict.fromkeys(starts + contains + fuzzy))

    return [
        {
            "banglish": word,
            "bangla": DICTIONARY[word]
        }
        for word in combined[:limit]
    ]


def get_word_guide(text: str):
    words = re.findall(r"[A-Za-z]+", text.lower())
    guide = []

    for word in words:
        if word in WORD_GUIDE:
            item = WORD_GUIDE[word]
            guide.append({
                "banglish": word,
                "bangla": item.get("bangla", DICTIONARY.get(word, word)),
                "meaning": item.get("meaning", "Meaning not available"),
                "type": item.get("type", "word"),
                "example": item.get("example", f"{word} → {DICTIONARY.get(word, word)}")
            })

        elif word in DICTIONARY:
            guide.append({
                "banglish": word,
                "bangla": DICTIONARY[word],
                "meaning": "Known Banglish word",
                "type": "word",
                "example": f"{word} → {DICTIONARY[word]}"
            })

        else:
            predicted = phonetic_convert(word)
            guide.append({
                "banglish": word,
                "bangla": predicted,
                "meaning": "Auto-generated phonetic output",
                "type": "predicted",
                "example": f"{word} → {predicted}"
            })

    return guide


def generate_sentences(seed: str):
    words = re.findall(r"[A-Za-z]+", seed.lower())

    if words:
        word = words[-1]
    else:
        word = "bangla"

    bangla_word = DICTIONARY.get(word, phonetic_convert(word))

    return [
        {
            "level": "Short",
            "english": f"I use {word}.",
            "bangla": f"আমি {bangla_word} ব্যবহার করি।"
        },
        {
            "level": "Medium",
            "english": f"I am learning {word}.",
            "bangla": f"আমি {bangla_word} শিখছি।"
        },
        {
            "level": "Long",
            "english": f"I use {word} because it helps me communicate better.",
            "bangla": f"আমি {bangla_word} ব্যবহার করি কারণ এটি আমাকে ভালোভাবে যোগাযোগ করতে সাহায্য করে।"
        }
    ]