import json
from collections import defaultdict

#Constants
TOOL_INPUT_JSON = "json_files/tool.json"
TOOL_OUTPUT_JSON = "json_files/tool-clean.json"
TOOL_OUTPUT_JS = "json_files/toolJSON.js"
TOOL_KEYS_TO_SPLIT = ["Factors", "Catergories", "Sub Groups", "Groups", "Sub Catergories"]
TOOL_JSON_PREFIX = "jsonData"
TOOL_GROUP_BY_KEYS = ["ID", "Extracts"]
TOOL_SUB_KEY_FIELDS = ["Sub Groups", "Catergories", "Groups", "Sub Catergories", "Factors"]
TOOL_SUB_GROUP_KEY = "Wrapper"

THEMATIC_INPUT_JSON = "json_files/thematic_analysis.json"
THEMATIC_OUTPUT_JSON = "json_files/thematic_analysis_clean.json"
THEMATIC_OUTPUT_JS = "json_files/thematic_analysisJSON.js"
THEMATIC_KEYS_TO_SPLIT = ["Factors", "Groups", "Sub Groups", "Glossary Check"]
THEMATIC_JSON_PREFIX = "jsonDataThematic"
THEMATIC_GROUP_BY_KEYS = ["ID","References","Extracts","Facts"]
THEMATIC_SUB_KEY_FIELDS = ["Sub Groups", "Groups", "Factors"]

SEPARATOR = "\n"
TEXT_REMOVE = ["\u00a0"]


def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"JSON written to: {path}")

def add_prefix_to_json(input_path, output_path, prefix):
    with open(input_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"const {prefix} = {raw};")
    print(f"Prefixed JS written to: {output_path}")

def clean_text(text, to_remove):
    for r in to_remove:
        text = text.replace(r, "")
    return text.strip()

def transform_fields_to_lists(data, keys_to_split, separator):
    for item in data:
        for key in keys_to_split:
            if key in item and isinstance(item[key], str):
                parts = item[key].split(separator)
                item[key] = [p.strip() for p in parts if p.strip()]
    return data

def group_and_zip_concepts(data, group_by_keys, sub_group_key, sub_key_fields):
    grouped = defaultdict(dict)
    for item in data:
        group_key = tuple(item.get(k, '') for k in group_by_keys)
        for idx, k in enumerate(group_by_keys):
            grouped[group_key][k] = group_key[idx]

        lists = []
        for k in sub_key_fields:
            val = item.get(k, [])
            if isinstance(val, list):
                lists.append(val)
            else:
                # If the field exists but is not a list, treat as empty list
                lists.append([])

        lengths = [len(lst) for lst in lists if len(lst) > 0]
        if not lengths:
            n = 0
        else:
            n = min(lengths)

        concepts = []
        for i in range(n):
            concept_obj = {}
            for j, key in enumerate(sub_key_fields):
                # Defensive: if list shorter than n, skip or use empty string
                concept_obj[key] = lists[j][i] if i < len(lists[j]) else ""
            concepts.append(concept_obj)

        if sub_group_key in grouped[group_key]:
            grouped[group_key][sub_group_key].extend(concepts)
        else:
            grouped[group_key][sub_group_key] = concepts

    return list(grouped.values())


def split_fields(entry, keys_to_split, separator, remove_chars):
    for key in keys_to_split:
        if key in entry and isinstance(entry[key], str):
            cleaned = clean_text(entry[key], remove_chars)
            entry[key] = [s.strip() for s in cleaned.split(separator) if s.strip()]
    return entry

def clean_simple_list(data, keys_to_split, separator, remove_chars):
    return [split_fields(item, keys_to_split, separator, remove_chars) for item in data]


if __name__ == "__main__":
    try:
        tool_data = read_json(TOOL_INPUT_JSON)
        tool_data = transform_fields_to_lists(tool_data, TOOL_KEYS_TO_SPLIT, SEPARATOR)
        grouped_tool_data = group_and_zip_concepts(tool_data, TOOL_GROUP_BY_KEYS, TOOL_SUB_GROUP_KEY, TOOL_SUB_KEY_FIELDS)
        write_json(grouped_tool_data, TOOL_OUTPUT_JSON)
        add_prefix_to_json(TOOL_OUTPUT_JSON, TOOL_OUTPUT_JS, TOOL_JSON_PREFIX)
    except Exception as e:
        print(f"Error processing tool.json: {e}")

    try:
        thematic_data = read_json(THEMATIC_INPUT_JSON)
        thematic_data = clean_simple_list(thematic_data, THEMATIC_KEYS_TO_SPLIT, SEPARATOR, TEXT_REMOVE)
        write_json(thematic_data, THEMATIC_OUTPUT_JSON)
        add_prefix_to_json(THEMATIC_OUTPUT_JSON, THEMATIC_OUTPUT_JS, THEMATIC_JSON_PREFIX)
    except Exception as e:
        print(f"Error processing thematic_analysis.json: {e}")
