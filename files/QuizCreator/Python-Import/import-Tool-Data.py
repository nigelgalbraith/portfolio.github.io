# 21/08/2024
# Nigel Galbraith
# ncg33@arastudent.ac.nz

# Python Excel Import

import subprocess
import pandas as pd
import sys
import os
import json

# Define constants
EXCEL_FILE = "../ExcelSheet/BCIS302-Modules.xlsx"
SHEET_NAMES = ["M1",
               "M2",
               "M3",
               "M4",
               "M5",
               "M6",
               "M7",
               "M8",
               "M9",
               "M10",
               "M11",
               "M12",
               "M13",
               "M14",
               "M15",
               "M16",
               "M17",
               "M18",
               "M19",
               "M20",
               "M21",
               "M22",
               "M23",
               "M24",
               "M25",
               "M26",
               "M27",
               "M28",
               "Final"]
START_ROW = 2 
ORIENT = "records"
OUTPUT_FOLDER = "json_files"
OUTPUT_JSON_FILE = os.path.join(OUTPUT_FOLDER, "CyberOpsData.json")

def install_pip():
    """Function to install pip."""
    print("Pip is not installed. Installing...")
    subprocess.run([sys.executable, "-m", "ensurepip"], check=True)

def install_module(module_name):
    """Function to install a module."""
    print(f"{module_name} is not installed. Installing...")
    subprocess.run([sys.executable, "-m", "pip", "install", module_name], check=True)

def excel_to_json(excel_file, sheet_names, start_row, orient, output_json_file):
    """Function to convert multiple Excel sheets to a single JSON file."""
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
    except pd.errors.ExcelFileNotFoundError as e:
        print(f"Sheet not found in the Excel file: {e}")
    except Exception as e:
        print(f"Error converting Excel to JSON: {e}")

if __name__ == "__main__":
    try:
        import pandas as pd
    except ImportError:
        install_module("pandas")
        import pandas as pd
    try:
        import openpyxl
    except ImportError:
        install_module("openpyxl")
        import openpyxl
    import json

    excel_to_json(EXCEL_FILE, SHEET_NAMES, START_ROW, ORIENT, OUTPUT_JSON_FILE)
