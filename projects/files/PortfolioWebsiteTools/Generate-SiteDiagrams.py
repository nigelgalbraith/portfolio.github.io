import json
import subprocess
import sys
import shutil
import os
from pathlib import Path

# === CONFIGS ===

DIAGRAMS = {
    "siteHTML_structure": {
        "json": "diagrams/SiteHTML-Structure.json",
        "mmd": "diagrams/SiteHTML-Structure.mmd",
        "svg": "diagrams/SiteHTML-Structure.svg",
        "png": "projects/images/main/original/SiteHTML-Structure.png",
        "main_label": "SitePages",
        "project_label": "ProjectPages",
        "main_title": "Main Pages",
        "project_title": "Project Pages",
        "key_main": "main_pages",
        "key_project": "project_pages",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    },
    "SiteJS_main": {
        "json": "diagrams/SiteJS-MainPages.json",
        "mmd": "diagrams/SiteJS-MainPages.mmd",
        "svg": "diagrams/SiteJS-MainPages.svg",
        "png": "projects/images/main/original/SiteJS-MainPages.png",
        "main_label": "HTMLPages",
        "project_label": "JavaScript",
        "third_label": "JSONData",
        "main_title": "HTML Pages",
        "project_title": "JavaScript",
        "third_title": "JSON Data",
        "key_main": "HTMLPages",
        "key_project": "JavaScript",
        "key_third": "JSONData",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    },
    "SiteJS_projects": {
        "json": "diagrams/SiteJS-ProjectPages.json",
        "mmd": "diagrams/SiteJS-ProjectPages.mmd",
        "svg": "diagrams/SiteJS-ProjectPages.svg",
        "png": "projects/images/main/original/SiteJS-ProjectPages.png",
        "main_label": "HTMLPages",
        "project_label": "JavaScript",
        "main_title": "HTML Pages",
        "project_title": "JavaScript",
        "key_main": "HTMLPages",
        "key_project": "JavaScript",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map",
        "key_third": "JSONData",
        "third_label": "JSONData",
        "third_title": "JSON Data"
    }
}

CONFIG_FILE = "diagrams/site-mermaid-config.json"

# === EXECUTABLES ===

NODE_COMMAND = "node"
MMDC_COMMAND = "mmdc"

REQUIRED_COMMANDS = [
    ("node", "Install Node.js from https://nodejs.org/"),
    ("mmdc", None)
]

# === DEPENDENCIES ===

def ensure_dependency(command, install_instructions=None, install_callback=None):
    if shutil.which(command):
        return
    print(f"Missing required dependency: '{command}'")
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
    if not shutil.which("npm"):
        print(
            "Error: 'npm' not found.\n"
            "1. Install Node.js from https://nodejs.org\n"
            "2. Ensure 'Add to PATH' is checked during installation\n"
            "3. Restart terminal/IDE"
        )
        sys.exit(1)
    print("Running: npm install -g @mermaid-js/mermaid-cli")
    subprocess.run(["npm", "install", "-g", "@mermaid-js/mermaid-cli"], check=True, shell=True)

# === FILE HANDLING ===

def load_json(filepath):
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)

def write_mermaid_file(lines, filepath):
    try:
        with open(filepath, "w") as f:
            f.write("\n".join(lines))
    except Exception as e:
        print(f"Failed to write Mermaid file: {e}")
        sys.exit(1)

# === RENDERING ===

def render_mermaid_files(mermaid_file, svg_output, png_output, mmdc_cmd, config_path=None):
    try:
        base_cmd = [mmdc_cmd, "-i", mermaid_file]
        if config_path:
            base_cmd.extend(["-c", config_path])
        subprocess.run(base_cmd + ["-o", svg_output], check=True, shell=True)
        print(f"Diagram saved as: {svg_output}")
        subprocess.run(base_cmd + ["-o", png_output, "--scale", "4"], check=True, shell=True)
        print(f"High-quality PNG saved to: {png_output}")
    except subprocess.CalledProcessError:
        print("Failed to generate Mermaid diagram.")
        sys.exit(1)

# === MAIN ===

def main():
    for cmd, instructions in REQUIRED_COMMANDS:
        if cmd == "mmdc":
            ensure_dependency(cmd, install_callback=install_mermaid_cli)
        else:
            ensure_dependency(cmd, install_instructions=instructions)

    for diagram_name, config in DIAGRAMS.items():
        print(f"\nProcessing: {diagram_name}")
        site_data = load_json(config["json"])

        mermaid_lines = ["graph TD\n"]

        # Handle multiple layers: main, project, and optionally third
        for group in [("key_main", "main_label", "main_title"),
                      ("key_project", "project_label", "project_title"),
                      ("key_third", "third_label", "third_title")]:
            key, label_key, title_key = group
            if key in config and config[key] in site_data:
                items = site_data[config[key]]
                label = config.get(label_key, label_key)
                title = config.get(title_key, label)
                mermaid_lines.append(f"  subgraph {label} [{title}]")
                for name, file in items.items():
                    mermaid_lines.append(f"    {name}[{file}]")
                mermaid_lines.append("  end\n")

        # Edges, styles, classes
        for source, target in site_data.get(config["key_links"], []):
            mermaid_lines.append(f"  {source} --> {target}")
        for node, style in site_data.get(config["key_styles"], {}).items():
            mermaid_lines.append(f"  style {node} {style}")
        for class_name, definition in site_data.get(config["key_classes"], {}).items():
            mermaid_lines.append(f"  classDef {class_name} {definition}")
        for node, class_name in site_data.get(config["key_class_map"], {}).items():
            mermaid_lines.append(f"  class {node} {class_name}")

        write_mermaid_file(mermaid_lines, config["mmd"])
        render_mermaid_files(config["mmd"], config["svg"], config["png"], MMDC_COMMAND, config_path=CONFIG_FILE)

if __name__ == "__main__":
    main()
