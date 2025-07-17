import subprocess
import pandas as pd
import sys
import os

# Constants
EXCEL_FILE = "../Thematic-Analysis-Complete.xlsm"
ORIENT = "records"
OUTPUT_FOLDER = "json_files"

# Sheet config: sheet_name -> config dict
SHEETS_TO_EXPORT = {
    "Tool Data": {
        "filename": "tool.json",
        "start_row": 4
    },
    "Thematic Analysis": {
        "filename": "thematic_analysis.json",
        "start_row": 8
    },
    "Risk Matrix": {
        "filename": "risk_matrix.json",
        "start_row": 3
    },
}

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

def install_module(module_name):
    """Install a Python module using pip."""
    print(f"Installing {module_name}...")
    subprocess.run([sys.executable, "-m", "pip", "install", module_name], check=True)

def excel_to_json(excel_file, sheet_name, start_row, orient, output_json_file):
    """Convert a sheet in an Excel file to a JSON file."""
    try:
        df = pd.read_excel(excel_file, sheet_name=sheet_name, skiprows=range(start_row - 1))
        json_data = df.to_json(orient=orient)
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)
        with open(output_json_file, 'w', encoding='utf-8') as json_file:
            json_file.write(json_data)
        print(f"{sheet_name} -> {output_json_file}")
    except Exception as e:
        print(f"Error converting {sheet_name}: {e}")

if __name__ == "__main__":
    try:
        import pandas as pd
    except ImportError:
        install_message()
        exit(1)  # Exit if dependencies are not installed

    try:
        import openpyxl
    except ImportError:
        install_message()
        exit(1)  # Exit if dependencies are not installed

    # Process each sheet in the configuration
    for sheet_name, settings in SHEETS_TO_EXPORT.items():
        output_path = os.path.join(OUTPUT_FOLDER, settings["filename"])
        excel_to_json(EXCEL_FILE, sheet_name, settings["start_row"], ORIENT, output_path)
