import subprocess
import sys
import os
import json
import platform

# Define constants
EXCEL_FILE = "../ExcelSheet/BCIS302-Modules.xlsx"
SHEET_NAMES = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10",
               "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20",
               "M21", "M22", "M23", "M24", "M25", "M26", "M27", "M28", "Final"]
START_ROW = 2 
ORIENT = "records"
OUTPUT_FOLDER = "json_files"
OUTPUT_JSON_FILE = os.path.join(OUTPUT_FOLDER, "QuizData.json")

def install_message():
    """Function to display a message about missing dependencies."""
    print("Required libraries 'pandas' and 'openpyxl' are not installed.")
    print("To install them, use one of the following options:")
    print("1. On a Debian-based system (e.g., Ubuntu, Debian):")
    print("   sudo apt install python3-pandas python3-openpyxl")
    print("2. If you wish to use pip in a virtual environment:")
    print("   python3 -m venv myenv")
    print("   source myenv/bin/activate")
    print("   pip install pandas openpyxl")


def excel_to_json(excel_file, sheet_names, start_row, orient, output_json_file):
    """Convert multiple Excel sheets to a single JSON file."""
    try:
        combined_data = {}

        for sheet_name in sheet_names:
            df = pd.read_excel(excel_file, sheet_name=sheet_name, skiprows=range(start_row - 1))
            combined_data[sheet_name] = df.to_dict(orient=orient)

        os.makedirs(OUTPUT_FOLDER, exist_ok=True)

        with open(output_json_file, 'w', encoding='utf-8') as json_file:
            json.dump(combined_data, json_file, indent=4)
        print("Combined JSON file created successfully.")
    except FileNotFoundError:
        print(f"File not found: {excel_file}")
    except Exception as e:
        print(f"Error converting Excel to JSON: {e}")

if __name__ == "__main__":
    try:
        import pandas as pd
        import openpyxl
    except ImportError:
        install_message()
        exit(1)  # Exit if dependencies are not installed

    excel_to_json(EXCEL_FILE, SHEET_NAMES, START_ROW, ORIENT, OUTPUT_JSON_FILE)
