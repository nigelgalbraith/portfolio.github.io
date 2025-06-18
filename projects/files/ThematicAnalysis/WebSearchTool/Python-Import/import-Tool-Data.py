import subprocess
import pandas as pd
import sys
import os

# Define constants
EXCEL_FILE = "Thematic-Analysis.xlsm"
SHEET_NAME = "Tool Data"
START_ROW = 3 
ORIENT = "records"
OUTPUT_FOLDER = "json_files"
OUTPUT_JSON_FILE = os.path.join(OUTPUT_FOLDER, "tool.json")


def install_pip():
    """ Function to install pip, runs a subprocess sys sys.executable """
    print("Pip is not installed. Installing...")
    subprocess.run([sys.executable, "-m", "ensurepip"])


def install_module(module_name):
    """ Function to install the module that is passed,runs a subprocess python sys.executable """
    print(f"{module_name} is not installed. Installing...")
    subprocess.run(["python.exe", "-m", "pip", "install", module_name])
    

def excel_to_json(excel_file, sheet_name, start_row, orient, output_json_file):
    """ Function to read the excell spreadsheet and save it to a file location """
    try:
        # Set work sheet variables
        df = pd.read_excel(excel_file, sheet_name=sheet_name, skiprows=range(start_row - 1))
        json_data = df.to_json(orient=orient)
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)

        # read in file, write to location
        with open(output_json_file, 'w', encoding='utf-8') as json_file:
            json_file.write(json_data)
        print("JSON file created successfully.")
    except Exception as e:
        print(f"Error converting Excel to JSON: {e}")

if __name__ == "__main__":
    # Check if modules need installation
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

    # Run the excel read function with required variables
    excel_to_json(EXCEL_FILE, SHEET_NAME, START_ROW, ORIENT, OUTPUT_JSON_FILE)
