# 01/09/2024
# Nigel Galbraith
# ncg33@arastudent.ac.nz

# Python web update tool


import subprocess
import shutil
import os

# Define Constants
IMPORT_PYTHON = "import-Tool-Data.py"
CLEAN_PYTHON = "clean-Tool-Data.py"
FILE_TO_DEST = {
                "json_files/toolJSON.js": "../SearchTool/src",
                "json_files/thematic_analysisJSON.js": "../WebAnalysis/src"
                }


def run_script(script_name):
    """Run a Python script using 'python' or fallback to 'python3'."""
    for python_cmd in ["python", "python3"]:
        try:
            subprocess.run([python_cmd, script_name], check=True)
            print(f"Successfully ran {script_name} with {python_cmd}")
            return
        except FileNotFoundError:
            print(f"{python_cmd} not found, trying next...")
        except subprocess.CalledProcessError as e:
            print(f"Script {script_name} failed with {python_cmd}: {e}")
            exit(1)
    print(f"Neither 'python' nor 'python3' could run {script_name}")
    exit(1)


def copy_file(source, destination_dir):
    """Copy a file from source to destination directory."""
    try:
        if not os.path.exists(destination_dir):
            os.makedirs(destination_dir)

        destination_file = os.path.join(destination_dir, os.path.basename(source))

        print(f"Source file path: {os.path.abspath(source)}")
        print(f"Destination file path: {os.path.abspath(destination_file)}")

        shutil.copy(source, destination_file)
        print(f"Successfully copied {source} to {destination_file}")
    except shutil.Error as e:
        print(f"Error copying {source} to {destination_file}: {e}")
        exit(1)
    except FileNotFoundError as e:
        print(f"FileNotFoundError: {e}")
        exit(1)
        

if __name__ == "__main__":
    run_script(IMPORT_PYTHON)
    run_script(CLEAN_PYTHON)

    for source_file, dest_dir in FILE_TO_DEST.items():
        copy_file(source_file, dest_dir)


    print(os.getcwd())
