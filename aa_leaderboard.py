import re
import time
from typing import Any, Dict, List, Tuple

import requests
from bs4 import BeautifulSoup
from copy import deepcopy
import json

AA_LEADERBOARD_URL = "https://artificialanalysis.ai/leaderboards/models"


def fetch_leaderboard_html(timeout: int = 15) -> str:
    """
    Fetches the leaderboard HTML content from Artificial Analysis.
    Returns the raw HTML string.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }

    # Add a small delay to be respectful to the server
    time.sleep(0.1)

    resp = requests.get(AA_LEADERBOARD_URL, timeout=timeout, headers=headers)
    resp.raise_for_status()
    print(f"Status: {resp.status_code}")
    print(f"Content length: {len(resp.text)}")

    # Save to file for debugging
    with open("aa_debug_full.html", "w", encoding="utf-8") as f:
        f.write(resp.text)  # Full content
    print("Saved full content to aa_debug_full.html")

    # Also save first 50k chars
    with open("aa_debug.html", "w", encoding="utf-8") as f:
        f.write(resp.text[:50000])  # First 50k chars for inspection
    print("Saved first 50k chars to aa_debug.html")

    return resp.text


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _combine_headers(header_rows: List[Any]) -> List[str]:
    # Process first header row (main categories)
    main_categories: List[str] = []
    for th in header_rows[0].find_all("th"):
        cell = deepcopy(th)
        for unwanted in cell.find_all(["button", "svg"]):
            unwanted.decompose()
        text = _normalize_text(cell.get_text(separator=" "))
        colspan = int(th.get("colspan", 1))
        main_categories.extend([text] * colspan)

    # Process second header row (sub categories)
    sub_categories: List[str] = []
    for th in header_rows[1].find_all("th"):
        cell = deepcopy(th)
        for unwanted in cell.find_all(["svg"]):
            unwanted.decompose()
        for unit_span in cell.find_all("span", class_=["text-xs", "text-slate-500"]):
            unit_span.decompose()
        text = _normalize_text(cell.get_text(separator=" "))
        colspan = int(th.get("colspan", 1))
        sub_categories.extend([text] * colspan)

    # Combine
    combined: List[str] = []
    for h1, h2 in zip(main_categories, sub_categories):
        if h1 and h1 != h2:
            combined.append(f"{h1}: {h2}")
        else:
            combined.append(h2)
    return combined


def html_table_to_markdown(html_content: str) -> str:
    """
    Converts the leaderboard HTML table to a Markdown table string.
    """
    soup = BeautifulSoup(html_content, "lxml")
    table = soup.find("table")
    if not table:
        return "No <table> tag found in the HTML snippet."

    thead = table.find("thead")
    if not thead:
        return "No <thead> tag found."

    header_rows = thead.find_all("tr")
    if len(header_rows) < 2:
        return "Error: Expected at least two <tr> in <thead>."

    combined_headers = _combine_headers(header_rows)

    lines: List[str] = []
    lines.append("| " + " | ".join(combined_headers) + " |")
    lines.append("| " + " | ".join(["---"] * len(combined_headers)) + " |")

    tbody = table.find("tbody")
    if tbody:
        for tr in tbody.find_all("tr"):
            cells = tr.find_all(["td", "th"])
            row_data: List[str] = []
            for cell in cells:
                text = _normalize_text(cell.get_text(separator=" "))
                text = text.replace("|", "&#124;")
                row_data.append(text)
            if len(row_data) == len(combined_headers):
                lines.append("| " + " | ".join(row_data) + " |")
    return "\n".join(lines)


def extract_inner_strings(html: str):
    """
    Capture the *quoted* payload inside self.__next_f.push([ 1, " ... " ])
    """
    return re.findall(
        r'self\.__next_f\.push\(\s*\[\s*\d+\s*,\s*"(.*?)"\s*\]\s*\)',
        html,
        re.DOTALL
    )


def unescape_payload(s: str) -> str:
    """
    Conservative unescape: handle the two common cases we see in Next payloads
    """
    return s.replace(r'\"', '"').replace(r'\\', '\\')


def find_models_fragment(inner_strings):
    """
    Unescape each fragment first; THEN look for "models":
    """
    for s in inner_strings:
        decoded = unescape_payload(s)
        if '"models":' in decoded:
            return decoded
    return None


def extract_models_array(decoded_text: str):
    """
    Find `"models":[` and bracket-balance to the matching `]`.
    Handles nested arrays/objects and quotes.
    """
    key = '"models":['
    i = decoded_text.find(key)
    if i == -1:
        return None, 'Could not find `"models":[` in decoded payload.'
    start = i + len('"models":')
    text = decoded_text

    depth = 0
    in_string = False
    escape = False
    array_started = False
    array_start = -1

    for k, ch in enumerate(text[start:], start=start):
        if not array_started:
            if ch == '[':
                array_started = True
                depth = 1
                array_start = k
            continue

        if in_string:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    return text[array_start:k+1], None
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1

    return None, "Bracket balancing failed; array not closed."


def parse_models_array(arr_text: str):
    """
    Parse the models array JSON with auto-repair for common issues
    """
    try:
        return json.loads(arr_text), None
    except json.JSONDecodeError:
        # Auto-fix two common issues:
        # 1) adjacent objects `}{` -> `},{`
        # 2) stray trailing commas before ] or }
        repaired = re.sub(r'(\}|\])\s*(\{)', r'\1,\2', arr_text)
        repaired = re.sub(r',\s*(\]|\})', r'\1', repaired)
        try:
            return json.loads(repaired), None
        except json.JSONDecodeError as e2:
            return None, f"JSON decode failed at pos {e2.pos}: {e2}"


def html_table_to_json(html_content: str) -> Dict[str, Any]:
    """
    Parses the leaderboard HTML and extracts the models JSON payload.
    Returns a dict with "headers" and "rows" suitable for downstream processing.
    """
    # Extract all self.__next_f.push() fragments
    inner_strings = extract_inner_strings(html_content)
    print(f"DEBUG: Found {len(inner_strings)} self.__next_f.push() fragments")

    # Find the fragment containing "models":
    decoded = find_models_fragment(inner_strings)
    if not decoded:
        print("DEBUG: No decoded fragment containing 'models': found")
        return {"headers": [], "rows": [], "error": "No models fragment found"}

    # Extract the models array using bracket balancing
    arr_text, err = extract_models_array(decoded)
    if err:
        print(f"DEBUG: {err}")
        return {"headers": [], "rows": [], "error": err}

    # Parse the JSON array
    models_data, perr = parse_models_array(arr_text)
    if perr:
        print(f"DEBUG: Parsing error: {perr}")
        # Save raw array for debugging
        with open("models_array_raw.txt", "w", encoding="utf-8") as f:
            f.write(arr_text)
        print("DEBUG: Raw array written to models_array_raw.txt")
        return {"headers": [], "rows": [], "error": perr}

    print(f"DEBUG: Successfully parsed {len(models_data)} models")

    # Build the table representation with all requested benchmark fields
    # Categories from user request: General Intelligence, Core Benchmarks, AIME, LCR/Reasoning, Specialized Leaderboards
    headers = [
        # Identity
        "Model",
        # General Intelligence Metrics
        "Intelligence Index",
        "Estimated Intelligence Index",
        "Intelligence Index per 1M Output Tokens",
        "Intelligence Index Is Estimated",
        # Core Benchmarks
        "GPQA",
        "HLE",
        "HumanEval",
        "Math 500",
        "MMLU Pro",
        "MMMU Pro",
        "IFBench",
        "SciCode",
        "LiveCodeBench",
        "Math Index",
        "Coding Index",
        "Agentic Index",
        # AIME (Math Olympiad)
        "AIME",
        "AIME 25",
        "Lab-Claimed AIME",
        "Lab-Claimed Math 500",
        # LCR / Reasoning Metrics
        "LCR",
        "TAU-2",
        # Specialized Leaderboards
        "TerminalBench Hard",
        "Multilingual AA",
    ]

    rows = []
    for model in models_data:
        # Compute derived/general intelligence helpers
        ii = model.get("intelligence_index", None)
        ii_est = model.get("estimated_intelligence_index", None)
        price_per_m_out = model.get("price_1m_output_tokens", None)
        try:
            ii_per_m = (float(ii) / float(price_per_m_out)) if (ii is not None and price_per_m_out not in (None, 0, "0")) else None
        except Exception:
            ii_per_m = None

        row = {
            # Identity
            "Model": model.get("name", ""),
            # General Intelligence Metrics
            "Intelligence Index": ii if ii is not None else "",
            "Estimated Intelligence Index": ii_est if ii_est is not None else "",
            "Intelligence Index per 1M Output Tokens": ii_per_m if ii_per_m is not None else "",
            "Intelligence Index Is Estimated": bool(ii is None and ii_est is not None),
            # Core Benchmarks
            "GPQA": model.get("gpqa", ""),
            "HLE": model.get("hle", ""),
            "HumanEval": model.get("humaneval", ""),
            "Math 500": model.get("math_500", ""),
            "MMLU Pro": model.get("mmlu_pro", ""),
            "MMMU Pro": model.get("mmmu_pro", ""),
            "IFBench": model.get("ifbench", ""),
            "SciCode": model.get("scicode", ""),
            "LiveCodeBench": model.get("livecodebench", ""),
            "Math Index": model.get("math_index", ""),
            "Coding Index": model.get("coding_index", ""),
            "Agentic Index": model.get("agentic_index", ""),
            # AIME (Math Olympiad)
            "AIME": model.get("aime", ""),
            "AIME 25": model.get("aime25", ""),
            "Lab-Claimed AIME": model.get("lab_claimed_aime", ""),
            "Lab-Claimed Math 500": model.get("lab_claimed_math_500", ""),
            # LCR / Reasoning Metrics
            "LCR": model.get("lcr", ""),
            "TAU-2": model.get("tau2", ""),
            # Specialized Leaderboards
            "TerminalBench Hard": model.get("terminalbench_hard", ""),
            "Multilingual AA": model.get("multilingual_aa", ""),
        }
        # Normalized name for easier joining later.
        name = model.get("name", "")
        if name:
            norm = re.sub(r"\(.*?\)", "", name)
            norm = norm.replace("\u00a0", " ")
            norm = re.sub(r"[^a-zA-Z0-9]+", "-", norm.lower()).strip("-")
            row["_normalized_name"] = norm
        rows.append(row)

    return {"headers": headers, "rows": rows}


def build_aa_index_map(rows: List[Dict[str, str]]) -> Dict[str, float]:
    """
    Builds a mapping from normalized model name to the AA Intelligence Index (as float when possible).
    Key is a normalized model string derived from the 'Model' column.
    """
    index_map: Dict[str, float] = {}

    # Identify the likely column names
    model_key_candidates = [
        "Model",
        "Features: Model",
    ]
    aa_index_candidates = [
        "Artificial Analysis Intelligence Index",
        "Intelligence: Artificial Analysis Intelligence Index",
        "Intelligence Index",
    ]

    def pick_key(candidates: List[str], row: Dict[str, str]) -> str:
        for c in candidates:
            if c in row:
                return c
        # fallback: find first candidate that matches case-insensitively
        lower_map = {k.lower(): k for k in row.keys()}
        for c in candidates:
            if c.lower() in lower_map:
                return lower_map[c.lower()]
        return candidates[0]

    for row in rows:
        model_key = pick_key(model_key_candidates, row)
        aa_key = pick_key(aa_index_candidates, row)
        model_name = row.get(model_key, "")
        aa_val_raw = row.get(aa_key, "")

        # Normalize model name by removing content in parentheses and trimming
        model_name_norm = re.sub(r"\(.*?\)", "", model_name)
        model_name_norm = model_name_norm.replace("\u00a0", " ")  # non-breaking spaces
        model_name_norm = re.sub(r"[^a-zA-Z0-9]+", "-", model_name_norm.lower()).strip(
            "-"
        )

        # Parse AA index which might be a percentage, number, or already parsed as float/int
        aa_val = None
        try:
            if isinstance(aa_val_raw, (int, float)):
                # Already a number
                aa_val = float(aa_val_raw)
            elif isinstance(aa_val_raw, str):
                # Remove % and commas from string
                cleaned = aa_val_raw.replace("%", "").replace(",", "").strip()
                if cleaned:
                    aa_val = float(cleaned)
        except Exception:
            aa_val = None

        if model_name_norm and aa_val is not None:
            index_map[model_name_norm] = aa_val

    return index_map


def get_leaderboard_data() -> Dict[str, Any]:
    """
    High-level helper to fetch and parse AA leaderboard.
    Returns a JSON dict with headers, rows, markdown, and an aa_index_map.
    """
    html = fetch_leaderboard_html()
    data_json = html_table_to_json(html)
    markdown = html_table_to_markdown(html)
    aa_index_map = build_aa_index_map(data_json.get("rows", []))
    return {
        "source_url": AA_LEADERBOARD_URL,
        "headers": data_json.get("headers", []),
        "rows": data_json.get("rows", []),
        "markdown": markdown,
        "aa_index_map": aa_index_map,
    }


if __name__ == "__main__":
    data = get_leaderboard_data()
    print(f"Headers: {data['headers'][:3]}")
    print(f"Rows: {len(data['rows'])}")
    if data["rows"]:
        print(f"Sample row keys: {list(data['rows'][0].keys())[:5]}")
