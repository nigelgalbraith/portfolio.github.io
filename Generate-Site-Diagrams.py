import json
import subprocess
import sys
import shutil
from pathlib import Path

# === CONSTANTS ===

# File paths
JSON_FILE = "diagrams/siteHTML_structure.json"
MERMAID_FILE = "diagrams/siteHTML_diagram.mmd"
OUTPUT_FILE = "projects/images/main/original/siteHTML_diagram.png"

# Executables
NODE_COMMAND = "node"
MMDC_COMMAND = "mmdc"

# Mermaid config
MAIN_PAGES_LABEL = "SitePages"
PROJECT_PAGES_LABEL = "ProjectPages"
MAIN_PAGES_TITLE = "Main Pages"
PROJECT_PAGES_TITLE = "Project Pages"
HOME_NODE = "Home"
PROJECTS_NODE = "Projects"

# JSON keys
KEY_MAIN_PAGES = "main_pages"
KEY_PROJECT_PAGES = "project_pages"
KEY_LINKS = "links"

# Node links
LINK_FROM_HOME = ["About", "Resume", "Projects", "Contact"]

# === DEPENDENCY CHECKING ===

def ensure_dependency(command, install_instructions=None, install_callback=None):
    """Ensure a command exists; attempt install or show instructions if missing."""
    if shutil.which(command):
        return

    print(f"Missing required dependency: '{command}'.")

    if install_callback:
        print(f"Attempting to install '{command}'...")
        try:
            install_callback()
            return
        except subprocess.CalledProcessError:
            print(f"Automatic installation of '{command}' failed.")
    elif install_instructions:
        print(f"To install '{command}', follow these instructions:\n{install_instructions}")

    sys.exit(1)

def install_mermaid_cli():
    """Install Mermaid CLI using npm."""
    if not shutil.which("npm"):
        print(
            "Error: 'npm' command was not found.\n"
            "To fix this:\n"
            "  1. Install Node.js from https://nodejs.org (choose the LTS version).\n"
            "  2. During install, ensure the option to 'Add to PATH' is selected.\n"
            "  3. After installing, restart your terminal or computer.\n"
        )
        sys.exit(1)

    try:
        print("Running: npm install -g @mermaid-js/mermaid-cli")
        subprocess.run(["npm", "install", "-g", "@mermaid-js/mermaid-cli"], check=True)
    except FileNotFoundError:
        print(
            "Error: 'npm' command was not found while attempting to run it.\n"
            "Please make sure Node.js is installed and available in your system PATH.\n"
            "Visit https://nodejs.org to install it."
        )
        sys.exit(1)
    except subprocess.CalledProcessError:
        print("Error: Failed to install Mermaid CLI using npm.")
        sys.exit(1)


def check_dependencies():
    """Check for required dependencies."""
    ensure_dependency(NODE_COMMAND, install_instructions="Install Node.js from https://nodejs.org/")
    ensure_dependency(MMDC_COMMAND, install_callback=install_mermaid_cli)

# === FILE HANDLING ===

def load_json(filepath):
    """Load and parse JSON data from file."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)

def write_mermaid_file(lines, filepath):
    """Write Mermaid diagram lines to file."""
    try:
        with open(filepath, "w") as f:
            f.write("\n".join(lines))
    except Exception as e:
        print(f"Failed to write Mermaid file: {e}")
        sys.exit(1)

# === RENDERING ===

def render_mermaid(mermaid_file, output_file, mmdc_cmd):
    """Render Mermaid file to image using Mermaid CLI."""
    try:
        subprocess.run([mmdc_cmd, "-i", mermaid_file, "-o", output_file], check=True)
        print(f"Diagram saved as: {output_file}")
    except subprocess.CalledProcessError:
        print("Failed to generate Mermaid diagram.")
        sys.exit(1)

# === MAIN ===

def main():
    """Main program entry point."""
    check_dependencies()
    site_data = load_json(JSON_FILE)

    main_pages = site_data.get(KEY_MAIN_PAGES, {})
    project_pages = site_data.get(KEY_PROJECT_PAGES, {})
    links = site_data.get(KEY_LINKS, [])

    mermaid_lines = ["graph TD\n"]

    # Main pages
    mermaid_lines.append(f"  subgraph {MAIN_PAGES_LABEL} [{MAIN_PAGES_TITLE}]")
    for name, file in main_pages.items():
        mermaid_lines.append(f"    {name}[{file}]")
    mermaid_lines.append("  end\n")

    # Project pages
    mermaid_lines.append(f"  subgraph {PROJECT_PAGES_LABEL} [{PROJECT_PAGES_TITLE}]")
    for name, file in project_pages.items():
        mermaid_lines.append(f"    {name}[{file}]")
    mermaid_lines.append("  end\n")

    # Link definitions from JSON
    for source, target in links:
        mermaid_lines.append(f"  {source} --> {target}")

    write_mermaid_file(mermaid_lines, MERMAID_FILE)
    render_mermaid(MERMAID_FILE, OUTPUT_FILE, MMDC_COMMAND)


if __name__ == "__main__":
    main()
