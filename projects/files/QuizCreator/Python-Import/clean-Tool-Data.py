# 01/09/2024
# Nigel Galbraith
# ncg33@arastudent.ac.nz

# Python json clean tool


import json
from collections import defaultdict

# Define constants
INPUT_JSON_FILE = "json_files/QuizData.json"
OUTPUT_JSON_FILE = "json_files/QuizData-clean.json"
OUTPUT_JS_FILE = "json_files/QuizData-JSON.js"
KEYS_TO_SPLIT = ["Multiple Answers", "Correct Answer"]
JSON_PREFIX = "jsonData"
SEPARATOR = "\n"
SPECIFIC_TEXT_REMOVE = ["\u00a0"]
MAIN_KEY="Module"
GROUP_BY_KEYS = ["Module", "Module Name"]
SUB_GROUP_BY_KEY = "Questions"
SUB_KEY_FIELDS = ["ID", "Question", "Multiple Answers", "Correct Answer", "Explanation"]


def read_json(file_path):
    """Read JSON data from file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            json_data = json.load(file)
        return json_data
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return None
    

def write_json(data, file_path):
    """Write JSON data to file."""
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
        print(f"JSON data written to {file_path}")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
        

def transform_field_to_list(data, fields_to_transform, separator):
    """Transform specified fields into lists."""
    for field in fields_to_transform:
        for item in data:
            if field in item and isinstance(item[field], str):
                cleaned_field = item[field].replace('"', '').strip()
                item[field] = [x.strip() for x in cleaned_field.split(separator)]
                item[field] = [int(x) if x.isdigit() else x for x in item[field]]
    return data



def group_data_by_keys(data, group_by_keys, sub_group_by_key, sub_key_fields):
    """Group data by specified keys and include only the specified fields."""
    grouped_data = defaultdict(lambda: {sub_group_by_key: []})
    
    for item in data:
        group_key = tuple(item.get(key, '') for key in group_by_keys)
        entry = {field: item[field] for field in sub_key_fields}
        grouped_data[group_key][sub_group_by_key].append(entry)
    
    result = []
    for key, value in grouped_data.items():
        entry = {k: v for k, v in zip(group_by_keys, key)}
        entry[sub_group_by_key] = value[sub_group_by_key]
        result.append(entry)
    
    return result


def add_prefix_to_json(input_json_file, output_js_file, prefix):
    """Add a prefix to define a JSON file and save it as a .js file."""
    try:
        with open(input_json_file, "r", encoding='utf-8') as file:
            json_data = file.read()
        prefixed_json_data = f"const {prefix} = {json_data};"
        with open(output_js_file, "w", encoding='utf-8') as file:
            file.write(prefixed_json_data)
        print("Prefix added successfully.")
    except Exception as e:
        print(f"Error adding prefix to JSON: {e}")


def process_data(input_data, main_key, group_by_keys, sub_group_by_keys, keys_to_split, seperator, sub_key_fields):
    """Process and clean the data."""
    processed_data = []
    for module_key, items in input_data.items():
        for item in items:
            processed_item = dict(item)
            if isinstance(item.get(main_key), int):
                processed_item[main_key] = item[main_key]
            else:
                processed_item[main_key] = str(item[main_key])
            processed_data.append(processed_item)
    
    processed_data = transform_field_to_list(processed_data, keys_to_split, seperator)
    
    return group_data_by_keys(processed_data, group_by_keys, sub_group_by_keys, sub_key_fields)


if __name__ == "__main__":
    data = read_json(INPUT_JSON_FILE)

    if data:
        grouped_data = process_data(data, MAIN_KEY, GROUP_BY_KEYS, SUB_GROUP_BY_KEY, KEYS_TO_SPLIT, SEPARATOR, SUB_KEY_FIELDS)
        write_json(grouped_data, OUTPUT_JSON_FILE)
        add_prefix_to_json(OUTPUT_JSON_FILE, OUTPUT_JS_FILE, JSON_PREFIX)
