# Nigel Galbraith
# ncg33@arastudent.ac.nz
# 23/05/2024

# Python Excel sheet --> JSON importer

import json

# Define constants
TOOL_CONFIG = {
    "input": "json_files/tool.json",
    "output_json": "json_files/tool-clean.json",
    "output_js": "json_files/toolJSON.js",
    "prefix": "jsonData",
    "split_one": ["Concern", "Tech Concepts", "Organizational Value"],
    "split_two": ["Tech Layers"],
    "split_three": ["Possible Solution"],
    "broad_tech": "Organizational Value",
    "tech_concept": "Tech Concepts",
    "tech_layer": "Tech Layers",
    "possible_solution": "Possible Solution",
    "challenge": "Concern",
    "concepts_key": "Concepts",
    "title_key": "Concern"
}

CONFIG_LIST = [TOOL_CONFIG]

NEWLINE = "\n"
DOUBLE_NEWLINE = "\n\n"
KEY_TECH_CHALL = "Concern"
ITEM_IGNORE_VALUE = ["AI", "5G", "ID", "BDAA", "(ICT)", "and"]
SPECIFIC_TEXT_REMOVE = ["\u00a0"]


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
            # Ensure_ascii=False to handle non-ASCII characters
            json.dump(data, file, ensure_ascii=False, indent=4)  
        print(f"JSON data written to {file_path}")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
        

def trim_spaces_in_keys(data):
    """Recursively remove leading and trailing spaces from all keys in the given JSON object."""
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            new_key = key.strip()
            new_data[new_key] = trim_spaces_in_keys(value)
        return new_data
    elif isinstance(data, list):
        return [trim_spaces_in_keys(item) for item in data]
    else:
        return data


def remove_text_from_json(data, texts_to_remove):
    """Remove specific texts from any key or value within the JSON data."""
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            new_key = key
            if isinstance(key, str):
                for text_to_remove in texts_to_remove:
                    new_key = new_key.replace(text_to_remove, '')  
            new_value = remove_text_recursive(value, texts_to_remove)  
            new_data[new_key] = new_value
        return new_data
    elif isinstance(data, list):
        return [remove_text_from_json(item, texts_to_remove) for item in data]
    else:
        return data
    

def remove_text_recursive(data, texts_to_remove):
    """Recursively remove specific texts from any value within the JSON data."""
    if isinstance(data, dict):
        return {k: remove_text_recursive(v, texts_to_remove) for k, v in data.items()}
    elif isinstance(data, list):
        return [remove_text_recursive(item, texts_to_remove) for item in data]
    elif isinstance(data, str):
        for text_to_remove in texts_to_remove:
            data = data.replace(text_to_remove, '')
        return data
    else:
        return data


def apply_title_with_ignore(text, ignore_list):
    """Apply title case to a text while ignoring specified words."""
    words = text.split()
    for i, word in enumerate(words):
        if word.lower() not in [item.lower() for item in ignore_list]:
            words[i] = word.capitalize()
        else:
            words[i] = word
    return ' '.join(words)


def title_key_list_values(data, target_key, ignore_list=None):
    """Apply title case to the values under the specified key, ignoring specified words."""
    if ignore_list is None:
        ignore_list = []
    for entry in data:
        if target_key in entry and isinstance(entry[target_key], list):
            entry[target_key] = [apply_title_with_ignore(item, ignore_list) for item in entry[target_key]]
    return data


def split_values(json_data, keys_to_split, separator):
    """Split specified values into lists based on character."""
    for entry in json_data:
        for key in keys_to_split:
            if key in entry:
                value = entry[key]
                if isinstance(value, str):
                    entry[key] = value.split(separator)
                elif isinstance(value, list) and len(value) == 1 and isinstance(value[0], str) and separator in value[0]:
                    entry[key] = value[0].split(separator)
                    

def associate_keys_list(json_data, first_key, second_key, list_name):
    """Associate each list value in one key with each list value another keys."""
    for entry in json_data:
        if first_key in entry and second_key in entry:
            if entry[first_key] and entry[second_key]:
                values_from_first_key = entry[first_key]
                values_from_second_key = entry[second_key]
                new_list = []
                for val_one, val_two in zip(values_from_first_key, values_from_second_key):
                    new_list.append({first_key: val_one, second_key: val_two})
                entry[list_name] = new_list
                del entry[first_key]
                del entry[second_key]


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
        

def add_values_to_key(json_data, key_loc, values_key):
    """Add values to each key location."""
    for entry in json_data:
        if key_loc in entry and values_key in entry:
            keys_list = entry[key_loc]
            values = entry[values_key]
            for key_dict, value in zip(keys_list, values):
                key_dict[values_key] = value
            del entry[values_key]
            
if __name__ == "__main__":
    for config in CONFIG_LIST:
        data = read_json(config["input"])

        if data:
            # Clean keys
            data = trim_spaces_in_keys(data)
            data = remove_text_from_json(data, SPECIFIC_TEXT_REMOVE)

            # Split values into lists
            split_values(data, config["split_one"], NEWLINE)
            split_values(data, config["split_two"], NEWLINE)
            split_values(data, config["split_three"], NEWLINE)

            # Associate key pairs into new structure
            associate_keys_list(data, config["broad_tech"], config["tech_concept"], config["concepts_key"])
            add_values_to_key(data, config["concepts_key"], config["possible_solution"])
            add_values_to_key(data, config["concepts_key"], config["tech_layer"])
            add_values_to_key(data, config["concepts_key"], config["challenge"])

            # Apply title casing with exceptions
            data = title_key_list_values(data, config["title_key"], ITEM_IGNORE_VALUE)

            # Write cleaned JSON
            write_json(data, config["output_json"])

            # Add JS prefix and write to .js file
            add_prefix_to_json(config["output_json"], config["output_js"], config["prefix"])
